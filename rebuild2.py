import os

TEMPLATE = open('src/pages/games/GKBlitz.jsx', encoding='utf-8').read()

GAMES = [
  {
    "file": "MathBlitz",
    "name": "Math Blitz", "emoji": "➗",
    "color": "#8B5CF6", "color2": "#6D28D9",
    "subject": "Maths", "time": "90",
    "desc": "Speed arithmetic — 90 seconds",
    "tip": "Answer fast for combo bonus!",
    "accent_name": "MATH",
    "questions": """[
  {q:"What is 15% of 200?", opts:["25","30","35","40"], ans:1, fact:"15% of 200 = (15/100)×200 = 30. Percentage shortcut: always divide by 100 first."},
  {q:"A train travels 300km in 3 hours. Speed?", opts:["90 km/h","100 km/h","110 km/h","80 km/h"], ans:1, fact:"Speed = Distance/Time = 300/3 = 100 km/h. Core formula for all motion problems."},
  {q:"Square root of 144?", opts:["11","12","13","14"], ans:1, fact:"√144 = 12. Memorize: 11²=121, 12²=144, 13²=169, 14²=196."},
  {q:"20% discount on ₹500. What do you pay?", opts:["₹380","₹400","₹420","₹450"], ans:1, fact:"20% of 500=100. Pay 500-100=₹400. Calculate discount first, then subtract."},
  {q:"What is 8 × 8?", opts:["56","64","72","48"], ans:1, fact:"8×8=64. Memorize squares 1-20 for exam speed."},
  {q:"SI on ₹1000 at 5% for 2 years?", opts:["₹50","₹100","₹150","₹200"], ans:1, fact:"SI=(P×R×T)/100=(1000×5×2)/100=₹100. Appears in every banking exam."},
  {q:"25% of 80?", opts:["15","20","25","30"], ans:1, fact:"25%=1/4. So 80÷4=20. Memorize: 25%=¼, 50%=½, 75%=¾."},
  {q:"6 workers finish in 10 days. 10 workers need?", opts:["4 days","6 days","8 days","5 days"], ans:1, fact:"Work=6×10=60 units. 10 workers: 60/10=6 days. Workers×Days=constant."},
  {q:"17 × 13?", opts:["221","231","211","241"], ans:0, fact:"17×13: use (15+2)(15-2)=225-4=221. Or 17×10=170+17×3=51=221."},
  {q:"A number +30% gives 130. The number?", opts:["90","100","110","120"], ans:1, fact:"1.3x=130, x=100. Reverse: divide by (1+rate/100)."},
]"""
  },
  {
    "file": "WordRush",
    "name": "Word Rush", "emoji": "📝",
    "color": "#10B981", "color2": "#059669",
    "subject": "English", "time": "120",
    "desc": "Vocabulary and idioms — 2 minutes",
    "tip": "Build vocab for CGL/CHSL/IBPS!",
    "accent_name": "VOCAB",
    "questions": """[
  {q:"Meaning of Ubiquitous:", opts:["Rare","Present everywhere","Unique","Temporary"], ans:1, fact:"Ubiquitous = present everywhere. E.g. Mobile phones are ubiquitous today."},
  {q:"Synonym of Ephemeral:", opts:["Permanent","Lasting","Short-lived","Ancient"], ans:2, fact:"Ephemeral = very short-lived. Antonym: perpetual. Common in SSC English."},
  {q:"Once in a blue moon means:", opts:["Very often","During night","Very rarely","Every month"], ans:2, fact:"Once in a blue moon = very rarely. A blue moon = second full moon in a month."},
  {q:"Antonym of Verbose:", opts:["Wordy","Concise","Eloquent","Fluent"], ans:1, fact:"Verbose = using too many words. Antonym = concise (brief and clear)."},
  {q:"Ameliorate means:", opts:["Worsen","Improve","Maintain","Measure"], ans:1, fact:"Ameliorate = make something bad better. Synonym: alleviate, improve."},
  {q:"Correct spelling:", opts:["Accomodation","Accommodation","Accomadation","Accommodatin"], ans:1, fact:"Accommodation: double c and double m. Remember: AC-COM-MO-DA-TION."},
  {q:"The ball is in your court means:", opts:["Play more","It is your decision","Watch the game","Pass to others"], ans:1, fact:"It's in your court = it's your responsibility/decision now."},
  {q:"One-word for one who knows many languages:", opts:["Bilingual","Multilingual","Polyglot","Linguist"], ans:2, fact:"Polyglot = person who knows many languages. Bilingual=2, Multilingual=several."},
  {q:"Antonym of Benevolent:", opts:["Kind","Malevolent","Generous","Helpful"], ans:1, fact:"Benevolent = kind/generous. Malevolent = having evil intentions. Common antonym pair."},
  {q:"Panacea means:", opts:["A disease","Cure for all problems","A medicine","A poison"], ans:1, fact:"Panacea = solution to all problems. From Greek: pan (all) + akos (remedy)."},
]"""
  },
  {
    "file": "LogicGrid",
    "name": "Logic Grid", "emoji": "🧩",
    "color": "#EF4444", "color2": "#DC2626",
    "subject": "Reasoning", "time": "90",
    "desc": "Seating arrangements and coding puzzles",
    "tip": "Most asked in SSC and Banking!",
    "accent_name": "LOGIC",
    "questions": """[
  {q:"CAT = 3-1-20. DOG = ?", opts:["4-15-7","4-14-6","5-15-7","3-14-6"], ans:0, fact:"A=1,B=2...Z=26. D=4,O=15,G=7. So DOG=4-15-7. Most common coding pattern."},
  {q:"A is B sister. B is C brother. C is D father. A is D?", opts:["Mother","Aunt","Sister","Grandmother"], ans:1, fact:"A(female)->B->C->D. A is C sister, C is D father. So A is D aunt."},
  {q:"2, 6, 12, 20, 30, ?", opts:["40","42","44","48"], ans:1, fact:"1x2, 2x3, 3x4, 4x5, 5x6, 6x7=42. Each term = n x (n+1)."},
  {q:"Find odd one: 8, 27, 64, 100, 125", opts:["8","27","100","125"], ans:2, fact:"8=2³, 27=3³, 64=4³, 125=5³. But 100=10² (not a cube). 100 is odd one out."},
  {q:"Complete: Z, X, V, T, ?", opts:["Q","R","S","P"], ans:1, fact:"Skip one letter backwards: Z-2=X, X-2=V, V-2=T, T-2=R."},
  {q:"Clock at 3:15. Angle between hands?", opts:["7.5°","0°","15°","30°"], ans:0, fact:"Hour hand at 97.5°, minute hand at 90°. Difference=7.5°. Hour hand moves 0.5°/min."},
  {q:"All roses are flowers. Some flowers fade. Therefore:", opts:["All roses fade","Some roses may fade","No roses fade","All flowers are roses"], ans:1, fact:"Syllogism rule: possibility conclusion. Some roses MAY fade (not definite)."},
  {q:"If 5 > 3, 3 > 7, 7 > 1, who is greatest?", opts:["1","3","5","7"], ans:2, fact:"5>3>7>1. In coded inequalities, follow the chain. 5 is greatest."},
  {q:"PENCIL coded as QFODKM. PAPER = ?", opts:["QBQFS","QBQDS","QAQFS","RBQFS"], ans:0, fact:"Each letter +1: P->Q, A->B, P->Q, E->F, R->S. PAPER->QBQFS."},
  {q:"Series: 3, 7, 15, 31, 63, ?", opts:["125","127","120","130"], ans:1, fact:"Each x2+1: 3x2+1=7, 7x2+1=15... 63x2+1=127."},
]"""
  },
  {
    "file": "NumberSeries",
    "name": "Number Series", "emoji": "🔢",
    "color": "#0EA5E9", "color2": "#0284C7",
    "subject": "Maths", "time": "90",
    "desc": "Pattern completion challenges",
    "tip": "Spot the pattern, beat the clock!",
    "accent_name": "NUMBERS",
    "questions": """[
  {q:"1, 4, 9, 16, 25, ?", opts:["30","36","35","49"], ans:1, fact:"Perfect squares: 1²,2²,3²,4²,5²,6²=36. Memorize squares 1-25."},
  {q:"2, 3, 5, 7, 11, 13, ?", opts:["15","17","19","16"], ans:1, fact:"Prime numbers. Next prime after 13 is 17."},
  {q:"1, 1, 2, 3, 5, 8, 13, ?", opts:["18","21","20","19"], ans:1, fact:"Fibonacci: each = sum of previous two. 8+13=21."},
  {q:"3, 6, 12, 24, 48, ?", opts:["72","96","84","100"], ans:1, fact:"Geometric series x2. 48x2=96."},
  {q:"5, 10, 20, ?, 80, 160", opts:["30","35","40","45"], ans:2, fact:"x2 series: 5,10,20,40,80,160. Missing=40."},
  {q:"2, 5, 10, 17, 26, ?", opts:["35","37","38","36"], ans:1, fact:"Differences: 3,5,7,9,11 (odd numbers). 26+11=37."},
  {q:"1, 8, 27, 64, 125, ?", opts:["196","216","225","256"], ans:1, fact:"Perfect cubes: 1³,2³,3³,4³,5³,6³=216."},
  {q:"100, 98, 94, 88, 80, ?", opts:["68","70","72","74"], ans:1, fact:"Differences: -2,-4,-6,-8,-10. 80-10=70."},
  {q:"Find missing: 2, 3, 5, 7, 11, ?, 17", opts:["12","13","14","15"], ans:1, fact:"Prime series. Missing prime between 11 and 17 is 13."},
  {q:"4, 8, 24, 96, ?", opts:["384","288","192","480"], ans:0, fact:"x2, x3, x4, x4? No: 4x2=8, 8x3=24, 24x4=96, 96x4=384."},
]"""
  },
  {
    "file": "SportsMastery",
    "name": "Sports Mastery", "emoji": "🏆",
    "color": "#F97316", "color2": "#EA580C",
    "subject": "Sports GK", "time": "60",
    "desc": "Players, trophies, Olympics and records",
    "tip": "Sports GK = easy marks in UPSC/SSC!",
    "accent_name": "SPORTS",
    "questions": """[
  {q:"Most Olympic gold medals ever?", opts:["Usain Bolt","Michael Phelps","Carl Lewis","Mark Spitz"], ans:1, fact:"Michael Phelps: 23 gold, 28 total medals. Greatest Olympian of all time."},
  {q:"Most Cricket World Cup titles?", opts:["India","Australia","West Indies","Pakistan"], ans:1, fact:"Australia won 6 World Cups: 1987,1999,2003,2007,2015,2023. India: 1983, 2011."},
  {q:"Durand Cup is for which sport?", opts:["Cricket","Tennis","Football","Hockey"], ans:2, fact:"Durand Cup = Asia oldest football tournament (1888). Named after Sir Henry Mortimer Durand."},
  {q:"Flying Sikh of India?", opts:["P.T. Usha","Milkha Singh","Suresh Raina","Kapil Dev"], ans:1, fact:"Milkha Singh = Flying Sikh. Missed Olympic bronze by 1/10th second in 1960 Rome 400m."},
  {q:"India first individual Olympic gold?", opts:["Saina Nehwal","P.V. Sindhu","Abhinav Bindra","Vishwanathan Anand"], ans:2, fact:"Abhinav Bindra: 10m Air Rifle gold at 2008 Beijing Olympics. India first individual gold."},
  {q:"Thomas Cup is for which sport?", opts:["Tennis","Badminton","Table Tennis","Squash"], ans:1, fact:"Thomas Cup = men team badminton World Championship. Uber Cup is women equivalent."},
  {q:"Players in a Hockey team?", opts:["9","10","11","12"], ans:2, fact:"Field hockey: 11 players per side including goalkeeper. Same as cricket and football."},
  {q:"Wimbledon surface?", opts:["Clay","Hard","Grass","Carpet"], ans:2, fact:"Wimbledon = only Grand Slam on grass. French Open=clay. US Open and Australian Open=hard."},
  {q:"Most Test centuries?", opts:["Ricky Ponting","Brian Lara","Sachin Tendulkar","Virat Kohli"], ans:2, fact:"Sachin Tendulkar: 51 Test + 49 ODI = 100 international centuries. World record."},
  {q:"Love in tennis means?", opts:["50 points","Won the game","Zero score","Final set"], ans:2, fact:"Love = zero in tennis. From French l oeuf (egg) representing zero shape."},
]"""
  },
  {
    "file": "CurrentAffairsRapid",
    "name": "Current Affairs", "emoji": "📰",
    "color": "#EAB308", "color2": "#CA8A04",
    "subject": "Current Affairs", "time": "90",
    "desc": "India news mapped to exam syllabus",
    "tip": "CA = max marks with minimum effort!",
    "accent_name": "NEWS",
    "questions": """[
  {q:"India G20 Presidency 2023 motto?", opts:["Unity in Diversity","Vasudhaiva Kutumbakam","Jai Hind","Incredible India"], ans:1, fact:"Vasudhaiva Kutumbakam = One Earth One Family One Future. From Sanskrit Maha Upanishad."},
  {q:"First Vande Bharat Express route?", opts:["Mumbai-Pune","Delhi-Varanasi","Chennai-Coimbatore","Kolkata-Patna"], ans:1, fact:"First Vande Bharat: Delhi-Varanasi, Feb 2019. Semi-high speed at 160 km/h."},
  {q:"NEP 2020 replaced?", opts:["NEP 1968","NEP 1986","NEP 1976","NEP 1992"], ans:1, fact:"NEP 2020 replaced NEP 1986. Introduced 5+3+3+4 structure replacing old 10+2 system."},
  {q:"PM Gati Shakti is related to?", opts:["Digital India","Infrastructure planning","Agriculture","Education"], ans:1, fact:"PM Gati Shakti = National Master Plan for multi-modal connectivity. Launched Oct 2021."},
  {q:"India first solar village?", opts:["Gujarat","Rajasthan","Kerala","Madhya Pradesh"], ans:0, fact:"Modhera village in Gujarat: India first 24x7 solar-powered village (October 2022)."},
  {q:"Operation Ganga evacuated Indians from?", opts:["Afghanistan","Ukraine","Sudan","Libya"], ans:1, fact:"Operation Ganga (Feb-March 2022) evacuated 22,500 Indians from war-affected Ukraine."},
  {q:"Chandrayaan-3 landed on Moon?", opts:["North Pole","South Pole","Equator","Dark side"], ans:1, fact:"Chandrayaan-3 landed on Moon South Pole on August 23, 2023. India first country to achieve this."},
  {q:"UDAN scheme is for?", opts:["Drone delivery","Regional air connectivity","Urban development","Nutrition"], ans:1, fact:"UDAN (Ude Desh Ka Aam Naagrik) = regional air connectivity. Launched 2016 for affordable air travel."},
  {q:"PMFBY provides?", opts:["Farm loans","Crop insurance","Irrigation","Seeds"], ans:1, fact:"PMFBY = Pradhan Mantri Fasal Bima Yojana = crop insurance since 2016. One of world largest crop insurance."},
  {q:"Mission Shakti for women launched by?", opts:["UP","Odisha","Kerala","Gujarat"], ans:1, fact:"Odisha launched Mission Shakti 2001 for women self-help groups. Later became central scheme 2021."},
]"""
  },
  {
    "file": "DailyChallenge",
    "name": "Daily Challenge", "emoji": "📅",
    "color": "#F59E0B", "color2": "#D97706",
    "subject": "Mixed", "time": "180",
    "desc": "Fresh mixed questions every day",
    "tip": "New questions every day at midnight!",
    "accent_name": "DAILY",
    "questions": """[
  {q:"Right to Education Article?", opts:["Article 19","Article 21A","Article 32","Article 44"], ans:1, fact:"Article 21A (86th Amendment 2002) = free and compulsory education for 6-14 year olds."},
  {q:"Chemical symbol for Gold?", opts:["Go","Gd","Au","Ag"], ans:2, fact:"Au from Latin Aurum. Ag=Silver, Fe=Iron, Cu=Copper, Pb=Lead."},
  {q:"Wings of Fire author?", opts:["Manmohan Singh","APJ Abdul Kalam","Narendra Modi","Amartya Sen"], ans:1, fact:"Wings of Fire by Dr APJ Abdul Kalam (1999). Translated into 13 languages."},
  {q:"Palk Strait separates India from?", opts:["Myanmar","Bangladesh","Sri Lanka","Maldives"], ans:2, fact:"Palk Strait separates Tamil Nadu from Northern Sri Lanka."},
  {q:"Vitamin from sunlight?", opts:["Vitamin A","Vitamin B12","Vitamin C","Vitamin D"], ans:3, fact:"Vitamin D = Sunshine vitamin. UV-B converts 7-dehydrocholesterol to Vitamin D3."},
  {q:"India Parliament has how many houses?", opts:["1","2","3","4"], ans:1, fact:"India Parliament = Lok Sabha + Rajya Sabha + President. Bicameral legislature."},
  {q:"National Animal of India?", opts:["Lion","Elephant","Tiger","Leopard"], ans:2, fact:"Bengal Tiger = National Animal since 1973 when Project Tiger launched."},
  {q:"First woman President of India?", opts:["Indira Gandhi","Pratibha Patil","Sonia Gandhi","Sarojini Naidu"], ans:1, fact:"Pratibha Patil = 12th President, first woman President (2007-2012)."},
  {q:"Great Red Spot is on?", opts:["Mars","Saturn","Jupiter","Neptune"], ans:2, fact:"Jupiter Great Red Spot = storm larger than Earth, ongoing for 350+ years."},
  {q:"Silicon Valley is in which US state?", opts:["Texas","New York","California","Florida"], ans:2, fact:"Silicon Valley in San Francisco Bay Area, California. Hub of Apple, Google, Meta."},
]"""
  },
  {
    "file": "SpeedReading",
    "name": "Speed Reading", "emoji": "📖",
    "color": "#22C55E", "color2": "#16A34A",
    "subject": "English RC", "time": "120",
    "desc": "Reading comprehension under timer",
    "tip": "RC = 20-30% of English section!",
    "accent_name": "RC",
    "questions": """[
  {q:"RBI was established in 1935 under RBI Act 1934. When was RBI established?", opts:["1934","1935","1936","1932"], ans:1, fact:"RBI established April 1, 1935. Nationalized 1949. HQ: Mumbai."},
  {q:"India is a secular nation where state has no official religion. Secular means:", opts:["Religious","Non-religious state","Ancient","Democratic"], ans:1, fact:"Secular = separation of religion from state. Added to Preamble by 42nd Amendment 1976."},
  {q:"Reading between the lines means:", opts:["Read carefully","Understand hidden meaning","Read slowly","Skip lines"], ans:1, fact:"Reading between the lines = understanding implied or unstated meaning beyond literal words."},
  {q:"The bill was passed unanimously. Unanimously means:", opts:["With opposition","By majority","All agreeing","Secretly"], ans:2, fact:"Unanimously = with complete agreement, everyone voting the same way."},
  {q:"The word proactive means:", opts:["Reactive","Delayed","Taking initiative beforehand","Forced"], ans:2, fact:"Proactive = acting in anticipation of future problems. Opposite: reactive."},
  {q:"Landmark ruling means:", opts:["Near a landmark","Important historic","Related to land","Official"], ans:1, fact:"Landmark = significant, historic, serving as a milestone for future cases."},
  {q:"The author said climate change is irreversible. Author tone is:", opts:["Optimistic","Pessimistic","Neutral","Humorous"], ans:1, fact:"Irreversible signals a pessimistic tone. Identifying author tone is key in RC questions."},
  {q:"Government took proactive measures. Proactive means:", opts:["Reactive","Delayed","Taking initiative","Forced"], ans:2, fact:"Proactive = taking action before problems arise. Key vocab for government RC passages."},
  {q:"Many students drop out due to financial constraints. Inference?", opts:["Students are lazy","Education is free","Poverty affects education","Schools are bad"], ans:2, fact:"Inference = conclusion from given info. Financial constraints directly implies poverty issue."},
  {q:"De facto means:", opts:["By law","In practice","Officially","Theoretically"], ans:1, fact:"De facto = in practice/reality. De jure = by law. Common in political science RC."},
]"""
  },
]

