src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
idx = src.find("Theme preview")
print(repr(src[idx:idx+800]))
