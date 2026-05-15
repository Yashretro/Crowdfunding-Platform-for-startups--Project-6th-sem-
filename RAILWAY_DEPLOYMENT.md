# Railway Deployment Guide

## Your MongoDB Connection String

```
mongodb+srv://YashrajSingh:JCSlSQt48qlW0p8V@crowdfunding.90p840x.mongodb.net/kickscale?retryWrites=true&w=majority
```

⚠️ **Security Note:** This password is sensitive. After deployment, consider:
1. Rotating the password periodically
2. Restricting Atlas network access to Railway IPs only
3. Using a strong random string for `JWT_SECRET` in Railway

---

## Deployment Steps (Railway Web UI)

### Step 1: Create a Railway Account & Project
1. Go to https://railway.app
2. Sign in with GitHub (recommended)
3. Create a new project

### Step 2: Deploy from GitHub
1. Click "Deploy from GitHub repo"
2. Select your repo: `Crowdfunding-Platform-for-startups--Project-6th-sem-`
3. Choose branch: `main`
4. Railway will auto-detect your Node.js app
5. Click "Deploy" and wait for build to complete (3-5 minutes)

### Step 3: Set Environment Variables
After deployment starts:
1. Go to your Railway project → "Variables" tab
2. Add the following:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://YashrajSingh:JCSlSQt48qlW0p8V@crowdfunding.90p840x.mongodb.net/kickscale?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-very-long-random-string-min-32-chars-like-abc123XYZ789def456ghi789jkl` |

3. Click "Deploy" or "Redeploy" to apply changes

### Step 4: Verify Deployment
1. Go to "Deployments" → Latest build
2. Check logs for:
   - `Seeded MongoDB from store.json` (first run only)
   - `Kickscale backend running at https://your-railway-url.railway.app (MongoDB enabled)`

### Step 5: Test Endpoints
Replace `your-railway-url` with your actual Railway domain.

**Health check:**
```bash
curl https://your-railway-url.railway.app/api/health
```

**Admin login (PowerShell):**
```powershell
$uri = "https://your-railway-url.railway.app/api/auth/login"
$body = @{email="admin@example.com"; password="Admin@123"} | ConvertTo-Json
Invoke-RestMethod -Uri $uri -Method POST -ContentType "application/json" -Body $body
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "admin-1",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "userType": "admin",
    "role": "admin"
  }
}
```

---

## Deployment Steps (Railway CLI)

If you prefer command line:

```bash
npm install -g @railway/cli
railway login
railway init                  # Create new project or link to existing
railway variables set MONGODB_URI "mongodb+srv://YashrajSingh:JCSlSQt48qlW0p8V@crowdfunding.90p840x.mongodb.net/kickscale?retryWrites=true&w=majority"
railway variables set JWT_SECRET "your-long-random-secret-min-32-chars"
railway up
```

---

## Next: Deploy Frontend to Vercel

After backend is deployed on Railway:

1. Update `src/services/api.ts` to use your Railway URL:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-railway-url.railway.app/api';
   ```

2. Deploy frontend to Vercel:
   - Push code to GitHub
   - Go to https://vercel.com → Import Project → Select repo
   - Vercel auto-detects Vite project
   - Set env var `VITE_API_BASE_URL` to your Railway backend URL
   - Deploy!

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "MongoDB connection failed" | Check MONGODB_URI is set in Railway Variables. Verify Atlas network whitelist includes Railway IPs. |
| "Cannot seed from store.json" | First deployment seeds automatically. If it fails, check server logs in Railway. |
| Admin login returns 401 | Ensure MONGODB_URI is correct and DB was seeded. Check Railway logs. |
| Slow response times | Check MongoDB Atlas connection limits. Free tier may need optimization. |

---

## Your Quick Copy-Paste Commands

**If using Railway CLI:**
```bash
railway variables set MONGODB_URI "mongodb+srv://YashrajSingh:JCSlSQt48qlW0p8V@crowdfunding.90p840x.mongodb.net/kickscale?retryWrites=true&w=majority"
railway variables set JWT_SECRET "INSERT_YOUR_32_CHAR_RANDOM_STRING_HERE"
railway up
```

Done! Your backend is production-ready on Railway + MongoDB Atlas. 🚀
