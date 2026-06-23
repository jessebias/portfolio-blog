# Frontend Specialist

> **Self-update rule**: If you modify anything in `frontend/src/` — components, pages, API layer, context, hooks, routes, or test setup — update this file to reflect the change before finishing your task. This file is the source of truth for future frontend agents.

## Stack
- **Framework**: React 19
- **Language**: TypeScript (`~5.9.3`)
- **Build**: Vite 7 (`"type": "module"`)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **HTTP**: Axios (relative paths only — Vite proxies `/api/*` → `http://localhost:3000`)
- **Smooth scroll**: Lenis
- **Auth decode**: `jwt-decode`
- **Tests**: Vitest + React Testing Library + MSW

## Project root
`/Users/jessebias/dev/portfolio/portfolio-blog/frontend/`

## File map
```
frontend/src/
├── main.tsx                        # Router setup, all routes, AuthProvider wrapper
├── index.css                       # Tailwind directives + CSS vars + keyframes
├── api/
│   ├── auth.ts                     # login(), register() (register hits disabled endpoint)
│   └── blogs.ts                    # getBlogs, getBlogById, createBlog, updateBlog, deleteBlog
├── components/
│   ├── Layout.tsx                  # Lenis init, Navbar + Outlet + Footer + scroll-to-top
│   ├── Navbar.tsx                  # Fixed nav, scramble on hover, Lenis hash scroll
│   ├── Footer.tsx                  # Social links, copyright
│   ├── Hero.tsx                    # Full-screen video bg, name + subtitle
│   ├── About.tsx                   # Headshot, bio, SocialLinks
│   ├── Works.tsx                   # Tabbed portfolio (web/music/film/photo) + WorkModal; cards use shared chromeEdge bevel
│   ├── WorkModal.tsx               # Project detail overlay
│   ├── Blog.tsx                    # Home preview — fetches 4 latest posts, placeholders for gaps
│   ├── Tools.tsx                   # Tiered tech grid: Engineering / AI Systems (emphasis) / Mobile + Web3; data-driven, Simple Icons CDN logos w/ text-card fallback; outer panel wears the chromeEdge bevel
│   ├── Contact.tsx                 # Form → POST /api/contact, success/error feedback; modal wears the chromeEdge bevel
│   ├── SocialLinks.tsx             # Reusable social icon links
│   ├── BootScreen.tsx              # Terminal intro animation (sessionStorage — once per session)
│   ├── ScrollToHash.tsx            # Deferred hash navigation for same/cross-page anchors
│   ├── PrivateRoute.tsx            # Requires isLoggedIn + isAdmin; else → /login or /
│   ├── ProtectedRoute.tsx          # Requires isLoggedIn; else → /login
│   └── ui/
│       ├── Button.tsx              # Scramble hover effect, renders <Link> or <button>
│       └── chromeEdge.ts           # chromeEdge(strength) → CSSProperties: masked-gradient metallic bevel ring; shared by Works/Tools/Contact
├── context/
│   └── AuthProvider.tsx            # JWT context (see Auth section below)
├── hooks/
│   └── useScramble.ts              # Glitch text animation hook
├── pages/
│   ├── Home.tsx                    # Composes all home sections + BootScreen state
│   ├── Login.tsx                   # Login form → POST /api/auth/login → navigate /admin
│   ├── AdminDashboard.tsx          # Full CRUD for blogs + user list (all wired to API)
│   ├── Blogs.tsx                   # Blog listing grid → GET /api/blogs
│   ├── BlogPost.tsx                # Single post → GET /api/blogs/:id
│   ├── Profile.tsx                 # Shows user from AuthProvider context
│   └── NotFound.tsx                # 404 page
└── test/
    ├── setup.ts                    # @testing-library/jest-dom + localStorage polyfill
    ├── handlers.ts                 # MSW handlers (GET /api/blogs, GET /api/blogs/:id, POST /api/auth/login)
    ├── server.ts                   # MSW server setup (beforeAll/afterEach/afterAll)
    ├── renderWithProviders.tsx     # MemoryRouter + LanguageProvider + AuthProvider wrapper
    ├── AuthProvider.test.tsx
    ├── ProtectedRoute.test.tsx
    ├── PrivateRoute.test.tsx
    ├── Blogs.test.tsx
    ├── BlogPost.test.tsx
    ├── BlogPreview.test.tsx
    ├── AdminDashboard.test.tsx
    ├── api.blogs.test.ts
    └── Login.test.tsx
```

> Components using `useI18n()` must be rendered via `renderWithProviders` (which now wraps `LanguageProvider`), or they throw `useI18n must be used within LanguageProvider`.

## Routes (`main.tsx`)
```
/              → <Home>
/works         → <Home>
/about         → <Home>
/contact       → <Home>
/blogs         → <Blogs>
/blogs/:id     → <BlogPost>
/login         → <Login>
/profile       → <ProtectedRoute> → <Profile>    (login required)
/admin         → <PrivateRoute>   → <AdminDashboard>  (admin required)
*              → <NotFound>
```

