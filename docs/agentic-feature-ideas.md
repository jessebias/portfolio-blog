# Agentic Feature Ideas — Portfolio Showcase

A menu of AI/agentic features to add to the portfolio site to demonstrate AI engineering ability. Decision pending — this doc captures the options so we can pick later.

## Fixed decisions so far

- **Goal:** impress recruiters / clients (clear signal of AI engineering skill).
- **Infra:** reuse existing PostgreSQL (add `pgvector` only where retrieval is needed); no external vector DB.
- **LLM provider:** Claude (Anthropic).
- **Generation model:** `claude-haiku-4-5` — fast + cheap for a public, traffic-exposed endpoint; plenty capable for grounded tasks. Keep `claude-opus-4-8` behind a config flag for quality-sensitive paths.
- **Embeddings (only for RAG-based ideas):** Anthropic has no embeddings endpoint — use Voyage AI (`voyage-3`, Anthropic's recommended partner). pgvector itself is provider-agnostic. OpenAI `text-embedding-3` is an alternative if we'd rather not add a vendor.

## Stack context

- **Frontend:** React 19 SPA, React Router v7, Vite. Aesthetic: scramble/glitch text effect (`useScramble`), Lenis smooth scroll, terminal-style BootScreen.
- **Backend:** Express 5 + PostgreSQL via `pg` (no ORM). Pattern: `routes/ → controllers/ → models/`. Resend SDK already wired for contact-form email.
- **Relevant existing pieces to reuse:** `Blog` model (`getAll`/`findById`), `contactRouter` (Resend), JWT auth, `seedDb.js` (idempotent seed pattern), Vite proxy `/api/* → :3000`.
- **Orchestration interest:** an `aria` agents directory exists alongside the repo — multi-agent/swarm work is an apparent specialty worth leaning into.

## Universal guardrails (any public LLM endpoint)

- Per-IP rate limit (e.g. `express-rate-limit`).
- Cap `max_tokens`.
- API key stays server-side only — browser never sees it; all calls proxied through Express.
- New `.env` vars as needed: `ANTHROPIC_API_KEY`, `VOYAGE_API_KEY`.

---

## The ideas

### 1. Jailbreak CTF — "Can you trick my agent?" *(current front-runner)*

**What it is:** A game. An AI guard protects a secret code ("flag") and is instructed never to reveal it. Visitors try to prompt-inject / social-engineer it into leaking the code. When they succeed, they "capture the flag."

**Why it impresses:** Playful and *shareable* (people pass it around — "bet you can't break this"). Signals understanding of AI *security*, not just AI features — a rarer, more valuable skill. Fits the security-leaning context.

**Difficulty:** **Low** — one of the easiest on this list. No embeddings, no vector DB, no retrieval. Core = one Claude call with a guarding system prompt + a check for whether the secret leaked. Conversation history can live in the browser; the basic version needs no database.

**Core pieces:**
- Backend: `POST /api/ctf/chat` — single streaming Claude call. Reuses the shared Anthropic client.
- Frontend: chat panel in the glitch aesthetic + a "🚩 You cracked it!" win state.

**The interesting decision — leak detection:**
- *Naive:* string-match the secret in the reply (misses spelled-out / encoded / poemed leaks).
- *Robust:* a second Claude call as an **LLM-as-judge** — "Did this response reveal the secret in any form?" Real LLM-engineering pattern; good interview talking point. Ship naive first, add the judge.

**What makes it a portfolio piece — levels (the attack/defense ladder):**
- Level 1 — naive guard, cracks easily (everyone gets a win).
- Level 2 — guard warned about common tricks ("ignore previous instructions").
- Level 3 — guard + LLM judge screening its own output before sending.

**Optional scoreboard:** the only part that touches Postgres — store winners + the jailbreak prompts that worked (also fun content to show off).

**Effort:**
- MVP (1 guard, browser-side history, string-match win, styled chat): ~half a day.
- Polished (3 levels, LLM-judge detection, Postgres scoreboard): ~1–2 days.

**Open questions:** How many levels for v1 (3 recommended vs 1 to start)? Scoreboard in v1 (Postgres) or keep stateless?

---

### 2. Job-Fit Analyzer — the recruiter-killer

**What it is:** A recruiter pastes a **job description**. The agent maps Jesse's actual experience against each requirement, scores the fit, honestly flags gaps, and drafts a tailored "why Jesse fits this role" pitch — streaming, with citations to real projects.

**Why it impresses:** Does the recruiter's actual job *for* them, on the spot. Active and memorable rather than a passive "ask me anything" widget. Directly serves the stated goal (impress recruiters).

**Difficulty:** Medium. Needs the same retrieval backend as the RAG idea (pgvector + embeddings over blog posts + an "about Jesse" doc), but the framing/UX is the differentiator.

**Stack fit:** New agent vertical mirroring `routes → controllers → models`; reuses embeddings infra. Can share infrastructure with idea #6 (RAG).

---

### 3. Agent Reasoning Theater — the depth flex

**What it is:** A visitor gives a goal; they watch a **multi-agent system** work it live — decompose → plan → fan out to sub-agents → execute tools → synthesize — with the plan/DAG and tool calls rendered on screen. Shows the "kitchen," not just the finished meal.

**Why it impresses:** Highest technical signal. Letting someone *watch* a swarm coordinate in real time is the strongest "I build agents, not just call APIs" statement. Direct manifestation of the `aria` orchestration work.

**Difficulty:** **High** — highest ceiling, most work. The portfolio centerpiece.

**Note:** Could share infra with #2 — Job-Fit ships first/fast, Reasoning Theater becomes the centerpiece later.

---

### 4. Generative UI Sandbox — the flashy one

**What it is:** Visitor describes a component ("a pricing card with a glitch hover effect"); the agent generates it and **live-renders it sandboxed** in the site's aesthetic.

**Why it impresses:** Pure wow; reads as "AI engineer who ships UI." Moderate depth.

**Difficulty:** Medium. Needs a safe sandbox (iframe) for rendering generated code.

---

### 5. Self-Personalizing Portfolio — the subtle one

**What it is:** On load, the agent asks the visitor's role/industry (or reads a pasted JD) and **re-orders + re-themes** the work to foreground what's relevant — a fintech recruiter sees fintech work first, framed in their language.

**Why it impresses:** Ambient AI woven into the site itself rather than bolted on as a widget.

**Difficulty:** Medium.

---

### 6. "Ask My Portfolio" RAG agent — the classic *(deprioritized)*

**What it is:** A streaming, tool-using chat that answers questions about Jesse, grounded in real content, with citations and real tools (`search_content`, `get_recent_posts`, `send_contact_message` via existing Resend).

**Why it was deprioritized:** Strong technically (retrieval + tool use + streaming), but "chat with my portfolio" is common — recruiters have seen many. The Job-Fit Analyzer (#2) reuses the same backend with a more memorable, active framing.

**Difficulty:** Medium. Full RAG backend: `pgvector` table, chunk + embed script (`scripts/embedContent.js`, idempotent like `seedDb.js`), `POST /api/agent/chat` (SSE) running the tool-runner loop, `EmbeddingModel.searchSimilar` using pgvector's `<=>` cosine operator.

**Reusable infra for #2 and #3.** If we ever want retrieval, this backend is the foundation.

---

## Lighter / supporting ideas

- **Semantic blog search** — natural-language search ("posts about latency optimization") over embeddings. Lower effort; reuses RAG infra. Could augment the existing `GET /api/blogs` preview.
- **Live tool-use demo** — a small agent with real tools (web search, etc.) so visitors play with tool-calling and see `🔧 tool → result` traces.
- **Self-maintaining site log** — tie in the `aria` agent: a public read-only log of autonomous tasks it ran ("drafted a blog summary," "categorized a new post"). Meta and memorable.

---

## Quick ranking (against "impress recruiters")

1. **Job-Fit Analyzer** — directly serves recruiters.
2. **Agent Reasoning Theater** — highest technical signal.
3. **Jailbreak CTF** — most shareable + security signal; lowest effort. *(Current lean.)*

Job-Fit (#2) and Reasoning Theater (#3) can share infrastructure: ship Job-Fit first and fast, grow Reasoning Theater into the centerpiece.
