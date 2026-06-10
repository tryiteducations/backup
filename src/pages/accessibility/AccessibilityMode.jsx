import { useNavigate } from 'react-router-dom'
import { useA11y, A11Y_MODES } from '../../context/AccessibilityContext'
import { motion } from 'framer-motion'

const MODES = [
  {
    id:    A11Y_MODES.AUDIO_COMPANION,
    emoji: '🎧',
    title: 'Audio Companion Mode',
    for:   'For Blind & Visually Impaired Students',
    color: '#7C3AED',
    bg:    'linear-gradient(135deg,#4C1D95,#5B21B6)',
    features: [
      'Screen reader optimised layout (TalkBack / VoiceOver ready)',
      'High-contrast theme — maximum readability',
      'Large scalable typography — up to 28px',
      'Tap anywhere to hear current content read aloud',
      'Swipe gestures to navigate between topics',
      'Voice commands for answering test questions',
      'All images have detailed audio descriptions',
    ],
    udidEligible: true,
  },
  {
    id:    A11Y_MODES.VISUAL_SYNC,
    emoji: '👁️‍🗨️',
    title: 'Visual Sync Mode',
    for:   'For Deaf & Hard of Hearing Students',
    color: '#0369A1',
    bg:    'linear-gradient(135deg,#0C4A6E,#075985)',
    features: [
      'All audio content shows synchronized text captions',
      'Floating ISL (Indian Sign Language) interpreter panel',
      'Key terms pop up as visual flashcard overlays',
      'No audio-only content — everything has visual fallback',
      'Vibration feedback instead of notification sounds',
      '3D concept animations for complex topics',
      'Visual emoji alerts replace audio cues',
    ],
    udidEligible: true,
  },
  {
    id:    A11Y_MODES.MINIMAL_MOTION,
    emoji: '🤲',
    title: 'Minimal Motion Mode',
    for:   'For Motor / Physically Challenged Students',
    color: '#065F46',
    bg:    'linear-gradient(135deg,#022C22,#064E3B)',
    features: [
      'All tap targets enlarged to minimum 56×56px',
      'No drag-and-drop — everything keyboard or voice operable',
      'Voice commands: "next", "back", "submit", "home"',
      'Adaptive switch controller support',
      'No time-pressure tests — unlimited time option',
      'Zero rapid-motion animations that may cause issues',
      'One-handed navigation mode',
    ],
    udidEligible: true,
  },
]

