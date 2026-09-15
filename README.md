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

**Milestone 1 — Foundations: done.**
Postgres schema, JWT auth (register/login/me), protected client routes, login UI, dashboard shell.

Next: Milestone 2 — role-based permission middleware + admin UI for assigning roles/permissions.
