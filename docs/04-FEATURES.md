# 04 — Features & Workflows

Each feature is written as: **what it does → how it works → what's reused vs. new.**

## PUBLIC SITE (no login)

### P1. Marketing pages (Home, About, Services, Industries, Contact)
- **What:** the approved brand experience, unchanged.
- **How:** existing components ported into Next.js routes; static/ISR rendered for speed + SEO.
- **Reuse:** ~100% of existing markup. **New:** routing + `<Link>` navigation.

### P2. Job listings (`/jobs`) & job detail (`/jobs/[slug]`)
- **What:** public list of open roles; click through to detail; "Apply" CTA.
- **How:** reads **published** `jobs` from Supabase via ISR (revalidates when a job is published).
  Only candidate-safe fields render — **never** employer identity or contact info.
- **Reuse:** `JobsPage`, `ActivePositions` UI. **New:** DB-backed data (replaces mock
  `INITIAL_JOBS`/`ACTIVE_JOBS`), real detail pages with slugs for SEO.

### P3. Candidate intake (`/candidates`)
- **What:** the existing multi-section registration form + resume upload + **profile photo upload**
  (new, client-requested).
- **How:** submit → server action → Zod validation → real file upload to Storage → insert
  `candidate` (+ experience/education/skills/documents) with `source='web'`, `status='new'` →
  confirmation with reference ID (as today) → optional confirmation email.
- **Reuse:** entire `CandidateRegistrationForm` markup + `CandidateRegistration` type.
  **New:** real persistence, real file storage, photo field, dedupe check, spam protection.

### P4. Employer hiring request (`/employers`)
- **What:** existing hiring-requirements form + JD document upload.
- **How:** submit → server action → creates/links `employer` + `employer_contact` + `hiring_request`
  (`status='new'`) → appears in dashboard review queue → optional ack email.
- **Reuse:** entire `EmployerHiringRequestForm` + `EmployerHiringRequest` type. **New:** persistence,
  real JD upload, employer dedupe.

### P5. Apply to a specific job
- **What:** "Apply" from a job detail page.
- **How:** creates an `application` linked to candidate + job + employer. If the applicant is new,
  create the candidate first; if their email matches an existing candidate, link instead.
- **New:** the whole application-linking flow.

### P6. Contact form
- Persists to `contact_messages`, visible in dashboard. Reuses `GeneralContactForm`.

---

## INTERNAL DASHBOARD (agency staff only)

### D1. Authentication & shell
- Supabase Auth login; middleware-guarded `(dashboard)` group; role-aware navigation; profile menu.
- **New**, built on shadcn/ui.

### D2. Overview dashboard
- **What:** operational at-a-glance — new candidates, new hiring requests, pipeline by stage, active
  jobs, applications, placements, recruiter activity.
- **How:** aggregate queries scoped by role (a recruiter sees *their* numbers; owner sees all).
- **New.**

### D3. Candidate management
- **What:** searchable/filterable candidate list + rich profile: **photo**, contact, experience,
  education, skills, resume & documents, notes, recruiter comments, **timeline/activity history**, and
  current recruitment **status**.
- **How:** list uses server-side search (FTS + trigram) and filters (country, experience, skills,
  recruiter, status, industry) with cursor pagination. Profile aggregates the candidate + related
  tables. Status changes and notes write `activities` rows for the timeline.
- **Client-specific:** the **photo-first** layout — recruiters recognize people visually.
- **New.**

### D4. Employer management
- **What:** employer list + profile: company info, hiring requests, active jobs, notes, documents
  (logo/contracts), recruitment history — with **sensitive fields gated** by permission.
- **How:** contact details and contracts come from RLS-protected tables; recruiters without access
  see "🔒 Restricted." (See [field-level security](./03-SECURITY-RBAC.md#field-level-security).)
- **New.**

### D5. Hiring-request review → job publishing
- **What:** review queue of employer submissions → approve/reject → **convert an approved request into
  a published job** that appears on the public site automatically.
- **How:** a "Publish" action creates a `jobs` row (candidate-safe fields only), sets a slug, flips
  `is_published`, and triggers ISR revalidation of `/jobs`. **The dashboard is the single source of
  truth — the public site is never hand-edited.**
- **New.**

### D6. Application & pipeline management
- **What:** move applications through stages (applied → screening → submitted → interview → offer →
  hired/rejected), assign recruiters, add notes, see history per application.
- **How:** Kanban-style board + per-application drawer; stage changes logged to `activities`.
- **New.**

### D7. Manual entry (walk-ins)
- **What:** create candidate/employer/hiring-request records by hand.
- **How:** the **same** server actions and validation as the public forms, stamped `source='manual'`.
  **No functional difference** between manual and online records (explicit requirement).
- **New** (thin — reuses the intake logic).

### D8. Resume builder
- **What:** recruiters generate a professional resume for candidates who lack one; the result is saved
  to the candidate record.
- **How:** structured editor pulls the candidate's existing data → renders a chosen template →
  generates a **PDF** (server-side) → stored as a `generated_resume` document on the candidate.
- **New.** Template/PDF-engine choice noted in doc 06.

### D9. Document management
- **What:** upload, view (via signed URL), and organize candidate photos, employer logos, resumes,
  JDs, certificates, contracts.
- **How:** all through the `documents` table + private Storage buckets with signed-URL access and
  MIME/size validation; confidential docs are permission-gated.
- **New.**

### D10. Search & filtering (cross-cutting)
- Fast search across candidates, employers, jobs, applications by country, experience, skills,
  recruiter, industry, status, etc. Backed by Postgres FTS + trigram + composite indexes
  ([schema §3](./02-DATABASE-SCHEMA.md#3-search--performance-strategy)).

### D11. User & role management (super_admin)
- Invite staff, set roles, activate/deactivate, grant per-user access to sensitive areas, view audit
  log. **New.**

---

## Recommended additions (not in the brief, but a real agency will need them)

These are flagged for your approval in [doc 06](./06-OPEN-QUESTIONS.md); brief reasoning here:

- **Email notifications** — candidate/employer confirmations, recruiter assignment alerts, interview
  reminders. Without this, staff must chase everything manually (the very problem we're solving).
- **Placement & guarantee tracking** — the 90-day replacement guarantee is a stated brand promise;
  tracking it protects revenue.
- **Audit trail UI** — directly serves the client's trust/ownership concern.
- **Duplicate detection/merge** — walk-ins + web submissions *will* create duplicates.
- **Saved views / assignment rules** — quality-of-life that makes daily use fast.
- **Basic reporting export (CSV)** — agencies live in spreadsheets today; a bridge eases adoption.
