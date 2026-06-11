#!/bin/bash
# TryIT — Backend Core (everything except question bank)
# Run this FIRST. Question bank script comes tonight.
ROOT="${1:-/workspaces/Tatu}"
cd "$ROOT"
echo "Installing TryIT backend core..."
mkdir -p src/lib src/context supabase/functions/sync-delta
mkdir -p supabase/functions/coin-transaction supabase/functions/exam-result
mkdir -p supabase/functions/leaderboard-update supabase/migrations
# ══════════════════════════════════════════════════════════════════
# BACKEND WORK 1 — Core Infrastructure
# Supabase client + Coin Vault + Visibility + Auth + Edge Functions
# ══════════════════════════════════════════════════════════════════
mkdir -p src/lib src/context supabase/functions/sync-delta
mkdir -p supabase/functions/coin-transaction supabase/functions/exam-result
mkdir -p supabase/functions/leaderboard-update supabase/functions/send-notification
mkdir -p supabase/migrations

# ── COMPLETE DATABASE SCHEMA ──────────────────────────────────────
cat > supabase/migrations/001_complete_schema.sql << 'EOF'
-- ═══════════════════════════════════════════════════════════════
-- TryIT Educations — Complete Supabase Schema
-- Run in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── PROFILES ────────────────────────────────────────────────────
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text unique not null,
  name          text,
  age           int,
  gender        text,
  state         text,
  city          text,
  role          text not null default 'student',  -- student|mentor|institution|family
  level         int not null default 1,
  xp            int not null default 0,
  coins         int not null default 0,
  streak        int not null default 0,
  streak_last   date,
  rank          int,
  plan          text not null default 'free',     -- free|trial|plus|pro|promax
  plan_expires  timestamptz,
  is_verified   boolean default false,
  equity_tier   text,
  equity_status text default 'none',              -- none|pending|verified
  tryit_id      text unique,                      -- TRY-TN-00001-2026
  avatar_url    text,
  onboarded     boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── STUDENT PROFILE ──────────────────────────────────────────────
create table if not exists student_profiles (
  user_id         uuid primary key references profiles(id),
  target_exams    text[],
  study_lang      text default 'en',
  extra_langs     text[],
  study_hours     text,
  goal_timeline   text,
  strengths       text[],
  weaknesses      text[]
);

-- ── MENTOR PROFILE ───────────────────────────────────────────────
create table if not exists mentor_profiles (
  user_id           uuid primary key references profiles(id),
  current_job       text,
  experience        text,
  qualification     text,
  expert_exams      text[],
  expert_subjects   text[],
  reply_langs       text[],
  can_translate     boolean default false,
  availability      text,
  upi_id            text,
  total_earnings    numeric(10,2) default 0,
  pending_payout    numeric(10,2) default 0,
  rating            numeric(3,2) default 5.0,
  answer_count      int default 0,
  verified_mentor   boolean default false
);

-- ── INSTITUTION PROFILE ──────────────────────────────────────────
create table if not exists institution_profiles (
  user_id            uuid primary key references profiles(id),
  institution_name   text,
  institution_type   text,
  board              text,
  address            text,
  pincode            text,
  contact_name       text,
  contact_phone      text,
  student_count      text,
  exams_conducted    text[],
  question_format    text default 'excel',
  upi_id             text,
  pan_india_visible  boolean default true,
  verified           boolean default false,
  total_payout       numeric(10,2) default 0
);

-- ── FAMILY PROFILE ───────────────────────────────────────────────
create table if not exists family_profiles (
  id              uuid primary key default uuid_generate_v4(),
  head_user_id    uuid references profiles(id),
  family_name     text,
  family_goal     text,
  created_at      timestamptz default now()
);

create table if not exists family_members (
  id          uuid primary key default uuid_generate_v4(),
  family_id   uuid references family_profiles(id),
  user_id     uuid references profiles(id),
  relation    text,
  joined_at   timestamptz default now()
);

-- ── ENROLLED EXAMS ───────────────────────────────────────────────
create table if not exists enrolled_exams (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id),
  exam_id     text not null,
  exam_name   text,
  readiness   int default 0,
  exam_date   date,
  enrolled_at timestamptz default now()
);

-- ── TEST RESULTS (private per user) ──────────────────────────────
create table if not exists test_results (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references profiles(id),
  exam_id         text,
  exam_name       text,
  test_type       text,          -- mock|pyq|speed|custom|hall_battle|tournament
  score           numeric(5,2),
  max_score       int,
  correct         int,
  incorrect       int,
  skipped         int,
  time_taken      int,           -- seconds
  rank_national   int,
  rank_state      int,
  xp_earned       int default 0,
  coins_earned    int default 0,
  subject         text,
  difficulty      text,
  is_public       boolean default false,  -- user controls this
  taken_at        timestamptz default now()
);

-- ── COIN TRANSACTIONS (all sections feed here) ────────────────────
create table if not exists coin_transactions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id),
  amount      int not null,       -- positive=earn, negative=spend
  source      text not null,      -- test|game|focus|guru|streak|referral|tournament|battle|achievement|purchase
  source_id   text,               -- id of the source entity
  description text,
  balance     int,                -- running balance after this tx
  created_at  timestamptz default now()
);

-- ── LEADERBOARD (PUBLIC) ──────────────────────────────────────────
create table if not exists leaderboard_daily (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id),
  exam_id     text,
  score       numeric(5,2),
  rank_national int,
  rank_state  int,
  user_name   text,
  user_level  int,
  user_state  text,
  date        date default current_date
);

-- ── HALLS (groups) — PUBLIC activity, PRIVATE individual ──────────
create table if not exists halls (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  emoji       text default '⚡',
  description text,
  captain_id  uuid references profiles(id),
  subject     text,
  max_members int default 10,
  total_score int default 0,
  streak      int default 0,
  rank        int,
  is_public   boolean default true,
  created_at  timestamptz default now()
);

create table if not exists hall_members (
  id          uuid primary key default uuid_generate_v4(),
  hall_id     uuid references halls(id),
  user_id     uuid references profiles(id),
  score       int default 0,
  joined_at   timestamptz default now()
);

