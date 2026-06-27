src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()

src = src.replace(
    "sub: 'India's only platform from Class 1 to SWAYAM'",
    "sub: 'India\\'s only platform from Class 1 to SWAYAM'"
)

open("src/components/landing/Hero.jsx", "w", encoding="utf-8").write(src)
print("Fixed")
