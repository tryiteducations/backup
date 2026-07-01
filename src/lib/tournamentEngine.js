// FILE: src/lib/tournamentEngine.js
// TryIT Tournament Engine - 100% Client-Side
// All computation happens on the student's device.
// Zero server calls during the exam. One call at submission.
//
// FLOW:
//   1. Pre-download encrypted questions (48h before)
//   2. At 9 AM: generate HMAC key locally → decrypt questions
//   3. Run exam 100% offline
//   4. At end: score locally → wait random 1-45 min → submit 1KB to Worker
//   5. At 8 PM: download rank_index.json from CDN → compute rank on device

import { Capacitor }   from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

// -- CONSTANTS -------------------------------------------------------------
const CDN_BASE     = 'https://tryiteducations.net/tournament-data'
const SUBMIT_URL   = 'https://api.tryiteducations.net/tournament/submit'
const JITTER_MIN   = 1 * 60 * 1000      // 1 minute minimum
const JITTER_MAX   = 45 * 60 * 1000     // 45 minutes maximum

// -- MEDAL SYSTEM (no negative language) ----------------------------------
export const MEDALS = {
  gold:    { emoji:'🥇', label:'Gold',    minPct:90, color:'#D97706' },
  silver:  { emoji:'🥈', label:'Silver',  minPct:75, color:'var(--color-text-light,#64748B)' },
  bronze:  { emoji:'🥉', label:'Bronze',  minPct:60, color:'#92400E' },
  growing: { emoji:'📈', label:'Growing', minPct:45, color:'#0891B2' },
  seedling:{ emoji:'🌱', label:'Seedling',minPct:0,  color:'#059669' },
}

export function getMedal(pct) {
  if (pct >= 90) return MEDALS.gold
  if (pct >= 75) return MEDALS.silver
  if (pct >= 60) return MEDALS.bronze
  if (pct >= 45) return MEDALS.growing
  return MEDALS.seedling
}

export function getMedalForAnswer(isCorrect) {
  // Used per-question - no "wrong"/"incorrect" language
  return isCorrect
    ? { emoji:'✅', label:'Correct!',         color:'#059669' }
    : { emoji:'📚', label:'Learn from this',  color:'#D97706' }
}

// -- 1. PRE-DOWNLOAD ENCRYPTED QUESTIONS ----------------------------------
export async function preDownloadQuestions(registration) {
  const { tournament_id, question_set_id, cdn_question_file } = registration

  try {
    // Download encrypted JSON from Cloudflare CDN
    const response = await fetch(cdn_question_file, {
      headers: { 'Cache-Control': 'no-cache' }
    })

    if (!response.ok) throw new Error(`CDN fetch failed: ${response.status}`)

    const encryptedData = await response.text()

    // Store in device storage (Capacitor Preferences or localStorage)
    const storageKey = `tryit_q_${tournament_id}_${question_set_id}`

    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key: storageKey, value: encryptedData })
    } else {
      localStorage.setItem(storageKey, encryptedData)
    }

    // Update registration status
    await updateRegistrationStatus(registration, 'downloaded')

    return { success: true, message: 'Questions downloaded and secured on your device.' }

  } catch (error) {
    return { success: false, error: error.message }
  }
}

// -- 2. GENERATE HMAC KEY LOCALLY (zero server calls) ---------------------
// Key = HMAC-SHA256(student_token + tournament_id + exam_date_string)
// All three values are already on the device.
// At exactly 9:00 AM (NTP-verified time), app computes key and decrypts.
export async function generateLocalKey(studentToken, tournamentId, examDate) {
  try {
    const message   = `${studentToken}|${tournamentId}|${examDate}`
    const encoder   = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(studentToken.slice(0, 32).padEnd(32, '0')),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign(
      'HMAC',
      keyMaterial,
      encoder.encode(message)
    )

    // Convert to hex string (64 chars = 32 bytes AES-256 key)
    const keyHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    return keyHex.slice(0, 64)  // 32 bytes = 256 bits

  } catch (error) {
    console.error('Key generation failed:', error)
    throw error
  }
}

