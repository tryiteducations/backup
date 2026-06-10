import { useEffect } from 'react'

export default function useReveal(threshold = 0.12) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-s')
    if (!els.length) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target) }
      }),
      { threshold }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [threshold])
}
