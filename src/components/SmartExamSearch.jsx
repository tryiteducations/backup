// FILE: src/components/SmartExamSearch.jsx
// Smart Exam Search — fuzzy match, typo tolerance, suggestions,
// state filter, "Exam Not Listed?" 48hr promise
//
// HOW TO USE anywhere in the app:
//   import SmartExamSearch from '../../components/SmartExamSearch'
//   <SmartExamSearch onSelect={(exam) => navigate(`/exams/${exam.id}`)} />

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'

// ── CATEGORY ICONS ────────────────────────────────────────────────────────
const CAT_ICONS = {
  central_govt:      '🏛️',
  state_govt:        '🏢',
  banking_finance:   '🏦',
  defence:           '🎖️',
  police_law_order:  '👮',
  engineering_tech:  '⚙️',
  medical_health:    '🩺',
  teaching_edu:      '📚',
  railway:           '🚂',
  management:        '💼',
  law:               '⚖️',
  agriculture:       '🌾',
  design_arts:       '🎨',
  phd_research:      '🔬',
  paramedical:       '💊',
  foreign_tests:     '🌐',
  professional_cert: '📜',
  skill_trade:       '🔧',
  ug_level:          '🎓',
  pg_level:          '🎓',
}

// ── POPULAR EXAMS (shown before typing) ───────────────────────────────────
const POPULAR_EXAMS = [
  { id:'upsc_cse_pre',   name:'UPSC Civil Services (IAS)',   category:'central_govt',     state:''   },
  { id:'ssc_cgl_t1',     name:'SSC CGL',                     category:'central_govt',     state:''   },
  { id:'ibps_po_pre',    name:'IBPS PO',                     category:'banking_finance',  state:''   },
  { id:'neet_ug_t1',     name:'NEET UG (MBBS Entrance)',     category:'medical_health',   state:''   },
  { id:'jee_main_t1',    name:'JEE Main',                    category:'engineering_tech', state:''   },
  { id:'rrb_ntpc_cbt1',  name:'RRB NTPC',                    category:'central_govt',     state:''   },
  { id:'sbi_po_pre',     name:'SBI PO',                      category:'banking_finance',  state:''   },
  { id:'gate_cs',        name:'GATE Computer Science',       category:'engineering_tech', state:''   },
  { id:'ib_acio_t1',     name:'IB ACIO (Intelligence Bureau)',category:'central_govt',    state:''   },
  { id:'rpf_si_cbt',     name:'RPF Sub Inspector',           category:'police_law_order', state:''   },
  { id:'agniveer_army_gd_cee','name':'Agniveer Army GD',     category:'defence',          state:''   },
  { id:'nda_t1',         name:'NDA Written',                 category:'defence',          state:''   },
  { id:'cat_t1',         name:'CAT (IIM MBA)',               category:'management',       state:''   },
  { id:'clat_ug_t1',     name:'CLAT (Law)',                  category:'law',              state:''   },
  { id:'nift_ug_gat',    name:'NIFT Entrance',               category:'design_arts',      state:''   },
]

// ── FUZZY MATCH (Levenshtein + token match) ───────────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length:m+1 }, (_, i) => Array.from({ length:n+1 }, (_, j) => i||j))
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++)
    dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1]
              : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[m][n]
}

function fuzzyScore(query, target) {
  const q = query.toLowerCase().trim()
  const t = target.toLowerCase().trim()

  // Exact match
  if (t === q) return 100
  // Starts with query
  if (t.startsWith(q)) return 90
  // Contains query
  if (t.includes(q)) return 80
  // All words of query appear in target
  const qWords = q.split(/\s+/)
  if (qWords.every(w => t.includes(w))) return 75
  // Any word of query appears in target
  if (qWords.some(w => t.includes(w) && w.length > 2)) return 60
  // Abbreviation match (e.g. "ssc" matches "Staff Selection Commission")
  const acronym = target.split(/[\s&]+/).map(w=>w[0]).join('').toLowerCase()
  if (acronym.includes(q) || q.includes(acronym)) return 70
  // Typo tolerance via Levenshtein (for queries ≥ 4 chars)
  if (q.length >= 4) {
    const dist = levenshtein(q, t.slice(0, q.length + 2))
    if (dist <= 2) return 50 - dist * 10
    // Check each word
    const tWords = t.split(/\s+/)
    for (const tw of tWords) {
      const wd = levenshtein(q, tw.slice(0, q.length + 1))
      if (wd <= 2) return 45 - wd * 5
    }
  }
  return 0
}
// On TestLauncher, Dashboard, AllExams page:
<SmartExamSearch onSelect={(exam) => navigate(`/exams/${exam.id}`)} />


