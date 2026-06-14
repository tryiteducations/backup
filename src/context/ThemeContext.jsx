// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  THEMES, THEME_LIST, applyTheme as applyThemeTokens,
  isThemeUnlocked as checkUnlocked, getUnlockLevel,
} from '../lib/themes'

const ThemeContext = createContext({
  activeTheme: 'cosmic-default',
  setActiveTheme: () => {},
  theme: null,
  themes: [],
  isThemeUnlocked: () => true,
  applyTheme: () => {},
})

const STORAGE_KEY = 'tryit_active_theme'
const DEFAULT = 'cosmic-default'

export function ThemeProvider({ children, userLevel = 1 }) {
  const [activeTheme, setActiveThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && THEMES[saved]) return saved
    } catch {}
    return DEFAULT
  })

  const theme = THEMES[activeTheme] ?? THEMES[DEFAULT]

  // Apply CSS vars on mount + whenever theme changes
  useEffect(() => {
    applyThemeTokens(activeTheme)
  }, [activeTheme])

  const isThemeUnlocked = useCallback(
    (id) => checkUnlocked(id, userLevel), [userLevel]
  )

  const setActiveTheme = useCallback((id) => {
    if (!THEMES[id]) return
    if (!checkUnlocked(id, userLevel)) {
      console.warn(`Theme "${id}" requires level ${getUnlockLevel(id)}`)
      return
    }
    setActiveThemeState(id)
    try { localStorage.setItem(STORAGE_KEY, id) } catch {}
  }, [userLevel])

  const applyTheme = useCallback((id) => applyThemeTokens(id), [])

  return (
    <ThemeContext.Provider value={{
      activeTheme, setActiveTheme, theme,
      themes: THEME_LIST, isThemeUnlocked, applyTheme, userLevel,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}

export default ThemeContext