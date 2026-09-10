"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import {
  ArrowLeft,
  Home,
  Copy,
  Check,
  MessageCircle,
  Building2,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const WA_PHONE = "6282262893646";

const BANK_ACCOUNTS = [
  {
    bank: "BJB Syariah",
    number: "5010206156911",
    name: "Yayasan Nurul Ikhlas Soreang Bandung",
  },
  {
    bank: "BCA",
    number: "3460399296",
    name: "O. Dadan Farid",
  },
  {
    bank: "BRI",
    number: "054401040681501",
    name: "Tita Rosita",
  },
];

function ManualConfirmContent() {
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "manual_bank";
  const amount = Number(searchParams.get("amount") || "0");
  const donationId = searchParams.get("donationId") || "";
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isQRIS = method === "qris_manual";

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback for older browsers
    }
  };

  const waMessage = encodeURIComponent(
    `Assalamualaikum, saya sudah melakukan transfer donasi untuk PPM Nurisba.\n\nNominal: ${formatRupiah(amount)}\nMetode: ${isQRIS ? "QRIS" : "Transfer Bank"}\n\nMohon divergencekasi. Terima kasih.`,
  );
  const waLink = `https://wa.me/${WA_PHONE}?text=${waMessage}`;

  return (
    <>
      <Navbar />

      <main className="py-20 md:py-28 bg-background min-h-screen">
        <Container>
          <div className="max-w-lg mx-auto space-y-6">
            {/* Success Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">
                Donasi Tercatat
              </h1>
              <p className="text-sm text-text-secondary">
                Silakan lakukan pembayaran sesuai metode yang dipilih, lalu
                konfirmasi ke panitia via WhatsApp.
              </p>
            </div>

            {/* Amount Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-outline-variant/20 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                Nominal Donasi
              </p>
              <p className="text-3xl font-extrabold text-primary tabular-nums">
                {formatRupiah(amount)}
              </p>
              <p className="text-xs text-text-muted mt-2">
                ID: {donationId.slice(0, 8)}...
              </p>
            </div>

            {isQRIS ? (
              /* QRIS Manual Section */
              <div className="bg-white rounded-2xl shadow-md p-6 border border-outline-variant/20 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-text-primary">
                      QRIS Manual
                    </h2>
                    <p className="text-xs text-text-muted">
                      Yayasan Nurul Ikhlas Soreang Bandung
                    </p>
                  </div>
                </div>

                {/* QRIS Yayasan */}
                <div className="flex justify-center">
                  <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-white">
                    <Image
                      src="/Qris-Yayasan-PPM-Nurisba.jpeg"
                      alt="QRIS Yayasan Nurul Ikhlas"
                      width={1135}
                      height={1600}
                      className="h-auto w-full object-contain"
                      priority
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-warning-soft border border-warning/30 p-3.5 text-xs text-text-secondary leading-relaxed">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-warning">Catatan:</strong> QRIS
                      ini adalah QR statis milik yayasan. Masukkan nominal
                      donasi <strong>{formatRupiah(amount)}</strong> secara
                      manual saat scan.
                    </p>
                  </div>
                </div>

                <ol className="space-y-2.5 text-xs text-text-secondary list-decimal list-inside">
                  <li>Buka aplikasi e-wallet / mobile banking Anda.</li>
                  <li>
                    Pilih menu <strong>Scan QR</strong> / QRIS.
                  </li>
                  <li>Scan QR di atas.</li>
                  <li>
                    Masukkan nominal <strong>{formatRupiah(amount)}</strong>{" "}
                    secara manual.
                  </li>
                  <li>
                    Verifikasi bahwa penerima adalah{" "}
                    <strong>Yayasan Nurul Ikhlas Soreang Bandung</strong>.
                  </li>
                  <li>Selesaikan pembayaran.</li>
                </ol>
              </div>
            ) : (
              /* Manual Bank Transfer Section */
              <div className="bg-white rounded-2xl shadow-md p-6 border border-outline-variant/20 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-text-primary">
                      Transfer Bank Manual
                    </h2>
                    <p className="text-xs text-text-muted">
                      Pilih salah satu rekening di bawah ini
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {BANK_ACCOUNTS.map((account) => (
                    <div
                      key={account.bank}
                      className="rounded-xl border border-outline-variant/50 bg-surface p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-primary">
                          {account.bank}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(account.number, account.bank)
                          }
                          className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors min-h-[44px] px-2"
                        >
                          {copiedField === account.bank ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-success" />
                              Tersalin
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Salin
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono text-lg font-bold text-text-primary tracking-wide">
                        {account.number}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        a.n. {account.name}
                      </p>
                    </div>
                  ))}
                </div>

                <ol className="space-y-2 text-xs text-text-secondary list-decimal list-inside">
                  <li>Buka aplikasi mobile banking Anda.</li>
                  <li>
                    Pilih menu <strong>Transfer</strong>.
                  </li>
                  <li>
                    Masukkan nominal <strong>{formatRupiah(amount)}</strong>.
                  </li>
                  <li>Selesaikan transfer ke rekening yang dipilih.</li>
                </ol>
              </div>
            )}

            {/* WhatsApp Confirmation */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-outline-variant/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Konfirmasi ke Panitia
                  </h3>
                  <p className="text-xs text-text-muted">
                    Klik tombol di bawah untuk konfirmasi via WhatsApp
                  </p>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Sudah transfer? Konfirmasikan pembayaran Anda kepada panitia
                melalui WhatsApp agar transaksi dapat diverifikasi.
              </p>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 min-h-[44px]"
              >
                <MessageCircle className="h-5 w-5" />
                Konfirmasi via WhatsApp
              </a>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="outline">
                <Link href="/donasi">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Program
                </Link>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary-strong text-white"
              >
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

export function ManualConfirmClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ManualConfirmContent />
    </Suspense>
  );
}
