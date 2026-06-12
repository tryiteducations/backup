import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { COIN_PACKS, purchaseCoins, DEDUCTION_RULES } from '../../lib/coinVault'

const TRANSACTIONS_MOCK = [
  { icon:'📝', label:'SSC CGL Mock 4 — 82% ✅', amount:+123, date:'Today 10:23',     type:'earn'   },
  { icon:'🔥', label:'7-day streak bonus',       amount:+30,  date:'Today 07:00',     type:'earn'   },
  { icon:'📝', label:'UPSC Mock — 55% ❌ Below 60%', amount:-83, date:'Yesterday',    type:'deduct' },
  { icon:'🎯', label:'Focus Mode — 45min',        amount:+40,  date:'Yesterday',       type:'earn'   },
  { icon:'📰', label:'Read Current Affairs',      amount:+5,   date:'2 days ago',      type:'earn'   },
  { icon:'🎮', label:'Math Blitz — 87 pts',       amount:+43,  date:'2 days ago',      type:'earn'   },
  { icon:'🪙', label:'Purchased 500 coins ₹19',  amount:+500, date:'3 days ago',      type:'purchase'},
]

export default function WalletPage() {
  const { user }              = useAuth()
  const { balance, earn }     = useCoins()
  const [buying,  setBuying]  = useState(false)
  const [filter,  setFilter]  = useState('all')
  const [selected,setSelected]= useState('standard')

  const handleBuy = async (packId) => {
    setBuying(true)
    const pack = COIN_PACKS.find(p=>p.id===packId)
    const result = await purchaseCoins({
      packId, userId: user?.id,
      name: user?.name, email: user?.email,
    })
    if (result.success) {
      // CoinContext auto-updates via coinVault
    }
    setBuying(false)
  }

  const txFiltered = filter==='all' ? TRANSACTIONS_MOCK
    : TRANSACTIONS_MOCK.filter(t=>t.type===filter)

  const isLow     = balance < 0
  const isBlocked = balance < DEDUCTION_RULES.blocked_at

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:20 }}>🪙 My Wallet</h1>

      {/* Balance card */}
      <div style={{ background:`linear-gradient(135deg,${isLow?'#7F1D1D,#991B1B':'#1E3A5F,#0F2140'})`,
        borderRadius:24, padding:24, marginBottom:isLow?12:20,
        border:`1.5px solid ${isLow?'rgba(239,68,68,0.4)':'rgba(212,175,55,0.3)'}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>Coin Balance</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color: isLow?'#FCA5A5':'#D4AF37', fontSize:56, lineHeight:1 }}>
              {balance.toLocaleString()}
            </p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:4 }}>
              ≈ ₹{Math.max(0, balance * 0.08).toFixed(0)} in exam value
            </p>
          </div>
          <div style={{ display:'flex', gap:14 }}>
            {[['📈',TRANSACTIONS_MOCK.filter(t=>t.type!=='deduct').reduce((s,t)=>s+t.amount,0),'Earned'],
              ['📉',Math.abs(TRANSACTIONS_MOCK.filter(t=>t.type==='deduct').reduce((s,t)=>s+t.amount,0)),'Deducted']].map(([e,v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <p style={{ fontSize:20 }}>{e}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:20 }}>{v}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low balance warning */}
      {isLow && (
        <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:18, padding:14, marginBottom:14 }}>
          <p style={{ color:'#991B1B', fontWeight:700, fontSize:14, marginBottom:4 }}>
            {isBlocked ? '🚫 Tests Blocked — Balance too low' : '⚠️ Low Balance Warning'}
          </p>
          <p style={{ color:'#DC2626', fontSize:13 }}>
            {isBlocked
              ? `Your balance is ${balance}. You need at least ${DEDUCTION_RULES.blocked_at} coins to take tests. Buy a pack or earn coins.`
              : `Your balance is ${balance}. Score above minimum marks to earn coins back, or buy a pack.`
            }
          </p>
        </div>
      )}

      {/* Coin Packs */}
      <div style={{ background:'#fff', borderRadius:22, padding:20, marginBottom:16, border:'1.5px solid #E2E8F0', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16, marginBottom:16 }}>
          🪙 Buy Coins
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,180px),1fr))', gap:10, marginBottom:16 }}>
          {COIN_PACKS.map(pack=>(
            <div key={pack.id} onClick={()=>setSelected(pack.id)}
              style={{ borderRadius:18, padding:16, textAlign:'center', cursor:'pointer',
                border:`2px solid ${selected===pack.id?'#D4AF37':'#E2E8F0'}`,
                background: selected===pack.id?'rgba(212,175,55,0.06)':'#F8FAFC',
                position:'relative', transition:'all 0.2s',
                transform: selected===pack.id?'translateY(-3px)':'none',
                boxShadow: selected===pack.id?'0 8px 20px rgba(212,175,55,0.2)':'none' }}>
              {pack.popular && (
                <span style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)',
                  background:'#D4AF37', color:'#1E3A5F', fontSize:9, fontWeight:800,
                  padding:'2px 10px', borderRadius:20, whiteSpace:'nowrap' }}>
                  MOST POPULAR
                </span>
              )}
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:28 }}>
                {pack.coins.toLocaleString()}
              </p>
              <p style={{ color:'#64748B', fontSize:12, marginBottom:8 }}>{pack.label}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                color:'#1E3A5F', fontSize:20 }}>₹{pack.price}</p>
            </div>
          ))}
        </div>
        <button onClick={()=>handleBuy(selected)} disabled={buying}
          style={{ width:'100%', padding:14, borderRadius:14, border:'none',
            background: buying?'rgba(212,175,55,0.3)':'linear-gradient(135deg,#D4AF37,#E8C44A)',
            fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
            color:'#1E3A5F', cursor:buying?'not-allowed':'pointer' }}>
          {buying ? '⏳ Opening payment...' : `🔒 Buy ${COIN_PACKS.find(p=>p.id===selected)?.coins} coins for ₹${COIN_PACKS.find(p=>p.id===selected)?.price}`}
        </button>
        <p style={{ textAlign:'center', color:'#94A3B8', fontSize:11, marginTop:8 }}>
          UPI · Cards · Net Banking · Secure Razorpay
        </p>
      </div>

      {/* Deduction rules info */}
      <div style={{ background:'#FEF3C7', borderRadius:18, padding:14, marginBottom:16, border:'1px solid #F59E0B' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#92400E', marginBottom:8 }}>⚡ How the Discipline System Works</p>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {[
            ['✅','Score above 70% → earn coins (score × 1.5)'],
            ['❌','Score below 70% → coins DEDUCTED (same formula)'],
            ['🚫',`Balance below ${DEDUCTION_RULES.blocked_at} → tests blocked until you earn/buy`],
            ['🪙','Buy coins starting from ₹5 to continue'],
          ].map(([e,t])=>(
            <div key={t} style={{ display:'flex', gap:8 }}>
              <span>{e}</span>
              <p style={{ color:'#92400E', fontSize:12 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F' }}>History</p>
          <div style={{ display:'flex', gap:6 }}>
            {['all','earn','deduct','purchase'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{ padding:'5px 12px', borderRadius:20, border:'none', cursor:'pointer',
                  background:filter===f?'#1E3A5F':'#F1F5F9',
                  color:filter===f?'#fff':'#64748B',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12 }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        {txFiltered.map((t,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 18px',
            borderBottom:i<txFiltered.length-1?'1px solid #F8FAFC':'none',
            background:t.type==='deduct'?'rgba(239,68,68,0.03)':'#fff' }}>
            <div style={{ width:40, height:40, borderRadius:12, flexShrink:0,
              background:t.type==='deduct'?'#FEE2E2':t.type==='purchase'?'#EDE9FE':'#DCFCE7',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
              {t.icon}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E293B', fontSize:13 }}>{t.label}</p>
              <p style={{ color:'#94A3B8', fontSize:11 }}>{t.date}</p>
            </div>
            <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
              color:t.amount>0?'#22C55E':'#EF4444' }}>
              {t.amount>0?'+':''}{t.amount}
            </span>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
