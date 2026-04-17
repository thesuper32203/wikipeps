export interface Category {
  label: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { label: 'Recovery & Healing',          color: '#4ade80' },
  { label: 'Brain & Cognitive Function',  color: '#a78bfa' },
  { label: 'Longevity & Cellular Health', color: '#60a5fa' },
  { label: 'Muscle Growth & Strength',    color: '#fb923c' },
  { label: 'Fat Loss & Metabolism',       color: '#f472b6' },
  { label: 'Hormone Optimization',        color: '#facc15' },
  { label: 'Skin, Hair & Appearance',     color: '#f9a8d4' },
];

/** All filter options including the "show all" entry. */
export const CATEGORY_FILTERS: Category[] = [
  { label: 'All', color: '#2dd4bf' },
  ...CATEGORIES,
];

export interface GoalOption {
  label: string;
  category: string;
  color: string;
}

/** Maps survey goal options to peptide categories. */
export const GOAL_OPTIONS: GoalOption[] = [
  { label: 'Recover faster',   category: 'Recovery & Healing',          color: '#4ade80' },
  { label: 'Build muscle',     category: 'Muscle Growth & Strength',    color: '#fb923c' },
  { label: 'Lose fat',         category: 'Fat Loss & Metabolism',       color: '#f472b6' },
  { label: 'Boost cognition',  category: 'Brain & Cognitive Function',  color: '#a78bfa' },
  { label: 'Live longer',      category: 'Longevity & Cellular Health', color: '#60a5fa' },
  { label: 'Look better',      category: 'Skin, Hair & Appearance',     color: '#f9a8d4' },
  { label: 'Balance hormones', category: 'Hormone Optimization',        color: '#facc15' },
];

/** Maps survey concern labels to peptide tag substrings for fuzzy matching. */
export const CONCERN_TAGS: Record<string, string[]> = {
  'Joint pain':     ['joint', 'pain', 'anti_inflammatory', 'recovery', 'healing'],
  'Sleep':          ['sleep', 'recovery', 'ghrh', 'growth_hormone'],
  'Inflammation':   ['anti_inflammatory', 'inflammation', 'recovery'],
  'Focus':          ['focus', 'cognitive', 'brain', 'nootropic'],
  'Weight plateau': ['fat_loss', 'metabolism', 'weight', 'ghrelin'],
  'Skin/hair':      ['skin', 'hair', 'appearance', 'collagen'],
  'Libido':         ['libido', 'hormone', 'testosterone', 'sexual'],
  'Gut health':     ['gut', 'healing', 'gastrointestinal', 'digestive'],
};
