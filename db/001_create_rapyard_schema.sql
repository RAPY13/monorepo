-- RapYard database schema

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text unique,
  lane text not null check (lane in ('rapper','producer','listener')) default 'listener',
  styles text[] default '{}',
  is_founder boolean default false,
  created_at timestamptz default now()
);

create table profiles (
  user_id uuid primary key references users(id) on delete cascade,
  avatar_url text,
  bio text,
  followers_count int default 0,
  plays_count int default 0,
  tracks_count int default 0
);

create policy "public profiles readable"
  on profiles for select
  using (true);

create policy "users update own profile"
  on profiles for update
  using (auth.uid() = user_id);

create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null check (source in ('gate','social','direct')) default 'gate',
  status text not null check (status in ('pending','invited','joined')) default 'pending',
  is_founder boolean default false,
  created_at timestamptz default now()
);

create unique index waitlist_email_unique on waitlist (email);

create policy "public waitlist read"
  on waitlist for select
  using (true);

create policy "waitlist insert open"
  on waitlist for insert
  with check (true);

create table tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  genre text,
  url text,
  created_at timestamptz default now()
);

create table battles (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid references users(id),
  opponent_id uuid references users(id),
  status text check (status in ('upcoming','live','completed')) default 'upcoming',
  scheduled_at timestamptz,
  created_at timestamptz default now()
);

create table battle_rounds (
  id uuid primary key default gen_random_uuid(),
  battle_id uuid references battles(id) on delete cascade,
  round_number int,
  challenger_track uuid references tracks(id),
  opponent_track uuid references tracks(id)
);

create policy "users upload own tracks"
  on tracks for insert
  with check (auth.uid() = user_id);

create table votes (
  id uuid primary key default gen_random_uuid(),
  battle_id uuid references battles(id) on delete cascade,
  voter_id uuid references users(id),
  voted_for uuid references users(id),
  created_at timestamptz default now(),
  unique (battle_id, voter_id)
);
