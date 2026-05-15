# Deploy Backend to Railway - Quick Start

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → "Continue with GitHub"
3. Authorize GitHub access

## Step 2: Create New Project
1. Dashboard → "New Project" button
2. Choose "Deploy from GitHub repo"
3. Select: `Yashretro/Crowdfunding-Platform-for-startups--Project-6th-sem-`
4. Click "Deploy"
5. **Wait** for build to complete (3-5 minutes)

## Step 3: Set Environment Variables
After deployment starts:

1. In Railway dashboard, click your service
2. Go to **"Variables"** tab
3. Add these variables (click "+" to add each):

```
MONGODB_URI = mongodb+srv://YashrajSingh:JCSlSQt48qlW0p8V@crowdfunding.90p840x.mongodb.net/kickscale?retryWrites=true&w=majority

JWT_SECRET = YourVeryLongRandomString123456789ABCDEFGHIJKLMNOP
```

(For JWT_SECRET, generate any 32+ character random string)

4. Click "Save" or "Redeploy"
5. Railway will restart your service with the new env vars

## Step 4: Check It's Running
1. Go to "Deployments" tab
2. Look for logs containing:
   ```
   Seeded MongoDB from store.json
   Kickscale backend running at https://... (MongoDB enabled)
   ```

3. Your backend URL will be shown (something like): `https://kickscale-prod.railway.app`

## Step 5: Test It Works

**Test health endpoint:**
```bash
curl https://your-railway-url.railway.app/api/health
```

**Test admin login (PowerShell):**
```powershell
$url = "https://your-railway-url.railway.app/api/auth/login"
$body = @{email="admin@example.com"; password="Admin@123"} | ConvertTo-Json
$result = Invoke-RestMethod -Uri $url -Method POST -ContentType "application/json" -Body $body
$result | ConvertTo-Json
```

Should return admin token and user object.

---

## Your MongoDB URI (Copy-Paste Ready)
```
mongodb+srv://YashrajSingh:JCSlSQt48qlW0p8V@crowdfunding.90p840x.mongodb.net/kickscale?retryWrites=true&w=majority
```

## Generated JWT_SECRET Example
```
aB9cD2eF5gH8iJ1kL4mN7oPqRsT0uVwXyZ3aBcDeFgHiJkLmNoPqRsT
```
(Replace with your own random string if you want)

---

## Next: Update Frontend API URL

After Railway shows your backend URL:

1. In your project, edit `src/services/api.ts`
2. Change the fallback URL:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-railway-url.railway.app/api';
   ```
3. Push to GitHub
4. Deploy frontend to Vercel (similar process)

Done! 🚀