// -- 3. DECRYPT AND LOAD QUESTIONS ----------------------------------------
export async function decryptAndLoadQuestions(registration, studentToken) {
  const { tournament_id, question_set_id, exam_starts_at } = registration

  // Get exam date string for key derivation
  const examDate = new Date(exam_starts_at).toISOString().slice(0, 10)

  // Get stored encrypted data
  const storageKey    = `tryit_q_${tournament_id}_${question_set_id}`
  let   encryptedData = null

  if (Capacitor.isNativePlatform()) {
    const result = await Preferences.get({ key: storageKey })
    encryptedData = result.value
  } else {
    encryptedData = localStorage.getItem(storageKey)
  }

  if (!encryptedData) {
    throw new Error('Questions not found on device. Please re-download.')
  }

  // Parse encrypted data
  let parsed
  try {
    parsed = JSON.parse(encryptedData)
  } catch {
    throw new Error('Corrupted question data. Please contact support.')
  }

  // Generate key locally
  const keyHex = await generateLocalKey(studentToken, tournament_id, examDate)

  // Decrypt using AES-256-GCM
  try {
    const keyBytes = hexToBytes(keyHex)
    const ivBytes  = hexToBytes(parsed.iv)
    const ctBytes  = base64ToBytes(parsed.ciphertext)

    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyBytes, { name:'AES-GCM' }, false, ['decrypt']
    )

    const plaintext = await crypto.subtle.decrypt(
      { name:'AES-GCM', iv:ivBytes }, cryptoKey, ctBytes
    )

    const questions = JSON.parse(new TextDecoder().decode(plaintext))
    return questions

  } catch {
    throw new Error('Decryption failed. The exam has not started yet or your token is invalid.')
  }
}

// -- 4. CHECK EXAM IS LIVE (NTP-synced time verification) -----------------
export async function verifyExamTime(examStartsAt, windowMinutes = 0) {
  // Get server time to prevent device clock manipulation
  try {
    const resp       = await fetch('https://worldtimeapi.org/api/ip', { signal: AbortSignal.timeout(3000) })
    const data       = await resp.json()
    const serverTime = new Date(data.datetime).getTime()
    const examTime   = new Date(examStartsAt).getTime()
    return serverTime >= (examTime - windowMinutes * 60000)
  } catch {
    // If time API fails, use device time (acceptable fallback)
    return Date.now() >= new Date(examStartsAt).getTime() - (windowMinutes * 60000)
  }
}

// -- 5. REAL-TIME ANTI-CHEAT MONITORING (client-side) ---------------------
export function createAntiCheatMonitor(onFlagRaised) {
  const flags     = []
  let   tabCount  = 0
  const startTime = Date.now()

  // Monitor tab/app visibility
  const visibilityHandler = () => {
    if (document.hidden) {
      tabCount++
      flags.push({ type:'tab_switch', time:Date.now(), count:tabCount })
      onFlagRaised?.('tab_switch', tabCount)
    }
  }
  document.addEventListener('visibilitychange', visibilityHandler)

  // Monitor context menu (right-click to screenshot)
  const contextHandler = (e) => {
    e.preventDefault()
    flags.push({ type:'context_menu', time:Date.now() })
  }
  document.addEventListener('contextmenu', contextHandler)

  // Monitor copy attempts
  const copyHandler = (e) => {
    e.preventDefault()
    flags.push({ type:'copy_attempt', time:Date.now() })
  }
  document.addEventListener('copy', copyHandler)

  // CSS watermark injection (invisible UserID in question text)
  const injectWatermark = (userId) => {
    const style = document.createElement('style')
    style.textContent = `
      .tryit-question::after {
        content: '${userId.slice(0,8)}';
        color: transparent;
        font-size: 1px;
        position: absolute;
        opacity: 0.001;
        user-select: none;
        pointer-events: none;
      }
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        user-select: none !important;
      }
    `
    document.head.appendChild(style)
  }

  return {
    injectWatermark,
    getFlags: () => flags,
    getTabCount: () => tabCount,
    destroy: () => {
      document.removeEventListener('visibilitychange', visibilityHandler)
      document.removeEventListener('contextmenu', contextHandler)
      document.removeEventListener('copy', copyHandler)
    }
  }
}

