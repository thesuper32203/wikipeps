-- Drop existing tables and recreate with UUID primary keys
drop table if exists vendor_links cascade;
drop table if exists peptide_aliases cascade;
drop table if exists peptide_research_links cascade;
drop trigger if exists peptides_updated_at on public.peptide;
drop table if exists peptide cascade;
drop function if exists update_updated_at cascade;

create table public.peptide (
  id uuid primary key default gen_random_uuid(),
  slug varchar(255) not null unique,
  name varchar(255) not null,
  overview text,
  is_published boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.peptide_aliases (
  id uuid primary key default gen_random_uuid(),
  peptide_id uuid not null references public.peptide(id) on delete cascade,
  alias varchar(255) not null,
  unique (peptide_id, alias)
);

create table public.peptide_research_links (
  id uuid primary key default gen_random_uuid(),
  peptide_id uuid not null references public.peptide(id) on delete cascade,
  research_link text not null,
  title text not null,
  unique (peptide_id, research_link)
);

create table public.vendor_links (
  id uuid primary key default gen_random_uuid(),
  peptide_id uuid not null references public.peptide(id) on delete cascade,
  vendor_name varchar(255),
  url text,
  referral_code text,
  affiliate text
);

create index on peptide_aliases (peptide_id);
create index on peptide_research_links (peptide_id);
create index on vendor_links (peptide_id);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger peptides_updated_at
  before update on public.peptide
  for each row execute function update_updated_at();

-- RLS: peptide
alter table public.peptide enable row level security;

create policy "Public can read published peptides"
  on public.peptide for select
  using (is_published = true);

create policy "Admins can do everything"
  on public.peptide for all
  using (auth.jwt() ->> 'role' = 'admin');

-- RLS: peptide_aliases
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

-- RLS: peptide_research_links
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

-- RLS: vendor_links
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
