src = open('src/pages/student/StudentGames.jsx', encoding='utf-8').read()

# Fix: replace .catch() with try/catch for Supabase v2
old = """      await supabase.from('test_attempts').insert({
        user_id: uid,
        exam_name: `game_${game.id}`,
        subject: game.skill,
        score: 0, total: 10,
        coins_earned: 0, xp_earned: 0,
      }).catch(() => {})"""

new = """      try {
        await supabase.from('test_attempts').insert({
          user_id: uid,
          exam_name: `game_${game.id}`,
          subject: game.skill,
          score: 0, total: 10,
          coins_earned: 0, xp_earned: 0,
        })
      } catch(e) { console.log('Game log skipped:', e.message) }"""

if old in src:
    src = src.replace(old, new)
    print("Fixed .catch() issue")
else:
    print("Pattern not found - checking")
    idx = src.find(".catch(() => {})")
    print("Found .catch at:", idx)
    print(repr(src[idx-200:idx+20]))

open('src/pages/student/StudentGames.jsx', 'w', encoding='utf-8').write(src)
print("Saved")
