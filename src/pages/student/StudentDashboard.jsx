// src/pages/student/StudentDashboard.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import UpgradePopup from '../../components/student/UpgradePopup'
import {
  getProfile, getStreak, getRecentAttempts,
  getUsage, updateStreak, addCoins,
  getLaunchpadEnrollment, getTodayTopic,
  uploadAvatar, updateProfile, getLeaderboard
} from '../../lib/studentLib'

// ── Animated number ───────────────────────────────────────────────
function AnimNum({ value, duration=800, prefix='', suffix='' }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!value) return
    const start = performance.now()
    const step = (now) => {
      const p = Math.min((now-start)/duration, 1)
      const ease = 1-Math.pow(1-p,3)
      setDisplay(Math.floor(ease*value))
      if (p<1) requestAnimationFrame(step)
      else setDisplay(value)
    }
    requestAnimationFrame(step)
  }, [value])
  return <>{prefix}{display.toLocaleString()}{suffix}</>
}

// ── Floating coin animation ───────────────────────────────────────
function FloatingCoin({ amount, onDone }) {
  const { theme } = useTheme()
  const accent = theme?.accent ?? '#C9A84C'
  useEffect(() => { const t=setTimeout(onDone,1200); return()=>clearTimeout(t) },[])
  return (
    <div style={{
      position:'fixed', bottom:100, right:24,
      background:`linear-gradient(135deg,${accent},${theme?.accentLight??'#E8C44A'})`,
      color:theme?.primaryDark??'#0F2140',
      fontWeight:900, fontSize:18,
      padding:'8px 16px', borderRadius:20,
      zIndex:9998, pointerEvents:'none',
      animation:'floatUp 1.2s ease-out forwards'
    }}>
      +{amount}🪙
      <style>{`@keyframes floatUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-80px)}}`}</style>
    </div>
  )
}

const LAYOUTS = [
  { id:'focus',  label:'🎯 Focus',  desc:'Clean. Just your next test.' },
  { id:'battle', label:'⚔️ Battle', desc:'Leaderboard front. Rank up.' },
  { id:'study',  label:'📚 Study',  desc:'Materials. Classroom. Notes.' },
  { id:'game',   label:'🎮 Game',   desc:'Games hub. Earn coins.' },
]

const FREE_LIMITS = { tests:3, games:3, doubts:3 }

