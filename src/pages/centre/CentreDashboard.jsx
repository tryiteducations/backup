// FILE: src/pages/centre/CentreDashboard.jsx
// TryIT — Institution / Coaching Centre Dashboard
// Manage students, batches, conduct tests, track performance, earn cashback
// Route: /centre/dashboard
import { useState, useEffect } from 'react'
import { useNavigate }        from 'react-router-dom'
import { useAuth }            from '../../context/AuthContext'
import { supabase }           from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'
const GREEN = '#059669'

// ── MOCK DATA ─────────────────────────────────────────────────────────────
const MOCK_CENTRE = {
  client_id:     'centre-001',
  centre_name:   'Vijay IAS Academy',
  city:          'Coimbatore',
  state:         'Tamil Nadu',
  plan:          'institution_monthly',
  seats_total:   200,
  seats_used:    87,
  cashback_pending: 1240,
  cashback_total:   8920,
  joined:        '2026-01-15',
}

const MOCK_BATCHES = [
  { id:'b1', name:'SSC CGL 2026 Batch A', exam:'SSC CGL', students:32, avg_score:74, last_test:'2 days ago', color:'#1D4ED8', active:true },
  { id:'b2', name:'UPSC 2027 Foundation', exam:'UPSC CSE', students:18, avg_score:61, last_test:'1 week ago', color:'#DC2626', active:true },
  { id:'b3', name:'Banking Prelims Nov', exam:'IBPS PO',   students:24, avg_score:68, last_test:'Yesterday',  color:'#059669', active:true },
  { id:'b4', name:'TNPSC Group 2 Tamil',  exam:'TNPSC',   students:13, avg_score:77, last_test:'3 days ago', color:'#7C3AED', active:true },
]

const MOCK_STUDENTS = [
  { id:'s1', name:'Priya Krishnamurthy', batch:'SSC CGL 2026 Batch A', plan:'pro',   tests:28, avg_score:82, streak:14, last_active:'2h ago',  rank:234  },
  { id:'s2', name:'Arjun Selvam',        batch:'SSC CGL 2026 Batch A', plan:'ultra', tests:35, avg_score:89, streak:21, last_active:'30m ago', rank:87   },
  { id:'s3', name:'Kavitha Rajan',       batch:'UPSC 2027 Foundation', plan:'ultra', tests:42, avg_score:71, streak:8,  last_active:'1d ago',  rank:512  },
  { id:'s4', name:'Suresh Pandiyan',     batch:'Banking Prelims Nov',  plan:'pro',   tests:19, avg_score:64, streak:5,  last_active:'3h ago',  rank:1240 },
  { id:'s5', name:'Meena Devi',          batch:'TNPSC Group 2 Tamil',  plan:'pro',   tests:31, avg_score:78, streak:12, last_active:'6h ago',  rank:334  },
  { id:'s6', name:'Raj Kumar',           batch:'SSC CGL 2026 Batch A', plan:'free',  tests:8,  avg_score:58, streak:2,  last_active:'2d ago',  rank:2810 },
  { id:'s7', name:'Anita Menon',         batch:'Banking Prelims Nov',  plan:'pro',   tests:22, avg_score:71, streak:9,  last_active:'4h ago',  rank:678  },
]

const MOCK_TOP_STUDENTS = [
  { name:'Arjun Selvam',   score:89, tests:35, batch:'SSC CGL' },
  { name:'Priya K.',       score:82, tests:28, batch:'SSC CGL' },
  { name:'Meena Devi',     score:78, tests:31, batch:'TNPSC'   },
  { name:'Kavitha Rajan',  score:71, tests:42, batch:'UPSC'    },
  { name:'Anita Menon',    score:71, tests:22, batch:'Banking' },
]

