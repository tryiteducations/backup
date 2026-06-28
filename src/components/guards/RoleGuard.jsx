// src/components/guards/RoleGuard.jsx
// NOTE: Role enforcement is relaxed during development.
// Real Supabase role checks will be added in the auth wiring session.
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const MOCK_ADMIN_ID = '4e6fcfaf-4ec5-4fc6-8047-351d8f3c82b0'

export default function RoleGuard({ allowedRoles = [], children }) {
  const { user, loading } = useAuth()
  const { theme } = useTheme()
  const nav = useNavigate()

  const p = theme?.primary||'#1E3A5F'
  const a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B'
  const m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC'
  const c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',
      justifyContent:'center',background:bg}}>
      <p style={{color:p,fontWeight:700,fontSize:16,fontFamily:'Poppins,sans-serif'}}>
        Loading...
      </p>
    </div>
  )

  if (!user) { nav('/login'); return null }

  // During development: admin UUID bypasses all role checks
  const isMockAdmin = user.id === MOCK_ADMIN_ID
  const isAdmin = user.is_admin || user.role === 'admin' || isMockAdmin

  // Effective role check
  const effectiveRole = user.role
    || (isAdmin ? 'admin'
      : user.is_institution ? 'institution'
      : user.is_mentor ? 'mentor'
      : 'student')

  const hasAccess = isAdmin
    || allowedRoles.includes(effectiveRole)
    || allowedRoles.includes('all')

  if (!hasAccess) {
    const neededRole = allowedRoles[0]
    const REQ = {
      mentor: {
        icon:'👨‍🏫', label:'Mentor',
        items:['100 tests completed','80%+ average score',
               '60 days on platform','Top 30% of students','Zero violations'],
        action:'Check My Progress', actionPath:'/student/settings',
      },
      institution: {
        icon:'🏫', label:'Institution',
        items:['Active Mentor role','Minimum 10 students',
               'Rating 4.5+ maintained','Admin approval'],
        action:'Apply as Mentor First', actionPath:'/mentor-hub',
      },
    }
    const info = REQ[neededRole] || REQ.mentor

    return (
      <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif',
        display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{background:c,border:'1px solid '+b,borderRadius:24,
          padding:40,maxWidth:420,width:'100%',textAlign:'center',
          boxShadow:'0 8px 40px rgba(0,0,0,0.12)'}}>
          <div style={{width:72,height:72,borderRadius:20,
            background:'linear-gradient(135deg,'+p+','+a+')',
            margin:'0 auto 20px',display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:32}}>
            🔒
          </div>
          <h2 style={{color:t,fontWeight:800,fontSize:20,margin:'0 0 8px'}}>
            {info.label} Access Required
          </h2>
          <p style={{color:m,fontSize:13,margin:'0 0 20px',lineHeight:1.6}}>
            Your current role is <strong style={{color:t}}>{effectiveRole}</strong>.
            Unlock <strong style={{color:p}}>{info.label}</strong> role to access this section.
          </p>
          <div style={{background:p+'08',border:'1px solid '+p+'20',
            borderRadius:14,padding:'14px 16px',marginBottom:20,textAlign:'left'}}>
            {info.items.map((req,i)=>(
              <div key={i} style={{display:'flex',gap:8,marginBottom:i<info.items.length-1?6:0}}>
                <span style={{color:'#EF4444',fontSize:12,flexShrink:0}}>🔒</span>
                <span style={{color:m,fontSize:12}}>{req}</span>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>nav('/student')}
              style={{flex:1,background:'transparent',border:'1px solid '+b,
                borderRadius:12,padding:'11px',color:m,fontWeight:700,
                fontSize:13,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
              ← Back
            </button>
            <button onClick={()=>nav(info.actionPath)}
              style={{flex:1,background:'linear-gradient(135deg,'+p+','+a+')',
                border:'none',borderRadius:12,padding:'11px',color:'#fff',
                fontWeight:700,fontSize:13,cursor:'pointer',
                fontFamily:'Poppins,sans-serif'}}>
              {info.action}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
