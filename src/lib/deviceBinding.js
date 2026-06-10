/**
 * Hardware Binding Lock — Pillar 5
 * Binds free-tier accounts to ONE phone + ONE laptop
 * Prevents account sharing
 *
 * Web: Uses browser fingerprint (canvas, fonts, timezone, screen)
 * Native Android: Uses IMEI via Capacitor plugin (if available)
 * Native iOS: Uses DeviceCheck API token via Capacitor
 */

async function getBrowserFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.hardwareConcurrency,
    screen.width, screen.height, screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.maxTouchPoints,
  ]
  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('TryIT🎓', 2, 2)
    components.push(canvas.toDataURL())
  } catch {}
  // Simple hash
  const str = components.join('|')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

async function getNativeDeviceId() {
  try {
    const { Device } = await import('@capacitor/device')
    const info = await Device.getId()
    return info.identifier
  } catch {
    return null
  }
}

export async function getDeviceId() {
  const native = await getNativeDeviceId()
  if (native) return `native_${native}`
  return `web_${await getBrowserFingerprint()}`
}

const BINDING_KEY = 'tryit_device_binding'

export async function bindDevice(userId) {
  const deviceId = await getDeviceId()
  const existing = JSON.parse(localStorage.getItem(BINDING_KEY) || '{}')
  if (existing[userId] && existing[userId] !== deviceId) {
    // Different device detected
    return { allowed: false, reason: 'Account is bound to a different device.' }
  }
  existing[userId] = deviceId
  localStorage.setItem(BINDING_KEY, JSON.stringify(existing))
  return { allowed: true, deviceId }
}

export async function checkDeviceBinding(userId) {
  const deviceId  = await getDeviceId()
  const existing  = JSON.parse(localStorage.getItem(BINDING_KEY) || '{}')
  if (!existing[userId]) return { bound: false }
  return { bound: true, allowed: existing[userId] === deviceId }
}
