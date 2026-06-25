lines = open('src/pages/community/CommunityPage.jsx', encoding='utf-8').readlines()
# Line 194 (index 193) has border:none - remove it, keep line 198 border
print("Before:", lines[193].rstrip())
lines[193] = lines[193].replace(", border:'none'", "")
print("After:", lines[193].rstrip())
open('src/pages/community/CommunityPage.jsx', 'w', encoding='utf-8').writelines(lines)
print("Done")
