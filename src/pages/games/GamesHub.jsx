import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const GAMES = [
  { id:'math-blitz',  emoji:'⚡', name:'Math Blitz',    desc:'Solve 10 questions in 60 seconds',      coins:'5–50',  tag:'Most Popular', color:'#EF4444' },
  { id:'word-rush',   emoji:'📝', name:'Word Rush', playable:true,     desc:'Spot the correct spelling first',        coins:'5–30',  tag:'English',      color:'#3B82F6' },
  { id:'gk-burst',    emoji:'🌏', name:'GK Burst', playable:true,      desc:'10 GK questions. 30 seconds each.',      coins:'10–40', tag:'GK',           color:'#10B981' },
  { id:'logic-grid',  emoji:'🧩', name:'Logic Grid',    desc:'Fill the number grid using clues',       coins:'15–60', tag:'Reasoning',    color:'#8B5CF6' },
  { id:'rank-rush',   emoji:'🏆', name:'Rank Rush',     desc:'Beat 5 opponents in a timed challenge',  coins:'20–100',tag:'Multiplayer',  color:'#F59E0B' },
  { id:'daily-duel',  emoji:'🎯', name:'Daily Duel',    desc:'One opponent. 5 questions. Winner takes all.', coins:'25–75',tag:'Daily',  color:'#D4AF37' },
]

export default function GamesHub() {
  const navigate = useNavigate()
  const [active, setActive] = useState(null)
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>🎮 Brain Games</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Play. Earn coins. Rise the leaderboard.</p>

      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:20, padding:'14px 20px', marginBottom:20, display:'flex', gap:20, flexWrap:'wrap' }}>
        {[['🪙','1,247','My Coins'],['🏆','#347','Games Rank'],['🎮','142','Games Played'],['🔥','12d','Best Streak']].map(([e,v,l])=>(
          <div key={l} style={{ textAlign:'center' }}>
            <p style={{ fontSize:18 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:18 }}>{v}</p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{l}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap:14 }}>
        {GAMES.map(g=>(
          <div key={g.id} onClick={()=>g.id==='math-blitz'?navigate('/games/math-blitz'):g.id==='word-rush'?navigate('/games/word-rush'):g.id==='gk-burst'?navigate('/games/gk-burst'):setActive(g.id)}
            style={{ background:'#fff', borderRadius:20, padding:20, border:`1.5px solid ${active===g.id?g.color:'#E2E8F0'}`, cursor:'pointer', transition:'all 0.2s', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=g.color}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E2E8F0'}}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ fontSize:34 }}>{g.emoji}</span>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                <span style={{ background:`${g.color}18`, color:g.color, fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>{g.tag}</span>
                <span style={{ background:'#F8FAFC', color:'#D4AF37', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>🪙 {g.coins} coins</span>
              </div>
            </div>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16, marginBottom:6 }}>{g.name}</h3>
            <p style={{ color:'#64748B', fontSize:13, marginBottom:14 }}>{g.desc}</p>
            <button style={{ width:'100%', padding:'10px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${g.color},${g.color}CC)`, color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              {['math-blitz','word-rush','gk-burst'].includes(g.id)?'Play Now →':'Coming Soon'}
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
