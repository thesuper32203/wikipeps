-- Create peptides table
CREATE TABLE IF NOT EXISTS "peptide" (
	"id" serial NOT NULL UNIQUE,
	-- unique url key (bpc-157)
	"slug" varchar(255) NOT NULL UNIQUE,
	"name" varchar(255) NOT NULL,
	"overview" text,
	"is_published" boolean NOT NULL DEFAULT false,
	"created_at" TIMESTAMPTZ DEFAULT now(),
	"updated_at" TIMESTAMPTZ DEFAULT now(),
	PRIMARY KEY("id")
);
COMMENT ON COLUMN peptide.slug IS 'unique url key (bpc-157)
';

CREATE TABLE IF NOT EXISTS "peptide_research_links" (
	"id" serial NOT NULL UNIQUE,
	"peptide_id" int NOT NULL,
	"research_link" text NOT NULL,
	"title" text NOT NULL,
	PRIMARY KEY("id"),
  unique ("peptide_id", "research_link")
);

CREATE TABLE IF NOT EXISTS "peptide_aliases" (
	"id" serial NOT NULL UNIQUE,
	"peptide_id" int NOT NULL,
	"alias" varchar(255) NOT NULL,
	PRIMARY KEY("id"),
  unique("peptide_id", "alias")
);


CREATE TABLE IF NOT EXISTS "vendor_links" (
	"id" serial NOT NULL UNIQUE,
  "peptide_id" int NOT NULL,
	"vendor_name" varchar(255),
	"url" text,
	"referral_code" text,
	"affiliate" text,
	PRIMARY KEY("id")
);


ALTER TABLE "peptide_research_links"
ADD FOREIGN KEY("peptide_id") REFERENCES "peptide"("id")
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE "peptide_aliases"
ADD FOREIGN KEY("peptide_id") REFERENCES "peptide"("id")
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE "vendor_links"
ADD FOREIGN KEY("peptide_id") REFERENCES "peptide"("id")
ON UPDATE NO ACTION ON DELETE CASCADE;

create index on peptide_aliases (peptide_id);
create index on peptide_research_links (peptide_id);
create index on vendor_links (peptide_id);

-- Slug lookup (primary query pattern)
--create unique index peptides_slug_idx on public.peptides (slug);

-- Full-text search on name + aliases
--create index peptides_search_idx on public.peptides
 -- using gin (to_tsvector('english', name || ' ' || array_to_string(aliases, ' ')));

-- Auto-update updated_at on row changes
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

-- Row Level Security
alter table public.peptide enable row level security;

create policy "Public can read published peptides"
  on public.peptide for select
  using (is_published = true);

create policy "Admins can do everything"
  on public.peptide for all
  using (auth.jwt() ->> 'role' = 'admin');
