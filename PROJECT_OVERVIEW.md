# Project Overview — Deep Explanation

This document is written for team members owning *testing, debugging,* and *documentation*. It explains the system architecture, data flows, key files, failure modes, verification steps, and recommended tests and docs to maintain.

---

## 1. High-level summary

This is a full-stack crowdfunding platform with:
- Frontend: React + TypeScript, built with Vite, styled with Tailwind CSS. Social-style project pages, campaign creation, investments, and watchlist features.
- Backend: Node.js (ESM) + Express serving REST endpoints and Socket.IO for realtime events.
- Persistence: MongoDB via Mongoose models. A JSON file fallback (`server/data/store.json`) is used when Mongo is unavailable.
- Auth: JWT tokens for authentication; passwords hashed with bcrypt.
- Realtime: `sync:update` events broadcast for project/investment/payment lifecycle.

This repo contains both frontend and backend for local development and production build artifacts for Vercel.

---

## 2. Architecture & Data Flow

Flow overview:
1. User interacts with the React UI (frontend) which talks to the backend REST API (`/api/*`) using `axios`.
2. Backend handles requests in `server.js`, performing validation and persisting changes either to MongoDB via Mongoose models (`server/models/*.js`) or to the JSON fallback store when Mongo is disconnected.
3. After state-changing operations (create project, invest, post update), the backend emits Socket.IO events to connected clients so they can refresh views in realtime.
4. Frontend listens via a small `useRealtimeSync` hook which subscribes to `sync:update` and triggers local state refreshes.

Primary data entities (shapes):
- User: { id, firstName, lastName, email, passwordHash, userType ('founder'|'investor'), role ('admin'?) , watchlist: [projectId] }
- Project: { id, ownerId, title, description, goal, raised, image, category, daysLeft, founder, updates: [{date, content}], ... }
- Investment: { id, projectId, projectTitle, amount, createdAt, status }

Where data lives:
- Primary: MongoDB collections (`User`, `Project`, `Investment` via Mongoose).
- Fallback: `server/data/store.json` read/written via `readStore()` / `writeStore()` functions in `server.js`.

Realtime contract:
- Event name: `sync:update`.
- Payload fields: { resource: 'projects'|'investments'|'payments', projectId?: string, payload?: any }
- Frontend listens and decides which data to refetch based on resource and projectId.

---

## 3. Key files and what to inspect

- `server.js` — single-file backend (API + auth + socket). Critical areas:
  - `requireAuth` middleware: confirm tokens, sets `req.user`.
  - `readStore()` / `writeStore()`: DB-first, fallback-to-json logic.
  - Permission checks: ensure `ownerId` / `role` checks are applied before updates.
  - Realtime emits: after writes, check `io.emit('sync:update', {...})` calls.

- `server/models/` — Mongoose models: `User.js`, `Project.js`.

- `src/services/api.ts` — axios instance and typed service wrappers. Check base URL handling and interceptors.

- `src/hooks/useRealtimeSync.tsx` — Socket setup and subscription logic. Confirm reconnection logic and event filtering.

- `src/pages/*` — key UI flows: `ProjectDetail.tsx`, `Projects.tsx`, `Home.tsx`, `Dashboard.tsx`.

- `src/data/defaultProjects.ts` — seeded data used when backend is unavailable.

- `.env.example` / `SETUP.md` — environment & setup guidance.

---

## 4. Authentication and Security

- JWT: `JWT_SECRET` (in env) signs tokens. Tokens included in `Authorization: Bearer` headers.
- Passwords hashed with `bcryptjs` on signup.
- Protected routes use `requireAuth`, `requireRole('admin')`, and/or owner checks against `project.ownerId`.
- CORS: `CORS_ORIGIN` must allow the frontend origin; Socket origin must match `VITE_SOCKET_URL`.
- Secrets: **Do not** commit real secrets. Use provider environment variable settings (Vercel/Railway).

Common security checks (tester):
- Ensure invalid or expired tokens are rejected with 401.
- Ensure non-owners cannot edit projects (403). Test both direct API calls and UI attempts.
- Ensure password fields are never returned by APIs.

---

## 5. Failure modes and diagnostics

1. MongoDB unreachable
   - Behavior: `readStore()` / `writeStore()` should use JSON fallback. Check logs for fallback usage.
   - Test: Stop Mongo, perform writes, restart Mongo, ensure data reconciles or at least no crash.

