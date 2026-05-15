# MongoDB Atlas + Railway Deployment Guide

## 1. Create MongoDB Atlas Cluster

1. Go to https://cloud.mongodb.com
2. Sign in / Create account
3. Click "Create" → "Build a Cluster" → Select **Free Tier** (shared)
4. Choose a region near you
5. Cluster name: `kickscale` (or your choice)
6. Click "Create Deployment"
7. Wait 2-5 minutes for cluster to be ready

## 2. Create Database User

1. In Atlas Dashboard → Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `kickscale_admin` (or your choice)
5. Password: Generate a strong password (save it!)
6. Built-in Role: Select **readWriteAnyDatabase** (for demo/test)
7. Click "Add User"

## 3. Network Access (IP Whitelist)

1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. For testing/demo: Enter `0.0.0.0/0` (allows all — NOT for production)
4. For production: Add your static IP + Railway IPs (ask support)
5. Click "Confirm"

## 4. Get Connection String

1. Go to "Clusters" → Click "Connect"
2. Choose "Connect your application"
3. Driver: **Node.js**, Version: **4.x+**
4. Copy the connection string (looks like below)

```
mongodb+srv://kickscale_admin:<password>@cluster0.abcd1.mongodb.net/?retryWrites=true&w=majority
```

**Important:** Replace `<password>` with your actual password and add the database name:

```
mongodb+srv://kickscale_admin:MySecurePassword123@cluster0.abcd1.mongodb.net/kickscale?retryWrites=true&w=majority
```

## 5. Test Locally

Save your URI in `.env.mongodb` (see template file), then test:

```powershell
$env:MONGODB_URI="mongodb+srv://kickscale_admin:YourPassword@cluster0.abcd1.mongodb.net/kickscale?retryWrites=true&w=majority"
npm run server
```

Expected output:
```
Seeded MongoDB from store.json
Kickscale backend running at http://localhost:5000 (MongoDB enabled)
```

Test endpoints:
```powershell
curl http://localhost:5000/api/health
```

Admin login (should work with seeded credentials):
```powershell
$resp = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body (ConvertTo-Json @{email='admin@example.com'; password='Admin@123'})
$resp
```

## 6. Deploy to Railway

### Option A: Railway Web UI (Easiest)

1. Go to https://railway.app
2. Sign in with GitHub
3. Create new project → Deploy from GitHub repo (choose your Crowdfunding repo)
4. Wait for build/deployment
5. After deployment starts, go to Project Settings → Variables
6. Add new variable:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://kickscale_admin:YourPassword@cluster0.abcd1.mongodb.net/kickscale?retryWrites=true&w=majority`
7. Redeploy (Railway will auto-restart service with the new env var)
8. Check logs → should show "Seeded MongoDB from store.json" and "MongoDB enabled"

### Option B: Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init                    # Create new project or link existing
railway variables set MONGODB_URI "mongodb+srv://kickscale_admin:YourPassword@cluster0.abcd1.mongodb.net/kickscale?retryWrites=true&w=majority"
railway up
```

## 7. Security Checklist (Before Production)

- [ ] Set a strong `JWT_SECRET` env var in Railway (random 32+ char string)
- [ ] Restrict Atlas IP whitelist (remove `0.0.0.0/0`, add only needed IPs)
- [ ] Rotate the seeded admin password after first login
- [ ] Use HTTPS (Railway provides this by default)
- [ ] Don't commit `.env.mongodb` or any real credentials to Git

## 8. Verify Remote Deployment

After Railway deploys:

1. Test health endpoint (check Railway logs for your deployed URL):
   ```
   curl https://your-railway-url.railway.app/api/health
   ```

2. Test admin login:
   ```powershell
   Invoke-RestMethod -Uri 'https://your-railway-url.railway.app/api/auth/login' -Method POST -ContentType 'application/json' -Body (ConvertTo-Json @{email='admin@example.com'; password='Admin@123'})
   ```

3. Check logs in Railway dashboard for "MongoDB enabled" confirmation

Done! Your backend is now using a production-grade MongoDB database.
