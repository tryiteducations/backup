src = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').read()

# Find the duplicate onClick context
import re
matches = [(m.start(), src[m.start()-200:m.start()+100]) for m in re.finditer(r'onClick', src)]
# Find where two onClick appear close together
for i in range(len(matches)-1):
    if matches[i+1][0] - matches[i][0] < 300:
        gap = matches[i+1][0] - matches[i][0]
        if gap < 50:
            print(f"DUPLICATE onClick at pos {matches[i][0]}, gap={gap}")
            print(repr(src[matches[i][0]-50:matches[i+1][0]+80]))
            print("---")
