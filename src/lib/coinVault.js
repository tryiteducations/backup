/**
 * CoinVault — Single source of truth for all coin operations
 * Every feature in TryIT connects here to earn/spend coins
 * Offline-first: saves locally, syncs to Supabase when online
 */
import { supabase } from './supabase'

// ── Coin earn rates (locked) ──────────────────────────────────────
export const COIN_RATES = {
  // Tests
  test_complete:        { base: 50,  max: 150, formula: 'score_pct * 1.5' },
  test_perfect_score:   { flat: 200  },
  test_first_attempt:   { flat: 25   },
  // Focus Mode
  focus_session_25min:  { flat: 25   },
  focus_session_45min:  { flat: 40   },
  focus_4_sessions:     { flat: 50   }, // bonus
  // Guru Hub
  doubt_answered:       { flat: 25   }, // mentor
  best_answer:          { flat: 50   }, // mentor
  doubt_reaction_5:     { flat: 10   }, // asker
  // Games
  game_win:             { base: 10, max: 50, formula: 'score * 0.5' },
  game_perfect:         { flat: 75   },
  daily_game:           { flat: 5    },
  // Streak
  streak_3:             { flat: 10   },
  streak_7:             { flat: 30   },
  streak_14:            { flat: 60   },
  streak_30:            { flat: 150  },
  streak_100:           { flat: 500  },
  // Daily
  daily_quiz:           { flat: 15   },
  current_affairs_read: { flat: 5    },
  career_compass:       { flat: 20   },
  // Social
  referral_signup:      { flat: 100  },
  hall_battle_win:      { flat: 200  },
  tournament_win:       { flat: 500  },
  tournament_top10:     { flat: 100  },
  // Achievements
  badge_earned:         { flat: 50   },
  level_up:             { base: 100, formula: 'level * 50' },
  // Scholarship saved:
  scholarship_applied:  { flat: 10   },
}

// ── Coin spend options ────────────────────────────────────────────
export const COIN_COSTS = {
  unlock_premium_test:   100,
  unlock_test_pack:      500,
  buy_guru_book:         150,
  extra_test_attempt:    50,
  unlock_id_template:    200,
  hall_rank_boost:       150,
  premium_doubt_priority: 75,
}

// ── localStorage key ──────────────────────────────────────────────
const TX_KEY       = 'tryit_coin_txs'
const BALANCE_KEY  = 'tryit_coin_balance'

function getTxs()     { return JSON.parse(localStorage.getItem(TX_KEY)    || '[]') }
function getBalance() { return parseInt(localStorage.getItem(BALANCE_KEY) || '0') }
function saveBalance(b){ localStorage.setItem(BALANCE_KEY, String(b)) }

