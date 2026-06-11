import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const CHILDREN = [
  { name:'Priya Kumar', class:'Class 12 · Science', streak:8, testsThisWeek:5, avgScore:84, lastActive:'Today 2 PM', level:'📈 The Riser', rank:'#2,341', concern:null },
  { name:'Ravi Kumar',  class:'B.Sc 1st Year',      streak:2, testsThisWeek:1, avgScore:61, lastActive:'3 days ago', level:'🔥 Fierce One', rank:'#8,921', concern:'Low activity this week' },
]

export default function ParentDashboard() {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:6 }}>👨‍👩‍👧 Parent Dashboard</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Monitor your children's exam preparation.</p>

      {CHILDREN.map((c,i)=>(
        <div key={i} style={{ background:'#fff', borderRadius:22, padding:22, marginBottom:14, border:`1.5px solid ${c.concern?'#FEE2E2':'#E2E8F0'}`, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
          {c.concern && (
            <div style={{ background:'#FEE2E2', borderRadius:12, padding:'8px 14px', marginBottom:12 }}>
              <p style={{ color:'#991B1B', fontSize:12, fontWeight:600 }}>⚠️ {c.concern}</p>
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, flexWrap:'wrap' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#1E3A5F,#0F2140)', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4AF37', fontWeight:900, fontSize:17 }}>
              {c.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16 }}>{c.name}</p>
              <p style={{ color:'#64748B', fontSize:13 }}>{c.class} · Last active: {c.lastActive}</p>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10 }}>
            {[['📝',c.testsThisWeek,'Tests this week'],['📊',`${c.avgScore}%`,'Avg score'],['🔥',`${c.streak}d`,'Streak'],['🏆',c.rank,'Rank']].map(([e,v,l])=>(
              <div key={l} style={{ background:'#F8FAFC', borderRadius:12, padding:'10px 8px', textAlign:'center' }}>
                <p style={{ fontSize:18 }}>{e}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:16 }}>{v}</p>
                <p style={{ color:'#94A3B8', fontSize:10, marginTop:2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AppLayout>
  )
}
