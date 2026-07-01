// src/pages/exam-board/ExamBoard.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const EXAMS = [
  {
    id:1, name:'UPSC Civil Services Examination 2026',
    body:'Union Public Service Commission', govtType:'central',
    state:'All India', eligibility:'Graduate, Age 21-32',
    appOpen:'2026-02-01', appClose:'2026-03-15',
    examDate:'2026-05-25', resultDate:'2026-09-01',
    officialUrl:'https://upsc.gov.in',
    languages:['English','Hindi'],
    postedBy:'Dr. Kavitha R.', verified:true, thumbsUp:284, pinned:false,
    courses:3, students:1240,
  },
  {
    id:2, name:'TNPSC Group 1 Examination 2026',
    body:'Tamil Nadu Public Service Commission', govtType:'state',
    state:'Tamil Nadu', eligibility:'Graduate, Age 21-42',
    appOpen:'2026-03-01', appClose:'2026-04-10',
    examDate:'2026-07-20', resultDate:'2026-11-01',
    officialUrl:'https://tnpsc.gov.in',
    languages:['Tamil','English'],
    postedBy:'Priya C.', verified:true, thumbsUp:156, pinned:false,
    courses:2, students:890,
  },
  {
    id:3, name:'SSC CGL Tier 1 2026',
    body:'Staff Selection Commission', govtType:'central',
    state:'All India', eligibility:'Graduate, Age 18-32',
    appOpen:'2026-04-01', appClose:'2026-04-30',
    examDate:'2026-07-01', resultDate:'2026-09-15',
    officialUrl:'https://ssc.nic.in',
    languages:['English','Hindi'],
    postedBy:'Suresh M.', verified:true, thumbsUp:312, pinned:false,
    courses:4, students:2100,
  },
  {
    id:4, name:'IBPS PO 2026',
    body:'Institute of Banking Personnel Selection', govtType:'central',
    state:'All India', eligibility:'Graduate, Age 20-30',
    appOpen:'2026-07-01', appClose:'2026-07-21',
    examDate:'2026-10-04', resultDate:'2027-01-15',
    officialUrl:'https://ibps.in',
    languages:['English','Hindi'],
    postedBy:'Ramesh K.', verified:true, thumbsUp:198, pinned:false,
    courses:2, students:760,
  },
  {
    id:5, name:'Kerala PSC Plus Two Level Exam 2026',
    body:'Kerala Public Service Commission', govtType:'state',
    state:'Kerala', eligibility:'+2 / Class 12, Age 18-36',
    appOpen:'2026-05-01', appClose:'2026-05-20',
    examDate:'2026-08-10', resultDate:'2026-12-01',
    officialUrl:'https://keralapsc.gov.in',
    languages:['Malayalam','English'],
    postedBy:'Anjali S.', verified:false, thumbsUp:43, pinned:false,
    courses:1, students:320,
  },
]

function Countdown({ targetDate }) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) return {d:0,h:0,m:0}
    return {
      d: Math.floor(diff/(1000*60*60*24)),
      h: Math.floor((diff%(1000*60*60*24))/(1000*60*60)),
      m: Math.floor((diff%(1000*60*60))/(1000*60)),
    }
  }
  const [time, setTime] = useState(calc())
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 60000)
    return () => clearInterval(t)
  }, [targetDate])
  if (time.d <= 0 && time.h <= 0) return (
    <span style={{color:'#EF4444',fontWeight:700,fontSize:11}}>Today!</span>
  )
  return (
    <span style={{fontWeight:700}}>
      {time.d > 0 && <span>{time.d}d </span>}
      {time.h}h {time.m}m
    </span>
  )
}

const FILTERS = ['All','Central Govt','State Govt','University','School / College']
const SORT_OPTIONS = ['Date (Soonest)','Most Pinned','Most Popular']

