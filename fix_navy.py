src = open("src/lib/themes.js", encoding="utf-8").read()

src = src.replace(
    """  buildTheme({
    id: 'navy-gold', name: 'Navy & Gold', emoji: '👑', category: 'Base', tier: 'base', plan: 'free',
    primary: '#1E3A5F', primaryDark: '#0F2140',
    accent: '#C9A84C', accentLight: '#E8C44A',
    bg: '#0F1E35', surface: '#1A2E4A', isDark: true,
  }),""",
    """  buildTheme({
    id: 'karur-sunset', name: 'Karur Sunset', emoji: '🌇', category: 'Indian Pride', tier: 'base', plan: 'free',
    primary: '#9A3412', primaryDark: '#7C2D12',
    accent: '#FB923C', accentLight: '#FDBA74',
    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,
  }),"""
)

open("src/lib/themes.js", "w", encoding="utf-8").write(src)
print("Navy Gold replaced with Karur Sunset")
