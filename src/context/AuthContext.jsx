import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import localDb from '../lib/localDb'
import { deltaSync, startRealtimeSync, startOutboxFlush } from '../lib/syncEngine'

// ── Fallback mock user (dev mode / Supabase not configured) ───────
const MOCK_USER = {
  id:'usr-mock-001', name:'Arjun Kumar', initials:'AK',
  email: localStorage.getItem('tryit_email') || 'demo@tryiteducations.net',
  state:'Tamil Nadu', city:'Coimbatore',
  role: localStorage.getItem('tryit_role') || 'student',
  level:4, levelTitle:'The Gold Miner', levelEmoji:'⛏️',
  xp:6240, xpToNext:8000, coins:1247, streak:12, streakFreezes:2,
  isPro: false, plan:'free',
  userId:'TRY-TN-00001-2026', joinDate:'January 2026',
  rank:1243, testsCompleted:23, avgScore:78,
  studyHours:'48h', guruPoints:847,
  exams:[
    { id:'ssc-cgl',  name:'SSC CGL',  readiness:67, examDate:'Aug 2026'  },
    { id:'upsc-cse', name:'UPSC CSE', readiness:34, examDate:'May 2026'  },
    { id:'ibps-po',  name:'IBPS PO',  readiness:45, examDate:'Jul 2026'  },
  ],
  subjects:[
    { name:'Quant',     accuracy:82, trend:'up',   emoji:'📐' },
    { name:'Reasoning', accuracy:90, trend:'up',   emoji:'🧠' },
    { name:'English',   accuracy:68, trend:'down', emoji:'📝' },
    { name:'GK',        accuracy:75, trend:'up',   emoji:'🌏' },
  ],
}

const IS_DEV = !import.meta.env.VITE_SUPABASE_URL ||
               import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

