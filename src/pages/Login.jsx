// FILE: src/pages/Login.jsx
// TryIT — Multi-Role & Phone-First Secure Verification (Truecaller / OTP)
// Route: /login (One registration per verified phone number — Anti-Cheat Foundation)

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, onboardingKey } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Logo from '../components/Logo'

const ROLES = [
  { id: 'student',     label: 'Student',     emoji: '🎓', desc: 'Prepare for your exams' },
  { id: 'mentor',      label: 'Mentor',      emoji: '🧑‍🏫', desc: 'Guide and track learners' },
  { id: 'institution', label: 'Institution', emoji: '🏫', desc: 'Manage your coaching centre' },
  { id: 'family',      label: 'Family',      emoji: '👨‍👩‍👧', desc: "Monitor your child's progress" },
]

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user } = useAuth()
  useTheme()

  // Steps flow: role -> phone -> otp -> name
  const [step, setStep] = useState('role') 
  const [selectedRole, setSelectedRole] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  const otpRefs = useRef([])
  const redirectTo = location.state?.from || '/role-select'

  // Redirect if user session already exists
  useEffect(() => {
    if (user) {
      const done = localStorage.getItem(onboardingKey(user.email || ''))
      const ROLE_HOME = {
        student: '/student',
        mentor: '/mentor-hub',
        institution: '/centre/dashboard',
        family: '/family',
      }
      navigate(done ? (ROLE_HOME[user.role] || '/student') : '/onboarding')
    }
  }, [user, navigate])

  // OTP Countdown Timer
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // Focus management when entering OTP step
  useEffect(() => {
    if (step === 'otp' && otpRefs.current[0]) {
      otpRefs.current[0].focus()
    }
  }, [step])

  function handleRoleSelect(roleId) {
    setSelectedRole(roleId)
    setStep('phone')
    setError('')
  }

  const sendOtp = async (e) => {
    if (e) e.preventDefault()
    if (phone.replace(/\D/g, '').length !== 10) { 
      setError('Enter a valid 10-digit number')
      return 
    }
    setError('')
    setLoading(true)

    try {
      // TODO: Call Truecaller SDK / missed-call verification edge function gateway
      await new Promise(r => setTimeout(r, 800))
      setStep('otp')
      setResendTimer(30)
    } catch (err) {
      setError('Failed to send verification code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    if (e) e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) { 
      setError('Enter all 6 digits')
      return 
    }
    setError('')
    setLoading(true)

    try {
      // TODO: Verify verification token string against backend instances
      await new Promise(r => setTimeout(r, 600))
      setStep('name')
    } catch (err) {
      setError('Invalid OTP code details entered.')
    } finally {
      setLoading(false)
    }
  }

  const finishSignup = async (e) => {
    if (e) e.preventDefault()
    if (!name.trim()) { 
      setError('Please enter your name')
      return 
    }
    setError('')
    setLoading(true)

    const generatedEmail = `${phone}@phone.tryiteducations.net`
    try {
      await login(generatedEmail, selectedRole)
      setStep('otp')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    const char = value.replace(/\D/g, '')
    if (!char && value !== '') return
    const next = [...otp]
    next[index] = char
    setOtp(next)
    if (char && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  // System CSS Theme Primitives Resolver
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
  const buttonText = 'var(--button-text, var(--color-text, #1E3A5F))'
  const errorColor = 'var(--color-error, #EF4444)'

  const roleObj = ROLES.find(r => r.id === selectedRole)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden" style={{ background: bgGradient }}>
      {/* Decorative background visual rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full opacity-10" style={{ width: 700, height: 700, top: '50%', left: '50%', transform: 'translate(-50%, -60%)', border: `1.5px solid ${accentColor}` }} />
        <div className="absolute rounded-full opacity-5" style={{ width: 420, height: 420, top: '50%', left: '50%', transform: 'translate(-50%, -55%)', border: `1.5px solid ${accentColor}` }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-2xl transition-all duration-300" style={surfaceStyle}>
          
          {/* Brand Header Section */}
          <div className="flex flex-col items-center mb-7">
            <Logo dark={false} height={48} />
            <p className="mt-3 text-xs font-medium tracking-widest uppercase" style={{ color: accentColor, fontFamily: 'Poppins, sans-serif' }}>
              Your Exam. Your Rank. Your Success.
            </p>
          </div>

          {/* ─── STEP 1: ROLE SELECTION ─── */}
          {step === 'role' && (
            <div>
              <h2 className="text-center text-xl font-bold mb-1" style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}>
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
                      borderColor: selectedRole === role.id ? accentColor : 'var(--color-border, #E2E8F0)',
                      background: selectedRole === role.id ? 'rgba(var(--color-accent-rgb, 212, 175, 55), 0.14)' : 'var(--color-surface, #FFFFFF)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <span className="text-3xl mb-1">{role.emoji}</span>
                    <span className="font-semibold text-sm" style={{ color: textColor }}>{role.label}</span>
                    <span className="text-xs text-center leading-tight" style={{ color: subtleText }}>{role.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 2: PHONE PHONE-NUMBER ENTRY ─── */}
          {step === 'phone' && (
            <div>
              <button onClick={() => { setStep('role'); setError('') }} className="flex items-center gap-1 text-sm mb-5 transition-opacity hover:opacity-70" style={{ color: textColor, fontFamily: 'Inter, sans-serif' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
                Back
              </button>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{roleObj?.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold leading-tight" style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}>
                    Sign in as {roleObj?.label}
                  </h2>
                  <p className="text-xs" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
                    Enter your mobile number to establish security validation
                  </p>
                </div>
              </div>

              <form onSubmit={sendOtp} className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: textColor, fontFamily: 'Inter, sans-serif' }}>
                    Mobile Number
                  </label>
                  <div className="flex items-center border-2 rounded-xl px-4 py-3 transition-all" style={fieldStyle}>
                    <span className="text-sm font-medium mr-2 opacity-60">🇮🇳 +91</span>
                    <input
                      id="phone"
                      type="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      required
                      className="w-full text-sm outline-none bg-transparent"
                    />
                  </div>
                </div>

                {error && <p className="text-sm" style={{ color: errorColor }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3 font-semibold text-sm transition-all hover:shadow-md disabled:opacity-60"
                  style={{ background: accentGradient, color: buttonText, fontFamily: 'Poppins, sans-serif' }}
                >
                  {loading ? 'Sending OTP…' : 'Continue →'}
                </button>
              </form>
            </div>
          )}

          {/* ─── STEP 3: OTP VERIFICATION PIN-PAD ─── */}
          {step === 'otp' && (
            <div>
              <button onClick={() => { setStep('phone'); setError(''); setOtp(['','','','','','']) }} className="flex items-center gap-1 text-sm mb-5 transition-opacity hover:opacity-70" style={{ color: textColor, fontFamily: 'Inter, sans-serif' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
                Change number
              </button>

              <h2 className="text-lg font-bold mb-1" style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}>
                Verify OTP Security Pin
              </h2>
              <p className="text-sm mb-6" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
                Sent via secure gateway channel to <span className="font-semibold" style={{ color: textColor }}>+91 {phone}</span>
              </p>

              <form onSubmit={verifyOtp} className="space-y-5">
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
                        borderColor: digit ? accentColor : 'var(--color-border, #E2E8F0)',
                        background: digit ? 'rgba(var(--color-accent-rgb, 212, 175, 55), 0.08)' : 'var(--color-surface, #FFFFFF)',
                        color: textColor,
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    />
                  ))}
                </div>

                {error && <p className="text-sm text-center" style={{ color: errorColor }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
                  className="w-full rounded-xl py-3 font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50"
                  style={{ background: accentGradient, color: buttonText, fontFamily: 'Poppins, sans-serif' }}
                >
                  {loading ? 'Verifying…' : 'Verify & Proceed →'}
                </button>
              </form>

              <p className="text-center text-xs mt-4" style={{ color: subtleText }}>
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : (
                  <span onClick={sendOtp} className="cursor-pointer font-semibold underline" style={{ color: accentColor }}>Resend Code SMS</span>
                )}
              </p>
            </div>
          )}

          {/* ─── STEP 4: ACCOUNT ONBOARDING PROFILE SETUP ─── */}
          {step === 'name' && (
            <div>
              <p className="text-4xl text-center mb-2">👋</p>
              <h2 className="text-center text-xl font-bold mb-1" style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}>
                What's your name?
              </h2>
              <p className="text-center text-sm mb-6" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
                This is how you will appear on leaderboard components and certificates
              </p>

              <form onSubmit={finishSignup} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all"
                  style={fieldStyle}
                />

                {error && <p className="text-sm" style={{ color: errorColor }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3 font-semibold text-sm transition-all hover:shadow-md"
                  style={{ background: accentGradient, color: buttonText, fontFamily: 'Poppins, sans-serif' }}
                >
                  {loading ? 'Setting up account...' : "Let's Go! 🚀"}
                </button>
              </form>
            </div>
          )}

          {/* Terms & Conditions Legal Footer */}
          <p className="mt-6 text-center text-xs" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline hover:opacity-80" style={{ color: textLight }}>Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:opacity-80" style={{ color: textLight }}>Privacy Policy</a>.
          </p>
        </div>

        {/* Corporate Copyright Tagline */}
        <p className="text-center mt-6 text-xs font-medium tracking-wide opacity-50" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
          1,10,000+ exams · 42 languages · TryIT Educations © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}