import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, onboardingKey } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Logo from '../components/Logo'

const IS_DEV =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

const ROLES = [
  { id: 'student',     label: 'Student',     emoji: '🎓', desc: 'Prepare for your exams' },
  { id: 'mentor',      label: 'Mentor',      emoji: '🧑‍🏫', desc: 'Guide and track learners' },
  { id: 'institution', label: 'Institution', emoji: '🏫', desc: 'Manage your coaching centre' },
  { id: 'family',      label: 'Family',      emoji: '👨‍👩‍👧', desc: 'Monitor your child\'s progress' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [step, setStep] = useState('role') // 'role' | 'email' | 'otp' | 'magic'
  const [selectedRole, setSelectedRole] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [couponOpen, setCouponOpen] = useState(false)
  const [coupon, setCoupon] = useState('')

  const otpRefs = useRef([])

  useEffect(() => {
    if (step === 'otp' && otpRefs.current[0]) {
      otpRefs.current[0].focus()
    }
  }, [step])

  function handleRoleSelect(roleId) {
    setSelectedRole(roleId)
    setStep('email')
  }

  function handleOtpChange(index, value) {
    const char = value.replace(/\D/, '')
    const next = [...otp]
    next[index] = char
    setOtp(next)
    if (char && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  async function handleSendOtp(e) {
    e.preventDefault()
    if (!email.trim()) { setError('Enter your email address.'); return }
    setError('')
    setLoading(true)

    if (IS_DEV) {
      setStep('otp')
      setLoading(false)
      return
    }

    // Production: trigger Supabase magic-link via login()
    try {
      await login(email.trim(), selectedRole)
      setStep('magic')
    } catch (err) {
      setError('Could not send login link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setError('Enter all 6 digits.'); return }
    setError('')
    setLoading(true)

    if (coupon.trim()) {
      localStorage.setItem('applied_coupon', coupon.trim().toUpperCase())
    }

    try {
      await login(email.trim(), selectedRole)
      const ROLE_HOME = {
        student: '/dashboard',
        mentor: '/mentor-hub',
        institution: '/centre/dashboard',
        family: '/family',
      }
      await new Promise(r => setTimeout(r, 200))
      const done = localStorage.getItem(onboardingKey(email.trim()))
      navigate(done ? (ROLE_HOME[selectedRole] || '/dashboard') : '/onboarding')
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (!selectedRole) { setError('Select a role first.'); return }
    setError('')
    setLoading(true)

    if (coupon.trim()) {
      localStorage.setItem('applied_coupon', coupon.trim().toUpperCase())
    }

    const mockEmail = 'google.user@gmail.com'
    try {
      await login(mockEmail, selectedRole)
      const ROLE_HOME = {
        student: '/dashboard',
        mentor: '/mentor-hub',
        institution: '/centre/dashboard',
        family: '/family',
      }
      await new Promise(r => setTimeout(r, 200))
      const done = localStorage.getItem(onboardingKey(mockEmail))
      navigate(done ? (ROLE_HOME[selectedRole] || '/dashboard') : '/onboarding')
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roleObj = ROLES.find(r => r.id === selectedRole)
  useTheme()
  const bgGradient = 'linear-gradient(135deg, var(--color-primary-dark, #0F2140) 0%, var(--color-primary, #1E3A5F) 55%, rgba(var(--color-surface-rgb, 255,255,255), 0.08) 100%)'
  const surfaceStyle = {
    background: 'var(--color-surface, #FFFFFF)',
    border: '1px solid var(--color-border, #E2E8F0)',
    boxShadow: '0 40px 90px rgba(var(--color-text-rgb, 15, 23, 45), 0.12)',
  }
  const fieldStyle = {
    borderColor: 'var(--color-border, #E2E8F0)',
    background: 'var(--color-surface, #FFFFFF)',
    color: 'var(--color-text, #1E3A5F)',
    fontFamily: 'Inter, sans-serif',
  }
  const accentColor = 'var(--color-accent, #D4AF37)'
  const accentGradient = 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))'
  const accentLight = 'var(--color-accent-light, #E8C84A)'
  const textColor = 'var(--color-text, #1E3A5F)'
  const textLight = 'var(--color-text-light, #94A3B8)'
  const subtleText = 'var(--subtext-color, #94A3B8)'
  const surfaceColor = 'var(--color-surface, #FFFFFF)'
  const borderColor = 'var(--color-border, #E2E8F0)'
  const buttonText = 'var(--button-text, var(--color-text, #1E3A5F))'
  const buttonBg = accentGradient
  const successBg = 'rgba(var(--color-success-rgb, 34, 197, 94), 0.12)'
  const successBorder = 'rgba(var(--color-success-rgb, 34, 197, 94), 0.22)'
  const errorColor = 'var(--color-error, #EF4444)'
  const dangerBg = 'rgba(var(--color-error-rgb, 239, 68, 68), 0.12)'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: bgGradient }}
    >
      {/* Subtle background texture rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full opacity-10"
          style={{
            width: 700, height: 700,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -60%)',
            border: '1.5px solid var(--color-accent, #D4AF37)',
          }}
        />
        <div
          className="absolute rounded-full opacity-5"
          style={{
            width: 420, height: 420,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -55%)',
            border: '1.5px solid var(--color-accent, #D4AF37)',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{ ...surfaceStyle }}
        >
          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-7">
            <Logo dark={false} height={48} />
            <p
              className="mt-3 text-xs font-medium tracking-widest uppercase"
              style={{ color: accentColor, fontFamily: 'Poppins, sans-serif' }}
            >
              Your Exam. Your Rank. Your Success.
            </p>
          </div>

          {/* ─── STEP: role ─────────────────────────────────────── */}
          {step === 'role' && (
            <div>
              <h2
                className="text-center text-xl font-bold mb-1"
                style={{ color: 'var(--heading-color, #1E3A5F)', fontFamily: 'Poppins, sans-serif' }}
              >
                Who are you?
              </h2>
              <p className="text-center text-sm mb-6" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
                Pick your role to get started
              </p>

              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="group flex flex-col items-center gap-1 rounded-xl p-4 border-2 text-left transition-all duration-150 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      borderColor: selectedRole === role.id ? 'var(--color-accent, #D4AF37)' : 'var(--color-border, #E2E8F0)',
                      background: selectedRole === role.id ? 'rgba(var(--color-accent-rgb, 212, 175, 55), 0.14)' : 'var(--color-surface, #FFFFFF)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent, #D4AF37)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border, #E2E8F0)'}
                  >
                    <span className="text-3xl">{role.emoji}</span>
                    <span className="font-semibold text-sm" style={{ color: 'var(--color-text, #1E3A5F)' }}>{role.label}</span>
                    <span className="text-xs text-center leading-tight" style={{ color: 'var(--subtext-color, #94A3B8)' }}>{role.desc}</span>
                  </button>
                ))}
              </div>

              {/* Google button (role required first) */}
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px" style={{ background: 'var(--color-border, #E2E8F0)' }} />
                  <span className="text-xs" style={{ color: 'var(--subtext-color, #94A3B8)', fontFamily: 'Inter, sans-serif' }}>or</span>
                  <div className="flex-1 h-px" style={{ background: 'var(--color-border, #E2E8F0)' }} />
                </div>
                <button
                  onClick={() => { if (!selectedRole) setError('Select a role first.'); else handleGoogle(); }}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 border-2 font-medium text-sm transition-all hover:shadow"
                  style={{
                    borderColor,
                    background: surfaceColor,
                    color: textColor,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="currentColor" style={{ color: accentColor }} aria-hidden="true">
                    <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.2-2.7-.5-4z" />
                    <path d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 16.3 3 9.6 7.9 6.3 14.7z" />
                    <path d="M24 45c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6C29.7 35.9 27 37 24 37c-6 0-10.6-3.9-11.8-9.1l-7 5.4C8.6 40.8 15.7 45 24 45z" />
                    <path d="M44.5 20H24v8.5h11.8c-1 3-3.2 5.4-6.1 7l6.6 5.6C40.3 37.9 44.5 31.6 44.5 24c0-1.4-.2-2.7-.5-4z" />
                  </svg>
                  Continue with Google
                </button>
              </div>

              {error && <p className="mt-3 text-center text-sm" style={{ color: errorColor }}>{error}</p>}
            </div>
          )}

          {/* ─── STEP: email ──────────────────────────────────────── */}
          {step === 'email' && (
            <div>
              <button
                onClick={() => { setStep('role'); setError('') }}
                className="flex items-center gap-1 text-sm mb-5 transition-opacity hover:opacity-70"
                style={{ color: textColor, fontFamily: 'Inter, sans-serif' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
                Back
              </button>

              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">{roleObj?.emoji}</span>
                <div>
                  <h2
                    className="text-lg font-bold leading-tight"
                    style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}
                  >
                    Sign in as {roleObj?.label}
                  </h2>
                  <p className="text-xs" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
                    We'll send a one-time code to your inbox
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                    style={{ color: textColor, fontFamily: 'Inter, sans-serif' }}
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all"
                    style={fieldStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-accent, #D4AF37)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border, #E2E8F0)'}
                  />
                </div>

                {error && <p className="text-sm" style={{ color: errorColor }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3 font-semibold text-sm transition-all hover:shadow-md disabled:opacity-60"
                  style={{
                    background: accentGradient,
                    color: buttonText,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {loading ? 'Sending…' : 'Send OTP →'}
                </button>
              </form>

              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px" style={{ background: borderColor }} />
                  <span className="text-xs" style={{ color: subtleText }}>or</span>
                  <div className="flex-1 h-px" style={{ background: borderColor }} />
                </div>
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 border-2 font-medium text-sm transition-all hover:shadow"
                  style={{ borderColor, background: surfaceColor, color: textColor, fontFamily: 'Inter, sans-serif' }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="currentColor" style={{ color: accentColor }} aria-hidden="true">
                    <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.2-2.7-.5-4z" />
                    <path d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 16.3 3 9.6 7.9 6.3 14.7z" />
                    <path d="M24 45c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6C29.7 35.9 27 37 24 37c-6 0-10.6-3.9-11.8-9.1l-7 5.4C8.6 40.8 15.7 45 24 45z" />
                    <path d="M44.5 20H24v8.5h11.8c-1 3-3.2 5.4-6.1 7l6.6 5.6C40.3 37.9 44.5 31.6 44.5 24c0-1.4-.2-2.7-.5-4z" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP: otp (dev) ──────────────────────────────────── */}
          {step === 'otp' && (
            <div>
              <button
                onClick={() => { setStep('email'); setError(''); setOtp(['','','','','','']) }}
                className="flex items-center gap-1 text-sm mb-5 transition-opacity hover:opacity-70"
                style={{ color: textColor, fontFamily: 'Inter, sans-serif' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
                Back
              </button>

              <h2
                className="text-lg font-bold mb-1"
                style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}
              >
                Enter your code
              </h2>
              <p className="text-sm mb-6" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
                A 6-digit code was sent to <span className="font-semibold" style={{ color: textColor }}>{email}</span>
                {IS_DEV && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: accentLight, color: primaryColor }}>
                    dev — any 6 digits work
                  </span>
                )}
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* OTP inputs */}
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-11 h-12 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
                      style={{
                        borderColor: digit ? 'var(--color-accent, #D4AF37)' : 'var(--color-border, #E2E8F0)',
                        background: digit ? accentLight : surfaceColor,
                        color: 'var(--color-text, #1E3A5F)',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-accent, #D4AF37)'}
                      onBlur={e => e.target.style.borderColor = otp[i] ? 'var(--color-accent, #D4AF37)' : 'var(--color-border, #E2E8F0)'}
                    />
                  ))}
                </div>

                {/* Coupon (collapsible) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setCouponOpen(v => !v)}
                    className="text-xs transition-opacity hover:opacity-70 flex items-center gap-1"
                    style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    {couponOpen ? 'Hide coupon' : 'Have a coupon code?'}
                  </button>
                  {couponOpen && (
                    <input
                      type="text"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      placeholder="Enter coupon"
                      className="mt-2 w-full rounded-xl border-2 px-3 py-2 text-xs outline-none transition-all"
                      style={{
                        borderColor,
                        background: surfaceColor,
                        color: textColor,
                        fontFamily: 'Inter, sans-serif',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-accent, #D4AF37)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border, #E2E8F0)'}
                    />
                  )}
                </div>

                {error && <p className="text-sm" style={{ color: errorColor }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
                  className="w-full rounded-xl py-3 font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50"
                  style={{
                    background: accentGradient,
                    color: buttonText,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {loading ? 'Verifying…' : 'Verify & Enter →'}
                </button>
              </form>
            </div>
          )}

          {/* ─── STEP: magic link (prod) ─────────────────────────── */}
          {step === 'magic' && (
            <div className="text-center py-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: accentLight }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent, #D4AF37)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2
                className="text-lg font-bold mb-2"
                style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}
              >
                Check your inbox
              </h2>
              <p className="text-sm mb-4" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
                We sent a login link to <span className="font-semibold" style={{ color: textColor }}>{email}</span>. Click it to sign in.
              </p>
              <button
                onClick={() => { setStep('email'); setError('') }}
                className="text-sm transition-opacity hover:opacity-70"
                style={{ color: accentColor, fontFamily: 'Inter, sans-serif' }}
              >
                Use a different email
              </button>
            </div>
          )}

          {/* Footer note */}
          {step !== 'magic' && (
            <p
              className="mt-6 text-center text-xs"
              style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}
            >
              By continuing, you agree to our{' '}
                <a href="/terms" className="underline hover:opacity-80" style={{ color: textLight }}>Terms</a>
              {' '}and{' '}
                <a href="/privacy" className="underline hover:opacity-80" style={{ color: textLight }}>Privacy Policy</a>.
            </p>
          )}
        </div>

        {/* Tagline below card */}
        <p
          className="text-center mt-4 text-xs opacity-70"
          style={{ color: 'rgba(var(--color-text-rgb, 255,255,255), 0.88)', fontFamily: 'Inter, sans-serif' }}
          >
          TryIT Educations © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
