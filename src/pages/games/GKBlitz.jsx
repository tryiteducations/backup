// src/pages/games/GKBlitz.jsx — Premium redesign with dopamine mechanics
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { ParticleBurst, ComboFire, ScorePopup,
         TimerRing, AnswerOption, XPBar, GameHeader } from '../../lib/gameUI.jsx'

const QUESTIONS = [
  { q:"Which Article of Indian Constitution abolished untouchability?",
    opts:["Article 14","Article 15","Article 17","Article 21"], ans:2,
    fact:"Article 17 abolished untouchability and its practice is a punishable offence." },
  { q:"India's first satellite was named?",
    opts:["Bhaskara","Aryabhata","Rohini","INSAT-1A"], ans:1,
    fact:"Aryabhata was India's first satellite, launched on April 19, 1975." },
  { q:"Which river is called the 'Ganga of the South'?",
    opts:["Krishna","Cauvery","Godavari","Tungabhadra"], ans:2,
    fact:"Godavari is called 'Ganga of the South'. It is the 2nd longest river in India." },
  { q:"The term 'Fiscal Policy' relates to?",
    opts:["Money Supply","Government Revenue & Expenditure","Credit Control","Trade Policy"], ans:1,
    fact:"Fiscal policy involves government decisions on taxation and spending to influence the economy." },
  { q:"Which Constitutional Amendment added Fundamental Duties?",
    opts:["42nd","44th","52nd","86th"], ans:0,
    fact:"42nd Amendment 1976 added Fundamental Duties (Part IV-A, Article 51-A) to the Constitution." },
  { q:"Project Tiger was launched in which year?",
    opts:["1970","1973","1980","1985"], ans:1,
    fact:"Project Tiger was launched in 1973 by PM Indira Gandhi to protect Bengal tigers." },
  { q:"The famous book 'Discovery of India' was written by?",
    opts:["Mahatma Gandhi","Subhas Chandra Bose","Jawaharlal Nehru","Sardar Patel"], ans:2,
    fact:"Discovery of India was written by Jawaharlal Nehru while imprisoned at Ahmednagar Fort (1944)." },
  { q:"Which is the smallest state of India by area?",
    opts:["Goa","Sikkim","Manipur","Tripura"], ans:0,
    fact:"Goa is the smallest state of India by area at 3,702 sq km. Smallest by population is Sikkim." },
  { q:"The Preamble of the Indian Constitution begins with?",
    opts:["We the People","We the Citizens","We the Nation","We the Indians"], ans:0,
    fact:"The Preamble begins with 'We the People of India' — borrowed from the US Constitution concept." },
  { q:"Who is known as 'Iron Man of India'?",
    opts:["Bhagat Singh","Bal Gangadhar Tilak","Sardar Vallabhbhai Patel","Lala Lajpat Rai"], ans:2,
    fact:"Sardar Vallabhbhai Patel is called Iron Man of India for integrating 565 princely states." },
]

const TOTAL_TIME = 60

