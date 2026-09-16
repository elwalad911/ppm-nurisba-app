"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  uploadTransparencyDocument,
  deleteTransparencyDocument,
  type DocumentActionState,
} from "./actions";
import { ConfirmSubmitButton } from "./confirm-submit-button";
import {
  extractFileName,
  isReportDocumentPath,
  MAX_DOCUMENT_BYTES,
} from "@/lib/transparency/documents";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Trash2, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_MB = MAX_DOCUMENT_BYTES / 1024 / 1024;

function UploadSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary-strong text-white disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Mengunggah...</span>
        </>
      ) : (
        <>
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </>
      )}
    </Button>
  );
}

interface DocumentManagerProps {
  reportId: string;
  documentPath: string | null;
}

export function DocumentManager({ reportId, documentPath }: DocumentManagerProps) {
  const [state, formAction] = useActionState<DocumentActionState, FormData>(
    uploadTransparencyDocument.bind(null, reportId),
    {}
  );
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isStorageDoc = !!documentPath && isReportDocumentPath(documentPath, reportId);
  const isExternalUrl =
    !!documentPath && !isStorageDoc && /^https?:\/\//i.test(documentPath);

  const handleDelete = deleteTransparencyDocument.bind(null, reportId);

  return (
    <div className="mt-4 rounded-xl border border-border bg-background p-4 space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
        Dokumen PDF
      </p>

      {isStorageDoc ? (
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-mono text-xs text-text-primary break-all">
            {extractFileName(documentPath)}
          </span>
        </div>
      ) : isExternalUrl ? (
        <a
          href={documentPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Tautan eksternal
        </a>
      ) : (
        <p className="text-xs text-text-muted">Belum ada dokumen</p>
      )}

      <form action={formAction} className="space-y-2.5">
        <label className="block text-xs font-semibold text-text-primary">
          {isStorageDoc ? "Ganti Dokumen" : "Upload Laporan PDF"}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          name="document"
          accept="application/pdf,.pdf"
          required
          onChange={(e) => {
            const file = e.target.files?.[0];
            setClientError(null);
            if (!file) {
              setSelectedName(null);
              return;
            }
            setSelectedName(file.name);
            if (file.size > MAX_DOCUMENT_BYTES) {
              setClientError(`Ukuran file terlalu besar. Maksimal ${MAX_MB} MB.`);
            }
          }}
          className={cn(
            "block w-full text-xs text-text-secondary",
            "file:mr-3 file:rounded-lg file:border file:border-border file:bg-surface",
            "file:px-3 file:py-2 file:text-xs file:font-semibold file:text-text-primary",
            "hover:file:bg-primary-soft cursor-pointer"
          )}
        />
        {selectedName && (
          <p className="text-xs text-text-secondary">
            Dipilih: <span className="font-mono">{selectedName}</span>
          </p>
        )}
        <p className="text-[11px] text-text-muted">
          PDF saja, maksimal {MAX_MB} MB.
        </p>
        {clientError && <p className="text-xs text-danger">{clientError}</p>}
        {state.error && <p className="text-xs text-danger">{state.error}</p>}
        {state.warning && <p className="text-xs text-warning">{state.warning}</p>}
        {state.success && (
          <p className="text-xs text-success">
            Dokumen berhasil diunggah{state.filename ? ` (${state.filename}).` : "."}
          </p>
        )}
        <UploadSubmitButton />
      </form>

      {isStorageDoc && (
        <form action={handleDelete}>
          <ConfirmSubmitButton
            variant="outline"
            size="sm"
            title="Hapus dokumen"
            confirmMessage="Hapus dokumen PDF laporan ini? Tindakan ini tidak dapat dibatalkan."
            className="border-danger text-danger hover:bg-danger-soft"
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Dokumen</span>
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
