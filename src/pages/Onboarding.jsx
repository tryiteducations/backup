import { useAuth } from '../context/AuthContext'
import { earnCoins } from '../lib/coinVault'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── shared data ───────────────────────────────────────────────────
const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','J&K','Ladakh','Puducherry']
const LANGUAGES     = ['English','Tamil','Hindi','Telugu','Kannada','Malayalam','Marathi','Bengali','Gujarati','Punjabi','Odia','Assamese','Urdu','Sanskrit','Meitei','Bodo','Dogri','Konkani','Maithili','Santali','Sindhi','Nepali']
const EXAMS_LIST    = ['SSC CGL','SSC CHSL','UPSC CSE','IBPS PO','IBPS Clerk','RRB NTPC','SBI PO','NEET UG','JEE Main','JEE Advanced','GATE','CAT','NDA','CDS','CTET','State PSC','RAS','TNPSC','KPSC','BPSC','WBPSC','MPSC','Police SI','Constable','SSB','AFCAT','Nursing','Pharmacy','LLB/CLAT','Architecture','Other']
const SUBJECTS_LIST = ['Mathematics/Quant','Reasoning/Logic','English Grammar','General Knowledge','Current Affairs','History','Geography','Polity/Civics','Economics','Physics','Chemistry','Biology','Computer Science','Accountancy','Business Studies','Other']

// ── progress bar ──────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>Step {current} of {total}</span>
        <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700 }}>{Math.round((current/total)*100)}%</span>
      </div>
      <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:3 }}>
        <div style={{ width:`${(current/total)*100}%`, height:6, borderRadius:3, background:'linear-gradient(90deg,#D4AF37,#E8C84A)', transition:'width 0.4s ease' }}/>
      </div>
    </div>
  )
}

// ── input component ───────────────────────────────────────────────
function Field({ label, value, onChange, type='text', placeholder='', required=false }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:'block', color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:600, marginBottom:6, fontFamily:'Poppins,sans-serif' }}>
        {label}{required && <span style={{ color:'#EF4444' }}> *</span>}
      </label>
      <input value={value} type={type} placeholder={placeholder}
        onChange={e=>onChange(e.target.value)}
        style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif', transition:'border-color 0.2s' }}
        onFocus={e=>e.target.style.borderColor='#D4AF37'}
        onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'}
      />
    </div>
  )
}

function Select({ label, value, onChange, options, placeholder='Select...', required=false }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:'block', color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:600, marginBottom:6, fontFamily:'Poppins,sans-serif' }}>
        {label}{required && <span style={{ color:'#EF4444' }}> *</span>}
      </label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.15)', background:'rgba(30,58,95,0.8)', color: value?'#fff':'rgba(255,255,255,0.4)', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
        onFocus={e=>e.target.style.borderColor='#D4AF37'}
        onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'}>
        <option value="" style={{ color:'#94A3B8' }}>{placeholder}</option>
        {options.map(o=><option key={o} value={o} style={{ color:'#1E293B', background:'#fff' }}>{o}</option>)}
      </select>
    </div>
  )
}

