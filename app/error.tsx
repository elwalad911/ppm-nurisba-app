"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Runtime application error:", error);
  }, [error]);

  return (
    <>
      <Navbar />

      <main className="py-24 sm:py-32 bg-background">
        <Container>
          <div className="mx-auto max-w-md text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-danger">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Terjadi Kesalahan Sistem
            </h1>
            <p className="text-sm text-text-secondary">
              Maaf, terjadi kendala saat memuat halaman ini. Silakan coba muat ulang.
            </p>
            <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={() => reset()}
                className="bg-primary hover:bg-primary-strong text-white"
              >
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
        </Container>
      </main>

      <Footer />
    </>
  );
}
