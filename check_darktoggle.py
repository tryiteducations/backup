src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()
lines = src.split("\n")

print("=== Dark toggle logic ===")
for i, line in enumerate(lines):
    if "dark" in line.lower() and i > 200:
        if any(x in line.lower() for x in ["switch","toggle","replace","settheme","apply","click","onpress","onclick"]):
            print(f"{i+1}: {line.rstrip()[:120]}")

print("\n=== Theme click handler ===")
idx = src.find("onClick")
count = 0
while idx > 0 and count < 20:
    context = src[idx:idx+200]
    if "theme" in context.lower() or "Theme" in context:
        print(f"\nonClick at {idx}:")
        print(context[:200])
    idx = src.find("onClick", idx+1)
    count += 1

print("\n=== Dark suffix logic ===")
idx = src.find("-dark")
while idx > 0:
    print(f"\n-dark at {idx}:")
    print(src[idx-100:idx+100])
    idx = src.find("-dark", idx+1)
    if idx > 50000:
        break
