// src/pages/student/BrowseLiveTests.jsx
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

export default function BrowseLiveTests() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'

  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [enrolling, setEnrolling] = useState(null)
  const [enrolledCode, setEnrolledCode] = useState(null)
  const [myEnrollments, setMyEnrollments] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const [live, mine] = await Promise.all([
      testEnrollment.browseLiveTests({ query }),
      user?.id ? testEnrollment.getMyEnrollments(user.id) : Promise.resolve([]),
    ])
    setTests(live)
    setMyEnrollments(mine)
    setLoading(false)
  }

  useEffect(() => { load() }, [user?.id])

  const isEnrolled = (testId) => myEnrollments.some(e => e.test_id === testId)

  const handleEnroll = async (testId) => {
    if (!user?.id) return
    setError('')
    setEnrolling(testId)
    try {
      const result = await testEnrollment.enrollInTest(testId, user.id)
      setEnrolledCode(result.enrollment_code)
      await load()
    } catch (e) {
      setError(e.message || 'Could not enroll - please try again.')
    } finally {
      setEnrolling(null)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🏫 Live Institution Tests</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Browse tests conducted by your institution or any nearby coaching centre</p>
        </div>
      </div>

      <div style={{padding:'20px',maxWidth:700,margin:'0 auto'}}>

        <input value={query} onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==='Enter' && load()}
          placeholder="Search by institution name, city, or exam/topic..."
          style={{width:'100%',padding:'12px 16px',borderRadius:14,border:`1.5px solid ${b}`,
            background:c,color:t,fontSize:14,outline:'none',boxSizing:'border-box',marginBottom:16}}/>

        {loading && <p style={{textAlign:'center',color:m,fontSize:13,padding:20}}>Loading live tests...</p>}

        {!loading && tests.length === 0 && (
          <div style={{textAlign:'center',padding:'40px 20px',background:c,border:`1.5px dashed ${b}`,borderRadius:18}}>
            <div style={{fontSize:40,marginBottom:12}}>📋</div>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 6px'}}>No live tests right now</p>
            <p style={{color:m,fontSize:12,margin:0}}>Ask your institution for their join code in Settings, or check back soon.</p>
          </div>
        )}

        {error && (
          <p style={{color:'#DC2626',fontSize:13,textAlign:'center',marginBottom:12}}>{error}</p>
        )}

        {enrolledCode && (
          <div style={{background:'#F0FDF4',border:'1.5px solid #BBF7D0',borderRadius:16,padding:18,marginBottom:16,textAlign:'center'}}>
            <p style={{color:'#166534',fontWeight:800,fontSize:14,margin:'0 0 6px'}}>✅ Enrolled successfully!</p>
            <p style={{color:'#15803D',fontSize:12,margin:'0 0 8px'}}>Your enrollment code (save this):</p>
            <p style={{fontFamily:'monospace',fontWeight:800,fontSize:18,color:'#166534',letterSpacing:'1px'}}>{enrolledCode}</p>
            <p style={{color:'#15803D',fontSize:11,margin:'8px 0 0'}}>
              You'll get a unique exam token right when the test begins. Enrollment closes 2 hours before start time.
            </p>
          </div>
        )}

        {tests.map(test => {
          const closed = test.enrollment_closes_at && new Date() > new Date(test.enrollment_closes_at)
          const enrolled = isEnrolled(test.id)
          return (
            <div key={test.id} style={{background:c,border:`1px solid ${b}`,borderRadius:16,padding:16,marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:8}}>
                <div>
                  <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 3px'}}>{test.name}</p>
                  <p style={{color:m,fontSize:11,margin:0}}>
                    {test.institution?.institution_name || test.institution?.name} · {test.city}
                  </p>
                </div>
                <span style={{background:`${a}18`,color:a,fontSize:9,fontWeight:700,padding:'3px 10px',borderRadius:20,whiteSpace:'nowrap'}}>
                  {test.exam}
                </span>
              </div>
              <p style={{color:m,fontSize:12,margin:'0 0 10px'}}>
                🕐 {fmtDateTime(test.scheduled_start)} · ⏱ {test.duration_minutes} mins
              </p>
              {enrolled ? (
                <button onClick={()=>{
                  const myEnr = myEnrollments.find(e=>e.test_id===test.id)
                  if (myEnr) nav(`/student/exam/${myEnr.id}`)
                }}
                  style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:10,
                    padding:'9px 20px',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>
                  ✓ Enrolled - Go to Exam Room →
                </button>
              ) : closed ? (
                <span style={{color:'#F59E0B',fontSize:12,fontWeight:700}}>⏳ Enrollment closed</span>
              ) : (
                <button onClick={()=>handleEnroll(test.id)} disabled={enrolling===test.id}
                  style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:10,
                    padding:'9px 20px',color:'#fff',fontWeight:700,fontSize:12,
                    cursor:enrolling===test.id?'wait':'pointer'}}>
                  {enrolling===test.id ? 'Enrolling...' : 'Enroll Now →'}
                </button>
              )}
            </div>
          )
        })}
        <div style={{height:60}}/>
      </div>
    </div>
  )
}
