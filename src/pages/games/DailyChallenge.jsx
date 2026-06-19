// FILE: src/pages/games/DailyChallenge.jsx
// TryIT — Daily Challenge: ONE fresh 5-question set every day, resets at midnight
// Route: /games/daily-challenge
// THE habit-loop anchor game. Same questions for ALL users that day (deterministic seed).
// Cannot replay once completed. Drives Momentum Meter.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  fetchDailyChallengeQuestions, hasCompletedDailyChallenge,
  recordDailyChallengeCompletion, getMomentumInfo, triggerHaptic
} from '../../lib/gameEngine'
import { supabase } from '../../lib/supabase'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const MOCK_Q=[
  {q_id:'d1',question_text:'Capital of Australia?',options:{A:'Sydney',B:'Melbourne',C:'Canberra',D:'Perth'},correct_answer:'C'},
  {q_id:'d2',question_text:'15% of 200 = ?',options:{A:'25',B:'30',C:'35',D:'40'},correct_answer:'B'},
  {q_id:'d3',question_text:'Synonym of "ABUNDANT"',options:{A:'Scarce',B:'Plentiful',C:'Rare',D:'Limited'},correct_answer:'B'},
  {q_id:'d4',question_text:'India\'s national bird?',options:{A:'Parrot',B:'Peacock',C:'Eagle',D:'Sparrow'},correct_answer:'B'},
  {q_id:'d5',question_text:'7,14,28,56,?',options:{A:'84',B:'100',C:'112',D:'120'},correct_answer:'C'},
]

export default function DailyChallenge(){
  const navigate=useNavigate()
  const { user, addCoins } = useAuth()
  const [phase,setPhase]=useState('loading')
  const [questions,setQuestions]=useState(MOCK_Q)
  const [idx,setIdx]=useState(0)
  const [selected,setSelected]=useState(null)
  const [score,setScore]=useState(0)
  const [correct,setCorrect]=useState(0)
  const [wrong,setWrong]=useState(0)
  const [momentum,setMomentum]=useState(null)
  const [alreadyDone,setAlreadyDone]=useState(false)

  const today=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})

  useEffect(()=>{
    ;(async()=>{
      const done=await hasCompletedDailyChallenge(user?.id)
      if(done){ setAlreadyDone(true); setPhase('already_done'); return }
      const qs=await fetchDailyChallengeQuestions()
      if(qs?.length>=5) setQuestions(qs.slice(0,5))

      const{data:mom}=await supabase.from('momentum_log').select('*').eq('user_id',user?.id||'').single().then(r=>r).catch(()=>({data:null}))
      setMomentum(mom)
      setPhase('ready')
    })()
  },[user?.id])

  const start=()=>{ setPhase('playing'); setIdx(0); setScore(0); setCorrect(0); setWrong(0) }

  const finish=async()=>{
    await recordDailyChallengeCompletion(user?.id, score, correct)
    const coinsEarned=correct*10
    addCoins?.(coinsEarned)
    setPhase('done')
  }

  const handleAnswer=(letter)=>{
    if(selected)return
    setSelected(letter)
    const q=questions[idx]
    const isCorrect=letter===(q.correct_answer||q.correct)
    if(isCorrect){ setScore(s=>s+20); setCorrect(c=>c+1); triggerHaptic('success') }
    else{ setWrong(w=>w+1); triggerHaptic('wrong') }
    setTimeout(()=>{
      setSelected(null)
      if(idx+1>=questions.length) finish()
      else setIdx(i=>i+1)
    },600)
  }

  const momentumInfo = getMomentumInfo(momentum?.current_level||0)

  if(phase==='loading') return <div style={{minHeight:'100vh',background:'#0D0D0D',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'Inter,sans-serif'}}>Loading today's challenge...</div>

  if(phase==='already_done') return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,${NAVY},#0F2140)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:56,marginBottom:12}}>✅</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:22,margin:'0 0 8px'}}>Already Completed Today!</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginBottom:8}}>{today}</p>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginBottom:24,lineHeight:1.7}}>Come back tomorrow at midnight for a fresh challenge!</p>
      {momentumInfo&&<div style={{background:'rgba(255,255,255,0.08)',borderRadius:16,padding:20,marginBottom:20}}>
        <p style={{fontSize:32,marginBottom:4}}>{momentumInfo.emoji}</p>
        <p style={{fontWeight:800,color:momentumInfo.color}}>{momentumInfo.label} Momentum</p>
        <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginTop:4}}>{momentum?.consecutive_days||0} days in a row</p>
      </div>}
      <button onClick={()=>navigate('/games')} style={{padding:'14px 32px',background:GOLD,color:NAVY,border:'none',borderRadius:14,fontWeight:800,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  if(phase==='done') return(
    <div>
      <GameResultScreen gameId="daily_challenge" gameName="Daily Challenge" gameEmoji="📅"
        score={score} maxPossible={questions.length*20} correct={correct} wrong={wrong}
        bestStreak={correct} totalQuestions={questions.length} onPlayAgain={()=>navigate('/games')}/>
    </div>
  )

  if(phase==='ready') return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,#D97706,#92400E)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>📅</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:24,margin:'0 0 4px'}}>Daily Challenge</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,0.7)',marginBottom:16}}>{today}</p>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.8)',marginBottom:20,lineHeight:1.7}}>5 fresh questions · Same for everyone today<br/>One attempt only — make it count!</p>

      {momentumInfo&&momentumInfo.level>0&&(
        <div style={{background:'rgba(255,255,255,0.1)',borderRadius:14,padding:'10px 20px',marginBottom:20}}>
          <p style={{fontSize:13,fontWeight:700}}>{momentumInfo.emoji} {momentumInfo.label} Momentum · {momentum?.consecutive_days||0} day streak</p>
        </div>
      )}

      <button onClick={start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Today's Challenge</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Maybe Later</button>
    </div>
  )

  const q=questions[idx]
  const opts = q.options || q
  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff'}}>
      <div style={{background:'#D97706',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{idx+1}/{questions.length}</p>
          <p style={{fontSize:13,fontWeight:800,color:'#fff'}}>{score} pts</p>
        </div>
      </div>
      <div style={{padding:20,maxWidth:480,margin:'0 auto'}}>
        <p style={{fontSize:17,fontWeight:700,margin:'14px 0 20px',lineHeight:1.5}}>{q.question_text||q.q}</p>
        {Object.entries(q.options||{}).map(([letter,text])=>{
          const isSelected=selected===letter
          const isCorrect=letter===(q.correct_answer||q.correct)
          let bg='rgba(255,255,255,0.05)',border='rgba(255,255,255,0.1)'
          if(selected){ if(isCorrect){bg='rgba(34,197,94,0.2)';border='#22C55E'} else if(isSelected){bg='rgba(239,68,68,0.2)';border='#EF4444'} }
          return(
            <button key={letter} onClick={()=>handleAnswer(letter)} disabled={!!selected}
              style={{display:'block',width:'100%',padding:'14px 16px',marginBottom:10,borderRadius:14,border:`2px solid ${border}`,background:bg,color:'#fff',fontSize:14,textAlign:'left',cursor:selected?'default':'pointer'}}>
              {text} {selected&&isCorrect&&' ✅'}
            </button>
          )
        })}
      </div>
    </div>
  )
}