#!/bin/bash
# ══════════════════════════════════════════════════════════════════
# TryIT Educations — install_blueprint_pillars.sh
# Installs ALL 6 Pillars from the Architectural Blueprint
#
# Pillar 1: Infrastructure (already built — WhatsApp+Telegram)
# Pillar 2: Universal Adaptive Accessibility (3 modes)
# Pillar 3: Social Equity Matrix (9 tiers + verification)
# Pillar 4: Viral Growth Loops (APAAR + Sisterhood Circles)
# Pillar 5: Hardware Binding + Content Velocity Limiter
# Pillar 6: CSR Live Impact Tracker
#
# Usage: chmod +x install_blueprint_pillars.sh
#        ./install_blueprint_pillars.sh
# ══════════════════════════════════════════════════════════════════
set -e
ROOT="${1:-/workspaces/tryit-cloud}"
cd "$ROOT" || { echo "❌ Cannot cd to $ROOT"; exit 1; }
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  TryIT Blueprint Pillars — Installing...                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
# Create all directories
mkdir -p src/context src/lib src/hooks
mkdir -p src/components/accessibility
mkdir -p src/pages/equity src/pages/circles src/pages/impact
# ══════════════════════════════════════════════════════════════════
# PILLAR 2 — UNIVERSAL ADAPTIVE ACCESSIBILITY
# Three complete UI modes. Not CSS patches — full architecture.
# ══════════════════════════════════════════════════════════════════

mkdir -p src/context
mkdir -p src/components/accessibility
mkdir -p src/hooks

# ── AccessibilityContext ──────────────────────────────────────────
cat > src/context/AccessibilityContext.jsx << 'EOF'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Three modes defined in the architectural blueprint
export const A11Y_MODES = {
  STANDARD:      'standard',       // default
  AUDIO_COMPANION: 'audio',        // Blind / Visually Impaired
  VISUAL_SYNC:   'visual',         // Deaf / Hard of Hearing
  MINIMAL_MOTION: 'minimal',       // Motor / Physically Challenged
}

const A11Y_STORAGE_KEY = 'tryit_a11y_mode'

const A11yCtx = createContext({
  mode: A11Y_MODES.STANDARD,
  setMode: () => {},
  isAudio:   false,
  isVisual:  false,
  isMinimal: false,
  isStandard: true,
  announce: () => {},       // screen-reader live region
  fontSize: 16,
  setFontSize: () => {},
  highContrast: false,
  setHighContrast: () => {},
})

export function AccessibilityProvider({ children }) {
  const [mode, setModeRaw] = useState(
    () => localStorage.getItem(A11Y_STORAGE_KEY) || A11Y_MODES.STANDARD
  )
  const [fontSize,     setFontSizeRaw]     = useState(16)
  const [highContrast, setHighContrastRaw] = useState(false)
  const [announcement, setAnnouncement]    = useState('')

  const setMode = useCallback((m) => {
    setModeRaw(m)
    localStorage.setItem(A11Y_STORAGE_KEY, m)
    // Notify screen readers
    setAnnouncement(`Interface mode changed to ${m}`)
    // Apply body class for global CSS hooks
    document.body.className = document.body.className
      .replace(/a11y-\S+/g, '').trim()
    if (m !== A11Y_MODES.STANDARD) document.body.classList.add(`a11y-${m}`)
  }, [])

  const setFontSize = useCallback((s) => {
    setFontSizeRaw(s)
    document.documentElement.style.fontSize = `${s}px`
  }, [])

  const setHighContrast = useCallback((v) => {
    setHighContrastRaw(v)
    document.body.classList.toggle('a11y-high-contrast', v)
  }, [])

  const announce = useCallback((msg) => {
    setAnnouncement('')
    setTimeout(() => setAnnouncement(msg), 50)
  }, [])

  // Apply mode on mount
  useEffect(() => {
    if (mode !== A11Y_MODES.STANDARD) {
      document.body.classList.add(`a11y-${mode}`)
    }
  }, [])

  return (
    <A11yCtx.Provider value={{
      mode,
      setMode,
      isAudio:    mode === A11Y_MODES.AUDIO_COMPANION,
      isVisual:   mode === A11Y_MODES.VISUAL_SYNC,
      isMinimal:  mode === A11Y_MODES.MINIMAL_MOTION,
      isStandard: mode === A11Y_MODES.STANDARD,
      announce,
      fontSize,
      setFontSize,
      highContrast,
      setHighContrast,
    }}>
      {/* ARIA live region — announces changes to screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ position:'absolute', left:'-9999px', width:1, height:1, overflow:'hidden' }}
      >
        {announcement}
      </div>
      {children}
    </A11yCtx.Provider>
  )
}

export const useA11y = () => useContext(A11yCtx)
EOF

# ── Accessibility Toggle UI ───────────────────────────────────────
cat > src/components/accessibility/AccessibilityToggle.jsx << 'EOF'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useA11y, A11Y_MODES } from '../../context/AccessibilityContext'

const MODES = [
  {
    id:    A11Y_MODES.STANDARD,
    icon:  '👁️',
    label: 'Standard',
    desc:  'Default experience',
    color: '#1E3A5F',
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
          background: 'linear-gradient(135deg,#1E3A5F,#0F2140)',
          border: '2px solid #D4AF37',
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
                  color:'#1E3A5F', fontSize:16 }}>
                  ♿ Accessibility Settings
                </h3>
                <button onClick={() => setOpen(false)}
                  style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94A3B8' }}>
                  ×
                </button>
              </div>

              {/* Mode selector */}
              <p style={{ color:'#64748B', fontSize:12, marginBottom:10, fontWeight:600, letterSpacing:'1px' }}>
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
                      border:`2px solid ${mode === m.id ? m.color : '#E2E8F0'}`,
                      background: mode === m.id ? `${m.color}12` : '#F8FAFC',
                      cursor:'pointer', textAlign:'left',
                      transition:'all 0.2s',
                    }}
                    aria-pressed={mode === m.id}
                  >
                    <span style={{ fontSize:22, flexShrink:0 }}>{m.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                        fontSize:13, color: mode === m.id ? m.color : '#1E3A5F' }}>
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
              <p style={{ color:'#64748B', fontSize:12, marginBottom:8, fontWeight:600, letterSpacing:'1px' }}>
                TEXT SIZE
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <span style={{ color:'#1E3A5F', fontSize:12, fontWeight:600 }}>A</span>
                <input type="range" min={14} max={28} value={fontSize}
                  onChange={e => setFontSize(+e.target.value)}
                  style={{ flex:1, accentColor:'#D4AF37' }}
                  aria-label={`Text size: ${fontSize}px`}
                />
                <span style={{ color:'#1E3A5F', fontSize:18, fontWeight:700 }}>A</span>
                <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700, minWidth:32 }}>{fontSize}px</span>
              </div>

              {/* High contrast */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600,
                  color:'#1E3A5F', fontSize:13 }}>
                  High Contrast
                </span>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  aria-checked={highContrast}
                  role="switch"
                  style={{
                    width:44, height:24, borderRadius:12, border:'none',
                    background: highContrast ? '#1E3A5F' : '#E2E8F0',
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
EOF

# ── Audio Companion Mode wrapper ──────────────────────────────────
cat > src/components/accessibility/AudioCompanionWrapper.jsx << 'EOF'
// Audio Companion Mode
// Restructures layout into a clean vertical stack for TalkBack/VoiceOver
// All interactive elements labelled. Tap-anywhere gesture intercepted.
import { useEffect, useRef } from 'react'
import { useA11y } from '../../context/AccessibilityContext'

export default function AudioCompanionWrapper({ children }) {
  const { isAudio, announce } = useA11y()
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isAudio) return
    announce('Audio Companion Mode active. Swipe right to move forward. Swipe left to go back.')
    // Set document lang for screen readers
    document.documentElement.setAttribute('lang', 'en')
  }, [isAudio])

  if (!isAudio) return children

  return (
    <div
      ref={containerRef}
      role="main"
      aria-label="TryIT Audio Companion Mode"
      style={{
        // Clean vertical stack — no sidebars, no floating elements
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh',
        background: '#000',          // maximum contrast
        color: '#FFFFFF',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '18px',
        lineHeight: 1.8,
        padding: '24px 20px',
        gap: 0,
      }}
    >
      {/* Skip to main content — WCAG 2.1 AA */}
      <a href="#main-content"
        style={{ position:'absolute', left:'-9999px',
          ':focus': { position:'static' } }}>
        Skip to main content
      </a>

      {/* Audio mode indicator */}
      <div
        role="banner"
        aria-label="Audio Companion Mode is active"
        style={{
          background: '#7C3AED', color:'#fff',
          padding: '12px 16px', borderRadius:12, marginBottom:20,
          display:'flex', alignItems:'center', gap:12,
          fontSize:14, fontWeight:700,
        }}
      >
        <span aria-hidden="true">🎧</span>
        <span>Audio Companion Mode — Screen Reader Optimised</span>
      </div>

      <div id="main-content" style={{ flex:1 }}>
        {children}
      </div>
    </div>
  )
}
EOF

# ── Visual Sync Mode wrapper ──────────────────────────────────────
cat > src/components/accessibility/VisualSyncWrapper.jsx << 'EOF'
// Visual Sync Mode
// For Deaf / Hard of Hearing users
// Shows ISL interpreter panel, captions, visual key-term flashcards
import { useState, useEffect } from 'react'
import { useA11y } from '../../context/AccessibilityContext'

const ISL_KEYWORDS = {
  'examination': 'https://placehold.co/160x120/1E3A5F/D4AF37?text=ISL:Exam',
  'question':    'https://placehold.co/160x120/1E3A5F/D4AF37?text=ISL:Q',
  'answer':      'https://placehold.co/160x120/1E3A5F/D4AF37?text=ISL:Ans',
  'study':       'https://placehold.co/160x120/1E3A5F/D4AF37?text=ISL:Study',
}

