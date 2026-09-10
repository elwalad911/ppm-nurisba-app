"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="mx-auto max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ffdad6] text-[#ef4444]">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1f2937]">
          Gagal Memuat Data
        </h1>
        <p className="text-sm text-[#4b5563]">
          Terjadi kesalahan saat memuat halaman admin. Silakan coba lagi.
        </p>
        <div className="pt-4">
          <Button
            onClick={() => reset()}
            className="bg-[#00685f] hover:bg-[#00524b] text-white"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
