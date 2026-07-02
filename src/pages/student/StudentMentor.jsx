// src/pages/student/StudentMentor.jsx
// LinkedIn-style mentor/institution discovery with detailed profiles
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const MENTORS = [
  {
    id:1, name:'Dr. Kavitha Rajan', exam:'UPSC', subject:'Polity & GS',
    rating:4.9, students:48, lang:'Tamil, English', city:'Chennai',
    weekly:199, monthly:699, emoji:'🏛️', verified:true,
    bio:'IAS Officer (Retd). 20+ years experience. Specializes in GS Paper 2 & Essay.',
    topics:['Indian Polity','Governance','Essay Writing','Current Affairs'],
    solvedDoubts: 1247, testsConducted: 89, materialsUploaded: 156,
    postsShared: 34, joinedDate: '2024-03-15',
    publicInfo: {
      education: 'MA Political Science, University of Madras',
      achievements: ['IAS 1998 Batch','Former District Collector','UPSC Interview Panelist'],
      languages: ['Tamil','English','Hindi'],
      teachingStyle: 'Concept-first approach with real-world examples',
    },
    lockedInfo: {
      fullBio: 'Retired IAS officer with 20+ years of administrative experience. Specialized in mentoring UPSC aspirants with a focus on GS Paper 2 (Polity & Governance) and Essay writing. My students have consistently scored 130+ in GS papers.',
      schedule: 'Mon-Fri: 6PM-9PM | Sat: 10AM-1PM',
      successRate: '78% of monthly students cleared prelims',
      testimonials: [
        {name:'Arun K.',text:'Dr. Kavitha\'s polity notes are gold. Cleared UPSC in 2nd attempt.',rating:5},
        {name:'Priya S.',text:'Her essay feedback transformed my writing. Highly recommended.',rating:5},
      ],
    },
  },
  {
    id:2, name:'Suresh Menon', exam:'SSC CGL', subject:'Reasoning & Maths',
    rating:4.8, students:36, lang:'English, Hindi', city:'Kochi',
    weekly:149, monthly:499, emoji:'📐', verified:true,
    bio:'SSC Coaching Faculty. 500+ students cleared CGL. Known for shortcut techniques.',
    topics:['Quantitative Aptitude','Reasoning','Data Interpretation','Speed Maths'],
    solvedDoubts: 892, testsConducted: 67, materialsUploaded: 98,
    postsShared: 21, joinedDate: '2024-06-01',
    publicInfo: {
      education: 'B.Tech, NIT Calicut',
      achievements: ['500+ CGL Selections','Published 3 books on Reasoning'],
      languages: ['English','Hindi','Malayalam'],
      teachingStyle: 'Shortcut-focused with practice drills',
    },
    lockedInfo: {
      fullBio: 'SSC CGL specialist with 8 years of coaching experience. My unique shortcut methodology has helped over 500 students clear CGL Tier 2. I focus on speed and accuracy through daily practice drills.',
      schedule: 'Mon-Sat: 7PM-10PM',
      successRate: '85% of monthly students clear Tier 1',
      testimonials: [
        {name:'Ravi T.',text:'Suresh sir\'s reasoning tricks saved me 15 minutes in the exam.',rating:5},
      ],
    },
  },
  {
    id:3, name:'Priya Chandran', exam:'TNPSC', subject:'Tamil & Polity',
    rating:4.9, students:52, lang:'Tamil', city:'Madurai',
    weekly:99, monthly:349, emoji:'🌿', verified:true,
    bio:'TNPSC Group 1 Qualifier. Tamil medium specialist. Daily assignments + tests.',
    topics:['Tamil Literature','TNPSC Polity','General Studies','Current Affairs'],
    solvedDoubts: 1567, testsConducted: 112, materialsUploaded: 203,
    postsShared: 45, joinedDate: '2024-01-20',
    publicInfo: {
      education: 'MA Tamil Literature, Madurai Kamaraj University',
      achievements: ['TNPSC Group 1 Rank 23','TNPSC Group 2 Rank 5'],
      languages: ['Tamil','English'],
      teachingStyle: 'Tamil medium focus with bilingual support',
    },
    lockedInfo: {
      fullBio: 'TNPSC Group 1 qualifier with a passion for teaching in Tamil medium. I create daily assignments and conduct weekly tests to ensure consistent progress. My students have achieved top ranks in Group 1, 2, and 4 exams.',
      schedule: 'Mon-Fri: 5PM-8PM | Sun: 9AM-12PM',
      successRate: '82% of monthly students clear at least one TNPSC exam',
      testimonials: [
        {name:'Karthik M.',text:'Priya madam\'s Tamil notes are the best. Group 1 cleared!',rating:5},
        {name:'Lakshmi R.',text:'Daily assignments kept me disciplined. Thank you!',rating:5},
      ],
    },
  },
  {
    id:4, name:'Ramesh Kumar', exam:'IBPS', subject:'Banking & Economy',
    rating:4.7, students:29, lang:'Hindi, English', city:'Hyderabad',
    weekly:149, monthly:499, emoji:'🏦', verified:true,
    bio:'Bank Manager, SBI. Insider perspective on banking awareness & interviews.',
    topics:['Banking Awareness','Economy','Financial Awareness','Interview Prep'],
    solvedDoubts: 634, testsConducted: 45, materialsUploaded: 72,
    postsShared: 18, joinedDate: '2024-08-10',
    publicInfo: {
      education: 'MBA Finance, ICFAI Hyderabad',
      achievements: ['SBI Manager 12 years','IBPS PO 2010 Batch'],
      languages: ['Hindi','English','Telugu'],
      teachingStyle: 'Practical banking insights with mock interviews',
    },
    lockedInfo: {
      fullBio: 'Current SBI Bank Manager with insider knowledge of banking exams. I provide practical insights into banking awareness, economy, and interview preparation. My mock interviews simulate real IBPS panel experiences.',
      schedule: 'Tue-Sun: 8PM-10PM',
      successRate: '75% of monthly students clear IBPS PO mains',
      testimonials: [
        {name:'Sunil P.',text:'Ramesh sir\'s banking awareness sessions are unmatched.',rating:4},
      ],
    },
  },
  {
    id:5, name:'Ananya Institute', exam:'JEE', subject:'Physics & Chemistry',
    rating:4.6, students:120, lang:'English, Hindi', city:'Delhi',
    weekly:299, monthly:999, emoji:'🏫', verified:true,
    bio:'Premier JEE coaching institute. 15+ years legacy. 2000+ IIT selections.',
    topics:['Physics','Chemistry','Mathematics','JEE Advanced'],
    solvedDoubts: 4521, testsConducted: 340, materialsUploaded: 512,
    postsShared: 89, joinedDate: '2023-11-01',
    publicInfo: {
      education: 'Team of IIT/NIT alumni',
      achievements: ['2000+ IIT Selections','5000+ NIT Selections','Best Institute Award 2025'],
      languages: ['English','Hindi'],
      teachingStyle: 'Structured curriculum with daily practice',
    },
    lockedInfo: {
      fullBio: 'Established in 2010, Ananya Institute has been a pioneer in JEE coaching. Our team of IIT alumni provides comprehensive preparation with daily tests, personalized doubt sessions, and performance tracking.',
      schedule: 'Mon-Sat: 8AM-8PM (multiple batches)',
      successRate: '92% of monthly students qualify JEE Main',
      testimonials: [
        {name:'Vikram S.',text:'The structured approach helped me crack JEE Advanced.',rating:5},
        {name:'Neha G.',text:'Best physics faculty. Concepts became crystal clear.',rating:5},
      ],
    },
  },
  {
    id:6, name:'Dr. Amit Sharma', exam:'NEET', subject:'Biology',
    rating:4.9, students:65, lang:'Hindi, English', city:'Jaipur',
    weekly:249, monthly:799, emoji:'🧬', verified:true,
    bio:'MBBS, MD. NEET Biology specialist. 800+ medical selections.',
    topics:['Botany','Zoology','Human Physiology','Genetics'],
    solvedDoubts: 2103, testsConducted: 156, materialsUploaded: 289,
    postsShared: 56, joinedDate: '2024-02-14',
    publicInfo: {
      education: 'MBBS & MD, SMS Medical College Jaipur',
      achievements: ['800+ Medical Selections','NEET AIR 12 (own score)'],
      languages: ['Hindi','English','Rajasthani'],
      teachingStyle: 'Diagram-based learning with mnemonics',
    },
    lockedInfo: {
      fullBio: 'Practicing doctor and NEET Biology mentor. My diagram-based approach and unique mnemonics make Biology the easiest subject. I provide chapter-wise tests and full syllabus mock tests every week.',
      schedule: 'Mon-Fri: 7PM-10PM | Sun: 10AM-4PM',
      successRate: '88% of monthly students score 300+ in Biology',
      testimonials: [
        {name:'Rohit J.',text:'Dr. Amit\'s mnemonics are legendary. Biology became my strongest subject.',rating:5},
      ],
    },
  },
]

