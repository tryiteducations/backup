// FILE: src/pages/games/SportsMastery.jsx
// TryIT — Sports Mastery: 360° sports GK (players, trophies, Olympics, records, rules)
// Route: /games/sports-mastery
// Widest exam audience — Sports GK appears in SSC, Banking, Railways, State PSC every year
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { useGameEntry, getComboMultiplier, triggerHaptic } from '../../lib/gameEngine'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const CATEGORIES=[
  {id:'all',label:'All',emoji:'🏆'},{id:'cricket',label:'Cricket',emoji:'🏏'},
  {id:'football',label:'Football',emoji:'⚽'},{id:'badminton',label:'Badminton',emoji:'🏸'},
  {id:'athletics',label:'Athletics',emoji:'🏃'},{id:'olympics',label:'Olympics',emoji:'🥇'},
  {id:'awards',label:'Awards',emoji:'🏅'},
]

const MOCK_Q=[
  {q:'Who holds the record for most ODI centuries?',options:['Virat Kohli','Sachin Tendulkar','Rohit Sharma','Ricky Ponting'],correct:1,cat:'cricket'},
  {q:'Which IPL team won the 2023 title?',options:['CSK','MI','GT','RCB'],correct:0,cat:'cricket'},
  {q:'The Davis Cup is associated with which sport?',options:['Tennis','Golf','Cricket','Hockey'],correct:0,cat:'athletics'},
  {q:'How many gold medals did India win at Tokyo Olympics 2020?',options:['0','1','2','3'],correct:1,cat:'olympics'},
  {q:'Eden Gardens stadium is located in which city?',options:['Mumbai','Delhi','Kolkata','Chennai'],correct:2,cat:'cricket'},
  {q:'Khel Ratna is India\'s highest sporting honour — True or False?',options:['True','False'],correct:0,cat:'awards'},
  {q:'How many players are in a Kabaddi team on the field?',options:['5','6','7','8'],correct:2,cat:'athletics'},
  {q:'Where will the 2028 Summer Olympics be held?',options:['Paris','Tokyo','Los Angeles','Brisbane'],correct:2,cat:'olympics'},
  {q:'Who won the Ballon d\'Or in football most times?',options:['Ronaldo','Messi','Pele','Maradona'],correct:1,cat:'football'},
  {q:'P.V. Sindhu has won medals in which sport?',options:['Tennis','Badminton','Boxing','Wrestling'],correct:1,cat:'badminton'},
  {q:'The Arjuna Award is given for which achievement?',options:['Film','Sports','Literature','Science'],correct:1,cat:'awards'},
  {q:'Usain Bolt is famous for which event?',options:['Marathon','100m Sprint','Long Jump','Javelin'],correct:1,cat:'athletics'},
]

export default function SportsMastery(){
  const navigate=useNavigate()
  const { user, coins, spendCoins, addCoins } = useAuth()
  const [allQuestions,setAllQuestions]=useState(MOCK_Q)
  const [category,setCategory]=useState('all')
  const [questions,setQuestions]=useState(MOCK_Q)
  const [phase,setPhase]=useState('ready')
  const [idx,setIdx]=useState(0)
  const [selected,setSelected]=useState(null)
  const [score,setScore]=useState(0)
  const [correct,setCorrect]=useState(0)
  const [wrong,setWrong]=useState(0)
  const [streak,setStreak]=useState(0)
  const [bestStreak,setBestStreak]=useState(0)
  const [timeLeft,setTimeLeft]=useState(75)

  const entry=useGameEntry('sports_mastery',{coins,spendCoins,addCoins})

  useEffect(()=>{
    supabase.from('question_bank').select('q_id,question_text,options,correct_answer,topic_code')
      .eq('subject','sports').eq('admin_approved',true).limit(60)
      .then(({data})=>{
        if(data?.length>=10){
          setAllQuestions(data.map(q=>{
            const opts=Object.values(q.options||{})
            const correctIdx=Object.keys(q.options||{}).indexOf(q.correct_answer)
            return {q:q.question_text,options:opts,correct:correctIdx,cat:(q.topic_code||'').toLowerCase()}
          }))
        }
      }).catch(()=>{})
  },[])

  useEffect(()=>{
    const filtered = category==='all' ? allQuestions : allQuestions.filter(q=>q.cat===category)
    setQuestions(filtered.length>=6 ? [...filtered].sort(()=>Math.random()-0.5).slice(0,12) : [...allQuestions].sort(()=>Math.random()-0.5).slice(0,12))
  },[category,allQuestions])

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
    setPhase('playing'); setIdx(0); setScore(0); setCorrect(0); setWrong(0); setStreak(0); setBestStreak(0); setTimeLeft(75)
  }

  const finish=async()=>{
    setPhase('done')
    await entry.settleResult(correct > questions.length/2 ? 'win' : 'loss')
  }

  const handleAnswer=(oi)=>{
    if(selected!==null)return
    setSelected(oi)
    const isCorrect=oi===q.correct
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
    <GameResultScreen gameId="sports_mastery" gameName="Sports Mastery" gameEmoji="🏆"
      score={score} maxPossible={questions.length*45} correct={correct} wrong={wrong}
      bestStreak={bestStreak} totalQuestions={questions.length} onPlayAgain={()=>setPhase('ready')}/>
  )

  if(phase==='ready') return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#EA580C,#C2410C)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>🏆</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 8px'}}>Sports Mastery</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:16,lineHeight:1.7}}>Players · Trophies · Olympics · Records · Awards<br/>The widest-covered sports GK in any exam app</p>

      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:20,maxWidth:340}}>
        {CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>setCategory(c.id)}
            style={{padding:'6px 12px',borderRadius:99,border:'none',cursor:'pointer',fontSize:11,fontWeight:700,
              background:category===c.id?'#fff':'rgba(255,255,255,0.15)',color:category===c.id?'#C2410C':'#fff'}}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {entry.economy?.entryCost>0 && <p style={{fontSize:12,color:GOLD,marginBottom:16}}>Entry: {entry.economy.entryCost}🪙 · Win: +{entry.economy.winReward}🪙</p>}
      <button onClick={start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff'}}>
      <div style={{background:'#EA580C',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{idx+1}/{questions.length}</p>
          <p style={{fontFamily:'monospace',fontWeight:900,fontSize:20,color:timeLeft<=15?'#FED7AA':'#fff'}}>⏱ {timeLeft}s</p>
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