// src/components/AnswerReactionBar.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ANSWER_REACTIONS, recordReaction } from '../lib/mentorReactions'
import { useAuth } from '../context/AuthContext'

const springTap = { type: 'spring', stiffness: 420, damping: 26 }

/**
 * Place this directly under a mentor's answer wherever students read
 * it (GuruHub thread view, doubt detail page, etc). Any student
 * viewing the answer can tap a reaction — this is the actual
 * reacting surface; MentorHub only shows the resulting daily pin.
 *
 * answer: { id, mentorId, mentorName, subject, text }
 */
export default function AnswerReactionBar({ answer }) {
  const { user } = useAuth()
  const [selected, setSelected] = useState(null)
  const [justPicked, setJustPicked] = useState(false)

  useEffect(() => {
    // Reflect this student's existing reaction if they already reacted
    // earlier today — keeps the bar idempotent across reloads.
    try {
      const all = JSON.parse(localStorage.getItem('tryit_answer_reactions') || '{}')
      const day = new Date().toISOString().slice(0, 10)
      const existing = all[day]?.[answer.id]?.byStudent?.[user?.id]
      if (existing) setSelected(existing)
    } catch {}
  }, [answer.id, user?.id])

  const handlePick = (emoji) => {
    if (!user?.id) return
    const next = selected === emoji ? null : emoji
    setSelected(next)
    if (next) {
      recordReaction(answer, next, user.id)
      setJustPicked(true)
      setTimeout(() => setJustPicked(false), 500)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
      {ANSWER_REACTIONS.map(r => {
        const active = selected === r.emoji
        return (
          <motion.button
            key={r.emoji}
            whileTap={{ scale: 0.88 }}
            animate={active && justPicked ? { scale: [1, 1.3, 1] } : {}}
            transition={springTap}
            onClick={() => handlePick(r.emoji)}
            title={r.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 12, fontSize: 13,
              border: active ? '1.5px solid var(--color-accent, #D4AF37)' : '1px solid var(--color-border, #E2E8F0)',
              background: active ? 'rgba(212,175,55,0.14)' : 'var(--color-surface, #FFFFFF)',
              cursor: 'pointer',
            }}
          >
            <span>{r.emoji}</span>
          </motion.button>
        )
      })}
    </div>
  )
}