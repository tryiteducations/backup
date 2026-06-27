src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()
lines = src.split("\n")

# Find return with actual JSX - look for return ( followed by <div or <section
for i, line in enumerate(lines):
    if i < 330:
        continue
    stripped = line.strip()
    if stripped.startswith("return ("):
        print(f"JSX return at line {i+1}:")
        for j in range(i, min(i+25, len(lines))):
            print(f"{j+1}: {lines[j].rstrip()[:120]}")
        break
