// src/pages/pricing/PricingPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// -- Read admin-controlled prices from localStorage (set via Admin → Config) --
function getConfig(key, fallback) {
  try {
    const cfg = JSON.parse(localStorage.getItem('tryit_admin_config') || '{}')
    return cfg[key] !== undefined ? Number(cfg[key]) : fallback
  } catch { return fallback }
}

// -- WHAT EACH TIER GETS ----------------------------------------------------
const TIER_FEATURES = [
  { feature:'PYQ Questions (Past Year)',        free:true,   pro:true,   ultra:true  },
  { feature:'AI-Generated New Questions',       free:'10🪙', pro:true,   ultra:true  },
  { feature:'7-Layer Explanation',              free:'5/6hr',pro:true,   ultra:true  },
  { feature:'40-Language Translation',          free:'5/6hr',pro:true,   ultra:true  },
  { feature:'Unlimited Tests',                  free:'5/day',pro:true,   ultra:true  },
  { feature:'Full Mock Tests',                  free:'1/week',pro:true,  ultra:true  },
  { feature:'Daily Materials & Current Affairs',free:true,   pro:true,   ultra:true  },
  { feature:'Leaderboard (All India Rank)',      free:true,   pro:true,   ultra:true  },
  { feature:'Battle Hall (Head-to-Head)',        free:'3/day',pro:true,   ultra:true  },
  { feature:'Basic Games (after test)',          free:true,   pro:true,   ultra:true  },
  { feature:'Advanced Games',                   free:'100🪙',pro:true,   ultra:true  },
  { feature:'Offline Question Packs',           free:'50🪙', pro:true,   ultra:true  },
  { feature:'Concept Learning (Level 1-10)',    free:false,  pro:false,  ultra:true  },
  { feature:'Preparation Pathways (JEE/NEET...)',free:false,  pro:false,  ultra:true  },
  { feature:'Spaced Repetition System',         free:false,  pro:false,  ultra:true  },
  { feature:'Mentor Doubt Resolution',          free:'100🪙',pro:'5/mo', ultra:true  },
]

const COMPETITORS = [
  { name:"BYJU's",    yearly:12000 },
  { name:'Unacademy', yearly:4800  },
  { name:'Testbook',  yearly:3000  },
  { name:'PW',        yearly:3000  },
  { name:'Adda247',   yearly:2400  },
]

const NAVY = '#2D1B69'
const GOLD = '#F59E0B'
const BG   = '#F8FAFC'

