import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const MOCK_HISTORY = [
  { id:'r1', exam:'SSC CGL', testName:'Mock Test 1', date:'2026-06-08', score:78, total:100, rank:1243, time:'26:34', type:'Mock'     },
  { id:'r2', exam:'SSC CGL', testName:'Quant Practice',date:'2026-06-07',score:82,total:50, rank:null,  time:'18:22', type:'Practice' },
  { id:'r3', exam:'IBPS PO', testName:'Mock Test 3', date:'2026-06-06', score:65, total:100, rank:4521, time:'35:12', type:'Mock'     },
  { id:'r4', exam:'SSC CGL', testName:'English Drill', date:'2026-06-05',score:68,total:50, rank:null, time:'12:44', type:'Practice' },
  { id:'r5', exam:'UPSC CSE',testName:'Prelims Mock', date:'2026-06-03', score:71, total:200, rank:8892, time:'48:00', type:'Mock'     },
  { id:'r6', exam:'SSC CGL', testName:'Reasoning',   date:'2026-06-01', score:90, total:50, rank:null,  time:'09:13', type:'Speed'    },
]

const FILTERS = ['All', 'Mock', 'Practice', 'Speed']

export default function MyTestHistory() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? MOCK_HISTORY : MOCK_HISTORY.filter(r => r.type === filter)
  const avg = Math.round(filtered.reduce((a,r) => a + (r.score/r.total)*100, 0) / (filtered.length || 1))

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:26, marginBottom:6 }}>
        📝 My Test History
      </h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>{MOCK_HISTORY.length} tests recorded</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        {[['📝',MOCK_HISTORY.length,'Tests Taken'],['📊',`${avg}%`,'Avg Score'],['🏆','#1,243','Best Rank']].map(([e,v,l])=>(
          <div key={l} style={{ background:'#fff', borderRadius:18, padding:'14px 12px',
            textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize:24 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:20 }}>{v}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'8px 18px', borderRadius:20, border:'none', cursor:'pointer',
            background: filter===f ? '#1E3A5F' : '#fff',
            color: filter===f ? '#fff' : '#64748B',
            fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13,
            boxShadow:'0 1px 6px rgba(0,0,0,0.06)',
          }}>{f}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
        {filtered.map((r,i) => {
          const pct = Math.round((r.score/r.total)*100)
          return (
            <div key={r.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
              borderBottom: i<filtered.length-1 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ width:44, height:44, borderRadius:12,
                background: pct>=80?'#DCFCE7':pct>=60?'#FEF3C7':'#FEE2E2',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Poppins,sans-serif', fontWeight:800,
                color: pct>=80?'#15803D':pct>=60?'#92400E':'#991B1B', fontSize:14, flexShrink:0 }}>
                {pct}%
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:14 }}>
                  {r.testName}
                </p>
                <p style={{ color:'#94A3B8', fontSize:12 }}>
                  {r.exam} · {r.date} · ⏱ {r.time}
                </p>
              </div>
              <div style={{ textAlign:'right' }}>
                <span style={{ background: r.type==='Mock'?'#EDE9FE':r.type==='Speed'?'#FEF3C7':'#F0FDF4',
                  color: r.type==='Mock'?'#7C3AED':r.type==='Speed'?'#92400E':'#15803D',
                  padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:700 }}>
                  {r.type}
                </span>
                {r.rank && <p style={{ color:'#D4AF37', fontWeight:700, fontSize:12, marginTop:3 }}>Rank #{r.rank.toLocaleString()}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}
