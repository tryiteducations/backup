// FILE: src/pages/test-engine/ResultScreen.jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

// Lightweight CSS-only confetti — no extra dependency, GPU-friendly
// (transform + opacity only) so it stays smooth on low-end Android.
function Confetti({ active }) {
  const pieces = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.8 + Math.random() * 1.2,
      rotateDir: Math.random() > 0.5 ? 1 : -1,
      color: ['#D4AF37', '#E8C84A', '#22C55E', '#0EA5E9', '#FFFFFF'][i % 5],
      size: 6 + Math.random() * 6,
    }))
  ).current

  if (!active) return null

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {pieces.map(p => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            borderRadius: 2,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotateDir * 90}deg)`,
          }}
        />
      ))}
    </div>
  )
}

const springPop = { type: 'spring', stiffness: 260, damping: 20 }

export default function ResultScreen() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { addCoins, updateUser, user } = useAuth()
  const coinsAwardedRef = useRef(false)
  const [revealStage, setRevealStage] = useState(0) // 0=nothing, 1=score, 2=coins, 3=done
  const [showConfetti, setShowConfetti] = useState(false)

  if (!state) {
    navigate('/test-engine')
    return null
  }

  const { questions, answers, score, config } = state

  const total = questions.length
  const percentage = Math.round((score / total) * 100)
  const isGreat = percentage >= 80

  const coinsEarned = score * 2 + (isGreat ? 20 : 0)
  const xpEarned = score * 5

  useEffect(() => {
    if (!coinsAwardedRef.current) {
      coinsAwardedRef.current = true
      addCoins(coinsEarned)
      updateUser({ xp: (user?.xp || 0) + xpEarned, testsCompleted: (user?.testsCompleted || 0) + 1 })
    }
    // Staged reveal: score lands first, then coins/XP, then confetti for
    // a strong result. This is the "reward moment" — concentrated here,
    // not smeared across every button in the app.
    const t1 = setTimeout(() => setRevealStage(1), 150)
    const t2 = setTimeout(() => setRevealStage(2), 650)
    const t3 = setTimeout(() => {
      setRevealStage(3)
      if (isGreat) setShowConfetti(true)
    }, 1050)
    const t4 = setTimeout(() => setShowConfetti(false), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const subjectBreakdown = {}
  questions.forEach(q => {
    const subject = q.topic_id.split('-')[0]
    if (!subjectBreakdown[subject]) subjectBreakdown[subject] = { correct: 0, total: 0 }
    subjectBreakdown[subject].total++
    if (answers[q.id] === q.correct_answer) subjectBreakdown[subject].correct++
  })

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', color: 'var(--color-success, #22C55E)' }
    if (pct >= 80) return { grade: 'A', color: 'var(--color-success, #22C55E)' }
    if (pct >= 60) return { grade: 'B', color: 'var(--color-accent, #D4AF37)' }
    if (pct >= 40) return { grade: 'C', color: 'var(--color-warning, #F59E0B)' }
    return { grade: 'D', color: 'var(--color-error, #EF4444)' }
  }

  const { grade, color: gradeColor } = getGrade(percentage)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg, #F8FAFC)', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero result section */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        padding: '48px 16px', textAlign: 'center',
        background: isGreat
          ? 'linear-gradient(135deg, #064E3B, var(--color-primary, #1E3A5F))'
          : 'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
      }}>
        <Confetti active={showConfetti} />

        <AnimatePresence>
          {isGreat && revealStage >= 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={springPop}
              style={{ fontSize: 40, marginBottom: 8 }}
            >
              🎉
            </motion.div>
          )}
        </AnimatePresence>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={revealStage >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-on-dark, #FFFFFF)', marginBottom: 4, fontFamily: 'Poppins, sans-serif' }}
        >
          {isGreat ? 'Great job!' : 'Test Complete'}
        </motion.h1>

        {isGreat && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={revealStage >= 1 ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ color: '#86EFAC', fontSize: 14, marginBottom: 16 }}
          >
            Outstanding performance! You're on the right track.
          </motion.p>
        )}

        {/* Score circle */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={revealStage >= 1 ? { scale: 1, opacity: 1 } : {}}
          transition={springPop}
          style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: 144, height: 144, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '4px solid var(--color-accent, #D4AF37)',
            margin: '24px auto', position: 'relative',
          }}
        >
          <span style={{
            fontSize: 36, fontWeight: 900,
            color: isGreat ? 'var(--color-accent-light, #E8C84A)' : 'var(--color-on-dark, #FFFFFF)',
          }}>
            {percentage}%
          </span>
          <span style={{ fontSize: 18, fontWeight: 700, color: gradeColor }}>{grade}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={revealStage >= 1 ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ color: 'var(--color-on-dark-muted, rgba(255,255,255,0.8))', fontSize: 14 }}
        >
          {score} correct out of {total} questions
        </motion.p>

        {/* Coins & XP earned */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={revealStage >= 2 ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={springPop}
            style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 18px', textAlign: 'center' }}
          >
            <div style={{ color: 'var(--color-accent, #D4AF37)', fontWeight: 800, fontSize: 20 }}>+{coinsEarned}</div>
            <div style={{ color: 'var(--color-on-dark-muted, rgba(255,255,255,0.7))', fontSize: 11 }}>Coins Earned</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={revealStage >= 2 ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ ...springPop, delay: 0.08 }}
            style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 18px', textAlign: 'center' }}
          >
            <div style={{ color: '#86EFAC', fontWeight: 800, fontSize: 20 }}>+{xpEarned}</div>
            <div style={{ color: 'var(--color-on-dark-muted, rgba(255,255,255,0.7))', fontSize: 11 }}>XP Gained</div>
          </motion.div>
          {isGreat && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.8 }}
              animate={revealStage >= 2 ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ ...springPop, delay: 0.16 }}
              style={{ background: 'rgba(245,158,11,0.18)', borderRadius: 14, padding: '10px 18px', textAlign: 'center' }}
            >
              <div style={{ color: '#FCD34D', fontWeight: 800, fontSize: 20 }}>+20</div>
              <div style={{ color: 'var(--color-on-dark-muted, rgba(255,255,255,0.7))', fontSize: 11 }}>Bonus Coins</div>
            </motion.div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Subject Breakdown */}
        {Object.keys(subjectBreakdown).length > 1 && (
          <div style={{ background: 'var(--color-surface, #FFFFFF)', borderRadius: 20, boxShadow: '0 4px 16px rgba(15,23,42,0.06)', border: '1px solid var(--color-border, #F1F5F9)', padding: 20 }}>
            <h2 style={{ fontWeight: 800, color: 'var(--heading-color, var(--color-text, #1E3A5F))', marginBottom: 16, fontFamily: 'Poppins, sans-serif' }}>
              Subject Breakdown
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(subjectBreakdown).map(([subject, data]) => {
                const pct = Math.round((data.correct / data.total) * 100)
                const barColor = pct >= 70 ? 'var(--color-success, #22C55E)' : pct >= 40 ? 'var(--color-warning, #F59E0B)' : 'var(--color-error, #EF4444)'
                return (
                  <div key={subject}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--color-text, #1E293B)' }}>{subject}</span>
                      <span style={{ color: 'var(--subtext-color, #64748B)' }}>{data.correct}/{data.total}</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--color-bg, #F1F5F9)', borderRadius: 8, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={revealStage >= 3 ? { width: `${pct}%` } : {}}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: '100%', borderRadius: 8, background: barColor }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Performance message */}
        <div style={{
          borderRadius: 16, padding: 16,
          background: isGreat ? 'rgba(34,197,94,0.1)' : percentage >= 50 ? 'rgba(14,165,233,0.1)' : 'rgba(245,158,11,0.1)',
          border: `1px solid ${isGreat ? 'rgba(34,197,94,0.22)' : percentage >= 50 ? 'rgba(14,165,233,0.22)' : 'rgba(245,158,11,0.22)'}`,
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E293B)' }}>
            {isGreat
              ? '🏆 Excellent! Review the solutions to reinforce what you know.'
              : percentage >= 50
              ? '📈 Solid effort. Check the review to identify patterns in your mistakes.'
              : '💡 Keep going — every test is practice. Review the answers carefully.'}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/test-engine/review', { state: { questions, answers, config } })}
            className="btn-navy"
            style={{ width: '100%', padding: '14px', fontWeight: 700, borderRadius: 16, fontSize: 15 }}
          >
            📋 Review Answers
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/test-engine', { state: { preset: config } })}
            className="btn-gold"
            style={{ width: '100%', padding: '14px', fontWeight: 700, borderRadius: 16, fontSize: 15 }}
          >
            🔄 Retake Test
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%', padding: '14px', fontWeight: 700, borderRadius: 16, fontSize: 15,
              background: 'transparent', border: '1px solid var(--color-border, #E2E8F0)',
              color: 'var(--color-text, #1E293B)',
            }}
          >
            🏠 Back to Dashboard
          </motion.button>
        </div>
      </div>
    </div>
  )
}