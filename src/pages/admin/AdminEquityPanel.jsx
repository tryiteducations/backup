// src/pages/admin/AdminEquityPanel.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EQUITY_TIERS = [
  { id:'hope-scholars', name:'Hope Scholars', emoji:'🌱', type:'Free for Life', count: 0 },
  { id:'physically-challenged', name:'Physically Challenged', emoji:'♿', type:'Free for Life', count: 0 },
  { id:'swachhta-warriors', name:'Swachhta Warriors', emoji:'🧹', type:'Free for Life', count: 0 },
  { id:'martyrs-families', name:"Martyr's Families", emoji:'🎖️', type:'Free for Life', count: 0 },
  { id:'transgender-youth', name:'Transgender Youth', emoji:'🏳️‍⚧️', type:'Free for Life', count: 0 },
  { id:'active-military', name:'Active Military', emoji:'🪖', type:'15% Discount', count: 0 },
  { id:'asha-anganwadi', name:'ASHA / Anganwadi', emoji:'🏥', type:'20% Discount', count: 0 },
  { id:'first-generation', name:'First Generation', emoji:'🌟', type:'30% Discount', count: 0 },
]

export default function AdminEquityPanel() {
  const navigate = useNavigate()
  const [tiers] = useState(EQUITY_TIERS)
  const [pendingVerifications] = useState([
    { id:1, name:'Priya S.', tier:'Physically Challenged', doc:'UDID-2024-TN-001', date:'2026-06-10', status:'pending' },
    { id:2, name:'Rajan M.', tier:"Martyr's Families", doc:'PPO-2023-MH-442', date:'2026-06-11', status:'pending' },
    { id:3, name:'Anita K.', tier:'Swachhta Warriors', doc:'EMP-ID-CHN-2024', date:'2026-06-12', status:'pending' },
  ])

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg,#F8FAFC)' }}>
      <div style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', padding:'20px 32px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <button onClick={()=>navigate('/admin/dashboard')} style={{ background:'none', border:'none', color:'rgba(var(--color-surface-rgb, 255,255,255), 0.6)', cursor:'pointer', fontSize:13, marginBottom:4, display:'block' }}>← Back to Admin</button>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'var(--color-accent, #D4AF37)', fontSize:22, margin:0 }}>⚖️ Equity Panel</p>
        </div>
      </div>

      <div style={{ padding:'24px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14, marginBottom:28 }}>
          {tiers.map(t=>(
            <div key={t.id} style={{ background:'#fff', borderRadius:16, padding:16, border:'1.5px solid var(--color-border, #E2E8F0)' }}>
              <p style={{ fontSize:28, margin:'0 0 6px' }}>{t.emoji}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', fontSize:13, margin:'0 0 2px' }}>{t.name}</p>
              <p style={{ fontSize:11, color: t.type==='Free for Life'?'var(--color-success, #22C55E)':'var(--color-accent, #D4AF37)', fontWeight:700, margin:'0 0 6px' }}>{t.type}</p>
              <p style={{ fontSize:20, fontWeight:900, color:'var(--color-primary, #1E3A5F)', margin:0 }}>{t.count}</p>
              <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>verified users</p>
            </div>
          ))}
        </div>

        <div style={{ background:'#fff', borderRadius:18, border:'1.5px solid var(--color-border, #E2E8F0)', overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--color-border, #E2E8F0)' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:16, margin:0 }}>Pending Verifications</p>
          </div>
          {pendingVerifications.length === 0 ? (
            <div style={{ padding:40, textAlign:'center', color:'#94A3B8' }}>No pending verifications</div>
          ) : pendingVerifications.map(v=>(
            <div key={v.id} style={{ padding:'14px 20px', borderBottom:'1px solid var(--color-bg-muted-2, #F1F5F9)', display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:140 }}>
                <p style={{ fontWeight:700, color:'var(--color-primary, #1E3A5F)', fontSize:13, margin:'0 0 2px' }}>{v.name}</p>
                <p style={{ fontSize:12, color:'var(--color-muted, #64748B)', margin:0 }}>{v.tier} · {v.doc}</p>
              </div>
              <p style={{ fontSize:12, color:'#94A3B8', margin:0 }}>{v.date}</p>
              <div style={{ display:'flex', gap:8 }}>
                <button style={{ background:'#DCFCE7', color:'#15803D', border:'none', borderRadius:8, padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>✓ Approve</button>
                <button style={{ background:'#FEE2E2', color:'#991B1B', border:'none', borderRadius:8, padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>✗ Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
