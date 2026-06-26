src = open("src/pages/Landing.jsx", encoding="utf-8").read()

# Fix 1: Remove near-zero server cost mention
src = src.replace(
    "TryIT's near-zero server cost model lets us offer free and discounted access to 11 categories of deserving students. No compromises. Same platform.",
    "TryIT believes every student deserves access to quality exam preparation — regardless of income, location or language. Same platform. No compromises."
)
src = src.replace("near-zero server cost", "efficient cloud infrastructure")
src = src.replace("near zero server cost", "efficient cloud infrastructure")

# Fix 2: Remove fake sponsored count
src = src.replace("3,641", "")
src = src.replace("Students currently sponsored", "Students sponsored through TryIT Fellowship")

# Fix 3: Hide testimonials section - wrap in {false && (...)}
# Find the testimonials section
import re
# Hide "Real Students. Real Results." section
src = src.replace(
    "<Testimonials/>",
    "{/* Testimonials hidden until real data available */}"
)

# Fix 4: Standardize language count to 42 everywhere
src = src.replace("40 languages", "42 languages")
src = src.replace("40+ languages", "42+ languages")
src = src.replace("40 Indian languages", "42 Indian languages")
src = src.replace("in 40", "in 42")
src = src.replace("across 40", "across 42")

# Fix 5: Standardize exam count - no 770 anywhere
src = src.replace("770 exams", "1,10,000+ exams")
src = src.replace("770+ exams", "1,10,000+ exams")

open("src/pages/Landing.jsx", "w", encoding="utf-8").write(src)
print("Landing.jsx fixed")

# Fix Footer too
src2 = open("src/components/landing/Footer.jsx", encoding="utf-8").read()
src2 = src2.replace("40 languages", "42 languages")
src2 = src2.replace("40+ languages", "42+ languages")
src2 = src2.replace("770", "1,10,000+")
open("src/components/landing/Footer.jsx", "w", encoding="utf-8").write(src2)
print("Footer.jsx fixed")

# Fix all other files with 40 language or 770 mentions
import glob
for path in glob.glob("src/**/*.jsx", recursive=True):
    try:
        s = open(path, encoding="utf-8").read()
        changed = False
        if "40 language" in s or "40+ language" in s:
            s = s.replace("40 languages", "42 languages")
            s = s.replace("40+ languages", "42+ languages")
            changed = True
        if "770" in s:
            s = s.replace("770 exams", "1,10,000+ exams")
            s = s.replace("770+ exams", "1,10,000+ exams")
            changed = True
        if changed:
            open(path, "w", encoding="utf-8").write(s)
            print(f"Fixed: {path}")
    except:
        pass

print("All done")
