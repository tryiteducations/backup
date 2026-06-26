lines = open("src/pages/Landing.jsx", encoding="utf-8").readlines()
for i in range(58, 75):
    print(f"{i+1}: {lines[i].rstrip()}")
