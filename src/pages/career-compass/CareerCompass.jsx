// src/pages/career-compass/CareerCompass.jsx
import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const QUESTIONS = [
  {
    id: 1,
    question: 'What kind of work excites you most?',
    options: [
      { label: 'Solving complex problems & equations', tags: ['analytical'] },
      { label: 'Helping and serving people', tags: ['service'] },
      { label: 'Leading, managing, and organising', tags: ['leadership'] },
      { label: 'Creating art, music, or language', tags: ['creative'] },
    ],
  },
  {
    id: 2,
    question: 'Which school subject did you enjoy the most?',
    options: [
      { label: 'Mathematics & Science', tags: ['analytical', 'engineering'] },
      { label: 'History, Civics & Social Studies', tags: ['service', 'govt'] },
      { label: 'Biology & Life Sciences', tags: ['medical'] },
      { label: 'Languages & Literature', tags: ['creative', 'language'] },
    ],
  },
  {
    id: 3,
    question: 'Where would you love to work?',
    options: [
      { label: 'Government office or public sector', tags: ['govt', 'service'] },
      { label: 'Hospital, clinic, or research lab', tags: ['medical'] },
      { label: 'Bank, finance firm, or startup', tags: ['banking', 'analytical'] },
      { label: 'Army, Navy, or Paramilitary', tags: ['defence'] },
    ],
  },
  {
    id: 4,
    question: 'How do you prefer to work?',
    options: [
      { label: 'Independently, with deep focus', tags: ['analytical', 'engineering'] },
      { label: 'In a team, collaborating daily', tags: ['service', 'leadership'] },
      { label: 'In the field, on-the-ground action', tags: ['defence', 'govt'] },
      { label: 'Flexibly, across creative projects', tags: ['creative', 'language'] },
    ],
  },
  {
    id: 5,
    question: 'What motivates you most in a career?',
    options: [
      { label: 'Job security & steady income', tags: ['govt', 'banking'] },
      { label: 'Making a social difference', tags: ['service', 'medical'] },
      { label: 'Prestige & national pride', tags: ['defence', 'leadership'] },
      { label: 'Innovation & solving new problems', tags: ['analytical', 'engineering'] },
    ],
  },
  {
    id: 6,
    question: 'Which of these activities do you enjoy?',
    options: [
      { label: 'Reading current affairs & news', tags: ['govt', 'service'] },
      { label: 'Coding, electronics, or building things', tags: ['engineering', 'analytical'] },
      { label: 'Fitness, sports, and physical training', tags: ['defence'] },
      { label: 'Teaching, writing, or public speaking', tags: ['creative', 'leadership'] },
    ],
  },
  {
    id: 7,
    question: 'What level of education are you aiming for?',
    options: [
      { label: 'Diploma / 12th pass entry level', tags: ['railway', 'govt'] },
      { label: "Bachelor's degree (B.Tech / MBBS / BA)", tags: ['engineering', 'medical', 'creative'] },
      { label: "Master's / Postgraduate (GATE / PG)", tags: ['analytical', 'engineering'] },
      { label: 'Professional certification (CA, CFA, IELTS)', tags: ['banking', 'language'] },
    ],
  },
  {
    id: 8,
    question: 'Which describes your ideal life?',
    options: [
      { label: 'Stable, respected, government servant', tags: ['govt', 'service'] },
      { label: 'High-earning professional in industry', tags: ['banking', 'engineering'] },
      { label: 'Healer saving lives every day', tags: ['medical'] },
      { label: 'Defender of the nation', tags: ['defence'] },
    ],
  },
]

const EXAM_PATHS = [
  {
    id: 'upsc',
    name: 'UPSC Civil Services (IAS/IPS)',
    emoji: '🏛️',
    tags: ['govt', 'leadership', 'service'],
    desc: 'India\'s most prestigious exam for IAS, IPS, IFS officers. Shape national policy.',
    category: 'govt_central',
    color: 'var(--color-primary, #1E3A5F)',
  },
  {
    id: 'banking',
    name: 'Banking & Finance (IBPS / SBI)',
    emoji: '🏦',
    tags: ['banking', 'analytical'],
    desc: 'Join India\'s leading public-sector banks as a Probationary Officer or Clerk.',
    category: 'banking',
    color: '#064E3B',
  },
  {
    id: 'gate',
    name: 'GATE / IIT Postgraduate',
    emoji: '⚙️',
    tags: ['engineering', 'analytical'],
    desc: 'Gateway to IIT/NIT M.Tech seats and PSU jobs in core engineering sectors.',
    category: 'engineering_pg',
    color: '#4C1D95',
  },
  {
    id: 'neet',
    name: 'NEET-UG / MBBS Abroad',
    emoji: '🩺',
    tags: ['medical'],
    desc: 'Become a doctor via NEET-UG for Indian colleges or MBBS abroad pathways.',
    category: 'medical',
    color: '#7C2D12',
  },
  {
    id: 'defence',
    name: 'NDA / CDS / AFCAT',
    emoji: '🎖️',
    tags: ['defence'],
    desc: 'Serve the nation in Army, Navy, or Air Force as a commissioned officer.',
    category: 'defence',
    color: 'var(--color-primary, #1E3A5F)',
  },
  {
    id: 'ssc',
    name: 'SSC CGL / MTS / CHSL',
    emoji: '📋',
    tags: ['govt', 'service'],
    desc: 'Thousands of central government vacancies across departments every year.',
    category: 'govt_central',
    color: '#064E3B',
  },
  {
    id: 'railway',
    name: 'Railway Recruitment (RRB)',
    emoji: '🚆',
    tags: ['railway', 'govt'],
    desc: 'Join Indian Railways — one of the world\'s largest employers with 1 lakh+ seats.',
    category: 'railways',
    color: '#4C1D95',
  },
  {
    id: 'ielts',
    name: 'IELTS / TOEFL / Language Certs',
    emoji: '🌐',
    tags: ['language', 'creative'],
    desc: 'Open doors to study or work abroad with internationally recognised language tests.',
    category: 'foreign_language',
    color: '#7C2D12',
  },
]

