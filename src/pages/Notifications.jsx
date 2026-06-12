import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'

const NOTIF_TYPES = {
  test_result:  { emoji:'📝', color:'#1E3A5F' },
  rank_change:  { emoji:'📈', color:'#22C55E' },
  streak:       { emoji:'🔥', color:'#F97316' },
  guru_reply:   { emoji:'🎓', color:'#7C3AED' },
  tournament:   { emoji:'🏆', color:'#D4AF37' },
  battle:       { emoji:'⚔️', color:'#EF4444' },
  coins:        { emoji:'🪙', color:'#D4AF37' },
  exam_alert:   { emoji:'📡', color:'#1E3A5F' },
  achievement:  { emoji:'🏅', color:'#D4AF37' },
  promo:        { emoji:'🎁', color:'#22C55E' },
}

function getStoredNotifs() {
  try { return JSON.parse(localStorage.getItem('tryit_unread_notifs') || '[]') } catch { return [] }
}

const DEMO_NOTIFS = [
  { id:'n1', type:'coins',       title:'+200 Welcome Coins!',          body:'Your welcome bonus has been added to your wallet 🎉',           time:'Just now',   read:false },
  { id:'n2', type:'exam_alert',  title:'SSC CGL 2026 Notification Out',body:'Applications open until Oct 31, 2026. Apply now!',              time:'1 hour ago', read:false },
  { id:'n3', type:'promo',       title:'TryIT Tip of the Day',         body:'Students who take 3 tests/week score 40% higher in 30 days.',   time:'Today 7AM',  read:true  },
  { id:'n4', type:'achievement', title:'First Login Badge Unlocked!',  body:"You've earned the 'Just Started 🌱' badge. Welcome to TryIT!", time:'Today',      read:true  },
]

export default function Notifications() {
  const stored = getStoredNotifs()
  const allNotifs = [...stored, ...DEMO_NOTIFS]
  const [notifs, setNotifs] = useState(allNotifs)
  const unread = notifs.filter(n=>!n.read).length

  const markAll = () => setNotifs(n=>n.map(x=>({...x,read:true})))
  const markOne = (id) => setNotifs(n=>n.map(x=>x.id===id?{...x,read:true}:x))

  return (
    <AppLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28 }}>🔔 Notifications</h1>
          {unread>0 && <p style={{ color:'#64748B', fontSize:13, marginTop:2 }}>{unread} unread</p>}
        </div>
        {unread>0 && <button onClick={markAll} style={{ background:'none', border:'1px solid #E2E8F0', borderRadius:10, padding:'7px 14px', color:'#64748B', cursor:'pointer', fontSize:13 }}>Mark all read</button>}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {notifs.length===0 ? (
          <div style={{ textAlign:'center', padding:60, color:'#94A3B8' }}>
            <p style={{ fontSize:40 }}>🔔</p>
            <p style={{ marginTop:12 }}>No notifications yet</p>
          </div>
        ) : notifs.map(n => {
          const t = NOTIF_TYPES[n.type] || NOTIF_TYPES.promo
          return (
            <div key={n.id} onClick={()=>markOne(n.id)}
              style={{ background:n.read?'#fff':'rgba(30,58,95,0.04)', borderRadius:18, padding:'14px 16px', border:`1.5px solid ${n.read?'#E2E8F0':'#1E3A5F33'}`, cursor:'pointer', display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${t.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{t.emoji}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:n.read?600:700, color:'#1E293B', fontSize:14 }}>{n.title}</p>
                <p style={{ color:'#64748B', fontSize:13, marginTop:3 }}>{n.body}</p>
                <p style={{ color:'#94A3B8', fontSize:11, marginTop:6 }}>{n.time}</p>
              </div>
              {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:'#1E3A5F', marginTop:4, flexShrink:0 }}/>}
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}
