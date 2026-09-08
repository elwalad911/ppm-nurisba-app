"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter"),
  description: z.string().optional(),
  category: z.string().optional(),
  image_url: z.string().url("URL gambar tidak valid"),
});

function extractStoragePath(imageUrl: string): string | null {
  const marker = "/object/public/images/";
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  return imageUrl.substring(idx + marker.length);
}

async function deleteStorageFile(supabase: Awaited<ReturnType<typeof createClient>>, storagePath: string) {
  const { error } = await supabase.storage.from("images").remove([storagePath]);
  if (error) {
    console.error("[gallery] Failed to cleanup orphan storage file:", storagePath, error.message);
  }
}

export async function createGalleryItem(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
  };

  const result = gallerySchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const imageUrl = result.data.image_url;
  const storagePath = extractStoragePath(imageUrl);

  const { error } = await supabase.from("gallery").insert(result.data);

  if (error) {
    console.error("[gallery] INSERT failed:", error.message, error.code, error.details);
    if (storagePath) {
      await deleteStorageFile(supabase, storagePath);
    }
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error("Anda tidak memiliki izin untuk menambah galeri. Pastikan akun Anda adalah admin.");
    }
    throw new Error(`Gagal menyimpan galeri: ${error.message}`);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
  redirect("/admin/gallery");
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: item, error: fetchError } = await supabase
    .from("gallery")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("[gallery] FETCH for delete failed:", fetchError.message);
    throw new Error("Gagal mengambil data galeri.");
  }

  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) {
    console.error("[gallery] DELETE failed:", error.message, error.code);
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error("Anda tidak memiliki izin untuk menghapus galeri.");
    }
    throw new Error(`Gagal menghapus galeri: ${error.message}`);
  }

  if (item?.image_url) {
    const storagePath = extractStoragePath(item.image_url);
    if (storagePath) {
      await deleteStorageFile(supabase, storagePath);
    }
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
  redirect("/admin/gallery");
}
