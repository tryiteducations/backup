// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { THEMES } from '../lib/themes'

const THEME_LIST = Object.values(THEMES)
const DEFAULT = 'default'
const STORAGE_KEY = 'tryit_theme'

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
  const headingColor = surfaceText
  const subtextColor = t.textLight || '#94A3B8'
  const successBg = 'rgba(34,197,94,0.12)'
  const successBorder = 'rgba(34,197,94,0.22)'
  const accentRgb = hexToRgb(t.accent)
  const primaryRgb = hexToRgb(t.primary)
  const surfaceRgb = hexToRgb(t.surface)
  const textRgb = hexToRgb(t.text)
  const bgRgb = hexToRgb(t.bg)
  const successRgb = hexToRgb(t.success || '#16A34A')
  const errorRgb = hexToRgb(t.error || 'var(--color-error, #EF4444)')
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
    '--color-text-light':    t.textLight,
    '--color-surface-text':  surfaceText,
    '--color-muted':         t.textLight || t.border || 'var(--color-muted, #64748B)',
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
    '--glass-dark-text':     '#FFFFFF',
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

export function ThemeProvider({ children, userLevel = 1 }) {
  const [activeTheme, setActiveThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('tryit_active_theme')
      if (saved && THEMES[saved]) return saved
    } catch {}
    return DEFAULT
  })

  const theme = THEMES[activeTheme] || THEMES[DEFAULT]

  useEffect(() => {
    applyThemeToDOM(activeTheme)
  }, [activeTheme])

  const setActiveTheme = useCallback((id) => {
    if (!THEMES[id]) return
    setActiveThemeState(id)
    try { localStorage.setItem(STORAGE_KEY, id) } catch {}
  }, [])

  return (
    <ThemeContext.Provider value={{
      activeTheme,
      setActiveTheme,
      theme,
      themes: THEME_LIST,
      isThemeUnlocked: () => true,
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
