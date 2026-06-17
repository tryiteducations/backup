// FILE: src/pages/test-engine/ActiveTest.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

// ── SEED QUESTIONS (replace with Supabase query when DB is ready) ──────────
const SEED_QUESTIONS = [
  {
    id: 'q1', topic_id: 'quant-basics', subject_id: 'maths_arithmetic',
    difficulty: 'L1',
    question: 'What is 15% of 240?',
    options: ['32', '36', '38', '40'],
    correct_answer: '36',
    explanation: '15% of 240 = (15/100) × 240 = 36',
    explanation_factors: {
      concept:       'Percentage calculation: (percent/100) × number',
      formula:       '(P/100) × N = Result',
      common_mistake:'Confusing 15% with 1.5% (off by decimal)',
      shortcut:      'Split: 10% of 240 = 24; 5% = 12; total = 36',
      exam_relevance:'SSC CGL, IBPS PO Quantitative Aptitude',
      story:         'Ramu got 15% off on a ₹240 item at the Chennai market — he saved ₹36.',
      mnemonic:      'PHW = Part ÷ (Hundred × Whole). Remember: PHW like "Phew, that was easy!"',
    },
    tags: ['ssc-cgl', 'ibps-po'],
  },
  {
    id: 'q2', topic_id: 'reasoning-series', subject_id: 'reasoning_verbal',
    difficulty: 'L2',
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['38', '40', '42', '44'],
    correct_answer: '42',
    explanation: 'Differences: 4, 6, 8, 10, 12 → next is 30+12 = 42',
    explanation_factors: {
      concept:       'Number series with increasing differences',
      formula:       'aₙ = aₙ₋₁ + (2n)',
      common_mistake:'Missing that differences themselves form an AP',
      shortcut:      'Write differences first: 4,6,8,10 — clearly +2 each time',
      exam_relevance:'SSC CHSL, Railway NTPC Reasoning',
      story:         'Priya arranged tiles in her Patna home: 2, 6, 12, 20, 30... the next row needs 42 tiles!',
      mnemonic:      'Difference of differences = constant. Two levels deep!',
    },
    tags: ['ssc-chsl', 'rrb-ntpc'],
  },
  {
    id: 'q3', topic_id: 'english-vocab', subject_id: 'english_vocabulary',
    difficulty: 'L1',
    question: 'Choose the word closest in meaning to "ELOQUENT":',
    options: ['Silent', 'Fluent and persuasive', 'Confused', 'Aggressive'],
    correct_answer: 'Fluent and persuasive',
    explanation: 'Eloquent means fluent, forceful, and persuasive in speech.',
    explanation_factors: {
      concept:       'Synonym — Latin root "eloqui" means to speak out',
      formula:       'Eloquent → Elegant speaker who moves audience',
      common_mistake:"Confusing with 'elegant' (stylish/graceful)",
      shortcut:      'Root: "loqui" = speak (loquacious, colloquial)',
      exam_relevance:'UPSC, CAT, Bank PO English section',
      story:         'Kavitha from Madurai was so eloquent that her speech at the college event moved everyone.',
      mnemonic:      'E-LO-QUENT = "Everyone LOves QUEst for NT(nice talk)"',
    },
    tags: ['upsc', 'cat', 'ibps-po'],
  },
  {
    id: 'q4', topic_id: 'gk-india', subject_id: 'gk_polity',
    difficulty: 'L1',
    question: 'Which article of the Indian Constitution abolishes untouchability?',
    options: ['Article 14', 'Article 17', 'Article 19', 'Article 21'],
    correct_answer: 'Article 17',
    explanation: 'Article 17 abolishes untouchability. Its practice in any form is forbidden.',
    explanation_factors: {
      concept:       'Fundamental Rights under Part III of the Constitution',
      formula:       'Article 17 = Abolition of Untouchability',
      common_mistake:'Confusing with Article 15 (no discrimination) or 16 (equal opportunity)',
      shortcut:      '14=Equality, 15=No discrimination, 16=Equal opportunity, 17=Untouchability abolished',
      exam_relevance:'UPSC, SSC CGL GK, State PSC exams',
      story:         'Dr. Ambedkar fought hard so that Article 17 would give dignity to every Indian citizen.',
      mnemonic:      '17 sounds like "one seven" — ONE law that unites SEVEN crore oppressed.',
    },
    tags: ['upsc', 'ssc-cgl', 'state-psc'],
  },
  {
    id: 'q5', topic_id: 'quant-profit', subject_id: 'maths_arithmetic',
    difficulty: 'L2',
    question: 'A shopkeeper buys an article for ₹800 and sells it at 25% profit. What is the selling price?',
    options: ['₹900', '₹950', '₹1000', '₹1050'],
    correct_answer: '₹1000',
    explanation: 'SP = CP × (1 + P%) = 800 × 1.25 = ₹1000',
    explanation_factors: {
      concept:       'Profit and Loss: SP = CP + Profit',
      formula:       'SP = CP × (1 + P/100)',
      common_mistake:"Adding 25 directly (₹825) instead of 25% of CP",
      shortcut:      '25% of 800 = 200; SP = 800+200 = 1000',
      exam_relevance:'SSC, Banking, Railway Quant section',
      story:         'Ramu bhai bought a kurta for ₹800 at Surat wholesale market and sold it at 25% profit — ₹1000!',
      mnemonic:      'SP = CP + (P% of CP). Always % of CP, never direct add.',
    },
    tags: ['ssc-cgl', 'ibps-po', 'rrb-ntpc'],
  },
  {
    id: 'q6', topic_id: 'reasoning-direction', subject_id: 'reasoning_verbal',
    difficulty: 'L2',
    question: 'Ravi walks 10 km North, turns East walks 6 km, turns South walks 10 km. How far from start?',
    options: ['4 km', '6 km', '10 km', '16 km'],
    correct_answer: '6 km',
    explanation: 'North 10 and South 10 cancel. He is 6 km East of start.',
    explanation_factors: {
      concept:       'Direction-sense: opposite directions cancel',
      formula:       'Net displacement = vector sum',
      common_mistake:'Adding all distances (26 km) instead of net',
      shortcut:      'Draw it: N10 → E6 → S10 = same latitude, 6 km east',
      exam_relevance:'SSC CHSL, Bank Clerk, Railway Reasoning',
      story:         'Arjun took an auto in Chennai: 10 km north, 6 east, 10 south — still only 6 km from home!',
      mnemonic:      'Opposite directions cancel like -10 + 10 = 0. Only the unique direction remains.',
    },
    tags: ['ssc-chsl', 'ibps-clerk', 'rrb'],
  },
  {
    id: 'q7', topic_id: 'english-grammar', subject_id: 'english_grammar',
    difficulty: 'L1',
    question: 'Choose the correctly spelled word:',
    options: ['Accomodation', 'Accommodation', 'Acommodation', 'Accommodasion'],
    correct_answer: 'Accommodation',
    explanation: '"Accommodation" has double "c" and double "m".',
    explanation_factors: {
      concept:       'Spelling — double consonants: ac-com-mo-da-tion',
      formula:       'ACC + OMM + ODATION',
      common_mistake:'Single c or single m',
      shortcut:      'Two cots and two mattresses → 2c, 2m',
      exam_relevance:'SSC CGL English, Bank PO, IELTS',
      story:         'The hotel in Ooty had accommodation for 200 guests — always remember the double cc and mm!',
      mnemonic:      '"ACCOMmodation" — Accommodate = give room to two Cs and two Ms.',
    },
    tags: ['ssc-cgl', 'ibps-po', 'ielts'],
  },
  {
    id: 'q8', topic_id: 'gk-science', subject_id: 'gk_science',
    difficulty: 'L2',
    question: 'Which gas is responsible for the greenhouse effect primarily?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'],
    correct_answer: 'Carbon Dioxide',
    explanation: 'CO₂ is the primary anthropogenic greenhouse gas trapping solar radiation.',
    explanation_factors: {
      concept:       'Greenhouse gases absorb and re-emit infrared radiation',
      formula:       'Primary GHGs: CO₂ > CH₄ > N₂O > H₂O vapour',
      common_mistake:'Saying Oxygen (O₂ is NOT a GHG)',
      shortcut:      'CO₂ = Carbon footprint = climate change — they go together',
      exam_relevance:'UPSC, SSC, NEET Environmental Science',
      story:         'Meena explained to her class in Pune: every scooter puffing CO₂ is heating our planet.',
      mnemonic:      'CO₂ = COvers the Earth like a blanket = warming.',
    },
    tags: ['upsc', 'ssc-cgl', 'neet'],
  },
  {
    id: 'q9', topic_id: 'quant-time-work', subject_id: 'maths_arithmetic',
    difficulty: 'L3',
    question: 'A can finish work in 12 days, B in 18 days. Together, how many days?',
    options: ['6.2 days', '7.2 days', '8 days', '9 days'],
    correct_answer: '7.2 days',
    explanation: 'Combined rate = 1/12 + 1/18 = 5/36. Days = 36/5 = 7.2',
    explanation_factors: {
      concept:       'Time and Work: combined rate = sum of individual rates',
      formula:       'Days = (A×B)/(A+B) = (12×18)/30 = 7.2',
      common_mistake:'Adding days directly (30) instead of rates',
      shortcut:      'LCM(12,18)=36; A=3 units/day, B=2 → 5/day → 36/5=7.2',
      exam_relevance:'SSC CGL, IBPS PO, CAT Quant',
      story:         'Suresh and his friend painted Kavitha\'s house in Trichy — alone 12 and 18 days, together just 7.2!',
      mnemonic:      'Together → add RATES not DAYS. Rates = 1/days.',
    },
    tags: ['ssc-cgl', 'ibps-po', 'cat'],
  },
  {
    id: 'q10', topic_id: 'gk-sports', subject_id: 'gk_sports',
    difficulty: 'L1',
    question: 'How many players are there in a cricket team?',
    options: ['9', '10', '11', '12'],
    correct_answer: '11',
    explanation: 'A standard cricket team consists of 11 players.',
    explanation_factors: {
      concept:       'Sports GK — team composition',
      formula:       'Cricket = Football = 11 players (both British exports)',
      common_mistake:'Confusing with baseball (9) or volleyball (6)',
      shortcut:      'Cricket and Football both = 11',
      exam_relevance:'SSC, Railway, Bank Clerk GK section',
      story:         'Young Arjun from Patna memorised: cricket = 11, just like his favourite football team!',
      mnemonic:      'Cricket bat looks like 1, ball like 1 → 11!',
    },
    tags: ['ssc-cgl', 'rrb-ntpc', 'ibps-clerk'],
  },
]

