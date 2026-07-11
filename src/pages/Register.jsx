// FILE: src/pages/Register.jsx
// TEMPORARY STOPGAP — 2026-07-11
//
// The real registration flow below was found to be running on a fully
// mocked OTP step (fake setTimeout delays standing in for real
// verification — literally any 6 digits were accepted for ANY phone
// number, since nothing ever checked them against a real code). It
// also called the real phone-based login() function with a fake
// constructed email + role string in the phone/OTP slots, ignoring
// the result.
//
// This was never wired to the real realAuth/Fast2SMS/Edge Function
// system that Login.jsx correctly uses for returning users. Rather
// than ship a real fix under time pressure, registration is blocked
// here until Register.jsx is properly rewritten to use realAuth the
// same way Login.jsx does.
//
// The original (broken) component is preserved for reference during
// the rebuild — ask Claude for it, it is not deleted from history.

import { useTheme } from '../context/ThemeContext'
import Logo from '../components/Logo'

export default function Register() {
  const { theme } = useTheme()
  const p = theme?.primary || '#1E3A5F'
  const a = theme?.accent || '#C9A84C'
  const t = theme?.text || '#1E293B'
  const m = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const c = theme?.surface || '#FFFFFF'
  const b = theme?.border || '#E2E8F0'

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Poppins,sans-serif' }}>
      <div style={{ background: c, border: `1px solid ${b}`, borderRadius: 20, padding: 32, maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: 20 }}><Logo size={40} /></div>
        <p style={{ color: t, fontWeight: 800, fontSize: 18, margin: '0 0 10px' }}>
          New sign-ups are paused for a moment
        </p>
        <p style={{ color: m, fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>
          We're tightening up account verification and will be back shortly.
          Already have an account? You can still log in as normal.
        </p>
        <a href="/login" style={{
          display: 'inline-block',
          background: `linear-gradient(135deg,${p},${a})`,
          border: 'none', borderRadius: 12, padding: '14px 24px',
          color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
        }}>
          Go to Login →
        </a>
      </div>
    </div>
  )
}