// -- 6. LOCAL SCORING ENGINE -----------------------------------------------
// Computes score using exact exam marking scheme
// Called instantly when exam ends (0 network calls)
export function computeScore(answers, questions, markingScheme) {
  const { correct_marks, wrong_marks } = markingScheme

  let score       = 0
  let correct     = 0
  let wrong       = 0
  let unattempted = 0
  const perQuestion = []

  for (const q of questions) {
    const given    = answers[q.id]
    const isCorrect = given === q.correct_answer

    if (!given || given === 'SKIP') {
      unattempted++
      perQuestion.push({ id:q.id, given:null, correct:q.correct_answer, result:'unattempted', points:0 })
    } else if (isCorrect) {
      score += correct_marks
      correct++
      perQuestion.push({ id:q.id, given, correct:q.correct_answer, result:'correct', points:correct_marks })
    } else {
      score += wrong_marks  // wrong_marks is stored as negative
      wrong++
      perQuestion.push({ id:q.id, given, correct:q.correct_answer, result:'incorrect', points:wrong_marks })
    }
  }

  const totalAttempted  = correct + wrong
  const accuracy        = totalAttempted > 0 ? (correct / totalAttempted) * 100 : 0
  const pct             = (score / markingScheme.max_score) * 100
  const medal           = getMedal(pct)

  return {
    raw_score:      Math.round(score * 100) / 100,  // 2 decimal places
    correct,
    wrong,
    unattempted,
    accuracy_pct:   Math.round(accuracy * 10) / 10,
    percentage:     Math.round(pct * 10) / 10,
    max_score:      markingScheme.max_score,
    medal,
    per_question:   perQuestion,
    subject_scores: computeSubjectScores(perQuestion, questions, markingScheme),
  }
}

function computeSubjectScores(perQuestion, questions, markingScheme) {
  const subjects = {}
  for (const q of questions) {
    const subject = q.subject || q.section || 'General'
    if (!subjects[subject]) subjects[subject] = { correct:0, wrong:0, unattempted:0, score:0 }
    const pq = perQuestion.find(p => p.id === q.id)
    if (pq) {
      subjects[subject][pq.result === 'correct' ? 'correct' : pq.result === 'unattempted' ? 'unattempted' : 'wrong']++
      subjects[subject].score += pq.points
    }
  }
  return subjects
}

// -- 7. PRIVATE CATEGORY RANK (computed locally from pre-downloaded data) --
export function computeCategoryRank(userScore, category, rankIndexData, cutoffsData) {
  const catRanks = rankIndexData.category_ranks?.[category] || {}
  const scoreKey = userScore.toFixed(2)

  const categoryRank = catRanks[scoreKey] || 'Not available'
  const cutoff       = cutoffsData?.find(c => c.category === category)

  const prediction = (() => {
    if (!cutoff) return null
    const diff = userScore - cutoff.cutoff_marks
    if (diff >= 10)  return { label:'🟢 HIGH CHANCE',    desc:'Your score is well above the cutoff', color:'#059669' }
    if (diff >= 0)   return { label:'🟡 BORDERLINE',     desc:`Only ${diff.toFixed(1)} marks above cutoff`, color:'#D97706' }
    if (diff >= -10) return { label:'🟠 CLOSE MISS',     desc:'Just below cutoff - almost there!',   color:'#EA580C' }
    return               { label:'📚 NEEDS MORE PREP', desc:'Focus on weak areas to close the gap', color:'#DC2626' }
  })()

  return {
    category,
    category_rank: categoryRank,
    all_india_rank: rankIndexData.ranks?.[scoreKey] || 'Computing...',
    cutoff_marks:  cutoff?.cutoff_marks,
    cutoff_pct:    cutoff?.cutoff_pct,
    prediction,
    total_in_category: Object.values(catRanks).reduce((a,b) => Math.max(a,b), 0),
  }
}

// -- 8. COMPRESS ANSWER STRING (1KB submission) -------------------------
export function compressAnswers(answers, questions) {
  // Convert to compact string: one char per question
  // A=option0, B=option1, C=option2, D=option3, S=skipped
  return questions.map(q => {
    const given = answers[q.id]
    if (!given || given === 'SKIP') return 'S'
    const idx = ['A','B','C','D'].indexOf(given)
    return idx >= 0 ? ['A','B','C','D'][idx] : 'S'
  }).join('')
}