const INSTITUTIONS = [
  {
    id:101, name:'Sri Vidya Academy', exam:'TNPSC, UPSC', type:'Coaching Center',
    rating:4.5, students:340, lang:'Tamil, English', city:'Chennai',
    weekly:399, monthly:1299, emoji:'🏛️', verified:true,
    bio:'Leading TNPSC & UPSC coaching center in Chennai. 25+ years of excellence.',
    topics:['TNPSC Group 1','UPSC Prelims','TNPSC Group 2','General Studies'],
    solvedDoubts: 8921, testsConducted: 678, materialsUploaded: 1200,
    postsShared: 234, joinedDate: '2023-06-01',
    publicInfo: {
      education: 'Team of 25+ experienced faculty',
      achievements: ['5000+ Government Job Selections','ISO Certified','Awarded Best Institute 2024'],
      languages: ['Tamil','English'],
      teachingStyle: 'Classroom + Online hybrid model',
    },
    lockedInfo: {
      fullBio: 'Sri Vidya Academy has been the trusted name in TNPSC and UPSC coaching for over 25 years. With a team of 25+ experienced faculty members, we provide comprehensive coaching with daily tests, current affairs updates, and personalized mentoring.',
      schedule: 'Mon-Sat: 7AM-9PM (multiple batches)',
      successRate: '78% success rate in TNPSC Group exams',
      testimonials: [
        {name:'Mohan R.',text:'The study material is comprehensive and exam-focused.',rating:5},
        {name:'Divya K.',text:'Weekend tests helped me track my progress effectively.',rating:4},
      ],
    },
  },
]

