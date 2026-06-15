import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, ChevronDown, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ThemeSwitcher from '../ThemeSwitcher'

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
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-[68px] z-20 flex items-center justify-between px-5 glass"
      style={{ background: 'var(--glass-surface, rgba(255,255,255,0.82))', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--glass-border, rgba(226,232,240,0.9))' }}>

      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{ background: 'transparent' }}>
          <Menu size={20} className="text-current" />
        </button>
        <h1 className="text-xl font-bold font-poppins hidden sm:block" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>{title}</h1>
        <div className="hidden md:flex items-center gap-2 glass-gold px-3 py-1.5"
          style={{ color:'var(--color-text, #1E3A5F)' }}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse-dot" style={{ color:'var(--color-accent, #D4AF37)' }} />
          <span className="text-xs font-semibold" style={{ color:'var(--color-text, #1E3A5F)' }}>{user?.exams[0]?.name}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
          style={{ background:'var(--button-surface, rgba(255,255,255,0.92))', color:'var(--button-text, var(--color-text, #1E3A5F))', border:'1px solid var(--glass-border, rgba(226,232,240,0.9))' }}>
          <Globe size={15} /> EN
        </button>
        {user?.isPro && (
          <span className="hidden sm:flex clay-gold items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs"
            style={{ color:'var(--color-text, #1E3A5F)' }}>
            ⚡ PRO
          </span>
        )}
        <div className="hidden sm:flex items-center">
          <ThemeSwitcher />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
          style={{ background:'var(--button-surface, rgba(255,255,255,0.92))' }}>
          <span className="text-base">🪙</span>
          <span className="text-sm font-bold" style={{ color:'var(--color-text, #1E3A5F)' }}>{user?.coins.toLocaleString()}</span>
        </div>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{ background:'transparent', color: 'var(--color-text, #1E3A5F)' }}>
          <Bell size={20} className="text-current" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="relative">
          <button onClick={() => setDropOpen(p => !p)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors"
            style={{ background:'transparent' }}>
            <div className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center"
              style={{ background:'var(--color-primary, #1E3A5F)', border:'2px solid var(--color-accent, #D4AF37)' }}>
              {user?.initials}
            </div>
            <span className="hidden md:block text-sm font-semibold" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>{user?.name.split(' ')[0]}</span>
            <ChevronDown size={14} className="text-current opacity-70" />
          </button>
          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 clay rounded-2xl p-2 shadow-xl z-50"
              style={{ background:'var(--glass-surface, rgba(255,255,255,0.92))', border:'1px solid var(--glass-border, rgba(255,255,255,0.55))' }}>
              {menuItems.map(item => (
                <button key={item.label} onClick={() => { item.action(); setDropOpen(false) }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ color: item.red ? '#EF4444' : 'var(--color-text, #1E3A5F)', background:'transparent' }}>
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
