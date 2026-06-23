# E2E Specialist

> **Self-update rule**: If you modify any user-facing routes, page content, auth behaviour, or redirect logic in the frontend or backend, update this file to reflect the change before finishing your task. This file is the source of truth for future E2E agents.

## Stack
- **Driver**: Selenium WebDriver 4 (`selenium-webdriver`)
- **Test runner**: Jest 29 (CommonJS — no `"type": "module"` in e2e/package.json)
- **Browser**: Chrome (headless via `chrome.Options().addArguments('--headless=new')`)
- **Env**: credentials via `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD`

## Project root
`/Users/jessebias/dev/portfolio/portfolio-blog/e2e/`

## Files
```
e2e/
├── package.json          # CommonJS, jest ^29, selenium-webdriver ^4, dotenv
├── jest.config.js        # testEnvironment: node, testTimeout: 30000, forceExit: true
├── userFlows.test.js     # All E2E test cases
└── README.md             # Prerequisites and run instructions
```

## Prerequisites (must be running before tests)
- Frontend dev server: `http://localhost:3001`
- Backend dev server: `http://localhost:3000`
- Chrome + matching chromedriver installed and on PATH
- Admin credentials set as env vars (or in a `.env` file in `e2e/`)

## Run command
```bash
cd e2e && npm install
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm test
```

## Application URLs
| Path | Description |
|------|-------------|
| `http://localhost:3001/` | Home page |
| `http://localhost:3001/login` | Login form |
| `http://localhost:3001/admin` | Admin dashboard (requires admin JWT) |
| `http://localhost:3001/blogs` | Blog listing |
| `http://localhost:3001/blogs/:id` | Single blog post |
| `http://localhost:3001/profile` | Profile page (requires any JWT) |

## Auth and redirect behaviour
- Successful login → redirected to `/admin`
- Failed login → error shown inline, stays on `/login`
- Unauthenticated visit to `/admin` → redirected to `/login`
- Unauthenticated visit to `/profile` → redirected to `/login`
- Authenticated non-admin visit to `/admin` → redirected to `/`
- JWT stored in `localStorage` under key `"token"` — clear with `driver.executeScript('localStorage.clear()')`

## Login form selectors
- Email input: `input[type="email"]` or by placeholder `USER@PORTFOLIO.SYS`
- Password input: `input[type="password"]` or by placeholder `••••••••`
- Submit button: contains text `ACCESS SYSTEM`
- Error message: rendered in a `div` with Tailwind class `bg-red-500/5`
- Loading state: button text changes to `INITIALIZING...`

## Key page content to assert
| Page | Assert |
|------|--------|
| Login | "SYSTEM AUTHENTICATION REQUIRED" |
| Admin | "CREATE NEW POST", "MANAGE POSTS", "USER MANAGEMENT" |
| Blogs | `h1` with text "BLOG" |
| BlogPost | "RETURN TO BLOG" back link |
| Home | "JESSE BIAS" heading |

## Test cases in userFlows.test.js
1. **Login success** — fill credentials → click ACCESS SYSTEM → assert URL contains `/admin`
2. **Login failure** — wrong credentials → assert error visible, URL still `/login`
3. **Blogs page load** — navigate to `/blogs` → assert "BLOG" heading, cards or empty state
4. **Blog post navigation** — click first blog card link → assert URL matches `/blogs/\d+`, assert "RETURN TO BLOG" visible (skips gracefully if no posts)
5. **Admin route guard** — clear localStorage → navigate to `/admin` → assert redirect to `/login`
6. **Profile route guard** — clear localStorage → navigate to `/profile` → assert redirect to `/login`

## Driver setup pattern
```js
const options = new chrome.Options();
options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage');
driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
```

## Wait strategy
- Use `driver.wait(until.urlContains('/target'), 5000)` for navigation assertions
- Use `driver.wait(until.elementLocated(By.css('selector')), 5000)` for element waits
- Avoid `driver.sleep()` except for API-dependent content (max 2000ms)

## afterEach cleanup
```js
await driver.executeScript('localStorage.clear()');
```
This resets auth state between tests reliably since JWT lives in `localStorage.token`.
