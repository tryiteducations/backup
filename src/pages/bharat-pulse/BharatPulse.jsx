// FILE: src/pages/bharat-pulse/BharatPulse.jsx
// Bharat Pulse — 1 Day 1 Story from across India
// Route: /bharat-pulse
import { useState, useEffect, useRef } from 'react'
import { useNavigate }    from 'react-router-dom'
import { useAuth }        from '../../context/AuthContext'
import { supabase }       from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#0D0D0D' // Dark by default — premium feel

// ── REGION CONFIG ──────────────────────────────────────────────────────────
const REGION_META = {
  south:         { emoji:'🌴', label:'South India',    gradient:['#134E4A','#065F46'] },
  central:       { emoji:'🏯', label:'Central India',   gradient:['#1E3A5F','#1D4ED8'] },
  north:         { emoji:'🏔️', label:'North India',     gradient:['#4C1D95','#7C3AED'] },
  northeast:     { emoji:'🌿', label:'Northeast India', gradient:['#064E3B','#059669'] },
  west:          { emoji:'🌊', label:'West India',      gradient:['#7C2D12','#DC2626'] },
  east:          { emoji:'🎨', label:'East India',      gradient:['#831843','#DB2777'] },
  jammu_kashmir: { emoji:'❄️', label:'J&K & Ladakh',   gradient:['#1E3A5F','#0C4A6E'] },
  pan_india:     { emoji:'🇮🇳', label:'Pan India',      gradient:['#14532D','#1E3A5F'] },
}

const STORY_TYPE_LABELS = {
  padma_award:       '🏅 Padma Award',
  military_award:    '🎖️ Military Hero',
  state_award:       '🏆 State Honour',
  unsung_hero:       '⭐ Unsung Hero',
  festival:          '🎉 Festival',
  tribal_function:   '🎭 Tribal Heritage',
  environmental_hero:'🌿 Environmental Hero',
  medical_hero:      '❤️ Medical Hero',
  education_hero:    '📚 Education Hero',
  art_craft_master:  '🎨 Art & Craft',
  freedom_fighter:   '🇮🇳 Freedom Fighter',
  woman_achiever:    '👑 Women Achiever',
  social_reformer:   '✊ Social Reformer',
  rescue_hero:       '🆘 Rescue Hero',
  innovation_hero:   '💡 Innovator',
  sports_hero:       '🏆 Sports Hero',
  cultural_legend:   '🎵 Cultural Legend',
  food_tradition:    '🍽️ Food Tradition',
  architecture_heritage:'🏛️ Heritage',
  national_honour:   '🌟 National Honour',
}

