"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  description: z.string().optional(),
  location: z.string().optional(),
  start_at: z.string().min(1, "Waktu mulai wajib diisi"),
  end_at: z.string().optional().or(z.literal("")),
  image_url: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function createEvent(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    location: formData.get("location"),
    start_at: formData.get("start_at"),
    end_at: formData.get("end_at") || null,
    image_url: formData.get("image_url"),
    status: formData.get("status"),
  };

  const result = eventSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { error } = await supabase.from("events").insert(result.data);

  if (error) {
    if (error.code === "23505") {
      throw new Error("Slug sudah digunakan.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/events");
  revalidatePath("/agenda");
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    location: formData.get("location"),
    start_at: formData.get("start_at"),
    end_at: formData.get("end_at") || null,
    image_url: formData.get("image_url"),
    status: formData.get("status"),
  };

  const result = eventSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { error } = await supabase
    .from("events")
    .update({ ...result.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      throw new Error("Slug sudah digunakan.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/events");
  revalidatePath("/agenda");
  redirect("/admin/events");
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/events");
  revalidatePath("/agenda");
  redirect("/admin/events");
}
