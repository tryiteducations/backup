import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TOP3 = [
  { name: 'Priya S.',  state: 'Chennai', score: '97.4%' },
  { name: 'Rahul K.',  state: 'Delhi',   score: '94.8%' },
  { name: 'Aisha M.',  state: 'Gujarat', score: '93.1%' },
]
const FILTERS = ['All India','State','City','Friends']

export default function LeaderboardWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All India')

  return (
    <div className="clay-dark rounded-3xl p-6">
      <h3 className="font-bold text-white text-lg font-poppins mb-3">🏆 Leaderboard</h3>
      <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-hide">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all
              ${filter === f ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="text-center mb-4">
        <p className="text-5xl font-extrabold text-[#D4AF37] font-poppins leading-none">#{user.rank.toLocaleString()}</p>
        <p className="text-white/60 text-sm mt-1">{filter}</p>
        <p className="text-white/40 text-xs mt-1">TN: #127 · Coimbatore: #8</p>
      </div>
      <div className="space-y-2 mb-3">
        {TOP3.map((r, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
            <span className="text-lg">{['🥇','🥈','🥉'][i]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{r.name}</p>
              <p className="text-white/40 text-xs">{r.state}</p>
            </div>
            <span className="text-[#D4AF37] text-sm font-bold">{r.score}</span>
          </div>
        ))}
      </div>
      <p className="text-green-400 text-xs font-semibold text-center mb-3">↑ Moved up 142 positions this week</p>
      <button onClick={() => navigate('/leaderboard')} className="text-[#D4AF37] text-sm font-semibold hover:underline w-full text-center">
        See Full Leaderboard →
      </button>
    </div>
  )
}
