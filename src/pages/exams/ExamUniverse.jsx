import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

// Milestone templates per category
const getMilestones = (category) => {
  if (['medical', 'engineering', 'engineering_pg'].includes(category)) {
    return [
      { id: 1, phase: 'Foundation', icon: '🌱', color: '#064E3B', desc: 'Build core subject fundamentals', weeks: '1–4' },
      { id: 2, phase: 'Subject Mastery', icon: '📘', color: 'var(--color-primary, #1E3A5F)', desc: 'Deep-dive into syllabus topics', weeks: '5–10' },
      { id: 3, phase: 'Formula & Formula', icon: '🧪', color: '#4C1D95', desc: 'Formulas, shortcuts & problem types', weeks: '11–14' },
      { id: 4, phase: 'Mock Tests', icon: '📝', color: '#7C2D12', desc: 'Full-length practice papers', weeks: '15–18' },
      { id: 5, phase: 'Analysis & Revision', icon: '🔍', color: 'var(--color-accent, #D4AF37)', desc: 'Weak area targeting & speed drills', weeks: '19–22' },
      { id: 6, phase: 'Exam Day', icon: '🏆', color: 'var(--color-accent, #D4AF37)', desc: 'You are ready. Own it.', weeks: 'Final' },
    ]
  }
  if (['banking'].includes(category)) {
    return [
      { id: 1, phase: 'Prelims Prep', icon: '🌱', color: '#064E3B', desc: 'Quant + Reasoning + English basics', weeks: '1–3' },
      { id: 2, phase: 'Speed Building', icon: '⚡', color: 'var(--color-primary, #1E3A5F)', desc: 'Accuracy under time pressure', weeks: '4–6' },
      { id: 3, phase: 'Mains Focus', icon: '📊', color: '#4C1D95', desc: 'GA + Advanced DI + Descriptive', weeks: '7–10' },
      { id: 4, phase: 'Mock Marathon', icon: '📝', color: '#7C2D12', desc: '20+ full-length mocks with analysis', weeks: '11–14' },
      { id: 5, phase: 'Interview Prep', icon: '🎤', color: 'var(--color-accent, #D4AF37)', desc: 'GD/PI practice for final round', weeks: '15–16' },
      { id: 6, phase: 'Selection', icon: '🏆', color: 'var(--color-accent, #D4AF37)', desc: 'Your rank, your bank, your career.', weeks: 'Final' },
    ]
  }
  // Default (govt/railways/defence/teaching etc.)
  return [
    { id: 1, phase: 'Foundation', icon: '🌱', color: '#064E3B', desc: 'Syllabus mapping & study plan', weeks: '1–2' },
    { id: 2, phase: 'Core Subjects', icon: '📚', color: 'var(--color-primary, #1E3A5F)', desc: 'GK, Reasoning, Quant, English', weeks: '3–7' },
    { id: 3, phase: 'Prelims Ready', icon: '🎯', color: '#4C1D95', desc: 'Tier I practice & speed drills', weeks: '8–10' },
    { id: 4, phase: 'Mains Prep', icon: '🔬', color: '#7C2D12', desc: 'Advanced topics & full-length mocks', weeks: '11–13' },
    { id: 5, phase: 'Revision Sprint', icon: '🔁', color: 'var(--color-accent, #D4AF37)', desc: 'Revision + previous year paper analysis', weeks: '14–15' },
    { id: 6, phase: 'Exam Day', icon: '🏆', color: 'var(--color-accent, #D4AF37)', desc: 'Trust your preparation. Rank secured.', weeks: 'Final' },
  ]
}

