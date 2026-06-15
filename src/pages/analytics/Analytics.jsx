// src/pages/analytics/Analytics.jsx
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const SAMPLE_TRENDS = [62, 70, 67, 78, 74, 83, 88]
const TREND_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WEAK_TOPICS = [
  { name: 'Profit & Loss', subject: 'Quantitative Aptitude', accuracy: 38, emoji: '📉' },
  { name: 'Data Interpretation', subject: 'Reasoning', accuracy: 44, emoji: '📊' },
  { name: 'Modern Indian History', subject: 'General Studies', accuracy: 51, emoji: '🏛️' },
  { name: 'Mensuration', subject: 'Mathematics', accuracy: 33, emoji: '📐' },
  { name: 'Computer Networks', subject: 'Computer Awareness', accuracy: 49, emoji: '🌐' },
]

const TIME_BREAKDOWN = [
  { subject: 'Quantitative Aptitude', hours: 4.5, color: 'var(--color-primary, #1E3A5F)', pct: 36 },
  { subject: 'Reasoning', hours: 3.0, color: 'var(--color-accent, #D4AF37)', pct: 24 },
  { subject: 'General Studies', hours: 2.5, color: '#064E3B', pct: 20 },
  { subject: 'English', hours: 2.0, color: '#4C1D95', pct: 16 },
  { subject: 'Current Affairs', hours: 0.5, color: '#7C2D12', pct: 4 },
]

