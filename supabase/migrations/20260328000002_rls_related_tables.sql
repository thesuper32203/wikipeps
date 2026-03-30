-- RLS for peptide_aliases
alter table public.peptide_aliases enable row level security;

create policy "Public can read aliases for published peptides"
  on public.peptide_aliases for select
  using (
    exists (
      select 1 from public.peptide
      where peptide.id = peptide_aliases.peptide_id
        and peptide.is_published = true
    )
  );

create policy "Admins can do everything"
  on public.peptide_aliases for all
  using (auth.jwt() ->> 'role' = 'admin');


-- RLS for peptide_research_links
alter table public.peptide_research_links enable row level security;

create policy "Public can read research links for published peptides"
  on public.peptide_research_links for select
  using (
    exists (
      select 1 from public.peptide
      where peptide.id = peptide_research_links.peptide_id
        and peptide.is_published = true
    )
  );

create policy "Admins can do everything"
  on public.peptide_research_links for all
  using (auth.jwt() ->> 'role' = 'admin');


-- RLS for vendor_links
alter table public.vendor_links enable row level security;

create policy "Public can read vendor links for published peptides"
  on public.vendor_links for select
  using (
    exists (
      select 1 from public.peptide
      where peptide.id = vendor_links.peptide_id
        and peptide.is_published = true
    )
  );

create policy "Admins can do everything"
  on public.vendor_links for all
  using (auth.jwt() ->> 'role' = 'admin');
