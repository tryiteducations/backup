import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useToast } from '../../context/ToastContext'

const EXAMS_UPCOMING = [
  { name:'SSC CGL 2026 Tier 1', date:'Dec 10, 2026', daysLeft:183, enrolled:true,  emoji:'📋', important:true  },
  { name:'UPSC CSE Prelims 2026',date:'May 25, 2026', daysLeft:0,  enrolled:true,  emoji:'🏛️', important:true, passed:true  },
  { name:'IBPS PO Mains 2026',   date:'Nov 30, 2026', daysLeft:172, enrolled:false, emoji:'🏦', important:false },
  { name:'NEET UG 2026',          date:'May 4, 2026',  daysLeft:0,  enrolled:false, emoji:'🩺', important:false, passed:true  },
  { name:'RRB NTPC Phase 2',      date:'Jul 15, 2026', daysLeft:34, enrolled:true,  emoji:'🚂', important:true  },
  { name:'SSC CHSL 2026',         date:'Aug 20, 2026', daysLeft:70, enrolled:false, emoji:'📄', important:false },
  { name:'NDA 2 Written',         date:'Sep 14, 2026', daysLeft:95, enrolled:false, emoji:'🎖️', important:false },
  { name:'CAT 2026',              date:'Nov 24, 2026', daysLeft:166, enrolled:false, emoji:'🎓', important:true  },
]

export default function ExamAlerts() {
  const { showToast } = useToast()
  const [enrolled, setEnrolled] = useState(new Set(EXAMS_UPCOMING.filter(e=>e.enrolled).map((_,i)=>i)))
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>📡 Exam Watch</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Never miss a deadline. Get alerts 30/7/1 day before.</p>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {EXAMS_UPCOMING.map((e,i)=>(
          <div key={i} style={{ background:'#fff', borderRadius:18, padding:'14px 18px', border:`1.5px solid ${e.passed?'#E2E8F0':e.daysLeft<=7?'#EF444455':enrolled.has(i)?'rgba(212,175,55,0.3)':'#E2E8F0'}`, opacity: e.passed?0.6:1, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
            <span style={{ fontSize:26, flexShrink:0 }}>{e.emoji}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:3 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{e.name}</p>
                {e.important && <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:9, fontWeight:800, padding:'2px 6px', borderRadius:20 }}>★ Important</span>}
                {e.passed && <span style={{ background:'#F1F5F9', color:'#94A3B8', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>Completed</span>}
              </div>
              <p style={{ color:'#94A3B8', fontSize:12 }}>{e.date}</p>
            </div>
            <div style={{ flexShrink:0, textAlign:'right' }}>
              {!e.passed && (
                <>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18, color: e.daysLeft<=7?'#EF4444':e.daysLeft<=30?'#F59E0B':'#22C55E' }}>
                    {e.daysLeft===0?'Today':e.daysLeft+'d'}
                  </p>
                  <button onClick={()=>{ const n=new Set(enrolled); n.has(i)?n.delete(i):n.add(i); setEnrolled(n); showToast('success', n.has(i)?`✅ Alert set for ${e.name}`:`Removed alert for ${e.name}`) }}
                    style={{ background: enrolled.has(i)?'#FEF3C7':'#F1F5F9', border:'none', borderRadius:10, padding:'5px 12px', color: enrolled.has(i)?'#92400E':'#64748B', cursor:'pointer', fontSize:12, fontFamily:'Poppins,sans-serif', fontWeight:600, marginTop:4 }}>
                    {enrolled.has(i)?'🔔 Watching':'+ Watch'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
