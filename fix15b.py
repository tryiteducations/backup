# Fix ShareCard duplicate onClick
src = open('src/components/ShareCard.jsx', encoding='utf-8').read()
import re
# Find button with two onClick
matches = list(re.finditer(r'onClick', src))
for i in range(len(matches)-1):
    if matches[i+1].start() - matches[i].start() < 300:
        gap = matches[i+1].start() - matches[i].start()
        if gap < 60:
            print(f"Duplicate at {matches[i].start()}, gap={gap}")
            print(repr(src[matches[i].start()-20:matches[i+1].start()+80]))
