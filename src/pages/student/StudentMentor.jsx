// src/pages/student/StudentMentor.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const MENTORS = [
  {name:'Dr. Kavitha Rajan',exam:'UPSC',subject:'GS & Essay',rating:4.9,students:234,lang:'Tamil, English',exp:'8 yrs'},
  {name:'Suresh Menon',exam:'SSC CGL',subject:'Reasoning & Maths',rating:4.8,students:189,lang:'English, Hindi',exp:'5 yrs'},
  {name:'Priya Chandran',exam:'TNPSC',subject:'Tamil & Polity',rating:4.9,students:312,lang:'Tamil',exp:'6 yrs'},
  {name:'Ramesh Kumar',exam:'IBPS',subject:'Banking & Economy',rating:4.7,students:156,lang:'Hindi, English',exp:'4 yrs'},
]

export default function StudentMentor() {
  const nav = useNavigate()
  const [filter, setFilter] = useState('All')
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
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>👨‍🏫 Find a Mentor</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Verified experts · Your language · Your exam</p>
        </div>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,marginBottom:16}}>
          {['All','UPSC','SSC','IBPS','TNPSC'].map((f,i)=>(
            <button key={i} onClick={()=>setFilter(f)}
              style={{background:filter===f?`linear-gradient(135deg,${p},${a})`:`${b}55`,
                border:'none',borderRadius:20,padding:'6px 14px',
                color:filter===f?'#fff':m,fontWeight:600,fontSize:12,cursor:'pointer',
                flexShrink:0,transition:'all 0.2s'}}>
              {f}
            </button>
          ))}
        </div>
        {MENTORS.filter(x=>filter==='All'||x.exam.includes(filter)).map((me,i)=>(
          <div key={i} style={{background:c,border:`1px solid ${b}`,borderRadius:18,
            padding:'18px',marginBottom:12,transition:'all 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=a}
            onMouseLeave={e=>e.currentTarget.style.borderColor=b}>
            <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${p},${a})`,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontWeight:900,fontSize:20,color:'#fff',flexShrink:0}}>
                {me.name[0]}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                  <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>{me.name}</p>
                  <span style={{color:'#F59E0B',fontWeight:700,fontSize:13}}>★ {me.rating}</span>
                </div>
                <p style={{color:m,fontSize:12,margin:'0 0 6px'}}>{me.subject} · {me.exam} · {me.exp}</p>
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}>
                  <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                    padding:'2px 8px',borderRadius:20}}>{me.exam}</span>
                  <span style={{background:`${p}10`,color:p,fontSize:9,fontWeight:700,
                    padding:'2px 8px',borderRadius:20}}>🌐 {me.lang}</span>
                  <span style={{background:'#22C55E15',color:'#22C55E',fontSize:9,fontWeight:700,
                    padding:'2px 8px',borderRadius:20}}>👥 {me.students} students</span>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',
                    borderRadius:10,padding:'8px 18px',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>
                    Connect
                  </button>
                  <button style={{background:'transparent',border:`1px solid ${b}`,
                    borderRadius:10,padding:'8px 14px',color:m,fontWeight:600,fontSize:12,cursor:'pointer'}}>
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
