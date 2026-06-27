// src/pages/student/StudentCareer.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const QUESTIONS = [
  {
    q: 'What is your highest education?',
    opts: ['Class 10 / 12', 'Pursuing Graduation', 'Graduate', 'Post-Graduate']
  },
  {
    q: 'Which subject do you enjoy most?',
    opts: ['Maths & Reasoning', 'History & Polity', 'Science & Tech', 'Commerce & Economy']
  },
  {
    q: 'What kind of career do you want?',
    opts: ['Government / IAS / IPS', 'Banking & Finance', 'Defence / Police', 'Engineering / Research']
  },
  {
    q: 'How many hours can you study daily?',
    opts: ['1-2 hours', '2-4 hours', '4-6 hours', '6+ hours']
  },
]

const RESULTS = {
  '0-0': [{icon:'\u{1F3DB}',name:'UPSC Civil Services',match:96,reason:'Strong academic base + interest in polity & governance'},
          {icon:'\u{1F33F}',name:'TNPSC Group 1',match:88,reason:'State service with Tamil Nadu focus'},
          {icon:'\u{1F4CB}',name:'SSC CGL',match:82,reason:'Central govt jobs across departments'}],
  '0-1': [{icon:'\u{1F3E6}',name:'IBPS PO / SBI PO',match:94,reason:'Commerce + economy knowledge is perfect for banking'},
          {icon:'\u{1F4CB}',name:'SSC CGL',match:86,reason:'Reasoning strength helps in Tier 1 & 2'},
          {icon:'\u{1F3DB}',name:'UPSC Civil Services',match:78,reason:'Economy optional could be your strength'}],
  '1-0': [{icon:'\u{1F6F8}',name:'NDA / CDS',match:95,reason:'Defence career path — maths + physical fitness'},
          {icon:'\u{1F3DB}',name:'UPSC Civil Services',match:84,reason:'IPS / IAS through UPSC CSE'},
          {icon:'\u{1F468}\u{200D}\u{1F393}',name:'SSC GD Constable',match:79,reason:'Direct entry into Central Armed Police'}],
  'default': [{icon:'\u{1F4CB}',name:'SSC CGL',match:91,reason:'Best all-rounder exam for any background'},
              {icon:'\u{1F3E6}',name:'IBPS PO',match:86,reason:'Banking career with good salary'},
              {icon:'\u{1F33F}',name:'TNPSC Group 2',match:81,reason:'State government with Tamil Nadu advantage'}],
}

