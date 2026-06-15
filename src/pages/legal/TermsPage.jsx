// src/pages/legal/TermsPage.jsx
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'

const SECTIONS = [
  { num:'1', title:'Acceptance of Terms', body:'By accessing or using TryIT Educations ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Platform. These terms apply to all user types: Students, Mentors, Institutions, Family/Parents, and Administrators.' },
  { num:'2', title:'Account Responsibilities', body:'You are responsible for maintaining the confidentiality of your login credentials. You agree not to share your account with others. You must provide accurate information during registration. Accounts found to be fraudulent or misrepresenting eligibility (e.g. equity tier fraud) may be suspended without notice.' },
  { num:'3', title:'Coins & Virtual Currency', body:'TryIT coins are a virtual reward currency with no real-world monetary value. Coins cannot be redeemed for cash, transferred between accounts, or exchanged for real-world goods. Coin balances may be adjusted or reset in cases of fraudulent activity. Coins earned through legitimate platform activity (tests, streaks, games, Guru Hub answers) are yours to keep as long as your account remains in good standing.' },
  { num:'4', title:'Content Ownership', body:'Questions, explanations, and study materials provided by TryIT remain the intellectual property of TryIT Educations Pvt Ltd. Content submitted by users (doubt posts, answers in Guru Hub, ebook uploads) remains owned by the submitting user, but you grant TryIT a non-exclusive, royalty-free license to display, distribute, and use such content on the Platform.' },
  { num:'5', title:'Pro & Subscription Terms', body:'Core platform access is free for life. During our launch period, all users receive full Pro access at no charge. When paid plans are introduced, you will receive advance notice. Subscriptions (if activated) auto-renew unless cancelled before the renewal date. The ₹19 Trial Pass is non-refundable.' },
  { num:'6', title:'Equity Tier Terms', body:'Equity tier status (free-for-life or discounted access) is granted based on verified eligibility. Misrepresentation of eligibility is grounds for immediate account termination. Approved equity status is tied to your account and non-transferable.' },
  { num:'7', title:'Termination', body:'TryIT reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, abuse the platform\'s systems, or behave abusively toward other users or staff. Users may delete their own accounts at any time via Settings.' },
  { num:'8', title:'Governing Law', body:'These Terms are governed by the laws of India. Any disputes arising from the use of this Platform shall be subject to the exclusive jurisdiction of courts in Tamil Nadu, India.' },
]

export default function TermsPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC' }}>
      <div style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', padding:'20px 32px', display:'flex', alignItems:'center', gap:20 }}>
        <Logo dark height={36}/>
        <button onClick={()=>navigate('/landing')} style={{ marginLeft:'auto', background:'none', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:10, padding:'8px 16px', fontSize:13, cursor:'pointer' }}>← Back to Home</button>
      </div>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'40px 24px' }}>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'var(--color-primary, #1E3A5F)', fontSize:32, marginBottom:4 }}>Terms & Conditions</h1>
        <p style={{ color:'#94A3B8', fontSize:13, marginBottom:32 }}>Last updated: June 2026</p>
        <div style={{ display:'flex', flexDirection:'column', gap:4, background:'#fff', borderRadius:16, padding:16, border:'1.5px solid var(--color-border, #E2E8F0)', marginBottom:32 }}>
          <p style={{ fontWeight:700, color:'var(--color-primary, #1E3A5F)', fontSize:13, marginBottom:8 }}>Table of Contents</p>
          {SECTIONS.map(s=>(
            <a key={s.num} href={`#s${s.num}`} style={{ color:'#3B82F6', fontSize:13, textDecoration:'none' }}>{s.num}. {s.title}</a>
          ))}
        </div>
        {SECTIONS.map(s=>(
          <div key={s.num} id={`s${s.num}`} style={{ marginBottom:28 }}>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:18, marginBottom:8 }}>{s.num}. {s.title}</h2>
            <p style={{ color:'#475569', lineHeight:1.8, fontSize:15 }}>{s.body}</p>
          </div>
        ))}
        <p style={{ color:'#94A3B8', fontSize:12, textAlign:'center', marginTop:40 }}>© 2026 TryIT Educations Pvt Ltd · All rights reserved</p>
      </div>
    </div>
  )
}
