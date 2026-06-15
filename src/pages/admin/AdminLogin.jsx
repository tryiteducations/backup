import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [err,   setErr]   = useState('')

  const login = () => {
    if (email === 'admin@tryit.com' && pass === 'admin123') {
      localStorage.setItem('tryit_admin', 'true')
      navigate('/admin/dashboard')
    } else {
      setErr('Invalid credentials')
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg,#071428,var(--color-primary-dark, #0F2140))', padding:20 }}>
      <div style={{ background:'rgba(255,255,255,0.95)', borderRadius:24, padding:36,
        width:'100%', maxWidth:380, boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28 }}>
            <span style={{ color:'var(--color-primary, #1E3A5F)' }}>TRY</span><span style={{ color:'var(--color-accent, #D4AF37)' }}>IT</span>
          </div>
          <p style={{ color:'#DC2626', fontWeight:700, fontSize:14, marginTop:6 }}>🔐 Admin Access Only</p>
        </div>
        {[
          { label:'Email', val:email, set:setEmail, type:'email', ph:'admin@tryit.com' },
          { label:'Password', val:pass, set:setPass, type:'password', ph:'••••••••' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontWeight:600, color:'var(--color-primary, #1E3A5F)', fontSize:13, marginBottom:5 }}>
              {f.label}
            </label>
            <input value={f.val} type={f.type} placeholder={f.ph}
              onChange={e=>f.set(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}
              style={{ width:'100%', padding:'11px 14px', borderRadius:12,
                border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:14, outline:'none', boxSizing:'border-box' }}
              onFocus={e=>e.target.style.borderColor='var(--color-accent, #D4AF37)'}
              onBlur={e=>e.target.style.borderColor='var(--color-border, #E2E8F0)'}
            />
          </div>
        ))}
        {err && <p style={{ color:'var(--color-error, #EF4444)', fontSize:13, marginBottom:10 }}>{err}</p>}
        <button onClick={login} style={{
          width:'100%', padding:14, borderRadius:12, border:'none',
          background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))',
          fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15,
          color:'#fff', cursor:'pointer',
        }}>Login to Admin →</button>
        <p style={{ textAlign:'center', color:'#94A3B8', fontSize:11, marginTop:12 }}>
          ⚠️ Dev credentials: admin@tryit.com / admin123
        </p>
      </div>
    </div>
  )
}
