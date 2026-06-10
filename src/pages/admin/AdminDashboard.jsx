import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = ['overview','users','exam-requests','questions','push']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    if (!localStorage.getItem('tryit_admin')) navigate('/admin/login')
  }, [navigate])

  const logout = () => { localStorage.removeItem('tryit_admin'); navigate('/admin/login') }

  const MOCK_STATS = [
    ['👥','1,247','Total Users'],['📝','23,481','Tests Taken'],
    ['💰','₹48,392','Revenue'],['🗃️','5,280','Questions in DB'],
    ['📬','12','Pending Exam Requests'],['🔔','3','Push Sent Today'],
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', padding:'16px 24px',
        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>TryIT Admin</p>
          <h1 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22 }}>
            360° Control Panel
          </h1>
        </div>
        <button onClick={logout} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
          borderRadius:10, padding:'8px 16px', color:'#fff', cursor:'pointer', fontSize:13 }}>
          Sign Out
        </button>
      </div>

      {/* Nav tabs */}
      <div style={{ display:'flex', gap:4, padding:'12px 20px', background:'#fff',
        boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflowX:'auto' }}>
        {[['overview','📊 Overview'],['users','👥 Users'],['exam-requests','📬 Exam Requests'],
          ['questions','🗃️ Questions'],['push','🔔 Push']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            padding:'9px 16px', borderRadius:10, border:'none', cursor:'pointer', whiteSpace:'nowrap',
            background: tab===k ? '#1E3A5F' : 'transparent',
            color: tab===k ? '#fff' : '#64748B',
            fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13,
          }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:20 }}>

        {tab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
            {MOCK_STATS.map(([e,v,l])=>(
              <div key={l} style={{ background:'#fff', borderRadius:18, padding:'18px 16px',
                textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize:28 }}>{e}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:22 }}>{v}</p>
                <p style={{ color:'#94A3B8', fontSize:12, marginTop:2 }}>{l}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && <UserManagerInline />}
        {tab === 'exam-requests' && <ExamRequestQueueInline />}
        {tab === 'questions' && <QuestionManagerInline />}
        {tab === 'push' && <PushTesterInline />}
      </div>
    </div>
  )
}

// ── Inline sub-components ──────────────────────────────────────

function UserManagerInline() {
  const MOCK_USERS = [
    { id:'u1', name:'Arjun Kumar', email:'arjun@ex.com', role:'student', level:4, joined:'Jan 2026' },
    { id:'u2', name:'Vikram Nair', email:'vikram@ex.com', role:'mentor',  level:7, joined:'Feb 2026' },
    { id:'u3', name:'Admin Test',  email:'test@ex.com',  role:'student', level:1, joined:'Jun 2026' },
  ]
  return (
    <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ background:'#1E3A5F', padding:'12px 18px',
        display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', gap:8 }}>
        {['Name','Email','Role','Level','Joined'].map(h=>(
          <span key={h} style={{ color:'#D4AF37', fontSize:11, fontWeight:700 }}>{h}</span>
        ))}
      </div>
      {MOCK_USERS.map(u=>(
        <div key={u.id} style={{ padding:'13px 18px', borderBottom:'1px solid #F1F5F9',
          display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', gap:8, alignItems:'center' }}>
          <span style={{ fontWeight:600, color:'#1E3A5F', fontSize:14 }}>{u.name}</span>
          <span style={{ color:'#64748B', fontSize:13 }}>{u.email}</span>
          <span style={{ background: u.role==='mentor'?'#EDE9FE':'#F0FDF4',
            color: u.role==='mentor'?'#7C3AED':'#15803D',
            padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:700, display:'inline-block' }}>
            {u.role}
          </span>
          <span style={{ color:'#D4AF37', fontWeight:700 }}>Lv {u.level}</span>
          <span style={{ color:'#94A3B8', fontSize:12 }}>{u.joined}</span>
        </div>
      ))}
    </div>
  )
}

function ExamRequestQueueInline() {
  const [reqs, setReqs] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('examRequests') || '[]')
    return saved.length ? saved : [
      { id:'r1', examName:'TSPSC Group 2', conductingBody:'TSPSC', status:'pending', requestedAt:'2026-06-09T08:00:00Z' },
      { id:'r2', examName:'KPSC FDA',      conductingBody:'KPSC',  status:'pending', requestedAt:'2026-06-08T14:00:00Z' },
    ]
  })

  const mark = (id, status) => {
    const updated = reqs.map(r => r.id===id ? {...r, status} : r)
    setReqs(updated)
    localStorage.setItem('examRequests', JSON.stringify(updated))
  }

  return (
    <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
      {reqs.map((r,i)=>(
        <div key={r.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
          borderBottom: i<reqs.length-1?'1px solid #F1F5F9':'none' }}>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F' }}>{r.examName}</p>
            <p style={{ color:'#94A3B8', fontSize:12 }}>{r.conductingBody} · {r.requestedAt?.slice(0,10)}</p>
          </div>
          <span style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700,
            background: r.status==='added'?'#DCFCE7':'#FEF3C7',
            color: r.status==='added'?'#15803D':'#92400E' }}>
            {r.status}
          </span>
          {r.status==='pending' && (
            <button onClick={()=>mark(r.id,'added')} style={{
              background:'linear-gradient(135deg,#22C55E,#16A34A)', border:'none',
              borderRadius:10, padding:'7px 14px', color:'#fff',
              fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12, cursor:'pointer',
            }}>Mark Added ✓</button>
          )}
        </div>
      ))}
      {reqs.length===0 && <p style={{ padding:24, textAlign:'center', color:'#94A3B8' }}>No requests yet</p>}
    </div>
  )
}

