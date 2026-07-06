// src/pages/institution/InstitutionConsent.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const MOCK_STUDENTS = [
  { id: 's1', name: 'Priya R.', batch: 'UPSC Morning Batch', consented: true, consentDate: '2 weeks ago' },
  { id: 's2', name: 'Karthik M.', batch: 'SSC CGL Evening', consented: true, consentDate: '1 week ago' },
  { id: 's3', name: 'Anjali S.', batch: 'UPSC Morning Batch', consented: false, consentDate: null },
  { id: 's4', name: 'Rahul V.', batch: 'TNPSC Group 1', consented: true, consentDate: '3 days ago' },
  { id: 's5', name: 'Deepika N.', batch: 'SSC CGL Evening', consented: false, consentDate: null },
]

export default function InstitutionConsent() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const isDark = theme?.isDark || false
  const p = theme?.primary || '#1E3A5F'
  const a = theme?.accent || '#C9A84C'
  const t = theme?.text || '#1E293B'
  const m = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const c = theme?.surface || '#FFFFFF'
  const b = theme?.border || '#E2E8F0'

  const [filter, setFilter] = useState('all')

  const filtered = MOCK_STUDENTS.filter(s => {
    if (filter === 'consented') return s.consented
    if (filter === 'not-consented') return !s.consented
    return true
  })

  const consentedCount = MOCK_STUDENTS.filter(s => s.consented).length

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Poppins,sans-serif' }}>
      <div style={{ background: c, borderBottom: `1px solid ${b}`, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10,
        boxShadow: `0 4px 24px ${a}18` }}>
        <button onClick={() => nav('/institution')} style={{ background: 'transparent', border: `1px solid ${a}55`,
          borderRadius: 10, padding: '6px 14px', color: m, fontSize: 13, cursor: 'pointer' }}>← Back</button>
        <div>
          <h1 style={{ color: t, fontSize: 18, fontWeight: 800, margin: 0, textShadow: `0 0 20px ${a}50` }}>🔐 Student Data Consent</h1>
          <p style={{ color: m, fontSize: 11, margin: 0 }}>Students who consented to share their progress with your institution</p>
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: 680, margin: '0 auto' }}>
        {/* Summary */}
        <div style={{ background: c, border: `1px solid ${b}`, borderRadius: 16, padding: 18, marginBottom: 20,
          boxShadow: `0 0 24px ${a}12`, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <p style={{ color: t, fontWeight: 800, fontSize: 24, margin: 0 }}>{MOCK_STUDENTS.length}</p>
            <p style={{ color: m, fontSize: 11, margin: 0 }}>Total Students</p>
          </div>
          <div>
            <p style={{ color: '#16A34A', fontWeight: 800, fontSize: 24, margin: 0 }}>{consentedCount}</p>
            <p style={{ color: m, fontSize: 11, margin: 0 }}>Consented</p>
          </div>
          <div>
            <p style={{ color: '#EF4444', fontWeight: 800, fontSize: 24, margin: 0 }}>{MOCK_STUDENTS.length - consentedCount}</p>
            <p style={{ color: m, fontSize: 11, margin: 0 }}>Not Consented</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'consented', label: '✅ Consented' },
            { id: 'not-consented', label: '⏳ Pending' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '7px 16px', borderRadius: 20,
              border: filter === f.id ? `2px solid ${a}` : `1.5px solid ${b}`,
              background: filter === f.id ? a : c,
              color: filter === f.id ? '#fff' : t,
              fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.18s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Student list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(s => (
            <div key={s.id} style={{ background: c, border: `1px solid ${b}`, borderRadius: 14, padding: 14,
              display: 'flex', alignItems: 'center', gap: 12, boxShadow: `0 0 16px ${a}08` }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,${p},${a})`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>
                {s.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: t, fontWeight: 700, fontSize: 13.5, margin: '0 0 2px' }}>{s.name}</p>
                <p style={{ color: m, fontSize: 11, margin: 0 }}>{s.batch}</p>
              </div>
              {s.consented ? (
                <span style={{ background: '#16A34A20', color: '#16A34A', fontSize: 10, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 20 }}>✅ {s.consentDate}</span>
              ) : (
                <span style={{ background: '#EF444420', color: '#EF4444', fontSize: 10, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 20 }}>⏳ Pending</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: '14px 16px', borderRadius: 12,
          background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', border: `1px solid ${b}` }}>
          <p style={{ color: m, fontSize: 12, margin: 0, lineHeight: 1.5 }}>
            Students see a consent prompt when they join a batch at your institution. Only consented students' progress data is visible to you - this protects student privacy and is required for compliance.
          </p>
        </div>
      </div>
    </div>
  )
}
