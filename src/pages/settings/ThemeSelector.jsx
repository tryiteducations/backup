import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useTheme } from '../../context/ThemeContext'
import { THEMES, THEME_CATEGORIES } from '../../lib/themes'

export default function ThemeSelector() {
  const { themeId, setTheme } = useTheme()
  const [cat, setCat]         = useState('All')
  const [preview, setPreview] = useState(null)

  const visible = Object.values(THEMES).filter(t =>
    cat === 'All' || t.category === cat
  )

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
        color:'var(--color-text)', fontSize:28, marginBottom:6 }}>
        🎨 Themes
      </h1>
      <p style={{ color:'var(--color-text-light)', fontSize:14, marginBottom:20 }}>
        {Object.keys(THEMES).length} themes · Cinematic · Indian Cinema · Mood · Nature
      </p>

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        {['All',...THEME_CATEGORIES].map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ padding:'7px 16px', borderRadius:20, border:'none',
              cursor:'pointer', whiteSpace:'nowrap',
              background: cat===c ? 'var(--color-primary)' : 'var(--color-surface)',
              color: cat===c ? 'var(--color-accent)' : 'var(--color-text-light)',
              fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12 }}>
            {c}
          </button>
        ))}
      </div>

      {/* Theme grid */}
      <div style={{ display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,180px),1fr))',
        gap:12 }}>
        {visible.map(t => (
          <div key={t.id}
            onClick={() => setTheme(t.id)}
            onMouseEnter={() => setPreview(t.id)}
            onMouseLeave={() => setPreview(null)}
            style={{ borderRadius:20, overflow:'hidden', cursor:'pointer',
              border:`2px solid ${themeId===t.id?t.accent:'transparent'}`,
              boxShadow: themeId===t.id
                ? `0 8px 24px ${t.accent}44`
                : '0 2px 10px rgba(0,0,0,0.08)',
              transform: themeId===t.id||preview===t.id ? 'translateY(-3px)' : 'none',
              transition:'all 0.2s' }}>

            {/* Theme preview swatch */}
            <div style={{ height:80, background:t.idCardBg,
              display:'flex', alignItems:'center', justifyContent:'center',
              position:'relative' }}>
              <span style={{ fontSize:28 }}>{t.emoji}</span>
              {themeId===t.id && (
                <div style={{ position:'absolute', top:8, right:8,
                  width:22, height:22, borderRadius:'50%',
                  background:t.accent, display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:12, fontWeight:800,
                  color:t.primary }}>✓</div>
              )}
              {/* Accent dot */}
              <div style={{ position:'absolute', bottom:8, right:8,
                width:16, height:16, borderRadius:'50%',
                background:t.accent, border:`2px solid ${t.idCardText}44` }}/>
            </div>

            {/* Name */}
            <div style={{ padding:'10px 12px',
              background:'var(--color-surface)' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                color:'var(--color-text)', fontSize:13 }}>{t.name}</p>
              <p style={{ color:'var(--color-text-light)', fontSize:10,
                marginTop:2 }}>{t.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ID Card preview */}
      <div style={{ marginTop:24 }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
          color:'var(--color-text)', marginBottom:12 }}>
          🪪 ID Card Preview
        </p>
        <IDCardPreview/>
      </div>
    </AppLayout>
  )
}

// ── Mini ID Card Preview — uses CSS vars so theme applies ─────────
function IDCardPreview() {
  return (
    <div style={{ maxWidth:360, borderRadius:22, overflow:'hidden',
      boxShadow:'0 12px 40px rgba(0,0,0,0.15)',
      border:'1.5px solid var(--id-card-border)' }}>
      <div style={{ background:'var(--id-card-bg)', padding:24 }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between',
          marginBottom:16 }}>
          <div>
            <p style={{ color:'var(--id-card-text)', fontSize:9,
              letterSpacing:'3px', opacity:0.6 }}>TRYIT EDUCATIONS</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color:'var(--id-card-text)', fontSize:20 }}>STUDENT ID</p>
          </div>
          <div style={{ width:44, height:44, borderRadius:12,
            background:'var(--id-card-border)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:24 }}>🎓</div>
        </div>
        {/* Avatar */}
        <div style={{ display:'flex', alignItems:'center', gap:14,
          marginBottom:16 }}>
          <div style={{ width:60, height:60, borderRadius:'50%',
            background:'var(--id-card-border)',
            border:'3px solid var(--id-card-id)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'Poppins,sans-serif', fontWeight:900,
            color:'var(--id-card-text)', fontSize:22 }}>AK</div>
          <div>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
              color:'var(--id-card-text)', fontSize:16 }}>Arjun Kumar</p>
            <p style={{ color:'var(--id-card-id)', fontSize:12,
              fontWeight:600 }}>⛏️ The Gold Miner · Level 4</p>
          </div>
        </div>
        {/* ID Number — the one that was invisible in dark mode */}
        <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:12,
          padding:'10px 14px',
          border:'1px solid var(--id-card-border)' }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:9,
            letterSpacing:'2px', marginBottom:2 }}>STUDENT ID NUMBER</p>
          <p style={{ fontFamily:'monospace', fontWeight:900,
            color:'var(--id-card-id)', fontSize:16, letterSpacing:'2px',
            textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>
            TRY-TN-00001-2026
          </p>
        </div>
      </div>
    </div>
  )
}
