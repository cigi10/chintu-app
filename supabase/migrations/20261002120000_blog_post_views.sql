-- Blog post view counter.
--
-- Run this once in the Supabase SQL editor. It is safe to re-run.
--
-- Access model: nobody using the public anon key can read or write this
-- table or call the increment function. The only way to count a view is
-- the server route app/api/blog-views/[slug]/route.ts, which uses the
-- service-role key (server-only, never sent to the browser). The
-- service_role bypasses RLS and is the only role granted EXECUTE on the
-- function below.

create table if not exists public.blog_post_views (
  slug text primary key,
  view_count integer not null default 0 check (view_count >= 0),
  updated_at timestamptz not null default now()
);

-- RLS on with no policies: anon and authenticated get no rows and can't
-- insert, update or delete. The explicit revoke is belt and braces.
alter table public.blog_post_views enable row level security;
revoke all on table public.blog_post_views from anon, authenticated;

-- service_role bypasses RLS, but still needs ordinary table privileges.
-- Newer Supabase projects no longer grant those on new tables by default,
-- so grant exactly what the increment (an upsert with RETURNING) and the
-- server route's read need.
grant select, insert, update on table public.blog_post_views to service_role;

-- Atomic increment. INSERT ... ON CONFLICT DO UPDATE takes a row lock, so
-- concurrent calls for the same slug each add exactly 1 (no lost updates
-- from read-then-write), and a post's first view creates its row.
create or replace function public.increment_blog_post_view(p_slug text)
returns integer
language sql
security invoker
set search_path = ''
as $$
  insert into public.blog_post_views as v (slug, view_count, updated_at)
  values (p_slug, 1, now())
  on conflict (slug) do update
    set view_count = v.view_count + 1,
        updated_at = now()
  returning v.view_count;
$$;

-- Supabase grants EXECUTE on new functions to anon and authenticated by
-- default, which would let anyone call this straight from the browser.
revoke execute on function public.increment_blog_post_view(text) from public, anon, authenticated;
grant execute on function public.increment_blog_post_view(text) to service_role;
