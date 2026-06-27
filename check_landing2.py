src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()
lines = src.split("\n")
print(f"Hero.jsx total lines: {len(lines)}")
# Show first 40 lines
for i in range(40):
    print(f"{i+1}: {lines[i].rstrip()[:100]}")
