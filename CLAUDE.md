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

Both run: `supabase.from('peptides').select('*').eq('slug', slug).single()`

Centralize this in `shared/queries/peptides.ts` typed wrapper functions to avoid duplicating JSONB casts across both apps.

### Authentication
Supabase Auth. RLS policy on `peptides` table: public can SELECT `is_published = true` rows; admin role (JWT claim) can INSERT/UPDATE/DELETE.

## Database Schema

Core table: `public.peptides`

| Column | Type | Notes |
|---|---|---|
| slug | text | Unique URL key (e.g. `bpc-157`) |
| name | text | Display name (e.g. `BPC-157`) |
| aliases | text[] | Alternate names |
| overview | text | Markdown intro |
| mechanism_of_action | text | Markdown |
| clinical_effects | jsonb | `{effect, evidence_level, notes}[]` |
| anecdotal_effects | jsonb | `{effect, source, notes}[]` |
| administration_routes | jsonb | `{route, typical_dose, frequency, notes}[]` |
| research_links | jsonb | `{title, url, doi, year}[]` |
| vendor_links | jsonb | `{vendor_name, url, referral_code, affiliate}[]` |
| is_published | boolean | Draft/live gate |

JSONB shape interfaces live in `shared/types/peptide.ts` (source of truth). The auto-generated `shared/types/supabase.ts` types all JSONB columns as `Json` — cast to the specific interface at the call site or in the shared query wrappers.

Full-text search uses a GIN index on `name || ' ' || array_to_string(aliases, ' ')`.

## Key Patterns

### Adding a Peptide
Insert a row via Supabase dashboard or seed script. Set `is_published = false` while drafting. No code changes needed.

### TypeScript Path Aliases
`shared/` is imported via path alias in both apps:
- `web/tsconfig.json`: `"@wikipeps/shared": ["../shared/index.ts"]`
- `mobile/tsconfig.json`: same alias + `babel.config.js` module resolver plugin

### SEO Note
This is a client-side SPA (Vite). Peptide pages will not rank well on Google without SSR/SSG. If SEO becomes critical, migrate `web/` to Next.js App Router — the Supabase client, shared types, and component logic transfer cleanly. `PeptidePage.tsx` becomes a server component using `generateStaticParams`. The DB schema and mobile app are unaffected. Defer until there is evidence SEO matters for the growth model.
