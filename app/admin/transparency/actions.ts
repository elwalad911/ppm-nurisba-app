"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import {
  TRANSPARENCY_DOCS_BUCKET,
  MAX_DOCUMENT_BYTES,
  sanitizePdfFileName,
  buildDocumentPath,
  isReportDocumentPath,
} from "@/lib/transparency/documents";
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

// Edit form never controls publication state — published_at stays
// server-controlled via publish/unpublish actions below.
const reportEditSchema = reportSchema.omit({ publish: true });

function assertValidPeriod(period_start: string, period_end: string): void {
  // YYYY-MM-DD strings compare lexicographically in chronological order.
  if (period_end < period_start) {
    throw new Error("Tanggal selesai tidak boleh lebih awal dari tanggal mulai.");
  }
}

export async function createExpenseTransaction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  await requireAdmin(supabase);

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
  await requireAdmin(supabase);
  const publish = formData.get("publish") === "on";

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    period_start: formData.get("period_start"),
    period_end: formData.get("period_end"),
    document_url: formData.get("document_url") || undefined,
    publish,
  };

  const result = reportSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  assertValidPeriod(result.data.period_start, result.data.period_end);

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
  await requireAdmin(supabase);

  // Best-effort cleanup of the associated Storage document so deleting a
  // report does not orphan its PDF. A failed cleanup is logged but does
  // not block the row deletion.
  const { data: report } = await supabase
    .from("transparency_reports")
    .select("document_url")
    .eq("id", id)
    .single();

  if (report?.document_url && isReportDocumentPath(report.document_url, id)) {
    const { error: removeError } = await supabase.storage
      .from(TRANSPARENCY_DOCS_BUCKET)
      .remove([report.document_url]);
    if (removeError) {
      console.error(
        `[transparency] Failed to cleanup document ${report.document_url} for deleted report ${id}: ${removeError.message}`
      );
    }
  }

  const { error } = await supabase.from("transparency_reports").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/transparency");
  revalidatePath("/transparansi");
  redirect("/admin/transparency");
}

