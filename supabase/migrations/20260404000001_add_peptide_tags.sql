create table public.peptide_tags (
  id         uuid primary key default gen_random_uuid(),
  peptide_id uuid not null references public.peptide(id) on delete cascade,
  tag        varchar(100) not null,
  unique (peptide_id, tag)
);

alter table public.peptide_tags enable row level security;

-- Public can read tags for published peptides
create policy "public read peptide_tags"
  on public.peptide_tags for select
  using (
    exists (
      select 1 from public.peptide
      where peptide.id = peptide_tags.peptide_id
        and peptide.is_published = true
    )
  );

-- Admins have full access
create policy "admins manage peptide_tags"
  on public.peptide_tags for all
  using  ((auth.jwt() ->> 'role') = 'admin')
  with check ((auth.jwt() ->> 'role') = 'admin');

-- Example inserts (for reference — run against a real peptide id):
-- insert into public.peptide_tags (peptide_id, tag) values
--   ('<bpc-157-id>', 'healing'),
--   ('<bpc-157-id>', 'recovery'),
--   ('<mk-677-id>',  'muscle_growth'),
--   ('<mk-677-id>',  'fat_loss'),
--   ('<mk-677-id>',  'longevity');

-- Example search by tag:
-- select p.* from public.peptide p
-- join public.peptide_tags t on t.peptide_id = p.id
-- where t.tag = 'healing' and p.is_published = true;
