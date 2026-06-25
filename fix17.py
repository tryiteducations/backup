# Fix StudentDashboard - line 795 has duplicate onClick
lines = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').readlines()
# Line 795 (index 794) is the duplicate - remove it
print("Before:", lines[794].rstrip())
lines[794] = ""
print("Removed line 795")

open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8').writelines(lines)

# Fix ShareCard - line 232 has duplicate onClick, keep line 230 onClick
lines2 = open('src/components/ShareCard.jsx', encoding='utf-8').readlines()
print("\nShareCard line 230:", lines2[229].rstrip())
print("ShareCard line 232:", lines2[231].rstrip())

# Replace both onClick with single one on line 230, remove line 232 onClick
lines2[229] = lines2[229].replace(
    'onClick={()=>handleShare(\'whatsapp\')}',
    'onClick={()=>{window.open(`https://wa.me/?text=${encodeURIComponent(getText())}`,"_blank");handleShare("whatsapp")}}'
)
lines2[231] = lines2[231].replace(
    "onClick={()=>{window.open(`https://wa.me/?text=${encodeURIComponent(getText())}`,'_blank');handleShare('whatsapp')}}",
    ""
)
print("Fixed ShareCard")
open('src/components/ShareCard.jsx', 'w', encoding='utf-8').writelines(lines2)
print("Done")
