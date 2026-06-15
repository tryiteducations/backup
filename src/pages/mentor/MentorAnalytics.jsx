// FILE: src/pages/mentor/MentorAnalytics.jsx
import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

export default function MentorAnalytics() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    answersGiven: 0, acceptedAnswers: 0, coinsEarned: 0,
    avgResponseTime: '—', studentsHelped: 0, rating: 0,
  })

  useEffect(() => {
    // Pull from localStorage mock data (real data would come from Supabase)
    const data = JSON.parse(localStorage.getItem('tryit_mentor_stats') || 'null') || {
      answersGiven: 0, acceptedAnswers: 0, coinsEarned: 0,
      avgResponseTime: 'No data yet', studentsHelped: 0, rating: 0,
    }
    setStats(data)
  }, [])

  const CARDS = [
    { emoji:'💬', label:'Answers Given',     value: stats.answersGiven },
    { emoji:'⭐', label:'Accepted Answers',   value: stats.acceptedAnswers },
    { emoji:'🪙', label:'Coins Earned',       value: stats.coinsEarned },
    { emoji:'⏱️', label:'Avg Response Time',  value: stats.avgResponseTime },
    { emoji:'🎓', label:'Students Helped',    value: stats.studentsHelped },
    { emoji:'🌟', label:'Mentor Rating',      value: stats.rating ? `${stats.rating}/5` : '—' },
  ]

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:28, marginBottom:6 }}>
        📊 Mentor Analytics
      </h1>
      <p style={{ color:'var(--subtext-color, #64748B)', fontSize:14, marginBottom:20 }}>
        Track your impact on the Guru Hub community.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, marginBottom:24 }}>
        {CARDS.map(c=>(
          <div key={c.label} style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:18, padding:18, border:'1.5px solid var(--color-border, #E2E8F0)', textAlign:'center' }}>
            <p style={{ fontSize:28 }}>{c.emoji}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:20 }}>{c.value}</p>
            <p style={{ color:'var(--subtext-color, #64748B)', fontSize:12 }}>{c.label}</p>
          </div>
        ))}
      </div>

      {stats.answersGiven === 0 && (
        <div style={{ background:'rgba(212,175,55,0.08)', borderRadius:18, padding:20, border:'1px solid rgba(212,175,55,0.2)', textAlign:'center' }}>
          <p style={{ fontSize:36, marginBottom:8 }}>🎯</p>
          <p style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))', fontWeight:700, fontFamily:'Poppins,sans-serif', marginBottom:6 }}>No activity yet</p>
          <p style={{ color:'var(--subtext-color, #64748B)', fontSize:13, marginBottom:14 }}>
            Head to Guru Hub and answer your first student doubt to start building your analytics.
          </p>
          <a href="/guru-hub" style={{ background:'linear-gradient(135deg, var(--color-primary-dark, #1E3A5F), var(--color-primary, #0F2140))', color:'var(--color-accent, #D4AF37)', borderRadius:14, padding:'10px 24px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, textDecoration:'none' }}>
            Go to Guru Hub →
          </a>
        </div>
      )}
    </AppLayout>
  )
}
