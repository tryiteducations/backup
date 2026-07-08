// src/pages/student/StudentFoundation.jsx
// Foundation Hub: subjects -> topics -> 5-level difficulty ladder (Basic to Exam Speed).
// Links into the existing /concept/:topicId/:level (ConceptCard) + checkpoint flow.
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { SUBJECTS, LEVEL_LABELS, isLevelAuthored, getTopicAuthoredCount } from '../../lib/foundationTopics'

export default function StudentFoundation() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const isDark = theme?.isDark || false
  const primary = theme?.primary || '#2D1B69'
  const accent  = theme?.accent  || '#F59E0B'
  const text    = theme?.text    || (isDark ? '#fff' : '#0F1020')
  const muted   = theme?.textLight || (isDark ? 'rgba(255,255,255,0.7)' : '#64748B')
  const bg      = theme?.background || (isDark ? '#0D1117' : '#F5F3FF')
  const card    = theme?.surface || (isDark ? '#161B22' : '#FFFFFF')
  const border  = theme?.border || (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0')

  const [activeSubject, setActiveSubject] = useState(null) // subject id or null (grid view)
  const [progress, setProgress] = useState({}) // { 'topicId_level': 'completed' | 'reading' }
  const [loadingProgress, setLoadingProgress] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!user?.id) { setLoadingProgress(false); return }
      try {
        const { data } = await supabase
          .from('user_concept_progress')
          .select('topic_id, level, status, checkpoint_passed')
          .eq('user_id', user.id)
        if (!cancelled && data) {
          const map = {}
          data.forEach(row => {
            map[`${row.topic_id}_${row.level}`] = row.checkpoint_passed ? 'completed' : (row.status || 'reading')
          })
          setProgress(map)
        }
      } catch {
        // Silent fallback - browse still works, just without progress ticks
      } finally {
        if (!cancelled) setLoadingProgress(false)
      }
    })()
    return () => { cancelled = true }
  }, [user?.id])

  const subject = useMemo(() => SUBJECTS.find(s => s.id === activeSubject), [activeSubject])

  const totalAuthored = useMemo(
    () => SUBJECTS.reduce((sum, s) => sum + s.topics.reduce((ts, t) => ts + getTopicAuthoredCount(t), 0), 0),
    []
  )

  // ---- Level ladder for a single topic ----
  function LevelLadder({ topic }) {
    return (
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {[1, 2, 3, 4, 5].map(lvl => {
          const authored = isLevelAuthored(topic, lvl)
          const status = progress[`${topic.id}_${lvl}`]
          const completed = status === 'completed'
          return (
            <button
              key={lvl}
              disabled={!authored}
              onClick={() => authored && nav(`/concept/${topic.id}/${lvl}`)}
              title={authored ? `${LEVEL_LABELS[lvl]}` : 'Coming soon'}
              style={{
                flex: 1, height: 34, borderRadius: 8, border: `1px solid ${completed ? accent : border}`,
                background: completed ? `${accent}22` : authored ? `${primary}12` : 'transparent',
                color: authored ? (completed ? accent : text) : muted,
                fontSize: 11, fontWeight: completed ? 800 : 600,
                cursor: authored ? 'pointer' : 'not-allowed',
                opacity: authored ? 1 : 0.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                transition: 'all 0.15s',
              }}>
              {completed ? '✓' : lvl}
            </button>
          )
        })}
      </div>
    )
  }

  // ---- Subject grid (home view) ----
  if (!subject) {
    return (
      <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Poppins,sans-serif' }}>
        <div style={{ background: card, borderBottom: `1px solid ${border}`, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <button onClick={() => nav('/student')} style={{ background: 'transparent', border: `1px solid ${accent}55`,
            borderRadius: 10, padding: '6px 14px', color: muted, fontSize: 13, cursor: 'pointer' }}>← Back</button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: text, fontSize: 18, fontWeight: 800, margin: 0 }}>🎯 Foundation</h1>
            <p style={{ color: muted, fontSize: 11, margin: 0 }}>Basics to exam-speed, one topic at a time - {totalAuthored} levels ready now, more added weekly</p>
          </div>
        </div>

        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
          {SUBJECTS.map(s => {
            const authoredCount = s.topics.reduce((sum, t) => sum + getTopicAuthoredCount(t), 0)
            return (
              <button key={s.id} onClick={() => setActiveSubject(s.id)}
                style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 18,
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.boxShadow = `0 4px 20px ${s.color}25` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 10 }}>
                  {s.emoji}
                </div>
                <p style={{ color: text, fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>{s.label}</p>
                <p style={{ color: muted, fontSize: 11, margin: 0 }}>{s.topics.length} topics · {authoredCount > 0 ? `${authoredCount} levels ready` : 'coming soon'}</p>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ---- Topic list for the selected subject ----
  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Poppins,sans-serif' }}>
      <div style={{ background: card, borderBottom: `1px solid ${border}`, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => setActiveSubject(null)} style={{ background: 'transparent', border: `1px solid ${accent}55`,
          borderRadius: 10, padding: '6px 14px', color: muted, fontSize: 13, cursor: 'pointer' }}>← Subjects</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: text, fontSize: 18, fontWeight: 800, margin: 0 }}>{subject.emoji} {subject.label}</h1>
          <p style={{ color: muted, fontSize: 11, margin: 0 }}>Tap a level to start - each has worked examples, a mnemonic, shortcuts, and a 3-question checkpoint</p>
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {subject.topics.map(topic => {
          const authoredCount = getTopicAuthoredCount(topic)
          return (
            <div key={topic.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: text, fontWeight: 700, fontSize: 14, margin: 0 }}>{topic.label}</p>
                {authoredCount === 0 && (
                  <span style={{ fontSize: 10, color: muted, background: `${muted}18`, padding: '2px 8px', borderRadius: 20 }}>Coming soon</span>
                )}
                {authoredCount > 0 && authoredCount < 5 && (
                  <span style={{ fontSize: 10, color: accent, background: `${accent}18`, padding: '2px 8px', borderRadius: 20 }}>{authoredCount}/5 levels</span>
                )}
              </div>
              <LevelLadder topic={topic} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