function Chips({ label, options, selected, onToggle, max=null }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:'block', color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:600, marginBottom:8, fontFamily:'Poppins,sans-serif' }}>{label}</label>}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {options.map(o=>{
          const on = selected.includes(o)
          return (
            <button key={o} onClick={()=>onToggle(o)} type="button"
              style={{ padding:'7px 14px', borderRadius:20, border:'none', cursor:'pointer', background: on?'linear-gradient(135deg,#D4AF37,#E8C84A)':'rgba(255,255,255,0.08)', color: on?'#1E3A5F':'rgba(255,255,255,0.7)', fontFamily:'Poppins,sans-serif', fontWeight: on?700:500, fontSize:13, transition:'all 0.15s' }}>
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function NextBtn({ onClick, label='Next →', disabled=false }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width:'100%', marginTop:16, padding:15, borderRadius:16, border:'none', background: disabled?'rgba(255,255,255,0.1)':'linear-gradient(135deg,#D4AF37,#E8C84A)', color: disabled?'rgba(255,255,255,0.3)':'#1E3A5F', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17, cursor: disabled?'not-allowed':'pointer', boxShadow: disabled?'none':'0 6px 20px rgba(212,175,55,0.4)', transition:'all 0.2s' }}>
      {label}
    </button>
  )
}

// ══════════════════════════════════════════════════════════════════
// STUDENT ONBOARDING (7 steps)
// ══════════════════════════════════════════════════════════════════
function StudentOnboarding({ onDone }) {
  const [step, setStep] = useState(1)
  const TOTAL = 7
  const [d, setD] = useState({
    name:'', age:'', gender:'', state:'', city:'',
    exams:[], studyLang:'English', explainLang:[],
    studyHours:'2–4 hours', goalTimeline:'6–12 months',
    strengths:[], weaknesses:[],
  })
  const upd = (k,v) => setD(p=>({...p,[k]:v}))
  const tog = (k,v) => setD(p=>({ ...p, [k]: p[k].includes(v) ? p[k].filter(x=>x!==v) : [...p[k],v] }))

  const save = () => {
    localStorage.setItem('student_profile', JSON.stringify(d))
    localStorage.setItem('selected_exam', d.exams[0] || 'SSC CGL')
    localStorage.setItem('selected_lang', d.studyLang)
    onDone()
  }

  return (
    <>
      <ProgressBar current={step} total={TOTAL}/>
      {step===1 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>🎓 Tell us about yourself</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>We'll personalise your experience</p>
          <Field label="Full Name" value={d.name} onChange={v=>upd('name',v)} placeholder="Arjun Kumar" required/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Age" value={d.age} onChange={v=>upd('age',v)} type="number" placeholder="21"/>
            <Select label="Gender" value={d.gender} onChange={v=>upd('gender',v)} options={['Male','Female','Transgender','Prefer not to say']} required/>
          </div>
          <NextBtn onClick={()=>setStep(2)} disabled={!d.name||!d.age||!d.gender}/>
        </>
      )}
      {step===2 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>📍 Where are you from?</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Helps us show state-specific exams</p>
          <Select label="State / UT" value={d.state} onChange={v=>upd('state',v)} options={INDIAN_STATES} required/>
          <Field label="City / Town" value={d.city} onChange={v=>upd('city',v)} placeholder="Coimbatore" required/>
          <NextBtn onClick={()=>setStep(3)} disabled={!d.state||!d.city}/>
        </>
      )}
      {step===3 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>📚 Target Exams</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Pick all exams you're preparing for</p>
          <Chips options={EXAMS_LIST} selected={d.exams} onToggle={v=>tog('exams',v)}/>
          <NextBtn onClick={()=>setStep(4)} disabled={d.exams.length===0}/>
        </>
      )}
      {step===4 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>🌐 Language</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Study + explanation language preference</p>
          <Select label="Primary Study Language" value={d.studyLang} onChange={v=>upd('studyLang',v)} options={LANGUAGES}/>
          <Chips label="Also comfortable in (optional)" options={LANGUAGES.filter(l=>l!==d.studyLang)} selected={d.explainLang} onToggle={v=>tog('explainLang',v)}/>
          <NextBtn onClick={()=>setStep(5)}/>
        </>
      )}
      {step===5 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>⏰ Study Time & Goal</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Be honest — we'll build the right plan</p>
          <Select label="Daily study hours" value={d.studyHours} onChange={v=>upd('studyHours',v)} options={['1–2 hours','2–4 hours','4–6 hours','6–8 hours','8+ hours (full time)']}/>
          <Select label="Goal timeline" value={d.goalTimeline} onChange={v=>upd('goalTimeline',v)} options={['Within 6 months','6–12 months','1–2 years','2–3 years','Just exploring']}/>
          <NextBtn onClick={()=>setStep(6)}/>
        </>
      )}
      {step===6 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>💪 Your Strengths</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>We'll recommend harder questions here</p>
          <Chips label="I'm good at:" options={SUBJECTS_LIST} selected={d.strengths} onToggle={v=>tog('strengths',v)}/>
          <NextBtn onClick={()=>setStep(7)} disabled={d.strengths.length===0}/>
        </>
      )}
      {step===7 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>🔧 Needs Improvement</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>We'll give you extra practice here</p>
          <Chips label="I need work on:" options={SUBJECTS_LIST.filter(s=>!d.strengths.includes(s))} selected={d.weaknesses} onToggle={v=>tog('weaknesses',v)}/>
          <NextBtn onClick={save} label="🚀 Go to Dashboard!" disabled={d.weaknesses.length===0}/>
        </>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════
// MENTOR ONBOARDING (7 steps)
// ══════════════════════════════════════════════════════════════════
function MentorOnboarding({ onDone }) {
  const [step, setStep] = useState(1)
  const TOTAL = 7
  const [d, setD] = useState({
    name:'', age:'', gender:'', state:'', city:'',
    currentJob:'', experience:'', qualification:'',
    expertExams:[], expertSubjects:[],
    replyLangs:[], canTranslate:false,
    availability:'', upi:'',
  })
  const upd = (k,v) => setD(p=>({...p,[k]:v}))
  const tog = (k,v) => setD(p=>({ ...p, [k]: p[k].includes(v) ? p[k].filter(x=>x!==v) : [...p[k],v] }))

  const save = () => {
    localStorage.setItem('mentor_profile', JSON.stringify(d))
    onDone()
  }

  return (
    <>
      <ProgressBar current={step} total={TOTAL}/>
      {step===1 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>🧑‍🏫 Mentor Profile</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Students will see your name and expertise</p>
          <Field label="Full Name" value={d.name} onChange={v=>upd('name',v)} placeholder="Prof. Vijayalakshmi R." required/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Age" value={d.age} onChange={v=>upd('age',v)} type="number" placeholder="28"/>
            <Select label="Gender" value={d.gender} onChange={v=>upd('gender',v)} options={['Male','Female','Transgender','Prefer not to say']} required/>
          </div>
          <NextBtn onClick={()=>setStep(2)} disabled={!d.name||!d.age||!d.gender}/>
        </>
      )}
      {step===2 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>📍 Location & Work</h2>
          <Select label="State" value={d.state} onChange={v=>upd('state',v)} options={INDIAN_STATES} required/>
          <Field label="City" value={d.city} onChange={v=>upd('city',v)} placeholder="Chennai" required/>
          <Field label="Current Job / Designation" value={d.currentJob} onChange={v=>upd('currentJob',v)} placeholder="e.g. Bank PO, IAS Officer, Teacher, Student" required/>
          <Select label="Years of Teaching / Mentoring" value={d.experience} onChange={v=>upd('experience',v)} options={['Less than 1 year','1–2 years','3–5 years','5–10 years','10+ years']} required/>
          <NextBtn onClick={()=>setStep(3)} disabled={!d.state||!d.city||!d.currentJob||!d.experience}/>
        </>
      )}
      {step===3 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>🎓 Qualification</h2>
          <Select label="Highest Qualification" value={d.qualification} onChange={v=>upd('qualification',v)} options={['Class 12','Diploma','Graduate (B.A./B.Sc./B.Com/BCA)','B.Tech/B.E.','Post Graduate (M.A./M.Sc./M.Com)','M.Tech/M.E.','MBA','LLB/LLM','MBBS/MD','Ph.D','Other']} required/>
          <NextBtn onClick={()=>setStep(4)} disabled={!d.qualification}/>
        </>
      )}
      {step===4 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>📋 Expert Exams</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Which exam doubts can you solve?</p>
          <Chips options={EXAMS_LIST} selected={d.expertExams} onToggle={v=>tog('expertExams',v)}/>
          <NextBtn onClick={()=>setStep(5)} disabled={d.expertExams.length===0}/>
        </>
      )}
      {step===5 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>🎯 Expert Subjects</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Which subjects will you answer doubts in?</p>
          <Chips options={SUBJECTS_LIST} selected={d.expertSubjects} onToggle={v=>tog('expertSubjects',v)}/>
          <NextBtn onClick={()=>setStep(6)} disabled={d.expertSubjects.length===0}/>
        </>
      )}
      {step===6 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>🌐 Languages</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Students will filter mentors by language</p>
          <Chips label="I can reply in:" options={LANGUAGES} selected={d.replyLangs} onToggle={v=>tog('replyLangs',v)}/>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:14, padding:14, marginTop:4 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ color:'#fff', fontWeight:600, fontSize:14 }}>Translation & Correction</p>
                <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:2 }}>Can you check translated questions for accuracy?</p>
              </div>
              <button onClick={()=>upd('canTranslate',!d.canTranslate)}
                style={{ width:46, height:26, borderRadius:13, border:'none', cursor:'pointer', background:d.canTranslate?'#D4AF37':'rgba(255,255,255,0.15)', position:'relative', transition:'background 0.2s' }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:d.canTranslate?23:3, transition:'left 0.2s' }}/>
              </button>
            </div>
          </div>
          <NextBtn onClick={()=>setStep(7)} disabled={d.replyLangs.length===0}/>
        </>
      )}
      {step===7 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>💰 Availability & Payout</h2>
          <Select label="Weekly availability for doubts" value={d.availability} onChange={v=>upd('availability',v)} options={['1–2 hours/week','3–5 hours/week','5–10 hours/week','Full time (10+ hrs/week)']}/>
          <Field label="UPI ID for Monday payouts" value={d.upi} onChange={v=>upd('upi',v)} placeholder="yourname@upi"/>
          <div style={{ background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.2)', borderRadius:14, padding:14, marginBottom:4 }}>
            <p style={{ color:'#D4AF37', fontSize:13, fontWeight:600 }}>💛 How payouts work</p>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginTop:6, lineHeight:1.6 }}>
              Every accepted answer earns ₹15–50 · Books sold = 85% to you · Every Monday via UPI · No minimum threshold for first 3 months
            </p>
          </div>
          <NextBtn onClick={save} label="🚀 Go to Mentor Hub!" disabled={!d.availability}/>
        </>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════
