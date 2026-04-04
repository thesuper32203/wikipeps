# Changes & Additions Log

---

## [2026-04-04] Category filter now correctly filters peptides on home page

**Files changed:**
- `web/src/pages/HomePage.tsx`

**Change:**
The `searchQuery` state was being set but never used to filter the peptide list. Updated the `displayed` filter to combine both the active category pill and the search query:
- Category pill: shows only peptides where `p.category === activeCategory`
- Search bar: narrows by name or overview text
- Both filters work independently and together

---

## [2026-04-04] Added "Skin Quality" category

**Files changed:**
- `shared/constants/categories.ts`

**Change:**
Added `{ label: 'Skin Quality', color: '#f9a8d4' }` to the `CATEGORIES` array. Since both the admin panel (`PeptideFormPage.tsx`) and home page (`HomePage.tsx`) derive their category options from this single constant, no other files required changes.

---

## [2026-04-04] Replaced all categories with new set

**Files changed:**
- `shared/constants/categories.ts`

**Old categories:** Healing, Cognitive, Longevity, GH Secretagogues, Fat Loss, Performance, Skin Quality

**New categories:**
| Label | Color |
|-------|-------|
| Recovery & Healing | `#4ade80` |
| Brain & Cognitive Function | `#a78bfa` |
| Longevity & Cellular Health | `#60a5fa` |
| Muscle Growth & Strength | `#fb923c` |
| Fat Loss & Metabolism | `#f472b6` |
| Hormone Optimization | `#facc15` |
| Skin, Hair & Appearance | `#f9a8d4` |

**DB update (production):**
Ran `UPDATE peptide SET category = CASE category ...` to remap all existing peptide rows to the new category labels. Melanotan II was reclassified from `Performance` → `Skin, Hair & Appearance`.

---

## [2026-04-04] Added Vendors page

**Files added:**
- `web/src/pages/VendorsPage.tsx`

**Files changed:**
- `web/src/App.tsx`
- `web/src/pages/HomePage.tsx`

**Change:**
- Created `/vendors` route displaying a "Coming Soon" card (no vendors exist yet)
- Updated `PublicLayout` in `App.tsx`: removed hardcoded "Compound Library" breadcrumb, added Compounds + Vendors nav links
- Added a top nav bar to `HomePage.tsx` with Compounds (active) and Vendors links

---

## [2026-04-04] Added peptide_tags system

**Files added:**
- `supabase/migrations/20260404000001_add_peptide_tags.sql`

**Files changed:**
- `shared/types/peptide.ts`
- `shared/queries/peptides.ts`
- `shared/index.ts`
- `web/src/pages/admin/PeptideFormPage.tsx`
- `web/src/pages/HomePage.tsx`

**Change:**
Full tags system added end-to-end:

**DB:** New `peptide_tags` table (`id`, `peptide_id` FK cascade, `tag` varchar). Unique constraint on `(peptide_id, tag)`. RLS: public read for published peptides, admins full access. Applied to local and production.

**Shared layer:**
- `PeptideTag` type added; `PeptideWithRelations` now includes `peptide_tags[]`
- `PeptideListItem` type exported (includes tags)
- `listPeptides` selects `peptide_tags(tag)`
- `createPeptide` / `updatePeptide` accept `tags: string[]`
- `replaceRelated` deletes and re-inserts tags on every save

**Admin panel:** New Tags section in `PeptideFormPage` — same UX as Aliases. Tags auto-normalized to lowercase + underscored on save.

**Home page filtering:**
- Category pills now also match peptides whose tags overlap with the category name
- Search bar now also searches through tags

---
