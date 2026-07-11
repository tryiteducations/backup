// FILE: src/pages/Showcase.jsx
// Public, no-login showcase of real generated questions — built to
// demonstrate the "Class 1 to PhD" difficulty spiral and the 7-layer
// explanation depth to friends, strangers, investors, whoever, without
// showing raw Supabase tables. Pulls real data, read-only.
//
// Route: /showcase

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { renderMathText } from '../lib/mathText'

const LEVEL_LABELS = {
  1: 'LKG-UKG', 2: 'Class 1-4', 3: 'Class 5-7', 4: 'Class 8-10',
  5: 'Class 11-12', 6: 'Graduate Foundation', 7: 'SSC / Banking / Railways',
  8: 'GATE / CAT / CLAT / NEET', 9: 'UPSC Prelims / PG Entrance',
  10: 'UPSC Mains / PhD / Research',
}

const EXPLANATION_LAYERS = [
  { key: 'why_correct', label: '1. Why This Is Correct' },
  { key: 'why_wrong_option_b', label: '2. Why Option B Is Wrong' },
  { key: 'why_wrong_option_c', label: '3. Why Option C Is Wrong' },
  { key: 'why_wrong_option_d', label: '4. Why Option D Is Wrong' },
  { key: 'story_explanation', label: '5. Story Explanation' },
  { key: 'shortcut_tips', label: '6. Shortcut / Exam Tip' },
  { key: 'cross_exam_intelligence', label: '7. Cross-Exam Intelligence' },
]

export default function Showcase() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [topic, setTopic] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setFetchError(null)
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('level', { ascending: true })
      .limit(200)
    if (error) {
      setFetchError(error.message)
      setLoading(false)
      return
    }
    const list = data || []
    setQuestions(list)
    if (list.length) {
      const firstTopic = list[0].topic_id
      setTopic(firstTopic)
      const firstOfTopic = list.find(q => q.topic_id === firstTopic)
      setSelectedId(firstOfTopic?.id || null)
    }
    setLoading(false)
  }

  const topics = [...new Set(questions.map(q => q.topic_id))]
  const questionsForTopic = questions.filter(q => q.topic_id === topic)
  const levelsAvailable = [...new Set(questionsForTopic.map(q => q.level))].sort((a, b) => a - b)
  const selected = questions.find(q => q.id === selectedId)

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F1F5F9', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 32, marginBottom: 8 }}>
            <span style={{ color: '#1E3A5F' }}>Try</span><span style={{ color: '#D4AF37' }}>IT</span>
          </div>
          <p style={{ color: '#94A3B8', fontSize: 15, maxWidth: 560, margin: '0 auto' }}>
            One topic. Ten depths, from LKG picture-questions to PhD-entrance research level.
            Every question comes with a 7-layer explanation — not just the answer,
            the reasoning, the wrong turns, the story, and the exam-specific edge.
          </p>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#64748B' }}>Loading real questions…</p>}

        {fetchError && (
          <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', borderRadius: 12, padding: 20, color: '#FCA5A5', maxWidth: 600, margin: '0 auto' }}>
            <p style={{ fontWeight: 700, marginBottom: 6 }}>Could not load questions</p>
            <p style={{ fontSize: 13, fontFamily: 'monospace' }}>{fetchError}</p>
          </div>
        )}

        {!loading && !fetchError && topics.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748B' }}>No questions generated yet.</p>
        )}

        {!loading && topics.length > 0 && (
          <>
            {/* Topic selector */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              {topics.map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setTopic(t)
                    const first = questions.find(q => q.topic_id === t)
                    setSelectedId(first?.id || null)
                  }}
                  style={{
                    padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                    border: topic === t ? '1.5px solid #D4AF37' : '1.5px solid #334155',
                    background: topic === t ? 'rgba(212,175,55,0.15)' : 'transparent',
                    color: topic === t ? '#D4AF37' : '#94A3B8', cursor: 'pointer',
                  }}
                >
                  {t.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* Level ladder */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
              {[1,2,3,4,5,6,7,8,9,10].map(lvl => {
                const has = levelsAvailable.includes(lvl)
                const q = questionsForTopic.find(q => q.level === lvl)
                return (
                  <button
                    key={lvl}
                    disabled={!has}
                    onClick={() => q && setSelectedId(q.id)}
                    title={LEVEL_LABELS[lvl]}
                    style={{
                      width: 44, height: 44, borderRadius: 10, fontSize: 13, fontWeight: 700,
                      border: selected?.level === lvl ? '2px solid #D4AF37' : '1px solid #334155',
                      background: !has ? '#1E293B' : selected?.level === lvl ? '#D4AF37' : '#1E3A5F',
                      color: !has ? '#475569' : selected?.level === lvl ? '#0F172A' : '#F1F5F9',
                      cursor: has ? 'pointer' : 'not-allowed',
                    }}
                  >
                    L{lvl}
                  </button>
                )
              })}
            </div>

            {selected && (
              <div style={{ background: '#1E293B', borderRadius: 20, padding: 28, border: '1px solid #334155' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, background: 'rgba(212,175,55,0.15)', color: '#D4AF37', padding: '4px 10px', borderRadius: 999 }}>
                    Level {selected.level} — {LEVEL_LABELS[selected.level]}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748B' }}>{selected.difficulty}</span>
                </div>

                <p style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.6, marginBottom: 20 }}>
                  {renderMathText(selected.question_en)}
                </p>

                {selected.has_visual && selected.visual_type === 'geometry_svg' && selected.visual_data?.svg && (
                  <div
                    className="question-diagram"
                    style={{ background: '#0F172A', borderRadius: 12, padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'center' }}
                    dangerouslySetInnerHTML={{ __html: selected.visual_data.svg }}
                  />
                )}

                <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
                  {(selected.options_en || []).map((opt, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 16px', borderRadius: 12, fontWeight: 500,
                        border: i === selected.correct_answer ? '2px solid #22C55E' : '1px solid #334155',
                        background: i === selected.correct_answer ? 'rgba(34,197,94,0.1)' : 'transparent',
                        color: i === selected.correct_answer ? '#4ADE80' : '#E2E8F0',
                      }}
                    >
                      <span style={{ opacity: 0.5, marginRight: 10, fontWeight: 700 }}>{['A','B','C','D'][i]}.</span>
                      {renderMathText(opt)}
                      {i === selected.correct_answer && <span style={{ marginLeft: 8, fontSize: 12 }}>✓ correct</span>}
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #334155', paddingTop: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                    The 7-Layer Explanation
                  </p>
                  <div style={{ display: 'grid', gap: 14 }}>
                    {EXPLANATION_LAYERS.map(({ key, label }) => {
                      const value = selected.explanation?.[key]
                      if (!value) return null
                      return (
                        <div key={key}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#D4AF37', marginBottom: 3 }}>{label}</p>
                          <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6 }}>{renderMathText(value)}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}