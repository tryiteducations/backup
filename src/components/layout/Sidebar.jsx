import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../Logo'
import { useAuth } from '../../context/AuthContext'
import {
  Home, FileText, Target, BookOpen, Gamepad2, GraduationCap,
  Users, Trophy, Library, Newspaper, DollarSign, BarChart2,
  CreditCard, Settings, ChevronRight
} from 'lucide-react'

const NAV = [
  { path: '/dashboard',       label: 'Dashboard',       icon: Home,          badge: null     },
  { path: '/test-engine',     label: 'My Tests',         icon: FileText,      badge: '3 New'  },
  { path: '/exams',           label: 'All Exams',        icon: Target,        badge: null     },
  { path: '/subjects',        label: 'Subjects',          icon: BookOpen,      badge: null     },
  { path: '/games',           label: 'Brain Games',      icon: Gamepad2,      badge: '🔥 Hot' },
  { path: '/guru-hub',        label: 'Guru Hub',         icon: GraduationCap, badge: '24'     },
  null,
  { path: '/hall',            label: 'The Hall',         icon: Users,         badge: null     },
  { path: '/tournaments',     label: 'Tournaments',      icon: Trophy,        badge: '●'      },
  null,
  { path: '/classroom',       label: 'Classroom',        icon: Library,       badge: null     },
  { path: '/current-affairs', label: 'Current Affairs',  icon: Newspaper,     badge: 'Today'  },
  { path: '/scholarships',    label: 'Scholarships',     icon: DollarSign,    badge: null     },
  null,
  { path: '/analytics',       label: 'My Analytics',     icon: BarChart2,     badge: null     },
  { path: '/pro',             label: 'Pro Member',        icon: CreditCard,    badge: 'PRO'    },
  { path: '/settings',        label: 'Settings',          icon: Settings,      badge: null     },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useAuth()

  const go = (path) => { navigate(path); if (onClose) onClose() }
  const active = (path) => pathname === path || (path !== '/' && pathname.startsWith(path + '/'))

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed left-0 top-0 h-screen w-[260px] z-40 flex flex-col overflow-hidden
        transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'linear-gradient(180deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))' }}>

        {/* Gold stripe */}
        <div className="h-1 w-full flex-shrink-0"
          style={{ background: 'linear-gradient(to right, transparent, var(--color-gold, #D4AF37), transparent)' }} />

        {/* Logo */}
        <div className="px-5 py-4 flex-shrink-0">
          <Logo dark height={36} />
          <p className="text-white/60 text-xs italic mt-1">Your Exam. Your Rank. Your Success.</p>
        </div>

        {/* User card */}
        <div className="px-4 pb-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-accent, #D4AF37)', color: 'var(--color-surface, #FFFFFF)' }}>
              {user?.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-surface, #FFFFFF)' }}>{user?.name}</p>
              <p className="text-xs" style={{ color: 'var(--color-accent, #D4AF37)' }}>{user?.levelEmoji} {user?.levelTitle}</p>
            </div>
          </div>
          {/* XP bar */}
          <div className="mt-2.5">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>{user?.xp.toLocaleString()} XP</span>
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>{user?.xpToNext.toLocaleString()}</span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ width: `${(user?.xp / user?.xpToNext) * 100}%`, background: 'var(--color-accent, #D4AF37)', height: '100%', borderRadius: 999 }} />
            </div>
          </div>
          {/* Stats pills */}
          <div className="flex gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold"
              style={{ background: 'rgba(var(--color-accent-rgb, 212, 175, 55), 0.2)', color: 'var(--color-accent, #D4AF37)' }}>
              🪙 {user?.coins.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold"
              style={{ background: 'rgba(var(--color-error-rgb, 239, 68, 68), 0.18)', color: 'var(--color-error, #EF4444)' }}>
              🔥 {user?.streak}
            </span>
          </div>
        </div>

        {/* Active exam */}
        <div className="px-4 py-2.5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between rounded-xl px-3 py-2"
            style={{ background: 'rgba(var(--color-accent-rgb, 212, 175, 55), 0.14)', border: '1px solid rgba(var(--color-accent-rgb, 212, 175, 55), 0.24)' }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--color-accent, #D4AF37)' }}>Active Exam</p>
              <p className="text-white text-sm font-bold">{user?.exams[0]?.name}</p>
            </div>
            <button onClick={() => go('/exams')} className="text-xs flex items-center gap-0.5 hover:underline"
              style={{ color: 'var(--color-accent, #D4AF37)' }}>
              Switch <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 scrollbar-hide">
          {NAV.map((item, i) => {
            if (item === null) return <hr key={i} className="border-white/10 my-2" />
            const Icon = item.icon
            const isActive = active(item.path)
            return (
              <button key={item.path} onClick={() => go(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all"
                style={{
                  background: isActive ? 'rgba(var(--color-accent-rgb, 212, 175, 55), 0.14)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--color-accent, #D4AF37)' : '2px solid transparent',
                  color: isActive ? 'var(--color-accent, #D4AF37)' : 'rgba(255,255,255,0.86)',
                }}>
                <Icon size={18} className="flex-shrink-0" style={{ color: isActive ? 'var(--color-accent, #D4AF37)' : 'rgba(255,255,255,0.86)' }} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge !== null && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: item.badge === 'PRO' ? 'var(--color-accent, #D4AF37)' : item.badge === '●' ? 'transparent' : 'rgba(255,255,255,0.14)',
                      color: item.badge === 'PRO' ? 'var(--color-primary-dark, #1E3A5F)' : item.badge === '●' ? 'var(--color-error, #EF4444)' : 'rgba(255,255,255,0.9)',
                      fontSize: item.badge === '●' ? 14 : 11,
                      lineHeight: item.badge === '●' ? 1 : 1.2,
                    }}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
