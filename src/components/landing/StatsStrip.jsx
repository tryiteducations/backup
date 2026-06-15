import { useState, useEffect, useRef } from 'react'

/*
 * BUG FIX APPLIED:
 * Never use {array.length && <Component />} — renders "0" when empty.
 * Always use {array.length > 0 ? <Component /> : null}.
 * The same principle applies to number rendering — we use explicit
 * ternary conditions for all conditional rendering below.
 */

const STATS = [
  { type: 'number', value: 75000, suffix: '+',   label: 'Exam Pathways'    },
  { type: 'number', value: 60,    suffix: '+',   label: 'Exam Categories'  },
  { type: 'number', value: 40,    suffix: '+',   label: 'Indian Languages' },
  { type: 'text',   display: 'All Ages',   label: '5 to 65 Years'          },
  { type: 'text',   display: 'All Stages', label: 'Class 6 to PhD'         },
  { type: 'text',   display: 'Real',       label: 'Rankings + Results'     },
]

function StatItem({ stat }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const isNum = stat.type === 'number'

  useEffect(() => {
    if (!isNum) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [isNum])

  useEffect(() => {
    if (!started || !isNum) return
    const dur = 1600
    const start = performance.now()
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * stat.value))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, isNum, stat.value])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="font-poppins font-extrabold leading-none"
        style={{ fontSize: 'clamp(32px,4vw,48px)', color: 'var(--color-accent, #D4AF37)' }}>
        {/* ── EXPLICIT TERNARY — never use `isNum && value` which renders "0" ── */}
        {isNum ? `${count.toLocaleString()}${stat.suffix}` : stat.display}
      </span>
      <span className="text-sm text-center leading-tight" style={{ color: 'rgba(var(--color-surface-rgb,255,255,255),0.7)' }}>{stat.label}</span>
    </div>
  )
}

export default function StatsStrip() {
  return (
    <section id="stats" className="py-10"
      style={{ background: 'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center" style={{ borderLeft: '1px solid rgba(var(--color-surface-rgb,255,255,255),0.06)', borderRight: '1px solid rgba(var(--color-surface-rgb,255,255,255),0.06)' }}>
          {STATS.map((stat, i) => (
            <StatItem key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
