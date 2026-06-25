import os

def write_game(filename, name, emoji, color, color2, subject, time_limit, desc, tip, questions_js):
    code = (
        "// src/pages/games/" + filename + ".jsx\n"
        "import { useState, useEffect, useRef, useCallback } from 'react'\n"
        "import { useNavigate } from 'react-router-dom'\n"
        "import { useTheme } from '../../context/ThemeContext'\n"
        "import { useAuth } from '../../context/AuthContext'\n"
        "import { supabase } from '../../lib/supabase'\n"
        "import { ParticleBurst, ComboFire, ScorePopup, TimerRing, AnswerOption, XPBar, GameHeader } from '../../lib/gameUI.jsx'\n\n"
        "const QUESTIONS = " + questions_js + "\n"
        "const TOTAL_TIME = " + str(time_limit) + "\n"
        "const C1 = '" + color + "'\n"
        "const C2 = '" + color2 + "'\n\n"
        "export default function " + filename + "() {\n"
        "  const navigate = useNavigate()\n"
        "  const { theme } = useTheme()\n"
        "  const { user: authUser } = useAuth()\n"
        "  const primD = theme?.primaryDark ?? '#0F2140'\n\n"
        "  const [phase, setPhase] = useState('intro')\n"
        "  const [qIdx, setQIdx] = useState(0)\n"
        "  const [selected, setSelected] = useState(null)\n"
        "  const [revealed, setRevealed] = useState(false)\n"
        "  const [score, setScore] = useState(0)\n"
        "  const [combo, setCombo] = useState(0)\n"
        "  const [maxCombo, setMaxCombo] = useState(0)\n"
        "  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)\n"
        "  const [results, setResults] = useState([])\n"
        "  const [burst, setBurst] = useState(false)\n"
        "  const [popup, setPopup] = useState(null)\n"
        "  const timerRef = useRef()\n\n"
        "  const seed = (authUser?.id?.charCodeAt(0) || 42) + new Date().getDate()\n"
        "  const questions = [...QUESTIONS].sort(() => Math.sin(seed * Math.random()) - 0.5)\n"
        "  const q = questions[qIdx]\n\n"
        "  useEffect(() => {\n"
        "    if (phase !== 'playing') return\n"
        "    timerRef.current = setInterval(() => {\n"
        "      setTimeLeft(t => {\n"
        "        if (t <= 1) { clearInterval(timerRef.current); finishGame(); return 0 }\n"
        "        return t - 1\n"
        "      })\n"
        "    }, 1000)\n"
        "    return () => clearInterval(timerRef.current)\n"
        "  }, [phase])\n\n"
        "  const handleAnswer = (i) => {\n"
        "    if (revealed) return\n"
        "    setSelected(i)\n"
        "    setRevealed(true)\n"
        "    const correct = i === q.ans\n"
        "    if (correct) {\n"
        "      const pts = 10 + combo * 3\n"
        "      setScore(s => s + pts)\n"
        "      const nc = combo + 1\n"
        "      setCombo(nc)\n"
        "      setMaxCombo(m => Math.max(m, nc))\n"
        "      setBurst(true)\n"
        "      setPopup({ pts, correct: true })\n"
        "      setTimeout(() => { setBurst(false); setPopup(null) }, 1200)\n"
        "    } else {\n"
        "      setCombo(0)\n"
        "      setPopup({ pts: 0, correct: false })\n"
        "      setTimeout(() => setPopup(null), 1000)\n"
        "    }\n"
        "    setResults(r => [...r, { q: q.q, selected: i, correct: q.ans, fact: q.fact }])\n"
        "    setTimeout(() => {\n"
        "      if (qIdx < questions.length - 1) {\n"
        "        setQIdx(idx => idx + 1); setSelected(null); setRevealed(false)\n"
        "      } else { clearInterval(timerRef.current); finishGame() }\n"
        "    }, 1300)\n"
        "  }\n\n"
        "  const finishGame = useCallback(async () => {\n"
        "    setPhase('result')\n"
        "    if (authUser) {\n"
        "      const uid = authUser.id || authUser.userId\n"
        "      try {\n"
        "        await supabase.from('test_attempts').insert({\n"
        "          user_id: uid, exam_name: 'game_" + filename.lower() + "',\n"
        "          subject: '" + subject + "', score, total: questions.length * 10,\n"
        "          coins_earned: Math.round(score / 5), xp_earned: score * 2,\n"
        "        })\n"
        "      } catch(e) {}\n"
        "    }\n"
        "  }, [score, authUser])\n\n"
        "  const resetGame = () => {\n"
        "    setPhase('intro'); setQIdx(0); setSelected(null); setRevealed(false)\n"
        "    setScore(0); setCombo(0); setMaxCombo(0); setTimeLeft(TOTAL_TIME); setResults([])\n"
        "  }\n\n"
        "  const shareResult = () => {\n"
        "    const text = `" + emoji + " " + name + ": ${score} pts | Combo x${maxCombo} on TryIT! tryiteducations.net`\n"
        "    if (navigator.share) navigator.share({ title: `" + name + " Score`, text })\n"
        "    else navigator.clipboard?.writeText(text)\n"
        "  }\n\n"
        "  const correct = results.filter(r => r.selected === r.correct).length\n"
        "  const bg = `radial-gradient(ellipse 100% 60% at 50% -10%,${C1}33,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 100%,${C2}22,transparent 50%),${primD}`\n\n"
        "  if (phase === 'intro') return (\n"
        "    <div style={{ minHeight:'100vh', background:bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'Inter,sans-serif' }}>\n"
        "      <style>{`@keyframes pr{0%,100%{box-shadow:0 0 0 0 ${C1}44}50%{box-shadow:0 0 0 24px transparent}} @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>\n"
        "      <div style={{ textAlign:'center', maxWidth:380, width:'100%' }}>\n"
        "        <div style={{ width:100,height:100,borderRadius:'50%',background:`linear-gradient(135deg,${C1},${C2})`,margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:52,animation:'pr 2s infinite,fl 3s ease-in-out infinite',boxShadow:`0 12px 40px ${C1}55` }}>" + emoji + "</div>\n"
        "        <p style={{ color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:28,margin:'0 0 8px' }}>" + name + "</p>\n"
        "        <p style={{ color:'rgba(255,255,255,0.5)',fontSize:13,margin:'0 0 6px' }}>" + desc + "</p>\n"
        "        <p style={{ color:C1,fontSize:11,fontWeight:700,margin:'0 0 24px',background:`${C1}18`,padding:'6px 14px',borderRadius:20,display:'inline-block' }}>⚡ " + tip + "</p>\n"
        "        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:28 }}>\n"
        "          {[{icon:'⏱️',label:`${TOTAL_TIME}s`,sub:'Time limit'},{icon:'🔥',label:'Combo x3',sub:'Bonus pts'},{icon:'🪙',label:'+coins',sub:'Per correct'}].map((s,i) => (\n"
        "            <div key={i} style={{ background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,padding:'12px 8px',textAlign:'center' }}>\n"
        "              <p style={{ fontSize:22,margin:'0 0 4px' }}>{s.icon}</p>\n"
        "              <p style={{ color:'#fff',fontWeight:700,fontSize:11,margin:'0 0 2px' }}>{s.label}</p>\n"
        "              <p style={{ color:'rgba(255,255,255,0.35)',fontSize:9,margin:0 }}>{s.sub}</p>\n"
        "            </div>\n"
        "          ))}\n"
        "        </div>\n"
        "        <button onClick={() => setPhase('playing')} style={{ width:'100%',padding:'16px',background:`linear-gradient(135deg,${C1},${C2})`,border:'none',borderRadius:16,cursor:'pointer',color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:18,boxShadow:`0 8px 32px ${C1}55` }}>▶ Start Game</button>\n"
        "        <button onClick={() => navigate('/student/games')} style={{ marginTop:12,background:'transparent',border:'none',color:'rgba(255,255,255,0.35)',fontSize:12,cursor:'pointer' }}>← Back to Games</button>\n"
        "      </div>\n"
        "    </div>\n"
        "  )\n\n"
        "  if (phase === 'result') return (\n"
        "    <div style={{ minHeight:'100vh',background:bg,padding:24,fontFamily:'Inter,sans-serif' }}>\n"
        "      <div style={{ maxWidth:500,margin:'0 auto',paddingTop:20 }}>\n"
        "        <div style={{ textAlign:'center',marginBottom:24 }}>\n"
        "          <p style={{ fontSize:56,margin:'0 0 8px' }}>{score>=80?'🏆':score>=50?'⭐':'💪'}</p>\n"
        "          <p style={{ color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:24,margin:'0 0 4px' }}>{score>=80?'Brilliant!':score>=50?'Great!':'Keep Going!'}</p>\n"
        "          <p style={{ color:C1,fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:52,margin:'0 0 16px',textShadow:`0 0 30px ${C1}88` }}>{score}</p>\n"
        "          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20 }}>\n"
        "            {[{label:'Correct',val:`${correct}/${questions.length}`,icon:'✅'},{label:'Best Combo',val:`x${maxCombo}`,icon:'🔥'},{label:'Coins',val:`+${Math.round(score/5)}`,icon:'🪙'}].map((s,i) => (\n"
        "              <div key={i} style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,padding:'12px 8px',textAlign:'center' }}>\n"
        "                <p style={{ fontSize:18,margin:'0 0 4px' }}>{s.icon}</p>\n"
        "                <p style={{ color:'#fff',fontWeight:900,fontSize:16,margin:0 }}>{s.val}</p>\n"
        "                <p style={{ color:'rgba(255,255,255,0.4)',fontSize:9 }}>{s.label}</p>\n"
        "              </div>\n"
        "            ))}\n"
        "          </div>\n"
        "        </div>\n"
        "        <div style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:18,padding:16,marginBottom:16,maxHeight:260,overflowY:'auto' }}>\n"
        "          <p style={{ color:'rgba(255,255,255,0.5)',fontSize:10,fontWeight:700,margin:'0 0 12px',letterSpacing:'1px' }}>ANSWER REVIEW</p>\n"
        "          {results.map((r,i) => (\n"
        "            <div key={i} style={{ display:'flex',gap:10,padding:'8px 0',borderBottom:i<results.length-1?'1px solid rgba(255,255,255,0.06)':'none' }}>\n"
        "              <span style={{ fontSize:14,flexShrink:0 }}>{r.selected===r.correct?'✅':'❌'}</span>\n"
        "              <div><p style={{ color:'rgba(255,255,255,0.75)',fontSize:11,margin:'0 0 2px',lineHeight:1.4 }}>{r.q}</p>\n"
        "              <p style={{ color:'rgba(255,255,255,0.35)',fontSize:9,margin:0 }}>{r.fact}</p></div>\n"
        "            </div>\n"
        "          ))}\n"
        "        </div>\n"
        "        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>\n"
        "          <button onClick={resetGame} style={{ padding:'14px',background:`linear-gradient(135deg,${C1},${C2})`,border:'none',borderRadius:14,color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer' }}>🔄 Play Again</button>\n"
        "          <button onClick={shareResult} style={{ padding:'14px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:14,color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer' }}>📤 Share</button>\n"
        "        </div>\n"
        "        <button onClick={() => navigate('/student/games')} style={{ width:'100%',marginTop:10,padding:'12px',background:'transparent',border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,color:'rgba(255,255,255,0.4)',fontSize:13,cursor:'pointer' }}>← Back to Games Hub</button>\n"
        "      </div>\n"
        "    </div>\n"
        "  )\n\n"
        "  return (\n"
        "    <div style={{ minHeight:'100vh',background:bg,fontFamily:'Inter,sans-serif' }}>\n"
        "      <ParticleBurst active={burst} color={C1}/>\n"
        "      <ComboFire combo={combo}/>\n"
        "      {popup && <ScorePopup points={popup.pts} correct={popup.correct} x={50} y={35}/>}\n"
        "      <GameHeader title=\"" + name + "\" emoji=\"" + emoji + "\" score={score} combo={combo} timeLeft={timeLeft} totalTime={TOTAL_TIME} questNum={qIdx+1} totalQuest={questions.length} accent={C1} onExit={() => navigate('/student/games')}/>\n"
        "      <div style={{ maxWidth:600,margin:'0 auto',padding:'16px' }}>\n"
        "        <div style={{ display:'flex',gap:4,marginBottom:16,justifyContent:'center' }}>\n"
        "          {questions.map((_,i) => (<div key={i} style={{ width:i===qIdx?24:8,height:8,borderRadius:4,background:i<qIdx?(results[i]?.selected===results[i]?.correct?'#4ADE80':'#F87171'):i===qIdx?C1:'rgba(255,255,255,0.15)',transition:'all 0.3s',boxShadow:i===qIdx?`0 0 8px ${C1}`:'none' }}/>))}\n"
        "        </div>\n"
        "        <div style={{ marginBottom:14 }}><XPBar current={score} max={questions.length*13} color={C1} label={`Score: ${score}`}/></div>\n"
        "        <div style={{ background:'rgba(255,255,255,0.07)',backdropFilter:'blur(20px)',border:`1px solid ${C1}33`,borderRadius:20,padding:'20px',marginBottom:14,boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}>\n"
        "          <div style={{ display:'flex',gap:10,alignItems:'center',marginBottom:12 }}>\n"
        "            <span style={{ background:`${C1}22`,color:C1,fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:20,border:`1px solid ${C1}33` }}>" + subject + "</span>\n"
        "            {combo>0 && <span style={{ color:C1,fontSize:10,fontWeight:700 }}>🔥 x{combo}</span>}\n"
        "          </div>\n"
        "          <p style={{ color:'#fff',fontSize:16,fontWeight:600,lineHeight:1.6,margin:0 }}>{q?.q}</p>\n"
        "        </div>\n"
        "        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>\n"
        "          {q?.opts?.map((opt,i) => (<AnswerOption key={i} option={opt} index={i} selected={selected===i} correct={revealed && i===q.ans} wrong={revealed && i!==q.ans} revealed={revealed} disabled={revealed} onClick={() => handleAnswer(i)}/>))}\n"
        "        </div>\n"
        "        {revealed && (\n"
        "          <div style={{ marginTop:14,background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)',borderRadius:14,padding:'12px 16px' }}>\n"
        "            <p style={{ color:'#4ADE80',fontWeight:700,fontSize:11,margin:'0 0 4px' }}>💡 Know This!</p>\n"
        "            <p style={{ color:'rgba(255,255,255,0.7)',fontSize:12,margin:0,lineHeight:1.6 }}>{q?.fact}</p>\n"
        "          </div>\n"
        "        )}\n"
        "      </div>\n"
        "    </div>\n"
        "  )\n"
        "}\n"
    )
    with open("src/pages/games/" + filename + ".jsx", 'w', encoding='utf-8') as f:
        f.write(code)
    print("Built: " + filename)

