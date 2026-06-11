import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { user_id, transactions } = await req.json()

  // Batch insert all pending coin transactions
  const { data, error } = await supabase.from('coin_transactions')
    .insert(transactions.map((t: any) => ({ ...t, user_id })))

  if (error) return new Response(JSON.stringify({ error }), { status:500, headers: cors })

  // Get updated balance
  const { data: profile } = await supabase.from('profiles').select('coins').eq('id', user_id).single()

  return new Response(JSON.stringify({ processed: transactions.length, balance: profile?.coins }), {
    headers: { ...cors, 'Content-Type':'application/json' }
  })
})
