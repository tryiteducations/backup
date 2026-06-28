import re

with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# FIX 1: Add sidebarOpen state if not present
if 'sidebarOpen' not in c:
    # Find first useState line and add after it
    c = re.sub(
        r'(const \[\w+, set\w+\] = useState\([^)]*\))',
        r'\1\n  const [sidebarOpen, setSidebarOpen] = React.useState(false)',
        c, count=1
    )
    # Fallback: find any useState
    if 'sidebarOpen' not in c:
        c = c.replace(
            "import { useState",
            "import { useState, useCallback"
        )
        # Add after component function opens
        c = re.sub(
            r'(export default function \w+\(\) \{)',
            r'\1\n  const [sidebarOpen, setSidebarOpen] = React.useState(false)',
            c, count=1
        )
    print('OK sidebarOpen state added')
else:
    print('SKIP sidebarOpen already exists')

# FIX 2: Replace CSS sidebar hide with JS-controlled approach
# Change .sidebar-desktop{display:none} to use JS state
old_css_hide = '.sidebar-desktop{display:none !important}'
new_css_hide = '.sidebar-desktop{display:none !important;transition:left 0.3s ease}'
if old_css_hide in c:
    c = c.replace(old_css_hide, new_css_hide)
    print('OK sidebar CSS updated')

# FIX 3: Add sidebarOpen to sidebar className and inline style
# Find className="sidebar-desktop" and add position control
old_sidebar = 'className="sidebar-desktop"'
new_sidebar = 'className="sidebar-desktop" style={{position:sidebarOpen?"fixed":"relative",left:sidebarOpen?0:-300,zIndex:sidebarOpen?500:undefined,top:0,height:sidebarOpen?"100vh":"auto"}}'
if old_sidebar in c and 'sidebarOpen?"fixed"' not in c:
    c = c.replace(old_sidebar, new_sidebar)
    print('OK sidebar className updated with JS position control')

# FIX 4: Add hamburger button to topbar (find topbar area)
hamburger = """
      {/* Mobile hamburger */}
      <button
        onClick={()=>setSidebarOpen(true)}
        style={{position:'fixed',top:14,left:14,zIndex:501,
          background:'var(--color-primary,#1E3A5F)',border:'none',
          borderRadius:12,width:40,height:40,cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:18,color:'#fff',boxShadow:'0 4px 16px rgba(0,0,0,0.3)'}}
        className="mobile-hamburger">
        ☰
      </button>"""

hamburger_css = '\n      .mobile-hamburger{display:none}\n      @media(max-width:900px){.mobile-hamburger{display:flex !important}}'

if 'mobile-hamburger' not in c:
    # Add CSS
    c = c.replace(
        '.sidebar-desktop{display:flex !important}',
        '.sidebar-desktop{display:flex !important}' + hamburger_css
    )
    # Add hamburger before the main return content
    c = re.sub(
        r'(<div[^>]*sidebar-desktop[^>]*>)',
        hamburger + r'\n      \1',
        c, count=1
    )
    print('OK hamburger button added')
else:
    print('SKIP hamburger already exists')

# FIX 5: Add overlay when sidebar is open
overlay = """
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={()=>setSidebarOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',
            zIndex:499,display:'block'}}
          className="sidebar-overlay"/>
      )}"""

if 'sidebar-overlay' not in c:
    c = re.sub(
        r'(<div[^>]*sidebar-desktop[^>]*>)',
        overlay + r'\n      \1',
        c, count=1
    )
    print('OK overlay added')

# FIX 6: Add close button inside sidebar
close_btn = """
          <button
            onClick={()=>setSidebarOpen(false)}
            style={{position:'absolute',top:12,right:12,background:'rgba(255,255,255,0.15)',
              border:'none',borderRadius:8,width:28,height:28,color:'#fff',
              fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
            className="sidebar-close-btn">
            ✕
          </button>"""

close_css = '\n      .sidebar-close-btn{display:none}\n      @media(max-width:900px){.sidebar-close-btn{display:flex !important}}'

