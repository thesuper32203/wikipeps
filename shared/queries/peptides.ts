import type { SupabaseClient } from '@supabase/supabase-js';
import type { Peptide, PeptideWithRelations } from '../types/peptide.js';

const FULL_SELECT = '*, peptide_aliases(*), peptide_research_links(*), vendor_links(*)' as const;

/**
 * Fetches a single published peptide by slug with all related data.
 * Returns null if not found or not published (RLS blocks unpublished rows).
 */
export async function getPeptideBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<PeptideWithRelations | null> {
  const { data, error } = await supabase
    .from('peptide')
    .select(FULL_SELECT)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getPeptideBySlug failed: ${error.message}`);
  }

  return data as PeptideWithRelations;
}

/**
 * Returns all published peptides (id, slug, name only) ordered by name.
 * Used for the home page index.
 */
export async function listPeptides(
  supabase: SupabaseClient
): Promise<Pick<Peptide, 'id' | 'slug' | 'name' | 'overview'>[]> {
  const { data, error } = await supabase
    .from('peptide')
    .select('id, slug, name, overview')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`listPeptides failed: ${error.message}`);
  }

  return (data ?? []) as Pick<Peptide, 'id' | 'slug' | 'name' | 'overview'>[];
}

// ─── Admin input types ────────────────────────────────────────────────────────

export interface PeptideInput {
  name: string;
  slug: string;
  overview: string | null;
  is_published: boolean;
}

export interface ResearchLinkInput {
  title: string;
  research_link: string;
}

export interface VendorLinkInput {
  vendor_name: string | null;
  url: string | null;
  referral_code: string | null;
  affiliate: string | null;
}

// ─── Admin queries ────────────────────────────────────────────────────────────

/**
 * Returns all peptides including drafts. Requires admin auth.
 */
export async function listAllPeptides(
  supabase: SupabaseClient
): Promise<Pick<Peptide, 'id' | 'slug' | 'name' | 'is_published' | 'updated_at'>[]> {
  const { data, error } = await supabase
    .from('peptide')
    .select('id, slug, name, is_published, updated_at')
    .order('name', { ascending: true });

  if (error) throw new Error(`listAllPeptides failed: ${error.message}`);
  return (data ?? []) as Pick<Peptide, 'id' | 'slug' | 'name' | 'is_published' | 'updated_at'>[];
}

/**
 * Fetches a single peptide by ID with all related data. Requires admin auth.
 */
export async function getPeptideById(
  supabase: SupabaseClient,
  id: string
): Promise<PeptideWithRelations | null> {
  const { data, error } = await supabase
    .from('peptide')
    .select(FULL_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getPeptideById failed: ${error.message}`);
  }

  return data as PeptideWithRelations;
}

/**
 * Creates a new peptide with all related data. Returns the new peptide's ID.
 */
export async function createPeptide(
  supabase: SupabaseClient,
  peptide: PeptideInput,
  aliases: string[],
  researchLinks: ResearchLinkInput[],
  vendorLinks: VendorLinkInput[]
): Promise<string> {
  const { data, error } = await supabase
    .from('peptide')
    .insert(peptide)
    .select('id')
    .single();

  if (error) throw new Error(`createPeptide failed: ${error.message}`);

  const id = (data as { id: string }).id;
  await replaceRelated(supabase, id, aliases, researchLinks, vendorLinks);
  return id;
}

/**
 * Updates an existing peptide and replaces all related data.
 */
export async function updatePeptide(
  supabase: SupabaseClient,
  id: string,
  peptide: PeptideInput,
  aliases: string[],
  researchLinks: ResearchLinkInput[],
  vendorLinks: VendorLinkInput[]
): Promise<void> {
  const { error } = await supabase.from('peptide').update(peptide).eq('id', id);
  if (error) throw new Error(`updatePeptide failed: ${error.message}`);
  await replaceRelated(supabase, id, aliases, researchLinks, vendorLinks);
}

/**
 * Deletes a peptide (cascades to related rows).
 */
export async function deletePeptide(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('peptide').delete().eq('id', id);
  if (error) throw new Error(`deletePeptide failed: ${error.message}`);
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function replaceRelated(
  supabase: SupabaseClient,
  peptideId: string,
  aliases: string[],
  researchLinks: ResearchLinkInput[],
  vendorLinks: VendorLinkInput[]
): Promise<void> {
  await Promise.all([
    supabase.from('peptide_aliases').delete().eq('peptide_id', peptideId),
    supabase.from('peptide_research_links').delete().eq('peptide_id', peptideId),
    supabase.from('vendor_links').delete().eq('peptide_id', peptideId),
  ]);

  const inserts: Promise<unknown>[] = [];

  if (aliases.length > 0) {
    inserts.push(
      supabase.from('peptide_aliases').insert(
        aliases.map((alias) => ({ peptide_id: peptideId, alias }))
      )
    );
  }

  if (researchLinks.length > 0) {
    inserts.push(
      supabase.from('peptide_research_links').insert(
        researchLinks.map((l) => ({ peptide_id: peptideId, ...l }))
      )
    );
  }

  if (vendorLinks.length > 0) {
    inserts.push(
      supabase.from('vendor_links').insert(
        vendorLinks.map((v) => ({ peptide_id: peptideId, ...v }))
      )
    );
  }

  await Promise.all(inserts);
}
