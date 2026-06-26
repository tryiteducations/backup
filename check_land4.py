lines = open("src/pages/Landing.jsx", encoding="utf-8").readlines()

# Show Landing function structure
print("=== Landing return structure ===")
in_landing = False
section_count = 0
for i, line in enumerate(lines):
    if "function Landing" in line or "export default function Landing" in line:
        in_landing = True
    if in_landing and ("<section" in line or "</section>" in line or "return (" in line):
        print(f"Line {i+1}: {line.rstrip()[:80]}")
        if "<section" in line:
            section_count += 1
        if section_count > 5:
            break
