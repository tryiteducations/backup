-- Migration: session_logs table
-- Zero-cost, no-QR session verification: the student's own authenticated
-- tap of "Start Session" IS the verification (only the real enrolled
-- student can trigger this from their own logged-in account). No mentor
-- confirmation required by default - matches the platform's async-mentoring
-- model. This is the async-only version; a Supabase Realtime live-notify
-- enhancement for the mentor/institution side can be layered on top later.

create table if not exists session_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  mentor_id text not null,           -- mentor or institution identifier
  started_at timestamptz not null default now(),
  status text not null default 'started' check (status in ('started','confirmed','completed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_session_logs_student on session_logs(student_id);
create index if not exists idx_session_logs_mentor on session_logs(mentor_id);
create index if not exists idx_session_logs_started_at on session_logs(started_at desc);

alter table session_logs enable row level security;

-- Students can insert their own session logs (their own tap is the verification)
create policy "Students can log their own sessions"
  on session_logs for insert
  with check (auth.uid() = student_id);

-- Students can view their own session history
create policy "Students can view their own sessions"
  on session_logs for select
  using (auth.uid() = student_id);

-- Mentors/institutions can view sessions logged against their mentor_id
-- (mentor_id is currently a text identifier, not a foreign key, since
-- mentors/institutions share one identifier scheme - tighten this once
-- real mentor/institution profile IDs are consistently wired)
create policy "Mentors can view their own session logs"
  on session_logs for select
  using (true); -- permissive for now; tighten alongside auth wiring
