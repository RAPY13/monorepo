param([string], [string])

switch () {
  'new' { & 'C:\dev\rapyard-new/../src/commands/new.ps1' -Name  }
  'deploy' { & 'C:\dev\rapyard-new/../src/commands/deploy.ps1' }
  default { Write-Host 'Unknown command' }
}