2. Token mismatch between environments
   - Symptom: 401 on protected routes. Check `JWT_SECRET` values.

3. Realtime disconnect or CORS issues
   - Symptom: No live updates. Inspect browser console for Socket.IO errors and server CORS settings.

4. TypeScript/build errors
   - Symptom: `npm run build` fails. Inspect `tsc -b` output and fix reported TS errors.

Diagnostic tips:
- Backend: run `npm run server` and watch console; add `console.error` traces around failing branches.
- Frontend: run `npm run dev`, use browser DevTools Network/Console, and verify `axios` calls and socket logs.
- Reproduce issues with curl/postman to isolate UI vs API problems.

---

## 6. Testing checklist (recommended smoke & deeper tests)

Smoke tests (quick):
- [ ] Signup (investor & founder) and login successfully.
- [ ] As founder, create a project — confirm `ownerId` set and project returns via `GET /api/projects/:id`.
- [ ] As investor, invest and confirm investment saved and project's `raised` incremented.
- [ ] As owner, post an update — confirm `GET /api/projects/:id/updates` includes it.
- [ ] Toggle watchlist (save/unsave) and confirm `GET /api/users/watchlist`.
- [ ] Verify `sync:update` events are emitted for creates/updates/investments (open two clients).
- [ ] Build production: `npm run build` and `npm run preview -- --port 5000` — confirm app loads.

Deeper tests:
- Permission boundary tests: ensure non-admins cannot use admin endpoints.
- Fuzz invalid payloads to endpoints; verify validation errors and status codes are correct.
- Simulate Mongo failure and verify fallback read/write and eventual consistency.

Suggested `TESTING.md` entries (I can generate this file if desired):
- Step-by-step reproduction instructions for each smoke test with example curl commands.

---

## 7. API Reference (selected endpoints)

- `POST /api/auth/signup` — { firstName, lastName, email, password, userType }
  - Response: { token, user }

- `POST /api/auth/login` — { email, password }
  - Response: { token, user }

- `GET /api/projects` — list projects (public)
- `GET /api/projects/:id` — project details
- `POST /api/projects` — auth required (founder); creates project with ownerId set from token
- `PUT /api/projects/:id` — auth required; owner or admin only
- `POST /api/projects/:id/updates` — auth required; owner/admin post an update

- `GET /api/users/watchlist` — returns saved projects for current user
- `POST /api/users/watchlist/:projectId` — toggle save/unsave

- `POST /api/investments` — create investment (projectId, amount, status)

- `POST /api/payments/verify` — internal simulation for payments

For each endpoint, testers should verify: correct status codes, JSON schema, auth requirements, and side-effects (DB writes, emits).

---

## 8. Deployment notes

- Frontend is suited for Vercel (static build output `dist/`). Ensure `npm run build` runs in CI and `VITE_API_BASE_URL` is set in environment variables.
- Backend can be deployed on Railway/Heroku/Docker. Provide `MONGODB_URI` and `JWT_SECRET` in host env vars.
- If hosting backend separately, update `VITE_API_BASE_URL` & `VITE_SOCKET_URL` to point to backend domain.

Files to consider adding for production:
- `vercel.json` to control builds and redirects
- `Dockerfile` + `docker-compose.yml` for containerized deployments
- `Procfile` for Heroku/PM2 setups

---

## 9. Documentation tasks to assign

For you (tester/debugger/doc owner), recommended deliverables:
1. `TESTING.md` — smoke test list with curl/Postman examples and expected responses.
2. `API.md` — concise API reference including request/response examples and authorization notes.
3. `DEBUGGING.md` — common failure patterns, how to attach logs, and reproduction steps.
4. Keep `SETUP.md` and `.env.example` updated whenever envs or scripts change.

I can generate any of these files (`TESTING.md`, `API.md`, `DEBUGGING.md`) now — which would you like first?

---

## 10. Expanded developer details

Below are precise technical details useful for testers, debuggers, and documentation owners who will be maintaining or extending the system.

