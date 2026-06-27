src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()
lines = src.split("\n")
# Find the return statement
for i, line in enumerate(lines):
    if "return (" in line and i > 100:
        print(f"Return at line {i+1}")
        for j in range(i, min(i+20, len(lines))):
            print(f"{j+1}: {lines[j].rstrip()[:100]}")
        break
