import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useCoins } from '../../context/CoinContext'
import { useAuth } from '../../context/AuthContext'
import { rewardGame } from '../../lib/coinVault'

const LEVELS = {
  1: [
    { q:'Antonym of HUGE?',         options:['Tiny','Large','Vast','Grand'],      ans:0 },
    { q:'Synonym of BRAVE?',        options:['Timid','Coward','Valiant','Scared'],ans:2 },
    { q:'Correct spelling?',        options:['Recieve','Receive','Recive','Reciive'],ans:1 },
    { q:'Plural of CHILD?',         options:['Childs','Childes','Children','Childrens'],ans:2 },
    { q:'Past tense of RUN?',       options:['Runned','Ran','Run','Running'],     ans:1 },
    { q:'Fill: She ___ to school.', options:['go','goes','going','gone'],         ans:1 },
    { q:'Opposite of ACCEPT?',      options:['Agree','Reject','Allow','Take'],    ans:1 },
    { q:'Correct spelling?',        options:['Necesary','Necessary','Necessery','Neccesary'],ans:1 },
    { q:'Idiom: "Bite the bullet"', options:['Eat something','Endure pain','Shoot a gun','Talk bravely'],ans:1 },
    { q:'One word for "fear of water"?', options:['Hydrophobia','Xenophobia','Claustrophobia','Acrophobia'],ans:0 },
  ],
  2: [ // SSC/IBPS level
    { q:'Synonym of VERBOSE?',      options:['Silent','Wordy','Brief','Terse'],   ans:1 },
    { q:'"He is the apple of my eye" means?', options:['He is a fruit seller','He is very precious','He has good eyes','He wears glasses'],ans:1 },
    { q:'Correct: "Neither Ram nor Shyam ___ present"', options:['are','were','was','been'],ans:2 },
    { q:'One word: one who eats only plants?', options:['Carnivore','Herbivore','Omnivore','Insectivore'],ans:1 },
    { q:'Antonym of PRODIGAL?',     options:['Thrifty','Wasteful','Lavish','Extravagant'],ans:0 },
    { q:'Correct spelling?',        options:['Accomodate','Accommodate','Accommadate','Acomodate'],ans:1 },
    { q:'Passive: "He writes a letter"', options:['A letter writes him','A letter is written by him','A letter was written by him','A letter has been written'],ans:1 },
    { q:'Preposition: "She is good ___ mathematics"', options:['in','at','for','with'],ans:1 },
  ],
}

