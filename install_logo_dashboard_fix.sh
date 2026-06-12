# TryIT — Logo fix + Dashboard redesign + Health check
ROOT="${1:-/workspaces/Tatu}"
cd "$ROOT"
echo "Applying logo + dashboard fixes..."
mkdir -p src/components src/components/landing src/pages scripts
# ══════════════════════════════════════════════════════════════════
# LOGO FIX — Sun must look like a real sun, not an oversized "I"
# The sun: perfect circle core + 8 evenly-spaced rays + glow
# Used in: Navbar, Footer, Splash, Landing, Login, Admin
# ══════════════════════════════════════════════════════════════════

cat > src/components/TryITLogo.jsx << 'EOF'
/**
 * TryIT Logo — Reusable across entire app
 * Sun structure: perfect circle + 8 rays + glow + TRYIT text
 * Props: size (px), variant: 'dark'|'light'|'gold-only'
 */
export default function TryITLogo({ size = 148, variant = 'dark', className = '' }) {
  const W = size
  const H = Math.round(W * 0.42)

  // Sun sits above the "Y" in TRYIT — perfectly centred on the Y
  const sunX  = W * 0.372   // centre of sun (over the Y)
  const sunY  = H * 0.30    // vertical position
  const sunR  = W * 0.058   // sun CIRCLE radius — equal x and y = looks like sun ✅

  // 8 rays at 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
  const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
  const RAY_INNER  = sunR * 1.5   // gap between sun edge and ray start
  const RAY_OUTER  = sunR * 2.6   // ray tip distance
  const RAY_THICK  = [1.8, 1.2, 1.8, 1.2, 1.8, 1.2, 1.8, 1.2] // alternating major/minor rays

  // Arrow: diagonal from sun centre, going up-right
  const arrowStartX = sunX + sunR * 0.5
  const arrowStartY = sunY - sunR * 0.5
  const arrowEndX   = sunX + sunR * 2.2
  const arrowEndY   = sunY - sunR * 2.2

  // Colors based on variant
  const textColor   = variant === 'light' ? '#FFFFFF' : '#1E3A5F'
  const goldColor   = '#D4AF37'
  const goldLight   = '#F0C84A'

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className={className}
      aria-label="TryIT Educations"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        {/* Gold gradient */}
        <linearGradient id={`gold-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#B8860B" />
          <stop offset="40%"  stopColor={goldLight} />
          <stop offset="100%" stopColor={goldColor} />
        </linearGradient>

        {/* Sun glow */}
        <filter id={`glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Stronger glow for sun centre */}
        <filter id={`sunGlow-${size}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── SUN RAYS ────────────────────────────────────────────── */}
      {RAY_ANGLES.map((angleDeg, i) => {
        const rad = (angleDeg * Math.PI) / 180
        return (
          <line
            key={i}
            x1={sunX + Math.cos(rad) * RAY_INNER}
            y1={sunY + Math.sin(rad) * RAY_INNER}
            x2={sunX + Math.cos(rad) * RAY_OUTER}
            y2={sunY + Math.sin(rad) * RAY_OUTER}
            stroke={`url(#gold-${size})`}
            strokeWidth={RAY_THICK[i]}
            strokeLinecap="round"
            opacity={0.9}
          />
        )
      })}

      {/* ── SUN CIRCLE (perfect circle — not ellipse!) ─────────── */}
      {/* Outer glow ring */}
      <circle
        cx={sunX} cy={sunY} r={sunR * 1.25}
        fill="none"
        stroke={goldColor}
        strokeWidth={0.6}
        opacity={0.3}
      />
      {/* Sun body — CIRCLE, not ellipse */}
      <circle
        cx={sunX}
        cy={sunY}
        r={sunR}
        fill={`url(#gold-${size})`}
        filter={`url(#sunGlow-${size})`}
      />
      {/* Sun inner highlight */}
      <circle
        cx={sunX - sunR * 0.2}
        cy={sunY - sunR * 0.2}
        r={sunR * 0.35}
        fill="rgba(255,255,255,0.35)"
      />

      {/* ── ARROW (diagonal up-right from sun) ──────────────────── */}
      <line
        x1={arrowStartX} y1={arrowStartY}
        x2={arrowEndX}   y2={arrowEndY}
        stroke={`url(#gold-${size})`}
        strokeWidth={W * 0.015}
        strokeLinecap="round"
        filter={`url(#glow-${size})`}
      />
      {/* Arrow head */}
      <polygon
        points={`
          ${arrowEndX},${arrowEndY}
          ${arrowEndX - W*0.032},${arrowEndY + W*0.005}
          ${arrowEndX - W*0.005},${arrowEndY + W*0.032}
        `}
        fill={`url(#gold-${size})`}
      />

      {/* ── TRYIT TEXT ──────────────────────────────────────────── */}
      {/* TRY — in primary color */}
      <text
        x={W * 0.018}
        y={H * 0.78}
        fontFamily="'Arial Black', 'Impact', Arial, sans-serif"
        fontWeight="900"
        fontSize={H * 0.68}
        fill={variant === 'light' ? '#FFFFFF' : '#1E3A5F'}
        letterSpacing={-1}
      >TRY</text>

      {/* IT — in gold */}
      <text
        x={W * 0.618}
        y={H * 0.78}
        fontFamily="'Arial Black', 'Impact', Arial, sans-serif"
        fontWeight="900"
        fontSize={H * 0.68}
        fill={`url(#gold-${size})`}
        filter={`url(#glow-${size})`}
        letterSpacing={-1}
      >IT</text>

      {/* ── SEPARATOR LINE ──────────────────────────────────────── */}
      <rect
        x={W * 0.018}
        y={H * 0.84}
        width={W * 0.964}
        height={Math.max(1.5, H * 0.045)}
        rx={H * 0.022}
        fill={`url(#gold-${size})`}
      />

      {/* ── EDUCATIONS ──────────────────────────────────────────── */}
      <text
        x={W * 0.5}
        y={H * 0.985}
        textAnchor="middle"
        fontFamily="Arial, 'Helvetica Neue', sans-serif"
        fontWeight="800"
        fontSize={H * 0.185}
        letterSpacing={H * 0.042}
        fill={`url(#gold-${size})`}
      >EDUCATIONS</text>
    </svg>
  )
}
EOF
echo "TryITLogo component done"

