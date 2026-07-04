// FILE: src/pages/test-engine/TestLauncher.jsx
// TryIT - Test Selection Screen
// Smart exam search, mode selection, enrolled exams, PYQ access
import { useState } from 'react'
import { useNavigate }   from 'react-router-dom'
import { useAuth }       from '../../context/AuthContext'
import { useTheme }      from '../../context/ThemeContext'
import SmartExamSearch   from '../../components/SmartExamSearch'

const DEFAULT_NAVY = '#1E3A5F'
const DEFAULT_GOLD = '#C9A84C'
const DEFAULT_BG   = '#F8FAFC'

const TEST_MODES = [
  {
    id:'practice', emoji:'📝', label:'Practice Mode',
    desc:'Instant feedback after every question. Learn as you go.',
    color:'#1D4ED8', bg:'#EFF6FF', border:'#BFDBFE',
    badge:null, time:'No time limit'
  },
  {
    id:'speed', emoji:'⚡', label:'Speed Mode',
    desc:'30 seconds per question. Build exam-day speed.',
    color:'#D97706', bg:'#FFFBEB', border:'#FDE68A',
    badge:'POPULAR', time:'30 sec / question'
  },
  {
    id:'mock', emoji:'🎯', label:'Full Mock Test',
    desc:'Exact exam conditions. Time limit. No feedback until end.',
    color:'#DC2626', bg:'#FEF2F2', border:'#FECACA',
    badge:'EXAM-LIKE', time:'Exam time × 0.90'
  },
]

const QUESTION_COUNTS = [10, 20, 30, 50, 100]

const QUICK_TOPICS = [
  { id:'arith_percentage',   name:'Percentage',     emoji:'%',  subject:'Quant'    },
  { id:'reas_syllogism',     name:'Syllogism',       emoji:'🔣', subject:'Reasoning' },
  { id:'eng_reading_comp',   name:'Reading Comp',   emoji:'📖', subject:'English'   },
  { id:'gk_current_affairs', name:'Current Affairs', emoji:'📰', subject:'GK'        },
  { id:'arith_profit_loss',  name:'Profit & Loss',  emoji:'💰', subject:'Quant'    },
  { id:'reas_series',        name:'Number Series',  emoji:'🔢', subject:'Reasoning' },
  { id:'gk_polity',          name:'Polity',         emoji:'🏛️', subject:'GK'        },
  { id:'arith_time_work',    name:'Time & Work',    emoji:'⏱️', subject:'Quant'    },
]

