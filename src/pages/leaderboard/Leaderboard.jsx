// FILE: src/pages/leaderboard/Leaderboard.jsx
// TryIT — All India Leaderboard
// Route: /leaderboard
import { useState, useEffect } from 'react'
import { useNavigate }        from 'react-router-dom'
import { useAuth }            from '../../context/AuthContext'
import { supabase }           from '../../lib/supabase'
import ProfilePhoto           from '../../components/ProfilePhoto'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'
const GREEN = '#059669'

// ── MOCK LEADERBOARD DATA ─────────────────────────────────────────────────
const MOCK_ENTRIES = [
  { id:'u1', name:'Priya Krishnamurthy',rank:1,  score:98420, accuracy:94, streak:28, state:'Tamil Nadu',    exam:'SSC CGL',  profile_photo_url:null },
  { id:'u2', name:'Arjun Selvam',       rank:2,  score:97210, accuracy:92, streak:21, state:'Karnataka',     exam:'UPSC CSE', profile_photo_url:null },
  { id:'u3', name:'Kavitha Nair',       rank:3,  score:96870, accuracy:91, streak:35, state:'Kerala',        exam:'IBPS PO',  profile_photo_url:null },
  { id:'u4', name:'Ravi Shankar',       rank:4,  score:95340, accuracy:89, streak:14, state:'Andhra Pradesh',exam:'SSC CGL',  profile_photo_url:null },
  { id:'u5', name:'Meena Kumari',       rank:5,  score:94120, accuracy:88, streak:19, state:'UP',            exam:'TNPSC',    profile_photo_url:null },
  { id:'u6', name:'Suresh Babu',        rank:6,  score:93800, accuracy:87, streak:12, state:'Telangana',     exam:'GATE',     profile_photo_url:null },
  { id:'u7', name:'Anjali Singh',       rank:7,  score:92450, accuracy:86, streak:8,  state:'Bihar',         exam:'NEET',     profile_photo_url:null },
  { id:'u8', name:'Manikandan P.',      rank:8,  score:91200, accuracy:85, streak:22, state:'Tamil Nadu',    exam:'UPSC CSE', profile_photo_url:null },
  { id:'u9', name:'Lakshmi Devi',       rank:9,  score:90870, accuracy:84, streak:16, state:'Maharashtra',   exam:'SSC CHSL', profile_photo_url:null },
  { id:'u10',name:'Gopal Krishna',      rank:10, score:89340, accuracy:83, streak:9,  state:'Rajasthan',     exam:'IBPS PO',  profile_photo_url:null },
  { id:'u11',name:'Sangeetha R.',       rank:11, score:88100, accuracy:82, streak:11, state:'Karnataka',     exam:'KPSC',     profile_photo_url:null },
  { id:'u12',name:'Vikram Nair',        rank:12, score:87650, accuracy:81, streak:7,  state:'Kerala',        exam:'NDA',      profile_photo_url:null },
  { id:'u13',name:'Padmavathi S.',      rank:13, score:86420, accuracy:80, streak:15, state:'Andhra Pradesh',exam:'APPSC',    profile_photo_url:null },
  { id:'u14',name:'Rohit Verma',        rank:14, score:85900, accuracy:80, streak:6,  state:'UP',            exam:'SSC CGL',  profile_photo_url:null },
  { id:'u15',name:'Arthi Devi',         rank:15, score:84750, accuracy:79, streak:20, state:'Tamil Nadu',    exam:'TNPSC',    profile_photo_url:null },
]

const MY_MOCK_RANK = { id:'me', name:'You', rank:1247, score:42180, accuracy:71, streak:5, state:'Tamil Nadu', exam:'SSC CGL', profile_photo_url:null }

const STATES = ['All India','Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana','Maharashtra','Gujarat','Rajasthan','UP','Bihar','West Bengal','MP','Odisha','Punjab','Haryana','Assam','Delhi']
const EXAMS  = ['All Exams','SSC CGL','UPSC CSE','IBPS PO','NEET','JEE','GATE','TNPSC','KPSC','RRB NTPC','NDA']

