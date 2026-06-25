// src/pages/student/StudentBookmarks.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function StudentBookmarks() {
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

  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!authUser) return
    const uid = authUser.id || authUser.userId
    supabase.from('bookmarks').select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBookmarks(data || []); setLoading(false) })
  }, [authUser])

  const removeBookmark = async (id) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    setBookmarks(b => b.filter(x => x.id !== id))
  }

  const TYPES = ['all', 'question', 'material', 'current_affairs']
  const filtered = filter === 'all' ? bookmarks : bookmarks.filter(b => b.content_type === filter)

  const TYPE_ICONS = { question:'📝', material:'📚', current_affairs:'📰', default:'🔖' }
  const TYPE_COLORS = { question:'#60A5FA', material:'#4ADE80', current_affairs:accent, default:muted }

  return (
    <div style={{ minHeight:'100vh', background:bg, fontFamily:'Inter,sans-serif' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px',
        background:isDark?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.9)',
        backdropFilter:'blur(20px)', borderBottom:`1px solid ${bdr}`,
        position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => navigate('/student')} style={{
          background:card, border:`1px solid ${bdr}`, borderRadius:10,
          width:38, height:38, cursor:'pointer', color:txt, fontSize:18,
          display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
        <div>
          <p style={{ color:txt, fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, margin:0 }}>
            🔖 Bookmarks
          </p>
          <p style={{ color:muted, fontSize:11, margin:0 }}>{bookmarks.length} saved items</p>
        </div>
      </div>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'20px' }}>
        {/* Filter tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding:'7px 14px', borderRadius:20, cursor:'pointer',
              border:`1.5px solid ${filter===t ? accent : bdr}`,
              background: filter===t ? `linear-gradient(135deg,${accent},${accentL})` : card,
              color: filter===t ? primD : muted,
              fontWeight:700, fontSize:11, textTransform:'capitalize' }}>
              {t === 'all' ? 'All' : t.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'40px', color:muted }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ background:card, border:`1px dashed ${accent}35`,
            borderRadius:20, padding:'40px', textAlign:'center' }}>
            <p style={{ fontSize:40, margin:'0 0 12px' }}>🔖</p>
            <p style={{ color:txt, fontWeight:700, fontSize:16, margin:'0 0 6px' }}>
              No bookmarks yet
            </p>
            <p style={{ color:muted, fontSize:13 }}>
              Bookmark questions, materials and articles while studying
            </p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.map((b, i) => {
              const icon = TYPE_ICONS[b.content_type] || TYPE_ICONS.default
              const color = TYPE_COLORS[b.content_type] || TYPE_COLORS.default
              const data = b.content_data || {}
              return (
                <div key={i} style={{ background:card, border:`1px solid ${bdr}`,
                  borderRadius:16, padding:'14px 16px',
                  display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:12,
                    background:`${color}18`, display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ color:txt, fontWeight:700, fontSize:13, margin:'0 0 3px',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {data.title || b.content_id || 'Bookmarked item'}
                    </p>
                    <p style={{ color:muted, fontSize:10, margin:0 }}>
                      {b.content_type?.replace('_',' ')} ·{' '}
                      {new Date(b.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                    </p>
                  </div>
                  <button onClick={() => removeBookmark(b.id)} style={{
                    background:'transparent', border:'none', color:'#F87171',
                    fontSize:18, cursor:'pointer', padding:'4px', flexShrink:0 }}>🗑️</button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
