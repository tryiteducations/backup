// src/pages/student/StudentNotifications.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function StudentNotifications() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { user: authUser } = useAuth()
  const isDark = theme?.isDark ?? false
  const accent = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primD = theme?.primaryDark ?? '#0F2140'
  const txt = isDark ? '#F8FAFC' : '#0F1020'
  const muted = isDark ? 'rgba(255,255,255,0.55)' : '#64748B'
  const card = isDark ? 'rgba(255,255,255,0.06)' : '#fff'
  const bdr = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
  const bg = theme?.background ?? (isDark ? '#0D1117' : '#F0F4F8')

  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authUser) return
    const uid = authUser.id || authUser.userId
    supabase.from('notification_queue')
      .select('*')
      .or(`user_id.eq.${uid},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setNotifs(data || [])
        setLoading(false)
        // Mark all as sent
        supabase.from('notification_queue')
          .update({ sent: true })
          .eq('user_id', uid)
          .then(() => {})
      })
  }, [authUser])

  const MOCK_NOTIFS = [
    { id:1, title:'🔥 Streak Alert!', message:'Your 7-day streak is at risk. Study something today!', type:'streak', created_at: new Date(Date.now()-2*60*60*1000).toISOString() },
    { id:2, title:'🏆 Rank Update', message:'Your All-India rank improved to #1,247 after yesterday\'s test.', type:'rank', created_at: new Date(Date.now()-5*60*60*1000).toISOString() },
    { id:3, title:'📝 Weekly Test Live', message:'TNPSC Group 2 weekly test is now live. 1,240 students competing.', type:'test', created_at: new Date(Date.now()-24*60*60*1000).toISOString() },
    { id:4, title:'🪙 Coins Earned', message:'You earned 20 coins for completing today\'s test.', type:'coins', created_at: new Date(Date.now()-2*24*60*60*1000).toISOString() },
    { id:5, title:'🚀 Launchpad Topic', message:"Today's topic: Article 300A - Right to Property. Don't miss it!", type:'launchpad', created_at: new Date(Date.now()-3*24*60*60*1000).toISOString() },
  ]

  const displayNotifs = notifs.length > 0 ? notifs : MOCK_NOTIFS
  const TYPE_COLORS = { streak:'#F59E0B', rank:accent, test:'#60A5FA', coins:accent, launchpad:'#4ADE80', default:muted }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const h = Math.floor(diff/3600000)
    const d = Math.floor(h/24)
    if (d > 0) return `${d}d ago`
    if (h > 0) return `${h}h ago`
    return 'Just now'
  }

  return (
    <div style={{ minHeight:'100vh', background:bg, fontFamily:'Inter,sans-serif' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px',
        background:isDark?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.9)',
        backdropFilter:'blur(20px)', borderBottom:`1px solid ${bdr}`,
        position:'sticky', top:0, zIndex:100, boxShadow:`0 4px 24px ${accent}18` }}>
        <button onClick={() => navigate('/student')} style={{
          background:card, border:`1px solid ${bdr}`, borderRadius:10,
          width:38, height:38, cursor:'pointer', color:txt, fontSize:18,
          display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
        <div>
          <p style={{ color:txt, fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, margin:0 }}>
            🔔 Notifications
          </p>
          <p style={{ color:muted, fontSize:11, margin:0 }}>{displayNotifs.length} updates</p>
        </div>
      </div>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'20px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {displayNotifs.map((n,i) => {
            const color = TYPE_COLORS[n.type] || TYPE_COLORS.default
            return (
              <div key={n.id||i} style={{ background:card, border:`1px solid ${bdr}`,
                borderRadius:16, padding:'14px 16px',
                display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:42, height:42, borderRadius:12,
                  background:`${color}18`, display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {n.title?.split(' ')[0] || '🔔'}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:txt, fontWeight:700, fontSize:13, margin:'0 0 4px' }}>
                    {n.title?.replace(/^[^\s]+\s/,'') || n.title}
                  </p>
                  <p style={{ color:muted, fontSize:12, margin:'0 0 6px', lineHeight:1.5 }}>
                    {n.message}
                  </p>
                  <p style={{ color:muted, fontSize:9, margin:0 }}>
                    {timeAgo(n.created_at)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
