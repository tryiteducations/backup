// src/lib/themes.js
// TryIT Educations — 29-theme system (25 original + 4 new)
// DEFAULT: cosmic-default (theme index 0, id 'cosmic-default')
// TIER SYSTEM: 'core' = always unlocked (5 themes), 'legendary' = level-gated (24 themes)
// UNLOCK: legendary themes spread across levels 2–10 (≈2–3 per level)

export const THEMES = {
  // ─────────────────────────────────────────────────────────
  // CORE THEMES (always unlocked)
  // ─────────────────────────────────────────────────────────
  'cosmic-default': {
    id: 'cosmic-default',
    name: 'Cosmic Default',
    emoji: '🌌',
    tier: 'core',
    navy: '#1E3A5F',
    navyDark: '#0F2140',
    gold: '#D4AF37',
    goldLight: '#E8C84A',
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F2140',
    muted: '#64748B',
  },
  'focus-minimal': {
    id: 'focus-minimal',
    name: 'Focus Minimal',
    emoji: '🔲',
    tier: 'core',
    navy: '#1E293B',
    navyDark: '#0F172A',
    gold: '#2563EB',
    goldLight: '#60A5FA',
    bg: '#FFFFFF',
    surface: '#F4F6F9',
    text: '#0F172A',
    muted: '#64748B',
  },
  'midnight-cinematic': {
    id: 'midnight-cinematic',
    name: 'Midnight Cinematic',
    emoji: '🎬',
    tier: 'core',
    navy: '#18181B',
    navyDark: '#000000',
    gold: '#A855F7',
    goldLight: '#C084FC',
    bg: '#000000',
    surface: '#0A0A0F',
    text: '#F4F4F5',
    muted: '#71717A',
    accent2: '#22D3EE',
  },
  'forest-calm': {
    id: 'forest-calm',
    name: 'Forest Calm',
    emoji: '🌿',
    tier: 'core',
    navy: '#3D4F3D',
    navyDark: '#2C3A2C',
    gold: '#8FA888',
    goldLight: '#B5C9AE',
    bg: '#F5F1E8',
    surface: '#FFFFFF',
    text: '#2C3A2C',
    muted: '#8A8A78',
  },
  'cyber-edtech': {
    id: 'cyber-edtech',
    name: 'Cyber Ed-Tech',
    emoji: '⚡',
    tier: 'core',
    navy: '#3F3F46',
    navyDark: '#18181B',
    gold: '#FACC15',
    goldLight: '#FDE047',
    bg: '#18181B',
    surface: '#27272A',
    text: '#FAFAFA',
    muted: '#A1A1AA',
    accent2: '#8B5CF6',
  },

  // ─────────────────────────────────────────────────────────
  // LEGENDARY THEMES — Level 2 (unlock 3)
  // ─────────────────────────────────────────────────────────
  'royal-emerald': {
    id: 'royal-emerald',
    name: 'Royal Emerald',
    emoji: '💎',
    tier: 'legendary',
    unlockLevel: 2,
    navy: '#064E3B',
    navyDark: '#022C22',
    gold: '#D4AF37',
    goldLight: '#E8C84A',
    bg: '#F0FDF4',
    surface: '#FFFFFF',
    text: '#022C22',
    muted: '#6B7280',
  },
  'burgundy-royale': {
    id: 'burgundy-royale',
    name: 'Burgundy Royale',
    emoji: '🍷',
    tier: 'legendary',
    unlockLevel: 2,
    navy: '#7C2D12',
    navyDark: '#4A1800',
    gold: '#D4AF37',
    goldLight: '#E8C84A',
    bg: '#FFF7F5',
    surface: '#FFFFFF',
    text: '#4A1800',
    muted: '#9CA3AF',
  },
  'amethyst-dream': {
    id: 'amethyst-dream',
    name: 'Amethyst Dream',
    emoji: '💜',
    tier: 'legendary',
    unlockLevel: 2,
    navy: '#4C1D95',
    navyDark: '#3B2A6B',
    gold: '#D4AF37',
    goldLight: '#E8C84A',
    bg: '#FAF5FF',
    surface: '#FFFFFF',
    text: '#3B2A6B',
    muted: '#8B8BA7',
  },

  // ─────────────────────────────────────────────────────────
  // LEGENDARY — Level 3 (unlock 3)
  // ─────────────────────────────────────────────────────────
  'champagne-glow': {
    id: 'champagne-glow',
    name: 'Champagne Glow',
    emoji: '🥂',
    tier: 'legendary',
    unlockLevel: 3,
    navy: '#1E3A5F',
    navyDark: '#0F2140',
    gold: '#D4AF37',
    goldLight: '#E8C84A',
    bg: '#FDF6E3',
    surface: '#FFF3D6',
    text: '#1E3A5F',
    muted: '#9B8A6A',
  },
  'sapphire-night': {
    id: 'sapphire-night',
    name: 'Sapphire Night',
    emoji: '🌃',
    tier: 'legendary',
    unlockLevel: 3,
    navy: '#1E3A5F',
    navyDark: '#0C1F3A',
    gold: '#60A5FA',
    goldLight: '#93C5FD',
    bg: '#0F1C2E',
    surface: '#1A2942',
    text: '#E2E8F0',
    muted: '#64748B',
  },
  'rose-gold': {
    id: 'rose-gold',
    name: 'Rose Gold',
    emoji: '🌸',
    tier: 'legendary',
    unlockLevel: 3,
    navy: '#881337',
    navyDark: '#4C0519',
    gold: '#F59E0B',
    goldLight: '#FCD34D',
    bg: '#FFF1F2',
    surface: '#FFFFFF',
    text: '#4C0519',
    muted: '#9F8080',
  },

  // ─────────────────────────────────────────────────────────
  // LEGENDARY — Level 4 (unlock 3)
  // ─────────────────────────────────────────────────────────
  'solar-flare': {
    id: 'solar-flare',
    name: 'Solar Flare',
    emoji: '☀️',
    tier: 'legendary',
    unlockLevel: 4,
    navy: '#92400E',
    navyDark: '#78350F',
    gold: '#F59E0B',
    goldLight: '#FCD34D',
    bg: '#FFFBEB',
    surface: '#FFFFFF',
    text: '#78350F',
    muted: '#B45309',
  },
  'arctic-frost': {
    id: 'arctic-frost',
    name: 'Arctic Frost',
    emoji: '❄️',
    tier: 'legendary',
    unlockLevel: 4,
    navy: '#1E3A5F',
    navyDark: '#0F2140',
    gold: '#38BDF8',
    goldLight: '#7DD3FC',
    bg: '#F0F9FF',
    surface: '#FFFFFF',
    text: '#0C4A6E',
    muted: '#6B8CAE',
  },
  'obsidian-fire': {
    id: 'obsidian-fire',
    name: 'Obsidian Fire',
    emoji: '🔥',
    tier: 'legendary',
    unlockLevel: 4,
    navy: '#1C1917',
    navyDark: '#0C0A09',
    gold: '#F97316',
    goldLight: '#FB923C',
    bg: '#0C0A09',
    surface: '#1C1917',
    text: '#FAFAF9',
    muted: '#78716C',
  },

  // ─────────────────────────────────────────────────────────
  // LEGENDARY — Level 5 (unlock 3)
  // ─────────────────────────────────────────────────────────
  'teal-academia': {
    id: 'teal-academia',
    name: 'Teal Academia',
    emoji: '📚',
    tier: 'legendary',
    unlockLevel: 5,
    navy: '#134E4A',
    navyDark: '#0D3330',
    gold: '#14B8A6',
    goldLight: '#5EEAD4',
    bg: '#F0FDFA',
    surface: '#FFFFFF',
    text: '#0D3330',
    muted: '#64748B',
  },
  'desert-sand': {
    id: 'desert-sand',
    name: 'Desert Sand',
    emoji: '🏜️',
    tier: 'legendary',
    unlockLevel: 5,
    navy: '#78350F',
    navyDark: '#451A03',
    gold: '#D97706',
    goldLight: '#F59E0B',
    bg: '#FEFCE8',
    surface: '#FFFDE7',
    text: '#451A03',
    muted: '#92400E',
  },
  'neon-tokyo': {
    id: 'neon-tokyo',
    name: 'Neon Tokyo',
    emoji: '🗼',
    tier: 'legendary',
    unlockLevel: 5,
    navy: '#1A0533',
    navyDark: '#0D0019',
    gold: '#F0ABFC',
    goldLight: '#E879F9',
    bg: '#0D0019',
    surface: '#1A0533',
    text: '#FAE8FF',
    muted: '#A855F7',
    accent2: '#22D3EE',
  },

  // ─────────────────────────────────────────────────────────
  // LEGENDARY — Level 6 (unlock 2)
  // ─────────────────────────────────────────────────────────
  'slate-professional': {
    id: 'slate-professional',
    name: 'Slate Professional',
    emoji: '💼',
    tier: 'legendary',
    unlockLevel: 6,
    navy: '#334155',
    navyDark: '#1E293B',
    gold: '#0EA5E9',
    goldLight: '#38BDF8',
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
  },
  'carbon-steel': {
    id: 'carbon-steel',
    name: 'Carbon Steel',
    emoji: '⚙️',
    tier: 'legendary',
    unlockLevel: 6,
    navy: '#27272A',
    navyDark: '#18181B',
    gold: '#D4AF37',
    goldLight: '#E8C84A',
    bg: '#18181B',
    surface: '#27272A',
    text: '#FAFAFA',
    muted: '#71717A',
  },

  // ─────────────────────────────────────────────────────────
  // LEGENDARY — Level 7 (unlock 3)
  // ─────────────────────────────────────────────────────────
  'jade-temple': {
    id: 'jade-temple',
    name: 'Jade Temple',
    emoji: '🏯',
    tier: 'legendary',
    unlockLevel: 7,
    navy: '#14532D',
    navyDark: '#052E16',
    gold: '#86EFAC',
    goldLight: '#BBF7D0',
    bg: '#052E16',
    surface: '#14532D',
    text: '#DCFCE7',
    muted: '#4ADE80',
  },
  'lotus-pink': {
    id: 'lotus-pink',
    name: 'Lotus Pink',
    emoji: '🪷',
    tier: 'legendary',
    unlockLevel: 7,
    navy: '#831843',
    navyDark: '#500724',
    gold: '#F472B6',
    goldLight: '#FBCFE8',
    bg: '#FFF0F6',
    surface: '#FFFFFF',
    text: '#500724',
    muted: '#9D4E72',
  },
  'ink-parchment': {
    id: 'ink-parchment',
    name: 'Ink & Parchment',
    emoji: '📜',
    tier: 'legendary',
    unlockLevel: 7,
    navy: '#292524',
    navyDark: '#1C1917',
    gold: '#A16207',
    goldLight: '#CA8A04',
    bg: '#FDF8F0',
    surface: '#FAF3E5',
    text: '#1C1917',
    muted: '#78716C',
  },

  // ─────────────────────────────────────────────────────────
  // LEGENDARY — Level 8 (unlock 3)
  // ─────────────────────────────────────────────────────────
  'galaxy-storm': {
    id: 'galaxy-storm',
    name: 'Galaxy Storm',
    emoji: '🌌',
    tier: 'legendary',
    unlockLevel: 8,
    navy: '#1E1B4B',
    navyDark: '#0F0D2E',
    gold: '#818CF8',
    goldLight: '#A5B4FC',
    bg: '#0F0D2E',
    surface: '#1E1B4B',
    text: '#E0E7FF',
    muted: '#6366F1',
    accent2: '#F472B6',
  },
  'crimson-dawn': {
    id: 'crimson-dawn',
    name: 'Crimson Dawn',
    emoji: '🌅',
    tier: 'legendary',
    unlockLevel: 8,
    navy: '#7F1D1D',
    navyDark: '#450A0A',
    gold: '#FCA5A5',
    goldLight: '#FEE2E2',
    bg: '#450A0A',
    surface: '#7F1D1D',
    text: '#FEF2F2',
    muted: '#F87171',
  },
  'olive-grove': {
    id: 'olive-grove',
    name: 'Olive Grove',
    emoji: '🫒',
    tier: 'legendary',
    unlockLevel: 8,
    navy: '#365314',
    navyDark: '#1A2E06',
    gold: '#84CC16',
    goldLight: '#BEF264',
    bg: '#F7FEE7',
    surface: '#FFFFFF',
    text: '#1A2E06',
    muted: '#4D7C0F',
  },

  // ─────────────────────────────────────────────────────────
  // LEGENDARY — Level 9 (unlock 3)
  // ─────────────────────────────────────────────────────────
  'titanium-white': {
    id: 'titanium-white',
    name: 'Titanium White',
    emoji: '🤍',
    tier: 'legendary',
    unlockLevel: 9,
    navy: '#374151',
    navyDark: '#111827',
    gold: '#111827',
    goldLight: '#374151',
    bg: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    muted: '#9CA3AF',
  },
  'aurora-borealis': {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    emoji: '🌠',
    tier: 'legendary',
    unlockLevel: 9,
    navy: '#0A1628',
    navyDark: '#050D1A',
    gold: '#34D399',
    goldLight: '#6EE7B7',
    bg: '#050D1A',
    surface: '#0A1628',
    text: '#ECFDF5',
    muted: '#10B981',
    accent2: '#818CF8',
  },
  'monsoon-clay': {
    id: 'monsoon-clay',
    name: 'Monsoon Clay',
    emoji: '🌧️',
    tier: 'legendary',
    unlockLevel: 9,
    navy: '#44403C',
    navyDark: '#292524',
    gold: '#D97706',
    goldLight: '#F59E0B',
    bg: '#FAF9F7',
    surface: '#F5F3EF',
    text: '#292524',
    muted: '#78716C',
  },

  // ─────────────────────────────────────────────────────────
  // LEGENDARY — Level 10 (unlock 3 — the rarest)
  // ─────────────────────────────────────────────────────────
  'pure-gold': {
    id: 'pure-gold',
    name: 'Pure Gold',
    emoji: '🥇',
    tier: 'legendary',
    unlockLevel: 10,
    navy: '#92400E',
    navyDark: '#78350F',
    gold: '#D4AF37',
    goldLight: '#E8C84A',
    bg: '#FEF9E7',
    surface: '#FDF3C0',
    text: '#78350F',
    muted: '#B45309',
  },
  'legend-black': {
    id: 'legend-black',
    name: 'Legend Black',
    emoji: '🖤',
    tier: 'legendary',
    unlockLevel: 10,
    navy: '#000000',
    navyDark: '#000000',
    gold: '#D4AF37',
    goldLight: '#E8C84A',
    bg: '#000000',
    surface: '#111111',
    text: '#FFFFFF',
    muted: '#555555',
  },
  'the-absolute': {
    id: 'the-absolute',
    name: 'The Absolute',
    emoji: '✨',
    tier: 'legendary',
    unlockLevel: 10,
    navy: '#1E3A5F',
    navyDark: '#0F2140',
    gold: '#D4AF37',
    goldLight: '#E8C84A',
    bg: 'linear-gradient(135deg, #0F2140 0%, #1E3A5F 50%, #4C1D95 100%)',
    surface: '#0F2140',
    text: '#F8FAFC',
    muted: '#A0AEC0',
    accent2: '#E8C84A',
  },
};

