// FILE: src/components/LevelRoadmap.jsx
// TryIT — Cinematic Level Roadmap
// Winding path of level nodes, themed by universe (shifts every 10 levels)
// Current level glows, completed levels show stars, locked levels show coin cost
import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
  THEME_UNIVERSES, getUniverseForLevel, getUserLevelProgress,
  getUnlockCost, unlockLevelWithCoins, isAdminUser,
} from '../lib/levelSystem'
import { injectGameStyles, playSound } from '../lib/gameJuice'

const GOLD = '#C9A84C'

// ── PARTICLE BACKGROUND (per theme, lightweight canvas) ──────────────────
function ThemeParticles({ type, color }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight

    const count = type === 'starfield' ? 60 : 30
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      size: Math.random() * (type === 'starfield' ? 2 : 4) + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      drift: (Math.random() - 0.5) * 0.3,
    }))

    let raf
    function animate() {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.y -= p.speed
        p.x += p.drift
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W }
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [type, color])

  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.6 }} />
}

// ── LEVEL NODE ─────────────────────────────────────────────────────────────
function LevelNode({ level, status, stars, cost, isLeft, universe, onClick }) {
  // status: 'completed' | 'current' | 'locked'
  const nodeSize = status === 'current' ? 64 : 52

  return (
    <div style={{ display:'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end',
      padding: isLeft ? '0 0 0 20%' : '0 20% 0 0', marginBottom:28, position:'relative' }}>
      <div onClick={onClick}
        className={status === 'current' ? 'tryit-glow' : ''}
        style={{
          width:nodeSize, height:nodeSize, borderRadius:'50%', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          background: status==='locked'
            ? 'rgba(255,255,255,0.08)'
            : status==='current'
              ? `linear-gradient(135deg,${universe.accent},${universe.secondary})`
              : `linear-gradient(135deg,${universe.secondary},${universe.primary})`,
          border: status==='current' ? `3px solid ${universe.accent}` : '2px solid rgba(255,255,255,0.15)',
          boxShadow: status==='current' ? `0 0 24px ${universe.accent}88` : 'none',
          position:'relative', flexShrink:0,
        }}>
        {status === 'locked' ? (
          <span style={{ fontSize:18, opacity:0.5 }}>🔒</span>
        ) : (
          <span style={{ fontSize: status==='current' ? 26 : 20 }}>
            {universe.icons[level % universe.icons.length]}
          </span>
        )}

        {/* Level number badge */}
        <span style={{ position:'absolute', bottom:-6, left:'50%', transform:'translateX(-50%)',
          background:'#0A0A14', color:'#fff', fontSize:9, fontWeight:800, padding:'2px 6px',
          borderRadius:99, border:`1px solid ${universe.accent}66` }}>
          {level}
        </span>

        {/* Stars for completed */}
        {status === 'completed' && stars > 0 && (
          <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', display:'flex' }}>
            {[1,2,3].map(i => (
              <span key={i} style={{ fontSize:10, color: i<=stars ? '#FBBF24' : 'rgba(255,255,255,0.2)' }}>★</span>
            ))}
          </div>
        )}

        {/* Cost for locked */}
        {status === 'locked' && cost && (
          <div style={{ position:'absolute', top:-18, left:'50%', transform:'translateX(-50%)',
            background:'rgba(0,0,0,0.7)', padding:'2px 8px', borderRadius:99, whiteSpace:'nowrap' }}>
            <span style={{ fontSize:9, color:GOLD, fontWeight:700 }}>{cost}🪙</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── MAIN ROADMAP COMPONENT ─────────────────────────────────────────────────
export default function LevelRoadmap({ gameId, gameName, gameEmoji, onPlayLevel }) {
  const navigate = useNavigate()
  const { user, coins, spendCoins } = useAuth()
  const isAdmin = isAdminUser(user)

  const [progress, setProgress]   = useState({ current_level:1, highest_unlocked:1, total_stars:0, levels_completed:0 })
  const [stars,    setStars]      = useState({})  // level -> stars earned
  const [loading,  setLoading]    = useState(true)
  const [unlockModal, setUnlockModal] = useState(null)
  const [unlocking, setUnlocking] = useState(false)

  const VISIBLE_LEVELS = isAdmin ? 60 : 30  // render window, scrollable; admin sees more for full QA coverage

  useEffect(() => {
    injectGameStyles()
    ;(async () => {
      const p = await getUserLevelProgress(user?.id, gameId, isAdmin)
      setProgress(p)

      if (isAdmin) { setLoading(false); return }  // skip star-history fetch, admin doesn't need it

      try {
        const { data } = await supabase.from('level_completions')
          .select('level_number,stars_earned').eq('user_id', user?.id).eq('game_id', gameId)
        if (data) {
          const map = {}
          data.forEach(d => { map[d.level_number] = d.stars_earned })
          setStars(map)
        }
      } catch {}
      setLoading(false)
    })()
  }, [user?.id, gameId])

  const levels = useMemo(() =>
    Array.from({ length: VISIBLE_LEVELS }, (_, i) => i + 1), [])

  const getStatus = (level) => {
    if (isAdmin) return level === progress.current_level ? 'current' : 'completed'
    // Admin: every level shown as playable (completed-style, fully clickable)
    if (level < progress.highest_unlocked) return 'completed'
    if (level === progress.current_level || level === progress.highest_unlocked) return 'current'
    return 'locked'
  }

  const handleNodeClick = async (level) => {
    if (isAdmin) {
      playSound('swoosh')
      onPlayLevel?.(level, { isAdminTest: true })
      return
    }
    const status = getStatus(level)
    if (status === 'locked') {
      const cost = await getUnlockCost(level)
      setUnlockModal({ level, cost })
      return
    }
    playSound('swoosh')
    onPlayLevel?.(level)
  }

  const confirmUnlock = async () => {
    if (!unlockModal) return
    setUnlocking(true)
    const result = await unlockLevelWithCoins(user?.id, gameId, unlockModal.level, spendCoins)
    setUnlocking(false)
    if (result.success) {
      playSound('stickerUnlock')
      setProgress(p => ({ ...p, highest_unlocked: Math.max(p.highest_unlocked, unlockModal.level), current_level: unlockModal.level }))
      setUnlockModal(null)
      onPlayLevel?.(unlockModal.level)
    } else {
      alert('Not enough coins! Earn more by completing tests, or buy in Wallet.')
    }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0A0A14', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Inter,sans-serif' }}>
      Loading your journey...
    </div>
  )

  // Group visible levels by universe for section headers
  const sections = []
  let lastUniverse = null
  levels.forEach(level => {
    const u = getUniverseForLevel(level)
    if (u.id !== lastUniverse) {
      sections.push({ universe: u, levels: [] })
      lastUniverse = u.id
    }
    sections[sections.length - 1].levels.push(level)
  })

  return (
    <div style={{ minHeight:'100vh', fontFamily:'Inter,sans-serif', color:'#fff', overflowX:'hidden' }}>

      {sections.map((section, sIdx) => (
        <div key={section.universe.id} style={{ background:section.universe.bg, position:'relative', padding:'32px 16px' }}>
          <ThemeParticles type={section.universe.particle} color={section.universe.accent} />

          {/* Universe header */}
          <div style={{ position:'relative', zIndex:2, textAlign:'center', marginBottom:32 }}>
            {sIdx === 0 && (
              <button onClick={() => navigate('/games')}
                style={{ position:'absolute', left:0, top:0, background:'rgba(255,255,255,0.1)', border:'none',
                  width:34, height:34, borderRadius:'50%', color:'#fff', fontSize:16, cursor:'pointer' }}>
                ←
              </button>
            )}
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:section.universe.accent,
              textTransform:'uppercase', margin:'0 0 4px' }}>
              {sIdx === 0 ? `${gameEmoji} ${gameName} — ` : ''}World {sIdx + 1}
            </p>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:24, margin:'0 0 6px',
              textShadow:`0 0 20px ${section.universe.accent}66` }}>
              {section.universe.name}
            </h2>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', maxWidth:280, margin:'0 auto', fontStyle:'italic' }}>
              "{section.universe.tagline}"
            </p>
          </div>

          {/* Progress summary (first section only) — hidden for admin, replaced by admin banner */}
          {sIdx === 0 && !isAdmin && (
            <div style={{ position:'relative', zIndex:2, display:'flex', justifyContent:'center', gap:10, marginBottom:32 }}>
              <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:14, padding:'10px 18px', textAlign:'center' }}>
                <p style={{ fontWeight:800, fontSize:18, margin:0 }}>{progress.highest_unlocked}</p>
                <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>Level Reached</p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:14, padding:'10px 18px', textAlign:'center' }}>
                <p style={{ fontWeight:800, fontSize:18, margin:0, color:'#FBBF24' }}>{progress.total_stars}⭐</p>
                <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>Stars Earned</p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:14, padding:'10px 18px', textAlign:'center' }}>
                <p style={{ fontWeight:800, fontSize:18, margin:0, color:GOLD }}>{(coins||0).toLocaleString('en-IN')}🪙</p>
                <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>Your Coins</p>
              </div>
            </div>
          )}

          {/* ADMIN TEST MODE banner + jump-to-level */}
          {isAdmin && sIdx === 0 && (
            <div style={{ position:'relative', zIndex:2, maxWidth:340, margin:'0 auto 28px',
              background:'rgba(220,38,38,0.15)', border:'2px solid #EF4444', borderRadius:16, padding:14, textAlign:'center' }}>
              <p style={{ fontSize:11, fontWeight:900, color:'#FCA5A5', letterSpacing:1, margin:'0 0 4px' }}>
                🛡️ ADMIN TEST MODE — FULL ACCESS
              </p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', margin:'0 0 10px', lineHeight:1.5 }}>
                Every level unlocked. Zero coin cost. Plays are tagged and excluded from real leaderboards & student data.
              </p>
              <div style={{ display:'flex', gap:6 }}>
                <input type="number" placeholder="Jump to level..." min={1}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value) {
                      onPlayLevel?.(parseInt(e.target.value), { isAdminTest: true })
                    }
                  }}
                  style={{ flex:1, padding:'9px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.2)',
                    background:'rgba(0,0,0,0.3)', color:'#fff', fontSize:13, outline:'none' }} />
                <button onClick={(e) => {
                  const input = e.target.previousSibling
                  if (input?.value) onPlayLevel?.(parseInt(input.value), { isAdminTest: true })
                }} style={{ padding:'9px 16px', background:'#EF4444', color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                  Jump →
                </button>
              </div>
            </div>
          )}

          {/* Winding path of nodes */}
          <div style={{ position:'relative', zIndex:2 }}>
            {section.levels.map((level, i) => (
              <LevelNode
                key={level}
                level={level}
                status={getStatus(level)}
                stars={stars[level] || 0}
                cost={null}
                isLeft={i % 2 === 0}
                universe={section.universe}
                onClick={() => handleNodeClick(level)}
              />
            ))}
          </div>
        </div>
      ))}

      <div style={{ background:'#0A0A14', padding:'24px 16px', textAlign:'center' }}>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>
          Endless worlds ahead — every 10 levels unlocks a new universe
        </p>
        <button onClick={() => navigate('/games')}
          style={{ padding:'10px 24px', background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:12, fontSize:12, cursor:'pointer' }}>
          ← Back to Games
        </button>
      </div>

      {/* Unlock with coins modal */}
      {unlockModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:200, padding:24 }}
          onClick={e => e.target===e.currentTarget && setUnlockModal(null)}>
          <div className="tryit-pop-in" style={{ background:'#1a1a2e', borderRadius:24, padding:28, maxWidth:300, textAlign:'center' }}>
            <p style={{ fontSize:40, marginBottom:8 }}>🔓</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', margin:'0 0 6px' }}>
              Unlock Level {unlockModal.level}?
            </p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:20 }}>
              Skip ahead instantly without completing earlier levels
            </p>
            <div style={{ background:'rgba(201,168,76,0.1)', border:`1px solid ${GOLD}44`, borderRadius:14, padding:14, marginBottom:18 }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28, color:GOLD, margin:0 }}>
                {unlockModal.cost}🪙
              </p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', margin:'4px 0 0' }}>
                Your balance: {coins||0}🪙
              </p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={confirmUnlock} disabled={unlocking || (coins||0) < unlockModal.cost}
                style={{ flex:1, padding:'12px', background: (coins||0) < unlockModal.cost ? '#475569' : GOLD,
                  color: (coins||0) < unlockModal.cost ? '#94A3B8' : '#1E3A5F', border:'none', borderRadius:12,
                  fontWeight:800, cursor: (coins||0) < unlockModal.cost ? 'not-allowed' : 'pointer' }}>
                {unlocking ? 'Unlocking...' : (coins||0) < unlockModal.cost ? 'Not Enough Coins' : 'Unlock Now'}
              </button>
              <button onClick={() => setUnlockModal(null)}
                style={{ padding:'12px 16px', background:'rgba(255,255,255,0.08)', color:'#fff', border:'none', borderRadius:12, cursor:'pointer' }}>
                Cancel
              </button>
            </div>
            {(coins||0) < unlockModal.cost && (
              <button onClick={() => navigate('/wallet')}
                style={{ marginTop:10, background:'none', border:'none', color:GOLD, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                💡 No coins? Complete a test to earn some — or buy coins →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}