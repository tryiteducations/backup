// src/pages/bharat-pulse/BharatPulse.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const ROLE_BADGE = {
  student:     { label:'Student',     color:'#3B82F6', bg:'#EFF6FF' },
  mentor:      { label:'Mentor',      color:'var(--color-accent, #C9A84C)', bg:'#FFFBEB' },
  institution: { label:'Institution', color:'#8B5CF6', bg:'#F5F3FF' },
  family:      { label:'Family',      color:'#22C55E', bg:'#F0FDF4' },
  admin:       { label:'TryIT',       color:'#EF4444', bg:'#FEF2F2' },
}

const CATEGORIES = ['All','Exam Alert','Study Tip','Success Story','Current Affairs','Discussion','Recruitment']

const PULSE_DATA = [
  {
    id:1, featured:true,
    title:'UPSC CSE 2026 - Final Result Declared. 1,016 candidates recommended',
    body:'Union Public Service Commission has declared the final result of Civil Services Examination 2026. IFS 2026 results also announced simultaneously. Check your roll number on upsc.gov.in',
    category:'Exam Alert', role:'institution',
    author:'TryIT Editorial', authorCity:'New Delhi',
    time:'2 hours ago', reactions:{fire:284,love:156,insight:89,wow:201,thanks:134},
    image:'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80',
    verified:true, trending:'featured',
  },
  {
    id:2,
    title:'SSC CGL Tier 2 2025 Admit Card Released - Exam on 18-19 Jan 2026',
    body:'Staff Selection Commission has released the admit card for CGL Tier 2 examination. Download from ssc.nic.in using registration number and date of birth.',
    category:'Exam Alert', role:'mentor',
    author:'Suresh Menon', authorCity:'Kochi',
    time:'4 hours ago', reactions:{fire:156,love:89,insight:42,wow:67,thanks:98},
    image:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    verified:true, trending:'rising',
  },
  {
    id:3,
    title:'How I scored 98.4 percentile in CAT 2025 while working full time',
    body:'I used TryIT for 90 days alongside my 9-to-5 job. Key strategy: 2 hours daily strictly, focus on weak areas only, mock tests every Sunday. Your consistency beats your competitor\'s intensity.',
    category:'Success Story', role:'student',
    author:'Rahul Verma', authorCity:'Bangalore',
    time:'6 hours ago', reactions:{fire:423,love:312,insight:178,wow:389,thanks:267},
    image:'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    verified:false, trending:'featured',
  },
  {
    id:4,
    title:'TNPSC Group 1 2026 Notification - 98 posts, application from March 1',
    body:'Tamil Nadu Public Service Commission has released official notification for Group 1 services recruitment. Online applications open March 1 to April 10, 2026.',
    category:'Recruitment', role:'institution',
    author:'Sri Vidya Academy', authorCity:'Chennai',
    time:'8 hours ago', reactions:{fire:201,love:134,insight:67,wow:89,thanks:156},
    image:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    verified:true, trending:'rising',
  },
  {
    id:5,
    title:'3 Polity shortcuts that helped me attempt 28/35 GS questions in UPSC Prelims',
    body:'After failing twice, I discovered that mapping Articles to Schedules visually beats reading line by line. Here\'s my proven diagram method that saves 40% revision time.',
    category:'Study Tip', role:'mentor',
    author:'Dr. Kavitha Rajan', authorCity:'Chennai',
    time:'10 hours ago', reactions:{fire:334,love:212,insight:198,wow:145,thanks:289},
    image:'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
    verified:true, trending:'featured',
  },
  {
    id:6,
    title:'RRB NTPC 2025 CBT-1 Result to be declared this week - official confirmation',
    body:'Railway Recruitment Board has confirmed that CBT-1 results for NTPC cycle 8 will be declared by end of this week. Shortlisted candidates will be called for CBT-2.',
    category:'Exam Alert', role:'student',
    author:'Anjali Sharma', authorCity:'Lucknow',
    time:'12 hours ago', reactions:{fire:178,love:98,insight:56,wow:134,thanks:112},
    image:'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=800&q=80',
    verified:false, trending:'',
  },
]

