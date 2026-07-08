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
            <button onClick={()=>openRoster(test.id)}
              style={{background:`${p}10`,border:`1px solid ${p}30`,borderRadius:10,
                padding:'8px 16px',color:p,fontWeight:600,fontSize:12,cursor:'pointer'}}>
              View Enrolled Students →
            </button>

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
