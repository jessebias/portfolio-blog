# Test Review

_Last run: 2026-06-22 — all three layers executed and passing._

## Backend (Jest + Supertest)

**Result: PASS**

- Test Suites: 6 passed, 6 total
- Tests: 38 passed, 38 total
- Snapshots: 0 total
- Time: ~0.6s

Database calls are mocked (`pg` Pool `query` is a Jest mock), so the suite runs without a live PostgreSQL instance. Jest emits a non-fatal `--detectOpenHandles` suggestion; all tests pass.

Suites:
- `auth.test.js` — `POST /api/auth/login` via Supertest (missing fields, unknown user, bad password, success/DTO shape)
- `authController.test.js` — `register` controller directly (validation, duplicate, success, 500) + `login` 500 path
- `userModel.test.js` — all six `User` model methods against a mocked pool
- `blogs.test.js` — blog CRUD routes (public reads, admin-guarded writes)
- `contact.test.js` — `POST /api/contact` validation + Resend send path
- `meta.test.js` — meta schema/users endpoints

## Frontend (Vitest + React Testing Library + MSW)

**Result: PASS**

- Test Files: 9 passed (9)
- Tests: 65 passed (65)
- Duration: ~1.3s

MSW intercepts all `/api/*` calls. Node emits experimental `localStorage` warnings (no `--localstorage-file`); a `MemoryStorage` polyfill in `src/test/setup.ts` handles this. All tests pass.

Suites: `AuthProvider`, `ProtectedRoute`, `PrivateRoute`, `Login`, `Blogs`, `BlogPost`, `BlogPreview`, `AdminDashboard`, `api.blogs`.

> Components that call `useI18n()` are rendered through `renderWithProviders`, which wraps `MemoryRouter` → `LanguageProvider` → `AuthProvider`.

## E2E (Selenium WebDriver, headless Chrome)

**Result: PASS**

- Tests: 6 passed, 6 total
- Time: ~11s

Executed against live local servers (frontend `:3001`, backend `:3000`, native PostgreSQL with the admin account seeded). Selenium Manager auto-provisioned a matching chromedriver.

Flows covered: login success, login failure (inline error), blogs page load, blog-post navigation (self-skips gracefully when the DB has no posts), `/admin` route guard redirect, `/profile` route guard redirect.

## Coverage Summary

### Backend (`jest --coverage`, scoped to controllers/models/routes/middleware)

| File | % Stmts | % Branch | % Funcs | % Lines | Uncovered |
|---|---|---|---|---|---|
| **All files** | 81.67 | 73.23 | 92 | 82.88 | |
| controllers/auth.js | 100 | 100 | 100 | 100 | |
| controllers/blogController.js | 83.33 | 100 | 100 | 82.75 | 9,19,31,41,50 |
| middleware/auth-middleware.js | 92.85 | 100 | 100 | 92.85 | 20 |
| models/Blog.js | 78.12 | 57.14 | 100 | 80.64 | 56-57,60-61,64-65 |
| models/User.js | 100 | 100 | 100 | 100 | |
| routes/authRouter.js | 100 | 100 | 100 | 100 | |
| routes/blogsRouter.js | 100 | 100 | 100 | 100 | |
| routes/contactRouter.js | 87.5 | 90.9 | 100 | 87.5 | 40-41 |
| routes/metaRouter.js | 47.36 | 14.28 | 50 | 50 | 37-38,49-50,56-61,66-76 |

### Frontend (`vitest --coverage`)

- Statements: 40.46% · Branches: 29.53% · Functions: 37.79% · Lines: 42.91%

Coverage is concentrated on behavioral units, which are well exercised:

| Area | % Stmts |
|---|---|
| pages/Login.tsx | 92.85 |
| pages/Blogs.tsx | 88.46 |
| pages/BlogPost.tsx | 87.5 |
| pages/AdminDashboard.tsx | 77.77 |
| context/AuthProvider.tsx | 91.42 |
| components/Blog.tsx | 100 |
| components/ui/Button.tsx | 100 |
| api/blogs.ts | (full CRUD + auth-header tests) |

The overall percentage is pulled down by intentionally untested presentational/static components (`Hero`, `About`, `Works`, `Tools`, `Footer`, `BootScreen`, `Navbar`, `Home`, `Profile`, `NotFound`) — these are layout/markup with no branching logic.

## Issues Found

No test failures. Remaining low-coverage areas (non-blocking):

1. **`routes/metaRouter.js` (47%)** — the dev-only schema-introspection and users endpoints are partially exercised; the error branches are untested.
2. **`models/Blog.js` branches (57%)** — the optional `category`/`image_url` update branches are not all hit.
3. **Frontend presentational components (0%)** — static layout components carry no logic and are deliberately excluded from meaningful coverage.

## Overall Status

**PASS** — 38/38 backend, 65/65 frontend, 6/6 E2E. All three layers run green.
