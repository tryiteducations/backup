// src/pages/institution/InstitutionMentors.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const MENTORS = [
  {id:1,name:'Dr. Kavitha R.',subject:'Polity & History',rating:4.9,
   halls:['UPSC Morning Batch','TNPSC Tamil Nadu'],status:'active',
   joinedAt:'Jun 1, 2026',doubtsAnswered:142},
  {id:2,name:'Suresh M.',subject:'Reasoning & Maths',rating:4.8,
   halls:['SSC CGL Evening'],status:'active',
   joinedAt:'Jun 5, 2026',doubtsAnswered:98},
  {id:3,name:'Priya C.',subject:'Tamil & Polity',rating:4.9,
   halls:['TNPSC Tamil Nadu'],status:'active',
   joinedAt:'May 20, 2026',doubtsAnswered:201},
]

export default function InstitutionMentors() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [mentors, setMentors] = useState(MENTORS)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteId, setInviteId] = useState('')
  const [inviteHall, setInviteHall] = useState('')

  const HALLS = ['UPSC Morning Batch','SSC CGL Evening','Class 10 Science','TNPSC Tamil Nadu']

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/institution')} style={{background:'transparent',
          border:'1px solid '+b,borderRadius:10,padding:'6px 14px',
          color:m,fontSize:13,cursor:'pointer',fontWeight:600}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>👨‍🏫 Mentors</h1>
          <p style={{color:m,fontSize:11,margin:0}}>
            {mentors.length} mentors · All joined via TryIT app
          </p>
        </div>
        <button onClick={()=>setShowInvite(!showInvite)}
          style={{background:'linear-gradient(135deg,'+p+','+a+')',border:'none',
            borderRadius:12,padding:'9px 18px',color:'#fff',fontWeight:700,
            fontSize:13,cursor:'pointer'}}>
          + Invite Mentor
        </button>
      </div>

      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>

        {/* Invite note */}
        <div style={{background:p+'08',border:'1px solid '+p+'20',
          borderRadius:14,padding:'12px 16px',marginBottom:16}}>
          <p style={{color:p,fontWeight:700,fontSize:12,margin:'0 0 2px'}}>
            ℹ️ How to add mentors
          </p>
          <p style={{color:m,fontSize:11,margin:0,lineHeight:1.6}}>
            Mentors must have a TryIT account. Share your Institution Code
            <strong style={{color:t}}> INST-2026-4821 </strong>
            with them. They enter it in their app to join your institution.
            OR enter their TryIT ID below to invite directly.
          </p>
        </div>

        {/* Invite form */}
        {showInvite && (
          <div style={{background:c,border:'1.5px solid '+a,borderRadius:18,
            padding:'18px',marginBottom:16}}>
            <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 12px'}}>
              Invite by TryIT ID
            </p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,
                  fontSize:12,marginBottom:6}}>TryIT ID or Phone</label>
                <input value={inviteId} onChange={e=>setInviteId(e.target.value)}
                  placeholder="e.g. 9566698821 or TRYIT-0042"
                  style={{width:'100%',padding:'10px 12px',borderRadius:10,
                    border:'1.5px solid '+b,background:bg,color:t,
                    fontSize:13,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,
                  fontSize:12,marginBottom:6}}>Assign to Hall</label>
                <select value={inviteHall} onChange={e=>setInviteHall(e.target.value)}
                  style={{width:'100%',padding:'10px 12px',borderRadius:10,
                    border:'1.5px solid '+b,background:bg,color:t,
                    fontSize:13,outline:'none',cursor:'pointer'}}>
                  <option value="">Select hall (optional)</option>
                  {HALLS.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>{setShowInvite(false);setInviteId('');setInviteHall('')}}
                style={{background:'transparent',border:'1px solid '+b,
                  borderRadius:12,padding:'10px 20px',color:m,fontWeight:600,
                  fontSize:13,cursor:'pointer'}}>Cancel</button>
              <button style={{flex:1,
                background:'linear-gradient(135deg,'+p+','+a+')',
                border:'none',borderRadius:12,padding:'10px',
                color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
                Send Invitation
              </button>
            </div>
          </div>
        )}

        {/* Mentor list */}
        {mentors.map(mentor=>(
          <div key={mentor.id} style={{background:c,border:'1px solid '+b,
            borderRadius:18,padding:'18px',marginBottom:12,
            boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
            <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{width:48,height:48,borderRadius:'50%',flexShrink:0,
                background:'linear-gradient(135deg,'+p+','+a+')',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontWeight:800,fontSize:18,color:'#fff'}}>
                {mentor.name[0]}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',
                  justifyContent:'space-between',marginBottom:4}}>
                  <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>
                    {mentor.name}
                  </p>
                  <span style={{color:'var(--color-accent, #F59E0B)',fontWeight:700,fontSize:12}}>
                    ★ {mentor.rating}
                  </span>
                </div>
                <p style={{color:m,fontSize:11,margin:'0 0 8px'}}>
                  {mentor.subject} · Joined {mentor.joinedAt}
                </p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                  {mentor.halls.map(h=>(
                    <span key={h} style={{background:p+'10',color:p,fontSize:9,
                      fontWeight:700,padding:'2px 8px',borderRadius:20}}>
                      🏛️ {h}
                    </span>
                  ))}
                  <span style={{background:'#22C55E15',color:'#22C55E',
                    fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20}}>
                    💬 {mentor.doubtsAnswered} answers
                  </span>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button style={{background:a+'10',border:'1px solid '+a+'25',
                    borderRadius:10,padding:'6px 14px',color:a,
                    fontWeight:700,fontSize:11,cursor:'pointer'}}>
                    Assign Hall
                  </button>
                  <button style={{background:'transparent',border:'1px solid '+b,
                    borderRadius:10,padding:'6px 14px',color:m,
                    fontWeight:600,fontSize:11,cursor:'pointer'}}>
                    View Performance
                  </button>
                  <button style={{background:'transparent',
                    border:'1px solid #EF444430',borderRadius:10,
                    padding:'6px 14px',color:'#EF4444',
                    fontWeight:600,fontSize:11,cursor:'pointer'}}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{height:40}}/>
      </div>
    </div>
  )
}
