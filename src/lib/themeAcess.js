/**
 * TryIT — Theme Access (subscription gating)
 * ─────────────────────────────────────────────────────────────────
 * Decides whether a user's PLAN makes them eligible for a theme at
 * all. This is separate from themeUnlocks.js on purpose:
 *
 *   themeAccess.js   -> "is your subscription tier high enough to
 *                        even attempt this theme?"
 *   themeUnlocks.js  -> "have you hit the in-app goal for it?"
 *
 * A theme only becomes selectable when BOTH are true. This keeps the
 * achievement system (themeUnlocks.js) completely unaware of billing
 * — it stays reusable even if your pricing model changes later.
 *
 * PLAN TIERS: 'free' | 'pro' | 'ultra' (ascending)
 *   - Base themes (tier: 'base') ignore plan — free for everyone.
 *   - Most unlock themes require plan: 'pro' (the default in
 *     buildTheme), meaning Pro AND Ultra subscribers can earn them.
 *   - A handful of themes are plan: 'ultra' — Ultra-exclusive, Pro
 *     subscribers cannot access them no matter their stats.
 *
 * CANCELLATION BEHAVIOR (intentionally simple):
 * If a subscription lapses, hasThemeAccess() will start returning
 * false for that theme again. There is no special downgrade ceremony
 * here — if the user's currently active theme is no longer
 * accessible, the caller (ThemeContext) just falls back to their
 * current base theme. Achievement progress recorded in themeUnlocks.js
 * is untouched, so resubscribing instantly restores access — no
 * re-grinding required. Cancelling a subscription itself is handled
 * entirely by your billing flow; this file only reads the resulting
 * plan value, it never restricts or discourages cancellation.
 */

const PLAN_RANK = { free: 0, pro: 1, ultra: 2 }

/**
 * userPlan: 'free' | 'pro' | 'ultra' — read from whatever your billing
 * source of truth is (Supabase subscription row, Razorpay webhook
 * result cached on the profile, etc).
 */
export function hasThemeAccess(theme, userPlan = 'free') {
  if (theme.tier === 'base') return true
  const required = PLAN_RANK[theme.plan] ?? PLAN_RANK.pro
  const current = PLAN_RANK[userPlan] ?? PLAN_RANK.free
  return current >= required
}

/**
 * Human-readable reason a theme isn't accessible, for the locked-card
 * UI. Returns null if the theme IS accessible on plan grounds (the
 * achievement progress message is handled separately in
 * themeUnlocks.js / ThemeSelector.jsx).
 */
export function getPlanGateLabel(theme, userPlan = 'free') {
  if (hasThemeAccess(theme, userPlan)) return null
  if (theme.plan === 'ultra') return 'Ultra subscribers only'
  return 'Pro subscribers only'
}

/**
 * Convenience grouping for pricing/upsell screens — e.g. "see what
 * you'd unlock with Pro" on the PricingPage.
 */
export function getThemesByPlan(themeList) {
  return {
    free: themeList.filter(t => t.tier === 'base'),
    pro: themeList.filter(t => t.tier !== 'base' && t.plan === 'pro'),
    ultra: themeList.filter(t => t.tier !== 'base' && t.plan === 'ultra'),
  }
}