import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import InstitutionSection from '../components/landing/InstitutionSection'
import EquityPricingSection from '../components/landing/EquityPricingSection'
import DonationSection from '../components/landing/DonationSection'

// ── Count-up hook ────────────────────────────────────────────────
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const start = performance.now()
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setCount(Math.floor(eased * target))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])
  return [count, ref]
}

// ── HERO ─────────────────────────────────────────────────────────
function Hero({ navigate }) {
  return (
    <section style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      background: 'linear-gradient(135deg, var(--color-primary-dark, #071428) 0%, var(--color-primary, #0F2140) 45%, var(--color-navy, #1E3A5F) 100%)',
      padding:'80px 24px 60px', position:'relative', overflow:'hidden',
    }}>
      {[400,680,960].map((s,i) => (
        <div key={i} style={{ position:'absolute', width:s, height:s,
          borderRadius:'50%', border:`1px solid rgba(212,175,55,${0.07-i*0.02})`,
          top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          pointerEvents:'none',
          animation:`ringPulse ${4+i}s ease-in-out ${i*0.5}s infinite` }}/>
      ))}

      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%',
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,420px),1fr))',
        gap:48, alignItems:'center', position:'relative', zIndex:2 }}>

        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(212,175,55,0.12)',
            border:'1px solid rgba(212,175,55,0.3)',
            borderRadius:20, padding:'7px 16px', marginBottom:24 }}>
            <span>🚀</span>
            <span style={{ color:'var(--color-accent, #D4AF37)', fontSize:13, fontWeight:600,
              fontFamily:'Inter,sans-serif' }}>
              India's First Complete Exam Platform
            </span>
          </div>

            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(38px,6vw,72px)', lineHeight:1.05, marginBottom:16 }}>
            <span style={{ color:'var(--heading-color)' }}>One App.</span><br/>
            <span style={{ color:'var(--color-accent)' }}>Every Exam.</span><br/>
            <span style={{ color:'var(--heading-color)' }}>Zero Barriers.</span>
          </h1>

          <p style={{ color:'var(--color-accent, #D4AF37)', fontStyle:'italic',
            fontSize:'clamp(15px,2vw,19px)', marginBottom:8,
            fontFamily:'Inter,sans-serif' }}>
            Your Exam. Your Rank. Your Success.
          </p>
          <p style={{ color:'var(--color-text-light, rgba(255,255,255,0.65))',
            fontSize:'clamp(14px,1.8vw,16px)', lineHeight:1.75,
            maxWidth:520, marginBottom:32,
            fontFamily:'Inter,sans-serif' }}>
            1,10,000+ exam pathways — CLAT · UPSC · JEE · NEET · Swayam · Foreign ·
            Arts · Science · ITI · Scholarships and every exam in India.
            Study in 40+ Indian languages. Real All-India rankings after every test.
          </p>

          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:28 }}>
            <button onClick={() => navigate('/login')} style={{
              background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', border:'none',
              borderRadius:16,
              padding:'clamp(13px,2vw,18px) clamp(24px,3vw,40px)',
              fontFamily:'Poppins,sans-serif', fontWeight:800,
              fontSize:'clamp(15px,2vw,18px)', color:'var(--color-primary-dark, #1E3A5F)', cursor:'pointer',
              boxShadow:'0 6px 24px rgba(212,175,55,0.4)' }}>
              Start Free →
            </button>
            <button onClick={() => navigate('/equity')} style={{
              background:'rgba(255,255,255,0.08)',
              border:'1px solid rgba(255,255,255,0.18)',
              borderRadius:16,
              padding:'clamp(13px,2vw,18px) clamp(20px,3vw,28px)',
              fontFamily:'Poppins,sans-serif', fontWeight:700,
              fontSize:'clamp(14px,2vw,16px)', color:'var(--color-surface, #FFFFFF)', cursor:'pointer' }}>
              🤝 Free Access — 9 Communities
            </button>
          </div>

          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {['🔒 Secure','💳 ₹19 Trial','🌐 40+ Languages',
              '🏆 Real Rankings','🤝 Free for Life','🏳️‍⚧️ Trans Inclusive',
              '📚 From Class 6 to PhD'].map(t => (
              <span key={t} style={{ background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.1)', borderRadius:20,
                padding:'5px 12px', color:'var(--color-text-light, rgba(255,255,255,0.6))',
                fontSize:'clamp(10px,1.5vw,12px)',
                fontFamily:'Inter,sans-serif' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:'var(--color-surface-dark, rgba(0,0,0,0.88)',
            border:'1px solid rgba(212,175,55,0.3)', borderRadius:20,
            padding:18, backdropFilter:'blur(16px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ width:46, height:46, borderRadius:'50%',
                background:'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:900, fontSize:16, color:'var(--heading-color)', flexShrink:0 }}>AK</div>
              <div>
                <p className="glass-text-important" style={{ color:'var(--glass-dark-text, var(--color-surface-text, #FFFFFF))', fontWeight:700,
                  fontFamily:'Poppins,sans-serif', fontSize:14 }}>
                  Arjun K. — Tamil Nadu</p>
                <p style={{ color:'var(--color-accent, #D4AF37)', fontSize:12 }}>⛏️ The Gold Miner · SSC CGL</p>
              </div>
            </div>
            <p style={{ color:'var(--glass-dark-text, var(--color-surface-text, rgba(255,255,255,0.75)))', fontSize:13, marginBottom:12 }}>
              "Moved from #8,432 → <strong style={{ color:'var(--color-accent-light, #E8C84A)' }}>#1,243</strong> in 30 days! 🔥"
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ flex:1, height:6, borderRadius:3,
                background:'rgba(255,255,255,0.08)' }}>
                <div style={{ width:'67%', height:6, borderRadius:3,
                  background:'linear-gradient(90deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))' }}/>
              </div>
              <span style={{ color:'var(--color-accent, #D4AF37)', fontSize:12, fontWeight:700 }}>67% Ready</span>
            </div>
          </div>

          <div style={{ background:'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
            borderRadius:20, padding:'16px 20px',
            display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:40 }}>🦁</span>
            <div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                color:'var(--color-primary-dark, #1E3A5F)', fontSize:'clamp(16px,2.5vw,20px)' }}>Baahuveer</p>
              <p style={{ color:'var(--color-surface-text, rgba(255,255,255,0.85))', fontSize:13 }}>
                Level 6 — Indian Cinema meets Exam Glory 🎬</p>
            </div>
          </div>

          <div style={{ background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:20, padding:16,
            display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {[['1,10,000+','Exams'],['40+','Languages'],['Class 6+','All Ages']].map(([v,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <p style={{ color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif',
                  fontWeight:900, fontSize:'clamp(14px,2.5vw,20px)' }}>{v}</p>
                <p style={{ color:'rgba(255,255,255,0.45)', fontSize:10, marginTop:2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ringPulse {
          0%,100% { transform:translate(-50%,-50%) scale(1); opacity:1; }
          50%      { transform:translate(-50%,-50%) scale(1.05); opacity:0.4; }
        }
      `}</style>
    </section>
  )
}

// ── STATS STRIP ──────────────────────────────────────────────────
function StatsStrip() {
  const [c1, r1] = useCountUp(110000)
  const [c2, r2] = useCountUp(40)

  return (
    <section style={{ background:'linear-gradient(135deg, var(--color-primary-dark, #1E3A5F), var(--color-primary, #0F2140))', padding:'32px 20px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex',
        flexWrap:'wrap', justifyContent:'center',
        borderLeft:'1px solid rgba(255,255,255,0.06)' }}>

        <div ref={r1} style={{ flex:'1 1 180px', textAlign:'center',
          padding:'18px 16px', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(26px,4vw,44px)', color:'var(--color-accent, #D4AF37)', lineHeight:1 }}>
            {c1.toLocaleString()}+
          </p>
          <p style={{ color:'var(--color-text-light, rgba(255,255,255,0.55))', fontSize:13, marginTop:4 }}>
            Exam Pathways
          </p>
        </div>

        <div ref={r2} style={{ flex:'1 1 180px', textAlign:'center',
          padding:'18px 16px', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(26px,4vw,44px)', color:'var(--color-accent, #D4AF37)', lineHeight:1 }}>
            Indian Languages
          </p>
        </div>

        {/* Millions coming */}
        <div style={{ flex:'1 1 220px', textAlign:'center',
          padding:'18px 16px', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(20px,3.5vw,34px)', color:'var(--color-accent, #D4AF37)', lineHeight:1.1 }}>
            Millions Coming
          </p>
          <p style={{ color:'rgba(212,175,55,0.7)', fontSize:13,
            marginTop:4, fontStyle:'italic' }}>
            What about YOU? 🔥
          </p>
        </div>

        {/* All exams */}
        <div style={{ flex:'1 1 260px', textAlign:'center',
          padding:'18px 16px', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(16px,2.5vw,22px)', color:'var(--color-accent, #D4AF37)', lineHeight:1.2 }}>
            Every Exam In India
          </p>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11, marginTop:4 }}>
            CLAT · Swayam · Foreign · UPSC · Arts · Science · ITI · Scholarships
          </p>
        </div>

        <div style={{ flex:'1 1 160px', textAlign:'center',
          padding:'18px 16px', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(26px,4vw,44px)', color:'var(--color-accent, #D4AF37)', lineHeight:1 }}>
            28/28
          </p>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13, marginTop:4 }}>
            States Covered
          </p>
        </div>

      </div>
    </section>
  )
}

// ── TEST ENGINE PREVIEW ──────────────────────────────────────────
function TestPreview() {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const q = {
    text:'Q1. A shopkeeper sells an item for ₹520 and earns 30% profit. What is the cost price?',
    options:['₹400','₹380','₹420','₹350'], correct:0,
  }
  return (
    <section style={{ padding:'72px 20px', background:'var(--color-bg, #F8FAFC)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <span style={{ background:'var(--card-bg, #EDE9FE)', color:'var(--card-accent, #7C3AED)', fontSize:11,
            fontWeight:700, padding:'4px 14px', borderRadius:20, letterSpacing:'1px' }}>
            LIVE PREVIEW
          </span>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(22px,4vw,40px)', color:'var(--color-text, #1E3A5F)', margin:'12px 0 6px' }}>
            ⚡ Test Engine
          </h2>
          <p style={{ color:'var(--color-text-light, #64748B)', fontSize:15 }}>
            Try a real question right now — no login needed
          </p>
        </div>
        <div style={{ maxWidth:680, margin:'0 auto',
          background:'var(--color-surface, #FFFFFF)', borderRadius:24,
          boxShadow:'0 8px 40px rgba(30,58,95,0.1)',
          border:'1.5px solid var(--color-border, #E2E8F0)', overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
            padding:'12px 20px', display:'flex', justifyContent:'space-between',
            alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <div style={{ display:'flex', gap:8 }}>
              {['SSC CGL','Quantitative Aptitude','Medium'].map(tag => (
                <span key={tag} style={{ background:'rgba(212,175,55,0.2)',
                  color:'var(--color-accent, #D4AF37)', fontSize:11, fontWeight:700,
                  padding:'3px 10px', borderRadius:20 }}>{tag}</span>
              ))}
            </div>
            <span style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>⏱ 1:24</span>
          </div>
          <div style={{ padding:'24px 20px' }}>
            <p style={{ color:'var(--color-text, #1E293B)', fontWeight:600, fontSize:16,
              lineHeight:1.6, marginBottom:20, fontFamily:'Poppins,sans-serif' }}>
              {q.text}
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.options.map((opt,i) => {
                const letter = ['A','B','C','D'][i]
                const isSel = selected === i
                const isOk  = revealed && i === q.correct
                const isBad = revealed && isSel && i !== q.correct
                return (
                  <button key={i}
                    onClick={() => { if (!revealed) setSelected(i) }}
                    style={{ display:'flex', alignItems:'center', gap:12,
                      padding:'13px 16px', borderRadius:14, cursor:'pointer',
                      border:`2px solid ${isOk?'var(--color-success, #22C55E)':isBad?'var(--color-error, #EF4444)':isSel?'var(--color-primary, #1E3A5F)': 'var(--color-border, #E2E8F0)'}`,
                      background: isOk?'rgba(34,197,94,0.15)':isBad?'rgba(254,226,226,0.8)':isSel?'rgba(30,58,95,0.06)':'var(--color-surface, #FFFFFF)',
                      textAlign:'left', width:'100%', transition:'all 0.2s' }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0,
                      background: isOk?'var(--color-success, #22C55E)':isBad?'var(--color-error, #EF4444)':isSel?'var(--color-primary, #1E3A5F)':'var(--color-border, #E2E8F0)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color: isSel||isOk||isBad?'#fff':'var(--color-text-light, #64748B)',
                      fontWeight:800, fontSize:13 }}>
                      {isOk?'✓':isBad?'✗':letter}
                    </div>
                    <span style={{ fontSize:15, fontWeight: isSel||isOk?700:500,
                      color: isOk?'var(--color-success, #15803D)':isBad?'var(--color-error, #991B1B)':isSel?'var(--color-primary, #1E3A5F)':'var(--color-muted, #475569)' }}>
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20, flexWrap:'wrap' }}>
              {selected !== null && !revealed && (
                <button onClick={() => setRevealed(true)} style={{
                  background:'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', border:'none',
                  borderRadius:12, padding:'11px 24px',
                  fontFamily:'Poppins,sans-serif', fontWeight:700,
                  fontSize:14, color:'var(--color-primary-dark, #1E3A5F)', cursor:'pointer' }}>
                  Submit →
                </button>
              )}
              {revealed && (
                <button onClick={() => { setSelected(null); setRevealed(false) }} style={{
                  background:'var(--color-primary, #1E3A5F)', border:'none', borderRadius:12,
                  padding:'11px 24px', fontFamily:'Poppins,sans-serif',
                  fontWeight:700, fontSize:14, color:'#fff', cursor:'pointer' }}>
                  Try Again
                </button>
              )}
            </div>
            {revealed && (
              <div style={{ marginTop:16, background:'rgba(34,197,94,0.12)',
                border:'1.5px solid var(--color-success, #22C55E)', borderRadius:16, padding:16 }}>
                <p style={{ color:'var(--color-success, #15803D)', fontWeight:700,
                  fontSize:14, marginBottom:6 }}>✅ Correct Answer: ₹400</p>
                <p style={{ color:'var(--color-success, #166534)', fontSize:13, lineHeight:1.6 }}>
                  💡 CP = SP ÷ (1 + P%) = 520 ÷ 1.3 = <strong>₹400</strong>
                </p>
                <p style={{ color:'var(--color-success, #166534)', fontSize:12, marginTop:4, opacity:0.85 }}>
                  🧠 Memory trick: 1.3 × CP = SP → CP = 520 ÷ 1.3
                </p>
                <p style={{ color:'var(--color-success, #15803D)', fontSize:11, marginTop:8,
                  fontStyle:'italic', opacity:0.7 }}>
                  + 6 more layers (deep concept, wrong option autopsy, cultural story, exam tip,
                  PYQ relevance) — available in 5 languages after login
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── LEADERBOARD ──────────────────────────────────────────────────
function LeaderboardPreview({ navigate }) {
  const ROWS = [
    { rank:1,    name:'Priya Sharma',   state:'Kerala',   exam:'NEET UG',  score:'97.4%', badge:'⚡ Unstoppable' },
    { rank:2,    name:'Rahul Kumar',    state:'Delhi',    exam:'UPSC CSE', score:'94.8%', badge:'👑 Thalavan'    },
    { rank:3,    name:'Aisha Mohammed', state:'Gujarat',  exam:'IBPS PO',  score:'93.1%', badge:'🦁 Baahuveer'   },
    { rank:4,    name:'Vikram Singh',   state:'Rajasthan',exam:'SSC CGL',  score:'92.6%', badge:'🥇 Gold King'   },
    { rank:5,    name:'Deepa Nair',     state:'TN',       exam:'NEET UG',  score:'91.9%', badge:'🌟 The Legend'  },
    { rank:1243, name:'You (Preview)',  state:'—',        exam:'—',        score:'?',     badge:'⛏️ Start Now', isYou:true },
  ]
  return (
    <section style={{ padding:'72px 20px',
      background:'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(22px,4vw,38px)', color:'var(--color-surface, #fff)', marginBottom:8 }}>
            🏆 Real All-India Rankings
          </h2>
          <p style={{ color:'rgba(var(--color-surface-rgb, 255,255,255), 0.6)', fontSize:15 }}>
            After every test. Live. Your name could be up here.
          </p>
        </div>
        <div style={{ background:'rgba(255,255,255,0.04)',
          borderRadius:22, overflow:'hidden',
          border:'1px solid rgba(212,175,55,0.2)' }}>
          <div style={{ background:'rgba(0,0,0,0.3)', padding:'12px 20px',
            display:'grid', gridTemplateColumns:'52px 1fr 90px 70px', gap:8 }}>
            {['Rank','Student','Exam','Score'].map(h => (
              <span key={h} style={{ color:'var(--color-accent, #D4AF37)', fontSize:11, fontWeight:700 }}>{h}</span>
            ))}
          </div>
          {ROWS.map((r,i) => (
            <div key={i} style={{ padding:'13px 20px',
              borderBottom:'1px solid rgba(255,255,255,0.05)',
              display:'grid', gridTemplateColumns:'52px 1fr 90px 70px',
              gap:8, alignItems:'center',
              background: r.isYou ? 'rgba(212,175,55,0.1)' : 'transparent',
              borderLeft: r.isYou ? '3px solid var(--color-accent, #D4AF37)' : '3px solid transparent' }}>
              <span style={{ color: i===0?'var(--color-accent, #D4AF37)':i===1?'#9CA3AF':i===2?'#CD7F32':'rgba(255,255,255,0.4)',
                fontSize: i<3?20:13, fontWeight:900 }}>
                {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${r.rank.toLocaleString()}`}
              </span>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                  <span style={{ color:'#fff', fontWeight:600, fontSize:13 }}>{r.name}</span>
                  {r.isYou && <span style={{ background:'var(--color-accent, #D4AF37)', color:'var(--color-primary-dark, #1E3A5F)',
                    fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>← YOU</span>}
                </div>
                <span style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>
                  {r.badge} · {r.state}
                </span>
              </div>
              <span style={{ background:'rgba(255,255,255,0.08)', color:'rgba(var(--color-surface-rgb, 255,255,255), 0.6)',
                fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:20,
                display:'inline-block' }}>{r.exam}</span>
              <span style={{ color:'var(--color-accent, #D4AF37)', fontWeight:800, fontSize:14 }}>{r.score}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:24 }}>
          <button onClick={() => navigate('/login')} style={{
            background:'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', border:'none',
            borderRadius:14, padding:'13px 36px',
            fontFamily:'Poppins,sans-serif', fontWeight:700,
            fontSize:16, color:'var(--color-primary-dark, #1E3A5F)', cursor:'pointer' }}>
            Claim Your Rank →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── FEATURES GRID ────────────────────────────────────────────────
function FeaturesGrid({ navigate }) {
  const FEATURES = [
    { emoji:'⚡', title:'Test Engine',        sub:'Mock · PYQ · Speed · Custom',      badge:'Core'     },
    { emoji:'🌌', title:'Exam Universe',      sub:'UPSC · JEE · NEET · CLAT · Foreign',badge:'9852+'   },
    { emoji:'🧭', title:'Career Compass',     sub:'8 questions → your perfect exam',   badge:'AI'      },
    { emoji:'🎓', title:'Guru Hub',           sub:'Ask · Answer · Earn',               badge:'Community'},
    { emoji:'🪪', title:'Student ID Card',    sub:'5 cinematic templates · 3D flip',   badge:'🔥 Viral' },
    { emoji:'👥', title:'The Hall',           sub:'Study squads · Battles',            badge:'Social'  },
    { emoji:'🎮', title:'Brain Games',        sub:'10 games · Coins · Tournaments',    badge:'Fun'     },
    { emoji:'🗺️', title:'My Roadmap',         sub:'Today → Exam Day planner',          badge:'Personal' },
    { emoji:'📚', title:'Swayam & Certifications', sub:'NPTEL · Coursera · UGC · More', badge:'Courses' },
    { emoji:'🌐', title:'40+ Languages',      sub:'Tamil · Hindi · Telugu · More',    badge:'Inclusive'},
    { emoji:'🎯', title:'Focus Mode',         sub:'Pomodoro · Ambient sounds · Coins', badge:'Study'   },
    { emoji:'🤝', title:'Free for 9 Tiers',  sub:'Orphans · Veer Naris · Trans · More',badge:'Equity' },
  ]
  return (
    <section id="features" style={{ padding:'72px 20px', background:'var(--color-bg, #F8FAFC)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(22px,4vw,40px)', color:'var(--color-text, #1E3A5F)', marginBottom:8 }}>
            Everything You Need to Crack Your Exam
          </h2>
          <p style={{ color:'var(--color-text-light, #64748B)', fontSize:15 }}>
            12 powerful tools. One platform. Built for every Indian student — from Class 6 to PhD.
          </p>
        </div>
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,240px),1fr))',
          gap:14 }}>
          {FEATURES.map((f,i) => (
            <div key={i} onClick={() => navigate('/login')}
              style={{ background:'var(--color-surface, #fff)', borderRadius:18, padding:18,
                border:'1.5px solid var(--color-border, #E2E8F0)', cursor:'pointer',
                transition:'all 0.2s',
                boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor='var(--color-accent, #D4AF37)'
                e.currentTarget.style.transform='translateY(-3px)'
                e.currentTarget.style.boxShadow='0 8px 24px rgba(212,175,55,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor='var(--color-border, #E2E8F0)'
                e.currentTarget.style.transform='none'
                e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'
              }}>
              <div style={{ display:'flex', justifyContent:'space-between',
                alignItems:'flex-start', marginBottom:10 }}>
                <span style={{ fontSize:30 }}>{f.emoji}</span>
                <span style={{ background:'var(--color-surface, #F8FAFC)', border:'1px solid var(--color-border, #E2E8F0)',
                  color:'var(--color-text-light, #64748B)', fontSize:9, fontWeight:700,
                  padding:'3px 8px', borderRadius:20 }}>{f.badge}</span>
              </div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                color:'var(--color-text, #1E3A5F)', fontSize:14, marginBottom:4 }}>{f.title}</p>
              <p style={{ color:'var(--color-accent, #D4AF37)', fontSize:11, fontWeight:600 }}>{f.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── EQUITY SECTION ───────────────────────────────────────────────
function EquitySection({ navigate }) {
  const TIERS = [
    { emoji:'🌱', name:'Hope Scholars',        free:true  },
    { emoji:'♿', name:'Physically Challenged', free:true  },
    { emoji:'🧹', name:'Swachhta Warriors',    free:true  },
    { emoji:'🎖️', name:"Martyrs' Families",   free:true  },
    { emoji:'🏳️‍⚧️',name:'Transgender Youth',  free:true  },
    { emoji:'🌾', name:'Agrarian Distress',    free:true  },
    { emoji:'🪖', name:'Active Military',      free:false },
    { emoji:'🏥', name:'ASHA / Anganwadi',     free:false },
    { emoji:'🌟', name:'First-Generation',     free:false },
  ]
  return (
    <section style={{ padding:'72px 20px',
      background:'linear-gradient(135deg, var(--color-primary-dark, #071428), var(--color-primary, #0F2140))' }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <span style={{ fontSize:'clamp(32px,5vw,52px)' }}>🇮🇳</span>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(24px,4vw,40px)', color:'var(--color-surface, #fff)', margin:'12px 0 8px' }}>
            TryIT Cares — Free For Life
          </h2>
          <p style={{ color:'var(--color-text-light, rgba(255,255,255,0.6))', fontSize:15,
            maxWidth:560, margin:'0 auto 8px' }}>
            6 communities get 100% free access for life.
            Including full support for Transgender youth via the SMILE Portal. 🏳️‍⚧️
          </p>
        </div>
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,260px),1fr))',
          gap:10, marginBottom:28 }}>
          {TIERS.map((t,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.04)',
              border:`1px solid ${t.free?'rgba(34,197,94,0.25)':'rgba(212,175,55,0.25)'}`,
              borderRadius:16, padding:'14px 16px',
              display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:24, flexShrink:0 }}>{t.emoji}</span>
              <span style={{ color:'#fff', fontFamily:'Poppins,sans-serif',
                fontWeight:600, fontSize:13, flex:1 }}>{t.name}</span>
              <span style={{ background: t.free?'rgba(34,197,94,0.18)':'rgba(212,175,55,0.15)',
                color: t.free? 'var(--color-success-light, #4ADE80)' : 'var(--color-accent, #D4AF37)',
                fontSize:9, fontWeight:800, padding:'3px 8px',
                borderRadius:20, flexShrink:0 }}>
                {t.free?'FREE':'DISC.'}
              </span>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center' }}>
          <button onClick={() => navigate('/equity')} style={{
            background:'linear-gradient(135deg, var(--color-success, #22C55E), #16A34A)', border:'none',
            borderRadius:14, padding:'13px 36px',
            fontFamily:'Poppins,sans-serif', fontWeight:700,
            fontSize:16, color:'var(--color-surface, #FFFFFF)', cursor:'pointer',
            boxShadow:'0 6px 20px rgba(34,197,94,0.3)' }}>
            Check Your Eligibility →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS ─────────────────────────────────────────────────
function Testimonials() {
  const ITEMS = [
    { n:'Arjun K.', s:'TN',     e:'SSC CGL', r:'#1,243',sc:'89%',
      t:'"Moved from #8,432 to #1,243 in 30 days!" 🔥', lv:'⛏️ Gold Miner' },
    { n:'Priya S.', s:'Kerala', e:'NEET UG', r:'#847', sc:'94%',
      t:'"Studied in Malayalam. Crystal clear explanations!" 🌴', lv:'💪 Grinder' },
    { n:'Rahul M.', s:'Bihar',  e:'UPSC CSE',r:'#2,341',sc:'82%',
      t:'"Career Compass told me to try UPSC + BPSC. Best decision!" 🎯', lv:'📈 Riser' },
    { n:'Zainab A.',s:'Hyd',    e:'IBPS PO', r:'#519', sc:'91%',
      t:'"Guru Hub answered my doubt at midnight in 7 minutes!" 🎓', lv:'🦁 Baahuveer' },
    { n:'Deepika R.',s:'Manipur',e:'CTET',   r:'#1,021',sc:'87%',
      t:'"First platform with Manipuri language. Thank you TryIT!" 🏔️', lv:'📈 Riser' },
    { n:'Ravi T.', s:'Punjab',  e:'NDA',     r:'#312', sc:'88%',
      t:'"Hall battles kept my whole batch studying every night!" 👥', lv:'🔥 Fierce' },
  ]
  return (
    <section style={{ padding:'60px 0', background:'var(--color-surface, #fff)', overflow:'hidden' }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:'clamp(22px,3.5vw,34px)', color:'var(--color-primary-dark, #1E3A5F)' }}>
          Real Students. Real Results.
        </h2>
      </div>
      <div style={{ display:'flex',
        animation:'scrollTicker 28s linear infinite',
        width:'max-content', gap:14 }}>
        {[...ITEMS,...ITEMS].map((t,i) => (
          <div key={i} style={{ width:270, background:'#F8FAFC',
            border:'1.5px solid var(--color-border, #E2E8F0)', borderRadius:18,
            padding:16, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{ width:38, height:38, borderRadius:'50%',
                background:'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--color-accent, #D4AF37)', fontWeight:900, fontSize:12, flexShrink:0 }}>
                {t.n.split(' ').map(x=>x[0]).join('')}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  color:'var(--color-text, #1E3A5F)', fontSize:13 }}>{t.n}</p>
                <p style={{ color:'var(--color-text-light, #94A3B8)', fontSize:11 }}>{t.s} · {t.e}</p>
              </div>
              <span style={{ background:'#FEF3C7', color:'#92400E',
                fontSize:9, fontWeight:700, padding:'2px 7px',
                borderRadius:20, flexShrink:0 }}>{t.lv}</span>
            </div>
            <p style={{ color:'#475569', fontSize:12, lineHeight:1.6 }}>{t.t}</p>
            <div style={{ display:'flex', gap:6, marginTop:8 }}>
              <span style={{ background:'#EDE9FE', color:'#7C3AED',
                fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>
                {t.r}
              </span>
              <span style={{ background:'#DCFCE7', color:'#15803D',
                fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>
                {t.sc}
              </span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scrollTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

// ── FINAL CTA ────────────────────────────────────────────────────
function FinalCTA({ navigate }) {
  return (
    <section style={{ padding:'72px 20px',
      background:'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
      textAlign:'center' }}>
      <div style={{ maxWidth:700, margin:'0 auto' }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
          fontSize:'clamp(26px,4vw,48px)', color:'var(--color-surface, #FFFFFF)', marginBottom:16 }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ color:'var(--color-text-light, rgba(255,255,255,0.65))', fontSize:16,
          maxWidth:520, margin:'0 auto 32px', lineHeight:1.7 }}>
          1,10,000+ exams. 40+ languages. Real rankings. Free for 9 communities.
          From Class 6 to PhD — for every Indian, at every age.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:16 }}>
          <button onClick={() => navigate('/login')} style={{
            background:'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', border:'none',
            borderRadius:18,
            padding:'clamp(14px,2vw,20px) clamp(32px,4vw,60px)',
            fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(16px,2.5vw,20px)', color:'var(--color-primary-dark, #1E3A5F)', cursor:'pointer' }}>
            Start Free Now →
          </button>
          <button onClick={() => navigate('/equity')} style={{
            background:'rgba(255,255,255,0.08)',
            border:'1.5px solid rgba(212,175,55,0.4)', borderRadius:18,
            padding:'clamp(14px,2vw,20px) clamp(24px,3vw,40px)',
            fontFamily:'Poppins,sans-serif', fontWeight:700,
            fontSize:'clamp(15px,2vw,18px)', color:'var(--color-surface, #FFFFFF)', cursor:'pointer' }}>
            🤝 Apply for Free Access
          </button>
        </div>
        <p style={{ color:'var(--color-text-light, rgba(255,255,255,0.3))', fontSize:12 }}>
          No credit card · No commitment · Free forever for eligible communities
        </p>
      </div>
    </section>
  )
}

// ── MAIN ─────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrollPct, setScrollPct] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setScrollPct(pct)
      setShowTop(el.scrollTop > 500)
    }
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    window.setTimeout(() => {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }, [location.hash])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    window.setTimeout(() => {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }, [location.hash])

  return (
    <div>
      <div style={{ position:'fixed', top:0, left:0, height:3, zIndex:9999,
        width:`${scrollPct}%`,
        background:'linear-gradient(90deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
        transition:'width 0.1s', pointerEvents:'none' }}/>

      <Navbar/>
      <Hero navigate={navigate}/>
      <StatsStrip/>
      <TestPreview/>
      <LeaderboardPreview navigate={navigate}/>
      <FeaturesGrid navigate={navigate}/>
      <EquitySection navigate={navigate}/>
      <EquityPricingSection navigate={navigate}/>
      <InstitutionSection/>
      <Testimonials/>
      <DonationSection/>
      <FinalCTA navigate={navigate}/>
      <Footer/>

      {showTop && (
        <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          style={{ position:'fixed', bottom:80, right:20, width:46, height:46,
            borderRadius:'50%', background:'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
            border:'none', cursor:'pointer', fontSize:20, zIndex:30,
            boxShadow:'0 4px 16px rgba(212,175,55,0.5)' }}>↑</button>
      )}
    </div>
  )
}
