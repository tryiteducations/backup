#!/bin/bash
# TryIT Educations — ALL Remaining Pages + Mobile Config
ROOT="${1:-/workspaces/Tatu}"
cd "$ROOT"
echo "Installing all remaining pages..."
mkdir -p src/pages/exams src/pages/roadmap src/pages/games
mkdir -p src/pages/tournaments src/pages/exam-alerts
mkdir -p src/pages/parent src/pages/classroom
mkdir -p src/pages/exams src/pages/roadmap src/pages/games
mkdir -p src/pages/tournaments src/pages/exam-alerts
mkdir -p src/pages/parent src/pages/classroom/sub

# ══════════════════════════════════════════════════════════════════
# EXAM DETAIL + EXAM UNIVERSE
# ══════════════════════════════════════════════════════════════════
cat > src/pages/exams/ExamDetail.jsx << 'EOF'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const EXAM_DATA = {
  'ssc-cgl': {
    name:'SSC CGL 2026', fullName:'Staff Selection Commission Combined Graduate Level',
    emoji:'📋', conductingBody:'Staff Selection Commission', ministry:'Ministry of Personnel',
    frequency:'Annual', level:'National', category:'Central Government',
    vacancies:'17,727', salary:'₹47,600 – ₹1,51,100/month', age:'18–32 years',
    education:'Any Graduate', negative:'-0.5 per wrong answer',
    stages:['Tier 1 (CBT Online)','Tier 2 (CBT Online)','Document Verification'],
    syllabus:['General Intelligence & Reasoning','General Awareness','Quantitative Aptitude','English Comprehension'],
    timeline:{ notification:'Sep 2026', form:'Oct 2026', tier1:'Dec 2026', tier2:'Mar 2027', result:'Jun 2027' },
    readiness:67, enrolled:true, color:'#1E3A5F',
  },
  'upsc-cse': {
    name:'UPSC CSE 2026', fullName:'Union Public Service Commission Civil Services Exam',
    emoji:'🏛️', conductingBody:'UPSC', ministry:'DoPT',
    frequency:'Annual', level:'National', category:'Central Government',
    vacancies:'979', salary:'₹56,100+/month (IAS/IPS/IFS)',age:'21–32 years',
    education:'Any Graduate', negative:'-1/3 per wrong answer',
    stages:['Prelims (MCQ)','Mains (Written)','Personality Test (Interview)'],
    syllabus:['General Studies I-IV','CSAT','Optional Subject','Essay'],
    timeline:{ notification:'Feb 2026', form:'Mar 2026', prelims:'May 2026', mains:'Sep 2026', interview:'Mar 2027' },
    readiness:34, enrolled:true, color:'#7C3AED',
  },
}

const DEFAULT = {
  name:'Exam Detail', fullName:'Details loading...', emoji:'📄',
  conductingBody:'Various', ministry:'—', frequency:'Annual', level:'National',
  vacancies:'—', salary:'Varies', age:'Varies', education:'Varies', negative:'Varies',
  stages:['Stage 1','Stage 2'],
  syllabus:['Subject 1','Subject 2'],
  timeline:{}, readiness:0, enrolled:false, color:'#1E3A5F',
}

