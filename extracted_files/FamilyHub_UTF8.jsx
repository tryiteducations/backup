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
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [emailInput, setEmailInput] = useState('')
  const [connected, setConnected] = useState(false)

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',
      justifyContent:'center',background:'linear-gradient(135deg,#1E3A5F,#0F2140)'}}>
      <p style={{color:'#D4AF37',fontFamily:'Poppins,sans-serif',fontSize:18,fontWeight:700}}>Loading...</p>
    </div>
  )
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

        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#0F2140] rounded-2xl p-5 text-white">
          <p className="text-sm opacity-70">Welcome back</p>
          <p className="text-2xl font-bold">{user.name} 👨‍👩‍👦</p>
          <p className="text-sm opacity-70 mt-1">Track your child's exam journey and stay involved.</p>
        </div>

        {/* Child card */}
        {hasChild ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Connected Child</p>
                <p className="text-lg font-bold text-[#1E3A5F]">{SAMPLE_CHILD.name}</p>
                <p className="text-sm text-gray-500">Preparing for {SAMPLE_CHILD.exam}</p>
              </div>
              <span className="text-3xl">👦</span>
            </div>

            {/* Readiness bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Exam Readiness</span>
                <span className="font-bold text-[#D4AF37]">{SAMPLE_CHILD.readiness}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${SAMPLE_CHILD.readiness}%` }} />
              </div>
            </div>

            <div className="flex gap-4 text-center">
              <div className="flex-1 bg-[#FDF6E3] rounded-xl p-3">
                <p className="text-xl font-black text-[#D4AF37]">🔥{SAMPLE_CHILD.streak}</p>
                <p className="text-xs text-gray-500">Day Streak</p>
              </div>
              {SAMPLE_CHILD.recentScores.slice(0,3).map(s => (
                <div key={s.subject} className="flex-1 bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-black text-[#1E3A5F]">{s.score}%</p>
                  <p className="text-xs text-gray-500 truncate">{s.subject}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-center text-gray-400">Live sync coming soon — showing sample progress data</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-4">
            <span className="text-5xl">👨‍👩‍👧</span>
            <p className="text-[#1E3A5F] font-bold text-lg">Connect Your Child's Account</p>
            <p className="text-gray-500 text-sm">Enter your child's TryIT email to start tracking their progress.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="child@email.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-[#D4AF37] text-[#0F2140] font-bold rounded-xl text-sm hover:bg-[#E8C84A] transition"
              >
                Connect
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div>
          <h2 className="font-bold text-[#1E3A5F] text-lg mb-3">Tips for Parents</h2>
          <div className="space-y-3">
            {PARENT_TIPS.map(tip => (
              <div key={tip.title} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 items-start shadow-sm">
                <span className="text-2xl">{tip.emoji}</span>
                <div>
                  <p className="font-semibold text-[#1E3A5F] text-sm">{tip.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
