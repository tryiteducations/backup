// src/pages/Landing.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar               from '../components/landing/Navbar'
import Hero                 from '../components/landing/Hero'
import Footer               from '../components/landing/Footer'
import StudentSection       from '../components/landing/StudentSection'
import MentorSection        from '../components/landing/MentorSection'
import InstitutionSection   from '../components/landing/InstitutionSection'
import FamilySection        from '../components/landing/FamilySection'
import EquityPricingSection from '../components/landing/EquityPricingSection'
import DonationSection      from '../components/landing/DonationSection'

// ── Count-up hook ─────────────────────────────────────────────────
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
        setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])
  return [count, ref]
}

// ── STATS STRIP ───────────────────────────────────────────────────
function StatsStrip() {
  const [c1, r1] = useCountUp(110000)
  const [c2, r2] = useCountUp(42)
  return (
    <section style={{ background:'linear-gradient(135deg,var(--color-primary-dark,#1E3A5F),var(--color-primary,#0F2140))', padding:'32px 20px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', flexWrap:'wrap', justifyContent:'center' }}>
        {[
          { ref:r1, value:`${c1.toLocaleString()}+`, label:'Exam Pathways' },
          { ref:r2, value:`${c2}+`,                  label:'Indian Languages' },
          { ref:null, value:'28/28',                 label:'States Covered' },
          { ref:null, value:'Class 6+',              label:'All Ages Welcome' },
        ].map((s,i) => (
          <div key={i} ref={s.ref}
            style={{ flex:'1 1 160px', textAlign:'center', padding:'18px 16px',
              borderRight:'1px solid rgba(255,255,255,0.06)',
              borderLeft: i===0 ? '1px solid rgba(255,255,255,0.06)' : undefined }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(24px,4vw,42px)', color:'var(--color-accent,#D4AF37)', lineHeight:1 }}>
              {s.value}
            </p>
            <p style={{ color:'rgba(255,255,255,0.72)', fontSize:13, marginTop:4 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── TEST PREVIEW ──────────────────────────────────────────────────
function TestPreview() {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const q = {
    text:'Which of the following is NO LONGER a Fundamental Right under the Indian Constitution?',
    options:['Right to Equality','Right to Property','Right to Freedom of Speech','Right to Constitutional Remedies'],
    correct:1,
    exams:'UPSC · SSC · IBPS · RRB · All State PSCs · NDA · CTET · CLAT',
  }
  return (
    <section style={{ padding:'72px 20px', background:'var(--color-bg,#F8FAFC)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <span style={{ background:'#EDE9FE', color:'#7C3AED', fontSize:11,
            fontWeight:700, padding:'4px 14px', borderRadius:20, letterSpacing:'1px' }}>
            LIVE PREVIEW — NO LOGIN NEEDED
          </span>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(22px,4vw,40px)', color:'var(--color-text,#1E3A5F)', margin:'12px 0 6px' }}>
            ⚡ Try a Real Question
          </h2>
          <p style={{ color:'var(--color-text-light,#64748B)', fontSize:15 }}>
            Answer it — see all 7 explanation layers unlock in your language
          </p>
        </div>
        <div style={{ maxWidth:680, margin:'0 auto',
          background:'var(--color-surface,#FFFFFF)', borderRadius:24,
          boxShadow:'0 8px 40px rgba(30,58,95,0.1)',
          border:'1.5px solid var(--color-border,#E2E8F0)', overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg,var(--color-primary,#1E3A5F),var(--color-primary-dark,#0F2140))',
            padding:'12px 20px', display:'flex', justifyContent:'space-between',
            alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {['Constitution','GK / GA','High Difficulty'].map(tag => (
                <span key={tag} style={{ background:'rgba(212,175,55,0.22)',
                  color:'var(--color-accent,#D4AF37)', fontSize:10, fontWeight:700,
                  padding:'3px 10px', borderRadius:20 }}>{tag}</span>
              ))}
            </div>
            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>{q.exams}</span>
          </div>
          <div style={{ padding:'24px 20px' }}>
            <p style={{ color:'var(--color-text,#1E293B)', fontWeight:600, fontSize:15,
              lineHeight:1.6, marginBottom:20, fontFamily:'Poppins,sans-serif' }}>
              {q.text}
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.options.map((opt, i) => {
                const isSel = selected === i
                const isOk  = revealed && i === q.correct
                const isBad = revealed && isSel && i !== q.correct
                return (
                  <button key={i} onClick={() => { if (!revealed) setSelected(i) }}
                    style={{ display:'flex', alignItems:'center', gap:12,
                      padding:'12px 16px', borderRadius:14, cursor:'pointer',
                      border:`2px solid ${isOk?'#22C55E':isBad?'#EF4444':isSel?'var(--color-primary,#1E3A5F)':'var(--color-border,#E2E8F0)'}`,
                      background:isOk?'rgba(34,197,94,0.12)':isBad?'rgba(254,226,226,0.8)':isSel?'rgba(30,58,95,0.06)':'var(--color-surface,#fff)',
                      textAlign:'left', width:'100%', transition:'all 0.2s' }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0,
                      background:isOk?'#22C55E':isBad?'#EF4444':isSel?'var(--color-primary,#1E3A5F)':'var(--color-border,#E2E8F0)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:isSel||isOk||isBad?'#fff':'var(--color-text-light,#64748B)',
                      fontWeight:800, fontSize:12 }}>
                      {isOk?'✓':isBad?'✗':['A','B','C','D'][i]}
                    </div>
                    <span style={{ fontSize:14, fontWeight:isSel||isOk?700:400,
                      color:isOk?'#15803D':isBad?'#991B1B':isSel?'var(--color-primary,#1E3A5F)':'var(--color-muted,#475569)' }}>
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>
            <div style={{ display:'flex', gap:10, marginTop:18, flexWrap:'wrap' }}>
              {selected !== null && !revealed && (
                <button onClick={() => setRevealed(true)} style={{
                  background:'linear-gradient(135deg,var(--color-accent,#D4AF37),var(--color-accent-light,#E8C84A))',
                  border:'none', borderRadius:12, padding:'11px 24px',
                  fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
                  color:'var(--color-primary-dark,#1E3A5F)', cursor:'pointer' }}>
                  Submit →
                </button>
              )}
              {revealed && (
                <button onClick={() => { setSelected(null); setRevealed(false) }}
                  style={{ background:'var(--color-primary,#1E3A5F)', border:'none',
                    borderRadius:12, padding:'11px 24px', fontFamily:'Poppins,sans-serif',
                    fontWeight:700, fontSize:14, color:'#fff', cursor:'pointer' }}>
                  Try Another
                </button>
              )}
            </div>
            {revealed && (
              <div style={{ marginTop:16, background:'rgba(34,197,94,0.10)',
                border:'1.5px solid #22C55E', borderRadius:16, padding:16 }}>
                <p style={{ color:'#15803D', fontWeight:700, fontSize:14, marginBottom:6 }}>
                  ✅ Correct Answer: Right to Property
                </p>
                <p style={{ color:'#166534', fontSize:13, lineHeight:1.6, marginBottom:4 }}>
                  💡 Right to Property was removed as a Fundamental Right by the <strong>44th Constitutional Amendment, 1978</strong>. It now exists only as a Legal Right under Article 300A.
                </p>
                <p style={{ color:'#166534', fontSize:12, marginBottom:4 }}>
                  🧠 Remember: <strong>44th Amendment = Property removed → Article 300A</strong>. 86th Amendment = Education added → Article 21A.
                </p>
                <p style={{ color:'#15803D', fontSize:11, fontStyle:'italic', opacity:0.75 }}>
                  + 5 more layers (why each wrong option fails, short story, cross-exam tip, PYQ reference) — unlocks in 42 languages after login
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── LEADERBOARD ───────────────────────────────────────────────────
function LeaderboardPreview({ navigate }) {
  const ROWS = [
    { rank:1,    name:'Priya Sharma',   state:'Kerala',    exam:'NEET UG',  score:'97.4%', badge:'⚡ Unstoppable' },
    { rank:2,    name:'Rahul Kumar',    state:'Delhi',     exam:'UPSC CSE', score:'94.8%', badge:'👑 Thalavan'    },
    { rank:3,    name:'Aisha Mohammed', state:'Gujarat',   exam:'IBPS PO',  score:'93.1%', badge:'🦁 Baahuveer'   },
    { rank:4,    name:'Vikram Singh',   state:'Rajasthan', exam:'SSC CGL',  score:'92.6%', badge:'🥇 Gold King'   },
    { rank:5,    name:'Deepa Nair',     state:'TN',        exam:'NEET UG',  score:'91.9%', badge:'🌟 The Legend'  },
    { rank:1243, name:'You (Preview)',  state:'—',         exam:'—',        score:'?',     badge:'⛏️ Start Now',  isYou:true },
  ]
  return (
    <section style={{ padding:'72px 20px',
      background:'linear-gradient(135deg,var(--color-primary,#1E3A5F),var(--color-primary-dark,#0F2140))' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(22px,4vw,38px)', color:'#ffffff', marginBottom:8 }}>
            🏆 Real All-India Rankings
          </h2>
          <p style={{ color:'rgba(255,255,255,0.72)', fontSize:15 }}>
            After every test. Live. Your name could be up here.
          </p>
        </div>
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:22,
          overflow:'hidden', border:'1px solid rgba(212,175,55,0.2)' }}>
          <div style={{ background:'rgba(0,0,0,0.3)', padding:'12px 20px',
            display:'grid', gridTemplateColumns:'52px 1fr 100px 70px', gap:8 }}>
            {['Rank','Student','Exam','Score'].map(h => (
              <span key={h} style={{ color:'var(--color-accent,#D4AF37)', fontSize:11, fontWeight:700 }}>{h}</span>
            ))}
          </div>
          {ROWS.map((r, i) => (
            <div key={i} style={{ padding:'12px 20px',
              borderBottom:'1px solid rgba(255,255,255,0.05)',
              display:'grid', gridTemplateColumns:'52px 1fr 100px 70px',
              gap:8, alignItems:'center',
              background:r.isYou?'rgba(212,175,55,0.10)':'transparent',
              borderLeft:r.isYou?'3px solid var(--color-accent,#D4AF37)':'3px solid transparent' }}>
              <span style={{ color:i===0?'var(--color-accent,#D4AF37)':i===1?'#9CA3AF':i===2?'#CD7F32':'rgba(255,255,255,0.4)',
                fontSize:i<3?18:12, fontWeight:900 }}>
                {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${r.rank.toLocaleString()}`}
              </span>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                  <span style={{ color:'#fff', fontWeight:600, fontSize:13 }}>{r.name}</span>
                  {r.isYou && <span style={{ background:'var(--color-accent,#D4AF37)',
                    color:'var(--color-primary-dark,#1E3A5F)',
                    fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>← YOU</span>}
                </div>
                <span style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>{r.badge} · {r.state}</span>
              </div>
              <span style={{ background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.7)',
                fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:20,
                display:'inline-block' }}>{r.exam}</span>
              <span style={{ color:'var(--color-accent,#D4AF37)', fontWeight:800, fontSize:14 }}>{r.score}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:24 }}>
          <button onClick={() => navigate('/register')} style={{
            background:'linear-gradient(135deg,var(--color-accent,#D4AF37),var(--color-accent-light,#E8C84A))',
            border:'none', borderRadius:14, padding:'13px 36px',
            fontFamily:'Poppins,sans-serif', fontWeight:700,
            fontSize:16, color:'var(--color-primary-dark,#1E3A5F)', cursor:'pointer' }}>
            Claim Your Rank →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── FELLOWSHIP / EQUITY ───────────────────────────────────────────
function FellowshipSection({ navigate }) {
  const TIERS = [
    { e:'🌱', n:'Hope Scholars',        s:'Orphans & Welfare Home Children',  free:true  },
    { e:'♿', n:'Divyangjan',            s:'Blind · Deaf · Motor Challenged',  free:true  },
    { e:'🧹', n:'Swachhta Warriors',    s:"Sanitation Workers' Children",      free:true  },
    { e:'🎖️',n:"Martyrs' Families",    s:'Children of Fallen Soldiers',       free:true  },
    { e:'🏳️‍⚧️',n:'Transgender Youth', s:'Via SMILE Portal — MoSJE',          free:true  },
    { e:'🌾', n:'Agrarian Distress',    s:'Farmer Distress Families',         free:true  },
    { e:'🪖', n:'Active Military',      s:'Serving Defence Personnel',        free:false },
    { e:'🏥', n:'ASHA & Anganwadi',     s:'Grassroots Health Workers',        free:false },
  ]
  return (
    <section style={{ padding:'72px 20px',
      background:'linear-gradient(135deg,var(--color-primary-dark,#071428),var(--color-primary,#0F2140))' }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontSize:'clamp(28px,5vw,48px)', marginBottom:10 }}>🇮🇳</div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(24px,4vw,40px)', color:'#ffffff', margin:'0 0 10px' }}>
            TryIT Fellowship — <span style={{ color:'var(--color-accent,#D4AF37)' }}>One Subscribes. Another Studies Free.</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:15,
            maxWidth:560, margin:'0 auto', lineHeight:1.8 }}>
            Not charity — fellowship. Every paid subscription quietly sponsors a student who cannot afford it. Same platform. Same features. Zero cost to them.
          </p>
        </div>
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,240px),1fr))',
          gap:8, marginBottom:24 }}>
          {TIERS.map((t, i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.04)',
              border:`1px solid ${t.free?'rgba(34,197,94,0.28)':'rgba(212,175,55,0.28)'}`,
              borderRadius:14, padding:'12px 14px',
              display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{t.e}</span>
              <div style={{ flex:1 }}>
                <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif',
                  fontWeight:700, fontSize:12, margin:0 }}>{t.n}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10, margin:'2px 0 0' }}>{t.s}</p>
              </div>
              <span style={{ background:t.free?'rgba(34,197,94,0.15)':'rgba(212,175,55,0.15)',
                color:t.free?'#4ADE80':'var(--color-accent,#D4AF37)',
                fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:20, flexShrink:0 }}>
                {t.free?'FREE':'30% OFF'}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap:14 }}>
          <div style={{ background:'rgba(255,255,255,0.04)',
            border:'1.5px dashed rgba(212,175,55,0.4)',
            borderRadius:18, padding:20, textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🏠</div>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
              color:'#fff', fontSize:15, margin:'0 0 8px' }}>
              Running a home for underprivileged children?
            </p>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13,
              margin:'0 0 14px', lineHeight:1.7 }}>
              Write to us. We'll set everything up personally — free, within 48 hours.
            </p>
            <a href="mailto:tryiteducations@gmail.com"
              style={{ display:'inline-block',
                background:'linear-gradient(135deg,var(--color-accent,#D4AF37),var(--color-accent-light,#E8C84A))',
                borderRadius:12, padding:'10px 22px',
                color:'var(--color-primary-dark,#1E3A5F)',
                fontFamily:'Poppins,sans-serif', fontWeight:800,
                fontSize:13, textDecoration:'none' }}>
              ✉️ tryiteducations@gmail.com
            </a>
          </div>
          <div style={{ background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(212,175,55,0.25)',
            borderRadius:18, padding:20 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color:'#fff', fontSize:16, margin:'0 0 8px' }}>
              Feel Free to Donate
            </p>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13,
              margin:'0 0 16px', lineHeight:1.7 }}>
              80 paise of every rupee reaches a student directly. Section 80G tax deduction certificate issued within 7 days.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ flex:1,
                background:'linear-gradient(135deg,var(--color-accent,#D4AF37),var(--color-accent-light,#E8C84A))',
                border:'none', borderRadius:12, padding:'10px',
                color:'var(--color-primary-dark,#1E3A5F)',
                fontWeight:800, fontSize:13, cursor:'pointer' }}>
                💳 Razorpay
              </button>
              <button style={{ flex:1,
                background:'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.14)',
                borderRadius:12, padding:'10px',
                color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                📱 Pay via UPI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS ──────────────────────────────────────────────────
function Testimonials() {
  const ITEMS = [
    { n:'Arjun K.',  s:'TN',      e:'SSC CGL',  r:'#1,243', sc:'89%', t:'"Moved from #8,432 to #1,243 in 30 days!"',          lv:'⛏️ Gold Miner' },
    { n:'Priya S.',  s:'Kerala',  e:'NEET UG',  r:'#847',   sc:'94%', t:'"Studied in Malayalam. Crystal clear explanations!"', lv:'💪 Grinder'    },
    { n:'Rahul M.',  s:'Bihar',   e:'UPSC CSE', r:'#2,341', sc:'82%', t:'"Career Compass pointed me to UPSC + BPSC. Best decision!"', lv:'📈 Riser' },
    { n:'Zainab A.', s:'Hyd',     e:'IBPS PO',  r:'#519',   sc:'91%', t:'"Guru Hub answered my doubt at midnight in 7 minutes!"', lv:'🦁 Baahuveer' },
    { n:'Deepika R.',s:'Manipur', e:'CTET',     r:'#1,021', sc:'87%', t:'"First platform with Manipuri language. Thank you TryIT!"', lv:'📈 Riser' },
    { n:'Ravi T.',   s:'Punjab',  e:'NDA',      r:'#312',   sc:'88%', t:'"Hall battles kept my whole batch studying every night!"', lv:'🔥 Fierce' },
  ]
  return (
    <section style={{ padding:'60px 0', background:'var(--color-surface,#fff)', overflow:'hidden' }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:'clamp(22px,3.5vw,34px)', color:'var(--color-primary-dark,#1E3A5F)' }}>
          Real Students. Real Results.
        </h2>
      </div>
      <div style={{ display:'flex', animation:'scrollTicker 28s linear infinite', width:'max-content', gap:14 }}>
        {[...ITEMS,...ITEMS].map((t, i) => (
          <div key={i} style={{ width:270, background:'#F8FAFC',
            border:'1.5px solid var(--color-border,#E2E8F0)',
            borderRadius:18, padding:16, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%',
                background:'linear-gradient(135deg,var(--color-primary,#1E3A5F),var(--color-primary-dark,#0F2140))',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--color-accent,#D4AF37)', fontWeight:900, fontSize:11, flexShrink:0 }}>
                {t.n.split(' ').map(x=>x[0]).join('')}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  color:'var(--color-text,#1E3A5F)', fontSize:12, margin:0 }}>{t.n}</p>
                <p style={{ color:'var(--color-text-light,#94A3B8)', fontSize:10, margin:0 }}>{t.s} · {t.e}</p>
              </div>
              <span style={{ background:'#FEF3C7', color:'#92400E',
                fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20, flexShrink:0 }}>
                {t.lv}
              </span>
            </div>
            <p style={{ color:'#475569', fontSize:12, lineHeight:1.6, margin:'0 0 8px' }}>{t.t}</p>
            <div style={{ display:'flex', gap:6 }}>
              <span style={{ background:'#EDE9FE', color:'#7C3AED',
                fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{t.r}</span>
              <span style={{ background:'#DCFCE7', color:'#15803D',
                fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{t.sc}</span>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes scrollTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </section>
  )
}

// ── FINAL CTA ─────────────────────────────────────────────────────
function FinalCTA({ navigate }) {
  return (
    <section style={{ padding:'72px 20px',
      background:'linear-gradient(135deg,var(--color-primary,#1E3A5F),var(--color-primary-dark,#0F2140))',
      textAlign:'center' }}>
      <div style={{ maxWidth:700, margin:'0 auto' }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
          fontSize:'clamp(26px,4vw,48px)', color:'#ffffff', marginBottom:16 }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:16,
          maxWidth:520, margin:'0 auto 32px', lineHeight:1.7 }}>
          1,10,000+ exams. 42+ languages. Real All-India rankings. Free for 6 communities.
          From Class 6 to PhD — for every Indian, at every age.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:16 }}>
          <button onClick={() => navigate('/register')} style={{
            background:'linear-gradient(135deg,var(--color-accent,#D4AF37),var(--color-accent-light,#E8C84A))',
            border:'none', borderRadius:18,
            padding:'clamp(14px,2vw,20px) clamp(32px,4vw,60px)',
            fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(16px,2.5vw,20px)',
            color:'var(--color-primary-dark,#1E3A5F)', cursor:'pointer' }}>
            Start Free Now →
          </button>
          <button onClick={() => navigate('/equity')} style={{
            background:'rgba(255,255,255,0.08)',
            border:'1.5px solid rgba(212,175,55,0.4)', borderRadius:18,
            padding:'clamp(14px,2vw,20px) clamp(24px,3vw,40px)',
            fontFamily:'Poppins,sans-serif', fontWeight:700,
            fontSize:'clamp(15px,2vw,18px)', color:'#ffffff', cursor:'pointer' }}>
            🤝 Apply for Free Access
          </button>
        </div>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>
          No credit card · No commitment · Free forever for eligible communities
        </p>
      </div>
    </section>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function Landing() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [scrollPct, setScrollPct] = useState(0)
  const [showTop,   setShowTop]   = useState(false)

  useEffect(() => {
    const fn = () => {
      const el  = document.documentElement
      setScrollPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
      setShowTop(el.scrollTop > 500)
    }
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' })
    }, 120)
    return () => clearTimeout(timer)
  }, [location.hash])

  return (
    <div>
      {/* Scroll progress bar */}
      <div style={{ position:'fixed', top:0, left:0, height:3, zIndex:9999,
        width:`${scrollPct}%`,
        background:'linear-gradient(90deg,var(--color-accent,#D4AF37),var(--color-accent-light,#E8C84A))',
        transition:'width 0.1s', pointerEvents:'none' }}/>

      <Navbar/>
      <Hero/>
      <StatsStrip/>
      <TestPreview/>
      <LeaderboardPreview navigate={navigate}/>
      <StudentSection/>
      <MentorSection/>
      <InstitutionSection/>
      <FamilySection/>
      <FellowshipSection navigate={navigate}/>
      <EquityPricingSection/>
      <DonationSection/>
      <Testimonials/>
      <FinalCTA navigate={navigate}/>
      <Footer/>

      {showTop && (
        <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          style={{ position:'fixed', bottom:80, right:20, width:46, height:46,
            borderRadius:'50%',
            background:'linear-gradient(135deg,var(--color-accent,#D4AF37),var(--color-accent-light,#E8C84A))',
            border:'none', cursor:'pointer', fontSize:20, zIndex:30,
            boxShadow:'0 4px 16px rgba(212,175,55,0.5)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>↑</button>
      )}
    </div>
  )
}