## Auth context (`context/AuthProvider.tsx`)
```ts
interface AuthContextType {
  token: string | null
  user: { id: number; name: string; email: string; role: string; exp: number } | null
  isLoggedIn: boolean        // !!user
  isAdmin: boolean           // user?.role === 'admin'
  isLoading: boolean         // true while decoding token on first render
  login(token: string, userData: User): void   // sets localStorage + state
  logout(): void             // clears localStorage + state
}
```
- JWT stored as `localStorage.getItem('token')`
- Decoded with `jwtDecode` on mount; expired tokens trigger `logout()` automatically
- JWT payload: `{ id, email, role, exp }`

## Route guards
- `PrivateRoute`: `!isLoggedIn` → `/login`; `isLoggedIn && !isAdmin` → `/`
- `ProtectedRoute`: `!isLoggedIn` → `/login`

## API layer (`frontend/src/api/`)

### auth.ts
```ts
login(email, password)   // POST /api/auth/login → { token, user, message }
register(userData)       // POST /api/auth/create-account (disabled on backend)
```

### blogs.ts
```ts
export interface Blog {
  id: number
  title: string
  category?: string | null
  image_url?: string | null
  content: string
  createdAt?: string       // camelCase — matches BlogDTO response
  updatedAt?: string
  author?: { id: number; name: string; email: string; role: string; createdAt: string }
}

getBlogs()                      // GET /api/blogs — no auth
getBlogById(id)                 // GET /api/blogs/:id — no auth
createBlog(blogData)            // POST /api/blogs — auto-attaches Bearer token
updateBlog(id, blogData)        // PUT /api/blogs/:id — auto-attaches Bearer token
deleteBlog(id)                  // DELETE /api/blogs/:id — auto-attaches Bearer token
```
`getAuthHeaders()` reads `localStorage.getItem('token')` — used internally by mutating methods.

## AdminDashboard wiring
- Mount: `getBlogs()` → `setPosts`; `axios.get('/api/meta/users')` → `setUsers`
- Create: `createBlog({ title, category, content })` — `image_url` pending S3 wiring
- Edit: click EDIT → pre-fills form, scrolls to top, sets `editingPost` state; submit calls `updateBlog(id, ...)`
- Delete: `deleteBlog(id)` with `window.confirm`; removes from local state on success
- Content editor: `contentEditable` div with `ref` — initialized via `useEffect`, not `dangerouslySetInnerHTML`

## Key UI patterns
- **Scramble effect**: `useScramble.ts` — `setInterval` replaces chars with random UPPERCASE until resolved. Used in `Navbar`, `Login`, `ui/Button`.
- **BootScreen**: shown if `sessionStorage.getItem('booted')` is falsy; sets it on completion.
- **Blog home preview** (`Blog.tsx`): fetches 4 latest posts, fills grid. Slots without a post show i18n sample entries (`t.blog.samples[i]`), not the old `ENTRY_00X_NULL` placeholders. Meta renders as `category • date`. Errors are swallowed silently.
- **Lenis**: initialized in `Layout.tsx` `useEffect`; `Navbar.tsx` calls `lenis.scrollTo('#section-id')`.
- **Chrome bevel** (`ui/chromeEdge.ts`): `chromeEdge(strength)` returns inline `CSSProperties` for a masked-gradient metallic edge ring (uses `--chrome1/2/3` vars). Apply by dropping an absolutely-positioned, `pointer-events-none` `z-30` div whose rounded-* radius matches its container, with `style={chromeEdge(n)}`; the container needs `relative overflow-hidden`. Used on Works cards (strength `0.58` center / `0.26` sides), the Tools panel, and the Contact modal (`0.45`).

## Test setup
- **Config**: `vite.config.ts` imports `defineConfig` from `vitest/config` (NOT `vite`) so the `test` block type-checks under `tsc -b` during `npm run build`. Importing from `vite` makes `tsc` reject the `test` key (TS2769).
- **Framework**: Vitest (`globals: true`, `environment: 'jsdom'`)
- **Setup file**: `src/test/setup.ts` — imports `@testing-library/jest-dom`, polyfills `localStorage` for Node 26
- **MSW**: `src/test/server.ts` — `setupServer(...handlers)`, `beforeAll/afterEach/afterAll`
- **Render helper**: `renderWithProviders(ui, { initialEntries })` — wraps in `MemoryRouter` + `AuthProvider`
- **Valid JWT for tests**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.signature` (exp: year 2286, role: admin)
- **Current coverage**: 65 tests, 9 suites, all passing

## npm scripts
```bash
npm run dev            # vite (port 3001)
npm run build          # tsc -b && vite build
npm run lint           # eslint .
npm test               # vitest run
npm run test:watch     # vitest
npm run test:coverage  # vitest run --coverage
```

## Conventions
- All API calls use relative paths (`/api/...`) — never hardcode `localhost:3000`
- Mutating blog API calls always use `getAuthHeaders()` — never pass token manually
- `contentEditable` editors: initialize via `useEffect` into `ref.current.innerHTML`, never use `dangerouslySetInnerHTML` on the same element
- TypeScript strict mode — avoid `any` except where explicitly needed (e.g. user management from untyped meta endpoint)
- Tailwind v4 class syntax — use `border-white/8` not `border-opacity-8`; use `bg-[#050505]` for custom colours