export default function ExamBoard() {
  const nav = useNavigate()
  const { user } = useAuth()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [exams, setExams] = useState(EXAMS)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Date (Soonest)')
  const [showPost, setShowPost] = useState(false)
  const [pinned, setPinned] = useState([])
  const [dupWarning, setDupWarning] = useState('')
  const [form, setForm] = useState({
    name:'', body:'', govtType:'central', state:'',
    eligibility:'', appOpen:'', appClose:'',
    examDate:'', officialUrl:'', languages:[]
  })

  const LANGS = ['English','Hindi','Tamil','Telugu','Malayalam','Kannada',
    'Bengali','Marathi','Gujarati','Odia']

  const checkDuplicate = (name) => {
    if (!name || name.length < 5) { setDupWarning(''); return }
    const words = name.toLowerCase().split(' ').filter(w=>w.length>3)
    const match = exams.find(e =>
      words.some(w => e.name.toLowerCase().includes(w))
    )
    if (match) setDupWarning('Similar exam already exists: '+match.name)
    else setDupWarning('')
  }

  const togglePin = (id) => {
    setPinned(prev =>
      prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
    )
  }

  const thumbsUp = (id) => {
    setExams(prev => prev.map(e =>
      e.id===id ? {...e, thumbsUp:e.thumbsUp+1} : e
    ))
  }

  const filtered = exams
    .filter(e => {
      if (filter==='Central Govt') return e.govtType==='central'
      if (filter==='State Govt') return e.govtType==='state'
      return true
    })
    .filter(e =>
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.body.toLowerCase().includes(search.toLowerCase()) ||
      e.state.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a2,b2) => {
      if (sort==='Date (Soonest)')
        return new Date(a2.examDate) - new Date(b2.examDate)
      if (sort==='Most Pinned') return b2.thumbsUp - a2.thumbsUp
      return b2.students - a2.students
    })

  const submitExam = () => {
    if (!form.name.trim() || !form.body || !form.examDate) return
    if (dupWarning) return
    setExams(prev => [{
      id: Date.now(), ...form,
      postedBy: user?.name||'You',
      verified: false, thumbsUp: 0, pinned: false,
      courses: 0, students: 0,
    }, ...prev])
    setForm({name:'',body:'',govtType:'central',state:'',
      eligibility:'',appOpen:'',appClose:'',examDate:'',officialUrl:'',languages:[]})
    setShowPost(false)
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>

      {/* Header */}
      <div style={{background:'linear-gradient(135deg,'+p+','+p+'dd)',
        padding:'20px 20px 0'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
            <button onClick={()=>nav(-1)} style={{background:'rgba(255,255,255,0.15)',
              border:'1px solid rgba(255,255,255,0.2)',borderRadius:10,
              padding:'6px 14px',color:'#fff',fontSize:13,cursor:'pointer'}}>
              ← Back
            </button>
            <div style={{flex:1}}>
              <h1 style={{color:'#fff',fontWeight:800,fontSize:20,margin:'0 0 2px'}}>
                📋 Exam Board
              </h1>
              <p style={{color:'rgba(255,255,255,0.7)',fontSize:11,margin:0}}>
                All India · State · Central · University · School - in one place
              </p>
            </div>
            <button onClick={()=>setShowPost(!showPost)}
              style={{background:'linear-gradient(135deg,'+a+',#E8C44A)',
                border:'none',borderRadius:12,padding:'10px 20px',
                color:p,fontWeight:800,fontSize:13,cursor:'pointer'}}>
              + Post Exam
            </button>
          </div>

          {/* Search bar */}
          <div style={{position:'relative',marginBottom:16}}>
            <span style={{position:'absolute',left:14,top:'50%',
              transform:'translateY(-50%)',fontSize:16,color:m}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search by exam name, conducting body, state..."
              style={{width:'100%',padding:'12px 14px 12px 40px',borderRadius:14,
                border:'none',background:'rgba(255,255,255,0.15)',
                color:'#fff',fontSize:14,outline:'none',
                fontFamily:'Poppins,sans-serif',boxSizing:'border-box',
                backdropFilter:'blur(10px)'}}/>
          </div>

          {/* Filters */}
          <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:12}}>
            {FILTERS.map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{padding:'7px 16px',borderRadius:20,border:'none',
                  cursor:'pointer',fontSize:12,fontWeight:700,flexShrink:0,
                  background:filter===f?a:'rgba(255,255,255,0.15)',
                  color:filter===f?p:'rgba(255,255,255,0.8)'}}>
                {f}
              </button>
            ))}
            <select value={sort} onChange={e=>setSort(e.target.value)}
              style={{marginLeft:'auto',padding:'7px 12px',borderRadius:20,
                border:'none',background:'rgba(255,255,255,0.15)',
                color:'rgba(255,255,255,0.9)',fontSize:12,cursor:'pointer',
                flexShrink:0,outline:'none'}}>
              {SORT_OPTIONS.map(s=>(
                <option key={s} value={s} style={{color:t,background:c}}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{padding:'20px',maxWidth:900,margin:'0 auto'}}>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
          gap:10,marginBottom:20}}>
          {[
            {l:'Active Exams',  v:exams.length,                      e:'📋'},
            {l:'Central Govt',  v:exams.filter(e=>e.govtType==='central').length, e:'🏛️'},
            {l:'State Govt',    v:exams.filter(e=>e.govtType==='state').length,   e:'🌿'},
            {l:'Pinned by You', v:pinned.length,                      e:'📌'},
          ].map((s,i)=>(
            <div key={i} style={{background:c,border:'1px solid '+b,
              borderRadius:14,padding:'14px',textAlign:'center'}}>
              <div style={{fontSize:20,marginBottom:4}}>{s.e}</div>
              <p style={{color:t,fontWeight:800,fontSize:18,margin:'0 0 2px'}}>{s.v}</p>
              <p style={{color:m,fontSize:10,margin:0}}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Post form */}
        {showPost && (
          <div style={{background:c,border:'1.5px solid '+a,borderRadius:20,
            padding:'20px',marginBottom:20}}>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 14px'}}>
              Post Exam Notification
            </p>

            {/* Exam name with duplicate check */}
            <div style={{marginBottom:12}}>
              <label style={{display:'block',color:t,fontWeight:700,
                fontSize:12,marginBottom:6}}>Exam Name *</label>
              <input value={form.name}
                onChange={e=>{
                  setForm({...form,name:e.target.value})
                  checkDuplicate(e.target.value)
                }}
                placeholder="Full official exam name"
                style={{width:'100%',padding:'11px 14px',borderRadius:12,
                  border:'1.5px solid '+(dupWarning?'#EF4444':b),
                  background:bg,color:t,fontSize:14,outline:'none',
                  fontFamily:'Poppins,sans-serif',boxSizing:'border-box'}}/>
              {dupWarning && (
                <div style={{background:'#EF444410',border:'1px solid #EF444430',
                  borderRadius:8,padding:'8px 12px',marginTop:6}}>
                  <p style={{color:'#EF4444',fontSize:11,fontWeight:700,margin:'0 0 2px'}}>
                    ⚠️ Possible Duplicate
                  </p>
                  <p style={{color:'#EF4444',fontSize:11,margin:0}}>{dupWarning}</p>
                </div>
              )}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
              {[
                {label:'Conducting Body *',key:'body',ph:'e.g. UPSC, SSC, TNPSC'},
                {label:'State (if state exam)',key:'state',ph:'e.g. Tamil Nadu, All India'},
                {label:'Eligibility',key:'eligibility',ph:'e.g. Graduate, Age 21-32'},
                {label:'Official URL *',key:'officialUrl',ph:'https://upsc.gov.in'},
              ].map(f=>(
                <div key={f.key}>
                  <label style={{display:'block',color:t,fontWeight:700,
                    fontSize:12,marginBottom:6}}>{f.label}</label>
                  <input value={form[f.key]}
                    onChange={e=>setForm({...form,[f.key]:e.target.value})}
                    placeholder={f.ph}
                    style={{width:'100%',padding:'10px 12px',borderRadius:10,
                      border:'1.5px solid '+b,background:bg,color:t,
                      fontSize:13,outline:'none',boxSizing:'border-box'}}/>
                </div>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',
              gap:10,marginBottom:12}}>
              {[
                {label:'App Opens',  key:'appOpen',  type:'date'},
                {label:'App Closes', key:'appClose', type:'date'},
                {label:'Exam Date *',key:'examDate', type:'date'},
              ].map(f=>(
                <div key={f.key}>
                  <label style={{display:'block',color:t,fontWeight:700,
                    fontSize:12,marginBottom:6}}>{f.label}</label>
                  <input type={f.type} value={form[f.key]}
                    onChange={e=>setForm({...form,[f.key]:e.target.value})}
                    style={{width:'100%',padding:'10px 12px',borderRadius:10,
                      border:'1.5px solid '+b,background:bg,color:t,
                      fontSize:13,outline:'none',cursor:'pointer',
                      boxSizing:'border-box'}}/>
                </div>
              ))}
            </div>

            <div style={{marginBottom:12}}>
              <label style={{display:'block',color:t,fontWeight:700,
                fontSize:12,marginBottom:6}}>Exam Type</label>
              <div style={{display:'flex',gap:8}}>
                {['central','state','university','school'].map(gt=>(
                  <button key={gt} onClick={()=>setForm({...form,govtType:gt})}
                    style={{padding:'7px 14px',borderRadius:20,border:'1.5px solid',
                      cursor:'pointer',fontSize:12,fontWeight:700,
                      borderColor:form.govtType===gt?a:b,
                      background:form.govtType===gt?a+'15':bg,
                      color:form.govtType===gt?a:m}}>
                    {gt==='central'?'Central Govt':
                     gt==='state'?'State Govt':
                     gt==='university'?'University':'School/College'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{display:'block',color:t,fontWeight:700,
                fontSize:12,marginBottom:6}}>Exam Languages</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {LANGS.map(lang=>(
                  <button key={lang}
                    onClick={()=>setForm({...form,
                      languages:form.languages.includes(lang)
                        ?form.languages.filter(l=>l!==lang)
                        :[...form.languages,lang]
                    })}
                    style={{padding:'5px 12px',borderRadius:20,border:'1.5px solid',
                      cursor:'pointer',fontSize:11,fontWeight:600,
                      borderColor:form.languages.includes(lang)?p:b,
                      background:form.languages.includes(lang)?p+'12':bg,
                      color:form.languages.includes(lang)?p:m}}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div style={{display:'flex',gap:8}}>
              <button onClick={submitExam}
                disabled={!form.name.trim()||!form.body||!form.examDate||!!dupWarning}
                style={{flex:1,
                  background:(!form.name.trim()||!form.body||!form.examDate||dupWarning)
                    ?b:'linear-gradient(135deg,'+p+','+a+')',
                  border:'none',borderRadius:12,padding:'12px',
                  color:(!form.name.trim()||!form.body||!form.examDate||dupWarning)?m:'#fff',
                  fontWeight:700,fontSize:13,cursor:'pointer'}}>
                Post Exam Notification
              </button>
              <button onClick={()=>setShowPost(false)}
                style={{background:'transparent',border:'1px solid '+b,
                  borderRadius:12,padding:'12px 20px',color:m,
                  fontWeight:600,fontSize:13,cursor:'pointer'}}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Exam cards */}
        {filtered.map(exam => (
          <div key={exam.id} style={{background:c,border:'1px solid '+b,
            borderRadius:20,marginBottom:16,overflow:'hidden',
            boxShadow:'0 2px 16px rgba(0,0,0,0.06)'}}>

            {/* Card header */}
            <div style={{padding:'18px 18px 14px'}}>
              <div style={{display:'flex',alignItems:'flex-start',
                gap:12,marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:6}}>
                    <span style={{background:
                      exam.govtType==='central'?'#3B82F615':'#22C55E15',
                      color:exam.govtType==='central'?'#3B82F6':'#22C55E',
                      fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20}}>
                      {exam.govtType==='central'?'🏛️ Central Govt':'🌿 State Govt'}
                    </span>
                    {exam.state!=='All India' && (
                      <span style={{background:p+'10',color:p,fontSize:9,
                        fontWeight:700,padding:'2px 8px',borderRadius:20}}>
                        📍 {exam.state}
                      </span>
                    )}
                    {exam.verified ? (
                      <span style={{background:'#22C55E15',color:'#22C55E',
                        fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20}}>
                        👍 Verified
                      </span>
                    ) : (
                      <span style={{background:'#F59E0B15',color:'var(--color-accent, #F59E0B)',
                        fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20}}>
                        ⚠️ Unverified
                      </span>
                    )}
                  </div>
                  <h3 style={{color:t,fontWeight:800,fontSize:15,
                    margin:'0 0 4px',lineHeight:1.3}}>
                    {exam.name}
                  </h3>
                  <p style={{color:m,fontSize:11,margin:'0 0 4px'}}>
                    {exam.body}
                  </p>
                  <p style={{color:m,fontSize:11,margin:0}}>
                    📋 {exam.eligibility}
                  </p>
                </div>
                <button onClick={()=>togglePin(exam.id)}
                  style={{background:pinned.includes(exam.id)?a+'15':'transparent',
                    border:'1.5px solid '+(pinned.includes(exam.id)?a:b),
                    borderRadius:10,padding:'8px',cursor:'pointer',
                    fontSize:18,transition:'all 0.2s',flexShrink:0}}>
                  {pinned.includes(exam.id)?'📌':'🔖'}
                </button>
              </div>

              {/* Date grid */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
                gap:8,marginBottom:12}}>
                {[
                  {label:'Apply by', date:exam.appClose, urgent:true},
                  {label:'Exam Date', date:exam.examDate, urgent:false},
                  {label:'Result', date:exam.resultDate, urgent:false},
                ].map((d,i)=>(
                  <div key={i} style={{background:bg,border:'1px solid '+b,
                    borderRadius:10,padding:'10px',textAlign:'center'}}>
                    <p style={{color:m,fontSize:9,fontWeight:700,
                      letterSpacing:'0.5px',margin:'0 0 4px'}}>
                      {d.label.toUpperCase()}
                    </p>
                    <p style={{color:t,fontWeight:700,fontSize:11,margin:'0 0 4px'}}>
                      {new Date(d.date).toLocaleDateString('en-IN',
                        {day:'2-digit',month:'short',year:'numeric'})}
                    </p>
                    <p style={{color:d.urgent?'#EF4444':a,
                      fontWeight:700,fontSize:10,margin:0}}>
                      ⏱ <Countdown targetDate={d.date}/>
                    </p>
                  </div>
                ))}
              </div>

              {/* Languages */}
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
                {exam.languages.map(lang=>(
                  <span key={lang} style={{background:p+'08',color:p,
                    fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20}}>
                    🌐 {lang}
                  </span>
                ))}
                <span style={{color:m,fontSize:10,marginLeft:'auto'}}>
                  Posted by {exam.postedBy}
                </span>
              </div>

              {/* Action bar */}
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <button onClick={()=>thumbsUp(exam.id)}
                  style={{background:bg,border:'1px solid '+b,borderRadius:20,
                    padding:'6px 14px',cursor:'pointer',display:'flex',
                    alignItems:'center',gap:6,fontFamily:'Poppins,sans-serif',
                    transition:'all 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=a}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=b}>
                  <span>👍</span>
                  <span style={{color:t,fontWeight:700,fontSize:12}}>
                    {exam.thumbsUp}
                  </span>
                </button>
                <a href={exam.officialUrl} target="_blank" rel="noreferrer"
                  style={{background:bg,border:'1px solid '+b,borderRadius:20,
                    padding:'6px 14px',textDecoration:'none',
                    color:m,fontSize:12,fontWeight:600}}>
                  🔗 Official Site
                </a>
                <button onClick={()=>nav('/exam-board/'+exam.id+'/courses')}
                  style={{marginLeft:'auto',
                    background:'linear-gradient(135deg,'+p+','+a+')',
                    border:'none',borderRadius:20,padding:'7px 18px',
                    color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>
                  {exam.courses} Courses · {exam.students.toLocaleString()} students →
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'48px',
            background:c,borderRadius:20,border:'1.5px dashed '+b}}>
            <div style={{fontSize:40,marginBottom:12}}>🔍</div>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 6px'}}>
              No exams found
            </p>
            <p style={{color:m,fontSize:13,margin:0}}>
              Try different filters or post a new exam notification
            </p>
          </div>
        )}
        <div style={{height:40}}/>
      </div>
    </div>
  )
}
