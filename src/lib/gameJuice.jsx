// FILE: src/lib/gameJuice.js
// TryIT - The "Juice" Layer: sound, confetti, glitter, screen shake, sticker reveals
// Zero audio files needed - all sounds synthesized live via Web Audio API
// This is what makes games FEEL premium instead of just functioning correctly

// -- WEB AUDIO SOUND ENGINE (no mp3/wav files - generated tones) -----------
let audioCtx = null
function getCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)() }
    catch { return null }
  }
  return audioCtx
}

// Simple tone generator - builds satisfying game sounds from sine/square waves
function playTone(freq, duration, type = 'sine', volume = 0.15, delay = 0) {
  const ctx = getCtx()
  if (!ctx) return
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
  gain.gain.setValueAtTime(volume, ctx.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime + delay)
  osc.stop(ctx.currentTime + delay + duration)
}

// -- SOUND LIBRARY (every game-relevant sound, synthesized) ----------------
export const SOUNDS = {
  correct: () => {
    playTone(523.25, 0.1, 'sine', 0.12)        // C5
    playTone(783.99, 0.15, 'sine', 0.12, 0.08) // G5 - happy interval
  },
  incorrect: () => {
    playTone(200, 0.2, 'sawtooth', 0.08)
  },
  combo: (level = 1) => {
    // Rising arpeggio - gets higher pitch with bigger combo
    const base = 440 + (level * 60)
    playTone(base, 0.08, 'square', 0.1)
    playTone(base * 1.25, 0.08, 'square', 0.1, 0.07)
    playTone(base * 1.5, 0.12, 'square', 0.12, 0.14)
  },
  tick: () => playTone(800, 0.04, 'square', 0.05),
  countdown: () => playTone(440, 0.15, 'square', 0.1),
  gameStart: () => {
    playTone(392, 0.1, 'sine', 0.12)
    playTone(523.25, 0.1, 'sine', 0.12, 0.1)
    playTone(659.25, 0.2, 'sine', 0.14, 0.2)
  },
  win: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      playTone(f, 0.18, 'sine', 0.13, i * 0.1))
  },
  lose: () => {
    [392, 349.23, 293.66].forEach((f, i) =>
      playTone(f, 0.25, 'sine', 0.1, i * 0.12))
  },
  coinEarn: () => {
    playTone(987.77, 0.06, 'square', 0.1)
    playTone(1318.51, 0.1, 'square', 0.12, 0.05)
  },
  stickerUnlock: () => {
    [659.25, 830.61, 1046.5, 1318.51].forEach((f, i) =>
      playTone(f, 0.15, 'triangle', 0.1, i * 0.08))
  },
  swoosh: () => playTone(150, 0.08, 'sawtooth', 0.04),
}

// Mute toggle (persisted)
export function isSoundEnabled() {
  try { return localStorage.getItem('tryit_game_sound') !== 'off' } catch { return true }
}
export function toggleSound() {
  const enabled = isSoundEnabled()
  try { localStorage.setItem('tryit_game_sound', enabled ? 'off' : 'on') } catch {}
  return !enabled
}
export function playSound(name, ...args) {
  if (!isSoundEnabled()) return
  SOUNDS[name]?.(...args)
}


// -- CONFETTI / PARTICLE BURST (canvas-based, lightweight) -----------------
export function burstConfetti(canvas, options = {}) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  const colors = options.colors || ['#C9A84C', '#1E3A5F', '#22C55E', '#EF4444', '#7C3AED', '#FFFFFF']
  const count  = options.count || 80

  const particles = Array.from({ length: count }, () => ({
    x: width / 2 + (Math.random() - 0.5) * 60,
    y: height / 2,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 14 - 4,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 20,
    shape: Math.random() > 0.5 ? 'square' : 'circle',
    gravity: 0.4,
    life: 1,
  }))

  let frame = 0
  const maxFrames = 90

  function animate() {
    ctx.clearRect(0, 0, width, height)
    frame++

    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.vy += p.gravity
      p.rotation += p.rotSpeed
      p.life = Math.max(0, 1 - frame / maxFrames)

      ctx.save()
      ctx.globalAlpha = p.life
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.fillStyle = p.color
      if (p.shape === 'square') {
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size/2, 0, Math.PI*2)
        ctx.fill()
      }
      ctx.restore()
    })

    if (frame < maxFrames) {
      requestAnimationFrame(animate)
    } else {
      ctx.clearRect(0, 0, width, height)
    }
  }
  animate()
}

// -- GLITTER SPARKLE TRAIL (for correct answers - subtler than confetti) ---
export function burstGlitter(canvas, x, y, options = {}) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const count = options.count || 12
  const colors = options.colors || ['#C9A84C', '#FDE68A', '#FFFFFF']

  const particles = Array.from({ length: count }, () => ({
    x, y,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6 - 2,
    size: Math.random() * 3 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 1,
  }))

  let frame = 0
  function animate() {
    frame++
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.life = Math.max(0, 1 - frame / 30)
      ctx.save()
      ctx.globalAlpha = p.life
      ctx.fillStyle = p.color
      ctx.beginPath()
      // Star-ish glitter shape
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
    if (frame < 30) requestAnimationFrame(animate)
  }
  animate()
}


