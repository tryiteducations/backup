import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { getGameQuestions, calcGameXP, getGameConfig } from '../../lib/gameEngine'
import { rewardGame } from '../../lib/coinVault'

export default function MathBlitz() {
  const navigate       = useNavigate()
  const { user }       = useAuth()
  const { earn, balance } = useCoins()
  const [phase,   setPhase]  = useState('intro')
  const [qs,      setQs]     = useState([])
  const [qi,      setQi]     = useState(0)
  const [score,   setScore]  = useState(0)
  const [timeLeft,setTime]   = useState(60)
  const [chosen,  setChosen] = useState(null)
  const [streak,  setStreak] = useState(0)
  const [lastOk,  setLastOk] = useState(null)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const timerRef = useRef(null)

  const level     = user?.level || 1
  const targetExam = localStorage.getItem('selected_exam') || 'SSC CGL'
  const config    = getGameConfig(level)
  const TOTAL     = config.totalQuestions

  const start = () => {
    const questions = getGameQuestions({ gameType:'math', level, targetExam, count:TOTAL })
    setQs(questions); setQi(0); setScore(0); setTime(60)
    setStreak(0); setCoinsEarned(0); setPhase('play')
  }

  useEffect(() => {
    if (phase!=='play') return
    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t<=1) { clearInterval(timerRef.current); finish(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const finish = async (finalScore=score) => {
    clearInterval(timerRef.current)
    const isPerfect = finalScore >= TOTAL * 10
    const result = await rewardGame({ score: finalScore, isPerfect, userId: user?.id, gameName: 'Math Blitz' })
    if (result) {
      setCoinsEarned(result.coins)
      earn({ source:'game', amount: result.coins, description:`Math Blitz — ${finalScore} pts` })
    }
    setPhase('result')
  }

  const pick = (val) => {
    if (chosen !== null || qi >= qs.length) return
    const q   = qs[qi]
    const ans = q.options?.[q.ans] ?? q.ans
    const right = String(val) === String(ans)
    setChosen(val); setLastOk(right)
    if (right) { setScore(s => s + (streak>=2?15:10)); setStreak(s=>s+1) }
    else setStreak(0)
    setTimeout(() => {
      setChosen(null); setLastOk(null)
      if (qi+1 >= TOTAL) finish()
      else setQi(i=>i+1)
    }, 600)
  }

  const pct = qi >= qs.length ? 100 : (qi / TOTAL) * 100
  const q   = qs[qi]

  if (phase==='intro') return (
    <AppLayout>
      <div style={{ maxWidth:440, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:60, marginBottom:14 }}>⚡</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:28, marginBottom:8 }}>Math Blitz</h1>
        <div style={{ background:'linear-gradient(135deg,rgba(30,58,95,0.06),rgba(212,175,55,0.04))', borderRadius:18, padding:16, marginBottom:20, border:'1.5px solid rgba(212,175,55,0.2)' }}>
          <p style={{ color:'#1E3A5F', fontWeight:700, fontSize:14, marginBottom:6 }}>
            {level <= 1 ? '🔰 Beginner Mode' : `⚡ ${config.label} Mode — ${targetExam} Specific`}
          </p>
          <p style={{ color:'#64748B', fontSize:13, lineHeight:1.6 }}>
            {level <= 1
              ? 'Generic questions to get you started. Reach Level 2 for exam-specific practice!'
              : `Questions tailored for ${targetExam}. Every correct answer sharpens your exam skills.`
            }
          </p>
          {level > 1 && (
            <p style={{ color:'#D4AF37', fontSize:12, fontWeight:600, marginTop:6 }}>
              🎯 Exam-specific · {config.totalQuestions} questions · {config.timePerQuestion}s each
            </p>
          )}
        </div>
        <div style={{ background:'#F8FAFC', borderRadius:16, padding:14, marginBottom:20, textAlign:'left', border:'1.5px solid #E2E8F0' }}>
          {[`${TOTAL} questions · 60 seconds`,`Streak bonus: 3+ correct = +5 per Q`,`Earn ${Math.round(TOTAL*0.8)} coins on good score`,level>1?`Level ${level}: ${config.hint}`:'Hints shown for hard questions'].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
              <span style={{ color:'#D4AF37' }}>▸</span>
              <span style={{ color:'#475569', fontSize:13 }}>{r}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ color:'#64748B', fontSize:13 }}>Your balance: 🪙 {balance}</span>
          <span style={{ color:'#1E3A5F', fontSize:13, fontWeight:700 }}>Level {level} — {config.label}</span>
        </div>
        <button onClick={start} style={{ width:'100%', padding:16, borderRadius:16, border:'none', background:'linear-gradient(135deg,#EF4444,#DC2626)', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', cursor:'pointer', boxShadow:'0 6px 20px rgba(239,68,68,0.4)' }}>
          ⚡ Start!
        </button>
      </div>
    </AppLayout>
  )

  if (phase==='result') return (
    <AppLayout>
      <div style={{ maxWidth:420, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>{score>=70?'🏆':score>=40?'⭐':'😤'}</div>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:26, marginBottom:16 }}>
          {score>=70?'Blazing! 🔥':score>=40?'Nice work! 💪':'Keep going! 📈'}
        </h2>
        {coinsEarned > 0 && (
          <div style={{ background:'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))', border:'1.5px solid rgba(212,175,55,0.3)', borderRadius:18, padding:16, marginBottom:16 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:28 }}>+{coinsEarned} 🪙</p>
            <p style={{ color:'#64748B', fontSize:13 }}>Added to your wallet · Balance: {balance}</p>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[['Score',score],['Questions',`${qi}/${TOTAL}`],['Best Streak',`${streak}x`],['XP',`+${calcGameXP({score,level,isPerfect:score>=TOTAL*10})}`]].map(([l,v])=>(
            <div key={l} style={{ background:'#F8FAFC', borderRadius:14, padding:14, border:'1.5px solid #E2E8F0' }}>
              <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:22 }}>{v}</p>
            </div>
          ))}
        </div>
        {level <= 1 && (
          <div style={{ background:'#EFF6FF', borderRadius:14, padding:12, marginBottom:14, border:'1px solid #BFDBFE' }}>
            <p style={{ color:'#1E40AF', fontSize:13 }}>💡 Reach Level 2 to unlock <strong>{targetExam}-specific</strong> questions!</p>
          </div>
        )}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={start} style={{ flex:1, padding:13, borderRadius:14, border:'none', background:'linear-gradient(135deg,#EF4444,#DC2626)', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, cursor:'pointer' }}>⚡ Play Again</button>
          <button onClick={()=>navigate('/games')} style={{ flex:1, padding:13, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>All Games</button>
        </div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div style={{ maxWidth:460, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background: timeLeft<=10?'#EF4444':timeLeft<=20?'#F59E0B':'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18 }}>{timeLeft}</div>
          <div style={{ display:'flex', gap:4 }}>
            {Array.from({length:TOTAL}).map((_,i)=>(
              <div key={i} style={{ width:Math.min(22, 300/TOTAL), height:6, borderRadius:3, background: i<qi?'#22C55E':i===qi?'#D4AF37':'#F1F5F9' }}/>
            ))}
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:18 }}>{score}</p>
            {streak>=2&&<p style={{ color:'#F97316', fontSize:11, fontWeight:700 }}>🔥{streak}x</p>}
          </div>
        </div>

        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:22, padding:28, marginBottom:18, textAlign:'center', position:'relative' }}>
          {level > 1 && <span style={{ position:'absolute', top:10, right:12, background:'rgba(212,175,55,0.2)', color:'#D4AF37', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>{targetExam}</span>}
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginBottom:6 }}>Q {qi+1} / {TOTAL}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:'clamp(16px,3vw,26px)', lineHeight:1.4 }}>{q?.q}</p>
          {q?.hint && level<=2 && config.hint.includes('shown') && (
            <p style={{ color:'rgba(212,175,55,0.6)', fontSize:11, marginTop:8 }}>💡 {q.hint}</p>
          )}
          {lastOk===true&&<p style={{ color:'#4ADE80', fontWeight:700, fontSize:15, marginTop:8 }}>✓ {streak>=2?'Streak! 🔥':''}</p>}
          {lastOk===false&&<p style={{ color:'#F87171', fontWeight:700, fontSize:15, marginTop:8 }}>✗</p>}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {(q?.options||[]).map((opt,i)=>{
            const ans    = q.options?.[q.ans] ?? q.ans
            const right  = chosen!==null && String(opt)===String(ans)
            const wrong  = String(chosen)===String(opt) && !right
            return (
              <button key={i} onClick={()=>pick(opt)} disabled={chosen!==null}
                style={{ padding:'18px 10px', borderRadius:16, border:'none', cursor: chosen!==null?'not-allowed':'pointer',
                  background: right?'#22C55E':wrong?'#EF4444':'#fff',
                  color: right||wrong?'#fff':'#1E3A5F',
                  fontFamily:'Poppins,sans-serif', fontWeight:700,
                  fontSize:'clamp(14px,2.5vw,20px)',
                  boxShadow: right?'0 4px 14px rgba(34,197,94,0.4)':wrong?'0 4px 14px rgba(239,68,68,0.4)':'0 2px 8px rgba(0,0,0,0.06)',
                  transition:'all 0.15s' }}>
                {String(opt)}
              </button>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
