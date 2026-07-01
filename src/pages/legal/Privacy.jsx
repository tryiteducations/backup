// FILE: src/pages/legal/Privacy.jsx - Route: /privacy
import { useNavigate } from 'react-router-dom'
const NAVY='#1E3A5F'

const SECTIONS=[
  {h:'1. Data We Collect',b:'Phone number (verified), name, exam preferences, state/city, test scores, and usage activity. For institutions: uploaded question content. For parents: linked child relationship data (with mutual consent).'},
  {h:'2. How We Use Your Data',b:'To personalize exam recommendations, compute leaderboard rankings, generate your category-rank predictions, deliver tournament results, and improve question quality through mentor review.'},
  {h:'3. Category Information (OBC/SC/ST/EWS/General)',b:'Your reservation category is used exclusively to show you a private category-rank comparison after tournaments. This information is never displayed publicly or shared with any other user, institution, or third party.'},
  {h:'4. Institution & Student Data Sharing',b:'Student progress is shared with an enrolled institution only after two-layer consent: general platform consent plus specific consent for that institution. For users under 18, parental consent via Family Hub is also required. This consent can be revoked anytime; TryIT retains aggregated data per our Terms.'},
  {h:'5. Parent Access',b:'A parent can view their child\'s tournament results, study progress, and Bharat Pulse activity only after the child links their registration token. Children can revoke parent access anytime in Settings.'},
  {h:'6. Data Security',b:'Passwords are hashed using Argon2ID. Tournament question keys use AES-256-GCM encryption. Payment data is processed via Razorpay and never stored on our servers.'},
  {h:'7. Third-Party Services',b:'We use Supabase (database), Cloudflare (content delivery), Razorpay (payments), and Truecaller (phone verification). Each handles data per their own privacy policies, linked in our Help Center.'},
  {h:'8. Data Retention',b:'We retain your data as long as your account is active. Upon account deletion, personal data is removed within 48 hours, except where retention is required for legal compliance or fraud prevention.'},
  {h:'9. Your Rights',b:'You can download your data anytime via Settings → Download My Data. You can request corrections or deletion by contacting support@tryiteducations.net.'},
  {h:'10. Children\'s Privacy',b:'Users under 18 have additional content safety filters applied automatically based on declared age or class level. We do not knowingly collect data from children without appropriate parental awareness mechanisms.'},
  {h:'11. Cookies & Tracking',b:'We use minimal session storage for login persistence. We do not sell user data to advertisers. No third-party ad-tracking scripts are used on TryIT Educations.'},
  {h:'12. Changes to This Policy',b:'We may update this policy periodically. Material changes will be communicated via in-app notification before taking effect.'},
]

export default function Privacy(){
  const navigate=useNavigate()
  return(
    <div style={{minHeight:'100vh',background:'var(--color-bg,#F8FAFC)',fontFamily:'Inter,sans-serif',paddingBottom:60}}>
      <div style={{background:NAVY,padding:'20px 16px'}}>
        <button onClick={()=>navigate(-1)} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',width:34,height:34,borderRadius:'50%',fontSize:16,cursor:'pointer',marginBottom:12}}>←</button>
        <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:20,color:'#fff',margin:0}}>Privacy Policy</h1>
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
          Privacy questions? Contact us at privacy@tryiteducations.net
        </p>
      </div>
    </div>
  )
}