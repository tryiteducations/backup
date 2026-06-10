// src/lib/localDb.js
// IndexedDB wrapper for TryIT local-first architecture
// Mirrors WhatsApp/Telegram pattern: device = primary DB

const DB_NAME    = 'TryITDB'
const DB_VERSION = 1
const STORES     = ['questions', 'exams', 'userProgress', 'testResults', 'outbox', 'syncMeta']

let _db = null

function openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      STORES.forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' })
        }
      })
    }
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db) }
    req.onerror   = (e) => reject(e.target.error)
  })
}

function tx(store, mode = 'readonly') {
  return openDB().then(db => db.transaction(store, mode).objectStore(store))
}

export async function saveQuestions(questions) {
  const s = await tx('questions', 'readwrite')
  return Promise.all(questions.map(q => new Promise((res, rej) => {
    const r = s.put(q); r.onsuccess = res; r.onerror = rej
  })))
}

export async function getQuestionsByExam(examId, limit = 25) {
  const s = await tx('questions')
  return new Promise((res, rej) => {
    const results = []; const req = s.openCursor()
    req.onsuccess = (e) => {
      const cur = e.target.result
      if (cur && results.length < limit) {
        if (!examId || cur.value.exam_id === examId) results.push(cur.value)
        cur.continue()
      } else res(results)
    }
    req.onerror = rej
  })
}

export async function saveTestResult(result) {
  // TODO: replace with Supabase sync
  const r = { ...result, id: result.id || `tr-${Date.now()}`, synced: false, savedAt: Date.now() }
  const s = await tx('testResults', 'readwrite')
  return new Promise((res, rej) => {
    const req = s.put(r); req.onsuccess = res; req.onerror = rej
  })
}

export async function getOfflineTestResults() {
  // Returns results not yet synced to Supabase
  // TODO: replace with Supabase sync
  const s = await tx('testResults')
  return new Promise((res, rej) => {
    const results = []; const req = s.openCursor()
    req.onsuccess = (e) => {
      const cur = e.target.result
      if (cur) { if (!cur.value.synced) results.push(cur.value); cur.continue() }
      else res(results)
    }
    req.onerror = rej
  })
}

export async function markResultSynced(id) {
  const s = await tx('testResults', 'readwrite')
  return new Promise((res, rej) => {
    const get = s.get(id)
    get.onsuccess = (e) => {
      if (!e.target.result) { res(); return }
      const put = s.put({ ...e.target.result, synced: true })
      put.onsuccess = res; put.onerror = rej
    }
    get.onerror = rej
  })
}

export async function saveExams(exams) {
  const s = await tx('exams', 'readwrite')
  return Promise.all(exams.map(e => new Promise((res, rej) => {
    const r = s.put(e); r.onsuccess = res; r.onerror = rej
  })))
}

export async function addToOutbox(eventType, payload) {
  const s = await tx('outbox', 'readwrite')
  const item = { id: `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    event_type: eventType, payload, created_at: Date.now(), attempts: 0 }
  return new Promise((res, rej) => {
    const r = s.put(item); r.onsuccess = () => res(item); r.onerror = rej
  })
}

export async function getOutbox() {
  const s = await tx('outbox')
  return new Promise((res, rej) => {
    const req = s.getAll(); req.onsuccess = (e) => res(e.target.result); req.onerror = rej
  })
}

export async function removeFromOutbox(id) {
  const s = await tx('outbox', 'readwrite')
  return new Promise((res, rej) => {
    const r = s.delete(id); r.onsuccess = res; r.onerror = rej
  })
}

// Fallback: if IndexedDB unavailable (SSR / private browsing), use localStorage
export const idbAvailable = typeof indexedDB !== 'undefined'

export default { saveQuestions, getQuestionsByExam, saveTestResult, getOfflineTestResults,
  markResultSynced, saveExams, addToOutbox, getOutbox, removeFromOutbox }