// INSTITUTION ONBOARDING (8 steps)
// ══════════════════════════════════════════════════════════════════
function InstitutionOnboarding({ onDone }) {
  const [step, setStep] = useState(1)
  const TOTAL = 8
  const [d, setD] = useState({
    institutionName:'', type:'', board:'',
    state:'', city:'', pincode:'', address:'',
    contactName:'', contactDesignation:'', contactPhone:'',
    studentCount:'', studentEmails:[],
    newEmail:'',
    examsConducted:[], subjectsTaught:[],
    questionFormat:'excel',
    upi:'', bankName:'', accountName:'',
    agreed:false,
  })
  const upd = (k,v) => setD(p=>({...p,[k]:v}))
  const tog = (k,v) => setD(p=>({ ...p, [k]: p[k].includes(v) ? p[k].filter(x=>x!==v) : [...p[k],v] }))

  const addEmail = () => {
    const e = d.newEmail.trim().toLowerCase()
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return
    if (d.studentEmails.includes(e)) return
    upd('studentEmails', [...d.studentEmails, e])
    upd('newEmail', '')
  }

  const save = () => {
    localStorage.setItem('institution_profile', JSON.stringify(d))
    onDone()
  }

  return (
    <>
      <ProgressBar current={step} total={TOTAL}/>
      {step===1 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>🏫 Institution Details</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Shown publicly on TryIT's institution directory</p>
          <Field label="Institution Name" value={d.institutionName} onChange={v=>upd('institutionName',v)} placeholder="Bright Future Academy" required/>
          <Select label="Institution Type" value={d.type} onChange={v=>upd('type',v)} options={['School (Government)','School (Private)','Junior College','Degree College','Engineering College','Medical College','Coaching Centre','Online Coaching','Skill Centre','Other']} required/>
          {(d.type.includes('School')||d.type.includes('College')) && (
            <Select label="Board / University" value={d.board} onChange={v=>upd('board',v)} options={['CBSE','ICSE','State Board','IGCSE','IB','Anna University','Madras University','Mumbai University','DU','BU','Other']}/>
          )}
          <NextBtn onClick={()=>setStep(2)} disabled={!d.institutionName||!d.type}/>
        </>
      )}
      {step===2 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>📍 Location</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Displayed on Pan-India institution map</p>
          <Select label="State" value={d.state} onChange={v=>upd('state',v)} options={INDIAN_STATES} required/>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12 }}>
            <Field label="City / Town" value={d.city} onChange={v=>upd('city',v)} placeholder="Coimbatore" required/>
            <Field label="Pincode" value={d.pincode} onChange={v=>upd('pincode',v)} placeholder="641001"/>
          </div>
          <Field label="Full Address" value={d.address} onChange={v=>upd('address',v)} placeholder="No. 12, Anna Nagar Main Road"/>
          <NextBtn onClick={()=>setStep(3)} disabled={!d.state||!d.city}/>
        </>
      )}
      {step===3 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>👤 Contact Person</h2>
          <Field label="Your Name (Admin)" value={d.contactName} onChange={v=>upd('contactName',v)} placeholder="Mr. Suresh Kumar" required/>
          <Field label="Designation" value={d.contactDesignation} onChange={v=>upd('contactDesignation',v)} placeholder="Principal / Director / Manager"/>
          <Field label="Mobile Number" value={d.contactPhone} onChange={v=>upd('contactPhone',v)} type="tel" placeholder="+91 98765 43210"/>
          <NextBtn onClick={()=>setStep(4)} disabled={!d.contactName}/>
        </>
      )}
      {step===4 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>👥 Add Your Students</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Each student you add gets a group discount automatically</p>
          <Select label="Approx. total students" value={d.studentCount} onChange={v=>upd('studentCount',v)} options={['1–10','10–50','50–100','100–500','500+']}/>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:600, marginBottom:8, fontFamily:'Poppins,sans-serif' }}>
              Add student email IDs
            </label>
            <div style={{ display:'flex', gap:8 }}>
              <input value={d.newEmail} type="email" placeholder="student@gmail.com"
                onChange={e=>upd('newEmail',e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&addEmail()}
                style={{ flex:1, padding:'11px 14px', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, outline:'none', fontFamily:'Inter,sans-serif' }}
                onFocus={e=>e.target.style.borderColor='#D4AF37'}
                onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'}
              />
              <button onClick={addEmail} style={{ padding:'11px 18px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#D4AF37,#E8C84A)', color:'#1E3A5F', fontWeight:700, fontSize:14, cursor:'pointer' }}>Add</button>
            </div>
            {d.studentEmails.length > 0 && (
              <div style={{ marginTop:10, display:'flex', flexWrap:'wrap', gap:6 }}>
                {d.studentEmails.map(e=>(
                  <div key={e} style={{ background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:20, padding:'4px 12px', display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ color:'#4ADE80', fontSize:12 }}>{e}</span>
                    <button onClick={()=>upd('studentEmails',d.studentEmails.filter(x=>x!==e))} style={{ background:'none', border:'none', color:'rgba(74,222,128,0.6)', cursor:'pointer', fontSize:16, lineHeight:1, padding:0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:8 }}>You can also import later via CSV · Students receive login invite email</p>
          </div>
          <NextBtn onClick={()=>setStep(5)} disabled={!d.studentCount}/>
        </>
      )}
      {step===5 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>📋 Exams You Conduct</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Shown on your public institution profile</p>
          <Chips options={EXAMS_LIST} selected={d.examsConducted} onToggle={v=>tog('examsConducted',v)}/>
          <NextBtn onClick={()=>setStep(6)} disabled={d.examsConducted.length===0}/>
        </>
      )}
      {step===6 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>📤 Upload Your Questions</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Choose how you'll submit questions for approval</p>
          {[
            { id:'excel', emoji:'📊', title:'Excel / CSV File', desc:'Upload .xlsx or .csv with columns: Question, Option A, B, C, D, Answer, Subject, Difficulty' },
            { id:'gsheets', emoji:'🟩', title:'Google Sheets Link', desc:'Share your Google Sheet link — we import automatically when you update' },
            { id:'manual', emoji:'✍️', title:'Type Manually', desc:'Enter questions one by one in our question builder' },
            { id:'ai', emoji:'🤖', title:'AI-Assisted', desc:'Give us the topic and difficulty — our system generates questions for your review' },
          ].map(opt=>(
            <button key={opt.id} onClick={()=>upd('questionFormat',opt.id)}
              style={{ width:'100%', display:'flex', gap:12, alignItems:'flex-start', padding:'14px 16px', borderRadius:16, border:`2px solid ${d.questionFormat===opt.id?'#D4AF37':'rgba(255,255,255,0.1)'}`, background:d.questionFormat===opt.id?'rgba(212,175,55,0.1)':'rgba(255,255,255,0.04)', cursor:'pointer', textAlign:'left', marginBottom:8 }}>
              <span style={{ fontSize:24, flexShrink:0 }}>{opt.emoji}</span>
              <div>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:d.questionFormat===opt.id?'#D4AF37':'#fff', fontSize:14 }}>{opt.title}</p>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:3 }}>{opt.desc}</p>
              </div>
            </button>
          ))}
          <div style={{ background:'rgba(30,58,95,0.4)', borderRadius:14, padding:12, marginTop:4 }}>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, lineHeight:1.6 }}>
              📋 All uploaded questions go through our <strong style={{ color:'#D4AF37' }}>2-step review</strong> before going live. Approved questions appear on TryIT with your institution name credited.
            </p>
          </div>
          <NextBtn onClick={()=>setStep(7)}/>
        </>
      )}
      {step===7 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>💰 Monday Payout Setup</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Every active student earns you a weekly payout</p>
          <Field label="UPI ID" value={d.upi} onChange={v=>upd('upi',v)} placeholder="institution@upi"/>
          <Field label="Bank Account Holder Name" value={d.accountName} onChange={v=>upd('accountName',v)} placeholder="Bright Future Academy"/>
          <div style={{ background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.2)', borderRadius:14, padding:14, marginBottom:4 }}>
            <p style={{ color:'#D4AF37', fontSize:13, fontWeight:700, marginBottom:6 }}>💛 Payout Structure</p>
            {['Every active student = weekly earnings transferred Monday','Unlimited students — no cap on earnings','Your institution gets Pan-India featured placement','Centre battles: top centres ranked nationally every month'].map((l,i)=>(
              <div key={i} style={{ display:'flex', gap:8, marginBottom:4 }}>
                <span style={{ color:'#D4AF37' }}>✓</span>
                <span style={{ color:'rgba(255,255,255,0.65)', fontSize:12 }}>{l}</span>
              </div>
            ))}
          </div>
          <NextBtn onClick={()=>setStep(8)} disabled={!d.upi}/>
        </>
      )}
      {step===8 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>✅ Review & Confirm</h2>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:18, padding:16, marginBottom:16 }}>
            {[['🏫 Institution', d.institutionName],['📍 Location',`${d.city}, ${d.state}`],['👤 Contact',d.contactName],['👥 Students',`${d.studentEmails.length} emails added · ${d.studentCount} total`],['📋 Exams',d.examsConducted.slice(0,3).join(', ')+(d.examsConducted.length>3?'...':'')],['📤 Questions',d.questionFormat]].map(([l,v])=>(
              <div key={l} style={{ display:'flex', gap:10, marginBottom:8 }}>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13, minWidth:100 }}>{l}</span>
                <span style={{ color:'#fff', fontSize:13, fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:14 }}>
            <button onClick={()=>upd('agreed',!d.agreed)}
              style={{ width:22, height:22, borderRadius:6, border:`2px solid ${d.agreed?'#D4AF37':'rgba(255,255,255,0.3)'}`, background:d.agreed?'#D4AF37':'transparent', cursor:'pointer', flexShrink:0, marginTop:1 }}>
              {d.agreed && <span style={{ color:'#1E3A5F', fontSize:14, fontWeight:900 }}>✓</span>}
            </button>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, lineHeight:1.6 }}>I confirm that all information provided is accurate and I am authorised to represent this institution on TryIT Educations.</p>
          </div>
          <NextBtn onClick={save} label="🚀 Activate Institution Account!" disabled={!d.agreed}/>
        </>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════
