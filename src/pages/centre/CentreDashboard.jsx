import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const MOCK_TESTS = [
  { id:'ct1', name:'SSC CGL Mock 1',   subject:'Full Syllabus', date:'2026-06-08 10:00', students:32, avgScore:68, status:'completed' },
  { id:'ct2', name:'Quant Speed Test', subject:'Maths',         date:'2026-06-07 14:00', students:28, avgScore:72, status:'completed' },
  { id:'ct3', name:'Reasoning Drill',  subject:'Reasoning',     date:'2026-06-10 16:00', students:0,  avgScore:0,  status:'upcoming'  },
  { id:'ct4', name:'English Mastery',  subject:'English',       date:'2026-06-09 09:00', students:35, avgScore:61, status:'completed' },
]
const MOCK_STUDENTS = [
  { id:'s1', name:'Arjun Kumar',    rank:1,  streak:12, avgScore:78, testsCount:6 },
  { id:'s2', name:'Priya Sharma',   rank:2,  streak:8,  avgScore:84, testsCount:6 },
  { id:'s3', name:'Rahul Mehta',    rank:3,  streak:5,  avgScore:71, testsCount:5 },
  { id:'s4', name:'Zainab Ali',     rank:4,  streak:9,  avgScore:76, testsCount:6 },
  { id:'s5', name:'Meera V.',       rank:5,  streak:3,  avgScore:65, testsCount:4 },
]

function CreateTestModal({ onClose, onCreate }) {
  const [f, setF] = useState({ name:'', subject:'', date:'', questions:25, duration:30 })
  const upd = (k,v) => setF(p=>({...p,[k]:v}))
  const save = () => {
    if (!f.name.trim()) return
    const all = JSON.parse(localStorage.getItem('centreTests') || '[]')
    const test = { id:`ct-${Date.now()}`, ...f, students:0, avgScore:0, status:'upcoming' }
    localStorage.setItem('centreTests', JSON.stringify([...all, test]))
    onCreate(test); onClose()
  }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
        style={{ background:'#fff', borderRadius:24, padding:28, width:'100%', maxWidth:460 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
          <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:18 }}>
            ➕ Create New Test
          </h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer' }}>×</button>
        </div>
        {[
          { k:'name',     label:'Test Name *',           ph:'e.g. SSC CGL Mock 5',    type:'text'           },
          { k:'subject',  label:'Subject',                ph:'e.g. Full Syllabus',     type:'text'           },
          { k:'date',     label:'Date & Time',            ph:'',                       type:'datetime-local'  },
        ].map(fi => (
          <div key={fi.k} style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:5 }}>
              {fi.label}
            </label>
            <input value={f[fi.k]} type={fi.type} placeholder={fi.ph}
              onChange={e => upd(fi.k, e.target.value)}
              style={{ width:'100%', padding:'10px 12px', borderRadius:10,
                border:'1.5px solid #E2E8F0', fontSize:13, outline:'none', boxSizing:'border-box' }}
              onFocus={e => e.target.style.borderColor='#D4AF37'}
              onBlur={e => e.target.style.borderColor='#E2E8F0'}
            />
          </div>
        ))}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          {[
            { k:'questions', label:'Questions', min:5, max:200 },
            { k:'duration',  label:'Duration (min)', min:10, max:180 },
          ].map(sl => (
            <div key={sl.k}>
              <label style={{ display:'block', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:5 }}>
                {sl.label}: <span style={{ color:'#D4AF37', fontWeight:800 }}>{f[sl.k]}</span>
              </label>
              <input type='range' min={sl.min} max={sl.max} value={f[sl.k]}
                onChange={e => upd(sl.k, +e.target.value)}
                style={{ width:'100%', accentColor:'#D4AF37' }} />
            </div>
          ))}
        </div>
        <button onClick={save} style={{
          width:'100%', padding:14, borderRadius:12, border:'none',
          background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
          fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15,
          color:'#1E3A5F', cursor:'pointer',
        }}>Create Test →</button>
      </motion.div>
    </div>
  )
}

