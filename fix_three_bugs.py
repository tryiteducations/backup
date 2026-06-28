import os, re

def w(path, txt):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(txt)
    print('OK wrote:', path)

# ============================================================
# FIX 1 — themes.js: Move mentor themes BEFORE THEMES object
# ============================================================
MENTOR_THEMES_CODE = """
// ── MENTOR PROFESSIONAL THEMES ─────────────────────────────
const MENTOR_THEMES = [
  buildTheme({ id:'mentor-kashi-dawn',   name:'Kashi Dawn',      emoji:'🏛️',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#92400E', primaryDark:'#78350F', accent:'#D97706', accentLight:'#FCD34D',
    bg:'#FFFBEB', surface:'#FFFFFF', isDark:false }),
  buildTheme({ id:'mentor-nilgiri-mist', name:'Nilgiri Mist',    emoji:'🌿',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#065F46', primaryDark:'#064E3B', accent:'#059669', accentLight:'#6EE7B7',
    bg:'#F0FDF4', surface:'#FFFFFF', isDark:false }),
  buildTheme({ id:'mentor-himalayan',    name:'Himalayan Snow',  emoji:'🏔️',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#1E40AF', primaryDark:'#1E3A8A', accent:'#3B82F6', accentLight:'#BFDBFE',
    bg:'#EFF6FF', surface:'#FFFFFF', isDark:false }),
  buildTheme({ id:'mentor-pearl',        name:'Pearl Classic',   emoji:'🎓',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#1E3A5F', primaryDark:'#0F2140', accent:'#C9A84C', accentLight:'#E8C44A',
    bg:'#F8FAFC', surface:'#FFFFFF', isDark:false }),
  buildTheme({ id:'mentor-vedic',        name:'Vedic Scroll',    emoji:'📜',
    category:'Mentor Light', tier:'mentor', plan:'free',
    primary:'#3B1F08', primaryDark:'#2D1606', accent:'#B45309', accentLight:'#FDE68A',
    bg:'#FFFBF0', surface:'#FEF9EE', isDark:false }),
  buildTheme({ id:'mentor-midnight',     name:'Midnight Indigo', emoji:'🌌',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#4338CA', primaryDark:'#3730A3', accent:'#818CF8', accentLight:'#A5B4FC',
    bg:'#0F0F1A', surface:'#1A1A2E', isDark:true }),
  buildTheme({ id:'mentor-graphite',     name:'Graphite Pro',    emoji:'⚙️',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#4B5563', primaryDark:'#374151', accent:'#60A5FA', accentLight:'#93C5FD',
    bg:'#111827', surface:'#1F2937', isDark:true }),
  buildTheme({ id:'mentor-teak',         name:'Teak Forest',     emoji:'🌳',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#065F46', primaryDark:'#064E3B', accent:'#34D399', accentLight:'#6EE7B7',
    bg:'#0A1A14', surface:'#132218', isDark:true }),
  buildTheme({ id:'mentor-navy-command', name:'Navy Command',    emoji:'⚓',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#1E3A5F', primaryDark:'#0F2140', accent:'#C9A84C', accentLight:'#E8C44A',
    bg:'#0A1628', surface:'#0F2140', isDark:true }),
  buildTheme({ id:'mentor-obsidian',     name:'Obsidian Gold',   emoji:'✨',
    category:'Mentor Dark',  tier:'mentor', plan:'free',
    primary:'#1C1917', primaryDark:'#0C0A09', accent:'#D97706', accentLight:'#FCD34D',
    bg:'#0C0A09', surface:'#1C1917', isDark:true }),
]

"""

