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
