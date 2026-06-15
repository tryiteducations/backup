import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// SEED QUESTIONS — covers Quant/Reasoning/English/GK, L1-L3
// TODO: replace with Supabase questions table query once populated
const SEED_QUESTIONS = [
  {
    id: 'q1',
    topic_id: 'quant-basics',
    difficulty: 'L1',
    question: 'What is 15% of 240?',
    options: ['32', '36', '38', '40'],
    correct_answer: '36',
    explanation: '15% of 240 = (15/100) × 240 = 36',
    explanation_factors: {
      concept: 'Percentage calculation: (percent/100) × number',
      formula: '(P/100) × N = Result',
      common_mistake: 'Confusing 15% with 1.5% (off by decimal)',
      shortcut: 'Split: 10% of 240 = 24; 5% = 12; total = 36',
      exam_relevance: 'SSC CGL, IBPS PO Quantitative Aptitude',
    },
    tags: ['ssc-cgl', 'ibps-po'],
    language: 'en',
  },
  {
    id: 'q2',
    topic_id: 'reasoning-series',
    difficulty: 'L2',
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['38', '40', '42', '44'],
    correct_answer: '42',
    explanation: 'Differences: 4, 6, 8, 10, 12 → next is 30+12 = 42',
    explanation_factors: {
      concept: 'Number series with increasing differences (arithmetic progression of differences)',
      formula: 'aₙ = aₙ₋₁ + (2n)',
      common_mistake: 'Missing that differences themselves form an AP',
      shortcut: 'Write differences first: 4,6,8,10 — clearly +2 each time',
      exam_relevance: 'SSC CHSL, Railway NTPC Reasoning',
    },
    tags: ['ssc-chsl', 'rrb-ntpc'],
    language: 'en',
  },
  {
    id: 'q3',
    topic_id: 'english-vocab',
    difficulty: 'L1',
    question: 'Choose the word closest in meaning to "ELOQUENT":',
    options: ['Silent', 'Fluent and persuasive', 'Confused', 'Aggressive'],
    correct_answer: 'Fluent and persuasive',
    explanation: 'Eloquent means having or exercising the power of fluent, forceful, and persuasive speech.',
    explanation_factors: {
      concept: 'Synonym identification — Latin root "eloqui" means to speak out',
      formula: 'Context: an eloquent speaker moves the audience with words',
      common_mistake: 'Confusing with "elegant" (stylish/graceful)',
      shortcut: 'Root: "loqui" = speak (e.g. loquacious, colloquial)',
      exam_relevance: 'UPSC, CAT, Bank PO English section',
    },
    tags: ['upsc', 'cat', 'ibps-po'],
    language: 'en',
  },
  {
    id: 'q4',
    topic_id: 'gk-india',
    difficulty: 'L1',
    question: 'Which article of the Indian Constitution abolishes untouchability?',
    options: ['Article 14', 'Article 17', 'Article 19', 'Article 21'],
    correct_answer: 'Article 17',
    explanation: 'Article 17 abolishes untouchability and its practice in any form is forbidden.',
    explanation_factors: {
      concept: 'Fundamental Rights under Part III of the Constitution',
      formula: 'Article 17 = Abolition of Untouchability',
      common_mistake: 'Confusing with Article 15 (prohibition of discrimination) or 16 (equality of opportunity)',
      shortcut: '14=Equality before law, 17=Untouchability abolished — remember sequence',
      exam_relevance: 'UPSC, SSC CGL GK, State PSC exams',
    },
    tags: ['upsc', 'ssc-cgl', 'state-psc'],
    language: 'en',
  },
  {
    id: 'q5',
    topic_id: 'quant-profit',
    difficulty: 'L2',
    question: 'A shopkeeper buys an article for ₹800 and sells it at 25% profit. What is the selling price?',
    options: ['₹900', '₹950', '₹1000', '₹1050'],
    correct_answer: '₹1000',
    explanation: 'SP = CP × (1 + P%) = 800 × 1.25 = ₹1000',
    explanation_factors: {
      concept: 'Profit and Loss: SP = CP + Profit = CP × (100+P%)/100',
      formula: 'SP = CP × (1 + P/100)',
      common_mistake: 'Adding 25 directly (₹825) instead of 25% of CP',
      shortcut: '25% of 800 = 200; SP = 800+200 = 1000',
      exam_relevance: 'SSC, Banking, Railway Quant section',
    },
    tags: ['ssc-cgl', 'ibps-po', 'rrb-ntpc'],
    language: 'en',
  },
  {
    id: 'q6',
    topic_id: 'reasoning-direction',
    difficulty: 'L2',
    question: 'Ravi walks 10 km North, then turns East and walks 6 km, then turns South and walks 10 km. How far is he from the starting point?',
    options: ['4 km', '6 km', '10 km', '16 km'],
    correct_answer: '6 km',
    explanation: 'North 10 and South 10 cancel out. He is 6 km East of start.',
    explanation_factors: {
      concept: 'Direction-sense: opposite directions cancel each other',
      formula: 'Net displacement = vector sum of movements',
      common_mistake: 'Adding all distances (10+6+10=26) instead of net displacement',
      shortcut: 'Draw it: N10 → E6 → S10 = back to same latitude, 6 km east',
      exam_relevance: 'SSC CHSL, Bank Clerk, Railway Reasoning',
    },
    tags: ['ssc-chsl', 'ibps-clerk', 'rrb'],
    language: 'en',
  },
  {
    id: 'q7',
    topic_id: 'english-grammar',
    difficulty: 'L1',
    question: 'Choose the correctly spelled word:',
    options: ['Accomodation', 'Accommodation', 'Acommodation', 'Accommodasion'],
    correct_answer: 'Accommodation',
    explanation: '"Accommodation" has double "c" and double "m".',
    explanation_factors: {
      concept: 'Spelling — double consonants: ac-com-mo-da-tion',
      formula: 'Mnemonic: "Accommodation has two cots and two mattresses" (2c, 2m)',
      common_mistake: 'Single "c" or single "m"',
      shortcut: 'Think: ACC + OMM + ODATION',
      exam_relevance: 'SSC CGL English, Bank PO, IELTS',
    },
    tags: ['ssc-cgl', 'ibps-po', 'ielts'],
    language: 'en',
  },
  {
    id: 'q8',
    topic_id: 'gk-science',
    difficulty: 'L2',
    question: 'Which gas is responsible for the greenhouse effect primarily?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'],
    correct_answer: 'Carbon Dioxide',
    explanation: 'CO₂ is the primary anthropogenic greenhouse gas trapping solar radiation in the atmosphere.',
    explanation_factors: {
      concept: 'Greenhouse effect: atmospheric gases absorb and re-emit infrared radiation',
      formula: 'Primary GHGs: CO₂, CH₄, N₂O, H₂O vapour',
      common_mistake: 'Saying Oxygen (O₂ is not a greenhouse gas)',
      shortcut: 'CO₂ = Carbon footprint = climate change — they go together',
      exam_relevance: 'UPSC, SSC, NEET Environmental Science',
    },
    tags: ['upsc', 'ssc-cgl', 'neet'],
    language: 'en',
  },
  {
    id: 'q9',
    topic_id: 'quant-time-work',
    difficulty: 'L3',
    question: 'A can complete a work in 12 days. B can complete it in 18 days. Working together, in how many days will they finish?',
    options: ['6.2 days', '7.2 days', '8 days', '9 days'],
    correct_answer: '7.2 days',
    explanation: '1-day work together = 1/12 + 1/18 = 3/36 + 2/36 = 5/36. Days = 36/5 = 7.2',
    explanation_factors: {
      concept: 'Time and Work: combined rate = sum of individual rates',
      formula: 'Days together = (A×B)/(A+B) = (12×18)/(12+18) = 216/30 = 7.2',
      common_mistake: 'Adding days directly (12+18=30) instead of rates',
      shortcut: 'LCM method: LCM(12,18)=36; A does 3 units/day, B does 2 → 5/day → 36/5=7.2',
      exam_relevance: 'SSC CGL, IBPS PO, CAT Quant',
    },
    tags: ['ssc-cgl', 'ibps-po', 'cat'],
    language: 'en',
  },
  {
    id: 'q10',
    topic_id: 'gk-sports',
    difficulty: 'L1',
    question: 'How many players are there in a cricket team?',
    options: ['9', '10', '11', '12'],
    correct_answer: '11',
    explanation: 'A standard cricket team consists of 11 players.',
    explanation_factors: {
      concept: 'Sports General Knowledge — team composition',
      formula: 'Cricket = 11 players per side',
      common_mistake: 'Confusing with football (11) or baseball (9)',
      shortcut: 'Cricket and football both = 11 (same for a reason — both British exports)',
      exam_relevance: 'SSC, Railway, Bank Clerk GK section',
    },
    tags: ['ssc-cgl', 'rrb-ntpc', 'ibps-clerk'],
    language: 'en',
  },
]

