lines = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').readlines()

# Fix line 642-643: duplicate position
for i, line in enumerate(lines):
    if i > 630 and i < 650:
        print(f"{i+1}: {line.rstrip()}")
