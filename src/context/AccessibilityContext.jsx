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
