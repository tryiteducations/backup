// FILE: src/pages/games/GamesHub.jsx
// TryIT — Games Hub (catalog-driven, unlimited games via games_catalog table)
// Route: /games
// Tier gating EXACTLY matches theme system: Free=4, Pro=+10 (14 total), Ultra=all (24 total)
// Exam-aware pinning: student's enrolled exam surfaces relevant games first
// Any user can play any game — pinning is suggestion only, never a lock beyond tier.
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { getMomentumInfo, hasCompletedDailyChallenge } from '../../lib/gameEngine'
import { injectGameStyles } from '../../lib/gameJuice'

const NAVY='#1E3A5F', GOLD='#C9A84C', BG='#F8FAFC'

const TEMPLATE_ROUTES = {
  blitz_quiz:      (id) => id==='gk_blitz' ? '/games/gk-blitz' : id==='word_rush' ? '/games/word-rush' :
                            id==='daily_challenge' ? '/games/daily-challenge' : id==='sports_mastery' ? '/games/sports-mastery' :
                            id==='current_affairs' ? '/games/current-affairs' : id==='battle' ? '/games/battle' :
                            id==='speed_reading' ? '/games/speed-reading' : id==='case_cracker' ? '/games/case-cracker' :
                            id==='word_power' ? '/games/word-power' : `/games/play/${id}`,
  speed_calculate: (id) => id==='math_blitz' ? '/games/math-blitz' : id==='reaction_rush' ? '/games/reaction-rush' :
                            id==='grammar_gauntlet' ? '/games/grammar-gauntlet' : `/games/calc/${id}`,
  pattern_series:  (id) => id==='logic_grid' ? '/games/logic-grid' : id==='number_series' ? '/games/number-series' :
                            id==='circuit_logic' ? '/games/circuit-logic' : `/games/pattern/${id}`,
  memory_match:    (id) => `/games/memory/${id}`,
  visual_identify: (id) => `/games/visual/${id}`,
}

function getRoute(game) {
  const fn = TEMPLATE_ROUTES[game.template_id]
  return fn ? fn(game.game_id) : `/games/play/${game.game_id}`
}

