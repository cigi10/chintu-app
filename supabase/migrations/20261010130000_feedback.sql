-- In-app "What's missing?" feedback.
--
-- Run this once in the Supabase SQL editor. It is safe to re-run.
--
-- Access model: same as email_signups. Nobody using the public anon key
-- can read, insert, update or delete rows. Entries arrive only through
-- the server route app/api/feedback/route.ts, which uses the service-role
-- key, so its validation and rate limit can't be skipped by calling the
-- Supabase REST API directly. Read entries in the Supabase dashboard.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(message) between 1 and 500),
  email text check (email is null or (char_length(email) <= 254 and email = lower(email) and email like '%_@_%._%')),
  page text not null check (page in ('/timer', '/tracker', '/dashboard')),
  created_at timestamptz not null default now()
);

-- RLS on with no policies: anon and authenticated get no rows and can't
-- insert, update or delete. The explicit revoke is belt and braces.
alter table public.feedback enable row level security;
revoke all on table public.feedback from anon, authenticated;

-- service_role bypasses RLS, but still needs ordinary table privileges.
-- The route only inserts; reading happens in the dashboard.
grant insert on table public.feedback to service_role;
