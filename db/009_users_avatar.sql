-- Keeps first-login user records aligned with the auth callback.
alter table public.users
add column if not exists avatar text,
add column if not exists created_at timestamptz not null default now();-- Stores the avatar captured from the auth provider on first login.

alter table public.users
add column if not exists avatar text;