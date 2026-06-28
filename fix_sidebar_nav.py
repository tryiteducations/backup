with open('src/pages/institution/InstitutionDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# FIX 1: NAV array — only keep routes that actually exist
old_nav = """const NAV = [
  {icon:'🏠', label:'Dashboard',  path:'/institution'},
  {icon:'🏛️', label:'Halls',      path:'/institution/halls'},
  {icon:'👨\u200d🏫', label:'Mentors',    path:'/institution/mentors'},
  {icon:'📚', label:'Homework',   path:'/institution/homework'},
  {icon:'📋', label:'Exams',      path:'/institution/exams'},
  {icon:'👥', label:'Students',   path:'/institution/students'},
  {icon:'💰', label:'Revenue',    path:'/institution/revenue'},
  {icon:'📋', label:'Exam Board',  path:'/exam-board'},
  {icon:'⚙️', label:'Settings',   path:'/institution/settings'},
]"""

new_nav = """const NAV = [
  {icon:'🏠', label:'Dashboard',  path:'/institution'},
  {icon:'🏛️', label:'Halls',      path:'/institution/halls'},
  {icon:'👨‍🏫', label:'Mentors',    path:'/institution/mentors'},
  {icon:'📚', label:'Homework',   path:'/institution/homework'},
  {icon:'📋', label:'Exam Board', path:'/exam-board'},
]"""

if 'label:\'Exams\'' in c or "label:'Exams'" in c:
    # Try to find and replace NAV array
    import re
    c = re.sub(r'const NAV = \[[\s\S]*?\]', new_nav, c, count=1)
    print('OK NAV fixed - only valid routes')
else:
    print('NAV pattern different - manual check needed')

# FIX 2: Remove Student View from footer, keep only Logout
old_footer = """        <div style={{padding:'12px',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
          <button onClick={()=>nav('/student')}
            style={{width:'100%',background:'rgba(255,255,255,0.08)',
              border:'1px solid rgba(255,255,255,0.15)',borderRadius:10,
              padding:'8px',color:'rgba(255,255,255,0.7)',fontSize:11,
              cursor:'pointer',fontWeight:600,fontFamily:'Poppins,sans-serif',
              marginBottom:6}}>
            👤 Student View
          </button>
          <button onClick={()=>nav('/login')}
            style={{width:'100%',background:'rgba(239,68,68,0.15)',
              border:'1px solid rgba(239,68,68,0.25)',borderRadius:10,
              padding:'8px',color:'#FCA5A5',fontSize:11,
              cursor:'pointer',fontWeight:600,fontFamily:'Poppins,sans-serif'}}>
            🚪 Logout
          </button>
        </div>"""

new_footer = """        <div style={{padding:'12px',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
          <button onClick={()=>nav('/login')}
            style={{width:'100%',background:'rgba(239,68,68,0.15)',
              border:'1px solid rgba(239,68,68,0.25)',borderRadius:10,
              padding:'8px',color:'#FCA5A5',fontSize:11,
              cursor:'pointer',fontWeight:600,fontFamily:'Poppins,sans-serif'}}>
            🚪 Logout
          </button>
        </div>"""

if old_footer in c:
    c = c.replace(old_footer, new_footer)
    print('OK Student View removed from footer')
else:
    # Try removing just the student nav p tag
    import re
    c = re.sub(
        r"<p onClick=\{\(\)=>nav\('/student'\)\}[\s\S]*?Switch to student view.*?</p>",
        '', c
    )
    print('OK Student view p tag removed')

# FIX 3: Add theme + bell to topbar
old_topbar_end = """          <button onClick={()=>nav('/institution/halls')}
            style={{background:'linear-gradient(135deg,'+p+','+a+')',
              border:'none',borderRadius:12,padding:'9px 18px',
              color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
            + New Hall
          </button>"""

new_topbar_end = """          <div style={{display:'flex',alignItems:'center',gap:8}}>
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
                borderRadius:'50%',background:'#EF4444',border:'1.5px solid '+c}}/>
            </button>
            <button onClick={()=>nav('/institution/halls')}
              style={{background:'linear-gradient(135deg,'+p+','+a+')',
                border:'none',borderRadius:12,padding:'9px 18px',
                color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              + New Hall
            </button>
          </div>"""

if old_topbar_end in c:
    c = c.replace(old_topbar_end, new_topbar_end)
    print('OK theme + bell added to topbar')
else:
    print('SKIP topbar end pattern not found')

with open('src/pages/institution/InstitutionDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

# FIX 4: Same fixes for MentorHub nav
with open('src/pages/mentor/MentorHub.jsx', 'r', encoding='utf-8') as f:
    hub = f.read()

# Remove Student View button if still present as button
import re
hub = re.sub(
    r"<button onClick=\{\(\)=>nav\('/student'\)\}[\s\S]{0,200}Student View[\s\S]{0,50}</button>",
    '', hub
)
# Remove student view p tag
hub = re.sub(
    r"<p onClick=\{\(\)=>nav\('/student'\)\}[\s\S]*?student view.*?</p>",
    '', hub
)

with open('src/pages/mentor/MentorHub.jsx', 'w', encoding='utf-8') as f:
    f.write(hub)
print('OK MentorHub student view removed')

print('\nDone! Run: npm run build')
