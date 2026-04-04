# Error Log

---

## [2026-04-04] Build failure — PromiseLike type mismatch + missing Vite env types

**Errors:**
```
shared/queries/peptides.ts: Argument of type 'PostgrestFilterBuilder<...>' is not assignable
to parameter of type 'Promise<unknown>' (x4)

web/src/supabaseClient.ts: Property 'env' does not exist on type 'ImportMeta' (x2)
```

**Cause 1 — PromiseLike:**
`replaceRelated` declared `const inserts: Promise<unknown>[]`. Supabase's `PostgrestFilterBuilder` is a thenable but does not implement the full `Promise` interface (`catch`, `finally`, `[Symbol.toStringTag]`), so TypeScript rejected the push calls.

**Fix:** Changed array type to `PromiseLike<unknown>[]` in `shared/queries/peptides.ts`.

**Cause 2 — import.meta.env:**
`web/src/vite-env.d.ts` was missing entirely. Without `/// <reference types="vite/client" />`, TypeScript doesn't know about Vite's `ImportMeta` augmentation and rejects `import.meta.env`.

**Fix:** Created `web/src/vite-env.d.ts` with `/// <reference types="vite/client" />`.

---

---

## [2026-04-04] listPeptides failed: column peptide.category does not exist

**Error:**
```
listPeptides failed: column peptide.category does not exist
```

**Cause:**
The migration `20260328000005_add_category.sql` added the `category` column to the `peptide` table but had never been applied to the remote production Supabase database. The `listPeptides` query in `shared/queries/peptides.ts` was selecting `category`, which caused a PostgREST error at runtime.

**Fix:**
1. Applied the migration to production via Supabase MCP (`apply_migration`):
   ```sql
   alter table public.peptide add column if not exists category varchar(255);
   ```
2. Sent `NOTIFY pgrst, 'reload schema'` to flush the PostgREST schema cache.

**Root cause of persistence after fix:**
`web/.env.local` pointed to the local Supabase instance (`http://127.0.0.1:54321`), not production. The local instance did not have the migration applied. User needed to run `npx supabase migration up` locally.

---
