/**
 * TryIT Security Layer
 * 1. Anti-reverse-debug (DevTools detection + console disable)
 * 2. Watermarked social sharing (Canvas API)
 * 3. Screenshot blur on sensitive content
 * 4. Content velocity limiter
 */

const IS_PROD = import.meta.env.PROD

// ══════════════════════════════════════════════════════════════════
// 1. ANTI-REVERSE-DEBUG
// ══════════════════════════════════════════════════════════════════

export function initSecurityLayer() {
  if (!IS_PROD) return // dev mode: no restrictions

  // Disable all console methods in production
  const noop = () => {}
  ;['log','warn','error','info','debug','table','trace','dir'].forEach(m => {
    try { console[m] = noop } catch {}
  })

  // DevTools detection (size-change method)
  let devtoolsOpen = false
  const threshold  = 160

  const detectDevtools = () => {
    const widthDiff  = window.outerWidth  - window.innerWidth  > threshold
    const heightDiff = window.outerHeight - window.innerHeight > threshold
    if ((widthDiff || heightDiff) && !devtoolsOpen) {
      devtoolsOpen = true
      handleDevtoolsOpen()
    } else if (!widthDiff && !heightDiff && devtoolsOpen) {
      devtoolsOpen = false
    }
  }

  setInterval(detectDevtools, 1000)

  // Debug timing trick (loops take longer when devtools open)
  setInterval(() => {
    const start = performance.now()
    // eslint-disable-next-line no-debugger
    debugger // pauses here if devtools open → measures time
    if (performance.now() - start > 100) handleDevtoolsOpen()
  }, 3000)

  // Right-click disable on sensitive content (not globally)
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('[data-secure]')) {
      e.preventDefault()
      return false
    }
  })

  // F12 key intercept
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))) {
      e.preventDefault()
      logSuspiciousActivity('devtools_hotkey')
    }
  })
}

function handleDevtoolsOpen() {
  logSuspiciousActivity('devtools_opened')
  // Don't block the app — just log it
  // Aggressive blocking causes false positives and hurts real users
}

function logSuspiciousActivity(type) {
  try {
    const logs = JSON.parse(localStorage.getItem('tryit_sec_log') || '[]')
    logs.push({ type, at: Date.now(), url: window.location.pathname })
    if (logs.length > 50) logs.splice(0, logs.length - 50)
    localStorage.setItem('tryit_sec_log', JSON.stringify(logs))
  } catch {}
}

// ══════════════════════════════════════════════════════════════════
// 2. WATERMARKED SOCIAL SHARING
// Canvas API draws watermark → converts to image → share
// ══════════════════════════════════════════════════════════════════

export async function createWatermarkedShare({ type, data, userId, userName }) {
  const canvas  = document.createElement('canvas')
  canvas.width  = 1080
  canvas.height = 1080
  const ctx     = canvas.getContext('2d')

  // Background gradient based on type
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
  if (type === 'result') {
    grad.addColorStop(0, '#1E3A5F')
    grad.addColorStop(1, '#0F2140')
  } else if (type === 'rank') {
    grad.addColorStop(0, '#7B2400')
    grad.addColorStop(1, '#D4AF37')
  } else {
    grad.addColorStop(0, '#064E3B')
    grad.addColorStop(1, '#1E3A5F')
  }

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1080, 1080)

  // Decorative circles
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = '#D4AF37'
  ctx.lineWidth = 3
  ;[200,350,500,650].forEach(r => {
    ctx.beginPath()
    ctx.arc(540, 540, r, 0, Math.PI * 2)
    ctx.stroke()
  })
  ctx.globalAlpha = 1

  // Logo text
  ctx.font = 'bold 52px Arial'
  ctx.fillStyle = '#D4AF37'
  ctx.textAlign = 'center'
  ctx.fillText('TRYIT', 540, 140)
  ctx.font = '18px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.letterSpacing = '6px'
  ctx.fillText('EDUCATIONS', 540, 168)

  // Main content
  if (type === 'result') {
    ctx.font = 'bold 180px Arial'
    ctx.fillStyle = data.passed ? '#22C55E' : '#EF4444'
    ctx.textAlign = 'center'
    ctx.fillText(`${data.score}%`, 540, 460)

    ctx.font = 'bold 36px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(data.examName, 540, 540)

    ctx.font = '28px Arial'
    ctx.fillStyle = data.passed ? '#4ADE80' : '#FCA5A5'
    ctx.fillText(data.passed ? '✅ Passed' : '❌ Below Cutoff', 540, 596)

    ctx.font = 'bold 28px Arial'
    ctx.fillStyle = '#D4AF37'
    ctx.fillText(`All India Rank: #${data.rank?.toLocaleString() || '---'}`, 540, 660)

  } else if (type === 'streak') {
    ctx.font = 'bold 140px Arial'
    ctx.fillStyle = '#F97316'
    ctx.textAlign = 'center'
    ctx.fillText('🔥', 540, 440)

    ctx.font = 'bold 80px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(`${data.days} Days`, 540, 560)

    ctx.font = '32px Arial'
    ctx.fillStyle = '#D4AF37'
    ctx.fillText('Study Streak!', 540, 620)

  } else if (type === 'achievement') {
    ctx.font = '100px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(data.emoji || '🏆', 540, 420)
    ctx.font = 'bold 60px Arial'
    ctx.fillStyle = '#D4AF37'
    ctx.fillText(data.title, 540, 520)
    ctx.font = '28px Arial'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText(data.subtitle || '', 540, 580)
  }

  // User name
  ctx.font = '24px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.textAlign = 'center'
  ctx.fillText(userName || 'TryIT Student', 540, 820)

  // ── WATERMARK (non-removable, baked into pixel data) ──────────
  ctx.globalAlpha = 0.18
  ctx.font = 'bold 22px Arial'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'

  // Diagonal watermark tiles
  ctx.save()
  ctx.translate(540, 540)
  ctx.rotate(-Math.PI / 6)
  for (let x = -600; x < 600; x += 300) {
    for (let y = -600; y < 600; y += 160) {
      ctx.fillText(`tryiteducations.net · ${userId?.slice(-8) || 'tryit'}`, x, y)
    }
  }
  ctx.restore()
  ctx.globalAlpha = 1

  // Bottom bar
  ctx.fillStyle = 'rgba(212,175,55,0.15)'
  ctx.fillRect(0, 920, 1080, 160)
  ctx.font = '22px Arial'
  ctx.fillStyle = '#D4AF37'
  ctx.textAlign = 'center'
  ctx.fillText('Your Exam. Your Rank. Your Success.', 540, 970)
  ctx.font = '18px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('tryiteducations.net', 540, 1010)

  // Convert to blob and share
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'tryit-result.png', { type:'image/png' })

      if (navigator.share && navigator.canShare?.({ files:[file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My TryIT Result',
            text: `I scored ${data.score || ''}% on ${data.examName || 'TryIT'}! 🚀\nJoin me: tryiteducations.net`,
          })
          resolve({ shared: true })
        } catch { resolve({ shared: false }) }
      } else {
        // Fallback: download image
        const url = URL.createObjectURL(blob)
        const a   = document.createElement('a')
        a.href = url; a.download = 'tryit-result.png'; a.click()
        URL.revokeObjectURL(url)
        resolve({ shared: true, downloaded: true })
      }
    }, 'image/png', 0.92)
  })
}

