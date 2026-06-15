// src/pages/mentor/MentorHub.jsx — home page for role==='mentor'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SAMPLE_DOUBTS = [
  { id: 1, subject: 'Mathematics', question: 'How do I solve quadratic inequalities on a number line?', time: '12 min ago', coins: 5 },
  { id: 2, subject: 'History',     question: 'What were the main causes of the 1857 revolt?',            time: '34 min ago', coins: 5 },
  { id: 3, subject: 'Physics',     question: 'Explain Bernoulli\'s principle with a real-life example.',  time: '1 hr ago',   coins: 5 },
]

const QUICK_LINKS = [
  { emoji: '✍️', label: 'Answer Doubts',    path: '/guru-hub',              desc: 'Help students & earn coins' },
  { emoji: '📊', label: 'Analytics',         path: '/mentor-hub/analytics',  desc: 'Your impact metrics' },
  { emoji: '💰', label: 'Cashback Center',   path: '/mentor-hub/cashback',   desc: 'Track your referral earnings' },
  { emoji: '🎟️', label: 'Coupon Manager',   path: '/mentor-hub/coupons',    desc: 'Create discount codes' },
]

export default function MentorHub() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))'}}>
      <p style={{color:'var(--color-accent, #D4AF37)',fontFamily:'Poppins,sans-serif',fontSize:18}}>Loading...</p>
    </div>
  )
  if (!user) return null

  return (
    <AppLayout title="Mentor Hub">
      <div className="max-w-2xl mx-auto space-y-6 p-4">

        {/* Welcome */}
        <div className="rounded-2xl p-5" style={{ background:'linear-gradient(135deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))', color:'var(--color-surface, #FFFFFF)' }}>
          <p className="text-sm opacity-70">Welcome back, Mentor</p>
          <p className="text-2xl font-bold">{user.name} 🎓</p>
          {user.mentorSubjects && (
            <p className="text-sm opacity-70 mt-1">Subjects: {Array.isArray(user.mentorSubjects) ? user.mentorSubjects.join(', ') : user.mentorSubjects}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Answers Given',   value: user.guruPoints ?? 0, emoji: '✍️' },
            { label: 'Coins Earned',     value: user.coins ?? 0,      emoji: '🪙' },
            { label: 'Students Helped',  value: 0,                    emoji: '👨‍🎓' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border p-4 text-center shadow-sm" style={{ background:'var(--color-surface, #FFFFFF)', borderColor:'var(--color-border, #E2E8F0)' }}>
              <p className="text-2xl">{s.emoji}</p>
              <p className="text-2xl font-black" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color:'var(--subtext-color, #64748B)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map(l => (
            <button
              key={l.label}
              onClick={() => navigate(l.path)}
              className="rounded-2xl border shadow-sm p-4 text-left hover:shadow-md transition"
              style={{ background:'var(--color-surface, #FFFFFF)', borderColor:'var(--color-border, #E2E8F0)', color:'var(--heading-color, var(--color-text, #1E3A5F))' }}
            >
              <span className="text-2xl">{l.emoji}</span>
              <p className="font-bold mt-2 text-sm" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>{l.label}</p>
              <p className="text-xs" style={{ color:'var(--subtext-color, #64748B)' }}>{l.desc}</p>
            </button>
          ))}
        </div>

        {/* Recent doubts */}
        <div className="rounded-2xl shadow-sm" style={{ background:'var(--color-surface, #FFFFFF)', border:'1px solid var(--color-border, #E2E8F0)' }}>
          <div className="p-5 flex items-center justify-between" style={{ borderBottom:'1px solid var(--color-border, #E2E8F0)' }}>
            <h2 className="font-bold" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>Recent Doubts You Can Help</h2>
            <button onClick={() => navigate('/guru-hub')} className="text-xs font-semibold hover:underline" style={{ color:'var(--color-accent, #D4AF37)' }}>See all →</button>
          </div>
          <ul className="divide-y" style={{ borderColor:'var(--color-bg, #F8FAFC)' }}>
            {SAMPLE_DOUBTS.map(d => (
              <li key={d.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition" onClick={() => navigate('/guru-hub')}>
                <div className="flex-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background:'rgba(212,175,55,0.12)', color:'var(--color-accent, #D4AF37)' }}>{d.subject}</span>
                  <p className="text-sm mt-1 line-clamp-2" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>{d.question}</p>
                  <p className="text-xs mt-0.5" style={{ color:'var(--subtext-color, #64748B)' }}>{d.time}</p>
                </div>
                <span className="text-xs font-bold whitespace-nowrap" style={{ color:'var(--color-accent, #D4AF37)' }}>+{d.coins} 🪙</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </AppLayout>
  )
}