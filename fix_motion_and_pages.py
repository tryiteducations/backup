import os

def w(path, txt):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(txt)
    print('OK', path)

def patch_file(path, old, new):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read()
        if old in c:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(c.replace(old, new, 1))
            print('PATCHED', path)
        else:
            print('SKIP', path, '(text not found)')
    except Exception as e:
        print('ERROR', path, str(e))

# ============================================================
# 1. MOTION LAYER — shooting stars ONLY + faint orbs
# ============================================================
w('src/components/global/MotionLayer.jsx', """// src/components/global/MotionLayer.jsx
// TRYIT EDUCATIONS — Shooting Stars Motion Layer
import React from 'react'

export default function MotionLayer() {
  return (
    <div aria-hidden="true" className="mg-layer">
      <div className="mg-orb mg-orb-0"/>
      <div className="mg-orb mg-orb-1"/>
      <div className="mg-shoot mg-shoot-0"/>
      <div className="mg-shoot mg-shoot-1"/>
      <div className="mg-shoot mg-shoot-2"/>
      <div className="mg-shoot mg-shoot-3"/>
      <div className="mg-shoot mg-shoot-4"/>
      <div className="mg-shoot mg-shoot-5"/>
    </div>
  )
}
""")

# ============================================================
# 2. motion-graphics.css — shooting stars + orbs only
# ============================================================
w('src/styles/motion-graphics.css', """/* =====================================================
   TRYIT EDUCATIONS — PREMIUM MOTION GRAPHICS
   Flying plates (shooting stars) + ambient orbs only
   ===================================================== */

/* ── BASE ─────────────────────────────────────────── */
.mg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* ── AMBIENT ORBS (very faint colour wash) ─────────── */
.mg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}
.mg-orb-0 {
  width: 800px;
  height: 800px;
  top: -200px;
  left: -200px;
  background: radial-gradient(circle, var(--color-primary,#1E3A5F) 0%, transparent 70%);
  opacity: 0.06;
  animation: mg-orb0 35s ease-in-out infinite;
}
.mg-orb-1 {
  width: 600px;
  height: 600px;
  bottom: -150px;
  right: -150px;
  background: radial-gradient(circle, var(--color-accent,#C9A84C) 0%, transparent 70%);
  opacity: 0.05;
  animation: mg-orb1 42s ease-in-out infinite;
}
@keyframes mg-orb0 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%     { transform: translate(100px,120px) scale(1.08); }
  70%     { transform: translate(-60px,80px) scale(0.94); }
}
@keyframes mg-orb1 {
  0%,100% { transform: translate(0,0) scale(1); }
  35%     { transform: translate(-80px,-100px) scale(1.1); }
  65%     { transform: translate(60px,-50px) scale(0.9); }
}

/* ── FLYING PLATES (shooting stars) ───────────────── */
.mg-shoot {
  position: absolute;
  border-radius: 3px;
  opacity: 0;
  animation: mg-fly ease-out infinite;
}

/* Each shooting star has a head glow + trailing tail */
.mg-shoot::before {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent,#C9A84C);
  box-shadow: 0 0 12px 4px var(--color-accent,#C9A84C);
}
.mg-shoot::after {
  content: '';
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--color-accent,#C9A84C)80 100%);
}

/* 6 shooting stars — different sizes, timings, angles */
.mg-shoot-0 {
  width: 180px;
  height: 2px;
  top: 6%;
  left: -15%;
  transform: rotate(-25deg);
  animation-duration: 6s;
  animation-delay: 0s;
}
.mg-shoot-0::after { width: 140px; }

.mg-shoot-1 {
  width: 120px;
  height: 1.5px;
  top: 18%;
  left: -12%;
  transform: rotate(-20deg);
  animation-duration: 9s;
  animation-delay: 2s;
  filter: hue-rotate(30deg);
}
.mg-shoot-1::after { width: 90px; }
.mg-shoot-1::before { width: 6px; height: 6px; }

.mg-shoot-2 {
  width: 240px;
  height: 2.5px;
  top: 3%;
  left: -18%;
  transform: rotate(-28deg);
  animation-duration: 11s;
  animation-delay: 4.5s;
}
.mg-shoot-2::after { width: 200px; }
.mg-shoot-2::before { width: 10px; height: 10px; box-shadow: 0 0 16px 6px var(--color-accent,#C9A84C); }

.mg-shoot-3 {
  width: 100px;
  height: 1px;
  top: 30%;
  left: -10%;
  transform: rotate(-18deg);
  animation-duration: 8s;
  animation-delay: 7s;
  opacity: 0;
}
.mg-shoot-3::after { width: 80px; background: linear-gradient(90deg,transparent,var(--color-primary,#1E3A5F)80); }
.mg-shoot-3::before { background: var(--color-primary,#1E3A5F); box-shadow: 0 0 10px 3px var(--color-primary,#1E3A5F); }

.mg-shoot-4 {
  width: 200px;
  height: 2px;
  top: 12%;
  left: -16%;
  transform: rotate(-32deg);
  animation-duration: 14s;
  animation-delay: 10s;
}
.mg-shoot-4::after { width: 160px; }

.mg-shoot-5 {
  width: 150px;
  height: 1.5px;
  top: 42%;
  left: -12%;
  transform: rotate(-15deg);
  animation-duration: 10s;
  animation-delay: 13s;
  filter: hue-rotate(60deg);
}
.mg-shoot-5::after { width: 120px; }
.mg-shoot-5::before { width: 7px; height: 7px; }

@keyframes mg-fly {
  0%    { transform: translateX(0) translateY(0) rotate(var(--r,-25deg)); opacity: 0; }
  4%    { opacity: 1; }
  50%   { opacity: 0.8; }
  90%   { opacity: 0.3; }
  100%  { transform: translateX(130vw) translateY(45vh) rotate(var(--r,-25deg)); opacity: 0; }
}

/* Fix rotation per element */
.mg-shoot-0 { --r: -25deg; }
.mg-shoot-1 { --r: -20deg; }
.mg-shoot-2 { --r: -28deg; }
.mg-shoot-3 { --r: -18deg; }
.mg-shoot-4 { --r: -32deg; }
.mg-shoot-5 { --r: -15deg; }

/* ── GLOBAL TEXT VISIBILITY ────────────────────────── */
body { color: var(--color-text,#1E293B); background: var(--color-background,#F8FAFC); }
body.theme-dark  { color: var(--color-text,#F1F5F9); }
body.theme-light { color: var(--color-text,#1E293B); }

/* ── SCROLL REVEAL ─────────────────────────────────── */
.mg-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.5s ease,transform 0.5s ease; }
.mg-reveal.mg-visible { opacity:1; transform:translateY(0); }
.mg-reveal-delay-1{transition-delay:0.1s;} .mg-reveal-delay-2{transition-delay:0.2s;}
.mg-reveal-delay-3{transition-delay:0.3s;} .mg-reveal-delay-4{transition-delay:0.4s;}

/* ── CARD HOVER ────────────────────────────────────── */
.mg-card { transition:transform 0.22s ease,box-shadow 0.22s ease; }
.mg-card:hover { transform:translateY(-4px); box-shadow:0 18px 44px rgba(0,0,0,0.13); }

/* ── SHIMMER BUTTON ────────────────────────────────── */
.mg-btn { position:relative; overflow:hidden; }
.mg-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
  background:rgba(255,255,255,0.18); transform:skewX(-20deg); transition:left 0.5s ease; }
.mg-btn:hover::after { left:160%; }

/* ── STAT POP ──────────────────────────────────────── */
.mg-stat-pop { animation:mg-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes mg-pop { from{transform:scale(0.7);opacity:0;} to{transform:scale(1);opacity:1;} }

/* ── SCROLLBAR ─────────────────────────────────────── */
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--color-primary,#1E3A5F)55;border-radius:2px;}
""")
print('OK motion-graphics.css')

