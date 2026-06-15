import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const FACTOR_LABELS = {
  concept: '📘 Concept',
  formula: '📐 Formula / Rule',
  common_mistake: '⚠️ Common Mistake',
  shortcut: '⚡ Shortcut',
  exam_relevance: '🎯 Exam Relevance',
}

export default function ReviewScreen() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState({}) // { qId_factor: bool }

  if (!state) {
    navigate('/test-engine')
    return null
  }

  const { questions, answers } = state

  const toggleFactor = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

  const correct = questions.filter(q => answers[q.id] === q.correct_answer).length
  const total = questions.length

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div className="bg-[var(--color-primary, #1E3A5F)] px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-white font-bold text-lg">Answer Review</h1>
          <p className="text-white/60 text-xs">{correct}/{total} correct</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-white/80 border border-white/30 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            ← Result
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-white/80 border border-white/30 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {questions.map((q, idx) => {
          const userAnswer = answers[q.id]
          const isCorrect = userAnswer === q.correct_answer
          const wasAttempted = !!userAnswer

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${
                !wasAttempted ? 'border-gray-200' : isCorrect ? 'border-green-200' : 'border-red-200'
              }`}
            >
              {/* Question header */}
              <div className={`px-5 py-3 flex items-center gap-3 ${
                !wasAttempted ? 'bg-gray-50' : isCorrect ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <span className={`text-xl ${
                  !wasAttempted ? '⬜' : isCorrect ? '✅' : '❌'
                }`}>
                  {!wasAttempted ? '⬜' : isCorrect ? '✅' : '❌'}
                </span>
                <span className="text-sm font-bold text-gray-600">Q{idx + 1}</span>
                <span className="ml-auto text-xs font-semibold bg-white/60 px-2 py-0.5 rounded-full text-gray-500">
                  {q.difficulty}
                </span>
              </div>

              <div className="px-5 py-4 space-y-4">

                {/* Question text */}
                <p className="text-gray-800 font-medium leading-relaxed">{q.question}</p>

                {/* Options */}
                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    const isUserChoice = opt === userAnswer
                    const isRightAnswer = opt === q.correct_answer

                    let style = 'border-gray-100 bg-gray-50 text-gray-500'
                    if (isRightAnswer) style = 'border-green-400 bg-green-50 text-green-800 font-semibold'
                    if (isUserChoice && !isRightAnswer) style = 'border-red-400 bg-red-50 text-red-700 line-through'

                    return (
                      <div
                        key={opt}
                        className={`px-4 py-2.5 rounded-xl border-2 flex items-center gap-2 text-sm ${style}`}
                      >
                        <span className="opacity-50 font-bold">{['A','B','C','D'][i]}.</span>
                        <span>{opt}</span>
                        {isRightAnswer && <span className="ml-auto text-green-600 text-xs font-bold">✓ Correct</span>}
                        {isUserChoice && !isRightAnswer && <span className="ml-auto text-red-500 text-xs">Your answer</span>}
                      </div>
                    )
                  })}
                </div>

                {/* Unattempted note */}
                {!wasAttempted && (
                  <div className="text-xs text-gray-400 italic">Not attempted — correct answer: <span className="font-semibold text-gray-600">{q.correct_answer}</span></div>
                )}

                {/* Explanation */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-900">
                  <span className="font-semibold">Explanation: </span>{q.explanation}
                </div>

                {/* Expandable factors */}
                <div className="space-y-2">
                  {Object.entries(q.explanation_factors).map(([key, value]) => {
                    const expandKey = `${q.id}_${key}`
                    const isOpen = expanded[expandKey]
                    return (
                      <div key={key} className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleFactor(expandKey)}
                          className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition text-sm"
                        >
                          <span className="font-medium text-gray-700">{FACTOR_LABELS[key]}</span>
                          <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                        </button>
                        {isOpen && (
                          <div className="px-4 py-3 text-sm text-gray-700 bg-white">
                            {value}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {/* Bottom navigation */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition"
          >
            ← Back to Result
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 bg-[var(--color-primary, #1E3A5F)] text-white font-semibold rounded-2xl hover:bg-[var(--color-primary-dark, #0F2140)] transition"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
