// src/pages/institution/InstitutionDashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  {icon:'🏠', label:'Dashboard',   path:'/institution'},
  {icon:'🏛️', label:'Halls',       path:'/institution/halls'},
  {icon:'👨‍🏫', label:'Mentors',     path:'/institution/mentors'},
  {icon:'📚', label:'Homework',    path:'/institution/homework'},
  {icon:'📋', label:'Exam Board',  path:'/exam-board'},
  {icon:'👥', label:'Students',    path:'/institution/students'},
  {icon:'💰', label:'Revenue',     path:'/institution/revenue'},
  {icon:'🇮🇳', label:'Bharat Pulse',path:'/bharat-pulse'},
  {icon:'⚙️', label:'Settings',    path:'/institution/settings'},
]

const STATS = [
  {icon:'🏛️', label:'Active Halls',    val:'4',     color:'#3B82F6'},
  {icon:'👨‍🎓', label:'Total Students',  val:'875',   color:'#22C55E'},
  {icon:'👨‍🏫', label:'Mentors',         val:'6',     color:'#8B5CF6'},
  {icon:'📝', label:'Exams This Month', val:'12',    color:'var(--color-accent, #F59E0B)'},
  {icon:'📚', label:'Homework Pending', val:'3',     color:'#EF4444'},
  {icon:'💰', label:'Revenue (Month)',  val:'₹42,500', color:'#22C55E'},
]

const HALLS = [
  {id:1, name:'UPSC Morning Batch', exam:'UPSC CSE', mentors:2, students:240, fee:500, feeType:'per_hall', active:true},
  {id:2, name:'SSC CGL Evening',    exam:'SSC CGL',  mentors:1, students:180, fee:300, feeType:'per_hall', active:true},
  {id:3, name:'Class 10 Science',   exam:'School Board', mentors:1, students:35, fee:0, feeType:'free', active:true},
  {id:4, name:'TNPSC Tamil Nadu',   exam:'TNPSC Group 1', mentors:2, students:420, fee:400, feeType:'per_hall', active:true},
]

const RECENT_ACTIVITY = [
  {icon:'📝', text:'Priya R. submitted homework in UPSC Morning Batch', time:'10m ago'},
  {icon:'👤', text:'New student Karthik M. joined SSC CGL Evening',     time:'25m ago'},
  {icon:'📋', text:'Mentor Suresh posted new assignment in Hall 2',     time:'1h ago'},
  {icon:'🎯', text:'UPSC Mock Test completed - 234 students appeared',  time:'3h ago'},
  {icon:'💰', text:'₹15,000 collected from Hall 4 enrollments',         time:'5h ago'},
]

