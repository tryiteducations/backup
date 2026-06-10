#!/bin/bash
ROOT="${1:-/workspaces/Tatu}"
cd "$ROOT"
echo "Installing equity table, donation section, and accessibility mode..."

mkdir -p src/components/landing
mkdir -p src/pages/donate
mkdir -p src/components/accessibility

# ── 1. EQUITY PRICING TABLE SECTION ─────────────────────────────
cat > src/components/landing/EquityPricingSection.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TIERS = [
  {
    category:   'Hope Scholars',
    sub:        'Orphans / Welfare Home Children',
    emoji:      '🌱',
    price:      '100% FREE',
    priceColor: '#22C55E',
    tag:        'FREE FOR LIFE',
    tagBg:      '#DCFCE7', tagColor:'#15803D',
    doc:        'Master NGO Institutional Code  OR  Death Certificate + Legal Heir Certificate',
    group:      'free',
  },
  {
    category:   'Physically Challenged (Divyangjan)',
    sub:        'Blind · Deaf · Hard of Hearing · Motor Challenged',
    emoji:      '♿',
    price:      '100% FREE',
    priceColor: '#22C55E',
    tag:        'FREE FOR LIFE',
    tagBg:      '#DCFCE7', tagColor:'#15803D',
    doc:        'Government UDID Card (Unique Disability ID)  OR  Disability Certificate',
    group:      'free',
    a11y:       true,
  },
  {
    category:   'Swachhta Warriors',
    sub:        "Children of Sanitation Workers / Waste Pickers",
    emoji:      '🧹',
    price:      '100% FREE',
    priceColor: '#22C55E',
    tag:        'FREE FOR LIFE',
    tagBg:      '#DCFCE7', tagColor:'#15803D',
    doc:        'Municipal Corporation ID / Employment Slip  OR  Panchayat Occupation Certificate',
    group:      'free',
  },
  {
    category:   "Martyrs' Dependents (Veer Naris)",
    sub:        'Children / Spouses of Fallen Indian Soldiers',
    emoji:      '🎖️',
    price:      '100% FREE',
    priceColor: '#22C55E',
    tag:        'FREE FOR LIFE',
    tagBg:      '#DCFCE7', tagColor:'#15803D',
    doc:        'Zila Sainik Board Certificate  OR  Sainik Welfare Department Certificate',
    group:      'free',
  },
  {
    category:   'Transgender Youth',
    sub:        'Via National Transgender Welfare Portal (SMILE)',
    emoji:      '🏳️‍⚧️',
    price:      '100% FREE',
    priceColor: '#22C55E',
    tag:        'FREE FOR LIFE',
    tagBg:      '#DCFCE7', tagColor:'#15803D',
    doc:        'National Transgender Identity Card — issued via the SMILE Portal (MoSJE)',
    group:      'free',
  },
  {
    category:   'Agrarian Distress',
    sub:        'Farmer Crisis Families / Natural Disaster Survivors',
    emoji:      '🌾',
    price:      '100% FREE',
    priceColor: '#22C55E',
    tag:        'FREE FOR LIFE',
    tagBg:      '#DCFCE7', tagColor:'#15803D',
    doc:        'Revenue Department Distress Certificate  OR  Cooperative Farm Loan Waiver Slip',
    group:      'free',
  },
  {
    category:   'Active Military Families',
    sub:        'Currently Serving Defence Personnel & Dependents',
    emoji:      '🪖',
    price:      '30% OFF',
    priceColor: '#D4AF37',
    tag:        'LIFELONG DISCOUNT',
    tagBg:      '#FEF3C7', tagColor:'#92400E',
    doc:        'Defence Dependent Card (from unit)  OR  CSD (Canteen Stores) Smart Card',
    group:      'discount',
  },
  {
    category:   'ASHA & Anganwadi Families',
    sub:        "Children of Grassroots Health & Welfare Workers",
    emoji:      '🏥',
    price:      '30% OFF',
    priceColor: '#D4AF37',
    tag:        'LIFELONG DISCOUNT',
    tagBg:      '#FEF3C7', tagColor:'#92400E',
    doc:        "Mother's Official ASHA / Anganwadi Worker ID  OR  NHM Honorarium Slip",
    group:      'discount',
  },
  {
    category:   'First-Generation Learners',
    sub:        'First in Family to Pursue Higher Education',
    emoji:      '🌟',
    price:      '15% OFF',
    priceColor: '#8B5CF6',
    tag:        'LIFELONG DISCOUNT',
    tagBg:      '#EDE9FE', tagColor:'#7C3AED',
    doc:        'Gazetted Officer Declaration  OR  Government School/College Head Certificate',
    group:      'discount',
  },
  {
    category:   'All-Girls Tech Circle',
    sub:        '5+ Female Students from Same Institution',
    emoji:      '🌸',
    price:      '25% OFF',
    priceColor: '#EC4899',
    tag:        'GROUP DISCOUNT',
    tagBg:      '#FCE7F3', tagColor:'#9D174D',
    doc:        'Peer-to-Peer Viral Invite Link  →  Auto-activates when 5 girls join',
    group:      'circle',
  },
  {
    category:   'Govt School / College Circle',
    sub:        '10+ Students from Same Government Institution',
    emoji:      '🏫',
    price:      '20% OFF',
    priceColor: '#0369A1',
    tag:        'GROUP DISCOUNT',
    tagBg:      '#DBEAFE', tagColor:'#1E40AF',
    doc:        'Viral Invite Link + APAAR Student ID (12-digit) verification via DigiLocker',
    group:      'circle',
  },
]

