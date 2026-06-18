// FILE: src/pages/Dashboard.jsx — TryIT Main Home Screen
import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../context/AuthContext'
import { supabase }            from '../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'

const MOCK_ENROLLED = [
  { id:'ssc_cgl_t1',  name:'SSC CGL Tier 1',   readiness:72, examDate:'Nov 2026', icon:'📋', color:'#1D4ED8' },
  { id:'ibps_po_pre', name:'IBPS PO Prelims',   readiness:58, examDate:'Oct 2026', icon:'🏦', color:'#059669' },
  { id:'upsc_cse_pre',name:'UPSC CSE Prelims',  readiness:41, examDate:'May 2027', icon:'🇮🇳', color:'#DC2626' },
]
const MOCK_MATERIALS = [
  { material_id:'m1', title:'Daily Current Affairs — 18 June 2026', material_type:'daily_current_affairs', source:'The Hindu + PIB', file_url:'#', view_count:1240, download_count:342, is_pinned:true },
  { material_id:'m2', title:'SSC CGL Maths Formula Sheet — All Chapters', material_type:'formula_sheet', source:'TryIT', file_url:'#', view_count:3840, download_count:1203, is_pinned:false },
  { material_id:'m3', title:'RRB NTPC Notification 2026 — Official PDF', material_type:'exam_notification', source:'Railway Board', file_url:'#', view_count:8920, download_count:4102, is_pinned:false },
]
const MOCK_LEADERBOARD = [
  { id:'u1', name:'Priya K.',   state:'Tamil Nadu',    score:9840, accuracy:91 },
  { id:'u2', name:'Arjun M.',   state:'Karnataka',     score:9720, accuracy:89 },
  { id:'u3', name:'Ravi S.',    state:'Andhra Pradesh',score:9601, accuracy:87 },
]
const MOCK_STORY = {
  headline:'The Man Who Planted a Forest — Alone — for 37 Years',
  state_name:'Assam', region:'northeast',
  hook_line:'While the world was moving forward, one man was moving earth.',
}
const MAT_ICONS = { daily_current_affairs:'📰', formula_sheet:'📐', exam_notification:'📣', revision_sheet:'🗂️', study_notes:'📝', question_paper:'📄', answer_key:'🔑', video_link:'▶️', one_liner_gk:'💡', strategy_guide:'🎯' }
const REGION_BG = { south:'#065F46', central:'#1E3A5F', north:'#4C1D95', northeast:'#064E3B', west:'#7C2D12', east:'#831843', jammu_kashmir:'#0C4A6E' }

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:18, paddingBottom:8 }}>
      <p style={{ fontSize:14, fontWeight:800, color:NAVY, margin:0 }}>{title}</p>
      {action && <button onClick={onAction} style={{ fontSize:12, color:GOLD, fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>{action}</button>}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, planTier, isUltra, coins, explanationsLeft } = useAuth()

  const [enrolled,    setEnrolled]    = useState(MOCK_ENROLLED)
  const [materials,   setMaterials]   = useState(MOCK_MATERIALS)
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD)
  const [todayStory,  setTodayStory]  = useState(MOCK_STORY)
  const [community,   setCommunity]   = useState({ title:'Add state-specific current affairs for each PSC', vote_count:456 })
  const [greeting,    setGreeting]    = useState('Good morning ☀️')
  const [testCount,   setTestCount]   = useState(0)
  const [showBanner,  setShowBanner]  = useState(true)

  useEffect(() => {
    const h = new Date().getHours()
    if (h<5) setGreeting('Burning midnight oil 🌙')
    else if (h<12) setGreeting('Good morning ☀️')
    else if (h<17) setGreeting('Good afternoon 🌤️')
    else if (h<20) setGreeting('Good evening 🌅')
    else setGreeting('Good night 🌙')
  }, [])

  useEffect(() => {
    if (!user?.id) return
    const key = `tryit_usage_${user.id}_daily_tests_${new Date().toDateString()}`
    setTestCount(parseInt(localStorage.getItem(key) || '0'))
    Promise.all([
      supabase.from('daily_materials').select('*').eq('is_active',true).order('publish_date',{ascending:false}).limit(5),
      supabase.from('daily_stories').select('headline,state_name,region,hook_line').lte('publish_date',new Date().toISOString().slice(0,10)).order('publish_date',{ascending:false}).limit(1).single(),
      supabase.from('community_posts').select('title,vote_count').order('vote_count',{ascending:false}).limit(1).single(),
    ]).then(([m,s,c]) => {
      if (m.data?.length) setMaterials(m.data)
      if (s.data) setTodayStory(s.data)
      if (c.data) setCommunity(c.data)
    }).catch(()=>{})
  }, [user?.id])

  const freeTestsLeft = planTier==='free' ? Math.max(0, 5-testCount) : Infinity
  const expLeft = planTier==='free' ? (explanationsLeft?.() ?? 5) : Infinity
  const storyBg = REGION_BG[todayStory?.region] || NAVY

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'16px 16px 20px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ fontSize:10, color:'rgba(255,255,255,0.5)', margin:0 }}>{greeting}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17, color:'#fff', margin:0 }}>{user?.name?.split(' ')[0] || 'Student'} 👋</p>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,255,255,0.1)', borderRadius:99, padding:'5px 10px' }}>
              <span style={{ fontSize:14 }}>🔥</span>
              <span style={{ fontSize:12, fontWeight:700, color:'#FCD34D' }}>{user?.streak||0}d</span>
            </div>
            <button onClick={()=>navigate('/wallet')} style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(201,168,76,0.2)', borderRadius:99, padding:'5px 10px', border:'none', cursor:'pointer' }}>
              <span style={{ fontSize:14 }}>🪙</span>
              <span style={{ fontSize:12, fontWeight:700, color:GOLD }}>{(coins||0).toLocaleString('en-IN')}</span>
            </button>
            <button onClick={()=>navigate('/profile')} style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${GOLD},#E8C96A)`, border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:13, color:NAVY }}>
              {(user?.initials||user?.name?.slice(0,2)||'?').toUpperCase().slice(0,2)}
            </button>
          </div>
        </div>
        {planTier==='free' && (
          <div style={{ marginTop:12, background:'rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>Tests: {testCount}/5 · Explanations: {expLeft===Infinity?'∞':expLeft}/5</span>
              <button onClick={()=>navigate('/pro')} style={{ fontSize:10, color:GOLD, background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>Upgrade →</button>
            </div>
            <div style={{ height:4, background:'rgba(255,255,255,0.15)', borderRadius:99 }}>
              <div style={{ height:'100%', width:`${(testCount/5)*100}%`, background:testCount>=5?'#EF4444':GOLD, borderRadius:99 }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ padding:'0 16px', maxWidth:480, margin:'0 auto' }}>
        {/* Upgrade banner */}
        {showBanner && planTier==='free' && (
          <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, borderRadius:16, padding:'12px 14px', marginTop:14, display:'flex', alignItems:'center', gap:10, border:`1px solid ${GOLD}44` }}>
            <span style={{ fontSize:22, flexShrink:0 }}>✨</span>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:0 }}>Unlimited explanations for ₹4/day</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', margin:'2px 0 0' }}>87% cheaper than BYJU's · Try 3 days for ₹49</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
              <button onClick={()=>navigate('/pro')} style={{ padding:'6px 12px', background:GOLD, color:NAVY, border:'none', borderRadius:8, fontWeight:800, fontSize:11, cursor:'pointer' }}>Try →</button>
              <button onClick={()=>setShowBanner(false)} style={{ fontSize:9, color:'rgba(255,255,255,0.3)', background:'none', border:'none', cursor:'pointer' }}>dismiss</button>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:16 }}>
          {[['📝','Practice','#1D4ED8','/test-engine'],['🧠','Concepts','#7C3AED','/exams'],['📰','CA Today','#059669','/current-affairs'],['🎮','Games','#DC2626','/games']].map(([icon,label,color,path]) => (
            <button key={label} onClick={()=>navigate(path)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'12px 4px', borderRadius:14, border:'none', cursor:'pointer', background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize:22 }}>{icon}</span>
              <span style={{ fontSize:10, fontWeight:700, color }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Enrolled exams */}
        <SectionHeader title="Your Exams" action="+ Add Exam" onAction={()=>navigate('/exams')} />
        {enrolled.map(exam => (
          <div key={exam.id} onClick={()=>navigate(`/exams/${exam.id}`)} style={{ background:'#fff', borderRadius:14, padding:'12px 14px', marginBottom:8, cursor:'pointer', border:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, fontSize:20, background:`${exam.color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>{exam.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontWeight:700, color:'#1E293B', fontSize:13, margin:0 }}>{exam.name}</p>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <span style={{ fontSize:11, color:'#64748B' }}>Readiness: {exam.readiness}%</span>
                <span style={{ fontSize:11, color:'#94A3B8' }}>📅 {exam.examDate}</span>
              </div>
              <div style={{ height:4, background:'#E2E8F0', borderRadius:99, marginTop:5, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${exam.readiness}%`, borderRadius:99, background:exam.readiness>=70?'#059669':exam.readiness>=40?GOLD:'#DC2626' }} />
              </div>
            </div>
            <span style={{ color:'#94A3B8', fontSize:14 }}>›</span>
          </div>
        ))}

        {/* Start test */}
        <button onClick={()=>navigate('/test-engine')} disabled={planTier==='free'&&freeTestsLeft===0}
          style={{ width:'100%', padding:'14px', marginBottom:4, background:planTier==='free'&&freeTestsLeft===0?'#E2E8F0':`linear-gradient(135deg,${NAVY},#0F2140)`, color:planTier==='free'&&freeTestsLeft===0?'#94A3B8':'#fff', border:'none', borderRadius:14, fontWeight:800, fontSize:15, cursor:planTier==='free'&&freeTestsLeft===0?'not-allowed':'pointer' }}>
          {planTier==='free'&&freeTestsLeft===0 ? '🔒 Daily Limit Reached — Upgrade for More' : '📝 Start Practice Test →'}
        </button>

        {/* Bharat Pulse */}
        <SectionHeader title="🇮🇳 Bharat Pulse" action="All Stories →" onAction={()=>navigate('/bharat-pulse')} />
        <div onClick={()=>navigate('/bharat-pulse')} style={{ borderRadius:16, overflow:'hidden', marginBottom:4, cursor:'pointer', background:`linear-gradient(160deg,${storyBg}EE,${storyBg}BB,rgba(15,21,40,0.95))`, border:`1px solid ${storyBg}88` }}>
          <div style={{ padding:'16px 14px' }}>
            <span style={{ fontSize:10, fontWeight:700, color:GOLD, background:'rgba(201,168,76,0.2)', padding:'2px 8px', borderRadius:99 }}>TODAY · {todayStory?.state_name}</span>
            <p style={{ fontWeight:800, color:'#fff', fontSize:15, lineHeight:1.5, margin:'8px 0 6px' }}>{todayStory?.headline}</p>
            <p style={{ fontSize:12, color:GOLD, fontStyle:'italic', margin:'0 0 10px', borderLeft:`2px solid ${GOLD}88`, paddingLeft:8 }}>{todayStory?.hook_line}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', margin:0 }}>Tap to read full story · 📤 Share →</p>
          </div>
        </div>

        {/* Daily materials */}
        <SectionHeader title="📰 Today's Materials" action="View All →" onAction={()=>navigate('/current-affairs')} />
        {materials.slice(0,3).map(m => (
          <a key={m.material_id} href={m.file_url||'#'} target={m.file_url&&m.file_url!=='#'?'_blank':'_self'} rel="noreferrer" style={{ textDecoration:'none', display:'block', marginBottom:6 }}>
            <div style={{ background:'#fff', borderRadius:12, padding:'10px 13px', border:m.is_pinned?`1.5px solid ${GOLD}`:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20, flexShrink:0 }}>{MAT_ICONS[m.material_type]||'📄'}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:600, color:'#1E293B', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.is_pinned&&'📌 '}{m.title}</p>
                <p style={{ fontSize:10, color:'#94A3B8', margin:'2px 0 0' }}>{m.source} · 👁️ {(m.view_count||0).toLocaleString('en-IN')} · ⬇️ {(m.download_count||0).toLocaleString('en-IN')}</p>
              </div>
              <span style={{ fontSize:14, color:'#94A3B8', flexShrink:0 }}>›</span>
            </div>
          </a>
        ))}

        {/* Leaderboard */}
        <SectionHeader title="🏆 All India Rankings" action="Full Board →" onAction={()=>navigate('/leaderboard')} />
        <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1.5px solid #E2E8F0', marginBottom:4 }}>
          {leaderboard.map((u, i) => {
            const isYou = u.id===user?.id
            return (
              <div key={u.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:i<leaderboard.length-1?'1px solid #F1F5F9':'none', background:isYou?`${NAVY}08`:'transparent' }}>
                <span style={{ fontSize:18, width:28, textAlign:'center', flexShrink:0 }}>{['🥇','🥈','🥉'][i]}</span>
                <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:`linear-gradient(135deg,${NAVY},${GOLD})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:11, color:'#fff' }}>
                  {u.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:'#1E293B', margin:0 }}>{u.name}{isYou&&<span style={{ color:NAVY, fontSize:10 }}> (You)</span>}</p>
                  <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{u.state}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:13, fontWeight:800, color:NAVY, margin:0 }}>{(u.score||0).toLocaleString('en-IN')}</p>
                  <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{u.accuracy}% acc</p>
                </div>
              </div>
            )
          })}
          <button onClick={()=>navigate('/leaderboard')} style={{ width:'100%', padding:'10px', border:'none', background:BG, color:'#64748B', fontSize:12, fontWeight:600, cursor:'pointer' }}>See full leaderboard + your rank →</button>
        </div>

        {/* Community */}
        <SectionHeader title="🗳️ Community" action="Vote →" onAction={()=>navigate('/community')} />
        <div style={{ background:'#fff', borderRadius:14, padding:'12px 14px', border:'1.5px solid #E2E8F0', marginBottom:4 }}>
          <p style={{ fontSize:11, color:'#94A3B8', marginBottom:4 }}>🔥 Most Voted Request</p>
          <p style={{ fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:8 }}>{community?.title}</p>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12, fontWeight:700, color:NAVY }}>▲ {(community?.vote_count||0).toLocaleString('en-IN')} votes</span>
            <button onClick={()=>navigate('/community')} style={{ padding:'5px 12px', background:NAVY, color:'#fff', border:'none', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer' }}>Vote →</button>
          </div>
        </div>

        {/* Pathway CTA */}
        <div onClick={()=>isUltra?navigate('/pathway/jee_7yr'):navigate('/pro')}
          style={{ borderRadius:16, padding:'14px 16px', marginTop:4, cursor:'pointer', background:`linear-gradient(135deg,${isUltra?'#92400E':NAVY},${isUltra?'#B45309':'#0F2140'})`, display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:28, flexShrink:0 }}>🗺️</span>
          <div style={{ flex:1 }}>
            {isUltra ? (
              <>
                <p style={{ fontWeight:700, color:'#fff', fontSize:13, margin:'0 0 2px' }}>Continue Your Pathway</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', margin:0 }}>JEE 7-Year Journey · Stage 4 Active →</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight:700, color:'#fff', fontSize:13, margin:'0 0 2px' }}>24 Prep Pathways — JEE · NEET · UPSC · Banking</p>
                <p style={{ fontSize:11, color:GOLD, margin:0, fontWeight:700 }}>Unlock with Ultra ✨ →</p>
              </>
            )}
          </div>
        </div>
        <div style={{ height:24 }} />
      </div>
    </div>
  )
}