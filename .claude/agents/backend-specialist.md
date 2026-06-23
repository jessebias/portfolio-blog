# Backend Specialist

> **Self-update rule**: If you modify anything in `backend/` — routes, controllers, models, DTOs, middleware, scripts, config, or test setup — update this file to reflect the change before finishing your task. This file is the source of truth for future backend agents.

## Stack
- **Runtime**: Node.js (ESM — `"type": "module"` in package.json)
- **Framework**: Express 5
- **Database**: PostgreSQL via `pg` Pool (no ORM)
- **Auth**: `jsonwebtoken` + `bcryptjs`
- **Email**: Resend SDK
- **Validation**: `validator`
- **Dev**: Nodemon
- **Tests**: Jest + Supertest + Babel (see Test Setup below)

## Project root
`/Users/jessebias/dev/portfolio/portfolio-blog/backend/`

## File map
```
backend/
├── index.js                        # Server entry — imports routes, calls connectDB(), listens
├── config.js                       # Exports PORT, DB_*, JWT_SECRET, JWT_EXPIRES_IN from process.env
├── controllers/
│   ├── auth.js                     # login handler (register exists but route is disabled)
│   └── blogController.js           # getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog
├── db/
│   └── dbconn.js                   # Exports pool (pg.Pool) and connectDB()
├── dtos/
│   ├── BlogDTO.js                  # BlogDTO, BlogListDTO
│   └── UserDTO.js                  # UserDTO (UserListDTO removed — unused)
├── middleware/
│   └── auth-middleware.js          # authenticateToken, authorizeAdmin
├── models/
│   ├── Blog.js                     # create, getAll, findById, update, delete
│   └── User.js                     # create, findByEmail, findById, getAll, update, delete
├── routes/
│   ├── authRouter.js               # POST /login only (create-account commented out)
│   ├── blogsRouter.js              # GET /, GET /:id, POST /, PUT /:id, DELETE /:id
│   ├── contactRouter.js            # POST /
│   └── metaRouter.js              # GET /schema/:table, GET /users, GET /tests/coverage, POST /tests/run
├── scripts/
│   ├── initDb.js                   # Runs setup-db.sql — drops and recreates tables
│   ├── seedDb.js                   # PostgreSQL admin seeder — reads ADMIN_* from .env
│   └── setup-db.sql                # CREATE TABLE users, blogs
└── __tests__/
    ├── app.js                      # Testable Express app (no listen, no connectDB)
    ├── helpers.js                  # TEST_SECRET, makeAdminToken(), makeUserToken()
    ├── auth.test.js
    ├── blogs.test.js
    ├── meta.test.js
    └── contact.test.js
```

## Route map

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| POST | /api/auth/login | — | auth.login |
| GET | /api/blogs | — | blogController.getAllBlogs |
| GET | /api/blogs/:id | — | blogController.getBlog |
| POST | /api/blogs | authenticateToken, authorizeAdmin | blogController.createBlog |
| PUT | /api/blogs/:id | authenticateToken, authorizeAdmin | blogController.updateBlog |
| DELETE | /api/blogs/:id | authenticateToken, authorizeAdmin | blogController.deleteBlog |
| POST | /api/contact | — | contactRouter inline |
| GET | /api/meta/schema/:table | — | metaRouter inline |
| GET | /api/meta/users | authenticateToken | metaRouter inline |
| GET | /api/meta/tests/coverage | authenticateToken | metaRouter inline — reads coverage-summary.json |
| POST | /api/meta/tests/run | authenticateToken | metaRouter inline — executes `npm test` in suite |

## DTO shapes

### BlogDTO
```js
{
  id: number,
  title: string,
  content: string,
  category: string | null,
  image_url: string | null,
  author: {
    id: number,
    name: string,
    email: string,
    role: string,
    createdAt: string   // from user.created_at
  },
  createdAt: string,    // from blog.created_at
  updatedAt: string     // from blog.updated_at
}
```

### UserDTO
```js
{ id, name, email, role, createdAt }  // password stripped
```

## Database schema
```sql
users (id SERIAL PK, name VARCHAR(255), email VARCHAR(255) UNIQUE, password TEXT,
       role VARCHAR(50) DEFAULT 'user', created_at TIMESTAMP, updated_at TIMESTAMP)

blogs (id SERIAL PK, title VARCHAR(255), content TEXT, category VARCHAR(255),
       image_url TEXT, user_id → users.id ON DELETE CASCADE,
       created_at TIMESTAMP, updated_at TIMESTAMP)
```

## Auth flow
1. `POST /api/auth/login` → `bcrypt.compare` → `jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })`
2. Protected routes read `Authorization: Bearer <token>` header
3. `authenticateToken` calls `jwt.verify(token, JWT_SECRET)` → sets `req.user`
4. `authorizeAdmin` checks `req.user.role === 'admin'`

## Environment variables (backend/.env)
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=            # Required — no secure default
JWT_EXPIRES_IN=24h
RESEND_API_KEY=        # Resend SDK key
CONTACT_EMAIL=         # Recipient for contact form emails
ADMIN_NAME=            # Used by seed:db
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## npm scripts
```bash
npm run dev            # nodemon index.js
npm run start          # node index.js
npm run db:init        # node scripts/initDb.js  (drops + recreates tables)
npm run seed:db        # node scripts/seedDb.js  (upserts admin from .env)
npm test               # jest --config jest.config.cjs --forceExit
npm run test:coverage  # jest --config jest.config.cjs --coverage --forceExit
```

## Test setup
- **Babel**: `babel.config.cjs` transforms ESM → CJS for Jest
- **Jest config**: `jest.config.cjs` — `testEnvironment: 'node'`, matches `__tests__/**/*.test.js`
- **Mocking pattern**:
  ```js
  process.env.JWT_SECRET = 'test-secret';  // must be set before imports
  jest.mock('../db/dbconn.js', () => ({ pool: { query: jest.fn() }, connectDB: jest.fn() }));
  jest.mock('bcryptjs', () => ({ compare: jest.fn(), hash: jest.fn() }));
  jest.mock('resend', () => ({ Resend: jest.fn().mockImplementation(() => ({
    emails: { send: jest.fn().mockResolvedValue({ data: { id: 'x' }, error: null }) }
  })) }));
  ```
- **Auth in tests**: Generate real JWTs with `makeAdminToken()` / `makeUserToken()` from `helpers.js` (signed with `TEST_SECRET = 'test-secret'`)
- **Current coverage**: ~70% statements, ~59% branches (23 tests, 4 suites)

## Conventions
- All DB access goes through models — controllers never call `pool.query` directly
- All API responses go through DTOs — never return raw DB rows
- `console.error` for all caught errors server-side; never expose raw `err.message` to clients in new code
- ESM throughout (`import`/`export`) — no `require()`
