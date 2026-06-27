src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
lines = src.split("\n")
print(f"Total lines: {len(lines)}")

# Find th-shimmer to locate inserted block
idx = src.find("th-shimmer")
if idx > 0:
    # Get line number
    line_num = src[:idx].count("\n")
    print(f"th-shimmer at line {line_num+1}")
    for i in range(max(0,line_num-5), min(len(lines),line_num+10)):
        print(f"{i+1}: {lines[i].rstrip()[:120]}")
else:
    print("th-shimmer NOT found")
    # Find where old preview was
    idx2 = src.find("gridTemplateColumns")
    line_num2 = src[:idx2].count("\n")
    print(f"grid at line {line_num2+1}")
    for i in range(max(0,line_num2-2), min(len(lines),line_num2+20)):
        print(f"{i+1}: {lines[i].rstrip()[:120]}")
