import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ResultScreen() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { addCoins, updateUser, user } = useAuth()
  const coinsAwardedRef = useRef(false)

  if (!state) {
    // No test data — redirect
    navigate('/test-engine')
    return null
  }

  const { questions, answers, score, config } = state

  const total = questions.length
  const percentage = Math.round((score / total) * 100)
  const isGreat = percentage >= 80

  // Coins formula: correct*2 + (score>=80 ? 20 bonus : 0)
  const coinsEarned = score * 2 + (isGreat ? 20 : 0)
  // XP: correct * 5
  const xpEarned = score * 5

  // Award coins once on mount
  useEffect(() => {
    if (!coinsAwardedRef.current) {
      coinsAwardedRef.current = true
      addCoins(coinsEarned)
      updateUser({ xp: (user?.xp || 0) + xpEarned, testsCompleted: (user?.testsCompleted || 0) + 1 })
    }
  }, [])

  // Subject breakdown
  const subjectBreakdown = {}
  questions.forEach(q => {
    const subject = q.topic_id.split('-')[0]
    if (!subjectBreakdown[subject]) subjectBreakdown[subject] = { correct: 0, total: 0 }
    subjectBreakdown[subject].total++
    if (answers[q.id] === q.correct_answer) subjectBreakdown[subject].correct++
  })

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', color: 'text-green-600' }
    if (pct >= 80) return { grade: 'A', color: 'text-green-500' }
    if (pct >= 60) return { grade: 'B', color: 'text-blue-500' }
    if (pct >= 40) return { grade: 'C', color: 'text-yellow-500' }
    return { grade: 'D', color: 'text-red-500' }
  }

  const { grade, color: gradeColor } = getGrade(percentage)

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Hero result section */}
      <div className={`py-12 px-4 text-center ${isGreat ? 'bg-gradient-to-br from-[#064E3B] to-[var(--color-primary, #1E3A5F)]' : 'bg-gradient-to-br from-[var(--color-primary, #1E3A5F)] to-[var(--color-primary-dark, #0F2140)]'}`}>
        {isGreat && (
          <div className="text-4xl mb-3 animate-bounce">🎉</div>
        )}
        <h1 className="text-2xl font-bold text-white mb-1">
          {isGreat ? 'Great job!' : 'Test Complete'}
        </h1>
        {isGreat && (
          <p className="text-green-300 text-sm mb-4">Outstanding performance! You're on the right track.</p>
        )}

        {/* Score circle */}
        <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-white/10 border-4 border-[var(--color-accent, #D4AF37)] my-6 mx-auto">
          <span className={`text-4xl font-black ${isGreat ? 'text-[var(--color-accent-light, #E8C84A)]' : 'text-white'}`}>
            {percentage}%
          </span>
          <span className={`text-lg font-bold ${gradeColor.replace('text-', 'text-')} text-white/80`}>{grade}</span>
        </div>

        <p className="text-white/80 text-sm">
          {score} correct out of {total} questions
        </p>

        {/* Coins & XP earned */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-[var(--color-accent, #D4AF37)] font-bold text-xl">+{coinsEarned}</div>
            <div className="text-white/70 text-xs">Coins Earned</div>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div className="text-green-300 font-bold text-xl">+{xpEarned}</div>
            <div className="text-white/70 text-xs">XP Gained</div>
          </div>
          {isGreat && (
            <div className="bg-yellow-500/20 rounded-xl px-4 py-2 text-center">
              <div className="text-yellow-300 font-bold text-xl">+20</div>
              <div className="text-white/70 text-xs">Bonus Coins</div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-5">

        {/* Subject Breakdown */}
        {Object.keys(subjectBreakdown).length > 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-[var(--color-primary, #1E3A5F)] mb-4">Subject Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(subjectBreakdown).map(([subject, data]) => {
                const pct = Math.round((data.correct / data.total) * 100)
                return (
                  <div key={subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium text-gray-700">{subject}</span>
                      <span className="text-gray-500">{data.correct}/{data.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Performance message */}
        <div className={`rounded-2xl p-4 border ${
          isGreat
            ? 'bg-green-50 border-green-200'
            : percentage >= 50
            ? 'bg-blue-50 border-blue-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <p className="text-sm font-medium text-gray-700">
            {isGreat
              ? '🏆 Excellent! Review the solutions to reinforce what you know.'
              : percentage >= 50
              ? '📈 Solid effort. Check the review to identify patterns in your mistakes.'
              : '💡 Keep going — every test is practice. Review the answers carefully.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/test-engine/review', { state: { questions, answers, config } })}
            className="w-full py-3.5 bg-[var(--color-primary, #1E3A5F)] text-white font-semibold rounded-2xl hover:bg-[var(--color-primary-dark, #0F2140)] transition"
          >
            📋 Review Answers
          </button>
          <button
            onClick={() => navigate('/test-engine', { state: { preset: config } })}
            className="w-full py-3.5 bg-[var(--color-accent, #D4AF37)] text-white font-semibold rounded-2xl hover:bg-[var(--color-accent-light, #E8C84A)] transition"
          >
            🔄 Retake Test
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
