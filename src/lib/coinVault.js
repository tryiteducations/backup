/**
 * CoinVault v2 — Discipline engine
 * Earn for good performance · DEDUCTED for poor performance
 * Negative balance → must earn back or buy coins
 * WhatsApp pattern: local-first, background sync
 */
import { supabase } from './supabase'

// ── Coin earn rates ───────────────────────────────────────────────
export const COIN_RATES = {
  test_complete:         { formula:'score_pct * 1.5', max:150 },
  test_perfect:          { flat:200 },
  test_first_ever:       { flat:100 },
  focus_25min:           { flat:25  },
  focus_45min:           { flat:40  },
  focus_4sessions:       { flat:50  },
  guru_answer:           { flat:25  },
  guru_best_answer:      { flat:50  },
  game_win:              { formula:'score * 0.5 + 10', max:50 },
  game_perfect:          { flat:75  },
  streak_3:              { flat:10  },
  streak_7:              { flat:30  },
  streak_14:             { flat:60  },
  streak_30:             { flat:150 },
  streak_100:            { flat:500 },
  daily_quiz:            { flat:15  },
  current_affairs_read:  { flat:5   },
  career_compass:        { flat:20  },
  scholarship_applied:   { flat:10  },
  referral:              { flat:100 },
  battle_win:            { flat:200 },
  battle_join:           { flat:10  },
  tournament_win:        { flat:500 },
  tournament_top10:      { flat:100 },
  achievement:           { flat:50  },
  level_up:              { formula:'level * 50' },
  onboarding_complete:   { flat:50  },
  community_post:        { flat:30  },
  community_verified:    { flat:100 },
}

// ── DEDUCTION RULES — discipline engine ──────────────────────────
export const DEDUCTION_RULES = {
  min_pass_pct: {
    default:     70,   // 70% minimum for most exams
    'UPSC CSE':  60,
    'NEET UG':   65,
    'JEE Main':  60,
    'SSC CHSL':  65,
    speed_test:  50,
    custom:      60,
  },
  deduction_formula: 'same_as_earn', // deduct what they would have earned
  min_balance:     -500,             // can't go below -500
  warning_at:      -100,             // show warning at -100
  blocked_at:      -200,             // can't take new tests below -200 (must buy back)
}

// ── Coin purchase packs ───────────────────────────────────────────
export const COIN_PACKS = [
  { id:'starter',   coins:100,  price:5,   label:'Starter Pack',  popular:false },
  { id:'standard',  coins:500,  price:19,  label:'Standard Pack', popular:true  },
  { id:'value',     coins:1500, price:49,  label:'Value Pack',    popular:false },
  { id:'pro',       coins:3500, price:99,  label:'Pro Pack',      popular:false },
]

// ── Local storage ─────────────────────────────────────────────────
const TX_KEY  = 'tryit_coin_txs'
const BAL_KEY = 'tryit_coin_balance'

export function getBalance()  { return parseInt(localStorage.getItem(BAL_KEY) || '0') }
function saveBalance(b)       { localStorage.setItem(BAL_KEY, String(b)) }
function getTxs()             { return JSON.parse(localStorage.getItem(TX_KEY) || '[]') }

