// Visual Sync Mode
// For Deaf / Hard of Hearing users
// Shows ISL interpreter panel, captions, visual key-term flashcards
import { useState, useEffect } from 'react'
import { useA11y } from '../../context/AccessibilityContext'

const ISL_KEYWORDS = {
  'examination': 'https://placehold.co/160x120/1E3A5F/D4AF37?text=ISL:Exam',
  'question':    'https://placehold.co/160x120/1E3A5F/D4AF37?text=ISL:Q',
  'answer':      'https://placehold.co/160x120/1E3A5F/D4AF37?text=ISL:Ans',
  'study':       'https://placehold.co/160x120/1E3A5F/D4AF37?text=ISL:Study',
}

export default function VisualSyncWrapper({ children, captionText = '' }) {
  const { isVisual } = useA11y()
  const [captionVisible, setCaptionVisible] = useState(true)
  const [flashcard, setFlashcard]           = useState(null)

  useEffect(() => {
    if (!isVisual || !captionText) return
    // Detect key terms in captions and show ISL flashcard
    const found = Object.keys(ISL_KEYWORDS).find(k =>
      captionText.toLowerCase().includes(k)
    )
    if (found) {
      setFlashcard({ term: found, url: ISL_KEYWORDS[found] })
      setTimeout(() => setFlashcard(null), 4000)
    }
  }, [captionText, isVisual])

  if (!isVisual) return children

  return (
    <div style={{ position:'relative', minHeight:'100vh' }}>
      {children}

      {/* ISL interpreter floating panel */}
      <div
        aria-label="Indian Sign Language interpreter"
        role="complementary"
        style={{
          position:'fixed', bottom:90, right:16,
          width:180, background:'var(--color-primary-dark, #0F2140)',
          border:'2px solid var(--color-accent, #D4AF37)', borderRadius:20,
          overflow:'hidden', zIndex:5000,
          boxShadow:'0 8px 30px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ background:'var(--color-accent, #D4AF37)', padding:'6px 12px',
          fontFamily:'Poppins,sans-serif', fontWeight:700,
          fontSize:10, color:'var(--color-primary, #1E3A5F)', letterSpacing:'1px' }}>
          🤟 ISL INTERPRETER
        </div>
        <div style={{ padding:12, textAlign:'center' }}>
          <div style={{ width:'100%', height:100, background:'rgba(255,255,255,0.05)',
            borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
            color:'rgba(255,255,255,0.4)', fontSize:11 }}>
            {captionText
              ? <span style={{ color:'var(--color-accent, #D4AF37)', fontSize:13 }}>🤟 Signing...</span>
              : <span>Waiting for audio...</span>
            }
          </div>
        </div>
        <div style={{ padding:'6px 12px 10px', display:'flex', justifyContent:'center' }}>
          <span style={{ background:'rgba(255,255,255,0.1)', color:'#fff',
            fontSize:9, padding:'2px 8px', borderRadius:20 }}>
            Tap to fullscreen
          </span>
        </div>
      </div>

      {/* Live caption bar */}
      {captionVisible && (
        <div
          role="status" aria-live="polite"
          style={{
            position:'fixed', bottom:0, left:0, right:0,
            background:'rgba(0,0,0,0.92)',
            color:'var(--color-surface, #FFFFFF)', fontSize:16, fontWeight:600,
            padding:'14px 24px', lineHeight:1.5,
            borderTop:'2px solid var(--color-accent, #D4AF37)',
            minHeight:60, zIndex:4999,
          }}
        >
          {captionText || 'Captions will appear here when audio plays...'}
        </div>
      )}

      {/* ISL flashcard popup */}
      {flashcard && (
        <div
          role="alert"
          aria-label={`Sign language for: ${flashcard.term}`}
          style={{
            position:'fixed', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            background:'#fff', borderRadius:20,
            padding:20, textAlign:'center',
            boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
            zIndex:6000, border:'3px solid var(--color-accent, #D4AF37)',
          }}
        >
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            color:'var(--color-primary, #1E3A5F)', fontSize:14, marginBottom:8 }}>
            Key Term: <span style={{ color:'var(--color-accent, #D4AF37)' }}>{flashcard.term}</span>
          </p>
          <div style={{ width:160, height:120, background:'var(--color-primary, #1E3A5F)', borderRadius:12,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--color-accent, #D4AF37)', fontSize:40 }}>
            🤟
          </div>
          <p style={{ color:'#94A3B8', fontSize:11, marginTop:8 }}>ISL Sign for "{flashcard.term}"</p>
        </div>
      )}
    </div>
  )
}
