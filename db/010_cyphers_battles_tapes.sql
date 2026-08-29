-- RapYard domain model for progression, economy, creator, and community loops.
-- Additive migration. Legacy battles/tracks tables remain supported.

create table if not exists public.progression_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  xp_delta integer not null default 0,
  credits_delta integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits integer not null default 0 check (credits >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.cyphers (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'lobby' check (status in ('lobby', 'live', 'ended')),
  max_members integer not null default 8 check (max_members between 2 and 64),
  starts_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.cypher_members (
  cypher_id uuid not null references public.cyphers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (cypher_id, user_id)
);

create table if not exists public.cypher_entries (
  id uuid primary key default gen_random_uuid(),
  cypher_id uuid not null references public.cyphers(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  audio_path text not null,
  duration integer not null default 0 check (duration >= 0),
  entry_order integer not null,
  created_at timestamptz not null default now(),
  unique (cypher_id, entry_order)
);

create table if not exists public.battle_matches (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid not null references auth.users(id) on delete cascade,
  opponent_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'judging', 'completed')),
  winner_id uuid references auth.users(id) on delete set null,
  xp_reward integer not null default 100 check (xp_reward >= 0),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check (challenger_id <> opponent_id)
);

create table if not exists public.battle_entries (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.battle_matches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  audio_path text not null,
  round_number integer not null default 1 check (round_number > 0),
  created_at timestamptz not null default now(),
  unique (match_id, user_id, round_number)
);

create table if not exists public.battle_votes (
  match_id uuid not null references public.battle_matches(id) on delete cascade,
  voter_id uuid not null references auth.users(id) on delete cascade,
  voted_for uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (match_id, voter_id),
  check (voter_id <> voted_for)
);

create table if not exists public.mixtapes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cover_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.mixtape_tracks (
  mixtape_id uuid not null references public.mixtapes(id) on delete cascade,
  position integer not null check (position >= 0),
  title text not null,
  audio_path text not null,
  duration integer not null default 0 check (duration >= 0),
  primary key (mixtape_id, position)
);

create index if not exists progression_events_user_created_idx on public.progression_events(user_id, created_at desc);
create index if not exists cypher_entries_cypher_order_idx on public.cypher_entries(cypher_id, entry_order);
create index if not exists battle_matches_status_idx on public.battle_matches(status);
create index if not exists mixtapes_owner_created_idx on public.mixtapes(owner_id, created_at desc);

alter table public.progression_events enable row level security;
alter table public.wallets enable row level security;
alter table public.cyphers enable row level security;
alter table public.cypher_members enable row level security;
alter table public.cypher_entries enable row level security;
alter table public.battle_matches enable row level security;
alter table public.battle_entries enable row level security;
alter table public.battle_votes enable row level security;
alter table public.mixtapes enable row level security;
alter table public.mixtape_tracks enable row level security;

-- User-owned records.
drop policy if exists progression_events_read_own on public.progression_events;
create policy progression_events_read_own on public.progression_events for select using (auth.uid() = user_id);
drop policy if exists wallets_read_own on public.wallets;
create policy wallets_read_own on public.wallets for select using (auth.uid() = user_id);

-- Cypher participation and public room discovery.
drop policy if exists cyphers_read_authenticated on public.cyphers;
create policy cyphers_read_authenticated on public.cyphers for select to authenticated using (true);
drop policy if exists cypher_members_read_authenticated on public.cypher_members;
create policy cypher_members_read_authenticated on public.cypher_members for select to authenticated using (true);
drop policy if exists cypher_members_join_own on public.cypher_members;
create policy cypher_members_join_own on public.cypher_members for insert with check (auth.uid() = user_id);
drop policy if exists cypher_entries_read_authenticated on public.cypher_entries;
create policy cypher_entries_read_authenticated on public.cypher_entries for select to authenticated using (true);
drop policy if exists cypher_entries_insert_own on public.cypher_entries;
create policy cypher_entries_insert_own on public.cypher_entries for insert with check (auth.uid() = author_id);

-- Battles are readable; entries belong to their performer; one vote per user is enforced above.
drop policy if exists battle_matches_read_authenticated on public.battle_matches;
create policy battle_matches_read_authenticated on public.battle_matches for select to authenticated using (true);
drop policy if exists battle_entries_read_authenticated on public.battle_entries;
create policy battle_entries_read_authenticated on public.battle_entries for select to authenticated using (true);
drop policy if exists battle_entries_insert_own on public.battle_entries;
create policy battle_entries_insert_own on public.battle_entries for insert with check (auth.uid() = user_id);
drop policy if exists battle_votes_insert_own on public.battle_votes;
create policy battle_votes_insert_own on public.battle_votes for insert with check (auth.uid() = voter_id);

-- Mixtapes are public when published; owners control drafts and tracks.
drop policy if exists mixtapes_read_visible on public.mixtapes;
create policy mixtapes_read_visible on public.mixtapes for select using (status = 'published' or auth.uid() = owner_id);
drop policy if exists mixtapes_insert_own on public.mixtapes;
create policy mixtapes_insert_own on public.mixtapes for insert with check (auth.uid() = owner_id);
drop policy if exists mixtapes_update_own on public.mixtapes;
create policy mixtapes_update_own on public.mixtapes for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists mixtape_tracks_read_visible on public.mixtape_tracks;
create policy mixtape_tracks_read_visible on public.mixtape_tracks for select using (exists (select 1 from public.mixtapes m where m.id = mixtape_id and (m.status = 'published' or m.owner_id = auth.uid())));
drop policy if exists mixtape_tracks_write_own on public.mixtape_tracks;
create policy mixtape_tracks_write_own on public.mixtape_tracks for all using (exists (select 1 from public.mixtapes m where m.id = mixtape_id and m.owner_id = auth.uid())) with check (exists (select 1 from public.mixtapes m where m.id = mixtape_id and m.owner_id = auth.uid()));