// ── Core earn/deduct ──────────────────────────────────────────────
export async function earnCoins({ source, amount, description, userId, sourceId }) {
  if (!amount || amount === 0) return { coins: 0, balance: getBalance() }
  const current  = getBalance()
  const isDeduct = amount < 0

  // Enforce minimum balance floor
  if (isDeduct && current + amount < DEDUCTION_RULES.min_balance) {
    amount = DEDUCTION_RULES.min_balance - current
  }

  const tx = {
    id:          `tx-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    amount, source, source_id: sourceId || null,
    description: description || source,
    created_at:  new Date().toISOString(),
    synced: false,
  }
  const txs     = getTxs()
  const balance = current + amount
  txs.unshift(tx)
  if (txs.length > 500) txs.splice(500)
  localStorage.setItem(TX_KEY, JSON.stringify(txs))
  saveBalance(balance)

  if (userId) {
    try {
      await supabase.from('coin_transactions').insert({
        user_id: userId, amount, source, source_id: sourceId, description, balance
      })
    } catch {}
  }
  return { coins: amount, balance }
}

export async function spendCoins({ source, amount, description, userId }) {
  const balance = getBalance()
  if (balance < amount) return { success:false, reason:'Insufficient coins', balance }
  const r = await earnCoins({ source, amount:-amount, description, userId })
  return { success:true, ...r }
}

// ── TEST RESULT REWARD / DEDUCTION ────────────────────────────────
export async function processTestResult({ score, examName, examType='default', userId }) {
  const minPct   = DEDUCTION_RULES.min_pass_pct[examName]
               || DEDUCTION_RULES.min_pass_pct[examType]
               || DEDUCTION_RULES.min_pass_pct.default
  const earned   = Math.round(score * 1.5)
  const passed   = score >= minPct

  if (passed) {
    const r = await earnCoins({ source:'test', amount:earned, description:`${examName} — ${score.toFixed(1)}% ✅ Passed`, userId })
    return { ...r, passed:true, deducted:0, earnedCoins:earned, minPct }
  } else {
    // DEDUCT — same amount as they would have earned
    const deduct = -Math.round(earned * ((minPct - score) / minPct))
    const r = await earnCoins({ source:'test_fail', amount:deduct, description:`${examName} — ${score.toFixed(1)}% ❌ Below ${minPct}% minimum`, userId })
    return { ...r, passed:false, deducted:Math.abs(deduct), earnedCoins:0, minPct }
  }
}

// ── All section helpers (unchanged) ──────────────────────────────
export async function rewardFocusSession({ minutes, userId }) {
  const rate = minutes >= 45 ? COIN_RATES.focus_45min.flat : COIN_RATES.focus_25min.flat
  return earnCoins({ source:'focus', amount:rate, description:`Focus session — ${minutes}min`, userId })
}
export async function rewardGuruAnswer({ isBest, userId }) {
  return earnCoins({ source:'guru', amount: isBest ? 50 : 25, description: isBest?'Best answer! 🌟':'Answer accepted', userId })
}
export async function rewardGame({ score, isPerfect, gameName, userId }) {
  const coins = isPerfect ? 75 : Math.min(50, Math.round(score*0.5)+10)
  return earnCoins({ source:'game', amount:coins, description:`${gameName} — ${isPerfect?'Perfect!':score+' pts'}`, userId })
}
export async function rewardStreak({ days, userId }) {
  const map = {3:10,7:30,14:60,30:150,100:500}
  const coins = map[days]; if(!coins) return null
  return earnCoins({ source:'streak', amount:coins, description:`${days}-day streak! 🔥`, userId })
}
export async function rewardCurrentAffairsRead({ userId }) {
  return earnCoins({ source:'current_affairs', amount:5, description:'Read today\'s current affairs 📰', userId })
}
export async function rewardOnboarding({ userId }) {
  return earnCoins({ source:'onboarding', amount:50, description:'Welcome to TryIT! 🎉 +50 coins', userId })
}
export async function rewardCommunityPost({ verified, userId }) {
  return earnCoins({ source:'community', amount: verified?100:30, description: verified?'Verified success story! 🏆':'Success story posted', userId })
}
export async function rewardReferral({ email, userId }) {
  return earnCoins({ source:'referral', amount:100, description:`Referral: ${email} joined`, userId })
}
export async function rewardBattleWin({ opponentName, userId }) {
  return earnCoins({ source:'battle', amount:200, description:`Battle won vs ${opponentName}! ⚔️`, userId })
}

// ── Coin purchase (Razorpay) ──────────────────────────────────────
export async function purchaseCoins({ packId, userId, name, email }) {
  const pack = COIN_PACKS.find(p=>p.id===packId)
  if (!pack) return { success:false, reason:'Invalid pack' }

  return new Promise((resolve) => {
    const options = {
      key:         import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
      amount:      pack.price * 100,
      currency:    'INR',
      name:        'TryIT Educations',
      description: `${pack.label} — ${pack.coins} coins`,
      image:       '/tryit-logo.webp',
      prefill:     { name, email },
      notes:       { coins: pack.coins, pack_id: packId, user_id: userId },
      theme:       { color:'#D4AF37' },
      handler: async (response) => {
        // Payment successful — credit coins
        await earnCoins({ source:'purchase', amount:pack.coins, description:`Purchased ${pack.coins} coins (₹${pack.price})`, userId })
        resolve({ success:true, coins:pack.coins, payment_id: response.razorpay_payment_id })
      },
      modal: { ondismiss: () => resolve({ success:false, reason:'Cancelled' }) },
    }
    if (window.Razorpay) {
      new window.Razorpay(options).open()
    } else {
      // Dev mode — instant credit
      earnCoins({ source:'purchase', amount:pack.coins, description:`[Dev] Purchased ${pack.coins} coins`, userId })
        .then(() => resolve({ success:true, coins:pack.coins }))
    }
  })
}

export function getWalletData() {
  return { balance:getBalance(), transactions:getTxs().slice(0,50) }
}
export async function syncPendingTransactions(userId) {
  const txs = getTxs().filter(t=>!t.synced)
  if (!txs.length) return
  try {
    await supabase.from('coin_transactions').insert(txs.map(t=>({ user_id:userId, amount:t.amount, source:t.source, description:t.description, created_at:t.created_at })))
    localStorage.setItem(TX_KEY, JSON.stringify(getTxs().map(t=>({...t,synced:true}))))
  } catch {}
}
