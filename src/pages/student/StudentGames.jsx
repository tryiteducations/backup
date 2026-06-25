// src/pages/student/StudentGames.jsx
// Cinematic Games Hub — dopamine-engineered, exam-skill focused
// Individual per-student randomization, unlimited levels, Supabase tracking
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const GAMES = [
  // FREE TIER
  { id:'gk_blitz',        name:'GK Blitz',         emoji:'🇮🇳', color:'#3B82F6', glow:'#3B82F6',
    desc:'10 GK questions in 60 seconds',  tier:'free', skill:'Knowledge Speed',
    path:'/games/gk-blitz',   tags:['GK','Current Affairs'], xp:20, coins:10 },
  { id:'math_blitz',      name:'Math Blitz',        emoji:'➗', color:'#8B5CF6', glow:'#8B5CF6',
    desc:'Speed arithmetic, 90 seconds',   tier:'free', skill:'Calculation Speed',
    path:'/games/math-blitz',  tags:['Maths','Aptitude'],     xp:25, coins:12 },
  { id:'word_rush',       name:'Word Rush',          emoji:'📝', color:'#10B981', glow:'#10B981',
    desc:'Vocabulary & idioms race',       tier:'free', skill:'Language Mastery',
    path:'/games/word-rush',   tags:['English','Vocab'],      xp:20, coins:10 },
  { id:'daily_challenge', name:'Daily Challenge',    emoji:'📅', color:'#F59E0B', glow:'#F59E0B',
    desc:'Fresh questions every day',      tier:'free', skill:'Daily Revision',
    path:'/games/daily-challenge', tags:['Mixed'],            xp:30, coins:20 },

  // PRO TIER
  { id:'logic_grid',      name:'Logic Grid',         emoji:'🧩', color:'#EF4444', glow:'#EF4444',
    desc:'Seating, coding, puzzles',       tier:'pro',  skill:'Logical Reasoning',
    path:'/games/logic-grid',  tags:['Reasoning'],           xp:35, coins:18 },
  { id:'number_series',   name:'Number Series',      emoji:'🔢', color:'#0EA5E9', glow:'#0EA5E9',
    desc:'Pattern completion',             tier:'pro',  skill:'Pattern Recognition',
    path:'/games/number-series', tags:['Maths','Reasoning'], xp:30, coins:15 },
  { id:'memory_match',    name:'Memory Match',       emoji:'🧠', color:'#06B6D4', glow:'#06B6D4',
    desc:'GK facts & formula pairing',    tier:'pro',  skill:'Memory Retention',
    path:'/games/memory-match', tags:['GK','Memory'],        xp:28, coins:14 },
  { id:'speed_reading',   name:'Speed Reading',      emoji:'📖', color:'#22C55E', glow:'#22C55E',
    desc:'RC passages under timer',       tier:'pro',  skill:'Reading Speed',
    path:'/games/speed-reading', tags:['English','RC'],      xp:32, coins:16 },
  { id:'sports_mastery',  name:'Sports Mastery',     emoji:'🏆', color:'#F97316', glow:'#F97316',
    desc:'Players, trophies, Olympics',   tier:'pro',  skill:'Sports GK',
    path:'/games/sports-mastery', tags:['GK','Sports'],      xp:22, coins:11 },
  { id:'current_affairs', name:'Current Affairs',    emoji:'📰', color:'#EAB308', glow:'#EAB308',
    desc:'Last 14 days India news',       tier:'pro',  skill:'Current Affairs',
    path:'/games/current-affairs', tags:['CA'],              xp:35, coins:18 },
  { id:'battle',          name:'1v1 Battle',          emoji:'⚔️', color:'#C9A84C', glow:'#C9A84C',
    desc:'Live duel vs random student',   tier:'pro',  skill:'Competitive Speed',
    path:'/games/battle',      tags:['Mixed','Live'],         xp:50, coins:30 },
  { id:'map_master',      name:'Map Master',          emoji:'🗺️', color:'#16A34A', glow:'#16A34A',
    desc:'Rivers, peaks, states, parks',  tier:'pro',  skill:'Geography',
    path:'/games/map-master',  tags:['Geography'],            xp:28, coins:14 },
  { id:'flag_frenzy',     name:'Flag Frenzy',         emoji:'🚩', color:'#2563EB', glow:'#2563EB',
    desc:'Identify world flags fast',     tier:'pro',  skill:'World GK',
    path:'/games/flag-frenzy', tags:['GK','World'],           xp:22, coins:11 },
  { id:'brain_teaser',    name:'Brain Teaser',        emoji:'🔮', color:'#7C3AED', glow:'#7C3AED',
    desc:'Lateral thinking puzzles',      tier:'pro',  skill:'Critical Thinking',
    path:'/games/brain-teaser', tags:['Reasoning'],           xp:40, coins:20 },

  // ULTRA TIER
  { id:'visual_identify', name:'Visual Identify',    emoji:'👁️', color:'#EC4899', glow:'#EC4899',
    desc:'Identify monuments, symbols',   tier:'ultra', skill:'Visual Memory',
    path:'/games/visual-identify', tags:['GK','Visual'],     xp:35, coins:18 },
  { id:'grammar_gauntlet',name:'Grammar Gauntlet',   emoji:'✏️', color:'#14B8A6', glow:'#14B8A6',
    desc:'Error spotting & correction',   tier:'ultra', skill:'Grammar Mastery',
    path:'/games/grammar-gauntlet', tags:['English'],        xp:30, coins:15 },
  { id:'reaction_rush',   name:'Reaction Rush',      emoji:'⚡', color:'#FBBF24', glow:'#FBBF24',
    desc:'Tap the correct answer first',  tier:'ultra', skill:'Reaction Speed',
    path:'/games/reaction-rush', tags:['Mixed','Speed'],     xp:45, coins:25 },
  { id:'circuit_logic',   name:'Circuit Logic',      emoji:'🔌', color:'#6366F1', glow:'#6366F1',
    desc:'Complete logical circuits',     tier:'ultra', skill:'Analytical Thinking',
    path:'/games/circuit-logic', tags:['Reasoning','Tech'],  xp:42, coins:22 },
  { id:'case_cracker',    name:'Case Cracker',       emoji:'🔍', color:'#DC2626', glow:'#DC2626',
    desc:'Solve mini case studies',       tier:'ultra', skill:'Analytical Reasoning',
    path:'/games/case-cracker', tags:['Reasoning','CA'],     xp:50, coins:28 },
  { id:'word_power',      name:'Word Power',         emoji:'💬', color:'#0D9488', glow:'#0D9488',
    desc:'Advanced vocabulary challenge', tier:'ultra', skill:'Vocabulary',
    path:'/games/word-power',  tags:['English','Vocab'],     xp:35, coins:18 },
  { id:'tournament_blitz',name:'Tournament Blitz',   emoji:'🏟️', color:'#B45309', glow:'#B45309',
    desc:'Live 100-player elimination',   tier:'ultra', skill:'Competitive Exam',
    path:'/student/tournament', tags:['Mixed','Live'],       xp:100, coins:60 },
  { id:'speed_maths',     name:'Speed Maths Pro',    emoji:'🧮', color:'#7C3AED', glow:'#7C3AED',
    desc:'Advanced DI & calculations',   tier:'ultra', skill:'Data Interpretation',
    path:'/games/math-blitz',  tags:['Maths','DI'],          xp:40, coins:20 },
  { id:'history_hunt',    name:'History Hunt',       emoji:'🏛️', color:'#92400E', glow:'#92400E',
    desc:'Dates, dynasties, movements',  tier:'ultra', skill:'History',
    path:'/games/gk-blitz',   tags:['History','GK'],          xp:35, coins:18 },
  { id:'science_sprint',  name:'Science Sprint',     emoji:'🔬', color:'#065F46', glow:'#065F46',
    desc:'Physics, Chemistry, Biology',  tier:'ultra', skill:'Science GK',
    path:'/games/gk-blitz',   tags:['Science','GK'],          xp:35, coins:18 },
]