const MOCK_CATALOG = [
  // FREE (4 — matches free theme count)
  { game_id:'gk_blitz', name:'GK Blitz', emoji:'🇮🇳', description:'10 GK questions, 60 seconds', color:'#1D4ED8', tier_required:'free', exam_tags:['all'], template_id:'blitz_quiz' },
  { game_id:'math_blitz', name:'Math Blitz', emoji:'➗', description:'Speed arithmetic, 90 seconds', color:'#7C3AED', tier_required:'free', exam_tags:['all'], template_id:'speed_calculate' },
  { game_id:'word_rush', name:'Word Rush', emoji:'📝', description:'Vocabulary & idioms, 2 min', color:'#059669', tier_required:'free', exam_tags:['all'], template_id:'blitz_quiz' },
  { game_id:'daily_challenge', name:'Daily Challenge', emoji:'📅', description:'One fresh set every day', color:'#D97706', tier_required:'free', exam_tags:['all'], template_id:'blitz_quiz' },
  // PRO
  { game_id:'logic_grid', name:'Logic Grid', emoji:'🧩', description:'Seating, coding, puzzles', color:'#DC2626', tier_required:'pro', exam_tags:['all'], template_id:'pattern_series' },
  { game_id:'number_series', name:'Number Series', emoji:'🔢', description:'Pattern completion', color:'#0891B2', tier_required:'pro', exam_tags:['all'], template_id:'pattern_series' },
  { game_id:'memory_match', name:'Memory Match', emoji:'🧠', description:'GK facts & formulas pairing', color:'#0891B2', tier_required:'pro', exam_tags:['all'], template_id:'memory_match' },
  { game_id:'speed_reading', name:'Speed Reading', emoji:'📖', description:'RC passages under timer', color:'#059669', tier_required:'pro', exam_tags:['all'], template_id:'blitz_quiz' },
  { game_id:'sports_mastery', name:'Sports Mastery', emoji:'🏆', description:'Players, trophies, Olympics, records', color:'#EA580C', tier_required:'pro', exam_tags:['all'], template_id:'blitz_quiz' },
  { game_id:'current_affairs', name:'Current Affairs', emoji:'📰', description:'Last 14 days news', color:'#D97706', tier_required:'pro', exam_tags:['all'], template_id:'blitz_quiz' },
  { game_id:'battle', name:'1v1 Battle', emoji:'⚔️', description:'Live duel vs random student', color:'#C9A84C', tier_required:'pro', exam_tags:['all'], template_id:'blitz_quiz' },
  { game_id:'map_master', name:'Map Master', emoji:'🗺️', description:'Rivers, peaks, parks, states', color:'#16A34A', tier_required:'pro', exam_tags:['upsc','ssc','state_psc'], template_id:'visual_identify' },
  { game_id:'flag_frenzy', name:'Flag Frenzy', emoji:'🚩', description:'Identify world flags fast', color:'#1D4ED8', tier_required:'pro', exam_tags:['upsc','ielts'], template_id:'visual_identify' },
  { game_id:'world_capitals', name:'World Capitals', emoji:'🌍', description:'Match country to capital', color:'#0891B2', tier_required:'pro', exam_tags:['upsc','ielts'], template_id:'memory_match' },
  // ULTRA
  { game_id:'diagram_decode', name:'Diagram Decode', emoji:'🧬', description:'Label NCERT Biology diagrams', color:'#16A34A', tier_required:'ultra', exam_tags:['neet'], template_id:'visual_identify' },
  { game_id:'reaction_rush', name:'Reaction Rush', emoji:'⚗️', description:'Balance & identify reactions', color:'#7C3AED', tier_required:'ultra', exam_tags:['neet'], template_id:'speed_calculate' },
  { game_id:'formula_flash', name:'Formula Flash', emoji:'📐', description:'Physics/Maths formula recall', color:'#1D4ED8', tier_required:'ultra', exam_tags:['jee','gate'], template_id:'memory_match' },
  { game_id:'circuit_logic', name:'Circuit Logic', emoji:'🔧', description:'Logic gates & circuit puzzles', color:'#0891B2', tier_required:'ultra', exam_tags:['gate'], template_id:'pattern_series' },
  { game_id:'case_cracker', name:'Case Cracker', emoji:'⚖️', description:'Legal scenario reasoning', color:'#92400E', tier_required:'ultra', exam_tags:['clat'], template_id:'blitz_quiz' },
  { game_id:'legal_maxims', name:'Legal Maxims', emoji:'📜', description:'Match Latin maxims to meaning', color:'#92400E', tier_required:'ultra', exam_tags:['clat'], template_id:'memory_match' },
  { game_id:'grammar_gauntlet', name:'Grammar Gauntlet', emoji:'✍️', description:'Spot the error, rapid-fire', color:'#059669', tier_required:'ultra', exam_tags:['ielts'], template_id:'speed_calculate' },
  { game_id:'word_power', name:'Word Power', emoji:'🗣️', description:'Advanced academic vocabulary', color:'#059669', tier_required:'ultra', exam_tags:['ielts'], template_id:'blitz_quiz' },
  { game_id:'monument_match', name:'Monument Match', emoji:'🏛️', description:'Identify Indian monuments', color:'#92400E', tier_required:'ultra', exam_tags:['upsc','state_psc'], template_id:'visual_identify' },
  { game_id:'peak_pointer', name:'Peak Pointer', emoji:'🏔️', description:'Identify mountain peaks', color:'#16A34A', tier_required:'ultra', exam_tags:['upsc','ssc'], template_id:'visual_identify' },
]

const TIER_INFO = {
  free:  { label:'Free',  badge:'🆓', color:'#64748B' },
  pro:   { label:'Pro',   badge:'⭐', color:'#1D4ED8' },
  ultra: { label:'Ultra', badge:'🏆', color:'#92400E' },
}

const EXAM_LABELS = { neet:'NEET', jee:'JEE', gate:'GATE', clat:'CLAT', ielts:'IELTS', upsc:'UPSC', ssc:'SSC', state_psc:'State PSC' }

