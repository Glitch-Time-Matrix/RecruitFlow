-- ═════════════════════════════════════════════════════════════════════════════
-- 0006 — Storage Buckets & Policies
-- ═════════════════════════════════════════════════════════════════════════════
-- All buckets are PRIVATE. Files are reached only through short-lived signed
-- URLs generated server-side after a permission check. Read access at the
-- storage layer is tied back to the `documents` table, so a user can only read
-- an object if they can read its document row (which already enforces
-- confidential-file and ownership rules from migration 0005).
-- ─────────────────────────────────────────────────────────────────────────────

-- Private buckets -------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('candidate-photos', 'candidate-photos', false),
  ('resumes',          'resumes',          false),
  ('employer-logos',   'employer-logos',   false),
  ('job-descriptions', 'job-descriptions', false),
  ('documents',        'documents',        false)
on conflict (id) do nothing;

-- RLS is already enabled on storage.objects by Supabase. Add scoped policies.

-- READ: only if an accessible document row points at this exact object.
-- The subquery runs under the caller's RLS, so it returns a row only when the
-- user is entitled to that document (including confidential gating).
drop policy if exists "rms_read_objects" on storage.objects;
create policy "rms_read_objects" on storage.objects for select to authenticated
using (
  bucket_id = any (array['candidate-photos','resumes','employer-logos','job-descriptions','documents'])
  and exists (
    select 1 from public.documents d
    where d.storage_bucket = storage.objects.bucket_id
      and d.storage_path = storage.objects.name
  )
);

-- UPLOAD: any active agency user may upload into the RMS buckets. The matching
-- `documents` row is created immediately afterward by the server with the
-- correct owner + confidentiality flag.
drop policy if exists "rms_upload_objects" on storage.objects;
create policy "rms_upload_objects" on storage.objects for insert to authenticated
with check (
  bucket_id = any (array['candidate-photos','resumes','employer-logos','job-descriptions','documents'])
  and public.is_active_user()
);

-- NOTE: object UPDATE/DELETE are intentionally NOT granted to authenticated
-- users. File replacement/removal happens server-side via the service role
-- (which bypasses RLS), keeping destructive storage operations in trusted code.
-- Public form uploads (candidate photo, resume, JD) also run via the service
-- role, so no anon storage policy is needed.
