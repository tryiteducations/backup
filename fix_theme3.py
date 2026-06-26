src = open("src/context/ThemeContext.jsx", encoding="utf-8").read()

# Pass ultra plan to getThemesWithStatus when admin
src = src.replace(
    "() => getThemesWithStatus(userStats, unlockedThemeIds, userPlan),",
    "() => getThemesWithStatus(userStats, unlockedThemeIds, isAdmin ? 'ultra' : userPlan),"
)

# Also fix findNewlyUnlocked
src = src.replace(
    "const newly = findNewlyUnlocked(userStats, unlockedThemeIds, userPlan)",
    "const newly = findNewlyUnlocked(userStats, unlockedThemeIds, isAdmin ? 'ultra' : userPlan)"
)

open("src/context/ThemeContext.jsx", "w", encoding="utf-8").write(src)
print("Fixed")

# Verify
v = open("src/context/ThemeContext.jsx", encoding="utf-8").read()
print("ultra override:", "isAdmin ? 'ultra'" in v)
