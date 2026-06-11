/**
 * Game Engine — Subject-oriented question system
 * Level 1: Generic (anyone can play — onboarding)
 * Level 2+: Questions matched to student's target exam
 * Makes students razor-sharp for their specific exam
 */

// ── Generic L1 questions (Math Blitz, Word Rush, GK Burst) ────────
const GENERIC_POOL = {
  math: [
    { q:'15 + 28 = ?',             ans:43,  op:'+', a:43,  b:43  },
    { q:'7 × 8 = ?',               ans:56,  op:'×', a:56,  b:56  },
    { q:'144 ÷ 12 = ?',            ans:12,  op:'÷', a:12,  b:12  },
    { q:'23% of 200 = ?',          ans:46,  op:'%', a:46,  b:46  },
    { q:'Square root of 169 = ?',  ans:13,  op:'√', a:13,  b:13  },
    { q:'5² + 4² = ?',             ans:41,  op:'^', a:41,  b:41  },
    { q:'If 3x = 45, x = ?',       ans:15,  op:'=', a:15,  b:15  },
    { q:'LCM of 4 and 6 = ?',      ans:12,  op:'L', a:12,  b:12  },
  ],
  word: [
    { q:'Correct spelling?',  options:['Accomodate','Accommodate','Acommodate','Accommadate'], ans:1 },
    { q:'Antonym of HUGE?',   options:['Tiny','Large','Vast','Giant'],   ans:0 },
    { q:'Synonym of BRAVE?',  options:['Cowardly','Valiant','Timid','Weak'], ans:1 },
    { q:'Plural of CHILD?',   options:['Childs','Childes','Children','Childrens'], ans:2 },
  ],
  gk: [
    { q:'Capital of India?',                ans:'New Delhi',    options:['Mumbai','New Delhi','Kolkata','Chennai'] },
    { q:'Who wrote the Indian Constitution?',ans:'B.R. Ambedkar',options:['Nehru','Gandhi','Ambedkar','Patel'] },
    { q:'Largest planet in solar system?',  ans:'Jupiter',      options:['Saturn','Jupiter','Mars','Neptune'] },
  ],
}

// ── Exam-specific question pools (razor-sharp practice) ──────────
const EXAM_POOLS = {
  'SSC CGL': {
    math: [
      { q:'A shopkeeper marks goods 30% above cost. He allows 10% discount. Profit%?', ans:17, hint:'MP=1.3CP, SP=0.9×1.3CP=1.17CP' },
      { q:'Train 200m long at 54 km/h. Time to cross a pole?', ans:13.33, hint:'Time = 200÷(54×5/18) = 200÷15 ≈ 13.33s' },
      { q:'Find the odd one: 2,5,10,17,26,37,50,?', ans:65, hint:'Diff: 3,5,7,9,11,13,15 → next diff=15 → 50+15=65' },
    ],
    reasoning: [
      { q:'ACEG : BDFH :: PRTV : ?', ans:'QSUW', type:'analogy' },
      { q:'Find the missing: 1,1,2,3,5,8,?,21', ans:13, hint:'Fibonacci: each = sum of previous two' },
    ],
    english: [
      { q:'She insisted __ going alone.', ans:'on', options:['on','in','at','for'], type:'preposition' },
      { q:'Idiom: "Spill the beans" means?', ans:'Reveal a secret', options:['Cook food','Reveal a secret','Make mess','Be lazy'] },
    ],
  },
  'UPSC CSE': {
    gk: [
      { q:'Which Schedule of Constitution deals with anti-defection?', ans:'Tenth', options:['Eighth','Ninth','Tenth','Eleventh'] },
      { q:'Article 370 related to which state?', ans:'J&K', options:['Kashmir','J&K','Sikkim','Arunachal'] },
    ],
    polity: [
      { q:'Directive Principles are in which Part of Constitution?', ans:'Part IV', options:['Part III','Part IV','Part V','Part VI'] },
      { q:'Who appoints the CAG of India?', ans:'President', options:['PM','President','Parliament','SC'] },
    ],
  },
  'IBPS PO': {
    quant: [
      { q:'Simple Interest on ₹5000 at 8% for 2.5 years?', ans:1000, hint:'SI = PRT/100 = 5000×8×2.5/100 = 1000' },
      { q:'Pipes A and B can fill tank in 12 and 15 hrs. Together?', ans:'6⅔ hrs', hint:'1/12+1/15 = 9/60 = 3/20 → 20/3 hrs' },
    ],
    banking: [
      { q:'Full form of NEFT?', ans:'National Electronic Funds Transfer', options:['National Electronic Funds Transfer','Net Electronic Fund Transaction','National Easy Fund Transfer','None'] },
      { q:'RBI was nationalised in?', ans:1949, options:[1935,1949,1955,1969] },
    ],
  },
  'NEET UG': {
    biology: [
      { q:'Which is the powerhouse of cell?', ans:'Mitochondria', options:['Nucleus','Mitochondria','Ribosome','Lysosome'] },
      { q:'DNA replication is?', ans:'Semi-conservative', options:['Conservative','Semi-conservative','Dispersive','Random'] },
    ],
    chemistry: [
      { q:'pH of pure water at 25°C?', ans:7, options:[6,7,8,14] },
    ],
  },
  'JEE Main': {
    physics: [
      { q:'SI unit of electric charge?', ans:'Coulomb', options:['Ampere','Volt','Coulomb','Ohm'] },
      { q:'Force = mass × ?', ans:'acceleration', options:['velocity','acceleration','momentum','displacement'] },
    ],
    math: [
      { q:'∫sin(x)dx = ?', ans:'-cos(x)+C', options:['cos(x)+C','-cos(x)+C','sin(x)+C','-sin(x)+C'] },
    ],
  },
}

