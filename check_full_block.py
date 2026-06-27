src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
lines = src.split("\n")
for i in range(360, 430):
    print(f"{i+1}: {lines[i].rstrip()[:120]}")
