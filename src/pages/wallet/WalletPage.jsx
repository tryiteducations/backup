// FILE: src/pages/wallet/WalletPage.jsx
// TryIT — Wallet & Coins Page
// Route: /wallet
import { useState, useEffect } from 'react'
import { useNavigate }        from 'react-router-dom'
import { useAuth }            from '../../context/AuthContext'
import { supabase }           from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'
const GREEN = '#059669'

// Admin-controlled coin pack prices (reads from localStorage config)
function getConfig(key, fallback) {
  try {
    const cfg = JSON.parse(localStorage.getItem('tryit_admin_config') || '{}')
    return cfg[key] !== undefined ? Number(cfg[key]) : fallback
  } catch { return fallback }
}

const EARN_WAYS = [
  { way:'Complete a practice test',         coins:10,  emoji:'📝', freq:'Daily' },
  { way:'Pass a concept checkpoint (≥2/3)', coins:30,  emoji:'✅', freq:'Per checkpoint' },
  { way:'7-day study streak',               coins:50,  emoji:'🔥', freq:'Weekly' },
  { way:'Win a battle (1v1)',               coins:25,  emoji:'⚔️', freq:'Per win' },
  { way:'Share Bharat Pulse story',         coins:5,   emoji:'📤', freq:'Daily limit 3' },
  { way:'Refer a friend (signup)',          coins:50,  emoji:'👥', freq:'Per referral' },
  { way:'Friend upgrades to Pro',           coins:200, emoji:'⭐', freq:'Per upgrade' },
  { way:'Complete a full mock test',        coins:30,  emoji:'🎯', freq:'Per mock' },
  { way:'30-day streak milestone',          coins:200, emoji:'🏆', freq:'Monthly' },
]

const COIN_USES = [
  { use:'Unlock explanation (free tier)',   cost:20,  emoji:'💡' },
  { use:'Unlock AI question (free tier)',   cost:10,  emoji:'🤖' },
  { use:'Unlock basic game (no test done)', cost:30,  emoji:'🎮' },
  { use:'Extra battle (beyond 3/day)',      cost:20,  emoji:'⚔️' },
  { use:'Unlock advanced game',             cost:100, emoji:'🕹️' },
  { use:'Extra mock test (free tier)',      cost:50,  emoji:'📝' },
  { use:'Ask mentor a doubt',              cost:100, emoji:'🧑‍🏫' },
  { use:'Offline pack — 1 topic',          cost:50,  emoji:'📥' },
]