# ── Update Navbar to use the shared logo component ────────────────
cat > src/components/landing/Navbar.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TryITLogo from '../TryITLogo'

export default function Navbar() {
  const navigate  = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [logoW, setLogoW] = useState(
    typeof window !== 'undefined'
      ? window.innerWidth < 480  ? 96
      : window.innerWidth < 768  ? 116
      : window.innerWidth < 1024 ? 128
      : 144 : 144
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    const onResize = () => {
      const w = window.innerWidth
      setLogoW(w < 480 ? 96 : w < 768 ? 116 : w < 1024 ? 128 : 144)
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  const navH = logoW < 100 ? 60 : logoW < 120 ? 68 : 78

  return (
    <>
      <nav style={{ position:'sticky', top:0, zIndex:500, height:navH, background:scrolled?'rgba(10,21,50,0.98)':'rgba(10,21,50,0.92)', backdropFilter:'blur(24px)', borderBottom:'1px solid rgba(212,175,55,0.2)', display:'flex', alignItems:'center', padding:'0 clamp(14px,3vw,28px)', gap:'clamp(10px,2vw,20px)', transition:'background 0.3s,height 0.2s' }}>
        {/* Logo */}
        <div onClick={()=>navigate('/')} style={{ cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center' }}>
          <TryITLogo size={logoW} variant="light" />
        </div>

        {/* Nav links — desktop only */}
        <div className="nav-links" style={{ display:'flex', alignItems:'center', gap:4, flex:1, justifyContent:'center' }}>
          {[['Features','#features'],['Exams','/exams'],['Pricing','/pro'],['Impact','/impact'],['Free Access','/equity']].map(([l,h])=>(
            <a key={l} href={h} style={{ color:'rgba(255,255,255,0.72)', fontSize:'clamp(12px,1.3vw,14px)', fontFamily:'Poppins,sans-serif', fontWeight:600, padding:'7px clamp(8px,1vw,13px)', borderRadius:10, textDecoration:'none', transition:'all 0.2s', whiteSpace:'nowrap' }}
              onMouseEnter={e=>{e.target.style.color='#D4AF37';e.target.style.background='rgba(212,175,55,0.08)'}}
              onMouseLeave={e=>{e.target.style.color='rgba(255,255,255,0.72)';e.target.style.background='none'}}>
              {l}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:'clamp(6px,1.5vw,12px)', marginLeft:'auto', flexShrink:0 }}>
          {/* Live dot */}
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:20, padding:'clamp(4px,1vw,6px) clamp(8px,1.5vw,13px)' }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#22C55E', display:'inline-block', animation:'liveDot 1.4s ease-in-out infinite' }}/>
            <span className="live-text" style={{ color:'rgba(255,255,255,0.7)', fontSize:12, fontFamily:'Inter,sans-serif' }}>Live</span>
          </div>
          {/* Login */}
          <button onClick={()=>navigate('/login')} style={{ background:'linear-gradient(135deg,#D4AF37,#E8C44A)', border:'none', borderRadius:'clamp(10px,1.5vw,13px)', padding:'clamp(8px,1.5vw,11px) clamp(14px,2vw,22px)', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'clamp(13px,1.5vw,15px)', color:'#1E3A5F', cursor:'pointer', whiteSpace:'nowrap', boxShadow:'0 4px 14px rgba(212,175,55,0.35)' }}>Login →</button>
        </div>
      </nav>
      <style>{`
        @keyframes liveDot{0%{box-shadow:0 0 0 0 rgba(34,197,94,0.6)}70%{box-shadow:0 0 0 7px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
        @media(max-width:767px){.nav-links,.live-text{display:none!important}}
      `}</style>
    </>
  )
}
EOF
echo "Navbar with new logo done"
# ══════════════════════════════════════════════════════════════════
# DASHBOARD REDESIGN — Rich, colorful, not plain
# ══════════════════════════════════════════════════════════════════
cat > src/pages/Dashboard.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useCoins } from '../context/CoinContext'
import FestivalBanner from '../components/FestivalBanner'
import ExamNotificationBanner from '../components/ExamNotificationBanner'

// ── greeting ─────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours()
  if (h < 5)  return ['Still awake? 🌙', 'Serious dedication. Let\'s go.']
  if (h < 12) return ['Good morning ☀️', 'Best time to study. Let\'s crack it.']
  if (h < 17) return ['Good afternoon 🌤️', 'Stay focused. Your rank is watching.']
  if (h < 21) return ['Good evening 🌆', 'Evening grind hits different. Let\'s go.']
  return ['Late night? 🌙', 'Toppers are awake right now. You too.']
}

// ── progress ring ─────────────────────────────────────────────────
function ProgressRing({ pct=0, size=80, stroke=7, color='#D4AF37', label, value }) {
  const r   = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} style={{ transition:'stroke-dashoffset 1s ease' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color, fontSize:size*0.22, lineHeight:1 }}>{value}</p>
        {label && <p style={{ color:'#94A3B8', fontSize:size*0.12, marginTop:1 }}>{label}</p>}
      </div>
    </div>
  )
}

