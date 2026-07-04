// src/lib/themes.js
// TryIT Educations - Curated Ambient Theme System
// 8 theme families, each with a matched Light + Dark pair (16 total)
// buildTheme() auto-enforces WCAG AA 4.5:1 contrast - no theme can ship with unreadable text
// FREE: 2 families (4 themes) | PRO: 6 families (12 themes)

// ── Color math (dependency-free) ────────────────────────────
function hexToRgb(hex) {
  const cleaned = hex.replace('#', '').trim()
  const full = cleaned.length === 3 ? cleaned.split('').map(c => c + c).join('') : cleaned
  const int = parseInt(full, 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}
function rgbToHex({ r, g, b }) {
  const toHex = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}
function relativeLuminance({ r, g, b }) {
  const norm = [r, g, b].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * norm[0] + 0.7152 * norm[1] + 0.0722 * norm[2]
}
function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexToRgb(hexA))
  const lB = relativeLuminance(hexToRgb(hexB))
  const lighter = Math.max(lA, lB)
  const darker  = Math.min(lA, lB)
  return (lighter + 0.05) / (darker + 0.05)
}
function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB)
  return rgbToHex({ r: a.r+(b.r-a.r)*t, g: a.g+(b.g-a.g)*t, b: a.b+(b.b-a.b)*t })
}
function ensureContrast(hex, bgHex, minRatio) {
  let current = hex
  if (contrastRatio(current, bgHex) >= minRatio) return current
  const bgLum = relativeLuminance(hexToRgb(bgHex))
  const target = bgLum > 0.5 ? '#000000' : '#FFFFFF'
  for (let i = 1; i <= 20; i++) {
    current = mix(hex, target, i / 20)
    if (contrastRatio(current, bgHex) >= minRatio) return current
  }
  return target
}

// ── Theme builder ────────────────────────────────────────────
function buildTheme(seed) {
  const {
    id, name, emoji, family, mode, category, tier = 'pro',
    primary, primaryDark, accent, accentLight,
    bg = '#FFFFFF', surface = '#FFFFFF', isDark = false,
    success = '#16A34A', error = '#DC2626', warning = '#D97706',
    plan = 'pro', coinPrice = 0, instant = false,
    unlock = null,
  } = seed

  const rawText    = isDark ? '#F8FAFC' : '#0F0A1E'
  const text       = ensureContrast(rawText, surface, 4.5)
  const rawMuted   = isDark ? '#94A3B8' : '#6B7280'
  const textLight  = ensureContrast(rawMuted, surface, 4.5)
  const border     = isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'
  const cardBg     = surface
  const primaryDk  = primaryDark || mix(primary, '#000000', 0.2)
  const accentL    = accentLight || mix(accent, '#FFFFFF', 0.3)

  const accentOnPrimary = ensureContrast(accent, primary, 3.0)
  const primaryText = ensureContrast(primary, bg, 4.5)

  return {
    id, name, emoji, family, mode, category, tier, plan,
    coinPrice, instant, unlock, isDark,
    primary: primaryText,
    primaryDark: primaryDk,
    accent: accentOnPrimary,
    accentLight: accentL,
    background: bg,
    surface,
    text,
    textLight,
    border,
    cardBg,
    success,
    error,
    warning,
    unlocked: tier === 'free' || instant,
  }
}

// ── FREE THEMES (2 families x light/dark = 4) ────────────────
const FREE_THEMES = [
  buildTheme({
    id: 'vidya-classic', name: 'Vidya Light', emoji: '🎓', family: 'vidya', mode: 'light',
    category: 'Free', tier: 'base', plan: 'free', instant: true,
    primary: '#2D1B69', primaryDark: '#1A0D3D',
    accent: '#F59E0B', accentLight: '#FCD34D',
    bg: '#FFFFFF', surface: '#FAFAFA', isDark: false,
  }),
  buildTheme({
    id: 'vidya-midnight', name: 'Vidya Dark', emoji: '🌙', family: 'vidya', mode: 'dark',
    category: 'Free', tier: 'base', plan: 'free', instant: true,
    primary: '#A78BFA', primaryDark: '#7C3AED',
    accent: '#F59E0B', accentLight: '#FCD34D',
    bg: '#0F0A1E', surface: '#1A1033', isDark: true,
  }),
  buildTheme({
    id: 'ocean-light', name: 'Ocean Light', emoji: '🌊', family: 'ocean', mode: 'light',
    category: 'Free', tier: 'base', plan: 'free', instant: true,
    primary: '#0C4A6E', primaryDark: '#082F49',
    accent: '#06B6D4', accentLight: '#67E8F9',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'ocean-dark', name: 'Ocean Dark', emoji: '🌊', family: 'ocean', mode: 'dark',
    category: 'Free', tier: 'base', plan: 'free', instant: true,
    primary: '#38BDF8', primaryDark: '#0284C7',
    accent: '#22D3EE', accentLight: '#A5F3FC',
    bg: '#031A2B', surface: '#0C2A3E', isDark: true,
  }),
]

