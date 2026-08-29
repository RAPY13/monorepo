-- Persistent Yard reactions and lightweight social activity.

create table if not exists public.yard_reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id text not null,
  content_type text not null default 'feed_item',
  reaction text not null check (reaction in ('fire', 'bolt', 'sunglasses')),
  created_at timestamptz not null default now(),
  unique (user_id, content_id, content_type)
);

create table if not exists public.yard_activity (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete cascade,
  content_id text not null,
  content_type text not null default 'feed_item',
  activity_type text not null check (activity_type in ('comment', 'repost', 'boost')),
  body text,
  created_at timestamptz not null default now()
);

create index if not exists yard_reactions_content_idx on public.yard_reactions(content_id, content_type);
create index if not exists yard_activity_content_idx on public.yard_activity(content_id, content_type, created_at desc);

alter table public.yard_reactions enable row level security;
alter table public.yard_activity enable row level security;

drop policy if exists yard_reactions_read_authenticated on public.yard_reactions;
create policy yard_reactions_read_authenticated on public.yard_reactions for select to authenticated using (true);
drop policy if exists yard_reactions_write_own on public.yard_reactions;
create policy yard_reactions_write_own on public.yard_reactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists yard_activity_read_authenticated on public.yard_activity;
create policy yard_activity_read_authenticated on public.yard_activity for select to authenticated using (true);
drop policy if exists yard_activity_insert_own on public.yard_activity;
create policy yard_activity_insert_own on public.yard_activity for insert with check (auth.uid() = actor_id);