const QUICK_ACTIONS = [
  { icon:'⚡', label:'Quick Test',   path:'/student/test',      limit:'tests'   },
  { icon:'🎮', label:'Games',        path:'/student/games',     limit:'games'   },
  { icon:'🤝', label:'Ask Mentor',   path:'/student/guruhub',   limit:'doubts'  },
  { icon:'🏆', label:'Leaderboard',  path:'/student/rank',      limit:null       },
  { icon:'📚', label:'Classroom',    path:'/student/classroom', limit:null       },
  { icon:'🇮🇳', label:'Bharat Pulse',path:'/student/pulse',     limit:null       },
  { icon:'⚔️', label:'My Hall',      path:'/student/hall',      limit:null       },
  { icon:'🧭', label:'Career AI',    path:'/student/career',    limit:null       },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { theme, setActiveTheme, applyTheme } = useTheme()
  const isDark  = theme?.isDark ?? false
  const accent  = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primary = theme?.primary ?? '#1E3A5F'
  const primD   = theme?.primaryDark ?? '#0F2140'

  const [user,       setUser]       = useState(null)
  const [profile,    setProfile]    = useState(null)
  const [streak,     setStreak]     = useState(null)
  const [usage,      setUsage]      = useState(null)
  const [attempts,   setAttempts]   = useState([])
  const [leaders,    setLeaders]    = useState([])
  const [launchpad,  setLaunchpad]  = useState(null)
  const [todayTopic, setTodayTopic] = useState(null)
  const [layout,     setLayout]     = useState('focus')
  const [loading,    setLoading]    = useState(true)
  const [upgradeType,setUpgradeType]= useState(null)
  const [floatCoin,  setFloatCoin]  = useState(null)
  const [showLayouts,setShowLayouts]= useState(false)
  const [uploading,  setUploading]  = useState(false)
  const fileRef = useRef()

  const txt  = isDark ? '#ffffff' : 'var(--color-text,#0F1020)'
  const muted= isDark ? 'rgba(255,255,255,0.5)' : '#64748B'
  const card = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff'
  const bdr  = isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'
  const surf = isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC'
  const bg   = isDark
    ? `radial-gradient(ellipse 80% 50% at 50% 0%,${primary}30,transparent),var(--color-bg,#0F172A)`
    : `radial-gradient(ellipse 80% 40% at 50% 0%,${accent}08,transparent),#F8FAFC`

  // ── Load all data ───────────────────────────────────────────────
  const { user: authUser } = useAuth()

  useEffect(() => {
    if (!authUser) {
      navigate('/landing', { replace: true })
      return
    }
    const uid = authUser.id || authUser.userId
    setUser(authUser)

    const load = async () => {
      try {
        const [p, s, use, att, lp, lb] = await Promise.all([
          getProfile(uid).catch(() => authUser),
          getStreak(uid).catch(() => ({ current_streak:0, longest_streak:0 })),
          getUsage(uid).catch(() => ({ tests_today:0, games_today:0, doubts_today:0 })),
          getRecentAttempts(uid).catch(() => []),
          getLaunchpadEnrollment(uid).catch(() => null),
          getLeaderboard(5).catch(() => []),
        ])
        setProfile(p)
        setStreak(s)
        setUsage(use)
        setAttempts(att)
        setLaunchpad(lp)
        setLeaders(lb)
        setLayout(p?.metadata?.layout_preset || 'focus')
        if (lp) {
          const topic = await getTodayTopic(lp)
          setTodayTopic(topic)
        }
        await updateStreak(uid).catch(() => {})
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [authUser, navigate])

  // ── Handle action with limit check ─────────────────────────────
  const handleAction = useCallback((action) => {
    if (!action.limit) { navigate(action.path); return }
    const plan = profile?.plan || 'free'
    if (plan !== 'free') { navigate(action.path); return }
    const used = usage?.[`${action.limit}_today`] || 0
    const limit = FREE_LIMITS[action.limit]
    if (used >= limit) { setUpgradeType(action.limit); return }
    navigate(action.path)
  }, [profile, usage, navigate])

  // ── Avatar upload ───────────────────────────────────────────────
  const handleAvatarClick = () => {
    if (user?.id === profile?.id) fileRef.current?.click()
  }
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const url = await uploadAvatar(user.id, file)
      setProfile(p => ({ ...p, avatar_url: url }))
      // Give coins for first avatar
      if (!profile?.avatar_url) {
        await addCoins(user.id, 25, 'First avatar upload')
        setFloatCoin(25)
      }
    } catch(e) { console.error(e) }
    finally { setUploading(false) }
  }

  // ── Layout change ───────────────────────────────────────────────
  const changeLayout = async (id) => {
    setLayout(id)
    setShowLayouts(false)
    if (user) await updateProfile(user.id, {
      metadata: { ...(profile?.metadata||{}), layout_preset: id }
    })
  }

  if (loading) return (
    <div style={{
      minHeight:'100vh', background:bg,
      display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div style={{textAlign:'center'}}>
        <div style={{
          width:48, height:48, borderRadius:'50%',
          border:`3px solid ${accent}`,
          borderTopColor:'transparent',
          animation:'spin 0.8s linear infinite',
          margin:'0 auto 12px'
        }}/>
        <p style={{color:muted,fontSize:13}}>Loading your dashboard...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  const plan    = profile?.plan || 'free'
  const isPro   = plan === 'pro' || plan === 'ultra'
  const coins   = profile?.coins || 0
  const xp      = profile?.xp || 0
  const lvl     = profile?.level || 1
  const rank    = profile?.rank || null
  const badge   = profile?.badge || 'Newcomer'
  const curStr  = streak?.current_streak || 0
  const lonStr  = streak?.longest_streak || 0

  // XP to next level
  const xpForLevel = (l) => l * 500
  const xpProgress = ((xp % 500) / 500) * 100

  return (
    <div style={{ minHeight:'100vh', background:bg, transition:'background 0.4s' }}>

      {/* Floating coin */}
      {floatCoin && <FloatingCoin amount={floatCoin} onDone={()=>setFloatCoin(null)}/>}

      {/* Upgrade popup */}
      {upgradeType && (
        <UpgradePopup
          type={upgradeType}
          category={profile?.target_exam_category || 'ssc_railway'}
          onClose={()=>setUpgradeType(null)}
          onUpgrade={(plan)=>{ setUpgradeType(null); navigate('/pricing') }}
        />
      )}

      {/* Layout picker overlay */}
      {showLayouts && (
        <div style={{
          position:'fixed', inset:0, zIndex:500,
          background:'rgba(0,0,0,0.6)',
          display:'flex', alignItems:'center', justifyContent:'center'
        }} onClick={()=>setShowLayouts(false)}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:isDark?primD:'#fff',
            borderRadius:20, padding:24,
            width:'90%', maxWidth:340,
            border:`1px solid ${accent}30`
          }}>
            <p style={{color:txt,fontFamily:'Poppins,sans-serif',
              fontWeight:900,fontSize:16,margin:'0 0 16px',textAlign:'center'}}>
              Choose Your Layout
            </p>
            {LAYOUTS.map(l=>(
              <button key={l.id} onClick={()=>changeLayout(l.id)}
                style={{
                  display:'flex',alignItems:'center',gap:12,
                  width:'100%',padding:'12px 14px',
                  borderRadius:12,cursor:'pointer',marginBottom:8,
                  border:`2px solid ${layout===l.id?accent:bdr}`,
                  background:layout===l.id?`${accent}15`:'transparent'
                }}>
                <span style={{fontSize:20}}>{l.label.split(' ')[0]}</span>
                <div style={{textAlign:'left'}}>
                  <p style={{color:layout===l.id?accent:txt,
                    fontWeight:700,fontSize:13,margin:0}}>
                    {l.label.split(' ').slice(1).join(' ')}
                  </p>
                  <p style={{color:muted,fontSize:11,margin:0}}>{l.desc}</p>
                </div>
                {layout===l.id&&(
                  <span style={{marginLeft:'auto',color:accent,fontSize:16}}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth:900, margin:'0 auto', padding:'16px' }}>

        {/* ── Top bar ────────────────────────────────────────────── */}
        <div style={{
          display:'flex', alignItems:'center',
          justifyContent:'space-between', marginBottom:20
        }}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            {/* Avatar */}
            <div style={{position:'relative',flexShrink:0}}>
              <div
                onClick={handleAvatarClick}
                onContextMenu={e=>e.preventDefault()}
                style={{
                  width:52, height:52, borderRadius:'50%',
                  background:`linear-gradient(135deg,${accent},${accentL})`,
                  border:`2px solid ${accent}`,
                  backgroundImage:profile?.avatar_url?`url(${profile.avatar_url})`:``,
                  backgroundSize:'cover', backgroundPosition:'center',
                  cursor:'pointer', display:'flex',
                  alignItems:'center', justifyContent:'center',
                  WebkitUserDrag:'none', userSelect:'none',
                  fontSize:20
                }}>
                {!profile?.avatar_url && (profile?.name?.[0]||'S')}
                {uploading && (
                  <div style={{
                    position:'absolute',inset:0,borderRadius:'50%',
                    background:'rgba(0,0,0,0.5)',
                    display:'flex',alignItems:'center',justifyContent:'center'
                  }}>
                    <div style={{
                      width:20,height:20,borderRadius:'50%',
                      border:'2px solid #fff',borderTopColor:'transparent',
                      animation:'spin 0.8s linear infinite'
                    }}/>
                  </div>
                )}
              </div>
              <div style={{
                position:'absolute',bottom:-2,right:-2,
                width:16,height:16,borderRadius:'50%',
                background:'#22C55E',
                border:`2px solid ${isDark?primD:'#fff'}`
              }}/>
              <input ref={fileRef} type="file"
                accept="image/*" style={{display:'none'}}
                onChange={handleFileChange}/>
            </div>
            <div>
              <p style={{color:txt,fontFamily:'Poppins,sans-serif',
                fontWeight:700,fontSize:15,margin:0}}>
                {profile?.name || 'Student'}
              </p>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{
                  background:`${accent}20`,color:accent,
                  fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:20
                }}>{badge}</span>
                <span style={{color:muted,fontSize:11}}>
                  Lv.{lvl}
                </span>
                {rank && (
                  <span style={{color:accent,fontSize:11,fontWeight:700}}>
                    #{rank.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {/* Coins */}
            <div style={{
              display:'flex',alignItems:'center',gap:4,
              background:`${accent}15`,border:`1px solid ${accent}30`,
              borderRadius:20,padding:'5px 10px'
            }}>
              <span style={{fontSize:14}}>🪙</span>
              <span style={{color:accent,fontWeight:700,fontSize:13}}>
                <AnimNum value={coins}/>
              </span>
            </div>
            {/* Layout picker */}
            <button onClick={()=>setShowLayouts(true)} style={{
              background:card,border:`1px solid ${bdr}`,
              borderRadius:10,padding:'8px 10px',cursor:'pointer',
              color:muted,fontSize:11,fontWeight:700
            }}>⚙️ Layout</button>
          </div>
        </div>

        {/* ── XP bar ─────────────────────────────────────────────── */}
        <div style={{marginBottom:20}}>
          <div style={{
            display:'flex',justifyContent:'space-between',
            marginBottom:4
          }}>
            <span style={{color:muted,fontSize:11}}>Level {lvl} → {lvl+1}</span>
            <span style={{color:accent,fontSize:11,fontWeight:700}}>
              {xp % 500}/{xpForLevel(lvl)} XP
            </span>
          </div>
          <div style={{
            height:6,borderRadius:3,
            background:isDark?'rgba(255,255,255,0.08)':`${accent}15`,
            overflow:'hidden'
          }}>
            <div style={{
              height:'100%',borderRadius:3,
              width:`${xpProgress}%`,
              background:`linear-gradient(90deg,${accent},${accentL})`,
              transition:'width 1s cubic-bezier(0.23,1,0.32,1)'
            }}/>
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────── */}
        <div style={{
          display:'grid',gridTemplateColumns:'repeat(4,1fr)',
          gap:10,marginBottom:20
        }}>
          {[
            { label:'Streak',  value:curStr,   suffix:'d', icon:'🔥', color:'#F59E0B' },
            { label:'Best',    value:lonStr,   suffix:'d', icon:'⭐', color:accent    },
            { label:'Tests',   value:attempts.length, suffix:'', icon:'📝', color:'#60A5FA' },
            { label:'Rank',    value:rank||'—',suffix:'', icon:'🏆', color:'#4ADE80',noAnim:true },
          ].map((s,i)=>(
            <div key={i} style={{
              background:card,border:`1px solid ${s.color}22`,
              borderRadius:14,padding:'12px 8px',textAlign:'center',
              boxShadow:`0 2px 12px ${s.color}12`
            }}>
              <p style={{fontSize:18,margin:'0 0 2px'}}>{s.icon}</p>
              <p style={{
                color:s.color,fontFamily:'Poppins,sans-serif',
                fontWeight:900,fontSize:18,margin:'0 0 2px'
              }}>
                {s.noAnim
                  ? (s.value === '—' ? '—' : `#${Number(s.value).toLocaleString()}`)
                  : <AnimNum value={Number(s.value)||0} suffix={s.suffix}/>
                }
              </p>
              <p style={{color:muted,fontSize:10,margin:0}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Plan badge ─────────────────────────────────────────── */}
        {!isPro && (
          <div style={{
            background:isDark?`${accent}10`:`${accent}08`,
            border:`1px solid ${accent}30`,
            borderRadius:14,padding:'10px 14px',
            display:'flex',alignItems:'center',
            justifyContent:'space-between',marginBottom:20
          }}>
            <div>
              <p style={{color:accent,fontWeight:700,fontSize:12,margin:0}}>
                Free Plan — {FREE_LIMITS.tests - (usage?.tests_today||0)} tests left today
              </p>
              <p style={{color:muted,fontSize:11,margin:'2px 0 0'}}>
                Upgrade from ₹5/day to unlock everything
              </p>
            </div>
            <button onClick={()=>setUpgradeType('tests')} style={{
              background:`linear-gradient(135deg,${accent},${accentL})`,
              border:'none',borderRadius:10,
              padding:'7px 14px',color:primD,
              fontWeight:700,fontSize:12,cursor:'pointer'
            }}>Upgrade</button>
          </div>
        )}

        {/* ── Launchpad section ──────────────────────────────────── */}
        {launchpad && todayTopic && (
          <div style={{
            background:isDark
              ?`linear-gradient(135deg,${primary}60,${primD}80)`
              :primary,
            borderRadius:18,padding:'16px',
            marginBottom:20,border:`1px solid ${accent}25`
          }}>
            <div style={{
              display:'flex',alignItems:'center',
              justifyContent:'space-between',marginBottom:10
            }}>
              <div>
                <p style={{color:accent,fontSize:10,fontWeight:700,
                  margin:'0 0 2px',letterSpacing:'1px'}}>
                  🚀 LAUNCHPAD — {launchpad.track.toUpperCase()} TRACK
                </p>
                <p style={{color:'#fff',fontFamily:'Poppins,sans-serif',
                  fontWeight:800,fontSize:14,margin:0}}>
                  Today: {todayTopic.topic_name}
                </p>
                <p style={{color:'rgba(255,255,255,0.55)',fontSize:11,margin:'2px 0 0'}}>
                  {todayTopic.subject} • Day {launchpad.current_topic_index+1}
                </p>
              </div>
              <div style={{textAlign:'right'}}>
                <p style={{color:accent,fontWeight:900,
                  fontFamily:'Poppins,sans-serif',fontSize:18,margin:0}}>
                  {Math.round(launchpad.syllabus_completion)}%
                </p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:9,margin:0}}>
                  complete
                </p>
              </div>
            </div>
            <div style={{
              height:4,borderRadius:2,
              background:'rgba(255,255,255,0.12)',
              overflow:'hidden',marginBottom:10
            }}>
              <div style={{
                height:'100%',borderRadius:2,
                width:`${launchpad.syllabus_completion}%`,
                background:`linear-gradient(90deg,${accent},${accentL})`
              }}/>
            </div>
            <button
              onClick={()=>navigate('/student/launchpad')}
              style={{
                background:`linear-gradient(135deg,${accent},${accentL})`,
                border:'none',borderRadius:10,
                padding:'8px 16px',color:primD,
                fontWeight:700,fontSize:12,cursor:'pointer'
              }}>
              Start Today's Topic →
            </button>
          </div>
        )}

        {!launchpad && (
          <div style={{
            background:card,border:`1px dashed ${accent}40`,
            borderRadius:18,padding:'16px',
            marginBottom:20,textAlign:'center'
          }}>
            <p style={{fontSize:28,margin:'0 0 6px'}}>🚀</p>
            <p style={{color:txt,fontWeight:700,fontSize:14,margin:'0 0 4px',
              fontFamily:'Poppins,sans-serif'}}>
              Join TryIT Launchpad
            </p>
            <p style={{color:muted,fontSize:12,margin:'0 0 10px'}}>
              Daily topics + weekly tests + personal mentor. ₹79/month.
            </p>
            <button onClick={()=>navigate('/student/launchpad/join')} style={{
              background:`linear-gradient(135deg,${accent},${accentL})`,
              border:'none',borderRadius:10,padding:'8px 20px',
              color:primD,fontWeight:700,fontSize:12,cursor:'pointer'
            }}>
              Join Launchpad →
            </button>
          </div>
        )}

        {/* ── Quick actions ───────────────────────────────────────── */}
        <p style={{color:muted,fontSize:11,fontWeight:700,
          letterSpacing:'1px',margin:'0 0 10px'}}>
          QUICK ACTIONS
        </p>
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(4,1fr)',
          gap:10,marginBottom:20
        }}>
          {QUICK_ACTIONS.map((a,i)=>{
            const used  = usage?.[`${a.limit}_today`] || 0
            const limit = FREE_LIMITS[a.limit] || 999
            const atLimit = plan==='free' && a.limit && used>=limit
            return (
              <button key={i}
                onClick={()=>handleAction(a)}
                style={{
                  background:atLimit?`${bdr}`:`${card}`,
                  border:`1px solid ${atLimit?'#F87171':bdr}`,
                  borderRadius:14,padding:'14px 8px',
                  cursor:'pointer',textAlign:'center',
                  transition:'all 0.15s',
                  transform:'scale(1)',
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.05)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)'}}
              >
                <p style={{fontSize:22,margin:'0 0 4px'}}>{a.icon}</p>
                <p style={{color:atLimit?'#F87171':txt,
                  fontSize:10,fontWeight:700,margin:0}}>{a.label}</p>
                {atLimit && (
                  <p style={{color:'#F87171',fontSize:8,margin:'2px 0 0'}}>
                    Limit reached
                  </p>
                )}
                {a.limit && !atLimit && plan==='free' && (
                  <p style={{color:muted,fontSize:8,margin:'2px 0 0'}}>
                    {limit-used} left
                  </p>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Layout-specific content ─────────────────────────────── */}

        {/* FOCUS — recent test results */}
        {(layout==='focus'||layout==='study') && attempts.length>0 && (
          <div style={{marginBottom:20}}>
            <p style={{color:muted,fontSize:11,fontWeight:700,
              letterSpacing:'1px',margin:'0 0 10px'}}>RECENT TESTS</p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {attempts.slice(0,3).map((a,i)=>{
                const pct = a.total ? Math.round((a.score/a.total)*100) : 0
                const color = pct>=80?'#4ADE80':pct>=60?accent:'#F87171'
                return (
                  <div key={i} style={{
                    background:card,border:`1px solid ${bdr}`,
                    borderRadius:14,padding:'12px 14px',
                    display:'flex',alignItems:'center',gap:12
                  }}>
                    <div style={{
                      width:42,height:42,borderRadius:'50%',
                      background:`${color}15`,
                      border:`2px solid ${color}`,
                      display:'flex',alignItems:'center',
                      justifyContent:'center',
                      color,fontWeight:900,fontSize:13,flexShrink:0
                    }}>{pct}%</div>
                    <div style={{flex:1}}>
                      <p style={{color:txt,fontWeight:700,
                        fontSize:12,margin:'0 0 2px'}}>
                        {a.exam_name||'Practice Test'}
                      </p>
                      <p style={{color:muted,fontSize:10,margin:0}}>
                        {a.score}/{a.total} • {
                          new Date(a.created_at).toLocaleDateString('en-IN',
                            {day:'numeric',month:'short'})
                        }
                      </p>
                    </div>
                    {a.rank && (
                      <span style={{
                        background:`${accent}15`,color:accent,
                        fontSize:10,fontWeight:700,
                        padding:'3px 8px',borderRadius:20,flexShrink:0
                      }}>#{a.rank.toLocaleString()}</span>
                    )}
                    {a.coins_earned>0 && (
                      <span style={{
                        background:`${accent}15`,color:accent,
                        fontSize:10,fontWeight:700,flexShrink:0
                      }}>+{a.coins_earned}🪙</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* BATTLE — leaderboard */}
        {layout==='battle' && (
          <div style={{marginBottom:20}}>
            <p style={{color:muted,fontSize:11,fontWeight:700,
              letterSpacing:'1px',margin:'0 0 10px'}}>ALL-INDIA LEADERBOARD</p>
            <div style={{
              background:isDark
                ?`linear-gradient(135deg,${primD},${primary}60)`:primary,
              borderRadius:18,overflow:'hidden'
            }}>
              <div style={{
                padding:'8px 14px',background:'rgba(0,0,0,0.2)',
                display:'grid',gridTemplateColumns:'40px 1fr 60px 50px'
              }}>
                {['Rank','Student','Exam','Score'].map(h=>(
                  <span key={h} style={{color:accent,fontSize:9,fontWeight:700}}>{h}</span>
                ))}
              </div>
              {leaders.slice(0,5).map((r,i)=>(
                <div key={i} style={{
                  padding:'10px 14px',
                  borderBottom:'1px solid rgba(255,255,255,0.05)',
                  display:'grid',
                  gridTemplateColumns:'40px 1fr 60px 50px',
                  alignItems:'center'
                }}>
                  <span style={{
                    color:i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'rgba(255,255,255,0.4)',
                    fontWeight:900,fontSize:i<3?16:12
                  }}>
                    {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${r.rank||i+1}`}
                  </span>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{
                      width:24,height:24,borderRadius:'50%',
                      background:`linear-gradient(135deg,${accent},${accentL})`,
                      backgroundImage:r.profiles?.avatar_url
                        ?`url(${r.profiles.avatar_url})`:'',
                      backgroundSize:'cover',flexShrink:0,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:10,fontWeight:900,color:primD,
                      WebkitUserDrag:'none',userSelect:'none'
                    }}>
                      {!r.profiles?.avatar_url && (r.profiles?.name?.[0]||'S')}
                    </div>
                    <div>
                      <p style={{color:'#fff',fontSize:11,fontWeight:700,margin:0}}>
                        {r.profiles?.name||'Student'}
                      </p>
                      <p style={{color:'rgba(255,255,255,0.35)',fontSize:9,margin:0}}>
                        {r.profiles?.state||'India'}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    background:'rgba(255,255,255,0.08)',
                    color:'rgba(255,255,255,0.6)',
                    fontSize:9,padding:'2px 6px',borderRadius:20
                  }}>{r.exam_name||'—'}</span>
                  <span style={{color:accent,fontWeight:700,fontSize:12}}>
                    {r.score||'—'}
                  </span>
                </div>
              ))}
              <div style={{padding:'10px 14px',textAlign:'center'}}>
                <button onClick={()=>navigate('/student/rank')} style={{
                  background:`linear-gradient(135deg,${accent},${accentL})`,
                  border:'none',borderRadius:10,padding:'7px 20px',
                  color:primD,fontWeight:700,fontSize:11,cursor:'pointer'
                }}>See Full Leaderboard →</button>
              </div>
            </div>
          </div>
        )}

        {/* GAME layout */}
        {layout==='game' && (
          <div style={{marginBottom:20}}>
            <p style={{color:muted,fontSize:11,fontWeight:700,
              letterSpacing:'1px',margin:'0 0 10px'}}>TODAY'S GAMES</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[
                {e:'🔢',n:'Math Blitz',c:'#60A5FA',coins:15},
                {e:'🌍',n:'GK Battle',c:accent,coins:12},
                {e:'📝',n:'Word Rush',c:'#4ADE80',coins:10},
                {e:'🧩',n:'Logic Grid',c:'#A78BFA',coins:18},
              ].map((g,i)=>{
                const used = usage?.games_today||0
                const atLimit = plan==='free' && used>=FREE_LIMITS.games
                return (
                  <button key={i}
                    onClick={()=>handleAction({path:'/student/games',limit:'games'})}
                    style={{
                      background:card,border:`1px solid ${g.c}25`,
                      borderRadius:14,padding:'14px',cursor:'pointer',
                      textAlign:'left',opacity:atLimit?0.6:1
                    }}>
                    <p style={{fontSize:28,margin:'0 0 6px'}}>{g.e}</p>
                    <p style={{color:txt,fontWeight:700,fontSize:12,margin:'0 0 2px'}}>{g.n}</p>
                    <p style={{color:g.c,fontSize:11,fontWeight:700,margin:0}}>+{g.coins}🪙</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Bottom nav ──────────────────────────────────────────── */}
        <div style={{height:80}}/>
      </div>

      {/* Fixed bottom nav */}
      <div style={{
        position:'fixed',bottom:0,left:0,right:0,
        background:isDark?'rgba(15,23,42,0.97)':' rgba(255,255,255,0.97)',
        backdropFilter:'blur(20px)',
        borderTop:`1px solid ${bdr}`,
        display:'flex',justifyContent:'space-around',
        padding:'8px 0 max(8px,env(safe-area-inset-bottom))',
        zIndex:100
      }}>
        {[
          {icon:'🏠',label:'Home',    path:'/student'},
          {icon:'📝',label:'Test',     path:'/student/test'},
          {icon:'🏆',label:'Rank',     path:'/student/rank'},
          {icon:'🎮',label:'Games',    path:'/student/games'},
          {icon:'👤',label:'Profile',  path:'/student/profile'},
        ].map((n,i)=>(
          <button key={i} onClick={()=>navigate(n.path)}
            style={{
              display:'flex',flexDirection:'column',
              alignItems:'center',gap:2,background:'transparent',
              border:'none',cursor:'pointer',padding:'4px 12px'
            }}>
            <span style={{fontSize:20}}>{n.icon}</span>
            <span style={{color:muted,fontSize:9,fontWeight:600}}>{n.label}</span>
          </button>
        ))}
      </div>

    </div>
  )
}
