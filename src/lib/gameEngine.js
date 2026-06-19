// FILE: src/lib/gameEngine.js
// TryIT — Shared Game Engine for all mini-games
// Dopamine mechanics: combo multiplier, streak fire, instant feedback,
// score popups — all exam-relevant (no random trivia, no junk content)
//
// COIN ECONOMY (100% admin-controlled via game_economy_config table):
//   Entry cost, win reward, loss penalty are NEVER hardcoded.
//   Always fetched fresh so admin can change 5→50→500 anytime, instantly.

import { useState, useCallback, useRef, useEffect } from 'react'
import { supabase } from './supabase'

// ── FETCH LIVE ECONOMY CONFIG (admin can change anytime, no app update needed) ──
export async function fetchGameEconomy(gameId) {
  try {
    const { data, error } = await supabase.rpc('get_game_economy', { p_game_id: gameId })
    if (error || !data?.[0]) throw error
    return {
      entryCost:   data[0].entry_cost,
      winReward:   data[0].win_reward,
      lossPenalty: data[0].loss_penalty,
      drawReward:  data[0].draw_reward,
    }
  } catch {
    // Safe fallback if config unreachable (never blocks play)
    return { entryCost: 5, winReward: 5, lossPenalty: 5, drawReward: 0 }
  }
}

// ── HOOK: GAME ENTRY GATE (coin check + spend before play starts) ──────────
export function useGameEntry(gameId, { coins, spendCoins, addCoins }) {
  const [economy,    setEconomy]    = useState(null)
  const [canAfford,  setCanAfford]  = useState(true)
  const [entryPaid,  setEntryPaid]  = useState(false)

  useEffect(() => {
    fetchGameEconomy(gameId).then(e => {
      setEconomy(e)
      setCanAfford((coins || 0) >= e.entryCost)
    })
  }, [gameId, coins])

  const payEntry = useCallback(async () => {
    if (!economy) return false
    const ok = economy.entryCost === 0 || await spendCoins?.(economy.entryCost, `game_entry_${gameId}`)
    if (ok) setEntryPaid(true)
    return ok
  }, [economy, gameId, spendCoins])

  // Called once when game ends — settles win/loss coins
  const settleResult = useCallback(async (result /* 'win'|'loss'|'draw' */) => {
    if (!economy) return 0
    let delta = 0
    if (result === 'win')  delta = economy.winReward
    if (result === 'loss') delta = -economy.lossPenalty
    if (result === 'draw') delta = economy.drawReward

    if (delta > 0) await addCoins?.(delta)
    else if (delta < 0) await spendCoins?.(Math.abs(delta), `game_loss_${gameId}`, { allowZeroFloor: true })

    try {
      await supabase.from('game_sessions').update({ coins_delta: delta }).eq('game_id', gameId)
    } catch {}

    return delta
  }, [economy, gameId, addCoins, spendCoins])

  return { economy, canAfford, entryPaid, payEntry, settleResult }
}

// ── COMBO MULTIPLIER SYSTEM ───────────────────────────────────────────────
// Consecutive correct answers increase multiplier: 1x → 1.5x → 2x → 3x
export function getComboMultiplier(streak) {
  if (streak >= 10) return { mult: 3,   label: '🔥🔥🔥 ON FIRE',  color: '#DC2626' }
  if (streak >= 6)  return { mult: 2,   label: '🔥🔥 BLAZING',   color: '#EA580C' }
  if (streak >= 3)  return { mult: 1.5, label: '🔥 HOT STREAK',  color: '#D97706' }
  return                  { mult: 1,   label: '',                color: '#64748B' }
}

// ── HAPTIC-LIKE FEEDBACK (vibration on mobile) ────────────────────────────
export function triggerHaptic(type = 'success') {
  if (!navigator.vibrate) return
  const patterns = {
    success:    [40],
    combo:      [30, 30, 30],
    levelup:    [50, 30, 50, 30, 100],
    wrong:      [80],
    countdown:  [20],
  }
  navigator.vibrate(patterns[type] || patterns.success)
}

