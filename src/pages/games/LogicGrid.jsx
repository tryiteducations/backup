import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// ── Puzzles ──────────────────────────────────────────────────────
// solution: 4x4 grid. given: cells pre-filled (null = blank/input).
// rowSums and colSums are the clues shown to the player.
const PUZZLES = [
  {
    label: 'Puzzle 1',
    solution: [
      [3, 7, 2, 8],
      [5, 1, 9, 4],
      [6, 4, 3, 7],
      [2, 8, 6, 1],
    ],
    given: [
      [3, null, 2, null],
      [null, 1, null, 4],
      [6, null, null, 7],
      [null, 8, 6, null],
    ],
    rowSums: [20, 19, 20, 17],
    colSums: [16, 20, 20, 20],
  },
  {
    label: 'Puzzle 2',
    solution: [
      [4, 9, 2, 5],
      [7, 3, 8, 1],
      [1, 6, 4, 9],
      [8, 2, 6, 3],
    ],
    given: [
      [4, null, null, 5],
      [null, 3, 8, null],
      [1, null, null, 9],
      [null, 2, 6, null],
    ],
    rowSums: [20, 19, 20, 19],
    colSums: [20, 20, 20, 18],
  },
]

const STATE = { IDLE: 'idle', PLAYING: 'playing', CHECKING: 'checking', DONE: 'done' }

