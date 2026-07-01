// FILE: src/pages/legal/Terms.jsx - Route: /terms
import { useNavigate } from 'react-router-dom'
const NAVY='#1E3A5F'

const SECTIONS=[
  {h:'1. About TryIT Educations',b:'TryIT Educations (tryiteducations.net) is a zero-cost competitive exam preparation platform covering 1,10,000+ exams across 40 Indian languages. By creating an account, you agree to these Terms of Service.'},
  {h:'2. Account & Eligibility',b:'You must register with a verified phone number. One account per phone number. Users under 18 require parental awareness via the Family Hub. Providing false information may result in account suspension.'},
  {h:'3. Free Access Commitment',b:'Core practice tests, PYQs, and basic features remain free, forever. Optional Pro/Ultra subscriptions and coin purchases unlock additional features but never gate basic exam preparation.'},
  {h:'4. Tournaments & Anti-Cheat',b:'Tournament participation requires fair play. We use device-locking, unique paper assembly per student, speed-anomaly detection, and cluster analysis to detect cheating. Violations result in disqualification and may include permanent account suspension.'},
  {h:'5. Institution Content & Copyright',b:'Institutions uploading questions, answer keys, or materials grant TryIT Educations permanent, irrevocable ownership of that content for educational use on the platform. This applies even after an institution discontinues its partnership.'},
  {h:'6. Coins & Virtual Currency',b:'Coins have no real-world cash value and cannot be exchanged for money except where explicitly stated (e.g. referral cashback). Coin earn/spend rates are set by TryIT and may change at any time. Coins do not expire.'},
  {h:'7. Mentor Program',b:'Mentors who fix flagged questions earn coins and cashback per TryIT\'s published rate card. Cashback is processed within 3-5 business days to a verified UPI ID, subject to a ₹50 minimum withdrawal.'},
  {h:'8. Prohibited Conduct',b:'Users may not: share accounts, use automated tools (bots/AI) to answer questions, attempt to access other users\' data, reverse-engineer tournament question sets, or harass other users including mentors and institutions.'},
  {h:'9. Content Ownership',b:'All questions, explanations, and platform content are the property of TryIT Educations or its content partners. Users may not redistribute, sell, or republish platform content without written permission.'},
  {h:'10. Termination',b:'TryIT may suspend or terminate accounts for violations of these terms, including but not limited to cheating, harassment, or fraudulent payment activity. Users may delete their account at any time via Settings.'},
  {h:'11. Limitation of Liability',b:'TryIT Educations provides exam preparation content "as is" and does not guarantee exam success. We are not liable for indirect damages arising from platform use, including missed exam deadlines or technical outages.'},
  {h:'12. Changes to Terms',b:'These terms may be updated periodically. Continued use of the platform after changes constitutes acceptance. Material changes will be notified via in-app announcement.'},
]

export default function Terms(){
  const navigate=useNavigate()
  return(
    <div style={{minHeight:'100vh',background:'var(--color-bg,#F8FAFC)',fontFamily:'Inter,sans-serif',paddingBottom:60}}>
      <div style={{background:NAVY,padding:'20px 16px'}}>
        <button onClick={()=>navigate(-1)} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',width:34,height:34,borderRadius:'50%',fontSize:16,cursor:'pointer',marginBottom:12}}>←</button>
        <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:20,color:'#fff',margin:0}}>Terms of Service</h1>
        <p style={{fontSize:12,color:'rgba(255,255,255,0.6)',margin:'4px 0 0'}}>Last updated: June 2026</p>
      </div>
      <div style={{padding:20,maxWidth:680,margin:'0 auto'}}>
        {SECTIONS.map(s=>(
          <div key={s.h} style={{marginBottom:20}}>
            <h3 style={{fontSize:14,fontWeight:700,color:NAVY,marginBottom:6}}>{s.h}</h3>
            <p style={{fontSize:13,color:'#475569',lineHeight:1.8,margin:0}}>{s.b}</p>
          </div>
        ))}
        <p style={{fontSize:12,color:'#94A3B8',marginTop:24}}>
          Questions about these terms? Contact us at support@tryiteducations.net
        </p>
      </div>
    </div>
  )
}