import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Sticky Accessibility Bar — shows on ALL pages for users with UDID
 * or anyone who manually enables it.
 * Provides: font size, contrast, screen reader, voice commands, help
 */
export default function StickyAccessibilityBar() {
  const navigate  = useNavigate()
  const enabled   = localStorage.getItem('a11y_bar') === '1'
  const udidUser  = localStorage.getItem('equity_tier') === 'physically_challenged'
  const [show, setShow] = useState(enabled || udidUser)
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem('a11y_font') || '100')
  )
  const [highContrast, setHC] = useState(
    localStorage.getItem('a11y_contrast') === '1'
  )
  const [reading, setReading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (!show) {
    return (
      <button
        onClick={() => { setShow(true); localStorage.setItem('a11y_bar','1') }}
        title="Accessibility Options"
        style={{ position:'fixed', bottom:80, left:16, zIndex:800,
          width:44, height:44, borderRadius:'50%', background:'#1E3A5F',
          border:'2px solid #D4AF37', cursor:'pointer', fontSize:20,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
        ♿
      </button>
    )
  }

  const changeFontSize = (delta) => {
    const next = Math.min(150, Math.max(80, fontSize + delta))
    setFontSize(next)
    document.documentElement.style.fontSize = `${next}%`
    localStorage.setItem('a11y_font', String(next))
  }

  const toggleContrast = () => {
    const next = !highContrast
    setHC(next)
    localStorage.setItem('a11y_contrast', next?'1':'0')
    document.body.classList.toggle('high-contrast', next)
  }

  const readPage = () => {
    if (!window.speechSynthesis) return
    if (reading) { window.speechSynthesis.cancel(); setReading(false); return }
    const text = document.body.innerText.slice(0, 3000)
    const utt  = new SpeechSynthesisUtterance(text)
    utt.lang   = localStorage.getItem('selected_lang') === 'Tamil' ? 'ta-IN' : 'hi-IN'
    utt.rate   = 0.9
    utt.onend  = () => setReading(false)
    window.speechSynthesis.speak(utt)
    setReading(true)
  }

  return (
    <>
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:900,
        background:'#1E3A5F', borderTop:'2px solid #D4AF37',
        padding: expanded ? '12px 16px 16px' : '8px 16px',
        boxShadow:'0 -4px 20px rgba(0,0,0,0.2)' }}>

        {/* Main bar */}
        <div style={{ display:'flex', alignItems:'center', gap:8,
          flexWrap:'wrap', maxWidth:800, margin:'0 auto' }}>

          <span style={{ color:'#D4AF37', fontSize:16 }}>♿</span>
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:11,
            flexShrink:0 }}>Accessibility</span>

          {/* Font size */}
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <button onClick={() => changeFontSize(-10)}
              style={barBtn()}>A-</button>
            <span style={{ color:'#D4AF37', fontSize:11, minWidth:36,
              textAlign:'center' }}>{fontSize}%</span>
            <button onClick={() => changeFontSize(+10)}
              style={barBtn()}>A+</button>
          </div>

          {/* High contrast */}
          <button onClick={toggleContrast}
            style={{ ...barBtn(), background:highContrast?'#D4AF37':undefined,
              color:highContrast?'#1E3A5F':'rgba(255,255,255,0.7)' }}>
            ◑ Contrast
          </button>

          {/* Read aloud */}
          <button onClick={readPage}
            style={{ ...barBtn(), background:reading?'#EF4444':undefined }}>
            {reading ? '⏹ Stop' : '🔊 Read Page'}
          </button>

          {/* Keyboard nav */}
          <button onClick={() => navigate('/accessibility')}
            style={barBtn()}>
            ⌨️ Options
          </button>

          {/* Hide bar */}
          <button onClick={() => { setShow(false); localStorage.setItem('a11y_bar','0') }}
            style={{ ...barBtn(), marginLeft:'auto' }}>×</button>
        </div>
      </div>

      <style>{`
        body.high-contrast {
          filter: contrast(1.5) !important;
        }
        body.high-contrast * {
          border-color: #000 !important;
          outline: 1px solid #000 !important;
        }
      `}</style>
    </>
  )
}

function barBtn() {
  return {
    padding:'5px 10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.2)',
    background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.8)',
    cursor:'pointer', fontSize:12, fontFamily:'Poppins,sans-serif',
    fontWeight:600, flexShrink:0,
  }
}
