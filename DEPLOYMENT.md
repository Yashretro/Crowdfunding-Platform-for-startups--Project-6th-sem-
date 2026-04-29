# Crowdfunding Platform - Deployment Guide

## Deploy to Vercel + Railway

### Step 1: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "Create New Project" → "Deploy from GitHub repo"
4. Select this repository
5. Railway will auto-detect the Node.js backend
6. Set these environment variables in Railway dashboard:
   - No variables needed (JSON persistence works automatically)
7. Click "Deploy" and wait for the green "Active" status
8. Copy your Railway API URL (format: `https://your-app-name.up.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project" and select your GitHub repo
3. Vercel will auto-detect Vite React setup
4. In Environment Variables, add:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://your-railway-app.up.railway.app/api` (from Step 1)
5. Click "Deploy" and wait for the production URL

### Step 3: Update Frontend with Backend URL

Once Railway deployment is complete:
1. Copy your Railway backend URL
2. Go to Vercel → Project Settings → Environment Variables
3. Update `VITE_API_BASE_URL` with your Railway URL
4. Redeploy the frontend

### Live URLs
- **Frontend:** Your Vercel URL (e.g., `https://kickscale.vercel.app`)
- **Backend API:** Your Railway URL (e.g., `https://kickscale-api.up.railway.app/api`)

## Local Development

Run both simultaneously:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run server
```

Both will use `.env.local` settings (http://localhost:5000/api for frontend).