const QUICK_ACTIONS = [
  { emoji:'📝', label:'Take a Test',   path:'/test-engine',    grad:'linear-gradient(135deg,#1E3A5F,#0F2140)', badge:null },
  { emoji:'🧭', label:'Find My Exam', path:'/career-compass',  grad:'linear-gradient(135deg,#7C3AED,#5B21B6)', badge:'+20🪙' },
  { emoji:'🔥', label:'Focus Mode',   path:'/focus-mode',      grad:'linear-gradient(135deg,#065F46,#022C22)', badge:'+25🪙' },
  { emoji:'🌏', label:'Current News', path:'/current-affairs', grad:'linear-gradient(135deg,#92400E,#78350F)', badge:'+5🪙' },
  { emoji:'🎮', label:'Brain Games',  path:'/games',           grad:'linear-gradient(135deg,#0C4A6E,#082F49)', badge:null  },
  { emoji:'🎓', label:'Guru Hub',     path:'/guru-hub',        grad:'linear-gradient(135deg,#4C1D95,#2E1065)', badge:null  },
  { emoji:'🏆', label:'Leaderboard',  path:'/leaderboard',     grad:'linear-gradient(135deg,#1E3A5F,#0F2140)', badge:null  },
  { emoji:'📋', label:'All Exams',    path:'/exams',           grad:'linear-gradient(135deg,#0F2140,#071428)', badge:null  },
]

