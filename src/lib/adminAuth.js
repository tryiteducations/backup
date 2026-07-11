// src/lib/adminAuth.js
// Shared admin-session check, used by every /admin/* page. Replaces the
// old localStorage.getItem('tryit_admin') flag, which was set by dead
// code (AdminLogin.jsx's real path never set it) and checked
// inconsistently — some admin pages (ExamManager, UserManager) had no
// check at all.
//
// The JWT is issued by the admin-login Edge Function only after a real
// server-side credential check (see supabase/functions/admin-login).
// This client-side decode is a signature-backed expiry/identity check
// for session persistence between page loads, not a replacement for
// the server-side check that happens at login time.

const ADMIN_JWT_KEY = 'tryit_admin_jwt'

function decodeJwtPayload(jwt) {
  try {
    const payload = jwt.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function setAdminSession(jwt) {
  localStorage.setItem(ADMIN_JWT_KEY, jwt)
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_JWT_KEY)
  // Clean up the old flag too, in case it's still set from before this fix
  localStorage.removeItem('tryit_admin')
}

export function isAdminAuthenticated() {
  const jwt = localStorage.getItem(ADMIN_JWT_KEY)
  if (!jwt) return false

  const payload = decodeJwtPayload(jwt)
  if (!payload || payload.userId !== 'admin') return false

  // exp is in seconds since epoch (standard JWT claim)
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    clearAdminSession()
    return false
  }

  return true
}