function scoreExams(answers) {
  const tagCounts = {}
  answers.forEach((ans) => {
    ans.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  return EXAM_PATHS.map((path) => ({
    ...path,
    score: path.tags.reduce((sum, tag) => sum + (tagCounts[tag] || 0), 0),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

export default function CareerCompass() {
  const { user } = useAuth()
  const [step, setStep] = useState(0) // 0 = intro, 1-8 = questions, 9 = results
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])
  const [added, setAdded] = useState({})

  if (!user) return null

  const currentQ = QUESTIONS[step - 1]

  function handleStart() {
    setStep(1)
    setAnswers([])
    setSelected(null)
  }

  function handleNext() {
    if (selected === null) return
    const newAnswers = [...answers, selected]
    if (step === 8) {
      setResults(scoreExams(newAnswers))
      setStep(9)
    } else {
      setAnswers(newAnswers)
      setStep(step + 1)
      setSelected(null)
    }
  }

  function handleAddExam(examId) {
    setAdded((prev) => ({ ...prev, [examId]: true }))
  }

  function handleRetake() {
    setStep(0)
    setAnswers([])
    setSelected(null)
    setResults([])
    setAdded({})
  }

  return (
    <AppLayout title="Career Compass">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Intro */}
        {step === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🧭</div>
            <h1 className="text-3xl font-bold text-[var(--color-primary, #1E3A5F)] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Career Compass
            </h1>
            <p className="text-gray-600 mb-2 text-lg">
              Answer 8 quick questions and discover which exam paths match your strengths, interests, and goals.
            </p>
            <p className="text-sm text-gray-400 mb-8">Takes about 2 minutes · No wrong answers</p>
            <button
              onClick={handleStart}
              className="bg-[var(--color-accent, #D4AF37)] hover:bg-[var(--color-accent-light, #E8C84A)] text-[var(--color-primary, #1E3A5F)] font-bold px-8 py-3 rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Find My Path →
            </button>
          </div>
        )}

        {/* Questions */}
        {step >= 1 && step <= 8 && currentQ && (
          <div>
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i < step - 1
                      ? 'bg-[var(--color-accent, #D4AF37)] w-6'
                      : i === step - 1
                      ? 'bg-[var(--color-primary, #1E3A5F)] w-8'
                      : 'bg-gray-200 w-2'
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-gray-400 text-center mb-2">Question {step} of 8</p>
            <h2
              className="text-2xl font-bold text-[var(--color-primary, #1E3A5F)] text-center mb-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(opt)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all font-medium text-gray-700 ${
                    selected === opt
                      ? 'border-[var(--color-accent, #D4AF37)] bg-[#FDF6E3] text-[var(--color-primary, #1E3A5F)]'
                      : 'border-gray-200 bg-white hover:border-[var(--color-primary, #1E3A5F)] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!selected}
              className={`mt-6 w-full py-3 rounded-2xl font-bold text-lg transition-all ${
                selected
                  ? 'bg-[var(--color-primary, #1E3A5F)] text-white hover:bg-[var(--color-primary-dark, #0F2140)] shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step === 8 ? 'See My Results →' : 'Next →'}
            </button>
          </div>
        )}

        {/* Results */}
        {step === 9 && (
          <div>
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎯</div>
              <h2
                className="text-2xl font-bold text-[var(--color-primary, #1E3A5F)] mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Your Top Exam Paths
              </h2>
              <p className="text-gray-500">Based on your answers, these paths suit you best.</p>
            </div>

            <div className="space-y-4 mb-8">
              {results.map((exam, i) => (
                <div
                  key={exam.id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                >
                  <div className="h-1.5" style={{ backgroundColor: exam.color }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{exam.emoji}</span>
                        <div>
                          {i === 0 && (
                            <span className="text-xs font-semibold text-[var(--color-accent, #D4AF37)] uppercase tracking-wide">
                              Best Match
                            </span>
                          )}
                          <h3
                            className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg leading-tight"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {exam.name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">{exam.desc}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddExam(exam.id)}
                      className={`mt-4 w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        added[exam.id]
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-[var(--color-primary, #1E3A5F)] text-white hover:bg-[var(--color-primary-dark, #0F2140)]'
                      }`}
                    >
                      {added[exam.id] ? '✓ Added to My Exams' : '+ Add to My Exams'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleRetake}
              className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold hover:border-[var(--color-primary, #1E3A5F)] hover:text-[var(--color-primary, #1E3A5F)] transition-all"
            >
              Retake the Quiz
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
