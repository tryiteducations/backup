import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useToast } from '../../context/ToastContext'

const TOURNAMENTS = [
  { id:'t1', name:'All India SSC Grand Challenge', prize:'₹50,000', prizePool:true, date:'Jun 15, 2026 · 10 AM', registered:8423, seats:10000, category:'SSC', status:'open', emoji:'🏆', color:'#D4AF37' },
  { id:'t2', name:'UPSC Prelims Qualifier', prize:'₹25,000', prizePool:true, date:'Jun 18, 2026 · 2 PM', registered:3241, seats:5000, category:'UPSC', status:'open', emoji:'🎯', color:'#7C3AED' },
  { id:'t3', name:'Banking Speed Challenge', prize:'₹15,000', prizePool:false, date:'Jun 20, 2026 · 11 AM', registered:2187, seats:3000, category:'IBPS', status:'open', emoji:'🏦', color:'#0369A1' },
  { id:'t4', name:'Weekend Warrior — All Exams', prize:'₹5,000', prizePool:false, date:'Jun 14, 2026 · Live', registered:1247, seats:1000, category:'All', status:'live', emoji:'⚡', color:'#EF4444' },
]

export default function Tournaments() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>🏆 Tournaments</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Compete nationally. Win cash prizes. Prove your rank.</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))', gap:14 }}>
        {TOURNAMENTS.map(t=>(
          <div key={t.id} style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:`1.5px solid ${t.status==='live'?'#EF4444':'#E2E8F0'}`, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ background:`linear-gradient(135deg,${t.color},${t.color}CC)`, padding:'18px 18px 14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:28 }}>{t.emoji}</span>
                <span style={{ background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 10px', borderRadius:20, letterSpacing:'1px' }}>
                  {t.status==='live'?'🔴 LIVE NOW':t.category}
                </span>
              </div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:16, marginBottom:4 }}>{t.name}</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>{t.date}</p>
            </div>
            <div style={{ padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <div>
                  <p style={{ color:'#94A3B8', fontSize:11 }}>Prize</p>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#22C55E', fontSize:20 }}>{t.prize}</p>
                  {t.prizePool && <p style={{ color:'#94A3B8', fontSize:10 }}>prize pool</p>}
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ color:'#94A3B8', fontSize:11 }}>Registered</p>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16 }}>{t.registered.toLocaleString()} / {t.seats.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ height:4, background:'#F1F5F9', borderRadius:2, marginBottom:12 }}>
                <div style={{ width:`${(t.registered/t.seats)*100}%`, height:4, borderRadius:2, background: t.status==='live'?'#EF4444':t.color }}/>
              </div>
              <button onClick={()=>showToast('success',`Registered for ${t.name}! 🏆`)}
                style={{ width:'100%', padding:'11px', borderRadius:14, border:'none', background: t.status==='live'?'linear-gradient(135deg,#EF4444,#DC2626)':`linear-gradient(135deg,${t.color},${t.color}CC)`, color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor:'pointer' }}>
                {t.status==='live'?'⚡ Join Live Tournament':'Register Free →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
