"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const campaignSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  description: z.string().optional(),
  category: z.string().default("Wakaf"),
  target_amount: z.coerce.number().min(1, "Target harus lebih dari 0"),
  image_url: z.string().optional(),
  status: z.enum(["draft", "active", "completed", "archived"]).default("active"),
  start_date: z.string().optional(),
  end_date: z.string().optional().or(z.literal("")),
});

export async function createCampaign(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    category: formData.get("category"),
    target_amount: formData.get("target_amount"),
    image_url: formData.get("image_url") || undefined,
    status: formData.get("status"),
    start_date: formData.get("start_date") || undefined,
    end_date: formData.get("end_date") || undefined,
  };

  const result = campaignSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { error } = await supabase.from("campaigns").insert(result.data);

  if (error) {
    if (error.code === "23505") {
      throw new Error("Slug sudah digunakan, gunakan slug lain.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns");
}

export async function updateCampaign(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    category: formData.get("category"),
    target_amount: formData.get("target_amount"),
    image_url: formData.get("image_url") || undefined,
    status: formData.get("status"),
    start_date: formData.get("start_date") || undefined,
    end_date: formData.get("end_date") || undefined,
  };

  const result = campaignSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { error } = await supabase
    .from("campaigns")
    .update({ ...result.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      throw new Error("Slug sudah digunakan, gunakan slug lain.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns");
}

export async function deleteCampaign(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("campaigns").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns");
}
