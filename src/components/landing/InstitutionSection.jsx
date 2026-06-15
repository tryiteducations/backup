import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { step:'01', emoji:'🏫', title:'Register Your Centre Free',
    desc:'Sign up in 2 minutes. No paperwork. No approval wait. Instant access.' },
  { step:'02', emoji:'📝', title:'Create Unlimited Tests — Any Day',
    desc:'Weekend tests, after-school tests, surprise tests. Schedule for Saturday 10AM or Sunday 2PM. Students join with a 6-digit code from their phone.' },
  { step:'03', emoji:'📱', title:'Students Join on Their Phone',
    desc:'No laptop needed. TryIT runs on any ₹4,000 Android phone. Students open the app, enter the code, and start the test from home or your centre.' },
  { step:'04', emoji:'📊', title:'Instant Results — Every Student Ranked',
    desc:'The moment the test ends — scores, All-India ranks, subject-wise breakdown, weak areas. Zero manual checking. Everything on your dashboard.' },
  { step:'05', emoji:'💰', title:'Every Monday — You Get Paid',
    desc:'Every active student in your centre earns you a weekly payout every Monday via UPI. Unlimited students. Unlimited tests. No cap on earnings.' },
]

const BENEFITS = [
  { emoji:'⚡', title:'No Extra Infrastructure', desc:'Students use their own phones. No desktop lab, no projector, no printed papers needed.' },
  { emoji:'🌍', title:'Pan-India Recognition', desc:'Your centre gets ranked nationally on TryIT. Top centres are featured on our homepage — seen by lakhs of students.' },
  { emoji:'📈', title:'Track Every Student', desc:'Full test history from Day 1. Score trends, improvement graphs, weak topics — one screen, zero spreadsheets.' },
  { emoji:'🔒', title:'Anti-Cheating Built-In', desc:'Questions randomised per student. Timer enforced. No copy-paste. Screenshot detection. Your exam is fully protected.' },
  { emoji:'🏆', title:'Monthly Centre Battle', desc:'Top-performing centres win featured placement and recognition. Motivates your students and grows your reputation fast.' },
  { emoji:'💳', title:'Monday Payouts via UPI', desc:'Every active student = weekly earnings. Direct UPI transfer every Monday morning. No minimum threshold.' },
]

