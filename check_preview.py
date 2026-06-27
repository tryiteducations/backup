src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
idx = src.find("height: 70,")
print(repr(src[idx-100:idx+400]))
