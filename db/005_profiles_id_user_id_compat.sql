-- Compatibility migration for deployments where public.profiles uses user_id instead of id.
-- This keeps founder/member logic working across both schemas.

-- Ensure badges exists in either schema shape.
alter table public.profiles
add column if not exists badges text[] not null default '{}'::text[];

-- Add optional id column when only user_id exists so modern queries can work.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'user_id'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'id'
  ) then
    alter table public.profiles add column id uuid;

    -- Keep id synced from legacy user_id for existing rows.
    update public.profiles
    set id = user_id
    where id is null;

    -- Non-breaking uniqueness for modern lookups without changing primary key.
    create unique index if not exists profiles_id_unique on public.profiles(id);
  end if;
end $$;

-- Founder backfill that works with id and/or user_id.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'id'
  ) then
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
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'user_id'
  ) then
    update public.profiles p
    set badges = case
      when array_position(coalesce(p.badges, '{}'::text[]), 'founder') is null
        then array_append(coalesce(p.badges, '{}'::text[]), 'founder')
      else coalesce(p.badges, '{}'::text[])
    end
    where p.user_id in (
      select u.id
      from auth.users u
      order by u.created_at asc
      limit 500
    );
  end if;
end $$;

-- Replace auth trigger function with a schema-aware implementation.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_count int;
  base_badges text[];
  has_id boolean;
  has_user_id boolean;
begin
  select count(*) into user_count from auth.users;

  if user_count <= 500 then
    base_badges := ARRAY['founder'];
  else
    base_badges := ARRAY['member'];
  end if;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'id'
  ) into has_id;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'user_id'
  ) into has_user_id;

  if has_id and has_user_id then
    insert into public.profiles (id, user_id, username, badges)
    values (new.id, new.id, 'user_' || substr(new.id::text, 1, 8), base_badges)
    on conflict (user_id) do update
      set badges = excluded.badges,
          id = coalesce(public.profiles.id, excluded.id),
          username = coalesce(public.profiles.username, excluded.username);
  elsif has_id then
    insert into public.profiles (id, username, badges)
    values (new.id, 'user_' || substr(new.id::text, 1, 8), base_badges)
    on conflict (id) do update
      set badges = excluded.badges,
          username = coalesce(public.profiles.username, excluded.username);
  elsif has_user_id then
    insert into public.profiles (user_id, username, badges)
    values (new.id, 'user_' || substr(new.id::text, 1, 8), base_badges)
    on conflict (user_id) do update
      set badges = excluded.badges,
          username = coalesce(public.profiles.username, excluded.username);
  else
    raise exception 'public.profiles must contain id or user_id column';
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
