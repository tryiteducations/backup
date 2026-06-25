src = open("src/lib/gameUI.jsx", encoding="utf-8").read()

# Fix answer option default bg - use semi transparent not dark
src = src.replace(
    "  let bg = 'rgba(255,255,255,0.06)'",
    "  let bg = 'rgba(255,255,255,0.08)'"
)

# Fix answer option border
src = src.replace(
    "  let border = 'rgba(255,255,255,0.12)'",
    "  let border = 'rgba(255,255,255,0.20)'"
)

# Fix answer text color  
src = src.replace(
    "  let color = '#fff'",
    "  let color = '#ffffff'"
)

# Fix game header background
src = src.replace(
    "background:'rgba(0,0,0,0.4)',",
    "background:'rgba(0,0,0,0.35)',"
)

open("src/lib/gameUI.jsx", "w", encoding="utf-8").write(src)
print("gameUI fixed")
