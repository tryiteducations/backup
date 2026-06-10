import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, ChevronDown, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ onMenuClick, title = 'Dashboard' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)

  const menuItems = [
    { label: '👤 My Profile',   action: () => navigate('/profile')  },
    { label: '⚙️ Settings',     action: () => navigate('/settings') },
    { label: '💳 Pro Member',   action: () => navigate('/pro')      },
    { label: '🚪 Sign Out',     action: () => { logout(); navigate('/landing') }, red: true },
  ]

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-[68px] z-20 flex items-center justify-between px-5"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E2E8F0' }}>

      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
          <Menu size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-[#1E3A5F] font-poppins hidden sm:block">{title}</h1>
        <div className="hidden md:flex items-center gap-2 glass-gold px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse-dot" />
          <span className="text-xs font-semibold text-[#1E3A5F]">{user.exams[0]?.name}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="hidden sm:flex items-center gap-1.5 glass px-3 py-2 rounded-xl text-slate-600 text-sm font-medium hover:text-[#1E3A5F]">
          <Globe size={15} /> EN
        </button>
        {user.isPro && (
          <span className="hidden sm:flex clay-gold items-center gap-1 px-3 py-1.5 rounded-xl text-[#1E3A5F] font-bold text-xs">
            ⚡ PRO
          </span>
        )}
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl">
          <span className="text-base">🪙</span>
          <span className="text-sm font-bold text-[#1E3A5F]">{user.coins.toLocaleString()}</span>
        </div>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="relative">
          <button onClick={() => setDropOpen(p => !p)}
            className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1.5 rounded-xl transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#1E3A5F] border-2 border-[#D4AF37] text-white font-bold text-xs flex items-center justify-center">
              {user.initials}
            </div>
            <span className="hidden md:block text-sm font-semibold text-slate-700">{user.name.split(' ')[0]}</span>
            <ChevronDown size={14} className="text-slate-500" />
          </button>
          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 clay rounded-2xl p-2 shadow-xl z-50">
              {menuItems.map(item => (
                <button key={item.label} onClick={() => { item.action(); setDropOpen(false) }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors
                    ${item.red ? 'text-red-500 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-100'}`}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
