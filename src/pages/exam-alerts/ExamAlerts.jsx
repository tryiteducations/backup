import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

// Hardcoded sample alerts — pulled from common exam names
const SAMPLE_ALERTS = [
  {
    id: 'ssc-cgl-2025',
    examId: 'ssc-cgl',
    name: 'SSC CGL 2025',
    emoji: '🏛️',
    category: 'govt_central',
    notificationDate: '2025-06-15',
    applicationStart: '2025-07-01',
    applicationDeadline: '2025-07-31',
    examDate: '2025-09-10',
    vacancies: '17,000+',
    status: 'upcoming',
  },
  {
    id: 'ibps-po-2025',
    examId: 'ibps-po',
    name: 'IBPS PO 2025',
    emoji: '🏦',
    category: 'banking',
    notificationDate: '2025-07-20',
    applicationStart: '2025-08-01',
    applicationDeadline: '2025-08-21',
    examDate: '2025-10-04',
    vacancies: '4,455',
    status: 'upcoming',
  },
  {
    id: 'rrb-ntpc-2025',
    examId: 'rrb-ntpc',
    name: 'RRB NTPC 2025',
    emoji: '🚂',
    category: 'railways',
    notificationDate: '2025-05-01',
    applicationStart: '2025-05-10',
    applicationDeadline: '2025-06-09',
    examDate: '2025-08-15',
    vacancies: '11,558',
    status: 'applying',
  },
  {
    id: 'neet-ug-2026',
    examId: 'neet-ug',
    name: 'NEET UG 2026',
    emoji: '🩺',
    category: 'medical',
    notificationDate: '2025-12-01',
    applicationStart: '2026-01-01',
    applicationDeadline: '2026-01-31',
    examDate: '2026-05-03',
    vacancies: '1,09,000+',
    status: 'upcoming',
  },
  {
    id: 'upsc-cse-2026',
    examId: 'upsc-cse',
    name: 'UPSC CSE 2026',
    emoji: '🏛️',
    category: 'govt_central',
    notificationDate: '2026-02-05',
    applicationStart: '2026-02-05',
    applicationDeadline: '2026-02-25',
    examDate: '2026-05-24',
    vacancies: '979',
    status: 'upcoming',
  },
  {
    id: 'gate-2026',
    examId: 'gate',
    name: 'GATE 2026',
    emoji: '⚙️',
    category: 'engineering_pg',
    notificationDate: '2025-08-28',
    applicationStart: '2025-09-01',
    applicationDeadline: '2025-10-10',
    examDate: '2026-02-01',
    vacancies: 'M.Tech / PhD Admissions',
    status: 'upcoming',
  },
  {
    id: 'sbi-po-2025',
    examId: 'sbi-po',
    name: 'SBI PO 2025',
    emoji: '🏦',
    category: 'banking',
    notificationDate: '2025-09-01',
    applicationStart: '2025-09-10',
    applicationDeadline: '2025-10-01',
    examDate: '2025-11-22',
    vacancies: '2,000',
    status: 'upcoming',
  },
  {
    id: 'ctet-dec-2025',
    examId: 'ctet',
    name: 'CTET December 2025',
    emoji: '📚',
    category: 'teaching',
    notificationDate: '2025-09-20',
    applicationStart: '2025-10-01',
    applicationDeadline: '2025-10-25',
    examDate: '2025-12-14',
    vacancies: 'TET Certification',
    status: 'upcoming',
  },
]

const CATEGORY_LABELS = {
  all: '🌐 All',
  govt_central: '🏛️ Central Govt',
  banking: '🏦 Banking',
  railways: '🚂 Railways',
  medical: '🩺 Medical',
  engineering_pg: '⚙️ Engineering',
  teaching: '📚 Teaching',
}

