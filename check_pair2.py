src = open("src/context/ThemeContext.jsx", encoding="utf-8").read()
lines = src.split("\n")

# Show lines 1-50 and any dark logic
print("=== FIRST 80 LINES ===")
for i in range(min(80, len(lines))):
    print(f"{i+1}: {lines[i].rstrip()[:120]}")
