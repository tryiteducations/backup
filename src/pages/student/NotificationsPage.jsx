// src/pages/student/NotificationsPage.jsx
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SAMPLE = [
  { id:1, icon:'🎉', title:'You earned 50 coins!', body:'Daily Quiz bonus added to your wallet.', time:'2 min ago', read:false },
  { id:2, icon:'📰', title:'New Current Affairs available', body:'10 articles added for June 14, 2026.', time:'1 hr ago', read:false },
  { id:3, icon:'🏆', title:'Rank update', body:'You moved up to rank #1,243 in SSC CGL.', time:'3 hr ago', read:true },
  { id:4, icon:'📝', title:'New scholarship match', body:'PM Scholarship 2026 matches your profile.', time:'Yesterday', read:true },
  { id:5, icon:'🧑‍🏫', title:'Your doubt got an answer', body:'Ravi M. answered your Quant doubt.', time:'Yesterday', read:true },
  { id:6, icon:'🔥', title:'Streak reminder', body:"Don't break your 5-day streak! Complete a test today.", time:'2 days ago', read:true },
]

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifs, setNotifs] = useState(SAMPLE)

  if (!user) return null

  const unread = notifs.filter(n=>!n.read).length
  const markAll = () => setNotifs(n=>n.map(x=>({...x,read:true})))
  const markOne = (id) => setNotifs(n=>n.map(x=>x.id===id?{...x,read:true}:x))

  return (
    <AppLayout title="Notifications">
      <div style={{ maxWidth:600, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:22, margin:'0 0 2px' }}>🔔 Notifications</h1>
            {unread > 0 && <p style={{ color:'var(--color-accent, #D4AF37)', fontSize:13, margin:0 }}>{unread} unread</p>}
          </div>
          {unread > 0 && (
            <button onClick={markAll} style={{ background:'var(--color-bg-muted-2, #F1F5F9)', border:'none', borderRadius:10, padding:'8px 14px', fontSize:12, fontWeight:600, color:'#475569', cursor:'pointer' }}>Mark all read</button>
          )}
        </div>

        {notifs.length === 0 ? (
          <div style={{ textAlign:'center', padding:60, background:'#fff', borderRadius:18, border:'1.5px solid var(--color-border, #E2E8F0)' }}>
            <p style={{ fontSize:40, marginBottom:8 }}>🎉</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)' }}>You're all caught up!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {notifs.map(n=>(
              <div key={n.id} onClick={()=>markOne(n.id)}
                style={{ background: n.read?'#fff':'#FFFBEB', borderRadius:14, border:`1.5px solid ${n.read?'var(--color-border, #E2E8F0)':'#FDE68A'}`, padding:'14px 16px', display:'flex', gap:12, cursor:'pointer', alignItems:'flex-start' }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{n.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight: n.read?600:800, color:'var(--color-primary, #1E3A5F)', fontSize:14, margin:'0 0 2px' }}>{n.title}</p>
                  <p style={{ color:'var(--color-muted, #64748B)', fontSize:13, margin:'0 0 4px' }}>{n.body}</p>
                  <p style={{ color:'#94A3B8', fontSize:11, margin:0 }}>{n.time}</p>
                </div>
                {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--color-accent, #D4AF37)', flexShrink:0, marginTop:4 }}/>}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
