// src/pages/student/StudentFoundation.jsx
// Foundation Hub: subjects -> topics -> 5-level difficulty ladder (Basic to Exam Speed).
// Filters the ladder to a student's own class by default (a Class 6 student sees only
// Level 1-2), with an optional toggle to preview the full roadmap. Links into the
// existing /concept/:topicId/:level (ConceptCard) + checkpoint flow.
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { updateProfile } from '../../lib/studentLib'
import {
  SUBJECTS, LEVEL_LABELS, CLASS_OPTIONS,
  isLevelAuthored, isLevelApplicable, getTopicAuthoredCount, getMaxLevelForClass,
} from '../../lib/foundationTopics'

const CLASS_STORAGE_KEY = 'tryit_foundation_class'

export default function StudentFoundation() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user, isTopicUnlocked, planTier } = useAuth()
  const isDark = theme?.isDark || false
  const primary = theme?.primary || '#2D1B69'
  const accent  = theme?.accent  || '#F59E0B'
  const text    = theme?.text    || (isDark ? '#fff' : '#0F1020')
  const muted   = theme?.textLight || (isDark ? 'rgba(255,255,255,0.7)' : '#64748B')
  const bg      = theme?.background || (isDark ? '#0D1117' : '#F5F3FF')
  const card    = theme?.surface || (isDark ? '#161B22' : '#FFFFFF')
  const border  = theme?.border || (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0')

  const [activeSubject, setActiveSubject] = useState(null)
  const [progress, setProgress] = useState({})
  const [studentClass, setStudentClass] = useState(() => localStorage.getItem(CLASS_STORAGE_KEY) || null)
  const [showClassPicker, setShowClassPicker] = useState(!localStorage.getItem(CLASS_STORAGE_KEY))
  const [showAllLevels, setShowAllLevels] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!user?.id) return
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
      } catch { /* Silent fallback - browse still works without progress ticks */ }
    })()
    return () => { cancelled = true }
  }, [user?.id])

  const maxLevel = showAllLevels ? 5 : getMaxLevelForClass(studentClass)
  const classLabel = CLASS_OPTIONS.find(c => c.id === studentClass)?.label

  function selectClass(classId) {
    localStorage.setItem(CLASS_STORAGE_KEY, classId)
    setStudentClass(classId)
    setShowClassPicker(false)
    if (user?.id) {
      updateProfile(user.id, { foundation_class: classId }).catch(() => {
        // Best-effort only - if the profiles table doesn't have this column yet,
        // localStorage still keeps the feature working for this device/session.
      })
    }
  }

  const subject = useMemo(() => SUBJECTS.find(s => s.id === activeSubject), [activeSubject])

  const totalAuthored = useMemo(
    () => SUBJECTS.reduce((sum, s) => sum + s.topics.reduce((ts, t) => ts + getTopicAuthoredCount(t), 0), 0),
    []
  )

  // ---- Class picker (first visit, or "Change class") ----
  function ClassPicker() {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: card, borderRadius: 20, padding: 24, maxWidth: 420, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
          <p style={{ color: text, fontWeight: 800, fontSize: 17, margin: '0 0 4px' }}>Which class are you in?</p>
          <p style={{ color: muted, fontSize: 12, margin: '0 0 16px' }}>We'll show only the topics and difficulty that matter for you right now - nothing confusing from higher classes.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CLASS_OPTIONS.map(c => (
              <button key={c.id} onClick={() => selectClass(c.id)}
                style={{ background: `${primary}10`, border: `1px solid ${border}`, borderRadius: 12,
                  padding: '12px 10px', color: text, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border }}>
                {c.label}
              </button>
            ))}
          </div>
          {studentClass && (
            <button onClick={() => setShowClassPicker(false)} style={{ marginTop: 14, background: 'transparent',
              border: 'none', color: muted, fontSize: 12, cursor: 'pointer', width: '100%', textAlign: 'center' }}>
              Cancel
            </button>
          )}
        </div>
      </div>
    )
  }

  // ---- Relevance tags: why this topic matters, across boards and exams ----
  function RelevanceTags({ topic }) {
    if (!topic.relevance) return null
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
        {topic.relevance.boards?.slice(0, 3).map(b => (
          <span key={b} style={{ fontSize: 9, color: primary, background: `${primary}14`, padding: '2px 7px', borderRadius: 20 }}>📚 {b}</span>
        ))}
        {topic.relevance.exams?.slice(0, 3).map(e => (
          <span key={e} style={{ fontSize: 9, color: accent, background: `${accent}18`, padding: '2px 7px', borderRadius: 20 }}>🏆 {e}</span>
        ))}
        {(topic.relevance.boards?.length > 3 || topic.relevance.exams?.length > 3) && (
          <span style={{ fontSize: 9, color: muted }}>+more</span>
        )}
      </div>
    )
  }

  // ---- Level ladder for a single topic, capped to the student's class ----
  function LevelLadder({ topic }) {
    return (
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {[1, 2, 3, 4, 5].map(lvl => {
          const withinClassCap = lvl <= maxLevel
          const applicable = isLevelApplicable(topic, lvl)
          const authored = applicable && isLevelAuthored(topic, lvl)
          const visible = withinClassCap || showAllLevels
          const status = progress[`${topic.id}_${lvl}`]
          const completed = status === 'completed'
          if (!visible) {
            return (
              <div key={lvl} style={{ flex: 1, height: 34, borderRadius: 8, border: `1px dashed ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: `${muted}66` }}>
                🔒
              </div>
            )
          }
          return (
            <button
              key={lvl}
              disabled={!authored}
              onClick={() => authored && nav(`/concept/${topic.id}/${lvl}`)}
              title={!applicable ? 'Not part of this topic\'s curriculum' : authored ? LEVEL_LABELS[lvl] : 'Coming soon'}
              style={{
                flex: 1, height: 34, borderRadius: 8,
                border: `1px solid ${completed ? accent : applicable ? border : 'transparent'}`,
                background: completed ? `${accent}22` : authored ? `${primary}12` : 'transparent',
                color: !applicable ? `${muted}55` : authored ? (completed ? accent : text) : muted,
                fontSize: 11, fontWeight: completed ? 800 : 600,
                cursor: authored ? 'pointer' : 'not-allowed',
                opacity: applicable ? (authored ? 1 : 0.5) : 0.3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                transition: 'all 0.15s',
              }}>
              {!applicable ? '—' : completed ? '✓' : lvl}
            </button>
          )
        })}
      </div>
    )
  }

  const HeaderClassBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
      background: `${primary}0a`, borderBottom: `1px solid ${border}`, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 11, color: muted }}>
        Showing: <strong style={{ color: text }}>{classLabel || 'All levels'}</strong>
      </span>
      <button onClick={() => setShowClassPicker(true)} style={{ background: 'transparent', border: `1px solid ${border}`,
        borderRadius: 20, padding: '3px 10px', color: primary, fontSize: 10, cursor: 'pointer' }}>
        Change class
      </button>
      <label style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto', fontSize: 10, color: muted, cursor: 'pointer' }}>
        <input type="checkbox" checked={showAllLevels} onChange={e => setShowAllLevels(e.target.checked)} />
        Preview all levels (for parents)
      </label>
    </div>
  )

  // ---- Subject grid (home view) ----
  if (!subject) {
    return (
      <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Poppins,sans-serif' }}>
        {showClassPicker && <ClassPicker />}
        <div style={{ background: card, borderBottom: `1px solid ${border}`, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <button onClick={() => nav('/student')} style={{ background: 'transparent', border: `1px solid ${accent}55`,
            borderRadius: 10, padding: '6px 14px', color: muted, fontSize: 13, cursor: 'pointer' }}>← Back</button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: text, fontSize: 18, fontWeight: 800, margin: 0 }}>🎯 Foundation</h1>
            <p style={{ color: muted, fontSize: 11, margin: 0 }}>Basics to exam-speed, one topic at a time - {totalAuthored} levels ready now, more added weekly</p>
          </div>
        </div>
        <HeaderClassBar />

        {planTier !== 'pro' && planTier !== 'ultra' && (
          <div style={{ margin: '14px 20px 0', background: 'linear-gradient(135deg,#166534,#15803D)',
            borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 24 }}>💎</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 13, margin: 0 }}>Upgrade to Pro or Ultra</p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, margin: '2px 0 0' }}>Get every Foundation topic free for a full year - no ₹5-per-topic payments, ever.</p>
            </div>
            <button onClick={() => nav('/pricing')} style={{ background: '#fff', color: '#166534', border: 'none',
              borderRadius: 10, padding: '9px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              See Plans →
            </button>
          </div>
        )}

        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
          {SUBJECTS.map(s => {
            const authoredCount = s.topics.reduce((sum, t) => sum + getTopicAuthoredCount(t), 0)
            const relevantTopicCount = s.topics.filter(t => (t.startLevel ?? 1) <= maxLevel).length
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
                <p style={{ color: muted, fontSize: 11, margin: 0 }}>
                  {relevantTopicCount} of {s.topics.length} topics for you · {authoredCount > 0 ? `${authoredCount} levels ready` : 'coming soon'}
                </p>
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
      {showClassPicker && <ClassPicker />}
      <div style={{ background: card, borderBottom: `1px solid ${border}`, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => setActiveSubject(null)} style={{ background: 'transparent', border: `1px solid ${accent}55`,
          borderRadius: 10, padding: '6px 14px', color: muted, fontSize: 13, cursor: 'pointer' }}>← Subjects</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: text, fontSize: 18, fontWeight: 800, margin: 0 }}>{subject.emoji} {subject.label}</h1>
          <p style={{ color: muted, fontSize: 11, margin: 0 }}>Tap a level to start - each has worked examples, a mnemonic, shortcuts, and a 3-question checkpoint</p>
        </div>
      </div>
      <HeaderClassBar />

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {subject.topics
          .filter(topic => showAllLevels || (topic.startLevel ?? 1) <= maxLevel)
          .map(topic => {
            const authoredCount = getTopicAuthoredCount(topic)
            return (
              <div key={topic.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: text, fontWeight: 700, fontSize: 14, margin: 0 }}>{topic.label}</p>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {authoredCount === 0 && (
                      <span style={{ fontSize: 10, color: muted, background: `${muted}18`, padding: '2px 8px', borderRadius: 20 }}>Coming soon</span>
                    )}
                    {authoredCount > 0 && authoredCount < 5 && (
                      <span style={{ fontSize: 10, color: accent, background: `${accent}18`, padding: '2px 8px', borderRadius: 20 }}>{authoredCount}/5 levels</span>
                    )}
                    {authoredCount > 0 && (planTier === 'pro' || planTier === 'ultra') && (
                      <span style={{ fontSize: 10, color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: 20 }}>💎 Free with your plan</span>
                    )}
                    {authoredCount > 0 && planTier !== 'pro' && planTier !== 'ultra' && isTopicUnlocked(topic.id) && (
                      <span style={{ fontSize: 10, color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: 20 }}>✓ Unlocked</span>
                    )}
                    {authoredCount > 0 && planTier !== 'pro' && planTier !== 'ultra' && !isTopicUnlocked(topic.id) && (
                      <span style={{ fontSize: 10, color: '#92400E', background: '#FFF7E6', padding: '2px 8px', borderRadius: 20 }}>🔒 ₹5 to unlock</span>
                    )}
                  </div>
                </div>
                <RelevanceTags topic={topic} />
                <LevelLadder topic={topic} />
              </div>
            )
          })}
        {subject.topics.filter(topic => (topic.startLevel ?? 1) <= maxLevel).length === 0 && !showAllLevels && (
          <p style={{ color: muted, fontSize: 13, textAlign: 'center', padding: 30 }}>
            No {subject.label} topics for {classLabel} yet - check "Preview all levels" above to see what's coming.
          </p>
        )}
      </div>
    </div>
  )
}
