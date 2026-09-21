-- Run in SQL Editor. Adds editable hero and footer copy on settings.
alter table public.settings
  add column if not exists hero_kicker text not null default 'Welcome to my blog';

alter table public.settings
  add column if not exists hero_headline text not null default 'Notes from my law journey.';

alter table public.settings
  add column if not exists hero_highlight text not null default 'law journey';

alter table public.settings
  add column if not exists footer_text text not null default 'This is a record of my law journey. I also like to write about many things :)';
