# Check 1: Theme names changed?
src = open("src/lib/themes.js", encoding="utf-8").read()
if "Jasmine at Dawn" in src:
    print("Theme names: CHANGED")
else:
    print("Theme names: NOT CHANGED")

# Check 2: Preview mockup changed?
src2 = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
if "float-particle" in src2:
    print("Preview mockup: CHANGED")
else:
    print("Preview mockup: NOT CHANGED")

# Check 3: Hero particles added?
src3 = open("src/components/landing/Hero.jsx", encoding="utf-8").read()
if "float-up" in src3:
    print("Hero particles: CHANGED")
else:
    print("Hero particles: NOT CHANGED")

# Check 4: CYCLES array present?
if "CYCLES" in src3:
    print("CYCLES array: PRESENT")
else:
    print("CYCLES array: MISSING")

# Check 5: Progress bar present?
if "cycle-progress" in src3:
    print("Progress bar: PRESENT")
else:
    print("Progress bar: MISSING")

# Check 6: Style block exact text
idx = src3.find("@keyframes tryit-ring")
print(f"\nStyle block at: {idx}")
print(repr(src3[idx:idx+150]))
