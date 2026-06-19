// FILE: src/pages/admin/AdminLogin.jsx
// TryIT — Admin Login Panel (Context-Driven with Sandbox Fallback)
// Route: /admin/login (Restricted — authorized personnel only)

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
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
      if (login) {
        // 1. Production Context Authentication Path
        await login(email.trim(), 'admin')
        navigate('/admin/dashboard')
      } else {
        // 2. Local Offline Sandbox Failover Fallback
        if (email === 'admin@tryit.com' && password === 'admin123') {
          localStorage.setItem('tryit_admin', 'true')
          navigate('/admin/dashboard')
        } else {
          throw new Error('Invalid credentials')
        }
      }
    } catch (err) {
      setError('Invalid admin credentials supplied.')
    } finally {
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
        {/* Panel Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 28, letterSpacing: '0.5px' }}>
            <span style={{ color: 'var(--color-primary, #1E3A5F)' }}>TRY</span>
            <span style={{ color: 'var(--color-accent, #D4AF37)' }}>IT</span>
          </div>
          <p style={{ color: 'var(--color-error, #DC2626)', mountaineer: 'true', fontWeight: 700, fontSize: 13, marginTop: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>
            🔐 Admin Access Only
          </p>
          <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Restricted — authorized personnel only</p>
        </div>

        {/* Input Form Scope */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, color: 'var(--color-primary, #1E3A5F)', fontSize: 12, marginBottom: 6, textTransform: 'uppercase' }}>
            Admin Email Address
          </label>
          <input 
            type="email" 
            placeholder="admin@tryit.com"
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
            Security Token Password
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

        {/* Dynamic Log Exception Error Trace */}
        {error && <p style={{ color: 'var(--color-error, #EF4444)', fontSize: 13, marginBottom: 14, fontWeight: 500 }}>⚠️ {error}</p>}

        {/* Action Button Gate */}
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

        {/* Sandbox Dev Note */}
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted, #94A3B8)', fontSize: 11, marginTop: 16, lineHeight: 1.5 }}>
          🔧 Dev Backup: <code style={{ background: '#F1F5F9', padding: '2px 4px', borderRadius: 4, color: '#475569' }}>admin@tryit.com</code> / <code style={{ background: '#F1F5F9', padding: '2px 4px', borderRadius: 4, color: '#475569' }}>admin123</code>
        </p>
      </div>
    </div>
  )
}