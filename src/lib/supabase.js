import { createClient } from '@supabase/supabase-js'

const URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://placeholder.supabase.co'
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(URL, ANON, {
  auth: {
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
})

// ── Visibility helpers ────────────────────────────────────────────
// PUBLIC data: leaderboard, hall battles, tournaments, game scores, doubts
// PRIVATE data: individual test results, analytics, coin balance, weak subjects

export const PublicData = {
  // Anyone can see national/state leaderboard
  leaderboard: (limit=50) =>
    supabase.from('leaderboard_daily')
      .select('user_name,user_level,user_state,score,rank_national,exam_id')
      .order('rank_national')
      .limit(limit),

  // Anyone can see active halls and battles
  halls: () =>
    supabase.from('halls').select('id,name,emoji,subject,total_score,streak,rank,is_public').eq('is_public', true).order('rank'),

  battles: () =>
    supabase.from('hall_battles').select('*').in('status', ['live','upcoming']).order('starts_at'),

  // Anyone can see tournaments
  tournaments: () =>
    supabase.from('tournaments').select('*').order('starts_at'),

  // Public doubts
  doubts: (examId, limit=20) =>
    supabase.from('doubts').select('*,profiles(name,level)').eq('is_public', true)
      .eq('exam_id', examId).order('created_at', { ascending:false }).limit(limit),
}

export const PrivateData = {
  // Only the user sees their test results
  myResults: (userId, limit=20) =>
    supabase.from('test_results').select('*').eq('user_id', userId)
      .order('taken_at', { ascending:false }).limit(limit),

  // Only user sees their coins
  myCoins: (userId) =>
    supabase.from('coin_transactions').select('*').eq('user_id', userId)
      .order('created_at', { ascending:false }).limit(100),

  // Only user sees their notifications
  myNotifications: (userId) =>
    supabase.from('notifications').select('*').eq('user_id', userId)
      .order('created_at', { ascending:false }).limit(50),

  // Profile (user sees own, public sees name/level/state only)
  myProfile: (userId) =>
    supabase.from('profiles').select('*').eq('id', userId).single(),
}

export default supabase
