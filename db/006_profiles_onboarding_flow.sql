-- Adds onboarding fields required by the RapYard post-auth flow.
-- Safe for mixed schemas (profiles.id and/or profiles.user_id).

alter table public.profiles
add column if not exists role text,
add column if not exists tenant text,
add column if not exists onboarding_complete boolean not null default false,
add column if not exists tenant_region text,
add column if not exists tenant_banner_url text,
add column if not exists tenant_faction text;

-- Keep role values constrained to supported onboarding lanes.
do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'profiles'
      and constraint_name = 'profiles_role_check'
  ) then
    alter table public.profiles
    add constraint profiles_role_check
    check (role is null or role in ('rapper', 'producer', 'listener'));
  end if;
end $$;

create index if not exists profiles_tenant_idx on public.profiles (tenant);
