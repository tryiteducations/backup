import re

with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# ONLY fix: Add sidebarOpen state + make sidebar work on mobile
# Find if useState is already imported
has_useState = 'useState' in c

# Step 1: Add sidebarOpen state near top of main component
# Find the main dashboard component
main_comp = 'export default function'
idx = c.find(main_comp)
# Find first { after export default function
brace = c.find('{', idx)
# Add state right after opening brace
if 'sidebarOpen' not in c:
    insert = '\n  const [sidebarOpen, setSidebarOpen] = useState(false)'
    c = c[:brace+1] + insert + c[brace+1:]
    print('OK sidebarOpen added')

# Step 2: Fix sidebar CSS - on mobile show when sidebarOpen
# Replace the media query that hides sidebar
old_hide = '.sidebar-desktop{display:none !important}'
new_hide = """.sidebar-desktop{position:fixed !important;left:-280px !important;z-index:500;transition:left 0.3s ease}
      .sidebar-open .sidebar-desktop{left:0 !important}"""
if old_hide in c and 'sidebar-open' not in c:
    c = c.replace(old_hide, new_hide)
    print('OK sidebar CSS fixed')

# Step 3: Apply sidebar-open class to root div when open
# Find the outermost div return
old_root = 'return (\n    <div '
new_root = 'return (\n    <div '
# Find the className on the outer div
c = re.sub(
    r'(return \(\s*\n\s*<div\b)',
    r'return (\n    <div className={sidebarOpen?"sidebar-open":""}',
    c, count=1
)
print('OK root div class added')

# Step 4: Add overlay
overlay_code = """{sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',
            zIndex:499}} />
      )}"""

# Add just before sidebar-desktop
if 'sidebar-overlay' not in c and 'sidebar-desktop' in c:
    c = c.replace(
        'className="sidebar-desktop"',
        'className="sidebar-desktop"',
        1  # just verify it exists
    )
    # Find location before sidebar
    sidebar_idx = c.find('className="sidebar-desktop"')
    # Go back to find the parent div
    pre = c[:sidebar_idx].rfind('\n')
    c = c[:pre+1] + '      ' + overlay_code + '\n' + c[pre+1:]
    print('OK overlay added')

# Step 5: Add hamburger to topbar CSS show/hide
ham_css = """
      .mobile-ham{display:none}
      @media(max-width:900px){.mobile-ham{display:flex !important}}"""
if 'mobile-ham' not in c:
    c = c.replace('.sidebar-open .sidebar-desktop', ham_css + '\n      .sidebar-open .sidebar-desktop')

# Step 6: Find topbar and add hamburger button
ham_btn = """<button onClick={()=>setSidebarOpen(true)}
              className="mobile-ham"
              style={{background:'var(--color-primary,#1E3A5F)',border:'none',
                borderRadius:10,width:38,height:38,color:'#fff',fontSize:20,
                cursor:'pointer',alignItems:'center',justifyContent:'center',
                flexShrink:0,marginRight:4}}>
              ☰
            </button>"""

if 'mobile-ham' in c and 'setSidebarOpen(true)' not in c:
    # Find topbar - look for sticky position near top of return
    topbar_match = re.search(r"(position:'sticky',top:0,zIndex:1\d\d)", c)
    if topbar_match:
        # Find the next child div after this
        after = topbar_match.end()
        next_child = c.find('<', after)
        c = c[:next_child] + ham_btn + '\n            ' + c[next_child:]
        print('OK hamburger added')

with open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
