import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0) // 0=logo, 1=tagline, 2=done

  useEffect(() => {
    // Check if already logged in
    const email = localStorage.getItem('tryit_email')
    const onboarded = localStorage.getItem('onboarding_done')

    const t1 = setTimeout(() => setPhase(1), 700)
    const t2 = setTimeout(() => setPhase(2), 1800)
    const t3 = setTimeout(() => {
      if (email && onboarded) navigate('/dashboard', { replace:true })
      else if (email)         navigate('/onboarding', { replace:true })
      else                    navigate('/landing',  { replace:true })
    }, 2400)

    return () => [t1,t2,t3].forEach(clearTimeout)
  }, [navigate])

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
      {/* Animated logo */}
      <div style={{ textAlign:'center', opacity:phase>=0?1:0, transform:phase>=0?'scale(1)':'scale(0.8)', transition:'all 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ fontSize:64, marginBottom:8, animation:'logoFloat 2s ease-in-out infinite' }}>⚡</div>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:44, color:'#fff', letterSpacing:-1 }}>
          TRY<span style={{ color:'#D4AF37' }}>IT</span>
        </p>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, letterSpacing:'6px', marginTop:4 }}>EDUCATIONS</p>
      </div>

      {/* Tagline */}
      <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14, marginTop:28, fontFamily:'Poppins,sans-serif', fontWeight:500, opacity:phase>=1?1:0, transform:phase>=1?'translateY(0)':'translateY(12px)', transition:'all 0.5s ease 0.3s' }}>
        Your Exam. Your Rank. Your Success.
      </p>

      {/* Loading bar */}
      <div style={{ width:120, height:2, background:'rgba(255,255,255,0.1)', borderRadius:1, marginTop:48, overflow:'hidden', opacity:phase>=1?1:0, transition:'opacity 0.5s' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,#D4AF37,#E8C44A)', borderRadius:1, animation:'splashBar 1.6s ease-in-out 0.5s forwards', width:'0%' }}/>
      </div>

      <style>{`
        @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes splashBar { 0%{width:0%} 100%{width:100%} }
      `}</style>
    </div>
  )
}