// Ordered list for display (core first, then legendary by unlock level)
export const THEME_LIST = [
  // Core (always visible)
  THEMES['cosmic-default'],
  THEMES['focus-minimal'],
  THEMES['midnight-cinematic'],
  THEMES['forest-calm'],
  THEMES['cyber-edtech'],
  // Legendary — sorted by unlockLevel
  ...Object.values(THEMES)
    .filter((t) => t.tier === 'legendary')
    .sort((a, b) => a.unlockLevel - b.unlockLevel),
];

// ─────────────────────────────────────────────────────────
// UNLOCK HELPERS
// ─────────────────────────────────────────────────────────

/**
 * Returns the minimum user level required to unlock a theme.
 * Core themes return 1 (always unlocked).
 */
export function getUnlockLevel(themeId) {
  const theme = THEMES[themeId];
  if (!theme) return 99;
  if (theme.tier === 'core') return 1;
  return theme.unlockLevel ?? 99;
}

/**
 * Returns true if the theme is accessible at the given user level.
 * @param {string} themeId
 * @param {number} userLevel — user.level from AuthContext (1–10)
 */
export function isThemeUnlocked(themeId, userLevel) {
  return (userLevel ?? 1) >= getUnlockLevel(themeId);
}

// ─────────────────────────────────────────────────────────
// CSS VARIABLE APPLICATION
// Writes theme tokens to document.documentElement so any
// component using var(--color-*) picks up the active theme.
// ─────────────────────────────────────────────────────────

/**
 * Applies a theme by writing CSS custom properties to :root.
 * Safe to call on the server (guards with typeof document check).
 * @param {string} themeId
 */
export function applyTheme(themeId) {
  if (typeof document === 'undefined') return;
  const theme = THEMES[themeId] ?? THEMES['cosmic-default'];

  const root = document.documentElement;
  root.style.setProperty('--color-navy', theme.navy);
  root.style.setProperty('--color-navy-dark', theme.navyDark);
  root.style.setProperty('--color-gold', theme.gold);
  root.style.setProperty('--color-gold-light', theme.goldLight);
  root.style.setProperty('--color-bg', theme.bg);
  root.style.setProperty('--color-surface', theme.surface);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-muted', theme.muted);
  root.style.setProperty('--color-accent2', theme.accent2 ?? 'transparent');

  // Convenience alias tokens
  root.style.setProperty('--color-primary', theme.navy);
  root.style.setProperty('--color-accent', theme.gold);
}