# ============================================================
# 3. StudentCareer — standalone self-contained quiz (no /career-compass)
# ============================================================
w('src/pages/student/StudentCareer.jsx', """// src/pages/student/StudentCareer.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const QUESTIONS = [
  {
    q: 'What is your highest education?',
    opts: ['Class 10 / 12', 'Pursuing Graduation', 'Graduate', 'Post-Graduate']
  },
  {
    q: 'Which subject do you enjoy most?',
    opts: ['Maths & Reasoning', 'History & Polity', 'Science & Tech', 'Commerce & Economy']
  },
  {
    q: 'What kind of career do you want?',
    opts: ['Government / IAS / IPS', 'Banking & Finance', 'Defence / Police', 'Engineering / Research']
  },
  {
    q: 'How many hours can you study daily?',
    opts: ['1-2 hours', '2-4 hours', '4-6 hours', '6+ hours']
  },
]

const RESULTS = {
  '0-0': [{icon:'\\u{1F3DB}',name:'UPSC Civil Services',match:96,reason:'Strong academic base + interest in polity & governance'},
          {icon:'\\u{1F33F}',name:'TNPSC Group 1',match:88,reason:'State service with Tamil Nadu focus'},
          {icon:'\\u{1F4CB}',name:'SSC CGL',match:82,reason:'Central govt jobs across departments'}],
  '0-1': [{icon:'\\u{1F3E6}',name:'IBPS PO / SBI PO',match:94,reason:'Commerce + economy knowledge is perfect for banking'},
          {icon:'\\u{1F4CB}',name:'SSC CGL',match:86,reason:'Reasoning strength helps in Tier 1 & 2'},
          {icon:'\\u{1F3DB}',name:'UPSC Civil Services',match:78,reason:'Economy optional could be your strength'}],
  '1-0': [{icon:'\\u{1F6F8}',name:'NDA / CDS',match:95,reason:'Defence career path — maths + physical fitness'},
          {icon:'\\u{1F3DB}',name:'UPSC Civil Services',match:84,reason:'IPS / IAS through UPSC CSE'},
          {icon:'\\u{1F468}\\u{200D}\\u{1F393}',name:'SSC GD Constable',match:79,reason:'Direct entry into Central Armed Police'}],
  'default': [{icon:'\\u{1F4CB}',name:'SSC CGL',match:91,reason:'Best all-rounder exam for any background'},
              {icon:'\\u{1F3E6}',name:'IBPS PO',match:86,reason:'Banking career with good salary'},
              {icon:'\\u{1F33F}',name:'TNPSC Group 2',match:81,reason:'State government with Tamil Nadu advantage'}],
}

export default function StudentCareer() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F'
  const a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B'
  const m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC'
  const c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)

  const pick = (optIdx) => {
    const next = [...answers, optIdx]
    if (step < QUESTIONS.length - 1) {
      setAnswers(next)
      setStep(step + 1)
    } else {
      setAnswers(next)
      setDone(true)
    }
  }

  const key = answers.length >= 2 ? (answers[0]+'-'+answers[2]) : 'default'
  const exams = RESULTS[key] || RESULTS['default']

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>

      {/* Header */}
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:'1px solid '+b,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>
          Back
        </button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>Career AI</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Find the best exam for you</p>
        </div>
        {!done && (
          <span style={{background:a+'20',color:a,fontSize:12,fontWeight:700,
            padding:'4px 12px',borderRadius:20}}>
            {step+1} / {QUESTIONS.length}
          </span>
        )}
      </div>

      <div style={{padding:'24px 20px',maxWidth:600,margin:'0 auto'}}>

        {!done ? (
          <>
            {/* Progress bar */}
            <div style={{height:4,background:b,borderRadius:4,marginBottom:28,overflow:'hidden'}}>
              <div style={{height:'100%',width:((step+1)/QUESTIONS.length*100)+'%',
                background:'linear-gradient(90deg,'+p+','+a+')',
                borderRadius:4,transition:'width 0.4s ease'}}/>
            </div>

            {/* Question */}
            <p style={{color:m,fontSize:12,fontWeight:600,letterSpacing:'1px',
              textTransform:'uppercase',marginBottom:8}}>
              Question {step+1}
            </p>
            <h2 style={{color:t,fontSize:20,fontWeight:800,margin:'0 0 24px',lineHeight:1.4}}>
              {QUESTIONS[step].q}
            </h2>

            {/* Options */}
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {QUESTIONS[step].opts.map((opt,i) => (
                <button key={i} onClick={()=>pick(i)}
                  style={{background:c,border:'2px solid '+b,borderRadius:16,
                    padding:'16px 20px',textAlign:'left',cursor:'pointer',
                    color:t,fontSize:15,fontWeight:600,
                    transition:'all 0.2s',display:'flex',alignItems:'center',gap:12}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=a;e.currentTarget.style.background=a+'10';e.currentTarget.style.transform='translateX(4px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=b;e.currentTarget.style.background=c;e.currentTarget.style.transform='translateX(0)'}}>
                  <span style={{width:32,height:32,borderRadius:'50%',background:p+'12',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:p,fontWeight:800,fontSize:13,flexShrink:0}}>
                    {String.fromCharCode(65+i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button onClick={()=>{setStep(step-1);setAnswers(answers.slice(0,-1))}}
                style={{marginTop:20,background:'transparent',border:'none',
                  color:m,fontSize:13,cursor:'pointer',padding:'8px 0'}}>
                Back to previous question
              </button>
            )}
          </>
        ) : (
          <>
            {/* Results */}
            <div style={{background:'linear-gradient(135deg,'+p+','+p+'cc)',
              borderRadius:20,padding:'24px',marginBottom:24,textAlign:'center'}}>
              <div style={{fontSize:48,marginBottom:8}}>🎯</div>
              <p style={{color:'#fff',fontWeight:800,fontSize:18,margin:'0 0 6px'}}>
                Your Best Exam Matches
              </p>
              <p style={{color:'rgba(255,255,255,0.7)',fontSize:13,margin:0}}>
                Based on your background and goals
              </p>
            </div>

            {exams.map((exam,i) => (
              <div key={i} style={{background:c,border:'1px solid '+b,borderRadius:16,
                padding:'18px',marginBottom:12,display:'flex',gap:14,alignItems:'center'}}>
                <div style={{fontSize:32,flexShrink:0}}>{exam.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>{exam.name}</p>
                    {i===0 && (
                      <span style={{background:a+'20',color:a,fontSize:9,fontWeight:700,
                        padding:'2px 8px',borderRadius:20}}>BEST MATCH</span>
                    )}
                  </div>
                  <p style={{color:m,fontSize:11,margin:'0 0 8px'}}>{exam.reason}</p>
                  <div style={{height:5,background:b,borderRadius:4,overflow:'hidden'}}>
                    <div style={{height:'100%',width:exam.match+'%',borderRadius:4,
                      background:'linear-gradient(90deg,'+p+','+a+')',
                      transition:'width 1s ease'}}/>
                  </div>
                  <p style={{color:a,fontSize:11,fontWeight:700,margin:'4px 0 0'}}>
                    {exam.match}% match
                  </p>
                </div>
              </div>
            ))}

            <div style={{display:'flex',gap:10,marginTop:20}}>
              <button onClick={()=>{setStep(0);setAnswers([]);setDone(false)}}
                style={{flex:1,background:'transparent',border:'1px solid '+b,
                  borderRadius:14,padding:'12px',color:m,fontWeight:700,fontSize:13,cursor:'pointer'}}>
                Retake Quiz
              </button>
              <button onClick={()=>nav('/student/test')}
                style={{flex:2,background:'linear-gradient(135deg,'+p+','+a+')',
                  border:'none',borderRadius:14,padding:'12px',
                  color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer'}}>
                Start Preparing
              </button>
            </div>
          </>
        )}

        <div style={{height:80}}/>
      </div>
    </div>
  )
}
""")

