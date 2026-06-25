import os
# List all game pages with their routes
games = []
for f in os.listdir('src/pages/games'):
    if f.endswith('.jsx'):
        games.append(f)
print("Game files:", sorted(games))

# Check App.jsx for game routes
src = open('src/App.jsx', encoding='utf-8').read()
import re
routes = re.findall(r"path=['\"]([^'\"]*games[^'\"]*)['\"]", src)
print("\nGame routes registered:")
for r in sorted(routes):
    print(" ", r)