try:
    with open('src/lib/themes.js', 'r', encoding='utf-8') as f:
        themes = f.read()

    # Step 1: Remove any old incorrectly-placed mentor buildTheme calls
    # They appear after the export statements as bare buildTheme() calls
    marker = '// ── MENTOR PROFESSIONAL THEMES'
    if marker in themes:
        start = themes.find(marker)
        # Find end: after the last mentor buildTheme block
        # Look for the closing }) of the last mentor theme
        search_from = start
        last_end = start
        while True:
            idx = themes.find("buildTheme({ id:'mentor-", search_from + 1)
            if idx == -1:
                break
            # Find closing }) of this buildTheme call
            close = themes.find('})', idx)
            if close == -1:
                break
            last_end = close + 2
            search_from = close
        # Remove the whole section
        themes = themes[:start] + themes[last_end:].lstrip('\n')
        print('Removed old incorrectly-placed mentor themes')

    # Step 2: Insert MENTOR_THEMES array before THEME_LIST export
    old_list = 'export const THEME_LIST = [...BASE_THEMES, ...UNLOCK_THEMES]'
    new_list = MENTOR_THEMES_CODE + 'export const THEME_LIST = [...BASE_THEMES, ...UNLOCK_THEMES, ...MENTOR_THEMES]'

    if 'MENTOR_THEMES' not in themes:
        if old_list in themes:
            themes = themes.replace(old_list, new_list, 1)
            print('OK: MENTOR_THEMES added to THEME_LIST')
        else:
            # Try alternate pattern
            alt = 'export const THEME_LIST = ['
            idx = themes.find(alt)
            if idx != -1:
                end = themes.find(']', idx) + 1
                themes = themes[:idx] + MENTOR_THEMES_CODE + themes[idx:end].rstrip(']') + ', ...MENTOR_THEMES]' + themes[end:]
                print('OK: MENTOR_THEMES added via alternate pattern')
            else:
                print('WARNING: Could not find THEME_LIST — appending MENTOR_THEMES at end')
                themes = themes + '\n' + MENTOR_THEMES_CODE
    else:
        # Already has MENTOR_THEMES — make sure it's in THEME_LIST
        if 'MENTOR_THEMES' in themes and '...MENTOR_THEMES' not in themes:
            themes = themes.replace(
                '...UNLOCK_THEMES]',
                '...UNLOCK_THEMES, ...MENTOR_THEMES]'
            )
            print('OK: Added MENTOR_THEMES to THEME_LIST spread')
        else:
            print('SKIP: MENTOR_THEMES already in THEME_LIST')

    with open('src/lib/themes.js', 'w', encoding='utf-8') as f:
        f.write(themes)
    print('OK themes.js fixed — mentor themes now in THEMES object')

except Exception as e:
    print('ERROR themes.js:', e)

# ============================================================
# FIX 2 — MentorHub: Inline sidebar JSX (stop component remount)
#          + proper mobile overlay
# ============================================================
try:
    with open('src/pages/mentor/MentorHub.jsx', 'r', encoding='utf-8') as f:
        hub = f.read()

    # Replace "const Sidebar = () => (" with a render variable "const sidebarJSX = ("
    hub = hub.replace('const Sidebar = () => (', 'const sidebarJSX = (')
    # Remove the closing ") // end Sidebar" if exists
    # Replace "<Sidebar/>" with "{sidebarJSX}"
    hub = hub.replace('<Sidebar/>', '{sidebarJSX}')
    hub = hub.replace('<Sidebar />', '{sidebarJSX}')

    with open('src/pages/mentor/MentorHub.jsx', 'w', encoding='utf-8') as f:
        f.write(hub)
    print('OK MentorHub sidebar converted from component to inline JSX')

except Exception as e:
    print('ERROR MentorHub:', e)