export default function Leaderboard() {
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const [entries,    setEntries]    = useState(MOCK_ENTRIES)
  const [myRank,     setMyRank]     = useState(MY_MOCK_RANK)
  const [period,     setPeriod]     = useState('weekly')   // weekly | monthly | alltime
  const [stateFilter,setStateFilter]= useState('All India')
  const [examFilter, setExamFilter] = useState('All Exams')
  const [loading,    setLoading]    = useState(false)

  useEffect(() => {
    setLoading(true)
    supabase.from('leaderboard_snapshots')
      .select('*').order('rank',{ascending:true}).limit(50)
      .then(({ data }) => {
        if (data?.length) setEntries(data)
      })
      .catch(()=>{})
      .finally(() => setLoading(false))
  }, [period])

  const filtered = entries.filter(e =>
    (stateFilter === 'All India' || e.state === stateFilter) &&
    (examFilter  === 'All Exams' || e.exam  === examFilter)
  )

  const RANK_STYLES = {
    1: { bg:'linear-gradient(135deg,#FFD700,#FFA500)', color:'#fff', size:52 },
    2: { bg:'linear-gradient(135deg,#C0C0C0,#A0A0A0)', color:'#fff', size:48 },
    3: { bg:'linear-gradient(135deg,#CD7F32,#A0522D)', color:'#fff', size:46 },
  }

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'20px 16px 24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', margin:0 }}>🏆 All India Leaderboard</h1>
        </div>

        {/* Period toggle */}
        <div style={{ display:'flex', background:'rgba(255,255,255,0.1)', borderRadius:12, padding:4, marginBottom:14 }}>
          {[['weekly','This Week'],['monthly','This Month'],['alltime','All Time']].map(([id,label]) => (
            <button key={id} onClick={() => setPeriod(id)}
              style={{ flex:1, padding:'8px 0', borderRadius:9, border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                background:period===id ? '#fff' : 'transparent',
                color:period===id ? NAVY : 'rgba(255,255,255,0.6)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:8, marginBottom:4 }}>
          {/* 2nd */}
          {filtered[1] && (
            <div style={{ flex:1, textAlign:'center' }}>
              <ProfilePhoto userId={filtered[1].id} name={filtered[1].name} photoUrl={filtered[1].profile_photo_url} size={RANK_STYLES[2].size} isOwner={false} />
              <div style={{ background:RANK_STYLES[2].bg, borderRadius:'0 0 12px 12px', padding:'6px 4px', marginTop:-4 }}>
                <p style={{ fontSize:11, fontWeight:800, color:'#fff', margin:'0 0 1px' }}>🥈</p>
                <p style={{ fontSize:10, color:'#fff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{filtered[1].name.split(' ')[0]}</p>
                <p style={{ fontSize:11, fontWeight:800, color:'#fff', margin:0 }}>{filtered[1].score.toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}
          {/* 1st */}
          {filtered[0] && (
            <div style={{ flex:1.2, textAlign:'center' }}>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', fontSize:20 }}>👑</span>
                <ProfilePhoto userId={filtered[0].id} name={filtered[0].name} photoUrl={filtered[0].profile_photo_url} size={RANK_STYLES[1].size} isOwner={false} />
              </div>
              <div style={{ background:RANK_STYLES[1].bg, borderRadius:'0 0 14px 14px', padding:'8px 4px', marginTop:-4 }}>
                <p style={{ fontSize:12, fontWeight:800, color:'#fff', margin:'0 0 1px' }}>🥇 #1</p>
                <p style={{ fontSize:11, color:'#fff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{filtered[0].name.split(' ')[0]}</p>
                <p style={{ fontSize:13, fontWeight:800, color:'#fff', margin:0 }}>{filtered[0].score.toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}
          {/* 3rd */}
          {filtered[2] && (
            <div style={{ flex:1, textAlign:'center' }}>
              <ProfilePhoto userId={filtered[2].id} name={filtered[2].name} photoUrl={filtered[2].profile_photo_url} size={RANK_STYLES[3].size} isOwner={false} />
              <div style={{ background:RANK_STYLES[3].bg, borderRadius:'0 0 12px 12px', padding:'6px 4px', marginTop:-4 }}>
                <p style={{ fontSize:11, fontWeight:800, color:'#fff', margin:'0 0 1px' }}>🥉</p>
                <p style={{ fontSize:10, color:'#fff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{filtered[2].name.split(' ')[0]}</p>
                <p style={{ fontSize:11, fontWeight:800, color:'#fff', margin:0 }}>{filtered[2].score.toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding:'12px 16px', background:'#fff', borderBottom:'1px solid #E2E8F0' }}>
        <div style={{ display:'flex', gap:8 }}>
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
            style={{ flex:1, padding:'8px 10px', borderRadius:9, border:'1.5px solid #E2E8F0', fontSize:12, color:'#475569' }}>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={examFilter} onChange={e => setExamFilter(e.target.value)}
            style={{ flex:1, padding:'8px 10px', borderRadius:9, border:'1.5px solid #E2E8F0', fontSize:12, color:'#475569' }}>
            {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {/* My rank sticky card */}
      {myRank && (
        <div style={{ padding:'8px 16px', background:'#fff', borderBottom:'2px solid #E2E8F0' }}>
          <div style={{ background:`${NAVY}08`, borderRadius:12, padding:'10px 12px', border:`1.5px solid ${NAVY}22`,
            display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:12, fontWeight:800, color:NAVY, width:28 }}>#{myRank.rank}</span>
            <ProfilePhoto userId={user?.id||'me'} name={user?.name||'You'} photoUrl={user?.profile_photo_url} size={32} isOwner />
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, margin:0 }}>
                {user?.name || 'You'} <span style={{ color:'#64748B', fontSize:10 }}>(your rank)</span>
              </p>
              <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{myRank.state}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:13, fontWeight:800, color:NAVY, margin:0 }}>{myRank.score.toLocaleString('en-IN')}</p>
              <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{myRank.accuracy}% acc · 🔥{myRank.streak}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rankings list */}
      <div style={{ padding:'8px 16px' }}>
        {loading ? (
          <p style={{ textAlign:'center', color:'#94A3B8', padding:20 }}>Loading rankings...</p>
        ) : filtered.slice(3).map((entry) => {
          const isMe = entry.id === user?.id
          return (
            <div key={entry.id}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', marginBottom:6,
                background: isMe ? `${NAVY}08` : '#fff',
                borderRadius:12, border: isMe ? `2px solid ${NAVY}` : '1.5px solid #E2E8F0' }}>
              <span style={{ fontSize:13, fontWeight:800, color:'#94A3B8', width:28, textAlign:'center', flexShrink:0 }}>
                #{entry.rank}
              </span>
              <ProfilePhoto userId={entry.id} name={entry.name} photoUrl={entry.profile_photo_url} size={36} isOwner={false} />
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12, fontWeight:700, color:'#1E293B', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {entry.name} {isMe && <span style={{ color:NAVY, fontSize:9 }}>(You)</span>}
                </p>
                <p style={{ fontSize:10, color:'#94A3B8', margin:'2px 0 0' }}>
                  {entry.state} · {entry.exam} · 🔥{entry.streak}d
                </p>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <p style={{ fontSize:13, fontWeight:800, color:NAVY, margin:0 }}>
                  {entry.score.toLocaleString('en-IN')}
                </p>
                <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{entry.accuracy}% acc</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}