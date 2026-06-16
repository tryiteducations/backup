// src/components/LogoAnimated.jsx
import { useEffect, useState } from 'react'

function TextLogo({ size }) {
  const heights = { xs: 32, sm: 40, md: 52, lg: 64, xl: 80 }
  const h       = heights[size] || 40
  const trySize = Math.round(h * 0.55)
  const eduSize = Math.round(h * 0.22)
  const gap     = Math.round(h * 0.06)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', gap, lineHeight: 1,
      userSelect: 'none',
    }}>
      {/* TryIT — no gap */}
      <div style={{ display:'flex', alignItems:'baseline', gap: 0 }}>
        <span style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 900,
          fontSize: trySize,
          letterSpacing: -1,
          lineHeight: 1,
          color: 'var(--color-accent, #D4AF37)',
        }}>Try</span>
        <span style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 900,
          fontSize: trySize,
          letterSpacing: -1,
          lineHeight: 1,
          color: 'var(--color-logo-it, var(--color-primary, #1E3A5F))',
        }}>IT</span>
      </div>

      {/* Educations */}
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700,
        fontSize: eduSize,
        letterSpacing: 2.5,
        lineHeight: 1,
        textTransform: 'uppercase',
        color: 'var(--color-accent, #D4AF37)',
        opacity: 0.85,
      }}>Educations</div>
    </div>
  )
}

export default function LogoAnimated({
  size = 'md', mode = 'auto', dark = true, onComplete
}) {
  if (size !== 'splash') return <TextLogo size={size} />
  return <SplashLogo dark={dark} mode={mode} onComplete={onComplete} />
}

