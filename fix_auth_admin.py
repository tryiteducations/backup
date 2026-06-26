src = open("src/context/AuthContext.jsx", encoding="utf-8").read()

# Add localStorage admin flag when IS_DEV is true
old = "    if (IS_DEV) {"
new = """    if (IS_DEV) {
      // Set admin flag for theme unlock
      localStorage.setItem('tryit_is_admin', 'true')"""

if "localStorage.setItem('tryit_is_admin'" not in src:
    src = src.replace(old, new)
    print("Admin flag added")
else:
    print("Already exists")

open("src/context/AuthContext.jsx", "w", encoding="utf-8").write(src)
