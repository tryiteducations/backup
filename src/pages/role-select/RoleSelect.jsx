// FILE: src/pages/role-select/RoleSelect.jsx
// TryIT - Role Selection (post-login, before onboarding)
// Route: /role-select
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAVY='#1E3A5F', GOLD='#C9A84C', BG='#F8FAFC'

const ROLES=[
  { id:'student',  emoji:'🎓', title:'Student',          desc:'Preparing for a competitive exam',                color:'#1D4ED8' },
  { id:'mentor',    emoji:'🧑‍🏫', title:'Mentor',           desc:'Help fix questions, earn cashback',               color:'#7C3AED' },
  { id:'centre',    emoji:'🏫', title:'Institution',      desc:'Coaching centre or school conducting tests',       color:'#059669' },
  { id:'parent',    emoji:'👨‍👩‍👦', title:'Parent',           desc:'Track your child\'s exam preparation',           color:'#D97706' },
]

export default function RoleSelect(){
  const navigate = useNavigate()
  const { updateUser, user } = useAuth()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!selected) return
    setLoading(true)
    await updateUser?.({ role: selected })
    setLoading(false)

    // User is ALREADY authenticated (came from phone OTP Login.jsx).
    // We only set their role and route them onward - never re-login.
    const routes = {
      student: '/onboarding',
      mentor:  '/mentor',
      centre:  '/centre/onboarding',  // institution details form, NOT a login screen
      parent:  '/parent/onboarding',  // child-linking form, NOT a login screen
    }
    navigate(routes[selected] || '/onboarding')
  }

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', display:'flex',
      flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>

      <div style={{ textAlign:'center', marginBottom:32 }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:24, color:NAVY, margin:'0 0 4px' }}>
          {user?.name ? `Hi ${user.name.split(' ')[0]}!` : 'Welcome!'}
        </p>
        <p style={{ fontSize:14, color:'var(--color-text-light,#64748B)' }}>How will you use TryIT Educations?</p>
      </div>

      <div style={{ width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
        {ROLES.map(r => (
          <button key={r.id} onClick={() => setSelected(r.id)}
            style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px',
              borderRadius:16, cursor:'pointer', textAlign:'left',
              border: selected===r.id ? `2.5px solid ${r.color}` : '2px solid #E2E8F0',
              background: selected===r.id ? `${r.color}08` : '#fff' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`${r.color}15`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>
              {r.emoji}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:15, fontWeight:700, color:'var(--color-text,#1E293B)', margin:'0 0 2px' }}>{r.title}</p>
              <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)', margin:0 }}>{r.desc}</p>
            </div>
            {selected === r.id && <span style={{ color:r.color, fontSize:20 }}>✓</span>}
          </button>
        ))}
      </div>

      <button onClick={handleContinue} disabled={!selected || loading}
        style={{ width:'100%', maxWidth:380, padding:'15px', background: selected?NAVY:'#CBD5E1',
          color:'#fff', border:'none', borderRadius:14, fontWeight:800, fontSize:15,
          cursor: selected?'pointer':'not-allowed' }}>
        {loading ? 'Setting up...' : 'Continue →'}
      </button>

      <p style={{ fontSize:11, color:'#94A3B8', marginTop:16, textAlign:'center' }}>
        You can request additional roles later from Settings
      </p>
    </div>
  )
}