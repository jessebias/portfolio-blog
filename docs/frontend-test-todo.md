# Frontend test TODO

## BlogPreview.test.tsx — RESOLVED (2026-06-22)

The 9 failing tests (`useI18n must be used within LanguageProvider`) are fixed.

**Fix applied:**
- `frontend/src/test/renderWithProviders.tsx` now wraps children in
  `LanguageProvider` (inside `MemoryRouter`, alongside `AuthProvider`), so any
  component calling `useI18n()` renders correctly.
- `frontend/src/test/BlogPreview.test.tsx` assertions were rewritten to match
  the i18n component output: empty slots render `t.blog.samples[i].title`
  (e.g. "Building an AI-Native Company OS") instead of the old
  `ENTRY_00X_NULL` placeholders; post titles render verbatim
  ("First Blog Post"); meta renders as `category • date`
  (e.g. "Technology • January 2025").

**Status:** `npm test` — 9 suites / 65 tests, all green.

## Stale agent doc — RESOLVED (2026-06-22)

`.claude/agents/frontend-specialist.md` updated: test count corrected to
65 tests / 9 suites, the `test/` listing now includes all suites, the
`renderWithProviders` line notes `LanguageProvider`, and the `Blog.tsx`
description reflects i18n sample entries (no longer `ENTRY_00X_NULL`).