# MathBlitz
write_game("MathBlitz","Math Blitz","➗","#8B5CF6","#6D28D9","Maths",90,
  "Speed arithmetic — 90 seconds","Answer fast for combo bonus!",
  """[
  {q:"What is 15% of 200?", opts:["25","30","35","40"], ans:1, fact:"15% of 200 = 30. Divide by 100 then multiply: 200 x 0.15 = 30."},
  {q:"Train travels 300km in 3 hours. Speed?", opts:["90 km/h","100 km/h","110 km/h","80 km/h"], ans:1, fact:"Speed = Distance/Time = 300/3 = 100 km/h. Core formula for all motion problems."},
  {q:"Square root of 144?", opts:["11","12","13","14"], ans:1, fact:"12 x 12 = 144. Memorize squares: 11=121, 12=144, 13=169, 14=196."},
  {q:"20% discount on Rs.500. Amount paid?", opts:["Rs.380","Rs.400","Rs.420","Rs.450"], ans:1, fact:"20% of 500 = 100. Pay 500 - 100 = Rs.400."},
  {q:"8 x 8 = ?", opts:["56","64","72","48"], ans:1, fact:"8x8=64. Memorize multiplication tables up to 20 for exam speed."},
  {q:"SI on Rs.1000 at 5% for 2 years?", opts:["Rs.50","Rs.100","Rs.150","Rs.200"], ans:1, fact:"SI = (PxRxT)/100 = (1000x5x2)/100 = Rs.100. Appears in every banking exam."},
  {q:"25% of 80 = ?", opts:["15","20","25","30"], ans:1, fact:"25% = 1/4. So 80 divided by 4 = 20. Shortcut: 25%=quarter, 50%=half."},
  {q:"6 workers finish in 10 days. 10 workers need?", opts:["4 days","6 days","8 days","5 days"], ans:1, fact:"Work = 6x10 = 60 units. 10 workers: 60/10 = 6 days. Inverse proportion."},
  {q:"17 x 13 = ?", opts:["221","231","211","241"], ans:0, fact:"17x13 = (15+2)(15-2) = 225-4 = 221. Use difference of squares shortcut."},
  {q:"A number increased by 30% gives 130. The number?", opts:["90","100","110","120"], ans:1, fact:"1.3x = 130, so x = 100. Reverse percentage: divide by (1 + rate/100)."},
]""")

