import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

// Generate an 8–12 week study plan structure per category
const generatePlan = (exam) => {
  const cat = exam?.category || ''

  if (['medical'].includes(cat)) {
    return [
      { week: 1, title: 'Biology Foundations', hours: 14, topics: ['Cell Biology', 'Genetics Basics', 'Human Physiology Intro'] },
      { week: 2, title: 'Chemistry Essentials', hours: 12, topics: ['Organic Chemistry Basics', 'Periodic Table', 'Chemical Bonding'] },
      { week: 3, title: 'Physics for NEET', hours: 12, topics: ['Mechanics', 'Thermodynamics', 'Optics'] },
      { week: 4, title: 'Plant & Animal Kingdom', hours: 10, topics: ['Classification', 'Morphology', 'Reproduction in Plants'] },
      { week: 5, title: 'Human Physiology', hours: 14, topics: ['Digestion', 'Circulation', 'Respiration', 'Excretion'] },
      { week: 6, title: 'Genetics & Evolution', hours: 12, topics: ['Mendel\'s Laws', 'Molecular Basis', 'Evolution Theory'] },
      { week: 7, title: 'Ecology & Environment', hours: 10, topics: ['Ecosystem', 'Biodiversity', 'Environmental Issues'] },
      { week: 8, title: 'Inorganic Chemistry', hours: 12, topics: ['d-block Elements', 'Coordination Compounds', 'Metallurgy'] },
      { week: 9, title: 'Organic Chemistry II', hours: 14, topics: ['Reaction Mechanisms', 'Aldehydes & Ketones', 'Amines'] },
      { week: 10, title: 'Full Mock Marathon', hours: 20, topics: ['3 Full-Length Tests', 'Analysis & Weak Area Drills', 'Previous Year Papers'] },
      { week: 11, title: 'Revision Sprint', hours: 16, topics: ['Formula Sheets', 'High-Weightage Topics', 'NCERT Line-by-Line'] },
      { week: 12, title: 'Final Lap', hours: 10, topics: ['Last 5 Years Papers', 'Time Management Practice', 'Exam Day Strategy'] },
    ]
  }

  if (['engineering', 'engineering_pg'].includes(cat)) {
    return [
      { week: 1, title: 'Maths Foundations', hours: 14, topics: ['Linear Algebra', 'Calculus', 'Probability'] },
      { week: 2, title: 'Core Subject I', hours: 14, topics: ['Data Structures', 'Algorithms', 'Time Complexity'] },
      { week: 3, title: 'Core Subject II', hours: 12, topics: ['Operating Systems', 'Process Management', 'Memory Management'] },
      { week: 4, title: 'Core Subject III', hours: 12, topics: ['DBMS', 'ER Model', 'SQL', 'Normalization'] },
      { week: 5, title: 'Networks & Security', hours: 12, topics: ['OSI Model', 'TCP/IP', 'Cryptography'] },
      { week: 6, title: 'Theory of Computation', hours: 10, topics: ['Automata', 'Context-Free Grammars', 'Turing Machines'] },
      { week: 7, title: 'Compiler Design', hours: 10, topics: ['Lexical Analysis', 'Parsing', 'Code Generation'] },
      { week: 8, title: 'Digital Logic & Architecture', hours: 12, topics: ['Boolean Algebra', 'Combinational Circuits', 'Pipelining'] },
      { week: 9, title: 'Full Mock Tests', hours: 18, topics: ['3 Full-Length GATE Mocks', 'Section-wise Analysis', 'Previous Year 2023-24'] },
      { week: 10, title: 'Revision & Weak Areas', hours: 16, topics: ['Formula Consolidation', 'Concept Maps', 'Shortcut Techniques'] },
    ]
  }

  if (['banking'].includes(cat)) {
    return [
      { week: 1, title: 'Quant Basics', hours: 10, topics: ['Number System', 'Percentage', 'Ratio & Proportion'] },
      { week: 2, title: 'Reasoning Fundamentals', hours: 10, topics: ['Analogies', 'Syllogism', 'Coding-Decoding'] },
      { week: 3, title: 'English Language', hours: 8, topics: ['Reading Comprehension', 'Fill in the Blanks', 'Error Detection'] },
      { week: 4, title: 'Advanced Quant', hours: 12, topics: ['Data Interpretation', 'Time-Speed-Distance', 'Probability'] },
      { week: 5, title: 'Reasoning Advanced', hours: 10, topics: ['Puzzles', 'Seating Arrangement', 'Input-Output'] },
      { week: 6, title: 'General Awareness', hours: 10, topics: ['Banking Awareness', 'Current Affairs Last 3 Months', 'Financial Terms'] },
      { week: 7, title: 'Prelims Mock Tests', hours: 14, topics: ['5 Sectional Tests', '3 Full-Length Prelims', 'Speed Drills'] },
      { week: 8, title: 'Mains Prep', hours: 12, topics: ['Advanced DI', 'GA Deep Dive', 'Descriptive Writing'] },
      { week: 9, title: 'Mains Mock Marathon', hours: 16, topics: ['3 Full Mains Tests', 'Previous Year Analysis', 'Error Log Review'] },
      { week: 10, title: 'Final Revision', hours: 10, topics: ['Formula Sheet', 'Trick Compilation', 'Mental Math Practice'] },
    ]
  }

  // Default (govt/central/railways/defence/teaching etc.)
  return [
    { week: 1, title: 'Syllabus Mapping', hours: 8, topics: ['Read official notification', 'Create topic checklist', 'Gather study materials'] },
    { week: 2, title: 'General Intelligence', hours: 10, topics: ['Analogies', 'Series', 'Classification', 'Matrix Problems'] },
    { week: 3, title: 'Quantitative Aptitude I', hours: 12, topics: ['Number System', 'Percentage', 'Profit & Loss', 'Simple & Compound Interest'] },
    { week: 4, title: 'Quantitative Aptitude II', hours: 12, topics: ['Time & Work', 'Speed & Distance', 'Data Interpretation'] },
    { week: 5, title: 'General Awareness I', hours: 10, topics: ['Indian History', 'Geography', 'Constitution & Polity'] },
    { week: 6, title: 'General Awareness II', hours: 10, topics: ['Economy', 'Science & Technology', 'Current Affairs'] },
    { week: 7, title: 'English Language', hours: 8, topics: ['Grammar Rules', 'Vocabulary', 'RC & Comprehension'] },
    { week: 8, title: 'Sectional Tests', hours: 12, topics: ['2 Quant Tests', '2 Reasoning Tests', '2 GA Tests'] },
    { week: 9, title: 'Full Mock Marathon', hours: 16, topics: ['3 Full-Length Mocks', 'Error Analysis', 'Previous Year Papers'] },
    { week: 10, title: 'Revision & Shortcut Sprint', hours: 12, topics: ['All formula sheets', 'Weak topics targeted', 'Speed drills'] },
  ]
}