export default function PricingPage() {
  const navigate  = useNavigate()
  const { user, planTier, coins } = useAuth()
  const [annual, setAnnual]       = useState(true)
  const [toast,  setToast]        = useState('')

  // All prices from admin config (fallback to defaults)
  const P = {
    pro3day:       getConfig('pro_3day_price',       49),
    pro7day:       99,
    proMonthly:    getConfig('pro_monthly_price',   199),
    proYearly:     getConfig('pro_yearly_price',    999),
    ultraMonthly:  getConfig('ultra_monthly_price', 299),
    ultraYearly:   getConfig('ultra_yearly_price', 1499),
    coins1price:   getConfig('coin_pack_1_price',     5),
    coins1amount:  getConfig('coin_pack_1_coins',   100),
    coins2price:   getConfig('coin_pack_2_price',    20),
    coins2amount:  getConfig('coin_pack_2_coins',   500),
    coins3price:   getConfig('coin_pack_3_price',    49),
    coins3amount:  getConfig('coin_pack_3_coins', 1500),
    topicUnlock:   getConfig('topic_unlock_price',   25),
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleBuy = (planName, amount) => {
    if (!user) { navigate('/login'); return }
    // Razorpay integration via src/lib/payment.js
    // TODO: import and call initRazorpay({ plan: planName, amount, userId: user.id })
    showToast(`Redirecting to payment for ${planName} (₹${amount})...`)
    // navigate to payment flow
  }

  const isCurrentPlan = (tier) => planTier === tier

  // -- TIER CARD DATA --------------------------------------------------------
  const TIERS = [
    {
      id:       'free',
      name:     'Free',
      tagline:  'Start your journey',
      emoji:    '🆓',
      price:    0,
      yearly:   0,
      color:    'var(--color-text-light, #64748B)',
      bg:       '#F8FAFC',
      border:   'var(--color-border, #E2E8F0)',
      cta:      isCurrentPlan('free') ? 'Your Current Plan' : 'Get Started Free',
      ctaFn:    () => !user ? navigate('/login') : null,
      highlights: [
        '✅ PYQ questions - unlimited',
        '✅ 5 explanations per 6 hours',
        '✅ Daily current affairs',
        '✅ All India leaderboard',
        '🪙 Use coins to unlock more',
      ],
    },
    {
      id:       'pro',
      name:     'Pro',
      tagline:  'For serious exam preppers',
      emoji:    '⚡',
      price:    annual ? P.proYearly   : P.proMonthly,
      yearlyEq: annual ? Math.round(P.proYearly/12)  : null,
      color:    NAVY,
      bg:       '#EFF6FF',
      border:   NAVY,
      badge:    '🔥 MOST POPULAR',
      cta:      isCurrentPlan('pro') ? 'Your Current Plan' : 'Upgrade to Pro',
      ctaFn:    () => handleBuy('pro', annual ? P.proYearly : P.proMonthly),
      highlights: [
        '✅ Everything in Free',
        '✅ All questions (AI + PYQ)',
        '✅ Unlimited 7-layer explanations',
        '✅ Unlimited tests & full mocks',
        '✅ All games & offline packs',
        '✅ 5 mentor doubts per month',
      ],
    },
    {
      id:       'ultra',
      name:     'Ultra',
      tagline:  'Replace your coaching centre',
      emoji:    '🏆',
      price:    annual ? P.ultraYearly  : P.ultraMonthly,
      yearlyEq: annual ? Math.round(P.ultraYearly/12) : null,
      color:    '#92400E',
      bg:       'linear-gradient(135deg,#FFF7E6,#FFFBF0)',
      border:   GOLD,
      badge:    '✨ COACHING REPLACEMENT',
      cta:      isCurrentPlan('ultra') ? 'Your Current Plan' : 'Go Ultra →',
      ctaFn:    () => handleBuy('ultra', annual ? P.ultraYearly : P.ultraMonthly),
      highlights: [
        '✅ Everything in Pro',
        '✅ Concept Learning (Level 1-10)',
        '✅ All 24 Preparation Pathways',
        '✅ Spaced Repetition System',
        '✅ Unlimited mentor doubts',
        '✅ Priority flag resolution',
      ],
    },
  ]

  const tableCheck = (val) => {
    if (val === true)  return { icon:'✅', color:'#059669' }
    if (val === false) return { icon:'❌', color:'#DC2626' }
    return { icon:val, color: val.includes('🪙') ? '#92400E' : '#475569' }
  }

  return (
    <div style={{ minHeight:'100vh', background:BG, paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB', marginBottom:24 }}>
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'14px 24px',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}
            onClick={() => navigate('/')}>
            <div style={{ width:34, height:34, borderRadius:9, background:NAVY,
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff',
              fontWeight:800, fontSize:15, fontFamily:'Poppins,sans-serif' }}>T</div>
            <div style={{ lineHeight:1.1 }}>
              <div style={{ fontWeight:800, fontSize:16, color:NAVY, fontFamily:'Poppins,sans-serif' }}>TryIT</div>
              <div style={{ fontSize:10, color:'#64748B' }}>Educations</div>
            </div>
          </div>
          {user ? (
            <button onClick={() => navigate(-1)}
              style={{ padding:'8px 16px', borderRadius:10, border:'1px solid #E2E8F0',
                background:'transparent', color:'#64748B', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              ← Back
            </button>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => navigate('/login')}
                style={{ padding:'8px 16px', borderRadius:10, border:'1px solid #E2E8F0',
                  background:'transparent', color:'#64748B', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                Login
              </button>
              <button onClick={() => navigate('/register')}
                style={{ padding:'8px 16px', borderRadius:10, border:'none',
                  background:NAVY, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                Get Started →
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 24px' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:9999,
          background:NAVY, color:'#fff', padding:'12px 24px', borderRadius:12, fontSize:13, fontWeight:600,
          boxShadow:'0 8px 24px rgba(0,0,0,0.15)', whiteSpace:'nowrap' }}>
          {toast}
        </div>
      )}


      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 16px' }}>

        {/* -- CURRENT PLAN BANNER ---------------------------------------- */}
        {user && (
          <div style={{ background: planTier==='ultra' ? 'linear-gradient(135deg,#92400E,#B45309)'
                                  : planTier==='pro'   ? `linear-gradient(135deg,${NAVY},#1A0D3D)`
                                  : '#F1F5F9',
            borderRadius:16, padding:'14px 20px', marginBottom:20,
            display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <div>
              <p style={{ color: planTier==='free'?'#475569':'#fff', fontWeight:700, fontSize:14 }}>
                {planTier==='free'  ? '🆓 You are on the Free plan'  :
                 planTier==='pro'   ? '⚡ You are on Pro - great choice!' :
                                     '🏆 You are on Ultra - top tier!'}
              </p>
              <p style={{ color: planTier==='free'?'#94A3B8':'rgba(255,255,255,0.7)', fontSize:12 }}>
                {planTier==='free' ? 'Upgrade to unlock unlimited explanations and more'
                                   : 'All features unlocked - keep going!'}
              </p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ background:'rgba(255,255,255,0.15)', padding:'4px 12px', borderRadius:99,
                color: planTier==='free'?NAVY:'#fff', fontSize:12, fontWeight:700 }}>
                🪙 {coins || 0} coins
              </span>
            </div>
          </div>
        )}

        {/* -- COMPETITOR SAVINGS BANNER ---------------------------------- */}
        <div style={{ background:`linear-gradient(135deg,${NAVY},#1A0D3D)`, borderRadius:20,
          padding:'20px 24px', marginBottom:28, color:'#fff' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18, marginBottom:8, color:GOLD }}>
            87% cheaper than BYJU's. Same quality. Zero compromise.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {COMPETITORS.map(c => {
              const savings = Math.round((1 - P.ultraYearly/c.yearly) * 100)
              return (
                <div key={c.name} style={{ background:'rgba(255,255,255,0.08)', borderRadius:12,
                  padding:'8px 14px', fontSize:12 }}>
                  <span style={{ color:'rgba(255,255,255,0.6)' }}>{c.name} ₹{c.yearly.toLocaleString('en-IN')}/yr</span>
                  <span style={{ color:GOLD, fontWeight:700, marginLeft:6 }}>vs TryIT Ultra ₹{P.ultraYearly} - {savings}% off</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* -- ANNUAL / MONTHLY TOGGLE ------------------------------------ */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:24, gap:0 }}>
          <div style={{ background:'#fff', borderRadius:99, padding:4, border:'1.5px solid #E2E8F0',
            display:'flex', gap:0 }}>
            <button onClick={() => setAnnual(false)}
              style={{ padding:'8px 20px', borderRadius:99, border:'none', cursor:'pointer',
                fontWeight:700, fontSize:13,
                background: !annual ? NAVY       : 'transparent',
                color:      !annual ? '#fff'      : '#94A3B8' }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              style={{ padding:'8px 20px', borderRadius:99, border:'none', cursor:'pointer',
                fontWeight:700, fontSize:13, display:'flex', alignItems:'center', gap:6,
                background: annual ? NAVY        : 'transparent',
                color:      annual ? '#fff'      : '#94A3B8' }}>
              Annual
              <span style={{ background:GOLD, color:NAVY, borderRadius:99,
                padding:'1px 8px', fontSize:10, fontWeight:900 }}>
                SAVE 50%
              </span>
            </button>
          </div>
        </div>

        {/* -- THREE TIER CARDS ------------------------------------------- */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',
          gap:16, marginBottom:32 }}>
          {TIERS.map(tier => (
            <div key={tier.id} style={{ background:tier.bg, borderRadius:20, padding:22,
              border:`2px solid ${tier.border}`, position:'relative',
              boxShadow: tier.id==='ultra' ? `0 8px 32px ${GOLD}33` : '0 2px 8px rgba(0,0,0,0.06)' }}>
              {tier.badge && (
                <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)',
                  background: tier.id==='ultra' ? GOLD : NAVY,
                  color: tier.id==='ultra' ? NAVY : '#fff',
                  padding:'4px 14px', borderRadius:99, fontSize:10, fontWeight:800, whiteSpace:'nowrap' }}>
                  {tier.badge}
                </div>
              )}

              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontSize:24 }}>{tier.emoji}</span>
                <div>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17, color:tier.color }}>{tier.name}</p>
                  <p style={{ fontSize:11, color:'#94A3B8' }}>{tier.tagline}</p>
                </div>
              </div>

              {/* Price */}
              <div style={{ marginBottom:16 }}>
                {tier.price === 0 ? (
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:32, color:tier.color }}>Free</p>
                ) : (
                  <div>
                    <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:32, color:tier.color }}>
                      ₹{tier.price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize:13, color:'#94A3B8' }}>/{annual?'year':'month'}</span>
                    {tier.yearlyEq && (
                      <p style={{ fontSize:11, color:'#059669', fontWeight:600, marginTop:2 }}>
                        ≈ ₹{tier.yearlyEq}/month - best rate!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Highlights */}
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 16px', display:'flex', flexDirection:'column', gap:5 }}>
                {tier.highlights.map(h => (
                  <li key={h} style={{ fontSize:12, color:'#475569', lineHeight:1.5 }}>{h}</li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={tier.ctaFn}
                disabled={isCurrentPlan(tier.id)}
                style={{ width:'100%', padding:'12px 0', borderRadius:12, border:'none',
                  fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:13, cursor: isCurrentPlan(tier.id) ? 'default' : 'pointer',
                  background: isCurrentPlan(tier.id) ? '#E2E8F0'
                            : tier.id==='ultra'       ? `linear-gradient(135deg,${GOLD},#E8C96A)`
                            : tier.id==='pro'          ? NAVY
                            : '#F1F5F9',
                  color: isCurrentPlan(tier.id) ? '#94A3B8'
                       : tier.id==='ultra'       ? NAVY
                       : tier.id==='pro'          ? '#fff'
                       : '#475569',
                }}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* -- TRIAL PASSES (quick access) -------------------------------- */}
        <div style={{ background:'#fff', borderRadius:20, padding:20, border:'1.5px solid #E2E8F0', marginBottom:28 }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:NAVY, marginBottom:4 }}>
            ⚡ Quick Access Passes - No Commitment
          </p>
          <p style={{ fontSize:13, color:'#94A3B8', marginBottom:14 }}>
            Try Pro or Ultra for a few days before committing to a full plan.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:12 }}>
            {[
              { label:'3-Day Pro Pass',  price:P.pro3day,         desc:'Full Pro for 72 hours', tier:'pro'  },
              { label:'7-Day Pro Pass',  price:P.pro7day,         desc:'Full Pro for 1 week',   tier:'pro'  },
              { label:'3-Day Ultra Pass',price:Math.round(P.ultraMonthly/10), desc:'Full Ultra for 72 hours',tier:'ultra'},
            ].map(pass => (
              <div key={pass.label} style={{ background:BG, borderRadius:14, padding:14, border:'1.5px solid #E2E8F0', textAlign:'center' }}>
                <p style={{ fontWeight:700, fontSize:13, color:NAVY, marginBottom:4 }}>{pass.label}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:22, color:GOLD }}>₹{pass.price}</p>
                <p style={{ fontSize:11, color:'#94A3B8', marginBottom:10 }}>{pass.desc}</p>
                <button onClick={() => handleBuy(pass.label, pass.price)}
                  style={{ width:'100%', padding:'8px', background:NAVY, color:'#fff', border:'none',
                    borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                  Try Now →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* -- TOPIC UNLOCK (₹25/topic) ----------------------------------- */}
        <div style={{ background:'linear-gradient(135deg,#FFF7E6,#FFFBF0)', borderRadius:20,
          padding:20, border:`1.5px solid ${GOLD}44`, marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
            <div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:NAVY }}>
                📖 Learn One Topic at a Time - ₹{P.topicUnlock}
              </p>
              <p style={{ fontSize:13, color:'#92400E', marginBottom:10 }}>
                Not ready for Ultra? Buy concept learning for one specific topic - permanently.
              </p>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:4 }}>
                <li style={{ fontSize:12, color:'#92400E' }}>✅ All 10 concept levels for that topic</li>
                <li style={{ fontSize:12, color:'#92400E' }}>✅ Cultural story + 7-layer explanation</li>
                <li style={{ fontSize:12, color:'#92400E' }}>✅ Checkpoint quiz + spaced repetition</li>
                <li style={{ fontSize:12, color:'#92400E' }}>✅ Lifetime access - no expiry</li>
              </ul>
            </div>
            <div style={{ textAlign:'center', minWidth:120 }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:36, color:NAVY }}>₹{P.topicUnlock}</p>
              <p style={{ fontSize:11, color:'#92400E', marginBottom:8 }}>per topic · lifetime</p>
              <button onClick={() => handleBuy('topic_unlock', P.topicUnlock)}
                style={{ padding:'10px 20px', background:GOLD, color:NAVY, border:'none',
                  borderRadius:12, fontWeight:800, fontSize:13, cursor:'pointer' }}>
                Choose Topic →
              </button>
            </div>
          </div>
        </div>

        {/* -- COIN PACKS ------------------------------------------------- */}
        <div style={{ marginBottom:28 }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:NAVY, marginBottom:4 }}>
            🪙 Coin Packs - Use Instantly
          </p>
          <p style={{ fontSize:13, color:'#94A3B8', marginBottom:14 }}>
            Use coins to unlock individual explanations (20 coins each), games, or offline packs - any time, no plan needed.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
            {[
              { label:`${P.coins1amount} Coins`, price:P.coins1price,  coins:P.coins1amount, desc:`Unlock ${P.coins1amount/20} explanations`, best:false },
              { label:`${P.coins2amount} Coins`, price:P.coins2price,  coins:P.coins2amount, desc:`Unlock ${P.coins2amount/20} explanations`, best:false },
              { label:`${P.coins3amount} Coins`, price:P.coins3price,  coins:P.coins3amount, desc:`Unlock ${P.coins3amount/20} explanations + games`, best:true  },
            ].map(pack => (
              <div key={pack.label} style={{ background:'#fff', borderRadius:16, padding:16,
                border: pack.best ? `2px solid ${GOLD}` : '1.5px solid #E2E8F0', position:'relative' }}>
                {pack.best && (
                  <span style={{ position:'absolute', top:-10, right:12, background:GOLD, color:NAVY,
                    fontSize:9, fontWeight:800, padding:'3px 8px', borderRadius:99 }}>BEST VALUE</span>
                )}
                <p style={{ fontSize:22, marginBottom:4 }}>🪙</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:15, color:NAVY }}>{pack.label}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:22, color:GOLD }}>₹{pack.price}</p>
                <p style={{ fontSize:11, color:'#94A3B8', marginBottom:10 }}>{pack.desc}</p>
                <button onClick={() => handleBuy(`coins_${pack.coins}`, pack.price)}
                  style={{ width:'100%', padding:'9px', background: pack.best ? GOLD : BG,
                    color: pack.best ? NAVY : '#475569',
                    border: pack.best ? 'none' : '1.5px solid #E2E8F0',
                    borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                  Buy Now 🪙
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize:11, color:'#94A3B8', marginTop:10 }}>
            💡 You currently have <strong>{coins||0} coins</strong>.
            {(coins||0) >= 20 ? ` You can unlock ${Math.floor((coins||0)/20)} more explanations right now.` : ' Top up to unlock more.'}
          </p>
        </div>

        {/* -- FEATURE COMPARISON TABLE ------------------------------------ */}
        <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid #E2E8F0', overflow:'hidden', marginBottom:28 }}>
          <div style={{ background:NAVY, padding:'14px 20px', display:'grid', gridTemplateColumns:'1fr 80px 80px 80px', gap:8 }}>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, fontWeight:600 }}>Feature</p>
            {['Free','Pro','Ultra'].map(t => (
              <p key={t} style={{ color:t==='Ultra'?GOLD:t==='Pro'?'#93C5FD':'rgba(255,255,255,0.7)', fontSize:12, fontWeight:800, textAlign:'center' }}>{t}</p>
            ))}
          </div>
          {TIER_FEATURES.map((row, i) => {
            const freeC  = tableCheck(row.free)
            const proC   = tableCheck(row.pro)
            const ultraC = tableCheck(row.ultra)
            return (
              <div key={row.feature}
                style={{ padding:'10px 20px', display:'grid', gridTemplateColumns:'1fr 80px 80px 80px', gap:8,
                  background: i%2===0 ? '#fff' : BG, alignItems:'center' }}>
                <p style={{ fontSize:12, color:'#475569' }}>{row.feature}</p>
                {[freeC, proC, ultraC].map((c,j) => (
                  <p key={j} style={{ textAlign:'center', fontSize:11, color:c.color, fontWeight:600 }}>{c.icon}</p>
                ))}
              </div>
            )
          })}
        </div>

        {/* -- REFERRAL SECTION ------------------------------------------- */}
        <div style={{ background:`linear-gradient(135deg,${NAVY},#1A0D3D)`, borderRadius:20, padding:20, marginBottom:28, color:'#fff' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:GOLD, marginBottom:4 }}>
            🎁 Refer & Earn - Free Upgrades
          </p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginBottom:14 }}>
            Share your referral code. When your friend upgrades, YOU earn coins and cashback.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
            {[
              { event:'Friend signs up',    reward:'50 coins'          },
              { event:'Friend buys Pro',    reward:'200 coins + ₹20'  },
              { event:'Friend buys Ultra',  reward:'500 coins + ₹50'  },
              { event:'Active 30 days',     reward:'100 bonus coins'   },
            ].map(r => (
              <div key={r.event} style={{ background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px' }}>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>{r.event}</p>
                <p style={{ fontSize:13, fontWeight:700, color:GOLD }}>{r.reward}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/referral')}
            style={{ marginTop:14, padding:'10px 24px', background:GOLD, color:NAVY,
              border:'none', borderRadius:12, fontWeight:800, fontSize:13, cursor:'pointer' }}>
            Get My Referral Code →
          </button>
        </div>

        {/* -- INSTITUTION CTA -------------------------------------------- */}
        <div style={{ background:'#EFF6FF', borderRadius:20, padding:20, border:'1.5px solid #BFDBFE' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:NAVY, marginBottom:4 }}>
            🏫 For Schools & Coaching Institutes
          </p>
          <p style={{ fontSize:13, color:'#475569', marginBottom:12 }}>
            Manage batches, assign preparation pathways, track student progress. Get 10% cashback on every student subscription you push.
          </p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
            <div>
              <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:22, color:NAVY }}>₹4,999</span>
              <span style={{ fontSize:12, color:'#94A3B8' }}>/month · up to 200 students</span>
            </div>
            <button onClick={() => handleBuy('institution_monthly', 4999)}
              style={{ padding:'10px 20px', background:NAVY, color:'#fff',
                border:'none', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
              Contact for B2B →
            </button>
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}