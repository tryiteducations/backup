// src/lib/realAuth.js
// Real phone-based authentication, wired to the actual Edge Functions
// (auth-register, auth-verify-session) that were built but never connected
// to the frontend. Uses reverse-SMS verification (zero cost - the USER sends
// a code to your Exotel virtual number using their own SMS app; you only
// receive, which is free).
import { supabase } from './supabase'

const JWT_STORAGE_KEY = 'tryit_auth_jwt'
const DEVICE_ID_KEY = 'tryit_device_id'

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = 'dev_' + Array.from(crypto.getRandomValues(new Uint8Array(12))).map(b => b.toString(16).padStart(2, '0')).join('')
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

export function generateRegistrationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

function decodeJwtPayload(jwt) {
  try {
    const payload = jwt.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export const realAuth = {
  // The Exotel virtual number students text their code to - set this after
  // you've signed up at exotel.com and configured the inbound webhook.
  verificationNumber: import.meta.env.VITE_EXOTEL_VMN || null,

  // Call this after the user has sent "REG-XXXXXXXX" to your Exotel number.
  // Returns { success, jwt, userId } on success, throws with a message on failure.
  async verifyAndLogin(phone, code, method = 'sms', state = null) {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    if (!/^\d{10}$/.test(cleanPhone)) throw new Error('Enter a valid 10-digit phone number.')

    const { data, error } = await supabase.functions.invoke('auth-register', {
      body: { phone: cleanPhone, method, token: code, state },
      headers: { 'x-device-id': getOrCreateDeviceId() },
    })
    if (error) throw new Error(data?.error || error.message || 'Verification failed - please try again.')
    if (data?.error) throw new Error(data.error)

    localStorage.setItem(JWT_STORAGE_KEY, data.jwt)
    return data
  },

  // Checks whether the stored JWT still represents a valid, non-revoked session.
  // Called once at app launch - this is what decides "skip login, go straight
  // to dashboard" vs "show login screen."
  async getValidSession() {
    const jwt = localStorage.getItem(JWT_STORAGE_KEY)
    if (!jwt) return null

    try {
      const { data, error } = await supabase.functions.invoke('auth-verify-session', {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      if (error || !data?.valid) {
        localStorage.removeItem(JWT_STORAGE_KEY)
        return null
      }
      return { jwt }
    } catch {
      // Network failure shouldn't silently log the user out - let them stay
      // logged in offline; the next successful check will reconcile.
      return { jwt, offline: true }
    }
  },

  logout() {
    localStorage.removeItem(JWT_STORAGE_KEY)
  },

  getStoredJwt() {
    return localStorage.getItem(JWT_STORAGE_KEY)
  },

  getUserIdFromJwt(jwt) {
    const payload = decodeJwtPayload(jwt)
    return payload?.userId || null
  },

  async fetchProfile(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error) throw error
    return data
  },
}
