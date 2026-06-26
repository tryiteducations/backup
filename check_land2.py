lines = open("src/pages/Landing.jsx", encoding="utf-8").readlines()

# Show lines 50-70
print("=== Lines 50-70 ===")
for i in range(49, 70):
    print(f"{i+1}: {lines[i].rstrip()}")

# Find the main return statement
print("\n=== Finding return statement ===")
for i, line in enumerate(lines):
    if "return (" in line and i < 100:
        print(f"Line {i+1}: {line.rstrip()}")

# Find first <section after return
print("\n=== First sections ===")
count = 0
for i, line in enumerate(lines):
    if "<section" in line and count < 5:
        print(f"Line {i+1}: {line.rstrip()}")
        count += 1
