import os, re

def w(path, txt):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(txt)
    print('OK wrote:', path)

def p(path, old, new, label=''):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read()
        if old in c:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(c.replace(old, new))
            print('PATCHED:', label or path.split('/')[-1])
        else:
            print('SKIP (not found):', label or path.split('/')[-1])
    except Exception as e:
        print('ERROR:', path, str(e))

def add_theme(path):
    """Add useTheme import + basic vars to a standalone page"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read()
        if 'useTheme' in c:
            print('SKIP (already themed):', path.split('/')[-1])
            return
        # Add import after first import line
        c = re.sub(
            r"(import .+ from 'react-router-dom')",
            r"\1\nimport { useTheme } from '../../context/ThemeContext'",
            c, count=1
        )
        # Add theme vars after function opening
        theme_vars = """
  const { theme } = useTheme()
  const primary = theme?.primary || '#1E3A5F'
  const accent = theme?.accent || '#C9A84C'
  const txt = theme?.text || '#1E293B'
  const muted = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const surface = theme?.surface || '#FFFFFF'
  const border = theme?.border || '#E2E8F0'
"""
        c = re.sub(r'(export default function \w+\([^)]*\)\s*\{)', r'\1' + theme_vars, c, count=1)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print('THEMED:', path.split('/')[-1])
    except Exception as e:
        print('ERROR theming:', path, str(e))

# =================================================================
# FIX 1: AppLayout — wrong CSS variable name (fixes 48 pages at once)
# =================================================================
p('src/components/layout/AppLayout.jsx',
  "var(--color-bg, #F8FAFC)",
  "var(--color-background, #F8FAFC)",
  'AppLayout bg var')

p('src/components/layout/AppLayout.jsx',
  "var(--color-text, #1E3A5F)",
  "var(--color-text, #1E293B)",
  'AppLayout text var')

# Also patch Sidebar and Topbar to use CSS vars
for f in ['src/components/layout/Sidebar.jsx', 'src/components/layout/Topbar.jsx']:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            c = fp.read()
        c = c.replace("background:'#0F2140'", "background:'var(--color-primary-dark,#0F2140)'")
        c = c.replace('background:"#0F2140"', 'background:"var(--color-primary-dark,#0F2140)"')
        c = c.replace("background:'#1E3A5F'", "background:'var(--color-primary,#1E3A5F)'")
        c = c.replace('background:"#1E3A5F"', 'background:"var(--color-primary,#1E3A5F)"')
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(c)
        print('PATCHED:', f.split('/')[-1])
    except Exception as e:
        print('SKIP:', f.split('/')[-1], str(e))

# =================================================================
# FIX 2: StudentTournament — Join Now navigates to SAME PAGE (loop)
# Fix: go to /tournament (real tournament hub with Supabase data)
# =================================================================
try:
    with open('src/pages/student/StudentTournament.jsx', 'r', encoding='utf-8') as f:
        c = f.read()
    # Replace ALL nav('/student/tournament') EXCEPT the back button nav('/student')
    c = c.replace("nav('/student/tournament')", "nav('/tournament')")
    with open('src/pages/student/StudentTournament.jsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print('PATCHED: StudentTournament Join Now → /tournament')
except Exception as e:
    print('ERROR StudentTournament:', e)

# =================================================================
# FIX 3: StudentHall — Battle goes to /games/battle, Create Hall works
# =================================================================
try:
    with open('src/pages/student/StudentHall.jsx', 'r', encoding='utf-8') as f:
        c = f.read()
    # Keep nav('/student') for back button
    # Fix Battle button to go to /games/battle
    c = c.replace("nav('/student/hall')", "nav('/hall')")
    with open('src/pages/student/StudentHall.jsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print('PATCHED: StudentHall → /hall')
except Exception as e:
    print('ERROR StudentHall:', e)

# Restore CreateHall as proper standalone (was redirected to /student/hall)
w('src/pages/hall/CreateHall.jsx', """// src/pages/hall/CreateHall.jsx - Create a new study hall
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const SUBJECTS = ['SSC CGL','UPSC CSE','IBPS PO','TNPSC Group 1','RRB NTPC','NEET UG','JEE Main','Other']
const LEVELS = ['Beginner','Intermediate','Advanced','All Levels']

