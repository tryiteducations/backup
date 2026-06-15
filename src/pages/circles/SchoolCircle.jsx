// src/pages/circles/SchoolCircle.jsx
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SAMPLE_MEMBERS = [
  { name: 'Priya S.',   initials: 'PS', level: 'The Riser' },
  { name: 'Arjun K.',   initials: 'AK', level: 'The Fighter' },
  { name: 'Sneha M.',   initials: 'SM', level: 'The Grinder' },
  { name: 'Ravi T.',    initials: 'RT', level: 'The Fierce One' },
]

const SAMPLE_ANNOUNCEMENTS = [
  { id: 1, title: '📅 Mock Test This Saturday', body: 'Centre mock for UPSC Prelims — 10am sharp. Bring your hall ticket number.', time: '2 days ago' },
  { id: 2, title: '📚 New Study Material Added', body: 'Current affairs notes for January 2025 uploaded to the resource library.', time: '5 days ago' },
  { id: 3, title: '🏆 Circle Leaderboard Reset', body: 'Monthly circle rank reset on the 1st. Keep your streak going!', time: '1 week ago' },
]

export default function SchoolCircle() {
  const { user, updateUser } = useAuth()
  const [codeInput, setCodeInput] = useState('')
  const [joined, setJoined] = useState(false)

  if (!user) return null

  const hasCircle = !!user.institutionCode || joined

  const handleJoin = () => {
    if (!codeInput.trim()) return
    updateUser({ institutionCode: codeInput.trim().toUpperCase() })
    setJoined(true)
  }

  return (
    <AppLayout title="School Circle">
      <div className="max-w-2xl mx-auto space-y-6 p-4">

        <div className="bg-gradient-to-r from-[var(--color-primary, #1E3A5F)] to-[#3B2A6B] rounded-2xl p-5 text-white">
          <p className="text-2xl font-bold">🏫 School Circle</p>
          <p className="text-sm opacity-70 mt-1">Your institution's private community space — study together, stay updated.</p>
        </div>

        {hasCircle ? (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Your Circle Code</p>
                <p className="font-mono font-black text-[var(--color-accent, #D4AF37)] text-xl">{user.institutionCode || codeInput.toUpperCase()}</p>
              </div>
              <button className="text-xs text-red-400 hover:underline">Leave Circle</button>
            </div>

            {/* Members */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-[var(--color-primary, #1E3A5F)] mb-3">Members ({SAMPLE_MEMBERS.length})</h2>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_MEMBERS.map(m => (
                  <div key={m.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary, #1E3A5F)] text-white text-xs font-bold flex items-center justify-center">{m.initials}</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-[var(--color-primary, #1E3A5F)]">Announcements</h2>
              </div>
              <ul className="divide-y divide-gray-50">
                {SAMPLE_ANNOUNCEMENTS.map(a => (
                  <li key={a.id} className="p-4">
                    <p className="font-semibold text-gray-800 text-sm">{a.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{a.body}</p>
                    <p className="text-gray-400 text-xs mt-1">{a.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-4">
            <span className="text-5xl">🏫</span>
            <p className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg">Join a School Circle</p>
            <p className="text-gray-500 text-sm">Enter the circle code shared by your school, coaching centre, or institution.</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. NSET2025"
                value={codeInput}
                onChange={e => setCodeInput(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]"
              />
              <button
                onClick={handleJoin}
                className="px-4 py-2 bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary-dark, #0F2140)] font-bold rounded-xl text-sm hover:bg-[var(--color-accent-light, #E8C84A)] transition"
              >
                Join
              </button>
            </div>
            <p className="text-xs text-gray-400">Don't have a code? Ask your school administrator or mentor.</p>
          </div>
        )}

      </div>
    </AppLayout>
  )
}