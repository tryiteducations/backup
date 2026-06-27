// src/pages/student/StudentSettings.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { uploadAvatar } from '../../lib/studentLib'
import { THEME_LIST } from '../../lib/themes'

const LANGUAGES = [
  {code:'en',name:'English',native:'English'},
  {code:'hi',name:'Hindi',native:'हिन्दी'},
  {code:'ta',name:'Tamil',native:'தமிழ்'},
  {code:'te',name:'Telugu',native:'తెలుగు'},
  {code:'kn',name:'Kannada',native:'ಕನ್ನಡ'},
  {code:'ml',name:'Malayalam',native:'മലയാളം'},
  {code:'bn',name:'Bengali',native:'বাংলা'},
  {code:'mr',name:'Marathi',native:'मराठी'},
  {code:'gu',name:'Gujarati',native:'ગુજરાتی'},
  {code:'pa',name:'Punjabi',native:'ਪੰਜਾਬੀ'},
  {code:'or',name:'Odia',native:'ଓଡ଼ିଆ'},
  {code:'as',name:'Assamese',native:'অসমীয়া'},
]

export default function StudentSettings() {
  const navigate  = useNavigate()
  const { theme, applyTheme, setActiveTheme, themes, themesWithStatus } = useTheme()
  const { user: authUser, logout } = useAuth()
  const fileRef = useRef()

  const isDark  = theme?.isDark ?? false
  const accent  = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primary = theme?.primary ?? '#1E3A5F'
  const primD   = theme?.primaryDark ?? '#0F2140'
  const txt     = isDark ? '#F8FAFC' : '#0F1020'
  const muted   = isDark ? 'rgba(255,255,255,0.65)' : '#475569'
  const card    = isDark ? 'rgba(255,255,255,0.08)' : '#ffffff'
  const bdr     = isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1'
  const bg      = isDark ? primD : '#F0F4F8'

  const [profile,      setProfile]      = useState(null)
  const [name,         setName]         = useState('')
  const [bio,          setBio]          = useState('')
  const [state,        setState]        = useState('')
  const [city,         setCity]         = useState('')
  const [lang,         setLang]         = useState('en')
  const [uploading,    setUploading]    = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [activeTab,    setActiveTab]    = useState('profile')
  const [pin,          setPin]          = useState('')
  const [newPin,       setNewPin]       = useState('')
  const [confirmPin,   setConfirmPin]   = useState('')
  const [pinMsg,       setPinMsg]       = useState('')
  const [showLogout,   setShowLogout]   = useState(false)
  const [notifs,       setNotifs]       = useState({
    test_reminders: true, streak_alerts: true,
    rank_updates: true, mentor_messages: true,
    new_content: false, promotional: false,
  })
  const [themeFilter, setThemeFilter]  = useState('All')

  // Load profile
  useEffect(() => {
    if (!authUser) return
    const uid = authUser.id || authUser.userId
    supabase.from('profiles').select('*').eq('id', uid).single()
      .then(({ data }) => {
        const d = data || authUser
        setProfile(d)
        setName(d?.name || '')
        setBio(d?.bio || '')
        setState(d?.state || '')
        setCity(d?.city || '')
        setLang(d?.preferred_language || d?.lang || 'en')
      })
  }, [authUser])

  const saveProfile = async () => {
    if (!authUser) return
    setSaving(true)
    const uid = authUser.id || authUser.userId
    await supabase.from('profiles').update({
      name, bio, state, city,
      preferred_language: lang,
      updated_at: new Date().toISOString()
    }).eq('id', uid)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !authUser) return
    setUploading(true)
    try {
      const uid = authUser.id || authUser.userId
      const url = await uploadAvatar(uid, file)
      setProfile(p => ({ ...p, avatar_url: url }))
    } catch(err) { console.error(err) }
    finally { setUploading(false) }
  }

  const savePin = () => {
    if (newPin.length < 4) { setPinMsg('PIN must be at least 4 digits'); return }
    if (newPin !== confirmPin) { setPinMsg('PINs do not match'); return }
    localStorage.setItem('tryit_pin', btoa(newPin))
    localStorage.setItem('tryit_pin_enabled', 'true')
    setPinMsg('PIN saved successfully ✅')
    setNewPin(''); setConfirmPin('')
  }

  const disablePin = () => {
    localStorage.removeItem('tryit_pin')
    localStorage.removeItem('tryit_pin_enabled')
    setPinMsg('PIN login disabled')
  }

  const downloadProgress = async () => {
    if (!authUser) return
    const uid = authUser.id || authUser.userId
    const { data: attempts } = await supabase
      .from('test_attempts').select('*').eq('user_id', uid)
    const { data: streak } = await supabase
      .from('user_streaks').select('*').eq('user_id', uid).single()
    const json = JSON.stringify({ profile, attempts, streak }, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'tryit_progress.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const handleLogout = () => {
    logout()
    navigate('/landing', { replace: true })
  }

  const handleLogoutAll = async () => {
    await supabase.auth.signOut({ scope: 'global' }).catch(() => {})
    logout()
    navigate('/landing', { replace: true })
  }

  const TABS = [
    { id: 'profile',       label: 'Profile',        icon: '👤' },
    { id: 'themes',        label: 'Themes',          icon: '🎨' },
    { id: 'language',      label: 'Language',        icon: '🌐' },
    { id: 'notifications', label: 'Notifications',   icon: '🔔' },
    { id: 'security',      label: 'Security & PIN',  icon: '🔒' },
    { id: 'account',       label: 'Account',         icon: '⚙️' },
  ]

  const allThemes = THEME_LIST
  const categories = ['All', 'Base', 'Accessibility', 'Cinematic', 'Indian Cinema', 'Indian', 'Mood', 'Nature', 'Space']

  const filteredThemes = themeFilter === 'All'
    ? allThemes
    : allThemes.filter(t => t.category === themeFilter)

  const isAdmin = localStorage.getItem('tryit_is_admin') === 'true'
  const isUnlocked = (t) => isAdmin || t.tier === 'base' || !t.unlock

  const handleThemeClick = (t) => {
    if (!isUnlocked(t)) return
    setActiveTheme(t.id)
    applyTheme(t.id)
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Inter,sans-serif' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 24px',
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${bdr}`,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button onClick={() => navigate('/student')} style={{
          background: card, border: `1px solid ${bdr}`,
          borderRadius: 10, width: 38, height: 38,
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 18, color: txt }}>←</button>
        <div>
          <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
            fontWeight: 800, fontSize: 18, margin: 0 }}>Settings</p>
          <p style={{ color: muted, fontSize: 11, margin: 0 }}>
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Horizontal tabs — works on all screen sizes */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto',
        padding: '12px 24px', borderBottom: `1px solid ${bdr}`,
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky', top: 60, zIndex: 99,
        scrollbarWidth: 'none',
      }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
              border: `1.5px solid ${activeTab===tab.id ? accent : bdr}`,
              background: activeTab === tab.id
                ? `linear-gradient(135deg,${accent},${accentL})`
                : card,
              color: activeTab === tab.id ? primD : muted,
              fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
              transition: 'all 0.15s', flexShrink: 0,
            }}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
        <div>

          {/* ── PROFILE TAB ────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div style={{ background: card, border: `1px solid ${bdr}`,
              borderRadius: 20, padding: '24px' }}>
              <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
                fontWeight: 800, fontSize: 16, margin: '0 0 20px' }}>
                👤 Profile Settings
              </p>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20,
                marginBottom: 24, padding: '16px',
                background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                borderRadius: 16, border: `1px solid ${bdr}` }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    onContextMenu={e => e.preventDefault()}
                    style={{
                      width: 80, height: 80, borderRadius: '50%',
                      background: `linear-gradient(135deg,${accent},${accentL})`,
                      border: `3px solid ${accent}`,
                      backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : '',
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28, fontWeight: 900, color: primD,
                      WebkitUserDrag: 'none', userSelect: 'none',
                      boxShadow: `0 0 0 4px ${accent}22`,
                    }}>
                    {!profile?.avatar_url && (profile?.name?.[0] || 'S')}
                    {uploading && (
                      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%',
                          border: '3px solid #fff', borderTopColor: 'transparent',
                          animation: 'spin 0.8s linear infinite' }}/>
                      </div>
                    )}
                  </div>
                  <div style={{ position: 'absolute', bottom: 2, right: 2,
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#22C55E', border: `2px solid ${isDark?primD:'#fff'}` }}/>
                </div>
                <div>
                  <p style={{ color: txt, fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>
                    {profile?.name || 'Student'}
                  </p>
                  <p style={{ color: muted, fontSize: 12, margin: '0 0 12px' }}>
                    {profile?.plan || 'free'} plan · {profile?.badge || 'Newcomer'}
                  </p>
                  <input ref={fileRef} type="file" accept="image/*"
                    style={{ display: 'none' }} onChange={handleAvatarChange}/>
                  <button onClick={() => fileRef.current?.click()} style={{
                    background: `linear-gradient(135deg,${accent},${accentL})`,
                    border: 'none', borderRadius: 10, padding: '8px 16px',
                    color: primD, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                    marginRight: 8 }}>
                    📷 Change Photo
                  </button>
                  {profile?.avatar_url && (
                    <button onClick={async () => {
                      const uid = authUser?.id || authUser?.userId
                      await supabase.from('profiles').update({ avatar_url: null }).eq('id', uid)
                      setProfile(p => ({ ...p, avatar_url: null }))
                    }} style={{ background: 'transparent', border: `1px solid #F87171`,
                      borderRadius: 10, padding: '8px 14px', color: '#F87171',
                      fontSize: 12, cursor: 'pointer' }}>Remove</button>
                  )}
                </div>
              </div>

              {/* Form fields */}
              {[
                { label: 'Full Name', val: name, set: setName, ph: 'Your name', type: 'text' },
                { label: 'Bio', val: bio, set: setBio, ph: 'Tell students about yourself...', type: 'textarea' },
                { label: 'State', val: state, set: setState, ph: 'e.g. Tamil Nadu', type: 'text' },
                { label: 'City', val: city, set: setCity, ph: 'e.g. Chennai', type: 'text' },
              ].map((f, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <label style={{ color: muted, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                    {f.label}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea value={f.val} onChange={e => f.set(e.target.value)}
                      placeholder={f.ph} rows={3}
                      style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                        border: `1px solid ${bdr}`, borderRadius: 12, padding: '10px 14px',
                        color: txt, fontSize: 13, fontFamily: 'Inter,sans-serif',
                        resize: 'vertical', boxSizing: 'border-box',
                        outline: 'none' }}/>
                  ) : (
                    <input type="text" value={f.val} onChange={e => f.set(e.target.value)}
                      placeholder={f.ph}
                      style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                        border: `1px solid ${bdr}`, borderRadius: 12, padding: '10px 14px',
                        color: txt, fontSize: 13, boxSizing: 'border-box',
                        outline: 'none' }}/>
                  )}
                </div>
              ))}

              <button onClick={saveProfile} disabled={saving} style={{
                background: saved
                  ? '#22C55E'
                  : `linear-gradient(135deg,${accent},${accentL})`,
                border: 'none', borderRadius: 12, padding: '12px 28px',
                color: saved ? '#fff' : primD, fontWeight: 800,
                fontSize: 14, cursor: 'pointer', transition: 'all 0.3s' }}>
                {saving ? 'Saving…' : saved ? '✅ Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* ── THEMES TAB ─────────────────────────────────────── */}
          {activeTab === 'themes' && (
            <div>
              <div style={{ background: card, border: `1px solid ${bdr}`,
                borderRadius: 20, padding: '20px', marginBottom: 16 }}>
                <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
                  fontWeight: 800, fontSize: 16, margin: '0 0 6px' }}>🎨 Themes</p>
                <p style={{ color: muted, fontSize: 12, margin: '0 0 16px' }}>
                  Free themes are always available. Pro/Ultra themes unlock with subscription.
                  Locked themes can be unlocked with 500 coins or by completing 1 full mock test.
                </p>

                {/* Category filter */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setThemeFilter(cat)} style={{
                      background: themeFilter === cat
                        ? `linear-gradient(135deg,${accent},${accentL})`
                        : isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                      border: 'none', borderRadius: 20, padding: '6px 14px',
                      color: themeFilter === cat ? primD : muted,
                      fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Theme grid */}
                <div style={{ display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
                  {filteredThemes.map(t => {
                    const unlocked = isUnlocked(t)
                    const active   = theme?.id === t.id
                    return (
                      <div key={t.id}
                        onClick={() => unlocked ? handleThemeClick(t) : null}
                        style={{
                          borderRadius: 16, overflow: 'hidden',
                          border: active
                            ? `2px solid ${accent}`
                            : `1px solid ${bdr}`,
                          cursor: unlocked ? 'pointer' : 'default',
                          opacity: unlocked ? 1 : 0.7,
                          transition: 'all 0.2s',
                          position: 'relative',
                          boxShadow: active ? `0 0 20px ${accent}44` : 'none',
                        }}
                        onMouseEnter={e => { if(unlocked) e.currentTarget.style.transform='scale(1.03)' }}
                        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>

                        {/* Theme preview — Mini Mockup */}
                        <div style={{
                          height: 110,
                          background: t.bg || '#F8FAFC',
                          display: 'flex', flexDirection: 'column',
                          overflow: 'hidden', position: 'relative',
                          fontSize: 28,
                          position: 'relative',
                        }}>
                          {t.emoji}
                          {!unlocked && (
                            <div style={{ position: 'absolute', inset: 0,
                              background: 'rgba(0,0,0,0.5)',
                              display: 'flex', flexDirection: 'column',
                              alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                              <span style={{ fontSize: 20 }}>🔒</span>
                              <span style={{ color: '#fff', fontSize: 8,
                                fontWeight: 700, textAlign: 'center', padding: '0 6px' }}>
                                {t.plan === 'ultra' ? 'Ultra' : 'Pro'} or 500🪙
                              </span>
                            </div>
                          )}
                          {active && (
                            <div style={{ position: 'absolute', top: 6, right: 6,
                              background: accent, borderRadius: '50%',
                              width: 20, height: 20, display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, color: primD, fontWeight: 900 }}>✓</div>
                          )}
                        </div>

                        {/* Theme name */}
                        <div style={{ padding: '8px 10px',
                          background: card }}>
                          <p style={{ color: txt, fontSize: 11, fontWeight: 700,
                            margin: '0 0 2px', overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {t.name}
                          </p>
                          <p style={{ color: muted, fontSize: 9, margin: 0 }}>
                            {t.category}
                            {!unlocked && (
                              <span style={{ color: accent, fontWeight: 700,
                                marginLeft: 4 }}>
                                · 500🪙
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Unlock explanation */}
                <div style={{ marginTop: 16, background: isDark ? `${accent}08` : `${accent}06`,
                  border: `1px solid ${accent}25`, borderRadius: 14,
                  padding: '12px 16px' }}>
                  <p style={{ color: accent, fontWeight: 700, fontSize: 13, margin: '0 0 4px' }}>
                    🔓 How to unlock themes
                  </p>
                  <p style={{ color: muted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                    Complete 1 full mock test → unlock 1 Pro theme of your choice<br/>
                    Spend 500 coins → unlock any single theme instantly<br/>
                    Subscribe to Pro → all Pro themes unlocked<br/>
                    Subscribe to Ultra → every theme unlocked forever
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── LANGUAGE TAB ───────────────────────────────────── */}
          {activeTab === 'language' && (
            <div style={{ background: card, border: `1px solid ${bdr}`,
              borderRadius: 20, padding: '24px' }}>
              <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
                fontWeight: 800, fontSize: 16, margin: '0 0 6px' }}>🌐 Language</p>
              <p style={{ color: muted, fontSize: 12, margin: '0 0 20px' }}>
                Choose your preferred language for explanations, questions and interface.
              </p>
              <div style={{ display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)} style={{
                    padding: '12px 14px', borderRadius: 14, cursor: 'pointer',
                    border: `2px solid ${lang === l.code ? accent : bdr}`,
                    background: lang === l.code ? `${accent}12` : card,
                    textAlign: 'left', transition: 'all 0.15s' }}>
                    <p style={{ color: lang === l.code ? accent : txt,
                      fontWeight: 700, fontSize: 13, margin: '0 0 2px' }}>{l.name}</p>
                    <p style={{ color: muted, fontSize: 11, margin: 0 }}>{l.native}</p>
                  </button>
                ))}
              </div>
              <button onClick={saveProfile} style={{
                marginTop: 20,
                background: `linear-gradient(135deg,${accent},${accentL})`,
                border: 'none', borderRadius: 12, padding: '12px 28px',
                color: primD, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                Save Language
              </button>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ──────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div style={{ background: card, border: `1px solid ${bdr}`,
              borderRadius: 20, padding: '24px' }}>
              <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
                fontWeight: 800, fontSize: 16, margin: '0 0 6px' }}>🔔 Notifications</p>
              <p style={{ color: muted, fontSize: 12, margin: '0 0 20px' }}>
                Control what alerts you receive
              </p>
              {[
                { key: 'test_reminders',  label: 'Test Reminders',    sub: 'Daily test streak alerts'             },
                { key: 'streak_alerts',   label: 'Streak Alerts',     sub: 'Warning when streak is at risk'       },
                { key: 'rank_updates',    label: 'Rank Updates',      sub: 'When your All-India rank changes'     },
                { key: 'mentor_messages', label: 'Mentor Messages',   sub: 'New messages from your mentor'        },
                { key: 'new_content',     label: 'New Content',       sub: 'New study materials and topics'       },
                { key: 'promotional',     label: 'Offers & Deals',    sub: 'Discount and referral notifications'  },
              ].map(n => (
                <div key={n.key} style={{ display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '14px 0',
                  borderBottom: `1px solid ${bdr}` }}>
                  <div>
                    <p style={{ color: txt, fontWeight: 600, fontSize: 13, margin: 0 }}>{n.label}</p>
                    <p style={{ color: muted, fontSize: 11, margin: '2px 0 0' }}>{n.sub}</p>
                  </div>
                  <button onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                    style={{
                      width: 48, height: 26, borderRadius: 13, border: 'none',
                      cursor: 'pointer', position: 'relative',
                      background: notifs[n.key]
                        ? `linear-gradient(135deg,${accent},${accentL})`
                        : isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                      transition: 'all 0.2s', flexShrink: 0 }}>
                    <div style={{
                      position: 'absolute', top: 3,
                      left: notifs[n.key] ? 26 : 4,
                      width: 20, height: 20, borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}/>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── SECURITY TAB ───────────────────────────────────── */}
          {activeTab === 'security' && (
            <div style={{ background: card, border: `1px solid ${bdr}`,
              borderRadius: 20, padding: '24px' }}>
              <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
                fontWeight: 800, fontSize: 16, margin: '0 0 6px' }}>🔒 Security & PIN</p>
              <p style={{ color: muted, fontSize: 12, margin: '0 0 20px', lineHeight: 1.6 }}>
                Set a PIN to protect your dashboard. When enabled, you'll need to enter
                your PIN every time you open the app instead of logging in again.
              </p>

              <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                border: `1px solid ${bdr}`, borderRadius: 16, padding: '20px',
                marginBottom: 20 }}>
                <p style={{ color: txt, fontWeight: 700, fontSize: 14, margin: '0 0 16px' }}>
                  Set New PIN
                </p>
                {[
                  { label: 'New PIN (4-6 digits)', val: newPin, set: setNewPin },
                  { label: 'Confirm PIN', val: confirmPin, set: setConfirmPin },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <label style={{ color: muted, fontSize: 11,
                      fontWeight: 700, display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input type="password" inputMode="numeric" maxLength={6}
                      value={f.val} onChange={e => f.set(e.target.value.replace(/\D/g,''))}
                      placeholder="••••••"
                      style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                        border: `1px solid ${bdr}`, borderRadius: 12,
                        padding: '10px 14px', color: txt, fontSize: 20,
                        letterSpacing: 8, boxSizing: 'border-box', outline: 'none' }}/>
                  </div>
                ))}
                {pinMsg && (
                  <p style={{ color: pinMsg.includes('✅') ? '#22C55E' : '#F87171',
                    fontSize: 12, margin: '0 0 12px' }}>{pinMsg}</p>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={savePin} style={{
                    background: `linear-gradient(135deg,${accent},${accentL})`,
                    border: 'none', borderRadius: 10, padding: '10px 20px',
                    color: primD, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Save PIN
                  </button>
                  <button onClick={disablePin} style={{
                    background: 'transparent',
                    border: `1px solid #F87171`, borderRadius: 10,
                    padding: '10px 20px', color: '#F87171',
                    fontSize: 13, cursor: 'pointer' }}>
                    Disable PIN
                  </button>
                </div>
              </div>

              <div style={{ background: isDark ? `${accent}08` : `${accent}06`,
                border: `1px solid ${accent}25`, borderRadius: 14, padding: '14px 16px' }}>
                <p style={{ color: accent, fontWeight: 700, fontSize: 12, margin: '0 0 4px' }}>
                  💡 How PIN login works
                </p>
                <p style={{ color: muted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                  After setup, your next app open will show a PIN screen instead of
                  the landing page. Your data stays safe even if someone picks up your phone.
                  You can change or remove your PIN anytime here.
                </p>
              </div>
            </div>
          )}

          {/* ── ACCOUNT TAB ────────────────────────────────────── */}
          {activeTab === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Role upgrade */}
              <div style={{ background: card, border: `1px solid ${bdr}`,
                borderRadius: 20, padding: '20px' }}>
                <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
                  fontWeight: 800, fontSize: 15, margin: '0 0 14px' }}>
                  ⬆️ Upgrade Role
                </p>
                {[
                  { label: 'Become a Mentor',     sub: 'Teach students, earn side income',  price: '₹99 one-time',   icon: '🧑‍🏫', path: '/student/become-mentor' },
                  { label: 'Switch to Family Plan',sub: '4 members, one subscription',       price: '₹2,499/year',    icon: '👨‍👩‍👧‍👦', path: '/pricing' },
                  { label: 'Institution Partner',  sub: 'After 500 answers or 100 students', price: '₹499 one-time',  icon: '🏫', path: '/pricing' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '12px',
                    borderRadius: 14, marginBottom: 8,
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                    border: `1px solid ${bdr}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{r.icon}</span>
                      <div>
                        <p style={{ color: txt, fontWeight: 700, fontSize: 13, margin: 0 }}>{r.label}</p>
                        <p style={{ color: muted, fontSize: 11, margin: '2px 0 0' }}>{r.sub}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: accent, fontWeight: 800, fontSize: 12, margin: '0 0 4px' }}>{r.price}</p>
                      <button onClick={() => navigate(r.path)} style={{
                        background: `linear-gradient(135deg,${accent},${accentL})`,
                        border: 'none', borderRadius: 8, padding: '5px 12px',
                        color: primD, fontWeight: 700, fontSize: 10, cursor: 'pointer' }}>
                        Upgrade →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data */}
              <div style={{ background: card, border: `1px solid ${bdr}`,
                borderRadius: 20, padding: '20px' }}>
                <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
                  fontWeight: 800, fontSize: 15, margin: '0 0 14px' }}>
                  📁 Your Data
                </p>
                <button onClick={downloadProgress} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                  border: `1px solid ${bdr}`, borderRadius: 12,
                  padding: '12px 16px', cursor: 'pointer', width: '100%',
                  marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>⬇️</span>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ color: txt, fontWeight: 700, fontSize: 13, margin: 0 }}>
                      Download My Progress
                    </p>
                    <p style={{ color: muted, fontSize: 11, margin: '2px 0 0' }}>
                      Download all your test history, scores, and activity as JSON
                    </p>
                  </div>
                </button>
              </div>

              {/* Logout */}
              <div style={{ background: card, border: `1px solid #F8717122`,
                borderRadius: 20, padding: '20px' }}>
                <p style={{ color: txt, fontFamily: 'Poppins,sans-serif',
                  fontWeight: 800, fontSize: 15, margin: '0 0 14px' }}>
                  🚪 Sign Out
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button onClick={() => setShowLogout('single')} style={{
                    background: 'transparent', border: `1px solid #F87171`,
                    borderRadius: 12, padding: '10px 20px', color: '#F87171',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Logout This Device
                  </button>
                  <button onClick={() => setShowLogout('all')} style={{
                    background: '#F8717115', border: `1px solid #F87171`,
                    borderRadius: 12, padding: '10px 20px', color: '#F87171',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Logout All Devices
                  </button>
                </div>

                {showLogout && (
                  <div style={{ marginTop: 14, padding: '14px',
                    background: '#F8717110', borderRadius: 14,
                    border: '1px solid #F8717130' }}>
                    <p style={{ color: '#F87171', fontWeight: 700,
                      fontSize: 13, margin: '0 0 10px' }}>
                      Are you sure you want to {showLogout === 'all' ? 'logout from all devices' : 'logout'}?
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={showLogout === 'all' ? handleLogoutAll : handleLogout}
                        style={{ background: '#F87171', border: 'none',
                          borderRadius: 10, padding: '8px 16px',
                          color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                        Yes, Logout
                      </button>
                      <button onClick={() => setShowLogout(false)} style={{
                        background: 'transparent', border: `1px solid ${bdr}`,
                        borderRadius: 10, padding: '8px 16px', color: muted,
                        fontSize: 12, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        div::-webkit-scrollbar{display:none}
      `}</style>
    </div>
  )
}
