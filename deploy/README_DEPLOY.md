# Quick deploy summary

What's ready:
- `vercel.json` — Vercel config to serve the Vite `dist` build
- GitHub Action: `.github/workflows/deploy-frontend.yml` (builds and deploys using Vercel action)
- `deploy/deploy_vercel.ps1` — one-shot script to deploy from this machine (requires `VERCEL_TOKEN` env var)
- `.env.production` — contains `VITE_API_BASE_URL` used for local/CI builds

To deploy now (from this machine):

```powershell
$env:VERCEL_TOKEN = '<your_token>'
./deploy/deploy_vercel.ps1
```

To enable CI deploy (recommended):
1. Create a GitHub repo and push this project.
2. Add these GitHub repo secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
3. Push to `main` — the workflow will build and deploy to Vercel automatically.

If you want, I can run the one-shot deploy here if you provide `VERCEL_TOKEN` (or paste it securely). Otherwise, the CI path requires adding the three secrets.
