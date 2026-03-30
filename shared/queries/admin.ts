import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns true if the currently authenticated user is in the admins table.
 */
export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const { data } = await supabase.from('admins').select('id').maybeSingle();
  return data !== null;
}
