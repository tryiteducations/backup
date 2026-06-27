import os

def w(path, txt):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(txt)
    print('OK', path)

# ============================================================
# 1. StudentGuruHub
# ============================================================
w('src/pages/student/StudentGuruHub.jsx', """// src/pages/student/StudentGuruHub.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

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
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🤝 GuruHub</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Ask doubts · Get answers from mentors & peers</p>
        </div>
        <button onClick={()=>nav('/guru-hub/post-doubt')} style={{background:`linear-gradient(135deg,${p},${a})`,
          border:'none',borderRadius:12,padding:'10px 18px',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
          + Ask Doubt
        </button>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
          {[{l:'Doubts Answered',v:'1,240',e:'✅'},{l:'Active Mentors',v:'86',e:'👨‍🏫'},{l:'Avg Response',v:'< 2 hrs',e:'⚡'}].map((x,i)=>(
            <div key={i} style={{background:c,border:`1px solid ${b}`,borderRadius:14,padding:'14px',textAlign:'center'}}>
              <div style={{fontSize:22,marginBottom:4}}>{x.e}</div>
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
                cursor:'pointer',textAlign:'center',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=a;e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=b;e.currentTarget.style.transform='translateY(0)'}}>
              <div style={{fontSize:22,marginBottom:4}}>{x.e}</div>
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
""")

# ============================================================
# 2. StudentLaunchpad
# ============================================================
w('src/pages/student/StudentLaunchpad.jsx', """// src/pages/student/StudentLaunchpad.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const TRACKS = [
  {id:'upsc',label:'UPSC Civil Services',icon:'🏛️',days:365,desc:'Complete GS + Optional syllabus'},
  {id:'ssc',label:'SSC CGL / CHSL',icon:'📋',days:180,desc:'Quant, Reasoning, English, GK'},
  {id:'tnpsc',label:'TNPSC Group 1/2/4',icon:'🌿',days:120,desc:'Tamil Nadu state service exams'},
  {id:'banking',label:'IBPS / SBI Banking',icon:'🏦',days:90,desc:'PO, Clerk, SO — all patterns'},
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
""")

# ============================================================
# 3. StudentLaunchpadJoin
# ============================================================
w('src/pages/student/StudentLaunchpadJoin.jsx', """// src/pages/student/StudentLaunchpadJoin.jsx
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
""")

# ============================================================
# 4. StudentCareer
# ============================================================
w('src/pages/student/StudentCareer.jsx', """// src/pages/student/StudentCareer.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const EXAMS = [
  {icon:'🏛️',name:'UPSC Civil Services',match:94,reason:'Strong GK & analytical aptitude',level:'National'},
  {icon:'📋',name:'SSC CGL',match:88,reason:'Excellent in Reasoning & Maths',level:'National'},
  {icon:'🌿',name:'TNPSC Group 1',match:85,reason:'Tamil Nadu background advantage',level:'State'},
  {icon:'🏦',name:'IBPS PO',match:79,reason:'Good quantitative skills',level:'National'},
  {icon:'🚂',name:'RRB NTPC',match:75,reason:'Science & GK strength',level:'National'},
]

export default function StudentCareer() {
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
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🧭 Career AI</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Find the best exam for you</p>
        </div>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{background:`linear-gradient(135deg,${p},${p}cc)`,borderRadius:20,
          padding:'24px',marginBottom:20,textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:8}}>🤖</div>
          <p style={{color:'#fff',fontWeight:800,fontSize:16,margin:'0 0 6px'}}>AI-Powered Exam Match</p>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:12,margin:'0 0 16px'}}>
            Based on your performance, strengths & background
          </p>
          <button onClick={()=>nav('/career-compass')} style={{background:`linear-gradient(135deg,${a},#E8C44A)`,
            border:'none',borderRadius:12,padding:'10px 24px',color:p,fontWeight:800,fontSize:13,cursor:'pointer'}}>
            Take Career Assessment →
          </button>
        </div>
        <p style={{color:t,fontWeight:700,fontSize:14,marginBottom:12}}>Your Top Exam Matches</p>
        {EXAMS.map((e,i)=>(
          <div key={i} style={{background:c,border:`1px solid ${b}`,borderRadius:16,
            padding:'16px',marginBottom:10,display:'flex',alignItems:'center',gap:14,
            cursor:'pointer',transition:'all 0.2s'}}
            onMouseEnter={x=>x.currentTarget.style.borderColor=a}
            onMouseLeave={x=>x.currentTarget.style.borderColor=b}>
            <div style={{fontSize:32,flexShrink:0}}>{e.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <p style={{color:t,fontWeight:700,fontSize:13,margin:0}}>{e.name}</p>
                <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                  padding:'2px 8px',borderRadius:20}}>{e.level}</span>
              </div>
              <p style={{color:m,fontSize:11,margin:'0 0 8px'}}>{e.reason}</p>
              <div style={{height:5,background:`${b}`,borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${e.match}%`,borderRadius:4,
                  background:`linear-gradient(90deg,${p},${a})`}}/>
              </div>
            </div>
            <div style={{textAlign:'center',flexShrink:0}}>
              <p style={{color:a,fontWeight:900,fontSize:18,margin:0}}>{e.match}%</p>
              <p style={{color:m,fontSize:9,margin:0}}>match</p>
            </div>
          </div>
        ))}
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
""")

