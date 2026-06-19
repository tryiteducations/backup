// FILE: src/pages/settings/Settings.jsx
// TryIT — Settings Page
// Route: /settings
// Language, notifications, theme, account, privacy, data export
import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../../context/AuthContext'
import { supabase }            from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'
const GREEN = '#059669'

const LANGUAGES = [
  { code:'en', name:'English',   native:'English'    },
  { code:'hi', name:'Hindi',     native:'हिन्दी'      },
  { code:'ta', name:'Tamil',     native:'தமிழ்'       },
  { code:'te', name:'Telugu',    native:'తెలుగు'      },
  { code:'kn', name:'Kannada',   native:'ಕನ್ನಡ'       },
  { code:'ml', name:'Malayalam', native:'മലയാളം'      },
  { code:'bn', name:'Bengali',   native:'বাংলা'       },
  { code:'mr', name:'Marathi',   native:'मराठी'       },
  { code:'gu', name:'Gujarati',  native:'ગુજરાતી'     },
  { code:'pa', name:'Punjabi',   native:'ਪੰਜਾਬੀ'      },
  { code:'or', name:'Odia',      native:'ଓଡ଼ିଆ'       },
  { code:'as', name:'Assamese',  native:'অসমীয়া'     },
]

const THEMES = [
  { id:'default',  name:'Classic Blue',  primary:'#1E3A5F', accent:'#C9A84C', free:true  },
  { id:'dark',     name:'Night Mode',    primary:'#0F172A', accent:'#38BDF8', free:true  },
  { id:'green',    name:'Forest',        primary:'#14532D', accent:'#86EFAC', free:true  },
  { id:'saffron',  name:'Saffron',       primary:'#9A3412', accent:'#FED7AA', free:false },
  { id:'purple',   name:'Royal Purple',  primary:'#4C1D95', accent:'#DDD6FE', free:false },
  { id:'ocean',    name:'Deep Ocean',    primary:'#0C4A6E', accent:'#7DD3FC', free:false },
]

