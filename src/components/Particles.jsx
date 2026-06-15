import { useMemo } from 'react'

export default function Particles({ count = 25 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      dur: Math.random() * 3 + 3,
      opacity: Math.random() * 0.4 + 0.1,
    })), [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full bg-[var(--color-accent, #D4AF37)]"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            opacity: p.opacity,
            animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }} />
      ))}
    </div>
  )
}
