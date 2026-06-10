import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'

const QUESTIONS = [
  { id:1, subject:'Reasoning', text:'A train 200m long passes a 300m platform in 25 seconds. Speed in km/hr?', opts:['72 km/hr','64 km/hr','80 km/hr','56 km/hr'], correct:0, explanation:'Total = 200+300 = 500m. Speed = 500/25 = 20 m/s = 20×18/5 = 72 km/hr.' },
  { id:2, subject:'Maths',    text:'If 15% of X = 45, find X.', opts:['280','300','320','340'], correct:1, explanation:'X = 45 × 100/15 = 300.' },
  { id:3, subject:'English',  text:'Choose the correct sentence:', opts:["He don't know.","He doesn't know.","He not know.","He knowed."], correct:1, explanation:'Third person singular present uses "doesn\'t" for negatives.' },
  { id:4, subject:'GK',       text:'Which article of the Indian Constitution abolishes untouchability?', opts:['Article 14','Article 17','Article 21','Article 25'], correct:1, explanation:'Article 17 abolishes untouchability in any form.' },
  { id:5, subject:'Maths',    text:'LCM of 12, 18, and 24?', opts:['48','72','36','60'], correct:1, explanation:'LCM = 2³×3² = 72.' },
  { id:6, subject:'Reasoning',text:'If MANGO = NBOIP, then APPLE = ?', opts:['BQQMF','BQQLE','CQQMF','BPPLE'], correct:0, explanation:'Each letter +1 in alphabet: A→B, P→Q, P→Q, L→M, E→F = BQQMF.' },
  { id:7, subject:'GK',       text:'RBI Governor is appointed by:', opts:['President','Prime Minister','Finance Minister','Cabinet Committee'], correct:0, explanation:'The RBI Governor is appointed by the President of India on advice of the Union Cabinet.' },
  { id:8, subject:'English',  text:'Synonym of "Ameliorate":', opts:['Worsen','Improve','Maintain','Destroy'], correct:1, explanation:'Ameliorate means to make something bad or unsatisfactory better.' },
  { id:9, subject:'Maths',    text:'Shopkeeper sells at 20% profit. CP = ₹500. SP = ?', opts:['₹550','₹580','₹600','₹620'], correct:2, explanation:'SP = 500 × 120/100 = ₹600.' },
  { id:10,subject:'Reasoning',text:'Odd one out: 3, 5, 7, 11, 12, 13', opts:['12','11','13','5'], correct:0, explanation:'All are prime except 12 (divisible by 2, 3, 4, 6).' },
]

