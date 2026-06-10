import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ChevronLeft } from 'lucide-react'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Puducherry','Chandigarh','Other']
const NE = new Set(['Arunachal Pradesh','Assam','Manipur','Meghalaya','Mizoram','Nagaland','Sikkim','Tripura'])
const CATS = ['General','OBC','SC','ST','EWS','PwD']
const EXAMS = ['SSC CGL','SSC CHSL','SSC MTS','SSC GD','IBPS PO','IBPS Clerk','SBI PO','SBI Clerk','RRB NTPC','RRB Group D','UPSC CSE','NEET UG','JEE Main','JEE Advanced','BITSAT','GATE CS','GATE EC','GATE ME','CLAT','CA Foundation','NDA','CDS','Agniveer Army GD','CTET Paper 1','CTET Paper 2','UGC NET','RBI Grade B']
const LANGS = ['Tamil','Hindi','Telugu','Kannada','Malayalam','Marathi','Bengali','Gujarati','Punjabi','Odia','Assamese','Mizo']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const TOTAL = 7

export default function Onboarding() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name:'', day:'', month:'', year:'', category:'', state:'', city:'', exams:[], languages:[] })
  const [examSearch, setExamSearch] = useState('')
  const [done, setDone] = useState(false)
  const [confetti, setConfetti] = useState([])

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const canNext = useMemo(() => {
    if (step === 1) return form.name.trim().length >= 2
    if (step === 2) return !!(form.day && form.month && form.year)
    if (step === 3) return !!form.category
    if (step === 4) return !!form.state
    if (step === 6) return form.exams.length >= 1
    return true
  }, [step, form])

  const filteredExams = useMemo(() =>
    examSearch.trim()
      ? EXAMS.filter(e => e.toLowerCase().includes(examSearch.toLowerCase()))
      : EXAMS
  , [examSearch])

  const toggleExam = (e) => {
    if (form.exams.includes(e)) upd('exams', form.exams.filter(x => x !== e))
    else if (form.exams.length < 5) upd('exams', [...form.exams, e])
  }

  const toggleLang = (l) => {
    if (form.languages.includes(l)) upd('languages', form.languages.filter(x => x !== l))
    else if (form.languages.length < 3) upd('languages', [...form.languages, l])
  }

  const complete = () => {
    setConfetti(Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: i % 2 === 0 ? '#D4AF37' : '#1E3A5F',
      dur: Math.random() * 1.5 + 1.5,
      delay: Math.random() * 0.5,
    })))
    setDone(true)
    login()
    setTimeout(() => navigate('/dashboard'), 2800)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1E3A5F,#0F2140)' }}>
        {confetti.map(p => (
          <div key={p.id} className="absolute w-3 h-3 rounded-sm pointer-events-none"
            style={{ backgroundColor: p.color, left: `${p.x}%`, top: '-20px',
              animation: `confettiFall ${p.dur}s ease ${p.delay}s forwards` }} />
        ))}
        <div className="glass rounded-3xl p-10 text-center z-10 animate-bounce-in max-w-sm mx-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#1E3A5F] font-poppins">Welcome to TryIT!</h2>
          <p className="text-slate-600 mt-2">Your journey begins now, {form.name.split(' ')[0]}!</p>
          <div className="mt-4 clay-gold rounded-2xl p-4">
            <p className="text-[#1E3A5F] font-bold">🎁 200 bonus coins added!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1.5 bg-slate-200">
          <div className="h-1.5 bg-[#D4AF37] transition-all duration-500"
            style={{ width: `${(step / TOTAL) * 100}%` }} />
        </div>
      </div>

      {/* Step dots */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {Array.from({ length: TOTAL }, (_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i + 1 === step ? 'bg-[#D4AF37] w-6' : i + 1 < step ? 'bg-[#1E3A5F] w-2' : 'bg-slate-300 w-2'}`} />
        ))}
      </div>

      {/* Back button */}
      {step > 1 && (
        <button onClick={() => setStep(s => s - 1)}
          className="fixed top-8 left-5 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
      )}

      <div className="flex-1 flex items-center justify-center px-5 pt-20 pb-10">
        <div className="w-full max-w-md">

          {/* Step 1 — Name */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">What should we call you? 👋</h2>
              <p className="text-slate-500 mb-6">Your name on your TryIT profile.</p>
              <input value={form.name} onChange={e => upd('name', e.target.value)}
                placeholder="Your full name" className="clay-input text-xl" />
            </div>
          )}

          {/* Step 2 — DOB */}
          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Date of birth? 🎂</h2>
              <p className="text-slate-500 mb-6">For age-appropriate exam suggestions.</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1E3A5F] mb-1 block">Day</label>
                  <select value={form.day} onChange={e => upd('day', e.target.value)} className="clay-input">
                    <option value="">DD</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1E3A5F] mb-1 block">Month</label>
                  <select value={form.month} onChange={e => upd('month', e.target.value)} className="clay-input">
                    <option value="">MM</option>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1E3A5F] mb-1 block">Year</label>
                  <select value={form.year} onChange={e => upd('year', e.target.value)} className="clay-input">
                    <option value="">YYYY</option>
                    {Array.from({ length: 50 }, (_, i) => 2024 - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Category */}
          {step === 3 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Your exam category? 📋</h2>
              <p className="text-slate-500 mb-6">For accurate cut-off comparisons.</p>
              <div className="grid grid-cols-3 gap-3">
                {CATS.map(c => (
                  <button key={c} onClick={() => upd('category', c)}
                    className={`py-4 rounded-2xl font-bold transition-all ${form.category === c ? 'clay-gold text-[#1E3A5F]' : 'clay text-slate-700'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — State */}
          {step === 4 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Which state? 🗺️</h2>
              <div className="glass-gold rounded-2xl px-4 py-3 mb-4 text-sm text-[#1E3A5F]">
                🌟 Northeast India students — we fully support all state exams and languages!
              </div>
              <div className="max-h-64 overflow-y-auto flex flex-wrap gap-2 scrollbar-hide">
                {STATES.map(s => (
                  <button key={s} onClick={() => upd('state', s)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                      ${form.state === s ? 'bg-[#1E3A5F] text-white'
                      : `bg-white border-2 ${NE.has(s) ? 'border-[#D4AF37]/50' : 'border-slate-200'} text-slate-700 hover:border-[#1E3A5F]`}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — City */}
          {step === 5 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">City or district? 🏙️</h2>
              <p className="text-slate-500 mb-6">Optional — used for local leaderboard.</p>
              <input value={form.city} onChange={e => upd('city', e.target.value)}
                placeholder="e.g. Coimbatore (optional)" className="clay-input" />
            </div>
          )}

          {/* Step 6 — Exams */}
          {step === 6 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Which exams? 🎯</h2>
              <p className="text-slate-500 mb-3">Pick up to 5. First choice = primary exam.</p>
              {form.exams.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.exams.map((e, i) => (
                    <span key={e} className="flex items-center gap-1.5 bg-[#1E3A5F] text-white px-3 py-1.5 rounded-xl text-sm font-semibold">
                      {i === 0 && <span className="text-[#D4AF37]">★</span>}{e}
                      <button onClick={() => toggleExam(e)} className="text-white/60 hover:text-white ml-1">×</button>
                    </span>
                  ))}
                </div>
              ) : null}
              <input value={examSearch} onChange={e => setExamSearch(e.target.value)}
                placeholder="Search exams…" className="clay-input mb-3" />
              <div className="max-h-52 overflow-y-auto flex flex-col gap-1 scrollbar-hide">
                {filteredExams.map(e => (
                  <button key={e} onClick={() => toggleExam(e)}
                    disabled={form.exams.length >= 5 && !form.exams.includes(e)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${form.exams.includes(e) ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-[#D4AF37] disabled:opacity-40'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7 — Language */}
          {step === 7 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Study language? 🌐</h2>
              <p className="text-slate-500 mb-3">English always included. Add up to 3 more.</p>
              <div className="clay rounded-2xl p-3 mb-4 flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <span className="font-semibold text-[#1E3A5F]">English — Always Included</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGS.map(l => (
                  <button key={l} onClick={() => toggleLang(l)}
                    disabled={form.languages.length >= 3 && !form.languages.includes(l)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                      ${form.languages.includes(l) ? 'bg-[#1E3A5F] text-white' : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-[#1E3A5F] disabled:opacity-40'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nav button */}
          <div className="mt-8">
            {step < TOTAL ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext}
                className="btn-gold w-full py-4 rounded-2xl font-bold text-lg">
                Next →
              </button>
            ) : (
              <button onClick={complete} className="btn-gold w-full py-4 rounded-2xl font-bold text-lg">
                Complete Setup 🚀
              </button>
            )}
          </div>
          <p className="text-center text-slate-400 text-xs mt-3">Step {step} of {TOTAL}</p>
        </div>
      </div>
    </div>
  )
}
