// src/pages/brain-teaser/BrainTeaser.jsx
import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

// 7 teasers, indexed 0-6 (day-of-week: 0=Sun, 6=Sat)
const TEASERS = [
  {
    id: 0,
    emoji: '🌅',
    question:
      'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?',
    answer: 'An Echo',
    hint: 'Think about what happens in mountains or empty halls when you shout.',
    explanation:
      'An echo has no physical form, yet it "speaks" by repeating sound. It is triggered by the waves the wind carries or by a voice — hence "comes alive with wind."',
  },
  {
    id: 1,
    emoji: '🌙',
    question:
      'The more you take, the more you leave behind. What am I?',
    answer: 'Footsteps',
    hint: 'This is about movement, not consumption.',
    explanation:
      'Every step you take creates a footprint behind you. The more steps you take, the more footprints (footsteps) you leave behind.',
  },
  {
    id: 2,
    emoji: '🌊',
    question:
      'I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. I have roads, but no cars drive there. What am I?',
    answer: 'A Map',
    hint: 'You use this to find your way, but it is not a real place itself.',
    explanation:
      'A map represents real-world features — cities, mountains, water, roads — as symbols and drawings, but none of these things physically exist on the map itself.',
  },
  {
    id: 3,
    emoji: '🌿',
    question:
      'I am always in front of you but cannot be seen. What am I?',
    answer: 'The Future',
    hint: 'Think time, not space.',
    explanation:
      'The future is always "ahead" of you in time, but you cannot see or touch it — it hasn\'t happened yet.',
  },
  {
    id: 4,
    emoji: '🔥',
    question:
      'What has a head and a tail, but no body?',
    answer: 'A Coin',
    hint: 'You flip this when making a decision.',
    explanation:
      'A coin has a "head" side and a "tail" side, but no physical body between them — it is flat. A classic lateral-thinking trick that plays on body-part language.',
  },
  {
    id: 5,
    emoji: '⭐',
    question:
      'A man walks into a restaurant and orders albatross soup. After one sip, he goes home and kills himself. Why?',
    answer: 'He was a shipwreck survivor who ate his wife thinking it was albatross — the real soup confirmed it.',
    hint: 'He had eaten "albatross soup" before — but where, and under what conditions?',
    explanation:
      'A classic lateral thinking puzzle. He survived a shipwreck by eating "albatross" — but the restaurant soup tasted different, revealing the true nature of what he had eaten on the island. His guilt drove him to take his own life.',
  },
  {
    id: 6,
    emoji: '💫',
    question:
      'The person who makes it, sells it. The person who buys it, never uses it. The person who uses it, never knows they\'re using it. What is it?',
    answer: 'A Coffin',
    hint: 'Think of the full life-cycle of this object and who experiences each stage.',
    explanation:
      'A coffin is crafted and sold by an undertaker, bought by a family member after a death, and used by the deceased — who is unaware.',
  },
]

// Past 6 days excluding today
function getPastTeasers(todayIdx) {
  return Array.from({ length: 6 }, (_, i) => {
    const idx = ((todayIdx - i - 1) + 7) % 7
    return TEASERS[idx]
  })
}

