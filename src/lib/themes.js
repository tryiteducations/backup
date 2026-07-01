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
  // ══════════════════════════════════════════
  // BATCH 1 — FREE THEMES (Light & Readable)
  // ══════════════════════════════════════════

  buildTheme({
    id: 'default', name: 'Vidya Indigo', emoji: '🎓', category: 'Base', tier: 'base', plan: 'free',
    primary: '#2D1B69', primaryDark: '#1A0D3D',
    accent: '#F59E0B', accentLight: '#FCD34D',
    bg: '#FFFFFF', surface: '#FAFAFA', isDark: false,
    bg: '#F8FAFC', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'blue-white', name: 'Jasmine at Dawn', emoji: '💙', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#1E40AF', primaryDark: '#1D4ED8',
    accent: '#2563EB', accentLight: '#93C5FD',
    bg: '#F8FAFF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'rose-white', name: 'Lotus in Bloom', emoji: '🌸', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#BE185D', primaryDark: '#9D174D',
    accent: '#EC4899', accentLight: '#FBCFE8',
    bg: '#FFF0F6', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'sky-fresh', name: 'Andaman Sky', emoji: '☁️', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#0369A1', primaryDark: '#0284C7',
    accent: '#0EA5E9', accentLight: '#BAE6FD',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'emerald-clean', name: 'Kerala Backwater', emoji: '💚', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#065F46', primaryDark: '#064E3B',
    accent: '#10B981', accentLight: '#A7F3D0',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'violet-soft', name: 'Nilambari Dusk', emoji: '💜', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#5B21B6', primaryDark: '#4C1D95',
    accent: '#7C3AED', accentLight: '#DDD6FE',
    bg: '#FAF5FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'coral-bright', name: 'Saffron Sunrise', emoji: '🪸', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#9A3412', primaryDark: '#7C2D12',
    accent: '#F97316', accentLight: '#FED7AA',
    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'karur-sunset', name: 'Karur Twilight', emoji: '🌇', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#C2410C', primaryDark: '#9A3412',
    accent: '#FB923C', accentLight: '#FFEDD5',
    bg: '#FFF4E6', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'midnight', name: 'Midnight Ganges', emoji: '🌙', category: 'Base', tier: 'base', plan: 'free',
    primary: '#3B82F6', primaryDark: '#2563EB',
    accent: '#60A5FA', accentLight: '#BFDBFE',
    bg: '#0F172A', surface: '#1E293B', isDark: true,
  }),
  buildTheme({
    id: 'pink-dark', name: 'Gulab Raat', emoji: '🌃', category: 'Base', tier: 'base', plan: 'free',
    primary: '#DB2777', primaryDark: '#BE185D',
    accent: '#F472B6', accentLight: '#FBCFE8',
    bg: '#1A000E', surface: '#2A0018', isDark: true,
  }),
  // ── INDIAN STATES ──────────────────────────────
  buildTheme({
    id: 'tamilnadu', name: 'Madurai Kovil', emoji: '🏛️', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#7C0000', primaryDark: '#5C0000',
    accent: '#DC2626', accentLight: '#FCA5A5',
    bg: '#FFF5F5', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'kerala', name: 'Wayanad Forest', emoji: '🌴', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#14532D', primaryDark: '#052E16',
    accent: '#16A34A', accentLight: '#BBF7D0',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'rajasthan', name: 'Thar Shimmer', emoji: '🏜️', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#92400E', primaryDark: '#78350F',
    accent: '#D97706', accentLight: '#FDE68A',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'bengal', name: 'Sundarbans Gold', emoji: '🐯', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#713F12', primaryDark: '#451A03',
    accent: '#D97706', accentLight: '#FEF3C7',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'punjab', name: 'Baisakhi Breeze', emoji: '🌾', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#365314', primaryDark: '#1A2E05',
    accent: '#65A30D', accentLight: '#D9F99D',
    bg: '#F7FEE7', surface: '#FFFFFF', isDark: false,
  }),

  // ── EXAM MOODS ──────────────────────────────────
  buildTheme({
    id: 'focus-mode', name: 'Abhyas Neel', emoji: '🎯', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#1E3A5F', primaryDark: '#0F2140',
    accent: '#3B82F6', accentLight: '#BFDBFE',
    bg: '#F8FAFF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'night-study', name: 'Ratri Adhyayan', emoji: '🦉', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#6366F1', primaryDark: '#4F46E5',
    accent: '#818CF8', accentLight: '#C7D2FE',
    bg: '#020617', surface: '#0F172A', isDark: true,
  }),
  buildTheme({
    id: 'morning-fresh', name: 'Brahma Muhurta', emoji: '☀️', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#B45309', primaryDark: '#92400E',
    accent: '#F59E0B', accentLight: '#FDE68A',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'power-hour', name: 'Veer Shakti', emoji: '⚡', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#1D4ED8', primaryDark: '#1E40AF',
    accent: '#EAB308', accentLight: '#FEF08A',
    bg: '#0A0A0A', surface: '#1A1A1A', isDark: true,
  }),
  buildTheme({
    id: 'calm-study', name: 'Shant Sagar', emoji: '🍃', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#0F4C81', primaryDark: '#093562',
    accent: '#0EA5E9', accentLight: '#BAE6FD',
    bg: '#F0F8FF', surface: '#FFFFFF', isDark: false,
  }),

  buildTheme({
    id: 'high-contrast', name: 'Spashta Drishti', emoji: '🔳', category: 'Accessibility', tier: 'base', plan: 'free',
    primary: '#000000', primaryDark: '#000000',
    accent: '#FFFF00', accentLight: '#FFFFFF',
    bg: '#000000', surface: '#000000', isDark: true,
    glow: '0 0 25px rgba(255,255,255,0.20)',
  }),
  buildTheme({
    id: 'sunrise', name: 'Brahma Sunrise', emoji: '🌅', category: 'Base', tier: 'base', plan: 'free',
    primary: '#92400E', primaryDark: '#78350F',
    accent: '#F59E0B', accentLight: '#FCD34D',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'ocean', name: 'Sagara Deep', emoji: '🌊', category: 'Base', tier: 'base', plan: 'free',
    primary: '#0C4A6E', primaryDark: '#082F49',
    accent: '#0EA5E9', accentLight: '#38BDF8',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'sunrise-dark-DISABLED', name: 'Sunrise Dark', emoji: '🌅', category: 'Base', tier: 'base', plan: 'free',
    primary: '#92400E', primaryDark: '#78350F',
    accent: '#F59E0B', accentLight: '#FCD34D',
    bg: '#1A0E00', surface: '#2D1800', isDark: true,
  }),
  buildTheme({
    id: 'ocean-dark-DISABLED', name: 'Ocean Night', emoji: '🌊', category: 'Base', tier: 'base', plan: 'free',
    primary: '#0C4A6E', primaryDark: '#082F49',
    accent: '#0EA5E9', accentLight: '#38BDF8',
    bg: '#020F1A', surface: '#0C1F33', isDark: true,
  }),
]