// FAMILY ONBOARDING (5 steps)
// ══════════════════════════════════════════════════════════════════
function FamilyOnboarding({ onDone }) {
  const [step, setStep] = useState(1)
  const TOTAL = 5
  const [d, setD] = useState({
    headName:'', headAge:'', headGender:'', headRelation:'',
    familyName:'',
    members:[],
    newMember:{ name:'', email:'', exam:'', relation:'' },
    goalTogether:'',
  })
  const upd = (k,v) => setD(p=>({...p,[k]:v}))
  const updMem = (k,v) => setD(p=>({...p, newMember:{...p.newMember,[k]:v}}))
  const addMember = () => {
    if (!d.newMember.name||!d.newMember.email) return
    upd('members',[...d.members,{...d.newMember,id:Date.now()}])
    upd('newMember',{ name:'', email:'', exam:'', relation:'' })
  }

  const save = () => {
    localStorage.setItem('family_profile', JSON.stringify(d))
    onDone()
  }

  return (
    <>
      <ProgressBar current={step} total={TOTAL}/>
      {step===1 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>👨‍👩‍👧 Family Hub</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>One account. Whole family. Study together.</p>
          <Field label="Family Name (e.g. Kumar Family)" value={d.familyName} onChange={v=>upd('familyName',v)} placeholder="Kumar Family" required/>
          <Field label="Your Name (Account Head)" value={d.headName} onChange={v=>upd('headName',v)} placeholder="Suresh Kumar" required/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Your Age" value={d.headAge} onChange={v=>upd('headAge',v)} type="number" placeholder="45"/>
            <Select label="Gender" value={d.headGender} onChange={v=>upd('headGender',v)} options={['Male','Female','Transgender','Prefer not to say']}/>
          </div>
          <Select label="Your role in family" value={d.headRelation} onChange={v=>upd('headRelation',v)} options={['Father','Mother','Elder Sibling','Grandfather','Grandmother','Guardian','Other']} required/>
          <NextBtn onClick={()=>setStep(2)} disabled={!d.familyName||!d.headName||!d.headRelation}/>
        </>
      )}
      {step===2 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>➕ Add Family Members</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Each member logs in with their own email. All connected to your family account.</p>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:16, marginBottom:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
              <Field label="Member Name" value={d.newMember.name} onChange={v=>updMem('name',v)} placeholder="Priya Kumar"/>
              <Select label="Relation" value={d.newMember.relation} onChange={v=>updMem('relation',v)} options={['Son','Daughter','Spouse','Sibling','Parent','Grandchild','Other']}/>
            </div>
            <Field label="Member Email" value={d.newMember.email} onChange={v=>updMem('email',v)} placeholder="priya@gmail.com" type="email"/>
            <Select label="Main Exam" value={d.newMember.exam} onChange={v=>updMem('exam',v)} options={EXAMS_LIST}/>
            <button onClick={addMember} disabled={!d.newMember.name||!d.newMember.email}
              style={{ width:'100%', padding:'10px', borderRadius:12, border:'none', background: d.newMember.name&&d.newMember.email?'linear-gradient(135deg,#D4AF37,#E8C84A)':'rgba(255,255,255,0.08)', color: d.newMember.name&&d.newMember.email?'#1E3A5F':'rgba(255,255,255,0.3)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor: d.newMember.name&&d.newMember.email?'pointer':'not-allowed' }}>
              + Add Member
            </button>
          </div>
          {d.members.length > 0 && (
            <div style={{ marginBottom:12 }}>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginBottom:8 }}>Added ({d.members.length} members):</p>
              {d.members.map(m=>(
                <div key={m.id} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:12, padding:'8px 12px', marginBottom:6 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'#D4AF37', display:'flex', alignItems:'center', justifyContent:'center', color:'#1E3A5F', fontWeight:900, fontSize:13 }}>{m.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ color:'#fff', fontWeight:600, fontSize:13 }}>{m.name} <span style={{ color:'rgba(255,255,255,0.4)', fontWeight:400 }}>({m.relation})</span></p>
                    <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{m.email} · {m.exam}</p>
                  </div>
                  <button onClick={()=>upd('members',d.members.filter(x=>x.id!==m.id))} style={{ background:'none', border:'none', color:'rgba(255,100,100,0.6)', cursor:'pointer', fontSize:18 }}>×</button>
                </div>
              ))}
            </div>
          )}
          <NextBtn onClick={()=>setStep(3)} disabled={d.members.length===0}/>
        </>
      )}
      {step===3 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>🎯 Family Goal</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:18 }}>Set a shared vision for your family</p>
          {['All members crack their exams this year','Build a study streak together','Support a member preparing for UPSC/JEE/NEET','Just keep the family learning together','Custom goal'].map(g=>(
            <button key={g} onClick={()=>upd('goalTogether',g)}
              style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:'none', cursor:'pointer', background:d.goalTogether===g?'linear-gradient(135deg,#D4AF37,#E8C84A)':'rgba(255,255,255,0.06)', color:d.goalTogether===g?'#1E3A5F':'rgba(255,255,255,0.7)', fontFamily:'Poppins,sans-serif', fontWeight:d.goalTogether===g?700:500, fontSize:14, textAlign:'left', marginBottom:8 }}>
              {g}
            </button>
          ))}
          <NextBtn onClick={()=>setStep(4)} disabled={!d.goalTogether}/>
        </>
      )}
      {step===4 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>📊 How It Works</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
            {[['👤','Each member logs in separately with their own email'],['🔗','All accounts linked — you see everyone\'s progress as head'],['🏆','Family challenges + weekly streak + leaderboard'],['💰','Family Pro = 4 members for price of 2'],['📅','Each member\'s exam schedule shown in one family calendar']].map(([e,t])=>(
              <div key={t} style={{ display:'flex', gap:12, background:'rgba(255,255,255,0.05)', borderRadius:14, padding:'12px 14px' }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{e}</span>
                <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, lineHeight:1.5 }}>{t}</p>
              </div>
            ))}
          </div>
          <NextBtn onClick={()=>setStep(5)}/>
        </>
      )}
      {step===5 && (
        <>
          <h2 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>✅ Family Setup Complete!</h2>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:18, padding:16, marginBottom:16 }}>
            <p style={{ color:'#D4AF37', fontWeight:700, marginBottom:10 }}>👨‍👩‍👧 {d.familyName}</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>Head: {d.headName}</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>Members: {d.members.length} added</p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>Family goal: {d.goalTogether}</p>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:8 }}>Invite emails sent to all members. They can log in with their email to connect.</p>
          </div>
          <NextBtn onClick={save} label="🚀 Go to Family Hub!"/>
        </>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN ONBOARDING ROUTER
