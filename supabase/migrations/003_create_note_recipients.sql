-- ============================================
-- NOTE RECIPIENTS TABLE WITH ROW LEVEL SECURITY (RLS)
-- ============================================
-- This table stores email recipients (To/CC) for notes
-- ============================================

-- 1. Create the note_recipients table
create table if not exists public.note_recipients (
  id uuid default gen_random_uuid() primary key,
  note_id uuid references public.notes(id) on delete cascade not null,
  email text not null,
  role text not null check (role in ('to', 'cc')),
  created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.note_recipients enable row level security;

-- 3. Create policy: Users can read recipients for their own notes
create policy "Users can read recipients for own notes"
  on public.note_recipients
  for select
  using (
    exists (
      select 1 from public.notes
      where notes.id = note_recipients.note_id
      and notes.user_id = auth.uid()
    )
  );

-- 4. Create policy: Users can insert recipients for their own notes
create policy "Users can insert recipients for own notes"
  on public.note_recipients
  for insert
  with check (
    exists (
      select 1 from public.notes
      where notes.id = note_recipients.note_id
      and notes.user_id = auth.uid()
    )
  );

-- 5. Create policy: Users can delete recipients for their own notes
create policy "Users can delete recipients for own notes"
  on public.note_recipients
  for delete
  using (
    exists (
      select 1 from public.notes
      where notes.id = note_recipients.note_id
      and notes.user_id = auth.uid()
    )
  );

-- 6. Create index for faster queries by note_id
create index if not exists note_recipients_note_id_idx on public.note_recipients(note_id);
