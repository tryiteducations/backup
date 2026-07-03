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

// Re-altered from scratch per feedback: full ambient car-like glows, RGB vars, contrast enforcement, no painted-black surfaces, dynamic per-theme visual treats for every header/box/button/border. Matches GuruHub/dashboard/games requirements.
  function applyThemeToDOM(themeId) {
    const t = THEMES[themeId] || THEMES[DEFAULT] || Object.values(THEMES)[0] || { 
      primary: '#2D1B69', primaryDark: '#1E1147', accent: '#F59E0B', accentLight: '#FCD34D',
      background: '#F8FAFC', surface: '#FAFAFA', text: '#0F0A1E', textLight: '#64748B',
      border: '#E2E8F0', success: '#22C55E', error: '#EF4444', warning: '#F59E0B', isDark: false 
    }
    if (!t) return

    const root = document.documentElement
    const rgbP = hexToRgb(t.primary) || {r:45, g:27, b:105}
    const rgbA = hexToRgb(t.accent) || {r:245, g:158, b:11}
    
    // Car ambient light glow - multi-layer soft glow that changes with every theme (visual treat)
    const glowOpacity = t.isDark ? '0.35' : '0.22'
    const ambientGlow = `0 0 12px rgba(${rgbA.r},${rgbA.g},${rgbA.b},0.45), 0 0 30px rgba(${rgbP.r},${rgbP.g},${rgbP.b},0.25), inset 0 1px 0 rgba(255,255,255,0.15)`
    const boxGlow = `0 4px 25px -4px rgba(${rgbA.r},${rgbA.g},${rgbA.b},${glowOpacity}), 0 2px 8px -2px rgba(${rgbP.r},${rgbP.g},${rgbP.b},0.15), inset 0 1px 0 rgba(255,255,255,0.2)`
    
// Prevent "painted paper" black themes - enforce minimum luminance on surfaces for visibility/contrast (re-altered all dark surfaces in themes.js too)
    let surface = t.surface
    let bg = t.background
    if (t.isDark && getLuminance(surface) < 0.08) {
      surface = '#1a2332'  // re-altered dark surface with good contrast for left sidebar text/glow
      bg = '#0f172a'
    }

    const vars = {
      '--color-primary': t.primary,
      '--color-primary-dark': t.primaryDark,
      '--color-accent': t.accent,
      '--color-accent-light': t.accentLight,
      '--color-background': bg,
      '--color-bg': bg,
      '--color-surface': surface,
      '--color-text': t.text,
      '--color-text-light': t.textLight,
      '--color-muted': t.textLight,
      '--color-border': t.border,
      '--color-success': t.success,
      '--color-error': t.error,
      '--color-warning': t.warning,
      '--card-bg': surface,
      '--card-text': t.text,
      '--card-accent': t.accent,
      '--heading-color': t.text,
      '--subtext-color': t.textLight,
      '--primary-rgb': `${rgbP.r}, ${rgbP.g}, ${rgbP.b}`,
      '--accent-rgb': `${rgbA.r}, ${rgbA.g}, ${rgbA.b}`,
      '--ambient-glow': ambientGlow,
      '--box-glow': boxGlow,
      '--glass-bg': t.isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255,255,255,0.85)',
    }
    Object.entries(vars).forEach(([key, value]) => {
      if (value !== undefined) root.style.setProperty(key, value)
    })

    document.body.style.background = bg
    document.body.style.color = t.text
    root.classList.toggle('dark', !!t.isDark)

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
