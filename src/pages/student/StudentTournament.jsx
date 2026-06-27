// src/pages/student/StudentTournament.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const LIVE = [
  {name:'TNPSC Grand Challenge',participants:8432,prize:'5000🪙',exam:'TNPSC',ends:'2h 14m'},
  {name:'SSC CGL Weekly Blitz',participants:3201,prize:'2000🪙',exam:'SSC',ends:'5h 40m'},
]
const UPCOMING = [
  {name:'UPSC Sunday Showdown',participants:1240,prize:'10000🪙',exam:'UPSC',date:'Tomorrow 10AM'},
  {name:'IBPS Banking Battle',participants:890,prize:'3000🪙',exam:'IBPS',date:'Sunday 2PM'},
  {name:'RRB Railways Rush',participants:2100,prize:'4000🪙',exam:'RRB',date:'Mon 6PM'},
]

export default function StudentTournament() {
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
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🏟️ Tournaments</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Compete live · Win coins · Climb ranks</p>
        </div>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
          <span style={{background:'#EF444415',color:'#EF4444',fontSize:10,fontWeight:700,
            padding:'3px 10px',borderRadius:20}}>🔴 LIVE NOW</span>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>Active Tournaments</p>
        </div>
        {LIVE.map((l,i)=>(
          <div key={i} onClick={()=>nav('/tournament')}
            style={{background:`linear-gradient(135deg,${p}10,${a}08)`,
              border:`1.5px solid ${a}40`,borderRadius:16,padding:'16px',
              marginBottom:10,cursor:'pointer',transition:'all 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div>
                <span style={{background:'#EF444418',color:'#EF4444',fontSize:9,fontWeight:700,
                  padding:'2px 8px',borderRadius:20,display:'inline-block',marginBottom:4}}>🔴 LIVE</span>
                <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>{l.name}</p>
              </div>
              <span style={{color:a,fontWeight:800,fontSize:14}}>{l.prize}</span>
            </div>
            <div style={{display:'flex',gap:16}}>
              <span style={{color:m,fontSize:11}}>👥 {l.participants.toLocaleString()} students</span>
              <span style={{color:m,fontSize:11}}>⏱️ Ends in {l.ends}</span>
              <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                padding:'2px 8px',borderRadius:20}}>{l.exam}</span>
            </div>
            <button onClick={e=>{e.stopPropagation();nav('/tournament')}}
              style={{marginTop:10,background:`linear-gradient(135deg,${a},#E8C44A)`,border:'none',
                borderRadius:10,padding:'8px 20px',color:p,fontWeight:700,fontSize:12,cursor:'pointer'}}>
              Join Now →
            </button>
          </div>
        ))}
        <p style={{color:t,fontWeight:700,fontSize:14,margin:'16px 0 10px'}}>Upcoming Tournaments</p>
        {UPCOMING.map((u,i)=>(
          <div key={i} onClick={()=>nav('/tournament')}
            style={{background:c,border:`1px solid ${b}`,borderRadius:16,padding:'14px 16px',
              marginBottom:8,cursor:'pointer',display:'flex',justifyContent:'space-between',
              alignItems:'center',transition:'all 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=a}
            onMouseLeave={e=>e.currentTarget.style.borderColor=b}>
            <div>
              <p style={{color:t,fontWeight:600,fontSize:13,margin:'0 0 4px'}}>{u.name}</p>
              <span style={{color:m,fontSize:11}}>{u.date} · {u.participants.toLocaleString()} registered</span>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{color:a,fontWeight:800,fontSize:13,margin:'0 0 2px'}}>{u.prize}</p>
              <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                padding:'2px 8px',borderRadius:20}}>{u.exam}</span>
            </div>
          </div>
        ))}
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
