// src/pages/games/NumberSeries.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { ParticleBurst, ComboFire, ScorePopup, TimerRing, AnswerOption, XPBar, GameHeader } from '../../lib/gameUI.jsx'

const QUESTIONS = [
  {q:"1, 4, 9, 16, 25, next?", opts:["30","36","35","49"], ans:1, fact:"Perfect squares: 1,4,9,16,25,36. Next is 6 squared = 36."},
  {q:"2, 3, 5, 7, 11, 13, next?", opts:["15","17","19","16"], ans:1, fact:"Prime numbers series. Next prime after 13 is 17."},
  {q:"1, 1, 2, 3, 5, 8, 13, next?", opts:["18","21","20","19"], ans:1, fact:"Fibonacci series: each number = sum of previous two. 8+13=21."},
  {q:"3, 6, 12, 24, 48, next?", opts:["72","96","84","100"], ans:1, fact:"Geometric series multiply by 2 each time. 48 x 2 = 96."},
  {q:"5, 10, 20, ?, 80, 160", opts:["30","35","40","45"], ans:2, fact:"Multiply by 2: 5,10,20,40,80,160. Missing term is 40."},
  {q:"2, 5, 10, 17, 26, next?", opts:["35","37","38","36"], ans:1, fact:"Differences are 3,5,7,9,11 (odd numbers). 26+11=37."},
  {q:"1, 8, 27, 64, 125, next?", opts:["196","216","225","256"], ans:1, fact:"Perfect cubes: 1,8,27,64,125,216. Next is 6 cubed = 216."},
  {q:"100, 98, 94, 88, 80, next?", opts:["68","70","72","74"], ans:1, fact:"Differences are -2,-4,-6,-8,-10. So 80 - 10 = 70."},
  {q:"Find missing: 2, 3, 5, 7, 11, ?, 17", opts:["12","13","14","15"], ans:1, fact:"Prime series. Missing prime between 11 and 17 is 13."},
  {q:"4, 8, 24, 96, next?", opts:["384","288","192","480"], ans:0, fact:"Pattern: x2, x3, x4, x4. So 96 x 4 = 384."},
]
const TOTAL_TIME = 90
const C1 = '#0EA5E9'
const C2 = '#0284C7'

