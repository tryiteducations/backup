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
}
