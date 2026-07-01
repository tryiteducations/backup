// src/pages/student/StudentMentor.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const MENTORS = [
  {id:1,name:'Dr. Kavitha Rajan',exam:'UPSC',subject:'Polity & GS',
   rating:4.9,students:48,lang:'Tamil, English',city:'Chennai',
   weekly:199,monthly:699,emoji:'🏛️',verified:true,
   bio:'IAS Officer (Retd). 20+ years experience. Specializes in GS Paper 2 & Essay.'},
  {id:2,name:'Suresh Menon',exam:'SSC CGL',subject:'Reasoning & Maths',
   rating:4.8,students:36,lang:'English, Hindi',city:'Kochi',
   weekly:149,monthly:499,emoji:'📐',verified:true,
   bio:'SSC Coaching Faculty. 500+ students cleared CGL. Known for shortcut techniques.'},
  {id:3,name:'Priya Chandran',exam:'TNPSC',subject:'Tamil & Polity',
   rating:4.9,students:52,lang:'Tamil',city:'Madurai',
   weekly:99,monthly:349,emoji:'🌿',verified:true,
   bio:'TNPSC Group 1 Qualifier. Tamil medium specialist. Daily assignments + tests.'},
  {id:4,name:'Ramesh Kumar',exam:'IBPS',subject:'Banking & Economy',
   rating:4.7,students:29,lang:'Hindi, English',city:'Hyderabad',
   weekly:149,monthly:499,emoji:'🏦',verified:true,
   bio:'Bank Manager, SBI. Insider perspective on banking awareness & interviews.'},
]

const PASS_COLORS = {weekly:'#3B82F6', monthly:'#8B5CF6'}