# WordRush
write_game("WordRush","Word Rush","📝","#10B981","#059669","English",120,
  "Vocabulary and idioms — 2 minutes","Build vocab for CGL/CHSL/IBPS!",
  """[
  {q:"Meaning of Ubiquitous:", opts:["Rare","Present everywhere","Unique","Temporary"], ans:1, fact:"Ubiquitous = present everywhere. Example: Mobile phones are ubiquitous today."},
  {q:"Synonym of Ephemeral:", opts:["Permanent","Lasting","Short-lived","Ancient"], ans:2, fact:"Ephemeral = very short-lived. Antonym: perpetual. Common in SSC English."},
  {q:"Once in a blue moon means:", opts:["Very often","During night","Very rarely","Every month"], ans:2, fact:"Once in a blue moon = very rarely. A blue moon is the second full moon in a month."},
  {q:"Antonym of Verbose:", opts:["Wordy","Concise","Eloquent","Fluent"], ans:1, fact:"Verbose = using too many words. Antonym = concise. Key vocab for editing questions."},
  {q:"Ameliorate means:", opts:["Worsen","Improve","Maintain","Measure"], ans:1, fact:"Ameliorate = make something bad better. Synonym: alleviate, improve."},
  {q:"Correct spelling:", opts:["Accomodation","Accommodation","Accomadation","Accommodatin"], ans:1, fact:"Accommodation has double c and double m. Remember: AC-COM-MO-DA-TION."},
  {q:"The ball is in your court means:", opts:["Play more","It is your decision","Watch the game","Pass to others"], ans:1, fact:"It is in your court = it is your responsibility or decision now."},
  {q:"One who knows many languages:", opts:["Bilingual","Multilingual","Polyglot","Linguist"], ans:2, fact:"Polyglot = person who knows many languages. Bilingual = 2 languages."},
  {q:"Antonym of Benevolent:", opts:["Kind","Malevolent","Generous","Helpful"], ans:1, fact:"Benevolent = kind/generous. Malevolent = having evil intentions. Common antonym pair."},
  {q:"Panacea means:", opts:["A disease","Cure for all problems","A medicine","A poison"], ans:1, fact:"Panacea = solution to all problems. From Greek pan (all) + akos (remedy)."},
]""")

