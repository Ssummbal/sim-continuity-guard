-- SIM Continuity Guard schema.
-- Run in the Supabase SQL editor before starting the app.
--
-- Access model:
--   * The Next.js app uses the server-only secret key (service_role).
--   * Anonymous clients have no access.
--   * Authenticated staff can read cases and audit entries.
--   * All writes go through the service_role-only RPCs below.

create extension if not exists pgcrypto;

create sequence if not exists public.case_id_seq start with 1054;

create table if not exists public.cases (
  id text primary key default ('SCG-' || lpad(nextval('public.case_id_seq')::text, 4, '0')),
  phone_number text not null,
  carrier text not null default 'stc',
  days_inactive integer not null check (days_inactive >= 0),
  was_recycled boolean not null,
  linked_accounts integer not null check (linked_accounts >= 0),
  recent_sim_swap boolean not null,
  device_changed boolean not null,
  score integer not null check (score between 0 and 100),
  level text not null check (level in ('low', 'medium', 'high')),
  signals jsonb not null default '[]'::jsonb,
  recommended_action text not null check (
    recommended_action in ('auto_clear', 'human_review', 'human_review_urgent')
  ),
  status text not null check (
    status in ('pending', 'auto_cleared', 'approved', 'rejected', 'more_info_requested')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  decision jsonb
);

create table if not exists public.audit_entries (
  id text primary key default ('AUD-' || replace(gen_random_uuid()::text, '-', '')),
  case_id text not null references public.cases (id) on delete cascade,
  phone_number text not null,
  decision text not null check (
    decision in ('auto_cleared', 'approved', 'rejected', 'more_info_requested')
  ),
  reviewer text not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists cases_level_status_idx on public.cases (level, status);
create index if not exists cases_created_at_idx on public.cases (created_at);
create index if not exists audit_entries_created_at_idx on public.audit_entries (created_at desc);

alter table public.cases enable row level security;
alter table public.audit_entries enable row level security;

drop policy if exists "authenticated staff can read cases" on public.cases;
create policy "authenticated staff can read cases"
  on public.cases
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated staff can read audit entries" on public.audit_entries;
create policy "authenticated staff can read audit entries"
  on public.audit_entries
  for select
  to authenticated
  using (true);

-- No insert/update/delete policies are defined. Direct writes are denied;
-- the service_role RPCs below are the only write path.

-- Creates the case and, for low-risk auto-clearances, the matching audit entry
-- in a single transaction.
create or replace function public.create_case(
  p_phone_number text,
  p_days_inactive integer,
  p_was_recycled boolean,
  p_linked_accounts integer,
  p_recent_sim_swap boolean,
  p_device_changed boolean,
  p_score integer,
  p_level text,
  p_signals jsonb,
  p_recommended_action text,
  p_status text,
  p_audit_reviewer text,
  p_audit_reason text
) returns public.cases
language plpgsql
security definer
set search_path = public
as $$
declare
  v_case public.cases;
begin
  insert into public.cases (
    phone_number,
    days_inactive,
    was_recycled,
    linked_accounts,
    recent_sim_swap,
    device_changed,
    score,
    level,
    signals,
    recommended_action,
    status
  ) values (
    p_phone_number,
    p_days_inactive,
    p_was_recycled,
    p_linked_accounts,
    p_recent_sim_swap,
    p_device_changed,
    p_score,
    p_level,
    p_signals,
    p_recommended_action,
    p_status
  )
  returning * into v_case;

  if p_status = 'auto_cleared' then
    insert into public.audit_entries (case_id, phone_number, decision, reviewer, reason)
    values (
      v_case.id,
      v_case.phone_number,
      'auto_cleared',
      coalesce(p_audit_reviewer, 'System policy'),
      coalesce(p_audit_reason, 'Auto-cleared by policy.')
    );
  end if;

  return v_case;
end;
$$;

-- Records a human decision only while the case is still pending, then writes
-- the audit entry. Decisions are immutable.
create or replace function public.decide_case(
  p_case_id text,
  p_outcome text,
  p_reviewer text,
  p_reason text
) returns public.cases
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_case public.cases;
  v_now timestamptz := now();
  v_reviewer text := btrim(p_reviewer);
  v_reason text := btrim(p_reason);
begin
  v_status := case p_outcome
    when 'approved' then 'approved'
    when 'rejected' then 'rejected'
    when 'more_info' then 'more_info_requested'
    else null
  end;

  if v_status is null then
    raise exception 'Invalid decision outcome.' using errcode = '22023';
  end if;

  update public.cases
     set status = v_status,
         updated_at = v_now,
         decision = jsonb_build_object(
           'outcome', p_outcome,
           'reviewer', v_reviewer,
           'reason', v_reason,
           'decidedAt', v_now
         )
   where id = p_case_id
     and status = 'pending'
  returning * into v_case;

  if v_case.id is null then
    if exists (select 1 from public.cases where id = p_case_id) then
      raise exception 'This case has already been decided.' using errcode = 'P0001';
    end if;

    raise exception 'Case not found.' using errcode = 'P0001';
  end if;

  insert into public.audit_entries (case_id, phone_number, decision, reviewer, reason, created_at)
  values (v_case.id, v_case.phone_number, v_status, v_reviewer, v_reason, v_now);

  return v_case;
end;
$$;

-- Anonymous clients get nothing. Authenticated staff can read; writes stay
-- with the server-only service role.
revoke all on public.cases, public.audit_entries from anon, authenticated;
revoke all on sequence public.case_id_seq from anon, authenticated;

grant select on public.cases, public.audit_entries to authenticated;
grant all on public.cases, public.audit_entries to service_role;
grant usage, select on sequence public.case_id_seq to service_role;

revoke all on function public.create_case(
  text, integer, boolean, integer, boolean, boolean, integer, text, jsonb, text, text, text, text
) from public, anon, authenticated;

revoke all on function public.decide_case(text, text, text, text)
  from public, anon, authenticated;

grant execute on function public.create_case(
  text, integer, boolean, integer, boolean, boolean, integer, text, jsonb, text, text, text, text
) to service_role;

grant execute on function public.decide_case(text, text, text, text) to service_role;
