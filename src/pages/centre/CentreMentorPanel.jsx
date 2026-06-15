// src/pages/centre/CentreMentorPanel.jsx
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SAMPLE_MENTORS = [
  { id:1, name:'Dr. Anand R.', subject:'Mathematics', students:12, rating:4.8, sessions:34 },
  { id:2, name:'Kavitha S.', subject:'English', students:8, rating:4.6, sessions:21 },
  { id:3, name:'Ravi M.', subject:'Reasoning', students:15, rating:4.9, sessions:47 },
]

export default function CentreMentorPanel() {
  const { user } = useAuth()
  const [mentors] = useState(SAMPLE_MENTORS)

  if (!user) return null

  return (
    <AppLayout title="Mentor Panel">
      <div className="mb-6">
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:22 }}>🧑‍🏫 Mentor Panel</h1>
        <p style={{ color:'var(--subtext-color, #64748B)', fontSize:14 }}>Manage mentors assigned to your centre</p>
      </div>

      {mentors.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, background:'var(--color-surface, #FFFFFF)', borderRadius:18, border:'1.5px dashed var(--color-border, #E2E8F0)' }}>
          <p style={{ fontSize:40, marginBottom:8 }}>🧑‍🏫</p>
          <p style={{ color:'var(--subtext-color, #64748B)' }}>No mentors assigned yet</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {mentors.map(m=>(
            <div key={m.id} style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:18, border:'1.5px solid var(--color-border, #E2E8F0)', padding:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))', color:'var(--color-accent, #D4AF37)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14 }}>
                  {m.name.slice(0,2)}
                </div>
                <div>
                  <p style={{ fontWeight:700, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:14, margin:'0 0 2px' }}>{m.name}</p>
                  <p style={{ color:'var(--subtext-color, #64748B)', fontSize:12, margin:0 }}>{m.subject}</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, textAlign:'center' }}>
                {[['Students',m.students,'👥'],['Sessions',m.sessions,'📚'],['Rating',m.rating,'⭐']].map(([label,val,emoji])=>(
                  <div key={label} style={{ background:'var(--color-bg, #F8FAFC)', borderRadius:10, padding:8 }}>
                    <p style={{ fontSize:16, margin:'0 0 2px' }}>{emoji}</p>
                    <p style={{ fontWeight:800, color:'var(--heading-color, var(--color-text, #1E3A5F))', fontSize:14, margin:0 }}>{val}</p>
                    <p style={{ color:'var(--subtext-color, #64748B)', fontSize:10, margin:0 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
