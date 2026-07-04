// src/pages/guru/PostConceptVideo.jsx
// Shared by Mentor and Institution roles - lets them upload/customize
// explainer videos that appear in the student-facing Concept Learning hub.
// Each poster controls: title, subject, exam, language, thumbnail
// (emoji or custom image), description, and video source.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const SUBJECTS = ['Maths', 'Science', 'Polity', 'History', 'Geography', 'Economy', 'English', 'Reasoning']
const EXAMS = ['UPSC CSE', 'SSC CGL', 'IBPS PO', 'NEET', 'TNPSC']
const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Telugu']
const THUMBNAIL_EMOJIS = ['📐', '🧬', '🏛️', '📰', '🧠', '🚀', '📖', '🌍', '⚖️', '💡']

const MOCK_MY_VIDEOS = [
  { id: 'v1', title: 'Fundamental Rights vs Directive Principles - explained simply', subject: 'Polity', exam: 'UPSC CSE', language: 'English',
    thumbnailEmoji: '🏛️', thumbnailImage: null, status: 'published', views: 1204, postedDate: '2 days ago' },
  { id: 'v2', title: 'Newton\'s Laws in rocket propulsion', subject: 'Science', exam: 'UPSC CSE', language: 'Hindi',
    thumbnailEmoji: '🚀', thumbnailImage: null, status: 'published', views: 782, postedDate: '6 days ago' },
]

