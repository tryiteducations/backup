import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const { showToast } = useToast()
  const [notif, setNotif] = useState({ examAlerts:true, streakReminder:true, rankChange:true, guruReply:true, hallBattle:false, promotions:false })
  const [lang, setLang] = useState(localStorage.getItem('app_lang_tone')||'en')
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); showToast('success','Settings saved!'); setTimeout(()=>setSaved(false),2000) }

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:28, marginBottom:24 }}>⚙️ Settings</h1>

      {/* Account */}
      <div style={{ background:'#fff', borderRadius:20, padding:20, marginBottom:14, border:'1.5px solid var(--color-border, #E2E8F0)', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', marginBottom:16 }}>👤 Account</p>
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid #F8FAFC' }}>
          <span style={{ color:'var(--color-muted, #64748B)', fontSize:14, flex:1 }}>Email</span>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:'#1E293B', fontSize:14, fontWeight:600 }}>{user?.email}</span>
            <span style={{ background:'var(--color-bg-muted-2, #F1F5F9)', color:'var(--color-muted, #64748B)', fontSize:10, padding:'2px 8px', borderRadius:20 }}>🔒 Locked</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid #F8FAFC' }}>
          <span style={{ color:'var(--color-muted, #64748B)', fontSize:14, flex:1 }}>TryIT ID</span>
          <span style={{ color:'#1E293B', fontSize:13, fontFamily:'monospace', fontWeight:600 }}>{user?.userId}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0' }}>
          <span style={{ color:'var(--color-muted, #64748B)', fontSize:14, flex:1 }}>Role</span>
          <span style={{ background:'#EDE9FE', color:'#7C3AED', fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>
            {localStorage.getItem('tryit_role') || 'student'}
          </span>
        </div>
      </div>

      {/* Language */}
      <div style={{ background:'#fff', borderRadius:20, padding:20, marginBottom:14, border:'1.5px solid var(--color-border, #E2E8F0)', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', marginBottom:14 }}>🌐 Language & Tone</p>
        <select value={lang} onChange={e=>{ setLang(e.target.value); localStorage.setItem('app_lang_tone',e.target.value) }}
          style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:14, fontFamily:'Poppins,sans-serif', outline:'none' }}
          onFocus={e=>e.target.style.borderColor='var(--color-accent, #D4AF37)'} onBlur={e=>e.target.style.borderColor='var(--color-border, #E2E8F0)'}>
          <optgroup label="Neutral">
            <option value="en">English (neutral)</option>
          </optgroup>
          <optgroup label="North India">
            <option value="hi-bhai">Hindi (bhai / dost)</option>
            <option value="pa-paaji">Punjabi (paaji / veer)</option>
            <option value="gu-bhai">Gujarati (bhai / ben)</option>
            <option value="mr-bhau">Marathi (bhau / tai)</option>
          </optgroup>
          <optgroup label="South India">
            <option value="ta-machan">Tamil (machan / akka)</option>
            <option value="te-anna">Telugu (annayya / tammudu)</option>
            <option value="kn-anna">Kannada (anna / thamma)</option>
            <option value="ml-ikka">Malayalam (ikka / chetta)</option>
          </optgroup>
          <optgroup label="East India">
            <option value="bn-dada">Bengali (dada / bhai)</option>
            <option value="or-bhaina">Odia (bhaina)</option>
            <option value="as-koka">Assamese (koka)</option>
          </optgroup>
        </select>
      </div>

      {/* Notifications */}
      <div style={{ background:'#fff', borderRadius:20, padding:20, marginBottom:14, border:'1.5px solid var(--color-border, #E2E8F0)', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', marginBottom:14 }}>🔔 Notifications</p>
        {[
          { key:'examAlerts',      label:'Exam Deadline Alerts',    desc:'Application dates, result notifications' },
          { key:'streakReminder',  label:'Daily Streak Reminder',   desc:'Keep your study streak alive' },
          { key:'rankChange',      label:'Rank Changes',            desc:'When your rank improves or drops' },
          { key:'guruReply',       label:'Guru Hub Replies',        desc:'When your doubt gets answered' },
          { key:'hallBattle',      label:'Hall Battle Updates',     desc:'Live score updates during battles' },
          { key:'promotions',      label:'Offers & Promotions',     desc:'Discounts, new features' },
        ].map(n => (
          <div key={n.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid #F8FAFC' }}>
            <div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E293B', fontSize:14 }}>{n.label}</p>
              <p style={{ color:'#94A3B8', fontSize:12, marginTop:2 }}>{n.desc}</p>
            </div>
            <button role="switch" aria-checked={notif[n.key]}
              onClick={() => setNotif(p=>({...p,[n.key]:!p[n.key]}))}
              style={{ width:46, height:26, borderRadius:13, border:'none', cursor:'pointer', background:notif[n.key]?'var(--color-primary, #1E3A5F)':'var(--color-border, #E2E8F0)', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:notif[n.key]?23:3, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
            </button>
          </div>
        ))}
      </div>

      {/* Subscription */}
      <div style={{ background:'linear-gradient(135deg,rgba(30,58,95,0.06),rgba(212,175,55,0.04))', borderRadius:20, padding:20, marginBottom:14, border:'1.5px solid rgba(212,175,55,0.2)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', marginBottom:12 }}>💳 Subscription</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', fontSize:16 }}>⚡ TryIT Pro</p>
            <p style={{ color:'var(--color-muted, #64748B)', fontSize:13 }}>Active · Renews July 10, 2026</p>
          </div>
          <button onClick={() => navigate('/pro')} style={{ background:'linear-gradient(135deg,var(--color-accent, #D4AF37),var(--color-accent-light, #E8C84A))', border:'none', borderRadius:12, padding:'9px 20px', color:'var(--color-primary, #1E3A5F)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer' }}>
            Manage Plan
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ background:'#fff', borderRadius:20, padding:20, marginBottom:20, border:'1.5px solid #FEE2E2' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#DC2626', marginBottom:12 }}>⚠️ Danger Zone</p>
        <button onClick={() => { localStorage.clear(); navigate('/login') }}
          style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:12, padding:'10px 20px', color:'#DC2626', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13, cursor:'pointer' }}>
          Sign Out of All Devices
        </button>
      </div>

      <button onClick={save} style={{ width:'100%', padding:14, borderRadius:14, border:'none', background: saved?'var(--color-success, #22C55E)':'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:'#fff', cursor:'pointer' }}>
        {saved ? '✅ Saved!' : 'Save Settings'}
      </button>
    </AppLayout>
  )
}