// ── PRO THEMES (6 families x light/dark = 12) ────────────────
const PRO_THEMES = [
  buildTheme({
    id: 'forest-light', name: 'Forest Light', emoji: '🌿', family: 'forest', mode: 'light',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: true,
    primary: '#14532D', primaryDark: '#052E16',
    accent: '#22C55E', accentLight: '#86EFAC',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'forest-dark', name: 'Forest Dark', emoji: '🌿', family: 'forest', mode: 'dark',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: true,
    primary: '#4ADE80', primaryDark: '#16A34A',
    accent: '#86EFAC', accentLight: '#BBF7D0',
    bg: '#052012', surface: '#0D3320', isDark: true,
  }),
  buildTheme({
    id: 'sunset-light', name: 'Sunset Light', emoji: '🌅', family: 'sunset', mode: 'light',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false, coinPrice: 150,
    primary: '#7C2D12', primaryDark: '#431407',
    accent: '#F97316', accentLight: '#FDBA74',
    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'sunset-dark', name: 'Sunset Dark', emoji: '🌅', family: 'sunset', mode: 'dark',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false, coinPrice: 150,
    primary: '#FB923C', primaryDark: '#EA580C',
    accent: '#FDBA74', accentLight: '#FED7AA',
    bg: '#2B1206', surface: '#3D1A08', isDark: true,
  }),
  buildTheme({
    id: 'royal-light', name: 'Royal Light', emoji: '👑', family: 'royal', mode: 'light',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false, coinPrice: 200,
    primary: '#6D28D9', primaryDark: '#5B21B6',
    accent: '#F59E0B', accentLight: '#FDE68A',
    bg: '#FAF5FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'royal-dark', name: 'Royal Dark', emoji: '👑', family: 'royal', mode: 'dark',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false, coinPrice: 200,
    primary: '#A78BFA', primaryDark: '#7C3AED',
    accent: '#F59E0B', accentLight: '#FDE68A',
    bg: '#1E1B4B', surface: '#2E2B5E', isDark: true,
  }),
  buildTheme({
    id: 'rose-light', name: 'Rose Light', emoji: '🌸', family: 'rose', mode: 'light',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false, coinPrice: 200,
    primary: '#881337', primaryDark: '#4C0519',
    accent: '#FB7185', accentLight: '#FECDD3',
    bg: '#FFF1F2', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'rose-dark', name: 'Rose Dark', emoji: '🌸', family: 'rose', mode: 'dark',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false, coinPrice: 200,
    primary: '#FB7185', primaryDark: '#E11D48',
    accent: '#FDA4AF', accentLight: '#FECDD3',
    bg: '#2B0A11', surface: '#3D0F19', isDark: true,
  }),
  buildTheme({
    id: 'slate-light', name: 'Slate Light', emoji: '⚡', family: 'slate', mode: 'light',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: true,
    primary: '#4338CA', primaryDark: '#3730A3',
    accent: '#6366F1', accentLight: '#A5B4FC',
    bg: '#F8FAFC', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'slate-dark', name: 'Slate Dark', emoji: '⚡', family: 'slate', mode: 'dark',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: true,
    primary: '#6366F1', primaryDark: '#4338CA',
    accent: '#A5B4FC', accentLight: '#C7D2FE',
    bg: '#09090B', surface: '#18181B', isDark: true,
  }),
  buildTheme({
    id: 'crimson-light', name: 'Crimson Light', emoji: '🔴', family: 'crimson', mode: 'light',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false, coinPrice: 250,
    primary: '#B91C1C', primaryDark: '#7F1D1D',
    accent: '#EF4444', accentLight: '#FCA5A5',
    bg: '#FEF2F2', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'crimson-dark', name: 'Crimson Dark', emoji: '🔴', family: 'crimson', mode: 'dark',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false, coinPrice: 250,
    primary: '#FCA5A5', primaryDark: '#F87171',
    accent: '#EF4444', accentLight: '#FCA5A5',
    bg: '#1C0A0A', surface: '#2D1010', isDark: true,
  }),
]

// ── Export ────────────────────────────────────────────────────
export const THEME_LIST = [...FREE_THEMES, ...PRO_THEMES]
export const THEMES     = THEME_LIST.reduce((acc, t) => ({ ...acc, [t.id]: t }), {})
export const DEFAULT    = 'vidya-classic'

export const THEME_FAMILIES = [
  { id: 'vidya',   label: 'Vidya',   tier: 'free' },
  { id: 'ocean',   label: 'Ocean',   tier: 'free' },
  { id: 'forest',  label: 'Forest',  tier: 'pro' },
  { id: 'sunset',  label: 'Sunset',  tier: 'pro' },
  { id: 'royal',   label: 'Royal',   tier: 'pro' },
  { id: 'rose',    label: 'Rose',    tier: 'pro' },
  { id: 'slate',   label: 'Slate',   tier: 'pro' },
  { id: 'crimson', label: 'Crimson', tier: 'pro' },
]

export const THEME_CATEGORIES = [
  { id: 'free', label: 'Free', count: FREE_THEMES.length },
  { id: 'pro',  label: 'Pro',  count: PRO_THEMES.length },
]

export function getTheme(id) {
  return THEMES[id] || THEMES[DEFAULT]
}

// Given a theme id, return the id of its light/dark counterpart within the same family
export function getCounterpartThemeId(id) {
  const current = THEMES[id]
  if (!current) return DEFAULT
  const targetMode = current.mode === 'dark' ? 'light' : 'dark'
  const counterpart = THEME_LIST.find(t => t.family === current.family && t.mode === targetMode)
  return counterpart ? counterpart.id : id
}

export const BASE_THEME_IDS = FREE_THEMES.map(t => t.id)
export const PRO_THEME_IDS  = PRO_THEMES.map(t => t.id)
export const ULTRA_THEME_IDS = []
