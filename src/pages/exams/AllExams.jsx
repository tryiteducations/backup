import { useState, useEffect, useCallback } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useNavigate } from 'react-router-dom'
import ExamDropRequest from '../../components/ExamDropRequest'

export default function AllExams() {
  const navigate  = useNavigate()
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [exams, setExams]       = useState([])
  const [fuseReady, setFuse]    = useState(null)
  const [showDrop, setShowDrop] = useState(false)

  // Load exams + Fuse on mount
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res  = await fetch('/data/exams.json')
        const data = await res.json()
        if (!mounted) return
        setExams(data)
        const { default: Fuse } = await import('fuse.js')
        const f = new Fuse(data, {
          keys: [{ name:'name', weight:0.5 }, { name:'tags', weight:0.35 }, { name:'body', weight:0.15 }],
          threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2, includeScore: true,
        })
        if (mounted) setFuse(f)
      } catch {
        // File not generated yet — use small inline set
        if (mounted) setExams([])
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const search = useCallback((q) => {
    if (!q.trim() || q.length < 2) { setResults([]); return }
    setLoading(true)
    if (fuseReady) setResults(fuseReady.search(q, { limit: 10 }).map(r => r.item))
    else setResults(exams.filter(e => e.name.toLowerCase().includes(q.toLowerCase())).slice(0,10))
    setLoading(false)
  }, [fuseReady, exams])

  useEffect(() => {
    const t = setTimeout(() => search(query), 200)
    return () => clearTimeout(t)
  }, [query, search])

  const list = query.length >= 2 ? results : exams.filter(e => e.is_popular).slice(0, 20)

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">🎯 All Exams</h1>
      <p className="text-slate-500 text-sm mb-5">
        {exams.length > 0 ? `${exams.length.toLocaleString()}+ exam pathways` : 'Loading exam database...'} ·
        India's most complete exam search
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search 1,10,000+ exams... (try 'UPCS' for UPSC, 'ssc cg' for SSC CGL)"
          className="clay-input pl-12 py-4 text-base"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin-slow" />
        )}
      </div>

      {/* No results → show drop request */}
      {query.length >= 2 && results.length === 0 && !loading && (
        <div className="mb-5 space-y-3">
          <p className="text-slate-500 text-sm">No results for "{query}"</p>
          <ExamDropRequest compact />
        </div>
      )}

      {/* Results / Popular list */}
      <div className="clay rounded-3xl overflow-hidden">
        <div className="bg-[#1E3A5F] px-5 py-3 flex justify-between items-center">
          <span className="text-[#D4AF37] font-bold font-poppins text-sm">
            {query.length >= 2 ? `Results for "${query}"` : 'Popular Exams'}
          </span>
          <span className="text-white/40 text-xs">{list.length} shown</span>
        </div>
        {list.length === 0 && !query && (
          <div className="p-8 text-center text-slate-400">
            <p className="text-2xl mb-2">⏳</p>
            <p className="text-sm">Loading exam database...<br/>Run <code>node scripts/generateMockExams.js</code> to generate it.</p>
          </div>
        )}
        {list.map((exam, i) => (
          <div key={exam.id} onClick={() => navigate(`/exams/${exam.id}/universe`)}
            className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center
              text-[#D4AF37] font-bold text-xs font-poppins flex-shrink-0">
              {exam.name.slice(0,3).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1E3A5F] text-sm font-poppins truncate">{exam.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">{exam.body} · {exam.category}</p>
            </div>
            {exam.is_popular && (
              <span className="text-[10px] bg-[#D4AF37]/20 text-[#1E3A5F] px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                Popular
              </span>
            )}
            <span className="text-[#D4AF37] text-lg flex-shrink-0">›</span>
          </div>
        ))}
      </div>

      {/* Always show drop request at bottom */}
      <div className="mt-6 flex justify-center">
        {showDrop
          ? <ExamDropRequest onClose={() => setShowDrop(false)} />
          : <button onClick={() => setShowDrop(true)}
              className="flex items-center gap-2 border-2 border-dashed border-[#D4AF37]/50 text-[#D4AF37]
                rounded-2xl px-6 py-3 font-semibold text-sm hover:border-[#D4AF37] transition-colors">
              📬 Don't see your exam? Request it →
            </button>
        }
      </div>
    </AppLayout>
  )
}
