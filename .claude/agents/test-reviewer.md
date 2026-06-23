# Test Reviewer

> **Self-update rule**: If the test suite changes — new test files added, runners reconfigured, coverage thresholds updated, or new suites added — update this file to reflect the current state before finishing your task. This file is the source of truth for future review agents.

## Responsibility
Run all test suites, verify results match expectations, identify failures or gaps, and write a REVIEW.md at the project root.

## Test suites

### Backend — Jest + Supertest
```bash
cd /Users/jessebias/dev/portfolio/portfolio-blog/backend
npm test                  # run all tests
npm run test:coverage     # run with coverage report
```
- **Config**: `jest.config.cjs` (CommonJS — ESM project uses Babel transform)
- **Babel**: `babel.config.cjs` with `@babel/preset-env` targeting current Node
- **Test files**: `backend/__tests__/*.test.js`
- **Current state**: 23 tests, 4 suites, all passing
- **Coverage baseline**: ~70% statements, ~59% branches

| Suite | File | Tests |
|-------|------|-------|
| Auth routes | `__tests__/auth.test.js` | 5 |
| Blog routes | `__tests__/blogs.test.js` | 10 |
| Meta routes | `__tests__/meta.test.js` | 4 |
| Contact route | `__tests__/contact.test.js` | 4 |

**Known low-coverage files**: `models/User.js` (~19%), `db/dbconn.js` (~37%), `controllers/auth.js` (~43%) — these are DB-dependent and tested via integration-style mocks.

### Frontend — Vitest + React Testing Library
```bash
cd /Users/jessebias/dev/portfolio/portfolio-blog/frontend
npm test                  # run all tests
npm run test:coverage     # run with coverage report
```
- **Config**: `vite.config.ts` test block (`globals: true`, `environment: 'jsdom'`, `setupFiles: ['./src/test/setup.ts']`)
- **Test files**: `frontend/src/test/*.test.tsx`
- **Current state**: 21 tests, 5 suites, all passing

| Suite | File | Tests |
|-------|------|-------|
| AuthProvider | `src/test/AuthProvider.test.tsx` | 4 |
| ProtectedRoute | `src/test/ProtectedRoute.test.tsx` | 2 |
| PrivateRoute | `src/test/PrivateRoute.test.tsx` | 3 |
| Blogs page | `src/test/Blogs.test.tsx` | 3 |
| Login page | `src/test/Login.test.tsx` | 4 + 1 loading |

**Known warnings** (non-fatal):
- `[DEP0205] DeprecationWarning: module.register() is deprecated` — from Vite internals, not a test failure
- `localStorage` not available in Node 26 without `--localstorage-file` — handled by polyfill in `setup.ts`

### E2E — Selenium
```bash
cd /Users/jessebias/dev/portfolio/portfolio-blog/e2e
npm install
ADMIN_EMAIL=x ADMIN_PASSWORD=y npm test
```
- **Requires**: both dev servers running (`npm run dev` from root), Chrome + chromedriver on PATH
- **Config**: `jest.config.js` (`testEnvironment: 'node'`, `testTimeout: 30000`)
- **Test file**: `e2e/userFlows.test.js` (6 test cases)
- **Do not run E2E in CI** without live servers — skip and note in REVIEW.md

## How to write REVIEW.md

Write to `/Users/jessebias/dev/portfolio/portfolio-blog/REVIEW.md`:

```markdown
# Test Review
**Date:** YYYY-MM-DD

## Backend (Jest + Supertest)
- Suites: X passed, Y failed
- Tests: X passed, Y failed
- Coverage: X% statements / Y% branches
- Errors: [list any, or "None"]

## Frontend (Vitest + RTL)
- Suites: X passed, Y failed
- Tests: X passed, Y failed
- Errors: [list any, or "None"]

## E2E (Selenium)
- Status: Not executed (requires live servers) / Executed
- Files present: [list]
- Results: [if run]

## Coverage Summary
| File | Statements | Branches | Notes |
|------|-----------|----------|-------|

## Failing Tests
[Detail each failure: file, test name, error message, likely cause]

## Gaps
[Tests missing for new features, if any]

## Overall Status
PASS / FAIL
```

## What to check beyond pass/fail
1. **No new untested routes** — cross-reference `backend/routes/` files against `backend/__tests__/` coverage
2. **No new unwired UI** — check if new frontend components have corresponding MSW handlers and test assertions
3. **Mock accuracy** — verify mocked DTO shapes still match real DTO output (see `backend-specialist.md`)
4. **E2E selector drift** — if login form or page text changed, note that E2E selectors in `userFlows.test.js` may need updating
5. **Coverage regression** — flag if statement coverage drops below 65% on backend or branches below 50%

## Common failure causes
| Symptom | Likely cause |
|---------|-------------|
| `Missing API key` on contact tests | `process.env.RESEND_API_KEY` not set before test import |
| JWT verify fails in backend tests | `process.env.JWT_SECRET = 'test-secret'` must be set before importing app |
| Frontend `localStorage` undefined | Node 26 issue — polyfill in `setup.ts` should handle it |
| MSW handler not matching | Check request URL — Vite proxy strips `/api` prefix only in browser, not in jsdom tests |
| Blogs test title case mismatch | CSS `text-transform: uppercase` is visual only — DOM text is as written in JSX |

## Test Dashboard (`tools/test-dashboard.html`)
Live coverage viewer — open in browser while backend is running. Requires JWT auth.

**Endpoints** (added to `backend/routes/metaRouter.js`):
- `GET /api/meta/tests/coverage` (admin JWT) — reads coverage-summary.json files from `backend/coverage/` and `frontend/coverage/`
- `POST /api/meta/tests/run` (admin JWT) — runs `npm test` in specified suite (backend/frontend), returns raw output

**How to use**:
1. Run coverage: `cd backend && npm run test:coverage && cd ../frontend && npm run test:coverage`
2. Open `tools/test-dashboard.html` in browser
3. Login with admin credentials
4. Click REFRESH to load coverage data
5. Click RUN to execute a test suite and see output in terminal panel
