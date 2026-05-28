# ============================================================
# RAPYARD FULL MONOREPO BOOTSTRAP (FORCE REWRITE)
# Apps + Packages + Infra + CLI + Root
# ============================================================

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "`n=== RAPYARD FULL BOOTSTRAP (FORCE) ===`n" -ForegroundColor Yellow

function Ensure-Folder {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Write-File {
  param(
    [string]$Path,
    [string]$Content
  )
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
  $Content | Set-Content $Path -Encoding UTF8 -Force
  Write-Host "Wrote: $Path" -ForegroundColor Green
}

# ============================================================
# FOLDERS
# ============================================================

$folders = @(
  "apps",
  "apps\web",
  "apps\web\app",
  "apps\web\public",
  "apps\mobile",
  "apps\mobile\app",
  "apps\docs",
  "apps\docs\app",
  "apps\api",
  "apps\api\src",
  "apps\worker",
  "apps\worker\src",
  "packages",
  "packages\ui\src",
  "packages\config\src",
  "packages\utils\src",
  "infra",
  "infra\supabase",
  "infra\terraform",
  "tools",
  "tools\doctor",
  "tools\ry"
)

$folders | ForEach-Object { Ensure-Folder "$root\$_" }

# ============================================================
# ROOT FILES
# ============================================================

Write-File "$root\package.json" @"
{
  "name": "rapyard",
  "private": true,
  "packageManager": "pnpm@11.3.0",
  "engines": {
    "node": ">=26.2.0",
    "pnpm": ">=11.3.0"
  },
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "clean": "turbo run clean",
    "doctor": "node tools/doctor/index.js",
    "ry": "node tools/ry/index.mjs"
  },
  "workspaces": [
    "apps/*",
    "packages/*",
    "tools/*"
  ],
  "devDependencies": {
    "typescript": "5.6.3",
    "turbo": "latest"
  }
}
"@

Write-File "$root\pnpm-workspace.yaml" @"
packages:
  - "apps/*"
  - "packages/*"
  - "tools/*"
"@

Write-File "$root\turbo.json" @"
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
"@

Write-File "$root\tsconfig.base.json" @"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "paths": {
      "@web/*": ["apps/web/*"],
      "@mobile/*": ["apps/mobile/*"],
      "@docs/*": ["apps/docs/*"],
      "@api/*": ["apps/api/*"],
      "@worker/*": ["apps/worker/*"],
      "@ui/*": ["packages/ui/*"],
      "@config/*": ["packages/config/*"],
      "@utils/*": ["packages/utils/*"]
    }
  }
}
"@

Write-File "$root\tsconfig.json" @"
{
  "extends": "./tsconfig.base.json",
  "include": ["apps", "packages", "tools"]
}
"@

Write-File "$root\vercel.json" @"
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/web/.next"
}
"@

Write-File "$root\.gitignore" @"
node_modules/
pnpm-lock.yaml
.pnpm-store/
dist/
build/
out/
.next/
.expo/
.expo-shared/
turbo/
.turbo/
*.tsbuildinfo
.env
.env.*
!.env.example
.DS_Store
Thumbs.db
.vscode/
.idea/
.vercel/
coverage/
.cache/
"@

Write-File "$root\.env.example" @"
SUPABASE_URL=
SUPABASE_ANON_KEY=

VERCEL_TOKEN=
VERCEL_PROJECT_ID=
VERCEL_ORG_ID=
"@

# ============================================================
# APPS
# ============================================================

# Web (Next.js)
Write-File "$root\apps\web\package.json" @"
{
  "name": "@rapyard/web",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
"@

Write-File "$root\apps\web\next.config.mjs" @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
};
export default nextConfig;
"@

Write-File "$root\apps\web\app\page.tsx" @"
export default function Home() {
  return (
    <main className='min-h-screen bg-black text-white flex items-center justify-center'>
      <h1 className='text-4xl font-bold text-yellow-400'>RapYard Web</h1>
    </main>
  );
}
"@

