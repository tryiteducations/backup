// FILE: src/pages/admin/CurrentAffairsManager.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['National','International','Economy','Science & Tech','Sports','Awards','Environment','Defence']
const EMPTY = { title:'', summary:'', category:'National', source:'', date:'', exam_relevance:[] }

export default function CurrentAffairsManager() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('current_affairs').select('*').order('date',{ascending:false}).limit(100)
      if (error) throw error
      setArticles(data || [])
    } catch { setArticles([]) }
    setLoading(false)
  }

  async function save() {
    if (!editing.title?.trim()) return
    const payload = { ...editing, date: editing.date || new Date().toISOString().split('T')[0] }
    delete payload.created_at
    try {
      const { error } = await supabase.from('current_affairs').upsert(payload)
      if (error) throw error
      await load(); setEditing(null)
    } catch (e) {
      alert('Save failed — ensure "current_affairs" table exists (see schema). ' + e.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this article?')) return
    try { await supabase.from('current_affairs').delete().eq('id', id); await load() }
    catch (e) { alert('Delete failed: ' + e.message) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', padding:'24px clamp(16px,4vw,40px)' }}>
      <button onClick={()=>navigate('/admin/dashboard')} style={{ background:'none', border:'none', color:'var(--color-muted, #64748B)', cursor:'pointer', fontSize:13, marginBottom:12 }}>← Back to Admin</button>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:24, marginBottom:6 }}>📰 Current Affairs Manager</h1>
      <p style={{ color:'#94A3B8', fontSize:13, marginBottom:16 }}>Articles posted here appear live on every user's Current Affairs page + earn them +5🪙 per read.</p>

      <button onClick={()=>setEditing({...EMPTY})} style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', border:'none', borderRadius:12, padding:'10px 20px', color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer', marginBottom:14 }}>+ Add Article</button>

      {loading ? <p style={{ color:'#94A3B8' }}>Loading...</p> : articles.length===0 ? (
        <div style={{ textAlign:'center', padding:40, color:'#94A3B8', background:'#fff', borderRadius:16, border:'1.5px solid var(--color-border, #E2E8F0)' }}>
          <p style={{ fontSize:32, marginBottom:8 }}>📰</p>
          <p>No articles yet. Add your first one above — it'll appear on users' Current Affairs page immediately.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {articles.map(a=>(
            <div key={a.id} style={{ padding:'12px 16px', background:'#fff', borderRadius:14, border:'1.5px solid var(--color-border, #E2E8F0)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:200 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:'#7C3AED', background:'#EDE9FE', padding:'2px 8px', borderRadius:20 }}>{a.category}</span>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', fontSize:14, marginTop:6 }}>{a.title}</p>
                  <p style={{ color:'var(--color-muted, #64748B)', fontSize:12, marginTop:4 }}>{a.summary}</p>
                  <p style={{ color:'#94A3B8', fontSize:11, marginTop:4 }}>{a.source} · {a.date}</p>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={()=>setEditing(a)} style={{ background:'var(--color-bg-muted-2, #F1F5F9)', border:'none', borderRadius:10, padding:'6px 12px', fontSize:12, fontWeight:700, color:'var(--color-primary, #1E3A5F)', cursor:'pointer' }}>Edit</button>
                  <button onClick={()=>remove(a.id)} style={{ background:'#FEE2E2', border:'none', borderRadius:10, padding:'6px 12px', fontSize:12, fontWeight:700, color:'#991B1B', cursor:'pointer' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex:999 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:24, maxWidth:480, width:'100%', maxHeight:'85vh', overflowY:'auto' }}>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', marginBottom:14 }}>{editing.id ? 'Edit' : 'New'} Article</h3>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--color-primary, #1E3A5F)', marginBottom:4 }}>Title</label>
            <input value={editing.title} onChange={e=>setEditing(v=>({...v,title:e.target.value}))}
              style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, marginBottom:10, boxSizing:'border-box' }}/>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--color-primary, #1E3A5F)', marginBottom:4 }}>Summary</label>
            <textarea value={editing.summary} onChange={e=>setEditing(v=>({...v,summary:e.target.value}))} rows={3}
              style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, marginBottom:10, boxSizing:'border-box', resize:'none' }}/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--color-primary, #1E3A5F)', marginBottom:4 }}>Category</label>
                <select value={editing.category} onChange={e=>setEditing(v=>({...v,category:e.target.value}))}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13 }}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--color-primary, #1E3A5F)', marginBottom:4 }}>Date</label>
                <input type="date" value={editing.date} onChange={e=>setEditing(v=>({...v,date:e.target.value}))}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, boxSizing:'border-box' }}/>
              </div>
            </div>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--color-primary, #1E3A5F)', marginBottom:4 }}>Source (e.g. PIB, The Hindu)</label>
            <input value={editing.source} onChange={e=>setEditing(v=>({...v,source:e.target.value}))}
              style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, marginBottom:14, boxSizing:'border-box' }}/>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={save} style={{ flex:1, padding:12, borderRadius:12, border:'none', background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif', fontWeight:700, cursor:'pointer' }}>Save & Publish</button>
              <button onClick={()=>setEditing(null)} style={{ flex:1, padding:12, borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', background:'#fff', color:'var(--color-muted, #64748B)', fontWeight:600, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
