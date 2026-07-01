// FILE: src/pages/Login.jsx
// TryIT - Returning user login via role select + 4-digit PIN
// Route: /login   |   New users go to /register

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
  const { login, hasPinForRole, verifyPin, user } = useAuth()
  useTheme()

  const [step, setStep] = useState('role')
  const [selectedRole, setSelectedRole] = useState('')
  const [pin, setPin] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attemptsLeft, setAttemptsLeft] = useState(null)
  const [lockedUntil, setLockedUntil] = useState(null)

  const pinRefs = useRef([])
  const redirectTo = location.state?.from || '/role-select'

  useEffect(() => {
    if (user) {
      const done = localStorage.getItem(onboardingKey(user.email || ''))
      const ROLE_HOME = { student: '/student', mentor: '/mentor-hub', institution: '/centre/dashboard', family: '/family' }
      navigate(done ? (ROLE_HOME[user.role] || '/student') : '/onboarding')
    }
  }, [user, navigate])

  useEffect(() => {
    if (step === 'pin' && pinRefs.current[0]) pinRefs.current[0].focus()
  }, [step])

  function handleRoleSelect(roleId) {
    setSelectedRole(roleId)
    setError('')
    setAttemptsLeft(null)
    setLockedUntil(null)
    if (!hasPinForRole(roleId)) {
      setError('No account found for this role on this device. Please register first.')
      setStep('role')
      return
    }
    setPin(['', '', '', ''])
    setStep('pin')
  }

  const handlePinChange = (index, value) => {
    const char = value.replace(/\D/g, '')
    if (!char && value !== '') return
    const next = [...pin]
    next[index] = char
    setPin(next)
    if (char && index < 3) pinRefs.current[index + 1]?.focus()
  }

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) pinRefs.current[index - 1]?.focus()
  }

  const submitPin = async (e) => {
    if (e) e.preventDefault()
    if (pin.join('').length !== 4) { setError('Enter all 4 digits'); return }
    setError('')
    setLoading(true)

    const result = verifyPin(selectedRole, pin.join(''))

    if (result.success) {
      const email = localStorage.getItem('tryit_email')
      try {
        await login(email, selectedRole)
      } catch (err) {
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
      return
    }

    setLoading(false)
    setPin(['', '', '', ''])
    pinRefs.current[0]?.focus()

    if (result.reason === 'locked') {
      const mins = result.lockedUntil ? Math.ceil((new Date(result.lockedUntil) - new Date()) / 60000) : 15
      setLockedUntil(result.lockedUntil)
      setError(`Too many attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.`)
    } else if (result.reason === 'no_pin_set') {
      setError('No account found for this role on this device. Please register first.')
    } else {
      setAttemptsLeft(result.attemptsLeft)
      setError(`Incorrect PIN. ${result.attemptsLeft} attempt${result.attemptsLeft === 1 ? '' : 's'} left.`)
    }
  }

  const bgGradient = 'linear-gradient(135deg, var(--color-primary-dark, #0F2140) 0%, var(--color-primary, #1E3A5F) 55%, rgba(var(--color-surface-rgb, 255,255,255), 0.08) 100%)'
  const surfaceStyle = { background: 'var(--color-surface, #FFFFFF)', border: '1px solid var(--color-border, #E2E8F0)' }
  const accentColor = 'var(--color-accent, #D4AF37)'
  const accentGradient = 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))'
  const textColor = 'var(--color-text, #1E3A5F)'
  const subtleText = 'var(--subtext-color, #94A3B8)'
  const buttonText = 'var(--button-text, var(--color-text, #1E3A5F))'
  const errorColor = 'var(--color-error, #EF4444)'

  const roleObj = ROLES.find(r => r.id === selectedRole)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden" style={{ background: bgGradient }}>
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-2xl transition-all duration-300" style={surfaceStyle}>

          <div className="flex flex-col items-center mb-7">
            <Logo dark={false} height={48} />
            <p className="mt-3 text-xs font-medium tracking-widest uppercase" style={{ color: accentColor, fontFamily: 'Poppins, sans-serif' }}>Your Exam. Your Rank. Your Success.</p>
          </div>

          {step === 'role' && (
            <div>
              <h2 className="text-center text-xl font-bold mb-1" style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}>Welcome back</h2>
              <p className="text-center text-sm mb-6" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>Pick your role to log in</p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(role => (
                  <button key={role.id} onClick={() => handleRoleSelect(role.id)}
                    className="group flex flex-col items-center gap-1 rounded-xl p-4 border-2 text-left transition-all duration-150 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ borderColor: selectedRole === role.id ? accentColor : 'var(--color-border, #E2E8F0)', background: selectedRole === role.id ? 'rgba(var(--color-accent-rgb, 212, 175, 55), 0.14)' : 'var(--color-surface, #FFFFFF)', fontFamily: 'Inter, sans-serif' }}>
                    <span className="text-3xl mb-1">{role.emoji}</span>
                    <span className="font-semibold text-sm" style={{ color: textColor }}>{role.label}</span>
                    <span className="text-xs text-center leading-tight" style={{ color: subtleText }}>{role.desc}</span>
                  </button>
                ))}
              </div>
              {error && <p className="text-sm text-center mt-4" style={{ color: errorColor }}>{error}</p>}
              <p className="text-center text-xs mt-6" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
                New here?{' '}<a href="/register" className="font-semibold underline" style={{ color: accentColor }}>Create an account</a>
              </p>
            </div>
          )}

          {step === 'pin' && (
            <div>
              <button onClick={() => { setStep('role'); setError(''); setPin(['','','','']) }} className="flex items-center gap-1 text-sm mb-5 transition-opacity hover:opacity-70" style={{ color: textColor, fontFamily: 'Inter, sans-serif' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
                Change role
              </button>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{roleObj?.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold leading-tight" style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}>Log in as {roleObj?.label}</h2>
                  <p className="text-xs" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>Enter your 4-digit PIN</p>
                </div>
              </div>

              <form onSubmit={submitPin} className="space-y-5">
                <div className="flex gap-3 justify-center">
                  {pin.map((digit, i) => (
                    <input key={i} ref={el => pinRefs.current[i] = el} type="password" inputMode="numeric" maxLength={1} value={digit} onChange={e => handlePinChange(i, e.target.value)} onKeyDown={e => handlePinKeyDown(i, e)} disabled={!!lockedUntil}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all disabled:opacity-40"
                      style={{ borderColor: digit ? accentColor : 'var(--color-border, #E2E8F0)', background: digit ? 'rgba(var(--color-accent-rgb, 212, 175, 55), 0.08)' : 'var(--color-surface, #FFFFFF)', color: textColor, fontFamily: 'Poppins, sans-serif' }} />
                  ))}
                </div>

                {error && <p className="text-sm text-center" style={{ color: errorColor }}>{error}</p>}

                <button type="submit" disabled={loading || !!lockedUntil || pin.join('').length < 4}
                  className="w-full rounded-xl py-3 font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50"
                  style={{ background: accentGradient, color: buttonText, fontFamily: 'Poppins, sans-serif' }}>
                  {loading ? 'Verifying...' : 'Unlock →'}
                </button>
              </form>
            </div>
          )}

          <p className="mt-6 text-center text-xs" style={{ color: subtleText, fontFamily: 'Inter, sans-serif' }}>
            By continuing, you agree to our{' '}<a href="/terms" className="underline hover:opacity-80" style={{ color: subtleText }}>Terms</a>{' '}and{' '}<a href="/privacy" className="underline hover:opacity-80" style={{ color: subtleText }}>Privacy Policy</a>.
          </p>
        </div>

        <p className="text-center mt-6 text-xs font-medium tracking-wide opacity-50" style={{ color: 'var(--color-surface, #FFFFFF)', fontFamily: 'Inter, sans-serif' }}>1,10,000+ exams · 42 languages · TryIT Educations © {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}