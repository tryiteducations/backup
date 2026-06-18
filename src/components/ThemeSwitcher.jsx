// src/components/ThemeSwitcher.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Crown } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeSwitcher({ dark = false }) {
  const { activeTheme, setActiveTheme, theme, themesWithStatus } = useTheme()
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
      <motion.button
        onClick={(e) => { e.stopPropagation(); setOpen(p => !p) }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
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
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 10000,
              background: 'var(--glass-surface, rgba(255,255,255,0.88))', borderRadius: 18,
              padding: 14, width: 280, boxShadow: '0 24px 60px rgba(15,23,42,0.16)',
              border: '1px solid rgba(212,175,55,0.18)',
              maxHeight: 360, overflowY: 'auto', backdropFilter: 'blur(24px) saturate(170%)',
            }}>
            <p style={{
              fontFamily: 'Poppins,sans-serif', fontWeight: 800,
              color: 'var(--heading-color, var(--color-text, #1E3A5F))', fontSize: 12, marginBottom: 10, padding: '0 4px',
            }}>
              🎨 Choose a theme
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(themesWithStatus || []).map(t => {
                const locked = !t.unlocked
                return (
                  <button key={t.id}
                    disabled={locked}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (locked) return
                      setActiveTheme(t.id)
                      setOpen(false)
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 12px', borderRadius: 14, cursor: locked ? 'default' : 'pointer',
                      textAlign: 'left', border: activeTheme === t.id ? '2px solid var(--color-accent, #D4AF37)' : '1px solid rgba(226,232,240,0.9)',
                      background: activeTheme === t.id ? 'rgba(212,175,55,0.12)' : 'var(--color-bg, #F8FAFC)',
                      color: locked ? 'var(--subtext-color, #94A3B8)' : 'var(--color-text, #1E3A5F)',
                      opacity: locked ? 0.6 : 1,
                      boxShadow: activeTheme === t.id ? '0 0 0 2px rgba(212,175,55,0.12)' : 'none',
                    }}>
                    <span style={{ fontSize: 16, filter: locked ? 'grayscale(1)' : 'none' }}>{t.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, flex: 1 }}>{t.name}</span>
                    {locked && (t.planLocked ? <Crown size={12} /> : <Lock size={12} />)}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}