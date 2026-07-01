// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { THEMES, THEME_LIST, BASE_THEME_IDS } from '../lib/themes'
import { getThemesWithStatus, findNewlyUnlocked, mergeUnlockedThemeIds } from '../lib/themeUnlocks'

const DEFAULT = 'vidya-classic'
const STORAGE_KEY = 'tryit_theme'
const UNLOCKED_KEY = 'tryit_unlocked_themes'

function hexToRgb(hex) {
  if (!hex) return null
  const cleaned = hex.replace('#', '').trim()
  const short = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned
  const int = parseInt(short, 16)
  if (Number.isNaN(int)) return null
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const normalized = [rgb.r, rgb.g, rgb.b].map((value) => {
    const channel = value / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * normalized[0] + 0.7152 * normalized[1] + 0.0722 * normalized[2]
}

function isDarkColor(hex) {
  return getLuminance(hex) < 0.45
}

// Apply all CSS variables from theme
  // Apply all CSS variables from theme
  function applyThemeToDOM(themeId) {
    const t = THEMES[themeId] || THEMES[DEFAULT] || Object.values(THEMES)[0] || { bg: '#F8FAFC', surface: '#FFFFFF', text: '#1E293B', textLight: '#64748B', primary: '#2D1B69', primaryDark: '#1E1147', accent: '#F59E0B', accentLight: '#FCD34D', border: '#E2E8F0', success: '#22C55E', error: '#EF4444', warning: '#F59E0B' }
    if (!t) return
    const root = document.documentElement
    const vars = {
      '--color-primary':       t.primary,
      '--color-primary-dark':  t.primaryDark,
      '--color-accent':        t.accent,
      '--color-accent-light':  t.accentLight,
      '--color-background':    t.background,
      '--color-bg':            t.background,
      '--color-surface':       t.surface,
      '--color-text':          t.text,
      '--color-text-light':    t.textLight,
      '--color-muted':         t.textLight,
      '--color-border':        t.border,
      '--color-success':       t.success,
      '--color-error':         t.error,
      '--color-warning':       t.warning,
      '--card-bg':             t.surface,
      '--card-text':           t.text,
      '--card-accent':         t.accent,
      '--heading-color':       t.text,
      '--subtext-color':       t.textLight,
    }
    Object.entries(vars).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value)
    })
    document.body.style.background = t.background
    document.body.style.color = t.text
    const meta = document.querySelector("meta[name='theme-color']")
    if (meta) meta.setAttribute('content', t.primary)
  }

  const ThemeContext = createContext({})

  export function ThemeProvider({ children, userLevel = 1, userStats = {}, userPlan = 'free', onThemeUnlocked = null }) {
  const [activeTheme, setActiveThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('tryit_active_theme')
      if (saved && THEMES[saved]) return saved
    } catch {}
    return DEFAULT
  })

  const [unlockedThemeIds, setUnlockedThemeIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(UNLOCKED_KEY) || '[]')
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  const theme = THEMES[activeTheme] || THEMES[DEFAULT]

  useEffect(() => {
    applyThemeToDOM(activeTheme)
  }, [activeTheme])

  useEffect(() => {
    const newly = findNewlyUnlocked(userStats, unlockedThemeIds, isAdmin ? 'ultra' : userPlan)
    if (newly.length === 0) return
    setUnlockedThemeIds(prev => {
      let next = prev
      for (const t of newly) next = mergeUnlockedThemeIds(next, t)
      try { localStorage.setItem(UNLOCKED_KEY, JSON.stringify(next)) } catch {}
      return next
    })
    if (onThemeUnlocked) {
      newly.forEach(t => onThemeUnlocked(t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(userStats), userPlan])

  const isAdmin = localStorage.getItem('tryit_is_admin') === 'true'

  const themesWithStatus = useMemo(
    () => getThemesWithStatus(userStats, unlockedThemeIds, isAdmin ? 'ultra' : userPlan),
    [userStats, unlockedThemeIds, userPlan]
  )

  useEffect(() => {
    const current = themesWithStatus.find(t => t.id === activeTheme)
    if (current && !current.unlocked) {
      const fallback = current.isDark ? 'midnight' : 'default'
      setActiveThemeState(fallback)
      try { localStorage.setItem(STORAGE_KEY, fallback) } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themesWithStatus])

  const setActiveTheme = useCallback((id) => {
    if (!THEMES[id]) return
    setActiveThemeState(id)
    try { localStorage.setItem(STORAGE_KEY, id) } catch {}
  }, [])

  const isThemeUnlocked = useCallback((id) => {
    const t = themesWithStatus.find(th => th.id === id)
    return t ? t.unlocked : BASE_THEME_IDS.includes(id)
  }, [themesWithStatus])

  return (
    <ThemeContext.Provider value={{
      activeTheme,
      setActiveTheme,
      theme,
      themes: THEME_LIST,
      themesWithStatus,
      isThemeUnlocked,
      unlockedThemeIds,
      applyTheme: applyThemeToDOM,
      userLevel,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

export default ThemeContext
