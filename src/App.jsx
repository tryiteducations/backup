import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ImpersonationBanner from './components/ImpersonationBanner'
import NotificationBar from './components/NotificationBar'

const Splash          = lazy(() => import('./pages/Splash'))
const Landing         = lazy(() => import('./pages/Landing'))
const Login           = lazy(() => import('./pages/Login'))
const Onboarding      = lazy(() => import('./pages/Onboarding'))
const RoleSelect      = lazy(() => import('./pages/role-select/RoleSelect'))
const Dashboard       = lazy(() => import('./pages/Dashboard'))
const Profile         = lazy(() => import('./pages/Profile'))
const Settings        = lazy(() => import('./pages/settings/Settings'))
const Notifications   = lazy(() => import('./pages/Notifications'))
const JourneyPassport = lazy(() => import('./pages/JourneyPassport'))
const TestLauncher    = lazy(() => import('./pages/test-engine/TestLauncher'))
const ActiveTest      = lazy(() => import('./pages/test-engine/ActiveTest'))
const ResultScreen    = lazy(() => import('./pages/test-engine/ResultScreen'))
const ReviewScreen    = lazy(() => import('./pages/test-engine/ReviewScreen'))
const AllExams        = lazy(() => import('./pages/exams/AllExams'))
const ExamDetail      = lazy(() => import('./pages/exams/ExamDetail'))
const ExamUniverse    = lazy(() => import('./pages/exams/ExamUniverse'))
const RoadmapPage     = lazy(() => import('./pages/roadmap/RoadmapPage'))
const ExamAlerts      = lazy(() => import('./pages/exam-alerts/ExamAlerts'))

// ── CONCEPT LEARNING (NEW) ─────────────────────────────────────
const ConceptCard        = lazy(() => import('./pages/concept/ConceptCard'))
const ConceptCheckpoint  = lazy(() => import('./pages/concept/ConceptCheckpoint'))
const PrepPathway        = lazy(() => import('./pages/roadmap/PrepPathway'))
const BharatPulse   = lazy(() => import('./pages/bharat-pulse/BharatPulse'))
const CommunityPage = lazy(() => import('./pages/community/CommunityPage'))