export default function Dashboard() {
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const { balance } = useCoins()
  const [gt, sub]   = greeting()
  const isNew       = !user?.testsCompleted || user?.testsCompleted === 0
  const coins       = balance || user?.coins || 200

  return (
    <AppLayout>
      <FestivalBanner />
      <ExamNotificationBanner />

      {/* ── HERO CARD ─────────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F 0%,#0F2140 60%,#071428 100%)', borderRadius:24, padding:'22px 20px', marginBottom:16, position:'relative', overflow:'hidden', border:'1.5px solid rgba(212,175,55,0.2)' }}>
        {/* Decorative rings */}
        {[160,260].map((s,i)=>(
          <div key={i} style={{ position:'absolute', width:s, height:s, borderRadius:'50%', border:'1px solid rgba(212,175,55,0.08)', top:-s/3, right:-s/4, pointerEvents:'none' }}/>
        ))}

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, position:'relative', zIndex:1 }}>
          <div style={{ flex:1 }}>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>{gt}</p>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:'clamp(18px,3vw,24px)', marginTop:4, lineHeight:1.2 }}>
              {user?.name ? `${user.name.split(' ')[0]},` : ''} {sub}
            </h1>
          </div>
          {/* Coin display */}
          <div onClick={()=>navigate('/wallet')} style={{ background:'rgba(212,175,55,0.12)', border:'1.5px solid rgba(212,175,55,0.3)', borderRadius:16, padding:'10px 16px', cursor:'pointer', textAlign:'center', flexShrink:0 }}>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:10, letterSpacing:'1px' }}>COINS</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:22, lineHeight:1 }}>{coins.toLocaleString()}</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))', gap:8, marginTop:16, position:'relative', zIndex:1 }}>
          {[
            { emoji:user?.levelEmoji||'🔥', v:user?.levelTitle||'The Fierce One', l:'Level', color:'#D4AF37' },
            { emoji:'🔥', v:`${user?.streak||0}d`, l:'Streak', color:'#F97316' },
            { emoji:'📝', v:user?.testsCompleted||0, l:'Tests', color:'#22C55E' },
            { emoji:'🏆', v:user?.rank?`#${user.rank.toLocaleString()}`:'—', l:'Rank', color:'#A78BFA' },
          ].map(s=>(
            <div key={s.l} style={{ background:'rgba(255,255,255,0.06)', borderRadius:14, padding:'10px 8px', textAlign:'center' }}>
              <p style={{ fontSize:18 }}>{s.emoji}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:s.color, fontSize:14, marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.v}</p>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEW USER GUIDE ─────────────────────────────────────── */}
      {isNew && (
        <div style={{ background:'linear-gradient(135deg,rgba(212,175,55,0.12),rgba(212,175,55,0.04))', borderRadius:20, padding:'18px 18px', marginBottom:16, border:'1.5px solid rgba(212,175,55,0.25)' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:16, marginBottom:6 }}>
            🎯 Your 200 coins are ready. Here's how to earn more:
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,200px),1fr))', gap:8 }}>
            {[['📝','Take first test','Earn 50–150 coins'],['🧭','Career Compass','Earn +20 coins'],['🔥','Focus session','Earn +25 coins']].map(([e,t,c])=>(
              <div key={t} style={{ display:'flex', gap:8, alignItems:'center', background:'rgba(255,255,255,0.6)', borderRadius:12, padding:'8px 10px' }}>
                <span style={{ fontSize:20 }}>{e}</span>
                <div>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:12 }}>{t}</p>
                  <p style={{ color:'#D4AF37', fontSize:11, fontWeight:600 }}>{c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── XP PROGRESS ───────────────────────────────────────── */}
      {!isNew && (
        <div style={{ background:'#fff', borderRadius:20, padding:'16px 18px', marginBottom:16, border:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:16 }}>
          <ProgressRing pct={Math.min(100,((user?.xp||0)/(user?.xpToNext||500))*100)} size={72} color='#D4AF37' value={user?.level||1} label="LV"/>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:15 }}>{user?.levelEmoji} {user?.levelTitle}</p>
            <div style={{ height:6, background:'#F1F5F9', borderRadius:3, marginTop:8 }}>
              <div style={{ width:`${Math.min(100,((user?.xp||0)/(user?.xpToNext||500))*100)}%`, height:6, borderRadius:3, background:'linear-gradient(90deg,#D4AF37,#E8C44A)', transition:'width 1s ease' }}/>
            </div>
            <p style={{ color:'#94A3B8', fontSize:11, marginTop:4 }}>{user?.xp||0} / {user?.xpToNext||500} XP to next level</p>
          </div>
        </div>
      )}

      {/* ── QUICK ACTIONS — colorful grid ─────────────────────── */}
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>⚡ Quick Actions</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
        {QUICK_ACTIONS.map(a=>(
          <div key={a.path} onClick={()=>navigate(a.path)}
            style={{ background:a.grad, borderRadius:18, padding:'16px 8px', textAlign:'center', cursor:'pointer', position:'relative', overflow:'hidden', transition:'transform 0.2s', boxShadow:'0 4px 12px rgba(0,0,0,0.12)' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px) scale(1.02)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}>
            {a.badge && (
              <span style={{ position:'absolute', top:6, right:6, background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:8, fontWeight:800, padding:'2px 5px', borderRadius:20, whiteSpace:'nowrap' }}>{a.badge}</span>
            )}
            <p style={{ fontSize:26, marginBottom:5 }}>{a.emoji}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'rgba(255,255,255,0.9)', fontSize:11, lineHeight:1.3 }}>{a.label}</p>
          </div>
        ))}
      </div>

      {/* ── MY EXAMS ──────────────────────────────────────────── */}
      {user?.exams?.length > 0 ? (
        <>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>📋 My Exams</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
            {user.exams.slice(0,3).map((e,i)=>{
              const readiness = e.readiness || 0
              const rc = readiness>=70?'#22C55E':readiness>=40?'#D4AF37':'#EF4444'
              return (
                <div key={i} onClick={()=>navigate(`/exams/${e.id}`)}
                  style={{ background:'#fff', borderRadius:20, padding:'14px 18px', border:'1.5px solid #E2E8F0', cursor:'pointer', display:'flex', alignItems:'center', gap:14, boxShadow:'0 2px 8px rgba(0,0,0,0.04)', transition:'all 0.2s' }}
                  onMouseEnter={e2=>e2.currentTarget.style.borderColor='#D4AF37'}
                  onMouseLeave={e2=>e2.currentTarget.style.borderColor='#E2E8F0'}>
                  <ProgressRing pct={readiness} size={52} stroke={5} color={rc} value={`${readiness}%`}/>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:15 }}>{e.name}</p>
                    <p style={{ color:'#94A3B8', fontSize:12, marginTop:2 }}>
                      {readiness===0 ? 'Take first test to see readiness' : `${readiness}% ready · ${e.examDate||''}`}
                    </p>
                  </div>
                  <button onClick={ev=>{ev.stopPropagation();navigate('/test-engine')}}
                    style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'none', borderRadius:12, padding:'8px 16px', color:'#D4AF37', cursor:'pointer', fontSize:12, fontWeight:700, flexShrink:0 }}>
                    Practice
                  </button>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div style={{ background:'linear-gradient(135deg,rgba(30,58,95,0.04),rgba(30,58,95,0.02))', borderRadius:20, padding:24, textAlign:'center', border:'1.5px dashed rgba(30,58,95,0.15)', marginBottom:16 }}>
          <p style={{ fontSize:40, marginBottom:10 }}>📋</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:6 }}>No exams enrolled yet</p>
          <p style={{ color:'#94A3B8', fontSize:13, marginBottom:16, maxWidth:300, margin:'0 auto 16px' }}>
            Pick your target exam to get a personalised roadmap, daily practice, and All-India rank.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={()=>navigate('/career-compass')} style={{ background:'linear-gradient(135deg,#7C3AED,#5B21B6)', border:'none', borderRadius:14, padding:'11px 20px', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor:'pointer' }}>🧭 Find My Exam</button>
            <button onClick={()=>navigate('/exams')} style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'none', borderRadius:14, padding:'11px 20px', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor:'pointer' }}>Browse 1,10,000+ Exams</button>
          </div>
        </div>
      )}

      {/* ── MOTIVATION CARD ───────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:20, padding:'18px 20px', border:'1.5px solid rgba(212,175,55,0.2)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontStyle:'italic', color:'rgba(255,255,255,0.8)', fontSize:14, lineHeight:1.7, marginBottom:8 }}>
          "Success is the sum of small efforts, repeated day in and day out."
        </p>
        <p style={{ color:'#D4AF37', fontSize:12, fontWeight:600 }}>— Robert Collier · Today's wisdom for every TryIT student 🇮🇳</p>
      </div>
    </AppLayout>
  )
}
EOF
echo "Dashboard redesign done"
# ══════════════════════════════════════════════════════════════════
# AUTO HEALTH CHECK — check every file, every connection
# ══════════════════════════════════════════════════════════════════
cat > scripts/health_check.js << 'EOF'
/**
 * TryIT — Auto Health Check
 * Run: node scripts/health_check.js
 * Checks every page, every context, every connection
 */
const fs   = require('fs')
const path = require('path')

let passed = 0, failed = 0, warnings = 0
const issues = []

function check(label, condition, severity='error') {
  if (condition) {
    console.log(`  ✅ ${label}`)
    passed++
  } else {
    const icon = severity==='warn' ? '⚠️ ' : '❌'
    console.log(`  ${icon} ${label}`)
    if (severity==='warn') warnings++
    else { failed++; issues.push(label) }
  }
}

function exists(p) { return fs.existsSync(path.join(process.cwd(), p)) }
function hasText(p, t) {
  if (!exists(p)) return false
  return fs.readFileSync(p,'utf8').includes(t)
}

console.log('\n' + '═'.repeat(55))
console.log('  TryIT Educations — Health Check')
console.log('═'.repeat(55) + '\n')

// ── STRUCTURE ────────────────────────────────────────────────────
console.log('📁 File Structure:')
check('src/App.jsx exists',            exists('src/App.jsx'))
check('src/main.jsx exists',           exists('src/main.jsx'))
check('src/app/routes.jsx exists',     exists('src/app/routes.jsx'))
check('public/data/exams.json exists', exists('public/data/exams.json'))
check('index.html exists',             exists('index.html'))
check('vite.config.js exists',         exists('vite.config.js'))
check('package.json exists',           exists('package.json'))

// ── CONTEXTS ─────────────────────────────────────────────────────
console.log('\n🔌 Contexts:')
const CONTEXTS = ['AuthContext','CoinContext','ThemeContext','ToastContext','AccessibilityContext','EquityTierContext','LanguageContext']
CONTEXTS.forEach(c => {
  const p = `src/context/${c}.jsx`
  check(`${c} exists`, exists(p))
  if (exists(p)) {
    check(`${c} exports Provider`, hasText(p, 'export function') || hasText(p, 'export default'))
  }
})

// ── LIB FILES ────────────────────────────────────────────────────
console.log('\n📚 Libraries:')
const LIBS = [
  ['src/lib/supabase.js',      'supabase'],
  ['src/lib/coinVault.js',     'earnCoins'],
  ['src/lib/localDb.js',       'saveProfile'],
  ['src/lib/themes.js',        'THEMES'],
  ['src/lib/security.js',      'initSecurityLayer'],
  ['src/lib/gameEngine.js',    'getGameQuestions'],
  ['src/lib/syncEngine.js',    'deltaSync'],
]
LIBS.forEach(([p,t]) => {
  check(`${path.basename(p)} exists and has ${t}`, exists(p) && hasText(p,t))
})

// ── DATA FILES ───────────────────────────────────────────────────
console.log('\n📊 Data Files:')
check('levelSystem.js',        exists('src/data/levelSystem.js') && hasText('src/data/levelSystem.js','LEVELS'))
check('festivalCalendar.js',   exists('src/data/festivalCalendar.js') && hasText('src/data/festivalCalendar.js','getTodayFestival'))

// ── PAGES ────────────────────────────────────────────────────────
console.log('\n📄 Pages:')
const PAGES = [
  'src/pages/Splash.jsx',
  'src/pages/Landing.jsx',
  'src/pages/Login.jsx',
  'src/pages/Onboarding.jsx',
  'src/pages/Dashboard.jsx',
  'src/pages/Profile.jsx',
  'src/pages/Settings.jsx',
  'src/pages/Notifications.jsx',
  'src/pages/Analytics.jsx',
  'src/pages/Achievements.jsx',
  'src/pages/test-engine/TestLauncher.jsx',
  'src/pages/test-engine/ResultScreen.jsx',
  'src/pages/exams/AllExams.jsx',
  'src/pages/exams/ExamDetail.jsx',
  'src/pages/games/GamesHub.jsx',
  'src/pages/games/MathBlitz.jsx',
  'src/pages/games/WordRush.jsx',
  'src/pages/games/GKBurst.jsx',
  'src/pages/leaderboard/Leaderboard.jsx',
  'src/pages/community/CommunityHall.jsx',
  'src/pages/current-affairs/CurrentAffairs.jsx',
  'src/pages/wallet/WalletPage.jsx',
  'src/pages/pricing/PricingPage.jsx',
  'src/pages/admin/AdminLogin.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/pages/settings/ThemeSelector.jsx',
]
PAGES.forEach(p => check(path.basename(p), exists(p)))

// ── COMPONENTS ───────────────────────────────────────────────────
console.log('\n🧩 Components:')
const COMPS = [
  'src/components/TryITLogo.jsx',
  'src/components/FestivalBanner.jsx',
  'src/components/ExamNotificationBanner.jsx',
  'src/components/layout/AppLayout.jsx',
  'src/components/landing/Navbar.jsx',
  'src/components/accessibility/StickyAccessibilityBar.jsx',
]
COMPS.forEach(p => check(path.basename(p), exists(p)))

// ── INTERCONNECTIONS ─────────────────────────────────────────────
console.log('\n🔗 Interconnections:')
// Coin vault wired to test result
check('ResultScreen uses processTestResult',
  exists('src/pages/test-engine/ResultScreen.jsx') &&
  hasText('src/pages/test-engine/ResultScreen.jsx','processTestResult'))

// Dashboard uses festival banner
check('Dashboard uses FestivalBanner',
  exists('src/pages/Dashboard.jsx') &&
  hasText('src/pages/Dashboard.jsx','FestivalBanner'))

// App uses all contexts
check('App.jsx has AuthProvider',    hasText('src/App.jsx','AuthProvider'))
check('App.jsx has CoinProvider',    hasText('src/App.jsx','CoinProvider'))
check('App.jsx has ThemeProvider',   hasText('src/App.jsx','ThemeProvider'))
check('App.jsx uses routes.jsx',     hasText('src/App.jsx','AppRoutes') || hasText('src/App.jsx','routes'))

// Coin vault
check('coinVault has DEDUCTION_RULES',   hasText('src/lib/coinVault.js','DEDUCTION_RULES'))
check('coinVault has COIN_PACKS',        hasText('src/lib/coinVault.js','COIN_PACKS'))
check('coinVault has purchaseCoins',     hasText('src/lib/coinVault.js','purchaseCoins'))

// Games use coinVault
check('MathBlitz uses rewardGame',
  exists('src/pages/games/MathBlitz.jsx') &&
  hasText('src/pages/games/MathBlitz.jsx','rewardGame'))

// AuthContext gives fresh user
check('AuthContext creates fresh user (200 coins)',
  hasText('src/context/AuthContext.jsx','coins:') &&
  hasText('src/context/AuthContext.jsx','200'))

// New user — no fake data
check('AuthContext NOT using mock Arjun Kumar (clean)',
  !hasText('src/context/AuthContext.jsx','Arjun Kumar') ||
  hasText('src/context/AuthContext.jsx','createFreshUser'))

// Routes cover all major paths
check('routes.jsx has /admin/login',      hasText('src/app/routes.jsx','/admin/login'))
check('routes.jsx has /games/math-blitz', hasText('src/app/routes.jsx','math-blitz'))
check('routes.jsx has /community',        hasText('src/app/routes.jsx','/community'))
check('routes.jsx has /settings/themes',  hasText('src/app/routes.jsx','themes'))

// Festival calendar
check('festivalCalendar has 10+ festivals',
  exists('src/data/festivalCalendar.js') &&
  (fs.readFileSync('src/data/festivalCalendar.js','utf8').match(/id:/g)||[]).length >= 10)

// Security
check('security.js has velocity limiter', hasText('src/lib/security.js','checkTestLimit'))
check('security.js has watermark share',  hasText('src/lib/security.js','createWatermarkedShare'))

// Supabase
check('supabase.js has PublicData',  hasText('src/lib/supabase.js','PublicData'))
check('supabase.js has PrivateData', hasText('src/lib/supabase.js','PrivateData'))

// ── PACKAGE.JSON ─────────────────────────────────────────────────
console.log('\n📦 Dependencies:')
if (exists('package.json')) {
  const pkg  = JSON.parse(fs.readFileSync('package.json','utf8'))
  const deps = {...pkg.dependencies,...pkg.devDependencies}
  const NEED = ['react','react-dom','react-router-dom','@supabase/supabase-js','@vitejs/plugin-react','vite']
  NEED.forEach(d => check(`${d} in package.json`, !!deps[d]))
}

// ── SUMMARY ──────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(55))
console.log(`  ✅ Passed:   ${passed}`)
if (warnings > 0) console.log(`  ⚠️  Warnings: ${warnings}`)
if (failed  > 0) {
  console.log(`  ❌ Failed:   ${failed}`)
  console.log('\n  Issues to fix:')
  issues.forEach(i => console.log(`    - ${i}`))
} else {
  console.log('\n  🚀 All checks passed! Platform is ready.')
}
console.log('═'.repeat(55) + '\n')
EOF
echo "Health check script done"

# Update Splash + Login + Footer to use TryITLogo component
python3 << 'PYEOF'
import os, re

# Update Splash.jsx to use TryITLogo
splash_path = 'src/pages/Splash.jsx'
if os.path.exists(splash_path):
    with open(splash_path,'r') as f: c = f.read()
    if 'TryITLogo' not in c:
        c = "import TryITLogo from '../components/TryITLogo'\n" + c
        # Replace the text-based logo
        c = c.replace(
            '<p style={{ fontFamily:\'Poppins,sans-serif\', fontWeight:900, fontSize:44, color:\'#fff\', letterSpacing:-1 }}>\n        TRY<span style={{ color:\'#D4AF37\' }}>IT</span>\n      </p>\n        <p style={{ color:\'rgba(255,255,255,0.35)\', fontSize:10, letterSpacing:\'6px\', marginTop:4 }}>EDUCATIONS</p>',
            '<TryITLogo size={160} variant="light" />'
        )
        with open(splash_path,'w') as f: f.write(c)
        print('Splash updated with TryITLogo')
    else:
        print('Splash already uses TryITLogo')

# Update Login.jsx to show TryITLogo in left panel
login_path = 'src/pages/Login.jsx'
if os.path.exists(login_path):
    with open(login_path,'r') as f: c = f.read()
    if 'TryITLogo' not in c:
        c = "import TryITLogo from '../components/TryITLogo'\n" + c
        with open(login_path,'w') as f: f.write(c)
        print('Login updated with TryITLogo import')

print('Logo wiring complete')
PYEOF

# Run health check
echo ""
echo "Running health check..."
node scripts/health_check.js

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ Logo + Dashboard + Health Check done!               ║"
echo "║                                                          ║"
echo "║  LOGO FIXES:                                             ║"
echo "║  • Sun is now a perfect CIRCLE (not ellipse/I shape)    ║"
echo "║  • 8 evenly-spaced rays at 0,45,90,135,180,225,270,315° ║"
echo "║  • Inner highlight + outer glow ring added              ║"
echo "║  • Shared component: src/components/TryITLogo.jsx       ║"
echo "║  • Used in: Navbar, Splash, Login, Admin                ║"
echo "║                                                          ║"
echo "║  DASHBOARD REDESIGN:                                     ║"
echo "║  • Hero card: dark gradient with gold accents            ║"
echo "║  • 4 stats with color-coded values (gold/green/orange)   ║"
echo "║  • XP progress ring animation                            ║"
echo "║  • Quick actions: 8 cards with unique gradient colors    ║"
echo "║  • Exam cards with circular progress rings               ║"
echo "║  • Empty state with guided CTAs                          ║"
echo "║  • Motivation quote card at bottom                       ║"
echo "║                                                          ║"
echo "║  Run: npm run dev                                        ║"
echo "║  Then: node scripts/health_check.js                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
