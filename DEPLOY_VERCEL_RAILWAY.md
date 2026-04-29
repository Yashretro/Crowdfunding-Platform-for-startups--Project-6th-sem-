# 🚀 Deploy to Vercel + Railway - Complete Guide

Your Crowdfunding Platform is ready for deployment! Here's the step-by-step process.

## Prerequisites
- GitHub account (push your code)
- Vercel account (free at vercel.com)
- Railway account (free at railway.app)

---

## Step 1: Push Code to GitHub

```bash
cd "c:\Users\91811\Documents\Crowdfunding Platform for startups (Project 6th sem)"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add GitHub remote and push
git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway ⚙️

**Railroad typically takes 2-3 minutes.**

1. Go to **[railway.app](https://railway.app)**
2. Click **"New Project"** and select **"Deploy from GitHub repo"**
3. Authorize GitHub and select your repository
4. Railway auto-detects Node.js backend automatically
5. Wait for deployment to complete (status shows "Active")
6. **Copy your Railway URL:**
   - Click your project
   - Go to **Settings → Domains**
   - Copy the public URL (looks like: `https://kickscale-api-prod.up.railway.app`)

### ✅ Backend deployed!

---

## Step 3: Deploy Frontend to Vercel 🎨

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Add New Project"** → **"Import Git Repository"**
3. Select your GitHub repository
4. Vercel auto-detects Vite React setup
5. **Before clicking Deploy**, add environment variables:
   - Click **"Environment Variables"**
   - Add new variable:
     - **Name:** `VITE_API_BASE_URL`
     - **Value:** `https://YOUR-RAILWAY-URL.up.railway.app/api` (from Step 2)
     - Select: Production
6. Click **"Deploy"** and wait (takes 1-2 minutes)
7. **Copy your Vercel URL** (looks like: `https://kickscale.vercel.app`)

### ✅ Frontend deployed!

---

## Step 4: Test Live App

Once both deployments complete:

1. Open your **Vercel URL** in a new browser
2. Try these flows:
   - ✅ Sign up/Login
   - ✅ Browse projects
   - ✅ Create new campaign
   - ✅ Invest in a project
   - ✅ View transactions
   - ✅ Check dashboard

**Everything should work!**

---

## Environment Summary

### Local Development
- **Frontend:** `http://localhost:5173` (runs `npm run dev`)
- **Backend:** `http://localhost:5000` (runs `npm run server`)
- **.env.local will use:** `http://localhost:5000/api`

### Production (Deployed)
- **Frontend:** Your Vercel URL
- **Backend:** Your Railway URL
- **Connected via:** `VITE_API_BASE_URL` environment variable

---

## Troubleshooting

### Frontend won't connect to backend
- ✅ Check `VITE_API_BASE_URL` is set correctly in Vercel
- ✅ Rebuild Vercel deployment (redeploy)
- ✅ Check Railway backend is still "Active"

### Backend won't start on Railway
- ✅ Check Railway logs (click project → Logs tab)
- ✅ Ensure `server.js` runs with `npm run server`
- ✅ Check `package.json` has all dependencies

### Builds failing
- ✅ Run `npm install` locally
- ✅ Run `npm run build` to verify locally first
- ✅ Check build output for errors

---

## Quick Commands

```bash
# Local development (run in 2 terminals)
npm run dev      # Terminal 1: Frontend
npm run server   # Terminal 2: Backend

# Production build
npm run build

# Lint code
npm run lint
```

---

## Final URLs

📱 **Share these with your team:**
- Frontend: `https://YOUR-VERCEL-PROJECT.vercel.app`
- Backend API: `https://YOUR-RAILWAY-PROJECT.up.railway.app/api`

---

**Deployment complete! 🎉**

Your crowdfunding platform is now live on the internet!
