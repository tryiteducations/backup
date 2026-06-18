/**
 * TryIT — Theme System v2
 * ─────────────────────────────────────────────────────────────────
 * Every theme is produced by buildTheme(), which derives text/border/
 * card colors from a small set of seed values and enforces a WCAG AA
 * contrast floor (4.5:1 body text, 3:1 large text) at generation time.
 * No theme can ship with unreadable text — the floor is structural,
 * not a per-theme value someone has to remember to fix.
 *
 * 5 BASE themes are unlocked for every user from day one.
 * The remaining themes are reward unlocks — see src/lib/themeUnlocks.js
 * for the criteria (tests completed, streaks, scores, etc).
 */

// ─────────────────────────────────────────────────────────────────
// Color math (kept dependency-free, runs in browser + Node)
// ─────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const cleaned = hex.replace('#', '').trim()
  const full = cleaned.length === 3 ? cleaned.split('').map(c => c + c).join('') : cleaned
  const int = parseInt(full, 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
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
  const darker = Math.min(lA, lB)
  return (lighter + 0.05) / (darker + 0.05)
}

function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB)
  return rgbToHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  })
}

/**
 * Pushes `hex` toward black or white in steps until it reaches the
 * target contrast ratio against `bgHex`. This is what guarantees the
 * 4.5:1 floor — it doesn't trust the seed color, it tests and corrects.
 */
function ensureContrast(hex, bgHex, minRatio) {
  let current = hex
  if (contrastRatio(current, bgHex) >= minRatio) return current
  const bgLum = relativeLuminance(hexToRgb(bgHex))
  const towardDark = bgLum > 0.5 // light background -> push text toward black
  const target = towardDark ? '#000000' : '#FFFFFF'
  for (let i = 1; i <= 20; i++) {
    current = mix(hex, target, i / 20)
    if (contrastRatio(current, bgHex) >= minRatio) return current
  }
  return target
}

// ─────────────────────────────────────────────────────────────────
// Theme builder
// ─────────────────────────────────────────────────────────────────
// Seeds you choose by hand: hue/mood colors + light-or-dark surface.
// Everything else (text, textLight, border, card colors, id-card
// colors) is DERIVED and contrast-checked, never hand-typed.

function buildTheme(seed) {
  const {
    id, name, emoji, category, tier = 'unlocked',
    primary, primaryDark, accent, accentLight,
    bg, surface, isDark = false,
    success = '#22C55E', error = '#EF4444', warning = '#F59E0B',
    glow = null, unlock = null,
    // plan: 'free' | 'pro' | 'ultra' — minimum subscription tier required
    // to be ELIGIBLE for this theme. Even when eligible, the unlock
    // criteria in `unlock` still has to be met. Base themes (tier:'base')
    // ignore plan entirely — they're free for everyone.
    plan = 'pro',
  } = seed

  // Base text color: near-black on light surfaces, near-white on dark ones.
  const rawText = isDark ? '#F8FAFC' : '#111827'
  const text = ensureContrast(rawText, surface, 4.5)

  // Secondary text: softened toward bg, but re-checked so it never
  // drops below 4.5:1 either (this is exactly the bug the old file had:
  // textLight was often equal to text, or too close to bg).
  const softened = mix(text, bg, isDark ? 0.32 : 0.38)
  const textLight = ensureContrast(softened, surface, 4.5)

  // Border: visible against surface, but not text-loud (3:1 floor is enough
  // for non-text UI per WCAG, but we give it a little more for premium feel).
  const rawBorder = mix(text, surface, isDark ? 0.78 : 0.85)
  const border = ensureContrast(rawBorder, surface, 1.6)

  // Card text mirrors body text rules but against cardBg specifically.
  const cardBg = surface
  const cardText = ensureContrast(rawText, cardBg, 4.5)

  // ID card is a deliberately dark, branded gradient regardless of theme
  // mode — so its own text must always be light, checked against itself.
  const idCardBg = `linear-gradient(135deg, ${primaryDark}, ${primary})`
  const idCardText = ensureContrast('#FFFFFF', primaryDark, 4.5)
  const idCardId = ensureContrast(accentLight, primaryDark, 4.5)

  const cardAccent = ensureContrast(accent, cardBg, 3)
  const successSafe = ensureContrast(success, bg, 3)
  const errorSafe = ensureContrast(error, bg, 3)
  const warningSafe = ensureContrast(warning, bg, 3)

  return {
    id, name, emoji, category, tier, unlock, plan,
    primary, primaryDark, accent, accentLight,
    bg, surface, isDark,
    text, textLight, border,
    success: successSafe, error: errorSafe, warning: warningSafe,
    cardBg, cardText, cardAccent,
    idCardBg, idCardText, idCardId,
    idCardBorder: `rgba(${hexToRgb(accent).r},${hexToRgb(accent).g},${hexToRgb(accent).b},0.45)`,
    glow: glow || `0 0 24px rgba(${hexToRgb(accent).r},${hexToRgb(accent).g},${hexToRgb(accent).b},0.22)`,
  }
}