### Code layout (where to find things)
- `server.js` — backend API entry (Express routes, middleware, socket setup, JSON fallback). Primary file to inspect for permission checks and emit locations.
- `server/models/` — Mongoose model definitions (`User.js`, `Project.js`, etc.). Database schema and validation live here.
- `server/data/store.json` — fallback JSON store used when Mongo is unavailable.
- `src/services/api.ts` — centralized HTTP client (`axios`) and API wrappers used across UI.
- `src/hooks/useRealtimeSync.tsx` — Socket.IO client management and subscription helper.
- `src/pages/*` — page-level components implementing flows (project create, invest, project detail, dashboard).
- `src/components/*` — shared UI components (payment modal, cards, forms).

### Data model (fields and notes)
- `User` (Mongoose):
   - `_id` (ObjectId)
   - `firstName`, `lastName`, `email`
   - `passwordHash` (never returned by API)
   - `userType` — `'founder' | 'investor'`
   - `role` — optional admin role
   - `watchlist` — `string[]` of `project.id`

- `Project`:
   - `_id` (ObjectId)
   - `ownerId` — user id of founder
   - `title`, `description`, `category`, `image`
   - `goal`, `raised`, `daysLeft`
   - `founder` — short profile blob { name, bio }
   - `updates` — Array<{ date, content }>

- `Investment`:
   - `_id`, `projectId`, `projectTitle`, `amount`, `createdAt`, `status`

### Example API requests & responses

1) Signup (investor/founder)

Request:
```
POST /api/auth/signup
{
   "firstName": "Asha",
   "lastName": "K",
   "email": "asha@example.com",
   "password": "secret123",
   "userType": "founder"
}
```

Response (201):
```
{
   "token": "<jwt>",
   "user": { "id": "...", "email": "asha@example.com", "userType": "founder" }
}
```

2) Create project (auth required)

Request:
```
POST /api/projects
Authorization: Bearer <token>
{
   "title": "Solar microgrid",
   "description": "...",
   "goal": 500000,
   "category": "Energy"
}
```

Response (201): created project with `ownerId` set from token subject.

3) Post update (owner or admin)

Request:
```
POST /api/projects/:id/updates
Authorization: Bearer <token>
{ "content": "Reached 50% of target" }
```

4) Toggle watchlist

Request:
```
POST /api/users/watchlist/:projectId
Authorization: Bearer <token>
```

Response: returns updated `user` or `{ saved: true/false }` depending on implementation.

5) Create investment (payment flow simulated)

Request:
```
POST /api/investments
Authorization: Bearer <token>
{ "projectId": "...", "amount": 1500 }
```

Response: investment record created and a `sync:update` event emitted with resource `investments` and `projectId`.

### Realtime event examples
- Emitted event: channel `sync:update`
- Example payload:
```
{
   "resource": "investments",
   "projectId": "6412...",
   "payload": { "investmentId": "...", "amount": 1500 }
}
```

Clients should react by refetching the relevant resources (project details, recent investments). The `useRealtimeSync` hook already performs filtering by `resource` and `projectId`.

### Error handling and status codes
- `400` — validation errors (missing fields, malformed payloads).
- `401` — authentication failure (missing/invalid JWT).
- `403` — permission denied (owner/admin checks).
- `404` — resource not found (project/investment not found).
- `500` — unexpected server error — logs required for diagnosis.

When a `5xx` occurs, server logs should include a stack trace and the request path + body (avoid logging secrets).

### Logging & monitoring
- Add structured logs (JSON) for critical operations: auth failures, DB errors, payment verification, fallback-to-file events.
- Suggested log fields: timestamp, level, service, route, userId (if available), correlationId, error.
- Add a minimal correlation ID middleware to `server.js` to help trace requests across logs.

### Debugging checklist (quick start)
1. Reproduce with minimal steps (curl/Postman) to isolate frontend from backend.
2. Inspect backend console for stack traces when the request runs.
3. Check Mongo connectivity: `mongoose.connection.readyState` should be 1. If not, inspect `MONGODB_URI` and network reachability.
4. Check `.env` values: `JWT_SECRET`, `VITE_API_BASE_URL`, `VITE_SOCKET_URL`.
5. Confirm Socket.IO versions match between `socket.io` and `socket.io-client`.
6. If type errors cause build failure, run `npx tsc -b` locally and fix files reported.

Useful debug commands:
```bash
# Type-check only
npx tsc -b

# Run backend
npm run server

# Start frontend dev server
npm run dev

# Run prod build and preview
npm run build
npm run preview -- --port 5000
```

