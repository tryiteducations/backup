import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// TODO: Replace with Supabase questions table query once populated
const GK_QUESTIONS = [
  { q: 'Which article of the Indian Constitution abolishes untouchability?', opts: ['Article 14', 'Article 17', 'Article 21', 'Article 23'], ans: 'Article 17' },
  { q: 'The headquarters of the Reserve Bank of India is located in?', opts: ['New Delhi', 'Kolkata', 'Mumbai', 'Chennai'], ans: 'Mumbai' },
  { q: 'Which planet is known as the "Red Planet"?', opts: ['Venus', 'Jupiter', 'Mars', 'Saturn'], ans: 'Mars' },
  { q: 'The Preamble of the Indian Constitution was amended in which year?', opts: ['1971', '1976', '1977', '1952'], ans: '1976' },
  { q: 'Who is the author of "Discovery of India"?', opts: ['Mahatma Gandhi', 'B.R. Ambedkar', 'Jawaharlal Nehru', 'Subhas Chandra Bose'], ans: 'Jawaharlal Nehru' },
  { q: 'Which river is known as the "Sorrow of Bihar"?', opts: ['Ganga', 'Kosi', 'Son', 'Gandak'], ans: 'Kosi' },
  { q: 'The Monetary Policy Committee (MPC) of RBI has how many members?', opts: ['4', '5', '6', '8'], ans: '6' },
  { q: 'Which gas is used in fire extinguishers?', opts: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], ans: 'Carbon Dioxide' },
  { q: 'National Sports Day in India is celebrated on?', opts: ['29 August', '15 August', '5 September', '2 October'], ans: '29 August' },
  { q: 'Which country has the longest coastline in the world?', opts: ['Russia', 'Australia', 'Canada', 'USA'], ans: 'Canada' },
]

const PER_Q_TIME = 30
const STATE = { IDLE: 'idle', PLAYING: 'playing', DONE: 'done' }