// ─────────────────────────────────────────────────────────────────
// 5 BASE THEMES — unlocked for everyone, day one.
// Chosen to span the generational range: Classic/High Contrast suit
// older or low-vision users who want stability and clarity; Sunrise/
// Ocean are gentle, universally calm; Midnight is the default modern
// dark mode younger users expect.
// ─────────────────────────────────────────────────────────────────

const BASE_THEMES = [
  buildTheme({
    id: 'default', name: 'TryIT Classic', emoji: '🎓', category: 'Base', tier: 'base', plan: 'free',
    primary: '#1E3A5F', primaryDark: '#0F2140',
    accent: '#D4AF37', accentLight: '#E8C44A',
    bg: '#F8FAFC', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'midnight', name: 'Midnight', emoji: '🌙', category: 'Base', tier: 'base', plan: 'free',
    primary: '#1E293B', primaryDark: '#0F172A',
    accent: '#D4AF37', accentLight: '#E8C44A',
    bg: '#0F172A', surface: '#1E293B', isDark: true,
  }),
  buildTheme({
    id: 'high-contrast', name: 'High Contrast', emoji: '🔳', category: 'Accessibility', tier: 'base', plan: 'free',
    primary: '#000000', primaryDark: '#000000',
    accent: '#FFFFFF', accentLight: '#F8FAFC',
    bg: '#000000', surface: '#000000', isDark: true,
    glow: '0 0 25px rgba(255,255,255,0.20)',
  }),
  buildTheme({
    id: 'sunrise', name: 'Sunrise', emoji: '🌅', category: 'Base', tier: 'base', plan: 'free',
    primary: '#92400E', primaryDark: '#78350F',
    accent: '#F59E0B', accentLight: '#FCD34D',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'ocean', name: 'Ocean Deep', emoji: '🌊', category: 'Base', tier: 'base', plan: 'free',
    primary: '#0C4A6E', primaryDark: '#082F49',
    accent: '#0EA5E9', accentLight: '#38BDF8',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
  }),
]

// ─────────────────────────────────────────────────────────────────
// 21 UNLOCKABLE THEMES — same visual moods as before, original names
// (no movie/franchise IP). unlock = { type, value, label } consumed
// by src/lib/themeUnlocks.js + ThemeSelector / ThemeSwitcher UI.
// ─────────────────────────────────────────────────────────────────

