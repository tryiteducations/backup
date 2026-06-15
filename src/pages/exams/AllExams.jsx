import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const CATEGORY_LABELS = {
  all: '🌐 All',
  govt_central: '🏛️ Central Govt',
  govt_state: '🗺️ State Govt',
  banking: '🏦 Banking',
  railways: '🚂 Railways',
  defence: '⚔️ Defence',
  medical: '🩺 Medical',
  engineering: '⚙️ Engineering',
  engineering_pg: '🎓 Engg PG',
  teaching: '📚 Teaching',
  school_competitive: '🏫 School',
  scholarship: '🌟 Scholarship',
  professional_cert: '📜 Professional',
  foreign_language: '🌍 Language',
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

  useEffect(() => {
    fetch('/data/exams.json')
      .then(r => r.json())
      .then(data => {
        setExams(data.exams || [])
        setTotal(data.total || (data.exams || []).length)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = exams.filter(e => {
    const matchCat = activeCategory === 'all' || e.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch = !q || e.name.toLowerCase().includes(q) || (e.body || '').toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <AppLayout title="Exam Explorer">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary, #1E3A5F)] mb-1">Exam Explorer</h1>
          <p className="text-gray-500 text-sm">
            {total} exams and growing — new exams added weekly
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by exam name or conducting body..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)] text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-7">
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

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-gray-400 mb-4">
            Showing {filtered.length} exam{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' ? ` in ${CATEGORY_LABELS[activeCategory]}` : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔭</div>
            <h3 className="text-lg font-semibold text-[var(--color-primary, #1E3A5F)] mb-2">No exams found</h3>
            <p className="text-gray-500 text-sm mb-4">
              Try a different search term or category.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all') }}
              className="px-5 py-2 bg-[var(--color-accent, #D4AF37)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-light, #E8C84A)] transition"
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
                className="text-left bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[var(--color-accent, #D4AF37)] transition-all group"
              >
                <div className="text-4xl mb-3">{exam.emoji || '📋'}</div>
                <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-sm leading-snug mb-1 group-hover:text-[var(--color-accent, #D4AF37)] transition-colors line-clamp-2">
                  {exam.name}
                </h3>
                <p className="text-xs text-gray-400 mb-3 line-clamp-1">{exam.body}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {exam.level && (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${LEVEL_COLORS[exam.level] || 'bg-gray-100 text-gray-600'}`}>
                      {exam.level}
                    </span>
                  )}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    !exam.price_inr || exam.price_inr === 0
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {!exam.price_inr || exam.price_inr === 0 ? 'Free' : `₹${exam.price_inr}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}