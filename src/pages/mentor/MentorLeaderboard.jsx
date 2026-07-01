// src/pages/mentor/MentorLeaderboard.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const MENTORS = [
  {rank:1,name:'Dr. Kavitha Rajan',city:'Chennai',state:'Tamil Nadu',
   subject:'Polity & GS',exam:'UPSC',where:'IAS Officer (Retd)',
   doubts:1842,rating:4.9,students:48,emoji:'🏛️',verified:true},
  {rank:2,name:'Suresh Menon',city:'Kochi',state:'Kerala',
   subject:'Reasoning & Maths',exam:'SSC',where:'SSC Coaching Faculty',
   doubts:1654,rating:4.8,students:36,emoji:'📐',verified:true},
  {rank:3,name:'Priya Chandran',city:'Madurai',state:'Tamil Nadu',
   subject:'Tamil & Polity',exam:'TNPSC',where:'TNPSC Group 1 Qualifier',
   doubts:1423,rating:4.9,students:52,emoji:'🌿',verified:true},
  {rank:4,name:'Ramesh Kumar',city:'Hyderabad',state:'Telangana',
   subject:'Banking & Economy',exam:'IBPS',where:'Bank Manager, SBI',
   doubts:1201,rating:4.7,students:29,emoji:'🏦',verified:true},
  {rank:5,name:'Anita Sharma',city:'Jaipur',state:'Rajasthan',
   subject:'GK & Current Affairs',exam:'UPSC',where:'Delhi Coaching Centre',
   doubts:980,rating:4.8,students:31,emoji:'📚',verified:true},
  {rank:6,name:'Vijay Nair',city:'Trivandrum',state:'Kerala',
   subject:'Science & Environment',exam:'UPSC',where:'PhD Scholar, IIT',
   doubts:876,rating:4.7,students:24,emoji:'🔬',verified:false},
  {rank:7,name:'Meera Patel',city:'Surat',state:'Gujarat',
   subject:'English & Comprehension',exam:'SSC',where:'English Faculty, DU',
   doubts:754,rating:4.6,students:18,emoji:'📝',verified:true},
]

const MEDAL = {1:'🥇',2:'🥈',3:'🥉'}
const FILTERS = ['All India','UPSC','SSC CGL','IBPS','TNPSC','RRB']

export default function MentorLeaderboard() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'
  const [filter, setFilter] = useState('All India')

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav(-1)} style={{background:'transparent',border:'1px solid '+b,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>🏆 Mentor Leaderboard</h1>
          <p style={{color:m,fontSize:11,margin:0}}>
            From Kashmir to Kanyakumari · Ranked by doubts solved + quality
          </p>
        </div>
      </div>

      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>

        {/* Filter */}
        <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,marginBottom:20}}>
          {FILTERS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:'7px 16px',borderRadius:20,border:'none',cursor:'pointer',
                fontSize:12,fontWeight:700,flexShrink:0,transition:'all 0.2s',
                background:filter===f?'linear-gradient(135deg,'+p+','+a+')':'transparent',
                color:filter===f?'#fff':m}}>
              {f}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1fr',
          gap:12,marginBottom:20,alignItems:'end'}}>
          {[MENTORS[1],MENTORS[0],MENTORS[2]].map((mentor,i)=>{
            const rank = i===0?2:i===1?1:3
            const heights = ['80px','100px','70px']
            return (
              <div key={rank} style={{background:c,border:'2px solid '+(rank===1?a:b),
                borderRadius:18,padding:'16px',textAlign:'center',
                paddingTop:heights[i],position:'relative',
                boxShadow:rank===1?'0 8px 24px '+a+'30':'none'}}>
                <div style={{position:'absolute',top:-20,left:'50%',transform:'translateX(-50%)',
                  fontSize:32}}>{MEDAL[rank]}</div>
                <div style={{width:48,height:48,borderRadius:'50%',margin:'0 auto 8px',
                  background:'linear-gradient(135deg,'+p+','+a+')',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:20,fontWeight:700,color:'#fff'}}>
                  {mentor.emoji}
                </div>
                <p style={{color:t,fontWeight:700,fontSize:12,margin:'0 0 2px'}}>{mentor.name.split(' ')[0]}</p>
                <p style={{color:m,fontSize:9,margin:'0 0 4px'}}>{mentor.city}</p>
                <p style={{color:a,fontWeight:800,fontSize:13,margin:0}}>
                  {mentor.doubts.toLocaleString()} solved
                </p>
              </div>
            )
          })}
        </div>

        {/* Full list */}
        {MENTORS.map((mentor,i)=>(
          <div key={i} style={{background:c,border:'1px solid '+b,borderRadius:16,
            padding:'16px',marginBottom:10,display:'flex',gap:14,alignItems:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.04)',transition:'all 0.2s',cursor:'pointer'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=a;e.currentTarget.style.transform='translateX(4px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=b;e.currentTarget.style.transform='translateX(0)'}}>

            <span style={{width:32,textAlign:'center',fontWeight:900,flexShrink:0,
              fontSize:i<3?20:13,color:i<3?a:m}}>
              {MEDAL[mentor.rank]||'#'+mentor.rank}
            </span>

            <div style={{width:44,height:44,borderRadius:14,flexShrink:0,
              background:'linear-gradient(135deg,'+p+','+a+')',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>
              {mentor.emoji}
            </div>

            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                <p style={{color:t,fontWeight:700,fontSize:13,margin:0}}>{mentor.name}</p>
                {mentor.verified&&(
                  <span style={{background:'#3B82F615',color:'#3B82F6',fontSize:9,
                    fontWeight:700,padding:'1px 6px',borderRadius:20}}>✓ Verified</span>
                )}
              </div>
              <p style={{color:m,fontSize:11,margin:'0 0 4px'}}>
                📍 {mentor.city}, {mentor.state} · {mentor.where}
              </p>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <span style={{background:p+'10',color:p,fontSize:9,fontWeight:700,
                  padding:'2px 8px',borderRadius:20}}>{mentor.exam}</span>
                <span style={{background:a+'15',color:a,fontSize:9,fontWeight:700,
                  padding:'2px 8px',borderRadius:20}}>{mentor.subject}</span>
              </div>
            </div>

            <div style={{textAlign:'right',flexShrink:0}}>
              <p style={{color:'var(--color-accent, #F59E0B)',fontSize:12,fontWeight:700,margin:'0 0 2px'}}>
                ★ {mentor.rating}
              </p>
              <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 2px'}}>
                {mentor.doubts.toLocaleString()}
              </p>
              <p style={{color:m,fontSize:9,margin:'0 0 4px'}}>doubts solved</p>
              <p style={{color:m,fontSize:9,margin:0}}>{mentor.students} students</p>
            </div>
          </div>
        ))}
        <div style={{height:40}}/>
      </div>
    </div>
  )
}
