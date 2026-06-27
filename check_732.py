src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
lines = src.split("\n")
for i in range(725, 745):
    print(f"{i+1}: {lines[i].rstrip()}")
