src = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').read()

# Fix 1: duplicate position - fix by line number approach
lines = src.split('\n')
fixed = []
skip_next_position = False
for i, line in enumerate(lines):
    if skip_next_position and line.strip() == "position:'relative'":
        skip_next_position = False
        continue
    if "position:'relative'," in line and i+1 < len(lines) and "position:'relative'" in lines[i+1]:
        skip_next_position = True
    fixed.append(line)
src = '\n'.join(fixed)
print("Fix1 done")

# Fix 2: duplicate backdropFilter
src = src.replace(
    "backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',\n          backdropFilter:'blur(20px)',",
    "backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',"
)
print("Fix2 done")

# Fix 3: duplicate onClick - button already has onClick before style
# The button has onClick BEFORE style= so just remove the second one after }}
src = src.replace(
    "boxShadow:`0 4px 14px ${accent}33`}}\n                onClick={()=>setUpgradeFor('tests')}>",
    "boxShadow:`0 4px 14px ${accent}33`}}>"
)
print("Fix3 done")

# Fix 4: duplicate boxShadow
src = src.replace(
    "transition:'all 0.15s',\n                        boxShadow:isDark?'none':`0 2px 8px ${a.color}10`}}",
    "transition:'all 0.15s'}}"
)
print("Fix4 done")

open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8').write(src)
print("Saved")
