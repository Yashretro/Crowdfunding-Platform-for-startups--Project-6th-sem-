#!/usr/bin/env pwsh
# One-shot Vercel deploy script. Requires `VERCEL_TOKEN` env var set.

if (-not $env:VERCEL_TOKEN) {
  Write-Error "VERCEL_TOKEN environment variable not set. Set it and re-run."
  exit 1
}

Write-Output "Installing vercel CLI (if needed)..."
npm i -g vercel --silent

Write-Output "Deploying to Vercel (production)..."
vercel --prod --token $env:VERCEL_TOKEN