export default function GamesHub(){
  const navigate = useNavigate()
  const { user, planTier, coins } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [catalog, setCatalog] = useState(MOCK_CATALOG)
  const [filterTag, setFilterTag] = useState('all')
  const [search, setSearch] = useState('')
  const [momentum, setMomentum] = useState(null)
  const [dailyDone, setDailyDone] = useState(false)

  const isPro = planTier==='pro' || planTier==='ultra'
  const isUltra = planTier==='ultra'
  const userExams = user?.enrolled_exams || []  // e.g. ['neet'] or ['ssc_cgl']

  useEffect(() => {
    injectGameStyles()
    supabase.from('games_catalog').select('*').eq('is_active', true).order('tier_rank')
      .then(({ data }) => { if (data?.length) setCatalog(data) }).catch(() => {})

    if (user?.id) {
      supabase.from('momentum_log').select('*').eq('user_id', user.id).single()
        .then(({ data }) => setMomentum(data)).catch(() => {})
      hasCompletedDailyChallenge(user.id).then(setDailyDone)
    }
  }, [user?.id])

  const pinnedGames = useMemo(() => {
    // Games matching user's enrolled exam, surfaced first
    const tags = userExams.map(e => e.toLowerCase())
    if (!tags.length) return []
    return catalog.filter(g => g.exam_tags?.some(t => tags.includes(t)))
  }, [catalog, userExams])

  const filteredCatalog = useMemo(() => {
    let list = catalog
    if (filterTag !== 'all') list = list.filter(g => g.exam_tags?.includes(filterTag) || g.tier_required === filterTag)
    if (search) list = list.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.description?.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [catalog, filterTag, search])

  const grouped = {
    free:  filteredCatalog.filter(g => g.tier_required === 'free'),
    pro:   filteredCatalog.filter(g => g.tier_required === 'pro'),
    ultra: filteredCatalog.filter(g => g.tier_required === 'ultra'),
  }

  const canPlay = (game) => {
    if (isAdmin) return true  // god-mode: every tier unlocked for testing
    if (game.tier_required === 'free') return true
    if (game.tier_required === 'pro')  return isPro
    if (game.tier_required === 'ultra') return isUltra
    return false
  }

  const handlePlay = (game) => {
    if (!canPlay(game)) { navigate('/pro'); return }
    navigate(`/games/levels/${game.game_id}`)
  }

  const momentumInfo = getMomentumInfo(momentum?.current_level || 0)

  const allExamTags = ['all','neet','jee','gate','clat','ielts','upsc','ssc']

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'20px 16px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>←</button>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', margin:0 }}>🎮 Games</h1>
        </div>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:'0 0 14px' }}>
          {catalog.length}+ games · Sharpen your mind, raise your exam score
        </p>

        {isAdmin && (
          <div style={{ background:'rgba(220,38,38,0.2)', border:'1.5px solid #EF4444', borderRadius:10,
            padding:'8px 12px', marginBottom:10 }}>
            <p style={{ fontSize:11, fontWeight:800, color:'#FCA5A5', margin:0 }}>
              🛡️ ADMIN MODE — All tiers & levels unlocked for testing. No real coins spent.
            </p>
          </div>
        )}

        <div style={{ display:'flex', gap:8, marginBottom:10 }}>
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', flex:1 }}>
            <p style={{ fontWeight:800, color:GOLD, fontSize:16, margin:'0 0 1px' }}>{(coins||0).toLocaleString('en-IN')}🪙</p>
            <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>Coins</p>
          </div>
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', flex:1 }}>
            <p style={{ fontWeight:800, color:'#fff', fontSize:16, margin:'0 0 1px' }}>{TIER_INFO[planTier]?.badge} {TIER_INFO[planTier]?.label || 'Free'}</p>
            <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>Your Plan</p>
          </div>
          {momentumInfo.level > 0 && (
            <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', flex:1 }}>
              <p style={{ fontWeight:800, fontSize:16, margin:'0 0 1px' }}>{momentumInfo.emoji} {momentum?.consecutive_days||0}d</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>{momentumInfo.label}</p>
            </div>
          )}
        </div>

        <input
          placeholder="🔍 Search games..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'none',
            background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:13, boxSizing:'border-box', outline:'none' }}
        />
      </div>

      {/* Daily Challenge banner — always pinned at top */}
      {!dailyDone && (
        <div onClick={() => navigate('/games/daily-challenge')}
          style={{ margin:'14px 16px 0', background:`linear-gradient(135deg,#D97706,#92400E)`, borderRadius:16,
            padding:'14px 16px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
          <span style={{ fontSize:28 }}>📅</span>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:800, color:'#fff', fontSize:14, margin:0 }}>Today's Daily Challenge waiting!</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', margin:0 }}>5 questions · Builds your Momentum streak</p>
          </div>
          <span style={{ color:'#fff', fontSize:16 }}>→</span>
        </div>
      )}

      {/* Pinned for your exam */}
      {pinnedGames.length > 0 && (
        <div style={{ padding:'16px 16px 0' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:1, marginBottom:10 }}>
            🎯 GAMES FOR YOUR EXAM
          </p>
          <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:8 }}>
            {pinnedGames.map(g => (
              <div key={g.game_id} onClick={() => handlePlay(g)}
                style={{ minWidth:140, background:g.color, borderRadius:14, padding:'14px 12px',
                  cursor:'pointer', flexShrink:0, opacity:canPlay(g)?1:0.5 }}>
                <p style={{ fontSize:24, margin:'0 0 6px' }}>{g.emoji}</p>
                <p style={{ fontSize:12, fontWeight:800, color:'#fff', margin:0 }}>{g.name}</p>
                {!canPlay(g) && <p style={{ fontSize:9, color:'#fff', margin:'4px 0 0' }}>{TIER_INFO[g.tier_required].badge} Locked</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam tag filters */}
      <div style={{ padding:'14px 16px 0', display:'flex', gap:6, overflowX:'auto' }}>
        {allExamTags.map(tag => (
          <button key={tag} onClick={() => setFilterTag(tag)}
            style={{ padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
              background: filterTag===tag ? NAVY : '#fff', color: filterTag===tag ? '#fff' : '#64748B',
              border: filterTag===tag ? 'none' : '1.5px solid #E2E8F0' }}>
            {tag==='all' ? '🎮 All' : EXAM_LABELS[tag] || tag}
          </button>
        ))}
      </div>

      <div style={{ padding:16, maxWidth:520, margin:'0 auto' }}>

        {/* FREE TIER */}
        {grouped.free.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:12, fontWeight:800, color:'#64748B', marginBottom:10 }}>🆓 FREE — Available to Everyone</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {grouped.free.map(g => <GameCard key={g.game_id} game={g} canPlay onPlay={() => handlePlay(g)} />)}
            </div>
          </div>
        )}

        {/* PRO TIER */}
        {grouped.pro.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:800, color:'#1D4ED8', margin:0 }}>⭐ PRO — {grouped.pro.length} Games</p>
              {!isPro && <button onClick={() => navigate('/pro')} style={{ fontSize:11, color:'#1D4ED8', background:'none', border:'none', fontWeight:700, cursor:'pointer' }}>Unlock →</button>}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {grouped.pro.map(g => <GameCard key={g.game_id} game={g} canPlay={isPro} onPlay={() => handlePlay(g)} />)}
            </div>
          </div>
        )}

        {/* ULTRA TIER */}
        {grouped.ultra.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:800, color:'#92400E', margin:0 }}>🏆 ULTRA — {grouped.ultra.length} Games (Exam-Specialized)</p>
              {!isUltra && <button onClick={() => navigate('/pro')} style={{ fontSize:11, color:'#92400E', background:'none', border:'none', fontWeight:700, cursor:'pointer' }}>Unlock →</button>}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {grouped.ultra.map(g => <GameCard key={g.game_id} game={g} canPlay={isUltra} onPlay={() => handlePlay(g)} />)}
            </div>
          </div>
        )}

        {filteredCatalog.length === 0 && (
          <div style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>
            <p style={{ fontSize:28 }}>🔍</p><p>No games match your search.</p>
          </div>
        )}

        {/* Coming soon — community driven */}
        <div style={{ background:'#fff', borderRadius:14, padding:14, border:'1.5px dashed #E2E8F0', textAlign:'center', marginTop:8 }}>
          <p style={{ fontSize:24, marginBottom:4 }}>🔜</p>
          <p style={{ fontSize:13, fontWeight:700, color:'#94A3B8', margin:'0 0 2px' }}>Unlimited games keep coming</p>
          <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>New games added regularly — vote for what's next!</p>
          <button onClick={() => navigate('/community')}
            style={{ marginTop:10, padding:'8px 16px', background:BG, color:NAVY, border:`1.5px solid ${NAVY}22`, borderRadius:8, fontSize:11, fontWeight:600, cursor:'pointer' }}>
            Vote for next game →
          </button>
        </div>
      </div>
    </div>
  )
}

function GameCard({ game, canPlay, onPlay }) {
  return (
    <div onClick={onPlay}
      className={!canPlay ? 'tryit-shimmer-locked' : ''}
      style={{ borderRadius:16, overflow:'hidden', cursor:'pointer', opacity:canPlay?1:0.75, position:'relative',
        transform: canPlay ? 'none' : 'none', transition:'transform 0.15s' }}
      onMouseDown={e => canPlay && (e.currentTarget.style.transform='scale(0.97)')}
      onMouseUp={e => canPlay && (e.currentTarget.style.transform='scale(1)')}>
      <div style={{ background:`linear-gradient(135deg,${game.color},${game.color}cc)`, padding:'14px 12px', minHeight:120, position:'relative' }}>
        {!canPlay && (
          <span style={{ position:'absolute', top:8, right:8, fontSize:16, filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}>🔒</span>
        )}
        <p style={{ fontSize:28, margin:'0 0 8px' }}>{game.emoji}</p>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:13, color:'#fff', margin:'0 0 4px' }}>{game.name}</p>
        <p style={{ fontSize:10, color:'rgba(255,255,255,0.8)', margin:0, lineHeight:1.4 }}>{game.description}</p>
      </div>
    </div>
  )
}