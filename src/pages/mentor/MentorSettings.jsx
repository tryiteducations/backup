// src/pages/mentor/MentorSettings.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const MENTOR_THEMES = [
  {id:'mentor-pearl',        name:'Pearl Classic',   emoji:'🎓', isDark:false, preview:'#1E3A5F'},
  {id:'mentor-kashi-dawn',   name:'Kashi Dawn',      emoji:'🏛️', isDark:false, preview:'#92400E'},
  {id:'mentor-nilgiri-mist', name:'Nilgiri Mist',    emoji:'🌿', isDark:false, preview:'#065F46'},
  {id:'mentor-himalayan',    name:'Himalayan Snow',  emoji:'🏔️', isDark:false, preview:'#1E40AF'},
  {id:'mentor-vedic',        name:'Vedic Scroll',    emoji:'📜', isDark:false, preview:'#78350F'},
  {id:'mentor-navy-command', name:'Navy Command',    emoji:'⚓', isDark:true,  preview:'#C9A84C'},
  {id:'mentor-midnight',     name:'Midnight Indigo', emoji:'🌌', isDark:true,  preview:'#818CF8'},
  {id:'mentor-graphite',     name:'Graphite Pro',    emoji:'⚙️', isDark:true,  preview:'#60A5FA'},
  {id:'mentor-teak',         name:'Teak Forest',     emoji:'🌳', isDark:true,  preview:'#34D399'},
  {id:'mentor-obsidian',     name:'Obsidian Gold',   emoji:'✨', isDark:true,  preview:'#D97706'},
]

const EXAMS = ['UPSC CSE','SSC CGL','IBPS PO','TNPSC Group 1','RRB NTPC',
  'NEET UG','JEE Main','GATE','NDA','CDS','State PSC','School (1-10)','College']
const LANGS = ['Tamil','Hindi','English','Telugu','Malayalam','Kannada',
  'Bengali','Marathi','Gujarati','Odia','Punjabi','Assamese']

