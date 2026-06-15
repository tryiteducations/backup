// FILE: src/pages/admin/AdminDashboard.jsx
// Admin — Full Control Panel
// Tabs: Overview · Users · Coin/Pro Grants · Exams · Security · View As
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { id:'overview', label:'📊 Overview' },
  { id:'users',    label:'👥 Users' },
  { id:'grants',   label:'🪙 Coin / Pro Grants' },
  { id:'exams',    label:'📋 Exams' },
  { id:'security', label:'🛡️ Security' },
  { id:'viewas',   label:'👁️ View As' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const flag = localStorage.getItem('tryit_admin')
    if (flag === 'true' || flag === '1') setAuthed(true)
    else navigate('/admin/login')
  }, [navigate])

  if (!authed) return null

  const logout = () => {
    localStorage.removeItem('tryit_admin')
    navigate('/admin/login')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', padding:'20px clamp(16px,4vw,40px)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'var(--color-accent, #D4AF37)', fontSize:22 }}>🛡️ TryIT Admin</p>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>Full Control Panel</p>
        </div>
        <button onClick={logout} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, padding:'10px 20px', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13, cursor:'pointer' }}>
          🚪 Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'16px clamp(16px,4vw,40px) 0' }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:'10px 18px', borderRadius:'14px 14px 0 0', border:'none', cursor:'pointer', whiteSpace:'nowrap',
              background: tab===t.id ? '#fff' : 'transparent',
              color: tab===t.id ? 'var(--color-primary, #1E3A5F)' : '#94A3B8',
              fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13,
              borderBottom: tab===t.id ? '3px solid var(--color-accent, #D4AF37)' : '3px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:'20px clamp(16px,4vw,40px) 40px', background:'#fff', minHeight:'60vh' }}>
        {tab==='overview' && <OverviewTab navigate={navigate}/>}
        {tab==='users'    && <UsersTab/>}
        {tab==='grants'   && <GrantsTab/>}
        {tab==='exams'    && <ExamsTab navigate={navigate}/>}
        {tab==='security' && <SecurityTab/>}
        {tab==='viewas'   && <ViewAsTab/>}
      </div>
    </div>
  )
}

