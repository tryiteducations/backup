import { useState, useEffect, useRef } from 'react'

export default function useCountUp(target, duration = 1500, trigger = true) {
  const [count, setCount] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (!trigger) return
    const startTime = performance.now()
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, trigger])

  return count
}
