src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()

# Find HEROES array
idx = src.find("const HEROES")
print(f"HEROES at: {idx}")
print(repr(src[idx:idx+400]))
