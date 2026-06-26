src = open("src/pages/Landing.jsx", encoding="utf-8").read()

# Fix 1: Class 6+ stat
src = src.replace(
    "{ ref:null, value:'Class 6+',              label:'All Ages Welcome' },",
    "{ ref:null, value:'Class 1+',              label:'Primary to SWAYAM' },"
)
src = src.replace("Class 6+", "Class 1+")
src = src.replace("All Ages Welcome", "Primary to SWAYAM")

# Fix 2: Languages - 40+ to 42+
src = src.replace("English / Hindi only", "42+ Indian Languages")
src = src.replace("40+ Indian languages", "42+ Indian Languages")
src = src.replace("40+ languages", "42+ languages")

# Fix 3: One Subscribes. Another Studies Free.
src = src.replace(
    "One Subscribes. Another Studies Free.",
    "1 Subscription = 1 Scholarship. Every premium user sponsors a deserving student."
)

# Fix 4: Free for 6 communities line
src = src.replace(
    "Free for 6 communities. From Class 6 to PhD — for every Indian, at every age.",
    "From Class 1 to SWAYAM — for every Indian, at every stage of life."
)
src = src.replace(
    "Free for 6 communities",
    "Scholarships for deserving students"
)

# Fix 5: Any remaining Class 6 to PhD
src = src.replace("Class 6 to PhD", "Class 1 to SWAYAM")
src = src.replace("Class 6+ to PhD", "Class 1 to SWAYAM")

open("src/pages/Landing.jsx", "w", encoding="utf-8").write(src)
print("All fixed")
