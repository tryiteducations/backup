lines = open("src/pages/Landing.jsx", encoding="utf-8").readlines()

# Remove journey section from wrong place (lines 63-229 area)
# Find where journey starts and ends
j_start = -1
j_end = -1

for i, line in enumerate(lines):
    if "LIFELONG JOURNEY SECTION" in line and j_start == -1:
        j_start = i
    if j_start > -1 and "TryIT is India" in line:
        # Find closing </section> after this
        for j in range(i, min(i+15, len(lines))):
            if "</section>" in lines[j]:
                j_end = j + 1
                break
        break

print(f"Journey: lines {j_start+1} to {j_end+1}")

# Extract journey section
journey = lines[j_start:j_end]

# Remove from wrong place
clean = lines[:j_start] + lines[j_end:]

# Fix the "Class 6+" that still exists
for i, line in enumerate(clean):
    if "Class 6+" in line and "All Ages" in line:
        clean[i] = line.replace("Class 6+", "Class 1+").replace("All Ages Welcome", "Primary to SWAYAM")
        print(f"Fixed age range at line {i+1}")

# Find correct insertion point in main Landing component
# Look for a section that comes after StatsStrip is USED (not defined)
# Find where Landing function returns
landing_return = -1
for i, line in enumerate(clean):
    if "function Landing" in line or "export default function Landing" in line:
        landing_return = i
        print(f"Landing function at line {i+1}")
        break

# Find first <section inside Landing return
insert_point = -1
in_landing = False
section_count = 0
for i in range(landing_return, len(clean)):
    if "return (" in clean[i] and i > landing_return:
        in_landing = True
    if in_landing and "<section" in clean[i]:
        section_count += 1
        if section_count == 2:  # Insert after 2nd section
            # Find closing of this section
            for j in range(i+1, min(i+200, len(clean))):
                if "</section>" in clean[j]:
                    insert_point = j + 1
                    print(f"Insert after line {j+1}: {clean[j].rstrip()}")
                    break
            break

if insert_point > 0:
    final = clean[:insert_point] + journey + clean[insert_point:]
    open("src/pages/Landing.jsx", "w", encoding="utf-8").writelines(final)
    print("Journey inserted at correct location")
else:
    # Just save without journey for now
    open("src/pages/Landing.jsx", "w", encoding="utf-8").writelines(clean)
    print("Saved clean - journey not inserted (will add manually)")