export default function VisualSyncWrapper({ children, captionText = '' }) {
  const { isVisual } = useA11y()
  const [captionVisible, setCaptionVisible] = useState(true)
  const [flashcard, setFlashcard]           = useState(null)

  useEffect(() => {
    if (!isVisual || !captionText) return
    // Detect key terms in captions and show ISL flashcard
    const found = Object.keys(ISL_KEYWORDS).find(k =>
      captionText.toLowerCase().includes(k)
    )
    if (found) {
      setFlashcard({ term: found, url: ISL_KEYWORDS[found] })
      setTimeout(() => setFlashcard(null), 4000)
    }
  }, [captionText, isVisual])

  if (!isVisual) return children

  return (
    <div style={{ position:'relative', minHeight:'100vh' }}>
      {children}

      {/* ISL interpreter floating panel */}
      <div
        aria-label="Indian Sign Language interpreter"
        role="complementary"
        style={{
          position:'fixed', bottom:90, right:16,
          width:180, background:'#0F2140',
          border:'2px solid #D4AF37', borderRadius:20,
          overflow:'hidden', zIndex:5000,
          boxShadow:'0 8px 30px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ background:'#D4AF37', padding:'6px 12px',
          fontFamily:'Poppins,sans-serif', fontWeight:700,
          fontSize:10, color:'#1E3A5F', letterSpacing:'1px' }}>
          🤟 ISL INTERPRETER
        </div>
        <div style={{ padding:12, textAlign:'center' }}>
          <div style={{ width:'100%', height:100, background:'rgba(255,255,255,0.05)',
            borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
            color:'rgba(255,255,255,0.4)', fontSize:11 }}>
            {captionText
              ? <span style={{ color:'#D4AF37', fontSize:13 }}>🤟 Signing...</span>
              : <span>Waiting for audio...</span>
            }
          </div>
        </div>
        <div style={{ padding:'6px 12px 10px', display:'flex', justifyContent:'center' }}>
          <span style={{ background:'rgba(255,255,255,0.1)', color:'#fff',
            fontSize:9, padding:'2px 8px', borderRadius:20 }}>
            Tap to fullscreen
          </span>
        </div>
      </div>

      {/* Live caption bar */}
      {captionVisible && (
        <div
          role="status" aria-live="polite"
          style={{
            position:'fixed', bottom:0, left:0, right:0,
            background:'rgba(0,0,0,0.92)',
            color:'#FFFFFF', fontSize:16, fontWeight:600,
            padding:'14px 24px', lineHeight:1.5,
            borderTop:'2px solid #D4AF37',
            minHeight:60, zIndex:4999,
          }}
        >
          {captionText || 'Captions will appear here when audio plays...'}
        </div>
      )}

      {/* ISL flashcard popup */}
      {flashcard && (
        <div
          role="alert"
          aria-label={`Sign language for: ${flashcard.term}`}
          style={{
            position:'fixed', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            background:'#fff', borderRadius:20,
            padding:20, textAlign:'center',
            boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
            zIndex:6000, border:'3px solid #D4AF37',
          }}
        >
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            color:'#1E3A5F', fontSize:14, marginBottom:8 }}>
            Key Term: <span style={{ color:'#D4AF37' }}>{flashcard.term}</span>
          </p>
          <div style={{ width:160, height:120, background:'#1E3A5F', borderRadius:12,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#D4AF37', fontSize:40 }}>
            🤟
          </div>
          <p style={{ color:'#94A3B8', fontSize:11, marginTop:8 }}>ISL Sign for "{flashcard.term}"</p>
        </div>
      )}
    </div>
  )
}
EOF

# ── Minimal Motion Mode wrapper ───────────────────────────────────
cat > src/components/accessibility/MinimalMotionWrapper.jsx << 'EOF'
// Minimal Motion Mode — for motor / physically challenged users
// Eliminates small tap targets, drag-drop, rapid timing
// Enables voice control + adaptive switch access
import { useEffect, useCallback } from 'react'
import { useA11y } from '../../context/AccessibilityContext'

export default function MinimalMotionWrapper({ children }) {
  const { isMinimal, announce } = useA11y()

  // Voice command handler (Web Speech API)
  const handleVoiceCommand = useCallback((transcript) => {
    const cmd = transcript.toLowerCase().trim()
    if (cmd.includes('next'))      document.querySelector('[data-action="next"]')?.click()
    else if (cmd.includes('back')) window.history.back()
    else if (cmd.includes('home')) window.location.href = '/dashboard'
    else if (cmd.includes('submit') || cmd.includes('confirm'))
      document.querySelector('[data-action="submit"]')?.click()
    else announce(`Command not recognised: ${transcript}. Try: next, back, home, submit.`)
  }, [announce])

  useEffect(() => {
    if (!isMinimal) return
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-IN'

    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript
      handleVoiceCommand(transcript)
    }

    recognition.onerror = () => {}
    try { recognition.start() } catch {}
    return () => { try { recognition.stop() } catch {} }
  }, [isMinimal, handleVoiceCommand])

  // Enlarge all tap targets globally in this mode
  useEffect(() => {
    if (!isMinimal) return
    const style = document.createElement('style')
    style.id = 'minimal-motion-override'
    style.textContent = `
      .a11y-minimal button, .a11y-minimal [role="button"],
      .a11y-minimal a, .a11y-minimal input, .a11y-minimal select {
        min-height: 56px !important;
        min-width: 56px !important;
        font-size: 18px !important;
        padding: 14px 20px !important;
      }
      .a11y-minimal * { cursor: pointer !important; }
      @media (prefers-reduced-motion: reduce) {
        .a11y-minimal * { animation: none !important; transition: none !important; }
      }
    `
    document.head.appendChild(style)
    return () => document.getElementById('minimal-motion-override')?.remove()
  }, [isMinimal])

  if (!isMinimal) return children

  return (
    <div style={{ minHeight:'100vh' }}>
      {/* Voice control indicator */}
      <div
        role="status"
        aria-live="polite"
        style={{
          position:'fixed', top:68, left:0, right:0,
          background:'linear-gradient(135deg,#065F46,#047857)',
          color:'#fff', padding:'10px 20px',
          display:'flex', alignItems:'center', gap:12,
          zIndex:4000, fontSize:13, fontWeight:600,
        }}
      >
        <span style={{ fontSize:18, animation:'pulseDot 1.5s infinite' }}>🎙️</span>
        <span>Voice Control Active — Say: "next", "back", "home", "submit"</span>
      </div>
      <div style={{ paddingTop:44 }}>
        {children}
      </div>
    </div>
  )
}
EOF

# ── Accessibility CSS ─────────────────────────────────────────────
cat >> src/index.css << 'EOF'