// Fallback for exams without specific pool
const DEFAULT_POOL = EXAM_POOLS['SSC CGL']

/**
 * Get questions for a game session
 * @param {string} gameType - math|word|gk|subject
 * @param {number} level - player level (1=generic, 2+=exam-specific)
 * @param {string} targetExam - student's target exam
 * @param {string} subject - specific subject (optional)
 */
export function getGameQuestions({ gameType='math', level=1, targetExam='SSC CGL', subject=null, count=10 }) {
  // Level 1: always generic (good for new users/onboarding)
  if (level <= 1) {
    return generateGenericQuestions(gameType, count)
  }

  // Level 2+: exam-specific questions for razor-sharp practice
  const examPool = EXAM_POOLS[targetExam] || DEFAULT_POOL
  const subjectKey = subject || detectSubjectFromGame(gameType, targetExam)
  const pool = examPool[subjectKey] || examPool[Object.keys(examPool)[0]] || []

  if (pool.length >= count) {
    return shuffleArray([...pool]).slice(0, count).map(formatQuestion)
  }

  // Mix exam-specific + generic if pool is small
  const examQs    = shuffleArray([...pool]).map(formatQuestion)
  const genericQs = generateGenericQuestions(gameType, count - examQs.length)
  return [...examQs, ...genericQs].slice(0, count)
}

function detectSubjectFromGame(gameType, exam) {
  const map = {
    'math':    { 'SSC CGL':'math', 'UPSC CSE':'math', 'IBPS PO':'quant', 'JEE Main':'math', default:'math' },
    'word':    { 'SSC CGL':'english', default:'english' },
    'gk':      { 'UPSC CSE':'polity', 'IBPS PO':'banking', default:'gk' },
    'subject': { 'NEET UG':'biology', 'JEE Main':'physics', default:'gk' },
  }
  return map[gameType]?.[exam] || map[gameType]?.default || 'math'
}

function generateGenericQuestions(type, count) {
  const pool = GENERIC_POOL[type] || GENERIC_POOL.math
  return shuffleArray([...pool]).slice(0, Math.min(count, pool.length)).map(formatQuestion)
}

function formatQuestion(q) {
  // Generate wrong options if not provided
  if (q.options) return { ...q, formatted: true }
  const ans = typeof q.ans === 'number' ? q.ans : parseInt(q.ans)
  const wrongs = [ans+1, ans-1, ans+Math.ceil(ans*0.1), ans*2].filter(x=>x!==ans&&x>0&&Number.isFinite(x))
  const options = shuffleArray([ans, ...wrongs.slice(0,3)])
  return { ...q, options, formatted: true }
}

function shuffleArray(arr) {
  for (let i=arr.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]]
  }
  return arr
}

/**
 * Calculate XP earned from game
 * Higher level = more XP possible
 */
export function calcGameXP({ score, level, isPerfect }) {
  const base  = level * 10
  const bonus = isPerfect ? base * 2 : 0
  return base + Math.round(score * 0.2) + bonus
}

/**
 * Game difficulty curve based on level
 */
export function getGameConfig(level) {
  return {
    timePerQuestion: Math.max(5, 15 - level),         // seconds
    totalQuestions:  Math.min(20, 8 + level * 2),      // more questions at higher levels
    streakMultiplier: 1 + (level * 0.1),               // more streak bonus
    label: level <= 1 ? 'Beginner' : level <= 3 ? 'Intermediate' : level <= 6 ? 'Advanced' : level <= 9 ? 'Expert' : 'Master',
    hint: level <= 1 ? 'Hints shown' : level <= 4 ? 'Hints cost 5 coins' : 'No hints',
  }
}
