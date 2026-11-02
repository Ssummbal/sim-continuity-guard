-- Admin-approved access profiles.
-- Run after 0001_init.sql. Do not edit the applied 0001 migration.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected')
  ),
  role text not null default 'reviewer',
  created_at timestamptz not null default now()
);

-- Grandfather accounts that existed before this migration as approved admins
-- so current staff are not locked out. New sign-ups are created as pending
-- reviewers by the trigger below.
insert into public.profiles (id, email, status, role)
select id, email, 'approved', 'admin'
from auth.users
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, status, role)
  values (new.id, new.email, 'pending', 'reviewer')
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

-- No insert/update/delete policies: clients can only read their own row.
-- All writes to profiles are service_role only.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant all on public.profiles to service_role;

-- Reads of case and audit data now also require an approved profile.
drop policy if exists "authenticated staff can read cases" on public.cases;
drop policy if exists "approved staff can read cases" on public.cases;
create policy "approved staff can read cases"
  on public.cases
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.status = 'approved'
    )
  );

drop policy if exists "authenticated staff can read audit entries" on public.audit_entries;
drop policy if exists "approved staff can read audit entries" on public.audit_entries;
create policy "approved staff can read audit entries"
  on public.audit_entries
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.status = 'approved'
    )
  );
