import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useCoins } from '../../context/CoinContext'
import { useAuth } from '../../context/AuthContext'
import { rewardGame } from '../../lib/coinVault'

const EXAM_GK = {
  'SSC CGL': [
    { q:'When was the Indian Constitution adopted?', options:['26 Jan 1950','26 Nov 1949','15 Aug 1947','2 Oct 1950'], ans:1 },
    { q:'Which Article deals with Right to Equality?', options:['Art 14-18','Art 19-22','Art 23-24','Art 25-28'], ans:0 },
    { q:'Who is called the "Iron Man of India"?', options:['Nehru','Gandhi','Patel','Bose'], ans:2 },
    { q:'Largest state in India by area?', options:['UP','MP','Rajasthan','Maharashtra'], ans:2 },
    { q:'Which river is called "Sorrow of Bengal"?', options:['Ganga','Brahmaputra','Damodar','Hooghly'], ans:2 },
    { q:'Mount Everest is in which country?', options:['India','Nepal','China','Bhutan'], ans:1 },
    { q:'Who gave the slogan "Jai Jawan Jai Kisan"?', options:['Nehru','Gandhi','Shastri','Patel'], ans:2 },
    { q:'RBI was established in which year?', options:['1930','1935','1945','1947'], ans:1 },
    { q:'Panchayati Raj is in which schedule?', options:['10th','11th','12th','9th'], ans:1 },
    { q:'Which vitamin is known as "Sunshine Vitamin"?', options:['Vit A','Vit B12','Vit C','Vit D'], ans:3 },
  ],
  default: [
    { q:'Capital of Australia?', options:['Sydney','Melbourne','Canberra','Brisbane'], ans:2 },
    { q:'Which is the largest ocean?', options:['Atlantic','Indian','Arctic','Pacific'], ans:3 },
    { q:'Who invented the telephone?', options:['Edison','Bell','Tesla','Marconi'], ans:1 },
    { q:'Chemical symbol for Gold?', options:['Gd','Go','Au','Ag'], ans:2 },
    { q:'How many bones in adult human body?', options:['196','206','216','226'], ans:1 },
    { q:'Which planet is closest to the Sun?', options:['Venus','Earth','Mercury','Mars'], ans:2 },
    { q:'Speed of light (approx)?', options:['3×10⁸ m/s','3×10⁶ m/s','3×10⁴ m/s','3×10¹⁰ m/s'], ans:0 },
    { q:'National animal of India?', options:['Lion','Elephant','Tiger','Leopard'], ans:2 },
    { q:'First woman PM of India?', options:['Sarojini Naidu','Indira Gandhi','Vijayalakshmi Pandit','Sonia Gandhi'], ans:1 },
    { q:'UN Headquarters is located in?', options:['Geneva','Paris','New York','London'], ans:2 },
  ],
}

