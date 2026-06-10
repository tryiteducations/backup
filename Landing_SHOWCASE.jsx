import EquityPricingSection from '../components/landing/EquityPricingSection'
import DonationSection      from '../components/landing/DonationSection'
// TARGET_FILE: src/pages/Landing.jsx
// Full feature showcase — every section shows a LIVE PREVIEW
// of the actual app experience before login
// Fully responsive: iPhone SE (375px) → 4K desktop

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'

// ── Responsive helper ─────────────────────────────────────────────
const R = {
  section: { padding:'64px 20px' },
  container: { maxWidth:1200, margin:'0 auto', width:'100%' },
  h2: { fontFamily:'Poppins,sans-serif', fontWeight:900,
    fontSize:'clamp(24px,4vw,44px)', lineHeight:1.15 },
  p:  { fontFamily:'Inter,sans-serif', fontSize:'clamp(14px,2vw,17px)',
    lineHeight:1.7 },
  grid2: { display:'grid',
    gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,480px),1fr))',
    gap:28 },
  grid3: { display:'grid',
    gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))',
    gap:20 },
  grid4: { display:'grid',
    gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,240px),1fr))',
    gap:16 },
}

// ── Count-up hook ─────────────────────────────────────────────────
function useCountUp(target, duration=1800) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(!e.isIntersecting) return; obs.disconnect()
      const start=performance.now()
      const step=(now)=>{
        const p=Math.min((now-start)/duration,1)
        const eased=1-Math.pow(1-p,3)
        setCount(Math.floor(eased*target))
        if(p<1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    },{threshold:0.3})
    if(ref.current) obs.observe(ref.current)
    return ()=>obs.disconnect()
  },[target,duration])
  return [count, ref]
}

