# TESTING.md — Smoke & Integration Tests

This file contains actionable smoke tests, curl commands, expected responses, and verification steps for the main flows. Use these as manual checks or convert them into automated tests.

Prerequisites
- Start backend: `npm run server` (ensure `.env` has `JWT_SECRET`, `MONGODB_URI`).
- Start frontend dev server: `npm run dev` (optional; tests work directly against API).
- Use `jq` for prettifying JSON responses (optional).

1) Signup and Login (create test users)

# Signup (founder)
curl -s -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Founder","email":"founder@test.local","password":"password123","userType":"founder"}' | jq

Expected: 201 JSON with `token` and `user` object. Save token for later.

# Login
curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"founder@test.local","password":"password123"}' | jq

Expected: 200 JSON with `token` and `user`.

2) Create Project (as founder)

# Replace <TOKEN> with the returned token
curl -s -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Test Project","description":"Demo","goal":100000,"category":"Tech"}' | jq

Expected: 201 JSON project with `ownerId` matching creator's id.

3) Invest (as investor)

# Signup an investor and login to get token, then:
curl -s -X POST http://localhost:4000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <INVESTOR_TOKEN>" \
  -d '{"projectId":"<PROJECT_ID>","amount":500}' | jq

Expected: 201 or 200 JSON representing created investment. Project `raised` should increment.

4) Post Project Update (owner)

curl -s -X POST http://localhost:4000/api/projects/<PROJECT_ID>/updates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"content":"Milestone reached"}' | jq

Expected: 201/200; `GET /api/projects/<PROJECT_ID>/updates` returns the new update.

5) Toggle Watchlist

curl -s -X POST http://localhost:4000/api/users/watchlist/<PROJECT_ID> \
  -H "Authorization: Bearer <TOKEN>" | jq

Expected: JSON indicating saved/unsaved status or updated user object with `watchlist` containing `PROJECT_ID`.

6) Realtime verification (manual)
- Open two browser sessions (or use the app & Postman).
- In session A, create an update or investment.
- Confirm session B receives `sync:update` event (inspect console/network for socket messages) and UI refreshed.

7) Fallback test (simulate Mongo down)
- Stop Mongo or change `MONGODB_URI` to an invalid host.
- Restart backend and perform writes (create project/investment).
- Confirm server logs show fallback to JSON store and requests succeed without crashing.
- Restore Mongo and verify fallback data persisted locally is accessible or reconcile manually.

8) Build & preview test

npm run build
npm run preview -- --port 5000
# open http://localhost:5000

Expected: Production build loads, UI works for browsing and public project views. Auth and protected actions require backend available.

9) Permission tests (negative cases)
- Attempt `PUT /api/projects/:id` as a non-owner -> expect 403.
- Attempt `POST /api/projects` as an investor -> expect 403 or validation failure.
- Try invalid JWT -> expect 401.

10) Helpful tips
- Capture request/response pairs for failing tests (curl + `jq`) and save logs.
- Use Postman collections to save test scripts and automate.

---

If you want, I can add GitHub Action workflows to run some of these tests automatically (using `npm run build` + `node`-based smoke scripts).