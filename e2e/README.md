# E2E Tests — Portfolio Blog

Selenium WebDriver end-to-end tests for the portfolio-blog application.

## Prerequisites

1. **Chrome** — a recent version of Google Chrome must be installed.
2. **ChromeDriver** — must match your Chrome version and be on your `PATH`.
   - macOS with Homebrew: `brew install --cask chromedriver`
   - Or download from https://chromedriver.chromium.org/downloads
3. **Both dev servers must be running** before executing the tests:
   - Frontend on `http://localhost:3001`
     ```
     cd frontend && npm run dev
     ```
   - Backend on `http://localhost:3000`
     ```
     cd backend && npm start
     ```

## Setting credentials

Admin credentials are read from environment variables. Choose one approach:

**Option A — inline when running tests:**
```sh
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm test
```

**Option B — `.env` file in the `e2e/` directory:**
```
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=yourpassword
```

If credentials are not set, the login-success test will be skipped with a warning.

## Running the tests

```sh
cd e2e
npm install
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm test
```

For verbose output:
```sh
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm run test:verbose
```

## Test coverage

| Test | What it verifies |
|------|-----------------|
| Login success | Valid admin credentials redirect to `/admin` and admin content is visible |
| Login failure | Invalid credentials show an inline error; URL stays on `/login` |
| Blogs page load | `/blogs` renders the "BLOG" heading and either post cards or an empty state |
| Blog post navigation | Clicking the first blog card navigates to `/blogs/:id` and shows "RETURN TO BLOG" |
| Admin route guard | Unauthenticated visit to `/admin` redirects to `/login` |
| Profile route guard | Unauthenticated visit to `/profile` redirects to `/login` |

## Notes

- Tests run Chrome in headless mode (`--headless`) with a 1280x800 viewport.
- Each test clears `localStorage` after it runs to prevent auth state leakage.
- The blog-post-navigation test is wrapped in try/catch and skips gracefully when the database has no posts.
- The default wait timeout is 10 seconds per element/URL assertion.
