import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import ExamReadinessWidget   from '../components/dashboard/ExamReadinessWidget'
import StreakWidget           from '../components/dashboard/StreakWidget'
import CoinsWidget            from '../components/dashboard/CoinsWidget'
import QuickTestWidget        from '../components/dashboard/QuickTestWidget'
import DailyQuizWidget        from '../components/dashboard/DailyQuizWidget'
import SubjectBarsWidget      from '../components/dashboard/SubjectBarsWidget'
import ScoreTrendWidget       from '../components/dashboard/ScoreTrendWidget'
import LeaderboardWidget      from '../components/dashboard/LeaderboardWidget'
import RecentActivityWidget   from '../components/dashboard/RecentActivityWidget'

export default function Dashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] font-poppins">
          {greeting}, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Preparing for{' '}
          <span className="font-semibold text-[#1E3A5F]">{user.exams[0]?.name}</span>
          {user.exams[0]?.examDate ? ` · Exam: ${user.exams[0].examDate}` : ''}
          {' '}· {user.exams[0]?.readiness}% ready
        </p>
        {/* Exam switcher chips */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {user.exams.map((e, i) => (
            <button key={e.id}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all
                ${i === 0 ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
              {e.name}
            </button>
          ))}
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <ExamReadinessWidget />
        <StreakWidget />
        <CoinsWidget />
        <DailyQuizWidget />
        <QuickTestWidget />
        <ScoreTrendWidget />
        <SubjectBarsWidget />
        <LeaderboardWidget />
        <RecentActivityWidget />
      </div>
    </AppLayout>
  )
}