export default function CentreDashboard() {
  const navigate = useNavigate()
  const [tests, setTests]     = useState(MOCK_TESTS)
  const [showModal, setModal] = useState(false)
  const [tab, setTab]         = useState('tests')

  const handleCreate = (t) => setTests(p => [t, ...p])

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', padding:'0 0 40px' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', padding:'20px 28px' }}>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>🏫 Centre Dashboard</p>
        <h1 style={{ color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:24, margin:'4px 0' }}>
          ABC Coaching Centre
        </h1>
        <p style={{ color:'#D4AF37', fontSize:13 }}>47 students · All India Rank #12 Centre</p>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, padding:'16px 20px' }}>
        {[['📝','12','Tests This Month'],['👥','47','Active Students'],['🏆','#12','Centre Rank India'],['📊','72%','Avg Score']].map(([e,v,l])=>(
          <div key={l} style={{ background:'#fff', borderRadius:16, padding:'14px 12px',
            boxShadow:'0 2px 12px rgba(0,0,0,0.05)', textAlign:'center' }}>
            <p style={{ fontSize:24 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:20 }}>{v}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
          </div>
        ))}
      </div>

      <div style={{ padding:'0 20px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {[['tests','📝 Tests'],['students','👥 Students']].map(([k,label])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              padding:'10px 20px', borderRadius:12, border:'none', cursor:'pointer',
              background: tab===k ? '#1E3A5F' : '#fff',
              color: tab===k ? '#fff' : '#64748B',
              fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13,
            }}>{label}</button>
          ))}
          <button onClick={()=>setModal(true)} style={{
            marginLeft:'auto', padding:'10px 20px', borderRadius:12, border:'none',
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13,
            color:'#1E3A5F', cursor:'pointer',
          }}>+ Create Test</button>
        </div>

        {/* Tests tab */}
        {tab === 'tests' && (
          <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ background:'#1E3A5F', padding:'12px 18px',
              display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:8 }}>
              {['Test Name','Subject','Date','Students','Avg Score'].map(h=>(
                <span key={h} style={{ color:'#D4AF37', fontSize:11, fontWeight:700, letterSpacing:'1px' }}>{h}</span>
              ))}
            </div>
            {tests.map(t => (
              <div key={t.id} style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9',
                display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:8,
                alignItems:'center', cursor:'pointer' }}
                onClick={()=>navigate(`/centre/students`)}>
                <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:14 }}>
                  {t.name}
                </span>
                <span style={{ background:'#F1F5F9', color:'#64748B', borderRadius:8,
                  padding:'3px 8px', fontSize:11, fontWeight:600, display:'inline-block' }}>
                  {t.subject}
                </span>
                <span style={{ color:'#64748B', fontSize:12 }}>{t.date?.slice(0,10)}</span>
                <span style={{ fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{t.students || '—'}</span>
                <span style={{ fontWeight:700, color: t.avgScore >= 70 ? '#22C55E' : '#EF4444', fontSize:14 }}>
                  {t.avgScore ? `${t.avgScore}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Students tab */}
        {tab === 'students' && (
          <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            {MOCK_STUDENTS.map(s => (
              <div key={s.id} onClick={()=>navigate('/centre/students')}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
                  borderBottom:'1px solid #F1F5F9', cursor:'pointer' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'#1E3A5F',
                  color:'#D4AF37', fontWeight:800, fontSize:14,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {s.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F' }}>{s.name}</p>
                  <p style={{ color:'#94A3B8', fontSize:12 }}>🔥 {s.streak} day streak · {s.testsCount} tests</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:16 }}>
                    {s.avgScore}%
                  </p>
                  <p style={{ color:'#94A3B8', fontSize:11 }}>Avg Score</p>
                </div>
                <span style={{ color:'#D4AF37', fontSize:18 }}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <CreateTestModal onClose={()=>setModal(false)} onCreate={handleCreate} />}
    </div>
  )
}