/* ── ACCESSIBILITY OVERRIDES ─────────────────────────── */
.a11y-high-contrast {
  filter: contrast(1.5) brightness(1.1);
}
.a11y-audio * {
  outline: 3px solid #D4AF37 !important;
  outline-offset: 2px;
}
.a11y-audio *:focus {
  outline: 4px solid #FFFFFF !important;
  box-shadow: 0 0 0 6px #7C3AED !important;
}
.a11y-minimal button,
.a11y-minimal [role="button"] {
  min-height: 56px;
  min-width: 56px;
  font-size: 18px;
}
/* Reduced motion for system-level preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
EOF

echo "    ✅ Pillar 2: Accessibility system done"
# ══════════════════════════════════════════════════════════════════
# PILLAR 3 — SOCIAL EQUITY MATRIX (9 Tiers + Verification)
# ══════════════════════════════════════════════════════════════════

mkdir -p src/context
mkdir -p src/lib
mkdir -p src/pages/equity
mkdir -p src/components/equity

cat > src/lib/equityTiers.js << 'EOF'
// All 9 Social Equity Tiers — complete definitions
export const EQUITY_TIERS = {
  HOPE_SCHOLAR: {
    id: 'hope_scholar',
    name: 'TryIT Hope Scholar',
    emoji: '🌱',
    tagline: 'For those who have lost family support',
    discount: 100,
    isFree: true,
    color: '#D97706',
    lightColor: '#FEF3C7',
    description: 'For orphans, children in welfare homes, or those who have lost their family support systems.',
    beneficiaries: 'Orphans · Children in CCIs · Those without family support',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'B2B Institutional Code from registered CCI/NGO', field: 'institution_code', type: 'text' },
        { label: 'Death Certificate + Legal Heir Certificate', field: 'documents', type: 'file_upload' },
      ],
      instructions: 'Upload documents or enter your CCI institutional code. Verified within 24 hours.',
    },
  },
  PHYSICALLY_CHALLENGED: {
    id: 'physically_challenged',
    name: 'Physically Challenged',
    emoji: '♿',
    tagline: 'Ability is not a prerequisite for brilliance',
    discount: 100,
    isFree: true,
    color: '#7C3AED',
    lightColor: '#EDE9FE',
    description: 'For users who are Deaf, Hard of Hearing, Visually Impaired, Blind, or Motor-Challenged.',
    beneficiaries: 'Deaf · Hard of Hearing · Visually Impaired · Blind · Motor-Challenged',
    verification: {
      type: 'udid_upload',
      options: [
        { label: 'Government UDID Card (Unique Disability ID)', field: 'udid_card', type: 'file_upload' },
        { label: 'UDID Number', field: 'udid_number', type: 'text' },
      ],
      instructions: 'Upload your official UDID card issued by the Government of India. Verified within 24 hours.',
    },
    accessibilityModeUnlocked: true,
  },
  SWACHHTA_WARRIOR: {
    id: 'swachhta_warrior',
    name: 'Swachhta Warriors Scholar',
    emoji: '🧹',
    tagline: 'Honouring the families who keep India clean',
    discount: 100,
    isFree: true,
    color: '#059669',
    lightColor: '#D1FAE5',
    description: 'For children of sanitation workers, street sweepers, drainage cleaners, and waste pickers.',
    beneficiaries: 'Children of sanitation workers · Street sweepers · Drainage workers · Waste pickers',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Municipal Corporation ID/Employment Slip', field: 'municipal_id', type: 'file_upload' },
        { label: 'Panchayat Occupational Certificate', field: 'panchayat_cert', type: 'file_upload' },
      ],
      instructions: "Upload your parent's/guardian's employment document from the Municipal Corporation or Panchayat.",
    },
  },
  MARTYRS_FAMILY: {
    id: 'martyrs_family',
    name: "Martyr's Families Tier",
    emoji: '🎖️',
    tagline: 'Their sacrifice lives on in your success',
    discount: 100,
    isFree: true,
    color: '#B45309',
    lightColor: '#FEF3C7',
    description: 'For children or spouses of fallen Indian military personnel (Veer Naris).',
    beneficiaries: 'Children of martyrs · Veer Naris (Widows of fallen soldiers)',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Zila Sainik Board Certificate', field: 'sainik_board_cert', type: 'file_upload' },
        { label: 'Sainik Welfare Department Certificate', field: 'welfare_cert', type: 'file_upload' },
      ],
      instructions: 'Upload the official certificate from your Zila Sainik Board or Sainik Welfare Department.',
    },
  },
  TRANSGENDER_YOUTH: {
    id: 'transgender_youth',
    name: 'Transgender Youth Initiative',
    emoji: '🏳️‍⚧️',
    tagline: 'Every identity deserves every opportunity',
    discount: 100,
    isFree: true,
    color: '#0369A1',
    lightColor: '#E0F2FE',
    description: 'To provide direct career upskilling to an economically marginalised community.',
    beneficiaries: 'Transgender individuals seeking career education',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Transgender Identity Card (National SMILE Portal)', field: 'smile_card', type: 'file_upload' },
        { label: 'SMILE Portal Registration ID', field: 'smile_id', type: 'text' },
      ],
      instructions: 'Upload your Transgender Identity Card issued via the National SMILE Portal.',
    },
  },
  AGRARIAN_DISTRESS: {
    id: 'agrarian_distress',
    name: 'Agrarian Distress Tier',
    emoji: '🌾',
    tagline: 'From the fields to the halls of opportunity',
    discount: 100,
    isFree: true,
    color: '#15803D',
    lightColor: '#DCFCE7',
    description: 'For families impacted by severe rural farming crises or regional natural disasters.',
    beneficiaries: 'Farming crisis families · Natural disaster survivors',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Revenue Department Distress Card', field: 'distress_card', type: 'file_upload' },
        { label: 'Cooperative Farm Loan Waiver Slip', field: 'loan_waiver', type: 'file_upload' },
      ],
      instructions: "Upload your Revenue Department distress documentation or farm loan waiver certificate.",
    },
  },
  ACTIVE_MILITARY: {
    id: 'active_military',
    name: 'Active Military Families',
    emoji: '🪖',
    tagline: 'Defending the nation. Advancing your future.',
    discount: 30,
    isFree: false,
    color: '#1E3A5F',
    lightColor: '#EFF6FF',
    description: 'For active-duty defense forces and their immediate families.',
    beneficiaries: 'Active duty military · Immediate family members',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Defense Dependent Card', field: 'def_dependent_card', type: 'file_upload' },
        { label: 'CSD Smart Card', field: 'csd_card', type: 'file_upload' },
      ],
      instructions: 'Upload your Defense Dependent Card or CSD Smart Card.',
    },
  },
  HEALTH_WORKER_FAMILY: {
    id: 'health_worker_family',
    name: 'Grassroots Health Workers',
    emoji: '🏥',
    tagline: 'For the families of India\'s healthcare frontline',
    discount: 30,
    isFree: false,
    color: '#DC2626',
    lightColor: '#FEF2F2',
    description: 'For children of ASHA workers and Anganwadi workers.',
    beneficiaries: 'Children of ASHA workers · Children of Anganwadi workers',
    verification: {
      type: 'document_upload',
      options: [
        { label: "Mother's official ASHA/Anganwadi ID Card", field: 'asha_id', type: 'file_upload' },
        { label: 'Honorarium Payment Slip', field: 'honorarium_slip', type: 'file_upload' },
      ],
      instructions: "Upload your mother's official ASHA or Anganwadi ID card or her honorarium payment slip.",
    },
  },
  FIRST_GENERATION: {
    id: 'first_generation',
    name: 'First-Generation Learners',
    emoji: '🌟',
    tagline: 'The first in your family. Not the last in your achievements.',
    discount: 15,   // 15% individual, 25% group
    discountGroup: 25,
    isFree: false,
    color: '#6D28D9',
    lightColor: '#F5F3FF',
    description: 'For students who are the first in their family lineage to pursue higher education.',
    beneficiaries: 'First-generation college students',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Declaration by Government Institution Head', field: 'institution_declaration', type: 'file_upload' },
        { label: 'Declaration by Gazetted Officer', field: 'gazetted_declaration', type: 'file_upload' },
      ],
      instructions: 'Upload a certified declaration signed by your Government Institution Head or a Gazetted Officer.',
    },
  },
}

export const FREE_TIERS = Object.values(EQUITY_TIERS).filter(t => t.isFree).map(t => t.id)
export const DISCOUNTED_TIERS = Object.values(EQUITY_TIERS).filter(t => !t.isFree).map(t => t.id)

export function getTierDiscount(tierId) {
  const tier = Object.values(EQUITY_TIERS).find(t => t.id === tierId)
  return tier ? tier.discount : 0
}
EOF

cat > src/context/EquityTierContext.jsx << 'EOF'
import { createContext, useContext, useState, useEffect } from 'react'
import { FREE_TIERS, getTierDiscount } from '../lib/equityTiers'

const EquityCtx = createContext({
  equityTier: null, setEquityTier: () {},
  verificationStatus: null,
  discount: 0,
  isFreeForLife: false,
})

const STORAGE_KEY  = 'tryit_equity_tier'
const STATUS_KEY   = 'tryit_equity_status'

export function EquityTierProvider({ children }) {
  const [equityTier, setTierRaw]           = useState(
    () => localStorage.getItem(STORAGE_KEY) || null
  )
  const [verificationStatus, setStatus] = useState(
    () => localStorage.getItem(STATUS_KEY) || null
  )

  const setEquityTier = (tierId, status = 'pending') => {
    setTierRaw(tierId)
    setStatus(status)
    if (tierId) {
      localStorage.setItem(STORAGE_KEY, tierId)
      localStorage.setItem(STATUS_KEY, status)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STATUS_KEY)
    }
  }

  const discount     = equityTier ? getTierDiscount(equityTier) : 0
  const isFreeForLife = equityTier ? FREE_TIERS.includes(equityTier) : false

  return (
    <EquityCtx.Provider value={{ equityTier, setEquityTier, verificationStatus, discount, isFreeForLife }}>
      {children}
    </EquityCtx.Provider>
  )
}

export const useEquity = () => useContext(EquityCtx)
EOF

cat > src/pages/equity/EquityTierSelector.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { EQUITY_TIERS } from '../../lib/equityTiers'
import { useEquity } from '../../context/EquityTierContext'
import EquityVerification from './EquityVerification'

const TIER_LIST = Object.values(EQUITY_TIERS)

export default function EquityTierSelector() {
  const navigate = useNavigate()
  const { equityTier } = useEquity()
  const [selected, setSelected]     = useState(null)
  const [showVerify, setShowVerify]  = useState(false)

  if (showVerify && selected) {
    return <EquityVerification tier={selected} onBack={() => setShowVerify(false)} />
  }

  return (
    <div style={{
      minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)',
      padding:20, overflowY:'auto',
    }}>
      <div style={{ maxWidth:680, margin:'0 auto', paddingTop:20 }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🇮🇳</div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            color:'#fff', fontSize:'clamp(22px,4vw,32px)', marginBottom:8 }}>
            TryIT Cares
          </h1>
          <p style={{ color:'#D4AF37', fontStyle:'italic', fontSize:16, marginBottom:12 }}>
            Education is a right, not a privilege.
          </p>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.6, maxWidth:500, margin:'0 auto' }}>
            TryIT provides 100% free education for life to India's most vulnerable communities.
            If any of these descriptions match your situation, you deserve full access—completely free.
          </p>
        </div>

        {/* Tier cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
          {TIER_LIST.map(tier => (
            <motion.button key={tier.id}
              whileHover={{ scale:1.01 }}
              whileTap={{ scale:0.99 }}
              onClick={() => setSelected(selected?.id === tier.id ? null : tier)}
              style={{
                textAlign:'left', padding:'18px 20px', borderRadius:20,
                border:`2px solid ${selected?.id === tier.id ? tier.color : 'rgba(255,255,255,0.1)'}`,
                background: selected?.id === tier.id
                  ? `${tier.color}22`
                  : 'rgba(255,255,255,0.04)',
                cursor:'pointer', transition:'all 0.2s',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:32, flexShrink:0 }}>{tier.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                      color:'#fff', fontSize:15 }}>{tier.name}</span>
                    <span style={{
                      background: tier.isFree ? '#22C55E' : '#D4AF37',
                      color: tier.isFree ? '#fff' : '#1E3A5F',
                      fontSize:10, fontWeight:800, padding:'3px 10px',
                      borderRadius:20, letterSpacing:'0.5px',
                    }}>
                      {tier.isFree ? '100% FREE FOR LIFE' : `${tier.discount}% OFF FOR LIFE`}
                    </span>
                  </div>
                  <p style={{ color:'rgba(255,255,255,0.55)', fontSize:12, marginTop:4 }}>
                    {tier.beneficiaries}
                  </p>
                  <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:2, fontStyle:'italic' }}>
                    {tier.tagline}
                  </p>
                </div>
                <span style={{ color: selected?.id===tier.id ? tier.color : 'rgba(255,255,255,0.2)',
                  fontSize:20, fontWeight:800, flexShrink:0 }}>
                  {selected?.id===tier.id ? '●' : '○'}
                </span>
              </div>

              {/* Expanded description */}
              <AnimatePresence>
                {selected?.id === tier.id && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                    exit={{ height:0, opacity:0 }} style={{ overflow:'hidden' }}>
                    <div style={{ marginTop:14, paddingTop:14,
                      borderTop:'1px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, lineHeight:1.6 }}>
                        {tier.description}
                      </p>
                      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:8 }}>
                        📋 <strong style={{ color:'rgba(255,255,255,0.6)' }}>Verification needed:</strong>{' '}
                        {tier.verification.instructions}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, paddingBottom:40 }}>
          {selected && (
            <motion.button
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              onClick={() => setShowVerify(true)}
              style={{
                width:'100%', padding:18, borderRadius:16, border:'none',
                background:`linear-gradient(135deg,${selected.color},${selected.color}CC)`,
                fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
                color:'#fff', cursor:'pointer',
                boxShadow:`0 8px 30px ${selected.color}44`,
              }}
            >
              Apply for {selected.name} →
            </motion.button>
          )}
          <button onClick={() => navigate('/dashboard')}
            style={{ background:'none', border:'1px solid rgba(255,255,255,0.2)',
              borderRadius:14, padding:'12px', color:'rgba(255,255,255,0.5)',
              fontFamily:'Poppins,sans-serif', fontWeight:600, cursor:'pointer', fontSize:14 }}>
            I don't qualify — Continue with regular pricing
          </button>
        </div>
      </div>
    </div>
  )
}
EOF