// ── COMMON TYPO CORRECTIONS ───────────────────────────────────────────────
const TYPO_MAP = {
  'ssc cjl': 'ssc cgl', 'ssc cjg': 'ssc cgl', 'ssc cgl ': 'ssc cgl',
  'ibps op': 'ibps po', 'ipbs po': 'ibps po', 'ibps p0': 'ibps po',
  'upse': 'upsc', 'upcs': 'upsc', 'upsc ias': 'upsc cse',
  'neet ug': 'neet ug', 'neat': 'neet', 'neet pg': 'neet pg',
  'jee mains': 'jee main', 'jee advance': 'jee advanced',
  'gate cs': 'gate computer science',
  'rrb ntpc': 'rrb ntpc', 'railway ntpc': 'rrb ntpc',
  'agnivir': 'agniveer', 'agnipath': 'agniveer',
  'nda exam': 'nda',
  'ctet': 'ctet central teacher eligibility',
}

function correctTypo(query) {
  const q = query.toLowerCase().trim()
  return TYPO_MAP[q] || q
}

export default function SmartExamSearch({ onSelect, placeholder, showPopular = true }) {
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const inputRef   = useRef(null)

  const [query,       setQuery]       = useState('')
  const [results,     setResults]     = useState([])
  const [loading,     setLoading]     = useState(false)
  const [open,        setOpen]        = useState(false)
  const [stateFilter, setStateFilter] = useState(user?.state || '')
  const [showNotListed, setShowNotListed] = useState(false)
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tryit_recent_searches') || '[]') } catch { return [] }
  })

  const debounceRef = useRef(null)

  // ── SEARCH LOGIC ──────────────────────────────────────────────────────────
  const search = useCallback(async (rawQuery) => {
    const corrected = correctTypo(rawQuery)
    const q         = corrected.trim()
    if (q.length < 2) { setResults([]); setLoading(false); return }

    setLoading(true)
    try {
      // Try Supabase full-text search
      const { data: sbResults } = await supabase
        .from('exams')
        .select('id, exam_name, short_name, category, state_code, conducting_body')
        .or(`exam_name.ilike.%${q}%, short_name.ilike.%${q}%, conducting_body.ilike.%${q}%`)
        .limit(40)

      let candidates = sbResults || []

      // Also search exam_tiers for tier names
      const { data: tierResults } = await supabase
        .from('exam_tiers')
        .select('tier_id, exam_id, tier_name, exams(exam_name, category, state_code)')
        .ilike('tier_name', `%${q}%`)
        .limit(20)

      // Merge tier results
      if (tierResults) {
        tierResults.forEach(t => {
          if (!candidates.find(c => c.id === t.exam_id)) {
            candidates.push({
              id: t.exam_id,
              exam_name: t.exams?.exam_name || t.tier_name,
              short_name: t.tier_name,
              category: t.exams?.category || 'central_govt',
              state_code: t.exams?.state_code || '',
            })
          }
        })
      }

      // Score and sort
      const scored = candidates
        .map(exam => ({
          ...exam,
          score: Math.max(
            fuzzyScore(q, exam.exam_name || ''),
            fuzzyScore(q, exam.short_name || ''),
            fuzzyScore(q, exam.conducting_body || '')
          )
        }))
        .filter(e => e.score >= 40)
        .sort((a, b) => b.score - a.score)

      // Apply state filter
      const filtered = stateFilter
        ? scored.filter(e => !e.state_code || e.state_code === stateFilter || e.state_code === '')
        : scored

      setResults(filtered.slice(0, 15))

    } catch {
      // Offline: search popular list with fuzzy
      const q2 = correctTypo(rawQuery)
      const offline = POPULAR_EXAMS
        .map(e => ({ ...e, score: fuzzyScore(q2, e.name) }))
        .filter(e => e.score >= 40)
        .sort((a, b) => b.score - a.score)
      setResults(offline)
    }
    setLoading(false)
  }, [stateFilter])

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.length < 2) { setResults([]); return }
    debounceRef.current = setTimeout(() => search(query), 220)
    return () => clearTimeout(debounceRef.current)
  }, [query, search])

  // ── SAVE RECENT SEARCH ────────────────────────────────────────────────────
  const saveRecent = (examName) => {
    const updated = [examName, ...recentSearches.filter(r => r !== examName)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('tryit_recent_searches', JSON.stringify(updated))
  }

  // ── HANDLE SELECT ─────────────────────────────────────────────────────────
  const handleSelect = (exam) => {
    saveRecent(exam.exam_name || exam.name)
    setOpen(false)
    setQuery('')
    if (onSelect) onSelect(exam)
    else navigate(`/exams/${exam.id}`)
  }

  const displayResults = query.length >= 2 ? results : []
  const showSuggestions = open && (displayResults.length > 0 || query.length === 0)

  return (
    <div style={{ position:'relative', width:'100%', fontFamily:'Inter,sans-serif' }}>

      {/* ── SEARCH INPUT ──────────────────────────────────────────────────── */}
      <div style={{ display:'flex', gap:8, marginBottom: open?0:0 }}>
        <div style={{ flex:1, position:'relative' }}>
          <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)',
            fontSize:16, pointerEvents:'none' }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder={placeholder || 'Search any exam — SSC, UPSC, NEET, Bank, Railway...'}
            style={{ width:'100%', padding:'12px 14px 12px 40px', borderRadius:14,
              border:`2px solid ${open ? GOLD : '#E2E8F0'}`,
              fontSize:14, outline:'none', background:'#fff', boxSizing:'border-box',
              transition:'border-color 0.2s', color:'#1E293B' }}
          />
          {/* Loading spinner */}
          {loading && (
            <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
              width:16, height:16, border:`2px solid ${GOLD}`, borderTopColor:'transparent',
              borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </span>
          )}
          {/* Clear button */}
          {query && !loading && (
            <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', color:'#94A3B8', fontSize:18, lineHeight:1 }}>
              ×
            </button>
          )}
        </div>

        {/* State filter button */}
        <button
          onClick={() => {/* TODO: open state picker */}}
          style={{ padding:'0 14px', borderRadius:12, border:'2px solid #E2E8F0', background:'#fff',
            fontSize:12, fontWeight:600, color:'#64748B', cursor:'pointer', whiteSpace:'nowrap' }}>
          {stateFilter || 'All States'} ▾
        </button>
      </div>

      {/* ── TYPO CORRECTION HINT ─────────────────────────────────────────── */}
      {query.length >= 2 && correctTypo(query) !== query.toLowerCase().trim() && (
        <p style={{ fontSize:11, color:GOLD, marginTop:4 }}>
          🔄 Showing results for "<strong>{correctTypo(query)}</strong>"
        </p>
      )}

      {/* ── DROPDOWN ─────────────────────────────────────────────────────── */}
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, zIndex:500,
          background:'#fff', borderRadius:16, border:'1.5px solid #E2E8F0',
          boxShadow:'0 8px 32px rgba(0,0,0,0.12)', overflow:'hidden', maxHeight:480, overflowY:'auto' }}>

          {/* Recent searches (when query is empty) */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div style={{ padding:'10px 14px', borderBottom:'1px solid #F1F5F9' }}>
              <p style={{ fontSize:10, fontWeight:700, color:'#94A3B8', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>
                Recent Searches
              </p>
              {recentSearches.map(r => (
                <button key={r} onClick={() => { setQuery(r); setOpen(true) }}
                  style={{ display:'block', width:'100%', textAlign:'left', padding:'6px 0',
                    background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#475569' }}>
                  🕐 {r}
                </button>
              ))}
            </div>
          )}

          {/* Popular exams (when query is empty) */}
          {query.length === 0 && showPopular && (
            <div style={{ padding:'10px 14px' }}>
              <p style={{ fontSize:10, fontWeight:700, color:'#94A3B8', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>
                🔥 Popular Exams
              </p>
              {POPULAR_EXAMS.slice(0,8).map(exam => (
                <button key={exam.id} onClick={() => handleSelect(exam)}
                  style={{ display:'flex', alignItems:'center', gap:10, width:'100%',
                    textAlign:'left', padding:'9px 0', background:'none', border:'none',
                    cursor:'pointer', borderBottom:'1px solid #F8FAFC' }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>{CAT_ICONS[exam.category] || '📋'}</span>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:'#1E293B', margin:0 }}>{exam.name}</p>
                    <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>{exam.category?.replace(/_/g,' ')}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Search results */}
          {query.length >= 2 && results.length > 0 && (
            <div style={{ padding:'8px 0' }}>
              <p style={{ fontSize:10, fontWeight:700, color:'#94A3B8', letterSpacing:1,
                textTransform:'uppercase', padding:'4px 14px 8px' }}>
                Results for "{query}"
              </p>
              {results.map((exam, i) => (
                <button key={`${exam.id}_${i}`} onClick={() => handleSelect(exam)}
                  style={{ display:'flex', alignItems:'center', gap:10, width:'100%',
                    textAlign:'left', padding:'10px 14px', background:'none', border:'none',
                    cursor:'pointer', borderBottom:'1px solid #F8FAFC',
                    transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <span style={{ fontSize:18, flexShrink:0 }}>
                    {CAT_ICONS[exam.category] || '📋'}
                  </span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:'#1E293B', margin:0 }}>
                      {highlightMatch(exam.exam_name || exam.name, query)}
                    </p>
                    <p style={{ fontSize:11, color:'#94A3B8', margin:'2px 0 0' }}>
                      {exam.short_name && <span style={{ color:'#64748B', fontWeight:600 }}>{exam.short_name} · </span>}
                      {exam.category?.replace(/_/g,' ')}
                      {exam.state_code && ` · ${exam.state_code}`}
                    </p>
                  </div>
                  {/* Match quality indicator */}
                  {exam.score >= 80 && (
                    <span style={{ fontSize:10, color:'#059669', fontWeight:700, flexShrink:0 }}>✓ Best</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {query.length >= 2 && results.length === 0 && !loading && (
            <div style={{ padding:20, textAlign:'center' }}>
              <p style={{ fontSize:24, marginBottom:8 }}>🤔</p>
              <p style={{ fontSize:13, fontWeight:600, color:'#475569', marginBottom:4 }}>
                No results for "{query}"
              </p>
              <p style={{ fontSize:12, color:'#94A3B8', marginBottom:14 }}>
                Try: "{correctTypo(query)}" or check spelling
              </p>
              <button
                onClick={() => { setOpen(false); setShowNotListed(true) }}
                style={{ padding:'10px 20px', background:NAVY, color:'#fff',
                  border:'none', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                📋 Request This Exam — We'll Add in 48hrs
              </button>
            </div>
          )}

          {/* "Exam not listed?" — always show at bottom when typing */}
          {query.length >= 2 && results.length > 0 && (
            <div style={{ padding:'10px 14px', borderTop:'1px solid #F1F5F9', background:'#FAFAFA' }}>
              <button
                onClick={() => { setOpen(false); setShowNotListed(true) }}
                style={{ display:'flex', alignItems:'center', gap:8, background:'none',
                  border:'none', cursor:'pointer', color:'#64748B', fontSize:12, fontWeight:600 }}>
                <span style={{ fontSize:16 }}>➕</span>
                Don't see your exam? Tell us — we'll add it within 48 hours
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── EXAM NOT LISTED MODAL ─────────────────────────────────────────── */}
      {showNotListed && (
        <ExamNotListedModal
          initialName={query}
          onClose={() => setShowNotListed(false)}
          userId={user?.id}
        />
      )}
    </div>
  )
}

// ── HIGHLIGHT MATCH IN TEXT ───────────────────────────────────────────────
function highlightMatch(text, query) {
  if (!query) return text
  const q   = correctTypo(query).toLowerCase()
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background:`${GOLD}40`, borderRadius:3, padding:'0 1px' }}>
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

// ── EXAM NOT LISTED MODAL ─────────────────────────────────────────────────
function ExamNotListedModal({ initialName, onClose, userId }) {
  const [form, setForm] = useState({
    exam_name:       initialName || '',
    conducting_body: '',
    state:           '',
    exam_type:       'written',
    notification_url:'',
    description:     '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async () => {
    if (!form.exam_name.trim()) { alert('Exam name is required'); return }
    setSubmitting(true)

    const request = {
      ...form,
      user_id:    userId || 'anonymous',
      status:     'pending',
      promise:    '48hr_upload',
      submitted_at: new Date().toISOString(),
    }

    try {
      await supabase.from('exam_requests').insert(request)
    } catch {
      // Save locally
      const existing = JSON.parse(localStorage.getItem('tryit_exam_requests') || '[]')
      existing.push(request)
      localStorage.setItem('tryit_exam_requests', JSON.stringify(existing))
    }

    setSubmitting(false)
    setSubmitted(true)
  }

  const S = {
    inp: { width:'100%', padding:'10px 13px', borderRadius:10, border:'1.5px solid #E2E8F0',
           fontSize:13, outline:'none', boxSizing:'border-box', background:'#fff', marginBottom:10 },
    lbl: { display:'block', fontSize:11, fontWeight:700, color:'#64748B', marginBottom:4 },
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'#fff', borderRadius:24, padding:24, width:'100%', maxWidth:420,
        maxHeight:'90vh', overflowY:'auto' }}>

        {submitted ? (
          // ── SUCCESS STATE ─────────────────────────────────────────────────
          <div style={{ textAlign:'center', padding:'10px 0' }}>
            <p style={{ fontSize:48, marginBottom:12 }}>🎉</p>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:18, marginBottom:8 }}>
              Request Received!
            </h3>
            <p style={{ fontSize:14, color:'#475569', marginBottom:6, lineHeight:1.7 }}>
              We'll upload <strong>{form.exam_name}</strong> within <strong>48 hours</strong>.
            </p>
            <p style={{ fontSize:13, color:'#94A3B8', marginBottom:20 }}>
              You'll get a notification when it's live on TryIT.
            </p>
            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:14, padding:14, marginBottom:20 }}>
              <p style={{ fontSize:12, color:'#065F46', lineHeight:1.6 }}>
                ✅ Exam added to our upload queue<br/>
                ✅ Questions being generated (AI pipeline)<br/>
                ✅ Translating to 42 languages<br/>
                ✅ You'll be notified when live
              </p>
            </div>
            <button onClick={onClose}
              style={{ width:'100%', padding:'12px', background:NAVY, color:'#fff',
                border:'none', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer' }}>
              Done ✓
            </button>
          </div>
        ) : (
          // ── FORM ──────────────────────────────────────────────────────────
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div>
                <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:16, margin:0 }}>
                  📋 Request an Exam
                </h3>
                <p style={{ fontSize:12, color:'#94A3B8', margin:'4px 0 0' }}>
                  We'll add it within <strong style={{ color:GOLD }}>48 hours</strong> — guaranteed
                </p>
              </div>
              <button onClick={onClose}
                style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#94A3B8' }}>
                ×
              </button>
            </div>

            {/* 48hr promise banner */}
            <div style={{ background:'linear-gradient(135deg,#FFF7E6,#FFFBF0)',
              border:`1.5px solid ${GOLD}`, borderRadius:12, padding:'10px 14px', marginBottom:16 }}>
              <p style={{ fontSize:12, color:'#92400E', margin:0, lineHeight:1.6 }}>
                ⚡ <strong>TryIT Promise:</strong> Any exam you request will be added with full question bank,
                concept cards, and 40-language support within <strong>48 hours</strong>. 
                You will get a push notification the moment it's live.
              </p>
            </div>

            <label style={S.lbl}>Exam Name *</label>
            <input style={S.inp} placeholder="e.g. TNPSC Group 2A, HP Police Constable, NHM UP CHO"
              value={form.exam_name} onChange={e => f('exam_name', e.target.value)} />

            <label style={S.lbl}>Conducting Body</label>
            <input style={S.inp} placeholder="e.g. TNPSC, HPSSSB, NHM"
              value={form.conducting_body} onChange={e => f('conducting_body', e.target.value)} />

            <label style={S.lbl}>State (if state-level exam)</label>
            <select style={S.inp} value={form.state} onChange={e => f('state', e.target.value)}>
              <option value="">All India / Central</option>
              {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
                'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
                'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
                'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
                'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
                'Chandigarh','Andaman & Nicobar','Lakshadweep','Dadra & NH'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label style={S.lbl}>Exam Type</label>
            <select style={S.inp} value={form.exam_type} onChange={e => f('exam_type', e.target.value)}>
              <option value="written">Written Test</option>
              <option value="multi_stage">Multi-Stage (Prelims + Mains)</option>
              <option value="interview">Interview Only</option>
              <option value="skill_test">Skill / Physical Test</option>
              <option value="online_cert">Online Certification</option>
            </select>

            <label style={S.lbl}>Official Notification URL (optional)</label>
            <input style={S.inp} placeholder="https://... (paste official notification link if you have it)"
              value={form.notification_url} onChange={e => f('notification_url', e.target.value)} />

            <label style={S.lbl}>Any other details</label>
            <textarea rows={2} style={{ ...S.inp, resize:'none', marginBottom:16 }}
              placeholder="e.g. This is for X post in Y department, eligible for graduates..."
              value={form.description} onChange={e => f('description', e.target.value)} />

            <button onClick={handleSubmit} disabled={submitting}
              style={{ width:'100%', padding:'13px', background:`linear-gradient(135deg,${NAVY},#0F2140)`,
                color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:14, cursor:'pointer',
                opacity: submitting ? 0.7 : 1 }}>
              {submitting ? '⏳ Submitting...' : '📤 Submit — Add Within 48 Hours'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}