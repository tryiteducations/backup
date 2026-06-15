import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

export default function DailyQuizWidget() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <div className="clay rounded-3xl p-6">
      <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg font-poppins mb-2">📅 Daily Quiz</h3>
      <p className="text-slate-500 text-sm mb-3">Today · 5 Questions · Current Affairs Focus</p>
      <div className="w-full bg-[var(--color-accent, #D4AF37)]/20 rounded-full h-2 mb-3 overflow-hidden">
        <div className="bg-[var(--color-accent, #D4AF37)] h-2 rounded-full w-full animate-pulse" />
      </div>
      <p className="text-xs text-slate-400 mb-4">Complete before midnight for bonus coins!</p>
      <button onClick={() => { navigate('/daily-quiz'); showToast('info', 'Daily Quiz started!') }}
        className="btn-gold w-full py-3.5 rounded-2xl font-bold text-base">
        Start Daily Quiz →
      </button>
      <p className="text-center text-xs text-green-600 font-semibold mt-2">+50 🪙 bonus waiting!</p>
    </div>
  )
}
