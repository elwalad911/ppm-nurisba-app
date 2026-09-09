"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  thumbnail_url: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export async function createPost(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const status = formData.get("status") as string;

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    thumbnail_url: formData.get("thumbnail_url") || undefined,
    status: status,
  };

  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const publishedAt = status === "published" ? new Date().toISOString() : null;

  const { error } = await supabase.from("posts").insert({
    ...result.data,
    published_at: publishedAt,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("Slug sudah digunakan.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/posts");
  revalidatePath("/berita");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const status = formData.get("status") as string;

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    thumbnail_url: formData.get("thumbnail_url") || undefined,
    status: status,
  };

  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { data: existing } = await supabase
    .from("posts")
    .select("published_at, status")
    .eq("id", id)
    .single();

  let publishedAt = existing?.published_at;
  if (status === "published" && !publishedAt) {
    publishedAt = new Date().toISOString();
  }

  const { error } = await supabase
    .from("posts")
    .update({
      ...result.data,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      throw new Error("Slug sudah digunakan.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/posts");
  revalidatePath("/berita");
  redirect("/admin/posts");
}

export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/posts");
  revalidatePath("/berita");
  redirect("/admin/posts");
}