export default function RoadmapPage() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [plan, setPlan] = useState([])
  const [checked, setChecked] = useState({}) // { 'w1-t0': true, ... }
  const [loading, setLoading] = useState(true)

  const STORAGE_KEY = `roadmap_${examId}`

  useEffect(() => {
    fetch('/data/exams.json')
      .then(r => r.json())
      .then(data => {
        const found = (data.exams || []).find(e => e.id === examId)
        setExam(found || null)
        const generatedPlan = generatePlan(found)
        setPlan(generatedPlan)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Load saved progress
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setChecked(JSON.parse(saved))
    } catch {}
  }, [examId])

  const toggleTopic = (weekIdx, topicIdx) => {
    const key = `w${weekIdx}-t${topicIdx}`
    setChecked(prev => {
      const updated = { ...prev, [key]: !prev[key] }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  // Calculate overall progress
  const totalTopics = plan.reduce((s, w) => s + w.topics.length, 0)
  const doneTopics = Object.values(checked).filter(Boolean).length
  const progressPct = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0

  if (loading) {
    return (
      <AppLayout title="Study Roadmap">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </AppLayout>
    )
  }

  if (!exam) {
    return (
      <AppLayout title="Study Roadmap">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h2 className="text-xl font-bold text-[var(--color-primary, #1E3A5F)] mb-2">Roadmap not found</h2>
          <button onClick={() => navigate('/exams')} className="px-5 py-2 bg-[var(--color-primary, #1E3A5F)] text-white rounded-xl text-sm font-semibold">
            Back to Exams
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={`Roadmap — ${exam.name}`}>
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{exam.emoji || '🗺️'}</span>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-primary, #1E3A5F)]">{exam.name} Study Plan</h1>
            <p className="text-xs text-gray-400">{plan.length}-week structured roadmap</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[var(--color-primary, #1E3A5F)]">Overall Progress</span>
            <span className="text-xl font-bold text-[var(--color-accent, #D4AF37)]">{progressPct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-accent, #D4AF37)] to-[var(--color-accent-light, #E8C84A)] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {doneTopics} of {totalTopics} topics completed
            {progressPct === 100 && ' 🎉 You\'re fully prepared!'}
          </p>
        </div>

        {/* Week cards */}
        <div className="space-y-4">
          {plan.map((week, wi) => {
            const weekDone = week.topics.filter((_, ti) => checked[`w${wi}-t${ti}`]).length
            const weekComplete = weekDone === week.topics.length

            return (
              <div
                key={week.week}
                className={`bg-white rounded-2xl shadow-sm border transition-all ${
                  weekComplete ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100'
                }`}
              >
                {/* Week header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      weekComplete ? 'bg-emerald-500 text-white' : 'bg-[var(--color-primary, #1E3A5F)] text-white'
                    }`}>
                      {weekComplete ? '✓' : `W${week.week}`}
                    </span>
                    <div>
                      <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-sm">{week.title}</h3>
                      <p className="text-xs text-gray-400">~{week.hours} hrs · {week.topics.length} topics</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {weekDone}/{week.topics.length}
                  </span>
                </div>

                {/* Topics */}
                <div className="px-5 py-3 space-y-2">
                  {week.topics.map((topic, ti) => {
                    const key = `w${wi}-t${ti}`
                    const isDone = !!checked[key]
                    return (
                      <button
                        key={ti}
                        onClick={() => toggleTopic(wi, ti)}
                        className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl transition-all text-left ${
                          isDone ? 'bg-emerald-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 transition-all ${
                          isDone ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                        }`}>
                          {isDone && <span className="text-white text-xs">✓</span>}
                        </span>
                        <span className={`text-sm transition-all ${isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {topic}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer CTAs */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate(`/exams/${examId}/universe`)}
            className="flex-1 py-3 rounded-xl border-2 border-[var(--color-primary, #1E3A5F)] text-[var(--color-primary, #1E3A5F)] font-semibold text-sm hover:bg-[var(--color-primary, #1E3A5F)] hover:text-white transition"
          >
            🌌 View Universe
          </button>
          <button
            onClick={() => navigate('/test-engine', { state: { examId: exam.id } })}
            className="flex-1 py-3 rounded-xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold text-sm hover:bg-[var(--color-accent-light, #E8C84A)] transition"
          >
            🚀 Practice Tests
          </button>
        </div>

        {progressPct > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Reset all progress for this roadmap?')) {
                setChecked({})
                try { localStorage.removeItem(STORAGE_KEY) } catch {}
              }
            }}
            className="w-full mt-3 text-center text-xs text-gray-300 hover:text-red-400 transition py-2"
          >
            Reset progress
          </button>
        )}
      </div>
    </AppLayout>
  )
}