// FILE: src/pages/games/Battle.jsx
// TryIT — 1v1 Battle: live duel vs random student, 10 questions
// Route: /games/battle
// Mixed subject — highest dopamine game (real opponent, live race)
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { triggerHaptic } from '../../lib/gameEngine'

const NAVY='#1E3A5F', GOLD='#C9A84C', GREEN='#059669'

const MOCK_Q=[
  {q:'30% of 250 = ?',options:['65','70','75','80'],correct:2,subject:'Quant'},
  {q:'Synonym of "RESILIENT"',options:['Fragile','Tough','Weak','Soft'],correct:1,subject:'English'},
  {q:'Who is known as Father of Indian Constitution?',options:['Gandhi','Nehru','Ambedkar','Patel'],correct:2,subject:'GK'},
  {q:'A:B = 2:3, B:C = 4:5. Find A:C',options:['8:15','2:5','8:9','3:5'],correct:0,subject:'Reasoning'},
  {q:'Antonym of "GENEROUS"',options:['Kind','Stingy','Giving','Helpful'],correct:1,subject:'English'},
  {q:'12 × 13 = ?',options:['144','156','166','176'],correct:1,subject:'Quant'},
  {q:'First Indian satellite was named?',options:['Aryabhata','Bhaskara','Rohini','INSAT'],correct:0,subject:'GK'},
  {q:'If today is Monday, what day is 17 days later?',options:['Wednesday','Thursday','Friday','Saturday'],correct:1,subject:'Reasoning'},
  {q:'15² = ?',options:['215','225','235','245'],correct:1,subject:'Quant'},
  {q:'One word for "Study of birds"',options:['Ornithology','Entomology','Botany','Zoology'],correct:0,subject:'English'},
]

const SUBJECT_COLORS={Quant:'#1D4ED8',English:'#059669',GK:'#D97706',Reasoning:'#7C3AED'}

