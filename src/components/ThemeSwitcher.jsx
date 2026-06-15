// src/components/ThemeSwitcher.jsx
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeSwitcher({ dark = false }) {
  const { activeTheme, setActiveTheme, theme, themes } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!theme) return null

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(p => !p) }}
        title="Change theme"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--button-surface, rgba(255,255,255,0.96))',
          border: '1px solid rgba(212,175,55,0.22)',
          borderRadius: 20, padding: '8px 14px', cursor: 'pointer',
          color: 'var(--button-text, var(--color-text, #1E3A5F))',
          fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif',
          boxShadow: '0 18px 40px rgba(15,23,42,0.12)',
        }}>
        <span style={{ fontSize: 15 }}>{theme.emoji || '🎨'}</span>
        <span style={{ fontSize: 10 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 10000,
          background: 'var(--glass-surface, rgba(255,255,255,0.88))', borderRadius: 18,
          padding: 14, width: 280, boxShadow: '0 24px 60px rgba(15,23,42,0.16)',
          border: '1px solid rgba(212,175,55,0.18)',
          maxHeight: 360, overflowY: 'auto', backdropFilter: 'blur(24px) saturate(170%)',
        }}>
          <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800,
            color: 'var(--heading-color, var(--color-text, #1E3A5F))', fontSize: 12, marginBottom: 10, padding: '0 4px' }}>
            🎨 Choose a theme
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(themes || []).map(t => (
              <button key={t.id}
                onClick={(e) => { e.stopPropagation(); setActiveTheme(t.id); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 14, cursor: 'pointer',
                  textAlign: 'left', border: activeTheme === t.id ? '2px solid var(--color-accent, #D4AF37)' : '1px solid rgba(226,232,240,0.9)',
                  background: activeTheme === t.id ? 'rgba(212,175,55,0.12)' : 'var(--color-bg, #F8FAFC)',
                  color: 'var(--color-text, #1E3A5F)',
                  boxShadow: activeTheme === t.id ? '0 0 0 2px rgba(212,175,55,0.12)' : 'none',
                }}>
                <span style={{ fontSize: 16 }}>{t.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3 }}>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
