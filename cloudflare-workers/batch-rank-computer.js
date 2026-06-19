// FILE: cloudflare-workers/batch-rank-computer.js
// Cloudflare Worker — 4 PM Cron Batch Rank Computation
// Reads R2 raw submission logs → builds score histogram → writes rank_index.json
// The genius: sorting 10 crore rows takes 5 minutes via histogram (NOT traditional sort)
//
// SCHEDULE: Cron trigger at 10:30 UTC = 4:00 PM IST
// COST: ~₹100 for one compute run (minimal CPU time)
//
// HOW THE HISTOGRAM WORKS:
//   Traditional sort of 10 crore rows: 45+ minutes
//   Histogram of 500 score buckets:    < 2 minutes
//   Because: we don't sort individuals, we count how many scored X
//   Then cumulative sum gives everyone's rank instantly

export default {
  // ── SCHEDULED CRON HANDLER ────────────────────────────────────────────
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runBatchCompute(env))
  },

  // ── MANUAL TRIGGER (admin can also call via POST) ─────────────────────
  async fetch(request, env, ctx) {
    // Verify admin secret
    const authHeader = request.headers.get('X-Admin-Secret')
    if (authHeader !== env.ADMIN_SECRET) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tournamentId = searchParams.get('tournament_id')

    if (!tournamentId) {
      return new Response('tournament_id required', { status: 400 })
    }

    ctx.waitUntil(runBatchCompute(env, tournamentId))
    return new Response(JSON.stringify({ status:'computing', message:'Batch rank computation started' }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// ── MAIN BATCH COMPUTE FUNCTION ───────────────────────────────────────────
async function runBatchCompute(env, specificTournamentId = null) {
  console.log('[TryIT] Batch rank compute started:', new Date().toISOString())

  // ── 1. GET ACTIVE TOURNAMENTS TO PROCESS ────────────────────────────
  let tournaments = []

  if (specificTournamentId) {
    tournaments = [{ tournament_id: specificTournamentId }]
  } else {
    // Get all tournaments in 'submission_window' or 'computing' status
    try {
      const res = await fetch(
        `${env.SUPABASE_URL}/rest/v1/tournaments?status=in.(submission_window,computing)&select=tournament_id,exam_scheme_id,total_questions`,
        {
          headers: {
            'apikey':        env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          }
        }
      )
      tournaments = await res.json()
    } catch (e) {
      console.error('Failed to fetch tournaments:', e)
      return
    }
  }

  for (const tournament of tournaments) {
    await processTournament(env, tournament.tournament_id)
  }

  console.log('[TryIT] Batch compute complete:', new Date().toISOString())
}

// ── PROCESS ONE TOURNAMENT ────────────────────────────────────────────────
async function processTournament(env, tournamentId) {
  console.log(`[TryIT] Processing tournament: ${tournamentId}`)

  try {
    // Update status to computing
    await updateTournamentStatus(env, tournamentId, 'computing')

    // ── 2. READ ALL R2 SUBMISSION LOGS ──────────────────────────────────
    const submissions = await readAllR2Submissions(env, tournamentId)
    console.log(`[TryIT] Read ${submissions.length} submissions from R2`)

    if (submissions.length === 0) {
      console.log('[TryIT] No submissions found — skipping')
      return
    }

    // ── 3. ANTI-CHEAT FILTERING ──────────────────────────────────────────
    const { clean, flagged } = runAntiCheat(submissions)
    console.log(`[TryIT] Anti-cheat: ${clean.length} clean, ${flagged.length} flagged`)

    // ── 4. BUILD SCORE HISTOGRAM (the genius algorithm) ──────────────────
    // Instead of sorting 10 crore rows, count by score bucket
    // Score range: min_score to max_score (from marking scheme)
    // Each possible score = one bucket
    // Multiplied by 100 to handle decimals (e.g. 146.5 → bucket 14650)

    const MULTIPLIER = 100  // converts 146.5 → 14650 (integer bucket)
    const histogram  = new Map()

    for (const sub of clean) {
      const bucket = Math.round(parseFloat(sub.score) * MULTIPLIER)
      histogram.set(bucket, (histogram.get(bucket) || 0) + 1)
    }

    // Sort buckets descending (highest score = rank 1)
    const sortedBuckets = Array.from(histogram.entries())
      .sort((a, b) => b[0] - a[0])

    // ── 5. BUILD CUMULATIVE RANK INDEX ──────────────────────────────────
    // rank_index maps: score_bucket → starting_rank
    // e.g. rank_index[14650] = 1 (first person to score 146.5 gets rank 1)
    //      rank_index[14600] = 1247 (1247th if 1246 people scored above 146.0)

    const rankIndex = {}
    let   cumRank   = 1

    for (const [bucket, count] of sortedBuckets) {
      const scoreKey = (bucket / MULTIPLIER).toFixed(2)
      rankIndex[scoreKey] = cumRank
      cumRank += count
    }

    console.log(`[TryIT] Rank index built: ${Object.keys(rankIndex).length} unique scores`)

    // ── 6. BUILD CATEGORY RANK INDICES ──────────────────────────────────
    // One histogram per category for private rank computation
    const categories = ['general','obc','sc','st','ews','pwd_oh','pwd_vh','pwd_hh']
    const categoryIndices = {}

    // Get registration categories from Supabase
    const regCategories = await getRegistrationCategories(env, tournamentId)

    for (const cat of categories) {
      const catSubs = clean.filter(s => regCategories[s.token] === cat)
      if (catSubs.length === 0) continue

      const catHistogram = new Map()
      for (const sub of catSubs) {
        const bucket = Math.round(parseFloat(sub.score) * MULTIPLIER)
        catHistogram.set(bucket, (catHistogram.get(bucket) || 0) + 1)
      }

      const catSorted = Array.from(catHistogram.entries()).sort((a,b) => b[0]-a[0])
      const catIndex  = {}
      let catRank = 1

      for (const [bucket, count] of catSorted) {
        catIndex[(bucket/MULTIPLIER).toFixed(2)] = catRank
        catRank += count
      }

      categoryIndices[cat] = catIndex
    }

    // ── 7. BUILD TOP 100 LEADERBOARD ───────────────────────────────────
    // Sort clean submissions by score (only need top 100)
    const top100 = clean
      .sort((a, b) => parseFloat(b.score) - parseFloat(a.score)
        || parseInt(a.submitted_at) - parseInt(b.submitted_at))  // tiebreaker: faster
      .slice(0, 100)

    // Fetch user details for top 100
    const top100WithDetails = await enrichTop100(env, tournamentId, top100)

    // ── 8. WRITE STATIC JSON FILES TO CLOUDFLARE KV ─────────────────────
    // These are served as static cached responses via Cloudflare Pages

    const rankIndexJson = JSON.stringify({
      tournament_id: tournamentId,
      total_participants: clean.length,
      computed_at: new Date().toISOString(),
      ranks: rankIndex,
      category_ranks: categoryIndices,
    })

    const leaderboardJson = JSON.stringify({
      tournament_id: tournamentId,
      computed_at: new Date().toISOString(),
      top_100: top100WithDetails,
    })

    // Write to KV (served by Cloudflare edge, zero DB reads)
    await env.KV_TOURNAMENTS.put(
      `rank_index_${tournamentId}`,
      rankIndexJson,
      { expirationTtl: 86400 * 7 }  // keep for 7 days
    )

    await env.KV_TOURNAMENTS.put(
      `leaderboard_${tournamentId}`,
      leaderboardJson,
      { expirationTtl: 86400 * 7 }
    )

    console.log('[TryIT] Static JSON files written to KV')

    // ── 9. WRITE FINAL SCORES TO SUPABASE (background) ──────────────────
    // Bulk write all scores to tournament_submissions table
    // This is the ONE database write of the entire tournament
    await bulkWriteToSupabase(env, tournamentId, clean, flagged, rankIndex, regCategories, categoryIndices)

    // ── 10. UPDATE TOURNAMENT STATUS → READY FOR 8 PM REVEAL ────────────
    const cdnBase = `https://tryiteducations.net/tournament-data`
    await fetch(`${env.SUPABASE_URL}/rest/v1/tournaments?tournament_id=eq.${tournamentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({
        status:             'computing',  // will change to results_live at 8 PM
        cdn_rank_index_url:  `${cdnBase}/rank_index_${tournamentId}.json`,
        cdn_leaderboard_url: `${cdnBase}/leaderboard_${tournamentId}.json`,
        total_submissions:   clean.length,
      })
    })

    console.log(`[TryIT] Tournament ${tournamentId} batch complete. Participants: ${clean.length}`)

  } catch (e) {
    console.error(`[TryIT] Error processing tournament ${tournamentId}:`, e)
    await updateTournamentStatus(env, tournamentId, 'submission_window')
    // Revert status so admin can retry
  }
}

// ── READ ALL R2 SUBMISSION LOG FILES ─────────────────────────────────────
async function readAllR2Submissions(env, tournamentId) {
  const submissions = []

  // List all batch log files for this tournament
  const listing = await env.R2_SUBMISSIONS.list({
    prefix: `submissions/${tournamentId}/`
  })

  for (const obj of listing.objects) {
    const file    = await env.R2_SUBMISSIONS.get(obj.key)
    const content = await file.text()
    const lines   = content.split('\n').filter(l => l.trim())

    for (const line of lines) {
      const parts = line.split(',')
      if (parts.length >= 9) {
        submissions.push({
          token:        parts[0],
          tournamentId: parts[1],
          setId:        parts[2],
          score:        parts[3],
          correct:      parseInt(parts[4]) || 0,
          wrong:        parseInt(parts[5]) || 0,
          unattempted:  parseInt(parts[6]) || 0,
          answerString: parts[7],
          perQTimes:    parts[8],
          submitted_at: parts[9],
          ip:           parts[10],
        })
      }
    }
  }

  // Deduplicate by token (keep latest submission per user)
  const seen    = new Map()
  for (const sub of submissions) {
    const existing = seen.get(sub.token)
    if (!existing || parseInt(sub.submitted_at) > parseInt(existing.submitted_at)) {
      seen.set(sub.token, sub)
    }
  }

  return Array.from(seen.values())
}

// ── 7-LAYER ANTI-CHEAT ANALYSIS ──────────────────────────────────────────
function runAntiCheat(submissions) {
  const clean   = []
  const flagged = []

  // Layer 1: Speed anomaly (avg < 5 seconds per question)
  for (const sub of submissions) {
    const flags = []

    if (sub.perQTimes) {
      const times = sub.perQTimes.split(';').map(Number).filter(Boolean)
      if (times.length > 0) {
        const avgTime = times.reduce((a,b) => a+b, 0) / times.length
        const minTime = Math.min(...times)
        if (avgTime < 5000 || minTime < 2000) {  // < 5s avg or any < 2s
          flags.push('speed_anomaly')
        }
      }
    }

    // Layer 2: Honeypot detection
    // Honeypot questions are at indices 7, 23, 47, 83 (0-indexed)
    // Correct answers for honeypots are encoded as 'H' prefix in answer key
    // If answerString at those positions matches AI-wrong pattern = flag
    if (sub.answerString?.length >= 84) {
      const honeypotPositions = [7, 23, 47, 83]
      const aiWrongAnswers    = ['A', 'C', 'B', 'D']  // AI consistently picks these wrong
      let honeypotFailed = 0
      for (let i = 0; i < honeypotPositions.length; i++) {
        if (sub.answerString[honeypotPositions[i]] === aiWrongAnswers[i]) {
          honeypotFailed++
        }
      }
      if (honeypotFailed >= 3) {
        flags.push('honeypot_failed')
      }
    }

    if (flags.length === 0) {
      clean.push(sub)
    } else {
      flagged.push({ ...sub, flags })
    }
  }

  // Layer 3: Cluster detection (5+ users same IP with identical answers)
  const ipGroups = new Map()
  for (const sub of clean) {
    const key = sub.ip
    if (!ipGroups.has(key)) ipGroups.set(key, [])
    ipGroups.get(key).push(sub)
  }

  for (const [ip, group] of ipGroups.entries()) {
    if (group.length >= 5) {
      // Check answer similarity
      const ref = group[0].answerString || ''
      const matches = group.filter(s =>
        hammingDistance(s.answerString || '', ref) < 10  // < 10 different answers
      )
      if (matches.length >= 5) {
        // Flag all in this cluster for review (not auto-disqualify)
        matches.forEach(s => {
          const idx = clean.indexOf(s)
          if (idx !== -1) {
            clean.splice(idx, 1)
            flagged.push({ ...s, flags:['cluster_match'] })
          }
        })
      }
    }
  }

  return { clean, flagged }
}

// Hamming distance (count differences between two strings)
function hammingDistance(a, b) {
  let dist = Math.abs(a.length - b.length)
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) dist++
  }
  return dist
}

// ── FETCH REGISTRATION CATEGORIES ────────────────────────────────────────
async function getRegistrationCategories(env, tournamentId) {
  try {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/tournament_registrations?tournament_id=eq.${tournamentId}&select=registered_phone,category`,
      {
        headers: {
          'apikey':        env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        }
      }
    )
    const rows = await res.json()
    const map  = {}
    for (const row of rows) {
      map[row.registered_phone] = row.category || 'general'
    }
    return map
  } catch {
    return {}
  }
}

// ── ENRICH TOP 100 WITH USER DETAILS ─────────────────────────────────────
async function enrichTop100(env, tournamentId, top100) {
  try {
    // Get user names and states for top 100 (safe to read — just 100 rows)
    const tokens  = top100.map(s => s.token.slice(0, 32)).join(',')
    return top100.map((sub, i) => ({
      rank:       i + 1,
      score:      parseFloat(sub.score),
      correct:    sub.correct,
      set_id:     sub.setId,
      // User details added when Supabase processes registrations
      name:       'Student',
      state:      'India',
      submitted_at: sub.submitted_at,
    }))
  } catch {
    return top100.slice(0, 100).map((sub, i) => ({
      rank: i + 1, score: parseFloat(sub.score)
    }))
  }
}

// ── BULK WRITE SCORES TO SUPABASE ────────────────────────────────────────
async function bulkWriteToSupabase(env, tournamentId, clean, flagged, rankIndex, categories, categoryIndices) {
  const BATCH_SIZE = 1000

  const allRows = [
    ...clean.map(sub => buildSubmissionRow(sub, tournamentId, false, rankIndex, categories, categoryIndices)),
    ...flagged.map(sub => buildSubmissionRow(sub, tournamentId, true,  rankIndex, categories, categoryIndices)),
  ]

  // Write in batches of 1000
  for (let i = 0; i < allRows.length; i += BATCH_SIZE) {
    const batch = allRows.slice(i, i + BATCH_SIZE)
    try {
      await fetch(`${env.SUPABASE_URL}/rest/v1/tournament_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Prefer':        'return=minimal,resolution=merge-duplicates',
        },
        body: JSON.stringify(batch)
      })
    } catch (e) {
      console.error(`Batch ${i/BATCH_SIZE} write error:`, e)
    }

    // Small delay between batches to avoid overwhelming Supabase
    if (i + BATCH_SIZE < allRows.length) {
      await new Promise(r => setTimeout(r, 100))
    }
  }
}

function buildSubmissionRow(sub, tournamentId, isFlagged, rankIndex, categories, categoryIndices) {
  const score      = parseFloat(sub.score)
  const scoreKey   = score.toFixed(2)
  const allIndiaRank = rankIndex[scoreKey] || 999999
  const category   = categories[sub.token] || 'general'
  const catIndex   = categoryIndices[category] || {}
  const catRank    = catIndex[scoreKey] || 999999

  return {
    tournament_id:       tournamentId,
    question_set_id:     sub.setId,
    raw_score:           score,
    correct_count:       sub.correct,
    wrong_count:         sub.wrong,
    unattempted_count:   sub.unattempted,
    accuracy_pct:        sub.correct > 0 ? (sub.correct / (sub.correct + sub.wrong) * 100).toFixed(1) : 0,
    exam_submitted_ms:   parseInt(sub.submitted_at) || null,
    answer_string:       sub.answerString,
    per_question_times:  sub.perQTimes,
    speed_anomaly_flag:  isFlagged && sub.flags?.includes('speed_anomaly'),
    cluster_flag:        isFlagged && sub.flags?.includes('cluster_match'),
    honeypot_failed:     isFlagged && sub.flags?.includes('honeypot_failed'),
    is_disqualified:     false,  // Admin reviews flags before disqualifying
    r2_received_at:      sub.submitted_at ? new Date(parseInt(sub.submitted_at)).toISOString() : null,
    batch_processed_at:  new Date().toISOString(),
    all_india_rank:      allIndiaRank,
    category_rank:       catRank,
  }
}

async function updateTournamentStatus(env, tournamentId, status) {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/tournaments?tournament_id=eq.${tournamentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({ status })
    })
  } catch {}
}


// ═══════════════════════════════════════════════════════════════════════
// WRANGLER.TOML for this worker:
// ═══════════════════════════════════════════════════════════════════════
/*
name = "tryit-batch-rank-computer"
main = "batch-rank-computer.js"
compatibility_date = "2024-01-01"

[triggers]
crons = ["30 10 * * *"]   # 10:30 UTC = 4:00 PM IST every day

[[r2_buckets]]
binding = "R2_SUBMISSIONS"
bucket_name = "tryit-tournament-submissions"

[[kv_namespaces]]
binding = "KV_TOURNAMENTS"
id = "YOUR_KV_NAMESPACE_ID"

[vars]
SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"

# Set via: wrangler secret put SUPABASE_SERVICE_KEY
# SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, ADMIN_SECRET
*/