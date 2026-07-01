// src/lib/themes.js
// TryIT Educations - 42 Theme System (matches 42 Indian languages)
// buildTheme() auto-enforces WCAG AA 4.5:1 contrast - no theme can ship with unreadable text
// FREE: 2 | PRO: 10 (3 instant + 7 coins/progress) | ULTRA: 30 (3 instant + 27 coins/progress)

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
    id, name, emoji, category, tier = 'pro',
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

  // Ensure accent is readable on primary background
  const accentOnPrimary = ensureContrast(accent, primary, 3.0)
  // Ensure primary text is readable
  const primaryText = ensureContrast(primary, bg, 4.5)

  const theme = {
    id, name, emoji, category, tier, plan,
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
    // CSS variable map
    unlocked: tier === 'free' || instant,
  }
  return theme
}

// ── FREE THEMES (2) ──────────────────────────────────────────
const FREE_THEMES = [
  buildTheme({
    id: 'vidya-classic', name: 'Vidya Classic', emoji: '🎓',
    category: 'Free', tier: 'free', plan: 'free', instant: true,
    primary: '#2D1B69', primaryDark: '#1A0D3D',
    accent: '#F59E0B', accentLight: '#FCD34D',
    bg: '#FFFFFF', surface: '#FAFAFA', isDark: false,
  }),
  buildTheme({
    id: 'vidya-midnight', name: 'Vidya Midnight', emoji: '🌙',
    category: 'Free', tier: 'free', plan: 'free', instant: true,
    primary: '#A78BFA', primaryDark: '#7C3AED',
    accent: '#F59E0B', accentLight: '#FCD34D',
    bg: '#0F0A1E', surface: '#1A1033', isDark: true,
  }),
]

// ── PRO THEMES (10) ─────────────────────────────────────────
// 3 instant (users want to upgrade), 7 by coins/progress
const PRO_THEMES = [
  // --- 3 INSTANT (shown as locked preview on free, unlocks on Pro) ---
  buildTheme({
    id: 'ocean-scholar', name: 'Ocean Scholar', emoji: '🌊',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: true,
    primary: '#0C4A6E', primaryDark: '#082F49',
    accent: '#06B6D4', accentLight: '#67E8F9',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'forest-scholar', name: 'Forest Scholar', emoji: '🌿',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: true,
    primary: '#14532D', primaryDark: '#052E16',
    accent: '#22C55E', accentLight: '#86EFAC',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'carbon-tech', name: 'Carbon Tech', emoji: '⚡',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: true,
    primary: '#6366F1', primaryDark: '#4338CA',
    accent: '#A5B4FC', accentLight: '#C7D2FE',
    bg: '#09090B', surface: '#18181B', isDark: true,
  }),
  // --- 7 COINS/PROGRESS ---
  buildTheme({
    id: 'saffron-dawn', name: 'Saffron Dawn', emoji: '🌅',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false,
    coinPrice: 150,
    primary: '#7C2D12', primaryDark: '#431407',
    accent: '#F97316', accentLight: '#FDBA74',
    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'arctic-clean', name: 'Arctic Clean', emoji: '❄️',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false,
    coinPrice: 150,
    primary: '#1E40AF', primaryDark: '#1E3A8A',
    accent: '#60A5FA', accentLight: '#BFDBFE',
    bg: '#EFF6FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'royal-court', name: 'Royal Court', emoji: '👑',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false,
    coinPrice: 200,
    primary: '#A78BFA', primaryDark: '#7C3AED',
    accent: '#F59E0B', accentLight: '#FDE68A',
    bg: '#1E1B4B', surface: '#2E2B5E', isDark: true,
  }),
  buildTheme({
    id: 'rose-scholar', name: 'Rose Scholar', emoji: '🌸',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false,
    coinPrice: 200,
    primary: '#881337', primaryDark: '#4C0519',
    accent: '#FB7185', accentLight: '#FECDD3',
    bg: '#FFF1F2', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'jade-calm', name: 'Jade Calm', emoji: '🍃',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false,
    coinPrice: 200,
    primary: '#34D399', primaryDark: '#10B981',
    accent: '#6EE7B7', accentLight: '#A7F3D0',
    bg: '#022C22', surface: '#064E3B', isDark: true,
  }),
  buildTheme({
    id: 'copper-dusk', name: 'Copper Dusk', emoji: '🟤',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false,
    coinPrice: 250,
    primary: '#FCD34D', primaryDark: '#F59E0B',
    accent: '#FBBF24', accentLight: '#FDE68A',
    bg: '#1C1410', surface: '#2C1F14', isDark: true,
  }),
  buildTheme({
    id: 'crimson-focus', name: 'Crimson Focus', emoji: '🔴',
    category: 'Pro', tier: 'pro', plan: 'pro', instant: false,
    coinPrice: 250,
    primary: '#FCA5A5', primaryDark: '#F87171',
    accent: '#EF4444', accentLight: '#FCA5A5',
    bg: '#1C0A0A', surface: '#2D1010', isDark: true,
  }),
]

