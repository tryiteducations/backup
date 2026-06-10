/**
 * Content Velocity Limiter — Pillar 5
 * Prevents automated scraping of the question bank
 * Free accounts: 50 questions/day | Pro: unlimited
 */

const DAILY_LIMITS = {
  free:     50,    // questions per day
  trial:    100,
  plus:     500,
  pro:      Infinity,
  promax:   Infinity,
  scholar:  200,   // equity tiers get extra allowance
}

const VELOCITY_KEY = 'tryit_velocity'

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

export function canAccessQuestion(plan = 'free', isFreeForLife = false) {
  const limit = isFreeForLife ? DAILY_LIMITS.scholar : (DAILY_LIMITS[plan] ?? DAILY_LIMITS.free)
  if (limit === Infinity) return { allowed: true, remaining: Infinity }
  const data  = JSON.parse(localStorage.getItem(VELOCITY_KEY) || '{}')
  const today = getTodayKey()
  const count = data[today] || 0
  if (count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      message: plan === 'free'
        ? `You've reached your ${limit} questions/day limit on the free plan. Upgrade to Pro for unlimited access.`
        : `Daily limit of ${limit} questions reached. Resets at midnight.`,
    }
  }
  return { allowed: true, remaining: limit - count, count, limit }
}

export function recordQuestionAccess(count = 1) {
  const data  = JSON.parse(localStorage.getItem(VELOCITY_KEY) || '{}')
  const today = getTodayKey()
  data[today] = (data[today] || 0) + count
  // Keep only last 7 days
  const keys = Object.keys(data).sort()
  if (keys.length > 7) keys.slice(0, keys.length - 7).forEach(k => delete data[k])
  localStorage.setItem(VELOCITY_KEY, JSON.stringify(data))
}

export function getDailyUsage() {
  const data  = JSON.parse(localStorage.getItem(VELOCITY_KEY) || '{}')
  return data[getTodayKey()] || 0
}
