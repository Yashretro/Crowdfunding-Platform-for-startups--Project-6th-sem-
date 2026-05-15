# Rotate MongoDB Atlas credentials (safe procedure)

Follow these steps to rotate the exposed Atlas DB user and update Railway safely.

1. Create a new Atlas DB user (do NOT delete the old one yet)
   - Open MongoDB Atlas > Database Access > Add New Database User
   - Use a strong random password (store it in a password manager)
   - Grant the same roles as the current user (e.g., readWrite on the DB)

2. Build a new non-SRV connection string
   - In Atlas, go to Clusters > Connect > Connect your application
   - Choose a Standard (non-SRV) connection string if your environment had SRV issues
   - Replace `<username>` and `<password>` with the new user's credentials

3. Update Railway environment variable
   - Using the Railway CLI (or web UI) update `MONGODB_URI` for the `production` environment:

```powershell
railway variables set "MONGODB_URI=your_new_connection_string" --project <PROJECT_ID> --environment production
```

4. Rotate `JWT_SECRET` (optional but recommended if exposed)

```powershell
railway variables set "JWT_SECRET=$(openssl rand -hex 32)" --project <PROJECT_ID> --environment production
```

5. Redeploy and verify
   - Redeploy the service (web UI or `railway up --project <PROJECT_ID> --environment production`)
   - Tail logs: `railway logs --project <PROJECT_ID> --environment production`
   - Verify endpoints: `/api/projects`, `/api/auth/login` (use admin credentials)

6. Revoke old credentials
   - Once everything is confirmed working, delete the old Atlas DB user from Atlas

7. Remove any exposed secrets from commits and rotate again if they were committed

If you want, provide your Railway `PROJECT_ID` and I can prepare the exact `railway` commands for you.
