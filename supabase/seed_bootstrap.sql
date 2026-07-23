-- ═════════════════════════════════════════════════════════════════════════════
-- Bootstrap the first Super Admin (run ONCE, after the owner's auth user exists)
-- ═════════════════════════════════════════════════════════════════════════════
-- New users are created INACTIVE with role 'recruiter'. The very first user (the
-- agency owner) must be promoted to super_admin by hand — after that, the owner
-- manages everyone else from the dashboard.
--
-- Steps:
--   1. Create the owner's login: Supabase Dashboard → Authentication → Users →
--      "Add user" (set email + password). This fires the trigger that creates a
--      matching row in public.profiles (inactive).
--   2. Replace the email below with that user's email and run this snippet in the
--      SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

update public.profiles
set role      = 'super_admin',
    is_active = true,
    full_name = coalesce(nullif(full_name, ''), 'Agency Owner')
where email = 'REPLACE_WITH_OWNER_EMAIL@example.com';

-- Verify:
-- select id, email, role, is_active from public.profiles;
