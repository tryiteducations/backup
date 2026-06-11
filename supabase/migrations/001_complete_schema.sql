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
