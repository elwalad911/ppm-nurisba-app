"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { User, Mail, Save, Loader2, CheckCircle2 } from "lucide-react";

interface DonorProfileClientProps {
  profile: {
    name: string;
    email?: string | null;
  };
}

export function DonorProfileClient({ profile }: DonorProfileClientProps) {
  const [name, setName] = useState(profile.name || "");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("Sesi tidak valid.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setSuccessMessage("Profil berhasil diperbarui.");
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Profil Saya
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Kelola informasi akun donatur Anda.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-success-soft p-4 text-sm text-success font-medium">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl bg-danger-soft p-4 text-sm text-danger font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Nama Lengkap
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
              <User className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Email (Terdaftar)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              value={profile.email || ""}
              disabled
              className="flex h-11 w-full rounded-xl border border-border bg-border/40 pl-10 pr-4 text-sm text-text-muted cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-xs text-text-muted">Email akun tidak dapat diubah langsung.</p>
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary-strong text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