export default function PostConceptVideo() {
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

  const role = user?.role === 'institution' ? 'institution' : 'mentor'
  const backPath = role === 'institution' ? '/institution' : '/mentor-hub'

  const [showForm, setShowForm] = useState(false)
  const [myVideos, setMyVideos] = useState(MOCK_MY_VIDEOS)
  const [form, setForm] = useState({
    title: '', subject: SUBJECTS[0], exam: EXAMS[0], language: LANGUAGES[0],
    description: '', thumbnailEmoji: THUMBNAIL_EMOJIS[0], thumbnailImage: null, videoFile: null,
  })

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${b}`,
    background: isDark ? 'rgba(255,255,255,0.05)' : c, color: t, fontSize: 13, outline: 'none',
    fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box',
  }

  function handleThumbnailImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, thumbnailImage: reader.result }))
    reader.readAsDataURL(file)
  }

  function handlePublish() {
    if (!form.title.trim()) return
    const newVideo = {
      id: `v${Date.now()}`, title: form.title, subject: form.subject, exam: form.exam,
      language: form.language, thumbnailEmoji: form.thumbnailEmoji, thumbnailImage: form.thumbnailImage,
      status: 'published', views: 0, postedDate: 'Just now',
    }
    setMyVideos(v => [newVideo, ...v])
    setForm({ title: '', subject: SUBJECTS[0], exam: EXAMS[0], language: LANGUAGES[0],
      description: '', thumbnailEmoji: THUMBNAIL_EMOJIS[0], thumbnailImage: null, videoFile: null })
    setShowForm(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Poppins,sans-serif' }}>
      {/* Header */}
      <div style={{ background: c, borderBottom: `1px solid ${b}`, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10,
        boxShadow: `0 4px 24px ${a}18` }}>
        <button onClick={() => nav(backPath)} style={{ background: 'transparent', border: `1px solid ${a}55`,
          borderRadius: 10, padding: '6px 14px', color: m, fontSize: 13, cursor: 'pointer' }}>← Back</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: t, fontSize: 18, fontWeight: 800, margin: 0, textShadow: `0 0 20px ${a}50` }}>💡 Concept Videos</h1>
          <p style={{ color: m, fontSize: 11, margin: 0 }}>Post explainer videos students discover in Concept Learning</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: `linear-gradient(135deg,${p},${a})`,
          border: 'none', borderRadius: 12, padding: '10px 18px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          boxShadow: `0 4px 20px ${a}45` }}>
          + Post Video
        </button>
      </div>

      <div style={{ padding: '20px', maxWidth: 720, margin: '0 auto' }}>
        {/* Upload form */}
        {showForm && (
          <div style={{ background: c, border: `1px solid ${b}`, borderRadius: 16, padding: 20, marginBottom: 24,
            boxShadow: `0 0 30px ${a}15` }}>
            <h2 style={{ color: t, fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>New Concept Video</h2>

            <label style={{ display: 'block', color: m, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Compound Interest tricks for banking exams"
              style={{ ...inputStyle, marginBottom: 14 }} />

            <label style={{ display: 'block', color: m, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What will students learn from this video?" rows={3}
              style={{ ...inputStyle, marginBottom: 14, resize: 'vertical' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', color: m, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>Subject</label>
                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer', colorScheme: isDark ? 'dark' : 'light' }}>
                  {SUBJECTS.map(s => <option key={s} value={s} style={{ background: isDark ? '#161B22' : '#fff', color: t }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: m, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>Exam</label>
                <select value={form.exam} onChange={e => setForm(f => ({ ...f, exam: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer', colorScheme: isDark ? 'dark' : 'light' }}>
                  {EXAMS.map(x => <option key={x} value={x} style={{ background: isDark ? '#161B22' : '#fff', color: t }}>{x}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: m, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>Language</label>
                <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer', colorScheme: isDark ? 'dark' : 'light' }}>
                  {LANGUAGES.map(l => <option key={l} value={l} style={{ background: isDark ? '#161B22' : '#fff', color: t }}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Thumbnail customization */}
            <label style={{ display: 'block', color: m, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Thumbnail</label>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 90, height: 70, borderRadius: 10, background: form.thumbnailImage
                ? `url(${form.thumbnailImage}) center/cover` : `linear-gradient(135deg,${p},${p}cc)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {!form.thumbnailImage && <span style={{ fontSize: 30 }}>{form.thumbnailEmoji}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: m, fontSize: 10, marginBottom: 6 }}>Choose an emoji, or upload a custom thumbnail image:</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {THUMBNAIL_EMOJIS.map(em => (
                    <button key={em} onClick={() => setForm(f => ({ ...f, thumbnailEmoji: em, thumbnailImage: null }))}
                      style={{ width: 30, height: 30, borderRadius: 8, fontSize: 15, cursor: 'pointer',
                        border: form.thumbnailEmoji === em && !form.thumbnailImage ? `2px solid ${a}` : `1px solid ${b}`,
                        background: c }}>{em}</button>
                  ))}
                </div>
                <label style={{ display: 'inline-block', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                  border: `1px dashed ${b}`, borderRadius: 8, padding: '6px 12px', fontSize: 11, color: m, cursor: 'pointer' }}>
                  📷 Upload custom image
                  <input type="file" accept="image/*" onChange={handleThumbnailImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <label style={{ display: 'block', color: m, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Video file</label>
            <input type="file" accept="video/*" onChange={e => setForm(f => ({ ...f, videoFile: e.target.files?.[0] || null }))}
              style={{ ...inputStyle, marginBottom: 18, padding: '8px 14px' }} />

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handlePublish} disabled={!form.title.trim()} style={{
                flex: 1, background: form.title.trim() ? `linear-gradient(135deg,${p},${a})` : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                border: 'none', borderRadius: 10, padding: '11px', color: form.title.trim() ? '#fff' : m, fontWeight: 700, fontSize: 13,
                cursor: form.title.trim() ? 'pointer' : 'not-allowed' }}>
                Publish Video
              </button>
              <button onClick={() => setShowForm(false)} style={{
                background: 'transparent', border: `1px solid ${b}`, borderRadius: 10, padding: '11px 18px',
                color: m, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* My posted videos */}
        <h2 style={{ color: t, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Your videos ({myVideos.length})</h2>
        {myVideos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎬</div>
            <p style={{ color: t, fontWeight: 700 }}>No videos posted yet</p>
            <p style={{ color: m, fontSize: 12 }}>Post your first explainer video - students discover mentors through these.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myVideos.map(v => (
              <div key={v.id} style={{ background: c, border: `1px solid ${b}`, borderRadius: 14, padding: 12,
                display: 'flex', gap: 12, alignItems: 'center', boxShadow: `0 0 16px ${a}08` }}>
                <div style={{ width: 60, height: 46, borderRadius: 8, flexShrink: 0,
                  background: v.thumbnailImage ? `url(${v.thumbnailImage}) center/cover` : `linear-gradient(135deg,${p},${p}cc)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!v.thumbnailImage && <span style={{ fontSize: 20 }}>{v.thumbnailEmoji}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: t, fontWeight: 700, fontSize: 12.5, margin: '0 0 3px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</p>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <span style={{ background: `${a}18`, color: a, fontSize: 8.5, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>{v.subject}</span>
                    <span style={{ color: m, fontSize: 10 }}>👁 {v.views}</span>
                    <span style={{ color: m, fontSize: 10 }}>· {v.postedDate}</span>
                  </div>
                </div>
                <span style={{ background: '#16A34A20', color: '#16A34A', fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>Published</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
