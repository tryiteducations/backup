src = open("src/context/ThemeContext.jsx", encoding="utf-8").read()

# Remove the broken user reference
src = src.replace(
    "  // Admin gets all themes unlocked\n  const isAdmin = user?.is_admin || user?.role === 'admin'\n\n  const themesWithStatus = useMemo(",
    "  const themesWithStatus = useMemo("
)

# Add localStorage-based admin check instead
src = src.replace(
    "  const themesWithStatus = useMemo(",
    "  const isAdmin = localStorage.getItem('tryit_is_admin') === 'true'\n\n  const themesWithStatus = useMemo("
)

# Add admin bypass to unlock check
src = src.replace(
    "const unlocked = isAdmin || unlockedThemeIds.includes(t.id) || t.tier === 'base'",
    "const unlocked = unlockedThemeIds.includes(t.id) || t.tier === 'base'"
)

# Add the real admin bypass
src = src.replace(
    "const unlocked = unlockedThemeIds.includes(t.id) || t.tier === 'base'",
    "const unlocked = isAdmin || unlockedThemeIds.includes(t.id) || t.tier === 'base'"
)

open("src/context/ThemeContext.jsx", "w", encoding="utf-8").write(src)
print("Fixed")
