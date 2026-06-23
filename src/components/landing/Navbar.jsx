// src/components/landing/Navbar.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import ThemeSwitcher from '../../components/ThemeSwitcher'

function isDarkColor(hex) {
  if (!hex) return false
  const cleaned = hex.replace('#', '').trim()
  const full = cleaned.length === 3 ? cleaned.split('').map(c => c + c).join('') : cleaned
  const int = parseInt(full, 16)
  if (Number.isNaN(int)) return false
  const r = (int >> 16) & 255, g = (int >> 8) & 255, b = int & 255
  const norm = [r, g, b].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * norm[0] + 0.7152 * norm[1] + 0.0722 * norm[2] < 0.45
}

const ROLES = [
  { id: 'student',     label: '🎓 Student'      },
  { id: 'mentor',      label: '🧑‍🏫 Mentor'       },
  { id: 'institution', label: '🏫 Institutions'  },
  { id: 'family',      label: '👨‍👩‍👧 Family'        },
]

export default function Navbar() {
  const navigate    = useNavigate()
  const { theme }   = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [activeRole, setActiveRole] = useState('student')

  const dark = theme ? isDarkColor(theme.surface || theme.bg) : false

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navBg = scrolled
    ? (dark ? 'rgba(0,0,0,0.97)'  : 'rgba(255,255,255,0.97)')
    : (dark ? 'rgba(0,0,0,0.62)'  : 'rgba(255,255,255,0.78)')

  const textCol  = dark ? '#ffffff'                 : 'var(--color-text, #0F1020)'
  const mutedCol = dark ? 'rgba(255,255,255,0.55)' : 'var(--color-text-light, #64748B)'
  const border   = scrolled
    ? 'rgba(var(--color-accent-rgb, 201,168,76), 0.35)'
    : (dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)')

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 500,
        background: navBg, backdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${border}`,
        display: 'flex', alignItems: 'center',
        padding: '10px clamp(12px,3vw,20px)', gap: 8,
        transition: 'background 0.3s, border-color 0.3s',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.12)' : 'none',
      }}>

        {/* ── Logo ── */}
        <div
          onClick={() => navigate('/landing')}
          style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--color-accent,#C9A84C), var(--color-accent-light,#E8C84A))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Poppins,sans-serif', fontWeight: 900, fontSize: 12,
            color: 'var(--color-primary-dark,#0F2140)',
          }}>TI</div>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 15, color: textCol, whiteSpace: 'nowrap' }}>
            Try<span style={{ color: 'var(--color-accent,#C9A84C)' }}>IT</span>
          </span>
        </div>

        {/* ── Role tabs ── */}
        <div className="nav-roles" style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }}>
          {ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => { setActiveRole(r.id); scrollTo(r.id) }}
              style={{
                padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
                border: activeRole === r.id
                  ? '1px solid var(--color-accent,#C9A84C)'
                  : '1px solid rgba(128,128,128,0.18)',
                background: activeRole === r.id
                  ? 'var(--color-accent-glass, rgba(201,168,76,0.14))'
                  : 'transparent',
                color: activeRole === r.id ? 'var(--color-accent,#C9A84C)' : mutedCol,
                fontSize: 11, fontWeight: 700, fontFamily: 'Poppins,sans-serif',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >{r.label}</button>
          ))}
        </div>

        {/* ── Right controls ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* Theme picker — unchanged, keeps lock icons & full dropdown */}
          <ThemeSwitcher dark={dark} />

          {/* Live indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 16, padding: '4px 10px',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#22C55E',
              display: 'inline-block', animation: 'liveDot 1.4s ease-in-out infinite',
            }} />
            <span className="live-text" style={{ color: mutedCol, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>
              Live
            </span>
          </div>

          {/* Login */}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)'}`,
              borderRadius: 11, padding: '7px 14px',
              color: textCol, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Poppins,sans-serif',
            }}
          >Login</button>

          {/* Register Free */}
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(135deg, var(--color-accent,#C9A84C), var(--color-accent-light,#E8C84A))',
              border: 'none', borderRadius: 11, padding: '7px 14px',
              color: 'var(--color-primary-dark,#0F2140)',
              fontSize: 12, fontWeight: 800, cursor: 'pointer',
              fontFamily: 'Poppins,sans-serif', whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(201,168,76,0.45)',
            }}
          >Register Free →</button>

        </div>
      </nav>

      <style>{`
        @keyframes liveDot {
          0%   { box-shadow: 0 0 0 0   rgba(34,197,94,0.6); }
          70%  { box-shadow: 0 0 0 6px rgba(34,197,94,0);   }
          100% { box-shadow: 0 0 0 0   rgba(34,197,94,0);   }
        }
        @media (max-width: 767px) {
          .nav-roles { display: none !important; }
          .live-text { display: none !important; }
        }
      `}</style>
    </>
  )
}
