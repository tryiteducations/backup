import os, glob
# Find all landing components
for f in glob.glob("src/components/landing/*.jsx"):
    src = open(f, encoding="utf-8").read()
    print(f"\n{f}: {len(src.split(chr(10)))} lines")
