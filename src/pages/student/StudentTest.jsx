// src/pages/student/StudentTest.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import ExplanationPanel from '../../components/student/ExplanationPanel'
import { shareProgress } from '../../lib/shareImage'

const SAMPLE_QUESTIONS = [
  {
    id: 1, subject: 'Polity',
    question: 'Which Amendment removed Right to Property from Fundamental Rights?',
    options: ['42nd Amendment','44th Amendment','46th Amendment','48th Amendment'],
    correct: 1,
    explanation: '44th Amendment 1978 removed Right to Property from Fundamental Rights. It is now a legal right under Article 300A.'
  },
  {
    id: 2, subject: 'History',
    question: 'Who founded the Indian National Congress in 1885?',
    options: ['Bal Gangadhar Tilak','Dadabhai Naoroji','A.O. Hume','Gopal Krishna Gokhale'],
    correct: 2,
    explanation: 'Allan Octavian Hume, a retired British civil servant, founded the Indian National Congress in 1885.'
  },
  {
    id: 3, subject: 'Geography',
    question: 'Which is the longest river in India?',
    options: ['Brahmaputra','Godavari','Ganga','Yamuna'],
    correct: 2,
    explanation: 'The Ganga is the longest river in India at about 2,525 km.'
  },
  {
    id: 4, subject: 'Economy',
    question: 'What does GDP stand for?',
    options: ['Gross Domestic Product','General Domestic Product','Gross Development Product','General Development Policy'],
    correct: 0,
    explanation: 'GDP stands for Gross Domestic Product - total value of goods and services produced in a country in a year.'
  },
  {
    id: 5, subject: 'Science',
    question: 'What is the chemical formula of water?',
    options: ['H2O2','HO2','H2O','H3O'],
    correct: 2,
    explanation: 'Water is H2O - two hydrogen atoms and one oxygen atom.'
  },
  {
    id: 6, subject: 'Polity',
    question: 'Article 32 of the Indian Constitution deals with?',
    options: ['Right to Equality','Right to Constitutional Remedies','Right to Freedom','Right to Education'],
    correct: 1,
    explanation: 'Article 32 gives citizens the right to approach the Supreme Court for enforcement of Fundamental Rights. Dr. Ambedkar called it the heart and soul of the Constitution.'
  },
  {
    id: 7, subject: 'Current Affairs',
    question: 'Which country hosted the G20 Summit in 2023?',
    options: ['USA','China','India','Japan'],
    correct: 2,
    explanation: 'India hosted the G20 Summit 2023 in New Delhi under the theme Vasudhaiva Kutumbakam - One Earth One Family One Future.'
  },
  {
    id: 8, subject: 'Maths',
    question: 'What is 15% of 200?',
    options: ['25','30','35','40'],
    correct: 1,
    explanation: '15% of 200 = (15/100) × 200 = 30'
  },
  {
    id: 9, subject: 'History',
    question: 'The Battle of Plassey was fought in which year?',
    options: ['1757','1764','1775','1799'],
    correct: 0,
    explanation: 'Battle of Plassey was fought on June 23, 1757 between the British East India Company and Siraj ud-Daulah. British victory marked the start of British rule in India.'
  },
  {
    id: 10, subject: 'Science',
    question: 'Which planet is closest to the Sun?',
    options: ['Venus','Earth','Mercury','Mars'],
    correct: 2,
    explanation: 'Mercury is the closest planet to the Sun. It takes only 88 days to complete one orbit around the Sun.'
  },
]

const EXAM_TYPES = [
  { id: 'quick',   label: '⚡ Quick Test',    questions: 10,  time: 10,  desc: '10 questions · 1 min each' },
  { id: 'subject', label: '📚 Subject Test',  questions: 25,  time: 25,  desc: '25 questions · 1 min each' },
  { id: 'mock',    label: '🎯 Full Mock',     questions: 100, time: 108, desc: '100 questions · 108 min (exam time -10%)' },
]