export default function ExamDetail() {
  const { examId } = useParams()
  const navigate   = useNavigate()
  const exam = EXAM_DATA[examId] || { ...DEFAULT, name: examId?.toUpperCase().replace(/-/g,' ') || 'Exam' }

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${exam.color},${exam.color}CC)`, borderRadius:24, padding:24, marginBottom:20, color:'#fff' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16, flexWrap:'wrap' }}>
          <span style={{ fontSize:44 }}>{exam.emoji}</span>
          <div>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:'clamp(20px,3vw,30px)' }}>{exam.name}</h1>
            <p style={{ opacity:.75, fontSize:13, marginTop:4 }}>{exam.fullName}</p>
          </div>
          {exam.enrolled && <span style={{ marginLeft:'auto', background:'rgba(255,255,255,0.2)', fontSize:12, fontWeight:700, padding:'5px 14px', borderRadius:20 }}>✅ Enrolled</span>}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10 }}>
          {[['💼',exam.vacancies,'Vacancies'],['💰',exam.salary,'Salary'],['🎂',exam.age,'Age Limit'],['📅',exam.frequency,'Frequency']].map(([e,v,l])=>(
            <div key={l} style={{ background:'rgba(255,255,255,0.12)', borderRadius:12, padding:'10px 8px', textAlign:'center' }}>
              <p style={{ fontSize:18 }}>{e}</p>
              <p style={{ fontWeight:800, fontSize:13, marginTop:4 }}>{v}</p>
              <p style={{ opacity:.6, fontSize:10 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        {[['🎯 Practice Now','/test-engine','#D4AF37','#1E3A5F'],['🗺️ My Roadmap',`/roadmap/${examId}`,'#1E3A5F','#fff'],['📊 My Analytics','/analytics','#22C55E','#fff']].map(([l,p,bg,c])=>(
          <button key={l} onClick={()=>navigate(p)} style={{ flex:1, minWidth:120, padding:'12px 16px', borderRadius:14, border:'none', background:bg, color:c, fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor:'pointer' }}>{l}</button>
        ))}
      </div>

      {/* Readiness */}
      {exam.readiness > 0 && (
        <div style={{ background:'#fff', borderRadius:20, padding:20, marginBottom:14, border:'1.5px solid #E2E8F0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F' }}>Your Readiness</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:exam.readiness>=70?'#22C55E':exam.readiness>=40?'#D4AF37':'#EF4444', fontSize:20 }}>{exam.readiness}%</p>
          </div>
          <div style={{ height:10, background:'#F1F5F9', borderRadius:5 }}>
            <div style={{ width:`${exam.readiness}%`, height:10, borderRadius:5, background:exam.readiness>=70?'#22C55E':exam.readiness>=40?'#D4AF37':'#EF4444' }}/>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap:14 }}>
        {/* Stages */}
        <div style={{ background:'#fff', borderRadius:20, padding:20, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:14 }}>📍 Exam Stages</p>
          {exam.stages.map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:`${exam.color}18`, border:`2px solid ${exam.color}`, display:'flex', alignItems:'center', justifyContent:'center', color:exam.color, fontWeight:800, fontSize:12, flexShrink:0 }}>{i+1}</div>
              <p style={{ color:'#1E293B', fontWeight:600, fontSize:14, paddingTop:4 }}>{s}</p>
            </div>
          ))}
        </div>

        {/* Syllabus */}
        <div style={{ background:'#fff', borderRadius:20, padding:20, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:14 }}>📚 Syllabus</p>
          {exam.syllabus.map((s,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ color:'#D4AF37', fontWeight:800 }}>▸</span>
              <p style={{ color:'#475569', fontSize:14 }}>{s}</p>
            </div>
          ))}
          <div style={{ background:'#FEF3C7', borderRadius:12, padding:'10px 14px', marginTop:10 }}>
            <p style={{ color:'#92400E', fontSize:12, fontWeight:600 }}>⚠️ Negative Marking: {exam.negative}</p>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ background:'#fff', borderRadius:20, padding:20, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:14 }}>📅 Important Dates</p>
          {Object.entries(exam.timeline).map(([k,v],i)=>(
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F8FAFC' }}>
              <p style={{ color:'#64748B', fontSize:13, textTransform:'capitalize' }}>{k.replace(/([A-Z])/g,' $1')}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:13 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
EOF

# ── ROADMAP ───────────────────────────────────────────────────────
cat > src/pages/roadmap/RoadmapPage.jsx << 'EOF'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'

const generateRoadmap = (examId) => {
  const days = Array.from({ length: 30 }, (_,i) => {
    const subjects = ['Quantitative Aptitude','Reasoning','English','General Knowledge','Current Affairs']
    const s = subjects[i % subjects.length]
    const topics = {
      'Quantitative Aptitude':['Profit & Loss','Percentage','Time & Work','Ratio','Averages'],
      'Reasoning':['Analogies','Coding-Decoding','Blood Relations','Direction','Syllogisms'],
      'English':['Reading Comprehension','Error Detection','Vocabulary','Sentence Correction','Fill in the blanks'],
      'General Knowledge':['History','Geography','Polity','Economics','Science GK'],
      'Current Affairs':["Today's national news","International news","Sports updates","Economy news","Awards & honours"],
    }
    const tArr = topics[s] || ['Topic 1','Topic 2']
    return {
      day: i+1,
      subject: s,
      topic: tArr[Math.floor(Math.random()*tArr.length)],
      tests: i%7===6 ? 1 : 0,
      done: i < 8,
      today: i === 8,
    }
  })
  return days
}

const WEEK_COLORS = ['#EDE9FE','#DBEAFE','#DCFCE7','#FEF3C7','#FEE2E2']

export default function RoadmapPage() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const [view, setView] = useState('week')
  const roadmap = generateRoadmap(examId)
  const today = roadmap.find(d=>d.today)
  const weeks = [0,1,2,3].map(w => roadmap.slice(w*7, w*7+7))

  return (
    <AppLayout>
      <div style={{ marginBottom:20 }}>
        <button onClick={()=>navigate(-1)} style={{ background:'none', border:'none', color:'#64748B', cursor:'pointer', marginBottom:12, fontSize:14 }}>← Back</button>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28 }}>🗺️ 30-Day Roadmap</h1>
        <p style={{ color:'#94A3B8', fontSize:14 }}>{examId?.toUpperCase().replace(/-/g,' ')} · Auto-generated from your exam date</p>
      </div>

      {/* Today's plan */}
      {today && (
        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:22, padding:22, marginBottom:20, border:'1.5px solid rgba(212,175,55,0.3)' }}>
          <p style={{ color:'#D4AF37', fontSize:12, fontWeight:700, letterSpacing:'2px', marginBottom:8 }}>TODAY — DAY {today.day}</p>
          <h2 style={{ color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>{today.subject}</h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:15, marginBottom:16 }}>Topic: <strong style={{ color:'#D4AF37' }}>{today.topic}</strong></p>
          <button onClick={()=>navigate('/test-engine')} style={{ background:'linear-gradient(135deg,#D4AF37,#E8C84A)', border:'none', borderRadius:14, padding:'12px 24px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, color:'#1E3A5F', cursor:'pointer' }}>
            Start Today's Practice →
          </button>
        </div>
      )}

      {/* Week view */}
      {weeks.map((week,wi)=>(
        <div key={wi} style={{ marginBottom:20 }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:10 }}>Week {wi+1}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6 }}>
            {week.map(d=>(
              <div key={d.day} style={{ borderRadius:14, padding:'10px 6px', textAlign:'center', background: d.done?'#DCFCE7':d.today?'linear-gradient(135deg,#1E3A5F,#0F2140)':WEEK_COLORS[wi], border: d.today?'2px solid #D4AF37':d.done?'1.5px solid #22C55E':'1.5px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:11, color: d.done?'#15803D':d.today?'#D4AF37':'#64748B' }}>D{d.day}</p>
                <p style={{ fontSize:d.done?'14px':'10px', marginTop:2 }}>{d.done?'✅':d.today?'📍':d.tests?'📝':'📖'}</p>
                <p style={{ fontSize:8, color: d.done?'#15803D':d.today?'rgba(255,255,255,0.7)':'#94A3B8', marginTop:2, lineHeight:1.2 }}>{d.subject.slice(0,6)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AppLayout>
  )
}
EOF
echo "ExamDetail + Roadmap done"
# ══════════════════════════════════════════════════════════════════
# BRAIN GAMES — MathBlitz (fully playable)
# ══════════════════════════════════════════════════════════════════
cat > src/pages/games/GamesHub.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const GAMES = [
  { id:'math-blitz',  emoji:'⚡', name:'Math Blitz',    desc:'Solve 10 questions in 60 seconds',      coins:'5–50',  tag:'Most Popular', color:'#EF4444' },
  { id:'word-rush',   emoji:'📝', name:'Word Rush',     desc:'Spot the correct spelling first',        coins:'5–30',  tag:'English',      color:'#3B82F6' },
  { id:'gk-burst',    emoji:'🌏', name:'GK Burst',      desc:'10 GK questions. 30 seconds each.',      coins:'10–40', tag:'GK',           color:'#10B981' },
  { id:'logic-grid',  emoji:'🧩', name:'Logic Grid',    desc:'Fill the number grid using clues',       coins:'15–60', tag:'Reasoning',    color:'#8B5CF6' },
  { id:'rank-rush',   emoji:'🏆', name:'Rank Rush',     desc:'Beat 5 opponents in a timed challenge',  coins:'20–100',tag:'Multiplayer',  color:'#F59E0B' },
  { id:'daily-duel',  emoji:'🎯', name:'Daily Duel',    desc:'One opponent. 5 questions. Winner takes all.', coins:'25–75',tag:'Daily',  color:'#D4AF37' },
]

export default function GamesHub() {
  const navigate = useNavigate()
  const [active, setActive] = useState(null)
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>🎮 Brain Games</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Play. Earn coins. Rise the leaderboard.</p>

      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:20, padding:'14px 20px', marginBottom:20, display:'flex', gap:20, flexWrap:'wrap' }}>
        {[['🪙','1,247','My Coins'],['🏆','#347','Games Rank'],['🎮','142','Games Played'],['🔥','12d','Best Streak']].map(([e,v,l])=>(
          <div key={l} style={{ textAlign:'center' }}>
            <p style={{ fontSize:18 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:18 }}>{v}</p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{l}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap:14 }}>
        {GAMES.map(g=>(
          <div key={g.id} onClick={()=>g.id==='math-blitz'?navigate('/games/math-blitz'):setActive(g.id)}
            style={{ background:'#fff', borderRadius:20, padding:20, border:`1.5px solid ${active===g.id?g.color:'#E2E8F0'}`, cursor:'pointer', transition:'all 0.2s', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=g.color}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E2E8F0'}}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ fontSize:34 }}>{g.emoji}</span>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                <span style={{ background:`${g.color}18`, color:g.color, fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>{g.tag}</span>
                <span style={{ background:'#F8FAFC', color:'#D4AF37', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>🪙 {g.coins} coins</span>
              </div>
            </div>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16, marginBottom:6 }}>{g.name}</h3>
            <p style={{ color:'#64748B', fontSize:13, marginBottom:14 }}>{g.desc}</p>
            <button style={{ width:'100%', padding:'10px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${g.color},${g.color}CC)`, color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              {g.id==='math-blitz'?'Play Now →':'Coming Soon'}
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
EOF

