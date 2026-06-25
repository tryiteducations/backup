// src/pages/student/StudentCommunity.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function StudentCommunity() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { user: authUser } = useAuth()
  const isDark = theme?.isDark ?? false
  const accent = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primD = theme?.primaryDark ?? '#0F2140'
  const txt = isDark ? '#F8FAFC' : '#0F1020'
  const muted = isDark ? 'rgba(255,255,255,0.55)' : '#64748B'
  const card = isDark ? 'rgba(255,255,255,0.06)' : '#fff'
  const bdr = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
  const bg = isDark ? (theme?.primaryDark ?? '#0F2140') : '#F0F4F8'

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newCat, setNewCat] = useState('feature_request')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadPosts() }, [filter])

  const loadPosts = async () => {
    setLoading(true)
    let q = supabase.from('community_posts')
      .select('*, profiles(name, avatar_url, badge)')
      .order('upvotes', { ascending: false })
    if (filter !== 'all') q = q.eq('category', filter)
    const { data } = await q.limit(30)
    setPosts(data || [])
    setLoading(false)
  }

  const submitPost = async () => {
    if (!newTitle.trim() || !authUser) return
    setSubmitting(true)
    const uid = authUser.id || authUser.userId
    await supabase.from('community_posts').insert({
      user_id: uid, title: newTitle, content: newContent, category: newCat,
    })
    setNewTitle(''); setNewContent(''); setShowNew(false)
    await loadPosts()
    setSubmitting(false)
  }

  const upvote = async (postId) => {
    if (!authUser) return
    const uid = authUser.id || authUser.userId
    const { error } = await supabase.from('community_upvotes').insert({ post_id: postId, user_id: uid })
    if (!error) {
      await supabase.from('community_posts').update({ upvotes: supabase.raw('upvotes + 1') }).eq('id', postId)
      setPosts(p => p.map(x => x.id === postId ? { ...x, upvotes: (x.upvotes||0)+1 } : x))
    }
  }

  const CATS = ['all','feature_request','bug_report','question','suggestion']
  const CAT_ICONS = { feature_request:'💡', bug_report:'🐛', question:'❓', suggestion:'🎯' }
  const STATUS_COLORS = { open:'#60A5FA', planned:'#A78BFA', done:'#4ADE80', closed:muted }

  return (
    <div style={{ minHeight:'100vh', background:bg, fontFamily:'Inter,sans-serif' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 20px',
        background:isDark?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.9)',
        backdropFilter:'blur(20px)', borderBottom:`1px solid ${bdr}`,
        position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button onClick={() => navigate('/student')} style={{
            background:card, border:`1px solid ${bdr}`, borderRadius:10,
            width:38, height:38, cursor:'pointer', color:txt, fontSize:18,
            display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div>
            <p style={{ color:txt, fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, margin:0 }}>
              💬 Community
            </p>
            <p style={{ color:muted, fontSize:11, margin:0 }}>Suggest features, report bugs, vote</p>
          </div>
        </div>
        <button onClick={() => setShowNew(true)} style={{
          background:`linear-gradient(135deg,${accent},${accentL})`,
          border:'none', borderRadius:10, padding:'8px 14px',
          color:primD, fontWeight:700, fontSize:12, cursor:'pointer' }}>
          + New Post
        </button>
      </div>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'20px' }}>
        {/* New post modal */}
        {showNew && (
          <div style={{ background:card, border:`1px solid ${accent}30`,
            borderRadius:20, padding:'20px', marginBottom:20,
            boxShadow:`0 8px 32px ${accent}18` }}>
            <p style={{ color:txt, fontWeight:800, fontSize:15, margin:'0 0 14px' }}>
              New Post
            </p>
            <select value={newCat} onChange={e => setNewCat(e.target.value)}
              style={{ width:'100%', background:isDark?'rgba(255,255,255,0.06)':'#F8FAFC',
                border:`1px solid ${bdr}`, borderRadius:10, padding:'8px 12px',
                color:txt, fontSize:12, marginBottom:10, outline:'none' }}>
              {Object.entries(CAT_ICONS).map(([k,v]) => (
                <option key={k} value={k}>{v} {k.replace('_',' ')}</option>
              ))}
            </select>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
              placeholder="Title (required)"
              style={{ width:'100%', background:isDark?'rgba(255,255,255,0.06)':'#F8FAFC',
                border:`1px solid ${bdr}`, borderRadius:10, padding:'10px 12px',
                color:txt, fontSize:13, marginBottom:10, boxSizing:'border-box', outline:'none' }}/>
            <textarea value={newContent} onChange={e => setNewContent(e.target.value)}
              placeholder="Describe your suggestion or issue..." rows={3}
              style={{ width:'100%', background:isDark?'rgba(255,255,255,0.06)':'#F8FAFC',
                border:`1px solid ${bdr}`, borderRadius:10, padding:'10px 12px',
                color:txt, fontSize:13, marginBottom:12, boxSizing:'border-box',
                resize:'vertical', outline:'none', fontFamily:'Inter,sans-serif' }}/>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={submitPost} disabled={submitting} style={{
                background:`linear-gradient(135deg,${accent},${accentL})`,
                border:'none', borderRadius:10, padding:'10px 20px',
                color:primD, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                {submitting ? 'Posting…' : 'Post'}
              </button>
              <button onClick={() => setShowNew(false)} style={{
                background:'transparent', border:`1px solid ${bdr}`,
                borderRadius:10, padding:'10px 16px', color:muted, fontSize:13, cursor:'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding:'6px 12px', borderRadius:20, cursor:'pointer',
              border:`1.5px solid ${filter===c?accent:bdr}`,
              background: filter===c ? `linear-gradient(135deg,${accent},${accentL})` : card,
              color: filter===c ? primD : muted,
              fontWeight:700, fontSize:10, textTransform:'capitalize' }}>
              {c==='all' ? 'All' : `${CAT_ICONS[c]} ${c.replace('_',' ')}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'40px', color:muted }}>Loading…</div>
        ) : posts.length === 0 ? (
          <div style={{ background:card, border:`1px dashed ${accent}35`,
            borderRadius:20, padding:'40px', textAlign:'center' }}>
            <p style={{ fontSize:40, margin:'0 0 12px' }}>💬</p>
            <p style={{ color:txt, fontWeight:700, fontSize:16, margin:'0 0 6px' }}>No posts yet</p>
            <p style={{ color:muted, fontSize:13 }}>Be the first to post a suggestion!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {posts.map((p,i) => (
              <div key={p.id} style={{ background:card, border:`1px solid ${bdr}`,
                borderRadius:16, padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'flex-start', marginBottom:8 }}>
                  <div style={{ flex:1, marginRight:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ background:`${accent}18`, color:accent,
                        fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>
                        {CAT_ICONS[p.category]} {p.category?.replace('_',' ')}
                      </span>
                      {p.status && p.status !== 'open' && (
                        <span style={{ background:`${STATUS_COLORS[p.status]}18`,
                          color:STATUS_COLORS[p.status], fontSize:9, fontWeight:700,
                          padding:'2px 7px', borderRadius:20 }}>
                          {p.status}
                        </span>
                      )}
                    </div>
                    <p style={{ color:txt, fontWeight:700, fontSize:13, margin:'0 0 4px' }}>{p.title}</p>
                    {p.content && (
                      <p style={{ color:muted, fontSize:11, margin:0, lineHeight:1.5 }}>{p.content}</p>
                    )}
                  </div>
                  <button onClick={() => upvote(p.id)} style={{
                    display:'flex', flexDirection:'column', alignItems:'center',
                    background:`${accent}12`, border:`1px solid ${accent}25`,
                    borderRadius:10, padding:'8px 12px', cursor:'pointer',
                    transition:'all 0.15s', flexShrink:0 }}>
                    <span style={{ fontSize:16 }}>⬆️</span>
                    <span style={{ color:accent, fontWeight:700, fontSize:12 }}>{p.upvotes||0}</span>
                  </button>
                </div>
                {p.admin_response && (
                  <div style={{ background:`${accent}08`, border:`1px solid ${accent}20`,
                    borderRadius:10, padding:'8px 12px', marginTop:8 }}>
                    <p style={{ color:accent, fontSize:10, fontWeight:700, margin:'0 0 3px' }}>
                      TryIT Team Response
                    </p>
                    <p style={{ color:txt, fontSize:11, margin:0 }}>{p.admin_response}</p>
                  </div>
                )}
                <p style={{ color:muted, fontSize:9, margin:'8px 0 0' }}>
                  by {p.profiles?.name || 'Student'} ·{' '}
                  {new Date(p.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
