Deployment guide — frontend (Vercel) and backend (Railway/Docker)

Overview
- Frontend: Vite React app — build outputs to `dist/`. Deploy to Vercel (recommended) or any static host.
- Backend: Express/Mongoose app in `server/`. Deploy to Railway, Heroku, or container registry (Docker).

Prerequisites
- GitHub repo with this project pushed.
- Vercel account connected to GitHub.
- Railway (or host) account for backend, with `MONGODB_URI` and secrets.

Frontend — Vercel
1. Push your branch to GitHub (recommended branch name: `deploy/frontend-vercel`).

2. In Vercel:
   - Create new Project → Import Git Repository → select the repo.
   - Framework Preset: "Other" or "Vite" (Vercel often auto-detects).
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables (set under Project → Settings → Environment):
     - `VITE_API_BASE_URL` = `https://<YOUR_BACKEND_URL>/api` (production backend URL)
     - Any other runtime keys your app needs (e.g., analytics keys).
   - Deploy. Vercel will run the build and publish the `dist/` folder.

Notes:
- If you prefer, you can set a custom domain in Vercel and set up HTTPS automatically.
- To preview changes, create a PR in GitHub — Vercel creates Preview Deployments automatically.

Backend — Railway (or Docker)
Option A — Railway (recommended for quick deploy):
1. Push `server/` to GitHub in a separate repo or same monorepo (Railway supports monorepos but configure the root path).
2. In Railway, create a new Project → Deploy from GitHub.
3. Set the Service Root Directory to `server/` (if using monorepo).
4. Set Environment Variables:
   - `MONGODB_URI` — your MongoDB connection string
   - `JWT_SECRET` — production JWT secret
   - `PORT` — optional; Railway sets a port automatically
   - Any third-party keys you use
5. Start the deployment. Railway will run `npm install` and start the service based on `package.json` `start` script.

Option B — Docker (works on Railway, DigitalOcean, Docker Hub):
1. This repository contains `server/Dockerfile` (if you added it).
2. Build image:

   ```bash
   docker build -t my-backend:latest ./server
   ```

3. Run locally for smoke test:

   ```bash
   docker run -e MONGODB_URI="mongodb://..." -e JWT_SECRET="secret" -p 5000:5000 my-backend:latest
   ```

4. Push to a registry and deploy to your chosen host.

CI / GitHub Actions (optional)
- Add workflows to build frontend and backend, run tests, and deploy on push to `main` or on PR merges.

Post-deploy steps
- Set the `VITE_API_BASE_URL` on Vercel to the deployed backend URL (ensure `/api` path if backend uses it).
- Verify the frontend can talk to the backend by visiting the site and exercising login/sign-up and payment flow.

Troubleshooting
- Build fails: check Vercel build logs; ensure Node version compatibility (Vercel uses Node 18/20 by default).
- Backend errors: check Railway logs for missing env vars or DB connection errors.

If you want, I can:
- Create a Git branch and commit these changes locally.
- Create basic GitHub Actions workflows for build+deploy (requires repository access to complete automatic deploy).
- Attempt to connect to Vercel/Railway if you provide API tokens/permissions.

