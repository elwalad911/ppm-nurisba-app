/**
 * Helpers for transparency report documents stored in the private
 * `transparency-documents` Storage bucket.
 *
 * Required object layout (mirrors the bucket RLS path guard):
 *   reports/{transparency_report_id}/{safe_filename}.pdf
 *
 * Pure functions only — safe to import from server components,
 * server actions, and API routes. Never import service-role here.
 */

export const TRANSPARENCY_DOCS_BUCKET = "transparency-documents";

/** Maximum PDF size accepted by the application (mirrors bucket limit). */
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

/** Signed URL lifetime for public downloads (seconds). */
export const DOCUMENT_SIGNED_URL_EXPIRES_SECONDS = 600;

const REPORT_DOC_PATH_RE =
  /^reports\/[0-9a-fA-F-]{36}\/[^/]+\.pdf$/i;

// Combining diacritical marks stripped after NFKD normalization.
const DIACRITICS_RE = /[\u0300-\u036f]/g;

/**
 * Normalize an uploader-provided filename into a safe Storage object name.
 * Strips directory components, diacritics and unsafe characters, and
 * always enforces a single `.pdf` suffix. Never trust raw user input.
 */
export function sanitizePdfFileName(rawName: string): string {
  const base =
    (rawName.split("/").pop() ?? "").split("\\").pop() ?? "";
  const withoutExt = base.replace(/\.pdf$/i, "");
  const slug = withoutExt
    .toLowerCase()
    .normalize("NFKD")
    .replace(DIACRITICS_RE, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "")
    .slice(0, 80);
  return `${slug || "dokumen"}.pdf`;
}

/** Build the required object path for a report document. */
export function buildDocumentPath(reportId: string, safeFileName: string): string {
  return `reports/${reportId}/${safeFileName}`;
}

/**
 * Validate that an object path is a transparency document belonging to
 * the given report. Rejects external URLs and foreign paths.
 */
export function isReportDocumentPath(
  objectPath: string,
  reportId: string
): boolean {
  if (!REPORT_DOC_PATH_RE.test(objectPath)) {
    return false;
  }
  return objectPath.toLowerCase().startsWith(`reports/${reportId.toLowerCase()}/`);
}

/** Extract the filename segment from a validated object path. */
export function extractFileName(objectPath: string): string {
  return objectPath.split("/").pop() ?? objectPath;
}
