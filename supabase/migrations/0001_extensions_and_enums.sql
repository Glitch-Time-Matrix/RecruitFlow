-- ═════════════════════════════════════════════════════════════════════════════
-- 0001 — Extensions & Enum Types
-- ═════════════════════════════════════════════════════════════════════════════
-- Foundational database objects: required extensions and the enumerated types
-- that keep statuses/pipelines consistent across the whole system.
-- Safe to run once on a fresh Supabase project. Enum creation is guarded so a
-- partial re-run does not error.
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensions ------------------------------------------------------------------
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists pg_trgm;    -- fuzzy / trigram search
create extension if not exists unaccent;   -- accent-insensitive search

-- Enum types (guarded so re-runs are safe) ------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('super_admin', 'admin', 'recruiter');
  end if;

  if not exists (select 1 from pg_type where typname = 'record_source') then
    create type record_source as enum ('web', 'manual');
  end if;

  if not exists (select 1 from pg_type where typname = 'candidate_status') then
    create type candidate_status as enum (
      'new', 'screening', 'shortlisted', 'submitted',
      'interviewing', 'offered', 'placed', 'rejected', 'on_hold'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'employer_status') then
    create type employer_status as enum ('prospect', 'active', 'inactive');
  end if;

  if not exists (select 1 from pg_type where typname = 'hiring_request_status') then
    create type hiring_request_status as enum (
      'new', 'under_review', 'approved', 'rejected', 'published'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'application_stage') then
    create type application_stage as enum (
      'applied', 'screening', 'submitted_to_client',
      'interview', 'offer', 'hired', 'rejected', 'withdrawn'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'document_kind') then
    create type document_kind as enum (
      'candidate_photo', 'resume', 'generated_resume', 'employer_logo',
      'job_description', 'certificate', 'contract', 'other'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'document_owner_type') then
    create type document_owner_type as enum ('candidate', 'employer', 'application');
  end if;

  if not exists (select 1 from pg_type where typname = 'note_owner_type') then
    create type note_owner_type as enum ('candidate', 'employer', 'application', 'hiring_request');
  end if;

  if not exists (select 1 from pg_type where typname = 'note_visibility') then
    create type note_visibility as enum ('team', 'admins_only', 'author_only');
  end if;

  if not exists (select 1 from pg_type where typname = 'activity_owner_type') then
    create type activity_owner_type as enum (
      'candidate', 'employer', 'application', 'hiring_request', 'job'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'placement_status') then
    create type placement_status as enum ('active', 'guarantee_passed', 'fell_through');
  end if;

  if not exists (select 1 from pg_type where typname = 'permission_area') then
    -- Sensitive areas a recruiter can be granted access to (default: denied).
    create type permission_area as enum ('employer_contacts', 'contracts', 'fees', 'private_notes');
  end if;
end
$$;