export default function LogicGrid() {
  const { addCoins } = useAuth()
  const navigate = useNavigate()

  const [gameState, setGameState] = useState(STATE.IDLE)
  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [grid, setGrid] = useState([])
  const [errors, setErrors] = useState([]) // array of "r-c" strings
  const [elapsed, setElapsed] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const intervalRef = useRef(null)

  const puzzle = PUZZLES[puzzleIdx]

  // ── Timer (counts up) ────────────────────────────────────────
  useEffect(() => {
    if (gameState === STATE.PLAYING) {
      intervalRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [gameState])

  function startGame(pIdx = 0) {
    const p = PUZZLES[pIdx]
    setPuzzleIdx(pIdx)
    // Init grid: given cells are fixed, blank cells start as ''
    setGrid(p.given.map(row => row.map(v => (v === null ? '' : String(v)))))
    setErrors([])
    setElapsed(0)
    setGameState(STATE.PLAYING)
  }

  function handleCellChange(r, c, val) {
    if (puzzle.given[r][c] !== null) return // fixed cell
    const clean = val.replace(/[^1-9]/g, '').slice(-1)
    setGrid(prev => {
      const next = prev.map(row => [...row])
      next[r][c] = clean
      return next
    })
    // Clear error for this cell on edit
    setErrors(prev => prev.filter(k => k !== `${r}-${c}`))
  }

  function checkSolution() {
    setGameState(STATE.CHECKING)
    const p = puzzle
    const errs = []

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = parseInt(grid[r][c])
        if (isNaN(val) || val !== p.solution[r][c]) {
          errs.push(`${r}-${c}`)
        }
      }
    }

    setErrors(errs)

    if (errs.length === 0) {
      // Solved! Flat 30 + time bonus (max 20, decays by 1 per 5s)
      const timeBonus = Math.max(0, 20 - Math.floor(elapsed / 5))
      const coins = 30 + timeBonus
      addCoins(coins)
      setCoinsEarned(coins)
      setGameState(STATE.DONE)
    } else {
      // Stay in playing so they can fix errors
      setTimeout(() => setGameState(STATE.PLAYING), 100)
    }
  }

  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const BG = 'linear-gradient(135deg, #7C2D12 0%, #9a3412 100%)'

  // ── IDLE ─────────────────────────────────────────────────────
  if (gameState === STATE.IDLE) return (
    <FullScreen bg={BG}>
      <BackBtn onClick={() => navigate('/games')} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🧩</div>
        <h1 style={headingStyle}>Logic Grid</h1>
        <p style={subStyle}>Fill the 4×4 grid so every row and column sums to the given totals.</p>
        <RuleList rules={[
          'Use digits 1–9 in blank cells',
          'Each row and column has a target sum (shown as clues)',
          'Timer counts up — solve faster for a bonus',
          'Solve correctly = 30 coins + up to 20 time bonus',
        ]} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <GoldBtn onClick={() => startGame(0)}>Puzzle 1</GoldBtn>
          <OutlineBtn onClick={() => startGame(1)}>Puzzle 2</OutlineBtn>
        </div>
      </div>
    </FullScreen>
  )

  // ── DONE ─────────────────────────────────────────────────────
  if (gameState === STATE.DONE) return (
    <FullScreen bg={BG}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
        <h1 style={headingStyle}>Puzzle Solved!</h1>
        <div style={{
          background: 'rgba(255,255,255,0.1)', borderRadius: 16,
          padding: '24px 32px', margin: '24px auto', maxWidth: 320,
          display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
        }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 40, color: 'var(--color-accent, #D4AF37)' }}>+{coinsEarned}</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(var(--color-surface-rgb, 255,255,255), 0.6)' }}>COINS EARNED</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            ⏱ Completed in {fmtTime(elapsed)}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            (30 base + {coinsEarned - 30} time bonus)
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {puzzleIdx < PUZZLES.length - 1 && (
            <GoldBtn onClick={() => startGame(puzzleIdx + 1)}>Next Puzzle →</GoldBtn>
          )}
          <GoldBtn onClick={() => startGame(puzzleIdx)}>Try Again</GoldBtn>
          <OutlineBtn onClick={() => navigate('/games')}>Back to Games</OutlineBtn>
        </div>
      </div>
    </FullScreen>
  )

  // ── PLAYING ──────────────────────────────────────────────────
  const hasErrors = errors.length > 0 && gameState !== STATE.PLAYING
  return (
    <FullScreen bg={BG}>
      <BackBtn onClick={() => navigate('/games')} />

      {/* HUD */}
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={hudLabel}>{puzzle.label}</span>
        <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--color-accent, #D4AF37)' }}>
          ⏱ {fmtTime(elapsed)}
        </span>
        <span style={hudLabel}>{errors.length > 0 ? `${errors.length} error${errors.length > 1 ? 's' : ''}` : '✓ Looking good'}</span>
      </div>

      {/* Grid + clues */}
      <div style={{ position: 'relative', margin: '0 auto' }}>
        {/* Column sums — top */}
        <div style={{ display: 'flex', marginBottom: 6, paddingLeft: 36 }}>
          {puzzle.colSums.map((sum, c) => (
            <div key={c} style={{ width: 56, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--color-accent, #D4AF37)' }}>
              Σ{sum}
            </div>
          ))}
        </div>

        {puzzle.solution.map((_, r) => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            {/* Row sum — left */}
            <div style={{ width: 36, fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--color-accent, #D4AF37)', textAlign: 'right', paddingRight: 8 }}>
              Σ{puzzle.rowSums[r]}
            </div>
            {/* Cells */}
            {grid[r]?.map((val, c) => {
              const isFixed = puzzle.given[r][c] !== null
              const isError = errors.includes(`${r}-${c}`)
              return (
                <input
                  key={c}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  readOnly={isFixed}
                  onChange={e => handleCellChange(r, c, e.target.value)}
                  style={{
                    width: 52, height: 52,
                    marginRight: c < 3 ? 6 : 0,
                    textAlign: 'center',
                    fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 22,
                    color: isFixed ? '#fff' : isError ? '#fca5a5' : 'var(--color-accent, #D4AF37)',
                    background: isFixed
                      ? 'rgba(255,255,255,0.15)'
                      : isError
                        ? 'rgba(239,68,68,0.2)'
                        : 'rgba(255,255,255,0.08)',
                    border: isFixed
                      ? '2px solid rgba(255,255,255,0.2)'
                      : isError
                        ? '2px solid #ef4444'
                        : '2px solid rgba(212,175,55,0.4)',
                    borderRadius: 10,
                    outline: 'none',
                    cursor: isFixed ? 'default' : 'text',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Error note */}
      {errors.length > 0 && (
        <div style={{ marginTop: 16, fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#fca5a5', textAlign: 'center' }}>
          {errors.length} cell{errors.length > 1 ? 's are' : ' is'} incorrect — highlighted in red. Keep going!
        </div>
      )}

      {/* Check button */}
      <div style={{ marginTop: 24 }}>
        <GoldBtn onClick={checkSolution}>Check Solution →</GoldBtn>
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
  return <button onClick={onClick} style={{ background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', border: 'none', borderRadius: 14, padding: '14px 28px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--color-primary, #1E3A5F)', cursor: 'pointer', boxShadow: '0 6px 20px rgba(212,175,55,0.4)', marginTop: 8 }}>{children}</button>
}
function OutlineBtn({ onClick, children }) {
  return <button onClick={onClick} style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 14, padding: '14px 28px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', cursor: 'pointer', marginTop: 8 }}>{children}</button>
}
function RuleList({ rules }) {
  return <ul style={{ listStyle: 'none', margin: '20px auto 28px', padding: 0, maxWidth: 360, textAlign: 'left' }}>{rules.map((r, i) => <li key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 8, paddingLeft: 20, position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>{r}</li>)}</ul>
}
const headingStyle = { fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 32, color: '#fff', margin: '0 0 10px' }
const subStyle = { fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 auto 8px', maxWidth: 360 }
const hudLabel = { fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)' }