# Math Blitz — fully playable
cat > src/pages/games/MathBlitz.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useToast } from '../../context/ToastContext'

function genQ() {
  const ops = ['+','-','×','÷']
  const op = ops[Math.floor(Math.random()*4)]
  let a,b,ans
  if(op==='+'){a=Math.floor(Math.random()*50)+1;b=Math.floor(Math.random()*50)+1;ans=a+b}
  else if(op==='-'){a=Math.floor(Math.random()*80)+20;b=Math.floor(Math.random()*a)+1;ans=a-b}
  else if(op==='×'){a=Math.floor(Math.random()*12)+2;b=Math.floor(Math.random()*12)+2;ans=a*b}
  else{b=Math.floor(Math.random()*10)+2;ans=Math.floor(Math.random()*10)+2;a=b*ans}
  const wrong=[ans+b,ans-1,ans+1,ans*2].filter(x=>x!==ans&&x>0)
  const choices=[ans,...wrong.slice(0,3)].sort(()=>Math.random()-0.5)
  return{ q:`${a} ${op} ${b} = ?`, ans, choices }
}

export default function MathBlitz() {
  const navigate   = useNavigate()
  const { showToast } = useToast()
  const [phase,    setPhase]   = useState('intro')
  const [q,        setQ]       = useState(null)
  const [qNum,     setQNum]    = useState(0)
  const [score,    setScore]   = useState(0)
  const [timeLeft, setTime]    = useState(60)
  const [chosen,   setChosen]  = useState(null)
  const [streak,   setStreak]  = useState(0)
  const [lastRight,setLast]    = useState(null)
  const timerRef = useRef(null)
  const TOTAL = 10

  const start = () => { setPhase('play'); setQ(genQ()); setQNum(1); setScore(0); setTime(60); setStreak(0) }

  useEffect(() => {
    if(phase!=='play') return
    timerRef.current = setInterval(()=>{
      setTime(t=>{
        if(t<=1){ clearInterval(timerRef.current); setPhase('result'); return 0 }
        return t-1
      })
    },1000)
    return ()=>clearInterval(timerRef.current)
  },[phase])

  const pick = (val) => {
    if(chosen!==null) return
    setChosen(val)
    const right = val===q.ans
    if(right){ setScore(s=>s+(streak>=2?15:10)); setStreak(s=>s+1); setLast(true) }
    else { setStreak(0); setLast(false) }
    setTimeout(()=>{
      setChosen(null); setLast(null)
      if(qNum>=TOTAL){ clearInterval(timerRef.current); setPhase('result') }
      else { setQ(genQ()); setQNum(n=>n+1) }
    },600)
  }

  const coins = Math.floor(score/3)+5

  if(phase==='intro') return (
    <AppLayout>
      <div style={{ maxWidth:400, margin:'0 auto', textAlign:'center', padding:'40px 0' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>⚡</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:30, marginBottom:10 }}>Math Blitz</h1>
        <p style={{ color:'#64748B', fontSize:15, marginBottom:24 }}>10 questions · 60 seconds · Earn up to 50 coins</p>
        <div style={{ background:'#F8FAFC', borderRadius:18, padding:16, marginBottom:24, textAlign:'left', border:'1.5px solid #E2E8F0' }}>
          {['Tap the correct answer fast','Streak bonus: 3+ correct = +5 per question','Finish all 10 before timer ends','Top score this week: 90 pts'].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:10, marginBottom:8 }}>
              <span style={{ color:'#D4AF37' }}>▸</span>
              <span style={{ color:'#475569', fontSize:13 }}>{r}</span>
            </div>
          ))}
        </div>
        <button onClick={start} style={{ width:'100%', padding:16, borderRadius:16, border:'none', background:'linear-gradient(135deg,#EF4444,#DC2626)', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', cursor:'pointer', boxShadow:'0 6px 20px rgba(239,68,68,0.4)' }}>
          ⚡ Start Blitz!
        </button>
      </div>
    </AppLayout>
  )

  if(phase==='result') return (
    <AppLayout>
      <div style={{ maxWidth:400, margin:'0 auto', textAlign:'center', padding:'40px 0' }}>
        <div style={{ fontSize:60, marginBottom:16 }}>{score>=70?'🏆':score>=40?'⭐':'😤'}</div>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:28, marginBottom:8 }}>
          {score>=70?'Blazing! 🔥':score>=40?'Nice work! 💪':'Keep going! 📈'}
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
          {[['Score',score],['Coins Earned',`🪙 ${coins}`],['Questions',`${qNum-1}/${TOTAL}`],['Best Streak',`${streak}x`]].map(([l,v])=>(
            <div key={l} style={{ background:'#F8FAFC', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0' }}>
              <p style={{ color:'#94A3B8', fontSize:11, marginBottom:4 }}>{l}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:24 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, flexDirection:'column' }}>
          <button onClick={start} style={{ padding:14, borderRadius:14, border:'none', background:'linear-gradient(135deg,#EF4444,#DC2626)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16, color:'#fff', cursor:'pointer' }}>⚡ Play Again</button>
          <button onClick={()=>navigate('/games')} style={{ padding:12, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>← All Games</button>
        </div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div style={{ maxWidth:460, margin:'0 auto' }}>
        {/* Timer + score bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background: timeLeft<=10?'#EF4444':timeLeft<=20?'#F59E0B':'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:18 }}>{timeLeft}</div>
            <span style={{ color:'#64748B', fontSize:13 }}>sec left</span>
          </div>
          <div style={{ display:'flex', gap:4 }}>
            {Array.from({length:TOTAL}).map((_,i)=>(
              <div key={i} style={{ width:22, height:22, borderRadius:'50%', background: i<qNum-1?'#22C55E':i===qNum-1?'#D4AF37':'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color: i<qNum-1?'#fff':i===qNum-1?'#1E3A5F':'#94A3B8' }}>{i<qNum-1?'✓':i+1}</div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:20 }}>{score}</p>
            {streak>=2&&<p style={{ color:'#F97316', fontSize:11, fontWeight:700 }}>🔥 {streak}x streak!</p>}
          </div>
        </div>

        {/* Question */}
        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:24, padding:32, marginBottom:20, textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, letterSpacing:'2px', marginBottom:8 }}>Q {qNum} / {TOTAL}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:'clamp(28px,6vw,48px)' }}>{q?.q}</p>
          {lastRight===true&&<p style={{ color:'#4ADE80', fontWeight:700, fontSize:16, marginTop:8 }}>✓ Correct! {streak>=2?'🔥':''}</p>}
          {lastRight===false&&<p style={{ color:'#F87171', fontWeight:700, fontSize:16, marginTop:8 }}>✗ Oops — Answer was {q?.ans}</p>}
        </div>

        {/* Choices */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {q?.choices.map((c,i)=>{
            const isChosen = chosen===c
            const isRight  = chosen!==null && c===q.ans
            const isWrong  = isChosen && c!==q.ans
            return (
              <button key={i} onClick={()=>pick(c)} disabled={chosen!==null}
                style={{ padding:'22px', borderRadius:18, border:'none', cursor: chosen!==null?'not-allowed':'pointer', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'clamp(22px,4vw,32px)',
                  background: isRight?'#22C55E':isWrong?'#EF4444':'#fff',
                  color: isRight||isWrong?'#fff':'#1E3A5F',
                  boxShadow: isRight?'0 6px 20px rgba(34,197,94,0.4)':isWrong?'0 6px 20px rgba(239,68,68,0.4)':'0 4px 14px rgba(0,0,0,0.08)',
                  transform: isChosen?'scale(0.95)':'scale(1)', transition:'all 0.15s' }}>
                {c}
              </button>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
EOF
echo "Games done"
# ══════════════════════════════════════════════════════════════════
# TOURNAMENTS + EXAM ALERTS + PARENT DASHBOARD + STUDY PLANNER
# ══════════════════════════════════════════════════════════════════

cat > src/pages/tournaments/Tournaments.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useToast } from '../../context/ToastContext'

const TOURNAMENTS = [
  { id:'t1', name:'All India SSC Grand Challenge', prize:'₹50,000', prizePool:true, date:'Jun 15, 2026 · 10 AM', registered:8423, seats:10000, category:'SSC', status:'open', emoji:'🏆', color:'#D4AF37' },
  { id:'t2', name:'UPSC Prelims Qualifier', prize:'₹25,000', prizePool:true, date:'Jun 18, 2026 · 2 PM', registered:3241, seats:5000, category:'UPSC', status:'open', emoji:'🎯', color:'#7C3AED' },
  { id:'t3', name:'Banking Speed Challenge', prize:'₹15,000', prizePool:false, date:'Jun 20, 2026 · 11 AM', registered:2187, seats:3000, category:'IBPS', status:'open', emoji:'🏦', color:'#0369A1' },
  { id:'t4', name:'Weekend Warrior — All Exams', prize:'₹5,000', prizePool:false, date:'Jun 14, 2026 · Live', registered:1247, seats:1000, category:'All', status:'live', emoji:'⚡', color:'#EF4444' },
]

export default function Tournaments() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>🏆 Tournaments</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Compete nationally. Win cash prizes. Prove your rank.</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))', gap:14 }}>
        {TOURNAMENTS.map(t=>(
          <div key={t.id} style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:`1.5px solid ${t.status==='live'?'#EF4444':'#E2E8F0'}`, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ background:`linear-gradient(135deg,${t.color},${t.color}CC)`, padding:'18px 18px 14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:28 }}>{t.emoji}</span>
                <span style={{ background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 10px', borderRadius:20, letterSpacing:'1px' }}>
                  {t.status==='live'?'🔴 LIVE NOW':t.category}
                </span>
              </div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:16, marginBottom:4 }}>{t.name}</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>{t.date}</p>
            </div>
            <div style={{ padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <div>
                  <p style={{ color:'#94A3B8', fontSize:11 }}>Prize</p>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#22C55E', fontSize:20 }}>{t.prize}</p>
                  {t.prizePool && <p style={{ color:'#94A3B8', fontSize:10 }}>prize pool</p>}
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ color:'#94A3B8', fontSize:11 }}>Registered</p>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16 }}>{t.registered.toLocaleString()} / {t.seats.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ height:4, background:'#F1F5F9', borderRadius:2, marginBottom:12 }}>
                <div style={{ width:`${(t.registered/t.seats)*100}%`, height:4, borderRadius:2, background: t.status==='live'?'#EF4444':t.color }}/>
              </div>
              <button onClick={()=>showToast('success',`Registered for ${t.name}! 🏆`)}
                style={{ width:'100%', padding:'11px', borderRadius:14, border:'none', background: t.status==='live'?'linear-gradient(135deg,#EF4444,#DC2626)':`linear-gradient(135deg,${t.color},${t.color}CC)`, color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor:'pointer' }}>
                {t.status==='live'?'⚡ Join Live Tournament':'Register Free →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
EOF

# Exam Alerts
cat > src/pages/exam-alerts/ExamAlerts.jsx << 'EOF'
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useToast } from '../../context/ToastContext'

const EXAMS_UPCOMING = [
  { name:'SSC CGL 2026 Tier 1', date:'Dec 10, 2026', daysLeft:183, enrolled:true,  emoji:'📋', important:true  },
  { name:'UPSC CSE Prelims 2026',date:'May 25, 2026', daysLeft:0,  enrolled:true,  emoji:'🏛️', important:true, passed:true  },
  { name:'IBPS PO Mains 2026',   date:'Nov 30, 2026', daysLeft:172, enrolled:false, emoji:'🏦', important:false },
  { name:'NEET UG 2026',          date:'May 4, 2026',  daysLeft:0,  enrolled:false, emoji:'🩺', important:false, passed:true  },
  { name:'RRB NTPC Phase 2',      date:'Jul 15, 2026', daysLeft:34, enrolled:true,  emoji:'🚂', important:true  },
  { name:'SSC CHSL 2026',         date:'Aug 20, 2026', daysLeft:70, enrolled:false, emoji:'📄', important:false },
  { name:'NDA 2 Written',         date:'Sep 14, 2026', daysLeft:95, enrolled:false, emoji:'🎖️', important:false },
  { name:'CAT 2026',              date:'Nov 24, 2026', daysLeft:166, enrolled:false, emoji:'🎓', important:true  },
]

export default function ExamAlerts() {
  const { showToast } = useToast()
  const [enrolled, setEnrolled] = useState(new Set(EXAMS_UPCOMING.filter(e=>e.enrolled).map((_,i)=>i)))
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>📡 Exam Watch</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Never miss a deadline. Get alerts 30/7/1 day before.</p>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {EXAMS_UPCOMING.map((e,i)=>(
          <div key={i} style={{ background:'#fff', borderRadius:18, padding:'14px 18px', border:`1.5px solid ${e.passed?'#E2E8F0':e.daysLeft<=7?'#EF444455':enrolled.has(i)?'rgba(212,175,55,0.3)':'#E2E8F0'}`, opacity: e.passed?0.6:1, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
            <span style={{ fontSize:26, flexShrink:0 }}>{e.emoji}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:3 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{e.name}</p>
                {e.important && <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:9, fontWeight:800, padding:'2px 6px', borderRadius:20 }}>★ Important</span>}
                {e.passed && <span style={{ background:'#F1F5F9', color:'#94A3B8', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>Completed</span>}
              </div>
              <p style={{ color:'#94A3B8', fontSize:12 }}>{e.date}</p>
            </div>
            <div style={{ flexShrink:0, textAlign:'right' }}>
              {!e.passed && (
                <>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18, color: e.daysLeft<=7?'#EF4444':e.daysLeft<=30?'#F59E0B':'#22C55E' }}>
                    {e.daysLeft===0?'Today':e.daysLeft+'d'}
                  </p>
                  <button onClick={()=>{ const n=new Set(enrolled); n.has(i)?n.delete(i):n.add(i); setEnrolled(n); showToast('success', n.has(i)?`✅ Alert set for ${e.name}`:`Removed alert for ${e.name}`) }}
                    style={{ background: enrolled.has(i)?'#FEF3C7':'#F1F5F9', border:'none', borderRadius:10, padding:'5px 12px', color: enrolled.has(i)?'#92400E':'#64748B', cursor:'pointer', fontSize:12, fontFamily:'Poppins,sans-serif', fontWeight:600, marginTop:4 }}>
                    {enrolled.has(i)?'🔔 Watching':'+ Watch'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
EOF

# Study Planner (classroom sub-page)
cat > src/pages/classroom/StudyPlanner.jsx << 'EOF'
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'

const HOURS = ['6 AM','7 AM','8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM','9 PM','10 PM']
const COLORS = ['#DBEAFE','#DCFCE7','#FEF3C7','#EDE9FE','#FCE7F3','#FEE2E2']
const SUBJECTS = ['Reasoning','Quant','English','GK','Current Affairs','Mock Test','Revision']

export default function StudyPlanner() {
  const [slots, setSlots] = useState({ '9 AM':{ subject:'Quant', color:'#DBEAFE' }, '11 AM':{ subject:'Reasoning', color:'#DCFCE7' }, '2 PM':{ subject:'English', color:'#FEF3C7' }, '7 PM':{ subject:'Mock Test', color:'#EDE9FE' } })
  const [drag, setDrag] = useState(null)
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>📅 Study Planner</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:16 }}>Tap a time slot to assign a subject.</p>

      <div style={{ background:'#fff', borderRadius:20, padding:16, border:'1.5px solid #E2E8F0', marginBottom:16 }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>Today's Schedule — Jun 11</p>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {HOURS.map(h=>{
            const slot = slots[h]
            return (
              <div key={h} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ color:'#94A3B8', fontSize:12, width:44, flexShrink:0 }}>{h}</span>
                <div onClick={()=>{
                  if(slot){ const n={...slots}; delete n[h]; setSlots(n) }
                  else{ const sub=SUBJECTS[Math.floor(Math.random()*SUBJECTS.length)]; const col=COLORS[Math.floor(Math.random()*COLORS.length)]; setSlots(s=>({...s,[h]:{subject:sub,color:col}})) }
                }} style={{ flex:1, height:36, borderRadius:10, background:slot?slot.color:'#F8FAFC', border:`1.5px dashed ${slot?'transparent':'#E2E8F0'}`, display:'flex', alignItems:'center', paddingLeft:12, cursor:'pointer', transition:'all 0.15s' }}>
                  {slot
                    ? <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:13 }}>{slot.subject}</span>
                    : <span style={{ color:'#CBD5E1', fontSize:12 }}>+ Add</span>
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {SUBJECTS.map((s,i)=>(
          <span key={s} style={{ background:COLORS[i%COLORS.length], fontSize:12, fontWeight:700, padding:'5px 14px', borderRadius:20, color:'#1E3A5F', cursor:'pointer' }}>{s}</span>
        ))}
      </div>
    </AppLayout>
  )
}
EOF

# Parent Dashboard
cat > src/pages/parent/ParentDashboard.jsx << 'EOF'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const CHILDREN = [
  { name:'Priya Kumar', class:'Class 12 · Science', streak:8, testsThisWeek:5, avgScore:84, lastActive:'Today 2 PM', level:'📈 The Riser', rank:'#2,341', concern:null },
  { name:'Ravi Kumar',  class:'B.Sc 1st Year',      streak:2, testsThisWeek:1, avgScore:61, lastActive:'3 days ago', level:'🔥 Fierce One', rank:'#8,921', concern:'Low activity this week' },
]

export default function ParentDashboard() {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>👨‍👩‍👧 Parent Dashboard</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Monitor your children's exam preparation.</p>

      {CHILDREN.map((c,i)=>(
        <div key={i} style={{ background:'#fff', borderRadius:22, padding:22, marginBottom:14, border:`1.5px solid ${c.concern?'#FEE2E2':'#E2E8F0'}`, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
          {c.concern && (
            <div style={{ background:'#FEE2E2', borderRadius:12, padding:'8px 14px', marginBottom:12 }}>
              <p style={{ color:'#991B1B', fontSize:12, fontWeight:600 }}>⚠️ {c.concern}</p>
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, flexWrap:'wrap' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#1E3A5F,#0F2140)', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4AF37', fontWeight:900, fontSize:17 }}>
              {c.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16 }}>{c.name}</p>
              <p style={{ color:'#64748B', fontSize:13 }}>{c.class} · Last active: {c.lastActive}</p>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10 }}>
            {[['📝',c.testsThisWeek,'Tests this week'],['📊',`${c.avgScore}%`,'Avg score'],['🔥',`${c.streak}d`,'Streak'],['🏆',c.rank,'Rank']].map(([e,v,l])=>(
              <div key={l} style={{ background:'#F8FAFC', borderRadius:12, padding:'10px 8px', textAlign:'center' }}>
                <p style={{ fontSize:18 }}>{e}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:16 }}>{v}</p>
                <p style={{ color:'#94A3B8', fontSize:10, marginTop:2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AppLayout>
  )
}
EOF
echo "Tournaments + ExamAlerts + Planner + Parent done"
# ══════════════════════════════════════════════════════════════════
# MOBILE APK BUILD SCRIPT + CAPACITOR CONFIG
# ══════════════════════════════════════════════════════════════════
cat > MOBILE_BUILD_GUIDE.md << 'EOF'
# TryIT Educations — Android + iOS Build Guide

## ════════════════════════════════════════
## ANDROID APK — Step by Step
## ════════════════════════════════════════

### Step 1: Build the web app
```bash
npm run build
```
Wait for it to finish. Creates /dist folder.

### Step 2: Sync to Android
```bash
npx cap sync android
```

### Step 3: Open in Android Studio
```bash
npx cap open android
```
Android Studio will open automatically.

### Step 4: Build the APK
In Android Studio:
  1. Click: Build → Build Bundle(s) / APK(s) → Build APK(s)
  2. Wait 3-5 minutes for build
  3. Click "locate" when done
  4. APK is at: android/app/build/outputs/apk/debug/app-debug.apk

### Step 5: Install on phone
```bash
# If phone is connected via USB:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or share the .apk file via WhatsApp/email and install manually.

---

## ════════════════════════════════════════
## IOS APP — Step by Step (Mac only)
## ════════════════════════════════════════

### Step 1 (same): Build web + sync
```bash
npm run build
npx cap sync ios
```

### Step 2: Open Xcode
```bash
npx cap open ios
```

### Step 3: In Xcode
  1. Select your team in Signing & Capabilities
  2. Change bundle identifier to: net.tryiteducations.app
  3. Product → Archive → Distribute (for App Store)
     OR Product → Build → Run (for simulator test)

---

## ════════════════════════════════════════
## CAPACITOR CONFIG (auto-applied)
## ════════════════════════════════════════
EOF

# Update capacitor.config.ts
cat > capacitor.config.ts << 'EOF'
import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId:   'net.tryiteducations.app',
  appName: 'TryIT Educations',
  webDir:  'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*.tryiteducations.net'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0F2140',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0F2140',
    },
  },
}
export default config
EOF
echo "Mobile config done"

# Update App.jsx with all new routes
python3 << 'PYEOF'
with open('src/App.jsx','r') as f: c = f.read()

new_imports = """
const ExamDetail     = lazy(() => import('./pages/exams/ExamDetail'))
const RoadmapPage    = lazy(() => import('./pages/roadmap/RoadmapPage'))
const GamesHub       = lazy(() => import('./pages/games/GamesHub'))
const MathBlitz      = lazy(() => import('./pages/games/MathBlitz'))
const Tournaments    = lazy(() => import('./pages/tournaments/Tournaments'))
const ExamAlerts     = lazy(() => import('./pages/exam-alerts/ExamAlerts'))
const StudyPlanner   = lazy(() => import('./pages/classroom/StudyPlanner'))
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard'))"""

new_routes = """
                <Route path="/exams/:examId"        element={<ExamDetail />} />
                <Route path="/roadmap/:examId"       element={<RoadmapPage />} />
                <Route path="/games"                 element={<GamesHub />} />
                <Route path="/games/math-blitz"      element={<MathBlitz />} />
                <Route path="/tournaments"           element={<Tournaments />} />
                <Route path="/exam-alerts"           element={<ExamAlerts />} />
                <Route path="/classroom/planner"     element={<StudyPlanner />} />
                <Route path="/parent/dashboard"      element={<ParentDashboard />} />"""

if 'ExamDetail' not in c:
    c = c.replace('const LiveImpactTracker', new_imports + '\nconst LiveImpactTracker', 1)
if '/exams/:examId"        element={<ExamDetail' not in c:
    c = c.replace('<Route path="/exams/:examId"', new_routes + '\n                {/* remaining pages */', 1)
with open('src/App.jsx','w') as f: f.write(c)
print('App.jsx updated with all remaining routes')
PYEOF

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ ALL REMAINING PAGES INSTALLED                        ║"
echo "║                                                          ║"
echo "║  New pages:                                              ║"
echo "║    /exams/:examId        → Exam Detail + stages + dates  ║"
echo "║    /roadmap/:examId      → 30-day study roadmap          ║"
echo "║    /games                → Games Hub (6 games)           ║"
echo "║    /games/math-blitz     → FULLY PLAYABLE Math Blitz     ║"
echo "║    /tournaments          → 4 tournaments with prizes     ║"
echo "║    /exam-alerts          → Exam Watch + deadline alerts  ║"
echo "║    /classroom/planner    → Interactive study planner     ║"
echo "║    /parent/dashboard     → Parent monitoring dashboard   ║"
echo "║                                                          ║"
echo "║  Mobile config updated:                                  ║"
echo "║    capacitor.config.ts  → net.tryiteducations.app        ║"
echo "║    MOBILE_BUILD_GUIDE.md → Android + iOS build steps     ║"
echo "║                                                          ║"
echo "║  NEXT STEPS:                                             ║"
echo "║    1. npm run dev   (test all pages)                     ║"
echo "║    2. npm run build (prepare for mobile)                 ║"
echo "║    3. npx cap sync android                               ║"
echo "║    4. npx cap open android → Android Studio → Build APK  ║"
echo "╚══════════════════════════════════════════════════════════╝"
