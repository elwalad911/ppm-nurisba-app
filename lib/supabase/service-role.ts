import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client dengan SERVICE_ROLE_KEY — bypasses RLS.
 * Hanya boleh digunakan untuk operasi server-side terpercaya
 * yang memang tidak boleh dibatasi RLS (misal: insert payments,
 * update status via webhook, increment atomic campaign amount).
 *
 * JANGAN gunakan client ini untuk operasi CRUD biasa.
 */
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