create table if not exists hall_battles (
  id              uuid primary key default uuid_generate_v4(),
  hall_a_id       uuid references halls(id),
  hall_b_id       uuid references halls(id),
  subject         text,
  score_a         int default 0,
  score_b         int default 0,
  status          text default 'upcoming',  -- upcoming|live|ended
  winner_id       uuid references halls(id),
  starts_at       timestamptz,
  ends_at         timestamptz,
  prize_coins     int default 200
);

-- ── TOURNAMENTS (PUBLIC) ──────────────────────────────────────────
create table if not exists tournaments (
  id            uuid primary key default uuid_generate_v4(),
  name          text,
  category      text,
  prize         text,
  prize_pool    boolean default false,
  status        text default 'upcoming',   -- upcoming|open|live|ended
  starts_at     timestamptz,
  ends_at       timestamptz,
  max_seats     int,
  registered    int default 0,
  created_at    timestamptz default now()
);

create table if not exists tournament_registrations (
  id              uuid primary key default uuid_generate_v4(),
  tournament_id   uuid references tournaments(id),
  user_id         uuid references profiles(id),
  score           int,
  final_rank      int,
  registered_at   timestamptz default now()
);

-- ── GURU HUB DOUBTS ───────────────────────────────────────────────
create table if not exists doubts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id),
  exam_id     text,
  subject     text,
  question    text not null,
  views       int default 0,
  answer_count int default 0,
  is_resolved boolean default false,
  is_public   boolean default true,
  created_at  timestamptz default now()
);

create table if not exists doubt_answers (
  id          uuid primary key default uuid_generate_v4(),
  doubt_id    uuid references doubts(id),
  mentor_id   uuid references profiles(id),
  answer_text text not null,
  is_best     boolean default false,
  coins_earned int default 0,
  rating      numeric(3,2),
  created_at  timestamptz default now()
);

create table if not exists doubt_reactions (
  id          uuid primary key default uuid_generate_v4(),
  target_id   uuid,  -- doubt or answer id
  target_type text,  -- doubt|answer
  user_id     uuid references profiles(id),
  emoji       text,
  created_at  timestamptz default now(),
  unique(target_id, user_id, emoji)
);

-- ── FOCUS SESSIONS ────────────────────────────────────────────────
create table if not exists focus_sessions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id),
  subject     text,
  duration    int,   -- minutes
  sound       text,
  completed   boolean default false,
  coins_earned int default 0,
  started_at  timestamptz default now()
);

-- ── ACHIEVEMENTS ──────────────────────────────────────────────────
create table if not exists user_achievements (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references profiles(id),
  badge_id      text,
  badge_name    text,
  coins_awarded int default 0,
  earned_at     timestamptz default now()
);

-- ── ADMIN PRO GRANTS ─────────────────────────────────────────────
create table if not exists pro_grants (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null,
  plan        text not null,
  days        int not null,
  note        text,
  granted_by  text default 'admin',
  granted_at  timestamptz default now(),
  expires_at  timestamptz not null,
  revoked     boolean default false
);

-- ── EQUITY APPLICATIONS ───────────────────────────────────────────
create table if not exists equity_applications (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references profiles(id),
  tier_id         text,
  tier_name       text,
  status          text default 'pending',  -- pending|approved|rejected
  document_url    text,
  reviewer_note   text,
  submitted_at    timestamptz default now(),
  reviewed_at     timestamptz
);

-- ── NOTIFICATIONS ────────────────────────────────────────────────
create table if not exists notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id),
  type        text,  -- exam_alert|streak|rank_change|guru_reply|battle|tournament
  title       text,
  body        text,
  is_read     boolean default false,
  link        text,
  created_at  timestamptz default now()
);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public = anyone can see, Private = only owner
-- ══════════════════════════════════════════════════════════════

alter table profiles              enable row level security;
alter table test_results          enable row level security;
alter table coin_transactions     enable row level security;
alter table leaderboard_daily     enable row level security;
alter table halls                 enable row level security;
alter table hall_battles          enable row level security;
alter table tournaments           enable row level security;
alter table doubts                enable row level security;
alter table notifications         enable row level security;

-- Profiles: users see their own, public fields visible to all
create policy "profiles_own" on profiles for all using (auth.uid() = id);
create policy "profiles_public_read" on profiles for select using (true);

-- Test results: PRIVATE — only the user sees their own
create policy "results_private" on test_results for all using (auth.uid() = user_id);

-- Coins: PRIVATE
create policy "coins_private" on coin_transactions for all using (auth.uid() = user_id);

-- Leaderboard: PUBLIC — everyone sees rankings
create policy "leaderboard_public" on leaderboard_daily for select using (true);
create policy "leaderboard_insert" on leaderboard_daily for insert with check (auth.uid() = user_id);

-- Halls: PUBLIC — anyone can browse halls and battles
create policy "halls_public_read" on halls for select using (true);
create policy "halls_own_write" on halls for all using (auth.uid() = captain_id);
create policy "battles_public_read" on hall_battles for select using (true);

-- Tournaments: PUBLIC
create policy "tournaments_public" on tournaments for select using (true);

-- Doubts: PUBLIC by default (is_public=true)
create policy "doubts_public_read" on doubts for select using (is_public = true or auth.uid() = user_id);
create policy "doubts_own_write" on doubts for all using (auth.uid() = user_id);

