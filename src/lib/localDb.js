/**
 * LocalDB — Device is the primary database (WhatsApp pattern)
 * IndexedDB for large data, localStorage for small/fast data
 * 99.97% of reads come from here — Supabase is just sync backup
 */

const DB_NAME    = 'tryit_local_v2'
const DB_VERSION = 3

let db = null

function openDB() {
  if (db) return Promise.resolve(db)
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const d = e.target.result
      // User profile store
      if (!d.objectStoreNames.contains('profile'))
        d.createObjectStore('profile', { keyPath:'id' })
      // Test results — device-first
      if (!d.objectStoreNames.contains('test_results')) {
        const s = d.createObjectStore('test_results', { keyPath:'id' })
        s.createIndex('by_date', 'taken_at')
        s.createIndex('by_exam', 'exam_id')
      }
      // Questions cache — 50k questions stored on device
      if (!d.objectStoreNames.contains('questions')) {
        const s = d.createObjectStore('questions', { keyPath:'id' })
        s.createIndex('by_topic', 'topic_id')
        s.createIndex('by_exam',  'exam_id')
      }
      // Exams cache
      if (!d.objectStoreNames.contains('exams'))
        d.createObjectStore('exams', { keyPath:'id' })
      // Coins — all transactions local first
      if (!d.objectStoreNames.contains('coin_txs'))
        d.createObjectStore('coin_txs', { keyPath:'id', autoIncrement:true })
      // Doubts cache
      if (!d.objectStoreNames.contains('doubts'))
        d.createObjectStore('doubts', { keyPath:'id' })
      // Outbox — pending syncs to server (Telegram pattern)
      if (!d.objectStoreNames.contains('outbox'))
        d.createObjectStore('outbox', { keyPath:'id', autoIncrement:true })
      // App state — restore exact UI state
      if (!d.objectStoreNames.contains('app_state'))
        d.createObjectStore('app_state', { keyPath:'key' })
    }
    req.onsuccess = (e) => { db = e.target.result; res(db) }
    req.onerror   = (e) => rej(e.target.error)
  })
}

async function tx(storeName, mode='readonly') {
  const d = await openDB()
  return d.transaction(storeName, mode).objectStore(storeName)
}

const idbGet    = async (store, key) => new Promise(async (res,rej) => { const r=(await tx(store)).get(key); r.onsuccess=()=>res(r.result); r.onerror=rej })
const idbPut    = async (store, val) => new Promise(async (res,rej) => { const r=(await tx(store,'readwrite')).put(val); r.onsuccess=()=>res(r.result); r.onerror=rej })
const idbGetAll = async (store, idx, query, limit=100) => new Promise(async (res,rej) => {
  const s = await tx(store)
  const source = idx ? s.index(idx) : s
  const r = source.getAll(query, limit)
  r.onsuccess=()=>res(r.result); r.onerror=rej
})
const idbAdd    = async (store, val) => new Promise(async (res,rej) => { const r=(await tx(store,'readwrite')).add(val); r.onsuccess=()=>res(r.result); r.onerror=rej })
const idbCount  = async (store) => new Promise(async (res,rej) => { const r=(await tx(store)).count(); r.onsuccess=()=>res(r.result); r.onerror=rej })

// ── Profile ───────────────────────────────────────────────────
export async function saveProfile(profile) {
  await idbPut('profile', profile)
  localStorage.setItem('tryit_profile_cache', JSON.stringify({ ...profile, _cached_at: Date.now() }))
}

export function getProfileFast() {
  // Instant sync read from localStorage (like WhatsApp contact list)
  try { return JSON.parse(localStorage.getItem('tryit_profile_cache') || 'null') } catch { return null }
}

export async function getProfile(userId) {
  return idbGet('profile', userId)
}

// ── Test Results ──────────────────────────────────────────────
export async function saveTestResult(result) {
  const id = `result-${Date.now()}-${Math.random().toString(36).slice(2,5)}`
  await idbPut('test_results', { ...result, id, synced: false })
  // Add to outbox for server sync
  await addToOutbox({ type:'test_result', data: result, id })
  return id
}

export async function getTestResults(examId, limit=20) {
  if (examId) return idbGetAll('test_results', 'by_exam', examId, limit)
  return idbGetAll('test_results', null, null, limit)
}

// ── App State (restore previous UI state) ─────────────────────
export async function saveAppState(key, value) {
  await idbPut('app_state', { key, value, saved_at: Date.now() })
  localStorage.setItem(`tryit_state_${key}`, JSON.stringify(value))
}

export function getAppStateFast(key) {
  try { return JSON.parse(localStorage.getItem(`tryit_state_${key}`) || 'null') } catch { return null }
}

// ── Outbox (Telegram pattern — batch sync) ────────────────────
export async function addToOutbox(item) {
  await idbAdd('outbox', { ...item, created_at: Date.now() })
}

export async function getOutboxItems(limit=50) {
  return idbGetAll('outbox', null, null, limit)
}

export async function clearOutboxItem(id) {
  const s = await tx('outbox', 'readwrite')
  s.delete(id)
}

// ── Questions cache ───────────────────────────────────────────
export async function cacheQuestions(questions) {
  const store = await tx('questions', 'readwrite')
  for (const q of questions) store.put(q)
}

export async function getQuestionsForExam(examId, limit=20) {
  return idbGetAll('questions', 'by_exam', examId, limit)
}

export async function getQuestionCount() {
  return idbCount('questions')
}

// ── Session restore data ──────────────────────────────────────
export function saveSession(data) {
  localStorage.setItem('tryit_session', JSON.stringify({ ...data, saved_at: Date.now() }))
}

export function getSession() {
  try {
    const s = JSON.parse(localStorage.getItem('tryit_session') || 'null')
    if (!s) return null
    // Session valid for 30 days
    if (Date.now() - s.saved_at > 30 * 24 * 60 * 60 * 1000) return null
    return s
  } catch { return null }
}

export function clearSession() {
  localStorage.removeItem('tryit_session')
  localStorage.removeItem('tryit_profile_cache')
  localStorage.removeItem('tryit_email')
}

export default { saveProfile, getProfileFast, getProfile, saveTestResult, getTestResults, saveAppState, getAppStateFast, addToOutbox, getOutboxItems, clearOutboxItem, cacheQuestions, getQuestionsForExam, getQuestionCount, saveSession, getSession, clearSession }
