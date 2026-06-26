// FILE: src/pages/games/MemoryMatch.jsx
// TryIT — Memory Match: flip-card pairs of GK facts/formulas, 90 seconds
// Route: /games/memory-match
// Trains long-term retention — directly helps recall static GK & formulas in exam
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { triggerHaptic } from '../../lib/gameEngine'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const PAIRS=[
  ['RBI Founded','1935'],['Article 370','J&K Special Status'],['Speed Formula','Distance/Time'],
  ['First PM of India','Nehru'],['CI Formula','P(1+r/100)ⁿ - P'],['Largest State','Rajasthan'],
  ['Article 21','Right to Life'],['Longest River','Ganga'],['Area of Circle','πr²'],
  ['First President','Rajendra Prasad'],['Capital of Karnataka','Bengaluru'],['SI Formula','PRT/100'],
]

function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a }

export default function MemoryMatch(){
  const navigate=useNavigate()
  const [phase,setPhase]=useState('ready')
  const [cards,setCards]=useState([])
  const [flipped,setFlipped]=useState([])
  const [matched,setMatched]=useState([])
  const [moves,setMoves]=useState(0)
  const [timeLeft,setTimeLeft]=useState(90)
  const [score,setScore]=useState(0)
  const [bestStreak,setBestStreak]=useState(0)
  const [streak,setStreak]=useState(0)

  const start=()=>{
    const selected=shuffle(PAIRS).slice(0,6)
    const deck=shuffle(selected.flatMap((p,i)=>[{id:`${i}a`,pairId:i,text:p[0]},{id:`${i}b`,pairId:i,text:p[1]}]))
    setCards(deck); setFlipped([]); setMatched([]); setMoves(0); setTimeLeft(90); setScore(0); setStreak(0); setBestStreak(0)
    setPhase('playing')
  }

  useEffect(()=>{
    if(phase!=='playing')return
    const t=setInterval(()=>setTimeLeft(p=>{ if(p<=1){clearInterval(t); setPhase('done'); return 0} return p-1 }),1000)
    return()=>clearInterval(t)
  },[phase])

  useEffect(()=>{
    if(matched.length>0 && matched.length===cards.length){ setPhase('done') }
  },[matched,cards])

  const handleFlip=(card)=>{
    if(flipped.length===2||flipped.find(f=>f.id===card.id)||matched.includes(card.pairId))return
    const newFlipped=[...flipped,card]
    setFlipped(newFlipped)
    if(newFlipped.length===2){
      setMoves(m=>m+1)
      if(newFlipped[0].pairId===newFlipped[1].pairId){
        const newStreak=streak+1
        setStreak(newStreak); setBestStreak(b=>Math.max(b,newStreak))
        setScore(s=>s+(20*Math.min(newStreak,3)))
        triggerHaptic('success')
        setTimeout(()=>{ setMatched(m=>[...m,newFlipped[0].pairId]); setFlipped([]) },500)
      }else{
        setStreak(0); triggerHaptic('wrong')
        setTimeout(()=>setFlipped([]),800)
      }
    }
  }

  if(phase==='done') return(
    <GameResultScreen gameId="memory_match" gameName="Memory Match" gameEmoji="🧠"
      score={score} maxPossible={6*60} correct={matched.length} wrong={moves-matched.length}
      bestStreak={bestStreak} totalQuestions={6} onPlayAgain={start}/>
  )

  if(phase==='ready') return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0891B2,#0E7490)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>🧠</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 8px'}}>Memory Match</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:24,lineHeight:1.7}}>Match GK facts & formulas with their answers<br/>12 cards · 90 seconds · Trains long-term recall!</p>
      <button onClick={start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff'}}>
      <div style={{background:'#0891B2',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <p style={{fontSize:13,fontWeight:700}}>Moves: {moves}</p>
          <p style={{fontFamily:'monospace',fontWeight:900,fontSize:20,color:timeLeft<=20?'#EF4444':GOLD}}>⏱ {timeLeft}s</p>
          <p style={{fontSize:13,fontWeight:800,color:GOLD}}>{score} pts</p>
        </div>
      </div>
      <div style={{padding:16,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,maxWidth:480,margin:'0 auto'}}>
        {cards.map(card=>{
          const isFlipped=flipped.find(f=>f.id===card.id)||matched.includes(card.pairId)
          const isMatched=matched.includes(card.pairId)
          return(
            <button key={card.id} onClick={()=>handleFlip(card)}
              style={{aspectRatio:'1',borderRadius:12,border:`2px solid ${isMatched?'#22C55E':isFlipped?GOLD:'rgba(255,255,255,0.20)'}`,
                background:isMatched?'rgba(34,197,94,0.15)':isFlipped?'rgba(201,168,76,0.15)':'rgba(255,255,255,0.05)',
                display:'flex',alignItems:'center',justifyContent:'center',padding:6,cursor:'pointer'}}>
              {isFlipped?(
                <p style={{fontSize:10,fontWeight:700,textAlign:'center',color:isMatched?'#86EFAC':'#fff',lineHeight:1.3}}>{card.text}</p>
              ):(
                <p style={{fontSize:24}}>❓</p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}