function QuestionManagerInline() {
  return (
    <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16, marginBottom:14 }}>
        🗃️ Question Bank (Mock)
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
        {[['SSC CGL','1,240'],['UPSC CSE','890'],['NEET UG','1,560'],['IBPS PO','720'],['JEE Main','1,100'],['GATE CS','640']].map(([exam,count])=>(
          <div key={exam} style={{ background:'#F8FAFC', borderRadius:14, padding:'12px 14px',
            border:'1.5px solid #E2E8F0' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{exam}</p>
            <p style={{ color:'#D4AF37', fontWeight:800, fontSize:20, fontFamily:'Poppins,sans-serif' }}>{count}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>questions</p>
          </div>
        ))}
      </div>
      <p style={{ color:'#94A3B8', fontSize:13 }}>
        Full question editing UI coming in Admin Phase 2. For now use Supabase Table Editor.
      </p>
    </div>
  )
}

function PushTesterInline() {
  const [role, setRole]     = useState('student')
  const [lang, setLang]     = useState('en')
  const [sent, setSent]     = useState(false)
  const [message, setMessage] = useState('')

  const MESSAGES = {
    student: { en:"📚 Time to study! Your SSC CGL exam is 30 days away. Study 2 hours today.",
               ta:"📚 படிக்க நேரம்! உங்கள் SSC CGL தேர்வு 30 நாட்களில் உள்ளது." },
    mentor:  { en:"💰 3 doubts waiting! Answer now and earn ₹15.",
               hi:"💰 3 doubts इंतजार कर रहे! अभी जवाब दें और ₹15 कमाएं।" },
    institution: { en:"📊 Your centre has 47 students active today!" },
    family: { en:"👨‍👩‍👧 Your family is on a 7-day streak! Keep it up! 🔥" },
  }

  const simulate = () => {
    const msg = MESSAGES[role]?.[lang] || MESSAGES[role]?.['en'] || 'Test push notification'
    setMessage(msg)
    setSent(true)
    // Browser Notification API
    if (Notification.permission === 'granted') {
      new Notification('TryIT Educations', { body: msg, icon: '/tryit-logo.webp' })
    }
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16, marginBottom:16 }}>
        🔔 Push Notification Tester
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <div>
          <label style={{ display:'block', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:5 }}>Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)}
            style={{ width:'100%', padding:'10px', borderRadius:10, border:'1.5px solid #E2E8F0',
              fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none' }}>
            {['student','mentor','institution','family'].map(r=>(
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:5 }}>Language</label>
          <select value={lang} onChange={e=>setLang(e.target.value)}
            style={{ width:'100%', padding:'10px', borderRadius:10, border:'1.5px solid #E2E8F0',
              fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none' }}>
            {[['en','English'],['hi','Hindi'],['ta','Tamil'],['te','Telugu']].map(([v,l])=>(
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>
      {sent && message && (
        <div style={{ background:'#DCFCE7', borderRadius:12, padding:'12px 16px', marginBottom:12 }}>
          <p style={{ color:'#15803D', fontWeight:600, fontSize:13 }}>✅ Notification simulated:</p>
          <p style={{ color:'#15803D', fontSize:13, marginTop:4 }}>{message}</p>
        </div>
      )}
      <button onClick={simulate} style={{
        background:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'none',
        borderRadius:12, padding:'12px 24px', color:'#D4AF37',
        fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor:'pointer',
      }}>
        🔔 Simulate Push
      </button>
    </div>
  )
}
