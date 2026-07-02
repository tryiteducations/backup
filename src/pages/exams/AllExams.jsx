import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

function MissingExamForm() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '', body: '', govtType: 'State Govt', state: '',
    website: '', email: '', phone: '',
  })

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Missing Exam Submission: ${form.name}`)
    const body = encodeURIComponent(
      `Exam Name: ${form.name}\n` +
      `Conducting Body: ${form.body}\n` +
      `Type: ${form.govtType}\n` +
      `State (if applicable): ${form.state}\n` +
      `Official Website: ${form.website}\n` +
      `Submitted by (email): ${form.email}\n` +
      `Submitted by (phone): ${form.phone}\n`
    )
    window.location.href = `mailto:founder@tryiteducations.net?subject=${subject}&body=${body}`
    setSent(true)
  }

  if (!open) {
    return (
      <div className="mt-10 text-center bg-[var(--color-surface,#fff)] border border-dashed border-gray-300 rounded-2xl p-8">
        <p className="text-gray-500 text-sm mb-3">
          Can't find your exam? Drop the details below and we'll add it within 48 hours.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 bg-[var(--color-primary,#2D1B69)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
        >
          + Submit a Missing Exam
        </button>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="mt-10 text-center bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
        <div className="text-3xl mb-2">✅</div>
        <p className="text-emerald-700 font-semibold text-sm">
          Thanks! Your email app should have opened with the details pre-filled — just hit send.
          We'll review and add it within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 bg-[var(--color-surface,#fff)] border border-gray-200 rounded-2xl p-6 max-w-2xl mx-auto">
      <h3 className="font-bold text-[var(--color-primary,#2D1B69)] mb-4">Submit a Missing Exam</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required value={form.name} onChange={update('name')} placeholder="Exam name *"
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
        <input required value={form.body} onChange={update('body')} placeholder="Conducting body *"
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
        <select value={form.govtType} onChange={update('govtType')}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm">
          <option>State Govt</option>
          <option>Central Govt</option>
          <option>Private</option>
        </select>
        <input value={form.state} onChange={update('state')} placeholder="State (if applicable)"
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
        <input value={form.website} onChange={update('website')} placeholder="Official website"
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm sm:col-span-2" />
        <input type="email" value={form.email} onChange={update('email')} placeholder="Your email"
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
        <input value={form.phone} onChange={update('phone')} placeholder="Your phone"
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit"
          className="px-5 py-2 bg-[var(--color-accent,#F59E0B)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition">
          Send Details
        </button>
        <button type="button" onClick={() => setOpen(false)}
          className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
          Cancel
        </button>
      </div>
    </form>
  )
}

const CATEGORY_LABELS = {
  all: '🌐 All',
  govt_entrance: '🏛️ Govt Entrance',
  state_scholarship: '🗺️ State Scholarships',
  national_scholarship: '🌟 National Scholarships',
  national_scholarship_no_test: '🎖️ Merit Scholarships',
  private_olympiad: '🏆 Olympiads',
  college_entrance: '🎓 College Entrance',
  design_entrance: '🎨 Design Entrance',
  professional: '📜 Professional',
  diagnostic_not_competitive: '📊 Diagnostic',
}

const LEVEL_COLORS = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
}

export default function AllExams() {
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    fetch('/data/exams.json')
      .then(r => {
        if (!r.ok) throw new Error('fetch failed')
        return r.json()
      })
      .then(data => {
        setExams(data.exams || [])
        setTotal(data.total || (data.exams || []).length)
        setLoading(false)
      })
      .catch(() => { setLoading(false); setLoadError(true) })
  }, [])

  const filtered = exams.filter(e => {
    const matchCat = activeCategory === 'all' || e.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch = !q || e.name.toLowerCase().includes(q) || (e.body || '').toLowerCase().includes(q)
      || (e.subjects || []).some(s => s.toLowerCase().includes(q))
    return matchCat && matchSearch
  })

  const presentCategories = ['all', ...new Set(exams.map(e => e.category))]
    .filter(c => CATEGORY_LABELS[c])

  return (
    <AppLayout title="Exam Explorer">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary, #2D1B69)] mb-1">Exam Explorer</h1>
          <p className="text-gray-500 text-sm">
            {total} exams and growing - new exams added weekly
          </p>
        </div>

        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by exam name, conducting body, or subject..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent, #F59E0B)] text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap mb-7">
          {presentCategories.map(key => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === key
                  ? 'bg-[var(--color-primary, #2D1B69)] text-white border-[var(--color-primary, #2D1B69)] shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-accent, #F59E0B)] hover:text-[var(--color-primary, #2D1B69)]'
              }`}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>

        {!loading && (
          <p className="text-xs text-gray-400 mb-4">
            Showing {filtered.length} exam{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' ? ` in ${CATEGORY_LABELS[activeCategory]}` : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-[var(--color-primary, #2D1B69)] mb-2">Couldn't load exams</h3>
            <p className="text-gray-500 text-sm">
              The exam database didn't load. Please refresh the page.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔭</div>
            <h3 className="text-lg font-semibold text-[var(--color-primary, #2D1B69)] mb-2">No exams found</h3>
            <p className="text-gray-500 text-sm mb-4">
              Try a different search term or category.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all') }}
              className="px-5 py-2 bg-[var(--color-accent, #F59E0B)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(exam => (
              <button
                key={exam.id}
                onClick={() => navigate(`/exams/${exam.id}`)}
                className="text-left bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[var(--color-accent, #F59E0B)] transition-all group"
              >
                <div className="text-4xl mb-3">{exam.emoji || '📋'}</div>
                <h3 className="font-bold text-[var(--color-primary, #2D1B69)] text-sm leading-snug mb-1 group-hover:text-[var(--color-accent, #F59E0B)] transition-colors line-clamp-2">
                  {exam.name}
                </h3>
                <p className="text-xs text-gray-400 mb-1 line-clamp-1">{exam.body}</p>
                {exam.class_range && (
                  <p className="text-xs text-gray-400 mb-3">{exam.class_range}</p>
                )}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {exam.level && (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${LEVEL_COLORS[exam.level] || 'bg-gray-100 text-gray-600'}`}>
                      {exam.level}
                    </span>
                  )}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    exam.fee_display === 'Free'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {exam.fee_display}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        <MissingExamForm />
      </div>
    </AppLayout>
  )
}
