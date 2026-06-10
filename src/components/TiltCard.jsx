import { useRef } from 'react'

export default function TiltCard({ children, intensity = 10 }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2, cy = rect.height / 2
    const rX = ((y - cy) / cy) * -intensity
    const rY = ((x - cx) / cx) * intensity
    el.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.02)`
  }

  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: 'transform 0.3s ease', transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  )
}
