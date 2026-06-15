import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SUBJECT_FILTERS = ['All', 'Maths', 'Reasoning', 'English', 'GK / GS', 'Science', 'History', 'Economics', 'Current Affairs']

const SAMPLE_DOUBTS = [
  {
    id: 'doubt-001',
    userName: 'Priya Menon',
    initials: 'PM',
    avatarColor: '#4C1D95',
    examTag: 'UPSC CSE',
    subject: 'History',
    title: 'What is the significance of the Subsidiary Alliance System introduced by Wellesley?',
    preview: 'I understand it was used for territorial expansion, but how does it differ from the Doctrine of Lapse? The NCERT explanation feels incomplete...',
    timeAgo: '12 min ago',
    views: 47,
    answers: 3,
    isHot: true,
  },
  {
    id: 'doubt-002',
    userName: 'Arjun Ravi',
    initials: 'AR',
    avatarColor: '#064E3B',
    examTag: 'SSC CGL',
    subject: 'Reasoning',
    title: 'Blood relation puzzle — how to solve 3-generation problems quickly?',
    preview: 'In the exam I always get confused when the question involves marriages across 3 generations. Is there a shortcut or a diagramming trick?',
    timeAgo: '38 min ago',
    views: 112,
    answers: 6,
    isHot: true,
  },
  {
    id: 'doubt-003',
    userName: 'Keerthana S',
    initials: 'KS',
    avatarColor: '#7C2D12',
    examTag: 'IBPS PO',
    subject: 'Maths',
    title: 'Compound interest vs Simple interest — when does CI apply in banking problems?',
    preview: 'The formula is clear but I keep second-guessing myself about which one the question is asking for. Any rule of thumb?',
    timeAgo: '1 hr ago',
    views: 89,
    answers: 4,
    isHot: false,
  },
  {
    id: 'doubt-004',
    userName: 'Mohammed Zaid',
    initials: 'MZ',
    avatarColor: 'var(--color-primary, #1E3A5F)',
    examTag: 'TNPSC Group 2',
    subject: 'Current Affairs',
    title: 'PM Gati Shakti vs National Logistics Policy — what\'s the difference?',
    preview: 'Both are about infrastructure and logistics. Are they the same scheme or different? Which one was launched first?',
    timeAgo: '2 hr ago',
    views: 203,
    answers: 8,
    isHot: false,
  },
  {
    id: 'doubt-005',
    userName: 'Deepika Nair',
    initials: 'DN',
    avatarColor: '#064E3B',
    examTag: 'RBI Grade B',
    subject: 'Economics',
    title: 'Sterilisation vs Non-sterilisation of capital flows — RBI context',
    preview: 'Can someone explain how RBI uses OMOs and forex swaps to sterilise without affecting money supply? Very confused about the mechanism.',
    timeAgo: '3 hr ago',
    views: 156,
    answers: 5,
    isHot: false,
  },
  {
    id: 'doubt-006',
    userName: 'Suresh Kumar',
    initials: 'SK',
    avatarColor: '#4C1D95',
    examTag: 'NDA',
    subject: 'Science',
    title: 'Newton\'s Third Law application in rocket propulsion — exam question pattern',
    preview: 'I know the basics but NDA questions twist it. Any examples of tricky application-type questions I should practise?',
    timeAgo: '5 hr ago',
    views: 74,
    answers: 2,
    isHot: false,
  },
  {
    id: 'doubt-007',
    userName: 'Anitha Devi',
    initials: 'AD',
    avatarColor: '#7C2D12',
    examTag: 'NEET',
    subject: 'Science',
    title: 'Difference between resting membrane potential and action potential threshold',
    preview: 'My teacher says −70mV is resting and −55mV is threshold, but the NCERT phrasing is confusing me during MCQs.',
    timeAgo: '6 hr ago',
    views: 298,
    answers: 9,
    isHot: false,
  },
  {
    id: 'doubt-008',
    userName: 'Vikram Balaji',
    initials: 'VB',
    avatarColor: 'var(--color-primary, #1E3A5F)',
    examTag: 'SSC CGL',
    subject: 'English',
    title: 'Para-jumbles strategy — how to identify the opening sentence reliably?',
    preview: 'I end up spending too much time on para-jumbles. Is there a quick marker (pronouns, articles, connectors) that consistently flags the opener?',
    timeAgo: '8 hr ago',
    views: 187,
    answers: 7,
    isHot: false,
  },
]

