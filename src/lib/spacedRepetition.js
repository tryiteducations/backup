// src/lib/spacedRepetition.js
// A real spaced-repetition engine (SM-2 algorithm - the same approach Anki uses),
// shared across Foundation checkpoints, games, and diagram/map games. Any feature
// that wants "wrong answers come back later, right answers come back less often"
// should record reviews here rather than building its own ad-hoc version.
import { supabase } from './supabase'

// quality: 0-5 recall rating. Most callers only have pass/fail, so recordReview()
// below maps correct->4, incorrect->1 by default - override with a real 0-5 score
// if a caller has finer-grained confidence data.
function computeNextReview({ quality, repetitions, easeFactor, intervalDays }) {
  let ef = easeFactor
  let reps = repetitions
  let interval = intervalDays

  if (quality < 3) {
    reps = 0
    interval = 1
  } else {
    if (reps === 0) interval = 1
    else if (reps === 1) interval = 6
    else interval = Math.round(interval * ef)
    reps += 1
  }

  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (ef < 1.3) ef = 1.3

  return { easeFactor: Math.round(ef * 100) / 100, repetitions: reps, intervalDays: interval }
}

export const spacedRepetition = {
  // Call this every time a student answers something that should be tracked for
  // review - a Foundation checkpoint question, a game question, a diagram hotspot.
  async recordReview(studentId, itemType, itemId, wasCorrect, itemSnapshot = null, quality = null) {
    try {
      const q = quality != null ? quality : (wasCorrect ? 4 : 1)

      const { data: existing } = await supabase
        .from('spaced_review_items').select('*')
        .eq('student_id', studentId).eq('item_type', itemType).eq('item_id', itemId)
        .maybeSingle()

      const prev = existing || { ease_factor: 2.5, repetitions: 0, interval_days: 1 }
      const next = computeNextReview({
        quality: q, repetitions: prev.repetitions, easeFactor: prev.ease_factor, intervalDays: prev.interval_days,
      })

      const nextReviewAt = new Date(Date.now() + next.intervalDays * 24 * 60 * 60 * 1000).toISOString()

      const { error } = await supabase.from('spaced_review_items').upsert({
        student_id: studentId, item_type: itemType, item_id: itemId,
        item_snapshot: itemSnapshot || existing?.item_snapshot || null,
        ease_factor: next.easeFactor, repetitions: next.repetitions, interval_days: next.intervalDays,
        next_review_at: nextReviewAt, last_reviewed_at: new Date().toISOString(),
        last_result: wasCorrect ? 'correct' : 'incorrect',
      }, { onConflict: 'student_id,item_type,item_id' })
      if (error) throw error
      return true
    } catch (err) {
      console.error('recordReview error:', err)
      return false
    }
  },

  // Items due for review right now (next_review_at <= now), most overdue first
  async getDueReviews(studentId, { itemType = null, limit = 20 } = {}) {
    try {
      let query = supabase.from('spaced_review_items').select('*')
        .eq('student_id', studentId).lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true }).limit(limit)
      if (itemType) query = query.eq('item_type', itemType)
      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('getDueReviews error:', err)
      return []
    }
  },

  async getReviewStats(studentId) {
    try {
      const { count: dueCount } = await supabase.from('spaced_review_items')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId).lte('next_review_at', new Date().toISOString())
      const { count: totalCount } = await supabase.from('spaced_review_items')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
      return { due: dueCount || 0, total: totalCount || 0 }
    } catch (err) {
      console.error('getReviewStats error:', err)
      return { due: 0, total: 0 }
    }
  },
}
