import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { useToast } from '../context/ToastContext'

const NOTIFS = [
  { id:1, type:'badge',    icon:'🦁', title:'Badge Unlocked: Baahuveer!',         body:'You reached Level 6. The warrior king awakens.', time:'2 min ago',  read:false },
  { id:2, type:'rank',     icon:'📈', title:'Rank improved! #1,243 → #1,101',      body:'Your SSC CGL mock test boosted your rank by 142 positions.', time:'1 hr ago',   read:false },
  { id:3, type:'doubt',    icon:'🎓', title:'Your doubt was answered!',            body:'Vikram Nair replied: "In mixture problems, always keep one component constant..."', time:'3 hrs ago',  read:false },
  { id:4, type:'alert',    icon:'⏰', title:'SSC CGL Application closes in 7 days',body:'Last date to apply: March 20, 2026. Official site linked.', time:'5 hrs ago',  read:true  },
  { id:5, type:'hall',     icon:'⚔️', title:'IIT Chasers is WINNING the battle!',  body:'342 vs 298 against Physics Gang. Answer more questions to seal the win!', time:'6 hrs ago',  read:true  },
  { id:6, type:'coins',    icon:'🪙', title:'+50 coins: Daily Quiz Bonus',          body:'You scored 4/5 in today\'s Current Affairs quiz. Coins added!', time:'Yesterday', read:true  },
  { id:7, type:'streak',   icon:'🔥', title:'12-Day Streak! Don\'t break it.',      body:'Study at least 1 topic today to keep your streak alive.', time:'Yesterday', read:true  },
  { id:8, type:'exam',     icon:'📡', title:'UPSC Prelims 2026 Notification Out',  body:'Notification released. Applications open Feb 15 – Mar 15. Check now.', time:'2 days ago',read:true  },
]

const TYPE_COLOR = { badge:'bg-[var(--color-accent, #D4AF37)]', rank:'bg-green-500', doubt:'bg-blue-500',
  alert:'bg-red-500', hall:'bg-purple-500', coins:'bg-amber-500',
  streak:'bg-orange-500', exam:'bg-[var(--color-primary, #1E3A5F)]' }

const FILTERS = ['All','Unread','Badges','Rank','Doubts','Alerts','Hall']

export default function Notifications() {
  const { showToast } = useToast()
  const [notifs, setNotifs] = useState(NOTIFS)
  const [filter, setFilter] = useState('All')

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read:true })))
    showToast('success','All notifications marked as read')
  }

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true
    if (filter === 'Unread') return !n.read
    return n.type === filter.toLowerCase()
  })

  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary, #1E3A5F)] font-poppins">🔔 Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-slate-500 text-sm mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-[var(--color-accent, #D4AF37)] text-sm font-semibold hover:underline">
              Mark all read
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all
                ${filter===f ? 'bg-[var(--color-primary, #1E3A5F)] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[var(--color-accent, #D4AF37)]'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(n => (
            <div key={n.id}
              onClick={() => setNotifs(prev => prev.map(x => x.id===n.id ? {...x,read:true} : x))}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                ${n.read ? 'bg-white border-slate-100' : 'bg-white border-[var(--color-accent, #D4AF37)]/30 shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-full ${TYPE_COLOR[n.type] || 'bg-slate-400'} flex items-center justify-center text-lg flex-shrink-0 mt-0.5`}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${n.read ? 'text-slate-700' : 'text-[var(--color-primary, #1E3A5F)]'}`}>
                  {n.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent, #D4AF37)] flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="clay rounded-3xl p-12 text-center">
              <p className="text-5xl mb-3">🔕</p>
              <p className="font-bold text-[var(--color-primary, #1E3A5F)]">No notifications here</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
