-- ═════════════════════════════════════════════════════════════════════════════
-- 0002 — Profiles, Roles & Security Helper Functions
-- ═════════════════════════════════════════════════════════════════════════════
-- Internal agency users (the ONLY people who log in in V1) plus the role-check
-- helpers that every RLS policy relies on. Helpers are SECURITY DEFINER so they
-- can read `profiles` without tripping RLS recursion.
-- ─────────────────────────────────────────────────────────────────────────────

-- Shared updated_at trigger ---------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles (extends auth.users) -----------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  email       text,
  role        user_role not null default 'recruiter',
  avatar_url  text,
  -- New users start INACTIVE: a super_admin must activate them before they get
  -- any access. This prevents a stray signup from ever seeing agency data.
  is_active   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Per-user grants to sensitive areas (recruiters are denied by default) --------
create table if not exists public.permission_grants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  area        permission_area not null,
  granted_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (user_id, area)
);

-- ── Role helper functions ────────────────────────────────────────────────────
-- All are STABLE + SECURITY DEFINER with a pinned search_path.

create or replace function public.current_app_role()
returns user_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active;
$$;

create or replace function public.is_active_user()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and is_active
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active and role in ('super_admin', 'admin')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active and role = 'super_admin'
  );
$$;

-- Admins implicitly hold every permission; recruiters need an explicit grant.
create or replace function public.has_permission(p_area permission_area)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_admin() or exists (
    select 1 from public.permission_grants g
    where g.user_id = auth.uid() and g.area = p_area
  );
$$;

-- ── Auto-create a profile when a new auth user is added ──────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
