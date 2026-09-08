import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung — alamat, WhatsApp, email, dan informasi kontak lainnya.",
};

export default function KontakPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        title="Kontak Kami"
        description="Silakan menghubungi panitia untuk informasi lebih lanjut mengenai PPM Nurisba."
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {/* WhatsApp */}
            <div className="flex flex-col items-start rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-soft text-success">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                WhatsApp
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Hubungi panitia melalui WhatsApp untuk informasi dan konfirmasi
                transfer.
              </p>
              <a
                href="https://wa.me/6282262893646"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-success px-5 text-sm font-medium text-white transition-colors hover:bg-success/90 active:scale-95"
              >
                <Phone className="h-4 w-4" />
                082262893646
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col items-start rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                Email
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Kirim pertanyaan atau informasi melalui email resmi yayasan.
              </p>
              <a
                href="mailto:nurulikhlassoreangbandung@gmail.com"
                className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium text-primary transition-colors hover:bg-primary-soft active:scale-95"
              >
                <Mail className="h-4 w-4" />
                nurulikhlassoreangbandung@gmail.com
              </a>
            </div>

            {/* Alamat */}
            <div className="flex flex-col items-start rounded-2xl border border-border bg-surface p-6 shadow-sm md:col-span-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cta-soft text-cta">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                Alamat Sekretariat
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                Perum Bumi Parahyangan Kencana
                <br />
                Jl. Bhayangkara Blok N 7 No. 10–12
                <br />
                RT. 01/RW. 24, Soreang
                <br />
                Bandung 40911, Jawa Barat
              </p>
            </div>

            {/* Peta Placeholder */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background p-8 text-center md:col-span-2">
              <MapPin className="h-10 w-10 text-text-muted" />
              <p className="mt-4 text-sm font-medium text-text-secondary">
                Peta lokasi akan tersedia.
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Integrasi peta akan dilakukan pada pengembangan selanjutnya.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
