import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function Ring({ exam, delay }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)
  const r = 48, circ = 2 * Math.PI * r
  const color = exam.readiness >= 70 ? 'var(--color-success, #22C55E)' : exam.readiness >= 40 ? 'var(--color-accent, #D4AF37)' : 'var(--color-error, #EF4444)'

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border, #E2E8F0)" strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={animated ? circ * (1 - exam.readiness / 100) : circ}
            style={{ transition: `stroke-dashoffset 1.5s ease ${delay * 0.2}s` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-xl text-[var(--color-primary, #1E3A5F)] font-poppins">{exam.readiness}%</span>
          <span className="text-xs text-slate-500">Ready</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-[var(--color-primary, #1E3A5F)] text-center leading-tight">{exam.name}</p>
      <p className="text-xs text-slate-500">{exam.examDate}</p>
    </div>
  )
}

export default function ExamReadinessWidget() {
  const { user } = useAuth()
  return (
    <div className="clay rounded-3xl p-6 col-span-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg font-poppins">🎯 Exam Readiness</h3>
        <span className="glass-gold px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--color-primary, #1E3A5F)]">
          Predicted: 145–162 / 200 · ON TRACK ✅
        </span>
      </div>
      <div className="flex flex-wrap justify-around gap-6">
        {user?.exams.slice(0, 3).map((exam, i) => (
          <Ring key={exam.id} exam={exam} delay={i} />
        ))}
      </div>
    </div>
  )
}
