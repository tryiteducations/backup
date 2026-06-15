import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const EARNINGS = [
  { source: 'Math Blitz game',    amount: +15, icon: '🎮' },
  { source: 'Daily Quiz bonus',   amount: +50, icon: '📅' },
  { source: 'Guru Hub answer',    amount: +5,  icon: '🎓' },
]

export default function CoinsWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const weekProg = 340, weekTarget = 500

  return (
    <div className="clay-gold rounded-3xl p-6">
      <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg font-poppins mb-3">🪙 Coins</h3>
      <div className="flex flex-col items-center gap-1 mb-4">
        <span className="text-5xl font-extrabold text-[var(--color-primary, #1E3A5F)] font-poppins">{user?.coins.toLocaleString()}</span>
        {user?.isPro && (
          <span className="clay-dark text-[var(--color-accent, #D4AF37)] text-xs font-bold px-3 py-1 rounded-full">⚡ 3× PRO MULTIPLIER</span>
        )}
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[var(--color-primary, #1E3A5F)]/70 mb-1">
          <span>This week</span><span>{weekProg}/{weekTarget}</span>
        </div>
        <div className="w-full bg-[var(--color-primary, #1E3A5F)]/20 rounded-full h-2.5">
          <div className="bg-[var(--color-primary, #1E3A5F)] h-2.5 rounded-full" style={{ width: `${(weekProg / weekTarget) * 100}%` }} />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {EARNINGS.map((e, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-primary, #1E3A5F)]/80">{e.icon} {e.source}</span>
            <span className="font-bold text-green-700">+{e.amount}🪙</span>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/wallet')} className="btn-navy w-full py-2.5 rounded-xl font-bold text-sm">
        View Wallet →
      </button>
    </div>
  )
}
