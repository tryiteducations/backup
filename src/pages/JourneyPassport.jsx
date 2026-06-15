import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import StudentIDCard from '../components/profile/StudentIDCard'

const JOURNEY_MILESTONES = [
  { year: 2018, label:'Class 6', event:'Started learning journey',    badge:'🌱', completed:true  },
  { year: 2020, label:'Class 8', event:'NMMS Scholarship — ₹12,000/yr',badge:'🏅', completed:true  },
  { year: 2022, label:'Class 10',event:'NTSE Stage 1 Qualified',       badge:'⭐', completed:true  },
  { year: 2023, label:'Class 11',event:'INSPIRE Scholarship Applied',  badge:'💡', completed:true  },
  { year: 2024, label:'Class 12',event:'JEE Mains attempted',          badge:'📝', completed:true  },
  { year: 2025, label:'College', event:'Joined TryIT · SSC CGL focus', badge:'🎓', completed:true  },
  { year: 2026, label:'NOW',     event:'Level 4 · Rank #1,243 · 67%',  badge:'👊', completed:true, isNow:true },
  { year: 2026, label:'Aug 2026',event:'SSC CGL Exam Day',             badge:'🎯', completed:false },
  { year: 2027, label:'Future',  event:'Government Service begins?',   badge:'🏆', completed:false },
]

const STRENGTH_BARS = [
  { name:'Reasoning', value:90, color:'var(--color-success, #22C55E)' },
  { name:'Quant',     value:82, color:'var(--color-success, #22C55E)' },
  { name:'GK',        value:75, color:'var(--color-accent, #D4AF37)' },
  { name:'English',   value:68, color:'#F59E0B' },
  { name:'Science',   value:55, color:'var(--color-error, #EF4444)' },
]

const SCHOLARSHIPS = [
  { name:'INSPIRE SHE Scholarship', amount:'₹80,000/year', match:'87%', deadline:'Sep 2026' },
  { name:'PM Scholarship Scheme',   amount:'₹25,000/year', match:'92%', deadline:'Aug 2026' },
  { name:'State Merit Scholarship', amount:'₹15,000/year', match:'95%', deadline:'Jul 2026' },
]

export default function JourneyPassport() {
  const { user } = useAuth()
  const [tab, setTab] = useState('timeline')

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:26, marginBottom:4 }}>
        🪪 My Journey Passport
      </h1>
      <p style={{ color:'var(--color-text-light, #94A3B8)', fontSize:14, marginBottom:20 }}>
        Your complete learning journey — Class 6 to today and beyond
      </p>

      {/* ID Card */}
      <div style={{ marginBottom:24, display:'flex', justifyContent:'center' }}>
        <StudentIDCard user={user} />
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {[['timeline','📅 Timeline'],['strengths','💪 Strengths'],['scholarships','🎓 Scholarships']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            padding:'9px 18px', borderRadius:20, border:'none', cursor:'pointer',
            background: tab===k ? 'var(--color-primary, #1E3A5F)' : 'var(--color-surface, #FFFFFF)',
            color: tab===k ? 'var(--color-surface, #FFFFFF)' : 'var(--color-text-light, #64748B)',
            fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13,
            boxShadow:'0 1px 6px rgba(0,0,0,0.06)',
          }}>{l}</button>
        ))}
      </div>

      {/* Timeline */}
      {tab === 'timeline' && (
        <div style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:20, padding:'8px 20px 20px',
          boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ position:'relative', paddingLeft:28 }}>
            <div style={{ position:'absolute', left:11, top:0, bottom:0,
              width:2, background:'linear-gradient(to bottom, var(--color-primary, #1E3A5F), var(--color-accent, #D4AF37))' }} />
            {JOURNEY_MILESTONES.map((m,i) => (
              <div key={i} style={{ position:'relative', marginBottom:20, paddingTop:4 }}>
                <div style={{
                  position:'absolute', left:-28, width:22, height:22, borderRadius:'50%',
                  background: m.isNow ? 'var(--color-accent, #D4AF37)' : m.completed ? 'var(--color-primary, #1E3A5F)' : 'var(--color-border, #E2E8F0)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, border:`2px solid ${m.isNow ? 'var(--color-accent, #D4AF37)' : m.completed ? 'var(--color-primary, #1E3A5F)' : 'rgba(148,163,184,0.8)'}`,
                }}>
                  {m.completed ? '✓' : '○'}
                </div>
                <div style={{ marginLeft:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:18 }}>{m.badge}</span>
                    <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                      color: m.isNow ? 'var(--color-accent, #D4AF37)' : m.completed ? 'var(--color-primary, #1E3A5F)' : 'var(--color-text-light, #94A3B8)', fontSize:15 }}>
                      {m.label}
                    </span>
                    <span style={{ color:'var(--color-text-light, #94A3B8)', fontSize:12 }}>{m.year}</span>
                    {m.isNow && (
                      <span style={{ background:'var(--color-accent, #D4AF37)', color:'var(--color-surface, #FFFFFF)',
                        fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>
                        YOU ARE HERE
                      </span>
                    )}
                  </div>
                  <p style={{ color: m.completed ? 'var(--color-text, #1E293B)' : 'var(--color-border, #CBD5E1)', fontSize:13, marginTop:3 }}>
                    {m.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {tab === 'strengths' && (
        <div style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:20, padding:20,
          boxShadow:'0 2px 12px rgba(var(--color-text-rgb, 30,58,95),0.08)' }}>
          <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', marginBottom:16 }}>
            Subject Performance
          </h3>
          {STRENGTH_BARS.map(s => (
            <div key={s.name} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontWeight:600, color:'var(--color-primary, #1E3A5F)', fontSize:14 }}>{s.name}</span>
                <span style={{ fontWeight:800, color:s.color, fontSize:14 }}>{s.value}%</span>
              </div>
              <div style={{ width:'100%', height:10, background:'var(--color-bg, #F1F5F9)', borderRadius:5 }}>
                <div style={{ width:`${s.value}%`, height:10, borderRadius:5, background:s.color,
                  transition:'width 1s ease' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:20, background:'rgba(var(--color-warning-rgb, 245,158,11),0.12)', borderRadius:14, padding:'12px 16px' }}>
            <p style={{ color:'var(--color-warning, #F59E0B)', fontWeight:700, fontSize:13 }}>💡 AI Suggestion</p>
            <p style={{ color:'var(--color-warning, #F59E0B)', fontSize:13, marginTop:4 }}>
              Focus on English (68%) — 10% improvement here adds +142 rank positions based on your current profile.
            </p>
          </div>
        </div>
      )}

      {/* Scholarships */}
      {tab === 'scholarships' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {SCHOLARSHIPS.map(s => (
            <div key={s.name} style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:20, padding:18,
              boxShadow:'0 2px 12px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ fontSize:32 }}>🎓</div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)' }}>{s.name}</p>
                <p style={{ color:'var(--color-accent, #D4AF37)', fontWeight:800, fontSize:16 }}>{s.amount}</p>
                <p style={{ color:'var(--color-text-light, #94A3B8)', fontSize:12 }}>Deadline: {s.deadline}</p>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ background:'rgba(var(--color-success-rgb, 34,197,94),0.12)', color:'var(--color-success, #22C55E)',
                  borderRadius:20, padding:'5px 14px', fontWeight:800, fontSize:14 }}>
                  {s.match} match
                </div>
                <button style={{ marginTop:8, background:'none', border:'1px solid var(--color-accent, #D4AF37)',
                  borderRadius:10, padding:'5px 12px', color:'var(--color-accent, #D4AF37)', cursor:'pointer',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12 }}>
                  Apply →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
