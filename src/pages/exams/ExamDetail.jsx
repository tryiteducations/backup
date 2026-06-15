import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { id: 'overview', label: '📋 Overview' },
  { id: 'syllabus', label: '📚 Syllabus' },
  { id: 'pattern', label: '📝 Pattern' },
  { id: 'cutoffs', label: '📊 Cutoffs' },
  { id: 'resources', label: '🗂️ Resources' },
  { id: 'community', label: '💬 Community' },
]

// Sample syllabus placeholder structure per category
const SAMPLE_SYLLABUS = [
  { section: 'General Intelligence & Reasoning', topics: ['Analogies', 'Classification', 'Series', 'Coding-Decoding', 'Blood Relations', 'Direction Sense'] },
  { section: 'General Awareness', topics: ['Current Affairs', 'Indian History', 'Geography', 'Polity', 'Economy', 'Science & Technology'] },
  { section: 'Quantitative Aptitude', topics: ['Number System', 'Simplification', 'Percentage', 'Ratio & Proportion', 'Time & Work', 'Data Interpretation'] },
  { section: 'English Language', topics: ['Reading Comprehension', 'Cloze Test', 'Error Detection', 'Fill in the Blanks', 'Sentence Improvement'] },
]

const SAMPLE_PATTERN = [
  { paper: 'Tier I (Prelims)', sections: 4, questions: 100, marks: 200, duration: '60 min', negative: '0.50 per wrong' },
  { paper: 'Tier II (Mains)', sections: 3, questions: 150, marks: 300, duration: '2 hours', negative: '1.00 per wrong' },
]

