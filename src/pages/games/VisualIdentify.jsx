// FILE: src/pages/games/VisualIdentify.jsx
// TryIT — Visual Identify TEMPLATE
// Powers: Map Master, Diagram Decode, Flag Frenzy, Monument Match, Peak Pointer, Circuit Logic
// Route: /games/visual/:gameId
// Reads game config from games_catalog, questions from image_bank
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { useGameEntry, getComboMultiplier, triggerHaptic } from '../../lib/gameEngine'
import GameResultScreen from './GameResultScreen'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const MOCK_IMAGES=[
  {image_id:'r1',image_url:null,correct_label:'Krishna River',options:{A:'Krishna River',B:'Godavari River',C:'Kaveri River',D:'Narmada River'},correct_answer:'A',topic_code:'RIVER'},
  {image_id:'r2',image_url:null,correct_label:'Mount Kanchenjunga',options:{A:'K2',B:'Mount Kanchenjunga',C:'Nanga Parbat',D:'Mount Everest'},correct_answer:'B',topic_code:'PEAK'},
  {image_id:'r3',image_url:null,correct_label:'Kaziranga National Park',options:{A:'Jim Corbett',B:'Sundarbans',C:'Kaziranga National Park',D:'Gir Forest'},correct_answer:'C',topic_code:'PARK'},
  {image_id:'r4',image_url:null,correct_label:'Rajasthan',options:{A:'Madhya Pradesh',B:'Rajasthan',C:'Gujarat',D:'Maharashtra'},correct_answer:'B',topic_code:'STATE'},
]

export default function VisualIdentify(){
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user, coins, spendCoins, addCoins } = useAuth()

  const [config,setConfig]=useState(null)
  const [images,setImages]=useState(MOCK_IMAGES)
  const [phase,setPhase]=useState('loading')
  const [idx,setIdx]=useState(0)
  const [selected,setSelected]=useState(null)
  const [score,setScore]=useState(0)
  const [correct,setCorrect]=useState(0)
  const [wrong,setWrong]=useState(0)
  const [streak,setStreak]=useState(0)
  const [bestStreak,setBestStreak]=useState(0)
  const [timeLeft,setTimeLeft]=useState(90)

  const entry=useGameEntry(gameId,{coins,spendCoins,addCoins})

  useEffect(()=>{
    supabase.from('games_catalog').select('*').eq('game_id',gameId).single()
      .then(({data})=>{
        if(data){
          setConfig(data)
          setTimeLeft(data.duration_secs||90)
          supabase.from('image_bank').select('*')
            .in('topic_code',data.topic_filter||['RIVER'])
            .eq('admin_approved',true).limit(40)
            .then(({data:imgs})=>{
              if(imgs?.length>=4) setImages([...imgs].sort(()=>Math.random()-0.5).slice(0,data.question_count||10))
              setPhase('ready')
            })
        } else setPhase('ready')
      }).catch(()=>setPhase('ready'))
  },[gameId])

  useEffect(()=>{
    if(phase!=='playing')return
    const t=setInterval(()=>setTimeLeft(p=>{ if(p<=1){clearInterval(t);finish();return 0} return p-1 }),1000)
    return()=>clearInterval(t)
  },[phase])

  const start=async()=>{
    const paid=await entry.payEntry()
    if(!paid && entry.economy?.entryCost>0){ navigate('/wallet'); return }
    setPhase('playing'); setIdx(0); setScore(0); setCorrect(0); setWrong(0); setStreak(0); setBestStreak(0)
  }

  const finish=async()=>{
    setPhase('done')
    const result = correct > images.length/2 ? 'win' : 'loss'
    await entry.settleResult(result)
  }

  const handleAnswer=(letter)=>{
    if(selected)return
    setSelected(letter)
    const img=images[idx]
    const isCorrect=letter===img.correct_answer
    if(isCorrect){
      const ns=streak+1
      const{mult}=getComboMultiplier(ns)
      setStreak(ns); setBestStreak(b=>Math.max(b,ns))
      setScore(s=>s+Math.round(15*mult)); setCorrect(c=>c+1)
      triggerHaptic('success')
    }else{
      setStreak(0); setWrong(w=>w+1); triggerHaptic('wrong')
    }
    setTimeout(()=>{
      setSelected(null)
      if(idx+1>=images.length) finish()
      else setIdx(i=>i+1)
    },700)
  }

  if(phase==='loading') return <div style={{minHeight:'100vh',background:'#0D0D0D',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'Inter,sans-serif'}}>Loading...</div>

  if(phase==='done') return(
    <GameResultScreen gameId={gameId} gameName={config?.name||'Visual Identify'} gameEmoji={config?.emoji||'🗺️'}
      score={score} maxPossible={images.length*45} correct={correct} wrong={wrong}
      bestStreak={bestStreak} totalQuestions={images.length} onPlayAgain={()=>{setPhase('ready')}}/>
  )

  if(phase==='ready') return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,${config?.color||'#16A34A'},#0F2140)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',color:'#fff',padding:24,textAlign:'center'}}>
      <p style={{fontSize:64,marginBottom:12}}>{config?.emoji||'🗺️'}</p>
      <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:26,margin:'0 0 8px'}}>{config?.name||'Visual Identify'}</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:8,lineHeight:1.7}}>{config?.description}</p>
      {entry.economy?.entryCost>0 && <p style={{fontSize:12,color:GOLD,marginBottom:20}}>Entry: {entry.economy.entryCost}🪙 · Win: +{entry.economy.winReward}🪙 · Loss: -{entry.economy.lossPenalty}🪙</p>}
      <button onClick={start} style={{padding:'16px 40px',background:GOLD,color:NAVY,border:'none',borderRadius:16,fontWeight:900,fontSize:16,cursor:'pointer'}}>▶ Start Game</button>
      <button onClick={()=>navigate('/games')} style={{marginTop:14,background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer'}}>← Back to Games</button>
    </div>
  )

  const img=images[idx]
  return(
    <div style={{minHeight:'100vh',background:'#0D0D0D',fontFamily:'Inter,sans-serif',color:'#fff'}}>
      <div style={{background:config?.color||'#16A34A',padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <p style={{fontSize:13,fontWeight:700}}>Q{idx+1}/{images.length}</p>
          <p style={{fontFamily:'monospace',fontWeight:900,fontSize:20,color:timeLeft<=15?'#FCA5A5':GOLD}}>⏱ {timeLeft}s</p>
          <p style={{fontSize:13,fontWeight:800,color:GOLD}}>{score} pts</p>
        </div>
      </div>
      <div style={{padding:20,maxWidth:480,margin:'0 auto'}}>
        <div style={{background:'rgba(255,255,255,0.06)',borderRadius:16,aspectRatio:'16/9',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
          {img.image_url ? <img src={img.image_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:16}}/> :
            <p style={{fontSize:48}}>{config?.emoji||'🗺️'}</p>}
        </div>
        <p style={{fontSize:14,fontWeight:700,textAlign:'center',marginBottom:16,color:'rgba(255,255,255,0.7)'}}>What is this?</p>
        {Object.entries(img.options).map(([letter,text])=>{
          const isSelected=selected===letter
          const isCorrect=letter===img.correct_answer
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