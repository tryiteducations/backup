lines = open("src/pages/Landing.jsx", encoding="utf-8").readlines()

# Show from line 371 onwards - the main return
for i in range(370, 420):
    print(f"{i+1}: {lines[i].rstrip()[:90]}")
