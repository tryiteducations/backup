import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoAnimated from '../components/LogoAnimated'
import { useAuth, onboardingKey } from '../context/AuthContext'

const ROLE_HOME = {
  student: '/dashboard',
  mentor: '/mentor-hub',
  institution: '/centre/dashboard',
  family: '/family',
}

export default function Splash() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [animDone, setAnimDone] = useState(false)
  const [showDots, setShowDots] = useState(false)

  function handleAnimComplete() {
    setAnimDone(true)
    // Show pulsing dots briefly before nav fires
    setTimeout(() => setShowDots(true), 100)
  }

  useEffect(() => {
    if (!animDone) return
    if (loading) return // Wait for auth to resolve

    const timer = setTimeout(() => {
      if (!user) {
        navigate('/landing')
        return
      }
      const done = localStorage.getItem(onboardingKey(user.email))
      if (!done) {
        navigate('/onboarding')
        return
      }
      navigate(ROLE_HOME[user.role] ?? '/dashboard')
    }, 500)

    return () => clearTimeout(timer)
  }, [animDone, loading, user, navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--color-primary, #1E3A5F) 0%, #3B2A6B 45%, #5B1A3D 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient rings — decorative only, no animation distraction */}
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        borderRadius: '50%',
        border: '1px solid rgba(212,175,55,0.08)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 400, height: 400,
        borderRadius: '50%',
        border: '1px solid rgba(212,175,55,0.06)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <LogoAnimated size="splash" mode="auto" dark={true} onComplete={handleAnimComplete} />
      </div>

      {/* Pulsing dots — appear after animation completes */}
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          opacity: showDots ? 1 : 0,
          transition: 'opacity 0.4s ease',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--color-accent, #D4AF37)',
              opacity: 0.7,
              animation: `splashPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes splashPulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}