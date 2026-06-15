// FILE: src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import localDb from '../lib/localDb'

const MOCK_USER = {
  id: 'usr-mock-001',
  name: '',
  initials: '?',
  email: localStorage.getItem('tryit_email') || '',
  state: 'Tamil Nadu',
  city: 'Coimbatore',
  role: localStorage.getItem('tryit_role') || 'student',
  xp: 0, xpToNext: 500, coins: 0, streak: 0, streakFreezes: 2,
  level: 1, levelTitle: 'The Fierce One', levelEmoji: '🔥',
  isPro: true, plan: 'pro_trial',
  userId: 'TRY-TN-00001-2026', joinDate: 'June 2026',
  rank: null, testsCompleted: 0, avgScore: null,
  studyHours: '0h', guruPoints: 0,
  exams: [],
  subjects: [],
}

const IS_DEV = true // Dev mode

const SIGNUP_BONUS = 200

export function onboardingKey(email) {
  return `onboarding_done_${(email || 'guest').toLowerCase()}`
}

function grantSignupBonusIfNeeded(user, email) {
  const bonusKey = `signup_bonus_${(email || 'guest').toLowerCase()}`
  if (!localStorage.getItem(bonusKey)) {
    localStorage.setItem(bonusKey, '1')
    return { ...user, coins: (user.coins || 0) + SIGNUP_BONUS }
  }
  return user
}

function applyAdminGrant(user, email) {
  try {
    const grants = JSON.parse(localStorage.getItem('tryit_pro_grants') || '[]')
    const grant = grants.find(g =>
      g.email?.toLowerCase() === (email || '').toLowerCase() &&
      new Date(g.expiresAt) > new Date()
    )
    if (grant) return { ...user, isPro: true, plan: grant.plan || 'pro_grant' }
  } catch {}
  return user
}

function makeInitials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/)
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return '?'
}

const AuthCtx = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState('idle')

  useEffect(() => { initSession() }, [])

  async function initSession() {
    setLoading(true)

    if (IS_DEV) {
      const email = localStorage.getItem('tryit_email')
      if (email) {
        let saved = null
        try { saved = localDb.getProfile?.(email) } catch {}

        let u = saved
          ? { ...MOCK_USER, ...saved }
          : { ...MOCK_USER, email, role: localStorage.getItem('tryit_role') || 'student' }

        if (!u.name) u.name = email.split('@')[0]
        u.initials = makeInitials(u.name, email)

        u = applyAdminGrant(u, email)
        u = grantSignupBonusIfNeeded(u, email)
        u = { ...u, isPro: true, plan: u.plan === 'pro_grant' ? u.plan : 'pro_trial' }

        setUser(u)
        localDb.saveProfile?.(u)
        localDb.saveSession?.({ userId: u.id, email })
      } else {
        setUser(null)
      }
      setLoading(false)
      return
    }

    try {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single()
        if (profile) setUser(buildUser(profile))
      }
    } catch (e) {
      console.error('initSession error', e)
    }
    setLoading(false)
  }

  function buildUser(profile) {
    const u = {
      ...MOCK_USER,
      ...profile,
      initials: makeInitials(profile.name, profile.email),
      isPro: true,
      plan: profile.plan || 'pro_trial',
    }
    return applyAdminGrant(u, profile.email)
  }

  const login = async (email, role = 'student') => {
    const e = (email || '').trim().toLowerCase()
    if (!e) return { error: 'Email required' }

    localStorage.setItem('tryit_email', e)
    localStorage.setItem('tryit_role', role)

    if (IS_DEV) {
      let u = { ...MOCK_USER, email: e, role }
      u.name = e.split('@')[0]
      u.initials = makeInitials(u.name, e)
      u = applyAdminGrant(u, e)
      u = grantSignupBonusIfNeeded(u, e)
      u = { ...u, isPro: true, plan: u.plan === 'pro_grant' ? u.plan : 'pro_trial' }
      setUser(u)
      localDb.saveProfile?.(u)
      localDb.saveSession?.({ userId: u.id, email: e })
      return { error: null }
    }

    return supabase.auth.signInWithOtp({ email: e })
  }

  const logout = () => {
    localStorage.removeItem('tryit_email')
    localStorage.removeItem('tryit_role')
    localStorage.removeItem('tryit_admin_impersonating')
    setUser(null)
    if (!IS_DEV) supabase.auth.signOut()
  }

  const updateUser = (patch) => {
    setUser(prev => {
      const next = { ...prev, ...patch }
      localDb.saveProfile?.(next)
      return next
    })
  }

  const addCoins = (amount) => {
    setUser(prev => {
      const next = { ...prev, coins: (prev?.coins || 0) + amount }
      localDb.saveProfile?.(next)
      return next
    })
  }

  const viewAs = (targetRole) => {
    const fakeEmail = `admin-view-${targetRole}@tryit.internal`
    localStorage.setItem('tryit_admin_impersonating', '1')
    localStorage.setItem('tryit_admin_real_email', localStorage.getItem('tryit_email') || 'admin')
    localStorage.setItem('tryit_email', fakeEmail)
    localStorage.setItem('tryit_role', targetRole)
    localStorage.setItem(onboardingKey(fakeEmail), '1')

    const viewUser = {
      ...MOCK_USER,
      email: fakeEmail, role: targetRole,
      name: `[Admin View] ${targetRole.charAt(0).toUpperCase() + targetRole.slice(1)}`,
      initials: 'AV', isPro: true, plan: 'pro_trial',
      coins: 9999, level: 10, levelTitle: 'The Legend', levelEmoji: '🌟',
      rank: 1, testsCompleted: 50, avgScore: 92,
      exams: targetRole === 'student' ? [
        { id: 'ssc-cgl',  name: 'SSC CGL',  readiness: 80, examDate: 'Aug 2026' },
        { id: 'neet-ug',  name: 'NEET UG',  readiness: 80, examDate: 'May 2026' },
        { id: 'upsc-cse', name: 'UPSC CSE', readiness: 80, examDate: 'May 2026' },
      ] : [],
      subjects: targetRole === 'student' ? [
        { name: 'Quant',     accuracy: 82, trend: 'up',   emoji: '📐' },
        { name: 'Reasoning', accuracy: 90, trend: 'up',   emoji: '🧠' },
        { name: 'English',   accuracy: 68, trend: 'down', emoji: '📝' },
        { name: 'GK',        accuracy: 75, trend: 'up',   emoji: '🌍' },
      ] : [],
    }
    setUser(viewUser)
    localDb.saveProfile?.(viewUser)
    localDb.saveSession?.({ userId: 'admin-view', email: fakeEmail })
  }

  const exitImpersonation = () => {
    const realEmail = localStorage.getItem('tryit_admin_real_email')
    localStorage.removeItem('tryit_admin_impersonating')
    localStorage.removeItem('tryit_admin_real_email')
    if (realEmail) localStorage.setItem('tryit_email', realEmail)
    initSession()
  }

  const isImpersonating = () => localStorage.getItem('tryit_admin_impersonating') === '1'

  return (
    <AuthCtx.Provider value={{
      user, loading, syncStatus,
      login, logout, updateUser, addCoins,
      viewAs, exitImpersonation, isImpersonating,
    }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
