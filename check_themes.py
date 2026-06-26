lines = open("src/lib/themes.js", encoding="utf-8").readlines()
print(f"Total lines: {len(lines)}")

# Show first theme full definition
for i, line in enumerate(lines):
    if "id: 'default'" in line:
        print(f"\nDefault theme starts at line {i+1}")
        for j in range(i, min(i+15, len(lines))):
            print(f"{j+1}: {lines[j].rstrip()}")
        break

# Show how CSS vars are generated
for i, line in enumerate(lines):
    if "background:" in line.lower() and "primary" in line:
        print(f"\nLine {i+1}: {line.rstrip()}")
        if i > 50:
            break
