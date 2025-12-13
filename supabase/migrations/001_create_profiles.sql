-- ============================================
-- PROFILES TABLE WITH ROW LEVEL SECURITY (RLS)
-- ============================================
-- Run this SQL in your Supabase Dashboard:
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor
-- Paste this entire file and click "Run"
-- ============================================

-- 1. Create the profiles table linked to auth.users
-- The id column references auth.users(id) to link each profile to a user
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Enable Row Level Security (RLS)
-- This ensures no one can access the table without explicit policies
alter table public.profiles enable row level security;

-- 3. Create policy: Users can read their own profile
-- auth.uid() returns the current authenticated user's ID
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- 4. Create policy: Users can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 5. Create policy: Users can insert their own profile (for initial creation)
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- 6. Function to automatically create a profile when a user signs up
-- This trigger function runs after a new user is created in auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- 7. Trigger to call the function on user signup
-- Drop existing trigger if it exists, then create it
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8. Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 9. Trigger for updated_at
drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();