// ── OVERVIEW ─────────────────────────────────────────────────────
function OverviewTab({ navigate }) {
  const [stats, setStats] = useState({ users:0, pro:0, tests:0, coins:0 })

  useEffect(()=>{
    (async () => {
      try {
        const { count: users }  = await supabase.from('profiles').select('*', { count:'exact', head:true })
        const { count: pro }    = await supabase.from('profiles').select('*', { count:'exact', head:true }).eq('plan','pro')
        const { count: tests }  = await supabase.from('test_attempts').select('*', { count:'exact', head:true })
        setStats({ users: users||0, pro: pro||0, tests: tests||0, coins: 0 })
      } catch {
        setStats({ users: 1, pro: 1, tests: 0, coins: 0 })
      }
    })()
  },[])

  const CARDS = [
    { label:'Total Users',  value: stats.users, emoji:'👥', color:'var(--color-primary, #1E3A5F)' },
    { label:'Pro Members',  value: stats.pro,   emoji:'⚡', color:'var(--color-accent, #D4AF37)' },
    { label:'Tests Taken',  value: stats.tests, emoji:'📝', color:'var(--color-success, #22C55E)' },
    { label:'Active Grants',value: '—',         emoji:'🎁', color:'#7C3AED' },
  ]

  return (
    <div>
      <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:22, marginBottom:16 }}>Platform Overview</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14 }}>
        {CARDS.map(c=>(
          <div key={c.label} style={{ background:'#F8FAFC', borderRadius:18, padding:18, border:'1.5px solid var(--color-border, #E2E8F0)' }}>
            <p style={{ fontSize:28 }}>{c.emoji}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:c.color, fontSize:24 }}>{c.value}</p>
            <p style={{ color:'#94A3B8', fontSize:12 }}>{c.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:16, marginBottom:16 }}>
        <a href="/admin/exams" style={{ background:'var(--color-primary, #1E3A5F)', color:'var(--color-accent, #D4AF37)', borderRadius:12, padding:'10px 20px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, textDecoration:'none' }}>📋 Manage Exams & Pricing</a>
        <a href="/admin/current-affairs" style={{ background:'var(--color-primary, #1E3A5F)', color:'var(--color-accent, #D4AF37)', borderRadius:12, padding:'10px 20px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, textDecoration:'none' }}>📰 Manage Current Affairs</a>
      </div>
      <div style={{ background:'rgba(212,175,55,0.06)', borderRadius:16, padding:16, border:'1px solid rgba(212,175,55,0.2)' }}>
        <p style={{ color:'var(--color-muted, #64748B)', fontSize:13, lineHeight:1.7 }}>
          ℹ️ If counts show 0/—, Supabase tables (profiles, test_attempts) may not be
          populated yet, or VITE_SUPABASE_URL isn't configured. This is expected
          before real users sign up.
        </p>
      </div>
    </div>
  )
}

// ── USERS ────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(()=>{
    (async () => {
      try {
        const { data } = await supabase.from('profiles').select('*').order('created_at',{ascending:false}).limit(100)
        setUsers(data || [])
      } catch { setUsers([]) }
      setLoading(false)
    })()
  },[])

  const filtered = users.filter(u =>
    (u.email||'').toLowerCase().includes(search.toLowerCase()) ||
    (u.name||'').toLowerCase().includes(search.toLowerCase())
  )

  const suspend = async (id, suspended) => {
    try {
      await supabase.from('profiles').update({ suspended: !suspended }).eq('id', id)
      setUsers(u => u.map(x => x.id===id ? {...x, suspended: !suspended} : x))
    } catch { alert('Could not update — check Supabase connection') }
  }

  return (
    <div>
      <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:22, marginBottom:12 }}>User Management</h2>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email..."
        style={{ width:'100%', maxWidth:340, padding:'10px 14px', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, marginBottom:14, outline:'none' }}/>

      {loading ? <p style={{ color:'#94A3B8' }}>Loading...</p> : filtered.length===0 ? (
        <div style={{ textAlign:'center', padding:40, color:'#94A3B8', background:'#F8FAFC', borderRadius:16 }}>
          <p style={{ fontSize:32, marginBottom:8 }}>👤</p>
          <p>No users found yet. Real users will appear here after signup via Supabase.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(u=>(
            <div key={u.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#F8FAFC', borderRadius:14, border:'1.5px solid var(--color-border, #E2E8F0)', flexWrap:'wrap' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--color-primary, #1E3A5F)', color:'var(--color-accent, #D4AF37)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, flexShrink:0 }}>
                {(u.name||'?').slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:120 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', fontSize:13 }}>{u.name || 'Unnamed'}</p>
                <p style={{ color:'#94A3B8', fontSize:11 }}>{u.email}</p>
              </div>
              <span style={{ fontSize:12, color:'var(--color-muted, #64748B)' }}>🪙 {u.coins ?? 0}</span>
              <span style={{ fontSize:12, padding:'3px 10px', borderRadius:20, background: u.plan==='pro' ? 'rgba(212,175,55,0.15)':'#EEE', color: u.plan==='pro' ? '#92400E':'var(--color-muted, #64748B)', fontWeight:700 }}>{u.plan || 'free'}</span>
              <button onClick={()=>suspend(u.id, u.suspended)} style={{ padding:'6px 14px', borderRadius:10, border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                background: u.suspended ? '#DCFCE7' : '#FEE2E2', color: u.suspended ? '#15803D' : '#991B1B' }}>
                {u.suspended ? '✓ Unsuspend' : '🔒 Suspend'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── GRANTS ───────────────────────────────────────────────────────
function GrantsTab() {
  const [grants, setGrants] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tryit_pro_grants')||'[]') } catch { return [] }
  })
  const [email, setEmail] = useState('')
  const [plan, setPlan]   = useState('pro')
  const [days, setDays]   = useState(30)

  const addGrant = () => {
    if (!email.trim()) return
    const expiresAt = new Date(Date.now() + days*24*60*60*1000).toISOString()
    const newGrants = [...grants, { email: email.trim().toLowerCase(), plan, expiresAt, grantedAt: new Date().toISOString() }]
    setGrants(newGrants)
    localStorage.setItem('tryit_pro_grants', JSON.stringify(newGrants))
    setEmail('')
  }

  const removeGrant = (idx) => {
    const newGrants = grants.filter((_,i)=>i!==idx)
    setGrants(newGrants)
    localStorage.setItem('tryit_pro_grants', JSON.stringify(newGrants))
  }

  return (
    <div>
      <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:22, marginBottom:6 }}>Coin / Pro Grants</h2>
      <p style={{ color:'#94A3B8', fontSize:13, marginBottom:16 }}>Grant free Pro access to specific emails. Applied automatically on their next login.</p>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16, background:'#F8FAFC', padding:14, borderRadius:14, border:'1.5px solid var(--color-border, #E2E8F0)' }}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="user@email.com"
          style={{ flex:1, minWidth:180, padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, outline:'none' }}/>
        <select value={plan} onChange={e=>setPlan(e.target.value)} style={{ padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13 }}>
          <option value="pro">Pro</option>
          <option value="equity">Equity (Free Lifetime)</option>
        </select>
        <input type="number" value={days} onChange={e=>setDays(parseInt(e.target.value)||30)} style={{ width:80, padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13 }}/>
        <span style={{ alignSelf:'center', fontSize:12, color:'var(--color-muted, #64748B)' }}>days</span>
        <button onClick={addGrant} style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', border:'none', borderRadius:10, padding:'10px 20px', color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer' }}>Grant</button>
      </div>

      {grants.length===0 ? (
        <p style={{ color:'#94A3B8', fontSize:13 }}>No active grants.</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {grants.map((g,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#F8FAFC', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', flexWrap:'wrap', gap:8 }}>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--color-primary, #1E3A5F)' }}>{g.email}</span>
              <span style={{ fontSize:12, color:'var(--color-muted, #64748B)' }}>{g.plan} · expires {new Date(g.expiresAt).toLocaleDateString('en-IN')}</span>
              <button onClick={()=>removeGrant(i)} style={{ background:'#FEE2E2', color:'#991B1B', border:'none', borderRadius:8, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── EXAMS ────────────────────────────────────────────────────────
function ExamsTab({ navigate }) {
  const [exams, setExams] = useState([])
  useEffect(()=>{
    fetch('/data/exams.json').then(r=>r.json()).then(d=>setExams(d.exams||[])).catch(()=>setExams([]))
  },[])

  const byCategory = {}
  exams.forEach(e => { byCategory[e.category] = (byCategory[e.category]||0) + 1 })

  return (
    <div>
      <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:22, marginBottom:6 }}>Exam Catalog</h2>
      <button onClick={()=>navigate('/admin/exams')} style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', border:'none', borderRadius:12, padding:'10px 20px', color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer', marginBottom:14 }}>
        Open Full Exam Manager (add / edit / pricing) →
      </button>
      <p style={{ color:'var(--color-muted, #64748B)', fontSize:14, marginBottom:14 }}>Total exams: <b>{exams.length}</b></p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
        {Object.entries(byCategory).map(([cat,count])=>(
          <div key={cat} style={{ background:'#F8FAFC', borderRadius:14, padding:14, border:'1.5px solid var(--color-border, #E2E8F0)' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:20 }}>{count}</p>
            <p style={{ color:'#94A3B8', fontSize:12 }}>{cat?.replace(/_/g,' ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SECURITY ─────────────────────────────────────────────────────
function SecurityTab() {
  const [events, setEvents] = useState([])
  useEffect(()=>{
    (async () => {
      try {
        const { data } = await supabase.from('security_events').select('*').order('timestamp',{ascending:false}).limit(50)
        setEvents(data||[])
      } catch { setEvents([]) }
    })()
  },[])

  return (
    <div>
      <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:22, marginBottom:12 }}>Security Events</h2>
      {events.length===0 ? (
        <div style={{ textAlign:'center', padding:40, color:'#94A3B8', background:'#F8FAFC', borderRadius:16 }}>
          <p style={{ fontSize:32, marginBottom:8 }}>✅</p>
          <p>No security events. (Device-level security checks are a Month 2+ feature.)</p>
        </div>
      ) : events.map(e=>(
        <div key={e.id} style={{ padding:'10px 14px', background:'#FEF2F2', borderRadius:12, marginBottom:8, fontSize:13 }}>
          {e.type} — {e.severity} — {new Date(e.timestamp).toLocaleString('en-IN')}
        </div>
      ))}
    </div>
  )
}

// ── VIEW AS — QA any role with full access ────────────────────────
function ViewAsTab() {
  const { viewAs } = useAuth()
  const navigate = useNavigate()

  const ROLES = [
    { id:'student',     emoji:'🎓', label:'Student',     route:'/dashboard',
      desc:'Full Pro access, 3 exams pre-loaded (SSC CGL, NEET UG, UPSC CSE), subject accuracy data, rank #1, 9999 coins, Level 10' },
    { id:'mentor',      emoji:'🧑‍🏫', label:'Mentor',      route:'/mentor-hub',
      desc:'Access Mentor Hub, Cashback Center, Analytics, Coupon Manager' },
    { id:'institution', emoji:'🏫', label:'Institution', route:'/centre/dashboard',
      desc:'Access Centre Dashboard, Conduct Test, Student History' },
    { id:'family',      emoji:'👨‍👩‍👧', label:'Family Hub',  route:'/family',
      desc:'Access Family Hub, Parent Dashboard' },
  ]

  const enter = (role, route) => {
    viewAs(role)
    navigate(route)
  }

  return (
    <div>
      <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:22, marginBottom:6 }}>👁️ View As — QA Mode</h2>
      <p style={{ color:'#94A3B8', fontSize:13, marginBottom:16 }}>
        Instantly experience the app as any role with full Pro access — no real account needed.
        A banner shows at the top so you can exit back to Admin anytime.
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
        {ROLES.map(r=>(
          <div key={r.id} style={{ background:'#F8FAFC', borderRadius:18, padding:18, border:'1.5px solid var(--color-border, #E2E8F0)' }}>
            <p style={{ fontSize:32, marginBottom:8 }}>{r.emoji}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:15, marginBottom:6 }}>{r.label}</p>
            <p style={{ color:'#94A3B8', fontSize:12, marginBottom:12, lineHeight:1.5 }}>{r.desc}</p>
            <button onClick={()=>enter(r.id, r.route)} style={{ width:'100%', background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', border:'none', borderRadius:12, padding:'10px 0', color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              Enter as {r.label} →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

