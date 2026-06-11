import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { user_id, exam_id, exam_name, score, correct, incorrect, skipped, time_taken, test_type } = await req.json()

  // Calculate XP and coins
  const xp_earned    = Math.round(score * 1.5)
  const coins_earned = Math.round(score * 1.5)

  // Save result
  const { data: result } = await supabase.from('test_results').insert({
    user_id, exam_id, exam_name, score, correct, incorrect, skipped, time_taken, test_type, xp_earned, coins_earned
  }).select().single()

  // Award coins
  await supabase.from('coin_transactions').insert({
    user_id, amount: coins_earned, source: 'test',
    description: `${exam_name} — ${score.toFixed(1)}%`
  })

  // Update leaderboard (only store name+level+state — no private data)
  const { data: profile } = await supabase.from('profiles').select('name,level,state').eq('id', user_id).single()
  if (profile) {
    await supabase.from('leaderboard_daily').upsert({
      user_id, exam_id, score,
      user_name:  profile.name,
      user_level: profile.level,
      user_state: profile.state,
      date: new Date().toISOString().split('T')[0],
    }, { onConflict: 'user_id,exam_id,date' })
  }

  // Send notification to user
  await supabase.from('notifications').insert({
    user_id,
    type:  'test_result',
    title: `Test complete! ${score.toFixed(1)}%`,
    body:  `You earned ${coins_earned} coins and ${xp_earned} XP`,
    link:  '/analytics',
  })

  return new Response(JSON.stringify({ result, xp_earned, coins_earned }), {
    headers: { ...cors, 'Content-Type':'application/json' }
  })
})
