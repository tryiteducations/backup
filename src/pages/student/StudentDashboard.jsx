// src/pages/student/StudentDashboard.jsx
// TRYIT PREMIUM DASHBOARD v3 - Full featured world-class
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import UpgradePopup from '../../components/student/UpgradePopup'
import {
  getProfile, getStreak, getRecentAttempts,
  getUsage, updateStreak, addCoins,
  getLaunchpadEnrollment, getTodayTopic,
  uploadAvatar, updateProfile, getLeaderboard
} from '../../lib/studentLib'

// -- Helpers -------------------------------------------------------
function AnimNum({ value=0, duration=900, prefix='', suffix='' }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!value) { setN(0); return }
    const s = performance.now()
    const tick = now => {
      const p = Math.min((now-s)/duration, 1)
      const e = 1-Math.pow(1-p,3)
      setN(Math.floor(e*value))
      if (p<1) requestAnimationFrame(tick); else setN(value)
    }
    requestAnimationFrame(tick)
  }, [value])
  return <>{prefix}{n.toLocaleString('en-IN')}{suffix}</>
}

function Ring({ pct=0, size=56, stroke=4, color='#C9A84C', children }) {
  const r = (size-stroke*2)/2
  const c = 2*Math.PI*r
  return (
// ✅ AFTER
<div style={{position:'relative',width:size,height:size,flexShrink:0}}>
<svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(pct/100)*c} ${c-(pct/100)*c}`} strokeLinecap="round"
          style={{transition:'stroke-dasharray 1.2s cubic-bezier(0.23,1,0.32,1)'}}/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>{children}</div>
    </div>
  )
}

function CoinPop({ amount, onDone }) {
  const { theme } = useTheme()
  useEffect(()=>{const t=setTimeout(onDone,1400);return()=>clearTimeout(t)},[])
  return (
    <div style={{position:'fixed',bottom:120,right:24,zIndex:9998,
      background:`linear-gradient(135deg,${theme?.accent??'#C9A84C'},${theme?.accentLight??'#E8C44A'})`,
      color:theme?.primaryDark??'#0F2140',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:20,
      padding:'10px 20px',borderRadius:24,boxShadow:`0 8px 32px ${theme?.accent??'#C9A84C'}44`,
      animation:'coinPop 1.4s ease-out forwards',pointerEvents:'none'}}>
      +{amount} 🪙
      <style>{`@keyframes coinPop{0%{opacity:1;transform:translateY(0) scale(1)}60%{opacity:1;transform:translateY(-50px) scale(1.2)}100%{opacity:0;transform:translateY(-90px) scale(0.8)}}`}</style>
    </div>
  )
}

// -- Full screen wrapper -------------------------------------------
function FullScreen({ title, onClose, children, accent }) {
  useEffect(()=>{
    const esc = e => { if(e.key==='Escape') onClose() }
    window.addEventListener('keydown',esc)
    return ()=>window.removeEventListener('keydown',esc)
  },[onClose])
  return (
    <div style={{position:'fixed',inset:0,zIndex:800,background:'rgba(0,0,0,0.92)',
      display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'16px 24px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <p style={{color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:18,margin:0}}>{title}</p>
        <button onClick={onClose} style={{background:'rgba(255,255,255,0.08)',border:'none',
          borderRadius:10,width:36,height:36,color:'#fff',fontSize:18,cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'24px'}}>{children}</div>
    </div>
  )
}

// -- Nav config ----------------------------------------------------
// Updated NAV with purposes (for subtitles), Concept Learning section ("we teach every topic here"), 
// glassmorphism-friendly icons, fixed Battle Hall to actual hall creation flow (/student/hall/create)
const NAV = [
  {id:'home',      icon:'🏠',label:'Home',       purpose:'Dashboard overview & streaks', path:'/student'},
  {id:'test',      icon:'📝',label:'Tests',       purpose:'Quick, subject & full mocks', path:'/student/test', limit:'tests'},
  {id:'rank',      icon:'🏆',label:'Rank',        purpose:'All-India live leaderboard', path:'/student/rank'},
  {id:'launchpad', icon:'🚀',label:'Launchpad',   purpose:'Daily topics & weekly tests', path:'/student/launchpad'},
  {id:'concept',   icon:'💡',label:'Concept Learning', purpose:'We teach every topic here', path:'/student/concept'},
  {id:'games',     icon:'🎮',label:'Games',        purpose:'Stress-busting skill builders', path:'/student/games', limit:'games'},
  {id:'hall',      icon:'⚔️',label:'Battle Hall',  purpose:'Create or join team vs team halls', path:'/student/hall/create'},
  {id:'tournament',icon:'🏟️',label:'Tournaments', purpose:'Compete live with prizes', path:'/student/tournament'},
  {id:'guruhub',   icon:'🤝',label:'GuruHub',     purpose:'Real mentors • Ask doubts', path:'/student/guruhub', limit:'doubts'},
  {id:'classroom', icon:'📚',label:'Classroom',   purpose:'PDFs, planner, eBooks & notes', path:'/student/classroom'},
  {id:'bookmarks', icon:'🔖',label:'Bookmarks',   purpose:'Saved questions & materials', path:'/student/bookmarks'},
  {id:'analytics', icon:'📊',label:'Analytics',   purpose:'Performance trends & insights', path:'/student/analytics'},
  {id:'career',    icon:'🧭',label:'Career AI',   purpose:'Find best exam & study track for you', examBoard: true, path:'/student/career'},
  {id:'pulse',     icon:'🇮🇳',label:'Bharat Pulse',purpose:'Daily current affairs stories', path:'/student/pulse'},
  {id:'community', icon:'💬',label:'Community',   purpose:'Connect with peers & family', path:'/student/community'},
]

const FREE_LIMITS = {tests:3,games:3,doubts:3}

const BASE_THEMES = [
  {id:'default',    color:'var(--color-accent, #D4AF37)',dark:'midnight',   label:'Classic'},
  {id:'sunrise',    color:'var(--color-accent, #F59E0B)',dark:'sunrise-dark',label:'Sunrise'},
  {id:'ocean',      color:'#0EA5E9',dark:'ocean-dark',  label:'Ocean'},
  {id:'high-contrast',color:'var(--color-surface, #FFFFFF)',dark:'high-contrast',label:'Focus'},
]

// Default visible widgets (user can toggle)
// Updated with Concept Learning per requirements (teaches every topic interactively)
const ALL_WIDGETS = [
  {id:'stats',      label:'Stats Row',         default:true},
  {id:'actions',    label:'Quick Actions',     default:true},
  {id:'launchpad',  label:'Launchpad',         default:true},
  {id:'tests',      label:'Recent Tests',      default:true},
  {id:'leaderboard',label:'Leaderboard',       default:true},
  {id:'bookmarks',  label:'Bookmarks',         default:true},
  {id:'tournament', label:'Tournaments',       default:true},
  {id:'mentor',     label:'Mentor Card',       default:true},
  {id:'analytics',  label:'Analytics',         default:true},
  {id:'concept',    label:'Concept Learning',  default:true, purpose:'We teach every topic here with interactive explanations, visuals & practice'},
  {id:'pulse',      label:'Bharat Pulse',      default:true},
  {id:'community',  label:'Community',         default:false},
]

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate   = useNavigate()
  const location   = useLocation()
  const { theme, applyTheme, setActiveTheme } = useTheme()
  const { user: authUser } = useAuth()
  const fileRef    = useRef()
  const sideRef    = useRef()

  const isDark  = theme?.isDark??false
  const accent  = theme?.accent??'#C9A84C'
  const accentL = theme?.accentLight??'#E8C44A'
  const primary = theme?.primary??'#1E3A5F'
  const primD   = theme?.primaryDark??'#0F2140'

  // Page/card backgrounds - read from the theme's real dedicated fields
  // (GitHub-style near-black for dark themes, warm-tinted for light),
  // NOT derived from primary/primaryDark which are accent colors meant
  // for buttons/highlights, not full-page backgrounds.
  const pageBg  = theme?.background ?? (isDark ? '#0D1117' : '#F0F4F8')
  const surface = theme?.surface ?? (isDark ? '#161B22' : '#FFFFFF')

  const txt   = theme?.text ?? (isDark?'#fff':'#0F1020')
  const muted = theme?.textLight ?? (isDark?'rgba(255,255,255,0.80)':'#64748B')
  const card  = surface
  const bdr   = theme?.border ?? (isDark?'rgba(255,255,255,0.07)':'#E2E8F0')

  // State
  const [profile,    setProfile]    = useState(null)
  const [streak,     setStreak]     = useState(null)
  const [usage,      setUsage]      = useState(null)
  const [attempts,   setAttempts]   = useState([])
  const [leaders,    setLeaders]    = useState([])
  const [launchpad,  setLaunchpad]  = useState(null)
  const [todayTopic, setTodayTopic] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [upgradeFor, setUpgradeFor] = useState(null)
  const [coinPop,    setCoinPop]    = useState(null)
  const [uploading,  setUploading]  = useState(false)
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(true)
  // Sidebar
  const [sideOpen,   setSideOpen]   = useState(true)
  const [sideHover,  setSideHover]  = useState(false)
  const sideVisible = sideOpen || sideHover
  // UI panels
  const [showThemePicker, setShowThemePicker]   = useState(false)
  const [showCustomize,   setShowCustomize]     = useState(false)
  const [showNotifs,      setShowNotifs]        = useState(false)
  const [fullScreen,      setFullScreen]        = useState(null) // {id, title}
  const [widgets,         setWidgets]           = useState(
    () => {
      try {
        const saved = localStorage.getItem('tryit_widgets')
        return saved ? JSON.parse(saved) : ALL_WIDGETS.filter(w=>w.default).map(w=>w.id)
      } catch { return ALL_WIDGETS.filter(w=>w.default).map(w=>w.id) }
    }
  )

  const showWidget = id => widgets.includes(id)

  // Load data
  useEffect(()=>{
    if(!authUser){navigate('/landing',{replace:true});return}
    const uid = authUser.id||authUser.userId
    const load = async()=>{
      try {
        const [p,s,u,att,lp,lb] = await Promise.all([
          getProfile(uid).catch(()=>({name:authUser?.name||'Student',coins:0,xp:0,level:1,plan:'free',badge:'Newcomer',state:'',avatar_url:null})),
          getStreak(uid).catch(()=>({current_streak:0,longest_streak:0,total_study_days:0})),
          getUsage(uid).catch(()=>({tests_today:0,games_today:0,doubts_today:0,last_reset:new Date().toISOString().split('T')[0]})),
          getRecentAttempts(uid,6).catch(()=>[]),
          getLaunchpadEnrollment(uid).catch(()=>null),
          getLeaderboard(8).catch(()=>[]),
          updateStreak(uid).catch(()=>console.log('Streak update skipped - mock user')),
        ])
        setProfile(p||{name:authUser.name||'Student',avatar_url:null,
          coins:authUser.coins||0,xp:authUser.xp||0,level:authUser.level||1,
          rank:null,badge:authUser.levelTitle||'Newcomer',plan:authUser.plan||'free',
          state:authUser.state||''})
        setStreak(s);setUsage(u);setAttempts(att);setLaunchpad(lp);setLeaders(lb)
        if(lp){const t=await getTodayTopic(lp).catch(()=>null);setTodayTopic(t)}
      } catch(e){console.error(e)}
      finally{setLoading(false)}
    }
    load()
  },[authUser,navigate])

  const handleNav = useCallback((item)=>{
    const plan=profile?.plan||'free'
    if(item.limit&&plan==='free'){
      const used=usage?.[`${item.limit}_today`]||0
      if(used>=FREE_LIMITS[item.limit]){setUpgradeFor(item.limit);return}
    }
    navigate(item.path)
  },[profile,usage,navigate])

  const handleAvatarClick=()=>fileRef.current?.click()
  const handleFileChange=async(e)=>{
    const file=e.target.files?.[0]
    if(!file||!authUser)return
    setUploading(true)
    try{
      const uid=authUser.id||authUser.userId
      const url=await uploadAvatar(uid,file)
      setProfile(p=>({...p,avatar_url:url}))
      if(!profile?.avatar_url){await addCoins(uid,25,'First avatar upload');setCoinPop(25)}
    }catch(e){console.error(e)}
    finally{setUploading(false)}
  }

  const toggleWidget=(id)=>{
    const next = widgets.includes(id) ? widgets.filter(w=>w!==id) : [...widgets,id]
    setWidgets(next)
    localStorage.setItem('tryit_widgets',JSON.stringify(next))
  }

  const switchTheme=(t)=>{
    const id=isDark?t.dark:t.id
    setActiveTheme(id);applyTheme(id)
    setShowThemePicker(false)
  }

  const share=async()=>{
    const hasResults = attempts.length > 0
    const scoreVal = attempts[0]?.score||0
    const totalVal = attempts[0]?.total||100
    const examVal = attempts[0]?.exam_name||'TryIT exam'
    const rankVal = profile?.rank||'-'
    const nameVal = profile?.name||authUser?.name||'Student'
    const bigStat = hasResults ? `${scoreVal}/${totalVal}` : '🎯'
    const statLine = hasResults ? examVal : 'Preparing for my exam'
    const badgeLine = hasResults ? `🏆 All-India Rank #${rankVal}` : `🔥 ${curStr} day streak · Let's go!`
    const text = hasResults
      ? `I scored ${scoreVal}/${totalVal} on ${examVal}! Rank #${rankVal} All-India. 🎓 tryiteducations.net`
      : `I'm preparing for my exam on TryIT Educations - join me! 🎓 tryiteducations.net`

    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1080; canvas.height = 1080
      const ctx = canvas.getContext('2d')

      // Background gradient using the active theme's colors
      const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
      grad.addColorStop(0, isDark?pageBg:primary); grad.addColorStop(1, isDark?surface:primD)
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1080)

      // Ambient glow accent circle
      const glow = ctx.createRadialGradient(860, 220, 20, 860, 220, 400)
      glow.addColorStop(0, `${accent}55`); glow.addColorStop(1, `${accent}00`)
      ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 1080)

      // TryIT Educations wordmark
      ctx.fillStyle = '#fff'; ctx.font = 'bold 46px Poppins, sans-serif'
      ctx.fillText('TryIT Educations', 70, 110)
      ctx.fillStyle = accent; ctx.fillRect(70, 130, 90, 6)

      // Avatar circle with initial
      ctx.beginPath(); ctx.arc(150, 300, 70, 0, Math.PI*2)
      ctx.fillStyle = accent; ctx.fill()
      ctx.fillStyle = isDark?pageBg:primD; ctx.font = 'bold 60px Poppins, sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText((nameVal[0]||'S').toUpperCase(), 150, 305)
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'

      // Name + batch
      ctx.fillStyle = '#fff'; ctx.font = 'bold 40px Poppins, sans-serif'
      ctx.fillText(nameVal, 250, 290)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '26px Inter, sans-serif'
      ctx.fillText(`${profile?.plan?.toUpperCase()||'FREE'} · ${profile?.badge||'Newcomer'}`, 250, 330)

      // The big stat
      ctx.fillStyle = accent; ctx.font = 'bold 120px Poppins, sans-serif'
      ctx.fillText(bigStat, 70, 560)
      ctx.fillStyle = '#fff'; ctx.font = '34px Inter, sans-serif'
      ctx.fillText(statLine, 70, 610)

      // Rank / streak badge
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.fillRect(70, 660, 460, 90)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 32px Poppins, sans-serif'
      ctx.fillText(badgeLine, 95, 715)

      // Footer tagline
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '28px Inter, sans-serif'
      ctx.fillText('tryiteducations.net · Your Exam. Your Rank. Your Success.', 70, 1010)

      canvas.toBlob(async (blob) => {
        if (!blob) { if(navigator.share){navigator.share({title:'My TryIT Score',text})} else {navigator.clipboard?.writeText(text)}; return }
        const file = new File([blob], 'tryit-score.png', { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'My TryIT Score', text, files: [file] })
        } else if (navigator.share) {
          await navigator.share({ title: 'My TryIT Score', text })
        } else {
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob); link.download = 'tryit-score.png'
          link.click()
        }
      }, 'image/png')
    } catch (e) {
      console.error('Share image generation failed, falling back to text:', e)
      if(navigator.share){navigator.share({title:'My TryIT Score',text})}
      else{navigator.clipboard?.writeText(text)}
    }
  }

  if(loading)return(
    <div style={{minHeight:'100vh',background:pageBg,
      display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <Ring pct={75} size={64} color={accent}><span style={{fontSize:22}}>🎓</span></Ring>
      <p style={{color:muted,fontFamily:'Poppins,sans-serif',fontSize:14}}>Loading your dashboard...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const plan   = profile?.plan||'free'
  const isPro  = plan==='pro'||plan==='ultra'
  const coins  = profile?.coins||0
  const xp     = profile?.xp||0
  const lvl    = profile?.level||1
  const rank   = profile?.rank
  const badge  = profile?.badge||'Newcomer'
  const curStr = streak?.current_streak||0
  const xpPct  = ((xp%500)/500)*100
  const activeId = location.pathname==='/student'?'home'
    :NAV.find(n=>location.pathname.startsWith(n.path)&&n.path!=='/student')?.id||'home'

  return(
    <div className={sidebarOpen ? 'sidebar-open' : ''} style={{display:'flex',minHeight:'100vh',
      background:isDark?`radial-gradient(ellipse 80% 60% at 20% -10%,${primary}40,transparent 60%),${pageBg}`:pageBg,
      fontFamily:'Inter,sans-serif',position:'relative'}}>

      {/* -- Overlays -------------------------------------------- */}
      {coinPop&&<CoinPop amount={coinPop} onDone={()=>setCoinPop(null)}/>}
      {upgradeFor&&(
        <UpgradePopup type={upgradeFor}
          category={profile?.target_exam_category||'ssc_railway'}
          onClose={()=>setUpgradeFor(null)}
          onUpgrade={()=>{setUpgradeFor(null);navigate('/pricing')}}/>
      )}

      {/* Full screen overlay */}
      {fullScreen&&(
        <FullScreen title={fullScreen.title} onClose={()=>setFullScreen(null)} accent={accent}>
          <div style={{color:'#fff',textAlign:'center',padding:'40px 0'}}>
            <p style={{fontSize:48,margin:'0 0 16px'}}>{fullScreen.icon}</p>
            <p style={{fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:18,margin:'0 0 8px'}}>
              {fullScreen.title}
            </p>
            <p style={{color:isDark?'rgba(255,255,255,0.5)':muted,fontSize:14,margin:'0 0 24px'}}>
              This section opens in full view
            </p>
            <button onClick={()=>{setFullScreen(null);navigate(fullScreen.path)}}
              style={{background:`linear-gradient(135deg,${accent},${accentL})`,
                border:'none',borderRadius:14,padding:'12px 32px',
                color:primD,fontWeight:800,fontSize:15,cursor:'pointer'}}>
              Open {fullScreen.title} →
            </button>
          </div>
        </FullScreen>
      )}

      {/* Theme picker overlay */}
      {showThemePicker&&(
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.5)'}}
          onClick={()=>setShowThemePicker(false)}>
          <div onClick={e=>e.stopPropagation()} style={{
            position:'absolute',top:70,right:80,
            background:surface,borderRadius:18,padding:'20px',
            border:`1px solid ${accent}30`,width:280,
            boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:800,
              fontSize:14,margin:'0 0 16px'}}>🎨 Choose Theme</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {BASE_THEMES.map(t=>(
                <button key={t.id} onClick={()=>switchTheme(t)} style={{
                  background:isDark?'rgba(255,255,255,0.05)':'#F8FAFC',
                  border:`2px solid ${t.color}40`,borderRadius:12,
                  padding:'12px',cursor:'pointer',textAlign:'center',
                  transition:'all 0.15s'}}>
                  <div style={{width:32,height:32,borderRadius:'50%',
                    background:`linear-gradient(135deg,${t.color},${t.color}88)`,
                    margin:'0 auto 6px'}}/>
                  <p style={{color:txt,fontSize:11,fontWeight:700,margin:0}}>{t.label}</p>
                </button>
              ))}
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
              background:isDark?'rgba(255,255,255,0.06)':'#F1F5F9',
              borderRadius:12,padding:'10px 14px'}}>
              <span style={{color:txt,fontSize:13,fontWeight:600}}>
                {isDark?'🌙 Dark':'☀️ Light'} Mode
              </span>
              <button onClick={()=>{
                const newId=isDark?(BASE_THEMES.find(t=>t.dark===theme?.id)?BASE_THEMES.find(t=>t.dark===theme?.id)?.id:'default')
                  :(BASE_THEMES.find(t=>t.id===theme?.id)?BASE_THEMES.find(t=>t.id===theme?.id)?.dark:'midnight')
                setActiveTheme(newId);applyTheme(newId)
              }} style={{background:`linear-gradient(135deg,${accent},${accentL})`,
                border:'none',borderRadius:8,padding:'6px 14px',
                color:primD,fontWeight:700,fontSize:12,cursor:'pointer'}}>
                Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize widgets overlay */}
      {showCustomize&&(
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.6)',
          display:'flex',alignItems:'center',justifyContent:'center'}}
          onClick={()=>setShowCustomize(false)}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:surface,borderRadius:24,padding:'24px',
            width:'90%',maxWidth:400,border:`1px solid ${accent}25`,
            maxHeight:'80vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',
              alignItems:'center',marginBottom:16}}>
              <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:800,
                fontSize:16,margin:0}}>⚙️ Customize Dashboard</p>
              <button onClick={()=>setShowCustomize(false)} style={{
                background:'transparent',border:'none',color:muted,
                fontSize:20,cursor:'pointer'}}>✕</button>
            </div>
            <p style={{color:muted,fontSize:12,margin:'0 0 16px'}}>
              Toggle widgets to show/hide on your dashboard
            </p>
            {ALL_WIDGETS.map(w=>(
              <div key={w.id} style={{display:'flex',alignItems:'center',
                justifyContent:'space-between',padding:'10px 0',
                borderBottom:`1px solid ${bdr}`}}>
                <span style={{color:txt,fontSize:13,fontWeight:600}}>{w.label}</span>
                <button onClick={()=>toggleWidget(w.id)} style={{
                  width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',
                  background:showWidget(w.id)?`linear-gradient(135deg,${accent},${accentL})`:'rgba(255,255,255,0.1)',
                  position:'relative',transition:'all 0.2s'}}>
                  <div style={{position:'absolute',top:2,
                    left:showWidget(w.id)?22:2,
                    width:20,height:20,borderRadius:'50%',
                    background:'#fff',transition:'left 0.2s',
                    boxShadow:'0 2px 6px rgba(0,0,0,0.2)'}}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications panel */}
      {showNotifs&&(
        <div style={{position:'fixed',inset:0,zIndex:500}}
          onClick={()=>setShowNotifs(false)}>
          <div onClick={e=>e.stopPropagation()} style={{
            position:'absolute',top:70,right:24,
            background:surface,borderRadius:18,
            padding:'16px',width:320,
            border:`1px solid ${bdr}`,
            boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
            <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:800,
              fontSize:14,margin:'0 0 12px'}}>🔔 Notifications</p>
            {[
              {icon:'🔥',msg:'Your streak is at risk! Study today.',time:'2h ago',color:'var(--color-accent, #F59E0B)'},
              {icon:'🏆',msg:'New All-India rank update available.',time:'5h ago',color:accent},
              {icon:'📝',msg:'Weekly test is now live - attempt it!',time:'1d ago',color:'#60A5FA'},
            ].map((n,i)=>(
              <div key={i} style={{display:'flex',gap:10,padding:'10px 0',
                borderBottom:`1px solid ${bdr}`}}>
                <div style={{width:36,height:36,borderRadius:'50%',
                  background:`${n.color}18`,display:'flex',
                  alignItems:'center',justifyContent:'center',
                  fontSize:18,flexShrink:0}}>{n.icon}</div>
                <div>
                  <p style={{color:txt,fontSize:12,fontWeight:600,margin:'0 0 2px'}}>{n.msg}</p>
                  <p style={{color:muted,fontSize:10,margin:0}}>{n.time}</p>
                </div>
              </div>
            ))}
            <button onClick={()=>{setShowNotifs(false);navigate('/student/notifications')}}
              style={{width:'100%',background:'transparent',border:`1px solid ${bdr}`,
                borderRadius:10,padding:'9px',color:muted,fontSize:12,
                cursor:'pointer',marginTop:10}}>
              See all notifications
            </button>
          </div>
        </div>
      )}

      {/* -- LEFT SIDEBAR ------------------------------------------ */}
      <aside
        ref={sideRef}
        onMouseEnter={()=>setSideHover(true)}
        onMouseLeave={()=>setSideHover(false)}
        style={{
          width:sideVisible?240:68,
          minHeight:'100vh',
          background: `linear-gradient(145deg, ${card}ee, ${primD}99)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display:'flex',flexDirection:'column',
          position:'sticky',top:0,height:'100vh',
          transition:'width 0.28s cubic-bezier(0.23,1,0.32,1)',
          zIndex:200,flexShrink:0,
          borderRight: `1px solid ${bdr}`,
          boxShadow: `0 10px 30px rgba(0,0,0,0.15), inset -1px 0 0 rgba(255,255,255,0.1)`,
        }}
        className="sidebar-desktop">

        {/* Logo */}
        <div style={{padding:'20px 14px 14px',display:'flex',
          alignItems:'center',justifyContent:'space-between',
          borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,overflow:'hidden'}}>
            <div style={{width:36,height:36,borderRadius:10,flexShrink:0,
              background:`linear-gradient(135deg,${accent},${accentL})`,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:14,
              color:primD,boxShadow:`0 4px 12px ${accent}44`}}>T</div>
            {sideVisible&&(
              <span style={{color:'#fff',fontFamily:'Poppins,sans-serif',
                fontWeight:800,fontSize:18,whiteSpace:'nowrap',
                opacity:sideVisible?1:0,transition:'opacity 0.2s'}}>
                Try<span style={{color:accent}}>IT</span>
              </span>
            )}
          </div>
          <button onClick={()=>setSideOpen(o=>!o)} style={{
            background:'rgba(255,255,255,0.07)',border:'none',
            borderRadius:8,width:28,height:28,cursor:'pointer',
            color:isDark?'rgba(255,255,255,0.5)':muted,fontSize:13,display:'flex',
            alignItems:'center',justifyContent:'center',flexShrink:0,
            transition:'background 0.15s'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}>
            {sideOpen?'←':'→'}
          </button>
        </div>

        {/* User mini card */}
        <div style={{padding:'12px 10px',margin:'8px',
          background:'linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))',
          borderRadius:14,
          border:'1px solid rgba(255,255,255,0.25)',
          backdropFilter:'blur(12px)',
          boxShadow:'0 4px 24px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.15)'}}>
          <div style={{display:'flex',alignItems:'center',
            gap:sideVisible?10:0,justifyContent:sideVisible?'flex-start':'center'}}>
            <div onClick={handleAvatarClick}
              onContextMenu={e=>e.preventDefault()}
              style={{width:40,height:40,borderRadius:'50%',flexShrink:0,
                background:`linear-gradient(135deg,${accent},${accentL})`,
                border:`2px solid ${accent}`,
                backgroundImage:profile?.avatar_url?`url(${profile.avatar_url})`:'',
                backgroundSize:'cover',backgroundPosition:'center',
                cursor:'pointer',display:'flex',alignItems:'center',
                justifyContent:'center',fontWeight:900,fontSize:16,
                color:primD,WebkitUserDrag:'none',userSelect:'none',
                position:'relative',
                boxShadow:`0 0 0 3px ${accent}33`}}>
              {!profile?.avatar_url&&(profile?.name?.[0]||'S')}
              {uploading&&(
                <div style={{position:'absolute',inset:0,borderRadius:'50%',
                  background:'rgba(0,0,0,0.5)',display:'flex',
                  alignItems:'center',justifyContent:'center'}}>
                  <div style={{width:16,height:16,borderRadius:'50%',
                    border:'2px solid #fff',borderTopColor:'transparent',
                    animation:'spin 0.8s linear infinite'}}/>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*"
              style={{display:'none'}} onChange={handleFileChange}/>
            {sideVisible&&(
              <div style={{flex:1,minWidth:0}}>
                <p style={{color:'#fff',fontWeight:700,fontSize:13,
                  margin:0,whiteSpace:'nowrap',overflow:'hidden',
                  textOverflow:'ellipsis'}}>{profile?.name||'Student'}</p>
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3}}>
                  <span style={{background:`${accent}22`,color:accent,
                    fontSize:8,fontWeight:700,padding:'1px 6px',
                    borderRadius:20,border:`1px solid ${accent}33`}}>{badge}</span>
                  <span style={{color:isDark?'rgba(255,255,255,0.35)':muted,fontSize:9}}>Lv.{lvl}</span>
                </div>
              </div>
            )}
          </div>
          {sideVisible&&(
            <div style={{marginTop:10}}>
              <div style={{height:4,borderRadius:2,
                background:'rgba(255,255,255,0.07)',overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:2,width:`${xpPct}%`,
                  background:`linear-gradient(90deg,${accent},${accentL})`,
                  transition:'width 1s ease',
                  boxShadow:`0 0 8px ${accent}66`}}/>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                <span style={{color:isDark?'rgba(255,255,255,0.60)':muted,fontSize:8}}>XP {xp%500}/500</span>
                <span style={{color:accent,fontSize:8,fontWeight:700}}>Lv.{lvl+1} →</span>
              </div>
            </div>
          )}
        </div>

        {/* Streak + Coins */}
        {sideVisible&&(
          <div style={{display:'flex',gap:6,padding:'0 10px',marginBottom:6}}>
            {[
              {icon:'🔥',val:`${curStr}d`,label:'Streak',color:'#FF6B00'},
              {icon:'🪙',val:coins,label:'Coins',color:accent,anim:true},
            ].map((s,i)=>(
              <div key={i} style={{flex:1,background:isDark?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.5)',
                border:`1px solid ${isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.06)'}`,borderRadius:10,
                padding:'7px 8px',textAlign:'center'}}>
                <p style={{color:s.color,fontWeight:900,fontSize:15,
                  fontFamily:'Poppins,sans-serif',margin:0}}>
                  {s.icon}{' '}
                  {s.anim?<AnimNum value={s.val}/>:s.val}
                </p>
                <p style={{color:isDark?'rgba(255,255,255,0.65)':muted,fontSize:8,margin:'2px 0 0'}}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Nav */}
        <nav style={{flex:1,overflowY:'auto',overflowX:'hidden',
          padding:'4px 8px',scrollbarWidth:'none'}}>
          {NAV.map(item=>{
            const active=activeId===item.id
            const used=usage?.[`${item.limit}_today`]||0
            const atLimit=plan==='free'&&item.limit&&used>=FREE_LIMITS[item.limit]
            return(
              <button key={item.id}
                onClick={()=>handleNav(item)}
                title={!sideVisible?item.label:''}
                style={{
                  display:'flex',alignItems:'center',
                  gap:sideVisible?10:0,
                  justifyContent:sideVisible?'flex-start':'center',
                  width:'100%',padding:sideVisible?'9px 10px':'9px 0',
                  borderRadius:11,cursor:'pointer',marginBottom:2,
                  border:'none',transition:'all 0.15s',
                  background:active
                    ?`linear-gradient(135deg,${accent}22,${accent}0a)`
                    :atLimit?'rgba(248,113,113,0.05)':'transparent',
                  borderLeft:active?`3px solid ${accent}`:'3px solid transparent',
                  boxShadow:active?`0 0 20px ${accent}55,0 4px 12px rgba(0,0,0,0.3)`:'0 2px 6px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={e=>{if(!active)e.currentTarget.style.background='rgba(255,255,255,0.06)'}}
                onMouseLeave={e=>{if(!active)e.currentTarget.style.background='transparent'}}>
                <div style={{
                  width:32,height:32,borderRadius:9,flexShrink:0,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:16,
                  background:active?`${accent}22`:atLimit?'rgba(248,113,113,0.12)':'rgba(255,255,255,0.05)',
                  boxShadow:active?`0 0 14px ${accent}44`:'none',
                  transition:'all 0.15s',
                }}>{item.icon}</div>
                {sideVisible && (
                  <div style={{flex:1, textAlign:'left', minWidth:0}}>
                    <span style={{
                      color:active?accent:atLimit?'#F87171':(isDark?'rgba(255,255,255,0.88)':muted),
                      fontSize:12,fontWeight:active?700:400,
                      transition:'color 0.15s',
                      display:'block',
                      whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                    }}>{item.label}</span>
                    {item.purpose && (
                      <span style={{
                        color:muted,
                        fontSize:10,
                        display:'block',
                        marginTop:1,
                        opacity:0.7,
                        lineHeight:1.2,
                        whiteSpace:'nowrap',
                        overflow:'hidden',
                        textOverflow:'ellipsis'
                      }}>
                        {item.purpose}
                      </span>
                    )}
                  </div>
                )}
                {sideVisible&&item.limit&&plan==='free'&&(
                  <span style={{
                    background:atLimit?'rgba(248,113,113,0.15)':'rgba(255,255,255,0.07)',
                    color:atLimit?'#F87171':(isDark?'rgba(255,255,255,0.3)':muted),
                    fontSize:8,padding:'1px 5px',borderRadius:20,flexShrink:0,fontWeight:700,
                  }}>
                    {atLimit?'0':FREE_LIMITS[item.limit]-used}/{FREE_LIMITS[item.limit]}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Upgrade CTA */}
        {!isPro&&sideVisible&&showUpgradeCTA&&(
          <div style={{margin:'8px 10px 12px',
            background:`linear-gradient(135deg,${accent}25,${accent}10)`,
            border:`1px solid ${accent}45`,borderRadius:14,padding:'12px',
            position:'relative'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <p style={{color:accent,fontWeight:700,fontSize:11,margin:0}}>⚡ Upgrade to Pro</p>
              <button onClick={()=>setShowUpgradeCTA(false)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:'50%',width:18,height:18,cursor:'pointer',color:isDark?'rgba(255,255,255,0.6)':muted,fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>✕</button>
            </div>
            <p style={{color:isDark?'rgba(255,255,255,0.35)':muted,fontSize:10,margin:'0 0 8px',lineHeight:1.5}}>
              Unlimited tests · All themes · Full rank
            </p>
            <button onClick={()=>navigate('/pricing')} style={{
              width:'100%',background:`linear-gradient(135deg,${accent},${accentL})`,
              border:'none',borderRadius:8,padding:'8px',
              color:primD,fontWeight:800,fontSize:11,cursor:'pointer',
              boxShadow:`0 4px 14px ${accent}44`}}>
              From ₹5/day →
            </button>
          </div>
        )}
      </aside>

      {/* -- MAIN CONTENT ------------------------------------------ */}
      <main style={{flex:1,minWidth:0,overflowY:'auto',maxHeight:'100vh'}}>

        {/* Top bar */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'14px 24px',
          background:isDark?'rgba(0,0,0,0.25)':'rgba(255,255,255,0.88)',
        backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',
          borderBottom:`1px solid ${bdr}`,
          position:'sticky',top:0,zIndex:100,
          boxShadow:isDark?'0 1px 0 rgba(255,255,255,0.04)':'0 1px 20px rgba(0,0,0,0.06)',
        }}>
          <button onClick={()=>setSidebarOpen(true)}
              className="mobile-ham"
              style={{background:'var(--color-primary,#1E3A5F)',border:'none',
                borderRadius:10,width:38,height:38,color:'#fff',fontSize:20,
                cursor:'pointer',alignItems:'center',justifyContent:'center',
                flexShrink:0,marginRight:4}}>
              ☰
            </button>
            <div>
            <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:17,margin:0}}>
              {new Date().getHours()<12?'Good Morning':new Date().getHours()<17?'Good Afternoon':'Good Evening'}{' '}
              <span style={{color:accent}}>{profile?.name?.split(' ')[0]||'Student'}</span> 👋
            </p>
            <p style={{color:muted,fontSize:11,margin:'2px 0 0'}}>
              {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
            </p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {/* Customize (kept, Theme button removed as unwanted per requirements) */}
            <button onClick={()=>setShowCustomize(true)} style={{
              background:card,border:`1px solid ${bdr}`,borderRadius:10,
              width:38,height:38,cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,
              transition:'all 0.15s'}}
              title="Customize dashboard"
              onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${accent}40`}}
              onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${bdr}`}}>
              🎛️
            </button>
            {/* Share */}
            <button onClick={share} style={{
              background:card,border:`1px solid ${bdr}`,borderRadius:10,
              width:38,height:38,cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}
              title="Share my progress">
              📤
            </button>
            {/* Notifications */}
            <button onClick={()=>setShowNotifs(t=>!t)} style={{
              position:'relative',background:card,border:`1px solid ${bdr}`,
              borderRadius:10,width:38,height:38,cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>
              🔔
              <div style={{position:'absolute',top:6,right:6,width:8,height:8,
                borderRadius:'50%',background:'#F87171',
                border:`2px solid ${isDark?primD:'#fff'}`}}/>
            </button>
            {/* Profile avatar in header */}
            <div onClick={()=>navigate('/student/settings')}
              onContextMenu={e=>e.preventDefault()}
              style={{
                width:38,height:38,borderRadius:'50%',flexShrink:0,
                background:`linear-gradient(135deg,${accent},${accentL})`,
                border:`2px solid ${accent}`,
                backgroundImage:profile?.avatar_url?`url(${profile.avatar_url})`:'',
                backgroundSize:'cover',backgroundPosition:'center',
                cursor:'pointer',display:'flex',alignItems:'center',
                justifyContent:'center',fontWeight:900,fontSize:16,
                color:primD,WebkitUserDrag:'none',userSelect:'none',
                boxShadow:`0 0 0 2px ${accent}33`,
              }}>
              {!profile?.avatar_url&&(profile?.name?.[0]||'S')}
            </div>
          </div>
        </div>

        <div style={{padding:'20px 24px',maxWidth:960,margin:'0 auto'}}>

          {/* -- STATS ------------------------------------------- */}
          {showWidget('stats')&&(
            <div style={{display:'grid',
              gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,190px),1fr))',
              gap:12,marginBottom:20}}>
              {[
                {label:'All-India Rank',val:rank,display:rank?`#${rank.toLocaleString('en-IN')}`:'-',
                  icon:'🏆',color:'#FFD700',ring:rank?Math.min(100,100-(rank/100000)*100):0,sub:'After last test'},
                {label:'Day Streak',val:curStr,display:curStr,
                  icon:'🔥',color:'var(--color-accent, #F59E0B)',ring:Math.min(100,curStr*3),sub:`Best: ${streak?.longest_streak||0}d`},
                {label:'Coins',val:coins,display:coins,
                  icon:'🪙',color:accent,ring:Math.min(100,(coins/1000)*100),sub:'Spend in store',anim:true},
                {label:'Tests Done',val:attempts.length,display:attempts.length,
                  icon:'📝',color:'#60A5FA',ring:Math.min(100,attempts.length*10),sub:`Level ${lvl}`,anim:true},
              ].map((s,i)=>(
                <div key={i} style={{background:isDark?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.9)',
                  backdropFilter:'blur(12px)',
                  border:`1px solid ${s.color}30`,borderRadius:18,
                  padding:'14px',
                  boxShadow:isDark?`0 4px 24px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.04)`:`0 2px 12px ${s.color}12`,
                  display:'flex',alignItems:'center',gap:12,
                  transition:'all 0.2s',cursor:'default'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 8px 28px ${s.color}22`}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow=isDark?'0 4px 24px rgba(0,0,0,0.15)': `0 2px 12px ${s.color}12`}}>
                  <Ring pct={s.ring} size={52} stroke={4} color={s.color}>
                    <span style={{fontSize:18}}>{s.icon}</span>
                  </Ring>
                  <div>
                    <p style={{color:s.color,fontFamily:'Poppins,sans-serif',
                      fontWeight:900,fontSize:20,margin:0,lineHeight:1,
                      textShadow:`0 0 20px ${s.color}44`}}>
                      {s.anim?<AnimNum value={s.val||0} prefix={i===0?'#':''}/>:s.display}
                    </p>
                    <p style={{color:txt,fontWeight:600,fontSize:11,margin:'3px 0 2px'}}>{s.label}</p>
                    <p style={{color:muted,fontSize:9,margin:0}}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* -- FREE PLAN BAR ---------------------------------- */}
          {!isPro&&(
            <div style={{background:isDark?`${accent}07`:`${accent}06`,
              border:`1px solid ${accent}25`,borderRadius:14,
              padding:'11px 16px',marginBottom:20,
              display:'flex',alignItems:'center',
              justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
              <div>
                <p style={{color:accent,fontWeight:700,fontSize:12,margin:0}}>
                  Free Plan - {FREE_LIMITS.tests-(usage?.tests_today||0)} tests left today
                </p>
                <p style={{color:muted,fontSize:10,margin:'2px 0 0'}}>
                  Refer a friend who buys Pro → 7 days Pro free for both
                </p>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>navigate('/referral')} style={{
                  background:'transparent',border:`1px solid ${accent}35`,
                  borderRadius:10,padding:'7px 12px',color:accent,
                  fontWeight:700,fontSize:11,cursor:'pointer'}}>Refer & Earn</button>
                <button onClick={()=>setUpgradeFor('tests')} style={{
                  background:`linear-gradient(135deg,${accent},${accentL})`,
                  border:'none',borderRadius:10,padding:'7px 14px',
                  color:primD,fontWeight:800,fontSize:11,cursor:'pointer',
                  boxShadow:`0 4px 14px ${accent}33`}}>
                  Upgrade ₹5/day →
                </button>
              </div>
            </div>
          )}

          {/* -- QUICK ACTIONS ----------------------------------- */}
          {showWidget('actions')&&(
            <>
              <p style={{color:muted,fontSize:9,fontWeight:700,
                letterSpacing:'1.5px',margin:'0 0 10px'}}>TODAY'S ACTIONS</p>
              <div style={{display:'grid',
                gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',
                gap:10,marginBottom:20}}>
                {[
                  {icon:'⚡',label:'Quick Test',sub:'10 questions',color:'#60A5FA',path:'/student/test',limit:'tests'},
                  {icon:'🚀',label:'Launchpad',sub:"Today's topic",color:accent,path:'/student/launchpad'},
                  {icon:'🎮',label:'Play Game',sub:'+coins',color:'#4ADE80',path:'/student/games',limit:'games'},
                  {icon:'🤝',label:'Ask Doubt',sub:'Get answer',color:'#A78BFA',path:'/student/guruhub',limit:'doubts'},
                  {icon:'📚',label:'Classroom',sub:'PDFs & Notes',color:'#FB923C',path:'/student/classroom'},
                  {icon:'🏟️',label:'Tournament',sub:'Compete live',color:'#F87171',path:'/student/tournament'},
                  {icon:'🔖',label:'Bookmarks',sub:'Saved items',color:'#34D399',path:'/student/bookmarks'},
                  {icon:'🧭',label:'Career AI', examBoard: true,sub:'Best exam for you',color:'#60A5FA',path:'/student/career'},
                ].map((a,i)=>{
                  const used=usage?.[`${a.limit}_today`]||0
                  const atLimit=plan==='free'&&a.limit&&used>=FREE_LIMITS[a.limit]
                  return(
                    <button key={i}
                      onClick={()=>handleNav(a)}
                      style={{background:atLimit?'rgba(248,113,113,0.05)':isDark?'rgba(255,255,255,0.10)':'rgba(255,255,255,0.95)',
                        backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
                        border:`1.5px solid ${atLimit?'#F87171':a.color}50`,
                        boxShadow:isDark?`0 4px 20px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.08)`:`0 2px 12px ${a.color}15,0 1px 0 rgba(255,255,255,0.9)`,
                        borderRadius:16,padding:'13px 10px',
                        cursor:'pointer',textAlign:'left',
                        transition:'all 0.15s'}}
                      onMouseEnter={e=>{
                        e.currentTarget.style.transform='translateY(-3px)'
                        e.currentTarget.style.boxShadow=`0 10px 28px ${a.color}28`
                        e.currentTarget.style.border=`1.5px solid ${a.color}50`
                      }}
                      onMouseLeave={e=>{
                        e.currentTarget.style.transform='translateY(0)'
                        e.currentTarget.style.boxShadow=isDark?'none':`0 2px 8px ${a.color}10`
                        e.currentTarget.style.border=`1.5px solid ${atLimit?'#F87171':a.color}22`
                      }}>
                      <div style={{width:36,height:36,borderRadius:10,
                        background:`${a.color}18`,display:'flex',
                        alignItems:'center',justifyContent:'center',
                        fontSize:20,marginBottom:8,
                        boxShadow:`0 0 12px ${a.color}22`}}>{a.icon}</div>
                      <p style={{color:atLimit?'#F87171':isDark?'#ffffff':txt,fontWeight:700,fontSize:12,margin:'0 0 2px'}}>{a.label}</p>
                      <p style={{color:atLimit?'#F87171':isDark?'rgba(255,255,255,0.65)':muted,fontSize:9,margin:0}}>
                        {atLimit?`0/${FREE_LIMITS[a.limit]} used`:a.sub}
                      </p>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* -- LAUNCHPAD ---------------------------------------- */}
          {showWidget('launchpad')&&(
            launchpad&&todayTopic?(
              <div style={{background:`linear-gradient(135deg,${primary},${primD})`,
                borderRadius:20,padding:'18px',marginBottom:20,
                border:`1px solid ${accent}22`,
                boxShadow:`0 8px 32px ${primary}40`,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:-20,right:-20,width:120,height:120,
                  borderRadius:'50%',background:`${accent}08`}}/>
                <div style={{display:'flex',justifyContent:'space-between',
                  alignItems:'flex-start',marginBottom:12}}>
                  <div>
                    <p style={{color:accent,fontSize:8,fontWeight:700,
                      letterSpacing:'1.5px',margin:'0 0 4px'}}>
                      🚀 LAUNCHPAD - {launchpad.track?.toUpperCase()} TRACK
                    </p>
                    <p style={{color:'#fff',fontFamily:'Poppins,sans-serif',
                      fontWeight:800,fontSize:15,margin:'0 0 4px'}}>
                      Today: {todayTopic.topic_name}
                    </p>
                    <p style={{color:isDark?'rgba(255,255,255,0.80)':muted,fontSize:11,margin:0}}>
                      {todayTopic.subject} · Day {launchpad.current_topic_index+1}
                    </p>
                  </div>
                  <Ring pct={launchpad.syllabus_completion||0} size={54} stroke={4} color={accent}>
                    <span style={{color:accent,fontWeight:900,fontSize:10}}>
                      {Math.round(launchpad.syllabus_completion||0)}%
                    </span>
                  </Ring>
                </div>
                <div style={{height:4,borderRadius:2,
                  background:'rgba(255,255,255,0.08)',overflow:'hidden',marginBottom:12}}>
                  <div style={{height:'100%',borderRadius:2,
                    width:`${launchpad.syllabus_completion||0}%`,
                    background:`linear-gradient(90deg,${accent},${accentL})`,
                    boxShadow:`0 0 8px ${accent}66`}}/>
                </div>
                <div style={{display:'flex',gap:10}}>
                  <button onClick={()=>navigate('/student/launchpad')} style={{
                    background:`linear-gradient(135deg,${accent},${accentL})`,
                    border:'none',borderRadius:10,padding:'9px 18px',
                    color:primD,fontWeight:800,fontSize:12,cursor:'pointer',
                    boxShadow:`0 4px 16px ${accent}44`}}>
                    Start Topic →
                  </button>
                  <button onClick={()=>setFullScreen({id:'launchpad',title:'Launchpad',icon:'🚀',path:'/student/launchpad'})}
                    style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',
                      borderRadius:10,padding:'9px 14px',color:isDark?'rgba(255,255,255,0.6)':muted,
                      fontWeight:600,fontSize:12,cursor:'pointer'}}>
                    ⛶ Full View
                  </button>
                </div>
              </div>
            ):(
              <div style={{background:card,border:`1.5px dashed ${accent}35`,
                borderRadius:20,padding:'20px',marginBottom:20,textAlign:'center'}}>
                <p style={{fontSize:30,margin:'0 0 8px'}}>🚀</p>
                <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:15,margin:'0 0 4px'}}>
                  Join TryIT Launchpad
                </p>
                <p style={{color:muted,fontSize:12,margin:'0 0 12px'}}>
                  Daily topics · Weekly tests · Personal mentor · ₹79/month
                </p>
                <button onClick={()=>navigate('/student/launchpad/join')} style={{
                  background:`linear-gradient(135deg,${accent},${accentL})`,
                  border:'none',borderRadius:12,padding:'10px 24px',
                  color:primD,fontWeight:800,fontSize:13,cursor:'pointer'}}>
                  Join Launchpad →
                </button>
              </div>
            )
          )}

          {/* -- CONCEPT LEARNING WIDGET (World-class interactive teaching UI) -- */}
          {showWidget('concept') && (
            <div style={{background:card, border:`1px solid ${bdr}`, borderRadius:18, marginBottom:24, padding:16, boxShadow:isDark ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.06)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, paddingBottom:12, borderBottom:`1px solid ${bdr}`}}>
                <div>
                  <p style={{color:accent, fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, margin:0, letterSpacing:0.5}}>💡 CONCEPT LEARNING</p>
                  <p style={{color:txt, fontSize:11, margin:2, opacity:0.8}}>We teach every topic here • Interactive explanations, visuals & instant practice</p>
                </div>
                <button 
                  onClick={()=>navigate('/student/concept')}
                  style={{background:`linear-gradient(135deg,${accent},${accentL})`, border:'none', borderRadius:10, padding:'6px 16px', color:primD, fontWeight:700, fontSize:11, cursor:'pointer', boxShadow:`0 4px 12px ${accent}30`}}>
                  Explore All Topics →
                </button>
              </div>
              
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:14}}>
                {/* Sample from Test Engine screenshot - Polity Amendment */}
                <div style={{background:isDark?'rgba(255,255,255,0.06)':'#f8fafc', borderRadius:14, padding:16, border:`1px solid ${accent}25`, transition:'all 0.2s'}}
                  onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${accent}22`}}
                  onMouseLeave={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
                    <span style={{background:isDark?'rgba(180,83,9,0.25)':'#fef3c7', color:isDark?'#FBBF24':'#b45309', padding:'1px 9px', borderRadius:9999, fontSize:10, fontWeight:700}}>POLITY</span>
                    <span style={{color:muted, fontSize:10}}>Fundamental Rights</span>
                  </div>
                  <p style={{color:txt, fontWeight:600, fontSize:13.5, lineHeight:1.45, marginBottom:14}}>
                    Which Amendment removed Right to Property from Fundamental Rights?
                  </p>
                  <div style={{background:accent+'15', borderLeft:`4px solid ${accent}`, padding:12, borderRadius:8, marginBottom:14}}>
                    <p style={{color:accent, fontSize:11, fontWeight:700, margin:'0 0 4px'}}>✅ Correct Answer</p>
                    <p style={{color:txt, fontWeight:700, fontSize:15}}>44th Amendment (1978)</p>
                    <p style={{color:muted, fontSize:10, marginTop:6, lineHeight:1.3}}>It converted Right to Property into a legal right under Article 300A. This is a high-yield topic for UPSC, SSC & State PSC.</p>
                  </div>
                  <button onClick={()=>navigate('/student/test')} style={{width:'100%', background:card, border:`1px solid ${accent}40`, color:accent, fontWeight:700, fontSize:11, padding:'9px', borderRadius:10, cursor:'pointer'}}>
                    Practice 5 Similar MCQs →
                  </button>
                </div>

                {/* Additional concept cards for visual treat & world-class feel */}
                <div style={{background:isDark?'rgba(255,255,255,0.06)':'#f8fafc', borderRadius:14, padding:16, border:`1px solid ${accent}25`, transition:'all 0.2s'}}
                  onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${accent}22`}}
                  onMouseLeave={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
                    <span style={{background:isDark?'rgba(16,185,129,0.2)':'#ecfdf5', color:isDark?'#34D399':'#10b981', padding:'1px 9px', borderRadius:9999, fontSize:10, fontWeight:700}}>ECONOMY</span>
                    <span style={{color:muted, fontSize:10}}>Budget 2026</span>
                  </div>
                  <p style={{color:txt, fontWeight:600, fontSize:13.5, lineHeight:1.45, marginBottom:14}}>
                    What is the target fiscal deficit for FY 2026-27 as per latest budget?
                  </p>
                  <div style={{fontSize:32, margin:'8px 0 12px', textAlign:'center', opacity:0.9}}>4.5%</div>
                  <button onClick={()=>navigate('/student/test')} style={{width:'100%', background:card, border:`1px solid ${accent}40`, color:accent, fontWeight:700, fontSize:11, padding:'9px', borderRadius:10, cursor:'pointer'}}>
                    Learn with Visuals & Quiz →
                  </button>
                </div>

                <div style={{background:isDark?'rgba(255,255,255,0.06)':'#f8fafc', borderRadius:14, padding:16, border:`1px solid ${accent}25`, transition:'all 0.2s'}}
                  onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${accent}22`}}
                  onMouseLeave={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
                    <span style={{background:isDark?'rgba(2,132,200,0.2)':'#f0f9ff', color:isDark?'#38BDF8':'#0284c8', padding:'1px 9px', borderRadius:9999, fontSize:10, fontWeight:700}}>SCIENCE</span>
                    <span style={{color:muted, fontSize:10}}>NCERT Class 10</span>
                  </div>
                  <p style={{color:txt, fontWeight:600, fontSize:13.5, lineHeight:1.45, marginBottom:14}}>
                    Explain the working of an electric motor with diagram
                  </p>
                  <div style={{height:68, background:isDark?'linear-gradient(145deg,rgba(2,132,200,0.15),rgba(56,189,248,0.1))':'linear-gradient(145deg,#e0f2fe,#bae6fd)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, marginBottom:12, color:isDark?'#38BDF8':'#0369a1'}}>
                    ⚙️
                  </div>
                  <button onClick={()=>navigate('/student/concept')} style={{width:'100%', background:card, border:`1px solid ${accent}40`, color:accent, fontWeight:700, fontSize:11, padding:'9px', borderRadius:10, cursor:'pointer'}}>
                    Watch Animated Explanation →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* -- RECENT TESTS + ANALYTICS ROW -------------------- */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}
            className="two-col">
            {/* Recent tests */}
            {showWidget('tests')&&attempts.length>0&&(
              <div style={{background:isDark?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.9)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:`1px solid ${bdr}`,borderRadius:18,overflow:'hidden'}}>
                <div style={{padding:'14px 16px',
                  borderBottom:`1px solid ${bdr}`,
                  display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:13,margin:0}}>
                    📝 Recent Tests
                  </p>
                  <div style={{display:'flex',gap:6}}>
                    <button onClick={()=>setFullScreen({id:'tests',title:'All Tests',icon:'📝',path:'/student/history'})}
                      style={{background:'transparent',border:'none',color:muted,fontSize:14,cursor:'pointer'}}>⛶</button>
                    <button onClick={()=>navigate('/student/history')} style={{
                      background:'transparent',border:'none',color:accent,fontSize:11,fontWeight:700,cursor:'pointer'}}>
                      All →
                    </button>
                  </div>
                </div>
                {attempts.slice(0,4).map((a,i)=>{
                  const pct=a.total?Math.round((a.score/a.total)*100):0
                  const c=pct>=80?'#4ADE80':pct>=60?accent:'#F87171'
                  return(
                    <div key={i} style={{padding:'10px 16px',
                      borderBottom:i<3?`1px solid ${bdr}`:'none',
                      display:'flex',alignItems:'center',gap:10}}>
                      <Ring pct={pct} size={40} stroke={3} color={c}>
                        <span style={{color:c,fontWeight:900,fontSize:9}}>{pct}%</span>
                      </Ring>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{color:txt,fontWeight:600,fontSize:11,margin:0,
                          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          {a.exam_name||'Practice Test'}
                        </p>
                        <p style={{color:muted,fontSize:9,margin:'2px 0 0'}}>
                          {a.score}/{a.total} · {new Date(a.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                        </p>
                      </div>
                      {a.rank&&<span style={{color:accent,fontWeight:700,fontSize:10,flexShrink:0}}>#{a.rank}</span>}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Analytics mini */}
            {showWidget('analytics')&&(
              <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:18,overflow:'hidden'}}>
                <div style={{padding:'14px 16px',borderBottom:`1px solid ${bdr}`,
                  display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:13,margin:0}}>
                    📊 Analytics
                  </p>
                  <button onClick={()=>navigate('/student/analytics')} style={{
                    background:'transparent',border:'none',color:accent,fontSize:11,fontWeight:700,cursor:'pointer'}}>
                    Full →
                  </button>
                </div>
                <div style={{padding:'16px'}}>
                  {attempts.length>0?(
                    <>
                      <div style={{display:'flex',gap:8,marginBottom:12}}>
                        {[
                          {label:'Avg Score',val:`${Math.round(attempts.reduce((s,a)=>s+(a.total?a.score/a.total*100:0),0)/attempts.length||0)}%`,color:'#60A5FA'},
                          {label:'Best',val:`${Math.max(...attempts.map(a=>a.total?Math.round(a.score/a.total*100):0))}%`,color:'#4ADE80'},
                          {label:'Tests',val:attempts.length,color:accent},
                        ].map((s,i)=>(
                          <div key={i} style={{flex:1,background:isDark?'rgba(255,255,255,0.04)':'#F8FAFC',
                            borderRadius:10,padding:'8px',textAlign:'center',
                            border:`1px solid ${s.color}18`}}>
                            <p style={{color:s.color,fontWeight:900,fontFamily:'Poppins,sans-serif',
                              fontSize:16,margin:0}}>{s.val}</p>
                            <p style={{color:muted,fontSize:8,margin:'3px 0 0'}}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                      {/* Mini bar chart */}
                      <div style={{display:'flex',gap:4,alignItems:'flex-end',height:48}}>
                        {attempts.slice(0,7).reverse().map((a,i)=>{
                          const pct=a.total?Math.round((a.score/a.total)*100):0
                          const c=pct>=80?'#4ADE80':pct>=60?accent:'#F87171'
                          return(
                            <div key={i} title={`${pct}% - ${a.exam_name||'Test'}`}
                              style={{flex:1,background:`${c}22`,borderRadius:4,
                                height:`${Math.max(10,pct*0.48)}px`,
                                border:`1px solid ${c}33`,cursor:'pointer',
                                transition:'all 0.2s'}}
                              onMouseEnter={e=>e.currentTarget.style.background=`${c}44`}
                              onMouseLeave={e=>e.currentTarget.style.background=`${c}22`}/>
                          )
                        })}
                      </div>
                      <p style={{color:muted,fontSize:8,margin:'6px 0 0',textAlign:'center'}}>Last 7 tests score trend</p>
                    </>
                  ):(
                    <div style={{textAlign:'center',padding:'20px 0'}}>
                      <p style={{fontSize:28,margin:'0 0 8px'}}>📊</p>
                      <p style={{color:muted,fontSize:12}}>Take a test to see analytics</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* -- LEADERBOARD -------------------------------------- */}
          {showWidget('leaderboard')&&(
            <div style={{background:`linear-gradient(135deg,#060D18,#0F1A2E)`,
              borderRadius:20,overflow:'hidden',marginBottom:20,
              border:`1px solid ${accent}18`,
              boxShadow:isDark?`0 8px 32px rgba(0,0,0,0.3)`:'none'}}>
              <div style={{padding:'14px 16px',background:'rgba(0,0,0,0.2)',
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <p style={{color:'#fff',fontFamily:'Poppins,sans-serif',
                  fontWeight:800,fontSize:14,margin:0}}>🏆 All-India Live Rankings</p>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>setFullScreen({id:'rank',title:'Leaderboard',icon:'🏆',path:'/student/rank'})}
                    style={{background:'transparent',border:'none',color:isDark?'rgba(255,255,255,0.70)':muted,fontSize:14,cursor:'pointer'}}>⛶</button>
                  <button onClick={()=>navigate('/student/rank')} style={{
                    background:'transparent',border:'none',color:accent,
                    fontSize:11,fontWeight:700,cursor:'pointer'}}>Full Board →</button>
                </div>
              </div>
              <div style={{display:'grid',
                gridTemplateColumns:`repeat(auto-fill,minmax(min(100%,180px),1fr))`}}>
                {leaders.length>0?leaders.slice(0,6).map((r,i)=>(
                  <div key={i} style={{padding:'10px 16px',
                    borderBottom:`1px solid rgba(255,255,255,0.04)`,
                    display:'flex',alignItems:'center',gap:10}}>
                    <span style={{color:i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':(isDark?'rgba(255,255,255,0.25)':muted),
                      fontWeight:900,fontSize:i<3?15:11,width:22,flexShrink:0,textAlign:'center'}}>
                      {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${r.rank||i+1}`}
                    </span>
                    <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,
                      background:`linear-gradient(135deg,${accent},${accentL})`,
                      backgroundImage:r.profiles?.avatar_url?`url(${r.profiles.avatar_url})`:'',
                      backgroundSize:'cover',display:'flex',alignItems:'center',
                      justifyContent:'center',fontSize:11,fontWeight:900,color:primD,
                      WebkitUserDrag:'none',userSelect:'none',
                      boxShadow:i<3?`0 0 8px ${accent}44`:'none'}}>
                      {!r.profiles?.avatar_url&&(r.profiles?.name?.[0]||'S')}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{color:'#fff',fontSize:11,fontWeight:600,margin:0,
                        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {r.profiles?.name||'Student'}
                      </p>
                      <p style={{color:isDark?'rgba(255,255,255,0.60)':muted,fontSize:8,margin:0}}>
                        {r.exam_name||'-'}
                      </p>
                    </div>
                    <span style={{color:accent,fontWeight:700,fontSize:11,flexShrink:0}}>{r.score||'-'}</span>
                  </div>
                )):(
                  <div style={{padding:'24px',textAlign:'center',gridColumn:'1/-1'}}>
                    <p style={{color:isDark?'rgba(255,255,255,0.65)':muted,fontSize:13}}>
                      Take a test to appear on the leaderboard! 🎯
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* -- BOOKMARKS --------------------------------------- */}
          {showWidget('bookmarks')&&(
            <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:18,marginBottom:20}}>
              <div style={{padding:'14px 16px',borderBottom:`1px solid ${bdr}`,
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:13,margin:0}}>
                  🔖 Bookmarks
                </p>
                <button onClick={()=>navigate('/student/bookmarks')} style={{
                  background:'transparent',border:'none',color:accent,fontSize:11,fontWeight:700,cursor:'pointer'}}>
                  View all →
                </button>
              </div>
              <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:8}}>
                {[
                  {icon:'📝',type:'Question',title:'Article 300A - Right to Property distinctions',exam:'TNPSC',color:'#60A5FA'},
                  {icon:'📰',type:'Current Affairs',title:'India signs semiconductor deal with Japan',exam:'SSC CGL',color:accent},
                  {icon:'📚',type:'Material',title:'SSC CGL Maths Formula Sheet',exam:'SSC',color:'#4ADE80'},
                ].map((b,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,
                    padding:'10px',borderRadius:12,
                    background:isDark?'rgba(255,255,255,0.03)':'#F8FAFC',
                    border:`1px solid ${bdr}`,cursor:'pointer',transition:'all 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background=isDark?'rgba(255,255,255,0.06)':'#F1F5F9'}
                    onMouseLeave={e=>e.currentTarget.style.background=isDark?'rgba(255,255,255,0.03)':'#F8FAFC'}>
                    <div style={{width:34,height:34,borderRadius:9,
                      background:`${b.color}15`,display:'flex',
                      alignItems:'center',justifyContent:'center',
                      fontSize:18,flexShrink:0}}>{b.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{color:txt,fontSize:11,fontWeight:600,margin:0,
                        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {b.title}
                      </p>
                      <p style={{color:muted,fontSize:9,margin:'2px 0 0'}}>{b.type} · {b.exam}</p>
                    </div>
                    <span style={{fontSize:16,color:muted,flexShrink:0}}>›</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -- TOURNAMENT + BHARAT PULSE ROW ------------------- */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}
            className="two-col">
            {showWidget('tournament')&&(
              <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:18,overflow:'hidden'}}>
                <div style={{padding:'14px 16px',
                  background:`linear-gradient(135deg,${primary}40,transparent)`,
                  borderBottom:`1px solid ${bdr}`,
                  display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:13,margin:0}}>
                    🏟️ Tournaments
                  </p>
                  <button onClick={()=>navigate('/student/tournament')} style={{
                    background:'transparent',border:'none',color:accent,
                    fontSize:11,fontWeight:700,cursor:'pointer'}}>Join →</button>
                </div>
                <div style={{padding:'12px 16px'}}>
                  {[
                    {name:'SSC CGL Weekly Battle',date:'Tomorrow 10AM',participants:1240,prize:'1000🪙',live:false},
                    {name:'TNPSC Grand Challenge',date:'Live Now',participants:8432,prize:'5000🪙',live:true},
                  ].map((t,i)=>(
                    <div key={i} style={{padding:'10px',borderRadius:12,marginBottom:8,
                      background:t.live?`${accent}10`:isDark?'rgba(255,255,255,0.03)':'#F8FAFC',
                      border:`1px solid ${t.live?accent+'35':bdr}`,cursor:'pointer'}}
                      onClick={()=>navigate('/student/tournament')}>
                      {t.live&&(
                        <span style={{background:`${accent}20`,color:accent,
                          fontSize:8,fontWeight:700,padding:'1px 6px',
                          borderRadius:20,display:'inline-block',marginBottom:4}}>🔴 LIVE</span>
                      )}
                      <p style={{color:txt,fontSize:11,fontWeight:700,margin:'0 0 4px'}}>{t.name}</p>
                      <div style={{display:'flex',justifyContent:'space-between'}}>
                        <span style={{color:muted,fontSize:9}}>{t.date} · {t.participants.toLocaleString()} students</span>
                        <span style={{color:accent,fontSize:9,fontWeight:700}}>{t.prize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showWidget('pulse')&&(
              <div style={{background:`linear-gradient(135deg,${primary}90,${primD})`,
                borderRadius:18,overflow:'hidden',cursor:'pointer'}}
                onClick={()=>navigate('/student/pulse')}>
                <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',
                  display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <p style={{color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:13,margin:0}}>
                    🇮🇳 Bharat Pulse
                  </p>
                  <span style={{color:isDark?'rgba(255,255,255,0.70)':muted,fontSize:11}}>Today →</span>
                </div>
                <div style={{padding:'14px 16px'}}>
                  <p style={{color:accent,fontSize:9,fontWeight:700,letterSpacing:'1px',margin:'0 0 6px'}}>
                    DAILY STORY
                  </p>
                  <p style={{color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:700,
                    fontSize:13,lineHeight:1.5,margin:'0 0 10px'}}>
                    India's semiconductor mission: 5 fabs to be operational by 2026
                  </p>
                  <p style={{color:isDark?'rgba(255,255,255,0.80)':muted,fontSize:10,margin:'0 0 12px',lineHeight:1.5}}>
                    Relates to GS3 Economy, Science & Tech - appears in UPSC, SSC, IBPS
                  </p>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{background:`${accent}22`,color:accent,fontSize:9,
                      fontWeight:700,padding:'2px 8px',borderRadius:20}}>UPSC</span>
                    <span style={{background:`${accent}22`,color:accent,fontSize:9,
                      fontWeight:700,padding:'2px 8px',borderRadius:20}}>SSC</span>
                    <span style={{background:`${accent}22`,color:accent,fontSize:9,
                      fontWeight:700,padding:'2px 8px',borderRadius:20}}>IBPS</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* -- MENTOR CARD -------------------------------------- */}
          {showWidget('mentor')&&(
            <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:18,
              padding:'16px',marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <p style={{color:txt,fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:13,margin:0}}>
                  🧑‍🏫 Your Mentor
                </p>
                <button onClick={()=>navigate('/student/mentor')} style={{
                  background:'transparent',border:'none',color:accent,
                  fontSize:11,fontWeight:700,cursor:'pointer'}}>Find Mentor →</button>
              </div>
              <div style={{background:isDark?'rgba(255,255,255,0.03)':'#F8FAFC',
                border:`1px solid ${bdr}`,borderRadius:14,padding:'14px',textAlign:'center'}}>
                <p style={{fontSize:32,margin:'0 0 6px'}}>👋</p>
                <p style={{color:muted,fontSize:12,margin:'0 0 10px'}}>
                  No mentor assigned yet
                </p>
                <p style={{color:muted,fontSize:10,margin:'0 0 12px',lineHeight:1.6}}>
                  Choose from verified mentors by exam, subject, language and rating
                </p>
                <button onClick={()=>navigate('/student/mentor')} style={{
                  background:`linear-gradient(135deg,${accent},${accentL})`,
                  border:'none',borderRadius:10,padding:'8px 20px',
                  color:primD,fontWeight:700,fontSize:12,cursor:'pointer',
                  boxShadow:`0 4px 14px ${accent}33`}}>
                  Browse Mentors →
                </button>
              </div>
            </div>
          )}

          <div style={{height:80}}/>
        </div>
      </main>

      <style>{`
        .sidebar-desktop{display:flex !important}
        .right-panel-desktop{display:block !important}
        .two-col{grid-template-columns:1fr 1fr}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:768px){
          .sidebar-desktop{position:fixed !important;left:-280px !important;z-index:500;transition:left 0.3s ease}
      
      .mobile-ham{display:none}
      @media(max-width:900px){.mobile-ham{display:flex !important}}
      .sidebar-open .sidebar-desktop{left:0 !important}
      @media(max-width:900px){
        .sidebar-open::after{content:'';position:fixed;inset:0;
          background:rgba(0,0,0,0.5);z-index:199;cursor:pointer}
      }
          .two-col{grid-template-columns:1fr !important}
        }
        @media(max-width:600px){
          .two-col{grid-template-columns:1fr !important}
        }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>
    </div>
  )
}