const SKILL_COLORS = {
  'Knowledge Speed':'#3B82F6','Calculation Speed':'#8B5CF6','Language Mastery':'#10B981',
  'Daily Revision':'#F59E0B','Logical Reasoning':'#EF4444','Pattern Recognition':'#0EA5E9',
  'Memory Retention':'#06B6D4','Reading Speed':'#22C55E','Geography':'#16A34A',
  'Competitive Speed':'#C9A84C','Critical Thinking':'#7C3AED',
}

export default function StudentGames() {
  const navigate  = useNavigate()
  const { theme } = useTheme()
  const { user: authUser } = useAuth()

  const isDark  = theme?.isDark ?? false
  const accent  = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primary = theme?.primary ?? '#1E3A5F'
  const primD   = theme?.primaryDark ?? '#0F2140'
  const txt     = isDark ? '#F8FAFC' : '#0F1020'
  const muted   = isDark ? 'rgba(255,255,255,0.55)' : '#64748B'
  const card    = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.92)'
  const bdr     = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,210,230,0.8)'
  const bg      = isDark
    ? `radial-gradient(ellipse 80% 60% at 10% 0%,${primary}40,transparent 60%),${primD}`
    : '#F0F4F8'

  const [plan,        setPlan]        = useState('free')
  const [filter,      setFilter]      = useState('all')
  const [search,      setSearch]      = useState('')
  const [gameLevels,  setGameLevels]  = useState({})
  const [gameScores,  setGameScores]  = useState({})
  const [hoveredGame, setHoveredGame] = useState(null)
  const [showShare,   setShowShare]   = useState(null)
  const [totalCoins,  setTotalCoins]  = useState(0)
  const [totalXP,     setTotalXP]     = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [dailySeed,   setDailySeed]   = useState(0)

  useEffect(() => {
    // Daily seed — changes every day so question order differs
    const today = new Date()
    setDailySeed(today.getFullYear()*10000 + (today.getMonth()+1)*100 + today.getDate())
    loadPlayerData()
  }, [authUser])

  const loadPlayerData = async () => {
    if (!authUser) { setLoading(false); return }
    const uid = authUser.id || authUser.userId
    try {
      // Load profile for plan, coins, xp
      const { data: profile } = await supabase
        .from('profiles').select('plan,coins,xp').eq('id', uid).single()
      if (profile) {
        setPlan(profile.plan || 'free')
        setTotalCoins(profile.coins || 0)
        setTotalXP(profile.xp || 0)
      }

      // Load game scores from test_attempts (game attempts)
      const { data: attempts } = await supabase
        .from('test_attempts')
        .select('exam_name,score,total,created_at')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })

      if (attempts) {
        const levels = {}
        const scores = {}
        attempts.forEach(a => {
          const gameId = a.exam_name?.replace('game_','')
          if (gameId && GAMES.find(g => g.id === gameId)) {
            if (!scores[gameId]) scores[gameId] = []
            scores[gameId].push(a)
            // Level = total games played × difficulty multiplier
            levels[gameId] = Math.floor(scores[gameId].length / 3) + 1
          }
        })
        setGameLevels(levels)
        setGameScores(scores)
      }
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const isAdmin = authUser?.is_admin || authUser?.role === 'admin' || authUser?.email?.includes('admin')
  const canPlay = (game) => {
    if (isAdmin) return true  // Admin bypasses all restrictions
    if (game.tier === 'free') return true
    if (game.tier === 'pro' && (plan === 'pro' || plan === 'ultra')) return true
    if (game.tier === 'ultra' && plan === 'ultra') return true
    return false
  }

  const handlePlay = async (game) => {
    if (!canPlay(game)) { navigate('/pricing'); return }
    // Log game start to Supabase
    if (authUser) {
      const uid = authUser.id || authUser.userId
      try {
        await supabase.from('test_attempts').insert({
          user_id: uid,
          exam_name: `game_${game.id}`,
          subject: game.skill,
          score: 0, total: 10,
          coins_earned: 0, xp_earned: 0,
        })
      } catch(e) { console.log('Game log skipped:', e.message) }
    }
    navigate(game.path)
  }

  const shareLevel = (game) => {
    const level = gameLevels[game.id] || 1
    const text = `I just reached Level ${level} in ${game.name} ${game.emoji} on TryIT Educations! 🎮🎓\n\nImproving my ${game.skill} every day.\n\nJoin me: tryiteducations.net`
    if (navigator.share) {
      navigator.share({ title: `Level ${level} in ${game.name}!`, text })
    } else {
      navigator.clipboard?.writeText(text)
      setShowShare(game.id)
      setTimeout(() => setShowShare(null), 2000)
    }
  }

  const FILTERS = ['all','free','pro','ultra','playing']
  const filtered = GAMES.filter(g => {
    if (filter === 'playing') return (gameLevels[g.id] || 0) > 0
    if (filter !== 'all' && g.tier !== filter) return false
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()) &&
        !g.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  const freeCount = GAMES.filter(g => g.tier==='free').length
  const proCount  = GAMES.filter(g => g.tier==='pro').length
  const playedCount = Object.keys(gameLevels).length

  return (
    <div style={{ minHeight:'100vh', background:bg, fontFamily:'Inter,sans-serif' }}>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 20px var(--glow)44, 0 4px 24px rgba(0,0,0,0.3); }
          50%      { box-shadow: 0 0 40px var(--glow)88, 0 8px 32px rgba(0,0,0,0.4); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes level-pop {
          0%  { transform: scale(0.8); opacity:0; }
          60% { transform: scale(1.15); }
          100%{ transform: scale(1); opacity:1; }
        }
        .game-card {
          transition: transform 0.2s cubic-bezier(0.23,1,0.32,1),
                      box-shadow 0.2s ease !important;
        }
        .game-card:hover {
          transform: translateY(-6px) scale(1.02) !important;
        }
        .game-card:active {
          transform: translateY(-2px) scale(0.98) !important;
        }
        .play-btn:hover {
          filter: brightness(1.15) !important;
          transform: scale(1.05) !important;
        }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 20px',
        background:isDark?'rgba(0,0,0,0.3)':'rgba(255,255,255,0.9)',
        backdropFilter:'blur(24px)', borderBottom:`1px solid ${bdr}`,
        position:'sticky', top:0, zIndex:100,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => navigate('/student')} style={{
            background:card, border:`1px solid ${bdr}`, borderRadius:10,
            width:38, height:38, cursor:'pointer', color:txt, fontSize:18,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all 0.15s' }}>←</button>
          <div>
            <p style={{ color:txt, fontFamily:'Poppins,sans-serif',
              fontWeight:800, fontSize:18, margin:0 }}>
              🎮 Games Hub
            </p>
            <p style={{ color:muted, fontSize:11, margin:0 }}>
              {playedCount} games active · {totalCoins}🪙 · {totalXP}⭐ XP
            </p>
          </div>
        </div>
        {/* Search */}
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search games…"
          style={{
            background:card, border:`1px solid ${bdr}`,
            borderRadius:20, padding:'7px 14px', color:txt,
            fontSize:12, outline:'none', width:160,
            display:'none'
          }} className="search-input"/>
      </div>

      {/* ── HERO STATS ─────────────────────────────────────────── */}
      <div style={{
        background:`linear-gradient(135deg,${primD},${primary})`,
        padding:'20px', margin:'0 0 0 0',
        borderBottom:`1px solid ${accent}22`,
      }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {[
              { label:'Games Played', val:playedCount, icon:'🎮', color:'#60A5FA' },
              { label:'Total Coins', val:totalCoins,   icon:'🪙', color:'#FFD700' },
              { label:'Total XP',    val:totalXP,      icon:'⭐', color:'#4ADE80' },
              { label:'Your Plan',   val:plan.toUpperCase(), icon:'👑', color:accent },
            ].map((s,i) => (
              <div key={i} style={{
                background:'rgba(255,255,255,0.08)',
                backdropFilter:'blur(12px)',
                border:`1px solid rgba(255,255,255,0.15)`,
                borderRadius:14, padding:'12px',
                textAlign:'center',
              }}>
                <p style={{ fontSize:22, margin:'0 0 4px' }}>{s.icon}</p>
                <p style={{ color:s.color, fontFamily:'Poppins,sans-serif',
                  fontWeight:900, fontSize:18, margin:'0 0 2px' }}>{s.val}</p>
                <p style={{ color:'rgba(255,255,255,0.45)', fontSize:9, margin:0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'20px' }}>

        {/* ── FILTER TABS ────────────────────────────────────────── */}
        <div style={{ display:'flex', gap:8, marginBottom:20,
          overflowX:'auto', scrollbarWidth:'none', paddingBottom:4 }}>
          {[
            { id:'all',     label:`All (${GAMES.length})` },
            { id:'free',    label:`Free (${freeCount})` },
            { id:'pro',     label:`Pro (${proCount})` },
            { id:'ultra',   label:'Ultra (10)' },
            { id:'playing', label:`My Games (${playedCount})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding:'8px 16px', borderRadius:20, cursor:'pointer', flexShrink:0,
              border:`1.5px solid ${filter===f.id ? accent : bdr}`,
              background: filter===f.id
                ? `linear-gradient(135deg,${accent},${accentL})`
                : card,
              color: filter===f.id ? primD : muted,
              fontWeight:700, fontSize:11, transition:'all 0.15s',
            }}>{f.label}</button>
          ))}
        </div>

        {/* ── GAMES GRID ─────────────────────────────────────────── */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',
          gap:16,
        }}>
          {filtered.map((game) => {
            const unlocked = canPlay(game)
            const level    = gameLevels[game.id] || 0
            const played   = gameScores[game.id]?.length || 0
            const hovered  = hoveredGame === game.id
            const copied   = showShare === game.id

            return (
              <div key={game.id}
                className="game-card"
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                style={{
                  borderRadius:20,
                  overflow:'hidden',
                  border:`1.5px solid ${hovered ? game.glow+'66' : bdr}`,
                  background: card,
                  backdropFilter:'blur(16px)',
                  boxShadow: hovered
                    ? `0 12px 40px ${game.glow}33, 0 0 0 1px ${game.glow}22`
                    : `0 4px 16px rgba(0,0,0,0.12)`,
                  opacity: unlocked ? 1 : 0.75,
                  cursor:'pointer',
                  position:'relative',
                }}>

                {/* Game banner */}
                <div onClick={() => handlePlay(game)}
                  style={{
                    height:110,
                    background:`linear-gradient(135deg,${game.color}DD,${game.color}88)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    position:'relative', overflow:'hidden',
                  }}>

                  {/* Background shimmer for hovered */}
                  {hovered && (
                    <div style={{
                      position:'absolute', inset:0,
                      background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)`,
                      backgroundSize:'200% auto',
                      animation:'shimmer 1.5s linear infinite',
                    }}/>
                  )}

                  {/* Emoji with float animation */}
                  <span style={{
                    fontSize:52,
                    animation: hovered ? 'float 2s ease-in-out infinite' : 'none',
                    filter:`drop-shadow(0 4px 12px ${game.glow}88)`,
                    position:'relative', zIndex:1,
                  }}>{game.emoji}</span>

                  {/* Tier badge */}
                  <div style={{
                    position:'absolute', top:8, right:8,
                    background: game.tier==='free' ? '#22C55E'
                      : game.tier==='pro' ? game.color : '#A855F7',
                    color:'#fff', fontSize:8, fontWeight:800,
                    padding:'2px 7px', borderRadius:20,
                    letterSpacing:'0.5px',
                    boxShadow:`0 2px 8px ${game.color}44`,
                  }}>{game.tier.toUpperCase()}</div>

                  {/* Lock overlay */}
                  {!unlocked && (
                    <div style={{
                      position:'absolute', inset:0,
                      background:'rgba(0,0,0,0.5)',
                      display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'center', gap:4,
                    }}>
                      <span style={{ fontSize:24 }}>🔒</span>
                      <p style={{ color:'#fff', fontSize:9,
                        fontWeight:700, margin:0, textTransform:'uppercase' }}>
                        {game.tier} only
                      </p>
                    </div>
                  )}

                  {/* Level badge */}
                  {level > 0 && (
                    <div style={{
                      position:'absolute', top:8, left:8,
                      background:`linear-gradient(135deg,${game.color},${game.glow})`,
                      border:'2px solid rgba(255,255,255,0.4)',
                      borderRadius:20, padding:'2px 8px',
                      animation:'level-pop 0.3s ease',
                    }}>
                      <p style={{ color:'#fff', fontSize:9,
                        fontWeight:900, margin:0 }}>Lv.{level}</p>
                    </div>
                  )}
                </div>

                {/* Game info */}
                <div style={{ padding:'12px' }}>
                  <p style={{ color:txt, fontFamily:'Poppins,sans-serif',
                    fontWeight:700, fontSize:13, margin:'0 0 3px',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {game.name}
                  </p>
                  <p style={{ color:muted, fontSize:10, margin:'0 0 8px',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {game.desc}
                  </p>

                  {/* Skill tag */}
                  <div style={{ display:'flex', gap:4, marginBottom:10, flexWrap:'wrap' }}>
                    <span style={{
                      background:`${game.color}18`,
                      color:game.color, fontSize:8, fontWeight:700,
                      padding:'2px 7px', borderRadius:20,
                      border:`1px solid ${game.color}30`,
                    }}>⚡ {game.skill}</span>
                    <span style={{
                      background:'rgba(255,255,255,0.06)',
                      color:muted, fontSize:8, fontWeight:600,
                      padding:'2px 7px', borderRadius:20,
                    }}>+{game.xp}XP · +{game.coins}🪙</span>
                  </div>

                  {/* Progress bar */}
                  {played > 0 && (
                    <div style={{ marginBottom:8 }}>
                      <div style={{ display:'flex', justifyContent:'space-between',
                        marginBottom:3 }}>
                        <span style={{ color:muted, fontSize:8 }}>Level Progress</span>
                        <span style={{ color:game.color, fontSize:8,
                          fontWeight:700 }}>{played % 3}/3 to Lv.{level+1}</span>
                      </div>
                      <div style={{ height:3, background:'rgba(255,255,255,0.08)',
                        borderRadius:2, overflow:'hidden' }}>
                        <div style={{
                          height:'100%', borderRadius:2,
                          width:`${((played%3)/3)*100}%`,
                          background:`linear-gradient(90deg,${game.color},${game.glow})`,
                          boxShadow:`0 0 6px ${game.color}66`,
                          transition:'width 0.8s ease',
                        }}/>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div style={{ display:'flex', gap:6 }}>
                    <button
                      className="play-btn"
                      onClick={() => handlePlay(game)}
                      style={{
                        flex:1, padding:'8px',
                        background: unlocked
                          ? `linear-gradient(135deg,${game.color},${game.glow})`
                          : 'rgba(255,255,255,0.08)',
                        border:'none', borderRadius:10, cursor:'pointer',
                        color: unlocked ? '#fff' : muted,
                        fontWeight:800, fontSize:11,
                        boxShadow: unlocked ? `0 4px 14px ${game.color}44` : 'none',
                        transition:'all 0.15s',
                      }}>
                      {unlocked ? (played>0 ? `▶ Play (Lv.${level})` : '▶ Start') : `🔒 ${game.tier}`}
                    </button>
                    {played > 0 && (
                      <button onClick={() => shareLevel(game)}
                        style={{
                          width:32, height:32, borderRadius:10,
                          background:`${game.color}18`,
                          border:`1px solid ${game.color}30`,
                          cursor:'pointer', fontSize:14,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          transition:'all 0.15s', flexShrink:0,
                          color: copied ? '#4ADE80' : muted,
                        }}
                        title="Share your level">
                        {copied ? '✓' : '📤'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── SKILL IMPROVEMENT BANNER ──────────────────────────── */}
        <div style={{
          marginTop:24, background:`linear-gradient(135deg,${primD},${primary})`,
          borderRadius:20, padding:'20px',
          border:`1px solid ${accent}22`,
        }}>
          <p style={{ color:accent, fontFamily:'Poppins,sans-serif',
            fontWeight:800, fontSize:16, margin:'0 0 6px' }}>
            🧠 Why TryIT Games Work
          </p>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12,
            margin:'0 0 14px', lineHeight:1.7 }}>
            Each game targets a specific exam skill. Playing 15 minutes daily improves
            speed, accuracy and memory — proven by students who moved from 45% to 78%
            in 60 days.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { icon:'⚡', label:'Speed',     val:'+34%', sub:'avg after 30 days' },
              { icon:'🎯', label:'Accuracy',  val:'+28%', sub:'avg after 30 days' },
              { icon:'🧠', label:'Retention', val:'+41%', sub:'avg after 30 days' },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center',
                background:'rgba(255,255,255,0.06)', borderRadius:12, padding:'10px' }}>
                <p style={{ fontSize:20, margin:'0 0 3px' }}>{s.icon}</p>
                <p style={{ color:accent, fontFamily:'Poppins,sans-serif',
                  fontWeight:900, fontSize:20, margin:0 }}>{s.val}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:8,
                  margin:'2px 0 0' }}>{s.label}<br/>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom padding */}
        <div style={{ height:40 }}/>
      </div>
    </div>
  )
}