// ══════════════════════════════════════════════════════════════════
// 3. SCREENSHOT BLUR (sensitive content protection)
// ══════════════════════════════════════════════════════════════════

export function initScreenshotProtection() {
  // Blur sensitive content when tab loses focus
  // (catches screenshots via Cmd+Shift+4 or screen recording)
  document.addEventListener('visibilitychange', () => {
    const sensitiveEls = document.querySelectorAll('[data-secure]')
    if (document.hidden) {
      sensitiveEls.forEach(el => {
        el.style.filter = 'blur(12px)'
        el.style.userSelect = 'none'
      })
    } else {
      sensitiveEls.forEach(el => {
        el.style.filter = ''
        el.style.userSelect = ''
      })
    }
  })
}

// ══════════════════════════════════════════════════════════════════
// 4. CONTENT VELOCITY LIMITER
// Free users: 50 questions/day, 3 full tests/day
// ══════════════════════════════════════════════════════════════════

const VELOCITY_KEY  = () => `tryit_velocity_${new Date().toISOString().split('T')[0]}`
const FREE_Q_LIMIT  = 50    // questions per day
const FREE_T_LIMIT  = 3     // full tests per day
const PRO_Q_LIMIT   = 99999 // unlimited
const PRO_T_LIMIT   = 99999

function getVelocity() {
  try { return JSON.parse(localStorage.getItem(VELOCITY_KEY()) || '{"q":0,"t":0}') }
  catch { return { q:0, t:0 } }
}
function saveVelocity(v) { localStorage.setItem(VELOCITY_KEY(), JSON.stringify(v)) }

export function checkQuestionLimit(isPro = false) {
  const limit = isPro ? PRO_Q_LIMIT : FREE_Q_LIMIT
  const v     = getVelocity()
  if (v.q >= limit) {
    return {
      allowed: false,
      used:    v.q,
      limit,
      reset:   'Tomorrow 12:00 AM',
      message: isPro
        ? 'Something went wrong'
        : `You've used all ${limit} free questions today. Upgrade to Pro for unlimited access!`,
    }
  }
  v.q++
  saveVelocity(v)
  return { allowed: true, used: v.q, limit }
}

export function checkTestLimit(isPro = false) {
  const limit = isPro ? PRO_T_LIMIT : FREE_T_LIMIT
  const v     = getVelocity()
  if (v.t >= limit) {
    return {
      allowed: false,
      used:    v.t,
      limit,
      message: `You've taken ${limit} free tests today. Upgrade to Pro or try again tomorrow!`,
    }
  }
  v.t++
  saveVelocity(v)
  return { allowed: true, used: v.t, limit }
}

export function getVelocityStatus(isPro = false) {
  const v = getVelocity()
  return {
    questionsUsed:  v.q,
    questionsLeft:  Math.max(0, (isPro?PRO_Q_LIMIT:FREE_Q_LIMIT) - v.q),
    testsUsed:      v.t,
    testsLeft:      Math.max(0, (isPro?PRO_T_LIMIT:FREE_T_LIMIT) - v.t),
    isPro,
  }
}
