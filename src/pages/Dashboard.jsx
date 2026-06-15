// FILE: src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const firstName = user.name?.split(' ')[0] || user.email?.split('@')[0] || 'there'
  const primaryExam = user.exams?.[0]
  const subjects = user.subjects || []
  const coinsThisWeek = user.coinsThisWeek ?? 0
  const coinsWeekGoal = 500
  const streakDays = ['M','T','W','T','F','S','S']
  const streak = user.streak || 0
  const headingColor = 'var(--color-surface-text, var(--heading-color, #1E3A5F))'
  const mutedText = 'var(--subtext-color, #64748B)'
  const primaryColor = 'var(--color-primary, #1E3A5F)'
  const accentColor = 'var(--color-accent, #D4AF37)'
  const accentLight = 'var(--color-accent-light, #E8C84A)'
  const surfaceColor = 'var(--color-surface, #FFFFFF)'
  const bgColor = 'var(--color-bg, #F8FAFC)'
  const borderColor = 'var(--color-border, #E2E8F0)'
  const successColor = 'var(--color-success, #22C55E)'
  const errorColor = 'var(--color-error, #EF4444)'
  const mutedColor = 'var(--color-muted, #94A3B8)'

  return (
    <AppLayout title="Dashboard">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins" style={{ color: headingColor }}>
          {greeting}, {firstName}! 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: mutedText }}>
          {primaryExam
            ? <>Preparing for <strong style={{ color: accentColor }}>{primaryExam.name}</strong> · Language Stream: English</>
            : <>Pick your exam to unlock a personalized study plan →{' '}
                <button onClick={()=>navigate('/all-exams')} className="font-semibold underline" style={{ color: accentColor }}>Browse Exams</button>
              </>}
        </p>
      </div>

      {/* ── Exam Readiness ─────────────────────────────────────── */}
      {primaryExam ? (
        <div className="rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-3" style={{ background: surfaceColor, border: `1px solid ${borderColor}` }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-bold font-poppins" style={{ color: 'var(--heading-color, #1E3A5F)' }}>Exam Readiness</p>
              <p className="text-xs" style={{ color: mutedText }}>{primaryExam.name} · {primaryExam.examDate || 'Date TBD'}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(var(--color-success-rgb, 34, 197, 94), 0.16)', color: successColor }}>
            Predicted: {primaryExam.readiness ? `${Math.round(primaryExam.readiness*1.5+50)}-${Math.round(primaryExam.readiness*1.6+62)}` : '—'} / 200 · {primaryExam.readiness >= 50 ? 'ON TRACK ✅' : 'GET STARTED'}
          </span>
        </div>
      ) : (
        <div className="rounded-2xl p-5 mb-6 text-center" style={{ background: surfaceColor, border: `1px dashed ${borderColor}` }}>
          <p className="text-3xl mb-2">🎯</p>
          <p className="font-bold font-poppins mb-1" style={{ color: headingColor }}>No exam selected yet</p>
          <p className="text-sm mb-3" style={{ color: mutedText }}>Choose an exam to see your personalized readiness score.</p>
          <button onClick={()=>navigate('/all-exams')}
            className="font-semibold text-sm rounded-xl px-5 py-2"
            style={{ background: primaryColor, color: 'var(--color-surface, #FFFFFF)' }}>
            Browse 9,600+ Exams →
          </button>
        </div>
      )}

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Study Streak */}
        <div className="rounded-2xl p-5" style={{ background:'var(--color-surface, #FFFFFF)', border:'1px solid var(--color-border, #E2E8F0)' }}>
          <p className="font-bold font-poppins mb-1" style={{ color: 'var(--heading-color, #1E3A5F)' }}>🔥 Study Streak</p>
          <p className="text-xs mb-3" style={{ color: 'var(--subtext-color, #64748B)' }}>consecutive days</p>
          <div className="flex gap-1.5 mb-2">
            {streakDays.map((d,i)=>(
              <div key={i} className="flex-1 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                    background: i < streak ? accentColor : i === streak ? primaryColor : surfaceColor,
                    color: i < streak ? primaryColor : i === streak ? surfaceColor : mutedColor,
                    border: i < streak || i === streak ? '1px solid rgba(var(--color-text-rgb, 15, 23, 45), 0.05)' : '1px solid var(--color-border, #E2E8F0)',
                }}>
                {i < streak ? '✓' : d}
              </div>
            ))}
          </div>
          {streak === 0 ? (
            <p className="text-xs" style={{ color: mutedText }}>Complete a test today to start your streak!</p>
          ) : (
            <p className="text-xs" style={{ color: accentColor }}>❄️ Use Streak Freeze ({user.streakFreezes ?? 0} left)</p>
          )}
        </div>

        {/* Coins */}
        <div className="rounded-2xl p-5" style={{ background:'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))' }}>
          <p className="font-bold font-poppins mb-1" style={{ color: 'var(--color-primary, #1E3A5F)' }}>🪙 Coins</p>
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-primary, #1E3A5F)', opacity: 0.72 }}>
            <span>This week</span><span>{coinsThisWeek}/{coinsWeekGoal}</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <div className="h-full rounded-full" style={{ width:`${Math.min(100,(coinsThisWeek/coinsWeekGoal)*100)}%`, background:'var(--color-primary, #1E3A5F)' }}/>
          </div>
          {(user.coinHistory || []).length === 0 ? (
            <p className="text-xs mb-3" style={{ color: primaryColor, opacity: 0.72 }}>Earn coins by playing games, daily quizzes, and helping in Guru Hub.</p>
          ) : (
            <div className="text-xs space-y-1 mb-3" style={{ color: primaryColor, opacity: 0.8 }}>
              {user.coinHistory.map((h,i)=>(
                <div key={i} className="flex justify-between"><span>{h.label}</span><span>+{h.amount} 🪙</span></div>
              ))}
            </div>
          )}
          <button onClick={()=>navigate('/wallet')} className="w-full rounded-xl py-2 text-sm font-semibold"
            style={{ background:'var(--color-primary, #1E3A5F)', color:'var(--color-surface, #FFFFFF)' }}>
            View Wallet →
          </button>
        </div>

        {/* Daily Quiz */}
        <div className="rounded-2xl border p-5" style={{ background:'var(--color-surface, #FFFFFF)', borderColor:'var(--color-border, #E2E8F0)' }}>
          <p className="font-bold font-poppins mb-1" style={{ color: 'var(--heading-color, #1E3A5F)' }}>📅 Daily Quiz</p>
          <p className="text-xs mb-3" style={{ color: 'var(--subtext-color, #64748B)' }}>Today · 5 Questions · Current Affairs Focus</p>
             <div className="h-1.5 rounded-full" style={{ background: 'var(--color-bg, #F8FAFC)' }} />
          <button onClick={()=>navigate('/daily-quiz')} className="w-full rounded-xl py-2 text-sm font-bold mb-2"
            style={{ background: accentColor, color: primaryColor }}>
            Start Daily Quiz →
          </button>
             <p className="text-xs" style={{ color: successColor, textAlign: 'center' }}>+50 🪙 bonus waiting!</p>
        </div>
      </div>

      {/* ── Quick Test + Score Trend ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="rounded-2xl p-5" style={{ background: primaryColor }}>
          <p className="font-bold text-white font-poppins mb-3">⚡ Quick Test</p>
          <div className="flex gap-2">
            {['Practice','Mock','Speed'].map(m=>(
              <button key={m} onClick={()=>navigate(`/test/quick?mode=${m.toLowerCase()}`)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors"
                style={{ background:'rgba(var(--color-surface-rgb, 255,255,255), 0.1)', color:'var(--color-surface, #FFFFFF)' }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ background:'var(--color-surface, #FFFFFF)', borderColor:'var(--color-border, #E2E8F0)' }}>
          <div className="flex justify-between items-center mb-3">
            <p className="font-bold font-poppins" style={{ color: 'var(--heading-color, #1E3A5F)' }}>📈 Score Trend</p>
            <span className="text-xs" style={{ color: 'var(--subtext-color, #64748B)' }}>Last 30 days</span>
          </div>
          {user.testsCompleted > 0 ? (
            <div className="h-20 flex items-end gap-1">
              {(user.scoreTrend || []).map((v,i)=>(
                <div key={i} className="flex-1 rounded-t" style={{ height:`${v}%`, background:'var(--color-accent, #D4AF37)' }}/>
              ))}
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center text-center">
              <p className="text-sm" style={{ color: mutedColor }}>Take your first test to see your score trend 📊</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Subject Accuracy ─────────────────────────────────── */}
      <div className="rounded-2xl border p-5 mb-6" style={{ background:'var(--color-surface, #FFFFFF)', borderColor:'var(--color-border, #E2E8F0)' }}>
        <p className="font-bold font-poppins mb-3" style={{ color: 'var(--heading-color, #1E3A5F)' }}>📚 Subject Accuracy</p>
        {subjects.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm mb-3" style={{ color: 'var(--subtext-color, #64748B)' }}>No subject data yet — complete a few tests to see your strengths and weak areas here.</p>
            <button onClick={()=>navigate('/test/quick')} className="font-semibold text-sm rounded-xl px-5 py-2"
              style={{ background: primaryColor, color: accentColor }}>
              Take a Test →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subjects.map(s=>(
              <div key={s.name} className="rounded-xl p-3 text-center" style={{ background:'var(--color-bg, #F8FAFC)' }}>
                <p className="text-2xl mb-1">{s.emoji}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--heading-color, #1E3A5F)' }}>{s.name}</p>
                <p className="text-lg font-bold" style={{ color: s.accuracy >= 75 ? successColor : s.accuracy >= 50 ? accentColor : errorColor }}>
                  {s.accuracy}%
                </p>
                <p className="text-xs" style={{ color: 'var(--subtext-color, #64748B)' }}>{s.trend === 'up' ? '↑ improving' : s.trend === 'down' ? '↓ needs work' : '→ steady'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Your Rank / Leaderboard ──────────────────────────── */}
      <div className="rounded-2xl border p-5" style={{ background:'var(--color-surface, #FFFFFF)', borderColor:'var(--color-border, #E2E8F0)' }}>
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold font-poppins" style={{ color: 'var(--heading-color, #1E3A5F)' }}>🏆 Your All-India Rank</p>
          <button onClick={()=>navigate('/the-hall')} className="text-xs font-semibold" style={{ color: 'var(--color-accent, #D4AF37)' }}>View Leaderboard →</button>
        </div>
        {user.rank ? (
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold font-poppins" style={{ color:'var(--heading-color, #1E3A5F)' }}>#{user.rank.toLocaleString()}</span>
            <div>
              <p className="text-sm" style={{ color:'var(--color-muted, #94A3B8)' }}>out of all {primaryExam?.name || 'TryIT'} aspirants</p>
              <p className="text-xs" style={{ color: successColor }}>{user.avgScore ? `Avg score: ${user.avgScore}%` : ''}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-3xl mb-2">🏆</p>
            <p className="text-sm mb-3" style={{ color:'var(--color-muted, #94A3B8)' }}>You're unranked — complete your first test to join the leaderboard!</p>
            <button onClick={()=>navigate('/test/quick')} className="font-bold text-sm rounded-xl px-5 py-2"
              style={{ background: accentColor, color: primaryColor }}>
              Take Your First Test →
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