export default function ExamDetail() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [exam, setExam] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch('/data/exams.json')
      .then(r => r.json())
      .then(data => {
        const found = (data.exams || []).find(e => e.id === examId)
        setExam(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [examId])

  useEffect(() => {
    if (user && exam) {
      const already = (user.exams || []).some(e => e.id === exam.id)
      setAdded(already)
    }
  }, [user, exam])

  const handleAddToMyExams = () => {
    if (!exam || added) return
    const currentExams = user?.exams || []
    updateUser({ exams: [...currentExams, { id: exam.id, name: exam.name, readiness: 0, examDate: null }] })
    setAdded(true)
  }

  if (loading) {
    return (
      <AppLayout title="Exam Detail">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="h-40 bg-gray-100 rounded-2xl animate-pulse mb-4" />
          <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
        </div>
      </AppLayout>
    )
  }

  if (!exam) {
    return (
      <AppLayout title="Exam Not Found">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-[var(--color-primary, #1E3A5F)] mb-2">Exam not found</h2>
          <p className="text-gray-500 text-sm mb-5">This exam may have been removed or the link is incorrect.</p>
          <button onClick={() => navigate('/exams')} className="px-5 py-2 bg-[var(--color-primary, #1E3A5F)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-primary-dark, #0F2140)] transition">
            Back to All Exams
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={exam.name}>
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Hero card */}
        <div className="bg-gradient-to-r from-[var(--color-primary, #1E3A5F)] to-[var(--color-primary-dark, #0F2140)] rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{exam.emoji || '📋'}</span>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-tight mb-1">{exam.name}</h1>
              <p className="text-blue-200 text-sm mb-3">{exam.body}</p>
              <div className="flex flex-wrap gap-2">
                {exam.level && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium capitalize">{exam.level}</span>
                )}
                {exam.category && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium capitalize">{exam.category.replace('_', ' ')}</span>
                )}
                {exam.vacancies && (
                  <span className="bg-[var(--color-accent, #D4AF37)]/90 text-[var(--color-primary, #1E3A5F)] px-3 py-1 rounded-full text-xs font-bold">{exam.vacancies} Vacancies</span>
                )}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => navigate('/test-engine', { state: { examId: exam.id, examName: exam.name } })}
              className="flex-1 min-w-[140px] bg-[var(--color-accent, #D4AF37)] hover:bg-[var(--color-accent-light, #E8C84A)] text-[var(--color-primary, #1E3A5F)] font-bold py-2.5 px-5 rounded-xl text-sm transition"
            >
              🚀 Start Practicing
            </button>
            <button
              onClick={handleAddToMyExams}
              disabled={added}
              className={`flex-1 min-w-[140px] font-semibold py-2.5 px-5 rounded-xl text-sm transition border-2 ${
                added
                  ? 'border-emerald-400 text-emerald-300 cursor-default'
                  : 'border-white text-white hover:bg-white hover:text-[var(--color-primary, #1E3A5F)]'
              }`}
            >
              {added ? '✅ Added to My Exams' : '➕ Add to My Exams'}
            </button>
            <button
              onClick={() => navigate(`/exams/${exam.id}/universe`)}
              className="flex-1 min-w-[140px] border-2 border-blue-300 text-blue-200 hover:bg-blue-300/10 font-semibold py-2.5 px-5 rounded-xl text-sm transition"
            >
              🌌 View Universe
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap bg-gray-100 p-1 rounded-xl mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-white text-[var(--color-primary, #1E3A5F)] shadow'
                  : 'text-gray-500 hover:text-[var(--color-primary, #1E3A5F)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-bold text-[var(--color-primary, #1E3A5F)] mb-4">About This Exam</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Conducting Body', value: exam.body || '—' },
                  { label: 'Level', value: exam.level ? exam.level.charAt(0).toUpperCase() + exam.level.slice(1) : '—' },
                  { label: 'Category', value: exam.category?.replace(/_/g, ' ') || '—' },
                  { label: 'Vacancies', value: exam.vacancies ? `${exam.vacancies}` : 'As per notification' },
                  { label: 'Application Fee', value: exam.price_inr ? `₹${exam.price_inr}` : 'Free' },
                ].map(item => (
                  <div key={item.label} className="bg-[#F8FAFC] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="font-semibold text-[var(--color-primary, #1E3A5F)] text-sm capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-700 font-medium">⚠️ Eligibility criteria vary. Always refer to the official notification from {exam.body || 'the conducting authority'} for the latest requirements.</p>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div>
              <h2 className="text-lg font-bold text-[var(--color-primary, #1E3A5F)] mb-1">Syllabus</h2>
              <p className="text-xs text-gray-400 mb-5">Indicative syllabus — refer to official notification for latest updates</p>
              <div className="space-y-4">
                {SAMPLE_SYLLABUS.map((sec, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-[var(--color-primary, #1E3A5F)] text-sm mb-3">{sec.section}</h3>
                    <div className="flex flex-wrap gap-2">
                      {sec.topics.map(t => (
                        <span key={t} className="text-xs bg-[#F8FAFC] border border-gray-200 text-gray-600 px-3 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pattern' && (
            <div>
              <h2 className="text-lg font-bold text-[var(--color-primary, #1E3A5F)] mb-1">Exam Pattern</h2>
              <p className="text-xs text-gray-400 mb-5">Sample structure — actual pattern may vary per notification</p>
              <div className="space-y-4">
                {SAMPLE_PATTERN.map((p, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="bg-[var(--color-primary, #1E3A5F)] text-white px-4 py-2.5">
                      <h3 className="font-bold text-sm">{p.paper}</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
                      {[
                        { label: 'Sections', val: p.sections },
                        { label: 'Questions', val: p.questions },
                        { label: 'Total Marks', val: p.marks },
                        { label: 'Duration', val: p.duration },
                      ].map(item => (
                        <div key={item.label} className="p-3 text-center">
                          <p className="text-xs text-gray-400">{item.label}</p>
                          <p className="font-bold text-[var(--color-primary, #1E3A5F)]">{item.val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 bg-red-50 text-xs text-red-600">
                      Negative Marking: {p.negative}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cutoffs' && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-base mb-2">Cutoffs Coming Soon</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Official cutoff data will be updated after each notification and result announcement.
              </p>
              <span className="mt-4 text-xs bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-medium">
                Updated after official notification
              </span>
            </div>
          )}

          {activeTab === 'resources' && (
            <div>
              <h2 className="text-lg font-bold text-[var(--color-primary, #1E3A5F)] mb-4">Study Resources</h2>
              <div className="space-y-3">
                {[
                  { icon: '📄', label: 'PDF Study Materials', desc: 'Topic-wise notes and question banks', action: () => navigate('/classroom/pdf') },
                  { icon: '🎯', label: 'Practice Tests', desc: 'Full-length and topic-wise mocks', action: () => navigate('/test-engine') },
                  { icon: '📺', label: 'Video Lessons', desc: 'Concept explanations by experts', action: () => navigate('/classroom') },
                ].map(item => (
                  <button key={item.label} onClick={item.action} className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[var(--color-accent, #D4AF37)] hover:bg-amber-50 transition text-left">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-[var(--color-primary, #1E3A5F)] text-sm">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <span className="ml-auto text-gray-300">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div>
              <h2 className="text-lg font-bold text-[var(--color-primary, #1E3A5F)] mb-4">Community Discussions</h2>
              <div className="bg-[#F8FAFC] rounded-xl p-5 text-center mb-4">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm text-gray-500 mb-3">
                  Discuss strategies, share tips, and get answers from fellow {exam.name} aspirants.
                </p>
                <button
                  onClick={() => navigate(`/guru-hub?exam=${exam.id}`)}
                  className="px-5 py-2 bg-[var(--color-primary, #1E3A5F)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-primary-dark, #0F2140)] transition"
                >
                  Open Guru Hub for {exam.name}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}