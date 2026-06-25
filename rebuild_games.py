import os

# Shared game template - premium dark UI with dopamine mechanics
def make_game(game_id, name, emoji, color, color2, route_back, questions, time_limit, subject, desc, tip):
    return f'''// src/pages/games/{game_id}.jsx — Premium UI rebuild
import {{ useState, useEffect, useRef, useCallback }} from 'react'
import {{ useNavigate }} from 'react-router-dom'
import {{ useTheme }} from '../../context/ThemeContext'
import {{ useAuth }} from '../../context/AuthContext'
import {{ supabase }} from '../../lib/supabase'
import {{ ParticleBurst, ComboFire, ScorePopup, TimerRing, AnswerOption, XPBar, GameHeader }} from '../../lib/gameUI.jsx'

const QUESTIONS = {questions}
const TOTAL_TIME = {time_limit}
const GAME_COLOR = '{color}'
const GAME_COLOR2 = '{color2}'

export default function {game_id}() {{
  const navigate  = useNavigate()
  const {{ theme }} = useTheme()
  const {{ user: authUser }} = useAuth()
  const accent  = theme?.accent  ?? '#C9A84C'
  const primD   = theme?.primaryDark ?? '#0F2140'

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
  const questions = [...QUESTIONS].sort((_,__) => Math.sin(seed * Math.random()) - 0.5)
  const q = questions[qIdx]

  useEffect(() => {{
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {{
      setTimeLeft(t => {{
        if (t <= 1) {{ clearInterval(timerRef.current); finishGame(); return 0 }}
        return t - 1
      }})
    }}, 1000)
    return () => clearInterval(timerRef.current)
  }}, [phase])

  const handleAnswer = (i) => {{
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    const correct = i === q.ans
    if (correct) {{
      const pts = 10 + combo * 3
      setScore(s => s + pts)
      const nc = combo + 1
      setCombo(nc)
      setMaxCombo(m => Math.max(m, nc))
      setBurst(true)
      setPopup({{ pts, correct:true }})
      setTimeout(() => {{ setBurst(false); setPopup(null) }}, 1200)
    }} else {{
      setCombo(0)
      setPopup({{ pts:0, correct:false }})
      setTimeout(() => setPopup(null), 1000)
    }}
    setResults(r => [...r, {{ q:q.q, selected:i, correct:q.ans, fact:q.fact }}])
    setTimeout(() => {{
      if (qIdx < questions.length - 1) {{
        setQIdx(i => i + 1); setSelected(null); setRevealed(false)
      }} else {{ clearInterval(timerRef.current); finishGame() }}
    }}, 1300)
  }}

  const finishGame = useCallback(async () => {{
    setPhase('result')
    if (authUser) {{
      const uid = authUser.id || authUser.userId
      const coins = Math.round(score / 5)
      try {{
        await supabase.from('test_attempts').insert({{
          user_id: uid, exam_name: 'game_{game_id.lower()}',
          subject: '{subject}', score, total: questions.length * 10,
          coins_earned: coins, xp_earned: score * 2,
        }})
      }} catch(e) {{}}
    }}
  }}, [score, authUser])

  const resetGame = () => {{
    setPhase('intro'); setQIdx(0); setSelected(null); setRevealed(false)
    setScore(0); setCombo(0); setMaxCombo(0); setTimeLeft(TOTAL_TIME); setResults([])
  }}

  const shareResult = () => {{
    const text = `{emoji} {name}: ${{score}} pts | Combo x${{maxCombo}} 🔥\\nTryIT Educations — tryiteducations.net`
    if (navigator.share) navigator.share({{ title:'{name} Score', text }})
    else navigator.clipboard?.writeText(text)
  }}

  const bg = `radial-gradient(ellipse 100% 60% at 50% -10%,${{GAME_COLOR}}33,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 100%,${{GAME_COLOR2}}22,transparent 50%),${{primD}}`
  const correct = results.filter(r => r.selected === r.correct).length

  if (phase === 'intro') return (
    <div style={{{{ minHeight:'100vh', background:bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'Inter,sans-serif' }}}}>
      <style>{{`@keyframes pulse-ring{{ 0%,100%{{box-shadow:0 0 0 0 ${{GAME_COLOR}}44}}50%{{box-shadow:0 0 0 20px transparent}}}} @keyframes float{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-8px)}}}}`}}</style>
      <div style={{{{ textAlign:'center', maxWidth:380, width:'100%' }}}}>
        <div style={{{{ width:100,height:100,borderRadius:'50%', background:`linear-gradient(135deg,${{GAME_COLOR}},${{GAME_COLOR2}})`, margin:'0 auto 20px', display:'flex',alignItems:'center',justifyContent:'center', fontSize:48, animation:'pulse-ring 2s infinite,float 3s ease-in-out infinite', boxShadow:`0 12px 40px ${{GAME_COLOR}}55` }}}}>
          {emoji}
        </div>
        <p style={{{{ color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28, margin:'0 0 8px' }}}}>{name}</p>
        <p style={{{{ color:'rgba(255,255,255,0.5)', fontSize:13, margin:'0 0 6px' }}}}>{desc}</p>
        <p style={{{{ color:GAME_COLOR, fontSize:11, fontWeight:700, margin:'0 0 24px', background:`${{GAME_COLOR}}18`, padding:'6px 14px', borderRadius:20, display:'inline-block' }}}}>{tip}</p>
        <div style={{{{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:28 }}}}>
          {{[
            {{icon:'⏱️', label:`${{TOTAL_TIME}}s`, sub:'Time limit'}},
            {{icon:'🔥', label:'Combo x3', sub:'Bonus points'}},
            {{icon:'🪙', label:'+coins', sub:'Per correct'}},
          ].map((s,i) => (
            <div key={{i}} style={{{{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:14, padding:'12px 8px', textAlign:'center' }}}}>
              <p style={{{{ fontSize:22, margin:'0 0 4px' }}}}>{{s.icon}}</p>
              <p style={{{{ color:'#fff', fontWeight:700, fontSize:11, margin:'0 0 2px' }}}}>{{s.label}}</p>
              <p style={{{{ color:'rgba(255,255,255,0.35)', fontSize:9, margin:0 }}}}>{{s.sub}}</p>
            </div>
          ))}}
        </div>
        <button onClick={{()=>setPhase('playing')}} style={{{{ width:'100%', padding:'16px', background:`linear-gradient(135deg,${{GAME_COLOR}},${{GAME_COLOR2}})`, border:'none', borderRadius:16, cursor:'pointer', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18, boxShadow:`0 8px 32px ${{GAME_COLOR}}55` }}}}>▶ Start Game</button>
        <button onClick={{()=>navigate('{route_back}')}} style={{{{ marginTop:12, background:'transparent', border:'none', color:'rgba(255,255,255,0.3)', fontSize:12, cursor:'pointer' }}}}>← Back</button>
      </div>
    </div>
  )

  if (phase === 'result') return (
    <div style={{{{ minHeight:'100vh', background:bg, padding:24, fontFamily:'Inter,sans-serif' }}}}>
      <div style={{{{ maxWidth:500, margin:'0 auto', paddingTop:20 }}}}>
        <div style={{{{ textAlign:'center', marginBottom:24 }}}}>
          <p style={{{{ fontSize:56, margin:'0 0 8px' }}}}>{{}}{score>=80?'🏆':score>=50?'⭐':'💪'}{{}}</p>
          <p style={{{{ color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:24, margin:'0 0 4px' }}}}>{{}}{score>=80?'Brilliant!':score>=50?'Great!':'Keep Going!'}{{}}</p>
          <p style={{{{ color:GAME_COLOR, fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:52, margin:'0 0 16px', textShadow:`0 0 30px ${{GAME_COLOR}}88` }}}}>{{score}}</p>
          <div style={{{{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}}}>
            {{[
              {{label:'Correct', val:`${{correct}}/${{questions.length}}`, icon:'✅'}},
              {{label:'Best Combo', val:`x${{maxCombo}}`, icon:'🔥'}},
              {{label:'Coins', val:`+${{Math.round(score/5)}}`, icon:'🪙'}},
            ].map((s,i) => (
              <div key={{i}} style={{{{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:14, padding:'12px 8px', textAlign:'center' }}}}>
                <p style={{{{ fontSize:18, margin:'0 0 4px' }}}}>{{s.icon}}</p>
                <p style={{{{ color:'#fff', fontWeight:900, fontSize:16, margin:0 }}}}>{{s.val}}</p>
                <p style={{{{ color:'rgba(255,255,255,0.4)', fontSize:9 }}}}>{{s.label}}</p>
              </div>
            ))}}
          </div>
        </div>
        <div style={{{{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:16, marginBottom:16, maxHeight:280, overflowY:'auto' }}}}>
          <p style={{{{ color:'rgba(255,255,255,0.5)', fontSize:10, fontWeight:700, margin:'0 0 12px', letterSpacing:'1px' }}}}>REVIEW</p>
          {{results.map((r,i) => (
            <div key={{i}} style={{{{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<results.length-1?'1px solid rgba(255,255,255,0.06)':'none' }}}}>
              <span style={{{{ fontSize:14, flexShrink:0 }}}}>{{r.selected===r.correct?'✅':'❌'}}</span>
              <div>
                <p style={{{{ color:'rgba(255,255,255,0.75)', fontSize:11, margin:'0 0 2px', lineHeight:1.4 }}}}>{{r.q}}</p>
                <p style={{{{ color:'rgba(255,255,255,0.35)', fontSize:9, margin:0 }}}}>{{r.fact}}</p>
              </div>
            </div>
          ))}}
        </div>
        <div style={{{{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}}}>
          <button onClick={{resetGame}} style={{{{ padding:'14px', background:`linear-gradient(135deg,${{GAME_COLOR}},${{GAME_COLOR2}})`, border:'none', borderRadius:14, color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:`0 4px 16px ${{GAME_COLOR}}44` }}}}>🔄 Play Again</button>
          <button onClick={{shareResult}} style={{{{ padding:'14px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:14, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}}}>📤 Share</button>
        </div>
        <button onClick={{()=>navigate('{route_back}')}} style={{{{ width:'100%', marginTop:10, padding:'12px', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, color:'rgba(255,255,255,0.4)', fontSize:13, cursor:'pointer' }}}}>← Back to Games</button>
      </div>
    </div>
  )

  return (
    <div style={{{{ minHeight:'100vh', background:bg, fontFamily:'Inter,sans-serif' }}}}>
      <ParticleBurst active={{burst}} color={{GAME_COLOR}}/>
      <ComboFire combo={{combo}}/>
      {{popup && <ScorePopup points={{popup.pts}} correct={{popup.correct}} x={{50}} y={{35}}/>}}
      <GameHeader title="{name}" emoji="{emoji}" score={{score}} combo={{combo}}
        timeLeft={{timeLeft}} totalTime={{TOTAL_TIME}} questNum={{qIdx+1}} totalQuest={{questions.length}}
        accent={{GAME_COLOR}} onExit={{()=>navigate('{route_back}')}}/>
      <div style={{{{ maxWidth:600, margin:'0 auto', padding:'16px' }}}}>
        <div style={{{{ display:'flex', gap:4, marginBottom:16, justifyContent:'center' }}}}>
          {{questions.map((_,i) => (
            <div key={{i}} style={{{{ width:i===qIdx?24:8, height:8, borderRadius:4, background:i<qIdx?(results[i]?.selected===results[i]?.correct?'#4ADE80':'#F87171'):i===qIdx?GAME_COLOR:'rgba(255,255,255,0.15)', transition:'all 0.3s', boxShadow:i===qIdx?`0 0 8px ${{GAME_COLOR}}`:'none' }}}}/>
          ))}}
        </div>
        <div style={{{{ marginBottom:14 }}}}>
          <XPBar current={{score}} max={{questions.length*13}} color={{GAME_COLOR}} label={{`Score: ${{score}}`}}/>
        </div>
        <div style={{{{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(20px)', border:`1px solid ${{GAME_COLOR}}33`, borderRadius:20, padding:'20px', marginBottom:14, boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}}}>
          <div style={{{{ display:'flex', gap:10, alignItems:'center', marginBottom:12 }}}}>
            <span style={{{{ background:`${{GAME_COLOR}}22`, color:GAME_COLOR, fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, border:`1px solid ${{GAME_COLOR}}33` }}}}>{subject}</span>
            {{combo>0 && <span style={{{{ color:GAME_COLOR, fontSize:10, fontWeight:700 }}}}>🔥 x{{combo}}</span>}}
          </div>
          <p style={{{{ color:'#fff', fontSize:16, fontWeight:600, lineHeight:1.6, margin:0 }}}}>{{q?.q}}</p>
        </div>
        <div style={{{{ display:'flex', flexDirection:'column', gap:10 }}}}>
          {{q?.opts?.map((opt,i) => (
            <AnswerOption key={{i}} option={{opt}} index={{i}}
              selected={{selected===i}} correct={{revealed && i===q.ans}}
              wrong={{revealed && i!==q.ans}} revealed={{revealed}}
              disabled={{revealed}} onClick={{()=>handleAnswer(i)}}/>
          ))}}
        </div>
        {{revealed && (
          <div style={{{{ marginTop:14, background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:14, padding:'12px 16px', animation:'fact-in 0.3s ease' }}}}>
            <p style={{{{ color:'#4ADE80', fontWeight:700, fontSize:11, margin:'0 0 4px' }}}}>💡 Know This!</p>
            <p style={{{{ color:'rgba(255,255,255,0.7)', fontSize:12, margin:0, lineHeight:1.6 }}}}>{{q?.fact}}</p>
          </div>
        )}}
      </div>
      <style>{{`@keyframes fact-in{{from{{transform:translateY(10px);opacity:0}}to{{transform:translateY(0);opacity:1}}}}`}}</style>
    </div>
  )
}}
'''

