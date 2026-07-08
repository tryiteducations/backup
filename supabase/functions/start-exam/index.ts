// supabase/functions/start-exam/index.ts
// Server-side exam admission: the ONLY authoritative source for "can this student
// start now, and what questions do they get." Never trust a client-computed clock
// or a client-shuffled question set - both are trivially fakeable in dev tools.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' }

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let t = ''
  for (let i = 0; i < 10; i++) t += chars[Math.floor(Math.random() * chars.length)]
  return `TOKEN-${t}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { enrollment_id, student_id } = await req.json()
    if (!enrollment_id || !student_id) {
      return new Response(JSON.stringify({ error: 'Missing enrollment_id or student_id' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // 1. Load the enrollment and confirm it belongs to this student
    const { data: enrollment, error: enrollErr } = await supabase
      .from('test_enrollments').select('*').eq('id', enrollment_id).eq('student_id', student_id).single()
    if (enrollErr || !enrollment) {
      return new Response(JSON.stringify({ error: 'Enrollment not found.' }),
        { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    // Already admitted? Return the same token/questions again (idempotent - handles page refresh)
    if (enrollment.exam_token) {
      return new Response(JSON.stringify({
        token: enrollment.exam_token,
        question_order: enrollment.question_order,
        option_orders: enrollment.option_orders,
        started_at: enrollment.started_at,
      }), { headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    if (enrollment.status === 'submitted') {
      return new Response(JSON.stringify({ error: 'You have already submitted this test.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    // 2. Load the test and enforce the real server clock against scheduled_start/duration
    const { data: test, error: testErr } = await supabase
      .from('institution_tests').select('*').eq('id', enrollment.test_id).single()
    if (testErr || !test) {
      return new Response(JSON.stringify({ error: 'Test not found.' }),
        { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    const now = new Date()
    const start = new Date(test.scheduled_start)
    const end = new Date(start.getTime() + test.duration_minutes * 60000)
    // Small 5-minute grace window after start for students still logging in
    const lateJoinCutoff = new Date(start.getTime() + 5 * 60000)

    if (now < start) {
      return new Response(JSON.stringify({ error: 'This test has not started yet.', starts_at: test.scheduled_start }),
        { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } })
    }
    if (now > lateJoinCutoff) {
      // Mark absent - they never started within the join window
      await supabase.from('test_enrollments').update({ status: 'absent' }).eq('id', enrollment_id)
      return new Response(JSON.stringify({ error: 'The join window for this test has closed.' }),
        { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } })
    }
    if (now > end) {
      await supabase.from('test_enrollments').update({ status: 'absent' }).eq('id', enrollment_id)
      return new Response(JSON.stringify({ error: 'This test has already ended.' }),
        { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    // 3. Load the question bank for this test and build THIS student's shuffled set
    const { data: questions, error: qErr } = await supabase
      .from('question_bank').select('id, options').eq('test_id', test.id)
    if (qErr || !questions || questions.length === 0) {
      return new Response(JSON.stringify({ error: 'No questions have been published for this test yet.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    const questionOrder = shuffle(questions.map(q => q.id))
    const optionOrders = {}
    for (const q of questions) {
      optionOrders[q.id] = shuffle((q.options || []).map(o => o.label))
    }

    const token = randomToken()
    const startedAt = now.toISOString()

    const { error: updateErr } = await supabase.from('test_enrollments').update({
      exam_token: token,
      question_order: questionOrder,
      option_orders: optionOrders,
      status: 'attended',
      started_at: startedAt,
    }).eq('id', enrollment_id)

    if (updateErr) {
      return new Response(JSON.stringify({ error: 'Could not start the exam - please try again.' }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({
      token, question_order: questionOrder, option_orders: optionOrders,
      started_at: startedAt, duration_minutes: test.duration_minutes,
    }), { headers: { ...cors, 'Content-Type': 'application/json' } })

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Unexpected error starting the exam.' }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
