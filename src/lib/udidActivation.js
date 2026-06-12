/**
 * UDID Auto-Activation
 * When a physically challenged user's UDID is verified:
 *   → Auto-grants Pro access for life
 *   → Auto-enables accessibility mode (large text, screen reader, extended time)
 *   → Shows 🦽 badge on their profile
 *   → Extended test time (50% extra) permanently enabled
 *   → Sticky accessibility bar always visible
 */
import { earnCoins } from './coinVault'

const UDID_KEY = 'tryit_udid_verified'
const A11Y_KEY = 'tryit_a11y_mode'

export function activateUDID(udidNumber, userId) {
  // Store UDID verification
  localStorage.setItem(UDID_KEY, JSON.stringify({
    udid:        udidNumber,
    verified_at: new Date().toISOString(),
    user_id:     userId,
  }))

  // Auto-grant Pro access for life
  const grants = JSON.parse(localStorage.getItem('tryit_pro_grants') || '[]')
  const email  = localStorage.getItem('tryit_email')
  const lifeGrant = {
    id:         `udid-grant-${Date.now()}`,
    email:      email,
    plan:       'promax',
    days:       36500, // 100 years
    note:       `UDID verified: ${udidNumber}`,
    grantedAt:  new Date().toISOString(),
    expiresAt:  new Date(Date.now() + 36500*86400000).toISOString(),
    grantedBy:  'system_udid',
  }
  localStorage.setItem('tryit_pro_grants', JSON.stringify([lifeGrant, ...grants]))

  // Auto-enable full accessibility mode
  localStorage.setItem(A11Y_KEY, JSON.stringify({
    mode:          'full',
    largeText:     true,
    screenReader:  true,
    highContrast:  false,
    reducedMotion: true,
    extendedTime:  true,   // 50% extra on all tests
    voiceCommands: true,
    stickyBar:     true,
    enabledAt:     new Date().toISOString(),
  }))
  localStorage.setItem('a11y_bar', '1')
  localStorage.setItem('equity_tier', 'physically_challenged')

  // Apply font size immediately
  document.documentElement.style.fontSize = '115%'

  // Award welcome coins
  earnCoins({ source:'udid_activation', amount:500,
    description:'UDID verified — Welcome to TryIT Pro! ♿ 🎉', userId })

  return { success:true, plan:'promax', message:'Pro access activated for life! ♿' }
}

export function isUDIDVerified() {
  const d = localStorage.getItem(UDID_KEY)
  return d ? JSON.parse(d) : null
}

export function getA11ySettings() {
  try {
    return JSON.parse(localStorage.getItem(A11Y_KEY) || '{}')
  } catch { return {} }
}

export function getTestTimeMultiplier() {
  const s = getA11ySettings()
  return s.extendedTime ? 1.5 : 1.0  // 50% extra time
}

export function shouldAutoEnableA11y() {
  const s = getA11ySettings()
  return s.stickyBar || localStorage.getItem('a11y_bar') === '1'
}