export default function MentorSettings() {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  const handleLogout = () => { if(logout) logout(); nav('/login') }
  const [confirmLogout, setConfirmLogout] = useState(false)
  const { theme, setActiveTheme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [name, setName] = useState(user?.name||'')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [state, setState2] = useState('')
  const [selectedExams, setSelectedExams] = useState([])
  const [selectedLangs, setSelectedLangs] = useState([])
  const [avatar, setAvatar] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [saved, setSaved] = useState(false)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setAvatarUrl(URL.createObjectURL(file))
  }

  const toggleExam = (exam) => {
    setSelectedExams(prev =>
      prev.includes(exam) ? prev.filter(e=>e!==exam) : [...prev, exam]
    )
  }

  const toggleLang = (lang) => {
    setSelectedLangs(prev =>
      prev.includes(lang) ? prev.filter(l=>l!==lang) : [...prev, lang]
    )
  }

  const save = async () => {
    setSaved(true)
    await new Promise(r=>setTimeout(r,1000))
    setSaved(false)
  }

  const inp = {
    width:'100%', padding:'11px 14px', borderRadius:12,
    border:'1.5px solid '+b, background:bg, color:t,
    fontSize:14, outline:'none', fontFamily:'Poppins,sans-serif',
    boxSizing:'border-box'
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/mentor-hub')} style={{background:'transparent',
          border:'1px solid '+b,borderRadius:10,padding:'6px 14px',
          color:m,fontSize:13,cursor:'pointer',fontWeight:600}}>← Back</button>
        <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>
          ⚙️ Settings & Profile
        </h1>
        <button onClick={save}
          style={{marginLeft:'auto',
            background:saved?'#22C55E':'linear-gradient(135deg,'+p+','+a+')',
            border:'none',borderRadius:12,padding:'9px 20px',
            color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
          {saved?'✓ Saved':'Save Changes'}
        </button>
      </div>

      <div style={{padding:'20px',maxWidth:640,margin:'0 auto'}}>

        {/* Profile picture */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:18,
          padding:'20px',marginBottom:16}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 16px'}}>
            Profile Picture
          </p>
          <div style={{display:'flex',alignItems:'center',gap:20}}>
            <div style={{position:'relative'}}>
              <div style={{width:80,height:80,borderRadius:'50%',
                background:'linear-gradient(135deg,'+p+','+a+')',
                backgroundImage:avatarUrl?'url('+avatarUrl+')':'',
                backgroundSize:'cover',backgroundPosition:'center',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontWeight:800,fontSize:28,color:'#fff',
                border:'3px solid '+a,cursor:'pointer'}}
                onClick={()=>document.getElementById('avatar-upload').click()}>
                {!avatarUrl && (name?.[0]||'M')}
              </div>
              <div style={{position:'absolute',bottom:0,right:0,
                width:24,height:24,borderRadius:'50%',
                background:a,display:'flex',alignItems:'center',
                justifyContent:'center',fontSize:12,cursor:'pointer',
                border:'2px solid '+c}}
                onClick={()=>document.getElementById('avatar-upload').click()}>
                📷
              </div>
            </div>
            <input id="avatar-upload" type="file" accept="image/*"
              style={{display:'none'}} onChange={handleAvatarChange}/>
            <div>
              <p style={{color:t,fontWeight:600,fontSize:13,margin:'0 0 4px'}}>
                {name || 'Your Name'}
              </p>
              <p style={{color:m,fontSize:11,margin:'0 0 8px'}}>
                Click the photo to change it
              </p>
              <button onClick={()=>document.getElementById('avatar-upload').click()}
                style={{background:a+'15',border:'1px solid '+a+'30',
                  borderRadius:10,padding:'6px 14px',color:a,
                  fontWeight:700,fontSize:12,cursor:'pointer'}}>
                Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:18,
          padding:'20px',marginBottom:16}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 14px'}}>
            Basic Information
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <label style={{display:'block',color:t,fontWeight:700,fontSize:12,marginBottom:6}}>
                Display Name
              </label>
              <input value={name} onChange={e=>setName(e.target.value)}
                placeholder="Your full name" style={inp}/>
            </div>
            <div>
              <label style={{display:'block',color:t,fontWeight:700,fontSize:12,marginBottom:6}}>
                Bio
              </label>
              <textarea value={bio} onChange={e=>setBio(e.target.value)}
                placeholder="Tell students about your experience, qualifications and teaching style..."
                rows={3}
                style={{...inp,resize:'vertical',lineHeight:1.6}}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,fontSize:12,marginBottom:6}}>
                  City
                </label>
                <input value={city} onChange={e=>setCity(e.target.value)}
                  placeholder="Your city" style={inp}/>
              </div>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,fontSize:12,marginBottom:6}}>
                  State
                </label>
                <input value={state} onChange={e=>setState2(e.target.value)}
                  placeholder="Your state" style={inp}/>
              </div>
            </div>
          </div>
        </div>

        {/* Exam expertise */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:18,
          padding:'20px',marginBottom:16}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 4px'}}>
            Exam Expertise
          </p>
          <p style={{color:m,fontSize:11,margin:'0 0 12px'}}>
            Select all exams you can teach
          </p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {EXAMS.map(exam=>(
              <button key={exam} onClick={()=>toggleExam(exam)}
                style={{padding:'7px 14px',borderRadius:20,border:'1.5px solid',
                  cursor:'pointer',fontSize:12,fontWeight:600,transition:'all 0.15s',
                  borderColor:selectedExams.includes(exam)?a:b,
                  background:selectedExams.includes(exam)?a+'15':bg,
                  color:selectedExams.includes(exam)?a:m}}>
                {exam}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:18,
          padding:'20px',marginBottom:16}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 4px'}}>
            Teaching Languages
          </p>
          <p style={{color:m,fontSize:11,margin:'0 0 12px'}}>
            Languages you can answer doubts in
          </p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {LANGS.map(lang=>(
              <button key={lang} onClick={()=>toggleLang(lang)}
                style={{padding:'7px 14px',borderRadius:20,border:'1.5px solid',
                  cursor:'pointer',fontSize:12,fontWeight:600,transition:'all 0.15s',
                  borderColor:selectedLangs.includes(lang)?p:b,
                  background:selectedLangs.includes(lang)?p+'12':bg,
                  color:selectedLangs.includes(lang)?p:m}}>
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Theme selector */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:18,
          padding:'20px',marginBottom:16}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 4px'}}>
            Dashboard Theme
          </p>
          <p style={{color:m,fontSize:11,margin:'0 0 14px'}}>
            10 professional themes — light & dark
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
            {MENTOR_THEMES.map(th=>(
              <button key={th.id}
                onClick={()=>{ if(setActiveTheme) setActiveTheme(th.id) }}
                style={{background:theme?.id===th.id?a+'15':bg,
                  border:'2px solid '+(theme?.id===th.id?a:b),
                  borderRadius:14,padding:'12px 8px',cursor:'pointer',
                  textAlign:'center',transition:'all 0.2s'}}>
                <div style={{width:32,height:32,borderRadius:'50%',
                  background:th.preview,margin:'0 auto 6px',
                  boxShadow:'0 2px 8px '+th.preview+'44'}}/>
                <p style={{color:t,fontSize:9,fontWeight:600,margin:'0 0 2px',
                  lineHeight:1.2}}>
                  {th.emoji} {th.name.split(' ')[0]}
                </p>
                <p style={{color:m,fontSize:8,margin:0}}>
                  {th.isDark?'Dark':'Light'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Switch to student */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:18,
          padding:'16px 20px',marginBottom:16,
          display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 2px'}}>
              Switch to Student View
            </p>
            <p style={{color:m,fontSize:11,margin:0}}>
              View the platform as a student
            </p>
          </div>
          <button onClick={()=>nav('/student')}
            style={{background:p+'10',border:'1px solid '+p+'30',
              borderRadius:12,padding:'8px 16px',color:p,
              fontWeight:700,fontSize:13,cursor:'pointer'}}>
            Go to Student →
          </button>
        </div>

        
        {/* Logout */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:16,
          padding:'16px 20px',marginBottom:16}}>
          <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 4px'}}>Account</p>
          <p style={{color:m,fontSize:11,margin:'0 0 12px'}}>
            Signed in as {user?.name||user?.phone||'Mentor'}
          </p>
          {!confirmLogout ? (
            <button onClick={()=>setConfirmLogout(true)}
              style={{width:'100%',background:'#FEF2F2',border:'1px solid #FECACA',
                borderRadius:12,padding:'11px',color:'#EF4444',fontWeight:700,
                fontSize:13,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
              🚪 Logout
            </button>
          ) : (
            <div>
              <p style={{color:'#EF4444',fontWeight:600,fontSize:13,
                margin:'0 0 10px',textAlign:'center'}}>
                Are you sure?
              </p>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setConfirmLogout(false)}
                  style={{flex:1,background:'transparent',border:'1px solid '+b,
                    borderRadius:12,padding:'10px',color:m,fontWeight:600,
                    fontSize:13,cursor:'pointer'}}>Cancel</button>
                <button onClick={handleLogout}
                  style={{flex:1,background:'#EF4444',border:'none',
                    borderRadius:12,padding:'10px',color:'#fff',fontWeight:700,
                    fontSize:13,cursor:'pointer'}}>Yes, Logout</button>
              </div>
            </div>
          )}
        </div>
        <div style={{height:40}}/>
      </div>
    </div>
  )
}
