// FILE: src/context/AuthContext.jsx
// TryIT - Real phone-based authentication via Edge Functions (auth-register,
// auth-verify-session) - was previously a fully local/fake mock, fixed to use
// the actual backend auth system that already existed but was never wired in.
import { createContext, useContext, useState, useEffect } from 'react'
import localDb from '../lib/localDb'
import { realAuth } from '../lib/realAuth'

// -- PLAN RULES (Free / Pro / Ultra feature gates) -------------------------
const PLAN_RULES = {
  free: {
    pyq_questions:    { allowed: true,  limit: null, period: null,   coins: 0   },
    ai_questions:     { allowed: false, limit: null, period: null,   coins: 10  },
    explanation:      { allowed: true,  limit: 5,    period: '6hr',  coins: 20  },
    concept_learning: { allowed: false, limit: null, period: null,   coins: 0   },
    daily_tests:      { allowed: true,  limit: 5,    period: '24hr', coins: 0   },
    mock_tests:       { allowed: true,  limit: 1,    period: '7day', coins: 50  },
    daily_materials:  { allowed: true,  limit: null, period: null,   coins: 0   },
    games_basic:      { allowed: true,  limit: null, period: null,   coins: 30  },
    games_advanced:   { allowed: false, limit: null, period: null,   coins: 100 },
    prep_pathways:    { allowed: false, limit: null, period: null,   coins: 0   },
    battles:          { allowed: true,  limit: 3,    period: '24hr', coins: 20  },
    offline_download: { allowed: false, limit: null, period: null,   coins: 50  },
    doubt_mentor:     { allowed: false, limit: null, period: null,   coins: 100 },
  },
  pro: {
    pyq_questions:    { allowed: true, limit: null, period: null,    coins: 0 },
    ai_questions:     { allowed: true, limit: null, period: null,    coins: 0 },
    explanation:      { allowed: true, limit: null, period: null,    coins: 0 },
    concept_learning: { allowed: false, limit: null, period: null,   coins: 0 },
    daily_tests:      { allowed: true, limit: null, period: null,    coins: 0 },
    mock_tests:       { allowed: true, limit: null, period: null,    coins: 0 },
    daily_materials:  { allowed: true, limit: null, period: null,    coins: 0 },
    games_basic:      { allowed: true, limit: null, period: null,    coins: 0 },
    games_advanced:   { allowed: true, limit: null, period: null,    coins: 0 },
    prep_pathways:    { allowed: false, limit: null, period: null,   coins: 0 },
    battles:          { allowed: true, limit: null, period: null,    coins: 0 },
    offline_download: { allowed: true, limit: null, period: null,    coins: 0 },
    doubt_mentor:     { allowed: true, limit: 5,    period: '30day', coins: 0 },
  },
  ultra: {
    pyq_questions:    { allowed: true, limit: null, period: null, coins: 0 },
    ai_questions:     { allowed: true, limit: null, period: null, coins: 0 },
    explanation:      { allowed: true, limit: null, period: null, coins: 0 },
    concept_learning: { allowed: true, limit: null, period: null, coins: 0 },
    daily_tests:      { allowed: true, limit: null, period: null, coins: 0 },
    mock_tests:       { allowed: true, limit: null, period: null, coins: 0 },
    daily_materials:  { allowed: true, limit: null, period: null, coins: 0 },
    games_basic:      { allowed: true, limit: null, period: null, coins: 0 },
    games_advanced:   { allowed: true, limit: null, period: null, coins: 0 },
    prep_pathways:    { allowed: true, limit: null, period: null, coins: 0 },
    battles:          { allowed: true, limit: null, period: null, coins: 0 },
    offline_download: { allowed: true, limit: null, period: null, coins: 0 },
    doubt_mentor:     { allowed: true, limit: null, period: null, coins: 0 },
  },
}

function normalizePlan(plan) {
  if (!plan) return 'free'
  if (plan === 'ultra' || plan === 'ultra_monthly' ||
      plan === 'ultra_quarterly' || plan === 'ultra_yearly') return 'ultra'
  if (['pro', 'pro_trial', 'pro_grant', 'pro_monthly',
       'pro_quarterly', 'pro_yearly', 'pro_3day',
       'pro_7day'].includes(plan)) return 'pro'
  return 'free'
}

function getUsagePeriodKey(userId, feature, period) {
  const now = new Date()
  let block
  if (period === '6hr') {
    const h = now.getHours()
    block = `${now.toDateString()}_${Math.floor(h / 6)}`
  } else if (period === '24hr') {
    block = now.toDateString()
  } else if (period === '7day') {
    block = `week_${Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000))}`
  } else if (period === '30day') {
    block = `${now.getFullYear()}_${now.getMonth()}`
  } else {
    block = now.toDateString()
  }
  return `tryit_usage_${userId}_${feature}_${block}`
}

