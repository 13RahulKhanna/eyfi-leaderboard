# EYFI Challenge — Leaderboard

A live, ranked leaderboard for the EYFI (Earn Your First Income) Challenge — built for the
design assignment. Ranks student participants by income earned during the 30-day challenge,
with a top-3 podium, live earnings ticker, category/search filters, and real-time re-ranking
over WebSockets.

## Stack

- **frontend/** — Next.js 16 (App Router, React 19, TypeScript, Tailwind CSS v4), Framer Motion
  for animation, `socket.io-client` for the live feed.
- **backend/** — NestJS 12 (Express, TypeScript, ESM), a `LeaderboardModule` with a REST endpoint
  and a Socket.IO gateway. Data is an in-memory seeded dataset (deterministic on boot, then
  mutated live) — no database needed for this scope; swapping in Postgres/Prisma later just
  means replacing `LeaderboardService`'s storage.

## Design

Brand pulled from eyfichallenge.com: near-black background (`#0a0a0a`), lime green (`#c4f62e`)
as the primary accent, orange (`#ff5a1f`) as the secondary/energy accent, Bricolage Grotesque
for display type and Space Grotesk for UI text — matching the high-energy, youth-hustle tone of
the actual challenge site, not a generic dashboard template.

Product decisions:
- **Podium (top 3) + ranked list**, the pattern students already know from Duolingo/Strava-style
  leaderboards — instantly legible, no onboarding needed.
- **Live ticker + Socket.IO re-ranking**: every few seconds a random participant "earns" more and
  the list smoothly reorders (Framer Motion layout animations), so the page feels alive rather
  than a static snapshot — appropriate for a page whose entire premise is "money earned right now."
- **Range tabs (Week / Month / All Time) + category filter + search**, because a 30-day challenge
  leaderboard needs to answer "who's hot this week" as much as "who's winning overall."
- **Streak flames, category tags, and rank-delta arrows** borrow game-mechanics students respond
  to, without needing an actual account/auth system for this assignment's scope.
- Avatars are generated client-side (initials + a deterministic color from the name) — no external
  avatar service or image requests.

## Running locally

Requires Node.js 20+.

```bash
# backend
cd backend
npm install
cp .env.example .env   # optional, defaults already work locally
npm run start:dev      # http://localhost:3001

# frontend (separate terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev             # http://localhost:3000
```

The frontend expects `NEXT_PUBLIC_API_URL` to point at the backend (defaults to
`http://localhost:3001` — see `frontend/.env.example`).

### Useful scripts

| Location  | Command          | What it does                        |
|-----------|------------------|--------------------------------------|
| backend/  | `npm run build`  | Compile TypeScript to `dist/`        |
| backend/  | `npm run test:e2e` | Hits `/api/health` and `/api/leaderboard` |
| frontend/ | `npm run build`  | Production Next.js build             |

## API

- `GET /api/leaderboard?range=week|month|all&category=&search=` — ranked entries for a range,
  optionally filtered.
- `GET /api/health` — health check (used by Railway).
- WebSocket, default namespace, event `leaderboard:update` — pushed every ~4.5s with fresh
  rankings for all three ranges plus the earning event that triggered the change.

## Deploying (GitHub + Railway)

This repo is a monorepo with two independently deployable services. On Railway, create **two
services** pointing at the same GitHub repo, each with its **Root Directory** set to `backend`
or `frontend` respectively — Railway will pick up each service's `railway.json` (Dockerfile
builder) automatically.

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo**, select the repo.
3. Add a service for `backend`:
   - Root directory: `backend`
   - Env vars: `PORT` (Railway sets this automatically), `FRONTEND_ORIGIN` = your deployed
     frontend URL (e.g. `https://eyfi-leaderboard.up.railway.app`).
4. Add a second service for `frontend`:
   - Root directory: `frontend`
   - Build arg / env var: `NEXT_PUBLIC_API_URL` = your deployed backend URL.
5. Generate public domains for both services in Railway's Settings tab.

Both services build from their own `Dockerfile`, so no shared build config is needed.
