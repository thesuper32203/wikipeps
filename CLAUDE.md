# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# WikiPeps

Peptide encyclopedia web and mobile app. Wikipedia-style entries for peptides, served dynamically from a single Supabase table. Adding a peptide = inserting a DB row. No code changes required.

## Monorepo Layout

```
WikiPeps/
├── web/        React + Vite SPA (hosted on Vercel)
├── mobile/     React Native + Expo
├── shared/     Shared TS types, Supabase client, constants
└── supabase/   Migrations, seed data, edge functions
```

## Commands

### Web (React + Vite)
```bash
cd web && npm run dev          # Dev server at http://localhost:5173
cd web && npm run build        # Production build
cd web && npm run preview      # Preview production build
cd web && npm run typecheck    # tsc --noEmit
cd web && npm run lint         # ESLint
```

### Mobile (React Native + Expo)
```bash
cd mobile && npx expo start              # Expo dev server (scan QR for device)
cd mobile && npx expo start --ios        # iOS simulator
cd mobile && npx expo start --android    # Android emulator
```

### Supabase (local dev — requires Docker)
```bash
npx supabase start                       # Start local stack
npx supabase db push                     # Apply pending migrations
npx supabase db reset                    # Wipe and re-apply all migrations + seed

# ALWAYS run after schema changes and commit the result
npx supabase gen types typescript --local > shared/types/supabase.ts
```

## Architecture

### Data Flow
```
User → Web/Mobile → Supabase JS Client (shared/) → Supabase (DB + Auth)
```
No backend server. Both apps query Supabase directly. Row Level Security (RLS) is the auth boundary.

### Shared Supabase Client
`shared/supabase/client.ts` exports a `createSupabaseClient(url, key)` factory. Each app calls it with its own env vars — this avoids a platform shim between `import.meta.env` (Vite) and `process.env` (Expo).

- Web env file: `web/.env.local` — keys `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Mobile env file: `mobile/.env.local` — keys `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

The anon key is safe to expose client-side; RLS enforces security, not key secrecy.

### Dynamic Routing — Core Pattern
Every peptide uses the same template. The slug is the only variable.

- **Web** (React Router v6): Route `/peptides/:slug` → `web/src/pages/PeptidePage.tsx` → `useParams()` → Supabase query
- **Mobile** (Expo Router): File `mobile/app/peptide/[slug].tsx` → `useLocalSearchParams()` → same query

Fetch a full peptide with related data:
```ts
supabase
  .from('peptide')
  .select('*, peptide_aliases(*), peptide_research_links(*), vendor_links(*)')
  .eq('slug', slug)
  .single()
```

Centralize this in `shared/queries/peptides.ts` typed wrapper functions.

### Authentication
Supabase Auth. RLS policies:
- `peptide`: public SELECT where `is_published = true`; admins full access
- `peptide_aliases`, `peptide_research_links`, `vendor_links`: public SELECT via join to a published peptide; admins full access

Admin role is granted via JWT claim `role = 'admin'`.

## Database Schema

### `public.peptide`

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK (gen_random_uuid()) |
| slug | varchar(255) | Unique URL key (e.g. `bpc-157`) |
| name | varchar(255) | Display name (e.g. `BPC-157`) |
| overview | text | Markdown intro |
| is_published | boolean | Draft/live gate (default `false`) |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated via trigger |

### `public.peptide_aliases`

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK (gen_random_uuid()) |
| peptide_id | uuid | FK → `peptide.id` (cascade delete) |
| alias | varchar(255) | Alternate name |

Unique on `(peptide_id, alias)`.

### `public.peptide_research_links`

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK (gen_random_uuid()) |
| peptide_id | uuid | FK → `peptide.id` (cascade delete) |
| research_link | text | URL |
| title | text | Link label |

Unique on `(peptide_id, research_link)`.

### `public.vendor_links`

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK (gen_random_uuid()) |
| peptide_id | uuid | FK → `peptide.id` (cascade delete) |
| vendor_name | varchar(255) | |
| url | text | |
| referral_code | text | |
| affiliate | text | |

## Key Patterns

### Adding a Peptide
Insert a row via Supabase dashboard or seed script. Set `is_published = false` while drafting. No code changes needed.

### TypeScript Path Aliases
`shared/` is imported via path alias in both apps:
- `web/tsconfig.json`: `"@wikipeps/shared": ["../shared/index.ts"]`
- `mobile/tsconfig.json`: same alias + `babel.config.js` module resolver plugin

### SEO Note
This is a client-side SPA (Vite). Peptide pages will not rank well on Google without SSR/SSG. If SEO becomes critical, migrate `web/` to Next.js App Router — the Supabase client, shared types, and component logic transfer cleanly. `PeptidePage.tsx` becomes a server component using `generateStaticParams`. The DB schema and mobile app are unaffected. Defer until there is evidence SEO matters for the growth model.