// ══════════════════════════════════════════════════════════════════
export default function Onboarding() {
  const navigate = useNavigate()
  const { updateUser } = useAuth()   // ✅ add this
  const role = localStorage.getItem('tryit_role') || 'student'
const finish = () => {
  const userRole = localStorage.getItem('tryit_role') || role
  
  // ✅ Update AuthContext so the app knows the correct role
  updateUser({ role: userRole })
  
  localStorage.setItem('onboarding_done', '1')
  earnCoins({ source:'onboarding_complete', amount:50, description:'Welcome to TryIT! 🎉 +50 coins' })
  
  const routeMap = {
    student: '/dashboard',
    mentor: '/mentor-hub',
    institution: '/centre/dashboard',
    institute: '/centre/dashboard',
    family: '/family'
  }
  
  const targetPath = routeMap[userRole] || '/dashboard'
  navigate(targetPath)
}
 
  const targetPath = routeMap[userRole]
  if (targetPath) {
    navigate(targetPath)
  } else {
    console.warn('Unknown role:', userRole, 'fallback to /dashboard')
    navigate('/dashboard')
  }
}
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'24px 16px 40px', overflowY:'auto' }}>
      <div style={{ width:'100%', maxWidth:520, marginTop:20 }}>
        {/* Role badge */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <span style={{ fontSize:24 }}>{{ student:'🎓', mentor:'🧑‍🏫', institution:'🏫', family:'👨‍👩‍👧' }[role]}</span>
          <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'rgba(255,255,255,0.7)', fontSize:15 }}>
            {{ student:'Student', mentor:'Mentor', institution:'Institution', family:'Family Hub' }[role]} Onboarding
          </span>
          <button onClick={finish} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:12 }}>Skip</button>
        </div>

        {role==='student'     && <StudentOnboarding     onDone={finish}/>}
        {role==='mentor'      && <MentorOnboarding      onDone={finish}/>}
        {role==='institution' && <InstitutionOnboarding onDone={finish}/>}
        {role==='family'      && <FamilyOnboarding      onDone={finish}/>}
      </div>
    </div>
  )
}
