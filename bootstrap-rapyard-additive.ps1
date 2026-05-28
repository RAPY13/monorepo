# ============================================================
# RAPYARD ADDITIVE BOOTSTRAP (NON-DESTRUCTIVE)
# Adds missing files only. Never overwrites existing ones.
# ============================================================

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Ensure-Folder {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
    Write-Host "Created folder: $Path" -ForegroundColor Green
  }
}

function Write-IfMissing {
  param(
    [string]$Path,
    [string]$Content
  )
  if (-not (Test-Path $Path)) {
    $dir = Split-Path -Parent $Path
    if ($dir -and -not (Test-Path $dir)) {
      New-Item -ItemType Directory -Path $dir | Out-Null
    }
    $Content | Set-Content $Path -Encoding UTF8
    Write-Host "Added: $Path" -ForegroundColor Green
  } else {
    Write-Host "Exists, skipped: $Path" -ForegroundColor Yellow
  }
}

# ============================================================
# FOLDERS
# ============================================================

$folders = @(
  "infra/terraform",
  "infra/supabase/policies",
  "apps/api/src/routes",
  "apps/worker/src",
  "packages/ui/src",
  "apps/docs/app/getting-started",
  "apps/docs/app/architecture",
  ".github/workflows"
)

$folders | ForEach-Object { Ensure-Folder "$root\$_" }

# ============================================================
# GOVERNANCE SPEC
# ============================================================

Write-IfMissing "$root\GOVERNANCE.md" @"
# RapYard Governance Spec
(… trimmed for brevity — full spec already provided in chat …)
"@

# ============================================================
# TERRAFORM AWS SKELETON
# ============================================================

Write-IfMissing "$root\infra\terraform\main.tf" @"
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  project = "rapyard"
  env     = var.environment
  tags = {
    Project     = local.project
    Environment = local.env
  }
}
"@

Write-IfMissing "$root\infra\terraform\variables.tf" @"
variable "aws_region" {
  type = string
  default = "us-east-1"
}

variable "environment" {
  type = string
  default = "dev"
}
"@

Write-IfMissing "$root\infra\terraform\outputs.tf" @"
output "region" {
  value = var.aws_region
}
"@

# ============================================================
# SUPABASE POLICIES
# ============================================================

Write-IfMissing "$root\infra\supabase\policies\profiles_policies.sql" @"
alter table profiles enable row level security;

create policy "profiles_select_own"
on profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);
"@

# ============================================================
# API ROUTE SCAFFOLDING
# ============================================================

Write-IfMissing "$root\apps\api\src\routes\health.ts" @"
import { Hono } from 'hono';
export const healthRoute = new Hono();
healthRoute.get('/', c => c.json({ ok: true, ts: new Date().toISOString() }));
"@

Write-IfMissing "$root\apps\api\src\routes\profiles.ts" @"
import { Hono } from 'hono';
export const profilesRoute = new Hono();
profilesRoute.get('/', c => c.json({ data: [], message: 'Profiles placeholder' }));
"@

# ============================================================
# WORKER QUEUE (BULLMQ)
# ============================================================

Write-IfMissing "$root\packages\utils\src\queue.ts" @"
import { Queue, Worker, QueueEvents } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379)
};

export const createQueue = (name: string) =>
  new Queue(name, { connection });

export const createWorker = (name: string, processor: any) =>
  new Worker(name, processor, { connection });

export const createQueueEvents = (name: string) =>
  new QueueEvents(name, { connection });
"@

Write-IfMissing "$root\apps\worker\src\index.ts" @"
import { createQueue, createWorker, createQueueEvents } from '@utils/queue';

const QUEUE_NAME = 'rapyard-jobs';

const queue = createQueue(QUEUE_NAME);
const worker = createWorker(QUEUE_NAME, async job => {
  console.log('Processing job', job.id, job.data);
});

const events = createQueueEvents(QUEUE_NAME);
events.on('completed', ({ jobId }) => console.log('Job completed', jobId));
events.on('failed', ({ jobId, failedReason }) => console.error('Job failed', jobId, failedReason));

console.log('RapYard Worker online');
"@

# ============================================================
# UI STARTER COMPONENTS
# ============================================================

Write-IfMissing "$root\packages\ui\src\Button.tsx" @"
import * as React from 'react';

export const Button = ({ children, ...props }) => (
  <button className='px-4 py-2 bg-yellow-400 text-black rounded' {...props}>
    {children}
  </button>
);
"@

Write-IfMissing "$root\packages\ui\src\Heading.tsx" @"
import * as React from 'react';

export const Heading = ({ level = 1, children }) => {
  const Tag = \`h\${level}\`;
  return <Tag className='text-yellow-400 font-bold'>{children}</Tag>;
};
"@

Write-IfMissing "$root\packages\ui\src\index.ts" @"
export * from './Button';
export * from './Heading';
"@

# ============================================================
# DOCS SITE STRUCTURE
# ============================================================

Write-IfMissing "$root\apps\docs\app\layout.tsx" @"
export default function RootLayout({ children }) {
  return (
    <html>
      <body className='bg-black text-white'>{children}</body>
    </html>
  );
}
"@

Write-IfMissing "$root\apps\docs\app\page.tsx" @"
export default function DocsHome() {
  return (
    <main className='p-10'>
      <h1 className='text-4xl text-yellow-400 font-bold'>RapYard Docs</h1>
    </main>
  );
}
"@

Write-IfMissing "$root\apps\docs\app\getting-started\page.tsx" @"
export default function GettingStarted() {
  return <pre className='p-4 bg-zinc-900'>pnpm install{'\n'}pnpm dev</pre>;
}
"@

Write-IfMissing "$root\apps\docs\app\architecture\page.tsx" @"
export default function Architecture() {
  return <div className='p-4'>RapYard Architecture Overview</div>;
}
"@

# ============================================================
# GITHUB ACTIONS CI PIPELINE
# ============================================================

Write-IfMissing "$root\.github\workflows\ci.yml" @"
name: RapYard CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 11.3.0
      - uses: actions/setup-node@v4
        with:
          node-version: 26
          cache: pnpm
      - run: pnpm install
      - run: pnpm turbo run build --parallel
"@

Write-Host "`n=== RAPYARD ADDITIVE BOOTSTRAP COMPLETE ===" -ForegroundColor Green
1
