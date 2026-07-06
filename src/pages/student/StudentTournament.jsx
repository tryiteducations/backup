// src/pages/student/StudentTournament.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import ShareButton from '../../components/ShareButton'

const LIVE = [
  {name:'TNPSC Grand Challenge',participants:8432,prize:'5000',exam:'TNPSC',ends:'2h 14m'},
  {name:'SSC CGL Weekly Blitz',participants:3201,prize:'2000',exam:'SSC',ends:'5h 40m'},
]
const UPCOMING = [
  {name:'UPSC Sunday Showdown',participants:1240,prize:'10000',exam:'UPSC',date:'Tomorrow 10AM'},
  {name:'IBPS Banking Battle',participants:890,prize:'3000',exam:'IBPS',date:'Sunday 2PM'},
  {name:'RRB Railways Rush',participants:2100,prize:'4000',exam:'RRB',date:'Mon 6PM'},
]

export default function StudentTournament() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F'
  const a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B'
  const m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC'
  const c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'
  const isDark = theme?.isDark||false

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>

      {/* Header */}
      <div style={{background:p,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10,boxShadow:`0 4px 24px ${a}18`}}>
        <button onClick={()=>nav('/student')} style={{background:'rgba(255,255,255,0.15)',
          border:'1px solid rgba(255,255,255,0.3)',borderRadius:10,padding:'6px 14px',
          color:'#fff',fontSize:13,cursor:'pointer',fontWeight:600}}>
          Back
        </button>
        <div style={{flex:1}}>
          <h1 style={{color:'#fff',fontSize:18,fontWeight:800,margin:0}}>Tournaments</h1>
          <p style={{color:'rgba(255,255,255,0.75)',fontSize:11,margin:0}}>
            Compete live · Win coins · Climb ranks
          </p>
        </div>
        <ShareButton
          headline="Joining a TryIT Tournament"
          stat="🏆"
          subLabel="Compete live, All-India"
          context="Tournament"
          emoji="🏆"
          style={{border:'1px solid rgba(255,255,255,0.3)',color:'#fff'}}
        />
        <div style={{background:'#EF4444',borderRadius:20,padding:'4px 10px',
          display:'flex',alignItems:'center',gap:4}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'#fff',
            animation:'pulse 1.5s infinite'}}/>
          <span style={{color:'#fff',fontSize:10,fontWeight:700}}>LIVE</span>
        </div>
      </div>

      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
          {[{l:'Active Now',v:'2',e:'🏟️'},{l:'Registered',v:'0',e:'✅'},{l:'Results at',v:'8:00 PM',e:'🏆'}]
            .map((s,i)=>(
            <div key={i} style={{background:c,border:'1px solid '+b,borderRadius:14,
              padding:'14px',textAlign:'center'}}>
              <div style={{fontSize:22,marginBottom:4}}>{s.e}</div>
              <p style={{color:t,fontWeight:800,fontSize:15,margin:'0 0 2px'}}>{s.v}</p>
              <p style={{color:m,fontSize:10,margin:0}}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* LIVE section */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'#EF4444',
            animation:'pulse 1.5s infinite'}}/>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>Live Tournaments</p>
        </div>

        {LIVE.map((l,i)=>(
          <div key={i} style={{background:p,border:'2px solid '+a+'50',
            borderRadius:18,padding:'18px',marginBottom:12,cursor:'pointer'}}
            onClick={()=>nav('/tournament')}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>

            <div style={{display:'flex',justifyContent:'space-between',
              alignItems:'flex-start',marginBottom:10}}>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <span style={{background:'#EF444430',color:'#EF4444',fontSize:9,
                    fontWeight:700,padding:'3px 10px',borderRadius:20,
                    border:'1px solid #EF444440'}}>LIVE</span>
                  <span style={{background:a+'25',color:a,fontSize:9,fontWeight:700,
                    padding:'3px 10px',borderRadius:20}}>{l.exam}</span>
                </div>
                <p style={{color:'#fff',fontWeight:800,fontSize:16,margin:'0 0 4px'}}>
                  {l.name}
                </p>
                <div style={{display:'flex',gap:14}}>
                  <span style={{color:'rgba(255,255,255,0.75)',fontSize:12}}>
                    {l.participants.toLocaleString()} students
                  </span>
                  <span style={{color:'rgba(255,255,255,0.75)',fontSize:12}}>
                    Ends in {l.ends}
                  </span>
                </div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <p style={{color:a,fontWeight:900,fontSize:20,margin:'0 0 2px'}}>
                  {l.prize}
                </p>
                <p style={{color:'rgba(255,255,255,0.6)',fontSize:10,margin:0}}>coins prize</p>
              </div>
            </div>

            <button onClick={e=>{e.stopPropagation();nav('/tournament')}}
              style={{background:'linear-gradient(135deg,'+a+',#E8C44A)',
                border:'none',borderRadius:12,padding:'10px 24px',
                color:p,fontWeight:800,fontSize:13,cursor:'pointer',
                boxShadow:'0 4px 16px '+a+'44'}}>
              Join Now
            </button>
          </div>
        ))}

        {/* Upcoming section */}
        <p style={{color:t,fontWeight:700,fontSize:14,margin:'20px 0 12px'}}>
          Upcoming Tournaments
        </p>

        {UPCOMING.map((u,i)=>(
          <div key={i} onClick={()=>nav('/tournament')}
            style={{background:isDark?'rgba(255,255,255,0.08)':c,
              border:'1px solid '+b,borderRadius:16,padding:'16px',
              marginBottom:10,cursor:'pointer',
              display:'flex',justifyContent:'space-between',alignItems:'center',
              transition:'all 0.2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=a;
              e.currentTarget.style.transform='translateX(4px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=b;
              e.currentTarget.style.transform='translateX(0)'}}>
            <div>
              <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 4px'}}>{u.name}</p>
              <span style={{color:m,fontSize:12}}>
                {u.date} · {u.participants.toLocaleString()} registered
              </span>
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <p style={{color:a,fontWeight:800,fontSize:15,margin:'0 0 4px'}}>
                {u.prize}
              </p>
              <span style={{background:p+'15',color:p,fontSize:10,fontWeight:700,
                padding:'2px 8px',borderRadius:20}}>{u.exam}</span>
            </div>
          </div>
        ))}

        <div style={{height:80}}/>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100%{opacity:1;transform:scale(1);}
          50%{opacity:0.5;transform:scale(1.3);}
        }
      `}</style>
    </div>
  )
}
