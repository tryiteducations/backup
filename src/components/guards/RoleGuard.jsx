// src/components/guards/RoleGuard.jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useEffect } from 'react'

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
      <p style={{color:p,fontWeight:700,fontSize:16}}>Loading...</p>
    </div>
  )

  if (!user) {
    nav('/login')
    return null
  }

  // Determine effective role
  const effectiveRole = user.role
    || (user.is_admin ? 'admin'
      : user.is_institution ? 'institution'
      : user.is_mentor ? 'mentor'
      : 'student')

  const hasAccess = allowedRoles.includes(effectiveRole)
    || allowedRoles.includes('all')
    || effectiveRole === 'admin'

  if (!hasAccess) {
    const ROLE_LABELS = {
      mentor: { icon:'👨‍🏫', label:'Mentor', req:'You need a Mentor account', path:'/mentor-hub/register' },
      institution: { icon:'🏫', label:'Institution', req:'You need an Institution account', path:'/institution/register' },
    }

    const neededRole = allowedRoles[0]
    const info = ROLE_LABELS[neededRole] || { icon:'🔒', label:'Access', req:'You need special access', path:'/student' }

    return (
      <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif',
        display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{background:c,border:'1px solid '+b,borderRadius:24,
          padding:40,maxWidth:400,width:'100%',textAlign:'center',
          boxShadow:'0 8px 40px rgba(0,0,0,0.1)'}}>

          <div style={{width:80,height:80,borderRadius:24,
            background:'linear-gradient(135deg,'+p+','+a+')',
            margin:'0 auto 20px',display:'flex',
            alignItems:'center',justifyContent:'center',fontSize:36}}>
            🔒
          </div>

          <h2 style={{color:t,fontWeight:800,fontSize:20,margin:'0 0 8px'}}>
            {info.req}
          </h2>
          <p style={{color:m,fontSize:13,margin:'0 0 6px',lineHeight:1.6}}>
            This section is for <strong>{info.label}s</strong> only.
            Your current role is <strong>{effectiveRole}</strong>.
          </p>

          {neededRole === 'mentor' && (
            <div style={{background:p+'08',border:'1px solid '+p+'20',
              borderRadius:14,padding:'14px',margin:'16px 0',textAlign:'left'}}>
              <p style={{color:t,fontWeight:700,fontSize:12,margin:'0 0 8px'}}>
                🔒 Mentor Role Unlock Requirements:
              </p>
              {[
                '100 tests completed',
                '80%+ average score',
                '60 days on platform',
                'Top 30% of students',
                'Zero violations',
              ].map((req,i)=>(
                <div key={i} style={{display:'flex',gap:6,marginBottom:4}}>
                  <span style={{color:'#EF4444',fontSize:12}}>🔒</span>
                  <span style={{color:m,fontSize:11}}>{req}</span>
                </div>
              ))}
            </div>
          )}

          {neededRole === 'institution' && (
            <div style={{background:p+'08',border:'1px solid '+p+'20',
              borderRadius:14,padding:'14px',margin:'16px 0',textAlign:'left'}}>
              <p style={{color:t,fontWeight:700,fontSize:12,margin:'0 0 8px'}}>
                🔒 Institution Upgrade Requirements:
              </p>
              {[
                'Active Mentor role',
                'Minimum 10 students',
                'Rating 4.5+ maintained',
                'Admin approval',
              ].map((req,i)=>(
                <div key={i} style={{display:'flex',gap:6,marginBottom:4}}>
                  <span style={{color:'#EF4444',fontSize:12}}>🔒</span>
                  <span style={{color:m,fontSize:11}}>{req}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>nav('/student')}
              style={{flex:1,background:'transparent',border:'1px solid '+b,
                borderRadius:14,padding:'12px',color:m,
                fontWeight:700,fontSize:13,cursor:'pointer'}}>
              ← Student Dashboard
            </button>
            <button onClick={()=>nav('/student/settings')}
              style={{flex:1,background:'linear-gradient(135deg,'+p+','+a+')',
                border:'none',borderRadius:14,padding:'12px',
                color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              Check My Progress
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
