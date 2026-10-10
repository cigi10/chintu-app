-- Optional email list (study plans and exam updates).
--
-- Run this once in the Supabase SQL editor. It is safe to re-run.
--
-- Access model: nobody using the public anon key can read, insert,
-- update or delete rows. Every signup goes through the server route
-- app/api/email-signup/route.ts, and every unsubscribe through
-- app/unsubscribe, both using the service-role key (server-only, never
-- sent to the browser). Keeping anon out entirely means:
--   - the route's validation and rate limit can't be skipped by calling
--     the Supabase REST API directly with the public key, and
--   - nobody can learn whether an address is on the list. A direct anon
--     INSERT of an existing address would fail with a 409 conflict, which
--     is exactly the probe the route is built to prevent.

create table if not exists public.email_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique
    check (char_length(email) <= 254 and email = lower(email) and email like '%_@_%._%'),
  exam_interest text check (exam_interest in ('gate', 'jee')),
  consented_at timestamptz not null,
  source_page text not null check (char_length(source_page) <= 200),
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  -- Set when the person tapped "Notify me" on the Studyloaf Plus card.
  -- Rows created from that card also have source_page = 'plus_waitlist'.
  plus_waitlist_at timestamptz
);

-- For a table created by an earlier version of this file.
alter table public.email_signups add column if not exists plus_waitlist_at timestamptz;

-- RLS on with no policies: anon and authenticated get no rows and can't
-- insert, update or delete. The explicit revoke is belt and braces.
alter table public.email_signups enable row level security;
revoke all on table public.email_signups from anon, authenticated;

-- service_role bypasses RLS, but still needs ordinary table privileges.
-- insert: the signup route. update: the unsubscribe page (sets
-- unsubscribed_at by id) and the signup route (sets plus_waitlist_at on an
-- address already on the list). select: needed by those filtered updates.
grant select, insert, update on table public.email_signups to service_role;
