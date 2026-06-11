import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider }  from './context/ThemeContext'
import { ToastProvider }  from './context/ToastContext'
import { AuthProvider }   from './context/AuthContext'

// ── Pages that exist ─────────────────────────────────────────────
const Splash         = lazy(() => import('./pages/Splash'))
const Landing        = lazy(() => import('./pages/Landing'))
const Login          = lazy(() => import('./pages/Login'))
const Onboarding     = lazy(() => import('./pages/Onboarding'))
const Dashboard      = lazy(() => import('./pages/Dashboard'))
const Profile        = lazy(() => import('./pages/Profile'))
const Settings       = lazy(() => import('./pages/Settings'))
const Notifications  = lazy(() => import('./pages/Notifications'))
const TestLauncher   = lazy(() => import('./pages/test-engine/TestLauncher'))
const ActiveTest     = lazy(() => import('./pages/test-engine/ActiveTest'))
const ResultScreen   = lazy(() => import('./pages/test-engine/ResultScreen'))
const ReviewScreen   = lazy(() => import('./pages/test-engine/ReviewScreen'))
const GuruHub        = lazy(() => import('./pages/guru/GuruHub'))
const AllExams       = lazy(() => import('./pages/exams/AllExams'))
const CentreDashboard  = lazy(() => import('./pages/centre/CentreDashboard'))
const StudentHistory   = lazy(() => import('./pages/centre/StudentHistory'))
const MyTestHistory    = lazy(() => import('./pages/student/MyTestHistory'))
const AdminLogin       = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'))
const JourneyPassport  = lazy(() => import('./pages/JourneyPassport'))
const CouponManager    = lazy(() => import('./pages/mentor/CouponManager'))
const EbookStore       = lazy(() => import('./pages/ebooks/EbookStore'))
const EquityTierSelector = lazy(() => import('./pages/equity/EquityTierSelector'))
const SchoolCircle     = lazy(() => import('./pages/circles/SchoolCircle'))
const SisterhoodCircle = lazy(() => import('./pages/circles/SisterhoodCircle'))

const AccessibilityMode = lazy(() => import('./pages/accessibility/AccessibilityMode'))

const HallHub       = lazy(() => import('./pages/hall/HallHub'))
const FullLeaderboard = lazy(() => import('./pages/leaderboard/Leaderboard'))
const Analytics     = lazy(() => import('./pages/analytics/Analytics'))
const Achievements  = lazy(() => import('./pages/achievements/Achievements'))
const FocusMode     = lazy(() => import('./pages/focus-mode/FocusMode'))
const CurrentAffairs = lazy(() => import('./pages/current-affairs/CurrentAffairs'))

const CareerCompass  = lazy(() => import('./pages/career-compass/CareerCompass'))
const ScholarshipHub = lazy(() => import('./pages/scholarships/ScholarshipHub'))
const PricingPage    = lazy(() => import('./pages/pricing/PricingPage'))
const WalletPage     = lazy(() => import('./pages/wallet/WalletPage'))
const FamilyHub      = lazy(() => import('./pages/family/FamilyHub'))

const ExamDetail     = lazy(() => import('./pages/exams/ExamDetail'))
const RoadmapPage    = lazy(() => import('./pages/roadmap/RoadmapPage'))
const GamesHub       = lazy(() => import('./pages/games/GamesHub'))
const MathBlitz      = lazy(() => import('./pages/games/MathBlitz'))
const Tournaments    = lazy(() => import('./pages/tournaments/Tournaments'))
const ExamAlerts     = lazy(() => import('./pages/exam-alerts/ExamAlerts'))
const StudyPlanner   = lazy(() => import('./pages/classroom/StudyPlanner'))
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard'))
const LiveImpactTracker = lazy(() => import('./pages/impact/LiveImpactTracker'))

