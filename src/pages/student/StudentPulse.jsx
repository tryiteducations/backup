// src/pages/student/StudentPulse.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import ShareButton from '../../components/ShareButton'

const CATS = ['All','Economy','Science','Polity','International','Sports','Environment']
const NEWS = [
  {title:"India's semiconductor mission: 5 fabs to be operational by 2026",
   cat:'Science',exams:['UPSC','SSC','IBPS'],importance:'High',
   relevance:'GS3 Economy, Science & Tech'},
  {title:'RBI keeps repo rate unchanged at 6.5% for 8th consecutive time',
   cat:'Economy',exams:['IBPS','UPSC','SSC'],importance:'High',
   relevance:'GS3 Economy · Banking awareness'},
  {title:'India ranks 39th in Global Innovation Index 2025',
   cat:'Economy',exams:['UPSC','TNPSC'],importance:'Medium',
   relevance:'GS2 Governance, GS3 Economy'},
  {title:'Chandrayaan-4 mission components integration begins at ISRO',
   cat:'Science',exams:['UPSC','SSC','RRB'],importance:'High',
   relevance:'GS3 Science & Technology'},
  {title:'India signs trade deal with 4 ASEAN nations for electronics',
   cat:'International',exams:['UPSC','IBPS'],importance:'Medium',
   relevance:'GS2 International Relations'},
]

export default function StudentPulse() {
  const nav = useNavigate()
  const [cat, setCat] = useState('All')
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'
  const filtered = cat === 'All' ? NEWS : NEWS.filter(n=>n.cat===cat)
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>🇮🇳 Bharat Pulse</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Daily current affairs · Exam-mapped</p>
        </div>
        <ShareButton headline="Staying current with TryIT" stat="🇮🇳" subLabel="Daily current affairs, exam-mapped" context="Current Affairs" emoji="📰" />
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,marginBottom:16}}>
          {CATS.map((x,i)=>(
            <button key={i} onClick={()=>setCat(x)}
              style={{background:cat===x?`linear-gradient(135deg,${p},${a})`:`${b}55`,
                border:'none',borderRadius:20,padding:'6px 14px',whiteSpace:'nowrap',
                color:cat===x?'#fff':m,fontWeight:600,fontSize:12,cursor:'pointer',
                transition:'all 0.2s',flexShrink:0}}>
              {x}
            </button>
          ))}
        </div>
        {filtered.map((n,i)=>(
          <div key={i} style={{background:c,border:`1px solid ${b}`,borderRadius:16,
            padding:'16px',marginBottom:10,transition:'all 0.2s',cursor:'pointer'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=a}
            onMouseLeave={e=>e.currentTarget.style.borderColor=b}>
            <div style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:8}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:6,marginBottom:6}}>
                  <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                    padding:'2px 8px',borderRadius:20}}>{n.cat}</span>
                  <span style={{background:n.importance==='High'?'#EF444415':'#F59E0B15',
                    color:n.importance==='High'?'#EF4444':'#F59E0B',
                    fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20}}>{n.importance}</span>
                </div>
                <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 6px',lineHeight:1.5}}>{n.title}</p>
                <p style={{color:m,fontSize:11,margin:'0 0 8px'}}>📚 {n.relevance}</p>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {n.exams.map((e,j)=>(
                    <span key={j} style={{background:`${p}12`,color:p,fontSize:9,fontWeight:700,
                      padding:'2px 8px',borderRadius:20}}>{e}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
