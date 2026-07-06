// src/pages/settings/ChangePassword.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'

export default function ChangePassword() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const isDark = theme?.isDark || false
  const p = theme?.primary || '#1E3A5F'
  const a = theme?.accent || '#C9A84C'
  const t = theme?.text || '#1E293B'
  const m = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const c = theme?.surface || '#FFFFFF'
  const b = theme?.border || '#E2E8F0'

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 12,
    border: `1.5px solid ${b}`, background: isDark ? 'rgba(255,255,255,0.05)' : c,
    color: t, fontSize: 14, outline: 'none', fontFamily: 'Poppins,sans-serif',
    boxSizing: 'border-box', marginBottom: 14,
  }

  async function handleSubmit() {
    setError('')
    if (!currentPw || !newPw || !confirmPw) { setError('Please fill in all fields'); return }
    if (newPw.length < 8) { setError('New password must be at least 8 characters'); return }
    if (newPw !== confirmPw) { setError("New passwords don't match"); return }

    setSaving(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPw })
      if (updateError) throw updateError
      setSuccess(true)
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError(e.message || 'Could not update password - please try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Poppins,sans-serif' }}>
      <div style={{ background: c, borderBottom: `1px solid ${b}`, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10,
        boxShadow: `0 4px 24px ${a}18` }}>
        <button onClick={() => nav(-1)} style={{ background: 'transparent', border: `1px solid ${a}55`,
          borderRadius: 10, padding: '6px 14px', color: m, fontSize: 13, cursor: 'pointer' }}>← Back</button>
        <h1 style={{ color: t, fontSize: 18, fontWeight: 800, margin: 0, textShadow: `0 0 20px ${a}50` }}>🔒 Change Password</h1>
      </div>

      <div style={{ padding: '20px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ background: c, border: `1px solid ${b}`, borderRadius: 16, padding: 22,
          boxShadow: `0 0 30px ${a}12` }}>

          <label style={{ display: 'block', color: m, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Current Password</label>
          <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
            placeholder="Enter your current password" style={inputStyle} />

          <label style={{ display: 'block', color: m, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>New Password</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
            placeholder="At least 8 characters" style={inputStyle} />

          <label style={{ display: 'block', color: m, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Confirm New Password</label>
          <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
            placeholder="Re-enter new password" style={{ ...inputStyle, marginBottom: 18 }} />

          {error && (
            <p style={{ color: '#EF4444', fontSize: 12, fontWeight: 600, marginBottom: 14 }}>{error}</p>
          )}
          {success && (
            <p style={{ color: '#16A34A', fontSize: 12, fontWeight: 600, marginBottom: 14 }}>✅ Password updated successfully</p>
          )}

          <button onClick={handleSubmit} disabled={saving} style={{
            width: '100%', background: `linear-gradient(135deg,${p},${a})`, border: 'none',
            borderRadius: 12, padding: '13px', color: '#fff', fontWeight: 700, fontSize: 14,
            cursor: saving ? 'default' : 'pointer', boxShadow: `0 4px 20px ${a}35`, opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  )
}
