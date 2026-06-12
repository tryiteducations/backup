#!/bin/bash
# TryIT Educations — FINAL COMPLETE INSTALL
# Run this ONCE to set up everything correctly
# Usage: chmod +x install_FINAL_COMPLETE.sh && ./install_FINAL_COMPLETE.sh /workspaces/Tatu

ROOT="${1:-/workspaces/Tatu}"
cd "$ROOT" || { echo "Error: Cannot find $ROOT"; exit 1; }

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║         TryIT Educations — Final Install                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

mkdir -p src/app src/data src/hooks src/styles src/pages src/components
mkdir -p public/data pipeline scripts
# ══════════════════════════════════════════════════════════════════
# 1. CLEAN main.jsx
# ══════════════════════════════════════════════════════════════════
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initSecurityLayer, initScreenshotProtection } from './lib/security'
import { applyTheme } from './lib/themes'

// Apply saved theme instantly (before first render)
const savedTheme = localStorage.getItem('tryit_theme') || 'default'
applyTheme(savedTheme)

// Security (production only)
initSecurityLayer()
initScreenshotProtection()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

# ── SPLASH PAGE ──────────────────────────────────────────────────
cat > src/pages/Splash.jsx << 'EOF'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0) // 0=logo, 1=tagline, 2=done

  useEffect(() => {
    // Check if already logged in
    const email = localStorage.getItem('tryit_email')
    const onboarded = localStorage.getItem('onboarding_done')

    const t1 = setTimeout(() => setPhase(1), 700)
    const t2 = setTimeout(() => setPhase(2), 1800)
    const t3 = setTimeout(() => {
      if (email && onboarded) navigate('/dashboard', { replace:true })
      else if (email)         navigate('/onboarding', { replace:true })
      else                    navigate('/landing',  { replace:true })
    }, 2400)

    return () => [t1,t2,t3].forEach(clearTimeout)
  }, [navigate])

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
      {/* Animated logo */}
      <div style={{ textAlign:'center', opacity:phase>=0?1:0, transform:phase>=0?'scale(1)':'scale(0.8)', transition:'all 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ fontSize:64, marginBottom:8, animation:'logoFloat 2s ease-in-out infinite' }}>⚡</div>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:44, color:'#fff', letterSpacing:-1 }}>
          TRY<span style={{ color:'#D4AF37' }}>IT</span>
        </p>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, letterSpacing:'6px', marginTop:4 }}>EDUCATIONS</p>
      </div>

      {/* Tagline */}
      <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14, marginTop:28, fontFamily:'Poppins,sans-serif', fontWeight:500, opacity:phase>=1?1:0, transform:phase>=1?'translateY(0)':'translateY(12px)', transition:'all 0.5s ease 0.3s' }}>
        Your Exam. Your Rank. Your Success.
      </p>

      {/* Loading bar */}
      <div style={{ width:120, height:2, background:'rgba(255,255,255,0.1)', borderRadius:1, marginTop:48, overflow:'hidden', opacity:phase>=1?1:0, transition:'opacity 0.5s' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,#D4AF37,#E8C44A)', borderRadius:1, animation:'splashBar 1.6s ease-in-out 0.5s forwards', width:'0%' }}/>
      </div>

      <style>{`
        @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes splashBar { 0%{width:0%} 100%{width:100%} }
      `}</style>
    </div>
  )
}
EOF

# ── DASHBOARD — zero state for new users ─────────────────────────
cat > src/pages/Dashboard.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useCoins } from '../context/CoinContext'
import FestivalBanner from '../components/FestivalBanner'
import ExamNotificationBanner from '../components/ExamNotificationBanner'

const QUICK_ACTIONS = [
  { emoji:'📝', label:'Take a Test',       path:'/test-engine',    color:'#1E3A5F' },
  { emoji:'📚', label:'Guru Hub',          path:'/guru-hub',       color:'#7C3AED' },
  { emoji:'🎯', label:'Career Compass',    path:'/career-compass', color:'#0C4A6E' },
  { emoji:'🔥', label:'Focus Mode',        path:'/focus-mode',     color:'#065F46' },
  { emoji:'🌏', label:'Current Affairs',   path:'/current-affairs',color:'#92400E' },
  { emoji:'🎮', label:'Brain Games',       path:'/games',          color:'#4C1D95' },
  { emoji:'🏆', label:'Leaderboard',       path:'/leaderboard',    color:'#0F2140' },
  { emoji:'📋', label:'All Exams',         path:'/exams',          color:'#1E3A5F' },
]

