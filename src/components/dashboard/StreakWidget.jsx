import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function StreakWidget() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const days = ['M','T','W','T','F','S','S']

  return (
    <div className="clay rounded-3xl p-6">
      <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg font-poppins mb-4">🔥 Study Streak</h3>
      <div className="flex flex-col items-center gap-2 mb-5">
        <span className="text-6xl font-extrabold text-[var(--color-accent, #D4AF37)] font-poppins leading-none">{user?.streak}</span>
        <p className="text-slate-500 text-sm">consecutive days</p>
      </div>
      <div className="flex gap-1.5 justify-between mb-4">
        {days.map((d, i) => {
          const done = i <= todayIdx
          const today = i === todayIdx
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: today ? 'var(--color-primary, #1E3A5F)' : done ? 'var(--color-accent, #D4AF37)' : 'var(--color-bg, #F8FAFC)',
                  color: today ? 'var(--color-surface, #FFFFFF)' : done ? 'var(--color-primary, #1E3A5F)' : 'var(--color-text-light, #94A3B8)',
                  border: today ? '2px solid var(--color-accent, #D4AF37)' : '1px solid rgba(148,163,184,0.16)',
                }}>
                {done && !today ? '✓' : d}
              </div>
              <span className="text-xs text-slate-400">{d}</span>
            </div>
          )
        })}
      </div>
      <button onClick={() => showToast('info', `Streak freeze used! ${user?.streakFreezes - 1} left.`)}
        className="w-full text-center text-sm font-semibold text-[var(--color-accent, #D4AF37)] hover:underline">
        ❄️ Use Streak Freeze ({user?.streakFreezes} left)
      </button>
    </div>
  )
}
