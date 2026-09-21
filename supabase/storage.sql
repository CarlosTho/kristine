-- Run in SQL Editor. Creates the public media bucket so studio photos work.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = true,
  file_size_limit = 3145728,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']::text[];

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
