-- Stripe subscription state for authenticated RapYard accounts.

alter table public.profiles
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text unique,
  add column if not exists subscription_status text,
  add column if not exists subscription_plan text;

create index if not exists profiles_subscription_status_idx
  on public.profiles (subscription_status);

create index if not exists profiles_subscription_plan_idx
  on public.profiles (subscription_plan);