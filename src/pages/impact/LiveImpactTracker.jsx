import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Live mock metrics — in production: fetch from Supabase every 30s
const BASE_METRICS = {
  hope_scholars:      847,
  physically_challenged: 1203,
  swachhta_warriors:  634,
  martyrs_families:   312,
  transgender_youth:  189,
  agrarian_distress:  456,
  military_families:  724,
  health_workers:     891,
  first_generation:   2341,
  total_free_users:   3641,
  total_discounted:   4197,
  study_hours_logged: 1284930,
  tests_completed:    89423,
  states_covered:     28,
  languages_used:     40,
}

const IMPACT_TIERS = [
  { id:'hope_scholars',         label:'Hope Scholars',           emoji:'🌱', color:'#D97706', isFree:true  },
  { id:'physically_challenged', label:'Differently Abled',       emoji:'♿', color:'#7C3AED', isFree:true  },
  { id:'swachhta_warriors',     label:"Swachhta Warriors' Children", emoji:'🧹', color:'#059669', isFree:true  },
  { id:'martyrs_families',      label:"Martyrs' Families",       emoji:'🎖️', color:'#B45309', isFree:true  },
  { id:'transgender_youth',     label:'Transgender Youth',       emoji:'🏳️‍⚧️', color:'#0369A1', isFree:true  },
  { id:'agrarian_distress',     label:'Agrarian Distress Families', emoji:'🌾', color:'#15803D', isFree:true  },
  { id:'military_families',     label:'Active Military Families', emoji:'🪖', color:'var(--color-primary, #1E3A5F)', isFree:false },
  { id:'health_workers',        label:"ASHA/Anganwadi Families",  emoji:'🏥', color:'#DC2626', isFree:false },
  { id:'first_generation',      label:'First-Generation Learners',emoji:'🌟', color:'#6D28D9', isFree:false },
]

