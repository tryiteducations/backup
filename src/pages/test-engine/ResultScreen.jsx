import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { processTestResult, DEDUCTION_RULES, getBalance } from '../../lib/coinVault'

export default function ResultScreen() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useAuth()
  const { balance } = useCoins()
  const [result,  setResult]  = useState(null)
  const [animate, setAnimate] = useState(false)

  const data = location.state || {
    score:78, correct:39, incorrect:8, skipped:3,
    total:50, examName:'SSC CGL Mock', time:'42:18',
    examType:'default', subject:'Mixed',
  }

  useEffect(() => {
    async function processResult() {
      const r = await processTestResult({
        score:      data.score,
        examName:   data.examName,
        examType:   data.examType || 'default',
        userId:     user?.id,
      })
      setResult(r)
      setTimeout(() => setAnimate(true), 300)
    }
    processResult()
  }, [])

  const pct      = data.score
  const passed   = result?.passed ?? pct >= 70
  const grade    = pct>=90?'A+':pct>=80?'A':pct>=70?'B':pct>=60?'C':'F'
  const gradeColor = pct>=70?'#22C55E':pct>=60?'#F59E0B':'#EF4444'

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', padding:'20px 16px' }}>
      <div style={{ maxWidth:560, margin:'0 auto' }}>

        {/* Score card */}
        <div style={{
          background: passed
            ? 'linear-gradient(135deg,#1E3A5F,#0F2140)'
            : 'linear-gradient(135deg,#7F1D1D,#991B1B)',
          borderRadius:28, padding:28, marginBottom:16,
          border: `1.5px solid ${passed?'rgba(212,175,55,0.3)':'rgba(239,68,68,0.3)'}`,
          textAlign:'center', position:'relative', overflow:'hidden',
        }}>
          {/* Grade circle */}
          <div style={{ width:96, height:96, borderRadius:'50%',
            background: passed?'rgba(212,175,55,0.15)':'rgba(239,68,68,0.15)',
            border:`3px solid ${gradeColor}`, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color:gradeColor, fontSize:32, lineHeight:1 }}>{grade}</span>
          </div>

          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginBottom:4 }}>{data.examName}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            color:'#fff', fontSize:52, lineHeight:1, marginBottom:8 }}>
            {pct.toFixed(1)}%
          </p>
          <p style={{ color: passed?'#4ADE80':'#FCA5A5', fontSize:16, fontWeight:700 }}>
            {passed ? '✅ Passed! Great work!' : `❌ Below ${result?.minPct || 70}% minimum`}
          </p>
        </div>

        {/* COIN RESULT — earn or deduction */}
        {result && (
          <div style={{
            background: result.passed?'#DCFCE7':'#FEE2E2',
            border: `1.5px solid ${result.passed?'#22C55E':'#EF4444'}`,
            borderRadius:20, padding:18, marginBottom:16,
            display:'flex', alignItems:'center', gap:14,
          }}>
            <span style={{ fontSize:40 }}>🪙</span>
            <div style={{ flex:1 }}>
              {result.passed ? (
                <>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                    color:'#15803D', fontSize:22 }}>
                    +{result.earnedCoins} coins earned!
                  </p>
                  <p style={{ color:'#166534', fontSize:13, marginTop:2 }}>
                    Scored above {result.minPct}% minimum · Balance: {result.balance} 🪙
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                    color:'#991B1B', fontSize:22 }}>
                    -{result.deducted} coins deducted
                  </p>
                  <p style={{ color:'#991B1B', fontSize:13, marginTop:2 }}>
                    Scored below {result.minPct}% minimum · Balance: {result.balance} 🪙
                  </p>
                  {result.balance < -100 && (
                    <p style={{ color:'#DC2626', fontSize:12, fontWeight:700, marginTop:6 }}>
                      ⚠️ Balance very low. Earn coins or buy a pack to continue.
                    </p>
                  )}
                </>
              )}
            </div>
            {!result.passed && (
              <button onClick={()=>navigate('/wallet')}
                style={{ background:'#EF4444', border:'none', borderRadius:12,
                  padding:'8px 14px', color:'#fff', fontFamily:'Poppins,sans-serif',
                  fontWeight:700, fontSize:12, cursor:'pointer', flexShrink:0 }}>
                Buy Coins
              </button>
            )}
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)',
          gap:10, marginBottom:16 }}>
          {[
            ['✅',data.correct,   'Correct',   '#22C55E'],
            ['❌',data.incorrect, 'Incorrect', '#EF4444'],
            ['⏭️',data.skipped,   'Skipped',   '#F59E0B'],
            ['⏱️',data.time,      'Time',      '#8B5CF6'],
          ].map(([e,v,l,c])=>(
            <div key={l} style={{ background:'#fff', borderRadius:18,
              padding:'14px 12px', textAlign:'center',
              border:'1.5px solid #E2E8F0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize:24 }}>{e}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                color:c, fontSize:24 }}>{v}</p>
              <p style={{ color:'#94A3B8', fontSize:12 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Rank improvement */}
        <div style={{ background:'#fff', borderRadius:20, padding:18,
          marginBottom:16, border:'1.5px solid #E2E8F0' }}>
          <div style={{ display:'flex', justifyContent:'space-between',
            alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <div>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                color:'#1E3A5F', fontSize:16 }}>All-India Rank</p>
              <p style={{ color:'#94A3B8', fontSize:12 }}>Updated after this test</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ textAlign:'center' }}>
                <p style={{ color:'#94A3B8', fontSize:11 }}>Before</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                  color:'#64748B', fontSize:18 }}>#{user?.rank?.toLocaleString() || '1,243'}</p>
              </div>
              <span style={{ color:'#D4AF37', fontSize:24 }}>→</span>
              <div style={{ textAlign:'center' }}>
                <p style={{ color:'#94A3B8', fontSize:11 }}>After</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                  color:passed?'#22C55E':'#EF4444', fontSize:18 }}>
                  #{passed
                    ? ((user?.rank || 1243) - Math.floor(pct/5)).toLocaleString()
                    : ((user?.rank || 1243) + Math.floor((100-pct)/5)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={()=>navigate('/test-engine/review', { state:data })}
            style={{ padding:14, borderRadius:14, border:'none',
              background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
              color:'#D4AF37', fontFamily:'Poppins,sans-serif',
              fontWeight:700, fontSize:15, cursor:'pointer' }}>
            📖 Review Answers
          </button>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={()=>navigate('/test-engine')}
              style={{ flex:1, padding:13, borderRadius:14,
                border:'1.5px solid #E2E8F0', background:'#fff',
                color:'#64748B', fontFamily:'Poppins,sans-serif',
                fontWeight:600, fontSize:14, cursor:'pointer' }}>
              Try Again
            </button>
            <button onClick={()=>navigate('/dashboard')}
              style={{ flex:1, padding:13, borderRadius:14, border:'none',
                background:'linear-gradient(135deg,#D4AF37,#E8C44A)',
                color:'#1E3A5F', fontFamily:'Poppins,sans-serif',
                fontWeight:700, fontSize:14, cursor:'pointer' }}>
              Dashboard →
            </button>
          </div>
          {!result?.passed && (
            <button onClick={()=>navigate('/wallet')}
              style={{ padding:13, borderRadius:14, border:'none',
                background:'linear-gradient(135deg,#EF4444,#DC2626)',
                color:'#fff', fontFamily:'Poppins,sans-serif',
                fontWeight:700, fontSize:14, cursor:'pointer' }}>
              🪙 Buy Coins to Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
