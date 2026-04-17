// Types
export type {
  Peptide,
  PeptideAlias,
  PeptideResearchLink,
  VendorLink,
  PeptideTag,
  PeptideWithRelations,
} from './types/peptide.js';

// Admin input types
export type {
  PeptideInput,
  PeptideListItem,
  ResearchLinkInput,
  VendorLinkInput,
} from './queries/peptides.js';

// Supabase client factory
export { createSupabaseClient } from './supabase/client.js';

// Public queries
export { getPeptideBySlug, listPeptides } from './queries/peptides.js';

// Admin queries
export {
  listAllPeptides,
  getPeptideById,
  createPeptide,
  updatePeptide,
  deletePeptide,
} from './queries/peptides.js';

export { isAdmin } from './queries/admin.js';

// Categories
export { CATEGORIES, CATEGORY_FILTERS, GOAL_OPTIONS, CONCERN_TAGS } from './constants/categories.js';
export type { Category, GoalOption } from './constants/categories.js';
