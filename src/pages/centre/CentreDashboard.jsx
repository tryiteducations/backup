import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AppLayout from '../../components/layout/AppLayout'

// ─── Sample / placeholder data ───────────────────────────────────────────────

const SAMPLE_TESTS = [
  { id: 1, name: 'SSC CGL Mock #1',    subject: 'General Studies', date: '2025-06-10', students: 24, avgScore: '71%' },
  { id: 2, name: 'Quant Speed Test',   subject: 'Quantitative Aptitude', date: '2025-06-14', students: 18, avgScore: '64%' },
  { id: 3, name: 'English Full Mock',  subject: 'English Language', date: '2025-06-18', students: 31, avgScore: '68%' },
]

const SAMPLE_STUDENTS = [
  { id: 1, name: 'Aarav Sharma',   email: 'aarav@example.com',   exams: ['SSC CGL', 'SSC CHSL'], progress: 72 },
  { id: 2, name: 'Priya Mehta',    email: 'priya@example.com',   exams: ['IBPS PO'],             progress: 58 },
  { id: 3, name: 'Rohan Das',      email: 'rohan@example.com',   exams: ['RRB NTPC'],            progress: 81 },
  { id: 4, name: 'Sneha Pillai',   email: 'sneha@example.com',   exams: ['SSC CGL'],             progress: 45 },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ emoji, value, label, hint }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-1" style={{ background: 'var(--color-surface, #FFFFFF)', boxShadow: '0 1px 8px rgba(30,58,95,0.07)' }}>
      <span className="text-2xl">{emoji}</span>
      <span className="text-2xl font-bold mt-1" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))', fontFamily: 'Poppins, sans-serif' }}>{value}</span>
      <span className="text-xs font-medium" style={{ color: 'var(--subtext-color, #64748B)', fontFamily: 'Inter, sans-serif' }}>{label}</span>
      {hint && <span className="text-xs mt-1" style={{ color: 'var(--subtext-color, #64748B)', fontFamily: 'Inter, sans-serif' }}>{hint}</span>}
    </div>
  )
}

function EmptyState({ icon, title, body, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-5xl">{icon}</span>
      <p className="text-base font-semibold" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))', fontFamily: 'Poppins, sans-serif' }}>{title}</p>
      <p className="text-sm text-center max-w-xs" style={{ color: 'var(--subtext-color, #64748B)', fontFamily: 'Inter, sans-serif' }}>{body}</p>
      {action && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-md"
          style={{ background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', color: 'var(--color-primary-dark, #0F2140)', fontFamily: 'Poppins, sans-serif' }}
        >
          {action}
        </button>
      )}
    </div>
  )
}

function TestsTab({ tests, onCreateTest }) {
  if (!tests.length) {
    return (
      <EmptyState
        icon="📋"
        title="No tests created yet"
        body="Create your first test and share it with your students to start tracking performance."
        action="+ Create Test"
        onAction={onCreateTest}
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border, #E2E8F0)' }}>
            {['Test Name', 'Subject', 'Date', 'Students', 'Avg Score'].map(h => (
              <th key={h} className="text-left pb-3 pr-4 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--subtext-color, #64748B)' }}>{h}</th>
            ))}
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {tests.map((t, i) => (
            <tr
              key={t.id}
              className="transition-colors hover:bg-slate-50"
              style={{ borderBottom: i < tests.length - 1 ? '1px solid var(--color-bg-muted-2, #F1F5F9)' : 'none' }}
            >
              <td className="py-3.5 pr-4 font-medium" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))' }}>{t.name}</td>
              <td className="py-3.5 pr-4" style={{ color: 'var(--subtext-color, #64748B)' }}>{t.subject}</td>
              <td className="py-3.5 pr-4" style={{ color: 'var(--subtext-color, #64748B)' }}>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              <td className="py-3.5 pr-4">
                <span className="flex items-center gap-1" style={{ color: 'var(--subtext-color, #64748B)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {t.students}
                </span>
              </td>
              <td className="py-3.5 pr-4">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'var(--color-success-bg, #F0FDF4)', color: 'var(--color-success, #16A34A)' }}>{t.avgScore}</span>
              </td>
              <td className="py-3.5 text-right">
                <button className="text-xs px-3 py-1 rounded-lg border transition-colors hover:bg-slate-50" style={{ borderColor: 'var(--color-border, #E2E8F0)', color: 'var(--subtext-color, #64748B)' }}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, value))
  const color = pct >= 70 ? 'var(--color-success, #16A34A)' : pct >= 45 ? 'var(--color-accent, #D4AF37)' : 'var(--color-error, #EF4444)'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--color-bg-muted-2, #E2E8F0)' }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-medium w-8 text-right" style={{ color, fontFamily: 'Inter, sans-serif' }}>{pct}%</span>
    </div>
  )
}

