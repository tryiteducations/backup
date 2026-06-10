// TARGET_FILE: index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/webp" href="/tryit-logo.webp" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="TryIT Educations — Your Exam. Your Rank. Your Success. India's most complete exam prep platform." />
    <title>TryIT Educations — Your Exam. Your Rank. Your Success.</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

// TARGET_FILE: tailwind.config.js
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'gold-light': '#E8C84A',
        navy: '#1E3A5F',
        'navy-dark': '#0F2140',
        'navy-deep': '#071428',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

// TARGET_FILE: vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

// TARGET_FILE: src/main.jsx
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```
// TARGET_FILE: src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── FONTS ─────────────────────────────────────────── */
body { font-family: 'Inter', sans-serif; background: #F8FAFC; color: #1E293B; }
h1,h2,h3,h4,h5,h6 { font-family: 'Poppins', sans-serif; }

/* ── SCROLLBAR ─────────────────────────────────────── */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* ── CLAYMORPHISM ──────────────────────────────────── */
.clay {
  background: #FFFFFF; border-radius: 24px;
  box-shadow: 8px 8px 20px rgba(30,58,95,0.12),
    -4px -4px 12px rgba(255,255,255,0.9),
    inset 2px 2px 6px rgba(255,255,255,0.8),
    inset -2px -2px 6px rgba(30,58,95,0.06);
  border: 1.5px solid rgba(255,255,255,0.7);
}
.clay-dark {
  background: linear-gradient(135deg, #1E3A5F, #0F2140); border-radius: 24px;
  box-shadow: 8px 8px 20px rgba(0,0,0,0.25),
    -4px -4px 12px rgba(255,255,255,0.04),
    inset 2px 2px 8px rgba(255,255,255,0.07),
    inset -2px -2px 8px rgba(0,0,0,0.3);
  border: 1.5px solid rgba(255,255,255,0.09);
}
.clay-gold {
  background: linear-gradient(135deg, #D4AF37, #E8C84A, #D4AF37); border-radius: 24px;
  box-shadow: 8px 8px 20px rgba(212,175,55,0.35),
    -4px -4px 12px rgba(255,255,255,0.6),
    inset 2px 2px 8px rgba(255,255,255,0.4),
    inset -2px -2px 8px rgba(184,150,10,0.3);
  border: 1.5px solid rgba(255,255,255,0.5);
}

/* ── GLASSMORPHISM ─────────────────────────────────── */
.glass {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.6); border-radius: 24px;
  box-shadow: 0 8px 32px rgba(30,58,95,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
}
.glass-dark {
  background: rgba(15,33,64,0.82);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
}
.glass-gold {
  background: rgba(212,175,55,0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(212,175,55,0.35); border-radius: 20px;
  box-shadow: 0 4px 24px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
}

/* ── BUTTONS ───────────────────────────────────────── */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37, #E8C84A);
  border: none; color: #1E3A5F;
  font-family: 'Poppins', sans-serif; font-weight: 700; cursor: pointer;
  animation: pulseGold 2s infinite;
  box-shadow: 4px 4px 12px rgba(212,175,55,0.4), -2px -2px 8px rgba(255,255,255,0.6),
    inset 1px 1px 4px rgba(255,255,255,0.4);
  transition: all 0.2s ease; border-radius: 14px;
}
.btn-gold:hover { background: linear-gradient(135deg,#E8C84A,#F5D76E); transform: translateY(-1px); }
.btn-gold:disabled { opacity: 0.4; cursor: not-allowed; animation: none; transform: none; }
.btn-navy {
  background: linear-gradient(135deg, #1E3A5F, #0F2140);
  border: none; color: white;
  font-family: 'Poppins', sans-serif; font-weight: 700; cursor: pointer;
  box-shadow: 4px 4px 12px rgba(30,58,95,0.4);
  transition: all 0.2s ease; border-radius: 14px;
}
.btn-navy:hover { background: linear-gradient(135deg,#0F2140,#071428); transform: translateY(-1px); }

/* ── REVEAL ANIMATIONS ─────────────────────────────── */
.reveal       { opacity: 0; transform: translateY(30px);  transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal-l     { opacity: 0; transform: translateX(-50px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal-r     { opacity: 0; transform: translateX(50px);  transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal-s     { opacity: 0; transform: scale(0.85);       transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.show, .reveal-l.show, .reveal-r.show, .reveal-s.show { opacity: 1; transform: none; }

/* ── SCROLL PROGRESS ───────────────────────────────── */
.scroll-progress {
  position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
  background: linear-gradient(90deg, #D4AF37, #E8C84A, #D4AF37);
  transition: width 0.1s linear; pointer-events: none;
}

/* ── CLAY INPUT ────────────────────────────────────── */
.clay-input {
  background: #F8FAFC; border-radius: 14px;
  border: 2px solid rgba(255,255,255,0.8);
  box-shadow: inset 4px 4px 10px rgba(30,58,95,0.08), inset -2px -2px 6px rgba(255,255,255,0.9);
  outline: none; font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease; width: 100%; padding: 14px 16px;
  font-size: 15px; color: #1E293B;
}
.clay-input:focus {
  border-color: #D4AF37;
  box-shadow: inset 4px 4px 10px rgba(30,58,95,0.08), 0 0 0 3px rgba(212,175,55,0.2);
}
.clay-input::placeholder { color: #94A3B8; }

/* ── KEYFRAMES ─────────────────────────────────────── */
@keyframes pulseGold {
  0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.5), 4px 4px 12px rgba(212,175,55,0.3); }
  50%      { box-shadow: 0 0 0 10px rgba(212,175,55,0), 4px 4px 20px rgba(212,175,55,0.6); }
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-12px); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bounceIn {
  0%   { opacity: 0; transform: scale(0.3); }
  50%  { transform: scale(1.05); }
  70%  { transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes wordReveal {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes confettiFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-8px); }
  40%     { transform: translateX(8px); }
  60%     { transform: translateX(-5px); }
  80%     { transform: translateX(5px); }
}
@keyframes pulseDot {
  0%,100% { opacity: 1; transform: scale(1); }
  50%     { opacity: 0.4; transform: scale(0.7); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes barGrow {
  from { width: 0%; }
  to   { width: var(--bar-w, 100%); }
}

/* Utility animation classes */
.animate-float       { animation: float 4s ease-in-out infinite; }
.animate-slide-up    { animation: slideUp 0.5s ease forwards; }
.animate-bounce-in   { animation: bounceIn 0.6s ease forwards; }
.animate-word-reveal { animation: wordReveal 0.6s ease forwards; }
.animate-shake       { animation: shake 0.4s ease; }
.animate-pulse-dot   { animation: pulseDot 1.5s ease-in-out infinite; }
.animate-spin-slow   { animation: spin 2s linear infinite; }
```
// TARGET_FILE: src/App.jsx
```jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider }  from './context/ThemeContext'
import { ToastProvider }  from './context/ToastContext'
import { AuthProvider }   from './context/AuthContext'

/* ── Lazy pages ── */
const Splash        = lazy(() => import('./pages/Splash'))
const Landing       = lazy(() => import('./pages/Landing'))
const Login         = lazy(() => import('./pages/Login'))
const Onboarding    = lazy(() => import('./pages/Onboarding'))
const Dashboard     = lazy(() => import('./pages/Dashboard'))
const Profile       = lazy(() => import('./pages/Profile'))
const Settings      = lazy(() => import('./pages/Settings'))
const TestLauncher  = lazy(() => import('./pages/test-engine/TestLauncher'))
const ActiveTest    = lazy(() => import('./pages/test-engine/ActiveTest'))
const ResultScreen  = lazy(() => import('./pages/test-engine/ResultScreen'))
const ReviewScreen  = lazy(() => import('./pages/test-engine/ReviewScreen'))

/* ── Full-screen loader ── */
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center"
    style={{ background: 'linear-gradient(135deg,#1E3A5F,#0F2140)' }}>
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="4"/>
      <circle cx="28" cy="28" r="22" fill="none" stroke="#D4AF37" strokeWidth="4"
        strokeDasharray="40 98"
        style={{ animation:'spin 1.2s linear infinite', transformOrigin:'center' }}/>
    </svg>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
)

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/"                      element={<Splash />} />
                <Route path="/landing"               element={<Landing />} />
                <Route path="/login"                 element={<Login />} />
                <Route path="/onboarding"            element={<Onboarding />} />
                <Route path="/dashboard"             element={<Dashboard />} />
                <Route path="/profile"               element={<Profile />} />
                <Route path="/settings"              element={<Settings />} />
                <Route path="/test-engine"           element={<TestLauncher />} />
                <Route path="/test-engine/active"    element={<ActiveTest />} />
                <Route path="/test-engine/result"    element={<ResultScreen />} />
                <Route path="/test-engine/review"    element={<ReviewScreen />} />
                <Route path="*"                      element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
```

// TARGET_FILE: src/context/ToastContext.jsx
```jsx
import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext({})

const META = {
  success: { icon: '✅', bg: 'bg-green-500' },
  error:   { icon: '❌', bg: 'bg-red-500'   },
  info:    { icon: 'ℹ️', bg: 'bg-[#1E3A5F]' },
  warning: { icon: '⚠️', bg: 'bg-amber-500' },
  coin:    { icon: '🪙', bg: 'bg-[#D4AF37]' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((type = 'info', message = '') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[9999] pointer-events-none w-[320px]">
        {toasts.map(t => {
          const m = META[t.type] || META.info
          return (
            <div key={t.id}
              className={`${m.bg} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 pointer-events-auto animate-slide-up`}>
              <span className="text-lg flex-shrink-0">{m.icon}</span>
              <span className="text-sm font-semibold flex-1 leading-snug">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="text-white/60 hover:text-white text-xl leading-none flex-shrink-0">×</button>
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
```

// TARGET_FILE: src/context/ThemeContext.jsx
```jsx
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext({})

const THEMES = {
  'classic-navy':  { '--theme-primary': '#1E3A5F', '--theme-accent': '#D4AF37', '--theme-bg': '#F8FAFC', label: 'Classic Navy'  },
  'midnight-dark': { '--theme-primary': '#0F2140', '--theme-accent': '#D4AF37', '--theme-bg': '#0A0F1E', label: 'Midnight Dark' },
  'forest-green':  { '--theme-primary': '#065F46', '--theme-accent': '#D4AF37', '--theme-bg': '#F0FDF4', label: 'Forest Green'  },
  'royal-purple':  { '--theme-primary': '#4C1D95', '--theme-accent': '#D4AF37', '--theme-bg': '#FAF5FF', label: 'Royal Purple'  },
}

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(
    () => localStorage.getItem('tryit_theme') || 'classic-navy'
  )

  useEffect(() => {
    const vars = THEMES[activeTheme] || THEMES['classic-navy']
    Object.entries(vars).forEach(([k, v]) => {
      if (k.startsWith('--')) document.documentElement.style.setProperty(k, v)
    })
    localStorage.setItem('tryit_theme', activeTheme)
  }, [activeTheme])

  return (
    <ThemeCtx.Provider value={{ activeTheme, setActiveTheme, THEMES }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
```

// TARGET_FILE: src/context/AuthContext.jsx
```jsx
import { createContext, useContext, useState } from 'react'
import MOCK_USER from '../data/mockUser'

const AuthCtx = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tryit_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (extra = {}) => {
    const u = { ...MOCK_USER, ...extra }
    setUser(u)
    localStorage.setItem('tryit_user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tryit_user')
  }

  return (
    <AuthCtx.Provider value={{ user: user || MOCK_USER, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
```

