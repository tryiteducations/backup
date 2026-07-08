// src/pages/student/StudentExamRoom.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { testEnrollment } from '../../lib/testEnrollment'

function fmtCountdown(ms) {
  if (ms <= 0) return '00:00'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

function Centered({ bg, m, children }) {
  return (
    <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:m,fontSize:14,fontFamily:'Poppins,sans-serif'}}>{children}</p>
    </div>
  )
}

export default function StudentExamRoom() {
  const { enrollmentId } = useParams()
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'

  const [phase, setPhase] = useState('loading')
  const [enrollment, setEnrollment] = useState(null)
  const [test, setTest] = useState(null)
  const [error, setError] = useState('')
  const [examData, setExamData] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [result, setResult] = useState(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const loadQuestionsForExam = async (testId, questionOrder) => {
    const { data } = await supabase
      .from('question_bank')
      .select('id, question_text, question_image_url, options, marks, topic')
      .eq('test_id', testId)
    const byId = new Map((data || []).map(q => [q.id, q]))
    setQuestions((questionOrder || []).map(id => byId.get(id)).filter(Boolean))
  }

  const load = useCallback(async () => {
    if (!user?.id) return
    const { data: enr } = await supabase.from('test_enrollments').select('*').eq('id', enrollmentId).single()
    if (!enr) { setError('Enrollment not found.'); setPhase('error'); return }
    setEnrollment(enr)
    const { data: te } = await supabase.from('institution_tests').select('*').eq('id', enr.test_id).single()
    setTest(te)

    if (enr.status === 'submitted') {
      setResult({ score: enr.score, institution_rank: enr.institution_rank, all_india_rank: enr.all_india_rank })
      setPhase('submitted')
      return
    }
    if (enr.exam_token) {
      await loadQuestionsForExam(enr.test_id, enr.question_order)
      setExamData({ token: enr.exam_token, question_order: enr.question_order, option_orders: enr.option_orders,
        started_at: enr.started_at, duration_minutes: te.duration_minutes })
      setAnswers(enr.answers || {})
      setPhase('active')
      return
    }
    setPhase('waiting')
  }, [enrollmentId, user?.id])

  useEffect(() => { load() }, [load])

  const enterExam = async () => {
    setPhase('starting')
    setError('')
    try {
      const data = await testEnrollment.startExam(enrollmentId, user.id)
      setExamData(data)
      await loadQuestionsForExam(enrollment.test_id, data.question_order)
      setPhase('active')
    } catch (e) {
      setError(e.message || 'Could not start the exam.')
      setPhase('waiting')
    }
  }

  const selectAnswer = (questionId, label) => {
    setAnswers(prev => ({ ...prev, [questionId]: label }))
  }

  const handleSubmit = useCallback(async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    try {
      const data = await testEnrollment.submitExam(enrollmentId, user.id, examData.token, answers)
      setResult(data)
      setPhase('submitted')
    } catch (e) {
      setError(e.message || 'Could not submit - please try again.')
      submittingRef.current = false
    }
  }, [enrollmentId, user, examData, answers])

  useEffect(() => {
    if (phase !== 'active' || !examData) return
    const deadline = new Date(examData.started_at).getTime() + examData.duration_minutes * 60000
    if (now >= deadline) handleSubmit()
  }, [now, phase, examData, handleSubmit])

  if (phase === 'loading') return <Centered bg={bg} m={m}>Loading...</Centered>
  if (phase === 'error') return <Centered bg={bg} m={m}>{error || 'Something went wrong.'}</Centered>

  if (phase === 'waiting') {
    const start = test ? new Date(test.scheduled_start).getTime() : 0
    const canEnter = now >= start
    return (
      <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'Poppins,sans-serif'}}>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:32,maxWidth:400,textAlign:'center'}}>
          <p style={{fontSize:40,marginBottom:10}}>🎓</p>
          <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 8px'}}>{test?.name}</p>
          {!canEnter ? (
            <>
              <p style={{color:m,fontSize:13,margin:'0 0 16px'}}>Your exam starts in</p>
              <p style={{fontFamily:'monospace',fontWeight:800,fontSize:28,color:p,margin:'0 0 16px'}}>
                {fmtCountdown(start - now)}
              </p>
              <p style={{color:m,fontSize:11}}>This page will let you in automatically at the start time.</p>
            </>
          ) : (
            <>
              <p style={{color:'#22C55E',fontSize:13,fontWeight:700,margin:'0 0 16px'}}>✓ Your exam is live now</p>
              {error && <p style={{color:'#DC2626',fontSize:12,marginBottom:12}}>{error}</p>}
              <button onClick={enterExam}
                style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
                  padding:'14px 28px',color:'#fff',fontWeight:800,fontSize:15,cursor:'pointer',width:'100%'}}>
                Enter Exam Hall →
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'starting') return <Centered bg={bg} m={m}>Setting up your exam paper...</Centered>

  if (phase === 'submitted') {
    return (
      <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'Poppins,sans-serif'}}>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:32,maxWidth:420,textAlign:'center'}}>
          <p style={{fontSize:40,marginBottom:10}}>✅</p>
          <p style={{color:t,fontWeight:800,fontSize:18,margin:'0 0 4px'}}>Test Submitted</p>
          <p style={{color:m,fontSize:13,margin:'0 0 20px'}}>Your answers have been recorded and scored.</p>
          {result?.score != null && (
            <div style={{background:`${p}0a`,borderRadius:14,padding:16,marginBottom:16}}>
              <p style={{color:p,fontWeight:800,fontSize:24,margin:'0 0 4px'}}>{result.score} marks</p>
              {result.all_india_rank && <p style={{color:m,fontSize:12,margin:0}}>All-India Rank: #{result.all_india_rank}</p>}
              {result.institution_rank && <p style={{color:m,fontSize:12,margin:0}}>Institution Rank: #{result.institution_rank}</p>}
            </div>
          )}
          <button onClick={()=>nav('/student/live-tests')}
            style={{background:'transparent',border:`1px solid ${b}`,borderRadius:12,padding:'11px 20px',
              color:m,fontWeight:600,fontSize:13,cursor:'pointer'}}>
            Back to Live Tests
          </button>
        </div>
      </div>
    )
  }

  const deadline = examData ? new Date(examData.started_at).getTime() + examData.duration_minutes * 60000 : now
  const timeLeft = deadline - now
  const q = questions[currentIdx]
  const answeredCount = Object.keys(answers).length

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'14px 20px',position:'sticky',top:0,zIndex:10,
        display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <div>
          <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>{test?.name}</p>
          <p style={{color:m,fontSize:11,margin:0}}>{answeredCount}/{questions.length} answered</p>
        </div>
        <span style={{fontFamily:'monospace',fontWeight:800,fontSize:18,
          color:timeLeft < 60000 ? '#DC2626' : p}}>
          ⏱ {fmtCountdown(timeLeft)}
        </span>
      </div>

      <div style={{padding:20,maxWidth:640,margin:'0 auto'}}>
        {error && <p style={{color:'#DC2626',fontSize:12,textAlign:'center',marginBottom:10}}>{error}</p>}

        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
          {questions.map((qq, i) => (
            <button key={qq.id} onClick={()=>setCurrentIdx(i)}
              style={{width:30,height:30,borderRadius:8,border:`1px solid ${answers[qq.id]?a:b}`,
                background:i===currentIdx?p:answers[qq.id]?`${a}22`:'transparent',
                color:i===currentIdx?'#fff':t,fontSize:11,fontWeight:700,cursor:'pointer'}}>
              {i+1}
            </button>
          ))}
        </div>

        {q && (
          <div style={{background:c,border:`1px solid ${b}`,borderRadius:16,padding:20}}>
            <p style={{color:m,fontSize:11,marginBottom:8}}>Question {currentIdx+1} of {questions.length} · {q.marks} mark{q.marks>1?'s':''}</p>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 14px',lineHeight:1.6}}>{q.question_text}</p>
            {q.question_image_url && (
              <img src={q.question_image_url} alt="" style={{maxWidth:'100%',borderRadius:10,marginBottom:14,border:`1px solid ${b}`}}/>
            )}
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {(q.options || []).map(opt => (
                <button key={opt.label} onClick={()=>selectAnswer(q.id, opt.label)}
                  style={{textAlign:'left',padding:'12px 16px',borderRadius:12,
                    border:`1.5px solid ${answers[q.id]===opt.label?p:b}`,
                    background:answers[q.id]===opt.label?`${p}10`:'transparent',
                    color:t,fontSize:13,cursor:'pointer',display:'flex',gap:10,alignItems:'center'}}>
                  <span style={{width:22,height:22,borderRadius:'50%',border:`1.5px solid ${answers[q.id]===opt.label?p:b}`,
                    background:answers[q.id]===opt.label?p:'transparent',color:answers[q.id]===opt.label?'#fff':m,
                    fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {opt.label}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{display:'flex',gap:8,marginTop:16}}>
          <button onClick={()=>setCurrentIdx(i=>Math.max(0,i-1))} disabled={currentIdx===0}
            style={{flex:1,background:'transparent',border:`1px solid ${b}`,borderRadius:12,padding:'12px',
              color:m,fontWeight:600,fontSize:13,cursor:currentIdx===0?'not-allowed':'pointer',opacity:currentIdx===0?0.5:1}}>
            ← Previous
          </button>
          {currentIdx < questions.length - 1 ? (
            <button onClick={()=>setCurrentIdx(i=>i+1)}
              style={{flex:1,background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
                padding:'12px',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              Next →
            </button>
          ) : (
            <button onClick={()=>handleSubmit()}
              style={{flex:1,background:'#22C55E',border:'none',borderRadius:12,
                padding:'12px',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              ✅ Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
