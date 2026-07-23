# 02 — Database Schema

The data model is the heart of the RMS. It is designed to be **normalized enough for fast search and
field-level security**, while staying simple enough for a small agency to reason about.

## 1. Entity overview

```
auth.users ──1:1── profiles (internal staff: super_admin | admin | recruiter)
                       │ owns / is assigned
                       ▼
   candidates ──1:M── candidate_experience
       │        ──1:M── candidate_education
       │        ──1:M── candidate_skills
       │        ──1:M── documents (resume, photo, certs)
       │        ──1:M── notes (polymorphic)
       │        ──1:M── activities (timeline)
       │
       └──────── applications ──────── jobs ──────── employers
                                         │              │  ──1:M── employer_contacts (SENSITIVE)
                                         │              │  ──1:M── documents (logo, contracts)
                                         │              │  ──1:M── notes (polymorphic)
                                    (published from)    │
                                    hiring_requests ────┘

placements ── links application → candidate → job → employer (with guarantee window)
contact_messages   audit_log   generated_resumes
```

## 2. Core tables

Below is the **conceptual schema** (final SQL lives in `/supabase/migrations`). Types are PostgreSQL.

### `profiles` — internal agency users
Extends `auth.users`. **The only people who log in.**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | = auth.users.id |
| full_name | text | |
| role | enum `user_role` | `super_admin` \| `admin` \| `recruiter` |
| avatar_url | text | |
| is_active | bool | deactivate without deleting |
| created_at / updated_at | timestamptz | |

### `candidates`
Sourced from the public form **or** manual entry — identical records.
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| full_name, email, phone, location | text | email/phone used for **dedupe** |
| linkedin_url, current_title, current_employer | text | |
| total_experience, notice_period, work_preference | text | maps to existing form fields |
| target_role, preferred_industry, expected_salary | text | |
| photo_document_id | uuid FK → documents | the client's requested **visual ID** |
| status | enum `candidate_status` | `new` \| `screening` \| `shortlisted` \| `submitted` \| `interviewing` \| `offered` \| `placed` \| `rejected` \| `on_hold` |
| source | enum | `web` \| `manual` |
| assigned_recruiter_id | uuid FK → profiles | ownership |
| consent_given | bool | from the declaration checkbox (GDPR) |
| search_vector | tsvector | generated, for full-text search |
| created_at / updated_at | timestamptz | |

Supporting tables (normalized for search & clean UI): `candidate_experience`,
`candidate_education`, `candidate_skills (candidate_id, skill, is_primary)`.

### `employers` (companies)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| company_name, industry, company_scale, website_url | text | |
| logo_document_id | uuid FK → documents | |
| status | enum | `prospect` \| `active` \| `inactive` |
| assigned_recruiter_id | uuid FK → profiles | |
| source | enum | `web` \| `manual` |
| created_at / updated_at | timestamptz | |

