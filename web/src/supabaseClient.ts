import { createSupabaseClient } from '@wikipeps/shared';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  throw new Error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in web/.env.local'
  );
}

const supabase = createSupabaseClient(url, key);

export default supabase;
