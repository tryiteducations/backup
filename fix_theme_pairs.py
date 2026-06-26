src = open("src/lib/themes.js", encoding="utf-8").read()

# Fix karur-sunset — give it unique primary
src = src.replace(
    "id: 'karur-sunset', name: 'Karur Sunset', emoji: '🌇', category: 'Indian Pride', tier: 'base', plan: 'free',\n    primary: '#9A3412', primaryDark: '#7C2D12',\n    accent: '#FB923C', accentLight: '#FDBA74',\n    bg: '#FFF7ED', surface: '#FFFFFF', isDark: false,",
    "id: 'karur-sunset', name: 'Karur Sunset', emoji: '🌇', category: 'Indian Pride', tier: 'base', plan: 'free',\n    primary: '#C2410C', primaryDark: '#9A3412',\n    accent: '#FB923C', accentLight: '#FFEDD5',\n    bg: '#FFF4E6', surface: '#FFFFFF', isDark: false,"
)

# Also remove still-existing sunrise-dark and ocean-dark 
# which confuse the pairing system
src = src.replace(
    "id: 'sunrise-dark'",
    "id: 'sunrise-dark-DISABLED'"
)
src = src.replace(
    "id: 'ocean-dark'",
    "id: 'ocean-dark-DISABLED'"
)

open("src/lib/themes.js", "w", encoding="utf-8").write(src)
print("Fixed duplicate primary and disabled old dark pairs")
