-- ═════════════════════════════════════════════════════════════════════════════
-- 0004 — Indexes & Search
-- ═════════════════════════════════════════════════════════════════════════════
-- Keeps the app fast as data grows: GIN full-text, trigram fuzzy matching,
-- foreign-key indexes, and composite indexes for the hot dashboard queries.
-- ─────────────────────────────────────────────────────────────────────────────

-- Full-text search (GIN over generated tsvector columns) ----------------------
create index if not exists idx_candidates_search on public.candidates using gin (search_vector);
create index if not exists idx_employers_search  on public.employers  using gin (search_vector);
create index if not exists idx_jobs_search        on public.jobs       using gin (search_vector);

-- Fuzzy name / skill matching (trigram) ---------------------------------------
create index if not exists idx_candidates_name_trgm  on public.candidates using gin (full_name gin_trgm_ops);
create index if not exists idx_candidates_skills_trgm on public.candidates using gin (primary_skills gin_trgm_ops);
create index if not exists idx_employers_name_trgm   on public.employers  using gin (company_name gin_trgm_ops);

-- Case-insensitive dedupe / lookup on contact fields --------------------------
create index if not exists idx_candidates_email_lower on public.candidates (lower(email));
create index if not exists idx_candidates_phone       on public.candidates (phone);
create index if not exists idx_employers_name_lower   on public.employers (lower(company_name));

-- Common filters --------------------------------------------------------------
create index if not exists idx_candidates_status   on public.candidates (status) where deleted_at is null;
create index if not exists idx_candidates_industry on public.candidates (preferred_industry);
create index if not exists idx_employers_status    on public.employers (status) where deleted_at is null;
create index if not exists idx_employers_industry  on public.employers (industry);
create index if not exists idx_hiring_requests_status on public.hiring_requests (status);
create index if not exists idx_applications_stage  on public.applications (stage);

-- Foreign-key / ownership indexes ---------------------------------------------
create index if not exists idx_candidates_recruiter on public.candidates (assigned_recruiter_id);
create index if not exists idx_employers_recruiter  on public.employers (assigned_recruiter_id);
create index if not exists idx_employer_contacts_employer on public.employer_contacts (employer_id);
create index if not exists idx_hiring_requests_employer   on public.hiring_requests (employer_id);
create index if not exists idx_jobs_employer        on public.jobs (employer_id);
create index if not exists idx_jobs_hiring_request  on public.jobs (hiring_request_id);
create index if not exists idx_applications_candidate on public.applications (candidate_id);
create index if not exists idx_applications_job     on public.applications (job_id);
create index if not exists idx_applications_employer on public.applications (employer_id);
create index if not exists idx_applications_recruiter on public.applications (assigned_recruiter_id);
create index if not exists idx_cand_exp_candidate   on public.candidate_experience (candidate_id);
create index if not exists idx_cand_edu_candidate   on public.candidate_education (candidate_id);
create index if not exists idx_cand_skills_candidate on public.candidate_skills (candidate_id);
create index if not exists idx_placements_employer  on public.placements (employer_id);
create index if not exists idx_placements_candidate on public.placements (candidate_id);

-- Polymorphic lookups (notes / activities / documents by parent) --------------
create index if not exists idx_notes_owner      on public.notes (owner_type, owner_id);
create index if not exists idx_activities_owner on public.activities (owner_type, owner_id);
create index if not exists idx_documents_owner  on public.documents (owner_type, owner_id);

-- Composite indexes for hot dashboard queries ---------------------------------
create index if not exists idx_candidates_recruiter_status
  on public.candidates (assigned_recruiter_id, status) where deleted_at is null;
create index if not exists idx_applications_recruiter_stage
  on public.applications (assigned_recruiter_id, stage);

-- Public site: fast lookup of published jobs by slug --------------------------
create index if not exists idx_jobs_published
  on public.jobs (published_at desc) where is_published;
