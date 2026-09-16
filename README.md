# Warden — Role-Based Ops & Approval Platform

A back-office platform demonstrating role-based access control and maker/checker
approval workflows — the same class of problem behind regulated financial and
enterprise systems, built here as a fully public, portfolio-owned project.

See the full project brief and milestone tracker at
`~/Desktop/Portfolio-Projects-Documentation.md`.

## Structure

- `client/` — React (Vite) + Tailwind CSS frontend
- `server/` — Node.js + Express + PostgreSQL (Prisma) API

## Running locally

### 1. Database

Requires a local PostgreSQL server running. Create the database once:

```bash
createdb warden
```

### 2. Server

```bash
cd server
cp .env.example .env   # then edit DATABASE_URL / JWT_SECRET if needed
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev             # http://localhost:4000
```

Demo accounts (seeded):

| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Admin   | admin@warden.dev    | password123 |
| Manager | manager@warden.dev  | password123 |
| Staff   | staff@warden.dev    | password123 |

### 3. Client

```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:4000`.

## Milestone status

**Done:**
- Auth: JWT register/login/me, bcrypt hashing, protected routes.
- Role-based access control enforced server-side (`requirePermission` middleware), not just hidden in the UI — a Staff token gets a real 403 from `/api/users`, `/api/audit-log`, and the approve/reject endpoints.
- Maker/checker approval workflow: `POST /api/requests`, `/:id/approve`, `/:id/reject` — a request's own maker gets a 403 if they try to decide it themselves.
- Every create/approve/reject action is written to an audit log; `GET /api/requests/:id/history` powers the per-request audit timeline in the UI.
- Frontend fully wired to this real API (Overview, Requests, Approvals, Request Detail, Users, Audit Log) — no more mock data for any of it.
- A real "New Request" form (`/requests/new`) — any role can submit a request end to end through the UI, not just via curl.
- Admin UI for role management — inline role selector on the Users page, backed by `PATCH /api/users/:id/role`, audited, and blocked from self-modification (can't demote/promote yourself).
- Disable/enable user accounts — `PATCH /api/users/:id/status`, blocked at login (423) and kicked out immediately if already signed in, audited, self-disable blocked.

**Not done yet:**
- Not deployed anywhere yet — local only.