const GuruHub        = lazy(() => import('./pages/guru/GuruHub'))
const MyDoubts       = lazy(() => import('./pages/guru/MyDoubts'))
const PostDoubt      = lazy(() => import('./pages/guru/PostDoubt'))
const DoubtThread    = lazy(() => import('./pages/guru/DoubtThread'))
const CareerCompass  = lazy(() => import('./pages/career-compass/CareerCompass'))
const ScholarshipHub = lazy(() => import('./pages/scholarships/ScholarshipHub'))
const CurrentAffairs = lazy(() => import('./pages/current-affairs/CurrentAffairs'))
const ClassroomHub   = lazy(() => import('./pages/classroom/ClassroomHub'))
const StudyPlanner   = lazy(() => import('./pages/classroom/StudyPlanner'))
const PDFLibrary     = lazy(() => import('./pages/classroom/PDFLibrary'))
const EbookStore     = lazy(() => import('./pages/ebooks/EbookStore'))
const MyEbooks       = lazy(() => import('./pages/ebooks/MyEbooks'))
const UploadEbook    = lazy(() => import('./pages/ebooks/UploadEbook'))
const EbookReader    = lazy(() => import('./pages/ebooks/EbookReader'))
const TryITLab       = lazy(() => import('./pages/tryit-lab/TryITLab'))
const BrainTeaser    = lazy(() => import('./pages/brain-teaser/BrainTeaser'))
const HallHub        = lazy(() => import('./pages/hall/HallHub'))
const HallHome       = lazy(() => import('./pages/hall/HallHome'))
const CreateHall     = lazy(() => import('./pages/hall/CreateHall'))
const BattleArena    = lazy(() => import('./pages/hall/BattleArena'))
const HallLeaderboard= lazy(() => import('./pages/hall/HallLeaderboard'))
const FullLeaderboard= lazy(() => import('./pages/leaderboard/Leaderboard'))
const Tournaments    = lazy(() => import('./pages/tournament/Tournaments'))
const TournamentHub  = lazy(() => import('./pages/tournament/TournamentHub'))
const TournamentLive = lazy(() => import('./pages/tournament/TournamentLive'))
const TournamentResults = lazy(() => import('./pages/tournament/TournamentResults'))
const TournamentReview  = lazy(() => import('./pages/tournament/TournamentReview'))
const GamesHub       = lazy(() => import('./pages/games/GamesHub'))
const MathBlitz      = lazy(() => import('./pages/games/MathBlitz'))
const WordRush       = lazy(() => import('./pages/games/WordRush'))
const GKBlitz        = lazy(() => import('./pages/games/GKBlitz'))
const LogicGrid      = lazy(() => import('./pages/games/LogicGrid'))
const Battle         = lazy(() => import('./pages/games/Battle'))
const MemoryMatch    = lazy(() => import('./pages/games/MemoryMatch'))
const VisualIdentify = lazy(() => import('./pages/games/VisualIdentify'))
const NumberSeries   = lazy(() => import('./pages/games/NumberSeries'))
const SpeedReading   = lazy(() => import('./pages/games/SpeedReading'))
const DailyChallengeGame = lazy(() => import('./pages/games/DailyChallenge'))
const CurrentAffairsRapid = lazy(() => import('./pages/games/CurrentAffairsRapid'))
const SportsMastery  = lazy(() => import('./pages/games/SportsMastery'))
const GameLevelRoadmap = lazy(() => import('./pages/games/GameLevelRoadmap'))
const Analytics      = lazy(() => import('./pages/analytics/Analytics'))
const Achievements   = lazy(() => import('./pages/achievements/Achievements'))
const FocusMode      = lazy(() => import('./pages/focus-mode/FocusMode'))
const PricingPage    = lazy(() => import('./pages/pricing/PricingPage'))
const WalletPage     = lazy(() => import('./pages/wallet/WalletPage'))
const FamilyHub      = lazy(() => import('./pages/family/FamilyHub'))
const ReferralPage   = lazy(() => import('./pages/referral/ReferralPage'))
const MentorHub      = lazy(() => import('./pages/mentor/MentorHub'))
const CashbackCenter = lazy(() => import('./pages/mentor/CashbackCenter'))
const MentorAnalytics= lazy(() => import('./pages/mentor/MentorAnalytics'))
const CouponManager  = lazy(() => import('./pages/mentor/CouponManager'))
const EquityTierSelector = lazy(() => import('./pages/equity/EquityTierSelector'))
const EquityVerification = lazy(() => import('./pages/equity/EquityVerification'))
const AccessibilityMode  = lazy(() => import('./pages/accessibility/AccessibilityMode'))
const SchoolCircle       = lazy(() => import('./pages/circles/SchoolCircle'))
const SisterhoodCircle   = lazy(() => import('./pages/circles/SisterhoodCircle'))
const LiveImpactTracker  = lazy(() => import('./pages/impact/LiveImpactTracker'))
const CentreLogin        = lazy(() => import('./pages/centre/CentreLogin'))
const CentreOnboarding   = lazy(() => import('./pages/centre/CentreOnboarding'))
const CentreDashboard    = lazy(() => import('./pages/centre/CentreDashboard'))
const CentreAnalytics    = lazy(() => import('./pages/centre/CentreAnalytics'))
const ConductTest        = lazy(() => import('./pages/centre/ConductTest'))
const StudentDetail      = lazy(() => import('./pages/centre/StudentDetail'))
const StudentHistory     = lazy(() => import('./pages/centre/StudentHistory'))
const ParentLogin        = lazy(() => import('./pages/parent/ParentLogin'))
const ParentOnboarding   = lazy(() => import('./pages/parent/ParentOnboarding'))
const ParentDashboard    = lazy(() => import('./pages/parent/ParentDashboard'))
const ChildDetail        = lazy(() => import('./pages/parent/ChildDetail'))
const MyTestHistory      = lazy(() => import('./pages/student/MyTestHistory'))
const AdminLogin            = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard        = lazy(() => import('./pages/admin/AdminDashboard'))
const ExamManager           = lazy(() => import('./pages/admin/ExamManager'))
const QuestionManager       = lazy(() => import('./pages/admin/QuestionManager'))
const UserManager           = lazy(() => import('./pages/admin/UserManager'))
const CurrentAffairsManager = lazy(() => import('./pages/admin/CurrentAffairsManager'))
const ThemeSelector         = lazy(() => import('./pages/settings/ThemeSelector'))
const Terms                 = lazy(() => import('./pages/legal/Terms'))
const Privacy               = lazy(() => import('./pages/legal/Privacy'))
const CommunityStandards    = lazy(() => import('./pages/legal/CommunityStandards'))

const Stub = ({ title = 'Coming Soon' }) => (
  <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center', gap:16, padding:24,
    fontFamily:'Poppins,sans-serif',
    background:'linear-gradient(135deg,#1E3A5F,#0F2140)' }}>
    <div style={{ fontSize:56 }}>🔧</div>
    <h2 style={{ color:'#C9A84C', fontSize:24, fontWeight:800, textAlign:'center' }}>{title}</h2>
    <p style={{ color:'rgba(255,255,255,0.6)', fontSize:14 }}>Being built. Check back soon!</p>
    <a href="/dashboard" style={{ background:'linear-gradient(135deg,#C9A84C,#E8C84A)',
      borderRadius:14, padding:'12px 28px', fontWeight:700, fontSize:15,
      color:'#1E3A5F', textDecoration:'none', marginTop:8 }}>← Back to Dashboard</a>
  </div>
)

