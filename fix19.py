lines = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').readlines()

# Line 794 (index 793) needs > at end to close button opening tag
print("Before:", lines[793].rstrip())
lines[793] = lines[793].rstrip() + ">\n"
print("After:", lines[793].rstrip())

open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8').writelines(lines)
print("Done")
