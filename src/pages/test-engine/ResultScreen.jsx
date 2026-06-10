import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const SUBS = [
  { name:'Reasoning', acc:85, trend:'up'   },
  { name:'Maths',     acc:80, trend:'up'   },
  { name:'English',   acc:65, trend:'down' },
  { name:'GK',        acc:78, trend:'up'   },
  { name:'Science',   acc:50, trend:'down' },
]

export default function ResultScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { answers = {}, correct = 7, total = 10, timeUsed = 1200 } = location.state || {}
  const wrong   = Object.keys(answers).length - correct
  const skipped = total - Object.keys(answers).length
  const pct = Math.round((correct / total) * 100)

  const [rank,     setRank]     = useState(9999)
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      const dur = 2000, target = 1243, start = performance.now()
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1)
        const e = 1 - Math.pow(1 - p, 4)
        setRank(Math.round(9999 - e * (9999 - target)))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
  const r = 52, circ = 2 * Math.PI * r
  const ringColor = pct >= 75 ? '#22C55E' : pct >= 50 ? '#D4AF37' : '#EF4444'

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">

        {/* Score card */}
        <div ref={ref} className="clay-dark rounded-3xl p-8 mb-6 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 glass-gold px-3 py-1.5 rounded-xl animate-bounce-in">
            <span className="text-[#D4AF37] font-bold text-sm">+30 🪙 earned!</span>
          </div>

          <h2 className="text-white text-2xl font-bold font-poppins mb-6">Test Completed! 🎉</h2>

          {/* Ring */}
          <div className="flex justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                <circle cx="60" cy="60" r={r} fill="none" stroke={ringColor} strokeWidth="10"
                  strokeLinecap="round" strokeDasharray={circ}
                  strokeDashoffset={animated ? circ * (1 - pct / 100) : circ}
                  style={{ transition: 'stroke-dashoffset 1.5s ease 0.3s' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white font-poppins">{pct}%</span>
                <span className="text-white/60 text-xs">Score</span>
              </div>
            </div>
          </div>

          {/* 4 stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[['✅', correct,'Correct'],['❌', wrong,'Wrong'],['⏭️', skipped,'Skipped'],['⏱️', fmt(timeUsed),'Time']].map(([icon, val, label]) => (
              <div key={label} className="bg-white/5 rounded-2xl p-3">
                <p className="text-xl mb-1">{icon}</p>
                <p className="text-xl font-bold text-white font-poppins">{val}</p>
                <p className="text-white/50 text-xs">{label}</p>
              </div>
            ))}
          </div>

          {/* Rank */}
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="text-white/60 text-sm mb-1">All India Rank</p>
            <p className="text-5xl font-black text-[#D4AF37] font-poppins">#{rank.toLocaleString()}</p>
            <p className="text-white/50 text-xs mt-1">SSC CGL · Today's Mock</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/40">You scored higher than</span>
                <span className="text-white/70 font-bold">87% of test takers</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5">
                <div className="bg-[#D4AF37] h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: animated ? '87%' : '0%' }} />
              </div>
            </div>
            <p className="text-white/40 text-xs mt-2">TN: #127 · Coimbatore: #8</p>
          </div>
        </div>

        {/* Subject breakdown */}
        <div className="clay rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins mb-4">Subject Performance</h3>
          {SUBS.map(s => (
            <div key={s.name} className="flex items-center gap-3 mb-3">
              <span className="text-slate-600 text-sm w-20 flex-shrink-0">{s.name}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all duration-1000 ${s.acc >= 80 ? 'bg-green-500' : s.acc >= 70 ? 'bg-[#D4AF37]' : 'bg-amber-500'}`}
                  style={{ width: animated ? `${s.acc}%` : '0%' }} />
              </div>
              <span className="text-sm font-bold text-[#1E3A5F] w-10 text-right">{s.acc}%</span>
              <span className={`text-xs font-bold ${s.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {s.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button onClick={() => navigate('/test-engine/review', { state: { answers } })} className="btn-gold py-4 rounded-2xl font-bold">
            Review Answers
          </button>
          <button onClick={() => navigate('/test-engine')} className="btn-navy py-4 rounded-2xl font-bold">
            Take Another
          </button>
        </div>
        <button onClick={() => { navigator.clipboard?.writeText(`I scored ${pct}% on TryIT Educations! Rank #${rank}. tryiteducations.net`) }}
          className="w-full border-2 border-slate-200 text-slate-600 py-3.5 rounded-2xl font-bold hover:border-[#D4AF37] transition-colors">
          📤 Share Result
        </button>
      </div>
    </AppLayout>
  )
}
