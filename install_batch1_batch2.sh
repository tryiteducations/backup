#!/bin/bash
# TryIT — Batch 1 + 2 Complete
# Coin deduction · Purchase packs · 7-layer paywall · Current Affairs +5 coins
# Leaderboard streak labels · Community Hall · Exam notifications · Agrarian removed
ROOT="${1:-/workspaces/Tatu}"
cd "$ROOT"
echo "Installing Batch 1 + Batch 2..."
mkdir -p src/pages/community src/hooks src/components
mkdir -p src/pages/community src/hooks src/components/paywall

# ══════════════════════════════════════════════════════════════════
# 1. COIN DEDUCTION + PURCHASE PACKS — updated coinVault.js
# ══════════════════════════════════════════════════════════════════
cat > src/lib/coinVault.js << 'EOF'
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
EOF
echo "coinVault v2 done"
# ══════════════════════════════════════════════════════════════════
# 2. RESULT SCREEN — coins wired + deduction shown
# ══════════════════════════════════════════════════════════════════
cat > src/pages/test-engine/ResultScreen.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { processTestResult, DEDUCTION_RULES, getBalance } from '../../lib/coinVault'

export default function ResultScreen() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useAuth()
  const { balance } = useCoins()
  const [result,  setResult]  = useState(null)
  const [animate, setAnimate] = useState(false)

  const data = location.state || {
    score:78, correct:39, incorrect:8, skipped:3,
    total:50, examName:'SSC CGL Mock', time:'42:18',
    examType:'default', subject:'Mixed',
  }

  useEffect(() => {
    async function processResult() {
      const r = await processTestResult({
        score:      data.score,
        examName:   data.examName,
        examType:   data.examType || 'default',
        userId:     user?.id,
      })
      setResult(r)
      setTimeout(() => setAnimate(true), 300)
    }
    processResult()
  }, [])

  const pct      = data.score
  const passed   = result?.passed ?? pct >= 70
  const grade    = pct>=90?'A+':pct>=80?'A':pct>=70?'B':pct>=60?'C':'F'
  const gradeColor = pct>=70?'#22C55E':pct>=60?'#F59E0B':'#EF4444'

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', padding:'20px 16px' }}>
      <div style={{ maxWidth:560, margin:'0 auto' }}>

        {/* Score card */}
        <div style={{
          background: passed
            ? 'linear-gradient(135deg,#1E3A5F,#0F2140)'
            : 'linear-gradient(135deg,#7F1D1D,#991B1B)',
          borderRadius:28, padding:28, marginBottom:16,
          border: `1.5px solid ${passed?'rgba(212,175,55,0.3)':'rgba(239,68,68,0.3)'}`,
          textAlign:'center', position:'relative', overflow:'hidden',
        }}>
          {/* Grade circle */}
          <div style={{ width:96, height:96, borderRadius:'50%',
            background: passed?'rgba(212,175,55,0.15)':'rgba(239,68,68,0.15)',
            border:`3px solid ${gradeColor}`, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color:gradeColor, fontSize:32, lineHeight:1 }}>{grade}</span>
          </div>

          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginBottom:4 }}>{data.examName}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            color:'#fff', fontSize:52, lineHeight:1, marginBottom:8 }}>
            {pct.toFixed(1)}%
          </p>
          <p style={{ color: passed?'#4ADE80':'#FCA5A5', fontSize:16, fontWeight:700 }}>
            {passed ? '✅ Passed! Great work!' : `❌ Below ${result?.minPct || 70}% minimum`}
          </p>
        </div>

        {/* COIN RESULT — earn or deduction */}
        {result && (
          <div style={{
            background: result.passed?'#DCFCE7':'#FEE2E2',
            border: `1.5px solid ${result.passed?'#22C55E':'#EF4444'}`,
            borderRadius:20, padding:18, marginBottom:16,
            display:'flex', alignItems:'center', gap:14,
          }}>
            <span style={{ fontSize:40 }}>🪙</span>
            <div style={{ flex:1 }}>
              {result.passed ? (
                <>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                    color:'#15803D', fontSize:22 }}>
                    +{result.earnedCoins} coins earned!
                  </p>
                  <p style={{ color:'#166534', fontSize:13, marginTop:2 }}>
                    Scored above {result.minPct}% minimum · Balance: {result.balance} 🪙
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                    color:'#991B1B', fontSize:22 }}>
                    -{result.deducted} coins deducted
                  </p>
                  <p style={{ color:'#991B1B', fontSize:13, marginTop:2 }}>
                    Scored below {result.minPct}% minimum · Balance: {result.balance} 🪙
                  </p>
                  {result.balance < -100 && (
                    <p style={{ color:'#DC2626', fontSize:12, fontWeight:700, marginTop:6 }}>
                      ⚠️ Balance very low. Earn coins or buy a pack to continue.
                    </p>
                  )}
                </>
              )}
            </div>
            {!result.passed && (
              <button onClick={()=>navigate('/wallet')}
                style={{ background:'#EF4444', border:'none', borderRadius:12,
                  padding:'8px 14px', color:'#fff', fontFamily:'Poppins,sans-serif',
                  fontWeight:700, fontSize:12, cursor:'pointer', flexShrink:0 }}>
                Buy Coins
              </button>
            )}
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)',
          gap:10, marginBottom:16 }}>
          {[
            ['✅',data.correct,   'Correct',   '#22C55E'],
            ['❌',data.incorrect, 'Incorrect', '#EF4444'],
            ['⏭️',data.skipped,   'Skipped',   '#F59E0B'],
            ['⏱️',data.time,      'Time',      '#8B5CF6'],
          ].map(([e,v,l,c])=>(
            <div key={l} style={{ background:'#fff', borderRadius:18,
              padding:'14px 12px', textAlign:'center',
              border:'1.5px solid #E2E8F0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize:24 }}>{e}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                color:c, fontSize:24 }}>{v}</p>
              <p style={{ color:'#94A3B8', fontSize:12 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Rank improvement */}
        <div style={{ background:'#fff', borderRadius:20, padding:18,
          marginBottom:16, border:'1.5px solid #E2E8F0' }}>
          <div style={{ display:'flex', justifyContent:'space-between',
            alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                color:'#1E3A5F', fontSize:16 }}>All-India Rank</p>
              <p style={{ color:'#94A3B8', fontSize:12 }}>Updated after this test</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ textAlign:'center' }}>
                <p style={{ color:'#94A3B8', fontSize:11 }}>Before</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                  color:'#64748B', fontSize:18 }}>#{user?.rank?.toLocaleString() || '1,243'}</p>
              </div>
              <span style={{ color:'#D4AF37', fontSize:24 }}>→</span>
              <div style={{ textAlign:'center' }}>
                <p style={{ color:'#94A3B8', fontSize:11 }}>After</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                  color:passed?'#22C55E':'#EF4444', fontSize:18 }}>
                  #{passed
                    ? ((user?.rank || 1243) - Math.floor(pct/5)).toLocaleString()
                    : ((user?.rank || 1243) + Math.floor((100-pct)/5)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={()=>navigate('/test-engine/review', { state:data })}
            style={{ padding:14, borderRadius:14, border:'none',
              background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
              color:'#D4AF37', fontFamily:'Poppins,sans-serif',
              fontWeight:700, fontSize:15, cursor:'pointer' }}>
            📖 Review Answers
          </button>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={()=>navigate('/test-engine')}
              style={{ flex:1, padding:13, borderRadius:14,
                border:'1.5px solid #E2E8F0', background:'#fff',
                color:'#64748B', fontFamily:'Poppins,sans-serif',
                fontWeight:600, fontSize:14, cursor:'pointer' }}>
              Try Again
            </button>
            <button onClick={()=>navigate('/dashboard')}
              style={{ flex:1, padding:13, borderRadius:14, border:'none',
                background:'linear-gradient(135deg,#D4AF37,#E8C44A)',
                color:'#1E3A5F', fontFamily:'Poppins,sans-serif',
                fontWeight:700, fontSize:14, cursor:'pointer' }}>
              Dashboard →
            </button>
          </div>
          {!result?.passed && (
            <button onClick={()=>navigate('/wallet')}
              style={{ padding:13, borderRadius:14, border:'none',
                background:'linear-gradient(135deg,#EF4444,#DC2626)',
                color:'#fff', fontFamily:'Poppins,sans-serif',
                fontWeight:700, fontSize:14, cursor:'pointer' }}>
              🪙 Buy Coins to Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
EOF
echo "ResultScreen done"

# ── WIRE FOCUS MODE ───────────────────────────────────────────────
cat > src/pages/focus-mode/FocusMode.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { rewardFocusSession } from '../../lib/coinVault'

const DURATIONS = [15,25,45,60]
const SOUNDS    = [
  { id:'rain',    label:'🌧️ Rain',    desc:'Gentle rain on a tin roof'    },
  { id:'forest',  label:'🌿 Forest',  desc:'Birds & rustling leaves'      },
  { id:'cafe',    label:'☕ Café',    desc:'Soft café chatter'            },
  { id:'silence', label:'🤫 Silence', desc:'Pure focus — no sound'        },
  { id:'ocean',   label:'🌊 Ocean',  desc:'Slow ocean waves'             },
]
const SUBJECTS  = ['Quantitative Aptitude','Reasoning','English','General Knowledge','Current Affairs','Mock Test','Custom']

export default function FocusMode() {
  const { user }   = useAuth()
  const { earn, balance } = useCoins()
  const [duration, setDuration] = useState(25)
  const [sound,    setSound]    = useState('rain')
  const [subject,  setSubject]  = useState('Quantitative Aptitude')
  const [running,  setRunning]  = useState(false)
  const [remaining,setRemain]   = useState(25*60)
  const [sessions, setSessions] = useState(0)
  const [earned,   setEarned]   = useState(0)
  const intervalRef = useRef(null)
  const pct = ((duration*60-remaining)/(duration*60))*100
  const mins = Math.floor(remaining/60), secs = remaining%60

  const start = () => {
    setRemain(duration*60); setRunning(true)
  }
  const stop = () => { setRunning(false); clearInterval(intervalRef.current) }

  const finish = async () => {
    setRunning(false); clearInterval(intervalRef.current)
    setSessions(s=>s+1)
    const result = await rewardFocusSession({ minutes:duration, userId:user?.id })
    if (result?.coins) {
      earn({ source:'focus', amount:result.coins, description:`Focus ${duration}min — ${subject}` })
      setEarned(e => e + result.coins)
    }
  }

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(()=>{
      setRemain(r => {
        if (r<=1) { clearInterval(intervalRef.current); finish(); return 0 }
        return r-1
      })
    },1000)
    return ()=>clearInterval(intervalRef.current)
  },[running])

  const circumference = 2*Math.PI*88

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:4 }}>🎯 Focus Mode</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Study smart · Earn coins · Build discipline</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap:20 }}>
        {/* Timer */}
        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:24, padding:28, display:'flex', flexDirection:'column', alignItems:'center', gap:18, border:'1.5px solid rgba(212,175,55,0.3)' }}>
          <div style={{ position:'relative', width:200, height:200 }}>
            <svg width="200" height="200" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
              <circle cx="100" cy="100" r="88" fill="none" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={circumference-(pct/100)*circumference}
                style={{ transition:'stroke-dashoffset 1s linear' }}/>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:44, lineHeight:1 }}>
                {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
              </p>
              <p style={{ color:'#D4AF37', fontSize:12, marginTop:4 }}>{subject.slice(0,16)}</p>
            </div>
          </div>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
            {DURATIONS.map(d=>(
              <button key={d} onClick={()=>{ if(!running){ setDuration(d); setRemain(d*60) }}}
                disabled={running}
                style={{ padding:'7px 14px', borderRadius:20, border:'none', cursor:running?'not-allowed':'pointer', background:duration===d?'rgba(212,175,55,0.2)':'rgba(255,255,255,0.08)', color:duration===d?'#D4AF37':'rgba(255,255,255,0.5)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13 }}>
                {d}min
              </button>
            ))}
          </div>

          {!running
            ? <button onClick={start} style={{ width:'100%', padding:14, borderRadius:14, border:'none', background:'linear-gradient(135deg,#D4AF37,#E8C44A)', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:'#1E3A5F', cursor:'pointer' }}>▶ Start</button>
            : <div style={{ display:'flex', gap:10, width:'100%' }}>
                <button onClick={stop} style={{ flex:1, padding:12, borderRadius:12, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700 }}>⏸ Pause</button>
                <button onClick={finish} style={{ flex:1, padding:12, borderRadius:12, border:'1px solid rgba(34,197,94,0.3)', background:'rgba(34,197,94,0.15)', color:'#4ADE80', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700 }}>✓ Done</button>
              </div>
          }

          <div style={{ display:'flex', gap:16 }}>
            {[['📅',sessions,'Sessions'],['🪙',earned,'Coins earned'],['💰',balance,'Balance']].map(([e,v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <p style={{ fontSize:18 }}>{e}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:16 }}>{v}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Subject */}
          <div style={{ background:'#fff', borderRadius:20, padding:18, border:'1.5px solid #E2E8F0' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>📚 Studying</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {SUBJECTS.map(s=>(
                <button key={s} onClick={()=>setSubject(s)} style={{ padding:'7px 14px', borderRadius:20, border:'none', cursor:'pointer', background:subject===s?'#1E3A5F':'#F1F5F9', color:subject===s?'#fff':'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12 }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Sounds */}
          <div style={{ background:'#fff', borderRadius:20, padding:18, border:'1.5px solid #E2E8F0' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:10 }}>🎵 Ambient Sound</p>
            {SOUNDS.map(s=>(
              <button key={s.id} onClick={()=>setSound(s.id)}
                style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 12px', borderRadius:12, border:`1.5px solid ${sound===s.id?'#D4AF37':'#E2E8F0'}`, background:sound===s.id?'rgba(212,175,55,0.06)':'#F8FAFC', cursor:'pointer', marginBottom:6, textAlign:'left' }}>
                <span style={{ fontSize:18 }}>{s.label.split(' ')[0]}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E293B', fontSize:13 }}>{s.label}</p>
                  <p style={{ color:'#94A3B8', fontSize:11 }}>{s.desc}</p>
                </div>
                {sound===s.id && <span style={{ color:'#D4AF37', fontWeight:800 }}>✓</span>}
              </button>
            ))}
          </div>

          <div style={{ background:'rgba(212,175,55,0.08)', borderRadius:18, padding:14, border:'1.5px solid rgba(212,175,55,0.2)' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14, marginBottom:6 }}>🪙 Discipline Reward</p>
            <p style={{ color:'#64748B', fontSize:12, lineHeight:1.6 }}>
              25min = +25 coins · 45min = +40 coins<br/>
              4 sessions today = +50 bonus coins<br/>
              Score below minimum in tests = coins deducted
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
EOF
echo "FocusMode wired done"
# ══════════════════════════════════════════════════════════════════
# 3. WALLET — coin purchase packs + deduction warning
# ══════════════════════════════════════════════════════════════════
cat > src/pages/wallet/WalletPage.jsx << 'EOF'
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { COIN_PACKS, purchaseCoins, DEDUCTION_RULES } from '../../lib/coinVault'

const TRANSACTIONS_MOCK = [
  { icon:'📝', label:'SSC CGL Mock 4 — 82% ✅', amount:+123, date:'Today 10:23',     type:'earn'   },
  { icon:'🔥', label:'7-day streak bonus',       amount:+30,  date:'Today 07:00',     type:'earn'   },
  { icon:'📝', label:'UPSC Mock — 55% ❌ Below 60%', amount:-83, date:'Yesterday',    type:'deduct' },
  { icon:'🎯', label:'Focus Mode — 45min',        amount:+40,  date:'Yesterday',       type:'earn'   },
  { icon:'📰', label:'Read Current Affairs',      amount:+5,   date:'2 days ago',      type:'earn'   },
  { icon:'🎮', label:'Math Blitz — 87 pts',       amount:+43,  date:'2 days ago',      type:'earn'   },
  { icon:'🪙', label:'Purchased 500 coins ₹19',  amount:+500, date:'3 days ago',      type:'purchase'},
]

export default function WalletPage() {
  const { user }              = useAuth()
  const { balance, earn }     = useCoins()
  const [buying,  setBuying]  = useState(false)
  const [filter,  setFilter]  = useState('all')
  const [selected,setSelected]= useState('standard')

  const handleBuy = async (packId) => {
    setBuying(true)
    const pack = COIN_PACKS.find(p=>p.id===packId)
    const result = await purchaseCoins({
      packId, userId: user?.id,
      name: user?.name, email: user?.email,
    })
    if (result.success) {
      // CoinContext auto-updates via coinVault
    }
    setBuying(false)
  }

  const txFiltered = filter==='all' ? TRANSACTIONS_MOCK
    : TRANSACTIONS_MOCK.filter(t=>t.type===filter)

  const isLow     = balance < 0
  const isBlocked = balance < DEDUCTION_RULES.blocked_at

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:20 }}>🪙 My Wallet</h1>

      {/* Balance card */}
      <div style={{ background:`linear-gradient(135deg,${isLow?'#7F1D1D,#991B1B':'#1E3A5F,#0F2140'})`,
        borderRadius:24, padding:24, marginBottom:isLow?12:20,
        border:`1.5px solid ${isLow?'rgba(239,68,68,0.4)':'rgba(212,175,55,0.3)'}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>Coin Balance</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color: isLow?'#FCA5A5':'#D4AF37', fontSize:56, lineHeight:1 }}>
              {balance.toLocaleString()}
            </p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:4 }}>
              ≈ ₹{Math.max(0, balance * 0.08).toFixed(0)} in exam value
            </p>
          </div>
          <div style={{ display:'flex', gap:14 }}>
            {[['📈',TRANSACTIONS_MOCK.filter(t=>t.type!=='deduct').reduce((s,t)=>s+t.amount,0),'Earned'],
              ['📉',Math.abs(TRANSACTIONS_MOCK.filter(t=>t.type==='deduct').reduce((s,t)=>s+t.amount,0)),'Deducted']].map(([e,v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <p style={{ fontSize:20 }}>{e}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:20 }}>{v}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low balance warning */}
      {isLow && (
        <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:18, padding:14, marginBottom:14 }}>
          <p style={{ color:'#991B1B', fontWeight:700, fontSize:14, marginBottom:4 }}>
            {isBlocked ? '🚫 Tests Blocked — Balance too low' : '⚠️ Low Balance Warning'}
          </p>
          <p style={{ color:'#DC2626', fontSize:13 }}>
            {isBlocked
              ? `Your balance is ${balance}. You need at least ${DEDUCTION_RULES.blocked_at} coins to take tests. Buy a pack or earn coins.`
              : `Your balance is ${balance}. Score above minimum marks to earn coins back, or buy a pack.`
            }
          </p>
        </div>
      )}

      {/* Coin Packs */}
      <div style={{ background:'#fff', borderRadius:22, padding:20, marginBottom:16, border:'1.5px solid #E2E8F0', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16, marginBottom:16 }}>
          🪙 Buy Coins
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,180px),1fr))', gap:10, marginBottom:16 }}>
          {COIN_PACKS.map(pack=>(
            <div key={pack.id} onClick={()=>setSelected(pack.id)}
              style={{ borderRadius:18, padding:16, textAlign:'center', cursor:'pointer',
                border:`2px solid ${selected===pack.id?'#D4AF37':'#E2E8F0'}`,
                background: selected===pack.id?'rgba(212,175,55,0.06)':'#F8FAFC',
                position:'relative', transition:'all 0.2s',
                transform: selected===pack.id?'translateY(-3px)':'none',
                boxShadow: selected===pack.id?'0 8px 20px rgba(212,175,55,0.2)':'none' }}>
              {pack.popular && (
                <span style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)',
                  background:'#D4AF37', color:'#1E3A5F', fontSize:9, fontWeight:800,
                  padding:'2px 10px', borderRadius:20, whiteSpace:'nowrap' }}>
                  MOST POPULAR
                </span>
              )}
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:28 }}>
                {pack.coins.toLocaleString()}
              </p>
              <p style={{ color:'#64748B', fontSize:12, marginBottom:8 }}>{pack.label}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                color:'#1E3A5F', fontSize:20 }}>₹{pack.price}</p>
            </div>
          ))}
        </div>
        <button onClick={()=>handleBuy(selected)} disabled={buying}
          style={{ width:'100%', padding:14, borderRadius:14, border:'none',
            background: buying?'rgba(212,175,55,0.3)':'linear-gradient(135deg,#D4AF37,#E8C44A)',
            fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
            color:'#1E3A5F', cursor:buying?'not-allowed':'pointer' }}>
          {buying ? '⏳ Opening payment...' : `🔒 Buy ${COIN_PACKS.find(p=>p.id===selected)?.coins} coins for ₹${COIN_PACKS.find(p=>p.id===selected)?.price}`}
        </button>
        <p style={{ textAlign:'center', color:'#94A3B8', fontSize:11, marginTop:8 }}>
          UPI · Cards · Net Banking · Secure Razorpay
        </p>
      </div>

      {/* Deduction rules info */}
      <div style={{ background:'#FEF3C7', borderRadius:18, padding:14, marginBottom:16, border:'1px solid #F59E0B' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#92400E', marginBottom:8 }}>⚡ How the Discipline System Works</p>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {[
            ['✅','Score above 70% → earn coins (score × 1.5)'],
            ['❌','Score below 70% → coins DEDUCTED (same formula)'],
            ['🚫',`Balance below ${DEDUCTION_RULES.blocked_at} → tests blocked until you earn/buy`],
            ['🪙','Buy coins starting from ₹5 to continue'],
          ].map(([e,t])=>(
            <div key={t} style={{ display:'flex', gap:8 }}>
              <span>{e}</span>
              <p style={{ color:'#92400E', fontSize:12 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F' }}>History</p>
          <div style={{ display:'flex', gap:6 }}>
            {['all','earn','deduct','purchase'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{ padding:'5px 12px', borderRadius:20, border:'none', cursor:'pointer',
                  background:filter===f?'#1E3A5F':'#F1F5F9',
                  color:filter===f?'#fff':'#64748B',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12 }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        {txFiltered.map((t,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 18px',
            borderBottom:i<txFiltered.length-1?'1px solid #F8FAFC':'none',
            background:t.type==='deduct'?'rgba(239,68,68,0.03)':'#fff' }}>
            <div style={{ width:40, height:40, borderRadius:12, flexShrink:0,
              background:t.type==='deduct'?'#FEE2E2':t.type==='purchase'?'#EDE9FE':'#DCFCE7',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
              {t.icon}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E293B', fontSize:13 }}>{t.label}</p>
              <p style={{ color:'#94A3B8', fontSize:11 }}>{t.date}</p>
            </div>
            <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
              color:t.amount>0?'#22C55E':'#EF4444' }}>
              {t.amount>0?'+':''}{t.amount}
            </span>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
EOF
echo "Wallet done"
# ══════════════════════════════════════════════════════════════════
# 4. CURRENT AFFAIRS — auto-feed + read timer + +5 coins
# ══════════════════════════════════════════════════════════════════
cat > src/pages/current-affairs/CurrentAffairs.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { rewardCurrentAffairsRead } from '../../lib/coinVault'

const TODAY   = new Date().toLocaleDateString('en-IN',{ day:'numeric', month:'long', year:'numeric' })
const DOW     = new Date().toLocaleDateString('en-IN',{ weekday:'long' })
const READ_KEY = `tryit_ca_read_${new Date().toISOString().split('T')[0]}`
const LIMIT_FREE = 3   // free users read timer after 3

const ARTICLES = [
  { id:1, cat:'National',       emoji:'🇮🇳', important:true,
    title:'India Signs Comprehensive Free Trade Agreement with UK',
    body:'India and the United Kingdom formally signed a comprehensive Free Trade Agreement today after 3 years of negotiations, covering goods, services, and digital trade. The deal eliminates tariffs on 99% of Indian exports.',
    tags:['UPSC','SSC','IBPS'], date:'Today', readTime:45 },
  { id:2, cat:'Economy',        emoji:'💰', important:true,
    title:'RBI Keeps Repo Rate Unchanged at 6.25%',
    body:"The Reserve Bank of India's MPC voted 4-2 to maintain the repo rate at 6.25%, citing balanced inflation expectations. EMI on home and car loans remain unchanged.",
    tags:['IBPS','RBI','Banking'], date:'Today', readTime:40 },
  { id:3, cat:'Science',        emoji:'🚀', important:true,
    title:'ISRO Successfully Launches NISAR Earth Observation Satellite',
    body:"India's ISRO and NASA jointly launched the NISAR satellite — the world's most expensive Earth imaging satellite at $1.5 billion — from Sriharikota.",
    tags:['UPSC','SSC'], date:'Today', readTime:35 },
  { id:4, cat:'Sports',         emoji:'🏏', important:false,
    title:'India Wins T20 World Cup 2026, Defeats South Africa by 7 Wickets',
    body:'India clinched the ICC T20 World Cup 2026 final in the West Indies, with Rohit Sharma scoring an unbeaten 74. This is India\'s second T20 World Cup title.',
    tags:['GK','All Exams'], date:'Today', readTime:30 },
  { id:5, cat:'Awards',         emoji:'🏆', important:false,
    title:'Dr. Pankaj Advani Receives Padma Bhushan for Sports Excellence',
    body:'Billiards legend Dr. Pankaj Advani received the Padma Bhushan from the President of India for his outstanding contribution to Indian sports with 26 world titles.',
    tags:['UPSC','SSC'], date:'Today', readTime:30 },
  { id:6, cat:'Environment',    emoji:'🌍', important:true,
    title:'India Achieves 200 GW Solar Capacity — Third Largest in World',
    body:"India reached its ambitious 200 GW solar target ahead of schedule, cementing its position as the world's third-largest solar market after China and the USA.",
    tags:['UPSC','Environment'], date:'Today', readTime:40 },
  { id:7, cat:'International',  emoji:'🌐', important:true,
    title:"India Joins G7 as Permanent Observer — Historic Diplomatic Milestone",
    body:"India was granted permanent observer status at the G7 summit in Italy, a significant elevation of India's global diplomatic standing and economic influence.",
    tags:['UPSC','IR'], date:'Today', readTime:35 },
  { id:8, cat:'Economy',        emoji:'📊', important:true,
    title:'India GDP Growth 7.2% in FY26 — Fastest Growing Major Economy',
    body:"India's GDP grew 7.2% in FY2025-26, the third consecutive year of fastest growth among major economies, driven by manufacturing and services exports.",
    tags:['UPSC','IBPS','Economy'], date:'Today', readTime:40 },
]

const CATEGORIES = ['All','National','International','Economy','Science','Sports','Awards','Environment']

export default function CurrentAffairs() {
  const { user }          = useAuth()
  const { earn, balance } = useCoins()

  const [cat,        setCat]     = useState('All')
  const [saved,      setSaved]   = useState(new Set())
  const [expanded,   setExpanded]= useState(null)
  const [reading,    setReading] = useState(null)   // article id being timed
  const [readTimer,  setTimer]   = useState(0)
  const [rewarded,   setRewarded]= useState(()=>JSON.parse(localStorage.getItem(READ_KEY)||'[]'))
  const [todayCoins, setToday]   = useState(0)
  const [quizOpen,   setQuiz]    = useState(false)
  const timerRef = useRef(null)

  const isPro      = user?.isPro || false
  const readCount  = rewarded.length
  const filtered   = cat==='All' ? ARTICLES : ARTICLES.filter(a=>a.cat===cat)

  // Start read timer when article expanded
  const openArticle = (id) => {
    if (expanded === id) { setExpanded(null); stopTimer(); return }
    setExpanded(id)
    if (!rewarded.includes(id)) startTimer(id)
  }

  const startTimer = (id) => {
    setReading(id); setTimer(0)
    clearInterval(timerRef.current)
    const article = ARTICLES.find(a=>a.id===id)
    const needed  = article?.readTime || 30

    timerRef.current = setInterval(async () => {
      setTimer(t => {
        if (t+1 >= needed) {
          clearInterval(timerRef.current)
          awardCoins(id)
          return needed
        }
        return t+1
      })
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(timerRef.current)
    setReading(null); setTimer(0)
  }

  const awardCoins = async (id) => {
    if (rewarded.includes(id)) return
    const updated = [...rewarded, id]
    setRewarded(updated)
    localStorage.setItem(READ_KEY, JSON.stringify(updated))

    // Free users: only first 3 get coins (anti-spam)
    if (!isPro && updated.length > LIMIT_FREE) return

    const result = await rewardCurrentAffairsRead({ userId: user?.id })
    if (result?.coins) {
      earn({ source:'current_affairs', amount:5, description:'Read today\'s current affairs 📰' })
      setToday(c=>c+5)
    }
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28 }}>📰 Current Affairs</h1>
          <p style={{ color:'#94A3B8', fontSize:14 }}>Exam-tagged daily news · Read to earn coins</p>
        </div>
        <button onClick={()=>setQuiz(true)}
          style={{ background:'linear-gradient(135deg,#D4AF37,#E8C44A)', border:'none', borderRadius:14, padding:'11px 20px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>
          🎯 Daily Quiz +15 coins
        </button>
      </div>

      {/* Date + coins earned today */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(30,58,95,0.06)', border:'1px solid rgba(30,58,95,0.15)', borderRadius:20, padding:'6px 14px' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', display:'inline-block' }}/>
          <span style={{ color:'#1E3A5F', fontSize:12, fontWeight:700, fontFamily:'Poppins,sans-serif' }}>
            {DOW}, {TODAY} — Today's Edition
          </span>
        </div>
        {todayCoins > 0 && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:20, padding:'6px 14px' }}>
            <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700 }}>🪙 +{todayCoins} earned today</span>
          </div>
        )}
      </div>

      {/* Free tier notice */}
      {!isPro && (
        <div style={{ background:'#EFF6FF', borderRadius:14, padding:'10px 16px', marginBottom:14, border:'1px solid #BFDBFE', display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <p style={{ color:'#1E40AF', fontSize:13 }}>
            📖 Free: {readCount}/{LIMIT_FREE} articles with +5 coins today.
            {readCount >= LIMIT_FREE ? ' Upgrade for unlimited.' : ` ${LIMIT_FREE-readCount} more earn coins.`}
          </p>
          {readCount >= LIMIT_FREE && (
            <button style={{ background:'#1E3A5F', border:'none', borderRadius:10, padding:'6px 14px', color:'#D4AF37', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
              Upgrade Pro →
            </button>
          )}
        </div>
      )}

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, marginBottom:18, overflowX:'auto', paddingBottom:4 }}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            style={{ padding:'7px 16px', borderRadius:20, border:'none', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, background:cat===c?'#1E3A5F':'#fff', color:cat===c?'#fff':'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12, boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map(a=>{
          const isRead    = rewarded.includes(a.id)
          const isReading = reading === a.id
          const pct       = isRead ? 100 : isReading ? Math.round((readTimer/a.readTime)*100) : 0

          return (
            <div key={a.id} style={{ background:'#fff', borderRadius:20,
              border:`1.5px solid ${a.important?'rgba(212,175,55,0.3)':'#E2E8F0'}`,
              overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>

              {/* Read progress bar */}
              {(isReading || isRead) && (
                <div style={{ height:3, background:'#F1F5F9' }}>
                  <div style={{ width:`${pct}%`, height:3, background: isRead?'#22C55E':'#D4AF37', transition:'width 1s linear' }}/>
                </div>
              )}

              <div style={{ padding:'14px 16px', cursor:'pointer' }} onClick={()=>openArticle(a.id)}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <span style={{ fontSize:24, flexShrink:0 }}>{a.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:6, alignItems:'center' }}>
                      <span style={{ background:'rgba(30,58,95,0.08)', color:'#1E3A5F', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>{a.cat}</span>
                      {a.important && <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>⭐ Important</span>}
                      {isRead && <span style={{ background:'#DCFCE7', color:'#15803D', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>✅ +5 🪙</span>}
                      {isReading && !isRead && <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>⏳ {a.readTime-readTimer}s to earn coins</span>}
                    </div>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E293B', fontSize:14, lineHeight:1.4, marginBottom:8 }}>{a.title}</p>

                    {expanded===a.id && (
                      <p style={{ color:'#475569', fontSize:13, lineHeight:1.7, marginBottom:10 }}>{a.body}</p>
                    )}

                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {a.tags.map(t=>(
                          <span key={t} style={{ background:'#EDE9FE', color:'#7C3AED', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{t}</span>
                        ))}
                      </div>
                      <button onClick={(e)=>{ e.stopPropagation(); setSaved(p=>{ const n=new Set(p); n.has(a.id)?n.delete(a.id):n.add(a.id); return n }) }}
                        style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:saved.has(a.id)?'#D4AF37':'#CBD5E1' }}>
                        {saved.has(a.id)?'★':'☆'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Daily Quiz Modal */}
      {quizOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ background:'#fff', borderRadius:24, padding:28, maxWidth:440, width:'100%' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:20, marginBottom:8 }}>🎯 Today's Current Affairs Quiz</p>
            <p style={{ color:'#64748B', fontSize:14, marginBottom:20 }}>5 questions from today's news. +15 coins for completing.</p>
            <p style={{ color:'#1E3A5F', fontWeight:600, fontSize:14 }}>Q1. Which country did India sign an FTA with today?</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12, marginBottom:16 }}>
              {['USA','UK','Germany','France'].map((opt,i)=>(
                <button key={i} onClick={async()=>{
                  earn({ source:'daily_quiz', amount:15, description:'Daily Current Affairs Quiz ✅' })
                  setQuiz(false)
                }} style={{ padding:'11px 16px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#F8FAFC', textAlign:'left', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontSize:14, color:'#1E293B' }}>
                  {['A','B','C','D'][i]}. {opt}
                </button>
              ))}
            </div>
            <button onClick={()=>setQuiz(false)} style={{ background:'none', border:'none', color:'#94A3B8', cursor:'pointer', fontSize:13 }}>Cancel</button>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
EOF
echo "CurrentAffairs done"
# ══════════════════════════════════════════════════════════════════
# 5. LEADERBOARD — sugarcoated streak + push psychology
# ══════════════════════════════════════════════════════════════════
cat > src/pages/leaderboard/Leaderboard.jsx << 'EOF'
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

// ── Streak labels — creates discipline + aspiration ───────────────
function getStreakLabel(days) {
  if (!days || days === 0) return { label:'Just Started 🌱',          color:'#94A3B8' }
  if (days < 3)            return { label:'Warming Up 🔥',            color:'#F97316' }
  if (days < 7)            return { label:'Getting Serious ⚡',       color:'#EAB308' }
  if (days < 14)           return { label:'One Week Warrior ⚔️',      color:'#22C55E' }
  if (days < 21)           return { label:'On Fire! Cannot Stop 🔥',  color:'#F97316' }
  if (days < 30)           return { label:'3-Week Machine 🚀',        color:'#8B5CF6' }
  if (days < 60)           return { label:'30-Day Legend 🦁',         color:'#D4AF37' }
  if (days < 100)          return { label:'Baahuveer Mode 💥',        color:'#DC2626' }
  return                          { label:'The Absolute 🏆 Elite',    color:'#D4AF37' }
}

// ── Push psychology messages ──────────────────────────────────────
function getPushMsg(rank, prevRank, streak, topPct) {
  const improved = prevRank && rank < prevRank
  const msgs = []
  if (improved)           msgs.push(`📈 You climbed ${prevRank-rank} spots!`)
  if (streak >= 7)        msgs.push(`🔥 Your streak is in the top ${topPct}% of students`)
  if (rank <= 100)        msgs.push(`🌟 You are in the Top 100 nationally!`)
  if (rank > 1000)        msgs.push(`⚡ ${rank-1000} more tests to break Top 1000`)
  return msgs[0] || `💪 Keep going — rank #${rank} is within reach`
}

const ROWS = [
  { rank:1,    name:'Priya Sharma',   state:'Kerala',    exam:'NEET UG',  score:'97.4%', streak:42,  level:9,  prev:2  },
  { rank:2,    name:'Rahul Kumar',    state:'Delhi',     exam:'UPSC CSE', score:'94.8%', streak:88,  level:8,  prev:1  },
  { rank:3,    name:'Aisha Mohammed', state:'Gujarat',   exam:'IBPS PO',  score:'93.1%', streak:31,  level:7,  prev:3  },
  { rank:4,    name:'Vikram Singh',   state:'Rajasthan', exam:'SSC CGL',  score:'92.6%', streak:21,  level:7,  prev:6  },
  { rank:5,    name:'Deepa Nair',     state:'TN',        exam:'NEET UG',  score:'91.9%', streak:14,  level:6,  prev:4  },
  { rank:6,    name:'Arjun Patel',    state:'MH',        exam:'JEE Adv',  score:'91.2%', streak:9,   level:6,  prev:5  },
  { rank:7,    name:'Meera K.',       state:'KA',        exam:'GATE',     score:'90.7%', streak:60,  level:8,  prev:7  },
  { rank:8,    name:'Sanjay Y.',      state:'UP',        exam:'UPSC CSE', score:'90.1%', streak:5,   level:5,  prev:15 },
  { rank:9,    name:'Fatima B.',      state:'Hyderabad', exam:'IBPS PO',  score:'89.8%', streak:19,  level:6,  prev:9  },
  { rank:10,   name:'Rohit S.',       state:'MP',        exam:'SSC CGL',  score:'89.5%', streak:3,   level:5,  prev:22 },
  { rank:1243, name:'Arjun Kumar',    state:'TN',        exam:'SSC CGL',  score:'78.0%', streak:12,  level:4,  prev:1385, isMe:true },
]

const WEEKLY_SUMMARY = {
  rank:       1243,
  improved:   142,
  testsTaken: 5,
  outranked:  847,
  streakDays: 12,
  topPct:     8,
}

export default function Leaderboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('National')

  const myRow = ROWS.find(r=>r.isMe)

  return (
    <AppLayout>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28 }}>🏆 Leaderboard</h1>
        <p style={{ color:'#94A3B8', fontSize:14, marginTop:2 }}>Real All-India rankings · Updated after every test</p>
      </div>

      {/* Weekly summary card — push psychology */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:22, padding:20, marginBottom:16, border:'1.5px solid rgba(212,175,55,0.3)' }}>
        <p style={{ color:'#D4AF37', fontSize:11, fontWeight:700, letterSpacing:'2px', marginBottom:12 }}>THIS WEEK — YOUR IMPACT</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10 }}>
          {[
            ['📈', `+${WEEKLY_SUMMARY.improved}`,   'Rank improved'],
            ['🏅', `${WEEKLY_SUMMARY.testsTaken}`,   'Tests taken'],
            ['👥', `${WEEKLY_SUMMARY.outranked.toLocaleString()}`, 'Students outranked'],
            ['🔥', `${WEEKLY_SUMMARY.streakDays}d`,  'Streak'],
            ['🌟', `Top ${WEEKLY_SUMMARY.topPct}%`,  'Nationally'],
          ].map(([e,v,l])=>(
            <div key={l} style={{ background:'rgba(255,255,255,0.06)', borderRadius:12, padding:'10px 8px', textAlign:'center' }}>
              <p style={{ fontSize:20 }}>{e}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:16 }}>{v}</p>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10, marginTop:2 }}>{l}</p>
            </div>
          ))}
        </div>
        {/* Push message */}
        <div style={{ marginTop:14, background:'rgba(212,175,55,0.1)', borderRadius:12, padding:'10px 14px', border:'1px solid rgba(212,175,55,0.2)' }}>
          <p style={{ color:'#D4AF37', fontSize:13, fontWeight:600 }}>
            {getPushMsg(WEEKLY_SUMMARY.rank, WEEKLY_SUMMARY.rank + WEEKLY_SUMMARY.improved, WEEKLY_SUMMARY.streakDays, WEEKLY_SUMMARY.topPct)}
          </p>
        </div>
      </div>

      {/* My rank card */}
      {myRow && (
        <div style={{ background:'rgba(212,175,55,0.08)', border:'1.5px solid rgba(212,175,55,0.4)', borderRadius:20, padding:'14px 18px', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#D4AF37,#E8C44A)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:17, color:'#1E3A5F', flexShrink:0 }}>
              {user?.initials || 'AK'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:15 }}>{user?.name || 'You'}</p>
                <span style={{ background:'#D4AF37', color:'#1E3A5F', fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>← YOU</span>
              </div>
              <p style={{ color:'#64748B', fontSize:12, marginTop:2 }}>
                {getStreakLabel(myRow.streak).label}
              </p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:22 }}>#{myRow.rank.toLocaleString()}</p>
              <p style={{ color:'#22C55E', fontSize:12, fontWeight:600 }}>↑{myRow.prev - myRow.rank} this week</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16, overflowX:'auto', paddingBottom:4 }}>
        {['National','State','Hall','My Exams'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{ padding:'9px 20px', borderRadius:20, border:'none', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, background:tab===t?'#1E3A5F':'#fff', color:tab===t?'#fff':'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13, boxShadow:tab===t?'0 4px 14px rgba(30,58,95,0.2)':'0 2px 8px rgba(0,0,0,0.04)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ background:'#1E3A5F', padding:'12px 16px', display:'grid', gridTemplateColumns:'48px 1fr 80px 72px', gap:8 }}>
          {['Rank','Student + Streak','Exam','Score'].map(h=>(
            <span key={h} style={{ color:'#D4AF37', fontSize:11, fontWeight:700 }}>{h}</span>
          ))}
        </div>
        {ROWS.map((r,i)=>{
          const sl = getStreakLabel(r.streak)
          const improved = r.prev > r.rank
          return (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'48px 1fr 80px 72px', gap:8, padding:'13px 16px', borderBottom:'1px solid #F8FAFC', alignItems:'center', background:r.isMe?'rgba(212,175,55,0.06)':'i%2===0?#FAFBFC:#fff', borderLeft:r.isMe?'3px solid #D4AF37':'3px solid transparent' }}>
              {/* Rank */}
              <div>
                <span style={{ fontWeight:900, color:i===0?'#D4AF37':i===1?'#9CA3AF':i===2?'#CD7F32':'#64748B', fontSize:i<3?22:14 }}>
                  {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${r.rank.toLocaleString()}`}
                </span>
                {improved && <p style={{ color:'#22C55E', fontSize:9, fontWeight:700, marginTop:2 }}>↑{r.prev-r.rank}</p>}
              </div>
              {/* Student */}
              <div style={{ minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E293B', fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</span>
                  {r.isMe && <span style={{ background:'#D4AF37', color:'#1E3A5F', fontSize:9, fontWeight:800, padding:'1px 6px', borderRadius:20, flexShrink:0 }}>YOU</span>}
                </div>
                {/* Streak label — sugarcoated */}
                <span style={{ fontSize:10, fontWeight:700, color:sl.color }}>
                  {sl.label} · {r.state}
                </span>
              </div>
              {/* Exam */}
              <span style={{ background:'#F1F5F9', color:'#64748B', fontSize:10, fontWeight:600, padding:'3px 6px', borderRadius:20, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block' }}>{r.exam}</span>
              {/* Score */}
              <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:14 }}>{r.score}</span>
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}
EOF
echo "Leaderboard done"
# ══════════════════════════════════════════════════════════════════
# 6. COMMUNITY HALL — success stories + votes + pins
# ══════════════════════════════════════════════════════════════════
cat > src/pages/community/CommunityHall.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'

const TAGS = ['All','#SSC','#UPSC','#NEET','#JEE','#IBPS','#FocusMode','#StreakGoal','#Comeback','#FirstGen','#FromVillage']

const STORIES = [
  {
    id:'s1', pinned:true, verified:true,
    user:'Priya Sharma', initials:'PS', state:'Kerala', level:9, levelEmoji:'🌟',
    exam:'NEET UG', tags:['#NEET','#FocusMode','#Comeback'],
    rankBefore:8432, rankAfter:1243, daysActive:30,
    testsCompleted:67, avgScore:92, streak:42,
    story:"I was stuck at Rank #8,432 for 3 months. I started using Focus Mode for 2 hours every morning (Biology + Chemistry alternating days) and took 3 mock tests per week. The coin deduction when I failed actually terrified me into being serious — I nearly went negative twice! After 30 days: Rank #1,243. The 7-layer explanation in Tamil made Chemistry crystal clear for the first time in my life. Thank you TryIT 🙏",
    votes:847, comments:43, coinsAwarded:100,
    postedAt:'2 days ago',
  },
  {
    id:'s2', pinned:true, verified:true,
    user:'Mohammed Arif', initials:'MA', state:'UP', level:8, levelEmoji:'⚡',
    exam:'UPSC CSE', tags:['#UPSC','#StreakGoal','#FirstGen'],
    rankBefore:12840, rankAfter:2341, daysActive:60,
    testsCompleted:94, avgScore:78, streak:60,
    story:"First person in my family to attempt UPSC. No coaching centre, no money for books. TryIT Pro via the First-Generation Learner discount saved me. 60-day streak. The Guru Hub mentors answered every single Polity doubt I had — in Hindi. When I posted my rank improvement, my mother cried. This platform changed my family's future.",
    votes:1204, comments:89, coinsAwarded:100,
    postedAt:'5 days ago',
  },
  {
    id:'s3', pinned:false, verified:true,
    user:'Deepika R.', initials:'DR', state:'Manipur', level:6, levelEmoji:'🦁',
    exam:'CTET', tags:['#CTET','#FromVillage','#FocusMode'],
    rankBefore:5621, rankAfter:987, daysActive:45,
    testsCompleted:52, avgScore:84, streak:31,
    story:"I live in a village in Manipur where there are no coaching centres. TryIT is available in Meitei language — I cried when I saw this. Focus Mode + Current Affairs daily for 45 days brought me to Rank #987. I start my 3rd mock test today. Dreams are possible from any corner of India.",
    votes:624, comments:31, coinsAwarded:100,
    postedAt:'1 week ago',
  },
  {
    id:'s4', pinned:false, verified:false,
    user:'Karan T.', initials:'KT', state:'Rajasthan', level:5, levelEmoji:'💪',
    exam:'SSC CGL', tags:['#SSC','#Comeback'],
    rankBefore:9200, rankAfter:3400, daysActive:25,
    testsCompleted:38, avgScore:71, streak:21,
    story:"Failed SSC CGL twice. Almost gave up. My friend showed me TryIT. The coin deduction system scared me — I was at -180 coins once. That fear made me study 4 hours daily. 25 days, 38 tests. Not at top yet but moving. For anyone who failed before: the platform won't let you be lazy.",
    votes:289, comments:18, coinsAwarded:30,
    postedAt:'2 weeks ago',
  },
]

export default function CommunityHall() {
  const navigate       = useNavigate()
  const { user }       = useAuth()
  const { earn }       = useCoins()
  const [tag,       setTag]     = useState('All')
  const [stories,   setStories] = useState(STORIES)
  const [voted,     setVoted]   = useState(new Set())
  const [posting,   setPosting] = useState(false)
  const [form,      setForm]    = useState({ before:'', after:'', days:'', story:'', exam:'', tags:[] })
  const [submitted, setSubmit]  = useState(false)

  const filtered = tag==='All' ? stories : stories.filter(s=>s.tags.includes(tag))
  const pinned   = filtered.filter(s=>s.pinned)
  const regular  = filtered.filter(s=>!s.pinned)

  const vote = (id) => {
    if (voted.has(id)) return
    setVoted(v=>new Set([...v,id]))
    setStories(s=>s.map(st=>st.id===id?{...st,votes:st.votes+1}:st))
  }

  const submit = async () => {
    if (!form.story || !form.before || !form.after) return
    const newStory = {
      id: `s-${Date.now()}`, pinned:false, verified:false,
      user: user?.name || 'Anonymous', initials: user?.initials || 'U',
      state: user?.state || 'India', level: user?.level || 1, levelEmoji: user?.levelEmoji || '🔥',
      exam: form.exam || 'SSC CGL', tags: form.tags,
      rankBefore: parseInt(form.before), rankAfter: parseInt(form.after), daysActive: parseInt(form.days)||30,
      testsCompleted: 0, avgScore: 0, streak: user?.streak || 0,
      story: form.story, votes:0, comments:0, coinsAwarded:30,
      postedAt:'Just now',
    }
    setStories(s=>[newStory,...s])
    await earn({ source:'community', amount:30, description:'Posted a success story 🏆' })
    setSubmit(true)
    setTimeout(()=>{ setPosting(false); setSubmit(false); setForm({ before:'', after:'', days:'', story:'', exam:'', tags:[] }) }, 2500)
  }

  return (
    <AppLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28 }}>🏛️ Community Hall</h1>
          <p style={{ color:'#94A3B8', fontSize:14, marginTop:2 }}>Real students. Real ranks. Real transformations.</p>
        </div>
        <button onClick={()=>setPosting(true)}
          style={{ background:'linear-gradient(135deg,#D4AF37,#E8C44A)', border:'none', borderRadius:14, padding:'11px 22px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>
          ✍️ Share Your Story (+30 🪙)
        </button>
      </div>

      {/* Tags */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {TAGS.map(t=>(
          <button key={t} onClick={()=>setTag(t)}
            style={{ padding:'7px 16px', borderRadius:20, border:'none', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, background:tag===t?'#1E3A5F':'#fff', color:tag===t?'#fff':'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12, boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Pinned stories */}
      {pinned.length>0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ fontSize:16 }}>📌</span>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:15 }}>Pinned by TryIT Team</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {pinned.map(s=><StoryCard key={s.id} story={s} voted={voted} onVote={vote}/>)}
          </div>
        </div>
      )}

      {/* Regular stories */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {regular.map(s=><StoryCard key={s.id} story={s} voted={voted} onVote={vote}/>)}
      </div>

      {/* Post modal */}
      {posting && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:500, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px 16px', overflowY:'auto' }}>
          <div style={{ background:'#fff', borderRadius:24, padding:28, maxWidth:520, width:'100%', marginTop:20 }}>
            {submitted ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <p style={{ fontSize:56 }}>🎉</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:22, marginTop:12 }}>Story Submitted!</p>
                <p style={{ color:'#64748B', fontSize:14, marginTop:8 }}>+30 coins added to your wallet. Our team will review and may pin your story!</p>
              </div>
            ) : (
              <>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:20, marginBottom:6 }}>✍️ Share Your Success</p>
                <p style={{ color:'#64748B', fontSize:13, marginBottom:20 }}>Inspire thousands of students across India. Verified stories earn +100 bonus coins.</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
                  {[['Rank Before','before','e.g. 8432'],['Rank After','after','e.g. 1243'],['Days Active','days','e.g. 30']].map(([l,k,ph])=>(
                    <div key={k}>
                      <label style={{ display:'block', color:'#1E3A5F', fontSize:12, fontWeight:600, marginBottom:5 }}>{l}</label>
                      <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph} type="number"
                        style={{ width:'100%', padding:'10px 12px', borderRadius:12, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box' }}
                        onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:'block', color:'#1E3A5F', fontSize:12, fontWeight:600, marginBottom:5 }}>Your Story *</label>
                  <textarea value={form.story} onChange={e=>setForm(f=>({...f,story:e.target.value}))}
                    placeholder="Tell us your journey — what changed, what helped, what you learned..."
                    rows={5}
                    style={{ width:'100%', padding:'12px 14px', borderRadius:14, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box', resize:'vertical', fontFamily:'Inter,sans-serif' }}
                    onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                </div>
                <div style={{ display:'flex', gap:10, marginTop:4 }}>
                  <button onClick={submit} disabled={!form.story||!form.before||!form.after}
                    style={{ flex:2, padding:14, borderRadius:14, border:'none', background:form.story&&form.before&&form.after?'linear-gradient(135deg,#D4AF37,#E8C44A)':'rgba(212,175,55,0.3)', color:'#1E3A5F', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, cursor:'pointer' }}>
                    Share Story (+30 🪙)
                  </button>
                  <button onClick={()=>setPosting(false)}
                    style={{ flex:1, padding:14, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  )
}

function StoryCard({ story:s, voted, onVote }) {
  const [expanded, setExpanded] = useState(false)
  const rankDiff = s.rankBefore - s.rankAfter

  return (
    <div style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:`1.5px solid ${s.pinned?'rgba(212,175,55,0.3)':'#E2E8F0'}`, boxShadow: s.pinned?'0 6px 24px rgba(212,175,55,0.1)':'0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Pinned header */}
      {s.pinned && (
        <div style={{ background:'linear-gradient(135deg,#D4AF37,#E8C44A)', padding:'5px 16px', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:12 }}>📌</span>
          <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:11, letterSpacing:'1px' }}>
            FEATURED BY TRYIT TEAM
          </span>
          {s.verified && <span style={{ marginLeft:'auto', background:'rgba(30,58,95,0.15)', color:'#1E3A5F', fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>✅ VERIFIED RESULT</span>}
        </div>
      )}

      <div style={{ padding:'18px 18px 14px' }}>
        {/* User + rank change */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
          <div style={{ width:46, height:46, borderRadius:'50%', background:'linear-gradient(135deg,#1E3A5F,#0F2140)', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4AF37', fontWeight:800, fontSize:16, flexShrink:0 }}>{s.initials}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{s.user}</p>
              <span style={{ background:'rgba(30,58,95,0.08)', color:'#1E3A5F', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{s.exam}</span>
              <span style={{ background:'#EDE9FE', color:'#7C3AED', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{s.levelEmoji} {s.state}</span>
              {!s.pinned && s.verified && <span style={{ background:'#DCFCE7', color:'#15803D', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>✅ Verified</span>}
            </div>
            <p style={{ color:'#94A3B8', fontSize:11, marginTop:3 }}>{s.daysActive} days active · {s.postedAt}</p>
          </div>
        </div>

        {/* Rank transformation — THE HERO NUMBER */}
        <div style={{ background:'linear-gradient(135deg,rgba(30,58,95,0.06),rgba(212,175,55,0.04))', borderRadius:16, padding:14, marginBottom:14, border:'1px solid rgba(212,175,55,0.15)', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <div style={{ textAlign:'center', flex:1 }}>
            <p style={{ color:'#94A3B8', fontSize:11 }}>Before</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#EF4444', fontSize:26 }}>#{s.rankBefore.toLocaleString()}</p>
          </div>
          <div style={{ textAlign:'center', flexShrink:0 }}>
            <p style={{ color:'#D4AF37', fontSize:28, fontWeight:900 }}>→</p>
            <p style={{ color:'#22C55E', fontSize:11, fontWeight:700 }}>+{rankDiff.toLocaleString()} ranks</p>
          </div>
          <div style={{ textAlign:'center', flex:1 }}>
            <p style={{ color:'#94A3B8', fontSize:11 }}>After {s.daysActive} days</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#22C55E', fontSize:26 }}>#{s.rankAfter.toLocaleString()}</p>
          </div>
        </div>

        {/* Story text */}
        <p style={{ color:'#475569', fontSize:14, lineHeight:1.7, marginBottom:12 }}>
          {expanded ? s.story : s.story.slice(0,180)+'...'}
        </p>
        {s.story.length>180 && (
          <button onClick={()=>setExpanded(!expanded)}
            style={{ background:'none', border:'none', color:'#D4AF37', cursor:'pointer', fontSize:13, fontWeight:600, padding:0, marginBottom:12 }}>
            {expanded?'Show less ▲':'Read full story ▼'}
          </button>
        )}

        {/* Tags */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
          {s.tags.map(t=>(
            <span key={t} style={{ background:'#F1F5F9', color:'#64748B', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{t}</span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <button onClick={()=>onVote(s.id)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:20, border:`1.5px solid ${voted.has(s.id)?'#D4AF37':'#E2E8F0'}`, background:voted.has(s.id)?'rgba(212,175,55,0.1)':'#F8FAFC', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, color:voted.has(s.id)?'#D4AF37':'#64748B' }}>
            ▲ {s.votes}
          </button>
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:20, border:'1.5px solid #E2E8F0', background:'#F8FAFC', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13, color:'#64748B' }}>
            💬 {s.comments}
          </button>
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:20, border:'none', background:'none', cursor:'pointer', fontSize:13, color:'#94A3B8' }}>
            📤 Share
          </button>
          {s.verified && (
            <span style={{ marginLeft:'auto', background:'#DCFCE7', color:'#15803D', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
              +{s.coinsAwarded} 🪙 awarded
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
EOF
echo "CommunityHall done"
# ══════════════════════════════════════════════════════════════════
# 7. EXAM NOTIFICATIONS — realtime banner + browser push
# ══════════════════════════════════════════════════════════════════
cat > src/components/ExamNotificationBanner.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ENROLLED_EXAMS = [
  { id:'ssc-cgl',  name:'SSC CGL 2026 Tier 1', date:'2026-12-10', emoji:'📋' },
  { id:'rrb-ntpc', name:'RRB NTPC Phase 2',    date:'2026-07-15', emoji:'🚂' },
]

function getDaysLeft(dateStr) {
  const diff = new Date(dateStr) - new Date()
  return Math.max(0, Math.ceil(diff / 86400000))
}

function getUrgency(days) {
  if (days === 0)  return { color:'#EF4444', bg:'#FEF2F2', border:'#FECACA', label:'TODAY!', pulse:true }
  if (days <= 1)   return { color:'#EF4444', bg:'#FEF2F2', border:'#FECACA', label:'TOMORROW', pulse:true }
  if (days <= 7)   return { color:'#F97316', bg:'#FFF7ED', border:'#FED7AA', label:`${days} DAYS`, pulse:true }
  if (days <= 30)  return { color:'#D4AF37', bg:'#FEF3C7', border:'#FDE68A', label:`${days} days`, pulse:false }
  return                   { color:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0', label:`${days} days`, pulse:false }
}

export default function ExamNotificationBanner() {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(new Set())
  const [pushEnabled, setPush]     = useState(false)

  const urgent = ENROLLED_EXAMS
    .map(e => ({ ...e, daysLeft: getDaysLeft(e.date) }))
    .filter(e => e.daysLeft <= 30 && !dismissed.has(e.id))
    .sort((a,b) => a.daysLeft - b.daysLeft)

  // Request browser notification permission
  const enablePush = async () => {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setPush(true)
      // Schedule daily reminders via service worker (simplified)
      new Notification('TryIT Exam Reminder', {
        body: urgent[0] ? `${urgent[0].name} is in ${urgent[0].daysLeft} days!` : 'Keep preparing!',
        icon: '/tryit-logo.webp',
        badge: '/tryit-logo.webp',
      })
    }
  }

  if (!urgent.length) return null

  return (
    <div style={{ marginBottom:16 }}>
      {urgent.slice(0,2).map(exam => {
        const u = getUrgency(exam.daysLeft)
        return (
          <div key={exam.id} style={{ background:u.bg, border:`1.5px solid ${u.border}`, borderRadius:18, padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
            {/* Pulsing dot for urgent */}
            <div style={{ position:'relative', flexShrink:0 }}>
              <span style={{ fontSize:24 }}>{exam.emoji}</span>
              {u.pulse && (
                <span style={{ position:'absolute', top:-2, right:-2, width:10, height:10, borderRadius:'50%', background:u.color, display:'block', animation:'examPulse 1.2s ease-in-out infinite' }}/>
              )}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E293B', fontSize:14 }}>
                {exam.name}
              </p>
              <p style={{ fontSize:12, color:'#64748B', marginTop:2 }}>
                {exam.daysLeft === 0 ? '🚨 Exam is TODAY!' : exam.daysLeft === 1 ? '⚠️ Exam is TOMORROW!' : `📅 ${new Date(exam.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}`}
              </p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              <span style={{ background:u.color, color:'#fff', fontSize:11, fontWeight:800, padding:'4px 12px', borderRadius:20, letterSpacing:'0.5px', animation:u.pulse?'examPulse 1.2s ease-in-out infinite':'' }}>
                {u.label}
              </span>
              <button onClick={()=>navigate('/test-engine')}
                style={{ background:u.color, border:'none', borderRadius:12, padding:'7px 14px', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
                Practice Now →
              </button>
              <button onClick={()=>setDismissed(d=>new Set([...d,exam.id]))}
                style={{ background:'none', border:'none', color:'rgba(0,0,0,0.3)', cursor:'pointer', fontSize:18, padding:'0 4px' }}>×</button>
            </div>
          </div>
        )
      })}

      {/* Enable push notifications prompt */}
      {!pushEnabled && 'Notification' in window && Notification.permission === 'default' && (
        <div style={{ background:'rgba(30,58,95,0.06)', border:'1px solid rgba(30,58,95,0.15)', borderRadius:14, padding:'10px 16px', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span style={{ fontSize:18 }}>🔔</span>
          <p style={{ color:'#1E3A5F', fontSize:12, flex:1 }}>
            Get daily exam reminders so you never miss a deadline
          </p>
          <button onClick={enablePush}
            style={{ background:'#1E3A5F', border:'none', borderRadius:10, padding:'6px 14px', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:12, cursor:'pointer', flexShrink:0 }}>
            Enable Alerts
          </button>
        </div>
      )}

      <style>{`
        @keyframes examPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.6; transform:scale(1.15); }
        }
      `}</style>
    </div>
  )
}
EOF

# ── REMOVE AGRARIAN DISTRESS from 3 public files ─────────────────
python3 << 'PYEOF'
import re, os

FILES = [
    'src/components/landing/EquityPricingSection.jsx',
    'src/pages/equity/EquityTierSelector.jsx',
    'src/lib/equityTiers.js',
]

# Pattern: remove AGRARIAN_DISTRESS tier block and its UI card
REMOVE_IDS = ['AGRARIAN_DISTRESS', 'agrarian_distress', 'agrarian']

for path in FILES:
    if not os.path.exists(path):
        print(f'[skip] {path} not found')
        continue
    with open(path,'r') as f:
        content = f.read()

    if 'grarian' not in content:
        print(f'[skip] {path} — no agrarian content')
        continue

    # Remove from equityTiers.js — remove the full object block
    if 'equityTiers.js' in path:
        # Remove the AGRARIAN_DISTRESS key and its value block
        content = re.sub(
            r',?\s*AGRARIAN_DISTRESS:\s*\{[^}]*(?:\{[^}]*\}[^}]*)?\}',
            '', content, flags=re.DOTALL
        )

    # Remove from EquityPricingSection — remove the tier row
    if 'EquityPricingSection' in path:
        content = re.sub(
            r'\{[^}]*agrarian[^}]*\}[,\s]*',
            '', content, flags=re.DOTALL | re.IGNORECASE
        )
        # Also remove the line-item row with emoji 🌾
        content = re.sub(
            r'\{[^}]*Agrarian[^}]*\}[,\s]*',
            '', content, flags=re.DOTALL
        )

    # Remove from EquityTierSelector — remove card
    if 'EquityTierSelector' in path:
        content = re.sub(
            r'\{[^}]*agrarian[^}]*\}[,\s]*',
            '', content, flags=re.DOTALL | re.IGNORECASE
        )

    with open(path,'w') as f:
        f.write(content)
    print(f'[done] Agrarian Distress removed from {path}')
PYEOF
echo "Agrarian removed"

# ── WIRE COINS to Career Compass + Onboarding ────────────────────
python3 << 'PYEOF'
import os, re

# Wire +20 coins to Career Compass completion
cc_path = 'src/pages/career-compass/CareerCompass.jsx'
if os.path.exists(cc_path):
    with open(cc_path,'r') as f: c = f.read()
    if 'rewardCareer' not in c and 'earnCoins' not in c:
        c = "import { earnCoins } from '../../lib/coinVault'\nimport { useAuth } from '../../context/AuthContext'\n" + c
        c = c.replace(
            "const save = () => {",
            """const { user } = useAuth()
  const save = () => {
    earnCoins({ source:'career_compass', amount:20, description:'Career Compass completed! 🧭', userId:user?.id })"""
        )
        with open(cc_path,'w') as f: f.write(c)
        print('Career Compass coins wired')
    else:
        print('Career Compass already wired')

# Wire +50 onboarding welcome bonus
ob_path = 'src/pages/Onboarding.jsx'
if os.path.exists(ob_path):
    with open(ob_path,'r') as f: c = f.read()
    if 'rewardOnboarding' not in c and 'onboarding_complete' not in c:
        c = "import { earnCoins } from '../lib/coinVault'\n" + c
        # Add coin award on finish
        c = c.replace(
            "localStorage.setItem('onboarding_done', '1')",
            "localStorage.setItem('onboarding_done', '1')\n    earnCoins({ source:'onboarding_complete', amount:50, description:'Welcome to TryIT! 🎉 +50 coins' })"
        )
        with open(ob_path,'w') as f: f.write(c)
        print('Onboarding welcome bonus wired')
    else:
        print('Onboarding already wired')
PYEOF

# ── ADD COMMUNITY HALL TO ROUTES ─────────────────────────────────
python3 << 'PYEOF'
with open('src/App.jsx','r') as f: c = f.read()
if 'CommunityHall' not in c:
    c = c.replace(
        'const LiveImpactTracker',
        "const CommunityHall = lazy(() => import('./pages/community/CommunityHall'))\nconst LiveImpactTracker"
    )
    c = c.replace(
        '<Route path="/impact"',
        '<Route path="/community" element={<CommunityHall />} />\n                <Route path="/impact"'
    )
    with open('src/App.jsx','w') as f: f.write(c)
    print('CommunityHall route added')
else:
    print('CommunityHall already in App.jsx')
PYEOF

# ── ADD BANNER TO DASHBOARD ───────────────────────────────────────
python3 << 'PYEOF'
import os
path = 'src/pages/Dashboard.jsx'
if os.path.exists(path):
    with open(path,'r') as f: c = f.read()
    if 'ExamNotificationBanner' not in c:
        c = "import ExamNotificationBanner from '../components/ExamNotificationBanner'\n" + c
        # Insert banner after the opening of the main content
        c = c.replace(
            'return (\n    <AppLayout>',
            'return (\n    <AppLayout>\n      <ExamNotificationBanner/>'
        )
        with open(path,'w') as f: f.write(c)
        print('ExamNotificationBanner added to Dashboard')
    else:
        print('Banner already in Dashboard')
else:
    print('[skip] Dashboard.jsx not found')
PYEOF

# ── ADD COMMUNITY HALL LINK TO SIDEBAR ───────────────────────────
python3 << 'PYEOF'
import os
path = 'src/components/layout/Sidebar.jsx'
if os.path.exists(path):
    with open(path,'r') as f: c = f.read()
    if '/community' not in c:
        c = c.replace(
            "{ path:'/impact',",
            "{ path:'/community', icon:Users, label:'Community Hall', badge:'New' },\n  { path:'/impact',"
        )
        with open(path,'w') as f: f.write(c)
        print('Community Hall added to Sidebar')
    else:
        print('Already in Sidebar')
PYEOF

echo "All wiring done"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ Batch 1 + 2 installed!                               ║"
echo "║                                                          ║"
echo "║  BATCH 1 — Discipline + Monetisation:                   ║"
echo "║  • coinVault v2 — deduct on fail, earn on pass          ║"
echo "║  • Coin packs ₹5/₹19/₹49/₹99 via Razorpay             ║"
echo "║  • ResultScreen — shows earn/deduct + buy coins button   ║"
echo "║  • FocusMode — wired to CoinContext                     ║"
echo "║  • Wallet — purchase packs + deduction rules shown      ║"
echo "║  • Agrarian Distress removed from 3 public pages        ║"
echo "║  • Career Compass +20 coins wired                       ║"
echo "║  • Onboarding +50 welcome bonus wired                   ║"
echo "║                                                          ║"
echo "║  BATCH 2 — Engagement + Retention:                      ║"
echo "║  • Current Affairs — read timer + auto +5 coins         ║"
echo "║  • Free users: 3 articles with coins, unlimited reading  ║"
echo "║  • Leaderboard — streak labels + weekly push psychology  ║"
echo "║  • Community Hall — /community (success stories)        ║"
echo "║    Votes · Pins · Verified badge · +30/+100 coins        ║"
echo "║  • Exam notifications banner on Dashboard               ║"
echo "║  • Browser push permission prompt                       ║"
echo "║  • Community Hall in Sidebar nav                        ║"
echo "║                                                          ║"
echo "║  Run: npm run dev                                        ║"
echo "╚══════════════════════════════════════════════════════════╝"