export default function ActiveTest() {
  const navigate = useNavigate()
  const location = useLocation()
  const total = QUESTIONS.length

  const [curr,      setCurr]      = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [revealed,  setRevealed]  = useState(false)
  const [bookmarks, setBookmarks] = useState(new Set())
  const [timeLeft,  setTimeLeft]  = useState(1800)
  const [exitModal, setExitModal] = useState(false)
  const [expTab,    setExpTab]    = useState('step')

  const q = QUESTIONS[curr]
  const sel = answers[q.id]
  const isLocked = sel !== undefined

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { finalSubmit(); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

  const pick = (i) => {
    if (isLocked) return
    setAnswers(p => ({ ...p, [q.id]: i }))
    setRevealed(true)
  }

  const next = () => {
    setRevealed(false)
    if (curr < total - 1) setCurr(p => p + 1)
    else finalSubmit()
  }

  const finalSubmit = useCallback(() => {
    const correct = Object.entries(answers).filter(([id, s]) => {
      const q2 = QUESTIONS.find(q2 => q2.id === +id)
      return q2 && q2.correct === s
    }).length
    navigate('/test-engine/result', { state: { answers, correct, total, timeUsed: 1800 - timeLeft } })
  }, [answers, timeLeft, navigate])

  const optCls = (i) => {
    if (!isLocked) return 'border-slate-200 bg-white hover:border-[#1E3A5F] cursor-pointer'
    if (i === q.correct) return 'border-green-500 bg-green-50 text-green-800'
    if (i === sel && sel !== q.correct) return 'border-red-500 bg-red-50 text-red-800'
    return 'border-slate-200 bg-white opacity-50'
  }

  const r = 22, circ = 2 * Math.PI * r
  const timerColor = timeLeft < 300 ? 'text-red-500' : timeLeft < 600 ? 'text-amber-500' : 'text-[#D4AF37]'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#1E3A5F] z-30 flex items-center justify-between px-4">
        <button onClick={() => setExitModal(true)} className="flex items-center gap-1 text-white/70 hover:text-white text-sm">
          <ChevronLeft size={18} /> Exit
        </button>
        <span className="text-white text-sm font-semibold">Q{curr + 1}/{total}</span>
        <div className="flex items-center gap-2">
          <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
            <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3.5" />
            <circle cx="24" cy="24" r={r} fill="none" stroke="#D4AF37" strokeWidth="3.5"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - timeLeft / 1800)} strokeLinecap="round" />
          </svg>
          <span className={`font-mono font-bold text-sm ${timerColor}`}>{fmt(timeLeft)}</span>
        </div>
      </header>

      {/* Progress dots */}
      <div className="fixed top-[60px] left-0 right-0 h-1.5 z-20 bg-slate-300 flex">
        {QUESTIONS.map((q2, i) => (
          <div key={i} className={`flex-1 mx-px rounded-full transition-colors
            ${i === curr ? 'bg-[#1E3A5F]' : answers[q2.id] !== undefined ? 'bg-[#D4AF37]' : 'bg-slate-300'}`} />
        ))}
      </div>

      {/* Body */}
      <main className="flex-1 pt-[76px] pb-[88px] px-4 max-w-3xl mx-auto w-full">
        <div className="clay rounded-3xl p-6 mt-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="bg-[#1E3A5F] text-white text-xs font-bold px-3 py-1 rounded-full">Q{curr + 1} of {total}</span>
            <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full">{q.subject}</span>
          </div>
          <p className="text-lg font-medium text-[#1E293B] leading-relaxed mb-6">{q.text}</p>
          <div className="flex flex-col gap-3">
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => pick(i)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${optCls(i)}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                  ${isLocked && i === q.correct ? 'bg-green-500 text-white'
                  : isLocked && i === sel && sel !== q.correct ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-600'}`}>
                  {['A','B','C','D'][i]}
                </span>
                <span className="text-sm font-medium flex-1">{opt}</span>
                {isLocked && i === q.correct && <span className="text-green-600 font-bold text-sm ml-auto">✓</span>}
                {isLocked && i === sel && sel !== q.correct && <span className="text-red-500 font-bold text-sm ml-auto">✗</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {revealed && (
          <div className="clay-dark rounded-3xl p-6 mt-4 animate-slide-up">
            <p className={`font-bold text-lg mb-3 ${sel === q.correct ? 'text-green-400' : 'text-red-400'}`}>
              {sel === q.correct ? '✅ Correct! +10 🪙' : '❌ Incorrect'}
            </p>
            <div className="flex gap-2 mb-3 flex-wrap">
              {['step','shortcut','mistakes'].map(t => (
                <button key={t} onClick={() => setExpTab(t)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold capitalize transition-all
                    ${expTab === t ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white/10 text-white/70'}`}>
                  {t === 'step' ? 'Step by Step' : t === 'shortcut' ? 'Shortcut' : 'Common Mistakes'}
                </button>
              ))}
            </div>
            <p className="text-white/85 text-sm leading-relaxed">{q.explanation}</p>
            <p className="text-white/40 text-xs mt-3">Difficulty: Level 3 · Seen in: SSC CGL 2019, 2021, 2023</p>
          </div>
        )}
      </main>

      {/* Footer nav */}
      <footer className="fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t border-slate-200 flex items-center justify-between px-4 gap-3 z-20">
        <button onClick={() => setBookmarks(p => { const n = new Set(p); p.has(q.id) ? n.delete(q.id) : n.add(q.id); return n })}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0
            ${bookmarks.has(q.id) ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-slate-100 text-slate-600'}`}>
          <Bookmark size={16} /> {bookmarks.has(q.id) ? 'Saved' : 'Save'}
        </button>

        <div className="flex gap-1 overflow-x-auto scrollbar-hide max-w-[180px] flex-shrink-0">
          {QUESTIONS.slice(0, 10).map((_, i) => (
            <button key={i} onClick={() => { setCurr(i); setRevealed(false) }}
              className={`w-7 h-7 rounded-lg flex-shrink-0 text-xs font-bold transition-all
                ${i === curr ? 'bg-[#1E3A5F] text-white' : answers[QUESTIONS[i].id] !== undefined ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-slate-100 text-slate-500'}`}>
              {i + 1}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {curr > 0 && (
            <button onClick={() => { setCurr(p => p - 1); setRevealed(false) }}
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600">
              <ChevronLeft size={18} />
            </button>
          )}
          <button onClick={next} className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5">
            {curr < total - 1 ? (<>Next <ChevronRight size={16} /></>) : 'Submit Test'}
          </button>
        </div>
      </footer>

      {/* Exit modal */}
      {exitModal && (
        <div className="fixed inset-0 bg-[#0F2140]/80 z-50 flex items-center justify-center p-4">
          <div className="clay rounded-3xl p-8 max-w-sm w-full text-center">
            <p className="text-4xl mb-3">⚠️</p>
            <h3 className="font-bold text-[#1E3A5F] text-xl mb-2 font-poppins">Exit Test?</h3>
            <p className="text-slate-500 text-sm mb-6">Your progress will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setExitModal(false)} className="flex-1 btn-gold py-3 rounded-2xl font-bold">Stay</button>
              <button onClick={() => navigate('/test-engine')}
                className="flex-1 border-2 border-red-300 text-red-500 py-3 rounded-2xl font-bold hover:bg-red-50 transition-colors">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
