import os

print("=== INSTITUTION FILES ===")
inst_dir = 'src/pages/institution'
if os.path.exists(inst_dir):
    for f in os.listdir(inst_dir):
        size = os.path.getsize(os.path.join(inst_dir, f))
        print(f"  {f} — {size} bytes")
else:
    print("  DIRECTORY MISSING!")

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    app = f.read()

print("\n=== APP.JSX INSTITUTION ROUTES ===")
for l in app.split('\n'):
    if 'institution' in l.lower():
        print(' ', l.strip())

print("\n=== APP.JSX MENTOR ROUTES ===")
for l in app.split('\n'):
    if 'mentor-hub' in l.lower():
        print(' ', l.strip())

print("\n=== KEY FILES CHECK ===")
checks = [
    'src/components/guards/RoleGuard.jsx',
    'src/pages/mentor/MentorHub.jsx',
    'src/pages/exam-board/ExamBoard.jsx',
    'src/pages/institution/InstitutionDashboard.jsx',
    'src/pages/institution/InstitutionHalls.jsx',
    'src/pages/institution/InstitutionMentors.jsx',
    'src/pages/institution/InstitutionHomework.jsx',
    'src/pages/institution/InstitutionRegister.jsx',
]
for p in checks:
    exists = os.path.exists(p)
    size = os.path.getsize(p) if exists else 0
    print(f"  {'OK' if exists else 'MISSING'} {p} ({size}b)")

with open('src/lib/themes.js', 'r', encoding='utf-8') as f:
    t = f.read()
print("\n=== THEMES STATUS ===")
print('  MENTOR_THEMES array:', 'const MENTOR_THEMES = [' in t)
print('  In THEME_LIST:', '...MENTOR_THEMES' in t)
idx_m = t.find('const MENTOR_THEMES')
idx_e = t.find('export const THEMES')
print('  Before THEMES export:', idx_m != -1 and idx_m < idx_e)

with open('src/pages/mentor/MentorHub.jsx', 'r', encoding='utf-8') as f:
    hub = f.read()
print("\n=== MENTORHUB STATUS ===")
print('  sidebarJSX inline:', 'sidebarJSX' in hub)
print('  Sidebar component:', 'const Sidebar = () =>' in hub)
print('  Logout:', 'logout' in hub.lower() or 'Logout' in hub)
