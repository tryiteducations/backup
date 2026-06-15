import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useA11y, A11Y_MODES } from '../../context/AccessibilityContext'

const MODES = [
  {
    id:    A11Y_MODES.STANDARD,
    icon:  '👁️',
    label: 'Standard',
    desc:  'Default experience',
    color: 'var(--color-primary, #1E3A5F)',
  },
  {
    id:    A11Y_MODES.AUDIO_COMPANION,
    icon:  '🎧',
    label: 'Audio Companion',
    desc:  'Optimised for screen readers, TalkBack & VoiceOver',
    color: '#7C3AED',
    tag:   'Visually Impaired / Blind',
  },
  {
    id:    A11Y_MODES.VISUAL_SYNC,
    icon:  '👁️‍🗨️',
    label: 'Visual Sync',
    desc:  'Captions, ISL interpreter, visual flashcards',
    color: '#0369A1',
    tag:   'Deaf / Hard of Hearing',
  },
  {
    id:    A11Y_MODES.MINIMAL_MOTION,
    icon:  '🤲',
    label: 'Minimal Motion',
    desc:  'Large targets, voice control, switch access',
    color: '#065F46',
    tag:   'Motor / Physically Challenged',
  },
]

export default function AccessibilityToggle({ position = 'fixed' }) {
  const { mode, setMode, fontSize, setFontSize, highContrast, setHighContrast } = useA11y()
  const [open, setOpen] = useState(false)

  const current = MODES.find(m => m.id === mode) || MODES[0]

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Accessibility settings"
        aria-expanded={open}
        style={{
          position,
          bottom: position === 'fixed' ? 80 : undefined,
          right:  position === 'fixed' ? 20  : undefined,
          zIndex: 9000,
          width: 48, height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))',
          border: '2px solid var(--color-accent, #D4AF37)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        ♿
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              onClick={() => setOpen(false)}
              style={{ position:'fixed', inset:0, zIndex:8998, background:'rgba(0,0,0,0.4)' }}
            />
            <motion.div
              initial={{ opacity:0, scale:0.92, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.92, y:20 }}
              transition={{ type:'spring', damping:25, stiffness:300 }}
              role="dialog"
              aria-label="Accessibility Settings"
              style={{
                position: 'fixed',
                bottom: 140, right: 20,
                width: 320,
                background: '#fff',
                borderRadius: 24,
                padding: 20,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                zIndex: 8999,
              }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  color:'var(--color-primary, #1E3A5F)', fontSize:16 }}>
                  ♿ Accessibility Settings
                </h3>
                <button onClick={() => setOpen(false)}
                  style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94A3B8' }}>
                  ×
                </button>
              </div>

              {/* Mode selector */}
              <p style={{ color:'var(--color-muted, #64748B)', fontSize:12, marginBottom:10, fontWeight:600, letterSpacing:'1px' }}>
                INTERFACE MODE
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                {MODES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'12px 14px', borderRadius:14,
                      border:`2px solid ${mode === m.id ? m.color : 'var(--color-border, #E2E8F0)'}`,
                      background: mode === m.id ? `${m.color}12` : '#F8FAFC',
                      cursor:'pointer', textAlign:'left',
                      transition:'all 0.2s',
                    }}
                    aria-pressed={mode === m.id}
                  >
                    <span style={{ fontSize:22, flexShrink:0 }}>{m.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                        fontSize:13, color: mode === m.id ? m.color : 'var(--color-primary, #1E3A5F)' }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>{m.desc}</div>
                      {m.tag && mode === m.id && (
                        <div style={{ marginTop:4, background: m.color, color:'#fff',
                          fontSize:9, fontWeight:700, padding:'2px 8px',
                          borderRadius:20, display:'inline-block', letterSpacing:'0.5px' }}>
                          {m.tag}
                        </div>
                      )}
                    </div>
                    {mode === m.id && (
                      <span style={{ color: m.color, fontWeight:800, flexShrink:0 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Font size */}
              <p style={{ color:'var(--color-muted, #64748B)', fontSize:12, marginBottom:8, fontWeight:600, letterSpacing:'1px' }}>
                TEXT SIZE
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <span style={{ color:'var(--color-primary, #1E3A5F)', fontSize:12, fontWeight:600 }}>A</span>
                <input type="range" min={14} max={28} value={fontSize}
                  onChange={e => setFontSize(+e.target.value)}
                  style={{ flex:1, accentColor:'var(--color-accent, #D4AF37)' }}
                  aria-label={`Text size: ${fontSize}px`}
                />
                <span style={{ color:'var(--color-primary, #1E3A5F)', fontSize:18, fontWeight:700 }}>A</span>
                <span style={{ color:'var(--color-accent, #D4AF37)', fontSize:12, fontWeight:700, minWidth:32 }}>{fontSize}px</span>
              </div>

              {/* High contrast */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600,
                  color:'var(--color-primary, #1E3A5F)', fontSize:13 }}>
                  High Contrast
                </span>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  aria-checked={highContrast}
                  role="switch"
                  style={{
                    width:44, height:24, borderRadius:12, border:'none',
                    background: highContrast ? 'var(--color-primary, #1E3A5F)' : 'var(--color-border, #E2E8F0)',
                    cursor:'pointer', position:'relative', transition:'background 0.2s',
                  }}
                >
                  <div style={{
                    width:20, height:20, borderRadius:'50%', background:'#fff',
                    position:'absolute', top:2,
                    left: highContrast ? 22 : 2,
                    transition:'left 0.2s',
                    boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
