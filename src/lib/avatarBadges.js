/**
 * TryIT — Avatar Badge Logic
 * ─────────────────────────────────────────────────────────────────
 * Derives exactly TWO visual signals from a user's stats:
 *   1. ringTier — a color band around the avatar (bronze/silver/gold/
 *      platinum) based on overall progress (level).
 *   2. cornerBadge — ONE small icon in the corner: an active streak
 *      takes priority (time-sensitive, "don't break it"), otherwise
 *      falls back to the most notable recent achievement.
 *
 * Deliberately capped at one ring + one corner badge — no stacking.
 * This mirrors how Discord/Duolingo-style decorations stay premium:
 * restraint, not maximalism. If you want to add more signals later,
 * extend the priority list in getCornerBadge(), don't add new slots.
 */

const RING_TIERS = [
  { min: 0,  id: 'bronze',   color: '#B08D57', label: 'Bronze' },
  { min: 3,  id: 'silver',   color: '#C0C0C0', label: 'Silver' },
  { min: 6,  id: 'gold',     color: '#D4AF37', label: 'Gold' },
  { min: 10, id: 'platinum', color: '#A855F7', label: 'Platinum' },
]

/**
 * user: expects the shape already used in AuthContext — level, streak,
 * testsCompleted, coins. Fields you don't have default safely to 0.
 */
export function getRingTier(user = {}) {
  const level = Number(user.level ?? 1)
  let tier = RING_TIERS[0]
  for (const t of RING_TIERS) {
    if (level >= t.min) tier = t
  }
  return tier
}

export function getCornerBadge(user = {}) {
  const streak = Number(user.streak ?? 0)
  const testsCompleted = Number(user.testsCompleted ?? 0)
  const coins = Number(user.coins ?? 0)

  // Priority 1: active streak — time-sensitive, most motivating to surface.
  if (streak >= 3) {
    return { id: 'streak', icon: '🔥', tooltip: `${streak}-day streak`, glow: '#F97316' }
  }
  // Priority 2: a meaningful test-volume milestone.
  if (testsCompleted >= 25) {
    return { id: 'tests', icon: '⭐', tooltip: `${testsCompleted} tests completed`, glow: '#D4AF37' }
  }
  if (testsCompleted >= 10) {
    return { id: 'tests', icon: '📘', tooltip: `${testsCompleted} tests completed`, glow: '#0EA5E9' }
  }
  // Priority 3: coin milestone, lowest priority signal.
  if (coins >= 500) {
    return { id: 'coins', icon: '🪙', tooltip: `${coins} coins earned`, glow: '#D4AF37' }
  }
  return null
}

/**
 * Single entry point — returns everything ProtectedAvatar /
 * OwnProfileAvatar need to render decoration around a photo.
 */
export function getAvatarDecoration(user = {}) {
  return {
    ring: getRingTier(user),
    badge: getCornerBadge(user),
  }
}