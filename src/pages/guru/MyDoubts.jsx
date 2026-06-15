import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

// Sample data scoped to the current user — in production these would
// be filtered from Supabase by user.id
const MY_POSTED_DOUBTS = [
  {
    id: 'doubt-009',
    examTag: 'UPSC CSE',
    subject: 'Polity',
    title: 'Is the Speaker of Lok Sabha bound by party whip during a no-confidence motion?',
    timeAgo: '2 days ago',
    answers: 4,
    hasAccepted: true,
    status: 'resolved',
  },
  {
    id: 'doubt-010',
    examTag: 'UPSC CSE',
    subject: 'Economics',
    title: 'What exactly does "fiscal space" mean in the Budget context?',
    timeAgo: '5 days ago',
    answers: 1,
    hasAccepted: false,
    status: 'open',
  },
]

const MY_ANSWERED_DOUBTS = [
  {
    id: 'doubt-002',
    examTag: 'SSC CGL',
    subject: 'Reasoning',
    title: 'Blood relation puzzle — how to solve 3-generation problems quickly?',
    timeAgo: '1 day ago',
    wasAccepted: true,
    coinsEarned: 5,
  },
  {
    id: 'doubt-004',
    examTag: 'TNPSC Group 2',
    subject: 'Current Affairs',
    title: 'PM Gati Shakti vs National Logistics Policy — what\'s the difference?',
    timeAgo: '3 days ago',
    wasAccepted: false,
    coinsEarned: 0,
  },
]

export default function MyDoubts() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <AppLayout title="My Doubts">
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 60px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => navigate('/guru-hub')}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#64748b',
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: 0,
            }}
          >
            ← Back to Guru Hub
          </button>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--color-primary, #1E3A5F)', margin: 0 }}>
            My Doubts
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Track questions you've asked and answers you've given.
          </p>
        </div>

        {/* ── SECTION 1: Doubts I've Posted ── */}
        <SectionHeading emoji="📝" title="Doubts I've Posted" count={MY_POSTED_DOUBTS.length} />

        {MY_POSTED_DOUBTS.length === 0 ? (
          <EmptyState
            emoji="🤔"
            message="You haven't asked anything yet — got a doubt?"
            ctaLabel="Post a Doubt"
            ctaPath="/guru-hub/post-doubt"
            navigate={navigate}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
            {MY_POSTED_DOUBTS.map(d => (
              <PostedDoubtCard key={d.id} doubt={d} onClick={() => navigate(`/guru-hub/${d.id}`)} />
            ))}
          </div>
        )}

        {/* ── SECTION 2: Doubts I've Answered ── */}
        <SectionHeading emoji="💬" title="Doubts I've Answered" count={MY_ANSWERED_DOUBTS.length} />

        {MY_ANSWERED_DOUBTS.length === 0 ? (
          <EmptyState
            emoji="🧑‍🏫"
            message="You haven't answered any doubts yet — help a fellow aspirant!"
            ctaLabel="Browse Doubts"
            ctaPath="/guru-hub"
            navigate={navigate}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MY_ANSWERED_DOUBTS.map(d => (
              <AnsweredDoubtCard key={d.id} doubt={d} onClick={() => navigate(`/guru-hub/${d.id}`)} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

// ── Sub-components ──────────────────────────────────────────────────

function SectionHeading({ emoji, title, count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
      paddingBottom: 10, borderBottom: '2px solid var(--color-bg-muted-2, #F1F5F9)',
    }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--color-primary, #1E3A5F)' }}>
        {title}
      </span>
      <span style={{
        background: 'var(--color-bg-muted, #EFF6FF)', color: '#1d4ed8',
        borderRadius: 20, padding: '1px 10px',
        fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 12,
      }}>
        {count}
      </span>
    </div>
  )
}

function EmptyState({ emoji, message, ctaLabel, ctaPath, navigate }) {
  return (
    <div style={{
      background: '#F8FAFC', border: '1.5px dashed #cbd5e1',
      borderRadius: 14, padding: '36px 24px', textAlign: 'center', marginBottom: 36,
    }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>{emoji}</div>
      <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748b', fontSize: 14, marginBottom: 16 }}>
        {message}
      </p>
      <button
        onClick={() => navigate(ctaPath)}
        style={{
          background: 'var(--color-accent, #D4AF37)', border: 'none', borderRadius: 10,
          padding: '9px 22px', color: 'var(--color-primary, #1E3A5F)',
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
        }}
      >
        {ctaLabel} →
      </button>
    </div>
  )
}

function PostedDoubtCard({ doubt, onClick }) {
  const statusStyle = doubt.status === 'resolved'
    ? { bg: '#ECFDF5', color: '#065f46', label: '✅ Resolved' }
    : { bg: '#FEF9EC', color: '#92400e', label: '🟡 Open' }

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: 12,
        border: '1.5px solid #e2e8f0',
        padding: '16px 18px', cursor: 'pointer',
        transition: 'box-shadow 0.18s, border-color 0.18s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,95,0.09)'
        e.currentTarget.style.borderColor = 'var(--color-accent, #D4AF37)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#e2e8f0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{
              background: 'var(--color-bg-muted, #EFF6FF)', color: '#1d4ed8', borderRadius: 6, padding: '1px 8px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
            }}>{doubt.examTag}</span>
            <span style={{
              background: 'var(--color-bg-muted-2, #F1F5F9)', color: '#475569', borderRadius: 6, padding: '1px 8px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
            }}>{doubt.subject}</span>
          </div>
          <div style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14,
            color: 'var(--color-primary, #1E3A5F)', marginBottom: 8,
          }}>
            {doubt.title}
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#94a3b8' }}>
              {doubt.timeAgo}
            </span>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 12,
              color: doubt.answers > 0 ? '#059669' : '#94a3b8', fontWeight: doubt.answers > 0 ? 600 : 400,
            }}>
              💬 {doubt.answers} {doubt.answers === 1 ? 'answer' : 'answers'}
            </span>
          </div>
        </div>
        <span style={{
          background: statusStyle.bg, color: statusStyle.color,
          borderRadius: 8, padding: '3px 10px',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap',
        }}>
          {statusStyle.label}
        </span>
      </div>
    </div>
  )
}

