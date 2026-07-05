// src/pages/student/StudentRank.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import ShareButton from '../../components/ShareButton'

const MOCK = [
  {rank:1,name:'Priya Suresh',score:98.4,state:'Tamil Nadu',exam:'UPSC'},
  {rank:2,name:'Arjun Mehta',score:97.1,state:'Maharashtra',exam:'SSC CGL'},
  {rank:3,name:'Lakshmi Rajan',score:96.8,state:'Kerala',exam:'UPSC'},
  {rank:4,name:'Kiran Kumar',score:95.2,state:'Karnataka',exam:'IBPS PO'},
  {rank:5,name:'Divya Sharma',score:94.7,state:'Rajasthan',exam:'UPSC'},
  {rank:6,name:'Murugan P',score:93.1,state:'Tamil Nadu',exam:'TNPSC'},
  {rank:7,name:'Sneha Patil',score:92.8,state:'Maharashtra',exam:'SSC CGL'},
  {rank:8,name:'Ravi Verma',score:91.5,state:'UP',exam:'RRB NTPC'},
]
const MEDAL = {1:'🥇',2:'🥈',3:'🥉'}

export default function StudentRank() {
  const nav = useNavigate()
  const [filter, setFilter] = useState('All')
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🏆 All-India Ranks</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Live leaderboard · Updated after every test</p>
        </div>
        <ShareButton headline="My All-India Rank" stat="Top Ranked" subLabel="On TryIT Educations" context="Leaderboard" emoji="🏆" />
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{background:`linear-gradient(135deg,${p},${p}cc)`,borderRadius:18,
          padding:'18px',marginBottom:20,textAlign:'center'}}>
          <p style={{color:a,fontWeight:700,fontSize:11,letterSpacing:'1px',margin:'0 0 4px'}}>YOUR CURRENT RANK</p>
          <p style={{color:'#fff',fontWeight:900,fontSize:36,margin:'0 0 4px'}}>-</p>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:12,margin:'0 0 12px'}}>
            Take a test to appear on the leaderboard
          </p>
          <button onClick={()=>nav('/student/test')} style={{background:`linear-gradient(135deg,${a},#E8C44A)`,
            border:'none',borderRadius:12,padding:'10px 24px',color:p,fontWeight:800,fontSize:13,cursor:'pointer'}}>
            Take a Test →
          </button>
        </div>
        <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,marginBottom:14}}>
          {['All','UPSC','SSC','IBPS','TNPSC','RRB'].map((f,i)=>(
            <button key={i} onClick={()=>setFilter(f)}
              style={{background:filter===f?`linear-gradient(135deg,${p},${a})`:`${b}55`,
                border:'none',borderRadius:20,padding:'6px 14px',
                color:filter===f?'#fff':m,fontWeight:600,fontSize:12,cursor:'pointer',
                flexShrink:0,transition:'all 0.2s'}}>
              {f}
            </button>
          ))}
        </div>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:16,overflow:'hidden'}}>
          {MOCK.filter(r=>filter==='All'||r.exam.includes(filter)).map((r,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',
              borderBottom:`1px solid ${b}`,background:i<3?`${a}05`:'transparent'}}>
              <span style={{width:28,textAlign:'center',fontWeight:900,fontSize:i<3?18:13,
                color:i<3?a:m,flexShrink:0}}>
                {MEDAL[r.rank]||`#${r.rank}`}
              </span>
              <div style={{width:36,height:36,borderRadius:'50%',background:`${p}15`,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontWeight:800,fontSize:13,color:p,flexShrink:0}}>
                {r.name[0]}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{color:t,fontWeight:600,fontSize:13,margin:'0 0 2px',
                  overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</p>
                <span style={{color:m,fontSize:10}}>{r.state} · {r.exam}</span>
              </div>
              <span style={{color:a,fontWeight:800,fontSize:13,flexShrink:0}}>{r.score}%</span>
            </div>
          ))}
        </div>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