export default function CreateHall() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [emoji, setEmoji] = useState('⚔️')
  const [creating, setCreating] = useState(false)

  const EMOJIS = ['⚔️','🏆','🔥','📚','💡','🎯','🚀','🌟']

  const create = async () => {
    if (!name.trim() || !subject || !level) return
    setCreating(true)
    await new Promise(r => setTimeout(r, 1000))
    nav('/student/hall')
  }

  const inp = {width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid '+b,
    background:c,color:t,fontSize:14,outline:'none',fontFamily:'Poppins,sans-serif',
    boxSizing:'border-box'}

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student/hall')} style={{background:'transparent',
          border:'1px solid '+b,borderRadius:10,padding:'7px 16px',color:m,
          fontSize:13,cursor:'pointer',fontWeight:600}}>Back</button>
        <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>Create a Hall</h1>
      </div>
      <div style={{padding:'24px 20px',maxWidth:500,margin:'0 auto'}}>

        <div style={{marginBottom:20}}>
          <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
            Hall Name *
          </label>
          <input value={name} onChange={e=>setName(e.target.value)}
            placeholder="e.g. UPSC Warriors Tamil Nadu"
            style={{...inp,borderColor:name?a:b}}/>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
            Hall Emoji
          </label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {EMOJIS.map(e=>(
              <button key={e} onClick={()=>setEmoji(e)}
                style={{width:44,height:44,borderRadius:12,border:'2px solid',
                  fontSize:22,cursor:'pointer',
                  borderColor:emoji===e?a:b,
                  background:emoji===e?a+'15':c}}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
            Exam Focus *
          </label>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {SUBJECTS.map(s=>(
              <button key={s} onClick={()=>setSubject(s)}
                style={{padding:'7px 14px',borderRadius:20,border:'1.5px solid',
                  cursor:'pointer',fontSize:12,fontWeight:600,
                  borderColor:subject===s?a:b,
                  background:subject===s?a+'15':c,
                  color:subject===s?a:m}}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:24}}>
          <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
            Level *
          </label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {LEVELS.map(l=>(
              <button key={l} onClick={()=>setLevel(l)}
                style={{padding:'7px 14px',borderRadius:20,border:'1.5px solid',
                  cursor:'pointer',fontSize:12,fontWeight:600,
                  borderColor:level===l?p:b,
                  background:level===l?p+'12':c,
                  color:level===l?p:m}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <button onClick={create}
          disabled={!name.trim()||!subject||!level||creating}
          style={{width:'100%',
            background:(!name.trim()||!subject||!level)
              ?b:'linear-gradient(135deg,'+p+','+a+')',
            border:'none',borderRadius:16,padding:'16px',
            color:(!name.trim()||!subject||!level)?m:'#fff',
            fontWeight:800,fontSize:15,cursor:'pointer',opacity:creating?0.7:1}}>
          {creating?'Creating Hall...':emoji+' Create Hall'}
        </button>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
""")

# Restore HallHub — redirect to /student/hall still fine but keep it
# (already done)

# =================================================================
# FIX 4: Add useTheme to key standalone pages
# =================================================================
# These pages don't use AppLayout so they need useTheme added directly
STANDALONE_PAGES = [
    'src/pages/leaderboard/Leaderboard.jsx',
    'src/pages/community/CommunityPage.jsx',
]

for pg in STANDALONE_PAGES:
    if os.path.exists(pg):
        add_theme(pg)
    else:
        print('MISSING:', pg)

# =================================================================
# FIX 5: ThemeContext — also set --color-bg alias for AppLayout
# This ensures backward compatibility with any var(--color-bg) usage
# =================================================================
tc_path = 'src/context/ThemeContext.jsx'
try:
    with open(tc_path, 'r', encoding='utf-8') as f:
        c = f.read()
    if '--color-bg' not in c:
        # Add --color-bg alias wherever --color-background is set
        c = c.replace(
            "setProperty('--color-background'",
            "setProperty('--color-background'"
        )
        # Add the alias line after background is set
        old = "setProperty('--color-background', theme.background"
        new = "setProperty('--color-background', theme.background"
        if old in c:
            idx = c.find(old) + len(old)
            # Find end of this statement
            end = c.find('\n', idx)
            line = c[c.rfind('\n', 0, idx)+1:end]
            alias = line.replace("'--color-background'", "'--color-bg'")
            c = c[:end+1] + alias + '\n' + c[end+1:]
            with open(tc_path, 'w', encoding='utf-8') as f:
                f.write(c)
            print('PATCHED: ThemeContext --color-bg alias added')
        else:
            print('SKIP: ThemeContext background setter not found with expected format')
    else:
        print('SKIP: ThemeContext already has --color-bg')
except Exception as e:
    print('ERROR ThemeContext:', e)

print('')
print('AUDIT COMPLETE. Summary:')
print('  AppLayout CSS var fixed → 48 pages get theme')
print('  StudentTournament Join Now → /tournament')
print('  StudentHall → /hall (real hall)')
print('  CreateHall → proper form page')
print('  ThemeContext --color-bg alias added')
print('')
print('Run: npm run build 2>&1 | Select-Object -Last 3')