export default function StudentCareer() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F'
  const a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B'
  const m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC'
  const c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)

  const pick = (optIdx) => {
    const next = [...answers, optIdx]
    if (step < QUESTIONS.length - 1) {
      setAnswers(next)
      setStep(step + 1)
    } else {
      setAnswers(next)
      setDone(true)
    }
  }

  const key = answers.length >= 2 ? (answers[0]+'-'+answers[2]) : 'default'
  const exams = RESULTS[key] || RESULTS['default']

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>

      {/* Header */}
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:'1px solid '+b,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>
          Back
        </button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>Career AI</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Find the best exam for you</p>
        </div>
        {!done && (
          <span style={{background:a+'20',color:a,fontSize:12,fontWeight:700,
            padding:'4px 12px',borderRadius:20}}>
            {step+1} / {QUESTIONS.length}
          </span>
        )}
      </div>

      <div style={{padding:'24px 20px',maxWidth:600,margin:'0 auto'}}>

        {!done ? (
          <>
            {/* Progress bar */}
            <div style={{height:4,background:b,borderRadius:4,marginBottom:28,overflow:'hidden'}}>
              <div style={{height:'100%',width:((step+1)/QUESTIONS.length*100)+'%',
                background:'linear-gradient(90deg,'+p+','+a+')',
                borderRadius:4,transition:'width 0.4s ease'}}/>
            </div>

            {/* Question */}
            <p style={{color:m,fontSize:12,fontWeight:600,letterSpacing:'1px',
              textTransform:'uppercase',marginBottom:8}}>
              Question {step+1}
            </p>
            <h2 style={{color:t,fontSize:20,fontWeight:800,margin:'0 0 24px',lineHeight:1.4}}>
              {QUESTIONS[step].q}
            </h2>

            {/* Options */}
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {QUESTIONS[step].opts.map((opt,i) => (
                <button key={i} onClick={()=>pick(i)}
                  style={{background:c,border:'2px solid '+b,borderRadius:16,
                    padding:'16px 20px',textAlign:'left',cursor:'pointer',
                    color:t,fontSize:15,fontWeight:600,
                    transition:'all 0.2s',display:'flex',alignItems:'center',gap:12}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=a;e.currentTarget.style.background=a+'10';e.currentTarget.style.transform='translateX(4px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=b;e.currentTarget.style.background=c;e.currentTarget.style.transform='translateX(0)'}}>
                  <span style={{width:32,height:32,borderRadius:'50%',background:p+'12',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:p,fontWeight:800,fontSize:13,flexShrink:0}}>
                    {String.fromCharCode(65+i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button onClick={()=>{setStep(step-1);setAnswers(answers.slice(0,-1))}}
                style={{marginTop:20,background:'transparent',border:'none',
                  color:m,fontSize:13,cursor:'pointer',padding:'8px 0'}}>
                Back to previous question
              </button>
            )}
          </>
        ) : (
          <>
            {/* Results */}
            <div style={{background:'linear-gradient(135deg,'+p+','+p+'cc)',
              borderRadius:20,padding:'24px',marginBottom:24,textAlign:'center'}}>
              <div style={{fontSize:48,marginBottom:8}}>🎯</div>
              <p style={{color:'#fff',fontWeight:800,fontSize:18,margin:'0 0 6px'}}>
                Your Best Exam Matches
              </p>
              <p style={{color:'rgba(255,255,255,0.7)',fontSize:13,margin:0}}>
                Based on your background and goals
              </p>
            </div>

            {exams.map((exam,i) => (
              <div key={i} style={{background:c,border:'1px solid '+b,borderRadius:16,
                padding:'18px',marginBottom:12,display:'flex',gap:14,alignItems:'center'}}>
                <div style={{fontSize:32,flexShrink:0}}>{exam.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>{exam.name}</p>
                    {i===0 && (
                      <span style={{background:a+'20',color:a,fontSize:9,fontWeight:700,
                        padding:'2px 8px',borderRadius:20}}>BEST MATCH</span>
                    )}
                  </div>
                  <p style={{color:m,fontSize:11,margin:'0 0 8px'}}>{exam.reason}</p>
                  <div style={{height:5,background:b,borderRadius:4,overflow:'hidden'}}>
                    <div style={{height:'100%',width:exam.match+'%',borderRadius:4,
                      background:'linear-gradient(90deg,'+p+','+a+')',
                      transition:'width 1s ease'}}/>
                  </div>
                  <p style={{color:a,fontSize:11,fontWeight:700,margin:'4px 0 0'}}>
                    {exam.match}% match
                  </p>
                </div>
              </div>
            ))}

            <div style={{display:'flex',gap:10,marginTop:20}}>
              <button onClick={()=>{setStep(0);setAnswers([]);setDone(false)}}
                style={{flex:1,background:'transparent',border:'1px solid '+b,
                  borderRadius:14,padding:'12px',color:m,fontWeight:700,fontSize:13,cursor:'pointer'}}>
                Retake Quiz
              </button>
              <button onClick={()=>nav('/student/test')}
                style={{flex:2,background:'linear-gradient(135deg,'+p+','+a+')',
                  border:'none',borderRadius:14,padding:'12px',
                  color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer'}}>
                Start Preparing
              </button>
            </div>
          </>
        )}

        <div style={{height:80}}/>
      </div>
    </div>
  )
}