// ── GAME SESSION HOOK (shared state machine for all games) ───────────────
export function useGameSession({ totalQuestions, duration, onComplete }) {
  const [phase,       setPhase]       = useState('ready')  // ready|playing|done
  const [currentIdx,  setCurrentIdx]  = useState(0)
  const [score,       setScore]       = useState(0)
  const [streak,      setStreak]      = useState(0)
  const [bestStreak,  setBestStreak]  = useState(0)
  const [correct,     setCorrect]     = useState(0)
  const [wrong,       setWrong]       = useState(0)
  const [timeLeft,    setTimeLeft]    = useState(duration)
  const [lastPoints,  setLastPoints]  = useState(null)  // for popup animation
  const [showCombo,   setShowCombo]   = useState(false)

  const timerRef = useRef(null)

  const start = useCallback(() => {
    setPhase('playing')
    setCurrentIdx(0); setScore(0); setStreak(0); setBestStreak(0)
    setCorrect(0); setWrong(0); setTimeLeft(duration)

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setPhase('done')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [duration])

  const answer = useCallback((isCorrect, basePoints = 10) => {
    if (isCorrect) {
      const newStreak = streak + 1
      const { mult, label } = getComboMultiplier(newStreak)
      const points = Math.round(basePoints * mult)

      setStreak(newStreak)
      setBestStreak(b => Math.max(b, newStreak))
      setCorrect(c => c + 1)
      setScore(s => s + points)
      setLastPoints({ points, isCorrect: true, comboLabel: label, mult })

      if (newStreak === 3 || newStreak === 6 || newStreak === 10) {
        setShowCombo(true)
        triggerHaptic('combo')
        setTimeout(() => setShowCombo(false), 1200)
      } else {
        triggerHaptic('success')
      }
    } else {
      setStreak(0)
      setWrong(w => w + 1)
      setLastPoints({ points: 0, isCorrect: false })
      triggerHaptic('wrong')
    }

    setTimeout(() => setLastPoints(null), 600)

    if (currentIdx + 1 >= totalQuestions) {
      clearInterval(timerRef.current)
      setPhase('done')
    } else {
      setCurrentIdx(i => i + 1)
    }
  }, [streak, currentIdx, totalQuestions])

  const finish = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase('done')
  }, [])

  // Call onComplete when phase becomes done
  const completedRef = useRef(false)
  if (phase === 'done' && !completedRef.current) {
    completedRef.current = true
    onComplete?.({ score, correct, wrong, bestStreak, totalQuestions })
  }

  return {
    phase, currentIdx, score, streak, bestStreak, correct, wrong,
    timeLeft, lastPoints, showCombo,
    start, answer, finish,
  }
}

// ── SCORE TIER (for end screen medal) ─────────────────────────────────────
export function getGameTier(score, maxPossible) {
  const pct = maxPossible > 0 ? (score / maxPossible) * 100 : 0
  if (pct >= 90) return { emoji:'🏆', label:'Legendary',  color:'#D97706' }
  if (pct >= 75) return { emoji:'🥇', label:'Excellent',  color:'#CA8A04' }
  if (pct >= 60) return { emoji:'🥈', label:'Great',      color:'#475569' }
  if (pct >= 40) return { emoji:'🥉', label:'Good',       color:'#92400E' }
  return              { emoji:'🌱', label:'Keep Going', color:'#059669' }
}

// ── DAILY HIGH SCORE TRACKING (localStorage, synced to Supabase) ──────────
export function getLocalHighScore(gameId) {
  try {
    return parseInt(localStorage.getItem(`tryit_hs_${gameId}`) || '0')
  } catch { return 0 }
}

export function setLocalHighScore(gameId, score) {
  try {
    const current = getLocalHighScore(gameId)
    if (score > current) {
      localStorage.setItem(`tryit_hs_${gameId}`, String(score))
      return true  // new high score
    }
  } catch {}
  return false
}

// ── MOMENTUM METER (original mechanic — decays, doesn't shatter) ──────────
export const MOMENTUM_LEVELS = [
  { level:0, label:'No Momentum', emoji:'⚪', color:'#94A3B8' },
  { level:1, label:'Building',    emoji:'🌱', color:'#059669' },
  { level:2, label:'Warm',        emoji:'🔥', color:'#D97706' },
  { level:3, label:'Strong',      emoji:'🔥🔥', color:'#EA580C' },
  { level:4, label:'Blazing',     emoji:'🔥🔥🔥', color:'#DC2626' },
  { level:5, label:'Unstoppable', emoji:'⚡', color:'#7C3AED' },
]

