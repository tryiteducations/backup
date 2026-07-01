// FILE: src/pages/admin/ExamManager.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['govt_central','govt_state','banking','railways','defence','medical','engineering','engineering_pg','teaching','school_competitive','scholarship','professional_cert','foreign_language']

const EMPTY = { name:'', body:'', category:'govt_central', level:'', vacancies:'', price_inr:0, emoji:'📋' }

export default function ExamManager() {
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | EMPTY | exam object
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('local') // 'local' | 'supabase'

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('exams').select('*').order('name')
      if (error) throw error
      if (data && data.length) {
        setExams(data); setSource('supabase'); setLoading(false); return
      }
    } catch {}
    // Fallback: static exams.json (read-only baseline)
    try {
      const res = await fetch('/data/exams.json')
      const json = await res.json()
      setExams(json.exams || [])
      setSource('local')
    } catch { setExams([]) }
    setLoading(false)
  }

  const filtered = exams.filter(e =>
    (e.name||'').toLowerCase().includes(search.toLowerCase()) ||
    (e.body||'').toLowerCase().includes(search.toLowerCase())
  )

  async function save() {
    if (!editing.name?.trim()) return
    const payload = {
      ...editing,
      id: editing.id || editing.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
      vacancies: editing.vacancies ? parseInt(editing.vacancies) : null,
      price_inr: editing.price_inr ? parseFloat(editing.price_inr) : 0,
    }
    try {
      const { error } = await supabase.from('exams').upsert(payload)
      if (error) throw error
      await load()
      setEditing(null)
    } catch (e) {
      alert('Could not save to Supabase. Make sure the "exams" table exists (see schema). Error: ' + e.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this exam permanently?')) return
    try {
      await supabase.from('exams').delete().eq('id', id)
      await load()
    } catch (e) { alert('Delete failed: ' + e.message) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg,#F8FAFC)', padding:'24px clamp(16px,4vw,40px)' }}>
      <button onClick={()=>navigate('/admin/dashboard')} style={{ background:'none', border:'none', color:'var(--color-muted, #64748B)', cursor:'pointer', fontSize:13, marginBottom:12 }}>← Back to Admin</button>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', fontSize:24, marginBottom:6 }}>📋 Exam Manager</h1>
      <p style={{ color:'#94A3B8', fontSize:13, marginBottom:16 }}>
        {source==='local'
          ? '⚠️ Reading from static /data/exams.json (Supabase "exams" table empty/missing - saves will fail until table exists, see schema)'
          : `✅ Connected to Supabase - ${exams.length} exams`}
      </p>

      <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search exams..."
          style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, outline:'none' }}/>
        <button onClick={()=>setEditing({...EMPTY})} style={{ background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', border:'none', borderRadius:12, padding:'10px 20px', color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer' }}>+ Add Exam</button>
      </div>

      {loading ? <p style={{ color:'#94A3B8' }}>Loading...</p> : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {filtered.slice(0,100).map(e=>(
            <div key={e.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#fff', borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', flexWrap:'wrap' }}>
              <span style={{ fontSize:18 }}>{e.emoji||'📋'}</span>
              <div style={{ flex:1, minWidth:160 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', fontSize:13 }}>{e.name}</p>
                <p style={{ color:'#94A3B8', fontSize:11 }}>{e.body} · {e.category} · {e.level}</p>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color: e.price_inr>0 ? '#92400E':'#15803D', background: e.price_inr>0 ? 'rgba(212,175,55,0.12)':'rgba(34,197,94,0.1)', padding:'4px 10px', borderRadius:20 }}>
                {e.price_inr>0 ? `₹${e.price_inr}` : 'Free'}
              </span>
              <button onClick={()=>setEditing({...e, vacancies: e.vacancies||'', price_inr: e.price_inr||0})} style={{ background:'var(--color-bg-muted-2, #F1F5F9)', border:'none', borderRadius:10, padding:'6px 12px', fontSize:12, fontWeight:700, color:'var(--color-primary, #1E3A5F)', cursor:'pointer' }}>Edit</button>
              <button onClick={()=>remove(e.id)} style={{ background:'#FEE2E2', border:'none', borderRadius:10, padding:'6px 12px', fontSize:12, fontWeight:700, color:'#991B1B', cursor:'pointer' }}>Delete</button>
            </div>
          ))}
          {filtered.length > 100 && <p style={{ color:'#94A3B8', fontSize:12, textAlign:'center' }}>Showing 100 of {filtered.length} - refine search</p>}
        </div>
      )}

      {/* Edit/Add modal */}
      {editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex:999 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:24, maxWidth:480, width:'100%', maxHeight:'85vh', overflowY:'auto' }}>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'var(--color-primary, #1E3A5F)', marginBottom:14 }}>{editing.id ? 'Edit Exam' : 'Add New Exam'}</h3>
            {[
              ['Exam Name','name','text'], ['Conducting Body','body','text'],
              ['Level (e.g. Graduate, 12th Pass)','level','text'],
              ['Vacancies (optional)','vacancies','number'],
              ['Price ₹ (0 = free)','price_inr','number'],
              ['Emoji','emoji','text'],
            ].map(([label,key,type])=>(
              <div key={key} style={{ marginBottom:10 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--color-primary, #1E3A5F)', marginBottom:4 }}>{label}</label>
                <input type={type} value={editing[key]??''} onChange={e=>setEditing(v=>({...v,[key]:e.target.value}))}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13, outline:'none', boxSizing:'border-box' }}/>
              </div>
            ))}
            <div style={{ marginBottom:10 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--color-primary, #1E3A5F)', marginBottom:4 }}>Category</label>
              <select value={editing.category} onChange={e=>setEditing(v=>({...v,category:e.target.value}))}
                style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid var(--color-border, #E2E8F0)', fontSize:13 }}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:14 }}>
              <button onClick={save} style={{ flex:1, padding:12, borderRadius:12, border:'none', background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))', color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif', fontWeight:700, cursor:'pointer' }}>Save</button>
              <button onClick={()=>setEditing(null)} style={{ flex:1, padding:12, borderRadius:12, border:'1.5px solid var(--color-border, #E2E8F0)', background:'#fff', color:'var(--color-muted, #64748B)', fontWeight:600, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