# Mobile (Expo)
Write-File "$root\apps\mobile\package.json" @"
{
  "name": "@rapyard/mobile",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0"
  }
}
"@

Write-File "$root\apps\mobile\app\index.tsx" @"
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: 'yellow', fontSize: 24 }}>RapYard Mobile</Text>
    </View>
  );
}
"@

# Docs (Next.js)
Write-File "$root\apps\docs\package.json" @"
{
  "name": "@rapyard/docs",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
"@

Write-File "$root\apps\docs\next.config.mjs" @"
const nextConfig = {
  experimental: {
    appDir: true
  }
};
export default nextConfig;
"@

Write-File "$root\apps\docs\app\page.tsx" @"
export default function DocsHome() {
  return (
    <main className='min-h-screen bg-black text-white p-12'>
      <h1 className='text-4xl font-bold text-yellow-400'>RapYard Docs</h1>
    </main>
  );
}
"@

# API (Hono)
Write-File "$root\apps\api\package.json" @"
{
  "name": "@rapyard/api",
  "private": true,
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "hono": "^4.0.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "typescript": "5.6.3"
  }
}
"@

Write-File "$root\apps\api\tsconfig.json" @"
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
"@

Write-File "$root\apps\api\src\index.ts" @"
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ ok: true, service: 'RapYard API' }));

export default app;
"@

# Worker
Write-File "$root\apps\worker\package.json" @"
{
  "name": "@rapyard/worker",
  "private": true,
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc -p tsconfig.json"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "typescript": "5.6.3"
  }
}
"@

Write-File "$root\apps\worker\tsconfig.json" @"
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
"@

Write-File "$root\apps\worker\src\index.ts" @"
console.log('RapYard Worker online');
"@

# ============================================================
# PACKAGES
# ============================================================

# UI
Write-File "$root\packages\ui\package.json" @"
{
  "name": "@rapyard/ui",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts"
}
"@

Write-File "$root\packages\ui\src\index.ts" @"
export const Button = () => null;
"@

# Config
Write-File "$root\packages\config\package.json" @"
{
  "name": "@rapyard/config",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts"
}
"@

Write-File "$root\packages\config\src\index.ts" @"
export const RAPYARD_ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development'
};
"@

# Utils
Write-File "$root\packages\utils\package.json" @"
{
  "name": "@rapyard/utils",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts"
}
"@

Write-File "$root\packages\utils\src\index.ts" @"
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
"@

# ============================================================
# INFRA
# ============================================================

Write-File "$root\infra\supabase\README.md" @"
# Supabase Infra

Configure Supabase projects, migrations, and policies here.
"@

Write-File "$root\infra\terraform\main.tf" @"
terraform {
  required_version = ">= 1.6.0"
}

provider "aws" {
  region = "us-east-1"
}
"@

# ============================================================
# TOOLS
# ============================================================

# Doctor
Write-File "$root\tools\doctor\index.js" @"
console.log('RapYard Doctor: OK');
process.exit(0);
"@

# RapYard CLI (ry)
Write-File "$root\tools\ry\package.json" @"
{
  "name": "@rapyard/cli",
  "private": true,
  "bin": {
    "ry": "index.mjs"
  },
  "type": "module"
}
"@

Write-File "$root\tools\ry\index.mjs" @"
#!/usr/bin/env node
import { execSync } from 'node:child_process';

const cmd = process.argv[2];

if (cmd === 'dev') {
  execSync('pnpm dev', { stdio: 'inherit' });
} else if (cmd === 'build') {
  execSync('pnpm build', { stdio: 'inherit' });
} else if (cmd === 'doctor') {
  execSync('pnpm doctor', { stdio: 'inherit' });
} else {
  console.log('RapYard CLI (ry)');
  console.log('Commands: dev, build, doctor');
}
"@

Write-Host "`n=== RAPYARD FULL BOOTSTRAP COMPLETE ===" -ForegroundColor Yellow
Write-Host "Next step: pnpm install" -ForegroundColor Green