export default function Battle(){
  const navigate=useNavigate()
  const { user, addCoins } = useAuth()
  const [phase,setPhase]=useState('matching')  // matching|countdown|playing|done
  const [opponent,setOpponent]=useState(null)
  const [questions]=useState(MOCK_Q)
  const [idx,setIdx]=useState(0)
  const [myScore,setMyScore]=useState(0)
  const [oppScore,setOppScore]=useState(0)
  const [selected,setSelected]=useState(null)
  const [timeLeft,setTimeLeft]=useState(8)
  const [countdown,setCountdown]=useState(3)

  // Simulate matchmaking
  useEffect(()=>{
    const names=['Arjun K.','Priya S.','Ravi M.','Kavitha N.','Suresh B.']
    const states=['Tamil Nadu','Karnataka','Kerala','UP','Bihar']
    const t=setTimeout(()=>{
      setOpponent({ name:names[Math.floor(Math.random()*names.length)], state:states[Math.floor(Math.random()*states.length)] })
      setPhase('countdown')
    },2000)
    return()=>clearTimeout(t)
  },[])

  // Countdown 3-2-1
  useEffect(()=>{
    if(phase!=='countdown')return
    if(countdown<=0){ setPhase('playing'); return }
    const t=setTimeout(()=>setCountdown(c=>c-1),700)
    return()=>clearTimeout(t)
  },[phase,countdown])

  // Per-question timer
  useEffect(()=>{
    if(phase!=='playing')return
    setTimeLeft(8)
    const t=setInterval(()=>{
      setTimeLeft(prev=>{
        if(prev<=1){ clearInterval(t); handleAnswer(-1); return 0 }
        return prev-1
      })
    },1000)
    return()=>clearInterval(t)
  },[phase,idx])

  const handleAnswer=(optIdx)=>{
    if(selected!==null)return
    setSelected(optIdx)
    const q=questions[idx]
    const isCorrect=optIdx===q.correct

    // Simulate opponent (60% chance correct, random delay already passed)
    const oppCorrect=Math.random()<0.6

    if(isCorrect){ setMyScore(s=>s+1); triggerHaptic('success') }
    if(oppCorrect) setOppScore(s=>s+1)

    setTimeout(()=>{
      setSelected(null)
      if(idx+1>=questions.length){ setPhase('done') }
      else setIdx(i=>i+1)
    },800)
  }

  useEffect(()=>{
    if(phase!=='done')return
    const won=myScore>oppScore
    const coins=won?25:5
    addCoins?.(coins)
    triggerHaptic(won?'levelup':'wrong')
    try{ supabase.from('battle_history').insert({ user_id:user?.id, my_score:myScore, opp_score:oppScore, won, coins_earned:coins }) }catch{}
  },[phase])

  // MATCHING
  if(phase==='matching') return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,${NAVY},#0F2140)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:56,marginBottom:16,animation:'spin 2s linear infinite'}}>⚔️</p>
      <p style={{fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:18,marginBottom:8}}>Finding Opponent...</p>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Matching you with a student of similar level</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(15deg)}}`}</style>
    </div>
  )

  // COUNTDOWN
  if(phase==='countdown') return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,${NAVY},#0F2140)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24}}>
      <div style={{display:'flex',alignItems:'center',gap:30,marginBottom:40}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:60,height:60,borderRadius:'50%',background:`${GOLD}30`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:20,marginBottom:6}}>{(user?.name||'You')[0]}</div>
          <p style={{fontSize:12,fontWeight:700}}>You</p>
        </div>
        <p style={{fontSize:24,fontWeight:900,color:GOLD}}>VS</p>
        <div style={{textAlign:'center'}}>
          <div style={{width:60,height:60,borderRadius:'50%',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:20,marginBottom:6}}>{opponent?.name[0]}</div>
          <p style={{fontSize:12,fontWeight:700}}>{opponent?.name}</p>
          <p style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>{opponent?.state}</p>
        </div>
      </div>
      <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:64,color:GOLD}}>{countdown>0?countdown:'GO!'}</p>
    </div>
  )

  // DONE
  if(phase==='done'){
    const won=myScore>oppScore
    const tied=myScore===oppScore
    return(
      <div style={{minHeight:'100vh',background:`linear-gradient(160deg,${won?GREEN:NAVY},#0F2140)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
        <p style={{fontSize:64,marginBottom:8}}>{won?'🏆':tied?'🤝':'💪'}</p>
        <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:24,margin:'0 0 4px'}}>{won?'Victory!':tied?'Tied Match!':'Good Fight!'}</h1>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginBottom:24}}>vs {opponent?.name} from {opponent?.state}</p>

        <div style={{display:'flex',alignItems:'center',gap:24,marginBottom:28}}>
          <div style={{textAlign:'center'}}>
            <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:40,color:GOLD}}>{myScore}</p>
            <p style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>You</p>
          </div>
          <p style={{fontSize:20,color:'rgba(255,255,255,0.3)'}}>-</p>
          <div style={{textAlign:'center'}}>
            <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:40,color:'rgba(255,255,255,0.6)'}}>{oppScore}</p>
            <p style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>{opponent?.name}</p>
          </div>
        </div>

        <div style={{background:'rgba(255,255,255,0.1)',borderRadius:14,padding:'12px 24px',marginBottom:24}}>
          <p style={{fontSize:14,fontWeight:700}}>+{won?25:5}🪙 coins earned</p>
        </div>

        <div style={{display:'flex',gap:10,width:'100%',maxWidth:300}}>
          <button onClick={()=>window.location.reload()} style={{flex:1,padding:'14px',background:GOLD,color:NAVY,border:'none',borderRadius:14,fontWeight:800,cursor:'pointer'}}>⚔️ Battle Again</button>
          <button onClick={()=>navigate('/games')} style={{flex:1,padding:'14px',background:'rgba(255,255,255,0.1)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',borderRadius:14,fontWeight:700,cursor:'pointer'}}>Exit</button>
        </div>
      </div>
    )
  }

  // PLAYING
  const q=questions[idx]
  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff'}}>
      <div style={{background:NAVY,padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{textAlign:'center'}}>
            <p style={{fontWeight:800,fontSize:18,color:GOLD}}>{myScore}</p>
            <p style={{fontSize:9,color:'rgba(255,255,255,0.5)'}}>You</p>
          </div>
          <div style={{textAlign:'center'}}>
            <p style={{fontSize:11,fontWeight:700}}>Q{idx+1}/{questions.length}</p>
            <p style={{fontFamily:'monospace',fontWeight:900,fontSize:22,color:timeLeft<=3?'#EF4444':'#fff'}}>{timeLeft}s</p>
          </div>
          <div style={{textAlign:'center'}}>
            <p style={{fontWeight:800,fontSize:18,color:'rgba(255,255,255,0.6)'}}>{oppScore}</p>
            <p style={{fontSize:9,color:'rgba(255,255,255,0.5)'}}>{opponent?.name?.split(' ')[0]}</p>
          </div>
        </div>
        <div style={{height:4,background:'rgba(255,255,255,0.2)',borderRadius:99,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${(timeLeft/8)*100}%`,background:timeLeft<=3?'#EF4444':GOLD,transition:'width 1s linear'}}/>
        </div>
      </div>

      <div style={{padding:20,maxWidth:480,margin:'0 auto'}}>
        <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:99,background:`${SUBJECT_COLORS[q.subject]}33`,color:SUBJECT_COLORS[q.subject]}}>{q.subject}</span>
        <p style={{fontSize:18,fontWeight:700,margin:'14px 0 20px',lineHeight:1.5}}>{q.q}</p>
        {q.options.map((opt,oi)=>{
          const isSelected=selected===oi
          const isCorrect=oi===q.correct
          let bg='rgba(255,255,255,0.05)',border='rgba(255,255,255,0.1)'
          if(selected!==null){
            if(isCorrect){bg='rgba(34,197,94,0.2)';border='#22C55E'}
            else if(isSelected){bg='rgba(239,68,68,0.2)';border='#EF4444'}
          }
          return(
            <button key={oi} onClick={()=>handleAnswer(oi)} disabled={selected!==null}
              style={{display:'block',width:'100%',padding:'14px 16px',marginBottom:10,borderRadius:14,border:`2px solid ${border}`,background:bg,color:'#fff',fontSize:14,textAlign:'left',cursor:selected===null?'pointer':'default'}}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}