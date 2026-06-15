// src/pages/legal/AboutPage.jsx
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'

export default function AboutPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC' }}>
      <div style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', padding:'20px 32px', display:'flex', alignItems:'center', gap:20 }}>
        <Logo dark height={36}/>
        <button onClick={()=>navigate('/landing')} style={{ marginLeft:'auto', background:'none', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:10, padding:'8px 16px', fontSize:13, cursor:'pointer' }}>← Back to Home</button>
      </div>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'40px 24px' }}>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'var(--color-primary, #1E3A5F)', fontSize:32, marginBottom:8 }}>About TryIT Educations</h1>
        <p style={{ color:'var(--color-accent, #D4AF37)', fontStyle:'italic', fontSize:16, marginBottom:32 }}>Your Exam. Your Rank. Your Success.</p>

        {[
          { title:'Our Mission', content:"TryIT Educations was built on a single belief: that quality exam preparation should be accessible to every student in India, regardless of their economic background. From a child preparing for their first Olympiad in LKG to a PhD candidate, we provide a unified, intelligent platform that covers 9,600+ exams across every category — completely free at its core." },
          { title:'What We Do', content:"We provide comprehensive exam preparation across government jobs, banking, railways, defence, medical, engineering, teaching, school competitions, scholarships, and professional certifications. Our platform supports 40+ Indian languages and serves students from LKG through PhD level, covering both Indian and international exams." },
          { title:'Our Philosophy', content:"We believe in 100% Lifetime Free core access. No tricks, no hidden paywalls on essential features. Our gamification system — coins, streaks, levels, leaderboards — is designed to keep students engaged and motivated, not to extract money from them. Premium features enhance the experience; they never gate the learning." },
          { title:'Equity Commitment', content:"TryIT operates eight equity tiers providing free or discounted access to students who need it most: Hope Scholars, Physically Challenged students, Swachhta Warriors, Martyr's Families, Transgender Youth, Active Military personnel, ASHA/Anganwadi workers, and First-Generation learners." },
          { title:'Contact Us', content:"For support: support@tryiteducations.net\nFor partnerships: partners@tryiteducations.net\nFor privacy requests: privacy@tryiteducations.net\n\nTryIT Educations Pvt Ltd · India" },
        ].map(s=>(
          <div key={s.title} style={{ marginBottom:28 }}>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:18, marginBottom:8 }}>{s.title}</h2>
            <p style={{ color:'#475569', lineHeight:1.8, fontSize:15, whiteSpace:'pre-line' }}>{s.content}</p>
          </div>
        ))}
        <p style={{ color:'#94A3B8', fontSize:12, textAlign:'center', marginTop:40 }}>© 2026 TryIT Educations Pvt Ltd · All rights reserved</p>
      </div>
    </div>
  )
}
