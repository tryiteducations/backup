lines = open('src/pages/community/CommunityPage.jsx', encoding='utf-8').readlines()
for i,l in enumerate(lines):
    if 'border' in l and i > 190 and i < 205:
        print(f"{i+1}: {l.rstrip()}")