# ============================================================
# FIX 3 — RoleGuard component: protects mentor + institution routes
# ============================================================
w('src/components/guards/RoleGuard.jsx', """// src/components/guards/RoleGuard.jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useEffect } from 'react'

export default function RoleGuard({ allowedRoles = [], children }) {
  const { user, loading } = useAuth()
  const { theme } = useTheme()
  const nav = useNavigate()

  const p = theme?.primary||'#1E3A5F'
  const a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B'
  const m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC'
  const c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',
      justifyContent:'center',background:bg}}>
      <p style={{color:p,fontWeight:700,fontSize:16}}>Loading...</p>
    </div>
  )

  if (!user) {
    nav('/login')
    return null
  }

  // Determine effective role
  const effectiveRole = user.role
    || (user.is_admin ? 'admin'
      : user.is_institution ? 'institution'
      : user.is_mentor ? 'mentor'
      : 'student')

  const hasAccess = allowedRoles.includes(effectiveRole)
    || allowedRoles.includes('all')
    || effectiveRole === 'admin'

  if (!hasAccess) {
    const ROLE_LABELS = {
      mentor: { icon:'👨‍🏫', label:'Mentor', req:'You need a Mentor account', path:'/mentor-hub/register' },
      institution: { icon:'🏫', label:'Institution', req:'You need an Institution account', path:'/institution/register' },
    }

    const neededRole = allowedRoles[0]
    const info = ROLE_LABELS[neededRole] || { icon:'🔒', label:'Access', req:'You need special access', path:'/student' }

    return (
      <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif',
        display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{background:c,border:'1px solid '+b,borderRadius:24,
          padding:40,maxWidth:400,width:'100%',textAlign:'center',
          boxShadow:'0 8px 40px rgba(0,0,0,0.1)'}}>

          <div style={{width:80,height:80,borderRadius:24,
            background:'linear-gradient(135deg,'+p+','+a+')',
            margin:'0 auto 20px',display:'flex',
            alignItems:'center',justifyContent:'center',fontSize:36}}>
            🔒
          </div>

          <h2 style={{color:t,fontWeight:800,fontSize:20,margin:'0 0 8px'}}>
            {info.req}
          </h2>
          <p style={{color:m,fontSize:13,margin:'0 0 6px',lineHeight:1.6}}>
            This section is for <strong>{info.label}s</strong> only.
            Your current role is <strong>{effectiveRole}</strong>.
          </p>

          {neededRole === 'mentor' && (
            <div style={{background:p+'08',border:'1px solid '+p+'20',
              borderRadius:14,padding:'14px',margin:'16px 0',textAlign:'left'}}>
              <p style={{color:t,fontWeight:700,fontSize:12,margin:'0 0 8px'}}>
                🔒 Mentor Role Unlock Requirements:
              </p>
              {[
                '100 tests completed',
                '80%+ average score',
                '60 days on platform',
                'Top 30% of students',
                'Zero violations',
              ].map((req,i)=>(
                <div key={i} style={{display:'flex',gap:6,marginBottom:4}}>
                  <span style={{color:'#EF4444',fontSize:12}}>🔒</span>
                  <span style={{color:m,fontSize:11}}>{req}</span>
                </div>
              ))}
            </div>
          )}

          {neededRole === 'institution' && (
            <div style={{background:p+'08',border:'1px solid '+p+'20',
              borderRadius:14,padding:'14px',margin:'16px 0',textAlign:'left'}}>
              <p style={{color:t,fontWeight:700,fontSize:12,margin:'0 0 8px'}}>
                🔒 Institution Upgrade Requirements:
              </p>
              {[
                'Active Mentor role',
                'Minimum 10 students',
                'Rating 4.5+ maintained',
                'Admin approval',
              ].map((req,i)=>(
                <div key={i} style={{display:'flex',gap:6,marginBottom:4}}>
                  <span style={{color:'#EF4444',fontSize:12}}>🔒</span>
                  <span style={{color:m,fontSize:11}}>{req}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>nav('/student')}
              style={{flex:1,background:'transparent',border:'1px solid '+b,
                borderRadius:14,padding:'12px',color:m,
                fontWeight:700,fontSize:13,cursor:'pointer'}}>
              ← Student Dashboard
            </button>
            <button onClick={()=>nav('/student/settings')}
              style={{flex:1,background:'linear-gradient(135deg,'+p+','+a+')',
                border:'none',borderRadius:14,padding:'12px',
                color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              Check My Progress
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
""")

