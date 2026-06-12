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
