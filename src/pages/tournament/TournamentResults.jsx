// FILE: src/pages/tournament/TournamentResults.jsx
// TryIT — 8 PM Tournament Results Reveal
// Route: /tournament/:id/results
// Rank fetched from static CDN JSON (zero DB reads)
// Category rank computed locally on device
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate }      from 'react-router-dom'
import { useAuth }                     from '../../context/AuthContext'
import { supabase }                    from '../../lib/supabase'
import { lookupRank, computeCategoryRank, getMedal } from '../../lib/tournamentEngine'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const GREEN = '#059669'

function CountdownTo8PM({ onUnlock }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const update = () => {
      const now    = new Date()
      const target = new Date()
      target.setHours(20, 0, 0, 0)
      if (now >= target) {
        setUnlocked(true)
        onUnlock?.()
        return
      }
      const diff = target - now
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  if (unlocked) return null

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A14', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', padding:24 }}>
      <p style={{ fontSize:48, marginBottom:16 }}>🔒</p>
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22, color:'#fff', margin:'0 0 8px', textAlign:'center' }}>
        Results locked until 8:00 PM
      </p>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', margin:'0 0 32px', textAlign:'center', lineHeight:1.7 }}>
        All 10 lakh+ submissions are being processed.<br/>
        Ranks will be revealed simultaneously at exactly 8:00 PM.
      </p>
      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'24px 40px', textAlign:'center', marginBottom:24 }}>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:2, margin:'0 0 8px' }}>RESULTS IN</p>
        <p style={{ fontFamily:'monospace', fontWeight:900, fontSize:48, color:GOLD, margin:0, letterSpacing:4 }}>
          {timeLeft}
        </p>
      </div>
      <div style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:14, padding:14, maxWidth:300, textAlign:'center' }}>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:0, lineHeight:1.7 }}>
          💡 At <strong style={{ color:GOLD }}>7:55 PM</strong> you'll get a notification.<br/>
          At <strong style={{ color:GOLD }}>8:00 PM</strong> your rank explodes on screen.<br/>
          Be ready. 🏆
        </p>
      </div>
    </div>
  )
}

