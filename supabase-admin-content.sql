-- Run this once in Supabase SQL Editor.
-- It creates shared admin content storage and restricts editing to selected users.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles
add column if not exists role text not null default 'reader';

create table if not exists public.admin_content (
  id text primary key default 'main',
  content jsonb not null default '{"authors":[],"works":[],"chapters":[],"translations":[]}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint admin_content_singleton check (id = 'main')
);

insert into public.admin_content (id, content)
values ('main', '{"authors":[],"works":[],"chapters":[],"translations":[]}'::jsonb)
on conflict (id) do nothing;

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = check_user_id
  )
  or exists (
    select 1
    from public.profiles
    where id = check_user_id
      and role = 'admin'
  );
$$;

alter table public.admin_users enable row level security;
alter table public.admin_content enable row level security;

drop policy if exists "Anyone can read admin content" on public.admin_content;
create policy "Anyone can read admin content"
on public.admin_content
for select
using (true);

drop policy if exists "Admins can write admin content" on public.admin_content;
create policy "Admins can write admin content"
on public.admin_content
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Users can read own admin flag" on public.admin_users;
create policy "Users can read own admin flag"
on public.admin_users
for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage admin users" on public.admin_users;
create policy "Admins can manage admin users"
on public.admin_users
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

grant select on public.admin_content to anon, authenticated;
grant insert, update, delete on public.admin_content to authenticated;
grant select, insert, update, delete on public.admin_users to authenticated;

notify pgrst, 'reload schema';

-- After creating your account, copy its auth.users id and run one of these:
-- insert into public.admin_users (user_id) values ('YOUR_USER_ID_HERE');
-- or, if your profiles table has a role column:
-- update public.profiles set role = 'admin' where id = 'YOUR_USER_ID_HERE';
