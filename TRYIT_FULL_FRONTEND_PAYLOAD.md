// TARGET_FILE: src/data/mockSeeds.js
```js
// ── LEVEL SYSTEM (Cinematic + Indian Cinema Inspired) ─────────
export const LEVELS = [
  { level:1,  title:'The Fierce One',  emoji:'🔥', minXP:0,     maxXP:500,   color:'#EF4444' },
  { level:2,  title:'The Fighter',     emoji:'⚔️', minXP:500,   maxXP:1500,  color:'#F97316' },
  { level:3,  title:'The Riser',       emoji:'📈', minXP:1500,  maxXP:3000,  color:'#EAB308' },
  { level:4,  title:'The Gold Miner',  emoji:'⛏️', minXP:3000,  maxXP:6000,  color:'#D4AF37' },
  { level:5,  title:'The Grinder',     emoji:'💪', minXP:6000,  maxXP:10000, color:'#22C55E' },
  { level:6,  title:'Baahuveer',       emoji:'🦁', minXP:10000, maxXP:16000, color:'#D4AF37' },
  { level:7,  title:'Thalavan',        emoji:'👑', minXP:16000, maxXP:24000, color:'#8B5CF6' },
  { level:8,  title:'The Unstoppable', emoji:'⚡', minXP:24000, maxXP:35000, color:'#06B6D4' },
  { level:9,  title:'The Legend',      emoji:'🌟', minXP:35000, maxXP:50000, color:'#D4AF37' },
  { level:10, title:'The Absolute',    emoji:'🏆', minXP:50000, maxXP:99999, color:'#D4AF37' },
]

export const getLevelInfo = (xp) =>
  LEVELS.find(l => xp >= l.minXP && xp < l.maxXP) || LEVELS[9]

// ── BADGES (Cinematic) ────────────────────────────────────────
export const BADGES = [
  { id:'baahuveer',      name:'Baahuveer',        emoji:'🦁', desc:'Reach Level 6 — The Warrior King',       earned:true,  earnedDate:'May 2026' },
  { id:'thalavan',       name:'Thalavan',          emoji:'👑', desc:'Answer 50 doubts as Mentor',             earned:false, progress:34, target:50 },
  { id:'gold-king',      name:'The Gold King',     emoji:'🥇', desc:'Score 95%+ in any mock test',           earned:true,  earnedDate:'Apr 2026' },
  { id:'the-riser',      name:'The Riser',         emoji:'📈', desc:'Improve rank by 1000 positions',        earned:true,  earnedDate:'Mar 2026' },
  { id:'unstoppable',    name:'The Unstoppable',   emoji:'⚡', desc:'Complete 30-day study streak',           earned:false, progress:12, target:30 },
  { id:'champion',       name:'The Champion',      emoji:'🏆', desc:'Win 5 Hall Battles',                    earned:false, progress:2,  target:5  },
  { id:'fighter',        name:'The Fighter',       emoji:'⚔️', desc:'Complete 50 tests',                     earned:true,  earnedDate:'Apr 2026' },
  { id:'fearless',       name:'The Fearless',      emoji:'🎯', desc:'Attempt UPSC + JEE + NEET same year',   earned:false, progress:1,  target:3  },
  { id:'genius',         name:'The Genius',        emoji:'🧠', desc:'Score 100% in a Brain Game',            earned:true,  earnedDate:'May 2026' },
  { id:'obsessed',       name:'The Obsessed',      emoji:'🔬', desc:'Study 200 hours on TryIT',              earned:false, progress:48, target:200},
]

// ── STUDENT ID CARD TEMPLATES ─────────────────────────────────
export const ID_TEMPLATES = [
  {
    id:'royal-gold',
    name:'Royal Gold',
    bg:'linear-gradient(135deg,#1E3A5F 0%,#0F2140 50%,#1E3A5F 100%)',
    border:'#D4AF37',
    accent:'#D4AF37',
    textPrimary:'#FFFFFF',
    textSecondary:'rgba(212,175,55,0.85)',
    shine:true,
    pattern:'circuit',
  },
  {
    id:'legend',
    name:'The Legend',
    bg:'linear-gradient(135deg,#0A0A0A 0%,#1a1a2e 50%,#0A0A0A 100%)',
    border:'#D4AF37',
    accent:'#D4AF37',
    textPrimary:'#FFFFFF',
    textSecondary:'rgba(212,175,55,0.8)',
    shine:true,
    pattern:'holographic',
  },
  {
    id:'warrior',
    name:'Warrior',
    bg:'linear-gradient(135deg,#7C0A02 0%,#3D0000 50%,#7C0A02 100%)',
    border:'#FF6B35',
    accent:'#FF6B35',
    textPrimary:'#FFFFFF',
    textSecondary:'#FFB347',
    shine:false,
    pattern:'diagonal',
  },
  {
    id:'scholar',
    name:'Scholar',
    bg:'linear-gradient(135deg,#0369A1 0%,#075985 50%,#0369A1 100%)',
    border:'#FFFFFF',
    accent:'#7DD3FC',
    textPrimary:'#FFFFFF',
    textSecondary:'#BAE6FD',
    shine:false,
    pattern:'dots',
  },
  {
    id:'champion',
    name:'Champion',
    bg:'linear-gradient(135deg,#92400E 0%,#78350F 30%,#D4AF37 60%,#92400E 100%)',
    border:'#FDE68A',
    accent:'#FDE68A',
    textPrimary:'#1C1917',
    textSecondary:'#44403C',
    shine:true,
    pattern:'trophy',
  },
]

// ── GURU HUB SEEDED DATA ─────────────────────────────────────
export const GURU_DOUBTS = [
  {
    id:'d001',
    userId:'usr-103',
    userName:'Priya Sharma',
    userInitials:'PS',
    userLevel:'Level 5',
    examTag:'SSC CGL',
    subject:'Quantitative Aptitude',
    question:'In a mixture of 60 litres, the ratio of milk and water is 2:1. If this ratio is to be 1:2, then the amount of water to be further added is?',
    timeAgo:'2 min ago',
    views:247,
    answers:[
      {
        id:'a001',
        mentorId:'usr-m01',
        mentorName:'Vikram Nair',
        mentorInitials:'VN',
        mentorBadge:'Thalavan',
        mentorBadgeEmoji:'👑',
        isBest:true,
        text:'Current mixture: 60L with milk:water = 2:1\nMilk = 40L, Water = 20L\nFor ratio 1:2, if milk = 40L then water needed = 80L\nExtra water = 80 - 20 = 60 litres ✅\n\nShortcut: When milk stays constant, find new water for 1:2 ratio.',
        rating:4.9,
        reactions:{ fire:34, bulb:12, heart:8, star:21 },
        timeAgo:'5 min ago',
      },
      {
        id:'a002',
        mentorId:'usr-m02',
        mentorName:'Deepa R.',
        mentorInitials:'DR',
        mentorBadge:'The Genius',
        mentorBadgeEmoji:'🧠',
        isBest:false,
        text:'Simple approach: Milk = 40L (unchanged). For 1:2 ratio → water = 2×40 = 80L. Already have 20L, so add 60L.',
        rating:4.7,
        reactions:{ fire:18, bulb:9, heart:3, star:11 },
        timeAgo:'8 min ago',
      },
    ],
    reactions:{ fire:67, bulb:23, heart:15, star:42 },
  },
  {
    id:'d002',
    userId:'usr-104',
    userName:'Rahul Mehta',
    userInitials:'RM',
    userLevel:'Level 3',
    examTag:'UPSC CSE',
    subject:'Polity',
    question:'What is the difference between Fundamental Rights and Directive Principles? Why can\'t DPSPs be enforced in court?',
    timeAgo:'15 min ago',
    views:412,
    answers:[
      {
        id:'a003',
        mentorId:'usr-m03',
        mentorName:'Ananya IAS',
        mentorInitials:'AI',
        mentorBadge:'Baahuveer',
        mentorBadgeEmoji:'🦁',
        isBest:true,
        text:'Fundamental Rights (Part III): Justiciable — can be enforced in Supreme Court under Art 32. Negative in nature — restrict state action.\n\nDPSPs (Part IV): Non-justiciable — Art 37 explicitly says courts cannot enforce them. They are GUIDELINES for state policy. Positive obligations on state.\n\nKey reason: DPSPs need resources to implement. Constitution makers knew newly independent India couldn\'t guarantee socio-economic rights immediately.',
        rating:5.0,
        reactions:{ fire:89, bulb:56, heart:34, star:71 },
        timeAgo:'20 min ago',
      },
    ],
    reactions:{ fire:94, bulb:61, heart:38, star:77 },
  },
  {
    id:'d003',
    userId:'usr-105',
    userName:'Zainab Ali',
    userInitials:'ZA',
    userLevel:'Level 2',
    examTag:'NEET UG',
    subject:'Biology',
    question:'What is the role of Corpus Luteum after fertilization? What happens if fertilization does not occur?',
    timeAgo:'32 min ago',
    views:318,
    answers:[
      {
        id:'a004',
        mentorId:'usr-m04',
        mentorName:'Dr. Kavitha',
        mentorInitials:'DK',
        mentorBadge:'The Fighter',
        mentorBadgeEmoji:'⚔️',
        isBest:true,
        text:'After fertilization:\n→ HCG (human chorionic gonadotropin) from developing embryo maintains corpus luteum\n→ CL secretes progesterone throughout 1st trimester\n→ Prevents menstruation, maintains uterine lining\n\nWithout fertilization:\n→ CL degenerates after ~14 days (corpus albicans)\n→ Progesterone levels drop\n→ Uterine lining sheds → menstruation begins\n\nMemory trick: CL = Caretaker of Luteal phase 🧬',
        rating:4.8,
        reactions:{ fire:44, bulb:38, heart:19, star:33 },
        timeAgo:'35 min ago',
      },
    ],
    reactions:{ fire:51, bulb:42, heart:22, star:38 },
  },
  {
    id:'d004',
    userId:'usr-106',
    userName:'Arjun Patel',
    userInitials:'AP',
    userLevel:'Level 4',
    examTag:'IBPS PO',
    subject:'Reasoning',
    question:'In a coding system, MOTHER is coded as ONVJGT. How will FATHER be coded in the same system?',
    timeAgo:'1 hr ago',
    views:523,
    answers:[
      {
        id:'a005',
        mentorId:'usr-m01',
        mentorName:'Vikram Nair',
        mentorInitials:'VN',
        mentorBadge:'Thalavan',
        mentorBadgeEmoji:'👑',
        isBest:true,
        text:'M→O (+2), O→N (-1)... wait let me check:\nM(13)→O(15) +2 | O(15)→N(14) -1 | T(20)→V(22) +2 | H(8)→J(10) +2 | E(5)→G(7) +2 | R(18)→T(20) +2\n\nPattern: Each letter +2 EXCEPT the 2nd letter which is -1!\n\nFATHER: F→H, A→Z (reverse? No...)\nActually: F(6)→H(8), A(1)→Z? Let me recheck... \nF+2=H, A+2=C, T+2=V, H+2=J, E+2=G, R+2=T\n\nFATHER = HCVJGT ✅',
        rating:4.6,
        reactions:{ fire:29, bulb:41, heart:7, star:18 },
        timeAgo:'1 hr ago',
      },
    ],
    reactions:{ fire:37, bulb:48, heart:9, star:24 },
  },
  {
    id:'d005',
    userId:'usr-107',
    userName:'Meera Krishnan',
    userInitials:'MK',
    userLevel:'Level 3',
    examTag:'JEE Main',
    subject:'Physics',
    question:'Why does a ball thrown upward feel weightless at the top of its trajectory? Is it truly weightless?',
    timeAgo:'2 hrs ago',
    views:689,
    answers:[
      {
        id:'a006',
        mentorId:'usr-m05',
        mentorName:'Prof. Srinivas',
        mentorInitials:'PS',
        mentorBadge:'The Gold King',
        mentorBadgeEmoji:'🥇',
        isBest:true,
        text:'NOT truly weightless! Weight = mg acts throughout.\n\nAt the top: velocity = 0 BUT acceleration = g downward (still in free fall).\n\nWhy it FEELS weightless: The ball is in free fall — no normal force, no contact force. Our sense of weight comes from normal force, not gravity.\n\nProof: In an elevator falling freely, you float → feel weightless even though g still acts.\n\nKey distinction:\n• Weight (mg) = ALWAYS acts\n• Apparent weight = 0 during free fall\n• True weightlessness only in deep space (zero g)',
        rating:5.0,
        reactions:{ fire:78, bulb:92, heart:31, star:64 },
        timeAgo:'2 hrs ago',
      },
    ],
    reactions:{ fire:83, bulb:98, heart:35, star:71 },
  },
]

// ── PLATFORM FEATURES FOR LANDING ────────────────────────────
export const PLATFORM_FEATURES = [
  {
    id:'test-engine',
    emoji:'⚡',
    title:'AI-Powered Test Engine',
    subtitle:'Mock · PYQ · Speed Drill · Custom',
    desc:'Real exam pattern questions with All India ranking after every test. Full analysis of weak areas, subject-wise breakdown, and projected score.',
    badge:'P1 Feature',
    color:'#1E3A5F',
    stats:'2.4M tests taken',
  },
  {
    id:'exam-universe',
    emoji:'🌌',
    title:'Exam Universe',
    subtitle:'A-to-Z Exam Profiles',
    desc:'Every exam fully profiled — salary, career path, syllabus, eligibility, cut-offs 10 years, preparation strategy, and FAQ. Before you prepare, understand your battlefield.',
    badge:'Exclusive',
    color:'#7C3AED',
    stats:'9,852 exam profiles',
  },
  {
    id:'career-compass',
    emoji:'🧭',
    title:'Career Compass',
    subtitle:'Find Your Perfect Exam',
    desc:'8-question quiz about your age, education, salary target, and time. Algorithm scans all 75,000+ exams and shows your top matches with % compatibility.',
    badge:'AI Matching',
    color:'#065F46',
    stats:'12 min to find your path',
  },
  {
    id:'guru-hub',
    emoji:'🎓',
    title:'Guru Hub',
    subtitle:'Ask. Answer. Earn.',
    desc:'Post doubts, get answers from verified mentors within 2 hours. Mentors earn ₹50–500/week. 24/7 active community of 50,000+ students.',
    badge:'Community',
    color:'#0369A1',
    stats:'50,000+ students active',
  },
  {
    id:'student-id',
    emoji:'🪪',
    title:'Student ID Card',
    subtitle:'5 Cinematic Templates',
    desc:'Royal Gold, The Legend, Warrior, Scholar, Champion — 5 premium templates with 3D flip animation. Share your rank and exam on Instagram, WhatsApp.',
    badge:'🔥 Viral',
    color:'#D4AF37',
    stats:'Share your journey',
  },
  {
    id:'the-hall',
    emoji:'👥',
    title:'The Hall',
    subtitle:'Study Squad · Battles · Leaderboard',
    desc:'Form study groups up to 10. Challenge rival halls. Group streak keeps everyone accountable. National Hall Leaderboard every week.',
    badge:'Social',
    color:'#1E3A5F',
    stats:'Hall battles every week',
  },
  {
    id:'brain-games',
    emoji:'🎮',
    title:'Brain Games',
    subtitle:'10 Games · Coins · Live Tournaments',
    desc:'Math Blitz, Word Rush, Logic Grid, GK Blitz + 6 more. Earn coins while sharpening exam skills. Live tournaments with prize pools.',
    badge:'Fun Learning',
    color:'#991B1B',
    stats:'3.1M games played',
  },
  {
    id:'languages',
    emoji:'🌐',
    title:'40+ Indian Languages',
    subtitle:'Study in Your Mother Tongue',
    desc:'All questions available in Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati + 32 more. New languages added weekly.',
    badge:'Inclusive',
    color:'#0369A1',
    stats:'40+ languages live',
  },
  {
    id:'roadmap',
    emoji:'🗺️',
    title:'My Roadmap',
    subtitle:'Today → Exam Day',
    desc:'Personalised day-by-day study plan from today to your exam. Phase-wise milestones, daily tasks, and rank projection. Adjusts automatically.',
    badge:'Personalised',
    color:'#065F46',
    stats:'Auto-adjusting daily',
  },
  {
    id:'exam-watch',
    emoji:'📡',
    title:'Exam Watch',
    subtitle:'Live Alerts · Deadlines · Results',
    desc:'Never miss an application deadline or result. Smart push notifications only for YOUR enrolled exams. Official website linked for every alert.',
    badge:'Smart Alerts',
    color:'#DC2626',
    stats:'Zero spam guaranteed',
  },
  {
    id:'focus-mode',
    emoji:'🎯',
    title:'Focus Mode',
    subtitle:'Pomodoro · Ambient Sounds',
    desc:'25-minute deep study sessions with Rain, Forest, Cafe or Silence ambience. Sessions logged, coins earned, streak maintained.',
    badge:'Productivity',
    color:'#0F2140',
    stats:'Earn coins while studying',
  },
  {
    id:'scholarships',
    emoji:'🎓',
    title:'Scholarship Hub',
    subtitle:'Free Money for Your Education',
    desc:'800+ scholarships — Central, State, Private, Merit, Need-based. Deadline alerts so you never miss free funding for your studies.',
    badge:'Free Money',
    color:'#D4AF37',
    stats:'800+ scholarships tracked',
  },
]

// ── LANGUAGES SHOWCASE ────────────────────────────────────────
export const LANGUAGES_DATA = [
  { code:'en', name:'English',    native:'English',     flag:'🇬🇧' },
  { code:'hi', name:'Hindi',      native:'हिंदी',        flag:'🇮🇳' },
  { code:'ta', name:'Tamil',      native:'தமிழ்',         flag:'🌺' },
  { code:'te', name:'Telugu',     native:'తెలుగు',        flag:'🌸' },
  { code:'kn', name:'Kannada',    native:'ಕನ್ನಡ',         flag:'🌼' },
  { code:'ml', name:'Malayalam',  native:'മലയാളം',        flag:'🌴' },
  { code:'mr', name:'Marathi',    native:'मराठी',         flag:'🌻' },
  { code:'bn', name:'Bengali',    native:'বাংলা',          flag:'🌹' },
  { code:'gu', name:'Gujarati',   native:'ગુજરાતી',        flag:'🌾' },
  { code:'pa', name:'Punjabi',    native:'ਪੰਜਾਬੀ',         flag:'🌾' },
  { code:'or', name:'Odia',       native:'ଓଡ଼ିଆ',          flag:'🌊' },
  { code:'as', name:'Assamese',   native:'অসমীয়া',         flag:'🍃' },
  { code:'mni','name':'Manipuri', native:'মৈতৈলোন্',        flag:'🏔️' },
  { code:'mizo','name':'Mizo',    native:'Mizo ṭawng',   flag:'🌿' },
  { code:'ur', name:'Urdu',       native:'اردو',            flag:'☪️' },
  { code:'ks', name:'Kashmiri',   native:'کٲشُر',           flag:'❄️' },
]

// ── TESTIMONIALS (The Hall - Infinite Marquee) ────────────────
export const TESTIMONIALS = [
  { name:'Arjun K.',     state:'Tamil Nadu',  exam:'SSC CGL',   rank:'#1,243', score:'89%', text:'"Moved from #8,432 to #1,243 in 30 days. The mock tests are exactly like the real exam." 🔥', level:'The Gold Miner', emoji:'⛏️' },
  { name:'Priya S.',     state:'Kerala',      exam:'NEET UG',   rank:'#847',   score:'94%', text:'"Studied in Malayalam for the first time. Biology explanations are crystal clear." 🌴', level:'The Fighter', emoji:'⚔️' },
  { name:'Rahul M.',     state:'Bihar',       exam:'UPSC CSE',  rank:'#2,341', score:'82%', text:'"Career Compass told me to try UPSC + BPSC combo. Best decision of my life." 🎯', level:'The Riser', emoji:'📈' },
  { name:'Zainab A.',    state:'Hyderabad',   exam:'IBPS PO',   rank:'#519',   score:'91%', text:'"The Guru Hub saved me. My bank exam doubt got answered in 7 minutes at midnight." 🎓', level:'Baahuveer', emoji:'🦁' },
  { name:'Karan T.',     state:'Punjab',      exam:'NDA',       rank:'#312',   score:'88%', text:'"Hall battles kept me accountable. My squad studied together every night." 👥', level:'The Fierce One', emoji:'🔥' },
  { name:'Deepika R.',   state:'Manipur',     exam:'CTET',      rank:'#1,021', score:'87%', text:'"First platform with Manipuri language support. Thank you TryIT!" 🏔️', level:'The Riser', emoji:'📈' },
  { name:'Mohammed I.',  state:'UP',          exam:'SSC CHSL',  rank:'#743',   score:'86%', text:'"₹19 trial was enough to know this is different. Now on annual Pro." 💳', level:'The Grinder', emoji:'💪' },
  { name:'Sunita P.',    state:'Odisha',      exam:'RRB NTPC',  rank:'#1,892', score:'83%', text:'"Study planner + Focus Mode changed my whole routine. Studying 6hrs daily now." 📅', level:'The Fighter', emoji:'⚔️' },
]

// ── LEADERBOARD MOCK DATA ─────────────────────────────────────
export const LEADERBOARD_DATA = [
  { rank:1,    name:'Priya Sharma',    state:'Kerala',       exam:'NEET UG',  score:'97.4%', badge:'The Unstoppable', badgeEmoji:'⚡' },
  { rank:2,    name:'Rahul Kumar',     state:'Delhi',        exam:'UPSC CSE', score:'94.8%', badge:'Thalavan',        badgeEmoji:'👑' },
  { rank:3,    name:'Aisha Mohammed',  state:'Gujarat',      exam:'IBPS PO',  score:'93.1%', badge:'Baahuveer',       badgeEmoji:'🦁' },
  { rank:4,    name:'Vikram Singh',    state:'Rajasthan',    exam:'SSC CGL',  score:'92.6%', badge:'The Gold King',   badgeEmoji:'🥇' },
  { rank:5,    name:'Deepa Nair',      state:'Tamil Nadu',   exam:'NEET UG',  score:'91.9%', badge:'The Legend',      badgeEmoji:'🌟' },
  { rank:6,    name:'Arjun Patel',     state:'Maharashtra',  exam:'JEE Adv',  score:'91.2%', badge:'The Genius',      badgeEmoji:'🧠' },
  { rank:7,    name:'Meera Krishnan',  state:'Karnataka',    exam:'GATE CS',  score:'90.7%', badge:'The Fighter',     badgeEmoji:'⚔️' },
  { rank:8,    name:'Sanjay Yadav',    state:'UP',           exam:'UPSC CSE', score:'90.1%', badge:'The Riser',       badgeEmoji:'📈' },
  { rank:1243, name:'Arjun Kumar',     state:'Tamil Nadu',   exam:'SSC CGL',  score:'78.0%', badge:'The Gold Miner',  badgeEmoji:'⛏️', isMe:true },
]
```
// TARGET_FILE: src/context/AuthContext.jsx
```jsx
import { createContext, useContext } from 'react'
import { getLevelInfo } from '../data/mockSeeds'

const MOCK_USER = {
  id:'usr-001', name:'Arjun Kumar', initials:'AK', email:'arjun@tryiteducations.net',
  state:'Tamil Nadu', city:'Coimbatore', category:'General',
  level:4, levelTitle:'The Gold Miner', levelEmoji:'⛏️', xp:6240, xpToNext:8000,
  coins:1247, streak:12, streakFreezes:2, isPro:true,
  userId:'TRY-TN-00001-2026', joinDate:'January 2026',
  rank:1243, testsCompleted:23, avgScore:78, studyHours:'48h 30m', guruPoints:847,
  languages:['en','ta'],
  exams:[
    { id:'ssc-cgl',  name:'SSC CGL',  readiness:67, examDate:'Aug 2026'  },
    { id:'upsc-cse', name:'UPSC CSE', readiness:34, examDate:'May 2026'  },
    { id:'neet-ug',  name:'NEET UG',  readiness:12, examDate:'May 2026'  },
    { id:'ibps-po',  name:'IBPS PO',  readiness:45, examDate:'Jul 2026'  },
    { id:'gate-cs',  name:'GATE CS',  readiness:28, examDate:'Feb 2027'  },
  ],
  subjects:[
    { name:'Quant',     accuracy:82, trend:'up',   emoji:'📐' },
    { name:'Reasoning', accuracy:90, trend:'up',   emoji:'🧠' },
    { name:'English',   accuracy:68, trend:'down', emoji:'📝' },
    { name:'GK',        accuracy:75, trend:'up',   emoji:'🌏' },
    { name:'Science',   accuracy:55, trend:'down', emoji:'🔬' },
  ],
}

const AuthCtx = createContext({})

export function AuthProvider({ children }) {
  return (
    <AuthCtx.Provider value={{
      user: MOCK_USER,
      profile: MOCK_USER,
      loading: false,
      isAuthenticated: true,
      login: () => {},
      logout: () => {},
      sendOTP: async () => ({ error: null }),
      verifyOTP: async () => ({ user: MOCK_USER, error: null }),
      signInWithGoogle: async () => ({ error: null }),
    }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
```

