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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    // Join via payments order_id is handled if we query payments or filter
    const { data: paymentData } = await supabase
      .from("payments")
      .select("donation_id")
      .eq("order_id", orderId)
      .single();

    if (paymentData) {
      query = query.eq("id", paymentData.donation_id);
    } else {
      query = query.eq("id", "00000000-0000-0000-0000-000000000000"); // no match
    }
  } else {
    query = query.eq("id", "00000000-0000-0000-0000-000000000000");
  }

  const { data: donation } = await query.single();

  const status = donation?.status || "pending";
  const campaign = donation?.campaigns;
  const payment = donation?.payments?.[0];

  return (
    <>
      <Navbar />

      <main className="py-16 sm:py-24 bg-background">
        <Container>
          <div className="mx-auto max-w-lg rounded-2xl border border-outline-variant/20 bg-white p-8 text-center shadow-2xl">
            {/* SUCCESS STATE */}
            {status === "success" && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success mb-6">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Pembayaran Berhasil
                </h1>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Jazakumullah Khairan Katsiran. Semoga wakaf dan sedekah Anda
                  menjadi amal jariyah yang terus mengalir manfaatnya.
                </p>

                {donation && (
                  <div className="my-6 rounded-xl bg-background p-4 text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Nominal:</span>
                      <span className="font-bold text-primary tabular-nums">
                        {formatRupiah(donation.amount)}
                      </span>
                    </div>
                    {campaign && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Program:</span>
                        <span className="font-medium text-text-primary text-right line-clamp-1 max-w-[200px]">
                          {campaign.title}
                        </span>
                      </div>
                    )}
                    {payment && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Order ID:</span>
                        <span className="font-mono text-xs text-text-primary">
                          {payment.order_id}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Button asChild className="w-full bg-primary hover:bg-primary-strong text-white">
                    <Link href="/donasi">
                      Kembali ke Program Donasi
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">
                      <Home className="h-4 w-4 mr-2" />
                      Beranda
                    </Link>
                  </Button>
                </div>
              </>
            )}

            {/* PENDING STATE */}
            {status === "pending" && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning-soft text-warning mb-6">
                  <Clock className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Menunggu Pembayaran
                </h1>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Donasi Anda sudah tercatat. Metode pembayaran online sedang dalam proses penyiapan.
                  Silakan kembali beberapa saat lagi atau hubungi kami untuk konfirmasi manual.
                </p>

                {payment && (
                  <div className="my-6 rounded-xl bg-background p-4 text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Order ID:</span>
                      <span className="font-mono text-xs text-text-primary">
                        {payment.order_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Jumlah:</span>
                      <span className="font-bold text-primary tabular-nums">
                        {formatRupiah(payment.gross_amount)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {campaign && (
                    <Button asChild className="w-full bg-cta hover:bg-cta/90 text-white">
                      <Link href={`/donasi/${campaign.slug}`}>
                        Kembali ke Campaign
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/donasi">Lihat Program Lain</Link>
                  </Button>
                </div>
              </>
            )}

            {/* FAILED / EXPIRED STATE */}
            {(status === "failed" || status === "expired") && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-danger mb-6">
                  {status === "expired" ? (
                    <AlertTriangle className="h-10 w-10" />
                  ) : (
                    <XCircle className="h-10 w-10" />
                  )}
                </div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {status === "expired" ? "Pembayaran Kadaluarsa" : "Pembayaran Gagal"}
                </h1>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Maaf, transaksi Anda belum berhasil atau telah melewati batas waktu pembayaran.
                </p>

                <div className="mt-8 space-y-3">
                  {campaign && (
                    <Button asChild className="w-full bg-cta hover:bg-cta/90 text-white">
                      <Link href={`/donasi/${campaign.slug}/donate`}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Ulangi Donasi
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/donasi">Kembali ke Program</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
