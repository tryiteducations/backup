// src/pages/student/StudentGuruHub.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import ShareButton from '../../components/ShareButton'

const CATS = [
  {e:'📐',l:'Mathematics',n:124},{e:'🔬',l:'Science',n:89},
  {e:'🏛️',l:'Polity',n:156},{e:'🌍',l:'Geography',n:78},
  {e:'💡',l:'General Knowledge',n:201},{e:'🧠',l:'Reasoning',n:92},
  {e:'📊',l:'Economy',n:67},{e:'📝',l:'English',n:45},
]
const DOUBTS = [
  {q:'Difference between Fundamental Rights and DPSP?',sub:'Polity',ans:3,t:'2h ago'},
  {q:'How to solve time & work in under 30 seconds?',sub:'Maths',ans:7,t:'4h ago'},
  {q:'Significance of the Preamble explained simply?',sub:'Polity',ans:2,t:'6h ago'},
]

export default function StudentGuruHub() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10,
        boxShadow:`0 4px 24px ${a}18`}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${a}55`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer',
          boxShadow:`0 0 12px ${a}20`,transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 0 18px ${a}40`;e.currentTarget.style.borderColor=a}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 0 12px ${a}20`;e.currentTarget.style.borderColor=`${a}55`}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0,textShadow:`0 0 20px ${a}50`}}>🤝 GuruHub</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Ask doubts · Get answers from mentors & peers</p>
        </div>
        <ShareButton headline="Ask doubts on TryIT GuruHub" stat="🤝" subLabel="Get answers from real mentors" context="GuruHub" emoji="🤝" />
        <button onClick={()=>nav('/guru-hub/post-doubt')} style={{background:`linear-gradient(135deg,${p},${a})`,
          border:'none',borderRadius:12,padding:'10px 18px',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer',
          boxShadow:`0 4px 20px ${a}45`}}>
          + Ask Doubt
        </button>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
          {[{l:'Doubts Answered',v:'1,240',e:'✅'},{l:'Active Mentors',v:'86',e:'👨‍🏫'},{l:'Avg Response',v:'< 2 hrs',e:'⚡'}].map((x,i)=>(
            <div key={i} style={{background:c,border:`1px solid ${b}`,borderRadius:14,padding:'14px',textAlign:'center',
              boxShadow:`0 0 24px ${a}12, 0 2px 8px rgba(0,0,0,0.04)`}}>
              <div style={{fontSize:22,marginBottom:4,filter:`drop-shadow(0 0 6px ${a}60)`}}>{x.e}</div>
              <p style={{color:t,fontWeight:800,fontSize:15,margin:'0 0 2px'}}>{x.v}</p>
              <p style={{color:m,fontSize:10,margin:0}}>{x.l}</p>
            </div>
          ))}
        </div>
        <p style={{color:t,fontWeight:700,fontSize:14,marginBottom:10}}>Browse by Subject</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:8,marginBottom:20}}>
          {CATS.map((x,i)=>(
            <button key={i} onClick={()=>nav('/guru-hub/my-doubts')}
              style={{background:c,border:`1px solid ${b}`,borderRadius:14,padding:'12px 8px',
                cursor:'pointer',textAlign:'center',transition:'all 0.2s',
                boxShadow:`0 0 18px ${a}10`}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=a;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 0 26px ${a}35`}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=b;e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow=`0 0 18px ${a}10`}}>
              <div style={{fontSize:22,marginBottom:4,filter:`drop-shadow(0 0 5px ${a}50)`}}>{x.e}</div>
              <p style={{color:t,fontWeight:600,fontSize:11,margin:'0 0 2px'}}>{x.l}</p>
              <p style={{color:m,fontSize:9,margin:0}}>{x.n} doubts</p>
            </button>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>Recent Doubts</p>
          <button onClick={()=>nav('/guru-hub/my-doubts')} style={{background:'transparent',
            border:'none',color:a,fontSize:12,fontWeight:700,cursor:'pointer'}}>View All →</button>
        </div>
        {DOUBTS.map((r,i)=>(
          <div key={i} onClick={()=>nav('/guru-hub/my-doubts')}
            style={{background:c,border:`1px solid ${b}`,borderRadius:14,padding:'14px 16px',
              cursor:'pointer',marginBottom:8,transition:'all 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=a}
            onMouseLeave={e=>e.currentTarget.style.borderColor=b}>
            <div style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:8}}>
              <p style={{color:t,fontSize:13,fontWeight:600,margin:0,flex:1,lineHeight:1.5}}>{r.q}</p>
              <span style={{background:`${a}18`,color:a,fontSize:9,fontWeight:700,
                padding:'2px 8px',borderRadius:20,flexShrink:0}}>{r.sub}</span>
            </div>
            <span style={{color:m,fontSize:11}}>💬 {r.ans} answers &nbsp;&nbsp; 🕐 {r.t}</span>
          </div>
        ))}
        <div style={{background:`linear-gradient(135deg,${p},${p}cc)`,borderRadius:18,
          padding:'24px',marginTop:20,textAlign:'center'}}>
          <p style={{color:'#fff',fontWeight:800,fontSize:15,margin:'0 0 6px'}}>Have a doubt? 🤔</p>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:12,margin:'0 0 14px'}}>
            Get answers from verified mentors within 2 hours
          </p>
          <button onClick={()=>nav('/guru-hub/post-doubt')}
            style={{background:`linear-gradient(135deg,${a},#E8C44A)`,border:'none',borderRadius:12,
              padding:'10px 24px',color:p,fontWeight:800,fontSize:13,cursor:'pointer'}}>
            Ask a Doubt →
          </button>
        </div>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
