lines = open("src/pages/Landing.jsx", encoding="utf-8").readlines()

# Find line 64 where journey section starts (index 63)
# Find where it ends
start = 63  # line 64 (0-indexed)

# Find the end of the journey section
end = start
for i in range(start, len(lines)):
    if "TryIT is India" in lines[i] and i > start + 10:
        # Find closing </section> after this
        for j in range(i, min(i+10, len(lines))):
            if "</section>" in lines[j]:
                end = j + 1
                break
        break

print(f"Journey section: lines {start+1} to {end+1}")
print("First line:", lines[start].rstrip())
print("Last line:", lines[end].rstrip() if end < len(lines) else "EOF")

# Extract the journey section content
journey_lines = lines[start:end+1]

# Remove from current position
new_lines = lines[:start] + lines[end+1:]

# Find correct insertion point - inside the main JSX return
# Look for a good section to insert after - find "leaderboard" or features section
insert_idx = -1
for i, line in enumerate(new_lines):
    if "LIFELONG" in line or "lifelong" in line:
        print(f"Found existing reference at {i+1}")

# Find insertion point - after stats section closing </section>
for i in range(60, min(200, len(new_lines))):
    if "</section>" in new_lines[i]:
        # Check if this is inside return JSX (not too early)
        if i > 55:
            insert_idx = i + 1
            print(f"Inserting after line {i+1}: {new_lines[i].rstrip()}")
            break

if insert_idx > 0:
    new_lines = new_lines[:insert_idx] + journey_lines + new_lines[insert_idx:]
    open("src/pages/Landing.jsx", "w", encoding="utf-8").writelines(new_lines)
    print("Fixed and saved")
else:
    print("Could not find insertion point")
    open("src/pages/Landing.jsx", "w", encoding="utf-8").writelines(new_lines)
    print("Saved without journey section - will add manually")