const TICKER_ITEMS = [
  '🔴 UPSC CSE 2026 Final Result Declared',
  '📋 SSC CGL Tier 2 Admit Card Released',
  '🎯 TNPSC Group 1 2026 - Applications Open March 1',
  '🏆 CAT 2025 Toppers List Published',
  '📌 RRB NTPC CBT-1 Result This Week',
  '⚡ IBPS PO 2026 Notification Expected February',
  '🌟 JEE Main Session 1 Registrations Close Jan 30',
  '📚 NEET UG 2026 NTA Bulletin Released',
]

const EMOJIS = [
  {k:'fire',e:'🔥',label:'Fire'},
  {k:'love',e:'❤️',label:'Love'},
  {k:'insight',e:'💡',label:'Insight'},
  {k:'wow',e:'😮',label:'Wow'},
  {k:'thanks',e:'🙏',label:'Thanks'},
]

// eslint-disable-next-line no-unused-vars
function TrendBadge({trend}) {
  if (!trend) return null
  const cfg = {
    featured:{label:'⭐ Featured',bg:'linear-gradient(135deg,#F59E0B,#EF4444)',color:'#fff'},
    rising:  {label:'🔥 Rising', bg:'linear-gradient(135deg,#EF4444,#EC4899)',color:'#fff'},
  }
  const c = cfg[trend]
  if (!c) return null
  return (
    <span style={{background:c.bg,color:c.color,fontSize:10,fontWeight:700,
      padding:'3px 10px',borderRadius:20,letterSpacing:'0.5px'}}>
      {c.label}
    </span>
  )
}

