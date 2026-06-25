import os
# List all game pages
for root, dirs, files in os.walk('src/pages/games'):
    for f in files:
        path = os.path.join(root, f)
        lines = open(path, encoding='utf-8').readlines()
        print(f"{f}: {len(lines)} lines")