// ─────────────────────────────────────────────────────────────────
// 21 UNLOCKABLE THEMES — same visual moods as before, original names
// (no movie/franchise IP). unlock = { type, value, label } consumed
// by src/lib/themeUnlocks.js + ThemeSelector / ThemeSwitcher UI.
// ─────────────────────────────────────────────────────────────────

const UNLOCK_THEMES = [
  buildTheme({
    id: 'bioluma', name: 'Jeevan Prakash', emoji: '💙', category: 'Cinematic',
    primary: '#0C4A6E', primaryDark: '#082F49',
    accent: '#06B6D4', accentLight: '#22D3EE',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 5, label: 'Complete 5 tests' },
  }),
  buildTheme({
    id: 'liberty-shield', name: 'Swatantra Kavach', emoji: '🛡️', category: 'Cinematic',
    primary: '#1D3557', primaryDark: '#0D1B2A',
    accent: '#E63946', accentLight: '#FF6B6B',
    bg: '#F0F4FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'streak_days', value: 7, label: '7-day streak' },
  }),
  buildTheme({
    id: 'arcane-manor', name: 'Rahasya Mahal', emoji: '⚡', category: 'Cinematic',
    primary: '#3D1A78', primaryDark: '#1E0A40',
    accent: '#C9A84C', accentLight: '#DFC06A',
    bg: '#FFF8F0', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 10, label: 'Complete 10 tests' },
  }),
  buildTheme({
    id: 'imperial-throne', name: 'Samrat Simhasan', emoji: '👑', category: 'Indian Cinema', plan: 'ultra',
    primary: '#7B2400', primaryDark: '#4A1500',
    accent: '#D4AF37', accentLight: '#F0C84A',
    bg: '#FFF9F0', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'score_percent', value: 95, label: 'Score 95%+ in any test (Ultra)' },
  }),
  buildTheme({
    id: 'style-icon', name: 'Shaili Icon', emoji: '🕶️', category: 'Indian Cinema',
    primary: '#1A1A1A', primaryDark: '#000000',
    accent: '#C0C0C0', accentLight: '#E8E8E8',
    bg: '#F5F5F5', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'rank_top', value: 100, label: 'Reach Top 100 on any leaderboard' },
  }),
  buildTheme({
    id: 'iron-reign', name: 'Loha Rajya', emoji: '⚙️', category: 'Indian Cinema',
    primary: '#2D1B00', primaryDark: '#1A0F00',
    accent: '#B8860B', accentLight: '#DAA520',
    bg: '#FAF5E4', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 25, label: 'Complete 25 tests' },
  }),
  buildTheme({
    id: 'quantum-field', name: 'Parmanu Kshetra', emoji: '⚛️', category: 'Cinematic',
    primary: '#1C1C1C', primaryDark: '#0A0A0A',
    accent: '#FF6B00', accentLight: '#FF8C00',
    bg: '#F5F0E8', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'subject_mastery', value: 1, label: 'Master any one subject' },
  }),
  buildTheme({
    id: 'deep-orbit', name: 'Gahan Kaksha', emoji: '🌌', category: 'Cinematic', plan: 'ultra',
    primary: '#0B0C1E', primaryDark: '#050610',
    accent: '#E8C84A', accentLight: '#F5D76E',
    bg: '#F0F2FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'streak_days', value: 45, label: '45-day streak (Ultra)' },
  }),
  buildTheme({
    id: 'midnight-vigil', name: 'Nishi Jagran', emoji: '🦇', category: 'Cinematic',
    primary: '#1A1A2E', primaryDark: '#0D0D1A',
    accent: '#7B2FBE', accentLight: '#9D4EDD',
    bg: '#F0EEFF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 15, label: 'Complete 15 tests' },
  }),
  buildTheme({
    id: 'calm', name: 'Shanti Vana', emoji: '🍃', category: 'Mood',
    primary: '#2D6A4F', primaryDark: '#1B4332',
    accent: '#74C69D', accentLight: '#95D5B2',
    bg: '#F0FFF4', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'focus_minutes', value: 60, label: '60 minutes in Focus Mode' },
  }),
  buildTheme({
    id: 'energy', name: 'Tej Shakti', emoji: '⚡', category: 'Mood',
    primary: '#1E40AF', primaryDark: '#1E3A8A',
    accent: '#F97316', accentLight: '#FB923C',
    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 3, label: 'Complete 3 tests' },
  }),
  buildTheme({
    id: 'hyperfocus', name: 'Ekagrata', emoji: '🔮', category: 'Mood',
    primary: '#064E3B', primaryDark: '#022C22',
    accent: '#10B981', accentLight: '#34D399',
    bg: '#022C22', surface: '#022C22', isDark: true,
    unlock: { type: 'focus_minutes', value: 300, label: '5 hours in Focus Mode' },
  }),
  buildTheme({
    id: 'professional', name: 'Vyavsayi', emoji: '💼', category: 'Mood',
    primary: '#374151', primaryDark: '#1F2937',
    accent: '#6B7280', accentLight: '#9CA3AF',
    bg: '#F9FAFB', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'coins_earned', value: 500, label: 'Earn 500 coins' },
  }),
  buildTheme({
    id: 'nightowl', name: 'Ratri Uluka', emoji: '🦉', category: 'Nature',
    primary: '#1E1B4B', primaryDark: '#13103B',
    accent: '#A78BFA', accentLight: '#C4B5FD',
    bg: '#F5F3FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 8, label: 'Complete 8 tests' },
  }),
  buildTheme({
    id: 'forest', name: 'Vana Prastha', emoji: '🌲', category: 'Nature',
    primary: '#14532D', primaryDark: '#052E16',
    accent: '#16A34A', accentLight: '#4ADE80',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'coins_earned', value: 200, label: 'Earn 200 coins' },
  }),
  buildTheme({
    id: 'bharat', name: 'Bharat Mata', emoji: '🇮🇳', category: 'Indian',
    primary: '#FF6200', primaryDark: '#CC4E00',
    accent: '#138808', accentLight: '#22C55E',
    bg: '#FFF9F0', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 1, label: 'Complete your first test' },
  }),
  buildTheme({
    id: 'fire-roar', name: 'Agni Simha', emoji: '🔥', category: 'Indian Cinema',
    primary: '#7F1D1D', primaryDark: '#450A0A',
    accent: '#FCA5A5', accentLight: '#FECACA',
    bg: '#FFF5F5', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'rank_top', value: 10, label: 'Reach Top 10 on any leaderboard' },
  }),
  buildTheme({
    id: 'cherry', name: 'Vasant Kusuma', emoji: '🌸', category: 'Nature',
    primary: '#9D174D', primaryDark: '#831843',
    accent: '#EC4899', accentLight: '#F472B6',
    bg: '#FFF0F6', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'coins_earned', value: 100, label: 'Earn 100 coins' },
  }),
  buildTheme({
    id: 'galaxy', name: 'Akash Ganga', emoji: '🌠', category: 'Space', plan: 'ultra',
    primary: '#2E1065', primaryDark: '#1E0A4A',
    accent: '#A855F7', accentLight: '#C084FC',
    bg: '#FAF5FF', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'rank_top', value: 50, label: 'Reach Top 50 on any leaderboard (Ultra)' },
  }),
  buildTheme({
    id: 'crimson-edge', name: 'Lohit Dhara', emoji: '🗡️', category: 'Indian Cinema', plan: 'ultra',
    primary: '#0D3B2E', primaryDark: '#041F18',
    accent: '#00D9A3', accentLight: '#6EFFD9',
    bg: '#F0FFF8', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'subject_mastery', value: 5, label: 'Master any 5 subjects (Ultra)' },
  }),
  buildTheme({
    id: 'desert', name: 'Andhi Toofan', emoji: '🏜️', category: 'Nature',
    primary: '#78350F', primaryDark: '#451A03',
    accent: '#D97706', accentLight: '#F59E0B',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
    unlock: { type: 'tests_completed', value: 20, label: 'Complete 20 tests' },
  }),
  buildTheme({
    id:'thunder-strike', name:'Thunder Strike', emoji:'⚡', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#1C1C1E', primaryDark:'#000000',
    accent:'#FFE600', accentLight:'#FFF176',
    bg:'#0A0A0A', surface:'#1C1C1E', isDark:true,
    glow:'0 0 32px rgba(255,230,0,0.35)',
    unlock:{type:'tests_completed',value:5,label:'Complete 5 tests'},
  }),
  buildTheme({
    id:'lava-core', name:'Lava Core', emoji:'🔥', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#1A0A00', primaryDark:'#0D0500',
    accent:'#FF6B35', accentLight:'#FF9A6C',
    bg:'#0D0500', surface:'#1A0A00', isDark:true,
    glow:'0 0 32px rgba(255,107,53,0.4)',
    unlock:{type:'tests_completed',value:5,label:'Complete 5 tests'},
  }),
  buildTheme({
    id:'void-amethyst', name:'Void Amethyst', emoji:'💜', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#13001E', primaryDark:'#0A0010',
    accent:'#BF5FFF', accentLight:'#D48FFF',
    bg:'#0A0010', surface:'#16002A', isDark:true,
    glow:'0 0 32px rgba(191,95,255,0.4)',
    unlock:{type:'tests_completed',value:5,label:'Complete 5 tests'},
  }),
  buildTheme({
    id:'arctic-pulse', name:'Arctic Pulse', emoji:'🩵', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#001A2C', primaryDark:'#000D17',
    accent:'#00D4FF', accentLight:'#66E5FF',
    bg:'#000D17', surface:'#001A2C', isDark:true,
    glow:'0 0 32px rgba(0,212,255,0.35)',
    unlock:{type:'tests_completed',value:8,label:'Complete 8 tests'},
  }),
  buildTheme({
    id:'crimson-nova', name:'Crimson Nova', emoji:'🔴', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#1A0000', primaryDark:'#0D0000',
    accent:'#FF2D55', accentLight:'#FF6B80',
    bg:'#0D0000', surface:'#1A0000', isDark:true,
    glow:'0 0 32px rgba(255,45,85,0.4)',
    unlock:{type:'tests_completed',value:8,label:'Complete 8 tests'},
  }),
  buildTheme({
    id:'matrix-rain', name:'Matrix Rain', emoji:'🟢', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#001200', primaryDark:'#000800',
    accent:'#00FF41', accentLight:'#69FF9A',
    bg:'#000800', surface:'#001200', isDark:true,
    glow:'0 0 32px rgba(0,255,65,0.35)',
    unlock:{type:'streak_days',value:7,label:'7-day streak'},
  }),
  buildTheme({
    id:'copper-circuit', name:'Copper Circuit', emoji:'🟠', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#1A0E00', primaryDark:'#0D0700',
    accent:'#CD7F32', accentLight:'#E8A84C',
    bg:'#0D0700', surface:'#1A1000', isDark:true,
    glow:'0 0 28px rgba(205,127,50,0.35)',
    unlock:{type:'streak_days',value:7,label:'7-day streak'},
  }),
  buildTheme({
    id:'nebula-drift', name:'Nebula Drift', emoji:'🌌', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#0D0A1A', primaryDark:'#060410',
    accent:'#FF79C6', accentLight:'#FFB3E0',
    bg:'#060410', surface:'#0D0A1A', isDark:true,
    glow:'0 0 36px rgba(255,121,198,0.35)',
    unlock:{type:'coins_earned',value:500,label:'Earn 500 coins'},
  }),
  buildTheme({
    id:'carbon-elite', name:'Carbon Elite', emoji:'🤍', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#1C1C1C', primaryDark:'#0A0A0A',
    accent:'#F5F5F7', accentLight:'#FFFFFF',
    bg:'#0A0A0A', surface:'#1C1C1C', isDark:true,
    glow:'0 0 24px rgba(255,255,255,0.15)',
    unlock:{type:'coins_earned',value:500,label:'Earn 500 coins'},
  }),
  buildTheme({
    id:'gold-vault', name:'Gold Vault', emoji:'💛', category:'Dark Power',
    tier:'unlocked', plan:'pro',
    primary:'#0F1A2E', primaryDark:'#060D1A',
    accent:'#FFD700', accentLight:'#FFE44D',
    bg:'#060D1A', surface:'#0F1A2E', isDark:true,
    glow:'0 0 36px rgba(255,215,0,0.4)',
    unlock:{type:'coins_earned',value:1000,label:'Earn 1000 coins'},
  }),
  buildTheme({
    id:'sakura-morning', name:'Sakura Morning', emoji:'🌸', category:'Light Premium',
    tier:'unlocked', plan:'pro',
    primary:'#A0445A', primaryDark:'#7A2E42',
    accent:'#E8627A', accentLight:'#F4A0B0',
    bg:'#FFF5F7', surface:'#FFFFFF', isDark:false,
    unlock:{type:'tests_completed',value:3,label:'Complete 3 tests'},
  }),
  buildTheme({
    id:'bamboo-zen', name:'Bamboo Zen', emoji:'🍃', category:'Light Premium',
    tier:'unlocked', plan:'pro',
    primary:'#2D5016', primaryDark:'#1A3009',
    accent:'#4CAF50', accentLight:'#81C784',
    bg:'#F1F8E9', surface:'#FFFFFF', isDark:false,
    unlock:{type:'tests_completed',value:3,label:'Complete 3 tests'},
  }),
  buildTheme({
    id:'cloud-nine', name:'Cloud Nine', emoji:'☁️', category:'Light Premium',
    tier:'unlocked', plan:'pro',
    primary:'#1565C0', primaryDark:'#0D47A1',
    accent:'#42A5F5', accentLight:'#90CAF9',
    bg:'#E3F2FD', surface:'#FFFFFF', isDark:false,
    unlock:{type:'streak_days',value:3,label:'3-day streak'},
  }),
  buildTheme({
    id:'arctic-white', name:'Arctic White', emoji:'🧊', category:'Light Premium',
    tier:'unlocked', plan:'pro',
    primary:'#37474F', primaryDark:'#263238',
    accent:'#00BCD4', accentLight:'#80DEEA',
    bg:'#ECEFF1', surface:'#FFFFFF', isDark:false,
    unlock:{type:'streak_days',value:3,label:'3-day streak'},
  }),
  buildTheme({
    id:'lagoon', name:'Lagoon', emoji:'🌊', category:'Light Premium',
    tier:'unlocked', plan:'pro',
    primary:'#00695C', primaryDark:'#004D40',
    accent:'#00BFA5', accentLight:'#64FFDA',
    bg:'#E0F2F1', surface:'#FFFFFF', isDark:false,
    unlock:{type:'coins_earned',value:200,label:'Earn 200 coins'},
  }),
  buildTheme({
    id:'golden-hour', name:'Golden Hour', emoji:'🌅', category:'Light Premium',
    tier:'unlocked', plan:'pro',
    primary:'#E65100', primaryDark:'#BF360C',
    accent:'#FF8F00', accentLight:'#FFB300',
    bg:'#FFF8E1', surface:'#FFFFFF', isDark:false,
    unlock:{type:'coins_earned',value:200,label:'Earn 200 coins'},
  }),
  buildTheme({
    id:'alpine', name:'Alpine', emoji:'🏔️', category:'Light Premium',
    tier:'unlocked', plan:'pro',
    primary:'#455A64', primaryDark:'#37474F',
    accent:'#78909C', accentLight:'#B0BEC5',
    bg:'#FAFAFA', surface:'#FFFFFF', isDark:false,
    unlock:{type:'tests_completed',value:10,label:'Complete 10 tests'},
  }),
  buildTheme({
    id:'jade-ivory', name:'Jade Ivory', emoji:'🎋', category:'Light Premium',
    tier:'unlocked', plan:'pro',
    primary:'#1B5E20', primaryDark:'#0A3D12',
    accent:'#2E7D32', accentLight:'#66BB6A',
    bg:'#F9FBE7', surface:'#FFFFFF', isDark:false,
    unlock:{type:'tests_completed',value:10,label:'Complete 10 tests'},
  }),
  buildTheme({
    id:'hibiscus', name:'Hibiscus', emoji:'🌺', category:'Light Premium',
    tier:'unlocked', plan:'pro',
    primary:'#880E4F', primaryDark:'#560027',
    accent:'#E91E63', accentLight:'#F48FB1',
    bg:'#FCE4EC', surface:'#FFFFFF', isDark:false,
    unlock:{type:'coins_earned',value:300,label:'Earn 300 coins'},
  }),
  buildTheme({
    id:'saffron-glow', name:'Saffron Glow', emoji:'🟡', category:'Indian Pride',
    tier:'unlocked', plan:'pro',
    primary:'#E65100', primaryDark:'#BF360C',
    accent:'#FF6F00', accentLight:'#FFA000',
    bg:'#FFF9C4', surface:'#FFFFFF', isDark:false,
    unlock:{type:'coins_earned',value:300,label:'Earn 300 coins'},
  }),
  buildTheme({
    id:'volcanic-ash', name:'Volcanic Ash', emoji:'🌋', category:'Cinematic Dark',
    tier:'unlocked', plan:'ultra',
    primary:'#212121', primaryDark:'#0D0D0D',
    accent:'#FF5722', accentLight:'#FF8A65',
    bg:'#0D0D0D', surface:'#1A1A1A', isDark:true,
    glow:'0 0 28px rgba(255,87,34,0.35)',
    unlock:{type:'tests_completed',value:20,label:'Complete 20 tests'},
  }),
  buildTheme({
    id:'scorpion-amber', name:'Scorpion Amber', emoji:'🦂', category:'Cinematic Dark',
    tier:'unlocked', plan:'ultra',
    primary:'#1A1200', primaryDark:'#0A0800',
    accent:'#FFC107', accentLight:'#FFD54F',
    bg:'#0A0800', surface:'#1A1200', isDark:true,
    glow:'0 0 30px rgba(255,193,7,0.35)',
    unlock:{type:'tests_completed',value:20,label:'Complete 20 tests'},
  }),
  buildTheme({
    id:'dragon-fire', name:'Dragon Fire', emoji:'🐉', category:'Cinematic Dark',
    tier:'unlocked', plan:'ultra',
    primary:'#1A0500', primaryDark:'#0D0200',
    accent:'#FF3D00', accentLight:'#FF6E40',
    bg:'#0D0200', surface:'#1A0500', isDark:true,
    glow:'0 0 36px rgba(255,61,0,0.45)',
    unlock:{type:'streak_days',value:30,label:'30-day streak'},
  }),
  buildTheme({
    id:'lunar-eclipse', name:'Lunar Eclipse', emoji:'🌙', category:'Cinematic Dark',
    tier:'unlocked', plan:'ultra',
    primary:'#1A1A2E', primaryDark:'#0D0D1A',
    accent:'#E0E0E0', accentLight:'#F5F5F5',
    bg:'#0D0D1A', surface:'#1A1A2E', isDark:true,
    glow:'0 0 24px rgba(224,224,224,0.2)',
    unlock:{type:'streak_days',value:30,label:'30-day streak'},
  }),
  buildTheme({
    id:'iron-warrior', name:'Iron Warrior', emoji:'⚔️', category:'Cinematic Dark',
    tier:'unlocked', plan:'ultra',
    primary:'#1C1C1C', primaryDark:'#0A0A0A',
    accent:'#B71C1C', accentLight:'#E53935',
    bg:'#0A0A0A', surface:'#1C1C1C', isDark:true,
    glow:'0 0 28px rgba(183,28,28,0.4)',
    unlock:{type:'coins_earned',value:2000,label:'Earn 2000 coins'},
  }),
  buildTheme({
    id:'phantom', name:'Phantom', emoji:'🎭', category:'Cinematic Dark',
    tier:'unlocked', plan:'ultra',
    primary:'#12001E', primaryDark:'#08000F',
    accent:'#AA00FF', accentLight:'#CE93D8',
    bg:'#08000F', surface:'#12001E', isDark:true,
    glow:'0 0 36px rgba(170,0,255,0.45)',
    unlock:{type:'coins_earned',value:2000,label:'Earn 2000 coins'},
  }),
  buildTheme({
    id:'storm-eagle', name:'Storm Eagle', emoji:'🦅', category:'Cinematic Dark',
    tier:'unlocked', plan:'ultra',
    primary:'#0A1628', primaryDark:'#050D18',
    accent:'#90CAF9', accentLight:'#BBDEFB',
    bg:'#050D18', surface:'#0A1628', isDark:true,
    glow:'0 0 28px rgba(144,202,249,0.25)',
    unlock:{type:'tests_completed',value:50,label:'Complete 50 tests'},
  }),
  buildTheme({
    id:'arrow-precision', name:'Arrow Precision', emoji:'🏹', category:'Cinematic Dark',
    tier:'unlocked', plan:'ultra',
    primary:'#0A1A0A', primaryDark:'#050D05',
    accent:'#FFD700', accentLight:'#FFE57F',
    bg:'#050D05', surface:'#0A1A0A', isDark:true,
    glow:'0 0 30px rgba(255,215,0,0.35)',
    unlock:{type:'tests_completed',value:50,label:'Complete 50 tests'},
  }),
  buildTheme({
    id:'tiranga', name:'Tiranga', emoji:'🇮🇳', category:'Indian Pride',
    tier:'unlocked', plan:'pro',
    primary:'#FF9933', primaryDark:'#E07000',
    accent:'#138808', accentLight:'#4CAF50',
    bg:'#FFFFFF', surface:'#FFF9F0', isDark:false,
    unlock:{type:'tests_completed',value:1,label:'Complete 1 test'},
  }),
  buildTheme({
    id:'diwali-night', name:'Diwali Night', emoji:'🪔', category:'Indian Pride',
    tier:'unlocked', plan:'pro',
    primary:'#1A0A00', primaryDark:'#0D0500',
    accent:'#FFD700', accentLight:'#FFF176',
    bg:'#0D0500', surface:'#1A0A00', isDark:true,
    glow:'0 0 40px rgba(255,215,0,0.5)',
    unlock:{type:'streak_days',value:14,label:'14-day streak'},
  }),
]

