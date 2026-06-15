// src/pages/achievements/Achievements.jsx
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const BADGES = [
  {
    id: 'first_test',
    emoji: '🎯',
    name: 'First Shot',
    desc: 'Completed your very first test',
    unlock: (u) => u.testsCompleted >= 1,
    color: 'var(--color-primary, #1E3A5F)',
    bg: 'var(--color-bg-muted, #EFF6FF)',
  },
  {
    id: 'streak_3',
    emoji: '🔥',
    name: '3-Day Streak',
    desc: 'Studied 3 days in a row',
    unlock: (u) => u.streak >= 3,
    color: '#7C2D12',
    bg: '#FFF7ED',
  },
  {
    id: 'streak_7',
    emoji: '🔥🔥',
    name: '7-Day Streak',
    desc: 'Studied 7 days in a row — relentless!',
    unlock: (u) => u.streak >= 7,
    color: '#7C2D12',
    bg: '#FFF7ED',
  },
  {
    id: 'streak_30',
    emoji: '💥',
    name: '30-Day Warrior',
    desc: 'A full month of unbroken study',
    unlock: (u) => u.streak >= 30,
    color: '#7C2D12',
    bg: '#FFF7ED',
  },
  {
    id: 'level_3',
    emoji: '📈',
    name: 'The Riser',
    desc: 'Reached Level 3',
    unlock: (u) => u.level >= 3,
    color: '#064E3B',
    bg: '#ECFDF5',
  },
  {
    id: 'level_5',
    emoji: '💪',
    name: 'The Grinder',
    desc: 'Reached Level 5 — half-way to legend',
    unlock: (u) => u.level >= 5,
    color: '#064E3B',
    bg: '#ECFDF5',
  },
  {
    id: 'level_10',
    emoji: '🌟',
    name: 'The Legend',
    desc: 'Maximum level achieved',
    unlock: (u) => u.level >= 10,
    color: '#064E3B',
    bg: '#ECFDF5',
  },
  {
    id: 'tests_10',
    emoji: '📚',
    name: '10 Tests Strong',
    desc: 'Completed 10 tests',
    unlock: (u) => u.testsCompleted >= 10,
    color: '#4C1D95',
    bg: '#F5F3FF',
  },
  {
    id: 'tests_50',
    emoji: '🏆',
    name: 'Century Chaser',
    desc: 'Completed 50 tests — formidable',
    unlock: (u) => u.testsCompleted >= 50,
    color: '#4C1D95',
    bg: '#F5F3FF',
  },
  {
    id: 'tests_100',
    emoji: '💯',
    name: '100 Tests Veteran',
    desc: '100 tests completed — you are unstoppable',
    unlock: (u) => u.testsCompleted >= 100,
    color: '#4C1D95',
    bg: '#F5F3FF',
  },
  {
    id: 'guru_first',
    emoji: '🧑‍🏫',
    name: 'First Guru Answer',
    desc: 'Answered your first question on Guru Hub',
    unlock: (u) => u.guruPoints >= 5,
    color: 'var(--color-accent, #D4AF37)',
    bg: '#FDF6E3',
  },
  {
    id: 'guru_100',
    emoji: '🦁',
    name: 'Baahuveer of Knowledge',
    desc: 'Earned 100+ Guru Points helping others',
    unlock: (u) => u.guruPoints >= 100,
    color: 'var(--color-accent, #D4AF37)',
    bg: '#FDF6E3',
  },
  {
    id: 'coins_500',
    emoji: '🪙',
    name: 'Coin Collector',
    desc: 'Accumulated 500 coins',
    unlock: (u) => u.coins >= 500,
    color: 'var(--color-primary, #1E3A5F)',
    bg: 'var(--color-bg-muted, #EFF6FF)',
  },
  {
    id: 'pro_member',
    emoji: '👑',
    name: 'Pro Member',
    desc: 'Upgraded to TryIT Pro',
    unlock: (u) => u.isPro,
    color: 'var(--color-accent, #D4AF37)',
    bg: '#FDF6E3',
  },
  {
    id: 'avg_score_80',
    emoji: '⭐',
    name: 'High Scorer',
    desc: 'Maintained 80%+ average score',
    unlock: (u) => u.avgScore >= 80,
    color: '#064E3B',
    bg: '#ECFDF5',
  },
]

export default function Achievements() {
  const { user } = useAuth()
  if (!user) return null

  const evaluated = BADGES.map((b) => ({
    ...b,
    unlocked: b.unlock(user),
  }))

  const unlockedCount = evaluated.filter((b) => b.unlocked).length
  const totalCount = evaluated.length

  return (
    <AppLayout title="Achievements">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress header */}
        <div
          className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: 'linear-gradient(135deg, var(--color-primary, #1E3A5F) 0%, var(--color-primary-dark, #0F2140) 100%)' }}
        >
          <div className="text-center sm:text-left flex-1">
            <p className="text-[var(--color-accent, #D4AF37)] text-xs font-bold uppercase tracking-widest mb-1">
              Your Progress
            </p>
            <h1
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {unlockedCount} / {totalCount} Unlocked
            </h1>
            <p className="text-blue-200 text-sm">
              Keep learning to unlock all {totalCount} achievements!
            </p>
          </div>

          {/* Circular progress */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke="var(--color-accent, #D4AF37)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(unlockedCount / totalCount) * 201} 201`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-bold text-lg">{Math.round((unlockedCount / totalCount) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Unlocked section */}
        {unlockedCount > 0 && (
          <div className="mb-8">
            <h2
              className="text-lg font-bold text-[var(--color-primary, #1E3A5F)] mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              ✅ Earned
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {evaluated
                .filter((b) => b.unlocked)
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="rounded-2xl p-4 text-center shadow-sm border"
                    style={{ backgroundColor: badge.bg, borderColor: `${badge.color}22` }}
                  >
                    <div className="text-4xl mb-2">{badge.emoji}</div>
                    <p
                      className="font-bold text-sm mb-1 leading-snug"
                      style={{ color: badge.color, fontFamily: 'Poppins, sans-serif' }}
                    >
                      {badge.name}
                    </p>
                    <p className="text-xs text-gray-400 leading-snug">{badge.desc}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Locked section */}
        <div>
          <h2
            className="text-lg font-bold text-gray-400 mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            🔒 Locked
          </h2>

          {evaluated.filter((b) => !b.unlocked).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🌟</div>
              <p className="text-[var(--color-accent, #D4AF37)] font-bold text-xl">All achievements unlocked!</p>
              <p className="text-gray-500 text-sm mt-2">You are an absolute legend.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {evaluated
                .filter((b) => !b.unlocked)
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="rounded-2xl p-4 text-center bg-gray-50 border border-gray-100"
                  >
                    <div className="text-4xl mb-2 grayscale opacity-40">{badge.emoji}</div>
                    <div className="text-gray-400 mb-1">
                      <span className="text-base">🔒</span>
                    </div>
                    <p
                      className="font-bold text-sm text-gray-400 mb-1 leading-snug"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {badge.name}
                    </p>
                    <p className="text-xs text-gray-300 leading-snug">{badge.desc}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Empty state for fresh user */}
        {unlockedCount === 0 && (
          <div className="mt-8 bg-[#FDF6E3] border border-[var(--color-accent, #D4AF37)] border-opacity-30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🚀</div>
            <p className="font-semibold text-[var(--color-primary, #1E3A5F)]">Your journey starts now!</p>
            <p className="text-gray-500 text-sm mt-1">
              Take your first test to unlock your first badge.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
