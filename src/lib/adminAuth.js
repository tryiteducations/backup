// src/lib/adminAuth.js
// Shared admin-session check, used by every /admin/* page.
//
// Deliberately simple right now: the token is a base64 JSON blob with
// an expiry, NOT cryptographically signed — appropriate while this
// gates only internal tooling and there are zero real users on the
// platform. See supabase/functions/admin-login/index.ts for the note
// on upgrading this to a signed session before real launch.

const ADMIN_TOKEN_KEY = 'tryit_admin_token'

function decodeToken(token) {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

export function setAdminSession(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  // Clean up old flags from before this fix, in case they're still set
  localStorage.removeItem('tryit_admin')
  localStorage.removeItem('tryit_admin_jwt')
}

export function isAdminAuthenticated() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY)
  if (!token) return false

  const payload = decodeToken(token)
  if (!payload || payload.marker !== 'admin') return false

  if (payload.exp && payload.exp < Date.now()) {
    clearAdminSession()
    return false
  }

  return true
}
