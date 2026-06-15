import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// ── Question generator ───────────────────────────────────────────
function generateQuestion() {
  const ops = ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a, b, correct

  if (op === '+') {
    a = Math.floor(Math.random() * 90) + 10
    b = Math.floor(Math.random() * 90) + 10
    correct = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * 80) + 20
    b = Math.floor(Math.random() * (a - 1)) + 1
    correct = a - b
  } else {
    a = Math.floor(Math.random() * 19) + 2
    b = Math.floor(Math.random() * 19) + 2
    correct = a * b
  }

  // Generate 3 wrong answers, distinct from correct and each other
  const wrongs = new Set()
  while (wrongs.size < 3) {
    const delta = Math.floor(Math.random() * 15) + 1
    const w = Math.random() < 0.5 ? correct + delta : correct - delta
    if (w !== correct && w > 0) wrongs.add(w)
  }

  const options = [...wrongs, correct].sort(() => Math.random() - 0.5)
  return { text: `${a} ${op} ${b}`, correct, options }
}

function generateQuestions(n = 10) {
  return Array.from({ length: n }, generateQuestion)
}

// ── Game states ──────────────────────────────────────────────────
const STATE = { IDLE: 'idle', PLAYING: 'playing', DONE: 'done' }

export default function MathBlitz() {
  const { user, addCoins } = useAuth()
  const navigate = useNavigate()

  const [gameState, setGameState] = useState(STATE.IDLE)
  const [questions, setQuestions] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong'
  const [coinsEarned, setCoinsEarned] = useState(0)

  // ── Timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== STATE.PLAYING) return
    if (timeLeft <= 0) { endGame(score, questions.length); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, timeLeft])

  const endGame = useCallback((finalScore, total) => {
    const coins = finalScore * 5
    addCoins(coins)
    setCoinsEarned(coins)
    setGameState(STATE.DONE)
  }, [addCoins])

  function startGame() {
    const qs = generateQuestions(10)
    setQuestions(qs)
    setQIndex(0)
    setScore(0)
    setTimeLeft(60)
    setSelected(null)
    setFeedback(null)
    setGameState(STATE.PLAYING)
  }

  function handleAnswer(opt) {
    if (selected !== null) return
    const q = questions[qIndex]
    const isCorrect = opt === q.correct
    setSelected(opt)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)

    setTimeout(() => {
      const nextIdx = qIndex + 1
      if (nextIdx >= questions.length) {
        endGame(isCorrect ? score + 1 : score, questions.length)
      } else {
        setQIndex(nextIdx)
        setSelected(null)
        setFeedback(null)
      }
    }, 600)
  }

  const timerPct = (timeLeft / 60) * 100
  const timerColor = timeLeft > 20 ? '#22c55e' : timeLeft > 10 ? '#f59e0b' : '#ef4444'

  // ── IDLE screen ──────────────────────────────────────────────
  if (gameState === STATE.IDLE) {
    return (
      <FullScreen bg="linear-gradient(135deg, var(--color-primary, #1E3A5F) 0%, var(--color-primary-dark, #0F2140) 100%)">
        <BackBtn onClick={() => navigate('/games')} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>⚡</div>
          <h1 style={headingStyle}>Math Blitz</h1>
          <p style={subStyle}>Solve 10 questions in 60 seconds. Every correct answer = 5 coins.</p>
          <RuleList rules={['2-digit arithmetic: +, −, ×', '4 options per question', 'Advance on tap — no going back', 'Max 50 coins per round']} />
          <GoldBtn onClick={startGame}>Start Game →</GoldBtn>
        </div>
      </FullScreen>
    )
  }

  // ── DONE screen ──────────────────────────────────────────────
  if (gameState === STATE.DONE) {
    return (
      <FullScreen bg="linear-gradient(135deg, var(--color-primary, #1E3A5F) 0%, var(--color-primary-dark, #0F2140) 100%)">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>
            {score >= 8 ? '🏆' : score >= 5 ? '🎉' : '💪'}
          </div>
          <h1 style={headingStyle}>
            {score >= 8 ? 'Brilliant!' : score >= 5 ? 'Good Job!' : 'Keep Grinding!'}
          </h1>
          <ScoreBoard score={score} total={10} coins={coinsEarned} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <GoldBtn onClick={startGame}>Play Again</GoldBtn>
            <OutlineBtn onClick={() => navigate('/games')}>Back to Games</OutlineBtn>
          </div>
        </div>
      </FullScreen>
    )
  }

  // ── PLAYING screen ───────────────────────────────────────────
  const q = questions[qIndex]
  return (
    <FullScreen bg="linear-gradient(135deg, var(--color-primary, #1E3A5F) 0%, var(--color-primary-dark, #0F2140) 100%)">
      {/* HUD */}
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
          Q {qIndex + 1}/10
        </div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 24, color: timerColor }}>
          {timeLeft}s
        </div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--color-accent, #D4AF37)' }}>
          ✓ {score}
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto 32px', height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: 3, transition: 'width 1s linear, background 0.3s' }} />
      </div>

      {/* Question */}
      <div style={{
        background: 'rgba(255,255,255,0.08)', borderRadius: 20,
        padding: '32px 24px', textAlign: 'center',
        width: '100%', maxWidth: 480, margin: '0 auto 28px', boxSizing: 'border-box',
      }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 48, color: '#fff', letterSpacing: 2 }}>
          {q.text} = ?
        </div>
      </div>

      {/* Options */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
        width: '100%', maxWidth: 480, margin: '0 auto',
      }}>
        {q.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.1)'
          let border = '1.5px solid rgba(255,255,255,0.15)'
          let color = '#fff'
          if (selected !== null) {
            if (opt === q.correct) { bg = 'rgba(34,197,94,0.25)'; border = '2px solid #22c55e'; color = '#86efac' }
            else if (opt === selected && opt !== q.correct) { bg = 'rgba(239,68,68,0.2)'; border = '2px solid #ef4444'; color = '#fca5a5' }
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              style={{
                background: bg, border, borderRadius: 14,
                padding: '18px', cursor: selected ? 'default' : 'pointer',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 22,
                color, transition: 'all 0.18s',
              }}
            >
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
      minHeight: '100vh', background: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', boxSizing: 'border-box', position: 'relative',
    }}>
      {children}
    </div>
  )
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      position: 'absolute', top: 20, left: 20,
      background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 10, padding: '8px 16px',
      fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#fff',
      cursor: 'pointer',
    }}>← Games</button>
  )
}

function GoldBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
      border: 'none', borderRadius: 14, padding: '14px 32px',
      fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16,
      color: 'var(--color-primary, #1E3A5F)', cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(212,175,55,0.4)', marginTop: 8,
    }}>
      {children}
    </button>
  )
}

function OutlineBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent',
      border: '2px solid rgba(255,255,255,0.3)', borderRadius: 14, padding: '14px 32px',
      fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16,
      color: '#fff', cursor: 'pointer', marginTop: 8,
    }}>
      {children}
    </button>
  )
}

function RuleList({ rules }) {
  return (
    <ul style={{ listStyle: 'none', margin: '20px auto 28px', padding: 0, maxWidth: 300, textAlign: 'left' }}>
      {rules.map((r, i) => (
        <li key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 8, paddingLeft: 20, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 0 }}>•</span>{r}
        </li>
      ))}
    </ul>
  )
}

function ScoreBoard({ score, total, coins }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)', borderRadius: 16,
      padding: '24px 32px', margin: '24px auto',
      maxWidth: 320, display: 'flex', gap: 32, justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 40, color: '#fff' }}>
          {score}<span style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)' }}>/{total}</span>
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>SCORE</div>
      </div>
      <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 40, color: 'var(--color-accent, #D4AF37)' }}>
          +{coins}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>COINS</div>
      </div>
    </div>
  )
}

const headingStyle = { fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 32, color: '#fff', margin: '0 0 10px' }
const subStyle = { fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 auto 8px', maxWidth: 340 }
