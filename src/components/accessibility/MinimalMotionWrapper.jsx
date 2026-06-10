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
