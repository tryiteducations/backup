src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
lines = src.split("\n")

# Show lines 380-430
print("=== Lines 380-430 ===")
for i in range(379, 430):
    if i < len(lines):
        print(f"{i+1}: {lines[i].rstrip()[:120]}")

# Find any dark/light toggle button
print("\n=== Dark Light Switch Button ===")
for i, line in enumerate(lines):
    if ("dark" in line.lower() and "light" in line.lower()) or "sun" in line.lower() or "moon" in line.lower():
        if "button" in line.lower() or "onClick" in line or "switch" in line.lower():
            print(f"{i+1}: {line.rstrip()[:120]}")

# Check themeFilter logic
print("\n=== themeFilter ===")
idx = src.find("themeFilter")
while idx > 0 and idx < 20000:
    print(f"\nthemeFilter at {idx}:")
    print(src[idx:idx+150])
    idx = src.find("themeFilter", idx+1)