export default function BrainTeaser() {
  const { user, addCoins } = useAuth()
  const [revealed, setRevealed] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [earnedToday, setEarnedToday] = useState(false)
  const [showPast, setShowPast] = useState(false)

  const todayIdx = new Date().getDay() // 0-6
  const today = TEASERS[todayIdx]
  const pastTeasers = getPastTeasers(todayIdx)

  useEffect(() => {
    const today_str = new Date().toDateString()
    const stored = localStorage.getItem('tryit_bt_date')
    if (stored === today_str) {
      setEarnedToday(true)
    }
  }, [])

  if (!user) return null

  function handleAttempt() {
    if (!earnedToday) {
      addCoins(10)
      localStorage.setItem('tryit_bt_date', new Date().toDateString())
      setEarnedToday(true)
    }
    setRevealing(true)
    setTimeout(() => {
      setRevealed(true)
      setRevealing(false)
    }, 800)
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <AppLayout title="Brain Teaser">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[var(--color-accent, #D4AF37)] text-sm font-bold uppercase tracking-widest mb-1">
            Daily Challenge
          </p>
          <h1
            className="text-3xl font-bold text-[var(--color-primary, #1E3A5F)] mb-1"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Brain Teaser
          </h1>
          <p className="text-gray-400 text-sm">
            {dayNames[todayIdx]}'s puzzle · Attempt for +10 coins
          </p>
        </div>

        {/* Today's Teaser Card */}
        <div
          className="rounded-2xl p-8 mb-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-primary, #1E3A5F) 0%, var(--color-primary-dark, #0F2140) 100%)' }}
        >
          <div className="text-5xl mb-5">{today.emoji}</div>
          <p
            className="text-white text-lg font-semibold leading-relaxed mb-6"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {today.question}
          </p>

          {!revealed && !revealing && (
            <button
              onClick={handleAttempt}
              className="bg-[var(--color-accent, #D4AF37)] hover:bg-[var(--color-accent-light, #E8C84A)] text-[var(--color-primary, #1E3A5F)] font-bold px-8 py-3 rounded-2xl text-base transition-all shadow-lg hover:shadow-xl"
            >
              {earnedToday ? 'Reveal Answer' : 'Attempt & Reveal (+10 coins)'}
            </button>
          )}

          {revealing && (
            <div className="flex justify-center items-center gap-2 text-[var(--color-accent, #D4AF37)] text-lg font-semibold animate-pulse">
              <span>🤔</span> Thinking…
            </div>
          )}

          {revealed && (
            <div className="bg-white bg-opacity-10 rounded-2xl p-5 text-left border border-white border-opacity-20">
              <p className="text-[var(--color-accent, #D4AF37)] font-bold text-sm uppercase tracking-wide mb-2">
                💡 Answer
              </p>
              <p
                className="text-white text-xl font-bold mb-3"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {today.answer}
              </p>
              <p className="text-blue-200 text-sm leading-relaxed">{today.explanation}</p>
            </div>
          )}

          {earnedToday && !revealed && (
            <p className="text-[var(--color-accent, #D4AF37)] text-xs mt-3">
              ✓ You already earned your coins today
            </p>
          )}

          {/* Decorative circles */}
          <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-white opacity-5" />
          <div className="absolute -right-4 -top-6 w-24 h-24 rounded-full bg-[var(--color-accent, #D4AF37)] opacity-10" />
        </div>

        {/* Hint */}
        {!revealed && (
          <details className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-6 cursor-pointer group">
            <summary className="font-semibold text-[var(--color-primary, #1E3A5F)] text-sm list-none flex items-center justify-between">
              <span>🔍 Need a hint?</span>
              <span className="text-gray-300 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">{today.hint}</p>
          </details>
        )}

        {/* Archive */}
        <div>
          <button
            onClick={() => setShowPast(!showPast)}
            className="w-full text-center text-sm font-semibold text-gray-400 hover:text-[var(--color-primary, #1E3A5F)] transition-all flex items-center justify-center gap-2 py-2"
          >
            📅 {showPast ? 'Hide' : 'Show'} Past Week's Teasers
          </button>

          {showPast && (
            <div className="mt-4 space-y-3">
              {pastTeasers.map((t, i) => {
                const dayLabel = dayNames[((todayIdx - i - 1) + 7) % 7]
                return (
                  <div
                    key={`past-${t.id}-${i}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{t.emoji}</span>
                      <span className="text-xs text-gray-400 font-medium">{dayLabel}</span>
                    </div>
                    <p className="text-gray-700 font-semibold text-sm mb-3 leading-snug">
                      {t.question}
                    </p>
                    <div className="bg-[#F8FAFC] rounded-xl p-3">
                      <p className="text-xs text-gray-400 font-semibold mb-0.5">Answer</p>
                      <p className="text-[var(--color-primary, #1E3A5F)] font-bold text-sm">{t.answer}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