export default function GKBlitz() {
  const navigate  = useNavigate()
  const { theme } = useTheme()
  const { user: authUser } = useAuth()
  const accent  = theme?.accent  ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primD   = theme?.primaryDark ?? '#0F2140'
  const primary = theme?.primary ?? '#1E3A5F'

  const [phase,      setPhase]      = useState('intro')
  const [qIdx,       setQIdx]       = useState(0)
  const [selected,   setSelected]   = useState(null)
  const [revealed,   setRevealed]   = useState(false)
  const [score,      setScore]      = useState(0)
  const [combo,      setCombo]      = useState(0)
  const [timeLeft,   setTimeLeft]   = useState(TOTAL_TIME)
  const [results,    setResults]    = useState([])
  const [burst,      setBurst]      = useState(false)
  const [popup,      setPopup]      = useState(null)
  const timerRef = useRef()

  // Shuffle questions uniquely per user per day
  const seed = authUser?.id?.charCodeAt(0) || 42
  const dailySeed = new Date().getDate() + seed
  const shuffled = [...QUESTIONS].sort((a,b) =>
    Math.sin(dailySeed * QUESTIONS.indexOf(a)) - Math.sin(dailySeed * QUESTIONS.indexOf(b))
  )
  const questions = shuffled.slice(0, 10)
  const q = questions[qIdx]

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); endGame(); return 0 }
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
      setCombo(c => c + 1)
      setBurst(true)
      setPopup({ pts, correct:true })
      setTimeout(() => { setBurst(false); setPopup(null) }, 1500)
    } else {
      setCombo(0)
      setPopup({ pts:0, correct:false })
      setTimeout(() => setPopup(null), 1000)
    }

    setResults(r => [...r, { q:q.q, selected:i, correct:q.ans, fact:q.fact }])

    setTimeout(() => {
      if (qIdx < questions.length - 1) {
        setQIdx(i => i + 1)
        setSelected(null)
        setRevealed(false)
      } else {
        clearInterval(timerRef.current)
        endGame()
      }
    }, revealed ? 1200 : 1200)
  }

  const endGame = useCallback(async () => {
    setPhase('result')
    if (authUser) {
      const uid = authUser.id || authUser.userId
      const coins = Math.round(score / 5)
      const xp    = score * 2
      try {
        await supabase.from('test_attempts').insert({
          user_id: uid, exam_name: 'game_gk_blitz',
          subject: 'GK', score, total: questions.length * 10,
          coins_earned: coins, xp_earned: xp,
        })
        await supabase.from('profiles').update({
          coins: supabase.raw?.(`coins + ${coins}`) || undefined,
        }).eq('id', uid)
      } catch(e) {}
    }
  }, [score, authUser, questions])

  const bg = `radial-gradient(ellipse 100% 60% at 50% -10%, #1D4ED844, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 100%, #3B82F622, transparent 50%),
              ${primD}`

  const shareResult = () => {
    const text = `🎯 GK Blitz Score: ${score} points! Combo x${combo} 🔥\nCan you beat me on TryIT? tryiteducations.net`
    if (navigator.share) navigator.share({ title:'My GK Blitz Score', text })
    else navigator.clipboard?.writeText(text)
  }

  // ── INTRO ────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div style={{ minHeight:'100vh', background:bg,
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      padding:24, fontFamily:'Inter,sans-serif' }}>
      <style>{`
        @keyframes pulse-ring {
          0%,100%{ box-shadow:0 0 0 0 rgba(59,130,246,0.4); }
          50%    { box-shadow:0 0 0 20px rgba(59,130,246,0); }
        }
      `}</style>
      <div style={{ textAlign:'center', maxWidth:380 }}>
        <div style={{
          width:100, height:100, borderRadius:'50%',
          background:'linear-gradient(135deg,#1D4ED8,#3B82F6)',
          margin:'0 auto 20px',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:48, animation:'pulse-ring 2s infinite',
          boxShadow:'0 12px 40px #1D4ED844',
        }}>🇮🇳</div>
        <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif',
          fontWeight:900, fontSize:28, margin:'0 0 8px' }}>GK Blitz</p>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14,
          margin:'0 0 28px', lineHeight:1.6 }}>
          10 GK questions · 60 seconds<br/>
          Combo multiplier — answer fast, earn more!
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
          gap:10, marginBottom:28 }}>
          {[
            { icon:'⏱️', label:'60 Seconds', sub:'Time limit' },
            { icon:'🔥', label:'3x Combo', sub:'Bonus points' },
            { icon:'🪙', label:'+20 Coins', sub:'Per perfect' },
          ].map((s,i) => (
            <div key={i} style={{
              background:'rgba(255,255,255,0.07)',
              border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:14, padding:'12px 8px', textAlign:'center',
            }}>
              <p style={{ fontSize:22, margin:'0 0 4px' }}>{s.icon}</p>
              <p style={{ color:'#fff', fontWeight:700, fontSize:11, margin:'0 0 2px' }}>{s.label}</p>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:9, margin:0 }}>{s.sub}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase('playing')} style={{
          width:'100%', padding:'16px',
          background:'linear-gradient(135deg,#3B82F6,#1D4ED8)',
          border:'none', borderRadius:16, cursor:'pointer',
          color:'#fff', fontFamily:'Poppins,sans-serif',
          fontWeight:900, fontSize:18,
          boxShadow:'0 8px 32px #3B82F666',
          transition:'all 0.15s',
        }}>
          ▶ Start Game
        </button>
        <button onClick={() => navigate('/student/games')} style={{
          marginTop:12, background:'transparent', border:'none',
          color:'rgba(255,255,255,0.35)', fontSize:12, cursor:'pointer' }}>
          ← Back to Games
        </button>
      </div>
    </div>
  )

  // ── RESULT ───────────────────────────────────────────────────────
  if (phase === 'result') return (
    <div style={{ minHeight:'100vh', background:bg,
      padding:24, fontFamily:'Inter,sans-serif' }}>
      <div style={{ maxWidth:500, margin:'0 auto', paddingTop:20 }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <p style={{ fontSize:60, margin:'0 0 8px' }}>
            {score >= 80 ? '🏆' : score >= 50 ? '⭐' : '💪'}
          </p>
          <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif',
            fontWeight:900, fontSize:26, margin:'0 0 4px' }}>
            {score >= 80 ? 'Brilliant!' : score >= 50 ? 'Good Job!' : 'Keep Practicing!'}
          </p>
          <p style={{ color:'#3B82F6', fontFamily:'Poppins,sans-serif',
            fontWeight:900, fontSize:48, margin:'0 0 16px' }}>{score}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { label:'Correct', val: results.filter(r=>r.selected===r.correct).length, icon:'✅' },
              { label:'Best Combo', val:`x${combo}`, icon:'🔥' },
              { label:'Coins', val:`+${Math.round(score/5)}`, icon:'🪙' },
            ].map((s,i) => (
              <div key={i} style={{
                background:'rgba(255,255,255,0.08)',
                border:'1px solid rgba(255,255,255,0.12)',
                borderRadius:14, padding:'12px 8px', textAlign:'center',
              }}>
                <p style={{ fontSize:20, margin:'0 0 4px' }}>{s.icon}</p>
                <p style={{ color:'#fff', fontWeight:900, fontSize:18, margin:0 }}>{s.val}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:9 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Answer review */}
        <div style={{ background:'rgba(255,255,255,0.05)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:18, padding:16, marginBottom:16 }}>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:11,
            fontWeight:700, margin:'0 0 12px', letterSpacing:'1px' }}>REVIEW</p>
          {results.map((r,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10,
              padding:'8px 0',
              borderBottom: i<results.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <span style={{ fontSize:16 }}>
                {r.selected === r.correct ? '✅' : '❌'}
              </span>
              <div style={{ flex:1 }}>
                <p style={{ color:'rgba(255,255,255,0.8)', fontSize:11,
                  margin:'0 0 2px', lineHeight:1.4 }}>{r.q}</p>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:9, margin:0 }}>
                  {r.fact}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button onClick={() => {
            setPhase('intro'); setQIdx(0); setSelected(null);
            setRevealed(false); setScore(0); setCombo(0);
            setTimeLeft(TOTAL_TIME); setResults([]);
          }} style={{
            padding:'14px', background:'linear-gradient(135deg,#3B82F6,#1D4ED8)',
            border:'none', borderRadius:14, color:'#fff',
            fontWeight:800, fontSize:14, cursor:'pointer',
            boxShadow:'0 4px 16px #3B82F644',
          }}>🔄 Play Again</button>
          <button onClick={shareResult} style={{
            padding:'14px', background:'rgba(255,255,255,0.08)',
            border:'1px solid rgba(255,255,255,0.15)',
            borderRadius:14, color:'#fff',
            fontWeight:700, fontSize:14, cursor:'pointer',
          }}>📤 Share Score</button>
        </div>
        <button onClick={() => navigate('/student/games')} style={{
          width:'100%', marginTop:10, padding:'12px',
          background:'transparent', border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:14, color:'rgba(255,255,255,0.4)',
          fontSize:13, cursor:'pointer',
        }}>← Back to Games Hub</button>
      </div>
    </div>
  )

  // ── PLAYING ──────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:bg, fontFamily:'Inter,sans-serif' }}>
      <ParticleBurst active={burst} color="#3B82F6"/>
      <ComboFire combo={combo}/>
      {popup && <ScorePopup points={popup.pts} correct={popup.correct} x={50} y={35}/>}

      <GameHeader
        title="GK Blitz" emoji="🇮🇳"
        score={score} combo={combo}
        timeLeft={timeLeft} totalTime={TOTAL_TIME}
        questNum={qIdx+1} totalQuest={questions.length}
        accent="#3B82F6"
        onExit={() => navigate('/student/games')}
      />

      <div style={{ maxWidth:600, margin:'0 auto', padding:'16px' }}>
        {/* Progress dots */}
        <div style={{ display:'flex', gap:4, marginBottom:20, justifyContent:'center' }}>
          {questions.map((_,i) => (
            <div key={i} style={{
              width: i===qIdx ? 24 : 8, height:8, borderRadius:4,
              background: i < qIdx
                ? (results[i]?.selected===results[i]?.correct ? '#4ADE80' : '#F87171')
                : i===qIdx ? '#3B82F6' : 'rgba(255,255,255,0.20)',
              transition:'all 0.3s ease',
              boxShadow: i===qIdx ? '0 0 8px #3B82F6' : 'none',
            }}/>
          ))}
        </div>

        {/* XP bar */}
        <div style={{ marginBottom:16 }}>
          <XPBar current={score} max={100} color="#3B82F6" label={`Score → ${score} pts`}/>
        </div>

        {/* Question card */}
        <div style={{
          background:'rgba(255,255,255,0.07)',
          backdropFilter:'blur(20px)',
          border:'1px solid rgba(59,130,246,0.3)',
          borderRadius:20, padding:'20px',
          marginBottom:14,
          boxShadow:'0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12 }}>
            <span style={{
              background:'rgba(59,130,246,0.2)',
              color:'#3B82F6', fontSize:10, fontWeight:700,
              padding:'3px 10px', borderRadius:20,
              border:'1px solid rgba(59,130,246,0.3)',
            }}>GK</span>
            <span style={{ color:'rgba(255,255,255,0.3)', fontSize:10 }}>
              Combo {combo > 0 ? `🔥x${combo}` : '—'}
            </span>
          </div>
          <p style={{ color:'#fff', fontSize:16, fontWeight:600,
            lineHeight:1.6, margin:0 }}>{q.q}</p>
        </div>

        {/* Options */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {q.opts.map((opt, i) => (
            <AnswerOption key={i}
              option={opt} index={i}
              selected={selected===i}
              correct={revealed && i===q.ans}
              wrong={revealed && i!==q.ans}
              revealed={revealed}
              disabled={revealed}
              onClick={() => handleAnswer(i)}
            />
          ))}
        </div>

        {/* Fact reveal */}
        {revealed && (
          <div style={{
            marginTop:14,
            background:'rgba(74,222,128,0.1)',
            border:'1px solid rgba(74,222,128,0.3)',
            borderRadius:14, padding:'12px 16px',
            animation:'fact-slide 0.3s ease',
          }}>
            <p style={{ color:'#4ADE80', fontWeight:700,
              fontSize:11, margin:'0 0 4px' }}>💡 Did you know?</p>
            <p style={{ color:'rgba(255,255,255,0.7)',
              fontSize:12, margin:0, lineHeight:1.6 }}>{q.fact}</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fact-slide {
          from { transform:translateY(10px); opacity:0; }
          to   { transform:translateY(0); opacity:1; }
        }
      `}</style>
    </div>
  )
}
