import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TiltCard from '../TiltCard'
import Particles from '../Particles'

const TABS = [
  { emoji: '🎓', label: 'Students',   desc: 'Prepare smarter, rank higher' },
  { emoji: '👨‍👩‍👧', label: 'Parents',    desc: 'Track and support your child' },
  { emoji: '🧑‍🏫', label: 'Mentors',    desc: 'Teach, earn, grow' },
  { emoji: '🏫', label: 'Institutes', desc: 'Manage your students at scale' },
]

export default function Hero() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50">
      <Particles count={18} />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex glass-gold px-4 py-2 rounded-2xl w-fit">
            <span className="text-sm font-semibold text-[#1E3A5F]">
              🚀 India's Most Complete Exam Platform
            </span>
          </div>

          <div>
            {['One App.', 'Every Exam.', 'Zero Barriers.'].map((line, i) => (
              <h1 key={line}
                className={`font-poppins font-extrabold leading-tight animate-word-reveal
                  ${i === 1 ? 'text-[#D4AF37] animate-float' : 'text-[#1E3A5F]'}`}
                style={{ fontSize: 'clamp(40px,6vw,72px)', animationDelay: `${i * 0.15}s` }}>
                {line}
              </h1>
            ))}
          </div>

          <p className="text-[#D4AF37] text-lg italic font-inter">Your Exam. Your Rank. Your Success.</p>

          <p className="text-slate-600 text-base leading-relaxed max-w-lg">
            75,000+ exam pathways — Class 6 to PhD, age 12 to 60+.
            Study in 40+ Indian languages. Real All-India rankings after every test.
          </p>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/login')} className="btn-gold px-8 py-4 rounded-2xl font-bold text-lg">
              Start Free →
            </button>
            <a href="#stats" className="btn-navy px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center">
              How It Works ↓
            </a>
          </div>

          <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-2xl w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-dot" />
            <span className="text-sm font-semibold text-slate-700">1,247 students studying right now</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {TABS.map((t, i) => (
              <button key={t.label} onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${activeTab === i ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          {activeTab !== null && (
            <p className="text-slate-500 text-sm -mt-3">{TABS[activeTab].desc}</p>
          )}
        </div>

        {/* Right — floating cards */}
        <div className="hidden lg:flex flex-col gap-5 items-center">
          <TiltCard>
            <div className="glass-dark rounded-2xl p-5 w-80">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-bold text-lg flex items-center justify-center">AK</div>
                <div>
                  <p className="text-white font-bold">Arjun K. · Tamil Nadu</p>
                  <p className="text-[#D4AF37] text-xs">👊 Level 4 · SSC CGL</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">"Moved from #8,432 to #1,243 in 30 days! 🔥"</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: '67%' }} />
                </div>
                <span className="text-[#D4AF37] text-xs font-bold">67% Ready</span>
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="clay rounded-2xl p-5 w-72 animate-float" style={{ animationDelay: '0.8s' }}>
              <p className="text-[#1E3A5F] font-bold mb-3">📊 Subject Accuracy</p>
              {[['Reasoning', 90], ['Quant', 82], ['GK', 75], ['English', 68]].map(([sub, val]) => (
                <div key={sub} className="flex items-center gap-2 mb-2">
                  <span className="text-slate-500 text-xs w-20">{sub}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${val >= 80 ? 'bg-green-500' : 'bg-[#D4AF37]'}`}
                      style={{ width: `${val}%` }} />
                  </div>
                  <span className="text-xs font-bold text-[#1E3A5F] w-8 text-right">{val}%</span>
                </div>
              ))}
            </div>
          </TiltCard>

          <TiltCard>
            <div className="clay-gold rounded-2xl p-4 w-64 text-center">
              <p className="text-[#1E3A5F] font-bold text-2xl">🏆 #1,243</p>
              <p className="text-[#1E3A5F]/70 text-sm mt-1">All India · SSC CGL</p>
              <p className="text-[#1E3A5F] font-semibold text-sm mt-2">↑ 142 positions this week</p>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  )
}
