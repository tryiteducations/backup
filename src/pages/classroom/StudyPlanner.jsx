import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'

const HOURS = ['6 AM','7 AM','8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM','9 PM','10 PM']
const COLORS = ['#DBEAFE','#DCFCE7','#FEF3C7','#EDE9FE','#FCE7F3','#FEE2E2']
const SUBJECTS = ['Reasoning','Quant','English','GK','Current Affairs','Mock Test','Revision']

export default function StudyPlanner() {
  const [slots, setSlots] = useState({ '9 AM':{ subject:'Quant', color:'#DBEAFE' }, '11 AM':{ subject:'Reasoning', color:'#DCFCE7' }, '2 PM':{ subject:'English', color:'#FEF3C7' }, '7 PM':{ subject:'Mock Test', color:'#EDE9FE' } })
  const [drag, setDrag] = useState(null)
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>📅 Study Planner</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:16 }}>Tap a time slot to assign a subject.</p>

      <div style={{ background:'#fff', borderRadius:20, padding:16, border:'1.5px solid #E2E8F0', marginBottom:16 }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>Today's Schedule — Jun 11</p>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {HOURS.map(h=>{
            const slot = slots[h]
            return (
              <div key={h} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ color:'#94A3B8', fontSize:12, width:44, flexShrink:0 }}>{h}</span>
                <div onClick={()=>{
                  if(slot){ const n={...slots}; delete n[h]; setSlots(n) }
                  else{ const sub=SUBJECTS[Math.floor(Math.random()*SUBJECTS.length)]; const col=COLORS[Math.floor(Math.random()*COLORS.length)]; setSlots(s=>({...s,[h]:{subject:sub,color:col}})) }
                }} style={{ flex:1, height:36, borderRadius:10, background:slot?slot.color:'#F8FAFC', border:`1.5px dashed ${slot?'transparent':'#E2E8F0'}`, display:'flex', alignItems:'center', paddingLeft:12, cursor:'pointer', transition:'all 0.15s' }}>
                  {slot
                    ? <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:13 }}>{slot.subject}</span>
                    : <span style={{ color:'#CBD5E1', fontSize:12 }}>+ Add</span>
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {SUBJECTS.map((s,i)=>(
          <span key={s} style={{ background:COLORS[i%COLORS.length], fontSize:12, fontWeight:700, padding:'5px 14px', borderRadius:20, color:'#1E3A5F', cursor:'pointer' }}>{s}</span>
        ))}
      </div>
    </AppLayout>
  )
}
