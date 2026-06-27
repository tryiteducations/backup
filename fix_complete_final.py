import re

# ═══════════════════════════════════════════
# PART 1: HERO — Find main return statement
# ═══════════════════════════════════════════
src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()
lines = src.split("\n")

# Find the export default Hero function's return
hero_return_line = -1
in_hero_fn = False
brace_depth = 0
for i, line in enumerate(lines):
    if "export default function Hero" in line:
        in_hero_fn = True
    if in_hero_fn:
        brace_depth += line.count("{") - line.count("}")
        if "return (" in line and brace_depth <= 2 and i > 150:
            hero_return_line = i
            print(f"Main Hero return at line {i+1}")
            for j in range(i, min(i+15, len(lines))):
                print(f"  {j+1}: {lines[j].rstrip()[:120]}")
            break

open("src/components/landing/Hero.jsx", "w", encoding="utf-8").write(src)
print("Part 1 check done")
