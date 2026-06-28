import os

# Read StudentDashboard key sections
with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    sd = f.read()
    lines = sd.split('\n')

print("=== STUDENT SIDEBAR SECTION ===")
for i, l in enumerate(lines):
    if 'sidebar' in l.lower() or 'sidebar-desktop' in l:
        print(f"{i}: {l}")

print("\n=== STUDENT BOTTOM FIXED ===")
for i, l in enumerate(lines):
    if 'bottom:' in l and ('fixed' in l or '120' in l or '80' in l or 'nav' in l.lower()):
        start = max(0, i-2)
        end = min(len(lines), i+5)
        for j in range(start, end):
            print(f"{j}: {lines[j]}")
        print("---")

print("\n=== STUDENT useState declarations ===")
for i, l in enumerate(lines):
    if 'useState' in l and ('sidebar' in l.lower() or 'mobile' in l.lower() or 'open' in l.lower()):
        print(f"{i}: {l}")

print("\n=== STUDENT TOPBAR / hamburger area ===")
for i, l in enumerate(lines):
    if any(x in l for x in ['Topbar','topbar','sticky','top:0','hamburger','menuBtn']):
        print(f"{i}: {l}")

print("\n=== INSTITUTION TOPBAR SECTION ===")
with open('src/pages/institution/InstitutionDashboard.jsx', 'r', encoding='utf-8') as f:
    inst = f.read()
    ilines = inst.split('\n')

for i, l in enumerate(ilines):
    if 'sticky' in l or 'Topbar' in l or 'topbar' in l:
        start = max(0,i-1)
        end = min(len(ilines), i+20)
        for j in range(start, end):
            print(f"{j}: {ilines[j]}")
        break
