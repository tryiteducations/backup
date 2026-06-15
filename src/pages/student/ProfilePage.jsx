// src/pages/student/ProfilePage.jsx
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal']

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [state, setState] = useState(user?.state || '')
  const [city, setCity] = useState(user?.city || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [saved, setSaved] = useState(false)

  if (!user) return null

  const handleSave = () => {
    updateUser({ name, state, city, bio, initials: (name.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)) || user.initials })
    setSaved(true)
    setTimeout(()=>setSaved(false), 2500)
  }

  return (
    <AppLayout title="My Profile">
      <div style={{ maxWidth:600, margin:'0 auto' }}>
        <div style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', borderRadius:20, padding:28, marginBottom:24, display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,var(--color-accent, #D4AF37),var(--color-accent-light, #E8C84A))', color:'var(--color-primary, #1E3A5F)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:26, flexShrink:0 }}>
            {user.initials || '?'}
          </div>
          <div>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:18, margin:'0 0 2px' }}>{user.name || 'New Learner'}</p>
            <p style={{ color:'var(--color-accent, #D4AF37)', fontSize:13, margin:'0 0 2px' }}>{user.levelEmoji} {user.levelTitle}</p>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, margin:0 }}>ID: {user.userId} · Joined {user.joinDate}</p>
          </div>
        </div>

        <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid var(--color-border, #E2E8F0)', padding:24 }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:16, marginBottom:20 }}>Edit Profile</p>

          {[['Full Name', name, setName, 'text', 'Your full name'],
            ['City', city, setCity, 'text', 'Your city']
          ].map(([label, val, setter, type, placeholder])=>(
            <div key={label} style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:6 }}>{label}</label>
              <input value={val} onChange={e=>setter(e.target.value)} type={type} placeholder={placeholder}
                style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:14, outline:'none', boxSizing:'border-box' }}/>
            </div>
          ))}

          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:6 }}>State</label>
            <select value={state} onChange={e=>setState(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:14, outline:'none' }}>
              <option value="">Select state</option>
              {STATES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:6 }}>Email</label>
            <input value={user.email} readOnly style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:14, background:'#F8FAFC', color:'#94A3B8', boxSizing:'border-box' }}/>
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#475569', marginBottom:6 }}>Bio (optional)</label>
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="A short note about yourself..." rows={3}
              style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:14, outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
          </div>

          <button onClick={handleSave} style={{ width:'100%', background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', color:'var(--color-accent, #D4AF37)', border:'none', borderRadius:14, padding:'13px 0', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:15, cursor:'pointer' }}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
