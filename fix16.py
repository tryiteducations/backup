# Check StudentDashboard around upgrade button
lines = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').readlines()
for i,l in enumerate(lines):
    if 'setUpgradeFor' in l or ('Upgrade' in l and 'day' in l):
        print(f"{i+1}: {l.rstrip()}")

print("\n--- ShareCard ---")
lines2 = open('src/components/ShareCard.jsx', encoding='utf-8').readlines()
for i,l in enumerate(lines2):
    if 'whatsapp' in l.lower() or ('onClick' in l and i > 225 and i < 240):
        print(f"{i+1}: {l.rstrip()}")
