// src/pages/scholarships/ScholarshipHub.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SCHOLARSHIPS = [
  {
    id: 'nsp_merit',
    name: 'National Scholarship Portal - Merit Scholarship',
    provider: 'Ministry of Education, Govt. of India',
    amount: '₹12,000 - ₹20,000 / year',
    eligibility: 'Class 11-Postgraduate, 80%+ marks, family income < ₹6 lakh',
    deadline: 'Oct 31, 2025',
    category: 'Merit',
    emoji: '🏅',
    tags: ['Central Govt', 'Annual'],
  },
  {
    id: 'pm_scholarship',
    name: 'PM Scholarship Scheme for Defence Personnel',
    provider: 'Ministry of Defence',
    amount: '₹2,500 / month',
    eligibility: 'Wards of Ex-Servicemen / Coast Guard, pursuing degree/diploma',
    deadline: 'Nov 15, 2025',
    category: 'Merit',
    emoji: '🎖️',
    tags: ['Central Govt', 'Monthly'],
  },
  {
    id: 'inspire',
    name: 'INSPIRE Scholarship for Higher Education',
    provider: 'Department of Science & Technology',
    amount: '₹80,000 / year',
    eligibility: 'Top 1% in Class 12 boards, pursuing BSc / Integrated MSc in natural sciences',
    deadline: 'Dec 01, 2025',
    category: 'Merit',
    emoji: '🔬',
    tags: ['Science', 'Central Govt'],
  },
  {
    id: 'post_matric_obc',
    name: 'Post-Matric Scholarship for OBC Students',
    provider: 'Ministry of Social Justice & Empowerment',
    amount: 'Up to ₹15,000 / year',
    eligibility: 'OBC students in Class 11 and above, family income < ₹1 lakh',
    deadline: 'Jan 10, 2026',
    category: 'Need-based',
    emoji: '🤝',
    tags: ['Central Govt', 'OBC'],
  },
  {
    id: 'minority_scholarship',
    name: 'Pre & Post-Matric Scholarship for Minorities',
    provider: 'Ministry of Minority Affairs',
    amount: '₹1,000 - ₹10,000 / year',
    eligibility: 'Muslim, Christian, Sikh, Buddhist, Jain, Zoroastrian communities; family income < ₹2 lakh',
    deadline: 'Oct 15, 2025',
    category: 'Minority',
    emoji: '🌙',
    tags: ['Central Govt', 'Minority'],
  },
  {
    id: 'tn_first_gen',
    name: 'Tamil Nadu First Generation Graduate Scholarship',
    provider: 'Govt. of Tamil Nadu, Social Welfare Dept.',
    amount: '₹5,000 / year',
    eligibility: 'First in family to attend college; studying in TN colleges',
    deadline: 'Sep 30, 2025',
    category: 'State-specific',
    emoji: '🌟',
    tags: ['Tamil Nadu', 'First-Gen'],
  },
  {
    id: 'aicte_pragati',
    name: 'AICTE - Pragati Scholarship for Girls',
    provider: 'All India Council for Technical Education',
    amount: '₹30,000 / year',
    eligibility: 'Female students in AICTE-approved technical institutions, family income < ₹8 lakh',
    deadline: 'Dec 30, 2025',
    category: 'Minority',
    emoji: '👩‍💻',
    tags: ['Technical', 'Girls'],
  },
  {
    id: 'nmmss',
    name: 'National Means-cum-Merit Scholarship (NMMS)',
    provider: 'Department of School Education & Literacy',
    amount: '₹12,000 / year',
    eligibility: 'Class 9-12 students with 55%+, family income < ₹1.5 lakh',
    deadline: 'Feb 28, 2026',
    category: 'Need-based',
    emoji: '📚',
    tags: ['School Level', 'Central Govt'],
  },
]

const CATEGORIES = ['All', 'Merit', 'Need-based', 'Minority', 'State-specific']

function PublicHeader({ navigate }) {
  return (
    <div style={{ background:'#fff', borderBottom:'1px solid #E5E7EB' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
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

function ScholarshipContent() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [notified, setNotified] = useState({})

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tryit_scholarship_notify') || '{}')
      setNotified(stored)
    } catch {}
  }, [])

  const filtered =
    activeCategory === 'All'
      ? SCHOLARSHIPS
      : SCHOLARSHIPS.filter((s) => s.category === activeCategory)

  function toggleNotify(id) {
    const updated = { ...notified, [id]: !notified[id] }
    setNotified(updated)
    localStorage.setItem('tryit_scholarship_notify', JSON.stringify(updated))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Banner */}
      <div
        className="rounded-2xl px-6 py-5 mb-8 flex items-start gap-4"
        style={{ background: 'linear-gradient(135deg, var(--color-primary, #2D1B69) 0%, var(--color-primary-dark, #1A0D3D) 100%)' }}
      >
        <span className="text-3xl">🔔</span>
        <div>
          <p className="text-white font-semibold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Never miss a scholarship you deserve.
          </p>
          <p className="text-blue-200 text-sm mt-1">
            Toggle "Notify Me" on any scholarship below. We'll alert you when applications open or deadlines approach.
          </p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-[var(--color-primary, #2D1B69)] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[var(--color-primary, #2D1B69)] hover:text-[var(--color-primary, #2D1B69)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.emoji}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    s.category === 'Merit'
                      ? 'bg-blue-50 text-blue-700'
                      : s.category === 'Need-based'
                      ? 'bg-green-50 text-green-700'
                      : s.category === 'Minority'
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {s.category}
                </span>
              </div>
              <button
                onClick={() => toggleNotify(s.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  notified[s.id]
                    ? 'bg-[var(--color-accent, #F59E0B)] text-[var(--color-primary, #2D1B69)]'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {notified[s.id] ? '🔔 Notifying' : '🔕 Notify Me'}
              </button>
            </div>

            <div>
              <h3
                className="font-bold text-[var(--color-primary, #2D1B69)] text-base leading-snug"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {s.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{s.provider}</p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-[#064E3B] bg-green-50 px-2 py-0.5 rounded-lg">
                {s.amount}
              </span>
              <span className="text-red-500 font-medium">⏳ {s.deadline}</span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">{s.eligibility}</p>

            <div className="flex flex-wrap gap-1 mt-auto">
              {s.tags.map((tag) => (
                <span key={tag} className="text-xs bg-[#F8FAFC] border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500 text-lg font-semibold">No scholarships in this category yet.</p>
          <p className="text-gray-400 text-sm mt-1">Check back soon - we add new ones regularly.</p>
        </div>
      )}
    </div>
  )
}

export default function ScholarshipHub() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) {
    return (
      <AppLayout title="Scholarship Hub">
        <ScholarshipContent />
      </AppLayout>
    )
  }
  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC' }}>
      <PublicHeader navigate={navigate} />
      <ScholarshipContent />
    </div>
  )
}
