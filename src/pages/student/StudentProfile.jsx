// src/pages/student/StudentProfile.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

export default function StudentProfile() {
  const nav = useNavigate()
  const { user } = useAuth()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'
  const name = user?.user_metadata?.name || user?.phone || 'Student'
  const phone = user?.phone || '-'
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,boxShadow:`0 4px 24px ${a}18`}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>My Profile</h1>
        <button onClick={()=>nav('/student/settings')} style={{marginLeft:'auto',background:'transparent',
          border:`1px solid ${b}`,borderRadius:10,padding:'6px 14px',color:m,fontSize:12,cursor:'pointer'}}>
          Edit ✏️
        </button>
      </div>
      <div style={{padding:'20px',maxWidth:500,margin:'0 auto'}}>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:'24px',
          textAlign:'center',marginBottom:16}}>
          <div style={{width:72,height:72,borderRadius:'50%',margin:'0 auto 12px',
            background:`linear-gradient(135deg,${p},${a})`,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:28,fontWeight:900,color:'#fff'}}>
            {name[0]?.toUpperCase()||'S'}
          </div>
          <p style={{color:t,fontWeight:800,fontSize:20,margin:'0 0 4px'}}>{name}</p>
          <p style={{color:m,fontSize:13,margin:'0 0 16px'}}>{phone}</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {[{l:'Tests',v:'0'},{l:'Streak',v:'0d'},{l:'Coins',v:'0'}].map((x,i)=>(
              <div key={i} style={{background:bg,borderRadius:12,padding:'10px'}}>
                <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 2px'}}>{x.v}</p>
                <p style={{color:m,fontSize:11,margin:0}}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:16,overflow:'hidden'}}>
          {[
            {icon:'⚙️',label:'Settings',path:'/student/settings'},
            {icon:'🎨',label:'Themes',path:'/student/settings'},
            {icon:'📊',label:'Analytics',path:'/student/analytics'},
            {icon:'📖',label:'Test History',path:'/student/test-history'},
            {icon:'🏆',label:'Achievements',path:'/achievements'},
          ].map((item,i)=>(
            <div key={i} onClick={()=>nav(item.path)}
              style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',
                borderBottom:`1px solid ${b}`,cursor:'pointer',transition:'all 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.background=`${a}08`}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{fontSize:18}}>{item.icon}</span>
              <span style={{color:t,fontWeight:600,fontSize:13,flex:1}}>{item.label}</span>
              <span style={{color:m,fontSize:16}}>›</span>
            </div>
          ))}
        </div>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