-- Notifications: PRIVATE
create policy "notif_private" on notifications for all using (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ══════════════════════════════════════════════════════════════

-- Auto-update coins balance in profiles when transaction inserted
create or replace function update_coin_balance()
returns trigger as $$
begin
  update profiles set coins = coins + NEW.amount where id = NEW.user_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trigger_coin_balance
  after insert on coin_transactions
  for each row execute function update_coin_balance();

-- Auto-update XP and level
create or replace function update_xp_level()
returns trigger as $$
declare
  new_xp int;
  new_level int;
  level_thresholds int[] := ARRAY[0,500,1500,3000,6000,10000,16000,24000,35000,50000];
begin
  select xp + NEW.xp_earned into new_xp from profiles where id = NEW.user_id;
  -- Find level
  new_level := 1;
  for i in 1..10 loop
    if new_xp >= level_thresholds[i] then new_level := i; end if;
  end loop;
  update profiles set xp = new_xp, level = new_level where id = NEW.user_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trigger_xp_update
  after insert on test_results
  for each row execute function update_xp_level();

-- Update streak on daily activity
create or replace function update_streak()
returns trigger as $$
begin
  update profiles
  set
    streak = case
      when streak_last = current_date - 1 then streak + 1
      when streak_last = current_date then streak
      else 1
    end,
    streak_last = current_date
  where id = NEW.user_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trigger_streak
  after insert on test_results
  for each row execute function update_streak();

-- Check pro grant on login
create or replace function check_pro_grant(user_email text)
returns table(plan text, expires_at timestamptz) as $$
begin
  return query
    select g.plan, g.expires_at from pro_grants g
    where lower(g.email) = lower(user_email)
    and g.expires_at > now()
    and g.revoked = false
    order by g.granted_at desc
    limit 1;
end;
$$ language plpgsql security definer;

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, tryit_id)
  values (
    NEW.id,
    NEW.email,
    'TRY-' || upper(substring(NEW.email from 1 for 2)) || '-' || lpad(extract(epoch from now())::int::text, 5, '0') || '-2026'
  );
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
EOF
echo "Schema done"
# ══════════════════════════════════════════════════════════════════
# COIN VAULT — Unified coin system connected to ALL sections
# ══════════════════════════════════════════════════════════════════
cat > src/lib/coinVault.js << 'EOF'
/**
 * CoinVault — Single source of truth for all coin operations
 * Every feature in TryIT connects here to earn/spend coins
 * Offline-first: saves locally, syncs to Supabase when online
 */
import { supabase } from './supabase'

// ── Coin earn rates (locked) ──────────────────────────────────────
export const COIN_RATES = {
  // Tests
  test_complete:        { base: 50,  max: 150, formula: 'score_pct * 1.5' },
  test_perfect_score:   { flat: 200  },
  test_first_attempt:   { flat: 25   },
  // Focus Mode
  focus_session_25min:  { flat: 25   },
  focus_session_45min:  { flat: 40   },
  focus_4_sessions:     { flat: 50   }, // bonus
  // Guru Hub
  doubt_answered:       { flat: 25   }, // mentor
  best_answer:          { flat: 50   }, // mentor
  doubt_reaction_5:     { flat: 10   }, // asker
  // Games
  game_win:             { base: 10, max: 50, formula: 'score * 0.5' },
  game_perfect:         { flat: 75   },
  daily_game:           { flat: 5    },
  // Streak
  streak_3:             { flat: 10   },
  streak_7:             { flat: 30   },
  streak_14:            { flat: 60   },
  streak_30:            { flat: 150  },
  streak_100:           { flat: 500  },
  // Daily
  daily_quiz:           { flat: 15   },
  current_affairs_read: { flat: 5    },
  career_compass:       { flat: 20   },
  // Social
  referral_signup:      { flat: 100  },
  hall_battle_win:      { flat: 200  },
  tournament_win:       { flat: 500  },
  tournament_top10:     { flat: 100  },
  // Achievements
  badge_earned:         { flat: 50   },
  level_up:             { base: 100, formula: 'level * 50' },
  // Scholarship saved:
  scholarship_applied:  { flat: 10   },
}

// ── Coin spend options ────────────────────────────────────────────
export const COIN_COSTS = {
  unlock_premium_test:   100,
  unlock_test_pack:      500,
  buy_guru_book:         150,
  extra_test_attempt:    50,
  unlock_id_template:    200,
  hall_rank_boost:       150,
  premium_doubt_priority: 75,
}

// ── localStorage key ──────────────────────────────────────────────
const TX_KEY       = 'tryit_coin_txs'
const BALANCE_KEY  = 'tryit_coin_balance'

function getTxs()     { return JSON.parse(localStorage.getItem(TX_KEY)    || '[]') }
function getBalance() { return parseInt(localStorage.getItem(BALANCE_KEY) || '0') }
function saveBalance(b){ localStorage.setItem(BALANCE_KEY, String(b)) }