export default function GKBlitz() {
  const { addCoins } = useAuth()
  const navigate = useNavigate()

  const [gameState, setGameState] = useState(STATE.IDLE)
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(PER_Q_TIME)
  const [selected, setSelected] = useState(null)
  const [timedOut, setTimedOut] = useState(false)
  const [coinsEarned, setCoinsEarned] = useState(0)

  useEffect(() => {
    if (gameState !== STATE.PLAYING) return
    if (timeLeft <= 0) {
      // Time's up for this question — show correct, then advance
      setTimedOut(true)
      setTimeout(() => advance(false), 1200)
      return
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, timeLeft])

  function startGame() {
    setQIndex(0)
    setScore(0)
    setTimeLeft(PER_Q_TIME)
    setSelected(null)
    setTimedOut(false)
    setGameState(STATE.PLAYING)
  }

  function advance(wasCorrect) {
    const newScore = wasCorrect ? score + 1 : score
    const next = qIndex + 1
    if (next >= GK_QUESTIONS.length) {
      const coins = newScore * 4
      addCoins(coins)
      setCoinsEarned(coins)
      setScore(newScore)
      setGameState(STATE.DONE)
    } else {
      if (wasCorrect) setScore(s => s + 1)
      setQIndex(next)
      setTimeLeft(PER_Q_TIME)
      setSelected(null)
      setTimedOut(false)
    }
  }

  function handleAnswer(opt) {
    if (selected !== null || timedOut) return
    const q = GK_QUESTIONS[qIndex]
    const isCorrect = opt === q.ans
    setSelected(opt)
    setTimeout(() => advance(isCorrect), 800)
  }

  const timerPct = (timeLeft / PER_Q_TIME) * 100
  const timerColor = timeLeft > 15 ? '#22c55e' : timeLeft > 8 ? '#f59e0b' : '#ef4444'
  const BG = 'linear-gradient(135deg, #4C1D95 0%, #3B2A6B 100%)'

  if (gameState === STATE.IDLE) return (
    <FullScreen bg={BG}>
      <BackBtn onClick={() => navigate('/games')} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🌍</div>
        <h1 style={headingStyle}>GK Burst</h1>
        <p style={subStyle}>10 GK questions, 30 seconds per question. Test your general knowledge.</p>
        <RuleList rules={['30 seconds per question', '4 options — one correct', 'No going back once answered', 'Each correct answer = 4 coins']} />
        <GoldBtn onClick={startGame}>Start Game →</GoldBtn>
      </div>
    </FullScreen>
  )

  if (gameState === STATE.DONE) return (
    <FullScreen bg={BG}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{score >= 8 ? '🏆' : score >= 5 ? '🌍' : '📚'}</div>
        <h1 style={headingStyle}>{score >= 8 ? 'GK Master!' : score >= 5 ? 'Good Effort!' : 'Keep Reading!'}</h1>
        <ScoreBoard score={score} total={10} coins={coinsEarned} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <GoldBtn onClick={startGame}>Play Again</GoldBtn>
          <OutlineBtn onClick={() => navigate('/games')}>Back to Games</OutlineBtn>
        </div>
      </div>
    </FullScreen>
  )

  const q = GK_QUESTIONS[qIndex]
  return (
    <FullScreen bg={BG}>
      {/* HUD */}
      <div style={{ width: '100%', maxWidth: 540, margin: '0 auto 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={hudLabel}>Q {qIndex + 1}/10</span>
        <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 22, color: timerColor }}>
          {timedOut ? "Time's up!" : `${timeLeft}s`}
        </span>
        <span style={{ ...hudLabel, color: 'var(--color-accent, #D4AF37)' }}>✓ {score}</span>
      </div>

      {/* Timer bar */}
      <div style={{ width: '100%', maxWidth: 540, margin: '0 auto 24px', height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: 3, transition: 'width 1s linear, background 0.3s' }} />
      </div>

      {/* Question */}
      <div style={{
        background: 'rgba(255,255,255,0.1)', borderRadius: 16,
        padding: '24px 20px', textAlign: 'center',
        width: '100%', maxWidth: 540, margin: '0 auto 24px', boxSizing: 'border-box',
        minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', lineHeight: 1.5 }}>
          {q.q}
        </div>
      </div>

      {/* Options */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        width: '100%', maxWidth: 540, margin: '0 auto',
      }}>
        {q.opts.map((opt, i) => {
          const locked = selected !== null || timedOut
          let bg = 'rgba(255,255,255,0.1)'
          let border = '1.5px solid rgba(255,255,255,0.15)'
          let color = '#fff'
          if (locked) {
            if (opt === q.ans) { bg = 'rgba(34,197,94,0.25)'; border = '2px solid #22c55e'; color = '#86efac' }
            else if (opt === selected) { bg = 'rgba(239,68,68,0.2)'; border = '2px solid #ef4444'; color = '#fca5a5' }
          }
          return (
            <button key={i} onClick={() => handleAnswer(opt)} style={{
              background: bg, border, borderRadius: 12, padding: '14px 12px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14,
              color, cursor: locked ? 'default' : 'pointer', transition: 'all 0.18s',
              lineHeight: 1.4, textAlign: 'center',
            }}>
              {opt}
            </button>
          )
        })}
      </div>
    </FullScreen>
  )
}

// ── Shared primitives ────────────────────────────────────────────
function FullScreen({ bg, children }) {
  return (
    <div style={{
      minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', boxSizing: 'border-box', position: 'relative',
    }}>{children}</div>
  )
}
function BackBtn({ onClick }) {
  return <button onClick={onClick} style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 16px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#fff', cursor: 'pointer' }}>← Games</button>
}
function GoldBtn({ onClick, children }) {
  return <button onClick={onClick} style={{ background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', border: 'none', borderRadius: 14, padding: '14px 32px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--color-primary, #1E3A5F)', cursor: 'pointer', boxShadow: '0 6px 20px rgba(212,175,55,0.4)', marginTop: 8 }}>{children}</button>
}
function OutlineBtn({ onClick, children }) {
  return <button onClick={onClick} style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 14, padding: '14px 32px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', cursor: 'pointer', marginTop: 8 }}>{children}</button>
}
function RuleList({ rules }) {
  return <ul style={{ listStyle: 'none', margin: '20px auto 28px', padding: 0, maxWidth: 320, textAlign: 'left' }}>{rules.map((r, i) => <li key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 8, paddingLeft: 20, position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>{r}</li>)}</ul>
}
function ScoreBoard({ score, total, coins }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 32px', margin: '24px auto', maxWidth: 320, display: 'flex', gap: 32, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 40, color: '#fff' }}>{score}<span style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)' }}>/{total}</span></div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>SCORE</div>
      </div>
      <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 40, color: 'var(--color-accent, #D4AF37)' }}>+{coins}</div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>COINS</div>
      </div>
    </div>
  )
}
const headingStyle = { fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 32, color: '#fff', margin: '0 0 10px' }
const subStyle = { fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 auto 8px', maxWidth: 340 }
const hudLabel = { fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)' }
