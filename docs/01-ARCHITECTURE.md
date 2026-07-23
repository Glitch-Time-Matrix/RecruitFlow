# 01 — System Architecture

## 1. Where the project is today (honest current-state analysis)

I read the existing codebase in full. Here is exactly what exists:

| Area | Current reality | Production implication |
|------|-----------------|------------------------|
| Framework | **Vite** + React 19 SPA (`src/App.tsx`) | Must migrate to **Next.js** (client's mandated stack) |
| Routing | Client-side via `useState<PageView>` — not real URLs | No deep links, no SEO for jobs, no `/dashboard/*` routes. Needs file-based routing |
| Backend | `server.ts` — Express dev server | Replaced by Next.js server actions/route handlers + Supabase |
| Data storage | **In-memory arrays** (`SUBMITTED_CANDIDATES`, etc.) | **Data is lost on every restart.** Not persistence. Needs PostgreSQL |
| File uploads | **Simulated** — `simulateFileUpload()` saves only the filename | No real file is ever stored. Needs Supabase Storage |
| Auth | None | Needs Supabase Auth for internal users |
| AI features | Gemini endpoints (`/api/match-candidate`, `/api/employer-pipeline`) | **Not** in the target stack. See decision in doc 06 |
| Forms | `CandidateRegistrationForm`, `EmployerHiringRequestForm`, `GeneralContactForm` POST to `/api/*` | Good news: field shapes already exist in `src/types.ts` and map cleanly to DB tables |

**Key takeaway:** the *design and UX are done and approved* — those React/Tailwind components are
directly reusable. What's missing is **everything that makes it a system**: persistence, auth,
permissions, real files, and the internal dashboard. That's the actual project.

## 2. Target architecture

A **single Next.js (App Router) application** deployed to Vercel, backed by one Supabase project.

```
┌──────────────────────────────────────────────────────────────────────┐
│                     Next.js App (Vercel)                               │
│                                                                        │
│   (public)  ── no auth ──────────────┐   (dashboard) ── auth required ─┐
│   / (home)                           │   /dashboard                    │
│   /about /services /industries       │   /dashboard/candidates         │
│   /jobs        (SSR/ISR, SEO)        │   /dashboard/employers          │
│   /jobs/[id]   (SSR/ISR)             │   /dashboard/jobs               │
│   /candidates  (intake form)         │   /dashboard/applications       │
│   /employers   (intake form)         │   /dashboard/resume-builder     │
│   /contact                           │   /dashboard/settings (users)   │
│                                      │                                 │
│   Server Actions / Route Handlers  ──┴──── Server Actions ─────────────┘
│           │                                        │
└───────────┼────────────────────────────────────────┼──────────────────┘
            │                                        │
            ▼                                        ▼
   ┌─────────────────────────── Supabase ───────────────────────────┐
   │  PostgreSQL (data + Row-Level Security)                         │
   │  Auth (internal users only: super_admin / admin / recruiter)    │
   │  Storage (private buckets: photos, resumes, logos, JDs, docs)   │
   │  Edge Functions (optional: PDF generation, notifications)       │
   └────────────────────────────────────────────────────────────────┘
```

### Why one app instead of two

- **Client ownership & simplicity** — one repo, one deploy, one thing to maintain. A small agency
  should not juggle multiple services.
- **Shared types & code** — the `Job` shape used on the public listings page is the same record the
  dashboard publishes. One source of truth.
- **Route groups** cleanly separate concerns: `app/(public)/...` and `app/(dashboard)/...`, with
  auth enforced by Next.js **middleware** on the dashboard group only.

## 3. Technology decisions

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Framework | **Next.js 15 (App Router)** | Mandated; gives SSR/ISR for public SEO + server actions for secure DB writes |
| Language | **TypeScript** | Already in use; type-safety across DB → UI |
| Styling | **Tailwind CSS v4** | Already in use — design ports over unchanged |
| UI kit (dashboard) | **shadcn/ui** | Mandated; accessible primitives for tables, dialogs, forms — used **only in the dashboard**, public site keeps its bespoke look |
| Database | **Supabase PostgreSQL** | Mandated; relational model fits recruitment perfectly; RLS = security in the DB |
| Auth | **Supabase Auth** | Mandated; internal users only in V1 |
| Files | **Supabase Storage** | Mandated; private buckets + signed URLs |
| Validation | **Zod** | One schema validates form input on server *and* types the client |
| Data access | **Supabase JS client** (server-side with RLS) + typed queries | Least-privilege; RLS is the safety net |
| Hosting | **Vercel** | Mandated; native Next.js host, preview deploys per PR |
| Source control | **GitHub** | Mandated; client-owned repo |
| Email (new) | **Resend** (recommended) | Confirmation + notification emails — see doc 06 |

### On the existing Gemini AI features
They are **not** part of the mandated stack and **not** required by the brief. Recommendation:
**park them for V1** (keep the code in a branch), and revisit as a "smart matching" add-on in a later
version. Rebuilding them is cheap later; shipping the core RMS securely is the priority now.

## 4. Migration strategy (design-preserving)

The public design must survive untouched. The plan:

1. **Scaffold** a fresh Next.js App-Router project alongside the current code.
2. **Port components 1:1** — `Hero`, `Features`, `SocialProof`, `Header`, footer, all page bodies —
   into `app/(public)/`. They are plain React + Tailwind; they move with near-zero visual change.
3. **Convert routing** — the `useState<PageView>` switch in `App.tsx` becomes real routes
   (`/`, `/about`, `/services`, `/industries`, `/jobs`, `/candidates`, `/employers`, `/contact`).
   Navigation handlers become `<Link>`s. This is the main mechanical change.
4. **Rewire forms** — the three forms keep their exact markup; their `fetch("/api/...")` calls become
   **server actions** that validate with Zod and write to Supabase (including real file uploads).
5. **Job listings go live from the DB** — `/jobs` and `/jobs/[id]` render published jobs from
   Postgres via ISR, replacing the mock `INITIAL_JOBS` / `ACTIVE_JOBS` arrays.
6. **Build the dashboard** as a new `app/(dashboard)/` zone from scratch on shadcn/ui.

A visual regression pass (side-by-side against the current site) gates the migration as "done."

## 5. Environments & ownership

- **Three environments:** local (dev), Preview (Vercel per-PR), Production.
- **Two Supabase projects** recommended: `recruitflow-staging` and `recruitflow-prod`, so schema
  changes are tested before touching real client data.
- **All accounts created under the client's ownership** (GitHub org, Vercel team, Supabase org) from
  day one — see [Security & RBAC](./03-SECURITY-RBAC.md#client-ownership) for the anti-lock-in plan.

## 6. Repository shape (target)

```
/app
  /(public)              # marketing + intake, no auth
    /page.tsx            # home
    /about/page.tsx
    /jobs/page.tsx        /jobs/[slug]/page.tsx
    /candidates/page.tsx  # candidate intake form
    /employers/page.tsx   # employer hiring request form
    /contact/page.tsx
  /(dashboard)
    /layout.tsx          # auth guard + shell
    /candidates/...      /employers/...  /jobs/...  /applications/...
    /resume-builder/...  /settings/...
  /api                   # webhooks/route handlers where needed
/components
  /ui                    # shadcn/ui (dashboard)
  /public                # ported marketing components
/lib
  /supabase              # server & browser clients
  /auth                  # session, role helpers
  /validation            # Zod schemas (shared)
  /db                    # typed queries
/supabase
  /migrations            # SQL schema, versioned
  /policies              # RLS policies
/docs                    # these planning docs
```
