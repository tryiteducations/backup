// FILE: src/pages/admin/AdminLogin.jsx
// TryIT - Admin Login Panel
// Route: /admin/login (Restricted - authorized personnel only)
//
// FIXED: previously called the student phone/OTP login() function with
// an email in the phone slot and the literal string 'admin' as the OTP
// code — that always failed silently (login() never throws, it returns
// {error}), but the code navigated to /admin/dashboard regardless of
// the result. It also had a "Dev Backup" fallback with a hardcoded
// email/password printed directly in the UI. Both are gone now — this
// calls a real server-side admin-login Edge Function, and the actual
// credentials live only in Supabase secrets, never in shipped code.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { setAdminSession } from '../../lib/adminAuth'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('admin-login', {
        body: { email: email.trim(), password },
      })

      if (fnError || data?.error) {
        setError(data?.error || 'Invalid admin credentials supplied.')
        setLoading(false)
        return
      }

      setAdminSession(data.jwt)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Admin login failed - please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #071428 0%, var(--color-primary-dark, #0F2140) 100%)',
        padding: 20,
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div
        style={{
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 24,
          padding: 36,
          width: '100%',
          maxWidth: 380,
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--color-border, #E2E8F0)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 28, letterSpacing: '0.5px' }}>
            <span style={{ color: 'var(--color-primary, #1E3A5F)' }}>TRY</span>
            <span style={{ color: 'var(--color-accent, #D4AF37)' }}>IT</span>
          </div>
          <p style={{ color: 'var(--color-error, #DC2626)', fontWeight: 700, fontSize: 13, marginTop: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>
            🔐 Admin Access Only
          </p>
          <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Restricted - authorized personnel only</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, color: 'var(--color-primary, #1E3A5F)', fontSize: 12, marginBottom: 6, textTransform: 'uppercase' }}>
            Admin Email Address
          </label>
          <input
            type="email"
            placeholder="admin@tryiteducations.net"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12, boxSizing: 'border-box', outline: 'none',
              border: '1.5px solid var(--color-border, #E2E8F0)', fontSize: 14, color: 'var(--color-text, #1E3A5F)',
              background: '#fff', transition: 'all 0.15s ease'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-accent, #D4AF37)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border, #E2E8F0)'}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, color: 'var(--color-primary, #1E3A5F)', fontSize: 12, marginBottom: 6, textTransform: 'uppercase' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12, boxSizing: 'border-box', outline: 'none',
              border: '1.5px solid var(--color-border, #E2E8F0)', fontSize: 14, color: 'var(--color-text, #1E3A5F)',
              background: '#fff', transition: 'all 0.15s ease'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-accent, #D4AF37)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border, #E2E8F0)'}
          />
        </div>

        {error && <p style={{ color: 'var(--color-error, #EF4444)', fontSize: 13, marginBottom: 14, fontWeight: 500 }}>⚠️ {error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15,
            color: '#ffffff', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.2)', transition: 'all 0.15s ease'
          }}
        >
          {loading ? 'Verifying Credentials...' : 'Sign In To Dashboard →'}
        </button>
      </div>
    </div>
  )
}