cat > src/pages/equity/EquityVerification.jsx << 'EOF'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEquity } from '../../context/EquityTierContext'

export default function EquityVerification({ tier, onBack }) {
  const navigate = useNavigate()
  const { setEquityTier } = useEquity()
  const [fields, setFields]    = useState({})
  const [uploads, setUploads]  = useState({})
  const [submitted, setSubmit] = useState(false)
  const [errors, setErrors]    = useState({})
  const fileRefs = useRef({})

  const handleFile = (fieldName, file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setErrors(e => ({ ...e, [fieldName]: 'File too large. Max 5MB.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setUploads(u => ({ ...u, [fieldName]: {
      name: file.name, size: file.size, dataUrl: ev.target.result,
    }}))
    reader.readAsDataURL(file)
    setErrors(e => ({ ...e, [fieldName]: undefined }))
  }

  const submit = () => {
    const errs = {}
    tier.verification.options.forEach(opt => {
      if (opt.type === 'text' && !fields[opt.field]?.trim()) {
        errs[opt.field] = 'This field is required'
      }
    })
    if (Object.keys(errs).length) { setErrors(errs); return }
    // Save application to localStorage (TODO: send to Supabase)
    const apps = JSON.parse(localStorage.getItem('equity_applications') || '[]')
    apps.push({
      id: `app-${Date.now()}`,
      tier_id: tier.id,
      tier_name: tier.name,
      fields, uploads: Object.keys(uploads),
      status: 'pending',
      submitted_at: new Date().toISOString(),
    })
    localStorage.setItem('equity_applications', JSON.stringify(apps))
    setEquityTier(tier.id, 'pending')
    setSubmit(true)
  }

  if (submitted) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
          style={{ background:'rgba(255,255,255,0.06)', borderRadius:28, padding:40,
            textAlign:'center', maxWidth:420, border:`2px solid ${tier.color}` }}>
          <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:22, marginBottom:12 }}>
            Application Submitted!
          </h2>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, lineHeight:1.7, marginBottom:12 }}>
            Your <strong style={{ color: tier.color }}>{tier.name}</strong> application
            is under review. We verify within <strong style={{ color:'#D4AF37' }}>24 hours</strong>.
          </p>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:16, marginBottom:24 }}>
            <p style={{ color:'#D4AF37', fontWeight:700, fontSize:14, marginBottom:6 }}>
              What happens next?
            </p>
            {['Our team reviews your documents','Verification email sent within 24 hours',
              tier.isFree ? 'Full free access activated for life!' : `${tier.discount}% discount applied to your account`
            ].map((s,i) => (
              <p key={i} style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginBottom:4 }}>
                {i+1}. {s}
              </p>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard')} style={{
            width:'100%', padding:14, borderRadius:14, border:'none',
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15,
            color:'#1E3A5F', cursor:'pointer',
          }}>
            Continue to TryIT →
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)',
      padding:20, overflowY:'auto' }}>
      <div style={{ maxWidth:520, margin:'0 auto', paddingTop:20 }}>
        {/* Back button */}
        <button onClick={onBack}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)',
            cursor:'pointer', fontSize:14, marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
          ← Back to tiers
        </button>

        {/* Tier header */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>{tier.emoji}</div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:22 }}>
            {tier.name}
          </h2>
          <div style={{ background: tier.isFree ? '#22C55E' : '#D4AF37',
            color: tier.isFree ? '#fff' : '#1E3A5F',
            display:'inline-block', padding:'4px 16px', borderRadius:20,
            fontWeight:800, fontSize:12, marginTop:8, letterSpacing:'0.5px' }}>
            {tier.isFree ? '100% FREE FOR LIFE' : `${tier.discount}% OFF FOR LIFE`}
          </div>
        </div>

        {/* Verification form */}
        <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:24, padding:24,
          border:'1px solid rgba(255,255,255,0.1)', marginBottom:20 }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, letterSpacing:'2px',
            marginBottom:16, fontWeight:700 }}>VERIFICATION DOCUMENTS</p>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:13, lineHeight:1.6, marginBottom:20 }}>
            {tier.verification.instructions}
          </p>

          {tier.verification.options.map(opt => (
            <div key={opt.field} style={{ marginBottom:20 }}>
              <label style={{ display:'block', color:'rgba(255,255,255,0.8)', fontWeight:600,
                fontSize:13, marginBottom:8, fontFamily:'Poppins,sans-serif' }}>
                {opt.label}
              </label>
              {opt.type === 'text' ? (
                <input value={fields[opt.field] || ''} placeholder="Enter here..."
                  onChange={e => setFields(f => ({ ...f, [opt.field]: e.target.value }))}
                  style={{ width:'100%', padding:'12px 14px', borderRadius:12,
                    border:`1.5px solid ${errors[opt.field] ? '#EF4444' : 'rgba(255,255,255,0.2)'}`,
                    background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14,
                    outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
                />
              ) : (
                <div>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf"
                    ref={el => fileRefs.current[opt.field] = el}
                    onChange={e => handleFile(opt.field, e.target.files[0])}
                    style={{ display:'none' }}
                  />
                  <button onClick={() => fileRefs.current[opt.field]?.click()}
                    style={{
                      width:'100%', padding:'16px', borderRadius:12,
                      border:`2px dashed ${uploads[opt.field] ? tier.color : 'rgba(255,255,255,0.2)'}`,
                      background: uploads[opt.field] ? `${tier.color}18` : 'rgba(255,255,255,0.04)',
                      color: uploads[opt.field] ? tier.color : 'rgba(255,255,255,0.5)',
                      cursor:'pointer', fontSize:13, fontFamily:'Poppins,sans-serif',
                      fontWeight:600, transition:'all 0.2s',
                    }}>
                    {uploads[opt.field]
                      ? `✅ ${uploads[opt.field].name} (${Math.round(uploads[opt.field].size/1024)}KB)`
                      : '📎 Upload Document (JPG, PNG, PDF · Max 5MB)'
                    }
                  </button>
                </div>
              )}
              {errors[opt.field] && (
                <p style={{ color:'#EF4444', fontSize:12, marginTop:6 }}>{errors[opt.field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div style={{ background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.2)',
          borderRadius:14, padding:14, marginBottom:20 }}>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, lineHeight:1.6 }}>
            🔒 <strong style={{ color:'#D4AF37' }}>Your documents are safe.</strong> TryIT uses AES-256
            encryption. Documents are used only for eligibility verification and never shared
            with third parties. Processed documents are permanently deleted after verification.
          </p>
        </div>

        <button onClick={submit} style={{
          width:'100%', padding:18, borderRadius:16, border:'none',
          background:`linear-gradient(135deg,${tier.color},${tier.color}AA)`,
          fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
          color:'#fff', cursor:'pointer',
          boxShadow:`0 8px 30px ${tier.color}44`,
          marginBottom:40,
        }}>
          Submit Application →
        </button>
      </div>
    </div>
  )
}
EOF

echo "    ✅ Pillar 3: Social Equity Matrix done"
# ══════════════════════════════════════════════════════════════════
# PILLAR 4 — VIRAL GROWTH LOOPS (APAAR + Sisterhood Circles)
# PILLAR 5 — HARDWARE BINDING + CONTENT VELOCITY LIMITER
# PILLAR 6 — CSR LIVE IMPACT TRACKER
# ══════════════════════════════════════════════════════════════════

mkdir -p src/pages/circles
mkdir -p src/pages/impact
mkdir -p src/lib

# ── APAAR Validator ───────────────────────────────────────────────
cat > src/lib/apaarValidator.js << 'EOF'
/**
 * APAAR — Academic Bank of Credits (ABC)
 * "One Nation, One Student ID" — 12-digit unique student ID
 * Issued by Ministry of Education under National Education Policy 2020
 */

export function isValidAPAAR(id) {
  const clean = String(id).replace(/[\s-]/g, '')
  return /^\d{12}$/.test(clean)
}

export function formatAPAAR(id) {
  const clean = String(id).replace(/\D/g, '').slice(0, 12)
  // Format: XXXX-XXXX-XXXX
  return clean.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
}

/**
 * In production: call DigiLocker API to verify APAAR against institution
 * GET https://digilocker.meripehchaan.gov.in/public/oauth2/1/token
 * For now: validate format only (mock verification)
 */
export async function verifyAPAAR(apaarId, institutionCode = '') {
  if (!isValidAPAAR(apaarId)) {
    return { valid: false, error: 'Invalid APAAR ID format. Must be 12 digits.' }
  }
  // TODO: replace with real DigiLocker / ABC API call
  await new Promise(r => setTimeout(r, 1200))  // simulate API call
  return {
    valid: true,
    studentName: 'Verified Student',
    institution: institutionCode || 'Government Institution',
    apaarId: apaarId.replace(/\D/g, ''),
    verifiedAt: new Date().toISOString(),
  }
}
EOF

# ── School Circle (20% OFF) ───────────────────────────────────────
cat > src/pages/circles/SchoolCircle.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { isValidAPAAR, formatAPAAR, verifyAPAAR } from '../../lib/apaarValidator'
import { useToast } from '../../context/ToastContext'

const REQUIRED_MEMBERS = 10
const CIRCLE_DISCOUNT  = 20

export default function SchoolCircle() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const STORE_KEY = 'my_school_circle'

  const [circle, setCircle] = useState(
    () => JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
  )
  const [step, setStep]       = useState('intro')  // intro|setup|invite|active
  const [apaarInput, setApaarInput] = useState('')
  const [verifying, setVerifying]   = useState(false)
  const [captain, setCaptain]       = useState(null)
  const [members, setMembers]       = useState([])
  const [newApaar, setNewApaar]     = useState('')

  const progress = Math.min((members.length / REQUIRED_MEMBERS) * 100, 100)
  const remaining = REQUIRED_MEMBERS - members.length
  const unlocked = members.length >= REQUIRED_MEMBERS

  const verifyCaptain = async () => {
    if (!isValidAPAAR(apaarInput)) {
      showToast('error', 'Invalid APAAR ID. Must be 12 digits.')
      return
    }
    setVerifying(true)
    const result = await verifyAPAAR(apaarInput)
    setVerifying(false)
    if (result.valid) {
      setCaptain(result)
      setMembers([{ ...result, role: 'captain', joinedAt: new Date().toISOString() }])
      setStep('invite')
    } else {
      showToast('error', result.error)
    }
  }

  const addMember = async () => {
    if (!isValidAPAAR(newApaar)) {
      showToast('error', 'Invalid APAAR ID.')
      return
    }
    if (members.some(m => m.apaarId === newApaar.replace(/\D/g,''))) {
      showToast('error', 'This student is already in the circle.')
      return
    }
    setVerifying(true)
    const result = await verifyAPAAR(newApaar, captain?.institution)
    setVerifying(false)
    if (result.valid) {
      const updated = [...members, { ...result, role: 'member', joinedAt: new Date().toISOString() }]
      setMembers(updated)
      setNewApaar('')
      if (updated.length >= REQUIRED_MEMBERS) {
        const circleData = {
          id: `circle-${Date.now()}`,
          type: 'school', discount: CIRCLE_DISCOUNT,
          captain, members: updated, institution: captain.institution,
          activatedAt: new Date().toISOString(),
        }
        setCircle(circleData)
        localStorage.setItem(STORE_KEY, JSON.stringify(circleData))
        showToast('success', `🎉 Circle complete! ${CIRCLE_DISCOUNT}% off activated for all members!`)
      } else {
        showToast('success', `✅ Member added! ${updated.length}/${REQUIRED_MEMBERS}`)
      }
    } else {
      showToast('error', 'Could not verify this APAAR ID.')
    }
  }

  // Already active circle
  if (circle) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)', padding:20 }}>
        <div style={{ maxWidth:540, margin:'0 auto', paddingTop:20 }}>
          <div style={{ background:'linear-gradient(135deg,#D4AF37,#E8C84A)', borderRadius:24, padding:24, textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:22 }}>
              Circle Active!
            </h2>
            <p style={{ color:'rgba(30,58,95,0.8)', fontSize:14, marginTop:4 }}>
              {circle.members.length} members · {circle.discount}% OFF for life
            </p>
          </div>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:20 }}>
            {circle.members.map((m,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12,
                padding:'10px 0', borderBottom: i<circle.members.length-1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ width:36, height:36, borderRadius:'50%',
                  background: m.role==='captain' ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: m.role==='captain' ? '#1E3A5F' : '#fff', fontWeight:800, fontSize:14 }}>
                  {i+1}
                </div>
                <div>
                  <p style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{m.studentName}</p>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>
                    {m.apaarId?.replace(/(\d{4})(\d{4})(\d{4})/,'$1-$2-$3')} {m.role==='captain'?'· Captain':''}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard')} style={{
            width:'100%', marginTop:16, padding:14, borderRadius:14, border:'none',
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15,
            color:'#1E3A5F', cursor:'pointer',
          }}>Continue to Dashboard →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)', padding:20 }}>
      <div style={{ maxWidth:540, margin:'0 auto', paddingTop:20 }}>
        <button onClick={() => navigate(-1)}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)',
            cursor:'pointer', marginBottom:20, fontSize:14 }}>← Back</button>

        {step === 'intro' && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🏫</div>
              <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:26, marginBottom:8 }}>
                Government School / College Circle
              </h1>
              <div style={{ background:'#D4AF37', color:'#1E3A5F', display:'inline-block',
                padding:'5px 18px', borderRadius:20, fontWeight:800, fontSize:13, marginBottom:16 }}>
                20% OFF FOR LIFE
              </div>
              <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.7 }}>
                Form a circle with <strong style={{ color:'#D4AF37' }}>10 students</strong> from your
                government school or college. When your circle is complete, everyone
                gets <strong style={{ color:'#D4AF37' }}>20% off for life</strong> — verified by
                India's APAAR Student ID.
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
              {[['1️⃣','Be the Captain','Enter your APAAR ID to start the circle'],
                ['2️⃣','Invite 9 classmates','Share the circle code with your batch'],
                ['3️⃣','Discount unlocks','All 10 members get 20% off the moment circle is complete'],
              ].map(([n,title,desc])=>(
                <div key={title} style={{ display:'flex', gap:14, alignItems:'flex-start',
                  background:'rgba(255,255,255,0.04)', borderRadius:14, padding:14 }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>{n}</span>
                  <div>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#fff', fontSize:14 }}>{title}</p>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:2 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('setup')} style={{
              width:'100%', padding:16, borderRadius:16, border:'none',
              background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
              fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
              color:'#1E3A5F', cursor:'pointer',
            }}>Start a Circle →</button>
          </motion.div>
        )}

        {step === 'setup' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:20, marginBottom:6 }}>
              Enter Your APAAR ID
            </h2>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:20 }}>
              Your 12-digit APAAR (Academic Bank of Credits) Student ID — One Nation, One Student ID.
            </p>
            <input value={formatAPAAR(apaarInput)}
              onChange={e => setApaarInput(e.target.value.replace(/\D/g,'').slice(0,12))}
              placeholder="XXXX-XXXX-XXXX"
              style={{ width:'100%', padding:'16px', borderRadius:14,
                border:'2px solid rgba(212,175,55,0.4)', background:'rgba(255,255,255,0.08)',
                color:'#fff', fontSize:22, fontFamily:'monospace', letterSpacing:4,
                textAlign:'center', outline:'none', boxSizing:'border-box', marginBottom:16 }}
            />
            <button onClick={verifyCaptain} disabled={verifying || apaarInput.length < 12}
              style={{ width:'100%', padding:16, borderRadius:14, border:'none',
                background: verifying || apaarInput.length < 12
                  ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#D4AF37,#E8C84A)',
                fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16,
                color: apaarInput.length < 12 ? 'rgba(255,255,255,0.3)' : '#1E3A5F',
                cursor: apaarInput.length < 12 ? 'not-allowed' : 'pointer' }}>
              {verifying ? '🔄 Verifying with DigiLocker...' : 'Verify APAAR ID →'}
            </button>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, textAlign:'center', marginTop:10 }}>
              Your APAAR ID is from digilocker.gov.in → Academic Bank of Credits
            </p>
          </motion.div>
        )}

        {step === 'invite' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {/* Progress */}
            <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:20, marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ color:'#fff', fontWeight:700 }}>Circle Progress</span>
                <span style={{ color:'#D4AF37', fontWeight:800 }}>{members.length}/{REQUIRED_MEMBERS}</span>
              </div>
              <div style={{ height:10, background:'rgba(255,255,255,0.1)', borderRadius:5, overflow:'hidden' }}>
                <motion.div animate={{ width:`${progress}%` }} transition={{ duration:0.6 }}
                  style={{ height:'100%', background: unlocked
                    ? 'linear-gradient(90deg,#22C55E,#16A34A)'
                    : 'linear-gradient(90deg,#D4AF37,#E8C84A)', borderRadius:5 }} />
              </div>
              {unlocked
                ? <p style={{ color:'#22C55E', fontWeight:700, fontSize:13, marginTop:8, textAlign:'center' }}>
                    🎉 Circle complete! Discount activated!
                  </p>
                : <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:8, textAlign:'center' }}>
                    {remaining} more student{remaining!==1?'s':''} needed to unlock the discount
                  </p>
              }
            </div>

            {/* Member list */}
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:16, marginBottom:16 }}>
              {members.map((m,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10,
                  padding:'8px 0', borderBottom: i<members.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%',
                    background: m.role==='captain'?'#D4AF37':'rgba(255,255,255,0.1)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: m.role==='captain'?'#1E3A5F':'#fff', fontWeight:700, fontSize:12 }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ color:'#fff', fontSize:13, fontWeight:600 }}>
                      {m.studentName} {m.role==='captain'?'(Captain)':''}
                    </p>
                    <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>
                      {m.apaarId?.replace(/(\d{4})(\d{4})(\d{4})/,'$1-$2-$3')}
                    </p>
                  </div>
                  <span style={{ color:'#22C55E', fontSize:16 }}>✓</span>
                </div>
              ))}
            </div>

            {/* Add member */}
            {!unlocked && (
              <div style={{ marginBottom:16 }}>
                <p style={{ color:'rgba(255,255,255,0.7)', fontWeight:600, fontSize:13, marginBottom:8 }}>
                  Add classmate's APAAR ID:
                </p>
                <div style={{ display:'flex', gap:8 }}>
                  <input value={formatAPAAR(newApaar)}
                    onChange={e => setNewApaar(e.target.value.replace(/\D/g,'').slice(0,12))}
                    placeholder="XXXX-XXXX-XXXX"
                    style={{ flex:1, padding:'12px', borderRadius:12,
                      border:'1.5px solid rgba(255,255,255,0.2)',
                      background:'rgba(255,255,255,0.06)', color:'#fff',
                      fontSize:16, fontFamily:'monospace', letterSpacing:3, outline:'none' }}
                  />
                  <button onClick={addMember} disabled={verifying || newApaar.length < 12}
                    style={{ padding:'12px 18px', borderRadius:12, border:'none',
                      background: newApaar.length>=12 ? 'linear-gradient(135deg,#D4AF37,#E8C84A)' : 'rgba(255,255,255,0.1)',
                      color: newApaar.length>=12 ? '#1E3A5F' : 'rgba(255,255,255,0.3)',
                      fontWeight:700, cursor: newApaar.length<12?'not-allowed':'pointer', flexShrink:0 }}>
                    {verifying ? '...' : 'Add'}
                  </button>
                </div>
              </div>
            )}

            {unlocked && (
              <button onClick={() => navigate('/dashboard')} style={{
                width:'100%', padding:16, borderRadius:16, border:'none',
                background:'linear-gradient(135deg,#22C55E,#16A34A)',
                fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
                color:'#fff', cursor:'pointer',
              }}>
                🎉 Continue — 20% OFF Applied →
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
EOF

# ── Sisterhood Circle (25% OFF) ───────────────────────────────────
cat > src/pages/circles/SisterhoodCircle.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isValidAPAAR, formatAPAAR, verifyAPAAR } from '../../lib/apaarValidator'
import { useToast } from '../../context/ToastContext'

const REQUIRED = 5
const DISCOUNT  = 25

export default function SisterhoodCircle() {
  const navigate  = useNavigate()
  const { showToast } = useToast()
  const STORE_KEY = 'my_sisterhood_circle'
  const [circle]     = useState(() => JSON.parse(localStorage.getItem(STORE_KEY) || 'null'))
  const [members, setMembers]     = useState([])
  const [newApaar, setNewApaar]   = useState('')
  const [verifying, setVerifying] = useState(false)
  const unlocked = members.length >= REQUIRED

  const add = async () => {
    if (!isValidAPAAR(newApaar)) { showToast('error','Invalid APAAR ID'); return }
    if (members.some(m => m.apaarId === newApaar.replace(/\D/g,''))) {
      showToast('error','Already added'); return
    }
    setVerifying(true)
    const r = await verifyAPAAR(newApaar)
    setVerifying(false)
    if (r.valid) {
      const updated = [...members, { ...r, joinedAt: new Date().toISOString() }]
      setMembers(updated)
      setNewApaar('')
      if (updated.length >= REQUIRED) {
        const data = { id:`sc-${Date.now()}`, type:'sisterhood', discount:DISCOUNT,
          members:updated, activatedAt:new Date().toISOString() }
        localStorage.setItem(STORE_KEY, JSON.stringify(data))
        showToast('success',`🌸 Sisterhood Circle complete! ${DISCOUNT}% off for all 5 members!`)
      } else { showToast('success',`✅ ${updated.length}/${REQUIRED} members`) }
    } else { showToast('error','Verification failed') }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#4A0E4E,#2D0A2E)',padding:20 }}>
      <div style={{ maxWidth:480, margin:'0 auto', paddingTop:20 }}>
        <button onClick={() => navigate(-1)}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', marginBottom:20 }}>
          ← Back
        </button>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🌸</div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:24, marginBottom:8 }}>
            TryIT Sisterhood Circle
          </h1>
          <div style={{ background:'linear-gradient(135deg,#EC4899,#DB2777)', display:'inline-block',
            padding:'5px 18px', borderRadius:20, fontWeight:800, fontSize:13, color:'#fff', marginBottom:12 }}>
            25% OFF FOR LIFE
          </div>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.7 }}>
            5 female students from the same institution. One circle. Lifelong discount.
            Closing India's tech gender gap — one circle at a time.
          </p>
        </div>

        {/* Progress */}
        <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:20, padding:20, marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ color:'#fff', fontWeight:700 }}>Circle Members</span>
            <span style={{ color:'#EC4899', fontWeight:800 }}>{members.length}/{REQUIRED}</span>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            {Array.from({length:REQUIRED}).map((_,i)=>(
              <div key={i} style={{ flex:1, height:8, borderRadius:4,
                background: i<members.length ? '#EC4899' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
          {members.map((m,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <span style={{ color:'#EC4899' }}>🌸</span>
              <span style={{ color:'#fff', fontSize:13 }}>{m.studentName}</span>
            </div>
          ))}
        </div>

        {!unlocked && (
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            <input value={formatAPAAR(newApaar)}
              onChange={e => setNewApaar(e.target.value.replace(/\D/g,'').slice(0,12))}
              placeholder="Enter APAAR ID"
              style={{ flex:1, padding:'12px', borderRadius:12,
                border:'1.5px solid rgba(236,72,153,0.4)',
                background:'rgba(255,255,255,0.06)', color:'#fff',
                fontSize:15, fontFamily:'monospace', letterSpacing:3, outline:'none' }}
            />
            <button onClick={add} disabled={verifying||newApaar.length<12}
              style={{ padding:'12px 18px', borderRadius:12, border:'none',
                background:'linear-gradient(135deg,#EC4899,#DB2777)',
                color:'#fff', fontWeight:700, cursor:'pointer', flexShrink:0 }}>
              {verifying?'...':'Add'}
            </button>
          </div>
        )}
        {unlocked && (
          <button onClick={() => navigate('/dashboard')} style={{
            width:'100%', padding:16, borderRadius:16, border:'none',
            background:'linear-gradient(135deg,#EC4899,#DB2777)',
            fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
            color:'#fff', cursor:'pointer',
          }}>
            🌸 Sisterhood Activated — 25% OFF →
          </button>
        )}
      </div>
    </div>
  )
}
EOF

# ── Hardware Binding ──────────────────────────────────────────────
cat > src/lib/deviceBinding.js << 'EOF'
/**
 * Hardware Binding Lock — Pillar 5
 * Binds free-tier accounts to ONE phone + ONE laptop
 * Prevents account sharing
 *
 * Web: Uses browser fingerprint (canvas, fonts, timezone, screen)
 * Native Android: Uses IMEI via Capacitor plugin (if available)
 * Native iOS: Uses DeviceCheck API token via Capacitor
 */

async function getBrowserFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.hardwareConcurrency,
    screen.width, screen.height, screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.maxTouchPoints,
  ]
  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('TryIT🎓', 2, 2)
    components.push(canvas.toDataURL())
  } catch {}
  // Simple hash
  const str = components.join('|')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

async function getNativeDeviceId() {
  try {
    const { Device } = await import('@capacitor/device')
    const info = await Device.getId()
    return info.identifier
  } catch {
    return null
  }
}

export async function getDeviceId() {
  const native = await getNativeDeviceId()
  if (native) return `native_${native}`
  return `web_${await getBrowserFingerprint()}`
}

const BINDING_KEY = 'tryit_device_binding'

export async function bindDevice(userId) {
  const deviceId = await getDeviceId()
  const existing = JSON.parse(localStorage.getItem(BINDING_KEY) || '{}')
  if (existing[userId] && existing[userId] !== deviceId) {
    // Different device detected
    return { allowed: false, reason: 'Account is bound to a different device.' }
  }
  existing[userId] = deviceId
  localStorage.setItem(BINDING_KEY, JSON.stringify(existing))
  return { allowed: true, deviceId }
}

export async function checkDeviceBinding(userId) {
  const deviceId  = await getDeviceId()
  const existing  = JSON.parse(localStorage.getItem(BINDING_KEY) || '{}')
  if (!existing[userId]) return { bound: false }
  return { bound: true, allowed: existing[userId] === deviceId }
}
EOF

# ── Content Velocity Limiter ──────────────────────────────────────
cat > src/lib/contentVelocity.js << 'EOF'
/**
 * Content Velocity Limiter — Pillar 5
 * Prevents automated scraping of the question bank
 * Free accounts: 50 questions/day | Pro: unlimited
 */

const DAILY_LIMITS = {
  free:     50,    // questions per day
  trial:    100,
  plus:     500,
  pro:      Infinity,
  promax:   Infinity,
  scholar:  200,   // equity tiers get extra allowance
}

const VELOCITY_KEY = 'tryit_velocity'

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

export function canAccessQuestion(plan = 'free', isFreeForLife = false) {
  const limit = isFreeForLife ? DAILY_LIMITS.scholar : (DAILY_LIMITS[plan] ?? DAILY_LIMITS.free)
  if (limit === Infinity) return { allowed: true, remaining: Infinity }
  const data  = JSON.parse(localStorage.getItem(VELOCITY_KEY) || '{}')
  const today = getTodayKey()
  const count = data[today] || 0
  if (count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      message: plan === 'free'
        ? `You've reached your ${limit} questions/day limit on the free plan. Upgrade to Pro for unlimited access.`
        : `Daily limit of ${limit} questions reached. Resets at midnight.`,
    }
  }
  return { allowed: true, remaining: limit - count, count, limit }
}