# ============================================================
# 5. StudentTournament
# ============================================================
w('src/pages/student/StudentTournament.jsx', """// src/pages/student/StudentTournament.jsx
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
""")

# ============================================================
# 6. StudentClassroom
# ============================================================
w('src/pages/student/StudentClassroom.jsx', """// src/pages/student/StudentClassroom.jsx
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
""")

# ============================================================
# 7. StudentPulse
# ============================================================
w('src/pages/student/StudentPulse.jsx', """// src/pages/student/StudentPulse.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const CATS = ['All','Economy','Science','Polity','International','Sports','Environment']
const NEWS = [
  {title:"India's semiconductor mission: 5 fabs to be operational by 2026",
   cat:'Science',exams:['UPSC','SSC','IBPS'],importance:'High',
   relevance:'GS3 Economy, Science & Tech'},
  {title:'RBI keeps repo rate unchanged at 6.5% for 8th consecutive time',
   cat:'Economy',exams:['IBPS','UPSC','SSC'],importance:'High',
   relevance:'GS3 Economy · Banking awareness'},
  {title:'India ranks 39th in Global Innovation Index 2025',
   cat:'Economy',exams:['UPSC','TNPSC'],importance:'Medium',
   relevance:'GS2 Governance, GS3 Economy'},
  {title:'Chandrayaan-4 mission components integration begins at ISRO',
   cat:'Science',exams:['UPSC','SSC','RRB'],importance:'High',
   relevance:'GS3 Science & Technology'},
  {title:'India signs trade deal with 4 ASEAN nations for electronics',
   cat:'International',exams:['UPSC','IBPS'],importance:'Medium',
   relevance:'GS2 International Relations'},
]

export default function StudentPulse() {
  const nav = useNavigate()
  const [cat, setCat] = useState('All')
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'
  const filtered = cat === 'All' ? NEWS : NEWS.filter(n=>n.cat===cat)
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🇮🇳 Bharat Pulse</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Daily current affairs · Exam-mapped</p>
        </div>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,marginBottom:16}}>
          {CATS.map((x,i)=>(
            <button key={i} onClick={()=>setCat(x)}
              style={{background:cat===x?`linear-gradient(135deg,${p},${a})`:`${b}55`,
                border:'none',borderRadius:20,padding:'6px 14px',whiteSpace:'nowrap',
                color:cat===x?'#fff':m,fontWeight:600,fontSize:12,cursor:'pointer',
                transition:'all 0.2s',flexShrink:0}}>
              {x}
            </button>
          ))}
        </div>
        {filtered.map((n,i)=>(
          <div key={i} style={{background:c,border:`1px solid ${b}`,borderRadius:16,
            padding:'16px',marginBottom:10,transition:'all 0.2s',cursor:'pointer'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=a}
            onMouseLeave={e=>e.currentTarget.style.borderColor=b}>
            <div style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:8}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:6,marginBottom:6}}>
                  <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                    padding:'2px 8px',borderRadius:20}}>{n.cat}</span>
                  <span style={{background:n.importance==='High'?'#EF444415':'#F59E0B15',
                    color:n.importance==='High'?'#EF4444':'#F59E0B',
                    fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20}}>{n.importance}</span>
                </div>
                <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 6px',lineHeight:1.5}}>{n.title}</p>
                <p style={{color:m,fontSize:11,margin:'0 0 8px'}}>📚 {n.relevance}</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {n.exams.map((e,j)=>(
                    <span key={j} style={{background:`${p}12`,color:p,fontSize:9,fontWeight:700,
                      padding:'2px 8px',borderRadius:20}}>{e}</span>
                  ))}
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
""")