function AnsweredDoubtCard({ doubt, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: 12,
        border: '1.5px solid #e2e8f0',
        padding: '16px 18px', cursor: 'pointer',
        transition: 'box-shadow 0.18s, border-color 0.18s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,95,0.09)'
        e.currentTarget.style.borderColor = 'var(--color-accent, #D4AF37)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#e2e8f0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{
              background: 'var(--color-bg-muted, #EFF6FF)', color: '#1d4ed8', borderRadius: 6, padding: '1px 8px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
            }}>{doubt.examTag}</span>
            <span style={{
              background: 'var(--color-bg-muted-2, #F1F5F9)', color: '#475569', borderRadius: 6, padding: '1px 8px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
            }}>{doubt.subject}</span>
          </div>
          <div style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14,
            color: 'var(--color-primary, #1E3A5F)', marginBottom: 8,
          }}>
            {doubt.title}
          </div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#94a3b8' }}>
            Answered {doubt.timeAgo}
          </span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {doubt.wasAccepted ? (
            <div>
              <div style={{
                background: '#ECFDF5', color: '#065f46',
                borderRadius: 8, padding: '3px 10px',
                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 11, marginBottom: 4,
              }}>
                ✅ Accepted
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'var(--color-accent, #D4AF37)', fontWeight: 700 }}>
                +{doubt.coinsEarned} coins earned
              </div>
            </div>
          ) : (
            <span style={{
              background: 'var(--color-bg-muted-2, #F1F5F9)', color: '#94a3b8',
              borderRadius: 8, padding: '3px 10px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
            }}>
              Pending
            </span>
          )}
        </div>
      </div>
    </div>
  )
}