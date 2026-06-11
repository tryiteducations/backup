import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const EXAM_DATA = {
  'ssc-cgl': {
    name:'SSC CGL 2026', fullName:'Staff Selection Commission Combined Graduate Level',
    emoji:'📋', conductingBody:'Staff Selection Commission', ministry:'Ministry of Personnel',
    frequency:'Annual', level:'National', category:'Central Government',
    vacancies:'17,727', salary:'₹47,600 – ₹1,51,100/month', age:'18–32 years',
    education:'Any Graduate', negative:'-0.5 per wrong answer',
    stages:['Tier 1 (CBT Online)','Tier 2 (CBT Online)','Document Verification'],
    syllabus:['General Intelligence & Reasoning','General Awareness','Quantitative Aptitude','English Comprehension'],
    timeline:{ notification:'Sep 2026', form:'Oct 2026', tier1:'Dec 2026', tier2:'Mar 2027', result:'Jun 2027' },
    readiness:67, enrolled:true, color:'#1E3A5F',
  },
  'upsc-cse': {
    name:'UPSC CSE 2026', fullName:'Union Public Service Commission Civil Services Exam',
    emoji:'🏛️', conductingBody:'UPSC', ministry:'DoPT',
    frequency:'Annual', level:'National', category:'Central Government',
    vacancies:'979', salary:'₹56,100+/month (IAS/IPS/IFS)',age:'21–32 years',
    education:'Any Graduate', negative:'-1/3 per wrong answer',
    stages:['Prelims (MCQ)','Mains (Written)','Personality Test (Interview)'],
    syllabus:['General Studies I-IV','CSAT','Optional Subject','Essay'],
    timeline:{ notification:'Feb 2026', form:'Mar 2026', prelims:'May 2026', mains:'Sep 2026', interview:'Mar 2027' },
    readiness:34, enrolled:true, color:'#7C3AED',
  },
}

const DEFAULT = {
  name:'Exam Detail', fullName:'Details loading...', emoji:'📄',
  conductingBody:'Various', ministry:'—', frequency:'Annual', level:'National',
  vacancies:'—', salary:'Varies', age:'Varies', education:'Varies', negative:'Varies',
  stages:['Stage 1','Stage 2'],
  syllabus:['Subject 1','Subject 2'],
  timeline:{}, readiness:0, enrolled:false, color:'#1E3A5F',
}

export default function ExamDetail() {
  const { examId } = useParams()
  const navigate   = useNavigate()
  const exam = EXAM_DATA[examId] || { ...DEFAULT, name: examId?.toUpperCase().replace(/-/g,' ') || 'Exam' }

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${exam.color},${exam.color}CC)`, borderRadius:24, padding:24, marginBottom:20, color:'#fff' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16, flexWrap:'wrap' }}>
          <span style={{ fontSize:44 }}>{exam.emoji}</span>
          <div>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:'clamp(20px,3vw,30px)' }}>{exam.name}</h1>
            <p style={{ opacity:.75, fontSize:13, marginTop:4 }}>{exam.fullName}</p>
          </div>
          {exam.enrolled && <span style={{ marginLeft:'auto', background:'rgba(255,255,255,0.2)', fontSize:12, fontWeight:700, padding:'5px 14px', borderRadius:20 }}>✅ Enrolled</span>}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10 }}>
          {[['💼',exam.vacancies,'Vacancies'],['💰',exam.salary,'Salary'],['🎂',exam.age,'Age Limit'],['📅',exam.frequency,'Frequency']].map(([e,v,l])=>(
            <div key={l} style={{ background:'rgba(255,255,255,0.12)', borderRadius:12, padding:'10px 8px', textAlign:'center' }}>
              <p style={{ fontSize:18 }}>{e}</p>
              <p style={{ fontWeight:800, fontSize:13, marginTop:4 }}>{v}</p>
              <p style={{ opacity:.6, fontSize:10 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        {[['🎯 Practice Now','/test-engine','#D4AF37','#1E3A5F'],['🗺️ My Roadmap',`/roadmap/${examId}`,'#1E3A5F','#fff'],['📊 My Analytics','/analytics','#22C55E','#fff']].map(([l,p,bg,c])=>(
          <button key={l} onClick={()=>navigate(p)} style={{ flex:1, minWidth:120, padding:'12px 16px', borderRadius:14, border:'none', background:bg, color:c, fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor:'pointer' }}>{l}</button>
        ))}
      </div>

      {/* Readiness */}
      {exam.readiness > 0 && (
        <div style={{ background:'#fff', borderRadius:20, padding:20, marginBottom:14, border:'1.5px solid #E2E8F0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F' }}>Your Readiness</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:exam.readiness>=70?'#22C55E':exam.readiness>=40?'#D4AF37':'#EF4444', fontSize:20 }}>{exam.readiness}%</p>
          </div>
          <div style={{ height:10, background:'#F1F5F9', borderRadius:5 }}>
            <div style={{ width:`${exam.readiness}%`, height:10, borderRadius:5, background:exam.readiness>=70?'#22C55E':exam.readiness>=40?'#D4AF37':'#EF4444' }}/>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap:14 }}>
        {/* Stages */}
        <div style={{ background:'#fff', borderRadius:20, padding:20, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:14 }}>📍 Exam Stages</p>
          {exam.stages.map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:`${exam.color}18`, border:`2px solid ${exam.color}`, display:'flex', alignItems:'center', justifyContent:'center', color:exam.color, fontWeight:800, fontSize:12, flexShrink:0 }}>{i+1}</div>
              <p style={{ color:'#1E293B', fontWeight:600, fontSize:14, paddingTop:4 }}>{s}</p>
            </div>
          ))}
        </div>

        {/* Syllabus */}
        <div style={{ background:'#fff', borderRadius:20, padding:20, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:14 }}>📚 Syllabus</p>
          {exam.syllabus.map((s,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ color:'#D4AF37', fontWeight:800 }}>▸</span>
              <p style={{ color:'#475569', fontSize:14 }}>{s}</p>
            </div>
          ))}
          <div style={{ background:'#FEF3C7', borderRadius:12, padding:'10px 14px', marginTop:10 }}>
            <p style={{ color:'#92400E', fontSize:12, fontWeight:600 }}>⚠️ Negative Marking: {exam.negative}</p>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ background:'#fff', borderRadius:20, padding:20, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:14 }}>📅 Important Dates</p>
          {Object.entries(exam.timeline).map(([k,v],i)=>(
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F8FAFC' }}>
              <p style={{ color:'#64748B', fontSize:13, textTransform:'capitalize' }}>{k.replace(/([A-Z])/g,' $1')}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:13 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
