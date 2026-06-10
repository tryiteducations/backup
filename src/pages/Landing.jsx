import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import { PLATFORM_FEATURES, LANGUAGES_DATA, TESTIMONIALS, LEADERBOARD_DATA } from '../data/mockSeeds'

// ── Navbar ───────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:50, height:68,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 32px',
      background: scrolled ? 'rgba(30,58,95,0.97)' : 'rgba(30,58,95,0.85)',
      backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(212,175,55,0.2)',
      transition:'background 0.3s',
    }}>
      <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:24 }}>
        <span style={{ color:'#fff' }}>TRY</span>
        <span style={{ color:'#D4AF37' }}>IT</span>
        <span style={{ color:'rgba(255,255,255,0.5)', fontSize:10, fontWeight:600,
          letterSpacing:'3px', display:'block', marginTop:-6 }}>EDUCATIONS</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8,
          background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.3)',
          borderRadius:20, padding:'6px 14px' }}>
          <span style={{ width:8, height:8, borderRadius:'50%',
            background:'#22C55E', display:'inline-block',
            animation:'pulseDot 1.5s ease-in-out infinite' }} />
          <span style={{ color:'rgba(255,255,255,0.8)', fontSize:12, fontFamily:'Inter,sans-serif' }}>
            1,247 studying now
          </span>
        </div>
        <button onClick={() => navigate('/login')}
          style={{
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            border:'none', borderRadius:14, padding:'10px 24px',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
            color:'#1E3A5F', cursor:'pointer',
          }}>
          Login →
        </button>
      </div>
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ navigate }) {
  return (
    <section style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      background:'linear-gradient(135deg,#071428 0%,#0F2140 40%,#1E3A5F 100%)',
      padding:'80px 32px', position:'relative', overflow:'hidden',
    }}>
      {/* Animated background circles */}
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%',
        border:'1px solid rgba(212,175,55,0.08)', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:900, height:900, borderRadius:'50%',
        border:'1px solid rgba(212,175,55,0.04)', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%',
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>

        {/* Left */}
        <div>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.3)',
            borderRadius:20, padding:'8px 16px', marginBottom:24,
          }}>
            <span style={{ fontSize:16 }}>🚀</span>
            <span style={{ color:'#D4AF37', fontFamily:'Inter,sans-serif',
              fontSize:13, fontWeight:600 }}>
              India's First Platform for EVERY Indian Exam
            </span>
          </div>

          {['One App.', 'Every Exam.', 'Zero Barriers.'].map((line, i) => (
            <div key={line} style={{
              fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(40px,5vw,68px)', lineHeight:1.05,
              color: i === 1 ? '#D4AF37' : '#FFFFFF',
              animation:`wordReveal 0.6s ease ${i * 0.15}s both`,
            }}>{line}</div>
          ))}

          <p style={{ color:'#D4AF37', fontStyle:'italic',
            fontFamily:'Inter,sans-serif', fontSize:18,
            margin:'16px 0 8px' }}>
            Your Exam. Your Rank. Your Success.
          </p>
          <p style={{ color:'rgba(255,255,255,0.65)', fontFamily:'Inter,sans-serif',
            fontSize:15, lineHeight:1.7, maxWidth:500, marginBottom:32 }}>
            9,852 verified exam pathways — Class 6 to PhD, age 12 to 60+.
            Study in 40+ Indian languages. Real All-India rankings after every test.
          </p>

          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:28 }}>
            <button onClick={() => navigate('/login')} style={{
              background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
              border:'none', borderRadius:16, padding:'16px 36px',
              fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18,
              color:'#1E3A5F', cursor:'pointer',
            }}>
              Start Free →
            </button>
            <button onClick={() => navigate('/career-compass')} style={{
              background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
              border:'1px solid rgba(212,175,55,0.4)', borderRadius:16, padding:'16px 28px',
              fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16,
              color:'#fff', cursor:'pointer',
            }}>
              🧭 Find My Exam
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['🔒 Secure','💳 No Credit Card','🌐 40+ Languages','🏆 Real Rankings','🆓 Free to Start'].map(t => (
              <span key={t} style={{
                background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
                borderRadius:20, padding:'5px 12px', color:'rgba(255,255,255,0.6)',
                fontSize:11, fontFamily:'Inter,sans-serif',
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right — floating cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Rank card */}
          <div style={{
            background:'rgba(15,33,64,0.9)', border:'1px solid rgba(212,175,55,0.3)',
            borderRadius:20, padding:20, backdropFilter:'blur(20px)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ width:48, height:48, borderRadius:'50%',
                background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#1E3A5F' }}>
                AK
              </div>
              <div>
                <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700 }}>Arjun K. · Tamil Nadu</p>
                <p style={{ color:'#D4AF37', fontSize:12 }}>⛏️ The Gold Miner · SSC CGL</p>
              </div>
            </div>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, fontFamily:'Inter,sans-serif', marginBottom:12 }}>
              "Moved from #8,432 → #1,243 in 30 days! 🔥"
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ flex:1, height:6, borderRadius:3, background:'rgba(255,255,255,0.1)' }}>
                <div style={{ width:'67%', height:6, borderRadius:3, background:'#D4AF37' }} />
              </div>
              <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700 }}>67% Ready</span>
            </div>
          </div>

          {/* Level badge card */}
          <div style={{
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            borderRadius:20, padding:20, display:'flex', alignItems:'center', gap:16,
          }}>
            <span style={{ fontSize:40 }}>🦁</span>
            <div>
              <p style={{ color:'#1E3A5F', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18 }}>
                Baahuveer
              </p>
              <p style={{ color:'rgba(30,58,95,0.7)', fontSize:12 }}>Level 6 — The Warrior King</p>
              <p style={{ color:'rgba(30,58,95,0.8)', fontSize:12, marginTop:4 }}>
                Indian cinema meets exam prep 🎬
              </p>
            </div>
          </div>

          {/* Stats mini */}
          <div style={{
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:20, padding:16, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8,
          }}>
            {[['9,852','Exams'],['40+','Languages'],['#1,243','Your Rank']].map(([v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <p style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18 }}>{v}</p>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:10 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Stats Strip ───────────────────────────────────────────────
function StatsStrip() {
  const [counts, setCounts] = useState([0, 0, 0])
  const ref = useRef(null)
  const TARGETS = [9852, 40, 50000]
  const LABELS  = ['Verified Exams Ready','Indian Languages','Students & Growing']
  const EXTRAS  = ['','+ ','']
  const SUFFIXES = ['','+',' already']

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      TARGETS.forEach((target, i) => {
        const dur = 1800, start = performance.now()
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setCounts(prev => { const n=[...prev]; n[i]=Math.floor(eased*target); return n })
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const EXTRA_STATS = [
    { display:'All Ages',   label:'5 to 65 Years' },
    { display:'All Stages', label:'Class 6 to PhD' },
    { display:'Real',       label:'Rankings + Results' },
  ]

  return (
    <section ref={ref} style={{
      background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
      padding:'40px 20px',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto',
        display:'flex', flexWrap:'wrap', justifyContent:'center',
        borderLeft:'1px solid rgba(255,255,255,0.08)' }}>
        {TARGETS.map((_, i) => (
          <div key={i} style={{
            flex:'1 1 140px', textAlign:'center', padding:'20px 24px',
            borderRight:'1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(28px,4vw,44px)', color:'#D4AF37', lineHeight:1 }}>
              {/* explicit ternary — never && — prevents "0" rendering */}
              {counts[i] > 0 ? `${EXTRAS[i]}${counts[i].toLocaleString()}${SUFFIXES[i]}` : '—'}
            </div>
            <div style={{ color:'rgba(255,255,255,0.65)', fontSize:13,
              fontFamily:'Inter,sans-serif', marginTop:6 }}>
              {LABELS[i]}
            </div>
          </div>
        ))}
        {EXTRA_STATS.map(s => (
          <div key={s.label} style={{
            flex:'1 1 140px', textAlign:'center', padding:'20px 24px',
            borderRight:'1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(28px,4vw,44px)', color:'#D4AF37', lineHeight:1 }}>
              {s.display}
            </div>
            <div style={{ color:'rgba(255,255,255,0.65)', fontSize:13,
              fontFamily:'Inter,sans-serif', marginTop:6 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Features Grid ─────────────────────────────────────────────
function FeaturesSection({ navigate }) {
  return (
    <section style={{ background:'#F8FAFC', padding:'80px 32px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(28px,4vw,42px)', color:'#1E3A5F', marginBottom:12 }}>
            Everything You Need to Crack Your Exam
          </h2>
          <p style={{ color:'#64748B', fontFamily:'Inter,sans-serif', fontSize:16 }}>
            12 powerful features. One platform. Built for every Indian student.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {PLATFORM_FEATURES.map(f => (
            <div key={f.id}
              onClick={() => navigate('/login')}
              style={{
                background:'#fff', borderRadius:20, padding:24,
                border:'1.5px solid #E2E8F0', cursor:'pointer',
                transition:'all 0.2s',
                boxShadow:'0 2px 12px rgba(30,58,95,0.06)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='#D4AF37'; e.currentTarget.style.boxShadow='0 8px 30px rgba(212,175,55,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.boxShadow='0 2px 12px rgba(30,58,95,0.06)' }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontSize:36 }}>{f.emoji}</span>
                <span style={{
                  background: f.badge === '🔥 Viral' ? '#FEF3C7' : f.badge === 'Exclusive' ? '#EDE9FE' : '#F0FDF4',
                  color: f.badge === '🔥 Viral' ? '#92400E' : f.badge === 'Exclusive' ? '#7C3AED' : '#065F46',
                  fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, letterSpacing:'0.5px',
                }}>{f.badge}</span>
              </div>
              <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                fontSize:16, color:'#1E3A5F', marginBottom:4 }}>{f.title}</h3>
              <p style={{ color:'#D4AF37', fontSize:12, fontWeight:600, marginBottom:8 }}>{f.subtitle}</p>
              <p style={{ color:'#64748B', fontSize:13, lineHeight:1.6, marginBottom:12 }}>{f.desc}</p>
              <p style={{ color:'#94A3B8', fontSize:11, fontFamily:'Inter,sans-serif' }}>📊 {f.stats}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Cinematic Badges Section ──────────────────────────────────
function CinematicBadges() {
  const LEVELS = [
    { level:1,  title:'The Fierce One',  emoji:'🔥', xp:'0–500',    color:'#EF4444' },
    { level:2,  title:'The Fighter',     emoji:'⚔️', xp:'500–1.5K', color:'#F97316' },
    { level:3,  title:'The Riser',       emoji:'📈', xp:'1.5K–3K',  color:'#EAB308' },
    { level:4,  title:'The Gold Miner',  emoji:'⛏️', xp:'3K–6K',    color:'#D4AF37' },
    { level:5,  title:'The Grinder',     emoji:'💪', xp:'6K–10K',   color:'#22C55E' },
    { level:6,  title:'Baahuveer',       emoji:'🦁', xp:'10K–16K',  color:'#D4AF37', cinema:'Baahubali' },
    { level:7,  title:'Thalavan',        emoji:'👑', xp:'16K–24K',  color:'#8B5CF6', cinema:'The Boss' },
    { level:8,  title:'The Unstoppable', emoji:'⚡', xp:'24K–35K',  color:'#06B6D4' },
    { level:9,  title:'The Legend',      emoji:'🌟', xp:'35K–50K',  color:'#D4AF37' },
    { level:10, title:'The Absolute',    emoji:'🏆', xp:'50K+',     color:'#D4AF37' },
  ]

  return (
    <section style={{ background:'linear-gradient(180deg,#0F2140,#071428)', padding:'80px 32px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(26px,4vw,40px)', color:'#fff', marginBottom:8 }}>
            🎬 Cinematic Level System
          </h2>
          <p style={{ color:'rgba(255,255,255,0.6)', fontFamily:'Inter,sans-serif' }}>
            Your study journey told like an epic film. Every rank has a legendary title.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:12 }}>
          {LEVELS.map(l => (
            <div key={l.level} style={{
              background:'rgba(255,255,255,0.04)', border:`1px solid ${l.color}33`,
              borderRadius:16, padding:'16px 14px', textAlign:'center',
              transition:'all 0.2s',
            }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{l.emoji}</div>
              <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                fontSize:14, color:'#fff', marginBottom:4 }}>{l.title}</div>
              {l.cinema && (
                <div style={{ fontSize:10, color:l.color, marginBottom:4,
                  fontStyle:'italic' }}>🎬 {l.cinema}</div>
              )}
              <div style={{ background:`${l.color}22`, color:l.color,
                borderRadius:20, padding:'3px 10px', fontSize:10, fontWeight:700,
                display:'inline-block' }}>
                Lv {l.level} · {l.xp} XP
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.4)',
          fontFamily:'Inter,sans-serif', fontSize:12, marginTop:24 }}>
          Baahuveer (Lv 6) and Thalavan (Lv 7) are inspired by Indian cinema legends 🎬
        </p>
      </div>
    </section>
  )
}

// ── Testimonials Marquee ──────────────────────────────────────
function TestimonialsMarquee() {
  return (
    <section style={{ background:'#F8FAFC', padding:'60px 0', overflow:'hidden' }}>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:'clamp(24px,3vw,36px)', color:'#1E3A5F' }}>
          Real Students. Real Results.
        </h2>
      </div>
      <div style={{ display:'flex', animation:'scrollTicker 30s linear infinite',
        width:'max-content', gap:16 }}>
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <div key={i} style={{
            minWidth:280, background:'#fff',
            border:'1.5px solid #E2E8F0', borderRadius:20, padding:20,
            flexShrink:0,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{
                width:40, height:40, borderRadius:'50%',
                background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#D4AF37', fontFamily:'Poppins,sans-serif',
                fontWeight:800, fontSize:13,
              }}>{t.name.split(' ').map(n=>n[0]).join('')}</div>
              <div>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  fontSize:13, color:'#1E3A5F' }}>{t.name}</p>
                <p style={{ fontSize:11, color:'#64748B' }}>{t.state} · {t.exam}</p>
              </div>
              <div style={{ marginLeft:'auto' }}>
                <span style={{ background:'#FEF3C7', color:'#92400E',
                  fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20 }}>
                  {t.level} {t.emoji}
                </span>
              </div>
            </div>
            <p style={{ color:'#475569', fontSize:13, fontFamily:'Inter,sans-serif',
              lineHeight:1.6 }}>{t.text}</p>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <span style={{ background:'#EDE9FE', color:'#7C3AED',
                fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>
                Rank {t.rank}
              </span>
              <span style={{ background:'#DCFCE7', color:'#15803D',
                fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>
                {t.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Languages Section ─────────────────────────────────────────
function LanguagesSection() {
  return (
    <section style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', padding:'72px 32px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:'clamp(24px,4vw,38px)', color:'#fff', marginBottom:8 }}>
          🌐 Study in Your Mother Tongue
        </h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontFamily:'Inter,sans-serif',
          marginBottom:40 }}>
          40+ Indian languages · New languages added weekly
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
          {LANGUAGES_DATA.map(l => (
            <div key={l.code} style={{
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:16, padding:'10px 16px',
              display:'flex', alignItems:'center', gap:8,
            }}>
              <span style={{ fontSize:18 }}>{l.flag}</span>
              <div style={{ textAlign:'left' }}>
                <div style={{ color:'#fff', fontSize:12, fontWeight:600 }}>{l.name}</div>
                <div style={{ color:'#D4AF37', fontSize:14, fontFamily:'serif' }}>{l.native}</div>
              </div>
            </div>
          ))}
          <div style={{
            background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.3)',
            borderRadius:16, padding:'10px 20px',
            display:'flex', alignItems:'center', gap:8,
          }}>
            <span style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif',
              fontWeight:700, fontSize:14 }}>+24 more →</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Leaderboard Preview ───────────────────────────────────────
function LeaderboardPreview({ navigate }) {
  return (
    <section style={{ background:'#F8FAFC', padding:'72px 32px' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(24px,4vw,38px)', color:'#1E3A5F', marginBottom:8 }}>
            🏆 Real All-India Rankings
          </h2>
          <p style={{ color:'#64748B' }}>After every test. Live. Transparent. Yours.</p>
        </div>
        <div style={{ background:'#fff', borderRadius:24,
          border:'1.5px solid #E2E8F0', overflow:'hidden',
          boxShadow:'0 8px 30px rgba(30,58,95,0.08)' }}>
          {/* Header */}
          <div style={{ background:'#1E3A5F', padding:'12px 20px',
            display:'grid', gridTemplateColumns:'40px 1fr 100px 80px' }}>
            {['Rank','Student','Exam','Score'].map(h => (
              <span key={h} style={{ color:'#D4AF37', fontSize:11,
                fontWeight:700, letterSpacing:'1px' }}>{h}</span>
            ))}
          </div>
          {LEADERBOARD_DATA.map((row, i) => (
            <div key={i} style={{
              padding:'14px 20px', borderBottom:'1px solid #F1F5F9',
              display:'grid', gridTemplateColumns:'40px 1fr 100px 80px',
              alignItems:'center',
              background: row.isMe ? 'rgba(212,175,55,0.08)' : '#fff',
              borderLeft: row.isMe ? '4px solid #D4AF37' : 'none',
            }}>
              <span style={{
                fontFamily:'Poppins,sans-serif', fontWeight:700,
                color: i === 0 ? '#D4AF37' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : '#64748B',
                fontSize: i < 3 ? 18 : 14,
              }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${row.rank.toLocaleString()}`}
              </span>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600,
                    color:'#1E293B', fontSize:13 }}>{row.name}</span>
                  {row.isMe && <span style={{ background:'#D4AF37', color:'#1E3A5F',
                    fontSize:9, fontWeight:700, padding:'2px 8px',
                    borderRadius:20 }}>← YOU</span>}
                </div>
                <span style={{ color:'#94A3B8', fontSize:11 }}>
                  {row.badgeEmoji} {row.badge} · {row.state}
                </span>
              </div>
              <span style={{ background:'#F1F5F9', color:'#475569',
                fontSize:10, fontWeight:600, padding:'3px 8px',
                borderRadius:20, display:'inline-block' }}>{row.exam}</span>
              <span style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif',
                fontWeight:700, fontSize:14 }}>{row.score}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:24 }}>
          <button onClick={() => navigate('/login')} style={{
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            border:'none', borderRadius:14, padding:'14px 36px',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16,
            color:'#1E3A5F', cursor:'pointer',
          }}>
            See Your Rank →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  const LINKS = {
    Platform: ['About Us','How It Works','Pricing','Blog','Careers'],
    Students:  ['All Exams','Test Engine','Brain Games','Guru Hub','Leaderboard'],
    Partners:  ['Become a Mentor','Institute Partner','API Access','Affiliate'],
    Legal:     ['Privacy Policy','Terms of Service','Community Standards','Refund Policy'],
  }
  return (
    <footer style={{ background:'#0F2140', paddingTop:64, paddingBottom:24 }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:32, marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:8 }}>
              <span style={{ color:'#fff' }}>TRY</span><span style={{ color:'#D4AF37' }}>IT</span>
            </div>
            <p style={{ color:'#D4AF37', fontStyle:'italic', fontSize:13, marginBottom:12 }}>
              Your Exam. Your Rank. Your Success.
            </p>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12, lineHeight:1.6 }}>
              India's most complete exam prep platform.
            </p>
          </div>
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif',
                fontWeight:600, fontSize:13, marginBottom:12 }}>{section}</p>
              {links.map(l => (
                <a key={l} href="#" style={{ display:'block', color:'rgba(255,255,255,0.45)',
                  fontSize:12, marginBottom:8, textDecoration:'none',
                  fontFamily:'Inter,sans-serif', transition:'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color='#D4AF37'}
                  onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.45)'}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)', marginBottom:20 }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Inter,sans-serif' }}>
            © 2026 TryIT Educations Pvt Ltd. All rights reserved.
          </p>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Inter,sans-serif', fontStyle:'italic' }}>
            "Real platform. Real questions. Real ranks."
          </p>
        </div>
      </div>
    </footer>
  )
}

// ── MAIN LANDING PAGE ─────────────────────────────────────────
export default function Landing() {
  useReveal()
  const navigate = useNavigate()
  const [scrollPct, setScrollPct] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setScrollPct(pct)
      setShowTop(el.scrollTop > 500)
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      {/* Scroll progress */}
      <div style={{
        position:'fixed', top:0, left:0, height:3, zIndex:9999,
        width:`${scrollPct}%`,
        background:'linear-gradient(90deg,#D4AF37,#E8C84A,#D4AF37)',
        transition:'width 0.1s linear', pointerEvents:'none',
      }} />

      <Navbar />
      <Hero navigate={navigate} />
      <StatsStrip />
      <FeaturesSection navigate={navigate} />
      <CinematicBadges />
      <TestimonialsMarquee />
      <LanguagesSection />
      <LeaderboardPreview navigate={navigate} />

      {/* Final CTA */}
      <section style={{
        background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
        padding:'80px 32px', textAlign:'center',
      }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:'clamp(28px,4vw,48px)', color:'#fff', marginBottom:16 }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:16, marginBottom:32 }}>
          9,852 exams. 40+ languages. Real rankings. Start free today.
        </p>
        <button onClick={() => navigate('/login')} style={{
          background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
          border:'none', borderRadius:18, padding:'20px 56px',
          fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:20,
          color:'#1E3A5F', cursor:'pointer',
        }}>
          Start Free Now →
        </button>
      </section>

      <Footer />

      {showTop && (
        <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          style={{
            position:'fixed', bottom:80, right:20,
            width:48, height:48, borderRadius:'50%',
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            border:'none', cursor:'pointer', fontSize:20,
            boxShadow:'0 4px 20px rgba(212,175,55,0.5)',
            zIndex:30, display:'flex', alignItems:'center', justifyContent:'center',
          }}>↑</button>
      )}
    </div>
  )
}
