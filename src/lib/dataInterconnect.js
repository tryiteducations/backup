// src/lib/dataInterconnect.js
// Service for interconnecting data between all 4 roles
// - Students post doubts â†’ Mentors/Institutions see
// - Mentors/Institutions upload papers â†’ Students see
// - Family tracks real-time progress
import { supabase } from './supabase'

/**
 * DOUBT SYSTEM - Students â†” Mentors â†” Institutions
 */
export const doubtSystem = {
  // Student posts a doubt
  postDoubt: async (studentId, examId, subject, topic, question, images = []) => {
    try {
      const { data, error } = await supabase
        .from('doubts')
        .insert({
          student_id: studentId,
          exam_id: examId,
          subject,
          topic,
          question,
          images: images || [],
          status: 'open',
          posted_at: new Date().toISOString(),
          resolved_at: null,
        })
        .select()
      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('postDoubt error:', err)
      return null
    }
  },

  // Get doubts for current user (student sees their doubts, mentor/institution sees all assigned)
  getDoubts: async (userId, userRole, filters = {}) => {
    try {
      let query = supabase.from('doubts').select('*')

      if (userRole === 'student') {
        query = query.eq('student_id', userId)
      } else if (userRole === 'mentor') {
        query = query.eq('assigned_mentor_id', userId)
      } else if (userRole === 'institution') {
        query = query.eq('institution_id', userId)
      }

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status)
      if (filters.exam_id) query = query.eq('exam_id', filters.exam_id)
      if (filters.subject) query = query.eq('subject', filters.subject)

      query = query.order('posted_at', { ascending: false })
      const { data, error } = await query
      if (error) throw error
      return data
    } catch (err) {
      console.error('getDoubts error:', err)
      return []
    }
  },

  // Mentor/Institution assigns doubt to themselves
  assignDoubt: async (doubtId, mentorId) => {
    try {
      const { data, error } = await supabase
        .from('doubts')
        .update({
          assigned_mentor_id: mentorId,
          status: 'in_progress',
        })
        .eq('id', doubtId)
        .select()
      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('assignDoubt error:', err)
      return null
    }
  },

  // Mentor/Institution resolves doubt
  resolveDoubt: async (doubtId, solution, videoUrl = null) => {
    try {
      const { data, error } = await supabase
        .from('doubts')
        .update({
          solution,
          video_url: videoUrl,
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', doubtId)
        .select()
      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('resolveDoubt error:', err)
      return null
    }
  },
}

/**
 * QUESTION PAPERS - Mentors/Institutions upload â†’ Students see
 */
export const paperSystem = {
  // Upload question paper
  uploadPaper: async (uploaderId, uploaderRole, exam, subject, topic, pdfUrl, metadata = {}) => {
    try {
      const { data, error } = await supabase
        .from('question_papers')
        .insert({
          uploader_id: uploaderId,
          uploader_role: uploaderRole, // 'mentor' or 'institution'
          exam,
          subject,
          topic,
          pdf_url: pdfUrl,
          metadata,
          created_at: new Date().toISOString(),
          download_count: 0,
        })
        .select()
      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('uploadPaper error:', err)
      return null
    }
  },

  // Get available papers for student
  getPapersForStudent: async (studentId, examId, subject = null, topic = null) => {
    try {
      let query = supabase
        .from('question_papers')
        .select('*')
        .eq('exam', examId)

      if (subject) query = query.eq('subject', subject)
      if (topic) query = query.eq('topic', topic)

      query = query.order('created_at', { ascending: false })
      const { data, error } = await query
      if (error) throw error
      return data
    } catch (err) {
      console.error('getPapersForStudent error:', err)
      return []
    }
  },

  // Track downloads
  trackDownload: async (paperId) => {
    try {
      const { error } = await supabase
        .from('question_papers')
        .update({ download_count: supabase.raw('download_count + 1') })
        .eq('id', paperId)
      if (error) throw error
      return true
    } catch (err) {
      console.error('trackDownload error:', err)
      return false
    }
  },
}

/**
 * FAMILY TRACKING - Real-time progress monitoring
 */
export const familyTracking = {
  // Get child's latest activity
  getChildProgress: async (childId) => {
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', childId)
        .single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('getChildProgress error:', err)
      return null
    }
  },

  // Get child's daily stats
  getDailyStats: async (childId, days = 7) => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('student_id', childId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false })
      if (error) throw error
      return data
    } catch (err) {
      console.error('getDailyStats error:', err)
      return []
    }
  },

  // Get child's weak areas
  getWeakAreas: async (childId) => {
    try {
      const { data, error } = await supabase
        .from('student_analytics')
        .select('weak_topics, accuracy_by_subject')
        .eq('student_id', childId)
        .single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('getWeakAreas error:', err)
      return null
    }
  },

  // Get exam readiness
  getExamReadiness: async (childId) => {
    try {
      const { data, error } = await supabase
        .from('exam_readiness')
        .select('*')
        .eq('student_id', childId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('getExamReadiness error:', err)
      return null
    }
  },

  // Track study streak
  getStudyStreak: async (childId) => {
    try {
      const { data, error } = await supabase
        .from('student_profile')
        .select('current_streak, longest_streak, streak_updated_at')
        .eq('id', childId)
        .single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('getStudyStreak error:', err)
      return null
    }
  },

  // Get downloadable report
  generateReport: async (childId, fromDate = null, toDate = null) => {
    try {
      let query = supabase
        .from('student_reports')
        .select('*')
        .eq('student_id', childId)

      if (fromDate) query = query.gte('created_at', fromDate)
      if (toDate) query = query.lte('created_at', toDate)

      const { data, error } = await query
      if (error) throw error
      return data
    } catch (err) {
      console.error('generateReport error:', err)
      return null
    }
  },

  // Export all child data
  exportChildData: async (childId, format = 'json') => {
    try {
      const progress = await familyTracking.getChildProgress(childId)
      const stats = await familyTracking.getDailyStats(childId, 365)
      const weakAreas = await familyTracking.getWeakAreas(childId)
      const readiness = await familyTracking.getExamReadiness(childId)
      const streak = await familyTracking.getStudyStreak(childId)

      const exportData = {
        child_id: childId,
        exported_at: new Date().toISOString(),
        progress,
        stats,
        weak_areas: weakAreas,
        exam_readiness: readiness,
        study_streak: streak,
      }

      if (format === 'json') {
        return JSON.stringify(exportData, null, 2)
      } else if (format === 'csv') {
        return convertToCSV(exportData)
      }
      return exportData
    } catch (err) {
      console.error('exportChildData error:', err)
      return null
    }
  },
}

