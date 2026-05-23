create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  bio text,
  reading_goal text,
  avatar_data_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists bio text,
  add column if not exists reading_goal text,
  add column if not exists avatar_data_url text;

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.work_likes (
  work_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (work_id, user_id)
);

create table if not exists public.work_comments (
  id uuid primary key default gen_random_uuid(),
  work_id text not null,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'Reader',
  body text not null check (char_length(body) between 1 and 800),
  created_at timestamptz not null default now()
);

alter table public.work_comments
  alter column user_id drop not null;

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.work_likes enable row level security;
alter table public.work_comments enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can read own progress" on public.user_progress;
create policy "Users can read own progress"
on public.user_progress for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.user_progress;
create policy "Users can insert own progress"
on public.user_progress for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress"
on public.user_progress for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Anyone can read work likes" on public.work_likes;
create policy "Anyone can read work likes"
on public.work_likes for select
using (true);

drop policy if exists "Users can like works" on public.work_likes;
create policy "Users can like works"
on public.work_likes for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can remove own work likes" on public.work_likes;
create policy "Users can remove own work likes"
on public.work_likes for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Anyone can read work comments" on public.work_comments;
create policy "Anyone can read work comments"
on public.work_comments for select
to anon, authenticated
using (true);

drop policy if exists "Users can comment on works" on public.work_comments;
create policy "Users can comment on works"
on public.work_comments for insert
to anon, authenticated
with check (user_id is null or auth.uid() = user_id);

drop policy if exists "Users can delete own work comments" on public.work_comments;
create policy "Users can delete own work comments"
on public.work_comments for delete
to authenticated
using (auth.uid() = user_id);

grant select on public.work_likes to anon, authenticated;
grant select, insert on public.work_comments to anon, authenticated;
grant delete on public.work_comments to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.user_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
