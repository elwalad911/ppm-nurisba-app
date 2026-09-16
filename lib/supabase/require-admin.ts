import type { createClient } from "@/lib/supabase/server";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Memverifikasi bahwa pemanggil adalah admin yang terautentikasi.
 *
 * Menggunakan server client (anon key + cookies) sehingga request
 * membawa JWT user dan `auth.uid()` tetap dapat dievaluasi oleh RLS.
 * TIDAK menggunakan service_role — RLS tetap menjadi enforcement boundary.
 *
 * @throws Error dengan pesan user-friendly jika bukan admin.
 */
export async function requireAdmin(
  supabase: ServerSupabaseClient
): Promise<{ userId: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sesi tidak valid. Silakan login ulang.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Hanya admin yang dapat melakukan operasi ini.");
  }

  return { userId: user.id };
}
