import { earnCoins } from '../../lib/coinVault'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const QUESTIONS = [
  {
    id:'age', text:'How old are you?', emoji:'🎂',
    options:['Under 18','18–22','23–28','29–35','36+'],
  },
  {
    id:'education', text:'Your highest qualification?', emoji:'🎓',
    options:['Class 10 / Below','Class 12','Diploma / ITI','Graduate (Any)','Post Graduate'],
  },
  {
    id:'stream', text:'Your academic stream?', emoji:'📚',
    options:['Science (PCM)','Science (PCB)','Commerce','Arts / Humanities','Engineering / Tech','Other'],
  },
  {
    id:'salary', text:'Target monthly salary?', emoji:'💰',
    options:['₹15,000–₹30,000','₹30,000–₹60,000','₹60,000–₹1 Lakh','₹1–₹2 Lakh','₹2 Lakh+'],
  },
  {
    id:'prep_time', text:'How much time can you study daily?', emoji:'⏰',
    options:['1–2 hours','2–4 hours','4–6 hours','6–8 hours','Full-time (8+ hrs)'],
  },
  {
    id:'location', text:'Preferred work location?', emoji:'📍',
    options:['My home state','Any state in India','Central government post','Private sector OK','Open to abroad'],
  },
  {
    id:'strength', text:'Your strongest subject?', emoji:'💪',
    options:['Mathematics / Quant','Reasoning / Logic','English / Languages','Science / Biology','General Knowledge','Computer / IT'],
  },
  {
    id:'timeline', text:'When do you want to clear the exam?', emoji:'📅',
    options:['Within 6 months','6–12 months','1–2 years','2–3 years','Just exploring'],
  },
]

const EXAM_MATCHES = {
  'Science (PCM)':   [{ name:'JEE Main',    match:94, desc:'B.Tech at NITs/IIITs', salary:'₹8–25 LPA',   emoji:'🔬', id:'jee-main'   },
                      { name:'GATE CS/ME',   match:88, desc:'PSU jobs or M.Tech',  salary:'₹6–18 LPA',   emoji:'⚙️', id:'gate'       }],
  'Science (PCB)':   [{ name:'NEET UG',      match:95, desc:'MBBS/BDS admission',  salary:'₹8–30 LPA',   emoji:'🩺', id:'neet-ug'    },
                      { name:'AIIMS NORCET', match:82, desc:'Nursing at AIIMS',    salary:'₹4–8 LPA',    emoji:'🏥', id:'aiims'      }],
  'Commerce':        [{ name:'CA Foundation',match:91, desc:'Chartered Accountant',salary:'₹6–25 LPA',   emoji:'📊', id:'ca-found'   },
                      { name:'IBPS PO',       match:87, desc:'Bank Probationary Officer', salary:'₹5–9 LPA', emoji:'🏦', id:'ibps-po' }],
  'Arts / Humanities':[{ name:'UPSC CSE',    match:89, desc:'IAS/IPS/IFS',        salary:'₹56,100+/mo', emoji:'🏛️', id:'upsc-cse'   },
                       { name:'SSC CGL',      match:85, desc:'Central Govt Grade B',salary:'₹4–8 LPA',   emoji:'📋', id:'ssc-cgl'   }],
  'default':          [{ name:'SSC CGL',      match:87, desc:'Central Govt Grade B',salary:'₹4–8 LPA',   emoji:'📋', id:'ssc-cgl'   },
                       { name:'IBPS PO',      match:83, desc:'Bank PO',            salary:'₹5–9 LPA',    emoji:'🏦', id:'ibps-po'   },
                       { name:'RRB NTPC',     match:79, desc:'Railway Non-Technical',salary:'₹3–6 LPA',  emoji:'🚂', id:'rrb-ntpc'  },
                       { name:'SSC CHSL',     match:76, desc:'Lower Division Clerk',salary:'₹3–5 LPA',   emoji:'📄', id:'ssc-chsl'  },
                       { name:'NDA',          match:72, desc:'Defence Services',   salary:'₹56,100+/mo', emoji:'🎖️', id:'nda'       }],
}