// ── MOCK STORIES (shown if Supabase not connected yet) ────────────────────
const MOCK_STORY = {
  story_id: 'mock-1',
  publish_date: new Date().toISOString().slice(0,10),
  region: 'northeast',
  state_name: 'Assam',
  city_or_place: 'Majuli Island, Jorhat',
  story_type: 'environmental_hero',
  headline: 'The Man Who Planted a Forest — Alone — for 37 Years',
  subheadline: 'Jadav Payeng turned 550 acres of barren sandbar into a living forest',
  hook_line: 'While the world was moving forward, one man was moving earth.',
  hero_name: 'Jadav "Molai" Payeng',
  hero_age: 64,
  hero_designation: 'Forest Guard & Environmental Activist',
  hero_photo_url: null,
  thumbnail_url: null,
  cover_color: '#1a5c2a',
  content_blocks: [
    { type:'hero_quote', content:'I was only 16 when I first planted trees here. People said I was mad. Now they call me the Forest Man.', attribution:'Jadav Payeng, 2022' },
    { type:'paragraph', content:'In 1979, a devastating flood swept across Majuli island in Assam, leaving behind miles of barren sandbar. A 16-year-old boy named Jadav Payeng came across thousands of snakes dying in the heat — with no shade, no shelter, no hope. That image never left him.' },
    { type:'paragraph', content:'For the next 37 years — without a salary, without recognition, without any government support — Jadav planted trees. One tree at a time. Day after day. He built a bamboo hut in the middle of nowhere and lived there, tending his growing forest like a father tends his children.' },
    { type:'stat_fact', icon:'🌳', fact:'The forest Jadav created — called Molai Forest — is now 550 acres. Bigger than New York\'s Central Park.' },
    { type:'paragraph', content:'The forest became home to elephants, tigers, deer, rhinoceroses, and thousands of birds. In 2008, wildlife officials discovered this impossibly rich forest — and discovered it was planted entirely by one man.' },
    { type:'key_facts', facts:['Started planting at age 16 in 1979','Planted alone for 37 years','Molai Forest: 550 acres (bigger than Central Park)','Home to tigers, elephants, rhinos, deer, migratory birds','Padma Shri 2015 — 36 years after he started'] },
    { type:'exam_connect', exams:['UPSC GS Paper 3','SSC CGL GK','State PSC GK'], note:'Jadav Payeng is a frequently asked topic in Environment & Ecology. Padma Shri 2015, Molai Forest, Assam — all exam-ready facts.' },
    { type:'legacy_impact', content:'Today, Jadav teaches villagers about planting. A 16-year-old boy\'s "madness" has become proof that one person can change the world.' }
  ],
  award_name: 'Padma Shri',
  award_year: 2015,
  exam_topics: ['awards_padma','environment_conservation','india_northeast'],
  exam_connection: 'High-frequency topic in UPSC GS3 and SSC CGL GK Awards section.',
  likely_exams: ['upsc_cse_pre','ssc_cgl_t1','tnpsc_g1_pre'],
  share_text: '🌳 Today on Bharat Pulse: One man. 37 years. 550 acres of forest from nothing. #BharatPulse #TryIT',
  hashtags: ['#BharatPulse','#JadavPayeng','#MolaiForest','#PadmaShri','#TryIT'],
  notification_title: '🌳 Bharat Pulse — Today from Assam',
  notification_body: 'One man planted a forest for 37 years alone. This is the story of Jadav Payeng.',
  view_count: 8420,
  share_count: 1203,
}

