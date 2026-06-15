// src/pages/admin/AdminUserManager.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SAMPLE_USERS = [
  { id:1, name:'Arjun Kumar', email:'arjun@gmail.com', role:'student', plan:'pro_trial', coins:340, level:4, joinDate:'2026-06-01', lastActive:'Today', suspended:false },
  { id:2, name:'Priya Sharma', email:'priya@gmail.com', role:'mentor', plan:'pro_trial', coins:1200, level:6, joinDate:'2026-05-20', lastActive:'Yesterday', suspended:false },
  { id:3, name:'ABC Coaching', email:'abc@coaching.com', role:'institution', plan:'pro_trial', coins:0, level:1, joinDate:'2026-06-05', lastActive:'Today', suspended:false },
  { id:4, name:'Rajan M.', email:'rajan@gmail.com', role:'student', plan:'pro_trial', coins:50, level:2, joinDate:'2026-06-10', lastActive:'3 days ago', suspended:true },
]

export default function AdminUserManager() {
  const navigate = useNavigate()
  const { viewAs } = useAuth()
  const [users, setUsers] = useState(SAMPLE_USERS)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id])

  const suspend = (id) => setUsers(u => u.map(x => x.id===id ? {...x, suspended:!x.suspended} : x))

  const handleViewAs = (user) => {
    viewAs(user.role)
    navigate(user.role==='student'?'/dashboard':user.role==='mentor'?'/mentor-hub':user.role==='institution'?'/centre/dashboard':'/family')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC' }}>
      <div style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', padding:'20px 32px' }}>
        <button onClick={()=>navigate('/admin/dashboard')} style={{ background:'none', border:'none', color:'rgba(var(--color-surface-rgb, 255,255,255), 0.6)', cursor:'pointer', fontSize:13, marginBottom:4, display:'block' }}>← Back to Admin</button>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'var(--color-accent, #D4AF37)', fontSize:22, margin:0 }}>👥 User Manager</p>
      </div>

      <div style={{ padding:'24px 32px' }}>
        <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, outline:'none' }}/>
          {selected.length > 0 && (
            <button style={{ background:'#FEE2E2', color:'#991B1B', border:'none', borderRadius:12, padding:'10px 18px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              Suspend {selected.length} selected
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:60, color:'#94A3B8', background:'#fff', borderRadius:18, border:'1.5px solid var(--color-border, #E2E8F0)' }}>
            <p style={{ fontSize:32 }}>👤</p>
            <p>No users found</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.map(u=>(
              <div key={u.id} style={{ background:'#fff', borderRadius:14, border:'1.5px solid var(--color-border, #E2E8F0)', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                <input type="checkbox" checked={selected.includes(u.id)} onChange={()=>toggle(u.id)}/>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--color-primary, #1E3A5F)', color:'var(--color-accent, #D4AF37)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, flexShrink:0 }}>
                  {u.name.slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:120 }}>
                  <p style={{ fontWeight:700, color:'var(--color-primary, #1E3A5F)', fontSize:13, margin:'0 0 2px' }}>{u.name}</p>
                  <p style={{ color:'#94A3B8', fontSize:11, margin:0 }}>{u.email} · {u.role} · joined {u.joinDate}</p>
                </div>
                <span style={{ fontSize:12, color:'var(--color-muted, #64748B)' }}>🪙 {u.coins}</span>
                <span style={{ fontSize:12, color:'var(--color-muted, #64748B)' }}>Lv.{u.level}</span>
                <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(212,175,55,0.15)', color:'#92400E', fontWeight:700 }}>{u.plan}</span>
                <span style={{ fontSize:11, color:'#94A3B8' }}>Active: {u.lastActive}</span>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={()=>handleViewAs(u)} style={{ background:'var(--color-bg-muted, #EFF6FF)', color:'#1D4ED8', border:'none', borderRadius:8, padding:'5px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>👁 View As</button>
                  <button onClick={()=>suspend(u.id)} style={{ background: u.suspended?'#DCFCE7':'#FEE2E2', color: u.suspended?'#15803D':'#991B1B', border:'none', borderRadius:8, padding:'5px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                    {u.suspended?'Unsuspend':'Suspend'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
