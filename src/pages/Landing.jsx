// src/pages/Landing.jsx - TryIT Educations
// Professional landing page - Vidya Indigo brand
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Brand colors (hardcoded for landing - before ThemeContext loads)
const B = {
  primary: '#2D1B69',
  dark:    '#1A0D3D',
  accent:  '#F59E0B',
  accentL: '#FCD34D',
  white:   '#FFFFFF',
  text:    '#0F0A1E',
  muted:   '#6B7280',
  border:  '#E5E7EB',
  surface: '#FAFAFA',
  light:   '#F5F3FF', // indigo tinted bg
}

const EXAMS = ['UPSC CSE','SSC CGL','IBPS PO','TNPSC','NEET UG',
  'JEE Main','RRB NTPC','GATE','NDA/CDS','State PSC']

const NAV_LINKS = [
  {label:'Exams',     href:'/exams'},
  {label:'Mentors',   href:'/student/mentor'},
  {label:'Pricing',   href:'/pro'},
  {label:'Pulse',     href:'/bharat-pulse'},
]

const FEATURES = [
  {
    icon:'📚',
    title:'1 Crore Question Bank',
    desc:'Class 1 to PhD. Every subject, every topic, every difficulty level 1-10. 7-layer AI explanations that teach, not just answer.',
  },
  {
    icon:'🌐',
    title:'42 Indian Languages',
    desc:'Tamil, Hindi, Telugu, Bengali, Assamese and every scheduled Indian language. Northeast languages included. No student left behind.',
  },
  {
    icon:'📊',
    title:'Real All-India Rankings',
    desc:'After every test, see exactly where you stand. Track your improvement week over week. Compare with students in your state.',
  },
  {
    icon:'👨‍🏫',
    title:'1-to-1 Async Mentoring',
    desc:'Get a dedicated mentor for your exam. Daily assignments, doubt solving, unit tests - all without video calls. Works on 2G.',
  },
  {
    icon:'🏫',
    title:'Institution Management',
    desc:'Schools, coaching centres and tuition classes - manage halls, conduct live exams, track every student, share parent reports.',
  },
  {
    icon:'🎯',
    title:'Adaptive Learning Paths',
    desc:'AI identifies your weak topics and builds a personalised daily schedule. The platform learns as you study.',
  },
]

const PLANS = [
  {
    name:'Free',
    price:'₹0',
    period:'forever',
    color:B.muted,
    features:[
      'PYQ questions - unlimited',
      '5 AI explanations per 6 hours',
      'Daily current affairs',
      'All-India leaderboard',
      'Basic games and quizzes',
    ],
    cta:'Start Free',
    ctaPath:'/role-select',
    highlight:false,
  },
  {
    name:'Pro',
    price:'₹999',
    period:'per year',
    sub:'≈₹83/month',
    color:B.primary,
    features:[
      'Everything in Free',
      'All questions - AI + PYQ',
      'Unlimited 7-layer explanations',
      'Unlimited tests and mock exams',
      'All 24 preparation pathways',
      'All games and offline packs',
      '5 mentor doubts per month',
    ],
    cta:'Get Pro',
    ctaPath:'/pro',
    highlight:true,
    badge:'Most Popular',
  },
  {
    name:'Ultra',
    price:'₹1,499',
    period:'per year',
    sub:'≈₹125/month',
    color:'#7C3AED',
    features:[
      'Everything in Pro',
      'Concept learning Level 1-10',
      'All 24 preparation pathways',
      'Spaced repetition system',
      'Unlimited mentor doubts',
      'Priority doubt resolution',
      'Institution exam access',
    ],
    cta:'Go Ultra',
    ctaPath:'/pro',
    highlight:false,
    badge:'Coaching Replacement',
  },
]

const STATS = [
  {value:'1,10,000+', label:'Exam Pathways'},
  {value:'42',        label:'Indian Languages'},
  {value:'28/28',     label:'States Covered'},
  {value:'Class 1+',  label:'Primary to SWAYAM'},
]

function useInView(threshold=0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){setInView(true);obs.disconnect()}
    },{threshold})
    if(ref.current) obs.observe(ref.current)
    return ()=>obs.disconnect()
  },[threshold])
  return [ref, inView]
}