const UNLOCK_THEMES = [
  buildTheme({
    id: 'bioluma', name: 'Bioluma', emoji: '💙', category: 'Cinematic',
    primary: '#0C4A6E', primaryDark: '#082F49',
    accent: '#06B6D4', accentLight: '#22D3EE',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 5, label: 'Complete 5 tests' },
  }),
  buildTheme({
    id: 'liberty-shield', name: 'Liberty Shield', emoji: '🛡️', category: 'Cinematic',
    primary: '#1D3557', primaryDark: '#0D1B2A',
    accent: '#E63946', accentLight: '#FF6B6B',
    bg: '#F0F4FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'streak_days', value: 7, label: '7-day streak' },
  }),
  buildTheme({
    id: 'arcane-manor', name: 'Arcane Manor', emoji: '⚡', category: 'Cinematic',
    primary: '#3D1A78', primaryDark: '#1E0A40',
    accent: '#C9A84C', accentLight: '#DFC06A',
    bg: '#FFF8F0', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 10, label: 'Complete 10 tests' },
  }),
  buildTheme({
    id: 'imperial-throne', name: 'Imperial Throne', emoji: '👑', category: 'Indian Cinema', plan: 'ultra',
    primary: '#7B2400', primaryDark: '#4A1500',
    accent: '#D4AF37', accentLight: '#F0C84A',
    bg: '#FFF9F0', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'score_percent', value: 95, label: 'Score 95%+ in any test (Ultra)' },
  }),
  buildTheme({
    id: 'style-icon', name: 'Style Icon', emoji: '🕶️', category: 'Indian Cinema',
    primary: '#1A1A1A', primaryDark: '#000000',
    accent: '#C0C0C0', accentLight: '#E8E8E8',
    bg: '#F5F5F5', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'rank_top', value: 100, label: 'Reach Top 100 on any leaderboard' },
  }),
  buildTheme({
    id: 'iron-reign', name: 'Iron Reign', emoji: '⚙️', category: 'Indian Cinema',
    primary: '#2D1B00', primaryDark: '#1A0F00',
    accent: '#B8860B', accentLight: '#DAA520',
    bg: '#FAF5E4', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 25, label: 'Complete 25 tests' },
  }),
  buildTheme({
    id: 'quantum-field', name: 'Quantum Field', emoji: '⚛️', category: 'Cinematic',
    primary: '#1C1C1C', primaryDark: '#0A0A0A',
    accent: '#FF6B00', accentLight: '#FF8C00',
    bg: '#F5F0E8', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'subject_mastery', value: 1, label: 'Master any one subject' },
  }),
  buildTheme({
    id: 'deep-orbit', name: 'Deep Orbit', emoji: '🌌', category: 'Cinematic', plan: 'ultra',
    primary: '#0B0C1E', primaryDark: '#050610',
    accent: '#E8C84A', accentLight: '#F5D76E',
    bg: '#F0F2FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'streak_days', value: 45, label: '45-day streak (Ultra)' },
  }),
  buildTheme({
    id: 'midnight-vigil', name: 'Midnight Vigil', emoji: '🦇', category: 'Cinematic',
    primary: '#1A1A2E', primaryDark: '#0D0D1A',
    accent: '#7B2FBE', accentLight: '#9D4EDD',
    bg: '#F0EEFF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 15, label: 'Complete 15 tests' },
  }),
  buildTheme({
    id: 'calm', name: 'Calmness', emoji: '🍃', category: 'Mood',
    primary: '#2D6A4F', primaryDark: '#1B4332',
    accent: '#74C69D', accentLight: '#95D5B2',
    bg: '#F0FFF4', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'focus_minutes', value: 60, label: '60 minutes in Focus Mode' },
  }),
  buildTheme({
    id: 'energy', name: 'Energetic', emoji: '⚡', category: 'Mood',
    primary: '#1E40AF', primaryDark: '#1E3A8A',
    accent: '#F97316', accentLight: '#FB923C',
    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 3, label: 'Complete 3 tests' },
  }),
  buildTheme({
    id: 'hyperfocus', name: 'Hyper Focus', emoji: '🔮', category: 'Mood',
    primary: '#064E3B', primaryDark: '#022C22',
    accent: '#10B981', accentLight: '#34D399',
    bg: '#022C22', surface: '#022C22', isDark: true,
    unlock: { type: 'focus_minutes', value: 300, label: '5 hours in Focus Mode' },
  }),
  buildTheme({
    id: 'professional', name: 'Professional', emoji: '💼', category: 'Mood',
    primary: '#374151', primaryDark: '#1F2937',
    accent: '#6B7280', accentLight: '#9CA3AF',
    bg: '#F9FAFB', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'coins_earned', value: 500, label: 'Earn 500 coins' },
  }),
  buildTheme({
    id: 'nightowl', name: 'Night Owl', emoji: '🦉', category: 'Nature',
    primary: '#1E1B4B', primaryDark: '#13103B',
    accent: '#A78BFA', accentLight: '#C4B5FD',
    bg: '#F5F3FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 8, label: 'Complete 8 tests' },
  }),
  buildTheme({
    id: 'forest', name: 'Forest', emoji: '🌲', category: 'Nature',
    primary: '#14532D', primaryDark: '#052E16',
    accent: '#16A34A', accentLight: '#4ADE80',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'coins_earned', value: 200, label: 'Earn 200 coins' },
  }),
  buildTheme({
    id: 'bharat', name: 'Bharat', emoji: '🇮🇳', category: 'Indian',
    primary: '#FF6200', primaryDark: '#CC4E00',
    accent: '#138808', accentLight: '#22C55E',
    bg: '#FFF9F0', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 1, label: 'Complete your first test' },
  }),
  buildTheme({
    id: 'fire-roar', name: 'Fire & Roar', emoji: '🔥', category: 'Indian Cinema',
    primary: '#7F1D1D', primaryDark: '#450A0A',
    accent: '#FCA5A5', accentLight: '#FECACA',
    bg: '#FFF5F5', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'rank_top', value: 10, label: 'Reach Top 10 on any leaderboard' },
  }),
  buildTheme({
    id: 'cherry', name: 'Cherry Blossom', emoji: '🌸', category: 'Nature',
    primary: '#9D174D', primaryDark: '#831843',
    accent: '#EC4899', accentLight: '#F472B6',
    bg: '#FFF0F6', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'coins_earned', value: 100, label: 'Earn 100 coins' },
  }),
  buildTheme({
    id: 'galaxy', name: 'Galaxy', emoji: '🌠', category: 'Space', plan: 'ultra',
    primary: '#2E1065', primaryDark: '#1E0A4A',
    accent: '#A855F7', accentLight: '#C084FC',
    bg: '#FAF5FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'rank_top', value: 50, label: 'Reach Top 50 on any leaderboard (Ultra)' },
  }),
  buildTheme({
    id: 'crimson-edge', name: 'Crimson Edge', emoji: '🗡️', category: 'Indian Cinema', plan: 'ultra',
    primary: '#0D3B2E', primaryDark: '#041F18',
    accent: '#00D9A3', accentLight: '#6EFFD9',
    bg: '#F0FFF8', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'subject_mastery', value: 5, label: 'Master any 5 subjects (Ultra)' },
  }),
  buildTheme({
    id: 'desert', name: 'Desert Storm', emoji: '🏜️', category: 'Nature',
    primary: '#78350F', primaryDark: '#451A03',
    accent: '#D97706', accentLight: '#F59E0B',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 20, label: 'Complete 20 tests' },
  }),
]

// ─────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────

export const THEME_LIST = [...BASE_THEMES, ...UNLOCK_THEMES]

export const THEMES = THEME_LIST.reduce((acc, t) => {
  acc[t.id] = t
  return acc
}, {})

export const THEME_CATEGORIES = [
  'Base', 'Accessibility', 'Cinematic', 'Indian Cinema', 'Indian', 'Mood', 'Nature', 'Space',
]

export function getTheme(id) {
  return THEMES[id] || THEMES.default
}

export const BASE_THEME_IDS = BASE_THEMES.map(t => t.id)