const STATUS_CONFIG = {
  upcoming: { label: 'Notification Upcoming', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  applying: { label: 'Applications Open', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  closed: { label: 'Applications Closed', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
}

const formatDate = (iso) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return iso }
}

const STORAGE_KEY = 'exam_alert_subscriptions'

export default function ExamAlerts() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [subscribed, setSubscribed] = useState({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setSubscribed(JSON.parse(saved))
    } catch {}
  }, [])

  const toggleSubscribe = (alertId) => {
    setSubscribed(prev => {
      const updated = { ...prev, [alertId]: !prev[alertId] }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  const filtered = SAMPLE_ALERTS.filter(a =>
    activeCategory === 'all' || a.category === activeCategory
  )

  const subscribedCount = Object.values(subscribed).filter(Boolean).length

  return (
    <AppLayout title="Exam Alerts">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary, #1E3A5F)] mb-1">Exam Alerts 🔔</h1>
            <p className="text-gray-500 text-sm">Never miss an application deadline</p>
          </div>
          {subscribedCount > 0 && (
            <div className="flex items-center gap-2 bg-[var(--color-accent, #D4AF37)]/10 border border-[var(--color-accent, #D4AF37)]/30 px-4 py-2 rounded-xl">
              <span className="text-[var(--color-accent, #D4AF37)] text-lg">🔔</span>
              <span className="text-sm font-semibold text-[var(--color-primary, #1E3A5F)]">
                Tracking {subscribedCount} exam{subscribedCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === key
                  ? 'bg-[var(--color-primary, #1E3A5F)] text-white border-[var(--color-primary, #1E3A5F)] shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-accent, #D4AF37)] hover:text-[var(--color-primary, #1E3A5F)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Alert cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-3">🔕</div>
            <h3 className="text-lg font-semibold text-[var(--color-primary, #1E3A5F)] mb-2">No alerts in this category</h3>
            <button onClick={() => setActiveCategory('all')} className="px-5 py-2 bg-[var(--color-accent, #D4AF37)] text-white rounded-xl text-sm font-semibold">
              View All Alerts
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(alert => {
              const status = STATUS_CONFIG[alert.status] || STATUS_CONFIG.upcoming
              const isSub = !!subscribed[alert.id]

              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-2xl shadow-sm border transition-all ${
                    isSub ? 'border-[var(--color-accent, #D4AF37)] ring-1 ring-[var(--color-accent, #D4AF37)]/20' : 'border-gray-100'
                  }`}
                >
                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{alert.emoji}</span>
                        <div>
                          <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-base leading-tight">{alert.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                            {alert.vacancies && (
                              <span className="text-xs text-gray-400">{alert.vacancies} posts</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Subscribe toggle */}
                      <button
                        onClick={() => toggleSubscribe(alert.id)}
                        className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isSub
                            ? 'bg-[var(--color-accent, #D4AF37)] text-white shadow'
                            : 'bg-gray-100 text-gray-600 hover:bg-[var(--color-primary, #1E3A5F)] hover:text-white'
                        }`}
                      >
                        {isSub ? '🔔 Tracking' : '🔕 Track'}
                      </button>
                    </div>

                    {/* Date grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: '📢 Notification', value: formatDate(alert.notificationDate) },
                        { label: '📝 Apply From', value: formatDate(alert.applicationStart) },
                        { label: '⏰ Last Date', value: formatDate(alert.applicationDeadline) },
                        { label: '📅 Exam Date', value: formatDate(alert.examDate) },
                      ].map(item => (
                        <div key={item.label} className="bg-[#F8FAFC] rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                          <p className="text-xs font-semibold text-[var(--color-primary, #1E3A5F)]">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Sub confirmation */}
                    {isSub && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium flex items-center gap-2">
                        <span>🔔</span>
                        <span>You'll be notified when applications open for {alert.name}</span>
                      </div>
                    )}

                    {/* Footer link */}
                    <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end">
                      <button
                        onClick={() => navigate(`/exams/${alert.examId}`)}
                        className="text-xs text-[var(--color-primary, #1E3A5F)] font-semibold hover:text-[var(--color-accent, #D4AF37)] transition"
                      >
                        View Exam Profile →
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-300 mt-8">
          Dates are indicative. Always verify from the official notification.
        </p>
      </div>
    </AppLayout>
  )
}