// --- Navbar ----------------------------------------------
function Navbar({nav}) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(()=>{
    const fn = ()=>setScrolled(window.scrollY>20)
    window.addEventListener('scroll',fn)
    return ()=>window.removeEventListener('scroll',fn)
  },[])

  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:1000,
      background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid '+B.border : 'none',
      transition:'all 0.3s ease',
      padding:'0 24px',
    }}>
      <div style={{maxWidth:1200,margin:'0 auto',height:64,
        display:'flex',alignItems:'center',gap:32}}>

        {/* Logo */}
        <div onClick={()=>nav('/')} style={{cursor:'pointer',display:'flex',
          alignItems:'center',gap:8,flexShrink:0}}>
          <div style={{width:32,height:32,borderRadius:8,
            background:'linear-gradient(135deg,'+B.primary+',#4C2D9C)',
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#fff',fontWeight:900,fontSize:14,
              fontFamily:'Plus Jakarta Sans,sans-serif'}}>T</span>
          </div>
          <div>
            <span style={{fontFamily:'Plus Jakarta Sans,sans-serif',
              fontWeight:800,fontSize:16,color:B.primary}}>TryIT</span>
            <span style={{fontFamily:'Plus Jakarta Sans,sans-serif',
              fontWeight:400,fontSize:12,color:B.muted,display:'block',
              lineHeight:1,marginTop:-2}}>Educations</span>
          </div>
        </div>

        {/* Desktop nav */}
        <div style={{display:'flex',gap:4,flex:1,
          '@media(max-width:768px)':{display:'none'}}}>
          {NAV_LINKS.map((link,i)=>(
            <button key={i} onClick={()=>nav(link.href)}
              style={{background:'transparent',border:'none',cursor:'pointer',
                padding:'8px 14px',borderRadius:8,color:B.muted,
                fontFamily:'Inter,sans-serif',fontSize:14,fontWeight:500,
                transition:'all 0.15s'}}
              onMouseEnter={e=>{e.target.style.color=B.primary;e.target.style.background=B.light}}
              onMouseLeave={e=>{e.target.style.color=B.muted;e.target.style.background='transparent'}}>
              {link.label}
            </button>
          ))}
        </div>

        {/* CTAs */}
        <div style={{display:'flex',gap:8,flexShrink:0}}>
          <button onClick={()=>nav('/login')}
            style={{background:'transparent',border:'1px solid '+B.border,
              borderRadius:10,padding:'8px 18px',color:B.text,
              fontFamily:'Inter,sans-serif',fontSize:14,fontWeight:500,
              cursor:'pointer',transition:'all 0.15s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=B.primary;e.currentTarget.style.color=B.primary}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=B.border;e.currentTarget.style.color=B.text}}>
            Login
          </button>
          <button onClick={()=>nav('/role-select')}
            style={{background:B.primary,border:'none',borderRadius:10,
              padding:'8px 18px',color:'#fff',fontFamily:'Inter,sans-serif',
              fontSize:14,fontWeight:600,cursor:'pointer',transition:'all 0.15s',
              boxShadow:'0 4px 14px rgba(45,27,105,0.3)'}}
            onMouseEnter={e=>{e.currentTarget.style.background=B.dark;e.currentTarget.style.transform='translateY(-1px)'}}
            onMouseLeave={e=>{e.currentTarget.style.background=B.primary;e.currentTarget.style.transform='translateY(0)'}}>
            Get Started →
          </button>
        </div>
      </div>
    </nav>
  )
}