# ============================================================
# 4. Fix sidebar text visibility in StudentDashboard
# Use Python to avoid encoding corruption
# ============================================================
db_path = 'src/pages/student/StudentDashboard.jsx'
try:
    with open(db_path, 'r', encoding='utf-8') as f:
        db = f.read()

    # Fix muted text color in sidebar - increase from 0.50 to 0.80
    db = db.replace("'rgba(255,255,255,0.50)'", "'rgba(255,255,255,0.85)'")
    db = db.replace('"rgba(255,255,255,0.50)"', '"rgba(255,255,255,0.85)"')
    db = db.replace("'rgba(255,255,255,0.45)'", "'rgba(255,255,255,0.80)'")
    db = db.replace('"rgba(255,255,255,0.45)"', '"rgba(255,255,255,0.80)"')
    db = db.replace("'rgba(255,255,255,0.40)'", "'rgba(255,255,255,0.80)'")
    db = db.replace('"rgba(255,255,255,0.40)"', '"rgba(255,255,255,0.80)"')

    with open(db_path, 'w', encoding='utf-8') as f:
        f.write(db)
    print('OK StudentDashboard sidebar text visibility fixed')
except Exception as e:
    print('ERROR StudentDashboard:', str(e))

print('')
print('ALL DONE!')
print('Now run: npm run build 2>&1 | Select-Object -Last 3')