export default function InstitutionDashboard() {
  const nav = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [uploadTab, setUploadTab] = useState('audio')
  const [uploadTitle, setUploadTitle] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploads, setUploads] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900)

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 900)
      if (window.innerWidth >= 900) setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const sidebarJSX = (
    <div style={{
      width:220, background:p, minHeight:'100vh',
      position:'fixed', top:0,
      left: isMobile ? (sidebarOpen ? 0 : -240) : 0,
      zIndex:200, display:'flex', flexDirection:'column',
      transition:'left 0.3s ease',
      boxShadow: isMobile && sidebarOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
    }}>
      <div style={{padding:'18px 16px',
        borderBottom:'1px solid rgba(255,255,255,0.1)',
        display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <p style={{color:a,fontWeight:800,fontSize:13,margin:'0 0 2px'}}>
            🏫 TryIT Institution
          </p>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:10,margin:0}}>
            {user?.name||'Institution Admin'}
          </p>
        </div>
        {isMobile && (
          <button onClick={()=>setSidebarOpen(false)}
            style={{background:'rgba(255,255,255,0.1)',border:'none',
              borderRadius:8,width:28,height:28,color:'#fff',
              fontSize:16,cursor:'pointer'}}>✕</button>
        )}
      </div>

      <div style={{flex:1,padding:'12px 8px',overflowY:'auto'}}>
        {NAV.map((n,i) => {
          const isActive = location.pathname === n.path
          return (
            <button key={i} onClick={()=>{nav(n.path);if(isMobile)setSidebarOpen(false)}}
              style={{width:'100%',display:'flex',alignItems:'center',gap:10,
                padding:'10px 12px',borderRadius:10,border:'none',cursor:'pointer',
                marginBottom:2,textAlign:'left',
                background: isActive?'rgba(255,255,255,0.18)':'transparent',
                color: isActive?'#fff':'rgba(255,255,255,0.72)',
                fontFamily:'Poppins,sans-serif',fontWeight:600,fontSize:13,
                transition:'all 0.15s'}}>
              <span style={{fontSize:17}}>{n.icon}</span>
              <span style={{flex:1}}>{n.label}</span>
              {isActive && <div style={{width:6,height:6,borderRadius:'50%',background:a}}/>}
            </button>
          )
        })}
      </div>

      <div style={{padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
        <p onClick={()=>nav('/student')}
          style={{color:'rgba(255,255,255,0.4)',fontSize:11,cursor:'pointer',
            margin:0,textAlign:'center',fontFamily:'Poppins,sans-serif'}}>
          Switch to student view →
        </p>
      </div>
          <button onClick={()=>nav('/login')}
            style={{width:'100%',marginTop:6,background:'rgba(239,68,68,0.15)',
              border:'1px solid rgba(239,68,68,0.25)',borderRadius:10,
              padding:'8px',color:'#FCA5A5',fontSize:11,
              cursor:'pointer',fontWeight:600,fontFamily:'Poppins,sans-serif'}}>
            Logout
          </button>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif',display:'flex'}}>
      {sidebarJSX}
      {isMobile && sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:199}}/>
      )}

      <div style={{marginLeft: isMobile?0:220, flex:1}}>

        {/* Topbar */}
        <div style={{background:c,borderBottom:'1px solid '+b,padding:'14px 20px',
          display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
          {isMobile && (
            <button onClick={()=>setSidebarOpen(true)}
              style={{background:'transparent',border:'1px solid '+b,
                borderRadius:8,padding:'6px 10px',cursor:'pointer',
                fontSize:18,color:t}}>☰</button>
          )}
          <div style={{flex:1}}>
            <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>
              Institution Dashboard
            </h1>
            <p style={{color:m,fontSize:11,margin:0}}>
              875 students · 4 halls · 6 mentors
            </p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button onClick={()=>nav('/mentor-hub/settings')}
              style={{background:'transparent',border:'1px solid '+b,
                borderRadius:10,padding:'7px 12px',color:t,fontSize:13,cursor:'pointer'}}>
              🎨
            </button>
            <button style={{position:'relative',background:'transparent',
              border:'1px solid '+b,borderRadius:10,padding:'7px 12px',
              color:t,fontSize:13,cursor:'pointer'}}>
              🔔
              <span style={{position:'absolute',top:4,right:4,width:7,height:7,
                borderRadius:'50%',background:'#EF4444',border:'1.5px solid '+c}}/>
            </button>
            <button onClick={()=>nav('/institution/halls')}
              style={{background:'linear-gradient(135deg,'+p+','+a+')',
                border:'none',borderRadius:12,padding:'9px 18px',
                color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              + New Hall
            </button>
          </div>
        </div>

        <div style={{padding:'20px',maxWidth:1100,margin:'0 auto'}}>

          {/* Stats grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',
            gap:10,marginBottom:20}}>
            {STATS.map((s,i)=>(
              <div key={i} style={{background:c,border:'1px solid '+b,
                borderRadius:14,padding:'14px 10px',textAlign:'center',
                boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                <div style={{fontSize:20,marginBottom:6}}>{s.icon}</div>
                <p style={{color:t,fontWeight:800,fontSize:15,margin:'0 0 2px'}}>{s.val}</p>
                <p style={{color:m,fontSize:9,margin:0,lineHeight:1.3}}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:20,marginBottom:20}}>

            {/* Halls overview */}
            <div style={{background:c,border:'1px solid '+b,borderRadius:18,overflow:'hidden'}}>
              <div style={{padding:'14px 16px',borderBottom:'1px solid '+b,
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>🏛️ Halls Overview</p>
                <button onClick={()=>nav('/institution/halls')}
                  style={{background:'transparent',border:'none',color:a,
                    fontSize:12,fontWeight:700,cursor:'pointer'}}>
                  Manage →
                </button>
              </div>
              {HALLS.map((hall,i)=>(
                <div key={i} style={{padding:'12px 16px',borderBottom:'1px solid '+b,
                  display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:36,height:36,borderRadius:10,flexShrink:0,
                    background:'linear-gradient(135deg,'+p+','+a+')',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:16}}>🏛️</div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{color:t,fontWeight:600,fontSize:13,margin:'0 0 2px',
                      overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {hall.name}
                    </p>
                    <div style={{display:'flex',gap:8}}>
                      <span style={{color:m,fontSize:10}}>👨‍🎓 {hall.students}</span>
                      <span style={{color:m,fontSize:10}}>👨‍🏫 {hall.mentors} mentors</span>
                      <span style={{background:a+'15',color:a,fontSize:9,fontWeight:700,
                        padding:'1px 6px',borderRadius:20}}>{hall.exam}</span>
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <p style={{color:hall.feeType==='free'?m:a,
                      fontWeight:700,fontSize:12,margin:'0 0 2px'}}>
                      {hall.feeType==='free'?'Free':'₹'+hall.fee+'/mo'}
                    </p>
                    <span style={{background:'#22C55E15',color:'#22C55E',
                      fontSize:9,fontWeight:700,padding:'1px 6px',borderRadius:20}}>
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div style={{background:c,border:'1px solid '+b,borderRadius:18,overflow:'hidden'}}>
              <div style={{padding:'14px 16px',borderBottom:'1px solid '+b}}>
                <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>
                  ⚡ Recent Activity
                </p>
              </div>
              {RECENT_ACTIVITY.map((act,i)=>(
                <div key={i} style={{padding:'10px 16px',borderBottom:'1px solid '+b,
                  display:'flex',gap:10,alignItems:'flex-start'}}>
                  <span style={{fontSize:16,flexShrink:0}}>{act.icon}</span>
                  <div style={{flex:1}}>
                    <p style={{color:t,fontSize:11,fontWeight:500,margin:'0 0 2px',
                      lineHeight:1.4}}>{act.text}</p>
                    <span style={{color:m,fontSize:9}}>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
            {[
              {icon:'🏛️',label:'Create Hall',   path:'/institution/halls',   color:'#3B82F6'},
              {icon:'👨‍🏫',label:'Add Mentor',   path:'/institution/mentors', color:'#8B5CF6'},
              {icon:'📚',label:'Post Homework', path:'/institution/homework', color:'var(--color-accent, #F59E0B)'},
              {icon:'📋',label:'Schedule Exam', path:'/institution/exams',    color:'#EF4444'},
            ].map((action,i)=>(
              <button key={i} onClick={()=>nav(action.path)}
                style={{background:c,border:'1px solid '+b,borderRadius:16,
                  padding:'18px 12px',cursor:'pointer',textAlign:'center',
                  transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=action.color;
                  e.currentTarget.style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=b;
                  e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{width:44,height:44,borderRadius:12,
                  background:action.color+'15',margin:'0 auto 10px',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:22}}>
                  {action.icon}
                </div>
                <p style={{color:t,fontWeight:700,fontSize:12,margin:0}}>
                  {action.label}
                </p>
              </button>
            ))}
          </div>
          
          {/* -- AUDIO / VIDEO UPLOAD -- */}
          <div style={{background:c,border:'1px solid '+b,borderRadius:18,
            overflow:'hidden',marginTop:20}}>
            <div style={{padding:'14px 16px',borderBottom:'1px solid '+b,
              display:'flex',gap:8}}>
              {['audio','video'].map(tab=>(
                <button key={tab} onClick={()=>setUploadTab(tab)}
                  style={{padding:'7px 18px',border:'none',cursor:'pointer',
                    fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:13,
                    borderRadius:10,
                    background:uploadTab===tab?'linear-gradient(135deg,'+p+','+a+')':'transparent',
                    color:uploadTab===tab?'#fff':m}}>
                  {tab==='audio'?'🎙️ Audio':'🎬 Video'}
                  {tab==='video'&&(
                    <span style={{background:'#8B5CF6',color:'#fff',fontSize:8,
                      fontWeight:700,padding:'1px 6px',borderRadius:10,marginLeft:6}}>
                      Monthly only
                    </span>
                  )}
                </button>
              ))}
              <span style={{marginLeft:'auto',color:m,fontSize:11,alignSelf:'center'}}>
                {uploadTab==='audio'?'Expires in 7 days':'Expires in 48 hours'}
              </span>
            </div>
            <div style={{padding:'16px'}}>
              <input value={uploadTitle} onChange={e=>setUploadTitle(e.target.value)}
                placeholder={uploadTab==='audio'?'Audio title e.g. UPSC Polity Lecture 5':'Video title e.g. SSC Maths shortcuts'}
                style={{width:'100%',padding:'10px 12px',borderRadius:10,
                  border:'1.5px solid '+b,background:bg,color:t,
                  fontSize:13,outline:'none',fontFamily:'Poppins,sans-serif',
                  boxSizing:'border-box',marginBottom:10}}/>
              <div style={{border:'2px dashed '+(
                (uploadTab==='audio'?audioFile:videoFile)?a:b),
                borderRadius:12,padding:'20px',textAlign:'center',
                cursor:'pointer',background:bg,marginBottom:10}}
                onClick={()=>document.getElementById('inst-upload-'+uploadTab).click()}>
                <input id={'inst-upload-'+uploadTab} type="file"
                  accept={uploadTab==='audio'?'audio/*':'video/*'}
                  style={{display:'none'}}
                  onChange={e=>{
                    const f=e.target.files[0]
                    uploadTab==='audio'?setAudioFile(f):setVideoFile(f)
                  }}/>
                <div style={{fontSize:28,marginBottom:6}}>
                  {uploadTab==='audio'?'🎙️':'🎬'}
                </div>
                {(uploadTab==='audio'?audioFile:videoFile)?(
                  <p style={{color:a,fontWeight:700,fontSize:13,margin:0}}>
                    {(uploadTab==='audio'?audioFile:videoFile).name}
                  </p>
                ):(
                  <p style={{color:m,fontSize:12,margin:0}}>
                    Tap to select {uploadTab} file
                  </p>
                )}
              </div>
              <button
                onClick={async()=>{
                  const f=uploadTab==='audio'?audioFile:videoFile
                  if(!f||!uploadTitle.trim()) return
                  setUploading(true)
                  await new Promise(r=>setTimeout(r,1200))
                  const exp=new Date(Date.now()+(uploadTab==='audio'?7:2)*24*60*60*1000)
                  setUploads(prev=>[{
                    id:Date.now(),title:uploadTitle,type:uploadTab,
                    size:(f.size/1024/1024).toFixed(1)+'MB',
                    expires:exp.toLocaleDateString('en-IN'),
                    downloads:0,
                  },...prev])
                  setUploading(false);setUploadTitle('')
                  setAudioFile(null);setVideoFile(null)
                }}
                disabled={!(uploadTab==='audio'?audioFile:videoFile)||!uploadTitle.trim()||uploading}
                style={{width:'100%',
                  background:((uploadTab==='audio'?audioFile:videoFile)&&uploadTitle.trim()&&!uploading)
                    ?'linear-gradient(135deg,'+p+','+a+')':b,
                  border:'none',borderRadius:12,padding:'12px',
                  color:((uploadTab==='audio'?audioFile:videoFile)&&uploadTitle.trim())
                    ?'#fff':m,
                  fontWeight:700,fontSize:13,cursor:'pointer'}}>
                {uploading?'Uploading...':uploadTab==='audio'?'🎙️ Upload Audio':'🎬 Upload Video'}
              </button>
            </div>
            {uploads.length>0&&(
              <div style={{borderTop:'1px solid '+b,padding:'12px 16px'}}>
                {uploads.map((u,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',
                    gap:8,padding:'8px 0',borderBottom:i<uploads.length-1?'1px solid '+b:'none'}}>
                    <span style={{fontSize:18}}>{u.type==='audio'?'🎙️':'🎬'}</span>
                    <div style={{flex:1}}>
                      <p style={{color:t,fontWeight:600,fontSize:12,margin:'0 0 2px'}}>{u.title}</p>
                      <p style={{color:m,fontSize:10,margin:0}}>{u.size} · Expires {u.expires}</p>
                    </div>
                    <span style={{color:'#22C55E',fontSize:11,fontWeight:700}}>
                      {u.downloads} downloads
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{height:40}}/>
        </div>
      </div>
    </div>
  )
}