// ── CONTENT BLOCK RENDERER ────────────────────────────────────────────────
function ContentBlock({ block }) {
  switch (block.type) {

    case 'hero_quote':
      return (
        <div style={{ margin:'20px 0', padding:'16px 20px',
          borderLeft:`4px solid ${GOLD}`, background:'rgba(201,168,76,0.08)',
          borderRadius:'0 12px 12px 0' }}>
          <p style={{ fontSize:16, fontStyle:'italic', color:'#F1F5F9', lineHeight:1.8, margin:'0 0 8px' }}>
            "{block.content}"
          </p>
          {block.attribution && (
            <p style={{ fontSize:12, color:GOLD, fontWeight:600, margin:0 }}>
              — {block.attribution}
            </p>
          )}
        </div>
      )

    case 'paragraph':
      return (
        <p style={{ fontSize:15, color:'#CBD5E1', lineHeight:1.9, margin:'0 0 16px' }}>
          {block.content}
        </p>
      )

    case 'stat_fact':
      return (
        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
          borderRadius:16, padding:'16px 20px', margin:'20px 0',
          border:`1px solid ${GOLD}44`, textAlign:'center' }}>
          <p style={{ fontSize:32, margin:'0 0 8px' }}>{block.icon}</p>
          <p style={{ fontSize:15, fontWeight:700, color:GOLD, lineHeight:1.6, margin:0 }}>
            {block.fact}
          </p>
        </div>
      )

    case 'key_facts':
      return (
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:14,
          padding:'14px 16px', margin:'20px 0', border:'1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#64748B', letterSpacing:1.2,
            textTransform:'uppercase', marginBottom:10 }}>KEY FACTS FOR YOUR EXAM</p>
          {block.facts?.map((fact, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}>
              <span style={{ color:GOLD, fontSize:12, marginTop:2, flexShrink:0 }}>◆</span>
              <p style={{ fontSize:13, color:'#94A3B8', margin:0, lineHeight:1.6 }}>{fact}</p>
            </div>
          ))}
        </div>
      )

    case 'exam_connect':
      return (
        <div style={{ background:'rgba(16,185,129,0.08)', border:'1.5px solid #059669',
          borderRadius:14, padding:'14px 16px', margin:'20px 0' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#059669', letterSpacing:1.2,
            textTransform:'uppercase', marginBottom:8 }}>🎯 EXAM CONNECTION</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
            {block.exams?.map(e => (
              <span key={e} style={{ background:'rgba(5,150,105,0.15)', color:'#6EE7B7',
                padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600 }}>{e}</span>
            ))}
          </div>
          <p style={{ fontSize:13, color:'#6EE7B7', margin:0, lineHeight:1.6 }}>{block.note}</p>
        </div>
      )

    case 'legacy_impact':
      return (
        <div style={{ background:`linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))`,
          border:`1px solid ${GOLD}33`, borderRadius:14, padding:'16px 20px', margin:'20px 0' }}>
          <p style={{ fontSize:11, fontWeight:700, color:GOLD, letterSpacing:1.2,
            textTransform:'uppercase', marginBottom:8 }}>🌟 THE LEGACY</p>
          <p style={{ fontSize:14, color:'#E2E8F0', lineHeight:1.8, margin:0 }}>
            {block.content}
          </p>
        </div>
      )

    case 'image':
      return (
        <div style={{ borderRadius:14, overflow:'hidden', margin:'20px 0' }}>
          <img src={block.url} alt={block.caption || ''} draggable={false}
            style={{ width:'100%', display:'block', objectFit:'cover', maxHeight:240 }} />
          {block.caption && (
            <p style={{ fontSize:11, color:'#475569', textAlign:'center', padding:'8px 0 0', margin:0 }}>
              {block.caption}
            </p>
          )}
        </div>
      )

    default:
      return null
  }
}

