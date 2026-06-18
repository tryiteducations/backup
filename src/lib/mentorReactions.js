/**
 * TryIT — Mentor Answer Reactions & Daily Pin
 * ─────────────────────────────────────────────────────────────────
 * Tracks reactions students leave on a MENTOR'S ANSWER (not on the
 * original question — reacting to a question was the earlier, wrong
 * version of this feature). Reactions are weighted, not just counted,
 * so "highest emoji" has real meaning: a single 🏆 should be able to
 * outweigh a handful of 👍.
 *
 * Once per day, the highest-scoring answer across all mentors becomes
 * the pinned "Today's Top Answer" — shown at the top of the Mentor
 * Hub feed AND as a 24-hour badge on that mentor's profile.
 *
 * STORAGE NOTE: this is built on localStorage for now, matching your
 * existing IS_DEV/Supabase-fallback pattern elsewhere in the app. The
 * seam for the real backend is isolated to the three functions below
 * (recordReaction, getTodayLeaderboard, getPinnedAnswer) — swap their
 * internals for Supabase table reads/writes once your `answers`
 * table schema is ready; nothing calling into this module needs to
 * change.
 */

const REACTIONS_KEY = 'tryit_answer_reactions'
const PIN_KEY = 'tryit_pinned_answer'

// Weighted so a handful of low-effort taps can't outscore one
// genuinely impressed reaction.
export const ANSWER_REACTIONS = [
  { emoji: '👍', weight: 1, label: 'Helpful' },
  { emoji: '💡', weight: 2, label: 'Clear' },
  { emoji: '🔥', weight: 3, label: 'Excellent' },
  { emoji: '🏆', weight: 5, label: 'Best Answer' },
]

function todayKey() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function readAll() {
  try {
    const raw = JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}')
    return raw
  } catch {
    return {}
  }
}

function writeAll(data) {
  try { localStorage.setItem(REACTIONS_KEY, JSON.stringify(data)) } catch {}
}

/**
 * Call when a student reacts to a mentor's answer.
 * answer: { id, mentorId, mentorName, subject, text }
 * emoji: one of ANSWER_REACTIONS' emoji values
 * studentId: used to prevent double-counting the same reaction twice
 * in the same day from the same student (toggle behavior handled by
 * the calling component — this function just records the latest
 * state for that student+answer pair).
 */
export function recordReaction(answer, emoji, studentId) {
  const day = todayKey()
  const all = readAll()
  if (!all[day]) all[day] = {}
  if (!all[day][answer.id]) {
    all[day][answer.id] = {
      mentorId: answer.mentorId,
      mentorName: answer.mentorName,
      subject: answer.subject,
      text: answer.text,
      byStudent: {}, // studentId -> emoji
    }
  }
  all[day][answer.id].byStudent[studentId] = emoji
  writeAll(all)
  return computeScore(all[day][answer.id])
}

function computeScore(answerEntry) {
  const weights = Object.fromEntries(ANSWER_REACTIONS.map(r => [r.emoji, r.weight]))
  let score = 0
  const counts = {}
  Object.values(answerEntry.byStudent).forEach(emoji => {
    score += weights[emoji] || 1
    counts[emoji] = (counts[emoji] || 0) + 1
  })
  return { score, counts }
}

/**
 * Returns today's answers ranked by weighted score, highest first.
 * Use this to render a "today's reactions" list if useful, and to
 * compute the pin.
 */
export function getTodayLeaderboard() {
  const day = todayKey()
  const all = readAll()
  const todayEntries = all[day] || {}
  return Object.entries(todayEntries)
    .map(([answerId, entry]) => ({ answerId, ...entry, ...computeScore(entry) }))
    .sort((a, b) => b.score - a.score)
}

/**
 * Computes (and caches for the day) the single pinned answer. Call
 * this once when the Mentor Hub feed loads — it's cheap, but caching
 * avoids recomputing on every render.
 * Returns null if no reactions exist yet today.
 */
export function getPinnedAnswer() {
  const day = todayKey()
  try {
    const cached = JSON.parse(localStorage.getItem(PIN_KEY) || 'null')
    if (cached && cached.day === day) return cached.pinned
  } catch {}

  const leaderboard = getTodayLeaderboard()
  const top = leaderboard[0] || null
  // Require a minimum score so a single 👍 doesn't get "pinned" status
  // on a quiet day — that would cheapen what pinning means.
  const pinned = top && top.score >= 4 ? top : null

  try { localStorage.setItem(PIN_KEY, JSON.stringify({ day, pinned })) } catch {}
  return pinned
}

/**
 * Convenience check for a mentor's own profile badge — is THIS mentor
 * currently holding the daily pin?
 */
export function isMentorPinnedToday(mentorId) {
  const pinned = getPinnedAnswer()
  return Boolean(pinned && pinned.mentorId === mentorId)
}