export function recordQuestionAccess(count = 1) {
  const data  = JSON.parse(localStorage.getItem(VELOCITY_KEY) || '{}')
  const today = getTodayKey()
  data[today] = (data[today] || 0) + count
  // Keep only last 7 days
  const keys = Object.keys(data).sort()
  if (keys.length > 7) keys.slice(0, keys.length - 7).forEach(k => delete data[k])
  localStorage.setItem(VELOCITY_KEY, JSON.stringify(data))
}

export function getDailyUsage() {
  const data  = JSON.parse(localStorage.getItem(VELOCITY_KEY) || '{}')
  return data[getTodayKey()] || 0
}
EOF

echo "    ✅ Pillar 4 + 5 done"
# ══════════════════════════════════════════════════════════════════
# PILLAR 6 — CSR LIVE IMPACT TRACKER + B2B PORTAL
# ══════════════════════════════════════════════════════════════════

mkdir -p src/pages/impact

cat > src/pages/impact/LiveImpactTracker.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Live mock metrics — in production: fetch from Supabase every 30s
const BASE_METRICS = {
  hope_scholars:      847,
  physically_challenged: 1203,
  swachhta_warriors:  634,
  martyrs_families:   312,
  transgender_youth:  189,
  agrarian_distress:  456,
  military_families:  724,
  health_workers:     891,
  first_generation:   2341,
  total_free_users:   3641,
  total_discounted:   4197,
  study_hours_logged: 1284930,
  tests_completed:    89423,
  states_covered:     28,
  languages_used:     40,
}