// TARGET_FILE: src/App.jsx
```jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider }  from './context/ThemeContext'
import { ToastProvider }  from './context/ToastContext'
import { AuthProvider }   from './context/AuthContext'

const Splash          = lazy(() => import('./pages/Splash'))
const Landing         = lazy(() => import('./pages/Landing'))
const Login           = lazy(() => import('./pages/Login'))
const Onboarding      = lazy(() => import('./pages/Onboarding'))
const Dashboard       = lazy(() => import('./pages/Dashboard'))
const Profile         = lazy(() => import('./pages/Profile'))
const Settings        = lazy(() => import('./pages/Settings'))
const Notifications   = lazy(() => import('./pages/Notifications'))

const TestLauncher    = lazy(() => import('./pages/test-engine/TestLauncher'))
const ActiveTest      = lazy(() => import('./pages/test-engine/ActiveTest'))
const ResultScreen    = lazy(() => import('./pages/test-engine/ResultScreen'))
const ReviewScreen    = lazy(() => import('./pages/test-engine/ReviewScreen'))

const AllExams        = lazy(() => import('./pages/exams/AllExams'))
const ExamDetail      = lazy(() => import('./pages/exams/ExamDetail'))
const ExamUniverse    = lazy(() => import('./pages/exams/ExamUniverse'))

const CareerCompass   = lazy(() => import('./pages/career-compass/CareerCompass'))
const Roadmap         = lazy(() => import('./pages/roadmap/Roadmap'))
const ExamAlerts      = lazy(() => import('./pages/exam-alerts/ExamAlerts'))

const HallHub         = lazy(() => import('./pages/hall/HallHub'))
const CreateHall      = lazy(() => import('./pages/hall/CreateHall'))
const HallHome        = lazy(() => import('./pages/hall/HallHome'))
const BattleArena     = lazy(() => import('./pages/hall/BattleArena'))
const HallLeaderboard = lazy(() => import('./pages/hall/HallLeaderboard'))

const GamesHub        = lazy(() => import('./pages/games/GamesHub'))
const MathBlitz       = lazy(() => import('./pages/games/MathBlitz'))
const BrainTeaser     = lazy(() => import('./pages/brain-teaser/BrainTeaser'))
const FocusMode       = lazy(() => import('./pages/focus-mode/FocusMode'))
const TournamentHub   = lazy(() => import('./pages/tournaments/TournamentHub'))

const ClassroomHub    = lazy(() => import('./pages/classroom/ClassroomHub'))
const PDFLibrary      = lazy(() => import('./pages/classroom/PDFLibrary'))
const StudyPlanner    = lazy(() => import('./pages/classroom/StudyPlanner'))
const CurrentAffairs  = lazy(() => import('./pages/current-affairs/CurrentAffairs'))
const ScholarshipHub  = lazy(() => import('./pages/scholarships/ScholarshipHub'))

const GuruHub         = lazy(() => import('./pages/guru/GuruHub'))
const PostDoubt       = lazy(() => import('./pages/guru/PostDoubt'))
const DoubtThread     = lazy(() => import('./pages/guru/DoubtThread'))
const MentorHub       = lazy(() => import('./pages/mentor/MentorHub'))
const CashbackCenter  = lazy(() => import('./pages/mentor/CashbackCenter'))

const PricingPage     = lazy(() => import('./pages/pricing/PricingPage'))
const FamilyHub       = lazy(() => import('./pages/family/FamilyHub'))
const WalletPage      = lazy(() => import('./pages/wallet/WalletPage'))
const ReferralPage    = lazy(() => import('./pages/referral/ReferralPage'))

const Analytics       = lazy(() => import('./pages/analytics/Analytics'))
const Achievements    = lazy(() => import('./pages/achievements/Achievements'))
const Leaderboard     = lazy(() => import('./pages/leaderboard/Leaderboard'))

const ParentLogin     = lazy(() => import('./pages/parent/ParentLogin'))
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard'))
const CentreLogin     = lazy(() => import('./pages/centre/CentreLogin'))
const CentreDashboard = lazy(() => import('./pages/centre/CentreDashboard'))
const ConductTest     = lazy(() => import('./pages/centre/ConductTest'))

const TryITLab        = lazy(() => import('./pages/tryit-lab/TryITLab'))
const Privacy         = lazy(() => import('./pages/legal/Privacy'))
const Terms           = lazy(() => import('./pages/legal/Terms'))

// Stub for pages not yet built
const Stub = ({ name }) => (
  <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center', fontFamily:'Poppins,sans-serif',
    background:'#F8FAFC' }}>
    <div style={{ fontSize:48, marginBottom:12 }}>🔧</div>
    <p style={{ fontSize:22, fontWeight:700, color:'#1E3A5F', marginBottom:6 }}>{name}</p>
    <p style={{ color:'#64748B', fontSize:14 }}>Coming in the next phase</p>
  </div>
)

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
                {/* ── PUBLIC ─────────────────────────────── */}
                <Route path="/"            element={<Splash />} />
                <Route path="/landing"     element={<Landing />} />
                <Route path="/login"       element={<Login />} />
                <Route path="/onboarding"  element={<Onboarding />} />

                {/* ── STANDALONE PORTALS (no sidebar) ──── */}
                <Route path="/parent/login"     element={<ParentLogin />} />
                <Route path="/parent/dashboard" element={<ParentDashboard />} />
                <Route path="/centre/login"     element={<CentreLogin />} />
                <Route path="/centre/dashboard" element={<CentreDashboard />} />
                <Route path="/centre/conduct-test" element={<ConductTest />} />

                {/* ── APP ROUTES (with sidebar) ─────────── */}
                <Route path="/dashboard"   element={<Dashboard />} />
                <Route path="/profile"     element={<Profile />} />
                <Route path="/settings"    element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />

                {/* Test Engine */}
                <Route path="/test-engine"          element={<TestLauncher />} />
                <Route path="/test-engine/active"   element={<ActiveTest />} />
                <Route path="/test-engine/result"   element={<ResultScreen />} />
                <Route path="/test-engine/review"   element={<ReviewScreen />} />

                {/* Exams */}
                <Route path="/exams"                       element={<AllExams />} />
                <Route path="/exams/:examId"               element={<ExamDetail />} />
                <Route path="/exams/:examId/universe"      element={<ExamUniverse />} />

                {/* Discovery */}
                <Route path="/career-compass"   element={<CareerCompass />} />
                <Route path="/roadmap/:examId"  element={<Roadmap />} />
                <Route path="/exam-alerts"      element={<ExamAlerts />} />

                {/* Hall — static routes BEFORE dynamic :hallId */}
                <Route path="/hall"                  element={<HallHub />} />
                <Route path="/hall/create"           element={<CreateHall />} />
                <Route path="/hall/leaderboard"      element={<HallLeaderboard />} />
                <Route path="/hall/:hallId"          element={<HallHome />} />
                <Route path="/hall/:hallId/battle"   element={<BattleArena />} />

                {/* Games */}
                <Route path="/games"             element={<GamesHub />} />
                <Route path="/games/math-blitz"  element={<MathBlitz />} />
                <Route path="/brain-teaser"      element={<BrainTeaser />} />
                <Route path="/focus-mode"        element={<FocusMode />} />
                <Route path="/tournaments"       element={<TournamentHub />} />

                {/* Content */}
                <Route path="/classroom"           element={<ClassroomHub />} />
                <Route path="/classroom/pdf"       element={<PDFLibrary />} />
                <Route path="/classroom/planner"   element={<StudyPlanner />} />
                <Route path="/current-affairs"     element={<CurrentAffairs />} />
                <Route path="/scholarships"        element={<ScholarshipHub />} />
                <Route path="/subjects"            element={<Stub name="Subjects Hub" />} />
                <Route path="/daily-quiz"          element={<Stub name="Daily Quiz" />} />

                {/* Guru / Mentor */}
                <Route path="/guru-hub"                element={<GuruHub />} />
                <Route path="/guru-hub/post-doubt"     element={<PostDoubt />} />
                <Route path="/guru-hub/:doubtId"       element={<DoubtThread />} />
                <Route path="/mentor-hub"              element={<MentorHub />} />
                <Route path="/mentor-hub/cashback"     element={<CashbackCenter />} />

                {/* Payments / Family */}
                <Route path="/pro"       element={<PricingPage />} />
                <Route path="/family"    element={<FamilyHub />} />
                <Route path="/wallet"    element={<WalletPage />} />
                <Route path="/referral"  element={<ReferralPage />} />

                {/* Analytics */}
                <Route path="/analytics"     element={<Analytics />} />
                <Route path="/achievements"  element={<Achievements />} />
                <Route path="/leaderboard"   element={<Leaderboard />} />

                {/* Misc */}
                <Route path="/tryit-lab"  element={<TryITLab />} />
                <Route path="/privacy"    element={<Privacy />} />
                <Route path="/terms"      element={<Terms />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
```
// TARGET_FILE: src/components/profile/StudentIDCard.jsx
```jsx
import { useState } from 'react'
import { useToast } from '../../context/ToastContext'
import { ID_TEMPLATES } from '../../data/mockSeeds'

const LEVEL_LOGOS = { 'The Fierce One':'🔥','The Fighter':'⚔️','The Riser':'📈',
  'The Gold Miner':'⛏️','The Grinder':'💪','Baahuveer':'🦁','Thalavan':'👑',
  'The Unstoppable':'⚡','The Legend':'🌟','The Absolute':'🏆' }

function IDCardFace({ user, template, isFront }) {
  const T = template

  if (isFront) return (
    <div style={{
      width:'100%', height:'100%',
      background: T.bg,
      borderRadius:'20px',
      border: `2px solid ${T.border}`,
      padding:'24px',
      display:'flex', flexDirection:'column',
      justifyContent:'space-between',
      position:'relative', overflow:'hidden',
      boxShadow:`0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${T.border}44`,
    }}>
      {/* Shine overlay */}
      {T.shine && (
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 50%,rgba(255,255,255,0.04) 100%)',
          borderRadius:'20px', pointerEvents:'none',
        }} />
      )}

      {/* Pattern overlay */}
      {T.pattern === 'circuit' && (
        <div style={{ position:'absolute', inset:0, opacity:0.06, pointerEvents:'none',
          backgroundImage:`repeating-linear-gradient(0deg,${T.border} 0,${T.border} 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,${T.border} 0,${T.border} 1px,transparent 1px,transparent 40px)`,
        }} />
      )}
      {T.pattern === 'holographic' && (
        <div style={{ position:'absolute', inset:0, opacity:0.15, pointerEvents:'none',
          background:`repeating-linear-gradient(45deg,${T.accent}22 0px,${T.accent}44 2px,transparent 2px,transparent 20px)`,
        }} />
      )}

      {/* Top row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'18px',
            color:T.textPrimary, letterSpacing:'2px' }}>
            TRY<span style={{ color:T.accent }}>IT</span>
          </div>
          <div style={{ color:T.textSecondary, fontSize:'8px', letterSpacing:'3px', marginTop:'1px' }}>
            EDUCATIONS
          </div>
        </div>
        <div style={{
          background:`${T.accent}22`, border:`1px solid ${T.accent}44`,
          borderRadius:'8px', padding:'4px 10px',
          color:T.accent, fontSize:'10px', fontWeight:700, letterSpacing:'1px',
        }}>
          {user.isPro ? '⚡ PRO' : 'STUDENT'}
        </div>
      </div>

      {/* Avatar + name */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px', margin:'20px 0 12px' }}>
        <div style={{
          width:'60px', height:'60px', borderRadius:'50%',
          background:`linear-gradient(135deg,${T.accent},${T.accent}88)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'22px',
          color: T.id === 'champion' ? '#1C1917' : '#1E3A5F',
          border:`2px solid ${T.border}`,
          boxShadow:`0 0 20px ${T.accent}44`,
          flexShrink:0,
        }}>
          {user.initials}
        </div>
        <div>
          <div style={{ color:T.textPrimary, fontFamily:'Poppins,sans-serif',
            fontWeight:700, fontSize:'16px', letterSpacing:'0.5px' }}>
            {user.name}
          </div>
          <div style={{ color:T.textSecondary, fontSize:'11px', marginTop:'3px' }}>
            {user.levelEmoji} {user.levelTitle}
          </div>
          <div style={{ color:T.textSecondary, fontSize:'10px', opacity:0.8, marginTop:'2px' }}>
            {user.city}, {user.state}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'flex', gap:'8px' }}>
        {[
          { label:'RANK', val:`#${user.rank.toLocaleString()}` },
          { label:'STREAK', val:`${user.streak}d 🔥` },
          { label:'SCORE',  val:`${user.avgScore}%` },
        ].map(s => (
          <div key={s.label} style={{
            flex:1, background:`${T.accent}15`,
            border:`1px solid ${T.accent}30`,
            borderRadius:'10px', padding:'8px 6px', textAlign:'center',
          }}>
            <div style={{ color:T.accent, fontFamily:'Poppins,sans-serif',
              fontWeight:700, fontSize:'13px' }}>{s.val}</div>
            <div style={{ color:T.textSecondary, fontSize:'8px',
              letterSpacing:'1px', marginTop:'2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ display:'flex', justifyContent:'space-between',
        alignItems:'center', marginTop:'12px' }}>
        <div style={{ color:T.textSecondary, fontSize:'9px',
          fontFamily:'monospace', letterSpacing:'2px' }}>
          {user.userId}
        </div>
        <div style={{ color:T.textSecondary, fontSize:'9px' }}>
          {user.exams[0]?.name}
        </div>
      </div>
    </div>
  )

  // BACK of card
  return (
    <div style={{
      width:'100%', height:'100%', background:T.bg,
      borderRadius:'20px', border:`2px solid ${T.border}`,
      padding:'24px', display:'flex', flexDirection:'column',
      justifyContent:'center', alignItems:'center',
      gap:'16px', position:'relative', overflow:'hidden',
    }}>
      {T.shine && (
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 60%)',
          borderRadius:'20px', pointerEvents:'none' }} />
      )}
      <div style={{ fontSize:'40px' }}>{LEVEL_LOGOS[user.levelTitle] || '🎓'}</div>
      <div style={{ color:T.textPrimary, fontFamily:'Poppins,sans-serif',
        fontWeight:700, fontSize:'18px', textAlign:'center' }}>
        {user.levelTitle}
      </div>
      <div style={{ width:'60%', height:'1px', background:`${T.accent}40` }} />
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', width:'100%' }}>
        {user.exams.slice(0,3).map(e => (
          <div key={e.id} style={{ display:'flex', alignItems:'center',
            justifyContent:'space-between', background:`${T.accent}15`,
            borderRadius:'10px', padding:'8px 12px' }}>
            <span style={{ color:T.textPrimary, fontSize:'12px', fontWeight:600 }}>{e.name}</span>
            <span style={{ color:T.accent, fontSize:'12px', fontWeight:700 }}>{e.readiness}%</span>
          </div>
        ))}
      </div>
      <div style={{ color:T.textSecondary, fontSize:'9px',
        textAlign:'center', letterSpacing:'1px', opacity:0.7 }}>
        tryiteducations.net
      </div>
    </div>
  )
}

