import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TIERS = [
  {
    category:   'Hope Scholars',
    sub:        'Orphans / Welfare Home Children',
    emoji:      '🌱',
    price:      '100% FREE',
    priceColor: 'var(--color-success, #22C55E)',
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
    priceColor: 'var(--color-success, #22C55E)',
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
    priceColor: 'var(--color-success, #22C55E)',
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
    priceColor: 'var(--color-success, #22C55E)',
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
    priceColor: 'var(--color-success, #22C55E)',
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
    priceColor: 'var(--color-success, #22C55E)',
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
    priceColor: 'var(--color-accent, #D4AF37)',
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
    priceColor: 'var(--color-accent, #D4AF37)',
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
      background:'var(--color-bg, #F8FAFC)',
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
            fontSize:'clamp(24px,4vw,42px)', color:'var(--color-primary-dark, #1E3A5F)', marginBottom:10 }}>
            Education for Every Indian
          </h2>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'clamp(14px,2vw,16px)',
            color:'var(--color-muted, #64748B)', maxWidth:600, margin:'0 auto' }}>
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
              background: filter===f.id ? 'var(--color-primary, #1E3A5F)' : 'var(--color-surface, #FFFFFF)',
              color:       filter===f.id ? 'var(--color-surface, #FFFFFF)'    : 'var(--color-muted, #64748B)',
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
          border:'1.5px solid var(--color-border, #E2E8F0)',
          display:'none', // overridden by media query below
        }} className="equity-table">
          {/* Table header */}
          <div style={{
            background:'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
            display:'grid',
            gridTemplateColumns:'2.5fr 1.2fr 1.5fr 2fr',
            padding:'14px 22px', gap:16, alignItems:'center',
          }}>
            {['Community / Category','TryIT Price','Discount Type','Verification Document'].map(h=>(
              <span key={h} style={{ color:'var(--color-accent, #D4AF37)', fontSize:11,
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
              borderBottom: i<filtered.length-1 ? '1px solid var(--color-bg-muted, #F1F5F9)' : 'none',
              background: i%2===0 ? 'var(--color-bg-muted-2, #FAFBFC)' : 'var(--color-surface, #FFFFFF)',
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
                    color:'var(--color-primary-dark, #1E3A5F)', fontSize:14 }}>{t.category}</p>
                  <p style={{ color:'var(--color-muted, #94A3B8)', fontSize:12, marginTop:2 }}>{t.sub}</p>
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
                border:`1.5px solid ${expanded===i?t.priceColor:'var(--color-border, #E2E8F0)'}`,
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
                    color:'var(--color-primary, #1E3A5F)', fontSize:14,
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
                  borderTop:'1px solid var(--color-bg-muted-2, #F1F5F9)', paddingTop:12 }}>
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
              background:'linear-gradient(135deg,var(--color-success, #22C55E),#16A34A)',
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
