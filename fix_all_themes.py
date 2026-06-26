src = open("src/lib/themes.js", encoding="utf-8").read()

# ── FIX 1: sky-fresh — wrong primary on light bg ──
src = src.replace(
    """  buildTheme({
    id: 'sky-fresh', name: 'Sky Fresh', emoji: '☁️', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#0EA5E9', primaryDark: '#0284C7',
    accent: '#0EA5E9', accentLight: '#7DD3FC',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
  }),""",
    """  buildTheme({
    id: 'sky-fresh', name: 'Sky Fresh', emoji: '☁️', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#0369A1', primaryDark: '#0284C7',
    accent: '#0EA5E9', accentLight: '#BAE6FD',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
  }),"""
)

# ── FIX 2: blue-white — ensure readable ──
src = src.replace(
    """  buildTheme({
    id: 'blue-white', name: 'Blue & White', emoji: '💙', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#2563EB', primaryDark: '#1D4ED8',
    accent: '#2563EB', accentLight: '#60A5FA',
    bg: '#F8FAFF', surface: '#FFFFFF', isDark: false,
  }),""",
    """  buildTheme({
    id: 'blue-white', name: 'Blue & White', emoji: '💙', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#1E40AF', primaryDark: '#1D4ED8',
    accent: '#2563EB', accentLight: '#93C5FD',
    bg: '#F8FAFF', surface: '#FFFFFF', isDark: false,
  }),"""
)

# ── FIX 3: rose-white ──
src = src.replace(
    """  buildTheme({
    id: 'rose-white', name: 'Rose & White', emoji: '🌸', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#EC4899', primaryDark: '#DB2777',
    accent: '#EC4899', accentLight: '#F9A8D4',
    bg: '#FFF8FA', surface: '#FFFFFF', isDark: false,
  }),""",
    """  buildTheme({
    id: 'rose-white', name: 'Rose & White', emoji: '🌸', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#BE185D', primaryDark: '#9D174D',
    accent: '#EC4899', accentLight: '#FBCFE8',
    bg: '#FFF0F6', surface: '#FFFFFF', isDark: false,
  }),"""
)

# ── FIX 4: emerald-clean ──
src = src.replace(
    """  buildTheme({
    id: 'emerald-clean', name: 'Emerald Clean', emoji: '💚', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#10B981', primaryDark: '#059669',
    accent: '#10B981', accentLight: '#6EE7B7',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
  }),""",
    """  buildTheme({
    id: 'emerald-clean', name: 'Emerald Clean', emoji: '💚', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#065F46', primaryDark: '#064E3B',
    accent: '#10B981', accentLight: '#A7F3D0',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
  }),"""
)

# ── FIX 5: violet-soft ──
src = src.replace(
    """  buildTheme({
    id: 'violet-soft', name: 'Violet Soft', emoji: '💜', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#7C3AED', primaryDark: '#6D28D9',
    accent: '#7C3AED', accentLight: '#C4B5FD',
    bg: '#FAF5FF', surface: '#FFFFFF', isDark: false,
  }),""",
    """  buildTheme({
    id: 'violet-soft', name: 'Violet Soft', emoji: '💜', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#5B21B6', primaryDark: '#4C1D95',
    accent: '#7C3AED', accentLight: '#DDD6FE',
    bg: '#FAF5FF', surface: '#FFFFFF', isDark: false,
  }),"""
)

# ── FIX 6: coral-bright ──
src = src.replace(
    """  buildTheme({
    id: 'coral-bright', name: 'Coral Bright', emoji: '🪸', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#F97316', primaryDark: '#EA580C',
    accent: '#F97316', accentLight: '#FDBA74',
    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,
  }),""",
    """  buildTheme({
    id: 'coral-bright', name: 'Coral Bright', emoji: '🪸', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#9A3412', primaryDark: '#7C2D12',
    accent: '#F97316', accentLight: '#FED7AA',
    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,
  }),"""
)

# ── FIX 7: pink-dark ──
src = src.replace(
    """  buildTheme({
    id: 'pink-dark', name: 'Pink Night', emoji: '🌃', category: 'Base', tier: 'base', plan: 'free',
    primary: '#831843', primaryDark: '#500724',
    accent: '#F472B6', accentLight: '#FBCFE8',
    bg: '#1A0010', surface: '#2D0020', isDark: true,
  }),""",
    """  buildTheme({
    id: 'pink-dark', name: 'Pink Night', emoji: '🌃', category: 'Base', tier: 'base', plan: 'free',
    primary: '#DB2777', primaryDark: '#BE185D',
    accent: '#F472B6', accentLight: '#FBCFE8',
    bg: '#1A000E', surface: '#2A0018', isDark: true,
  }),"""
)