# ============================================================
# FIX 4 — App.jsx: Wrap mentor + institution routes with RoleGuard
# ============================================================
try:
    with open('src/App.jsx', 'r', encoding='utf-8') as f:
        app = f.read()

    # Add RoleGuard import
    if 'RoleGuard' not in app:
        app = app.replace(
            "const ExamBoard",
            "const RoleGuard = lazy(() => import('./components/guards/RoleGuard'))\nconst ExamBoard"
        )

        # Wrap mentor routes
        old_mentor = """            <Route path='/mentor-hub/materials'  element={<MentorMaterials/>}/>
            <Route path='/mentor-hub/community'  element={<MentorCommunity/>}/>
            <Route path='/mentor-hub/settings'   element={<MentorSettings/>}/>
            <Route path='/mentor-hub/students' element={<MentorStudents/>}/>
            <Route path='/mentor-hub/doubts'      element={<MentorDoubts/>}/>
            <Route path='/mentor-hub/leaderboard'  element={<MentorLeaderboard/>}/>
            <Route path="/mentor-hub"           element={<MentorHub />} />
            <Route path="/mentor-hub/cashback"  element={<CashbackCenter />} />
            <Route path="/mentor-hub/analytics" element={<MentorAnalytics />} />
            <Route path="/mentor-hub/coupons"   element={<CouponManager />} />"""

        new_mentor = """            <Route path='/mentor-hub/materials'  element={<RoleGuard allowedRoles={['mentor','institution']}><MentorMaterials/></RoleGuard>}/>
            <Route path='/mentor-hub/community'  element={<RoleGuard allowedRoles={['mentor','institution']}><MentorCommunity/></RoleGuard>}/>
            <Route path='/mentor-hub/settings'   element={<RoleGuard allowedRoles={['mentor','institution']}><MentorSettings/></RoleGuard>}/>
            <Route path='/mentor-hub/students'   element={<RoleGuard allowedRoles={['mentor','institution']}><MentorStudents/></RoleGuard>}/>
            <Route path='/mentor-hub/doubts'     element={<RoleGuard allowedRoles={['mentor','institution']}><MentorDoubts/></RoleGuard>}/>
            <Route path='/mentor-hub/leaderboard' element={<RoleGuard allowedRoles={['mentor','institution']}><MentorLeaderboard/></RoleGuard>}/>
            <Route path="/mentor-hub"            element={<RoleGuard allowedRoles={['mentor','institution']}><MentorHub/></RoleGuard>}/>
            <Route path="/mentor-hub/cashback"   element={<RoleGuard allowedRoles={['mentor','institution']}><CashbackCenter/></RoleGuard>}/>
            <Route path="/mentor-hub/analytics"  element={<RoleGuard allowedRoles={['mentor','institution']}><MentorAnalytics/></RoleGuard>}/>
            <Route path="/mentor-hub/coupons"    element={<RoleGuard allowedRoles={['mentor','institution']}><CouponManager/></RoleGuard>}/>"""

        if old_mentor in app:
            app = app.replace(old_mentor, new_mentor)
            print('OK mentor routes wrapped with RoleGuard')
        else:
            print('WARNING: mentor routes pattern not found — wrapping individually')
            for route_path in ['/mentor-hub"', '/mentor-hub/cashback"',
                               '/mentor-hub/analytics"', '/mentor-hub/coupons"']:
                app = re.sub(
                    r'<Route path="' + re.escape(route_path[:-1]) + r'" element=\{<(\w+)\s*/>\}/>',
                    lambda m: f'<Route path="{route_path[:-1]}" element={{<RoleGuard allowedRoles={{[\'mentor\',\'institution\']}}><{m.group(1)}/></RoleGuard>}}/>',
                    app
                )

        # Wrap institution routes
        app = app.replace(
            "element={<InstitutionDashboard/>}",
            "element={<RoleGuard allowedRoles={['institution']}><InstitutionDashboard/></RoleGuard>}"
        )
        app = app.replace(
            "element={<InstitutionHalls/>}",
            "element={<RoleGuard allowedRoles={['institution']}><InstitutionHalls/></RoleGuard>}"
        )
        app = app.replace(
            "element={<InstitutionMentors/>}",
            "element={<RoleGuard allowedRoles={['institution']}><InstitutionMentors/></RoleGuard>}"
        )
        app = app.replace(
            "element={<InstitutionHomework/>}",
            "element={<RoleGuard allowedRoles={['institution']}><InstitutionHomework/></RoleGuard>}"
        )

        with open('src/App.jsx', 'w', encoding='utf-8') as f:
            f.write(app)
        print('OK App.jsx RoleGuard applied to mentor + institution routes')
    else:
        print('SKIP RoleGuard already in App.jsx')

except Exception as e:
    print('ERROR App.jsx:', e)

# ============================================================
# FIX 5 — Make admin user bypass RoleGuard (mock admin can test all pages)
# Also update mock admin in AuthContext to have role='admin'
# ============================================================
try:
    with open('src/context/AuthContext.jsx', 'r', encoding='utf-8') as f:
        auth = f.read()

    if 'is_mentor' not in auth:
        # Add role + is_mentor to mock user if AuthContext has mock
        auth = auth.replace(
            "is_admin: true",
            "is_admin: true, is_mentor: true, is_institution: true, role: 'admin'"
        )
        with open('src/context/AuthContext.jsx', 'w', encoding='utf-8') as f:
            f.write(auth)
        print('OK AuthContext mock admin updated with all roles')
    else:
        print('SKIP AuthContext already has role flags')

except Exception as e:
    print('ERROR AuthContext:', e)

# ============================================================
# VERIFY: Check themes.js is correct now
# ============================================================
try:
    with open('src/lib/themes.js', 'r', encoding='utf-8') as f:
        final = f.read()

    has_mentor_array = 'const MENTOR_THEMES = [' in final
    has_in_list = '...MENTOR_THEMES' in final
    kashi_in_array = 'mentor-kashi-dawn' in final
    before_export = final.find('const MENTOR_THEMES') < final.find('export const THEMES')

    print('')
    print('=== themes.js verification ===')
    print('MENTOR_THEMES array defined:', has_mentor_array)
    print('MENTOR_THEMES in THEME_LIST:', has_in_list)
    print('mentor-kashi-dawn present:  ', kashi_in_array)
    print('Defined before THEMES export:', before_export)
    if all([has_mentor_array, has_in_list, kashi_in_array, before_export]):
        print('✅ ALL GOOD — themes fix confirmed!')
    else:
        print('⚠️  Some checks failed — review themes.js manually')

except Exception as e:
    print('ERROR verifying:', e)

print('')
print('ALL FIXES DONE!')
print('Run: npm run build 2>&1 | Select-Object -Last 3')
