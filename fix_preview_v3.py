src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()

idx = src.find("Theme preview")
# Find the opening div
div_start = src.rfind("<div style={{", 0, idx+50)
# Find closing of the preview block - look for {t.emoji} or the lock overlay
emoji_idx = src.find("{t.emoji}", div_start)
# Find the </div> that closes the preview div
close_div = src.find("</div>", emoji_idx)

print(f"div_start: {div_start}")
print(f"emoji_idx: {emoji_idx}")  
print(f"close_div: {close_div}")
print("Block to replace:")
print(repr(src[div_start:close_div+6]))
