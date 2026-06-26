src = open("src/context/ThemeContext.jsx", encoding="utf-8").read()

# Find where CSS variables are injected
idx = src.find("--color")
print(f"CSS vars at: {idx}")
print(src[idx:idx+600])
