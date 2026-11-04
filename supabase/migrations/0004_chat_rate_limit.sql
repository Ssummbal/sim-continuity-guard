create table if not exists public.chat_rate_limits (
  key text not null,
  window_start timestamptz not null,
  count integer not null default 0 check (count >= 0),
  primary key (key, window_start)
);

alter table public.chat_rate_limits enable row level security;

revoke all on public.chat_rate_limits from anon, authenticated;

create or replace function public.check_chat_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_window_start timestamptz;
  v_count integer;
begin
  if p_key is null
    or btrim(p_key) = ''
    or p_limit is null
    or p_limit < 1
    or p_window_seconds is null
    or p_window_seconds < 1 then
    return false;
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from v_now) / p_window_seconds) * p_window_seconds
  );

  insert into public.chat_rate_limits (key, window_start, count)
  values (p_key, v_window_start, 1)
  on conflict (key, window_start)
  do update set count = public.chat_rate_limits.count + 1
  returning count into v_count;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.check_chat_rate_limit(text, integer, integer)
  from public, anon, authenticated;

grant execute on function public.check_chat_rate_limit(text, integer, integer)
  to service_role;
