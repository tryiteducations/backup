with open('src/pages/student/StudentHall.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Battle button → real battle game
c = c.replace("nav('/hall')", "nav('/games/battle')")

# Create Hall → the form we built
c = c.replace("nav('/student/hall')", "nav('/hall/create')")

with open('src/pages/student/StudentHall.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('OK StudentHall buttons fixed')
print('Battle → /games/battle')
print('Create Hall → /hall/create')