export default function ExamUniverse() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/exams.json')
      .then(r => r.json())
      .then(data => {
        const found = (data.exams || []).find(e => e.id === examId)
        setExam(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [examId])

  // Find readiness for this exam from user profile
  const examEntry = (user?.exams || []).find(e => e.id === examId)
  const readiness = examEntry?.readiness ?? 0  // 0-100

  if (loading) {
    return (
      <AppLayout title="Exam Universe">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </AppLayout>
    )
  }

  if (!exam) {
    return (
      <AppLayout title="Exam Universe">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🌌</div>
          <h2 className="text-xl font-bold text-[var(--color-primary, #1E3A5F)] mb-2">Universe not found</h2>
          <button onClick={() => navigate('/exams')} className="px-5 py-2 bg-[var(--color-primary, #1E3A5F)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-primary-dark, #0F2140)] transition">
            Back to Exams
          </button>
        </div>
      </AppLayout>
    )
  }

  const milestones = getMilestones(exam.category)
  // Determine which milestone is active based on readiness
  const activeMilestoneIdx = Math.floor((readiness / 100) * (milestones.length - 1))

  return (
    <AppLayout title={`${exam.name} — Universe`}>
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{exam.emoji || '🌌'}</div>
          <h1 className="text-2xl font-bold text-[var(--color-primary, #1E3A5F)] mb-1">{exam.name}</h1>
          <p className="text-gray-400 text-sm">Your journey from zero to rank</p>
        </div>

        {/* Readiness */}
        <div className="bg-gradient-to-r from-[var(--color-primary, #1E3A5F)] to-[var(--color-primary-dark, #0F2140)] rounded-2xl p-5 mb-8 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-200">Overall Readiness</span>
            <span className="text-2xl font-bold text-[var(--color-accent, #D4AF37)]">{readiness}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-accent, #D4AF37)] to-[var(--color-accent-light, #E8C84A)] rounded-full transition-all duration-700"
              style={{ width: `${readiness}%` }}
            />
          </div>
          {readiness === 0 && (
            <p className="text-xs text-blue-200 mt-2">
              Take practice tests to unlock your readiness score →
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {milestones.map((m, i) => {
              const isReached = i <= activeMilestoneIdx && readiness > 0
              const isCurrent = i === activeMilestoneIdx && readiness > 0
              const isFinal = i === milestones.length - 1

              return (
                <div key={m.id} className="flex gap-5 items-start relative">
                  {/* Icon node */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 z-10 border-2 transition-all ${
                      isFinal && readiness >= 80
                        ? 'bg-[var(--color-accent, #D4AF37)] border-[var(--color-accent, #D4AF37)] shadow-lg'
                        : isReached
                        ? 'bg-[var(--color-primary, #1E3A5F)] border-[var(--color-primary, #1E3A5F)] shadow'
                        : 'bg-white border-gray-200'
                    }`}
                    style={isCurrent ? { boxShadow: `0 0 0 4px ${m.color}33` } : {}}
                  >
                    {m.icon}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-2 ${isCurrent ? 'rounded-2xl bg-blue-50 border border-blue-100 p-4 -mt-1' : ''}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-bold text-sm ${isReached ? 'text-[var(--color-primary, #1E3A5F)]' : 'text-gray-400'}`}>
                        {m.phase}
                      </h3>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Week {m.weeks}
                      </span>
                      {isCurrent && (
                        <span className="text-xs bg-[var(--color-accent, #D4AF37)] text-white px-2 py-0.5 rounded-full font-semibold animate-pulse">
                          YOU ARE HERE
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${isReached ? 'text-gray-500' : 'text-gray-300'}`}>{m.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => navigate(`/roadmap/${examId}`)}
            className="flex-1 bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold py-3 rounded-xl text-sm hover:bg-[var(--color-accent-light, #E8C84A)] transition"
          >
            📅 Full Study Plan
          </button>
          <button
            onClick={() => navigate('/test-engine', { state: { examId: exam.id, examName: exam.name } })}
            className="flex-1 bg-[var(--color-primary, #1E3A5F)] text-white font-bold py-3 rounded-xl text-sm hover:bg-[var(--color-primary-dark, #0F2140)] transition"
          >
            🚀 Practice Now
          </button>
        </div>

        <button
          onClick={() => navigate(`/exams/${examId}`)}
          className="w-full mt-3 text-center text-sm text-gray-400 hover:text-[var(--color-primary, #1E3A5F)] transition py-2"
        >
          ← Back to Exam Profile
        </button>
      </div>
    </AppLayout>
  )
}