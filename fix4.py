src = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').read()

# Fix 1: Sidebar text ALWAYS white high contrast regardless of theme
src = src.replace(
    "color:active?accent:atLimit?'#F87171':'rgba(255,255,255,0.55)',",
    "color:active?accent:atLimit?'#F87171':'rgba(255,255,255,0.90)',"
)
src = src.replace(
    "color:'rgba(255,255,255,0.35)',fontSize:8,margin:'2px 0 0'",
    "color:'rgba(255,255,255,0.60)',fontSize:8,margin:'2px 0 0'"
)
src = src.replace(
    "color:'rgba(255,255,255,0.3)',",
    "color:'rgba(255,255,255,0.65)',"
)
src = src.replace(
    "color:'rgba(255,255,255,0.4)',",
    "color:'rgba(255,255,255,0.70)',"
)
src = src.replace(
    "color:'rgba(255,255,255,0.25)',",
    "color:'rgba(255,255,255,0.60)',"
)

# Fix 2: Nav icons get colored background — creates depth and separation
src = src.replace(
    "background:active\n                    ?`linear-gradient(135deg,${accent}33,${accent}18)`\n                    :'rgba(255,255,255,0.04)',",
    "background:active\n                    ?`linear-gradient(135deg,${accent}44,${accent}22)`\n                    :'rgba(255,255,255,0.12)',"
)

# Fix 3: Glassmorphism cards — semi transparent + blur
src = src.replace(
    "  const card    = isDark?'rgba(255,255,255,0.06)':'#fff'",
    "  const card    = isDark?'rgba(255,255,255,0.09)':'rgba(255,255,255,0.88)'"
)
src = src.replace(
    "  const bdr     = isDark?'rgba(255,255,255,0.1)':'#E2E8F0'",
    "  const bdr     = isDark?'rgba(255,255,255,0.16)':'rgba(200,210,230,0.8)'"
)

# Fix 4: Stat cards get backdrop blur
src = src.replace(
    "style={{background:card,\n                  border:`1px solid ${s.color}20`,borderRadius:18,\n                  padding:'14px',",
    "style={{background:isDark?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.9)',\n                  backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',\n                  border:`1px solid ${s.color}35`,borderRadius:18,\n                  padding:'14px',"
)

# Fix 5: Quick action cards backdrop blur
src = src.replace(
    "background:atLimit?'rgba(248,113,113,0.05)':isDark?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.85)',\n                        backdropFilter:'blur(8px)',\n                        border:`1.5px solid ${atLimit?'#F87171':a.color}35`,",
    "background:atLimit?'rgba(248,113,113,0.05)':isDark?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.92)',\n                        backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',\n                        border:`1.5px solid ${atLimit?'#F87171':a.color}40`,"
)

# Fix 6: Top bar always visible
src = src.replace(
    "background:isDark?'rgba(255,255,255,0.015)':'rgba(255,255,255,0.85)',",
    "background:isDark?'rgba(0,0,0,0.25)':'rgba(255,255,255,0.88)',\n        backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',"
)

# Fix 7: Recent tests card backdrop
src = src.replace(
    "style={{background:card,border:`1px solid ${bdr}`,borderRadius:18,overflow:'hidden'}}>\n                <div style={{padding:'14px 16px',\n                  borderBottom:`1px solid ${bdr}`,",
    "style={{background:isDark?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.9)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:`1px solid ${bdr}`,borderRadius:18,overflow:'hidden'}}>\n                <div style={{padding:'14px 16px',\n                  borderBottom:`1px solid ${bdr}`,"
)

# Fix 8: Sidebar user card visible text
src = src.replace(
    "p style={{ color:'#fff', fontWeight:700, fontSize:13,\n                  margin:0, whiteSpace:'nowrap', overflow:'hidden',\n                  textOverflow:'ellipsis' }}>{profile?.name||'Student'}</p>",
    "p style={{ color:'#ffffff', fontWeight:800, fontSize:13,\n                  margin:0, whiteSpace:'nowrap', overflow:'hidden',\n                  textOverflow:'ellipsis',textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>{profile?.name||'Student'}</p>"
)

open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8').write(src)
print('Contrast and glassmorphism applied')
