// src/pages/student/StudentClassroom.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const SECTIONS = [
  {icon:'📄',title:'PDF Library',desc:'Previous year papers, notes, shortcuts',path:'/classroom/pdf',count:'2,400+ files'},
  {icon:'📅',title:'Study Planner',desc:'Personalized weekly schedule',path:'/classroom/planner',count:'Auto-schedule'},
  {icon:'📚',title:'eBook Store',desc:'Digital books for all major exams',path:'/ebooks',count:'500+ books'},
  {icon:'🎯',title:'Topic Tests',desc:'Chapter-wise practice tests',path:'/student/test',count:'10,000+ tests'},
  {icon:'📊',title:'My Analytics',desc:'Performance trends & weak areas',path:'/student/analytics',count:'Live data'},
  {icon:'🔖',title:'Bookmarks',desc:'Saved questions & notes',path:'/student/bookmarks',count:'Quick access'},
]

export default function StudentClassroom() {
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
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>📚 Classroom</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Study materials · PDFs · Planner</p>
        </div>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{background:`linear-gradient(135deg,${p},${p}bb)`,borderRadius:18,
          padding:'18px',marginBottom:20,display:'flex',gap:16,alignItems:'center'}}>
          <div style={{fontSize:40}}>🎓</div>
          <div>
            <p style={{color:'#fff',fontWeight:800,fontSize:15,margin:'0 0 4px'}}>Your Study Hub</p>
            <p style={{color:'rgba(255,255,255,0.7)',fontSize:12,margin:0}}>
              All your materials, plans and progress in one place
            </p>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
          {SECTIONS.map((s,i)=>(
            <div key={i} onClick={()=>nav(s.path)}
              style={{background:c,border:`1px solid ${b}`,borderRadius:16,padding:'18px',
                cursor:'pointer',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=a;e.currentTarget.style.transform='translateY(-3px)';
                e.currentTarget.style.boxShadow=`0 8px 24px ${a}15`}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=b;e.currentTarget.style.transform='translateY(0)';
                e.currentTarget.style.boxShadow='none'}}>
              <div style={{fontSize:30,marginBottom:10}}>{s.icon}</div>
              <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 4px'}}>{s.title}</p>
              <p style={{color:m,fontSize:11,margin:'0 0 8px',lineHeight:1.5}}>{s.desc}</p>
              <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                padding:'2px 10px',borderRadius:20}}>{s.count}</span>
            </div>
          ))}
        </div>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
