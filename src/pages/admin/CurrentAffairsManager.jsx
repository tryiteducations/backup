// FILE: src/pages/admin/CurrentAffairsManager.jsx
// Admin - Daily Current Affairs & Materials Manager
// Route: /admin/current-affairs
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'

const MATERIAL_TYPES = [
  { id:'daily_current_affairs', label:'Daily Current Affairs',   icon:'📰' },
  { id:'weekly_digest',         label:'Weekly Digest',           icon:'📋' },
  { id:'monthly_magazine',      label:'Monthly Magazine',        icon:'📙' },
  { id:'study_notes',           label:'Study Notes',             icon:'📝' },
  { id:'question_paper',        label:'Question Paper (PYQ)',    icon:'📄' },
  { id:'answer_key',            label:'Answer Key',              icon:'🔑' },
  { id:'exam_notification',     label:'Exam Notification',       icon:'📣' },
  { id:'cutoff_analysis',       label:'Cutoff Analysis',         icon:'📊' },
  { id:'strategy_guide',        label:'Strategy Guide',          icon:'🎯' },
  { id:'revision_sheet',        label:'Revision Sheet',          icon:'🗂️' },
  { id:'formula_sheet',         label:'Formula Sheet',           icon:'📐' },
  { id:'vocabulary_list',       label:'Vocabulary List',         icon:'📖' },
  { id:'one_liner_gk',          label:'One-Liner GK',            icon:'💡' },
  { id:'video_link',            label:'Video Link',              icon:'▶️' },
  { id:'bharat_pulse_story',    label:'Bharat Pulse Story',      icon:'🇮🇳' },
]

const EXAM_TAGS = [
  'upsc','ssc_cgl','ssc_chsl','ibps_po','ibps_clerk','sbi_po',
  'rrb_ntpc','rrb_group_d','neet','jee','gate','nda','tnpsc',
  'kpsc','mppsc','uppsc','all_exams',
]