// -- SCREEN SHAKE (CSS-based, applied to a ref'd element) ------------------
export function screenShake(element, intensity = 'medium') {
  if (!element) return
  const presets = {
    light:  { x: 4,  duration: 200 },
    medium: { x: 8,  duration: 300 },
    heavy:  { x: 14, duration: 400 },
  }
  const { x, duration } = presets[intensity] || presets.medium

  element.style.animation = 'none'
  // Force reflow
  void element.offsetHeight
  element.style.animation = `tryit-shake ${duration}ms cubic-bezier(.36,.07,.19,.97)`

  setTimeout(() => { if (element) element.style.animation = '' }, duration)
}

// Inject shake keyframes once globally
let shakeStyleInjected = false
export function injectGameStyles() {
  if (shakeStyleInjected) return
  shakeStyleInjected = true
  const style = document.createElement('style')
  style.textContent = `
    @keyframes tryit-shake {
      10%,90% { transform: translate3d(-1px,0,0); }
      20%,80% { transform: translate3d(2px,0,0); }
      30%,50%,70% { transform: translate3d(-6px,0,0); }
      40%,60% { transform: translate3d(6px,0,0); }
    }
    @keyframes tryit-pop {
      0% { transform: scale(0.5); opacity:0; }
      60% { transform: scale(1.15); }
      100% { transform: scale(1); opacity:1; }
    }
    @keyframes tryit-float-up {
      0% { transform: translateY(0); opacity:1; }
      100% { transform: translateY(-60px); opacity:0; }
    }
    @keyframes tryit-glow-pulse {
      0%,100% { box-shadow: 0 0 0px rgba(201,168,76,0.4); }
      50% { box-shadow: 0 0 24px rgba(201,168,76,0.8); }
    }
    @keyframes tryit-count-up {
      from { transform: scale(1.4); }
      to   { transform: scale(1); }
    }
    @keyframes tryit-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .tryit-pop-in { animation: tryit-pop 0.5s cubic-bezier(.17,.89,.32,1.49); }
    .tryit-glow   { animation: tryit-glow-pulse 1.5s ease-in-out infinite; }
    .tryit-shimmer-locked {
      background: linear-gradient(110deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 60%);
      background-size: 200% 100%;
      animation: tryit-shimmer 2.5s infinite;
    }
  `
  document.head.appendChild(style)
}


// -- FLOATING SCORE POPUP (+10, +25 text that floats up and fades) ---------
export function FloatingPoints({ points, isCorrect }) {
  if (points === null) return null
  return (
    <div style={{
      position: 'fixed', top: '40%', left: '50%', transform: 'translateX(-50%)',
      zIndex: 300, pointerEvents: 'none',
      animation: 'tryit-float-up 0.7s ease-out forwards',
    }}>
      <p style={{
        fontFamily: 'Poppins,sans-serif', fontWeight: 900, fontSize: 32,
        color: isCorrect ? '#22C55E' : '#EF4444', margin: 0,
        textShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}>
        {isCorrect ? `+${points}` : '+0'}
      </p>
    </div>
  )
}


// -- STICKER COLLECTION SYSTEM ----------------------------------------------
export const STICKER_CATALOG = [
  { id:'first_win',     emoji:'🎯', label:'First Victory',      rarity:'common',    condition:'Win your first game' },
  { id:'combo_3',        emoji:'🔥', label:'Hot Streak',         rarity:'common',    condition:'Hit a 3x combo' },
  { id:'combo_10',       emoji:'🔥🔥🔥', label:'Unstoppable',    rarity:'rare',      condition:'Hit a 10x combo' },
  { id:'perfect_score',  emoji:'💯', label:'Perfectionist',      rarity:'epic',      condition:'Score 100% in any game' },
  { id:'daily_7',        emoji:'📅', label:'Week of Wisdom',     rarity:'rare',      condition:'7-day Daily Challenge streak' },
  { id:'daily_30',       emoji:'🏆', label:'Monthly Master',     rarity:'legendary', condition:'30-day Daily Challenge streak' },
  { id:'battle_win_10',  emoji:'⚔️', label:'Duelist',            rarity:'rare',      condition:'Win 10 battles' },
  { id:'all_games',      emoji:'🌟', label:'Explorer',           rarity:'epic',      condition:'Play every game at least once' },
  { id:'sports_master',  emoji:'🏅', label:'Sports Scholar',     rarity:'rare',      condition:'90%+ in Sports Mastery' },
  { id:'night_owl',      emoji:'🦉', label:'Night Owl',          rarity:'common',    condition:'Play a game after 11 PM' },
  { id:'early_bird',     emoji:'🐦', label:'Early Bird',         rarity:'common',    condition:'Play a game before 7 AM' },
  { id:'momentum_max',   emoji:'⚡', label:'Unstoppable Force',  rarity:'legendary', condition:'Reach max Momentum level' },
]

export const RARITY_STYLES = {
  common:    { color:'var(--color-text-light,#64748B)', bg:'#F1F5F9', glow:'none' },
  rare:      { color:'#1D4ED8', bg:'#DBEAFE', glow:'0 0 16px rgba(29,78,216,0.3)' },
  epic:      { color:'#7C3AED', bg:'#EDE9FE', glow:'0 0 20px rgba(124,58,237,0.4)' },
  legendary: { color:'#D97706', bg:'#FEF3C7', glow:'0 0 28px rgba(217,119,6,0.5)' },
}

export function getSticker(id) {
  return STICKER_CATALOG.find(s => s.id === id)
}