function CountUp({ target, duration = 2000 }) {
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
  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function LiveImpactTracker() {
  const [pulse, setPulse] = useState(BASE_METRICS)

  // Simulate live counter increments
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => ({
        ...prev,
        study_hours_logged: prev.study_hours_logged + Math.floor(Math.random() * 3),
        tests_completed:    prev.tests_completed    + (Math.random() > 0.7 ? 1 : 0),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const totalBeneficiaries = IMPACT_TIERS.reduce(
    (sum, t) => sum + (pulse[t.id] || 0), 0
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0A0F1E', padding:'0 0 60px' }}>

      {/* Hero */}
      <div style={{
        background:'linear-gradient(135deg,var(--color-primary, #1E3A5F) 0%,var(--color-primary-dark, #0F2140) 40%,#071428 100%)',
        padding:'60px 24px 40px', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        {/* Live pulse ring */}
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%',
          border:'1px solid rgba(212,175,55,0.1)', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)', animation:'ringPulse 4s ease-in-out infinite',
          pointerEvents:'none' }} />

        <div style={{ display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)',
          borderRadius:20, padding:'6px 16px', marginBottom:20 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--color-success, #22C55E)',
            animation:'pulseDot 1.5s ease-in-out infinite' }} />
          <span style={{ color:'var(--color-success, #22C55E)', fontSize:12, fontWeight:700, letterSpacing:'1px' }}>
            LIVE IMPACT TRACKER
          </span>
        </div>

        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
          fontSize:'clamp(28px,5vw,52px)', color:'#fff', marginBottom:12 }}>
          Education is<br/>
          <span style={{ color:'var(--color-accent, #D4AF37)' }}>Changing Lives</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:16, maxWidth:580,
          margin:'0 auto 32px', lineHeight:1.7 }}>
          TryIT's near-zero infrastructure model enables 100% free education for India's
          most vulnerable communities. Every number below is a real person whose future
          we are changing — right now.
        </p>

        {/* Top 4 stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)',
          gap:14, maxWidth:500, margin:'0 auto' }}>
          {[
            { label:'Total Beneficiaries', val:totalBeneficiaries, suffix:'', highlight:true },
            { label:'Study Hours Logged',  val:pulse.study_hours_logged, suffix:'+' },
            { label:'Tests Completed',     val:pulse.tests_completed, suffix:'' },
            { label:'States Covered',      val:pulse.states_covered, suffix:'/28' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.highlight
                ? 'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))'
                : 'rgba(255,255,255,0.04)',
              border: s.highlight
                ? '1.5px solid rgba(212,175,55,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius:18, padding:'20px 16px',
            }}>
              <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                fontSize:'clamp(26px,4vw,40px)',
                color: s.highlight ? 'var(--color-accent, #D4AF37)' : '#fff' }}>
                <CountUp target={s.val} />{s.suffix}
              </div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier breakdown */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 20px 0' }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          color:'#fff', fontSize:24, marginBottom:6, textAlign:'center' }}>
          Impact by Community
        </h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:24, textAlign:'center' }}>
          Every verified beneficiary gets full access — zero cost, zero compromise.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
          {IMPACT_TIERS.map(tier => (
            <motion.div key={tier.id}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              style={{
                background:'rgba(255,255,255,0.03)',
                border:`1px solid ${tier.color}33`,
                borderRadius:20, padding:20,
              }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontSize:28 }}>{tier.emoji}</span>
                <span style={{
                  background: tier.isFree ? 'var(--color-success, #22C55E)' : 'var(--color-accent, #D4AF37)',
                  color: '#fff',
                  fontSize:9, fontWeight:800, padding:'3px 8px',
                  borderRadius:20, letterSpacing:'0.5px',
                }}>
                  {tier.isFree ? 'FREE FOR LIFE' : 'DISCOUNTED'}
                </span>
              </div>
              <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                fontSize:36, color: tier.color }}>
                <CountUp target={pulse[tier.id] || 0} />
              </div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:14, marginTop:4 }}>
                {tier.label}
              </div>
              {/* Mini progress bar showing YTD growth */}
              <div style={{ marginTop:12, height:3,
                background:'rgba(255,255,255,0.06)', borderRadius:2 }}>
                <div style={{
                  height:3, borderRadius:2,
                  background: tier.color,
                  width:`${Math.min(((pulse[tier.id]||0) / 5000)*100, 100)}%`,
                }} />
              </div>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:10, marginTop:4 }}>
                Of 5,000 annual target
              </div>
            </motion.div>
          ))}
        </div>

        {/* CSR Compliance block */}
        <div style={{
          background:'linear-gradient(135deg,rgba(30,58,95,0.6),rgba(15,33,64,0.8))',
          border:'1.5px solid rgba(212,175,55,0.3)',
          borderRadius:24, padding:28, marginTop:32,
        }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:20, flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:280 }}>
              <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                color:'var(--color-accent, #D4AF37)', fontSize:20, marginBottom:8 }}>
                📋 Corporate CSR Partnership
              </h3>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, lineHeight:1.7, marginBottom:16 }}>
                Under <strong style={{ color:'#fff' }}>Section 135 of the Companies Act</strong>,
                your CSR funds can directly support verified beneficiaries on TryIT.
                We provide real-time compliance-ready impact reports for SBI, IOCL, TCS,
                and other PSUs/corporates.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[['📊','Real-time impact dashboards'],
                  ['📄','Auto-generated compliance reports'],
                  ['🔒','Beneficiary verification audit trail'],
                  ['💰','Section 135 compliant fund flow'],
                ].map(([icon, label]) => (
                  <div key={label} style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:16 }}>{icon}</span>
                    <span style={{ color:'rgba(255,255,255,0.65)', fontSize:12 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ background:'rgba(212,175,55,0.1)', borderRadius:16,
                padding:20, border:'1px solid rgba(212,175,55,0.2)', marginBottom:12 }}>
                <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                  color:'var(--color-accent, #D4AF37)', fontSize:32 }}>
                  ₹50L+
                </div>
                <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:4 }}>
                  CSR Grants Available
                </div>
              </div>
              <button style={{
                background:'linear-gradient(135deg,var(--color-accent, #D4AF37),var(--color-accent-light, #E8C84A))',
                border:'none', borderRadius:14, padding:'12px 24px',
                fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
                color:'var(--color-primary, #1E3A5F)', cursor:'pointer', width:'100%',
              }}>
                Download CSR Report →
              </button>
              <p style={{ color:'rgba(255,255,255,0.3)', fontSize:10, marginTop:6 }}>
                contact@tryiteducations.net
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ringPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity:1; }
          50%      { transform: translate(-50%,-50%) scale(1.06); opacity:0.5; }
        }
      `}</style>
    </div>
  )
}