function SplashLogo({ dark, mode, onComplete }) {
  const [phase, setPhase] = useState('hidden')

  const W     = 340
  const H     = Math.round(W * 0.82)
  const sunCX = W * 0.595
  const sunCY = H * 0.255
  const sunR  = W * 0.113

  useEffect(() => {
    if (mode === 'static') { setPhase('done'); return }
    const t1 = setTimeout(() => setPhase('rays'),   100)
    const t2 = setTimeout(() => setPhase('arrow'),  360)
    const t3 = setTimeout(() => setPhase('text'),   650)
    const t4 = setTimeout(() => setPhase('lines'),  970)
    const t5 = setTimeout(() => setPhase('done'),  1320)
    const t6 = setTimeout(() => {
      onComplete?.()
      if (mode === 'loop') setPhase('rays')
    }, 2200)
    return () => [t1,t2,t3,t4,t5,t6].forEach(clearTimeout)
  }, [mode, onComplete])

  const show = (p) => {
    const order = ['rays','arrow','text','lines','done']
    return order.indexOf(phase) >= order.indexOf(p)
  }
  const isDone = phase === 'done'
  const RAY_ANGLES = [-95,-75,-55,-35,-15,5,25,45,65,85]
  const TEXT_Y     = H * 0.685
  const LINE_TOP_Y = H * 0.735
  const EDU_Y      = H * 0.855
  const LINE_BOT_Y = H * 0.885

  return (
    <div style={{
      width: 'clamp(220px, 78vw, 340px)',
      maxWidth: '100%', margin: '0 auto',
      lineHeight: 0, display: 'block',
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display:'block', overflow:'visible', maxWidth:'100%' }}>
        <defs>
          <linearGradient id="gGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#B8860B"/>
            <stop offset="45%"  stopColor="#F5D76E"/>
            <stop offset="100%" stopColor="var(--color-accent, #D4AF37)"/>
          </linearGradient>
          <linearGradient id="gNavy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={dark ? '#FFFFFF' : '#2A5298'}/>
            <stop offset="100%" stopColor={dark ? '#C8DCFF' : 'var(--color-primary, #1E3A5F)'}/>
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glowS" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* SUN */}
        <ellipse cx={sunCX} cy={sunCY + sunR * 0.3}
          rx={sunR * 0.95} ry={sunR * 0.6}
          fill="url(#gGold)"
          filter={isDone ? 'url(#glowS)' : 'url(#glow)'}
          style={{
            opacity:   show('rays') ? 1 : 0,
            transform: `scale(${show('rays') ? 1 : 0.1})`,
            transformOrigin: `${sunCX}px ${sunCY}px`,
            transition: 'all 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          }}/>

        {/* RAYS */}
        {RAY_ANGLES.map((angle, i) => {
          const rad   = (angle - 90) * Math.PI / 180
          const major = i % 2 === 0
          return (
            <line key={i}
              x1={sunCX + Math.cos(rad) * sunR * 1.3}
              y1={sunCY + Math.sin(rad) * sunR * 1.3}
              x2={sunCX + Math.cos(rad) * sunR * (major ? 1.85 : 2.2)}
              y2={sunCY + Math.sin(rad) * sunR * (major ? 1.85 : 2.2)}
              stroke="url(#gGold)"
              strokeWidth={major ? 2.4 : 1.4}
              strokeLinecap="round"
              style={{
                opacity: show('rays') ? (isDone ? 0.28 : 1) : 0,
                transform: `scale(${show('rays') ? 1 : 0})`,
                transformOrigin: `${sunCX}px ${sunCY}px`,
                transition: `all 0.4s ease ${i * 0.028}s`,
              }}/>
          )
        })}

        {/* SIGNAL RINGS */}
        {isDone && [0,1,2].map(i => (
          <circle key={i} cx={sunCX} cy={sunCY} r={sunR}
            fill="none"
            stroke="var(--color-accent, #D4AF37)"
            strokeWidth={2}
            style={{
              animation: `sigRing 2.2s ease-out ${i * 0.73}s infinite`,
              transformOrigin: `${sunCX}px ${sunCY}px`,
            }}/>
        ))}

        {/* ARROW */}
        <g style={{
          opacity: show('arrow') ? 1 : 0,
          transition: 'opacity 0.3s ease',
          animation: isDone ? `arrowTravel 2.2s ease-in-out infinite` : 'none',
          transformOrigin: `${sunCX + sunR * 0.7}px ${sunCY - sunR * 0.7}px`,
        }}>
          <line
            x1={sunCX + sunR * 0.38} y1={sunCY + sunR * 0.08}
            x2={sunCX + sunR * 1.62} y2={sunCY - sunR * 1.38}
            stroke="url(#gGold)" strokeWidth={3} strokeLinecap="round"
            filter="url(#glow)"
            style={{
              strokeDasharray: sunR * 5,
              strokeDashoffset: show('arrow') ? 0 : sunR * 5,
              transition: isDone ? 'none' : 'stroke-dashoffset 0.45s ease',
            }}/>
          <polygon
            points={`
              ${sunCX + sunR * 1.62},${sunCY - sunR * 1.38}
              ${sunCX + sunR * 1.10},${sunCY - sunR * 1.14}
              ${sunCX + sunR * 1.36},${sunCY - sunR * 0.66}
            `}
            fill="url(#gGold)" filter="url(#glow)"/>
        </g>

        {/* TRY */}
        <text x={W * 0.015} y={TEXT_Y}
          fontFamily="'Arial Black','Impact','Poppins',sans-serif"
          fontWeight="900" fontSize={W * 0.295}
          letterSpacing={W * 0.006}
          fill="url(#gNavy)"
          style={{
            opacity:   show('text') ? 1 : 0,
            transform: `translateX(${show('text') ? 0 : -28}px)`,
            transition: 'all 0.48s cubic-bezier(0.34,1.56,0.64,1)',
          }}>TRY</text>

        {/* IT */}
        <text x={W * 0.61} y={TEXT_Y}
          fontFamily="'Arial Black','Impact','Poppins',sans-serif"
          fontWeight="900" fontSize={W * 0.295}
          letterSpacing={W * 0.006}
          fill="url(#gGold)" filter="url(#glow)"
          style={{
            opacity:   show('text') ? 1 : 0,
            transform: `translateX(${show('text') ? 0 : 28}px)`,
            transition: 'all 0.48s cubic-bezier(0.34,1.56,0.64,1) 0.08s',
          }}>IT</text>

        {/* TOP LINE */}
        <rect x={W * 0.015} y={LINE_TOP_Y}
          width={W * 0.965} height={2.4} rx={1.2}
          fill="url(#gGold)"
          style={{
            opacity:   show('lines') ? 1 : 0,
            transform: `scaleX(${show('lines') ? 1 : 0})`,
            transformOrigin: `${W * 0.5}px 0`,
            transition: 'all 0.45s ease',
          }}/>

        {/* EDUCATIONS */}
        <text x={W * 0.5} y={EDU_Y}
          textAnchor="middle"
          fontFamily="'Arial','Helvetica Neue',sans-serif"
          fontWeight="800" fontSize={W * 0.086}
          letterSpacing={W * 0.030}
          fill="url(#gGold)"
          style={{
            opacity:   show('lines') ? 1 : 0,
            transform: `translateY(${show('lines') ? 0 : 10}px)`,
            transition: 'all 0.4s ease 0.06s',
          }}>EDUCATIONS</text>

        {/* BOTTOM LINE */}
        <rect x={W * 0.015} y={LINE_BOT_Y}
          width={W * 0.965} height={1.8} rx={0.9}
          fill="url(#gGold)"
          style={{
            opacity:   show('lines') ? 1 : 0,
            transform: `scaleX(${show('lines') ? 1 : 0})`,
            transformOrigin: `${W * 0.5}px 0`,
            transition: 'all 0.45s ease 0.14s',
          }}/>

        <style>{`
          @keyframes sigRing {
            0%   { r: ${sunR * 1.1}px; opacity: 0.9; stroke-width: 2.5px; }
            100% { r: ${sunR * 5.5}px; opacity: 0;   stroke-width: 0.2px; }
          }
          @keyframes arrowTravel {
            0%   { transform: translate(0,0) scale(1);   opacity: 1; }
            60%  { transform: translate(${sunR*1.4}px,${-sunR*1.4}px) scale(0.7); opacity: 0.5; }
            61%  { transform: translate(0,0) scale(0.3); opacity: 0; }
            79%  { transform: translate(0,0) scale(0.3); opacity: 0; }
            100% { transform: translate(0,0) scale(1);   opacity: 1; }
          }
        `}</style>
      </svg>
    </div>
  )
}