// ── Core earn function ────────────────────────────────────────────
export async function earnCoins({ source, amount, description, userId, sourceId }) {
  if (!amount || amount <= 0) return { coins: 0, balance: getBalance() }

  const tx = {
    id:          `tx-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    amount,
    source,
    source_id:   sourceId || null,
    description: description || source,
    created_at:  new Date().toISOString(),
    synced:      false,
  }

  // Save locally first (offline-first)
  const txs     = getTxs()
  const balance = getBalance() + amount
  txs.unshift(tx)
  if (txs.length > 500) txs.splice(500) // keep last 500
  localStorage.setItem(TX_KEY, JSON.stringify(txs))
  saveBalance(balance)

  // Sync to Supabase if online
  if (userId) {
    try {
      await supabase.from('coin_transactions').insert({
        user_id:     userId,
        amount,
        source,
        source_id:   sourceId,
        description,
        balance,
      })
    } catch {}
  }

  return { coins: amount, balance }
}

// ── Core spend function ───────────────────────────────────────────
export async function spendCoins({ source, amount, description, userId }) {
  const balance = getBalance()
  if (balance < amount) return { success: false, reason: 'Insufficient coins', balance }

  return earnCoins({ source, amount: -amount, description, userId })
    .then(r => ({ success: true, ...r }))
}

// ── Section-specific helpers ──────────────────────────────────────

// Called when a test is completed
export async function rewardTestComplete({ score, examName, testType, userId }) {
  const pct    = Math.min(score, 100)
  const coins  = Math.round(pct * 1.5)
  return earnCoins({
    source:      'test',
    amount:      coins,
    description: `Completed ${examName} — ${score}%`,
    userId,
  })
}

// Called when focus session ends
export async function rewardFocusSession({ minutes, userId }) {
  const rate  = minutes >= 45 ? COIN_RATES.focus_session_45min.flat : COIN_RATES.focus_session_25min.flat
  return earnCoins({
    source:      'focus',
    amount:      rate,
    description: `Focus session — ${minutes} min`,
    userId,
  })
}

// Called when guru hub answer accepted
export async function rewardGuruAnswer({ isBest, userId }) {
  const coins = isBest ? COIN_RATES.best_answer.flat : COIN_RATES.doubt_answered.flat
  return earnCoins({
    source:      'guru',
    amount:      coins,
    description: isBest ? 'Best answer accepted!' : 'Answer accepted',
    userId,
  })
}

// Called when game session ends
export async function rewardGame({ score, isPerfect, userId, gameName }) {
  const coins = isPerfect
    ? COIN_RATES.game_perfect.flat
    : Math.min(COIN_RATES.game_win.max, Math.round(score * 0.5) + COIN_RATES.game_win.base)
  return earnCoins({
    source:      'game',
    amount:      coins,
    description: `${gameName} — ${isPerfect ? 'Perfect!' : score + ' pts'}`,
    userId,
  })
}

// Called on streak milestone
export async function rewardStreak({ days, userId }) {
  const map = { 3:10, 7:30, 14:60, 30:150, 100:500 }
  const coins = map[days]
  if (!coins) return null
  return earnCoins({
    source:      'streak',
    amount:      coins,
    description: `${days}-day streak bonus! 🔥`,
    userId,
  })
}

// Called when achievement unlocked
export async function rewardAchievement({ badgeName, userId }) {
  return earnCoins({
    source:      'achievement',
    amount:      COIN_RATES.badge_earned.flat,
    description: `Achievement: ${badgeName} 🏅`,
    userId,
  })
}

// Called when referral registers
export async function rewardReferral({ referredEmail, userId }) {
  return earnCoins({
    source:      'referral',
    amount:      COIN_RATES.referral_signup.flat,
    description: `Referral bonus — ${referredEmail} joined`,
    userId,
  })
}

// Called when hall battle won
export async function rewardBattleWin({ opponentName, userId }) {
  return earnCoins({
    source:      'battle',
    amount:      COIN_RATES.hall_battle_win.flat,
    description: `Hall battle won vs ${opponentName}! ⚔️`,
    userId,
  })
}

// Called when daily quiz done
export async function rewardDailyQuiz({ userId }) {
  return earnCoins({
    source:      'daily_quiz',
    amount:      COIN_RATES.daily_quiz.flat,
    description: 'Daily quiz completed 📅',
    userId,
  })
}

// Get balance and recent txs
export function getWalletData() {
  return {
    balance:      getBalance(),
    transactions: getTxs().slice(0, 50),
  }
}

// Sync all unsynced local txs to Supabase
export async function syncPendingTransactions(userId) {
  const txs    = getTxs()
  const unsync = txs.filter(t => !t.synced)
  if (!unsync.length) return
  try {
    await supabase.from('coin_transactions').insert(
      unsync.map(t => ({ user_id: userId, amount: t.amount, source: t.source, description: t.description, created_at: t.created_at }))
    )
    const synced = txs.map(t => ({ ...t, synced: true }))
    localStorage.setItem(TX_KEY, JSON.stringify(synced))
  } catch {}
}
