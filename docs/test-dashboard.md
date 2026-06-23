# Test Dashboard

Live coverage and test execution viewer. Open `tools/test-dashboard.html` in your browser while the backend is running.

## What it does
- **Coverage viewer**: Displays statement, branch, function, and line coverage for both backend and frontend
- **Test runner**: Execute backend or frontend tests directly from the browser; view output in an integrated terminal
- **Coverage bar charts**: Visual progress bars for each file's coverage metrics
- **File ranking**: Coverage table sorted by statement coverage (lowest first)

## How to use

### View coverage
1. Generate coverage reports:
   ```bash
   cd backend && npm run test:coverage
   cd ../frontend && npm run test:coverage
   ```

2. Open `tools/test-dashboard.html` in your browser

3. Login with your admin credentials

4. Click **REFRESH** to load the coverage JSON files from `backend/coverage/coverage-summary.json` and `frontend/coverage/coverage-summary.json`

### Run tests live
1. Click **RUN** next to Backend or Frontend
2. The dashboard will execute `npm test` in that suite
3. Output appears in the terminal panel below (click **SHOW OUTPUT** to expand)
4. Coverage data is not automatically re-fetched after running `npm test` (because it doesn't generate new coverage files) — run `npm run test:coverage` if you want updated metrics

## How it works
- Frontend: vanilla JavaScript (no build step) — can be opened directly as a file
- Backend API: two new endpoints in `backend/routes/metaRouter.js`:
  - `GET /api/meta/tests/coverage` — reads coverage JSON files
  - `POST /api/meta/tests/run` — executes `npm test` in a suite directory

## Login
Use the same credentials as your admin account:
```
ADMIN_EMAIL=     # from backend/.env
ADMIN_PASSWORD=  # from backend/.env
```

Token is stored in browser `localStorage` for convenience (key: `dbv_token`).
