// src/pages/student/StudentConceptLearning.jsx
// Concept Learning Hub - mentors/institutions post topic explainer videos,
// students browse/search/filter by subject/exam/topic/language and react
// with emojis. Helps students discover mentors worth booking for 1:1 tuition.
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const SUBJECTS = ['All', 'Maths', 'Science', 'Polity', 'History', 'Geography', 'Economy', 'English', 'Reasoning']
const EXAMS = ['All Exams', 'UPSC CSE', 'SSC CGL', 'IBPS PO', 'NEET', 'TNPSC']
const LANGUAGES = ['All Languages', 'English', 'Tamil', 'Hindi', 'Telugu']

const EMOJI_OPTIONS = ['👍', '🔥', '💡', '🙌', '❤️']

const VIDEOS = [
  { id: 'v1', title: 'Fundamental Rights vs Directive Principles - explained simply', subject: 'Polity', exam: 'UPSC CSE', language: 'English',
    mentorName: 'Dr. Kavitha Raman', mentorId: 'mentor-101', mentorAvatar: '#4C1D95', duration: '8:24', views: 1204, tier: 'free',
    reactions: { '👍': 340, '🔥': 89, '💡': 156, '🙌': 42, '❤️': 67 }, postedBy: 'mentor', thumbnailEmoji: '🏛️' },
  { id: 'v2', title: 'Compound Interest tricks for banking exams - 30 second method', subject: 'Maths', exam: 'IBPS PO', language: 'English',
    mentorName: 'Arjun Prakash Academy', mentorId: 'inst-201', mentorAvatar: '#7C2D12', duration: '5:12', views: 2891, tier: 'free',
    reactions: { '👍': 512, '🔥': 234, '💡': 198, '🙌': 76, '❤️': 103 }, postedBy: 'institution', thumbnailEmoji: '📐' },
  { id: 'v3', title: 'Human Digestive System - complete NEET revision in Tamil', subject: 'Science', exam: 'NEET', language: 'Tamil',
    mentorName: 'Priya Medical Coaching', mentorId: 'inst-202', mentorAvatar: '#064E3B', duration: '14:50', views: 3402, tier: 'locked',
    reactions: { '👍': 678, '🔥': 301, '💡': 245, '🙌': 112, '❤️': 189 }, postedBy: 'institution', thumbnailEmoji: '🧬' },
  { id: 'v4', title: 'Blood relation puzzles - visual diagramming trick', subject: 'Reasoning', exam: 'SSC CGL', language: 'English',
    mentorName: 'Suresh Kumar', mentorId: 'mentor-102', mentorAvatar: '#1E3A8A', duration: '6:33', views: 967, tier: 'free',
    reactions: { '👍': 210, '🔥': 54, '💡': 88, '🙌': 21, '❤️': 34 }, postedBy: 'mentor', thumbnailEmoji: '🧠' },
  { id: 'v5', title: 'Tamil Nadu government schemes - complete 2026 update', subject: 'Economy', exam: 'TNPSC', language: 'Tamil',
    mentorName: 'Deepika Nair', mentorId: 'mentor-103', mentorAvatar: '#B45309', duration: '11:05', views: 1543, tier: 'locked',
    reactions: { '👍': 289, '🔥': 121, '💡': 167, '🙌': 45, '❤️': 58 }, postedBy: 'mentor', thumbnailEmoji: '📊' },
  { id: 'v6', title: 'Newton\'s Laws in rocket propulsion - NDA question patterns', subject: 'Science', exam: 'UPSC CSE', language: 'Hindi',
    mentorName: 'Mohammed Zaid', mentorId: 'mentor-104', mentorAvatar: '#0F766E', duration: '9:47', views: 782, tier: 'locked',
    reactions: { '👍': 156, '🔥': 43, '💡': 92, '🙌': 18, '❤️': 27 }, postedBy: 'mentor', thumbnailEmoji: '🚀' },
]

