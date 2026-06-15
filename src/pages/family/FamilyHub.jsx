// src/pages/family/FamilyHub.jsx  — home page for role==='family'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SAMPLE_CHILD = {
  name: 'Arjun Kumar',
  exam: 'UPSC CSE',
  readiness: 62,
  streak: 14,
  recentScores: [
    { subject: 'History',   score: 78, date: 'Jan 18' },
    { subject: 'Geography', score: 65, date: 'Jan 17' },
    { subject: 'Polity',    score: 82, date: 'Jan 16' },
  ],
}

const PARENT_TIPS = [
  { emoji: '📅', title: 'Build a Study Schedule Together', desc: 'Consistent daily time slots outperform marathon weekend sessions.' },
  { emoji: '🧘', title: 'Manage Exam Anxiety', desc: 'Breathing exercises and mock tests reduce test-day fear significantly.' },
  { emoji: '🥗', title: 'Nutrition & Sleep Matter', desc: 'A well-rested brain retains 40% more than a sleep-deprived one.' },
]

export default function FamilyHub() {
  const { user, updateUser, loading } = useAuth()
  const navigate = useNavigate()
  const [emailInput, setEmailInput] = useState('')
  const [connected, setConnected] = useState(false)

  if (!user) return null

  const hasChild = !!user.childEmail || connected

  const handleConnect = () => {
    if (!emailInput.trim()) return
    updateUser({ childEmail: emailInput.trim() })
    setConnected(true)
  }

  return (
    <AppLayout title="Family Hub">
      <div className="max-w-2xl mx-auto space-y-6 p-4">

        <div className="rounded-2xl p-5" style={{ background:'linear-gradient(135deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))', color:'var(--color-surface, #FFFFFF)' }}>
          <p className="text-sm opacity-70">Welcome back</p>
          <p className="text-2xl font-bold">{user.name} 👨‍👩‍👦</p>
          <p className="text-sm opacity-70 mt-1">Track your child's exam journey and stay involved.</p>
        </div>

        {/* Child card */}
        {hasChild ? (
          <div className="rounded-2xl shadow-sm p-5 space-y-4" style={{ background:'var(--color-surface, #FFFFFF)', border:'1px solid var(--color-border, #E2E8F0)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide" style={{ color:'var(--subtext-color, #64748B)' }}>Connected Child</p>
                <p className="text-lg font-bold" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>{SAMPLE_CHILD.name}</p>
                <p className="text-sm" style={{ color:'var(--subtext-color, #64748B)' }}>Preparing for {SAMPLE_CHILD.exam}</p>
              </div>
              <span className="text-3xl">👦</span>
            </div>

            {/* Readiness bar */}
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color:'var(--subtext-color, #64748B)' }}>
                <span>Exam Readiness</span>
                <span className="font-bold" style={{ color:'var(--color-accent, #D4AF37)' }}>{SAMPLE_CHILD.readiness}%</span>
              </div>
              <div className="h-2 bg-[var(--color-bg, #F8FAFC)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${SAMPLE_CHILD.readiness}%`, background:'var(--color-accent, #D4AF37)' }} />
              </div>
            </div>

            <div className="flex gap-4 text-center">
              <div className="flex-1 rounded-xl p-3" style={{ background:'var(--color-bg, #F8FAFC)' }}>
                <p className="text-xl font-black" style={{ color:'var(--color-accent, #D4AF37)' }}>🔥{SAMPLE_CHILD.streak}</p>
                <p className="text-xs" style={{ color:'var(--subtext-color, #64748B)' }}>Day Streak</p>
              </div>
              {SAMPLE_CHILD.recentScores.slice(0,3).map(s => (
                <div key={s.subject} className="flex-1 rounded-xl p-3" style={{ background:'var(--color-bg, #F8FAFC)' }}>
                  <p className="text-xl font-black" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>{s.score}%</p>
                  <p className="text-xs truncate" style={{ color:'var(--subtext-color, #64748B)' }}>{s.subject}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-center text-gray-400">Live sync coming soon — showing sample progress data</p>
          </div>
        ) : (
          <div className="rounded-2xl shadow-sm p-6 text-center space-y-4" style={{ background:'var(--color-surface, #FFFFFF)', border:'1px solid var(--color-border, #E2E8F0)' }}>
            <span className="text-5xl">👨‍👩‍👧</span>
            <p className="font-bold text-lg" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>Connect Your Child's Account</p>
            <p className="text-sm" style={{ color:'var(--subtext-color, #64748B)' }}>Enter your child's TryIT email to start tracking their progress.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="child@email.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none"
                style={{ borderColor:'var(--color-border, #E2E8F0)' }}
              />
              <button
                onClick={handleConnect}
                className="px-4 py-2 rounded-xl text-sm font-bold transition"
                style={{ background:'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', color:'var(--color-primary-dark, #0F2140)' }}
              >
                Connect
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div>
          <h2 className="font-bold text-lg mb-3" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>Tips for Parents</h2>
          <div className="space-y-3">
            {PARENT_TIPS.map(tip => (
              <div key={tip.title} className="rounded-2xl p-4 flex gap-3 items-start shadow-sm" style={{ background:'var(--color-surface, #FFFFFF)', border:'1px solid var(--color-border, #E2E8F0)' }}>
                <span className="text-2xl">{tip.emoji}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color:'var(--heading-color, var(--color-text, #1E3A5F))' }}>{tip.title}</p>
                  <p className="text-xs mt-0.5" style={{ color:'var(--subtext-color, #64748B)' }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
