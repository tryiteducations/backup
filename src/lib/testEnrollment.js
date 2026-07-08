// src/lib/testEnrollment.js
// Institution-conducted test lifecycle: browse -> enroll -> admit (token) -> attend -> score -> rank
import { supabase } from './supabase'

function randomCode(prefix, len = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < len; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `${prefix}-${code}`
}

export const testEnrollment = {
  // ---- STUDENT SIDE ----

  // Browse live/upcoming tests, filterable by institution name, city, or exam/subject
  browseLiveTests: async ({ query = '', city = '', exam = '' } = {}) => {
    try {
      let q = supabase.from('institution_tests')
        .select('*, institution:institution_id(name, institution_name)')
        .in('status', ['upcoming', 'enrollment_closed'])
        .order('scheduled_start', { ascending: true })
      if (city) q = q.eq('city', city)
      if (exam) q = q.eq('exam', exam)
      const { data, error } = await q
      if (error) throw error
      if (!query.trim()) return data
      const ql = query.trim().toLowerCase()
      return (data || []).filter(t =>
        t.name?.toLowerCase().includes(ql) ||
        t.exam?.toLowerCase().includes(ql) ||
        t.subject?.toLowerCase().includes(ql) ||
        t.institution?.institution_name?.toLowerCase().includes(ql) ||
        t.institution?.name?.toLowerCase().includes(ql)
      )
    } catch (err) {
      console.error('browseLiveTests error:', err)
      return []
    }
  },

  // Student enrolls - blocked once enrollment_closes_at has passed
  enrollInTest: async (testId, studentId) => {
    try {
      const { data: test, error: testErr } = await supabase
        .from('institution_tests').select('*').eq('id', testId).single()
      if (testErr || !test) throw new Error('Test not found.')
      if (test.enrollment_closes_at && new Date() > new Date(test.enrollment_closes_at)) {
        throw new Error('Enrollment for this test has closed.')
      }
      const { data: existing } = await supabase
        .from('test_enrollments').select('id').eq('test_id', testId).eq('student_id', studentId).maybeSingle()
      if (existing) throw new Error('You are already enrolled in this test.')

      const enrollment_code = randomCode('ENR')
      const { data, error } = await supabase.from('test_enrollments').insert({
        test_id: testId, student_id: studentId,
        enrollment_code, status: 'enrolled',
      }).select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('enrollInTest error:', err)
      throw err
    }
  },

  getMyEnrollments: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('test_enrollments')
        .select('*, test:test_id(*)')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('getMyEnrollments error:', err)
      return []
    }
  },

  // ---- INSTITUTION SIDE ----

  createTest: async (institutionId, { name, exam, subject, city, hallId, questionPaperId, scheduledStart, durationMinutes }) => {
    try {
      const start = new Date(scheduledStart)
      const enrollmentClosesAt = new Date(start.getTime() - 2 * 60 * 60 * 1000) // 2 hours before
      const { data, error } = await supabase.from('institution_tests').insert({
        institution_id: institutionId,
        name, exam, subject, city,
        hall_id: hallId || null,
        question_paper_id: questionPaperId || null,
        scheduled_start: start.toISOString(),
        duration_minutes: durationMinutes,
        enrollment_closes_at: enrollmentClosesAt.toISOString(),
        status: 'upcoming',
      }).select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('createTest error:', err)
      return null
    }
  },

  getMyTests: async (institutionId) => {
    try {
      const { data, error } = await supabase
        .from('institution_tests').select('*')
        .eq('institution_id', institutionId)
        .order('scheduled_start', { ascending: false })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('getMyTests error:', err)
      return []
    }
  },

  // Auto-fed roster: everyone enrolled for a given test, with live attendance status
  getTestRoster: async (testId) => {
    try {
      const { data, error } = await supabase
        .from('test_enrollments')
        .select('*, student:student_id(name, avatar_url)')
        .eq('test_id', testId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('getTestRoster error:', err)
      return []
    }
  },

  // ---- QUESTION BANK (institution side) ----

  addQuestion: async (testId, { questionText, options, correctAnswer, marks = 1, topic = '', questionType = 'mcq', gradingRubric = null }) => {
    try {
      const { data, error } = await supabase.from('question_bank').insert({
        test_id: testId, question_text: questionText, options, question_type: questionType,
        correct_answer: correctAnswer, marks, topic, grading_rubric: gradingRubric,
      }).select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('addQuestion error:', err)
      return null
    }
  },

  getQuestions: async (testId) => {
    try {
      const { data, error } = await supabase
        .from('question_bank').select('*').eq('test_id', testId).order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('getQuestions error:', err)
      return []
    }
  },

  deleteQuestion: async (questionId) => {
    try {
      const { error } = await supabase.from('question_bank').delete().eq('id', questionId)
      if (error) throw error
      return true
    } catch (err) {
      console.error('deleteQuestion error:', err)
      return false
    }
  },

  // ---- EXAM DAY (student side) - both calls hit server-side Edge Functions.
  // Timing, shuffling, and scoring all happen there - never trust the browser clock
  // or a client-computed score for something a student has a direct incentive to fake.

  startExam: async (enrollmentId, studentId) => {
    const { data, error } = await supabase.functions.invoke('start-exam', {
      body: { enrollment_id: enrollmentId, student_id: studentId },
    })
    if (error) throw new Error(data?.error || error.message || 'Could not start the exam.')
    if (data?.error) throw new Error(data.error)
    return data
  },

  submitExam: async (enrollmentId, studentId, token, answers) => {
    const { data, error } = await supabase.functions.invoke('submit-exam', {
      body: { enrollment_id: enrollmentId, student_id: studentId, token, answers },
    })
    if (error) throw new Error(data?.error || error.message || 'Could not submit the exam.')
    if (data?.error) throw new Error(data.error)
    return data
  },

  // ---- PAPER UPLOAD & REVIEW (institution) ----

  uploadPaper: async (institutionId, testId, file) => {
    try {
      const path = `paper-uploads/${institutionId}/${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage.from('user-content').upload(path, file)
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('user-content').getPublicUrl(path)
      const { data, error } = await supabase.from('paper_uploads').insert({
        institution_id: institutionId, test_id: testId,
        file_url: urlData.publicUrl, file_type: file.type === 'application/pdf' ? 'pdf' : 'image',
        extraction_status: 'pending',
      }).select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('uploadPaper error:', err)
      throw err
    }
  },

  saveExtractedQuestions: async (paperUploadId, candidateQuestions) => {
    try {
      const { error } = await supabase.from('paper_uploads').update({
        extraction_status: 'extracted', extracted_questions: candidateQuestions,
      }).eq('id', paperUploadId)
      if (error) throw error
      return true
    } catch (err) {
      console.error('saveExtractedQuestions error:', err)
      return false
    }
  },

  // Institution has reviewed/edited candidates - this is the ONLY path that writes to
  // the real question_bank, so nothing unreviewed can ever reach a live exam.
  publishReviewedQuestions: async (paperUploadId, testId, reviewedQuestions) => {
    try {
      const rows = reviewedQuestions.map(q => ({
        test_id: testId, question_text: q.question_text, options: q.options,
        correct_answer: q.correct_answer, marks: q.marks || 1, question_type: 'mcq',
      }))
      const { error } = await supabase.from('question_bank').insert(rows)
      if (error) throw error
      await supabase.from('paper_uploads').update({ extraction_status: 'published' }).eq('id', paperUploadId)
      return true
    } catch (err) {
      console.error('publishReviewedQuestions error:', err)
      return false
    }
  },

  getPaperUploads: async (testId) => {
    try {
      const { data, error } = await supabase.from('paper_uploads').select('*').eq('test_id', testId).order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('getPaperUploads error:', err)
      return []
    }
  },

  // ---- DESCRIPTIVE ANSWERS (student submits, institution/mentor grades) ----

  submitDescriptiveAnswer: async (enrollmentId, questionId, { answerText, answerFileUrl }) => {
    try {
      const { data, error } = await supabase.from('descriptive_answers').insert({
        enrollment_id: enrollmentId, question_id: questionId,
        answer_text: answerText || null, answer_file_url: answerFileUrl || null,
      }).select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('submitDescriptiveAnswer error:', err)
      return null
    }
  },

  getUngradedAnswers: async (testId) => {
    try {
      const { data, error } = await supabase
        .from('descriptive_answers')
        .select('*, question:question_id(question_text, marks, grading_rubric, test_id), enrollment:enrollment_id(student_id, student:student_id(name))')
        .is('marks_awarded', null)
      if (error) throw error
      return (data || []).filter(a => a.question?.test_id === testId)
    } catch (err) {
      console.error('getUngradedAnswers error:', err)
      return []
    }
  },

  gradeAnswer: async (answerId, marksAwarded, graderId, notes = '') => {
    try {
      const { error } = await supabase.from('descriptive_answers').update({
        marks_awarded: marksAwarded, graded_by: graderId, graded_at: new Date().toISOString(), grader_notes: notes,
      }).eq('id', answerId)
      if (error) throw error
      return true
    } catch (err) {
      console.error('gradeAnswer error:', err)
      return false
    }
  },

  // ---- PUBLISH RESULTS (adds descriptive marks to the auto-scored MCQ total, notifies everyone) ----

  publishResults: async (testId) => {
    try {
      const { data: enrollments } = await supabase
        .from('test_enrollments').select('id, student_id, score').eq('test_id', testId).eq('status', 'submitted')

      for (const enr of enrollments || []) {
        const { data: descAnswers } = await supabase
          .from('descriptive_answers').select('marks_awarded, question_id!inner(test_id)')
          .eq('enrollment_id', enr.id)
        const descTotal = (descAnswers || []).reduce((s, a) => s + (a.marks_awarded || 0), 0)
        const finalScore = (enr.score || 0) + descTotal
        await supabase.from('test_enrollments').update({ score: finalScore }).eq('id', enr.id)

        await supabase.from('notifications').insert({
          user_id: enr.student_id, type: 'test_result',
          title: 'Your test result is published!',
          body: `You scored ${finalScore} marks.`,
          link: `/student/exam/${enr.id}`,
        }).catch(() => {})
      }

      const { data: ranked } = await supabase
        .from('test_enrollments').select('id, score').eq('test_id', testId).eq('status', 'submitted')
        .order('score', { ascending: false })
      for (let i = 0; i < (ranked || []).length; i++) {
        await supabase.from('test_enrollments').update({ institution_rank: i + 1 }).eq('id', ranked[i].id)
      }

      await supabase.from('institution_tests').update({
        results_published: true, results_published_at: new Date().toISOString(),
      }).eq('id', testId)

      return true
    } catch (err) {
      console.error('publishResults error:', err)
      return false
    }
  },
}
