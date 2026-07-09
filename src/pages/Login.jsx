// FILE: src/pages/Login.jsx
// TryIT - Real phone-based login via reverse-SMS verification (zero cost -
// the user sends a code to your Exotel number using their own SMS app).
// Route: /login

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, onboardingKey } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { realAuth, generateRegistrationCode } from '../lib/realAuth'
import Logo from '../components/Logo'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user } = useAuth()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'

  const [step, setStep] = useState('phone') // phone | verify | done
  const [phone, setPhone] = useState('')
  const [code] = useState(() => generateRegistrationCode())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const redirectTo = location.state?.from || '/role-select'

  useEffect(() => {
    if (user) {
      const done = localStorage.getItem(onboardingKey(user.email || user.phone || ''))
      const ROLE_HOME = { student: '/student', mentor: '/mentor-hub', institution: '/institution', family: '/family' }
      navigate(done ? (ROLE_HOME[user.role] || '/student') : '/onboarding')
    }
  }, [user, navigate])

  const submitPhone = () => {
    const clean = phone.replace(/\D/g, '').slice(-10)
    if (!/^\d{10}$/.test(clean)) { setError('Enter a valid 10-digit phone number.'); return }
    setError('')
    setStep('verify')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(`REG-${code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const confirmSent = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await login(phone, code, 'sms')
      if (result.error) { setError(result.error); setLoading(false); return }
      // useEffect above handles the redirect once `user` updates
    } catch (err) {
      setError(err.message || 'Verification failed - please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:32,maxWidth:400,width:'100%'}}>
        <div style={{textAlign:'center',marginBottom:24}}><Logo size={40}/></div>

        {step === 'phone' && (
          <>
            <p style={{color:t,fontWeight:800,fontSize:18,margin:'0 0 6px',textAlign:'center'}}>Welcome back</p>
            <p style={{color:m,fontSize:13,margin:'0 0 20px',textAlign:'center'}}>Enter your phone number to continue</p>
            <input value={phone} onChange={e=>setPhone(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && submitPhone()}
              placeholder="10-digit mobile number" type="tel"
              style={{width:'100%',padding:'14px 16px',borderRadius:12,border:`1.5px solid ${b}`,
                fontSize:15,boxSizing:'border-box',marginBottom:12,textAlign:'center',letterSpacing:'1px'}}/>
            {error && <p style={{color:'#DC2626',fontSize:12,marginBottom:12,textAlign:'center'}}>{error}</p>}
            <button onClick={submitPhone}
              style={{width:'100%',background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
                padding:'14px',color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer'}}>
              Continue →
            </button>
          </>
        )}

        {step === 'verify' && (
          <>
            <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 6px',textAlign:'center'}}>Verify it's you</p>
            <p style={{color:m,fontSize:12,margin:'0 0 18px',textAlign:'center',lineHeight:1.6}}>
              Using your phone's own messaging app, send this exact text to the number below:
            </p>
            <div style={{background:`${p}0a`,border:`1.5px dashed ${p}40`,borderRadius:14,padding:16,marginBottom:14,textAlign:'center'}}>
              <p style={{color:m,fontSize:10,margin:'0 0 4px'}}>SEND THIS MESSAGE</p>
              <p style={{fontFamily:'monospace',fontWeight:800,fontSize:18,color:p,letterSpacing:'1px',margin:'0 0 10px'}}>
                REG-{code}
              </p>
              <p style={{color:m,fontSize:10,margin:'0 0 4px'}}>TO THIS NUMBER</p>
              <p style={{fontFamily:'monospace',fontWeight:800,fontSize:16,color:t}}>
                {realAuth.verificationNumber || 'Not configured yet'}
              </p>
            </div>
            <button onClick={copyCode}
              style={{width:'100%',background:'transparent',border:`1px solid ${b}`,borderRadius:10,
                padding:'9px',color:m,fontWeight:600,fontSize:12,cursor:'pointer',marginBottom:12}}>
              {copied ? '✓ Copied' : '📋 Copy message text'}
            </button>
            {error && <p style={{color:'#DC2626',fontSize:12,marginBottom:12,textAlign:'center'}}>{error}</p>}
            <button onClick={confirmSent} disabled={loading}
              style={{width:'100%',background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
                padding:'14px',color:'#fff',fontWeight:700,fontSize:14,cursor:loading?'wait':'pointer',marginBottom:10}}>
              {loading ? 'Verifying...' : "I've sent it - Verify →"}
            </button>
            <button onClick={()=>setStep('phone')}
              style={{width:'100%',background:'transparent',border:'none',color:m,fontSize:12,cursor:'pointer'}}>
              ← Use a different number
            </button>
          </>
        )}
      </div>
    </div>
  )
}
