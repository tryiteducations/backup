// src/pages/focus-mode/FocusMode.jsx
// NOTE: This page is intentionally NOT wrapped in AppLayout (distraction-free, full-screen)
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SUBJECTS = [
  'Quantitative Aptitude',
  'Reasoning',
  'General Studies',
  'English',
  'Current Affairs',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
]

const THEMES = [
  { id: 'navy', label: 'Deep Focus', bg: 'var(--color-primary-dark, #0F2140)', accent: 'var(--color-accent, #D4AF37)', text: 'var(--color-border, #E2E8F0)', ring: 'var(--color-primary, #1E3A5F)' },
  { id: 'forest', label: 'Forest Calm', bg: '#052E16', accent: '#4ADE80', text: '#D1FAE5', ring: '#064E3B' },
  { id: 'amethyst', label: 'Amethyst', bg: '#1E1030', accent: '#A78BFA', text: '#EDE9FE', ring: '#4C1D95' },
  { id: 'ember', label: 'Ember', bg: '#1C0A00', accent: '#FB923C', text: '#FFEDD5', ring: '#7C2D12' },
]

const WORK_SECS = 25 * 60
const BREAK_SECS = 5 * 60

export default function FocusMode() {
  const { user, addCoins } = useAuth()
  const navigate = useNavigate()

  const [subject, setSubject] = useState(SUBJECTS[0])
  const [themeId, setThemeId] = useState('navy')
  const [phase, setPhase] = useState('work') // 'work' | 'break'
  const [timeLeft, setTimeLeft] = useState(WORK_SECS)
  const [running, setRunning] = useState(false)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)
  const [sessionsTotal, setSessionsTotal] = useState(0)
  const [workSecs, setWorkSecs] = useState(25)
  const [breakSecs, setBreakSecs] = useState(5)
  const [showSettings, setShowSettings] = useState(false)
  const [coinFlash, setCoinFlash] = useState(false)
  const intervalRef = useRef(null)

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0]

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('tryit_focus_sessions') || '0', 10)
    setSessionsTotal(stored)
  }, [])

  const totalSecs = phase === 'work' ? workSecs * 60 : breakSecs * 60
  const pct = timeLeft / totalSecs

  const handleCycleComplete = useCallback(() => {
    setRunning(false)
    clearInterval(intervalRef.current)
    if (phase === 'work') {
      // Completed a work session → give coins, increment
      addCoins(10)
      setCoinFlash(true)
      setTimeout(() => setCoinFlash(false), 2000)
      const newTotal = sessionsTotal + 1
      setSessionsTotal(newTotal)
      localStorage.setItem('tryit_focus_sessions', String(newTotal))
      setCyclesCompleted((c) => c + 1)
      setPhase('break')
      setTimeLeft(breakSecs * 60)
    } else {
      setPhase('work')
      setTimeLeft(workSecs * 60)
    }
  }, [phase, addCoins, sessionsTotal, workSecs, breakSecs])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCycleComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, handleCycleComplete])

  function handleReset() {
    setRunning(false)
    setPhase('work')
    setTimeLeft(workSecs * 60)
  }

  function handleStartPause() {
    setRunning((r) => !r)
  }

  function applySettings() {
    setRunning(false)
    setTimeLeft(workSecs * 60)
    setPhase('work')
    setShowSettings(false)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  // Circular ring dimensions
  const R = 110
  const CIRC = 2 * Math.PI * R

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative transition-colors duration-700"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* Exit button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-5 right-5 text-2xl opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Exit focus mode"
      >
        ✕
      </button>

      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-5 left-5 text-xl opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Settings"
      >
        ⚙️
      </button>

      {/* Coin flash */}
      {coinFlash && (
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-sm font-bold animate-bounce"
          style={{ backgroundColor: theme.accent, color: theme.bg }}
        >
          🪙 +10 coins earned!
        </div>
      )}

      {/* Phase label */}
      <p
        className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-60"
        style={{ color: theme.accent }}
      >
        {phase === 'work' ? `Studying · ${subject}` : 'Short Break'}
      </p>

      {/* Timer ring */}
      <div className="relative flex items-center justify-center mb-8">
        <svg width="280" height="280" viewBox="0 0 280 280">
          {/* Track */}
          <circle
            cx="140" cy="140" r={R}
            fill="none"
            stroke={theme.ring}
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="140" cy="140" r={R}
            fill="none"
            stroke={theme.accent}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - pct)}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '140px 140px', transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold leading-none"
            style={{ fontFamily: 'Poppins, sans-serif', fontSize: '3.5rem', color: theme.text }}
          >
            {mins}:{secs}
          </span>
          <span className="text-sm opacity-50 mt-1">
            {phase === 'work' ? `${cyclesCompleted} session${cyclesCompleted !== 1 ? 's' : ''} done` : 'Take a breather'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg opacity-50 hover:opacity-100 transition-all"
          style={{ border: `2px solid ${theme.ring}` }}
        >
          ↺
        </button>
        <button
          onClick={handleStartPause}
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl transition-all hover:scale-105"
          style={{ backgroundColor: theme.accent, color: theme.bg }}
        >
          {running ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => { setPhase(phase === 'work' ? 'break' : 'work'); setTimeLeft(phase === 'work' ? breakSecs * 60 : workSecs * 60); setRunning(false) }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg opacity-50 hover:opacity-100 transition-all"
          style={{ border: `2px solid ${theme.ring}` }}
        >
          ⏭
        </button>
      </div>

      {/* Stats row */}
      <div
        className="flex items-center gap-8 text-center text-sm opacity-70 mb-8"
      >
        <div>
          <p className="font-bold text-lg" style={{ color: theme.accent }}>{sessionsTotal}</p>
          <p>total sessions</p>
        </div>
        <div className="w-px h-8 opacity-20" style={{ backgroundColor: theme.text }} />
        <div>
          <p className="font-bold text-lg" style={{ color: theme.accent }}>{Math.round(sessionsTotal * workSecs / 60 * 10) / 10}h</p>
          <p>hours focused</p>
        </div>
        <div className="w-px h-8 opacity-20" style={{ backgroundColor: theme.text }} />
        <div>
          <p className="font-bold text-lg" style={{ color: theme.accent }}>{sessionsTotal * 10}</p>
          <p>coins earned</p>
        </div>
      </div>

      {/* Subject selector */}
      <div className="flex flex-wrap justify-center gap-2 max-w-md px-4 mb-6">
        {SUBJECTS.slice(0, 6).map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
            style={{
              backgroundColor: subject === s ? theme.accent : theme.ring,
              color: subject === s ? theme.bg : theme.text,
              opacity: subject === s ? 1 : 0.5,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Theme selector */}
      <div className="flex gap-3">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setThemeId(t.id)}
            className="w-7 h-7 rounded-full transition-all border-2"
            style={{
              backgroundColor: t.accent,
              borderColor: themeId === t.id ? 'white' : 'transparent',
              opacity: themeId === t.id ? 1 : 0.5,
            }}
            title={t.label}
          />
        ))}
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Timer Settings
            </h3>

            <label className="block mb-4">
              <span className="text-sm text-gray-600 font-medium">Work duration (minutes)</span>
              <input
                type="number" min={1} max={90}
                value={workSecs}
                onChange={(e) => setWorkSecs(Math.max(1, Math.min(90, Number(e.target.value))))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-[var(--color-primary, #1E3A5F)] font-semibold focus:outline-none focus:border-[var(--color-primary, #1E3A5F)]"
              />
            </label>

            <label className="block mb-6">
              <span className="text-sm text-gray-600 font-medium">Break duration (minutes)</span>
              <input
                type="number" min={1} max={30}
                value={breakSecs}
                onChange={(e) => setBreakSecs(Math.max(1, Math.min(30, Number(e.target.value))))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-[var(--color-primary, #1E3A5F)] font-semibold focus:outline-none focus:border-[var(--color-primary, #1E3A5F)]"
              />
            </label>

            <label className="block mb-6">
              <span className="text-sm text-gray-600 font-medium">Subject</span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-[var(--color-primary, #1E3A5F)] font-semibold focus:outline-none focus:border-[var(--color-primary, #1E3A5F)]"
              >
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-semibold hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={applySettings}
                className="flex-1 py-2.5 rounded-xl bg-[var(--color-primary, #1E3A5F)] text-white font-semibold hover:bg-[var(--color-primary-dark, #0F2140)] transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
