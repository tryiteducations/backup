// FILE: src/pages/games/LogicGrid.jsx
// TryIT — Logic Grid: seating arrangement & puzzle questions, 3 minutes
// Route: /games/logic-grid
// Hardest game — trains Reasoning section (puzzle/seating that appears in SSC/Banking)
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useGameSession, getComboMultiplier } from '../../lib/gameEngine'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const MOCK_Q=[
  {q:'A, B, C, D sit in a row. A is to the left of B. C is to the right of D. B is left of C. Who sits first (leftmost)?',options:['A','B','C','D'],correct:0,type:'Seating'},
  {q:'In a code, CAT = 24-1-20. What is DOG?',options:['4-15-7','4-14-7','5-15-7','4-15-8'],correct:0,type:'Coding'},
  {q:'5 people P,Q,R,S,T are in a queue. P is 2nd from left. T is last. Q is right after P. Who is in the middle?',options:['Q','R','S','T'],correct:1,type:'Seating'},
  {q:'If MONDAY is coded as NPOEBZ, how is FRIDAY coded?',options:['GSJEBZ','GSJEZB','HSJEBZ','GTJEBZ'],correct:0,type:'Coding'},
  {q:'In a circle, A sits opposite to B. C is to the immediate right of A. Where is C relative to B?',options:['Immediate left of B','Immediate right of B','Opposite B','Same seat as B'],correct:0,type:'Circular'},
  {q:'Find the odd one: Triangle, Square, Circle, Five',options:['Triangle','Square','Circle','Five'],correct:3,type:'Classification'},
  {q:'If South-East becomes North, then North-West becomes?',options:['South','South-East','South-West','East'],correct:1,type:'Direction'},
  {q:'8 friends sit around a round table. A is 3rd to the right of B. If B is at position 1, where is A?',options:['Position 4','Position 5','Position 3','Position 6'],correct:0,type:'Circular'},
  {q:'Statement: All pens are books. All books are tables. Conclusion: All pens are tables.',options:['True','False','Cannot say','Partially true'],correct:0,type:'Syllogism'},
  {q:'A is father of B. B is sister of C. C is son of D. How is D related to A?',options:['Wife','Daughter','Mother','Sister'],correct:0,type:'Blood Relation'},
]

export default function LogicGrid(){
  const navigate=useNavigate()
  const [questions,setQuestions]=useState(MOCK_Q)
  const [selected,setSelected]=useState(null)
  const [showResult,setShowResult]=useState(false)

  useEffect(()=>{
    supabase.from('question_bank').select('q_id,question_text,options,correct_answer,topic_code')
      .eq('subject','reasoning').in('topic_code',['PZ','DI_R','CO']).eq('admin_approved',true).limit(40)
      .then(({data})=>{
        if(data?.length>=10){
          const shuffled=[...data].sort(()=>Math.random()-0.5).slice(0,10)
          setQuestions(shuffled.map(q=>{
            const opts=Object.values(q.options||{})
            const correctIdx=Object.keys(q.options||{}).indexOf(q.correct_answer)
            return {q:q.question_text,options:opts,correct:correctIdx,type:'Puzzle'}
          }))
        }
      }).catch(()=>{})
  },[])

  const game=useGameSession({ totalQuestions:questions.length, duration:180 })
  const q=questions[game.currentIdx]
  const combo=getComboMultiplier(game.streak)

  const handleAnswer=(idx)=>{
    if(selected!==null)return
    setSelected(idx)
    const isCorrect=idx===q.correct
    setTimeout(()=>{ game.answer(isCorrect,15); setSelected(null) },500)
  }

  useEffect(()=>{ if(game.phase==='done') setShowResult(true) },[game.phase])

  if(showResult) return (
    <GameResultScreen gameId="logic_grid" gameName="Logic Grid" gameEmoji="🧩"
      score={game.score} maxPossible={questions.length*45} correct={game.correct}
      wrong={game.wrong} bestStreak={game.bestStreak} totalQuestions={questions.length}
      onPlayAgain={()=>{setShowResult(false);game.start()}}/>
  )

  if(game.phase==='ready') return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,#DC2626,#B91C1C)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>🧩</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 8px'}}>Logic Grid</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:24,lineHeight:1.7}}>Seating, coding, puzzles & blood relations<br/>3 minutes · The hardest reasoning challenge!</p>
      <button onClick={game.start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff',position:'relative'}}>
      {game.showCombo&&(
        <div style={{position:'fixed',top:'30%',left:'50%',transform:'translate(-50%,-50%)',zIndex:200,textAlign:'center',animation:'popIn 0.4s'}}>
          <p style={{fontSize:48}}>🧠</p>
          <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:20,color:combo.color}}>{combo.label}</p>
        </div>
      )}

      <div style={{background:'#DC2626',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{game.currentIdx+1}/{questions.length}</p>
          <p style={{fontFamily:'monospace',fontWeight:900,fontSize:20,color:game.timeLeft<=30?'#FCA5A5':GOLD}}>⏱ {game.timeLeft}s</p>
          <p style={{fontSize:13,fontWeight:800,color:GOLD}}>{game.score} pts</p>
        </div>
        <div style={{height:4,background:'rgba(255,255,255,0.2)',borderRadius:99,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${(game.currentIdx/questions.length)*100}%`,background:GOLD}}/>
        </div>
        {game.streak>=2&&<p style={{fontSize:11,color:combo.color,fontWeight:700,marginTop:6,textAlign:'center'}}>{combo.label} · {combo.mult}x multiplier</p>}
      </div>

      {q&&(
        <div style={{padding:20,maxWidth:480,margin:'0 auto'}}>
          <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:99,background:'rgba(220,38,38,0.3)',color:'#FCA5A5'}}>{q.type}</span>
          <p style={{fontSize:15,fontWeight:600,margin:'14px 0 20px',lineHeight:1.7}}>{q.q}</p>
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