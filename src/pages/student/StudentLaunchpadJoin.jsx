// src/pages/student/StudentLaunchpadJoin.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export default function StudentLaunchpadJoin() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12}}>
        <button onClick={()=>nav('/student/launchpad')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>Join Launchpad</h1>
      </div>
      <div style={{padding:'20px',maxWidth:500,margin:'0 auto'}}>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:'24px',marginBottom:16}}>
          <p style={{color:a,fontWeight:700,fontSize:12,letterSpacing:'1px',margin:'0 0 4px'}}>LAUNCHPAD PLAN</p>
          <p style={{color:t,fontWeight:900,fontSize:28,margin:'0 0 4px'}}>₹79 <span style={{fontSize:14,fontWeight:500,color:m}}>/month</span></p>
          <p style={{color:m,fontSize:12,margin:'0 0 16px'}}>Less than ₹3/day · Cancel anytime</p>
          {['Daily structured topic plan','Weekly mock tests with analysis','Personal mentor assignment',
            'Progress tracking & streaks','Priority doubt resolution','Exam-specific study tracks'].map((f,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <span style={{color:'#22C55E',fontSize:16}}>✓</span>
              <span style={{color:t,fontSize:13}}>{f}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>nav('/pricing')} style={{width:'100%',
          background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:16,
          padding:'16px',color:'#fff',fontWeight:800,fontSize:16,cursor:'pointer',
          boxShadow:`0 8px 24px ${p}33`,marginBottom:12}}>
          Subscribe for ₹79/month →
        </button>
        <p style={{color:m,fontSize:11,textAlign:'center',margin:0}}>
          Secure payment · Instant activation · 7-day money-back guarantee
        </p>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
