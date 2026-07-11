import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

/**
 * Real-data preview of the question bank — pulls directly from the live
 * `questions` table (no mock/seed data) and renders each question with
 * the SAME visual structure as the real student test screen
 * (ActiveTest.jsx), so what you see here is what a student would
 * actually see IF the test-taking flow were wired to this table.
 *
 * This is intentionally a read-only preview, not the real test-taking
 * flow — it does not touch coin economy, scoring, or exam sessions.
 * It exists so problems (LaTeX not rendering, missing translations,
 * diagram display, etc.) are visible on real generated content before
 * building the full integration.
 */
export default function QuestionManager() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterTopic, setFilterTopic] = useState('all')

  useEffect(() => {
    const flag = localStorage.getItem('tryit_admin')
    if (!flag) {
      navigate('/admin/login')
      return
    }
    loadQuestions()
  }, [navigate])

  async function loadQuestions() {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (err) {
      setError(err.message)
    } else {
      setQuestions(data || [])
    }
    setLoading(false)
  }

  const topicIds = ['all', ...new Set(questions.map(q => q.topic_id))]
  const visible = filterTopic === 'all'
    ? questions
    : questions.filter(q => q.topic_id === filterTopic)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Question Bank Preview</h1>
            <p className="text-sm text-gray-500 mt-1">
              Live data straight from Supabase — {questions.length} question(s) loaded
              (most recent 100). This is a read-only preview, not the real test flow.
            </p>
          </div>
          <button
            onClick={loadQuestions}
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-[#1E3A5F] text-white hover:opacity-90"
          >
            Refresh
          </button>
        </div>

        {topicIds.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {topicIds.map(t => (
              <button
                key={t}
                onClick={() => setFilterTopic(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  filterTopic === t
                    ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {t === 'all' ? 'All topics' : t.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="text-gray-500">Loading real questions from Supabase…</p>}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            Error loading questions: {error}
          </div>
        )}
        {!loading && !error && visible.length === 0 && (
          <p className="text-gray-500">No questions found for this filter.</p>
        )}

        {visible.map(q => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>
    </div>
  )
}

function QuestionCard({ q }) {
  const options = q.options_en || []
  const correctIndex = q.correct_answer
  const hasTranslations = q.translations && Object.keys(q.translations).length > 0

  return (
    <div className="space-y-3">
      {/* Difficulty + topic — same badge style as ActiveTest.jsx */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold bg-[#1E3A5F]/10 text-[#1E3A5F] px-2 py-0.5 rounded-full">
          {q.difficulty} (L{q.level})
        </span>
        <span className="text-xs text-gray-400 capitalize">
          {(q.topic_id || '').replace(/_/g, ' ')}
        </span>
        <span className="text-xs text-gray-400">
          quality {q.quality_score}/10
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          hasTranslations ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {hasTranslations ? 'has translations' : 'EN only — no translation yet'}
        </span>
        {q.has_visual && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            visual: {q.visual_type}
          </span>
        )}
      </div>

      {/* Question card — identical structure to the real test screen */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-lg font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap">
          {q.question_en}
        </p>

        {/* Raw SVG diagram, if present — rendered exactly as stored, no
            processing, so any diagram problems are visible as-is */}
        {q.has_visual && q.visual_type === 'geometry_svg' && q.visual_data?.svg && (
          <div
            className="mt-4 flex justify-center bg-gray-50 rounded-xl p-4"
            dangerouslySetInnerHTML={{ __html: q.visual_data.svg }}
          />
        )}
        {q.has_visual && q.visual_type === 'chart_data' && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
            chart_data present (not rendered in this preview — needs the
            real charting component): {JSON.stringify(q.visual_data)}
          </div>
        )}
      </div>

      {/* Options — same layout as ActiveTest.jsx, correct one highlighted
          directly (this preview has no answer-hiding/scoring logic) */}
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div
            key={i}
            className={`w-full text-left px-5 py-3 rounded-xl border-2 font-medium ${
              i === correctIndex
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            <span className="mr-3 text-sm font-bold opacity-50">
              {['A', 'B', 'C', 'D'][i]}.
            </span>
            {opt}
            {i === correctIndex && <span className="ml-2 text-xs">✓ correct</span>}
          </div>
        ))}
      </div>

      {/* Explanation fields, shown in full so quality is easy to judge */}
      {q.explanation && (
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
          {q.explanation.why_correct && (
            <p><span className="font-semibold">Why correct: </span>{q.explanation.why_correct}</p>
          )}
          {q.explanation.story_explanation && (
            <p><span className="font-semibold">Story: </span>{q.explanation.story_explanation}</p>
          )}
          {q.explanation.shortcut_tips && (
            <p><span className="font-semibold">Shortcut: </span>{q.explanation.shortcut_tips}</p>
          )}
        </div>
      )}

      <hr className="border-gray-200 mt-4" />
    </div>
  )
}
