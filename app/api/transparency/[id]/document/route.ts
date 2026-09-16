import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  TRANSPARENCY_DOCS_BUCKET,
  DOCUMENT_SIGNED_URL_EXPIRES_SECONDS,
  isReportDocumentPath,
} from "@/lib/transparency/documents";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Public document access for published transparency reports.
 *
 * The `transparency-documents` bucket is private, so this server-side
 * route verifies publication + path ownership, then redirects to a
 * short-lived signed URL. Signed URLs are never stored anywhere.
 */
export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  // Public read: RLS admits only published reports to anon callers.
  const supabase = await createClient();
  const { data: report } = await supabase
    .from("transparency_reports")
    .select("id, document_url, published_at")
    .eq("id", id)
    .single();

  if (!report || !report.published_at) {
    return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  if (!report.document_url) {
    return NextResponse.json({ error: "Laporan ini tidak memiliki dokumen." }, { status: 404 });
  }

  if (!isReportDocumentPath(report.document_url, id)) {
    return NextResponse.json({ error: "Dokumen tidak valid." }, { status: 404 });
  }

  // Private bucket: signed URL minting requires the server-side
  // service-role client. Never exposed to the browser.
  const serviceSupabase = createServiceRoleClient();
  const { data, error } = await serviceSupabase.storage
    .from(TRANSPARENCY_DOCS_BUCKET)
    .createSignedUrl(report.document_url, DOCUMENT_SIGNED_URL_EXPIRES_SECONDS);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Dokumen tidak dapat diakses saat ini." }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}