function StudentsTab({ students, centreCode }) {
  if (!students.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <span className="text-5xl">👥</span>
        <p className="text-base font-semibold" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))', fontFamily: 'Poppins, sans-serif' }}>No students yet</p>
        <p className="text-sm text-center max-w-xs" style={{ color: 'var(--subtext-color, #64748B)', fontFamily: 'Inter, sans-serif' }}>
          Share your Centre code with students so they can join.
        </p>
        <div className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(var(--color-accent-rgb, 212,175,55), 0.12)', border: '1.5px solid rgba(var(--color-accent-rgb, 212,175,55), 0.35)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--subtext-color, #64748B)', fontFamily: 'Inter, sans-serif' }}>Centre code</span>
          <span className="text-sm font-bold tracking-widest" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))', fontFamily: 'Poppins, sans-serif' }}>{centreCode || 'TRYIT001'}</span>
          <button
            onClick={() => navigator.clipboard?.writeText(centreCode || 'TRYIT001')}
            className="text-xs px-2 py-0.5 rounded-lg transition-colors hover:opacity-70"
            style={{ background: 'var(--color-accent, #D4AF37)', color: 'var(--color-primary-dark, #0F2140)', fontFamily: 'Inter, sans-serif' }}
          >
            Copy
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border, #E2E8F0)' }}>
            {['Student', 'Email', 'Enrolled Exams', 'Progress'].map(h => (
              <th key={h} className="text-left pb-3 pr-4 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-muted, #94A3B8)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr
              key={s.id}
              className="transition-colors hover:bg-slate-50"
              style={{ borderBottom: i < students.length - 1 ? '1px solid var(--color-bg-muted-2, #F1F5F9)' : 'none' }}
            >
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--color-bg-muted, #EFF6FF)', color: 'var(--color-primary, #1E3A5F)' }}>
                    {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="font-medium" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))' }}>{s.name}</span>
                </div>
              </td>
              <td className="py-3.5 pr-4" style={{ color: 'var(--subtext-color, #64748B)' }}>{s.email}</td>
              <td className="py-3.5 pr-4">
                <div className="flex flex-wrap gap-1">
                  {s.exams.map(ex => (
                    <span key={ex} className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'var(--color-bg-muted-2, #F1F5F9)', color: 'var(--color-muted, #64748B)' }}>{ex}</span>
                  ))}
                </div>
              </td>
              <td className="py-3.5 pr-4 min-w-[120px]">
                <ProgressBar value={s.progress} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CentreDashboard() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('tests')

  // Derive display values — use real user fields where they exist, fall back gracefully
  const institutionName = user?.institutionName || user?.name || 'Your Coaching Centre'
  const studentCount    = user?.studentCount    || SAMPLE_STUDENTS.length
  const centreRank      = user?.centreRank      || '—'
  const testsThisMonth  = user?.testsCompleted  || SAMPLE_TESTS.length
  const avgScore        = user?.avgScore        ? `${user.avgScore}%` : '68%'
  const centreCode      = user?.userId          || 'TRYIT001'

  // For demo, use sample data; in production these would come from API/context
  const tests    = SAMPLE_TESTS
  const students = SAMPLE_STUDENTS

  const hasData = tests.length > 0

  const STATS = [
    { emoji: '📝', value: testsThisMonth || 0, label: 'Tests This Month', hint: !hasData ? 'Create your first test to see stats' : null },
    { emoji: '👥', value: studentCount,        label: 'Active Students',   hint: studentCount === 0 ? 'Share your code to add students' : null },
    { emoji: '🏆', value: centreRank === '—' ? '—' : `#${centreRank}`, label: 'Centre Rank India', hint: centreRank === '—' ? 'Rank unlocks after 10 tests' : null },
    { emoji: '📊', value: avgScore,            label: 'Avg Score',         hint: null },
  ]

  function handleCreateTest() {
    navigate('/centre/create-test')
  }

  const TABS = [
    { id: 'tests',    label: 'Tests' },
    { id: 'students', label: 'Students' },
  ]

  return (
    <AppLayout title="Centre Dashboard">
      <div className="min-h-screen" style={{ background: 'var(--color-bg, #F8FAFC)' }}>

        {/* ── Header banner ──────────────────────────────────────── */}
        <div
          className="px-6 py-6 sm:px-8"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-dark, #0F2140) 0%, var(--color-primary, #1E3A5F) 100%)' }}
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1
                className="text-xl sm:text-2xl font-bold"
                style={{ color: 'var(--color-accent, #D4AF37)', fontFamily: 'Poppins, sans-serif' }}
              >
                {institutionName}
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter, sans-serif' }}>
                {studentCount} students
                {centreRank !== '—' && <> · All India Rank <span style={{ color: 'var(--color-accent-light, #E8C84A)' }}>#{centreRank}</span> Centre</>}
                {centreRank === '—' && <> · Centre rank unlocks after 10 tests</>}
              </p>
            </div>
            <button
              onClick={handleCreateTest}
              className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
                color: 'var(--color-primary-dark, #0F2140)',
                fontFamily: 'Poppins, sans-serif',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Test
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-6">

          {/* ── Stats row ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* ── Tabs + content ─────────────────────────────────────── */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface, #FFFFFF)', boxShadow: '0 1px 8px rgba(30,58,95,0.07)' }}>

            {/* Tab bar */}
            <div className="flex items-center justify-between px-5 pt-4 pb-0" style={{ borderBottom: '1px solid var(--color-border, #E2E8F0)' }}>
              <div className="flex gap-1">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all focus:outline-none"
                    style={{
                      color: activeTab === tab.id ? 'var(--heading-color, var(--color-text, #1E3A5F))' : 'var(--subtext-color, #64748B)',
                      borderBottom: activeTab === tab.id ? '2px solid var(--color-accent, #D4AF37)' : '2px solid transparent',
                      fontFamily: 'Inter, sans-serif',
                      background: 'transparent',
                      marginBottom: '-1px',
                    }}
                  >
                    {tab.label}
                    {tab.id === 'tests' && tests.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs" style={{ background: 'var(--color-bg-muted-2, #F1F5F9)', color: 'var(--subtext-color, #64748B)' }}>{tests.length}</span>
                    )}
                    {tab.id === 'students' && students.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs" style={{ background: 'var(--color-bg-muted-2, #F1F5F9)', color: 'var(--subtext-color, #64748B)' }}>{students.length}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Create test button in tab bar (desktop shortcut) */}
              {activeTab === 'tests' && (
                <button
                  onClick={handleCreateTest}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:shadow mb-1"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', color: 'var(--color-primary-dark, #0F2140)', fontFamily: 'Poppins, sans-serif' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Create Test
                </button>
              )}
            </div>

            {/* Tab content */}
            <div className="p-5">
              {activeTab === 'tests' && (
                <TestsTab tests={tests} onCreateTest={handleCreateTest} />
              )}
              {activeTab === 'students' && (
                <StudentsTab students={students} centreCode={centreCode} />
              )}
            </div>
          </div>

          {/* ── Centre code footer chip ────────────────────────────── */}
          <div className="flex items-center justify-center gap-3 py-2">
            <span className="text-xs" style={{ color: 'var(--subtext-color, #64748B)', fontFamily: 'Inter, sans-serif' }}>Your Centre code:</span>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(var(--color-accent-rgb, 212, 175, 55), 0.12)', border: '1.5px solid rgba(var(--color-accent-rgb, 212, 175, 55), 0.35)' }}
            >
              <span className="text-sm font-bold tracking-widest" style={{ color: 'var(--heading-color, var(--color-text, #1E3A5F))', fontFamily: 'Poppins, sans-serif' }}>{centreCode}</span>
              <button
                onClick={() => navigator.clipboard?.writeText(centreCode)}
                className="text-xs px-2 py-0.5 rounded-md transition-opacity hover:opacity-70"
                style={{ background: 'var(--color-accent, #D4AF37)', color: 'var(--color-primary-dark, #0F2140)', fontFamily: 'Inter, sans-serif' }}
              >
                Copy
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}