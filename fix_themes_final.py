src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()

# ── STEP 1: Replace theme preview with mini mockup ──
OLD_PREVIEW = """              {/* Theme preview */}
                        <div style={{
                          height: 70,
                          background: t.isDark
                            ? `linear-gradient(135deg,${t.primaryDark||t.primary||'#0F2140'},${t.accent||'#C9A84C'}88)`
                            : `linear-gradient(135deg,${t.bg||'#F8FAFC'},${t.accent||'#2563EB'}44)`,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fon"""

NEW_PREVIEW = """              {/* Theme preview — Mini Mockup */}
                        <div style={{
                          height: 110,
                          background: t.bg || '#F8FAFC',
                          display: 'flex', flexDirection: 'column',
                          overflow: 'hidden', position: 'relative',
                          fon"""

if OLD_PREVIEW in src:
    src = src.replace(OLD_PREVIEW, NEW_PREVIEW)
    print("Preview header replaced")
else:
    print("Preview header NOT found")
    idx = src.find("Theme preview")
    print(repr(src[idx:idx+300]))

open("src/pages/student/StudentSettings.jsx", "w", encoding="utf-8").write(src)
