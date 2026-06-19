// FILE: src/pages/centre/CentreOnboarding.jsx
// TryIT — Institution details form for ALREADY-authenticated users
// Route: /centre/onboarding (reached via RoleSelect, NOT a login screen)
// Distinct from CentreLogin.jsx, which is the standalone entry point
// for institutions arriving via a direct/marketing link with no account yet.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAVY='#1E3A5F', GOLD='#C9A84C'

export default function CentreOnboarding(){
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [centreName,setCentreName]=useState('')
  const [city,setCity]=useState('')
  const [agreed,setAgreed]=useState(false)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')

  const handleSubmit=async()=>{
    if(!centreName.trim()||!city.trim()){ setError('Please fill all fields'); return }
    if(!agreed){ setError('You must agree to the copyright terms to continue'); return }
    setError(''); setLoading(true)
    await updateUser?.({ name:centreName, city, copyright_agreed:true, copyright_agreed_at:new Date().toISOString() })
    setLoading(false)
    navigate('/centre/dashboard')
  }

  return (
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,${NAVY},#0F2140)`,fontFamily:'Inter,sans-serif',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,color:'#fff'}}>
      <p style={{fontSize:40,marginBottom:10}}>🏫</p>
      <h2 style={{fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:20,marginBottom:6,textAlign:'center'}}>Tell us about your institution</h2>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginBottom:24,textAlign:'center'}}>One last step before your dashboard is ready</p>

      <div style={{background:'rgba(255,255,255,0.06)',borderRadius:24,padding:28,width:'100%',maxWidth:400}}>
        <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:4}}>Institution / Centre Name</label>
        <input value={centreName} onChange={e=>setCentreName(e.target.value)} placeholder="e.g. Bright Maths Academy"
          style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.08)',border:'1.5px solid rgba(255,255,255,0.15)',borderRadius:12,color:'#fff',fontSize:14,outline:'none',marginBottom:14,boxSizing:'border-box'}}/>

        <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:4}}>City</label>
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="e.g. Coimbatore"
          style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.08)',border:'1.5px solid rgba(255,255,255,0.15)',borderRadius:12,color:'#fff',fontSize:14,outline:'none',marginBottom:18,boxSizing:'border-box'}}/>

        <div style={{background:'rgba(220,38,38,0.1)',border:'1px solid #EF4444',borderRadius:12,padding:14,marginBottom:16}}>
          <label style={{display:'flex',gap:10,cursor:'pointer',alignItems:'flex-start'}}>
            <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:2,flexShrink:0}}/>
            <span style={{fontSize:11,color:'#FECACA',lineHeight:1.6}}>
              I agree that all questions, materials, and PDFs I upload to TryIT Educations become the
              permanent property of TryIT Educations for educational use. I cannot claim copyright now
              or after leaving the platform. <strong>This agreement is mandatory and irrevocable.</strong>
            </span>
          </label>
        </div>

        {error && <p style={{fontSize:12,color:'#FCA5A5',marginBottom:12}}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{width:'100%',padding:'14px',background:GOLD,color:NAVY,border:'none',borderRadius:14,fontWeight:800,fontSize:15,cursor:'pointer',opacity:loading?0.7:1}}>
          {loading?'Setting up...':'Go to Dashboard →'}
        </button>
      </div>
    </div>
  )
}