export default function BharatPulse() {
  const nav = useNavigate()
  const { user } = useAuth()
  const { theme } = useTheme()
  const p = theme?.primary||'#2D1B69', a = theme?.accent||'#F59E0B'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', surf = theme?.surface||'#FFFFFF'
    const b = theme?.border||'#E2E8F0'

  const HERO_THEMES = [
    { from:'#0F0A1E', mid:'#2D1B69', to:'#1A0D3D', label:'Indigo Night' },
    { from:'#1A0D3D', mid:'#78350F', to:'#0F0A1E', label:'Amber Dusk' },
    { from:'#0F0A1E', mid:'#4C1D95', to:'#1A0D3D', label:'Royal Purple' },
    { from:'#1A0D3D', mid:'#831843', to:'#0F0A1E', label:'Midnight Rose' },
  ]
  const [heroThemeIdx, setHeroThemeIdx] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setHeroThemeIdx(i => (i + 1) % HERO_THEMES.length), 20000)
    return () => clearInterval(iv)
  }, [])
  const heroTheme = HERO_THEMES[heroThemeIdx]

  const downloadStoryPDF = (post) => {
    const w = window.open('', '_blank')
    if (!w) return
    const html = '<html><head><title>' + post.title + ' - Bharat Pulse</title>'
      + '<style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:0 20px;color:#1A0D3D;}'
      + 'h1{font-size:24px;border-bottom:3px solid #F59E0B;padding-bottom:12px;}'
      + '.meta{color:#666;font-size:13px;margin-bottom:20px;}'
      + 'img{width:100%;border-radius:8px;margin-bottom:20px;}'
      + 'p{line-height:1.7;font-size:15px;}'
      + '.footer{margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:11px;color:#999;}'
      + '</style></head><body>'
      + '<h1>' + post.title + '</h1>'
      + '<div class="meta">By ' + post.author + ' - ' + post.authorCity + ' - ' + post.time + ' - Bharat Pulse</div>'
      + (post.image ? ('<img src="' + post.image + '"/>') : '')
      + '<p>' + post.body + '</p>'
      + '<div class="footer">Downloaded from TryIT Educations - Bharat Pulse - tryiteducations.net/bharat-pulse</div>'
      + '</body></html>'
    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 300)
  }

  const [posts, setPosts] = useState(PULSE_DATA)
  const [cat, setCat] = useState('All')
  const [showSubmit, setShowSubmit] = useState(false)
  const [dupWarning, setDupWarning] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({title:'',body:'',category:'Study Tip'})
  const [formImages, setFormImages] = useState([])
  const MAX_FORM_IMAGES = 7
  const [showPastEntries, setShowPastEntries] = useState(false)
  const [pastPage, setPastPage] = useState(1)
  const PAST_PER_PAGE = 6
  // eslint-disable-next-line no-unused-vars
  const [tickerPos, setTickerPos] = useState(0)
  const tickerRef = useRef(null)

  // Ticker animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerPos(prev => {
        const el = tickerRef.current
        if (!el) return prev
        const newPos = prev - 1
        if (Math.abs(newPos) > el.scrollWidth / 2) return 0
        return newPos
      })
    }, 20)
    return () => clearInterval(interval)
  }, [])

  const filtered = cat === 'All' ? posts : posts.filter(p2 => p2.category === cat)
  const featured = filtered.filter(p2 => p2.trending === 'featured')
  const rest = filtered.filter(p2 => p2.trending !== 'featured')

  const react = (id, emoji) => {
    setPosts(prev => prev.map(p2 =>
      p2.id === id ? {...p2, reactions:{...p2.reactions,
        [emoji]:(p2.reactions[emoji]||0)+1}} : p2
    ))
  }

  const checkDup = (title) => {
    if (title.length < 5) { setDupWarning(''); return }
    const words = title.toLowerCase().split(' ').filter(w=>w.length>3)
    const match = posts.find(p2 => words.filter(w=>p2.title.toLowerCase().includes(w)).length >= 3)
    if (match) setDupWarning('Similar content already posted: "'+match.title.slice(0,60)+'..."')
    else setDupWarning('')
  }

  const roleInfo = ROLE_BADGE[user?.role||'student']

  const pastPosts = posts.slice(PAST_PER_PAGE)
  const paginatedPast = pastPosts.slice(0, pastPage * PAST_PER_PAGE)
  const hasMorePast = paginatedPast.length < pastPosts.length

  const handleFormImageSelect = (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_FORM_IMAGES - formImages.length)
    const newImages = files.map(file => ({ file, url: URL.createObjectURL(file) }))
    setFormImages(prev => [...prev, ...newImages].slice(0, MAX_FORM_IMAGES))
    e.target.value = ''
  }

  const removeFormImage = (idx) => {
    setFormImages(prev => prev.filter((_, i) => i !== idx))
  }

  const CardHover = {
    transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    cursor:'pointer',
  }

  // eslint-disable-next-line no-unused-vars
  const PulseCard = ({post, large=false}) => {
    const rb = ROLE_BADGE[post.role]||ROLE_BADGE.student
    const total = Object.values(post.reactions).reduce((s,v)=>s+v,0)
    const [hovered, setHovered] = useState(false)
    return (
      <div
        onMouseEnter={e=>{setHovered(true);e.currentTarget.style.transform='translateY(-6px) scale(1.01)';e.currentTarget.style.boxShadow='0 20px 60px rgba(0,0,0,0.15)'}}
        onMouseLeave={e=>{setHovered(false);e.currentTarget.style.transform='translateY(0) scale(1)';e.currentTarget.style.boxShadow='0 2px 20px rgba(0,0,0,0.06)'}}
        style={{...CardHover,background:surf,borderRadius:20,overflow:'hidden',
          boxShadow:'0 2px 20px rgba(0,0,0,0.06)',
          border:'1px solid '+b, gridColumn: large ? 'span 2' : 'span 1'}}>

        {/* Image */}
        {post.image && (
          <div style={{position:'relative',height:large?240:160,overflow:'hidden'}}>
            <img src={post.image} alt={post.title}
              style={{width:'100%',height:'100%',objectFit:'cover',
                transition:'transform 6s ease',
                transform:hovered?'scale(1.08)':'scale(1)'}}/>
            <div style={{position:'absolute',inset:0,
              background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)'}}/>
            <div style={{position:'absolute',bottom:12,left:12,right:12,
              display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
              <TrendBadge trend={post.trending}/>
              <span style={{background:'rgba(0,0,0,0.5)',color:'#fff',
                fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20,
                backdropFilter:'blur(4px)'}}>
                {post.category}
              </span>
            </div>
          </div>
        )}

        <div style={{padding:large?'20px':'14px'}}>
          {/* Author */}
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <div style={{width:32,height:32,borderRadius:'50%',flexShrink:0,
              background:'linear-gradient(135deg,'+p+','+a+')',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontWeight:700,fontSize:13,color:'#fff'}}>
              {post.author[0]}
            </div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{color:t,fontWeight:700,fontSize:12}}>{post.author}</span>
                {post.verified && (
                  <span style={{color:'#3B82F6',fontSize:11}}>✓</span>
                )}
              </div>
              <span style={{color:m,fontSize:10}}>
                📍 {post.authorCity} · {post.time}
              </span>
            </div>
            <span style={{background:rb.bg,color:rb.color,fontSize:9,
              fontWeight:700,padding:'2px 8px',borderRadius:20,flexShrink:0}}>
              {rb.label}
            </span>
          </div>

          {/* Content */}
          <h3 style={{color:t,fontWeight:800,
            fontSize:large?17:14,margin:'0 0 8px',lineHeight:1.4}}>
            {post.title}
          </h3>
          <p style={{color:m,fontSize:12,margin:'0 0 14px',lineHeight:1.6,
            display:'-webkit-box',WebkitLineClamp:large?4:3,
            WebkitBoxOrient:'vertical',overflow:'hidden'}}>
            {post.body}
          </p>

          {/* Reactions */}
          <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                        {EMOJIS.map(({k,e})=>(
              <button key={k} onClick={()=>react(post.id,k)}
                style={{background:bg,border:'1px solid '+b,
                  borderRadius:20,padding:'4px 10px',cursor:'pointer',
                  display:'flex',alignItems:'center',gap:4,
                  fontFamily:'Poppins,sans-serif',transition:'all 0.15s'}}
                onMouseEnter={x=>{x.currentTarget.style.background=a+'15';x.currentTarget.style.borderColor=a}}
                onMouseLeave={x=>{x.currentTarget.style.background=bg;x.currentTarget.style.borderColor=b}}>
                <span style={{fontSize:14}}>{e}</span>
                <span style={{color:t,fontWeight:700,fontSize:11}}>
                  {post.reactions[k]||0}
                </span>
              </button>
            ))}
            <button onClick={()=>downloadStoryPDF(post)}
              style={{marginLeft:'auto',background:'transparent',border:'1px solid '+b,
                borderRadius:20,padding:'4px 10px',cursor:'pointer',color:m,
                fontSize:10,fontWeight:700,fontFamily:'Poppins,sans-serif'}}>
              PDF
            </button>
            <span style={{color:m,fontSize:10,fontWeight:600}}>
              {total.toLocaleString('en-IN')} reactions
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>

      {/* Animated CSS */}
      <style>{`
        @keyframes ticker { 0%{transform:translateX(100vw)} 100%{transform:translateX(-100%)} }
        @keyframes pulse-glow { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes gradient-shift {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }
        .ticker-wrap { overflow:hidden; white-space:nowrap; }
        .ticker-inner { display:inline-block; animation:ticker 40s linear infinite; }
        .pulse-card:hover { transform:translateY(-6px); }
      `}</style>

      {/* HERO HEADER */}
      <div style={{
        background:`linear-gradient(135deg, ${heroTheme.from} 0%, ${heroTheme.mid} 40%, ${heroTheme.to} 70%, ${heroTheme.from} 100%)`,
        backgroundSize:'400% 400%',animation:'gradient-shift 8s ease infinite',
        padding:'0 0 32px',position:'relative',overflow:'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{position:'absolute',top:-60,right:-60,width:300,height:300,
          borderRadius:'50%',background:'radial-gradient(circle,rgba(201,168,76,0.15),transparent)',
          animation:'float 6s ease-in-out infinite'}}/>
        <div style={{position:'absolute',bottom:-40,left:-40,width:200,height:200,
          borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.2),transparent)',
          animation:'float 8s ease-in-out infinite reverse'}}/>

        {/* Nav */}
        <div style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:12,
          position:'relative',zIndex:2}}>
          <button onClick={()=>nav(-1)}
            style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',
              borderRadius:10,padding:'6px 14px',color:'#fff',fontSize:13,cursor:'pointer'}}>
            ← Back
          </button>
          <div style={{flex:1,textAlign:'center'}}>
            <span style={{color:a,fontWeight:900,fontSize:11,letterSpacing:'4px'}}>
              BHARAT PULSE
            </span>
          </div>
          <button onClick={()=>window.print()}
            style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',
              borderRadius:12,padding:'9px 14px',color:'#fff',fontWeight:700,fontSize:13,
              cursor:'pointer',marginRight:8}}>
            Download PDF
          </button>
          <button onClick={()=>setShowSubmit(true)}
            style={{background:'linear-gradient(135deg,'+a+',#FCD34D)',
              border:'none',borderRadius:12,padding:'9px 18px',
              color:'#1A0D3D',fontWeight:800,fontSize:13,cursor:'pointer'}}>
            + Share Story
          </button>
        </div>

        {/* Hero title */}
        <div style={{textAlign:'center',padding:'24px 20px 20px',position:'relative',zIndex:2}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',
            gap:12,marginBottom:12}}>
            <div style={{height:1,width:60,background:'rgba(255,255,255,0.2)'}}/>
            <span style={{color:'rgba(255,255,255,0.5)',fontSize:11,letterSpacing:'2px'}}>
              INDIA'S EXAM PULSE
            </span>
            <div style={{height:1,width:60,background:'rgba(255,255,255,0.2)'}}/>
          </div>
          <h1 style={{color:'#fff',fontWeight:900,fontSize:32,margin:'0 0 8px',
            textShadow:'0 4px 20px rgba(0,0,0,0.5)',letterSpacing:'-0.5px'}}>
            🇮🇳 Bharat Pulse
          </h1>
          <p style={{color:'rgba(255,255,255,0.65)',fontSize:14,margin:'0 0 20px'}}>
            Real stories · Real results · Real India
          </p>

          {/* Live indicator */}
          <div style={{display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',
            borderRadius:20,padding:'6px 16px'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#EF4444',
              animation:'pulse-glow 1.5s ease-in-out infinite'}}/>
            <span style={{color:'#FCA5A5',fontSize:12,fontWeight:700}}>
              LIVE · {posts.length} stories today
            </span>
          </div>
        </div>

        {/* Breaking ticker */}
        <div style={{background:'rgba(239,68,68,0.2)',borderTop:'1px solid rgba(239,68,68,0.3)',
          borderBottom:'1px solid rgba(239,68,68,0.3)',padding:'10px 0',
          position:'relative',zIndex:2}}>
          <div style={{display:'flex',alignItems:'center',gap:0}}>
            <div style={{background:'#EF4444',padding:'4px 16px',flexShrink:0,
              fontWeight:800,fontSize:11,color:'#fff',letterSpacing:'1px'}}>
              BREAKING
            </div>
            <div className="ticker-wrap" style={{flex:1,overflow:'hidden'}}>
              <div className="ticker-inner">
                {[...TICKER_ITEMS,...TICKER_ITEMS].map((item,i)=>(
                  <span key={i} style={{color:'rgba(255,255,255,0.9)',fontSize:12,
                    fontWeight:600,marginRight:60}}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{display:'flex',gap:8,overflowX:'auto',padding:'16px 20px 0',
          position:'relative',zIndex:2,
          scrollbarWidth:'none',msOverflowStyle:'none'}}>
          {CATEGORIES.map(c2=>(
            <button key={c2} onClick={()=>setCat(c2)}
              style={{padding:'8px 18px',borderRadius:20,border:'1.5px solid',
                cursor:'pointer',fontSize:12,fontWeight:700,flexShrink:0,
                transition:'all 0.2s',
                borderColor:cat===c2?a:'rgba(255,255,255,0.2)',
                background:cat===c2?a:'rgba(255,255,255,0.08)',
                color:cat===c2?'#0F2140':'rgba(255,255,255,0.8)'}}>
              {c2}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:'24px 20px',maxWidth:1100,margin:'0 auto'}}>

        {/* Stats bar */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
          gap:10,marginBottom:24}}>
          {[
            {l:'Stories Today', v:posts.length,   e:'📰'},
            {l:'Total Reactions',v:'2,847',        e:'🔥'},
            {l:'Contributors',  v:'142',            e:'✍️'},
            {l:'States Covered',v:'28',             e:'🗺️'},
          ].map((s,i)=>(
            <div key={i} style={{background:surf,border:'1px solid '+b,
              borderRadius:14,padding:'14px',textAlign:'center',
              boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{fontSize:20,marginBottom:4}}>{s.e}</div>
              <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 2px'}}>{s.v}</p>
              <p style={{color:m,fontSize:10,margin:0}}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Featured grid */}
        {featured.length > 0 && (
          <>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <div style={{height:3,width:4,borderRadius:2,background:a}}/>
              <p style={{color:t,fontWeight:800,fontSize:16,margin:0}}>
                ⭐ Featured Stories
              </p>
            </div>
            <div style={{display:'grid',
              gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
              gap:16,marginBottom:28}}>
              {featured.map((post,i)=>(
                <PulseCard key={post.id} post={post} large={i===0}/>
              ))}
            </div>
          </>
        )}

        {/* Rising + rest */}
        {rest.length > 0 && (
          <>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <div style={{height:3,width:4,borderRadius:2,background:'#EF4444'}}/>
              <p style={{color:t,fontWeight:800,fontSize:16,margin:0}}>
                🔥 Latest Stories
              </p>
            </div>
            <div style={{display:'grid',
              gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',
              gap:16}}>
              {rest.map(post=>(
                <PulseCard key={post.id} post={post}/>
              ))}
            </div>
          </>
        )}

        {/* Past entries toggle */}
        <div style={{textAlign:'center',marginTop:24,marginBottom:16}}>
          <button onClick={()=>{setShowPastEntries(!showPastEntries);setPastPage(1)}}
            style={{background:'transparent',border:'1.5px solid '+b,borderRadius:14,
              padding:'12px 28px',color:t,fontWeight:700,fontSize:13,cursor:'pointer',
              display:'inline-flex',alignItems:'center',gap:8}}>
            {showPastEntries ? '📂 Hide Past Entries' : '📂 View Past Bharat Pulse Entries'}
            <span style={{color:m,fontSize:11}}>({pastPosts.length} entries)</span>
          </button>
        </div>

        {showPastEntries && (
          <>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <div style={{height:3,width:4,borderRadius:2,background:'#8B5CF6'}}/>
              <p style={{color:t,fontWeight:800,fontSize:16,margin:0}}>
                📚 Past Entries
              </p>
            </div>
            <div style={{display:'grid',
              gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',
              gap:16}}>
              {paginatedPast.map(post=>(
                <PulseCard key={post.id} post={post}/>
              ))}
            </div>
            {hasMorePast && (
              <div style={{textAlign:'center',marginTop:16}}>
                <button onClick={()=>setPastPage(p2=>p2+1)}
                  style={{background:'linear-gradient(135deg,'+p+','+a+')',
                    border:'none',borderRadius:14,padding:'12px 28px',
                    color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
                  Load More Entries
                </button>
              </div>
            )}
          </>
        )}

        <div style={{height:40}}/>
      </div>

      {/* SUBMIT MODAL */}
      {showSubmit && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',
          zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',
          padding:20,backdropFilter:'blur(4px)'}}
          onClick={()=>setShowSubmit(false)}>
          <div style={{background:surf,borderRadius:24,padding:28,
            width:'100%',maxWidth:500,
            boxShadow:'0 24px 80px rgba(0,0,0,0.3)',
            maxHeight:'90vh',overflowY:'auto'}}
            onClick={e=>e.stopPropagation()}>

            <div style={{display:'flex',alignItems:'center',
              justifyContent:'space-between',marginBottom:20}}>
              <h2 style={{color:t,fontWeight:800,fontSize:18,margin:0}}>
                Share with Bharat Pulse
              </h2>
              <button onClick={()=>setShowSubmit(false)}
                style={{background:'transparent',border:'none',
                  fontSize:20,cursor:'pointer',color:m}}>✕</button>
            </div>

            {/* Role indicator */}
            <div style={{display:'flex',alignItems:'center',gap:8,
              background:bg,borderRadius:12,padding:'10px 14px',marginBottom:16}}>
              <div style={{width:32,height:32,borderRadius:'50%',
                background:'linear-gradient(135deg,'+p+','+a+')',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontWeight:700,color:'#fff',fontSize:14}}>
                {user?.name?.[0]||'U'}
              </div>
              <div>
                <p style={{color:t,fontWeight:600,fontSize:13,margin:'0 0 2px'}}>
                  {user?.name||'You'}
                </p>
                <span style={{background:roleInfo?.bg||'#EFF6FF',
                  color:roleInfo?.color||'#3B82F6',
                  fontSize:9,fontWeight:700,padding:'1px 8px',borderRadius:20}}>
                  {roleInfo?.label||'Student'}
                </span>
              </div>
            </div>

            {/* Category */}
            <div style={{marginBottom:14}}>
              <p style={{color:t,fontWeight:700,fontSize:12,margin:'0 0 8px'}}>
                Category
              </p>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {CATEGORIES.filter(c2=>c2!=='All').map(c2=>(
                  <button key={c2} onClick={()=>setForm({...form,category:c2})}
                    style={{padding:'6px 12px',borderRadius:20,border:'1.5px solid',
                      cursor:'pointer',fontSize:11,fontWeight:700,
                      borderColor:form.category===c2?a:b,
                      background:form.category===c2?a+'15':surf,
                      color:form.category===c2?a:m}}>
                    {c2}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{marginBottom:12}}>
              <p style={{color:t,fontWeight:700,fontSize:12,margin:'0 0 6px'}}>
                Title *
              </p>
              <input value={form.title}
                onChange={e=>{setForm({...form,title:e.target.value});checkDup(e.target.value)}}
                placeholder="Write a clear, specific headline..."
                style={{width:'100%',padding:'11px 14px',borderRadius:12,
                  border:'1.5px solid '+(dupWarning?'#EF4444':b),
                  background:bg,color:t,fontSize:13,outline:'none',
                  fontFamily:'Poppins,sans-serif',boxSizing:'border-box'}}/>
              {dupWarning && (
                <div style={{background:'#FEF2F2',border:'1px solid #FECACA',
                  borderRadius:8,padding:'8px 12px',marginTop:6}}>
                  <p style={{color:'#EF4444',fontSize:11,fontWeight:700,margin:'0 0 2px'}}>
                    ⚠️ Similar content already posted
                  </p>
                  <p style={{color:'#EF4444',fontSize:10,margin:0}}>{dupWarning}</p>
                </div>
              )}
            </div>

            {/* Body */}
            <div style={{marginBottom:16}}>
              <p style={{color:t,fontWeight:700,fontSize:12,margin:'0 0 6px'}}>
                Your Story *
              </p>
              <textarea value={form.body}
                onChange={e=>setForm({...form,body:e.target.value})}
                placeholder="Share details, insights, or your experience. Be specific and helpful to other students..."
                rows={5}
                style={{width:'100%',padding:'11px 14px',borderRadius:12,
                  border:'1.5px solid '+b,background:bg,color:t,fontSize:13,
                  outline:'none',resize:'vertical',lineHeight:1.6,
                  fontFamily:'Poppins,sans-serif',boxSizing:'border-box'}}/>
            </div>

            {/* Image upload */}
            <div style={{marginBottom:16}}>
              <p style={{color:t,fontWeight:700,fontSize:12,margin:'0 0 8px'}}>
                Add Images ({formImages.length}/{MAX_FORM_IMAGES})
              </p>
              <label style={{display:'inline-flex',alignItems:'center',gap:6,
                padding:'9px 14px',borderRadius:12,border:'1.5px solid '+b,
                cursor:formImages.length>=MAX_FORM_IMAGES?'not-allowed':'pointer',
                fontSize:12,fontWeight:700,color:m,
                opacity:formImages.length>=MAX_FORM_IMAGES?0.5:1,
                background:bg}}>
                📷 Choose Images
                <input type="file" accept="image/*" multiple hidden
                  disabled={formImages.length>=MAX_FORM_IMAGES}
                  onChange={handleFormImageSelect}/>
              </label>
              {formImages.length > 0 && (
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:10}}>
                  {formImages.map((img, i) => (
                    <div key={i} style={{position:'relative',width:72,height:72}}>
                      <img src={img.url} alt=""
                        style={{width:72,height:72,objectFit:'cover',borderRadius:10,border:'1px solid '+b}}/>
                      <button onClick={()=>removeFormImage(i)}
                        style={{position:'absolute',top:-6,right:-6,width:20,height:20,
                          borderRadius:'50%',background:'#EF4444',color:'#fff',border:'2px solid '+surf,
                          fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
                          lineHeight:1,padding:0}}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!submitted ? (
              <button
                onClick={()=>{
                  if(!form.title.trim()||!form.body.trim()||dupWarning) return
                  setPosts(prev=>[{
                    id:Date.now(),featured:false,
                    title:form.title,body:form.body,
                    category:form.category,
                    role:user?.role||'student',
                    author:user?.name||'Anonymous',
                    authorCity:'India',
                    time:'Just now',
                    reactions:{fire:0,love:0,insight:0,wow:0,thanks:0},
                    image:formImages.length>0?formImages[0].url:null,
                    images:formImages.map(img=>img.url),
                    verified:false,trending:'',
                  },...prev])
                  setSubmitted(true)
                  setTimeout(()=>{setSubmitted(false);setShowSubmit(false);
                    setForm({title:'',body:'',category:'Study Tip'});setFormImages([])},2000)
                }}
                disabled={!form.title.trim()||!form.body.trim()||!!dupWarning}
                style={{width:'100%',
                  background:(!form.title.trim()||!form.body.trim()||dupWarning)
                    ?b:'linear-gradient(135deg,'+p+','+a+')',
                  border:'none',borderRadius:14,padding:'14px',
                  color:(!form.title.trim()||!form.body.trim()||dupWarning)?m:'#fff',
                  fontWeight:800,fontSize:14,cursor:'pointer',
                  fontFamily:'Poppins,sans-serif'}}>
                Publish to Bharat Pulse
              </button>
            ) : (
              <div style={{textAlign:'center',padding:'14px',
                background:'#F0FDF4',borderRadius:14,
                border:'1px solid #BBF7D0'}}>
                <p style={{color:'#22C55E',fontWeight:700,fontSize:14,margin:0}}>
                  ✅ Published! Thank you for contributing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
