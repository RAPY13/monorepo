-- Production schema alignment
-- Run this in the Supabase SQL editor if the tables don't exist yet.
-- Uses bigint identity PKs (simpler than uuid for a fresh production DB).

create table if not exists public.waitlist (
    id bigint generated always as identity primary key,
    email text not null unique,
    source text not null default 'gate',
    status text not null default 'pending',
    is_founder boolean not null default false,
    created_at timestamptz not null default now()
);

create table if not exists public.users (
    id bigint generated always as identity primary key,
    email text not null unique,
    lane text not null default 'listener',
    is_founder boolean not null default false,
    created_at timestamptz not null default now()
);
