-- ═════════════════════════════════════════════════════════════════════════════
-- 0003 — Core Business Schema
-- ═════════════════════════════════════════════════════════════════════════════
-- All operational tables. Created in dependency order. Sensitive data is split
-- into its own tables (employer_contacts) so RLS can protect it at field level.
-- Soft-delete columns (deleted_at) protect client data from hard deletion.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Documents: metadata for every stored/generated file ──────────────────────
-- Bytes live in Supabase Storage; this row is the access-control + metadata record.
create table if not exists public.documents (
  id              uuid primary key default gen_random_uuid(),
  kind            document_kind not null,
  storage_bucket  text not null,
  storage_path    text not null,
  file_name       text not null,
  mime_type       text,
  size_bytes      bigint,
  owner_type      document_owner_type not null,
  owner_id        uuid not null,               -- polymorphic parent (no FK by design)
  is_confidential boolean not null default false,
  uploaded_by     uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

-- ── Candidates ───────────────────────────────────────────────────────────────
create table if not exists public.candidates (
  id                    uuid primary key default gen_random_uuid(),
  full_name             text not null,
  email                 text,
  phone                 text,
  location              text,
  linkedin_url          text,
  current_title         text,
  current_employer      text,
  total_experience      text,
  notice_period         text,
  highest_degree        text,
  field_of_study        text,
  university            text,
  graduation_year       text,
  primary_skills        text,
  secondary_skills      text,
  certifications        text,
  target_role           text,
  preferred_industry    text,
  expected_salary       text,
  work_preference       text,
  photo_document_id     uuid references public.documents (id) on delete set null,
  status                candidate_status not null default 'new',
  source                record_source not null default 'manual',
  assigned_recruiter_id uuid references public.profiles (id) on delete set null,
  consent_given         boolean not null default false,
  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(full_name, '')        || ' ' ||
      coalesce(current_title, '')    || ' ' ||
      coalesce(current_employer, '') || ' ' ||
      coalesce(primary_skills, '')   || ' ' ||
      coalesce(secondary_skills, '') || ' ' ||
      coalesce(target_role, '')      || ' ' ||
      coalesce(preferred_industry, '') || ' ' ||
      coalesce(location, '')
    )
  ) stored,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  deleted_at            timestamptz
);

drop trigger if exists trg_candidates_updated on public.candidates;
create trigger trg_candidates_updated
  before update on public.candidates
  for each row execute function public.set_updated_at();

-- Normalized child records (richer detail added from the dashboard) ------------
create table if not exists public.candidate_experience (
  id           uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates (id) on delete cascade,
  title        text,
  company      text,
  start_date   date,
  end_date     date,
  is_current   boolean not null default false,
  description  text,
  created_at   timestamptz not null default now()
);

create table if not exists public.candidate_education (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid not null references public.candidates (id) on delete cascade,
  degree        text,
  field_of_study text,
  institution   text,
  graduation_year text,
  created_at    timestamptz not null default now()
);

create table if not exists public.candidate_skills (
  id           uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates (id) on delete cascade,
  skill        text not null,
  is_primary   boolean not null default false,
  unique (candidate_id, skill)
);

-- ── Employers (companies) ────────────────────────────────────────────────────
create table if not exists public.employers (
  id                    uuid primary key default gen_random_uuid(),
  company_name          text not null,
  industry              text,
  company_scale         text,
  website_url           text,
  logo_document_id      uuid references public.documents (id) on delete set null,
  status                employer_status not null default 'prospect',
  source                record_source not null default 'manual',
  assigned_recruiter_id uuid references public.profiles (id) on delete set null,
  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(company_name, '') || ' ' ||
      coalesce(industry, '')     || ' ' ||
      coalesce(website_url, '')
    )
  ) stored,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  deleted_at            timestamptz
);

drop trigger if exists trg_employers_updated on public.employers;
create trigger trg_employers_updated
  before update on public.employers
  for each row execute function public.set_updated_at();