function SuspenseReveal({ rank, total, medal, onComplete }) {
  const [stage, setStage] = useState(0)
  // 0=dark  1=logo pulse  2=computing text  3=rank reveal  4=done

  useEffect(() => {
    const timings = [500, 1500, 3000, 4500]
    const timers  = timings.map((t, i) => setTimeout(() => setStage(i+1), t))
    const done    = setTimeout(onComplete, 5500)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [])

  return (
    <div style={{ position:'fixed', inset:0, background:'#0A0A14', zIndex:999,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      fontFamily:'Inter,sans-serif', transition:'opacity 0.5s' }}>

      {stage >= 1 && (
        <div style={{ textAlign:'center', animation:'pulse 1s infinite' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28, margin:'0 0 4px',
            background:`linear-gradient(135deg,${GOLD},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Try<span style={{ WebkitTextFillColor:GOLD }}>IT</span>
          </p>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:2, margin:0 }}>EDUCATIONS</p>
        </div>
      )}

      {stage >= 2 && (
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', margin:'32px 0 0', textAlign:'center', lineHeight:2 }}>
          Analysing 10 lakh+ results...<br/>
          Verifying answer sheets...<br/>
          <span style={{ color:GOLD }}>Computing your rank...</span>
        </p>
      )}

      {stage >= 3 && (
        <div style={{ marginTop:32, textAlign:'center' }}>
          <p style={{ fontSize:64, marginBottom:8 }}>{medal.emoji}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:52, color:GOLD, margin:'0 0 4px', lineHeight:1 }}>
            #{rank?.toLocaleString('en-IN') || '—'}
          </p>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', margin:0 }}>
            All India Rank · out of {total?.toLocaleString('en-IN') || '—'}
          </p>
        </div>
      )}
    </div>
  )
}

export default function TournamentResults() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const [phase,         setPhase]         = useState('waiting')
  // 'waiting' | 'suspense' | 'reveal' | 'loaded'
  const [tournament,    setTournament]    = useState(null)
  const [mySubmission,  setMySubmission]  = useState(null)
  const [rankData,      setRankData]      = useState(null)
  const [categoryData,  setCategoryData]  = useState(null)
  const [top100,        setTop100]        = useState([])
  const [loading,       setLoading]       = useState(false)
  const [showShare,     setShowShare]     = useState(false)

  useEffect(() => {
    supabase.from('tournaments').select('*').eq('tournament_id', id).single()
      .then(({ data }) => setTournament(data))
      .catch(() => {})

    supabase.from('tournament_submissions').select('*').eq('tournament_id', id).eq('user_id', user?.id || '').single()
      .then(({ data }) => setMySubmission(data))
      .catch(() => {})
  }, [id, user?.id])

  const loadResults = async () => {
    if (!mySubmission) return
    setLoading(true)
    try {
      // Fetch rank from CDN static JSON (zero DB read)
      const rankResult = await lookupRank(id, mySubmission.raw_score)
      setRankData(rankResult)

      // Fetch top 100 from CDN
      try {
        const cdnUrl  = tournament?.cdn_leaderboard_url || `https://cdn.tryiteducations.net/tournament-data/leaderboard_${id}.json`
        const res     = await fetch(cdnUrl)
        const lb      = await res.json()
        setTop100(lb.top_100 || [])
      } catch {}

      // Category rank (computed locally from pre-downloaded cutoffs)
      const { data: cutoffs } = await supabase.from('category_cutoffs')
        .select('*').eq('exam_tier_id', tournament?.exam_scheme_id).order('year', { ascending: false }).limit(9)

      const { data: myReg } = await supabase.from('tournament_registrations')
        .select('category').eq('tournament_id', id).eq('user_id', user?.id || '').single()

      if (cutoffs && myReg) {
        const catRank = computeCategoryRank(
          mySubmission.raw_score,
          myReg.category || 'general',
          rankResult.raw_rank_data || {},
          cutoffs
        )
        setCategoryData({ ...catRank, category: myReg.category })
      }

      // Load prize result
      supabase.from('tournament_results')
        .select('*').eq('tournament_id', id).eq('user_id', user?.id || '').single()
        .then(({ data }) => { if (data) setMySubmission(s => ({ ...s, result: data })) })
        .catch(() => {})

    } catch {}
    setLoading(false)
  }

  const handleUnlock = () => {
    setPhase('suspense')
    setTimeout(() => {
      loadResults()
      setPhase('reveal')
      setTimeout(() => setPhase('loaded'), 5500)
    }, 100)
  }

  const isNow8PM = () => {
    const now = new Date()
    return now.getHours() >= 20
  }

  if (phase === 'waiting' && !isNow8PM()) {
    return <CountdownTo8PM onUnlock={handleUnlock} />
  }

  if (phase === 'waiting' && isNow8PM()) {
    handleUnlock()
    return null
  }

  const medal    = mySubmission ? getMedal(mySubmission.accuracy_pct || 0) : null
  const myRank   = rankData?.all_india_rank || mySubmission?.all_india_rank
  const myResult = mySubmission?.result

  if (phase === 'suspense' || phase === 'reveal') {
    return <SuspenseReveal rank={myRank} total={rankData?.total_participants} medal={medal || { emoji:'🏆' }} onComplete={() => setPhase('loaded')} />
  }

  // ── LOADED: FULL RESULTS PAGE ─────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#0A0A14', fontFamily:'Inter,sans-serif', color:'#fff', paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(160deg,#0F2140,#1a1a2e)`, padding:'20px 16px 28px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <button onClick={() => navigate('/tournament')} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <span style={{ fontSize:11, fontWeight:700, color:GOLD, letterSpacing:1 }}>🏆 TOURNAMENT RESULTS</span>
          <div style={{ width:34 }} />
        </div>

        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:'#fff', margin:'0 0 4px' }}>
          {tournament?.tournament_name || 'Tournament'}
        </p>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', margin:'0 0 20px' }}>
          {tournament?.exam_display_name} · {rankData?.total_participants?.toLocaleString('en-IN') || '—'} participants
        </p>

        {/* My rank hero */}
        {mySubmission && (
          <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:20, padding:20, textAlign:'center' }}>
            <p style={{ fontSize:48, margin:'0 0 6px' }}>{medal?.emoji || '🏆'}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:40, color:GOLD, margin:'0 0 4px', lineHeight:1 }}>
              #{myRank?.toLocaleString('en-IN') || '—'}
            </p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', margin:'0 0 16px' }}>
              All India Rank · {medal?.label}
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[
                { l:'Score',    v:mySubmission.raw_score,     e:'📊' },
                { l:'Correct',  v:mySubmission.correct_count, e:'✅' },
                { l:'Accuracy', v:`${mySubmission.accuracy_pct||0}%`, e:'🎯' },
              ].map(s => (
                <div key={s.l} style={{ background:'rgba(255,255,255,0.06)', borderRadius:12, padding:'10px 4px', textAlign:'center' }}>
                  <p style={{ fontSize:14, margin:'0 0 2px' }}>{s.e}</p>
                  <p style={{ fontWeight:800, color:'#fff', fontSize:16, margin:'0 0 1px' }}>{s.v}</p>
                  <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', margin:0 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding:16, maxWidth:480, margin:'0 auto' }}>

        {/* PRIZE WON */}
        {myResult?.prize_awarded && myResult.prize_awarded !== 'coins_50' && (
          <div style={{ background:`linear-gradient(135deg,${GOLD}22,${GOLD}11)`, border:`1.5px solid ${GOLD}44`, borderRadius:18, padding:18, marginBottom:14, textAlign:'center' }}>
            <p style={{ fontSize:32, marginBottom:8 }}>🎊</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:GOLD, margin:'0 0 4px' }}>Congratulations!</p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.8)', margin:'0 0 8px', lineHeight:1.7 }}>
              You won: <strong style={{ color:GOLD }}>
                {myResult.prize_awarded.replace('_',' ').replace('month','Month').replace('year','Year').replace('ultra','Ultra').replace('pro','Pro')}
              </strong>
            </p>
            {myResult.badge_awarded && (
              <span style={{ fontSize:10, fontWeight:700, padding:'4px 12px', borderRadius:99, background:GOLD, color:NAVY }}>
                🏅 {myResult.badge_awarded.replace(/_/g,' ').toUpperCase()} Badge Added to Profile
              </span>
            )}
            {myResult.ambassador && (
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', margin:'8px 0 0' }}>
                🌟 You are now a TryIT State Ambassador for 30 days!<br/>Your profile appears on the loading screen.
              </p>
            )}
          </div>
        )}

        {/* Coins earned */}
        {(myResult?.coins_awarded > 0 || !myResult) && (
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:14, marginBottom:14, display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:28 }}>🪙</span>
            <div>
              <p style={{ fontWeight:700, color:'#fff', fontSize:14, margin:'0 0 2px' }}>
                +{myResult?.coins_awarded || 50} Coins Added
              </p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', margin:0 }}>
                Tournament participation reward — check your Wallet
              </p>
            </div>
          </div>
        )}

        {/* CATEGORY RANK — PRIVATE to user only */}
        {categoryData && (
          <div style={{ background:'rgba(30,58,95,0.4)', border:'1.5px solid rgba(30,58,95,0.8)', borderRadius:18, padding:16, marginBottom:14 }}>
            <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, margin:'0 0 12px' }}>
              🔒 PRIVATE — YOUR CATEGORY ANALYSIS
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:12, padding:12, textAlign:'center' }}>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', margin:'0 0 4px' }}>
                  {categoryData.category?.toUpperCase().replace('_',' ')} RANK
                </p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28, color:GOLD, margin:0 }}>
                  #{categoryData.category_rank?.toLocaleString('en-IN') || '—'}
                </p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:12, padding:12, textAlign:'center' }}>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', margin:'0 0 4px' }}>CATEGORY CUTOFF</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28, color:GREEN, margin:0 }}>
                  {categoryData.cutoff_marks || '—'}
                </p>
              </div>
            </div>

            {categoryData.prediction && (
              <div style={{ background:`${categoryData.prediction.color}15`, border:`1px solid ${categoryData.prediction.color}33`, borderRadius:12, padding:'10px 14px' }}>
                <p style={{ fontWeight:800, fontSize:14, color:categoryData.prediction.color, margin:'0 0 3px' }}>
                  {categoryData.prediction.label}
                </p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:0 }}>
                  {categoryData.prediction.desc}
                </p>
              </div>
            )}

            <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:'10px 0 0', textAlign:'center', lineHeight:1.6 }}>
              This analysis is shown only to you · Never visible publicly
            </p>
          </div>
        )}

        {/* SHARE CARD */}
        <button onClick={() => setShowShare(true)}
          style={{ width:'100%', padding:'14px', background:`linear-gradient(135deg,${GOLD},#E8C96A)`, color:NAVY, border:'none', borderRadius:14, fontWeight:800, fontSize:14, cursor:'pointer', marginBottom:14 }}>
          📤 Share Your Result →
        </button>

        {/* TOP 20 LEADERBOARD */}
        {top100.length > 0 && (
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:1, marginBottom:12 }}>
              🏆 TOP 20 — {tournament?.exam_display_name}
            </p>
            {top100.slice(0, 20).map((entry, i) => {
              const isMe = entry.user_id === user?.id
              const medals_ = ['🥇','🥈','🥉']
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', marginBottom:6,
                  background: isMe ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)',
                  borderRadius:12, border: isMe ? `1.5px solid ${GOLD}44` : '1.5px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.5)', width:28, textAlign:'center', flexShrink:0 }}>
                    {i < 3 ? medals_[i] : `#${i+1}`}
                  </span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:isMe?GOLD:'#fff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {entry.name || 'Student'} {isMe && '(You)'}
                    </p>
                    <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', margin:0 }}>{entry.state || 'India'}</p>
                  </div>
                  <p style={{ fontSize:14, fontWeight:800, color:GOLD, margin:0, flexShrink:0 }}>{entry.score}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Share modal */}
      {showShare && mySubmission && (
        <ShareResultModal
          rank={myRank}
          score={mySubmission.raw_score}
          exam={tournament?.exam_display_name}
          total={rankData?.total_participants}
          medal={medal}
          userName={user?.name}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}

// ── SHARE RESULT MODAL ────────────────────────────────────────────────────
function ShareResultModal({ rank, score, exam, total, medal, userName, onClose }) {
  const NAVY = '#1E3A5F', GOLD = '#C9A84C'

  const shareText = `🏆 I just competed in the All India ${exam} Tournament on TryIT Educations!\n\n${medal?.emoji} Rank: #${rank?.toLocaleString('en-IN')} out of ${total?.toLocaleString('en-IN')}\n📊 Score: ${score}\n\nJoin me at tryiteducations.net 🇮🇳`

  const handleShare = async (platform) => {
    if (platform === 'native' && navigator.share) {
      try { await navigator.share({ title:'My TryIT Tournament Result', text:shareText, url:'https://tryiteducations.net' }) }
      catch {}
    } else {
      navigator.clipboard.writeText(shareText)
      alert('✅ Result copied! Paste in WhatsApp, Instagram, or anywhere.')
    }
    onClose()
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:1000 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:'#1a1a2e', borderRadius:'20px 20px 0 0', padding:24, width:'100%', maxWidth:460 }}>
        {/* Share card preview */}
        <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, borderRadius:16, padding:20, marginBottom:16, textAlign:'center', border:`2px solid ${GOLD}44` }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:13, color:GOLD, margin:'0 0 2px', letterSpacing:2 }}>TRYIT EDUCATIONS</p>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', margin:'0 0 14px' }}>tryiteducations.net</p>
          <p style={{ fontSize:36, margin:'0 0 4px' }}>{medal?.emoji}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:36, color:GOLD, margin:'0 0 2px', lineHeight:1 }}>
            #{rank?.toLocaleString('en-IN')}
          </p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', margin:'0 0 8px' }}>All India Rank · {exam}</p>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', margin:0 }}>
            Score: {score} · out of {total?.toLocaleString('en-IN')} students
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <button onClick={() => handleShare('native')} style={{ padding:'13px', background:GOLD, color:NAVY, border:'none', borderRadius:12, fontWeight:800, fontSize:14, cursor:'pointer' }}>
            📤 Share Result Card
          </button>
          <button onClick={() => handleShare('copy')} style={{ padding:'11px', background:'rgba(255,255,255,0.08)', color:'#fff', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, fontWeight:600, fontSize:13, cursor:'pointer' }}>
            📋 Copy Text to Share
          </button>
          <button onClick={onClose} style={{ padding:'10px', background:'none', color:'rgba(255,255,255,0.4)', border:'none', fontSize:12, cursor:'pointer' }}>
            Cancel
          </button>
        </div>

        <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', textAlign:'center', marginTop:8 }}>
          Social sharing is off by default · Enabled when you choose to share
        </p>
      </div>
    </div>
  )
}