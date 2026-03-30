export interface Category {
  label: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { label: 'Healing',          color: '#4ade80' },
  { label: 'Cognitive',        color: '#a78bfa' },
  { label: 'Longevity',        color: '#60a5fa' },
  { label: 'GH Secretagogues', color: '#fb923c' },
  { label: 'Fat Loss',         color: '#f472b6' },
  { label: 'Performance',      color: '#facc15' },
];

/** All filter options including the "show all" entry. */
export const CATEGORY_FILTERS: Category[] = [
  { label: 'All', color: '#2dd4bf' },
  ...CATEGORIES,
];
