lines = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').readlines()

# Show lines around the 4 warnings
for ranges in [(638,648),(665,675),(810,820),(848,857)]:
    print(f"\n--- Lines {ranges[0]}-{ranges[1]} ---")
    for i in range(ranges[0]-1, ranges[1]):
        print(f"{i+1}: {lines[i].rstrip()}")
