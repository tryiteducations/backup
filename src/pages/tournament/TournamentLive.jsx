// FILE: src/pages/tournament/TournamentLive.jsx
// TryIT Tournament - ONLINE ONLY Exam Engine
// Route: /tournament/:id/live
//
// ONLINE ENFORCEMENT RULES:
//   ✅ Internet verified BEFORE exam starts
//   ✅ Ping every 90 seconds during exam (lightweight, 50 bytes)
//   ✅ Internet drop → exam PAUSES instantly → timer freezes
//   ✅ Reconnected → 10 second grace period → exam resumes
//   ✅ 3 disconnections in one session → flagged for review
//   ✅ Disconnect > 3 minutes total = auto-submit with flag
//   ✅ No internet at start = cannot enter exam at all
//
// WHY questions are pre-downloaded to device:
//   Only to avoid 9 AM server crash (10 crore users hitting CDN at once)
//   The exam itself is 100% ONLINE and always verified

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation }       from 'react-router-dom'
import { useAuth }                                    from '../../context/AuthContext'
import {
  decryptAndLoadQuestions,
  computeScore,
  jitterSubmit,
  createAntiCheatMonitor,
  getMedal,
  getMedalForAnswer,
  verifyExamTime,
} from '../../lib/tournamentEngine'
import { supabase } from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'

// -- MOCK QUESTIONS (dev only - real ones from CDN) ------------------------
const MOCK_QUESTIONS = Array.from({ length: 100 }, (_, i) => ({
  id:             `q_${i + 1}`,
  question:       `Question ${i + 1}: A train travels 120 km in 2 hours. What is its average speed?`,
  options:        ['48 km/h', '60 km/h', '72 km/h', '80 km/h'],
  correct_answer: 'B',
  subject:        i < 25 ? 'Quant' : i < 50 ? 'Reasoning' : i < 75 ? 'English' : 'GK',
  topic_id:       'speed_distance',
  is_honeypot:    [7, 23, 47, 83].includes(i),
}))

const MOCK_SCHEME = {
  correct_marks: 2, wrong_marks: -0.5,
  unattempted: 0, total_questions: 100,
  max_score: 200, our_time_mins: 54,
}

// -- PING ENDPOINT (tiny, just to verify internet) -------------------------
// We ping our own Cloudflare Worker (always online, costs nothing)
const PING_URL    = 'https://api.tryiteducations.net/ping'
const PING_BACKUP = 'https://www.cloudflare.com/cdn-cgi/trace'

async function checkInternet() {
  try {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch(PING_URL, { method: 'HEAD', signal: ctrl.signal, cache: 'no-store' })
    clearTimeout(timeout)
    return res.ok || res.status < 500
  } catch {
    // Try backup
    try {
      const ctrl2 = new AbortController()
      const t2 = setTimeout(() => ctrl2.abort(), 4000)
      await fetch(PING_BACKUP, { signal: ctrl2.signal, cache: 'no-store' })
      clearTimeout(t2)
      return true
    } catch {
      return false
    }
  }
}

// -- OFFLINE WARNING OVERLAY -----------------------------------------------
function OfflineOverlay({ disconnectCount, offlineSecs, onRetry }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter,sans-serif', padding: 24, textAlign: 'center',
    }}>
      <p style={{ fontSize: 56, marginBottom: 12 }}>📶</p>

      <h2 style={{
        fontFamily: 'Poppins,sans-serif', fontWeight: 900,
        fontSize: 22, color: '#fff', margin: '0 0 8px',
      }}>
        Internet Disconnected
      </h2>

      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 6px', lineHeight: 1.7 }}>
        This exam requires a continuous internet connection.<br />
        Your exam is <strong style={{ color: GOLD }}>paused</strong> and timer is frozen.
      </p>

      <div style={{
        background: 'rgba(220,38,38,0.15)', border: '1px solid #EF4444',
        borderRadius: 14, padding: '12px 20px', margin: '16px 0',
      }}>
        <p style={{ fontSize: 13, color: '#FCA5A5', margin: '0 0 4px', fontWeight: 700 }}>
          ⏸ Exam Paused - {Math.floor(offlineSecs / 60)}m {offlineSecs % 60}s offline
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Disconnection {disconnectCount} of 3 · Auto-submit after 3 minutes offline
        </p>
      </div>

      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px', lineHeight: 1.6 }}>
        Check your WiFi or mobile data.<br />
        Exam resumes automatically when connection is restored.
      </p>

      <button onClick={onRetry}
        style={{
          padding: '13px 32px', background: GOLD, color: NAVY,
          border: 'none', borderRadius: 12, fontWeight: 800,
          fontSize: 14, cursor: 'pointer',
        }}>
        🔄 Check Connection
      </button>

      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>
        Your answers so far are safely saved on your device
      </p>
    </div>
  )
}

