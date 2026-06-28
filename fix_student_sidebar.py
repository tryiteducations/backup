import re

with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# FIX 1: React.useState -> useState (build failure cause)
c = c.replace('React.useState(false)', 'useState(false)')
print('OK React.useState fixed')

# FIX 2: Add overlay for mobile sidebar
if 'sidebar-overlay' not in c:
    overlay = """
      {sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',
            zIndex:498,backdropFilter:'blur(2px)'}}/>
      )}"""
    # Insert just before sidebar div
    c = c.replace(
        'className="sidebar-desktop"',
        overlay + '\n      <div\n        className="sidebar-desktop"',
        1
    )
    print('OK overlay added')
else:
    print('SKIP overlay exists')

# FIX 3: Remove FAB (bottom:120)
lines = c.split('\n')
fab_start = -1
for i,l in enumerate(lines):
    if "position:'fixed',bottom:120" in l:
        fab_start = i
        break

if fab_start > -1:
    # Find the wrapping div start (go back to find opening)
    start = max(0, fab_start - 3)
    # Count divs to find end
    depth = 0
    end = fab_start
    for i in range(start, min(len(lines), fab_start + 60)):
        depth += lines[i].count('<div') + lines[i].count('<button')
        depth -= lines[i].count('</div>') + lines[i].count('</button>')
        if i > fab_start and depth <= 0:
            end = i
            break
    del lines[start:end+1]
    c = '\n'.join(lines)
    print(f'OK FAB removed (lines {start}-{end})')
else:
    print('SKIP FAB not found')

# FIX 4: Remove bottom nav (bottom:0,left:0,right:0)
lines = c.split('\n')
bnav_start = -1
for i,l in enumerate(lines):
    if "position:'fixed',bottom:0,left:0,right:0" in l:
        bnav_start = i
        break

if bnav_start > -1:
    start = max(0, bnav_start - 2)
    depth = 0
    end = bnav_start
    for i in range(start, min(len(lines), bnav_start + 100)):
        depth += lines[i].count('<div') + lines[i].count('<button') + lines[i].count('<nav')
        depth -= lines[i].count('</div>') + lines[i].count('</button>') + lines[i].count('</nav>')
        if i > bnav_start and depth <= 0:
            end = i
            break
    del lines[start:end+1]
    c = '\n'.join(lines)
    print(f'OK bottom nav removed (lines {start}-{end})')
else:
    print('SKIP bottom nav not found')

# FIX 5: Add hamburger to topbar (find topbar sticky area)
if 'mobile-hamburger-btn' not in c:
    hamburger = """
          <button onClick={()=>setSidebarOpen(true)}
            className="mobile-hamburger-btn"
            style={{background:'var(--color-primary,#1E3A5F)',border:'none',
              borderRadius:10,width:36,height:36,cursor:'pointer',color:'#fff',
              fontSize:18,display:'none',alignItems:'center',justifyContent:'center',
              flexShrink:0}}>
            ☰
          </button>"""
    # Find topbar — it has position:sticky,top:0,zIndex:100
    lines = c.split('\n')
    for i,l in enumerate(lines):
        if 'sticky' in l and 'zIndex:100' in l:
            # Insert hamburger after the opening div tag ends
            # Find next line
            lines.insert(i+1, hamburger)
            break
    c = '\n'.join(lines)
    # Add CSS for hamburger button
    c = c.replace(
        '.mobile-hamburger{display:none}',
        '.mobile-hamburger{display:none}\n      .mobile-hamburger-btn{display:none !important}\n      @media(max-width:900px){.mobile-hamburger-btn{display:flex !important}}'
    )
    print('OK hamburger added to topbar')

with open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Done! Run: npm run build')
