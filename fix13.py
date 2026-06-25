src = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').read()

# Fix 1: duplicate position at 30621
old1 = "position:'relative',\n            position:'relative'"
src = src.replace(old1, "position:'relative'", 1)
print("Fix1 done:", old1 in src)

# Fix 2: duplicate backdropFilter
import re
# Find the topbar div with double backdropFilter
old2 = "backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',\n            backdropFilter:'blur(20px)',"
new2 = "backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',"
if old2 in src:
    src = src.replace(old2, new2, 1)
    print("Fix2 done")
else:
    # Try with spaces
    old2b = "backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',\n            backdropFilter: 'blur(20px)',"
    if old2b in src:
        src = src.replace(old2b, "backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',", 1)
        print("Fix2b done")
    else:
        print("Fix2 NOT found - finding manually")
        idx = src.find("blur(20px)")
        print(repr(src[idx-120:idx+30]))

# Fix 3: duplicate onClick on upgrade button
# Find the button with two onClick
old3 = "boxShadow:`0 4px 14px ${accent}33`}}\n                onClick={()=>setUpgradeFor('tests')}>"
new3 = "boxShadow:`0 4px 14px ${accent}33`}} onClick={()=>setUpgradeFor('tests')}>"
if old3 in src:
    src = src.replace(old3, new3, 1)
    print("Fix3 done")
else:
    idx = src.find("setUpgradeFor('tests')")
    print("Fix3 context:", repr(src[idx-150:idx+30]))

# Fix 4: duplicate boxShadow on action cards
old4 = "transition:'all 0.15s',\n                      boxShadow:isDark?'none':`0 2px 8px ${a.color}10`}}"
new4 = "transition:'all 0.15s'}}"
if old4 in src:
    src = src.replace(old4, new4, 1)
    print("Fix4 done")
else:
    idx = src.find("0 2px 8px ${a.color}10")
    if idx > 0:
        print("Fix4 context:", repr(src[idx-100:idx+30]))
    else:
        print("Fix4 not found")

open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8').write(src)
print("Saved")
