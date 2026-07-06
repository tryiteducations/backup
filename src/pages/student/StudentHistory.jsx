// src/pages/student/StudentHistory.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export default function StudentHistory() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'
  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,boxShadow:`0 4px 24px ${a}18`}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>📖 Test History</h1>
      </div>
      <div style={{padding:'20px',maxWidth:600,margin:'0 auto'}}>
        <div style={{background:c,border:`1.5px dashed ${b}`,borderRadius:20,
          padding:'40px 24px',textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:12}}>📝</div>
          <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 8px'}}>No tests taken yet</p>
          <p style={{color:m,fontSize:13,margin:'0 0 20px',lineHeight:1.6}}>
            Start your first test to see your history, scores and performance trends here.
          </p>
          <button onClick={()=>nav('/student/test')} style={{background:`linear-gradient(135deg,${p},${a})`,
            border:'none',borderRadius:14,padding:'12px 28px',
            color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer'}}>
            Take Your First Test →
          </button>
        </div>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
