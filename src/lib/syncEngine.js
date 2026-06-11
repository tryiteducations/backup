/**
 * SyncEngine — WhatsApp+Telegram hybrid sync pattern
 *
 * WhatsApp pattern: Device = primary DB, server = backup
 *   - All reads from device (0 server cost)
 *   - Writes go to device first, outbox queues server sync
 *
 * Telegram pattern: Delta sync on login
 *   - ONE API call gets everything changed since last login
 *   - Merges server data into device DB
 *   - Result: user sees exact previous state instantly
 */
import { supabase } from './supabase'
import localDb from './localDb'
import { syncPendingTransactions } from './coinVault'

const SYNC_KEY = 'tryit_last_sync'

export function getLastSync() {
  return localStorage.getItem(SYNC_KEY) || new Date(0).toISOString()
}

function setLastSync() {
  localStorage.setItem(SYNC_KEY, new Date().toISOString())
}

/**
 * Delta sync on login (Telegram pattern)
 * ONE HTTP call → gets profile + all changes since last sync
 * Merges into local device DB
 * Returns full user state
 */
export async function deltaSync(userId, email) {
  const lastSync = getLastSync()

  // Step 1: Fast local read (instant, 0 network cost)
  const cachedProfile = localDb.getProfileFast()

  // Step 2: If cached and recent (< 5 min), skip server call
  const cacheAge = cachedProfile?._cached_at
    ? Date.now() - cachedProfile._cached_at : Infinity
  if (cacheAge < 5 * 60 * 1000) {
    console.log('[Sync] Using cached profile (fresh)')
    return { profile: cachedProfile, source: 'cache' }
  }

  // Step 3: Check admin pro grant first (critical path)
  let grantedPlan = null
  try {
    const { data: grant } = await supabase
      .rpc('check_pro_grant', { user_email: email })
    if (grant?.length) {
      grantedPlan = { plan: grant[0].plan, expires_at: grant[0].expires_at }
    }
  } catch {}

  // Step 4: Delta sync — ONE call gets everything (Telegram)
  try {
    const since = lastSync
    const [profileRes, resultsRes, notifRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('test_results')
        .select('id,exam_name,score,taken_at,rank_national,coins_earned,xp_earned')
        .eq('user_id', userId).gte('taken_at', since).limit(20),
      supabase.from('notifications')
        .select('*').eq('user_id', userId).eq('is_read', false).limit(10),
    ])

    const profile = profileRes.data
    if (!profile) throw new Error('No profile found')

    // Apply grant override if active
    if (grantedPlan) {
      profile.plan = grantedPlan.plan
      profile.plan_expires = grantedPlan.expires_at
      profile.isPro = true
    }

    // Merge new results into device DB
    for (const r of (resultsRes.data || [])) {
      await localDb.saveTestResult({ ...r, synced: true })
    }

    // Save updated profile to device
    await localDb.saveProfile(profile)

    // Store unread notifications in localStorage for fast access
    if (notifRes.data?.length) {
      localStorage.setItem('tryit_unread_notifs', JSON.stringify(notifRes.data))
    }

    setLastSync()
    return { profile, notifications: notifRes.data || [], source: 'server' }

  } catch (err) {
    console.warn('[Sync] Server unreachable, using local data:', err.message)
    // Offline fallback — serve from device (WhatsApp offline mode)
    const local = localDb.getProfileFast()
    return { profile: local, source: 'offline' }
  }
}

/**
 * Outbox flush — send queued events to server (Telegram batch pattern)
 * Runs in background every 60 seconds OR when coming online
 * Groups events in batches of 50 to minimise API calls
 */
export async function flushOutbox(userId) {
  const items = await localDb.getOutboxItems(50)
  if (!items.length) return

  // Group by type for batch processing
  const byType = {}
  for (const item of items) {
    if (!byType[item.type]) byType[item.type] = []
    byType[item.type].push(item)
  }

  // Flush test results
  if (byType.test_result?.length) {
    try {
      await supabase.from('test_results').insert(
        byType.test_result.map(i => ({ ...i.data, user_id: userId }))
      )
      for (const i of byType.test_result) await localDb.clearOutboxItem(i.id)
    } catch {}
  }

  // Flush coin transactions
  if (userId) {
    await syncPendingTransactions(userId)
  }
}

/**
 * Listen for realtime updates (like WhatsApp live updates)
 * Subscriptions for: rank changes, new doubt answers, hall battles
 */
export function startRealtimeSync(userId, callbacks={}) {
  // Rank change
  const rankChannel = supabase.channel(`rank:${userId}`)
    .on('postgres_changes', { event:'UPDATE', schema:'public', table:'profiles', filter:`id=eq.${userId}` },
      (payload) => {
        if (payload.new.rank !== payload.old?.rank) {
          callbacks.onRankChange?.(payload.new.rank, payload.old?.rank)
          localDb.saveProfile(payload.new)
        }
      }
    ).subscribe()

  // New notification
  const notifChannel = supabase.channel(`notif:${userId}`)
    .on('postgres_changes', { event:'INSERT', schema:'public', table:'notifications', filter:`user_id=eq.${userId}` },
      (payload) => callbacks.onNotification?.(payload.new)
    ).subscribe()

  // Hall battle updates (PUBLIC — anyone watching)
  const battleChannel = supabase.channel('battles:live')
    .on('postgres_changes', { event:'UPDATE', schema:'public', table:'hall_battles', filter:`status=eq.live` },
      (payload) => callbacks.onBattleUpdate?.(payload.new)
    ).subscribe()

  // Return unsubscribe function
  return () => {
    rankChannel.unsubscribe()
    notifChannel.unsubscribe()
    battleChannel.unsubscribe()
  }
}

/**
 * Auto-start outbox flush every 60 seconds
 * Like WhatsApp message delivery
 */
export function startOutboxFlush(userId) {
  const run = () => flushOutbox(userId).catch(()=>{})
  run() // immediate first run
  const interval = setInterval(run, 60000)
  window.addEventListener('online', run) // flush when back online
  return () => {
    clearInterval(interval)
    window.removeEventListener('online', run)
  }
}