### CI/CD & deployment recommendations
- Vercel: frontend static site build of the `dist/` folder. Configure `Build Command` to `npm run build` and `Output Directory` to `dist` (Vite default).
- Backend: deploy to Railway, Render, Heroku, or Docker host. Provide `MONGODB_URI` and `JWT_SECRET` in provider env settings.
- CI: add a GitHub Action to run `npm ci`, `npx tsc -b --noEmit`, and `npm run build` on push to `main`. Optionally run lint.

Example GitHub Action snippet (CI):
```yaml
name: CI
on: [push, pull_request]
jobs:
   build:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
            with: node-version: '20'
         - run: npm ci
         - run: npx tsc -b --noEmit
         - run: npm run build
```

### Docker (optional quick image)
Add a `Dockerfile` to containerize the backend or frontend app. Example (simple node server):
```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
```

### Security checklist
- Rotate `JWT_SECRET` when compromised and revoke sessions.
- Enforce strong password rules on the client and server.
- Rate-limit auth endpoints to prevent brute force.
- Ensure CORS origins are as specific as possible.
- Never log secrets (passwords, full JWTs).

### Data migration and backups
- Back up MongoDB regularly (provider snapshots).
- If using the JSON fallback, create a reconciliation plan to migrate data back to Mongo when it returns.

### Documentation tasks (next steps)
- `TESTING.md` — implement smoke tests with curl and expected responses.
- `API.md` — generate full API reference with example payloads and response schemas.
- `DEBUGGING.md` — step-by-step troubleshooting guides and common fixes.

---

If you want, I can now create `TESTING.md` and `API.md` automatically with the curl commands and examples used above. Tell me which file to generate first.

---

## Overall Summary

This section is an executive-style summary combining front-end, back-end, and the overall system behavior. It's intended for quick orientation before diving into the technical sections above.

- Frontend (What it is and does)
   - Stack: React + TypeScript, Vite build system, Tailwind CSS styles.
   - Responsibilities: render lists and detail pages for projects, allow founders to create campaigns, let investors make investments, manage user profiles and watchlist, and show realtime updates.
   - Key files: `src/main.tsx` (app entry), `src/pages/*` (page components), `src/services/api.ts` (HTTP client), `src/hooks/useRealtimeSync.tsx` (socket helper), `src/components/*` (UI primitives).
   - Build & runtime: built with `npm run build` → `dist/`, served by Vercel or static server; dev flow uses `npm run dev`.

- Backend (What it is and does)
   - Stack: Node.js (ESM) + Express REST API, Socket.IO for realtime, Mongoose for MongoDB modeling.
   - Responsibilities: user authentication (signup/login), project CRUD, investment recording, watchlist management, posting project updates, emitting realtime events, and providing fallback JSON store when Mongo is unavailable.
   - Key files: `server.js` (entry + routes + socket), `server/models/*.js` (schema), `server/data/store.json` (fallback store).
   - Run & deploy: run with `npm run server` locally; for production host on Railway/Render/Heroku or containerize with Docker.

- Integration points & environment
   - Frontend ↔ Backend HTTP: `VITE_API_BASE_URL` in frontend should point to backend API root (`/api/*`).
   - Frontend ↔ Backend realtime: `VITE_SOCKET_URL` must match the socket server origin and CORS policy.
   - Data store: primary is MongoDB (`MONGODB_URI`); fallback to local JSON used for ease of testing and resilience.

- Operational notes
   - Keep `JWT_SECRET` consistent across environments to avoid invalid token issues.
   - Set `CORS_ORIGIN` tightly to your frontend domain in production.
   - Use provider environment settings (Vercel/Railway) to inject secrets; never commit secrets to Git.

- Who should own what
   - Tester / Debugger: own `TESTING.md` and `DEBUGGING.md`, run smoke tests, report/regress bugs, verify permission boundaries, and verify fallback behavior.
   - Documentation: maintain `SETUP.md`, `.env.example`, `API.md`, and `PROJECT_OVERVIEW.md` so new team members can onboard quickly.
   - DevOps: manage Vercel/Railway deployment, ensure env vars are set, configure CI to run `npx tsc -b --noEmit` and `npm run build` on pushes.

---

Files added in this update:
- `SETUP.md` — local run & deploy instructions.
- `.env.example` — environment placeholders.
- `TESTING.md` — smoke test checklist and curl examples.
- `PROJECT_OVERVIEW.md` — this file with extended technical details.

If you want any of the new docs committed, pushed, or reformatted, I can do that next.