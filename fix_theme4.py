src = open("src/App.jsx", encoding="utf-8").read()

# Pass userPlan=ultra when admin
old = "    <ThemeProvider userLevel={user?.level ?? 1}>"
new = """    <ThemeProvider
      userLevel={user?.level ?? 1}
      userPlan={user?.is_admin || localStorage.getItem('tryit_is_admin')==='true' ? 'ultra' : (user?.plan ?? 'free')}
      userStats={{ tests_completed: user?.testsCompleted ?? 0, streak_days: user?.streak ?? 0, coins_earned: user?.coins ?? 0 }}
    >"""

if old in src:
    src = src.replace(old, new)
    print("Fixed ThemeProvider props")
else:
    print("Pattern not found")
    idx = src.find("ThemeProvider userLevel")
    print(repr(src[idx-20:idx+100]))

open("src/App.jsx", "w", encoding="utf-8").write(src)
