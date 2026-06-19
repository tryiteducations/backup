// FILE: src/pages/games/GKBlitz.jsx
// TryIT — GK Blitz: 10 GK questions, 60 seconds, combo streak
// Route: /games/gk-blitz
// Pulls from question_bank (subject=gk) — exam-relevant, not random trivia
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useGameSession, getComboMultiplier } from '../../lib/gameEngine'
import { playSound, burstGlitter, injectGameStyles } from '../../lib/gameJuice'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const MOCK_Q=[
  {id:'gk1',question:'Who is the current President of India?',options:['Droupadi Murmu','Ram Nath Kovind','Pranab Mukherjee','Narendra Modi'],correct:0,topic:'Polity'},
  {id:'gk2',question:'Which river is known as the "Sorrow of Bihar"?',options:['Ganga','Kosi','Yamuna','Son'],correct:1,topic:'Geography'},
  {id:'gk3',question:'The Battle of Plassey was fought in which year?',options:['1757','1764','1857','1947'],correct:0,topic:'History'},
  {id:'gk4',question:'Which Article of the Constitution abolishes untouchability?',options:['Article 14','Article 17','Article 21','Article 32'],correct:1,topic:'Polity'},
  {id:'gk5',question:'India\'s first Five Year Plan focused on which sector?',options:['Industry','Agriculture','Services','Defence'],correct:1,topic:'Economy'},
  {id:'gk6',question:'Which is the largest Indian state by area?',options:['Madhya Pradesh','Maharashtra','Rajasthan','Uttar Pradesh'],correct:2,topic:'Geography'},
  {id:'gk7',question:'Who founded the Indian National Congress in 1885?',options:['Gandhi','A.O. Hume','Nehru','Tilak'],correct:1,topic:'History'},
  {id:'gk8',question:'RBI was established in which year?',options:['1935','1947','1950','1969'],correct:0,topic:'Economy'},
  {id:'gk9',question:'Which Fundamental Right was added by 86th Amendment?',options:['Right to Equality','Right to Education','Right to Privacy','Right to Vote'],correct:1,topic:'Polity'},
  {id:'gk10',question:'The Tropic of Cancer passes through how many Indian states?',options:['6','7','8','9'],correct:2,topic:'Geography'},
]

