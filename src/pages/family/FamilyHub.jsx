// FILE: src/pages/family/FamilyHub.jsx
// TryIT - Family / Parent Dashboard
// Parents can track their child's study progress, weak areas, exam readiness
// Route: /family
import { useState, useEffect } from 'react'
import { useNavigate }        from 'react-router-dom'
import { useAuth }            from '../../context/AuthContext'
import { supabase }           from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'
const GREEN = '#059669'

// -- MOCK CHILD DATA -------------------------------------------------------
const MOCK_CHILDREN = [
  {
    id:'child-001', name:'Arjun', age:15, class:'Class 10',
    avatar:'🎓', plan:'pro',
    enrolled_exams:['NTSE Stage 1','SSC CGL (Future goal)'],
    streak: 12, coins: 840,
    today: { tests_taken:2, questions_answered:48, time_mins:62, topics_covered:['Percentage','Syllogism'] },
    weekly_scores: [72, 65, 80, 58, 74, 68, 75],
    subjects: [
      { name:'Mathematics',  accuracy:74, trend:'up',   emoji:'📐', color:'#1D4ED8' },
      { name:'Reasoning',    accuracy:88, trend:'up',   emoji:'🧠', color:'#7C3AED' },
      { name:'English',      accuracy:61, trend:'down', emoji:'📝', color:'#DC2626' },
      { name:'General Knowledge', accuracy:70, trend:'stable', emoji:'🌍', color:'#059669' },
    ],
    weak_topics: [
      { topic:'Reading Comprehension', wrong:8, total:15 },
      { topic:'Profit & Loss',          wrong:6, total:12 },
      { topic:'Error Detection',        wrong:5, total:10 },
    ],
    concept_progress: [
      { topic:'Percentage',    level:4, mastery:'developing'  },
      { topic:'Syllogism',     level:2, mastery:'beginner'    },
      { topic:'Number Series', level:5, mastery:'proficient'  },
    ],
    exam_readiness: 68,
    rank: 1420,
    last_active: new Date(Date.now() - 2*60*60*1000).toISOString(),
    pathway: { name:'NTSE 2-Year Journey', stage:2, stage_name:'Foundation Strengthening' },
  },
  {
    id:'child-002', name:'Meera', age:17, class:'Class 12',
    avatar:'🎓', plan:'ultra',
    enrolled_exams:['NEET UG 2027','AIIMS Delhi'],
    streak: 28, coins: 2140,
    today: { tests_taken:3, questions_answered:85, time_mins:110, topics_covered:['Cell Biology','Organic Chemistry','Optics'] },
    weekly_scores: [82, 78, 85, 80, 88, 82, 90],
    subjects: [
      { name:'Biology',    accuracy:88, trend:'up',     emoji:'🧬', color:'#059669' },
      { name:'Chemistry',  accuracy:79, trend:'up',     emoji:'⚗️',  color:'#7C3AED' },
      { name:'Physics',    accuracy:72, trend:'stable', emoji:'⚡', color:'#DC2626' },
    ],
    weak_topics: [
      { topic:'Electrostatics',       wrong:6, total:12 },
      { topic:'Electrochemistry',     wrong:5, total:10 },
    ],
    concept_progress: [
      { topic:'Cell Biology',      level:7, mastery:'advanced'   },
      { topic:'Organic Chemistry', level:5, mastery:'proficient' },
      { topic:'Optics',            level:4, mastery:'developing' },
    ],
    exam_readiness: 84,
    rank: 234,
    last_active: new Date(Date.now() - 30*60*1000).toISOString(),
    pathway: { name:'NEET 7-Year Journey', stage:6, stage_name:'Class 11 NEET Syllabus' },
  },
]

// -- MINI CHART ------------------------------------------------------------
function MiniBarChart({ scores, color }) {
  const max   = Math.max(...scores, 1)
  const days  = ['M','T','W','T','F','S','S']
  return (
    <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:48 }}>
      {scores.map((s, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <div style={{ width:'100%', height:`${(s/max)*40}px`, minHeight:3,
            background: i===scores.length-1 ? color : `${color}55`,
            borderRadius:'3px 3px 0 0', transition:'height 0.5s ease' }} />
          <span style={{ fontSize:8, color:'#94A3B8' }}>{days[i]}</span>
        </div>
      ))}
    </div>
  )
}

// -- RELATIVE TIME ---------------------------------------------------------
function relativeTime(isoStr) {
  const diff = (Date.now() - new Date(isoStr).getTime()) / 60000
  if (diff < 1)   return 'just now'
  if (diff < 60)  return `${Math.floor(diff)}m ago`
  if (diff < 1440)return `${Math.floor(diff/60)}h ago`
  return `${Math.floor(diff/1440)}d ago`
}