const S = {
  card:   { background:'var(--color-bg,#F8FAFC)', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0', marginBottom:12 },
  inp:    { width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:10, background:'#fff' },
  lbl:    { display:'block', fontSize:11, fontWeight:700, color:'var(--color-text-light,#64748B)', marginBottom:4 },
  btn:    { background:NAVY, color:'#fff', border:'none', borderRadius:10, padding:'10px 20px', fontWeight:700, fontSize:13, cursor:'pointer' },
  btnSm:  { background:'#EFF6FF', color:NAVY, border:'1.5px solid #BFDBFE', borderRadius:8, padding:'6px 12px', fontWeight:600, fontSize:11, cursor:'pointer' },
  btnRed: { background:'#FEE2E2', color:'#991B1B', border:'none', borderRadius:8, padding:'6px 12px', fontWeight:600, fontSize:11, cursor:'pointer' },
}

export default function CurrentAffairsManager() {
  const navigate = useNavigate()
  const [tab,       setTab]       = useState('post')
  const [materials, setMaterials] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [filter,    setFilter]    = useState('all')
  const [dateRange, setDateRange] = useState({ from:'', to:'' })
  const [saveMsg,   setSaveMsg]   = useState('')

  // Check admin
  useEffect(() => {
    if (localStorage.getItem('tryit_admin') !== 'true' &&
        localStorage.getItem('tryit_admin') !== '1') {
      navigate('/admin/login')
    }
  }, [navigate])

  // Load materials
  useEffect(() => {
    if (tab === 'list') loadMaterials()
  }, [tab, filter, dateRange])

  const loadMaterials = async () => {
    setLoading(true)
    try {
      let q = supabase
        .from('daily_materials')
        .select('*')
        .order('publish_date', { ascending:false })
        .limit(100)

      if (filter !== 'all') q = q.eq('material_type', filter)
      if (dateRange.from)   q = q.gte('publish_date', dateRange.from)
      if (dateRange.to)     q = q.lte('publish_date', dateRange.to)

      const { data } = await q
      setMaterials(data || [])
    } catch {
      // Offline fallback
      const local = JSON.parse(localStorage.getItem('tryit_admin_materials') || '[]')
      setMaterials(local)
    }
    setLoading(false)
  }

  const toggleMaterial = async (mat) => {
    try {
      await supabase.from('daily_materials')
        .update({ is_active: !mat.is_active })
        .eq('material_id', mat.material_id || mat.id)
    } catch {}
    setMaterials(prev => prev.map(m =>
      (m.material_id || m.id) === (mat.material_id || mat.id)
        ? { ...m, is_active: !m.is_active } : m
    ))
  }

  const deleteMaterial = async (mat) => {
    if (!window.confirm('Delete this material permanently?')) return
    try {
      await supabase.from('daily_materials').delete().eq('material_id', mat.material_id || mat.id)
    } catch {}
    setMaterials(prev => prev.filter(m => (m.material_id||m.id) !== (mat.material_id||mat.id)))
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg,#F8FAFC)', fontFamily:'Poppins,sans-serif' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'16px 20px',
        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <button onClick={() => navigate('/admin/dashboard')}
            style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:13, marginBottom:4, display:'block' }}>
            ← Back to Dashboard
          </button>
          <p style={{ color:GOLD, fontWeight:800, fontSize:18, margin:0 }}>📰 Current Affairs Manager</p>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, margin:0 }}>Post, schedule, and manage all daily materials</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, borderBottom:'1px solid #E2E8F0', background:'#fff' }}>
        {[
          { id:'post',      label:'➕ Post New' },
          { id:'schedule',  label:'📅 Schedule' },
          { id:'list',      label:'📋 All Materials' },
          { id:'analytics', label:'📊 Analytics' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'12px 20px', border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
              background: tab===t.id ? '#fff' : '#F8FAFC',
              color: tab===t.id ? NAVY : '#94A3B8',
              borderBottom: tab===t.id ? `2.5px solid ${GOLD}` : '2.5px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:20, maxWidth:900, margin:'0 auto' }}>
        {tab === 'post'      && <PostTab setSaveMsg={setSaveMsg} saveMsg={saveMsg} setMaterials={setMaterials} />}
        {tab === 'schedule'  && <ScheduleTab />}
        {tab === 'list'      && <ListTab materials={materials} loading={loading} filter={filter}
                                          setFilter={setFilter} dateRange={dateRange} setDateRange={setDateRange}
                                          toggleMaterial={toggleMaterial} deleteMaterial={deleteMaterial} />}
        {tab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  )
}

// -- POST TAB ---------------------------------------------------------------
function PostTab({ setSaveMsg, saveMsg, setMaterials }) {
  const [form, setForm] = useState({
    title:'', subtitle:'', material_type:'daily_current_affairs',
    publish_date: new Date().toISOString().slice(0,10),
    source:'', file_url:'', relevant_for:'all',
    target_exams:[], languages:['en','hi','ta'],
    is_pinned:false,
  })
  const [saving, setSaving] = useState(false)
  const [exTagOpen, setExTagOpen] = useState(false)

  const f = (k, v) => setForm(p => ({ ...p, [k]:v }))

  const toggleExam = (ex) => {
    setForm(p => ({
      ...p,
      target_exams: p.target_exams.includes(ex)
        ? p.target_exams.filter(e => e !== ex)
        : [...p.target_exams, ex]
    }))
  }

  const handlePost = async () => {
    if (!form.title.trim()) { alert('Title is required'); return }
    setSaving(true)
    const record = {
      ...form,
      material_id: `mat_${Date.now()}`,
      posted_by: 'admin',
      is_active: true,
      view_count: 0,
      download_count: 0,
      created_at: new Date().toISOString(),
    }
    try {
      await supabase.from('daily_materials').insert(record)
      setSaveMsg('✅ Posted successfully!')
    } catch {
      const saved = JSON.parse(localStorage.getItem('tryit_admin_materials') || '[]')
      saved.unshift(record)
      localStorage.setItem('tryit_admin_materials', JSON.stringify(saved))
      setSaveMsg('✅ Saved locally (syncs when online)')
    }
    setMaterials(p => [record, ...p])
    setForm(x => ({ ...x, title:'', subtitle:'', source:'', file_url:'' }))
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const typeInfo = MATERIAL_TYPES.find(t => t.id === form.material_type)

  return (
    <div>
      <h2 style={{ color:NAVY, fontSize:18, fontWeight:800, marginBottom:4 }}>Post New Material</h2>
      <p style={{ color:'var(--color-text-light,#64748B)', fontSize:13, marginBottom:20 }}>
        This will be visible to students immediately (or on the publish date you set).
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Left column */}
        <div>
          <label style={S.lbl}>Material Type *</label>
          <select style={S.inp} value={form.material_type}
            onChange={e => f('material_type', e.target.value)}>
            {MATERIAL_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
            ))}
          </select>

          <label style={S.lbl}>Title *</label>
          <input style={S.inp} placeholder={`e.g. ${typeInfo?.icon} Daily CA - ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long'})}`}
            value={form.title} onChange={e => f('title', e.target.value)} />

          <label style={S.lbl}>Subtitle (optional)</label>
          <input style={S.inp} placeholder="e.g. Economy + Science + International Affairs"
            value={form.subtitle} onChange={e => f('subtitle', e.target.value)} />

          <label style={S.lbl}>Source</label>
          <input style={S.inp} placeholder="e.g. The Hindu, PIB, Drishti IAS, RSTV"
            value={form.source} onChange={e => f('source', e.target.value)} />

          <label style={S.lbl}>Publish Date</label>
          <input type="date" style={S.inp} value={form.publish_date}
            onChange={e => f('publish_date', e.target.value)} />
        </div>

        {/* Right column */}
        <div>
          <label style={S.lbl}>File URL (PDF / Image / Video)</label>
          <input style={S.inp}
            placeholder="https://... (Supabase Storage URL or external link)"
            value={form.file_url} onChange={e => f('file_url', e.target.value)} />
          <p style={{ fontSize:10, color:'#94A3B8', marginTop:-8, marginBottom:10 }}>
            Upload to Supabase Storage → get public URL → paste here
          </p>

          <label style={S.lbl}>Visible To</label>
          <select style={S.inp} value={form.relevant_for} onChange={e => f('relevant_for', e.target.value)}>
            <option value="all">All Users (Free + Pro + Ultra)</option>
            <option value="free">Free Users Only</option>
            <option value="pro">Pro + Ultra Users</option>
            <option value="ultra">Ultra Users Only</option>
          </select>

          <label style={S.lbl}>Target Exams</label>
          <div style={{ marginBottom:10 }}>
            <button type="button" onClick={() => setExTagOpen(o => !o)}
              style={{ ...S.btnSm, marginBottom:6, width:'100%', textAlign:'left' }}>
              {form.target_exams.length === 0 ? '+ Select Exams (All Exams if none selected)' : `${form.target_exams.length} exams selected ▾`}
            </button>
            {exTagOpen && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {EXAM_TAGS.map(ex => (
                  <button key={ex} type="button" onClick={() => toggleExam(ex)}
                    style={{ padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:600, cursor:'pointer', border:'none',
                      background: form.target_exams.includes(ex) ? NAVY : '#EFF6FF',
                      color:      form.target_exams.includes(ex) ? '#fff' : '#1D4ED8' }}>
                    {ex.replace(/_/g,' ').toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <input type="checkbox" id="pinned" checked={form.is_pinned}
              onChange={e => f('is_pinned', e.target.checked)} />
            <label htmlFor="pinned" style={{ fontSize:12, color:'#475569', cursor:'pointer' }}>
              📌 Pin this (shown at top of feed)
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      {form.title && (
        <div style={{ background:'#fff', borderRadius:14, padding:14, border:`1.5px solid ${GOLD}`,
          marginBottom:16 }}>
          <p style={{ fontSize:11, color:GOLD, fontWeight:700, marginBottom:8 }}>📱 PREVIEW</p>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:24 }}>{typeInfo?.icon}</span>
            <div>
              <p style={{ fontWeight:700, color:NAVY, fontSize:14, margin:0 }}>
                {form.is_pinned && '📌 '}{form.title}
              </p>
              <p style={{ fontSize:11, color:'var(--color-text-light,#64748B)', margin:'2px 0 0' }}>
                {form.subtitle && `${form.subtitle} · `}
                {form.source} · {form.publish_date}
                {form.relevant_for !== 'all' && ` · ${form.relevant_for.toUpperCase()} only`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        <button onClick={handlePost} disabled={saving || !form.title.trim()}
          style={{ ...S.btn, padding:'12px 28px', fontSize:14,
            opacity: saving || !form.title.trim() ? 0.6 : 1 }}>
          {saving ? '⏳ Posting...' : '📤 Post Material'}
        </button>
        {saveMsg && <span style={{ color:'#059669', fontSize:13, fontWeight:600 }}>{saveMsg}</span>}
      </div>
    </div>
  )
}

// -- SCHEDULE TAB -----------------------------------------------------------
function ScheduleTab() {
  const [scheduled, setScheduled] = useState([])

  useEffect(() => {
    supabase.from('daily_materials')
      .select('*')
      .gt('publish_date', new Date().toISOString().slice(0,10))
      .order('publish_date', { ascending:true })
      .limit(30)
      .then(({ data }) => setScheduled(data || []))
      .catch(() => setScheduled([]))
  }, [])

  return (
    <div>
      <h2 style={{ color:NAVY, fontSize:18, fontWeight:800, marginBottom:4 }}>Upcoming Schedule</h2>
      <p style={{ color:'var(--color-text-light,#64748B)', fontSize:13, marginBottom:20 }}>
        Materials scheduled for future dates. They auto-publish at midnight on the publish date.
      </p>

      {scheduled.length === 0 ? (
        <div style={{ textAlign:'center', padding:40, color:'#94A3B8',
          background:'#fff', borderRadius:14, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontSize:28, marginBottom:8 }}>📅</p>
          <p>No materials scheduled for future dates.</p>
          <p style={{ fontSize:12 }}>Go to "Post New" and set a future publish date to schedule.</p>
        </div>
      ) : (
        <div>
          {scheduled.map(m => {
            const typeInfo = MATERIAL_TYPES.find(t => t.id === m.material_type)
            const daysUntil = Math.ceil((new Date(m.publish_date) - new Date()) / (1000*60*60*24))
            return (
              <div key={m.material_id||m.id}
                style={{ display:'flex', gap:12, padding:'12px 16px',
                  background:'#fff', borderRadius:12, border:'1.5px solid #E2E8F0', marginBottom:8,
                  alignItems:'center' }}>
                <div style={{ width:44, height:44, borderRadius:10, background:`${NAVY}15`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {typeInfo?.icon}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:700, color:NAVY, fontSize:13, margin:0 }}>{m.title}</p>
                  <p style={{ fontSize:11, color:'var(--color-text-light,#64748B)', margin:'2px 0 0' }}>
                    {m.publish_date} · {m.source || 'No source'}
                  </p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ background:'#FEF3C7', color:'#D97706', padding:'3px 10px',
                    borderRadius:99, fontSize:11, fontWeight:700 }}>
                    In {daysUntil} day{daysUntil!==1?'s':''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// -- LIST TAB ---------------------------------------------------------------
function ListTab({ materials, loading, filter, setFilter, dateRange, setDateRange, toggleMaterial, deleteMaterial }) {
  const [search, setSearch] = useState('')

  const filtered = materials.filter(m =>
    m.title?.toLowerCase().includes(search.toLowerCase()) ||
    m.source?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <input style={{ ...S.inp, flex:1, minWidth:200, marginBottom:0 }}
          placeholder="Search by title or source..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ padding:'10px 12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:12 }}
          value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Types</option>
          {MATERIAL_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
        </select>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <input type="date" style={{ padding:'8px 10px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:11 }}
          value={dateRange.from} onChange={e => setDateRange(p=>({...p,from:e.target.value}))}
          placeholder="From date" />
        <span style={{ alignSelf:'center', color:'var(--color-text-light,#64748B)', fontSize:12 }}>to</span>
        <input type="date" style={{ padding:'8px 10px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:11 }}
          value={dateRange.to} onChange={e => setDateRange(p=>({...p,to:e.target.value}))} />
      </div>

      <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)', marginBottom:12 }}>
        Showing {filtered.length} materials
      </p>

      {loading ? <p style={{ color:'#94A3B8' }}>Loading...</p>
      : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:30, color:'#94A3B8',
          background:'#fff', borderRadius:12, border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontSize:24 }}>📭</p>
          <p>No materials found. Post your first one!</p>
        </div>
      ) : filtered.map(m => {
        const typeInfo = MATERIAL_TYPES.find(t => t.id === m.material_type)
        return (
          <div key={m.material_id||m.id}
            style={{ display:'flex', gap:12, padding:'12px 16px', background:'#fff',
              borderRadius:12, border:'1.5px solid #E2E8F0', marginBottom:8,
              opacity: m.is_active ? 1 : 0.5, alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ fontSize:22, flexShrink:0 }}>{typeInfo?.icon}</span>
            <div style={{ flex:1, minWidth:160 }}>
              <p style={{ fontWeight:700, color:NAVY, fontSize:13, margin:0 }}>
                {m.is_pinned && '📌 '}{m.title}
              </p>
              <p style={{ fontSize:11, color:'var(--color-text-light,#64748B)', margin:'2px 0 0' }}>
                {m.publish_date} · {m.source || '-'} · {m.relevant_for}
              </p>
              <p style={{ fontSize:10, color:'#94A3B8', margin:'1px 0 0' }}>
                👁️ {m.view_count||0} · ⬇️ {m.download_count||0}
              </p>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                background: m.is_active?'#D1FAE5':'#F1F5F9',
                color: m.is_active?'#065F46':'#94A3B8' }}>
                {m.is_active?'Live':'Hidden'}
              </span>
              {m.file_url && (
                <a href={m.file_url} target="_blank" rel="noreferrer"
                  style={{ ...S.btnSm, textDecoration:'none' }}>View</a>
              )}
              <button onClick={() => toggleMaterial(m)} style={S.btnSm}>
                {m.is_active?'Hide':'Show'}
              </button>
              <button onClick={() => deleteMaterial(m)} style={S.btnRed}>Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// -- ANALYTICS TAB ----------------------------------------------------------
function AnalyticsTab() {
  const [stats, setStats] = useState({ total:0, today:0, views:0, downloads:0, pinned:0 })

  useEffect(() => {
    const today = new Date().toISOString().slice(0,10)
    Promise.all([
      supabase.from('daily_materials').select('*',{count:'exact',head:true}),
      supabase.from('daily_materials').select('*',{count:'exact',head:true}).eq('publish_date',today),
      supabase.from('daily_materials').select('view_count,download_count,is_pinned'),
    ]).then(([totalRes, todayRes, viewRes]) => {
      const rows = viewRes.data || []
      setStats({
        total:     totalRes.count || 0,
        today:     todayRes.count || 0,
        views:     rows.reduce((a,r) => a+(r.view_count||0), 0),
        downloads: rows.reduce((a,r) => a+(r.download_count||0), 0),
        pinned:    rows.filter(r=>r.is_pinned).length,
      })
    }).catch(() => {})
  }, [])

  return (
    <div>
      <h2 style={{ color:NAVY, fontSize:18, fontWeight:800, marginBottom:16 }}>Materials Analytics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12 }}>
        {[
          { label:'Total Materials', value:stats.total,     emoji:'📄' },
          { label:'Posted Today',    value:stats.today,     emoji:'📅' },
          { label:'Total Views',     value:stats.views,     emoji:'👁️' },
          { label:'Downloads',       value:stats.downloads, emoji:'⬇️' },
          { label:'Pinned',          value:stats.pinned,    emoji:'📌' },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', borderRadius:14, padding:16,
            border:'1.5px solid #E2E8F0', textAlign:'center' }}>
            <p style={{ fontSize:24, margin:'0 0 6px' }}>{s.emoji}</p>
            <p style={{ fontWeight:900, color:NAVY, fontSize:22, margin:'0 0 4px' }}>
              {s.value.toLocaleString('en-IN')}
            </p>
            <p style={{ fontSize:11, color:'var(--color-text-light,#64748B)', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background:'#fff', borderRadius:14, padding:16, border:'1.5px solid #E2E8F0', marginTop:20 }}>
        <p style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:12 }}>📋 Quick Tips</p>
        {[
          'Post daily current affairs before 7 AM - students check first thing in morning',
          'Pin important exam notifications so they stay visible across days',
          'Formula sheets and revision sheets get the most downloads near exam dates',
          'Add exam tags so only relevant students see each material in their feed',
          'Bharat Pulse stories auto-appear in the Bharat Pulse section separately',
        ].map((tip, i) => (
          <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start' }}>
            <span style={{ color:GOLD, fontWeight:700, flexShrink:0 }}>→</span>
            <p style={{ fontSize:12, color:'#475569', margin:0 }}>{tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}