const PER_QUESTION_TIME = 30
const MOCK_TOTAL_TIME   = 10 * 60

// ── FLAG TYPES ────────────────────────────────────────────────────────────
const FLAG_TYPES = [
  { id:'wrong_answer',       emoji:'❌', label:'Wrong Answer',       desc:'Marked correct answer is wrong' },
  { id:'wrong_options',      emoji:'📝', label:'Options Error',      desc:'Options have errors or missing' },
  { id:'question_error',     emoji:'✏️',  label:'Question Text Error',desc:'Typo or error in question text' },
  { id:'translation_error',  emoji:'🌐', label:'Translation Error',  desc:'Translation in my language is wrong' },
  { id:'explanation_error',  emoji:'💡', label:'Explanation Wrong',  desc:'Solution or explanation is incorrect' },
  { id:'outdated',           emoji:'📅', label:'Outdated / Changed', desc:'Answer has changed (current affairs)' },
  { id:'duplicate',          emoji:'🔁', label:'Duplicate',          desc:'Seen this exact question before' },
  { id:'out_of_syllabus',    emoji:'📋', label:'Out of Syllabus',    desc:'Not in my exam syllabus' },
  { id:'inappropriate',      emoji:'🚫', label:'Inappropriate',      desc:'Offensive or inappropriate content' },
  { id:'poor_quality',       emoji:'⭐', label:'Poor Quality',       desc:'Badly written or unclear question' },
  { id:'other',              emoji:'💬', label:'Other',              desc:'Something else is wrong' },
]

