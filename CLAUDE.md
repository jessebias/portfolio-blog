# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Agent Workflow

This project uses specialist subagents for all code changes. Claude acts as orchestrator — it reads context and delegates; it does not write source files directly.

| Domain | Agent file | Owns |
|--------|-----------|------|
| Backend | `.claude/agents/backend-specialist.md` | `backend/` |
| Frontend | `.claude/agents/frontend-specialist.md` | `frontend/src/`, `frontend/vite.config.ts`, `frontend/package.json` |
| E2E | `.claude/agents/e2e-specialist.md` | `e2e/` |
| Test review | `.claude/agents/test-reviewer.md` | Running tests, writing `REVIEW.md` |
| Orchestration | Inline (orchestrator) | `CLAUDE.md`, `.claude/agents/`, `README.md`, `tools/` |

**Before spawning a specialist**: read its agent file to load current domain knowledge.  
**After a specialist finishes**: it must update its own agent file if anything in its domain changed.  
**Cross-domain tasks**: spawn multiple specialists in parallel; orchestrator synthesises results.

## Commands

```bash
# Start both frontend (port 3001) and backend (port 3000)
npm run dev

# Start individually
npm run dev:frontend
npm run dev:backend

# Install all dependencies (root + frontend + backend)
npm run install:all

# Initialize PostgreSQL tables — drops and recreates all tables, do not run against live data
cd backend && npm run db:init

# Create/reset admin account from .env credentials
cd backend && npm run seed:db

# Frontend
cd frontend && npm run build      # TypeScript compile + Vite bundle
cd frontend && npm run lint       # ESLint
cd frontend && npm run preview    # Preview production build

# Tests
cd backend && npm test            # Jest + Supertest (23 tests)
cd backend && npm run test:coverage
cd frontend && npm test           # Vitest + RTL (21 tests)
cd frontend && npm run test:coverage
cd e2e && npm test                # Selenium (requires live servers on 3001 + 3000)
```

## Architecture

### Monorepo
Root `package.json` uses `concurrently` to run frontend and backend together. Each subdirectory (`backend/`, `frontend/`) is its own git repository with its own `package.json` and `node_modules`.

Frontend Vite dev server proxies `/api/*` → `http://localhost:3000`, so all API calls in frontend code use relative paths (no hardcoded host).

### Backend (`backend/`)
Express 5 REST API + PostgreSQL via `pg` Pool (no ORM). Pattern: `routes/ → controllers/ → models/ → db/dbconn.js`.

- **Auth middleware**: `middleware/auth-middleware.js` — `authenticateToken` decodes JWT and sets `req.user`; `authorizeAdmin` checks `req.user.role === 'admin'`.
- **DTOs**: All responses shaped through `dtos/UserDTO.js` and `dtos/BlogDTO.js` — strips `password`, normalises field names to camelCase. BlogDTO returns `{ id, title, content, category, image_url, author: { id, name, email, role, createdAt }, createdAt, updatedAt }`.
- **Models**: Raw parameterized SQL. `Blog.getAll()` and `Blog.findById()` use `row_to_json(users)` to embed the author.
- **Registration**: `POST /api/auth/create-account` is commented out in `routes/authRouter.js`. Use `npm run seed:db` to create the admin account from `.env` vars (`ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
- **`scripts/seedDb.js`**: PostgreSQL admin seeder using bcrypt + env var credentials. Safe to re-run (uses `ON CONFLICT DO UPDATE`).
- **Meta routes** (`routes/metaRouter.js`): Dev-only endpoints — `GET /api/meta/schema/:table` (public, DB column introspection) and `GET /api/meta/users` (JWT required, returns users without passwords).
- **Contact route** (`routes/contactRouter.js`): `POST /api/contact` validates fields, sends email via Resend SDK to `process.env.CONTACT_EMAIL`.

### Frontend (`frontend/src/`)
React 19 SPA with React Router v7. All routes defined in `main.tsx`, wrapped in `<AuthProvider>` and `<Layout>`.

- **Auth context** (`context/AuthProvider.tsx`): JWT stored in `localStorage` as `"token"`, decoded on load with `jwt-decode`. Provides `isLoggedIn`, `isAdmin`, `isLoading`, `login(token, user)`, `logout()`. JWT payload: `{ id, email, role, exp }`.
- **Route guards**: `PrivateRoute` = login + admin required (redirects non-admins to `/`); `ProtectedRoute` = login only (redirects to `/login`).
- **Smooth scroll**: Lenis initialized in `Layout.tsx`, used in `Navbar.tsx` for hash-based section links.
- **Scramble/glitch effect**: `hooks/useScramble.ts` — interval-based random character replacement on hover. Used in `Navbar`, `Login`, `ui/Button`.
- **BootScreen**: Terminal-style intro animation, fires once per browser session via `sessionStorage`.
- **Home page**: Single route (`/`) composing Hero → About → Works → Blog preview → Tools → Contact sections.
- **`components/Blog.tsx`** (home preview): Fetches up to 4 most recent posts from `GET /api/blogs` on mount. Falls back to `ENTRY_00X_NULL` placeholder cards for any slots without a post.
- **`pages/AdminDashboard.tsx`**: Fully wired. Fetches posts (`GET /api/blogs`) and users (`GET /api/meta/users`) on mount. Create/edit calls `POST`/`PUT /api/blogs` with JWT header. Delete calls `DELETE /api/blogs/:id`. Edit mode pre-fills the form and scrolls to top.
- **`components/Contact.tsx`**: POSTs `{ name, email, message }` to `POST /api/contact` via axios. Shows success/error feedback. Email delivered via Resend to `CONTACT_EMAIL` env var.
- **`api/blogs.ts`**: `createBlog`, `updateBlog`, `deleteBlog` automatically attach `Authorization: Bearer <token>` header via `getAuthHeaders()` (reads from `localStorage`).

### Database Schema
```sql
users (id, name, email, password, role DEFAULT 'user', created_at, updated_at)
blogs (id, title, content, category, image_url, user_id REFERENCES users(id) ON DELETE CASCADE, created_at, updated_at)
```
Reset and recreate with `npm run db:init` — this **drops all tables first**. Re-seed admin with `npm run seed:db`.

### Required Environment Variables (`backend/.env`)
```
RESEND_API_KEY=        # Resend API key for contact form emails
CONTACT_EMAIL=         # Recipient address for contact form
ADMIN_NAME=            # Display name for seeded admin account
ADMIN_EMAIL=           # Login email for admin account
ADMIN_PASSWORD=        # Login password for admin account
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=            # Must be set — falls back to insecure placeholder
JWT_EXPIRES_IN=24h
```

### Dev Tools
`tools/db-viewer.html` — open directly in a browser while the backend is running. Live table viewer for `blogs` and `users` with schema introspection (DATA / SCHEMA toggle). Login with admin credentials to access the protected users endpoint.