/**
 * NOTIFICATIONS - Real-time updates for interconnected data
 */
export const notificationSystem = {
  // Subscribe to doubt updates for mentor/institution
  subscribeToDoubts: (mentorId, callback) => {
    const channel = supabase
      .channel(`doubts-mentor-${mentorId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'doubts', filter: `assigned_mentor_id=eq.${mentorId}` }, (payload) => {
        callback(payload)
      })
      .subscribe()
    return channel
  },

  // Subscribe to paper uploads for student's enrolled exams
  subscribeToNewPapers: (studentExams, callback) => {
    const channel = supabase
      .channel('question-papers-new')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'question_papers' }, (payload) => {
        if (studentExams.includes(payload.new.exam)) {
          callback(payload.new)
        }
      })
      .subscribe()
    return channel
  },

  // Subscribe to family member progress updates
  subscribeToChildProgress: (childId, callback) => {
    const channel = supabase
      .channel(`daily-stats-child-${childId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_stats', filter: `student_id=eq.${childId}` }, (payload) => {
        callback(payload)
      })
      .subscribe()
    return channel
  },
}
// Helper to convert data to CSV
function convertToCSV(data) {
  let csv = 'TryIT Export\n'
  csv += `Exported: ${new Date().toISOString()}\n\n`
  csv += JSON.stringify(data, null, 2)
  return csv
}

export default {
  doubtSystem,
  paperSystem,
  familyTracking,
  notificationSystem,
}