// ── SHARE CARD GENERATOR ──────────────────────────────────────────────────
function ShareCard({ story, onClose }) {
  const cardRef = useRef()

  const handleSharePlatform = (platform) => {
    const text   = encodeURIComponent(story.share_text || story.headline)
    const url    = encodeURIComponent(`https://tryiteducations.net/bharat-pulse`)
    const hashes = (story.hashtags || []).join(' ')

    const links = {
      whatsapp:  `https://wa.me/?text=${text}%20${url}`,
      twitter:   `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${(story.hashtags||[]).map(h=>h.replace('#','')).join(',')}`,
      telegram:  `https://t.me/share/url?url=${url}&text=${text}`,
      instagram: null, // Instagram doesn't support URL sharing; user copies card
      facebook:  `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    }

    if (platform === 'instagram') {
      alert('📸 Screenshot this card and share on Instagram Stories or Feed!')
      return
    }
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${story.headline}\n\n${story.share_text}\n\nRead on TryIT: https://tryiteducations.net/bharat-pulse`)
      alert('✅ Copied to clipboard!')
      return
    }
    if (links[platform]) window.open(links[platform], '_blank')

    // Track share
    supabase.from('story_shares').insert({ story_id: story.story_id, platform }).catch(()=>{})
  }

  const region = REGION_META[story.region] || REGION_META.pan_india
  const [g1, g2] = region.gradient

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.92)',
      zIndex:1000, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', padding:16 }}>

      {/* The shareable card */}
      <div ref={cardRef}
        style={{ width:'100%', maxWidth:400, borderRadius:20, overflow:'hidden',
          background:`linear-gradient(160deg,${g1},${g2})`,
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>

        {/* Top branding */}
        <div style={{ padding:'12px 16px', display:'flex', justifyContent:'space-between',
          alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:18 }}>{region.emoji}</span>
            <div>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)', margin:0 }}>BHARAT PULSE</p>
              <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.9)', margin:0 }}>
                {region.label} · {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
              </p>
            </div>
          </div>
          <span style={{ fontSize:10, background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.8)',
            padding:'3px 8px', borderRadius:99 }}>
            {STORY_TYPE_LABELS[story.story_type]}
          </span>
        </div>

        {/* Story content */}
        <div style={{ padding:'20px 16px' }}>
          <p style={{ fontSize:9, color:GOLD, fontWeight:700, letterSpacing:2,
            textTransform:'uppercase', marginBottom:8 }}>TODAY'S STORY</p>
          <p style={{ fontSize:17, fontWeight:800, color:'#fff', lineHeight:1.5, marginBottom:8 }}>
            {story.headline}
          </p>
          {story.hook_line && (
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.8)', fontStyle:'italic',
              borderLeft:'3px solid rgba(201,168,76,0.7)', paddingLeft:10, lineHeight:1.6 }}>
              {story.hook_line}
            </p>
          )}
        </div>

        {/* Hero info */}
        {story.hero_name && (
          <div style={{ padding:'12px 16px', background:'rgba(0,0,0,0.2)',
            display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(201,168,76,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:800, color:GOLD, fontSize:14, flexShrink:0 }}>
              {story.hero_name.split(' ').map(w=>w[0]).slice(0,2).join('')}
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:0 }}>{story.hero_name}</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', margin:0 }}>
                {story.city_or_place || story.state_name}
                {story.award_name && ` · ${story.award_name} ${story.award_year || ''}`}
              </p>
            </div>
          </div>
        )}

        {/* Exam tags */}
        {story.likely_exams?.length > 0 && (
          <div style={{ padding:'10px 16px', background:'rgba(0,0,0,0.15)' }}>
            <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>RELEVANT FOR EXAMS</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {story.likely_exams.slice(0,4).map(e => (
                <span key={e} style={{ fontSize:9, fontWeight:600, color:'rgba(255,255,255,0.7)',
                  background:'rgba(255,255,255,0.1)', padding:'2px 8px', borderRadius:99 }}>
                  {e.replace(/_/g,' ').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer branding */}
        <div style={{ padding:'10px 16px', display:'flex', justifyContent:'space-between',
          alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', margin:0 }}>
            tryiteducations.net
          </p>
          <p style={{ fontSize:10, fontWeight:700, color:GOLD, margin:0 }}>
            TryIT Educations
          </p>
        </div>
      </div>

      {/* Share buttons */}
      <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginTop:16, marginBottom:12 }}>
        Share this story:
      </p>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
        {[
          { platform:'whatsapp',  emoji:'💬', label:'WhatsApp', bg:'#25D366' },
          { platform:'telegram',  emoji:'✈️',  label:'Telegram', bg:'#2CA5E0' },
          { platform:'instagram', emoji:'📸', label:'Instagram',bg:'#E1306C' },
          { platform:'twitter',   emoji:'🐦', label:'Twitter',  bg:'#1DA1F2' },
          { platform:'facebook',  emoji:'👥', label:'Facebook', bg:'#1877F2' },
          { platform:'copy',      emoji:'📋', label:'Copy',     bg:'#475569' },
        ].map(s => (
          <button key={s.platform}
            onClick={() => handleSharePlatform(s.platform)}
            style={{ padding:'8px 14px', borderRadius:12, border:'none',
              background:s.bg, color:'#fff', fontSize:12, fontWeight:700,
              cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
            <span>{s.emoji}</span> {s.label}
          </button>
        ))}
      </div>

      <button onClick={onClose}
        style={{ marginTop:16, color:'rgba(255,255,255,0.4)', background:'none',
          border:'none', cursor:'pointer', fontSize:13 }}>
        ✕ Close
      </button>
    </div>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function BharatPulse() {
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const [story,       setStory]       = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [bookmarked,  setBookmarked]  = useState(false)
  const [showShare,   setShowShare]   = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archive,     setArchive]     = useState([])
  const [notifOn,     setNotifOn]     = useState(false)
  const [tab,         setTab]         = useState('story') // 'story' | 'exam' | 'archive'

  // Load today's story
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await supabase
          .from('daily_stories')
          .select('*')
          .lte('publish_date', new Date().toISOString().slice(0,10))
          .order('publish_date', { ascending:false })
          .limit(1)
          .single()
        if (data) {
          setStory(data)
          // Track view
          await supabase.from('daily_stories')
            .update({ view_count: (data.view_count||0) + 1 })
            .eq('story_id', data.story_id)
        } else {
          setStory(MOCK_STORY)
        }
      } catch {
        setStory(MOCK_STORY)
      }
      setLoading(false)
    })()

    // Check if bookmarked
    if (user?.id) {
      supabase.from('story_bookmarks')
        .select('id').eq('user_id', user.id)
        .then(({ data }) => setBookmarked((data?.length || 0) > 0))
    }

    // Check notification status
    setNotifOn(localStorage.getItem('tryit_bharat_pulse_notify') === 'true')
  }, [])

  // Load archive
  useEffect(() => {
    if (tab !== 'archive') return
    supabase.from('daily_stories')
      .select('story_id,publish_date,headline,region,state_name,story_type,thumbnail_url,hero_name')
      .order('publish_date',{ascending:false})
      .limit(30)
      .then(({ data }) => setArchive(data || []))
      .catch(() => setArchive([]))
  }, [tab])

  const handleBookmark = async () => {
    if (!user) { navigate('/login'); return }
    const next = !bookmarked
    setBookmarked(next)
    try {
      if (next) {
        await supabase.from('story_bookmarks').insert({ story_id:story.story_id, user_id:user.id })
      } else {
        await supabase.from('story_bookmarks').delete().eq('story_id',story.story_id).eq('user_id',user.id)
      }
    } catch {}
  }

  const handleNotification = () => {
    const next = !notifOn
    setNotifOn(next)
    localStorage.setItem('tryit_bharat_pulse_notify', String(next))

    if (next && 'Notification' in window) {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted' && user?.id) {
          // Register service worker push subscription
          // (full PWA implementation in service-worker.js)
          supabase.from('push_subscriptions').upsert({
            user_id:      user.id,
            device_token: `web_${user.id}`,
            platform:     'web',
            is_active:    true,
            opted_in:     true,
          }, { onConflict:'user_id,device_token' }).catch(()=>{})
        }
      })
    }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:BG, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', color:'#fff' }}>
        <p style={{ fontSize:40, marginBottom:8 }}>🇮🇳</p>
        <p style={{ fontSize:14, color:'#64748B' }}>Loading today's story…</p>
      </div>
    </div>
  )

  if (!story) return null

  const region   = REGION_META[story.region] || REGION_META.pan_india
  const [g1, g2] = region.gradient

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', color:'#fff', paddingBottom:80 }}>

      {/* ── HERO COVER ──────────────────────────────────────────────────── */}
      <div style={{ background:`linear-gradient(160deg,${g1}EE,${g2}EE,${BG} 90%)`,
        padding:'20px 16px 28px', position:'relative' }}>

        {/* Back + actions */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <button onClick={() => navigate(-1)}
            style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff',
              width:36, height:36, borderRadius:'50%', fontSize:18, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>

          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ fontSize:16 }}>{region.emoji}</span>
            <span style={{ fontSize:12, fontWeight:700, color:GOLD }}>BHARAT PULSE</span>
          </div>

          <div style={{ display:'flex', gap:6 }}>
            <button onClick={handleBookmark}
              style={{ background:'rgba(255,255,255,0.1)', border:'none', color: bookmarked?GOLD:'rgba(255,255,255,0.7)',
                width:36, height:36, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>
              {bookmarked ? '🔖' : '☆'}
            </button>
            <button onClick={handleNotification}
              style={{ background: notifOn?`${GOLD}33`:'rgba(255,255,255,0.1)', border:'none',
                color: notifOn?GOLD:'rgba(255,255,255,0.7)',
                width:36, height:36, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>
              {notifOn ? '🔔' : '🔕'}
            </button>
          </div>
        </div>

        {/* Date + region */}
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>
          {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          {' · '}{region.label}
        </p>

        {/* Story type badge */}
        <span style={{ display:'inline-block', background:'rgba(201,168,76,0.2)',
          color:GOLD, padding:'4px 12px', borderRadius:99, fontSize:11, fontWeight:700, marginBottom:12 }}>
          {STORY_TYPE_LABELS[story.story_type]}
        </span>

        {/* Headline */}
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:22,
          lineHeight:1.4, color:'#fff', marginBottom:10 }}>
          {story.headline}
        </h1>

        {/* Sub + location */}
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:12 }}>
          {story.subheadline}
        </p>

        {/* Hook line */}
        <p style={{ fontSize:14, fontStyle:'italic', color:GOLD, lineHeight:1.6,
          borderLeft:`3px solid ${GOLD}`, paddingLeft:12 }}>
          {story.hook_line}
        </p>

        {/* Hero info bar */}
        {story.hero_name && (
          <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:16,
            background:'rgba(0,0,0,0.3)', borderRadius:12, padding:'10px 14px' }}>
            <div style={{ width:44, height:44, borderRadius:'50%',
              background:`linear-gradient(135deg,${GOLD},#E8C96A)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:14, color:NAVY, flexShrink:0 }}>
              {story.hero_name.split(' ').map(w=>w[0]).slice(0,2).join('')}
            </div>
            <div>
              <p style={{ fontWeight:700, fontSize:14, color:'#fff', margin:0 }}>
                {story.hero_name}
                {story.hero_age && <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginLeft:6 }}>· Age {story.hero_age}</span>}
              </p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:0 }}>
                {story.hero_designation} · {story.city_or_place || story.state_name}
              </p>
              {story.award_name && (
                <p style={{ fontSize:11, color:GOLD, margin:'2px 0 0', fontWeight:600 }}>
                  🏅 {story.award_name} {story.award_year}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display:'flex', gap:16, marginTop:12 }}>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', margin:0 }}>
            👁️ {(story.view_count||0).toLocaleString('en-IN')} reads today
          </p>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', margin:0 }}>
            📤 {(story.share_count||0).toLocaleString('en-IN')} shares
          </p>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', margin:0 }}>
            📍 {story.state_name}
          </p>
        </div>
      </div>

      {/* ── TAB BAR ─────────────────────────────────────────────────────── */}
      <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.08)',
        background:BG, position:'sticky', top:0, zIndex:10 }}>
        {[
          { id:'story', label:'📖 Story'         },
          { id:'exam',  label:'🎯 Exam Ready'    },
          { id:'archive',label:'📚 Archive'      },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:'12px 6px', border:'none', background:'transparent',
              color: tab===t.id ? GOLD : 'rgba(255,255,255,0.4)',
              fontSize:12, fontWeight:700, cursor:'pointer',
              borderBottom: tab===t.id ? `2px solid ${GOLD}` : '2px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div style={{ padding:'16px 16px' }}>

        {/* STORY TAB */}
        {tab === 'story' && (
          <div>
            {story.content_blocks?.map((block, i) => (
              <ContentBlock key={i} block={block} />
            ))}

            {/* Notification CTA */}
            {!notifOn && (
              <div style={{ background:'rgba(201,168,76,0.1)', border:`1px solid ${GOLD}44`,
                borderRadius:14, padding:'14px 16px', margin:'20px 0', textAlign:'center' }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.8)', marginBottom:8 }}>
                  🔔 Get tomorrow's story at 8 AM
                </p>
                <button onClick={handleNotification}
                  style={{ padding:'10px 24px', background:GOLD, color:NAVY,
                    border:'none', borderRadius:10, fontWeight:800, fontSize:13, cursor:'pointer' }}>
                  Enable Daily Notification
                </button>
              </div>
            )}

            {/* Share CTA */}
            <button onClick={() => setShowShare(true)}
              style={{ width:'100%', padding:'14px', background:`linear-gradient(135deg,${g1},${g2})`,
                color:'#fff', border:'none', borderRadius:14, fontWeight:800, fontSize:14,
                cursor:'pointer', marginTop:8 }}>
              📤 Share This Story
            </button>
          </div>
        )}

        {/* EXAM READY TAB */}
        {tab === 'exam' && (
          <div>
            <div style={{ background:'rgba(5,150,105,0.1)', border:'1px solid #059669',
              borderRadius:14, padding:14, marginBottom:14 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#059669', letterSpacing:1.2,
                textTransform:'uppercase', marginBottom:6 }}>TODAY'S EXAM RELEVANCE</p>
              <p style={{ fontSize:13, color:'#6EE7B7', margin:0, lineHeight:1.7 }}>
                {story.exam_connection}
              </p>
            </div>

            {story.likely_exams?.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:11, color:'#64748B', textTransform:'uppercase',
                  letterSpacing:1, marginBottom:8 }}>APPEARS IN THESE EXAMS</p>
                {story.likely_exams.map(e => (
                  <div key={e} style={{ background:'rgba(255,255,255,0.04)',
                    borderRadius:10, padding:'10px 14px', marginBottom:6,
                    display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:16 }}>📋</span>
                    <p style={{ fontSize:13, color:'#94A3B8', margin:0 }}>
                      {e.replace(/_/g,' ').toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {story.exam_topics?.length > 0 && (
              <div>
                <p style={{ fontSize:11, color:'#64748B', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>
                  TOPIC TAGS
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {story.exam_topics.map(t => (
                    <span key={t} style={{ background:'rgba(201,168,76,0.15)', color:GOLD,
                      padding:'4px 12px', borderRadius:99, fontSize:11, fontWeight:600 }}>
                      {t.replace(/_/g,' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ARCHIVE TAB */}
        {tab === 'archive' && (
          <div>
            <p style={{ fontSize:11, color:'#64748B', textTransform:'uppercase',
              letterSpacing:1, marginBottom:12 }}>PREVIOUS STORIES</p>
            {archive.length === 0 ? (
              <p style={{ color:'#475569', textAlign:'center', padding:20 }}>
                Loading archive…
              </p>
            ) : archive.map(s => (
              <div key={s.story_id}
                style={{ display:'flex', gap:12, padding:'10px 0',
                  borderBottom:'1px solid rgba(255,255,255,0.06)',
                  cursor:'pointer' }}
                onClick={() => navigate(`/bharat-pulse/${s.story_id}`)}>
                <div style={{ width:44, height:44, borderRadius:10, flexShrink:0,
                  background:`linear-gradient(135deg,${REGION_META[s.region]?.gradient[0]||NAVY},${REGION_META[s.region]?.gradient[1]||GOLD})`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                  {REGION_META[s.region]?.emoji || '🇮🇳'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'#E2E8F0', margin:0,
                    overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box',
                    WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                    {s.headline}
                  </p>
                  <p style={{ fontSize:10, color:'#64748B', margin:'3px 0 0' }}>
                    {s.state_name} · {new Date(s.publish_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                    {' · '}{STORY_TYPE_LABELS[s.story_type]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share card overlay */}
      {showShare && story && (
        <ShareCard story={story} onClose={() => setShowShare(false)} />
      )}
    </div>
  )
}