// --- Hero -------------------------------------------------
function Hero({nav}) {
  return (
    <section style={{
      minHeight:'100vh',background:B.white,
      display:'flex',alignItems:'center',
      paddingTop:80,paddingBottom:80,
    }}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px',
        display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,420px),1fr))',gap:80,
        alignItems:'center'}}>

        {/* Left - Text */}
        <div>
          {/* Badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:6,
            background:B.light,border:'1px solid rgba(45,27,105,0.15)',
            borderRadius:20,padding:'6px 14px',marginBottom:24}}>
            <span style={{fontSize:12}}>🇮🇳</span>
            <span style={{color:B.primary,fontFamily:'Inter,sans-serif',
              fontSize:12,fontWeight:600}}>
              India's Most Complete Exam Prep Platform
            </span>
          </div>

          <h1 style={{
            fontFamily:'Plus Jakarta Sans,sans-serif',
            fontWeight:900,fontSize:'clamp(36px,4.5vw,56px)',
            color:B.text,margin:'0 0 20px',lineHeight:1.15,
            letterSpacing:'-0.03em',
          }}>
            Your Exam.<br/>
            Your Rank.<br/>
            <span style={{color:B.primary}}>Your Success.</span>
          </h1>

          <p style={{fontFamily:'Inter,sans-serif',fontSize:18,
            color:B.muted,margin:'0 0 32px',lineHeight:1.7,
            fontWeight:400}}>
            42 languages. 1,10,000+ exam pathways.
            From Class 1 Olympiads to PhD and SWAYAM.
            Every exam, every stage, one subscription.
          </p>

          {/* CTAs */}
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:32}}>
            <button onClick={()=>nav('/role-select')}
              style={{background:B.primary,border:'none',borderRadius:12,
                padding:'14px 28px',color:'#fff',
                fontFamily:'Inter,sans-serif',fontSize:16,fontWeight:600,
                cursor:'pointer',transition:'all 0.2s',
                boxShadow:'0 8px 24px rgba(45,27,105,0.35)'}}>
              Start for Free →
            </button>
            <button onClick={()=>nav('/pro')}
              style={{background:B.white,border:'1.5px solid '+B.border,
                borderRadius:12,padding:'14px 28px',color:B.text,
                fontFamily:'Inter,sans-serif',fontSize:16,fontWeight:500,
                cursor:'pointer',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=B.primary;e.currentTarget.style.color=B.primary}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=B.border;e.currentTarget.style.color=B.text}}>
              View Pricing
            </button>
          </div>

          {/* Social proof */}
          <p style={{fontFamily:'Inter,sans-serif',fontSize:13,
            color:B.muted,margin:0}}>
            Free for students · No credit card required ·
            Trusted from Kashmir to Kanyakumari
          </p>
        </div>

        {/* Right - Visual */}
        <div style={{position:'relative'}}>
          {/* Main card */}
          <div style={{background:B.primary,borderRadius:24,padding:28,
            boxShadow:'0 32px 80px rgba(45,27,105,0.3)',
            position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-40,right:-40,
              width:160,height:160,borderRadius:'50%',
              background:'rgba(245,158,11,0.15)'}}/>
            <div style={{position:'absolute',bottom:-20,left:-20,
              width:100,height:100,borderRadius:'50%',
              background:'rgba(255,255,255,0.05)'}}/>
            <p style={{color:'rgba(255,255,255,0.6)',fontFamily:'Inter,sans-serif',
              fontSize:11,fontWeight:600,letterSpacing:'2px',margin:'0 0 16px'}}>
              TODAY'S MOCK TEST
            </p>
            <p style={{color:'#fff',fontFamily:'Plus Jakarta Sans,sans-serif',
              fontWeight:700,fontSize:17,margin:'0 0 20px',lineHeight:1.4}}>
              Which Article of the Constitution deals with the Right to Equality?
            </p>
            {['Article 12','Article 14','Article 19','Article 21'].map((opt,i)=>(
              <div key={i} style={{
                background: i===1 ? B.accent+'25' : 'rgba(255,255,255,0.06)',
                border: i===1 ? '1.5px solid '+B.accent : '1.5px solid rgba(255,255,255,0.1)',
                borderRadius:10,padding:'11px 16px',marginBottom:8,
                display:'flex',alignItems:'center',gap:10,cursor:'pointer',
              }}>
                <div style={{width:20,height:20,borderRadius:'50%',
                  background: i===1 ? B.accent : 'rgba(255,255,255,0.15)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:10,fontWeight:700,
                  color: i===1 ? B.primary : 'rgba(255,255,255,0.5)',flexShrink:0}}>
                  {i===1?'✓':String.fromCharCode(65+i)}
                </div>
                <span style={{
                  color: i===1 ? B.accent : 'rgba(255,255,255,0.85)',
                  fontFamily:'Inter,sans-serif',fontSize:14,fontWeight: i===1?600:400,
                }}>
                  {opt}
                </span>
              </div>
            ))}
            <div style={{marginTop:16,background:'rgba(255,255,255,0.06)',
              borderRadius:10,padding:'12px 14px'}}>
              <p style={{color:B.accent,fontFamily:'Inter,sans-serif',
                fontSize:12,fontWeight:700,margin:'0 0 4px'}}>
                ✓ Correct - Article 14
              </p>
              <p style={{color:'rgba(255,255,255,0.6)',fontSize:11,margin:0,
                fontFamily:'Inter,sans-serif'}}>
                Article 14 guarantees equality before law and equal protection...
              </p>
            </div>
          </div>

          {/* Floating badge */}
          <div style={{position:'absolute',top:-16,right:-16,
            background:B.white,borderRadius:16,padding:'10px 14px',
            boxShadow:'0 8px 32px rgba(0,0,0,0.12)',
            border:'1px solid '+B.border}}>
            <p style={{fontFamily:'Inter,sans-serif',fontSize:10,
              color:B.muted,margin:'0 0 2px',fontWeight:600}}>YOUR RANK</p>
            <p style={{fontFamily:'Plus Jakarta Sans,sans-serif',
              fontWeight:800,fontSize:20,color:B.primary,margin:0}}>#2,847</p>
            <p style={{fontFamily:'Inter,sans-serif',fontSize:9,
              color:'#16A34A',margin:'2px 0 0',fontWeight:600}}>▲ 312 this week</p>
          </div>

          {/* Language badge */}
          <div style={{position:'absolute',bottom:-16,left:-16,
            background:B.white,borderRadius:16,padding:'10px 14px',
            boxShadow:'0 8px 32px rgba(0,0,0,0.12)',
            border:'1px solid '+B.border}}>
            <p style={{fontFamily:'Inter,sans-serif',fontSize:10,
              color:B.muted,margin:'0 0 4px',fontWeight:600}}>AVAILABLE IN</p>
            <div style={{display:'flex',gap:4,flexWrap:'wrap',maxWidth:120}}>
              {['EN','TA','HI','TE','ML','KN'].map(l=>(
                <span key={l} style={{background:B.light,
                  color:B.primary,fontSize:9,fontWeight:700,
                  padding:'2px 6px',borderRadius:4,
                  fontFamily:'Inter,sans-serif'}}>
                  {l}
                </span>
              ))}
              <span style={{color:B.muted,fontSize:9,fontFamily:'Inter,sans-serif',
                alignSelf:'center'}}>+36</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- Stats ------------------------------------------------