export default function StudentMentor() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'
  const isDark = theme?.isDark||false

  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [passType, setPassType] = useState('weekly')
  const [payMethod, setPayMethod] = useState('razorpay')

  const EXAMS = ['All','UPSC','SSC CGL','IBPS','TNPSC','RRB']
  const LANGS = ['All','Tamil','Hindi','English','Telugu','Malayalam']
  const [search, setSearch] = useState('')
  const [langFilter, setLangFilter] = useState('All')
  const [minRating, setMinRating] = useState(0)
  const [priceSort, setPriceSort] = useState('none')
  const filtered = MENTORS
    .filter(m2 => filter==='All' || m2.exam.includes(filter))
    .filter(m2 => langFilter==='All' || m2.lang.includes(langFilter))
    .filter(m2 => m2.rating >= minRating)
    .filter(m2 => !search || m2.name.toLowerCase().includes(search.toLowerCase()) ||
      m2.subject.toLowerCase().includes(search.toLowerCase()) ||
      m2.city.toLowerCase().includes(search.toLowerCase()) ||
      m2.exam.toLowerCase().includes(search.toLowerCase()))

  const MentorCard = ({mentor}) => (
    <div style={{background:c,border:'1.5px solid '+(selected?.id===mentor.id?a:b),
      borderRadius:18,padding:'20px',marginBottom:14,
      boxShadow:'0 2px 12px rgba(0,0,0,0.05)',transition:'all 0.2s',cursor:'pointer'}}
      onClick={()=>setSelected(selected?.id===mentor.id?null:mentor)}>

      <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
        <div style={{width:52,height:52,borderRadius:16,flexShrink:0,
          background:'linear-gradient(135deg,'+p+','+a+')',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:26}}>
          {mentor.emoji}
        </div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>{mentor.name}</p>
            {mentor.verified&&(
              <span style={{background:'#3B82F615',color:'#3B82F6',fontSize:9,
                fontWeight:700,padding:'2px 8px',borderRadius:20}}>✓ Verified</span>
            )}
            <span style={{color:'var(--color-accent, #F59E0B)',fontWeight:700,fontSize:12,marginLeft:'auto'}}>
              ★ {mentor.rating}
            </span>
          </div>
          <p style={{color:m,fontSize:12,margin:'0 0 6px'}}>
            {mentor.subject} · 📍 {mentor.city} · 🌐 {mentor.lang}
          </p>
          <p style={{color:m,fontSize:11,margin:'0 0 8px',lineHeight:1.5}}>{mentor.bio}</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}>
            <span style={{background:p+'10',color:p,fontSize:9,fontWeight:700,
              padding:'2px 8px',borderRadius:20}}>{mentor.exam}</span>
            <span style={{background:'#22C55E15',color:'#22C55E',fontSize:9,fontWeight:700,
              padding:'2px 8px',borderRadius:20}}>👥 {mentor.students} students</span>
          </div>

          {/* Pass options */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div style={{background:'#3B82F608',border:'1.5px solid '+(passType==='weekly'&&selected?.id===mentor.id?'#3B82F6':b),
              borderRadius:12,padding:'10px',cursor:'pointer',textAlign:'center'}}
              onClick={e=>{e.stopPropagation();setSelected(mentor);setPassType('weekly')}}>
              <p style={{color:'#3B82F6',fontWeight:800,fontSize:15,margin:'0 0 2px'}}>
                ₹{mentor.weekly}
              </p>
              <p style={{color:m,fontSize:10,margin:0}}>per week</p>
            </div>
            <div style={{background:'#8B5CF608',border:'1.5px solid '+(passType==='monthly'&&selected?.id===mentor.id?'#8B5CF6':b),
              borderRadius:12,padding:'10px',cursor:'pointer',textAlign:'center'}}
              onClick={e=>{e.stopPropagation();setSelected(mentor);setPassType('monthly')}}>
              <p style={{color:'#8B5CF6',fontWeight:800,fontSize:15,margin:'0 0 2px'}}>
                ₹{mentor.monthly}
              </p>
              <p style={{color:m,fontSize:10,margin:0}}>per month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment flow when selected */}
      {selected?.id===mentor.id&&(
        <div style={{marginTop:16,padding:'16px',background:isDark?'rgba(255,255,255,0.05)':bg,
          borderRadius:14,border:'1px solid '+b}}
          onClick={e=>e.stopPropagation()}>
          <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 10px'}}>
            Pay via:
          </p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
            {[
              {id:'razorpay',label:'💳 Razorpay',sub:'Cards, Net Banking, UPI'},
              {id:'upi',label:'📱 Google Pay / UPI',sub:'Direct UPI payment'},
            ].map(method=>(
              <button key={method.id} onClick={()=>setPayMethod(method.id)}
                style={{padding:'10px',borderRadius:12,border:'2px solid',cursor:'pointer',
                  textAlign:'left',transition:'all 0.2s',
                  borderColor:payMethod===method.id?a:b,
                  background:payMethod===method.id?a+'10':c}}>
                <p style={{color:t,fontWeight:600,fontSize:12,margin:'0 0 2px'}}>{method.label}</p>
                <p style={{color:m,fontSize:10,margin:0}}>{method.sub}</p>
              </button>
            ))}
          </div>
          <button style={{width:'100%',
            background:'linear-gradient(135deg,'+p+','+a+')',
            border:'none',borderRadius:14,padding:'14px',
            color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer',
            boxShadow:'0 4px 16px '+p+'33'}}>
            {passType==='weekly'?'Get Weekly Pass - ₹'+mentor.weekly:'Get Monthly Pass - ₹'+mentor.monthly}
          </button>
          <p style={{color:m,fontSize:10,textAlign:'center',margin:'8px 0 0'}}>
            Secure payment · Cancel anytime · Change mentor after 7 days
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',
          border:'1px solid '+b,borderRadius:10,padding:'6px 14px',
          color:m,fontSize:13,cursor:'pointer',fontWeight:600}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>👨‍🏫 Find a Mentor</h1>
          <p style={{color:m,fontSize:11,margin:0}}>
            Weekly or monthly · Cancel anytime · Change after 7 days
          </p>
        </div>
        <button onClick={()=>nav('/mentor-hub/leaderboard')}
          style={{background:'transparent',border:'1px solid '+b,borderRadius:10,
            padding:'6px 14px',color:p,fontSize:12,fontWeight:700,cursor:'pointer'}}>
          🏆 Top Mentors
        </button>
      </div>

      <div style={{padding:'20px',maxWidth:680,margin:'0 auto'}}>

        {/* How it works */}
        <div style={{background:'linear-gradient(135deg,'+p+','+p+'cc)',
          borderRadius:18,padding:'18px',marginBottom:20}}>
          <p style={{color:a,fontWeight:700,fontSize:11,letterSpacing:'1px',margin:'0 0 6px'}}>
            HOW MENTOR PASSES WORK
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {[{e:'📚',t:'Daily Assignments',s:'Notes, PDFs, HW every day'},
              {e:'📝',t:'Unit Tests',s:'Conducted by your mentor'},
              {e:'💬',t:'Doubt Priority',s:'Answered within 2 hours'}
            ].map((item,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.08)',borderRadius:12,padding:'10px',textAlign:'center'}}>
                <div style={{fontSize:20,marginBottom:4}}>{item.e}</div>
                <p style={{color:'#fff',fontWeight:600,fontSize:11,margin:'0 0 2px'}}>{item.t}</p>
                <p style={{color:'rgba(255,255,255,0.6)',fontSize:9,margin:0}}>{item.s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search box */}
        <div style={{position:'relative',marginBottom:12}}>
          <span style={{position:'absolute',left:14,top:'50%',
            transform:'translateY(-50%)',fontSize:16}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by name, subject, topic, city..."
            style={{width:'100%',padding:'11px 14px 11px 42px',borderRadius:14,
              border:'1.5px solid '+b,background:c,color:t,
              fontSize:13,outline:'none',fontFamily:'Poppins,sans-serif',
              boxSizing:'border-box'}}/>
        </div>

        {/* Language filter */}
        <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4,marginBottom:8}}>
          {LANGS.map(l=>(
            <button key={l} onClick={()=>setLangFilter(l)}
              style={{padding:'5px 12px',borderRadius:20,border:'none',cursor:'pointer',
                fontSize:11,fontWeight:700,flexShrink:0,
                background:langFilter===l?p+'15':'transparent',
                color:langFilter===l?p:m}}>
              🌐 {l}
            </button>
          ))}
          <select value={minRating} onChange={e=>setMinRating(Number(e.target.value))}
            style={{marginLeft:'auto',padding:'5px 10px',borderRadius:20,border:'1px solid '+b,
              background:c,color:t,fontSize:11,cursor:'pointer',outline:'none',flexShrink:0}}>
            <option value={0}>All Ratings</option>
            <option value={4.5}>4.5+ Stars</option>
            <option value={4.8}>4.8+ Stars</option>
          </select>
        </div>

        {/* Exam filter */}
        <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4,marginBottom:16}}>
          {EXAMS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:'7px 16px',borderRadius:20,border:'none',cursor:'pointer',
                fontSize:12,fontWeight:700,flexShrink:0,
                background:filter===f?'linear-gradient(135deg,'+p+','+a+')':'transparent',
                color:filter===f?'#fff':m}}>
              {f}
            </button>
          ))}
        </div>

        {filtered.map(mentor => <MentorCard key={mentor.id} mentor={mentor}/>)}
        <div style={{height:60}}/>
      </div>
    </div>
  )
}