export default function GKBlitz(){
  const navigate=useNavigate()
  const location=useLocation()
  // Level data passed from GameLevelRoadmap.jsx — if absent (direct play), defaults apply
  const level       = location.state?.level || 1
  const levelConfig = location.state?.levelConfig || { questionCount:10, duration:60, difficultyMix:['L1','L2'] }
  const isAdminTest = location.state?.isAdminTest || false

  const [questions,setQuestions]=useState(MOCK_Q)
  const [selected,setSelected]=useState(null)
  const [showResult,setShowResult]=useState(false)

  useEffect(()=>{
    supabase.from('question_bank').select('q_id,question_text,options,correct_answer,topic_code')
      .eq('subject','gk').eq('admin_approved',true)
      .in('difficulty', levelConfig.difficultyMix)
      .limit(levelConfig.questionCount * 4)
      .then(({data})=>{
        if(data?.length>=levelConfig.questionCount){
          const shuffled=[...data].sort(()=>Math.random()-0.5).slice(0,levelConfig.questionCount)
          setQuestions(shuffled.map(q=>{
            const opts=Object.values(q.options||{})
            const correctIdx=Object.keys(q.options||{}).indexOf(q.correct_answer)
            return {id:q.q_id,question:q.question_text,options:opts,correct:correctIdx,topic:q.topic_code}
          }))
        } else {
          // Not enough questions at this difficulty yet — pad with mock, never block play
          setQuestions(MOCK_Q.slice(0, levelConfig.questionCount))
        }
      }).catch(()=>{ setQuestions(MOCK_Q.slice(0, levelConfig.questionCount)) })
  },[level])

  const game=useGameSession({ totalQuestions:questions.length, duration:levelConfig.duration })
  const q=questions[game.currentIdx]
  const combo=getComboMultiplier(game.streak)

  const handleAnswer=(idx)=>{
    if(selected!==null)return
    setSelected(idx)
    const isCorrect=idx===q.correct
    playSound(isCorrect?'correct':'incorrect')
    setTimeout(()=>{
      game.answer(isCorrect,10)
      setSelected(null)
    },500)
  }

  useEffect(()=>{ injectGameStyles() },[])

  useEffect(()=>{ if(game.showCombo) playSound('combo',game.streak) },[game.showCombo])
  useEffect(()=>{ if(game.phase==='done') setShowResult(true) },[game.phase])

  if(showResult) return (
    <GameResultScreen gameId="gk_blitz" gameName="GK Blitz" gameEmoji="🇮🇳"
      score={game.score} maxPossible={questions.length*30} correct={game.correct}
      wrong={game.wrong} bestStreak={game.bestStreak} totalQuestions={questions.length}
      onPlayAgain={()=>{setShowResult(false);game.start()}}/>
  )

  if(game.phase==='ready') return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,#1D4ED8,#1E40AF)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      {isAdminTest&&<div style={{background:'rgba(220,38,38,0.25)',border:'1.5px solid #EF4444',borderRadius:99,padding:'4px 14px',marginBottom:14}}>
        <p style={{fontSize:10,fontWeight:900,color:'#FCA5A5',margin:0,letterSpacing:1}}>🛡️ ADMIN TEST — LEVEL {level}</p>
      </div>}
      <p style={{fontSize:64,marginBottom:12}}>🇮🇳</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 4px'}}>GK Blitz</h1>
      {level>1&&<p style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Level {level}</p>}
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:24,lineHeight:1.7}}>{levelConfig.questionCount} GK questions · {levelConfig.duration} seconds<br/>Build combo streaks for bonus points!</p>
      <button onClick={()=>{playSound('gameStart');game.start()}} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff',position:'relative'}}>
      {/* Combo popup */}
      {game.showCombo&&(
        <div style={{position:'fixed',top:'30%',left:'50%',transform:'translate(-50%,-50%)',zIndex:200,textAlign:'center',animation:'popIn 0.4s'}}>
          <p style={{fontSize:48}}>🔥</p>
          <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:20,color:combo.color}}>{combo.label}</p>
        </div>
      )}

      <div style={{background:'#1D4ED8',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{game.currentIdx+1}/{questions.length}</p>
          <p style={{fontFamily:'monospace',fontWeight:900,fontSize:20,color:game.timeLeft<=10?'#EF4444':GOLD}}>⏱ {game.timeLeft}s</p>
          <p style={{fontSize:13,fontWeight:800,color:GOLD}}>{game.score} pts</p>
        </div>
        <div style={{height:4,background:'rgba(255,255,255,0.2)',borderRadius:99,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${(game.currentIdx/questions.length)*100}%`,background:GOLD}}/>
        </div>
        {game.streak>=2&&<p style={{fontSize:11,color:combo.color,fontWeight:700,marginTop:6,textAlign:'center'}}>{combo.label} · {combo.mult}x multiplier</p>}
      </div>

      {q&&(
        <div style={{padding:20,maxWidth:480,margin:'0 auto'}}>
          <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:99,background:'rgba(29,78,216,0.3)',color:'#93C5FD'}}>{q.topic}</span>
          <p style={{fontSize:17,fontWeight:700,margin:'14px 0 20px',lineHeight:1.5}}>{q.question}</p>
          {q.options.map((opt,idx)=>{
            const isSelected=selected===idx
            const isCorrect=idx===q.correct
            let bg='rgba(255,255,255,0.05)',border='rgba(255,255,255,0.1)'
            if(selected!==null){
              if(isCorrect){bg='rgba(34,197,94,0.2)';border='#22C55E'}
              else if(isSelected){bg='rgba(239,68,68,0.2)';border='#EF4444'}
            }
            return(
              <button key={idx} onClick={()=>handleAnswer(idx)} disabled={selected!==null}
                style={{display:'block',width:'100%',padding:'14px 16px',marginBottom:10,borderRadius:14,border:`2px solid ${border}`,background:bg,color:'#fff',fontSize:14,textAlign:'left',cursor:selected===null?'pointer':'default'}}>
                {opt} {selected!==null&&isCorrect&&' ✅'} {selected!==null&&isSelected&&!isCorrect&&' ❌'}
              </button>
            )
          })}
        </div>
      )}
      <style>{`@keyframes popIn{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0}60%{transform:translate(-50%,-50%) scale(1.15)}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}`}</style>
    </div>
  )
}