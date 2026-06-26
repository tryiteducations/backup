// FILE: src/pages/referral/ReferralPage.jsx
// TryIT — Referral Program Page
// Route: /referral
// Unique code per user. Rewards: coins + cashback on upgrades.
import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../../context/AuthContext'
import { supabase }            from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'
const GREEN = '#059669'

const REWARD_TIERS = [
  { event:'Friend signs up',         coins:50,  cash:0,   emoji:'👋' },
  { event:'Friend takes first test', coins:100, cash:0,   emoji:'📝' },
  { event:'Friend buys Pro monthly', coins:200, cash:20,  emoji:'⭐' },
  { event:'Friend buys Pro yearly',  coins:500, cash:99,  emoji:'⭐' },
  { event:'Friend buys Ultra monthly',coins:300,cash:30,  emoji:'🏆' },
  { event:'Friend buys Ultra yearly', coins:700, cash:149, emoji:'🏆' },
  { event:'3 friends join + pay',    coins:500, cash:0,   emoji:'🎉', special:'Your tournament entry is FREE' },
]

// Mock referral history
const MOCK_REFERRALS = [
  { id:1, name:'Priya K.',    joined:'2 days ago',  status:'upgraded_pro',  coins_earned:200, cash_earned:20  },
  { id:2, name:'Arjun S.',    joined:'1 week ago',  status:'signed_up',     coins_earned:50,  cash_earned:0   },
  { id:3, name:'Kavitha R.',  joined:'2 weeks ago', status:'took_test',     coins_earned:100, cash_earned:0   },
  { id:4, name:'Ravi M.',     joined:'1 month ago', status:'upgraded_ultra',coins_earned:300, cash_earned:30  },
]

const STATUS_LABELS = {
  signed_up:      { label:'Signed Up',       color:'#64748B', bg:'#F1F5F9' },
  took_test:      { label:'Took First Test', color:'#0891B2', bg:'#EFF6FF' },
  upgraded_pro:   { label:'Upgraded to Pro', color:'#1D4ED8', bg:'#DBEAFE' },
  upgraded_ultra: { label:'Ultra Member',    color:'#92400E', bg:'#FFF7E6' },
}

