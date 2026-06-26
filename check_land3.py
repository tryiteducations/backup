lines = open("src/pages/Landing.jsx", encoding="utf-8").readlines()

# Show lines 38-48
print("=== Return structure ===")
for i in range(37, 48):
    print(f"{i+1}: {lines[i].rstrip()}")

# Show lines 238-250
print("\n=== After journey section ===")
for i in range(237, 255):
    if i < len(lines):
        print(f"{i+1}: {lines[i].rstrip()}")
