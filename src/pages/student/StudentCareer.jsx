// src/pages/student/StudentCareer.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const EXAMS = [
  {icon:'🏛️',name:'UPSC Civil Services',match:94,reason:'Strong GK & analytical aptitude',level:'National'},
  {icon:'📋',name:'SSC CGL',match:88,reason:'Excellent in Reasoning & Maths',level:'National'},
  {icon:'🌿',name:'TNPSC Group 1',match:85,reason:'Tamil Nadu background advantage',level:'State'},
  {icon:'🏦',name:'IBPS PO',match:79,reason:'Good quantitative skills',level:'National'},
  {icon:'🚂',name:'RRB NTPC',match:75,reason:'Science & GK strength',level:'National'},
]

export default function StudentCareer() {
  const nav = useNavigate()
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
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🧭 Career AI</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Find the best exam for you</p>
        </div>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{background:`linear-gradient(135deg,${p},${p}cc)`,borderRadius:20,
          padding:'24px',marginBottom:20,textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:8}}>🤖</div>
          <p style={{color:'#fff',fontWeight:800,fontSize:16,margin:'0 0 6px'}}>AI-Powered Exam Match</p>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:12,margin:'0 0 16px'}}>
            Based on your performance, strengths & background
          </p>
          <button onClick={()=>nav('/career-compass')} style={{background:`linear-gradient(135deg,${a},#E8C44A)`,
            border:'none',borderRadius:12,padding:'10px 24px',color:p,fontWeight:800,fontSize:13,cursor:'pointer'}}>
            Take Career Assessment →
          </button>
        </div>
        <p style={{color:t,fontWeight:700,fontSize:14,marginBottom:12}}>Your Top Exam Matches</p>
        {EXAMS.map((e,i)=>(
          <div key={i} style={{background:c,border:`1px solid ${b}`,borderRadius:16,
            padding:'16px',marginBottom:10,display:'flex',alignItems:'center',gap:14,
            cursor:'pointer',transition:'all 0.2s'}}
            onMouseEnter={x=>x.currentTarget.style.borderColor=a}
            onMouseLeave={x=>x.currentTarget.style.borderColor=b}>
            <div style={{fontSize:32,flexShrink:0}}>{e.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <p style={{color:t,fontWeight:700,fontSize:13,margin:0}}>{e.name}</p>
                <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                  padding:'2px 8px',borderRadius:20}}>{e.level}</span>
              </div>
              <p style={{color:m,fontSize:11,margin:'0 0 8px'}}>{e.reason}</p>
              <div style={{height:5,background:`${b}`,borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${e.match}%`,borderRadius:4,
                  background:`linear-gradient(90deg,${p},${a})`}}/>
              </div>
            </div>
            <div style={{textAlign:'center',flexShrink:0}}>
              <p style={{color:a,fontWeight:900,fontSize:18,margin:0}}>{e.match}%</p>
              <p style={{color:m,fontSize:9,margin:0}}>match</p>
            </div>
          </div>
        ))}
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
