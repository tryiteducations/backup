src = open("src/pages/Landing.jsx", encoding="utf-8").read()
lines = src.split("\n")
print(f"Total lines: {len(lines)}")

# Find hero section
for i, line in enumerate(lines):
    if "hero" in line.lower() or "tagline" in line.lower() or "Your Exam" in line:
        print(f"{i+1}: {line.rstrip()[:100]}")
        if i > 50:
            break