// TARGET_FILE: src/data/mockUser.js
```js
const MOCK_USER = {
  id: 'usr-001',
  name: 'Arjun Kumar',
  initials: 'AK',
  email: 'arjun@example.com',
  state: 'Tamil Nadu',
  city: 'Coimbatore',
  category: 'General',
  level: 4,
  levelTitle: 'The Gold Miner',
  levelEmoji: '👊',
  xp: 6240,
  xpToNext: 8000,
  coins: 1247,
  streak: 12,
  streakFreezes: 2,
  isPro: true,
  userId: 'TRY-TN-00001-2026',
  joinDate: 'January 2026',
  rank: 1243,
  testsCompleted: 23,
  avgScore: 78,
  studyHours: '48h 30m',
  guruPoints: 847,
  languages: ['en', 'ta'],
  exams: [
    { id: 'ssc-cgl',  name: 'SSC CGL',  readiness: 67, examDate: 'Aug 2026' },
    { id: 'upsc-cse', name: 'UPSC CSE', readiness: 34, examDate: 'May 2026' },
    { id: 'neet-ug',  name: 'NEET UG',  readiness: 12, examDate: 'May 2026' },
    { id: 'ibps-po',  name: 'IBPS PO',  readiness: 45, examDate: 'Jul 2026' },
    { id: 'gate-cs',  name: 'GATE CS',  readiness: 28, examDate: 'Feb 2027' },
  ],
  subjects: [
    { name: 'Quant',     accuracy: 82, trend: 'up',   emoji: '📐' },
    { name: 'Reasoning', accuracy: 90, trend: 'up',   emoji: '🧠' },
    { name: 'English',   accuracy: 68, trend: 'down', emoji: '📝' },
    { name: 'GK',        accuracy: 75, trend: 'up',   emoji: '🌏' },
    { name: 'Science',   accuracy: 55, trend: 'down', emoji: '🔬' },
  ],
}

export default MOCK_USER
```

// TARGET_FILE: src/hooks/useReveal.js
```js
import { useEffect } from 'react'

export default function useReveal(threshold = 0.12) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-s')
    if (!els.length) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target) }
      }),
      { threshold }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [threshold])
}
```

// TARGET_FILE: src/hooks/useCountUp.js
```js
import { useState, useEffect, useRef } from 'react'

export default function useCountUp(target, duration = 1500, trigger = true) {
  const [count, setCount] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (!trigger) return
    const startTime = performance.now()
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, trigger])

  return count
}
```
// TARGET_FILE: src/components/Logo.jsx
```jsx
import { useState } from 'react'

export default function Logo({ dark = false, height = 40 }) {
  const [err, setErr] = useState(false)
  if (!err) {
    return (
      <img src="/tryit-logo.webp" alt="TryIT Educations"
        style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }}
        onError={() => setErr(true)} />
    )
  }
  return (
    <div style={{ height: `${height}px` }} className="flex items-center gap-1">
      <span style={{ fontSize: height * 0.55, fontFamily: 'Poppins,sans-serif', fontWeight: 800 }}
        className={dark ? 'text-white' : 'text-[#1E3A5F]'}>TRY</span>
      <span style={{ fontSize: height * 0.55, fontFamily: 'Poppins,sans-serif', fontWeight: 800 }}
        className="text-[#D4AF37]">IT</span>
    </div>
  )
}
```

// TARGET_FILE: src/components/Particles.jsx
```jsx
import { useMemo } from 'react'

export default function Particles({ count = 25 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      dur: Math.random() * 3 + 3,
      opacity: Math.random() * 0.4 + 0.1,
    })), [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full bg-[#D4AF37]"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            opacity: p.opacity,
            animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }} />
      ))}
    </div>
  )
}
```

// TARGET_FILE: src/components/TiltCard.jsx
```jsx
import { useRef } from 'react'

export default function TiltCard({ children, intensity = 10 }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2, cy = rect.height / 2
    const rX = ((y - cy) / cy) * -intensity
    const rY = ((x - cx) / cx) * intensity
    el.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.02)`
  }

  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: 'transform 0.3s ease', transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  )
}
```
// TARGET_FILE: src/components/layout/Sidebar.jsx
```jsx
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../Logo'
import { useAuth } from '../../context/AuthContext'
import {
  Home, FileText, Target, BookOpen, Gamepad2, GraduationCap,
  Users, Trophy, Library, Newspaper, DollarSign, BarChart2,
  CreditCard, Settings, ChevronRight
} from 'lucide-react'

const NAV = [
  { path: '/dashboard',       label: 'Dashboard',       icon: Home,          badge: null     },
  { path: '/test-engine',     label: 'My Tests',         icon: FileText,      badge: '3 New'  },
  { path: '/exams',           label: 'All Exams',        icon: Target,        badge: null     },
  { path: '/subjects',        label: 'Subjects',          icon: BookOpen,      badge: null     },
  { path: '/games',           label: 'Brain Games',      icon: Gamepad2,      badge: '🔥 Hot' },
  { path: '/guru-hub',        label: 'Guru Hub',         icon: GraduationCap, badge: '24'     },
  null,
  { path: '/hall',            label: 'The Hall',         icon: Users,         badge: null     },
  { path: '/tournaments',     label: 'Tournaments',      icon: Trophy,        badge: '●'      },
  null,
  { path: '/classroom',       label: 'Classroom',        icon: Library,       badge: null     },
  { path: '/current-affairs', label: 'Current Affairs',  icon: Newspaper,     badge: 'Today'  },
  { path: '/scholarships',    label: 'Scholarships',     icon: DollarSign,    badge: null     },
  null,
  { path: '/analytics',       label: 'My Analytics',     icon: BarChart2,     badge: null     },
  { path: '/pro',             label: 'Pro Member',        icon: CreditCard,    badge: 'PRO'    },
  { path: '/settings',        label: 'Settings',          icon: Settings,      badge: null     },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useAuth()

  const go = (path) => { navigate(path); if (onClose) onClose() }
  const active = (path) => pathname === path || (path !== '/' && pathname.startsWith(path + '/'))

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed left-0 top-0 h-screen w-[260px] bg-[#1E3A5F] z-40 flex flex-col overflow-hidden
        transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Gold stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent flex-shrink-0" />

        {/* Logo */}
        <div className="px-5 py-4 flex-shrink-0">
          <Logo dark height={36} />
          <p className="text-white/40 text-xs italic mt-1">Your Exam. Your Rank. Your Success.</p>
        </div>

        {/* User card */}
        <div className="px-4 pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-bold text-sm flex items-center justify-center flex-shrink-0">
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user.name}</p>
              <p className="text-[#D4AF37] text-xs">{user.levelEmoji} {user.levelTitle}</p>
            </div>
          </div>
          {/* XP bar */}
          <div className="mt-2.5">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/50">{user.xp.toLocaleString()} XP</span>
              <span className="text-white/50">{user.xpToNext.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-[#D4AF37] h-1.5 rounded-full" style={{ width: `${(user.xp / user.xpToNext) * 100}%` }} />
            </div>
          </div>
          {/* Stats pills */}
          <div className="flex gap-2 mt-2">
            <span className="flex items-center gap-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-3 py-1 rounded-full font-semibold">
              🪙 {user.coins.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full font-semibold">
              🔥 {user.streak}
            </span>
          </div>
        </div>

        {/* Active exam */}
        <div className="px-4 py-2.5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-xl px-3 py-2">
            <div>
              <p className="text-[#D4AF37] text-xs font-semibold">Active Exam</p>
              <p className="text-white text-sm font-bold">{user.exams[0]?.name}</p>
            </div>
            <button onClick={() => go('/exams')} className="text-[#D4AF37] text-xs flex items-center gap-0.5 hover:underline">
              Switch <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 scrollbar-hide">
          {NAV.map((item, i) => {
            if (item === null) return <hr key={i} className="border-white/10 my-2" />
            const Icon = item.icon
            const isActive = active(item.path)
            return (
              <button key={item.path} onClick={() => go(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all
                  ${isActive
                    ? 'bg-[#D4AF37]/15 border-l-2 border-[#D4AF37] text-[#D4AF37]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                    ${item.badge === 'PRO' ? 'bg-[#D4AF37] text-[#1E3A5F]'
                    : item.badge === '●' ? 'text-red-400 animate-pulse-dot text-base leading-none'
                    : 'bg-white/10 text-white/70'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
```

// TARGET_FILE: src/components/layout/Topbar.jsx
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, ChevronDown, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ onMenuClick, title = 'Dashboard' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)

  const menuItems = [
    { label: '👤 My Profile',   action: () => navigate('/profile')  },
    { label: '⚙️ Settings',     action: () => navigate('/settings') },
    { label: '💳 Pro Member',   action: () => navigate('/pro')      },
    { label: '🚪 Sign Out',     action: () => { logout(); navigate('/landing') }, red: true },
  ]

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-[68px] z-20 flex items-center justify-between px-5"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E2E8F0' }}>

      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
          <Menu size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-[#1E3A5F] font-poppins hidden sm:block">{title}</h1>
        <div className="hidden md:flex items-center gap-2 glass-gold px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse-dot" />
          <span className="text-xs font-semibold text-[#1E3A5F]">{user.exams[0]?.name}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="hidden sm:flex items-center gap-1.5 glass px-3 py-2 rounded-xl text-slate-600 text-sm font-medium hover:text-[#1E3A5F]">
          <Globe size={15} /> EN
        </button>
        {user.isPro && (
          <span className="hidden sm:flex clay-gold items-center gap-1 px-3 py-1.5 rounded-xl text-[#1E3A5F] font-bold text-xs">
            ⚡ PRO
          </span>
        )}
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl">
          <span className="text-base">🪙</span>
          <span className="text-sm font-bold text-[#1E3A5F]">{user.coins.toLocaleString()}</span>
        </div>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="relative">
          <button onClick={() => setDropOpen(p => !p)}
            className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1.5 rounded-xl transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#1E3A5F] border-2 border-[#D4AF37] text-white font-bold text-xs flex items-center justify-center">
              {user.initials}
            </div>
            <span className="hidden md:block text-sm font-semibold text-slate-700">{user.name.split(' ')[0]}</span>
            <ChevronDown size={14} className="text-slate-500" />
          </button>
          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 clay rounded-2xl p-2 shadow-xl z-50">
              {menuItems.map(item => (
                <button key={item.label} onClick={() => { item.action(); setDropOpen(false) }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors
                    ${item.red ? 'text-red-500 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-100'}`}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
```

// TARGET_FILE: src/components/layout/AppLayout.jsx
```jsx
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard', '/test-engine': 'Test Engine',
  '/exams': 'All Exams', '/subjects': 'Subjects', '/games': 'Brain Games',
  '/guru-hub': 'Guru Hub', '/hall': 'The Hall', '/tournaments': 'Tournaments',
  '/classroom': 'Classroom', '/current-affairs': 'Current Affairs',
  '/scholarships': 'Scholarships', '/analytics': 'My Analytics',
  '/pro': 'Pro Member', '/profile': 'My Profile', '/settings': 'Settings',
}

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'TryIT'

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
      <main className="lg:ml-[260px] mt-[68px] p-5 md:p-6 min-h-[calc(100vh-68px)]">
        {children}
      </main>
    </div>
  )
}
```
// TARGET_FILE: src/components/landing/Navbar.jsx
```jsx
import { useNavigate } from 'react-router-dom'
import Logo from '../Logo'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="sticky top-0 z-50 h-[68px] flex items-center justify-between px-6 md:px-10"
      style={{ background: 'rgba(30,58,95,0.94)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
      <Logo dark height={40} />
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-white/70 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" /> 1,247 studying now
        </span>
        <button onClick={() => navigate('/login')} className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm">
          Login →
        </button>
      </div>
    </nav>
  )
}
```

// TARGET_FILE: src/components/landing/Hero.jsx
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TiltCard from '../TiltCard'
import Particles from '../Particles'

const TABS = [
  { emoji: '🎓', label: 'Students',   desc: 'Prepare smarter, rank higher' },
  { emoji: '👨‍👩‍👧', label: 'Parents',    desc: 'Track and support your child' },
  { emoji: '🧑‍🏫', label: 'Mentors',    desc: 'Teach, earn, grow' },
  { emoji: '🏫', label: 'Institutes', desc: 'Manage your students at scale' },
]

export default function Hero() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50">
      <Particles count={18} />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex glass-gold px-4 py-2 rounded-2xl w-fit">
            <span className="text-sm font-semibold text-[#1E3A5F]">
              🚀 India's Most Complete Exam Platform
            </span>
          </div>

          <div>
            {['One App.', 'Every Exam.', 'Zero Barriers.'].map((line, i) => (
              <h1 key={line}
                className={`font-poppins font-extrabold leading-tight animate-word-reveal
                  ${i === 1 ? 'text-[#D4AF37] animate-float' : 'text-[#1E3A5F]'}`}
                style={{ fontSize: 'clamp(40px,6vw,72px)', animationDelay: `${i * 0.15}s` }}>
                {line}
              </h1>
            ))}
          </div>

          <p className="text-[#D4AF37] text-lg italic font-inter">Your Exam. Your Rank. Your Success.</p>

          <p className="text-slate-600 text-base leading-relaxed max-w-lg">
            75,000+ exam pathways — Class 6 to PhD, age 12 to 60+.
            Study in 40+ Indian languages. Real All-India rankings after every test.
          </p>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/login')} className="btn-gold px-8 py-4 rounded-2xl font-bold text-lg">
              Start Free →
            </button>
            <a href="#stats" className="btn-navy px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center">
              How It Works ↓
            </a>
          </div>

          <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-2xl w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-dot" />
            <span className="text-sm font-semibold text-slate-700">1,247 students studying right now</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {TABS.map((t, i) => (
              <button key={t.label} onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${activeTab === i ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          {activeTab !== null && (
            <p className="text-slate-500 text-sm -mt-3">{TABS[activeTab].desc}</p>
          )}
        </div>

        {/* Right — floating cards */}
        <div className="hidden lg:flex flex-col gap-5 items-center">
          <TiltCard>
            <div className="glass-dark rounded-2xl p-5 w-80">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-bold text-lg flex items-center justify-center">AK</div>
                <div>
                  <p className="text-white font-bold">Arjun K. · Tamil Nadu</p>
                  <p className="text-[#D4AF37] text-xs">👊 Level 4 · SSC CGL</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">"Moved from #8,432 to #1,243 in 30 days! 🔥"</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: '67%' }} />
                </div>
                <span className="text-[#D4AF37] text-xs font-bold">67% Ready</span>
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="clay rounded-2xl p-5 w-72 animate-float" style={{ animationDelay: '0.8s' }}>
              <p className="text-[#1E3A5F] font-bold mb-3">📊 Subject Accuracy</p>
              {[['Reasoning', 90], ['Quant', 82], ['GK', 75], ['English', 68]].map(([sub, val]) => (
                <div key={sub} className="flex items-center gap-2 mb-2">
                  <span className="text-slate-500 text-xs w-20">{sub}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${val >= 80 ? 'bg-green-500' : 'bg-[#D4AF37]'}`}
                      style={{ width: `${val}%` }} />
                  </div>
                  <span className="text-xs font-bold text-[#1E3A5F] w-8 text-right">{val}%</span>
                </div>
              ))}
            </div>
          </TiltCard>

          <TiltCard>
            <div className="clay-gold rounded-2xl p-4 w-64 text-center">
              <p className="text-[#1E3A5F] font-bold text-2xl">🏆 #1,243</p>
              <p className="text-[#1E3A5F]/70 text-sm mt-1">All India · SSC CGL</p>
              <p className="text-[#1E3A5F] font-semibold text-sm mt-2">↑ 142 positions this week</p>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  )
}
```

// TARGET_FILE: src/components/landing/StatsStrip.jsx
```jsx
import { useState, useEffect, useRef } from 'react'

/*
 * BUG FIX APPLIED:
 * Never use {array.length && <Component />} — renders "0" when empty.
 * Always use {array.length > 0 ? <Component /> : null}.
 * The same principle applies to number rendering — we use explicit
 * ternary conditions for all conditional rendering below.
 */

const STATS = [
  { type: 'number', value: 75000, suffix: '+',   label: 'Exam Pathways'    },
  { type: 'number', value: 60,    suffix: '+',   label: 'Exam Categories'  },
  { type: 'number', value: 40,    suffix: '+',   label: 'Indian Languages' },
  { type: 'text',   display: 'All Ages',   label: '5 to 65 Years'          },
  { type: 'text',   display: 'All Stages', label: 'Class 6 to PhD'         },
  { type: 'text',   display: 'Real',       label: 'Rankings + Results'     },
]

function StatItem({ stat }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const isNum = stat.type === 'number'

  useEffect(() => {
    if (!isNum) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [isNum])

  useEffect(() => {
    if (!started || !isNum) return
    const dur = 1600
    const start = performance.now()
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * stat.value))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, isNum, stat.value])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="font-poppins font-extrabold text-[#D4AF37] leading-none"
        style={{ fontSize: 'clamp(32px,4vw,48px)' }}>
        {/* ── EXPLICIT TERNARY — never use `isNum && value` which renders "0" ── */}
        {isNum ? `${count.toLocaleString()}${stat.suffix}` : stat.display}
      </span>
      <span className="text-white/70 text-sm text-center leading-tight">{stat.label}</span>
    </div>
  )
}