# LogicGrid
write_game("LogicGrid","Logic Grid","🧩","#EF4444","#DC2626","Reasoning",90,
  "Seating arrangements and coding puzzles","Most asked in SSC and Banking!",
  """[
  {q:"CAT = 3-1-20. DOG = ?", opts:["4-15-7","4-14-6","5-15-7","3-14-6"], ans:0, fact:"A=1,B=2...Z=26. D=4, O=15, G=7. So DOG = 4-15-7. Most common coding pattern in exams."},
  {q:"A is B sister. B is C brother. C is D father. A related to D?", opts:["Mother","Aunt","Sister","Grandmother"], ans:1, fact:"A(female) -> B -> C -> D. A is C sister, C is D father. So A is D aunt."},
  {q:"2, 6, 12, 20, 30, next?", opts:["40","42","44","48"], ans:1, fact:"Pattern: 1x2, 2x3, 3x4, 4x5, 5x6, 6x7 = 42. Each term = n x (n+1)."},
  {q:"Odd one: 8, 27, 64, 100, 125", opts:["8","27","100","125"], ans:2, fact:"8=2 cube, 27=3 cube, 64=4 cube, 125=5 cube. But 100=10 squared (not a cube). 100 is odd."},
  {q:"Complete: Z, X, V, T, ?", opts:["Q","R","S","P"], ans:1, fact:"Skip one letter backwards: Z-2=X, X-2=V, V-2=T, T-2=R."},
  {q:"Clock at 3:15. Angle between hands?", opts:["7.5 degrees","0 degrees","15 degrees","30 degrees"], ans:0, fact:"Hour hand at 97.5 degrees, minute hand at 90 degrees. Difference = 7.5 degrees."},
  {q:"All roses are flowers. Some flowers fade. Therefore:", opts:["All roses fade","Some roses may fade","No roses fade","All flowers are roses"], ans:1, fact:"Syllogism: possibility conclusion only. Some roses MAY fade is the correct inference."},
  {q:"Series: 3, 7, 15, 31, 63, next?", opts:["125","127","120","130"], ans:1, fact:"Each x2+1: 3x2+1=7, 7x2+1=15, 15x2+1=31, 31x2+1=63, 63x2+1=127."},
  {q:"If 5>3, 3>7, 7>1 in coded form, who is greatest?", opts:["1","3","5","7"], ans:2, fact:"In coded inequalities follow the chain: 5>3>7>1. So 5 is greatest."},
  {q:"PENCIL coded as QFODKM. PAPER = ?", opts:["QBQFS","QBQDS","QAQFS","RBQFS"], ans:0, fact:"Each letter +1: P->Q, A->B, P->Q, E->F, R->S. PAPER -> QBQFS."},
]""")

