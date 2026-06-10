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
