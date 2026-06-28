import os, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("=== SIDEBAR LINES ===")
for i,l in enumerate(lines):
    if any(x in l for x in ['sidebar','Sidebar','sidebarOpen','bottom:0','bottom:120','sticky','hamburger','menuOpen']):
        print(f"{i}: {l.rstrip()}")

print("\n=== INSTITUTION TOPBAR ===")
with open('src/pages/institution/InstitutionDashboard.jsx', 'r', encoding='utf-8') as f:
    ilines = f.readlines()
for i,l in enumerate(ilines):
    if 'sticky' in l:
        for j in range(max(0,i-1), min(len(ilines),i+20)):
            print(f"{j}: {ilines[j].rstrip()}")
        break