export default function FamilyHub() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [children,     setChildren]    = useState(MOCK_CHILDREN)
  const [selectedIdx,  setSelectedIdx] = useState(0)
  const [tab,          setTab]         = useState('today')
  const [todayStory,   setTodayStory]  = useState(null)

  const child = children[selectedIdx]

  useEffect(() => {
    // Load Bharat Pulse for family section too
    supabase.from('daily_stories').select('headline,state_name,hook_line,region')
      .lte('publish_date', new Date().toISOString().slice(0,10))
      .order('publish_date',{ascending:false}).limit(1).single()
      .then(({ data }) => setTodayStory(data))
      .catch(()=>{})

    // In real app: load linked children from family_links table
    if (user?.id) {
      supabase.from('family_links').select('student_id, nickname, profiles(*)').eq('parent_id', user.id)
        .then(({ data }) => { if (data?.length) {/* map to children state */} })
        .catch(()=>{})
    }
  }, [user?.id])

  const PLAN_COLORS = { free:'#64748B', pro:'#1D4ED8', ultra:'#92400E' }
  const MASTERY_COLORS = { not_started:'#E2E8F0', beginner:'#FEF3C7', developing:'#DBEAFE', proficient:'#D1FAE5', advanced:'#EDE9FE', mastered:`${GOLD}33` }

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* -- HEADER -------------------------------------------------------- */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'20px 16px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <button onClick={() => navigate('/')} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:'#fff', margin:0 }}>👨‍👩‍👧 Family Hub</p>
          <button onClick={() => {/* link new child */}} style={{ background:`${GOLD}33`, border:'none', color:GOLD, borderRadius:10, padding:'6px 12px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
            + Link Child
          </button>
        </div>

        {/* Child selector */}
        {children.length > 1 && (
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {children.map((c, i) => (
              <button key={c.id} onClick={() => setSelectedIdx(i)}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:12, border:'none', cursor:'pointer',
                  background: selectedIdx===i ? GOLD : 'rgba(255,255,255,0.1)',
                  color:      selectedIdx===i ? NAVY : '#fff', fontWeight:700, fontSize:13 }}>
                <span>{c.avatar}</span> {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected child overview */}
        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:16, padding:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', margin:'0 0 2px' }}>
                {child.avatar} {child.name}
              </p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:0 }}>
                {child.class} · {child.enrolled_exams[0]}
              </p>
            </div>
            <div style={{ textAlign:'right' }}>
              <span style={{ background:`${PLAN_COLORS[child.plan]}33`, color: child.plan==='ultra'?GOLD:child.plan==='pro'?'#93C5FD':'#94A3B8', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700 }}>
                {child.plan.toUpperCase()}
              </span>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', margin:'4px 0 0' }}>
                Last active: {relativeTime(child.last_active)}
              </p>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {[
              { label:'Streak',     value:`🔥${child.streak}d`          },
              { label:'Readiness',  value:`${child.exam_readiness}%`     },
              { label:'Rank',       value:`#${child.rank.toLocaleString('en-IN')}` },
              { label:'Coins',      value:`🪙${child.coins.toLocaleString('en-IN')}` },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 4px', textAlign:'center' }}>
                <p style={{ fontWeight:800, color:'#fff', fontSize:13, margin:'0 0 2px' }}>{s.value}</p>
                <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -- TABS ----------------------------------------------------------- */}
      <div style={{ display:'flex', background:'#fff', borderBottom:'1px solid #E2E8F0', overflowX:'auto' }}>
        {[
          { id:'today',    label:'📅 Today'    },
          { id:'progress', label:'📈 Progress' },
          { id:'weak',     label:'⚠️ Weak Areas' },
          { id:'pathway',  label:'🗺️ Pathway'  },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:'12px 8px', border:'none', background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
              color: tab===t.id ? NAVY : '#94A3B8',
              borderBottom: tab===t.id ? `2.5px solid ${GOLD}` : '2.5px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:16, maxWidth:480, margin:'0 auto' }}>

        {/* TODAY TAB */}
        {tab === 'today' && (
          <div>
            {/* Today activity */}
            <div style={{ background:'#fff', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0', marginBottom:12 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:12 }}>📅 Today's Study Activity</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
                {[
                  { label:'Tests Taken',    value:child.today.tests_taken,          emoji:'📝' },
                  { label:'Questions',      value:child.today.questions_answered,   emoji:'❓' },
                  { label:'Study Time',     value:`${child.today.time_mins}m`,      emoji:'⏱️' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign:'center', background:BG, borderRadius:12, padding:'10px 6px' }}>
                    <p style={{ fontSize:20, margin:'0 0 4px' }}>{s.emoji}</p>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:NAVY, margin:'0 0 2px' }}>{s.value}</p>
                    <p style={{ fontSize:9, color:'#94A3B8', margin:0 }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:11, fontWeight:600, color:'var(--color-text-light,#64748B)', marginBottom:4 }}>Topics Covered Today:</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {child.today.topics_covered.map(t => (
                  <span key={t} style={{ background:`${NAVY}10`, color:NAVY, padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Weekly chart */}
            <div style={{ background:'#fff', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0', marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <p style={{ fontSize:12, fontWeight:700, color:NAVY, margin:0 }}>📊 This Week's Scores</p>
                <p style={{ fontSize:12, fontWeight:700, color:GREEN, margin:0 }}>
                  Avg: {Math.round(child.weekly_scores.reduce((a,s)=>a+s,0)/child.weekly_scores.length)}%
                </p>
              </div>
              <MiniBarChart scores={child.weekly_scores} color={NAVY} />
            </div>

            {/* Bharat Pulse for family */}
            {todayStory && (
              <div onClick={() => navigate('/bharat-pulse')}
                style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, borderRadius:16, padding:14, cursor:'pointer', border:`1px solid ${GOLD}44` }}>
                <p style={{ fontSize:10, color:GOLD, fontWeight:700, margin:'0 0 6px' }}>🇮🇳 TODAY'S BHARAT PULSE</p>
                <p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:'0 0 4px', lineHeight:1.5 }}>{todayStory.headline}</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', margin:0 }}>{todayStory.state_name} · Read with your child →</p>
              </div>
            )}
          </div>
        )}

        {/* PROGRESS TAB */}
        {tab === 'progress' && (
          <div>
            {/* Exam readiness */}
            <div style={{ background:'#fff', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0', marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <p style={{ fontSize:12, fontWeight:700, color:NAVY, margin:0 }}>🎯 Exam Readiness</p>
                <span style={{ fontSize:13, fontWeight:800, color: child.exam_readiness>=70?GREEN:child.exam_readiness>=50?'#D97706':'#DC2626' }}>
                  {child.exam_readiness}%
                </span>
              </div>
              <div style={{ height:10, background:'var(--color-border, #E2E8F0)', borderRadius:99, overflow:'hidden', marginBottom:8 }}>
                <div style={{ height:'100%', width:`${child.exam_readiness}%`, borderRadius:99,
                  background: child.exam_readiness>=70?GREEN:child.exam_readiness>=50?GOLD:'#DC2626',
                  transition:'width 0.6s ease' }} />
              </div>
              <p style={{ fontSize:11, color:'var(--color-text-light,#64748B)', margin:0 }}>
                {child.exam_readiness>=70 ? '✅ On track for exam!' : child.exam_readiness>=50 ? '📈 Making good progress' : '⚠️ Needs more practice in some areas'}
              </p>
            </div>

            {/* Subject accuracy */}
            <div style={{ background:'#fff', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0', marginBottom:12 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:12 }}>📚 Subject Performance</p>
              {child.subjects.map(s => (
                <div key={s.name} style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:13, color:'var(--color-text,#1E293B)' }}>{s.emoji} {s.name}</span>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      <span style={{ fontSize:10, color: s.trend==='up'?GREEN:s.trend==='down'?'#DC2626':'#64748B' }}>
                        {s.trend==='up'?'↑':s.trend==='down'?'↓':'→'}
                      </span>
                      <span style={{ fontSize:13, fontWeight:800, color:s.color }}>{s.accuracy}%</span>
                    </div>
                  </div>
                  <div style={{ height:6, background:'var(--color-border, #E2E8F0)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${s.accuracy}%`, background:s.color, borderRadius:99 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Concept progress */}
            <div style={{ background:'#fff', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0' }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:12 }}>🧠 Concept Learning Progress</p>
              {child.concept_progress.map(c => (
                <div key={c.topic} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #F1F5F9' }}>
                  <p style={{ fontSize:12, color:'var(--color-text,#1E293B)', margin:0 }}>{c.topic}</p>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                      background: MASTERY_COLORS[c.mastery] || '#F1F5F9',
                      color: c.mastery==='mastered'?'#92400E':c.mastery==='advanced'?'#7C3AED':c.mastery==='proficient'?GREEN:c.mastery==='developing'?'#1D4ED8':'#64748B' }}>
                      {c.mastery}
                    </span>
                    <span style={{ fontSize:11, fontWeight:700, color:NAVY }}>L{c.level}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEAK AREAS TAB */}
        {tab === 'weak' && (
          <div>
            <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:12, padding:12, marginBottom:14 }}>
              <p style={{ fontSize:12, color:'#991B1B', margin:0, lineHeight:1.6 }}>
                ⚠️ These are the topics where <strong>{child.name}</strong> is making the most mistakes. Encourage extra practice here.
              </p>
            </div>

            {child.weak_topics.map((w, i) => {
              const errorRate = Math.round((w.wrong/w.total)*100)
              return (
                <div key={w.topic} style={{ background:'#fff', borderRadius:14, padding:14, marginBottom:10, border:'1.5px solid #E2E8F0' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'var(--color-text,#1E293B)', margin:0 }}>{w.topic}</p>
                    <span style={{ fontSize:12, fontWeight:800, color:'#DC2626' }}>{errorRate}% error rate</span>
                  </div>
                  <p style={{ fontSize:11, color:'var(--color-text-light,#64748B)', marginBottom:8 }}>
                    Got {w.wrong} wrong out of {w.total} attempts
                  </p>
                  <div style={{ height:6, background:'var(--color-border, #E2E8F0)', borderRadius:99, overflow:'hidden', marginBottom:8 }}>
                    <div style={{ height:'100%', width:`${errorRate}%`, background:'#DC2626', borderRadius:99 }} />
                  </div>
                  <p style={{ fontSize:11, color:'var(--color-text-light,#64748B)', margin:0 }}>
                    💡 Tip: {errorRate>70 ? 'Start with concept card before attempting more questions.' : 'A few more practice sessions should fix this.'}
                  </p>
                </div>
              )
            })}

            {/* Tips for parent */}
            <div style={{ background:`${NAVY}08`, border:`1px solid ${NAVY}22`, borderRadius:14, padding:14 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:8 }}>👨‍👩‍👧 How You Can Help</p>
              {[
                `Ask ${child.name} to explain ${child.weak_topics[0]?.topic} to you in simple words`,
                'Encourage 20 minutes of focused practice daily on weak topics',
                `Check their progress on these topics again next week`,
                'Celebrate when they get questions right - positive reinforcement works!',
              ].map((tip, i) => (
                <p key={i} style={{ fontSize:12, color:'#475569', margin:'0 0 6px', lineHeight:1.6 }}>
                  → {tip}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* PATHWAY TAB */}
        {tab === 'pathway' && child.pathway && (
          <div>
            <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, borderRadius:16, padding:16, marginBottom:14 }}>
              <p style={{ fontSize:10, color:GOLD, fontWeight:700, letterSpacing:1, margin:'0 0 6px' }}>ACTIVE PATHWAY</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:'#fff', margin:'0 0 4px' }}>
                🗺️ {child.pathway.name}
              </p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', margin:'0 0 12px' }}>
                Current Stage {child.pathway.stage}: {child.pathway.stage_name}
              </p>
              <button onClick={() => navigate(`/pathway/${child.pathway.name.toLowerCase().replace(/ /g,'_')}`)}
                style={{ padding:'8px 18px', background:GOLD, color:NAVY, border:'none', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                View Full Pathway →
              </button>
            </div>

            <div style={{ background:'#fff', borderRadius:14, padding:14, border:'1.5px solid #E2E8F0', marginBottom:12 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:10 }}>📋 Parent Guide - What This Stage Means</p>
              <p style={{ fontSize:13, color:'#475569', lineHeight:1.8 }}>
                {child.name} is in <strong>Stage {child.pathway.stage}</strong> of the {child.pathway.name}.
                At this stage, they should be focusing on{' '}
                <strong>building strong conceptual foundations</strong> in their core subjects.
                This is the most important stage - what they learn here forms the base for all future exams.
              </p>
            </div>

            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:14, padding:14 }}>
              <p style={{ fontSize:12, fontWeight:700, color:GREEN, marginBottom:8 }}>✅ What {child.name} Should Do Each Day</p>
              {[
                '1 concept card reading (20 mins)',
                '20 practice questions in weak subject (15 mins)',
                '1 current affairs story or Bharat Pulse (10 mins)',
                'Weekly: 1 full section mock test',
              ].map((a, i) => (
                <p key={i} style={{ fontSize:12, color:'#065F46', margin:'0 0 6px' }}>→ {a}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}