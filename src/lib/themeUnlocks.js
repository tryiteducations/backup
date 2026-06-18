/**
 * TryIT — Theme Unlock Engine
 * ─────────────────────────────────────────────────────────────────
 * Decides which themes a user has unlocked, based on stats you already
 * track (tests completed, streaks, coins, scores, etc). This file has
 * no UI and no storage of its own — it's pure logic, fed by whatever
 * AuthContext / CoinContext / profile data you already have.
 *
 * HOW TO WIRE IT UP:
 * Call `getUnlockStatus(theme, userStats)` for each theme to find out
 * if it's unlocked, and how close the user is if not. `userStats` is
 * a plain object — map your existing fields onto it, for example:
 *
 *   const userStats = {
 *     tests_completed: profile.totalTestsTaken,
 *     streak_days:      profile.currentStreak,
 *     score_percent:    profile.bestScorePercent,
 *     rank_top:         profile.bestLeaderboardRank,   // lower = better
 *     coins_earned:     profile.lifetimeCoins,
 *     focus_minutes:    profile.totalFocusMinutes,
 *     subject_mastery:  profile.masteredSubjectCount,
 *   }
 *
 * Persisting *which* themes have been unlocked (so a later drop in
 * stats, e.g. streak reset, doesn't lock a theme the user already
 * earned) is intentionally left to your backend / localStorage layer
 * — see `mergeUnlockedThemeIds` below for a small helper to do that.
 */

import { THEME_LIST, BASE_THEME_IDS } from './themes'
import { hasThemeAccess, getPlanGateLabel } from './themeAcess'

/**
 * Returns { unlocked: boolean, progress: number (0-1), label: string }
 * for a single theme against the given stats object.
 */
export function getUnlockStatus(theme, userStats = {}) {
  if (theme.tier === 'base' || !theme.unlock) {
    return { unlocked: true, progress: 1, label: null }
  }

  const { type, value, label } = theme.unlock
  const current = Number(userStats[type] ?? 0)

  // rank_top is "lower is better" (Top 100 means rank <= 100), so the
  // comparison direction flips relative to every other metric.
  const unlocked = type === 'rank_top'
    ? current > 0 && current <= value
    : current >= value

  let progress
  if (type === 'rank_top') {
    progress = current > 0 ? Math.min(1, value / current) : 0
  } else {
    progress = value > 0 ? Math.min(1, current / value) : 0
  }

  return { unlocked, progress, label }
}

/**
 * Returns the full theme list annotated with live unlock status —
 * what ThemeSelector.jsx and ThemeSwitcher.jsx actually render from.
 *
 * A theme is `unlocked` only when BOTH conditions hold: the user's
 * subscription plan is high enough (themeAccess.js), AND the
 * achievement criteria is met (or was already persisted as earned).
 * If the plan check fails, we still show achievement progress (so a
 * free user can see "you're 80% there, upgrade to claim it") but the
 * theme is not selectable.
 */
export function getThemesWithStatus(userStats = {}, unlockedThemeIds = [], userPlan = 'free') {
  return THEME_LIST.map(theme => {
    const planOk = hasThemeAccess(theme, userPlan)
    const computed = getUnlockStatus(theme, userStats)
    const persisted = unlockedThemeIds.includes(theme.id)
    const achievementMet = computed.unlocked || persisted || theme.tier === 'base'

    return {
      ...theme,
      unlocked: theme.tier === 'base' ? true : (planOk && achievementMet),
      planLocked: !planOk,
      planGateLabel: getPlanGateLabel(theme, userPlan),
      progress: computed.progress,
      unlockLabel: computed.label,
    }
  })
}

/**
 * Call this after any stat-changing event (test submitted, coins
 * earned, streak updated) to find newly-unlocked themes worth
 * celebrating. Only fires for themes the user's plan already permits
 * — if a free user crosses an achievement threshold for a Pro theme,
 * that's not a celebration moment yet, it's an upsell moment (handled
 * separately via planGateLabel in the UI).
 */
export function findNewlyUnlocked(userStats, previouslyUnlockedIds = [], userPlan = 'free') {
  const newlyUnlocked = []
  for (const theme of THEME_LIST) {
    if (theme.tier === 'base') continue
    if (previouslyUnlockedIds.includes(theme.id)) continue
    if (!hasThemeAccess(theme, userPlan)) continue
    const { unlocked } = getUnlockStatus(theme, userStats)
    if (unlocked) newlyUnlocked.push(theme)
  }
  return newlyUnlocked
}

/**
 * Small helper for merging newly-unlocked theme ids into a persisted
 * list (e.g. before writing to Supabase / localStorage).
 */
export function mergeUnlockedThemeIds(existingIds = [], newTheme) {
  const set = new Set(existingIds)
  set.add(newTheme.id)
  return Array.from(set)
}

export { BASE_THEME_IDS }