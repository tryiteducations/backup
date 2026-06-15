// src/pages/centre/CentreStudentsPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SAMPLE_STUDENTS = [
  { id:1, name:'Arun K.', email:'arun@gmail.com', exams:['SSC CGL'], avgScore:72, tests:8, lastActive:'Today' },
  { id:2, name:'Meena R.', email:'meena@gmail.com', exams:['NEET UG'], avgScore:81, tests:15, lastActive:'Yesterday' },
  { id:3, name:'Vijay S.', email:'vijay@gmail.com', exams:['UPSC CSE'], avgScore:65, tests:5, lastActive:'3 days ago' },
  { id:4, name:'Lakshmi P.', email:'lakshmi@gmail.com', exams:['Banking PO'], avgScore:78, tests:12, lastActive:'Today' },
]

export default function CentreStudentsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const students = SAMPLE_STUDENTS

  if (!user) return null

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout title="Students">
      <div className="mb-6" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:22, margin:'0 0 4px' }}>👨‍🎓 All Students</h1>
          <p style={{ color:'var(--subtext-color, #64748B)', fontSize:14, margin:0 }}>{students.length} students · Centre code: <strong>{user.userId}</strong></p>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search students..."
          style={{ padding:'10px 14px', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, outline:'none', minWidth:220 }}/>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, background:'var(--color-surface, #FFFFFF)', borderRadius:18, border:'1.5px dashed var(--color-border, #E2E8F0)' }}>
          <p style={{ fontSize:40, marginBottom:8 }}>👨‍🎓</p>
          <p style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))', fontWeight:700, marginBottom:4 }}>No students yet</p>
          <p style={{ color:'var(--subtext-color, #94A3B8)', fontSize:13 }}>Share your centre code <strong>{user.userId}</strong> for students to join</p>
        </div>
      ) : (
        <div style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:18, border:'1.5px solid var(--color-border, #E2E8F0)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--color-primary, #1E3A5F)' }}>
                {['Student','Exam','Tests','Avg Score','Last Active',''].map(h=>(
                  <th key={h} style={{ padding:'12px 16px', color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:700, textAlign:'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s,i)=>(
                <tr key={s.id} style={{ borderBottom:'1px solid var(--color-bg-muted-2, #F1F5F9)', background: i%2===0?'var(--color-surface, #FFFFFF)':'var(--color-surface-muted, rgba(243,244,246,1))' }}>
                  <td style={{ padding:'12px 16px' }}>
                    <p style={{ fontWeight:700, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:13, margin:'0 0 2px' }}>{s.name}</p>
                    <p style={{ color:'var(--subtext-color, #94A3B8)', fontSize:11, margin:0 }}>{s.email}</p>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:12, color:'var(--subtext-color, #64748B)' }}>{s.exams.join(', ')}</td>
                  <td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>{s.tests}</td>
                  <td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color: s.avgScore>=75?'var(--color-success, #22C55E)':s.avgScore>=50?'var(--color-accent, #D4AF37)':'var(--color-error, #EF4444)' }}>{s.avgScore}%</td>
                  <td style={{ padding:'12x 16px', fontSize:12, color:'var(--subtext-color, #94A3B8)' }}>{s.lastActive}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <button onClick={()=>navigate(`/centre/students/${s.id}`)} style={{ background:'rgba(var(--color-primary-rgb, 30,58,95), 0.12)', color:'var(--color-primary, #1E3A5F)', border:'none', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:700, cursor:'pointer' }}>View →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  )
}
