import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'examRequests'

export default function ExamDropRequest({ compact = false, onClose }) {
  const [form, setForm] = useState({
    examName: '', conductingBody: '', officialWebsite: '', expectedDate: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(!compact)

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = () => {
    if (!form.examName.trim()) { setError('Exam name is required.'); return }
    // Dedup check
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const isDup = existing.some(
      e => e.examName.toLowerCase() === form.examName.toLowerCase().trim()
    )
    if (isDup) {
      setError('This exam was already requested! We are reviewing it.')
      return
    }
    const req = {
      id: `req-${Date.now()}`,
      ...form,
      examName: form.examName.trim(),
      requestedAt: new Date().toISOString(),
      status: 'pending',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, req]))
    setSubmitted(true)
    setError('')
    setTimeout(() => { onClose?.(); setSubmitted(false) }, 3500)
  }

  if (compact && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none', border: '1.5px dashed #D4AF37', borderRadius: 12,
          padding: '10px 16px', cursor: 'pointer', color: '#D4AF37',
          fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <span>📬</span> Don't see your exam? Request it here →
      </button>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#fff', borderRadius: 20,
        border: '1.5px solid rgba(212,175,55,0.4)',
        padding: 24, boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        maxWidth: 440, width: '100%',
      }}
    >
      {!submitted ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700,
              color: '#1E3A5F', fontSize: 16 }}>
              📬 Request a New Exam
            </h3>
            {compact && (
              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8',
                  fontSize: 20, cursor: 'pointer' }}>×</button>
            )}
          </div>
          <p style={{ color: '#64748B', fontSize: 13, marginBottom: 16 }}>
            We add requested exams within <strong>24 hours</strong>.
          </p>
          {[
            { key: 'examName', label: 'Exam Name *', placeholder: 'e.g. TSPSC Group 2', required: true },
            { key: 'conductingBody', label: 'Conducting Body', placeholder: 'e.g. TSPSC' },
            { key: 'officialWebsite', label: 'Official Website', placeholder: 'https://tspsc.gov.in' },
            { key: 'expectedDate', label: 'Expected Exam Date', placeholder: 'e.g. August 2026' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#1E3A5F',
                fontSize: 12, marginBottom: 4 }}>{f.label}</label>
              <input value={form[f.key]}
                onChange={e => upd(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10,
                  border: `1.5px solid ${f.key === 'examName' && error ? '#EF4444' : '#E2E8F0'}`,
                  fontSize: 13, fontFamily: 'Inter,sans-serif',
                  outline: 'none', background: '#F8FAFC', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#D4AF37'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>
          ))}
          {error && <p style={{ color: '#EF4444', fontSize: 12, marginBottom: 10 }}>{error}</p>}
          <button onClick={submit} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily: 'Poppins,sans-serif', fontWeight: 700,
            fontSize: 14, color: '#1E3A5F', cursor: 'pointer',
          }}>
            Submit Request →
          </button>
        </>
      ) : (
        <motion.div initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, color: '#1E3A5F' }}>
            Request Sent!
          </h3>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>
            <strong>{form.examName}</strong> will be added within <strong>24 hours</strong>.
            We'll notify you when it's live!
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
