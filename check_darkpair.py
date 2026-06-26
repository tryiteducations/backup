src = open("src/lib/themes.js", encoding="utf-8").read()
# Find dark variant mapping
idx = src.find("sunrise-dark")
if idx > 0:
    print("Dark pair system found:")
    print(src[idx-200:idx+100])

idx2 = src.find("darkVariant")
if idx2 > 0:
    print("\ndarkVariant found:")
    print(src[idx2-100:idx2+300])

idx3 = src.find("lightVariant")
if idx3 > 0:
    print("\nlightVariant found:")
    print(src[idx3-100:idx3+300])
