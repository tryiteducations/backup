// FILE: src/lib/levelSystem.js
// TryIT — Unlimited Level Progression + Cinematic Theme Universes
// Levels are procedurally generated (harder difficulty + more questions as level rises)
// Theme shifts every 10 levels — premium blockbuster-world feel, fully original IP
// Unlock: free via completing previous level, OR pay coins to skip

import { supabase } from './supabase'

// ── THEME UNIVERSES (mirrors SQL seed — used for instant client-side render) ──
export const THEME_UNIVERSES = [
  { id:'emberfall',    from:1,  to:10,     name:'Emberfall Wilds',      tagline:'Where every spark of knowledge ignites a forest of wisdom',
    primary:'#0F4C3A', secondary:'#1B6B4A', accent:'#5EEAD4',
    bg:'linear-gradient(160deg,#0F4C3A,#1B6B4A,#134E4A)', particle:'ember',
    icons:['🌿','🔥','🦋','✨','🍃'], costMult:1.0 },
  { id:'ironcrown',    from:11, to:20,     name:'Ironcrown Throne',     tagline:'Rule the realm of reasoning — every level, a new kingdom',
    primary:'#1C1917', secondary:'#7C2D12', accent:'#FBBF24',
    bg:'linear-gradient(160deg,#1C1917,#451A03,#7C2D12)', particle:'ember',
    icons:['⚔️','🏰','🛡️','👑','🐉'], costMult:1.3 },
  { id:'arcane_spire', from:21, to:30,     name:'Arcane Spire Academy', tagline:'Master the spells of the mind in the tower of infinite study',
    primary:'#1E1B4B', secondary:'#4C1D95', accent:'#A78BFA',
    bg:'linear-gradient(160deg,#1E1B4B,#312E81,#4C1D95)', particle:'rune',
    icons:['📖','🪄','🔮','✨','🦉'], costMult:1.6 },
  { id:'vanguard',     from:31, to:40,     name:'Vanguard Protocol',    tagline:'Become the shield between you and exam failure',
    primary:'#7F1D1D', secondary:'#1E3A8A', accent:'#FBBF24',
    bg:'linear-gradient(160deg,#7F1D1D,#1E3A8A,#1E40AF)', particle:'aurora',
    icons:['🛡️','⚡','🦅','💪','🎯'], costMult:2.0 },
  { id:'velocity',     from:41, to:50,     name:'Velocity Circuit',     tagline:'Outrun every rival, lap after lap, level after level',
    primary:'#0C0C0C', secondary:'#DC2626', accent:'#FBBF24',
    bg:'linear-gradient(160deg,#0C0C0C,#7F1D1D,#1C1917)', particle:'speed_lines',
    icons:['🏎️','🏁','⚡','💨','🔥'], costMult:2.5 },
  { id:'infinity',     from:51, to:999999, name:'Infinity Horizon',     tagline:'Beyond every level lies another galaxy of mastery',
    primary:'#0A0A1E', secondary:'#1E1B4B', accent:'#67E8F9',
    bg:'linear-gradient(160deg,#0A0A1E,#1E1B4B,#312E81)', particle:'starfield',
    icons:['🌌','🚀','⭐','🛸','🌠'], costMult:3.0 },
]

export function getUniverseForLevel(level) {
  // Beyond infinity tier, theme cycles back through with intensified colors (truly unlimited)
  if (level > 50) {
    const cycle = Math.floor((level - 51) / 50) % 5
    const base = THEME_UNIVERSES[cycle]
    return { ...base, name: `${base.name} II`, from: 51 + cycle*50, to: 100 + cycle*50 }
  }
  return THEME_UNIVERSES.find(u => level >= u.from && level <= u.to) || THEME_UNIVERSES[0]
}

// ── LEVEL DIFFICULTY SCALING (procedural — no pre-built content needed) ──
export function getLevelConfig(level, baseGame) {
  // Every 5 levels: +1 question, -3% time, harder difficulty mix
  const tier = Math.floor((level - 1) / 5)
  const questionCount = (baseGame.question_count || 10) + tier
  const duration = Math.max(20, Math.round((baseGame.duration_secs || 60) * Math.pow(0.97, tier)))

  const difficultyMix = level <= 5  ? ['L1','L2']
    : level <= 15 ? ['L2','L3']
    : level <= 30 ? ['L2','L3','L4']
    : ['L3','L4','L5']

  return { questionCount, duration, difficultyMix, level }
}

// ── UNLOCK COST (admin-controlled growth curve) ──────────────────────────
export async function getUnlockCost(level) {
  const universe = getUniverseForLevel(level)
  try {
    const { data } = await supabase.rpc('get_level_unlock_cost', {
      p_level: level, p_universe_mult: universe.costMult
    })
    return data || Math.ceil(20 * Math.pow(1.15, level) * universe.costMult)
  } catch {
    return Math.ceil(20 * Math.pow(1.15, level) * universe.costMult)
  }
}

