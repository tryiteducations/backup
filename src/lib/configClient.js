// src/lib/configClient.js
// Shared read-only client for admin-controlled system_config values.
// Used by Landing page pricing/equity/donation sections so a single
// admin edit (Admin Dashboard -> Config tab) updates every page at once.
import { supabase } from './supabase'

let cache = null
let cacheTime = 0
const CACHE_MS = 60 * 1000 // 1 minute - keeps pages fast, still near-live

export async function getConfig() {
  const now = Date.now()
  if (cache && (now - cacheTime) < CACHE_MS) return cache

  try {
    const { data, error } = await supabase.from('system_config').select('key, value')
    if (error) throw error
    const flat = {}
    ;(data || []).forEach(row => {
      try { flat[row.key] = JSON.parse(row.value) }
      catch { flat[row.key] = row.value }
    })
    cache = flat
    cacheTime = now
    return flat
  } catch {
    try {
      const local = JSON.parse(localStorage.getItem('tryit_admin_config') || '{}')
      return local
    } catch {
      return {}
    }
  }
}

export function getConfigValue(config, key, fallback) {
  if (config && config[key] !== undefined && config[key] !== null && config[key] !== '') {
    return config[key]
  }
  return fallback
}