### `employer_contacts` — **SENSITIVE, separated on purpose**
Contact people, direct phone/email. **Split into its own table so RLS can hide it** from recruiters
who lack permission (see [field-level security](./03-SECURITY-RBAC.md#field-level-security)).
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| employer_id | uuid FK | |
| contact_name, designation, email, phone | text | protected columns |
| is_primary | bool | |

### `hiring_requests` — raw employer submissions
The employer form lands here first, **before** anything is published.
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| employer_id | uuid FK | linked/created on submit |
| job_title, department, openings_count, employment_type | text | |
| required_skills, required_experience, work_location, salary_range | text | |
| job_description_text | text | |
| jd_document_id | uuid FK → documents | |
| urgency_timeline, additional_notes | text | |
| status | enum | `new` \| `under_review` \| `approved` \| `rejected` \| `published` |
| reviewed_by | uuid FK → profiles | |
| created_at | timestamptz | |

### `jobs` — published, public-facing listings
Created by an agency user **from an approved hiring request**. Only fields safe for the public live
here — **no employer contact info ever**.
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| hiring_request_id | uuid FK | provenance |
| employer_id | uuid FK | internal link (never exposed publicly) |
| slug | text unique | for `/jobs/[slug]` SEO |
| title, department, location, salary_display, type | text | mirror existing `Job` type |
| description | text | |
| requirements | text[] | matches existing `Job.requirements` |
| is_published | bool | drives visibility on public site |
| published_at | timestamptz | |
| created_by | uuid FK → profiles | |

### `applications`
Links a candidate to a job (and therefore an employer). Created when a candidate applies on the
public site **or** when a recruiter submits a candidate internally.
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| candidate_id | uuid FK | |
| job_id | uuid FK | |
| employer_id | uuid FK | denormalized for fast filtering |
| stage | enum `application_stage` | `applied` \| `screening` \| `submitted_to_client` \| `interview` \| `offer` \| `hired` \| `rejected` \| `withdrawn` |
| source | enum | `web` \| `manual` |
| assigned_recruiter_id | uuid FK | |
| created_at / updated_at | timestamptz | |

### `documents` — every uploaded/generated file
One table, many kinds. The file bytes live in **Supabase Storage**; this row is the metadata + access
control record.
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| kind | enum `document_kind` | `candidate_photo` \| `resume` \| `generated_resume` \| `employer_logo` \| `job_description` \| `certificate` \| `contract` \| `other` |
| storage_bucket, storage_path | text | pointer into Storage |
| file_name, mime_type, size_bytes | text/int | validated on upload |
| owner_type | enum | `candidate` \| `employer` \| `application` |
| owner_id | uuid | polymorphic parent |
| is_confidential | bool | e.g. contracts → stricter RLS |
| uploaded_by | uuid FK → profiles | null if from public form |
| created_at | timestamptz | |

### `notes` — polymorphic comments/notes
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| owner_type | enum | `candidate` \| `employer` \| `application` \| `hiring_request` |
| owner_id | uuid | |
| body | text | |
| visibility | enum `note_visibility` | `team` \| `admins_only` \| `author_only` — supports "private notes" requirement |
| author_id | uuid FK → profiles | |
| created_at | timestamptz | |

### `activities` — timeline & activity history
Human-readable events on a record ("Recruiter X moved candidate to Interviewing").
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | owner_type, owner_id, verb, meta jsonb, actor_id, created_at |

### `placements`
Successful hires — the agency's revenue events.
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | application_id, candidate_id, job_id, employer_id |
| placed_at | date | |
| salary_final | text | |
| fee_amount | numeric | agency fee (sensitive) |
| guarantee_until | date | the **90-day replacement guarantee** tracking |
| status | enum | `active` \| `guarantee_passed` \| `fell_through` |

### `contact_messages`
General contact form submissions (maps to existing `ContactInquiry`).

### `audit_log` — security & compliance
Immutable record of **who did what** — directly addresses the client's trust concerns.
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | actor_id, action, table_name, record_id, diff jsonb, ip, created_at |

## 3. Search & performance strategy

The brief stresses performance "as the dataset grows." Plan:
- **Full-text search** via generated `tsvector` columns + GIN indexes on candidates, jobs, employers.
- **Trigram indexes** (`pg_trgm`) for fuzzy name/skill matching ("did you mean…").
- **B-tree indexes** on every foreign key + common filters (`status`, `assigned_recruiter_id`,
  `industry`, `location`, `stage`).
- **Composite indexes** for the hot dashboard queries (e.g. `(assigned_recruiter_id, status)`).
- **Pagination** everywhere (keyset/cursor for large lists), never "load all."
- For a single agency this comfortably scales to hundreds of thousands of rows on Postgres without
  external search infrastructure.

## 4. Data integrity rules

- **Soft deletes** (`deleted_at`) on candidates, employers, jobs — never hard-delete client data.
- **Dedupe** on candidate `email`/`phone` and employer `company_name`/domain at write time
  (warn-and-merge, see doc 06 edge cases).
- **Foreign keys with `on delete restrict/set null`** — no orphan records.
- **Enums** (not free-text status) so pipelines stay consistent.
- **`updated_at` triggers** on all mutable tables.
- Every public-form insert is stamped `source = 'web'`, `status = 'new'` so staff can triage intake.

## 5. Row-Level Security (RLS)

**RLS is ON for every table.** No row is readable/writable except through an explicit policy. The
policy design (roles, ownership, field-level protection) is specified in
[03 — Security & RBAC](./03-SECURITY-RBAC.md). This is defense-in-depth: even if application code has
a bug, the database itself refuses unauthorized access.
