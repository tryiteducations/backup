// FILE: supabase/functions/tournament-results/index.ts
// TryIT — 8 PM Tournament Results & Prize Dispatch
// Called by admin OR by scheduled cron at 20:00 IST
// ONLY DB writes in the entire tournament: max 100 prize rows + status update
// Reads from tournament_submissions (already written by 4 PM batch)
import { serve }       from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get tournament_id from request or find the one that just ended
    const body = await req.json().catch(() => ({}))
    let tournamentId = body.tournament_id

    if (!tournamentId) {
      // Find tournaments in 'computing' status whose results_at has passed
      const { data: ts } = await supabase
        .from('tournaments')
        .select('tournament_id, results_at')
        .eq('status', 'computing')
        .lte('results_at', new Date().toISOString())
        .limit(5)

      if (!ts?.length) {
        return new Response(JSON.stringify({ message: 'No tournaments ready for results' }), {
          headers: { ...CORS, 'Content-Type': 'application/json' }
        })
      }
      tournamentId = ts[0].tournament_id
    }

    console.log('[TryIT] Dispatching results for:', tournamentId)

    // ── 1. CALL prize dispatch function ──────────────────────────────────
    const { error: prizeError } = await supabase.rpc('dispatch_tournament_prizes', {
      p_tournament_id: tournamentId
    })

    if (prizeError) throw prizeError

    // ── 2. DISPATCH PUSH NOTIFICATIONS to all participants ────────────────
    const { data: registrations } = await supabase
      .from('tournament_registrations')
      .select('user_id, notify_parent, parent_user_id')
      .eq('tournament_id', tournamentId)
      .eq('status', 'submitted')
      .limit(10000)  // process in batches for massive tournaments

    if (registrations?.length) {
      // Build notification rows
      const notifications = registrations.map(r => ({
        user_id:     r.user_id,
        notif_type:  'tournament_results_live',
        title:       '🏆 Tournament Results are LIVE!',
        body:        'Your All India rank has been revealed. Open TryIT to see where you stand!',
        deep_link:   `/tournament/${tournamentId}/results`,
        send_at:     new Date().toISOString(),
      }))

      // Parent notifications
      const parentNotifs = registrations
        .filter(r => r.notify_parent && r.parent_user_id)
        .map(r => ({
          user_id:     r.parent_user_id,
          notif_type:  'parent_child_result',
          title:       '📊 Your child\'s tournament results are ready',
          body:        'Open TryIT to see their All India rank and performance analysis.',
          deep_link:   `/family`,
          send_at:     new Date().toISOString(),
        }))

      // Insert in batches of 500
      const allNotifs = [...notifications, ...parentNotifs]
      for (let i = 0; i < allNotifs.length; i += 500) {
        await supabase.from('notification_queue').insert(allNotifs.slice(i, i + 500))
      }
    }

    // ── 3. UPGRADE PLANS for prize winners ────────────────────────────────
    const { data: winners } = await supabase
      .from('tournament_results')
      .select('user_id, prize_awarded, plan_upgraded')
      .eq('tournament_id', tournamentId)
      .eq('plan_upgraded', true)
      .limit(100)

    for (const winner of winners || []) {
      const reward = winner.prize_awarded

      let planTier = null
      let monthsToAdd = 0

      if (reward?.includes('1_year_ultra'))   { planTier = 'ultra'; monthsToAdd = 12 }
      else if (reward?.includes('6_month_ultra')) { planTier = 'ultra'; monthsToAdd = 6 }
      else if (reward?.includes('3_month_pro'))   { planTier = 'pro';   monthsToAdd = 3 }
      else if (reward?.includes('1_month_pro'))   { planTier = 'pro';   monthsToAdd = 1 }

      if (planTier) {
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + monthsToAdd)

        // Update subscription (upsert)
        await supabase.from('subscriptions').upsert({
          user_id:     winner.user_id,
          plan_tier:   planTier,
          starts_at:   new Date().toISOString(),
          expires_at:  expiresAt.toISOString(),
          source:      'tournament_prize',
          tournament_id: tournamentId,
        }, { onConflict: 'user_id' })

        // Notify winner
        await supabase.from('notification_queue').insert({
          user_id:    winner.user_id,
          notif_type: 'prize_awarded',
          title:      '🎉 You won a prize!',
          body:       `Congratulations! You earned: ${reward.replace(/_/g,' ')}. Your account has been upgraded!`,
          deep_link:  '/profile',
          send_at:    new Date().toISOString(),
        })
      }
    }

    // ── 4. PIN AMBASSADORS on leaderboard ─────────────────────────────────
    const { data: ambassadors } = await supabase
      .from('tournament_results')
      .select('user_id, all_india_rank, raw_score, pin_days')
      .eq('tournament_id', tournamentId)
      .eq('ambassador', true)
      .limit(10)

    // Add activity feed entries for top performers
    for (const amb of ambassadors || []) {
      await supabase.from('leaderboard_activity_feed').insert({
        user_id:       amb.user_id,
        user_name:     'Champion',
        activity_type: 'rank_milestone',
        display_text:  `reached All India Rank #${amb.all_india_rank} in tournament`,
        opt_in:        true,
      })
    }

    console.log('[TryIT] Results dispatched successfully:', {
      tournament_id: tournamentId,
      participants:  registrations?.length || 0,
      winners:       winners?.length || 0,
      ambassadors:   ambassadors?.length || 0,
    })

    return new Response(JSON.stringify({
      success: true,
      tournament_id: tournamentId,
      participants_notified: registrations?.length || 0,
      winners_upgraded: winners?.length || 0,
    }), {
      headers: { ...CORS, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[TryIT] Results dispatch error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    })
  }
})