// -- MOCK USER (fully local, no Supabase) -----------------------------------
const MOCK_USER = {
  id: '4e6fcfaf-4ec5-4fc6-8047-351d8f3c82b0',
  is_admin: true, is_mentor: true, is_institution: true, role: 'admin',
  plan: 'ultra', coins: 9999, level: 10, levelTitle: 'The Legend',
  levelEmoji: '\u2B50', rank: 1, testsCompleted: 50, avgScore: 92,
  streak: 30, name: 'TryIT User',
  exams: [
    { id: 'ssc-cgl',  name: 'SSC CGL',  readiness: 80, examDate: 'Aug 2026' },
    { id: 'neet-ug',  name: 'NEET UG',  readiness: 80, examDate: 'May 2026' },
    { id: 'upsc-cse', name: 'UPSC CSE', readiness: 80, examDate: 'May 2026' },
  ],
  subjects: [
    { name: 'Quant',     accuracy: 82, trend: 'up',   emoji: '\uD83D\uDCD0' },
    { name: 'Reasoning', accuracy: 90, trend: 'up',   emoji: '\uD83E\uDDE0' },
    { name: 'English',   accuracy: 68, trend: 'down', emoji: '\uD83D\uDCDD' },
    { name: 'GK',        accuracy: 75, trend: 'up',   emoji: '\uD83C\uDF0D' },
  ],
}

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

