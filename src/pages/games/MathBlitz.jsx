// FILE: src/pages/games/MathBlitz.jsx
// TryIT — Math Blitz: 20 speed arithmetic questions, 90 seconds
// Route: /games/math-blitz
// Trains mental calculation speed — directly improves Quant section timing
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameSession, getComboMultiplier } from '../../lib/gameEngine'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

// Generate exam-relevant arithmetic (percentage, ratio, simplification — not random junk)
function generateQuestion(){
  const types=['percent','simplify','square','multiply','divide','ratio']
  const type=types[Math.floor(Math.random()*types.length)]
  let q,answer,options

  if(type==='percent'){
    const base=[100,200,150,250,400,500][Math.floor(Math.random()*6)]
    const pct=[10,20,25,30,40,50][Math.floor(Math.random()*6)]
    answer=(base*pct)/100
    q=`${pct}% of ${base} = ?`
  } else if(type==='simplify'){
    const a=Math.floor(Math.random()*20)+5
    const b=Math.floor(Math.random()*20)+5
    answer=a+b
    q=`${a} + ${b} = ?`
  } else if(type==='square'){
    const n=Math.floor(Math.random()*15)+2
    answer=n*n
    q=`${n}² = ?`
  } else if(type==='multiply'){
    const a=Math.floor(Math.random()*12)+2
    const b=Math.floor(Math.random()*12)+2
    answer=a*b
    q=`${a} × ${b} = ?`
  } else if(type==='divide'){
    const b=Math.floor(Math.random()*10)+2
    const answer_=Math.floor(Math.random()*15)+2
    const a=b*answer_
    answer=answer_
    q=`${a} ÷ ${b} = ?`
  } else {
    const a=Math.floor(Math.random()*8)+2
    const mult=Math.floor(Math.random()*5)+2
    answer=a*mult
    q=`If a:b = ${a}:1, and a=${a*mult}, find b×${mult}`
    answer=mult*mult
  }

  // Generate 3 wrong options close to the answer
  const wrongs=new Set()
  while(wrongs.size<3){
    const delta=Math.floor(Math.random()*10)-5
    const wrong=answer+ (delta===0?1:delta)
    if(wrong!==answer && wrong>=0) wrongs.add(wrong)
  }
  options=[answer,...wrongs].sort(()=>Math.random()-0.5)

  return { question:q, options, correct:options.indexOf(answer) }
}

export default function MathBlitz(){
  const navigate=useNavigate()
  const [questions]=useState(()=>Array.from({length:20},generateQuestion))
  const [selected,setSelected]=useState(null)
  const [showResult,setShowResult]=useState(false)

  const game=useGameSession({ totalQuestions:questions.length, duration:90 })
  const q=questions[game.currentIdx]
  const combo=getComboMultiplier(game.streak)

  const handleAnswer=(idx)=>{
    if(selected!==null)return
    setSelected(idx)
    const isCorrect=idx===q.correct
    setTimeout(()=>{ game.answer(isCorrect,8); setSelected(null) },400)
  }

  useEffect(()=>{ if(game.phase==='done') setShowResult(true) },[game.phase])

  if(showResult) return (
    <GameResultScreen gameId="math_blitz" gameName="Math Blitz" gameEmoji="➗"
      score={game.score} maxPossible={questions.length*24} correct={game.correct}
      wrong={game.wrong} bestStreak={game.bestStreak} totalQuestions={questions.length}
      onPlayAgain={()=>{setShowResult(false);game.start()}}/>
  )

  if(game.phase==='ready') return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,#7C3AED,#6D28D9)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>➗</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 8px'}}>Math Blitz</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:24,lineHeight:1.7}}>20 speed arithmetic questions · 90 seconds<br/>Trains your Quant section speed for real exams!</p>
      <button onClick={game.start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff',position:'relative'}}>
      {game.showCombo&&(
        <div style={{position:'fixed',top:'30%',left:'50%',transform:'translate(-50%,-50%)',zIndex:200,textAlign:'center',animation:'popIn 0.4s'}}>
          <p style={{fontSize:48}}>⚡</p>
          <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:20,color:combo.color}}>{combo.label}</p>
        </div>
      )}

      <div style={{background:'#7C3AED',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{game.currentIdx+1}/{questions.length}</p>
          <p style={{fontFamily:'monospace',fontWeight:900,fontSize:20,color:game.timeLeft<=15?'#EF4444':GOLD}}>⏱ {game.timeLeft}s</p>
          <p style={{fontSize:13,fontWeight:800,color:GOLD}}>{game.score} pts</p>
        </div>
        <div style={{height:4,background:'rgba(255,255,255,0.2)',borderRadius:99,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${(game.currentIdx/questions.length)*100}%`,background:GOLD}}/>
        </div>
        {game.streak>=2&&<p style={{fontSize:11,color:combo.color,fontWeight:700,marginTop:6,textAlign:'center'}}>{combo.label} · {combo.mult}x multiplier</p>}
      </div>

      {q&&(
        <div style={{padding:'40px 20px',maxWidth:480,margin:'0 auto',textAlign:'center'}}>
          <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:32,margin:'0 0 32px'}}>{q.question}</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {q.options.map((opt,idx)=>{
              const isSelected=selected===idx
              const isCorrect=idx===q.correct
              let bg='rgba(255,255,255,0.06)',border='rgba(255,255,255,0.12)'
              if(selected!==null){
                if(isCorrect){bg='rgba(34,197,94,0.25)';border='#22C55E'}
                else if(isSelected){bg='rgba(239,68,68,0.25)';border='#EF4444'}
              }
              return(
                <button key={idx} onClick={()=>handleAnswer(idx)} disabled={selected!==null}
                  style={{padding:'24px',borderRadius:16,border:`2px solid ${border}`,background:bg,color:'#fff',fontSize:24,fontWeight:800,cursor:selected===null?'pointer':'default'}}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )}
      <style>{`@keyframes popIn{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0}60%{transform:translate(-50%,-50%) scale(1.15)}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}`}</style>
    </div>
  )
}