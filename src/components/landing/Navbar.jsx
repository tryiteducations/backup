// TARGET_FILE: src/components/landing/Navbar.jsx
// Compressed logo – fits perfectly without overlap when scrolled

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import LogoAnimated from '../LogoAnimated'
import ThemeSwitcher from '../../components/ThemeSwitcher'

function isDarkColor(hex) {
  if (!hex) return false
  const cleaned = hex.replace('#', '').trim()
  const short = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned
  const int = parseInt(short, 16)
  if (Number.isNaN(int)) return false
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  const normalized = [r, g, b].map((value) => {
    const channel = value / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * normalized[0] + 0.7152 * normalized[1] + 0.0722 * normalized[2] < 0.45
}

export default function Navbar() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const surfaceDark = theme ? isDarkColor(theme.surface || theme.bg) : false
  const navTextColor = surfaceDark ? 'rgba(255,255,255,0.94)' : 'var(--color-text, #1E3A5F)'
  const navControlText = surfaceDark ? 'rgba(255,255,255,0.9)' : 'var(--color-text, rgba(30,58,95,0.95))'
  const navHoverBg = surfaceDark ? 'rgba(255,255,255,0.12)' : 'rgba(212,175,55,0.18)'

  // Compressed logo sizes & navbar heights
  const [logoSz, setLogoSz] = useState('xs')
  const [navH, setNavH] = useState(60)

  const updateSize = () => {
    setLogoSz('xs')
    setNavH(60)
  }

  useEffect(() => {
    updateSize()
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  const links = [
    { label: 'Features',     href: '/landing#features'     },
    { label: 'Exams',        href: '/exams'               },
    { label: 'Pricing',      href: '/pricing'             },
    { label: 'Impact',       href: '/impact'              },
    { label: 'Free Access',  href: '/equity'              },
    { label: 'Institutions', href: '/landing#institutions' },
  ]

  const goTo = (href) => {
    navigate(href)
  }

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        height: navH,
        background: scrolled ? 'var(--navbar-bg-scrolled, rgba(255,255,255,0.92))' : 'var(--navbar-bg, rgba(255,255,255,0.72))',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--navbar-border, rgba(212,175,55,0.18))',
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(12px, 3vw, 24px)',
        gap: 'clamp(8px, 1.5vw, 16px)',
        transition: 'background 0.3s, height 0.2s',
        color: navTextColor,
        boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
      }}>
        {/* Logo – animated, dynamic contrast */}
        <div
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            lineHeight: 0,
            filter: theme && isDarkColor(theme.bg) ? 'drop-shadow(0 4px 18px rgba(0,0,0,0.25))' : 'drop-shadow(0 4px 18px rgba(15,23,42,0.12))',
          }}
        >
          <LogoAnimated size={logoSz} mode="loop" dark={surfaceDark} />
        </div>

        {/* Desktop nav links – hidden on mobile */}
        <div
          className="nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {links.map(l => (
            <button key={l.label} type="button"
              onClick={() => goTo(l.href)}
              style={{
                color: navControlText,
                fontSize: 'clamp(11px, 1.2vw, 13px)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                padding: '6px clamp(6px, 1vw, 10px)',
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                textDecoration: 'none',
                transition: 'color 0.2s, background 0.2s',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = surfaceDark ? 'rgba(255,255,255,0.95)' : 'var(--color-primary-dark, #1E3A5F)'
                e.currentTarget.style.background = navHoverBg
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = navControlText
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right side – live indicator + login button (compressed) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(6px, 1.5vw, 10px)',
            marginLeft: 'auto',
            flexShrink: 0,
          }}
        >
          <ThemeSwitcher dark />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'var(--color-success-bg, rgba(34,197,94,0.1))',
              border: '1px solid var(--color-success-border, rgba(34,197,94,0.25))',
              borderRadius: 16,
              padding: '3px clamp(6px, 1.5vw, 10px)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--color-success, #22C55E)',
                display: 'inline-block',
                animation: 'liveDot 1.4s ease-in-out infinite',
              }}
            />
            <span
              className="live-text"
              style={{
                color: surfaceDark ? 'rgba(255,255,255,0.88)' : 'var(--color-text-light, rgba(30,58,95,0.7))',
                fontSize: 11,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Live
            </span>
          </div>

          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
              border: 'none',
              borderRadius: 'clamp(8px, 1.5vw, 12px)',
              padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 18px)',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(12px, 1.3vw, 14px)',
              color: 'var(--color-primary-dark, #1E3A5F)',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(212,175,55,0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            Login →
          </button>
        </div>
      </nav>

      <style>{`
        @keyframes liveDot {
          0%   { box-shadow: 0 0 0 0   rgba(34,197,94,0.6); }
          70%  { box-shadow: 0 0 0 6px rgba(34,197,94,0);   }
          100% { box-shadow: 0 0 0 0   rgba(34,197,94,0);   }
        }
        @media (max-width: 767px) {
          .nav-links   { display: none !important; }
          .live-text   { display: none !important; }
        }
        @media (max-width: 359px) {
          .live-text { display: none !important; }
        }
      `}</style>
    </>
  )
}