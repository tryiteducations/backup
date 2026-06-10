#!/bin/bash
# Fixes: 1) Logo animation  2) Pages stuck on loading

ROOT="${1:-/workspaces/Tatu}"
cd "$ROOT"

echo "Writing logo files..."

# ── LogoAnimated.jsx ─────────────────────────────────────────────
cat > src/components/LogoAnimated.jsx << 'EOF'
import { useEffect, useState } from 'react'

export default function LogoAnimated({ size = 'md', mode = 'auto', dark = true, onComplete }) {
  const [phase, setPhase] = useState('hidden')

  const SIZES = {
    sm:     { width: 100 },
    md:     { width: 140 },
    lg:     { width: 200 },
    xl:     { width: 280 },
    splash: { width: 320 },
  }
  const W = SIZES[size]?.width || 140
  const H = Math.round(W * 0.68)

  useEffect(() => {
    if (mode === 'static') { setPhase('done'); return }
    const timers = [
      setTimeout(() => setPhase('rays'),       100),
      setTimeout(() => setPhase('arrow'),      350),
      setTimeout(() => setPhase('text'),       600),
      setTimeout(() => setPhase('educations'), 900),
      setTimeout(() => setPhase('done'),      1300),
    ]
    const done = setTimeout(() => {
      onComplete?.()
      if (mode === 'loop') setPhase('hidden')
    }, 2000)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [mode, onComplete])

  useEffect(() => {
    if (mode === 'loop' && phase === 'hidden') {
      const t = setTimeout(() => setPhase('rays'), 500)
      return () => clearTimeout(t)
    }
  }, [phase, mode])

  const show = (p) => {
    const order = ['rays','arrow','text','educations','done']
    return order.indexOf(phase) >= order.indexOf(p)
  }

  const NAVY = dark ? '#FFFFFF' : '#1E3A5F'
  const GOLD = '#D4AF37'

  const sunCX = W * 0.62
  const sunCY = H * 0.32
  const sunR  = W * 0.12

  const rayAngles = [-80,-55,-30,-5,15,35,60,85,-105]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id="gGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#D4AF37"/>
          <stop offset="50%"  stopColor="#F5D76E"/>
          <stop offset="100%" stopColor="#C9A020"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sun body */}
      <ellipse cx={sunCX} cy={sunCY + sunR * 0.3}
        rx={sunR} ry={sunR * 0.62}
        fill="url(#gGold)" filter="url(#glow)"
        style={{ opacity: show('rays') ? 1 : 0,
          transform: `scale(${show('rays') ? 1 : 0.2})`,
          transformOrigin: `${sunCX}px ${sunCY}px`,
          transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}
      />

      {/* Sun rays */}
      {rayAngles.map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180
        const x1 = sunCX + Math.cos(rad) * sunR * 1.3
        const y1 = sunCY + Math.sin(rad) * sunR * 1.3
        const x2 = sunCX + Math.cos(rad) * sunR * (i % 2 === 0 ? 1.8 : 2.1)
        const y2 = sunCY + Math.sin(rad) * sunR * (i % 2 === 0 ? 1.8 : 2.1)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="url(#gGold)" strokeWidth={i%2===0 ? 2 : 1.4} strokeLinecap="round"
            style={{ opacity: show('rays') ? 1 : 0,
              transform: `scale(${show('rays') ? 1 : 0})`,
              transformOrigin: `${sunCX}px ${sunCY}px`,
              transition: `all 0.4s ease ${i * 0.03}s` }}
          />
        )
      })}

      {/* Arrow shaft */}
      <line
        x1={sunCX + sunR * 0.5} y1={sunCY + sunR * 0.1}
        x2={sunCX + sunR * 1.5} y2={sunCY - sunR * 1.2}
        stroke="url(#gGold)" strokeWidth={2.5} strokeLinecap="round"
        style={{ opacity: show('arrow') ? 1 : 0,
          strokeDasharray: sunR * 3,
          strokeDashoffset: show('arrow') ? 0 : sunR * 3,
          transition: 'all 0.4s ease' }}
      />
      {/* Arrow head */}
      <polygon
        points={`
          ${sunCX + sunR * 1.5},${sunCY - sunR * 1.2}
          ${sunCX + sunR * 1.1},${sunCY - sunR * 1.0}
          ${sunCX + sunR * 1.3},${sunCY - sunR * 0.7}
        `}
        fill="url(#gGold)"
        style={{ opacity: show('arrow') ? 1 : 0, transition: 'opacity 0.3s ease 0.3s' }}
      />

      {/* TRY */}
      <text x={W * 0.02} y={H * 0.78}
        fontFamily="'Arial Black',Impact,sans-serif"
        fontWeight="900" fontSize={W * 0.30} fill={NAVY}
        style={{ opacity: show('text') ? 1 : 0,
          transform: `translateX(${show('text') ? 0 : -20}px)`,
          transition: 'all 0.4s ease' }}>
        TRY
      </text>

      {/* IT */}
      <text x={W * 0.59} y={H * 0.78}
        fontFamily="'Arial Black',Impact,sans-serif"
        fontWeight="900" fontSize={W * 0.30} fill="url(#gGold)" filter="url(#glow)"
        style={{ opacity: show('text') ? 1 : 0,
          transform: `translateX(${show('text') ? 0 : 20}px)`,
          transition: 'all 0.4s ease 0.1s' }}>
        IT
      </text>

      {/* Top gold line */}
      <rect x={W * 0.02} y={H * 0.82} width={W * 0.96} height={2} rx={1}
        fill="url(#gGold)"
        style={{ opacity: show('educations') ? 1 : 0,
          transform: `scaleX(${show('educations') ? 1 : 0})`,
          transformOrigin: `${W * 0.5}px 0`,
          transition: 'all 0.4s ease' }}
      />

      {/* EDUCATIONS */}
      <text x={W * 0.5} y={H * 0.95}
        textAnchor="middle"
        fontFamily="Arial,sans-serif"
        fontWeight="700" fontSize={W * 0.092}
        letterSpacing={W * 0.024}
        fill="url(#gGold)"
        style={{ opacity: show('educations') ? 1 : 0,
          transition: 'opacity 0.4s ease' }}>
        EDUCATIONS
      </text>

      {/* Bottom gold line */}
      <rect x={W * 0.02} y={H * 0.97} width={W * 0.96} height={1.5} rx={1}
        fill="url(#gGold)"
        style={{ opacity: show('educations') ? 1 : 0,
          transform: `scaleX(${show('educations') ? 1 : 0})`,
          transformOrigin: `${W * 0.5}px 0`,
          transition: 'all 0.4s ease 0.1s' }}
      />
    </svg>
  )
}
EOF

