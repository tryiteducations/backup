// src/pages/student/StudentLaunchpad.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import ShareButton from '../../components/ShareButton'

const TRACKS = [
  {id:'upsc',label:'UPSC Civil Services',icon:'🏛️',days:365,desc:'Complete GS + Optional syllabus'},
  {id:'ssc',label:'SSC CGL / CHSL',icon:'📋',days:180,desc:'Quant, Reasoning, English, GK'},
  {id:'tnpsc',label:'TNPSC Group 1/2/4',icon:'🌿',days:120,desc:'Tamil Nadu state service exams'},
  {id:'banking',label:'IBPS / SBI Banking',icon:'🏦',days:90,desc:'PO, Clerk, SO - all patterns'},
  {id:'neet',label:'NEET / JEE',icon:'🔬',days:270,desc:'Medical & Engineering entrance'},
  {id:'railway',label:'Railway RRB / NTPC',icon:'🚂',days:90,desc:'Group D, NTPC, ALP tracks'},
]

export default function StudentLaunchpad() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🚀 TryIT Launchpad</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Daily topics · Weekly tests · Personal mentor</p>
        </div>
        <ShareButton headline="I joined TryIT Launchpad" stat="🚀" subLabel="Daily topics, personal mentor" context="Launchpad" emoji="🚀" />
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{background:`linear-gradient(135deg,${p},${p}dd)`,borderRadius:20,
          padding:'24px',marginBottom:24,textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:8}}>🚀</div>
          <h2 style={{color:'#fff',fontWeight:900,fontSize:22,margin:'0 0 8px'}}>Join TryIT Launchpad</h2>
          <p style={{color:'rgba(255,255,255,0.75)',fontSize:13,margin:'0 0 6px'}}>
            Structured daily study plan · Auto-scheduled topics · Weekly mock tests
          </p>
          <p style={{color:a,fontWeight:800,fontSize:16,margin:'0 0 20px'}}>₹79/month · Cancel anytime</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
            {[{e:'📅',l:'Daily Topics'},{e:'📝',l:'Weekly Tests'},{e:'👨‍🏫',l:'Mentor Support'}].map((x,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.08)',borderRadius:12,padding:'12px 8px',textAlign:'center'}}>
                <div style={{fontSize:20,marginBottom:4}}>{x.e}</div>
                <p style={{color:'rgba(255,255,255,0.9)',fontSize:11,fontWeight:600,margin:0}}>{x.l}</p>
              </div>
            ))}
          </div>
          <button onClick={()=>nav('/student/launchpad/join')}
            style={{background:`linear-gradient(135deg,${a},#E8C44A)`,border:'none',borderRadius:14,
              padding:'14px 36px',color:p,fontWeight:900,fontSize:15,cursor:'pointer',
              boxShadow:`0 6px 20px ${a}44`}}>
            Join Launchpad →
          </button>
        </div>
        <p style={{color:t,fontWeight:700,fontSize:15,marginBottom:12}}>Choose Your Track</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
          {TRACKS.map((tr,i)=>(
            <div key={i} onClick={()=>nav('/student/launchpad/join')}
              style={{background:c,border:`1px solid ${b}`,borderRadius:16,padding:'16px',
                cursor:'pointer',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=a;e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=b;e.currentTarget.style.transform='translateY(0)'}}>
              <div style={{fontSize:28,marginBottom:8}}>{tr.icon}</div>
              <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 4px'}}>{tr.label}</p>
              <p style={{color:m,fontSize:11,margin:'0 0 8px',lineHeight:1.5}}>{tr.desc}</p>
              <span style={{background:`${a}15`,color:a,fontSize:10,fontWeight:700,
                padding:'2px 10px',borderRadius:20}}>{tr.days}-day plan</span>
            </div>
          ))}
        </div>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
