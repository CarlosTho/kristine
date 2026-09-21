-- Paste into Supabase SQL Editor and run. Tightens live policies without reseeding posts.
-- Keep the email below identical to ADMIN_EMAIL in .env.local.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, anon, authenticated, service_role;

create table if not exists private.blog_admins (
  email text primary key
);

alter table private.blog_admins enable row level security;

insert into private.blog_admins (email)
values (lower('kristinehuaman@gmail.com'))
on conflict (email) do nothing;

create or replace function private.is_blog_admin()
returns boolean
language sql
stable
security definer
set search_path = private
as $$
  select exists (
    select 1
    from private.blog_admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function private.is_blog_admin() from public;
grant execute on function private.is_blog_admin() to anon, authenticated, service_role;

drop policy if exists "admin write settings" on public.settings;
create policy "admin write settings"
  on public.settings
  for all
  to authenticated
  using ((select private.is_blog_admin()))
  with check ((select private.is_blog_admin()));

drop policy if exists "admin read all posts" on public.posts;
create policy "admin read all posts"
  on public.posts
  for select
  to authenticated
  using ((select private.is_blog_admin()));

drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts"
  on public.posts
  for insert
  to authenticated
  with check ((select private.is_blog_admin()));

drop policy if exists "admin update posts" on public.posts;
create policy "admin update posts"
  on public.posts
  for update
  to authenticated
  using ((select private.is_blog_admin()))
  with check ((select private.is_blog_admin()));

drop policy if exists "admin delete posts" on public.posts;
create policy "admin delete posts"
  on public.posts
  for delete
  to authenticated
  using ((select private.is_blog_admin()));

drop policy if exists "admin read all sections" on public.sections;
create policy "admin read all sections"
  on public.sections
  for select
  to authenticated
  using ((select private.is_blog_admin()));

drop policy if exists "admin write sections" on public.sections;
create policy "admin write sections"
  on public.sections
  for insert
  to authenticated
  with check ((select private.is_blog_admin()));

drop policy if exists "admin update sections" on public.sections;
create policy "admin update sections"
  on public.sections
  for update
  to authenticated
  using ((select private.is_blog_admin()))
  with check ((select private.is_blog_admin()));

drop policy if exists "admin delete sections" on public.sections;
create policy "admin delete sections"
  on public.sections
  for delete
  to authenticated
  using ((select private.is_blog_admin()));

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

drop policy if exists "public read media" on storage.objects;
create policy "public read media"
  on storage.objects for select
  using (
    bucket_id = 'media'
    and name ~ '^(cover|section|portrait)-[a-f0-9]{32}\.(jpg|jpeg|png|webp)$'
  );

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media' and (select private.is_blog_admin()));

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media' and (select private.is_blog_admin()))
  with check (bucket_id = 'media' and (select private.is_blog_admin()));

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media' and (select private.is_blog_admin()));