export default function StudentTest() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { user: authUser } = useAuth()

  const isDark  = theme?.isDark ?? false
  const accent  = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primary = theme?.primary ?? '#1E3A5F'
  const primD   = theme?.primaryDark ?? '#0F2140'
  const txt     = theme?.text ?? (isDark ? '#F8FAFC' : '#0F1020')
  const muted   = theme?.textLight ?? (isDark ? 'rgba(255,255,255,0.55)' : '#64748B')
  const card    = theme?.surface ?? (isDark ? 'rgba(255,255,255,0.06)' : '#fff')
  const bdr     = theme?.border ?? (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0')
  const bg      = theme?.background ?? (isDark ? '#0D1117' : '#F0F4F8')

  // Phases: select | active | result
  const [phase,     setPhase]     = useState('select')
  const [examType,  setExamType]  = useState('quick')
  const [questions, setQuestions] = useState([])
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [timeLeft,  setTimeLeft]  = useState(600)
  const [totalTime, setTotalTime] = useState(600)
  const [result,    setResult]    = useState(null)
  const [showExp,   setShowExp]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const timerRef = useRef()

  // Timer
  useEffect(() => {
    if (phase !== 'active') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitTest(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const startTest = () => {
    const type = EXAM_TYPES.find(e => e.id === examType)
    const q = SAMPLE_QUESTIONS.slice(0, Math.min(type.questions, SAMPLE_QUESTIONS.length))
    // 1 min per question for quick/subject, exam time -10% for mock
    const timeSeconds = examType === 'mock'
      ? Math.round(type.time * 60)
      : q.length * 60
    setQuestions(q)
    setAnswers({})
    setCurrent(0)
    setTimeLeft(timeSeconds)
    setTotalTime(timeSeconds)
    setPhase('active')
  }

  const selectAnswer = (qIdx, optIdx) => {
    setAnswers(a => ({ ...a, [qIdx]: optIdx }))
  }

  const submitTest = useCallback(async () => {
    clearInterval(timerRef.current)
    const score = questions.filter((q, i) => answers[i] === q.correct).length
    const total = questions.length
    const pct   = Math.round((score / total) * 100)
    const coins  = Math.round(score * 2)
    const xp     = Math.round(score * 10)

    const res = { score, total, pct, coins, xp,
      timeTaken: totalTime - timeLeft,
      wrongAnswers: questions.filter((q, i) => answers[i] !== undefined && answers[i] !== q.correct),
      unattempted: questions.filter((_, i) => answers[i] === undefined).length,
    }
    setResult(res)
    setPhase('result')

    // Save to Supabase
    if (authUser) {
      setSaving(true)
      const uid = authUser.id || authUser.userId
      try {
        await supabase.from('test_attempts').insert({
          user_id: uid,
          exam_name: `${EXAM_TYPES.find(e=>e.id===examType)?.label} - General`,
          subject: 'Mixed',
          score, total,
          time_taken: totalTime - timeLeft,
          coins_earned: coins,
          xp_earned: xp,
        })
        // Update coins + xp
        await supabase.rpc('add_coins', { p_user_id: uid, p_amount: coins, p_reason: 'Test completed' })
        await supabase.from('profiles').update({
          xp: supabase.raw(`xp + ${xp}`),
          coins: supabase.raw(`coins + ${coins}`),
        }).eq('id', uid)
        // Update streak
        await supabase.rpc('update_streak', { p_user_id: uid })
        // Update free usage
        await supabase.from('free_usage_tracker').upsert({
          user_id: uid,
          tests_today: supabase.raw('tests_today + 1'),
          total_tests: supabase.raw('total_tests + 1'),
          last_reset: new Date().toISOString().split('T')[0],
        })
      } catch(e) { console.error(e) }
      finally { setSaving(false) }
    }
  }, [questions, answers, timeLeft, totalTime, examType, authUser])

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`
  const timePct = (timeLeft / totalTime) * 100
  const timeColor = timePct > 50 ? '#4ADE80' : timePct > 25 ? '#F59E0B' : '#F87171'
  const q = questions[current]
  const answered = Object.keys(answers).length

  // Share result
  const shareResult = () => {
    shareProgress({
      theme,
      name: authUser?.name || 'Student',
      headline: `Scored ${result?.pct}% on my TryIT test`,
      stat: `${result?.score}/${result?.total}`,
      subLabel: 'Test Result',
      context: 'Test Engine',
      emoji: '📝',
    })
  }

  return (
    <div style={{ minHeight:'100vh', background:bg, fontFamily:'Inter,sans-serif' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 20px',
        background:isDark?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.9)',
        backdropFilter:'blur(20px)', borderBottom:`1px solid ${bdr}`,
        position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => phase==='active' ? (window.confirm('Exit test? Progress will be lost.') && navigate('/student')) : navigate('/student')}
            style={{ background:card, border:`1px solid ${bdr}`, borderRadius:10,
              width:38, height:38, cursor:'pointer', color:txt, fontSize:18,
              display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div>
            <p style={{ color:txt, fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17, margin:0 }}>
              📝 Test Engine
            </p>
            {phase === 'active' && (
              <p style={{ color:muted, fontSize:11, margin:0 }}>
                Q{current+1}/{questions.length} · {answered} answered
              </p>
            )}
          </div>
        </div>
        {phase === 'active' && (
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ textAlign:'center' }}>
              <p style={{ color:timeColor, fontFamily:'Poppins,sans-serif',
                fontWeight:900, fontSize:20, margin:0 }}>{formatTime(timeLeft)}</p>
              <div style={{ width:80, height:3, background:'rgba(255,255,255,0.1)',
                borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${timePct}%`,
                  background:timeColor, borderRadius:2, transition:'width 1s linear' }}/>
              </div>
            </div>
            <button onClick={() => { if(window.confirm('Submit test now?')) submitTest() }}
              style={{ background:`linear-gradient(135deg,${accent},${accentL})`,
                border:'none', borderRadius:10, padding:'8px 14px',
                color:primD, fontWeight:700, fontSize:12, cursor:'pointer' }}>
              Submit
            </button>
          </div>
        )}
      </div>

      {/* -- SELECT PHASE --------------------------------------- */}
      {phase === 'select' && (
        <div style={{ maxWidth:600, margin:'0 auto', padding:'24px' }}>
          <p style={{ color:txt, fontFamily:'Poppins,sans-serif',
            fontWeight:800, fontSize:22, margin:'0 0 6px' }}>Choose Test Type</p>
          <p style={{ color:muted, fontSize:13, margin:'0 0 24px' }}>
            All tests are scored and ranked All-India
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
            {EXAM_TYPES.map(e => (
              <button key={e.id} onClick={() => setExamType(e.id)} style={{
                background: examType===e.id
                  ? `linear-gradient(135deg,${primary},${primD})`
                  : card,
                border: `2px solid ${examType===e.id ? accent : bdr}`,
                borderRadius:16, padding:'16px 20px', cursor:'pointer',
                textAlign:'left', transition:'all 0.15s',
                boxShadow: examType===e.id ? `0 8px 24px ${accent}22` : 'none' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ color: examType===e.id ? '#fff' : txt,
                      fontFamily:'Poppins,sans-serif', fontWeight:700,
                      fontSize:15, margin:'0 0 4px' }}>{e.label}</p>
                    <p style={{ color: examType===e.id ? 'rgba(255,255,255,0.6)' : muted,
                      fontSize:12, margin:0 }}>{e.desc}</p>
                  </div>
                  {examType===e.id && (
                    <div style={{ width:24, height:24, borderRadius:'50%',
                      background:accent, display:'flex', alignItems:'center',
                      justifyContent:'center', color:primD, fontSize:14, fontWeight:900 }}>✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div style={{ background:`${accent}10`, border:`1px solid ${accent}25`,
            borderRadius:14, padding:'12px 16px', marginBottom:20 }}>
            <p style={{ color:accent, fontWeight:700, fontSize:12, margin:'0 0 4px' }}>
              🪙 Earn coins for every test
            </p>
            <p style={{ color:muted, fontSize:11, margin:0 }}>
              2 coins per correct answer · +30 bonus if score above 80%
            </p>
          </div>

          <button onClick={startTest} style={{
            width:'100%', background:`linear-gradient(135deg,${accent},${accentL})`,
            border:'none', borderRadius:14, padding:'14px',
            color:primD, fontWeight:800, fontSize:16, cursor:'pointer',
            boxShadow:`0 6px 24px ${accent}44` }}>
            Start Test →
          </button>
        </div>
      )}

      {/* -- ACTIVE PHASE --------------------------------------- */}
      {phase === 'active' && q && (
        <div style={{ maxWidth:700, margin:'0 auto', padding:'20px' }}>

          {/* Progress bar */}
          <div style={{ height:4, background:'rgba(255,255,255,0.08)',
            borderRadius:2, marginBottom:20, overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:2,
              width:`${((current+1)/questions.length)*100}%`,
              background:`linear-gradient(90deg,${accent},${accentL})`,
              transition:'width 0.3s ease' }}/>
          </div>

          {/* Question card */}
          <div style={{ background:card, border:`1px solid ${bdr}`,
            borderRadius:20, padding:'24px', marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between',
              alignItems:'center', marginBottom:12 }}>
              <span style={{ background:`${accent}18`, color:accent,
                fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>
                {q.subject}
              </span>
              <span style={{ color:muted, fontSize:11 }}>Q{current+1} of {questions.length}</span>
            </div>
            <p style={{ color:txt, fontSize:16, fontWeight:600,
              lineHeight:1.6, margin:0 }}>{q.question}</p>
          </div>

          {/* Options */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {q.options.map((opt, i) => {
              const selected = answers[current] === i
              return (
                <button key={i} onClick={() => selectAnswer(current, i)}
                  style={{
                    padding:'14px 18px', borderRadius:14, cursor:'pointer',
                    textAlign:'left', transition:'all 0.15s',
                    border:`2px solid ${selected ? accent : bdr}`,
                    background: selected
                      ? `linear-gradient(135deg,${accent}22,${accent}10)`
                      : card,
                    boxShadow: selected ? `0 4px 16px ${accent}22` : 'none',
                    display:'flex', alignItems:'center', gap:12 }}
                  onMouseEnter={e => { if(!selected) { e.currentTarget.style.border=`2px solid ${accent}50`; e.currentTarget.style.transform='translateX(4px)' }}}
                  onMouseLeave={e => { if(!selected) { e.currentTarget.style.border=`2px solid ${bdr}`; e.currentTarget.style.transform='translateX(0)' }}}>
                  <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0,
                    background: selected ? `linear-gradient(135deg,${accent},${accentL})` : isDark?'rgba(255,255,255,0.06)':'#F1F5F9',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:900, fontSize:13,
                    color: selected ? primD : muted }}>
                    {String.fromCharCode(65+i)}
                  </div>
                  <span style={{ color:selected ? accent : txt,
                    fontSize:14, fontWeight: selected ? 700 : 400 }}>{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div style={{ display:'flex', justifyContent:'space-between',
            alignItems:'center', marginTop:20 }}>
            <button onClick={() => setCurrent(c => Math.max(0, c-1))}
              disabled={current===0}
              style={{ background:card, border:`1px solid ${bdr}`,
                borderRadius:12, padding:'10px 20px', cursor:current===0?'not-allowed':'pointer',
                color:current===0?'rgba(255,255,255,0.2)':txt,
                fontWeight:700, fontSize:13, opacity:current===0?0.4:1 }}>
              ← Previous
            </button>

            {/* Question dots */}
            <div style={{ display:'flex', gap:4, flexWrap:'wrap', justifyContent:'center',
              maxWidth:200 }}>
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} style={{
                  width:8, height:8, borderRadius:'50%', border:'none',
                  cursor:'pointer', padding:0,
                  background: i===current ? accent
                    : answers[i]!==undefined ? `${accent}60`
                    : isDark?'rgba(255,255,255,0.15)':'#CBD5E1' }}/>
              ))}
            </div>

            {current < questions.length-1 ? (
              <button onClick={() => setCurrent(c => c+1)}
                style={{ background:`linear-gradient(135deg,${accent},${accentL})`,
                  border:'none', borderRadius:12, padding:'10px 20px',
                  color:primD, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                Next →
              </button>
            ) : (
              <button onClick={() => { if(window.confirm('Submit test now?')) submitTest() }}
                style={{ background:`linear-gradient(135deg,#4ADE80,#22C55E)`,
                  border:'none', borderRadius:12, padding:'10px 20px',
                  color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer',
                  boxShadow:'0 4px 16px rgba(74,222,128,0.4)' }}>
                ✅ Submit
              </button>
            )}
          </div>
        </div>
      )}

      {/* -- RESULT PHASE --------------------------------------- */}
      {phase === 'result' && result && (
        <div style={{ maxWidth:600, margin:'0 auto', padding:'24px' }}>

          {/* Score card */}
          <div style={{ background:`linear-gradient(135deg,${primary},${primD})`,
            borderRadius:24, padding:'28px', marginBottom:20, textAlign:'center',
            border:`1px solid ${accent}25`,
            boxShadow:`0 12px 40px ${primary}40` }}>
            <p style={{ color:accent, fontSize:10, fontWeight:700,
              letterSpacing:'2px', margin:'0 0 12px' }}>TEST COMPLETE</p>
            <div style={{ width:100, height:100, borderRadius:'50%', margin:'0 auto 16px',
              background: result.pct>=80?'rgba(74,222,128,0.15)':result.pct>=60?`${accent}15`:'rgba(248,113,113,0.15)',
              border:`4px solid ${result.pct>=80?'#4ADE80':result.pct>=60?accent:'#F87171'}`,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{ color:result.pct>=80?'#4ADE80':result.pct>=60?accent:'#F87171',
                fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28, margin:0 }}>
                {result.pct}%
              </p>
            </div>
            <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif',
              fontWeight:800, fontSize:22, margin:'0 0 4px' }}>
              {result.pct>=80?'Excellent! 🏆':result.pct>=60?'Good Job! 👍':'Keep Practicing! 💪'}
            </p>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, margin:'0 0 20px' }}>
              {result.score} correct out of {result.total} questions
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[
                { label:'Score', val:`${result.score}/${result.total}`, icon:'📝' },
                { label:'Coins Earned', val:`+${result.coins}🪙`, icon:'💰' },
                { label:'XP Earned', val:`+${result.xp}`, icon:'⭐' },
              ].map((s,i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.07)',
                  borderRadius:12, padding:'10px' }}>
                  <p style={{ fontSize:18, margin:'0 0 4px' }}>{s.icon}</p>
                  <p style={{ color:accent, fontFamily:'Poppins,sans-serif',
                    fontWeight:900, fontSize:15, margin:'0 0 2px' }}>{s.val}</p>
                  <p style={{ color:'rgba(255,255,255,0.35)', fontSize:9, margin:0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
            <button onClick={() => { setPhase('select'); setResult(null) }}
              style={{ background:`linear-gradient(135deg,${accent},${accentL})`,
                border:'none', borderRadius:14, padding:'14px',
                color:primD, fontWeight:800, fontSize:14, cursor:'pointer' }}>
              🔄 Retry
            </button>
            <button onClick={shareResult}
              style={{ background:card, border:`1px solid ${bdr}`,
                borderRadius:14, padding:'14px',
                color:txt, fontWeight:700, fontSize:14, cursor:'pointer' }}>
              📤 Share Score
            </button>
            <button onClick={() => setShowExp(!showExp)}
              style={{ background:card, border:`1px solid ${bdr}`,
                borderRadius:14, padding:'14px',
                color:txt, fontWeight:700, fontSize:14, cursor:'pointer' }}>
              {showExp ? '🔼 Hide' : '📖 Explanation'}
            </button>
            <button onClick={() => navigate('/student/rank')}
              style={{ background:`linear-gradient(135deg,${primary},${primD})`,
                border:`1px solid ${accent}25`, borderRadius:14, padding:'14px',
                color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>
              🏆 View Rank
            </button>
          </div>

          {/* Explanations */}
          {showExp && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {questions.map((q, i) => {
                const userAns = answers[i]
                const correct = q.correct
                const isRight = userAns === correct
                const isSkip  = userAns === undefined
                return (
                  <div key={i} style={{ background:card, border:`1px solid ${bdr}`,
                    borderRadius:16, padding:'16px',
                    borderLeft:`4px solid ${isRight?'#4ADE80':isSkip?muted:'#F87171'}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between',
                      alignItems:'center', marginBottom:8 }}>
                      <span style={{ color:muted, fontSize:11 }}>Q{i+1} · {q.subject}</span>
                      <span style={{ fontSize:14 }}>{isRight?'✅':isSkip?'⏭️':'❌'}</span>
                    </div>
                    <p style={{ color:txt, fontSize:13, fontWeight:600,
                      margin:'0 0 10px', lineHeight:1.5 }}>{q.question}</p>
                    {!isSkip && (
                      <p style={{ color:isRight?'#4ADE80':'#F87171',
                        fontSize:12, margin:'0 0 6px', fontWeight:600 }}>
                        Your answer: {q.options[userAns]}
                      </p>
                    )}
                    <p style={{ color:'#4ADE80', fontSize:12, margin:'0 0 8px', fontWeight:600 }}>
                      Correct: {q.options[correct]}
                    </p>
                    <p style={{ color:muted, fontSize:12, margin:0, lineHeight:1.6 }}>
                      💡 {q.explanation}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          <button onClick={() => navigate('/student')}
            style={{ width:'100%', marginTop:16, background:'transparent',
              border:`1px solid ${bdr}`, borderRadius:14, padding:'12px',
              color:muted, fontWeight:700, fontSize:14, cursor:'pointer' }}>
            ← Back to Dashboard
          </button>
        </div>
      )}
    </div>
  )
}


