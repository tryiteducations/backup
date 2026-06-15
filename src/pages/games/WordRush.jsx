import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// ── Word rounds — exam-vocab focused ────────────────────────────
// Each entry: correct spelling + 3 common misspellings
const WORD_ROUNDS = [
  { correct: 'Entrepreneur', wrong: ['Entrepeneur', 'Entrepenuer', 'Entrepreneurr'] },
  { correct: 'Accommodation', wrong: ['Accomodation', 'Acommodation', 'Accommodetion'] },
  { correct: 'Bureaucracy', wrong: ['Beurocracy', 'Burocracy', 'Bureaocracy'] },
  { correct: 'Surveillance', wrong: ['Surveliance', 'Surveillence', 'Surveilance'] },
  { correct: 'Conscientious', wrong: ['Consciencious', 'Conscentious', 'Consciencous'] },
  { correct: 'Miscellaneous', wrong: ['Miscellanious', 'Miscelaneous', 'Miscellaneeous'] },
  { correct: 'Privilege', wrong: ['Priviledge', 'Privelege', 'Privilige'] },
  { correct: 'Occurrence', wrong: ['Occurence', 'Ocurrence', 'Occurance'] },
  { correct: 'Acquaintance', wrong: ['Aquaintance', 'Acquantance', 'Acquaintence'] },
  { correct: 'Conscientious', wrong: ['Consciensious', 'Conscentous', 'Conciencious'] },
  { correct: 'Parliament', wrong: ['Parliment', 'Parlamente', 'Parlyment'] },
  { correct: 'Millennium', wrong: ['Millenium', 'Milennium', 'Millenniom'] },
]

function buildRounds() {
  const shuffled = [...WORD_ROUNDS].sort(() => Math.random() - 0.5).slice(0, 10)
  return shuffled.map(r => {
    const opts = [...r.wrong, r.correct].sort(() => Math.random() - 0.5)
    return { correct: r.correct, options: opts }
  })
}

const STATE = { IDLE: 'idle', PLAYING: 'playing', DONE: 'done' }
const TOTAL_TIME = 30

