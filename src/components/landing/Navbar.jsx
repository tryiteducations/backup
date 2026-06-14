// src/components/landing/Navbar.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoAnimated from '../LogoAnimated'
import ThemeSwitcher from '../ThemeSwitcher'

const NAV_LINKS = [
  { label: 'Features',       href: '/#features'  },
  { label: 'Pricing',        href: '/#pricing'   },
  { label: 'All Exams',      href: '/all-exams'  },
  { label: 'Career Compass', href: '/career-compass' },
  { label: 'Impact',         href: '/impact'     },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href) => {
    setMenuOpen(false)
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else navigate('/')
    } else {
      navigate(href)
    }
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', height: 68, gap: 24 }}>

        {/* Logo */}
        <div onClick={() => navigate('/landing')} style={{ cursor: 'pointer', flexShrink: 0 }}>
          <LogoAnimated size="xs" mode="auto" dark={!scrolled} compact />
        </div>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }}
          className="hidden md:flex">
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => handleNav(l.href)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 10,
                fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif',
                color: scrolled ? '#1E3A5F' : '#fff',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.target.style.background = 'rgba(212,175,55,0.12)'}
              onMouseOut={e => e.target.style.background = 'none'}
            >{l.label}</button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <ThemeSwitcher dark={!scrolled} />
          <button onClick={() => navigate('/login')}
            style={{
              background: 'none', border: `1.5px solid ${scrolled ? '#1E3A5F' : 'rgba(255,255,255,0.5)'}`,
              color: scrolled ? '#1E3A5F' : '#fff',
              borderRadius: 12, padding: '8px 18px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Poppins,sans-serif',
            }}>Login</button>
          <button onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg,#D4AF37,#E8C84A)',
              color: '#1E3A5F', border: 'none',
              borderRadius: 12, padding: '8px 18px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Poppins,sans-serif',
            }}>Start Free Forever</button>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(p => !p)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              color: scrolled ? '#1E3A5F' : '#fff', fontSize: 22 }}>☰</button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '12px 24px' }}>
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => handleNav(l.href)}
              style={{ display: 'block', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 0', fontSize: 15, fontWeight: 600,
                color: '#1E3A5F', fontFamily: 'Inter,sans-serif',
                borderBottom: '1px solid #F1F5F9' }}>
              {l.label}
            </button>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={() => { navigate('/login'); setMenuOpen(false) }}
              style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1.5px solid #1E3A5F',
                color: '#1E3A5F', background: 'none', fontWeight: 700, cursor: 'pointer' }}>Login</button>
            <button onClick={() => { navigate('/login'); setMenuOpen(false) }}
              style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg,#D4AF37,#E8C84A)',
                color: '#1E3A5F', fontWeight: 700, cursor: 'pointer' }}>Start Free</button>
          </div>
        </div>
      )}
    </nav>
  )
}