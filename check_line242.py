src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()
lines = src.split("\n")
for i in range(235, 255):
    print(f"{i+1}: {lines[i].rstrip()}")
