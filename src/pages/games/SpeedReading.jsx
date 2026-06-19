// FILE: src/pages/games/SpeedReading.jsx
// TryIT — Speed Reading Sprint: RC passages under timer, 100 seconds
// Route: /games/speed-reading
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { useGameEntry, triggerHaptic } from '../../lib/gameEngine'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const MOCK_PASSAGE={
  text:`India's Green Revolution in the 1960s transformed the country from a food-deficit nation to a self-sufficient one. Led by agricultural scientist M.S. Swaminathan, the initiative introduced high-yield variety seeds, modern irrigation, and fertilizers. While it boosted wheat and rice production dramatically in states like Punjab and Haryana, critics note it also led to groundwater depletion and reduced crop diversity in subsequent decades.`,
  questions:[
    {q:'Who led the Green Revolution in India?',options:['Norman Borlaug','M.S. Swaminathan','Verghese Kurien','C. Subramaniam'],correct:1},
    {q:'Which states benefited most from the Green Revolution?',options:['Tamil Nadu, Kerala','Punjab, Haryana','West Bengal, Odisha','Gujarat, Maharashtra'],correct:1},
    {q:'What was a negative side-effect mentioned?',options:['Higher prices','Groundwater depletion','Labour shortage','Export ban'],correct:1},
  ]
}

export default function SpeedReading(){
  const navigate=useNavigate()
  const { user, coins, spendCoins, addCoins } = useAuth()
  const [passage,setPassage]=useState(MOCK_PASSAGE)
  const [phase,setPhase]=useState('ready')  // ready|reading|questions|done
  const [readTime,setReadTime]=useState(40)
  const [qIdx,setQIdx]=useState(0)
  const [selected,setSelected]=useState(null)
  const [score,setScore]=useState(0)
  const [correct,setCorrect]=useState(0)
  const [wrong,setWrong]=useState(0)

  const entry=useGameEntry('speed_reading',{coins,spendCoins,addCoins})

  useEffect(()=>{
    if(phase!=='reading')return
    const t=setInterval(()=>setReadTime(p=>{ if(p<=1){clearInterval(t);setPhase('questions');return 0} return p-1 }),1000)
    return()=>clearInterval(t)
  },[phase])

  const start=async()=>{
    const paid=await entry.payEntry()
    if(!paid && entry.economy?.entryCost>0){ navigate('/wallet'); return }
    setPhase('reading'); setReadTime(40); setQIdx(0); setScore(0); setCorrect(0); setWrong(0)
  }

  const finish=async()=>{
    setPhase('done')
    await entry.settleResult(correct >= 2 ? 'win' : 'loss')
  }

  const handleAnswer=(idx)=>{
    if(selected!==null)return
    setSelected(idx)
    const q=passage.questions[qIdx]
    const isCorrect=idx===q.correct
    if(isCorrect){ setScore(s=>s+25); setCorrect(c=>c+1); triggerHaptic('success') }
    else{ setWrong(w=>w+1); triggerHaptic('wrong') }
    setTimeout(()=>{
      setSelected(null)
      if(qIdx+1>=passage.questions.length) finish()
      else setQIdx(i=>i+1)
    },600)
  }

  if(phase==='done') return(
    <GameResultScreen gameId="speed_reading" gameName="Speed Reading" gameEmoji="📖"
      score={score} maxPossible={passage.questions.length*25} correct={correct} wrong={wrong}
      bestStreak={correct} totalQuestions={passage.questions.length} onPlayAgain={()=>setPhase('ready')}/>
  )

  if(phase==='ready') return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#059669,#047857)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>📖</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 8px'}}>Speed Reading Sprint</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:8,lineHeight:1.7}}>Read a passage in 40 seconds<br/>Then answer 3 comprehension questions fast!</p>
      {entry.economy?.entryCost>0 && <p style={{fontSize:12,color:GOLD,marginBottom:20}}>Entry: {entry.economy.entryCost}🪙 · Win: +{entry.economy.winReward}🪙</p>}
      <button onClick={start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  if(phase==='reading') return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff'}}>
      <div style={{background:'#059669',padding:'14px 16px',textAlign:'center'}}>
        <p style={{fontFamily:'monospace',fontWeight:900,fontSize:28,color:readTime<=10?'#FCA5A5':GOLD}}>⏱ {readTime}s</p>
        <p style={{fontSize:11,color:'rgba(255,255,255,0.7)'}}>Read carefully — questions come next!</p>
      </div>
      <div style={{padding:24,maxWidth:480,margin:'0 auto'}}>
        <p style={{fontSize:16,lineHeight:2,color:'#E2E8F0'}}>{passage.text}</p>
      </div>
    </div>
  )

  const q=passage.questions[qIdx]
  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff'}}>
      <div style={{background:'#059669',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{qIdx+1}/{passage.questions.length}</p>
          <p style={{fontSize:13,fontWeight:800,color:GOLD}}>{score} pts</p>
        </div>
      </div>
      <div style={{padding:20,maxWidth:480,margin:'0 auto'}}>
        <p style={{fontSize:16,fontWeight:700,margin:'14px 0 20px',lineHeight:1.6}}>{q.q}</p>
        {q.options.map((opt,oi)=>{
          const isSelected=selected===oi, isCorrect=oi===q.correct
          let bg='rgba(255,255,255,0.05)',border='rgba(255,255,255,0.1)'
          if(selected!==null){ if(isCorrect){bg='rgba(34,197,94,0.2)';border='#22C55E'} else if(isSelected){bg='rgba(239,68,68,0.2)';border='#EF4444'} }
          return(
            <button key={oi} onClick={()=>handleAnswer(oi)} disabled={selected!==null}
              style={{display:'block',width:'100%',padding:'14px 16px',marginBottom:10,borderRadius:14,border:`2px solid ${border}`,background:bg,color:'#fff',fontSize:14,textAlign:'left',cursor:selected===null?'pointer':'default'}}>
              {opt} {selected!==null&&isCorrect&&' ✅'}
            </button>
          )
        })}
      </div>
    </div>
  )
}