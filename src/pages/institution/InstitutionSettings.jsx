// src/pages/institution/InstitutionSettings.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { THEME_LIST } from '../../lib/themes'
import { supabase } from '../../lib/supabase'
import { updateProfile } from '../../lib/studentLib'

function generateJoinCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars (0/O, 1/I)
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `TRYIT-${code}`
}

export default function InstitutionSettings() {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  const { theme, setActiveTheme } = useTheme()
  const p=theme?.primary||'#1E3A5F',a=theme?.accent||'#C9A84C'
  const t=theme?.text||'#1E293B',m=theme?.textLight||'#64748B'
  const bg=theme?.background||'#F8FAFC',c=theme?.surface||'#FFFFFF'
  const b=theme?.border||'#E2E8F0'
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [logoUrl, setLogoUrl] = useState(null)
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    supabase.from('profiles').select('institution_join_code').eq('id', user.id).single()
      .then(async ({ data }) => {
        if (data?.institution_join_code) {
          setJoinCode(data.institution_join_code)
        } else {
          const code = generateJoinCode()
          await updateProfile(user.id, { institution_join_code: code }).catch(() => {})
          setJoinCode(code)
        }
      })
      .catch(() => setJoinCode(generateJoinCode())) // display-only fallback if column doesn't exist yet
  }, [user?.id])

  const copyCode = () => {
    navigator.clipboard.writeText(joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    if (logout) logout()
    nav('/login')
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogoUrl(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/institution')} style={{background:'transparent',
          border:'1px solid '+b,borderRadius:10,padding:'6px 14px',
          color:m,fontSize:13,cursor:'pointer',fontWeight:600}}>← Back</button>
        <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>⚙️ Institution Settings</h1>
        <button onClick={async()=>{setSaved(true);await new Promise(r=>setTimeout(r,1000));setSaved(false)}}
          style={{marginLeft:'auto',
            background:saved?'#22C55E':'linear-gradient(135deg,'+p+','+a+')',
            border:'none',borderRadius:12,padding:'9px 20px',
            color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
          {saved?'✓ Saved':'Save'}
        </button>
      </div>
      <div style={{padding:'20px',maxWidth:640,margin:'0 auto'}}>

        {/* Student Join Code */}
        <div style={{background:`${p}08`,border:`1.5px solid ${p}30`,borderRadius:16,padding:18,marginBottom:20}}>
          <p style={{color:t,fontWeight:800,fontSize:14,margin:'0 0 4px'}}>🔑 Your Student Join Code</p>
          <p style={{color:m,fontSize:12,margin:'0 0 12px',lineHeight:1.6}}>
            Share this code with your students. Once they enter it in their own Settings,
            they'll be linked to your institution and can access your test series and halls
            for free - without needing an individual Pro or Ultra subscription.
          </p>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{flex:1,background:c,border:`1.5px dashed ${p}50`,borderRadius:10,
              padding:'12px 16px',fontFamily:'monospace',fontSize:18,fontWeight:800,
              color:p,letterSpacing:'1px',textAlign:'center'}}>
              {joinCode || 'Generating...'}
            </span>
            <button onClick={copyCode} disabled={!joinCode}
              style={{background:copied?'#22C55E':`linear-gradient(135deg,${p},${a})`,
                border:'none',borderRadius:10,padding:'12px 18px',color:'#fff',
                fontWeight:700,fontSize:12,cursor:'pointer',whiteSpace:'nowrap'}}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>


        {/* Institution name */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:16,
          padding:'18px',marginBottom:14}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 12px'}}>Institution Profile</p>

          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
            <div style={{width:64,height:64,borderRadius:16,flexShrink:0,
              background:logoUrl?`url(${logoUrl}) center/cover`:`linear-gradient(135deg,${p},${a})`,
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,color:'#fff'}}>
              {!logoUrl && '🏫'}
            </div>
            <div>
              <input id="logo-upload" type="file" accept="image/*"
                style={{display:'none'}} onChange={handleLogoChange}/>
              <input id="logo-camera" type="file" accept="image/*" capture="environment"
                style={{display:'none'}} onChange={handleLogoChange}/>
              <button onClick={()=>document.getElementById('logo-camera').click()}
                style={{background:a,border:'none',borderRadius:10,padding:'6px 14px',
                  color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer',marginRight:8}}>
                📸 Take Photo
              </button>
              <button onClick={()=>document.getElementById('logo-upload').click()}
                style={{background:a+'15',border:'1px solid '+a+'30',borderRadius:10,padding:'6px 14px',
                  color:a,fontWeight:700,fontSize:12,cursor:'pointer'}}>
                Choose from Gallery
              </button>
            </div>
          </div>

          <label style={{display:'block',color:t,fontWeight:700,fontSize:12,marginBottom:6}}>
            Institution Name
          </label>
          <input value={name} onChange={e=>setName(e.target.value)}
            placeholder="Sri Vidya Academy"
            style={{width:'100%',padding:'11px 14px',borderRadius:12,
              border:'1.5px solid '+b,background:bg,color:t,
              fontSize:14,outline:'none',boxSizing:'border-box'}}/>
        </div>

        {/* Theme selector */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:16,
          padding:'18px',marginBottom:14}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 4px'}}>Dashboard Theme</p>
          <p style={{color:m,fontSize:11,margin:'0 0 14px'}}>9 theme families - light & dark, same as students see</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
            {THEME_LIST.map(th=>(
              <button key={th.id}
                onClick={()=>setActiveTheme&&setActiveTheme(th.id)}
                style={{background:theme?.id===th.id?a+'15':bg,
                  border:'2px solid '+(theme?.id===th.id?a:b),
                  borderRadius:14,padding:'12px 8px',cursor:'pointer',textAlign:'center',
                  transition:'all 0.2s'}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:th.primary,
                  margin:'0 auto 6px',boxShadow:'0 2px 8px '+th.primary+'44'}}/>
                <p style={{color:t,fontSize:9,fontWeight:600,margin:'0 0 2px',lineHeight:1.2}}>
                  {th.emoji} {th.name.split(' ')[0]}
                </p>
                <p style={{color:m,fontSize:8,margin:0}}>{th.isDark?'Dark':'Light'}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div style={{background:c,border:'1px solid '+b,borderRadius:16,
          padding:'18px',marginBottom:14}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 4px'}}>Account</p>
          <p style={{color:m,fontSize:12,margin:'0 0 14px'}}>
            Logged in as {user?.phone||user?.email||'Institution Admin'}
          </p>
          {!confirmLogout ? (
            <button onClick={()=>setConfirmLogout(true)}
              style={{width:'100%',background:'#FEF2F2',
                border:'1px solid #FECACA',borderRadius:12,
                padding:'12px',color:'#EF4444',fontWeight:700,
                fontSize:13,cursor:'pointer'}}>
              🚪 Logout
            </button>
          ) : (
            <div>
              <p style={{color:'#EF4444',fontWeight:600,fontSize:13,margin:'0 0 10px',textAlign:'center'}}>
                Are you sure you want to logout?
              </p>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setConfirmLogout(false)}
                  style={{flex:1,background:'transparent',border:'1px solid '+b,
                    borderRadius:12,padding:'10px',color:m,fontWeight:600,
                    fontSize:13,cursor:'pointer'}}>
                  Cancel
                </button>
                <button onClick={handleLogout}
                  style={{flex:1,background:'#EF4444',border:'none',
                    borderRadius:12,padding:'10px',color:'#fff',fontWeight:700,
                    fontSize:13,cursor:'pointer'}}>
                  Yes, Logout
                </button>
              </div>
            </div>
          )}
        </div>
        <div style={{height:40}}/>
      </div>
    </div>
  )
}