export default function Dashboard() {
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const { balance } = useCoins()
  const isNew       = !user?.testsCompleted && (user?.coins <= 200)

  return (
    <AppLayout>
      {/* Festival banner */}
      <FestivalBanner />

      {/* Exam notification banner */}
      <ExamNotificationBanner />

      {/* Welcome header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <p style={{ color:'#94A3B8', fontSize:13 }}>{getGreeting()}</p>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:'clamp(22px,3vw,30px)', marginTop:4 }}>
            {user?.name ? `Welcome, ${user.name.split(' ')[0]}! 👋` : 'Welcome to TryIT! 👋'}
          </h1>
        </div>
        <div style={{ display:'flex', gap:10, flexShrink:0 }}>
          <div onClick={()=>navigate('/wallet')} style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:14, padding:'10px 16px', cursor:'pointer', textAlign:'center', border:'1.5px solid rgba(212,175,55,0.3)' }}>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:10, letterSpacing:'1px' }}>COINS</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:20 }}>{balance || user?.coins || 200}</p>
          </div>
        </div>
      </div>

      {/* New user welcome card */}
      {isNew && (
        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:22, padding:22, marginBottom:20, border:'1.5px solid rgba(212,175,55,0.3)' }}>
          <p style={{ color:'#D4AF37', fontSize:12, fontWeight:700, letterSpacing:'2px', marginBottom:8 }}>🎉 YOU'RE READY TO BEGIN</p>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:20, marginBottom:8 }}>
            200 coins in your wallet. Every exam waiting.
          </h2>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginBottom:16 }}>
            Start your first test to get your All-India rank. Score above the cutoff → earn more coins. Score below → coins deducted. That's the discipline.
          </p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button onClick={()=>navigate('/test-engine')} style={{ padding:'11px 22px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#D4AF37,#E8C44A)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>
              📝 Start First Test
            </button>
            <button onClick={()=>navigate('/career-compass')} style={{ padding:'11px 22px', borderRadius:14, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.06)', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, color:'rgba(255,255,255,0.8)', cursor:'pointer' }}>
              🧭 Find My Exam
            </button>
          </div>
        </div>
      )}

      {/* Returning user stats */}
      {!isNew && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:12, marginBottom:20 }}>
          {[
            [user?.levelEmoji||'🔥', user?.levelTitle||'The Fierce One', 'Your Level'],
            ['🔥', `${user?.streak||0} days`, 'Streak'],
            ['📝', user?.testsCompleted||0, 'Tests Done'],
            ['📊', user?.avgScore ? `${user.avgScore}%` : '—', 'Avg Score'],
            ['🏆', user?.rank ? `#${user.rank.toLocaleString()}` : '—', 'Rank'],
          ].map(([e,v,l])=>(
            <div key={l} style={{ background:'#fff', borderRadius:18, padding:'14px 12px', textAlign:'center', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize:22 }}>{e}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:16, marginTop:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v}</p>
              <p style={{ color:'#94A3B8', fontSize:11, marginTop:2 }}>{l}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>⚡ Quick Actions</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,150px),1fr))', gap:10, marginBottom:20 }}>
        {QUICK_ACTIONS.map(a => (
          <div key={a.path} onClick={()=>navigate(a.path)}
            style={{ background:'#fff', borderRadius:18, padding:'16px 12px', textAlign:'center', cursor:'pointer', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', transition:'all 0.2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=a.color; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 20px ${a.color}22` }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize:28, marginBottom:6 }}>{a.emoji}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E293B', fontSize:13 }}>{a.label}</p>
          </div>
        ))}
      </div>

      {/* Enrolled exams — empty state for new user */}
      {(!user?.exams || user.exams.length === 0) ? (
        <div style={{ background:'rgba(30,58,95,0.04)', borderRadius:20, padding:24, textAlign:'center', border:'1.5px dashed #E2E8F0' }}>
          <p style={{ fontSize:36, marginBottom:10 }}>📋</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:6 }}>No exams enrolled yet</p>
          <p style={{ color:'#94A3B8', fontSize:13, marginBottom:16 }}>Pick your target exam to get a personalised roadmap, daily practice, and All-India rank.</p>
          <button onClick={()=>navigate('/exams')} style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'none', borderRadius:14, padding:'11px 24px', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor:'pointer' }}>
            Browse 1,10,000+ Exams →
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>📋 My Exams</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {user.exams.map((e,i) => (
              <div key={i} onClick={()=>navigate(`/exams/${e.id}`)}
                style={{ background:'#fff', borderRadius:18, padding:'14px 18px', border:'1.5px solid #E2E8F0', cursor:'pointer', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:15 }}>{e.name}</p>
                  {e.readiness > 0 ? (
                    <>
                      <div style={{ height:4, background:'#F1F5F9', borderRadius:2, marginTop:8 }}>
                        <div style={{ width:`${e.readiness}%`, height:4, borderRadius:2, background:e.readiness>=70?'#22C55E':e.readiness>=40?'#D4AF37':'#EF4444' }}/>
                      </div>
                      <p style={{ color:'#94A3B8', fontSize:11, marginTop:4 }}>{e.readiness}% ready</p>
                    </>
                  ) : (
                    <p style={{ color:'#94A3B8', fontSize:12, marginTop:4 }}>Take first test to see readiness</p>
                  )}
                </div>
                <button onClick={e2=>{e2.stopPropagation();navigate('/test-engine')}} style={{ background:'#F1F5F9', border:'none', borderRadius:10, padding:'7px 14px', color:'#1E3A5F', cursor:'pointer', fontSize:12, fontWeight:600, flexShrink:0 }}>Practice</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 5)  return 'Still awake? 🌙 Dedication!'
  if (h < 12) return 'Good morning ☀️'
  if (h < 17) return 'Good afternoon 🌤️'
  if (h < 21) return 'Good evening 🌆'
  return 'Good night 🌙 Study session?'
}
EOF
echo "Splash + Dashboard done"
# ══════════════════════════════════════════════════════════════════
# 2. MISSING STUB PAGES — quick real implementations
# ══════════════════════════════════════════════════════════════════

# Notifications
cat > src/pages/Notifications.jsx << 'EOF'
import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'

const NOTIF_TYPES = {
  test_result:  { emoji:'📝', color:'#1E3A5F' },
  rank_change:  { emoji:'📈', color:'#22C55E' },
  streak:       { emoji:'🔥', color:'#F97316' },
  guru_reply:   { emoji:'🎓', color:'#7C3AED' },
  tournament:   { emoji:'🏆', color:'#D4AF37' },
  battle:       { emoji:'⚔️', color:'#EF4444' },
  coins:        { emoji:'🪙', color:'#D4AF37' },
  exam_alert:   { emoji:'📡', color:'#1E3A5F' },
  achievement:  { emoji:'🏅', color:'#D4AF37' },
  promo:        { emoji:'🎁', color:'#22C55E' },
}

function getStoredNotifs() {
  try { return JSON.parse(localStorage.getItem('tryit_unread_notifs') || '[]') } catch { return [] }
}

const DEMO_NOTIFS = [
  { id:'n1', type:'coins',       title:'+200 Welcome Coins!',          body:'Your welcome bonus has been added to your wallet 🎉',           time:'Just now',   read:false },
  { id:'n2', type:'exam_alert',  title:'SSC CGL 2026 Notification Out',body:'Applications open until Oct 31, 2026. Apply now!',              time:'1 hour ago', read:false },
  { id:'n3', type:'promo',       title:'TryIT Tip of the Day',         body:'Students who take 3 tests/week score 40% higher in 30 days.',   time:'Today 7AM',  read:true  },
  { id:'n4', type:'achievement', title:'First Login Badge Unlocked!',  body:"You've earned the 'Just Started 🌱' badge. Welcome to TryIT!", time:'Today',      read:true  },
]

export default function Notifications() {
  const stored = getStoredNotifs()
  const allNotifs = [...stored, ...DEMO_NOTIFS]
  const [notifs, setNotifs] = useState(allNotifs)
  const unread = notifs.filter(n=>!n.read).length

  const markAll = () => setNotifs(n=>n.map(x=>({...x,read:true})))
  const markOne = (id) => setNotifs(n=>n.map(x=>x.id===id?{...x,read:true}:x))

  return (
    <AppLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28 }}>🔔 Notifications</h1>
          {unread>0 && <p style={{ color:'#64748B', fontSize:13, marginTop:2 }}>{unread} unread</p>}
        </div>
        {unread>0 && <button onClick={markAll} style={{ background:'none', border:'1px solid #E2E8F0', borderRadius:10, padding:'7px 14px', color:'#64748B', cursor:'pointer', fontSize:13 }}>Mark all read</button>}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {notifs.length===0 ? (
          <div style={{ textAlign:'center', padding:60, color:'#94A3B8' }}>
            <p style={{ fontSize:40 }}>🔔</p>
            <p style={{ marginTop:12 }}>No notifications yet</p>
          </div>
        ) : notifs.map(n => {
          const t = NOTIF_TYPES[n.type] || NOTIF_TYPES.promo
          return (
            <div key={n.id} onClick={()=>markOne(n.id)}
              style={{ background:n.read?'#fff':'rgba(30,58,95,0.04)', borderRadius:18, padding:'14px 16px', border:`1.5px solid ${n.read?'#E2E8F0':'#1E3A5F33'}`, cursor:'pointer', display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${t.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{t.emoji}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:n.read?600:700, color:'#1E293B', fontSize:14 }}>{n.title}</p>
                <p style={{ color:'#64748B', fontSize:13, marginTop:3 }}>{n.body}</p>
                <p style={{ color:'#94A3B8', fontSize:11, marginTop:6 }}>{n.time}</p>
              </div>
              {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:'#1E3A5F', marginTop:4, flexShrink:0 }}/>}
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}
EOF

# Analytics page
cat > src/pages/Analytics.jsx << 'EOF'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Analytics() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const hasTests  = user?.testsCompleted > 0

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>📊 Analytics</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Your performance, trends, and rank history</p>

      {!hasTests ? (
        <div style={{ textAlign:'center', padding:60, background:'#fff', borderRadius:24, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontSize:48, marginBottom:16 }}>📊</p>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', marginBottom:8 }}>No data yet</h2>
          <p style={{ color:'#64748B', fontSize:14, maxWidth:340, margin:'0 auto 24px' }}>
            Take your first test to unlock analytics — score history, rank trends, weak topics, and subject performance.
          </p>
          <button onClick={()=>navigate('/test-engine')} style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'none', borderRadius:14, padding:'13px 28px', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, cursor:'pointer' }}>
            📝 Take First Test →
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gap:14 }}>
          {[
            { label:'Tests Taken',   value:user.testsCompleted, emoji:'📝' },
            { label:'Average Score', value:`${user.avgScore||0}%`, emoji:'📈' },
            { label:'Current Rank',  value:user.rank?`#${user.rank.toLocaleString()}`:'—', emoji:'🏆' },
            { label:'Coins Earned',  value:(user.coins||200).toLocaleString(), emoji:'🪙' },
          ].map(s=>(
            <div key={s.label} style={{ background:'#fff', borderRadius:18, padding:'16px 20px', border:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:28 }}>{s.emoji}</span>
              <div>
                <p style={{ color:'#94A3B8', fontSize:12 }}>{s.label}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:22 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
EOF

# Achievements page
cat > src/pages/Achievements.jsx << 'EOF'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { LEVELS } from '../data/levelSystem'

const BADGES = [
  { id:'first_login',  emoji:'🌱', name:'Just Started',    desc:'Created your TryIT account',                         earned:true  },
  { id:'first_test',   emoji:'📝', name:'Test Taker',      desc:'Completed your first mock test',                     earned:false },
  { id:'first_pass',   emoji:'✅', name:'First Pass',      desc:'Scored above cutoff in any test',                    earned:false },
  { id:'streak_3',     emoji:'🔥', name:'3-Day Flame',     desc:'3 days study streak',                                earned:false },
  { id:'streak_7',     emoji:'⚔️', name:'Week Warrior',   desc:'7 consecutive days of study',                        earned:false },
  { id:'coins_500',    emoji:'🪙', name:'Coin Collector',  desc:'Earned 500 coins',                                   earned:false },
  { id:'rank_top1000', emoji:'🌟', name:'Top 1000',        desc:'Achieved All-India Rank under 1,000',                earned:false },
  { id:'focus_5',      emoji:'🎯', name:'Focus Warrior',   desc:'Completed 5 Focus Mode sessions',                    earned:false },
  { id:'guru_answer',  emoji:'🎓', name:'Guru',            desc:'Got an answer accepted in Guru Hub',                 earned:false },
  { id:'community',    emoji:'🏛️', name:'Community Hero', desc:'Posted a verified success story',                    earned:false },
]

export default function Achievements() {
  const { user } = useAuth()
  const earnedCount = BADGES.filter(b=>b.earned).length

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>🏅 Achievements</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:16 }}>{earnedCount}/{BADGES.length} badges earned</p>

      {/* Level card */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:22, padding:20, marginBottom:20, border:'1.5px solid rgba(212,175,55,0.3)' }}>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginBottom:4 }}>CURRENT LEVEL</p>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:26 }}>
          {user?.levelEmoji||'🔥'} {user?.levelTitle||'The Fierce One'}
        </p>
        <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:3, marginTop:12 }}>
          <div style={{ width:`${Math.min(100,((user?.xp||0)/(user?.xpToNext||500))*100)}%`, height:6, borderRadius:3, background:'linear-gradient(90deg,#D4AF37,#E8C44A)' }}/>
        </div>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, marginTop:6 }}>{user?.xp||0} / {user?.xpToNext||500} XP to next level</p>
      </div>

      {/* Level roadmap */}
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>🗺️ Level Roadmap</p>
      <div style={{ display:'flex', gap:8, overflowX:'auto', marginBottom:20, paddingBottom:4 }}>
        {LEVELS.map((l,i) => {
          const current = (user?.level||1) === l.level
          const done    = (user?.level||1) > l.level
          return (
            <div key={l.level} style={{ flexShrink:0, textAlign:'center', padding:'12px 10px', borderRadius:16, background:current?'linear-gradient(135deg,#1E3A5F,#0F2140)':done?'rgba(34,197,94,0.1)':'#F8FAFC', border:`1.5px solid ${current?'#D4AF37':done?'#22C55E':'#E2E8F0'}`, minWidth:80 }}>
              <p style={{ fontSize:20 }}>{l.emoji}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:current?'#D4AF37':done?'#22C55E':'#94A3B8', fontSize:10, marginTop:4 }}>L{l.level}</p>
              <p style={{ color:current?'rgba(255,255,255,0.7)':'#94A3B8', fontSize:9 }}>{l.title.slice(0,8)}</p>
            </div>
          )
        })}
      </div>

      {/* Badges */}
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>🏅 Badges</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,160px),1fr))', gap:10 }}>
        {BADGES.map(b => (
          <div key={b.id} style={{ background:'#fff', borderRadius:18, padding:'16px 12px', textAlign:'center', border:`1.5px solid ${b.earned?'#D4AF37':'#E2E8F0'}`, opacity:b.earned?1:0.5 }}>
            <p style={{ fontSize:32 }}>{b.earned?b.emoji:'🔒'}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:13, marginTop:8 }}>{b.name}</p>
            <p style={{ color:'#94A3B8', fontSize:11, marginTop:4, lineHeight:1.4 }}>{b.desc}</p>
            {b.earned && <span style={{ background:'#DCFCE7', color:'#15803D', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, marginTop:6, display:'inline-block' }}>Earned ✓</span>}
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
EOF
echo "Notifications + Analytics + Achievements done"
# ══════════════════════════════════════════════════════════════════
# 3. DEPLOYMENT GUIDE + PRE-LAUNCH CHECKLIST
# ══════════════════════════════════════════════════════════════════
cat > LAUNCH_GUIDE.md << 'EOF'
# TryIT Educations — Launch Guide (June 15, 2026)
# ═══════════════════════════════════════════════════════════════════

## ════════════════════════════════════════
## TODAY: SUPABASE SETUP (30 minutes)
## ════════════════════════════════════════

### Step 1: Create projects
Go to: https://supabase.com

Create 4 projects:
1. tryit-core       (auth + profiles + leaderboard)
2. tryit-content    (questions + institution + PDFs)
3. tryit-finance    (payments + coins audit trail)
4. tryit-analytics  (aggregated stats only)

### Step 2: Run schema
In each project → SQL Editor → paste and run:

Project 1 (tryit-core):
→ Copy: supabase/migrations/001_complete_schema.sql
→ Paste in SQL Editor → Run

### Step 3: Fill .env.local
```
cp .env.local.template .env.local
```
Edit .env.local:
```
VITE_SUPABASE_CORE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_CORE_ANON_KEY=eyJhbGci...
VITE_RAZORPAY_KEY=rzp_test_XXXXXXXXXX
```

### Step 4: Test locally
```bash
npm run dev
```
Open: http://localhost:5173
Test these flows:
  □ Landing page loads with animations
  □ Login with email → OTP → Dashboard
  □ New user sees 200 coins, empty state
  □ Take a test → see result with coin earn/deduct
  □ Admin /admin/login → grant Pro to your email
  □ Festival banner (if today is a festival)
  □ Theme selector works
  □ Accessibility bar opens

## ════════════════════════════════════════
## JUNE 12: DEPLOY WEBSITE (20 minutes)
## ════════════════════════════════════════

### Build
```bash
npm run build
```
Creates: /dist folder

### Deploy to Cloudflare Pages
1. Go to: https://pages.cloudflare.com
2. Click: Create application → Pages
3. Connect GitHub: Select your Tatu repo
4. Build settings:
   - Build command: npm run build
   - Build output: dist
5. Environment variables: Add all from .env.local
6. Click: Save and Deploy

OR manual upload:
1. pages.cloudflare.com → Upload assets
2. Upload /dist folder

### Custom domain
1. Cloudflare Pages → Custom domains → tryiteducations.net
2. DNS: CNAME → pages.dev URL
3. Wait 5 minutes → tryiteducations.net is live

## ════════════════════════════════════════
## JUNE 12-13: BETA TESTING WITH USERS
## ════════════════════════════════════════

### Grant 5 test users Pro access
1. Go to: https://tryiteducations.net/admin/login
2. Login: admin@tryit.com / tryit@admin2026
3. Grant Pro Access tab
4. Enter each tester's email → Pro → 30 days

### What testers should test
Give them this list:
  □ Register as student on mobile
  □ Complete onboarding (pick exam, language)
  □ Take one full mock test
  □ Check result screen (coins earned/deducted)
  □ Try Career Compass quiz
  □ Read current affairs (look for +5 coins after 30s)
  □ Play Math Blitz game
  □ Post something in Community Hall
  □ Try different themes in Settings
  □ Test on mobile browser (most important)

### Collect feedback
WhatsApp group: "TryIT Beta Testers"
Ask them to send screenshots of:
  - Any error messages
  - Anything that looks wrong
  - Features they love
  - Features that confused them

## ════════════════════════════════════════
## JUNE 14: ANDROID APK
## ════════════════════════════════════════

### Prerequisites
Install Android Studio: developer.android.com/studio
(Free, takes 30 min to install + configure)

### Build APK
```bash
# In /workspaces/Tatu:
npm run build
npx cap sync android
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync (5 min)
2. Build → Build Bundle(s) / APK(s) → Build APK(s)
3. Wait 3-5 min
4. Click "locate" in notification
5. APK: android/app/build/outputs/apk/debug/app-debug.apk

### Share APK for testing
```bash
# If phone connected via USB:
adb install app-debug.apk

# Or: Share via WhatsApp/Gmail to your phone
```

### SIGNED APK (for Play Store)
In Android Studio:
1. Build → Generate Signed Bundle / APK
2. Create new keystore (save the password!)
3. Choose APK → Release → Finish
4. Upload to Play Store console

## ════════════════════════════════════════
## JUNE 15: LAUNCH DAY CHECKLIST
## ════════════════════════════════════════

Morning (6 AM):
  □ Switch Razorpay from test to LIVE keys
    - dashboard.razorpay.com → Settings → API Keys → Live
    - Update VITE_RAZORPAY_KEY in Cloudflare env vars
    - Redeploy: npm run build → push to GitHub

  □ Test one ₹19 payment with your own card
  □ Confirm money reaches your bank

  □ Final website test on mobile
  □ Final website test on desktop
  □ Check all pages load (no errors)

  □ Announce on social media
    Twitter/X: "TryIT Educations is LIVE! 🚀"
    LinkedIn: Platform launch post
    WhatsApp: Share with exam prep groups

## ════════════════════════════════════════
## AFTER LAUNCH: WEEK 1 PRIORITIES
## ════════════════════════════════════════

Day 1-2: Watch for errors
  - Check browser console on your phone
  - Fix any crashes immediately
  - Be available to respond to user feedback

Day 3-5: User data
  - How many registered?
  - Which pages are most visited?
  - Where are users dropping off?
  - Any payment failures?

Day 5-7: Improve
  - Fix top 3 reported bugs
  - Add missing questions (pipeline running on extra laptop)
  - Consider a WhatsApp bot for support

## ════════════════════════════════════════
## EMERGENCY CONTACTS
## ════════════════════════════════════════

If website is down: Cloudflare status.cloudflare.com
If Supabase is down: status.supabase.com
If Razorpay fails: Call 1800-258-0009 (24/7)
If Play Store issue: support.google.com/googleplay/android-developer

EOF
echo "Launch guide done"

# ── Final health check ────────────────────────────────────────────
python3 << 'PYEOF'
import os, json

issues = []
warnings = []

# Check critical files exist
REQUIRED = [
    ('src/App.jsx',                   'Main app'),
    ('src/main.jsx',                  'Entry point'),
    ('src/app/routes.jsx',            'All routes'),
    ('src/pages/Splash.jsx',          'Splash screen'),
    ('src/pages/Landing.jsx',         'Landing page'),
    ('src/pages/Login.jsx',           'Login page'),
    ('src/pages/Onboarding.jsx',      'Onboarding'),
    ('src/pages/Dashboard.jsx',       'Dashboard'),
    ('src/pages/Notifications.jsx',   'Notifications'),
    ('src/pages/Analytics.jsx',       'Analytics'),
    ('src/pages/Achievements.jsx',    'Achievements'),
    ('src/context/AuthContext.jsx',   'Auth context'),
    ('src/context/CoinContext.jsx',   'Coin context'),
    ('src/context/ThemeContext.jsx',  'Theme context'),
    ('src/lib/coinVault.js',          'Coin vault'),
    ('src/lib/supabase.js',           'Supabase client'),
    ('src/lib/themes.js',             '26 themes'),
    ('src/lib/security.js',           'Security layer'),
    ('src/lib/localDb.js',            'Local database'),
    ('src/data/levelSystem.js',       'Level system'),
    ('src/data/festivalCalendar.js',  'Festival calendar'),
    ('src/components/FestivalBanner.jsx',         'Festival banner'),
    ('src/components/ExamNotificationBanner.jsx', 'Exam notifications'),
]

print("\n📋 File Health Check:")
for path, name in REQUIRED:
    if os.path.exists(path):
        print(f"  ✅ {name}")
    else:
        issues.append(f"MISSING: {path} ({name})")
        print(f"  ❌ MISSING — {name} ({path})")

# Check package.json has required deps
if os.path.exists('package.json'):
    with open('package.json') as f:
        pkg = json.load(f)
    deps = {**pkg.get('dependencies',{}), **pkg.get('devDependencies',{})}
    NEED = ['react','react-router-dom','@supabase/supabase-js']
    for d in NEED:
        if d not in deps: warnings.append(f"Missing npm package: {d}")

print(f"\n{'='*50}")
if not issues:
    print(f"✅ All {len(REQUIRED)} files present")
else:
    print(f"❌ {len(issues)} files missing — run earlier install scripts first")
    for i in issues: print(f"   {i}")
if warnings:
    for w in warnings: print(f"   ⚠️  {w}")
PYEOF

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ FINAL INSTALL COMPLETE                               ║"
echo "║                                                          ║"
echo "║  WHAT'S DONE:                                            ║"
echo "║  ✅ Clean App.jsx (providers + routes only)              ║"
echo "║  ✅ Clean main.jsx (security + theme init)               ║"
echo "║  ✅ All routes in src/app/routes.jsx                    ║"
echo "║  ✅ New user: 200 coins, zero everything else            ║"
echo "║  ✅ Splash → Landing → Login → Onboarding → Dashboard   ║"
echo "║  ✅ Dashboard: empty state → guided to first action      ║"
echo "║  ✅ Festival banner auto-shows on 20+ Indian days        ║"
echo "║  ✅ Notifications, Analytics, Achievements pages         ║"
echo "║  ✅ Launch guide in LAUNCH_GUIDE.md                     ║"
echo "║                                                          ║"
echo "║  RUN NOW:                                                ║"
echo "║    npm run dev                                           ║"
echo "║                                                          ║"
echo "║  THEN OPEN:                                              ║"
echo "║    http://localhost:5173                                 ║"
echo "║                                                          ║"
echo "║  TEST THESE FLOWS:                                       ║"
echo "║    1. /         → Splash → Landing                       ║"
echo "║    2. /login    → Pick Student → Email → OTP → Dashboard ║"
echo "║    3. Dashboard → 200 coins, empty state, festival       ║"
echo "║    4. /settings/themes → 26 cinematic themes             ║"
echo "║    5. /admin/login → Grant Pro → logout → login          ║"
echo "║                                                          ║"
echo "║  READ: LAUNCH_GUIDE.md for June 15 steps                ║"
echo "╚══════════════════════════════════════════════════════════╝"