# ── Logo.jsx ──────────────────────────────────────────────────────
cat > src/components/Logo.jsx << 'EOF'
import { useState } from 'react'
import LogoAnimated from './LogoAnimated'

export default function Logo({
  height = 44, dark = false,
  animated = false, loop = false,
  size = 'md', onComplete,
}) {
  const [imgError, setImgError] = useState(false)

  if (animated || imgError) {
    return (
      <LogoAnimated
        size={size}
        mode={loop ? 'loop' : animated ? 'auto' : 'static'}
        dark={dark}
        onComplete={onComplete}
      />
    )
  }

  return (
    <img
      src="/tryit-logo.webp"
      alt="TryIT Educations"
      style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }}
      onError={() => setImgError(true)}
    />
  )
}
EOF

# ── Splash.jsx ────────────────────────────────────────────────────
cat > src/pages/Splash.jsx << 'EOF'
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
EOF

echo ""
echo "✅ Logo files written."
echo ""

# ── Fix pages stuck on loading ────────────────────────────────────
echo "Fixing pages stuck on loading..."

# The loading issue happens because some pages import from
# context files that may not be set up. The safest fix:
# Make ThemeContext and ToastContext bulletproof.

cat > src/context/ThemeContext.jsx << 'EOF'
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext({})

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(
    () => localStorage.getItem('tryit_theme') || 'classic-navy'
  )
  useEffect(() => {
    localStorage.setItem('tryit_theme', activeTheme)
  }, [activeTheme])
  return (
    <ThemeCtx.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
EOF

cat > src/context/ToastContext.jsx << 'EOF'
import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext({})

const COLORS = {
  success: '#22C55E', error: '#EF4444',
  info: '#1E3A5F', warning: '#F59E0B', coin: '#D4AF37',
}
const ICONS = {
  success:'✅', error:'❌', info:'ℹ️', warning:'⚠️', coin:'🪙',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((type = 'info', message = '') => {
    const id = Date.now()
    setToasts(p => [...p, { id, type, message }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const dismiss = (id) => setToasts(p => p.filter(t => t.id !== id))

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24,
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        gap: 8, zIndex: 9999, pointerEvents: 'none',
        width: 320,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: COLORS[t.type] || COLORS.info,
            color: '#fff', padding: '12px 16px',
            borderRadius: 16, display: 'flex',
            alignItems: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            pointerEvents: 'auto',
            animation: 'slideUp 0.3s ease',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[t.type]}</span>
            <span style={{ fontSize: 13, fontWeight: 600,
              fontFamily: 'Poppins,sans-serif', flex: 1 }}>
              {t.message}
            </span>
            <button onClick={() => dismiss(t.id)} style={{
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.7)', fontSize: 18,
              cursor: 'pointer', flexShrink: 0,
            }}>×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
EOF

# ── Copy logo to public ───────────────────────────────────────────
if [ -f "/mnt/user-data/uploads/1000307207.webp" ]; then
  cp /mnt/user-data/uploads/1000307207.webp public/tryit-logo.webp
  echo "✅ Logo copied to public/tryit-logo.webp"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ All fixes applied. Now run: npm run dev              ║"
echo "╚══════════════════════════════════════════════════════════╝"