// ── HERO ──────────────────────────────────────────────────────────
function Hero({ navigate }) {
  return (
    <section style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      background:'linear-gradient(135deg,#071428 0%,#0F2140 45%,#1E3A5F 100%)',
      padding:'80px 20px 60px', position:'relative', overflow:'hidden',
    }}>
      {/* Rings */}
      {[400,650,900].map((s,i)=>(
        <div key={i} style={{ position:'absolute', width:s, height:s,
          borderRadius:'50%', border:`1px solid rgba(212,175,55,${0.07-i*0.02})`,
          top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          pointerEvents:'none', animation:`ringPulse ${4+i}s ease-in-out ${i*0.5}s infinite` }}/>
      ))}

      <div style={{ ...R.container, display:'grid',
        gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,420px),1fr))',
        gap:48, alignItems:'center', position:'relative', zIndex:2 }}>

        {/* Left */}
        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.3)',
            borderRadius:20, padding:'7px 16px', marginBottom:24 }}>
            <span>🚀</span>
            <span style={{ color:'#D4AF37', fontSize:'clamp(11px,2vw,13px)',
              fontWeight:600, fontFamily:'Inter,sans-serif' }}>
              India's First Complete Exam Platform
            </span>
          </div>

          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(36px,6vw,72px)', lineHeight:1.05, marginBottom:16 }}>
            <span style={{ color:'#fff' }}>One App.</span><br/>
            <span style={{ color:'#D4AF37' }}>Every Exam.</span><br/>
            <span style={{ color:'#fff' }}>Zero Barriers.</span>
          </h1>
          <p style={{ color:'#D4AF37', fontStyle:'italic', fontSize:'clamp(15px,2vw,19px)',
            marginBottom:8 }}>Your Exam. Your Rank. Your Success.</p>
          <p style={{ ...R.p, color:'rgba(255,255,255,0.65)', maxWidth:500, marginBottom:32 }}>
            1,10,000+ exam pathways. 40+ Indian languages. Real All-India rankings.
            100% free for 6 vulnerable communities. From Class 6 to retirement — for every Indian.
          </p>

          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:28 }}>
            <button onClick={()=>navigate('/login')} style={{
              background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
              border:'none', borderRadius:16, padding:'clamp(12px,2vw,18px) clamp(24px,3vw,40px)',
              fontFamily:'Poppins,sans-serif', fontWeight:800,
              fontSize:'clamp(15px,2vw,18px)', color:'#1E3A5F', cursor:'pointer' }}>
              Start Free →
            </button>
            <button onClick={()=>navigate('/equity')} style={{
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,175,55,0.4)',
              borderRadius:16, padding:'clamp(12px,2vw,18px) clamp(20px,3vw,28px)',
              fontFamily:'Poppins,sans-serif', fontWeight:700,
              fontSize:'clamp(14px,2vw,16px)', color:'#fff', cursor:'pointer' }}>
              🤝 Free Access for 9 Communities
            </button>
          </div>

          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {['🔒 Secure','💳 ₹19 Trial','🌐 40+ Languages',
              '🏆 Real Rankings','🤝 Free for Life (6 tiers)','🏳️‍⚧️ Trans Inclusive'].map(t=>(
              <span key={t} style={{ background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.1)', borderRadius:20,
                padding:'5px 12px', color:'rgba(255,255,255,0.6)',
                fontSize:'clamp(10px,1.5vw,12px)', fontFamily:'Inter,sans-serif' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right — App preview cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Rank card */}
          <div style={{ background:'rgba(15,33,64,0.9)',
            border:'1px solid rgba(212,175,55,0.3)', borderRadius:20,
            padding:18, backdropFilter:'blur(20px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ width:46, height:46, borderRadius:'50%',
                background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:900, fontSize:16, color:'#1E3A5F', flexShrink:0 }}>AK</div>
              <div>
                <p style={{ color:'#fff', fontWeight:700, fontFamily:'Poppins,sans-serif', fontSize:14 }}>
                  Arjun K. — Tamil Nadu</p>
                <p style={{ color:'#D4AF37', fontSize:12 }}>⛏️ The Gold Miner · SSC CGL</p>
              </div>
            </div>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, marginBottom:12 }}>
              "Moved from #8,432 → <strong style={{color:'#D4AF37'}}>#1,243</strong> in 30 days! 🔥"
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ flex:1, height:6, borderRadius:3, background:'rgba(255,255,255,0.08)' }}>
                <div style={{ width:'67%', height:6, borderRadius:3,
                  background:'linear-gradient(90deg,#D4AF37,#E8C84A)' }}/>
              </div>
              <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700 }}>67% Ready</span>
            </div>
          </div>

          {/* Level badge */}
          <div style={{ background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            borderRadius:20, padding:'16px 20px',
            display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:40 }}>🦁</span>
            <div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                color:'#1E3A5F', fontSize:'clamp(16px,2.5vw,22px)' }}>Baahuveer</p>
              <p style={{ color:'rgba(30,58,95,0.7)', fontSize:13 }}>Level 6 — The Warrior King</p>
              <p style={{ color:'rgba(30,58,95,0.65)', fontSize:12, marginTop:3 }}>
                🎬 Indian cinema meets exam glory
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)', borderRadius:20,
            padding:16, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {[['1,10,000+','Exams'],['40+','Languages'],['#1,243','Your Rank']].map(([v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <p style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif',
                  fontWeight:900, fontSize:'clamp(16px,2.5vw,22px)' }}>{v}</p>
                <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ringPulse { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1}
          50%{transform:translate(-50%,-50%) scale(1.05);opacity:0.4} }
      `}</style>
    </section>
  )
}

// ── STATS STRIP ───────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    { target:110000, suffix:'+', label:'Exam Pathways' },
    { target:40,     suffix:'+', label:'Indian Languages' },
    { target:50000,  suffix:'+', label:'Students' },
    { target:9852,   suffix:'',  label:'Verified Exams' },
    { target:28,     suffix:'/28',label:'States Covered' },
  ]
  const refs = stats.map(()=>useRef(null))
  const [counts, setCounts] = useState(stats.map(()=>0))

  useEffect(()=>{
    refs.forEach((ref,i)=>{
      const obs=new IntersectionObserver(([e])=>{
        if(!e.isIntersecting) return; obs.disconnect()
        const start=performance.now(), dur=1800, target=stats[i].target
        const step=(now)=>{
          const p=Math.min((now-start)/dur,1), eased=1-Math.pow(1-p,3)
          setCounts(prev=>{const n=[...prev]; n[i]=Math.floor(eased*target); return n})
          if(p<1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },{threshold:0.3})
      if(ref.current) obs.observe(ref.current)
    })
  },[])

  return (
    <section style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', padding:'32px 20px' }}>
      <div style={{ ...R.container, display:'flex', flexWrap:'wrap',
        justifyContent:'center', borderLeft:'1px solid rgba(255,255,255,0.06)' }}>
        {stats.map((s,i)=>(
          <div key={i} ref={refs[i]} style={{ flex:'1 1 150px', textAlign:'center',
            padding:'18px 16px', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(26px,4vw,44px)', color:'#D4AF37', lineHeight:1 }}>
              {counts[i].toLocaleString()}{s.suffix}
            </p>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13, marginTop:4 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── TEST ENGINE PREVIEW ───────────────────────────────────────────
function TestPreview() {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const q = {
    text:'A shopkeeper sells an item for ₹520 and earns 30% profit. What is the cost price?',
    options:['₹400','₹380','₹420','₹350'],
    correct:0,
    exam:'SSC CGL', subject:'Quantitative Aptitude', difficulty:'Medium',
  }
  return (
    <section style={{ ...R.section, background:'#F8FAFC' }}>
      <div style={R.container}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <span style={{ background:'#EDE9FE', color:'#7C3AED', fontSize:12,
            fontWeight:700, padding:'4px 14px', borderRadius:20,
            letterSpacing:'1px', fontFamily:'Poppins,sans-serif' }}>
            LIVE PREVIEW
          </span>
          <h2 style={{ ...R.h2, color:'#1E3A5F', margin:'12px 0 8px' }}>
            ⚡ Test Engine
          </h2>
          <p style={{ ...R.p, color:'#64748B' }}>
            Try a real question right now — no login needed
          </p>
        </div>

        <div style={{ maxWidth:680, margin:'0 auto',
          background:'#fff', borderRadius:24,
          boxShadow:'0 8px 40px rgba(30,58,95,0.1)',
          border:'1.5px solid #E2E8F0', overflow:'hidden' }}>

          {/* Test header */}
          <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
            padding:'14px 20px', display:'flex', justifyContent:'space-between',
            alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {[q.exam, q.subject, q.difficulty].map(tag=>(
                <span key={tag} style={{ background:'rgba(212,175,55,0.2)',
                  color:'#D4AF37', fontSize:11, fontWeight:700,
                  padding:'3px 10px', borderRadius:20 }}>{tag}</span>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>⏱ 1:24</span>
              <div style={{ display:'flex', gap:4 }}>
                {[1,2,3,4,5].map(n=>(
                  <div key={n} style={{ width:24, height:24, borderRadius:6,
                    background: n===1?'rgba(212,175,55,0.4)':'rgba(255,255,255,0.1)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'rgba(255,255,255,0.6)', fontSize:10 }}>{n}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Question */}
          <div style={{ padding:'24px 20px' }}>
            <p style={{ color:'#1E293B', fontSize:'clamp(14px,2vw,16px)',
              fontWeight:600, lineHeight:1.6, marginBottom:20,
              fontFamily:'Poppins,sans-serif' }}>
              Q1. {q.text}
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.options.map((opt,i)=>{
                const letter = ['A','B','C','D'][i]
                const isSelected = selected === i
                const isCorrect  = revealed && i === q.correct
                const isWrong    = revealed && isSelected && i !== q.correct
                return (
                  <button key={i} onClick={()=>{ if(!revealed) setSelected(i) }}
                    style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'13px 16px', borderRadius:14, cursor:'pointer',
                      border:`2px solid ${isCorrect?'#22C55E':isWrong?'#EF4444':isSelected?'#1E3A5F':'#E2E8F0'}`,
                      background: isCorrect?'#DCFCE7':isWrong?'#FEE2E2':isSelected?'rgba(30,58,95,0.06)':'#F8FAFC',
                      textAlign:'left', width:'100%', transition:'all 0.2s',
                    }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0,
                      background: isCorrect?'#22C55E':isWrong?'#EF4444':isSelected?'#1E3A5F':'#E2E8F0',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color: isSelected||isCorrect||isWrong?'#fff':'#64748B',
                      fontWeight:800, fontSize:13 }}>
                      {isCorrect?'✓':isWrong?'✗':letter}
                    </div>
                    <span style={{ color: isCorrect?'#15803D':isWrong?'#991B1B':isSelected?'#1E3A5F':'#475569',
                      fontWeight: isSelected||isCorrect?700:500, fontSize:15 }}>{opt}</span>
                  </button>
                )
              })}
            </div>

            <div style={{ display:'flex', gap:10, marginTop:20, flexWrap:'wrap' }}>
              {selected !== null && !revealed && (
                <button onClick={()=>setRevealed(true)} style={{
                  background:'linear-gradient(135deg,#D4AF37,#E8C84A)', border:'none',
                  borderRadius:12, padding:'11px 24px',
                  fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
                  color:'#1E3A5F', cursor:'pointer' }}>Submit →</button>
              )}
              {revealed && (
                <button onClick={()=>{ setSelected(null); setRevealed(false) }} style={{
                  background:'#1E3A5F', border:'none', borderRadius:12, padding:'11px 24px',
                  fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
                  color:'#fff', cursor:'pointer' }}>Try Again</button>
              )}
              {!revealed && (
                <button style={{ background:'none',
                  border:'1.5px solid #E2E8F0', borderRadius:12, padding:'11px 20px',
                  color:'#64748B', cursor:'pointer', fontFamily:'Poppins,sans-serif',
                  fontWeight:600, fontSize:14 }}>📚 7-Layer Explanation</button>
              )}
            </div>

            {/* 7-layer explanation teaser */}
            {revealed && (
              <div style={{ marginTop:16, background:'#F0FDF4',
                border:'1.5px solid #22C55E', borderRadius:16, padding:16 }}>
                <p style={{ color:'#15803D', fontWeight:700, fontSize:14,
                  marginBottom:8 }}>✅ Correct Answer: ₹400</p>
                <p style={{ color:'#166534', fontSize:13, lineHeight:1.6 }}>
                  💡 CP = SP ÷ (1 + P%) = 520 ÷ 1.3 = <strong>₹400</strong>
                </p>
                <p style={{ color:'#166534', fontSize:12, marginTop:6, opacity:0.8 }}>
                  🧠 Memory trick: 1.3 × CP = SP → CP = 520 ÷ 1.3
                </p>
                <p style={{ color:'#15803D', fontSize:11, marginTop:8, fontStyle:'italic' }}>
                  + 6 more layers (deep concept, wrong option autopsy, cultural story,
                  exam tip, PYQ relevance) available after login
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── LEADERBOARD PREVIEW ───────────────────────────────────────────
function LeaderboardPreview({ navigate }) {
  const ROWS = [
    { rank:1,    name:'Priya Sharma',   state:'Kerala',    exam:'NEET UG',  score:'97.4%', badge:'⚡ Unstoppable' },
    { rank:2,    name:'Rahul Kumar',    state:'Delhi',     exam:'UPSC CSE', score:'94.8%', badge:'👑 Thalavan'    },
    { rank:3,    name:'Aisha Mohammed', state:'Gujarat',   exam:'IBPS PO',  score:'93.1%', badge:'🦁 Baahuveer'   },
    { rank:4,    name:'Vikram Singh',   state:'Rajasthan', exam:'SSC CGL',  score:'92.6%', badge:'🥇 Gold King'   },
    { rank:5,    name:'Deepa Nair',     state:'TN',        exam:'NEET UG',  score:'91.9%', badge:'🌟 The Legend'  },
    { rank:1243, name:'You (Preview)',  state:'—',         exam:'—',        score:'—',     badge:'⛏️ Start Now',  isYou:true },
  ]
  return (
    <section style={{ ...R.section, background:'linear-gradient(135deg,#1E3A5F,#0F2140)' }}>
      <div style={R.container}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <h2 style={{ ...R.h2, color:'#fff', marginBottom:8 }}>
            🏆 Real All-India Rankings
          </h2>
          <p style={{ ...R.p, color:'rgba(255,255,255,0.6)' }}>
            After every test. Live. Updated instantly. Your name up here — for real.
          </p>
        </div>
        <div style={{ maxWidth:780, margin:'0 auto',
          background:'rgba(255,255,255,0.04)', borderRadius:24,
          border:'1px solid rgba(212,175,55,0.2)', overflow:'hidden' }}>
          <div style={{ background:'rgba(0,0,0,0.3)', padding:'12px 20px',
            display:'grid', gridTemplateColumns:'52px 1fr 90px 80px',
            gap:8, alignItems:'center' }}>
            {['Rank','Student','Exam','Score'].map(h=>(
              <span key={h} style={{ color:'#D4AF37', fontSize:11,
                fontWeight:700, letterSpacing:'1px' }}>{h}</span>
            ))}
          </div>
          {ROWS.map((r,i)=>(
            <div key={i} style={{
              padding:'13px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)',
              display:'grid', gridTemplateColumns:'52px 1fr 90px 80px',
              gap:8, alignItems:'center',
              background: r.isYou?'rgba(212,175,55,0.1)':'transparent',
              borderLeft: r.isYou?'3px solid #D4AF37':'3px solid transparent',
            }}>
              <span style={{ color: i===0?'#D4AF37':i===1?'#9CA3AF':i===2?'#CD7F32':'rgba(255,255,255,0.4)',
                fontSize: i<3?20:13, fontWeight:900 }}>
                {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${r.rank.toLocaleString()}`}
              </span>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <span style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{r.name}</span>
                  {r.isYou && <span style={{ background:'#D4AF37', color:'#1E3A5F',
                    fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>← YOU</span>}
                </div>
                <span style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>
                  {r.badge} · {r.state}
                </span>
              </div>
              <span style={{ background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)',
                fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:20,
                display:'inline-block' }}>{r.exam}</span>
              <span style={{ color:'#D4AF37', fontWeight:800, fontSize:14 }}>{r.score}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:24 }}>
          <button onClick={()=>navigate('/login')} style={{
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)', border:'none',
            borderRadius:14, padding:'13px 36px',
            fontFamily:'Poppins,sans-serif', fontWeight:700,
            fontSize:16, color:'#1E3A5F', cursor:'pointer' }}>
            Claim Your Rank →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── GAMIFICATION PREVIEW ──────────────────────────────────────────
