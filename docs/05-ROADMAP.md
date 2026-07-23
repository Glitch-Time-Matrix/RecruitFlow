# 05 — Implementation Roadmap

Phased so that **something demonstrable and safe ships at the end of every phase**, and the riskiest
foundations (auth, RLS, migration) come first. Estimates assume one focused developer; treat them as
relative sizing, not commitments.

## Phase 0 — Foundations & ownership (setup)
**Goal:** the client owns the accounts; the app skeleton runs.
- Create GitHub repo, Vercel project, Supabase project(s) — **all under the client's ownership.**
- Scaffold Next.js (App Router) + Tailwind + shadcn/ui.
- Wire Supabase clients (server + browser), env management, CI checks (lint/typecheck).
- Set up staging vs. production environments.
- **Exit criteria:** blank app deploys to Vercel from the client's GitHub; Supabase reachable.

## Phase 1 — Public site migration (design-preserving)
**Goal:** the approved site lives on Next.js with real routes, visually identical.
- Port `Header`, `Hero`, `Features`, `SocialProof`, footer, and all page bodies into `(public)` routes.
- Convert `useState` navigation → file-based routing + `<Link>`.
- Visual regression pass vs. current site.
- **Exit criteria:** every current page reachable by URL, pixel-parity approved.

## Phase 2 — Database & security core
**Goal:** the schema and the security backbone exist before any real data flows.
- Author migrations for all tables ([doc 02](./02-DATABASE-SCHEMA.md)); enums, indexes, triggers.
- Turn on **RLS** for every table; implement role + ownership + field-level policies
  ([doc 03](./03-SECURITY-RBAC.md)).
- Storage buckets (private) + Storage policies.
- Seed roles and a super_admin.
- **Exit criteria:** RLS test suite proves recruiters can't read sensitive employer data; admins can.

## Phase 3 — Intake pipeline (public → database)
**Goal:** real submissions persist and land in the system.
- Rewire the three forms to server actions with Zod validation.
- **Real file uploads** (resume, photo, JD) to Storage (replaces the simulated upload).
- Spam protection (honeypot + captcha + rate limit) + dedupe checks.
- **Exit criteria:** a public submission creates DB rows + stored files; nothing is lost on restart.

## Phase 4 — Dashboard core (candidates, employers, auth)
**Goal:** staff can log in and actually work.
- Auth + middleware guard + dashboard shell + role-aware nav.
- Candidate list (search/filter/paginate) + photo-first profile with notes/timeline/status.
- Employer list + profile with **gated sensitive fields**.
- Manual entry for candidates & employers.
- **Exit criteria:** a recruiter logs in, finds a web-submitted candidate, updates status, adds a note.

## Phase 5 — Jobs & applications
**Goal:** the closed loop from employer request to public job to candidate application.
- Hiring-request review queue → approve → **publish job** → appears on public `/jobs` via ISR.
- Applications: public "Apply" + internal pipeline board with stages and history.
- **Exit criteria:** publish a job from an approved request; a candidate applies; it shows in pipeline.

## Phase 6 — Resume builder & documents
**Goal:** the value-add tools.
- Document manager (upload/view via signed URLs, confidential gating).
- Resume builder: editor → template → **PDF** → saved as `generated_resume`.
- **Exit criteria:** generate a resume for a candidate and retrieve it later from their profile.

## Phase 7 — Insights, notifications & hardening
**Goal:** production-ready.
- Overview dashboard metrics (role-scoped).
- Email notifications (confirmations, assignments) — pending provider decision (doc 06).
- Audit log UI, placements + 90-day guarantee tracking.
- Security review, load/perf pass on search, backups/PITR verification, accessibility pass.
- **Exit criteria:** security checklist signed off; docs + handover pack delivered.

## Phase 8 — Launch & handover
- Production data migration (if any existing spreadsheets need importing — see doc 06).
- Staff training + runbook walkthrough.
- Custom domain + monitoring.
- **Full ownership handover** ([doc 03 §8](./03-SECURITY-RBAC.md#client-ownership)).

---

### Sequencing rationale
- **Security before data** (Phase 2 before 3) — we never load real PII into an unprotected DB.
- **Migration early** (Phase 1) — de-risks the "design must be preserved" constraint up front.
- **Riskiest integrations first** — auth + RLS are where projects fail; they lead, not trail.
- Each phase is independently deployable behind the existing public site, so the client sees progress
  continuously rather than in one big-bang reveal.
