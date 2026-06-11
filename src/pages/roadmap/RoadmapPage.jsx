import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'

const generateRoadmap = (examId) => {
  const days = Array.from({ length: 30 }, (_,i) => {
    const subjects = ['Quantitative Aptitude','Reasoning','English','General Knowledge','Current Affairs']
    const s = subjects[i % subjects.length]
    const topics = {
      'Quantitative Aptitude':['Profit & Loss','Percentage','Time & Work','Ratio','Averages'],
      'Reasoning':['Analogies','Coding-Decoding','Blood Relations','Direction','Syllogisms'],
      'English':['Reading Comprehension','Error Detection','Vocabulary','Sentence Correction','Fill in the blanks'],
      'General Knowledge':['History','Geography','Polity','Economics','Science GK'],
      'Current Affairs':["Today's national news","International news","Sports updates","Economy news","Awards & honours"],
    }
    const tArr = topics[s] || ['Topic 1','Topic 2']
    return {
      day: i+1,
      subject: s,
      topic: tArr[Math.floor(Math.random()*tArr.length)],
      tests: i%7===6 ? 1 : 0,
      done: i < 8,
      today: i === 8,
    }
  })
  return days
}

const WEEK_COLORS = ['#EDE9FE','#DBEAFE','#DCFCE7','#FEF3C7','#FEE2E2']

export default function RoadmapPage() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const [view, setView] = useState('week')
  const roadmap = generateRoadmap(examId)
  const today = roadmap.find(d=>d.today)
  const weeks = [0,1,2,3].map(w => roadmap.slice(w*7, w*7+7))

  return (
    <AppLayout>
      <div style={{ marginBottom:20 }}>
        <button onClick={()=>navigate(-1)} style={{ background:'none', border:'none', color:'#64748B', cursor:'pointer', marginBottom:12, fontSize:14 }}>← Back</button>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28 }}>🗺️ 30-Day Roadmap</h1>
        <p style={{ color:'#94A3B8', fontSize:14 }}>{examId?.toUpperCase().replace(/-/g,' ')} · Auto-generated from your exam date</p>
      </div>

      {/* Today's plan */}
      {today && (
        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:22, padding:22, marginBottom:20, border:'1.5px solid rgba(212,175,55,0.3)' }}>
          <p style={{ color:'#D4AF37', fontSize:12, fontWeight:700, letterSpacing:'2px', marginBottom:8 }}>TODAY — DAY {today.day}</p>
          <h2 style={{ color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:4 }}>{today.subject}</h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:15, marginBottom:16 }}>Topic: <strong style={{ color:'#D4AF37' }}>{today.topic}</strong></p>
          <button onClick={()=>navigate('/test-engine')} style={{ background:'linear-gradient(135deg,#D4AF37,#E8C84A)', border:'none', borderRadius:14, padding:'12px 24px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, color:'#1E3A5F', cursor:'pointer' }}>
            Start Today's Practice →
          </button>
        </div>
      )}

      {/* Week view */}
      {weeks.map((week,wi)=>(
        <div key={wi} style={{ marginBottom:20 }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:10 }}>Week {wi+1}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6 }}>
            {week.map(d=>(
              <div key={d.day} style={{ borderRadius:14, padding:'10px 6px', textAlign:'center', background: d.done?'#DCFCE7':d.today?'linear-gradient(135deg,#1E3A5F,#0F2140)':WEEK_COLORS[wi], border: d.today?'2px solid #D4AF37':d.done?'1.5px solid #22C55E':'1.5px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:11, color: d.done?'#15803D':d.today?'#D4AF37':'#64748B' }}>D{d.day}</p>
                <p style={{ fontSize:d.done?'14px':'10px', marginTop:2 }}>{d.done?'✅':d.today?'📍':d.tests?'📝':'📖'}</p>
                <p style={{ fontSize:8, color: d.done?'#15803D':d.today?'rgba(255,255,255,0.7)':'#94A3B8', marginTop:2, lineHeight:1.2 }}>{d.subject.slice(0,6)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AppLayout>
  )
}
