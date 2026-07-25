-- Adds founder/member badge support to profiles and automates assignment for first 500 users.
-- Safe to run multiple times.

-- 1) Badge support on profiles
alter table public.profiles
add column if not exists badges text[] not null default '{}'::text[];

-- 2) Backfill founder badge for earliest 500 users by auth.users.created_at
update public.profiles p
set badges = case
  when array_position(coalesce(p.badges, '{}'::text[]), 'founder') is null
    then array_append(coalesce(p.badges, '{}'::text[]), 'founder')
  else coalesce(p.badges, '{}'::text[])
end
where p.id in (
  select u.id
  from auth.users u
  order by u.created_at asc
  limit 500
);

-- 3) Auto-create profile with founder/member badge at sign-up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_count int;
  base_badges text[];
begin
  -- AFTER INSERT includes the new user, so <= 500 marks users #1..#500 as founders.
  select count(*) into user_count from auth.users;

  if user_count <= 500 then
    base_badges := ARRAY['founder'];
  else
    base_badges := ARRAY['member'];
  end if;

  insert into public.profiles (id, username, badges)
  values (new.id, 'user_' || substr(new.id::text, 1, 8), base_badges)
  on conflict (id) do update
    set badges = excluded.badges,
        username = coalesce(public.profiles.username, excluded.username);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 4) Manual founder assignment by username (duplicate-safe)
-- update public.profiles
-- set badges = case
--   when array_position(coalesce(badges, '{}'::text[]), 'founder') is null
--     then array_append(coalesce(badges, '{}'::text[]), 'founder')
--   else coalesce(badges, '{}'::text[])
-- end
-- where username = 'USERNAME_HERE';

-- 5) Manual founder assignment by email (duplicate-safe)
-- update public.profiles
-- set badges = case
--   when array_position(coalesce(badges, '{}'::text[]), 'founder') is null
--     then array_append(coalesce(badges, '{}'::text[]), 'founder')
--   else coalesce(badges, '{}'::text[])
-- end
-- where id = (
--   select id
--   from auth.users
--   where email = 'EMAIL_HERE'
--   limit 1
-- );
