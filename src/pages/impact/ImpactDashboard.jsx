// src/pages/impact/ImpactDashboard.jsx
import { useEffect, useState } from 'react'

function useCountUp(target, duration=2000) {
  const [val, setVal] = useState(0)
  useEffect(()=>{
    let start=0
    const step = target/((duration/16))
    const t = setInterval(()=>{
      start+=step
      if(start>=target){ setVal(target); clearInterval(t) }
      else setVal(Math.floor(start))
    },16)
    return ()=>clearInterval(t)
  },[target,duration])
  return val
}

const STATS = [
  { label:'Students Helped', value:50000, suffix:'+ ', emoji:'👨‍🎓' },
  { label:'Equity Tier Students', value:3200, suffix:'+', emoji:'🌱' },
  { label:'Tests Completed', value:180000, suffix:'+', emoji:'📝' },
  { label:'Coins Earned', value:9500000, suffix:'+', emoji:'🪙' },
]

const STATES = ['Tamil Nadu','Maharashtra','UP','Bihar','Rajasthan','Karnataka','Gujarat','MP','WB','AP','Telangana','Kerala','Punjab','Haryana','Odisha','Assam','Jharkhand','Chhattisgarh','HP','Uttarakhand','Goa','Manipur','Meghalaya','Tripura','Nagaland','Arunachal Pradesh','Mizoram','Sikkim']

export default function ImpactDashboard() {
  const s0 = useCountUp(STATS[0].value)
  const s1 = useCountUp(STATS[1].value)
  const s2 = useCountUp(STATS[2].value)
  const s3 = useCountUp(STATS[3].value)
  const counts = [s0,s1,s2,s3]

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg,#F8FAFC)' }}>
      <div style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),#3B2A6B)', padding:'60px 32px', textAlign:'center' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'var(--color-accent, #D4AF37)', fontSize:32, margin:'0 0 8px' }}>🌍 Live Impact</p>
        <p style={{ color:'rgba(255,255,255,0.7)', fontSize:16, margin:0 }}>TryIT Educations - Real numbers, real students</p>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16, marginBottom:32 }}>
          {STATS.map((s,i)=>(
            <div key={s.label} style={{ background:'#fff', borderRadius:20, padding:24, textAlign:'center', border:'1.5px solid var(--color-border, #E2E8F0)', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize:32, margin:'0 0 8px' }}>{s.emoji}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'var(--color-primary, #1E3A5F)', fontSize:28, margin:'0 0 4px' }}>
                {counts[i].toLocaleString('en-IN')}{s.suffix}
              </p>
              <p style={{ color:'var(--color-muted, #64748B)', fontSize:13, margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid var(--color-border, #E2E8F0)', padding:24 }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:18, marginBottom:16 }}>📍 States Reached - {STATES.length}/28</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {STATES.map(s=>(
              <span key={s} style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', color:'var(--color-accent, #D4AF37)', borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:600 }}>✓ {s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
