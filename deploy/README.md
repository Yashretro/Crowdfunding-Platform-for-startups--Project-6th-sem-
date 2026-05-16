# Deploy guide (server)

This file documents a minimal, repeatable server deployment for the app.

1) Server prerequisites (Ubuntu example)

```bash
# Update OS
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 and build tools
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs build-essential git nginx

# (optional) PM2
sudo npm i -g pm2

# (optional) Certbot for TLS
sudo apt install -y certbot python3-certbot-nginx
```

2) Copy project to server

Place the project at `/var/www/crowdfunding` (or a path you choose). Clone from Git:

```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone <your-repo-url> crowdfunding
cd crowdfunding
sudo chown -R $USER:$USER .
```

3) Environment

Create `.env` in project root from `.env.example` and set real values. Ensure `VITE_API_BASE_URL` points to `https://your-domain.com/api` and `VITE_SOCKET_URL` to `https://your-domain.com`.

4) Install & build

```bash
cd /var/www/crowdfunding
npm ci
npm run build
```

5a) Run with PM2 (recommended)

```bash
pm2 startOrRestart ecosystem.config.js --env production
pm2 save
pm2 startup
```

5b) Or run with systemd (example)

Copy `deploy/crowdfunding.service.example` to `/etc/systemd/system/crowdfunding.service`, edit `WorkingDirectory` and `User`, then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now crowdfunding.service
sudo journalctl -u crowdfunding -f
```

6) Nginx

Copy `deploy/nginx.conf.example` to `/etc/nginx/sites-available/crowdfunding`, replace `your-domain.com` and `root` path, then:

```bash
sudo ln -s /etc/nginx/sites-available/crowdfunding /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

7) TLS (Let's Encrypt)

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

8) Firewall / DNS

Open ports 80/443 and point your domain A record to the server IP.

9) Automatic deployment (simple)

You can run the provided `deploy.sh` on the server to pull latest, install, build and restart PM2:

```bash
cd /var/www/crowdfunding
./deploy.sh
```

For GitHub Actions SSH deployment, add an SSH key as a GitHub secret and I can add a workflow to auto-deploy on push.
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

