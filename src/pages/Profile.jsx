import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import StudentIDCard from '../components/profile/StudentIDCard'
import { BADGES, LEVELS, getLevelInfo } from '../data/mockSeeds'

const TABS = ['Overview','ID Card','Badges','Exams','Stats']

export default function Profile() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState('Overview')
  const levelInfo = getLevelInfo(user?.xp)

  return (
    <AppLayout>
      {/* Hero */}
      <div className="clay-dark rounded-3xl p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-extrabold text-3xl flex items-center justify-center ring-4 ring-white/20">
              {user?.initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--color-accent, #D4AF37)] flex items-center justify-center text-lg">
              {user?.levelEmoji}
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white font-poppins">{user?.name}</h1>
            <p className="text-[var(--color-accent, #D4AF37)] font-semibold mt-1">{user?.levelEmoji} Level {user?.level} — {user?.levelTitle}</p>
            <p className="text-white/60 text-sm mt-1">📍 {user?.city}, {user?.state}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {user?.isPro && <span className="clay-gold text-[var(--color-primary, #1E3A5F)] text-xs font-bold px-3 py-1 rounded-full">⚡ PRO MEMBER</span>}
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">Joined {user?.joinDate}</span>
              <span className="bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full font-mono">{user?.userId}</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Level {user?.level} — {user?.levelTitle}</span>
            <span className="text-[var(--color-accent, #D4AF37)] font-bold">{user?.xp.toLocaleString()} / {user?.xpToNext.toLocaleString()} XP</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div className="bg-[var(--color-accent, #D4AF37)] h-3 rounded-full transition-all duration-1000"
              style={{ width:`${(user?.xp / user?.xpToNext) * 100}%` }} />
          </div>
          <p className="text-white/40 text-xs mt-1">
            {(user?.xpToNext - user?.xp).toLocaleString()} XP to {LEVELS[user?.level]?.title || 'Max Level'}
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon:'🏆', val:`#${user?.rank.toLocaleString()}`, label:'All India Rank' },
          { icon:'🔥', val:`${user?.streak} days`, label:'Study Streak' },
          { icon:'📝', val:user?.testsCompleted, label:'Tests Completed' },
          { icon:'📊', val:`${user?.avgScore}%`, label:'Average Score' },
        ].map(s => (
          <div key={s.label} className="clay rounded-2xl p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-[var(--color-accent, #D4AF37)] font-poppins">{s.val}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-2xl font-semibold text-sm whitespace-nowrap flex-shrink-0 transition-all
              ${tab === t ? 'bg-[var(--color-primary, #1E3A5F)] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[var(--color-accent, #D4AF37)]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="clay rounded-2xl p-5">
            <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] mb-3">📊 Subject Performance</h3>
            {user?.subjects.map(s => (
              <div key={s.name} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{s.emoji} {s.name}</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-bold ${s.trend==='up'?'text-green-500':'text-red-500'}`}>
                      {s.trend==='up'?'↑':'↓'}
                    </span>
                    <span className="text-sm font-bold text-[var(--color-primary, #1E3A5F)]">{s.accuracy}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${s.accuracy>=80?'bg-green-500':s.accuracy>=70?'bg-[var(--color-accent, #D4AF37)]':'bg-amber-500'}`}
                    style={{ width:`${s.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="clay rounded-2xl p-5">
            <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] mb-3">🎯 Exam Readiness</h3>
            {user?.exams.map(e => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-[var(--color-primary, #1E3A5F)]">{e.name}</span>
                  <span className="text-sm font-bold text-[var(--color-accent, #D4AF37)]">{e.readiness}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-1000 ${e.readiness>=70?'bg-green-500':e.readiness>=40?'bg-[var(--color-accent, #D4AF37)]':'bg-amber-500'}`}
                    style={{ width:`${e.readiness}%` }} />
                </div>
                {e.examDate && <p className="text-xs text-slate-400 mt-0.5">Exam: {e.examDate}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ID Card */}
      {tab === 'ID Card' && (
        <div className="clay rounded-3xl p-6 max-w-md mx-auto">
          <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-xl text-center mb-6">🪪 Your Student ID Card</h3>
          <StudentIDCard user={user} />
        </div>
      )}

      {/* Badges */}
      {tab === 'Badges' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-xl">🏅 Your Badges</h3>
            <span className="text-slate-500 text-sm">
              {BADGES.filter(b=>b.earned).length}/{BADGES.length} earned
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {BADGES.map(b => (
              <div key={b.id}
                className={`rounded-2xl p-4 text-center transition-all ${b.earned ? 'clay-gold' : 'clay opacity-60'}`}>
                <div className="text-4xl mb-2">{b.emoji}</div>
                <p className={`font-bold text-sm ${b.earned ? 'text-[var(--color-primary, #1E3A5F)]' : 'text-slate-600'}`}>{b.name}</p>
                <p className={`text-xs mt-1 ${b.earned ? 'text-[var(--color-primary, #1E3A5F)]/70' : 'text-slate-400'}`}>{b.desc}</p>
                {b.earned ? (
                  <p className="text-xs text-green-600 font-semibold mt-2">✅ {b.earnedDate}</p>
                ) : b.progress !== undefined ? (
                  <div className="mt-2">
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="bg-[var(--color-accent, #D4AF37)] h-1.5 rounded-full"
                        style={{ width:`${(b.progress / b.target) * 100}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{b.progress}/{b.target}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {tab === 'Stats' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon:'📝', val:user?.testsCompleted, label:'Tests Taken' },
            { icon:'📊', val:`${user?.avgScore}%`, label:'Average Score' },
            { icon:'🏆', val:`#${user?.rank.toLocaleString()}`, label:'All India Rank' },
            { icon:'🔥', val:`${user?.streak} days`, label:'Study Streak' },
            { icon:'🪙', val:user?.coins.toLocaleString(), label:'Total Coins' },
            { icon:'🎓', val:user?.guruPoints, label:'Guru Points' },
            { icon:'⏱️', val:user?.studyHours, label:'Study Time' },
            { icon:'⭐', val:user?.xp.toLocaleString(), label:'XP Earned' },
            { icon:'💎', val:`Level ${user?.level}`, label:'Current Level' },
          ].map(s => (
            <div key={s.label} className="clay rounded-2xl p-4 text-center">
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="text-2xl font-bold text-[var(--color-accent, #D4AF37)] font-poppins">{s.val}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
