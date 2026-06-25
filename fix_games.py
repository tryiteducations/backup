import os, glob

files = glob.glob("src/pages/games/*.jsx")
fixed = 0

for path in files:
    src = open(path, encoding="utf-8").read()
    changed = False

    # Fix 1: Increase question change delay from 1300ms to 2800ms
    if "}, 1300)" in src:
        src = src.replace("}, 1300)", "}, 2800)")
        changed = True

    # Fix 2: Also fix 1200ms burst timeout to stay longer
    if "}, 1200)" in src:
        src = src.replace("}, 1200)", "}, 1500)")
        changed = True

    # Fix 3: Use theme gradient not solid primD
    if "const bg = `radial-gradient(ellipse 100% 60% at 50% -10%,${C1}33,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 100%,${C2}22,transparent 50%),${primD}`" in src:
        src = src.replace(
            "const bg = `radial-gradient(ellipse 100% 60% at 50% -10%,${C1}33,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 100%,${C2}22,transparent 50%),${primD}`",
            "const themeBg = theme?.isDark ? theme?.primaryDark ?? '#0F2140' : '#F0F4F8'\n  const bg = `radial-gradient(ellipse 120% 60% at 50% -5%,${C1}28,transparent 55%),radial-gradient(ellipse 60% 40% at 90% 110%,${C2}18,transparent 50%),${themeBg}`"
        )
        changed = True

    # Fix 4: Add theme to useTheme destructuring
    if "const primD = theme?.primaryDark ?? '#0F2140'" in src:
        src = src.replace(
            "const primD = theme?.primaryDark ?? '#0F2140'",
            "const primD = theme?.primaryDark ?? '#0F2140'\n  const isDark = theme?.isDark ?? false"
        )
        changed = True

    # Fix 5: Card background should use glass not solid
    if "'rgba(255,255,255,0.07)',backdropFilter:'blur(20px)'" in src:
        src = src.replace(
            "'rgba(255,255,255,0.07)',backdropFilter:'blur(20px)'",
            "isDark?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.92)',backdropFilter:'blur(20px)'"
        )
        changed = True

    # Fix 6: Answer option background in dark vs light
    if "'rgba(255,255,255,0.06)'" in src:
        src = src.replace(
            "'rgba(255,255,255,0.06)'",
            "isDark?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.85)'"
        )
        changed = True

    if changed:
        open(path, "w", encoding="utf-8").write(src)
        fixed += 1
        print(f"Fixed: {os.path.basename(path)}")

print(f"\nTotal fixed: {fixed} files")
