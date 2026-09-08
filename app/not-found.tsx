import Link from "next/link";
import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="py-24 sm:py-32 bg-background">
        <Container>
          <div className="mx-auto max-w-md text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
              <FileQuestion className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-sm text-text-secondary">
              Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
            </p>
            <div className="pt-4">
              <Button asChild className="bg-primary hover:bg-primary-strong text-white">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Beranda
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
