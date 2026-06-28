with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# The div is missing its closing > before the overlay
# Fix: add > after the }} that closes the style prop
bad = """        boxShadow:`4px 0 32px rgba(0,0,0,0.25),inset -1px 0 0 rgba(255,255,255,0.05)`,
        }}
        
      {sidebarOpen && ("""

good = """        boxShadow:`4px 0 32px rgba(0,0,0,0.25),inset -1px 0 0 rgba(255,255,255,0.05)`,
        }}>
      {sidebarOpen && ("""

if bad in c:
    c = c.replace(bad, good)
    print('OK unclosed div tag fixed')
else:
    print('Pattern not found - trying alternate')
    # Try just fixing the }} followed by blank line then {sidebarOpen
    import re
    c = re.sub(
        r'(\}\})\s*\n\s*\n\s*(\{sidebarOpen)',
        r'\1>\n      \2',
        c, count=1
    )
    print('OK alternate fix applied')

with open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