const AuthCtx = createContext({})

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState('idle') // idle|syncing|synced|offline

  // ── App start: restore session (like WhatsApp opening) ──────────
  useEffect(() => {
    initSession()
  }, [])

  async function initSession() {
    setLoading(true)

    // Step 1: Instant restore from device cache (0ms — like WhatsApp)
    const cached = localDb.getProfileFast()
    const session = localDb.getSession()

    if (cached && session) {
      // Show user their previous state immediately
      setUser(buildUser(cached))
      setLoading(false)
      setSyncStatus('syncing')

      // Step 2: Background delta sync (like WhatsApp loading new messages)
      try {
        const { profile, source } = await deltaSync(session.userId, session.email)
        if (profile) setUser(buildUser(profile))
        setSyncStatus(source === 'offline' ? 'offline' : 'synced')
        // Start background services
        startOutboxFlush(session.userId)
      } catch {
        setSyncStatus('offline')
      }
      return
    }

    // No cached session — check Supabase auth
    if (!IS_DEV) {
      try {
        const { data: { session: supaSession } } = await supabase.auth.getSession()
        if (supaSession) {
          await loadSupabaseUser(supaSession.user)
          return
        }
      } catch {}
    }

    // Dev mode or no session — use mock
    if (IS_DEV) {
      const email = localStorage.getItem('tryit_email')
      if (email) {
        const grantedUser = applyAdminGrant(MOCK_USER, email)
        setUser(grantedUser)
        localDb.saveProfile(grantedUser)
        localDb.saveSession({ userId: grantedUser.id, email })
      }
    }

    setLoading(false)
  }

  async function loadSupabaseUser(supaUser) {
    const { profile } = await deltaSync(supaUser.id, supaUser.email)
    if (profile) {
      const u = buildUser(profile)
      setUser(u)
      localDb.saveSession({ userId: supaUser.id, email: supaUser.email })
      startOutboxFlush(supaUser.id)

      // Realtime: rank changes, notifications, battle updates
      startRealtimeSync(supaUser.id, {
        onRankChange: (newRank) => setUser(p => ({ ...p, rank: newRank })),
        onNotification: (n) => {
          const notifs = JSON.parse(localStorage.getItem('tryit_unread_notifs')||'[]')
          localStorage.setItem('tryit_unread_notifs', JSON.stringify([n, ...notifs]))
        },
      })
    }
    setLoading(false)
    setSyncStatus('synced')
  }

  function applyAdminGrant(user, email) {
    try {
      const grants = JSON.parse(localStorage.getItem('tryit_pro_grants')||'[]')
      const grant  = grants.find(g =>
        g.email?.toLowerCase() === email?.toLowerCase() &&
        new Date(g.expiresAt) > new Date()
      )
      if (grant) return { ...user, isPro: true, plan: grant.plan, grantInfo: grant }
    } catch {}
    return user
  }

  function buildUser(profile) {
    const email = profile.email || localStorage.getItem('tryit_email') || ''
    const u = {
      ...MOCK_USER,        // defaults for missing fields
      ...profile,          // server data overrides
      initials: (profile.name||'U').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
      levelTitle: getLevelTitle(profile.level || 1),
      levelEmoji: getLevelEmoji(profile.level || 1),
      xpToNext:   getLevelXP(profile.level || 1),
      isPro: !!(profile.plan && profile.plan !== 'free' && profile.plan_expires && new Date(profile.plan_expires) > new Date()),
    }
    return applyAdminGrant(u, email)
  }

  // ── Auth actions ─────────────────────────────────────────────────
  const login = async (email, role='student') => {
    localStorage.setItem('tryit_email', email.toLowerCase())
    localStorage.setItem('tryit_role', role)

    if (IS_DEV) {
      // Dev: instant mock login
      const u = applyAdminGrant({ ...MOCK_USER, email, role }, email)
      setUser(u)
      localDb.saveProfile(u)
      localDb.saveSession({ userId: u.id, email })
      return { error: null }
    }

    // Production: Supabase OTP
    return supabase.auth.signInWithOtp({ email })
  }

  const verifyOTP = async (email, token) => {
    if (IS_DEV) {
      // Dev: any 6 digits work
      return login(email)
    }
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type:'email' })
    if (data?.user) await loadSupabaseUser(data.user)
    return { error }
  }

  const logout = () => {
    localDb.clearSession()
    localStorage.removeItem('tryit_email')
    localStorage.removeItem('tryit_role')
    if (!IS_DEV) supabase.auth.signOut()
    setUser(null)
    window.location.href = '/login'
  }

  // Update user state locally (instantly, syncs in background)
  const updateUser = async (changes) => {
    const updated = { ...user, ...changes }
    setUser(updated)
    localDb.saveProfile(updated)
    if (!IS_DEV && user?.id) {
      supabase.from('profiles').update(changes).eq('id', user.id).then(()=>{})
    }
  }

  return (
    <AuthCtx.Provider value={{
      user, loading, syncStatus,
      isAuthenticated: !!user,
      login, verifyOTP, logout, updateUser,
      profile: user,
    }}>
      {!loading && children}
    </AuthCtx.Provider>
  )
}

// ── Level helpers ─────────────────────────────────────────────────
const LEVELS = [
  { l:1, title:'The Fierce One', emoji:'🔥', xp:500    },
  { l:2, title:'The Fighter',    emoji:'⚔️', xp:1500   },
  { l:3, title:'The Riser',      emoji:'📈', xp:3000   },
  { l:4, title:'The Gold Miner', emoji:'⛏️', xp:6000   },
  { l:5, title:'The Grinder',    emoji:'💪', xp:10000  },
  { l:6, title:'Baahuveer',      emoji:'🦁', xp:16000  },
  { l:7, title:'Thalavan',       emoji:'👑', xp:24000  },
  { l:8, title:'Unstoppable',    emoji:'⚡', xp:35000  },
  { l:9, title:'The Legend',     emoji:'🌟', xp:50000  },
  { l:10,title:'The Absolute',   emoji:'🏆', xp:999999 },
]
function getLevelTitle(l) { return LEVELS[Math.min(l,10)-1]?.title || 'The Absolute' }
function getLevelEmoji(l) { return LEVELS[Math.min(l,10)-1]?.emoji || '🏆' }
function getLevelXP(l)    { return LEVELS[Math.min(l,10)-1]?.xp    || 999999 }

export const getLevelInfo = (l) => LEVELS[Math.min(l,10)-1] || LEVELS[9]
export const useAuth = () => useContext(AuthCtx)
