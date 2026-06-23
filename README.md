# Portfolio Blog

## Overview

Jesse Bias's personal portfolio and blog, built as a full-stack bootcamp project. It combines a single-page portfolio (hero, about, works, blog preview, tools, and contact sections) with a fully functional blog system backed by a REST API, PostgreSQL database, and a JWT-authenticated admin dashboard for authoring posts. The frontend is fully bilingual (English / Japanese) with a `/ja` route prefix and an in-nav language switcher.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 |
| Frontend routing | React Router v7 |
| Frontend build tool | Vite 7 |
| Frontend language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Internationalization | Custom i18n (bilingual EN / JA, `/ja` route prefix) |
| HTTP client | Axios |
| Smooth scroll | Lenis 1.3 |
| Frontend testing | Vitest + React Testing Library + MSW |
| E2E testing | Selenium WebDriver (headless Chrome) |
| Backend framework | Express 5 |
| Backend language | Node.js (ESM) |
| Database | PostgreSQL (via `pg` Pool, no ORM) |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Email | Resend API |
| Backend testing | Jest + Supertest |
| Dev orchestration | concurrently |

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (running locally)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd portfolio-blog

# 2. Install all dependencies (frontend + backend)
npm run install:all

# 3. Configure environment variables
cp backend/example.env backend/.env
# Edit backend/.env with your values (see Environment Variables below)

# 4. Create the PostgreSQL database
createdb portfolio_blog

# 5. Initialize tables (drops and recreates — do not run against live data)
cd backend && npm run db:init

# 6. Seed the admin account from .env values
cd backend && npm run seed:db

