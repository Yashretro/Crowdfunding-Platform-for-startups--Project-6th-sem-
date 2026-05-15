# Deploy frontend to Vercel and set `VITE_API_BASE_URL`

This guide shows how to deploy the frontend to Vercel and wire the production API URL.

1. Prepare the frontend build
   - From the frontend root run:

```bash
npm install
npm run build
```

2. Deploy with the Vercel CLI (recommended) or connect your GitHub repo in the Vercel dashboard
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`
   - From the project folder run `vercel` and follow prompts (or `vercel --prod` to push to production)

3. Set the environment variable in Vercel
   - In the Vercel dashboard for your project, go to Settings > Environment Variables
   - Add `VITE_API_BASE_URL` with value `https://kickscale-backend-production.up.railway.app` (or your backend URL)
   - Alternatively use the CLI:

```bash
vercel env add VITE_API_BASE_URL production https://kickscale-backend-production.up.railway.app
```

4. Build & Output
   - Build command: `npm run build`
   - Output directory: `dist`

5. Verify
   - After deployment, open the Vercel URL and test the frontend flows (list projects, login)

Notes:
 - Vite exposes env vars that start with `VITE_` at build time. Make sure `VITE_API_BASE_URL` is set in production. 
 - If you prefer to deploy on push, connect the GitHub repo in Vercel and set the env var there.
