src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()

# Find the existing imports line to add after
old_imports = "import { useState, useEffect, useRef } from 'react'"
new_imports = "import { useState, useEffect, useRef, useCallback } from 'react'"

src = src.replace(old_imports, new_imports)

# Find where the Hero function starts to inject cycle logic
old_hero_start = "export default function Hero() {"
new_hero_start = """export default function Hero() {
  // ── 4-Theme Cycle System ─────────────────────────────────────
  const CYCLES = [
    {
      id: 'jasmine',
      bg: '#F8FAFF', primary: '#1E3A5F', accent: '#2563EB',
      surface: '#FFFFFF', text: '#111827',
      hero: 'Your Exam. Your Rank. Your Success.',
      sub: 'India\'s only platform from Class 1 to SWAYAM',
      label: '🌸 Jasmine at Dawn',
      particleColor: '#2563EB',
      motionType: 'dots',
    },
    {
      id: 'ganges',
      bg: '#030712', primary: '#0D9488', accent: '#14B8A6',
      surface: '#0F172A', text: '#F1F5F9',
      hero: 'Study at Midnight. Rank at Dawn.',
      sub: '42 languages. 1,10,000+ exams. Zero excuses.',
      label: '🌙 Midnight Ganges',
      particleColor: '#14B8A6',
      motionType: 'sparks',
    },
    {
      id: 'lotus',
      bg: '#FFF0F6', primary: '#BE185D', accent: '#EC4899',
      surface: '#FFFFFF', text: '#111827',
      hero: 'Every Dream Deserves a Rank.',
      sub: 'Free for 11 communities. 1 Subscription = 1 Scholarship.',
      label: '🪷 Lotus in Bloom',
      particleColor: '#EC4899',
      motionType: 'petals',
    },
    {
      id: 'saffron',
      bg: '#FFFBEB', primary: '#B45309', accent: '#F59E0B',
      surface: '#FFFFFF', text: '#111827',
      hero: 'Rise with the Sun. Rise in Rank.',
      sub: 'Free tournaments. No ads. No telecalling. Just results.',
      label: '☀️ Saffron Sunrise',
      particleColor: '#F59E0B',
      motionType: 'rays',
    },
  ]
  const CYCLE_DURATION = 20000
  const [cycleIdx, setCycleIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [heroText, setHeroText] = useState(CYCLES[0].hero)
  const [textVisible, setTextVisible] = useState(true)
  const [particles, setParticles] = useState([])
  const cycleRef = useRef(null)
  const progressRef = useRef(null)
  const C = CYCLES[cycleIdx]

  // Particle generator
  const genParticles = useCallback((type, color) => {
    const count = type === 'sparks' ? 18 : type === 'rays' ? 12 : 15
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.3,
      color,
      delay: Math.random() * 3,
    }))
  }, [])

  useEffect(() => {
    setParticles(genParticles(CYCLES[0].motionType, CYCLES[0].particleColor))
  }, [])

  // Progress bar
  useEffect(() => {
    let start = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress((elapsed / CYCLE_DURATION) * 100)
    }, 50)
    return () => clearInterval(progressRef.current)
  }, [cycleIdx])

  // Cycle timer
  useEffect(() => {
    cycleRef.current = setInterval(() => {
      setTextVisible(false)
      setTimeout(() => {
        setCycleIdx(prev => {
          const next = (prev + 1) % CYCLES.length
          setHeroText(CYCLES[next].hero)
          setParticles(genParticles(CYCLES[next].motionType, CYCLES[next].particleColor))
          setProgress(0)
          return next
        })
        setTimeout(() => setTextVisible(true), 100)
      }, 600)
    }, CYCLE_DURATION)
    return () => clearInterval(cycleRef.current)
  }, [])
"""

src = src.replace(old_hero_start, new_hero_start)
print("Hero cycle injected:", "CYCLES" in src)

open("src/components/landing/Hero.jsx", "w", encoding="utf-8").write(src)
print("Done step 1")
