import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useToast } from '../../context/ToastContext'

function genQ() {
  const ops = ['+','-','×','÷']
  const op = ops[Math.floor(Math.random()*4)]
  let a,b,ans
  if(op==='+'){a=Math.floor(Math.random()*50)+1;b=Math.floor(Math.random()*50)+1;ans=a+b}
  else if(op==='-'){a=Math.floor(Math.random()*80)+20;b=Math.floor(Math.random()*a)+1;ans=a-b}
  else if(op==='×'){a=Math.floor(Math.random()*12)+2;b=Math.floor(Math.random()*12)+2;ans=a*b}
  else{b=Math.floor(Math.random()*10)+2;ans=Math.floor(Math.random()*10)+2;a=b*ans}
  const wrong=[ans+b,ans-1,ans+1,ans*2].filter(x=>x!==ans&&x>0)
  const choices=[ans,...wrong.slice(0,3)].sort(()=>Math.random()-0.5)
  return{ q:`${a} ${op} ${b} = ?`, ans, choices }
}

export default function MathBlitz() {
  const navigate   = useNavigate()
  const { showToast } = useToast()
  const [phase,    setPhase]   = useState('intro')
  const [q,        setQ]       = useState(null)
  const [qNum,     setQNum]    = useState(0)
  const [score,    setScore]   = useState(0)
  const [timeLeft, setTime]    = useState(60)
  const [chosen,   setChosen]  = useState(null)
  const [streak,   setStreak]  = useState(0)
  const [lastRight,setLast]    = useState(null)
  const timerRef = useRef(null)
  const TOTAL = 10

  const start = () => { setPhase('play'); setQ(genQ()); setQNum(1); setScore(0); setTime(60); setStreak(0) }

  useEffect(() => {
    if(phase!=='play') return
    timerRef.current = setInterval(()=>{
      setTime(t=>{
        if(t<=1){ clearInterval(timerRef.current); setPhase('result'); return 0 }
        return t-1
      })
    },1000)
    return ()=>clearInterval(timerRef.current)
  },[phase])

  const pick = (val) => {
    if(chosen!==null) return
    setChosen(val)
    const right = val===q.ans
    if(right){ setScore(s=>s+(streak>=2?15:10)); setStreak(s=>s+1); setLast(true) }
    else { setStreak(0); setLast(false) }
    setTimeout(()=>{
      setChosen(null); setLast(null)
      if(qNum>=TOTAL){ clearInterval(timerRef.current); setPhase('result') }
      else { setQ(genQ()); setQNum(n=>n+1) }
    },600)
  }

  const coins = Math.floor(score/3)+5

  if(phase==='intro') return (
    <AppLayout>
      <div style={{ maxWidth:400, margin:'0 auto', textAlign:'center', padding:'40px 0' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>⚡</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:30, marginBottom:10 }}>Math Blitz</h1>
        <p style={{ color:'#64748B', fontSize:15, marginBottom:24 }}>10 questions · 60 seconds · Earn up to 50 coins</p>
        <div style={{ background:'#F8FAFC', borderRadius:18, padding:16, marginBottom:24, textAlign:'left', border:'1.5px solid #E2E8F0' }}>
          {['Tap the correct answer fast','Streak bonus: 3+ correct = +5 per question','Finish all 10 before timer ends','Top score this week: 90 pts'].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:10, marginBottom:8 }}>
              <span style={{ color:'#D4AF37' }}>▸</span>
              <span style={{ color:'#475569', fontSize:13 }}>{r}</span>
            </div>
          ))}
        </div>
        <button onClick={start} style={{ width:'100%', padding:16, borderRadius:16, border:'none', background:'linear-gradient(135deg,#EF4444,#DC2626)', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', cursor:'pointer', boxShadow:'0 6px 20px rgba(239,68,68,0.4)' }}>
          ⚡ Start Blitz!
        </button>
      </div>
    </AppLayout>
  )

  if(phase==='result') return (
    <AppLayout>
      <div style={{ maxWidth:400, margin:'0 auto', textAlign:'center', padding:'40px 0' }}>
        <div style={{ fontSize:60, marginBottom:16 }}>{score>=70?'🏆':score>=40?'⭐':'😤'}</div>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:28, marginBottom:8 }}>
          {score>=70?'Blazing! 🔥':score>=40?'Nice work! 💪':'Keep going! 📈'}
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
          {[['Score',score],['Coins Earned',`🪙 ${coins}`],['Questions',`${qNum-1}/${TOTAL}`],['Best Streak',`${streak}x`]].map(([l,v])=>(
            <div key={l} style={{ background:'#F8FAFC', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0' }}>
              <p style={{ color:'#94A3B8', fontSize:11, marginBottom:4 }}>{l}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:24 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, flexDirection:'column' }}>
          <button onClick={start} style={{ padding:14, borderRadius:14, border:'none', background:'linear-gradient(135deg,#EF4444,#DC2626)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16, color:'#fff', cursor:'pointer' }}>⚡ Play Again</button>
          <button onClick={()=>navigate('/games')} style={{ padding:12, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>← All Games</button>
        </div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div style={{ maxWidth:460, margin:'0 auto' }}>
        {/* Timer + score bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background: timeLeft<=10?'#EF4444':timeLeft<=20?'#F59E0B':'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:18 }}>{timeLeft}</div>
            <span style={{ color:'#64748B', fontSize:13 }}>sec left</span>
          </div>
          <div style={{ display:'flex', gap:4 }}>
            {Array.from({length:TOTAL}).map((_,i)=>(
              <div key={i} style={{ width:22, height:22, borderRadius:'50%', background: i<qNum-1?'#22C55E':i===qNum-1?'#D4AF37':'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color: i<qNum-1?'#fff':i===qNum-1?'#1E3A5F':'#94A3B8' }}>{i<qNum-1?'✓':i+1}</div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:20 }}>{score}</p>
            {streak>=2&&<p style={{ color:'#F97316', fontSize:11, fontWeight:700 }}>🔥 {streak}x streak!</p>}
          </div>
        </div>

        {/* Question */}
        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:24, padding:32, marginBottom:20, textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, letterSpacing:'2px', marginBottom:8 }}>Q {qNum} / {TOTAL}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:'clamp(28px,6vw,48px)' }}>{q?.q}</p>
          {lastRight===true&&<p style={{ color:'#4ADE80', fontWeight:700, fontSize:16, marginTop:8 }}>✓ Correct! {streak>=2?'🔥':''}</p>}
          {lastRight===false&&<p style={{ color:'#F87171', fontWeight:700, fontSize:16, marginTop:8 }}>✗ Oops — Answer was {q?.ans}</p>}
        </div>

        {/* Choices */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {q?.choices.map((c,i)=>{
            const isChosen = chosen===c
            const isRight  = chosen!==null && c===q.ans
            const isWrong  = isChosen && c!==q.ans
            return (
              <button key={i} onClick={()=>pick(c)} disabled={chosen!==null}
                style={{ padding:'22px', borderRadius:18, border:'none', cursor: chosen!==null?'not-allowed':'pointer', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'clamp(22px,4vw,32px)',
                  background: isRight?'#22C55E':isWrong?'#EF4444':'#fff',
                  color: isRight||isWrong?'#fff':'#1E3A5F',
                  boxShadow: isRight?'0 6px 20px rgba(34,197,94,0.4)':isWrong?'0 6px 20px rgba(239,68,68,0.4)':'0 4px 14px rgba(0,0,0,0.08)',
                  transform: isChosen?'scale(0.95)':'scale(1)', transition:'all 0.15s' }}>
                {c}
              </button>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
