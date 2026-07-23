-- ═════════════════════════════════════════════════════════════════════════════
-- 0005 — Row-Level Security (the security backbone)
-- ═════════════════════════════════════════════════════════════════════════════
-- RLS is ON for every table. Nothing is readable/writable except via an explicit
-- policy. This is defense-in-depth: even if app code has a bug, the DATABASE
-- refuses unauthorized access.
--
-- Roles:
--   • service_role  — trusted server code (public form intake, admin tasks).
--                     Has BYPASSRLS; policies below do NOT constrain it.
--   • authenticated — logged-in agency users. Gated by is_active_user()/role.
--   • anon          — public website visitors. May ONLY read published jobs.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Row-access helper functions ─────────────────────────────────────────────
create or replace function public.can_access_candidate(p_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.candidates c
    where c.id = p_id
      and c.deleted_at is null
      and (public.is_admin()
           or c.assigned_recruiter_id = auth.uid()
           or c.assigned_recruiter_id is null)
  );
$$;

create or replace function public.can_access_employer(p_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.employers e
    where e.id = p_id
      and e.deleted_at is null
      and (public.is_admin()
           or e.assigned_recruiter_id = auth.uid()
           or e.assigned_recruiter_id is null)
  );
$$;

-- Polymorphic parent access (used by notes / activities / documents).
create or replace function public.can_access_owner(p_type text, p_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  if p_type = 'candidate' then
    return public.can_access_candidate(p_id);
  elsif p_type = 'employer' then
    return public.can_access_employer(p_id);
  elsif p_type = 'application' then
    return exists (
      select 1 from public.applications a
      where a.id = p_id
        and (public.is_admin()
             or a.assigned_recruiter_id = auth.uid()
             or public.can_access_candidate(a.candidate_id))
    );
  elsif p_type in ('hiring_request', 'job') then
    return public.is_active_user();
  else
    return false;
  end if;
end;
$$;

-- Protect role / activation changes: only a super_admin (or trusted server code
-- where auth.uid() is null) may change a profile's role or is_active flag.
create or replace function public.enforce_profile_privileges()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (new.role is distinct from old.role
      or new.is_active is distinct from old.is_active)
     and auth.uid() is not null
     and not public.is_super_admin() then
    raise exception 'Only a super admin can change a profile role or activation status';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_protect_privileges on public.profiles;
create trigger trg_profiles_protect_privileges
  before update on public.profiles
  for each row execute function public.enforce_profile_privileges();

-- ── Enable RLS on every table ────────────────────────────────────────────────
alter table public.profiles              enable row level security;
alter table public.permission_grants     enable row level security;
alter table public.candidates            enable row level security;
alter table public.candidate_experience  enable row level security;
alter table public.candidate_education   enable row level security;
alter table public.candidate_skills      enable row level security;
alter table public.employers             enable row level security;
alter table public.employer_contacts     enable row level security;
alter table public.hiring_requests       enable row level security;
alter table public.jobs                  enable row level security;
alter table public.applications          enable row level security;
alter table public.documents             enable row level security;
alter table public.notes                 enable row level security;
alter table public.activities            enable row level security;
alter table public.placements            enable row level security;
alter table public.contact_messages      enable row level security;
alter table public.audit_log             enable row level security;

-- ── PROFILES ─────────────────────────────────────────────────────────────────
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_active_user());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
-- (role/is_active changes are further gated by trg_profiles_protect_privileges)

-- ── PERMISSION GRANTS (super_admin manages; users can see their own) ─────────
drop policy if exists grants_select on public.permission_grants;
create policy grants_select on public.permission_grants for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists grants_write on public.permission_grants;
create policy grants_write on public.permission_grants for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- ── CANDIDATES ───────────────────────────────────────────────────────────────
drop policy if exists candidates_select on public.candidates;
create policy candidates_select on public.candidates for select
  using (
    public.is_active_user() and deleted_at is null and (
      public.is_admin()
      or assigned_recruiter_id = auth.uid()
      or assigned_recruiter_id is null
    )
  );

