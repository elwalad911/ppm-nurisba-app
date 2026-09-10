import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Home,
  RefreshCcw,
  Receipt,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hasil Donasi",
  description: "Status transaksi donasi Anda untuk PPM Nurisba.",
};

interface PageProps {
  searchParams: Promise<{ donationId?: string; orderId?: string }>;
}

export const revalidate = 0;

export default async function DonationResultPage({ searchParams }: PageProps) {
  const { donationId, orderId } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("donations")
    .select("*, payments(*), campaigns(title, slug)");

  if (donationId) {
    query = query.eq("id", donationId);
  } else if (orderId) {
    const { data: paymentData } = await supabase
      .from("payments")
      .select("donation_id")
      .eq("order_id", orderId)
      .single();

    if (paymentData) {
      query = query.eq("id", paymentData.donation_id);
    } else {
      query = query.eq("id", "00000000-0000-0000-0000-000000000000");
    }
  } else {
    query = query.eq("id", "00000000-0000-0000-0000-000000000000");
  }

  const { data: donation } = await query.single();

  const status = donation?.status || "pending";
  const campaign = donation?.campaigns;
  const payment = donation?.payments?.[0];
  const formattedDate = donation?.created_at
    ? new Date(donation.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 flex items-center justify-center min-h-[calc(100vh-72px)] bg-background">
        <Container>
          <div className="max-w-xl w-full mx-auto">
            {/* SUCCESS STATE */}
            {status === "success" && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden border border-outline-variant/20">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-success-soft/50 to-transparent pointer-events-none" />

                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-success-soft text-success rounded-full flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3">
                  Pembayaran Berhasil
                </h1>
                <p className="text-sm sm:text-base text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
                  Jazakumullah Khairan Katsiran. Donasi Anda telah kami terima dan akan disalurkan sesuai amanah.
                </p>

                {/* Details Card */}
                <div className="bg-surface-container-low rounded-xl p-5 sm:p-6 text-left mb-8 border border-outline-variant/30 space-y-3">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-primary" />
                    Rincian Donasi
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm border-b border-border pb-2.5 gap-1">
                    <span className="text-text-secondary">Nomor Referensi</span>
                    <span className="font-bold text-on-surface font-mono">
                      #{payment?.order_id || donation?.id?.slice(0, 8)}
                    </span>
                  </div>

                  {campaign && (
                    <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm border-b border-border pb-2.5 gap-1">
                      <span className="text-text-secondary">Program</span>
                      <span className="font-semibold text-on-surface sm:text-right max-w-[280px]">
                        {campaign.title}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm border-b border-border pb-2.5 gap-1">
                    <span className="text-text-secondary">Tanggal Transaksi</span>
                    <span className="font-medium text-on-surface">{formattedDate}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                    <span className="text-text-secondary font-medium">Total Nominal</span>
                    <span className="font-extrabold text-primary text-lg tabular-nums">
                      {formatRupiah(donation?.amount || 0)}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/donasi"
                    className="w-full sm:w-auto px-6 h-12 bg-primary hover:bg-primary-strong text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Program Lainnya</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/"
                    className="w-full sm:w-auto px-6 h-12 border border-outline-variant text-on-surface hover:bg-surface-container font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Kembali ke Beranda</span>
                  </Link>
                </div>
              </div>
            )}

            {/* PENDING STATE */}
            {status === "pending" && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden border border-outline-variant/20">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-warning-soft/50 to-transparent pointer-events-none" />

                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-warning-soft text-warning rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    <Clock className="h-10 w-10" />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3">
                  Menunggu Pembayaran
                </h1>
                <p className="text-sm sm:text-base text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
                  Donasi Anda telah kami catat. Metode pembayaran online sedang dalam proses penyiapan.
                  Silakan kembali beberapa saat lagi atau hubungi kami untuk konfirmasi manual.
                </p>

                {/* Details Card */}
                <div className="bg-surface-container-low rounded-xl p-5 sm:p-6 text-left mb-8 border border-outline-variant/30 space-y-3">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-primary" />
                    Rincian Transaksi
                  </h3>

                  <div className="flex justify-between items-center text-xs sm:text-sm border-b border-border pb-2.5">
                    <span className="text-text-secondary">Order ID</span>
                    <span className="font-bold text-on-surface font-mono">
                      #{payment?.order_id || donation?.id?.slice(0, 8) || "NURRISBA-PENDING"}
                    </span>
                  </div>

                  {campaign && (
                    <div className="flex justify-between items-start text-xs sm:text-sm border-b border-border pb-2.5 gap-2">
                      <span className="text-text-secondary">Program</span>
                      <span className="font-semibold text-on-surface text-right max-w-[240px]">
                        {campaign.title}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                    <span className="text-text-secondary font-medium">Jumlah Donasi</span>
                    <span className="font-extrabold text-primary text-lg tabular-nums">
                      {formatRupiah(payment?.gross_amount || donation?.amount || 0)}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {campaign && (
                    <Link
                      href={`/donasi/${campaign.slug}`}
                      className="w-full sm:w-auto px-6 h-12 bg-cta hover:bg-cta-strong text-text-primary font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>Kembali ke Campaign</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href="/donasi"
                    className="w-full sm:w-auto px-6 h-12 border border-outline-variant text-on-surface hover:bg-surface-container font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Lihat Program Lain</span>
                  </Link>
                </div>
              </div>
            )}

            {/* FAILED STATE */}
            {status === "failed" && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden border border-outline-variant/20">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-danger-soft/50 to-transparent pointer-events-none" />

                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-danger-soft text-danger rounded-full flex items-center justify-center shadow-xs">
                    <XCircle className="h-10 w-10" />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3">
                  Pembayaran Belum Berhasil
                </h1>
                <p className="text-sm sm:text-base text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
                  Mohon maaf, transaksi Anda tidak dapat diproses saat ini. Silakan coba kembali atau gunakan metode pembayaran lain.
                </p>

                {/* Details Card */}
                <div className="bg-surface-container-low rounded-xl p-5 sm:p-6 text-left mb-8 border border-outline-variant/30 space-y-3">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-danger" />
                    Detail Transaksi
                  </h3>

                  <div className="flex justify-between items-center text-xs sm:text-sm border-b border-border pb-2.5">
                    <span className="text-text-secondary">Nomor Referensi</span>
                    <span className="font-bold text-on-surface font-mono">
                      #{payment?.order_id || donation?.id?.slice(0, 8)}
                    </span>
                  </div>

                  {campaign && (
                    <div className="flex justify-between items-start text-xs sm:text-sm border-b border-border pb-2.5 gap-2">
                      <span className="text-text-secondary">Program Donasi</span>
                      <span className="font-semibold text-on-surface text-right max-w-[240px]">
                        {campaign.title}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                    <span className="text-text-secondary font-medium">Jumlah Donasi</span>
                    <span className="font-extrabold text-on-surface text-lg tabular-nums">
                      {formatRupiah(donation?.amount || 0)}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {campaign && (
                    <Link
                      href={`/donasi/${campaign.slug}/donate`}
                      className="w-full sm:w-auto px-6 h-12 bg-cta hover:bg-cta-strong text-text-primary font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      <span>Ulangi Donasi</span>
                    </Link>
                  )}
                  <Link
                    href="/donasi"
                    className="w-full sm:w-auto px-6 h-12 border border-outline-variant text-on-surface hover:bg-surface-container font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Kembali ke Program</span>
                  </Link>
                </div>
              </div>
            )}

            {/* EXPIRED STATE */}
            {status === "expired" && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden border border-outline-variant/20">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-surface-container text-text-muted rounded-full flex items-center justify-center shadow-xs">
                    <AlertTriangle className="h-10 w-10 text-warning" />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3">
                  Pembayaran Telah Kedaluwarsa
                </h1>
                <p className="text-sm sm:text-base text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
                  Batas waktu pembayaran untuk transaksi ini telah habis. Silakan buat donasi baru untuk melanjutkan dukungan Anda.
                </p>

                {/* Details Card */}
                <div className="bg-surface-container-low rounded-xl p-5 sm:p-6 text-left mb-8 border border-outline-variant/30 space-y-3">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-primary" />
                    Rincian Transaksi
                  </h3>

                  <div className="flex justify-between items-center text-xs sm:text-sm border-b border-border pb-2.5">
                    <span className="text-text-secondary">Nomor Referensi</span>
                    <span className="font-bold text-on-surface font-mono">
                      #{payment?.order_id || donation?.id?.slice(0, 8)}
                    </span>
                  </div>

                  {campaign && (
                    <div className="flex justify-between items-start text-xs sm:text-sm border-b border-border pb-2.5 gap-2">
                      <span className="text-text-secondary">Program</span>
                      <span className="font-semibold text-on-surface text-right max-w-[240px]">
                        {campaign.title}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                    <span className="text-text-secondary font-medium">Nominal</span>
                    <span className="font-extrabold text-primary text-lg tabular-nums">
                      {formatRupiah(donation?.amount || 0)}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {campaign && (
                    <Link
                      href={`/donasi/${campaign.slug}/donate`}
                      className="w-full sm:w-auto px-6 h-12 bg-cta hover:bg-cta-strong text-text-primary font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Donasi Lagi</span>
                    </Link>
                  )}
                  <Link
                    href="/"
                    className="w-full sm:w-auto px-6 h-12 border border-outline-variant text-on-surface hover:bg-surface-container font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Kembali ke Beranda</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
