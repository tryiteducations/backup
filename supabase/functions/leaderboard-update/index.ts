import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // Get today's leaderboard entries sorted by score
  const today = new Date().toISOString().split('T')[0]
  const { data: entries } = await supabase.from('leaderboard_daily')
    .select('*').eq('date', today).order('score', { ascending: false })

  if (!entries?.length) return new Response('No entries', { headers: cors })

  // Assign national ranks
  const updates = entries.map((e, i) => ({ ...e, rank_national: i + 1 }))

  // Batch update ranks
  for (const entry of updates) {
    await supabase.from('leaderboard_daily')
      .update({ rank_national: entry.rank_national })
      .eq('id', entry.id)
  }

  // Update profiles with current rank
  for (const entry of updates) {
    await supabase.from('profiles')
      .update({ rank: entry.rank_national })
      .eq('id', entry.user_id)
  }

  return new Response(JSON.stringify({ updated: updates.length, date: today }), {
    headers: { ...cors, 'Content-Type':'application/json' }
  })
})
