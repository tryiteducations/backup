// FILE: src/pages/community/CommunityPage.jsx
// TryIT Community — Democratic, Self-Healing Platform
// Students post requests → others VOTE (no replies)
// High votes → Platform considers → Admin responds transparently
// Accepted request → User gets pinned greeting card
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'

// ── CATEGORIES ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id:'all',          label:'All Requests',  icon:'🌐' },
  { id:'new_exam',     label:'New Exam',       icon:'📋' },
  { id:'new_concept',  label:'New Concept',    icon:'💡' },
  { id:'translation',  label:'Translation',    icon:'🌍' },
  { id:'difficulty',   label:'Difficulty',     icon:'📊' },
  { id:'question_quality', label:'Questions',  icon:'❓' },
  { id:'current_affairs',  label:'Current Affairs', icon:'📰' },
  { id:'feature',      label:'Feature',        icon:'⚙️' },
  { id:'other',        label:'Other',          icon:'💬' },
]

// ── STATUS CONFIG ──────────────────────────────────────────────────────────
const STATUS = {
  open:         { label:'Open',            bg:'#DBEAFE', color:'#1D4ED8', emoji:'🗳️'  },
  considering:  { label:'Considering',     bg:'#FEF3C7', color:'#D97706', emoji:'🤔'  },
  in_progress:  { label:'In Progress',     bg:'#D1FAE5', color:'#059669', emoji:'⚙️'  },
  done:         { label:'Done! ✨',         bg:'#BBF7D0', color:'#065F46', emoji:'🎉'  },
  declined:     { label:'Future Update',   bg:'#F1F5F9', color:'#64748B', emoji:'📅'  },
  cost_concern: { label:'Cost Concern',    bg:'#FEE2E2', color:'#DC2626', emoji:'💰'  },
}

// ── MOCK DATA (shown before Supabase is connected) ─────────────────────────
const MOCK_POSTS = [
  {
    post_id:'p1', category:'translation', status:'done',
    title:'Add Bhojpuri language translation to all questions',
    body:'Many students from Bihar/UP speak Bhojpuri. If you add this, lakhs of students will benefit who struggle with Hindi bookish language.',
    vote_count:847, user_voted:false, user_name:'Rahul S.', user_state:'Bihar',
    admin_response:'✅ Done! Bhojpuri translation is now live across all SSC CGL, RRB, and Banking questions. Thank you Rahul for voicing this — 847 students agreed!',
    user_pinned:true, created_at:'2026-05-12T10:00:00Z',
    celebrating_user:{ name:'Rahul S.', state:'Bihar', votes:847 }
  },
  {
    post_id:'p2', category:'new_exam', status:'done',
    title:'Add IB ACIO exam — Intelligence Bureau Assistant Central Intelligence Officer',
    body:'IB ACIO is one of the most popular central government exams but not on any platform properly. Tier 1 + Tier 2 + Interview pattern.',
    vote_count:623, user_voted:false, user_name:'Priya K.', user_state:'Tamil Nadu',
    admin_response:'✅ IB ACIO is now live! Tier 1 (Objective + Descriptive), Tier 2, and Interview preparation are all added with 500+ questions and 3 mock tests.',
    user_pinned:true, created_at:'2026-05-20T10:00:00Z',
    celebrating_user:{ name:'Priya K.', state:'Tamil Nadu', votes:623 }
  },
  {
    post_id:'p3', category:'difficulty', status:'in_progress',
    title:'SSC CGL mock tests are too easy — need L4 difficulty questions',
    body:'Current mock tests feel like practice, not like real SSC CGL pressure. Real exam is much harder especially Tier 2 Maths. Please add more L4 questions.',
    vote_count:412, user_voted:true, user_name:'Arun M.', user_state:'Karnataka',
    admin_response:'⚙️ We\'re adding 2,000 more L4 difficulty Maths questions specifically for SSC CGL Tier 2 pattern. ETA: Next update in 5 days.',
    user_pinned:false, created_at:'2026-06-01T10:00:00Z',
  },
  {
    post_id:'p4', category:'translation', status:'cost_concern',
    title:'Add Sanskrit translation for all Vedic Maths topics',
    body:'Sanskrit medium students preparing for Sanskrit University entrances need Sanskrit explanations. Will be very helpful for 3-4 lakh students.',
    vote_count:234, user_voted:false, user_name:'Vidya P.', user_state:'Maharashtra',
    admin_response:'💰 We truly want to add Sanskrit translation — and we will. Currently the AI model for Sanskrit requires a premium API which would increase our infrastructure cost by ₹15,000/month. We are evaluating open-source Sanskrit NLP options. We will add it in 3-4 months. Thank you for your patience 🙏',
    user_pinned:false, created_at:'2026-05-28T10:00:00Z',
  },
  {
    post_id:'p5', category:'new_concept', status:'considering',
    title:'Add Concept Learning for UPSC Ethics (GS Paper 4)',
    body:'Ethics is the toughest paper for most UPSC aspirants. Nobody explains concepts like Integrity, Emotional Intelligence, etc. in a relatable way. TryIT\'s 7-layer approach will be perfect for this.',
    vote_count:589, user_voted:false, user_name:'Meena R.', user_state:'Rajasthan',
    admin_response:'🤔 This is an excellent idea with 589 votes and growing. We are scoping out how to build Ethics concepts with Indian case studies and real-life stories. We plan to add UPSC Ethics concept cards in our July 2026 update.',
    user_pinned:false, created_at:'2026-06-05T10:00:00Z',
  },
  {
    post_id:'p6', category:'current_affairs', status:'open',
    title:'Add state-specific current affairs for each state PSC',
    body:'Tamil Nadu students need TN-specific CA. UP students need UP CA. Right now all current affairs are national only. Please add state-level CA for each state PSC.',
    vote_count:456, user_voted:false, user_name:'Selvam T.', user_state:'Tamil Nadu',
    admin_response:null, created_at:'2026-06-10T10:00:00Z',
  },
  {
    post_id:'p7', category:'feature', status:'open',
    title:'Add parents can see their child\'s weak topics automatically',
    body:'My parents want to know where I am struggling. If TryIT sends a weekly report to parents showing weak topics, it will help parents support us better.',
    vote_count:334, user_voted:false, user_name:'Ravi K.', user_state:'Andhra Pradesh',
    admin_response:null, created_at:'2026-06-11T10:00:00Z',
  },
  {
    post_id:'p8', category:'new_exam', status:'open',
    title:'Add DRDO Scientist B CEPTAM exam full preparation',
    body:'DRDO recruitment is one of the most prestigious but there is zero proper content anywhere. 1000s of engineers want this. Full syllabus, concept learning, and mock tests please.',
    vote_count:278, user_voted:false, user_name:'Ananya S.', user_state:'Delhi',
    admin_response:null, created_at:'2026-06-12T10:00:00Z',
  },
]

