src = open("src/context/ThemeContext.jsx", encoding="utf-8").read()
lines = src.split("\n")

# Show full file structure
print(f"Total lines: {len(lines)}")

# Find dark/light switching
for i, line in enumerate(lines):
    if "-dark" in line or "isDark" in line or "dark" in line.lower():
        if "switch" in line.lower() or "toggle" in line.lower() or "find" in line.lower() or "replace" in line.lower() or "pair" in line.lower():
            print(f"{i+1}: {line.rstrip()[:120]}")

# Show the theme switching function
print("\n=== Theme apply function ===")
idx = src.find("setTheme")
while idx > 0:
    print(f"\nsetTheme at {idx}:")
    print(src[idx:idx+200])
    idx = src.find("setTheme", idx+1)
    if idx > 5000:
        break