function GamificationPreview({ navigate }) {
  const LEVELS = [
    { l:1, title:'The Fierce One', emoji:'🔥', color:'#EF4444', xp:'0–500'    },
    { l:2, title:'The Fighter',    emoji:'⚔️', color:'#F97316', xp:'500–1.5K' },
    { l:3, title:'The Riser',      emoji:'📈', color:'#EAB308', xp:'1.5–3K'   },
    { l:4, title:'The Gold Miner', emoji:'⛏️', color:'#D4AF37', xp:'3–6K'     },
    { l:5, title:'The Grinder',    emoji:'💪', color:'#22C55E', xp:'6–10K'    },
    { l:6, title:'Baahuveer',      emoji:'🦁', color:'#D4AF37', xp:'10–16K', cinema:'Baahubali' },
    { l:7, title:'Thalavan',       emoji:'👑', color:'#8B5CF6', xp:'16–24K', cinema:'The Boss'  },
    { l:8, title:'Unstoppable',    emoji:'⚡', color:'#06B6D4', xp:'24–35K'   },
    { l:9, title:'The Legend',     emoji:'🌟', color:'#D4AF37', xp:'35–50K'   },
    { l:10,title:'The Absolute',   emoji:'🏆', color:'#D4AF37', xp:'50K+'     },
  ]
  const [hoveredLevel, setHovered] = useState(null)
  return (
    <section style={{ ...R.section, background:'#F8FAFC' }}>
      <div style={R.container}>
        <div style={{ ...R.grid2, alignItems:'center', gap:40 }}>
          <div>
            <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:12,
              fontWeight:700, padding:'4px 14px', borderRadius:20,
              fontFamily:'Poppins,sans-serif', letterSpacing:'1px' }}>
              CINEMATIC LEVEL SYSTEM
            </span>
            <h2 style={{ ...R.h2, color:'#1E3A5F', margin:'14px 0 12px' }}>
              🎬 Your Study Journey<br/>Told Like an Epic Film
            </h2>
            <p style={{ ...R.p, color:'#64748B', marginBottom:20 }}>
              Every rank has a legendary title inspired by Indian cinema and culture.
              Level 6 is Baahuveer (Baahubali). Level 7 is Thalavan (The Boss).
              Earn XP. Rise through 10 cinematic levels.
            </p>
            {/* XP bar demo */}
            <div style={{ background:'white', borderRadius:16,
              padding:16, border:'1.5px solid #E2E8F0', marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  color:'#1E3A5F', fontSize:14 }}>⛏️ Level 4 — The Gold Miner</span>
                <span style={{ color:'#D4AF37', fontWeight:700, fontSize:13 }}>6,240 / 8,000 XP</span>
              </div>
              <div style={{ height:10, background:'#F1F5F9', borderRadius:5 }}>
                <div style={{ width:'78%', height:10, borderRadius:5,
                  background:'linear-gradient(90deg,#D4AF37,#E8C84A)' }}/>
              </div>
              <p style={{ color:'#94A3B8', fontSize:11, marginTop:6 }}>
                1,760 XP to Level 5 — The Grinder 💪
              </p>
            </div>
            <button onClick={()=>navigate('/login')} style={{
              background:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'none',
              borderRadius:12, padding:'11px 24px', color:'#D4AF37',
              fontFamily:'Poppins,sans-serif', fontWeight:700,
              fontSize:14, cursor:'pointer' }}>
              See All 10 Levels →
            </button>
          </div>

          {/* Level grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10 }}>
            {LEVELS.map(lv=>(
              <div key={lv.l}
                onMouseEnter={()=>setHovered(lv.l)}
                onMouseLeave={()=>setHovered(null)}
                style={{
                  background: hoveredLevel===lv.l ? `${lv.color}18` : 'white',
                  border:`1.5px solid ${hoveredLevel===lv.l ? lv.color : '#E2E8F0'}`,
                  borderRadius:16, padding:'12px 10px', textAlign:'center',
                  cursor:'pointer', transition:'all 0.2s',
                  transform: hoveredLevel===lv.l ? 'translateY(-3px)' : 'none',
                  boxShadow: hoveredLevel===lv.l ? `0 8px 20px ${lv.color}33` : 'none',
                }}>
                <div style={{ fontSize:26, marginBottom:6 }}>{lv.emoji}</div>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  color:'#1E293B', fontSize:12, marginBottom:3 }}>{lv.title}</p>
                {lv.cinema && <p style={{ color:lv.color, fontSize:10,
                  fontStyle:'italic', marginBottom:3 }}>🎬 {lv.cinema}</p>}
                <span style={{ background:`${lv.color}20`, color:lv.color,
                  fontSize:10, fontWeight:700, padding:'2px 8px',
                  borderRadius:20 }}>Lv {lv.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── GURU HUB PREVIEW ──────────────────────────────────────────────
function GuruHubPreview({ navigate }) {
  const [reactions, setReactions] = useState({})
  const react = (key) => setReactions(p=>({ ...p, [key]: !p[key] }))

  const DOUBT = {
    user:'Priya S.', initials:'PS', exam:'UPSC CSE', subject:'Polity',
    question:'What is the difference between Fundamental Rights and Directive Principles? Why can DPSP not be enforced in court?',
    timeAgo:'15 min ago', views:412,
    answer:{
      mentor:'Ananya IAS', initials:'AI', badge:'Baahuveer 🦁',
      rating:5.0, timeAgo:'20 min ago',
      text:'Fundamental Rights (Part III): Justiciable — enforceable via Art 32 in Supreme Court. They are negative rights — restrict state action.\n\nDPSPs (Part IV): Non-justiciable — Art 37 says courts cannot enforce them. They are guidelines for state policy. Positive obligations.\n\nKey reason: DPSPs need resources to implement. Framers knew newly independent India couldn\'t guarantee socio-economic rights immediately. 🎯',
    },
    reactions:{ fire:89, bulb:56, heart:34, star:71 },
  }
  const EMOJI = { fire:'🔥', bulb:'💡', heart:'❤️', star:'⭐' }
  return (
    <section style={{ ...R.section, background:'linear-gradient(180deg,#F8FAFC,#EFF6FF)' }}>
      <div style={R.container}>
        <div style={{ ...R.grid2, alignItems:'center', gap:40 }}>
          <div>
            <span style={{ background:'#EFF6FF', color:'#0369A1', fontSize:12,
              fontWeight:700, padding:'4px 14px', borderRadius:20, fontFamily:'Poppins,sans-serif' }}>
              LIVE PREVIEW
            </span>
            <h2 style={{ ...R.h2, color:'#1E3A5F', margin:'14px 0 12px' }}>
              🎓 Guru Hub
            </h2>
            <p style={{ ...R.p, color:'#64748B', marginBottom:16 }}>
              Post a doubt. Get answered by a verified mentor within 2 hours.
              React with emojis. Mentors earn ₹50–₹500/week.
            </p>
            <div style={{ ...R.grid3, gap:12, marginBottom:20 }}>
              {[['👥','50,000+','Students Active'],['🎓','847','Mentors'],['⚡','2 hrs','Avg Answer']].map(([e,v,l])=>(
                <div key={l} style={{ background:'white', borderRadius:14, padding:14,
                  border:'1.5px solid #E2E8F0', textAlign:'center' }}>
                  <p style={{ fontSize:22 }}>{e}</p>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                    color:'#D4AF37', fontSize:18 }}>{v}</p>
                  <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
                </div>
              ))}
            </div>
            <button onClick={()=>navigate('/login')} style={{
              background:'linear-gradient(135deg,#D4AF37,#E8C84A)', border:'none',
              borderRadius:12, padding:'11px 24px',
              fontFamily:'Poppins,sans-serif', fontWeight:700,
              fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>
              Ask Your First Doubt →
            </button>
          </div>

          {/* Live doubt card */}
          <div style={{ background:'white', borderRadius:24,
            boxShadow:'0 8px 40px rgba(30,58,95,0.1)',
            border:'1.5px solid #E2E8F0', padding:20 }}>
            {/* Doubt header */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:12 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:'#1E3A5F',
                color:'#D4AF37', fontWeight:800, fontSize:13, display:'flex',
                alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {DOUBT.initials}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                  <span style={{ fontWeight:700, color:'#1E293B', fontSize:13 }}>{DOUBT.user}</span>
                  <span style={{ background:'#1E3A5F', color:'#D4AF37', fontSize:10,
                    fontWeight:700, padding:'2px 8px', borderRadius:20 }}>{DOUBT.exam}</span>
                  <span style={{ background:'#F1F5F9', color:'#64748B', fontSize:10,
                    padding:'2px 8px', borderRadius:20 }}>{DOUBT.subject}</span>
                </div>
                <span style={{ color:'#94A3B8', fontSize:11 }}>
                  {DOUBT.timeAgo} · 👁 {DOUBT.views}
                </span>
              </div>
            </div>
            <p style={{ color:'#1E293B', fontWeight:600, fontSize:14, lineHeight:1.6, marginBottom:12 }}>
              {DOUBT.question}
            </p>
            {/* Reactions */}
            <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
              {Object.entries(DOUBT.reactions).map(([type,count])=>(
                <button key={type} onClick={()=>react(`d_${type}`)}
                  style={{ display:'flex', alignItems:'center', gap:5,
                    padding:'5px 12px', borderRadius:20,
                    border:`1.5px solid ${reactions[`d_${type}`]?'#D4AF37':'#E2E8F0'}`,
                    background: reactions[`d_${type}`]?'rgba(212,175,55,0.1)':'#F8FAFC',
                    cursor:'pointer', fontSize:13, fontWeight:600, color:'#475569' }}>
                  {EMOJI[type]} {count+(reactions[`d_${type}`]?1:0)}
                </button>
              ))}
            </div>
            {/* Best answer */}
            <div style={{ background:'#F0FDF4', border:'2px solid #22C55E',
              borderRadius:16, padding:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                <div style={{ width:32, height:32, borderRadius:'50%',
                  background:'#D4AF37', color:'#1E3A5F', fontWeight:800,
                  fontSize:12, display:'flex', alignItems:'center',
                  justifyContent:'center', flexShrink:0 }}>{DOUBT.answer.initials}</div>
                <span style={{ fontWeight:700, color:'#1E293B', fontSize:13 }}>
                  {DOUBT.answer.mentor}</span>
                <span style={{ background:'#22C55E', color:'white',
                  fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>
                  ✅ Best Answer</span>
                <span style={{ background:'rgba(212,175,55,0.2)', color:'#1E3A5F',
                  fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>
                  {DOUBT.answer.badge}</span>
                <span style={{ marginLeft:'auto', color:'#F59E0B', fontWeight:700, fontSize:12 }}>
                  ⭐ {DOUBT.answer.rating}</span>
              </div>
              <p style={{ color:'#166534', fontSize:13, lineHeight:1.7, whiteSpace:'pre-line' }}>
                {DOUBT.answer.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── ALL FEATURES GRID ─────────────────────────────────────────────
function FeaturesGrid({ navigate }) {
  const FEATURES = [
    { emoji:'⚡', title:'Test Engine', sub:'Mock · PYQ · Speed · Custom',
      color:'#1E3A5F', badge:'Core', stats:'2.4M tests taken' },
    { emoji:'🌌', title:'Exam Universe', sub:'Full exam profiles A–Z',
      color:'#7C3AED', badge:'Exclusive', stats:'9,852 profiles' },
    { emoji:'🧭', title:'Career Compass', sub:'8-question → exam match',
      color:'#065F46', badge:'AI', stats:'12 min to find path' },
    { emoji:'🎓', title:'Guru Hub', sub:'Ask · Answer · Earn',
      color:'#0369A1', badge:'Community', stats:'50k+ students' },
    { emoji:'🪪', title:'Student ID Card', sub:'5 cinematic templates · 3D flip',
      color:'#D4AF37', badge:'🔥 Viral', stats:'Share your rank' },
    { emoji:'👥', title:'The Hall', sub:'Study squads · Battles',
      color:'#1E3A5F', badge:'Social', stats:'Weekly battles' },
    { emoji:'🎮', title:'Brain Games', sub:'10 games · Coins · Live',
      color:'#991B1B', badge:'Fun', stats:'3.1M played' },
    { emoji:'🗺️', title:'My Roadmap', sub:'Today → Exam Day planner',
      color:'#065F46', badge:'Personal', stats:'Auto-adjusts daily' },
    { emoji:'📡', title:'Exam Watch', sub:'Deadlines · Alerts · Results',
      color:'#DC2626', badge:'Alerts', stats:'Zero spam' },
    { emoji:'🎯', title:'Focus Mode', sub:'Pomodoro · Ambient sounds',
      color:'#0F2140', badge:'Study', stats:'Earn coins studying' },
    { emoji:'🎓', title:'Scholarships', sub:'800+ scholarships tracked',
      color:'#D4AF37', badge:'₹ Free', stats:'Deadline alerts' },
    { emoji:'📚', title:'Guru Books', sub:'Buy · Sell · Secure PDF',
      color:'#7C3AED', badge:'New', stats:'Mentor marketplace' },
    { emoji:'♿', title:'Full Accessibility', sub:'3 modes — blind/deaf/motor',
      color:'#0369A1', badge:'Inclusive', stats:'Every student' },
    { emoji:'🌐', title:'40+ Languages', sub:'Study in your mother tongue',
      color:'#059669', badge:'India-first', stats:'+5 languages/week' },
    { emoji:'🤝', title:'Free for 9 Tiers', sub:'Orphans · Veterans · Trans · More',
      color:'#D97706', badge:'Equity', stats:'100% free for life' },
  ]
  const [hovered, setHovered] = useState(null)
  return (
    <section style={{ ...R.section, background:'#F8FAFC' }}>
      <div style={R.container}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <h2 style={{ ...R.h2, color:'#1E3A5F', marginBottom:10 }}>
            Everything You Need to Crack Your Exam
          </h2>
          <p style={{ ...R.p, color:'#64748B' }}>
            15 powerful features. One platform. Built for every Indian student.
          </p>
        </div>
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,260px),1fr))',
          gap:16 }}>
          {FEATURES.map((f,i)=>(
            <div key={i}
              onClick={()=>navigate('/login')}
              onMouseEnter={()=>setHovered(i)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                background:'#fff', borderRadius:20, padding:20,
                border:`1.5px solid ${hovered===i?'#D4AF37':'#E2E8F0'}`,
                cursor:'pointer', transition:'all 0.2s',
                transform: hovered===i?'translateY(-4px)':'none',
                boxShadow: hovered===i?'0 12px 30px rgba(212,175,55,0.15)':'0 2px 8px rgba(0,0,0,0.04)',
              }}>
              <div style={{ display:'flex', justifyContent:'space-between',
                alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontSize:34 }}>{f.emoji}</span>
                <span style={{
                  background: f.badge==='🔥 Viral'?'#FEF3C7':f.badge==='Equity'?'#FEF3C7':
                    f.badge==='Inclusive'?'#EFF6FF':'#F0FDF4',
                  color: f.badge==='🔥 Viral'?'#92400E':f.badge==='Equity'?'#92400E':
                    f.badge==='Inclusive'?'#0369A1':'#065F46',
                  fontSize:9, fontWeight:800, padding:'3px 10px',
                  borderRadius:20, letterSpacing:'0.5px' }}>{f.badge}</span>
              </div>
              <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                color:'#1E3A5F', fontSize:15, marginBottom:4 }}>{f.title}</h3>
              <p style={{ color:'#D4AF37', fontSize:11,
                fontWeight:600, marginBottom:8 }}>{f.sub}</p>
              <p style={{ color:'#94A3B8', fontSize:11 }}>📊 {f.stats}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── EQUITY SECTION (9 Tiers incl. Transgender) ───────────────────
function EquitySection({ navigate }) {
  const TIERS = [
    { emoji:'🌱', name:'Hope Scholars',       desc:'Orphans & welfare home children',   free:true  },
    { emoji:'♿', name:'Physically Challenged',desc:'UDID verified — all 21 categories', free:true  },
    { emoji:'🧹', name:"Swachhta Warriors",   desc:"Children of sanitation workers",    free:true  },
    { emoji:'🎖️', name:"Martyr's Families",   desc:'Veer Naris & children of martyrs',  free:true  },
    { emoji:'🏳️‍⚧️',name:'Transgender Youth',  desc:'SMILE Portal verified',             free:true  },
    { emoji:'🌾', name:'Agrarian Distress',   desc:'Farming crisis & natural disasters', free:true  },
    { emoji:'🪖', name:'Active Military',     desc:'Defense families — 30% OFF',        free:false },
    { emoji:'🏥', name:'ASHA/Anganwadi',      desc:'Health worker families — 30% OFF',  free:false },
    { emoji:'🌟', name:'First-Generation',    desc:'First in family in college — 15–25% OFF', free:false },
  ]
  return (
    <section style={{ ...R.section, background:'linear-gradient(135deg,#071428,#0F2140)' }}>
      <div style={R.container}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <span style={{ fontSize:'clamp(32px,5vw,56px)' }}>🇮🇳</span>
          <h2 style={{ ...R.h2, color:'#fff', margin:'12px 0 8px' }}>
            TryIT Cares — Free For Life
          </h2>
          <p style={{ ...R.p, color:'rgba(255,255,255,0.6)', maxWidth:580, margin:'0 auto 8px' }}>
            India's most comprehensive education equity program.
            6 communities get 100% free access for life.
            3 more get lifetime discounts.
          </p>
          <p style={{ color:'#D4AF37', fontSize:14, fontStyle:'italic' }}>
            Including full support for the Transgender community via SMILE Portal 🏳️‍⚧️
          </p>
        </div>
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,280px),1fr))',
          gap:12, marginBottom:28 }}>
          {TIERS.map((t,i)=>(
            <div key={i} style={{
              background:'rgba(255,255,255,0.04)',
              border:`1px solid ${t.free?'rgba(34,197,94,0.3)':'rgba(212,175,55,0.3)'}`,
              borderRadius:18, padding:'16px 18px',
              display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:28, flexShrink:0 }}>{t.emoji}</span>
              <div style={{ flex:1 }}>
                <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif',
                  fontWeight:700, fontSize:13 }}>{t.name}</p>
                <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11,
                  marginTop:2 }}>{t.desc}</p>
              </div>
              <span style={{
                background: t.free?'rgba(34,197,94,0.2)':'rgba(212,175,55,0.15)',
                color: t.free?'#4ADE80':'#D4AF37',
                fontSize:9, fontWeight:800, padding:'4px 10px',
                borderRadius:20, flexShrink:0, letterSpacing:'0.5px',
                whiteSpace:'nowrap' }}>
                {t.free?'FREE FOR LIFE':'DISCOUNTED'}
              </span>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center' }}>
          <button onClick={()=>navigate('/equity')} style={{
            background:'linear-gradient(135deg,#22C55E,#16A34A)', border:'none',
            borderRadius:16, padding:'14px 36px',
            fontFamily:'Poppins,sans-serif', fontWeight:700,
            fontSize:16, color:'#fff', cursor:'pointer' }}>
            Check Your Eligibility →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── ID CARD PREVIEW ───────────────────────────────────────────────
function IDCardPreview({ navigate }) {
  const [template, setTemplate] = useState(0)
  const TEMPLATES = [
    { name:'Royal Gold',  bg:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'#D4AF37', text:'#fff', textG:'#D4AF37' },
    { name:'The Legend',  bg:'linear-gradient(135deg,#0A0A0A,#1a1a2e)',  border:'#D4AF37', text:'#fff', textG:'#D4AF37' },
    { name:'Warrior',     bg:'linear-gradient(135deg,#7C0A02,#3D0000)',  border:'#FF6B35', text:'#fff', textG:'#FFB347' },
    { name:'Scholar',     bg:'linear-gradient(135deg,#0369A1,#075985)',  border:'#fff',    text:'#fff', textG:'#BAE6FD' },
    { name:'Champion',    bg:'linear-gradient(135deg,#92400E,#D4AF37)',  border:'#FDE68A', text:'#1C1917',textG:'#44403C' },
  ]
  const T = TEMPLATES[template]
  return (
    <section style={{ ...R.section, background:'#F8FAFC' }}>
      <div style={R.container}>
        <div style={{ ...R.grid2, alignItems:'center', gap:40 }}>
          <div>
            <h2 style={{ ...R.h2, color:'#1E3A5F', marginBottom:12 }}>
              🪪 Your Student ID Card
            </h2>
            <p style={{ ...R.p, color:'#64748B', marginBottom:20 }}>
              5 cinematic templates. 3D flip animation. Share your rank and exam
              on Instagram, WhatsApp. Your unique TryIT ID shows your full journey
              from Class 6 to today.
            </p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
              {TEMPLATES.map((t,i)=>(
                <button key={i} onClick={()=>setTemplate(i)} style={{
                  padding:'7px 14px', borderRadius:20,
                  border:`2px solid ${i===template?'#D4AF37':'#E2E8F0'}`,
                  background: i===template?'#D4AF37':'#fff',
                  color: i===template?'#1E3A5F':'#64748B',
                  fontFamily:'Poppins,sans-serif', fontWeight:600,
                  fontSize:12, cursor:'pointer', transition:'all 0.2s' }}>
                  {t.name}
                </button>
              ))}
            </div>
            <button onClick={()=>navigate('/login')} style={{
              background:'linear-gradient(135deg,#D4AF37,#E8C84A)', border:'none',
              borderRadius:12, padding:'11px 24px',
              fontFamily:'Poppins,sans-serif', fontWeight:700,
              fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>
              Create My Card →
            </button>
          </div>

          {/* Live ID card */}
          <div style={{ maxWidth:340, margin:'0 auto', width:'100%' }}>
            <div style={{
              background: T.bg, borderRadius:20,
              border:`2px solid ${T.border}`,
              padding:'22px', boxShadow:`0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${T.border}44`,
              transition:'all 0.4s ease',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                <div>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                    fontSize:18, color: T.textG }}>
                    TRY<span style={{ color: T.textG }}>IT</span>
                  </p>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:8,
                    letterSpacing:'3px' }}>EDUCATIONS</p>
                </div>
                <span style={{ background:`${T.textG}22`, border:`1px solid ${T.textG}44`,
                  color:T.textG, fontSize:9, fontWeight:800,
                  padding:'4px 10px', borderRadius:8 }}>⚡ PRO</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:56, height:56, borderRadius:'50%',
                  background:`linear-gradient(135deg,${T.textG},${T.textG}88)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:900, fontSize:20, color:T.text==='#fff'?'#1E3A5F':'#fff',
                  border:`2px solid ${T.border}`, flexShrink:0 }}>AK</div>
                <div>
                  <p style={{ color:T.text, fontWeight:700, fontSize:15 }}>Arjun Kumar</p>
                  <p style={{ color:T.textG, fontSize:11, marginTop:2 }}>⛏️ The Gold Miner</p>
                  <p style={{ color:`${T.text}60`, fontSize:10 }}>Coimbatore, Tamil Nadu</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                {[['#1,243','RANK'],['12d 🔥','STREAK'],['78%','AVG']].map(([v,l])=>(
                  <div key={l} style={{ background:`${T.textG}18`,
                    border:`1px solid ${T.textG}30`,
                    borderRadius:10, padding:'8px 4px', textAlign:'center' }}>
                    <p style={{ color:T.textG, fontWeight:800, fontSize:13 }}>{v}</p>
                    <p style={{ color:`${T.text}50`, fontSize:8, letterSpacing:'1px' }}>{l}</p>
                  </div>
                ))}
              </div>
              <p style={{ color:`${T.text}30`, fontSize:8,
                fontFamily:'monospace', letterSpacing:'2px', marginTop:12 }}>
                TRY-TN-00001-2026
              </p>
            </div>
            <p style={{ textAlign:'center', color:'#94A3B8',
              fontSize:11, marginTop:8 }}>Click a template above to switch</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS ──────────────────────────────────────────────────
function Testimonials() {
  const ITEMS = [
    { name:'Arjun K.',   state:'TN',       exam:'SSC CGL',  rank:'#1,243', score:'89%',
      text:'"Moved from #8,432 to #1,243 in 30 days!" 🔥', level:'⛏️ Gold Miner' },
    { name:'Priya S.',   state:'Kerala',   exam:'NEET UG',  rank:'#847',  score:'94%',
      text:'"Studied in Malayalam for the first time. Crystal clear!" 🌴', level:'💪 The Grinder' },
    { name:'Rahul M.',   state:'Bihar',    exam:'UPSC CSE', rank:'#2,341',score:'82%',
      text:'"Career Compass told me to try UPSC + BPSC. Best decision!" 🎯', level:'📈 The Riser' },
    { name:'Zainab A.',  state:'Hyd',      exam:'IBPS PO',  rank:'#519',  score:'91%',
      text:'"Guru Hub answered my doubt at midnight in 7 minutes!" 🎓', level:'🦁 Baahuveer' },
    { name:'Ravi T.',    state:'Punjab',   exam:'NDA',      rank:'#312',  score:'88%',
      text:'"Hall battles kept my whole batch studying every night." 👥', level:'🔥 Fierce One' },
    { name:'Meena P.',   state:'Manipur',  exam:'CTET',     rank:'#1,021',score:'87%',
      text:'"First platform with Meitei language. Thank you TryIT!" 🏔️', level:'📈 The Riser' },
  ]
  return (
    <section style={{ ...R.section, background:'#fff', overflow:'hidden' }}>
      <div style={{ textAlign:'center', marginBottom:36 }}>
        <h2 style={{ ...R.h2, color:'#1E3A5F' }}>Real Students. Real Results.</h2>
      </div>
      <div style={{ display:'flex', animation:'scrollTicker 28s linear infinite',
        width:'max-content', gap:16 }}>
        {[...ITEMS,...ITEMS].map((t,i)=>(
          <div key={i} style={{ width:280, background:'#F8FAFC',
            border:'1.5px solid #E2E8F0', borderRadius:20,
            padding:18, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:'50%',
                background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#D4AF37', fontWeight:900, fontSize:13, flexShrink:0 }}>
                {t.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  color:'#1E3A5F', fontSize:13 }}>{t.name}</p>
                <p style={{ color:'#94A3B8', fontSize:11 }}>{t.state} · {t.exam}</p>
              </div>
              <span style={{ background:'#FEF3C7', color:'#92400E',
                fontSize:9, fontWeight:700, padding:'2px 8px',
                borderRadius:20, flexShrink:0 }}>{t.level}</span>
            </div>
            <p style={{ color:'#475569', fontSize:13, lineHeight:1.6 }}>{t.text}</p>
            <div style={{ display:'flex', gap:8, marginTop:10 }}>
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
      <style>{`
        @keyframes scrollTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

// ── FINAL CTA ─────────────────────────────────────────────────────
function FinalCTA({ navigate }) {
  return (
    <section style={{ ...R.section,
      background:'linear-gradient(135deg,#1E3A5F,#0F2140)', textAlign:'center' }}>
      <div style={R.container}>
        <h2 style={{ ...R.h2, color:'#fff', marginBottom:16 }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ ...R.p, color:'rgba(255,255,255,0.65)',
          maxWidth:520, margin:'0 auto 32px' }}>
          1,10,000+ exams. 40+ languages. Real rankings.
          Free for 6 communities including Transgender youth.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center',
          flexWrap:'wrap', marginBottom:20 }}>
          <button onClick={()=>navigate('/login')} style={{
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)', border:'none',
            borderRadius:18, padding:'clamp(14px,2vw,20px) clamp(32px,4vw,60px)',
            fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(16px,2.5vw,20px)', color:'#1E3A5F', cursor:'pointer' }}>
            Start Free Now →
          </button>
          <button onClick={()=>navigate('/equity')} style={{
            background:'rgba(255,255,255,0.08)',
            border:'1.5px solid rgba(212,175,55,0.4)', borderRadius:18,
            padding:'clamp(14px,2vw,20px) clamp(24px,3vw,40px)',
            fontFamily:'Poppins,sans-serif', fontWeight:700,
            fontSize:'clamp(15px,2vw,18px)', color:'#fff', cursor:'pointer' }}>
            🤝 Apply for Free Access
          </button>
        </div>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12 }}>
          No credit card · No commitment · Free forever for eligible communities
        </p>
      </div>
    </section>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  const [scrollPct, setScrollPct] = useState(0)
  const [showTop,   setShowTop]   = useState(false)

  useEffect(()=>{
    const fn=()=>{
      const el=document.documentElement
      setScrollPct((el.scrollTop/(el.scrollHeight-el.clientHeight))*100)
      setShowTop(el.scrollTop>500)
    }
    window.addEventListener('scroll', fn, { passive:true })
    return ()=>window.removeEventListener('scroll', fn)
  },[])

  return (
    <div>
      {/* Scroll progress bar */}
      <div style={{ position:'fixed', top:0, left:0, height:3, zIndex:9999,
        width:`${scrollPct}%`,
        background:'linear-gradient(90deg,#D4AF37,#E8C84A)',
        transition:'width 0.1s', pointerEvents:'none' }}/>

      <Navbar/>
      <Hero navigate={navigate}/>
      <StatsStrip/>
      <TestPreview/>
      <LeaderboardPreview navigate={navigate}/>
      <GamificationPreview navigate={navigate}/>
      <GuruHubPreview navigate={navigate}/>
      <IDCardPreview navigate={navigate}/>
      <FeaturesGrid navigate={navigate}/>
      <EquitySection navigate={navigate}/>
      <EquityPricingSection navigate={navigate}/>
      <DonationSection/>
      <Testimonials/>
      <FinalCTA navigate={navigate}/>
      <Footer/>

      {showTop && (
        <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          style={{ position:'fixed', bottom:80, right:20, width:48, height:48,
            borderRadius:'50%', background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            border:'none', cursor:'pointer', fontSize:20,
            boxShadow:'0 4px 20px rgba(212,175,55,0.5)', zIndex:30 }}>↑</button>
      )}
    </div>
  )
}
