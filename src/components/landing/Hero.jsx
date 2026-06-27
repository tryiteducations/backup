// src/components/landing/Hero.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

// ── CSS-only India flag ───────────────────────────────────────────
function Flag({ s = 20 }) {
  const h = Math.round(s * 0.65)
  return (
    <div style={{ display:'flex', flexDirection:'column', width:s, height:h,
      borderRadius:2, overflow:'hidden', flexShrink:0, border:'1px solid rgba(0,0,0,0.14)' }}>
      <div style={{ flex:1, background:'#FF9933' }} />
      <div style={{ flex:1, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:h*0.38, height:h*0.38, borderRadius:'50%', border:'1.5px solid #000080' }} />
      </div>
      <div style={{ flex:1, background:'#138808' }} />
    </div>
  )
}

// ── Animation A — Multicolour Star Burst ─────────────────────────
function AnimA({ a, aL, p, pD }) {
  const [tick, setTick] = useState(0)
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 35); return () => clearInterval(t) }, [])
  const cx = 155, cy = 148
  const SPOKES = [
    { angle:-90,  label:'Kashmir',     d:96,  c:'#60A5FA' },
    { angle:-62,  label:'Uttarakhand', d:86,  c:'#60A5FA' },
    { angle:-118, label:'Punjab',      d:88,  c:'#60A5FA' },
    { angle:-28,  label:'Bihar / WB',  d:100, c:'#FB923C' },
    { angle:-6,   label:'Odisha',      d:92,  c:'#FB923C' },
    { angle:18,   label:'Assam',       d:104, c:'#A78BFA' },
    { angle:50,   label:'Manipur',     d:90,  c:'#A78BFA' },
    { angle:80,   label:'Arunachal',   d:82,  c:'#A78BFA' },
    { angle:116,  label:'Andhra',      d:96,  c:'#4ADE80' },
    { angle:148,  label:'Tamil Nadu',  d:102, c:'#4ADE80' },
    { angle:170,  label:'Kerala',      d:90,  c:'#4ADE80' },
    { angle:-168, label:'Goa',         d:84,  c:'#F472B6' },
    { angle:-142, label:'Gujarat',     d:96,  c:'#F472B6' },
    { angle:-178, label:'Maharashtra', d:88,  c:'#F472B6' },
  ]
  return (
    <svg viewBox="0 0 310 296" style={{ width:'100%', height:'100%' }}>
      <defs>
        <filter id="haF">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {[['#60A5FA',-150,-30],['#FB923C',-20,30],['#A78BFA',30,90],['#4ADE80',100,180],['#F472B6',160,220]].map(([c,s,e],i) => {
        const r=118, sr=(s*Math.PI)/180, er=(e*Math.PI)/180
        return <path key={i} d={`M ${cx+Math.cos(sr)*r} ${cy+Math.sin(sr)*r} A ${r} ${r} 0 0 1 ${cx+Math.cos(er)*r} ${cy+Math.sin(er)*r}`}
          fill="none" stroke={c} strokeWidth={1.5} opacity={0.28} strokeLinecap="round"/>
      })}
      {SPOKES.map((s, i) => {
        const rad=(s.angle*Math.PI)/180, ex=cx+Math.cos(rad)*s.d, ey=cy+Math.sin(rad)*s.d
        const pct=((tick*(0.75+(i%4)*0.12)*0.014+i*0.071)%1)
        const lx=cx+Math.cos(rad)*s.d*pct, ly=cy+Math.sin(rad)*s.d*pct
        const pulse=Math.sin((tick*0.055)+i*0.45)>0.55
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={`${s.c}25`} strokeWidth={1.5}/>
            <circle cx={lx} cy={ly} r={2.8} fill={s.c} filter="url(#haF)" opacity={0.95}/>
            <circle cx={ex} cy={ey} r={pulse?5.5:3.2} fill={s.c} opacity={pulse?1:0.5}
              filter={pulse?'url(#haF)':undefined} style={{ transition:'all 0.28s' }}/>
            <text x={ex+Math.cos(rad)*10} y={ey+Math.sin(rad)*10+3} fontSize={7.5}
              fill={`${s.c}ff`} fontWeight="700" fontFamily="Poppins,sans-serif"
              textAnchor={s.angle>-80&&s.angle<80?'start':s.angle>100||s.angle<-100?'end':'middle'}>
              {s.label}
            </text>
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={30} fill={`${a}18`} stroke={`${a}45`} strokeWidth={1.5} filter="url(#haF)"/>
      <circle cx={cx} cy={cy} r={11} fill={a}/>
      <text x={cx} y={cy+41} fontSize={8.5} fill="rgba(255,255,255,0.78)" fontWeight="900"
        textAnchor="middle" fontFamily="Poppins,sans-serif">Bharat · Every Direction</text>
    </svg>
  )
}

// ── Animation B — Wheel Rings ─────────────────────────────────────
function AnimB({ a, aL, p, pD }) {
  const [angle, setAngle] = useState(0)
  useEffect(() => { const t = setInterval(() => setAngle(x => (x + 0.9) % 360), 25); return () => clearInterval(t) }, [])
  const cx = 155, cy = 148
  const RINGS = [
    { r:40,  color:'#60A5FA', spd:1.1,  states:['Kashmir','Punjab','HP','Delhi','Uttarakhand'] },
    { r:72,  color:a,         spd:0.72, states:['UP','MP','Rajasthan','Bihar','Gujarat','Maharashtra'] },
    { r:104, color:'#4ADE80', spd:0.52, states:['TN','Kerala','Karnataka','AP','Telangana','Odisha','WB'] },
    { r:130, color:'#F472B6', spd:1.25, states:['Assam','Manipur','Arunachal','Meghalaya','Nagaland'] },
  ]
  return (
    <svg viewBox="0 0 310 296" style={{ width:'100%', height:'100%' }}>
      <defs>
        <filter id="hbF">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {RINGS.map((ring, ri) => {
        const litA = (angle * ring.spd + ri * 90) % 360
        return (
          <g key={ri}>
            <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={`${ring.color}12`} strokeWidth={ring.r<55?20:15}/>
            <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={`${ring.color}30`} strokeWidth={1}/>
            <circle cx={cx+Math.cos((litA*Math.PI)/180)*ring.r} cy={cy+Math.sin((litA*Math.PI)/180)*ring.r}
              r={6.5} fill={ring.color} filter="url(#hbF)"/>
            {[-14,-28,-42].map((off,ti) => {
              const ta=((litA+off)*Math.PI)/180
              return <circle key={ti} cx={cx+Math.cos(ta)*ring.r} cy={cy+Math.sin(ta)*ring.r}
                r={3.5-ti*0.8} fill={ring.color} opacity={0.28-ti*0.07}/>
            })}
            {ring.states.map((state, si) => {
              const sa=(si/ring.states.length)*360, srad=(sa*Math.PI)/180
              const sx=cx+Math.cos(srad)*ring.r, sy=cy+Math.sin(srad)*ring.r
              const diff=Math.min(Math.abs(sa-litA),360-Math.abs(sa-litA)), near=diff<26
              return (
                <g key={si}>
                  <circle cx={sx} cy={sy} r={near?5.5:2.8} fill={near?ring.color:`${ring.color}44`}
                    filter={near?'url(#hbF)':undefined} style={{ transition:'all 0.2s' }}/>
                  {near && <text x={sx+Math.cos(srad)*12} y={sy+Math.sin(srad)*12+3} fontSize={7.5}
                    fill="rgba(255,255,255,0.95)" fontWeight="800" fontFamily="Poppins,sans-serif"
                    textAnchor="middle">{state}</text>}
                </g>
              )
            })}
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={22} fill={`${a}20`} stroke={a} strokeWidth={1.5} filter="url(#hbF)"/>
      <circle cx={cx} cy={cy} r={8} fill={a}/>
      <text x={cx} y={cy+32} fontSize={8.5} fill={a} fontWeight="900"
        textAnchor="middle" fontFamily="Poppins,sans-serif">Connecting India</text>
    </svg>
  )
}

// ── Animation D — Bharat Pulse (India tricolour) ──────────────────
function AnimD() {
  const [waves, setWaves] = useState([])
  const [tick, setTick] = useState(0)
  const wId = useRef(0)
  const TC = ['#FF9933','#ffffff','#138808']
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 28); return () => clearInterval(t) }, [])
  useEffect(() => {
    const t = setInterval(() => {
      const id = wId.current, color = TC[id % 3]; wId.current++
      setWaves(p => [...p.slice(-9), { id, r:0, color }])
    }, 680)
    return () => clearInterval(t)
  }, [])
  useEffect(() => { setWaves(p => p.map(w => ({ ...w, r:w.r+1.7 })).filter(w => w.r < 148)) }, [tick])
  const cx = 155, cy = 148
  const STATES = [
    { label:'Kashmir',      r:26,  a:-90  }, { label:'Punjab',      r:50,  a:-120 },
    { label:'Rajasthan',    r:70,  a:-152 }, { label:'Gujarat',     r:83,  a:163  },
    { label:'UP',           r:56,  a:-54  }, { label:'Bihar',       r:78,  a:-26  },
    { label:'MP',           r:68,  a:-180 }, { label:'WB',          r:93,  a:-9   },
    { label:'Assam',        r:108, a:17   }, { label:'Maharashtra', r:86,  a:148  },
    { label:'AP',           r:98,  a:114  }, { label:'TN',          r:116, a:141  },
    { label:'Kerala',       r:106, a:162  }, { label:'Karnataka',   r:92,  a:130  },
    { label:'Arunachal',    r:128, a:41   }, { label:'Manipur',     r:116, a:61   },
    { label:'Odisha',       r:98,  a:79   }, { label:'Chhattisgarh',r:78,  a:99   },
  ]
  return (
    <svg viewBox="0 0 310 296" style={{ width:'100%', height:'100%' }}>
      <defs>
        <filter id="hdF">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {waves.map(w => (
        <g key={w.id}>
          <circle cx={cx} cy={cy} r={w.r} fill="none" stroke={w.color}
            strokeWidth={Math.max(0.3,5-w.r*0.033)} opacity={Math.max(0,0.11-w.r*0.0007)} filter="url(#hdF)"/>
          <circle cx={cx} cy={cy} r={w.r} fill="none" stroke={w.color}
            strokeWidth={Math.max(0.3,1.8-w.r*0.012)} opacity={Math.max(0,0.75-w.r*0.005)}/>
        </g>
      ))}
      {STATES.map((s, i) => {
        const rad=(s.a*Math.PI)/180, sx=cx+Math.cos(rad)*s.r, sy=cy+Math.sin(rad)*s.r
        const hw=waves.find(w=>Math.abs(w.r-s.r)<8), nw=waves.find(w=>Math.abs(w.r-s.r)<22)
        const dc=hw?.color||nw?.color||'rgba(255,255,255,0.3)'
        return (
          <g key={i}>
            {hw && <circle cx={sx} cy={sy} r={11} fill="none" stroke={hw.color} strokeWidth={1} opacity={0.38} filter="url(#hdF)"/>}
            <circle cx={sx} cy={sy} r={hw?5.5:nw?3.5:2}
              fill={hw?dc:nw?`${dc}77`:'rgba(255,255,255,0.18)'}
              filter={hw?'url(#hdF)':undefined} style={{ transition:'all 0.12s' }}/>
            {hw && <text x={sx+Math.cos(rad)*12} y={sy+Math.sin(rad)*12+3} fontSize={7.5}
              fill={hw.color==="#ffffff"?'rgba(255,255,255,1)':hw.color}
              fontWeight="700" fontFamily="Poppins,sans-serif"
              textAnchor={Math.cos(rad)>0.2?'start':Math.cos(rad)<-0.2?'end':'middle'}>{s.label}</text>}
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={30} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth={1}/>
      <circle cx={cx} cy={cy} r={22} fill="#FF9933" opacity={0.2}/>
      <circle cx={cx} cy={cy} r={17} fill="#ffffff" opacity={0.12}/>
      <circle cx={cx} cy={cy} r={12} fill="#138808" opacity={0.2}/>
      <circle cx={cx} cy={cy} r={8}  fill="#ffffff" opacity={1} filter="url(#hdF)"/>
      <circle cx={cx} cy={cy} r={2.5} fill="#000080"/>
      <text x={cx} y={cy-40} fontSize={8.5} fill="rgba(255,255,255,0.88)" fontWeight="900"
        textAnchor="middle" fontFamily="Poppins,sans-serif">Bharat Pulse</text>
    </svg>
  )
}

// ── Hero scripts ──────────────────────────────────────────────────
const HEROES = [
  {
    badge:'Built for Every Indian. In Every Language. At Every Age.',
    lines:['Your Dream Doesn\'t','Speak English Only.','Neither Do We.'], ai:1,
    sub:'The student from Manipur and the student from Chennai deserve the same shot at NEET, JEE, UPSC — in their own language, explained by a verified expert from their own region. No coaching fees. No YouTube rabbit holes. No stranger fear.',
    cta1:'Start Your Journey Free →', cta2:'See If You Qualify for Free Access',
  },
  {
    badge:'India\'s Exam Platform — Built for 140 Crore Dreams',
    lines:['Bharat Produced','The World\'s Brightest.','Now It\'s Your Turn.'], ai:0,
    sub:'From Kashmir to Kanyakumari — one platform, 1,10,000+ exams, 42+ languages, real All-India rankings after every test. No coaching fee. No fear. Your mentor, your hall, your All-India rank — all here.',
    cta1:'Claim Your All-India Rank →', cta2:'See Where You Stand — Free',
  },
  {
    badge:'One Subscription. Two Students Study. Infinite Impact.',
    lines:['Stop Watching.','Start Ranking.','Start Winning.'], ai:2,
    sub:'No YouTube. No coaching fee. When you subscribe — a student who cannot afford to, studies free alongside you. Topic-wise tests. Mentors in your language. Hall battles. Live rankings. Your one plan sponsors another Indian future.',
    cta1:'Start Free — No Card Needed →', cta2:'My Plan Funds Another Student',
  },
]

// ── Hero ──────────────────────────────────────────────────────────
export default function Hero() {
  // ── 4-Theme Cycle System ─────────────────────────────────────
  const CYCLES = [
    {
      id: 'jasmine',
      bg: '#F8FAFF', primary: '#1E3A5F', accent: '#2563EB',
      surface: '#FFFFFF', text: '#111827',
      hero: 'Your Exam. Your Rank. Your Success.',
      sub: 'India\'s only platform from Class 1 to SWAYAM',
      label: '🌸 Jasmine at Dawn',
      particleColor: '#2563EB',
      motionType: 'dots',
    },
    {
      id: 'ganges',
      bg: '#030712', primary: '#0D9488', accent: '#14B8A6',
      surface: '#0F172A', text: '#F1F5F9',
      hero: 'Study at Midnight. Rank at Dawn.',
      sub: '42 languages. 1,10,000+ exams. Zero excuses.',
      label: '🌙 Midnight Ganges',
      particleColor: '#14B8A6',
      motionType: 'sparks',
    },
    {
      id: 'lotus',
      bg: '#FFF0F6', primary: '#BE185D', accent: '#EC4899',
      surface: '#FFFFFF', text: '#111827',
      hero: 'Every Dream Deserves a Rank.',
      sub: 'Free for 11 communities. 1 Subscription = 1 Scholarship.',
      label: '🪷 Lotus in Bloom',
      particleColor: '#EC4899',
      motionType: 'petals',
    },
    {
      id: 'saffron',
      bg: '#FFFBEB', primary: '#B45309', accent: '#F59E0B',
      surface: '#FFFFFF', text: '#111827',
      hero: 'Rise with the Sun. Rise in Rank.',
      sub: 'Free tournaments. No ads. No telecalling. Just results.',
      label: '☀️ Saffron Sunrise',
      particleColor: '#F59E0B',
      motionType: 'rays',
    },
  ]
  const CYCLE_DURATION = 20000
  const [cycleIdx, setCycleIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [heroText, setHeroText] = useState(CYCLES[0].hero)
  const [textVisible, setTextVisible] = useState(true)
  const [particles, setParticles] = useState([])
  const cycleRef = useRef(null)
  const progressRef = useRef(null)
  const C = CYCLES[cycleIdx]

  // Particle generator
  const genParticles = useCallback((type, color) => {
    const count = type === 'sparks' ? 18 : type === 'rays' ? 12 : 15
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.3,
      color,
      delay: Math.random() * 3,
    }))
  }, [])

  useEffect(() => {
    setParticles(genParticles(CYCLES[0].motionType, CYCLES[0].particleColor))
  }, [])

  // Progress bar
  useEffect(() => {
    let start = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress((elapsed / CYCLE_DURATION) * 100)
    }, 50)
    return () => clearInterval(progressRef.current)
  }, [cycleIdx])

  // Cycle timer
  useEffect(() => {
    cycleRef.current = setInterval(() => {
      setTextVisible(false)
      setTimeout(() => {
        setCycleIdx(prev => {
          const next = (prev + 1) % CYCLES.length
          setHeroText(CYCLES[next].hero)
          setParticles(genParticles(CYCLES[next].motionType, CYCLES[next].particleColor))
          setProgress(0)
          return next
        })
        setTimeout(() => setTextVisible(true), 100)
      }, 600)
    }, CYCLE_DURATION)
    return () => clearInterval(cycleRef.current)
  }, [])

  const navigate = useNavigate()
  const { theme } = useTheme()

  const isDark   = theme?.isDark   ?? false
  const accent   = theme?.accent   ?? '#C9A84C'
  const accentL  = theme?.accentLight ?? '#E8C44A'
  const primary  = theme?.primary  ?? '#1E3A5F'
  const primDark = theme?.primaryDark ?? '#0F2140'

  const [hi,   setHi]   = useState(0)
  const [htick, setHtick] = useState(0)
  const [fade,  setFade]  = useState(true)

  // Rotate every 20 s
  useEffect(() => {
    const iv = setInterval(() => {
      setHtick(p => {
        if (p >= 19) {
          setFade(false)
          setTimeout(() => { setHi(i => (i + 1) % 3); setFade(true); setHtick(0) }, 300)
          return 0
        }
        return p + 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [hi])

  const hero = HEROES[hi]

  const bg = isDark
    ? `radial-gradient(ellipse 70% 55% at 15% 50%,${primary}55,transparent),radial-gradient(ellipse 50% 70% at 85% 20%,${primDark}44,transparent),var(--color-bg,#0F172A)`
    : `radial-gradient(ellipse 60% 50% at 15% 50%,${accent}18,transparent),var(--color-bg,#F8FAFC)`

  const mutedCol = isDark ? 'rgba(255,255,255,0.56)' : 'var(--color-muted,#64748B)'
  const textCol  = isDark ? '#ffffff' : 'var(--color-text,#0F1020)'

  return (
    <section style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      padding:'80px clamp(16px,4vw,40px)', position:'relative', overflow:'hidden',
      background:bg, transition:'background 0.4s' }}>

      <style>{`
        @keyframes tryit-ring{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5}50%{transform:translate(-50%,-50%) scale(1.07);opacity:0.12}}
        @keyframes tryit-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
      `}</style>

      {/* Decorative rings — dark mode only */}
      {isDark && [380,620,860].map((s,i) => (
        <div key={i} style={{ position:'absolute', width:s, height:s, borderRadius:'50%',
          border:`1px solid ${accent}${i===0?'18':i===1?'0E':'07'}`,
          top:'50%', left:'38%', transform:'translate(-50%,-50%)',
          animation:`tryit-ring ${4+i*1.4}s ease-in-out ${i*0.5}s infinite`,
          pointerEvents:'none' }}/>
      ))}

      <div style={{ maxWidth:1140, margin:'0 auto', width:'100%', position:'relative', zIndex:2,
        display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,400px),1fr))',
        gap:'clamp(24px,4vw,56px)', alignItems:'center' }}>

        {/* ── LEFT: rotating text ── */}
        <div style={{ opacity:fade?1:0, transform:fade?'translateY(0)':'translateY(10px)',
          transition:'opacity 0.3s, transform 0.3s' }}>

          {/* Progress dots */}
          <div style={{ display:'flex', gap:8, marginBottom:24 }}>
            {HEROES.map((_,i) => (
              <div key={i}
                onClick={() => { setFade(false); setTimeout(() => { setHi(i); setFade(true); setHtick(0) }, 200) }}
                style={{ position:'relative', width:i===hi?56:10, height:5, borderRadius:3,
                  background:i===hi?`${accent}30`:(isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.12)'),
                  cursor:'pointer', overflow:'hidden', transition:'width 0.3s' }}>
                {i===hi && <div style={{ position:'absolute', top:0, left:0, height:'100%',
                  borderRadius:3, background:accent, width:`${(htick/20)*100}%`,
                  transition:'width 1s linear' }}/>}
              </div>
            ))}
          </div>

          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8,
            background:`${accent}14`, border:`1px solid ${accent}30`,
            borderRadius:30, padding:'6px 16px', marginBottom:20 }}>
            <Flag s={22}/>
            <div style={{ width:5, height:5, borderRadius:'50%', background:accent,
              animation:'tryit-pulse 2s infinite' }}/>
            <span style={{ color:accent, fontSize:11, fontWeight:700, letterSpacing:'0.4px',
              fontFamily:'Inter,sans-serif' }}>{hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(32px,5vw,62px)', lineHeight:1.06, marginBottom:16 }}>
            {hero.lines.map((line, i) => (
              <span key={i} style={{ display:'block',
                color: i===hero.ai ? accent : textCol,
                textShadow: i===hero.ai && isDark ? `0 0 40px ${accent}44` : 'none' }}>
                {line}
              </span>
            ))}
          </h1>

          <p style={{ color:mutedCol, fontSize:'clamp(12px,1.5vw,15px)', lineHeight:1.85,
            maxWidth:480, marginBottom:28, fontFamily:'Inter,sans-serif' }}>
            {hero.sub}
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:22 }}>
            <button onClick={() => navigate('/register')}
              style={{ background:`linear-gradient(135deg,${accent},${accentL})`,
                border:'none', borderRadius:16, padding:'14px 28px',
                fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:15,
                color:primDark, cursor:'pointer',
                boxShadow:`0 8px 26px ${accent}50` }}>
              {hero.cta1}
            </button>
            <button onClick={() => navigate('/login')}
              style={{ background:isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)',
                border:`1px solid ${isDark?'rgba(255,255,255,0.14)':'rgba(0,0,0,0.10)'}`,
                borderRadius:16, padding:'14px 22px',
                fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13,
                color:textCol, cursor:'pointer' }}>
              {hero.cta2}
            </button>
          </div>

          {/* Trust pills */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['🔒 Safe & Private','🌐 42+ Languages','🏆 Real Rankings',
              '📱 Works on 2G','📚 Class 6 to PhD','🚫 No YouTube Needed'].map(b => (
              <span key={b} style={{ background:isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)',
                border:`1px solid ${isDark?'rgba(255,255,255,0.09)':'rgba(0,0,0,0.08)'}`,
                borderRadius:20, padding:'4px 11px', color:mutedCol, fontSize:10,
                fontFamily:'Inter,sans-serif' }}>{b}</span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: animation on dark glass canvas ── */}
        <div style={{ height:'clamp(280px,44vw,460px)', display:'flex',
          alignItems:'center', justifyContent:'center' }}>
          <div style={{
            position:'relative', width:'100%', height:'100%',
            background: isDark ? 'transparent'
              : `linear-gradient(135deg,${primary}ee,${primDark}dd)`,
            borderRadius: isDark ? 0 : 28,
            boxShadow: isDark ? 'none'
              : `0 20px 60px ${primary}30, 0 0 0 1px ${accent}18`,
            overflow:'hidden',
            opacity:fade?1:0, transition:'opacity 0.35s',
          }}>
            {!isDark && (
              <div style={{ position:'absolute', inset:0, borderRadius:28, pointerEvents:'none',
                background:`radial-gradient(ellipse 70% 60% at 50% 50%,${accent}10,transparent)` }}/>
            )}
            {hi===0 && <AnimA a={accent} aL={accentL} p={primary} pD={primDark}/>}
            {hi===1 && <AnimB a={accent} aL={accentL} p={primary} pD={primDark}/>}
            {hi===2 && <AnimD/>}
          </div>
        </div>

      </div>
    </section>
  )
}
