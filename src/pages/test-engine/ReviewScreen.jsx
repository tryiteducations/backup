import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { Bookmark, ChevronLeft } from 'lucide-react'

const QUESTIONS = [
  { id:1, subject:'Reasoning', text:'A train 200m long passes a 300m platform in 25 seconds. Speed in km/hr?', opts:['72 km/hr','64 km/hr','80 km/hr','56 km/hr'], correct:0, explanation:'Total = 500m. Speed = 20 m/s = 72 km/hr.' },
  { id:2, subject:'Maths',    text:'If 15% of X = 45, find X.', opts:['280','300','320','340'], correct:1, explanation:'X = 45 × 100/15 = 300.' },
  { id:3, subject:'English',  text:'Choose the correct sentence:', opts:["He don't know.","He doesn't know.","He not know.","He knowed."], correct:1, explanation:'Third person singular uses "doesn\'t" for negatives.' },
  { id:4, subject:'GK',       text:'Which article abolishes untouchability?', opts:['Article 14','Article 17','Article 21','Article 25'], correct:1, explanation:'Article 17 abolishes untouchability.' },
  { id:5, subject:'Maths',    text:'LCM of 12, 18, and 24?', opts:['48','72','36','60'], correct:1, explanation:'LCM = 72.' },
]

const FILTERS = ['All','Correct','Wrong','Skipped','Bookmarked']

export default function ReviewScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { answers = { 1:0, 2:1, 3:0, 4:1, 5:0 } } = location.state || {}

  const [filter,    setFilter]    = useState('All')
  const [expanded,  setExpanded]  = useState({})
  const [bookmarks, setBookmarks] = useState(new Set())

  const result = (q) => {
    const s = answers[q.id]
    if (s === undefined) return 'skipped'
    return s === q.correct ? 'correct' : 'wrong'
  }

  const counts = {
    All: QUESTIONS.length,
    Correct: QUESTIONS.filter(q => result(q) === 'correct').length,
    Wrong: QUESTIONS.filter(q => result(q) === 'wrong').length,
    Skipped: QUESTIONS.filter(q => result(q) === 'skipped').length,
    Bookmarked: bookmarks.size,
  }

  const filtered = QUESTIONS.filter(q => {
    const r = result(q)
    if (filter === 'All') return true
    if (filter === 'Correct') return r === 'correct'
    if (filter === 'Wrong') return r === 'wrong'
    if (filter === 'Skipped') return r === 'skipped'
    if (filter === 'Bookmarked') return bookmarks.has(q.id)
    return true
  })

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:border-[#D4AF37] transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F] font-poppins">Answer Review</h1>
            <p className="text-slate-500 text-sm">{QUESTIONS.length} Questions · SSC CGL Mock</p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all
                ${filter === f ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
              {f}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {filtered.length > 0 ? filtered.map((q, qi) => {
            const res = result(q)
            const sel = answers[q.id]
            const isExp = expanded[q.id]
            const border = res === 'correct' ? 'border-green-500' : res === 'wrong' ? 'border-red-500' : 'border-slate-200'

            return (
              <div key={q.id} className={`clay rounded-3xl p-6 border-2 ${border}`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">Q{qi + 1}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full
                      ${res === 'correct' ? 'bg-green-100 text-green-700' : res === 'wrong' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                      {res === 'correct' ? '✅ Correct' : res === 'wrong' ? '❌ Wrong' : '⏭️ Skipped'}
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full">{q.subject}</span>
                  </div>
                  <button
                    onClick={() => setBookmarks(p => { const n = new Set(p); p.has(q.id) ? n.delete(q.id) : n.add(q.id); return n })}
                    className={`flex-shrink-0 transition-colors ${bookmarks.has(q.id) ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-[#D4AF37]'}`}>
                    <Bookmark size={20} fill={bookmarks.has(q.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <p className="text-[#1E293B] font-medium mb-4 leading-relaxed">{q.text}</p>

                {/* Options (read-only) */}
                <div className="flex flex-col gap-2 mb-4">
                  {q.opts.map((opt, i) => {
                    const isCorrect  = i === q.correct
                    const isUserSel  = i === sel
                    let cls = 'border-slate-200 bg-slate-50 opacity-60'
                    if (isCorrect) cls = 'border-green-500 bg-green-50'
                    else if (isUserSel && !isCorrect) cls = 'border-red-500 bg-red-50'
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${cls}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                          ${isCorrect ? 'bg-green-500 text-white' : isUserSel ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          {['A','B','C','D'][i]}
                        </span>
                        <span className="text-sm">{opt}</span>
                        {isCorrect && <span className="ml-auto text-green-600 text-xs font-bold">✓ Correct</span>}
                        {isUserSel && !isCorrect && <span className="ml-auto text-red-500 text-xs font-bold">Your answer</span>}
                      </div>
                    )
                  })}
                </div>

                <button onClick={() => setExpanded(p => ({ ...p, [q.id]: !p[q.id] }))}
                  className="text-[#D4AF37] text-sm font-semibold hover:underline">
                  {isExp ? '▲ Hide Explanation' : '▼ Show Explanation'}
                </button>
                {isExp && (
                  <div className="mt-3 bg-slate-50 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed animate-slide-up">
                    {q.explanation}
                  </div>
                )}
              </div>
            )
          }) : (
            <div className="clay rounded-3xl p-12 text-center">
              <p className="text-5xl mb-3">🔍</p>
              <p className="text-slate-500">No questions match this filter.</p>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/test-engine')} className="btn-gold w-full py-4 rounded-2xl font-bold text-lg mt-6 mb-4">
          Take Another Test →
        </button>
      </div>
    </AppLayout>
  )
}
