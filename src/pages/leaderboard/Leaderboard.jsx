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