export default function StatsStrip() {
  return (
    <section id="stats" className="py-10"
      style={{ background: 'linear-gradient(135deg,#1E3A5F,#0F2140)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <StatItem key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

// TARGET_FILE: src/components/landing/ExamCategories.jsx
```jsx
import { useNavigate } from 'react-router-dom'

const CATS = [
  { emoji:'📋', name:'SSC Exams',         count:'312+',  color:'#1E3A5F' },
  { emoji:'🎯', name:'UPSC & Civil',       count:'186+',  color:'#0F2140' },
  { emoji:'🏦', name:'Banking & Finance',  count:'534+',  color:'#065F46' },
  { emoji:'🚂', name:'Railways',           count:'287+',  color:'#7C3AED' },
  { emoji:'🏥', name:'Medical India',      count:'634+',  color:'#991B1B' },
  { emoji:'⚙️', name:'Engineering',        count:'1,247+',color:'#0369A1' },
  { emoji:'⚖️', name:'Law & Legal',        count:'234+',  color:'#92400E' },
  { emoji:'🎖️', name:'Defence Forces',     count:'487+',  color:'#1E3A5F' },
  { emoji:'🎓', name:'Teaching (TET/UGC)', count:'834+',  color:'#065F46' },
  { emoji:'💼', name:'MBA & Management',   count:'312+',  color:'#7C3AED' },
  { emoji:'📚', name:'School Boards',      count:'2,400+',color:'#0369A1' },
  { emoji:'🏛️', name:'State PSC',          count:'4,200+',color:'#065F46' },
  { emoji:'💰', name:'CA/CS/CMA',          count:'1,240+',color:'#92400E' },
  { emoji:'🔧', name:'ITI & Vocational',   count:'2,340+',color:'#0F2140' },
  { emoji:'🌿', name:'AYUSH & Health',     count:'180+',  color:'#0369A1' },
  { emoji:'✈️', name:'Aviation',           count:'120+',  color:'#7C3AED' },
]

export default function ExamCategories() {
  const navigate = useNavigate()
  return (
    <section className="py-16 reveal" style={{ background:'linear-gradient(180deg,#0F2140,#071428)' }}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="font-poppins font-bold text-white" style={{ fontSize:'clamp(26px,4vw,40px)' }}>
            Find Your Exam
          </h2>
          <p className="text-white/60 mt-2">75,000+ exam pathways across every category</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {CATS.map(cat => (
            <button key={cat.name} onClick={() => navigate('/login')}
              className="flex flex-col items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10
                hover:border-[#D4AF37]/60 rounded-2xl p-4 w-[140px] transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: cat.color }}>
                {cat.emoji}
              </div>
              <p className="text-white font-semibold text-xs text-center leading-tight">{cat.name}</p>
              <p className="text-[#D4AF37] text-xs font-semibold">{cat.count} series</p>
              <span className="text-[#D4AF37] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore →
              </span>
            </button>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => navigate('/login')} className="btn-gold px-8 py-3 rounded-2xl font-bold">
            Browse All 75,000+ Exams →
          </button>
        </div>
      </div>
    </section>
  )
}
```

// TARGET_FILE: src/components/landing/Pricing.jsx
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = ['Try First', 'Monthly', 'Family']

const PLANS = {
  'Try First': [
    { name:'Free',       price:0,    period:'forever',  pop:false, features:['10 tests/month','Basic leaderboard','3 free games'] },
    { name:'Trial Pass', price:19,   period:'24 hours', pop:true,  features:['Unlimited tests','All exams','All India rank','40+ languages'] },
    { name:'Exam Eve',   price:29,   period:'12 hours', pop:false, features:['Full access','Priority answers'] },
    { name:'Weekend',    price:39,   period:'2 days',   pop:false, features:['Full access','All features'] },
  ],
  'Monthly': [
    { name:'TryIT Plus', price:99,   period:'month',    pop:false, features:['Unlimited tests','5 exams','Basic analytics'] },
    { name:'TryIT Pro',  price:199,  period:'month',    pop:true,  features:['Everything in Plus','All games','Offline mode','40 languages','3× coins'] },
    { name:'Pro Max',    price:349,  period:'month',    pop:false, features:['Everything in Pro','Priority doubts','Advanced analytics'] },
    { name:'Annual',     price:1499, period:'year',     pop:false, features:['Full Pro for 1 year','Save ₹889 vs monthly'] },
  ],
  'Family': [
    { name:'Family Hub', price:349,  period:'month',    pop:true,  features:['5 member slots','Individual dashboards','Family leaderboard'] },
    { name:'Family Annual',price:2799,period:'year',    pop:false, features:['Family Hub for full year','Best value'] },
    { name:'Batch',      price:299,  period:'30 days',  pop:false, features:['5 friends','Shared exam access'] },
  ],
}

export default function Pricing() {
  const [tab, setTab] = useState('Monthly')
  const navigate = useNavigate()
  const plans = PLANS[tab] || []

  return (
    <section className="py-16 bg-slate-50 reveal">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="font-poppins font-bold text-[#1E3A5F]" style={{ fontSize:'clamp(26px,4vw,40px)' }}>
            💳 Start Free. Upgrade When Ready.
          </h2>
          <p className="text-slate-500 mt-2">From ₹19 for 24 hours to ₹1,499 for a full year.</p>
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all
                ${tab === t ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
              {t}
            </button>
          ))}
        </div>
        {/* BUG FIX: explicit ternary, not plans.length && */}
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-5 flex flex-col relative ${plan.pop ? 'clay-gold' : 'clay'}`}>
                {plan.pop && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E3A5F] text-[#D4AF37] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </span>
                )}
                <p className="font-bold text-lg text-[#1E3A5F] font-poppins">{plan.name}</p>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-extrabold font-poppins text-[#D4AF37]">
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-[#1E3A5F]/70">/{plan.period}</span>
                  )}
                </div>
                <ul className="flex-1 space-y-2 mb-4">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm text-[#1E3A5F] flex items-start gap-2">
                      <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/login')}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${plan.pop ? 'btn-navy' : 'btn-gold'}`}>
                  {plan.price === 0 ? 'Start Free' : 'Get Started →'}
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <p className="text-center text-slate-400 text-sm mt-6">All prices include GST · Cancel anytime</p>
      </div>
    </section>
  )
}
```

// TARGET_FILE: src/components/landing/Footer.jsx
```jsx
import Logo from '../Logo'

const LINKS = {
  Platform: ['About Us','How It Works','Pricing','Blog','Careers'],
  Students:  ['All Exams','Test Engine','Brain Games','Guru Hub','Leaderboard'],
  Partners:  ['Become a Mentor','Institute Partner','API Access','Affiliate'],
  Legal:     ['Privacy Policy','Terms of Service','Community Standards','Refund Policy'],
}

export default function Footer() {
  return (
    <footer className="bg-[#0F2140] pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-1">
            <Logo dark height={44} />
            <p className="text-[#D4AF37] italic text-sm mt-3">Your Exam. Your Rank. Your Success.</p>
            <p className="text-white/40 text-xs mt-3 leading-relaxed">
              India's most complete exam prep platform. 75,000+ pathways. 40+ languages.
            </p>
          </div>
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-white font-semibold mb-3 text-sm">{section}</p>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-white/50 hover:text-[#D4AF37] text-sm transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs">© 2026 TryIT Educations Pvt Ltd. All rights reserved.</p>
          <p className="text-white/40 text-xs italic">"Real platform. Real questions. Real ranks."</p>
        </div>
      </div>
    </footer>
  )
}
```

// TARGET_FILE: src/pages/Landing.jsx
```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import StatsStrip from '../components/landing/StatsStrip'
import ExamCategories from '../components/landing/ExamCategories'
import Pricing from '../components/landing/Pricing'
import Footer from '../components/landing/Footer'

export default function Landing() {
  useReveal()
  const navigate = useNavigate()
  const [scrollPct, setScrollPct] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setScrollPct(pct)
      setShowTop(el.scrollTop > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="font-inter">
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />
      <Hero />
      <StatsStrip />

      {/* Emotional wall */}
      <section className="py-16 reveal" style={{ background:'linear-gradient(135deg,#0F2140,#071428)' }}>
        <div className="max-w-4xl mx-auto px-5 text-center">
          <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-6 mb-6">
            <p className="text-white text-2xl font-bold font-poppins">
              "They can lock the gates. They can attack the building."
            </p>
            <p className="text-[#D4AF37] text-2xl font-bold font-poppins mt-2">
              "But they cannot touch your dream."
            </p>
          </div>
          <p className="text-white/70 text-lg">
            From Patna to Manipur, on a 2G network, at midnight —
            TryIT Educations exists for every student who refuses to give up.
          </p>
          <button onClick={() => navigate('/login')} className="btn-gold px-8 py-4 rounded-2xl font-bold text-lg mt-8">
            Start Free Now →
          </button>
        </div>
      </section>

      <ExamCategories />
      <Pricing />

      {/* Final CTA */}
      <section className="py-16 reveal" style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)' }}>
        <div className="max-w-xl mx-auto px-5 text-center">
          <h2 className="font-poppins font-bold text-white text-4xl mb-4">Ready to Start?</h2>
          <button onClick={() => navigate('/login')} className="btn-gold px-10 py-5 rounded-2xl font-bold text-xl">
            Start Free Now →
          </button>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {['🔒 Secure','💳 No Credit Card','🌐 40+ Languages','🏆 Real Rankings'].map(t => (
              <span key={t} className="text-white/60 text-sm">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Scroll to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-5 w-12 h-12 btn-gold rounded-full flex items-center justify-center shadow-lg z-30 text-xl">
          ↑
        </button>
      )}
    </div>
  )
}
```
// TARGET_FILE: src/pages/Splash.jsx
```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Particles from '../components/Particles'

export default function Splash() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/landing'), 2400)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#1E3A5F,#0F2140,#071428)' }}>
      <Particles count={28} />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-[#D4AF37]/10 pointer-events-none" />
      <div className="absolute w-[650px] h-[650px] rounded-full border border-[#D4AF37]/05 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="animate-float">
          <Logo dark height={88} />
        </div>
        <p className="text-[#D4AF37] text-lg italic font-inter animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Your Exam. Your Rank. Your Success.
        </p>
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="3.5" />
            <circle cx="26" cy="26" r="20" fill="none" stroke="#D4AF37" strokeWidth="3.5"
              strokeDasharray="36 90" className="animate-spin-slow" style={{ transformOrigin: 'center' }} />
          </svg>
        </div>
        <p className="text-white/40 text-sm animate-slide-up" style={{ animationDelay: '0.9s' }}>
          Loading your journey…
        </p>
      </div>
    </div>
  )
}
```

// TARGET_FILE: src/pages/Login.jsx
```jsx
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
```

// TARGET_FILE: src/pages/Onboarding.jsx
```jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ChevronLeft } from 'lucide-react'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Puducherry','Chandigarh','Other']
const NE = new Set(['Arunachal Pradesh','Assam','Manipur','Meghalaya','Mizoram','Nagaland','Sikkim','Tripura'])
const CATS = ['General','OBC','SC','ST','EWS','PwD']
const EXAMS = ['SSC CGL','SSC CHSL','SSC MTS','SSC GD','IBPS PO','IBPS Clerk','SBI PO','SBI Clerk','RRB NTPC','RRB Group D','UPSC CSE','NEET UG','JEE Main','JEE Advanced','BITSAT','GATE CS','GATE EC','GATE ME','CLAT','CA Foundation','NDA','CDS','Agniveer Army GD','CTET Paper 1','CTET Paper 2','UGC NET','RBI Grade B']
const LANGS = ['Tamil','Hindi','Telugu','Kannada','Malayalam','Marathi','Bengali','Gujarati','Punjabi','Odia','Assamese','Mizo']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const TOTAL = 7

