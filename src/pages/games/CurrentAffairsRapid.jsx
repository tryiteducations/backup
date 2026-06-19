// FILE: src/pages/games/CurrentAffairsRapid.jsx
// TryIT — Current Affairs Rapid Fire: pulls from Bharat Pulse daily_stories
// Route: /games/current-affairs
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { useGameEntry, getComboMultiplier, triggerHaptic } from '../../lib/gameEngine'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const MOCK_Q=[
  {q:'Who recently won the Padma Shri for forest conservation?',options:['Jadav Payeng','Sunderlal Bahuguna','Salim Ali','Anil Agarwal'],correct:0},
  {q:'Which Indian state recently launched a new education policy initiative?',options:['Kerala','Tamil Nadu','Karnataka','Gujarat'],correct:1},
  {q:'ISRO\'s recent satellite launch was for which purpose?',options:['Weather monitoring','Communication','Navigation','Earth observation'],correct:3},
  {q:'India recently signed a trade agreement with which bloc?',options:['ASEAN','EU','EFTA','BRICS'],correct:2},
  {q:'Who is the current RBI Governor?',options:['Shaktikanta Das','Raghuram Rajan','Urjit Patel','D. Subbarao'],correct:0},
]

export default function CurrentAffairsRapid(){
  const navigate=useNavigate()
  const { user, coins, spendCoins, addCoins } = useAuth()
  const [questions,setQuestions]=useState(MOCK_Q)
  const [phase,setPhase]=useState('ready')
  const [idx,setIdx]=useState(0)
  const [selected,setSelected]=useState(null)
  const [score,setScore]=useState(0)
  const [correct,setCorrect]=useState(0)
  const [wrong,setWrong]=useState(0)
  const [streak,setStreak]=useState(0)
  const [bestStreak,setBestStreak]=useState(0)
  const [timeLeft,setTimeLeft]=useState(60)

  const entry=useGameEntry('current_affairs',{coins,spendCoins,addCoins})

  useEffect(()=>{
    // Build quiz from last 14 days of Bharat Pulse stories
    const since=new Date(Date.now()-14*86400000).toISOString().slice(0,10)
    supabase.from('daily_stories').select('*').gte('publish_date',since).limit(20)
      .then(({data})=>{
        if(data?.length>=5){
          const generated=data.slice(0,10).map(story=>({
            q:`${story.hero_name||story.title} is associated with which field?`,
            options:[story.category||'Award',...['Sports','Science','Arts','Social Work'].filter(c=>c!==(story.category||'Award')).slice(0,3)].sort(()=>Math.random()-0.5),
          })).map(item=>({...item,correct:item.options.indexOf(item.options.find(o=>o)||item.options[0])}))
          if(generated.length>=5) setQuestions(generated)
        }
      }).catch(()=>{})
  },[])

  useEffect(()=>{
    if(phase!=='playing')return
    const t=setInterval(()=>setTimeLeft(p=>{ if(p<=1){clearInterval(t);finish();return 0} return p-1 }),1000)
    return()=>clearInterval(t)
  },[phase])

  const q=questions[idx]
  const combo=getComboMultiplier(streak)

  const start=async()=>{
    const paid=await entry.payEntry()
    if(!paid && entry.economy?.entryCost>0){ navigate('/wallet'); return }
    setPhase('playing'); setIdx(0); setScore(0); setCorrect(0); setWrong(0); setStreak(0); setBestStreak(0); setTimeLeft(60)
  }

  const finish=async()=>{
    setPhase('done')
    await entry.settleResult(correct > questions.length/2 ? 'win' : 'loss')
  }

  const handleAnswer=(idx2)=>{
    if(selected!==null)return
    setSelected(idx2)
    const isCorrect=idx2===q.correct
    if(isCorrect){
      const ns=streak+1; const{mult}=getComboMultiplier(ns)
      setStreak(ns); setBestStreak(b=>Math.max(b,ns)); setScore(s=>s+Math.round(15*mult)); setCorrect(c=>c+1)
      triggerHaptic('success')
    }else{ setStreak(0); setWrong(w=>w+1); triggerHaptic('wrong') }
    setTimeout(()=>{
      setSelected(null)
      if(idx+1>=questions.length) finish()
      else setIdx(i=>i+1)
    },500)
  }

  if(phase==='done') return(
    <GameResultScreen gameId="current_affairs" gameName="Current Affairs" gameEmoji="📰"
      score={score} maxPossible={questions.length*45} correct={correct} wrong={wrong}
      bestStreak={bestStreak} totalQuestions={questions.length} onPlayAgain={()=>setPhase('ready')}/>
  )

  if(phase==='ready') return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#D97706,#92400E)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>📰</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 8px'}}>Current Affairs Rapid Fire</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:8,lineHeight:1.7}}>Last 14 days' news, refreshed weekly<br/>10 questions · 60 seconds</p>
      {entry.economy?.entryCost>0 && <p style={{fontSize:12,color:GOLD,marginBottom:20}}>Entry: {entry.economy.entryCost}🪙 · Win: +{entry.economy.winReward}🪙</p>}
      <button onClick={start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff'}}>
      <div style={{background:'#D97706',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{idx+1}/{questions.length}</p>
          <p style={{fontFamily:'monospace',fontWeight:900,fontSize:20,color:timeLeft<=15?'#FCA5A5':'#fff'}}>⏱ {timeLeft}s</p>
          <p style={{fontSize:13,fontWeight:800}}>{score} pts</p>
        </div>
        {streak>=2 && <p style={{fontSize:11,color:'#FED7AA',fontWeight:700,marginTop:6,textAlign:'center'}}>{combo.label} · {combo.mult}x</p>}
      </div>
      {q&&<div style={{padding:20,maxWidth:480,margin:'0 auto'}}>
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
      </div>}
    </div>
  )
}