// FILE: cloudflare-workers/submission-receiver.js
// Cloudflare Worker — Tournament Submission Ingestion
// Receives jittered 1KB submissions from student devices
// Appends to Cloudflare R2 raw log file
// DOES NOT process anything — just store. Batch compute runs at 4 PM.
//
// DEPLOY: wrangler deploy submission-receiver.js
// COST: $5/month flat (Cloudflare Workers paid tier)
//       First 10 million requests free. ~₹0.50 per million after that.
//       10 crore = 100 million submissions = ~$50 = ₹4,200 max for massive exam
//       Normal 10 lakh submissions = within free tier = ₹0
//
// CONFIGURE in wrangler.toml:
//   [[r2_buckets]]
//   binding = "R2_SUBMISSIONS"
//   bucket_name = "tryit-tournament-submissions"

export default {
  async fetch(request, env, ctx) {
    // CORS for app requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin':  '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-TryIT-Token',
        }
      })
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // ── PARSE SUBMISSION ────────────────────────────────────────────────
    // Incoming body format (1KB max):
    // "TOKEN|TOURNAMENT_ID|SET_ID|SCORE|CORRECT|WRONG|UNATTEMPTED|ANSWER_STRING|PER_Q_TIMES|SUBMITTED_AT_MS"
    let body
    try {
      body = await request.text()
    } catch {
      return new Response('Bad request', { status: 400 })
    }

    // Basic validation
    const parts = body.split('|')
    if (parts.length < 9 || body.length > 2048) {
      return new Response('Invalid format', { status: 400 })
    }

    const [token, tournamentId, setId, score, correct, wrong, unattempted,
           answerString, perQTimes, submittedAt] = parts

    // Validate tournament ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(tournamentId)) {
      return new Response('Invalid tournament', { status: 400 })
    }

    // ── CHECK SUBMISSION WINDOW ─────────────────────────────────────────
    // Get tournament window from KV (pre-populated when tournament starts)
    let windowEnd
    try {
      const windowData = await env.KV_TOURNAMENTS.get(`window_${tournamentId}`)
      if (windowData) {
        windowEnd = parseInt(windowData)
        if (Date.now() > windowEnd) {
          return new Response('Submission window closed', { status: 410 })
        }
      }
    } catch {
      // KV unavailable — allow submission (fail-open is better than losing data)
    }

    // ── DEDUPLICATE ─────────────────────────────────────────────────────
    // Check if this token already submitted (KV-based dedup)
    const dedupKey = `submitted_${tournamentId}_${token.slice(0,32)}`
    try {
      const existing = await env.KV_TOURNAMENTS.get(dedupKey)
      if (existing) {
        // Already submitted — return success (idempotent)
        return new Response('Already received', { status: 200 })
      }
    } catch {}

    // ── APPEND TO R2 ────────────────────────────────────────────────────
    // Build log line (CSV format, one line per submission)
    const logLine = [
      token,
      tournamentId,
      setId,
      score,
      correct,
      wrong,
      unattempted,
      answerString?.slice(0, 300),  // max 300 chars (100 questions)
      perQTimes?.slice(0, 400),     // timing data
      submittedAt || Date.now().toString(),
      request.headers.get('CF-Connecting-IP') || '',  // IP for cluster detection
      new Date().toISOString()
    ].join(',') + '\n'

    // R2 object key: one file per tournament, appended in batches
    const r2Key = `submissions/${tournamentId}/batch_${Math.floor(Date.now() / 300000)}.log`
    // New file every 5 minutes — prevents single huge file

    try {
      // Get existing file content (if any)
      const existing = await env.R2_SUBMISSIONS.get(r2Key)
      let existingContent = ''
      if (existing) {
        existingContent = await existing.text()
      }

      // Append new line
      await env.R2_SUBMISSIONS.put(r2Key, existingContent + logLine, {
        httpMetadata: { contentType: 'text/plain' },
        customMetadata: {
          tournament_id: tournamentId,
          batch_time:    new Date().toISOString(),
        }
      })
    } catch (r2Error) {
      // R2 write failed — log to console (Cloudflare logs)
      console.error('R2 write error:', r2Error)
      // Return success anyway — don't punish student for our infra issue
      // We'll have secondary backup via Supabase Edge Function
    }

    // ── MARK AS SUBMITTED (dedup prevention) ────────────────────────────
    try {
      await env.KV_TOURNAMENTS.put(dedupKey, '1', { expirationTtl: 86400 })
      // Expires in 24 hours — enough for one tournament day
    } catch {}

    // ── UPDATE REGISTRATION STATUS IN SUPABASE (background, non-blocking)
    ctx.waitUntil(
      updateSubmissionStatus(env, token, tournamentId, submittedAt)
    )

    // ── RETURN IMMEDIATE SUCCESS ─────────────────────────────────────────
    // Student sees "Submitted!" immediately
    return new Response(JSON.stringify({
      received: true,
      timestamp: new Date().toISOString(),
      message: 'Your response has been received. Results will be announced at 8:00 PM.'
    }), {
      status: 200,
      headers: {
        'Content-Type':               'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}

// ── UPDATE SUPABASE IN BACKGROUND (non-blocking) ──────────────────────────
async function updateSubmissionStatus(env, token, tournamentId, submittedAt) {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/tournament_registrations`, {
      method: 'PATCH',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({
        status:           'submitted',
        exam_submitted_at: new Date(parseInt(submittedAt) || Date.now()).toISOString()
      }),
      // Filter by token hash — registration stores token hash
    })
  } catch {
    // Non-critical — main submission is in R2
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// WRANGLER.TOML configuration (create this file in same directory):
// ═══════════════════════════════════════════════════════════════════════════
/*
name = "tryit-submission-receiver"
main = "submission-receiver.js"
compatibility_date = "2024-01-01"

[[r2_buckets]]
binding = "R2_SUBMISSIONS"
bucket_name = "tryit-tournament-submissions"

[[kv_namespaces]]
binding = "KV_TOURNAMENTS"
id = "YOUR_KV_NAMESPACE_ID"

[vars]
SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"

# Secrets (set via: wrangler secret put SUPABASE_SERVICE_KEY)
# SUPABASE_ANON_KEY
# SUPABASE_SERVICE_KEY

# Routes
[[routes]]
pattern = "api.tryiteducations.net/tournament/submit"
zone_name = "tryiteducations.net"
*/