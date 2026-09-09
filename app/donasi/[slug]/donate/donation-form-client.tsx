"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPendingDonation } from "@/app/donasi/actions";
import { formatRupiah } from "@/lib/utils";
import {
  Loader2,
  Heart,
  ArrowRight,
  AlertCircle,
  Lock,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000];

interface DonationFormClientProps {
  campaignId: string;
  campaignTitle: string;
  campaignCategory: string | null;
  campaignImageUrl: string | null;
  campaignDescription: string | null;
  campaignTargetAmount: number;
  campaignCurrentAmount: number;
}

export function DonationFormClient({
  campaignId,
  campaignTitle,
  campaignCategory,
  campaignImageUrl,
  campaignDescription,
  campaignTargetAmount,
  campaignCurrentAmount,
}: DonationFormClientProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>("100000");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const percentage = campaignTargetAmount > 0
    ? Math.min(Math.round((campaignCurrentAmount / campaignTargetAmount) * 100), 100)
    : 0;

  const handleQuickAmount = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
    setIsCustom(false);
    setError(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmount(val);
    const num = Number(val);
    setAmount(isNaN(num) ? 0 : num);
    setIsCustom(true);
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (amount < 10000) {
      setError("Nominal donasi minimal adalah Rp 10.000");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPendingDonation({
        campaign_id: campaignId,
        amount,
        donor_name: isAnonymous ? "Hamba Allah" : donorName || "Hamba Allah",
        donor_email: donorEmail,
        is_anonymous: isAnonymous,
        message,
      });

      if (!result.success) {
        setError(result.error || "Terjadi kesalahan saat memproses donasi.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/donasi/result?donationId=${result.donationId}&orderId=${result.orderId}`);
    } catch {
      setError("Gagal terhubung ke server. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 1. Mini Campaign Summary Card */}
      <section className="bg-white rounded-2xl shadow-md p-5 border border-outline-variant/20 flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-xs bg-surface-container-high relative">
          {campaignImageUrl ? (
            <Image
              src={campaignImageUrl}
              alt={campaignTitle}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-primary/20">
              <Heart className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex-1 w-full">
          <span className="inline-flex items-center gap-1 bg-primary-soft text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
            {campaignCategory || "Wakaf Pembangunan"}
          </span>
          <h1 className="text-base sm:text-lg font-bold text-on-surface mb-1 leading-snug line-clamp-2">
            {campaignTitle}
          </h1>
          {campaignDescription && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-2">
              {campaignDescription}
            </p>
          )}
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-primary font-bold">
              Terkumpul: {formatRupiah(campaignCurrentAmount)}
            </span>
            <span className="text-text-muted">
              dari {formatRupiah(campaignTargetAmount)}
            </span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </section>

      {/* Error Alert State */}
      {error && (
        <div className="bg-danger-soft border-2 border-danger text-danger rounded-2xl p-4 flex items-start gap-3 text-sm font-medium animate-shake">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Periksa Kembali Input Anda</p>
            <p className="text-xs text-danger/90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Form Card Container */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-outline-variant/20 flex flex-col gap-8">
        {/* 2. Nominal Donasi Section */}
        <section>
          <h2 className="text-base sm:text-lg font-bold text-on-surface mb-4 border-b border-border pb-2">
            1. Pilih Nominal Donasi
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {QUICK_AMOUNTS.map((val) => {
              const isSelected = !isCustom && amount === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className={cn(
                    "relative h-12 rounded-xl border text-sm font-bold transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95",
                    isSelected
                      ? "bg-primary-soft text-primary border-2 border-primary shadow-xs"
                      : "bg-surface border-outline-variant/50 text-on-surface hover:bg-surface-container"
                  )}
                >
                  {val === 100000 && (
                    <span className="absolute -top-2 right-2 bg-cta text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      Populer
                    </span>
                  )}
                  {formatRupiah(val)}
                </button>
              );
            })}
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface-variant">
              Atau masukkan nominal lainnya
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sm font-bold text-on-surface-variant">
                Rp
              </span>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomChange}
                placeholder="0"
                className={cn(
                  "block w-full pl-12 pr-4 h-12 rounded-xl bg-surface border text-base font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
                  error && amount < 10000 ? "border-danger bg-danger-soft/20" : "border-outline-variant"
                )}
              />
            </div>
            <p className="text-[11px] text-text-muted">Minimum donasi adalah Rp 10.000</p>
          </div>
        </section>

        {/* 3. Data Donatur Section */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-on-surface mb-2 border-b border-border pb-2">
            2. Data Donatur
          </h2>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Masukkan nama Anda"
              disabled={isAnonymous}
              className="block w-full px-4 h-11 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface placeholder:text-text-muted transition-all disabled:opacity-50 disabled:bg-surface-container"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Email (Opsional untuk bukti donasi)
            </label>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="nama@email.com"
              className="block w-full px-4 h-11 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface placeholder:text-text-muted transition-all"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group py-1">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded border-2 border-outline-variant peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">
              Sembunyikan nama saya (Tulis sebagai &ldquo;Hamba Allah&rdquo;)
            </span>
          </label>
        </section>

        {/* 4. Doa & Dukungan Section */}
        <section className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-base sm:text-lg font-bold text-on-surface">
              3. Doa &amp; Dukungan (Opsional)
            </h2>
            <span className="text-xs text-text-muted font-mono">{message.length}/150</span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 150))}
            placeholder="Tuliskan doa untuk santri atau pesan dukungan Anda..."
            rows={3}
            className="block w-full p-3.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface placeholder:text-text-muted resize-none transition-all"
          />
        </section>

        {/* 5. Payment Summary & Submit Action */}
        <section className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Total Donasi
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-primary tabular-nums">
              {formatRupiah(amount)}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || amount < 10000}
            className="w-full h-12 bg-cta hover:bg-cta-strong text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Memproses Pembayaran...</span>
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted text-center pt-1">
            <Lock className="h-3.5 w-3.5 text-success" />
            <span>Pembayaran aman &amp; terverifikasi oleh Yayasan Nurul Ikhlas.</span>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar for Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-md border-t border-outline-variant/30 p-4 shadow-[0_-4px_15px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
              Total Donasi
            </span>
            <span className="text-lg font-extrabold text-primary tabular-nums">
              {formatRupiah(amount)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || amount < 10000}
            className="bg-cta hover:bg-cta-strong text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 flex-1 max-w-[200px] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Bayar Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </form>
  );
}