# Build each game file directly
for g in GAMES:
    code = '''// src/pages/games/''' + g['file'] + '''.jsx — Premium UI
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { ParticleBurst, ComboFire, ScorePopup, TimerRing, AnswerOption, XPBar, GameHeader } from '../../lib/gameUI.jsx'

const QUESTIONS = ''' + g['questions'] + '''
const TOTAL_TIME = ''' + g['time'] + '''
const C1 = '''' + g['color'] + ''''
const C2 = '''' + g['color2'] + ''''

export default function ''' + g['file'] + '''() {
  const navigate  = useNavigate()
  const { theme } = useTheme()
  const { user: authUser } = useAuth()
  const primD = theme?.primaryDark ?? '#0F2140'

  const [phase,    setPhase]    = useState('intro')
  const [qIdx,     setQIdx]     = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score,    setScore]    = useState(0)
  const [combo,    setCombo]    = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [results,  setResults]  = useState([])
  const [burst,    setBurst]    = useState(false)
  const [popup,    setPopup]    = useState(null)
  const timerRef = useRef()

  const seed = (authUser?.id?.charCodeAt(0) || 42) + new Date().getDate()
  const questions = [...QUESTIONS].sort(() => Math.sin(seed * Math.random()) - 0.5)
  const q = questions[qIdx]

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); finishGame(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const handleAnswer = (i) => {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    const correct = i === q.ans
    if (correct) {
      const pts = 10 + combo * 3
      setScore(s => s + pts)
      const nc = combo + 1
      setCombo(nc)
      setMaxCombo(m => Math.max(m, nc))
      setBurst(true)
      setPopup({ pts, correct: true })
      setTimeout(() => { setBurst(false); setPopup(null) }, 1200)
    } else {
      setCombo(0)
      setPopup({ pts: 0, correct: false })
      setTimeout(() => setPopup(null), 1000)
    }
    setResults(r => [...r, { q: q.q, selected: i, correct: q.ans, fact: q.fact }])
    setTimeout(() => {
      if (qIdx < questions.length - 1) {
        setQIdx(i => i + 1); setSelected(null); setRevealed(false)
      } else { clearInterval(timerRef.current); finishGame() }
    }, 1300)
  }

  const finishGame = useCallback(async () => {
    setPhase('result')
    if (authUser) {
      const uid = authUser.id || authUser.userId
      try {
        await supabase.from('test_attempts').insert({
          user_id: uid,
          exam_name: 'game_''' + g['file'].lower() + '''',
          subject: '''' + g['subject'] + '''',
          score, total: questions.length * 10,
          coins_earned: Math.round(score / 5),
          xp_earned: score * 2,
        })
      } catch(e) {}
    }
  }, [score, authUser])

  const resetGame = () => {
    setPhase('intro'); setQIdx(0); setSelected(null); setRevealed(false)
    setScore(0); setCombo(0); setMaxCombo(0); setTimeLeft(TOTAL_TIME); setResults([])
  }

  const shareResult = () => {
    const text = `''' + g['emoji'] + ''' ''' + g['name'] + ''': ${score} pts | Combo x${maxCombo} on TryIT! tryiteducations.net`
    if (navigator.share) navigator.share({ title: '''' + g['name'] + ''' Score', text })
    else navigator.clipboard?.writeText(text)
  }

  const correct = results.filter(r => r.selected === r.correct).length
  const bg = `radial-gradient(ellipse 100% 60% at 50% -10%,${C1}33,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 100%,${C2}22,transparent 50%),${primD}`

  if (phase === 'intro') return (
    <div style={{ minHeight:'100vh', background:bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'Inter,sans-serif' }}>
      <style>{`@keyframes pulse-ring{0%,100%{box-shadow:0 0 0 0 ${C1}44}50%{box-shadow:0 0 0 24px transparent}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ textAlign:'center', maxWidth:380, width:'100%' }}>
        <div style={{ width:100,height:100,borderRadius:'50%',background:`linear-gradient(135deg,${C1},${C2})`,margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:52,animation:'pulse-ring 2s infinite,float 3s ease-in-out infinite',boxShadow:`0 12px 40px ${C1}55` }}>''' + g['emoji'] + '''</div>
        <p style={{ color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:28,margin:'0 0 8px' }}>''' + g['name'] + '''</p>
        <p style={{ color:'rgba(255,255,255,0.5)',fontSize:13,margin:'0 0 6px' }}>''' + g['desc'] + '''</p>
        <p style={{ color:C1,fontSize:11,fontWeight:700,margin:'0 0 24px',background:`${C1}18`,padding:'6px 14px',borderRadius:20,display:'inline-block' }}>⚡ ''' + g['tip'] + '''</p>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:28 }}>
          {[{icon:'⏱️',label:`${TOTAL_TIME}s`,sub:'Time limit'},{icon:'🔥',label:'Combo x3',sub:'Bonus pts'},{icon:'🪙',label:'+coins',sub:'Per correct'}].map((s,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,padding:'12px 8px',textAlign:'center' }}>
              <p style={{ fontSize:22,margin:'0 0 4px' }}>{s.icon}</p>
              <p style={{ color:'#fff',fontWeight:700,fontSize:11,margin:'0 0 2px' }}>{s.label}</p>
              <p style={{ color:'rgba(255,255,255,0.35)',fontSize:9,margin:0 }}>{s.sub}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase('playing')} style={{ width:'100%',padding:'16px',background:`linear-gradient(135deg,${C1},${C2})`,border:'none',borderRadius:16,cursor:'pointer',color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:18,boxShadow:`0 8px 32px ${C1}55` }}>▶ Start Game</button>
        <button onClick={() => navigate('/student/games')} style={{ marginTop:12,background:'transparent',border:'none',color:'rgba(255,255,255,0.35)',fontSize:12,cursor:'pointer' }}>← Back to Games</button>
      </div>
    </div>
  )

  if (phase === 'result') return (
    <div style={{ minHeight:'100vh',background:bg,padding:24,fontFamily:'Inter,sans-serif' }}>
      <div style={{ maxWidth:500,margin:'0 auto',paddingTop:20 }}>
        <div style={{ textAlign:'center',marginBottom:24 }}>
          <p style={{ fontSize:56,margin:'0 0 8px' }}>{score>=80?'🏆':score>=50?'⭐':'💪'}</p>
          <p style={{ color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:24,margin:'0 0 4px' }}>{score>=80?'Brilliant!':score>=50?'Great!':'Keep Going!'}</p>
          <p style={{ color:C1,fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:52,margin:'0 0 16px',textShadow:`0 0 30px ${C1}88` }}>{score}</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20 }}>
            {[{label:'Correct',val:`${correct}/${questions.length}`,icon:'✅'},{label:'Best Combo',val:`x${maxCombo}`,icon:'🔥'},{label:'Coins',val:`+${Math.round(score/5)}`,icon:'🪙'}].map((s,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,padding:'12px 8px',textAlign:'center' }}>
                <p style={{ fontSize:18,margin:'0 0 4px' }}>{s.icon}</p>
                <p style={{ color:'#fff',fontWeight:900,fontSize:16,margin:0 }}>{s.val}</p>
                <p style={{ color:'rgba(255,255,255,0.4)',fontSize:9 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:18,padding:16,marginBottom:16,maxHeight:260,overflowY:'auto' }}>
          <p style={{ color:'rgba(255,255,255,0.5)',fontSize:10,fontWeight:700,margin:'0 0 12px',letterSpacing:'1px' }}>ANSWER REVIEW</p>
          {results.map((r,i) => (
            <div key={i} style={{ display:'flex',gap:10,padding:'8px 0',borderBottom:i<results.length-1?'1px solid rgba(255,255,255,0.06)':'none' }}>
              <span style={{ fontSize:14,flexShrink:0 }}>{r.selected===r.correct?'✅':'❌'}</span>
              <div>
                <p style={{ color:'rgba(255,255,255,0.75)',fontSize:11,margin:'0 0 2px',lineHeight:1.4 }}>{r.q}</p>
                <p style={{ color:'rgba(255,255,255,0.35)',fontSize:9,margin:0 }}>{r.fact}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
          <button onClick={resetGame} style={{ padding:'14px',background:`linear-gradient(135deg,${C1},${C2})`,border:'none',borderRadius:14,color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:`0 4px 16px ${C1}44` }}>🔄 Play Again</button>
          <button onClick={shareResult} style={{ padding:'14px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:14,color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer' }}>📤 Share Score</button>
        </div>
        <button onClick={() => navigate('/student/games')} style={{ width:'100%',marginTop:10,padding:'12px',background:'transparent',border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,color:'rgba(255,255,255,0.4)',fontSize:13,cursor:'pointer' }}>← Back to Games Hub</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:bg,fontFamily:'Inter,sans-serif' }}>
      <ParticleBurst active={burst} color={C1}/>
      <ComboFire combo={combo}/>
      {popup && <ScorePopup points={popup.pts} correct={popup.correct} x={50} y={35}/>}
      <GameHeader title="''' + g['name'] + '''" emoji="''' + g['emoji'] + '''" score={score} combo={combo} timeLeft={timeLeft} totalTime={TOTAL_TIME} questNum={qIdx+1} totalQuest={questions.length} accent={C1} onExit={() => navigate('/student/games')}/>
      <div style={{ maxWidth:600,margin:'0 auto',padding:'16px' }}>
        <div style={{ display:'flex',gap:4,marginBottom:16,justifyContent:'center' }}>
          {questions.map((_,i) => (
            <div key={i} style={{ width:i===qIdx?24:8,height:8,borderRadius:4,background:i<qIdx?(results[i]?.selected===results[i]?.correct?'#4ADE80':'#F87171'):i===qIdx?C1:'rgba(255,255,255,0.15)',transition:'all 0.3s',boxShadow:i===qIdx?`0 0 8px ${C1}`:'none' }}/>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <XPBar current={score} max={questions.length*13} color={C1} label={`Score: ${score}`}/>
        </div>
        <div style={{ background:'rgba(255,255,255,0.07)',backdropFilter:'blur(20px)',border:`1px solid ${C1}33`,borderRadius:20,padding:'20px',marginBottom:14,boxShadow:'0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex',gap:10,alignItems:'center',marginBottom:12 }}>
            <span style={{ background:`${C1}22`,color:C1,fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:20,border:`1px solid ${C1}33` }}>''' + g['subject'] + '''</span>
            {combo>0 && <span style={{ color:C1,fontSize:10,fontWeight:700 }}>🔥 x{combo}</span>}
          </div>
          <p style={{ color:'#fff',fontSize:16,fontWeight:600,lineHeight:1.6,margin:0 }}>{q?.q}</p>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {q?.opts?.map((opt,i) => (
            <AnswerOption key={i} option={opt} index={i} selected={selected===i} correct={revealed && i===q.ans} wrong={revealed && i!==q.ans} revealed={revealed} disabled={revealed} onClick={() => handleAnswer(i)}/>
          ))}
        </div>
        {revealed && (
          <div style={{ marginTop:14,background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)',borderRadius:14,padding:'12px 16px',animation:'fact-in 0.3s ease' }}>
            <p style={{ color:'#4ADE80',fontWeight:700,fontSize:11,margin:'0 0 4px' }}>💡 Know This!</p>
            <p style={{ color:'rgba(255,255,255,0.7)',fontSize:12,margin:0,lineHeight:1.6 }}>{q?.fact}</p>
          </div>
        )}
      </div>
      <style>{`@keyframes fact-in{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  )
}
'''
    path = f"src/pages/games/{g['file']}.jsx"
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"✅ Built: {g['file']}")

print("\nAll 8 games rebuilt!")
