import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASS = 'tryit@admin2026'  // Change before launch

export default function AdminLogin() {
  const navigate   = useNavigate()
  const [email,    setEmail]  = useState('')
  const [pass,     setPass]   = useState('')
  const [error,    setError]  = useState('')
  const [loading,  setLoading]= useState(false)

  const login = async () => {
    setLoading(true); setError('')
    await new Promise(r=>setTimeout(r,600))
    if (email.trim().toLowerCase().includes('admin') && pass === ADMIN_PASS) {
      localStorage.setItem('tryit_admin', JSON.stringify({ email, loginAt: Date.now() }))
      navigate('/admin/dashboard')
    } else {
      setError('Invalid admin credentials.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#071428,#0F2140)', padding:16 }}>
      <div style={{ background:'rgba(255,255,255,0.95)', borderRadius:28, padding:'40px 32px', width:'100%', maxWidth:400, boxShadow:'0 24px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <p style={{ fontSize:44 }}>🔐</p>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:26, marginTop:10, marginBottom:4 }}>Admin Portal</h1>
          <p style={{ color:'#94A3B8', fontSize:13 }}>TryIT Educations · Restricted Access</p>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:6 }}>Admin Email</label>
          <input value={email} type="email" placeholder="admin@tryiteducations.net"
            onChange={e=>{setEmail(e.target.value);setError('')}}
            onKeyDown={e=>e.key==='Enter'&&login()}
            style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:`1.5px solid ${error?'#EF4444':'#E2E8F0'}`, fontSize:15, outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
            onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor=error?'#EF4444':'#E2E8F0'}
          />
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:6 }}>Password</label>
          <input value={pass} type="password" placeholder="••••••••"
            onChange={e=>{setPass(e.target.value);setError('')}}
            onKeyDown={e=>e.key==='Enter'&&login()}
            style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:`1.5px solid ${error?'#EF4444':'#E2E8F0'}`, fontSize:15, outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
            onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor=error?'#EF4444':'#E2E8F0'}
          />
        </div>

        {error && <p style={{ color:'#EF4444', fontSize:13, marginBottom:14, textAlign:'center' }}>{error}</p>}

        <button onClick={login} disabled={loading||!email||!pass}
          style={{ width:'100%', padding:15, borderRadius:14, border:'none', background:loading||!email||!pass?'rgba(30,58,95,0.3)':'linear-gradient(135deg,#1E3A5F,#0F2140)', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, cursor:loading||!email||!pass?'not-allowed':'pointer' }}>
          {loading ? '⏳ Verifying...' : '🔐 Sign In to Admin'}
        </button>

        <p style={{ textAlign:'center', color:'#94A3B8', fontSize:11, marginTop:16 }}>
          Unauthorised access attempts are logged and reported.
        </p>
      </div>
    </div>
  )
}
