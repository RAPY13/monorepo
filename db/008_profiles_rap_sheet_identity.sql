-- Adds the canonical Rap-Sheet identity and mic-test fields.
-- Safe to run multiple times.

alter table public.profiles
add column if not exists artist_name text,
add column if not exists lane_id text,
add column if not exists style_tags text[] not null default '{}'::text[],
add column if not exists yard_code text,
add column if not exists mic_status text not null default 'not_tested',
add column if not exists level integer not null default 0,
add column if not exists xp integer not null default 0,
add column if not exists respect integer not null default 0,
add column if not exists rank text,
add column if not exists starting_badge text default 'fresh_ink';

do $$
begin
   if not exists (select 1 from pg_constraint where conname = 'profiles_lane_id_check') then
      alter table public.profiles add constraint profiles_lane_id_check
         check (lane_id is null or lane_id in ('underground', 'old_school', 'freestyle', 'battle'));
   end if;
   if not exists (select 1 from pg_constraint where conname = 'profiles_mic_status_check') then
      alter table public.profiles add constraint profiles_mic_status_check
         check (mic_status in ('not_tested', 'ready', 'denied'));
   end if;
   if not exists (select 1 from pg_constraint where conname = 'profiles_level_check') then
      alter table public.profiles add constraint profiles_level_check
         check (level >= 0);
   end if;
end $$;

update public.profiles
set artist_name = coalesce(artist_name, rap_name),
    lane_id = coalesce(lane_id, case when role = 'rapper' then 'underground' else null end),
    yard_code = coalesce(yard_code, 'UNSET'),
    rank = coalesce(rank, 'New Voice')
where artist_name is null
   or lane_id is null
   or yard_code is null
   or rank is null;
