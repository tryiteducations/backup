// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { THEMES, THEME_LIST, BASE_THEME_IDS } from '../lib/themes'
import { getThemesWithStatus, findNewlyUnlocked, mergeUnlockedThemeIds } from '../lib/themeUnlocks'

const DEFAULT = 'default'
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

function applyThemeToDOM(themeId) {
  const t = THEMES[themeId] || THEMES[DEFAULT]
  const root = document.documentElement
  const bgDark = isDarkColor(t.bg)
  const surfaceDark = isDarkColor(t.surface)
  const glassSurface = surfaceDark
    ? 'rgba(15, 23, 42, 0.78)'
    : 'rgba(255, 255, 255, 0.72)'
  const glassSurfaceDark = 'rgba(15, 23, 42, 0.82)'
  const glassBorder = surfaceDark
    ? 'rgba(255, 255, 255, 0.16)'
    : 'rgba(255, 255, 255, 0.55)'
  const buttonSurface = surfaceDark
    ? 'rgba(255, 255, 255, 0.94)'
    : 'rgba(255, 255, 255, 0.9)'
  const buttonText = surfaceDark ? '#0F172A' : t.text
  const surfaceText = surfaceDark ? (t.textLight || '#F8FAFC') : t.text
  const surfaceDarkValue = surfaceDark ? t.surface : 'rgba(0, 0, 0, 0.88)'
  const headingColor = surfaceText
  const subtextColor = t.textLight || '#94A3B8'
  const onDarkText = '#FFFFFF'
  const onDarkTextMuted = 'rgba(255,255,255,0.72)'
  const onLightText = t.text
  const onLightTextMuted = t.textLight || '#64748B'
  const successBg = 'rgba(34,197,94,0.12)'
  const successBorder = 'rgba(34,197,94,0.22)'
  const accentRgb = hexToRgb(t.accent)
  const primaryRgb = hexToRgb(t.primary)
  const surfaceRgb = hexToRgb(t.surface)
  const textRgb = hexToRgb(t.text)
  const bgRgb = hexToRgb(t.bg)
  const successRgb = hexToRgb(t.success || '#16A34A')
  const errorRgb = hexToRgb(t.error || '#EF4444')
  const warningRgb = hexToRgb(t.warning || '#F59E0B')
  const accentGlow = accentRgb
    ? `0 0 28px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.2)`
    : t.glow || '0 0 20px rgba(0, 0, 0, 0.12)'

  const navbarBg = surfaceDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255,255,255,0.72)'
  const navbarBgScrolled = surfaceDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255,255,255,0.92)'
  const navbarBorder = surfaceDark ? 'rgba(255,255,255,0.12)' : 'rgba(212,175,55,0.18)'

  const vars = {
    '--color-primary':       t.primary,
    '--color-primary-dark':  t.primaryDark,
    '--color-accent':        t.accent,
    '--color-accent-light':  t.accentLight,
    '--color-navy':          t.primary,
    '--color-navy-dark':     t.primaryDark,
    '--color-gold':          t.accent,
    '--color-gold-light':    t.accentLight,
    '--color-bg':            t.bg,
    '--color-surface':       t.surface,
    '--color-text':          t.text,
    '--color-text-light':    bgDark ? 'rgba(255,255,255,0.82)' : (t.textLight || '#64748B'),
    '--color-surface-text':  surfaceText,
    '--color-on-surface':    surfaceText,
    '--color-on-dark':       onDarkText,
    '--color-on-dark-muted': onDarkTextMuted,
    '--color-on-light':      onLightText,
    '--color-on-light-muted':onLightTextMuted,
    '--color-muted':         t.textLight || t.border || '#64748B',
    '--color-border':        t.border,
    '--color-success':       t.success,
    '--color-error':         t.error,
    '--color-warning':       t.warning,
    '--color-primary-rgb':   primaryRgb ? `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}` : '30, 58, 95',
    '--color-accent-rgb':    accentRgb ? `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}` : '212, 175, 55',
    '--color-text-rgb':      textRgb ? `${textRgb.r}, ${textRgb.g}, ${textRgb.b}` : '30, 58, 95',
    '--color-surface-rgb':   surfaceRgb ? `${surfaceRgb.r}, ${surfaceRgb.g}, ${surfaceRgb.b}` : '255, 255, 255',
    '--color-bg-rgb':        bgRgb ? `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}` : '248, 250, 252',
    '--color-success-rgb':   successRgb ? `${successRgb.r}, ${successRgb.g}, ${successRgb.b}` : '34, 197, 94',
    '--color-error-rgb':     errorRgb ? `${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}` : '239, 68, 68',
    '--color-warning-rgb':   warningRgb ? `${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}` : '245, 158, 11',
    '--card-bg':             t.cardBg,
    '--card-text':           t.cardText,
    '--card-accent':         t.cardAccent,
    '--color-bg-muted-2':    surfaceDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.06)',
    '--id-card-bg':          t.idCardBg,
    '--id-card-text':        t.idCardText,
    '--id-card-id':          t.idCardId,
    '--id-card-border':      t.idCardBorder,
    '--glow':                t.glow || 'none',
    '--glass-surface':       glassSurface,
    '--glass-surface-dark':  glassSurfaceDark,
    '--glass-border':        glassBorder,
    '--glass-shadow':        accentGlow,
    '--glass-accent':        t.accent,
    '--glass-dark-text':     onDarkText,
    '--color-logo-it':       bgDark ? 'rgba(255,255,255,0.95)' : t.text,
    '--color-text-muted':    bgDark ? 'rgba(255,255,255,0.65)' : 'rgba(30,58,95,0.55)',
    '--color-surface-dark':  surfaceDarkValue,
    '--button-surface':      buttonSurface,
    '--button-text':         buttonText,
    '--color-surface-muted': surfaceDark ? 'rgba(255,255,255,0.1)' : 'rgba(243,244,246,1)',
    '--heading-color':       headingColor,
    '--subtext-color':       subtextColor,
    '--color-success-bg':    successBg,
    '--color-success-border': successBorder,
    '--navbar-bg':           navbarBg,
    '--navbar-bg-scrolled':  navbarBgScrolled,
    '--navbar-border':       navbarBorder,
    '--theme-transition-duration': '0.48s',
  }

  Object.entries(vars).forEach(([key, value]) => {
    if (value !== undefined) root.style.setProperty(key, value)
  })

  document.body.style.background = t.bg
  document.body.style.color = t.text

  const themeMeta = document.querySelector("meta[name='theme-color']")
  if (themeMeta) themeMeta.setAttribute('content', t.primaryDark || t.primary)

  document.body.classList.add('theme-transitioning')
  window.clearTimeout(window.__themeTransitionTimeout)
  window.__themeTransitionTimeout = window.setTimeout(() => {
    document.body.classList.remove('theme-transitioning')
  }, 550)
}

