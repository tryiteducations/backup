// FILE: src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import localDb from '../lib/localDb'
// ── PLAN RULES (Free / Pro / Ultra feature gates) ─────────────────────────
const PLAN_RULES = {
  free: {
    pyq_questions:    { allowed: true,  limit: null, period: null,  coins: 0  },
    ai_questions:     { allowed: false, limit: null, period: null,  coins: 10 },
    explanation:      { allowed: true,  limit: 5,    period: '6hr', coins: 20 },
    concept_learning: { allowed: false, limit: null, period: null,  coins: 0  },
    daily_tests:      { allowed: true,  limit: 5,    period: '24hr',coins: 0  },
    mock_tests:       { allowed: true,  limit: 1,    period: '7day',coins: 50 },
    daily_materials:  { allowed: true,  limit: null, period: null,  coins: 0  },
    games_basic:      { allowed: true,  limit: null, period: null,  coins: 30 },
    games_advanced:   { allowed: false, limit: null, period: null,  coins: 100},
    prep_pathways:    { allowed: false, limit: null, period: null,  coins: 0  },
    battles:          { allowed: true,  limit: 3,    period: '24hr',coins: 20 },
    offline_download: { allowed: false, limit: null, period: null,  coins: 50 },
    doubt_mentor:     { allowed: false, limit: null, period: null,  coins: 100},
  },
  pro: {
    pyq_questions:    { allowed: true,  limit: null, period: null, coins: 0 },
    ai_questions:     { allowed: true,  limit: null, period: null, coins: 0 },
    explanation:      { allowed: true,  limit: null, period: null, coins: 0 },
    concept_learning: { allowed: false, limit: null, period: null, coins: 0 },
    daily_tests:      { allowed: true,  limit: null, period: null, coins: 0 },
    mock_tests:       { allowed: true,  limit: null, period: null, coins: 0 },
    daily_materials:  { allowed: true,  limit: null, period: null, coins: 0 },
    games_basic:      { allowed: true,  limit: null, period: null, coins: 0 },
    games_advanced:   { allowed: true,  limit: null, period: null, coins: 0 },
    prep_pathways:    { allowed: false, limit: null, period: null, coins: 0 },
    battles:          { allowed: true,  limit: null, period: null, coins: 0 },
    offline_download: { allowed: true,  limit: null, period: null, coins: 0 },
    doubt_mentor:     { allowed: true,  limit: 5,    period: '30day', coins: 0 },
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

// Also keep pro_trial and pro_grant acting as 'pro'
function normalizePlan(plan) {
  if (!plan) return 'free'
  if (plan === 'ultra') return 'ultra'
  if (['pro', 'pro_trial', 'pro_grant', 'pro_monthly',
       'pro_quarterly', 'pro_yearly'].includes(plan)) return 'pro'
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
  isPro: false, plan: 'free',
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
  // ── canAccess: check if user can use a feature ──────────────────────────
  const canAccess = (feature) => {
    const tier  = normalizePlan(user?.plan)
    const rules = PLAN_RULES[tier] || PLAN_RULES.free
    const rule  = rules[feature]
    if (!rule) return { allowed: false, reason: 'unknown_feature' }

    // Feature blocked at this plan level
    if (!rule.allowed) {
      const upgradeTo = feature === 'concept_learning' ? 'ultra' : 'pro'
      return {
        allowed: false,
        reason: 'plan_restriction',
        upgradeTo,
        coinCost: rule.coins,
        canByCoin: rule.coins > 0 && (user?.coins || 0) >= rule.coins,
      }
    }

    // Check usage limits
    if (rule.limit !== null && rule.period && user?.id) {
      const key  = getUsagePeriodKey(user.id, feature, rule.period)
      const used = parseInt(localStorage.getItem(key) || '0')
      if (used >= rule.limit) {
        const upgradeTo = feature === 'concept_learning' ? 'ultra' : 'pro'
        return {
          allowed: false,
          reason: 'limit_reached',
          used,
          limit: rule.limit,
          period: rule.period,
          coinCost: rule.coins,
          canByCoin: rule.coins > 0 && (user?.coins || 0) >= rule.coins,
          upgradeTo,
        }
      }
    }
    return { allowed: true }
  }

  // ── trackUsage: increment usage counter after using a feature ───────────
  const trackUsage = (feature) => {
    const tier  = normalizePlan(user?.plan)
    const rule  = (PLAN_RULES[tier] || PLAN_RULES.free)[feature]
    if (!rule?.period || !user?.id) return
    const key  = getUsagePeriodKey(user.id, feature, rule.period)
    const used = parseInt(localStorage.getItem(key) || '0')
    localStorage.setItem(key, used + 1)
  }

  // ── spendCoins: deduct coins and sync ───────────────────────────────────
  const spendCoins = (amount, reason = '') => {
    if (!user || (user.coins || 0) < amount) return false
    const newBal = (user.coins || 0) - amount
    updateUser({ coins: newBal })
    // Async sync to Supabase
    if (!IS_DEV && user.id) {
      supabase.from('coins_ledger').insert({
        user_id: user.id,
        transaction_type: 'spent_hint',
        amount: -amount,
        balance_after: newBal,
        notes: reason,
      }).then(() => {
        supabase.from('users').update({ coins: newBal }).eq('id', user.id)
      })
    }
    return true
  }

  // ── isTopicUnlocked: check if user has bought a topic concept ───────────
  const isTopicUnlocked = (topicId) => {
    const tier = normalizePlan(user?.plan)
    if (tier === 'ultra') return true
    const key     = `tryit_topic_unlocks_${user?.id}`
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

  const isImpersonating = () => localStorage.getItem('tryit_admin_impersonating') === '1'

  return (
    <AuthCtx.Provider value={{
      user, loading, syncStatus,
      login, logout, updateUser, addCoins, spendCoins,
      viewAs, exitImpersonation, isImpersonating,
      canAccess, trackUsage, isTopicUnlocked, unlockTopic,
      isPro:   normalizePlan(user?.plan) !== 'free',
      isUltra: normalizePlan(user?.plan) === 'ultra',
      planTier: normalizePlan(user?.plan),
    }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