function SVGLineChart({ data, labels }) {
  const w = 500
  const h = 160
  const pad = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerW = w - pad.left - pad.right
  const innerH = h - pad.top - pad.bottom

  const min = Math.min(...data) - 10
  const max = 100
  const range = max - min

  const points = data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top + innerH - ((v - min) / range) * innerH,
    v,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaD = `${pathD} L${points[points.length - 1].x},${pad.top + innerH} L${points[0].x},${pad.top + innerH} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 180 }}>
      {/* Y gridlines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = pad.top + innerH - ((v - min) / range) * innerH
        if (y < pad.top || y > pad.top + innerH) return null
        return (
          <g key={v}>
            <line x1={pad.left} x2={pad.left + innerW} y1={y} y2={y} stroke="var(--color-bg-muted-2, #F1F5F9)" strokeWidth="1" />
            <text x={pad.left - 6} y={y + 4} fontSize="10" fill="#94A3B8" textAnchor="end">{v}</text>
          </g>
        )
      })}
      {/* Area fill */}
      <path d={areaD} fill="var(--color-primary, #1E3A5F)" fillOpacity="0.07" />
      {/* Line */}
      <path d={pathD} fill="none" stroke="var(--color-primary, #1E3A5F)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="var(--color-accent, #D4AF37)" stroke="white" strokeWidth="2" />
          <text x={p.x} y={p.y - 10} fontSize="10" fill="var(--color-primary, #1E3A5F)" textAnchor="middle" fontWeight="600">
            {p.v}%
          </text>
        </g>
      ))}
      {/* X labels */}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={pad.top + innerH + 18} fontSize="10" fill="#94A3B8" textAnchor="middle">
          {labels[i]}
        </text>
      ))}
    </svg>
  )
}

export default function Analytics() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const hasSubjects = user.subjects && user.subjects.length > 0
  const hasTests = user.testsCompleted > 0

  const subjects = hasSubjects
    ? user.subjects
    : [
        { name: 'Quantitative Aptitude', accuracy: 72, trend: 'up', emoji: '🔢' },
        { name: 'Reasoning', accuracy: 65, trend: 'up', emoji: '🧩' },
        { name: 'General Studies', accuracy: 58, trend: 'down', emoji: '📚' },
        { name: 'English', accuracy: 80, trend: 'stable', emoji: '✍️' },
        { name: 'Current Affairs', accuracy: 55, trend: 'up', emoji: '📰' },
      ]

  const maxAcc = Math.max(...subjects.map((s) => s.accuracy), 1)

  return (
    <AppLayout title="Analytics">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Section 1: Subject Accuracy */}
        <section>
          <h2
            className="text-xl font-bold text-[var(--color-primary, #1E3A5F)] mb-1"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Subject Accuracy
          </h2>
          <p className="text-gray-400 text-sm mb-4">Performance breakdown across your subjects</p>

          {!hasSubjects && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2 text-amber-700 text-sm font-medium mb-4">
              Showing sample data — take a test to unlock your real analytics.
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            {subjects.map((sub) => (
              <div key={sub.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    {sub.emoji} {sub.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        sub.trend === 'up'
                          ? 'text-green-600'
                          : sub.trend === 'down'
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {sub.trend === 'up' ? '↑' : sub.trend === 'down' ? '↓' : '→'}
                    </span>
                    <span className="text-sm font-bold text-[var(--color-primary, #1E3A5F)]">{sub.accuracy}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${(sub.accuracy / maxAcc) * 100}%`,
                      background:
                        sub.accuracy >= 70
                          ? '#064E3B'
                          : sub.accuracy >= 50
                          ? 'var(--color-accent, #D4AF37)'
                          : '#7C2D12',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Score Trend */}
        <section>
          <h2
            className="text-xl font-bold text-[var(--color-primary, #1E3A5F)] mb-1"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Score Trend
          </h2>
          <p className="text-gray-400 text-sm mb-4">Your score percentage over the last 7 days</p>

          {!hasTests ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <div className="text-5xl mb-3">📈</div>
              <p className="text-gray-500 font-semibold">No test data yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-4">
                Take a few tests to see your score trend here.
              </p>
              <button
                onClick={() => navigate('/test-engine')}
                className="bg-[var(--color-primary, #1E3A5F)] text-white px-6 py-2.5 rounded-2xl font-semibold text-sm hover:bg-[var(--color-primary-dark, #0F2140)] transition-all"
              >
                Take a Test →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <SVGLineChart data={SAMPLE_TRENDS} labels={TREND_LABELS} />
            </div>
          )}

          {hasTests && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <SVGLineChart data={SAMPLE_TRENDS} labels={TREND_LABELS} />
            </div>
          )}

          {!hasTests && null /* already rendered above */}
        </section>

        {/* Section 3: Time Spent */}
        <section>
          <h2
            className="text-xl font-bold text-[var(--color-primary, #1E3A5F)] mb-1"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Time Spent
          </h2>
          <p className="text-gray-400 text-sm mb-4">How you've distributed your study hours</p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {/* Segmented bar */}
            <div className="flex rounded-xl overflow-hidden h-6 mb-5">
              {TIME_BREAKDOWN.map((t) => (
                <div
                  key={t.subject}
                  style={{ width: `${t.pct}%`, backgroundColor: t.color }}
                  title={`${t.subject}: ${t.hours}h`}
                />
              ))}
            </div>
            <div className="space-y-2.5">
              {TIME_BREAKDOWN.map((t) => (
                <div key={t.subject} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-sm text-gray-600">{t.subject}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{t.hours}h</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Weak Topics */}
        <section>
          <h2
            className="text-xl font-bold text-[var(--color-primary, #1E3A5F)] mb-1"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Weak Topics
          </h2>
          <p className="text-gray-400 text-sm mb-4">Focus here to maximise your score gains</p>

          {!hasTests ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <div className="text-5xl mb-3">🎯</div>
              <p className="text-gray-500 font-semibold">No weak topics identified yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-4">
                Complete a test to see where you need to improve.
              </p>
              <button
                onClick={() => navigate('/test-engine')}
                className="bg-[var(--color-primary, #1E3A5F)] text-white px-6 py-2.5 rounded-2xl font-semibold text-sm hover:bg-[var(--color-primary-dark, #0F2140)] transition-all"
              >
                Take a Test →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {WEAK_TOPICS.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t.emoji}</span>
                    <div>
                      <p className="font-semibold text-[var(--color-primary, #1E3A5F)] text-sm">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{
                        background: '#FFF3D6',
                        color: '#92400E',
                      }}
                    >
                      {t.accuracy}% accuracy
                    </span>
                    <button
                      onClick={() => navigate('/test-engine')}
                      className="text-xs font-semibold text-[var(--color-primary, #1E3A5F)] hover:text-[var(--color-accent, #D4AF37)] transition-all whitespace-nowrap"
                    >
                      Practice →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  )
}