const ALL_PROFILES = [...MENTORS, ...INSTITUTIONS]

const EXAMS = ['All','UPSC','SSC CGL','IBPS','TNPSC','RRB','JEE','NEET','CAT','GATE']
const LANGS = ['All','Tamil','Hindi','English','Telugu','Malayalam','Kannada','Bengali']
const TOPICS = ['All','Polity','Maths','Reasoning','Biology','Physics','Chemistry','Banking','Economy','Tamil','GS','Essay']
const CITIES = ['All','Chennai','Kochi','Madurai','Hyderabad','Delhi','Jaipur','Bangalore','Mumbai']
const SORT_OPTIONS = [
  {id:'rating',label:'⭐ Highest Rated'},
  {id:'students',label:'👥 Most Students'},
  {id:'newest',label:'🆕 New Members'},
  {id:'doubts',label:'💬 Most Doubts Solved'},
  {id:'price_low',label:'💰 Price: Low to High'},
  {id:'price_high',label:'💰 Price: High to Low'},
]

export default function StudentMentor() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'
  const isDark = theme?.isDark||false

  const [filter, setFilter] = useState('All')
  const [topicFilter, setTopicFilter] = useState('All')
  const [cityFilter, setCityFilter] = useState('All')
  const [langFilter, setLangFilter] = useState('All')
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('rating')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [passType, setPassType] = useState('weekly')
  const [payMethod, setPayMethod] = useState('razorpay')
  const [showProfile, setShowProfile] = useState(null) // Full profile view
  const [profileTab, setProfileTab] = useState('about') // about | stats | materials | reviews
  const [isMonthlyStudent, setIsMonthlyStudent] = useState(false) // Simulated - would come from auth

  // Filtering
  let filtered = ALL_PROFILES
    .filter(m2 => filter==='All' || m2.exam.includes(filter))
    .filter(m2 => topicFilter==='All' || m2.topics?.some(tp=>tp.toLowerCase().includes(topicFilter.toLowerCase())))
    .filter(m2 => cityFilter==='All' || m2.city===cityFilter)
    .filter(m2 => langFilter==='All' || m2.lang.includes(langFilter))
    .filter(m2 => m2.rating >= minRating)
    .filter(m2 => !search || m2.name.toLowerCase().includes(search.toLowerCase()) ||
      m2.subject.toLowerCase().includes(search.toLowerCase()) ||
      m2.city.toLowerCase().includes(search.toLowerCase()) ||
      m2.exam.toLowerCase().includes(search.toLowerCase()) ||
      m2.topics?.some(tp=>tp.toLowerCase().includes(search.toLowerCase())))

  // Sorting
  if (sortBy === 'rating') filtered.sort((a,b) => b.rating - a.rating)
  else if (sortBy === 'students') filtered.sort((a,b) => b.students - a.students)
  else if (sortBy === 'newest') filtered.sort((a,b) => new Date(b.joinedDate) - new Date(a.joinedDate))
  else if (sortBy === 'doubts') filtered.sort((a,b) => b.solvedDoubts - a.solvedDoubts)
  else if (sortBy === 'price_low') filtered.sort((a,b) => a.monthly - b.monthly)
  else if (sortBy === 'price_high') filtered.sort((a,b) => b.monthly - a.monthly)

  const isInstitution = (profile) => profile.type === 'Coaching Center'

  // Full Profile Modal
  const ProfileModal = () => {
    if (!showProfile) return null
    const prof = showProfile
    const isInst = isInstitution(prof)
    const canSeeAll = isMonthlyStudent

    return (
      <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.7)',
        display:'flex',alignItems:'center',justifyContent:'center',padding:20,
        backdropFilter:'blur(4px)'}}
        onClick={()=>setShowProfile(null)}>
        <div style={{background:c,borderRadius:24,width:'100%',maxWidth:700,
          maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.3)'}}
          onClick={e=>e.stopPropagation()}>

          {/* Cover */}
          <div style={{height:140,background:`linear-gradient(135deg,${p},${a})`,
            borderRadius:'24px 24px 0 0',position:'relative'}}>
            <button onClick={()=>setShowProfile(null)}
              style={{position:'absolute',top:12,right:12,background:'rgba(0,0,0,0.3)',
                border:'none',borderRadius:'50%',width:32,height:32,color:'#fff',
                fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',
                justifyContent:'center'}}>✕</button>
          </div>

          {/* Avatar */}
          <div style={{textAlign:'center',marginTop:-45,marginBottom:16}}>
            <div style={{width:90,height:90,borderRadius:'50%',margin:'0 auto',
              background:`linear-gradient(135deg,${p},${a})`,
              border:`4px solid ${c}`,display:'flex',alignItems:'center',
              justifyContent:'center',fontSize:40,boxShadow:'0 4px 20px rgba(0,0,0,0.15)'}}>
              {prof.emoji}
            </div>
          </div>

          {/* Name & Badge */}
          <div style={{textAlign:'center',padding:'0 24px',marginBottom:16}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:4}}>
              <h2 style={{color:t,fontWeight:800,fontSize:20,margin:0}}>{prof.name}</h2>
              {prof.verified && <span style={{color:'#3B82F6',fontSize:18}}>✓</span>}
            </div>
            <p style={{color:m,fontSize:13,margin:'0 0 6px'}}>
              {isInst ? prof.type : prof.subject} · 📍 {prof.city}
            </p>
            <div style={{display:'flex',justifyContent:'center',gap:6,flexWrap:'wrap'}}>
              <span style={{color:'var(--color-accent, #F59E0B)',fontWeight:700,fontSize:14}}>★ {prof.rating}</span>
              <span style={{color:m,fontSize:12}}>·</span>
              <span style={{color:m,fontSize:12}}>👥 {prof.students} students</span>
              <span style={{color:m,fontSize:12}}>·</span>
              <span style={{color:m,fontSize:12}}>🌐 {prof.lang}</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:'flex',borderBottom:`1px solid ${b}`,padding:'0 24px',gap:0}}>
            {[
              {id:'about',label:'About'},
              {id:'stats',label:'Stats'},
              {id:'materials',label:'Materials',locked:true},
              {id:'reviews',label:'Reviews',locked:true},
            ].map(tab=>(
              <button key={tab.id} onClick={()=>setProfileTab(tab.id)}
                style={{padding:'10px 16px',border:'none',background:'transparent',
                  cursor:'pointer',fontSize:13,fontWeight:700,
                  color:profileTab===tab.id?a:m,
                  borderBottom:profileTab===tab.id?`3px solid ${a}`:'3px solid transparent',
                  transition:'all 0.15s'}}>
                {tab.label}
                {tab.locked && !canSeeAll && <span style={{fontSize:10,marginLeft:4}}>🔒</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{padding:'20px 24px'}}>
            {profileTab === 'about' && (
              <div>
                <p style={{color:t,fontSize:14,lineHeight:1.7,margin:'0 0 16px'}}>
                  {canSeeAll ? prof.lockedInfo.fullBio : prof.bio}
                </p>

                <div style={{marginBottom:16}}>
                  <h4 style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 8px'}}>🎓 Education</h4>
                  <p style={{color:m,fontSize:13,margin:0}}>{prof.publicInfo.education}</p>
                </div>

                <div style={{marginBottom:16}}>
                  <h4 style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 8px'}}>🏆 Achievements</h4>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {prof.publicInfo.achievements.map((ach,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{color:a,fontSize:14}}>✦</span>
                        <span style={{color:m,fontSize:13}}>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom:16}}>
                  <h4 style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 8px'}}>🗣️ Languages</h4>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {prof.publicInfo.languages.map((l,i)=>(
                      <span key={i} style={{background:`${a}15`,color:a,fontSize:11,
                        fontWeight:700,padding:'4px 10px',borderRadius:20}}>{l}</span>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom:16}}>
                  <h4 style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 8px'}}>📖 Teaching Style</h4>
                  <p style={{color:m,fontSize:13,margin:0}}>{prof.publicInfo.teachingStyle}</p>
                </div>

                {canSeeAll && (
                  <div style={{marginBottom:16}}>
                    <h4 style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 8px'}}>📅 Schedule</h4>
                    <p style={{color:m,fontSize:13,margin:0}}>{prof.lockedInfo.schedule}</p>
                  </div>
                )}

                {!canSeeAll && (
                  <div style={{background:`${a}10`,border:`1px solid ${a}30`,borderRadius:14,
                    padding:'16px',textAlign:'center',marginTop:16}}>
                    <p style={{color:a,fontWeight:700,fontSize:13,margin:'0 0 4px'}}>🔒 Monthly Students Only</p>
                    <p style={{color:m,fontSize:12,margin:'0 0 12px'}}>
                      Get a monthly pass to see full bio, schedule, success rates, and testimonials
                    </p>
                    <button onClick={()=>{setShowProfile(null);setSelected(prof)}}
                      style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',
                        borderRadius:12,padding:'10px 24px',color:'#fff',fontWeight:700,
                        fontSize:13,cursor:'pointer'}}>
                      Get Monthly Pass - ₹{prof.monthly}
                    </button>
                  </div>
                )}
              </div>
            )}

            {profileTab === 'stats' && (
              <div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                  {[
                    {label:'Doubts Solved',value:prof.solvedDoubts.toLocaleString('en-IN'),icon:'💬',color:'#3B82F6'},
                    {label:'Tests Conducted',value:prof.testsConducted.toLocaleString('en-IN'),icon:'📝',color:'#22C55E'},
                    {label:'Materials',value:prof.materialsUploaded.toLocaleString('en-IN'),icon:'📚',color:'#8B5CF6'},
                    {label:'Posts Shared',value:prof.postsShared.toLocaleString('en-IN'),icon:'📰',color:'#F59E0B'},
                  ].map((s,i)=>(
                    <div key={i} style={{background:bg,borderRadius:14,padding:'14px',
                      border:`1px solid ${b}`,textAlign:'center'}}>
                      <div style={{fontSize:24,marginBottom:4}}>{s.icon}</div>
                      <p style={{color:s.color,fontWeight:900,fontSize:20,margin:'0 0 2px'}}>{s.value}</p>
                      <p style={{color:m,fontSize:11,margin:0}}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div style={{marginBottom:16}}>
                  <h4 style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 8px'}}>📅 Member Since</h4>
                  <p style={{color:m,fontSize:13,margin:0}}>
                    {new Date(prof.joinedDate).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}
                  </p>
                </div>

                {canSeeAll && (
                  <div style={{marginBottom:16}}>
                    <h4 style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 8px'}}>📈 Success Rate</h4>
                    <p style={{color:'#22C55E',fontWeight:700,fontSize:16,margin:0}}>{prof.lockedInfo.successRate}</p>
                  </div>
                )}

                {!canSeeAll && (
                  <div style={{background:`${a}10`,border:`1px solid ${a}30`,borderRadius:14,
                    padding:'16px',textAlign:'center',marginTop:16}}>
                    <p style={{color:a,fontWeight:700,fontSize:13,margin:'0 0 4px'}}>🔒 Monthly Students Only</p>
                    <p style={{color:m,fontSize:12,margin:'0 0 12px'}}>
                      Success rates and detailed stats are visible to monthly students
                    </p>
                  </div>
                )}
              </div>
            )}

            {profileTab === 'materials' && (
              canSeeAll ? (
                <div>
                  <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 12px'}}>
                    📚 {prof.materialsUploaded} Materials Available
                  </p>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {['Complete Study Notes','Practice Question Bank','Previous Year Papers','Formula Sheets','Mind Maps','Revision Notes'].map((mat,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:10,
                        padding:'10px 14px',background:bg,borderRadius:12,
                        border:`1px solid ${b}`,cursor:'pointer'}}>
                        <span style={{fontSize:20}}>{['📄','📝','📋','📐','🧠','📑'][i]}</span>
                        <span style={{color:t,fontSize:13,fontWeight:600,flex:1}}>{mat}</span>
                        <span style={{color:a,fontSize:11,fontWeight:700}}>View →</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{textAlign:'center',padding:'40px 20px'}}>
                  <p style={{fontSize:48,margin:'0 0 12px'}}>🔒</p>
                  <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 8px'}}>
                    Materials visible to monthly students only
                  </p>
                  <p style={{color:m,fontSize:13,margin:'0 0 16px'}}>
                    Get a monthly pass to access all study materials, notes, and question banks
                  </p>
                  <button onClick={()=>{setShowProfile(null);setSelected(prof)}}
                    style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',
                      borderRadius:12,padding:'10px 24px',color:'#fff',fontWeight:700,
                      fontSize:13,cursor:'pointer'}}>
                    Get Monthly Pass - ₹{prof.monthly}
                  </button>
                </div>
              )
            )}

            {profileTab === 'reviews' && (
              canSeeAll ? (
                <div>
                  <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 12px'}}>
                    ⭐ Student Testimonials
                  </p>
                  {prof.lockedInfo.testimonials.map((test,i)=>(
                    <div key={i} style={{background:bg,borderRadius:14,padding:'14px',
                      border:`1px solid ${b}`,marginBottom:10}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <div style={{width:32,height:32,borderRadius:'50%',
                          background:`linear-gradient(135deg,${p},${a})`,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          color:'#fff',fontWeight:700,fontSize:13}}>
                          {test.name[0]}
                        </div>
                        <div>
                          <p style={{color:t,fontWeight:600,fontSize:13,margin:0}}>{test.name}</p>
                          <p style={{color:'var(--color-accent, #F59E0B)',fontSize:11,margin:0}}>
                            {'★'.repeat(test.rating)}{'☆'.repeat(5-test.rating)}
                          </p>
                        </div>
                      </div>
                      <p style={{color:m,fontSize:12,margin:0,lineHeight:1.6}}>"{test.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign:'center',padding:'40px 20px'}}>
                  <p style={{fontSize:48,margin:'0 0 12px'}}>🔒</p>
                  <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 8px'}}>
                    Reviews visible to monthly students only
                  </p>
                  <p style={{color:m,fontSize:13,margin:'0 0 16px'}}>
                    Get a monthly pass to read student testimonials and success stories
                  </p>
                  <button onClick={()=>{setShowProfile(null);setSelected(prof)}}
                    style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',
                      borderRadius:12,padding:'10px 24px',color:'#fff',fontWeight:700,
                      fontSize:13,cursor:'pointer'}}>
                    Get Monthly Pass - ₹{prof.monthly}
                  </button>
                </div>
              )
            )}
          </div>

          {/* Bottom CTA */}
          <div style={{padding:'16px 24px',borderTop:`1px solid ${b}`,
            display:'flex',gap:10,justifyContent:'center'}}>
            <button onClick={()=>{setShowProfile(null);setSelected(prof);setPassType('weekly')}}
              style={{background:'transparent',border:`1.5px solid ${b}`,borderRadius:14,
                padding:'10px 20px',color:t,fontWeight:700,fontSize:13,cursor:'pointer'}}>
              Weekly ₹{prof.weekly}
            </button>
            <button onClick={()=>{setShowProfile(null);setSelected(prof);setPassType('monthly')}}
              style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',
                borderRadius:14,padding:'10px 24px',color:'#fff',fontWeight:700,
                fontSize:13,cursor:'pointer'}}>
              Monthly ₹{prof.monthly}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Mentor Card (list view)
  const MentorCard = ({mentor}) => {
    const isInst = isInstitution(mentor)
    return (
      <div style={{background:c,border:'1.5px solid '+(selected?.id===mentor.id?a:b),
        borderRadius:18,padding:'20px',marginBottom:14,
        boxShadow:'0 2px 12px rgba(0,0,0,0.05)',transition:'all 0.2s',cursor:'pointer'}}
        onClick={()=>setShowProfile(mentor)}>

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
              {isInst && (
                <span style={{background:'#8B5CF615',color:'#8B5CF6',fontSize:9,
                  fontWeight:700,padding:'2px 8px',borderRadius:20}}>🏫 Institution</span>
              )}
              <span style={{color:'var(--color-accent, #F59E0B)',fontWeight:700,fontSize:12,marginLeft:'auto'}}>
                ★ {mentor.rating}
              </span>
            </div>
            <p style={{color:m,fontSize:12,margin:'0 0 6px'}}>
              {isInst ? mentor.type : mentor.subject} · 📍 {mentor.city} · 🌐 {mentor.lang}
            </p>
            <p style={{color:m,fontSize:11,margin:'0 0 8px',lineHeight:1.5}}>{mentor.bio}</p>

            {/* Topics */}
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
              <span style={{background:p+'10',color:p,fontSize:9,fontWeight:700,
                padding:'2px 8px',borderRadius:20}}>{mentor.exam}</span>
              {mentor.topics?.slice(0,3).map((tp,i)=>(
                <span key={i} style={{background:'#22C55E10',color:'#22C55E',fontSize:9,fontWeight:700,
                  padding:'2px 8px',borderRadius:20}}>{tp}</span>
              ))}
              <span style={{background:'#3B82F610',color:'#3B82F6',fontSize:9,fontWeight:700,
                padding:'2px 8px',borderRadius:20}}>👥 {mentor.students} students</span>
            </div>

            {/* Quick stats */}
            <div style={{display:'flex',gap:12,marginBottom:10}}>
              <span style={{color:m,fontSize:10}}>💬 {mentor.solvedDoubts} doubts</span>
              <span style={{color:m,fontSize:10}}>📝 {mentor.testsConducted} tests</span>
              <span style={{color:m,fontSize:10}}>📚 {mentor.materialsUploaded} materials</span>
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
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      {/* Header */}
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10,
        boxShadow:'0 1px 12px rgba(0,0,0,0.06)'}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',
          border:'1px solid '+b,borderRadius:10,padding:'6px 14px',
          color:m,fontSize:13,cursor:'pointer',fontWeight:600}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>👨‍🏫 Find a Mentor</h1>
          <p style={{color:m,fontSize:11,margin:0}}>
            Weekly or monthly · Cancel anytime · Change after 7 days
          </p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <label style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}>
            <span style={{color:m,fontSize:11}}>Demo: Monthly Student</span>
            <input type="checkbox" checked={isMonthlyStudent}
              onChange={e=>setIsMonthlyStudent(e.target.checked)}
              style={{cursor:'pointer'}}/>
          </label>
        </div>
      </div>

      <div style={{padding:'20px',maxWidth:800,margin:'0 auto'}}>

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
            placeholder="Search by name, subject, topic, city, exam..."
            style={{width:'100%',padding:'11px 14px 11px 42px',borderRadius:14,
              border:'1.5px solid '+b,background:c,color:t,
              fontSize:13,outline:'none',fontFamily:'Poppins,sans-serif',
              boxSizing:'border-box'}}/>
        </div>

        {/* Exam filter */}
        <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4,marginBottom:8,
          scrollbarWidth:'none',msOverflowStyle:'none'}}>
          {EXAMS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:'6px 14px',borderRadius:20,border:'none',cursor:'pointer',
                fontSize:11,fontWeight:700,flexShrink:0,
                background:filter===f?'linear-gradient(135deg,'+p+','+a+')':'transparent',
                color:filter===f?'#fff':m}}>
              {f}
            </button>
          ))}
        </div>

        {/* Topic filter */}
        <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4,marginBottom:8,
          scrollbarWidth:'none',msOverflowStyle:'none'}}>
          {TOPICS.map(tp=>(
            <button key={tp} onClick={()=>setTopicFilter(tp)}
              style={{padding:'5px 12px',borderRadius:20,border:'none',cursor:'pointer',
                fontSize:11,fontWeight:700,flexShrink:0,
                background:topicFilter===tp?p+'15':'transparent',
                color:topicFilter===tp?p:m}}>
              📖 {tp}
            </button>
          ))}
        </div>

        {/* Language + City + Rating + Sort filters */}
        <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4,marginBottom:8,
          scrollbarWidth:'none',msOverflowStyle:'none',alignItems:'center'}}>
          {LANGS.map(l=>(
            <button key={l} onClick={()=>setLangFilter(l)}
              style={{padding:'5px 12px',borderRadius:20,border:'none',cursor:'pointer',
                fontSize:11,fontWeight:700,flexShrink:0,
                background:langFilter===l?p+'15':'transparent',
                color:langFilter===l?p:m}}>
              🌐 {l}
            </button>
          ))}
          <span style={{color:m,fontSize:11,flexShrink:0,margin:'0 4px'}}>|</span>
          {CITIES.map(ct=>(
            <button key={ct} onClick={()=>setCityFilter(ct)}
              style={{padding:'5px 12px',borderRadius:20,border:'none',cursor:'pointer',
                fontSize:11,fontWeight:700,flexShrink:0,
                background:cityFilter===ct?p+'15':'transparent',
                color:cityFilter===ct?p:m}}>
              📍 {ct}
            </button>
          ))}
          <span style={{color:m,fontSize:11,flexShrink:0,margin:'0 4px'}}>|</span>
          <select value={minRating} onChange={e=>setMinRating(Number(e.target.value))}
            style={{padding:'5px 10px',borderRadius:20,border:'1px solid '+b,
              background:c,color:t,fontSize:11,cursor:'pointer',outline:'none',flexShrink:0}}>
            <option value={0}>All Ratings</option>
            <option value={4.5}>4.5+ ⭐</option>
            <option value={4.8}>4.8+ ⭐</option>
          </select>
          <span style={{color:m,fontSize:11,flexShrink:0,margin:'0 4px'}}>|</span>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
            style={{padding:'5px 10px',borderRadius:20,border:'1px solid '+b,
              background:c,color:t,fontSize:11,cursor:'pointer',outline:'none',flexShrink:0}}>
            {SORT_OPTIONS.map(opt=>(
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p style={{color:m,fontSize:11,margin:'0 0 12px'}}>
          {filtered.length} {filtered.length===1?'mentor':'mentors'} found
          {filter!=='All'&&` for ${filter}`}
          {topicFilter!=='All'&&` · ${topicFilter}`}
          {cityFilter!=='All'&&` · ${cityFilter}`}
        </p>

        {/* Mentor cards */}
        {filtered.map(mentor => <MentorCard key={mentor.id} mentor={mentor}/>)}

        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'40px 20px'}}>
            <p style={{fontSize:48,margin:'0 0 12px'}}>🔍</p>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 8px'}}>No mentors found</p>
            <p style={{color:m,fontSize:13,margin:0}}>Try adjusting your filters or search terms</p>
          </div>
        )}

        <div style={{height:60}}/>
      </div>

      {/* Profile Modal */}
      <ProfileModal />
    </div>
  )
}