# NumberSeries
write_game("NumberSeries","Number Series","🔢","#0EA5E9","#0284C7","Maths",90,
  "Pattern completion challenges","Spot the pattern, beat the clock!",
  """[
  {q:"1, 4, 9, 16, 25, next?", opts:["30","36","35","49"], ans:1, fact:"Perfect squares: 1,4,9,16,25,36. Next is 6 squared = 36."},
  {q:"2, 3, 5, 7, 11, 13, next?", opts:["15","17","19","16"], ans:1, fact:"Prime numbers series. Next prime after 13 is 17."},
  {q:"1, 1, 2, 3, 5, 8, 13, next?", opts:["18","21","20","19"], ans:1, fact:"Fibonacci series: each number = sum of previous two. 8+13=21."},
  {q:"3, 6, 12, 24, 48, next?", opts:["72","96","84","100"], ans:1, fact:"Geometric series multiply by 2 each time. 48 x 2 = 96."},
  {q:"5, 10, 20, ?, 80, 160", opts:["30","35","40","45"], ans:2, fact:"Multiply by 2: 5,10,20,40,80,160. Missing term is 40."},
  {q:"2, 5, 10, 17, 26, next?", opts:["35","37","38","36"], ans:1, fact:"Differences are 3,5,7,9,11 (odd numbers). 26+11=37."},
  {q:"1, 8, 27, 64, 125, next?", opts:["196","216","225","256"], ans:1, fact:"Perfect cubes: 1,8,27,64,125,216. Next is 6 cubed = 216."},
  {q:"100, 98, 94, 88, 80, next?", opts:["68","70","72","74"], ans:1, fact:"Differences are -2,-4,-6,-8,-10. So 80 - 10 = 70."},
  {q:"Find missing: 2, 3, 5, 7, 11, ?, 17", opts:["12","13","14","15"], ans:1, fact:"Prime series. Missing prime between 11 and 17 is 13."},
  {q:"4, 8, 24, 96, next?", opts:["384","288","192","480"], ans:0, fact:"Pattern: x2, x3, x4, x4. So 96 x 4 = 384."},
]""")

