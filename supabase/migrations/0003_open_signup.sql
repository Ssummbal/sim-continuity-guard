-- Open sign-up.
-- Run after 0002_profiles.sql. Do not edit the applied 0002 migration.
--
-- New accounts are approved immediately as reviewers. Existing profiles are
-- left untouched, so any account already set to 'pending' or 'rejected' stays
-- blocked by the existing RLS policies and the app's requireUser() check.

alter table public.profiles
  alter column status set default 'approved';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, status, role)
  values (new.id, new.email, 'approved', 'reviewer')
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