export default function CommunityPage() {
  const { theme } = useTheme()
  const primary = theme?.primary || '#1E3A5F'
  const accent = theme?.accent || '#C9A84C'
  const txt = theme?.text || '#1E293B'
  const muted = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const surface = theme?.surface || '#FFFFFF'
  const border = theme?.border || '#E2E8F0'

  const navigate = useNavigate()
  const { user } = useAuth()

  const [posts,        setPosts]        = useState(MOCK_POSTS)
  const [activecat,    setActiveCat]    = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [showForm,     setShowForm]     = useState(false)
  const [sortBy,       setSortBy]       = useState('votes')
  // votes | recent | status

  const filtered = posts
    .filter(p => activecat === 'all' || p.category === activecat)
    .filter(p => activeStatus === 'all' || p.status === activeStatus)
    .sort((a, b) => {
      if (sortBy === 'votes') return b.vote_count - a.vote_count
      if (sortBy === 'recent') return new Date(b.created_at) - new Date(a.created_at)
      return 0
    })

  const pinned    = filtered.filter(p => p.user_pinned)
  const unpinned  = filtered.filter(p => !p.user_pinned)

  const handleVote = async (postId, currentlyVoted) => {
    if (!user) { navigate('/login'); return }
    setPosts(prev => prev.map(p =>
      p.post_id === postId
        ? { ...p, vote_count: currentlyVoted ? p.vote_count-1 : p.vote_count+1, user_voted: !currentlyVoted }
        : p
    ))
    try {
      if (currentlyVoted) {
        await supabase.from('community_votes').delete()
          .eq('post_id', postId).eq('user_id', user.id)
      } else {
        await supabase.from('community_votes').insert({ post_id:postId, user_id:user.id })
      }
    } catch {}
  }

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'20px 16px', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
          <div>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:20, margin:0 }}>
              🗳️ TryIT Community
            </h1>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', margin:'4px 0 0' }}>
              You vote. We listen. Platform evolves together.
            </p>
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ padding:'9px 16px', background:GOLD, color:NAVY, border:'none',
              borderRadius:12, fontWeight:800, fontSize:13, cursor:'pointer' }}>
            + Post Request
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {[
            { label:'Total Requests', value: posts.length },
            { label:'Completed',      value: posts.filter(p=>p.status==='done').length },
            { label:'In Progress',    value: posts.filter(p=>p.status==='in_progress').length },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(255,255,255,0.10)', borderRadius:10, padding:'8px 10px', textAlign:'center' }}>
              <p style={{ fontSize:16, fontWeight:800, color:GOLD, margin:0 }}>{s.value}</p>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)', margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <div style={{ background:'#FFF7E6', border:'1px solid #FDE68A', padding:'10px 16px', display:'flex', gap:12, alignItems:'flex-start' }}>
        <span style={{ fontSize:18, flexShrink:0 }}>💡</span>
        <p style={{ fontSize:12, color:'#92400E', margin:0, lineHeight:1.7 }}>
          <strong>How TryIT Community works:</strong> Post what you need → Others vote (no comments, no negativity) →
          High-voted requests get reviewed → We respond honestly → Accepted requests are added within 72 hours →
          Your name gets celebrated on the platform! 🎉
        </p>
      </div>

      {/* ── FILTERS ───────────────────────────────────────────────────── */}
      <div style={{ padding:'12px 16px 0' }}>
        <div style={{ display:'flex', overflowX:'auto', gap:6, paddingBottom:8, scrollbarWidth:'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              style={{ flexShrink:0, padding:'6px 12px', borderRadius:99,
                fontSize:12, fontWeight:600, cursor:'pointer',
                background: activecat===cat.id ? NAVY : '#fff',
                color:      activecat===cat.id ? '#fff' : '#64748B',
                border:     activecat===cat.id ? 'none' : '1.5px solid #E2E8F0' }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
          <div style={{ display:'flex', gap:6 }}>
            {['all','open','in_progress','done'].map(s => (
              <button key={s} onClick={() => setActiveStatus(s)}
                style={{ padding:'4px 10px', borderRadius:99, border:'none', fontSize:11, fontWeight:600, cursor:'pointer',
                  background: activeStatus===s ? '#E2E8F0' : 'transparent',
                  color:      activeStatus===s ? NAVY : '#94A3B8' }}>
                {s === 'all' ? 'All Status' : STATUS[s]?.label || s}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ fontSize:11, border:'1.5px solid #E2E8F0', borderRadius:8, padding:'4px 8px', color:'#64748B' }}>
            <option value="votes">Most Voted</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* ── PINNED CELEBRATION CARDS ──────────────────────────────────── */}
      {pinned.length > 0 && (
        <div style={{ padding:'12px 16px' }}>
          <p style={{ fontSize:10, fontWeight:700, color:'#94A3B8', letterSpacing:1.2,
            textTransform:'uppercase', marginBottom:10 }}>
            🏆 Hall of Fame — Their requests made TryIT better!
          </p>
          {pinned.map(post => (
            <CelebrationCard key={post.post_id} post={post} />
          ))}
        </div>
      )}

      {/* ── POSTS LIST ────────────────────────────────────────────────── */}
      <div style={{ padding:'4px 16px' }}>
        {unpinned.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>
            <p style={{ fontSize:32, marginBottom:8 }}>📭</p>
            <p>No posts in this category yet. Be the first!</p>
          </div>
        ) : (
          unpinned.map(post => (
            <PostCard
              key={post.post_id}
              post={post}
              onVote={() => handleVote(post.post_id, post.user_voted)}
              isLoggedIn={!!user}
            />
          ))
        )}
      </div>

      {/* ── NEW POST MODAL ────────────────────────────────────────────── */}
      {showForm && (
        <NewPostModal
          onClose={() => setShowForm(false)}
          onPosted={(newPost) => {
            setPosts(prev => [{ ...newPost, vote_count:0, user_voted:false, user_name:user?.name||'You', user_state:user?.state||'', admin_response:null, user_pinned:false, created_at:new Date().toISOString() }, ...prev])
            setShowForm(false)
          }}
          user={user}
        />
      )}
    </div>
  )
}