const S = {
  card:   { background:'#fff', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0', marginBottom:12 },
  badge:  (bg,color) => ({ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99, background:bg, color }),
  btn:    { background:NAVY, color:'#fff', border:'none', borderRadius:10, padding:'10px 18px', fontWeight:700, fontSize:13, cursor:'pointer' },
  btnSm:  { background:'#EFF6FF', color:NAVY, border:'1.5px solid #BFDBFE', borderRadius:8, padding:'6px 12px', fontWeight:600, fontSize:11, cursor:'pointer' },
  inp:    { width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:10, background:'#fff' },
}

export default function CentreDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [tab,          setTab]          = useState('overview')
  const [centre,       setCentre]       = useState(MOCK_CENTRE)
  const [batches,      setBatches]      = useState(MOCK_BATCHES)
  const [students,     setStudents]     = useState(MOCK_STUDENTS)
  const [batchFilter,  setBatchFilter]  = useState('all')
  const [search,       setSearch]       = useState('')
  const [showAddBatch, setShowAddBatch] = useState(false)
  const [showTestModal,setShowTestModal]= useState(null)
  const [newBatch,     setNewBatch]     = useState({ name:'', exam:'', color:'#1D4ED8' })
  const [testConfig,   setTestConfig]   = useState({ mode:'mock', count:100, duration:60 })

  useEffect(() => {
    if (!user?.id) return
    supabase.from('b2b_clients').select('*').eq('contact_user_id', user.id).single()
      .then(({ data }) => { if (data) setCentre(data) })
      .catch(()=>{})
  }, [user?.id])

  const filteredStudents = students
    .filter(s => batchFilter === 'all' || s.batch === batchFilter)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  const seatsAvail  = centre.seats_total - centre.seats_used
  const seatsPct    = (centre.seats_used / centre.seats_total) * 100
  const avgOverall  = Math.round(students.reduce((a,s) => a + s.avg_score, 0) / students.length)
  const activeToday = students.filter(s => s.last_active.includes('m ago') || s.last_active.includes('h ago')).length

  const conductTest = async () => {
    if (!showTestModal) return
    try {
      await supabase.from('batch_tests').insert({
        batch_id:   showTestModal.id,
        client_id:  centre.client_id,
        test_config: testConfig,
        assigned_at: new Date().toISOString(),
        exam_name:   showTestModal.exam,
      })
    } catch {}
    alert(`✅ Test assigned to ${showTestModal.name}! All ${showTestModal.students} students will see it when they log in.`)
    setShowTestModal(null)
  }

  const PLAN_BADGE = {
    free:  { bg:'#F1F5F9', color:'#64748B' },
    pro:   { bg:'#DBEAFE', color:'#1D4ED8' },
    ultra: { bg:'#FFF7E6', color:'#92400E' },
  }

  const TABS = [
    { id:'overview',  label:'📊 Overview'  },
    { id:'batches',   label:'👥 Batches'   },
    { id:'students',  label:'🎓 Students'  },
    { id:'tests',     label:'📝 Tests'     },
    { id:'earnings',  label:'💰 Earnings'  },
  ]

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'20px 16px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <button onClick={() => navigate('/')} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <span style={{ background:`${GOLD}33`, color:GOLD, padding:'4px 12px', borderRadius:99, fontSize:11, fontWeight:700 }}>🏫 INSTITUTION</span>
        </div>

        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:20, color:'#fff', margin:'0 0 2px' }}>
          {centre.centre_name}
        </p>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:'0 0 16px' }}>
          📍 {centre.city}, {centre.state} · {centre.seats_used}/{centre.seats_total} seats used
        </p>

        {/* Seats bar */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>Seats Used</span>
            <span style={{ fontSize:11, color: seatsAvail < 20 ? '#FCA5A5' : GOLD, fontWeight:700 }}>
              {seatsAvail} seats available
            </span>
          </div>
          <div style={{ height:6, background:'rgba(255,255,255,0.15)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${seatsPct}%`, background: seatsPct>90?'#EF4444':GOLD, borderRadius:99 }} />
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {[
            { label:'Total Students', value:centre.seats_used  },
            { label:'Active Today',   value:activeToday        },
            { label:'Avg Score',      value:`${avgOverall}%`   },
            { label:'Batches',        value:batches.length     },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'8px 4px', textAlign:'center' }}>
              <p style={{ fontWeight:800, color:'#fff', fontSize:16, margin:'0 0 2px' }}>{s.value}</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────────────────────────── */}
      <div style={{ display:'flex', background:'#fff', borderBottom:'1px solid #E2E8F0', overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:'12px 6px', border:'none', background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
              color: tab===t.id ? NAVY : '#94A3B8',
              borderBottom: tab===t.id ? `2.5px solid ${GOLD}` : '2.5px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:16, maxWidth:600, margin:'0 auto' }}>

        {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div>
            {/* Top performers */}
            <div style={S.card}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:12 }}>🏆 Top Performers This Week</p>
              {MOCK_TOP_STUDENTS.map((s, i) => (
                <div key={s.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0',
                  borderBottom: i<MOCK_TOP_STUDENTS.length-1 ? '1px solid #F1F5F9' : 'none' }}>
                  <span style={{ fontSize:16, width:24, textAlign:'center' }}>
                    {i<3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}
                  </span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:'#1E293B', margin:0 }}>{s.name}</p>
                    <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{s.batch} · {s.tests} tests</p>
                  </div>
                  <span style={{ fontSize:13, fontWeight:800,
                    color: s.score>=80?GREEN:s.score>=70?GOLD:'#64748B' }}>
                    {s.score}%
                  </span>
                </div>
              ))}
            </div>

            {/* Batch performance */}
            <div style={S.card}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:12 }}>📚 Batch Performance</p>
              {batches.map(b => (
                <div key={b.id} style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:b.color }} />
                      <span style={{ fontSize:12, fontWeight:600, color:'#1E293B' }}>{b.name}</span>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, color:b.avg_score>=70?GREEN:GOLD }}>
                      {b.avg_score}% avg
                    </span>
                  </div>
                  <div style={{ height:6, background:'#E2E8F0', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${b.avg_score}%`, background:b.color, borderRadius:99 }} />
                  </div>
                  <p style={{ fontSize:10, color:'#94A3B8', marginTop:3 }}>{b.students} students · Last test: {b.last_test}</p>
                </div>
              ))}
            </div>

            {/* Cashback teaser */}
            <div style={{ background:`linear-gradient(135deg,${GREEN},#047857)`, borderRadius:16, padding:16 }}>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', margin:'0 0 4px' }}>THIS MONTH'S CASHBACK</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:32, color:'#fff', margin:'0 0 4px' }}>
                ₹{centre.cashback_pending.toLocaleString('en-IN')}
              </p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', margin:'0 0 12px' }}>
                10% of all student subscription payments
              </p>
              <button onClick={() => setTab('earnings')}
                style={{ padding:'8px 18px', background:'rgba(255,255,255,0.2)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', borderRadius:10, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                View Earnings →
              </button>
            </div>
          </div>
        )}

        {/* ── BATCHES ──────────────────────────────────────────────────── */}
        {tab === 'batches' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <p style={{ fontWeight:700, color:NAVY, fontSize:15, margin:0 }}>Your Batches</p>
              <button onClick={() => setShowAddBatch(true)} style={S.btn}>
                + Create Batch
              </button>
            </div>

            {batches.map(b => (
              <div key={b.id} style={{ ...S.card, borderLeft:`4px solid ${b.color}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <p style={{ fontSize:14, fontWeight:800, color:'#1E293B', margin:'0 0 2px' }}>{b.name}</p>
                    <p style={{ fontSize:11, color:'#64748B', margin:0 }}>
                      {b.exam} · {b.students} students · Last test: {b.last_test}
                    </p>
                  </div>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${b.color}20`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:16, color:b.color }}>
                    {b.avg_score}%
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height:4, background:'#E2E8F0', borderRadius:99, overflow:'hidden', marginBottom:10 }}>
                  <div style={{ height:'100%', width:`${b.avg_score}%`, background:b.color, borderRadius:99 }} />
                </div>

                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => { setBatchFilter(b.name); setTab('students') }}
                    style={S.btnSm}>
                    👥 View Students
                  </button>
                  <button onClick={() => { setShowTestModal(b) }}
                    style={{ ...S.btnSm, background:'#F0FDF4', color:GREEN, borderColor:'#BBF7D0' }}>
                    📝 Assign Test
                  </button>
                  <button onClick={() => navigate('/current-affairs')}
                    style={{ ...S.btnSm, background:`${b.color}10`, color:b.color, borderColor:`${b.color}44` }}>
                    📄 Post Material
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STUDENTS ─────────────────────────────────────────────────── */}
        {tab === 'students' && (
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              <input style={{ ...S.inp, flex:1, marginBottom:0 }}
                placeholder="Search students..."
                value={search} onChange={e => setSearch(e.target.value)} />
              <select style={{ padding:'10px 8px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:12, flexShrink:0 }}
                value={batchFilter} onChange={e => setBatchFilter(e.target.value)}>
                <option value="all">All Batches</option>
                {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>

            <p style={{ fontSize:11, color:'#64748B', marginBottom:10 }}>
              Showing {filteredStudents.length} students
            </p>

            {filteredStudents.map(s => {
              const pb = PLAN_BADGE[s.plan] || PLAN_BADGE.free
              return (
                <div key={s.id} style={{ ...S.card, padding:'12px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:`${NAVY}15`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:800, color:NAVY, fontSize:13, flexShrink:0 }}>
                      {s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <p style={{ fontSize:13, fontWeight:700, color:'#1E293B', margin:0 }}>{s.name}</p>
                        <span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:99, background:pb.bg, color:pb.color }}>
                          {s.plan.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize:10, color:'#94A3B8', margin:'2px 0 0' }}>
                        {s.batch} · 🔥{s.streak}d · Last: {s.last_active}
                      </p>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <p style={{ fontSize:14, fontWeight:800,
                        color: s.avg_score>=80?GREEN:s.avg_score>=70?GOLD:'#64748B', margin:0 }}>
                        {s.avg_score}%
                      </p>
                      <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{s.tests} tests · #{s.rank}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Upgrade nudge for free plan students */}
            {filteredStudents.some(s => s.plan==='free') && (
              <div style={{ background:'#FFF7E6', border:`1px solid ${GOLD}`, borderRadius:12, padding:12, marginTop:4 }}>
                <p style={{ fontSize:12, color:'#92400E', margin:'0 0 8px', fontWeight:600 }}>
                  💡 {filteredStudents.filter(s=>s.plan==='free').length} students on free plan — upgrade them to Pro for better results
                </p>
                <p style={{ fontSize:11, color:'#78350F', margin:'0 0 8px', lineHeight:1.5 }}>
                  As an institution partner, you earn 10% cashback on every subscription they buy.
                  Upgrading {filteredStudents.filter(s=>s.plan==='free').length} students = ₹{filteredStudents.filter(s=>s.plan==='free').length * 199 * 0.1 | 0} extra cashback/month.
                </p>
                <button style={{ padding:'8px 16px', background:GOLD, color:NAVY, border:'none', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                  Share Upgrade Link with Students →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ASSIGN TEST ───────────────────────────────────────────────── */}
        {tab === 'tests' && (
          <div>
            <p style={{ fontSize:12, color:'#64748B', marginBottom:14 }}>
              Assign tests to your batches. Students see the test when they log in next.
            </p>

            {batches.map(b => (
              <div key={b.id} style={{ ...S.card, borderLeft:`4px solid ${b.color}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#1E293B', margin:'0 0 2px' }}>{b.name}</p>
                    <p style={{ fontSize:11, color:'#64748B', margin:0 }}>{b.students} students · {b.exam}</p>
                  </div>
                  <button onClick={() => setShowTestModal(b)} style={{ ...S.btn, padding:'8px 14px', fontSize:12 }}>
                    📝 Assign Test
                  </button>
                </div>
              </div>
            ))}

            <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:12, marginTop:4 }}>
              <p style={{ fontSize:12, color:'#1D4ED8', fontWeight:600, marginBottom:4 }}>ℹ️ About Test Assignment</p>
              <p style={{ fontSize:11, color:'#1D4ED8', lineHeight:1.6, margin:0 }}>
                All tests follow PYQ-aligned question weightage for your exam.
                Duration is automatically set 10% shorter than real exam time to build preparation pressure.
                Students can take the test anytime in the next 7 days.
              </p>
            </div>
          </div>
        )}

        {/* ── EARNINGS ─────────────────────────────────────────────────── */}
        {tab === 'earnings' && (
          <div>
            <div style={{ background:`linear-gradient(135deg,${GREEN},#047857)`, borderRadius:18, padding:20, textAlign:'center', marginBottom:14 }}>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', margin:'0 0 4px' }}>PENDING CASHBACK</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:40, color:'#fff', margin:'0 0 4px' }}>
                ₹{centre.cashback_pending.toLocaleString('en-IN')}
              </p>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', margin:'0 0 16px' }}>
                Total earned: ₹{centre.cashback_total.toLocaleString('en-IN')}
              </p>
              <button style={{ padding:'10px 28px', background:'rgba(255,255,255,0.2)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', borderRadius:12, fontWeight:800, fontSize:13, cursor:'pointer' }}>
                Withdraw to Bank / UPI →
              </button>
            </div>

            <div style={{ ...S.card, marginBottom:12 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:12 }}>💰 How You Earn</p>
              {[
                { event:'Student buys Pro (₹199/month)',    you:'₹19.90/month per student' },
                { event:'Student buys Ultra (₹299/month)',  you:'₹29.90/month per student' },
                { event:'Student buys Pro Annual (₹999)',   you:'₹99.90 one-time'          },
                { event:'Student buys Ultra Annual (₹1499)',you:'₹149.90 one-time'         },
              ].map(r => (
                <div key={r.event} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F1F5F9' }}>
                  <span style={{ fontSize:12, color:'#475569' }}>{r.event}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:GREEN }}>{r.you}</span>
                </div>
              ))}
            </div>

            <div style={{ ...S.card }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:10 }}>📊 Cashback Calculator</p>
              <p style={{ fontSize:12, color:'#64748B', lineHeight:1.7 }}>
                Your current students: <strong>{centre.seats_used}</strong><br/>
                If all upgrade to Pro monthly: <strong style={{ color:GREEN }}>₹{(centre.seats_used * 199 * 0.10).toFixed(0)} per month</strong><br/>
                If all upgrade to Ultra yearly: <strong style={{ color:GREEN }}>₹{(centre.seats_used * 1499 * 0.10).toFixed(0)} one-time</strong>
              </p>
              <p style={{ fontSize:11, color:'#94A3B8', marginTop:8, lineHeight:1.6 }}>
                💡 Share a referral link with your students. Every subscription they purchase automatically credits your account.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ── ADD BATCH MODAL ────────────────────────────────────────────── */}
      {showAddBatch && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:1000 }}
          onClick={e => e.target===e.currentTarget && setShowAddBatch(false)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:24, width:'100%', maxWidth:460 }}>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, marginBottom:16 }}>+ Create New Batch</h3>
            <label style={{ fontSize:11, fontWeight:700, color:'#64748B', display:'block', marginBottom:4 }}>Batch Name *</label>
            <input style={S.inp} placeholder="e.g. SSC CGL Morning Batch 2026"
              value={newBatch.name} onChange={e => setNewBatch(b=>({...b,name:e.target.value}))} />
            <label style={{ fontSize:11, fontWeight:700, color:'#64748B', display:'block', marginBottom:4 }}>Target Exam</label>
            <input style={S.inp} placeholder="e.g. SSC CGL, IBPS PO, TNPSC Group 2"
              value={newBatch.exam} onChange={e => setNewBatch(b=>({...b,exam:e.target.value}))} />
            <label style={{ fontSize:11, fontWeight:700, color:'#64748B', display:'block', marginBottom:4 }}>Batch Colour</label>
            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              {['#1D4ED8','#DC2626','#059669','#7C3AED','#D97706','#0891B2','#1E3A5F'].map(c => (
                <button key={c} onClick={() => setNewBatch(b=>({...b,color:c}))}
                  style={{ width:32, height:32, borderRadius:'50%', background:c, border: newBatch.color===c?`3px solid ${GOLD}`:'3px solid transparent', cursor:'pointer' }} />
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => {
                if (!newBatch.name.trim()) { alert('Enter batch name'); return }
                const batch = { id:`b${Date.now()}`, ...newBatch, students:0, avg_score:0, last_test:'—', active:true }
                setBatches(b => [...b, batch])
                setShowAddBatch(false)
                setNewBatch({ name:'', exam:'', color:'#1D4ED8' })
              }} style={{ ...S.btn, flex:1 }}>Create Batch</button>
              <button onClick={() => setShowAddBatch(false)} style={{ flex:1, padding:'10px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:13, cursor:'pointer', background:'#fff', color:'#64748B' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ASSIGN TEST MODAL ─────────────────────────────────────────── */}
      {showTestModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:1000 }}
          onClick={e => e.target===e.currentTarget && setShowTestModal(null)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:24, width:'100%', maxWidth:460 }}>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, marginBottom:4 }}>📝 Assign Test</h3>
            <p style={{ fontSize:12, color:'#64748B', marginBottom:16 }}>To: {showTestModal.name} ({showTestModal.students} students)</p>

            <label style={{ fontSize:11, fontWeight:700, color:'#64748B', display:'block', marginBottom:4 }}>Test Mode</label>
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              {[{id:'mock',label:'Full Mock'},{ id:'practice',label:'Practice'},{id:'speed',label:'Speed'}].map(m => (
                <button key={m.id} onClick={() => setTestConfig(c=>({...c,mode:m.id}))}
                  style={{ flex:1, padding:'9px', borderRadius:10, border:'none', fontWeight:700, fontSize:12, cursor:'pointer',
                    background:testConfig.mode===m.id?NAVY:'#F1F5F9', color:testConfig.mode===m.id?'#fff':'#64748B' }}>
                  {m.label}
                </button>
              ))}
            </div>

            <label style={{ fontSize:11, fontWeight:700, color:'#64748B', display:'block', marginBottom:4 }}>Questions</label>
            <div style={{ display:'flex', gap:6, marginBottom:12 }}>
              {[25,50,100,150].map(n => (
                <button key={n} onClick={() => setTestConfig(c=>({...c,count:n}))}
                  style={{ flex:1, padding:'8px', borderRadius:9, border:'none', fontWeight:700, fontSize:12, cursor:'pointer',
                    background:testConfig.count===n?NAVY:'#F1F5F9', color:testConfig.count===n?'#fff':'#64748B' }}>
                  {n}Q
                </button>
              ))}
            </div>

            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:'8px 12px', marginBottom:14 }}>
              <p style={{ fontSize:11, color:'#065F46', margin:0 }}>
                ⏱️ Duration: {Math.floor(testConfig.count * 0.54)}m (10% stricter than real exam · PYQ-aligned weightage)
              </p>
            </div>

            <div style={{ display:'flex', gap:8 }}>
              <button onClick={conductTest} style={{ ...S.btn, flex:1 }}>✅ Assign Now</button>
              <button onClick={() => setShowTestModal(null)} style={{ flex:1, padding:'10px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:13, cursor:'pointer', background:'#fff', color:'#64748B' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}