if 'sidebar-close-btn' not in c:
    c = c.replace(
        '.sidebar-desktop{display:flex !important}',
        '.sidebar-desktop{display:flex !important}' + close_css
    )
    # Add inside sidebar - after first div inside sidebar
    c = re.sub(
        r'(className="sidebar-desktop"[^>]*>)',
        r'\1' + '\n          <div style={{position:"relative"}}>' + close_btn + '\n          </div>',
        c, count=1
    )
    print('OK close button added inside sidebar')

# FIX 7: Remove bottom navigation bar
# Find and remove the fixed bottom nav
bottom_nav_pattern = r"<div style=\{\{position:'fixed',bottom:0,left:0,right:0,zIndex:200,[\s\S]{0,3000}?\}\}[\s\S]{0,200}?</div>\s*</div>"
match = re.search(bottom_nav_pattern, c)
if match:
    c = c[:match.start()] + c[match.end():]
    print('OK bottom nav removed')
else:
    print('SKIP bottom nav pattern not found - trying alternate')
    # Try simpler approach - find the fixed bottom div
    lines = c.split('\n')
    start_line = -1
    for i, l in enumerate(lines):
        if "position:'fixed',bottom:0,left:0,right:0,zIndex:200" in l:
            start_line = i
            break
    if start_line > -1:
        # Find matching closing tags (count open/close divs)
        depth = 0
        end_line = start_line
        for i in range(max(0, start_line-2), len(lines)):
            depth += lines[i].count('<div')
            depth -= lines[i].count('</div>')
            if i > start_line and depth <= 0:
                end_line = i
                break
        # Remove these lines
        new_lines = lines[:max(0,start_line-3)] + lines[end_line+1:]
        c = '\n'.join(new_lines)
        print(f'OK bottom nav removed (lines {start_line} to {end_line})')

# FIX 8: Remove floating action button (bottom:120)
fab_pattern = r"<div style=\{\{position:'fixed',bottom:120,right:24,zIndex:9998,[\s\S]{0,500}?</div>\s*</div>"
match2 = re.search(fab_pattern, c)
if match2:
    c = c[:match2.start()] + c[match2.end():]
    print('OK floating action button removed')
else:
    print('SKIP FAB not found with pattern')

with open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

# FIX 9: Institution topbar - add bell + theme
with open('src/pages/institution/InstitutionDashboard.jsx', 'r', encoding='utf-8') as f:
    inst = f.read()

# Find topbar and add bell if missing
if 'sticky' in inst and ('🔔' not in inst and 'bell' not in inst.lower()):
    inst = inst.replace(
        "style={{background:'linear-gradient(135deg,'+p+','+a+')',\n              border:'none',borderRadius:12,padding:'9px 18px',\n              color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>\n            + New Hall",
        """style={{display:'flex',alignItems:'center',gap:8}}}>
            <button onClick={()=>nav('/mentor-hub/settings')}
              style={{background:'transparent',border:'1px solid '+b,
                borderRadius:10,padding:'7px 12px',color:t,fontSize:13,cursor:'pointer'}}>
              🎨
            </button>
            <button style={{position:'relative',background:'transparent',
              border:'1px solid '+b,borderRadius:10,padding:'7px 12px',
              color:t,fontSize:13,cursor:'pointer'}}>
              🔔
              <span style={{position:'absolute',top:4,right:4,width:7,height:7,
                borderRadius:'50%',background:'#EF4444',border:'1.5px solid '+surf}}/>
            </button>
            <button onClick={()=>nav('/institution/halls')}
              style={{background:'linear-gradient(135deg,'+p+','+a+')',
                border:'none',borderRadius:12,padding:'9px 18px',
                color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              + New Hall"""
    )
    with open('src/pages/institution/InstitutionDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(inst)
    print('OK institution bell + theme added')
else:
    print('SKIP institution bell (already has or pattern not found)')

print('\nDone! Run: npm run build')
