// FILE: src/pages/games/NumberSeries.jsx
// TryIT — Number Series: pattern completion, 75 seconds
// Route: /games/number-series
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useGameEntry, getComboMultiplier, triggerHaptic } from '../../lib/gameEngine'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

function genSeries(){
  const types=['arith','geo','square','fib','alt']
  const type=types[Math.floor(Math.random()*types.length)]
  let series=[],answer,next

  if(type==='arith'){
    const start=Math.floor(Math.random()*10)+1, diff=Math.floor(Math.random()*8)+2
    series=[0,1,2,3].map(i=>start+i*diff); answer=start+4*diff
  }else if(type==='geo'){
    const start=Math.floor(Math.random()*3)+2, ratio=2
    series=[0,1,2,3].map(i=>start*Math.pow(ratio,i)); answer=start*Math.pow(ratio,4)
  }else if(type==='square'){
    const start=Math.floor(Math.random()*5)+2
    series=[0,1,2,3].map(i=>(start+i)*(start+i)); answer=(start+4)*(start+4)
  }else if(type==='fib'){
    let a=Math.floor(Math.random()*3)+1,b=Math.floor(Math.random()*3)+2
    series=[a,b]; for(let i=0;i<2;i++){const c=series[series.length-1]+series[series.length-2];series.push(c)}
    answer=series[series.length-1]+series[series.length-2]
  }else{
    const start=Math.floor(Math.random()*10)+1,diff1=Math.floor(Math.random()*5)+2,diff2=Math.floor(Math.random()*3)+1
    series=[start,start+diff1,start+diff1-diff2,start+2*diff1-diff2]
    answer=series[3]+diff1
  }

  const wrongs=new Set()
  while(wrongs.size<3){
    const delta=Math.floor(Math.random()*10)-5
    const w=answer+(delta===0?1:delta)
    if(w!==answer&&w>0) wrongs.add(w)
  }
  const options=[answer,...wrongs].sort(()=>Math.random()-0.5)
  return { series, options, correct:options.indexOf(answer) }
}

export default function NumberSeries(){
  const navigate=useNavigate()
  const { user, coins, spendCoins, addCoins } = useAuth()
  const [questions]=useState(()=>Array.from({length:12},genSeries))
  const [phase,setPhase]=useState('ready')
  const [idx,setIdx]=useState(0)
  const [selected,setSelected]=useState(null)
  const [score,setScore]=useState(0)
  const [correct,setCorrect]=useState(0)
  const [wrong,setWrong]=useState(0)
  const [streak,setStreak]=useState(0)
  const [bestStreak,setBestStreak]=useState(0)
  const [timeLeft,setTimeLeft]=useState(75)

  const entry=useGameEntry('number_series',{coins,spendCoins,addCoins})
  const q=questions[idx]
  const combo=getComboMultiplier(streak)

  useEffect(()=>{
    if(phase!=='playing')return
    const t=setInterval(()=>setTimeLeft(p=>{ if(p<=1){clearInterval(t);finish();return 0} return p-1 }),1000)
    return()=>clearInterval(t)
  },[phase])

  const start=async()=>{
    const paid=await entry.payEntry()
    if(!paid && entry.economy?.entryCost>0){ navigate('/wallet'); return }
    setPhase('playing'); setIdx(0); setScore(0); setCorrect(0); setWrong(0); setStreak(0); setBestStreak(0); setTimeLeft(75)
  }

  const finish=async()=>{
    setPhase('done')
    await entry.settleResult(correct > questions.length/2 ? 'win' : 'loss')
  }

  const handleAnswer=(optIdx)=>{
    if(selected!==null)return
    setSelected(optIdx)
    const isCorrect=optIdx===q.correct
    if(isCorrect){
      const ns=streak+1; const{mult}=getComboMultiplier(ns)
      setStreak(ns); setBestStreak(b=>Math.max(b,ns)); setScore(s=>s+Math.round(12*mult)); setCorrect(c=>c+1)
      triggerHaptic('success')
    }else{ setStreak(0); setWrong(w=>w+1); triggerHaptic('wrong') }
    setTimeout(()=>{
      setSelected(null)
      if(idx+1>=questions.length) finish()
      else setIdx(i=>i+1)
    },500)
  }

  if(phase==='done') return(
    <GameResultScreen gameId="number_series" gameName="Number Series" gameEmoji="🔢"
      score={score} maxPossible={questions.length*36} correct={correct} wrong={wrong}
      bestStreak={bestStreak} totalQuestions={questions.length} onPlayAgain={()=>setPhase('ready')}/>
  )

  if(phase==='ready') return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0891B2,#0E7490)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>🔢</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 8px'}}>Number Series</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:8,lineHeight:1.7}}>What comes next in the pattern?<br/>12 series · 75 seconds</p>
      {entry.economy?.entryCost>0 && <p style={{fontSize:12,color:GOLD,marginBottom:20}}>Entry: {entry.economy.entryCost}🪙 · Win: +{entry.economy.winReward}🪙</p>}
      <button onClick={start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff'}}>
      {streak>=3 && combo.label && (
        <div style={{position:'fixed',top:'30%',left:'50%',transform:'translate(-50%,-50%)',zIndex:200,textAlign:'center'}}>
          <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:18,color:combo.color}}>{combo.label}</p>
        </div>
      )}
      <div style={{background:'#0891B2',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{idx+1}/{questions.length}</p>
          <p style={{fontFamily:'monospace',fontWeight:900,fontSize:20,color:timeLeft<=15?'#FCA5A5':GOLD}}>⏱ {timeLeft}s</p>
          <p style={{fontSize:13,fontWeight:800,color:GOLD}}>{score} pts</p>
        </div>
      </div>
      <div style={{padding:'30px 20px',maxWidth:480,margin:'0 auto',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'center',gap:10,marginBottom:8,flexWrap:'wrap'}}>
          {q.series.map((n,i)=>(
            <div key={i} style={{width:56,height:56,borderRadius:14,background:'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18}}>{n}</div>
          ))}
          <div style={{width:56,height:56,borderRadius:14,background:`${GOLD}22`,border:`2px dashed ${GOLD}`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,color:GOLD}}>?</div>
        </div>
        <p style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:24}}>Find the next number</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {q.options.map((opt,oi)=>{
            const isSelected=selected===oi, isCorrect=oi===q.correct
            let bg='rgba(255,255,255,0.06)',border='rgba(255,255,255,0.12)'
            if(selected!==null){ if(isCorrect){bg='rgba(34,197,94,0.25)';border='#22C55E'} else if(isSelected){bg='rgba(239,68,68,0.25)';border='#EF4444'} }
            return(
              <button key={oi} onClick={()=>handleAnswer(oi)} disabled={selected!==null}
                style={{padding:'20px',borderRadius:16,border:`2px solid ${border}`,background:bg,color:'#fff',fontSize:22,fontWeight:800,cursor:selected===null?'pointer':'default'}}>
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}