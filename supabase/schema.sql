-- ============================================================
-- Inventory System — Supabase SQL Schema + RLS Policies
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 0. Enable required extensions
create extension if not exists "uuid-ossp";

-- 1. ENUM for roles
do $$ begin
  create type public.app_role as enum (
    'UNASSIGNED',
    'ADMIN',
    'SUPERVISOR',
    'INVENTORY_MANAGER',
    'SALESMAN',
    'BUYER'
  );
exception when duplicate_object then null;
end $$;

-- 2. Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        public.app_role not null default 'UNASSIGNED',
  created_at  timestamptz not null default now()
);

-- 3. Packaging table
create table if not exists public.packaging (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  created_at  timestamptz not null default now()
);

-- 4. Products table
create table if not exists public.products (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  sku           text not null unique,
  packaging_id  uuid references public.packaging(id) on delete set null,
  grams         numeric(10,2),
  category      text,
  price         numeric(10,2) not null default 0,
  status        text not null default 'active' check (status in ('active', 'inactive', 'discontinued')),
  created_at    timestamptz not null default now()
);

-- 5. Audit logs table
create table if not exists public.audit_logs (
  id                uuid primary key default uuid_generate_v4(),
  actor_profile_id  uuid references public.profiles(id) on delete set null,
  action            text not null,        -- e.g. 'role_change', 'product_create'
  entity            text not null,        -- e.g. 'profiles', 'products'
  entity_id         uuid,
  meta_json         jsonb default '{}',
  created_at        timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles   enable row level security;
alter table public.packaging  enable row level security;
alter table public.products   enable row level security;
alter table public.audit_logs enable row level security;

-- ---------- Helper function: get current user's role ----------
create or replace function public.get_my_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------- PROFILES policies ----------
-- All authenticated users can read their OWN profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read ALL profiles
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.get_my_role() = 'ADMIN');

-- Admins can update ALL profiles (role assignment, etc.)
create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.get_my_role() = 'ADMIN');

-- Allow insert for the trigger/service (uses service key or trigger)
create policy "Service can insert profiles"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ---------- PACKAGING policies ----------
-- Admins full CRUD
create policy "Admins can do everything with packaging"
  on public.packaging for all
  using (public.get_my_role() = 'ADMIN');

-- Authenticated users can read packaging (for dropdowns etc.)
create policy "Authenticated users can read packaging"
  on public.packaging for select
  using (auth.uid() is not null);

-- ---------- PRODUCTS policies ----------
-- Admins full CRUD
create policy "Admins can do everything with products"
  on public.products for all
  using (public.get_my_role() = 'ADMIN');

-- Authenticated users can read products
create policy "Authenticated users can read products"
  on public.products for select
  using (auth.uid() is not null);

-- ---------- AUDIT_LOGS policies ----------
-- Only admins can read audit logs
create policy "Admins can read audit logs"
  on public.audit_logs for select
  using (public.get_my_role() = 'ADMIN');

-- Any authenticated user can insert (so actions can log)
create policy "Authenticated users can insert audit logs"
  on public.audit_logs for insert
  with check (auth.uid() is not null);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', ''),
    case
      when new.email = 'tvraps261@gmail.com' then 'ADMIN'::public.app_role
      else 'UNASSIGNED'::public.app_role
    end
  );
  return new;
end;
$$;

-- Drop if exists to allow re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
