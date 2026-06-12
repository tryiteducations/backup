import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Analytics() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const hasTests  = user?.testsCompleted > 0

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>📊 Analytics</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Your performance, trends, and rank history</p>

      {!hasTests ? (
        <div style={{ textAlign:'center', padding:60, background:'#fff', borderRadius:24, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontSize:48, marginBottom:16 }}>📊</p>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', marginBottom:8 }}>No data yet</h2>
          <p style={{ color:'#64748B', fontSize:14, maxWidth:340, margin:'0 auto 24px' }}>
            Take your first test to unlock analytics — score history, rank trends, weak topics, and subject performance.
          </p>
          <button onClick={()=>navigate('/test-engine')} style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'none', borderRadius:14, padding:'13px 28px', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, cursor:'pointer' }}>
            📝 Take First Test →
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gap:14 }}>
          {[
            { label:'Tests Taken',   value:user.testsCompleted, emoji:'📝' },
            { label:'Average Score', value:`${user.avgScore||0}%`, emoji:'📈' },
            { label:'Current Rank',  value:user.rank?`#${user.rank.toLocaleString()}`:'—', emoji:'🏆' },
            { label:'Coins Earned',  value:(user.coins||200).toLocaleString(), emoji:'🪙' },
          ].map(s=>(
            <div key={s.label} style={{ background:'#fff', borderRadius:18, padding:'16px 20px', border:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:28 }}>{s.emoji}</span>
              <div>
                <p style={{ color:'#94A3B8', fontSize:12 }}>{s.label}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:22 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
