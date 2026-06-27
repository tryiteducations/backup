with open('src/pages/student/StudentHall.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("nav('/hall')", "nav('/games/battle')")
c = c.replace("nav('/student/hall')", "nav('/hall/create')")
with open('src/pages/student/StudentHall.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('OK buttons fixed')
