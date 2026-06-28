with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove overlay from wrong position (inside JSX attributes)
bad = """        }}
      {sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',
            zIndex:499}} />
      )}
        className="sidebar-desktop">"""

good = """        }}
        className="sidebar-desktop">"""

if bad in c:
    c = c.replace(bad, good)
    print('OK overlay removed from wrong position')
else:
    print('Pattern not found')
    # Show surrounding context
    idx = c.find('className="sidebar-desktop"')
    print(repr(c[idx-200:idx+50]))

# Add CSS-only backdrop using sidebar-open class on root div
old_css = '.sidebar-open .sidebar-desktop{left:0 !important}'
new_css = """.sidebar-open .sidebar-desktop{left:0 !important}
      @media(max-width:900px){
        .sidebar-open::after{content:'';position:fixed;inset:0;
          background:rgba(0,0,0,0.5);z-index:199;cursor:pointer}
      }"""
if old_css in c and 'sidebar-open::after' not in c:
    c = c.replace(old_css, new_css)
    print('OK CSS backdrop added')

with open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Done')