export default function WordRush() {
  const { addCoins } = useAuth()
  const navigate = useNavigate()

  const [gameState, setGameState] = useState(STATE.IDLE)
  const [rounds, setRounds] = useState([])
  const [rIndex, setRIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [selected, setSelected] = useState(null)
  const [coinsEarned, setCoinsEarned] = useState(0)

  useEffect(() => {
    if (gameState !== STATE.PLAYING) return
    if (timeLeft <= 0) { finish(score); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, timeLeft])

  function finish(finalScore) {
    const coins = finalScore * 3
    addCoins(coins)
    setCoinsEarned(coins)
    setGameState(STATE.DONE)
  }

  function startGame() {
    setRounds(buildRounds())
    setRIndex(0)
    setScore(0)
    setTimeLeft(TOTAL_TIME)
    setSelected(null)
    setGameState(STATE.PLAYING)
  }

  function handlePick(opt) {
    if (selected !== null) return
    const r = rounds[rIndex]
    const isCorrect = opt === r.correct
    setSelected(opt)
    if (isCorrect) setScore(s => s + 1)

    setTimeout(() => {
      const next = rIndex + 1
      if (next >= rounds.length) {
        finish(isCorrect ? score + 1 : score)
      } else {
        setRIndex(next)
        setSelected(null)
      }
    }, 700)
  }

  const timerColor = timeLeft > 15 ? '#22c55e' : timeLeft > 8 ? '#f59e0b' : '#ef4444'
  const BG = 'linear-gradient(135deg, #064E3B 0%, #065f46 100%)'

  if (gameState === STATE.IDLE) return (
    <FullScreen bg={BG}>
      <BackBtn onClick={() => navigate('/games')} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>📝</div>
        <h1 style={headingStyle}>Word Rush</h1>
        <p style={subStyle}>Find the correctly spelled word. 10 rounds, 30 seconds total.</p>
        <RuleList rules={['3 misspellings, 1 correct word', 'Tap instantly — timer is shared', 'Exam-level vocabulary', 'Each correct answer = 3 coins']} />
        <GoldBtn onClick={startGame}>Start Game →</GoldBtn>
      </div>
    </FullScreen>
  )

  if (gameState === STATE.DONE) return (
    <FullScreen bg={BG}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{score >= 8 ? '🏆' : score >= 5 ? '🎉' : '📖'}</div>
        <h1 style={headingStyle}>{score >= 8 ? 'Superb!' : score >= 5 ? 'Well Done!' : 'Keep Practising!'}</h1>
        <ScoreBoard score={score} total={10} coins={coinsEarned} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <GoldBtn onClick={startGame}>Play Again</GoldBtn>
          <OutlineBtn onClick={() => navigate('/games')}>Back to Games</OutlineBtn>
        </div>
      </div>
    </FullScreen>
  )

  const r = rounds[rIndex]
  return (
    <FullScreen bg={BG}>
      {/* HUD */}
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto 16px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={hudLabel}>Round {rIndex + 1}/10</span>
        <span style={{ ...hudLabel, color: timerColor, fontSize: 22, fontWeight: 800 }}>{timeLeft}s</span>
        <span style={{ ...hudLabel, color: 'var(--color-accent, #D4AF37)' }}>✓ {score}</span>
      </div>
      {/* Timer bar */}
      <TimerBar pct={(timeLeft / TOTAL_TIME) * 100} color={timerColor} />

      {/* Prompt */}
      <div style={{ textAlign: 'center', margin: '28px 0 24px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(var(--color-surface-rgb, 255,255,255), 0.6)', marginBottom: 8 }}>
          Which word is spelled correctly?
        </div>
      </div>

      {/* Options — vertical stack for readability */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 420, margin: '0 auto' }}>
        {r.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.1)'
          let border = '1.5px solid rgba(255,255,255,0.15)'
          let color = '#fff'
          if (selected !== null) {
            if (opt === r.correct) { bg = 'rgba(34,197,94,0.25)'; border = '2px solid #22c55e'; color = '#86efac' }
            else if (opt === selected) { bg = 'rgba(239,68,68,0.2)'; border = '2px solid #ef4444'; color = '#fca5a5' }
          }
          return (
            <button
              key={i}
              onClick={() => handlePick(opt)}
              style={{
                background: bg, border, borderRadius: 14, padding: '16px 20px',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 18,
                color, cursor: selected ? 'default' : 'pointer',
                letterSpacing: 1, transition: 'all 0.18s', textAlign: 'center',
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

// ── Shared primitives (local copies for full-screen games) ───────

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
      fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#fff', cursor: 'pointer',
    }}>← Games</button>
  )
}

function GoldBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', border: 'none', borderRadius: 14,
      padding: '14px 32px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16,
      color: 'var(--color-primary, #1E3A5F)', cursor: 'pointer', boxShadow: '0 6px 20px rgba(212,175,55,0.4)', marginTop: 8,
    }}>{children}</button>
  )
}

function OutlineBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 14,
      padding: '14px 32px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16,
      color: '#fff', cursor: 'pointer', marginTop: 8,
    }}>{children}</button>
  )
}

function RuleList({ rules }) {
  return (
    <ul style={{ listStyle: 'none', margin: '20px auto 28px', padding: 0, maxWidth: 320, textAlign: 'left' }}>
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
      background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 32px',
      margin: '24px auto', maxWidth: 320, display: 'flex', gap: 32, justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 40, color: '#fff' }}>
          {score}<span style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)' }}>/{total}</span>
        </div>
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

function TimerBar({ pct, color }) {
  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto 8px', height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 1s linear, background 0.3s' }} />
    </div>
  )
}

const headingStyle = { fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 32, color: '#fff', margin: '0 0 10px' }
const subStyle = { fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 auto 8px', maxWidth: 340 }
const hudLabel = { fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)' }
