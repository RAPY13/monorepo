-- Help Center / Support Hub schema
-- Adds dynamic help articles and support ticket storage for Supabase.

create table if not exists public.help_articles (
  id bigint generated always as identity primary key,
  slug text unique,
  title text not null,
  content text not null,
  category text not null,
  role text,
  tenant text,
  tags text[] not null default '{}'::text[],
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.support_requests (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  category text not null,
  message text not null,
  role text,
  tenant text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists help_articles_category_idx on public.help_articles (category);
create index if not exists help_articles_role_idx on public.help_articles (role);
create index if not exists help_articles_tenant_idx on public.help_articles (tenant);
create index if not exists support_requests_user_id_idx on public.support_requests (user_id);
create index if not exists support_requests_status_idx on public.support_requests (status);

-- Basic constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'help_articles'
      AND constraint_name = 'help_articles_role_check'
  ) THEN
    ALTER TABLE public.help_articles
    ADD CONSTRAINT help_articles_role_check
    CHECK (role IS NULL OR role IN ('rapper', 'producer', 'listener'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'support_requests'
      AND constraint_name = 'support_requests_role_check'
  ) THEN
    ALTER TABLE public.support_requests
    ADD CONSTRAINT support_requests_role_check
    CHECK (role IS NULL OR role IN ('rapper', 'producer', 'listener'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'support_requests'
      AND constraint_name = 'support_requests_status_check'
  ) THEN
    ALTER TABLE public.support_requests
    ADD CONSTRAINT support_requests_status_check
    CHECK (status IN ('open', 'triaged', 'resolved', 'closed'));
  END IF;
END $$;

alter table public.help_articles enable row level security;
alter table public.support_requests enable row level security;

-- Published help content can be read by authenticated users.
DROP POLICY IF EXISTS "authenticated users read published help" ON public.help_articles;
CREATE POLICY "authenticated users read published help"
ON public.help_articles
FOR SELECT
TO authenticated
USING (is_published = true);

-- Authenticated users can open their own support tickets.
DROP POLICY IF EXISTS "users insert own support requests" ON public.support_requests;
CREATE POLICY "users insert own support requests"
ON public.support_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can review their own tickets.
DROP POLICY IF EXISTS "users read own support requests" ON public.support_requests;
CREATE POLICY "users read own support requests"
ON public.support_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Optional starter help content
insert into public.help_articles (slug, title, content, category, role, tenant, tags, is_published)
values
  (
    'upload-beats-producer',
    'How do I upload beats as a producer?',
    'Open Studio > Upload, attach preview and metadata, then publish to Marketplace with license terms.',
    'Studio',
    'producer',
    null,
    ARRAY['studio', 'upload', 'producer'],
    true
  ),
  (
    'battle-entry-rapper',
    'How do I enter battles as a rapper?',
    'Visit Battles, choose an open challenge, submit your round before lock time, and confirm entry.',
    'Battles',
    'rapper',
    null,
    ARRAY['battles', 'rapper'],
    true
  ),
  (
    'royalties-overview',
    'How do royalties work in RapYard?',
    'Royalties are computed from split settings, qualifying activity, and statement windows shown in dashboard.',
    'Royalties',
    null,
    null,
    ARRAY['royalties', 'splits'],
    true
  ),
  (
    'yard-lords-ops-guide',
    'Yard Lords operations guide',
    'Set moderation roles, posting windows, and release standards before opening public submissions.',
    'Getting Started',
    null,
    'yard-lords',
    ARRAY['tenant', 'yard-lords'],
    true
  )
on conflict (slug) do nothing;
