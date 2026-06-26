# Find header/navbar component
import glob
for path in glob.glob("src/**/*.jsx", recursive=True):
    src = open(path, encoding="utf-8").read()
    if "header" in path.lower() or "navbar" in path.lower() or "nav" in path.lower():
        lines = src.split("\n")
        for i, line in enumerate(lines):
            if "background" in line.lower() and ("primary" in line.lower() or "color" in line.lower()):
                print(f"{path} line {i+1}: {line.rstrip()[:120]}")
