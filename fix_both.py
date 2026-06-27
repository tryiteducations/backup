src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()

# Fix isAdmin — get from localStorage (already used elsewhere in project)
old = """  const isUnlocked = (t) => isAdmin || t.tier === 'base' || !t.unlock"""
new = """  const isAdmin = localStorage.getItem('tryit_is_admin') === 'true'
  const isUnlocked = (t) => isAdmin || t.tier === 'base' || !t.unlock"""

if old in src:
    src = src.replace(old, new)
    print("isAdmin fix applied")
else:
    print("Pattern not found")
    idx = src.find("isUnlocked")
    print(repr(src[idx-20:idx+100]))

open("src/pages/student/StudentSettings.jsx", "w", encoding="utf-8").write(src)
print("Done")