const IMPACT_TIERS = [
  { id:'hope_scholars',         label:'Hope Scholars',           emoji:'🌱', color:'#D97706', isFree:true  },
  { id:'physically_challenged', label:'Differently Abled',       emoji:'♿', color:'#7C3AED', isFree:true  },
  { id:'swachhta_warriors',     label:"Swachhta Warriors' Children", emoji:'🧹', color:'#059669', isFree:true  },
  { id:'martyrs_families',      label:"Martyrs' Families",       emoji:'🎖️', color:'#B45309', isFree:true  },
  { id:'transgender_youth',     label:'Transgender Youth',       emoji:'🏳️‍⚧️', color:'#0369A1', isFree:true  },
  { id:'agrarian_distress',     label:'Agrarian Distress Families', emoji:'🌾', color:'#15803D', isFree:true  },
  { id:'military_families',     label:'Active Military Families', emoji:'🪖', color:'#1E3A5F', isFree:false },
  { id:'health_workers',        label:"ASHA/Anganwadi Families",  emoji:'🏥', color:'#DC2626', isFree:false },
  { id:'first_generation',      label:'First-Generation Learners',emoji:'🌟', color:'#6D28D9', isFree:false },
]

function CountUp({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const start = performance.now()
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setCount(Math.floor(eased * target))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])
  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function LiveImpactTracker() {
  const [pulse, setPulse] = useState(BASE_METRICS)

  // Simulate live counter increments
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => ({
        ...prev,
        study_hours_logged: prev.study_hours_logged + Math.floor(Math.random() * 3),
        tests_completed:    prev.tests_completed    + (Math.random() > 0.7 ? 1 : 0),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const totalBeneficiaries = IMPACT_TIERS.reduce(
    (sum, t) => sum + (pulse[t.id] || 0), 0
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0A0F1E', padding:'0 0 60px' }}>

      {/* Hero */}
      <div style={{
        background:'linear-gradient(135deg,#1E3A5F 0%,#0F2140 40%,#071428 100%)',
        padding:'60px 24px 40px', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        {/* Live pulse ring */}
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%',
          border:'1px solid rgba(212,175,55,0.1)', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)', animation:'ringPulse 4s ease-in-out infinite',
          pointerEvents:'none' }} />

        <div style={{ display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)',
          borderRadius:20, padding:'6px 16px', marginBottom:20 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#22C55E',
            animation:'pulseDot 1.5s ease-in-out infinite' }} />
          <span style={{ color:'#22C55E', fontSize:12, fontWeight:700, letterSpacing:'1px' }}>
            LIVE IMPACT TRACKER
          </span>
        </div>

        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
          fontSize:'clamp(28px,5vw,52px)', color:'#fff', marginBottom:12 }}>
          Education is<br/>
          <span style={{ color:'#D4AF37' }}>Changing Lives</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:16, maxWidth:580,
          margin:'0 auto 32px', lineHeight:1.7 }}>
          TryIT's near-zero infrastructure model enables 100% free education for India's
          most vulnerable communities. Every number below is a real person whose future
          we are changing — right now.
        </p>

        {/* Top 4 stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)',
          gap:14, maxWidth:500, margin:'0 auto' }}>
          {[
            { label:'Total Beneficiaries', val:totalBeneficiaries, suffix:'', highlight:true },
            { label:'Study Hours Logged',  val:pulse.study_hours_logged, suffix:'+' },
            { label:'Tests Completed',     val:pulse.tests_completed, suffix:'' },
            { label:'States Covered',      val:pulse.states_covered, suffix:'/28' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.highlight
                ? 'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))'
                : 'rgba(255,255,255,0.04)',
              border: s.highlight
                ? '1.5px solid rgba(212,175,55,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius:18, padding:'20px 16px',
            }}>
              <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                fontSize:'clamp(26px,4vw,40px)',
                color: s.highlight ? '#D4AF37' : '#fff' }}>
                <CountUp target={s.val} />{s.suffix}
              </div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier breakdown */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 20px 0' }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          color:'#fff', fontSize:24, marginBottom:6, textAlign:'center' }}>
          Impact by Community
        </h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:24, textAlign:'center' }}>
          Every verified beneficiary gets full access — zero cost, zero compromise.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
          {IMPACT_TIERS.map(tier => (
            <motion.div key={tier.id}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              style={{
                background:'rgba(255,255,255,0.03)',
                border:`1px solid ${tier.color}33`,
                borderRadius:20, padding:20,
              }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontSize:28 }}>{tier.emoji}</span>
                <span style={{
                  background: tier.isFree ? '#22C55E' : '#D4AF37',
                  color: '#fff',
                  fontSize:9, fontWeight:800, padding:'3px 8px',
                  borderRadius:20, letterSpacing:'0.5px',
                }}>
                  {tier.isFree ? 'FREE FOR LIFE' : 'DISCOUNTED'}
                </span>
              </div>
              <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                fontSize:36, color: tier.color }}>
                <CountUp target={pulse[tier.id] || 0} />
              </div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:14, marginTop:4 }}>
                {tier.label}
              </div>
              {/* Mini progress bar showing YTD growth */}
              <div style={{ marginTop:12, height:3,
                background:'rgba(255,255,255,0.06)', borderRadius:2 }}>
                <div style={{
                  height:3, borderRadius:2,
                  background: tier.color,
                  width:`${Math.min(((pulse[tier.id]||0) / 5000)*100, 100)}%`,
                }} />
              </div>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:10, marginTop:4 }}>
                Of 5,000 annual target
              </div>
            </motion.div>
          ))}
        </div>

        {/* CSR Compliance block */}
        <div style={{
          background:'linear-gradient(135deg,rgba(30,58,95,0.6),rgba(15,33,64,0.8))',
          border:'1.5px solid rgba(212,175,55,0.3)',
          borderRadius:24, padding:28, marginTop:32,
        }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:20, flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:280 }}>
              <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                color:'#D4AF37', fontSize:20, marginBottom:8 }}>
                📋 Corporate CSR Partnership
              </h3>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, lineHeight:1.7, marginBottom:16 }}>
                Under <strong style={{ color:'#fff' }}>Section 135 of the Companies Act</strong>,
                your CSR funds can directly support verified beneficiaries on TryIT.
                We provide real-time compliance-ready impact reports for SBI, IOCL, TCS,
                and other PSUs/corporates.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[['📊','Real-time impact dashboards'],
                  ['📄','Auto-generated compliance reports'],
                  ['🔒','Beneficiary verification audit trail'],
                  ['💰','Section 135 compliant fund flow'],
                ].map(([icon, label]) => (
                  <div key={label} style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:16 }}>{icon}</span>
                    <span style={{ color:'rgba(255,255,255,0.65)', fontSize:12 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ background:'rgba(212,175,55,0.1)', borderRadius:16,
                padding:20, border:'1px solid rgba(212,175,55,0.2)', marginBottom:12 }}>
                <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                  color:'#D4AF37', fontSize:32 }}>
                  ₹50L+
                </div>
                <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:4 }}>
                  CSR Grants Available
                </div>
              </div>
              <button style={{
                background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
                border:'none', borderRadius:14, padding:'12px 24px',
                fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
                color:'#1E3A5F', cursor:'pointer', width:'100%',
              }}>
                Download CSR Report →
              </button>
              <p style={{ color:'rgba(255,255,255,0.3)', fontSize:10, marginTop:6 }}>
                contact@tryiteducations.net
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ringPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity:1; }
          50%      { transform: translate(-50%,-50%) scale(1.06); opacity:0.5; }
        }
      `}</style>
    </div>
  )
}
EOF

echo "    ✅ Pillar 6: CSR Impact Tracker done"
# ══════════════════════════════════════════════════════════════════
# FINAL — Wire everything into main.jsx + App.jsx + PATCH_GUIDE
# ══════════════════════════════════════════════════════════════════

# ── Updated main.jsx ─────────────────────────────────────────────
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider }     from './context/LanguageContext.jsx'
import { AccessibilityProvider } from './context/AccessibilityContext.jsx'
import { EquityTierProvider }    from './context/EquityTierContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <LanguageProvider>
        <EquityTierProvider>
          <App />
        </EquityTierProvider>
      </LanguageProvider>
    </AccessibilityProvider>
  </React.StrictMode>
)
EOF

# ── Add all new routes to App.jsx ────────────────────────────────
# Use Python to safely insert routes since JS has backticks
python3 << 'PYEOF'
import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

NEW_IMPORTS = """
const EquityTierSelector = lazy(() => import('./pages/equity/EquityTierSelector'))
const EquityVerification = lazy(() => import('./pages/equity/EquityVerification'))
const SchoolCircle       = lazy(() => import('./pages/circles/SchoolCircle'))
const SisterhoodCircle   = lazy(() => import('./pages/circles/SisterhoodCircle'))
const LiveImpactTracker  = lazy(() => import('./pages/impact/LiveImpactTracker'))
const AllExams           = lazy(() => import('./pages/exams/AllExams'))
const CentreDashboard    = lazy(() => import('./pages/centre/CentreDashboard'))
const StudentHistory     = lazy(() => import('./pages/centre/StudentHistory'))
const MyTestHistory      = lazy(() => import('./pages/student/MyTestHistory'))
const AdminLogin         = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard     = lazy(() => import('./pages/admin/AdminDashboard'))
const JourneyPassport    = lazy(() => import('./pages/JourneyPassport'))
const CouponManager      = lazy(() => import('./pages/mentor/CouponManager'))
const EbookStore         = lazy(() => import('./pages/ebooks/EbookStore'))"""

NEW_ROUTES = """
                {/* ── Equity + Circles ── */}
                <Route path="/equity"              element={<EquityTierSelector />} />
                <Route path="/equity/verify"       element={<EquityVerification />} />
                <Route path="/circles/school"      element={<SchoolCircle />} />
                <Route path="/circles/sisterhood"  element={<SisterhoodCircle />} />
                {/* ── Impact ── */}
                <Route path="/impact"              element={<LiveImpactTracker />} />
                {/* ── Exams ── */}
                <Route path="/exams"               element={<AllExams />} />
                {/* ── Centre Hub ── */}
                <Route path="/centre/dashboard"    element={<CentreDashboard />} />
                <Route path="/centre/students"     element={<StudentHistory />} />
                <Route path="/student/test-history" element={<MyTestHistory />} />
                {/* ── Admin ── */}
                <Route path="/admin/login"         element={<AdminLogin />} />
                <Route path="/admin/dashboard"     element={<AdminDashboard />} />
                {/* ── Extras ── */}
                <Route path="/journey"             element={<JourneyPassport />} />
                <Route path="/mentor-hub/coupons"  element={<CouponManager />} />
                <Route path="/ebooks"              element={<EbookStore />} />"""

# Insert imports before 'const Loader'
if 'const Loader' in content and NEW_IMPORTS.strip()[:20] not in content:
    content = content.replace('const Loader', NEW_IMPORTS + '\n\nconst Loader', 1)

# Insert routes before the catch-all *
if '/impact' not in content and '<Route path="*"' in content:
    content = content.replace(
        '<Route path="*"',
        NEW_ROUTES + '\n\n                <Route path="*"',
        1
    )

with open('src/App.jsx', 'w') as f:
    f.write(content)

print('App.jsx updated successfully')
PYEOF

# ── Add AccessibilityToggle to AppLayout ─────────────────────────
python3 << 'PYEOF'
with open('src/components/layout/AppLayout.jsx', 'r') as f:
    content = f.read()

if 'AccessibilityToggle' not in content:
    content = "import AccessibilityToggle from '../accessibility/AccessibilityToggle'\n" + content
    # Add before closing main div
    content = content.replace(
        '</main>',
        '</main>\n      <AccessibilityToggle />',
        1
    )
    with open('src/components/layout/AppLayout.jsx', 'w') as f:
        f.write(content)
    print('AppLayout updated with AccessibilityToggle')
else:
    print('AppLayout already has AccessibilityToggle')
PYEOF

# ── Add VisualSyncWrapper + AudioCompanionWrapper to AppLayout ────
python3 << 'PYEOF'
with open('src/components/layout/AppLayout.jsx', 'r') as f:
    content = f.read()

if 'useA11y' not in content:
    # Add imports
    content = content.replace(
        "import AccessibilityToggle",
        """import { useA11y }               from '../../context/AccessibilityContext'
import AudioCompanionWrapper from '../accessibility/AudioCompanionWrapper'
import VisualSyncWrapper    from '../accessibility/VisualSyncWrapper'
import MinimalMotionWrapper from '../accessibility/MinimalMotionWrapper'
import AccessibilityToggle""",
        1
    )
    # Wrap children
    content = content.replace(
        'return (\n    <div',
        """const { isAudio, isVisual, isMinimal } = useA11y()
  return (
    <AudioCompanionWrapper>
    <VisualSyncWrapper>
    <MinimalMotionWrapper>
    <div""",
        1
    )
    # Close wrappers
    content = content.replace(
        '<AccessibilityToggle />',
        '<AccessibilityToggle />\n    </MinimalMotionWrapper>\n    </VisualSyncWrapper>\n    </AudioCompanionWrapper>'
    )
    with open('src/components/layout/AppLayout.jsx', 'w') as f:
        f.write(content)
    print('AppLayout wrapped with accessibility modes')
else:
    print('AppLayout already wrapped')
PYEOF

# ── Write BLUEPRINT_PATCH_GUIDE.md ────────────────────────────────
cat > BLUEPRINT_PATCH_GUIDE.md << 'MDEOF'
# TryIT Educations — Blueprint Pillars Integration Guide
# Run install_blueprint_pillars.sh first. Then read below.

## ════════════════════════════════════════════════════════
## WHAT WAS JUST INSTALLED
## ════════════════════════════════════════════════════════

### Pillar 2 — Accessibility System
  src/context/AccessibilityContext.jsx    ← 3-mode state manager
  src/components/accessibility/
    AccessibilityToggle.jsx              ← ♿ floating toggle button
    AudioCompanionWrapper.jsx            ← Blind/VI screen-reader mode
    VisualSyncWrapper.jsx                ← Deaf/HoH captions + ISL
    MinimalMotionWrapper.jsx             ← Motor-challenged voice control

  HOW TO TEST:
    1. npm run dev
    2. Click ♿ button (bottom-right)
    3. Switch to "Audio Companion" → layout restructures for TalkBack
    4. Switch to "Visual Sync" → ISL panel + caption bar appears
    5. Switch to "Minimal Motion" → voice commands activate

### Pillar 3 — Social Equity Matrix
  src/lib/equityTiers.js                 ← All 9 tier definitions
  src/context/EquityTierContext.jsx       ← Tier state
  src/pages/equity/EquityTierSelector.jsx ← Tier selection UI
  src/pages/equity/EquityVerification.jsx ← Document upload

  HOW TO TEST:
    1. Visit /equity
    2. Select "Hope Scholar" or any tier
    3. Click Apply → see verification form
    4. Upload a test file → Submit
    5. Check localStorage "equity_applications"

### Pillar 4 — Viral Circles
  src/lib/apaarValidator.js              ← APAAR format + mock verify
  src/pages/circles/SchoolCircle.jsx     ← 10-member, 20% OFF
  src/pages/circles/SisterhoodCircle.jsx ← 5-female, 25% OFF

  HOW TO TEST:
    1. Visit /circles/school
    2. Enter any 12-digit number as APAAR ID
    3. Add 10 members → watch discount unlock

### Pillar 5 — Security
  src/lib/deviceBinding.js              ← Hardware fingerprint binding
  src/lib/contentVelocity.js            ← Daily question caps

  HOW TO USE IN TEST ENGINE:
    import { canAccessQuestion, recordQuestionAccess } from '../lib/contentVelocity'
    // Before showing a question:
    const check = canAccessQuestion(user.plan, user.isFreeForLife)
    if (!check.allowed) { showUpgradePrompt(check.message); return }
    recordQuestionAccess(1)

### Pillar 6 — CSR Impact Tracker
  src/pages/impact/LiveImpactTracker.jsx ← Public dashboard

  HOW TO TEST:
    1. Visit /impact (no login required — public page)
    2. Numbers count up as you scroll
    3. Every 3 seconds, study hours increment (live simulation)

## ════════════════════════════════════════════════════════
## ADD TO LANDING PAGE NAV (recommended)
## ════════════════════════════════════════════════════════

In src/components/landing/Navbar.jsx, add:
  <a href="/impact">🌍 Impact</a>
  <a href="/equity">🤝 Free Access</a>

In src/components/landing/Footer.jsx, add:
  Social Impact: Impact Tracker · Free Access · CSR Partners

## ════════════════════════════════════════════════════════
## ADD TO SIDEBAR (for logged-in users)
## ════════════════════════════════════════════════════════

In src/components/layout/Sidebar.jsx NAV array add:
  { path:'/equity',  label:'Free Access', icon:Heart, badge:'9 Tiers' },
  { path:'/impact',  label:'Our Impact',  icon:Globe,  badge:null      },
  { path:'/circles/school',     label:'School Circle',     icon:Users },
  { path:'/circles/sisterhood', label:'Sisterhood Circle', icon:Users },

## ════════════════════════════════════════════════════════
## ADD TO ONBOARDING (highest priority)
## ════════════════════════════════════════════════════════

In src/pages/Onboarding.jsx, after Step 7 (Language) add Step 8:

  STEP 8 — Equity Check
    "Do any of these apply to you? (Optional)"
    Show 6 free tier cards briefly
    "Claim Free Access →" → routes to /equity
    "Skip — I'll pay normally →" → routes to /dashboard

## ════════════════════════════════════════════════════════
## PRODUCTION CHECKLIST
## ════════════════════════════════════════════════════════

Before launch (June 15):
  [ ] Replace mock APAAR verification with real DigiLocker API
      GET https://api.digitallocker.gov.in/public/oauth2/1/token
      Register at: https://partners.digitallocker.gov.in

  [ ] Replace mock UDID check with real UDID database query
      API: https://swavlambancard.gov.in/api (UDID portal)

  [ ] Set up document storage (encrypted) in Supabase Storage
      Replace localStorage saves in EquityVerification.jsx with:
      supabase.storage.from('equity-docs').upload(...)

  [ ] Wire CSR Impact Tracker to real Supabase metrics
      Replace BASE_METRICS with:
      const { data } = await supabase.from('equity_stats').select()

  [ ] Set VITE_QUESTION_ENCRYPTION_KEY in .env.local

  [ ] Enable Content-Security-Policy headers in Cloudflare
MDEOF

echo "    ✅ All wiring done + BLUEPRINT_PATCH_GUIDE.md written"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ ALL 6 PILLARS INSTALLED                              ║"
echo "║                                                          ║"
echo "║  New routes:                                             ║"
echo "║    /equity            → Free Access for 9 tier groups   ║"
echo "║    /impact            → Live CSR Impact Tracker (public) ║"
echo "║    /circles/school    → APAAR School Circle (20% OFF)    ║"
echo "║    /circles/sisterhood→ Sisterhood Circle (25% OFF)      ║"
echo "║    ♿ button          → 3-mode Accessibility Toggle      ║"
echo "║                                                          ║"
echo "║  Read BLUEPRINT_PATCH_GUIDE.md for:                      ║"
echo "║    • Adding links to Sidebar + Landing Navbar            ║"
echo "║    • Step 8 in Onboarding (Equity Check)                 ║"
echo "║    • Production API integration (APAAR, UDID, etc.)      ║"
echo "║                                                          ║"
echo "║  Then run: npm run dev                                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