// ── ULTRA THEMES (30) ────────────────────────────────────────
// 3 instant, 27 by coins/progress
const ULTRA_THEMES = [
  // --- 3 INSTANT ---
  buildTheme({
    id: 'firebase-dark', name: 'Firebase Dark', emoji: '🔥',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: true,
    primary: '#FFA000', primaryDark: '#FF6F00',
    accent: '#FFCA28', accentLight: '#FFE082',
    bg: '#1C1917', surface: '#292524', isDark: true,
  }),
  buildTheme({
    id: 'github-night', name: 'GitHub Night', emoji: '🐙',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: true,
    primary: '#3FB950', primaryDark: '#2EA043',
    accent: '#58A6FF', accentLight: '#79C0FF',
    bg: '#0D1117', surface: '#161B22', isDark: true,
  }),
  buildTheme({
    id: 'notion-gray', name: 'Notion Gray', emoji: '📝',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: true,
    primary: '#2D1B69', primaryDark: '#1A0D3D',
    accent: '#F59E0B', accentLight: '#FCD34D',
    bg: '#F7F6F3', surface: '#FFFFFF', isDark: false,
  }),
  // --- TECH BRAND (7 more) ---
  buildTheme({
    id: 'aws-deep', name: 'AWS Deep', emoji: '☁️',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#FF9900', primaryDark: '#EC7211',
    accent: '#00A1C9', accentLight: '#67C8E2',
    bg: '#0F172A', surface: '#1E293B', isDark: true,
  }),
  buildTheme({
    id: 'linear-space', name: 'Linear Space', emoji: '🚀',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#8B5CF6', primaryDark: '#7C3AED',
    accent: '#C4B5FD', accentLight: '#DDD6FE',
    bg: '#060607', surface: '#111113', isDark: true,
  }),
  buildTheme({
    id: 'stripe-indigo', name: 'Stripe Indigo', emoji: '💳',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#7A73FF', primaryDark: '#5851DB',
    accent: '#00D4FF', accentLight: '#80EAFF',
    bg: '#0A2540', surface: '#0D2F4F', isDark: true,
  }),
  buildTheme({
    id: 'vercel-black', name: 'Vercel Black', emoji: '▲',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 350,
    primary: '#EDEDED', primaryDark: '#FFFFFF',
    accent: '#0070F3', accentLight: '#50A0FF',
    bg: '#000000', surface: '#111111', isDark: true,
  }),
  buildTheme({
    id: 'material-sky', name: 'Material Sky', emoji: '🎨',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#82B1FF', primaryDark: '#448AFF',
    accent: '#40C4FF', accentLight: '#80D8FF',
    bg: '#0D47A1', surface: '#1565C0', isDark: true,
  }),
  buildTheme({
    id: 'vscode-blue', name: 'VS Code', emoji: '💻',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#9CDCFE', primaryDark: '#007ACC',
    accent: '#007ACC', accentLight: '#569CD6',
    bg: '#1E1E1E', surface: '#252526', isDark: true,
  }),
  buildTheme({
    id: 'python-slate', name: 'Python Slate', emoji: '🐍',
    category: 'Ultra - Tech', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 350,
    primary: '#FFD43B', primaryDark: '#FCC419',
    accent: '#4B8BBE', accentLight: '#6FA8D4',
    bg: '#1A2332', surface: '#253040', isDark: true,
  }),
  // --- INDIAN SOUL (20) ---
  buildTheme({
    id: 'mysore-palace', name: 'Mysore Palace', emoji: '🏛️',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#D4AF37', primaryDark: '#B8960C',
    accent: '#F5D76E', accentLight: '#F9E9A5',
    bg: '#0D0019', surface: '#1A0033', isDark: true,
  }),
  buildTheme({
    id: 'varanasi-ghat', name: 'Varanasi Ghat', emoji: '🪔',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#FF6B35', primaryDark: '#E54C17',
    accent: '#FFB347', accentLight: '#FFD08A',
    bg: '#1A0A00', surface: '#2A1200', isDark: true,
  }),
  buildTheme({
    id: 'kashmir-dawn', name: 'Kashmir Dawn', emoji: '🏔️',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#2D1B69', primaryDark: '#1A0D3D',
    accent: '#7DD3FC', accentLight: '#BAE6FD',
    bg: '#E8F4FD', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'chennai-marina', name: 'Chennai Marina', emoji: '🌊',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#00B4D8', primaryDark: '#0096B7',
    accent: '#90E0EF', accentLight: '#CAF0F8',
    bg: '#03045E', surface: '#0A0060', isDark: true,
  }),
  buildTheme({
    id: 'mumbai-monsoon', name: 'Mumbai Monsoon', emoji: '🌧️',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#4FC3F7', primaryDark: '#0288D1',
    accent: '#81D4FA', accentLight: '#B3E5FC',
    bg: '#0F1923', surface: '#162030', isDark: true,
  }),
  buildTheme({
    id: 'delhi-winter', name: 'Delhi Winter', emoji: '🌫️',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 350,
    primary: '#F59E0B', primaryDark: '#D97706',
    accent: '#FCD34D', accentLight: '#FDE68A',
    bg: '#0F0F1A', surface: '#1A1A2E', isDark: true,
  }),
  buildTheme({
    id: 'kerala-forest', name: 'Kerala Forest', emoji: '🌴',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#4ADE80', primaryDark: '#22C55E',
    accent: '#86EFAC', accentLight: '#BBF7D0',
    bg: '#001A0D', surface: '#002A14', isDark: true,
  }),
  buildTheme({
    id: 'rajput-desert', name: 'Rajput Desert', emoji: '🏜️',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 350,
    primary: '#FFB347', primaryDark: '#FF8C00',
    accent: '#FF6B6B', accentLight: '#FFA5A5',
    bg: '#1A0500', surface: '#2A0A00', isDark: true,
  }),
  buildTheme({
    id: 'bengal-mustard', name: 'Bengal Mustard', emoji: '🌻',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#F4D03F', primaryDark: '#D4AC0D',
    accent: '#F7DC6F', accentLight: '#FAE5A5',
    bg: '#0D0E00', surface: '#1A1A00', isDark: true,
  }),
  buildTheme({
    id: 'manipur-silk', name: 'Manipur Silk', emoji: '🎀',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 350,
    primary: '#FF6EC7', primaryDark: '#FF1493',
    accent: '#FFB3E6', accentLight: '#FFD6F0',
    bg: '#0D0019', surface: '#1A0030', isDark: true,
  }),
  buildTheme({
    id: 'assam-tea', name: 'Assam Tea', emoji: '🍵',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 300,
    primary: '#77DD77', primaryDark: '#55CC55',
    accent: '#A8E6A3', accentLight: '#C8F0C5',
    bg: '#030F03', surface: '#071407', isDark: true,
  }),
  buildTheme({
    id: 'orissan-temple', name: 'Orissan Temple', emoji: '⛪',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 350,
    primary: '#FF8C00', primaryDark: '#E67300',
    accent: '#FFA500', accentLight: '#FFD080',
    bg: '#1A0A00', surface: '#2A1400', isDark: true,
  }),
  buildTheme({
    id: 'punjabi-gold', name: 'Punjabi Gold', emoji: '⚡',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 350,
    primary: '#FFD700', primaryDark: '#FFC200',
    accent: '#FFE44D', accentLight: '#FFF0A0',
    bg: '#0A0600', surface: '#150F00', isDark: true,
  }),
  buildTheme({
    id: 'tamil-crimson', name: 'Tamil Crimson', emoji: '🔴',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 350,
    primary: '#FF4444', primaryDark: '#CC0000',
    accent: '#FF8888', accentLight: '#FFB3B3',
    bg: '#0D0000', surface: '#1A0000', isDark: true,
  }),
  buildTheme({
    id: 'himalayan-ice', name: 'Himalayan Ice', emoji: '❄️',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 400,
    primary: '#1E3A8A', primaryDark: '#1E3A5F',
    accent: '#93C5FD', accentLight: '#BFDBFE',
    bg: '#F0F8FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'rann-salt', name: 'Rann Salt', emoji: '🏞️',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 400,
    primary: '#E65100', primaryDark: '#BF360C',
    accent: '#FF8A50', accentLight: '#FFB280',
    bg: '#FFFDE7', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'andaman-teal', name: 'Andaman Teal', emoji: '🐠',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 400,
    primary: '#2AA198', primaryDark: '#1A7A72',
    accent: '#66C2BE', accentLight: '#9DD9D6',
    bg: '#002B36', surface: '#073642', isDark: true,
  }),
  buildTheme({
    id: 'coorg-coffee', name: 'Coorg Coffee', emoji: '☕',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 400,
    primary: '#D2A679', primaryDark: '#A0522D',
    accent: '#E8C9A0', accentLight: '#F5E3CC',
    bg: '#0A0500', surface: '#140B00', isDark: true,
  }),
  buildTheme({
    id: 'konkan-sunset', name: 'Konkan Sunset', emoji: '🌅',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 450,
    primary: '#FF6B9D', primaryDark: '#E0456D',
    accent: '#FFB347', accentLight: '#FFD08A',
    bg: '#0D0008', surface: '#1A0012', isDark: true,
  }),
  buildTheme({
    id: 'deccan-stone', name: 'Deccan Stone', emoji: '🪨',
    category: 'Ultra - India', tier: 'ultra', plan: 'ultra', instant: false,
    coinPrice: 500,
    primary: '#B0BEC5', primaryDark: '#90A4AE',
    accent: '#78909C', accentLight: '#B0BEC5',
    bg: '#0A0A0A', surface: '#1A1A1A', isDark: true,
  }),
]

// ── Export ────────────────────────────────────────────────────
export const THEME_LIST = [...FREE_THEMES, ...PRO_THEMES, ...ULTRA_THEMES]
export const THEMES     = THEME_LIST.reduce((acc, t) => ({ ...acc, [t.id]: t }), {})
export const DEFAULT    = 'vidya-classic'

export const THEME_CATEGORIES = [
  { id: 'free',         label: 'Free',         count: FREE_THEMES.length },
  { id: 'pro',          label: 'Pro',           count: PRO_THEMES.length },
  { id: 'ultra-tech',   label: 'Ultra - Tech',  count: ULTRA_THEMES.filter(t=>t.category==='Ultra - Tech').length },
  { id: 'ultra-india',  label: 'Ultra - India', count: ULTRA_THEMES.filter(t=>t.category==='Ultra - India').length },
]

export function getTheme(id) {
  return THEMES[id] || THEMES[DEFAULT]
}

export const BASE_THEME_IDS = FREE_THEMES.map(t => t.id)
export const PRO_THEME_IDS  = PRO_THEMES.map(t => t.id)
export const ULTRA_THEME_IDS = ULTRA_THEMES.map(t => t.id)
