// src/pages/student/StudentDashboard.jsx
// World-class premium student dashboard
// Left sidebar (desktop) + Bottom nav (mobile) + Right panel (wide)
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import UpgradePopup from '../../components/student/UpgradePopup'
import {
  getProfile, getStreak, getRecentAttempts,
  getUsage, updateStreak, addCoins,
  getLaunchpadEnrollment, getTodayTopic,
  uploadAvatar, updateProfile, getLeaderboard
} from '../../lib/studentLib'

// ── Animated counter ──────────────────────────────────────────────
function AnimNum({ value=0, duration=1000, prefix='', suffix='' }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!value) return
    const start = performance.now()
    const tick = now => {
      const p = Math.min((now - start) / duration, 1)
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * value))
      if (p < 1) requestAnimationFrame(tick)
      else setN(value)
    }
    requestAnimationFrame(tick)
  }, [value])
  return <>{prefix}{n.toLocaleString('en-IN')}{suffix}</>
}

// ── Floating coin pop ─────────────────────────────────────────────
function CoinPop({ amount, onDone }) {
  const { theme } = useTheme()
  useEffect(() => { const t = setTimeout(onDone, 1400); return () => clearTimeout(t) }, [])
  return (
    <div style={{
      position: 'fixed', bottom: 120, right: 24, zIndex: 9998,
      background: `linear-gradient(135deg,${theme?.accent??'#C9A84C'},${theme?.accentLight??'#E8C44A'})`,
      color: theme?.primaryDark ?? '#0F2140',
      fontFamily: 'Poppins,sans-serif', fontWeight: 900, fontSize: 20,
      padding: '10px 20px', borderRadius: 24,
      boxShadow: `0 8px 32px ${theme?.accent??'#C9A84C'}44`,
      animation: 'coinPop 1.4s ease-out forwards',
      pointerEvents: 'none',
    }}>
      +{amount} 🪙
      <style>{`@keyframes coinPop{0%{opacity:1;transform:translateY(0) scale(1)}60%{opacity:1;transform:translateY(-50px) scale(1.2)}100%{opacity:0;transform:translateY(-90px) scale(0.8)}}`}</style>
    </div>
  )
}

// ── Progress ring ─────────────────────────────────────────────────
function Ring({ pct=0, size=56, stroke=4, color='#C9A84C', children }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.08)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.23,1,0.32,1)' }}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>{children}</div>
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'home',      icon: '🏠', label: 'Home',        path: '/student'              },
  { id: 'test',      icon: '📝', label: 'Test',         path: '/student/test'         },
  { id: 'rank',      icon: '🏆', label: 'Rank',         path: '/student/rank'         },
  { id: 'launchpad', icon: '🚀', label: 'Launchpad',    path: '/student/launchpad'    },
  { id: 'games',     icon: '🎮', label: 'Games',         path: '/student/games'        },
  { id: 'hall',      icon: '⚔️', label: 'Hall',          path: '/student/hall'         },
  { id: 'guruhub',   icon: '🤝', label: 'GuruHub',      path: '/student/guruhub'      },
  { id: 'classroom', icon: '📚', label: 'Classroom',    path: '/student/classroom'    },
  { id: 'pulse',     icon: '🇮🇳', label: 'Bharat Pulse', path: '/student/pulse'        },
  { id: 'career',    icon: '🧭', label: 'Career AI',    path: '/student/career'       },
  { id: 'community', icon: '💬', label: 'Community',    path: '/student/community'    },
  { id: 'profile',   icon: '👤', label: 'Profile',      path: '/student/profile'      },
  { id: 'settings',  icon: '⚙️', label: 'Settings',     path: '/student/settings'     },
]

const FREE_LIMITS = { tests: 3, games: 3, doubts: 3 }