# SportsMastery
write_game("SportsMastery","Sports Mastery","🏆","#F97316","#EA580C","Sports GK",60,
  "Players, trophies, Olympics and records","Sports GK = easy marks in UPSC and SSC!",
  """[
  {q:"Most Olympic gold medals ever?", opts:["Usain Bolt","Michael Phelps","Carl Lewis","Mark Spitz"], ans:1, fact:"Michael Phelps: 23 gold, 28 total medals. Greatest Olympian of all time."},
  {q:"Most Cricket World Cup titles?", opts:["India","Australia","West Indies","Pakistan"], ans:1, fact:"Australia won 6 World Cups: 1987,1999,2003,2007,2015,2023. India won 1983 and 2011."},
  {q:"Durand Cup is for which sport?", opts:["Cricket","Tennis","Football","Hockey"], ans:2, fact:"Durand Cup = Asia oldest football tournament, established 1888. Named after Sir Henry Durand."},
  {q:"Flying Sikh of India?", opts:["P.T. Usha","Milkha Singh","Suresh Raina","Kapil Dev"], ans:1, fact:"Milkha Singh = Flying Sikh. Missed Olympic bronze by 1/10th second in 1960 Rome 400m race."},
  {q:"India first individual Olympic gold?", opts:["Saina Nehwal","P.V. Sindhu","Abhinav Bindra","Vishwanathan Anand"], ans:2, fact:"Abhinav Bindra: 10m Air Rifle gold at 2008 Beijing Olympics. First individual gold for India."},
  {q:"Thomas Cup is for which sport?", opts:["Tennis","Badminton","Table Tennis","Squash"], ans:1, fact:"Thomas Cup = men team badminton World Championship. Uber Cup is women equivalent."},
  {q:"Players in a Hockey team?", opts:["9","10","11","12"], ans:2, fact:"Field hockey: 11 players per side including goalkeeper. Same as cricket and football."},
  {q:"Wimbledon surface?", opts:["Clay","Hard","Grass","Carpet"], ans:2, fact:"Wimbledon = only Grand Slam on grass. French Open=clay. US Open and Australian Open=hard."},
  {q:"Most Test centuries in cricket?", opts:["Ricky Ponting","Brian Lara","Sachin Tendulkar","Virat Kohli"], ans:2, fact:"Sachin Tendulkar: 51 Test + 49 ODI = 100 international centuries. World record."},
  {q:"Love in tennis means?", opts:["50 points","Won the game","Zero score","Final set"], ans:2, fact:"Love = zero in tennis. From French l oeuf (egg shape = zero)."},
]""")

