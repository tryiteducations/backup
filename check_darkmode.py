src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
lines = src.split("\n")

# Find dark mode toggle
for i, line in enumerate(lines):
    if any(x in line for x in ["darkMode","dark_mode","setDark","isDark","toggleDark","darkTheme","lightTheme","sunrise-dark","ocean-dark","dark_variant","darkVariant"]):
        print(f"{i+1}: {line.rstrip()[:120]}")

# Find any toggle switch near themes
print("\n=== Toggle near theme section ===")
idx = src.find("Dark Mode")
if idx < 0:
    idx = src.find("dark mode")
if idx < 0:
    idx = src.find("darkMode")
print(f"Found at: {idx}")
if idx > 0:
    print(src[idx-200:idx+400])

# Also check for any -dark suffix replacement
print("\n=== Any dark replacement ===")  
for keyword in ["replace", "dark", "variant", "switch"]:
    for i, line in enumerate(lines):
        if keyword in line.lower() and "theme" in line.lower() and i > 100:
            print(f"{i+1}: {line.rstrip()[:120]}")
            break
