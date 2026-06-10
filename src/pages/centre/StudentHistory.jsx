import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STUDENT_RESULTS = {
  's1': [
    { testName:'SSC CGL Mock 1',   date:'2026-06-08', score:78, rank:8,  total:32, subject:'Full' },
    { testName:'Quant Speed Test', date:'2026-06-07', score:82, rank:5,  total:28, subject:'Maths' },
    { testName:'English Mastery',  date:'2026-06-09', score:68, rank:12, total:35, subject:'English' },
    { testName:'Reasoning Drill',  date:'2026-06-05', score:85, rank:3,  total:30, subject:'Reasoning' },
    { testName:'GK Blitz',         date:'2026-06-03', score:72, rank:9,  total:32, subject:'GK' },
    { testName:'SSC Mock Full',    date:'2026-06-01', score:75, rank:7,  total:32, subject:'Full' },
  ]
}
const STUDENTS = [
  { id:'s1', name:'Arjun Kumar',   avg:78, streak:12 },
  { id:'s2', name:'Priya Sharma',  avg:84, streak:8  },
  { id:'s3', name:'Rahul Mehta',   avg:71, streak:5  },
]

export default function StudentHistory() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const results = selected ? (STUDENT_RESULTS[selected.id] || []) : []
  const avg = results.length
    ? Math.round(results.reduce((a,r)=>a+r.score,0)/results.length) : 0

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', padding:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>navigate('/centre/dashboard')}
          style={{ background:'none', border:'none', fontSize:22, cursor:'pointer' }}>←</button>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:22 }}>
          Student History
        </h1>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:20 }}>
        {/* Student list */}
        <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ background:'#1E3A5F', padding:'12px 16px' }}>
            <p style={{ color:'#D4AF37', fontWeight:700, fontFamily:'Poppins,sans-serif', fontSize:13 }}>
              All Students
            </p>
          </div>
          {STUDENTS.map(s => (
            <div key={s.id} onClick={()=>setSelected(s)}
              style={{ padding:'14px 16px', borderBottom:'1px solid #F1F5F9', cursor:'pointer',
                background: selected?.id===s.id ? 'rgba(212,175,55,0.1)' : '#fff',
                borderLeft: selected?.id===s.id ? '4px solid #D4AF37' : 'none' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F' }}>{s.name}</p>
              <p style={{ color:'#94A3B8', fontSize:12 }}>Avg: {s.avg}% · 🔥{s.streak}d</p>
            </div>
          ))}
        </div>

        {/* History */}
        <div>
          {!selected ? (
            <div style={{ background:'#fff', borderRadius:20, padding:40,
              textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize:40 }}>👈</p>
              <p style={{ color:'#94A3B8' }}>Select a student to see their history</p>
            </div>
          ) : (
            <>
              {/* Mini stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                {[['📝',results.length,'Tests Taken'],['📊',`${avg}%`,'Avg Score'],['🔥',selected.streak,'Day Streak']].map(([e,v,l])=>(
                  <div key={l} style={{ background:'#fff', borderRadius:16, padding:14,
                    textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize:22 }}>{e}</p>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:18 }}>{v}</p>
                    <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
                  </div>
                ))}
              </div>

              {/* Score trend */}
              <div style={{ background:'#fff', borderRadius:20, padding:20,
                boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:16 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>
                  Score Trend
                </p>
                <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:80 }}>
                  {results.map((r,i) => (
                    <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:10, color:'#94A3B8' }}>{r.score}%</span>
                      <div style={{
                        width:'100%', borderRadius:'6px 6px 0 0',
                        height:`${(r.score/100)*70}px`,
                        background: r.score>=80?'#22C55E':r.score>=70?'#D4AF37':'#EF4444',
                        minHeight:8,
                      }} />
                      <span style={{ fontSize:9, color:'#94A3B8' }}>{r.date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tests table */}
              <div style={{ background:'#fff', borderRadius:20, overflow:'hidden',
                boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
                {results.map((r,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12,
                    padding:'13px 18px', borderBottom:'1px solid #F1F5F9' }}>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:14 }}>
                        {r.testName}
                      </p>
                      <p style={{ color:'#94A3B8', fontSize:12 }}>{r.date} · {r.subject}</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontWeight:800, color: r.score>=70?'#22C55E':'#EF4444', fontSize:15 }}>
                        {r.score}%
                      </p>
                      <p style={{ color:'#94A3B8', fontSize:12 }}>Rank #{r.rank}/{r.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
