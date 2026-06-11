import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const { user_id, last_sync } = await req.json()

    const since = last_sync ? new Date(last_sync).toISOString() : new Date(0).toISOString()

    // Fetch all changes since last sync in ONE round trip
    const [profile, results, notifications, coins, doubts] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user_id).single(),
      supabase.from('test_results').select('id,score,exam_name,taken_at,rank_national,coins_earned')
        .eq('user_id', user_id).gte('taken_at', since).order('taken_at', { ascending:false }).limit(10),
      supabase.from('notifications').select('*').eq('user_id', user_id)
        .eq('is_read', false).order('created_at', { ascending:false }).limit(20),
      supabase.from('coin_transactions').select('amount,source,description,created_at')
        .eq('user_id', user_id).gte('created_at', since).limit(50),
      supabase.from('doubts').select('id,question,answer_count,is_resolved')
        .eq('user_id', user_id).gte('created_at', since).limit(10),
    ])

    return new Response(JSON.stringify({
      profile: profile.data,
      new_results: results.data || [],
      unread_notifications: notifications.data || [],
      new_coin_txs: coins.data || [],
      doubt_updates: doubts.data || [],
      synced_at: new Date().toISOString(),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status:500, headers: corsHeaders })
  }
})
