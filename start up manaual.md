# Start Up Manaual

This manual explains what the app does, how to run it locally, how the backend and frontend connect, and how to deploy it safely.

## Project Overview

Kickscale is a crowdfunding platform for startups. It includes:
- Public project browsing
- Signup and login
- Investor dashboard
- Founder dashboard
- Campaign creation
- Investments and payment flow
- Realtime updates through Socket.IO
- Deployment to Vercel and Railway

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB on Railway
- Realtime: Socket.IO
- Authentication: JWT

## Folder Overview

- `src/` - frontend source code
- `server.js` - backend entry point
- `server/` - MongoDB models and database helpers
- `deploy/` - deployment docs and server config examples
- `package.json` - scripts and dependencies

## What Runs Where

- Vercel runs the frontend
- Railway runs the backend
- MongoDB stores users, projects, and investments
- The frontend talks to the backend using the Railway public URL

## Required Environment Variables

### Railway backend

Set these in Railway:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (usually `5000`)
- `CORS_ORIGIN` (your Vercel domain)

### Vercel frontend

Set these in Vercel:
- `VITE_API_BASE_URL` = `https://<railway-backend>/api`
- `VITE_SOCKET_URL` = `https://<railway-backend>`
- `VITE_BASE` = `/` if hosted at the root

## How to Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Run the frontend in dev mode

```bash
npm run dev
```

Open the app in the browser at the local Vite URL shown in the terminal.

### 3. Run the backend locally

```bash
npm run server
```

The backend will run on `http://localhost:5000`.

### 4. Build for production

```bash
npm run build
```

### 5. Preview the built frontend

```bash
npm run preview
```

## How the App Works

### Signup and Login

- Users create real accounts from the signup page
- Passwords are hashed in the backend
- Login returns a JWT token
- The token is stored in localStorage by the frontend

### Database Storage

- When MongoDB is connected, data is stored in MongoDB
- If Mongo is unavailable, the app can still fall back to the JSON file for safety
- Users, projects, and investments are persisted by the backend

### Realtime Sync

- The backend emits Socket.IO events when projects or investments change
- The frontend listens for those events and refreshes the relevant data
- This keeps the UI updated without manual refresh

## Deployment

### Frontend on Vercel

- Connect the GitHub repo
- Set the Vercel env vars
- Vercel builds the app with `npm run build`
- The output folder is `dist`

### Backend on Railway

- Connect the same repo or backend service
- Set `MONGODB_URI`, `JWT_SECRET`, and `CORS_ORIGIN`
- Railway starts the app using `server.js`

## Useful Commands

```bash
npm install
npm run dev
npm run server
npm run build
npm run preview
```

## Troubleshooting

### Blank page on Vercel

- Check that the Vercel build output directory is `dist`
- Make sure the frontend env vars are set
- Check browser console for errors

### Backend not connecting to Mongo

- Verify `MONGODB_URI` is correct
- Make sure MongoDB network access allows Railway
- Check Railway logs for connection errors

### Login not working

- Make sure the account was created with the signup form
- Check that the backend is reachable from the frontend
- Confirm the JWT secret is set on Railway

### Realtime not updating

- Check `VITE_SOCKET_URL`
- Check `CORS_ORIGIN`
- Confirm the backend is running and reachable publicly

## Recommended Final Setup

- Keep MongoDB as the main storage on Railway
- Keep the JSON file as a fallback only if you want extra safety
- Push code changes to GitHub before redeploying
- Use Railway and Vercel auto-deploy from the main branch


