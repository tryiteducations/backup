import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

function generateCouponCode(name) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const digits = Math.floor(1000 + Math.random() * 9000)
  return `GURU-${initials}-${digits}`
}

export default function CouponManager() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const STORE_KEY = `mentor_coupons_${user?.id}`

  const [coupons, setCoupons] = useState(() =>
    JSON.parse(localStorage.getItem(STORE_KEY) || '[]')
  )
  const [earnings] = useState({
    total: 3, totalRupees: 150, pending: 47, withdrawn: 103,
  })

  const generate = () => {
    const code = generateCouponCode(user?.name || 'Mentor')
    const expiry = new Date(); expiry.setMonth(expiry.getMonth() + 3)
    const c = { id: `cp-${Date.now()}`, code, used: 0, cashback: 0,
      createdAt: new Date().toISOString(), expiresAt: expiry.toISOString(), active: true }
    const updated = [c, ...coupons]
    setCoupons(updated)
    localStorage.setItem(STORE_KEY, JSON.stringify(updated))
    navigator.clipboard?.writeText(code)
    showToast('success', `🎉 Coupon ${code} generated & copied!`)
  }

  const share = (code) => {
    const msg = `Use my TryIT mentor code ${code} to get ₹50 off your first subscription! tryiteducations.net`
    if (navigator.share) navigator.share({ text: msg })
    else { navigator.clipboard?.writeText(msg); showToast('success', 'Share message copied!') }
  }

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:26, marginBottom:6 }}>
        🎟️ Coupon Manager
      </h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:24 }}>
        Generate referral coupons. Earn ₹50 per new user, ₹200 per institution.
      </p>

      {/* Earnings stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {[['💰',`₹${earnings.totalRupees}`,'Total Earned'],
          ['⏳',`₹${earnings.pending}`,'Pending'],
          ['✅',`₹${earnings.withdrawn}`,'Withdrawn']].map(([e,v,l])=>(
          <div key={l} style={{ background:'#fff', borderRadius:18, padding:'14px 12px',
            textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize:24 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:20 }}>{v}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ background:'linear-gradient(135deg,rgba(30,58,95,0.06),rgba(212,175,55,0.06))',
        borderRadius:18, padding:'14px 18px', marginBottom:20,
        border:'1.5px solid rgba(212,175,55,0.25)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:8 }}>
          💡 How Cashback Works
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {[['New user signs up via your coupon','₹50 cashback'],
            ['User upgrades to Pro via coupon','₹100 cashback'],
            ['Institution joins via coupon','₹200 cashback'],
            ['Minimum to withdraw','₹100'],
            ['Payment via UPI within 7 days','after 30-day quality check']].map(([label,val])=>(
            <div key={label} style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:'#475569', fontSize:13 }}>• {label}</span>
              <span style={{ color:'#D4AF37', fontWeight:700, fontSize:13 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button onClick={generate} style={{
        width:'100%', padding:16, borderRadius:16, border:'none',
        background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
        fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16,
        color:'#1E3A5F', cursor:'pointer', marginBottom:20,
        boxShadow:'0 4px 20px rgba(212,175,55,0.4)',
      }}>
        ✨ Generate New Coupon
      </button>

      {/* Coupon list */}
      {coupons.length === 0 ? (
        <div style={{ textAlign:'center', padding:32, color:'#94A3B8' }}>
          <p style={{ fontSize:36 }}>🎟️</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, marginTop:8 }}>
            No coupons yet. Generate your first one!
          </p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {coupons.map(c => (
            <div key={c.id} style={{ background:'#fff', borderRadius:18, padding:'16px 18px',
              boxShadow:'0 2px 10px rgba(0,0,0,0.05)',
              border: c.active ? '1.5px solid rgba(212,175,55,0.3)' : '1.5px solid #E2E8F0' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                    color:'#1E3A5F', fontSize:20, letterSpacing:1 }}>{c.code}</p>
                  <p style={{ color:'#94A3B8', fontSize:12, marginTop:3 }}>
                    Created: {c.createdAt.slice(0,10)} · Expires: {c.expiresAt.slice(0,10)}
                  </p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                    color:'#D4AF37', fontSize:18 }}>{c.used} uses</p>
                  <p style={{ color:'#22C55E', fontWeight:700, fontSize:14 }}>₹{c.cashback} earned</p>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, marginTop:12 }}>
                <button onClick={() => share(c.code)} style={{
                  flex:1, padding:'9px', borderRadius:10, border:'none',
                  background:'#1E3A5F', color:'#fff',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13, cursor:'pointer',
                }}>📤 Share</button>
                <button onClick={() => { navigator.clipboard?.writeText(c.code); showToast('success','Code copied!') }}
                  style={{ flex:1, padding:'9px', borderRadius:10,
                    border:'1.5px solid #D4AF37', background:'transparent',
                    color:'#D4AF37', fontFamily:'Poppins,sans-serif',
                    fontWeight:600, fontSize:13, cursor:'pointer' }}>
                  📋 Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
