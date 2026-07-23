# 03 — Security & Role-Based Access Control

Security is designed **into** the system, not bolted on. This document covers roles, the permission
matrix, field-level protection of sensitive data, file security, and — critically — how the client
ends up owning everything.

## 1. Roles (Version 1)

Only agency staff authenticate. Three roles, stored on `profiles.role`:

| Role | Who | Scope |
|------|-----|-------|
| **super_admin** | Agency owner | Everything, including user management, billing/fees, deletions, audit log |
| **admin** | Managers | Nearly everything except destructive/owner-only actions; sees sensitive fields |
| **recruiter / staff** | Recruiters | Works their assigned candidates/employers/jobs; **restricted** from sensitive employer data and other recruiters' private notes unless granted |

There are **no candidate or employer logins in V1** (explicit client requirement). The architecture
leaves room to add them later without schema rewrites (see §7).

## 2. Permission matrix (starting point — confirm in doc 06)

| Capability | super_admin | admin | recruiter |
|------------|:----------:|:-----:|:---------:|
| View candidates | All | All | Assigned + shared pool* |
| Edit candidate records | ✅ | ✅ | Assigned |
| View candidate PII (contact) | ✅ | ✅ | ✅ (needed to do the job) |
| Delete candidate | ✅ | ✅ (soft) | ❌ |
| View employers | All | All | Assigned |
| **View employer contact details** | ✅ | ✅ | ❌ by default (togglable per user) |
| **View contracts / fees / private notes** | ✅ | ✅ | ❌ |
| Review hiring requests | ✅ | ✅ | ✅ (assigned) |
| Publish job to public site | ✅ | ✅ | ❌ by default |
| Manage applications / pipeline | ✅ | ✅ | Assigned |
| Resume builder | ✅ | ✅ | ✅ |
| Record placements & fees | ✅ | ✅ | ❌ (view own, no fees) |
| Manage users & roles | ✅ | ❌ | ❌ |
| View audit log | ✅ | Read | ❌ |

\* "Shared pool" = unassigned candidates any recruiter may pick up; configurable.

This matrix is the **default**. It's data-driven, so the owner can adjust per-user grants without a
code change.

## 3. How access control is enforced (three layers)

Defense-in-depth — a bug in one layer is caught by the next:

1. **Route/middleware layer** — Next.js middleware protects `app/(dashboard)/*`. No valid session →
   redirect to login. Public routes are open by design.
2. **Application layer** — Server actions check `role` + ownership before every mutation, and choose
   which fields to `select`. Zod validates all input.
3. **Database layer (the backstop)** — **PostgreSQL Row-Level Security** policies. Even if layers 1–2
   were bypassed, the DB returns nothing the current user isn't entitled to.

### Example RLS intent (pseudo-policy)
```sql
-- Recruiters see only their assigned candidates; admins/owner see all.
create policy candidates_select on candidates for select using (
  auth_role() in ('super_admin','admin')
  or assigned_recruiter_id = auth.uid()
  or (assigned_recruiter_id is null)          -- shared pool
);
```

## 4. Field-level security (the client's key requirement)

> "recruiters should work with employers while sensitive employer information … remains hidden unless
> permitted."

Postgres RLS is **row**-level, not column-level, so we get field-level control by **design, not
hacks**:

- **Sensitive columns live in separate tables** — `employer_contacts` (names/phones/emails),
  contract/fee data — each with its own strict RLS. A recruiter querying an employer simply **gets no
  rows back** from `employer_contacts`; the UI shows "🔒 Restricted."
- **`notes.visibility`** (`team` / `admins_only` / `author_only`) protects private notes.
- **`documents.is_confidential`** gates contracts/certificates behind admin-level policies + signed
  URLs.
- **Per-user overrides**: an optional `permission_grants` table lets the owner grant a specific
  recruiter access to a specific sensitive area, evaluated inside the RLS helper functions.

This means "hide the phone number from recruiters" is enforced **in the database**, not just hidden in
the UI where it could leak through an API call.

## 5. File & document security

- **All Storage buckets are private.** Nothing is world-readable — not even candidate photos.
- **Access via short-lived signed URLs** generated server-side *after* an auth + permission check.
- **Buckets**: `candidate-photos`, `resumes`, `employer-logos`, `job-descriptions`, `documents`
  (contracts/certs). Storage RLS policies mirror the table policies.
- **Upload validation**: enforced MIME types + size caps (e.g. resume ≤ 10 MB, photo ≤ 5 MB), server
  side — the current form only *pretends* to upload, so this is net-new and important.
- **Public forms** upload through a server action that streams to Storage under the service role,
  never exposing storage credentials to the browser.
- Candidate photos are **dashboard-only** and never rendered on the public website.

## 6. Baseline security practices (built in from day one)

- **Secrets** only in server env (Vercel/Supabase); `SUPABASE_SERVICE_ROLE_KEY` never reaches the
  client. Browser uses the anon key with RLS.
- **Input validation** with Zod on every server action; output encoding by React by default.
- **Rate limiting + spam protection** on the public forms (no auth = bot target): honeypot field +
  captcha (e.g. Turnstile) + IP rate limit. Prevents junk flooding the candidate DB.
- **Audit logging** of every sensitive read/write to `audit_log`.
- **Secure headers** (CSP, HSTS, X-Frame-Options) via Next.js config.
- **PII protection & consent** — the candidate consent checkbox is stored; a data-retention &
  right-to-erasure process is defined (doc 06). Backups via Supabase PITR.
- **Least privilege** everywhere — recruiters can't escalate, service role is server-only.

## 7. Designed for future public auth (without a rewrite)

V1 has no candidate/employer login, but the schema is ready:
- `candidates`/`employers` are standalone records now; later they can be **linked to an `auth.users`
  row** via a nullable `user_id` column and a new `role` value.
- RLS helper functions already branch on role — adding `candidate`/`employer` roles is additive.
- Intake forms already produce the same records a logged-in user would own.

## 8. Client ownership — never lose control again {#client-ownership}

The client previously lost their system because a developer kept ownership. This is designed to make
that **structurally impossible**:

- **GitHub**: repo created in the **client's** org; client is Owner. Developer is a collaborator who
  can be removed at any time.
- **Vercel**: project under the **client's** Vercel team; deployments tied to their GitHub.
- **Supabase**: project in the **client's** Supabase organization; client holds the org owner seat and
  database credentials.
- **Domain & email**: registered to the client.
- **Secrets**: all API keys live in the client's accounts; a documented rotation runbook lets them
  revoke developer access instantly.
- **Handover pack**: architecture docs (this folder), a runbook, and admin credentials — so any future
  developer can pick up the project cold.

No component of the live system depends on any developer-personal account.
