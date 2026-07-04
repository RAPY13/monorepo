Write-Host "Bootstrapping RapYard (Cloudflare + Supabase Pro)..."

# Root
New-Item -ItemType Directory -Force -Path "rapyard"

# -----------------------------
# FRONTEND (Cloudflare Pages)
# -----------------------------
New-Item -ItemType Directory -Force -Path "rapyard/frontend/public/images"
New-Item -ItemType Directory -Force -Path "rapyard/frontend/public/sound"
New-Item -ItemType Directory -Force -Path "rapyard/frontend/src/css"
New-Item -ItemType Directory -Force -Path "rapyard/frontend/src/js"
New-Item -ItemType Directory -Force -Path "rapyard/frontend/src/pages"

Set-Content -Path "rapyard/frontend/package.json" -Value @"
{
  "name": "rapyard-frontend",
  "version": "1.0.0",
  "scripts": {
    "deploy": "wrangler pages deploy ./"
  }
}
"@

# -----------------------------
# BACKEND (Cloudflare Workers)
# -----------------------------
New-Item -ItemType Directory -Force -Path "rapyard/backend/src"

Set-Content -Path "rapyard/backend/wrangler.toml" -Value @"
name = 'rapyard-api'
main = 'src/index.ts'
compatibility_date = '2024-09-01'

[vars]
SUPABASE_URL = ''
SUPABASE_SERVICE_ROLE_KEY = ''
"@

Set-Content -Path "rapyard/backend/package.json" -Value @"
{
  "name": "rapyard-api",
  "version": "1.0.0",
  "dependencies": {
    "hono": "^4.0.0",
    "@supabase/supabase-js": "^2.0.0"
  }
}
"@

# -----------------------------
# CONFIG
# -----------------------------
New-Item -ItemType Directory -Force -Path "rapyard/config"

Set-Content -Path "rapyard/config/rapyard.config.json" -Value @"
{
  "domain": "rapyard.club",
  "frontend_url": "https://rapyard.club",
  "api_url": "https://api.rapyard.club",
  "supabase_url": "",
  "supabase_anon_key": "",
  "supabase_service_role": "",
  "cloudflare_account_id": "",
  "cloudflare_r2_bucket": "rapyard-audio",
  "cloudflare_pages_project": "rapyard-frontend",
  "cloudflare_workers_project": "rapyard-api"
}
"@

# -----------------------------
# CLI
# -----------------------------
New-Item -ItemType Directory -Force -Path "rapyard/cli/bin"
New-Item -ItemType Directory -Force -Path "rapyard/cli/src/commands"
New-Item -ItemType Directory -Force -Path "rapyard/cli/src/utils"
New-Item -ItemType Directory -Force -Path "rapyard/cli/templates"

Set-Content -Path "rapyard/cli/bin/rapyard.ps1" -Value @"
param([string]$Command, [string]$Name)

switch ($Command) {
  'new' { & '$PSScriptRoot/../src/commands/new.ps1' -Name $Name }
  'deploy' { & '$PSScriptRoot/../src/commands/deploy.ps1' }
  default { Write-Host 'Unknown command' }
}
"@

Write-Host "RapYard bootstrap updated for Cloudflare + Supabase Pro."