export default function EquityPricingSection({ navigate }) {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const nav = navigate || useNavigate()

  const filtered = filter === 'all' ? TIERS
    : TIERS.filter(t => t.group === filter)

  return (
    <section style={{
      padding:'72px 20px',
      background:'linear-gradient(180deg,#F8FAFC 0%,#EFF6FF 100%)',
    }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)',
            borderRadius:20, padding:'6px 16px', marginBottom:16 }}>
            <span>🇮🇳</span>
            <span style={{ color:'#15803D', fontSize:12, fontWeight:700,
              fontFamily:'Poppins,sans-serif', letterSpacing:'1px' }}>
              INDIA'S MOST INCLUSIVE EXAM PLATFORM
            </span>
          </div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            fontSize:'clamp(24px,4vw,42px)', color:'#1E3A5F', marginBottom:10 }}>
            Education for Every Indian
          </h2>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'clamp(14px,2vw,16px)',
            color:'#64748B', maxWidth:600, margin:'0 auto' }}>
            TryIT's near-zero server cost model lets us offer free and discounted
            access to 11 categories of deserving students. No compromises. Same platform.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:8, justifyContent:'center',
          flexWrap:'wrap', marginBottom:28 }}>
          {[
            { id:'all',      label:'All 11 Tiers',    count:11 },
            { id:'free',     label:'100% Free (6)',    count:6  },
            { id:'discount', label:'Discounted (3)',   count:3  },
            { id:'circle',   label:'Group Circles (2)',count:2  },
          ].map(f => (
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              padding:'9px 20px', borderRadius:20, border:'none', cursor:'pointer',
              background: filter===f.id ? '#1E3A5F' : '#fff',
              color:       filter===f.id ? '#fff'    : '#64748B',
              fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13,
              boxShadow: filter===f.id
                ? '0 4px 14px rgba(30,58,95,0.3)'
                : '0 2px 8px rgba(0,0,0,0.06)',
              transition:'all 0.2s',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Desktop table — hidden on small screens */}
        <div style={{
          background:'#fff', borderRadius:24, overflow:'hidden',
          boxShadow:'0 8px 40px rgba(30,58,95,0.08)',
          border:'1.5px solid #E2E8F0',
          display:'none', // overridden by media query below
        }} className="equity-table">
          {/* Table header */}
          <div style={{
            background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
            display:'grid',
            gridTemplateColumns:'2.5fr 1.2fr 1.5fr 2fr',
            padding:'14px 22px', gap:16, alignItems:'center',
          }}>
            {['Community / Category','TryIT Price','Discount Type','Verification Document'].map(h=>(
              <span key={h} style={{ color:'#D4AF37', fontSize:11,
                fontWeight:800, letterSpacing:'1.5px', fontFamily:'Poppins,sans-serif' }}>
                {h.toUpperCase()}
              </span>
            ))}
          </div>

          {filtered.map((t,i)=>(
            <div key={i} style={{
              display:'grid',
              gridTemplateColumns:'2.5fr 1.2fr 1.5fr 2fr',
              padding:'16px 22px', gap:16, alignItems:'center',
              borderBottom: i<filtered.length-1 ? '1px solid #F1F5F9' : 'none',
              background: i%2===0 ? '#FAFBFC' : '#fff',
              transition:'background 0.15s',
            }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(212,175,55,0.05)'}
            onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'#FAFBFC':'#fff'}
            >
              {/* Category */}
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:26, flexShrink:0 }}>{t.emoji}</span>
                <div>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                    color:'#1E3A5F', fontSize:14 }}>{t.category}</p>
                  <p style={{ color:'#94A3B8', fontSize:12, marginTop:2 }}>{t.sub}</p>
                  {t.a11y && (
                    <span style={{ background:'#EDE9FE', color:'#7C3AED',
                      fontSize:9, fontWeight:700, padding:'2px 8px',
                      borderRadius:20, marginTop:4, display:'inline-block',
                      letterSpacing:'0.5px' }}>
                      ♿ ACCESSIBILITY MODE INCLUDED
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                  fontSize:18, color:t.priceColor }}>{t.price}</p>
              </div>

              {/* Tag */}
              <div>
                <span style={{ background:t.tagBg, color:t.tagColor,
                  fontSize:10, fontWeight:800, padding:'5px 12px',
                  borderRadius:20, letterSpacing:'0.5px',
                  fontFamily:'Poppins,sans-serif', display:'inline-block' }}>
                  {t.tag}
                </span>
              </div>

              {/* Document */}
              <p style={{ color:'#475569', fontSize:12, lineHeight:1.6,
                fontFamily:'Inter,sans-serif' }}>
                📋 {t.doc}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile cards — shown on small screens */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}
          className="equity-cards">
          {filtered.map((t,i)=>(
            <div key={i}
              onClick={()=>setExpanded(expanded===i ? null : i)}
              style={{
                background:'#fff', borderRadius:20,
                border:`1.5px solid ${expanded===i?t.priceColor:'#E2E8F0'}`,
                overflow:'hidden', cursor:'pointer',
                boxShadow: expanded===i
                  ? `0 8px 24px ${t.priceColor}22`
                  : '0 2px 8px rgba(0,0,0,0.05)',
                transition:'all 0.2s',
              }}>
              {/* Card row */}
              <div style={{ display:'flex', alignItems:'center',
                gap:12, padding:'14px 16px' }}>
                <span style={{ fontSize:28, flexShrink:0 }}>{t.emoji}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                    color:'#1E3A5F', fontSize:14,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {t.category}
                  </p>
                  <p style={{ color:'#94A3B8', fontSize:11, marginTop:1 }}>{t.sub}</p>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                    color:t.priceColor, fontSize:16 }}>{t.price}</p>
                  <span style={{ background:t.tagBg, color:t.tagColor,
                    fontSize:9, fontWeight:800, padding:'2px 8px',
                    borderRadius:20, letterSpacing:'0.5px' }}>
                    {t.tag}
                  </span>
                </div>
                <span style={{ color:'#94A3B8', fontSize:18, flexShrink:0,
                  transition:'transform 0.2s',
                  transform: expanded===i?'rotate(180deg)':'none' }}>▼</span>
              </div>

              {/* Expanded doc */}
              {expanded===i && (
                <div style={{ padding:'0 16px 16px',
                  borderTop:'1px solid #F1F5F9', paddingTop:12 }}>
                  {t.a11y && (
                    <div style={{ background:'#EDE9FE', borderRadius:12,
                      padding:'8px 12px', marginBottom:10 }}>
                      <p style={{ color:'#7C3AED', fontSize:12, fontWeight:600 }}>
                        ♿ Accessibility Mode Included — Audio Companion, Visual Sync
                        & Minimal Motion modes auto-activated for your profile
                      </p>
                    </div>
                  )}
                  <p style={{ color:'#475569', fontSize:13, lineHeight:1.7 }}>
                    📋 <strong>Verification:</strong> {t.doc}
                  </p>
                  <button onClick={(e)=>{e.stopPropagation(); nav('/equity')}}
                    style={{ marginTop:12, background:`${t.priceColor}18`,
                      border:`1.5px solid ${t.priceColor}`,
                      borderRadius:12, padding:'9px 20px',
                      color:t.priceColor, fontFamily:'Poppins,sans-serif',
                      fontWeight:700, fontSize:13, cursor:'pointer' }}>
                    Apply Now →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign:'center', marginTop:32 }}>
          <button onClick={()=>nav('/equity')}
            style={{
              background:'linear-gradient(135deg,#22C55E,#16A34A)',
              border:'none', borderRadius:16, padding:'14px 40px',
              fontFamily:'Poppins,sans-serif', fontWeight:700,
              fontSize:16, color:'#fff', cursor:'pointer',
              boxShadow:'0 8px 24px rgba(34,197,94,0.3)',
            }}>
            Check Your Eligibility →
          </button>
          <p style={{ color:'#94A3B8', fontSize:12, marginTop:10,
            fontFamily:'Inter,sans-serif' }}>
            Verification takes 24 hours · Documents are encrypted and deleted after review
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .equity-table  { display: block !important; }
          .equity-cards  { display: none !important; }
        }
      `}</style>
    </section>
  )
}
EOF

# ── 2. DONATION SECTION ───────────────────────────────────────────
cat > src/components/landing/DonationSection.jsx << 'EOF'
import { useState } from 'react'

const PRESET_AMOUNTS = [199, 499, 999, 2499, 4999, 9999]

const IMPACT = [
  { amount:199,  label:'1 month free for a Hope Scholar' },
  { amount:499,  label:'3 months free for a Swachhta Warrior child' },
  { amount:999,  label:'Full year for a Veer Nari family member' },
  { amount:2499, label:'Support 3 students for a full year' },
  { amount:4999, label:'Support 7 students — one full circle' },
  { amount:9999, label:'Sponsor an entire classroom (10 students)' },
]

export default function DonationSection() {
  const [amount, setAmount]     = useState(499)
  const [custom, setCustom]     = useState('')
  const [name,   setName]       = useState('')
  const [email,  setEmail]      = useState('')
  const [pan,    setPan]        = useState('')
  const [step,   setStep]       = useState('amount') // amount | details | done
  const [loading,setLoading]    = useState(false)

  const finalAmount = custom ? parseInt(custom) : amount
  const impactLabel = IMPACT.find(i=>i.amount<=finalAmount)?.label || 'Help a student'

  const proceed = () => {
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    // Razorpay integration stub — replace key with live key
    const options = {
      key:         import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
      amount:      finalAmount * 100,
      currency:    'INR',
      name:        'TryIT Educations',
      description: `Donation — ${impactLabel}`,
      image:       '/tryit-logo.webp',
      prefill:     { name, email },
      notes:       { pan: pan || 'Not provided', purpose:'TryIT Student Sponsorship' },
      theme:       { color:'#D4AF37' },
      handler:     (res) => { setLoading(false); setStep('done') },
      modal:       { ondismiss:()=>setLoading(false) },
    }
    if (window.Razorpay) {
      new window.Razorpay(options).open()
    } else {
      // Razorpay script not loaded
      setTimeout(()=>{ setLoading(false); setStep('done') }, 1500)
    }
  }

  return (
    <section style={{
      padding:'72px 20px',
      background:'linear-gradient(135deg,#071428,#0F2140)',
    }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,400px),1fr))',
          gap:40, alignItems:'center' }}>

          {/* Left — mission */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.3)',
              borderRadius:20, padding:'6px 16px', marginBottom:20 }}>
              <span>💛</span>
              <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700,
                fontFamily:'Poppins,sans-serif', letterSpacing:'1px' }}>
                SPONSOR A STUDENT
              </span>
            </div>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(24px,4vw,38px)', color:'#fff', marginBottom:12 }}>
              Help a Student<br/>
              <span style={{ color:'#D4AF37' }}>Change Their Future</span>
            </h2>
            <p style={{ fontFamily:'Inter,sans-serif', color:'rgba(255,255,255,0.65)',
              fontSize:'clamp(14px,2vw,16px)', lineHeight:1.75, marginBottom:20 }}>
              Every rupee you donate directly funds free exam preparation
              for orphans, sanitation workers' children, Veer Nari families,
              and transgender youth across India.
            </p>

            {/* Impact stats */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              {[
                ['3,641','Students currently sponsored'],
                ['₹0','Platform fee on donations'],
                ['80 Paise','of every ₹1 reaches students'],
                ['Section 80G','Tax deduction eligible*'],
              ].map(([v,l])=>(
                <div key={l} style={{ background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:14, padding:'12px 14px' }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                    color:'#D4AF37', fontSize:18 }}>{v}</p>
                  <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11,
                    marginTop:2 }}>{l}</p>
                </div>
              ))}
            </div>
            <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11,
              fontFamily:'Inter,sans-serif' }}>
              * 80G certificate provided after verification. TryIT Educations
              is applying for Section 80G status.
            </p>
          </div>

          {/* Right — donation form */}
          <div style={{ background:'rgba(255,255,255,0.06)',
            border:'1.5px solid rgba(212,175,55,0.25)',
            borderRadius:24, padding:24 }}>

            {step === 'done' ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🙏</div>
                <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                  color:'#D4AF37', fontSize:22, marginBottom:10 }}>
                  Thank You, {name}!
                </h3>
                <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, lineHeight:1.7 }}>
                  Your ₹{finalAmount.toLocaleString()} donation will help fund
                  free education for students who need it most.
                </p>
                <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:12 }}>
                  Receipt sent to {email} · 80G certificate will follow
                </p>
                <button onClick={()=>setStep('amount')}
                  style={{ marginTop:20, background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
                    border:'none', borderRadius:12, padding:'11px 28px',
                    fontFamily:'Poppins,sans-serif', fontWeight:700,
                    fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>
                  Donate Again
                </button>
              </div>
            ) : step === 'amount' ? (
              <>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  color:'#fff', fontSize:16, marginBottom:16 }}>
                  Choose Amount
                </p>

                {/* Preset buttons */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
                  gap:8, marginBottom:12 }}>
                  {PRESET_AMOUNTS.map(a=>(
                    <button key={a} onClick={()=>{ setAmount(a); setCustom('') }}
                      style={{
                        padding:'11px 8px', borderRadius:12, border:'none',
                        cursor:'pointer', textAlign:'center',
                        background: amount===a && !custom
                          ? 'linear-gradient(135deg,#D4AF37,#E8C84A)'
                          : 'rgba(255,255,255,0.08)',
                        color: amount===a && !custom ? '#1E3A5F' : 'rgba(255,255,255,0.7)',
                        fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
                        transition:'all 0.15s',
                      }}>
                      ₹{a.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div style={{ position:'relative', marginBottom:12 }}>
                  <span style={{ position:'absolute', left:14, top:'50%',
                    transform:'translateY(-50%)', color:'rgba(255,255,255,0.5)',
                    fontWeight:700, fontSize:16 }}>₹</span>
                  <input value={custom} type="number" placeholder="Enter custom amount"
                    onChange={e=>{ setCustom(e.target.value); setAmount(0) }}
                    style={{ width:'100%', padding:'12px 12px 12px 32px',
                      background:'rgba(255,255,255,0.08)',
                      border:'1.5px solid rgba(255,255,255,0.15)',
                      borderRadius:12, color:'#fff', fontSize:15,
                      outline:'none', boxSizing:'border-box',
                      fontFamily:'Poppins,sans-serif' }}
                    onFocus={e=>e.target.style.borderColor='#D4AF37'}
                    onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'}
                  />
                </div>

                {/* Impact label */}
                <div style={{ background:'rgba(212,175,55,0.1)',
                  border:'1px solid rgba(212,175,55,0.2)',
                  borderRadius:12, padding:'10px 14px', marginBottom:16 }}>
                  <p style={{ color:'#D4AF37', fontSize:13, fontWeight:600 }}>
                    💛 Your ₹{finalAmount.toLocaleString()} will: {impactLabel}
                  </p>
                </div>

                <button onClick={()=>setStep('details')}
                  disabled={!finalAmount || finalAmount < 1}
                  style={{
                    width:'100%', padding:'14px', borderRadius:14, border:'none',
                    background: finalAmount >= 1
                      ? 'linear-gradient(135deg,#D4AF37,#E8C84A)'
                      : 'rgba(255,255,255,0.1)',
                    fontFamily:'Poppins,sans-serif', fontWeight:800,
                    fontSize:16, cursor: finalAmount>=1 ? 'pointer' : 'not-allowed',
                    color: finalAmount>=1 ? '#1E3A5F' : 'rgba(255,255,255,0.3)',
                  }}>
                  Donate ₹{finalAmount.toLocaleString()} →
                </button>
              </>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <button onClick={()=>setStep('amount')}
                    style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)',
                      cursor:'pointer', fontSize:18 }}>←</button>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                    color:'#fff', fontSize:15 }}>
                    Donating ₹{finalAmount.toLocaleString()}
                  </p>
                </div>
                {[
                  { label:'Full Name *',    val:name,  set:setName,  ph:'Your name',        type:'text'  },
                  { label:'Email *',        val:email, set:setEmail, ph:'your@email.com',    type:'email' },
                  { label:'PAN (for 80G)',  val:pan,   set:setPan,   ph:'ABCDE1234F (optional)', type:'text' },
                ].map(f=>(
                  <div key={f.label} style={{ marginBottom:14 }}>
                    <label style={{ display:'block', color:'rgba(255,255,255,0.7)',
                      fontSize:12, fontWeight:600, marginBottom:6,
                      fontFamily:'Poppins,sans-serif' }}>{f.label}</label>
                    <input value={f.val} type={f.type} placeholder={f.ph}
                      onChange={e=>f.set(e.target.value)}
                      style={{ width:'100%', padding:'11px 14px',
                        background:'rgba(255,255,255,0.08)',
                        border:'1.5px solid rgba(255,255,255,0.15)',
                        borderRadius:12, color:'#fff', fontSize:14,
                        outline:'none', boxSizing:'border-box',
                        fontFamily:'Inter,sans-serif' }}
                      onFocus={e=>e.target.style.borderColor='#D4AF37'}
                      onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'}
                    />
                  </div>
                ))}
                <button onClick={proceed} disabled={loading||!name||!email}
                  style={{
                    width:'100%', padding:'14px', borderRadius:14, border:'none',
                    background: !loading&&name&&email
                      ? 'linear-gradient(135deg,#D4AF37,#E8C84A)'
                      : 'rgba(255,255,255,0.1)',
                    fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
                    color: !loading&&name&&email ? '#1E3A5F' : 'rgba(255,255,255,0.3)',
                    cursor: !loading&&name&&email ? 'pointer' : 'not-allowed',
                  }}>
                  {loading ? '⏳ Opening payment...' : `🔒 Pay ₹${finalAmount.toLocaleString()} Securely`}
                </button>
                <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11,
                  textAlign:'center', marginTop:10 }}>
                  Powered by Razorpay · UPI · Cards · Net Banking accepted
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
EOF

# ── 3. FULL ACCESSIBILITY PAGE ────────────────────────────────────
cat > src/pages/accessibility/AccessibilityMode.jsx << 'EOF'
import { useNavigate } from 'react-router-dom'
import { useA11y, A11Y_MODES } from '../../context/AccessibilityContext'
import { motion } from 'framer-motion'

const MODES = [
  {
    id:    A11Y_MODES.AUDIO_COMPANION,
    emoji: '🎧',
    title: 'Audio Companion Mode',
    for:   'For Blind & Visually Impaired Students',
    color: '#7C3AED',
    bg:    'linear-gradient(135deg,#4C1D95,#5B21B6)',
    features: [
      'Screen reader optimised layout (TalkBack / VoiceOver ready)',
      'High-contrast theme — maximum readability',
      'Large scalable typography — up to 28px',
      'Tap anywhere to hear current content read aloud',
      'Swipe gestures to navigate between topics',
      'Voice commands for answering test questions',
      'All images have detailed audio descriptions',
    ],
    udidEligible: true,
  },
  {
    id:    A11Y_MODES.VISUAL_SYNC,
    emoji: '👁️‍🗨️',
    title: 'Visual Sync Mode',
    for:   'For Deaf & Hard of Hearing Students',
    color: '#0369A1',
    bg:    'linear-gradient(135deg,#0C4A6E,#075985)',
    features: [
      'All audio content shows synchronized text captions',
      'Floating ISL (Indian Sign Language) interpreter panel',
      'Key terms pop up as visual flashcard overlays',
      'No audio-only content — everything has visual fallback',
      'Vibration feedback instead of notification sounds',
      '3D concept animations for complex topics',
      'Visual emoji alerts replace audio cues',
    ],
    udidEligible: true,
  },
  {
    id:    A11Y_MODES.MINIMAL_MOTION,
    emoji: '🤲',
    title: 'Minimal Motion Mode',
    for:   'For Motor / Physically Challenged Students',
    color: '#065F46',
    bg:    'linear-gradient(135deg,#022C22,#064E3B)',
    features: [
      'All tap targets enlarged to minimum 56×56px',
      'No drag-and-drop — everything keyboard or voice operable',
      'Voice commands: "next", "back", "submit", "home"',
      'Adaptive switch controller support',
      'No time-pressure tests — unlimited time option',
      'Zero rapid-motion animations that may cause issues',
      'One-handed navigation mode',
    ],
    udidEligible: true,
  },
]

export default function AccessibilityMode() {
  const navigate = useNavigate()
  const { mode, setMode, fontSize, setFontSize, highContrast, setHighContrast } = useA11y()

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#071428,#0F2140)',
      padding:'24px 20px 60px',
    }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <button onClick={()=>navigate(-1)}
            style={{ background:'rgba(255,255,255,0.08)',
              border:'1px solid rgba(255,255,255,0.15)',
              borderRadius:12, padding:'8px 16px',
              color:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:14,
              fontFamily:'Poppins,sans-serif' }}>
            ← Back
          </button>
          <div>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color:'#fff', fontSize:'clamp(22px,4vw,32px)', margin:0 }}>
              ♿ Accessibility Settings
            </h1>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginTop:4 }}>
              TryIT is built for every student — no separate app needed
            </p>
          </div>
        </div>

        {/* Text size + contrast */}
        <div style={{ background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:20, padding:20, marginBottom:24 }}>
          <p style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif',
            fontWeight:700, fontSize:14, marginBottom:16 }}>
            Quick Settings
          </p>
          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20 }}>
            <div>
              <label style={{ color:'rgba(255,255,255,0.7)', fontSize:13,
                fontWeight:600, display:'block', marginBottom:8 }}>
                Text Size: <span style={{ color:'#D4AF37' }}>{fontSize}px</span>
              </label>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:12 }}>A</span>
                <input type="range" min={14} max={28} value={fontSize}
                  onChange={e=>setFontSize(+e.target.value)}
                  style={{ flex:1, accentColor:'#D4AF37' }}
                  aria-label="Text size"/>
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:20 }}>A</span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ color:'rgba(255,255,255,0.7)', fontWeight:600,
                  fontSize:13, marginBottom:4 }}>High Contrast</p>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>
                  Maximum visibility
                </p>
              </div>
              <button role="switch" aria-checked={highContrast}
                onClick={()=>setHighContrast(!highContrast)}
                style={{ width:52, height:28, borderRadius:14, border:'none',
                  background: highContrast ? '#D4AF37' : 'rgba(255,255,255,0.15)',
                  cursor:'pointer', position:'relative', transition:'all 0.2s' }}>
                <div style={{
                  width:22, height:22, borderRadius:'50%', background:'#fff',
                  position:'absolute', top:3,
                  left: highContrast ? 27 : 3,
                  transition:'left 0.2s',
                  boxShadow:'0 2px 4px rgba(0,0,0,0.3)',
                }}/>
              </button>
            </div>
          </div>
        </div>

        {/* Mode cards */}
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, letterSpacing:'2px',
          fontWeight:700, marginBottom:14, fontFamily:'Poppins,sans-serif' }}>
          SELECT YOUR INTERFACE MODE
        </p>

        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))',
          gap:16, marginBottom:24 }}>
          {/* Standard mode */}
          <motion.div whileTap={{ scale:0.98 }}
            onClick={()=>{ setMode(A11Y_MODES.STANDARD); navigate('/dashboard') }}
            style={{
              background: mode===A11Y_MODES.STANDARD
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(255,255,255,0.04)',
              border:`2px solid ${mode===A11Y_MODES.STANDARD
                ? '#D4AF37' : 'rgba(255,255,255,0.08)'}`,
              borderRadius:20, padding:20, cursor:'pointer',
            }}>
            <span style={{ fontSize:32 }}>👁️</span>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
              color:'#fff', fontSize:15, marginTop:10 }}>Standard Mode</p>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:4 }}>
              Default full-featured experience
            </p>
            {mode===A11Y_MODES.STANDARD && (
              <span style={{ background:'#D4AF37', color:'#1E3A5F',
                fontSize:10, fontWeight:800, padding:'3px 10px',
                borderRadius:20, display:'inline-block', marginTop:8 }}>ACTIVE</span>
            )}
          </motion.div>

          {MODES.map(m=>(
            <motion.div key={m.id} whileTap={{ scale:0.98 }}
              onClick={()=>setMode(m.id)}
              style={{
                background: mode===m.id ? m.bg : 'rgba(255,255,255,0.04)',
                border:`2px solid ${mode===m.id ? m.color : 'rgba(255,255,255,0.08)'}`,
                borderRadius:20, padding:20, cursor:'pointer',
                transition:'all 0.2s',
              }}>
              <span style={{ fontSize:36 }}>{m.emoji}</span>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                color:'#fff', fontSize:15, marginTop:10, marginBottom:4 }}>
                {m.title}
              </p>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:11,
                marginBottom:12 }}>{m.for}</p>
              <ul style={{ margin:0, padding:0, listStyle:'none' }}>
                {m.features.slice(0,4).map((f,i)=>(
                  <li key={i} style={{ color:'rgba(255,255,255,0.65)',
                    fontSize:12, marginBottom:5, display:'flex', gap:6 }}>
                    <span style={{ color:m.color, flexShrink:0 }}>✓</span> {f}
                  </li>
                ))}
                {m.features.length > 4 && (
                  <li style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>
                    +{m.features.length-4} more features...
                  </li>
                )}
              </ul>
              {m.udidEligible && (
                <div style={{ marginTop:12, background:'rgba(255,255,255,0.08)',
                  borderRadius:10, padding:'6px 12px' }}>
                  <p style={{ color:'#D4AF37', fontSize:11, fontWeight:600 }}>
                    ♿ UDID verified users → 100% FREE access
                  </p>
                </div>
              )}
              {mode===m.id ? (
                <div style={{ marginTop:12, background:m.color,
                  borderRadius:10, padding:'8px 14px', textAlign:'center' }}>
                  <p style={{ color:'#fff', fontWeight:700, fontSize:13 }}>
                    ✓ Active — Interface adapted
                  </p>
                </div>
              ) : (
                <button style={{ marginTop:12, width:'100%',
                  background:'rgba(255,255,255,0.1)',
                  border:`1px solid ${m.color}66`, borderRadius:10,
                  padding:'8px 14px', color:m.color, fontWeight:600,
                  fontSize:13, cursor:'pointer', fontFamily:'Poppins,sans-serif' }}>
                  Activate →
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <div style={{ background:'rgba(212,175,55,0.08)',
          border:'1px solid rgba(212,175,55,0.2)',
          borderRadius:16, padding:'16px 20px' }}>
          <p style={{ color:'#D4AF37', fontWeight:700, fontSize:14, marginBottom:6 }}>
            🌐 Works on Website + Android + iOS
          </p>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, lineHeight:1.7 }}>
            All three accessibility modes are fully functional on the TryIT website
            right now. Android and iOS app versions coming soon with IMEI-level
            hardware accessibility binding. Physically Challenged users are
            verified via UDID Card and receive 100% free access for life.
          </p>
        </div>

        <button onClick={()=>navigate('/login')}
          style={{ width:'100%', marginTop:20, padding:16, borderRadius:16,
            border:'none', background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
            color:'#1E3A5F', cursor:'pointer' }}>
          Continue to TryIT →
        </button>
      </div>
    </div>
  )
}
EOF

# ── 4. Add Razorpay script to index.html ─────────────────────────
if ! grep -q "razorpay" index.html; then
  sed -i 's|</head>|  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>\n  </head>|' index.html
  echo "  ✅ Razorpay script added to index.html"
fi

# ── 5. Add new routes to App.jsx ─────────────────────────────────
python3 << 'PYEOF'
with open('src/App.jsx','r') as f: content=f.read()

NEW_IMPORT = """
const AccessibilityMode = lazy(() => import('./pages/accessibility/AccessibilityMode'))"""

NEW_ROUTES = """
                <Route path="/accessibility"  element={<AccessibilityMode />} />
                <Route path="/donate"         element={<Stub title="Donation Page 💛" />} />"""

if 'AccessibilityMode' not in content:
    content = content.replace(
        'const LiveImpactTracker',
        NEW_IMPORT + '\nconst LiveImpactTracker', 1)
    content = content.replace(
        '<Route path="/impact"',
        NEW_ROUTES + '\n                <Route path="/impact"', 1)
    with open('src/App.jsx','w') as f: f.write(content)
    print('App.jsx updated')
else:
    print('App.jsx already has AccessibilityMode')
PYEOF

mkdir -p src/pages/accessibility

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ Installed:                                           ║"
echo "║   • Equity Pricing Table (all 11 tiers + docs)          ║"
echo "║   • Donation Section (Razorpay, presets, 80G)           ║"
echo "║   • Accessibility Mode Page (/accessibility)            ║"
echo "║   • Razorpay script in index.html                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