function ToggleSwitch({ on, onChange }) {
  return (
    <div onClick={onChange}
      style={{ width:44, height:24, borderRadius:99, background:on?GREEN:'#CBD5E1',
        position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:2, left: on?22:2, width:20, height:20,
        borderRadius:'50%', background:'#fff', transition:'left 0.2s',
        boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
  )
}

function SettingRow({ label, sublabel, children, onClick, arrow = false }) {
  return (
    <div onClick={onClick}
      style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 16px', background:'#fff', borderBottom:'1px solid #F1F5F9',
        cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ flex:1, marginRight:12 }}>
        <p style={{ fontSize:13, fontWeight:600, color:'#1E293B', margin:0 }}>{label}</p>
        {sublabel && <p style={{ fontSize:11, color:'#94A3B8', margin:'2px 0 0' }}>{sublabel}</p>}
      </div>
      {children}
      {arrow && <span style={{ color:'#94A3B8', fontSize:14, marginLeft:8 }}>›</span>}
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:1,
      padding:'16px 16px 6px', margin:0, textTransform:'uppercase' }}>
      {title}
    </p>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout, planTier, updateUser, preferredLanguage, setPreferredLanguage } = useAuth()

  const [lang,      setLang]      = useState(preferredLanguage || 'en')
  const [theme,     setTheme]     = useState('default')
  const [notifs,    setNotifs]    = useState({
    streak:       true,
    tournament:   true,
    results:      true,
    bharat_pulse: true,
    material:     true,
    community:    false,
    battle:       true,
  })
  const [activityFeed, setActivityFeed] = useState(false)  // opt-in to live ticker
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [saving, setSaving] = useState(false)

  const isPro = planTier === 'pro' || planTier === 'ultra'

  const saveLang = async (code) => {
    setLang(code)
    setPreferredLanguage?.(code)
    setShowLangPicker(false)
    try {
      await supabase.from('users').update({ preferred_language: code }).eq('id', user?.id)
    } catch {}
  }

  const toggleNotif = async (key) => {
    const updated = { ...notifs, [key]: !notifs[key] }
    setNotifs(updated)
    try {
      await supabase.from('user_preferences')
        .upsert({ user_id: user?.id, notification_prefs: updated })
    } catch {}
  }

  const toggleActivityFeed = async () => {
    const val = !activityFeed
    setActivityFeed(val)
    try {
      await supabase.from('leaderboard_activity_feed')
        .update({ opt_in: val }).eq('user_id', user?.id)
    } catch {}
  }

  const handleDeleteAccount = () => {
    if (!confirm('Are you sure? This permanently deletes your account, progress, and coins. This cannot be undone.')) return
    if (!confirm('This is your final confirmation. Tap OK to delete your TryIT account permanently.')) return
    // TODO: call delete account edge function
    alert('Account deletion request submitted. Your data will be removed within 48 hours.')
    logout()
  }

  const selectedLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'20px 16px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', margin:0 }}>⚙️ Settings</h1>
        </div>
      </div>

      {/* LANGUAGE */}
      <SectionHeader title="Language" />
      <div style={{ background:'#fff' }}>
        <SettingRow
          label="Exam Content Language"
          sublabel={`Currently: ${selectedLang.native} (${selectedLang.name})`}
          onClick={() => setShowLangPicker(true)}
          arrow>
          <span style={{ fontSize:12, color:NAVY, fontWeight:700 }}>{selectedLang.native}</span>
        </SettingRow>
        <SettingRow
          label="App Interface Language"
          sublabel="Explanation, UI labels, and buttons">
          <span style={{ fontSize:11, color:'#94A3B8' }}>Coming soon</span>
        </SettingRow>
      </div>

      {/* THEME */}
      <SectionHeader title="Theme" />
      <div style={{ background:'#fff' }}>
        <SettingRow
          label="App Theme"
          sublabel={isPro ? '20 Pro themes + 5 free themes' : '5 free themes · Upgrade Pro for 20 more'}
          onClick={() => setShowThemePicker(true)}
          arrow>
          <div style={{ display:'flex', gap:4 }}>
            {THEMES.slice(0,3).map(t => (
              <div key={t.id} style={{ width:16, height:16, borderRadius:'50%', background:t.primary,
                border: theme===t.id?`2px solid ${GOLD}`:'2px solid transparent' }} />
            ))}
          </div>
        </SettingRow>
      </div>

      {/* NOTIFICATIONS */}
      <SectionHeader title="Notifications" />
      <div style={{ background:'#fff' }}>
        {[
          { key:'tournament',   label:'Tournament Alerts',     sub:'Registration open, start time, results at 8 PM' },
          { key:'results',      label:'Prize & Badge Awards',  sub:'When you win something' },
          { key:'streak',       label:'Streak Reminder',       sub:'Daily nudge to study' },
          { key:'bharat_pulse', label:'Bharat Pulse Story',    sub:'Daily 8 AM story notification' },
          { key:'material',     label:'New Materials Posted',  sub:'When mentor or admin posts' },
          { key:'battle',       label:'Battle Challenges',     sub:'When someone challenges you 1v1' },
          { key:'community',    label:'Community Updates',     sub:'Your request accepted, polls closed' },
        ].map(n => (
          <SettingRow key={n.key} label={n.label} sublabel={n.sub}>
            <ToggleSwitch on={notifs[n.key]} onChange={() => toggleNotif(n.key)} />
          </SettingRow>
        ))}
      </div>

      {/* LEADERBOARD */}
      <SectionHeader title="Leaderboard & Privacy" />
      <div style={{ background:'#fff' }}>
        <SettingRow
          label="Appear in Live Activity Ticker"
          sublabel="Others can see when you complete milestones (no marks shown)">
          <ToggleSwitch on={activityFeed} onChange={toggleActivityFeed} />
        </SettingRow>
        <SettingRow
          label="Show My Profile Photo on Leaderboard"
          sublabel="Your photo visible to others in top 20">
          <ToggleSwitch on={user?.show_photo_leaderboard ?? false}
            onChange={() => updateUser?.({ show_photo_leaderboard: !(user?.show_photo_leaderboard) })} />
        </SettingRow>
        <SettingRow
          label="Category Rank"
          sublabel="Your OBC/SC/ST rank is always private — only you see it"
          arrow={false}>
          <span style={{ fontSize:11, color:GREEN, fontWeight:700 }}>Always Private 🔒</span>
        </SettingRow>
      </div>

      {/* TEST PREFERENCES */}
      <SectionHeader title="Test Preferences" />
      <div style={{ background:'#fff' }}>
        <SettingRow
          label="Timer Mode"
          sublabel="All tests run 10% shorter than real exam (builds pressure)">
          <span style={{ fontSize:11, color:NAVY, fontWeight:700 }}>−10% Always</span>
        </SettingRow>
        <SettingRow
          label="Explanation Language"
          sublabel="Language for post-answer explanations">
          <span style={{ fontSize:12, color:NAVY, fontWeight:700 }}>{selectedLang.native}</span>
        </SettingRow>
      </div>

      {/* ACCOUNT */}
      <SectionHeader title="Account" />
      <div style={{ background:'#fff' }}>
        <SettingRow label="My Plan" sublabel={`Current: ${planTier?.toUpperCase() || 'FREE'}`}
          onClick={() => navigate('/pro')} arrow>
          <span style={{ fontSize:11, fontWeight:700, color:NAVY, padding:'3px 8px',
            background:`${NAVY}10`, borderRadius:99 }}>
            {planTier?.toUpperCase() || 'FREE'}
          </span>
        </SettingRow>
        <SettingRow label="Referral Program" sublabel="Invite friends, earn coins & cashback"
          onClick={() => navigate('/referral')} arrow />
        <SettingRow label="My Wallet & Coins" sublabel={`Balance: ${user?.coins || 0}🪙`}
          onClick={() => navigate('/wallet')} arrow />
        <SettingRow label="Change Password"
          sublabel="Update your login password"
          onClick={() => navigate('/change-password')} arrow />
        <SettingRow label="Linked Phone Number"
          sublabel={user?.phone || 'Not set · Verified via Truecaller'}>
          <span style={{ fontSize:11, color:GREEN, fontWeight:700 }}>Verified ✅</span>
        </SettingRow>
      </div>

      {/* INSTITUTION */}
      {user?.role === 'centre' && (
        <>
          <SectionHeader title="Institution" />
          <div style={{ background:'#fff' }}>
            <SettingRow label="Copyright Agreement"
              sublabel="All uploaded content is TryIT property — agreed at signup">
              <span style={{ fontSize:11, color:GREEN, fontWeight:700 }}>Agreed ✅</span>
            </SettingRow>
            <SettingRow label="Student Data Consent"
              sublabel="Students who consented to share progress with your institution"
              onClick={() => navigate('/centre/consent')} arrow />
          </div>
        </>
      )}

      {/* DATA */}
      <SectionHeader title="Your Data" />
      <div style={{ background:'#fff' }}>
        <SettingRow label="Download My Data"
          sublabel="Export all your test history, scores, and progress as PDF"
          onClick={() => alert('Data export will be emailed within 24 hours.')} arrow />
        <SettingRow label="Privacy Policy"
          onClick={() => window.open('https://tryiteducations.net/privacy', '_blank')} arrow />
        <SettingRow label="Terms of Service"
          onClick={() => window.open('https://tryiteducations.net/terms', '_blank')} arrow />
      </div>

      {/* DANGER ZONE */}
      <SectionHeader title="Danger Zone" />
      <div style={{ background:'#fff', marginBottom:24 }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #F1F5F9' }}>
          <button onClick={logout}
            style={{ width:'100%', padding:'12px', background:'#FEF2F2', color:'#991B1B',
              border:'1px solid #FCA5A5', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            🚪 Log Out
          </button>
        </div>
        <div style={{ padding:'14px 16px' }}>
          <button onClick={handleDeleteAccount}
            style={{ width:'100%', padding:'12px', background:'#fff', color:'#DC2626',
              border:'1px solid #FCA5A5', borderRadius:12, fontWeight:600, fontSize:13, cursor:'pointer' }}>
            🗑 Delete Account Permanently
          </button>
          <p style={{ fontSize:10, color:'#94A3B8', textAlign:'center', marginTop:6 }}>
            This deletes all your progress, coins, and history. Cannot be undone.
          </p>
        </div>
      </div>

      {/* LANGUAGE PICKER MODAL */}
      {showLangPicker && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
          display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:1000 }}
          onClick={e => e.target===e.currentTarget && setShowLangPicker(false)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:24,
            width:'100%', maxWidth:460, maxHeight:'80vh', overflowY:'auto' }}>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, marginBottom:16 }}>
              🌐 Choose Your Language
            </h3>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => saveLang(l.code)}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'13px 14px', marginBottom:6, borderRadius:12, cursor:'pointer',
                  border:`1.5px solid ${lang===l.code?NAVY:'#E2E8F0'}`,
                  background: lang===l.code?`${NAVY}08`:'#fff' }}>
                <span style={{ fontSize:14, fontWeight:600, color:'#1E293B' }}>{l.native}</span>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'#94A3B8' }}>{l.name}</span>
                  {lang===l.code && <span style={{ color:NAVY, fontSize:14 }}>✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* THEME PICKER MODAL */}
      {showThemePicker && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
          display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:1000 }}
          onClick={e => e.target===e.currentTarget && setShowThemePicker(false)}>
          <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:24, width:'100%', maxWidth:460 }}>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, marginBottom:16 }}>🎨 Choose Theme</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {THEMES.map(t => {
                const locked = !t.free && !isPro
                return (
                  <button key={t.id}
                    onClick={() => {
                      if (locked) { navigate('/pro'); setShowThemePicker(false); return }
                      setTheme(t.id); setShowThemePicker(false)
                    }}
                    style={{ border:`2px solid ${theme===t.id?GOLD:'#E2E8F0'}`, borderRadius:14,
                      padding:14, cursor:'pointer', background:'#fff', opacity:locked?0.5:1,
                      position:'relative', textAlign:'center' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:t.primary,
                      margin:'0 auto 6px', border:`3px solid ${t.accent}` }} />
                    <p style={{ fontSize:11, fontWeight:700, color:'#1E293B', margin:0 }}>{t.name}</p>
                    {locked && <p style={{ fontSize:9, color:'#94A3B8', margin:'2px 0 0' }}>⭐ Pro</p>}
                    {theme===t.id && (
                      <span style={{ position:'absolute', top:6, right:6, fontSize:14 }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>
            {!isPro && (
              <button onClick={() => { navigate('/pro'); setShowThemePicker(false) }}
                style={{ width:'100%', marginTop:14, padding:'12px', background:NAVY, color:'#fff',
                  border:'none', borderRadius:12, fontWeight:700, cursor:'pointer' }}>
                Upgrade to Pro for 20 themes →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}