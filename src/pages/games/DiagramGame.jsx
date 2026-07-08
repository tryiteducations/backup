// src/pages/games/DiagramGame.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { diagramGames } from '../../lib/diagramGames'
import { spacedRepetition } from '../../lib/spacedRepetition'

const HIT_RADIUS_PCT = 8 // how close a tap needs to be to count as correct

export default function DiagramGame() {
  const { gameId } = useParams()
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'

  const imgRef = useRef(null)
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [remainingLabels, setRemainingLabels] = useState([])
  const [activeLabel, setActiveLabel] = useState(null)
  const [placedCorrect, setPlacedCorrect] = useState([]) // hotspot ids placed correctly
  const [feedback, setFeedback] = useState(null) // {x_pct, y_pct, correct}
  const [wrongCount, setWrongCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    diagramGames.getById(gameId).then(g => {
      setGame(g)
      if (g) setRemainingLabels([...g.hotspots].sort(() => Math.random() - 0.5))
      setLoading(false)
    })
  }, [gameId])

  const handleImageClick = async (e) => {
    if (!activeLabel || feedback) return
    const rect = imgRef.current.getBoundingClientRect()
    const x_pct = ((e.clientX - rect.left) / rect.width) * 100
    const y_pct = ((e.clientY - rect.top) / rect.height) * 100

    const dist = Math.sqrt((x_pct - activeLabel.x_pct) ** 2 + (y_pct - activeLabel.y_pct) ** 2)
    const isCorrect = dist <= HIT_RADIUS_PCT

    setFeedback({ x_pct, y_pct, correct: isCorrect })

    if (user?.id) {
      const itemId = `${gameId}_${activeLabel.id}`
      spacedRepetition.recordReview(user.id, 'diagram_hotspot', itemId, isCorrect, {
        gameId, gameTitle: game.title, label: activeLabel.label, imageUrl: game.image_url,
      }).catch(() => {})
    }

    setTimeout(() => {
      if (isCorrect) {
        setPlacedCorrect(prev => [...prev, activeLabel.id])
        setRemainingLabels(prev => prev.filter(l => l.id !== activeLabel.id))
      } else {
        setWrongCount(n => n + 1)
        // Wrong guesses go to the back of the queue to try again later in this round
        setRemainingLabels(prev => [...prev.filter(l => l.id !== activeLabel.id), activeLabel])
      }
      setActiveLabel(null)
      setFeedback(null)
      if (remainingLabels.length <= 1 && isCorrect) setDone(true)
    }, 900)
  }

  if (loading) return <Centered bg={bg} m={m}>Loading...</Centered>
  if (!game) return <Centered bg={bg} m={m}>Game not found.</Centered>

  if (done) {
    return (
      <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'Poppins,sans-serif'}}>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:32,maxWidth:380,textAlign:'center'}}>
          <p style={{fontSize:40,marginBottom:10}}>🎉</p>
          <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 6px'}}>{game.title} - Complete!</p>
          <p style={{color:m,fontSize:13,margin:'0 0 20px'}}>
            {game.hotspots.length} labels placed{wrongCount > 0 ? `, ${wrongCount} will come back in Review soon` : ' with zero mistakes!'}
          </p>
          <button onClick={()=>nav('/student/games')}
            style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
              padding:'12px 24px',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
            Back to Games
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'14px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student/games')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Exit</button>
        <div style={{flex:1}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>{game.title}</p>
          <p style={{color:m,fontSize:11,margin:0}}>{placedCorrect.length}/{game.hotspots.length} labeled correctly</p>
        </div>
      </div>

      <div style={{padding:20,maxWidth:640,margin:'0 auto'}}>
        <p style={{color:t,fontWeight:600,fontSize:13,marginBottom:10,textAlign:'center'}}>
          {activeLabel ? `Tap where "${activeLabel.label}" belongs` : 'Pick a label below to place it'}
        </p>

        <div style={{position:'relative',display:'block',marginBottom:16}}>
          <img ref={imgRef} src={game.image_url} alt="" onClick={handleImageClick}
            style={{width:'100%',borderRadius:16,border:`1px solid ${b}`,cursor:activeLabel?'crosshair':'default',display:'block'}}/>
          {feedback && (
            <div style={{position:'absolute',left:`${feedback.x_pct}%`,top:`${feedback.y_pct}%`,
              transform:'translate(-50%,-50%)',width:32,height:32,borderRadius:'50%',
              background:feedback.correct?'#22C55E':'#DC2626',border:'3px solid #fff',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'#fff',
              boxShadow:'0 4px 12px rgba(0,0,0,0.3)'}}>
              {feedback.correct ? '✓' : '✗'}
            </div>
          )}
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
          {remainingLabels.map(l => (
            <button key={l.id} onClick={()=>setActiveLabel(l)}
              style={{padding:'10px 18px',borderRadius:20,
                border:`1.5px solid ${activeLabel?.id===l.id?a:b}`,
                background:activeLabel?.id===l.id?`${a}20`:c,
                color:t,fontSize:13,fontWeight:600,cursor:'pointer'}}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Centered({ bg, m, children }) {
  return (
    <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:m,fontFamily:'Poppins,sans-serif'}}>{children}</p>
    </div>
  )
}
