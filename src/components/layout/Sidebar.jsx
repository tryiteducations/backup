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
      <aside className={`fixed left-0 top-0 h-screen w-[260px] bg-[#1E3A5F] z-40 flex flex-col overflow-hidden
        transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Gold stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent flex-shrink-0" />

        {/* Logo */}
        <div className="px-5 py-4 flex-shrink-0">
          <Logo dark height={36} />
          <p className="text-white/40 text-xs italic mt-1">Your Exam. Your Rank. Your Success.</p>
        </div>

        {/* User card */}
        <div className="px-4 pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-bold text-sm flex items-center justify-center flex-shrink-0">
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user.name}</p>
              <p className="text-[#D4AF37] text-xs">{user.levelEmoji} {user.levelTitle}</p>
            </div>
          </div>
          {/* XP bar */}
          <div className="mt-2.5">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/50">{user.xp.toLocaleString()} XP</span>
              <span className="text-white/50">{user.xpToNext.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-[#D4AF37] h-1.5 rounded-full" style={{ width: `${(user.xp / user.xpToNext) * 100}%` }} />
            </div>
          </div>
          {/* Stats pills */}
          <div className="flex gap-2 mt-2">
            <span className="flex items-center gap-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-3 py-1 rounded-full font-semibold">
              🪙 {user.coins.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full font-semibold">
              🔥 {user.streak}
            </span>
          </div>
        </div>

        {/* Active exam */}
        <div className="px-4 py-2.5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-xl px-3 py-2">
            <div>
              <p className="text-[#D4AF37] text-xs font-semibold">Active Exam</p>
              <p className="text-white text-sm font-bold">{user.exams[0]?.name}</p>
            </div>
            <button onClick={() => go('/exams')} className="text-[#D4AF37] text-xs flex items-center gap-0.5 hover:underline">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all
                  ${isActive
                    ? 'bg-[#D4AF37]/15 border-l-2 border-[#D4AF37] text-[#D4AF37]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                    ${item.badge === 'PRO' ? 'bg-[#D4AF37] text-[#1E3A5F]'
                    : item.badge === '●' ? 'text-red-400 animate-pulse-dot text-base leading-none'
                    : 'bg-white/10 text-white/70'}`}>
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