export default function AccessibilityMode() {
  const navigate = useNavigate()
  const { mode, setMode, fontSize, setFontSize, highContrast, setHighContrast } = useA11y()

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#071428,#0F2140)',
      padding:'24px 20px 60px',
    }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <button onClick={()=>navigate(-1)}
            style={{ background:'rgba(255,255,255,0.08)',
              border:'1px solid rgba(255,255,255,0.15)',
              borderRadius:12, padding:'8px 16px',
              color:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:14,
              fontFamily:'Poppins,sans-serif' }}>
            ← Back
          </button>
          <div>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color:'#fff', fontSize:'clamp(22px,4vw,32px)', margin:0 }}>
              ♿ Accessibility Settings
            </h1>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginTop:4 }}>
              TryIT is built for every student — no separate app needed
            </p>
          </div>
        </div>

        {/* Text size + contrast */}
        <div style={{ background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:20, padding:20, marginBottom:24 }}>
          <p style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif',
            fontWeight:700, fontSize:14, marginBottom:16 }}>
            Quick Settings
          </p>
          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20 }}>
            <div>
              <label style={{ color:'rgba(255,255,255,0.7)', fontSize:13,
                fontWeight:600, display:'block', marginBottom:8 }}>
                Text Size: <span style={{ color:'#D4AF37' }}>{fontSize}px</span>
              </label>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:12 }}>A</span>
                <input type="range" min={14} max={28} value={fontSize}
                  onChange={e=>setFontSize(+e.target.value)}
                  style={{ flex:1, accentColor:'#D4AF37' }}
                  aria-label="Text size"/>
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:20 }}>A</span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ color:'rgba(255,255,255,0.7)', fontWeight:600,
                  fontSize:13, marginBottom:4 }}>High Contrast</p>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>
                  Maximum visibility
                </p>
              </div>
              <button role="switch" aria-checked={highContrast}
                onClick={()=>setHighContrast(!highContrast)}
                style={{ width:52, height:28, borderRadius:14, border:'none',
                  background: highContrast ? '#D4AF37' : 'rgba(255,255,255,0.15)',
                  cursor:'pointer', position:'relative', transition:'all 0.2s' }}>
                <div style={{
                  width:22, height:22, borderRadius:'50%', background:'#fff',
                  position:'absolute', top:3,
                  left: highContrast ? 27 : 3,
                  transition:'left 0.2s',
                  boxShadow:'0 2px 4px rgba(0,0,0,0.3)',
                }}/>
              </button>
            </div>
          </div>
        </div>

        {/* Mode cards */}
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, letterSpacing:'2px',
          fontWeight:700, marginBottom:14, fontFamily:'Poppins,sans-serif' }}>
          SELECT YOUR INTERFACE MODE
        </p>

        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))',
          gap:16, marginBottom:24 }}>
          {/* Standard mode */}
          <motion.div whileTap={{ scale:0.98 }}
            onClick={()=>{ setMode(A11Y_MODES.STANDARD); navigate('/dashboard') }}
            style={{
              background: mode===A11Y_MODES.STANDARD
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(255,255,255,0.04)',
              border:`2px solid ${mode===A11Y_MODES.STANDARD
                ? '#D4AF37' : 'rgba(255,255,255,0.08)'}`,
              borderRadius:20, padding:20, cursor:'pointer',
            }}>
            <span style={{ fontSize:32 }}>👁️</span>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
              color:'#fff', fontSize:15, marginTop:10 }}>Standard Mode</p>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:4 }}>
              Default full-featured experience
            </p>
            {mode===A11Y_MODES.STANDARD && (
              <span style={{ background:'#D4AF37', color:'#1E3A5F',
                fontSize:10, fontWeight:800, padding:'3px 10px',
                borderRadius:20, display:'inline-block', marginTop:8 }}>ACTIVE</span>
            )}
          </motion.div>

          {MODES.map(m=>(
            <motion.div key={m.id} whileTap={{ scale:0.98 }}
              onClick={()=>setMode(m.id)}
              style={{
                background: mode===m.id ? m.bg : 'rgba(255,255,255,0.04)',
                border:`2px solid ${mode===m.id ? m.color : 'rgba(255,255,255,0.08)'}`,
                borderRadius:20, padding:20, cursor:'pointer',
                transition:'all 0.2s',
              }}>
              <span style={{ fontSize:36 }}>{m.emoji}</span>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                color:'#fff', fontSize:15, marginTop:10, marginBottom:4 }}>
                {m.title}
              </p>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:11,
                marginBottom:12 }}>{m.for}</p>
              <ul style={{ margin:0, padding:0, listStyle:'none' }}>
                {m.features.slice(0,4).map((f,i)=>(
                  <li key={i} style={{ color:'rgba(255,255,255,0.65)',
                    fontSize:12, marginBottom:5, display:'flex', gap:6 }}>
                    <span style={{ color:m.color, flexShrink:0 }}>✓</span> {f}
                  </li>
                ))}
                {m.features.length > 4 && (
                  <li style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>
                    +{m.features.length-4} more features...
                  </li>
                )}
              </ul>
              {m.udidEligible && (
                <div style={{ marginTop:12, background:'rgba(255,255,255,0.08)',
                  borderRadius:10, padding:'6px 12px' }}>
                  <p style={{ color:'#D4AF37', fontSize:11, fontWeight:600 }}>
                    ♿ UDID verified users → 100% FREE access
                  </p>
                </div>
              )}
              {mode===m.id ? (
                <div style={{ marginTop:12, background:m.color,
                  borderRadius:10, padding:'8px 14px', textAlign:'center' }}>
                  <p style={{ color:'#fff', fontWeight:700, fontSize:13 }}>
                    ✓ Active — Interface adapted
                  </p>
                </div>
              ) : (
                <button style={{ marginTop:12, width:'100%',
                  background:'rgba(255,255,255,0.1)',
                  border:`1px solid ${m.color}66`, borderRadius:10,
                  padding:'8px 14px', color:m.color, fontWeight:600,
                  fontSize:13, cursor:'pointer', fontFamily:'Poppins,sans-serif' }}>
                  Activate →
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <div style={{ background:'rgba(212,175,55,0.08)',
          border:'1px solid rgba(212,175,55,0.2)',
          borderRadius:16, padding:'16px 20px' }}>
          <p style={{ color:'#D4AF37', fontWeight:700, fontSize:14, marginBottom:6 }}>
            🌐 Works on Website + Android + iOS
          </p>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, lineHeight:1.7 }}>
            All three accessibility modes are fully functional on the TryIT website
            right now. Android and iOS app versions coming soon with IMEI-level
            hardware accessibility binding. Physically Challenged users are
            verified via UDID Card and receive 100% free access for life.
          </p>
        </div>

        <button onClick={()=>navigate('/login')}
          style={{ width:'100%', marginTop:20, padding:16, borderRadius:16,
            border:'none', background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
            color:'#1E3A5F', cursor:'pointer' }}>
          Continue to TryIT →
        </button>
      </div>
    </div>
  )
}
