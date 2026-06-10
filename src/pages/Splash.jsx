import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoAnimated from '../components/LogoAnimated'

export default function Splash() {
  const navigate = useNavigate()
  const [tagline, setTagline] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  const done = () => {
    setTagline(true)
    setTimeout(() => setFadeOut(true),  1200)
    setTimeout(() => navigate('/landing'), 1900)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#071428,#0F2140,#1E3A5F)',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.7s ease',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background rings */}
      {[300, 520, 740].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: s, height: s, borderRadius: '50%',
          border: `1px solid rgba(212,175,55,${0.08 - i * 0.02})`,
          animation: `ring ${3 + i}s ease-in-out ${i * 0.4}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Animated logo */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <LogoAnimated size="splash" mode="auto" dark={true} onComplete={done} />
      </div>

      {/* Tagline */}
      <p style={{
        fontFamily: 'Inter, sans-serif', fontStyle: 'italic',
        color: 'rgba(212,175,55,0.9)', fontSize: 15,
        letterSpacing: '1.5px', textAlign: 'center',
        marginTop: 20, zIndex: 10,
        opacity: tagline ? 1 : 0,
        transform: `translateY(${tagline ? 0 : 10}px)`,
        transition: 'all 0.6s ease',
      }}>
        Your Exam. Your Rank. Your Success.
      </p>

      {/* Loading dots */}
      <div style={{
        position: 'absolute', bottom: 50,
        display: 'flex', gap: 10, zIndex: 10,
        opacity: tagline ? 1 : 0,
        transition: 'opacity 0.4s ease 0.3s',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(212,175,55,0.6)',
            animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes ring {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(1.05); opacity: 0.3; }
        }
        @keyframes dot {
          0%,100% { transform: translateY(0); opacity: 0.5; }
          50%      { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