const Loader = () => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
    justifyContent:'center', background:'linear-gradient(135deg,#1E3A5F,#0F2140)' }}>
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(212,175,55,0.18)" strokeWidth="4"/>
      <circle cx="28" cy="28" r="22" fill="none" stroke="#C9A84C" strokeWidth="4"
        strokeDasharray="40 98"
        style={{ animation:'spin 1.2s linear infinite', transformOrigin:'center' }}/>
    </svg>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
)

function useGlobalGlitter() {
  useEffect(() => {
    if (!document.getElementById('glitter-style')) {
      const s = document.createElement('style')
      s.id = 'glitter-style'
      s.textContent = `@keyframes glitterBurst{0%{transform:translate(-50%,-50%) scale(0);opacity:1}100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}}`
      document.head.appendChild(s)
    }
    const handleClick = (e) => {
      const burst = document.createElement('div')
      burst.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:56px;height:56px;border-radius:50%;pointer-events:none;z-index:99999;background:radial-gradient(circle,rgba(201,168,76,0.96) 0%,rgba(201,168,76,0.55) 30%,#C9A84C 60%,transparent 80%);animation:glitterBurst 380ms ease-out forwards`
      document.body.appendChild(burst)
      setTimeout(() => burst.remove(), 400)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}

function ThemedApp() {
  const { user } = useAuth()
  useGlobalGlitter()

  return (
    <ThemeProvider userLevel={user?.level ?? 1}>
      <BrowserRouter>
        <ImpersonationBanner />
        <NotificationBar />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* AUTH */}
            <Route path="/"            element={<Splash />} />
            <Route path="/landing"     element={<Landing />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/onboarding"  element={<Onboarding />} />
            <Route path="/role-select" element={<RoleSelect />} />

            {/* CORE */}
            <Route path="/dashboard"     element={<Navigate to="/student" replace/>} />
            <Route path="/profile"       element={<Profile />} />
            <Route path="/settings"      element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/journey"       element={<JourneyPassport />} />

            {/* TEST ENGINE */}
            <Route path="/test-engine"        element={<TestLauncher />} />
            <Route path="/test-engine/active" element={<ActiveTest />} />
            <Route path="/test-engine/result" element={<ResultScreen />} />
            <Route path="/test-engine/review" element={<ReviewScreen />} />

            {/* CONCEPT LEARNING (NEW) */}
            <Route path="/concept/:topicId/:level"            element={<ConceptCard />} />
            <Route path="/concept/:topicId/:level/checkpoint" element={<ConceptCheckpoint />} />

            {/* PREP PATHWAYS + BHARAT PULSE + COMMUNITY (NEW) */}
            <Route path="/pathway/:pathwayId" element={<PrepPathway />} />
            <Route path="/bharat-pulse" element={<BharatPulse />} />
            <Route path="/community" element={<CommunityPage />} />

            {/* EXAMS */}
            <Route path="/exams"                  element={<AllExams />} />
            <Route path="/exams/:examId/universe" element={<ExamUniverse />} />
            <Route path="/exams/:examId"          element={<ExamDetail />} />
            <Route path="/roadmap/:examId"        element={<RoadmapPage />} />
            <Route path="/exam-alerts"            element={<ExamAlerts />} />

            {/* GURU HUB */}
            <Route path="/guru-hub"             element={<GuruHub />} />
            <Route path="/guru-hub/my-doubts"   element={<MyDoubts />} />
            <Route path="/guru-hub/post-doubt"  element={<PostDoubt />} />
            <Route path="/guru-hub/:doubtId"    element={<DoubtThread />} />

            {/* DISCOVERY */}
            <Route path="/career-compass"    element={<CareerCompass />} />
            <Route path="/scholarships"      element={<ScholarshipHub />} />
            <Route path="/current-affairs"   element={<CurrentAffairs />} />
            <Route path="/classroom"         element={<ClassroomHub />} />
            <Route path="/classroom/planner" element={<StudyPlanner />} />
            <Route path="/classroom/pdf"     element={<PDFLibrary />} />
            <Route path="/ebooks"            element={<EbookStore />} />
            <Route path="/ebooks/my"         element={<MyEbooks />} />
            <Route path="/ebooks/upload"     element={<UploadEbook />} />
            <Route path="/ebooks/:ebookId"   element={<EbookReader />} />
            <Route path="/tryit-lab"         element={<TryITLab />} />
            <Route path="/brain-teaser"      element={<BrainTeaser />} />

            {/* COMPETITION */}
            <Route path="/hall"                element={<HallHub />} />
            <Route path="/hall/create"         element={<CreateHall />} />
            <Route path="/hall/leaderboard"    element={<HallLeaderboard />} />
            <Route path="/hall/:hallId/battle" element={<BattleArena />} />
            <Route path="/hall/:hallId"        element={<HallHome />} />
            <Route path="/leaderboard"         element={<FullLeaderboard />} />
            <Route path="/tournaments"         element={<Tournaments />} />
            <Route path="/tournament"          element={<TournamentHub />} />
            <Route path="/tournament/:id/live"    element={<TournamentLive />} />
            <Route path="/tournament/:id/results" element={<TournamentResults />} />
            <Route path="/tournament/:id/review"  element={<TournamentReview />} />
            <Route path="/games"               element={<GamesHub />} />
            <Route path="/games/math-blitz"    element={<MathBlitz />} />
            <Route path="/games/word-rush"     element={<WordRush />} />
            <Route path="/games/gk-blitz"      element={<GKBlitz />} />
            <Route path="/games/logic-grid"    element={<LogicGrid />} />
            <Route path="/games/battle"        element={<Battle />} />
            <Route path="/games/memory/:gameId" element={<MemoryMatch />} />
            <Route path="/games/visual/:gameId" element={<VisualIdentify />} />
            <Route path="/games/number-series" element={<NumberSeries />} />
            <Route path="/games/speed-reading" element={<SpeedReading />} />
            <Route path="/games/daily-challenge" element={<DailyChallengeGame />} />
            <Route path="/games/current-affairs" element={<CurrentAffairsRapid />} />
            <Route path="/games/sports-mastery" element={<SportsMastery />} />
            <Route path="/games/levels/:gameId" element={<GameLevelRoadmap />} />

            {/* PROGRESS */}
            <Route path="/analytics"    element={<Analytics />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/focus-mode"   element={<FocusMode />} />

            {/* SOCIAL */}
            <Route path="/pro"      element={<PricingPage />} />
            <Route path="/pricing"  element={<Navigate to="/pro" replace />} />
            <Route path="/wallet"   element={<WalletPage />} />
            <Route path="/family"   element={<FamilyHub />} />
            <Route path="/referral" element={<ReferralPage />} />

            {/* MENTOR */}
            <Route path="/mentor-hub"           element={<MentorHub />} />
            <Route path="/mentor-hub/cashback"  element={<CashbackCenter />} />
            <Route path="/mentor-hub/analytics" element={<MentorAnalytics />} />
            <Route path="/mentor-hub/coupons"   element={<CouponManager />} />

            {/* EQUITY */}
            <Route path="/equity"             element={<EquityTierSelector />} />
            <Route path="/equity/verify"      element={<EquityVerification />} />
            <Route path="/accessibility"      element={<AccessibilityMode />} />
            <Route path="/circles/school"     element={<SchoolCircle />} />
            <Route path="/circles/sisterhood" element={<SisterhoodCircle />} />
            <Route path="/impact"             element={<LiveImpactTracker />} />
            <Route path="/donate"             element={<Stub title="Donation Page 💛" />} />

            {/* CENTRE */}
            <Route path="/centre/login"        element={<CentreLogin />} />
            <Route path="/centre/onboarding"   element={<CentreOnboarding />} />
            <Route path="/centre/dashboard"    element={<CentreDashboard />} />
            <Route path="/centre/analytics"    element={<CentreAnalytics />} />
            <Route path="/centre/conduct-test" element={<ConductTest />} />
            <Route path="/centre/students/:id" element={<StudentDetail />} />
            <Route path="/centre/students"     element={<StudentHistory />} />

            {/* PARENT */}
            <Route path="/parent/login"         element={<ParentLogin />} />
            <Route path="/parent/onboarding"    element={<ParentOnboarding />} />
            <Route path="/parent/dashboard"     element={<ParentDashboard />} />
            <Route path="/parent/child/:id"     element={<ChildDetail />} />
            <Route path="/student/test-history" element={<MyTestHistory />} />

            {/* ADMIN */}
            <Route path="/admin/login"           element={<AdminLogin />} />
            <Route path="/admin/dashboard"       element={<AdminDashboard />} />
            <Route path="/admin/exams"           element={<ExamManager />} />
            <Route path="/admin/questions"       element={<QuestionManager />} />
            <Route path="/admin/users"           element={<UserManager />} />
            <Route path="/admin/current-affairs" element={<CurrentAffairsManager />} />

            {/* SETTINGS */}
            <Route path="/settings/themes" element={<ThemeSelector />} />

            {/* LEGAL */}
            <Route path="/terms"               element={<Terms />} />
            <Route path="/privacy"             element={<Privacy />} />
            <Route path="/community-standards" element={<CommunityStandards />} />

            {/* CATCH-ALL */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path='/student' element={<StudentDashboard/>}/>
</Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ToastProvider>
  )
}