# ============================================================
# 8. StudentHall
# ============================================================
w('src/pages/student/StudentHall.jsx', """// src/pages/student/StudentHall.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const HALLS = [
  {name:'UPSC Warriors',members:234,level:'Advanced',tag:'UPSC',online:12},
  {name:'SSC Challengers',members:891,level:'Intermediate',tag:'SSC',online:34},
  {name:'Tamil Nadu Toppers',members:456,level:'All levels',tag:'TNPSC',online:18},
  {name:'Banking Blitz Squad',members:312,level:'Beginner',tag:'IBPS',online:9},
]

export default function StudentHall() {
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
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>⚔️ Battle Hall</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Study halls · Live battles · Compete</p>
        </div>
        <button onClick={()=>nav('/hall/create')} style={{background:`linear-gradient(135deg,${p},${a})`,
          border:'none',borderRadius:12,padding:'8px 16px',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>
          + Create Hall
        </button>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
          {[{l:'Active Halls',v:'142',e:'🏛️'},{l:'Students Online',v:'2,840',e:'👥'},{l:'Battles Today',v:'38',e:'⚔️'}].map((x,i)=>(
            <div key={i} style={{background:c,border:`1px solid ${b}`,borderRadius:14,padding:'14px',textAlign:'center'}}>
              <div style={{fontSize:22,marginBottom:4}}>{x.e}</div>
              <p style={{color:t,fontWeight:800,fontSize:15,margin:'0 0 2px'}}>{x.v}</p>
              <p style={{color:m,fontSize:10,margin:0}}>{x.l}</p>
            </div>
          ))}
        </div>
        <div style={{background:`linear-gradient(135deg,${p},${p}cc)`,borderRadius:18,
          padding:'18px',marginBottom:20,display:'flex',gap:12,alignItems:'center'}}>
          <div style={{fontSize:36}}>⚔️</div>
          <div style={{flex:1}}>
            <p style={{color:'#fff',fontWeight:800,fontSize:14,margin:'0 0 4px'}}>Start a Live Battle</p>
            <p style={{color:'rgba(255,255,255,0.7)',fontSize:11,margin:0}}>
              Challenge any student to a 10-question rapid duel
            </p>
          </div>
          <button onClick={()=>nav('/hall')} style={{background:`linear-gradient(135deg,${a},#E8C44A)`,
            border:'none',borderRadius:12,padding:'10px 16px',color:p,fontWeight:700,fontSize:12,cursor:'pointer',flexShrink:0}}>
            Battle →
          </button>
        </div>
        <p style={{color:t,fontWeight:700,fontSize:14,marginBottom:10}}>Popular Halls</p>
        {HALLS.map((h,i)=>(
          <div key={i} onClick={()=>nav('/hall')}
            style={{background:c,border:`1px solid ${b}`,borderRadius:16,padding:'14px 16px',
              marginBottom:8,cursor:'pointer',display:'flex',alignItems:'center',gap:12,
              transition:'all 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=a}
            onMouseLeave={e=>e.currentTarget.style.borderColor=b}>
            <div style={{width:44,height:44,borderRadius:12,background:`${p}15`,
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>🏛️</div>
            <div style={{flex:1}}>
              <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 4px'}}>{h.name}</p>
              <div style={{display:'flex',gap:10}}>
                <span style={{color:m,fontSize:11}}>👥 {h.members}</span>
                <span style={{color:'#22C55E',fontSize:11}}>● {h.online} online</span>
                <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                  padding:'2px 8px',borderRadius:20}}>{h.tag}</span>
              </div>
            </div>
            <button onClick={e=>{e.stopPropagation();nav('/hall')}}
              style={{background:`${p}10`,border:`1px solid ${p}30`,borderRadius:10,
                padding:'6px 14px',color:p,fontWeight:600,fontSize:11,cursor:'pointer',flexShrink:0}}>
              Join
            </button>
          </div>
        ))}
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
""")