const ThemeContext = createContext({})

/**
 * userStats: plain object of the metrics theme unlocks key off — see
 * src/lib/themeUnlocks.js for the expected shape. Pass whatever you
 * already have from AuthContext / CoinContext / your profile query;
 * fields you don't have yet simply default to 0 and that theme stays
 * locked until you wire the real number in.
 *
 * userPlan: 'free' | 'pro' | 'ultra' — the user's current subscription
 * tier, read from your billing source of truth. If a subscription
 * lapses and the active theme is no longer accessible, the provider
 * silently falls back to the user's last base theme — no special
 * downgrade ceremony, no blocking of cancellation, just a quiet
 * fallback to what's already free for everyone.
 *
 * onThemeUnlocked: optional callback(theme) fired the moment a new
 * theme crosses its unlock threshold AND is plan-accessible — wire
 * this to your celebration effect (confetti, coin burst, toast) in
 * CoinContext or wherever you trigger reward moments.
 */
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

  // Whenever the stats that drive unlocks change (new test result,
  // streak update, coins earned...), check for newly-crossed thresholds.
  useEffect(() => {
    const newly = findNewlyUnlocked(userStats, unlockedThemeIds, userPlan)
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

  const themesWithStatus = useMemo(
    () => getThemesWithStatus(userStats, unlockedThemeIds, userPlan),
    [userStats, unlockedThemeIds, userPlan]
  )

  // If the active theme is no longer accessible (subscription lapsed,
  // or this device never had it unlocked), fall back to a base theme.
  // Simple and silent — no ceremony, and cancellation itself is never
  // blocked or discouraged here, this only reacts to the resulting plan.
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