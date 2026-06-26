src = open("src/lib/themes.js", encoding="utf-8").read()

# Find where THEME_LIST starts and replace first batch
# Replace base themes with beautiful readable ones

OLD_BASE = """  buildTheme({
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
    accent: '#FFFFFF', accentLight: '#F8FAFC',"""

NEW_BASE = """  // ══════════════════════════════════════════
  // BATCH 1 — FREE THEMES (Light & Readable)
  // ══════════════════════════════════════════

  buildTheme({
    id: 'default', name: 'TryIT Classic', emoji: '🎓', category: 'Base', tier: 'base', plan: 'free',
    primary: '#1E3A5F', primaryDark: '#0F2140',
    accent: '#C9A84C', accentLight: '#E8C44A',
    bg: '#F8FAFC', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'blue-white', name: 'Blue & White', emoji: '💙', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#2563EB', primaryDark: '#1D4ED8',
    accent: '#2563EB', accentLight: '#60A5FA',
    bg: '#F8FAFF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'rose-white', name: 'Rose & White', emoji: '🌸', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#EC4899', primaryDark: '#DB2777',
    accent: '#EC4899', accentLight: '#F9A8D4',
    bg: '#FFF8FA', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'sky-fresh', name: 'Sky Fresh', emoji: '☁️', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#0EA5E9', primaryDark: '#0284C7',
    accent: '#0EA5E9', accentLight: '#7DD3FC',
    bg: '#F0F9FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'emerald-clean', name: 'Emerald Clean', emoji: '💚', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#10B981', primaryDark: '#059669',
    accent: '#10B981', accentLight: '#6EE7B7',
    bg: '#F0FDF4', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'violet-soft', name: 'Violet Soft', emoji: '💜', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#7C3AED', primaryDark: '#6D28D9',
    accent: '#7C3AED', accentLight: '#C4B5FD',
    bg: '#FAF5FF', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'coral-bright', name: 'Coral Bright', emoji: '🪸', category: 'Light Premium', tier: 'base', plan: 'free',
    primary: '#F97316', primaryDark: '#EA580C',
    accent: '#F97316', accentLight: '#FDBA74',
    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,
  }),
  buildTheme({
    id: 'navy-gold', name: 'Navy & Gold', emoji: '👑', category: 'Base', tier: 'base', plan: 'free',
    primary: '#1E3A5F', primaryDark: '#0F2140',
    accent: '#C9A84C', accentLight: '#E8C44A',
    bg: '#0F1E35', surface: '#1A2E4A', isDark: true,
  }),
  buildTheme({
    id: 'midnight', name: 'Midnight Blue', emoji: '🌙', category: 'Base', tier: 'base', plan: 'free',
    primary: '#1E293B', primaryDark: '#0F172A',
    accent: '#60A5FA', accentLight: '#93C5FD',
    bg: '#0F172A', surface: '#1E293B', isDark: true,
  }),
  buildTheme({
    id: 'pink-dark', name: 'Pink Night', emoji: '🌃', category: 'Base', tier: 'base', plan: 'free',
    primary: '#831843', primaryDark: '#500724',
    accent: '#F472B6', accentLight: '#FBCFE8',
    bg: '#1A0010', surface: '#2D0020', isDark: true,
  }),
  buildTheme({
    id: 'high-contrast', name: 'High Contrast', emoji: '🔳', category: 'Accessibility', tier: 'base', plan: 'free',
    primary: '#000000', primaryDark: '#000000',
    accent: '#FFFF00', accentLight: '#FFFFFF',"""

if OLD_BASE in src:
    src = src.replace(OLD_BASE, NEW_BASE)
    print("Base themes replaced")
else:
    print("Pattern not found — trying line by line")
    # Find and show what's there
    idx = src.find("id: 'default'")
    print(f"Default found at: {idx}")
    print(repr(src[idx-20:idx+300]))

open("src/lib/themes.js", "w", encoding="utf-8").write(src)
print("Done")