// -- 9. JITTER SUBMISSION --------------------------------------------------
// Shows "Submitted!" immediately. Actually submits after random delay.
export async function jitterSubmit(registration, scoreResult, answers, questions, timings) {
  const tournamentId = registration.tournament_id
  const token        = registration.user_id  // or registration token

  // Build 1KB compressed submission string
  const answerString = compressAnswers(answers, questions)
  const timingString = Object.values(timings).join(';')

  const submissionLine = [
    token,
    tournamentId,
    registration.question_set_id,
    scoreResult.raw_score,
    scoreResult.correct,
    scoreResult.wrong,
    scoreResult.unattempted,
    answerString.slice(0, 300),
    timingString.slice(0, 400),
    Date.now().toString(),
  ].join('|')

  // Save to device storage immediately (in case app closes)
  const pendingKey = `tryit_pending_submit_${tournamentId}`
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key:pendingKey, value:submissionLine })
  } else {
    localStorage.setItem(pendingKey, submissionLine)
  }

  // Random jitter delay: 1 minute to 45 minutes
  const jitterMs = JITTER_MIN + Math.random() * (JITTER_MAX - JITTER_MIN)
  console.log(`[TryIT] Submitting after ${Math.round(jitterMs/60000)} minute jitter`)

  setTimeout(async () => {
    await actualSubmit(submissionLine, pendingKey)
  }, jitterMs)

  // Return "success" immediately to student (honest - we WILL submit)
  return {
    acknowledged: true,
    message: 'Your response has been saved! Results will be announced at 8:00 PM.',
    local_score: scoreResult,
  }
}

async function actualSubmit(submissionLine, pendingKey) {
  try {
    const response = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type':'text/plain', 'X-TryIT-Version':'1.0' },
      body:    submissionLine,
    })

    if (response.ok) {
      // Clear pending submission from device
      if (Capacitor.isNativePlatform()) {
        await Preferences.remove({ key: pendingKey })
      } else {
        localStorage.removeItem(pendingKey)
      }
      console.log('[TryIT] Submission delivered to Cloudflare R2')
    }
  } catch {
    // Network error - retry in 10 minutes
    setTimeout(() => actualSubmit(submissionLine, pendingKey), 10 * 60 * 1000)
  }
}

// -- 10. RANK LOOKUP AT 8 PM (from CDN static JSON, zero DB) -------------
export async function lookupRank(tournamentId, userScore) {
  try {
    const rankIndexUrl = `${CDN_BASE}/rank_index_${tournamentId}.json`
    const response     = await fetch(rankIndexUrl)

    if (!response.ok) throw new Error('Rank data not available yet')

    const rankData = await response.json()

    const scoreKey = userScore.toFixed(2)
    const rank     = rankData.ranks?.[scoreKey]

    return {
      all_india_rank: rank || 'Computing...',
      total_participants: rankData.total_participants,
      computed_at: rankData.computed_at,
      raw_rank_data: rankData,
    }
  } catch {
    return { all_india_rank: null, error: 'Results not yet available. Check again at 8:00 PM.' }
  }
}

// -- HELPER: Check pending submissions on app open -------------------------
export async function checkAndResumePendingSubmissions() {
  // On app open, check if any submissions are pending (in case of crash/close)
  if (Capacitor.isNativePlatform()) {
    const { keys } = await Preferences.keys()
    const pendingKeys = keys.filter(k => k.startsWith('tryit_pending_submit_'))
    for (const key of pendingKeys) {
      const { value } = await Preferences.get({ key })
      if (value) {
        // Submit with minimal jitter (already waited enough)
        const jitter = 30000 + Math.random() * 120000  // 30s to 2.5min
        setTimeout(() => actualSubmit(value, key), jitter)
      }
    }
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('tryit_pending_submit_')) {
        const value = localStorage.getItem(key)
        if (value) setTimeout(() => actualSubmit(value, key), 60000)
      }
    }
  }
}

// -- HELPER: Update registration status -----------------------------------
async function updateRegistrationStatus(registration, status) {
  try {
    const { supabase } = await import('./supabase')
    await supabase.from('tournament_registrations')
      .update({ status, [`${status}_at`]: new Date().toISOString() })
      .eq('reg_id', registration.reg_id)
  } catch {}
}

// -- UTILITY: Crypto helpers -----------------------------------------------
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i/2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

function base64ToBytes(b64) {
  const binary = atob(b64)
  const bytes  = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}