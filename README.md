# WikiPeps

A peptide encyclopedia — a clean, Wikipedia-style reference where anyone can learn about peptides and find trusted vendors.

## What is WikiPeps?

WikiPeps is a read-only knowledge base for peptides. Each peptide gets its own page with:

- **Overview** — what it is, how it works, and what it's used for
- **Research links** — links to published studies and literature
- **Vendor listings** — vetted vendors where you can purchase the peptide

The goal is simple: give people a reliable, no-nonsense place to look up peptides without wading through forums or shady marketing copy.

## Features

- Browse peptides by category (e.g. recovery, cognition, fat loss, longevity)
- Each peptide page is dynamically generated from a database entry — no code changes needed to add new peptides
- Vendor cards with direct links to purchase
- Mobile-friendly (React Native app coming)

## Tech Stack

| Layer | Tech |
|---|---|
| Web frontend | React + Vite (hosted on Vercel) |
| Mobile app | React Native + Expo |
| Database + Auth | Supabase (PostgreSQL) |
| Shared logic | TypeScript shared package |

## Project Structure

```
WikiPeps/
├── web/        React + Vite SPA
├── mobile/     React Native + Expo app
├── shared/     Shared types, Supabase client, query helpers
└── supabase/   Migrations, seed data, edge functions
```

## Running Locally

**Web**
```bash
cd web && npm run dev
```

**Supabase (requires Docker)**
```bash
npx supabase start
npx supabase db reset
```

## Adding a Peptide

No code changes required. Insert a row into the `peptide` table via the Supabase dashboard:

1. Set `is_published = false` while drafting
2. Fill in `slug`, `name`, `overview`, `category`
3. Add entries to `peptide_research_links` and `vendor_links`
4. Flip `is_published = true` when ready

## Contributing

This is a private project. If you'd like to suggest a peptide entry or report incorrect information, open an issue.