export default function StudentIDCard({ user }) {
  const { showToast } = useToast()
  const [flipped, setFlipped]         = useState(false)
  const [activeTemplate, setTemplate] = useState(0)
  const T = ID_TEMPLATES[activeTemplate]

  const share = () => {
    if (navigator.share) {
      navigator.share({ title:'My TryIT Student ID', text:`${user.name} · Rank #${user.rank} · ${user.exams[0]?.name} | tryiteducations.net` })
    } else {
      navigator.clipboard?.writeText(`${user.name} · Rank #${user.rank} · ${user.levelEmoji} ${user.levelTitle} | tryiteducations.net`)
      showToast('success','ID card link copied! Share on WhatsApp 🔥')
    }
  }

  return (
    <div>
      {/* 3D Flip Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          width:'100%', maxWidth:'340px', height:'220px',
          margin:'0 auto', cursor:'pointer',
          perspective:'1200px',
        }}
      >
        <div style={{
          width:'100%', height:'100%',
          position:'relative',
          transformStyle:'preserve-3d',
          transition:'transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          {/* Front */}
          <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden' }}>
            <IDCardFace user={user} template={T} isFront />
          </div>
          {/* Back */}
          <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', transform:'rotateY(180deg)' }}>
            <IDCardFace user={user} template={T} isFront={false} />
          </div>
        </div>
      </div>
      <p style={{ textAlign:'center', color:'#94A3B8', fontSize:'12px', marginTop:'8px' }}>
        Tap card to flip
      </p>

      {/* Template selector */}
      <div style={{ display:'flex', gap:'8px', justifyContent:'center', margin:'16px 0 12px', flexWrap:'wrap' }}>
        {ID_TEMPLATES.map((t, i) => (
          <button key={t.id}
            onClick={() => setTemplate(i)}
            style={{
              padding:'6px 14px', borderRadius:'20px',
              border:`2px solid ${i === activeTemplate ? '#D4AF37' : '#E2E8F0'}`,
              background: i === activeTemplate ? '#D4AF37' : '#fff',
              color: i === activeTemplate ? '#1E3A5F' : '#64748B',
              fontFamily:'Poppins,sans-serif', fontWeight:600,
              fontSize:'12px', cursor:'pointer', transition:'all 0.2s',
            }}>
            {t.name}
          </button>
        ))}
      </div>

      {/* Share button */}
      <button onClick={share}
        style={{
          display:'flex', alignItems:'center', justifyContent:'center',
          gap:'8px', width:'100%', maxWidth:'340px',
          margin:'0 auto', padding:'12px',
          background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
          border:'none', borderRadius:'14px',
          fontFamily:'Poppins,sans-serif', fontWeight:700,
          fontSize:'14px', color:'#1E3A5F', cursor:'pointer',
        }}>
        📤 Share My ID Card
      </button>
    </div>
  )
}
```

// TARGET_FILE: src/pages/guru/GuruHub.jsx
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { GURU_DOUBTS } from '../../data/mockSeeds'

const REACTION_META = { fire:'🔥', bulb:'💡', heart:'❤️', star:'⭐' }
const EXAM_FILTERS = ['All','SSC CGL','UPSC CSE','NEET UG','IBPS PO','JEE Main','GATE CS','NDA']

export default function GuruHub() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab]             = useState('browse')
  const [examFilter, setExamFilter] = useState('All')
  const [reactions, setReactions]  = useState({})
  const [expandedId, setExpanded]  = useState(null)

  const filtered = examFilter === 'All'
    ? GURU_DOUBTS
    : GURU_DOUBTS.filter(d => d.examTag === examFilter)

  const handleReact = (targetId, type) => {
    setReactions(prev => ({
      ...prev,
      [`${targetId}_${type}`]: !prev[`${targetId}_${type}`],
    }))
    showToast('success', `${REACTION_META[type]} Reaction added!`)
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F] font-poppins">🎓 Guru Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Ask doubts · Get answers · Earn coins</p>
        </div>
        <button onClick={() => navigate('/guru-hub/post-doubt')}
          className="btn-gold px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2">
          + Post Doubt
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[['👥','50,000+','Students Active'],['🎓','847','Verified Mentors'],['⚡','2 hrs','Avg Answer Time']].map(([e,v,l])=>(
          <div key={l} className="clay rounded-2xl p-4 text-center">
            <p className="text-2xl">{e}</p>
            <p className="font-bold text-[#D4AF37] text-xl font-poppins">{v}</p>
            <p className="text-slate-500 text-xs mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {['browse','my-doubts','top-mentors'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-2xl font-semibold text-sm whitespace-nowrap flex-shrink-0 transition-all
              ${tab === t ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
            {t === 'browse' ? '🔍 Browse Doubts' : t === 'my-doubts' ? '📋 My Doubts' : '🌟 Top Mentors'}
          </button>
        ))}
      </div>

      {/* Exam filter chips */}
      {tab === 'browse' && (
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {EXAM_FILTERS.map(f => (
            <button key={f} onClick={() => setExamFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all
                ${examFilter === f ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Doubts feed */}
      {tab === 'browse' && (
        <div className="flex flex-col gap-5">
          {filtered.map(doubt => (
            <div key={doubt.id} className="clay rounded-3xl p-6">
              {/* Doubt header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {doubt.userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 text-sm">{doubt.userName}</span>
                    <span className="text-xs text-slate-400">{doubt.userLevel}</span>
                    <span className="bg-[#1E3A5F] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      {doubt.examTag}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                      {doubt.subject}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">{doubt.timeAgo} · 👁 {doubt.views} views</span>
                </div>
              </div>

              {/* Question */}
              <p className="text-[#1E293B] font-medium leading-relaxed mb-4">{doubt.question}</p>

              {/* Doubt reactions */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {Object.entries(doubt.reactions).map(([type, count]) => {
                  const key = `${doubt.id}_${type}`
                  const reacted = reactions[key]
                  return (
                    <button key={type} onClick={() => handleReact(doubt.id, type)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all
                        ${reacted ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#1E3A5F]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {REACTION_META[type]}
                      <span>{count + (reacted ? 1 : 0)}</span>
                    </button>
                  )
                })}
                <span className="text-slate-400 text-sm ml-auto">
                  {doubt.answers.length} answer{doubt.answers.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Answers */}
              <div className="flex flex-col gap-3">
                {(expandedId === doubt.id ? doubt.answers : doubt.answers.slice(0,1)).map(ans => (
                  <div key={ans.id}
                    className={`rounded-2xl p-4 ${ans.isBest ? 'bg-green-50 border-2 border-green-400' : 'bg-slate-50 border border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {ans.mentorInitials}
                      </div>
                      <span className="font-semibold text-sm text-slate-800">{ans.mentorName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                        ${ans.isBest ? 'bg-green-500 text-white' : 'bg-[#D4AF37]/20 text-[#1E3A5F]'}`}>
                        {ans.isBest ? '✅ Best Answer' : `${ans.mentorBadgeEmoji} ${ans.mentorBadge}`}
                      </span>
                      <span className="text-xs text-amber-500 font-semibold ml-auto">⭐ {ans.rating}</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{ans.text}</p>
                    {/* Answer reactions */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {Object.entries(ans.reactions).map(([type, count]) => {
                        const key = `${ans.id}_${type}`
                        const reacted = reactions[key]
                        return (
                          <button key={type} onClick={() => handleReact(ans.id, type)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all
                              ${reacted ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#1E3A5F]' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#D4AF37]'}`}>
                            {REACTION_META[type]} {count + (reacted ? 1 : 0)}
                          </button>
                        )
                      })}
                      <span className="text-slate-400 text-xs ml-auto self-center">{ans.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>

              {doubt.answers.length > 1 && (
                <button onClick={() => setExpanded(expandedId === doubt.id ? null : doubt.id)}
                  className="text-[#D4AF37] text-sm font-semibold hover:underline mt-3 block">
                  {expandedId === doubt.id ? '▲ Show less' : `▼ See all ${doubt.answers.length} answers`}
                </button>
              )}

              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                <button onClick={() => navigate(`/guru-hub/${doubt.id}`)}
                  className="btn-gold px-4 py-2 rounded-xl font-bold text-sm">
                  Answer as Mentor
                </button>
                <button onClick={() => showToast('info','Doubt bookmarked!')}
                  className="border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-semibold text-sm hover:border-[#D4AF37] transition-colors">
                  🔖 Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Doubts tab */}
      {tab === 'my-doubts' && (
        <div className="clay rounded-3xl p-8 text-center">
          <p className="text-5xl mb-4">🤔</p>
          <p className="font-bold text-[#1E3A5F] text-xl">No doubts posted yet</p>
          <p className="text-slate-500 text-sm mt-2 mb-6">Post your first doubt and get answers in 2 hours</p>
          <button onClick={() => navigate('/guru-hub/post-doubt')}
            className="btn-gold px-8 py-3 rounded-2xl font-bold">
            Post a Doubt →
          </button>
        </div>
      )}

      {/* Top Mentors tab */}
      {tab === 'top-mentors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { initials:'VN', name:'Vikram Nair', badge:'Thalavan', badgeEmoji:'👑', answers:234, rating:4.9, exams:'SSC · IBPS · RRB' },
            { initials:'AI', name:'Ananya IAS',  badge:'Baahuveer', badgeEmoji:'🦁', answers:189, rating:5.0, exams:'UPSC · State PSC' },
            { initials:'DK', name:'Dr. Kavitha', badge:'The Fighter',badgeEmoji:'⚔️',answers:156, rating:4.8, exams:'NEET · AIIMS' },
            { initials:'PS', name:'Prof. Srinivas',badge:'The Gold King',badgeEmoji:'🥇',answers:203,rating:5.0, exams:'JEE · GATE · BITS' },
          ].map(m => (
            <div key={m.name} className="clay rounded-2xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-bold text-lg flex items-center justify-center flex-shrink-0">
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1E3A5F]">{m.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.exams}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="glass-gold text-[#1E3A5F] text-xs px-2 py-0.5 rounded-full font-bold">
                    {m.badgeEmoji} {m.badge}
                  </span>
                  <span className="text-xs text-slate-500">{m.answers} answers</span>
                  <span className="text-xs text-amber-500 font-bold">⭐ {m.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
```
// TARGET_FILE: src/pages/Landing.jsx
```jsx
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import { PLATFORM_FEATURES, LANGUAGES_DATA, TESTIMONIALS, LEADERBOARD_DATA } from '../data/mockSeeds'

// ── Navbar ───────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:50, height:68,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 32px',
      background: scrolled ? 'rgba(30,58,95,0.97)' : 'rgba(30,58,95,0.85)',
      backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(212,175,55,0.2)',
      transition:'background 0.3s',
    }}>
      <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:24 }}>
        <span style={{ color:'#fff' }}>TRY</span>
        <span style={{ color:'#D4AF37' }}>IT</span>
        <span style={{ color:'rgba(255,255,255,0.5)', fontSize:10, fontWeight:600,
          letterSpacing:'3px', display:'block', marginTop:-6 }}>EDUCATIONS</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8,
          background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.3)',
          borderRadius:20, padding:'6px 14px' }}>
          <span style={{ width:8, height:8, borderRadius:'50%',
            background:'#22C55E', display:'inline-block',
            animation:'pulseDot 1.5s ease-in-out infinite' }} />
          <span style={{ color:'rgba(255,255,255,0.8)', fontSize:12, fontFamily:'Inter,sans-serif' }}>
            1,247 studying now
          </span>
        </div>
        <button onClick={() => navigate('/login')}
          style={{
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            border:'none', borderRadius:14, padding:'10px 24px',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
            color:'#1E3A5F', cursor:'pointer',
          }}>
          Login →
        </button>
      </div>
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ navigate }) {
  return (
    <section style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      background:'linear-gradient(135deg,#071428 0%,#0F2140 40%,#1E3A5F 100%)',
      padding:'80px 32px', position:'relative', overflow:'hidden',
    }}>
      {/* Animated background circles */}
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%',
        border:'1px solid rgba(212,175,55,0.08)', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:900, height:900, borderRadius:'50%',
        border:'1px solid rgba(212,175,55,0.04)', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%',
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>

        {/* Left */}
        <div>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.3)',
            borderRadius:20, padding:'8px 16px', marginBottom:24,
          }}>
            <span style={{ fontSize:16 }}>🚀</span>
            <span style={{ color:'#D4AF37', fontFamily:'Inter,sans-serif',
              fontSize:13, fontWeight:600 }}>
              India's First Platform for EVERY Indian Exam
            </span>
          </div>

          {['One App.', 'Every Exam.', 'Zero Barriers.'].map((line, i) => (
            <div key={line} style={{
              fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(40px,5vw,68px)', lineHeight:1.05,
              color: i === 1 ? '#D4AF37' : '#FFFFFF',
              animation:`wordReveal 0.6s ease ${i * 0.15}s both`,
            }}>{line}</div>
          ))}

          <p style={{ color:'#D4AF37', fontStyle:'italic',
            fontFamily:'Inter,sans-serif', fontSize:18,
            margin:'16px 0 8px' }}>
            Your Exam. Your Rank. Your Success.
          </p>
          <p style={{ color:'rgba(255,255,255,0.65)', fontFamily:'Inter,sans-serif',
            fontSize:15, lineHeight:1.7, maxWidth:500, marginBottom:32 }}>
            9,852 verified exam pathways — Class 6 to PhD, age 12 to 60+.
            Study in 40+ Indian languages. Real All-India rankings after every test.
          </p>

          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:28 }}>
            <button onClick={() => navigate('/login')} style={{
              background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
              border:'none', borderRadius:16, padding:'16px 36px',
              fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18,
              color:'#1E3A5F', cursor:'pointer',
            }}>
              Start Free →
            </button>
            <button onClick={() => navigate('/career-compass')} style={{
              background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
              border:'1px solid rgba(212,175,55,0.4)', borderRadius:16, padding:'16px 28px',
              fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16,
              color:'#fff', cursor:'pointer',
            }}>
              🧭 Find My Exam
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['🔒 Secure','💳 No Credit Card','🌐 40+ Languages','🏆 Real Rankings','🆓 Free to Start'].map(t => (
              <span key={t} style={{
                background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
                borderRadius:20, padding:'5px 12px', color:'rgba(255,255,255,0.6)',
                fontSize:11, fontFamily:'Inter,sans-serif',
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right — floating cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Rank card */}
          <div style={{
            background:'rgba(15,33,64,0.9)', border:'1px solid rgba(212,175,55,0.3)',
            borderRadius:20, padding:20, backdropFilter:'blur(20px)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ width:48, height:48, borderRadius:'50%',
                background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#1E3A5F' }}>
                AK
              </div>
              <div>
                <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700 }}>Arjun K. · Tamil Nadu</p>
                <p style={{ color:'#D4AF37', fontSize:12 }}>⛏️ The Gold Miner · SSC CGL</p>
              </div>
            </div>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, fontFamily:'Inter,sans-serif', marginBottom:12 }}>
              "Moved from #8,432 → #1,243 in 30 days! 🔥"
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ flex:1, height:6, borderRadius:3, background:'rgba(255,255,255,0.1)' }}>
                <div style={{ width:'67%', height:6, borderRadius:3, background:'#D4AF37' }} />
              </div>
              <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700 }}>67% Ready</span>
            </div>
          </div>

          {/* Level badge card */}
          <div style={{
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            borderRadius:20, padding:20, display:'flex', alignItems:'center', gap:16,
          }}>
            <span style={{ fontSize:40 }}>🦁</span>
            <div>
              <p style={{ color:'#1E3A5F', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18 }}>
                Baahuveer
              </p>
              <p style={{ color:'rgba(30,58,95,0.7)', fontSize:12 }}>Level 6 — The Warrior King</p>
              <p style={{ color:'rgba(30,58,95,0.8)', fontSize:12, marginTop:4 }}>
                Indian cinema meets exam prep 🎬
              </p>
            </div>
          </div>

          {/* Stats mini */}
          <div style={{
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:20, padding:16, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8,
          }}>
            {[['9,852','Exams'],['40+','Languages'],['#1,243','Your Rank']].map(([v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <p style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18 }}>{v}</p>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:10 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Stats Strip ───────────────────────────────────────────────
function StatsStrip() {
  const [counts, setCounts] = useState([0, 0, 0])
  const ref = useRef(null)
  const TARGETS = [9852, 40, 50000]
  const LABELS  = ['Verified Exams Ready','Indian Languages','Students & Growing']
  const EXTRAS  = ['','+ ','']
  const SUFFIXES = ['','+',' already']

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      TARGETS.forEach((target, i) => {
        const dur = 1800, start = performance.now()
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setCounts(prev => { const n=[...prev]; n[i]=Math.floor(eased*target); return n })
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const EXTRA_STATS = [
    { display:'All Ages',   label:'5 to 65 Years' },
    { display:'All Stages', label:'Class 6 to PhD' },
    { display:'Real',       label:'Rankings + Results' },
  ]

  return (
    <section ref={ref} style={{
      background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
      padding:'40px 20px',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto',
        display:'flex', flexWrap:'wrap', justifyContent:'center',
        borderLeft:'1px solid rgba(255,255,255,0.08)' }}>
        {TARGETS.map((_, i) => (
          <div key={i} style={{
            flex:'1 1 140px', textAlign:'center', padding:'20px 24px',
            borderRight:'1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(28px,4vw,44px)', color:'#D4AF37', lineHeight:1 }}>
              {/* explicit ternary — never && — prevents "0" rendering */}
              {counts[i] > 0 ? `${EXTRAS[i]}${counts[i].toLocaleString()}${SUFFIXES[i]}` : '—'}
            </div>
            <div style={{ color:'rgba(255,255,255,0.65)', fontSize:13,
              fontFamily:'Inter,sans-serif', marginTop:6 }}>
              {LABELS[i]}
            </div>
          </div>
        ))}
        {EXTRA_STATS.map(s => (
          <div key={s.label} style={{
            flex:'1 1 140px', textAlign:'center', padding:'20px 24px',
            borderRight:'1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(28px,4vw,44px)', color:'#D4AF37', lineHeight:1 }}>
              {s.display}
            </div>
            <div style={{ color:'rgba(255,255,255,0.65)', fontSize:13,
              fontFamily:'Inter,sans-serif', marginTop:6 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Features Grid ─────────────────────────────────────────────
function FeaturesSection({ navigate }) {
  return (
    <section style={{ background:'#F8FAFC', padding:'80px 32px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(28px,4vw,42px)', color:'#1E3A5F', marginBottom:12 }}>
            Everything You Need to Crack Your Exam
          </h2>
          <p style={{ color:'#64748B', fontFamily:'Inter,sans-serif', fontSize:16 }}>
            12 powerful features. One platform. Built for every Indian student.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {PLATFORM_FEATURES.map(f => (
            <div key={f.id}
              onClick={() => navigate('/login')}
              style={{
                background:'#fff', borderRadius:20, padding:24,
                border:'1.5px solid #E2E8F0', cursor:'pointer',
                transition:'all 0.2s',
                boxShadow:'0 2px 12px rgba(30,58,95,0.06)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='#D4AF37'; e.currentTarget.style.boxShadow='0 8px 30px rgba(212,175,55,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.boxShadow='0 2px 12px rgba(30,58,95,0.06)' }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontSize:36 }}>{f.emoji}</span>
                <span style={{
                  background: f.badge === '🔥 Viral' ? '#FEF3C7' : f.badge === 'Exclusive' ? '#EDE9FE' : '#F0FDF4',
                  color: f.badge === '🔥 Viral' ? '#92400E' : f.badge === 'Exclusive' ? '#7C3AED' : '#065F46',
                  fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, letterSpacing:'0.5px',
                }}>{f.badge}</span>
              </div>
              <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                fontSize:16, color:'#1E3A5F', marginBottom:4 }}>{f.title}</h3>
              <p style={{ color:'#D4AF37', fontSize:12, fontWeight:600, marginBottom:8 }}>{f.subtitle}</p>
              <p style={{ color:'#64748B', fontSize:13, lineHeight:1.6, marginBottom:12 }}>{f.desc}</p>
              <p style={{ color:'#94A3B8', fontSize:11, fontFamily:'Inter,sans-serif' }}>📊 {f.stats}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Cinematic Badges Section ──────────────────────────────────
function CinematicBadges() {
  const LEVELS = [
    { level:1,  title:'The Fierce One',  emoji:'🔥', xp:'0–500',    color:'#EF4444' },
    { level:2,  title:'The Fighter',     emoji:'⚔️', xp:'500–1.5K', color:'#F97316' },
    { level:3,  title:'The Riser',       emoji:'📈', xp:'1.5K–3K',  color:'#EAB308' },
    { level:4,  title:'The Gold Miner',  emoji:'⛏️', xp:'3K–6K',    color:'#D4AF37' },
    { level:5,  title:'The Grinder',     emoji:'💪', xp:'6K–10K',   color:'#22C55E' },
    { level:6,  title:'Baahuveer',       emoji:'🦁', xp:'10K–16K',  color:'#D4AF37', cinema:'Baahubali' },
    { level:7,  title:'Thalavan',        emoji:'👑', xp:'16K–24K',  color:'#8B5CF6', cinema:'The Boss' },
    { level:8,  title:'The Unstoppable', emoji:'⚡', xp:'24K–35K',  color:'#06B6D4' },
    { level:9,  title:'The Legend',      emoji:'🌟', xp:'35K–50K',  color:'#D4AF37' },
    { level:10, title:'The Absolute',    emoji:'🏆', xp:'50K+',     color:'#D4AF37' },
  ]

  return (
    <section style={{ background:'linear-gradient(180deg,#0F2140,#071428)', padding:'80px 32px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(26px,4vw,40px)', color:'#fff', marginBottom:8 }}>
            🎬 Cinematic Level System
          </h2>
          <p style={{ color:'rgba(255,255,255,0.6)', fontFamily:'Inter,sans-serif' }}>
            Your study journey told like an epic film. Every rank has a legendary title.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:12 }}>
          {LEVELS.map(l => (
            <div key={l.level} style={{
              background:'rgba(255,255,255,0.04)', border:`1px solid ${l.color}33`,
              borderRadius:16, padding:'16px 14px', textAlign:'center',
              transition:'all 0.2s',
            }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{l.emoji}</div>
              <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                fontSize:14, color:'#fff', marginBottom:4 }}>{l.title}</div>
              {l.cinema && (
                <div style={{ fontSize:10, color:l.color, marginBottom:4,
                  fontStyle:'italic' }}>🎬 {l.cinema}</div>
              )}
              <div style={{ background:`${l.color}22`, color:l.color,
                borderRadius:20, padding:'3px 10px', fontSize:10, fontWeight:700,
                display:'inline-block' }}>
                Lv {l.level} · {l.xp} XP
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.4)',
          fontFamily:'Inter,sans-serif', fontSize:12, marginTop:24 }}>
          Baahuveer (Lv 6) and Thalavan (Lv 7) are inspired by Indian cinema legends 🎬
        </p>
      </div>
    </section>
  )
}

// ── Testimonials Marquee ──────────────────────────────────────
function TestimonialsMarquee() {
  return (
    <section style={{ background:'#F8FAFC', padding:'60px 0', overflow:'hidden' }}>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:'clamp(24px,3vw,36px)', color:'#1E3A5F' }}>
          Real Students. Real Results.
        </h2>
      </div>
      <div style={{ display:'flex', animation:'scrollTicker 30s linear infinite',
        width:'max-content', gap:16 }}>
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <div key={i} style={{
            minWidth:280, background:'#fff',
            border:'1.5px solid #E2E8F0', borderRadius:20, padding:20,
            flexShrink:0,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{
                width:40, height:40, borderRadius:'50%',
                background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#D4AF37', fontFamily:'Poppins,sans-serif',
                fontWeight:800, fontSize:13,
              }}>{t.name.split(' ').map(n=>n[0]).join('')}</div>
              <div>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  fontSize:13, color:'#1E3A5F' }}>{t.name}</p>
                <p style={{ fontSize:11, color:'#64748B' }}>{t.state} · {t.exam}</p>
              </div>
              <div style={{ marginLeft:'auto' }}>
                <span style={{ background:'#FEF3C7', color:'#92400E',
                  fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20 }}>
                  {t.level} {t.emoji}
                </span>
              </div>
            </div>
            <p style={{ color:'#475569', fontSize:13, fontFamily:'Inter,sans-serif',
              lineHeight:1.6 }}>{t.text}</p>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <span style={{ background:'#EDE9FE', color:'#7C3AED',
                fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>
                Rank {t.rank}
              </span>
              <span style={{ background:'#DCFCE7', color:'#15803D',
                fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>
                {t.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Languages Section ─────────────────────────────────────────
function LanguagesSection() {
  return (
    <section style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', padding:'72px 32px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:'clamp(24px,4vw,38px)', color:'#fff', marginBottom:8 }}>
          🌐 Study in Your Mother Tongue
        </h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontFamily:'Inter,sans-serif',
          marginBottom:40 }}>
          40+ Indian languages · New languages added weekly
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
          {LANGUAGES_DATA.map(l => (
            <div key={l.code} style={{
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:16, padding:'10px 16px',
              display:'flex', alignItems:'center', gap:8,
            }}>
              <span style={{ fontSize:18 }}>{l.flag}</span>
              <div style={{ textAlign:'left' }}>
                <div style={{ color:'#fff', fontSize:12, fontWeight:600 }}>{l.name}</div>
                <div style={{ color:'#D4AF37', fontSize:14, fontFamily:'serif' }}>{l.native}</div>
              </div>
            </div>
          ))}
          <div style={{
            background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.3)',
            borderRadius:16, padding:'10px 20px',
            display:'flex', alignItems:'center', gap:8,
          }}>
            <span style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif',
              fontWeight:700, fontSize:14 }}>+24 more →</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Leaderboard Preview ───────────────────────────────────────
function LeaderboardPreview({ navigate }) {
  return (
    <section style={{ background:'#F8FAFC', padding:'72px 32px' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:'clamp(24px,4vw,38px)', color:'#1E3A5F', marginBottom:8 }}>
            🏆 Real All-India Rankings
          </h2>
          <p style={{ color:'#64748B' }}>After every test. Live. Transparent. Yours.</p>
        </div>
        <div style={{ background:'#fff', borderRadius:24,
          border:'1.5px solid #E2E8F0', overflow:'hidden',
          boxShadow:'0 8px 30px rgba(30,58,95,0.08)' }}>
          {/* Header */}
          <div style={{ background:'#1E3A5F', padding:'12px 20px',
            display:'grid', gridTemplateColumns:'40px 1fr 100px 80px' }}>
            {['Rank','Student','Exam','Score'].map(h => (
              <span key={h} style={{ color:'#D4AF37', fontSize:11,
                fontWeight:700, letterSpacing:'1px' }}>{h}</span>
            ))}
          </div>
          {LEADERBOARD_DATA.map((row, i) => (
            <div key={i} style={{
              padding:'14px 20px', borderBottom:'1px solid #F1F5F9',
              display:'grid', gridTemplateColumns:'40px 1fr 100px 80px',
              alignItems:'center',
              background: row.isMe ? 'rgba(212,175,55,0.08)' : '#fff',
              borderLeft: row.isMe ? '4px solid #D4AF37' : 'none',
            }}>
              <span style={{
                fontFamily:'Poppins,sans-serif', fontWeight:700,
                color: i === 0 ? '#D4AF37' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : '#64748B',
                fontSize: i < 3 ? 18 : 14,
              }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${row.rank.toLocaleString()}`}
              </span>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600,
                    color:'#1E293B', fontSize:13 }}>{row.name}</span>
                  {row.isMe && <span style={{ background:'#D4AF37', color:'#1E3A5F',
                    fontSize:9, fontWeight:700, padding:'2px 8px',
                    borderRadius:20 }}>← YOU</span>}
                </div>
                <span style={{ color:'#94A3B8', fontSize:11 }}>
                  {row.badgeEmoji} {row.badge} · {row.state}
                </span>
              </div>
              <span style={{ background:'#F1F5F9', color:'#475569',
                fontSize:10, fontWeight:600, padding:'3px 8px',
                borderRadius:20, display:'inline-block' }}>{row.exam}</span>
              <span style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif',
                fontWeight:700, fontSize:14 }}>{row.score}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:24 }}>
          <button onClick={() => navigate('/login')} style={{
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            border:'none', borderRadius:14, padding:'14px 36px',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16,
            color:'#1E3A5F', cursor:'pointer',
          }}>
            See Your Rank →
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  const LINKS = {
    Platform: ['About Us','How It Works','Pricing','Blog','Careers'],
    Students:  ['All Exams','Test Engine','Brain Games','Guru Hub','Leaderboard'],
    Partners:  ['Become a Mentor','Institute Partner','API Access','Affiliate'],
    Legal:     ['Privacy Policy','Terms of Service','Community Standards','Refund Policy'],
  }
  return (
    <footer style={{ background:'#0F2140', paddingTop:64, paddingBottom:24 }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:32, marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, marginBottom:8 }}>
              <span style={{ color:'#fff' }}>TRY</span><span style={{ color:'#D4AF37' }}>IT</span>
            </div>
            <p style={{ color:'#D4AF37', fontStyle:'italic', fontSize:13, marginBottom:12 }}>
              Your Exam. Your Rank. Your Success.
            </p>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12, lineHeight:1.6 }}>
              India's most complete exam prep platform.
            </p>
          </div>
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif',
                fontWeight:600, fontSize:13, marginBottom:12 }}>{section}</p>
              {links.map(l => (
                <a key={l} href="#" style={{ display:'block', color:'rgba(255,255,255,0.45)',
                  fontSize:12, marginBottom:8, textDecoration:'none',
                  fontFamily:'Inter,sans-serif', transition:'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color='#D4AF37'}
                  onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.45)'}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)', marginBottom:20 }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Inter,sans-serif' }}>
            © 2026 TryIT Educations Pvt Ltd. All rights reserved.
          </p>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Inter,sans-serif', fontStyle:'italic' }}>
            "Real platform. Real questions. Real ranks."
          </p>
        </div>
      </div>
    </footer>
  )
}

// ── MAIN LANDING PAGE ─────────────────────────────────────────
export default function Landing() {
  useReveal()
  const navigate = useNavigate()
  const [scrollPct, setScrollPct] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setScrollPct(pct)
      setShowTop(el.scrollTop > 500)
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      {/* Scroll progress */}
      <div style={{
        position:'fixed', top:0, left:0, height:3, zIndex:9999,
        width:`${scrollPct}%`,
        background:'linear-gradient(90deg,#D4AF37,#E8C84A,#D4AF37)',
        transition:'width 0.1s linear', pointerEvents:'none',
      }} />

      <Navbar />
      <Hero navigate={navigate} />
      <StatsStrip />
      <FeaturesSection navigate={navigate} />
      <CinematicBadges />
      <TestimonialsMarquee />
      <LanguagesSection />
      <LeaderboardPreview navigate={navigate} />

      {/* Final CTA */}
      <section style={{
        background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
        padding:'80px 32px', textAlign:'center',
      }}>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:'clamp(28px,4vw,48px)', color:'#fff', marginBottom:16 }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:16, marginBottom:32 }}>
          9,852 exams. 40+ languages. Real rankings. Start free today.
        </p>
        <button onClick={() => navigate('/login')} style={{
          background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
          border:'none', borderRadius:18, padding:'20px 56px',
          fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:20,
          color:'#1E3A5F', cursor:'pointer',
        }}>
          Start Free Now →
        </button>
      </section>

      <Footer />

      {showTop && (
        <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          style={{
            position:'fixed', bottom:80, right:20,
            width:48, height:48, borderRadius:'50%',
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            border:'none', cursor:'pointer', fontSize:20,
            boxShadow:'0 4px 20px rgba(212,175,55,0.5)',
            zIndex:30, display:'flex', alignItems:'center', justifyContent:'center',
          }}>↑</button>
      )}
    </div>
  )
}
```
// TARGET_FILE: src/pages/Profile.jsx
```jsx
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
  const levelInfo = getLevelInfo(user.xp)

  return (
    <AppLayout>
      {/* Hero */}
      <div className="clay-dark rounded-3xl p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-extrabold text-3xl flex items-center justify-center ring-4 ring-white/20">
              {user.initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-lg">
              {user.levelEmoji}
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white font-poppins">{user.name}</h1>
            <p className="text-[#D4AF37] font-semibold mt-1">{user.levelEmoji} Level {user.level} — {user.levelTitle}</p>
            <p className="text-white/60 text-sm mt-1">📍 {user.city}, {user.state}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {user.isPro && <span className="clay-gold text-[#1E3A5F] text-xs font-bold px-3 py-1 rounded-full">⚡ PRO MEMBER</span>}
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">Joined {user.joinDate}</span>
              <span className="bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full font-mono">{user.userId}</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Level {user.level} — {user.levelTitle}</span>
            <span className="text-[#D4AF37] font-bold">{user.xp.toLocaleString()} / {user.xpToNext.toLocaleString()} XP</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div className="bg-[#D4AF37] h-3 rounded-full transition-all duration-1000"
              style={{ width:`${(user.xp / user.xpToNext) * 100}%` }} />
          </div>
          <p className="text-white/40 text-xs mt-1">
            {(user.xpToNext - user.xp).toLocaleString()} XP to {LEVELS[user.level]?.title || 'Max Level'}
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon:'🏆', val:`#${user.rank.toLocaleString()}`, label:'All India Rank' },
          { icon:'🔥', val:`${user.streak} days`, label:'Study Streak' },
          { icon:'📝', val:user.testsCompleted, label:'Tests Completed' },
          { icon:'📊', val:`${user.avgScore}%`, label:'Average Score' },
        ].map(s => (
          <div key={s.label} className="clay rounded-2xl p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-[#D4AF37] font-poppins">{s.val}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-2xl font-semibold text-sm whitespace-nowrap flex-shrink-0 transition-all
              ${tab === t ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="clay rounded-2xl p-5">
            <h3 className="font-bold text-[#1E3A5F] mb-3">📊 Subject Performance</h3>
            {user.subjects.map(s => (
              <div key={s.name} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{s.emoji} {s.name}</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-bold ${s.trend==='up'?'text-green-500':'text-red-500'}`}>
                      {s.trend==='up'?'↑':'↓'}
                    </span>
                    <span className="text-sm font-bold text-[#1E3A5F]">{s.accuracy}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${s.accuracy>=80?'bg-green-500':s.accuracy>=70?'bg-[#D4AF37]':'bg-amber-500'}`}
                    style={{ width:`${s.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="clay rounded-2xl p-5">
            <h3 className="font-bold text-[#1E3A5F] mb-3">🎯 Exam Readiness</h3>
            {user.exams.map(e => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-[#1E3A5F]">{e.name}</span>
                  <span className="text-sm font-bold text-[#D4AF37]">{e.readiness}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-1000 ${e.readiness>=70?'bg-green-500':e.readiness>=40?'bg-[#D4AF37]':'bg-amber-500'}`}
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
          <h3 className="font-bold text-[#1E3A5F] text-xl text-center mb-6">🪪 Your Student ID Card</h3>
          <StudentIDCard user={user} />
        </div>
      )}

      {/* Badges */}
      {tab === 'Badges' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#1E3A5F] text-xl">🏅 Your Badges</h3>
            <span className="text-slate-500 text-sm">
              {BADGES.filter(b=>b.earned).length}/{BADGES.length} earned
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {BADGES.map(b => (
              <div key={b.id}
                className={`rounded-2xl p-4 text-center transition-all ${b.earned ? 'clay-gold' : 'clay opacity-60'}`}>
                <div className="text-4xl mb-2">{b.emoji}</div>
                <p className={`font-bold text-sm ${b.earned ? 'text-[#1E3A5F]' : 'text-slate-600'}`}>{b.name}</p>
                <p className={`text-xs mt-1 ${b.earned ? 'text-[#1E3A5F]/70' : 'text-slate-400'}`}>{b.desc}</p>
                {b.earned ? (
                  <p className="text-xs text-green-600 font-semibold mt-2">✅ {b.earnedDate}</p>
                ) : b.progress !== undefined ? (
                  <div className="mt-2">
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="bg-[#D4AF37] h-1.5 rounded-full"
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
            { icon:'📝', val:user.testsCompleted, label:'Tests Taken' },
            { icon:'📊', val:`${user.avgScore}%`, label:'Average Score' },
            { icon:'🏆', val:`#${user.rank.toLocaleString()}`, label:'All India Rank' },
            { icon:'🔥', val:`${user.streak} days`, label:'Study Streak' },
            { icon:'🪙', val:user.coins.toLocaleString(), label:'Total Coins' },
            { icon:'🎓', val:user.guruPoints, label:'Guru Points' },
            { icon:'⏱️', val:user.studyHours, label:'Study Time' },
            { icon:'⭐', val:user.xp.toLocaleString(), label:'XP Earned' },
            { icon:'💎', val:`Level ${user.level}`, label:'Current Level' },
          ].map(s => (
            <div key={s.label} className="clay rounded-2xl p-4 text-center">
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="text-2xl font-bold text-[#D4AF37] font-poppins">{s.val}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
```

// TARGET_FILE: src/pages/Notifications.jsx
```jsx
import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { useToast } from '../context/ToastContext'

const NOTIFS = [
  { id:1, type:'badge',    icon:'🦁', title:'Badge Unlocked: Baahuveer!',         body:'You reached Level 6. The warrior king awakens.', time:'2 min ago',  read:false },
  { id:2, type:'rank',     icon:'📈', title:'Rank improved! #1,243 → #1,101',      body:'Your SSC CGL mock test boosted your rank by 142 positions.', time:'1 hr ago',   read:false },
  { id:3, type:'doubt',    icon:'🎓', title:'Your doubt was answered!',            body:'Vikram Nair replied: "In mixture problems, always keep one component constant..."', time:'3 hrs ago',  read:false },
  { id:4, type:'alert',    icon:'⏰', title:'SSC CGL Application closes in 7 days',body:'Last date to apply: March 20, 2026. Official site linked.', time:'5 hrs ago',  read:true  },
  { id:5, type:'hall',     icon:'⚔️', title:'IIT Chasers is WINNING the battle!',  body:'342 vs 298 against Physics Gang. Answer more questions to seal the win!', time:'6 hrs ago',  read:true  },
  { id:6, type:'coins',    icon:'🪙', title:'+50 coins: Daily Quiz Bonus',          body:'You scored 4/5 in today\'s Current Affairs quiz. Coins added!', time:'Yesterday', read:true  },
  { id:7, type:'streak',   icon:'🔥', title:'12-Day Streak! Don\'t break it.',      body:'Study at least 1 topic today to keep your streak alive.', time:'Yesterday', read:true  },
  { id:8, type:'exam',     icon:'📡', title:'UPSC Prelims 2026 Notification Out',  body:'Notification released. Applications open Feb 15 – Mar 15. Check now.', time:'2 days ago',read:true  },
]

const TYPE_COLOR = { badge:'bg-[#D4AF37]', rank:'bg-green-500', doubt:'bg-blue-500',
  alert:'bg-red-500', hall:'bg-purple-500', coins:'bg-amber-500',
  streak:'bg-orange-500', exam:'bg-[#1E3A5F]' }

const FILTERS = ['All','Unread','Badges','Rank','Doubts','Alerts','Hall']

export default function Notifications() {
  const { showToast } = useToast()
  const [notifs, setNotifs] = useState(NOTIFS)
  const [filter, setFilter] = useState('All')

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read:true })))
    showToast('success','All notifications marked as read')
  }

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true
    if (filter === 'Unread') return !n.read
    return n.type === filter.toLowerCase()
  })

  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F] font-poppins">🔔 Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-slate-500 text-sm mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-[#D4AF37] text-sm font-semibold hover:underline">
              Mark all read
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all
                ${filter===f ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(n => (
            <div key={n.id}
              onClick={() => setNotifs(prev => prev.map(x => x.id===n.id ? {...x,read:true} : x))}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                ${n.read ? 'bg-white border-slate-100' : 'bg-white border-[#D4AF37]/30 shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-full ${TYPE_COLOR[n.type] || 'bg-slate-400'} flex items-center justify-center text-lg flex-shrink-0 mt-0.5`}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${n.read ? 'text-slate-700' : 'text-[#1E3A5F]'}`}>
                  {n.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="clay rounded-3xl p-12 text-center">
              <p className="text-5xl mb-3">🔕</p>
              <p className="font-bold text-[#1E3A5F]">No notifications here</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
```
