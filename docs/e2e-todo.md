# E2E Tests — RUN & PASSING (2026-06-22)

Selenium E2E suite executed against live local servers (frontend 3001 +
backend 3000, native Postgres, admin seeded). **6/6 tests pass** (~11s).

## What's covered
- Login success (valid admin credentials redirect to /admin)
- Login failure (wrong credentials show inline error, stay on /login)
- Blogs page load (heading + posts-or-empty-state)
- Blog post navigation (self-skips gracefully when DB has no posts)
- Admin route guard redirect (/admin → /login when unauthenticated)
- Profile route guard redirect (/profile → /login when unauthenticated)

## How to run

1. Start the dev servers (from project root):
   ```bash
   npm run dev
   ```

2. In a separate terminal, run the E2E suite (creds read from backend/.env):
   ```bash
   cd e2e && npm install \
     && export $(grep -E '^ADMIN_EMAIL=|^ADMIN_PASSWORD=' ../backend/.env | xargs) \
     && npm test
   ```

## Requirements
- Chrome installed (Selenium Manager auto-provisions a matching chromedriver;
  a chromedriver on PATH is not required with selenium-webdriver 4.27+).
- Both frontend (port 3001) and backend (port 3000) running before tests start.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` set (the login-success test self-skips if absent).