# ============================================================
# 9. StudentRank
# ============================================================
w('src/pages/student/StudentRank.jsx', """// src/pages/student/StudentRank.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const MOCK = [
  {rank:1,name:'Priya Suresh',score:98.4,state:'Tamil Nadu',exam:'UPSC'},
  {rank:2,name:'Arjun Mehta',score:97.1,state:'Maharashtra',exam:'SSC CGL'},
  {rank:3,name:'Lakshmi Rajan',score:96.8,state:'Kerala',exam:'UPSC'},
  {rank:4,name:'Kiran Kumar',score:95.2,state:'Karnataka',exam:'IBPS PO'},
  {rank:5,name:'Divya Sharma',score:94.7,state:'Rajasthan',exam:'UPSC'},
  {rank:6,name:'Murugan P',score:93.1,state:'Tamil Nadu',exam:'TNPSC'},
  {rank:7,name:'Sneha Patil',score:92.8,state:'Maharashtra',exam:'SSC CGL'},
  {rank:8,name:'Ravi Verma',score:91.5,state:'UP',exam:'RRB NTPC'},
]
const MEDAL = {1:'🥇',2:'🥈',3:'🥉'}

export default function StudentRank() {
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
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🏆 All-India Ranks</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Live leaderboard · Updated after every test</p>
        </div>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{background:`linear-gradient(135deg,${p},${p}cc)`,borderRadius:18,
          padding:'18px',marginBottom:20,textAlign:'center'}}>
          <p style={{color:a,fontWeight:700,fontSize:11,letterSpacing:'1px',margin:'0 0 4px'}}>YOUR CURRENT RANK</p>
          <p style={{color:'#fff',fontWeight:900,fontSize:36,margin:'0 0 4px'}}>—</p>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:12,margin:'0 0 12px'}}>
            Take a test to appear on the leaderboard
          </p>
          <button onClick={()=>nav('/student/test')} style={{background:`linear-gradient(135deg,${a},#E8C44A)`,
            border:'none',borderRadius:12,padding:'10px 24px',color:p,fontWeight:800,fontSize:13,cursor:'pointer'}}>
            Take a Test →
          </button>
        </div>
        <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,marginBottom:14}}>
          {['All','UPSC','SSC','IBPS','TNPSC','RRB'].map((f,i)=>(
            <button key={i} onClick={()=>setFilter(f)}
              style={{background:filter===f?`linear-gradient(135deg,${p},${a})`:`${b}55`,
                border:'none',borderRadius:20,padding:'6px 14px',
                color:filter===f?'#fff':m,fontWeight:600,fontSize:12,cursor:'pointer',
                flexShrink:0,transition:'all 0.2s'}}>
              {f}
            </button>
          ))}
        </div>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:16,overflow:'hidden'}}>
          {MOCK.filter(r=>filter==='All'||r.exam.includes(filter)).map((r,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',
              borderBottom:`1px solid ${b}`,background:i<3?`${a}05`:'transparent'}}>
              <span style={{width:28,textAlign:'center',fontWeight:900,fontSize:i<3?18:13,
                color:i<3?a:m,flexShrink:0}}>
                {MEDAL[r.rank]||`#${r.rank}`}
              </span>
              <div style={{width:36,height:36,borderRadius:'50%',background:`${p}15`,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontWeight:800,fontSize:13,color:p,flexShrink:0}}>
                {r.name[0]}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{color:t,fontWeight:600,fontSize:13,margin:'0 0 2px',
                  overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</p>
                <span style={{color:m,fontSize:10}}>{r.state} · {r.exam}</span>
              </div>
              <span style={{color:a,fontWeight:800,fontSize:13,flexShrink:0}}>{r.score}%</span>
            </div>
          ))}
        </div>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
""")

# ============================================================
# 10. StudentMentor
# ============================================================
w('src/pages/student/StudentMentor.jsx', """// src/pages/student/StudentMentor.jsx
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
""")

# ============================================================
# 11. StudentProfile (was 0.3 KB - almost empty!)
# ============================================================
w('src/pages/student/StudentProfile.jsx', """// src/pages/student/StudentProfile.jsx
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
  const phone = user?.phone || '—'
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12}}>
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
""")

# ============================================================
# 12. StudentHistory
# ============================================================
w('src/pages/student/StudentHistory.jsx', """// src/pages/student/StudentHistory.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export default function StudentHistory() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>📖 Test History</h1>
      </div>
      <div style={{padding:'20px',maxWidth:600,margin:'0 auto'}}>
        <div style={{background:c,border:`1.5px dashed ${b}`,borderRadius:20,
          padding:'40px 24px',textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:12}}>📝</div>
          <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 8px'}}>No tests taken yet</p>
          <p style={{color:m,fontSize:13,margin:'0 0 20px',lineHeight:1.6}}>
            Start your first test to see your history, scores and performance trends here.
          </p>
          <button onClick={()=>nav('/student/test')} style={{background:`linear-gradient(135deg,${p},${a})`,
            border:'none',borderRadius:14,padding:'12px 28px',
            color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer'}}>
            Take Your First Test →
          </button>
        </div>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
""")

print("")
print("ALL DONE! 12 pages built.")
print("Now run: npm run build")