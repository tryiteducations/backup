// TARGET_FILE: src/pages/Login.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ROLES = [
  { id:'student',     emoji:'🎓', label:'Student',    desc:'Prepare for exams'  },
  { id:'mentor',      emoji:'🧑‍🏫', label:'Mentor',     desc:'Teach & earn'       },
  { id:'institution', emoji:'🏫', label:'Institution', desc:'Manage your centre' },
  { id:'family',      emoji:'👨‍👩‍👧', label:'Family Hub',  desc:'Learn together'     },
]

export default function Login() {
  const navigate = useNavigate()
  const [role,  setRole]  = useState('student')
  const [step,  setStep]  = useState('role')
  const [email, setEmail] = useState('')
  const [otp,   setOtp]   = useState(['','','','','',''])
  const [coupon,setCoupon]= useState('')
  const [error, setError] = useState('')
  const emailRef = useRef(null)
  const otpRefs  = useRef([])

  useEffect(() => {
    if (step==='email') setTimeout(()=>emailRef.current?.focus(), 300)
    if (step==='otp')   setTimeout(()=>otpRefs.current[0]?.focus(), 300)
  }, [step])

  const goIn = (emailAddr) => {
  const e = (emailAddr || email).trim().toLowerCase()
  localStorage.setItem('tryit_role',  role)
  localStorage.setItem('tryit_email', e)
  if (coupon.trim()) localStorage.setItem('applied_coupon', coupon.trim().toUpperCase())
  try {
    const grants = JSON.parse(localStorage.getItem('tryit_pro_grants')||'[]')
    const grant  = grants.find(g => g.email.toLowerCase()===e && new Date(g.expiresAt)>new Date())
    if (grant) localStorage.setItem('tryit_active_grant', JSON.stringify(grant))
  } catch {}
  const done = localStorage.getItem('onboarding_done')
  
  if (!done) {
    navigate('/onboarding')
    return
  }
  
  // Role → Dashboard path mapping (same as in Onboarding.jsx)
  const routeMap = {
    student: '/dashboard',
    mentor: '/mentor-hub',
    institution: '/centre/dashboard',
    institute: '/centre/dashboard',   // alias if needed
    family: '/family'
  }
  const target = routeMap[role] || '/dashboard'
  navigate(target)
}

  const googleLogin = () => goIn('google.user@gmail.com')

  const sendOTP = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.'); return
    }
    setStep('otp'); setError('')
  }

  const changeOtp = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const n = [...otp]; n[i] = val; setOtp(n)
    if (val && i < 5) otpRefs.current[i+1]?.focus()
    if (val && i === 5 && n.every(x=>x)) goIn()
  }

  const S = {
    page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#071428,#0F2140,#1E3A5F)', padding:16, position:'relative', overflow:'hidden' },
    card:  { background:'rgba(255,255,255,0.93)', backdropFilter:'blur(24px)', borderRadius:28, padding:'36px 26px', width:'100%', maxWidth:400, boxShadow:'0 24px 80px rgba(0,0,0,0.4)', position:'relative', zIndex:10 },
    title: { textAlign:'center', marginBottom:24 },
    btn:   { width:'100%', padding:14, borderRadius:14, border:'none', background:'linear-gradient(135deg,#D4AF37,#E8C44A)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, color:'#1E3A5F', cursor:'pointer' },
    input: { width:'100%', padding:'13px 16px', borderRadius:14, border:'2px solid #E2E8F0', fontSize:15, outline:'none', background:'#F8FAFC', color:'#1E293B', boxSizing:'border-box', fontFamily:'Poppins,sans-serif' },
  }

  return (
    <div style={S.page}>
      {[300,500,700].map((s,i)=>(
        <div key={i} style={{ position:'absolute', width:s, height:s, borderRadius:'50%', border:`1px solid rgba(212,175,55,${0.06-i*0.015})`, top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }}/>
      ))}

      <div style={S.card}>
        <div style={S.title}>
          <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28 }}>
            <span style={{ color:'#1E3A5F' }}>TRY</span><span style={{ color:'#D4AF37' }}>IT</span>
          </div>
          <div style={{ color:'#94A3B8', fontSize:9, letterSpacing:'4px', marginTop:2 }}>EDUCATIONS</div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:20, color:'#1E293B', marginTop:14, marginBottom:0 }}>
            {step==='role'?'Who are you?':step==='email'?'Enter Email':'Verify OTP'}
          </h2>
        </div>

        {step==='role' && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              {ROLES.map(r=>(
                <button key={r.id} onClick={()=>setRole(r.id)}
                  style={{ padding:'13px 8px', borderRadius:16, border:'none', cursor:'pointer',
                    background: role===r.id?'linear-gradient(135deg,#1E3A5F,#0F2140)':'#F8FAFC',
                    outline: role===r.id?'2px solid #D4AF37':'none',
                    transition:'all 0.2s' }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{r.emoji}</div>
                  <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:12, color:role===r.id?'#D4AF37':'#1E293B' }}>{r.label}</div>
                  <div style={{ fontSize:10, color:role===r.id?'rgba(212,175,55,0.7)':'#94A3B8', marginTop:1 }}>{r.desc}</div>
                </button>
              ))}
            </div>

            <button onClick={googleLogin}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:13, borderRadius:14, border:'2px solid #E2E8F0', background:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, color:'#1E293B', cursor:'pointer', marginBottom:10 }}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{ flex:1, height:1, background:'#E2E8F0' }}/>
              <span style={{ color:'#94A3B8', fontSize:11 }}>or email</span>
              <div style={{ flex:1, height:1, background:'#E2E8F0' }}/>
            </div>

            <button onClick={()=>setStep('email')} style={S.btn}>
              Continue with Email →
            </button>
          </>
        )}

        {step==='email' && (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, background:'rgba(30,58,95,0.06)', borderRadius:12, padding:'10px 14px' }}>
              <span style={{ fontSize:18 }}>{ROLES.find(r=>r.id===role)?.emoji}</span>
              <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:13, flex:1 }}>
                {ROLES.find(r=>r.id===role)?.label}
              </span>
              <button onClick={()=>setStep('role')} style={{ background:'none', border:'none', color:'#D4AF37', cursor:'pointer', fontSize:12, fontWeight:600 }}>Change</button>
            </div>
            <input ref={emailRef} value={email} type="email" placeholder="your@email.com"
              onChange={e=>{setEmail(e.target.value); setError('')}}
              onKeyDown={e=>e.key==='Enter'&&sendOTP()}
              style={{ ...S.input, borderColor:error?'#EF4444':'#E2E8F0', marginBottom:error?6:14 }}
              onFocus={e=>e.target.style.borderColor='#D4AF37'}
              onBlur={e=>e.target.style.borderColor=error?'#EF4444':'#E2E8F0'}
            />
            {error && <p style={{ color:'#EF4444', fontSize:12, marginBottom:10 }}>{error}</p>}
            <button onClick={sendOTP} style={S.btn}>Send OTP →</button>
          </>
        )}

        {step==='otp' && (
          <>
            <p style={{ textAlign:'center', color:'#475569', fontSize:13, marginBottom:14 }}>
              Code sent to <strong style={{ color:'#1E3A5F' }}>{email}</strong>
            </p>
            <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:12 }}>
              {otp.map((d,i)=>(
                <input key={i} ref={el=>otpRefs.current[i]=el}
                  value={d} maxLength={1} inputMode="numeric"
                  onChange={e=>changeOtp(i,e.target.value)}
                  onKeyDown={e=>{
                    if(e.key==='Backspace'&&!d&&i>0) otpRefs.current[i-1]?.focus()
                    if(e.key==='Enter'&&otp.every(x=>x)) goIn()
                  }}
                  style={{ width:42, height:50, textAlign:'center', fontSize:22, fontWeight:700, borderRadius:12, border:`2px solid ${d?'#1E3A5F':'#E2E8F0'}`, background:'#fff', outline:'none', fontFamily:'Poppins,sans-serif', color:'#1E3A5F' }}
                  onFocus={e=>e.target.style.borderColor='#D4AF37'}
                  onBlur={e=>e.target.style.borderColor=d?'#1E3A5F':'#E2E8F0'}
                />
              ))}
            </div>
            <input value={coupon} placeholder="Coupon code? (optional)"
              onChange={e=>setCoupon(e.target.value)}
              style={{ ...S.input, fontSize:13, marginBottom:10 }}
              onFocus={e=>e.target.style.borderColor='#D4AF37'}
              onBlur={e=>e.target.style.borderColor='#E2E8F0'}
            />
            <p style={{ textAlign:'center', color:'#94A3B8', fontSize:11, marginBottom:10 }}>
              💡 Any 6 digits work during testing
            </p>
            <button onClick={()=>goIn()} style={S.btn}>Verify & Enter →</button>
            <button onClick={()=>{setStep('email');setOtp(['','','','','',''])}}
              style={{ width:'100%', background:'none', border:'none', color:'#94A3B8', fontSize:12, marginTop:8, cursor:'pointer' }}>
              ← Change email
            </button>
          </>
        )}
      </div>
    </div>
  )
}
