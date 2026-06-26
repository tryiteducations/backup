src = open("src/lib/themes.js", encoding="utf-8").read()

# Find buildTheme function
idx = src.find("function buildTheme")
if idx < 0:
    idx = src.find("const buildTheme")
if idx < 0:
    idx = src.find("buildTheme =")
print(f"buildTheme found at: {idx}")
print(src[idx:idx+800])
