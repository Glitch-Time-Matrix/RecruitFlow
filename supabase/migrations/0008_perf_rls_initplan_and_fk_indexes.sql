-- 0008: Performance — RLS init-plan optimization + covering FK indexes.
--
-- Two changes, both pure performance (no behavioral/security change):
--
-- 1) RLS init-plan: Postgres re-evaluates `auth.uid()` and STABLE helper
--    functions (is_admin(), is_active_user(), etc.) ONCE PER ROW when they
--    appear bare in a policy USING/CHECK clause. Wrapping each in a scalar
--    subquery `(select ...)` lets the planner hoist it to an InitPlan that runs
--    ONCE PER STATEMENT. The boolean result is identical — this only removes
--    per-row re-computation, which matters as the candidate/employer/document
--    tables grow. (Supabase linter: auth_rls_initplan.)
--
-- 2) Covering indexes for foreign keys that had none, so FK lookups and joins
--    (and casc*ing deletes) don't fall back to sequential scans as data grows.
--    (Supabase linter: unindexed_foreign_keys.)

------------------------------------------------------------------------------
-- 1) Recreate RLS policies with (select ...)-wrapped auth/helper calls.
--    Logic is preserved verbatim from the existing policies; only the call
--    sites are wrapped.
------------------------------------------------------------------------------

-- candidates -----------------------------------------------------------------
alter policy candidates_select on public.candidates
  using (
    (select public.is_active_user())
    and (deleted_at is null)
    and (
      (select public.is_admin())
      or (assigned_recruiter_id = (select auth.uid()))
      or (assigned_recruiter_id is null)
    )
  );

alter policy candidates_insert on public.candidates
  with check (
    (select public.is_active_user())
    and (
      (select public.is_admin())
      or (assigned_recruiter_id = (select auth.uid()))
      or (assigned_recruiter_id is null)
    )
  );

alter policy candidates_update on public.candidates
  using (
    (select public.is_active_user())
    and (
      (select public.is_admin())
      or (assigned_recruiter_id = (select auth.uid()))
      or (assigned_recruiter_id is null)
    )
  )
  with check ((select public.is_active_user()));

alter policy candidates_delete on public.candidates
  using ((select public.is_super_admin()));

-- employers ------------------------------------------------------------------
alter policy employers_select on public.employers
  using (
    (select public.is_active_user())
    and (deleted_at is null)
    and (
      (select public.is_admin())
      or (assigned_recruiter_id = (select auth.uid()))
      or (assigned_recruiter_id is null)
    )
  );

alter policy employers_insert on public.employers
  with check (
    (select public.is_active_user())
    and (
      (select public.is_admin())
      or (assigned_recruiter_id = (select auth.uid()))
      or (assigned_recruiter_id is null)
    )
  );

alter policy employers_update on public.employers
  using (
    (select public.is_active_user())
    and (
      (select public.is_admin())
      or (assigned_recruiter_id = (select auth.uid()))
      or (assigned_recruiter_id is null)
    )
  )
  with check ((select public.is_active_user()));

alter policy employers_delete on public.employers
  using ((select public.is_super_admin()));

-- profiles -------------------------------------------------------------------
alter policy profiles_select on public.profiles
  using ((id = (select auth.uid())) or (select public.is_active_user()));

alter policy profiles_update on public.profiles
  using ((id = (select auth.uid())) or (select public.is_admin()))
  with check ((id = (select auth.uid())) or (select public.is_admin()));

-- permission_grants ----------------------------------------------------------
alter policy grants_select on public.permission_grants
  using ((user_id = (select auth.uid())) or (select public.is_admin()));

alter policy grants_write on public.permission_grants
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));

-- documents ------------------------------------------------------------------
alter policy documents_select on public.documents
  using (
    (select public.can_access_owner((owner_type)::text, owner_id))
    and (
      (not is_confidential)
      or (select public.is_admin())
      or (uploaded_by = (select auth.uid()))
    )
  );

alter policy documents_insert on public.documents
  with check ((select public.can_access_owner((owner_type)::text, owner_id)));

alter policy documents_modify on public.documents
  using ((select public.is_admin()) or (uploaded_by = (select auth.uid())))
  with check ((select public.is_admin()) or (uploaded_by = (select auth.uid())));

alter policy documents_delete on public.documents
  using ((select public.is_admin()) or (uploaded_by = (select auth.uid())));

-- applications ---------------------------------------------------------------
alter policy applications_select on public.applications
  using (
    (select public.is_active_user())
    and (
      (select public.is_admin())
      or (assigned_recruiter_id = (select auth.uid()))
      or (select public.can_access_candidate(candidate_id))
    )
  );

alter policy applications_write on public.applications
  using (
    (select public.is_active_user())
    and (
      (select public.is_admin())
      or (assigned_recruiter_id = (select auth.uid()))
      or (select public.can_access_candidate(candidate_id))
    )
  )
  with check ((select public.is_active_user()));

-- notes ----------------------------------------------------------------------
alter policy notes_select on public.notes
  using (
    (select public.can_access_owner((owner_type)::text, owner_id))
    and (
      (author_id = (select auth.uid()))
      or (visibility = 'team'::note_visibility)
      or ((visibility = 'admins_only'::note_visibility) and (select public.is_admin()))
    )
  );

alter policy notes_insert on public.notes
  with check (
    (select public.can_access_owner((owner_type)::text, owner_id))
    and (author_id = (select auth.uid()))
  );

alter policy notes_modify on public.notes
  using ((author_id = (select auth.uid())) or (select public.is_admin()))
  with check ((author_id = (select auth.uid())) or (select public.is_admin()));

alter policy notes_delete on public.notes
  using ((author_id = (select auth.uid())) or (select public.is_admin()));

------------------------------------------------------------------------------
-- 2) Covering indexes for previously-unindexed foreign keys.
------------------------------------------------------------------------------
create index if not exists idx_activities_actor_id           on public.activities (actor_id);
create index if not exists idx_audit_log_actor_id            on public.audit_log (actor_id);
create index if not exists idx_candidates_photo_document_id  on public.candidates (photo_document_id);
create index if not exists idx_documents_uploaded_by         on public.documents (uploaded_by);
create index if not exists idx_employers_logo_document_id    on public.employers (logo_document_id);
create index if not exists idx_hiring_requests_jd_document_id on public.hiring_requests (jd_document_id);
create index if not exists idx_hiring_requests_reviewed_by   on public.hiring_requests (reviewed_by);
create index if not exists idx_jobs_created_by               on public.jobs (created_by);
create index if not exists idx_notes_author_id               on public.notes (author_id);
create index if not exists idx_permission_grants_granted_by  on public.permission_grants (granted_by);
create index if not exists idx_placements_application_id     on public.placements (application_id);
create index if not exists idx_placements_created_by         on public.placements (created_by);
create index if not exists idx_placements_job_id             on public.placements (job_id);
