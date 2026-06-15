import { useState, useEffect } from 'react'

export default function PushManager({ compact = false }) {
  const [perm, setPerm]   = useState(Notification.permission)
  const [token, setToken] = useState(localStorage.getItem('fcm_token_mock') || '')
  const [sent, setSent]   = useState(false)

  useEffect(() => {
    const handleChange = () => setPerm(Notification.permission)
    // Notification.permission doesn't fire events, we poll on mount
    setPerm(Notification.permission)
  }, [])

  const requestPerm = async () => {
    const result = await Notification.requestPermission()
    setPerm(result)
    if (result === 'granted') {
      // In production: call Firebase getToken() here
      const mockToken = `mock-fcm-${Date.now()}`
      setToken(mockToken)
      localStorage.setItem('fcm_token_mock', mockToken)
    }
  }

  const testPush = () => {
    if (Notification.permission === 'granted') {
      new Notification('TryIT Educations 🎓', {
        body: '📚 Your SSC CGL exam is 30 days away. Study 2 hours today!',
        icon: '/tryit-logo.webp',
      })
      setSent(true)
      setTimeout(() => setSent(false), 2500)
    }
  }

  if (compact) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{
          width:8, height:8, borderRadius:'50%',
          background: perm==='granted'?'var(--color-success, #22C55E)':perm==='denied'?'var(--color-error, #EF4444)':'#F59E0B',
        }} />
        <span style={{ fontSize:11, color:'var(--color-muted, #64748B)', fontFamily:'Inter,sans-serif' }}>
          Push: {perm}
        </span>
        {perm !== 'granted' && (
          <button onClick={requestPerm} style={{ background:'none', border:'1px solid var(--color-accent, #D4AF37)',
            borderRadius:6, padding:'3px 8px', fontSize:11, color:'var(--color-accent, #D4AF37)', cursor:'pointer' }}>
            Enable
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:20,
      boxShadow:'0 2px 12px rgba(0,0,0,0.05)', maxWidth:400 }}>
      <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'var(--color-primary, #1E3A5F)', marginBottom:16 }}>
        🔔 Push Notifications
      </h3>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ width:12, height:12, borderRadius:'50%',
          background: perm==='granted'?'var(--color-success, #22C55E)':perm==='denied'?'var(--color-error, #EF4444)':'#F59E0B' }} />
        <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, color:'var(--color-primary, #1E3A5F)',
          textTransform:'capitalize' }}>
          Status: {perm}
        </span>
      </div>

      {perm !== 'granted' ? (
        <button onClick={requestPerm} style={{
          width:'100%', padding:'12px', borderRadius:12, border:'none',
          background:'linear-gradient(135deg,var(--color-accent, #D4AF37),var(--color-accent-light, #E8C84A))',
          fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
          color:'var(--color-primary, #1E3A5F)', cursor:'pointer', marginBottom:12,
        }}>
          🔔 Enable Notifications
        </button>
      ) : (
        <>
          <div style={{ background:'#F0FDF4', borderRadius:12, padding:'10px 14px', marginBottom:12 }}>
            <p style={{ color:'#15803D', fontSize:12, fontFamily:'monospace' }}>
              Token: {token.slice(0, 24)}...
            </p>
          </div>
          <button onClick={testPush} style={{
            width:'100%', padding:'11px', borderRadius:12, border:'none',
            background:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
            color: sent ? 'var(--color-accent, #D4AF37)' : '#fff', cursor:'pointer',
          }}>
            {sent ? '✅ Notification Sent!' : '🧪 Send Test Notification'}
          </button>
        </>
      )}
      <p style={{ color:'#94A3B8', fontSize:11, marginTop:12 }}>
        Exam alerts are sent only for YOUR enrolled exams.
      </p>
    </div>
  )
}
