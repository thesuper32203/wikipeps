-- Admins table: users listed here get full write access
create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admins enable row level security;

-- Users can only check their own admin status
create policy "Users can check own admin status"
  on public.admins for select
  using (auth.uid() = id);

-- Replace JWT-claim-based admin policies with admins table check

-- peptide
drop policy "Admins can do everything" on public.peptide;
create policy "Admins can do everything"
  on public.peptide for all
  using (exists(select 1 from public.admins where id = auth.uid()))
  with check (exists(select 1 from public.admins where id = auth.uid()));

-- peptide_aliases
drop policy "Admins can do everything" on public.peptide_aliases;
create policy "Admins can do everything"
  on public.peptide_aliases for all
  using (exists(select 1 from public.admins where id = auth.uid()))
  with check (exists(select 1 from public.admins where id = auth.uid()));

-- peptide_research_links
drop policy "Admins can do everything" on public.peptide_research_links;
create policy "Admins can do everything"
  on public.peptide_research_links for all
  using (exists(select 1 from public.admins where id = auth.uid()))
  with check (exists(select 1 from public.admins where id = auth.uid()));

-- vendor_links
drop policy "Admins can do everything" on public.vendor_links;
create policy "Admins can do everything"
  on public.vendor_links for all
  using (exists(select 1 from public.admins where id = auth.uid()))
  with check (exists(select 1 from public.admins where id = auth.uid()));
