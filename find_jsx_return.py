src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()
lines = src.split("\n")

for i, line in enumerate(lines):
    if i < 360:
        continue
    stripped = line.strip()
    if "return (" in stripped or (stripped.startswith("return") and "<" in stripped):
        print(f"Found at line {i+1}:")
        for j in range(i, min(i+30, len(lines))):
            print(f"{j+1}: {lines[j].rstrip()[:120]}")
        break

# Also show lines 360-401
print("\n=== LINES 360-401 ===")
for i in range(359, min(401, len(lines))):
    print(f"{i+1}: {lines[i].rstrip()[:120]}")