// ── EXPLANATION LAYER LABELS ──────────────────────────────────────────────
const EXPLANATION_LAYERS = [
  { key:'explanation',       icon:'🔍', label:'Solution' },
  { key:'concept',           icon:'💡', label:'Concept' },
  { key:'formula',           icon:'📐', label:'Formula / Rule' },
  { key:'shortcut',          icon:'⚡', label:'Shortcut / Trick' },
  { key:'common_mistake',    icon:'⚠️',  label:'Common Mistake' },
  { key:'story',             icon:'📖', label:'Story to Remember' },
  { key:'mnemonic',          icon:'🧠', label:'Mnemonic' },
  { key:'exam_relevance',    icon:'🎯', label:'Exam Relevance' },
]


export default function ActiveTest() {
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const {
    user, canAccess, trackUsage, spendCoins,
    explanationsLeft, planTier, isPro,
  } = useAuth()

  const config    = state || { mode: 'practice', count: 10, difficulty: 'adaptive' }
  const questions = SEED_QUESTIONS.slice(0, Math.min(Number(config.count) || 10, SEED_QUESTIONS.length))

  // ── TEST STATE ────────────────────────────────────────────────────────
  const [currentIndex,     setCurrentIndex]     = useState(0)
  const [selectedAnswers,  setSelectedAnswers]  = useState({})
  const [bookmarked,       setBookmarked]       = useState({})  // local bookmark only
  const [timeLeft,         setTimeLeft]         = useState(
    config.mode === 'speed' ? PER_QUESTION_TIME : MOCK_TOTAL_TIME
  )
  const [showFeedback, setShowFeedback] = useState(false)
  const timerRef = useRef(null)

  // ── EXPLANATION STATE ─────────────────────────────────────────────────
  const [showExplanation,    setShowExplanation]    = useState(false)
  const [activeLayer,        setActiveLayer]        = useState(0)
  const [showCoinPrompt,     setShowCoinPrompt]     = useState(false)
  const [showUpgradePrompt,  setShowUpgradePrompt]  = useState(false)
  const [expLeft,            setExpLeft]            = useState(null)

  // ── REPORT / FLAG STATE ───────────────────────────────────────────────
  const [showReportModal,   setShowReportModal]   = useState(false)
  const [reportType,        setReportType]        = useState(null)
  const [reportDesc,        setReportDesc]        = useState('')
  const [reportSubmitting,  setReportSubmitting]  = useState(false)
  const [reportDone,        setReportDone]        = useState(false)
  const [hiddenQuestions,   setHiddenQuestions]   = useState(new Set())

  const currentQ    = questions[currentIndex]
  const isLast      = currentIndex === questions.length - 1
  const isPractice  = config.mode === 'practice'
  const isSpeed     = config.mode === 'speed'
  const isMock      = config.mode === 'mock'
  const selected    = selectedAnswers[currentQ?.id]
  const isBookmarked= bookmarked[currentQ?.id]
  const isHidden    = hiddenQuestions.has(currentQ?.id)

  // ── TIMER ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPractice) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (isSpeed) handleNext(true)
          else finishTest()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [currentIndex, config.mode])

  useEffect(() => {
    if (isSpeed) setTimeLeft(PER_QUESTION_TIME)
    setShowFeedback(false)
    setShowExplanation(false)
    setActiveLayer(0)
    setShowCoinPrompt(false)
    setShowUpgradePrompt(false)
    setReportDone(false)
  }, [currentIndex])

  // Refresh explanation count when question changes
  useEffect(() => {
    if (planTier === 'free') {
      setExpLeft(explanationsLeft ? explanationsLeft() : 5)
    }
  }, [currentIndex, planTier])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2,'0')}`
  }

  // ── ANSWER SELECTION ──────────────────────────────────────────────────
  const handleSelect = (option) => {
    if (selected && isPractice) return
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: option }))
    if (isPractice) setShowFeedback(true)
  }

  // ── SHOW EXPLANATION (with gating) ───────────────────────────────────
  const handleShowExplanation = () => {
    const access = canAccess('explanation')

    if (access.allowed) {
      trackUsage('explanation')
      setShowExplanation(true)
      setExpLeft(prev => (prev !== null ? Math.max(0, prev - 1) : null))
      return
    }

    if (access.reason === 'limit_reached') {
      if (access.canByCoin) {
        setShowCoinPrompt(true)
      } else {
        setShowUpgradePrompt(true)
      }
      return
    }

    // plan_restriction
    setShowUpgradePrompt(true)
  }

  const handleCoinUnlock = () => {
    const ok = spendCoins(20, `explanation_q${currentQ.id}`)
    if (ok) {
      setShowCoinPrompt(false)
      setShowExplanation(true)
    }
  }

  // ── REPORT TO MENTOR ──────────────────────────────────────────────────
  const handleReportSubmit = async () => {
    if (!reportType) return
    setReportSubmitting(true)

    const flagRecord = {
      flag_id:       crypto.randomUUID?.() || `flag_${Date.now()}`,
      question_id:   currentQ.id,
      flag_type:     reportType,
      description:   reportDesc.trim() || null,
      language_used: user?.preferred_lang || 'en',
      topic_id:      currentQ.topic_id,
      subject_id:    currentQ.subject_id || 'general',
      hidden_for_user: true,
      created_at:    new Date().toISOString(),
    }

    // Save to localStorage (syncs to Supabase when online)
    try {
      const existing = JSON.parse(localStorage.getItem('tryit_pending_flags') || '[]')
      existing.push(flagRecord)
      localStorage.setItem('tryit_pending_flags', JSON.stringify(existing))
    } catch {}

    // Try Supabase immediately if online
    try {
      await supabase.from('question_flags').insert({
        question_id:    flagRecord.question_id,
        flag_type:      flagRecord.flag_type,
        description:    flagRecord.description,
        language_used:  flagRecord.language_used,
        topic_id:       flagRecord.topic_id,
        subject_id:     flagRecord.subject_id,
        hidden_for_user:true,
      })
    } catch {}

    // Hide question for this user immediately
    setHiddenQuestions(prev => new Set([...prev, currentQ.id]))
    setReportSubmitting(false)
    setReportDone(true)
    setShowReportModal(false)
    setReportType(null)
    setReportDesc('')

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (!isLast) {
        setCurrentIndex(i => i + 1)
      } else {
        finishTest()
      }
    }, 2000)
  }

  // ── NAVIGATION ────────────────────────────────────────────────────────
  const handleNext = (autoAdvance = false) => {
    setShowFeedback(false)
    if (isLast) finishTest()
    else setCurrentIndex(i => i + 1)
  }

  const finishTest = () => {
    clearInterval(timerRef.current)
    const score = questions.filter(q => selectedAnswers[q.id] === q.correct_answer).length
    navigate('/test-engine/result', {
      state: { questions, answers: selectedAnswers, score, config },
    })
  }

  const progressPct = ((currentIndex + 1) / questions.length) * 100

  // ── OPTION STYLES ─────────────────────────────────────────────────────
  const optionStyle = (opt) => {
    if (!selected)
      return 'border-gray-200 bg-white hover:border-[#1E3A5F] hover:bg-blue-50 cursor-pointer'
    if (isPractice && showFeedback) {
      if (opt === currentQ.correct_answer) return 'border-green-500 bg-green-50 text-green-800'
      if (opt === selected && opt !== currentQ.correct_answer)
        return 'border-red-400 bg-red-50 text-red-700'
    }
    if (opt === selected)
      return 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
    return 'border-gray-200 bg-white text-gray-400'
  }

  // ── GET LAYER VALUE ────────────────────────────────────────────────────
  const getLayerValue = (layer) => {
    if (layer.key === 'explanation') return currentQ.explanation
    return currentQ.explanation_factors?.[layer.key] || null
  }

  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col" style={{ fontFamily:'Inter,sans-serif' }}>

      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <div className="bg-[#1E3A5F] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">
            Q {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full capitalize">
            {config.mode}
          </span>
          {/* Free tier explanation counter */}
          {planTier === 'free' && (
            <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full">
              💡 {expLeft ?? 5} free left
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Timer */}
          {!isPractice && (
            <div className={`font-mono text-sm font-bold px-3 py-1 rounded-lg ${
              timeLeft < 30 ? 'bg-red-500' : 'bg-white/20'
            }`}>
              {isSpeed ? `${timeLeft}s` : formatTime(timeLeft)}
            </div>
          )}

          {/* Bookmark button (local only) */}
          <button
            onClick={() => setBookmarked(prev => ({
              ...prev, [currentQ.id]: !prev[currentQ.id]
            }))}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${
              isBookmarked
                ? 'bg-yellow-400 text-[#1E3A5F] border-yellow-400'
                : 'border-white/30 hover:bg-white/10'
            }`}
            title="Bookmark for later"
          >
            {isBookmarked ? '🔖' : '☆'}
          </button>

          {/* Submit */}
          <button
            onClick={finishTest}
            className="text-xs px-3 py-1.5 border border-white/30 rounded-lg hover:bg-white/10 transition"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200">
        <div
          className="h-full bg-[#C9A84C] transition-all duration-300"
          style={{ width:`${progressPct}%` }}
        />
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4">

        {/* Question reported banner */}
        {reportDone && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="font-semibold text-green-800 text-sm">
              ✅ Reported! Our expert mentor will review and fix this.
            </p>
            <p className="text-green-600 text-xs mt-1">
              This question is hidden for you. Moving to next question...
            </p>
          </div>
        )}

        {/* Question is hidden (just reported) */}
        {isHidden && !reportDone ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm">🚩 This question is hidden after your report.</p>
            <button
              onClick={() => !isLast ? setCurrentIndex(i => i+1) : finishTest()}
              className="mt-4 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm font-semibold"
            >
              Next Question →
            </button>
          </div>
        ) : !reportDone && (
          <>
            {/* Difficulty + topic */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-[#1E3A5F]/10 text-[#1E3A5F] px-2 py-0.5 rounded-full">
                {currentQ.difficulty}
              </span>
              <span className="text-xs text-gray-400 capitalize">
                {currentQ.topic_id.replace(/-/g,' ')}
              </span>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={!!(selected && isPractice && showFeedback)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium transition-all ${optionStyle(opt)}`}
                >
                  <span className="mr-3 text-sm font-bold opacity-50">
                    {['A','B','C','D'][i]}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {/* ── EXPLANATION SECTION ───────────────────────────────────── */}
            {isPractice && showFeedback && selected && (
              <div>
                {/* Result banner */}
                <div className={`rounded-xl px-4 py-3 mb-3 flex items-center gap-2 ${
                  selected === currentQ.correct_answer
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <span className="text-lg">
                    {selected === currentQ.correct_answer ? '✅' : '❌'}
                  </span>
                  <p className="font-semibold text-sm">
                    {selected === currentQ.correct_answer
                      ? 'Correct!'
                      : `Incorrect — Correct answer: ${currentQ.correct_answer}`
                    }
                  </p>
                </div>

                {/* Explanation gated section */}
                {!showExplanation ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      {planTier === 'free'
                        ? `See full 7-layer explanation (${expLeft ?? 5} free left today)`
                        : 'See full 7-layer explanation'
                      }
                    </p>
                    <button
                      onClick={handleShowExplanation}
                      className="px-6 py-2.5 bg-[#C9A84C] text-[#1E3A5F] font-bold rounded-lg text-sm hover:bg-yellow-400 transition"
                    >
                      💡 Show Explanation
                    </button>

                    {/* Coin prompt inline */}
                    {showCoinPrompt && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-yellow-800 mb-1">
                          Daily free limit reached! Use 20 coins?
                        </p>
                        <p className="text-xs text-yellow-600 mb-3">
                          You have {user?.coins || 0} coins
                        </p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={handleCoinUnlock}
                            disabled={(user?.coins || 0) < 20}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-bold disabled:opacity-40"
                          >
                            🪙 Use 20 Coins
                          </button>
                          <button
                            onClick={() => navigate('/pricing')}
                            className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold"
                          >
                            Upgrade to Pro
                          </button>
                        </div>
                        {(user?.coins || 0) < 20 && (
                          <button
                            onClick={() => navigate('/wallet')}
                            className="mt-2 text-xs text-yellow-700 underline"
                          >
                            Buy coins — ₹5 = 100 coins
                          </button>
                        )}
                      </div>
                    )}

                    {/* Upgrade prompt inline */}
                    {showUpgradePrompt && (
                      <div className="mt-4 bg-[#1E3A5F]/5 border border-[#1E3A5F]/20 rounded-xl p-4">
                        <p className="text-sm font-semibold text-[#1E3A5F] mb-1">
                          🔒 Upgrade for unlimited explanations
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          Pro — ₹199/month | Or buy 100 coins for ₹5
                        </p>
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button
                            onClick={() => navigate('/pricing')}
                            className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold"
                          >
                            Upgrade to Pro →
                          </button>
                          <button
                            onClick={() => navigate('/wallet')}
                            className="px-4 py-2 border border-[#C9A84C] text-[#92400E] rounded-lg text-sm font-semibold"
                          >
                            🪙 Buy Coins ₹5
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── 7-LAYER EXPLANATION ──────────────────────────────── */
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    {/* Layer tab bar */}
                    <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50">
                      {EXPLANATION_LAYERS.map((layer, idx) => {
                        const val = getLayerValue(layer)
                        if (!val) return null
                        return (
                          <button
                            key={layer.key}
                            onClick={() => setActiveLayer(idx)}
                            className={`flex-shrink-0 px-3 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                              activeLayer === idx
                                ? 'border-[#C9A84C] text-[#1E3A5F] bg-white'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {layer.icon} {layer.label}
                          </button>
                        )
                      })}
                    </div>

                    {/* Active layer content */}
                    <div className="p-5">
                      {(() => {
                        const layer = EXPLANATION_LAYERS[activeLayer]
                        const val   = getLayerValue(layer)
                        return (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl">{layer.icon}</span>
                              <span className="font-bold text-[#1E3A5F] text-sm">
                                {layer.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{val}</p>
                          </div>
                        )
                      })()}

                      {/* Layer navigation arrows */}
                      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setActiveLayer(i => Math.max(0, i - 1))}
                          disabled={activeLayer === 0}
                          className="text-xs text-gray-400 disabled:opacity-30 px-2 py-1 hover:text-gray-600"
                        >
                          ← Prev
                        </button>
                        <span className="text-xs text-gray-400">
                          Layer {activeLayer + 1} of {EXPLANATION_LAYERS.filter(l => getLayerValue(l)).length}
                        </span>
                        <button
                          onClick={() => setActiveLayer(i =>
                            Math.min(EXPLANATION_LAYERS.length - 1, i + 1)
                          )}
                          disabled={activeLayer >= EXPLANATION_LAYERS.length - 1}
                          className="text-xs text-gray-400 disabled:opacity-30 px-2 py-1 hover:text-gray-600"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── BOTTOM ACTION ROW ─────────────────────────────────────── */}
            <div className="flex items-center gap-3 mt-2">
              {currentIndex > 0 && (
                <button
                  onClick={() => { setShowFeedback(false); setCurrentIndex(i => i - 1) }}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50 text-sm"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 py-2.5 bg-[#1E3A5F] text-white font-semibold rounded-xl hover:bg-[#0F2140] transition text-sm"
              >
                {isLast ? 'Finish Test 🏁' : 'Next →'}
              </button>
            </div>

            {/* Report link */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowReportModal(true)}
                className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1 py-1"
              >
                🚩 Report a problem with this question
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── REPORT MODAL ─────────────────────────────────────────────────── */}
      {showReportModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setShowReportModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-base">🚩 Report Question</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  What's wrong? Our mentor will fix it.
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl p-1"
              >✕</button>
            </div>

            {/* Flag type grid */}
            <div className="p-4 grid grid-cols-2 gap-2">
              {FLAG_TYPES.map(ft => (
                <button
                  key={ft.id}
                  onClick={() => setReportType(ft.id)}
                  className={`p-3 rounded-xl border-2 text-left transition ${
                    reportType === ft.id
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-base mb-1">{ft.emoji}</div>
                  <div className={`text-xs font-semibold ${
                    reportType === ft.id ? 'text-red-700' : 'text-gray-700'
                  }`}>{ft.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-tight">{ft.desc}</div>
                </button>
              ))}
            </div>

            {/* Optional description */}
            <div className="px-4 pb-2">
              <textarea
                value={reportDesc}
                onChange={e => setReportDesc(e.target.value)}
                placeholder="Add details (optional) — helps our mentor fix it faster..."
                rows={2}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none outline-none focus:border-[#1E3A5F]"
              />
            </div>

            {/* Notice */}
            <div className="mx-4 mb-3 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
              📌 This question will be <strong>hidden for you immediately</strong>.
              Our subject mentor will review and fix it. If the same error is in other
              questions, all will be corrected automatically.
            </div>

            {/* Submit */}
            <div className="p-4 pt-0 flex gap-2">
              <button
                onClick={handleReportSubmit}
                disabled={!reportType || reportSubmitting}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${
                  !reportType
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {reportSubmitting ? '⏳ Reporting...' : '🚩 Submit Report'}
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}