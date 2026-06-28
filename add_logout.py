import re

def add_logout(path, student_pattern):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'Logout' in c:
        print('SKIP already has logout:', path)
        return
    # Find the nav('/student') call in the footer area
    idx = c.rfind("nav('/student')")
    if idx == -1:
        print('NOT FOUND nav student in:', path)
        return
    # Find the end of this block - look for closing </div> after it
    block_end = c.find('</div>', idx)
    if block_end == -1:
        print('NOT FOUND block end in:', path)
        return
    block_end += 6  # include </div>
    logout_btn = """
          <button onClick={()=>nav('/login')}
            style={{width:'100%',marginTop:6,background:'rgba(239,68,68,0.15)',
              border:'1px solid rgba(239,68,68,0.25)',borderRadius:10,
              padding:'8px',color:'#FCA5A5',fontSize:11,
              cursor:'pointer',fontWeight:600,fontFamily:'Poppins,sans-serif'}}>
            Logout
          </button>"""
    c = c[:block_end] + logout_btn + c[block_end:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('OK logout added to:', path)

add_logout('src/pages/mentor/MentorHub.jsx', "nav('/student')")
add_logout('src/pages/institution/InstitutionDashboard.jsx', "nav('/student')")
print('Done')