export default function InstitutionSection() {
  const navigate = useNavigate()
  const [active, setActive] = useState(0)

  return (
    <section id="institutions" style={{ padding:'72px 20px',
      background:'linear-gradient(180deg, var(--color-bg, #F8FAFC), var(--color-surface, #FFFFFF))' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(30,58,95,0.08)', border:'1px solid rgba(30,58,95,0.18)',
            borderRadius:20, padding:'7px 18px', marginBottom:16 }}>
            <span>🏫</span>
            <span style={{ color:'var(--color-text, #1E3A5F)', fontSize:12, fontWeight:700,
              fontFamily:'Poppins,sans-serif', letterSpacing:'1px' }}>
              FOR COACHING CENTRES & SCHOOLS
            </span>
          </div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(24px,4vw,42px)', color:'var(--color-text, #1E3A5F)',
            marginBottom:12, lineHeight:1.2 }}>
            No More Saturdays Wasted on<br/>
            <span style={{ color:'var(--color-accent, #D4AF37)' }}>Manual Test Papers</span>
          </h2>
          <p style={{ fontFamily:'Inter,sans-serif', color:'var(--color-text-light, #64748B)',
            fontSize:'clamp(14px,2vw,17px)', maxWidth:600, margin:'0 auto' }}>
            Your students take weekend tests on TryIT — from their own phones.
            You get instant results. They get All-India ranked.
            And every Monday, you get paid.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,195px),1fr))',
          gap:14, marginBottom:56 }}>
          {STEPS.map((s,i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              background: active===i ? 'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))' : 'var(--color-surface, #FFFFFF)',
                borderRadius:20, padding:'18px 16px', cursor:'pointer',
                border: `2px solid ${active===i ? 'var(--color-accent, #D4AF37)' : 'var(--color-border, #E2E8F0)'}`,
              transition:'all 0.25s',
              boxShadow: active===i ? '0 12px 32px rgba(30,58,95,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
              transform: active===i ? 'translateY(-4px)' : 'none',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between',
                alignItems:'center', marginBottom:10 }}>
                <span style={{ fontSize:26 }}>{s.emoji}</span>
                <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                  fontSize:10, color: active===i ? 'rgba(212,175,55,0.5)' : 'var(--color-muted, #CBD5E1)',
                  letterSpacing:'1px' }}>STEP {s.step}</span>
              </div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                color: active===i ? 'var(--color-accent, #D4AF37)' : 'var(--color-text, #1E3A5F)',
                fontSize:13, marginBottom:6 }}>{s.title}</p>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:12,
                color: active===i ? 'rgba(255,255,255,0.75)' : 'var(--color-text-light, #64748B)',
                lineHeight:1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div style={{ marginBottom:48 }}>
          <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            color:'var(--color-primary-dark, #1E3A5F)', fontSize:'clamp(18px,3vw,26px)',
            textAlign:'center', marginBottom:28 }}>
            Why 1,000+ Centres Are Switching to TryIT
          </h3>
          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,290px),1fr))',
            gap:14 }}>
            {BENEFITS.map((b,i) => (
              <div key={i} style={{ background:'#fff', borderRadius:18, padding:20,
                border:'1.5px solid var(--color-border, #E2E8F0)',
                boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize:28, display:'block', marginBottom:8 }}>{b.emoji}</span>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  color:'var(--color-primary-dark, #1E3A5F)', fontSize:14, marginBottom:6 }}>{b.title}</p>
                <p style={{ fontFamily:'Inter,sans-serif', color:'var(--color-muted, #64748B)',
                  fontSize:12, lineHeight:1.65 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monday Payout box */}
        <div style={{ background:'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
          borderRadius:24, padding:'36px 28px', marginBottom:28,
          border:'1.5px solid rgba(212,175,55,0.3)',
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))',
          gap:28, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(212,175,55,0.12)',
              border:'1px solid rgba(212,175,55,0.3)',
              borderRadius:20, padding:'6px 14px', marginBottom:14 }}>
              <span>💰</span>
              <span style={{ color:'var(--color-accent, #D4AF37)', fontSize:10, fontWeight:800,
                letterSpacing:'2px', fontFamily:'Poppins,sans-serif' }}>
                EVERY MONDAY. WITHOUT FAIL.
              </span>
            </div>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color:'var(--color-surface, #FFFFFF)', fontSize:'clamp(20px,3vw,32px)',
              lineHeight:1.2, marginBottom:12 }}>
              Each Student in Your Centre<br/>
              <span style={{ color:'var(--color-accent, #D4AF37)' }}>Earns You Every Week</span>
            </h3>
            <p style={{ fontFamily:'Inter,sans-serif', color:'rgba(255,255,255,0.7)',
              fontSize:'clamp(13px,1.8vw,15px)', lineHeight:1.75 }}>
              No caps. No limits. 10 students or 10,000 — the payout scales.
              Direct UPI transfer every Monday morning. Build a passive income
              while your students crack India's toughest exams.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { emoji:'📅', val:'Every Monday',  label:'Payout Day'          },
              { emoji:'🔓', val:'Unlimited',      label:'Tests Per Month'     },
              { emoji:'📊', val:'Real-time',       label:'Student Dashboard'   },
              { emoji:'🌍', val:'Pan-India',       label:'Centre Recognition'  },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(212,175,55,0.18)',
                borderRadius:16, padding:'16px 12px', textAlign:'center' }}>
                <span style={{ fontSize:22, display:'block', marginBottom:4 }}>{s.emoji}</span>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                  color:'var(--color-accent, #D4AF37)', fontSize:'clamp(13px,2vw,18px)' }}>{s.val}</p>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:10, marginTop:2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign:'center' }}>
          <button onClick={() => navigate('/centre/login')} style={{
            background:'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', border:'none',
            borderRadius:16, padding:'clamp(13px,2vw,17px) clamp(32px,4vw,52px)',
            fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(15px,2.5vw,19px)', color:'var(--color-primary-dark, #1E3A5F)', cursor:'pointer',
            boxShadow:'0 8px 24px rgba(212,175,55,0.3)' }}>
            Register Your Centre Free →
          </button>
          <p style={{ color:'var(--color-muted, #94A3B8)', fontSize:12, marginTop:10 }}>
            No registration fee · First payout within 7 days of first student test
          </p>
        </div>
      </div>
    </section>
  )
}