// ─────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────


// ── MENTOR PROFESSIONAL THEMES ─────────────────────────────
const MENTOR_THEMES = [
  buildTheme({ id:'mentor-kashi-dawn',   name:'Kashi Dawn',      emoji:'🏛️',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#92400E', primaryDark:'#78350F', accent:'#D97706', accentLight:'#FCD34D',
    bg:'#FFFBEB', surface:'#FFFFFF', isDark:false }),
  buildTheme({ id:'mentor-nilgiri-mist', name:'Nilgiri Mist',    emoji:'🌿',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#065F46', primaryDark:'#064E3B', accent:'#059669', accentLight:'#6EE7B7',
    bg:'#F0FDF4', surface:'#FFFFFF', isDark:false }),
  buildTheme({ id:'mentor-himalayan',    name:'Himalayan Snow',  emoji:'🏔️',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#1E40AF', primaryDark:'#1E3A8A', accent:'#3B82F6', accentLight:'#BFDBFE',
    bg:'#EFF6FF', surface:'#FFFFFF', isDark:false }),
  buildTheme({ id:'mentor-pearl',        name:'Pearl Classic',   emoji:'🎓',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#1E3A5F', primaryDark:'#0F2140', accent:'#C9A84C', accentLight:'#E8C44A',
    bg:'#F8FAFC', surface:'#FFFFFF', isDark:false }),
  buildTheme({ id:'mentor-vedic',        name:'Vedic Scroll',    emoji:'📜',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#3B1F08', primaryDark:'#2D1606', accent:'#B45309', accentLight:'#FDE68A',
    bg:'#FFFBF0', surface:'#FEF9EE', isDark:false }),
  buildTheme({ id:'mentor-midnight',     name:'Midnight Indigo', emoji:'🌌',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#4338CA', primaryDark:'#3730A3', accent:'#818CF8', accentLight:'#A5B4FC',
    bg:'#0F0F1A', surface:'#1A1A2E', isDark:true }),
  buildTheme({ id:'mentor-graphite',     name:'Graphite Pro',    emoji:'⚙️',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#4B5563', primaryDark:'#374151', accent:'#60A5FA', accentLight:'#93C5FD',
    bg:'#111827', surface:'#1F2937', isDark:true }),
  buildTheme({ id:'mentor-teak',         name:'Teak Forest',     emoji:'🌳',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#065F46', primaryDark:'#064E3B', accent:'#34D399', accentLight:'#6EE7B7',
    bg:'#0A1A14', surface:'#132218', isDark:true }),
  buildTheme({ id:'mentor-navy-command', name:'Navy Command',    emoji:'⚓',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#1E3A5F', primaryDark:'#0F2140', accent:'#C9A84C', accentLight:'#E8C44A',
    bg:'#0A1628', surface:'#0F2140', isDark:true }),
  buildTheme({ id:'mentor-obsidian',     name:'Obsidian Gold',   emoji:'✨',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#1C1917', primaryDark:'#0C0A09', accent:'#D97706', accentLight:'#FCD34D',
    bg:'#0C0A09', surface:'#1C1917', isDark:true }),
]

export const THEME_LIST = [...BASE_THEMES, ...UNLOCK_THEMES, ...MENTOR_THEMES]

export const THEMES = THEME_LIST.reduce((acc, t) => {
  acc[t.id] = t
  return acc
}, {})

export const THEME_CATEGORIES = [
  'Base', 'Accessibility', 'Dark Power', 'Light Premium', 'Indian Pride', 'Cinematic Dark', 'Cinematic', 'Indian Cinema', 'Indian', 'Mood', 'Nature', 'Space',
]

export function getTheme(id) {
  return THEMES[id] || THEMES.default
}

export const BASE_THEME_IDS = BASE_THEMES.map(t => t.id)
