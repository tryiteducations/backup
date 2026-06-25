src = open('src/pages/student/StudentGames.jsx', encoding='utf-8').read()

# Fix 1: Admin bypass - admin can play everything
old_canplay = """  const canPlay = (game) => {
    if (game.tier === 'free') return true
    if (game.tier === 'pro' && (plan === 'pro' || plan === 'ultra')) return true
    if (game.tier === 'ultra' && plan === 'ultra') return true
    return false
  }"""

new_canplay = """  const isAdmin = authUser?.is_admin || authUser?.role === 'admin' || authUser?.email?.includes('admin')
  const canPlay = (game) => {
    if (isAdmin) return true  // Admin bypasses all restrictions
    if (game.tier === 'free') return true
    if (game.tier === 'pro' && (plan === 'pro' || plan === 'ultra')) return true
    if (game.tier === 'ultra' && plan === 'ultra') return true
    return false
  }"""

if old_canplay in src:
    src = src.replace(old_canplay, new_canplay)
    print("Admin bypass added")
else:
    print("canPlay pattern not found")

# Fix 2: Premium game card height and banner
src = src.replace(
    "height:90,",
    "height:110,"
)

# Fix 3: Bigger emoji
src = src.replace(
    "fontSize:44,",
    "fontSize:52,"
)

# Fix 4: Better card min width
src = src.replace(
    "gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',",
    "gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',"
)

# Fix 5: Card border radius more premium
src = src.replace(
    "borderRadius:20,\n                overflow:'hidden',",
    "borderRadius:22,\n                overflow:'hidden',"
)

open('src/pages/student/StudentGames.jsx', 'w', encoding='utf-8').write(src)
print("Done")
