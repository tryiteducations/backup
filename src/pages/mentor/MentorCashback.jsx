import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useToast } from '../../context/ToastContext'

const EARNINGS = [
  { week:'Jun 9–15, 2026', answers:12, books:2, referrals:1, total:347, status:'paid',   paidAt:'Mon Jun 16', upi:'vikram@paytm' },
  { week:'Jun 2–8, 2026',  answers:8,  books:1, referrals:0, total:218, status:'paid',   paidAt:'Mon Jun 9',  upi:'vikram@paytm' },
  { week:'May 26–Jun 1',   answers:15, books:3, referrals:2, total:512, status:'paid',   paidAt:'Mon Jun 2',  upi:'vikram@paytm' },
  { week:'May 19–25',      answers:6,  books:0, referrals:1, total:165, status:'paid',   paidAt:'Mon May 26', upi:'vikram@paytm' },
]

const PENDING = { answers:7, books:1, referrals:0, total:201 }
const NEXT_PAYOUT = 'Monday, Jun 23, 2026'

export default function MentorCashback() {
  const { showToast } = useToast()
  const [upi, setUpi]  = useState('vikram@paytm')
  const [editUpi, setEditUpi] = useState(false)
  const totalEarned = EARNINGS.reduce((s,e)=>s+e.total,0) + PENDING.total

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:20 }}>💸 Cashback Center</h1>

      {/* Pending payout card */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:24, padding:24, marginBottom:16, border:'1.5px solid rgba(212,175,55,0.3)' }}>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, letterSpacing:'2px', marginBottom:4 }}>PENDING PAYOUT</p>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:44, marginBottom:8 }}>
          ₹{PENDING.total}
        </p>
        <div style={{ display:'flex', gap:16, marginBottom:14 }}>
          {[['📝',PENDING.answers,'Answers'],['📚',PENDING.books,'Books'],['🔗',PENDING.referrals,'Referrals']].map(([e,v,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <p style={{ fontSize:16 }}>{e}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:16 }}>{v}</p>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{l}</p>
            </div>
          ))}
        </div>
        <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:12, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>Paying to</p>
            {editUpi ? (
              <input value={upi} onChange={e=>setUpi(e.target.value)}
                onBlur={()=>{ setEditUpi(false); showToast('success','UPI updated!') }}
                autoFocus
                style={{ background:'rgba(255,255,255,0.1)', border:'1px solid #D4AF37', borderRadius:8, padding:'4px 10px', color:'#fff', fontSize:14, fontFamily:'monospace', outline:'none', width:180 }}
              />
            ) : (
              <p style={{ color:'#D4AF37', fontFamily:'monospace', fontSize:14 }} onClick={()=>setEditUpi(true)}>{upi} ✏️</p>
            )}
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>Next payout</p>
            <p style={{ color:'#D4AF37', fontSize:13, fontWeight:700 }}>{NEXT_PAYOUT}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12, marginBottom:20 }}>
        {[['💰',`₹${totalEarned.toLocaleString()}+`,'Total Earned'],['📝',EARNINGS.reduce((s,e)=>s+e.answers,0)+PENDING.answers,'Answers'],['📚',EARNINGS.reduce((s,e)=>s+e.books,0)+PENDING.books,'Books Sold'],['⭐','4.9','Rating']].map(([e,v,l])=>(
          <div key={l} style={{ background:'#fff', borderRadius:18, padding:'14px 12px', textAlign:'center', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize:22 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:20 }}>{v}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Payout history */}
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>📋 Payout History</p>
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
        {EARNINGS.map((e,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', borderBottom:i<EARNINGS.length-1?'1px solid #F8FAFC':'none', flexWrap:'wrap' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'#DCFCE7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>✅</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{e.week}</p>
              <p style={{ color:'#94A3B8', fontSize:12 }}>Paid {e.paidAt} → {e.upi}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#22C55E', fontSize:18 }}>₹{e.total}</p>
              <p style={{ color:'#94A3B8', fontSize:11 }}>{e.answers} answers · {e.books} books</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:'rgba(212,175,55,0.08)', borderRadius:18, padding:16, marginTop:14, border:'1px solid rgba(212,175,55,0.2)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:6 }}>💡 Payout Rules</p>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {['Every Monday · No minimum withdrawal','Accepted answer → ₹15–50','Best answer → ₹50','Book sale → 85% to you','Referral → ₹30–100 based on plan','1-month minimum for first cashback'].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:8 }}>
              <span style={{ color:'#D4AF37' }}>✓</span>
              <span style={{ color:'#64748B', fontSize:13 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