export default function TestLauncher() {
  const navigate = useNavigate()
  const { user, planTier, canAccess } = useAuth()
  const { theme } = useTheme()

  const [mode,       setMode]       = useState('practice')
  const [count,      setCount]      = useState(20)
  const [difficulty, setDifficulty] = useState('adaptive')
  const [examFilter, setExamFilter] = useState(null)
  const [tab,        setTab]        = useState('topic') // 'topic' | 'exam' | 'pyq'

  // Theme variables
  const NAVY = theme?.primaryDark || DEFAULT_NAVY
  const GOLD = theme?.accent || DEFAULT_GOLD
  const BG = theme?.isDark ? '#0F1020' : DEFAULT_BG
  const cardBg = theme?.isDark ? 'rgba(255,255,255,0.06)' : '#fff'
  const borderColor = theme?.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
  const textColor = theme?.isDark ? '#fff' : '#0F1020'
  const mutedText = theme?.isDark ? 'rgba(255,255,255,0.7)' : '#64748B'
  const mutedBorder = theme?.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'

  const enrolled = user?.exams || [
    { id:'ssc_cgl_t1',  name:'SSC CGL Tier 1',   icon:'📋' },
    { id:'ibps_po_pre', name:'IBPS PO Prelims',   icon:'🏦' },
    { id:'upsc_cse_pre',name:'UPSC CSE Prelims',  icon:'🇮🇳' },
  ]

  const access = canAccess('daily_tests')

  const startTest = (overrides = {}) => {
    if (!access.allowed && !access.canByCoin) {
      navigate('/pro')
      return
    }
    navigate('/test-engine/active', {
      state: {
        mode,
        count,
        difficulty,
        examId:  examFilter,
        source: 'launcher',
        ...overrides,
      }
    })
  }

  const startTopicTest = (topicId) => {
    startTest({ topicId, count:20, mode:'practice', source:'topic_quick' })
  }

  const startExamMock = (examId, examName) => {
    startTest({ examId, examName, mode:'mock', count:100, source:'exam_mock' })
  }

  const startPYQ = (examId) => {
    startTest({ examId, isPYQ:true, mode:'practice', count:30, source:'pyq' })
  }

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* -- HEADER -------------------------------------------------------- */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},${theme?.primaryDark || '#0F2140'})`, padding:'16px 16px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <button onClick={() => navigate('/')}
            style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff',
              width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <div>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', margin:0 }}>
              Start a Test
            </h1>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', margin:0 }}>
              Choose mode · Select exam or topic · Go!
            </p>
          </div>
        </div>

        {/* SmartExamSearch */}
        <SmartExamSearch
          placeholder="Search exam or topic to test on..."
          showPopular
          onSelect={(exam) => {
            setExamFilter(exam.id)
            setTab('exam')
          }}
        />

        {/* Free tier notice */}
        {planTier === 'free' && (
          <div style={{ marginTop:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', margin:0 }}>
              🆓 Free: 5 tests/day · {access.allowed ? 'Tests available' : 'Limit reached'}
            </p>
            <button onClick={() => navigate('/pro')}
              style={{ fontSize:10, color:GOLD, background:'none', cursor:'pointer', fontWeight:700 }}>
              Get unlimited →
            </button>
          </div>
        )}
      </div>

      <div style={{ padding:'0 16px', maxWidth:480, margin:'0 auto' }}>

        {/* -- TEST MODE --------------------------------------------------- */}
        <p style={{ fontSize:11, fontWeight:700, color:mutedText, letterSpacing:1.2,
          textTransform:'uppercase', marginTop:18, marginBottom:10 }}>
          SELECT MODE
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:4 }}>
          {TEST_MODES.map(m => (
            <button key={m.id}
              onClick={() => setMode(m.id)}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                borderRadius:14, border:`2px solid ${mode===m.id?m.color:mutedBorder}`,
                background: mode===m.id ? m.bg : cardBg, cursor:'pointer',
                textAlign:'left', position:'relative', overflow:'hidden' }}>
              {m.badge && (
                <span style={{ position:'absolute', top:8, right:10, fontSize:9,
                  fontWeight:800, color:m.color, background:`${m.color}18`,
                  padding:'2px 6px', borderRadius:99 }}>
                  {m.badge}
                </span>
              )}
              <span style={{ fontSize:22, flexShrink:0 }}>{m.emoji}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:700, color:mode===m.id?m.color:textColor, margin:0 }}>
                  {m.label}
                </p>
                <p style={{ fontSize:11, color:mutedText, margin:'2px 0 0', lineHeight:1.4 }}>
                  {m.desc}
                </p>
              </div>
              <span style={{ fontSize:10, color:mutedText, flexShrink:0, whiteSpace:'nowrap' }}>
                {m.time}
              </span>
              {mode===m.id && (
                <span style={{ position:'absolute', right:12, top:'50%',
                  transform:'translateY(-50%)', color:m.color, fontSize:16 }}>✓</span>
              )}
            </button>
          ))}
        </div>

        {/* -- QUESTION COUNT ------------------------------------------------- */}
        <p style={{ fontSize:11, fontWeight:700, color:mutedText, letterSpacing:1.2,
          textTransform:'uppercase', marginTop:18, marginBottom:8 }}>
          NUMBER OF QUESTIONS
        </p>
        <div style={{ display:'flex', gap:8 }}>
          {QUESTION_COUNTS.map(n => (
            <button key={n}
              onClick={() => setCount(n)}
              style={{ flex:1, padding:'10px 0', borderRadius:10, cursor:'pointer',
                fontWeight:700, fontSize:13,
                background: count===n ? NAVY : cardBg,
                color:      count===n ? '#fff' : mutedText,
                border: count===n ? 'none' : `1.5px solid ${borderColor}` }}>
              {n}
            </button>
          ))}
        </div>

        {/* -- DIFFICULTY ----------------------------------------------------- */}
        <p style={{ fontSize:11, fontWeight:700, color:mutedText, letterSpacing:1.2,
          textTransform:'uppercase', marginTop:18, marginBottom:8 }}>
          DIFFICULTY
        </p>
        <div style={{ display:'flex', gap:8 }}>
          {[
            { id:'adaptive', label:'Adaptive 🎯' },
            { id:'easy',     label:'Easy L1-L2' },
            { id:'medium',   label:'Medium L3' },
            { id:'hard',     label:'Hard L4-L5' },
          ].map(d => (
            <button key={d.id}
              onClick={() => setDifficulty(d.id)}
              style={{ flex:1, padding:'8px 0', borderRadius:10, cursor:'pointer',
                fontWeight:600, fontSize:11, whiteSpace:'nowrap',
                background: difficulty===d.id ? NAVY : cardBg,
                color:      difficulty===d.id ? '#fff' : mutedText,
                border: difficulty===d.id ? 'none' : `1.5px solid ${borderColor}` }}>
              {d.label}
            </button>
          ))}
        </div>

        {/* -- TOPIC / EXAM / PYQ TABS ---------------------------------------- */}
        <div style={{ display:'flex', marginTop:20, borderBottom:`1px solid ${borderColor}` }}>
          {[
            { id:'topic', label:'By Topic'    },
            { id:'exam',  label:'By Exam'     },
            { id:'pyq',   label:'PYQ Papers'  },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex:1, padding:'10px 0', cursor:'pointer',
                background:'transparent', fontWeight:700, fontSize:12,
                color: tab===t.id ? NAVY : mutedText,
                borderBottom: tab===t.id ? `2.5px solid ${GOLD}` : '2.5px solid transparent' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TOPIC TAB */}
        {tab === 'topic' && (
          <div>
            <p style={{ fontSize:11, color:mutedText, marginTop:12, marginBottom:10 }}>
              Quick topic-wise practice - 20 questions, instant feedback:
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {QUICK_TOPICS.map(t => (
                <button key={t.id} onClick={() => startTopicTest(t.id)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'12px',
                    background:cardBg, borderRadius:12, border:`1.5px solid ${borderColor}`,
                    cursor:'pointer', textAlign:'left' }}>
                  <span style={{ fontSize:20 }}>{t.emoji}</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:textColor, margin:0 }}>{t.name}</p>
                    <p style={{ fontSize:10, color:mutedText, margin:0 }}>{t.subject}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EXAM TAB */}
        {tab === 'exam' && (
          <div>
            <p style={{ fontSize:11, color:mutedText, marginTop:12, marginBottom:10 }}>
              Your enrolled exams - full mock with PYQ-aligned weightage:
            </p>
            {enrolled.map(exam => (
              <div key={exam.id} style={{ background:cardBg, borderRadius:12, padding:'12px 14px',
                marginBottom:8, border:`1.5px solid ${borderColor}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:20 }}>{exam.icon}</span>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:textColor, margin:0 }}>{exam.name}</p>
                      <p style={{ fontSize:10, color:mutedText, margin:0 }}>PYQ-aligned · 10% stricter time</p>
                    </div>
                  </div>
                  <button onClick={() => startExamMock(exam.id, exam.name)}
                    style={{ padding:'8px 14px', background:NAVY, color:'#fff',
                      border:'none', borderRadius:10, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    Mock →
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/exams')}
              style={{ width:'100%', padding:'12px', background:theme?.isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', color:mutedText,
                border:`1.5px solid ${borderColor}`, borderRadius:12, fontSize:13, cursor:'pointer', fontWeight:600 }}>
              + Enroll in More Exams
            </button>
          </div>
        )}

        {/* PYQ TAB */}
        {tab === 'pyq' && (
          <div>
            <div style={{ background:theme?.isDark ? 'rgba(196, 181, 253, 0.1)' : 'linear-gradient(135deg,#FFF7E6,#FFFBF0)',
              border:`1px solid ${GOLD}`, borderRadius:12, padding:12, marginTop:12, marginBottom:12 }}>
              <p style={{ fontSize:13, fontWeight:700, color:theme?.isDark ? GOLD : '#92400E', margin:'0 0 4px' }}>
                📄 Previous Year Questions (PYQ)
              </p>
              <p style={{ fontSize:12, color:theme?.isDark ? 'rgba(255,255,255,0.7)' : '#78350F', margin:0, lineHeight:1.6 }}>
                Real questions from past papers. Free users get unlimited PYQ access - no limit on these.
              </p>
            </div>
            {enrolled.map(exam => (
              <div key={exam.id} style={{ background:cardBg, borderRadius:12, padding:'12px 14px',
                marginBottom:8, border:`1.5px solid ${borderColor}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:20 }}>{exam.icon}</span>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:textColor, margin:0 }}>{exam.name}</p>
                      <p style={{ fontSize:10, color:mutedText, margin:0 }}>PYQ 2019-2024 · 500+ questions</p>
                    </div>
                  </div>
                  <button onClick={() => startPYQ(exam.id)}
                    style={{ padding:'8px 14px', background:'#059669', color:'#fff',
                      border:'none', borderRadius:10, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    Practice →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* -- START BUTTON --------------------------------------------------- */}
        <div style={{ marginTop:20 }}>
          {!access.allowed && !access.canByCoin ? (
            <div>
              <div style={{ background:theme?.isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2', border:`1.5px solid ${theme?.isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA'}`,
                borderRadius:12, padding:'12px 14px', marginBottom:10, textAlign:'center' }}>
                <p style={{ fontSize:13, fontWeight:700, color:theme?.isDark ? '#FCA5A5' : '#991B1B', margin:'0 0 4px' }}>
                  🔒 Daily Test Limit Reached (5/5)
                </p>
                <p style={{ fontSize:12, color:theme?.isDark ? '#FCA5A5' : '#DC2626', margin:0 }}>
                  Upgrade to Pro for unlimited tests
                </p>
              </div>
              <button onClick={() => navigate('/pro')}
                style={{ width:'100%', padding:'14px', background:`linear-gradient(135deg,${GOLD},${theme?.accentLight || '#E8C96A'})`,
                  color:NAVY, border:'none', borderRadius:14, fontWeight:800, fontSize:15, cursor:'pointer' }}>
                Upgrade to Pro - Unlimited Tests →
              </button>
            </div>
          ) : (
            <button onClick={() => startTest()}
              style={{ width:'100%', padding:'16px', background:`linear-gradient(135deg,${NAVY},${theme?.primaryDark || '#0F2140'})`,
                color:'#fff', border:'none', borderRadius:14, fontWeight:800, fontSize:16, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <span style={{ fontSize:20 }}>
                {mode==='practice'?'📝':mode==='speed'?'⚡':'🎯'}
              </span>
              Start {mode.charAt(0).toUpperCase()+mode.slice(1)} - {count} Questions
            </button>
          )}
        </div>
      </div>
    </div>
  )
}