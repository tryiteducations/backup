src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()

# Find where isAdmin comes from
lines = src.split("\n")
for i, line in enumerate(lines[:60]):
    if "isAdmin" in line or "useTheme" in line or "useAuth" in line or "const {" in line:
        print(f"{i+1}: {line.rstrip()[:120]}")
