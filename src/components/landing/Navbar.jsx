// src/components/landing/Navbar.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import ThemeSwitcher from '../../components/ThemeSwitcher'

// 5 base themes always free — shown as quick-access dots
const BASE_DOTS = [
  { id:'default',       color:'#D4AF37', label:'Classic'       },
  { id:'midnight',      color:'#818CF8', label:'Midnight'      },
  { id:'sunrise',       color:'#F59E0B', label:'Sunrise'       },
  { id:'ocean',         color:'#0EA5E9', label:'Ocean Deep'    },
  { id:'high-contrast', color:'#e2e2e2', label:'High Contrast' },
]

const ROLES = [
  { id:'student',     label:'🎓 Student'     },
  { id:'mentor',      label:'🧑‍🏫 Mentor'      },
  { id:'institution', label:'🏫 Institutions' },
  { id:'family',      label:'👨‍👩‍👧 Family'       },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { theme, activeTheme, setActiveTheme, applyTheme } = useTheme()
  const [scrolled,    setScrolled]    = useState(false)
  const [activeRole,  setActiveRole]  = useState('student')

  const isDark   = theme?.isDark ?? false
  const accent   = theme?.accent ?? '#D4AF37'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })

  // Dark / light quick toggle
  // Switches between midnight (dark) and default (light)
  const handleDarkToggle = () => {
    if (isDark) { setActiveTheme('default');   applyTheme('default')   }
    else        { setActiveTheme('midnight');  applyTheme('midnight')  }
  }

  const navBg = scrolled
    ? (isDark ? 'rgba(0,0,0,0.97)'           : 'rgba(255,255,255,0.97)')
    : (isDark ? 'rgba(0,0,0,0.62)'           : 'rgba(255,255,255,0.80)')

  const textCol  = isDark ? '#ffffff'                  : 'var(--color-text,#0F1020)'
  const mutedCol = isDark ? 'rgba(255,255,255,0.55)'  : 'var(--color-text-light,#64748B)'

  return (
    <>
      <nav style={{
        position:'sticky', top:0, zIndex:500,
        background:navBg, backdropFilter:'blur(24px)',
        borderBottom:`1px solid ${isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)'}`,
        display:'flex', alignItems:'center',
        padding:'9px clamp(12px,3vw,20px)', gap:8,
        transition:'background 0.3s',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.12)' : 'none',
      }}>

        {/* ── Logo ── */}
        <div onClick={() => navigate('/landing')}
          style={{ display:'flex', alignItems:'center', gap:7,
            cursor:'pointer', flexShrink:0, marginRight:4 }}>
          <div style={{
            width:32, height:32, borderRadius:9, flexShrink:0,
            background:`linear-gradient(135deg,${accent},var(--color-accent-light,#E8C44A))`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:12,
            color:'var(--color-primary-dark,#0F2140)',
          }}>TI</div>
          <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:15, color:textCol, whiteSpace:'nowrap' }}>
            Try<span style={{ color:accent }}>IT</span>
          </span>
        </div>

        {/* ── Role tabs ── */}
        <div className="nav-roles" style={{ display:'flex', gap:3 }}>
          {ROLES.map(r => (
            <button key={r.id}
              onClick={() => { setActiveRole(r.id); scrollTo(r.id) }}
              style={{
                padding:'6px 11px', borderRadius:20, cursor:'pointer',
                border: activeRole===r.id
                  ? `1px solid ${accent}`
                  : `1px solid ${isDark?'rgba(255,255,255,0.10)':'rgba(0,0,0,0.10)'}`,
                background: activeRole===r.id
                  ? `${accent}1a`
                  : 'transparent',
                color: activeRole===r.id ? accent : mutedCol,
                fontSize:11, fontWeight:700,
                fontFamily:'Poppins,sans-serif',
                whiteSpace:'nowrap', transition:'all 0.2s',
              }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* ── Spacer ── */}
        <div style={{ flex:1 }}/>

        {/* ── Base theme colour dots ── */}
        <div className="theme-dots"
          style={{ display:'flex', alignItems:'center', gap:4,
            background: isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)',
            border:`1px solid ${isDark?'rgba(255,255,255,0.10)':'rgba(0,0,0,0.08)'}`,
            borderRadius:30, padding:'5px 9px' }}>
          {BASE_DOTS.map(d => (
            <button key={d.id}
              onClick={() => { console.log('DOT CLICKED:', d.id)
              setActiveTheme(d.id)
              applyTheme(d.id)
              setTimeout(()=>{
                const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent')
                const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
                console.log('CSS vars after click -- accent:', accent, 'bg:', bg)
              }, 200) }}
              title={d.label}
              style={{
                width:15, height:15, borderRadius:'50%',
                background: d.color,
                border:'none', padding:0, cursor:'pointer',
                outline: activeTheme===d.id
                  ? `2.5px solid ${isDark?'#fff':d.color}`
                  : '2px solid transparent',
                outlineOffset:2,
                transform: activeTheme===d.id ? 'scale(1.45)' : 'scale(1)',
                boxShadow: activeTheme===d.id ? `0 0 8px ${d.color}` : 'none',
                transition:'all 0.2s',
              }}/>
          ))}
        </div>

        {/* Full theme picker for Pro/Ultra themes — separate from dots */}
        <ThemeSwitcher dark={isDark}/>

        {/* ── Dark / Light toggle ── */}
        <button onClick={handleDarkToggle}
          style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'6px 11px',
            background: isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)',
            border:`1px solid ${isDark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.09)'}`,
            borderRadius:30, cursor:'pointer',
            color:textCol, fontSize:11, fontWeight:700,
            fontFamily:'Inter,sans-serif',
            transition:'all 0.2s',
          }}>
          {/* Pill toggle */}
          <div style={{
            width:26, height:14, borderRadius:7, flexShrink:0,
            background:`linear-gradient(135deg,${accent},var(--color-accent-light,#E8C44A))`,
            position:'relative',
          }}>
            <div style={{
              position:'absolute', top:2,
              left: isDark ? 2 : 'calc(100% - 12px)',
              width:10, height:10, borderRadius:'50%',
              background:'#fff',
              transition:'left 0.28s cubic-bezier(0.23,1,0.32,1)',
            }}/>
          </div>
          <span className="dark-label">{isDark ? '🌙' : '☀️'}</span>
        </button>

        {/* ── Live indicator ── */}
        <div className="live-pill" style={{
          display:'flex', alignItems:'center', gap:5,
          background:'rgba(34,197,94,0.09)',
          border:'1px solid rgba(34,197,94,0.25)',
          borderRadius:16, padding:'4px 10px',
        }}>
          <span style={{ width:7, height:7, borderRadius:'50%',
            background:'#22C55E', display:'inline-block',
            animation:'navLiveDot 1.4s ease-in-out infinite' }}/>
          <span className="live-text"
            style={{ color:mutedCol, fontSize:11, fontFamily:'Inter,sans-serif' }}>
            Live
          </span>
        </div>

        {/* ── Login ── */}
        <button onClick={() => navigate('/login')}
          style={{
            background: isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.05)',
            border:`1px solid ${isDark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.09)'}`,
            borderRadius:10, padding:'7px 13px',
            color:textCol, fontSize:12, fontWeight:700,
            cursor:'pointer', fontFamily:'Poppins,sans-serif',
          }}>Login</button>

        {/* ── Register Free ── */}
        <button onClick={() => navigate('/register')}
          style={{
            background:`linear-gradient(135deg,${accent},var(--color-accent-light,#E8C44A))`,
            border:'none', borderRadius:10, padding:'7px 13px',
            color:'var(--color-primary-dark,#0F2140)',
            fontSize:12, fontWeight:800, cursor:'pointer',
            fontFamily:'Poppins,sans-serif', whiteSpace:'nowrap',
            boxShadow:`0 4px 14px ${accent}45`,
          }}>Register Free →</button>

      </nav>

      <style>{`
        @keyframes navLiveDot {
          0%   { box-shadow:0 0 0 0   rgba(34,197,94,0.6); }
          70%  { box-shadow:0 0 0 6px rgba(34,197,94,0);   }
          100% { box-shadow:0 0 0 0   rgba(34,197,94,0);   }
        }
        @media (max-width:900px) { .nav-roles    { display:none !important; } }
        @media (max-width:700px) { .theme-dots   { display:none !important; } }
        @media (max-width:600px) { .live-pill    { display:none !important; }
                                   .dark-label   { display:none !important; } }
        @media (max-width:400px) { .live-text    { display:none !important; } }
      `}</style>
    </>
  )
}
