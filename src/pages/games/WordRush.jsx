// FILE: src/pages/games/WordRush.jsx
// TryIT — Word Rush: vocabulary, idioms, one-word substitution, 2 minutes
// Route: /games/word-rush
// Trains English section — synonyms/antonyms/idioms that actually appear in exams
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useGameSession, getComboMultiplier } from '../../lib/gameEngine'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const MOCK_Q=[
  {q:'Synonym of "ABUNDANT"',options:['Scarce','Plentiful','Rare','Limited'],correct:1,type:'Synonym'},
  {q:'Antonym of "TRANSPARENT"',options:['Clear','Obvious','Opaque','Visible'],correct:2,type:'Antonym'},
  {q:'Idiom: "To beat around the bush" means',options:['To be direct','To avoid the topic','To work hard','To celebrate'],correct:1,type:'Idiom'},
  {q:'One word for "A person who loves books"',options:['Bibliophile','Misanthrope','Philanthropist','Hermit'],correct:0,type:'One Word'},
  {q:'Synonym of "METICULOUS"',options:['Careless','Careful','Quick','Lazy'],correct:1,type:'Synonym'},
  {q:'Idiom: "Once in a blue moon" means',options:['Every month','Very rarely','Every night','Frequently'],correct:1,type:'Idiom'},
  {q:'Antonym of "BENEVOLENT"',options:['Kind','Generous','Malevolent','Caring'],correct:2,type:'Antonym'},
  {q:'One word for "Fear of heights"',options:['Claustrophobia','Acrophobia','Arachnophobia','Agoraphobia'],correct:1,type:'One Word'},
  {q:'Idiom: "To let the cat out of the bag" means',options:['To hide a secret','To reveal a secret','To trap someone','To run away'],correct:1,type:'Idiom'},
  {q:'Synonym of "ELOQUENT"',options:['Articulate','Confused','Silent','Boring'],correct:0,type:'Synonym'},
  {q:'Antonym of "DILIGENT"',options:['Hardworking','Lazy','Sincere','Focused'],correct:1,type:'Antonym'},
  {q:'One word for "Government by the people"',options:['Monarchy','Democracy','Autocracy','Oligarchy'],correct:1,type:'One Word'},
  {q:'Idiom: "Burning the midnight oil" means',options:['Wasting time','Working late into the night','Cooking dinner','Sleeping early'],correct:1,type:'Idiom'},
  {q:'Synonym of "PRUDENT"',options:['Wise','Foolish','Hasty','Reckless'],correct:0,type:'Synonym'},
  {q:'Antonym of "VERBOSE"',options:['Wordy','Concise','Lengthy','Talkative'],correct:1,type:'Antonym'},
]

export default function WordRush(){
  const navigate=useNavigate()
  const [questions,setQuestions]=useState(MOCK_Q)
  const [selected,setSelected]=useState(null)
  const [showResult,setShowResult]=useState(false)

  useEffect(()=>{
    supabase.from('question_bank').select('q_id,question_text,options,correct_answer,topic_code')
      .eq('subject','english').in('topic_code',['VO','ID']).eq('admin_approved',true).limit(40)
      .then(({data})=>{
        if(data?.length>=15){
          const shuffled=[...data].sort(()=>Math.random()-0.5).slice(0,15)
          setQuestions(shuffled.map(q=>{
            const opts=Object.values(q.options||{})
            const correctIdx=Object.keys(q.options||{}).indexOf(q.correct_answer)
            return {q:q.question_text,options:opts,correct:correctIdx,type:q.topic_code==='ID'?'Idiom':'Vocabulary'}
          }))
        }
      }).catch(()=>{})
  },[])

  const game=useGameSession({ totalQuestions:questions.length, duration:120 })
  const q=questions[game.currentIdx]
  const combo=getComboMultiplier(game.streak)

  const handleAnswer=(idx)=>{
    if(selected!==null)return
    setSelected(idx)
    const isCorrect=idx===q.correct
    setTimeout(()=>{ game.answer(isCorrect,12); setSelected(null) },450)
  }

  useEffect(()=>{ if(game.phase==='done') setShowResult(true) },[game.phase])

  if(showResult) return (
    <GameResultScreen gameId="word_rush" gameName="Word Rush" gameEmoji="📝"
      score={game.score} maxPossible={questions.length*36} correct={game.correct}
      wrong={game.wrong} bestStreak={game.bestStreak} totalQuestions={questions.length}
      onPlayAgain={()=>{setShowResult(false);game.start()}}/>
  )

  if(game.phase==='ready') return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,#059669,#047857)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>📝</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 8px'}}>Word Rush</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:24,lineHeight:1.7}}>Vocabulary, idioms & one-word substitution<br/>2 minutes · Strengthens your English section!</p>
      <button onClick={game.start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff',position:'relative'}}>
      {game.showCombo&&(
        <div style={{position:'fixed',top:'30%',left:'50%',transform:'translate(-50%,-50%)',zIndex:200,textAlign:'center',animation:'popIn 0.4s'}}>
          <p style={{fontSize:48}}>📚</p>
          <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:20,color:combo.color}}>{combo.label}</p>
        </div>
      )}

      <div style={{background:'#059669',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{game.currentIdx+1}/{questions.length}</p>
          <p style={{fontFamily:'monospace',fontWeight:900,fontSize:20,color:game.timeLeft<=20?'#EF4444':GOLD}}>⏱ {game.timeLeft}s</p>
          <p style={{fontSize:13,fontWeight:800,color:GOLD}}>{game.score} pts</p>
        </div>
        <div style={{height:4,background:'rgba(255,255,255,0.2)',borderRadius:99,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${(game.currentIdx/questions.length)*100}%`,background:GOLD}}/>
        </div>
        {game.streak>=2&&<p style={{fontSize:11,color:combo.color,fontWeight:700,marginTop:6,textAlign:'center'}}>{combo.label} · {combo.mult}x multiplier</p>}
      </div>

      {q&&(
        <div style={{padding:20,maxWidth:480,margin:'0 auto'}}>
          <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:99,background:'rgba(5,150,105,0.3)',color:'#86EFAC'}}>{q.type}</span>
          <p style={{fontSize:18,fontWeight:700,margin:'14px 0 20px',lineHeight:1.5}}>{q.q}</p>
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