export default function Onboarding() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name:'', day:'', month:'', year:'', category:'', state:'', city:'', exams:[], languages:[] })
  const [examSearch, setExamSearch] = useState('')
  const [done, setDone] = useState(false)
  const [confetti, setConfetti] = useState([])

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const canNext = useMemo(() => {
    if (step === 1) return form.name.trim().length >= 2
    if (step === 2) return !!(form.day && form.month && form.year)
    if (step === 3) return !!form.category
    if (step === 4) return !!form.state
    if (step === 6) return form.exams.length >= 1
    return true
  }, [step, form])

  const filteredExams = useMemo(() =>
    examSearch.trim()
      ? EXAMS.filter(e => e.toLowerCase().includes(examSearch.toLowerCase()))
      : EXAMS
  , [examSearch])

  const toggleExam = (e) => {
    if (form.exams.includes(e)) upd('exams', form.exams.filter(x => x !== e))
    else if (form.exams.length < 5) upd('exams', [...form.exams, e])
  }

  const toggleLang = (l) => {
    if (form.languages.includes(l)) upd('languages', form.languages.filter(x => x !== l))
    else if (form.languages.length < 3) upd('languages', [...form.languages, l])
  }

  const complete = () => {
    setConfetti(Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: i % 2 === 0 ? '#D4AF37' : '#1E3A5F',
      dur: Math.random() * 1.5 + 1.5,
      delay: Math.random() * 0.5,
    })))
    setDone(true)
    login()
    setTimeout(() => navigate('/dashboard'), 2800)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1E3A5F,#0F2140)' }}>
        {confetti.map(p => (
          <div key={p.id} className="absolute w-3 h-3 rounded-sm pointer-events-none"
            style={{ backgroundColor: p.color, left: `${p.x}%`, top: '-20px',
              animation: `confettiFall ${p.dur}s ease ${p.delay}s forwards` }} />
        ))}
        <div className="glass rounded-3xl p-10 text-center z-10 animate-bounce-in max-w-sm mx-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#1E3A5F] font-poppins">Welcome to TryIT!</h2>
          <p className="text-slate-600 mt-2">Your journey begins now, {form.name.split(' ')[0]}!</p>
          <div className="mt-4 clay-gold rounded-2xl p-4">
            <p className="text-[#1E3A5F] font-bold">🎁 200 bonus coins added!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1.5 bg-slate-200">
          <div className="h-1.5 bg-[#D4AF37] transition-all duration-500"
            style={{ width: `${(step / TOTAL) * 100}%` }} />
        </div>
      </div>

      {/* Step dots */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {Array.from({ length: TOTAL }, (_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i + 1 === step ? 'bg-[#D4AF37] w-6' : i + 1 < step ? 'bg-[#1E3A5F] w-2' : 'bg-slate-300 w-2'}`} />
        ))}
      </div>

      {/* Back button */}
      {step > 1 && (
        <button onClick={() => setStep(s => s - 1)}
          className="fixed top-8 left-5 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
      )}

      <div className="flex-1 flex items-center justify-center px-5 pt-20 pb-10">
        <div className="w-full max-w-md">

          {/* Step 1 — Name */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">What should we call you? 👋</h2>
              <p className="text-slate-500 mb-6">Your name on your TryIT profile.</p>
              <input value={form.name} onChange={e => upd('name', e.target.value)}
                placeholder="Your full name" className="clay-input text-xl" />
            </div>
          )}

          {/* Step 2 — DOB */}
          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Date of birth? 🎂</h2>
              <p className="text-slate-500 mb-6">For age-appropriate exam suggestions.</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1E3A5F] mb-1 block">Day</label>
                  <select value={form.day} onChange={e => upd('day', e.target.value)} className="clay-input">
                    <option value="">DD</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1E3A5F] mb-1 block">Month</label>
                  <select value={form.month} onChange={e => upd('month', e.target.value)} className="clay-input">
                    <option value="">MM</option>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1E3A5F] mb-1 block">Year</label>
                  <select value={form.year} onChange={e => upd('year', e.target.value)} className="clay-input">
                    <option value="">YYYY</option>
                    {Array.from({ length: 50 }, (_, i) => 2024 - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Category */}
          {step === 3 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Your exam category? 📋</h2>
              <p className="text-slate-500 mb-6">For accurate cut-off comparisons.</p>
              <div className="grid grid-cols-3 gap-3">
                {CATS.map(c => (
                  <button key={c} onClick={() => upd('category', c)}
                    className={`py-4 rounded-2xl font-bold transition-all ${form.category === c ? 'clay-gold text-[#1E3A5F]' : 'clay text-slate-700'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — State */}
          {step === 4 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Which state? 🗺️</h2>
              <div className="glass-gold rounded-2xl px-4 py-3 mb-4 text-sm text-[#1E3A5F]">
                🌟 Northeast India students — we fully support all state exams and languages!
              </div>
              <div className="max-h-64 overflow-y-auto flex flex-wrap gap-2 scrollbar-hide">
                {STATES.map(s => (
                  <button key={s} onClick={() => upd('state', s)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                      ${form.state === s ? 'bg-[#1E3A5F] text-white'
                      : `bg-white border-2 ${NE.has(s) ? 'border-[#D4AF37]/50' : 'border-slate-200'} text-slate-700 hover:border-[#1E3A5F]`}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — City */}
          {step === 5 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">City or district? 🏙️</h2>
              <p className="text-slate-500 mb-6">Optional — used for local leaderboard.</p>
              <input value={form.city} onChange={e => upd('city', e.target.value)}
                placeholder="e.g. Coimbatore (optional)" className="clay-input" />
            </div>
          )}

          {/* Step 6 — Exams */}
          {step === 6 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Which exams? 🎯</h2>
              <p className="text-slate-500 mb-3">Pick up to 5. First choice = primary exam.</p>
              {form.exams.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.exams.map((e, i) => (
                    <span key={e} className="flex items-center gap-1.5 bg-[#1E3A5F] text-white px-3 py-1.5 rounded-xl text-sm font-semibold">
                      {i === 0 && <span className="text-[#D4AF37]">★</span>}{e}
                      <button onClick={() => toggleExam(e)} className="text-white/60 hover:text-white ml-1">×</button>
                    </span>
                  ))}
                </div>
              ) : null}
              <input value={examSearch} onChange={e => setExamSearch(e.target.value)}
                placeholder="Search exams…" className="clay-input mb-3" />
              <div className="max-h-52 overflow-y-auto flex flex-col gap-1 scrollbar-hide">
                {filteredExams.map(e => (
                  <button key={e} onClick={() => toggleExam(e)}
                    disabled={form.exams.length >= 5 && !form.exams.includes(e)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${form.exams.includes(e) ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-[#D4AF37] disabled:opacity-40'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7 — Language */}
          {step === 7 && (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">Study language? 🌐</h2>
              <p className="text-slate-500 mb-3">English always included. Add up to 3 more.</p>
              <div className="clay rounded-2xl p-3 mb-4 flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <span className="font-semibold text-[#1E3A5F]">English — Always Included</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGS.map(l => (
                  <button key={l} onClick={() => toggleLang(l)}
                    disabled={form.languages.length >= 3 && !form.languages.includes(l)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                      ${form.languages.includes(l) ? 'bg-[#1E3A5F] text-white' : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-[#1E3A5F] disabled:opacity-40'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nav button */}
          <div className="mt-8">
            {step < TOTAL ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext}
                className="btn-gold w-full py-4 rounded-2xl font-bold text-lg">
                Next →
              </button>
            ) : (
              <button onClick={complete} className="btn-gold w-full py-4 rounded-2xl font-bold text-lg">
                Complete Setup 🚀
              </button>
            )}
          </div>
          <p className="text-center text-slate-400 text-xs mt-3">Step {step} of {TOTAL}</p>
        </div>
      </div>
    </div>
  )
}
```
// TARGET_FILE: src/components/dashboard/ExamReadinessWidget.jsx
```jsx
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function Ring({ exam, delay }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)
  const r = 48, circ = 2 * Math.PI * r
  const color = exam.readiness >= 70 ? '#22C55E' : exam.readiness >= 40 ? '#D4AF37' : '#EF4444'

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={animated ? circ * (1 - exam.readiness / 100) : circ}
            style={{ transition: `stroke-dashoffset 1.5s ease ${delay * 0.2}s` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-xl text-[#1E3A5F] font-poppins">{exam.readiness}%</span>
          <span className="text-xs text-slate-500">Ready</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-[#1E3A5F] text-center leading-tight">{exam.name}</p>
      <p className="text-xs text-slate-500">{exam.examDate}</p>
    </div>
  )
}

export default function ExamReadinessWidget() {
  const { user } = useAuth()
  return (
    <div className="clay rounded-3xl p-6 col-span-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins">🎯 Exam Readiness</h3>
        <span className="glass-gold px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1E3A5F]">
          Predicted: 145–162 / 200 · ON TRACK ✅
        </span>
      </div>
      <div className="flex flex-wrap justify-around gap-6">
        {user.exams.slice(0, 3).map((exam, i) => (
          <Ring key={exam.id} exam={exam} delay={i} />
        ))}
      </div>
    </div>
  )
}
```

// TARGET_FILE: src/components/dashboard/StreakWidget.jsx
```jsx
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function StreakWidget() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const days = ['M','T','W','T','F','S','S']

  return (
    <div className="clay rounded-3xl p-6">
      <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins mb-4">🔥 Study Streak</h3>
      <div className="flex flex-col items-center gap-2 mb-5">
        <span className="text-6xl font-extrabold text-[#D4AF37] font-poppins leading-none">{user.streak}</span>
        <p className="text-slate-500 text-sm">consecutive days</p>
      </div>
      <div className="flex gap-1.5 justify-between mb-4">
        {days.map((d, i) => {
          const done = i <= todayIdx
          const today = i === todayIdx
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all
                ${today ? 'bg-[#1E3A5F] text-white ring-2 ring-[#D4AF37]' : done ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-slate-100 text-slate-400'}`}>
                {done && !today ? '✓' : d}
              </div>
              <span className="text-xs text-slate-400">{d}</span>
            </div>
          )
        })}
      </div>
      <button onClick={() => showToast('info', `Streak freeze used! ${user.streakFreezes - 1} left.`)}
        className="w-full text-center text-sm font-semibold text-[#D4AF37] hover:underline">
        ❄️ Use Streak Freeze ({user.streakFreezes} left)
      </button>
    </div>
  )
}
```

// TARGET_FILE: src/components/dashboard/CoinsWidget.jsx
```jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const EARNINGS = [
  { source: 'Math Blitz game',    amount: +15, icon: '🎮' },
  { source: 'Daily Quiz bonus',   amount: +50, icon: '📅' },
  { source: 'Guru Hub answer',    amount: +5,  icon: '🎓' },
]

export default function CoinsWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const weekProg = 340, weekTarget = 500

  return (
    <div className="clay-gold rounded-3xl p-6">
      <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins mb-3">🪙 Coins</h3>
      <div className="flex flex-col items-center gap-1 mb-4">
        <span className="text-5xl font-extrabold text-[#1E3A5F] font-poppins">{user.coins.toLocaleString()}</span>
        {user.isPro && (
          <span className="clay-dark text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full">⚡ 3× PRO MULTIPLIER</span>
        )}
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#1E3A5F]/70 mb-1">
          <span>This week</span><span>{weekProg}/{weekTarget}</span>
        </div>
        <div className="w-full bg-[#1E3A5F]/20 rounded-full h-2.5">
          <div className="bg-[#1E3A5F] h-2.5 rounded-full" style={{ width: `${(weekProg / weekTarget) * 100}%` }} />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {EARNINGS.map((e, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-[#1E3A5F]/80">{e.icon} {e.source}</span>
            <span className="font-bold text-green-700">+{e.amount}🪙</span>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/wallet')} className="btn-navy w-full py-2.5 rounded-xl font-bold text-sm">
        View Wallet →
      </button>
    </div>
  )
}
```

// TARGET_FILE: src/components/dashboard/QuickTestWidget.jsx
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TYPES = ['Practice','Mock','Speed']
const SUBJECTS = ['All','Maths','Reasoning','English','GK','Science']

export default function QuickTestWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [type, setType] = useState('Practice')
  const [subj, setSubj] = useState('All')

  return (
    <div className="clay-dark rounded-3xl p-6">
      <h3 className="font-bold text-white text-lg font-poppins mb-1">⚡ Quick Test</h3>
      <p className="text-white/60 text-sm mb-4">{user.exams[0]?.name}</p>
      <div className="flex gap-2 mb-3 flex-wrap">
        {TYPES.map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
              ${type === t ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
        {SUBJECTS.map(s => (
          <button key={s} onClick={() => setSubj(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all
              ${subj === s ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={() => navigate('/test-engine')} className="btn-gold w-full py-3.5 rounded-2xl font-bold text-base">
        Start Test Now →
      </button>
      <p className="text-white/40 text-xs text-center mt-3">Last: Reasoning · 8/10 · 78%</p>
    </div>
  )
}
```

// TARGET_FILE: src/components/dashboard/SubjectBarsWidget.jsx
```jsx
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function SubjectBarsWidget() {
  const { user } = useAuth()
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const weakest = [...user.subjects].sort((a, b) => a.accuracy - b.accuracy)[0]

  return (
    <div ref={ref} className="clay rounded-3xl p-6 sm:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins">📊 Subject Accuracy</h3>
        <span className="text-xs text-slate-500">This month</span>
      </div>
      <div className="flex flex-col gap-3">
        {user.subjects.map(sub => {
          const color = sub.accuracy >= 80 ? 'bg-green-500' : sub.accuracy >= 70 ? 'bg-[#D4AF37]' : 'bg-amber-500'
          return (
            <div key={sub.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">{sub.emoji} {sub.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${sub.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {sub.trend === 'up' ? '↑' : '↓'}
                  </span>
                  <span className="text-sm font-bold text-[#1E3A5F]">{sub.accuracy}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className={`h-3 rounded-full ${color} transition-all duration-1000 ease-out`}
                  style={{ width: animated ? `${sub.accuracy}%` : '0%' }} />
              </div>
            </div>
          )
        })}
      </div>
      {weakest && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Weakest: <span className="font-semibold text-red-500">{weakest.name}</span></p>
          <button className="text-[#D4AF37] text-sm font-semibold hover:underline">Practice {weakest.name} →</button>
        </div>
      )}
    </div>
  )
}
```

// TARGET_FILE: src/components/dashboard/ScoreTrendWidget.jsx
```jsx
const DATA = [45,62,58,71,68,78,74,82,79,84]

export default function ScoreTrendWidget() {
  const W = 280, H = 110, px = 16, py = 12
  const iW = W - px * 2, iH = H - py * 2
  const min = Math.min(...DATA), max = Math.max(...DATA), rng = max - min || 1
  const pts = DATA.map((v, i) => ({
    x: px + (i / (DATA.length - 1)) * iW,
    y: py + iH - ((v - min) / rng) * iH,
  }))
  const poly = pts.map(p => `${p.x},${p.y}`).join(' ')
  const last = pts[pts.length - 1]
  const avg = Math.round(DATA.reduce((a, b) => a + b, 0) / DATA.length)
  const best = Math.max(...DATA)
  const trend = DATA[DATA.length - 1] - DATA[DATA.length - 2]

  return (
    <div className="clay rounded-3xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins">📈 Score Trend</h3>
        <span className="text-xs text-slate-500">Last 30 days</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1={px} y1={py + iH * (1 - f)} x2={W - px} y2={py + iH * (1 - f)}
            stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,4" />
        ))}
        <polyline points={poly} fill="none" stroke="#1E3A5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 2.5}
            fill={i === pts.length - 1 ? '#D4AF37' : '#1E3A5F'} />
        ))}
        <text x={last.x} y={last.y - 10} textAnchor="middle" fill="#D4AF37" fontSize="11" fontWeight="bold">
          {DATA[DATA.length - 1]}%
        </text>
      </svg>
      <div className="flex justify-around mt-3 pt-3 border-t border-slate-100">
        {[['Avg', `${avg}%`], ['Best', `${best}%`], ['Trend', `${trend > 0 ? '+' : ''}${trend}%`]].map(([l, v]) => (
          <div key={l} className="text-center">
            <p className="text-lg font-bold text-[#D4AF37] font-poppins">{v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

// TARGET_FILE: src/components/dashboard/LeaderboardWidget.jsx
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TOP3 = [
  { name: 'Priya S.',  state: 'Chennai', score: '97.4%' },
  { name: 'Rahul K.',  state: 'Delhi',   score: '94.8%' },
  { name: 'Aisha M.',  state: 'Gujarat', score: '93.1%' },
]
const FILTERS = ['All India','State','City','Friends']

export default function LeaderboardWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All India')

  return (
    <div className="clay-dark rounded-3xl p-6">
      <h3 className="font-bold text-white text-lg font-poppins mb-3">🏆 Leaderboard</h3>
      <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-hide">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all
              ${filter === f ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="text-center mb-4">
        <p className="text-5xl font-extrabold text-[#D4AF37] font-poppins leading-none">#{user.rank.toLocaleString()}</p>
        <p className="text-white/60 text-sm mt-1">{filter}</p>
        <p className="text-white/40 text-xs mt-1">TN: #127 · Coimbatore: #8</p>
      </div>
      <div className="space-y-2 mb-3">
        {TOP3.map((r, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
            <span className="text-lg">{['🥇','🥈','🥉'][i]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{r.name}</p>
              <p className="text-white/40 text-xs">{r.state}</p>
            </div>
            <span className="text-[#D4AF37] text-sm font-bold">{r.score}</span>
          </div>
        ))}
      </div>
      <p className="text-green-400 text-xs font-semibold text-center mb-3">↑ Moved up 142 positions this week</p>
      <button onClick={() => navigate('/leaderboard')} className="text-[#D4AF37] text-sm font-semibold hover:underline w-full text-center">
        See Full Leaderboard →
      </button>
    </div>
  )
}
```

// TARGET_FILE: src/components/dashboard/DailyQuizWidget.jsx
```jsx
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

export default function DailyQuizWidget() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <div className="clay rounded-3xl p-6">
      <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins mb-2">📅 Daily Quiz</h3>
      <p className="text-slate-500 text-sm mb-3">Today · 5 Questions · Current Affairs Focus</p>
      <div className="w-full bg-[#D4AF37]/20 rounded-full h-2 mb-3 overflow-hidden">
        <div className="bg-[#D4AF37] h-2 rounded-full w-full animate-pulse" />
      </div>
      <p className="text-xs text-slate-400 mb-4">Complete before midnight for bonus coins!</p>
      <button onClick={() => { navigate('/daily-quiz'); showToast('info', 'Daily Quiz started!') }}
        className="btn-gold w-full py-3.5 rounded-2xl font-bold text-base">
        Start Daily Quiz →
      </button>
      <p className="text-center text-xs text-green-600 font-semibold mt-2">+50 🪙 bonus waiting!</p>
    </div>
  )
}
```

// TARGET_FILE: src/components/dashboard/RecentActivityWidget.jsx
```jsx
const ACTIVITIES = [
  { dot:'bg-green-500', action:'Completed SSC CGL Mock Test',  detail:'Score: 142/200 · Rank improved ↑47',  time:'2h ago'    },
  { dot:'bg-[#D4AF37]', action:'7-Day Streak Badge Unlocked 🔥',detail:'Congratulations! Keep going',         time:'Yesterday' },
  { dot:'bg-blue-500',  action:'Answered doubt in Guru Hub',   detail:'+5 Guru Points · ⭐4.8 rating',        time:'Yesterday' },
  { dot:'bg-green-500', action:'Completed Daily Quiz',         detail:'4/5 correct · +50 coins',              time:'2 days ago'},
  { dot:'bg-[#D4AF37]', action:'Reached Level 4 — Gold Miner', detail:'6,000 XP milestone reached',           time:'3 days ago'},
  { dot:'bg-blue-500',  action:'Joined Hall: IIT Chasers',     detail:'8 members · 7-day group streak',       time:'4 days ago'},
]

export default function RecentActivityWidget() {
  return (
    <div className="clay rounded-3xl p-6 col-span-full">
      <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins mb-4">🕐 Recent Activity</h3>
      <div className="relative">
        <div className="absolute left-[9px] top-0 bottom-0 w-px bg-slate-200" />
        <div className="flex flex-col">
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex gap-4 pb-4">
              <div className="relative z-10 flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded-full ${a.dot} ring-2 ring-white`} />
              </div>
              <div className="flex-1 min-w-0 pb-2 border-b border-slate-50 last:border-0">
                <p className="font-semibold text-slate-800 text-sm">{a.action}</p>
                <p className="text-slate-500 text-xs mt-0.5">{a.detail}</p>
                <p className="text-slate-400 text-xs mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

// TARGET_FILE: src/pages/Dashboard.jsx
```jsx
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import ExamReadinessWidget   from '../components/dashboard/ExamReadinessWidget'
import StreakWidget           from '../components/dashboard/StreakWidget'
import CoinsWidget            from '../components/dashboard/CoinsWidget'
import QuickTestWidget        from '../components/dashboard/QuickTestWidget'
import DailyQuizWidget        from '../components/dashboard/DailyQuizWidget'
import SubjectBarsWidget      from '../components/dashboard/SubjectBarsWidget'
import ScoreTrendWidget       from '../components/dashboard/ScoreTrendWidget'
import LeaderboardWidget      from '../components/dashboard/LeaderboardWidget'
import RecentActivityWidget   from '../components/dashboard/RecentActivityWidget'

export default function Dashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] font-poppins">
          {greeting}, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Preparing for{' '}
          <span className="font-semibold text-[#1E3A5F]">{user.exams[0]?.name}</span>
          {user.exams[0]?.examDate ? ` · Exam: ${user.exams[0].examDate}` : ''}
          {' '}· {user.exams[0]?.readiness}% ready
        </p>
        {/* Exam switcher chips */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {user.exams.map((e, i) => (
            <button key={e.id}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all
                ${i === 0 ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
              {e.name}
            </button>
          ))}
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <ExamReadinessWidget />
        <StreakWidget />
        <CoinsWidget />
        <DailyQuizWidget />
        <QuickTestWidget />
        <ScoreTrendWidget />
        <SubjectBarsWidget />
        <LeaderboardWidget />
        <RecentActivityWidget />
      </div>
    </AppLayout>
  )
}
```
// TARGET_FILE: src/pages/Profile.jsx
```jsx
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Download } from 'lucide-react'

const STAT_CELLS = [
  { key:'testsCompleted', label:'Tests Taken',     icon:'📝'              },
  { key:'avgScore',       label:'Avg Score',        icon:'📊', suffix:'%'  },
  { key:'rank',           label:'All India Rank',   icon:'🏆', prefix:'#'  },
  { key:'streak',         label:'Day Streak',       icon:'🔥'              },
  { key:'coins',          label:'Total Coins',      icon:'🪙'              },
  { key:'guruPoints',     label:'Guru Points',      icon:'🎓'              },
  { key:'studyHours',     label:'Study Time',       icon:'⏱️'              },
  { key:'xp',             label:'XP Earned',        icon:'⭐'              },
]

export default function Profile() {
  const { user } = useAuth()
  const { showToast } = useToast()

  return (
    <AppLayout>
      {/* Hero */}
      <div className="clay-dark rounded-3xl p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-extrabold text-3xl flex items-center justify-center ring-4 ring-white/20 flex-shrink-0">
          {user.initials}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-white font-poppins">{user.name}</h1>
          <p className="text-[#D4AF37] mt-1">{user.levelEmoji} Level {user.level} — {user.levelTitle}</p>
          <p className="text-white/60 text-sm mt-1">📍 {user.city}, {user.state}</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            {user.isPro && <span className="clay-gold text-[#1E3A5F] text-xs font-bold px-3 py-1 rounded-full">⚡ PRO MEMBER</span>}
            <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">Joined {user.joinDate}</span>
            <span className="bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full font-mono">{user.userId}</span>
          </div>
          <button onClick={() => showToast('success','Profile card downloaded!')}
            className="mt-4 flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-colors">
            <Download size={16} /> Download Pro Card
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {STAT_CELLS.map(s => (
          <div key={s.key} className="clay rounded-2xl p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-[#D4AF37] font-poppins">
              {s.prefix || ''}{typeof user[s.key] === 'number' ? user[s.key].toLocaleString() : user[s.key]}{s.suffix || ''}
            </p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Exams */}
      <div className="clay rounded-3xl p-6">
        <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">My Exam Progress</h2>
        <div className="flex flex-col gap-4">
          {user.exams.map(exam => {
            const color = exam.readiness >= 70 ? 'bg-green-500' : exam.readiness >= 40 ? 'bg-[#D4AF37]' : 'bg-amber-500'
            return (
              <div key={exam.id}>
                <div className="flex justify-between mb-1.5">
                  <p className="font-semibold text-[#1E3A5F]">{exam.name}</p>
                  <p className="font-bold text-[#D4AF37]">{exam.readiness}% ready</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className={`h-3 rounded-full ${color} transition-all duration-1000`}
                    style={{ width: `${exam.readiness}%` }} />
                </div>
                {exam.examDate && <p className="text-xs text-slate-400 mt-1">Exam date: {exam.examDate}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
```

// TARGET_FILE: src/pages/Settings.jsx
```jsx
import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'

const TABS = ['Account','Notifications','Language','Theme','Privacy','About']
const NOTIFS = ['Daily Quiz reminder','Streak alerts','Scholarship deadlines','Hall activity','Guru Hub replies','Tournament invites','Badge unlocked','Weekly report']
const LANGS = ['Tamil','Hindi','Telugu','Kannada','Malayalam','Marathi','Bengali','Gujarati','Punjabi','Odia']

const THEME_PREVIEWS = {
  'classic-navy':  { sidebar:'#1E3A5F', accent:'#D4AF37', bg:'#F8FAFC', label:'Classic Navy'  },
  'midnight-dark': { sidebar:'#0F2140', accent:'#D4AF37', bg:'#0A0F1E', label:'Midnight Dark' },
  'forest-green':  { sidebar:'#065F46', accent:'#D4AF37', bg:'#F0FDF4', label:'Forest Green'  },
  'royal-purple':  { sidebar:'#4C1D95', accent:'#D4AF37', bg:'#FAF5FF', label:'Royal Purple'  },
}

export default function Settings() {
  const { user } = useAuth()
  const { activeTheme, setActiveTheme } = useTheme()
  const { showToast } = useToast()
  const [tab, setTab] = useState('Account')
  const [name, setName] = useState(user.name)
  const [notifs, setNotifs] = useState(() => Object.fromEntries(NOTIFS.map(t => [t, true])))
  const toggleNotif = (t) => setNotifs(p => ({ ...p, [t]: !p[t] }))

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-6">⚙️ Settings</h1>
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar tabs */}
        <div className="clay rounded-3xl p-3 lg:w-48 flex lg:flex-col gap-1 overflow-x-auto scrollbar-hide flex-shrink-0">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap text-left transition-all
                ${tab === t ? 'bg-[#1E3A5F] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="clay rounded-3xl p-6 flex-1">

          {tab === 'Account' && (
            <div className="space-y-5">
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins">Account Details</h2>
              <div>
                <label className="block text-sm font-semibold text-[#1E3A5F] mb-2">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="clay-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1E3A5F] mb-2">Email Address</label>
                <input value={user.email} readOnly className="clay-input opacity-60 cursor-not-allowed" />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
              </div>
              <button onClick={() => showToast('success','Profile saved!')} className="btn-gold px-8 py-3 rounded-2xl font-bold">
                Save Changes
              </button>
            </div>
          )}

          {tab === 'Theme' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">Choose Theme</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(THEME_PREVIEWS).map(([key, t]) => (
                  <button key={key}
                    onClick={() => { setActiveTheme(key); showToast('success', `${t.label} applied!`) }}
                    className={`rounded-2xl overflow-hidden border-4 transition-all
                      ${activeTheme === key ? 'border-[#D4AF37] scale-105' : 'border-transparent hover:border-slate-300'}`}>
                    <div className="flex" style={{ height: 64 }}>
                      <div style={{ width: 20, backgroundColor: t.sidebar }} className="flex-shrink-0" />
                      <div style={{ backgroundColor: t.bg }} className="flex-1 flex flex-col justify-between p-2">
                        <div className="h-2 rounded" style={{ backgroundColor: t.accent, width: '60%' }} />
                        <div className="space-y-1">
                          {[80, 60, 40].map((w, i) => (
                            <div key={i} className="h-1.5 rounded bg-slate-300" style={{ width: `${w}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-700">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'Notifications' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">Notifications</h2>
              <div className="space-y-3">
                {NOTIFS.map(t => (
                  <div key={t} className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-700 text-sm font-medium">{t}</span>
                    <button onClick={() => toggleNotif(t)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifs[t] ? 'bg-[#D4AF37]' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notifs[t] ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Language' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">Study Languages</h2>
              <div className="clay rounded-2xl p-3 mb-4 flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <span className="font-semibold text-[#1E3A5F]">English — Always Included</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">Add up to 3 regional languages.</p>
              <div className="flex flex-wrap gap-2">
                {LANGS.map(l => (
                  <button key={l} onClick={() => showToast('success', `${l} added!`)}
                    className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-[#D4AF37] transition-colors">
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'Privacy' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">Privacy & Security</h2>
              <div className="glass-gold rounded-2xl p-4 mb-5">
                <p className="text-sm font-semibold text-[#1E3A5F] mb-1">🔒 Parent Connect Code</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-bold font-mono text-[#1E3A5F] tracking-widest">472918</span>
                  <button onClick={() => showToast('success','Code copied!')}
                    className="text-sm text-[#1E3A5F] font-semibold hover:underline">Copy</button>
                </div>
                <p className="text-xs text-[#1E3A5F]/70 mt-2">Share with your parent to connect their view.</p>
              </div>
              <button onClick={() => showToast('error','Account deletion requested. Takes 30 days.')}
                className="border-2 border-red-300 text-red-500 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          )}

          {tab === 'About' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">About TryIT Educations</h2>
              <p className="text-slate-500 text-sm mb-2">Version 1.0.0 · June 2026</p>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                India's most complete exam preparation platform. 75,000+ exam pathways,
                40+ languages, real All-India rankings after every test.
              </p>
              <div className="space-y-2">
                {['Privacy Policy','Terms of Service','Community Standards','Contact Support'].map(l => (
                  <a key={l} href="#" className="block text-[#D4AF37] text-sm font-semibold hover:underline">{l} →</a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  )
}
```
// TARGET_FILE: src/pages/test-engine/TestLauncher.jsx
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const TEST_TYPES = [
  { id:'practice', label:'📝 Practice',    desc:'Learn at your own pace',    badge:'FREE',      bc:'bg-green-100 text-green-700' },
  { id:'mock',     label:'⏱️ Mock Test',   desc:'Simulate real exam',        badge:'Most Used', bc:'bg-blue-100 text-blue-700'  },
  { id:'speed',    label:'🏃 Speed Drill', desc:'20 Q · 10 min challenge',   badge:'FREE',      bc:'bg-green-100 text-green-700' },
  { id:'custom',   label:'🎯 Custom',      desc:'You choose everything',      badge:'PRO',       bc:'bg-[#D4AF37]/20 text-[#1E3A5F]'},
]
const SUBJECTS = ['All Subjects','Maths','Reasoning','English','GK','Science']
const TIMES    = ['No Limit','30s / Q','45s / Q','60s / Q','90s / Q']
const RECENT   = [
  { exam:'SSC CGL', type:'Mock',        score:'142/200', duration:'26:34', rank:'#1,243',  date:'2 hours ago'  },
  { exam:'SSC CGL', type:'Practice',    score:'8/10',    duration:'9:12',  rank:'—',       date:'Yesterday'    },
  { exam:'IBPS PO', type:'Speed Drill', score:'15/20',   duration:'10:00', rank:'—',       date:'2 days ago'   },
]

export default function TestLauncher() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selType, setSelType] = useState('practice')
  const [subj,    setSubj]    = useState('All Subjects')
  const [qCount,  setQCount]  = useState(25)
  const [timing,  setTiming]  = useState('60s / Q')

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">

        {/* Active exam banner */}
        <div className="glass-gold rounded-2xl px-5 py-3 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#1E3A5F]/60 font-semibold uppercase tracking-wide">Currently preparing</p>
            <p className="text-[#1E3A5F] font-bold text-lg">{user.exams[0]?.name}</p>
          </div>
          <button className="text-[#1E3A5F] text-sm font-semibold hover:underline">Switch exam →</button>
        </div>

        {/* Test type grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {TEST_TYPES.map(t => (
            <button key={t.id} onClick={() => setSelType(t.id)}
              className={`clay rounded-2xl p-5 text-left transition-all hover:-translate-y-1 ${selType === t.id ? 'ring-2 ring-[#D4AF37] -translate-y-1' : ''}`}>
              <p className="text-2xl mb-2">{t.label.split(' ')[0]}</p>
              <p className="font-bold text-[#1E3A5F] text-sm font-poppins">{t.label.slice(3)}</p>
              <p className="text-slate-500 text-xs mt-1">{t.desc}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mt-2 ${t.bc}`}>{t.badge}</span>
            </button>
          ))}
        </div>

        {/* Settings */}
        <div className="clay rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-[#1E3A5F] mb-4 font-poppins">Quick Settings</h3>
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-600 mb-2">Subject</p>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => setSubj(s)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${subj === s ? 'bg-[#1E3A5F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-600">Questions</p>
              <span className="text-2xl font-bold text-[#D4AF37] font-poppins w-10 text-center">{qCount}</span>
            </div>
            <input type="range" min={5} max={100} step={5} value={qCount}
              onChange={e => setQCount(+e.target.value)}
              className="w-full accent-[#D4AF37]" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>5</span><span>100</span></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-2">Time per Question</p>
            <div className="flex flex-wrap gap-2">
              {TIMES.map(t => (
                <button key={t} onClick={() => setTiming(t)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${timing === t ? 'bg-[#1E3A5F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/test-engine/active', { state: { type: selType, subject: subj, count: qCount, time: timing } })}
          className="btn-gold w-full py-5 rounded-2xl font-bold text-xl mb-6">
          Start Test Now →
        </button>

        {/* Recent tests */}
        <div className="clay rounded-3xl overflow-hidden">
          <div className="bg-[#1E3A5F] px-5 py-3">
            <p className="text-white font-bold font-poppins">Recent Tests</p>
          </div>
          {RECENT.map((r, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 last:border-0">
              <div>
                <p className="font-semibold text-[#1E3A5F] text-sm">{r.exam} · {r.type}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#D4AF37] text-sm">{r.score}</p>
                <p className="text-xs text-slate-500">{r.duration} · {r.rank}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
```

// TARGET_FILE: src/pages/test-engine/ActiveTest.jsx
```jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'

const QUESTIONS = [
  { id:1, subject:'Reasoning', text:'A train 200m long passes a 300m platform in 25 seconds. Speed in km/hr?', opts:['72 km/hr','64 km/hr','80 km/hr','56 km/hr'], correct:0, explanation:'Total = 200+300 = 500m. Speed = 500/25 = 20 m/s = 20×18/5 = 72 km/hr.' },
  { id:2, subject:'Maths',    text:'If 15% of X = 45, find X.', opts:['280','300','320','340'], correct:1, explanation:'X = 45 × 100/15 = 300.' },
  { id:3, subject:'English',  text:'Choose the correct sentence:', opts:["He don't know.","He doesn't know.","He not know.","He knowed."], correct:1, explanation:'Third person singular present uses "doesn\'t" for negatives.' },
  { id:4, subject:'GK',       text:'Which article of the Indian Constitution abolishes untouchability?', opts:['Article 14','Article 17','Article 21','Article 25'], correct:1, explanation:'Article 17 abolishes untouchability in any form.' },
  { id:5, subject:'Maths',    text:'LCM of 12, 18, and 24?', opts:['48','72','36','60'], correct:1, explanation:'LCM = 2³×3² = 72.' },
  { id:6, subject:'Reasoning',text:'If MANGO = NBOIP, then APPLE = ?', opts:['BQQMF','BQQLE','CQQMF','BPPLE'], correct:0, explanation:'Each letter +1 in alphabet: A→B, P→Q, P→Q, L→M, E→F = BQQMF.' },
  { id:7, subject:'GK',       text:'RBI Governor is appointed by:', opts:['President','Prime Minister','Finance Minister','Cabinet Committee'], correct:0, explanation:'The RBI Governor is appointed by the President of India on advice of the Union Cabinet.' },
  { id:8, subject:'English',  text:'Synonym of "Ameliorate":', opts:['Worsen','Improve','Maintain','Destroy'], correct:1, explanation:'Ameliorate means to make something bad or unsatisfactory better.' },
  { id:9, subject:'Maths',    text:'Shopkeeper sells at 20% profit. CP = ₹500. SP = ?', opts:['₹550','₹580','₹600','₹620'], correct:2, explanation:'SP = 500 × 120/100 = ₹600.' },
  { id:10,subject:'Reasoning',text:'Odd one out: 3, 5, 7, 11, 12, 13', opts:['12','11','13','5'], correct:0, explanation:'All are prime except 12 (divisible by 2, 3, 4, 6).' },
]

export default function ActiveTest() {
  const navigate = useNavigate()
  const location = useLocation()
  const total = QUESTIONS.length

  const [curr,      setCurr]      = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [revealed,  setRevealed]  = useState(false)
  const [bookmarks, setBookmarks] = useState(new Set())
  const [timeLeft,  setTimeLeft]  = useState(1800)
  const [exitModal, setExitModal] = useState(false)
  const [expTab,    setExpTab]    = useState('step')

  const q = QUESTIONS[curr]
  const sel = answers[q.id]
  const isLocked = sel !== undefined

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { finalSubmit(); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

  const pick = (i) => {
    if (isLocked) return
    setAnswers(p => ({ ...p, [q.id]: i }))
    setRevealed(true)
  }

  const next = () => {
    setRevealed(false)
    if (curr < total - 1) setCurr(p => p + 1)
    else finalSubmit()
  }

  const finalSubmit = useCallback(() => {
    const correct = Object.entries(answers).filter(([id, s]) => {
      const q2 = QUESTIONS.find(q2 => q2.id === +id)
      return q2 && q2.correct === s
    }).length
    navigate('/test-engine/result', { state: { answers, correct, total, timeUsed: 1800 - timeLeft } })
  }, [answers, timeLeft, navigate])

  const optCls = (i) => {
    if (!isLocked) return 'border-slate-200 bg-white hover:border-[#1E3A5F] cursor-pointer'
    if (i === q.correct) return 'border-green-500 bg-green-50 text-green-800'
    if (i === sel && sel !== q.correct) return 'border-red-500 bg-red-50 text-red-800'
    return 'border-slate-200 bg-white opacity-50'
  }

  const r = 22, circ = 2 * Math.PI * r
  const timerColor = timeLeft < 300 ? 'text-red-500' : timeLeft < 600 ? 'text-amber-500' : 'text-[#D4AF37]'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#1E3A5F] z-30 flex items-center justify-between px-4">
        <button onClick={() => setExitModal(true)} className="flex items-center gap-1 text-white/70 hover:text-white text-sm">
          <ChevronLeft size={18} /> Exit
        </button>
        <span className="text-white text-sm font-semibold">Q{curr + 1}/{total}</span>
        <div className="flex items-center gap-2">
          <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
            <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3.5" />
            <circle cx="24" cy="24" r={r} fill="none" stroke="#D4AF37" strokeWidth="3.5"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - timeLeft / 1800)} strokeLinecap="round" />
          </svg>
          <span className={`font-mono font-bold text-sm ${timerColor}`}>{fmt(timeLeft)}</span>
        </div>
      </header>

      {/* Progress dots */}
      <div className="fixed top-[60px] left-0 right-0 h-1.5 z-20 bg-slate-300 flex">
        {QUESTIONS.map((q2, i) => (
          <div key={i} className={`flex-1 mx-px rounded-full transition-colors
            ${i === curr ? 'bg-[#1E3A5F]' : answers[q2.id] !== undefined ? 'bg-[#D4AF37]' : 'bg-slate-300'}`} />
        ))}
      </div>

      {/* Body */}
      <main className="flex-1 pt-[76px] pb-[88px] px-4 max-w-3xl mx-auto w-full">
        <div className="clay rounded-3xl p-6 mt-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="bg-[#1E3A5F] text-white text-xs font-bold px-3 py-1 rounded-full">Q{curr + 1} of {total}</span>
            <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full">{q.subject}</span>
          </div>
          <p className="text-lg font-medium text-[#1E293B] leading-relaxed mb-6">{q.text}</p>
          <div className="flex flex-col gap-3">
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => pick(i)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${optCls(i)}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                  ${isLocked && i === q.correct ? 'bg-green-500 text-white'
                  : isLocked && i === sel && sel !== q.correct ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-600'}`}>
                  {['A','B','C','D'][i]}
                </span>
                <span className="text-sm font-medium flex-1">{opt}</span>
                {isLocked && i === q.correct && <span className="text-green-600 font-bold text-sm ml-auto">✓</span>}
                {isLocked && i === sel && sel !== q.correct && <span className="text-red-500 font-bold text-sm ml-auto">✗</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {revealed && (
          <div className="clay-dark rounded-3xl p-6 mt-4 animate-slide-up">
            <p className={`font-bold text-lg mb-3 ${sel === q.correct ? 'text-green-400' : 'text-red-400'}`}>
              {sel === q.correct ? '✅ Correct! +10 🪙' : '❌ Incorrect'}
            </p>
            <div className="flex gap-2 mb-3 flex-wrap">
              {['step','shortcut','mistakes'].map(t => (
                <button key={t} onClick={() => setExpTab(t)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold capitalize transition-all
                    ${expTab === t ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white/10 text-white/70'}`}>
                  {t === 'step' ? 'Step by Step' : t === 'shortcut' ? 'Shortcut' : 'Common Mistakes'}
                </button>
              ))}
            </div>
            <p className="text-white/85 text-sm leading-relaxed">{q.explanation}</p>
            <p className="text-white/40 text-xs mt-3">Difficulty: Level 3 · Seen in: SSC CGL 2019, 2021, 2023</p>
          </div>
        )}
      </main>

      {/* Footer nav */}
      <footer className="fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t border-slate-200 flex items-center justify-between px-4 gap-3 z-20">
        <button onClick={() => setBookmarks(p => { const n = new Set(p); p.has(q.id) ? n.delete(q.id) : n.add(q.id); return n })}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0
            ${bookmarks.has(q.id) ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-slate-100 text-slate-600'}`}>
          <Bookmark size={16} /> {bookmarks.has(q.id) ? 'Saved' : 'Save'}
        </button>

        <div className="flex gap-1 overflow-x-auto scrollbar-hide max-w-[180px] flex-shrink-0">
          {QUESTIONS.slice(0, 10).map((_, i) => (
            <button key={i} onClick={() => { setCurr(i); setRevealed(false) }}
              className={`w-7 h-7 rounded-lg flex-shrink-0 text-xs font-bold transition-all
                ${i === curr ? 'bg-[#1E3A5F] text-white' : answers[QUESTIONS[i].id] !== undefined ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-slate-100 text-slate-500'}`}>
              {i + 1}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {curr > 0 && (
            <button onClick={() => { setCurr(p => p - 1); setRevealed(false) }}
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600">
              <ChevronLeft size={18} />
            </button>
          )}
          <button onClick={next} className="btn-gold px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5">
            {curr < total - 1 ? (<>Next <ChevronRight size={16} /></>) : 'Submit Test'}
          </button>
        </div>
      </footer>

      {/* Exit modal */}
      {exitModal && (
        <div className="fixed inset-0 bg-[#0F2140]/80 z-50 flex items-center justify-center p-4">
          <div className="clay rounded-3xl p-8 max-w-sm w-full text-center">
            <p className="text-4xl mb-3">⚠️</p>
            <h3 className="font-bold text-[#1E3A5F] text-xl mb-2 font-poppins">Exit Test?</h3>
            <p className="text-slate-500 text-sm mb-6">Your progress will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setExitModal(false)} className="flex-1 btn-gold py-3 rounded-2xl font-bold">Stay</button>
              <button onClick={() => navigate('/test-engine')}
                className="flex-1 border-2 border-red-300 text-red-500 py-3 rounded-2xl font-bold hover:bg-red-50 transition-colors">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

// TARGET_FILE: src/pages/test-engine/ResultScreen.jsx
```jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const SUBS = [
  { name:'Reasoning', acc:85, trend:'up'   },
  { name:'Maths',     acc:80, trend:'up'   },
  { name:'English',   acc:65, trend:'down' },
  { name:'GK',        acc:78, trend:'up'   },
  { name:'Science',   acc:50, trend:'down' },
]

export default function ResultScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { answers = {}, correct = 7, total = 10, timeUsed = 1200 } = location.state || {}
  const wrong   = Object.keys(answers).length - correct
  const skipped = total - Object.keys(answers).length
  const pct = Math.round((correct / total) * 100)

  const [rank,     setRank]     = useState(9999)
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      const dur = 2000, target = 1243, start = performance.now()
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1)
        const e = 1 - Math.pow(1 - p, 4)
        setRank(Math.round(9999 - e * (9999 - target)))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
  const r = 52, circ = 2 * Math.PI * r
  const ringColor = pct >= 75 ? '#22C55E' : pct >= 50 ? '#D4AF37' : '#EF4444'

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">

        {/* Score card */}
        <div ref={ref} className="clay-dark rounded-3xl p-8 mb-6 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 glass-gold px-3 py-1.5 rounded-xl animate-bounce-in">
            <span className="text-[#D4AF37] font-bold text-sm">+30 🪙 earned!</span>
          </div>

          <h2 className="text-white text-2xl font-bold font-poppins mb-6">Test Completed! 🎉</h2>

          {/* Ring */}
          <div className="flex justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                <circle cx="60" cy="60" r={r} fill="none" stroke={ringColor} strokeWidth="10"
                  strokeLinecap="round" strokeDasharray={circ}
                  strokeDashoffset={animated ? circ * (1 - pct / 100) : circ}
                  style={{ transition: 'stroke-dashoffset 1.5s ease 0.3s' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white font-poppins">{pct}%</span>
                <span className="text-white/60 text-xs">Score</span>
              </div>
            </div>
          </div>

          {/* 4 stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[['✅', correct,'Correct'],['❌', wrong,'Wrong'],['⏭️', skipped,'Skipped'],['⏱️', fmt(timeUsed),'Time']].map(([icon, val, label]) => (
              <div key={label} className="bg-white/5 rounded-2xl p-3">
                <p className="text-xl mb-1">{icon}</p>
                <p className="text-xl font-bold text-white font-poppins">{val}</p>
                <p className="text-white/50 text-xs">{label}</p>
              </div>
            ))}
          </div>

          {/* Rank */}
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="text-white/60 text-sm mb-1">All India Rank</p>
            <p className="text-5xl font-black text-[#D4AF37] font-poppins">#{rank.toLocaleString()}</p>
            <p className="text-white/50 text-xs mt-1">SSC CGL · Today's Mock</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/40">You scored higher than</span>
                <span className="text-white/70 font-bold">87% of test takers</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5">
                <div className="bg-[#D4AF37] h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: animated ? '87%' : '0%' }} />
              </div>
            </div>
            <p className="text-white/40 text-xs mt-2">TN: #127 · Coimbatore: #8</p>
          </div>
        </div>

        {/* Subject breakdown */}
        <div className="clay rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins mb-4">Subject Performance</h3>
          {SUBS.map(s => (
            <div key={s.name} className="flex items-center gap-3 mb-3">
              <span className="text-slate-600 text-sm w-20 flex-shrink-0">{s.name}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all duration-1000 ${s.acc >= 80 ? 'bg-green-500' : s.acc >= 70 ? 'bg-[#D4AF37]' : 'bg-amber-500'}`}
                  style={{ width: animated ? `${s.acc}%` : '0%' }} />
              </div>
              <span className="text-sm font-bold text-[#1E3A5F] w-10 text-right">{s.acc}%</span>
              <span className={`text-xs font-bold ${s.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {s.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button onClick={() => navigate('/test-engine/review', { state: { answers } })} className="btn-gold py-4 rounded-2xl font-bold">
            Review Answers
          </button>
          <button onClick={() => navigate('/test-engine')} className="btn-navy py-4 rounded-2xl font-bold">
            Take Another
          </button>
        </div>
        <button onClick={() => { navigator.clipboard?.writeText(`I scored ${pct}% on TryIT Educations! Rank #${rank}. tryiteducations.net`) }}
          className="w-full border-2 border-slate-200 text-slate-600 py-3.5 rounded-2xl font-bold hover:border-[#D4AF37] transition-colors">
          📤 Share Result
        </button>
      </div>
    </AppLayout>
  )
}
```

// TARGET_FILE: src/pages/test-engine/ReviewScreen.jsx
```jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { Bookmark, ChevronLeft } from 'lucide-react'

const QUESTIONS = [
  { id:1, subject:'Reasoning', text:'A train 200m long passes a 300m platform in 25 seconds. Speed in km/hr?', opts:['72 km/hr','64 km/hr','80 km/hr','56 km/hr'], correct:0, explanation:'Total = 500m. Speed = 20 m/s = 72 km/hr.' },
  { id:2, subject:'Maths',    text:'If 15% of X = 45, find X.', opts:['280','300','320','340'], correct:1, explanation:'X = 45 × 100/15 = 300.' },
  { id:3, subject:'English',  text:'Choose the correct sentence:', opts:["He don't know.","He doesn't know.","He not know.","He knowed."], correct:1, explanation:'Third person singular uses "doesn\'t" for negatives.' },
  { id:4, subject:'GK',       text:'Which article abolishes untouchability?', opts:['Article 14','Article 17','Article 21','Article 25'], correct:1, explanation:'Article 17 abolishes untouchability.' },
  { id:5, subject:'Maths',    text:'LCM of 12, 18, and 24?', opts:['48','72','36','60'], correct:1, explanation:'LCM = 72.' },
]

const FILTERS = ['All','Correct','Wrong','Skipped','Bookmarked']

export default function ReviewScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { answers = { 1:0, 2:1, 3:0, 4:1, 5:0 } } = location.state || {}

  const [filter,    setFilter]    = useState('All')
  const [expanded,  setExpanded]  = useState({})
  const [bookmarks, setBookmarks] = useState(new Set())

  const result = (q) => {
    const s = answers[q.id]
    if (s === undefined) return 'skipped'
    return s === q.correct ? 'correct' : 'wrong'
  }

  const counts = {
    All: QUESTIONS.length,
    Correct: QUESTIONS.filter(q => result(q) === 'correct').length,
    Wrong: QUESTIONS.filter(q => result(q) === 'wrong').length,
    Skipped: QUESTIONS.filter(q => result(q) === 'skipped').length,
    Bookmarked: bookmarks.size,
  }

  const filtered = QUESTIONS.filter(q => {
    const r = result(q)
    if (filter === 'All') return true
    if (filter === 'Correct') return r === 'correct'
    if (filter === 'Wrong') return r === 'wrong'
    if (filter === 'Skipped') return r === 'skipped'
    if (filter === 'Bookmarked') return bookmarks.has(q.id)
    return true
  })

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:border-[#D4AF37] transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F] font-poppins">Answer Review</h1>
            <p className="text-slate-500 text-sm">{QUESTIONS.length} Questions · SSC CGL Mock</p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all
                ${filter === f ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
              {f}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {filtered.length > 0 ? filtered.map((q, qi) => {
            const res = result(q)
            const sel = answers[q.id]
            const isExp = expanded[q.id]
            const border = res === 'correct' ? 'border-green-500' : res === 'wrong' ? 'border-red-500' : 'border-slate-200'

            return (
              <div key={q.id} className={`clay rounded-3xl p-6 border-2 ${border}`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">Q{qi + 1}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full
                      ${res === 'correct' ? 'bg-green-100 text-green-700' : res === 'wrong' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                      {res === 'correct' ? '✅ Correct' : res === 'wrong' ? '❌ Wrong' : '⏭️ Skipped'}
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full">{q.subject}</span>
                  </div>
                  <button
                    onClick={() => setBookmarks(p => { const n = new Set(p); p.has(q.id) ? n.delete(q.id) : n.add(q.id); return n })}
                    className={`flex-shrink-0 transition-colors ${bookmarks.has(q.id) ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-[#D4AF37]'}`}>
                    <Bookmark size={20} fill={bookmarks.has(q.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <p className="text-[#1E293B] font-medium mb-4 leading-relaxed">{q.text}</p>

                {/* Options (read-only) */}
                <div className="flex flex-col gap-2 mb-4">
                  {q.opts.map((opt, i) => {
                    const isCorrect  = i === q.correct
                    const isUserSel  = i === sel
                    let cls = 'border-slate-200 bg-slate-50 opacity-60'
                    if (isCorrect) cls = 'border-green-500 bg-green-50'
                    else if (isUserSel && !isCorrect) cls = 'border-red-500 bg-red-50'
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${cls}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                          ${isCorrect ? 'bg-green-500 text-white' : isUserSel ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          {['A','B','C','D'][i]}
                        </span>
                        <span className="text-sm">{opt}</span>
                        {isCorrect && <span className="ml-auto text-green-600 text-xs font-bold">✓ Correct</span>}
                        {isUserSel && !isCorrect && <span className="ml-auto text-red-500 text-xs font-bold">Your answer</span>}
                      </div>
                    )
                  })}
                </div>

                <button onClick={() => setExpanded(p => ({ ...p, [q.id]: !p[q.id] }))}
                  className="text-[#D4AF37] text-sm font-semibold hover:underline">
                  {isExp ? '▲ Hide Explanation' : '▼ Show Explanation'}
                </button>
                {isExp && (
                  <div className="mt-3 bg-slate-50 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed animate-slide-up">
                    {q.explanation}
                  </div>
                )}
              </div>
            )
          }) : (
            <div className="clay rounded-3xl p-12 text-center">
              <p className="text-5xl mb-3">🔍</p>
              <p className="text-slate-500">No questions match this filter.</p>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/test-engine')} className="btn-gold w-full py-4 rounded-2xl font-bold text-lg mt-6 mb-4">
          Take Another Test →
        </button>
      </div>
    </AppLayout>
  )
}
```
