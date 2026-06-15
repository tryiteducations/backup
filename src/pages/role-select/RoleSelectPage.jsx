// src/pages/role-select/RoleSelectPage.jsx
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const ROLES = [
  { id:'student', emoji:'🎓', label:'Student', desc:'Access exams, tests, games, leaderboards and your personal study plan', home:'/dashboard' },
  { id:'mentor', emoji:'🧑‍🏫', label:'Mentor', desc:'Answer student doubts, earn cashback, manage coupons and track your impact', home:'/mentor-hub' },
  { id:'institution', emoji:'🏫', label:'Institution', desc:'Manage your coaching centre, conduct tests and track student performance', home:'/centre/dashboard' },
  { id:'family', emoji:'👨‍👩‍👧', label:'Family', desc:'Monitor your child\'s progress, connect accounts and stay informed', home:'/family' },
]

export default function RoleSelectPage() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleSelect = (role, home) => {
    updateUser({ role })
    navigate(home)
  }

  return (
    <AppLayout title="Switch Role">
      <div className="mb-8" style={{ textAlign:'center' }}>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'var(--color-primary, #1E3A5F)', fontSize:26, marginBottom:4 }}>Switch Your Role</h1>
        <p style={{ color:'var(--color-muted, #64748B)', fontSize:15 }}>Currently: <strong style={{ color:'var(--color-accent, #D4AF37)' }}>{user.role}</strong> — pick a different context to switch how you use TryIT</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16, maxWidth:800, margin:'0 auto' }}>
        {ROLES.map(r=>(
          <button key={r.id} onClick={()=>handleSelect(r.id, r.home)}
            style={{ background: user.role===r.id ? 'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))' : '#fff',
              border: user.role===r.id ? 'none' : '1.5px solid var(--color-border, #E2E8F0)',
              borderRadius:20, padding:24, cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}>
            <p style={{ fontSize:36, margin:'0 0 10px' }}>{r.emoji}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color: user.role===r.id?'var(--color-accent, #D4AF37)':'var(--color-primary, #1E3A5F)', fontSize:16, margin:'0 0 6px' }}>
              {r.label} {user.role===r.id && '✓'}
            </p>
            <p style={{ color: user.role===r.id?'rgba(255,255,255,0.7)':'var(--color-muted, #64748B)', fontSize:13, lineHeight:1.5, margin:0 }}>{r.desc}</p>
          </button>
        ))}
      </div>
    </AppLayout>
  )
}
