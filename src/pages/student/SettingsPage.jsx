// src/pages/student/SettingsPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import ThemeSwitcher from '../../components/ThemeSwitcher'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [language, setLanguage] = useState('English')

  if (!user) return null

  const handleLogout = () => { logout(); navigate('/landing') }

  const Toggle = ({ val, onChange }) => (
    <div onClick={()=>onChange(!val)} style={{ width:44, height:24, borderRadius:12, background: val?'var(--color-navy, #1E3A5F)':'rgba(226,232,240,0.9)', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ width:18, height:18, borderRadius:'50%', background:'var(--color-surface, #FFFFFF)', position:'absolute', top:3, left: val?23:3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.15)' }}/>
    </div>
  )

  const Section = ({ title, children }) => (
    <div style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:18, border:'1.5px solid rgba(226,232,240,0.9)', marginBottom:16, overflow:'hidden', color:'var(--color-text, #1E3A5F)' }}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(241,245,249,0.9)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-text, #1E3A5F)', fontSize:14, margin:0 }}>{title}</p>
      </div>
      <div style={{ padding:'8px 0' }}>{children}</div>
    </div>
  )

  const Row = ({ label, desc, right, onClick }) => (
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', cursor: onClick?'pointer':'default', background:'transparent' }}>
      <div>
        <p style={{ fontSize:14, fontWeight:600, color:'var(--color-text, #1E3A5F)', margin:'0 0 2px' }}>{label}</p>
        {desc && <p style={{ fontSize:12, color:'var(--color-muted, #94A3B8)', margin:0 }}>{desc}</p>}
      </div>
      {right}
    </div>
  )

  return (
    <AppLayout title="Settings">
      <div style={{ maxWidth:560, margin:'0 auto' }}>
        <Section title="👤 Account">
          <Row label="My Profile" desc="Edit name, city, bio" right={<span style={{ color:'var(--color-muted, #94A3B8)', fontSize:18 }}>›</span>} onClick={()=>navigate('/profile')}/>
          <Row label="Role" desc={user.role} right={<button onClick={()=>navigate('/role-select')} style={{ background:'var(--color-surface, #FFFFFF)', border:'1px solid rgba(226,232,240,0.9)', borderRadius:8, padding:'4px 12px', fontSize:12, fontWeight:600, color:'var(--color-text, #1E3A5F)', cursor:'pointer' }}>Switch</button>}/>
        </Section>

        <Section title="🎨 Appearance">
          <Row
            label="Theme"
            desc="Choose from 29 themes"
            right={
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:13, color:'var(--color-text, #1E3A5F)', fontWeight:600 }}>{theme?.name || 'Choose theme'}</span>
                <ThemeSwitcher />
              </div>
            }
            onClick={() => navigate('/settings/themes')}
          />
          <Row label="Accessibility" desc="Contrast, text size, reduced motion" right={<span style={{ color:'var(--color-muted, #94A3B8)', fontSize:18 }}>›</span>} onClick={()=>navigate('/accessibility')}/>
        </Section>

        <Section title="🔔 Notifications">
          <Row label="Email Notifications" desc="Exam alerts, streak reminders" right={<Toggle val={emailNotif} onChange={setEmailNotif}/>}/>
          <Row label="Push Notifications" desc="Requires browser permission" right={<Toggle val={pushNotif} onChange={setPushNotif}/>}/>
        </Section>

        <Section title="🌐 Language">
          <Row label="Study Language" desc="More languages added weekly"
            right={
              <select value={language} onChange={e=>setLanguage(e.target.value)} style={{ padding:'6px 10px', borderRadius:8, border:'1.5px solid rgba(226,232,240,0.9)', background:'var(--color-surface, #FFFFFF)', color:'var(--color-text, #1E3A5F)', fontSize:13, outline:'none' }}>
                {['English','Hindi','Tamil','Telugu','Kannada','Malayalam','Bengali','Marathi'].map(l=><option key={l} value={l} style={{ color:'var(--color-text, #1E3A5F)' }}>{l}</option>)}
              </select>
            }/>
        </Section>

        <Section title="📄 Legal">
          <Row label="Terms & Conditions" right={<span style={{ color:'#94A3B8', fontSize:18 }}>›</span>} onClick={()=>navigate('/terms')}/>
          <Row label="Privacy Policy" right={<span style={{ color:'#94A3B8', fontSize:18 }}>›</span>} onClick={()=>navigate('/privacy')}/>
          <Row label="Community Standards" right={<span style={{ color:'#94A3B8', fontSize:18 }}>›</span>} onClick={()=>navigate('/community-standards')}/>
        </Section>

        <div style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:18, border:'1.5px solid rgba(226,232,240,0.9)', overflow:'hidden' }}>
          <div style={{ padding:'8px 0' }}>
            <div onClick={handleLogout} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', cursor:'pointer' }}>
              <p style={{ fontSize:14, fontWeight:700, color:'var(--color-gold, #D4AF37)', margin:0 }}>🚪 Sign Out</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
