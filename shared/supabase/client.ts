import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Factory function that creates a Supabase client.
 * Each platform calls this once at startup with its own env vars,
 * avoiding any shim between import.meta.env (Vite) and process.env (Expo).
 */
export function createSupabaseClient(url: string, key: string): SupabaseClient {
  return createClient(url, key);
}