export default function StudentConceptLearning() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const isDark = theme?.isDark || false
  const p = theme?.primary || '#1E3A5F'
  const a = theme?.accent || '#C9A84C'
  const t = theme?.text || '#1E293B'
  const m = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const c = theme?.surface || '#FFFFFF'
  const b = theme?.border || '#E2E8F0'

  // Locked videos are visible to everyone (so students see what they're missing),
  // but only actually playable/reactable if enrolled in a Launchpad course.
  const isLaunchpadMember = Boolean(user?.launchpadEnrolled || user?.plan === 'pro' || user?.plan === 'ultra')

  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('All')
  const [exam, setExam] = useState('All Exams')
  const [language, setLanguage] = useState('All Languages')
  const [reacted, setReacted] = useState({}) // { videoId: emoji }

  const filtered = useMemo(() => {
    return VIDEOS.filter(v => {
      if (subject !== 'All' && v.subject !== subject) return false
      if (exam !== 'All Exams' && v.exam !== exam) return false
      if (language !== 'All Languages' && v.language !== language) return false
      if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [subject, exam, language, search])

  function handleReact(videoId, emoji) {
    setReacted(prev => ({ ...prev, [videoId]: prev[videoId] === emoji ? null : emoji }))
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Poppins,sans-serif' }}>
      {/* Header */}
      <div style={{ background: c, borderBottom: `1px solid ${b}`, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10,
        boxShadow: `0 4px 24px ${a}18` }}>
        <button onClick={() => nav('/student')} style={{ background: 'transparent', border: `1px solid ${a}55`,
          borderRadius: 10, padding: '6px 14px', color: m, fontSize: 13, cursor: 'pointer' }}>← Back</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: t, fontSize: 18, fontWeight: 800, margin: 0, textShadow: `0 0 20px ${a}50` }}>💡 Concept Learning</h1>
          <p style={{ color: m, fontSize: 11, margin: 0 }}>Explainer videos from real mentors & institutions - find your perfect 1:1 tutor</p>
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: 960, margin: '0 auto' }}>
        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by topic, e.g. 'Fundamental Rights'..."
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${b}`,
            background: isDark ? 'rgba(255,255,255,0.05)' : c, color: t, fontSize: 14, outline: 'none',
            marginBottom: 16, boxSizing: 'border-box' }}
        />

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <FilterRow label="Subject" options={SUBJECTS} active={subject} onSelect={setSubject} accent={a} text={t} muted={m} border={b} isDark={isDark} card={c} />
          <FilterRow label="Exam" options={EXAMS} active={exam} onSelect={setExam} accent={a} text={t} muted={m} border={b} isDark={isDark} card={c} />
          <FilterRow label="Language" options={LANGUAGES} active={language} onSelect={setLanguage} accent={a} text={t} muted={m} border={b} isDark={isDark} card={c} />
        </div>

        {/* Results count */}
        <p style={{ color: m, fontSize: 12, marginBottom: 14 }}>{filtered.length} video{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Video grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div>
            <p style={{ color: t, fontWeight: 700 }}>No videos match these filters yet</p>
            <p style={{ color: m, fontSize: 13 }}>Try a different subject or exam - new content is added weekly.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(v => (
              <VideoCard key={v.id} video={v} reacted={reacted[v.id]} onReact={emoji => handleReact(v.id, emoji)}
                onBookMentor={() => nav(`/student/mentor?id=${v.mentorId}`)} isLaunchpadMember={isLaunchpadMember}
                theme={{ isDark, p, a, t, m, c, b }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterRow({ label, options, active, onSelect, accent, text, muted, border, isDark, card }) {
  return (
    <div>
      <p style={{ color: muted, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' }}>{label}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onSelect(opt)}
            style={{
              padding: '6px 14px', borderRadius: 20,
              border: active === opt ? `2px solid ${accent}` : `1.5px solid ${border}`,
              background: active === opt ? accent : card,
              color: active === opt ? '#fff' : text,
              fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.18s',
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function VideoCard({ video, reacted, onReact, onBookMentor, isLaunchpadMember, theme }) {
  const { isDark, p, a, t, m, c, b } = theme
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const totalReactions = Object.values(video.reactions).reduce((sum, n) => sum + n, 0)
  const isLocked = video.tier === 'locked' && !isLaunchpadMember

  return (
    <div style={{ background: c, border: `1px solid ${b}`, borderRadius: 16, overflow: 'hidden',
      boxShadow: `0 0 20px ${a}10`, transition: 'all 0.2s' }}>
      {/* Thumbnail */}
      <div style={{ height: 130, background: `linear-gradient(135deg, ${p}, ${p}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontSize: 44, filter: `drop-shadow(0 0 10px ${a}70)`, opacity: isLocked ? 0.35 : 1 }}>{video.thumbnailEmoji}</span>
        {isLocked && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontSize: 22 }}>🔒</span>
            <span style={{ color: '#fff', fontSize: 9, fontWeight: 700 }}>Launchpad only</span>
          </div>
        )}
        <span style={{ position: 'absolute', bottom: 8, right: 10, background: 'rgba(0,0,0,0.65)', color: '#fff',
          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>{video.duration}</span>
        <span style={{ position: 'absolute', top: 8, left: 10, background: video.postedBy === 'institution' ? '#0369A1' : a,
          color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase' }}>
          {video.postedBy === 'institution' ? '🏫 Institution' : '👨‍🏫 Mentor'}
        </span>
        {video.tier === 'free' && (
          <span style={{ position: 'absolute', top: 8, right: 10, background: '#16A34A',
            color: '#fff', fontSize: 8.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>FREE</span>
        )}
      </div>

      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ background: `${a}18`, color: a, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{video.subject}</span>
          <span style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9', color: m, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{video.exam}</span>
          <span style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9', color: m, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{video.language}</span>
        </div>

        <p style={{ color: t, fontWeight: 700, fontSize: 13.5, lineHeight: 1.4, margin: '0 0 10px', minHeight: 38 }}>{video.title}</p>

        {/* Mentor row */}
        <div onClick={onBookMentor} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, cursor: 'pointer' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: video.mentorAvatar,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            {video.mentorName.split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>
          <span style={{ color: m, fontSize: 12, fontWeight: 600 }}>{video.mentorName}</span>
          <span style={{ color: m, fontSize: 11, marginLeft: 'auto' }}>👁 {video.views.toLocaleString('en-IN')}</span>
        </div>

        {isLocked ? (
          <button onClick={() => onBookMentor()} style={{
            width: '100%', background: `linear-gradient(135deg,${p},${a})`, border: 'none', borderRadius: 20,
            padding: '9px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            🔒 Join Launchpad to unlock
          </button>
        ) : (
          /* Emoji reactions */
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
            <button onClick={() => setShowEmojiPicker(v => !v)} style={{
              background: reacted ? `${a}20` : (isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC'),
              border: `1px solid ${reacted ? a : b}`, borderRadius: 20, padding: '4px 10px',
              fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{reacted || '😀'}</span>
              <span style={{ color: m, fontSize: 11, fontWeight: 600 }}>{totalReactions + (reacted ? 1 : 0)}</span>
            </button>
            <button onClick={onBookMentor} style={{
              background: `linear-gradient(135deg,${p},${a})`, border: 'none', borderRadius: 20,
              padding: '5px 14px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}>
              Join 1:1 →
            </button>

            {showEmojiPicker && (
              <div style={{ position: 'absolute', bottom: '110%', left: 0, background: c, border: `1px solid ${b}`,
                borderRadius: 12, padding: '8px 10px', display: 'flex', gap: 8, boxShadow: `0 8px 24px ${a}25`, zIndex: 5 }}>
                {EMOJI_OPTIONS.map(emoji => (
                  <button key={emoji} onClick={() => { onReact(emoji); setShowEmojiPicker(false) }}
                    style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer',
                      transform: reacted === emoji ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.15s' }}>
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