export default function StudentDashboard() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { theme, applyTheme, setActiveTheme } = useTheme()
  const { user: authUser } = useAuth()
  const fileRef   = useRef()

  const isDark  = theme?.isDark ?? false
  const accent  = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primary = theme?.primary ?? '#1E3A5F'
  const primD   = theme?.primaryDark ?? '#0F2140'

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
  const [collapsed,  setCollapsed]  = useState(false)

  // colours
  const txt  = isDark ? '#fff' : 'var(--color-text,#0F1020)'
  const muted= isDark ? 'rgba(255,255,255,0.45)' : '#64748B'
  const card = isDark ? 'rgba(255,255,255,0.04)' : '#fff'
  const bdr  = isDark ? 'rgba(255,255,255,0.07)' : '#E2E8F0'
  const surf = isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC'

  // sidebar gradient — always dark for premium look
  const sideGrad = `linear-gradient(180deg,${primD} 0%,${primary} 100%)`

  useEffect(() => {
    if (!authUser) { navigate('/landing', { replace: true }); return }
    const uid = authUser.id || authUser.userId
    const load = async () => {
      try {
        const [p, s, u, att, lp, lb] = await Promise.all([
          getProfile(uid).catch(() => null),
          getStreak(uid).catch(() => ({ current_streak:0, longest_streak:0 })),
          getUsage(uid).catch(() => ({ tests_today:0, games_today:0, doubts_today:0 })),
          getRecentAttempts(uid, 5).catch(() => []),
          getLaunchpadEnrollment(uid).catch(() => null),
          getLeaderboard(8).catch(() => []),
        ])
        setProfile(p || {
          name: authUser.name || 'Student',
          avatar_url: null,
          coins: authUser.coins || 0,
          xp: authUser.xp || 0,
          level: authUser.level || 1,
          rank: null,
          badge: authUser.levelTitle || 'Newcomer',
          plan: authUser.plan || 'free',
          state: authUser.state || '',
        })
        setStreak(s)
        setUsage(u)
        setAttempts(att)
        setLaunchpad(lp)
        setLeaders(lb)
        if (lp) { const t = await getTodayTopic(lp).catch(()=>null); setTodayTopic(t) }
        await updateStreak(uid).catch(()=>{})
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [authUser, navigate])

  const handleNav = useCallback((item) => {
    const limitMap = { '/student/test': 'tests', '/student/games': 'games', '/student/guruhub': 'doubts' }
    const limit = limitMap[item.path]
    const plan  = profile?.plan || 'free'
    if (limit && plan === 'free') {
      const used = usage?.[`${limit}_today`] || 0
      if (used >= FREE_LIMITS[limit]) { setUpgradeFor(limit); return }
    }
    navigate(item.path)
  }, [profile, usage, navigate])

  const handleAvatarClick = () => fileRef.current?.click()
  const handleFileChange  = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !authUser) return
    setUploading(true)
    try {
      const uid = authUser.id || authUser.userId
      const url = await uploadAvatar(uid, file)
      setProfile(p => ({ ...p, avatar_url: url }))
      if (!profile?.avatar_url) {
        await addCoins(uid, 25, 'First avatar upload')
        setCoinPop(25)
      }
    } catch(e) { console.error(e) }
    finally { setUploading(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: isDark ? primD : '#F8FAFC',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <Ring pct={75} size={64} color={accent}>
        <span style={{ fontSize: 22 }}>🎓</span>
      </Ring>
      <p style={{ color: muted, fontFamily: 'Poppins,sans-serif', fontSize: 14 }}>
        Loading your dashboard…
      </p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const plan    = profile?.plan || 'free'
  const isPro   = plan === 'pro' || plan === 'ultra'
  const coins   = profile?.coins || 0
  const xp      = profile?.xp || 0
  const lvl     = profile?.level || 1
  const rank    = profile?.rank
  const badge   = profile?.badge || 'Newcomer'
  const curStr  = streak?.current_streak || 0
  const xpPct   = ((xp % 500) / 500) * 100
  const activeId= location.pathname === '/student' ? 'home'
    : NAV_ITEMS.find(n => location.pathname.startsWith(n.path) && n.path !== '/student')?.id || 'home'

  return (
    <div style={{ display: 'flex', minHeight: '100vh',
      background: isDark ? `radial-gradient(ellipse 80% 50% at 20% 0%,${primary}20,transparent),${primD}` : '#F0F4F8',
      fontFamily: 'Inter,sans-serif' }}>

      {/* ── Popups ──────────────────────────────────────────────── */}
      {coinPop && <CoinPop amount={coinPop} onDone={() => setCoinPop(null)}/>}
      {upgradeFor && (
        <UpgradePopup type={upgradeFor}
          category={profile?.target_exam_category || 'ssc_railway'}
          onClose={() => setUpgradeFor(null)}
          onUpgrade={() => { setUpgradeFor(null); navigate('/pricing') }}/>
      )}

      {/* ── LEFT SIDEBAR (desktop) ───────────────────────────────── */}
      <aside style={{
        width: collapsed ? 72 : 240,
        minHeight: '100vh',
        background: sideGrad,
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
        transition: 'width 0.3s cubic-bezier(0.23,1,0.32,1)',
        zIndex: 200, flexShrink: 0,
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      }} className="sidebar-desktop">

        {/* Logo + collapse */}
        <div style={{ padding: '20px 16px 16px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9,
                background: `linear-gradient(135deg,${accent},${accentL})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Poppins,sans-serif', fontWeight: 900, fontSize: 12,
                color: primD }}>TI</div>
              <span style={{ color: '#fff', fontFamily: 'Poppins,sans-serif',
                fontWeight: 800, fontSize: 16 }}>
                Try<span style={{ color: accent }}>IT</span>
              </span>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none',
            borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)', fontSize: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>{collapsed ? '→' : '←'}</button>
        </div>

        {/* User card */}
        <div style={{ padding: '12px 16px', margin: '0 10px 8px',
          background: 'rgba(255,255,255,0.06)', borderRadius: 14,
          border: `1px solid rgba(255,255,255,0.08)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              onClick={handleAvatarClick}
              onContextMenu={e => e.preventDefault()}
              style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,${accent},${accentL})`,
                border: `2px solid ${accent}`,
                backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : '',
                backgroundSize: 'cover', backgroundPosition: 'center',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 900, fontSize: 16,
                color: primD, WebkitUserDrag: 'none', userSelect: 'none',
                position: 'relative',
              }}>
              {!profile?.avatar_url && (profile?.name?.[0] || 'S')}
              {uploading && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid #fff', borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite' }}/>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*"
              style={{ display: 'none' }} onChange={handleFileChange}/>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 13,
                  margin: 0, whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis' }}>
                  {profile?.name || 'Student'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <span style={{ background: `${accent}22`, color: accent,
                    fontSize: 8, fontWeight: 700, padding: '1px 6px', borderRadius: 20 }}>
                    {badge}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
                    Lv.{lvl}
                  </span>
                </div>
              </div>
            )}
          </div>
          {!collapsed && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>XP Progress</span>
                <span style={{ color: accent, fontSize: 9, fontWeight: 700 }}>{Math.round(xpPct)}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${xpPct}%`,
                  background: `linear-gradient(90deg,${accent},${accentL})`,
                  transition: 'width 1s ease' }}/>
              </div>
            </div>
          )}
        </div>

        {/* Streak + coins */}
        {!collapsed && (
          <div style={{ display: 'flex', gap: 6, padding: '0 16px', marginBottom: 8 }}>
            <div style={{ flex: 1, background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10,
              padding: '7px 10px', textAlign: 'center' }}>
              <p style={{ color: '#F59E0B', fontWeight: 900, fontSize: 16,
                fontFamily: 'Poppins,sans-serif', margin: 0 }}>🔥{curStr}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8, margin: '2px 0 0' }}>Streak</p>
            </div>
            <div style={{ flex: 1, background: `${accent}12`,
              border: `1px solid ${accent}22`, borderRadius: 10,
              padding: '7px 10px', textAlign: 'center' }}>
              <p style={{ color: accent, fontWeight: 900, fontSize: 16,
                fontFamily: 'Poppins,sans-serif', margin: 0 }}>
                <AnimNum value={coins}/>🪙
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8, margin: '2px 0 0' }}>Coins</p>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
          {NAV_ITEMS.map(item => {
            const active = activeId === item.id
            return (
              <button key={item.id} onClick={() => handleNav(item)}
                title={collapsed ? item.label : ''}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: collapsed ? 0 : 10,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  width: '100%', padding: collapsed ? '10px' : '10px 12px',
                  borderRadius: 10, cursor: 'pointer', marginBottom: 2,
                  border: 'none', transition: 'all 0.15s',
                  background: active
                    ? `linear-gradient(135deg,${accent}22,${accent}10)`
                    : 'transparent',
                  borderLeft: active ? `3px solid ${accent}` : '3px solid transparent',
                }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && (
                  <span style={{
                    color: active ? accent : 'rgba(255,255,255,0.6)',
                    fontSize: 13, fontWeight: active ? 700 : 400,
                    transition: 'color 0.15s',
                  }}>{item.label}</span>
                )}
                {!collapsed && item.id === 'test' && plan === 'free' && (
                  <span style={{ marginLeft: 'auto', background: 'rgba(248,113,113,0.15)',
                    color: '#F87171', fontSize: 8, padding: '1px 5px', borderRadius: 20 }}>
                    {FREE_LIMITS.tests - (usage?.tests_today||0)} left
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Upgrade CTA */}
        {!isPro && !collapsed && (
          <div style={{ margin: '8px 10px 16px', background: `linear-gradient(135deg,${accent}18,${accent}08)`,
            border: `1px solid ${accent}28`, borderRadius: 12, padding: '10px 12px' }}>
            <p style={{ color: accent, fontWeight: 700, fontSize: 11, margin: '0 0 4px' }}>
              🚀 Upgrade to Pro
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, margin: '0 0 8px', lineHeight: 1.4 }}>
              Unlimited tests · All 42 languages · Full rank
            </p>
            <button onClick={() => navigate('/pricing')} style={{
              width: '100%', background: `linear-gradient(135deg,${accent},${accentL})`,
              border: 'none', borderRadius: 8, padding: '7px',
              color: primD, fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>
              From ₹5/day →
            </button>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', maxHeight: '100vh' }}>

        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${bdr}`,
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div>
            <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
              fontWeight: 700, fontSize: 18, margin: 0 }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},
              {' '}<span style={{ color: accent }}>{profile?.name?.split(' ')[0] || 'Student'}</span> 👋
            </p>
            <p style={{ color: muted, fontSize: 12, margin: '2px 0 0' }}>
              {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => navigate('/student/settings')} style={{
              background: card, border: `1px solid ${bdr}`, borderRadius: 10,
              width: 38, height: 38, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚙️</button>
          </div>
        </div>

        <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>

          {/* ── Hero stats ──────────────────────────────────────── */}
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
            gap: 14, marginBottom: 24 }}>
            {[
              { label: 'All-India Rank', value: rank, display: rank ? `#${rank.toLocaleString('en-IN')}` : '—',
                icon: '🏆', color: '#FFD700', ring: rank ? Math.min(100, 100 - (rank/100000)*100) : 0,
                sub: 'After last test' },
              { label: 'Day Streak', value: curStr, display: curStr,
                icon: '🔥', color: '#F59E0B', ring: Math.min(100, curStr * 3),
                sub: `Best: ${streak?.longest_streak || 0}d` },
              { label: 'Coins Earned', value: coins, display: coins,
                icon: '🪙', color: accent, ring: Math.min(100, (coins/1000)*100),
                sub: 'Spend in store' },
              { label: 'Tests Done', value: attempts.length, display: attempts.length,
                icon: '📝', color: '#60A5FA', ring: Math.min(100, attempts.length * 10),
                sub: `Level ${lvl}` },
            ].map((s, i) => (
              <div key={i} style={{ background: card,
                border: `1px solid ${s.color}22`,
                borderRadius: 18, padding: '16px',
                boxShadow: isDark ? `0 4px 24px rgba(0,0,0,0.2)` : `0 2px 12px ${s.color}14`,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <Ring pct={s.ring} size={56} stroke={4} color={s.color}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                </Ring>
                <div>
                  <p style={{ color: s.color, fontFamily: 'Poppins,sans-serif',
                    fontWeight: 900, fontSize: 22, margin: 0, lineHeight: 1 }}>
                    {typeof s.value === 'number'
                      ? <AnimNum value={s.value} prefix={i===0?'#':''}/>
                      : s.display}
                  </p>
                  <p style={{ color: txt, fontWeight: 600, fontSize: 12, margin: '3px 0 2px' }}>{s.label}</p>
                  <p style={{ color: muted, fontSize: 10, margin: 0 }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Free plan limit bar ──────────────────────────────── */}
          {!isPro && (
            <div style={{ background: isDark ? `${accent}08` : `${accent}06`,
              border: `1px solid ${accent}28`, borderRadius: 14,
              padding: '12px 16px', marginBottom: 24,
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: accent, fontWeight: 700, fontSize: 13, margin: 0 }}>
                  Free Plan — {FREE_LIMITS.tests - (usage?.tests_today||0)} tests left today
                </p>
                <p style={{ color: muted, fontSize: 11, margin: '2px 0 0' }}>
                  Refer a friend who buys Pro → get 7 days Pro free!
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => navigate('/referral')} style={{
                  background: 'transparent', border: `1px solid ${accent}40`,
                  borderRadius: 10, padding: '7px 14px', color: accent,
                  fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Refer & Earn
                </button>
                <button onClick={() => setUpgradeFor('tests')} style={{
                  background: `linear-gradient(135deg,${accent},${accentL})`,
                  border: 'none', borderRadius: 10, padding: '7px 14px',
                  color: primD, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                  Upgrade ₹5/day →
                </button>
              </div>
            </div>
          )}

          {/* ── Today's quick actions ────────────────────────────── */}
          <p style={{ color: muted, fontSize: 10, fontWeight: 700,
            letterSpacing: '1.5px', margin: '0 0 12px' }}>TODAY'S ACTIONS</p>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))',
            gap: 12, marginBottom: 24 }}>
            {[
              { icon: '⚡', label: 'Quick Test', sub: '10 questions', color: '#60A5FA',
                path: '/student/test', limit: 'tests' },
              { icon: '🚀', label: 'Launchpad', sub: "Today's topic", color: accent,
                path: '/student/launchpad', limit: null },
              { icon: '🎮', label: 'Play Game', sub: 'Earn coins', color: '#4ADE80',
                path: '/student/games', limit: 'games' },
              { icon: '🤝', label: 'Ask Doubt', sub: 'Get answer fast', color: '#A78BFA',
                path: '/student/guruhub', limit: 'doubts' },
              { icon: '📚', label: 'Classroom', sub: 'PDFs & Notes', color: '#FB923C',
                path: '/student/classroom', limit: null },
              { icon: '🇮🇳', label: 'Bharat Pulse', sub: 'Daily story', color: '#4ADE80',
                path: '/student/pulse', limit: null },
              { icon: '⚔️', label: 'Hall Battle', sub: 'Challenge batch', color: '#F87171',
                path: '/student/hall', limit: null },
              { icon: '📊', label: 'Analytics', sub: 'Your progress', color: '#60A5FA',
                path: '/student/analytics', limit: null },
            ].map((a, i) => {
              const limitKey = a.limit
              const used = usage?.[`${limitKey}_today`] || 0
              const atLimit = plan === 'free' && limitKey && used >= FREE_LIMITS[limitKey]
              return (
                <button key={i} onClick={() => handleNav({ path: a.path, ...a })}
                  style={{
                    background: atLimit ? 'transparent' : card,
                    border: `1.5px solid ${atLimit ? '#F87171' : a.color}28`,
                    borderRadius: 16, padding: '14px 12px',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                    opacity: atLimit ? 0.7 : 1,
                    boxShadow: isDark ? 'none' : `0 2px 8px ${a.color}12`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${a.color}22` }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=isDark?'none':`0 2px 8px ${a.color}12` }}>
                  <p style={{ fontSize: 26, margin: '0 0 6px' }}>{a.icon}</p>
                  <p style={{ color: atLimit ? '#F87171' : txt,
                    fontWeight: 700, fontSize: 12, margin: '0 0 3px' }}>{a.label}</p>
                  <p style={{ color: atLimit ? '#F87171' : muted, fontSize: 10, margin: 0 }}>
                    {atLimit ? `Limit reached · Upgrade ₹5` : a.sub}
                  </p>
                </button>
              )
            })}
          </div>

          {/* ── Launchpad section ────────────────────────────────── */}
          {launchpad && todayTopic ? (
            <div style={{
              background: `linear-gradient(135deg,${primary},${primD})`,
              borderRadius: 20, padding: '20px', marginBottom: 24,
              border: `1px solid ${accent}25`,
              boxShadow: `0 8px 32px ${primary}40`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ color: accent, fontSize: 9, fontWeight: 700,
                    letterSpacing: '1.5px', margin: '0 0 4px' }}>
                    🚀 LAUNCHPAD — {launchpad.track?.toUpperCase()} TRACK
                  </p>
                  <p style={{ color: '#fff', fontFamily: 'Poppins,sans-serif',
                    fontWeight: 800, fontSize: 16, margin: '0 0 4px' }}>
                    Today: {todayTopic.topic_name}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>
                    {todayTopic.subject} · Day {launchpad.current_topic_index+1}
                  </p>
                </div>
                <Ring pct={launchpad.syllabus_completion||0} size={56} stroke={4} color={accent}>
                  <span style={{ color: accent, fontWeight: 900, fontSize: 11 }}>
                    {Math.round(launchpad.syllabus_completion||0)}%
                  </span>
                </Ring>
              </div>
              <div style={{ height: 5, borderRadius: 3,
                background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ height: '100%', borderRadius: 3,
                  width: `${launchpad.syllabus_completion||0}%`,
                  background: `linear-gradient(90deg,${accent},${accentL})` }}/>
              </div>
              <button onClick={() => navigate('/student/launchpad')} style={{
                background: `linear-gradient(135deg,${accent},${accentL})`,
                border: 'none', borderRadius: 12, padding: '10px 20px',
                color: primD, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                Start Today's Topic →
              </button>
            </div>
          ) : !launchpad && (
            <div style={{ background: card, border: `1.5px dashed ${accent}40`,
              borderRadius: 20, padding: '20px', marginBottom: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 32, margin: '0 0 8px' }}>🚀</p>
              <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
                fontWeight: 800, fontSize: 16, margin: '0 0 4px' }}>
                Join TryIT Launchpad
              </p>
              <p style={{ color: muted, fontSize: 13, margin: '0 0 14px', lineHeight: 1.6 }}>
                Daily topics · Weekly tests · Personal mentor · ₹79/month
              </p>
              <button onClick={() => navigate('/student/launchpad/join')} style={{
                background: `linear-gradient(135deg,${accent},${accentL})`,
                border: 'none', borderRadius: 12, padding: '10px 24px',
                color: primD, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                Join Launchpad →
              </button>
            </div>
          )}

          {/* ── Recent tests ─────────────────────────────────────── */}
          {attempts.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 12 }}>
                <p style={{ color: muted, fontSize: 10, fontWeight: 700,
                  letterSpacing: '1.5px', margin: 0 }}>RECENT TESTS</p>
                <button onClick={() => navigate('/student/history')} style={{
                  background: 'transparent', border: 'none', color: accent,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  View all →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {attempts.slice(0,4).map((a, i) => {
                  const pct = a.total ? Math.round((a.score/a.total)*100) : 0
                  const c   = pct >= 80 ? '#4ADE80' : pct >= 60 ? accent : '#F87171'
                  return (
                    <div key={i} style={{ background: card,
                      border: `1px solid ${bdr}`, borderRadius: 14,
                      padding: '12px 16px', display: 'flex',
                      alignItems: 'center', gap: 14 }}>
                      <Ring pct={pct} size={46} stroke={3} color={c}>
                        <span style={{ color: c, fontWeight: 900, fontSize: 10 }}>{pct}%</span>
                      </Ring>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: txt, fontWeight: 700, fontSize: 13, margin: '0 0 3px' }}>
                          {a.exam_name || 'Practice Test'}
                        </p>
                        <p style={{ color: muted, fontSize: 11, margin: 0 }}>
                          {a.score}/{a.total} questions ·{' '}
                          {new Date(a.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {a.rank && (
                          <p style={{ color: accent, fontWeight: 800,
                            fontSize: 13, margin: '0 0 2px' }}>
                            #{a.rank.toLocaleString('en-IN')}
                          </p>
                        )}
                        {a.coins_earned > 0 && (
                          <p style={{ color: accent, fontSize: 11, margin: 0 }}>
                            +{a.coins_earned}🪙
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ height: 80 }}/>
        </div>
      </main>

      {/* ── RIGHT PANEL (wide screens) ───────────────────────────── */}
      <aside style={{ width: 280, flexShrink: 0, padding: '20px 16px 20px 0' }}
        className="right-panel-desktop">
        <div style={{ position: 'sticky', top: 80 }}>

          {/* Leaderboard */}
          <div style={{ background: `linear-gradient(135deg,${primD},${primary}60)`,
            borderRadius: 18, overflow: 'hidden', marginBottom: 16,
            border: `1px solid ${accent}20` }}>
            <div style={{ padding: '12px 14px',
              background: 'rgba(0,0,0,0.2)', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#fff', fontFamily: 'Poppins,sans-serif',
                fontWeight: 800, fontSize: 13, margin: 0 }}>🏆 Live Rankings</p>
              <button onClick={() => navigate('/student/rank')} style={{
                background: 'transparent', border: 'none', color: accent,
                fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Full →</button>
            </div>
            {leaders.slice(0,5).map((r, i) => (
              <div key={i} style={{ padding: '9px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'rgba(255,255,255,0.3)',
                  fontWeight: 900, fontSize: i<3?15:11, width: 24, flexShrink: 0 }}>
                  {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${r.rank||i+1}`}
                </span>
                <div style={{ width: 28, height: 28, borderRadius: '50%',
                  background: `linear-gradient(135deg,${accent},${accentL})`,
                  backgroundImage: r.profiles?.avatar_url ? `url(${r.profiles.avatar_url})` : '',
                  backgroundSize: 'cover', flexShrink: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 900, color: primD,
                  WebkitUserDrag: 'none', userSelect: 'none' }}>
                  {!r.profiles?.avatar_url && (r.profiles?.name?.[0] || 'S')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: 11, fontWeight: 600,
                    margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.profiles?.name || 'Student'}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, margin: 0 }}>
                    {r.exam_name || '—'}
                  </p>
                </div>
                <span style={{ color: accent, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                  {r.score || '—'}
                </span>
              </div>
            ))}
            {leaders.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                  Take a test to appear here!
                </p>
              </div>
            )}
          </div>

          {/* Mentor card */}
          <div style={{ background: card, border: `1px solid ${bdr}`,
            borderRadius: 18, padding: '14px', marginBottom: 16 }}>
            <p style={{ color: txt, fontWeight: 700, fontSize: 13,
              margin: '0 0 8px', fontFamily: 'Poppins,sans-serif' }}>
              🧑‍🏫 Your Mentor
            </p>
            <div style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
              border: `1px solid ${bdr}`, borderRadius: 12, padding: '10px',
              textAlign: 'center' }}>
              <p style={{ fontSize: 28, margin: '0 0 6px' }}>👋</p>
              <p style={{ color: muted, fontSize: 12, margin: '0 0 8px' }}>
                No mentor assigned yet
              </p>
              <button onClick={() => navigate('/student/mentor')} style={{
                background: `linear-gradient(135deg,${accent},${accentL})`,
                border: 'none', borderRadius: 8, padding: '7px 14px',
                color: primD, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
                Find a Mentor →
              </button>
            </div>
          </div>

          {/* Community */}
          <div style={{ background: card, border: `1px solid ${bdr}`,
            borderRadius: 18, padding: '14px' }}>
            <p style={{ color: txt, fontWeight: 700, fontSize: 13,
              margin: '0 0 8px', fontFamily: 'Poppins,sans-serif' }}>
              💬 TryIT Community
            </p>
            <p style={{ color: muted, fontSize: 12, margin: '0 0 10px', lineHeight: 1.5 }}>
              Suggest features, report bugs, vote on improvements.
            </p>
            <button onClick={() => navigate('/student/community')} style={{
              width: '100%', background: 'transparent',
              border: `1px solid ${accent}40`, borderRadius: 8, padding: '7px',
              color: accent, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
              Open Community →
            </button>
          </div>
        </div>
      </aside>

      {/* ── BOTTOM NAV (mobile) ──────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: isDark ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${bdr}`,
        display: 'flex', justifyContent: 'space-around',
        padding: '8px 0 max(8px,env(safe-area-inset-bottom))',
      }} className="bottom-nav-mobile">
        {[
          { icon:'🏠', label:'Home',    path:'/student'           },
          { icon:'📝', label:'Test',    path:'/student/test'      },
          { icon:'🏆', label:'Rank',    path:'/student/rank'      },
          { icon:'🎮', label:'Games',   path:'/student/games'     },
          { icon:'👤', label:'Profile', path:'/student/profile'   },
        ].map((n, i) => (
          <button key={i} onClick={() => navigate(n.path)} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 2,
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '4px 12px',
          }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ color: muted, fontSize: 9, fontWeight: 600 }}>{n.label}</span>
          </button>
        ))}
      </div>

      {/* Responsive CSS */}
      <style>{`
        .sidebar-desktop { display: flex !important; }
        .right-panel-desktop { display: block !important; }
        .bottom-nav-mobile { display: none !important; }
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 1200px) {
          .right-panel-desktop { display: none !important; }
        }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .bottom-nav-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