function Stats() {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} style={{background:B.primary,padding:'48px 24px'}}>
      <div style={{maxWidth:900,margin:'0 auto',
        display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,140px),1fr))',gap:0}}>
        {STATS.map((s,i)=>(
          <div key={i} style={{textAlign:'center',padding:'8px 16px',
            borderRight: i<3 ? '1px solid rgba(255,255,255,0.12)' : 'none'}}>
            <p style={{fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:900,
              fontSize:'clamp(28px,3.5vw,44px)',color:B.accent,
              margin:'0 0 4px',lineHeight:1,
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(10px)',
              transition:`all 0.5s ease ${i*0.1}s`}}>
              {s.value}
            </p>
            <p style={{fontFamily:'Inter,sans-serif',fontSize:13,
              color:'rgba(255,255,255,0.65)',margin:0,fontWeight:500}}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// --- Exam Trust -------------------------------------------
function ExamTrust() {
  return (
    <section style={{background:B.surface,padding:'64px 24px',
      borderTop:'1px solid '+B.border,borderBottom:'1px solid '+B.border}}>
      <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
        <p style={{fontFamily:'Inter,sans-serif',fontSize:12,fontWeight:600,
          color:B.muted,letterSpacing:'2px',margin:'0 0 28px'}}>
          COVERS EVERY MAJOR INDIAN EXAM
        </p>
        <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center'}}>
          {EXAMS.map((exam,i)=>(
            <span key={i} style={{
              background:B.white,border:'1px solid '+B.border,
              borderRadius:10,padding:'8px 16px',
              fontFamily:'Inter,sans-serif',fontSize:13,fontWeight:600,
              color:B.text,
            }}>
              {exam}
            </span>
          ))}
          <span style={{
            background:B.light,border:'1px solid rgba(45,27,105,0.2)',
            borderRadius:10,padding:'8px 16px',
            fontFamily:'Inter,sans-serif',fontSize:13,fontWeight:600,
            color:B.primary,
          }}>
            +1,09,990 more →
          </span>
        </div>
      </div>
    </section>
  )
}

// --- Features ---------------------------------------------
function Features() {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} style={{background:B.white,padding:'96px 24px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <h2 style={{fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:800,
            fontSize:'clamp(28px,3.5vw,42px)',color:B.text,
            margin:'0 0 16px',letterSpacing:'-0.02em'}}>
            Built for India. Built to last.
          </h2>
          <p style={{fontFamily:'Inter,sans-serif',fontSize:17,color:B.muted,
            margin:0,maxWidth:560,marginLeft:'auto',marginRight:'auto',lineHeight:1.7}}>
            Every feature designed for the Indian exam aspirant.
            No shortcuts. No compromises.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:24}}>
          {FEATURES.map((f,i)=>(
            <div key={i} style={{
              background:B.white,border:'1px solid '+B.border,
              borderRadius:16,padding:28,transition:'all 0.25s',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: `${i*0.08}s`,
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.borderColor='rgba(45,27,105,0.3)'
              e.currentTarget.style.boxShadow='0 8px 32px rgba(45,27,105,0.1)'
              e.currentTarget.style.transform='translateY(-4px)'
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderColor=B.border
              e.currentTarget.style.boxShadow='none'
              e.currentTarget.style.transform='translateY(0)'
            }}>
              <div style={{width:44,height:44,borderRadius:12,
                background:B.light,display:'flex',alignItems:'center',
                justifyContent:'center',fontSize:22,marginBottom:16}}>
                {f.icon}
              </div>
              <h3 style={{fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:700,
                fontSize:17,color:B.text,margin:'0 0 10px',letterSpacing:'-0.01em'}}>
                {f.title}
              </h3>
              <p style={{fontFamily:'Inter,sans-serif',fontSize:14,
                color:B.muted,margin:0,lineHeight:1.7}}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- Role Sections ----------------------------------------
function RoleSections({nav}) {
  const ROLES = [
    {
      tag:'For Students',
      title:'Study smarter. Rank higher.',
      desc:'Take unlimited tests, track your All-India rank in real time, earn coins for every correct answer, and unlock themes. Learn in your own language.',
      points:['Adaptive difficulty - L1 to L10','7-layer explanations after every question','Daily study streak with coin rewards','Community doubts answered by mentors'],
      cta:'Start Studying Free',
      ctaPath:'/role-select',
      side:'left',
      color:B.primary,
    },
    {
      tag:'For Mentors',
      title:'Teach. Earn. Scale.',
      desc:'One mentor can handle hundreds of students without a single video call. Post daily assignments, conduct tests, earn income while you sleep.',
      points:['Weekly and monthly student passes','Audio and PDF content delivery','Personal leaderboard and reputation','Cashback on every student subscription'],
      cta:'Become a Mentor',
      ctaPath:'/mentor-hub',
      side:'right',
      color:'#7C3AED',
    },
    {
      tag:'For Institutions',
      title:'Your classroom. Digitised.',
      desc:'Schools, coaching centres and tuition classes - manage multiple halls, conduct live exams for lakhs of students, and share automated parent reports.',
      points:['Multiple halls and batches','Live exam with auto-submit','Per-student performance graphs','WhatsApp-ready parent reports'],
      cta:'Register Institution',
      ctaPath:'/institution/register',
      side:'left',
      color:'#0891B2',
    },
    {
      tag:'For Families',
      title:'See everything. Guide better.',
      desc:'Track every child in one dashboard - questions done today, subjects strong and weak, and what needs work next. Full history from day one, downloadable anytime.',
      points:['All children in one dashboard','Daily activity and weak-topic tracking','Full history from join date','Download progress as PDF anytime'],
      cta:'Start Family Tracking',
      ctaPath:'/family',
      side:'right',
      color:'#DB2777',
    },
  ]

  return (
    <section style={{background:B.surface,padding:'0 0 96px'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}>
        {ROLES.map((role,i)=>{
          const [ref, inView] = useInView()
          return (
            <div key={i} ref={ref} style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,380px),1fr))',
              gap:64,alignItems:'center',
              padding:'80px 0',
              borderBottom: i<ROLES.length-1 ? '1px solid '+B.border : 'none',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(32px)',
              transition:'all 0.6s ease',
            }}>
              {/* Text - swap order for right */}
              <div style={{order: role.side==='right' ? 2 : 1}}>
                <span style={{
                  background: role.color+'15',
                  color: role.color,
                  fontFamily:'Inter,sans-serif',fontSize:12,fontWeight:700,
                  padding:'4px 12px',borderRadius:20,letterSpacing:'1px',
                  display:'inline-block',marginBottom:16,
                }}>
                  {role.tag.toUpperCase()}
                </span>
                <h2 style={{fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:800,
                  fontSize:'clamp(24px,3vw,36px)',color:B.text,
                  margin:'0 0 16px',letterSpacing:'-0.02em'}}>
                  {role.title}
                </h2>
                <p style={{fontFamily:'Inter,sans-serif',fontSize:16,color:B.muted,
                  margin:'0 0 24px',lineHeight:1.75}}>
                  {role.desc}
                </p>
                <div style={{marginBottom:28}}>
                  {role.points.map((pt,j)=>(
                    <div key={j} style={{display:'flex',gap:10,marginBottom:10,
                      alignItems:'flex-start'}}>
                      <div style={{width:20,height:20,borderRadius:'50%',
                        background:role.color+'15',flexShrink:0,marginTop:2,
                        display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <span style={{color:role.color,fontSize:10,fontWeight:700}}>✓</span>
                      </div>
                      <span style={{fontFamily:'Inter,sans-serif',fontSize:14,
                        color:B.text,lineHeight:1.5}}>{pt}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>nav(role.ctaPath)}
                  style={{background:role.color,border:'none',borderRadius:12,
                    padding:'13px 26px',color:'#fff',
                    fontFamily:'Inter,sans-serif',fontSize:15,fontWeight:600,
                    cursor:'pointer',transition:'all 0.2s',
                    boxShadow:`0 8px 24px ${role.color}40`}}>
                  {role.cta} →
                </button>
              </div>

              {/* Visual */}
              <div style={{order: role.side==='right' ? 1 : 2,
                background:`linear-gradient(135deg,${role.color},${role.color}cc)`,
                borderRadius:24,padding:32,minHeight:280,
                display:'flex',alignItems:'center',justifyContent:'center',
                position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:-20,right:-20,
                  width:100,height:100,borderRadius:'50%',
                  background:'rgba(255,255,255,0.1)'}}/>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:48,marginBottom:12}}>
                    {i===0?'📚':i===1?'👨‍🏫':'🏫'}
                  </div>
                  <p style={{color:'rgba(255,255,255,0.85)',
                    fontFamily:'Plus Jakarta Sans,sans-serif',
                    fontWeight:700,fontSize:16,margin:0}}>
                    {i===0?'3,40,000+ Students':''}
                    {i===1?'Earn ₹20,000+/month':''}
                    {i===2?'10 to 1 Lakh Students':''}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// --- Pricing ----------------------------------------------
function Pricing({nav}) {
  const [annual, setAnnual] = useState(true)
  return (
    <section style={{background:B.white,padding:'96px 24px'}}>
      <div style={{maxWidth:1000,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:800,
            fontSize:'clamp(28px,3.5vw,42px)',color:B.text,
            margin:'0 0 12px',letterSpacing:'-0.02em'}}>
            Simple, honest pricing
          </h2>
          <p style={{fontFamily:'Inter,sans-serif',fontSize:16,color:B.muted,
            margin:'0 0 24px'}}>
            87% cheaper than coaching. Same results. No compromise.
          </p>
          {/* Toggle */}
          <div style={{display:'inline-flex',background:B.surface,
            borderRadius:10,padding:4,border:'1px solid '+B.border}}>
            {['Monthly','Annual'].map((p,i)=>(
              <button key={i}
                onClick={()=>setAnnual(i===1)}
                style={{padding:'8px 20px',borderRadius:8,border:'none',cursor:'pointer',
                  fontFamily:'Inter,sans-serif',fontSize:14,fontWeight:600,
                  background: (i===1)===annual ? B.primary : 'transparent',
                  color: (i===1)===annual ? '#fff' : B.muted,
                  transition:'all 0.2s'}}>
                {p} {i===1&&<span style={{background:B.accent,color:B.primary,
                  fontSize:10,fontWeight:700,padding:'1px 6px',borderRadius:4,
                  marginLeft:4}}>50% OFF</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))',gap:20}}>
          {PLANS.map((plan,i)=>(
            <div key={i} style={{
              background: plan.highlight ? plan.color : B.white,
              border: plan.highlight ? `2px solid ${plan.color}` : '1px solid '+B.border,
              borderRadius:20,padding:28,
              boxShadow: plan.highlight ? `0 20px 60px ${plan.color}25` : 'none',
              position:'relative',transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
            }}>
              {plan.badge && (
                <div style={{position:'absolute',top:-12,left:'50%',
                  transform:'translateX(-50%)',
                  background: plan.highlight ? B.accent : plan.color,
                  color: plan.highlight ? B.primary : '#fff',
                  fontFamily:'Inter,sans-serif',fontSize:11,fontWeight:700,
                  padding:'4px 14px',borderRadius:20,whiteSpace:'nowrap'}}>
                  {plan.badge}
                </div>
              )}
              <p style={{fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:700,
                fontSize:18,color: plan.highlight ? '#fff' : B.text,
                margin:'0 0 4px'}}>
                {plan.name}
              </p>
              <p style={{fontFamily:'Plus Jakarta Sans,sans-serif',fontWeight:900,
                fontSize:36,color: plan.highlight ? '#fff' : B.text,
                margin:'0 0 4px',lineHeight:1}}>
                {annual && plan.price!=='₹0' ? plan.price : plan.price}
              </p>
              <p style={{fontFamily:'Inter,sans-serif',fontSize:13,
                color: plan.highlight ? 'rgba(255,255,255,0.7)' : B.muted,
                margin:'0 0 20px'}}>
                {plan.period} {plan.sub && `· ${plan.sub}`}
              </p>
              <div style={{marginBottom:24}}>
                {plan.features.map((f,j)=>(
                  <div key={j} style={{display:'flex',gap:8,marginBottom:8,
                    alignItems:'flex-start'}}>
                    <span style={{color: plan.highlight ? B.accent : '#16A34A',
                      fontSize:14,flexShrink:0,marginTop:1}}>✓</span>
                    <span style={{fontFamily:'Inter,sans-serif',fontSize:13,
                      color: plan.highlight ? 'rgba(255,255,255,0.85)' : B.text,
                      lineHeight:1.5}}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={()=>nav(plan.ctaPath)}
                style={{width:'100%',
                  background: plan.highlight ? B.accent : B.primary,
                  border:'none',borderRadius:12,padding:'13px',
                  color: plan.highlight ? B.primary : '#fff',
                  fontFamily:'Inter,sans-serif',fontSize:15,fontWeight:700,
                  cursor:'pointer',transition:'all 0.2s'}}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{textAlign:'center',fontFamily:'Inter,sans-serif',
          fontSize:13,color:B.muted,marginTop:24}}>
          1 Subscription = 1 Scholarship · Free for 9 vulnerable communities
        </p>
      </div>
    </section>
  )
}

// --- Footer -----------------------------------------------
function Footer({nav}) {
  const LINKS = {
    'Platform': [
      {l:'Exams',href:'/exams'},
      {l:'Mentors',href:'/student/mentor'},
      {l:'Institutions',href:'/institution/register'},
      {l:'Pricing',href:'/pro'},
      {l:'Bharat Pulse',href:'/bharat-pulse'},
    ],
    'Students': [
      {l:'Quick Test',href:'/student'},
      {l:'Leaderboard',href:'/leaderboard'},
      {l:'Games',href:'/games'},
      {l:'Career AI',href:'/student/career'},
      {l:'Scholarships',href:'/scholarships'},
    ],
    'Company': [
      {l:'About TryIT',href:'/landing'},
      {l:'Contact',href:'mailto:founder@tryiteducations.net'},
      {l:'Privacy Policy',href:'/privacy'},
      {l:'TatuLabs',href:'https://tatulabs.in'},
    ],
  }

  return (
    <footer style={{background:B.dark,padding:'64px 24px 32px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',
          gap:48,marginBottom:48}}>
          {/* Brand */}
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
              <div style={{width:32,height:32,borderRadius:8,
                background:'linear-gradient(135deg,'+B.accent+',#FCD34D)',
                display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{color:B.primary,fontWeight:900,fontSize:14,
                  fontFamily:'Plus Jakarta Sans,sans-serif'}}>T</span>
              </div>
              <span style={{color:'#fff',fontFamily:'Plus Jakarta Sans,sans-serif',
                fontWeight:800,fontSize:16}}>TryIT Educations</span>
            </div>
            <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Inter,sans-serif',
              fontSize:13,lineHeight:1.7,margin:'0 0 16px',maxWidth:240}}>
              Your Exam. Your Rank. Your Success.
              India's most complete exam prep platform.
            </p>
            <p style={{color:'rgba(255,255,255,0.35)',fontFamily:'Inter,sans-serif',
              fontSize:12,margin:0}}>
              🇮🇳 Made in India · Karur, Tamil Nadu
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links])=>(
            <div key={heading}>
              <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Inter,sans-serif',
                fontSize:11,fontWeight:700,letterSpacing:'1.5px',margin:'0 0 16px'}}>
                {heading.toUpperCase()}
              </p>
              {links.map((link,i)=>(
                <button key={i}
                  onClick={()=>link.href.startsWith('http')||link.href.startsWith('mailto')
                    ? window.open(link.href) : nav(link.href)}
                  style={{display:'block',background:'transparent',border:'none',
                    cursor:'pointer',padding:'4px 0',
                    color:'rgba(255,255,255,0.55)',fontFamily:'Inter,sans-serif',
                    fontSize:13,textAlign:'left',transition:'color 0.15s',
                    marginBottom:4}}
                  onMouseEnter={e=>{e.target.style.color='#fff'}}
                  onMouseLeave={e=>{e.target.style.color='rgba(255,255,255,0.55)'}}>
                  {link.l}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',
          paddingTop:24,display:'flex',justifyContent:'space-between',
          alignItems:'center',flexWrap:'wrap',gap:12}}>
          <p style={{color:'rgba(255,255,255,0.35)',fontFamily:'Inter,sans-serif',
            fontSize:12,margin:0}}>
            © 2026 TryIT Educations. All rights reserved.
            All uploaded content is assigned to TryIT Educations permanently.
          </p>
          <p style={{color:'rgba(255,255,255,0.35)',fontFamily:'Inter,sans-serif',
            fontSize:12,margin:0}}>
            founder@tryiteducations.net · +91 9566698821
          </p>
        </div>
      </div>
    </footer>
  )
}

// --- Main -------------------------------------------------
export default function Landing() {
  const nav = useNavigate()
  const { user } = useAuth()

  // Logged-in users go to their dashboard
  useEffect(()=>{
    if (!user) return
    const ROLE_HOME = {
      admin:       '/student',
      student:     '/student',
      mentor:      '/mentor-hub',
      institution: '/institution',
      family:      '/family',
    }
    const role = user.role || (user.is_mentor?'mentor':user.is_institution?'institution':'student')
    nav(ROLE_HOME[role]||'/student', {replace:true})
  },[user])

  return (
    <div style={{fontFamily:'Inter,sans-serif',overflowX:'hidden'}}>
      <Navbar nav={nav}/>
      <Hero nav={nav}/>
      <Stats/>
      <ExamTrust/>
      <Features/>
      <RoleSections nav={nav}/>
      <Pricing nav={nav}/>
      <Footer nav={nav}/>
    </div>
  )
}