export default function WordRush() {
  const navigate    = useNavigate()
  const { earn }    = useCoins()
  const { user }    = useAuth()
  const [phase,  setPhase]  = useState('intro')
  const [qi,     setQi]     = useState(0)
  const [score,  setScore]  = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft,setTime]  = useState(15)
  const [chosen, setChosen] = useState(null)
  const [lastOk, setLastOk] = useState(null)
  const [coinsEarned,setCE] = useState(0)
  const timerRef = useRef(null)

  const level = Math.min(2, Math.max(1, Math.floor((user?.level||1)/3)+1))
  const qs    = LEVELS[level] || LEVELS[1]
  const q     = qs[qi]

  const start = () => { setPhase('play'); setQi(0); setScore(0); setStreak(0); setTime(15) }

  useEffect(()=>{
    if(phase!=='play') return
    timerRef.current = setInterval(()=>{
      setTime(t=>{
        if(t<=1){ clearInterval(timerRef.current); nextQ(false); return 15 }
        return t-1
      })
    },1000)
    return ()=>clearInterval(timerRef.current)
  },[phase, qi])

  const nextQ = (wasCorrect) => {
    clearInterval(timerRef.current)
    setTimeout(()=>{
      setChosen(null); setLastOk(null)
      if(qi+1 >= qs.length){ finishGame(); return }
      setQi(i=>i+1); setTime(15)
    }, wasCorrect ? 500 : 900)
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
    const result = await rewardGame({ score, isPerfect, gameName:'Word Rush', userId:user?.id })
    if(result?.coins){ earn({ source:'game', amount:result.coins, description:`Word Rush — ${score} pts` }); setCE(result.coins) }
    setPhase('result')
  }

  const C = { bg:'#3B82F6', dark:'#1D4ED8', light:'#DBEAFE', text:'#1E3A5F' }

  if(phase==='intro') return (
    <AppLayout>
      <div style={{ maxWidth:440, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:60, marginBottom:14 }}>📝</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:28, marginBottom:8 }}>Word Rush</h1>
        <p style={{ color:'#64748B', fontSize:14, marginBottom:20 }}>Spelling · Synonyms · Grammar · Idioms · 15s per question</p>
        <div style={{ background:'#EFF6FF', borderRadius:16, padding:16, marginBottom:20, textAlign:'left', border:'1px solid #BFDBFE' }}>
          {[`${qs.length} questions · ${qs.length*15}s total`,`Level ${level}: ${level===1?'Basic Vocabulary':'SSC/IBPS English'}`,`Streak bonus after 2 correct in a row`,`Earn up to 40 coins`].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
              <span style={{ color:C.bg }}>▸</span>
              <span style={{ color:'#1E40AF', fontSize:13 }}>{r}</span>
            </div>
          ))}
        </div>
        <button onClick={start} style={{ width:'100%', padding:16, borderRadius:16, border:'none', background:`linear-gradient(135deg,${C.bg},${C.dark})`, fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', cursor:'pointer' }}>
          📝 Start Word Rush!
        </button>
        <button onClick={()=>navigate('/games')} style={{ background:'none', border:'none', color:'#94A3B8', cursor:'pointer', fontSize:13, marginTop:12 }}>← All Games</button>
      </div>
    </AppLayout>
  )

  if(phase==='result') return (
    <AppLayout>
      <div style={{ maxWidth:400, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>{score>=70?'📚':'📖'}</div>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:26, marginBottom:14 }}>
          {score>=70?'Wordy Wizard! 📚':score>=40?'Good attempt! 💪':'Keep practising! 📖'}
        </h2>
        {coinsEarned>0 && (
          <div style={{ background:'rgba(212,175,55,0.1)', border:'1.5px solid rgba(212,175,55,0.3)', borderRadius:16, padding:14, marginBottom:16 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:26 }}>+{coinsEarned} 🪙</p>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[['Score',score],['Questions',qs.length],['Best Streak',`${streak}x`],['Level',`L${level}`]].map(([l,v])=>(
            <div key={l} style={{ background:'#F8FAFC', borderRadius:14, padding:14, border:'1.5px solid #E2E8F0' }}>
              <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:C.bg, fontSize:22 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
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
          <div style={{ width:44, height:44, borderRadius:'50%', background:timeLeft<=5?'#EF4444':C.bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18 }}>{timeLeft}</div>
          <div style={{ display:'flex', gap:4 }}>
            {qs.map((_,i)=>(
              <div key={i} style={{ width:Math.min(26,280/qs.length), height:6, borderRadius:3, background:i<qi?'#22C55E':i===qi?C.bg:'#F1F5F9' }}/>
            ))}
          </div>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:18 }}>{score}</p>
        </div>

        <div style={{ background:`linear-gradient(135deg,${C.dark},${C.bg})`, borderRadius:22, padding:26, marginBottom:18, textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginBottom:6 }}>Q {qi+1}/{qs.length}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:'clamp(16px,3vw,22px)', lineHeight:1.5 }}>{q?.q}</p>
          {lastOk===true  && <p style={{ color:'#4ADE80', fontWeight:700, marginTop:8 }}>✓ Correct! {streak>=2?'🔥':''}</p>}
          {lastOk===false && <p style={{ color:'#FCA5A5', fontWeight:700, marginTop:8 }}>✗ → {q?.options?.[q?.ans]}</p>}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {q?.options?.map((opt,i)=>{
            const right = chosen!==null && i===q.ans
            const wrong = chosen===i && i!==q.ans
            return (
              <button key={i} onClick={()=>pick(i)} disabled={chosen!==null}
                style={{ padding:'16px 10px', borderRadius:16, border:'none', cursor:chosen!==null?'not-allowed':'pointer',
                  background:right?'#22C55E':wrong?'#EF4444':'#fff',
                  color:right||wrong?'#fff':'#1E293B',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:'clamp(13px,2vw,15px)',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.06)', transition:'all 0.15s', textAlign:'left', lineHeight:1.4 }}>
                <span style={{ opacity:0.5, marginRight:6 }}>{['A','B','C','D'][i]}.</span>{opt}
              </button>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
