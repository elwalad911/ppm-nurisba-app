"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  name: string;
  folder: "campaigns" | "posts" | "events" | "gallery";
  label?: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
  defaultValue?: string;
  className?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DEFAULT_MAX_SIZE_MB = 5;

export function ImageUpload({
  name,
  folder,
  label = "Gambar",
  required = false,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  defaultValue = "",
  className,
}: ImageUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">(defaultValue ? "upload" : "upload");
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return `Tipe file tidak didukung. Gunakan: JPG, PNG, atau WebP.`;
      }
      if (file.size > maxSizeBytes) {
        return `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.`;
      }
      return null;
    },
    [maxSizeBytes, maxSizeMB]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setUploading(true);

      try {
        const supabase = createClient();

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 10);
        const filePath = `${folder}/${timestamp}-${randomId}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
          throw new Error("Gagal mendapatkan URL gambar.");
        }

        setImageUrl(urlData.publicUrl);
        setPreview(urlData.publicUrl);
        setMode("upload");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengupload gambar.");
        setImageUrl("");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [folder, validateFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Show local preview immediately
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreview(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreview(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleRemove = useCallback(() => {
    setImageUrl("");
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (urlInputRef.current) urlInputRef.current.value = "";
  }, []);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setImageUrl(val);
    setPreview(val || null);
    setError(null);
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-semibold text-text-primary">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors",
            mode === "upload"
              ? "bg-primary text-white"
              : "bg-background text-text-secondary hover:bg-primary-soft"
          )}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors",
            mode === "url"
              ? "bg-primary text-white"
              : "bg-background text-text-secondary hover:bg-primary-soft"
          )}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          URL Manual
        </button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
            dragOver
              ? "border-primary bg-primary-soft"
              : "border-border bg-background hover:border-primary/50",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-text-secondary">Mengupload gambar...</p>
            </div>
          ) : preview ? (
            <div className="w-full space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-48 rounded-lg object-contain"
              />
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Ganti gambar
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs font-medium text-danger hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-2 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-10 w-10 text-text-muted" />
              <p className="text-sm font-medium text-text-secondary">
                Klik atau seret gambar ke sini
              </p>
              <p className="text-xs text-text-muted">
                JPG, PNG, WebP. Maksimal {maxSizeMB}MB.
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <input
          ref={urlInputRef}
          type="url"
          name={name}
          defaultValue={imageUrl}
          onChange={handleUrlChange}
          placeholder="https://example.com/gambar.jpg"
          className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      )}

      {/* Hidden input to submit the URL value via form */}
      {mode === "upload" && (
        <input type="hidden" name={name} value={imageUrl} />
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
