// src/pages/parent/ParentProgressPage.jsx
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SAMPLE_CHILDREN = [
  { id:1, name:'Arun Kumar', exam:'SSC CGL', readiness:72, streak:5, avgScore:74, tests:8, subjects:[{name:'Quant',accuracy:68},{name:'Reasoning',accuracy:81},{name:'English',accuracy:70}] },
  { id:2, name:'Divya Kumar', exam:'NEET UG', readiness:85, streak:12, avgScore:88, tests:15, subjects:[{name:'Biology',accuracy:91},{name:'Chemistry',accuracy:82},{name:'Physics',accuracy:76}] },
]

export default function ParentProgressPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <AppLayout title="Children's Progress">
      <div className="mb-6">
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:22, marginBottom:4 }}>👨‍👩‍👧 Children's Progress</h1>
        <p style={{ color:'var(--subtext-color, #64748B)', fontSize:14 }}>Track your children's exam preparation</p>
      </div>

      {SAMPLE_CHILDREN.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, background:'var(--color-surface, #FFFFFF)', borderRadius:18, border:'1.5px dashed var(--color-border, #E2E8F0)' }}>
          <p style={{ fontSize:40, marginBottom:8 }}>👶</p>
          <p style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))', fontWeight:700, marginBottom:4 }}>No children connected yet</p>
          <p style={{ color:'var(--subtext-color, #64748B)', fontSize:13 }}>Ask your child to share their TryIT email, then connect via Family Hub</p>
          <button onClick={()=>navigate('/family')} style={{ marginTop:16, background:'linear-gradient(135deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))', color:'var(--color-accent, #D4AF37)', border:'none', borderRadius:12, padding:'10px 24px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer' }}>Go to Family Hub →</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {SAMPLE_CHILDREN.map(child=>(
            <div key={child.id} style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:20, border:'1.5px solid var(--color-border, #E2E8F0)', overflow:'hidden' }}>
              <div style={{ background:'linear-gradient(135deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))', padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-surface, #FFFFFF)', fontSize:16, margin:'0 0 2px' }}>{child.name}</p>
                  <p style={{ color:'var(--color-accent, #D4AF37)', fontSize:13, margin:0 }}>Preparing for {child.exam}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ color:'var(--color-accent, #D4AF37)', fontWeight:900, fontSize:22, margin:'0 0 2px' }}>{child.readiness}%</p>
                  <p style={{ color:'rgba(var(--color-surface-rgb, 255,255,255), 0.6)', fontSize:11, margin:0 }}>Readiness</p>
                </div>
              </div>
              <div style={{ padding:20 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                  {[['🔥 Streak',`${child.streak} days`],['📝 Tests',child.tests],['📈 Avg Score',`${child.avgScore}%`]].map(([label,val])=>(
                    <div key={label} style={{ background:'var(--color-bg, #F8FAFC)', borderRadius:12, padding:12, textAlign:'center' }}>
                      <p style={{ fontWeight:800, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:16, margin:'0 0 2px' }}>{val}</p>
                      <p style={{ color:'var(--subtext-color, #64748B)', fontSize:11, margin:0 }}>{label}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontWeight:700, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:13, marginBottom:8 }}>Subject Accuracy</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {child.subjects.map(s=>(
                    <div key={s.name} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:12, color:'var(--subtext-color, #64748B)', width:80 }}>{s.name}</span>
                      <div style={{ flex:1, height:8, background:'var(--color-bg, #F8FAFC)', borderRadius:4, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${s.accuracy}%`, background: s.accuracy>=75?'var(--color-success, #16A34A)':s.accuracy>=50?'var(--color-accent, #D4AF37)':'var(--color-error, #EF4444)', borderRadius:4 }}/>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:'var(--heading-color, var(--color-text, #1E3A5F))', width:36, textAlign:'right' }}>{s.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