# 7. Start both servers
cd ..
npm run dev
```

Frontend runs on **http://localhost:3001**, backend on **http://localhost:3000**. Vite proxies all `/api/*` requests to the backend automatically.

### Environment Variables

Create `backend/.env` by copying `backend/example.env`. All variables are required.

| Variable | Description |
|---|---|
| `PORT` | Backend port (default: `3000`) |
| `DB_HOST` | PostgreSQL host (default: `localhost`) |
| `DB_PORT` | PostgreSQL port (default: `5432`) |
| `DB_USER` | PostgreSQL user |
| `DB_PASSWORD` | PostgreSQL user password |
| `DB_NAME` | PostgreSQL database name (e.g. `portfolio_blog`) |
| `JWT_SECRET` | Secret key used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT expiry duration (e.g. `24h`) |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) for contact email |
| `CONTACT_EMAIL` | Email address that receives contact form submissions |
| `ADMIN_NAME` | Display name for the seeded admin account |
| `ADMIN_EMAIL` | Email for the seeded admin account |
| `ADMIN_PASSWORD` | Password for the seeded admin account |

## Architecture

### Backend

Express 5 REST API with PostgreSQL accessed via the `pg` connection pool. No ORM is used — all queries are raw parameterized SQL.

**Request flow:** `routes/` → `controllers/` → `models/` → `db/dbconn.js`

- **Auth middleware** (`middleware/auth-middleware.js`): `authenticateToken` verifies the JWT on the `Authorization: Bearer <token>` header; `authorizeAdmin` additionally checks that `role === 'admin'`.
- **DTOs** (`dtos/UserDTO.js`, `dtos/BlogDTO.js`): Strip sensitive fields (e.g. `password`) from all API responses.
- **Models**: `Blog.getAll()` and `Blog.findById()` use `row_to_json(users)` to embed author info as a nested `user` object on each blog row.
- **Registration**: `POST /api/auth/create-account` is disabled. New admin accounts must be created with `npm run seed:db`.

### Frontend

React 19 SPA. The app is wrapped by `<AuthProvider>` (global auth context), which wraps `<RouterProvider>`. The route tree (`main.tsx`) renders every page inside `<Layout>` (Navbar + Footer shell with Lenis smooth scroll), which in turn provides `<LanguageProvider>` for i18n.

- **Localized routing** (`main.tsx`): A `makeAppRoutes()` factory builds the full route set once, then mounts it twice — at the root (English) and under a `/ja` prefix (Japanese) — so both languages share identical route definitions. The portfolio sections (`/works`, `/about`, `/contact`) are real routes that all render `Home`.
- **i18n** (`i18n/LanguageProvider.tsx`, `i18n/translations.ts`): `useI18n()` exposes the active `lang`, the translation dictionary `t`, and `localize(path)` (prefixes internal links with `/ja` when Japanese is active). The active language is derived from the URL path; `LanguageProvider` keeps `<html lang>` and document metadata in sync. The Japanese dictionary is type-checked against the English source of truth so the two can never drift out of shape. A `LanguageSwitcher` in the Navbar uses `swapLangPath()` to toggle EN/JA while keeping the user on the same page.
- **Vite proxy**: All `/api/*` calls in frontend code use relative paths — no hardcoded host. Vite forwards them to `http://localhost:3000` during development.
- **Auth context** (`context/AuthProvider.tsx`): JWT persisted in `localStorage`, decoded with `jwt-decode` on load, automatically invalidated if expired.
- **Smooth scroll** (`lenis/react`): Initialized in `Layout.tsx`, consumed in `Navbar.tsx` to animate hash-based section scrolling.
- **Scramble/glitch effect**: Interval-based random character replacement on hover, used in `Navbar`, `Login`, and the `Button` UI component.
- **BootScreen**: Terminal-style intro animation that fires once per browser session via `sessionStorage`.

## React Components

### Layout and Navigation

**`Layout`** (`components/Layout.tsx`)
Wraps all routes. Initializes Lenis smooth scroll and renders `<Navbar>` and `<Footer>` around a `<Outlet>`. No API calls.

**`Navbar`** (`components/Navbar.tsx`)
Fixed top navigation bar with an animated liquid-gradient logo (`JB`) and four nav links: ABOUT, WORK, BLOG, CONTACT (labels pulled from the i18n dictionary, links run through `localize()`). Hash links (`#about`, `#works`, `#contact`) use Lenis to scroll to the corresponding section on the home page. Includes a `LanguageSwitcher` (EN / JA) that swaps the route prefix while preserving the current page. All labels apply a scramble/glitch effect on hover. No API calls.

**`Footer`** (`components/Footer.tsx`)
Renders social links (via the shared `SocialLinks` sub-component) and a copyright notice. No API calls.

### Home Page Sections

All sections below are composed in `pages/Home.tsx` as a single-page layout. The `BootScreen` terminal animation plays once per session before the sections appear; `ScrollToHash` handles deep-link scrolling after boot.

**`Hero`** (`components/Hero.tsx`)
Full-screen section with a looping background video (`/hero-bg.mp4`, with `/hero-bg.png` poster) at reduced opacity, a gradient overlay, and Jesse's name and title centered over it. Includes a fading scroll-indicator arrow at the bottom. No API calls. No local state.

**`About`** (`components/About.tsx`)
Two-column grid with a headshot (`/headshot.jpg`) on the left and a bio paragraph plus social links on the right. No API calls. No local state.

**`Works`** (`components/Works.tsx`)
Tabbed portfolio section with four category tabs: Web, Music, Film, Photo. Project data is entirely static (defined as a `PROJECTS` constant in the file). Clicking a project card opens a `WorkModal` overlay with extended description, optional video, and optional external link. Tab switching fades the grid with a 200ms timeout. No API calls.

**`Blog`** (`components/Blog.tsx`)
Home-page blog preview section. On mount, calls `GET /api/blogs` (via the shared `api/blogs` module) and displays the four most recent posts as rows linking to `/blogs/:id`, each showing a `category • date` meta line. If fewer than four posts exist, localized sample entries (`t.blog.samples`) fill the remaining slots so the journal reads as complete before posts exist. Errors are silently swallowed and all four slots show sample entries. Includes a "READ MORE" button linking to `/blogs`.

- **State managed**: `posts: Blog[]`
- **API**: `GET /api/blogs`

**`Tools`** (`components/Tools.tsx`)
Static grid of technology icons and labels. No API calls.

**`Contact`** (`components/Contact.tsx`)
Contact form with name, email, and message fields. On submit, POSTs `{ name, email, message }` to `POST /api/contact` using Axios. Displays a success message or an error message from the API response. Resets the form on success.

- **State managed**: `name`, `email`, `message`, `status` (`idle | sending | success | error`), `errorMsg`
- **API**: `POST /api/contact`

### Blog Pages

**`Blogs`** (`pages/Blogs.tsx`)
Full blog listing page at `/blogs`. Fetches all posts from `GET /api/blogs` on mount, renders them as a responsive card grid (1/2/3 columns). Cards show a cover image (or a placeholder), date, category, title, and a 150-character content excerpt. Each card links to `/blogs/:id`. Shows skeleton loaders while fetching.

- **State managed**: `blogs: Blog[]`, `loading`, `error`
- **API**: `GET /api/blogs`

**`BlogPost`** (`pages/BlogPost.tsx`)
Individual post page at `/blogs/:id`. Extracts `id` from the route params via `useParams`, then calls `GET /api/blogs/:id`. Renders the post title, publication date, author name (from the nested `blog.user.name` field, falling back to "JESSE BIAS"), category, and full content. Shows a loading indicator while fetching and a styled error state if the post is not found.

- **State managed**: `blog: Blog | null`, `loading`, `error`
- **API**: `GET /api/blogs/:id`

### Auth Components

**`AuthProvider`** (`context/AuthProvider.tsx`)
React context provider that wraps the entire app. On mount it reads the JWT from `localStorage`, decodes it with `jwt-decode`, and checks the `exp` claim — clearing the token if expired. Provides:

| Value | Type | Description |
|---|---|---|
| `token` | `string \| null` | Raw JWT string |
| `user` | `User \| null` | Decoded payload: `{ id, name, email, role, exp }` |
| `isLoggedIn` | `boolean` | `true` when `user` is not null |
| `isAdmin` | `boolean` | `true` when `user.role === 'admin'` |
| `isLoading` | `boolean` | `true` while the initial token check runs |
| `login(token, user)` | function | Persists token to `localStorage`, updates state |
| `logout()` | function | Removes token from `localStorage`, clears state |

**`ProtectedRoute`** (`components/ProtectedRoute.tsx`)
Route guard that requires the user to be logged in. Shows a centered loading spinner while `isLoading` is `true`. Renders `<Outlet>` when `isLoggedIn`, otherwise redirects to `/login`. Guards the `/profile` route.

**`PrivateRoute`** (`components/PrivateRoute.tsx`)
Route guard that requires login AND admin role. Shows a loading spinner while `isLoading` is `true`. If not logged in, redirects to `/login`. If logged in but not admin, redirects to `/`. Renders `<Outlet>` only when both conditions are satisfied. Guards the `/admin` route.

### Admin

**`AdminDashboard`** (`pages/AdminDashboard.tsx`)
Admin-only page at `/admin` (behind `PrivateRoute`). On mount it fetches all posts and all users in parallel.

The page has three sections:

1. **Create / Edit Post** — a form with title, category, a file input for cover media, and a `contentEditable` rich-text editor. The toolbar uses `document.execCommand` for bold, italic, underline, unordered list, ordered list, blockquote, link, and image. Submitting calls `POST /api/blogs` (create) or `PUT /api/blogs/:id` (edit), both with `Authorization: Bearer <token>` from `useAuth`.

2. **Manage Posts** — a list of all posts with EDIT and DELETE buttons. Clicking EDIT populates the form above. DELETE calls `DELETE /api/blogs/:id` after a confirmation dialog, then removes the post from local state optimistically.

3. **User Management** — a read-only list of all users (name, email, role) fetched from `GET /api/meta/users`.

- **State managed**: `title`, `category`, `editingPost`, `isSubmitting`, `submitError`, `submitSuccess`, `posts`, `users`, `postsError`, `usersError`
- **API**: `GET /api/blogs`, `GET /api/meta/users`, `POST /api/blogs` (JWT), `PUT /api/blogs/:id` (JWT), `DELETE /api/blogs/:id` (JWT)

### Login

**`Login`** (`pages/Login.tsx`)
Login page at `/login`. Runs a scramble animation on the "WELCOME BACK" heading on mount and on card hover. On submit, calls `POST /api/auth/login` via the `api/auth` module. On success, calls `AuthProvider.login(token, user)` and navigates to `/admin`. Displays API error messages inline.

- **State managed**: `email`, `password`, `error`, `loading`, `title` (scramble animation)
- **API**: `POST /api/auth/login`

### Profile

**`Profile`** (`pages/Profile.tsx`)
User profile page at `/profile` (behind `ProtectedRoute`). Reads `user` from `useAuth` and renders the user's initial as an avatar, plus their name, email, and role. Includes a Sign Out button that calls `logout()`. No API calls.

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | None | Authenticate and receive a JWT token |
| `GET` | `/api/blogs` | None | Return all blog posts (with embedded author) |
| `GET` | `/api/blogs/:id` | None | Return a single blog post by ID |
| `POST` | `/api/blogs` | Admin JWT | Create a new blog post |
| `PUT` | `/api/blogs/:id` | Admin JWT | Update an existing blog post |
| `DELETE` | `/api/blogs/:id` | Admin JWT | Delete a blog post |
| `POST` | `/api/contact` | None | Send a contact email via Resend |
| `GET` | `/api/meta/schema/:table` | None | Return column definitions for `blogs` or `users` (dev tool) |
| `GET` | `/api/meta/users` | JWT | Return all users without password field (dev tool) |

Admin JWT endpoints require `Authorization: Bearer <token>` in the request header. The token must decode to a payload with `role === 'admin'`.

## Database Schema

```sql
users (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  password     TEXT NOT NULL,                 -- bcrypt hash
  role         VARCHAR(50) DEFAULT 'user',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

blogs (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  content      TEXT NOT NULL,
  category     VARCHAR(255),
  image_url    TEXT,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The full schema (including `category` and `image_url`) is created up front by `db:init` (`scripts/setup-db.sql`, which drops and recreates both tables). `Blog.getAll()` and `Blog.findById()` use `row_to_json(users)` to embed a nested `user` object on each row.

## Testing

All three layers pass. See [REVIEW.md](REVIEW.md) for the latest run and coverage breakdown.

### Backend (Jest + Supertest) — 38 tests, 6 suites

```bash
cd backend && npm test
cd backend && npm run test:coverage
```

Tests live in `backend/__tests__/`. Database access is mocked (the `pg` Pool `query` is a Jest mock), so no live PostgreSQL is needed. Coverage is ~82% over controllers/models/routes/middleware, with `auth.js` and `User.js` at 100%.

### Frontend (Vitest + React Testing Library + MSW) — 65 tests, 9 suites

```bash
cd frontend && npm test
cd frontend && npm run test:coverage
```

Tests live in `frontend/src/test/`. MSW (`src/test/handlers.ts`) intercepts all `/api/*` requests; `renderWithProviders` wraps components in `MemoryRouter` → `LanguageProvider` → `AuthProvider`.

### E2E (Selenium WebDriver, headless Chrome) — 6 tests

```bash
# Start both dev servers first (from the repo root):
npm run dev

# Then, in a separate terminal:
cd e2e && npm install
export $(grep -E '^ADMIN_EMAIL=|^ADMIN_PASSWORD=' ../backend/.env | xargs)
npm test
```

Requires Chrome (Selenium Manager auto-provisions a matching chromedriver) and both dev servers running on ports 3001/3000. The login-success test self-skips if `ADMIN_EMAIL` / `ADMIN_PASSWORD` are unset.

## Dev Tools

### DB Viewer

Open `tools/db-viewer.html` in a browser while the backend is running. It provides a live view of the `blogs` and `users` tables with schema introspection powered by `GET /api/meta/schema/:table` and `GET /api/meta/users`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend (port 3001) and backend (port 3000) concurrently |
| `npm run dev:frontend` | Start Vite dev server only (port 3001) |
| `npm run dev:backend` | Start Express server only (port 3000) |
| `npm run install:all` | Install dependencies in both `frontend/` and `backend/` |
| `cd backend && npm run db:init` | Drop and recreate all database tables |
| `cd backend && npm run seed:db` | Create admin account from `.env` credentials |
| `cd frontend && npm run build` | TypeScript compile and Vite bundle |
| `cd frontend && npm run lint` | Run ESLint on frontend source |
