import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const MODES = [
  { id: 'practice', label: 'Practice', emoji: '📖', desc: 'No timer, instant feedback' },
  { id: 'mock', label: 'Mock Test', emoji: '📝', desc: 'Timed, exam-like conditions' },
  { id: 'speed', label: 'Speed Round', emoji: '⚡', desc: 'Per-question timer, rapid fire' },
]

const COUNTS = [10, 25, 50, 'Full']

const DIFFICULTIES = [
  { id: 'adaptive', label: 'Adaptive', desc: 'Adjusts to your level' },
  { id: 'L1', label: 'L1 — Easy' },
  { id: 'L2', label: 'L2 — Moderate' },
  { id: 'L3', label: 'L3 — Standard' },
  { id: 'L4', label: 'L4 — Hard' },
  { id: 'L5', label: 'L5 — Expert' },
]

const SUBJECTS = ['All Subjects', 'Quantitative Aptitude', 'Reasoning', 'English Language', 'General Knowledge', 'Science', 'Mathematics']

export default function TestLauncher() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedExam, setSelectedExam] = useState(user?.exams?.[0]?.id || '')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [selectedMode, setSelectedMode] = useState('practice')
  const [selectedCount, setSelectedCount] = useState(10)
  const [selectedDifficulty, setSelectedDifficulty] = useState('adaptive')

  if (!user) return null

  const hasExams = user.exams && user.exams.length > 0

  const handleStart = () => {
    navigate('/test-engine/active', {
      state: {
        exam: selectedExam,
        subject: selectedSubject,
        mode: selectedMode,
        count: selectedCount,
        difficulty: selectedDifficulty,
      },
    })
  }

  return (
    <AppLayout title="Start a Test">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary, #1E3A5F)]">Configure Your Test</h1>
          <p className="text-sm text-gray-500 mt-1">Set your preferences and begin when ready.</p>
        </div>

        {/* No exams empty state */}
        {!hasExams && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-semibold text-amber-800">No exams selected yet</p>
            <p className="text-sm text-amber-700 mt-1 mb-4">Add exams to your profile to get targeted test content.</p>
            <button
              onClick={() => navigate('/exams')}
              className="bg-[var(--color-accent, #D4AF37)] text-white px-5 py-2 rounded-xl font-semibold hover:bg-[var(--color-accent-light, #E8C84A)] transition"
            >
              Browse Exams →
            </button>
          </div>
        )}

        {/* Exam Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <label className="block text-sm font-semibold text-[var(--color-primary, #1E3A5F)]">Exam</label>
          <select
            value={selectedExam}
            onChange={e => setSelectedExam(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]"
          >
            <option value="">— All Exams (Mixed) —</option>
            {hasExams
              ? user.exams.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))
              : <option value="ssc-cgl">SSC CGL (sample)</option>
            }
          </select>
        </div>

        {/* Subject Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <label className="block text-sm font-semibold text-[var(--color-primary, #1E3A5F)]">Subject</label>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition ${
                  selectedSubject === sub
                    ? 'bg-[var(--color-primary, #1E3A5F)] text-white border-[var(--color-primary, #1E3A5F)]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-primary, #1E3A5F)]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <label className="block text-sm font-semibold text-[var(--color-primary, #1E3A5F)]">Mode</label>
          <div className="grid grid-cols-3 gap-3">
            {MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedMode === mode.id
                    ? 'bg-[var(--color-primary, #1E3A5F)] text-white border-[var(--color-primary, #1E3A5F)]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--color-primary, #1E3A5F)]'
                }`}
              >
                <div className="text-xl mb-1">{mode.emoji}</div>
                <div className="font-semibold text-sm">{mode.label}</div>
                <div className={`text-xs mt-0.5 ${selectedMode === mode.id ? 'text-blue-200' : 'text-gray-400'}`}>
                  {mode.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <label className="block text-sm font-semibold text-[var(--color-primary, #1E3A5F)]">Number of Questions</label>
          <div className="flex gap-3">
            {COUNTS.map(count => (
              <button
                key={count}
                onClick={() => setSelectedCount(count)}
                className={`flex-1 py-2.5 rounded-xl border font-semibold text-sm transition ${
                  selectedCount === count
                    ? 'bg-[var(--color-accent, #D4AF37)] text-white border-[var(--color-accent, #D4AF37)]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--color-accent, #D4AF37)]'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <label className="block text-sm font-semibold text-[var(--color-primary, #1E3A5F)]">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition ${
                  selectedDifficulty === d.id
                    ? 'bg-[var(--color-primary, #1E3A5F)] text-white border-[var(--color-primary, #1E3A5F)]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-primary, #1E3A5F)]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 bg-[var(--color-accent, #D4AF37)] hover:bg-[var(--color-accent-light, #E8C84A)] text-white font-bold text-lg rounded-2xl shadow-md transition"
        >
          Start Test →
        </button>
      </div>
    </AppLayout>
  )
}