export default function GuruHub() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')

  if (!user) return null

  const filtered = activeFilter === 'All'
    ? SAMPLE_DOUBTS
    : SAMPLE_DOUBTS.filter(d => d.subject === activeFilter)

  return (
    <AppLayout title="Guru Hub">
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--color-primary, #1E3A5F)', margin: 0 }}>
                🧑‍🏫 Guru Hub
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
                Ask anything. Answer to earn. Learn together.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Guru Points Badge */}
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
                borderRadius: 12,
                padding: '8px 16px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 18 }}>⭐</span>
                <div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--color-accent, #D4AF37)', lineHeight: 1 }}>
                    {user.guruPoints ?? 0}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#94a3b8', letterSpacing: '0.04em' }}>
                    GURU POINTS
                  </div>
                </div>
              </div>
              {/* My Doubts */}
              <button
                onClick={() => navigate('/guru-hub/my-doubts')}
                style={{
                  background: 'transparent', border: '1.5px solid var(--color-primary, #1E3A5F)',
                  borderRadius: 10, padding: '8px 14px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13,
                  color: 'var(--color-primary, #1E3A5F)', cursor: 'pointer',
                }}
              >
                My Doubts
              </button>
            </div>
          </div>

          {/* Earn badge */}
          <div style={{
            marginTop: 16, background: '#FEF9EC', border: '1px solid var(--color-accent-light, #E8C84A)',
            borderRadius: 10, padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#92400e',
          }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <span><strong>+5 coins</strong> every time your answer gets accepted. Help a fellow aspirant, grow your rank!</span>
          </div>
        </div>

        {/* Subject Filter Chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {SUBJECT_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: activeFilter === f ? '2px solid var(--color-accent, #D4AF37)' : '1.5px solid #e2e8f0',
                background: activeFilter === f ? 'var(--color-primary, #1E3A5F)' : '#fff',
                color: activeFilter === f ? 'var(--color-accent, #D4AF37)' : '#475569',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', transition: 'all 0.18s',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Doubt Cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--color-primary, #1E3A5F)', marginBottom: 8 }}>
              No doubts in this subject yet
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748b', marginBottom: 20 }}>
              Be the first to ask a question here!
            </p>
            <button
              onClick={() => navigate('/guru-hub/post-doubt')}
              style={{
                background: 'var(--color-accent, #D4AF37)', border: 'none', borderRadius: 10,
                padding: '10px 24px', color: 'var(--color-primary, #1E3A5F)',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
            >
              Post a Doubt →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(doubt => (
              <DoubtCard key={doubt.id} doubt={doubt} onClick={() => navigate(`/guru-hub/${doubt.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Post Button */}
      <button
        onClick={() => navigate('/guru-hub/post-doubt')}
        style={{
          position: 'fixed', bottom: 28, right: 28,
          background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
          border: 'none', borderRadius: 16,
          padding: '14px 22px',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 28px rgba(212,175,55,0.45)',
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14,
          color: 'var(--color-primary, #1E3A5F)', cursor: 'pointer',
          zIndex: 50,
        }}
      >
        <span style={{ fontSize: 18 }}>+</span>
        Post a Doubt
      </button>
    </AppLayout>
  )
}

function DoubtCard({ doubt, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1.5px solid #e2e8f0',
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'box-shadow 0.18s, border-color 0.18s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(30,58,95,0.10)'
        e.currentTarget.style.borderColor = 'var(--color-accent, #D4AF37)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#e2e8f0'
      }}
    >
      {doubt.isHot && (
        <span style={{
          position: 'absolute', top: 14, right: 16,
          background: '#FEF2F2', color: '#b91c1c',
          borderRadius: 8, padding: '2px 10px',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 11,
        }}>
          🔥 Hot
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: doubt.avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff',
          flexShrink: 0,
        }}>
          {doubt.initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#374151' }}>
              {doubt.userName}
            </span>
            <span style={{ color: '#cbd5e1', fontSize: 12 }}>·</span>
            <span style={{
              background: 'var(--color-bg-muted, #EFF6FF)', color: '#1d4ed8',
              borderRadius: 6, padding: '1px 8px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
            }}>
              {doubt.examTag}
            </span>
            <span style={{
              background: 'var(--color-bg-muted-2, #F1F5F9)', color: '#475569',
              borderRadius: 6, padding: '1px 8px',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11,
            }}>
              {doubt.subject}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>
              {doubt.timeAgo}
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14,
            color: 'var(--color-primary, #1E3A5F)', marginBottom: 6,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {doubt.title}
          </div>

          {/* Preview */}
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#64748b',
            lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            marginBottom: 12,
          }}>
            {doubt.preview}
          </div>

          {/* Footer stats */}
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#94a3b8' }}>
              👁 {doubt.views} views
            </span>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 12,
              color: doubt.answers > 0 ? '#059669' : '#94a3b8', fontWeight: doubt.answers > 0 ? 600 : 400,
            }}>
              💬 {doubt.answers} {doubt.answers === 1 ? 'answer' : 'answers'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}