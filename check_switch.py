src = open("src/context/ThemeContext.jsx", encoding="utf-8").read()
lines = src.split("\n")
for i, line in enumerate(lines):
    if "dark" in line.lower() and ("switch" in line.lower() or "toggle" in line.lower() or "pair" in line.lower() or "opposite" in line.lower() or "variant" in line.lower()):
        print(f"{i+1}: {line.rstrip()[:120]}")

print("\n--- Full context around dark toggle ---")
idx = src.find("toggleDark")
if idx < 0:
    idx = src.find("setDark")
if idx < 0:
    idx = src.find("darkMode")
print(f"Found at: {idx}")
print(src[idx:idx+400])
