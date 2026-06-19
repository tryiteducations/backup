// FILE: src/pages/parent/ParentOnboarding.jsx
// TryIT — Child-linking form for ALREADY-authenticated users
// Route: /parent/onboarding (reached via RoleSelect, NOT a login screen)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAVY='#1E3A5F', GOLD='#C9A84C'

export default function ParentOnboarding(){
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [childToken,setChildToken]=useState('')
  const [loading,setLoading]=useState(false)

  const handleSubmit=async()=>{
    setLoading(true)
    await updateUser?.({ linked_child_token: childToken.trim() || null })
    setLoading(false)
    navigate('/family')
  }

  return (
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,#7C3AED,#4C1D95)`,fontFamily:'Inter,sans-serif',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,color:'#fff'}}>
      <p style={{fontSize:40,marginBottom:10}}>👨‍👩‍👦</p>
      <h2 style={{fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:20,marginBottom:6,textAlign:'center'}}>Link your child's account</h2>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:24,textAlign:'center',maxWidth:320}}>
        Ask your child to find their Registration Token in Profile → Referral tab, then paste it below.
      </p>

      <div style={{background:'rgba(255,255,255,0.08)',borderRadius:24,padding:28,width:'100%',maxWidth:380}}>
        <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:4}}>
          Child's Registration Token
        </label>
        <input value={childToken} onChange={e=>setChildToken(e.target.value)} placeholder="e.g. TRYITPRIYA"
          style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.1)',border:'1.5px solid rgba(255,255,255,0.2)',borderRadius:12,color:'#fff',fontSize:14,outline:'none',marginBottom:20,boxSizing:'border-box'}}/>

        <button onClick={handleSubmit} disabled={loading}
          style={{width:'100%',padding:'14px',background:GOLD,color:NAVY,border:'none',borderRadius:14,fontWeight:800,fontSize:15,cursor:'pointer',opacity:loading?0.7:1,marginBottom:10}}>
          {loading?'Linking...':'Link & Continue →'}
        </button>

        <button onClick={()=>navigate('/family')}
          style={{width:'100%',padding:'12px',background:'none',color:'rgba(255,255,255,0.6)',border:'none',fontSize:12,cursor:'pointer'}}>
          Skip for now — link later
        </button>

        <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',textAlign:'center',marginTop:10,lineHeight:1.6}}>
          🔒 Your child's data is only shared with mutual consent
        </p>
      </div>
    </div>
  )
}