export default function GKBurst() {
  const navigate    = useNavigate()
  const { earn }    = useCoins()
  const { user }    = useAuth()
  const [phase,  setPhase]  = useState('intro')
  const [qi,     setQi]     = useState(0)
  const [score,  setScore]  = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft,setTime]  = useState(30)
  const [chosen, setChosen] = useState(null)
  const [lastOk, setLastOk] = useState(null)
  const [coinsEarned,setCE] = useState(0)
  const timerRef = useRef(null)

  const exam = localStorage.getItem('selected_exam') || 'SSC CGL'
  const qs   = EXAM_GK[exam] || EXAM_GK.default
  const q    = qs[qi]
  const C    = { bg:'#10B981', dark:'#047857', light:'#DCFCE7' }

  const start = () => { setPhase('play'); setQi(0); setScore(0); setStreak(0); setTime(30) }

  useEffect(()=>{
    if(phase!=='play') return
    timerRef.current = setInterval(()=>{
      setTime(t=>{
        if(t<=1){ clearInterval(timerRef.current); nextQ(false); return 30 }
        return t-1
      })
    },1000)
    return ()=>clearInterval(timerRef.current)
  },[phase,qi])

  const nextQ = (wasCorrect) => {
    clearInterval(timerRef.current)
    setTimeout(()=>{
      setChosen(null); setLastOk(null)
      if(qi+1>=qs.length){ finishGame(); return }
      setQi(i=>i+1); setTime(30)
    }, wasCorrect?500:1200)
  }

  const pick = (i) => {
    if(chosen!==null) return
    setChosen(i)
    const ok = i===q.ans
    setLastOk(ok)
    if(ok){ setScore(s=>s+(streak>=2?15:10)); setStreak(s=>s+1) }
    else setStreak(0)
    nextQ(ok)
  }

  const finishGame = async () => {
    clearInterval(timerRef.current)
    const isPerfect = score >= (qs.length-1)*10
    const result = await rewardGame({ score, isPerfect, gameName:'GK Burst', userId:user?.id })
    if(result?.coins){ earn({ source:'game', amount:result.coins, description:`GK Burst — ${score} pts` }); setCE(result.coins) }
    setPhase('result')
  }

  if(phase==='intro') return (
    <AppLayout>
      <div style={{ maxWidth:440, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:60, marginBottom:14 }}>🌏</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:28, marginBottom:8 }}>GK Burst</h1>
        <p style={{ color:'#64748B', fontSize:14, marginBottom:8 }}>General Knowledge · 30s per question · {exam}-focused</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#DCFCE7', border:'1px solid #22C55E', borderRadius:20, padding:'5px 14px', marginBottom:20 }}>
          <span style={{ color:'#15803D', fontSize:12, fontWeight:700 }}>🎯 Questions from {exam}</span>
        </div>
        <button onClick={start} style={{ width:'100%', padding:16, borderRadius:16, border:'none', background:`linear-gradient(135deg,${C.bg},${C.dark})`, fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', cursor:'pointer' }}>
          🌏 Start GK Burst!
        </button>
        <button onClick={()=>navigate('/games')} style={{ background:'none', border:'none', color:'#94A3B8', cursor:'pointer', fontSize:13, marginTop:12 }}>← All Games</button>
      </div>
    </AppLayout>
  )

  if(phase==='result') return (
    <AppLayout>
      <div style={{ maxWidth:400, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>{score>=70?'🏆':'🌏'}</div>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:26, marginBottom:14 }}>
          {score>=70?'GK Champion! 🏆':score>=40?'Good knowledge! 💪':'Study GK daily! 📚'}
        </h2>
        {coinsEarned>0 && (
          <div style={{ background:'rgba(212,175,55,0.1)', border:'1.5px solid rgba(212,175,55,0.3)', borderRadius:16, padding:14, marginBottom:16 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:26 }}>+{coinsEarned} 🪙</p>
          </div>
        )}
        <div style={{ display:'flex', gap:10, marginTop:16 }}>
          <button onClick={start} style={{ flex:1, padding:13, borderRadius:14, border:'none', background:`linear-gradient(135deg,${C.bg},${C.dark})`, color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, cursor:'pointer' }}>Play Again</button>
          <button onClick={()=>navigate('/games')} style={{ flex:1, padding:13, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>All Games</button>
        </div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div style={{ maxWidth:460, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:timeLeft<=10?'#EF4444':timeLeft<=20?'#F59E0B':C.bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18 }}>{timeLeft}</div>
          <div style={{ display:'flex', gap:4 }}>
            {qs.map((_,i)=>(<div key={i} style={{ width:Math.min(26,280/qs.length), height:6, borderRadius:3, background:i<qi?'#22C55E':i===qi?C.bg:'#F1F5F9' }}/>))}
          </div>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:18 }}>{score}</p>
        </div>
        <div style={{ background:`linear-gradient(135deg,${C.dark},${C.bg})`, borderRadius:22, padding:26, marginBottom:18, textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, marginBottom:6 }}>Q {qi+1}/{qs.length} · {exam}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:'clamp(15px,3vw,20px)', lineHeight:1.5 }}>{q?.q}</p>
          {lastOk===true  && <p style={{ color:'#4ADE80', fontWeight:700, marginTop:8 }}>✓ Correct! {streak>=2?'🔥':''}</p>}
          {lastOk===false && <p style={{ color:'#FCA5A5', fontWeight:700, marginTop:8 }}>✗ → {q?.options?.[q?.ans]}</p>}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {q?.options?.map((opt,i)=>{
            const right = chosen!==null && i===q.ans
            const wrong = chosen===i && i!==q.ans
            return (
              <button key={i} onClick={()=>pick(i)} disabled={chosen!==null}
                style={{ padding:'14px 10px', borderRadius:16, border:'none', cursor:chosen!==null?'not-allowed':'pointer',
                  background:right?'#22C55E':wrong?'#EF4444':'#fff',
                  color:right||wrong?'#fff':'#1E293B',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:'clamp(12px,2vw,14px)',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.06)', transition:'all 0.15s', textAlign:'left', lineHeight:1.4 }}>
                <span style={{ opacity:0.4, marginRight:6 }}>{['A','B','C','D'][i]}.</span>{opt}
              </button>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
