-- Run this in Supabase: Project -> SQL Editor -> New query -> Run
-- Creates the two tables the site's forms write to, with public insert
-- allowed (so the anon key can submit) but no public read/update/delete.

create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text not null,
  email text not null,
  phone text,
  event_date date,
  event_type text,
  talent_preference text,
  location text,
  message text
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  message text
);

alter table booking_requests enable row level security;
alter table contact_messages enable row level security;

-- Allow anyone (the public site, using the anon key) to submit new rows
create policy "Public can submit booking requests"
  on booking_requests for insert
  to anon
  with check (true);

create policy "Public can submit contact messages"
  on contact_messages for insert
  to anon
  with check (true);

-- No select/update/delete policies are created for the anon role, so
-- submissions are write-only from the public site. To read submissions,
-- use the Supabase Table Editor (as the project owner) or a service-role key.
