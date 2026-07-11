# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SGRM (Sistema de Gestión de Restaurante) is a full-stack app for managing restaurants, with two account types authenticating against the same login endpoint:
- **Backend** (`server/`): Node.js/Express REST API with PostgreSQL via Prisma ORM
- **Frontend** (`client/`): React 19 + Vite SPA, styled with Tailwind CSS v4, routed with React Router v7

Authentication uses JWT tokens (`jsonwebtoken`) and bcrypt password hashing (`bcryptjs`). Code and comments are written in Spanish; keep that convention when editing `server/` and `client/` source files.

## Architecture

### Backend Structure (`server/src/`)

Layered MVC-inspired architecture:

```
server/src/
├── index.js                    # Express app setup, middleware, server startup
├── config/db.js                # Prisma client singleton (uses PrismaPg adapter + pg Pool)
├── routes/auth.routes.js       # Route definitions
├── controllers/auth.controller.js  # HTTP request handlers
├── services/auth.service.js    # Business logic + DB operations
├── middleware/auth.middleware.js   # verificarToken — JWT verification middleware
└── helpers/jwt.js              # generateToken — JWT signing helper
```

**Key patterns:**
- Prisma Client is instantiated in `config/db.js` with the `@prisma/adapter-pg` driver adapter (not the default Prisma engine) and exported as a singleton for use across services.
- Services handle DB access and business logic; controllers only translate HTTP ↔ service calls; routes map endpoints to controllers.
- `loginUsuario` (in `auth.service.js`) checks **both** the `User` and `Restaurant` tables by email (in that order) to determine `accountType` (`USER` or `RESTAURANT`), since both can log in through the same `/api/auth/login` endpoint. The JWT payload and returned user object shape differ slightly by account type (`role` is only present for `USER`).
- Protected routes should use `verificarToken` from `auth.middleware.js`, which reads the `Authorization: Bearer <token>` header and attaches the decoded payload to `req.usuario`.

### Database Schema (`server/prisma/schema.prisma`)

PostgreSQL via Prisma, using the `@prisma/adapter-pg` driver adapter (see `prisma.config.ts`, which loads `DATABASE_URL` via `dotenv/config`).

- **User**: `id, name, email (unique), password, role, isActive, createdAt, updatedAt` — has many `Restaurant`. `role` enum: `SUPER_ADMIN | OWNER`.
- **Restaurant**: `id, userId (FK → User), name, email (unique), password, phone?, address?, isActive, createdAt, updatedAt`. Restaurants authenticate independently with their own `email`/`password`, separate from the owning `User`'s credentials.

### Frontend Structure (`client/src/`)

```
client/src/
├── main.jsx                    # React root, wraps App in BrowserRouter
├── App.jsx                     # Route definitions
├── api/
│   ├── axiosClient.js          # Axios instance; injects Bearer token from localStorage via request interceptor
│   └── auth.api.js             # loginRequest — calls POST /auth/login
├── components/RutaProtegida.jsx  # Route guard: redirects to /login if no token in localStorage
└── pages/
    ├── Login.jsx                # Login form; on success stores token/accountType/user in localStorage
    ├── Home.jsx                 # Restaurant-side landing page
    └── Dashboard.jsx             # Owner/SuperAdmin-side landing page
```

**Key patterns:**
- Auth state is not held in React context/state — it lives entirely in `localStorage` (`token`, `accountType`, `user`), and `axiosClient`'s request interceptor reads `token` on every request.
- `RutaProtegida` is a simple wrapper component (not a router-level guard) used per-route in `App.jsx` to gate access based on token presence only (no expiry/role check client-side).
- After login, navigation branches on `accountType`: `RESTAURANT` → `/home`, otherwise (owner/super admin) → `/dashboard`.
- API base URL comes from `VITE_API_URL` (set in `client/.env`).
- Tailwind v4 is wired through `@tailwindcss/postcss` in `postcss.config.js` (not a `tailwind.config.js`-driven v3 setup, though a `tailwind.config.js` content-globs file is still present).

## Common Commands

### Backend (`server/`)

```bash
npm install              # Install dependencies
npm run dev               # Run with nodemon hot-reload
npm start                 # Run in production mode

npx prisma migrate dev --name <migration_name>   # Create + apply a migration after schema changes
npx prisma migrate deploy                         # Apply pending migrations
npx prisma studio                                  # Web UI for DB inspection
npx prisma generate                                 # Regenerate Prisma Client (also runs on install)
```

### Frontend (`client/`)

```bash
npm install       # Install dependencies
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

There is no test suite configured in either `server/` or `client/` yet.

## Environment Setup

`server/.env`:
```
DATABASE_URL="postgresql://user:password@host:port/database_name?schema=public"
PORT=5000          # Optional, defaults to 5000
JWT_SECRET=...      # Required — used to sign/verify JWTs
```
Default local setup: PostgreSQL at `localhost:5432`, database `SGRM`.

`client/.env`:
```
VITE_API_URL=...   # Base URL for the backend API, consumed by axiosClient
```

## Development Workflow

1. **Database changes**: edit `server/prisma/schema.prisma`, then `npx prisma migrate dev --name <name>`.
2. **New backend endpoints**: add route in `server/src/routes/*.routes.js` → controller in `server/src/controllers/*.controller.js` → service in `server/src/services/*.service.js` (import Prisma from `config/db.js`). Wrap with `verificarToken` middleware if the route requires authentication.
3. **New frontend pages**: add to `client/src/pages/`, wire into `client/src/App.jsx`, wrap with `RutaProtegida` if it requires auth. API calls go through `axiosClient` from `client/src/api/`.
4. Health check: `GET /api/health` on the backend.
