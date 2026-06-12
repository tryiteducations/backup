import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ENROLLED_EXAMS = [
  { id:'ssc-cgl',  name:'SSC CGL 2026 Tier 1', date:'2026-12-10', emoji:'📋' },
  { id:'rrb-ntpc', name:'RRB NTPC Phase 2',    date:'2026-07-15', emoji:'🚂' },
]

function getDaysLeft(dateStr) {
  const diff = new Date(dateStr) - new Date()
  return Math.max(0, Math.ceil(diff / 86400000))
}

function getUrgency(days) {
  if (days === 0)  return { color:'#EF4444', bg:'#FEF2F2', border:'#FECACA', label:'TODAY!', pulse:true }
  if (days <= 1)   return { color:'#EF4444', bg:'#FEF2F2', border:'#FECACA', label:'TOMORROW', pulse:true }
  if (days <= 7)   return { color:'#F97316', bg:'#FFF7ED', border:'#FED7AA', label:`${days} DAYS`, pulse:true }
  if (days <= 30)  return { color:'#D4AF37', bg:'#FEF3C7', border:'#FDE68A', label:`${days} days`, pulse:false }
  return                   { color:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0', label:`${days} days`, pulse:false }
}

export default function ExamNotificationBanner() {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(new Set())
  const [pushEnabled, setPush]     = useState(false)

  const urgent = ENROLLED_EXAMS
    .map(e => ({ ...e, daysLeft: getDaysLeft(e.date) }))
    .filter(e => e.daysLeft <= 30 && !dismissed.has(e.id))
    .sort((a,b) => a.daysLeft - b.daysLeft)

  // Request browser notification permission
  const enablePush = async () => {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setPush(true)
      // Schedule daily reminders via service worker (simplified)
      new Notification('TryIT Exam Reminder', {
        body: urgent[0] ? `${urgent[0].name} is in ${urgent[0].daysLeft} days!` : 'Keep preparing!',
        icon: '/tryit-logo.webp',
        badge: '/tryit-logo.webp',
      })
    }
  }

  if (!urgent.length) return null

  return (
    <div style={{ marginBottom:16 }}>
      {urgent.slice(0,2).map(exam => {
        const u = getUrgency(exam.daysLeft)
        return (
          <div key={exam.id} style={{ background:u.bg, border:`1.5px solid ${u.border}`, borderRadius:18, padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
            {/* Pulsing dot for urgent */}
            <div style={{ position:'relative', flexShrink:0 }}>
              <span style={{ fontSize:24 }}>{exam.emoji}</span>
              {u.pulse && (
                <span style={{ position:'absolute', top:-2, right:-2, width:10, height:10, borderRadius:'50%', background:u.color, display:'block', animation:'examPulse 1.2s ease-in-out infinite' }}/>
              )}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E293B', fontSize:14 }}>
                {exam.name}
              </p>
              <p style={{ fontSize:12, color:'#64748B', marginTop:2 }}>
                {exam.daysLeft === 0 ? '🚨 Exam is TODAY!' : exam.daysLeft === 1 ? '⚠️ Exam is TOMORROW!' : `📅 ${new Date(exam.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}`}
              </p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              <span style={{ background:u.color, color:'#fff', fontSize:11, fontWeight:800, padding:'4px 12px', borderRadius:20, letterSpacing:'0.5px', animation:u.pulse?'examPulse 1.2s ease-in-out infinite':'' }}>
                {u.label}
              </span>
              <button onClick={()=>navigate('/test-engine')}
                style={{ background:u.color, border:'none', borderRadius:12, padding:'7px 14px', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
                Practice Now →
              </button>
              <button onClick={()=>setDismissed(d=>new Set([...d,exam.id]))}
                style={{ background:'none', border:'none', color:'rgba(0,0,0,0.3)', cursor:'pointer', fontSize:18, padding:'0 4px' }}>×</button>
            </div>
          </div>
        )
      })}

      {/* Enable push notifications prompt */}
      {!pushEnabled && 'Notification' in window && Notification.permission === 'default' && (
        <div style={{ background:'rgba(30,58,95,0.06)', border:'1px solid rgba(30,58,95,0.15)', borderRadius:14, padding:'10px 16px', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span style={{ fontSize:18 }}>🔔</span>
          <p style={{ color:'#1E3A5F', fontSize:12, flex:1 }}>
            Get daily exam reminders so you never miss a deadline
          </p>
          <button onClick={enablePush}
            style={{ background:'#1E3A5F', border:'none', borderRadius:10, padding:'6px 14px', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:12, cursor:'pointer', flexShrink:0 }}>
            Enable Alerts
          </button>
        </div>
      )}

      <style>{`
        @keyframes examPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.6; transform:scale(1.15); }
        }
      `}</style>
    </div>
  )
}