# CurrentAffairsRapid
write_game("CurrentAffairsRapid","Current Affairs","📰","#EAB308","#CA8A04","Current Affairs",90,
  "India news mapped to exam syllabus","CA = max marks with minimum effort!",
  """[
  {q:"India G20 Presidency 2023 motto?", opts:["Unity in Diversity","Vasudhaiva Kutumbakam","Jai Hind","Incredible India"], ans:1, fact:"Vasudhaiva Kutumbakam = One Earth One Family One Future. From Sanskrit Maha Upanishad text."},
  {q:"First Vande Bharat Express route?", opts:["Mumbai-Pune","Delhi-Varanasi","Chennai-Coimbatore","Kolkata-Patna"], ans:1, fact:"First Vande Bharat: Delhi-Varanasi route, February 2019. Semi-high speed at 160 km/h."},
  {q:"NEP 2020 replaced which policy?", opts:["NEP 1968","NEP 1986","NEP 1976","NEP 1992"], ans:1, fact:"NEP 2020 replaced NEP 1986. Introduced 5+3+3+4 structure replacing old 10+2 system."},
  {q:"PM Gati Shakti is related to?", opts:["Digital India","Infrastructure planning","Agriculture","Education"], ans:1, fact:"PM Gati Shakti = National Master Plan for multi-modal connectivity. Launched October 2021."},
  {q:"India first solar powered village?", opts:["Gujarat","Rajasthan","Kerala","Madhya Pradesh"], ans:0, fact:"Modhera village in Gujarat became India first 24x7 solar-powered village in October 2022."},
  {q:"Operation Ganga evacuated Indians from?", opts:["Afghanistan","Ukraine","Sudan","Libya"], ans:1, fact:"Operation Ganga (Feb-March 2022) evacuated 22,500 Indian nationals from war-affected Ukraine."},
  {q:"Chandrayaan-3 landed on Moon where?", opts:["North Pole","South Pole","Equator","Dark side"], ans:1, fact:"Chandrayaan-3 landed on Moon South Pole on August 23, 2023. India first country to achieve this."},
  {q:"UDAN scheme is for?", opts:["Drone delivery","Regional air connectivity","Urban development","Nutrition"], ans:1, fact:"UDAN = Ude Desh Ka Aam Naagrik = regional air connectivity scheme launched 2016."},
  {q:"PMFBY provides?", opts:["Farm loans","Crop insurance","Irrigation","Seeds"], ans:1, fact:"PMFBY = Pradhan Mantri Fasal Bima Yojana = crop insurance scheme launched 2016."},
  {q:"Mission Shakti for women launched by which state?", opts:["UP","Odisha","Kerala","Gujarat"], ans:1, fact:"Odisha launched Mission Shakti 2001 for women self-help groups. Later became central scheme."},
]""")

