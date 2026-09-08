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

  const { error } = await supabase.from("gallery").insert(result.data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
  redirect("/admin/gallery");
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/galeri");
  redirect("/admin/gallery");
}