export default function CareerCompass() {
  const navigate = useNavigate()
  const [step,     setStep]    = useState(0)      // -1 = intro, 0-7 = questions, 8 = results
  const [answers,  setAnswers] = useState({})
  const [started,  setStarted] = useState(false)

  const q = QUESTIONS[step]
  const progress = started ? Math.round((step / QUESTIONS.length) * 100) : 0

  const answer = (val) => {
    const newAnswers = { ...answers, [q.id]: val }
    setAnswers(newAnswers)
    if (step < QUESTIONS.length - 1) setStep(s => s + 1)
    else setStep(QUESTIONS.length) // results
  }

  const getMatches = () => {
    const stream = answers.stream || 'default'
    const base = EXAM_MATCHES[stream] || EXAM_MATCHES.default
    // Adjust match % based on time available
    const timeMod = answers.prep_time === 'Full-time (8+ hrs)' ? 3
      : answers.prep_time === '6–8 hours' ? 2
      : answers.prep_time === '4–6 hours' ? 0
      : answers.prep_time === '2–4 hours' ? -3 : -5
    return [
      ...base,
      ...EXAM_MATCHES.default.filter(e => !base.find(b => b.name === e.name))
    ].map(e => ({ ...e, match: Math.min(99, Math.max(60, e.match + timeMod)) }))
     .sort((a,b) => b.match - a.match).slice(0, 5)
  }

  if (!started) return (
    <AppLayout>
      <div style={{ maxWidth:560, margin:'0 auto', textAlign:'center', padding:'40px 0' }}>
        <div style={{ fontSize:64, marginBottom:20 }}>🧭</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:32, marginBottom:12 }}>Career Compass</h1>
        <p style={{ color:'#64748B', fontSize:16, lineHeight:1.7, marginBottom:28 }}>
          Answer 8 questions. Get your top 5 exam matches from 1,10,000+ pathways.
          Personalised to your age, education, stream, and goals.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:32, textAlign:'left', background:'#F8FAFC', borderRadius:18, padding:20, border:'1.5px solid #E2E8F0' }}>
          {[['🎂','Your age and education level'],['💪','Your strongest subjects'],['💰','Your salary target'],['⏰','How much time you can study']].map(([e,t]) => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>{e}</span>
              <span style={{ color:'#475569', fontSize:14 }}>{t}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setStarted(true)} style={{ background:'linear-gradient(135deg,#D4AF37,#E8C84A)', border:'none', borderRadius:16, padding:'16px 48px', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#1E3A5F', cursor:'pointer', boxShadow:'0 6px 24px rgba(212,175,55,0.4)' }}>
          Start 8-Question Quiz →
        </button>
        <p style={{ color:'#94A3B8', fontSize:12, marginTop:12 }}>Takes about 2 minutes</p>
      </div>
    </AppLayout>
  )

  if (step === QUESTIONS.length) {
    const matches = getMatches()
    return (
      <AppLayout>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🎯</div>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:28, marginBottom:8 }}>Your Perfect Exam Matches</h2>
            <p style={{ color:'#64748B', fontSize:15 }}>Based on your profile · From 1,10,000+ pathways</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
            {matches.map((m,i) => (
              <div key={i} onClick={() => navigate(`/exams/${m.id}/universe`)}
                style={{ background:'#fff', borderRadius:20, padding:20, border:`1.5px solid ${i===0?'#D4AF37':'#E2E8F0'}`, boxShadow: i===0?'0 8px 24px rgba(212,175,55,0.15)':'0 2px 8px rgba(0,0,0,0.04)', cursor:'pointer', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:52, height:52, borderRadius:16, background: i===0?'linear-gradient(135deg,#D4AF37,#E8C84A)':'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{m.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16 }}>{m.name}</p>
                    {i===0 && <span style={{ background:'#D4AF37', color:'#1E3A5F', fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>BEST MATCH</span>}
                  </div>
                  <p style={{ color:'#64748B', fontSize:13 }}>{m.desc} · {m.salary}</p>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color: i===0?'#22C55E':i<3?'#D4AF37':'#64748B', fontSize:22 }}>{m.match}%</p>
                  <p style={{ color:'#94A3B8', fontSize:10 }}>match</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button onClick={() => { setStep(0); setAnswers({}); }} style={{ flex:1, minWidth:140, background:'#F1F5F9', border:'none', borderRadius:14, padding:'12px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, color:'#64748B', cursor:'pointer' }}>↩ Retake Quiz</button>
            <button onClick={() => navigate('/test-engine')} style={{ flex:2, minWidth:200, background:'linear-gradient(135deg,#D4AF37,#E8C84A)', border:'none', borderRadius:14, padding:'12px', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>Start Preparing for {matches[0]?.name} →</button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div style={{ maxWidth:600, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <button onClick={() => step>0 ? setStep(s=>s-1) : setStarted(false)}
            style={{ background:'none', border:'none', color:'#64748B', cursor:'pointer', fontSize:14, fontFamily:'Poppins,sans-serif' }}>← Back</button>
          <span style={{ color:'#94A3B8', fontSize:13 }}>{step+1} / {QUESTIONS.length}</span>
        </div>
        <div style={{ height:6, background:'#F1F5F9', borderRadius:3, marginBottom:32 }}>
          <div style={{ width:`${progress}%`, height:6, borderRadius:3, background:'linear-gradient(90deg,#D4AF37,#E8C84A)', transition:'width 0.4s ease' }}/>
        </div>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <span style={{ fontSize:52 }}>{q.emoji}</span>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:'clamp(20px,3vw,28px)', marginTop:14 }}>{q.text}</h2>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {q.options.map(opt => (
            <button key={opt} onClick={() => answer(opt)} style={{ padding:'16px 20px', borderRadius:16, border:`1.5px solid ${answers[q.id]===opt?'#D4AF37':'#E2E8F0'}`, background: answers[q.id]===opt?'rgba(212,175,55,0.08)':'#fff', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:15, color: answers[q.id]===opt?'#1E3A5F':'#475569', cursor:'pointer', textAlign:'left', transition:'all 0.15s', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              {opt}
              {answers[q.id]===opt && <span style={{ color:'#D4AF37', fontWeight:800 }}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
