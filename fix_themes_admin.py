src = open("src/context/ThemeContext.jsx", encoding="utf-8").read()

# Find where themesWithStatus is built and add admin bypass
old = "  const themesWithStatus = useMemo("
new = """  // Admin gets all themes unlocked
  const isAdmin = user?.is_admin || user?.role === 'admin'

  const themesWithStatus = useMemo("""

if old in src and "isAdmin = user" not in src:
    src = src.replace(old, new)
    print("Added isAdmin check")

# Find where unlocked is determined and add admin bypass
old2 = "    return THEME_LIST.map(t => {"
new2 = """    return THEME_LIST.map(t => {"""

# Find the return statement in themesWithStatus
idx = src.find("return THEME_LIST.map(t => {")
if idx > 0:
    # Find the unlocked line inside this map
    chunk = src[idx:idx+400]
    print("Found map at:", idx)
    print("Context:", chunk[:200])

# Try to find where unlocked is set
if "const unlocked = " in src:
    idx2 = src.find("const unlocked = ")
    print("unlocked at:", idx2)
    print("Context:", src[idx2:idx2+100])
    
    # Add isAdmin bypass
    src = src.replace(
        "const unlocked = unlockedThemeIds.includes(t.id) || t.tier === 'base'",
        "const unlocked = isAdmin || unlockedThemeIds.includes(t.id) || t.tier === 'base'"
    )
    print("Admin theme bypass added")

open("src/context/ThemeContext.jsx", "w", encoding="utf-8").write(src)
print("ThemeContext updated")