-- ── Employer contacts (SENSITIVE — separated for field-level RLS) ─────────────
create table if not exists public.employer_contacts (
  id           uuid primary key default gen_random_uuid(),
  employer_id  uuid not null references public.employers (id) on delete cascade,
  contact_name text,
  designation  text,
  email        text,
  phone        text,
  is_primary   boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ── Hiring requests (raw employer submissions) ───────────────────────────────
create table if not exists public.hiring_requests (
  id                   uuid primary key default gen_random_uuid(),
  employer_id          uuid references public.employers (id) on delete set null,
  job_title            text not null,
  department           text,
  openings_count       text,
  employment_type      text,
  required_skills      text,
  required_experience  text,
  work_location        text,
  salary_range         text,
  job_description_text text,
  jd_document_id       uuid references public.documents (id) on delete set null,
  urgency_timeline     text,
  additional_notes     text,
  status               hiring_request_status not null default 'new',
  source               record_source not null default 'manual',
  reviewed_by          uuid references public.profiles (id) on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

drop trigger if exists trg_hiring_requests_updated on public.hiring_requests;
create trigger trg_hiring_requests_updated
  before update on public.hiring_requests
  for each row execute function public.set_updated_at();

-- ── Jobs (published, public-facing listings) ─────────────────────────────────
-- Only candidate-safe fields live here. Employer identity/contacts NEVER exposed.
create table if not exists public.jobs (
  id                uuid primary key default gen_random_uuid(),
  hiring_request_id uuid references public.hiring_requests (id) on delete set null,
  employer_id       uuid references public.employers (id) on delete set null,
  slug              text not null unique,
  title             text not null,
  department        text,
  location          text,
  salary_display    text,
  type              text,
  description       text,
  requirements      text[] not null default '{}',
  is_published      boolean not null default false,
  published_at      timestamptz,
  created_by        uuid references public.profiles (id) on delete set null,
  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(title, '')      || ' ' ||
      coalesce(department, '')  || ' ' ||
      coalesce(location, '')    || ' ' ||
      coalesce(description, '')
    )
  ) stored,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

drop trigger if exists trg_jobs_updated on public.jobs;
create trigger trg_jobs_updated
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- ── Applications (candidate ↔ job ↔ employer) ────────────────────────────────
create table if not exists public.applications (
  id                    uuid primary key default gen_random_uuid(),
  candidate_id          uuid not null references public.candidates (id) on delete cascade,
  job_id                uuid references public.jobs (id) on delete set null,
  employer_id           uuid references public.employers (id) on delete set null,
  stage                 application_stage not null default 'applied',
  source                record_source not null default 'manual',
  assigned_recruiter_id uuid references public.profiles (id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

drop trigger if exists trg_applications_updated on public.applications;
create trigger trg_applications_updated
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ── Notes (polymorphic; visibility supports "private notes") ──────────────────
create table if not exists public.notes (
  id         uuid primary key default gen_random_uuid(),
  owner_type note_owner_type not null,
  owner_id   uuid not null,
  body       text not null,
  visibility note_visibility not null default 'team',
  author_id  uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── Activities (timeline / activity history) ─────────────────────────────────
create table if not exists public.activities (
  id         bigint generated always as identity primary key,
  owner_type activity_owner_type not null,
  owner_id   uuid not null,
  verb       text not null,
  meta       jsonb not null default '{}',
  actor_id   uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── Placements (successful hires; fees are sensitive) ────────────────────────
create table if not exists public.placements (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications (id) on delete set null,
  candidate_id   uuid references public.candidates (id) on delete set null,
  job_id         uuid references public.jobs (id) on delete set null,
  employer_id    uuid references public.employers (id) on delete set null,
  placed_at      date not null default current_date,
  salary_final   text,
  fee_amount     numeric(12, 2),
  guarantee_until date,
  status         placement_status not null default 'active',
  created_by     uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists trg_placements_updated on public.placements;
create trigger trg_placements_updated
  before update on public.placements
  for each row execute function public.set_updated_at();

-- ── Contact messages (general contact form) ──────────────────────────────────
create table if not exists public.contact_messages (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  email        text not null,
  phone        text,
  inquiry_type text,
  subject      text,
  message      text not null,
  is_handled   boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ── Audit log (immutable "who did what") ─────────────────────────────────────
create table if not exists public.audit_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid references public.profiles (id) on delete set null,
  action      text not null,
  table_name  text,
  record_id   uuid,
  diff        jsonb,
  ip_address  text,
  created_at  timestamptz not null default now()
);
