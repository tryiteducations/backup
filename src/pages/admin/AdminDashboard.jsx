// FILE: src/pages/admin/AdminDashboard.jsx
// Admin - Full Control Panel
// Tabs: Overview · Users · Grants · Exams · Materials · Flags · Config · Announcements · Security · View As
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { id:'overview',      label:'📊 Overview'       },
  { id:'tournament',    label:'🏆 Tournament'     },
  { id:'game_economy',  label:'🎮 Game Economy'   },
  { id:'game_testing',  label:'🛡️ Game Testing'    },
  { id:'users',         label:'👥 Users'           },
  { id:'grants',        label:'🪙 Grants'          },
  { id:'exams',         label:'📋 Exams'           },
  { id:'materials',     label:'📄 Daily Materials' },
  { id:'flags',         label:'🚩 Flags & Fix'     },
  { id:'config',        label:'⚙️ Config'           },
  { id:'announcements', label:'📢 Announce'        },
  { id:'security',      label:'🛡️ Security'         },
  { id:'viewas',        label:'👁️ View As'          },
]

// -- Shared styles ---------------------------------------------------------
const S = {
  card:    { background:'var(--color-bg,#F8FAFC)', borderRadius:18, padding:18, border:'1.5px solid #E2E8F0' },
  input:   { width:'100%', padding:'10px 13px', borderRadius:11, border:'1.5px solid #E2E8F0', fontSize:13, outline:'none', boxSizing:'border-box', background:'#fff' },
  btn:     { background:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'none', borderRadius:11, padding:'10px 20px', color:'#C9A84C', fontWeight:700, fontSize:13, cursor:'pointer' },
  btnRed:  { background:'#FEE2E2', color:'#991B1B', border:'none', borderRadius:9, padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer' },
  btnGold: { background:'linear-gradient(135deg,#C9A84C,#E8C96A)', color:'#1E3A5F', border:'none', borderRadius:11, padding:'10px 20px', fontWeight:800, fontSize:13, cursor:'pointer' },
  h2:      { fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:22, marginBottom:6 },
  label:   { display:'block', fontSize:12, fontWeight:600, color:'var(--color-text-light,#64748B)', marginBottom:5 },
  tag:     (active) => ({
    display:'inline-block', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700,
    background: active ? '#D1FAE5' : '#FEE2E2',
    color:      active ? '#065F46' : '#991B1B',
  }),
}

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
    <div style={{ minHeight:'100vh', background:'var(--color-bg,#F8FAFC)' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', padding:'20px clamp(16px,4vw,40px)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#C9A84C', fontSize:22 }}>🛡️ TryIT Admin</p>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>Full Control Panel - 360° Access</p>
        </div>
        <button onClick={logout} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, padding:'10px 20px', color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer' }}>
          🚪 Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, overflowX:'auto', padding:'16px clamp(16px,4vw,40px) 0', background:'var(--color-bg,#F8FAFC)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'10px 16px', borderRadius:'12px 12px 0 0', border:'none', cursor:'pointer', whiteSpace:'nowrap',
              background:    tab === t.id ? '#fff' : 'transparent',
              color:         tab === t.id ? '#1E3A5F' : '#94A3B8',
              fontFamily:   'Poppins,sans-serif', fontWeight:700, fontSize:12,
              borderBottom: tab === t.id ? '3px solid #C9A84C' : '3px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:'24px clamp(16px,4vw,40px) 60px', background:'#fff', minHeight:'60vh' }}>
        {tab === 'overview'      && <OverviewTab navigate={navigate} />}
        {tab === 'tournament'    && <TournamentAdminTab />}
        {tab === 'game_economy'  && <GameEconomyTab />}
        {tab === 'game_testing'  && <GameTestingTab />}
        {tab === 'users'         && <UsersTab />}
        {tab === 'grants'        && <GrantsTab />}
        {tab === 'exams'         && <ExamsTab navigate={navigate} />}
        {tab === 'materials'     && <MaterialsTab />}
        {tab === 'flags'         && <FlagsTab />}
        {tab === 'config'        && <ConfigTab />}
        {tab === 'announcements' && <AnnouncementsTab />}
        {tab === 'security'      && <SecurityTab />}
        {tab === 'viewas'        && <ViewAsTab />}
      </div>
    </div>
  )
}

// -- OVERVIEW --------------------------------------------------------------
function OverviewTab({ navigate }) {
  const [stats, setStats] = useState({ users:0, pro:0, ultra:0, tests:0, flags:0, materials:0 })

  useEffect(() => {
    (async () => {
      try {
        const [
          { count: users },
          { count: pro },
          { count: tests },
          { count: flags },
          { count: materials },
        ] = await Promise.all([
          supabase.from('profiles').select('*',        { count:'exact', head:true }),
          supabase.from('profiles').select('*',        { count:'exact', head:true }).eq('plan','pro'),
          supabase.from('test_attempts').select('*',   { count:'exact', head:true }),
          supabase.from('question_flags').select('*',  { count:'exact', head:true }).eq('status','pending'),
          supabase.from('daily_materials').select('*', { count:'exact', head:true }).eq('publish_date', new Date().toISOString().slice(0,10)),
        ])
        setStats({ users:users||0, pro:pro||0, tests:tests||0, flags:flags||0, materials:materials||0 })
      } catch {
        setStats({ users:0, pro:0, tests:0, flags:0, materials:0 })
      }
    })()
  }, [])

  const CARDS = [
    { label:'Total Users',     value:stats.users,     emoji:'👥', color:'#1E3A5F' },
    { label:'Pro Members',     value:stats.pro,       emoji:'⭐', color:'#C9A84C' },
    { label:'Tests Taken',     value:stats.tests,     emoji:'📝', color:'#059669' },
    { label:'Pending Flags',   value:stats.flags,     emoji:'🚩', color:'#DC2626' },
    { label:'Materials Today', value:stats.materials, emoji:'📄', color:'#7C3AED' },
    { label:'Active Grants',   value:'-',             emoji:'🎁', color:'#0891B2' },
  ]

  return (
    <div>
      <h2 style={S.h2}>Platform Overview</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:12, marginBottom:20 }}>
        {CARDS.map(c => (
          <div key={c.label} style={S.card}>
            <p style={{ fontSize:26, marginBottom:4 }}>{c.emoji}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:c.color, fontSize:26 }}>{c.value}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>{c.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
        <a href="/admin/exams"           style={S.btn}>📋 Exam Manager</a>
        <a href="/admin/current-affairs" style={S.btn}>📰 Current Affairs</a>
        <a href="/admin/questions"       style={S.btn}>❓ Question Manager</a>
        <a href="/admin/users"           style={S.btn}>👥 User Manager</a>
      </div>
      <div style={{ background:'rgba(201,168,76,0.08)', borderRadius:14, padding:14, border:'1px solid rgba(201,168,76,0.2)', fontSize:13, color:'var(--color-text-light,#64748B)', lineHeight:1.7 }}>
        ℹ️ Counts show 0 before Supabase is connected and users sign up. This is expected in dev mode.
      </div>
    </div>
  )
}

// -- USERS -----------------------------------------------------------------
function UsersTab() {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [revokeModal, setRevokeModal] = useState(null) // {user}
  const [revokeType, setRevokeType]   = useState('full_ban')
  const [revokeReason, setRevokeReason] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('profiles').select('*').order('created_at',{ascending:false}).limit(100)
        setUsers(data || [])
      } catch { setUsers([]) }
      setLoading(false)
    })()
  }, [])

  const filtered = users.filter(u =>
    (u.email||'').toLowerCase().includes(search.toLowerCase()) ||
    (u.name||'').toLowerCase().includes(search.toLowerCase())
  )

  const changePlan = async (id, plan) => {
    try {
      await supabase.from('profiles').update({ plan }).eq('id', id)
      setUsers(u => u.map(x => x.id === id ? {...x, plan} : x))
    } catch { alert('Could not update - check Supabase') }
  }

  const revokeUser = async () => {
    if (!revokeReason.trim()) { alert('Enter a reason'); return }
    try {
      await supabase.from('user_revocations').insert({
        user_id: revokeModal.id,
        revocation_type: revokeType,
        reason: revokeReason,
        revoked_by: 'admin',
      })
      await supabase.from('profiles').update({ suspended: true }).eq('id', revokeModal.id)
      setUsers(u => u.map(x => x.id === revokeModal.id ? {...x, suspended:true} : x))
      setRevokeModal(null)
      setRevokeReason('')
    } catch (e) {
      // Offline fallback
      setUsers(u => u.map(x => x.id === revokeModal.id ? {...x, suspended:true} : x))
      setRevokeModal(null)
    }
  }

  const PLAN_OPTIONS = ['free','pro','ultra','pro_grant','equity']

  return (
    <div>
      <h2 style={S.h2}>User Management</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
        style={{ ...S.input, maxWidth:340, marginBottom:14 }} />

      {loading ? <p style={{ color:'#94A3B8' }}>Loading...</p>
      : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:40, color:'#94A3B8', ...S.card }}>
          <p style={{ fontSize:32 }}>👤</p>
          <p>No users yet. They will appear here after real signups.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(u => (
            <div key={u.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', ...S.card, flexWrap:'wrap' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--color-primary,#1E3A5F)', color:'#C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, flexShrink:0 }}>
                {(u.name||'?').slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:120 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:13 }}>{u.name||'Unnamed'}</p>
                <p style={{ color:'#94A3B8', fontSize:11 }}>{u.email}</p>
              </div>
              <span style={{ fontSize:12, color:'var(--color-text-light,#64748B)' }}>🪙 {u.coins??0}</span>

              {/* Plan switcher */}
              <select value={u.plan||'free'} onChange={e => changePlan(u.id, e.target.value)}
                style={{ padding:'5px 8px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:11, fontWeight:700 }}>
                {PLAN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              <span style={S.tag(!u.suspended)}>{u.suspended ? 'Suspended' : 'Active'}</span>

              <button onClick={() => setRevokeModal(u)} style={S.btnRed}>🚫 Revoke</button>
            </div>
          ))}
        </div>
      )}

      {/* Revoke modal */}
      {revokeModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:24, width:'100%', maxWidth:400, border:'2px solid #DC2626' }}>
            <h3 style={{ color:'#DC2626', marginBottom:12, fontFamily:'Poppins,sans-serif' }}>🚫 Revoke: {revokeModal.name || revokeModal.email}</h3>
            <label style={S.label}>Action</label>
            <select value={revokeType} onChange={e => setRevokeType(e.target.value)} style={{ ...S.input, marginBottom:12 }}>
              <option value="full_ban">Full Account Ban (permanent)</option>
              <option value="temp_suspend">Temporary Suspension (7 days)</option>
              <option value="test_block">Block from Taking Tests</option>
              <option value="coin_freeze">Freeze Coins (cheating detected)</option>
              <option value="plan_downgrade">Force Downgrade to Free</option>
              <option value="mentor_revoke">Revoke Mentor Status</option>
            </select>
            <label style={S.label}>Reason (required - logged permanently)</label>
            <textarea value={revokeReason} onChange={e => setRevokeReason(e.target.value)}
              placeholder="e.g. Detected answer sharing, mass reporting abuse..."
              rows={3} style={{ ...S.input, resize:'none', marginBottom:14 }} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={revokeUser} style={{ ...S.btnRed, flex:1, padding:'12px', fontSize:13 }}>Confirm Revoke</button>
              <button onClick={() => { setRevokeModal(null); setRevokeReason('') }}
                style={{ flex:1, padding:'12px', border:'1.5px solid #E2E8F0', borderRadius:11, fontSize:13, cursor:'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// -- GRANTS ----------------------------------------------------------------
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
    const next = [...grants, { email:email.trim().toLowerCase(), plan, expiresAt, grantedAt:new Date().toISOString() }]
    setGrants(next)
    localStorage.setItem('tryit_pro_grants', JSON.stringify(next))
    setEmail('')
  }

  const removeGrant = (idx) => {
    const next = grants.filter((_,i) => i !== idx)
    setGrants(next)
    localStorage.setItem('tryit_pro_grants', JSON.stringify(next))
  }

  return (
    <div>
      <h2 style={S.h2}>Coin / Pro / Ultra Grants</h2>
      <p style={{ color:'#94A3B8', fontSize:13, marginBottom:16 }}>Grant free plan access to emails. Applied on next login automatically.</p>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16, ...S.card }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="user@email.com"
          style={{ ...S.input, flex:1, minWidth:180, width:'auto' }} />
        <select value={plan} onChange={e => setPlan(e.target.value)} style={{ padding:'10px 12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:13 }}>
          <option value="pro">Pro (₹199/month equivalent)</option>
          <option value="ultra">Ultra (₹299/month equivalent)</option>
          <option value="equity">Equity (Free Lifetime)</option>
        </select>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <input type="number" value={days} onChange={e => setDays(parseInt(e.target.value)||30)}
            style={{ width:72, padding:'10px 10px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:13 }} />
          <span style={{ fontSize:12, color:'var(--color-text-light,#64748B)' }}>days</span>
        </div>
        <button onClick={addGrant} style={S.btn}>+ Grant</button>
      </div>

      {grants.length === 0 ? <p style={{ color:'#94A3B8', fontSize:13 }}>No active grants.</p> : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {grants.map((g,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', ...S.card, flexWrap:'wrap', gap:8 }}>
              <span style={{ fontSize:13, fontWeight:600, color:'#1E3A5F' }}>{g.email}</span>
              <span style={{ fontSize:12, color:'var(--color-text-light,#64748B)' }}>{g.plan} · expires {new Date(g.expiresAt).toLocaleDateString('en-IN')}</span>
              <button onClick={() => removeGrant(i)} style={S.btnRed}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -- EXAMS -----------------------------------------------------------------
function ExamsTab({ navigate }) {
  const [exams, setExams] = useState([])
  useEffect(() => {
    fetch('/data/exams.json').then(r=>r.json()).then(d=>setExams(d.exams||[])).catch(()=>setExams([]))
  }, [])

  const byCategory = {}
  exams.forEach(e => { byCategory[e.category] = (byCategory[e.category]||0) + 1 })

  return (
    <div>
      <h2 style={S.h2}>Exam Catalog</h2>
      <button onClick={() => navigate('/admin/exams')} style={{ ...S.btn, marginBottom:14 }}>
        Open Full Exam Manager →
      </button>
      <p style={{ color:'var(--color-text-light,#64748B)', fontSize:14, marginBottom:14 }}>Total exams: <b>{exams.length}</b></p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
        {Object.entries(byCategory).map(([cat,count]) => (
          <div key={cat} style={S.card}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:22 }}>{count}</p>
            <p style={{ color:'#94A3B8', fontSize:12 }}>{cat?.replace(/_/g,' ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// -- DAILY MATERIALS (NEW) -------------------------------------------------
function MaterialsTab() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [form, setForm] = useState({
    title:'', subtitle:'', material_type:'daily_current_affairs',
    publish_date: new Date().toISOString().slice(0,10),
    source:'', file_url:'', relevant_for:'all',
    target_exams:[], languages:['en'],
  })
  const [saving, setSaving]     = useState(false)
  const [saveMsg, setSaveMsg]   = useState('')

  const TYPES = [
    'daily_current_affairs','weekly_digest','monthly_magazine','study_notes',
    'question_paper','answer_key','exam_notification','cutoff_analysis',
    'strategy_guide','revision_sheet','formula_sheet','vocabulary_list',
    'one_liner_gk','video_link',
  ]

  const loadMaterials = async () => {
    setLoading(true)
    try {
      let q = supabase.from('daily_materials').select('*').order('created_at',{ascending:false}).limit(50)
      if (filter !== 'all') q = q.eq('material_type', filter)
      const { data } = await q
      setMaterials(data || [])
    } catch {
      // Fallback: load from localStorage
      const saved = JSON.parse(localStorage.getItem('tryit_admin_materials') || '[]')
      setMaterials(filter === 'all' ? saved : saved.filter(m => m.material_type === filter))
    }
    setLoading(false)
  }

  useEffect(() => { loadMaterials() }, [filter])

  const handlePost = async () => {
    if (!form.title.trim()) { alert('Title is required'); return }
    setSaving(true)
    const record = {
      ...form,
      id:         `mat_${Date.now()}`,
      posted_by:  'admin',
      is_active:  true,
      view_count: 0,
      download_count: 0,
      created_at: new Date().toISOString(),
    }

    try {
      const { error } = await supabase.from('daily_materials').insert(record)
      if (error) throw error
      setSaveMsg('✅ Posted to Supabase!')
    } catch {
      // Save locally as fallback
      const saved = JSON.parse(localStorage.getItem('tryit_admin_materials') || '[]')
      saved.unshift(record)
      localStorage.setItem('tryit_admin_materials', JSON.stringify(saved))
      setSaveMsg('✅ Saved locally (sync to Supabase when online)')
    }

    setMaterials(prev => [record, ...prev])
    setForm(f => ({ ...f, title:'', subtitle:'', source:'', file_url:'' }))
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const toggleActive = async (mat) => {
    try {
      await supabase.from('daily_materials').update({ is_active:!mat.is_active }).eq('id', mat.id)
    } catch {}
    setMaterials(prev => prev.map(m => m.id===mat.id ? {...m, is_active:!mat.is_active} : m))
  }

  const f = (k,v) => setForm(prev => ({ ...prev, [k]:v }))

  return (
    <div>
      <h2 style={S.h2}>📄 Post Daily Materials</h2>
      <p style={{ color:'#94A3B8', fontSize:13, marginBottom:20 }}>
        Post current affairs PDFs, study notes, question papers, formula sheets - anything students need daily.
      </p>

      {/* POST FORM */}
      <div style={{ ...S.card, marginBottom:24, borderLeft:'4px solid #C9A84C' }}>
        <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:15, marginBottom:16 }}>+ Post New Material</h3>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={S.label}>Title *</label>
            <input style={S.input} placeholder="e.g. Daily Current Affairs - 17 June 2026"
              value={form.title} onChange={e => f('title', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Subtitle (optional)</label>
            <input style={S.input} placeholder="e.g. Economy + Science + Polity"
              value={form.subtitle} onChange={e => f('subtitle', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Source</label>
            <input style={S.input} placeholder="e.g. The Hindu, PIB, Drishti IAS"
              value={form.source} onChange={e => f('source', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Type</label>
            <select style={S.input} value={form.material_type} onChange={e => f('material_type', e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g,' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>Publish Date</label>
            <input type="date" style={S.input} value={form.publish_date} onChange={e => f('publish_date', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Visible To</label>
            <select style={S.input} value={form.relevant_for} onChange={e => f('relevant_for', e.target.value)}>
              <option value="all">All Users</option>
              <option value="free">Free Users</option>
              <option value="pro">Pro Users Only</option>
              <option value="ultra">Ultra Only</option>
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={S.label}>File URL (Supabase Storage / CDN URL / YouTube Link)</label>
            <input style={S.input} placeholder="https://... (paste URL after uploading to Supabase Storage)"
              value={form.file_url} onChange={e => f('file_url', e.target.value)} />
            <p style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>
              💡 To upload: go to Supabase → Storage → materials bucket → Upload file → Copy URL → Paste above
            </p>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:16 }}>
          <button onClick={handlePost} disabled={saving} style={{ ...S.btnGold, opacity: saving ? 0.6 : 1 }}>
            {saving ? '⏳ Posting...' : '📤 Post Material'}
          </button>
          {saveMsg && <span style={{ color:'#059669', fontSize:13, fontWeight:600 }}>{saveMsg}</span>}
        </div>
      </div>

      {/* FILTER */}
      <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:8, marginBottom:14 }}>
        {['all', ...TYPES.slice(0,6)].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer', whiteSpace:'nowrap', fontSize:12, fontWeight:600,
              background: filter===t ? '#1E3A5F' : '#F1F5F9',
              color:      filter===t ? '#fff'    : '#64748B' }}>
            {t === 'all' ? 'All' : t.replace(/_/g,' ')}
          </button>
        ))}
      </div>

      {/* MATERIALS LIST */}
      {loading ? <p style={{ color:'#94A3B8' }}>Loading...</p>
      : materials.length === 0 ? (
        <div style={{ textAlign:'center', padding:40, color:'#94A3B8', ...S.card }}>
          <p style={{ fontSize:32 }}>📄</p>
          <p>No materials posted yet. Use the form above to post your first one.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {materials.map(m => (
            <div key={m.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', ...S.card, flexWrap:'wrap', gap:8 }}>
              <div style={{ flex:1, minWidth:200 }}>
                <p style={{ fontWeight:700, color:'#1E3A5F', fontSize:13 }}>{m.title}</p>
                <p style={{ fontSize:11, color:'#94A3B8' }}>
                  {m.material_type?.replace(/_/g,' ')} · {m.publish_date} · {m.source || 'No source'}
                </p>
                <p style={{ fontSize:11, color:'var(--color-text-light,#64748B)', marginTop:2 }}>
                  👁️ {m.view_count||0} views · ⬇️ {m.download_count||0} downloads
                </p>
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <span style={S.tag(m.is_active)}>{m.is_active ? 'Live' : 'Hidden'}</span>
                {m.file_url && (
                  <a href={m.file_url} target="_blank" rel="noreferrer"
                    style={{ ...S.btn, padding:'6px 12px', fontSize:11, textDecoration:'none' }}>
                    View
                  </a>
                )}
                <button onClick={() => toggleActive(m)} style={S.btnRed}>
                  {m.is_active ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -- FLAGS & FIX (NEW) -----------------------------------------------------
function FlagsTab() {
  const [flags, setFlags]     = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus]   = useState('pending')
  const [bulkQueue, setBulkQueue] = useState([])

  useEffect(() => { loadFlags() }, [status])

  const loadFlags = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('question_flags')
        .select('*, questions(question_en, topic_id, subject_id, difficulty)')
        .eq('status', status)
        .order('created_at', { ascending:false })
        .limit(50)
      setFlags(data || [])
    } catch {
      // Load from localStorage (flags saved offline by ActiveTest)
      const local = JSON.parse(localStorage.getItem('tryit_pending_flags') || '[]')
      setFlags(local)
    }
    setLoading(false)
  }

  const loadBulkQueue = async () => {
    try {
      const { data } = await supabase.from('bulk_fix_queue').select('*').eq('status','pending_approval').limit(20)
      setBulkQueue(data || [])
    } catch {}
  }

  useEffect(() => { loadBulkQueue() }, [])

  const dismissFlag = async (flagId) => {
    try {
      await supabase.from('question_flags').update({ status:'auto_dismissed' }).eq('flag_id', flagId)
    } catch {}
    setFlags(prev => prev.filter(f => f.flag_id !== flagId))
  }

  const rerouteFlag = async (flagId) => {
    try {
      await supabase.rpc('find_mentor_for_flag', { p_flag_id: flagId, p_topic_id: null, p_subject_id: null, p_language: 'en', p_flag_type: 'other' })
      alert('Re-routed to next available mentor')
      loadFlags()
    } catch { alert('Could not re-route - check Supabase') }
  }

  const approveBulkFix = async (queueId) => {
    if (!window.confirm('Apply this bulk fix to all affected questions?')) return
    try {
      await supabase.from('bulk_fix_queue').update({ status:'approved', approved_by:'admin', approved_at:new Date().toISOString() }).eq('queue_id', queueId)
      setBulkQueue(prev => prev.filter(b => b.queue_id !== queueId))
      alert('✅ Bulk fix approved! It will run in the background.')
    } catch { alert('Could not approve - check Supabase') }
  }

  const FLAG_TYPE_LABELS = {
    wrong_answer:'Wrong Answer', wrong_options:'Options Error',
    question_error:'Question Error', translation_error:'Translation Error',
    explanation_error:'Explanation Wrong', outdated:'Outdated',
    duplicate:'Duplicate', out_of_syllabus:'Out of Syllabus',
    inappropriate:'Inappropriate', poor_quality:'Poor Quality', other:'Other',
  }

  const STATUS_COLORS = {
    pending:'#FEF3C7', assigned:'#DBEAFE', in_review:'#EDE9FE',
    resolved:'#D1FAE5', auto_dismissed:'#F1F5F9',
  }

  return (
    <div>
      <h2 style={S.h2}>🚩 Flags & Bulk Fix</h2>

      {/* Bulk fix queue */}
      {bulkQueue.length > 0 && (
        <div style={{ ...S.card, marginBottom:20, borderLeft:'4px solid #DC2626' }}>
          <h3 style={{ color:'#DC2626', fontFamily:'Poppins,sans-serif', fontWeight:700, marginBottom:12 }}>
            ⚠️ Bulk Fix Queue ({bulkQueue.length} pending approval)
          </h3>
          {bulkQueue.map(b => (
            <div key={b.queue_id} style={{ padding:'10px 14px', background:'#FEF2F2', borderRadius:12, marginBottom:8, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
              <div>
                <p style={{ fontWeight:700, fontSize:13, color:'#991B1B' }}>{b.fix_type?.replace(/_/g,' ')}</p>
                <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)' }}>{b.fix_description}</p>
                <p style={{ fontSize:11, color:'#94A3B8' }}>{b.total_count} questions affected</p>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <button onClick={() => approveBulkFix(b.queue_id)} style={S.btnGold}>
                  ✅ Approve Fix
                </button>
                <button onClick={async () => {
                  await supabase.from('bulk_fix_queue').update({ status:'rejected' }).eq('queue_id', b.queue_id)
                  setBulkQueue(prev => prev.filter(x => x.queue_id !== b.queue_id))
                }} style={S.btnRed}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status filter */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {['pending','assigned','in_review','resolved','auto_dismissed'].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            style={{ padding:'7px 14px', borderRadius:99, border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
              background: status===s ? '#1E3A5F' : '#F1F5F9',
              color:      status===s ? '#fff'    : '#64748B' }}>
            {s.replace(/_/g,' ')}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color:'#94A3B8' }}>Loading flags...</p>
      : flags.length === 0 ? (
        <div style={{ textAlign:'center', padding:40, color:'#94A3B8', ...S.card }}>
          <p style={{ fontSize:32 }}>✅</p>
          <p>No {status} flags. Great!</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {flags.map((flag,i) => (
            <div key={flag.flag_id||i} style={{ padding:'12px 16px', borderRadius:14, border:'1.5px solid #E2E8F0',
              background: STATUS_COLORS[flag.status] || '#F8FAFC', display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8 }}>
                <div>
                  <span style={{ background:'#FEE2E2', color:'#991B1B', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700 }}>
                    {FLAG_TYPE_LABELS[flag.flag_type] || flag.flag_type}
                  </span>
                  <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)', marginTop:4 }}>
                    Q: <code style={{ fontSize:11 }}>{(flag.question_id||'').slice(0,30)}...</code>
                  </p>
                  <p style={{ fontSize:11, color:'#94A3B8' }}>
                    Lang: {(flag.language_used||'en').toUpperCase()} ·
                    Topic: {flag.topic_id||'-'} ·
                    {flag.created_at ? new Date(flag.created_at).toLocaleDateString('en-IN') : 'just now'}
                  </p>
                  {flag.description && (
                    <p style={{ fontSize:12, color:'#475569', marginTop:2, fontStyle:'italic' }}>
                      "{flag.description}"
                    </p>
                  )}
                </div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  <button onClick={() => rerouteFlag(flag.flag_id)} style={{ ...S.btn, padding:'6px 12px', fontSize:11 }}>
                    Re-route
                  </button>
                  <button onClick={() => dismissFlag(flag.flag_id)} style={S.btnRed}>
                    Dismiss
                  </button>
                </div>
              </div>
              {flag.assigned_to && (
                <p style={{ fontSize:11, color:'#059669', fontWeight:600 }}>
                  ✓ Assigned to mentor: {(flag.assigned_to||'').slice(0,20)}...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -- SYSTEM CONFIG (NEW) ----------------------------------------------------
function ConfigTab() {
  // All config stored in localStorage and synced to Supabase system_config table
  const DEFAULT_CONFIG = {
    free_tier_daily_tests:    { value:'5',     type:'number', label:'Free: Tests per day',                   category:'limits'   },
    free_tier_explanations_6h:{ value:'5',     type:'number', label:'Free: Explanations per 6 hours',        category:'limits'   },
    explanation_coin_cost:    { value:'20',    type:'number', label:'Coins per explanation (free tier)',      category:'coins'    },
    coin_pack_1_price:        { value:'5',     type:'number', label:'Coin pack 1: Price (₹)',                 category:'pricing'  },
    coin_pack_1_coins:        { value:'100',   type:'number', label:'Coin pack 1: Coins given',              category:'pricing'  },
    coin_pack_2_price:        { value:'20',    type:'number', label:'Coin pack 2: Price (₹)',                 category:'pricing'  },
    coin_pack_2_coins:        { value:'500',   type:'number', label:'Coin pack 2: Coins given',              category:'pricing'  },
    coin_pack_3_price:        { value:'49',    type:'number', label:'Coin pack 3: Price (₹)',                 category:'pricing'  },
    coin_pack_3_coins:        { value:'1500',  type:'number', label:'Coin pack 3: Coins given',              category:'pricing'  },
    topic_unlock_price:       { value:'25',    type:'number', label:'Topic concept unlock price (₹)',         category:'pricing'  },
    pro_3day_price:           { value:'49',    type:'number', label:'Pro 3-day pass price (₹)',               category:'pricing'  },
    pro_monthly_price:        { value:'199',   type:'number', label:'Pro monthly price (₹)',                  category:'pricing'  },
    pro_yearly_price:         { value:'999',   type:'number', label:'Pro yearly price (₹)',                   category:'pricing'  },
    ultra_monthly_price:      { value:'299',   type:'number', label:'Ultra monthly price (₹)',                category:'pricing'  },
    ultra_yearly_price:       { value:'1499',  type:'number', label:'Ultra yearly price (₹)',                 category:'pricing'  },
    coins_per_test:           { value:'10',    type:'number', label:'Coins earned per test completed',        category:'coins'    },
    coins_streak_bonus:       { value:'50',    type:'number', label:'Coins for 7-day streak',                 category:'coins'    },
    flag_threshold_hide:      { value:'10',    type:'number', label:'Auto-hide question after N flags',       category:'limits'   },
    leaderboard_refresh_mins: { value:'30',    type:'number', label:'Leaderboard refresh (minutes)',          category:'features' },
    maintenance_mode:         { value:'false', type:'bool',   label:'Maintenance Mode (blocks all users)',    category:'features' },
    daily_material_notify:    { value:'true',  type:'bool',   label:'Push notification for daily materials', category:'features' },
    new_concept_notify:       { value:'true',  type:'bool',   label:'Notify on concept level unlock',         category:'features' },
    concept_unlock_score_pct: { value:'70',    type:'number', label:'Min score % to unlock next concept level',category:'features'},
    referral_signup_coins:    { value:'50',    type:'number', label:'Referral: coins on friend signup',       category:'referral' },
    referral_upgrade_coins:   { value:'200',   type:'number', label:'Referral: coins when friend upgrades Pro',category:'referral'},
    mentor_fix_coins:         { value:'50',    type:'number', label:'Mentor: coins per correct flag fix',     category:'mentor'   },
    mentor_fix_cashback:      { value:'5',     type:'number', label:'Mentor: ₹ cashback per correct fix',     category:'mentor'   },
    institution_cashback_pct: { value:'10',    type:'number', label:'Institution: % cashback on student subs',category:'mentor'   },
  }

  const [config, setConfig] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tryit_admin_config') || '{}')
      const merged = { ...DEFAULT_CONFIG }
      Object.keys(saved).forEach(k => {
        if (merged[k]) merged[k] = { ...merged[k], value: saved[k] }
      })
      return merged
    } catch { return DEFAULT_CONFIG }
  })
  const [saved, setSaved] = useState(false)

  const updateConfig = (key, val) => {
    setConfig(prev => ({ ...prev, [key]: { ...prev[key], value: val } }))
  }

  const saveAll = async () => {
    const flat = {}
    Object.entries(config).forEach(([k,v]) => { flat[k] = v.value })
    localStorage.setItem('tryit_admin_config', JSON.stringify(flat))

    // Sync to Supabase
    try {
      const rows = Object.entries(flat).map(([key,value]) => ({
        key, value: JSON.stringify(value),
        value_type: config[key]?.type === 'bool' ? 'boolean' : 'number',
        category:   config[key]?.category || 'features',
        description:config[key]?.label || key,
        last_changed_by: 'admin',
        last_changed_at: new Date().toISOString(),
      }))
      await supabase.from('system_config').upsert(rows, { onConflict:'key' })
    } catch {}

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const CATEGORIES = [...new Set(Object.values(config).map(c => c.category))]

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:8 }}>
        <h2 style={{ ...S.h2, marginBottom:0 }}>⚙️ System Config</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {saved && <span style={{ color:'#059669', fontSize:13, fontWeight:600 }}>✅ Saved!</span>}
          <button onClick={saveAll} style={S.btnGold}>💾 Save All Changes</button>
        </div>
      </div>
      <p style={{ color:'#DC2626', fontSize:12, marginBottom:20, background:'#FEF2F2', padding:'8px 12px', borderRadius:10 }}>
        ⚠️ Changes take effect immediately - no app deployment needed. All prices and limits below are fully controlled here.
      </p>

      {CATEGORIES.map(cat => (
        <div key={cat} style={{ marginBottom:24 }}>
          <h3 style={{ fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:1.2, textTransform:'uppercase', marginBottom:12 }}>
            {cat}
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:10 }}>
            {Object.entries(config)
              .filter(([,v]) => v.category === cat)
              .map(([key,item]) => (
                <div key={key} style={{ ...S.card, padding:'12px 14px' }}>
                  <label style={{ ...S.label, marginBottom:6 }}>{item.label}</label>
                  {item.type === 'bool' ? (
                    <div style={{ display:'flex', gap:8 }}>
                      {['true','false'].map(opt => (
                        <button key={opt} onClick={() => updateConfig(key, opt)}
                          style={{ flex:1, padding:'8px', borderRadius:9, border:'1.5px solid',
                            borderColor: item.value===opt ? (opt==='true'?'#059669':'#DC2626') : '#E2E8F0',
                            background:  item.value===opt ? (opt==='true'?'#D1FAE5':'#FEE2E2') : '#fff',
                            color:       item.value===opt ? (opt==='true'?'#065F46':'#991B1B') : '#94A3B8',
                            fontWeight:700, fontSize:12, cursor:'pointer' }}>
                          {opt === 'true' ? '✓ ON' : '✗ OFF'}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input type="number" value={item.value}
                      onChange={e => updateConfig(key, e.target.value)}
                      style={{ ...S.input }} />
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// -- ANNOUNCEMENTS (NEW) ----------------------------------------------------
function AnnouncementsTab() {
  const [anns, setAnns]   = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title:'', body:'', ann_type:'important',
    priority:3, target_users:'all',
    show_until: new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0,10),
  })
  const [saving, setSaving] = useState(false)

  const ANN_TYPES = ['maintenance','exam_alert','new_feature','offer','result','important','celebration']

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('admin_announcements').select('*').order('created_at',{ascending:false}).limit(30)
        setAnns(data || [])
      } catch {
        setAnns(JSON.parse(localStorage.getItem('tryit_admin_announcements') || '[]'))
      }
      setLoading(false)
    })()
  }, [])

  const f = (k,v) => setForm(prev => ({ ...prev, [k]:v }))

  const post = async () => {
    if (!form.title.trim() || !form.body.trim()) { alert('Title and body required'); return }
    setSaving(true)
    const record = {
      ...form,
      ann_id:    `ann_${Date.now()}`,
      is_active: true,
      show_from: new Date().toISOString(),
      show_until: form.show_until ? new Date(form.show_until).toISOString() : null,
      posted_by: 'admin',
      created_at: new Date().toISOString(),
    }
    try {
      await supabase.from('admin_announcements').insert(record)
    } catch {
      const saved = JSON.parse(localStorage.getItem('tryit_admin_announcements') || '[]')
      saved.unshift(record)
      localStorage.setItem('tryit_admin_announcements', JSON.stringify(saved))
    }
    setAnns(prev => [record, ...prev])
    setForm(x => ({ ...x, title:'', body:'' }))
    setSaving(false)
  }

  const toggleAnn = async (ann) => {
    try {
      await supabase.from('admin_announcements').update({ is_active:!ann.is_active }).eq('ann_id', ann.ann_id)
    } catch {}
    setAnns(prev => prev.map(a => a.ann_id===ann.ann_id ? {...a, is_active:!a.is_active} : a))
  }

  const PRIORITY_LABELS = { 1:'Info',2:'Low',3:'Medium',4:'High',5:'Critical (Popup)' }

  return (
    <div>
      <h2 style={S.h2}>📢 Platform Announcements</h2>
      <p style={{ color:'#94A3B8', fontSize:13, marginBottom:20 }}>
        Post exam alerts, maintenance notices, feature launches, or celebration messages. Priority 5 shows as a popup immediately.
      </p>

      {/* Form */}
      <div style={{ ...S.card, marginBottom:20, borderLeft:'4px solid #7C3AED' }}>
        <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:15, marginBottom:14 }}>+ New Announcement</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={S.label}>Title *</label>
            <input style={S.input} placeholder="e.g. UPSC 2026 Prelims Date Announced!"
              value={form.title} onChange={e => f('title', e.target.value)} />
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={S.label}>Body *</label>
            <textarea rows={3} style={{ ...S.input, resize:'none' }}
              placeholder="Full announcement text..."
              value={form.body} onChange={e => f('body', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Type</label>
            <select style={S.input} value={form.ann_type} onChange={e => f('ann_type', e.target.value)}>
              {ANN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>Priority: {PRIORITY_LABELS[form.priority]}</label>
            <input type="range" min={1} max={5} value={form.priority} onChange={e => f('priority', parseInt(e.target.value))}
              style={{ width:'100%', marginTop:8 }} />
          </div>
          <div>
            <label style={S.label}>Show To</label>
            <select style={S.input} value={form.target_users} onChange={e => f('target_users', e.target.value)}>
              <option value="all">All Users</option>
              <option value="free_only">Free Users Only</option>
              <option value="lapsed">Lapsed Users</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Show Until</label>
            <input type="date" style={S.input} value={form.show_until} onChange={e => f('show_until', e.target.value)} />
          </div>
        </div>
        <button onClick={post} disabled={saving} style={{ ...S.btnGold, marginTop:14 }}>
          {saving ? '⏳ Posting...' : '📢 Post Announcement'}
        </button>
      </div>

      {/* List */}
      {loading ? <p style={{ color:'#94A3B8' }}>Loading...</p>
      : anns.length === 0 ? (
        <div style={{ textAlign:'center', padding:30, color:'#94A3B8', ...S.card }}>
          <p style={{ fontSize:28 }}>📢</p>
          <p>No announcements yet.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {anns.map(a => (
            <div key={a.ann_id} style={{ padding:'12px 16px', ...S.card, opacity: a.is_active ? 1 : 0.5 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                    <span style={{ fontWeight:700, color:'#1E3A5F', fontSize:13 }}>{a.title}</span>
                    <span style={{ fontSize:11, padding:'2px 8px', borderRadius:99, background:'#EDE9FE', color:'#6D28D9', fontWeight:700 }}>
                      {a.ann_type}
                    </span>
                    <span style={{ fontSize:11, color:'#94A3B8' }}>P{a.priority} · {a.target_users}</span>
                  </div>
                  <p style={{ fontSize:12, color:'#475569', lineHeight:1.5 }}>{a.body}</p>
                  {a.show_until && (
                    <p style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>
                      Until: {new Date(a.show_until).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <span style={S.tag(a.is_active)}>{a.is_active ? 'Live' : 'Hidden'}</span>
                  <button onClick={() => toggleAnn(a)} style={S.btnRed}>
                    {a.is_active ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -- SECURITY --------------------------------------------------------------
function SecurityTab() {
  const [events, setEvents] = useState([])
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('security_events').select('*').order('timestamp',{ascending:false}).limit(50)
        setEvents(data || [])
      } catch { setEvents([]) }
    })()
  }, [])

  return (
    <div>
      <h2 style={S.h2}>Security Events</h2>
      {events.length === 0 ? (
        <div style={{ textAlign:'center', padding:40, color:'#94A3B8', ...S.card }}>
          <p style={{ fontSize:32 }}>✅</p>
          <p>No security events. (Device-level checks are a Month 2+ feature.)</p>
        </div>
      ) : events.map(e => (
        <div key={e.id} style={{ padding:'10px 14px', background:'#FEF2F2', borderRadius:12, marginBottom:8, fontSize:13 }}>
          {e.type} - {e.severity} - {new Date(e.timestamp).toLocaleString('en-IN')}
        </div>
      ))}
    </div>
  )
}

// -- VIEW AS ---------------------------------------------------------------
function ViewAsTab() {
  const { viewAs } = useAuth()
  const navigate   = useNavigate()

  const ROLES = [
    { id:'student',     emoji:'🎓', label:'Student',      route:'/dashboard',
      desc:'Full access, 3 exams pre-loaded, 9999 coins, Level 10' },
    { id:'mentor',      emoji:'🧑‍🏫', label:'Mentor',       route:'/mentor-hub',
      desc:'Mentor Hub, Cashback Center, Analytics, Flag reviews' },
    { id:'institution', emoji:'🏫', label:'Institution',  route:'/centre/dashboard',
      desc:'Centre Dashboard, Conduct Test, Student History' },
    { id:'family',      emoji:'👨‍👩‍👧', label:'Family Hub',   route:'/family',
      desc:'Family Hub, Parent Dashboard, Child tracking' },
  ]

  return (
    <div>
      <h2 style={S.h2}>👁️ View As - QA Mode</h2>
      <p style={{ color:'#94A3B8', fontSize:13, marginBottom:16 }}>
        Experience the app as any role with full Pro access. A banner shows so you can exit back to Admin anytime.
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
        {ROLES.map(r => (
          <div key={r.id} style={S.card}>
            <p style={{ fontSize:32, marginBottom:8 }}>{r.emoji}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:15, marginBottom:6 }}>{r.label}</p>
            <p style={{ color:'#94A3B8', fontSize:12, marginBottom:12, lineHeight:1.5 }}>{r.desc}</p>
            <button onClick={() => { viewAs(r.id); navigate(r.route) }}
              style={{ ...S.btn, width:'100%', textAlign:'center' }}>
              Enter as {r.label} →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TOURNAMENT ADMIN TAB
// Create tournaments, set schedules, manage polls, dispatch prizes, announce
// Architecture: Admin creates → CDN serves questions → Cloudflare Worker batch
// ═══════════════════════════════════════════════════════════════════════════

function TournamentAdminTab(){
  const[subtab,setSubtab]=useState('upcoming')
  const[tournaments,setTournaments]=useState([])
  const[polls,setPolls]=useState([])
  const[showCreate,setShowCreate]=useState(false)
  const[form,setForm]=useState({
    tournament_name:'',tournament_type:'national',exam_scheme_id:'ssc_cgl_t1',
    exam_display_name:'SSC CGL Tier 1',total_questions:100,
    exam_date:'',exam_time:'09:00',entry_fee_free_user:5,
    question_sets_count:50,scope_states:[],
  })

  const NAVY='#1E3A5F',GOLD='#C9A84C'

  useEffect(()=>{
    supabase.from('tournaments').select('*').order('exam_starts_at',{ascending:false}).limit(20)
      .then(({data})=>{if(data)setTournaments(data)}).catch(()=>{})
    supabase.from('tournament_polls').select('*').order('vote_count',{ascending:false}).limit(20)
      .then(({data})=>{if(data)setPolls(data)}).catch(()=>{})
  },[])

  const createTournament=async()=>{
    if(!form.tournament_name||!form.exam_date){alert('Fill tournament name and date');return}
    const examDate=form.exam_date
    const examStartsAt=`${examDate}T${form.exam_time}:00+05:30`
    const examEndsAt=new Date(new Date(examStartsAt).getTime()+90*60000).toISOString()
    const subWindowEnds=new Date(new Date(examEndsAt).getTime()+75*60000).toISOString()
    const batchComputeAt=`${examDate}T10:30:00+05:30`
    const resultsAt=`${examDate}T20:00:00+05:30`
    const regOpens=new Date(new Date(examStartsAt).getTime()-7*86400000).toISOString()
    const regCloses=new Date(new Date(examStartsAt).getTime()-2*3600000).toISOString()

    const t={
      tournament_name:form.tournament_name,
      tournament_type:form.tournament_type,
      exam_scheme_id:form.exam_scheme_id,
      exam_display_name:form.exam_display_name,
      total_questions:parseInt(form.total_questions),
      registration_opens:regOpens,
      registration_closes:regCloses,
      exam_starts_at:examStartsAt,
      exam_ends_at:examEndsAt,
      submission_window_ends:subWindowEnds,
      batch_compute_at:batchComputeAt,
      results_at:resultsAt,
      question_sets_count:parseInt(form.question_sets_count),
      entry_fee_free_user:parseFloat(form.entry_fee_free_user),
      entry_fee_pro_ultra:0,
      status:'draft',
      cdn_question_url:`https://cdn.tryiteducations.net/q/${Date.now()}`,
    }

    const{data,error}=await supabase.from('tournaments').insert(t).select().single()
    if(error){alert('Error: '+error.message);return}
    setTournaments(prev=>[data,...prev])
    setShowCreate(false)
    setForm({tournament_name:'',tournament_type:'national',exam_scheme_id:'ssc_cgl_t1',exam_display_name:'SSC CGL Tier 1',total_questions:100,exam_date:'',exam_time:'09:00',entry_fee_free_user:5,question_sets_count:50,scope_states:[]})
    alert('✅ Tournament created as DRAFT. Set status to "upcoming" when ready to open registration.')
  }

  const updateStatus=async(id,status)=>{
    await supabase.from('tournaments').update({status}).eq('tournament_id',id)
    setTournaments(prev=>prev.map(t=>t.tournament_id===id?{...t,status}:t))
  }

  const dispatchPrizes=async(id)=>{
    if(!confirm('Dispatch prizes to top performers now?'))return
    try{
      const{error}=await supabase.rpc('dispatch_tournament_prizes',{p_tournament_id:id})
      if(error)throw error
      alert('✅ Prizes dispatched! Top performers upgraded. Leaderboard pinned. Coins awarded.')
    }catch(e){alert('Error: '+e.message)}
  }

  const confirmPoll=async(pollId,note)=>{
    await supabase.from('tournament_polls').update({status:'admin_confirmed',admin_note:note}).eq('poll_id',pollId)
    setPolls(prev=>prev.map(p=>p.poll_id===pollId?{...p,status:'admin_confirmed',admin_note:note}:p))
    alert('✅ Poll confirmed! Students will see it scheduled.')
  }

  const STATUS_COLORS={draft:'#94A3B8',upcoming:'#1D4ED8',registration_open:'#059669',live:'#DC2626',computing:'#7C3AED',results_live:GOLD,archived:'#94A3B8'}
  const SCHEME_OPTIONS=[
    {id:'ssc_cgl_t1',name:'SSC CGL Tier 1'},{id:'ibps_po_pre',name:'IBPS PO Prelims'},
    {id:'upsc_cse_pre',name:'UPSC CSE Prelims'},{id:'jee_main',name:'JEE Main'},
    {id:'neet_ug',name:'NEET UG'},{id:'nda_written',name:'NDA Written'},
    {id:'rrb_ntpc_cbt1',name:'RRB NTPC CBT1'},{id:'tnpsc_g1',name:'TNPSC Group 1'},
    {id:'kpsc_ka',name:'KPSC Group A/B'},{id:'gate_general',name:'GATE'},
  ]

  return(
    <div style={{padding:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div>
          <h2 style={{...S.h2,marginBottom:2}}>🏆 Tournament Control</h2>
          <p style={{fontSize:12,color:'var(--color-text-light,#64748B)',margin:0}}>Create · Schedule · Announce · Dispatch prizes</p>
        </div>
        <button onClick={()=>setShowCreate(true)} style={S.btnGold}>+ Create Tournament</button>
      </div>

      {/* Subtabs */}
      <div style={{display:'flex',background:'#F1F5F9',borderRadius:10,padding:3,marginBottom:14}}>
        {[{id:'upcoming',l:'📅 Active'},{id:'polls',l:'🗳️ Polls'},{id:'archived',l:'📦 Archive'}].map(t=>(
          <button key={t.id} onClick={()=>setSubtab(t.id)} style={{flex:1,padding:'8px',borderRadius:8,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:subtab===t.id?NAVY:'transparent',color:subtab===t.id?'#fff':'#64748B'}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Architecture reminder */}
      <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:12,padding:10,marginBottom:14}}>
        <p style={{fontSize:11,color:'#065F46',margin:0,lineHeight:1.7}}>
          ✅ <strong>Architecture:</strong> Questions → Cloudflare CDN (AES-256 encrypted JSON) · Test → 100% offline on device · Submit → 1KB jitter → Cloudflare Worker → R2 · 4 PM → Histogram batch → rank_index.json → KV · 8 PM → App reads CDN → rank on device · <strong>Cost: ~₹1,300/tournament · Revenue: ₹50L</strong>
        </p>
      </div>

      {subtab==='upcoming'&&(
        <div>
          {tournaments.filter(t=>t.status!=='archived').map(t=>(
            <div key={t.tournament_id} style={{...S.card,marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                <div>
                  <p style={{fontWeight:700,color:'var(--color-text,#1E293B)',fontSize:14,margin:'0 0 2px'}}>{t.tournament_name}</p>
                  <p style={{fontSize:11,color:'var(--color-text-light,#64748B)',margin:0}}>{t.exam_display_name} · {t.total_questions}Q · {t.question_sets_count} sets</p>
                </div>
                <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:99,background:`${STATUS_COLORS[t.status]}20`,color:STATUS_COLORS[t.status]}}>
                  {t.status?.replace('_',' ').toUpperCase()}
                </span>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:10}}>
                <div style={{background:'var(--color-bg,#F8FAFC)',borderRadius:8,padding:'8px',textAlign:'center'}}>
                  <p style={{fontSize:11,fontWeight:700,color:NAVY,margin:'0 0 1px'}}>{new Date(t.exam_starts_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</p>
                  <p style={{fontSize:9,color:'#94A3B8',margin:0}}>Exam Date</p>
                </div>
                <div style={{background:'var(--color-bg,#F8FAFC)',borderRadius:8,padding:'8px',textAlign:'center'}}>
                  <p style={{fontSize:11,fontWeight:700,color:'#059669',margin:'0 0 1px'}}>{(t.total_registrations||0).toLocaleString('en-IN')}</p>
                  <p style={{fontSize:9,color:'#94A3B8',margin:0}}>Registered</p>
                </div>
                <div style={{background:'var(--color-bg,#F8FAFC)',borderRadius:8,padding:'8px',textAlign:'center'}}>
                  <p style={{fontSize:11,fontWeight:700,color:GOLD,margin:'0 0 1px'}}>₹{((t.total_registrations||0)*t.entry_fee_free_user).toLocaleString('en-IN')}</p>
                  <p style={{fontSize:9,color:'#94A3B8',margin:0}}>Est. Revenue</p>
                </div>
              </div>

              {/* Status control */}
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {[
                  {s:'upcoming',l:'📅 Set Upcoming',show:t.status==='draft'},
                  {s:'registration_open',l:'✅ Open Registration',show:['upcoming'].includes(t.status)},
                  {s:'live',l:'🔴 Go Live',show:t.status==='registration_closed'},
                  {s:'submission_window',l:'⏳ Close Exam',show:t.status==='live'},
                  {s:'computing',l:'🔄 Computing',show:t.status==='submission_window'},
                  {s:'results_live',l:'🏆 Release Results',show:t.status==='computing'},
                  {s:'archived',l:'📦 Archive',show:t.status==='results_live'},
                ].filter(x=>x.show).map(x=>(
                  <button key={x.s} onClick={()=>updateStatus(t.tournament_id,x.s)}
                    style={{padding:'6px 12px',border:'none',borderRadius:8,fontWeight:700,fontSize:11,cursor:'pointer',background:NAVY,color:'#fff'}}>
                    {x.l}
                  </button>
                ))}
                {t.status==='results_live'&&(
                  <button onClick={()=>dispatchPrizes(t.tournament_id)}
                    style={{padding:'6px 12px',border:'none',borderRadius:8,fontWeight:700,fontSize:11,cursor:'pointer',background:GOLD,color:NAVY}}>
                    🎁 Dispatch Prizes
                  </button>
                )}
              </div>

              {/* CDN URL field */}
              {t.status==='draft'&&(
                <div style={{marginTop:10}}>
                  <p style={{fontSize:11,color:'var(--color-text-light,#64748B)',marginBottom:4}}>CDN Question URL (paste after uploading encrypted JSON to Cloudflare)</p>
                  <input defaultValue={t.cdn_question_url||''} placeholder="https://cdn.tryiteducations.net/q/tournament_id"
                    onBlur={e=>supabase.from('tournaments').update({cdn_question_url:e.target.value}).eq('tournament_id',t.tournament_id).then(()=>{})}
                    style={{width:'100%',padding:'8px 10px',borderRadius:8,border:'1.5px solid #E2E8F0',fontSize:11,boxSizing:'border-box'}}/>
                </div>
              )}
            </div>
          ))}
          {tournaments.filter(t=>t.status!=='archived').length===0&&(
            <div style={{textAlign:'center',padding:32,color:'#94A3B8'}}>
              <p style={{fontSize:24}}>🏆</p><p>No active tournaments. Create one above!</p>
            </div>
          )}
        </div>
      )}

      {subtab==='polls'&&(
        <div>
          <p style={{fontSize:12,color:'var(--color-text-light,#64748B)',marginBottom:12}}>
            When votes cross the minimum threshold, confirm here to schedule the tournament.
          </p>
          {polls.map(poll=>(
            <div key={poll.poll_id} style={{...S.card,marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                <div>
                  <p style={{fontWeight:700,color:'var(--color-text,#1E293B)',fontSize:14,margin:'0 0 2px'}}>{poll.exam_name}</p>
                  <p style={{fontSize:11,color:'var(--color-text-light,#64748B)',margin:0}}>{poll.description}</p>
                </div>
                <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:99,
                  background:poll.status==='threshold_reached'?'#D1FAE5':'#EFF6FF',
                  color:poll.status==='threshold_reached'?'#065F46':'#1D4ED8'}}>
                  {poll.vote_count?.toLocaleString('en-IN')} votes
                </span>
              </div>
              {/* Vote progress */}
              <div style={{height:6,background:'#E2E8F0',borderRadius:99,overflow:'hidden',marginBottom:8}}>
                <div style={{height:'100%',width:`${Math.min(((poll.vote_count||0)/(poll.min_votes_national||2000))*100,100)}%`,background:poll.status==='threshold_reached'?'#059669':NAVY,borderRadius:99}}/>
              </div>
              <p style={{fontSize:10,color:'#94A3B8',margin:'0 0 8px'}}>{poll.vote_count}/{poll.min_votes_national||2000} national / {poll.min_votes_state||500} state threshold</p>
              {poll.admin_note&&<p style={{fontSize:11,color:'#475569',background:'var(--color-bg,#F8FAFC)',padding:'6px 10px',borderRadius:8,margin:'0 0 8px'}}>🛡️ Admin note: {poll.admin_note}</p>}
              {['threshold_reached','open'].includes(poll.status)&&poll.status!=='admin_confirmed'&&(
                <button onClick={()=>{
                  const note=prompt('Enter admin note for students (e.g. "Scheduling for July 2026"):')
                  if(note!==null)confirmPoll(poll.poll_id,note)
                }} style={{padding:'8px 16px',background:NAVY,color:'#fff',border:'none',borderRadius:9,fontWeight:700,fontSize:12,cursor:'pointer'}}>
                  ✅ Confirm & Schedule
                </button>
              )}
              {poll.status==='admin_confirmed'&&<span style={{fontSize:11,color:'#059669',fontWeight:700}}>✅ Confirmed - will be scheduled</span>}
            </div>
          ))}
        </div>
      )}

      {subtab==='archived'&&(
        <div>
          {tournaments.filter(t=>t.status==='archived').map(t=>(
            <div key={t.tournament_id} style={{...S.card,marginBottom:8,opacity:0.7}}>
              <p style={{fontWeight:600,color:'#475569',fontSize:13,margin:'0 0 2px'}}>{t.tournament_name}</p>
              <p style={{fontSize:11,color:'#94A3B8',margin:0}}>
                {new Date(t.exam_starts_at).toLocaleDateString('en-IN')} · {(t.total_submissions||0).toLocaleString('en-IN')} submissions · ₹{((t.total_submissions||0)*t.entry_fee_free_user).toLocaleString('en-IN')} revenue
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create Tournament Modal */}
      {showCreate&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:1000}}
          onClick={e=>e.target===e.currentTarget&&setShowCreate(false)}>
          <div style={{background:'#fff',borderRadius:'20px 20px 0 0',padding:24,width:'100%',maxWidth:500,maxHeight:'90vh',overflowY:'auto'}}>
            <h3 style={{fontFamily:'Poppins,sans-serif',fontWeight:800,color:NAVY,marginBottom:16}}>+ Create New Tournament</h3>

            <label style={S.label}>Tournament Name *</label>
            <input style={{...S.input,marginBottom:10}} placeholder="All India SSC CGL Championship 2026"
              value={form.tournament_name} onChange={e=>setForm(f=>({...f,tournament_name:e.target.value}))}/>

            <label style={S.label}>Tournament Type</label>
            <select style={{...S.input,marginBottom:10}} value={form.tournament_type} onChange={e=>setForm(f=>({...f,tournament_type:e.target.value}))}>
              <option value="national">🇮🇳 National (All India)</option>
              <option value="state">🏢 State Level</option>
              <option value="match_day">⚡ Match Day</option>
              <option value="practice">📝 Practice</option>
            </select>

            <label style={S.label}>Exam</label>
            <select style={{...S.input,marginBottom:10}} value={form.exam_scheme_id} onChange={e=>{
              const scheme=SCHEME_OPTIONS.find(s=>s.id===e.target.value)
              setForm(f=>({...f,exam_scheme_id:e.target.value,exam_display_name:scheme?.name||''}))
            }}>
              {SCHEME_OPTIONS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
              <div>
                <label style={S.label}>Exam Date *</label>
                <input type="date" style={S.input} value={form.exam_date} onChange={e=>setForm(f=>({...f,exam_date:e.target.value}))}/>
              </div>
              <div>
                <label style={S.label}>Start Time</label>
                <input type="time" style={S.input} value={form.exam_time} onChange={e=>setForm(f=>({...f,exam_time:e.target.value}))}/>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
              <div>
                <label style={S.label}>Question Sets (50-100)</label>
                <input type="number" style={S.input} value={form.question_sets_count} onChange={e=>setForm(f=>({...f,question_sets_count:e.target.value}))} min={10} max={100}/>
              </div>
              <div>
                <label style={S.label}>Free User Entry Fee (₹)</label>
                <input type="number" style={S.input} value={form.entry_fee_free_user} onChange={e=>setForm(f=>({...f,entry_fee_free_user:e.target.value}))} min={0}/>
              </div>
            </div>

            <div style={{background:'#FFF7E6',border:`1px solid ${GOLD}`,borderRadius:10,padding:10,marginBottom:14}}>
              <p style={{fontSize:11,color:'#92400E',margin:0,lineHeight:1.7}}>
                ⚙️ <strong>Auto-calculated:</strong> Registration opens 7 days before · Closes 2h before · Exam time -10% (our_time) · Submission window +75min · Batch compute 4 PM · Results 8 PM<br/>
                💰 <strong>Revenue estimate:</strong> ₹{(100000*parseFloat(form.entry_fee_free_user||5)).toLocaleString('en-IN')} at 1 lakh free users
              </p>
            </div>

            <div style={{display:'flex',gap:8}}>
              <button onClick={createTournament} style={{...S.btnGold,flex:1,padding:'12px'}}>Create Tournament</button>
              <button onClick={()=>setShowCreate(false)} style={{flex:1,padding:'12px',border:'1.5px solid #E2E8F0',borderRadius:11,cursor:'pointer',background:'#fff',color:'var(--color-text-light,#64748B)',fontSize:13}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME ECONOMY ADMIN TAB
// Full control over coin entry/win/loss amounts - changeable anytime, no app update
// Add to TABS: { id:'game_economy', label:'🎮 Game Economy' }
// Add to render: {tab === 'game_economy' && <GameEconomyTab />}
// ═══════════════════════════════════════════════════════════════════════════
function GameEconomyTab(){
  const[config,setConfig]=useState({
    entry_cost:5, win_reward:5, loss_penalty:5, draw_reward:0,
    coin_pack_1_price:5, coin_pack_1_coins:50,
    coin_pack_2_price:20, coin_pack_2_coins:220,
    coin_pack_3_price:49, coin_pack_3_coins:600,
  })
  const[games,setGames]=useState([])
  const[overrideGame,setOverrideGame]=useState(null)
  const[saving,setSaving]=useState(false)
  const NAVY='#1E3A5F',GOLD='#C9A84C'

  useEffect(()=>{
    supabase.from('game_economy_config').select('*').eq('config_id','default').single()
      .then(({data})=>{if(data)setConfig(data)}).catch(()=>{})
    supabase.from('games_catalog').select('game_id,name,emoji,tier_required').order('tier_rank')
      .then(({data})=>{if(data)setGames(data)}).catch(()=>{})
  },[])

  const save=async()=>{
    setSaving(true)
    try{
      await supabase.from('game_economy_config').update({...config,updated_at:new Date().toISOString()}).eq('config_id','default')
      alert('✅ Saved! Takes effect immediately for all games - no app update needed.')
    }catch(e){alert('Error: '+e.message)}
    setSaving(false)
  }

  const saveOverride=async(gameId,overrides)=>{
    try{
      const{data:current}=await supabase.from('game_economy_config').select('per_game_overrides').eq('config_id','default').single()
      const updated={...(current?.per_game_overrides||{}),[gameId]:overrides}
      await supabase.from('game_economy_config').update({per_game_overrides:updated}).eq('config_id','default')
      alert(`✅ Override saved for ${gameId}`)
      setOverrideGame(null)
    }catch(e){alert('Error: '+e.message)}
  }

  return(
    <div style={{padding:16}}>
      <h2 style={{...S.h2,marginBottom:4}}>🎮 Game Economy Control</h2>
      <p style={{fontSize:12,color:'var(--color-text-light,#64748B)',marginBottom:16}}>
        Change coin amounts anytime - 5 → 50 → 500, instant effect, zero app deployment needed.
      </p>

      <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:12,padding:12,marginBottom:16}}>
        <p style={{fontSize:12,color:'#065F46',margin:0,lineHeight:1.7}}>
          💰 <strong>Default Secret Sauce:</strong> ₹5 = 50 coins. Win game = +5 coins. Lose = -5 coins.
          Each game costs 5 coins to enter. Net swing per game = 10 coins - creates "one more game" loop.
        </p>
      </div>

      {/* GLOBAL DEFAULTS */}
      <div style={{...S.card,marginBottom:16}}>
        <p style={{fontSize:13,fontWeight:700,color:NAVY,marginBottom:12}}>⚙️ Global Defaults (all games unless overridden)</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          <div>
            <label style={S.label}>Entry Cost (coins to play)</label>
            <input type="number" style={S.input} value={config.entry_cost}
              onChange={e=>setConfig(c=>({...c,entry_cost:parseInt(e.target.value)||0}))}/>
          </div>
          <div>
            <label style={S.label}>Win Reward (coins)</label>
            <input type="number" style={S.input} value={config.win_reward}
              onChange={e=>setConfig(c=>({...c,win_reward:parseInt(e.target.value)||0}))}/>
          </div>
          <div>
            <label style={S.label}>Loss Penalty (coins)</label>
            <input type="number" style={S.input} value={config.loss_penalty}
              onChange={e=>setConfig(c=>({...c,loss_penalty:parseInt(e.target.value)||0}))}/>
          </div>
          <div>
            <label style={S.label}>Draw Reward (Battle ties)</label>
            <input type="number" style={S.input} value={config.draw_reward}
              onChange={e=>setConfig(c=>({...c,draw_reward:parseInt(e.target.value)||0}))}/>
          </div>
        </div>
        <p style={{fontSize:11,color:'#94A3B8'}}>
          Net per game if won: +{config.win_reward}🪙 · if lost: -{config.loss_penalty}🪙 (entry {config.entry_cost}🪙 always deducted first)
        </p>
      </div>

      {/* COIN PURCHASE PACKS */}
      <div style={{...S.card,marginBottom:16}}>
        <p style={{fontSize:13,fontWeight:700,color:NAVY,marginBottom:12}}>🛒 Coin Purchase Packs</p>
        {[1,2,3].map(n=>(
          <div key={n} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
            <div>
              <label style={S.label}>Pack {n} Price (₹)</label>
              <input type="number" style={S.input} value={config[`coin_pack_${n}_price`]}
                onChange={e=>setConfig(c=>({...c,[`coin_pack_${n}_price`]:parseFloat(e.target.value)||0}))}/>
            </div>
            <div>
              <label style={S.label}>Pack {n} Coins</label>
              <input type="number" style={S.input} value={config[`coin_pack_${n}_coins`]}
                onChange={e=>setConfig(c=>({...c,[`coin_pack_${n}_coins`]:parseInt(e.target.value)||0}))}/>
            </div>
          </div>
        ))}
        <p style={{fontSize:11,color:'#92400E',background:'#FFF7E6',padding:'8px 10px',borderRadius:8}}>
          💡 Secret sauce: ₹{config.coin_pack_1_price} feels like nothing → {config.coin_pack_1_coins} coins = {Math.floor(config.coin_pack_1_coins/config.entry_cost)} game entries · zero friction purchase
        </p>
      </div>

      <button onClick={save} disabled={saving} style={{...S.btnGold,width:'100%',padding:'13px',marginBottom:20}}>
        {saving?'Saving...':'💾 Save Global Economy (Instant Effect)'}
      </button>

      {/* PER-GAME OVERRIDES */}
      <div style={S.card}>
        <p style={{fontSize:13,fontWeight:700,color:NAVY,marginBottom:4}}>🎯 Per-Game Overrides</p>
        <p style={{fontSize:11,color:'var(--color-text-light,#64748B)',marginBottom:12}}>Set custom economy for specific games (e.g. Battle costs more)</p>
        {games.map(g=>(
          <div key={g.game_id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #F1F5F9'}}>
            <span style={{fontSize:12,color:'#475569'}}>{g.emoji} {g.name}</span>
            <button onClick={()=>setOverrideGame(g.game_id)}
              style={{padding:'5px 12px',background:'#F1F5F9',color:NAVY,border:'none',borderRadius:8,fontSize:11,fontWeight:600,cursor:'pointer'}}>
              Override →
            </button>
          </div>
        ))}
      </div>

      {overrideGame&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}
          onClick={e=>e.target===e.currentTarget&&setOverrideGame(null)}>
          <OverrideModal gameId={overrideGame} defaultConfig={config} onSave={saveOverride} onClose={()=>setOverrideGame(null)}/>
        </div>
      )}
    </div>
  )
}

function OverrideModal({gameId,defaultConfig,onSave,onClose}){
  const[entry,setEntry]=useState(defaultConfig.entry_cost)
  const[win,setWin]=useState(defaultConfig.win_reward)
  const[loss,setLoss]=useState(defaultConfig.loss_penalty)
  const NAVY='#1E3A5F'

  return(
    <div style={{background:'#fff',borderRadius:20,padding:24,maxWidth:340,width:'100%'}}>
      <h3 style={{fontFamily:'Poppins,sans-serif',fontWeight:800,color:NAVY,marginBottom:14}}>Override: {gameId}</h3>
      <label style={S.label}>Entry Cost</label>
      <input type="number" style={{...S.input,marginBottom:10}} value={entry} onChange={e=>setEntry(parseInt(e.target.value)||0)}/>
      <label style={S.label}>Win Reward</label>
      <input type="number" style={{...S.input,marginBottom:10}} value={win} onChange={e=>setWin(parseInt(e.target.value)||0)}/>
      <label style={S.label}>Loss Penalty</label>
      <input type="number" style={{...S.input,marginBottom:16}} value={loss} onChange={e=>setLoss(parseInt(e.target.value)||0)}/>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>onSave(gameId,{entry_cost:entry,win_reward:win,loss_penalty:loss})} style={{...S.btnGold,flex:1}}>Save Override</button>
        <button onClick={onClose} style={{flex:1,padding:'10px',border:'1.5px solid #E2E8F0',borderRadius:11,background:'#fff',color:'var(--color-text-light,#64748B)',cursor:'pointer'}}>Cancel</button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME & LEVEL TESTING TAB
// Direct admin shortcut - jump to any game, any level, any theme universe instantly
// Add to TABS: { id:'game_testing', label:'🛡️ Game Testing' }
// Add to render: {tab === 'game_testing' && <GameTestingTab />}
// ═══════════════════════════════════════════════════════════════════════════
function GameTestingTab(){
  const navigate=useNavigate()
  const[games,setGames]=useState([])
  const[search,setSearch]=useState('')
  const NAVY='#1E3A5F'

  useEffect(()=>{
    supabase.from('games_catalog').select('*').order('tier_rank')
      .then(({data})=>{if(data)setGames(data)}).catch(()=>{})
  },[])

  const filtered=games.filter(g=>g.name.toLowerCase().includes(search.toLowerCase()))
  const TIER_COLOR={free:'#64748B',pro:'#1D4ED8',ultra:'#92400E'}

  return(
    <div style={{padding:16}}>
      <h2 style={{...S.h2,marginBottom:4}}>🛡️ Game & Level Testing</h2>
      <p style={{fontSize:12,color:'var(--color-text-light,#64748B)',marginBottom:16}}>
        Jump straight into any game at any level - bypasses all tier gates and coin costs.
        Test plays never touch real student leaderboards or skill data.
      </p>

      <div style={{background:'#FEF2F2',border:'1.5px solid #FCA5A5',borderRadius:12,padding:12,marginBottom:16}}>
        <p style={{fontSize:12,color:'#991B1B',margin:0,lineHeight:1.7}}>
          ⚠️ This bypass only works because your account role is <strong>admin</strong>.
          Regular students always go through the normal unlock flow - this tab has zero
          effect on the live game economy.
        </p>
      </div>

      <input placeholder="🔍 Search games..." value={search} onChange={e=>setSearch(e.target.value)}
        style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid #E2E8F0',fontSize:13,marginBottom:14,boxSizing:'border-box'}}/>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {filtered.map(g=>(
          <div key={g.game_id} onClick={()=>navigate(`/games/levels/${g.game_id}`)}
            style={{...S.card,cursor:'pointer',padding:'12px',display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:22}}>{g.emoji}</span>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:12,fontWeight:700,color:'var(--color-text,#1E293B)',margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{g.name}</p>
              <span style={{fontSize:9,fontWeight:700,padding:'1px 6px',borderRadius:99,background:`${TIER_COLOR[g.tier_required]}15`,color:TIER_COLOR[g.tier_required]}}>
                {g.tier_required.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length===0&&<p style={{textAlign:'center',color:'#94A3B8',padding:30}}>No games match your search.</p>}
    </div>
  )
}