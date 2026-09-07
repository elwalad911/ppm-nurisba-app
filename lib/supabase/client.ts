import { createBrowserClient } from "@supabase/ssr";

/**
 * Fungsi untuk menginisialisasi client Supabase di sisi browser (Client Component)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