export default function WalletPage() {
  const navigate          = useNavigate()
  const { user, coins, addCoins, planTier } = useAuth()

  const [tab,          setTab]          = useState('balance')
  const [transactions, setTransactions] = useState([])
  const [purchasing,   setPurchasing]   = useState(null)
  const [showSuccess,  setShowSuccess]  = useState(null)

  // Coin packs from admin config
  const COIN_PACKS = [
    { id:'starter', label:'Starter',   price:getConfig('coin_pack_1_price',5),  coins:getConfig('coin_pack_1_coins',100),  badge:null,          desc:`${getConfig('coin_pack_1_coins',100)/20} explanations` },
    { id:'smart',   label:'Smart',     price:getConfig('coin_pack_2_price',20), coins:getConfig('coin_pack_2_coins',500),  badge:'SAVE 20%',    desc:`${getConfig('coin_pack_2_coins',500)/20} explanations` },
    { id:'power',   label:'Power',     price:getConfig('coin_pack_3_price',49), coins:getConfig('coin_pack_3_coins',1500), badge:'BEST VALUE',  desc:'Explanations + games + battles' },
  ]

  useEffect(() => {
    if (!user?.id) return
    supabase.from('coins_ledger').select('*').eq('user_id', user.id)
      .order('created_at',{ascending:false}).limit(30)
      .then(({ data }) => setTransactions(data || []))
      .catch(() => {
        // Mock transactions
        setTransactions([
          { id:1, transaction_type:'earned_test',    amount:10,  balance_after:840, notes:'Practice test completed',   created_at: new Date(Date.now()-2*60*60*1000).toISOString() },
          { id:2, transaction_type:'earned_checkpoint',amount:30,balance_after:830, notes:'Percentage L3 checkpoint',  created_at: new Date(Date.now()-5*60*60*1000).toISOString() },
          { id:3, transaction_type:'spent_hint',     amount:-20, balance_after:800, notes:'Explanation unlocked',      created_at: new Date(Date.now()-1*24*60*60*1000).toISOString() },
          { id:4, transaction_type:'earned_streak',  amount:50,  balance_after:820, notes:'7-day streak bonus',        created_at: new Date(Date.now()-2*24*60*60*1000).toISOString() },
          { id:5, transaction_type:'earned_referral',amount:50,  balance_after:770, notes:'Friend Priya joined',       created_at: new Date(Date.now()-4*24*60*60*1000).toISOString() },
          { id:6, transaction_type:'purchased',      amount:100, balance_after:720, notes:'Bought 100 coins (₹5)',     created_at: new Date(Date.now()-5*24*60*60*1000).toISOString() },
        ])
      })
  }, [user?.id])

  const handleBuyCoins = async (pack) => {
    setPurchasing(pack.id)
    // Razorpay integration
    try {
      // TODO: Call payment.js → initRazorpay({ plan:`coins_${pack.coins}`, amount:pack.price, userId:user.id })
      // For now, simulate success in dev
      setTimeout(() => {
        addCoins(pack.coins)
        setShowSuccess(pack)
        setPurchasing(null)
        const newTx = { id:Date.now(), transaction_type:'purchased', amount:pack.coins, balance_after:(coins||0)+pack.coins, notes:`Bought ${pack.coins} coins (₹${pack.price})`, created_at:new Date().toISOString() }
        setTransactions(prev => [newTx, ...prev])
      }, 1500)
    } catch {
      setPurchasing(null)
    }
  }

  const txIcon = (type) => {
    if (type === 'purchased')        return { icon:'🛒', color:NAVY }
    if (type?.startsWith('earned'))  return { icon:'⬆️', color:GREEN }
    if (type?.startsWith('spent'))   return { icon:'⬇️', color:'#DC2626' }
    return { icon:'💰', color:'#64748B' }
  }

  const txLabel = {
    earned_test:        'Test completed',
    earned_checkpoint:  'Checkpoint passed',
    earned_streak:      'Streak bonus',
    earned_referral:    'Referral reward',
    earned_mock:        'Mock test completed',
    earned_battle_win:  'Battle win',
    spent_hint:         'Explanation unlocked',
    spent_game:         'Game unlocked',
    spent_battle:       'Extra battle',
    spent_mentor:       'Mentor doubt',
    purchased:          'Coins purchased',
  }

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* Success overlay */}
      {showSuccess && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}>
          <div style={{ background:'#fff', borderRadius:24, padding:28, maxWidth:320, textAlign:'center', width:'100%' }}>
            <p style={{ fontSize:48, marginBottom:8 }}>🪙</p>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:20, margin:'0 0 8px' }}>
              +{showSuccess.coins} Coins Added!
            </h3>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 16px' }}>
              Your new balance: <strong>{((coins||0)).toLocaleString('en-IN')} coins</strong>
            </p>
            <button onClick={() => setShowSuccess(null)}
              style={{ width:'100%', padding:'12px', background:NAVY, color:'#fff', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer' }}>
              Done ✓
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'20px 16px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', margin:0 }}>🪙 My Wallet</h1>
        </div>
        <div style={{ textAlign:'center' }}>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', margin:'0 0 4px', letterSpacing:1 }}>YOUR COIN BALANCE</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:52, color:GOLD, margin:'0 0 4px', lineHeight:1 }}>
            {(coins||0).toLocaleString('en-IN')}
          </p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:'0 0 16px' }}>
            = {Math.floor((coins||0)/20)} free explanations available
          </p>
          <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
            <button onClick={() => setTab('buy')}
              style={{ padding:'10px 24px', background:GOLD, color:NAVY, border:'none', borderRadius:12, fontWeight:800, fontSize:13, cursor:'pointer' }}>
              + Buy Coins
            </button>
            <button onClick={() => setTab('earn')}
              style={{ padding:'10px 24px', background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
              Earn Free →
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', background:'#fff', borderBottom:'1px solid #E2E8F0' }}>
        {[
          { id:'balance', label:'💰 Balance' },
          { id:'buy',     label:'🛒 Buy Coins' },
          { id:'earn',    label:'🎁 Earn Free' },
          { id:'use',     label:'💡 Use Coins' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:'12px 6px', border:'none', background:'transparent', cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
              color: tab===t.id ? NAVY : '#94A3B8',
              borderBottom: tab===t.id ? `2.5px solid ${GOLD}` : '2.5px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:16, maxWidth:480, margin:'0 auto' }}>

        {/* BALANCE TAB — transaction history */}
        {tab === 'balance' && (
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:1, textTransform:'uppercase', marginBottom:12 }}>
              RECENT TRANSACTIONS
            </p>
            {transactions.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>
                <p style={{ fontSize:28 }}>📭</p>
                <p>No transactions yet. Start studying to earn coins!</p>
              </div>
            ) : transactions.map(tx => {
              const { icon, color } = txIcon(tx.transaction_type)
              const isEarned = tx.amount > 0
              return (
                <div key={tx.id} style={{ background:'#fff', borderRadius:12, padding:'12px 14px', marginBottom:8, border:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                    {icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:'#1E293B', margin:0 }}>
                      {txLabel[tx.transaction_type] || tx.transaction_type?.replace(/_/g,' ')}
                    </p>
                    <p style={{ fontSize:10, color:'#94A3B8', margin:'2px 0 0' }}>
                      {tx.notes} · {new Date(tx.created_at).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                    </p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:14, fontWeight:800, color:isEarned?GREEN:'#DC2626', margin:0 }}>
                      {isEarned?'+':''}{tx.amount}🪙
                    </p>
                    <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>
                      bal: {tx.balance_after}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* BUY COINS TAB */}
        {tab === 'buy' && (
          <div>
            <p style={{ fontSize:13, color:'#64748B', marginBottom:16, lineHeight:1.6 }}>
              Buy coins to unlock explanations, games, and extra features instantly — no subscription needed.
            </p>
            {COIN_PACKS.map(pack => (
              <div key={pack.id} style={{ background:'#fff', borderRadius:16, padding:16, marginBottom:12,
                border: pack.badge==='BEST VALUE' ? `2px solid ${GOLD}` : '1.5px solid #E2E8F0',
                position:'relative', overflow:'hidden' }}>
                {pack.badge && (
                  <span style={{ position:'absolute', top:12, right:12, fontSize:9, fontWeight:800,
                    background: pack.badge==='BEST VALUE'?GOLD:'#1D4ED8',
                    color: pack.badge==='BEST VALUE'?NAVY:'#fff',
                    padding:'2px 8px', borderRadius:99 }}>
                    {pack.badge}
                  </span>
                )}
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ textAlign:'center', flexShrink:0 }}>
                    <p style={{ fontSize:28, margin:0 }}>🪙</p>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:20, color:NAVY, margin:0 }}>
                      {pack.coins.toLocaleString('en-IN')}
                    </p>
                    <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>coins</p>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, color:'#1E293B', fontSize:14, margin:'0 0 2px' }}>{pack.label} Pack</p>
                    <p style={{ fontSize:11, color:'#64748B', margin:'0 0 10px' }}>{pack.desc}</p>
                    <button
                      onClick={() => handleBuyCoins(pack)}
                      disabled={purchasing === pack.id}
                      style={{ padding:'10px 20px', background:pack.badge==='BEST VALUE'?GOLD:NAVY,
                        color:pack.badge==='BEST VALUE'?NAVY:'#fff', border:'none', borderRadius:10,
                        fontWeight:800, fontSize:13, cursor:'pointer',
                        opacity:purchasing===pack.id?0.7:1 }}>
                      {purchasing===pack.id ? '⏳ Processing...' : `Buy for ₹${pack.price} →`}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12, padding:12 }}>
              <p style={{ fontSize:12, color:'#065F46', margin:0, lineHeight:1.6 }}>
                💡 <strong>Better value:</strong> Pro plan (₹199/month) gives unlimited explanations — no coins needed.
                <button onClick={() => navigate('/pro')} style={{ color:GREEN, fontWeight:700, background:'none', border:'none', cursor:'pointer', fontSize:12 }}>
                  Compare plans →
                </button>
              </p>
            </div>
          </div>
        )}

        {/* EARN FREE TAB */}
        {tab === 'earn' && (
          <div>
            <p style={{ fontSize:13, color:'#64748B', marginBottom:14 }}>
              Earn coins every day through your normal study routine — no extra effort needed.
            </p>
            {EARN_WAYS.map(e => (
              <div key={e.way} style={{ background:'#fff', borderRadius:12, padding:'11px 14px', marginBottom:8, border:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{e.emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:12, fontWeight:600, color:'#1E293B', margin:0 }}>{e.way}</p>
                  <p style={{ fontSize:10, color:'#94A3B8', margin:'2px 0 0' }}>{e.freq}</p>
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:'#92400E', background:`${GOLD}20`, padding:'4px 10px', borderRadius:99, flexShrink:0 }}>
                  +{e.coins}🪙
                </span>
              </div>
            ))}
            <div style={{ background:`${NAVY}08`, border:`1px solid ${NAVY}22`, borderRadius:12, padding:12, marginTop:4 }}>
              <p style={{ fontSize:12, color:NAVY, fontWeight:700, marginBottom:4 }}>🎁 Referral Bonus (Best Way to Earn)</p>
              <p style={{ fontSize:11, color:'#475569', lineHeight:1.6, margin:'0 0 10px' }}>
                Share your referral code. When a friend joins and upgrades to Pro, you get <strong>200 coins + ₹20 cashback</strong>.
              </p>
              <button onClick={() => navigate('/referral')}
                style={{ padding:'8px 18px', background:NAVY, color:'#fff', border:'none', borderRadius:9, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                Get My Referral Code →
              </button>
            </div>
          </div>
        )}

        {/* USE COINS TAB */}
        {tab === 'use' && (
          <div>
            <p style={{ fontSize:13, color:'#64748B', marginBottom:14 }}>
              Coins let you unlock features without upgrading your plan:
            </p>
            {COIN_USES.map(u => (
              <div key={u.use} style={{ background:'#fff', borderRadius:12, padding:'11px 14px', marginBottom:8, border:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{u.emoji}</span>
                <p style={{ flex:1, fontSize:12, fontWeight:600, color:'#1E293B', margin:0 }}>{u.use}</p>
                <span style={{ fontSize:13, fontWeight:800, color:'#DC2626', background:'#FEE2E2', padding:'4px 10px', borderRadius:99, flexShrink:0 }}>
                  {u.cost}🪙
                </span>
              </div>
            ))}
            {planTier !== 'free' && (
              <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12, padding:12, marginTop:4 }}>
                <p style={{ fontSize:12, color:GREEN, margin:0 }}>
                  ✅ You're on {planTier.toUpperCase()} — most features are already unlocked for you at no coin cost!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}