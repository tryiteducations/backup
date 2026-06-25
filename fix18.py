lines = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').readlines()

# Show lines 788-800 to see the structure
for i in range(787, 802):
    print(f"{i+1}: {lines[i].rstrip()}")