export async function updateTransparencyReport(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  await requireAdmin(supabase);

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    period_start: formData.get("period_start"),
    period_end: formData.get("period_end"),
    document_url: formData.get("document_url") || undefined,
  };

  const result = reportEditSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  assertValidPeriod(result.data.period_start, result.data.period_end);

  // published_at is intentionally NOT updatable here — publication state
  // is controlled exclusively by publish/unpublish actions below.
  const { error } = await supabase
    .from("transparency_reports")
    .update({ ...result.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/transparency");
  revalidatePath("/transparansi");
  redirect("/admin/transparency");
}

export async function publishTransparencyReport(id: string): Promise<void> {
  const supabase = await createClient();
  await requireAdmin(supabase);

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("transparency_reports")
    .update({ published_at: now, updated_at: now })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/transparency");
  revalidatePath("/transparansi");
  redirect("/admin/transparency");
}

export async function unpublishTransparencyReport(id: string): Promise<void> {
  const supabase = await createClient();
  await requireAdmin(supabase);

  const { error } = await supabase
    .from("transparency_reports")
    .update({ published_at: null, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/transparency");
  revalidatePath("/transparansi");
  redirect("/admin/transparency");
}

export interface DocumentActionState {
  error?: string;
  warning?: string;
  success?: boolean;
  filename?: string;
}

const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"

async function hasPdfSignature(file: File): Promise<boolean> {
  try {
    const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    if (head.length < 5) return false;
    return PDF_MAGIC.every((b, i) => head[i] === b);
  } catch {
    return false;
  }
}

/**
 * Upload (or replace) the PDF document of a transparency report.
 *
 * Uses the admin-scoped server client throughout, so the
 * `transparency-documents` bucket RLS (authenticated + is_admin + path
 * guard) evaluates normally. No service_role involved.
 *
 * Returns a state object (useActionState-compatible) instead of throwing,
 * so the form can display inline Indonesian feedback.
 */
export async function uploadTransparencyDocument(
  reportId: string,
  _prevState: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  const supabase = await createClient();

  try {
    await requireAdmin(supabase);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Sesi tidak valid. Silakan login ulang." };
  }

  if (!z.string().uuid("ID laporan tidak valid.").safeParse(reportId).success) {
    return { error: "ID laporan tidak valid." };
  }

  const { data: report } = await supabase
    .from("transparency_reports")
    .select("id, document_url")
    .eq("id", reportId)
    .single();

  if (!report) {
    return { error: "Laporan tidak ditemukan." };
  }

  const file = formData.get("document");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Pilih file PDF terlebih dahulu." };
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    return { error: "Ukuran file terlalu besar. Maksimal 10 MB." };
  }
  if (file.type !== "application/pdf" || !/\.pdf$/i.test(file.name)) {
    return { error: "Tipe file tidak didukung. Gunakan file PDF (.pdf)." };
  }
  if (!(await hasPdfSignature(file))) {
    return { error: "File bukan dokumen PDF yang valid." };
  }

  const objectPath = buildDocumentPath(reportId, sanitizePdfFileName(file.name));

  const { error: uploadError } = await supabase.storage
    .from(TRANSPARENCY_DOCS_BUCKET)
    .upload(objectPath, file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    if (
      uploadError.message.includes("row-level security") ||
      uploadError.message.includes("Unauthorized") ||
      uploadError.message.includes("permission")
    ) {
      return { error: "Anda tidak memiliki izin untuk mengunggah dokumen. Pastikan akun Anda adalah admin." };
    }
    if (uploadError.message.includes("already exists") || uploadError.message.includes("Duplicate")) {
      return { error: "File dengan nama tersebut sudah ada. Ganti nama file atau hapus dokumen lama terlebih dahulu." };
    }
    return { error: `Gagal mengunggah dokumen: ${uploadError.message}` };
  }

  const previousPath = report.document_url;

  const { error: dbError } = await supabase
    .from("transparency_reports")
    .update({ document_url: objectPath, updated_at: new Date().toISOString() })
    .eq("id", reportId);

  if (dbError) {
    // DB update failed after upload — remove the new object so no orphan remains.
    const { error: cleanupError } = await supabase.storage
      .from(TRANSPARENCY_DOCS_BUCKET)
      .remove([objectPath]);
    if (cleanupError) {
      console.error(
        `[transparency] ORPHANED DOCUMENT: uploaded ${objectPath} but DB update failed (${dbError.message}); cleanup also failed (${cleanupError.message}).`
      );
      return {
        error: `Database gagal diperbarui dan file yatim mungkin tertinggal di Storage (${objectPath}). Hubungi pengelola sistem.`,
      };
    }
    return { error: `Gagal menyimpan referensi dokumen: ${dbError.message}` };
  }

  // Replace flow: remove the previous object only after the new document
  // is safely stored and referenced. A failed old-object removal is
  // reported as a warning, not a failure.
  let warning: string | undefined;
  if (previousPath && previousPath !== objectPath && isReportDocumentPath(previousPath, reportId)) {
    const { error: removeOldError } = await supabase.storage
      .from(TRANSPARENCY_DOCS_BUCKET)
      .remove([previousPath]);
    if (removeOldError) {
      console.error(
        `[transparency] Failed to remove replaced document ${previousPath}: ${removeOldError.message}`
      );
      warning = "Dokumen baru tersimpan, tetapi dokumen lama gagal dihapus. Periksa Storage secara manual.";
    }
  }

  revalidatePath("/admin/transparency");
  revalidatePath("/transparansi");
  return {
    success: true,
    filename: objectPath.split("/").pop(),
    ...(warning ? { warning } : {}),
  };
}

/**
 * Delete the PDF document of a transparency report and clear its reference.
 * Never accepts an object path from the browser — the path is read from
 * the database and validated against the required layout before deletion.
 */
export async function deleteTransparencyDocument(reportId: string): Promise<void> {
  const supabase = await createClient();
  await requireAdmin(supabase);

  if (!z.string().uuid("ID laporan tidak valid.").safeParse(reportId).success) {
    throw new Error("ID laporan tidak valid.");
  }

  const { data: report } = await supabase
    .from("transparency_reports")
    .select("id, document_url")
    .eq("id", reportId)
    .single();

  if (!report) {
    throw new Error("Laporan tidak ditemukan.");
  }
  if (!report.document_url) {
    throw new Error("Laporan ini tidak memiliki dokumen.");
  }
  if (!isReportDocumentPath(report.document_url, reportId)) {
    throw new Error("Dokumen bukan file Storage yang valid untuk laporan ini.");
  }

  const objectPath = report.document_url;
  const { error: removeError } = await supabase.storage
    .from(TRANSPARENCY_DOCS_BUCKET)
    .remove([objectPath]);

  if (removeError) {
    throw new Error(`Gagal menghapus dokumen: ${removeError.message}`);
  }

  const { error: dbError } = await supabase
    .from("transparency_reports")
    .update({ document_url: null, updated_at: new Date().toISOString() })
    .eq("id", reportId);

  if (dbError) {
    // Object is gone but the reference remains — report explicitly.
    throw new Error(
      `File terhapus dari Storage tetapi database gagal diperbarui (path: ${objectPath}). Hubungi pengelola sistem.`
    );
  }

  revalidatePath("/admin/transparency");
  revalidatePath("/transparansi");
  redirect("/admin/transparency");
}
