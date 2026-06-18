// FILE: src/pages/mentor/MentorHub.jsx — home page for role==='mentor'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppLayout from '../../components/layout/AppLayout'
import ProtectedAvatar from '../../components/ProtectedAvatar'
import { useAuth } from '../../context/AuthContext'
import { getPinnedAnswer, isMentorPinnedToday } from '../../lib/mentorReactions'

const SAMPLE_DOUBTS = [
  { id: 1, subject: 'Mathematics', question: 'How do I solve quadratic inequalities on a number line?', time: '12 min ago', coins: 5 },
  { id: 2, subject: 'History',     question: 'What were the main causes of the 1857 revolt?',            time: '34 min ago', coins: 5 },
  { id: 3, subject: 'Physics',     question: 'Explain Bernoulli\'s principle with a real-life example.',  time: '1 hr ago',   coins: 5 },
]

const QUICK_LINKS = [
  { emoji: '✍️', label: 'Answer Doubts',    path: '/guru-hub',              desc: 'Help students & earn coins' },
  { emoji: '📊', label: 'Analytics',         path: '/mentor-hub/analytics',  desc: 'Your impact metrics' },
  { emoji: '💰', label: 'Cashback Center',   path: '/mentor-hub/cashback',   desc: 'Track your referral earnings' },
  { emoji: '🎟️', label: 'Coupon Manager',   path: '/mentor-hub/coupons',    desc: 'Create discount codes' },
]

const springTap = { type: 'spring', stiffness: 420, damping: 26 }

/**
 * Banner shown at the top of every mentor's feed — visible to all
 * mentors, celebrating whichever mentor's ANSWER (not question) got
 * the highest weighted student reactions today. Reactions themselves
 * happen where students actually read answers (e.g. GuruHub /
 * doubt-thread view) — this banner is the recognition surface, not
 * the reacting surface.
 */
function PinnedAnswerBanner({ pinned }) {
  if (!pinned) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 20, padding: 16,
        background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 12px 32px rgba(212,175,55,0.28)',
      }}
    >
      <span style={{ fontSize: 28 }}>🏆</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: 'var(--color-primary-dark, #1E3A5F)', textTransform: 'uppercase' }}>
          Today's Top Answer
        </p>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary-dark, #1E3A5F)' }}>
          {pinned.mentorName} · {pinned.subject}
        </p>
        <p style={{ fontSize: 12, color: 'rgba(15,23,42,0.65)', marginTop: 2 }}>
          Score {pinned.score} — pinned for 24 hours
        </p>
      </div>
    </motion.div>
  )
}

export default function MentorHub() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const pinned = useMemo(() => getPinnedAnswer(), [])
  const isPinnedMentor = useMemo(() => isMentorPinnedToday(user?.id), [user?.id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))' }}>
      <p style={{ color: 'var(--color-accent, #D4AF37)', fontFamily: 'Poppins,sans-serif', fontSize: 18 }}>Loading...</p>
    </div>
  )
  if (!user) return null

  return (
    <AppLayout title="Mentor Hub">
      <div className="max-w-2xl mx-auto space-y-6 p-4">

        {pinned && <PinnedAnswerBanner pinned={pinned} />}

        {/* Welcome */}
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))', color: 'var(--color-on-dark, #FFFFFF)' }}>
          <ProtectedAvatar user={user} size={56} />
          <div>
            <p className="text-sm" style={{ color: 'var(--color-on-dark-muted, rgba(255,255,255,0.7))' }}>Welcome back, Mentor</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              {user.name} 🎓
              {isPinnedMentor && (
                <span style={{
                  fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 10,
                  background: 'rgba(212,175,55,0.25)', color: 'var(--color-accent-light, #E8C84A)',
                }}>
                  🏆 Pinned Today
                </span>
              )}
            </p>
            {user.mentorSubjects && (
              <p className="text-sm mt-1" style={{ color: 'var(--color-on-dark-muted, rgba(255,255,255,0.7))' }}>
                Subjects: {Array.isArray(user.mentorSubjects) ? user.mentorSubjects.join(', ') : user.mentorSubjects}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Answers Given',  value: user.guruPoints ?? 0, emoji: '✍️' },
            { label: 'Coins Earned',   value: user.coins ?? 0,      emoji: '🪙' },
            { label: 'Students Helped', value: 0,                   emoji: '👨‍🎓' },
          ].map(s => (
            <motion.div
              key={s.label}
              whileHover={{ y: -3 }}
              transition={springTap}
              className="rounded-2xl border p-4 text-center shadow-sm"
              style={{ background: 'var(--color-surface, #FFFFFF)', borderColor: 'var(--color-border, #E2E8F0)' }}
            >
              <p className="text-2xl">{s.emoji}</p>
              <p className="text-2xl font-black" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))' }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--subtext-color, #64748B)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map(l => (
            <motion.button
              key={l.label}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={springTap}
              onClick={() => navigate(l.path)}
              className="rounded-2xl border shadow-sm p-4 text-left"
              style={{ background: 'var(--color-surface, #FFFFFF)', borderColor: 'var(--color-border, #E2E8F0)', color: 'var(--heading-color, var(--color-text, #1E3A5F))' }}
            >
              <span className="text-2xl">{l.emoji}</span>
              <p className="font-bold mt-2 text-sm" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))' }}>{l.label}</p>
              <p className="text-xs" style={{ color: 'var(--subtext-color, #64748B)' }}>{l.desc}</p>
            </motion.button>
          ))}
        </div>

        {/* Recent doubts — reactions happen in GuruHub once the mentor's
            answer is posted, not here. This list is just "doubts you
            can help with", same as before. */}
        <div className="rounded-2xl shadow-sm" style={{ background: 'var(--color-surface, #FFFFFF)', border: '1px solid var(--color-border, #E2E8F0)' }}>
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border, #E2E8F0)' }}>
            <h2 className="font-bold" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))' }}>Recent Doubts You Can Help</h2>
            <button onClick={() => navigate('/guru-hub')} className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-accent, #D4AF37)' }}>See all →</button>
          </div>
          <ul className="divide-y" style={{ borderColor: 'var(--color-bg, #F8FAFC)' }}>
            {SAMPLE_DOUBTS.map(d => (
              <li
                key={d.id}
                className="p-4 flex items-start gap-3 cursor-pointer transition"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg, #F8FAFC)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => navigate('/guru-hub')}
              >
                <div className="flex-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--color-accent, #D4AF37)' }}>{d.subject}</span>
                  <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))' }}>{d.question}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--subtext-color, #64748B)' }}>{d.time}</p>
                </div>
                <span className="text-xs font-bold whitespace-nowrap" style={{ color: 'var(--color-accent, #D4AF37)' }}>+{d.coins} 🪙</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </AppLayout>
  )
}