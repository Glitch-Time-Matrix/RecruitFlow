# Supabase — Database & Storage (Phase 2)

This folder holds the **reviewable SQL** that defines the entire RecruitFlow data
layer: schema, indexes, Row-Level Security, and Storage. Apply it to your Supabase
project to stand up the database.

> These migrations are designed for a **fresh** Supabase project. They are written
> to be safe to run in order, and most objects are guarded (`if not exists` /
> `create or replace`) so a re-run won't error.

## Migration files (run in this order)

| # | File | What it creates |
|---|------|-----------------|
| 1 | `migrations/0001_extensions_and_enums.sql` | Extensions (uuid, trigram, unaccent) + all enum types |
| 2 | `migrations/0002_profiles_and_functions.sql` | `profiles`, role helper functions, permission grants, auth trigger |
| 3 | `migrations/0003_core_schema.sql` | Candidates, employers, jobs, applications, documents, notes, etc. |
| 4 | `migrations/0004_indexes.sql` | Full-text, trigram, and foreign-key indexes |
| 5 | `migrations/0005_rls_policies.sql` | **Row-Level Security** for every table + field-level protection |
| 6 | `migrations/0006_storage.sql` | Private storage buckets + storage policies |

## How to apply

### Option A — Supabase Studio (simplest)
1. Open your project → **SQL Editor**.
2. Open each file `0001` → `0006` **in order**, paste its contents, and **Run**.
3. Confirm no errors after each.

### Option B — Supabase CLI (for repeatable deploys)
```bash
# one-time: install + link (run in your own terminal, needs internet)
npm i -g supabase
supabase link --project-ref dhanjuydhblrsrdaiezy
# apply everything in supabase/migrations in order
supabase db push
```

## After applying: bootstrap the owner
New users are created **inactive**. Promote the agency owner to super admin once:
1. Dashboard → **Authentication → Users → Add user** (owner's email + password).
2. Edit `seed_bootstrap.sql` — put the owner's email in — and run it in the SQL Editor.

## After applying: generate TypeScript types
So the app (and Phase 4's dashboard) is fully typed against the real schema:
```bash
npx supabase gen types typescript --project-id dhanjuydhblrsrdaiezy --schema public > lib/database.types.ts
```
Run this again whenever the schema changes.

## Security model in one paragraph
RLS is **on for every table**. Logged-in agency users (`authenticated`) see data
according to their role and assignments; **recruiters cannot read sensitive
employer contacts, contracts, fees, or private notes** unless the owner grants
them (`permission_grants`). The public (`anon`) can read **only published jobs**.
Trusted server code uses the **service role** (which bypasses RLS) for public
form intake and admin tasks. See [../docs/03-SECURITY-RBAC.md](../docs/03-SECURITY-RBAC.md).

## Quick smoke test (optional, in SQL Editor)
```sql
-- Should list all tables with rowsecurity = true
select tablename, rowsecurity
from pg_tables where schemaname = 'public' order by tablename;

-- Should list the RLS policies
select tablename, policyname, cmd
from pg_policies where schemaname = 'public' order by tablename, policyname;
```
