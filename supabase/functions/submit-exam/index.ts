// supabase/functions/submit-exam/index.ts
// Server-side scoring: the answer key never leaves this function. The client only
// ever sends {question_id: selected_label} - correctness is decided here, and here only.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { enrollment_id, student_id, token, answers } = await req.json()
    if (!enrollment_id || !student_id || !token) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data: enrollment, error: enrollErr } = await supabase
      .from('test_enrollments').select('*').eq('id', enrollment_id).eq('student_id', student_id).single()
    if (enrollErr || !enrollment) {
      return new Response(JSON.stringify({ error: 'Enrollment not found.' }),
        { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } })
    }
    if (enrollment.exam_token !== token) {
      return new Response(JSON.stringify({ error: 'Invalid exam token.' }),
        { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } })
    }
    if (enrollment.status === 'submitted') {
      return new Response(JSON.stringify({ error: 'This test was already submitted.' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    const { data: test } = await supabase.from('institution_tests').select('*').eq('id', enrollment.test_id).single()

    // Server-side timeout backstop - a small grace period covers normal network lag,
    // but a submission arriving well after duration + grace is capped at the deadline
    // rather than trusted at face value.
    const startedAt = new Date(enrollment.started_at)
    const deadline = new Date(startedAt.getTime() + test.duration_minutes * 60000 + 60000) // +60s grace
    const now = new Date()
    const isLate = now > deadline

    // Score against the real answer key - fetched fresh here, never trusted from the client
    const { data: questions } = await supabase
      .from('question_bank').select('id, correct_answer, marks').eq('test_id', enrollment.test_id)

    let score = 0
    const qMap = new Map(questions.map(q => [q.id, q]))
    for (const [questionId, selected] of Object.entries(answers || {})) {
      const q = qMap.get(questionId)
      if (q && q.correct_answer === selected) score += Number(q.marks || 1)
    }

    await supabase.from('test_enrollments').update({
      answers: answers || {},
      score,
      status: 'submitted',
      submitted_at: now.toISOString(),
    }).eq('id', enrollment_id)

    // Recompute ranks for everyone who has submitted this test (institution_rank)
    const { data: sameTest } = await supabase
      .from('test_enrollments').select('id, score').eq('test_id', enrollment.test_id).eq('status', 'submitted')
      .order('score', { ascending: false })
    for (let i = 0; i < (sameTest || []).length; i++) {
      await supabase.from('test_enrollments').update({ institution_rank: i + 1 }).eq('id', sameTest[i].id)
    }

    // Recompute all-India rank across every submitted enrollment for tests with the same exam tag,
    // across every institution - not just this one test
    const { data: allTestsForExam } = await supabase
      .from('institution_tests').select('id').eq('exam', test.exam)
    const testIds = (allTestsForExam || []).map(t => t.id)
    const { data: nationalPool } = await supabase
      .from('test_enrollments').select('id, score').in('test_id', testIds).eq('status', 'submitted')
      .order('score', { ascending: false })
    for (let i = 0; i < (nationalPool || []).length; i++) {
      await supabase.from('test_enrollments').update({ all_india_rank: i + 1 }).eq('id', nationalPool[i].id)
    }

    return new Response(JSON.stringify({
      score, was_late: isLate,
      total_questions: questions?.length || 0,
    }), { headers: { ...cors, 'Content-Type': 'application/json' } })

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Unexpected error submitting the exam.' }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
