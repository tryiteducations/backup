src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()

# Find handleThemeClick function
idx = src.find("handleThemeClick")
while idx > 0:
    print(f"\nhandleThemeClick at {idx}:")
    print(src[idx:idx+400])
    idx = src.find("handleThemeClick", idx+1)
    if idx > 60000:
        break

# Also check ThemeContext for applyTheme
print("\n=== ThemeContext applyTheme calls ===")
src2 = open("src/context/ThemeContext.jsx", encoding="utf-8").read()
idx2 = src2.find("applyTheme")
while idx2 > 0:
    print(f"\napplyTheme at {idx2}:")
    print(src2[idx2:idx2+300])
    idx2 = src2.find("applyTheme", idx2+1)
    if idx2 > 20000:
        break
