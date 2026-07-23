# 06 — Open Questions, Decisions, Edge Cases & Risks

This is the "before we build" checklist. Nothing here blocks planning, but several items shape
implementation and need a decision from you or the client.

## A. Decisions

**Confirmed (2026-07-23):**
- ✅ **A1 — Migrate to Next.js** on Supabase, preserving the approved design. *This is the locked direction.*
- ✅ **A2 — Park the Gemini AI matching features** for V1; revisit as a later add-on.
- ✅ **A4 — Employer contact details are hidden from recruiters by default**; owner grants access per-user.
- ⏳ **A6 — Existing data import: "not sure yet."** Design for import as a possibility; confirm before launch (Phase 8).

**Still open — needed before/at the relevant phase:**

| # | Decision | My recommendation | Why it matters |
|---|----------|-------------------|----------------|
| A3 | **Email provider** for notifications | **Resend** (clean Next.js integration) | Confirmations & alerts need a sender + domain |
| A4b | Exact list of **"sensitive" employer fields** beyond contacts (contracts, fees, private notes?) | Contacts + contracts + fees + admin-only notes | Fine-tunes the field-level RLS policies |
| A5 | Who can **publish jobs** to the public site? | admin + super_admin only | Governs the public face of the brand |
| A7 | **Resume builder** output — how many templates, PDF fidelity? | Start with 1–2 clean templates, server-rendered PDF | Scope control on a potentially deep feature |
| A8 | **Data retention & right-to-erasure** policy | Define retention window + deletion workflow | Legal/GDPR exposure — candidates submit PII |
| A9 | **Geography / compliance** — which countries' candidates? | Confirm to size privacy obligations | GDPR (EU/UK) vs. others changes consent/retention |
| A10 | **Multi-currency / localization** of salary display | Store as display string V1; structured later | Jobs already span USD/GBP |

## B. Missing requirements I recommend adding (with reasoning)

1. **Email notifications** — the agency's core pain is manual chasing; automated confirmations and
   recruiter-assignment alerts are essential to actually replace notebooks/spreadsheets.
2. **Duplicate detection & merge** — walk-in + web submissions of the same person/company are
   inevitable. Without dedupe, the candidate DB rots. Plan: soft-match on email/phone (candidates) and
   name/domain (employers), warn on create, allow merge.
3. **Audit log + UI** — directly serves the client's ownership/trust concern; also useful for
   "who changed this candidate's status."
4. **Placement & 90-day guarantee tracking** — it's a stated brand promise; tracking protects fees.
5. **Recruiter assignment model** — who "owns" a candidate/employer, and a shared pool for unassigned.
   Needed for the recruiter-scoped RLS to be meaningful.
6. **Rate limiting / spam protection on public forms** — no public auth means bots will find the
   forms; without protection the DB fills with junk.
7. **CSV export** — eases the transition from spreadsheets; low cost, high adoption value.

## C. Edge cases to design for

- **Candidate applies to multiple jobs** → multiple `applications`, one `candidate`.
- **Same email, different person / typo'd email** → dedupe must be *warn*, not auto-merge.
- **Employer submits several roles** → many `hiring_requests` under one `employer`.
- **Job unpublished/filled** → must disappear from public site but keep history + applications.
- **Candidate withdraws / asks for deletion** → soft-delete + erasure workflow (A8).
- **File upload failures / oversized / wrong type / malicious file** → server-side validation, size
  caps, MIME allow-list; consider malware scanning for contracts.
- **Recruiter deactivated** while owning records → reassign or fall back to shared pool.
- **Public form spam floods** → captcha + rate limit + honeypot.
- **Concurrent edits** to the same candidate by two staff → `updated_at` optimistic concurrency.
- **Timezones** → store UTC, render local.
- **Very long candidate lists** → keyset pagination, never load-all.

## D. Technical risks & mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Migration drifts from approved design | Client rejects | Visual regression pass in Phase 1; port markup verbatim |
| RLS misconfiguration leaks sensitive data | Severe (trust) | Dedicated RLS test suite; sensitive data in separate tables; security review in Phase 7 |
| Search slows as data grows | Daily friction | FTS + trigram + composite indexes + pagination from day one |
| File security holes (public URLs) | Data breach | Private buckets + signed URLs only; validated uploads |
| Developer-lock-in recurs | Client's core fear | All accounts client-owned from Phase 0; handover pack |
| Scope creep on resume builder / AI | Timeline slip | Explicit V1 boundaries (A2, A7) |
| PII/GDPR non-compliance | Legal | Consent capture (already in form), retention policy, erasure flow |
| Supabase free-tier limits | Outage at scale | Right-size the plan before launch; monitor usage |

## E. What I need to start building (once decisions above are made)

**Accounts (client-owned):**
- GitHub organization + repo access
- Vercel account/team
- Supabase organization + project(s)
- Domain name (for site + email sending)
- Email provider account (Resend or chosen alternative)

**Content/config:**
- List of initial staff users + their roles
- The confirmed "sensitive fields" list and per-role permission matrix (A4)
- Any existing candidate/employer data to import (A6)
- Legal copy: privacy policy, data-retention window, consent wording
- Confirmation any AI features are in or out for V1 (A2)

**From me next (on your go-ahead):**
- Turn this plan into a tracked task board (one card per Phase/feature).
- Produce the initial SQL migration + RLS policy files for review *before* writing app code.
- Stand up Phase 0 scaffolding.
