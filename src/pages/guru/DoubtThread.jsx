import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

// ── Sample thread data ─────────────────────────────────────────────
// TODO: Replace with Supabase query: doubts table + answers table filtered by doubt_id
const DOUBT_DB = {
  'doubt-001': {
    id: 'doubt-001',
    authorId: 'user-pm',
    authorName: 'Priya Menon',
    authorInitials: 'PM',
    authorColor: '#4C1D95',
    examTag: 'UPSC CSE',
    subject: 'History',
    timeAgo: '12 min ago',
    title: 'What is the significance of the Subsidiary Alliance System introduced by Wellesley?',
    description: `I understand it was used for territorial expansion, but how does it differ from the Doctrine of Lapse? 

The NCERT explanation feels incomplete — it mentions that the Indian ruler had to maintain a British force but doesn't explain the financial and military consequences clearly. I also got confused in a previous mock test where both options looked similar.

Could someone explain the key differences with a short comparison?`,
    views: 47,
    answers: 3,
  },
  'doubt-002': {
    id: 'doubt-002',
    authorId: 'user-ar',
    authorName: 'Arjun Ravi',
    authorInitials: 'AR',
    authorColor: '#064E3B',
    examTag: 'SSC CGL',
    subject: 'Reasoning',
    timeAgo: '38 min ago',
    title: 'Blood relation puzzle — how to solve 3-generation problems quickly?',
    description: `In the exam I always get confused when the question involves marriages across 3 generations. Is there a shortcut or a diagramming trick?

For example: "A is the son of B. C is the mother of B. D is the husband of C." How do I quickly figure out the relation of A to D? I keep making diagrams but run out of time.`,
    views: 112,
    answers: 6,
  },
}

const ANSWERS_DB = {
  'doubt-001': [
    {
      id: 'ans-001',
      authorId: 'mentor-rk',
      authorName: 'Rajan Kumar (Mentor)',
      authorInitials: 'RK',
      authorColor: 'var(--color-accent, #D4AF37)',
      isMentor: true,
      timeAgo: '8 min ago',
      text: `Great question! Here's a quick comparison:\n\n**Subsidiary Alliance (1798, Wellesley):** The Indian ruler had to maintain a British force IN their territory — but the ruler PAID for it. This gave Britain a permanent military presence without spending their own money. If the ruler couldn't pay, they had to cede territory.\n\n**Doctrine of Lapse (Dalhousie, 1848):** Applied when an Indian ruler died without a natural heir. Adopted sons were not recognised. The state "lapsed" to British control automatically.\n\nKey difference: Subsidiary Alliance was about **military control + financial burden** on rulers. Doctrine of Lapse was about **succession and territory** after death. In exams, if the question says "no heir", it's Doctrine of Lapse. If it says "paying for British troops", it's Subsidiary Alliance.`,
      upvotes: 24,
      isAccepted: true,
    },
    {
      id: 'ans-002',
      authorId: 'user-ks',
      authorName: 'Keerthana S',
      authorInitials: 'KS',
      authorColor: '#7C2D12',
      isMentor: false,
      timeAgo: '5 min ago',
      text: 'Adding to the mentor\'s answer — a good mnemonic: **S**ubsidiary = **S**oldiers stay, **S**tate pays. **L**apse = **L**ast ruler, **L**and goes. Hope that sticks for the exam!',
      upvotes: 9,
      isAccepted: false,
    },
    {
      id: 'ans-003',
      authorId: 'user-sk',
      authorName: 'Suresh Kumar',
      authorInitials: 'SK',
      authorColor: 'var(--color-primary, #1E3A5F)',
      isMentor: false,
      timeAgo: '2 min ago',
      text: 'Both were instruments of the Paramountcy doctrine. I\'d also add — Wellesley\'s system was more "voluntary" (the ruler signed), while Dalhousie\'s was imposed unilaterally by policy. That distinction sometimes appears in Prelims questions.',
      upvotes: 6,
      isAccepted: false,
    },
  ],
  'doubt-002': [
    {
      id: 'ans-101',
      authorId: 'mentor-dn',
      authorName: 'Deepika Nair (Mentor)',
      authorInitials: 'DN',
      authorColor: 'var(--color-accent, #D4AF37)',
      isMentor: true,
      timeAgo: '30 min ago',
      text: `The trick is to always draw a vertical tree, not a horizontal one — it maps generations spatially.\n\nFor your example:\n• Top row (Gen 1): C = D (couple)\n• Middle row (Gen 2): B (child of C and D)\n• Bottom row (Gen 3): A (son of B)\n\nSo D is A\'s maternal grandfather (Nana). Once you lock in the generation rows, the relationship is obvious.\n\nQuick rule: **count the generation gap and the gender** of the linking node. That gets you 90% of these questions in under 30 seconds.`,
      upvotes: 31,
      isAccepted: true,
    },
    {
      id: 'ans-102',
      authorId: 'user-vb',
      authorName: 'Vikram Balaji',
      authorInitials: 'VB',
      authorColor: '#4C1D95',
      isMentor: false,
      timeAgo: '20 min ago',
      text: 'Also helpful: use symbols. Box for male, circle for female, horizontal line for marriage, vertical line for child. Practice 5 questions daily for a week and it becomes muscle memory.',
      upvotes: 14,
      isAccepted: false,
    },
  ],
}

