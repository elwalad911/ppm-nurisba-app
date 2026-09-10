"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global layout error:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center bg-[#f8f9f9] p-4">
        <div className="mx-auto max-w-md text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ffdad6] text-[#ef4444]">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1f2937]">
            Terjadi Kesalahan
          </h1>
          <p className="text-sm text-[#4b5563]">
            Sistem mengalami gangguan. Silakan coba muat ulang halaman.
          </p>
          <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => reset()} className="bg-[#00685f] hover:bg-[#00524b] text-white">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Beranda
              </Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
