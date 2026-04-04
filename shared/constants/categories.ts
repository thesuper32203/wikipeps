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
