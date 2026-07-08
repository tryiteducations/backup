// src/pages/institution/InstitutionTests.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { testEnrollment } from '../../lib/testEnrollment'

function fmtDateTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_LABEL = {
  enrolled: { label: 'Enrolled', color: '#64748B' },
  admitted: { label: 'Admitted', color: '#0891B2' },
  attended: { label: 'Attended', color: '#F59E0B' },
  submitted: { label: 'Submitted', color: '#22C55E' },
  absent: { label: 'Absent', color: '#DC2626' },
}

export default function InstitutionTests() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'

  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [viewingRoster, setViewingRoster] = useState(null)
  const [roster, setRoster] = useState([])
  const [managingQuestions, setManagingQuestions] = useState(null)
  const [questions, setQuestions] = useState([])
  const [qForm, setQForm] = useState({ questionType:'mcq', questionText:'', optA:'', optB:'', optC:'', optD:'', correct:'A', marks:1 })
  const [addingQ, setAddingQ] = useState(false)
  const [gradingTestId, setGradingTestId] = useState(null)
  const [ungraded, setUngraded] = useState([])
  const [publishing, setPublishing] = useState(null)

  const [form, setForm] = useState({
    name: '', exam: '', subject: '', city: '', scheduledStart: '', durationMinutes: 60,
  })

  const load = async () => {
    if (!user?.id) return
    setLoading(true)
    const data = await testEnrollment.getMyTests(user.id)
    setTests(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [user?.id])

  const handleCreate = async () => {
    if (!form.name.trim() || !form.exam || !form.scheduledStart || !user?.id) return
    setError('')
    setCreating(true)
    try {
      const result = await testEnrollment.createTest(user.id, {
        name: form.name.trim(), exam: form.exam, subject: form.subject,
        city: form.city, scheduledStart: form.scheduledStart,
        durationMinutes: parseInt(form.durationMinutes) || 60,
      })
      if (!result) throw new Error('Could not create the test - please try again.')
      setShowCreate(false)
      setForm({ name:'', exam:'', subject:'', city:'', scheduledStart:'', durationMinutes:60 })
      await load()
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setCreating(false)
    }
  }

  const openRoster = async (testId) => {
    setViewingRoster(testId)
    const data = await testEnrollment.getTestRoster(testId)
    setRoster(data)
  }

  const openQuestions = async (testId) => {
    setManagingQuestions(testId)
    const data = await testEnrollment.getQuestions(testId)
    setQuestions(data)
  }

  const addQuestion = async () => {
    if (!qForm.questionText.trim()) return
    if (qForm.questionType === 'mcq' && (!qForm.optA.trim() || !qForm.optB.trim())) return
    setAddingQ(true)
    const options = qForm.questionType === 'mcq' ? [
      { label:'A', text: qForm.optA.trim() },
      { label:'B', text: qForm.optB.trim() },
      ...(qForm.optC.trim() ? [{ label:'C', text: qForm.optC.trim() }] : []),
      ...(qForm.optD.trim() ? [{ label:'D', text: qForm.optD.trim() }] : []),
    ] : null
    const result = await testEnrollment.addQuestion(managingQuestions, {
      questionText: qForm.questionText.trim(), options,
      correctAnswer: qForm.questionType === 'mcq' ? qForm.correct : null,
      marks: parseFloat(qForm.marks) || 1, questionType: qForm.questionType,
    })
    if (result) {
      setQuestions(prev => [...prev, result])
      setQForm({ questionType:'mcq', questionText:'', optA:'', optB:'', optC:'', optD:'', correct:'A', marks:1 })
    }
    setAddingQ(false)
  }

  const removeQuestion = async (questionId) => {
    await testEnrollment.deleteQuestion(questionId)
    setQuestions(prev => prev.filter(q => q.id !== questionId))
  }

  const openGrading = async (testId) => {
    setGradingTestId(testId)
    const data = await testEnrollment.getUngradedAnswers(testId)
    setUngraded(data)
  }

  const gradeOne = async (answerId, marks) => {
    await testEnrollment.gradeAnswer(answerId, parseFloat(marks) || 0, user.id)
    setUngraded(prev => prev.filter(a => a.id !== answerId))
  }

  const handlePublishResults = async (testId) => {
    setPublishing(testId)
    await testEnrollment.publishResults(testId)
    setPublishing(null)
    await load()
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/institution')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>📋 Live Tests</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Conduct tests for your enrolled students</p>
        </div>
        <button onClick={()=>setShowCreate(true)}
          style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
            padding:'9px 18px',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>
          + New Test
        </button>
      </div>

      <div style={{padding:'20px',maxWidth:800,margin:'0 auto'}}>

        {loading && <p style={{textAlign:'center',color:m,fontSize:13,padding:20}}>Loading your tests...</p>}
        {!loading && tests.length===0 && (
          <div style={{textAlign:'center',padding:'40px 20px',background:c,border:`1.5px dashed ${b}`,borderRadius:18}}>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 6px'}}>No tests scheduled yet</p>
            <p style={{color:m,fontSize:12,margin:0}}>Create your first live test - only students linked to your institution can enroll.</p>
          </div>
        )}

        {tests.map(test => (
          <div key={test.id} style={{background:c,border:`1px solid ${b}`,borderRadius:16,padding:16,marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div>
                <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 3px'}}>{test.name}</p>
                <p style={{color:m,fontSize:11,margin:0}}>{test.exam} · {test.subject}</p>
              </div>
              <span style={{background:`${a}18`,color:a,fontSize:9,fontWeight:700,padding:'3px 10px',borderRadius:20}}>
                {test.status}
              </span>
            </div>
            <p style={{color:m,fontSize:12,margin:'0 0 10px'}}>
              🕐 {fmtDateTime(test.scheduled_start)} · ⏱ {test.duration_minutes} mins ·
              🔒 Enrollment closes {fmtDateTime(test.enrollment_closes_at)}
            </p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <button onClick={()=>openRoster(test.id)}
                style={{background:`${p}10`,border:`1px solid ${p}30`,borderRadius:10,
                  padding:'8px 16px',color:p,fontWeight:600,fontSize:12,cursor:'pointer'}}>
                View Enrolled Students →
              </button>
              <button onClick={()=>openQuestions(test.id)}
                style={{background:`${a}10`,border:`1px solid ${a}30`,borderRadius:10,
                  padding:'8px 16px',color:a,fontWeight:600,fontSize:12,cursor:'pointer'}}>
                📝 Manage Questions →
              </button>
              <button onClick={()=>nav(`/institution/tests/${test.id}/upload-paper`)}
                style={{background:'#0891B210',border:'1px solid #0891B230',borderRadius:10,
                  padding:'8px 16px',color:'#0891B2',fontWeight:600,fontSize:12,cursor:'pointer'}}>
                📄 Upload Paper →
              </button>
              <button onClick={()=>openGrading(test.id)}
                style={{background:'#7C3AED10',border:'1px solid #7C3AED30',borderRadius:10,
                  padding:'8px 16px',color:'#7C3AED',fontWeight:600,fontSize:12,cursor:'pointer'}}>
                ✍️ Grading Queue →
              </button>
              {!test.results_published && (
                <button onClick={()=>handlePublishResults(test.id)} disabled={publishing===test.id}
                  style={{background:'#22C55E',border:'none',borderRadius:10,
                    padding:'8px 16px',color:'#fff',fontWeight:700,fontSize:12,cursor:publishing===test.id?'wait':'pointer'}}>
                  {publishing===test.id ? 'Publishing...' : '📢 Publish Results'}
                </button>
              )}
              {test.results_published && (
                <span style={{color:'#22C55E',fontSize:12,fontWeight:700,display:'flex',alignItems:'center'}}>✓ Results Published</span>
              )}
            </div>

            {viewingRoster === test.id && (
              <div style={{marginTop:14,borderTop:`1px solid ${b}`,paddingTop:14}}>
                {roster.length === 0 && <p style={{color:m,fontSize:12}}>No students enrolled yet.</p>}
                {roster.map(r => (
                  <div key={r.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                    padding:'8px 0',borderBottom:`1px solid ${b}`}}>
                    <div>
                      <p style={{color:t,fontSize:13,fontWeight:600,margin:0}}>{r.student?.name || 'Student'}</p>
                      <p style={{color:m,fontSize:10,margin:0,fontFamily:'monospace'}}>{r.enrollment_code}</p>
                    </div>
                    <span style={{color:STATUS_LABEL[r.status]?.color||m,fontSize:11,fontWeight:700}}>
                      {STATUS_LABEL[r.status]?.label || r.status}
                      {r.score != null && ` · ${r.score} marks`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div style={{height:60}}/>
      </div>

      {gradingTestId && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',
          alignItems:'center',justifyContent:'center',padding:20,zIndex:999}}
          onClick={()=>setGradingTestId(null)}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:c,borderRadius:20,padding:24,maxWidth:560,width:'100%',maxHeight:'85vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <p style={{color:t,fontWeight:800,fontSize:16,margin:0}}>Grading Queue ({ungraded.length} pending)</p>
              <button onClick={()=>setGradingTestId(null)}
                style={{background:'transparent',border:'none',color:m,fontSize:20,cursor:'pointer'}}>×</button>
            </div>
            {ungraded.length === 0 && <p style={{color:m,fontSize:13,textAlign:'center',padding:20}}>Nothing to grade right now.</p>}
            {ungraded.map(ans => (
              <GradingCard key={ans.id} answer={ans} onGrade={gradeOne} p={p} a={a} t={t} m={m} b={b} bg={bg} />
            ))}
          </div>
        </div>
      )}

      {managingQuestions && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',
          alignItems:'center',justifyContent:'center',padding:20,zIndex:999}}
          onClick={()=>setManagingQuestions(null)}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:c,borderRadius:20,padding:24,maxWidth:520,width:'100%',maxHeight:'85vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <p style={{color:t,fontWeight:800,fontSize:16,margin:0}}>Question Bank ({questions.length})</p>
              <button onClick={()=>setManagingQuestions(null)}
                style={{background:'transparent',border:'none',color:m,fontSize:20,cursor:'pointer'}}>×</button>
            </div>

            {questions.map((q,i) => (
              <div key={q.id} style={{background:bg,border:`1px solid ${b}`,borderRadius:12,padding:12,marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',gap:8}}>
                  <p style={{color:t,fontSize:13,fontWeight:600,margin:'0 0 6px',flex:1}}>{i+1}. {q.question_text}</p>
                  <button onClick={()=>removeQuestion(q.id)}
                    style={{background:'transparent',border:'none',color:'#DC2626',cursor:'pointer',fontSize:16,flexShrink:0}}>🗑</button>
                </div>
                {(q.options||[]).map(o => (
                  <p key={o.label} style={{fontSize:12,margin:'2px 0',
                    color: o.label===q.correct_answer ? '#22C55E' : m,
                    fontWeight: o.label===q.correct_answer ? 700 : 400}}>
                    {o.label}. {o.text} {o.label===q.correct_answer && '✓'}
                  </p>
                ))}
              </div>
            ))}

            <div style={{borderTop:`1px solid ${b}`,paddingTop:14,marginTop:14}}>
              <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 10px'}}>Add a question</p>
              <div style={{display:'flex',gap:8,marginBottom:10}}>
                {['mcq','descriptive'].map(type => (
                  <button key={type} onClick={()=>setQForm(f=>({...f,questionType:type}))}
                    style={{flex:1,padding:'8px',borderRadius:8,border:'none',cursor:'pointer',
                      fontSize:12,fontWeight:700,
                      background:qForm.questionType===type?`linear-gradient(135deg,${p},${a})`:`${b}`,
                      color:qForm.questionType===type?'#fff':m}}>
                    {type === 'mcq' ? 'Multiple Choice' : 'Descriptive (manually graded)'}
                  </button>
                ))}
              </div>
              <textarea value={qForm.questionText} onChange={e=>setQForm(f=>({...f,questionText:e.target.value}))}
                placeholder="Question text"
                rows={2}
                style={{width:'100%',padding:'10px 12px',borderRadius:10,border:`1.5px solid ${b}`,
                  marginBottom:8,fontSize:13,boxSizing:'border-box',resize:'vertical'}}/>
              {qForm.questionType === 'mcq' && (
                <>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                    <input value={qForm.optA} onChange={e=>setQForm(f=>({...f,optA:e.target.value}))} placeholder="Option A"
                      style={{padding:'9px 12px',borderRadius:10,border:`1.5px solid ${b}`,fontSize:12,boxSizing:'border-box'}}/>
                    <input value={qForm.optB} onChange={e=>setQForm(f=>({...f,optB:e.target.value}))} placeholder="Option B"
                      style={{padding:'9px 12px',borderRadius:10,border:`1.5px solid ${b}`,fontSize:12,boxSizing:'border-box'}}/>
                    <input value={qForm.optC} onChange={e=>setQForm(f=>({...f,optC:e.target.value}))} placeholder="Option C (optional)"
                      style={{padding:'9px 12px',borderRadius:10,border:`1.5px solid ${b}`,fontSize:12,boxSizing:'border-box'}}/>
                    <input value={qForm.optD} onChange={e=>setQForm(f=>({...f,optD:e.target.value}))} placeholder="Option D (optional)"
                      style={{padding:'9px 12px',borderRadius:10,border:`1.5px solid ${b}`,fontSize:12,boxSizing:'border-box'}}/>
                  </div>
                  <div style={{display:'flex',gap:8,marginBottom:10,alignItems:'center'}}>
                    <label style={{fontSize:12,color:m}}>Correct answer:</label>
                    <select value={qForm.correct} onChange={e=>setQForm(f=>({...f,correct:e.target.value}))}
                      style={{padding:'7px 10px',borderRadius:8,border:`1.5px solid ${b}`,fontSize:12}}>
                      <option value="A">A</option><option value="B">B</option>
                      <option value="C">C</option><option value="D">D</option>
                    </select>
                    <label style={{fontSize:12,color:m,marginLeft:10}}>Marks:</label>
                    <input type="number" value={qForm.marks} onChange={e=>setQForm(f=>({...f,marks:e.target.value}))}
                      style={{width:50,padding:'7px 10px',borderRadius:8,border:`1.5px solid ${b}`,fontSize:12}}/>
                  </div>
                </>
              )}
              {qForm.questionType === 'descriptive' && (
                <div style={{display:'flex',gap:8,marginBottom:10,alignItems:'center'}}>
                  <label style={{fontSize:12,color:m}}>Marks:</label>
                  <input type="number" value={qForm.marks} onChange={e=>setQForm(f=>({...f,marks:e.target.value}))}
                    style={{width:60,padding:'7px 10px',borderRadius:8,border:`1.5px solid ${b}`,fontSize:12}}/>
                  <p style={{fontSize:11,color:m,margin:0}}>Students will type a free-text answer, graded manually in the Grading Queue.</p>
                </div>
              )}
              <button onClick={addQuestion} disabled={addingQ}
                style={{width:'100%',background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:10,
                  padding:'11px',color:'#fff',fontWeight:700,fontSize:13,cursor:addingQ?'wait':'pointer'}}>
                {addingQ ? 'Adding...' : '+ Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',
          alignItems:'center',justifyContent:'center',padding:20,zIndex:999}}>
          <div style={{background:c,borderRadius:20,padding:24,maxWidth:440,width:'100%',maxHeight:'85vh',overflowY:'auto'}}>
            <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 16px'}}>Create a Live Test</p>

            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              placeholder="Test name (e.g. Weekly Mock #4)"
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:`1.5px solid ${b}`,
                marginBottom:10,fontSize:13,boxSizing:'border-box'}}/>
            <input value={form.exam} onChange={e=>setForm(f=>({...f,exam:e.target.value}))}
              placeholder="Exam (e.g. SSC CGL)"
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:`1.5px solid ${b}`,
                marginBottom:10,fontSize:13,boxSizing:'border-box'}}/>
            <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}
              placeholder="Subject (optional)"
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:`1.5px solid ${b}`,
                marginBottom:10,fontSize:13,boxSizing:'border-box'}}/>
            <input value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}
              placeholder="City"
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:`1.5px solid ${b}`,
                marginBottom:10,fontSize:13,boxSizing:'border-box'}}/>
            <label style={{fontSize:11,color:m,display:'block',marginBottom:4}}>Start date & time</label>
            <input type="datetime-local" value={form.scheduledStart} onChange={e=>setForm(f=>({...f,scheduledStart:e.target.value}))}
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:`1.5px solid ${b}`,
                marginBottom:10,fontSize:13,boxSizing:'border-box'}}/>
            <label style={{fontSize:11,color:m,display:'block',marginBottom:4}}>Duration (minutes)</label>
            <input type="number" value={form.durationMinutes} onChange={e=>setForm(f=>({...f,durationMinutes:e.target.value}))}
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:`1.5px solid ${b}`,
                marginBottom:14,fontSize:13,boxSizing:'border-box'}}/>

            {error && <p style={{color:'#DC2626',fontSize:12,marginBottom:10}}>{error}</p>}

            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setShowCreate(false)}
                style={{flex:1,background:'transparent',border:`1px solid ${b}`,borderRadius:10,
                  padding:'11px',color:m,fontWeight:600,fontSize:13,cursor:'pointer'}}>
                Cancel
              </button>
              <button onClick={handleCreate} disabled={creating}
                style={{flex:1,background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:10,
                  padding:'11px',color:'#fff',fontWeight:700,fontSize:13,cursor:creating?'wait':'pointer'}}>
                {creating ? 'Creating...' : 'Create Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function GradingCard({ answer, onGrade, p, a, t, m, b, bg }) {
  const [marks, setMarks] = useState('')
  const maxMarks = answer.question?.marks || 1
  return (
    <div style={{background:bg,border:`1px solid ${b}`,borderRadius:14,padding:14,marginBottom:10}}>
      <p style={{color:m,fontSize:11,margin:'0 0 4px'}}>{answer.enrollment?.student?.name || 'Student'}</p>
      <p style={{color:t,fontWeight:600,fontSize:13,margin:'0 0 8px'}}>{answer.question?.question_text}</p>
      {answer.answer_text && (
        <div style={{background:'#fff',border:`1px solid ${b}`,borderRadius:10,padding:10,marginBottom:8}}>
          <p style={{color:t,fontSize:13,margin:0,lineHeight:1.6,whiteSpace:'pre-wrap'}}>{answer.answer_text}</p>
        </div>
      )}
      {answer.answer_file_url && (
        <a href={answer.answer_file_url} target="_blank" rel="noreferrer"
          style={{display:'inline-block',color:p,fontSize:12,marginBottom:8}}>📎 View uploaded file</a>
      )}
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input type="number" value={marks} onChange={e=>setMarks(e.target.value)}
          placeholder={`Marks (max ${maxMarks})`} max={maxMarks} min={0}
          style={{width:120,padding:'8px 12px',borderRadius:8,border:`1.5px solid ${b}`,fontSize:12}}/>
        <button onClick={()=>onGrade(answer.id, marks)} disabled={marks===''}
          style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:8,
            padding:'8px 16px',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>
          Save Grade
        </button>
      </div>
    </div>
  )
}