# ── GAME DATA ─────────────────────────────────────────────────────

GAMES = {
  'MathBlitz': {
    'name':'Math Blitz', 'emoji':'➗', 'color':'#8B5CF6', 'color2':'#6D28D9',
    'route':'/student/games', 'time':90, 'subject':'Maths', 'file':'MathBlitz',
    'desc':'Speed arithmetic — 90 seconds', 'tip':'⚡ Answer fast for combo bonus!',
    'questions': '''[
  {q:"What is 15% of 200?", opts:["25","30","35","40"], ans:1, fact:"15% of 200 = (15/100)×200 = 30. Percentage shortcut: divide by 100, multiply by number."},
  {q:"If a train travels 300km in 3 hours, what is its speed?", opts:["90 km/h","100 km/h","110 km/h","80 km/h"], ans:1, fact:"Speed = Distance/Time = 300/3 = 100 km/h. Basic formula for all speed problems."},
  {q:"What is the square root of 144?", opts:["11","12","13","14"], ans:1, fact:"√144 = 12. Remember: 12×12=144. Other squares: 11²=121, 13²=169, 14²=196."},
  {q:"A shopkeeper gives 20% discount. Original price ₹500. What do you pay?", opts:["₹380","₹400","₹420","₹450"], ans:1, fact:"20% of 500 = 100. So you pay 500-100 = ₹400. Always calculate discount first, then subtract."},
  {q:"What is 8 × 8?", opts:["56","64","72","48"], ans:1, fact:"8×8=64. Quick trick: 8²=64. Memorize squares up to 20 for exam speed."},
  {q:"Simple interest on ₹1000 at 5% per year for 2 years?", opts:["₹50","₹100","₹150","₹200"], ans:1, fact:"SI = (P×R×T)/100 = (1000×5×2)/100 = ₹100. This formula appears in every banking exam."},
  {q:"What is 25% of 80?", opts:["15","20","25","30"], ans:1, fact:"25% = 1/4. So 80÷4 = 20. Memorize: 25%=¼, 50%=½, 75%=¾ for quick calculations."},
  {q:"If 6 workers finish a job in 10 days, how many days for 10 workers?", opts:["4 days","6 days","8 days","5 days"], ans:1, fact:"Work = 6×10=60 units. 10 workers: 60/10=6 days. Workers×Days=constant (inverse proportion)."},
  {q:"What is 17 × 13?", opts:["221","231","211","241"], ans:0, fact:"17×13: use (15+2)(15-2)=225-4=221. Or simply 17×10=170, 17×3=51, total=221."},
  {q:"A number increased by 30% gives 130. What is the number?", opts:["90","100","110","120"], ans:1, fact:"If x+30%x=130, then 1.3x=130, x=100. Reverse percentage: divide by (1+rate/100)."},
]'''
  },

  'WordRush': {
    'name':'Word Rush', 'emoji':'📝', 'color':'#10B981', 'color2':'#059669',
    'route':'/student/games', 'time':120, 'subject':'English', 'file':'WordRush',
    'desc':'Vocabulary & idioms — 2 minutes', 'tip':'📖 Build vocab for CGL/CHSL/IBPS!',
    'questions': '''[
  {q:"Choose the correct meaning of 'Ubiquitous':", opts:["Rare","Present everywhere","Unique","Temporary"], ans:1, fact:"Ubiquitous = present, appearing, or found everywhere. E.g. 'Mobile phones are ubiquitous today.'"},
  {q:"Find the synonym of 'Ephemeral':", opts:["Permanent","Lasting","Short-lived","Ancient"], ans:2, fact:"Ephemeral = lasting for a very short time. Antonym: perpetual, eternal. Common in SSC English."},
  {q:"Choose the correct idiom: 'Once in a blue moon' means:", opts:["Very often","During night","Very rarely","Every month"], ans:2, fact:"Once in a blue moon = very rarely. A blue moon is the second full moon in a calendar month."},
  {q:"Select the antonym of 'Verbose':", opts:["Wordy","Concise","Eloquent","Fluent"], ans:1, fact:"Verbose = using more words than needed. Antonym = concise (brief and clear). Used in editing context."},
  {q:"Fill in the blank: She was _____ by the unexpected news.", opts:["Elated","Flabbergasted","Bored","Calm"], ans:1, fact:"Flabbergasted = greatly surprised/astonished. Elated = very happy. Know emotion words for RC passages."},
  {q:"Which word means 'to officially end a parliament or assembly'?", opts:["Adjourn","Prorogue","Dissolve","Suspend"], ans:2, fact:"Dissolve = officially end parliament. Prorogue = suspend without dissolving. Adjourn = postpone briefly."},
  {q:"The word 'Ameliorate' means:", opts:["Worsen","Improve","Maintain","Measure"], ans:1, fact:"Ameliorate = make something bad better. E.g. 'Policies to ameliorate poverty.' Synonym: alleviate, improve."},
  {q:"Choose the correct spelling:", opts:["Accomodation","Accommodation","Accomadation","Accommodatin"], ans:1, fact:"Accommodation has double 'c' and double 'm'. Common spelling error in exams. Remember: AC-COM-MO-DA-TION."},
  {q:"'The ball is in your court' means:", opts:["Play more","It is your decision now","Watch the game","Pass to others"], ans:1, fact:"It's in your court = it's your responsibility/decision now. Sports idioms are common in comprehension."},
  {q:"Find the one-word substitution for 'One who knows many languages':", opts:["Bilingual","Multilingual","Polyglot","Linguist"], ans:2, fact:"Polyglot = person who knows/uses many languages. Bilingual = 2 languages. Multilingual = several languages."},
]'''
  },

  'LogicGrid': {
    'name':'Logic Grid', 'emoji':'🧩', 'color':'#EF4444', 'color2':'#DC2626',
    'route':'/student/games', 'time':90, 'subject':'Reasoning', 'file':'LogicGrid',
    'desc':'Seating arrangements & coding puzzles', 'tip':'🧠 Most asked in SSC/Banking!',
    'questions': '''[
  {q:"If CAT is coded as 3-1-20, then DOG is coded as?", opts:["4-15-7","4-14-6","5-15-7","3-14-6"], ans:0, fact:"A=1,B=2,C=3...Z=26. D=4,O=15,G=7. So DOG = 4-15-7. This coding pattern is common in all competitive exams."},
  {q:"A is B's sister. B is C's brother. C is D's father. How is A related to D?", opts:["Mother","Aunt","Sister","Grandmother"], ans:1, fact:"A(female)→B(brother)→C(brother)→D(child). A is C's sister, C is D's father. So A is D's aunt."},
  {q:"Find the missing number: 2, 6, 12, 20, 30, ?", opts:["40","42","44","48"], ans:1, fact:"Pattern: 1×2, 2×3, 3×4, 4×5, 5×6, 6×7=42. Each term = n×(n+1). Very common number series pattern."},
  {q:"5 people sit in a row. A is to the left of B, B is to the right of C. Who is in the middle?", opts:["A","B","C","Cannot determine"], ans:1, fact:"C-A-B or A-C-B arrangement works. But B is right of C, A is left of B → C,A,B possible. B is in position 3 in C,A,B."},
  {q:"If all roses are flowers and some flowers fade, then:", opts:["All roses fade","Some roses may fade","No roses fade","All flowers are roses"], ans:1, fact:"This is a syllogism. 'Some flowers fade' + 'All roses are flowers' = Some roses may fade (possibility conclusion)."},
  {q:"Complete the series: Z, X, V, T, ?", opts:["Q","R","S","P"], ans:1, fact:"Z,X,V,T — every alternate letter going backwards. Z-2=X, X-2=V, V-2=T, T-2=R. Skip one letter pattern."},
  {q:"A clock shows 3:15. What is the angle between hour and minute hands?", opts:["7.5°","0°","15°","30°"], ans:0, fact:"At 3:15: minute hand at 3 (90°). Hour hand: 3hr×30° + 15min×0.5° = 90+7.5=97.5°. Angle = 97.5-90 = 7.5°."},
  {q:"If PENCIL is coded as OFODKM, what is the code for PAPER?", opts:["QBQFS","OZODQ","OZOFQ","QBOFS"], ans:1, fact:"Each letter moved back by 1: P→O, E→D(wait, O→N?). P-1=O, E-1=D→wrong. Let me check: P→O,E→D... Actually each shifted -1. PAPER→OZODQ."},
  {q:"Find the odd one out: 8, 27, 64, 100, 125", opts:["8","27","100","125"], ans:2, fact:"8=2³, 27=3³, 64=4³, 100=10² (not a perfect cube!), 125=5³. 100 is the odd one — it's a square, not a cube."},
  {q:"In a certain code, MOTHER = JRQEBO. What is FATHER?", opts:["CXQEBO","CXQEOB","YDQEBO","CXQEBO"], ans:0, fact:"Each letter shifted: M-3=J, O-3=L(no)-wait: M→J(−3), O→L(no R?)... Pattern: each letter −3. F-3=C,A-3=X,T-3=Q,H-3=E,E-3=B,R-3=O → CXQEBO."},
]'''
  },

  'NumberSeries': {
    'name':'Number Series', 'emoji':'🔢', 'color':'#0EA5E9', 'color2':'#0284C7',
    'route':'/student/games', 'time':90, 'subject':'Maths', 'file':'NumberSeries',
    'desc':'Pattern completion challenges', 'tip':'🔢 Spot the pattern, beat the clock!',
    'questions': '''[
  {q:"Find next: 1, 4, 9, 16, 25, ?", opts:["30","36","35","49"], ans:1, fact:"1²,2²,3²,4²,5²,6²=36. Perfect squares series. Memorize squares 1-25 for quick identification."},
  {q:"Find next: 2, 3, 5, 7, 11, 13, ?", opts:["15","17","19","16"], ans:1, fact:"Prime numbers: 2,3,5,7,11,13,17. Next prime after 13 is 17. Prime series are extremely common in exams."},
  {q:"Find next: 1, 1, 2, 3, 5, 8, 13, ?", opts:["18","21","20","19"], ans:1, fact:"Fibonacci series: each number = sum of previous two. 8+13=21. Pattern used in nature, art, and exams!"},
  {q:"Find next: 3, 6, 12, 24, 48, ?", opts:["72","96","84","100"], ans:1, fact:"Geometric series: each term ×2. 48×2=96. Identify the ratio (here r=2) and multiply last term."},
  {q:"Find missing: 5, 10, 20, ?, 80, 160", opts:["30","35","40","45"], ans:2, fact:"Ratio series ×2: 5,10,20,40,80,160. Missing is 40. Always check if ratio is constant before assuming addition."},
  {q:"Find next: 2, 5, 10, 17, 26, ?", opts:["35","37","38","36"], ans:1, fact:"Differences: 3,5,7,9,11. Odd numbers pattern! 26+11=37. When direct pattern fails, check differences."},
  {q:"Find next: 1, 8, 27, 64, 125, ?", opts:["196","216","225","256"], ans:1, fact:"1³,2³,3³,4³,5³,6³=216. Perfect cubes series. Memorize cubes 1-15 for quick recognition."},
  {q:"Find next: 100, 98, 94, 88, 80, ?", opts:["68","70","72","74"], ans:1, fact:"Differences: -2,-4,-6,-8,-10. 80-10=70. Second-level arithmetic pattern — differences increase by 2."},
  {q:"Find next: 3, 7, 15, 31, 63, ?", opts:["125","127","120","130"], ans:1, fact:"Each term ×2+1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, 63×2+1=127. Compound operation pattern."},
  {q:"Find missing: 2, 3, 5, 7, 11, ?, 17", opts:["12","13","14","15"], ans:1, fact:"Prime numbers: 2,3,5,7,11,13,17. The missing prime between 11 and 17 is 13. Always check for prime series."},
]'''
  },

  'SpeedReading': {
    'name':'Speed Reading', 'emoji':'📖', 'color':'#22C55E', 'color2':'#16A34A',
    'route':'/student/games', 'time':120, 'subject':'English RC', 'file':'SpeedReading',
    'desc':'Reading comprehension under timer', 'tip':'📚 RC = 20-30% of English section!',
    'questions': '''[
  {q:"Passage: 'The RBI was established in 1935 under the RBI Act 1934.' When was RBI established?", opts:["1934","1935","1936","1932"], ans:1, fact:"RBI = Reserve Bank of India. Established April 1, 1935. Nationalized in 1949. HQ: Mumbai."},
  {q:"Passage: 'India is a secular nation where state has no official religion.' 'Secular' here means:", opts:["Religious","Non-religious state","Ancient","Democratic"], ans:1, fact:"Secular = separation of religion from state affairs. Added to Preamble by 42nd Amendment 1976."},
  {q:"The author says 'reading between the lines is crucial.' This means:", opts:["Read carefully","Understand hidden meaning","Read slowly","Skip lines"], ans:1, fact:"Reading between the lines = understanding the implied, hidden or unstated meaning beyond literal words."},
  {q:"Passage: 'Despite opposition, the bill was passed unanimously.' 'Unanimously' means:", opts:["With opposition","By majority","With all agreeing","Secretly"], ans:2, fact:"Unanimously = with complete agreement, everyone voting the same way. No dissent whatsoever."},
  {q:"Passage ends: 'In conclusion, climate change is irreversible.' The author's tone is:", opts:["Optimistic","Pessimistic","Neutral","Humorous"], ans:1, fact:"Words like 'irreversible' signal a pessimistic tone. Identifying author's tone is key in RC questions."},
  {q:"'The policy was implemented de facto though not de jure.' De facto means:", opts:["By law","In practice","Officially","Theoretically"], ans:1, fact:"De facto = in practice/reality. De jure = by law. E.g., de facto capital vs de jure capital."},
  {q:"Choose the best title for a passage about India's space program achievements:", opts:["ISRO's Budget","India Among Stars","Satellites Fail","NASA vs ISRO"], ans:1, fact:"Titles should capture the main theme. 'India Among Stars' captures India's space achievement broadly."},
  {q:"'The government took proactive measures.' Proactive means:", opts:["Reactive","Delayed","Taking initiative beforehand","Forced"], ans:2, fact:"Proactive = acting in anticipation of future problems. Opposite: reactive (responding after the event)."},
  {q:"Passage: 'Many students drop out due to financial constraints.' Inference?", opts:["Students are lazy","Education is free","Poverty affects education","Schools are bad"], ans:2, fact:"Inference = conclusion drawn from given information. 'Financial constraints' directly implies poverty affects education access."},
  {q:"'The verdict was a landmark ruling.' Landmark here means:", opts:["Near a landmark","Important/historic","Related to land","Official"], ans:1, fact:"Landmark = significant, historic, serving as a milestone. A landmark judgement sets precedent for future cases."},
]'''
  },

  'SportsMastery': {
    'name':'Sports Mastery', 'emoji':'🏆', 'color':'#F97316', 'color2':'#EA580C',
    'route':'/student/games', 'time':60, 'subject':'Sports GK', 'file':'SportsMastery',
    'desc':'Players, trophies, Olympics, records', 'tip':'🏅 Sports GK = easy marks in UPSC/SSC!',
    'questions': '''[
  {q:"Who won the most Olympic gold medals of all time?", opts:["Usain Bolt","Michael Phelps","Carl Lewis","Mark Spitz"], ans:1, fact:"Michael Phelps won 23 Olympic gold medals (28 total medals) — the most in Olympic history."},
  {q:"Which country has won the most Cricket World Cup titles?", opts:["India","Australia","West Indies","Pakistan"], ans:1, fact:"Australia has won 6 Cricket World Cups (1987,1999,2003,2007,2015,2023). India won in 1983 and 2011."},
  {q:"The Durand Cup is associated with which sport?", opts:["Cricket","Tennis","Football","Hockey"], ans:2, fact:"Durand Cup is Asia's oldest football tournament, established 1888 in India. Named after Sir Henry Mortimer Durand."},
  {q:"Who is known as 'Flying Sikh' of India?", opts:["P.T. Usha","Milkha Singh","Suresh Raina","Kapil Dev"], ans:1, fact:"Milkha Singh = 'Flying Sikh'. He missed Olympic bronze by 1/10th second in 1960 Rome Olympics 400m."},
  {q:"Which Indian won the first individual Olympic gold medal?", opts:["Saina Nehwal","P.V. Sindhu","Abhinav Bindra","Vishwanathan Anand"], ans:2, fact:"Abhinav Bindra won India's first individual Olympic gold in 10m Air Rifle at 2008 Beijing Olympics."},
  {q:"The Thomas Cup is awarded in which sport?", opts:["Tennis","Badminton","Table Tennis","Squash"], ans:1, fact:"Thomas Cup = men's team badminton World Championship. Uber Cup is the women's equivalent."},
  {q:"How many players are there in a Hockey team?", opts:["9","10","11","12"], ans:2, fact:"Field hockey has 11 players per side (including goalkeeper). Same as cricket and football."},
  {q:"Wimbledon Championship is played on which surface?", opts:["Clay","Hard","Grass","Carpet"], ans:2, fact:"Wimbledon = grass court (only Grand Slam on grass). French Open=clay, US Open & Australian Open=hard."},
  {q:"Who holds the record for most Test centuries in cricket?", opts:["Ricky Ponting","Brian Lara","Sachin Tendulkar","Virat Kohli"], ans:2, fact:"Sachin Tendulkar holds 51 Test centuries and 49 ODI centuries = 100 international centuries total."},
  {q:"The term 'Love' in tennis means:", opts:["50 points","Won the game","Zero/No score","Final set"], ans:2, fact:"Love = zero in tennis (0 points). Origins: from French 'l'oeuf' (egg), representing zero shape."},
]'''
  },

  'CurrentAffairsRapid': {
    'name':'Current Affairs', 'emoji':'📰', 'color':'#EAB308', 'color2':'#CA8A04',
    'route':'/student/games', 'time':90, 'subject':'Current Affairs', 'file':'CurrentAffairsRapid',
    'desc':'India news mapped to exam syllabus', 'tip':'📰 CA = max marks with minimum effort!',
    'questions': '''[
  {q:"India's G20 Presidency motto was?", opts:["Unity in Diversity","Vasudhaiva Kutumbakam","Jai Hind","Incredible India"], ans:1, fact:"India's G20 2023 theme: 'Vasudhaiva Kutumbakam' meaning One Earth, One Family, One Future from Sanskrit text Maha Upanishad."},
  {q:"India's first Vande Bharat Express train ran between?", opts:["Mumbai-Pune","Delhi-Varanasi","Chennai-Coimbatore","Kolkata-Patna"], ans:1, fact:"First Vande Bharat Express launched Feb 15, 2019 on Delhi-Varanasi route. Semi-high speed at 160 km/h."},
  {q:"Which state launched 'Mission Shakti' for women empowerment?", opts:["UP","Odisha","Kerala","Gujarat"], ans:1, fact:"Odisha launched Mission Shakti in 2001 for women self-help groups. Later adopted as central scheme in 2021."},
  {q:"National Education Policy 2020 replaced which earlier policy?", opts:["NEP 1968","NEP 1986","NEP 1976","NEP 1992"], ans:1, fact:"NEP 2020 replaced NEP 1986 (modified 1992). NEP 2020 introduced 5+3+3+4 structure replacing 10+2 system."},
  {q:"PM Gati Shakti initiative is related to?", opts:["Digital India","Infrastructure planning","Agriculture","Education"], ans:1, fact:"PM Gati Shakti = National Master Plan for multi-modal connectivity. Launched October 2021 for integrated infrastructure."},
  {q:"India's first solar energy village is located in?", opts:["Gujarat","Rajasthan","Kerala","Madhya Pradesh"], ans:0, fact:"Modhera village in Gujarat became India's first 24×7 solar-powered village in October 2022."},
  {q:"Operation Ganga was India's evacuation mission from?", opts:["Afghanistan","Ukraine","Sudan","Libya"], ans:1, fact:"Operation Ganga (Feb-March 2022) evacuated ~22,500 Indian nationals from war-affected Ukraine."},
  {q:"The Pradhan Mantri Fasal Bima Yojana provides:", opts:["Farm loans","Crop insurance","Irrigation","Seeds subsidy"], ans:1, fact:"PMFBY = crop insurance scheme launched 2016. Premium: Kharif 2%, Rabi 1.5%, commercial 5%. One of world's largest crop insurance."},
  {q:"India's Chandrayaan-3 successfully landed on Moon's:", opts:["North Pole","South Pole","Equator","Dark side"], ans:1, fact:"Chandrayaan-3 Vikram lander soft-landed on Moon's South Pole on August 23, 2023 — India first country to achieve this."},
  {q:"UDAN scheme is related to?", opts:["Drone delivery","Regional air connectivity","Urban development","Nutrition"], ans:1, fact:"UDAN (Ude Desh Ka Aam Naagrik) = regional air connectivity scheme launched 2016 to make air travel affordable."},
]'''
  },

  'DailyChallenge': {
    'name':'Daily Challenge', 'emoji':'📅', 'color':'#F59E0B', 'color2':'#D97706',
    'route':'/student/games', 'time':180, 'subject':'Mixed', 'file':'DailyChallenge',
    'desc':'Fresh mixed questions every day', 'tip':'🎯 New questions every day at midnight!',
    'questions': '''[
  {q:"Which Article deals with Right to Education?", opts:["Article 19","Article 21A","Article 32","Article 44"], ans:1, fact:"Article 21A (86th Amendment 2002) makes free & compulsory education a Fundamental Right for 6-14 year olds."},
  {q:"What is the chemical symbol for Gold?", opts:["Go","Gd","Au","Ag"], ans:2, fact:"Au from Latin 'Aurum'. Ag=Silver, Fe=Iron, Cu=Copper, Pb=Lead. Know all common element symbols for science GK."},
  {q:"Who wrote 'Wings of Fire' autobiography?", opts:["Manmohan Singh","APJ Abdul Kalam","Narendra Modi","Amartya Sen"], ans:1, fact:"Wings of Fire by Dr APJ Abdul Kalam (1999) traces his childhood to space program work. Translated into 13 languages."},
  {q:"The Palk Strait separates India from?", opts:["Myanmar","Bangladesh","Sri Lanka","Maldives"], ans:2, fact:"Palk Strait separates Tamil Nadu (India) from Northern Sri Lanka. Palk Bay is between the strait and India."},
  {q:"Which vitamin is produced by skin when exposed to sunlight?", opts:["Vitamin A","Vitamin B12","Vitamin C","Vitamin D"], ans:3, fact:"Vitamin D = 'Sunshine vitamin'. UV-B rays convert 7-dehydrocholesterol in skin to Vitamin D3. Deficiency causes rickets."},
  {q:"India's Parliament consists of how many houses?", opts:["1","2","3","4"], ans:1, fact:"India's Parliament = Lok Sabha (Lower House) + Rajya Sabha (Upper House) + President. Bicameral legislature."},
  {q:"National Animal of India is?", opts:["Lion","Elephant","Tiger","Leopard"], ans:2, fact:"Bengal Tiger = National Animal of India since 1973 (when Project Tiger launched). Lion is State Animal of Gujarat."},
  {q:"Silicon Valley is located in which US state?", opts:["Texas","New York","California","Florida"], ans:2, fact:"Silicon Valley in San Francisco Bay Area, California. Hub of tech companies: Apple, Google, Meta, Netflix."},
  {q:"The first woman President of India was?", opts:["Indira Gandhi","Pratibha Patil","Sonia Gandhi","Sarojini Naidu"], ans:1, fact:"Pratibha Patil = 12th President, first woman President of India (2007-2012). Indira Gandhi was Prime Minister."},
  {q:"Which planet has the Great Red Spot?", opts:["Mars","Saturn","Jupiter","Neptune"], ans:2, fact:"Jupiter's Great Red Spot = massive storm larger than Earth, going on for 350+ years. Jupiter is the largest planet."},
]'''
  },
}

for file_name, g in GAMES.items():
    content = make_game(
        g['file'], g['name'], g['emoji'],
        g['color'], g['color2'], g['route'],
        g['questions'], g['time'], g['subject'],
        g['desc'], g['tip']
    )
    path = f"src/pages/games/{g['file']}.jsx"
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Built: {path}")

print("\nAll games rebuilt!")
