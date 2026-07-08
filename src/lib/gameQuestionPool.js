// src/lib/gameQuestionPool.js
// Feeds Games Hub games with real, exam-tagged questions instead of a fixed generic
// list. Pulls from practice_questions, filtered by the student's own chosen exam(s)
// where possible, falling back to an unfiltered pool if they haven't set one yet.
import { supabase } from './supabase'

export const gameQuestionPool = {
  async getQuestions({ subject, studentExams = [], limit = 15 }) {
    try {
      let query = supabase.from('practice_questions').select('*').eq('subject', subject)

      if (studentExams.length > 0) {
        // overlaps() - true if the question's exam_tags array shares any value with the student's chosen exams
        query = query.overlaps('exam_tags', studentExams)
      }

      const { data, error } = await query.limit(200)
      if (error) throw error

      // If exam-filtered search came back empty (e.g. a niche exam with no tagged
      // questions yet), fall back to the general pool for that subject rather than
      // showing nothing.
      let pool = data || []
      if (pool.length === 0 && studentExams.length > 0) {
        const { data: fallback } = await supabase.from('practice_questions').select('*').eq('subject', subject).limit(200)
        pool = fallback || []
      }

      // Shuffle and cap
      const shuffled = [...pool].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, limit)
    } catch (err) {
      console.error('getQuestions error:', err)
      return []
    }
  },
}
