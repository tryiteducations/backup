import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const ALL_EXAMS = [
  'UPSC CSE', 'UPSC CDS', 'UPSC NDA', 'SSC CGL', 'SSC CHSL', 'SSC MTS',
  'IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RBI Grade B',
  'TNPSC Group 1', 'TNPSC Group 2', 'TNPSC Group 4',
  'Railway NTPC', 'Railway Group D', 'NEET', 'JEE Main', 'JEE Advanced',
  'CLAT', 'NDA', 'GATE', 'IELTS', 'TOEFL',
]

const SUBJECTS = [
  'Maths', 'Reasoning', 'English', 'GK / GS', 'Science',
  'History', 'Geography', 'Polity', 'Economics', 'Current Affairs',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Other',
]

export default function PostDoubt() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    exam: user?.exams?.[0]?.name ?? '',
    subject: '',
    title: '',
    description: '',
    image: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  if (!user) return null

  // Build exam list: user's own exams first, then others
  const userExamNames = (user.exams ?? []).map(e => e.name)
  const otherExams = ALL_EXAMS.filter(e => !userExamNames.includes(e))
  const examOptions = [...userExamNames, ...otherExams]

  function validate() {
    const e = {}
    if (!form.exam) e.exam = 'Pick an exam.'
    if (!form.subject) e.subject = 'Pick a subject.'
    if (!form.title.trim()) e.title = 'Add a title for your doubt.'
    else if (form.title.trim().length < 20) e.title = 'Make the title a bit more descriptive (at least 20 characters).'
    if (!form.description.trim()) e.description = 'Describe your doubt in detail.'
    else if (form.description.trim().length < 40) e.description = 'Add a bit more detail so mentors can help accurately.'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setSubmitting(true)
    // TODO: Replace with Supabase insert into doubts table
    await new Promise(r => setTimeout(r, 900))
    setSubmitting(false)

    // Navigate with a success flag (read in GuruHub via location.state)
    navigate('/guru-hub', { state: { toast: 'Your doubt has been posted! Mentors will reply soon. 🎉' } })
  }

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const charCount = form.description.length

  return (
    <AppLayout title="Post a Doubt">
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px 60px' }}>

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

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 18,
          border: '1.5px solid #e2e8f0',
          padding: '32px 28px',
          boxShadow: '0 4px 24px rgba(30,58,95,0.06)',
        }}>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--color-primary, #1E3A5F)', margin: '0 0 6px' }}>
            📝 Post a Doubt
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748b', fontSize: 13, margin: '0 0 28px' }}>
            Be specific — well-framed doubts get better answers, faster.
          </p>

          {/* Exam */}
          <FieldGroup label="Exam" error={errors.exam} required>
            <select
              value={form.exam}
              onChange={e => set('exam', e.target.value)}
              style={selectStyle(!!errors.exam)}
            >
              <option value="">— Select exam —</option>
              {userExamNames.length > 0 && (
                <optgroup label="My Exams">
                  {userExamNames.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </optgroup>
              )}
              <optgroup label="All Exams">
                {otherExams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </optgroup>
            </select>
          </FieldGroup>

          {/* Subject */}
          <FieldGroup label="Subject" error={errors.subject} required>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => set('subject', s)}
                  style={{
                    padding: '6px 14px', borderRadius: 20,
                    border: form.subject === s ? '2px solid var(--color-accent, #D4AF37)' : '1.5px solid #e2e8f0',
                    background: form.subject === s ? 'var(--color-primary, #1E3A5F)' : '#F8FAFC',
                    color: form.subject === s ? 'var(--color-accent, #D4AF37)' : '#475569',
                    fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </FieldGroup>

          {/* Title */}
          <FieldGroup label="Doubt Title" error={errors.title} required hint="State the core question in one sentence.">
            <input
              type="text"
              placeholder="e.g. What is the difference between Monetary Policy Committee and Financial Stability Board?"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              maxLength={200}
              style={inputStyle(!!errors.title)}
            />
          </FieldGroup>

          {/* Description */}
          <FieldGroup
            label="Detailed Description"
            error={errors.description}
            required
            hint="Share what you already know, what's confusing you, and where you got stuck."
          >
            <textarea
              placeholder="Describe your doubt here. The more context you give, the better the answers you'll receive..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={6}
              maxLength={2000}
              style={{ ...inputStyle(!!errors.description), resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
            />
            <div style={{ textAlign: 'right', fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
              {charCount}/2000
            </div>
          </FieldGroup>

          {/* Image Upload (placeholder) */}
          <FieldGroup label="Attach Image" hint="Optional — attach a screenshot of a question or your notes.">
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#F8FAFC', border: '1.5px dashed #cbd5e1',
              borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
            }}>
              <span style={{ fontSize: 22 }}>📎</span>
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#374151' }}>
                  {form.image ? form.image.name : 'Choose an image'}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94a3b8' }}>
                  PNG, JPG up to 5MB
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => set('image', e.target.files[0] ?? null)}
              />
            </label>
          </FieldGroup>

          {/* Tip box */}
          <div style={{
            background: '#FEF9EC', border: '1px solid var(--color-accent-light, #E8C84A)',
            borderRadius: 10, padding: '10px 16px',
            display: 'flex', gap: 10, marginBottom: 28,
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#92400e', margin: 0, lineHeight: 1.6 }}>
              <strong>Pro tip:</strong> Include the source (textbook, mock test, year) and what you've already tried. Mentors who answer get <strong>+5 coins</strong> when their answer is accepted — so quality doubts attract quality answers!
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%',
              background: submitting ? '#e2e8f0' : 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
              border: 'none', borderRadius: 12,
              padding: '14px',
              fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16,
              color: submitting ? '#94a3b8' : 'var(--color-primary, #1E3A5F)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
              boxShadow: submitting ? 'none' : '0 4px 16px rgba(212,175,55,0.35)',
            }}
          >
            {submitting ? 'Posting…' : 'Post Doubt →'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────

function FieldGroup({ label, hint, error, required, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{
        display: 'block', fontFamily: 'Inter, sans-serif',
        fontWeight: 700, fontSize: 13, color: 'var(--color-primary, #1E3A5F)', marginBottom: 6,
      }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        {hint && <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 12, marginLeft: 6 }}>{hint}</span>}
      </label>
      {children}
      {error && (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#ef4444', marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  )
}

function inputStyle(hasError) {
  return {
    width: '100%', boxSizing: 'border-box',
    border: `1.5px solid ${hasError ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: 10, padding: '10px 14px',
    fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#1e293b',
    background: '#F8FAFC', outline: 'none',
  }
}

function selectStyle(hasError) {
  return {
    ...inputStyle(hasError),
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 36, cursor: 'pointer',
  }
}