// ── ADMIN GOD-MODE: full access, zero gates, zero data pollution ──────────
// Admin can jump straight to ANY level of ANY game, instantly, for testing.
// Every admin play is tagged is_admin_test=true so it never touches real
// student leaderboards, skill snapshots, or coin economy.
export function isAdminUser(user) {
  return user?.role === 'admin'
}

// ── FETCH USER'S PROGRESS FOR A GAME ──────────────────────────────────────
export async function getUserLevelProgress(userId, gameId, isAdmin = false) {
  if (isAdmin) {
    // Admin sees everything unlocked, no DB read needed
    return { current_level: 1, highest_unlocked: 999999, total_stars: 999, levels_completed: 999, is_admin_test: true }
  }
  if (!userId) return { current_level: 1, highest_unlocked: 1, total_stars: 0, levels_completed: 0 }
  try {
    const { data } = await supabase
      .from('user_game_levels').select('*')
      .eq('user_id', userId).eq('game_id', gameId).single()
    if (data) return data

    // First time playing this game — initialize
    await supabase.from('user_game_levels').insert({
      user_id: userId, game_id: gameId, current_level: 1, highest_unlocked: 1
    })
    return { current_level: 1, highest_unlocked: 1, total_stars: 0, levels_completed: 0 }
  } catch {
    return { current_level: 1, highest_unlocked: 1, total_stars: 0, levels_completed: 0 }
  }
}

// ── UNLOCK NEXT LEVEL (free, after completing current one) ────────────────
export async function unlockNextLevelFree(userId, gameId, completedLevel, score, maxScore, isAdmin = false) {
  const stars = score >= maxScore * 0.9 ? 3 : score >= maxScore * 0.7 ? 2 : score >= maxScore * 0.4 ? 1 : 0

  if (isAdmin) {
    // Log for debugging only, tagged so it never pollutes real data
    try {
      await supabase.from('level_completions').insert({
        user_id: userId, game_id: gameId, level_number: completedLevel,
        stars_earned: stars, score, unlocked_via: 'progression', is_admin_test: true,
      })
    } catch {}
    return { stars, newLevelUnlocked: completedLevel + 1 }
  }

  try {
    await supabase.from('level_completions').upsert({
      user_id: userId, game_id: gameId, level_number: completedLevel,
      stars_earned: stars, score, unlocked_via: 'progression',
    }, { onConflict: 'user_id,game_id,level_number' })

    const { data: current } = await supabase
      .from('user_game_levels').select('*').eq('user_id', userId).eq('game_id', gameId).single()

    const newHighest = Math.max(current?.highest_unlocked || 1, completedLevel + 1)
    const newCompleted = (current?.levels_completed || 0) + 1
    const newStars = (current?.total_stars || 0) + stars

    await supabase.from('user_game_levels').upsert({
      user_id: userId, game_id: gameId,
      current_level: completedLevel + 1,
      highest_unlocked: newHighest,
      total_stars: newStars,
      levels_completed: newCompleted,
      last_played_at: new Date().toISOString(),
    }, { onConflict: 'user_id,game_id' })

    return { stars, newLevelUnlocked: completedLevel + 1 }
  } catch {
    return { stars, newLevelUnlocked: completedLevel + 1 }
  }
}

// ── UNLOCK LEVEL WITH COINS (skip-ahead, no need to clear previous) ───────
export async function unlockLevelWithCoins(userId, gameId, targetLevel, spendCoinsFn) {
  const cost = await getUnlockCost(targetLevel)
  const ok = await spendCoinsFn?.(cost, `level_unlock_${gameId}_${targetLevel}`)
  if (!ok) return { success: false, cost }

  try {
    const { data: current } = await supabase
      .from('user_game_levels').select('*').eq('user_id', userId).eq('game_id', gameId).single()

    await supabase.from('user_game_levels').upsert({
      user_id: userId, game_id: gameId,
      current_level: targetLevel,
      highest_unlocked: Math.max(current?.highest_unlocked || 1, targetLevel),
      total_stars: current?.total_stars || 0,
      levels_completed: current?.levels_completed || 0,
      last_played_at: new Date().toISOString(),
    }, { onConflict: 'user_id,game_id' })

    await supabase.from('level_completions').insert({
      user_id: userId, game_id: gameId, level_number: targetLevel,
      stars_earned: 0, score: 0, unlocked_via: 'coins_paid', coins_spent: cost,
    })

    return { success: true, cost }
  } catch {
    return { success: false, cost }
  }
}

// ── REAL SKILL IMPROVEMENT (NEVER fabricated — pulled from actual answer data) ──
export async function getRealSkillImprovement(userId) {
  if (!userId) return []
  try {
    // Trigger fresh snapshot computation (safe to call often, upserts by date)
    await supabase.rpc('compute_topic_skill_snapshot', { p_user_id: userId })

    const { data } = await supabase
      .from('user_skill_improvement')
      .select('*')
      .eq('user_id', userId)
      .order('improvement_pct', { ascending: false })

    return data || []
  } catch {
    return []
  }
}