# ── FIX 8: midnight — change to blue accent for visibility ──
src = src.replace(
    """  buildTheme({
    id: 'midnight', name: 'Midnight Blue', emoji: '🌙', category: 'Base', tier: 'base', plan: 'free',
    primary: '#1E293B', primaryDark: '#0F172A',
    accent: '#60A5FA', accentLight: '#93C5FD',
    bg: '#0F172A', surface: '#1E293B', isDark: true,
  }),""",
    """  buildTheme({
    id: 'midnight', name: 'Midnight Blue', emoji: '🌙', category: 'Base', tier: 'base', plan: 'free',
    primary: '#3B82F6', primaryDark: '#2563EB',
    accent: '#60A5FA', accentLight: '#BFDBFE',
    bg: '#0F172A', surface: '#1E293B', isDark: true,
  }),"""
)

# ── ADD: Indian States + Exam Moods (after karur-sunset) ──
old_insert = """  buildTheme({
    id: 'high-contrast', name: 'High Contrast', emoji: '🔳', category: 'Accessibility', tier: 'base', plan: 'free',
    primary: '#000000', primaryDark: '#000000',
    accent: '#FFFF00', accentLight: '#FFFFFF',"""

new_insert = """  // ── INDIAN STATES ──────────────────────────────
  buildTheme({
    id: 'tamilnadu', name: 'Tamil Nadu', emoji: '🏛️', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#7C0000', primaryDark: '#5C0000',
    accent: '#DC2626', accentLight: '#FCA5A5',
    bg: '#FFF5F5', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'kerala', name: 'Kerala Green', emoji: '🌴', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#14532D', primaryDark: '#052E16',
    accent: '#16A34A', accentLight: '#BBF7D0',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'rajasthan', name: 'Rajasthan Desert', emoji: '🏜️', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#92400E', primaryDark: '#78350F',
    accent: '#D97706', accentLight: '#FDE68A',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'bengal', name: 'Bengal Gold', emoji: '🐯', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#713F12', primaryDark: '#451A03',
    accent: '#D97706', accentLight: '#FEF3C7',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'punjab', name: 'Punjab Harvest', emoji: '🌾', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#365314', primaryDark: '#1A2E05',
    accent: '#65A30D', accentLight: '#D9F99D',
    bg: '#F7FEE7', surface: '#FFFFFF', isDark: false,
  }),

  // ── EXAM MOODS ──────────────────────────────────
  buildTheme({
    id: 'focus-mode', name: 'Focus Mode', emoji: '🎯', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#1E3A5F', primaryDark: '#0F2140',
    accent: '#3B82F6', accentLight: '#BFDBFE',
    bg: '#F8FAFF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'night-study', name: 'Night Study', emoji: '🦉', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#6366F1', primaryDark: '#4F46E5',
    accent: '#818CF8', accentLight: '#C7D2FE',
    bg: '#020617', surface: '#0F172A', isDark: true,
  }),
  buildTheme({
    id: 'morning-fresh', name: 'Morning Fresh', emoji: '☀️', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#B45309', primaryDark: '#92400E',
    accent: '#F59E0B', accentLight: '#FDE68A',
    bg: '#FFFBEB', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'power-hour', name: 'Power Hour', emoji: '⚡', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#1D4ED8', primaryDark: '#1E40AF',
    accent: '#EAB308', accentLight: '#FEF08A',
    bg: '#0A0A0A', surface: '#1A1A1A', isDark: true,
  }),
  buildTheme({
    id: 'calm-study', name: 'Calm Study', emoji: '🍃', category: 'Exam Mood', tier: 'base', plan: 'free',
    primary: '#0F4C81', primaryDark: '#093562',
    accent: '#0EA5E9', accentLight: '#BAE6FD',
    bg: '#F0F8FF', surface: '#FFFFFF', isDark: false,
  }),

  buildTheme({
    id: 'high-contrast', name: 'High Contrast', emoji: '🔳', category: 'Accessibility', tier: 'base', plan: 'free',
    primary: '#000000', primaryDark: '#000000',
    accent: '#FFFF00', accentLight: '#FFFFFF',"""

if old_insert in src:
    src = src.replace(old_insert, new_insert)
    print("Added 10 new themes")
else:
    print("Insert point not found")
    idx = src.find("high-contrast")
    print(f"high-contrast at: {idx}")
    print(repr(src[idx-100:idx+200]))

open("src/lib/themes.js", "w", encoding="utf-8").write(src)
print("All themes fixed")