const PER_QUESTION_TIME = 30 // seconds for Speed mode
const MOCK_TOTAL_TIME = 10 * 60 // 10 minutes for Mock mode (for 10 Qs)

export default function ActiveTest() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const config = state || { mode: 'practice', count: 10, difficulty: 'adaptive' }

  const questions = SEED_QUESTIONS.slice(0, Math.min(Number(config.count) || 10, SEED_QUESTIONS.length))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { qId: selectedOption }
  const [flagged, setFlagged] = useState({}) // { qId: bool }
  const [timeLeft, setTimeLeft] = useState(
    config.mode === 'speed' ? PER_QUESTION_TIME : MOCK_TOTAL_TIME
  )
  const [showFeedback, setShowFeedback] = useState(false) // for practice mode instant feedback
  const timerRef = useRef(null)

  const currentQ = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const isPractice = config.mode === 'practice'
  const isSpeed = config.mode === 'speed'
  const isMock = config.mode === 'mock'

  // Timer
  useEffect(() => {
    if (isPractice) return // no timer in practice
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

  // Reset per-question timer in Speed mode on question change
  useEffect(() => {
    if (isSpeed) setTimeLeft(PER_QUESTION_TIME)
  }, [currentIndex])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleSelect = (option) => {
    if (selectedAnswers[currentQ.id] && isPractice) return // locked in practice after selecting
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: option }))
    if (isPractice) setShowFeedback(true)
  }

  const handleNext = (autoAdvance = false) => {
    setShowFeedback(false)
    if (isLast) {
      finishTest()
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const handleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
  }

  const finishTest = () => {
    clearInterval(timerRef.current)
    const answers = selectedAnswers
    const score = questions.filter(q => answers[q.id] === q.correct_answer).length
    navigate('/test-engine/result', {
      state: { questions, answers, score, config },
    })
  }

  const progressPct = ((currentIndex + 1) / questions.length) * 100
  const isFlagged = flagged[currentQ.id]
  const selected = selectedAnswers[currentQ.id]

  const optionStyle = (opt) => {
    if (!selected) return 'border-gray-200 bg-white hover:border-[var(--color-primary, #1E3A5F)] cursor-pointer'
    if (isPractice && showFeedback) {
      if (opt === currentQ.correct_answer) return 'border-green-500 bg-green-50 text-green-800'
      if (opt === selected && opt !== currentQ.correct_answer) return 'border-red-400 bg-red-50 text-red-700'
    }
    if (opt === selected) return 'border-[var(--color-primary, #1E3A5F)] bg-[var(--color-primary, #1E3A5F)] text-white'
    return 'border-gray-200 bg-white text-gray-500'
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Top bar */}
      <div className="bg-[var(--color-primary, #1E3A5F)] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">
            Q {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full capitalize">
            {config.mode}
          </span>
          {isFlagged && <span className="text-yellow-300 text-xs">🚩 Flagged</span>}
        </div>

        <div className="flex items-center gap-3">
          {!isPractice && (
            <div className={`font-mono text-sm font-bold px-3 py-1 rounded-lg ${
              timeLeft < 30 ? 'bg-red-500' : 'bg-white/20'
            }`}>
              {isSpeed ? `${timeLeft}s` : formatTime(timeLeft)}
            </div>
          )}
          <button
            onClick={handleFlag}
            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
              isFlagged
                ? 'bg-yellow-400 text-[var(--color-primary, #1E3A5F)] border-yellow-400'
                : 'border-white/30 hover:bg-white/10'
            }`}
          >
            🚩 {isFlagged ? 'Flagged' : 'Flag'}
          </button>
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
          className="h-full bg-[var(--color-accent, #D4AF37)] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

        {/* Difficulty badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-[var(--color-primary, #1E3A5F)]/10 text-[var(--color-primary, #1E3A5F)] px-2 py-0.5 rounded-full">
            {currentQ.difficulty}
          </span>
          <span className="text-xs text-gray-400 capitalize">{currentQ.topic_id.replace(/-/g, ' ')}</span>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-lg font-semibold text-gray-800 leading-relaxed">{currentQ.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!(selected && isPractice && showFeedback)}
              className={`w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium transition ${optionStyle(opt)}`}
            >
              <span className="mr-3 text-sm font-bold opacity-60">{['A','B','C','D'][i]}.</span>
              {opt}
            </button>
          ))}
        </div>

        {/* Practice mode explanation */}
        {isPractice && showFeedback && selected && (
          <div className={`rounded-2xl p-4 border ${
            selected === currentQ.correct_answer
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="font-semibold text-sm mb-2">
              {selected === currentQ.correct_answer ? '✅ Correct!' : `❌ Incorrect — Answer: ${currentQ.correct_answer}`}
            </div>
            <p className="text-sm text-gray-700">{currentQ.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-auto">
          {currentIndex > 0 && (
            <button
              onClick={() => { setShowFeedback(false); setCurrentIndex(i => i - 1) }}
              className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => handleNext()}
            className="flex-1 py-2.5 bg-[var(--color-primary, #1E3A5F)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark, #0F2140)] transition"
          >
            {isLast ? 'Finish Test' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
