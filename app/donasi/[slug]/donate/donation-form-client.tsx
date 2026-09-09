"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPendingDonation } from "@/app/donasi/actions";
import { formatRupiah } from "@/lib/utils";
import { Loader2, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000];

interface DonationFormClientProps {
  campaignId: string;
  campaignTitle: string;
  campaignCategory: string | null;
  campaignImageUrl: string | null;
  campaignDescription: string | null;
}

export function DonationFormClient({
  campaignId,
  campaignTitle,
  campaignCategory,
  campaignImageUrl,
  campaignDescription,
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

  const handleSubmit = async () => {
    setError(null);
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
        setError(result.error || "Terjadi kesalahan.");
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
    <>
      {/* Mini Campaign Summary */}
      <section className="bg-white rounded-2xl shadow-md p-5 border border-outline-variant/20">
        <div className="flex gap-4 items-start">
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm bg-surface-container-high relative">
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
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full self-start mb-1">
              {campaignCategory || "Infaq Pembangunan"}
            </span>
            <h2 className="text-base font-bold leading-tight text-on-surface mb-1 line-clamp-2">
              {campaignTitle}
            </h2>
            {campaignDescription && (
              <p className="text-xs text-on-surface-variant line-clamp-2">
                {campaignDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Nominal Donasi */}
      <section className="bg-white rounded-2xl shadow-2xl p-6 border border-primary/10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-base font-bold text-on-surface mb-1">Pilih Nominal</h3>
        <p className="text-sm text-on-surface-variant mb-4">
          Pilih nominal donasi atau masukkan nominal lainnya.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleQuickAmount(val)}
              className={cn(
                "relative bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98] focus:ring-2 focus:ring-primary focus:border-transparent",
                !isCustom && amount === val && "bg-primary-container border-2 border-primary text-on-primary-container shadow-sm"
              )}
            >
              {val === 100000 && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-[10px]">
                  Populer
                </div>
              )}
              <span className={cn(
                "text-sm",
                !isCustom && amount === val ? "text-primary" : "text-on-surface-variant"
              )}>
                Rp
              </span>
              <span className={cn(
                "text-xl font-extrabold",
                !isCustom && amount === val ? "text-primary" : "text-on-surface"
              )}>
                {(val / 1000).toFixed(0)}.000
              </span>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-sm text-on-surface-variant font-semibold">Rp</span>
          </div>
          <input
            type="text"
            value={customAmount}
            onChange={handleCustomChange}
            placeholder="Nominal Lainnya"
            className="block w-full pl-12 pr-4 py-4 bg-surface rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-lg font-extrabold text-on-surface placeholder:text-outline/50 transition-shadow"
          />
        </div>

        <div className="mt-4 flex items-start gap-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant/30">
          <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-on-surface-variant">
            Transaksi 100% aman dan disalurkan langsung ke rekening resmi PPM Nurisba.
          </p>
        </div>
      </section>

      {/* Data Donatur */}
      <section className="bg-white rounded-2xl shadow-md p-6 border border-outline-variant/20 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-3">
          Data Donatur
        </h3>

        {error && (
          <div className="rounded-xl bg-danger-soft p-4 text-sm text-danger font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Nama */}
          <div>
            <label className="block text-sm text-on-surface-variant mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="block w-full px-4 py-3 bg-surface rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface transition-shadow placeholder:text-outline/50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-on-surface-variant mb-1.5">
              Email (Opsional)
            </label>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="Untuk bukti donasi"
              className="block w-full px-4 py-3 bg-surface rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface transition-shadow placeholder:text-outline/50"
            />
          </div>

          {/* Anonymous */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-surface cursor-pointer"
            />
            <label htmlFor="anonymous" className="text-sm text-on-surface cursor-pointer select-none">
              Sembunyikan nama saya (Hamba Allah)
            </label>
          </div>

          <div className="w-full h-px bg-outline-variant/20" />

          {/* Doa / Pesan */}
          <div>
            <label className="block text-sm text-on-surface-variant mb-1.5 flex justify-between">
              <span>Doa atau Dukungan (Opsional)</span>
              <span className="text-outline text-xs font-normal">{message.length}/150</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 150))}
              placeholder="Tulis doa untuk santri atau pesan dukungan..."
              rows={3}
              className="block w-full px-4 py-3 bg-surface rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface transition-shadow placeholder:text-outline/50 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Bottom Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-4 pt-4 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Total Donasi
            </span>
            <span className="text-xl font-extrabold text-primary">
              {formatRupiah(amount)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || amount < 10000}
            className="bg-cta hover:bg-cta/90 text-white text-sm font-semibold px-6 py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 flex-1 max-w-[200px] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Bayar Sekarang
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spacer for sticky CTA */}
      <div className="h-20" />
    </>
  );
}