// -- CONTEXT ----------------------------------------------------------------
const AuthCtx = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [syncStatus, setSyncStatus] = useState('idle')

  useEffect(() => { initSession() }, [])

  async function initSession() {
    setLoading(true)
    try {
      const session = await realAuth.getValidSession()
      if (!session) {
        setUser(null)
        setLoading(false)
        return
      }

      const userId = realAuth.getUserIdFromJwt(session.jwt)
      if (!userId) {
        realAuth.logout()
        setUser(null)
        setLoading(false)
        return
      }

      const profile = await realAuth.fetchProfile(userId)
      let u = { ...MOCK_USER, ...profile, id: userId }
      if (!u.name) u.name = u.phone || 'Student'
      u.initials = makeInitials(u.name, u.email || u.phone)

      const tier = normalizePlan(u.plan)
      u = { ...u, isPro: tier !== 'free' }

      setUser(u)
    } catch (err) {
      console.error('Session restore failed:', err)
      realAuth.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // -- AUTH ACTIONS ----------------------------------------------------------
  // Real phone verification (reverse-SMS/WhatsApp/Truecaller) - see realAuth.js.
  // `code` is the registration code the user sent to your Exotel number.
  const login = async (phone, code, method = 'sms') => {
    try {
      const result = await realAuth.verifyAndLogin(phone, code, method)
      const profile = await realAuth.fetchProfile(result.userId)

      let u = { ...MOCK_USER, ...profile, id: result.userId }
      if (!u.name) u.name = u.phone || 'Student'
      u.initials = makeInitials(u.name, u.email || u.phone)

      const tier = normalizePlan(u.plan)
      u = { ...u, isPro: tier !== 'free' }

      setUser(u)
      return { success: true, user: u }
    } catch (err) {
      return { error: err.message || 'Login failed - please try again.' }
    }
  }

  const logout = () => {
    realAuth.logout()
    setUser(null)
  }

  // -- PIN AUTH (local) -----------------------------------------------------
  const PIN_MAX_ATTEMPTS = 5
  const PIN_LOCKOUT_MINUTES = 15
  const getPinLockKey = (role) => `tryit_pin_locked_until_${role}`
  const getPinAttemptsKey = (role) => `tryit_pin_attempts_${role}`

  const isPinLocked = (role) => {
    const until = localStorage.getItem(getPinLockKey(role))
    if (!until) return false
    if (new Date(until) > new Date()) return true
    localStorage.removeItem(getPinLockKey(role))
    localStorage.removeItem(getPinAttemptsKey(role))
    return false
  }

  const hasPinForRole = (role) => localStorage.getItem(`tryit_pin_${role}`) !== null

  const setPinForRole = (role, pin) => {
    localStorage.setItem(`tryit_pin_${role}`, btoa(pin))
    localStorage.setItem(`tryit_pin_enabled_${role}`, 'true')
  }

  const verifyPin = (role, pin) => {
    if (isPinLocked(role)) {
      return { success: false, reason: 'locked', lockedUntil: localStorage.getItem(getPinLockKey(role)) }
    }
    const stored = localStorage.getItem(`tryit_pin_${role}`)
    if (!stored) return { success: false, reason: 'no_pin_set' }
    if (btoa(pin) === stored) {
      localStorage.removeItem(getPinAttemptsKey(role))
      localStorage.removeItem(getPinLockKey(role))
      return { success: true }
    }
    const attempts = parseInt(localStorage.getItem(getPinAttemptsKey(role)) || '0') + 1
    localStorage.setItem(getPinAttemptsKey(role), attempts)
    if (attempts >= PIN_MAX_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + PIN_LOCKOUT_MINUTES * 60 * 1000).toISOString()
      localStorage.setItem(getPinLockKey(role), lockUntil)
      return { success: false, reason: 'locked', lockedUntil: lockUntil }
    }
    return { success: false, reason: 'wrong_pin', attemptsLeft: PIN_MAX_ATTEMPTS - attempts }
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
      coins: 9999, level: 10, levelTitle: 'The Legend', levelEmoji: '\u2B50',
      rank: 1, testsCompleted: 50, avgScore: 92,
      exams: targetRole === 'student' ? [
        { id: 'ssc-cgl',  name: 'SSC CGL',  readiness: 80, examDate: 'Aug 2026' },
        { id: 'neet-ug',  name: 'NEET UG',  readiness: 80, examDate: 'May 2026' },
        { id: 'upsc-cse', name: 'UPSC CSE', readiness: 80, examDate: 'May 2026' },
      ] : [],
      subjects: targetRole === 'student' ? [
        { name: 'Quant',     accuracy: 82, trend: 'up',   emoji: '\uD83D\uDCD0' },
        { name: 'Reasoning', accuracy: 90, trend: 'up',   emoji: '\uD83E\uDDE0' },
        { name: 'English',   accuracy: 68, trend: 'down', emoji: '\uD83D\uDCDD' },
        { name: 'GK',        accuracy: 75, trend: 'up',   emoji: '\uD83C\uDF0D' },
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

  const isImpersonating = () =>
    localStorage.getItem('tryit_admin_impersonating') === '1'

  // -- PLAN ACCESS FUNCTIONS ----------------------------------------------
  const canAccess = (feature) => {
    const tier  = normalizePlan(user?.plan)
    const rules = PLAN_RULES[tier] || PLAN_RULES.free
    const rule  = rules[feature]

    if (!rule) return { allowed: false, reason: 'unknown_feature' }

    if (!rule.allowed) {
      const upgradeTo = feature === 'concept_learning' || feature === 'prep_pathways'
        ? 'ultra' : 'pro'
      return {
        allowed:   false,
        reason:    'plan_restriction',
        upgradeTo,
        coinCost:  rule.coins,
        canByCoin: rule.coins > 0 && (user?.coins || 0) >= rule.coins,
      }
    }

    if (rule.limit !== null && rule.period && user?.id) {
      const key  = getUsagePeriodKey(user.id, feature, rule.period)
      const used = parseInt(localStorage.getItem(key) || '0')
      if (used >= rule.limit) {
        const upgradeTo = feature === 'concept_learning' || feature === 'prep_pathways'
          ? 'ultra' : 'pro'
        return {
          allowed:   false,
          reason:    'limit_reached',
          used,
          limit:     rule.limit,
          period:    rule.period,
          coinCost:  rule.coins,
          canByCoin: rule.coins > 0 && (user?.coins || 0) >= rule.coins,
          upgradeTo,
        }
      }
    }

    return { allowed: true }
  }

  const trackUsage = (feature) => {
    const tier = normalizePlan(user?.plan)
    const rule = (PLAN_RULES[tier] || PLAN_RULES.free)[feature]
    if (!rule?.period || !user?.id) return
    const key  = getUsagePeriodKey(user.id, feature, rule.period)
    const used = parseInt(localStorage.getItem(key) || '0')
    localStorage.setItem(key, used + 1)
  }

  const spendCoins = (amount, reason = '') => {
    if (!user || (user.coins || 0) < amount) return false
    const newBal = (user.coins || 0) - amount
    updateUser({ coins: newBal })
    return true
  }

  const isTopicUnlocked = (topicId) => {
    const tier = normalizePlan(user?.plan)
    if (tier === 'ultra' || tier === 'pro') return true
    const key      = `tryit_topic_unlocks_${user?.id}`
    const unlocked = JSON.parse(localStorage.getItem(key) || '[]')
    return unlocked.includes(topicId)
  }

  const unlockTopic = (topicId) => {
    const key      = `tryit_topic_unlocks_${user?.id}`
    const unlocked = JSON.parse(localStorage.getItem(key) || '[]')
    if (!unlocked.includes(topicId)) {
      unlocked.push(topicId)
      localStorage.setItem(key, JSON.stringify(unlocked))
    }
  }

  const explanationsLeft = () => {
    const tier = normalizePlan(user?.plan)
    if (tier !== 'free') return Infinity
    const key  = getUsagePeriodKey(user?.id, 'explanation', '6hr')
    const used = parseInt(localStorage.getItem(key) || '0')
    return Math.max(0, 5 - used)
  }

  const planTier = normalizePlan(user?.plan)

  return (
    <AuthCtx.Provider value={{
      user,
      loading,
      syncStatus,
      login,
      logout,
      hasPinForRole,
      setPinForRole,
      verifyPin,
      updateUser,
      addCoins,
      spendCoins,
      viewAs,
      exitImpersonation,
      isImpersonating,
      canAccess,
      trackUsage,
      isTopicUnlocked,
      unlockTopic,
      explanationsLeft,
      planTier,
      isPro:   planTier !== 'free',
      isUltra: planTier === 'ultra',
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)