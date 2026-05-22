# Setup and Run Guide

This document lists the required Node/npm programs, how to install them, and what each package is used for in this project.

## Prerequisites
- Node.js (recommended >= 18). Check with:

```bash
node -v
npm -v
```

- Git (for cloning and pushing to Vercel/GitHub).

## Install dependencies
From the project root, run:

```bash
npm install
```

This will install both `dependencies` and `devDependencies` declared in `package.json`.

## Important files
- `server.js` — backend API server (Express + Socket.IO). See [server.js](server.js).
- `.env.example` — example environment variables. Copy to `.env` and fill required values before running local backend. See [.env.example](.env.example).
- `src/` — frontend source (Vite + React).
- `dist/` — generated production build after `npm run build`.
- `SETUP.md` — (this file) setup instructions.

## Environment variables (required)
Set these in a `.env` file or in your hosting provider (Vercel/Railway):

- `MONGODB_URI` — MongoDB connection string.
- `JWT_SECRET` — secret for signing JSON Web Tokens.
- `CORS_ORIGIN` — frontend origin allowed by backend (e.g. `https://your-app.vercel.app`).
- `VITE_API_BASE_URL` — API base URL used by the frontend (e.g. `https://api.example.com/api`).
- `VITE_SOCKET_URL` — Socket.IO server URL (e.g. `https://api.example.com`).
- `PORT` — optional backend port (default: 4000 in local `.env.example`).

## NPM scripts
Listed in `package.json` and how to use them:

- `npm run dev`
  - Starts the Vite development server for the frontend (hot reload).
  - Use this while actively developing UI: open `http://localhost:5173` (Vite chooses port unless configured).

- `npm run server`
  - Starts the Node/Express backend by running `node server.js`.
  - Run this in a separate terminal while developing the frontend locally.

- `npm run build`
  - Runs `tsc -b` (TypeScript build) and `vite build` to produce the production frontend in `dist/`.
  - Use prior to deploying to Vercel if needed or to locally preview the production bundle.

- `npm run preview`
  - Runs `vite preview` to serve the built `dist/` locally (use `--port` to change port).
  - Example: `npm run preview -- --port 5000` serves `http://localhost:5000/`.

- `npm run lint`
  - Runs ESLint across the repository.

## Dependencies (what each does in this project)
These come from `package.json` under `dependencies`.

- `autoprefixer` / `postcss` / `tailwindcss`
  - CSS tooling: TailwindCSS is used for styling; PostCSS and Autoprefixer process styles during build.

- `axios`
  - HTTP client used by the frontend (`src/services/api.ts`) to call backend APIs.

- `bcryptjs`
  - Password hashing in the backend for user auth.

- `cors`
  - Middleware to allow cross-origin requests to the backend.

- `express`
  - Backend web framework (`server.js`) that implements API routes.

- `jsonwebtoken`
  - JWT creation and verification for authentication.

- `mongodb` and `mongoose`
  - Database drivers and ODM for connecting to MongoDB and modeling `User`/`Project` schemas.

- `react`, `react-dom`, `react-router-dom`
  - Frontend UI library and routing.

- `socket.io` / `socket.io-client`
  - Real-time events between frontend and backend (realtime sync for projects/investments).

## DevDependencies (what each does)
These are used for development, type checking, dev server, and linting:

- `vite` / `@vitejs/plugin-react`
  - Dev server and build tool for the frontend React app.

- `typescript`, `@types/*`
  - TypeScript and type definitions for Node/React.

- `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
  - Linting and code quality for JS/TS and React hooks.

- `globals`, `typescript-eslint`
  - Helper tooling for ESLint + TypeScript.

## Running locally (recommended workflow)
1. Copy `.env.example` to `.env` and fill values.

```bash
cp .env.example .env
# then edit .env and paste your values
```

2. Install dependencies:

```bash
npm install
```

3. In terminal A start the backend:

```bash
npm run server
```

4. In terminal B start the frontend dev server:

```bash
npm run dev
```

5. Open the frontend URL shown by Vite (usually `http://localhost:5173`).

## Building and previewing production bundle locally
```bash
npm run build
npm run preview -- --port 5000
# open http://localhost:5000/
```

## Deploying to Vercel (quick)
1. Push to GitHub (already set up in this repo). Vercel will automatically build the frontend.
2. In the Vercel dashboard, add the environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
3. If the backend is a separate server, deploy it (Railway, Heroku, or Docker) and set `VITE_API_BASE_URL` to the backend URL.

Optional: If you'd like to deploy backend alongside frontend, consider containers (see `Dockerfile`) or a server platform (Railway). Keep secrets out of the repo — use provider env var settings.

## Troubleshooting tips
- If `npm run build` fails, check TypeScript errors and fix files reported by `tsc`.
- If realtime isn't working, ensure `VITE_SOCKET_URL` matches the backend socket origin and CORS allows the frontend origin.
- If auth fails, confirm `JWT_SECRET` is set identically on server and any environment used for token verification.

---