export default function NumberSeries() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { user: authUser } = useAuth()
  const primD = theme?.primaryDark ?? '#0F2140'
  const isDark = theme?.isDark ?? false

  const [phase, setPhase] = useState('intro')
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [results, setResults] = useState([])
  const [burst, setBurst] = useState(false)
  const [popup, setPopup] = useState(null)
  const timerRef = useRef()

  const seed = (authUser?.id?.charCodeAt(0) || 42) + new Date().getDate()
  const questions = [...QUESTIONS].sort(() => Math.sin(seed * Math.random()) - 0.5)
  const q = questions[qIdx]

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); finishGame(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const handleAnswer = (i) => {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    const correct = i === q.ans
    if (correct) {
      const pts = 10 + combo * 3
      setScore(s => s + pts)
      const nc = combo + 1
      setCombo(nc)
      setMaxCombo(m => Math.max(m, nc))
      setBurst(true)
      setPopup({ pts, correct: true })
      setTimeout(() => { setBurst(false); setPopup(null) }, 1500)
    } else {
      setCombo(0)
      setPopup({ pts: 0, correct: false })
      setTimeout(() => setPopup(null), 1000)
    }
    setResults(r => [...r, { q: q.q, selected: i, correct: q.ans, fact: q.fact }])
    setTimeout(() => {
      if (qIdx < questions.length - 1) {
        setQIdx(idx => idx + 1); setSelected(null); setRevealed(false)
      } else { clearInterval(timerRef.current); finishGame() }
    }, 3000)
  }

  const finishGame = useCallback(async () => {
    setPhase('result')
    if (authUser) {
      const uid = authUser.id || authUser.userId
      try {
        await supabase.from('test_attempts').insert({
          user_id: uid, exam_name: 'game_numberseries',
          subject: 'Maths', score, total: questions.length * 10,
          coins_earned: Math.round(score / 5), xp_earned: score * 2,
        })
      } catch(e) {}
    }
  }, [score, authUser])

  const resetGame = () => {
    setPhase('intro'); setQIdx(0); setSelected(null); setRevealed(false)
    setScore(0); setCombo(0); setMaxCombo(0); setTimeLeft(TOTAL_TIME); setResults([])
  }

  const shareResult = () => {
    const text = `🔢 Number Series: ${score} pts | Combo x${maxCombo} on TryIT! tryiteducations.net`
    if (navigator.share) navigator.share({ title: `Number Series Score`, text })
    else navigator.clipboard?.writeText(text)
  }

  const correct = results.filter(r => r.selected === r.correct).length
  const bg = `radial-gradient(ellipse 120% 60% at 50% -5%,${C1}30,transparent 55%),radial-gradient(ellipse 60% 40% at 90% 110%,${C2}20,transparent 50%),#0A0F1E`

  if (phase === 'intro') return (
    <div style={{ minHeight:'100vh', background:bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'Inter,sans-serif' }}>
      <style>{`@keyframes pr{0%,100%{box-shadow:0 0 0 0 ${C1}44}50%{box-shadow:0 0 0 24px transparent}} @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ textAlign:'center', maxWidth:380, width:'100%' }}>
        <div style={{ width:100,height:100,borderRadius:'50%',background:`linear-gradient(135deg,${C1},${C2})`,margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:52,animation:'pr 2s infinite,fl 3s ease-in-out infinite',boxShadow:`0 12px 40px ${C1}55` }}>🔢</div>
        <p style={{ color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:28,margin:'0 0 8px' }}>Number Series</p>
        <p style={{ color:'rgba(255,255,255,0.5)',fontSize:13,margin:'0 0 6px' }}>Pattern completion challenges</p>
        <p style={{ color:C1,fontSize:11,fontWeight:700,margin:'0 0 24px',background:`${C1}18`,padding:'6px 14px',borderRadius:20,display:'inline-block' }}>⚡ Spot the pattern, beat the clock!</p>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:28 }}>
          {[{icon:'⏱️',label:`${TOTAL_TIME}s`,sub:'Time limit'},{icon:'🔥',label:'Combo x3',sub:'Bonus pts'},{icon:'🪙',label:'+coins',sub:'Per correct'}].map((s,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,padding:'12px 8px',textAlign:'center' }}>
              <p style={{ fontSize:22,margin:'0 0 4px' }}>{s.icon}</p>
              <p style={{ color:'#fff',fontWeight:700,fontSize:11,margin:'0 0 2px' }}>{s.label}</p>
              <p style={{ color:'rgba(255,255,255,0.35)',fontSize:9,margin:0 }}>{s.sub}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase('playing')} style={{ width:'100%',padding:'16px',background:`linear-gradient(135deg,${C1},${C2})`,border:'none',borderRadius:16,cursor:'pointer',color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:18,boxShadow:`0 8px 32px ${C1}55` }}>▶ Start Game</button>
        <button onClick={() => navigate('/student/games')} style={{ marginTop:12,background:'transparent',border:'none',color:'rgba(255,255,255,0.35)',fontSize:12,cursor:'pointer' }}>← Back to Games</button>
      </div>
    </div>
  )

  if (phase === 'result') return (
    <div style={{ minHeight:'100vh',background:bg,padding:24,fontFamily:'Inter,sans-serif' }}>
      <div style={{ maxWidth:500,margin:'0 auto',paddingTop:20 }}>
        <div style={{ textAlign:'center',marginBottom:24 }}>
          <p style={{ fontSize:56,margin:'0 0 8px' }}>{score>=80?'🏆':score>=50?'⭐':'💪'}</p>
          <p style={{ color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:24,margin:'0 0 4px' }}>{score>=80?'Brilliant!':score>=50?'Great!':'Keep Going!'}</p>
          <p style={{ color:C1,fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:52,margin:'0 0 16px',textShadow:`0 0 30px ${C1}88` }}>{score}</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20 }}>
            {[{label:'Correct',val:`${correct}/${questions.length}`,icon:'✅'},{label:'Best Combo',val:`x${maxCombo}`,icon:'🔥'},{label:'Coins',val:`+${Math.round(score/5)}`,icon:'🪙'}].map((s,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,padding:'12px 8px',textAlign:'center' }}>
                <p style={{ fontSize:18,margin:'0 0 4px' }}>{s.icon}</p>
                <p style={{ color:'#fff',fontWeight:900,fontSize:16,margin:0 }}>{s.val}</p>
                <p style={{ color:'rgba(255,255,255,0.4)',fontSize:9 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:18,padding:16,marginBottom:16,maxHeight:260,overflowY:'auto' }}>
          <p style={{ color:'rgba(255,255,255,0.5)',fontSize:10,fontWeight:700,margin:'0 0 12px',letterSpacing:'1px' }}>ANSWER REVIEW</p>
          {results.map((r,i) => (
            <div key={i} style={{ display:'flex',gap:10,padding:'8px 0',borderBottom:i<results.length-1?'1px solid rgba(255,255,255,0.06)':'none' }}>
              <span style={{ fontSize:14,flexShrink:0 }}>{r.selected===r.correct?'✅':'❌'}</span>
              <div><p style={{ color:'rgba(255,255,255,0.75)',fontSize:11,margin:'0 0 2px',lineHeight:1.4 }}>{r.q}</p>
              <p style={{ color:'rgba(255,255,255,0.35)',fontSize:9,margin:0 }}>{r.fact}</p></div>
            </div>
          ))}
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
          <button onClick={resetGame} style={{ padding:'14px',background:`linear-gradient(135deg,${C1},${C2})`,border:'none',borderRadius:14,color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer' }}>🔄 Play Again</button>
          <button onClick={shareResult} style={{ padding:'14px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:14,color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer' }}>📤 Share</button>
        </div>
        <button onClick={() => navigate('/student/games')} style={{ width:'100%',marginTop:10,padding:'12px',background:'transparent',border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,color:'rgba(255,255,255,0.4)',fontSize:13,cursor:'pointer' }}>← Back to Games Hub</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:bg,fontFamily:'Inter,sans-serif' }}>
      <ParticleBurst active={burst} color={C1}/>
      <ComboFire combo={combo}/>
      {popup && <ScorePopup points={popup.pts} correct={popup.correct} x={50} y={35}/>}
      <GameHeader title="Number Series" emoji="🔢" score={score} combo={combo} timeLeft={timeLeft} totalTime={TOTAL_TIME} questNum={qIdx+1} totalQuest={questions.length} accent={C1} onExit={() => navigate('/student/games')}/>
      <div style={{ maxWidth:600,margin:'0 auto',padding:'16px' }}>
        <div style={{ display:'flex',gap:4,marginBottom:16,justifyContent:'center' }}>
          {questions.map((_,i) => (<div key={i} style={{ width:i===qIdx?24:8,height:8,borderRadius:4,background:i<qIdx?(results[i]?.selected===results[i]?.correct?'#4ADE80':'#F87171'):i===qIdx?C1:'rgba(255,255,255,0.20)',transition:'all 0.3s',boxShadow:i===qIdx?`0 0 8px ${C1}`:'none' }}/>))}
        </div>
        <div style={{ marginBottom:14 }}><XPBar current={score} max={questions.length*13} color={C1} label={`Score: ${score}`}/></div>
        <div style={{ background:'rgba(255,255,255,0.08)',backdropFilter:'blur(20px)',border:`1px solid ${C1}33`,borderRadius:20,padding:'20px',marginBottom:14,boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}>
          <div style={{ display:'flex',gap:10,alignItems:'center',marginBottom:12 }}>
            <span style={{ background:`${C1}22`,color:C1,fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:20,border:`1px solid ${C1}33` }}>Maths</span>
            {combo>0 && <span style={{ color:C1,fontSize:10,fontWeight:700 }}>🔥 x{combo}</span>}
          </div>
          <p style={{ color:'#F8FAFC',fontSize:15,fontWeight:600,lineHeight:1.7,margin:0 }}>{q?.q}</p>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {q?.opts?.map((opt,i) => (<AnswerOption key={i} option={opt} index={i} selected={selected===i} correct={revealed && i===q.ans} wrong={revealed && i!==q.ans} revealed={revealed} disabled={revealed} onClick={() => handleAnswer(i)}/>))}
        </div>
        {revealed && (
          <div style={{ marginTop:14,background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)',borderRadius:14,padding:'12px 16px' }}>
            <p style={{ color:'#4ADE80',fontWeight:700,fontSize:11,margin:'0 0 4px' }}>💡 Know This!</p>
            <p style={{ color:'rgba(255,255,255,0.7)',fontSize:12,margin:0,lineHeight:1.6 }}>{q?.fact}</p>
          </div>
        )}
      </div>
    </div>
  )
}