# DailyChallenge
write_game("DailyChallenge","Daily Challenge","📅","#F59E0B","#D97706","Mixed",180,
  "Fresh mixed questions every day","New questions every day at midnight!",
  """[
  {q:"Right to Education Article?", opts:["Article 19","Article 21A","Article 32","Article 44"], ans:1, fact:"Article 21A added by 86th Amendment 2002 = free and compulsory education for children 6-14 years."},
  {q:"Chemical symbol for Gold?", opts:["Go","Gd","Au","Ag"], ans:2, fact:"Au from Latin Aurum = Gold. Ag=Silver, Fe=Iron, Cu=Copper, Pb=Lead."},
  {q:"Wings of Fire author?", opts:["Manmohan Singh","APJ Abdul Kalam","Narendra Modi","Amartya Sen"], ans:1, fact:"Wings of Fire by Dr APJ Abdul Kalam published 1999. Translated into 13 languages."},
  {q:"Palk Strait separates India from?", opts:["Myanmar","Bangladesh","Sri Lanka","Maldives"], ans:2, fact:"Palk Strait separates Tamil Nadu coast from Northern Sri Lanka."},
  {q:"Vitamin produced by skin in sunlight?", opts:["Vitamin A","Vitamin B12","Vitamin C","Vitamin D"], ans:3, fact:"Vitamin D = Sunshine vitamin. UV-B rays convert cholesterol in skin to Vitamin D3."},
  {q:"India Parliament has how many houses?", opts:["1","2","3","4"], ans:1, fact:"India has bicameral Parliament: Lok Sabha (Lower House) + Rajya Sabha (Upper House)."},
  {q:"National Animal of India?", opts:["Lion","Elephant","Tiger","Leopard"], ans:2, fact:"Bengal Tiger = National Animal of India since 1973 when Project Tiger was launched."},
  {q:"First woman President of India?", opts:["Indira Gandhi","Pratibha Patil","Sonia Gandhi","Sarojini Naidu"], ans:1, fact:"Pratibha Patil = 12th President and first woman President of India (2007-2012)."},
  {q:"Great Red Spot is on which planet?", opts:["Mars","Saturn","Jupiter","Neptune"], ans:2, fact:"Jupiter Great Red Spot = massive storm larger than Earth, ongoing for more than 350 years."},
  {q:"Silicon Valley is in which US state?", opts:["Texas","New York","California","Florida"], ans:2, fact:"Silicon Valley in San Francisco Bay Area, California. Home of Apple, Google, Meta, Netflix."},
]""")

# SpeedReading
write_game("SpeedReading","Speed Reading","📖","#22C55E","#16A34A","English RC",120,
  "Reading comprehension under timer","RC = 20 to 30 percent of English section!",
  """[
  {q:"RBI was established under RBI Act 1934. When was RBI established?", opts:["1934","1935","1936","1932"], ans:1, fact:"RBI established April 1, 1935. Nationalized in 1949. Headquarters: Mumbai."},
  {q:"India is a secular nation where state has no official religion. Secular means:", opts:["Religious","Non-religious state","Ancient","Democratic"], ans:1, fact:"Secular = separation of religion from state affairs. Added to Preamble by 42nd Amendment 1976."},
  {q:"Reading between the lines means:", opts:["Read carefully","Understand hidden meaning","Read slowly","Skip lines"], ans:1, fact:"Reading between the lines = understanding implied or unstated meaning beyond literal words."},
  {q:"The bill was passed unanimously. Unanimously means:", opts:["With opposition","By majority","All agreeing","Secretly"], ans:2, fact:"Unanimously = with complete agreement. Everyone voting the same way with no dissent."},
  {q:"Proactive measures means:", opts:["Reactive","Delayed","Acting before problems arise","Forced"], ans:2, fact:"Proactive = taking action in anticipation of future problems. Opposite: reactive."},
  {q:"Landmark ruling means:", opts:["Near a landmark","Important historic ruling","Related to land","Official"], ans:1, fact:"Landmark = significant and historic, serving as a milestone or precedent for future cases."},
  {q:"Author says climate change is irreversible. Author tone is:", opts:["Optimistic","Pessimistic","Neutral","Humorous"], ans:1, fact:"Irreversible signals pessimistic tone. Identifying author tone is key in RC questions."},
  {q:"De facto means:", opts:["By law","In practice","Officially","Theoretically"], ans:1, fact:"De facto = in practice or reality. De jure = by law. Common in political science passages."},
  {q:"Students drop out due to financial constraints. Inference:", opts:["Students are lazy","Education is free","Poverty affects education","Schools are bad"], ans:2, fact:"Inference = conclusion from given info. Financial constraints directly implies poverty is a barrier."},
  {q:"Despite opposition bill was passed. Despite means:", opts:["Because of","In addition to","In spite of","As a result of"], ans:2, fact:"Despite = in spite of, even though. Shows contrast between opposition and bill being passed."},
]""")

print("All 8 games built successfully!")
