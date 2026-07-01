// FILE: src/pages/Profile.jsx
// TryIT - User Profile Page
// Route: /profile
import { useState }     from 'react'
import { useNavigate }  from 'react-router-dom'
import { useAuth }      from '../context/AuthContext'
import ProfilePhoto     from '../components/ProfilePhoto'
import SkillProgress    from '../components/SkillProgress'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'
const GREEN = '#059669'

const LEVEL_TITLES = [
  [1,'The Curious One','🌱'],[2,'The Determined One','💪'],[3,'The Fierce One','🔥'],
  [4,'The Relentless One','⚡'],[5,'The Champion','🏆'],[6,'The Scholar','📚'],
  [7,'The Achiever','🎯'],[8,'The Legend','🌟'],[9,'The Guru','🧙'],[10,'The Elite','👑'],
]

export default function Profile() {
  const navigate  = useNavigate()
  const { user, logout, planTier, isPro, isUltra, coins, updateUser } = useAuth()

  const [tab, setTab] = useState('stats')
  const [editName, setEditName] = useState(false)
  const [nameVal,  setNameVal]  = useState(user?.name || '')

  const level      = Math.min(10, Math.max(1, user?.level || 1))
  const levelInfo  = LEVEL_TITLES[level - 1] || LEVEL_TITLES[0]
  const xpPct      = user?.xpToNext > 0 ? Math.round(((user?.xp||0) / user?.xpToNext) * 100) : 0

  const PLAN_DISPLAY = {
    free:  { label:'Free Plan',            color:'var(--color-text-light,#64748B)', bg:'#F1F5F9',  emoji:'🆓' },
    pro:   { label:'Pro Member',           color:'#1D4ED8', bg:'#EFF6FF',  emoji:'⭐' },
    ultra: { label:'Ultra Member ✨',      color:'#92400E', bg:'#FFF7E6',  emoji:'🏆' },
  }
  const planDisplay = PLAN_DISPLAY[planTier] || PLAN_DISPLAY.free

  const saveUsername = () => {
    if (nameVal.trim()) updateUser({ name: nameVal.trim() })
    setEditName(false)
  }

  const enrolled = user?.exams || [
    { id:'ssc_cgl_t1',  name:'SSC CGL Tier 1',   readiness:72, icon:'📋' },
    { id:'ibps_po_pre', name:'IBPS PO Prelims',   readiness:58, icon:'🏦' },
  ]

  const ACHIEVEMENTS = [
    { id:'first_test',  emoji:'📝', label:'First Test',       desc:'Completed first practice test',        earned:true  },
    { id:'streak_7',    emoji:'🔥', label:'Week Warrior',     desc:'7-day study streak',                   earned:user?.streak>=7  },
    { id:'streak_30',   emoji:'💪', label:'Month Master',     desc:'30-day study streak',                  earned:user?.streak>=30 },
    { id:'top_100',     emoji:'🏆', label:'Top 100',          desc:'Reached All India top 100',            earned:false },
    { id:'concept_1',   emoji:'🧠', label:'Concept Seeker',   desc:'Completed first concept card',         earned:true  },
    { id:'referral_1',  emoji:'👥', label:'First Referral',   desc:'Referred your first friend',           earned:false },
    { id:'accuracy_90', emoji:'🎯', label:'Sharp Shooter',    desc:'90%+ accuracy in a full mock test',    earned:false },
    { id:'bharat_5',    emoji:'🇮🇳', label:'India Lover',     desc:'Read 5 Bharat Pulse stories',          earned:true  },
  ]

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:100 }}>

      {/* Header banner */}
      <div style={{ background:`linear-gradient(160deg,${NAVY} 0%,#0F2140 100%)`, padding:'24px 16px 28px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <button onClick={() => navigate('/settings')} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:'50%', fontSize:18, cursor:'pointer' }}>⚙️</button>
        </div>

        {/* Profile photo + name */}
        <div style={{ textAlign:'center', marginBottom:16 }}>
          <div style={{ display:'inline-block', marginBottom:12 }}>
            <ProfilePhoto
              userId={user?.id}
              name={user?.name}
              photoUrl={user?.profile_photo_url}
              size={84}
              isOwner
              showUpload
              onPhotoUpdated={(url) => updateUser({ profile_photo_url: url })}
            />
          </div>

          {editName ? (
            <div style={{ display:'flex', gap:6, justifyContent:'center', alignItems:'center' }}>
              <input value={nameVal} onChange={e => setNameVal(e.target.value)}
                onKeyDown={e => e.key==='Enter' && saveUsername()}
                style={{ padding:'6px 10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:16, fontWeight:700, textAlign:'center', outline:'none', width:180 }} />
              <button onClick={saveUsername} style={{ background:GREEN, color:'#fff', border:'none', borderRadius:8, padding:'6px 10px', cursor:'pointer', fontSize:13 }}>✓</button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:8, justifyContent:'center', alignItems:'center' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:20, color:'#fff', margin:0 }}>
                {user?.name || 'Student'}
              </p>
              <button onClick={() => setEditName(true)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:14 }}>✏️</button>
            </div>
          )}

          <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:'4px 0 10px' }}>
            {user?.userId || `TRY-001`} · {user?.state || 'India'}
          </p>

          {/* Plan badge */}
          <span style={{ display:'inline-block', background:planDisplay.bg, color:planDisplay.color,
            padding:'5px 14px', borderRadius:99, fontSize:12, fontWeight:800 }}>
            {planDisplay.emoji} {planDisplay.label}
          </span>
        </div>

        {/* Level + XP */}
        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:14, padding:'12px 14px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:20 }}>{levelInfo[2]}</span>
              <div>
                <p style={{ fontSize:12, fontWeight:800, color:'#fff', margin:0 }}>Level {level} - {levelInfo[1]}</p>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.5)', margin:0 }}>
                  {(user?.xp||0).toLocaleString('en-IN')} / {(user?.xpToNext||500).toLocaleString('en-IN')} XP
                </p>
              </div>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:GOLD }}>{xpPct}%</span>
          </div>
          <div style={{ height:6, background:'rgba(255,255,255,0.15)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${xpPct}%`, background:GOLD, borderRadius:99 }} />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, background:'#fff', borderBottom:'1px solid #E2E8F0' }}>
        {[
          { label:'Tests',    value:user?.testsCompleted||0,    emoji:'📝' },
          { label:'Avg Score',value:`${user?.avgScore||0}%`,    emoji:'🎯' },
          { label:'Streak',   value:`${user?.streak||0}d`,      emoji:'🔥' },
          { label:'Rank',     value:`#${user?.rank||'-'}`,      emoji:'🏆' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding:'12px 6px', textAlign:'center', borderRight: i<3?'1px solid #E2E8F0':'none' }}>
            <p style={{ fontSize:18, margin:'0 0 2px' }}>{s.emoji}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:NAVY, margin:'0 0 1px' }}>{s.value}</p>
            <p style={{ fontSize:9, color:'#94A3B8', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', background:'#fff', borderBottom:'1px solid #E2E8F0' }}>
        {[
          { id:'stats',       label:'📊 Stats'       },
          { id:'exams',       label:'📋 Exams'       },
          { id:'achievements',label:'🏅 Badges'      },
          { id:'referral',    label:'👥 Referral'    },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:'11px 4px', border:'none', background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
              color: tab===t.id ? NAVY : '#94A3B8',
              borderBottom: tab===t.id ? `2.5px solid ${GOLD}` : '2.5px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:16, maxWidth:480, margin:'0 auto' }}>

        {/* STATS TAB */}
        {tab === 'stats' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              {[
                { label:'Study Hours',    value:user?.studyHours||'0h',  emoji:'⏱️', color:'#7C3AED' },
                { label:'Coins Earned',   value:`${(coins||0).toLocaleString('en-IN')}🪙`, emoji:'🪙', color:'#92400E' },
                { label:'Questions Done', value:'-',                     emoji:'❓', color:NAVY   },
                { label:'Guru Points',    value:user?.guruPoints||0,     emoji:'⭐', color:GREEN  },
              ].map(s => (
                <div key={s.label} style={{ background:'#fff', borderRadius:14, padding:14, border:'1.5px solid #E2E8F0', textAlign:'center' }}>
                  <p style={{ fontSize:24, margin:'0 0 4px' }}>{s.emoji}</p>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:s.color, margin:'0 0 2px' }}>{s.value}</p>
                  <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ background:'#fff', borderRadius:14, padding:14, border:'1.5px solid #E2E8F0', marginBottom:14 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:10 }}>📅 Member Since</p>
              <p style={{ fontSize:14, color:'#475569', margin:'0 0 4px' }}>{user?.joinDate || 'June 2026'}</p>
              <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>ID: {user?.userId}</p>
            </div>

            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:10 }}>📈 Real Skill Improvement</p>
              <SkillProgress />
            </div>

            {!isPro && (
              <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, borderRadius:14, padding:14 }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:'0 0 4px' }}>✨ Upgrade to unlock more stats</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', margin:'0 0 10px' }}>Weekly performance charts, subject heat maps, predicted rank, and exam gap analysis</p>
                <button onClick={() => navigate('/pro')} style={{ padding:'8px 18px', background:GOLD, color:NAVY, border:'none', borderRadius:9, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                  See Plans →
                </button>
              </div>
            )}
          </div>
        )}

        {/* EXAMS TAB */}
        {tab === 'exams' && (
          <div>
            {enrolled.map(exam => (
              <div key={exam.id} onClick={() => navigate(`/exams/${exam.id}`)}
                style={{ background:'#fff', borderRadius:14, padding:'12px 14px', marginBottom:8, border:'1.5px solid #E2E8F0', cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{exam.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--color-text,#1E293B)', margin:'0 0 4px' }}>{exam.name}</p>
                  <div style={{ height:4, background:'#E2E8F0', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${exam.readiness}%`, background:exam.readiness>=70?GREEN:GOLD, borderRadius:99 }} />
                  </div>
                  <p style={{ fontSize:10, color:'#94A3B8', margin:'4px 0 0' }}>Readiness: {exam.readiness}%</p>
                </div>
                <span style={{ color:'#94A3B8', fontSize:14 }}>›</span>
              </div>
            ))}
            <button onClick={() => navigate('/exams')}
              style={{ width:'100%', padding:'12px', background:BG, color:'var(--color-text-light,#64748B)', border:'1.5px solid #E2E8F0', borderRadius:12, fontSize:13, cursor:'pointer', fontWeight:600 }}>
              + Enroll in More Exams
            </button>
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {tab === 'achievements' && (
          <div>
            <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)', marginBottom:14 }}>
              Earned: {ACHIEVEMENTS.filter(a=>a.earned).length}/{ACHIEVEMENTS.length} badges
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {ACHIEVEMENTS.map(a => (
                <div key={a.id} style={{ background: a.earned?'#fff':'#F8FAFC', borderRadius:14, padding:14, border:`1.5px solid ${a.earned?GOLD:'#E2E8F0'}`, opacity:a.earned?1:0.5, textAlign:'center' }}>
                  <p style={{ fontSize:32, margin:'0 0 6px', filter:a.earned?'none':'grayscale(1)' }}>{a.emoji}</p>
                  <p style={{ fontSize:12, fontWeight:700, color:a.earned?NAVY:'#94A3B8', margin:'0 0 4px' }}>{a.label}</p>
                  <p style={{ fontSize:10, color:'#94A3B8', margin:0, lineHeight:1.4 }}>{a.desc}</p>
                  {a.earned && <p style={{ fontSize:9, color:GREEN, margin:'6px 0 0', fontWeight:700 }}>✓ Earned</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REFERRAL TAB */}
        {tab === 'referral' && (
          <div>
            <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, borderRadius:16, padding:16, marginBottom:14, textAlign:'center' }}>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', margin:'0 0 4px', letterSpacing:1 }}>YOUR REFERRAL CODE</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28, color:GOLD, margin:'0 0 8px', letterSpacing:3 }}>
                {user?.name?.toUpperCase().replace(' ','').slice(0,8) || 'TRYIT001'}
              </p>
              <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                <button onClick={() => {
                  navigator.clipboard.writeText(`Join TryIT - India's best exam prep platform!\nUse my code: ${user?.name?.toUpperCase().replace(' ','').slice(0,8)||'TRYIT001'}\nhttps://tryiteducations.net`)
                  alert('✅ Copied! Share with friends.')
                }} style={{ padding:'8px 18px', background:GOLD, color:NAVY, border:'none', borderRadius:10, fontWeight:800, fontSize:12, cursor:'pointer' }}>
                  📋 Copy & Share
                </button>
                <button style={{ padding:'8px 14px', background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                  💬 WhatsApp →
                </button>
              </div>
            </div>

            <div style={{ background:'#fff', borderRadius:14, padding:14, border:'1.5px solid #E2E8F0', marginBottom:12 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:10 }}>🎁 Referral Rewards</p>
              {[
                { event:'Friend signs up',      reward:'50 coins'          },
                { event:'Friend takes first test',reward:'100 coins'       },
                { event:'Friend buys Pro',       reward:'200 coins + ₹20' },
                { event:'Friend buys Ultra',     reward:'500 coins + ₹50' },
              ].map(r => (
                <div key={r.event} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #F1F5F9' }}>
                  <span style={{ fontSize:12, color:'#475569' }}>{r.event}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:GREEN }}>{r.reward}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button onClick={logout}
          style={{ width:'100%', padding:'12px', background:'#FEE2E2', color:'#991B1B', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', marginTop:20 }}>
          🚪 Log Out
        </button>
      </div>
    </div>
  )
}