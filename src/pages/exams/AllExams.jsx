import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

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

function PublicHeader({ navigate }) {
  return (
    <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div style={{ width:32, height:32, borderRadius:8, background:'#2D1B69',
            display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14 }}>T</div>
          <div style={{ lineHeight:1.1 }}>
            <div style={{ fontWeight:800, fontSize:15, color:'#2D1B69', fontFamily:'Plus Jakarta Sans,sans-serif' }}>TryIT</div>
            <div style={{ fontSize:10, color:'#64748B' }}>Educations</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-gray-300 transition">
            Login
          </button>
          <button onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
            style={{ background:'#2D1B69' }}>
            Get Started →
          </button>
        </div>
      </div>
    </div>
  )
}

function ExamsContent({ navigate }) {
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
    </div>
  )
}

export default function AllExams() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Logged-in users get the full dashboard experience.
  // Anonymous visitors (e.g. from the landing page nav) get a lightweight public header instead of being bounced to /login.
  if (loading) return null
  if (user) {
    return (
      <AppLayout title="Exam Explorer">
        <ExamsContent navigate={navigate} />
      </AppLayout>
    )
  }
  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC' }}>
      <PublicHeader navigate={navigate} />
      <ExamsContent navigate={navigate} />
    </div>
  )
}
