// FILE: src/pages/games/GameResultScreen.jsx
// TryIT — Shared Game End-Screen (used by ALL games — upgrade once, every game benefits)
// THE SENSORY PAYOFF: confetti burst, synthesized victory sound, animated count-up score,
// sticker unlock reveal, glow effects — this is what makes games feel premium.
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { getGameTier, setLocalHighScore, getLocalHighScore } from '../../lib/gameEngine'
import {
  playSound, burstConfetti, injectGameStyles, getSticker, RARITY_STYLES, STICKER_CATALOG,
  isSoundEnabled, toggleSound,
} from '../../lib/gameJuice'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import ShareCard from '../../components/ShareCard'
import { useLocation } from 'react-router-dom'
import { unlockNextLevelFree } from '../../lib/levelSystem'

const NAVY='#1E3A5F', GOLD='#C9A84C'

// Animated count-up number (0 → final score, builds anticipation)
function CountUpScore({ target, color }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const duration = 1000
    const steps = 40
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.round(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])
  return <span style={{ color }}>{val}</span>
}

export default function GameResultScreen({ gameId, gameName, gameEmoji, score, maxPossible, correct, wrong, bestStreak, totalQuestions, onPlayAgain }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { addCoins, user } = useAuth()
  const canvasRef = useRef(null)
  const [isNewHigh, setIsNewHigh] = useState(false)
  const [oldHigh, setOldHigh] = useState(0)
  const [newStickers, setNewStickers] = useState([])
  const [showStickerReveal, setShowStickerReveal] = useState(null)
  const [stickerQueue, setStickerQueue] = useState([])
  const [soundOn, setSoundOn] = useState(isSoundEnabled())
  const [showShare, setShowShare] = useState(false)
  const [levelUnlocked, setLevelUnlocked] = useState(null)
  const [starsEarned, setStarsEarned] = useState(0)

  const playedLevel = location.state?.level || null
  const isAdminTest = location.state?.isAdminTest || false

  const tier = getGameTier(score, maxPossible)
  const pct = maxPossible > 0 ? (score / maxPossible) * 100 : 0
  const coinsEarned = Math.max(5, Math.round(score / 10))

  useEffect(() => {
    injectGameStyles()

    const prevHigh = getLocalHighScore(gameId)
    setOldHigh(prevHigh)
    const isNew = setLocalHighScore(gameId, score)
    setIsNewHigh(isNew)
    if (!isAdminTest) addCoins?.(coinsEarned)
    // Admin test plays never touch real coin balance — pure QA, zero economy impact

    // ── THE PAYOFF MOMENT ──────────────────────────────────────────────
    if (pct >= 60) {
      playSound('win')
      if (canvasRef.current) burstConfetti(canvasRef.current, { count: pct >= 90 ? 120 : 80 })
    } else {
      playSound('lose')
    }
    if (!isAdminTest) setTimeout(() => playSound('coinEarn'), 400)

    // ── CHECK STICKER UNLOCKS (skipped for admin — no fake collection growth) ──
    if (!isAdminTest) {
      const earned = []
      if (correct === totalQuestions) earned.push('perfect_score')
      if (bestStreak >= 10) earned.push('combo_10')
      else if (bestStreak >= 3) earned.push('combo_3')
      const hour = new Date().getHours()
      if (hour >= 23 || hour < 5) earned.push('night_owl')
      if (hour < 7) earned.push('early_bird')

      ;(async () => {
        const awarded = []
        for (const stickerId of earned) {
          try {
            const { data } = await supabase.rpc('award_sticker', { p_user_id: user?.id, p_sticker_id: stickerId })
            if (data) awarded.push(stickerId)
          } catch {}
        }
        if (awarded.length) {
          setNewStickers(awarded)
          setStickerQueue(awarded)
        }
      })()
    }

    // ── LEVEL PROGRESSION (if played via roadmap) ──────────────────────
    if (playedLevel) {
      unlockNextLevelFree(user?.id, gameId, playedLevel, score, maxPossible, isAdminTest).then(result => {
        setStarsEarned(result.stars)
        if (pct >= 40) setLevelUnlocked(result.newLevelUnlocked)
      })
    }

    // Log session (tagged is_admin_test so it never enters real leaderboards/analytics)
    try {
      supabase.from('game_sessions').insert({
        user_id: user?.id, game_id: gameId, score, correct, wrong,
        best_streak: bestStreak, result: pct >= 60 ? 'win' : 'loss',
        is_admin_test: isAdminTest,
      })
    } catch {}
  }, [])

  // Show sticker reveal modals one at a time
  useEffect(() => {
    if (stickerQueue.length > 0 && !showStickerReveal) {
      setShowStickerReveal(stickerQueue[0])
      setTimeout(() => playSound('stickerUnlock'), 200)
    }
  }, [stickerQueue, showStickerReveal])

  const dismissSticker = () => {
    setStickerQueue(q => q.slice(1))
    setShowStickerReveal(null)
  }

  const handleSoundToggle = () => setSoundOn(toggleSound())

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(160deg,${NAVY},#0F2140)`, fontFamily:'Inter,sans-serif', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center', position:'relative', overflow:'hidden' }}>

      {/* Confetti canvas overlay */}
      <canvas ref={canvasRef} width={400} height={700}
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:10 }} />

      {/* Sound toggle */}
      <button onClick={handleSoundToggle}
        style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.1)', border:'none',
          width:36, height:36, borderRadius:'50%', color:'#fff', fontSize:16, cursor:'pointer', zIndex:20 }}>
        {soundOn ? '🔊' : '🔇'}
      </button>

      <div style={{ position:'relative', zIndex:5 }}>
        {isAdminTest && (
          <div style={{ background:'rgba(220,38,38,0.2)', border:'1.5px solid #EF4444', borderRadius:99,
            padding:'4px 16px', marginBottom:14, display:'inline-block' }}>
            <p style={{ fontSize:10, fontWeight:900, color:'#FCA5A5', margin:0, letterSpacing:1 }}>
              🛡️ ADMIN TEST — NOT SAVED TO REAL DATA
            </p>
          </div>
        )}
        {isNewHigh && (
          <div className="tryit-pop-in" style={{ background:`linear-gradient(135deg,${GOLD},#E8C96A)`, borderRadius:99,
            padding:'6px 20px', marginBottom:16, boxShadow:'0 4px 20px rgba(201,168,76,0.4)' }}>
            <p style={{ fontSize:13, fontWeight:900, color:NAVY, margin:0 }}>🎉 NEW HIGH SCORE!</p>
          </div>
        )}

        <p className="tryit-pop-in" style={{ fontSize:72, marginBottom:8 }}>{tier.emoji}</p>
        <p className="tryit-pop-in" style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18, color:tier.color, margin:'0 0 4px' }}>{tier.label}</p>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:20 }}>{gameEmoji} {gameName}</p>

        {/* Stars earned (level mode) */}
        {playedLevel && (
          <div className="tryit-pop-in" style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:16 }}>
            {[1,2,3].map(i => (
              <span key={i} style={{ fontSize:32, color: i<=starsEarned ? '#FBBF24' : 'rgba(255,255,255,0.20)',
                filter: i<=starsEarned ? 'drop-shadow(0 0 8px #FBBF2488)' : 'none' }}>★</span>
            ))}
          </div>
        )}

        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:64, margin:'0 0 4px', lineHeight:1,
          animation:'tryit-count-up 0.6s ease-out' }}>
          <CountUpScore target={score} color={GOLD} />
        </p>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:24 }}>
          points {oldHigh>0 && !isNewHigh && `· Best: ${oldHigh}`}
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, width:'100%', maxWidth:320, marginBottom:20 }}>
          {[
            { l:'Correct',     v:`${correct}/${totalQuestions}`, e:'✅' },
            { l:'Best Streak', v:`${bestStreak}🔥`,               e:'⚡' },
            { l:'Coins',       v:`+${coinsEarned}🪙`,              e:'🪙' },
          ].map(s=>(
            <div key={s.l} style={{ background:'rgba(255,255,255,0.08)', borderRadius:14, padding:'12px 4px' }}>
              <p style={{ fontSize:18, margin:'0 0 4px' }}>{s.e}</p>
              <p style={{ fontWeight:800, fontSize:15, margin:'0 0 2px' }}>{s.v}</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', margin:0 }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* New stickers earned strip */}
        {newStickers.length > 0 && (
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:20, flexWrap:'wrap' }}>
            {newStickers.map(id => {
              const st = getSticker(id)
              if (!st) return null
              const rs = RARITY_STYLES[st.rarity]
              return (
                <div key={id} className="tryit-pop-in tryit-glow" style={{ background:rs.bg, borderRadius:12, padding:'8px 10px', boxShadow:rs.glow }}>
                  <p style={{ fontSize:20, margin:0 }}>{st.emoji}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Level unlocked banner */}
        {levelUnlocked && (
          <div className="tryit-pop-in" style={{ background:`linear-gradient(135deg,${GOLD},#E8C96A)`, borderRadius:14,
            padding:'10px 16px', marginBottom:16 }}>
            <p style={{ fontSize:13, fontWeight:900, color:NAVY, margin:0 }}>🔓 Level {levelUnlocked} Unlocked!</p>
          </div>
        )}

        <div style={{ display:'flex', gap:10, width:'100%', maxWidth:320, marginBottom:10 }}>
          {playedLevel ? (
            <>
              <button onClick={() => { playSound('swoosh'); navigate(`/games/levels/${gameId}`) }}
                style={{ flex:1, padding:'14px', background:GOLD, color:NAVY, border:'none', borderRadius:14, fontWeight:800, fontSize:14, cursor:'pointer' }}>
                🗺️ View Map
              </button>
              <button onClick={() => { playSound('swoosh'); onPlayAgain?.() }}
                style={{ flex:1, padding:'14px', background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:14, fontWeight:700, fontSize:14, cursor:'pointer' }}>
                🔄 Retry
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { playSound('swoosh'); onPlayAgain?.() }}
                style={{ flex:1, padding:'14px', background:GOLD, color:NAVY, border:'none', borderRadius:14, fontWeight:800, fontSize:14, cursor:'pointer' }}>
                🔄 Play Again
              </button>
              <button onClick={() => navigate('/games')}
                style={{ flex:1, padding:'14px', background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:14, fontWeight:700, fontSize:14, cursor:'pointer' }}>
                🎮 More Games
              </button>
            </>
          )}
        </div>

        <button onClick={() => setShowShare(true)}
          style={{ width:'100%', maxWidth:320, padding:'12px', background:'rgba(255,255,255,0.07)', color:GOLD, border:`1px solid ${GOLD}44`, borderRadius:14, fontWeight:700, fontSize:13, cursor:'pointer' }}>
          📤 Share My Result
        </button>
      </div>

      {/* Sticker unlock reveal modal */}
      {showStickerReveal && (() => {
        const st = getSticker(showStickerReveal)
        const rs = RARITY_STYLES[st?.rarity]
        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex',
            alignItems:'center', justifyContent:'center', zIndex:100, padding:24 }}
            onClick={dismissSticker}>
            <div className="tryit-pop-in" style={{ background:rs?.bg || '#fff', borderRadius:24, padding:32,
              maxWidth:300, textAlign:'center', boxShadow:rs?.glow }}>
              <p style={{ fontSize:11, fontWeight:800, color:rs?.color, letterSpacing:2, marginBottom:8, textTransform:'uppercase' }}>
                {st?.rarity} Sticker Unlocked!
              </p>
              <p style={{ fontSize:64, margin:'0 0 12px' }}>{st?.emoji}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18, color:rs?.color, margin:'0 0 6px' }}>
                {st?.label}
              </p>
              <p style={{ fontSize:12, color:'#475569', marginBottom:20 }}>{st?.condition}</p>
              <button onClick={dismissSticker}
                style={{ padding:'10px 28px', background:rs?.color, color:'#fff', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer' }}>
                Awesome! ✓
              </button>
            </div>
          </div>
        )
      })()}

      {/* Share modal */}
      {showShare && (
        <ShareCard
          type="game_result"
          data={{
            role: 'student',
            referenceId: gameId,
            userName: user?.name || 'Student',
            gameName, gameEmoji,
            score, bestStreak,
            medal: { emoji: tier.emoji, label: tier.label },
          }}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}