drop policy if exists candidates_insert on public.candidates;
create policy candidates_insert on public.candidates for insert
  with check (
    public.is_active_user() and (
      public.is_admin()
      or assigned_recruiter_id = auth.uid()
      or assigned_recruiter_id is null
    )
  );

drop policy if exists candidates_update on public.candidates;
create policy candidates_update on public.candidates for update
  using (
    public.is_active_user() and (
      public.is_admin()
      or assigned_recruiter_id = auth.uid()
      or assigned_recruiter_id is null
    )
  )
  with check (public.is_active_user());

drop policy if exists candidates_delete on public.candidates;
create policy candidates_delete on public.candidates for delete
  using (public.is_super_admin());

-- Candidate child records follow parent access --------------------------------
drop policy if exists cand_exp_all on public.candidate_experience;
create policy cand_exp_all on public.candidate_experience for all
  using (public.can_access_candidate(candidate_id))
  with check (public.can_access_candidate(candidate_id));

drop policy if exists cand_edu_all on public.candidate_education;
create policy cand_edu_all on public.candidate_education for all
  using (public.can_access_candidate(candidate_id))
  with check (public.can_access_candidate(candidate_id));

drop policy if exists cand_skills_all on public.candidate_skills;
create policy cand_skills_all on public.candidate_skills for all
  using (public.can_access_candidate(candidate_id))
  with check (public.can_access_candidate(candidate_id));

-- ── EMPLOYERS ────────────────────────────────────────────────────────────────
drop policy if exists employers_select on public.employers;
create policy employers_select on public.employers for select
  using (
    public.is_active_user() and deleted_at is null and (
      public.is_admin()
      or assigned_recruiter_id = auth.uid()
      or assigned_recruiter_id is null
    )
  );

drop policy if exists employers_insert on public.employers;
create policy employers_insert on public.employers for insert
  with check (
    public.is_active_user() and (
      public.is_admin()
      or assigned_recruiter_id = auth.uid()
      or assigned_recruiter_id is null
    )
  );

drop policy if exists employers_update on public.employers;
create policy employers_update on public.employers for update
  using (
    public.is_active_user() and (
      public.is_admin()
      or assigned_recruiter_id = auth.uid()
      or assigned_recruiter_id is null
    )
  )
  with check (public.is_active_user());

drop policy if exists employers_delete on public.employers;
create policy employers_delete on public.employers for delete
  using (public.is_super_admin());

-- ── EMPLOYER CONTACTS (field-level protection) ───────────────────────────────
-- Recruiters see NOTHING here unless granted 'employer_contacts'. Admins always.
drop policy if exists employer_contacts_all on public.employer_contacts;
create policy employer_contacts_all on public.employer_contacts for all
  using (public.can_access_employer(employer_id) and public.has_permission('employer_contacts'))
  with check (public.can_access_employer(employer_id) and public.has_permission('employer_contacts'));

-- ── HIRING REQUESTS (any active staff can review) ────────────────────────────
drop policy if exists hiring_requests_select on public.hiring_requests;
create policy hiring_requests_select on public.hiring_requests for select
  using (public.is_active_user());

drop policy if exists hiring_requests_write on public.hiring_requests;
create policy hiring_requests_write on public.hiring_requests for all
  using (public.is_active_user())
  with check (public.is_active_user());

-- ── JOBS ─────────────────────────────────────────────────────────────────────
-- Public (anon + everyone) may read PUBLISHED jobs; staff read all jobs.
drop policy if exists jobs_public_read on public.jobs;
create policy jobs_public_read on public.jobs for select
  using (is_published);

drop policy if exists jobs_staff_read on public.jobs;
create policy jobs_staff_read on public.jobs for select
  using (public.is_active_user());

-- Only admins publish/edit jobs (decision A5); super_admin may delete.
drop policy if exists jobs_insert on public.jobs;
create policy jobs_insert on public.jobs for insert
  with check (public.is_admin());

