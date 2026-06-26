import os, glob

files = glob.glob("src/pages/games/*.jsx")
fixed = 0

for path in files:
    src = open(path, encoding="utf-8").read()
    changed = False

    # Fix 1: Games ALWAYS dark background - never use light theme
    # Replace theme-aware bg with always-dark bg
    if "const themeBg = theme?.isDark" in src:
        src = src.replace(
            "const themeBg = theme?.isDark ? theme?.primaryDark ?? '#0F2140' : '#F0F4F8'\n  const bg = `radial-gradient(ellipse 120% 60% at 50% -5%,${C1}28,transparent 55%),radial-gradient(ellipse 60% 40% at 90% 110%,${C2}18,transparent 50%),${themeBg}`",
            "const bg = `radial-gradient(ellipse 120% 60% at 50% -5%,${C1}30,transparent 55%),radial-gradient(ellipse 60% 40% at 90% 110%,${C2}20,transparent 50%),#0A0F1E`"
        )
        changed = True

    # Fix 2: Question text always white
    if "color:'#fff',fontSize:16,fontWeight:600,lineHeight:1.6,margin:0" in src:
        src = src.replace(
            "color:'#fff',fontSize:16,fontWeight:600,lineHeight:1.6,margin:0",
            "color:'#F8FAFC',fontSize:15,fontWeight:600,lineHeight:1.7,margin:0"
        )
        changed = True

    # Fix 3: Answer options always dark glass
    if "isDark?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.92)'" in src:
        src = src.replace(
            "isDark?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.92)'",
            "'rgba(255,255,255,0.08)'"
        )
        changed = True

    # Fix 4: Fix option text color to always white
    if "isDark?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.85)'" in src:
        src = src.replace(
            "isDark?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.85)'",
            "'rgba(255,255,255,0.07)'"
        )
        changed = True

    # Fix 5: Progress dots background
    if "'rgba(255,255,255,0.15)'" in src:
        src = src.replace(
            "'rgba(255,255,255,0.15)'",
            "'rgba(255,255,255,0.20)'"
        )
        changed = True

    # Fix 6: Increase question timer to 3000ms
    if "}, 2800)" in src:
        src = src.replace("}, 2800)", "}, 3000)")
        changed = True
    elif "}, 1300)" in src:
        src = src.replace("}, 1300)", "}, 3000)")
        changed = True

    if changed:
        open(path, "w", encoding="utf-8").write(src)
        fixed += 1
        print(f"Fixed: {os.path.basename(path)}")

# Also fix GKBlitz specifically
gk = open("src/pages/games/GKBlitz.jsx", encoding="utf-8").read()
if "primD}" in gk:
    gk = gk.replace(
        "background:isDark?`radial-gradient(ellipse 80% 60% at 10% 0%,${primary}40,transparent 60%),${primD}`:'#F0F4F8'",
        "background:`radial-gradient(ellipse 120% 60% at 50% -5%,#3B82F630,transparent 55%),#0A0F1E`"
    )
    open("src/pages/games/GKBlitz.jsx", "w", encoding="utf-8").write(gk)
    print("Fixed: GKBlitz.jsx")

print(f"\nTotal: {fixed} files fixed")
