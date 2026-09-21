-- Kristine Blog schema. Paste into Supabase SQL Editor and run.
-- Also run supabase/harden.sql so private.is_blog_admin exists before these policies are used.
create extension if not exists pgcrypto;

create table if not exists public.settings (
  id bigint generated always as identity primary key,
  display_name text not null,
  tagline text not null,
  bio text not null,
  portrait_path text,
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  category text not null,
  cover_path text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  position integer not null,
  type text not null,
  content text not null default '',
  image_path text
);

create index if not exists posts_published_created_idx on public.posts (published, created_at desc);
create index if not exists sections_post_position_idx on public.sections (post_id, position);

alter table public.settings enable row level security;
alter table public.posts enable row level security;
alter table public.sections enable row level security;

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);

drop policy if exists "admin write settings" on public.settings;
create policy "admin write settings" on public.settings for all to authenticated using ((select private.is_blog_admin())) with check ((select private.is_blog_admin()));

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts for select using (published = true);

drop policy if exists "admin read all posts" on public.posts;
create policy "admin read all posts" on public.posts for select to authenticated using ((select private.is_blog_admin()));

drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts" on public.posts for all to authenticated using ((select private.is_blog_admin())) with check ((select private.is_blog_admin()));

drop policy if exists "public read published sections" on public.sections;
create policy "public read published sections" on public.sections for select using (
  exists (
    select 1 from public.posts
    where posts.id = sections.post_id and posts.published = true
  )
);

drop policy if exists "admin read all sections" on public.sections;
create policy "admin read all sections" on public.sections for select to authenticated using ((select private.is_blog_admin()));

drop policy if exists "admin write sections" on public.sections;
create policy "admin write sections" on public.sections for all to authenticated using ((select private.is_blog_admin())) with check ((select private.is_blog_admin()));

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (
  bucket_id = 'media'
  and name ~ '^(cover|section|portrait)-[a-f0-9]{32}\.(jpg|jpeg|png|webp)$'
);

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (select private.is_blog_admin()));

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media' and (select private.is_blog_admin())) with check (bucket_id = 'media' and (select private.is_blog_admin()));

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and (select private.is_blog_admin()));

insert into public.settings (display_name, tagline, bio)
select
  'Kristine-Huaman',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
where not exists (select 1 from public.settings);

insert into public.posts (slug, title, excerpt, category, published)
select * from (
  values
    ('lorem-ipsum-dolor-sit-amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'The Journey', true),
    ('ut-enim-ad-minim-veniam', 'Ut enim ad minim veniam', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Law News', true),
    ('duis-aute-irure-dolor', 'Duis aute irure dolor', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Commentary', true)
) as seed(slug, title, excerpt, category, published)
where not exists (select 1 from public.posts);

insert into public.sections (post_id, position, type, content)
select posts.id, 0, 'paragraph', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
from public.posts
where not exists (select 1 from public.sections);

create or replace function public.replace_post_sections(p_post_id uuid, p_sections jsonb)
returns void
language plpgsql
security invoker
set search_path = public, private
as $$
begin
  if not private.is_blog_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  delete from public.sections where post_id = p_post_id;
  insert into public.sections (id, post_id, position, type, content, image_path)
  select
    coalesce((item->>'id')::uuid, gen_random_uuid()),
    p_post_id,
    (item->>'position')::integer,
    item->>'type',
    coalesce(item->>'content', ''),
    nullif(item->>'image_path', '')
  from jsonb_array_elements(p_sections) as item;
end;
$$;

revoke all on function public.replace_post_sections(uuid, jsonb) from public;
grant execute on function public.replace_post_sections(uuid, jsonb) to authenticated;

grant usage on schema public to anon, authenticated;
grant select on table public.settings to anon, authenticated;
grant insert, update, delete on table public.settings to authenticated;
grant select on table public.posts to anon, authenticated;
grant insert, update, delete on table public.posts to authenticated;
grant select on table public.sections to anon, authenticated;
grant insert, update, delete on table public.sections to authenticated;
