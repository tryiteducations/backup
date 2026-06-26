src = open("src/pages/Landing.jsx", encoding="utf-8").read()

# Fix 1: Remove 770 mention - replace with 1,10,000+
src = src.replace("770 exams", "1,10,000+ exams")
src = src.replace("770+ exams", "1,10,000+ exams")
src = src.replace("770+", "1,10,000+")

# Fix 2: Stat counter label
src = src.replace(
    "label:'Exam Pathways'",
    "label:'Exams Covered'"
)

# Fix 3: Remove "Free for 6 communities" - replace with better
src = src.replace(
    "1,10,000+ exams. 42+ languages. Real All-India rankings. Free for 6 communities.",
    "1,10,000+ exams. 42+ languages. Real All-India rankings. Class 1 to SWAYAM."
)

open("src/pages/Landing.jsx", "w", encoding="utf-8").write(src)
print("Landing.jsx fixed")

# Fix role select page too
import os, glob
for path in glob.glob("src/**/*.jsx", recursive=True):
    try:
        s = open(path, encoding="utf-8").read()
        if "770" in s:
            s = s.replace("770 exams", "1,10,000+ exams")
            s = s.replace("770+ exams", "1,10,000+ exams")
            s = s.replace("770+", "1,10,000+")
            open(path, "w", encoding="utf-8").write(s)
            print(f"Fixed 770 in: {path}")
    except:
        pass

print("All done")