drop policy if exists jobs_update on public.jobs;
create policy jobs_update on public.jobs for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists jobs_delete on public.jobs;
create policy jobs_delete on public.jobs for delete
  using (public.is_super_admin());

-- ── APPLICATIONS ─────────────────────────────────────────────────────────────
drop policy if exists applications_select on public.applications;
create policy applications_select on public.applications for select
  using (
    public.is_active_user() and (
      public.is_admin()
      or assigned_recruiter_id = auth.uid()
      or public.can_access_candidate(candidate_id)
    )
  );

drop policy if exists applications_write on public.applications;
create policy applications_write on public.applications for all
  using (
    public.is_active_user() and (
      public.is_admin()
      or assigned_recruiter_id = auth.uid()
      or public.can_access_candidate(candidate_id)
    )
  )
  with check (public.is_active_user());

-- ── DOCUMENTS ────────────────────────────────────────────────────────────────
drop policy if exists documents_select on public.documents;
create policy documents_select on public.documents for select
  using (
    public.can_access_owner(owner_type::text, owner_id)
    and (not is_confidential or public.is_admin() or uploaded_by = auth.uid())
  );

drop policy if exists documents_insert on public.documents;
create policy documents_insert on public.documents for insert
  with check (public.can_access_owner(owner_type::text, owner_id));

drop policy if exists documents_modify on public.documents;
create policy documents_modify on public.documents for update
  using (public.is_admin() or uploaded_by = auth.uid())
  with check (public.is_admin() or uploaded_by = auth.uid());

drop policy if exists documents_delete on public.documents;
create policy documents_delete on public.documents for delete
  using (public.is_admin() or uploaded_by = auth.uid());

-- ── NOTES (polymorphic + visibility) ─────────────────────────────────────────
drop policy if exists notes_select on public.notes;
create policy notes_select on public.notes for select
  using (
    public.can_access_owner(owner_type::text, owner_id)
    and (
      author_id = auth.uid()
      or visibility = 'team'
      or (visibility = 'admins_only' and public.is_admin())
    )
  );

drop policy if exists notes_insert on public.notes;
create policy notes_insert on public.notes for insert
  with check (
    public.can_access_owner(owner_type::text, owner_id)
    and author_id = auth.uid()
  );

drop policy if exists notes_modify on public.notes;
create policy notes_modify on public.notes for update
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

drop policy if exists notes_delete on public.notes;
create policy notes_delete on public.notes for delete
  using (author_id = auth.uid() or public.is_admin());

-- ── ACTIVITIES (timeline; readable with parent access, insert by staff) ──────
drop policy if exists activities_select on public.activities;
create policy activities_select on public.activities for select
  using (public.can_access_owner(owner_type::text, owner_id));

drop policy if exists activities_insert on public.activities;
create policy activities_insert on public.activities for insert
  with check (public.is_active_user());

-- ── PLACEMENTS (fees are sensitive: admins or a 'fees' grant) ────────────────
drop policy if exists placements_select on public.placements;
create policy placements_select on public.placements for select
  using (public.is_admin() or public.has_permission('fees'));

drop policy if exists placements_write on public.placements;
create policy placements_write on public.placements for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── CONTACT MESSAGES (staff read/handle; public writes via service_role) ─────
drop policy if exists contact_messages_select on public.contact_messages;
create policy contact_messages_select on public.contact_messages for select
  using (public.is_active_user());

drop policy if exists contact_messages_modify on public.contact_messages;
create policy contact_messages_modify on public.contact_messages for update
  using (public.is_active_user())
  with check (public.is_active_user());

drop policy if exists contact_messages_delete on public.contact_messages;
create policy contact_messages_delete on public.contact_messages for delete
  using (public.is_admin());

-- ── AUDIT LOG (read: admins; writes via triggers/service_role only) ──────────
drop policy if exists audit_select on public.audit_log;
create policy audit_select on public.audit_log for select
  using (public.is_admin());

-- ── Grants (RLS still gates every row; these allow the attempt) ──────────────
grant usage on schema public to anon, authenticated, service_role;
grant select on public.jobs to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to anon, authenticated, service_role;
