"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const expenseSchema = z.object({
  campaign_id: z.string().uuid("Campaign wajib dipilih"),
  amount: z.coerce.number().min(1, "Jumlah pengeluaran harus lebih dari 0"),
  description: z.string().min(3, "Deskripsi wajib diisi"),
  reference: z.string().optional().or(z.literal("")),
  transaction_date: z.string().min(1, "Tanggal transaksi wajib diisi"),
});

const reportSchema = z.object({
  title: z.string().min(3, "Judul laporan minimal 3 karakter"),
  description: z.string().optional(),
  period_start: z.string().min(1, "Tanggal mulai wajib diisi"),
  period_end: z.string().min(1, "Tanggal selesai wajib diisi"),
  document_url: z.string().url("URL dokumen PDF tidak valid").optional().or(z.literal("")),
  publish: z.boolean().default(false),
});

export async function createExpenseTransaction(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const rawData = {
    campaign_id: formData.get("campaign_id"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    reference: formData.get("reference"),
    transaction_date: formData.get("transaction_date"),
  };

  const result = expenseSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  // Enforce type = 'expense' strictly (admin cannot insert 'income')
  const { error } = await supabase.from("financial_transactions").insert({
    ...result.data,
    type: "expense",
    source: "admin_manual",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/transparency");
  revalidatePath("/transparansi");
  redirect("/admin/transparency");
}

export async function createTransparencyReport(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const publish = formData.get("publish") === "on";

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    period_start: formData.get("period_start"),
    period_end: formData.get("period_end"),
    document_url: formData.get("document_url") || null,
    publish,
  };

  const result = reportSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { error } = await supabase.from("transparency_reports").insert({
    title: result.data.title,
    description: result.data.description,
    period_start: result.data.period_start,
    period_end: result.data.period_end,
    document_url: result.data.document_url,
    published_at: result.data.publish ? new Date().toISOString() : null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/transparency");
  revalidatePath("/transparansi");
  redirect("/admin/transparency");
}

export async function deleteTransparencyReport(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("transparency_reports").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/transparency");
  revalidatePath("/transparansi");
  redirect("/admin/transparency");
}