export function getMomentumInfo(level) {
  return MOMENTUM_LEVELS[Math.min(Math.max(level, 0), 5)]
}

export async function recordMomentum(userId) {
  if (!userId) return null
  try {
    await supabase.rpc('update_momentum', { p_user_id: userId })
    const { data } = await supabase.from('momentum_log').select('*').eq('user_id', userId).single()
    return data
  } catch { return null }
}

// ── DAILY CHALLENGE — deterministic seed (same questions for all users that day) ──
export function getDailyChallengeSeed(dateStr = null) {
  const date = dateStr || new Date().toISOString().slice(0, 10)  // "2026-06-20"
  let hash = 0
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0
  }
  return hash
}

// Seeded shuffle — deterministic given the same seed (so all users get same order)
export function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed
  const random = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function fetchDailyChallengeQuestions() {
  const today = new Date().toISOString().slice(0, 10)

  // Check admin override first (for big exam announcement days)
  try {
    const { data: override } = await supabase
      .from('daily_challenge_override').select('question_ids').eq('challenge_date', today).single()
    if (override?.question_ids?.length) {
      const { data: qs } = await supabase.from('question_bank').select('*').in('q_id', override.question_ids)
      return qs || []
    }
  } catch {}

  // Auto-generate via deterministic seed
  const seed = getDailyChallengeSeed(today)
  const { data: pool } = await supabase
    .from('question_bank').select('*').eq('admin_approved', true).limit(200)

  if (!pool?.length) return []
  return seededShuffle(pool, seed).slice(0, 5)
}

export async function hasCompletedDailyChallenge(userId) {
  if (!userId) return false
  const today = new Date().toISOString().slice(0, 10)
  try {
    const { data } = await supabase
      .from('daily_challenge_completions').select('*')
      .eq('user_id', userId).eq('challenge_date', today).single()
    return !!data
  } catch { return false }
}

export async function recordDailyChallengeCompletion(userId, score, correct) {
  const today = new Date().toISOString().slice(0, 10)
  try {
    await supabase.from('daily_challenge_completions')
      .insert({ user_id: userId, challenge_date: today, score, correct })
  } catch {}
  await recordMomentum(userId)
}

// ── GAME NOTIFICATION TRIGGERS ──────────────────────────────────────────
// Call these at the right moments to drive re-engagement
export async function notifyDailyChallengeUnlock(userId) {
  try {
    await supabase.from('notification_queue').insert({
      user_id: userId, notif_type: 'daily_challenge_unlock',
      title: "📅 Today's Challenge is live!",
      body: "5 fresh questions waiting. Keep your momentum going!",
      deep_link: '/games/daily-challenge',
      send_at: new Date().toISOString(),
    })
  } catch {}
}

export async function notifyMomentumAtRisk(userId, momentumLabel) {
  try {
    await supabase.from('notification_queue').insert({
      user_id: userId, notif_type: 'momentum_at_risk',
      title: '🔥 Your momentum is fading!',
      body: `Play one quick game today to stay ${momentumLabel}.`,
      deep_link: '/games',
      send_at: new Date().toISOString(),
    })
  } catch {}
}

export async function notifyNewGameUnlocked(userId, gameName, gameEmoji) {
  try {
    await supabase.from('notification_queue').insert({
      user_id: userId, notif_type: 'new_game_unlocked',
      title: `🎮 New game unlocked: ${gameName}!`,
      body: `${gameEmoji} Be among the first to play — sharpen your mind now!`,
      deep_link: '/games',
      send_at: new Date().toISOString(),
    })
  } catch {}
}

export async function notifyStickerUnlocked(userId, stickerLabel, stickerEmoji) {
  try {
    await supabase.from('notification_queue').insert({
      user_id: userId, notif_type: 'sticker_unlocked',
      title: `🏅 New sticker: ${stickerLabel}!`,
      body: `${stickerEmoji} Check your profile to see your collection grow.`,
      deep_link: '/profile',
      send_at: new Date().toISOString(),
    })
  } catch {}
}