src = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').read()

# Find and show context around duplicate position
idx = src.find("position: 'relative',\n            position: 'relative'")
if idx > 0:
    print("FOUND duplicate position at:", idx)
    print(src[idx-100:idx+100])
else:
    print("NOT FOUND - searching differently")
    idx2 = src.find("position:'relative',\n            position:'relative'")
    print("Alt search:", idx2)
    # Find all occurrences of position:relative
    import re
    for m in re.finditer(r"position.*relative", src):
        print(f"  pos {m.start()}: {src[m.start():m.start()+50]}")
