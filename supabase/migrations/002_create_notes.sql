-- ============================================
-- NOTES TABLE WITH ROW LEVEL SECURITY (RLS)
-- ============================================
-- Run this SQL in your Supabase Dashboard:
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor
-- Paste this entire file and click "Run"
-- ============================================

-- 1. Create the notes table linked to auth.users
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  body text,
  created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- 3. Create policy: Users can read their own notes
create policy "Users can read own notes"
  on public.notes
  for select
  using (auth.uid() = user_id);

-- 4. Create policy: Users can insert their own notes
create policy "Users can insert own notes"
  on public.notes
  for insert
  with check (auth.uid() = user_id);

-- 5. Create policy: Users can update their own notes
create policy "Users can update own notes"
  on public.notes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Create policy: Users can delete their own notes
create policy "Users can delete own notes"
  on public.notes
  for delete
  using (auth.uid() = user_id);

-- 7. Create index for faster queries by user_id
create index if not exists notes_user_id_idx on public.notes(user_id);
