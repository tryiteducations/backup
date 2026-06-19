// FILE: src/pages/parent/ParentLogin.jsx
// TryIT — Parent Login (connects to child via student's registration token)
// Route: /parent/login
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAVY='#1E3A5F', GOLD='#C9A84C'

export default function ParentLogin(){
  const navigate = useNavigate()
  const { login, updateUser } = useAuth()
  const [phone,setPhone]=useState('')
  const [childToken,setChildToken]=useState('')
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')

  const handleSubmit=async()=>{
    if(phone.replace(/\D/g,'').length!==10){ setError('Enter a valid phone number'); return }
    setError(''); setLoading(true)
    try{
      await login(`${phone}@parent.tryiteducations.net`,'parent')
      await updateUser?.({ role:'parent', linked_child_token: childToken || null })
      navigate('/family')
    }catch{ setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,#7C3AED,#4C1D95)`,fontFamily:'Inter,sans-serif',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,color:'#fff'}}>
      <div style={{textAlign:'center',marginBottom:28}}>
        <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:28,margin:'0 0 4px'}}><span>Try</span><span style={{color:GOLD}}>IT</span></p>
        <p style={{fontSize:11,color:'rgba(255,255,255,0.6)',letterSpacing:2}}>👨‍👩‍👦 PARENT / FAMILY LOGIN</p>
      </div>

      <div style={{background:'rgba(255,255,255,0.08)',borderRadius:24,padding:28,width:'100%',maxWidth:380}}>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:20,lineHeight:1.6}}>
          Track your child's exam preparation, tournament results, and progress — all in one place.
        </p>

        <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:4}}>Your Phone Number</label>
        <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.1)',border:'1.5px solid rgba(255,255,255,0.2)',borderRadius:12,padding:'12px 14px',marginBottom:14}}>
          <span style={{marginRight:8,color:'rgba(255,255,255,0.6)'}}>+91</span>
          <input maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} placeholder="98765 43210"
            style={{flex:1,background:'none',border:'none',outline:'none',color:'#fff',fontSize:14}}/>
        </div>

        <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:4}}>
          Child's Registration Token <span style={{color:'rgba(255,255,255,0.4)'}}>(optional, link now or later)</span>
        </label>
        <input value={childToken} onChange={e=>setChildToken(e.target.value)} placeholder="Found in their Profile page"
          style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.1)',border:'1.5px solid rgba(255,255,255,0.2)',borderRadius:12,color:'#fff',fontSize:14,outline:'none',marginBottom:20,boxSizing:'border-box'}}/>

        {error && <p style={{fontSize:12,color:'#FCA5A5',marginBottom:12}}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{width:'100%',padding:'14px',background:GOLD,color:NAVY,border:'none',borderRadius:14,fontWeight:800,fontSize:15,cursor:'pointer',opacity:loading?0.7:1}}>
          {loading?'Setting up...':'Continue →'}
        </button>

        <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',textAlign:'center',marginTop:14,lineHeight:1.6}}>
          🔒 Your child's data is only shared with your consent and theirs together
        </p>
      </div>
    </div>
  )
}