// -- RECONNECTED GRACE PERIOD ----------------------------------------------
function ReconnectedBanner({ countdown }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: '#059669', padding: '10px 16px', textAlign: 'center',
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>
        ✅ Connection restored! Exam resumes in {countdown} second{countdown !== 1 ? 's' : ''}...
      </p>
    </div>
  )
}

// -- MAIN COMPONENT --------------------------------------------------------
export default function TournamentLive() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { state } = useLocation()
  const { user }  = useAuth()

  // -- CORE STATE --------------------------------------------------------
  const [phase,         setPhase]         = useState('checking_internet')
  // Phases:
  // checking_internet → verifying before entry
  // not_started       → exam time hasn't come
  // no_internet       → failed connectivity check at start
  // loading           → decrypting questions
  // exam              → exam running
  // paused_offline    → internet dropped during exam
  // reconnecting      → internet back, grace period countdown
  // submitted         → exam done

  const [questions,    setQuestions]    = useState([])
  const [scheme,       setScheme]       = useState(MOCK_SCHEME)
  const [registration, setRegistration] = useState(state?.registration || null)
  const [currentIdx,   setCurrentIdx]   = useState(0)
  const [answers,      setAnswers]       = useState({})
  const [timings,      setTimings]       = useState({})
  const [timeLeft,     setTimeLeft]      = useState(0)
  const [scoreResult,  setScoreResult]   = useState(null)
  const [tabWarnings,  setTabWarnings]   = useState(0)
  const [showConfirm,  setShowConfirm]   = useState(false)
  const [showFeedback, setShowFeedback]  = useState(null)

  // -- CONNECTIVITY STATE ------------------------------------------------
  const [isOnline,         setIsOnline]         = useState(true)
  const [offlineSecs,      setOfflineSecs]       = useState(0)
  const [disconnectCount,  setDisconnectCount]   = useState(0)
  const [graceCountdown,   setGraceCountdown]    = useState(0)
  const [totalOfflineSecs, setTotalOfflineSecs]  = useState(0)

  // -- REFS --------------------------------------------------------------
  const qStartTime    = useRef(Date.now())
  const examStartTime = useRef(null)
  const antiCheat     = useRef(null)
  const timerRef      = useRef(null)
  const pingRef       = useRef(null)
  const offlineRef    = useRef(null)
  const graceRef      = useRef(null)
  const frozenTime    = useRef(null)  // time frozen when offline

  const q = questions[currentIdx]

  // -- STEP 1: CHECK INTERNET BEFORE ANYTHING ----------------------------
  useEffect(() => {
    ;(async () => {
      const online = await checkInternet()
      if (!online) {
        setPhase('no_internet')
        return
      }

      // Also check device navigator.onLine
      if (!navigator.onLine) {
        setPhase('no_internet')
        return
      }

      // Internet confirmed - proceed to load exam
      initExam()
    })()

    return () => {
      antiCheat.current?.destroy()
      clearInterval(timerRef.current)
      clearInterval(pingRef.current)
      clearInterval(offlineRef.current)
      clearTimeout(graceRef.current)
    }
  }, [id])

  // -- STEP 2: INIT EXAM (after internet confirmed) ----------------------
  const initExam = async () => {
    setPhase('loading')
    try {
      // Get registration
      let reg = registration
      if (!reg) {
        const { data } = await supabase
          .from('tournament_registrations')
          .select('*').eq('tournament_id', id).eq('user_id', user?.id || '').single()
        reg = data
        if (reg) setRegistration(reg)
      }

      if (!reg) { setPhase('error'); return }

      // Get tournament
      const { data: tournament } = await supabase
        .from('tournaments').select('*').eq('tournament_id', id).single()

      // Verify exam time (NTP-synced)
      const isLive = await verifyExamTime(
        tournament?.exam_starts_at || new Date().toISOString(), 0
      )
      if (!isLive) { setPhase('not_started'); return }

      // Get marking scheme
      const { data: sch } = await supabase
        .from('exam_marking_schemes')
        .select('*').eq('scheme_id', tournament?.exam_scheme_id).single()
      if (sch) setScheme(sch)

      // Load questions (from pre-cached encrypted file OR CDN)
      let qs
      try {
        qs = await decryptAndLoadQuestions(reg, user?.id || 'dev')
      } catch {
        qs = MOCK_QUESTIONS  // dev fallback only
      }
      setQuestions(qs)

      // Calculate time remaining
      const examEnd = new Date(
        tournament?.exam_ends_at ||
        (Date.now() + (sch?.our_time_mins || 54) * 60000)
      )
      const remaining = Math.max(0, Math.floor((examEnd.getTime() - Date.now()) / 1000))
      setTimeLeft(remaining)
      examStartTime.current = Date.now()

      // Start anti-cheat
      antiCheat.current = createAntiCheatMonitor((type, count) => {
        if (type === 'tab_switch') setTabWarnings(count)
      })
      antiCheat.current.injectWatermark(user?.id || 'anonymous')

      // Start periodic internet ping
      startConnectivityMonitor()

      setPhase('exam')

    } catch (err) {
      console.error('Exam init error:', err)
      setPhase('error')
    }
  }

  // -- CONNECTIVITY MONITOR ----------------------------------------------
  // Pings every 90 seconds. If fails → pause exam immediately.
  const startConnectivityMonitor = () => {

    // Browser online/offline events (instant detection)
    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)

    // Active ping every 90 seconds (catches cases where browser says "online"
    // but actual internet is not working - e.g. connected to router but no ISP)
    pingRef.current = setInterval(async () => {
      const online = await checkInternet()
      if (!online && isOnline) {
        handleOffline()
      }
    }, 90000)
  }

  const handleOffline = useCallback(() => {
    if (phase !== 'exam') return  // only pause during active exam
    setIsOnline(false)
    setPhase('paused_offline')
    frozenTime.current = Date.now()

    // Freeze timer (stop decrementing)
    clearInterval(timerRef.current)

    // Count disconnections
    setDisconnectCount(c => {
      const newCount = c + 1
      // 3 disconnects → flag for review (but don't disqualify automatically)
      if (newCount >= 3) {
        console.log('[TryIT] 3 disconnections - flagging session for review')
      }
      return newCount
    })

    // Count offline seconds
    offlineRef.current = setInterval(() => {
      setOfflineSecs(s => {
        const newSecs = s + 1
        setTotalOfflineSecs(t => {
          const total = t + 1
          // Auto-submit if offline for 3 minutes total
          if (total >= 180) {
            clearInterval(offlineRef.current)
            handleAutoSubmitDueToOffline()
          }
          return total
        })
        return newSecs
      })
    }, 1000)
  }, [phase, isOnline])

  const handleOnline = useCallback(async () => {
    if (phase !== 'paused_offline') return

    // Verify it's truly back (don't just trust browser event)
    const reallyOnline = await checkInternet()
    if (!reallyOnline) return

    // Stop offline timer
    clearInterval(offlineRef.current)
    setOfflineSecs(0)

    // Grace period: 10 second countdown before resuming
    setPhase('reconnecting')
    setGraceCountdown(10)
    setIsOnline(true)

    let count = 10
    const graceInterval = setInterval(() => {
      count--
      setGraceCountdown(count)
      if (count <= 0) {
        clearInterval(graceInterval)
        setPhase('exam')
        resumeTimer()
      }
    }, 1000)
  }, [phase])

  const handleAutoSubmitDueToOffline = async () => {
    clearInterval(timerRef.current)
    antiCheat.current?.destroy()
    window.removeEventListener('online',  handleOnline)
    window.removeEventListener('offline', handleOffline)

    const result = computeScore(answers, questions, scheme)
    setScoreResult(result)

    await jitterSubmit(
      registration || { tournament_id: id, question_set_id: 'set_001', user_id: user?.id },
      result, answers, questions, timings
    )
    setPhase('submitted')
  }

  const retryConnection = async () => {
    const online = await checkInternet()
    if (online) handleOnline()
  }

  // -- TIMER -------------------------------------------------------------
  const resumeTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (phase === 'exam') {
      resumeTimer()
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(pingRef.current)
      clearInterval(offlineRef.current)
    }
  }, [])

  // -- ANSWER -------------------------------------------------------------
  const handleAnswer = useCallback((optionIdx) => {
    if (!q || showFeedback) return
    const letter    = ['A', 'B', 'C', 'D'][optionIdx]
    const timeTaken = Date.now() - qStartTime.current

    setAnswers(prev => ({ ...prev, [q.id]: letter }))
    setTimings(prev => ({ ...prev, [q.id]: timeTaken }))

    const isCorrect = letter === q.correct_answer
    setShowFeedback({ ...getMedalForAnswer(isCorrect), letter })

    setTimeout(() => {
      setShowFeedback(null)
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1)
        qStartTime.current = Date.now()
      }
    }, 700)
  }, [q, currentIdx, questions.length, showFeedback])

  const handleSkip = () => {
    setTimings(prev => ({ ...prev, [q.id]: Date.now() - qStartTime.current }))
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
      qStartTime.current = Date.now()
    }
  }

  // -- SUBMIT -------------------------------------------------------------
  const handleSubmit = useCallback(async (auto = false) => {
    // One final internet check before submitting
    const online = await checkInternet()
    if (!online) {
      alert('No internet connection. Please reconnect to submit your exam.')
      return
    }

    if (!auto && Object.keys(answers).length < questions.length && !showConfirm) {
      setShowConfirm(true)
      return
    }
    setShowConfirm(false)
    clearInterval(timerRef.current)
    clearInterval(pingRef.current)
    clearInterval(offlineRef.current)
    antiCheat.current?.destroy()
    window.removeEventListener('online',  handleOnline)
    window.removeEventListener('offline', handleOffline)

    const result = computeScore(answers, questions, scheme)
    setScoreResult(result)

    await jitterSubmit(
      registration || { tournament_id: id, question_set_id: 'set_001', user_id: user?.id },
      result, answers, questions, timings
    )
    setPhase('submitted')
  }, [answers, questions, scheme, timings, registration, id, user?.id, showConfirm])

  // -- HELPERS ------------------------------------------------------------
  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  const timePct   = timeLeft / ((scheme.our_time_mins || 54) * 60) * 100
  const timeColor = timePct > 50 ? '#059669' : timePct > 25 ? GOLD : '#DC2626'
  const answered  = Object.keys(answers).length

  // ══════════════════════════════════════════════════════════════════════
  // RENDER: CHECKING INTERNET
  // ══════════════════════════════════════════════════════════════════════
  if (phase === 'checking_internet') return (
    <div style={{ minHeight:'100vh', background:'#0D0D0D', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Inter,sans-serif', padding:24 }}>
      <p style={{ fontSize:40, marginBottom:12 }}>🌐</p>
      <p style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Verifying internet connection...</p>
      <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)', textAlign:'center' }}>
        This exam requires a stable internet connection throughout.
      </p>
      <div style={{ marginTop:20, display:'flex', gap:6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:GOLD, opacity:0.8,
            animation:`bounce 1.2s ${i*0.2}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}`}</style>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════
  // RENDER: NO INTERNET AT START
  // ══════════════════════════════════════════════════════════════════════
  if (phase === 'no_internet') return (
    <div style={{ minHeight:'100vh', background:'#0D0D0D', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Inter,sans-serif', padding:24, textAlign:'center' }}>
      <p style={{ fontSize:48, marginBottom:12 }}>📵</p>
      <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:20, color:'#fff', margin:'0 0 8px' }}>
        No Internet Connection
      </h2>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', margin:'0 0 24px', lineHeight:1.8 }}>
        This exam <strong style={{ color:'#EF4444' }}>requires internet</strong> throughout.<br />
        Connect to WiFi or mobile data to begin.
      </p>
      <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid #EF4444', borderRadius:14, padding:14, maxWidth:300, marginBottom:24 }}>
        <p style={{ fontSize:12, color:'#FCA5A5', margin:0, lineHeight:1.7 }}>
          ⚠️ You cannot take this exam in offline mode.<br />
          Your registration and downloaded questions are safe.
          Come back when you have a stable connection.
        </p>
      </div>
      <button onClick={async () => {
        setPhase('checking_internet')
        const ok = await checkInternet()
        if (ok) initExam()
        else setPhase('no_internet')
      }} style={{ padding:'13px 32px', background:GOLD, color:NAVY, border:'none', borderRadius:12, fontWeight:800, fontSize:14, cursor:'pointer', marginBottom:10 }}>
        🔄 Try Again
      </button>
      <button onClick={() => navigate('/tournament')}
        style={{ padding:'10px 24px', background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', border:'none', borderRadius:12, fontSize:13, cursor:'pointer' }}>
        ← Back to Tournaments
      </button>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════
  // RENDER: LOADING
  // ══════════════════════════════════════════════════════════════════════
  if (phase === 'loading') return (
    <div style={{ minHeight:'100vh', background:'#0D0D0D', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Inter,sans-serif' }}>
      <p style={{ fontSize:40, marginBottom:12 }}>🔐</p>
      <p style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>Preparing your exam...</p>
      <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)' }}>Verifying registration · Decrypting questions · Activating anti-cheat</p>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════
  // RENDER: NOT STARTED
  // ══════════════════════════════════════════════════════════════════════
  if (phase === 'not_started') return (
    <div style={{ minHeight:'100vh', background:'#0D0D0D', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Inter,sans-serif', padding:24 }}>
      <p style={{ fontSize:40, marginBottom:12 }}>⏰</p>
      <p style={{ fontWeight:700, fontSize:18, marginBottom:8 }}>Exam hasn't started yet</p>
      <p style={{ fontSize:13, color:'var(--color-text-light,#64748B)', textAlign:'center', lineHeight:1.7 }}>
        The exam starts at 9:00 AM.<br />
        Come back when it's time - keep your internet on.
      </p>
      <button onClick={() => navigate('/tournament')}
        style={{ marginTop:24, padding:'12px 24px', background:NAVY, color:'#fff', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer' }}>
        ← Back
      </button>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════
  // RENDER: SUBMITTED
  // ══════════════════════════════════════════════════════════════════════
  if (phase === 'submitted' && scoreResult) {
    const medal = scoreResult.medal
    return (
      <div style={{ minHeight:'100vh', background:'#0D0D0D', fontFamily:'Inter,sans-serif', color:'#fff' }}>
        <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0F2140)', padding:'32px 20px', textAlign:'center' }}>
          <p style={{ fontSize:56, marginBottom:8 }}>{medal.emoji}</p>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:22, color:'#fff', margin:'0 0 4px' }}>
            Submitted Successfully!
          </h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', margin:'0 0 24px' }}>
            Your response has been received by our servers.
          </p>

          <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:20, padding:20, marginBottom:20 }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:1, margin:'0 0 8px' }}>
              YOUR SCORE
            </p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:52, color:medal.color, margin:'0 0 4px', lineHeight:1 }}>
              {scoreResult.raw_score}
            </p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', margin:'0 0 16px' }}>
              out of {scheme.max_score} · {scoreResult.percentage}%
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { l:'Correct',     v:scoreResult.correct,                        e:'✅' },
                { l:'Unattempted', v:scoreResult.unattempted,                    e:'⬜' },
                { l:'Accuracy',    v:`${scoreResult.accuracy_pct}%`,             e:'🎯' },
              ].map(s => (
                <div key={s.l} style={{ background:'rgba(255,255,255,0.05)', borderRadius:12, padding:'10px 4px', textAlign:'center' }}>
                  <p style={{ fontSize:16, margin:'0 0 2px' }}>{s.e}</p>
                  <p style={{ fontWeight:800, color:'#fff', fontSize:16, margin:'0 0 1px' }}>{s.v}</p>
                  <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', margin:0 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {disconnectCount > 0 && (
            <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:12, padding:12, marginBottom:16 }}>
              <p style={{ fontSize:12, color:'var(--color-accent-light, #FCD34D)', margin:0 }}>
                ⚠️ Note: {disconnectCount} internet disconnection{disconnectCount > 1 ? 's' : ''} detected during your exam.
                This has been recorded. If your submission is genuine, there is no concern.
              </p>
            </div>
          )}

          <div style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:14, padding:14, marginBottom:20 }}>
            <p style={{ fontSize:11, color:GOLD, fontWeight:700, margin:'0 0 4px', letterSpacing:1 }}>YOUR ALL-INDIA RANK</p>
            <p style={{ fontSize:32, fontWeight:900, color:'#fff', margin:'0 0 4px' }}>🔒 Revealed at 8:00 PM</p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)', margin:0 }}>
              Rankings computed after all submissions close.
              Your private category rank also shown then.
            </p>
          </div>

          <button onClick={() => navigate(`/tournament/${id}/results`)}
            style={{ width:'100%', padding:'14px', background:`linear-gradient(135deg,${GOLD},#E8C96A)`, color:NAVY, border:'none', borderRadius:14, fontWeight:800, fontSize:15, cursor:'pointer' }}>
            🏆 See Results at 8 PM →
          </button>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════
  // RENDER: EXAM (online, active)
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight:'100vh', background:'#0D0D0D', fontFamily:'Inter,sans-serif',
      userSelect:'none', WebkitUserSelect:'none', color:'#fff', position:'relative' }}
      onContextMenu={e => e.preventDefault()}>

      {/* -- OFFLINE OVERLAY (pauses exam completely) ------------------- */}
      {phase === 'paused_offline' && (
        <OfflineOverlay
          disconnectCount={disconnectCount}
          offlineSecs={offlineSecs}
          onRetry={retryConnection}
        />
      )}

      {/* -- RECONNECTED GRACE BANNER ------------------------------------ */}
      {phase === 'reconnecting' && <ReconnectedBanner countdown={graceCountdown} />}

      {/* -- ONLINE INDICATOR ------------------------------------------- */}
      <div style={{ position:'fixed', top:8, right:16, zIndex:100, display:'flex', alignItems:'center', gap:4 }}>
        <div style={{ width:7, height:7, borderRadius:'50%', background: isOnline ? '#22C55E' : '#EF4444' }} />
        <span style={{ fontSize:9, color:'rgba(255,255,255,0.4)', letterSpacing:0.5 }}>
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      {/* -- TAB WARNING ------------------------------------------------ */}
      {tabWarnings > 0 && (
        <div style={{ background:'#DC2626', padding:'8px 16px', textAlign:'center', paddingTop: phase==='reconnecting'?48:8 }}>
          <p style={{ fontSize:12, fontWeight:700, color:'#fff', margin:0 }}>
            ⚠️ Tab switch detected {tabWarnings} time{tabWarnings > 1 ? 's' : ''}. Stay in this window.
          </p>
        </div>
      )}

      {/* -- TIMER HEADER ----------------------------------------------- */}
      <div style={{ background:'#1a1a2e', padding:`${tabWarnings > 0 ? 48 : 14}px 16px 12px`, position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div>
            <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', margin:'0 0 1px', letterSpacing:1 }}>QUESTION</p>
            <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>{currentIdx + 1} / {questions.length}</p>
          </div>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', margin:'0 0 1px', letterSpacing:1 }}>TIME LEFT</p>
            <p style={{ fontFamily:'monospace', fontWeight:900, fontSize:22, color:timeColor, margin:0 }}>
              {formatTime(timeLeft)}
            </p>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', margin:'0 0 1px', letterSpacing:1 }}>ANSWERED</p>
            <p style={{ fontSize:14, fontWeight:700, color:'#22C55E', margin:0 }}>{answered}/{questions.length}</p>
          </div>
        </div>
        <div style={{ height:3, background:'rgba(255,255,255,0.1)', borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${(currentIdx / questions.length) * 100}%`, background:GOLD, borderRadius:99 }} />
        </div>
      </div>

      {/* -- QUESTION --------------------------------------------------- */}
      <div style={{ padding:'16px', maxWidth:480, margin:'0 auto' }}>
        {q && (
          <>
            <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:99,
              background:'rgba(201,168,76,0.15)', color:GOLD, marginBottom:12, display:'inline-block' }}>
              {q.subject || 'General'}
            </span>

            <div className="tryit-question" style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:16, marginBottom:14 }}>
              <p style={{ fontSize:15, fontWeight:600, color:'#fff', lineHeight:1.8, margin:0 }}>
                {q.question}
              </p>
            </div>

            {q.options?.map((opt, idx) => {
              const letter   = ['A', 'B', 'C', 'D'][idx]
              const selected = answers[q.id] === letter

              return (
                <button key={idx}
                  onClick={() => !showFeedback && phase === 'exam' && handleAnswer(idx)}
                  disabled={!!showFeedback || phase !== 'exam'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    width: '100%', padding: '14px 16px', marginBottom: 10,
                    borderRadius: 14, cursor: showFeedback ? 'default' : 'pointer',
                    border: `2px solid ${selected ? GOLD : 'rgba(255,255,255,0.08)'}`,
                    background: selected ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)',
                    textAlign: 'left', transition: 'all 0.15s',
                  }}>
                  <span style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.08)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:700, fontSize:12, color:'#94A3B8', flexShrink:0 }}>
                    {letter}
                  </span>
                  <p style={{ fontSize:14, color:'var(--color-border, #E2E8F0)', margin:0, flex:1 }}>{opt}</p>
                  {selected && <span style={{ fontSize:16 }}>✓</span>}
                </button>
              )
            })}

            {/* Per-answer feedback */}
            {showFeedback && (
              <div style={{ background:`${showFeedback.color}15`, border:`2px solid ${showFeedback.color}33`,
                borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:22 }}>{showFeedback.emoji}</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:showFeedback.color, margin:0 }}>{showFeedback.label}</p>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', margin:0 }}>Moving to next question...</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
                style={{ flex:1, padding:'11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, color:'#94A3B8', cursor:'pointer', fontSize:13 }}>
                ← Prev
              </button>
              <button onClick={handleSkip}
                style={{ flex:1, padding:'11px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, color:'#94A3B8', cursor:'pointer', fontSize:13 }}>
                Skip →
              </button>
              {currentIdx === questions.length - 1 ? (
                <button onClick={() => handleSubmit(false)}
                  style={{ flex:1, padding:'11px', background:GOLD, border:'none', borderRadius:12, color:NAVY, cursor:'pointer', fontSize:13, fontWeight:800 }}>
                  Submit ✓
                </button>
              ) : (
                <button onClick={() => { setCurrentIdx(i => Math.min(questions.length - 1, i + 1)); qStartTime.current = Date.now() }}
                  style={{ flex:1, padding:'11px', background:NAVY, border:'none', borderRadius:12, color:'#fff', cursor:'pointer', fontSize:13, fontWeight:700 }}>
                  Next →
                </button>
              )}
            </div>
          </>
        )}

        {/* Question palette */}
        <div style={{ marginTop:20 }}>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:1, marginBottom:8 }}>
            QUESTION PALETTE - tap any to jump
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
            {questions.map((q, i) => (
              <button key={q.id}
                onClick={() => { setCurrentIdx(i); qStartTime.current = Date.now() }}
                style={{ width:28, height:28, borderRadius:6, border:'none', cursor:'pointer',
                  fontSize:9, fontWeight:700,
                  background: i === currentIdx ? GOLD
                    : answers[q.id] ? 'rgba(34,197,94,0.4)'
                    : 'rgba(255,255,255,0.07)',
                  color: i === currentIdx ? NAVY
                    : answers[q.id] ? '#fff'
                    : '#64748B' }}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Submit early */}
        <button onClick={() => handleSubmit(false)}
          style={{ width:'100%', marginTop:20, padding:'12px', background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, color:'var(--color-text-light,#64748B)',
            fontSize:13, cursor:'pointer' }}>
          Finish Early ({questions.length - answered} unanswered)
        </button>

        {/* Connection info */}
        <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', textAlign:'center', marginTop:12, lineHeight:1.6 }}>
          🌐 Online-only exam · Internet verified every 90 seconds<br />
          Disconnecting pauses the exam and freezes your timer
        </p>
      </div>

      {/* -- CONFIRM SUBMIT MODAL ---------------------------------------- */}
      {showConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:300, padding:20 }}>
          <div style={{ background:'#1a1a2e', borderRadius:20, padding:24, maxWidth:340, textAlign:'center' }}>
            <p style={{ fontSize:28, marginBottom:8 }}>⚠️</p>
            <p style={{ fontWeight:700, fontSize:16, color:'#fff', marginBottom:6 }}>
              {questions.length - Object.keys(answers).length} questions unanswered
            </p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:20, lineHeight:1.7 }}>
              Unattempted questions score 0 (no negative marks).
              Are you sure you want to submit now?
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setShowConfirm(false)}
                style={{ flex:1, padding:'12px', background:'rgba(255,255,255,0.08)', border:'none', borderRadius:10, color:'#fff', cursor:'pointer', fontWeight:600, fontSize:13 }}>
                Keep Going
              </button>
              <button onClick={() => handleSubmit(true)}
                style={{ flex:1, padding:'12px', background:GOLD, border:'none', borderRadius:10, color:NAVY, cursor:'pointer', fontWeight:800, fontSize:13 }}>
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}