// ── Core earn function ────────────────────────────────────────────
export async function earnCoins({ source, amount, description, userId, sourceId }) {
  if (!amount || amount <= 0) return { coins: 0, balance: getBalance() }

  const tx = {
    id:          `tx-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    amount,
    source,
    source_id:   sourceId || null,
    description: description || source,
    created_at:  new Date().toISOString(),
    synced:      false,
  }

  // Save locally first (offline-first)
  const txs     = getTxs()
  const balance = getBalance() + amount
  txs.unshift(tx)
  if (txs.length > 500) txs.splice(500) // keep last 500
  localStorage.setItem(TX_KEY, JSON.stringify(txs))
  saveBalance(balance)

  // Sync to Supabase if online
  if (userId) {
    try {
      await supabase.from('coin_transactions').insert({
        user_id:     userId,
        amount,
        source,
        source_id:   sourceId,
        description,
        balance,
      })
    } catch {}
  }

  return { coins: amount, balance }
}

// ── Core spend function ───────────────────────────────────────────
export async function spendCoins({ source, amount, description, userId }) {
  const balance = getBalance()
  if (balance < amount) return { success: false, reason: 'Insufficient coins', balance }

  return earnCoins({ source, amount: -amount, description, userId })
    .then(r => ({ success: true, ...r }))
}

// ── Section-specific helpers ──────────────────────────────────────

// Called when a test is completed
export async function rewardTestComplete({ score, examName, testType, userId }) {
  const pct    = Math.min(score, 100)
  const coins  = Math.round(pct * 1.5)
  return earnCoins({
    source:      'test',
    amount:      coins,
    description: `Completed ${examName} — ${score}%`,
    userId,
  })
}

// Called when focus session ends
export async function rewardFocusSession({ minutes, userId }) {
  const rate  = minutes >= 45 ? COIN_RATES.focus_session_45min.flat : COIN_RATES.focus_session_25min.flat
  return earnCoins({
    source:      'focus',
    amount:      rate,
    description: `Focus session — ${minutes} min`,
    userId,
  })
}

// Called when guru hub answer accepted
export async function rewardGuruAnswer({ isBest, userId }) {
  const coins = isBest ? COIN_RATES.best_answer.flat : COIN_RATES.doubt_answered.flat
  return earnCoins({
    source:      'guru',
    amount:      coins,
    description: isBest ? 'Best answer accepted!' : 'Answer accepted',
    userId,
  })
}

// Called when game session ends
export async function rewardGame({ score, isPerfect, userId, gameName }) {
  const coins = isPerfect
    ? COIN_RATES.game_perfect.flat
    : Math.min(COIN_RATES.game_win.max, Math.round(score * 0.5) + COIN_RATES.game_win.base)
  return earnCoins({
    source:      'game',
    amount:      coins,
    description: `${gameName} — ${isPerfect ? 'Perfect!' : score + ' pts'}`,
    userId,
  })
}

// Called on streak milestone
export async function rewardStreak({ days, userId }) {
  const map = { 3:10, 7:30, 14:60, 30:150, 100:500 }
  const coins = map[days]
  if (!coins) return null
  return earnCoins({
    source:      'streak',
    amount:      coins,
    description: `${days}-day streak bonus! 🔥`,
    userId,
  })
}

// Called when achievement unlocked
export async function rewardAchievement({ badgeName, userId }) {
  return earnCoins({
    source:      'achievement',
    amount:      COIN_RATES.badge_earned.flat,
    description: `Achievement: ${badgeName} 🏅`,
    userId,
  })
}

// Called when referral registers
export async function rewardReferral({ referredEmail, userId }) {
  return earnCoins({
    source:      'referral',
    amount:      COIN_RATES.referral_signup.flat,
    description: `Referral bonus — ${referredEmail} joined`,
    userId,
  })
}

// Called when hall battle won
export async function rewardBattleWin({ opponentName, userId }) {
  return earnCoins({
    source:      'battle',
    amount:      COIN_RATES.hall_battle_win.flat,
    description: `Hall battle won vs ${opponentName}! ⚔️`,
    userId,
  })
}

// Called when daily quiz done
export async function rewardDailyQuiz({ userId }) {
  return earnCoins({
    source:      'daily_quiz',
    amount:      COIN_RATES.daily_quiz.flat,
    description: 'Daily quiz completed 📅',
    userId,
  })
}

// Get balance and recent txs
export function getWalletData() {
  return {
    balance:      getBalance(),
    transactions: getTxs().slice(0, 50),
  }
}

// Sync all unsynced local txs to Supabase
export async function syncPendingTransactions(userId) {
  const txs    = getTxs()
  const unsync = txs.filter(t => !t.synced)
  if (!unsync.length) return
  try {
    await supabase.from('coin_transactions').insert(
      unsync.map(t => ({ user_id: userId, amount: t.amount, source: t.source, description: t.description, created_at: t.created_at }))
    )
    const synced = txs.map(t => ({ ...t, synced: true }))
    localStorage.setItem(TX_KEY, JSON.stringify(synced))
  } catch {}
}
EOF
echo "CoinVault done"

# ── SUPABASE CLIENT ───────────────────────────────────────────────
cat > src/lib/supabase.js << 'EOF'
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
EOF
echo "Supabase client done"
# ══════════════════════════════════════════════════════════════════
# SUBJECT-ORIENTED GAME ENGINE (Level 1 generic → Level 2+ exam-specific)
# ══════════════════════════════════════════════════════════════════
cat > src/lib/gameEngine.js << 'EOF'
/**
 * Game Engine — Subject-oriented question system
 * Level 1: Generic (anyone can play — onboarding)
 * Level 2+: Questions matched to student's target exam
 * Makes students razor-sharp for their specific exam
 */

// ── Generic L1 questions (Math Blitz, Word Rush, GK Burst) ────────
const GENERIC_POOL = {
  math: [
    { q:'15 + 28 = ?',             ans:43,  op:'+', a:43,  b:43  },
    { q:'7 × 8 = ?',               ans:56,  op:'×', a:56,  b:56  },
    { q:'144 ÷ 12 = ?',            ans:12,  op:'÷', a:12,  b:12  },
    { q:'23% of 200 = ?',          ans:46,  op:'%', a:46,  b:46  },
    { q:'Square root of 169 = ?',  ans:13,  op:'√', a:13,  b:13  },
    { q:'5² + 4² = ?',             ans:41,  op:'^', a:41,  b:41  },
    { q:'If 3x = 45, x = ?',       ans:15,  op:'=', a:15,  b:15  },
    { q:'LCM of 4 and 6 = ?',      ans:12,  op:'L', a:12,  b:12  },
  ],
  word: [
    { q:'Correct spelling?',  options:['Accomodate','Accommodate','Acommodate','Accommadate'], ans:1 },
    { q:'Antonym of HUGE?',   options:['Tiny','Large','Vast','Giant'],   ans:0 },
    { q:'Synonym of BRAVE?',  options:['Cowardly','Valiant','Timid','Weak'], ans:1 },
    { q:'Plural of CHILD?',   options:['Childs','Childes','Children','Childrens'], ans:2 },
  ],
  gk: [
    { q:'Capital of India?',                ans:'New Delhi',    options:['Mumbai','New Delhi','Kolkata','Chennai'] },
    { q:'Who wrote the Indian Constitution?',ans:'B.R. Ambedkar',options:['Nehru','Gandhi','Ambedkar','Patel'] },
    { q:'Largest planet in solar system?',  ans:'Jupiter',      options:['Saturn','Jupiter','Mars','Neptune'] },
  ],
}

// ── Exam-specific question pools (razor-sharp practice) ──────────
const EXAM_POOLS = {
  'SSC CGL': {
    math: [
      { q:'A shopkeeper marks goods 30% above cost. He allows 10% discount. Profit%?', ans:17, hint:'MP=1.3CP, SP=0.9×1.3CP=1.17CP' },
      { q:'Train 200m long at 54 km/h. Time to cross a pole?', ans:13.33, hint:'Time = 200÷(54×5/18) = 200÷15 ≈ 13.33s' },
      { q:'Find the odd one: 2,5,10,17,26,37,50,?', ans:65, hint:'Diff: 3,5,7,9,11,13,15 → next diff=15 → 50+15=65' },
    ],
    reasoning: [
      { q:'ACEG : BDFH :: PRTV : ?', ans:'QSUW', type:'analogy' },
      { q:'Find the missing: 1,1,2,3,5,8,?,21', ans:13, hint:'Fibonacci: each = sum of previous two' },
    ],
    english: [
      { q:'She insisted __ going alone.', ans:'on', options:['on','in','at','for'], type:'preposition' },
      { q:'Idiom: "Spill the beans" means?', ans:'Reveal a secret', options:['Cook food','Reveal a secret','Make mess','Be lazy'] },
    ],
  },
  'UPSC CSE': {
    gk: [
      { q:'Which Schedule of Constitution deals with anti-defection?', ans:'Tenth', options:['Eighth','Ninth','Tenth','Eleventh'] },
      { q:'Article 370 related to which state?', ans:'J&K', options:['Kashmir','J&K','Sikkim','Arunachal'] },
    ],
    polity: [
      { q:'Directive Principles are in which Part of Constitution?', ans:'Part IV', options:['Part III','Part IV','Part V','Part VI'] },
      { q:'Who appoints the CAG of India?', ans:'President', options:['PM','President','Parliament','SC'] },
    ],
  },
  'IBPS PO': {
    quant: [
      { q:'Simple Interest on ₹5000 at 8% for 2.5 years?', ans:1000, hint:'SI = PRT/100 = 5000×8×2.5/100 = 1000' },
      { q:'Pipes A and B can fill tank in 12 and 15 hrs. Together?', ans:'6⅔ hrs', hint:'1/12+1/15 = 9/60 = 3/20 → 20/3 hrs' },
    ],
    banking: [
      { q:'Full form of NEFT?', ans:'National Electronic Funds Transfer', options:['National Electronic Funds Transfer','Net Electronic Fund Transaction','National Easy Fund Transfer','None'] },
      { q:'RBI was nationalised in?', ans:1949, options:[1935,1949,1955,1969] },
    ],
  },
  'NEET UG': {
    biology: [
      { q:'Which is the powerhouse of cell?', ans:'Mitochondria', options:['Nucleus','Mitochondria','Ribosome','Lysosome'] },
      { q:'DNA replication is?', ans:'Semi-conservative', options:['Conservative','Semi-conservative','Dispersive','Random'] },
    ],
    chemistry: [
      { q:'pH of pure water at 25°C?', ans:7, options:[6,7,8,14] },
    ],
  },
  'JEE Main': {
    physics: [
      { q:'SI unit of electric charge?', ans:'Coulomb', options:['Ampere','Volt','Coulomb','Ohm'] },
      { q:'Force = mass × ?', ans:'acceleration', options:['velocity','acceleration','momentum','displacement'] },
    ],
    math: [
      { q:'∫sin(x)dx = ?', ans:'-cos(x)+C', options:['cos(x)+C','-cos(x)+C','sin(x)+C','-sin(x)+C'] },
    ],
  },
}

// Fallback for exams without specific pool
const DEFAULT_POOL = EXAM_POOLS['SSC CGL']

/**
 * Get questions for a game session
 * @param {string} gameType - math|word|gk|subject
 * @param {number} level - player level (1=generic, 2+=exam-specific)
 * @param {string} targetExam - student's target exam
 * @param {string} subject - specific subject (optional)
 */
export function getGameQuestions({ gameType='math', level=1, targetExam='SSC CGL', subject=null, count=10 }) {
  // Level 1: always generic (good for new users/onboarding)
  if (level <= 1) {
    return generateGenericQuestions(gameType, count)
  }

  // Level 2+: exam-specific questions for razor-sharp practice
  const examPool = EXAM_POOLS[targetExam] || DEFAULT_POOL
  const subjectKey = subject || detectSubjectFromGame(gameType, targetExam)
  const pool = examPool[subjectKey] || examPool[Object.keys(examPool)[0]] || []

  if (pool.length >= count) {
    return shuffleArray([...pool]).slice(0, count).map(formatQuestion)
  }

  // Mix exam-specific + generic if pool is small
  const examQs    = shuffleArray([...pool]).map(formatQuestion)
  const genericQs = generateGenericQuestions(gameType, count - examQs.length)
  return [...examQs, ...genericQs].slice(0, count)
}

function detectSubjectFromGame(gameType, exam) {
  const map = {
    'math':    { 'SSC CGL':'math', 'UPSC CSE':'math', 'IBPS PO':'quant', 'JEE Main':'math', default:'math' },
    'word':    { 'SSC CGL':'english', default:'english' },
    'gk':      { 'UPSC CSE':'polity', 'IBPS PO':'banking', default:'gk' },
    'subject': { 'NEET UG':'biology', 'JEE Main':'physics', default:'gk' },
  }
  return map[gameType]?.[exam] || map[gameType]?.default || 'math'
}

function generateGenericQuestions(type, count) {
  const pool = GENERIC_POOL[type] || GENERIC_POOL.math
  return shuffleArray([...pool]).slice(0, Math.min(count, pool.length)).map(formatQuestion)
}

function formatQuestion(q) {
  // Generate wrong options if not provided
  if (q.options) return { ...q, formatted: true }
  const ans = typeof q.ans === 'number' ? q.ans : parseInt(q.ans)
  const wrongs = [ans+1, ans-1, ans+Math.ceil(ans*0.1), ans*2].filter(x=>x!==ans&&x>0&&Number.isFinite(x))
  const options = shuffleArray([ans, ...wrongs.slice(0,3)])
  return { ...q, options, formatted: true }
}

function shuffleArray(arr) {
  for (let i=arr.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]]
  }
  return arr
}

/**
 * Calculate XP earned from game
 * Higher level = more XP possible
 */
export function calcGameXP({ score, level, isPerfect }) {
  const base  = level * 10
  const bonus = isPerfect ? base * 2 : 0
  return base + Math.round(score * 0.2) + bonus
}

/**
 * Game difficulty curve based on level
 */
export function getGameConfig(level) {
  return {
    timePerQuestion: Math.max(5, 15 - level),         // seconds
    totalQuestions:  Math.min(20, 8 + level * 2),      // more questions at higher levels
    streakMultiplier: 1 + (level * 0.1),               // more streak bonus
    label: level <= 1 ? 'Beginner' : level <= 3 ? 'Intermediate' : level <= 6 ? 'Advanced' : level <= 9 ? 'Expert' : 'Master',
    hint: level <= 1 ? 'Hints shown' : level <= 4 ? 'Hints cost 5 coins' : 'No hints',
  }
}
EOF
echo "Game engine done"

# ── COIN CONTEXT (global state for all sections) ──────────────────
cat > src/context/CoinContext.jsx << 'EOF'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getWalletData, earnCoins, spendCoins } from '../lib/coinVault'
import { useAuth } from './AuthContext'

const CoinCtx = createContext({})

export function CoinProvider({ children }) {
  const { user } = useAuth()
  const [balance,  setBalance]  = useState(0)
  const [txs,      setTxs]      = useState([])
  const [recentMsg,setMsg]      = useState(null)  // "+25 coins" popup

  const refresh = useCallback(() => {
    const { balance, transactions } = getWalletData()
    setBalance(balance)
    setTxs(transactions)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const earn = useCallback(async (params) => {
    const result = await earnCoins({ ...params, userId: user?.id })
    refresh()
    setMsg(`+${params.amount} 🪙`)
    setTimeout(() => setMsg(null), 2000)
    return result
  }, [user?.id, refresh])

  const spend = useCallback(async (params) => {
    const result = await spendCoins({ ...params, userId: user?.id })
    if (result.success) { refresh(); setMsg(`-${params.amount} 🪙`) }
    setTimeout(() => setMsg(null), 2000)
    return result
  }, [user?.id, refresh])

  return (
    <CoinCtx.Provider value={{ balance, txs, earn, spend, refresh, recentMsg }}>
      {children}
      {/* Toast popup when coins earned/spent */}
      {recentMsg && (
        <div style={{
          position:'fixed', bottom:120, right:20, zIndex:9999,
          background: recentMsg.startsWith('+') ? '#22C55E' : '#EF4444',
          color:'#fff', padding:'8px 18px', borderRadius:20,
          fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
          boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
          animation:'coinPop 0.3s ease',
        }}>
          {recentMsg}
        </div>
      )}
      <style>{`
        @keyframes coinPop {
          from { transform: scale(0.8) translateY(20px); opacity:0; }
          to   { transform: scale(1) translateY(0); opacity:1; }
        }
      `}</style>
    </CoinCtx.Provider>
  )
}

export const useCoins = () => useContext(CoinCtx)
EOF

# Update main.jsx to include CoinProvider
python3 << 'PYEOF'
with open('src/main.jsx','r') as f: c = f.read()
if 'CoinProvider' not in c:
    c = "import { CoinProvider } from './context/CoinContext.jsx'\n" + c
    c = c.replace('<EquityTierProvider>', '<CoinProvider>\n        <EquityTierProvider>')
    c = c.replace('</EquityTierProvider>', '</EquityTierProvider>\n        </CoinProvider>')
    with open('src/main.jsx','w') as f: f.write(c)
    print('main.jsx updated with CoinProvider')
else:
    print('CoinProvider already in main.jsx')
PYEOF

echo "CoinContext + main.jsx done"
# ══════════════════════════════════════════════════════════════════
# EDGE FUNCTIONS (Supabase serverless)
# ══════════════════════════════════════════════════════════════════

# sync-delta: WhatsApp-pattern — one call gets all user changes
cat > supabase/functions/sync-delta/index.ts << 'EOF'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const { user_id, last_sync } = await req.json()

    const since = last_sync ? new Date(last_sync).toISOString() : new Date(0).toISOString()

    // Fetch all changes since last sync in ONE round trip
    const [profile, results, notifications, coins, doubts] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user_id).single(),
      supabase.from('test_results').select('id,score,exam_name,taken_at,rank_national,coins_earned')
        .eq('user_id', user_id).gte('taken_at', since).order('taken_at', { ascending:false }).limit(10),
      supabase.from('notifications').select('*').eq('user_id', user_id)
        .eq('is_read', false).order('created_at', { ascending:false }).limit(20),
      supabase.from('coin_transactions').select('amount,source,description,created_at')
        .eq('user_id', user_id).gte('created_at', since).limit(50),
      supabase.from('doubts').select('id,question,answer_count,is_resolved')
        .eq('user_id', user_id).gte('created_at', since).limit(10),
    ])

    return new Response(JSON.stringify({
      profile: profile.data,
      new_results: results.data || [],
      unread_notifications: notifications.data || [],
      new_coin_txs: coins.data || [],
      doubt_updates: doubts.data || [],
      synced_at: new Date().toISOString(),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status:500, headers: corsHeaders })
  }
})
EOF

# exam-result: save test + update leaderboard + award coins
cat > supabase/functions/exam-result/index.ts << 'EOF'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { user_id, exam_id, exam_name, score, correct, incorrect, skipped, time_taken, test_type } = await req.json()

  // Calculate XP and coins
  const xp_earned    = Math.round(score * 1.5)
  const coins_earned = Math.round(score * 1.5)

  // Save result
  const { data: result } = await supabase.from('test_results').insert({
    user_id, exam_id, exam_name, score, correct, incorrect, skipped, time_taken, test_type, xp_earned, coins_earned
  }).select().single()

  // Award coins
  await supabase.from('coin_transactions').insert({
    user_id, amount: coins_earned, source: 'test',
    description: `${exam_name} — ${score.toFixed(1)}%`
  })

  // Update leaderboard (only store name+level+state — no private data)
  const { data: profile } = await supabase.from('profiles').select('name,level,state').eq('id', user_id).single()
  if (profile) {
    await supabase.from('leaderboard_daily').upsert({
      user_id, exam_id, score,
      user_name:  profile.name,
      user_level: profile.level,
      user_state: profile.state,
      date: new Date().toISOString().split('T')[0],
    }, { onConflict: 'user_id,exam_id,date' })
  }

  // Send notification to user
  await supabase.from('notifications').insert({
    user_id,
    type:  'test_result',
    title: `Test complete! ${score.toFixed(1)}%`,
    body:  `You earned ${coins_earned} coins and ${xp_earned} XP`,
    link:  '/analytics',
  })

  return new Response(JSON.stringify({ result, xp_earned, coins_earned }), {
    headers: { ...cors, 'Content-Type':'application/json' }
  })
})
EOF

# coin-transaction: batch process outbox (Telegram pattern)
cat > supabase/functions/coin-transaction/index.ts << 'EOF'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { user_id, transactions } = await req.json()

  // Batch insert all pending coin transactions
  const { data, error } = await supabase.from('coin_transactions')
    .insert(transactions.map((t: any) => ({ ...t, user_id })))

  if (error) return new Response(JSON.stringify({ error }), { status:500, headers: cors })

  // Get updated balance
  const { data: profile } = await supabase.from('profiles').select('coins').eq('id', user_id).single()

  return new Response(JSON.stringify({ processed: transactions.length, balance: profile?.coins }), {
    headers: { ...cors, 'Content-Type':'application/json' }
  })
})
EOF

# leaderboard-update: recalculate ranks (runs via cron)
cat > supabase/functions/leaderboard-update/index.ts << 'EOF'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // Get today's leaderboard entries sorted by score
  const today = new Date().toISOString().split('T')[0]
  const { data: entries } = await supabase.from('leaderboard_daily')
    .select('*').eq('date', today).order('score', { ascending: false })

  if (!entries?.length) return new Response('No entries', { headers: cors })

  // Assign national ranks
  const updates = entries.map((e, i) => ({ ...e, rank_national: i + 1 }))

  // Batch update ranks
  for (const entry of updates) {
    await supabase.from('leaderboard_daily')
      .update({ rank_national: entry.rank_national })
      .eq('id', entry.id)
  }

  // Update profiles with current rank
  for (const entry of updates) {
    await supabase.from('profiles')
      .update({ rank: entry.rank_national })
      .eq('id', entry.user_id)
  }

  return new Response(JSON.stringify({ updated: updates.length, date: today }), {
    headers: { ...cors, 'Content-Type':'application/json' }
  })
})
EOF

echo "Edge functions done"
# ══════════════════════════════════════════════════════════════════
# UPDATED MATH BLITZ — coins connected + subject-oriented after L1
# ══════════════════════════════════════════════════════════════════
cat > src/pages/games/MathBlitz.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { getGameQuestions, calcGameXP, getGameConfig } from '../../lib/gameEngine'
import { rewardGame } from '../../lib/coinVault'

export default function MathBlitz() {
  const navigate       = useNavigate()
  const { user }       = useAuth()
  const { earn, balance } = useCoins()
  const [phase,   setPhase]  = useState('intro')
  const [qs,      setQs]     = useState([])
  const [qi,      setQi]     = useState(0)
  const [score,   setScore]  = useState(0)
  const [timeLeft,setTime]   = useState(60)
  const [chosen,  setChosen] = useState(null)
  const [streak,  setStreak] = useState(0)
  const [lastOk,  setLastOk] = useState(null)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const timerRef = useRef(null)

  const level     = user?.level || 1
  const targetExam = localStorage.getItem('selected_exam') || 'SSC CGL'
  const config    = getGameConfig(level)
  const TOTAL     = config.totalQuestions

  const start = () => {
    const questions = getGameQuestions({ gameType:'math', level, targetExam, count:TOTAL })
    setQs(questions); setQi(0); setScore(0); setTime(60)
    setStreak(0); setCoinsEarned(0); setPhase('play')
  }

  useEffect(() => {
    if (phase!=='play') return
    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t<=1) { clearInterval(timerRef.current); finish(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const finish = async (finalScore=score) => {
    clearInterval(timerRef.current)
    const isPerfect = finalScore >= TOTAL * 10
    const result = await rewardGame({ score: finalScore, isPerfect, userId: user?.id, gameName: 'Math Blitz' })
    if (result) {
      setCoinsEarned(result.coins)
      earn({ source:'game', amount: result.coins, description:`Math Blitz — ${finalScore} pts` })
    }
    setPhase('result')
  }

  const pick = (val) => {
    if (chosen !== null || qi >= qs.length) return
    const q   = qs[qi]
    const ans = q.options?.[q.ans] ?? q.ans
    const right = String(val) === String(ans)
    setChosen(val); setLastOk(right)
    if (right) { setScore(s => s + (streak>=2?15:10)); setStreak(s=>s+1) }
    else setStreak(0)
    setTimeout(() => {
      setChosen(null); setLastOk(null)
      if (qi+1 >= TOTAL) finish()
      else setQi(i=>i+1)
    }, 600)
  }

  const pct = qi >= qs.length ? 100 : (qi / TOTAL) * 100
  const q   = qs[qi]

  if (phase==='intro') return (
    <AppLayout>
      <div style={{ maxWidth:440, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:60, marginBottom:14 }}>⚡</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:28, marginBottom:8 }}>Math Blitz</h1>
        <div style={{ background:'linear-gradient(135deg,rgba(30,58,95,0.06),rgba(212,175,55,0.04))', borderRadius:18, padding:16, marginBottom:20, border:'1.5px solid rgba(212,175,55,0.2)' }}>
          <p style={{ color:'#1E3A5F', fontWeight:700, fontSize:14, marginBottom:6 }}>
            {level <= 1 ? '🔰 Beginner Mode' : `⚡ ${config.label} Mode — ${targetExam} Specific`}
          </p>
          <p style={{ color:'#64748B', fontSize:13, lineHeight:1.6 }}>
            {level <= 1
              ? 'Generic questions to get you started. Reach Level 2 for exam-specific practice!'
              : `Questions tailored for ${targetExam}. Every correct answer sharpens your exam skills.`
            }
          </p>
          {level > 1 && (
            <p style={{ color:'#D4AF37', fontSize:12, fontWeight:600, marginTop:6 }}>
              🎯 Exam-specific · {config.totalQuestions} questions · {config.timePerQuestion}s each
            </p>
          )}
        </div>
        <div style={{ background:'#F8FAFC', borderRadius:16, padding:14, marginBottom:20, textAlign:'left', border:'1.5px solid #E2E8F0' }}>
          {[`${TOTAL} questions · 60 seconds`,`Streak bonus: 3+ correct = +5 per Q`,`Earn ${Math.round(TOTAL*0.8)} coins on good score`,level>1?`Level ${level}: ${config.hint}`:'Hints shown for hard questions'].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
              <span style={{ color:'#D4AF37' }}>▸</span>
              <span style={{ color:'#475569', fontSize:13 }}>{r}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ color:'#64748B', fontSize:13 }}>Your balance: 🪙 {balance}</span>
          <span style={{ color:'#1E3A5F', fontSize:13, fontWeight:700 }}>Level {level} — {config.label}</span>
        </div>
        <button onClick={start} style={{ width:'100%', padding:16, borderRadius:16, border:'none', background:'linear-gradient(135deg,#EF4444,#DC2626)', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', cursor:'pointer', boxShadow:'0 6px 20px rgba(239,68,68,0.4)' }}>
          ⚡ Start!
        </button>
      </div>
    </AppLayout>
  )

  if (phase==='result') return (
    <AppLayout>
      <div style={{ maxWidth:420, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>{score>=70?'🏆':score>=40?'⭐':'😤'}</div>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:26, marginBottom:16 }}>
          {score>=70?'Blazing! 🔥':score>=40?'Nice work! 💪':'Keep going! 📈'}
        </h2>
        {coinsEarned > 0 && (
          <div style={{ background:'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))', border:'1.5px solid rgba(212,175,55,0.3)', borderRadius:18, padding:16, marginBottom:16 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:28 }}>+{coinsEarned} 🪙</p>
            <p style={{ color:'#64748B', fontSize:13 }}>Added to your wallet · Balance: {balance}</p>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[['Score',score],['Questions',`${qi}/${TOTAL}`],['Best Streak',`${streak}x`],['XP',`+${calcGameXP({score,level,isPerfect:score>=TOTAL*10})}`]].map(([l,v])=>(
            <div key={l} style={{ background:'#F8FAFC', borderRadius:14, padding:14, border:'1.5px solid #E2E8F0' }}>
              <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:22 }}>{v}</p>
            </div>
          ))}
        </div>
        {level <= 1 && (
          <div style={{ background:'#EFF6FF', borderRadius:14, padding:12, marginBottom:14, border:'1px solid #BFDBFE' }}>
            <p style={{ color:'#1E40AF', fontSize:13 }}>💡 Reach Level 2 to unlock <strong>{targetExam}-specific</strong> questions!</p>
          </div>
        )}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={start} style={{ flex:1, padding:13, borderRadius:14, border:'none', background:'linear-gradient(135deg,#EF4444,#DC2626)', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, cursor:'pointer' }}>⚡ Play Again</button>
          <button onClick={()=>navigate('/games')} style={{ flex:1, padding:13, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>All Games</button>
        </div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div style={{ maxWidth:460, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background: timeLeft<=10?'#EF4444':timeLeft<=20?'#F59E0B':'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18 }}>{timeLeft}</div>
          <div style={{ display:'flex', gap:4 }}>
            {Array.from({length:TOTAL}).map((_,i)=>(
              <div key={i} style={{ width:Math.min(22, 300/TOTAL), height:6, borderRadius:3, background: i<qi?'#22C55E':i===qi?'#D4AF37':'#F1F5F9' }}/>
            ))}
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:18 }}>{score}</p>
            {streak>=2&&<p style={{ color:'#F97316', fontSize:11, fontWeight:700 }}>🔥{streak}x</p>}
          </div>
        </div>

        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:22, padding:28, marginBottom:18, textAlign:'center', position:'relative' }}>
          {level > 1 && <span style={{ position:'absolute', top:10, right:12, background:'rgba(212,175,55,0.2)', color:'#D4AF37', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>{targetExam}</span>}
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginBottom:6 }}>Q {qi+1} / {TOTAL}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:'clamp(16px,3vw,26px)', lineHeight:1.4 }}>{q?.q}</p>
          {q?.hint && level<=2 && config.hint.includes('shown') && (
            <p style={{ color:'rgba(212,175,55,0.6)', fontSize:11, marginTop:8 }}>💡 {q.hint}</p>
          )}
          {lastOk===true&&<p style={{ color:'#4ADE80', fontWeight:700, fontSize:15, marginTop:8 }}>✓ {streak>=2?'Streak! 🔥':''}</p>}
          {lastOk===false&&<p style={{ color:'#F87171', fontWeight:700, fontSize:15, marginTop:8 }}>✗</p>}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {(q?.options||[]).map((opt,i)=>{
            const ans    = q.options?.[q.ans] ?? q.ans
            const right  = chosen!==null && String(opt)===String(ans)
            const wrong  = String(chosen)===String(opt) && !right
            return (
              <button key={i} onClick={()=>pick(opt)} disabled={chosen!==null}
                style={{ padding:'18px 10px', borderRadius:16, border:'none', cursor: chosen!==null?'not-allowed':'pointer',
                  background: right?'#22C55E':wrong?'#EF4444':'#fff',
                  color: right||wrong?'#fff':'#1E3A5F',
                  fontFamily:'Poppins,sans-serif', fontWeight:700,
                  fontSize:'clamp(14px,2.5vw,20px)',
                  boxShadow: right?'0 4px 14px rgba(34,197,94,0.4)':wrong?'0 4px 14px rgba(239,68,68,0.4)':'0 2px 8px rgba(0,0,0,0.06)',
                  transition:'all 0.15s' }}>
                {String(opt)}
              </button>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
EOF
echo "MathBlitz with coins + subject-orientation done"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ Backend Core installed!                              ║"
echo "║                                                          ║"
echo "║  FILES CREATED:                                          ║"
echo "║  supabase/migrations/001_complete_schema.sql             ║"
echo "║    → Run this in Supabase SQL Editor                     ║"
echo "║  src/lib/supabase.js       → Supabase client             ║"
echo "║  src/lib/coinVault.js      → Unified coin system         ║"
echo "║  src/lib/gameEngine.js     → Subject-oriented games      ║"
echo "║  src/context/CoinContext.jsx → Global coin state         ║"
echo "║  supabase/functions/       → 4 Edge Functions            ║"
echo "║  src/pages/games/MathBlitz.jsx → Coins + subject mode   ║"
echo "║                                                          ║"
echo "║  NEXT STEPS:                                             ║"
echo "║  1. npm run dev  (test locally)                          ║"
echo "║  2. Open Supabase dashboard                              ║"
echo "║  3. SQL Editor → paste 001_complete_schema.sql           ║"
echo "║  4. Run the schema                                       ║"
echo "║  5. Fill .env.local with your Supabase keys              ║"
echo "║                                                          ║"
echo "║  QUESTION BANK SCRIPT → coming tonight                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