export default function ReferralPage() {
  const navigate        = useNavigate()
  const { user, coins } = useAuth()

  const [referrals,     setReferrals]     = useState(MOCK_REFERRALS)
  const [totalCoins,    setTotalCoins]    = useState(650)
  const [totalCash,     setTotalCash]     = useState(50)
  const [pendingPayout, setPendingPayout] = useState(50)
  const [copied,        setCopied]        = useState(false)
  const [tab,           setTab]           = useState('overview')

  // Generate referral code from user name
  const refCode = user?.name
    ? user.name.toUpperCase().replace(/\s+/g,'').slice(0,8) + (user?.id||'').slice(0,4).toUpperCase()
    : 'TRYIT0001'

  const refLink = `https://tryiteducations.net/join?ref=${refCode}`

  useEffect(() => {
    if (!user?.id) return
    supabase.from('referrals')
      .select('*').eq('referrer_id', user.id).order('created_at',{ascending:false})
      .then(({ data }) => { if (data?.length) setReferrals(data) })
      .catch(() => {})
  }, [user?.id])

  const copyCode = () => {
    navigator.clipboard.writeText(refCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const text = `🎓 Join me on TryIT Educations — India's best exam prep platform!\n\n` +
      `✅ 1,10,000+ competitive exams\n` +
      `✅ PYQ-based practice tests\n` +
      `✅ All India Tournaments\n` +
      `✅ Learn in your language\n\n` +
      `Use my code *${refCode}* for bonus coins!\n\n` +
      `Join free: ${refLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareGeneral = async () => {
    const text = `Join TryIT Educations — India's exam prep platform!\nUse code: ${refCode}\n${refLink}`
    if (navigator.share) {
      try { await navigator.share({ title:'TryIT Educations', text, url: refLink }) }
      catch {}
    } else {
      navigator.clipboard.writeText(text)
      alert('✅ Copied! Share anywhere.')
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'20px 16px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', margin:0 }}>👥 Refer & Earn</h1>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:18 }}>
          {[
            { l:'Friends Joined', v:referrals.length,                 e:'👥' },
            { l:'Coins Earned',   v:`${totalCoins.toLocaleString('en-IN')}🪙`, e:'🪙' },
            { l:'Cash Earned',    v:`₹${totalCash}`,                  e:'💰' },
          ].map(s => (
            <div key={s.l} style={{ background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 4px', textAlign:'center' }}>
              <p style={{ fontSize:16, margin:'0 0 2px' }}>{s.e}</p>
              <p style={{ fontWeight:800, color:'#fff', fontSize:14, margin:'0 0 1px' }}>{s.v}</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Referral code */}
        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:16, padding:14 }}>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.5)', margin:'0 0 6px', letterSpacing:1 }}>YOUR REFERRAL CODE</p>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:24, color:GOLD,
              margin:0, letterSpacing:3, flex:1 }}>{refCode}</p>
            <button onClick={copyCode}
              style={{ padding:'8px 14px', background:copied?GREEN:GOLD, color:copied?'#fff':NAVY,
                border:'none', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer' }}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', margin:'6px 0 0',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {refLink}
          </p>
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ padding:'14px 16px', background:'#fff', borderBottom:'1px solid #E2E8F0' }}>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={shareWhatsApp}
            style={{ flex:1, padding:'11px', background:'#25D366', color:'#fff', border:'none',
              borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            💬 WhatsApp
          </button>
          <button onClick={shareGeneral}
            style={{ flex:1, padding:'11px', background:NAVY, color:'#fff', border:'none',
              borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            📤 Share Link
          </button>
          <button onClick={() => navigate('/tournament')}
            style={{ flex:1, padding:'11px', background:'#FFF7E6', color:'#92400E',
              border:`1.5px solid ${GOLD}`, borderRadius:12, fontWeight:700, fontSize:12, cursor:'pointer' }}>
            🏆 Free Entry
          </button>
        </div>
        <p style={{ fontSize:10, color:'#94A3B8', textAlign:'center', marginTop:8 }}>
          Refer 3 friends who pay tournament entry → YOUR entry is FREE 🎉
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', background:'#fff', borderBottom:'1px solid #E2E8F0' }}>
        {[{id:'overview',l:'💰 Rewards'},{id:'friends',l:'👥 My Referrals'},{id:'payout',l:'🏦 Payout'}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ flex:1, padding:'12px 8px', border:'none', background:'transparent', cursor:'pointer',
              fontSize:12, fontWeight:700,
              color: tab===t.id?NAVY:'#94A3B8',
              borderBottom: tab===t.id?`2.5px solid ${GOLD}`:'2.5px solid transparent' }}>
            {t.l}
          </button>
        ))}
      </div>

      <div style={{ padding:16, maxWidth:480, margin:'0 auto' }}>

        {/* OVERVIEW — reward table */}
        {tab === 'overview' && (
          <div>
            <p style={{ fontSize:12, color:'#64748B', marginBottom:14, lineHeight:1.6 }}>
              Every time a friend joins using your code, you earn coins + cashback when they upgrade.
            </p>

            {REWARD_TIERS.map((r, i) => (
              <div key={i} style={{ background:'#fff', borderRadius:14, padding:'12px 14px',
                marginBottom:8, border:'1.5px solid #E2E8F0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>{r.emoji}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'#1E293B', margin:'0 0 2px' }}>{r.event}</p>
                    {r.special && (
                      <p style={{ fontSize:11, color:GREEN, fontWeight:600, margin:0 }}>🎁 {r.special}</p>
                    )}
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    {r.coins > 0 && (
                      <p style={{ fontSize:12, fontWeight:700, color:'#92400E', margin:'0 0 1px' }}>
                        +{r.coins}🪙
                      </p>
                    )}
                    {r.cash > 0 && (
                      <p style={{ fontSize:12, fontWeight:700, color:GREEN, margin:0 }}>
                        +₹{r.cash}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background:`${NAVY}08`, border:`1.5px solid ${NAVY}22`, borderRadius:14, padding:14, marginTop:4 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, margin:'0 0 8px' }}>
                🧮 Your Potential Earnings
              </p>
              <p style={{ fontSize:12, color:'#475569', lineHeight:1.8, margin:0 }}>
                If 10 friends join and all upgrade to Pro:<br/>
                Coins: <strong>10 × 350 = 3,500🪙</strong><br/>
                Cash: <strong>10 × ₹20 = ₹200/month</strong><br/>
                + Tournament free entries worth ₹50+
              </p>
            </div>
          </div>
        )}

        {/* MY REFERRALS */}
        {tab === 'friends' && (
          <div>
            {referrals.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>
                <p style={{ fontSize:32 }}>👥</p>
                <p>No referrals yet. Share your code to start earning!</p>
                <button onClick={shareWhatsApp}
                  style={{ padding:'12px 24px', background:'#25D366', color:'#fff',
                    border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', marginTop:12 }}>
                  Share on WhatsApp →
                </button>
              </div>
            ) : referrals.map(r => {
              const st = STATUS_LABELS[r.status] || STATUS_LABELS.signed_up
              return (
                <div key={r.id} style={{ background:'#fff', borderRadius:12, padding:'12px 14px',
                  marginBottom:8, border:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`${NAVY}15`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:800, color:NAVY, fontSize:14, flexShrink:0 }}>
                    {(r.name||'?')[0]}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'#1E293B', margin:'0 0 2px' }}>{r.name}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                        background:st.bg, color:st.color }}>
                        {st.label}
                      </span>
                      <span style={{ fontSize:10, color:'#94A3B8' }}>{r.joined}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    {r.coins_earned > 0 && (
                      <p style={{ fontSize:12, fontWeight:700, color:'#92400E', margin:'0 0 1px' }}>
                        +{r.coins_earned}🪙
                      </p>
                    )}
                    {r.cash_earned > 0 && (
                      <p style={{ fontSize:12, fontWeight:700, color:GREEN, margin:0 }}>
                        +₹{r.cash_earned}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}

            <p style={{ fontSize:11, color:'#94A3B8', textAlign:'center', marginTop:12 }}>
              Total {referrals.length} friends referred · {referrals.filter(r=>r.status?.includes('upgraded')).length} upgraded to paid plan
            </p>
          </div>
        )}

        {/* PAYOUT */}
        {tab === 'payout' && (
          <div>
            <div style={{ background:`linear-gradient(135deg,${GREEN},#047857)`, borderRadius:18, padding:18, textAlign:'center', marginBottom:14 }}>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', margin:'0 0 4px', letterSpacing:1 }}>PENDING CASHBACK</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:40, color:'#fff', margin:'0 0 4px', lineHeight:1 }}>
                ₹{pendingPayout}
              </p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:'0 0 14px' }}>
                From {referrals.filter(r=>r.cash_earned>0).length} upgraded friends
              </p>
              <button style={{ padding:'10px 24px', background:'rgba(255,255,255,0.2)', color:'#fff',
                border:'1px solid rgba(255,255,255,0.3)', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                Withdraw to UPI →
              </button>
            </div>

            <div style={{ background:'#fff', borderRadius:14, padding:14, border:'1.5px solid #E2E8F0', marginBottom:12 }}>
              <p style={{ fontSize:12, fontWeight:700, color:NAVY, marginBottom:10 }}>📋 Payout Rules</p>
              {[
                'Minimum withdrawal: ₹50',
                'Processed within 3-5 business days',
                'Transferred to your registered UPI ID',
                'Cash earned only when friend\'s payment clears',
                'Referral coins are credited instantly',
                'No expiry on earned coins or cashback',
              ].map((r,i) => (
                <p key={i} style={{ fontSize:12, color:'#475569', margin:'0 0 6px', lineHeight:1.5 }}>
                  ✅ {r}
                </p>
              ))}
            </div>

            <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:12 }}>
              <p style={{ fontSize:12, color:'#1D4ED8', margin:'0 0 4px', fontWeight:600 }}>
                💡 Coins vs Cash — What's the difference?
              </p>
              <p style={{ fontSize:11, color:'#1D4ED8', lineHeight:1.6, margin:0 }}>
                <strong>Coins</strong> unlock explanations, games, and extra features inside the app.<br/>
                <strong>Cash</strong> is real money withdrawn to your bank/UPI. Both are earned when friends upgrade.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}