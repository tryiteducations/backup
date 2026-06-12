import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CentreLogin() {
  const navigate = useNavigate()
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [code,  setCode]    = useState('')
  const [error, setError]   = useState('')

  const login = () => {
    if (!email || !pass) { setError('Enter your email and password.'); return }
    localStorage.setItem('tryit_role', 'institution')
    localStorage.setItem('tryit_email', email.trim().toLowerCase())
    navigate('/centre/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0F2140,#1E3A5F)', padding:16 }}>
      <div style={{ background:'rgba(255,255,255,0.96)', borderRadius:28, padding:'36px 28px', width:'100%', maxWidth:400, boxShadow:'0 24px 80px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <p style={{ fontSize:44 }}>🏫</p>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:24, marginTop:10, marginBottom:4 }}>Institution Login</h1>
          <p style={{ color:'#94A3B8', fontSize:13 }}>Centre Dashboard · Monitor · Conduct Tests</p>
        </div>

        {[['Email Address','email','text',email,setEmail],['Password','password','password',pass,setPass]].map(([l,k,t,v,set])=>(
          <div key={k} style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:6 }}>{l}</label>
            <input value={v} type={t} placeholder={t==='email'?'director@institution.edu':'••••••••'}
              onChange={e=>{set(e.target.value);setError('')}}
              onKeyDown={e=>e.key==='Enter'&&login()}
              style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
              onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}
            />
          </div>
        ))}

        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:6 }}>
            Centre Code <span style={{ color:'#94A3B8', fontWeight:400 }}>(optional — from email)</span>
          </label>
          <input value={code} placeholder="TC-2026-XXXX"
            onChange={e=>setCode(e.target.value)}
            style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'monospace' }}
            onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}
          />
        </div>

        {error && <p style={{ color:'#EF4444', fontSize:13, marginBottom:14 }}>{error}</p>}

        <button onClick={login}
          style={{ width:'100%', padding:14, borderRadius:14, border:'none', background:'linear-gradient(135deg,#1E3A5F,#0F2140)', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, cursor:'pointer', marginBottom:10 }}>
          🏫 Access Centre Dashboard
        </button>
        <button onClick={()=>navigate('/onboarding')}
          style={{ width:'100%', padding:12, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#F8FAFC', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>
          New Institution? Register →
        </button>
      </div>
    </div>
  )
}