// ── Stub for pages not built yet ─────────────────────────────────
const Stub = ({ title = 'Coming Soon' }) => (
  <div style={{
    minHeight:'100vh', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    fontFamily:'Poppins,sans-serif',
    background:'linear-gradient(135deg,#1E3A5F,#0F2140)', gap:16, padding:24,
  }}>
    <div style={{ fontSize:56 }}>🔧</div>
    <h2 style={{ color:'#D4AF37', fontSize:24, fontWeight:800, textAlign:'center' }}>{title}</h2>
    <p style={{ color:'rgba(255,255,255,0.6)', fontSize:14 }}>Being built. Check back soon!</p>
    <a href="/dashboard" style={{
      background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
      borderRadius:14, padding:'12px 28px',
      fontWeight:700, fontSize:15, color:'#1E3A5F',
      textDecoration:'none', marginTop:8,
    }}>← Back to Dashboard</a>
  </div>
)

// ── Loader ───────────────────────────────────────────────────────
const Loader = () => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
    justifyContent:'center', background:'linear-gradient(135deg,#1E3A5F,#0F2140)' }}>
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="4"/>
      <circle cx="28" cy="28" r="22" fill="none" stroke="#D4AF37" strokeWidth="4"
        strokeDasharray="40 98"
        style={{ animation:'spin 1.2s linear infinite', transformOrigin:'center' }}/>
    </svg>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
)

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Public */}
                <Route path="/"            element={<Splash />} />
                <Route path="/landing"     element={<Landing />} />
                <Route path="/login"       element={<Login />} />
                <Route path="/onboarding"  element={<Onboarding />} />

                {/* Core app */}
                <Route path="/dashboard"     element={<Dashboard />} />
                <Route path="/profile"       element={<Profile />} />
                <Route path="/settings"      element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />

                {/* Test engine */}
                <Route path="/test-engine"         element={<TestLauncher />} />
                <Route path="/test-engine/active"  element={<ActiveTest />} />
                <Route path="/test-engine/result"  element={<ResultScreen />} />
                <Route path="/test-engine/review"  element={<ReviewScreen />} />

                {/* Exams */}
                <Route path="/exams"                    element={<AllExams />} />
                
                <Route path="/exams/:examId"        element={<ExamDetail />} />
                <Route path="/roadmap/:examId"       element={<RoadmapPage />} />
                <Route path="/games"                 element={<GamesHub />} />
                <Route path="/games/math-blitz"      element={<MathBlitz />} />
                <Route path="/tournaments"           element={<Tournaments />} />
                <Route path="/exam-alerts"           element={<ExamAlerts />} />
                <Route path="/classroom/planner"     element={<StudyPlanner />} />
                <Route path="/parent/dashboard"      element={<ParentDashboard />} />
                {/* remaining pages */}
                <Route path="/exams/:examId/universe"   element={<Stub title="Exam Universe 🌌" />} />

                {/* Guru Hub */}
                <Route path="/guru-hub"             element={<GuruHub />} />
                <Route path="/guru-hub/post-doubt"  element={<Stub title="Post a Doubt" />} />
                <Route path="/guru-hub/:doubtId"    element={<Stub title="Doubt Thread" />} />

                {/* Discovery */}
                
                <Route path="/career-compass"  element={<CareerCompass />} />
                <Route path="/scholarships"    element={<ScholarshipHub />} />
                <Route path="/pro"             element={<PricingPage />} />
                <Route path="/wallet"          element={<WalletPage />} />
                <Route path="/family"          element={<FamilyHub />} />
              
                <Route path="/roadmap/:examId"  element={<Stub title="My Roadmap 🗺️" />} />
                <Route path="/exam-alerts"      element={<Stub title="Exam Watch 📡" />} />

                {/* Hall — static before dynamic */}
                
                <Route path="/hall"            element={<HallHub />} />
                <Route path="/hall/create"     element={<Stub title="Create Hall" />} />
                <Route path="/hall/leaderboard" element={<HallHub />} />
                <Route path="/hall/:hallId"    element={<Stub title="Hall Home" />} />
                <Route path="/leaderboard"     element={<FullLeaderboard />} />
                <Route path="/analytics"       element={<Analytics />} />
                <Route path="/achievements"    element={<Achievements />} />
                <Route path="/focus-mode"      element={<FocusMode />} />
                <Route path="/current-affairs" element={<CurrentAffairs />} />
                <Route path="/hall/create"           element={<Stub title="Create Hall" />} />
                <Route path="/hall/leaderboard"      element={<Stub title="Hall Leaderboard" />} />
                <Route path="/hall/:hallId"          element={<Stub title="Hall Home" />} />
                <Route path="/hall/:hallId/battle"   element={<Stub title="Battle Arena ⚔️" />} />

                {/* Games */}
                <Route path="/games"            element={<Stub title="Brain Games 🎮" />} />
                <Route path="/games/math-blitz" element={<Stub title="Math Blitz ⚡" />} />
                <Route path="/brain-teaser"     element={<Stub title="Brain Teaser 🧠" />} />
                <Route path="/focus-mode"       element={<Stub title="Focus Mode 🎯" />} />
                <Route path="/tournaments"      element={<Stub title="Tournaments 🏆" />} />

                {/* Content */}
                <Route path="/classroom"         element={<Stub title="Classroom 📚" />} />
                <Route path="/classroom/pdf"     element={<Stub title="PDF Library 📄" />} />
                <Route path="/classroom/planner" element={<Stub title="Study Planner 📅" />} />
                <Route path="/current-affairs"   element={<Stub title="Current Affairs 📰" />} />
                <Route path="/scholarships"      element={<Stub title="Scholarships 🎓" />} />
                <Route path="/subjects"          element={<Stub title="Subjects" />} />
                <Route path="/daily-quiz"        element={<Stub title="Daily Quiz" />} />

                {/* Mentor */}
                <Route path="/mentor-hub"          element={<Stub title="Mentor Hub" />} />
                <Route path="/mentor-hub/cashback" element={<Stub title="Cashback Center" />} />
                <Route path="/mentor-hub/coupons"  element={<CouponManager />} />

                {/* Payments */}
                <Route path="/pro"      element={<Stub title="TryIT Pro 💳" />} />
                <Route path="/family"   element={<Stub title="Family Hub 👨‍👩‍👧‍👦" />} />
                <Route path="/wallet"   element={<Stub title="My Wallet 🪙" />} />
                <Route path="/referral" element={<Stub title="Refer & Earn 🎁" />} />

                {/* Analytics */}
                <Route path="/analytics"    element={<Stub title="Analytics 📊" />} />
                <Route path="/achievements" element={<Stub title="Achievements 🏅" />} />
                <Route path="/leaderboard"  element={<Stub title="Leaderboard 🏆" />} />

                {/* Centre */}
                <Route path="/centre/login"        element={<Stub title="Centre Login" />} />
                <Route path="/centre/dashboard"    element={<CentreDashboard />} />
                <Route path="/centre/students"     element={<StudentHistory />} />
                <Route path="/centre/conduct-test" element={<Stub title="Conduct Test" />} />

                {/* Student */}
                <Route path="/student/test-history" element={<MyTestHistory />} />

                {/* Parent */}
                <Route path="/parent/login"     element={<Stub title="Parent Login" />} />
                <Route path="/parent/dashboard" element={<Stub title="Parent Dashboard" />} />

                {/* Admin */}
                <Route path="/admin/login"     element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Journey + Ebooks */}
                <Route path="/journey" element={<JourneyPassport />} />
                <Route path="/ebooks"  element={<EbookStore />} />

                {/* Blueprint Pillars */}
                <Route path="/equity"              element={<EquityTierSelector />} />
                <Route path="/circles/school"      element={<SchoolCircle />} />
                <Route path="/circles/sisterhood"  element={<SisterhoodCircle />} />
                
                <Route path="/accessibility"  element={<AccessibilityMode />} />
                <Route path="/donate"         element={<Stub title="Donation Page 💛" />} />
                <Route path="/impact"              element={<LiveImpactTracker />} />

                {/* Misc */}
                <Route path="/tryit-lab" element={<Stub title="TryIT Lab 🧪" />} />
                <Route path="/privacy"   element={<Stub title="Privacy Policy" />} />
                <Route path="/terms"     element={<Stub title="Terms of Service" />} />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