// ── CELEBRATION CARD ───────────────────────────────────────────────────────
function CelebrationCard({ post }) {
  const u = post.celebrating_user
  return (
    <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, borderRadius:16,
      padding:16, marginBottom:10, border:`2px solid ${GOLD}` }}>
      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:10 }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:GOLD,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:NAVY, flexShrink:0 }}>
          {u?.name?.slice(0,2).toUpperCase()}
        </div>
        <div>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:GOLD, fontSize:14, margin:0 }}>
            🎉 {u?.name} from {u?.state}
          </p>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', margin:0 }}>
            {u?.votes?.toLocaleString()} people agreed • Request now live!
          </p>
        </div>
        <span style={{ marginLeft:'auto', fontSize:20 }}>🏆</span>
      </div>
      <p style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:6 }}>{post.title}</p>
      {post.admin_response && (
        <div style={{ background:'rgba(201,168,76,0.15)', borderRadius:10, padding:'8px 12px' }}>
          <p style={{ fontSize:12, color:GOLD, margin:0, lineHeight:1.6 }}>{post.admin_response}</p>
        </div>
      )}
    </div>
  )
}

// ── POST CARD ──────────────────────────────────────────────────────────────
function PostCard({ post, onVote, isLoggedIn }) {
  const [expanded, setExpanded] = useState(false)
  const st = STATUS[post.status] || STATUS.open

  return (
    <div style={{ background:'#fff', borderRadius:16, padding:14, marginBottom:10,
      border:'1.5px solid #E2E8F0', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>

      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        {/* Vote button */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, flexShrink:0, minWidth:44 }}>
          <button onClick={onVote}
            style={{ width:36, height:36, borderRadius:10, border:`2px solid ${post.user_voted?NAVY:'#E2E8F0'}`,
              background: post.user_voted ? NAVY : '#fff', color: post.user_voted ? '#fff' : '#64748B',
              fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700 }}>
            {post.user_voted ? '▲' : '△'}
          </button>
          <span style={{ fontSize:13, fontWeight:800, color: post.vote_count>100?NAVY:'#64748B' }}>
            {post.vote_count >= 1000 ? `${(post.vote_count/1000).toFixed(1)}k` : post.vote_count}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:6, alignItems:'center' }}>
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
              background:st.bg, color:st.color }}>
              {st.emoji} {st.label}
            </span>
            <span style={{ fontSize:10, fontWeight:700, color:'#94A3B8',
              background:'#F1F5F9', padding:'2px 8px', borderRadius:99 }}>
              {CATEGORIES.find(c=>c.id===post.category)?.icon} {CATEGORIES.find(c=>c.id===post.category)?.label}
            </span>
          </div>

          <p style={{ fontSize:14, fontWeight:700, color:'#1E293B', marginBottom:4, lineHeight:1.5 }}>
            {post.title}
          </p>

          {expanded && (
            <p style={{ fontSize:13, color:'#475569', marginBottom:10, lineHeight:1.7 }}>
              {post.body}
            </p>
          )}

          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>
              by {post.user_name} · {post.user_state} ·{' '}
              {new Date(post.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
            </p>
            <button onClick={() => setExpanded(e=>!e)}
              style={{ fontSize:11, color:'#64748B', background:'none', cursor:'pointer', padding:0 }}>
              {expanded ? 'Show less ↑' : 'Read more ↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Admin response */}
      {post.admin_response && (
        <div style={{ marginTop:10, background: post.status==='done'?'#F0FDF4':'#F8FAFC',
          border:`1px solid ${post.status==='done'?'#BBF7D0':'#E2E8F0'}`,
          borderRadius:10, padding:'10px 12px' }}>
          <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
            <span style={{ fontSize:16 }}>🛡️</span>
            <span style={{ fontSize:11, fontWeight:700,
              color: post.status==='done'?'#059669':'#475569' }}>
              TryIT Team Response
            </span>
          </div>
          <p style={{ fontSize:12, color: post.status==='done'?'#065F46':'#475569',
            margin:0, lineHeight:1.7 }}>
            {post.admin_response}
          </p>
        </div>
      )}

      {/* No-reply note */}
      {!post.admin_response && (
        <p style={{ fontSize:10, color:'#CBD5E1', marginTop:8, textAlign:'right', margin:'8px 0 0' }}>
          👆 Vote to move this up · No comment section — only votes count here
        </p>
      )}
    </div>
  )
}

// ── NEW POST MODAL ─────────────────────────────────────────────────────────
function NewPostModal({ onClose, onPosted, user }) {
  const [form, setForm] = useState({
    title:'', body:'', category:'feature'
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const f = (k, v) => setForm(p => ({ ...p, [k]:v }))

  const handleSubmit = async () => {
    if (!form.title.trim() || form.title.length < 10) { alert('Title must be at least 10 characters'); return }
    if (!form.body.trim() || form.body.length < 20)  { alert('Please describe your request in detail'); return }
    setSubmitting(true)

    const post = {
      post_id:    `post_${Date.now()}`,
      ...form,
      user_id:    user?.id,
      status:     'open',
    }

    try {
      await supabase.from('community_posts').insert(post)
    } catch {
      const saved = JSON.parse(localStorage.getItem('tryit_community_posts') || '[]')
      saved.unshift(post)
      localStorage.setItem('tryit_community_posts', JSON.stringify(saved))
    }

    setSubmitting(false)
    setDone(true)
  }

  const S = {
    inp: { width:'100%', padding:'11px 13px', borderRadius:11, border:'1.5px solid #E2E8F0',
           fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:10, background:'#fff' },
    lbl: { display:'block', fontSize:11, fontWeight:700, color:'#64748B', marginBottom:4 },
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
      display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:1000 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:460,
        maxHeight:'90vh', overflowY:'auto', padding:24 }}>

        {done ? (
          <div style={{ textAlign:'center', padding:'10px 0' }}>
            <p style={{ fontSize:40, marginBottom:8 }}>🗳️</p>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:18, marginBottom:8 }}>
              Request Submitted!
            </h3>
            <p style={{ fontSize:13, color:'#475569', lineHeight:1.7, marginBottom:16 }}>
              Other students can now vote for your request.
              The more votes it gets, the faster we'll implement it!
            </p>
            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12, padding:12, marginBottom:16 }}>
              <p style={{ fontSize:12, color:'#065F46', lineHeight:1.8, margin:0 }}>
                ✅ Your request is now public<br/>
                🗳️ Others can vote — no comments (keeps it clean)<br/>
                ⚡ High-voted requests → implemented in 72hrs<br/>
                🏆 If accepted, YOUR name goes on the Hall of Fame!
              </p>
            </div>
            <button onClick={() => { onPosted(form); onClose() }}
              style={{ width:'100%', padding:'12px', background:NAVY, color:'#fff',
                border:'none', borderRadius:12, fontWeight:700, cursor:'pointer' }}>
              Done — See My Post ✓
            </button>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:16, margin:0 }}>
                + Post a Request
              </h3>
              <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#94A3B8' }}>×</button>
            </div>

            <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:10, marginBottom:14 }}>
              <p style={{ fontSize:12, color:'#1D4ED8', margin:0, lineHeight:1.6 }}>
                📌 <strong>No comments section</strong> — only votes count. This keeps the community positive, focused, and democratic. Your voice = your vote.
              </p>
            </div>

            <label style={S.lbl}>Category</label>
            <select style={S.inp} value={form.category} onChange={e => f('category', e.target.value)}>
              {CATEGORIES.filter(c=>c.id!=='all').map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>

            <label style={S.lbl}>Request Title * (be specific — good titles get more votes)</label>
            <input style={S.inp}
              placeholder='e.g. "Add concept learning for Vedic Maths" or "Add Tamil Nadu municipal exam"'
              value={form.title} onChange={e => f('title', e.target.value)} maxLength={120} />
            <p style={{ fontSize:10, color:'#94A3B8', marginTop:-8, marginBottom:8 }}>
              {form.title.length}/120 characters
            </p>

            <label style={S.lbl}>Explain in detail * (why will this help students?)</label>
            <textarea rows={4} style={{ ...S.inp, resize:'none' }}
              placeholder='Explain why this would help students. The more specific you are, the faster we can implement it...'
              value={form.body} onChange={e => f('body', e.target.value)} maxLength={600} />
            <p style={{ fontSize:10, color:'#94A3B8', marginTop:-8, marginBottom:14 }}>
              {form.body.length}/600 characters
            </p>

            <button onClick={handleSubmit} disabled={submitting}
              style={{ width:'100%', padding:'13px', background:`linear-gradient(135deg,${NAVY},#0F2140)`,
                color:'#fff', border:'none', borderRadius:12, fontWeight:700, fontSize:14,
                cursor:'pointer', opacity:submitting?0.7:1 }}>
              {submitting ? '⏳ Posting...' : '🗳️ Post Request — Let the Community Vote'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}