export interface Peptide {
  id: string;
  slug: string;
  name: string;
  overview: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PeptideAlias {
  id: string;
  peptide_id: string;
  alias: string;
}

export interface PeptideResearchLink {
  id: string;
  peptide_id: string;
  research_link: string;
  title: string;
}

export interface VendorLink {
  id: string;
  peptide_id: string;
  vendor_name: string | null;
  url: string | null;
  referral_code: string | null;
  affiliate: string | null;
}

/** Shape returned by the joined select query:
 *  .select('*, peptide_aliases(*), peptide_research_links(*), vendor_links(*)')
 */
export interface PeptideWithRelations extends Peptide {
  peptide_aliases: PeptideAlias[];
  peptide_research_links: PeptideResearchLink[];
  vendor_links: VendorLink[];
}
