// src/pages/tryit-lab/TryITLab.jsx
import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const LAB_FEATURES = [
  {
    id: 'doubt_solver',
    emoji: '🧠',
    title: 'AI Doubt Solver',
    desc: 'Type any question from any subject — get a step-by-step explanation tailored to your exam pattern, with shortcuts and memory tips.',
    benefit: 'Instant clarity on any concept, anytime.',
    color: 'var(--color-primary, #1E3A5F)',
    bgColor: 'var(--color-bg-muted, #EFF6FF)',
    stage: 'Beta Testing',
  },
  {
    id: 'voice_practice',
    emoji: '🎙️',
    title: 'Voice-Based Practice',
    desc: 'Practice answering MCQs out loud. Our voice engine listens, evaluates fluency, and gives confidence scores — perfect for IELTS speaking and viva prep.',
    benefit: 'Speak your answers, not just click them.',
    color: '#064E3B',
    bgColor: '#ECFDF5',
    stage: 'In Development',
  },
  {
    id: 'handwriting_math',
    emoji: '✍️',
    title: 'Handwriting Recognition for Maths',
    desc: 'Write equations on your screen. We read your handwriting, parse the expression, and solve it step-by-step — works for algebra, calculus, and more.',
    benefit: 'Solve maths the way your brain thinks.',
    color: '#4C1D95',
    bgColor: '#F5F3FF',
    stage: 'In Development',
  },
  {
    id: 'mock_interview',
    emoji: '🎬',
    title: 'Mock Interview Simulator',
    desc: 'Face a simulated SSB / UPSC / campus interview with our AI interviewer. Get real-time feedback on your answers, body language cues, and confidence rating.',
    benefit: 'Walk into interviews ready, not nervous.',
    color: '#7C2D12',
    bgColor: '#FFF7ED',
    stage: 'Planned',
  },
]

export default function TryITLab() {
  const { user } = useAuth()
  const [notified, setNotified] = useState({})

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tryit_lab_notify') || '{}')
      setNotified(stored)
    } catch {}
  }, [])

  if (!user) return null

  function toggleNotify(id) {
    const updated = { ...notified, [id]: !notified[id] }
    setNotified(updated)
    localStorage.setItem('tryit_lab_notify', JSON.stringify(updated))
  }

  const stageColors = {
    'Beta Testing': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    'In Development': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    Planned: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  }

  return (
    <AppLayout title="TryIT Lab">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div
          className="rounded-2xl p-7 mb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-dark, #0F2140) 0%, var(--color-primary, #1E3A5F) 60%, #4C1D95 100%)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🧪</span>
              <span className="text-[var(--color-accent, #D4AF37)] text-sm font-bold uppercase tracking-widest">
                Experimental Zone
              </span>
            </div>
            <h1
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Welcome to TryIT Lab
            </h1>
            <p className="text-blue-200 text-sm max-w-xl">
              A sneak peek at features we're building just for you. These aren't ready yet — but they're coming.
              Register your interest and be the first to get access when they launch.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white opacity-5" />
          <div className="absolute -right-4 -bottom-12 w-56 h-56 rounded-full bg-[var(--color-accent, #D4AF37)] opacity-5" />
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {LAB_FEATURES.map((feature) => {
            const stage = stageColors[feature.stage]
            return (
              <div
                key={feature.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: feature.bgColor }}
                  >
                    {feature.emoji}
                  </div>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${stage.bg} ${stage.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${stage.dot} animate-pulse`} />
                    {feature.stage}
                  </span>
                </div>

                <div>
                  <h3
                    className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg mb-1"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>

                <div
                  className="text-sm font-semibold px-3 py-2 rounded-xl"
                  style={{ backgroundColor: feature.bgColor, color: feature.color }}
                >
                  ✦ {feature.benefit}
                </div>

                <button
                  onClick={() => toggleNotify(feature.id)}
                  className={`mt-auto w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    notified[feature.id]
                      ? 'bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)]'
                      : 'bg-[var(--color-primary, #1E3A5F)] text-white hover:bg-[var(--color-primary-dark, #0F2140)]'
                  }`}
                >
                  {notified[feature.id]
                    ? '🔔 You\'ll be notified at launch'
                    : 'Notify Me When Available'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-xs mt-8">
          Lab features are experimental previews. Final functionality may differ. Your feedback shapes what we build next.
        </p>
      </div>
    </AppLayout>
  )
}
