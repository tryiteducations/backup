src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
lines = src.split("\n")
# Show lines 368-450 to see full damage
for i in range(368, 450):
    if i < len(lines):
        print(f"{i+1}: {lines[i].rstrip()[:120]}")
