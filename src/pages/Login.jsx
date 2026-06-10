import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Particles from '../components/Particles'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [step, setStep]       = useState('email')
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState(['','','','','',''])
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [shaking, setShake]   = useState(false)
  const otpRefs = useRef([])

  const shake = (msg) => {
    setError(msg); setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const sendOTP = () => {
    if (!email.trim()) { shake('Please enter your email.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { shake('Enter a valid email address.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep('otp'); setError('') }, 900)
  }

  const changeOtp = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const n = [...otp]; n[i] = val; setOtp(n)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
  }

  const keyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  const paste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (p.length === 6) { setOtp(p.split('')); otpRefs.current[5]?.focus() }
  }

  const verify = () => {
    if (otp.some(d => !d)) { shake('Enter all 6 digits.'); return }
    setLoading(true)
    setTimeout(() => {
      login()
      showToast('success', '✅ Welcome to TryIT Educations!')
      navigate('/onboarding')
    }, 1100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{ background: 'linear-gradient(135deg,#1E3A5F,#0F2140,#071428)' }}>
      <Particles count={18} />
      <div className={`glass rounded-3xl p-8 w-full max-w-md relative z-10 animate-slide-up ${shaking ? 'animate-shake' : ''}`}>
        <div className="flex flex-col items-center mb-6">
          <Logo dark height={52} />
          <h1 className="text-2xl font-bold text-[#1E3A5F] mt-4 font-poppins">Join Free</h1>
          <p className="text-slate-500 text-sm mt-1">India's most complete exam platform</p>
        </div>

        {/* Google */}
        <button onClick={() => { login(); navigate('/onboarding') }}
          className="clay w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold text-slate-700 hover:-translate-y-0.5 transition-transform mb-4">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-sm">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {step === 'email' ? (
          <>
            <label className="block text-sm font-semibold text-[#1E3A5F] mb-2">Email Address</label>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
              <input value={email} type="email" placeholder="your@email.com"
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && sendOTP()}
                className="clay-input pl-11" />
            </div>
            {error.length > 0 ? <p className="text-red-500 text-sm mb-3">{error}</p> : null}
            <button onClick={sendOTP} disabled={loading} className="btn-gold w-full py-4 rounded-2xl font-bold text-base">
              {loading ? 'Sending…' : 'Send OTP →'}
            </button>
          </>
        ) : (
          <>
            <p className="text-slate-600 text-sm mb-4 text-center">
              6-digit code sent to <strong>{email}</strong>
            </p>
            <div className="flex gap-2 justify-center mb-4" onPaste={paste}>
              {otp.map((d, i) => (
                <input key={i} ref={el => otpRefs.current[i] = el}
                  value={d} maxLength={1} inputMode="numeric"
                  onChange={e => changeOtp(i, e.target.value)}
                  onKeyDown={e => keyDown(i, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-white outline-none transition-colors font-poppins
                    ${d ? 'border-[#1E3A5F] text-[#1E3A5F]' : 'border-slate-200 text-slate-400'} focus:border-[#D4AF37]`} />
              ))}
            </div>
            {error.length > 0 ? <p className="text-red-500 text-sm text-center mb-3">{error}</p> : null}
            <button onClick={verify} disabled={loading} className="btn-gold w-full py-4 rounded-2xl font-bold text-base">
              {loading ? 'Verifying…' : 'Verify & Enter →'}
            </button>
            <button onClick={() => { setStep('email'); setOtp(['','','','','','']); setError('') }}
              className="w-full text-center text-slate-500 text-sm mt-3 hover:text-[#1E3A5F] transition-colors">
              ← Change email
            </button>
          </>
        )}
        <p className="text-center text-slate-400 text-xs mt-4">No credit card · No hidden charges</p>
      </div>
    </div>
  )
}