const FALLBACK_DOUBT = {
  id: 'unknown',
  authorId: 'user-xx',
  authorName: 'Unknown User',
  authorInitials: '??',
  authorColor: '#94a3b8',
  examTag: 'General',
  subject: 'General',
  timeAgo: 'recently',
  title: 'Doubt not found',
  description: 'This doubt may have been deleted or the link is incorrect.',
  views: 0,
  answers: 0,
}

export default function DoubtThread() {
  const { doubtId } = useParams()
  const { user, addCoins } = useAuth()
  const navigate = useNavigate()

  const doubt = DOUBT_DB[doubtId] ?? FALLBACK_DOUBT
  const [answers, setAnswers] = useState(ANSWERS_DB[doubtId] ?? [])
  const [answerText, setAnswerText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [toast, setToast] = useState('')

  if (!user) return null

  const isDoubtAuthor = user.id === doubt.authorId

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  async function handleSubmitAnswer() {
    if (!answerText.trim()) { setSubmitError('Write your answer before submitting.'); return }
    if (answerText.trim().length < 20) { setSubmitError('Add a bit more detail to your answer.'); return }

    setSubmitting(true)
    setSubmitError('')
    // TODO: Replace with Supabase insert into answers table
    await new Promise(r => setTimeout(r, 800))

    const newAnswer = {
      id: `ans-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorInitials: user.initials,
      authorColor: 'var(--color-primary, #1E3A5F)',
      isMentor: user.role === 'mentor',
      timeAgo: 'just now',
      text: answerText.trim(),
      upvotes: 0,
      isAccepted: false,
    }

    addCoins(5) // Guru Hub answer reward
    setAnswers(prev => [...prev, newAnswer])
    setAnswerText('')
    setSubmitting(false)
    showToast('Answer posted! You\'ve earned +5 coins 🎉')
  }

  function handleAccept(answerId) {
    // TODO: Update Supabase answers table set accepted=true, others=false
    setAnswers(prev => prev.map(a => ({ ...a, isAccepted: a.id === answerId })))
    showToast('Answer marked as accepted! ✅')
  }

  function handleUpvote(answerId) {
    setAnswers(prev => prev.map(a =>
      a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
    ))
  }

  return (
    <AppLayout title="Doubt Thread">
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 60px', position: 'relative' }}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 999,
            background: 'var(--color-primary, #1E3A5F)', color: '#fff',
            borderRadius: 12, padding: '12px 20px',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {toast}
          </div>
        )}

        {/* Back */}
        <button
          onClick={() => navigate('/guru-hub')}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#64748b',
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0,
          }}
        >
          ← Back to Guru Hub
        </button>

        {/* ── Doubt card ─── */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1.5px solid #e2e8f0',
          padding: '24px 24px 20px',
          boxShadow: '0 2px 16px rgba(30,58,95,0.06)',
          marginBottom: 28,
        }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{
              background: 'var(--color-bg-muted, #EFF6FF)', color: '#1d4ed8', borderRadius: 6, padding: '2px 10px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12,
            }}>{doubt.examTag}</span>
            <span style={{
              background: 'var(--color-bg-muted-2, #F1F5F9)', color: '#475569', borderRadius: 6, padding: '2px 10px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12,
            }}>{doubt.subject}</span>
          </div>

          <h1 style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 20,
            color: 'var(--color-primary, #1E3A5F)', margin: '0 0 16px', lineHeight: 1.3,
          }}>
            {doubt.title}
          </h1>

          {/* Author row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: doubt.authorColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 12, color: '#fff', flexShrink: 0,
            }}>
              {doubt.authorInitials}
            </div>
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#374151' }}>
                {doubt.authorName}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94a3b8' }}>
                {doubt.timeAgo} · 👁 {doubt.views} views
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#374151',
            lineHeight: 1.75, whiteSpace: 'pre-line',
            background: '#F8FAFC', borderRadius: 10, padding: '16px 18px',
          }}>
            {doubt.description}
          </div>
        </div>

        {/* ── Answers ─── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--color-bg-muted-2, #F1F5F9)',
          }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--color-primary, #1E3A5F)' }}>
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </span>
          </div>

          {answers.length === 0 ? (
            <div style={{
              background: '#F8FAFC', border: '1.5px dashed #cbd5e1',
              borderRadius: 12, padding: '32px 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🧑‍🏫</div>
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748b', fontSize: 14 }}>
                No answers yet — be the first to help!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {answers.map((ans, idx) => (
                <AnswerCard
                  key={ans.id}
                  answer={ans}
                  index={idx + 1}
                  isDoubtAuthor={isDoubtAuthor}
                  onAccept={() => handleAccept(ans.id)}
                  onUpvote={() => handleUpvote(ans.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Submit Answer ─── */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1.5px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 2px 16px rgba(30,58,95,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>✍️</span>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--color-primary, #1E3A5F)' }}>
              Write Your Answer
            </span>
            <span style={{
              background: '#FEF9EC', color: '#92400e', borderRadius: 8, padding: '2px 10px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, marginLeft: 'auto',
            }}>
              +5 coins if accepted 🪙
            </span>
          </div>

          <textarea
            placeholder="Share your explanation, shortcut, or reference. Be clear and detailed — aspirants rely on you!"
            value={answerText}
            onChange={e => { setAnswerText(e.target.value); setSubmitError('') }}
            rows={5}
            style={{
              width: '100%', boxSizing: 'border-box',
              border: `1.5px solid ${submitError ? '#ef4444' : '#e2e8f0'}`,
              borderRadius: 10, padding: '12px 14px',
              fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#1e293b',
              background: '#F8FAFC', outline: 'none', resize: 'vertical',
              marginBottom: submitError ? 6 : 14,
            }}
          />
          {submitError && (
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#ef4444', marginBottom: 12 }}>
              {submitError}
            </div>
          )}

          <button
            onClick={handleSubmitAnswer}
            disabled={submitting}
            style={{
              background: submitting ? '#e2e8f0' : 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
              border: 'none', borderRadius: 10,
              padding: '12px 28px',
              fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14,
              color: submitting ? '#94a3b8' : 'var(--color-primary, #1E3A5F)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: submitting ? 'none' : '0 4px 14px rgba(212,175,55,0.3)',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Answer →'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

// ── Answer Card ─────────────────────────────────────────────────────

function AnswerCard({ answer, index, isDoubtAuthor, onAccept, onUpvote }) {
  return (
    <div style={{
      background: answer.isAccepted ? '#F0FDF4' : '#fff',
      borderRadius: 14,
      border: `1.5px solid ${answer.isAccepted ? '#86efac' : '#e2e8f0'}`,
      padding: '18px 20px',
      position: 'relative',
    }}>
      {answer.isAccepted && (
        <div style={{
          position: 'absolute', top: -1, right: 16,
          background: '#22c55e', color: '#fff',
          borderRadius: '0 0 8px 8px',
          padding: '2px 12px',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 11,
        }}>
          ✅ Accepted Answer
        </div>
      )}

      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: answer.authorColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 11, color: '#fff', flexShrink: 0,
        }}>
          {answer.authorInitials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#374151' }}>
              {answer.authorName}
            </span>
            {answer.isMentor && (
              <span style={{
                background: 'var(--color-primary, #1E3A5F)', color: 'var(--color-accent, #D4AF37)',
                borderRadius: 6, padding: '1px 8px',
                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 10,
              }}>
                MENTOR
              </span>
            )}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94a3b8' }}>
            {answer.timeAgo}
          </div>
        </div>
        <div style={{
          fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 20,
          color: '#e2e8f0',
        }}>
          #{index}
        </div>
      </div>

      {/* Answer text */}
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#374151',
        lineHeight: 1.75, whiteSpace: 'pre-line', marginBottom: 14,
      }}>
        {answer.text}
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={onUpvote}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--color-bg-muted-2, #F1F5F9)', border: 'none', borderRadius: 8,
            padding: '5px 12px', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, color: '#475569',
          }}
        >
          👍 {answer.upvotes}
        </button>

        {isDoubtAuthor && !answer.isAccepted && (
          <button
            onClick={onAccept}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#ECFDF5', border: '1px solid #86efac',
              borderRadius: 8, padding: '5px 14px', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, color: '#065f46',
            }}
          >
            ✅ Mark as Accepted
          </button>
        )}
      </div>
    </div>
  )
}